import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { buildData } from './build-data.js';
import { assembleDataset } from '../src/data-contract.js';
import { digest, createSnapshot, publishSnapshot, verifySourceFiles, writeJsonAtomic } from '../server/data-store.js';
import { activeRelease, readRelease, withPipelineLock } from './source-release.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROGRAMS = ['breast', 'colon', 'cervical'];

export async function download(url, { fetchImpl = fetch, body, timeoutMs = 30000, maxBytes = 40 * 1024 * 1024 } = {}) {
  if (new URL(url).protocol !== 'https:') throw new Error('Source URLs must use HTTPS');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('Source request timed out')), timeoutMs);
  try {
    const response = await fetchImpl(url, { method: body ? 'POST' : 'GET', headers: { Accept: body ? 'application/json' : '*/*', ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: controller.signal });
    if (!response.ok) throw new Error(`Source HTTP ${response.status}: ${url}`);
    const reader = response.body.getReader();
    const chunks = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > maxBytes) { controller.abort(); throw new Error('Source response exceeds size limit'); }
        chunks.push(Buffer.from(value));
      }
    } finally { reader.releaseLock(); }
    if (!size) throw new Error('Source response is empty');
    return { raw: Buffer.concat(chunks), status: response.status, contentType: response.headers.get('content-type'), finalUrl: response.url || url };
  } finally { clearTimeout(timer); }
}

export function screeningTables(raw) {
  const result = spawnSync('python3', [resolve(root, 'scripts/parse-screening.py')], { input: raw, encoding: 'utf8', maxBuffer: 15 * 1024 * 1024, timeout: 30000 });
  if (result.error || result.status !== 0) throw new Error(`Screening parser failed: ${result.error?.message || result.stderr}`);
  return JSON.parse(result.stdout);
}

export function selectScreening(tables, config, regions, minimumYear) {
  const candidates = Object.fromEntries(PROGRAMS.map(program => [program, tables[program].filter(t =>
    t.headings.length === 4 && t.headings[1] === 'Hyvinvointialueet' && t.headings[2] === 'Seulontaketju' && /^\d{4}$/.test(t.headings[3]) &&
    (!config.programs[program].group || t.group === config.programs[program].group))]));
  const years = candidates.breast.map(t => Number(t.headings[3])).filter(year => year >= minimumYear && PROGRAMS.every(p => candidates[p].some(t => Number(t.headings[3]) === year)));
  if (!years.length) throw new Error('No complete common screening year at or after the current snapshot');
  const year = Math.max(...years);
  const result = regions.map(r => ({ id: r.id, screening: {} }));
  const names = new Map(regions.map(r => [r.id === 'HVA90' ? 'Helsingin kaupunki' : r.name, r.id]));
  function number(token, integer = false) {
    if (['', '-', '–', '—', '..', '...', '*', 'NA'].includes(token)) return null;
    if (typeof token !== 'string' || !(integer ? /^\d+$/ : /^\d+(?:,\d+)?$/).test(token)) throw new Error(`Unexpected screening numeric token: ${token}`);
    return Number(token.replace(',', '.'));
  }
  for (const program of PROGRAMS) {
    const matches = candidates[program].filter(t => Number(t.headings[3]) === year);
    if (matches.length !== 1) throw new Error(`Ambiguous ${program} screening table for ${year}`);
    const { rows } = matches[0];
    if (rows[0]?.[1] !== config.programs[program].denominator || !rows[0]?.[2]?.startsWith('Osallistunut') || rows[1]?.[3] !== '%') throw new Error(`Changed ${program} screening column definitions`);
    const seen = new Set();
    for (const row of rows.slice(2)) {
      if (['Yhteensä', 'Ahvenanmaa'].includes(row[0])) continue;
      const id = names.get(row[0]);
      if (!id || seen.has(id)) throw new Error(`Unknown or duplicate screening area: ${row[0]}`);
      seen.add(id);
      const denominator = number(row[1], true), participated = number(row[2], true), rate = number(row[3]);
      if (participated !== null && denominator !== null && participated > denominator) throw new Error(`Invalid screening counts: ${id}`);
      if (rate !== null && (rate > 100 || participated === null || !(denominator > 0) || Math.abs(100 * participated / denominator - rate) > .050001)) throw new Error(`Screening percentage differs from counts: ${id}`);
      result.find(r => r.id === id).screening[program] = { rate, participated, denominator };
    }
    if (seen.size !== regions.length) throw new Error(`Incomplete ${program} area coverage`);
  }
  return { year, regions: result };
}

export function mortalityQuery(metadata, config, regions, minimumYear, now = new Date()) {
  const selections = {
    [config.areaDimension]: ['SSS', ...regions.map(r => r.id)],
    [config.causeDimension]: [config.cause],
    timeperiod_y: metadata.variables?.find(v => v.code === 'timeperiod_y')?.values.filter(year => /^\d{4}$/.test(year) && Number(year) >= config.fromYear && Number(year) < now.getUTCFullYear()),
    contentscode: [config.measure],
  };
  if (!selections.timeperiod_y?.length || Math.max(...selections.timeperiod_y.map(Number)) < minimumYear) throw new Error('Mortality release is older than the current snapshot');
  if (!Array.isArray(metadata.variables) || metadata.variables.length !== 4) throw new Error('Mortality dimensions changed');
  const query = metadata.variables.map(variable => {
    const values = selections[variable.code];
    if (!values || !values.every(v => variable.values.includes(v))) throw new Error(`Mortality selection is unavailable: ${variable.code}`);
    return { code: variable.code, selection: { filter: 'item', values } };
  });
  return { query, response: { format: 'json-stat2' } };
}

export async function refreshSources(workspace, { sources = ['screening', 'mortality', 'prevention'], fetchImpl = fetch } = {}) {
  if (!sources.length || new Set(sources).size !== sources.length || sources.some(s => !['screening', 'mortality', 'prevention'].includes(s))) throw new Error('Choose screening, mortality, prevention, or all');
  const startedAt = new Date().toISOString();
  const previous = activeRelease(workspace);
  const existing = readRelease(workspace, previous);
  const base = buildData(workspace);
  const config = JSON.parse(readFileSync(resolve(workspace, 'data/refresh-sources.json'), 'utf8'));
  if (config.version !== 1 || config.screening.adapter !== 'fcr-annual-html-v1' || config.mortality.adapter !== 'statfin-jsonstat2-v1') throw new Error('Unsupported refresh adapter');
  const files = new Map();
  const requests = (existing?.requests || []).filter(r => !sources.includes(r.source));
  const release = { version: 1, createdAt: startedAt, screening: existing?.screening, mortality: existing?.mortality, prevention: existing?.prevention, requests };
  async function get(source, name, url, body) {
    const requestedAt = new Date().toISOString();
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try { response = await download(url, { fetchImpl, body }); break; }
      catch (error) {
        if (attempt === 2 || !/fetch failed|HTTP (429|5\d\d)|timed out/.test(error.message)) throw error;
        await new Promise(done => setTimeout(done, 250 * (attempt + 1)));
      }
    }
    files.set(name, response.raw);
    const record = { source, name, title: `${source}: ${name}`, url, method: body ? 'POST' : 'GET', ...(body ? { body } : {}), requestedAt, retrievedAt: new Date().toISOString().slice(0, 10), status: response.status, contentType: response.contentType, finalUrl: response.finalUrl, bytes: response.raw.length, sha256: digest(response.raw) };
    requests.push(record);
    return { raw: response.raw, record };
  }
  let stage;
  try {
    if (sources.includes('prevention')) {
      if (config.prevention?.adapter !== 'sotkanet-v1') throw new Error('Unsupported prevention adapter');
      const source = record => ({ file: record.name, sha256: record.sha256, url: record.url, retrievedAt: record.retrievedAt });
      const { record: geography } = await get('prevention', 'sotkanet-regions.json', `${config.prevention.baseUrl}regions`);
      const indicators = [];
      for (const indicator of config.prevention.indicators) {
        const { raw, record: metadata } = await get('prevention', `sotkanet-${indicator.id}-metadata.json`, `${config.prevention.baseUrl}indicators/${indicator.id}`);
        const definition = JSON.parse(raw);
        if (definition.id !== indicator.id || definition.title?.en !== indicator.title || definition.primaryValueType?.code !== 'PROS' || digest(definition.description?.en || '') !== indicator.descriptionSha256) throw new Error(`Sotkanet indicator definition changed: ${indicator.id}`);
        const end = definition.range?.end;
        const prior = existing?.prevention?.indicators.find(i => i.id === indicator.id);
        if (!Number.isInteger(end) || end < config.prevention.fromYear || end > new Date().getUTCFullYear() || end < Math.max(...(prior?.years || [0]))) throw new Error(`Invalid or older Sotkanet period: ${indicator.id}`);
        const start = Math.max(config.prevention.fromYear, definition.range.start);
        const years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const query = new URLSearchParams({ indicator: indicator.id, genders: 'total' });
        years.forEach(year => query.append('years', year));
        const { record: data } = await get('prevention', `sotkanet-${indicator.id}.json`, `${config.prevention.baseUrl}json?${query}`);
        indicators.push({ ...indicator, years, metadata: source(metadata), data: source(data) });
      }
      release.prevention = { regions: source(geography), indicators };
    }
    if (sources.includes('screening')) {
      const tables = {}, evidence = {};
      for (const program of PROGRAMS) {
        const { raw, record } = await get('screening', `${program}.html`, config.screening.programs[program].url);
        tables[program] = screeningTables(raw);
        evidence[program] = { file: record.name, sha256: record.sha256, url: record.url, retrievedAt: record.retrievedAt };
      }
      release.screening = { ...selectScreening(tables, config.screening, base.screening.regions, Math.max(base.screening.year, config.screening.minimumYear)), sources: evidence };
    }
    if (sources.includes('mortality')) {
      const { raw: metadata } = await get('mortality', 'mortality-metadata.json', config.mortality.url);
      const query = mortalityQuery(JSON.parse(metadata), config.mortality, base.screening.regions, Math.max(base.mortality.national.at(-1).year, config.mortality.minimumLatestYear));
      const { raw, record } = await get('mortality', 'mortality.json', config.mortality.url, query);
      const data = JSON.parse(raw);
      if (data.class !== 'dataset' || !Array.isArray(data.id) || data.id.length !== 4) throw new Error('Unexpected mortality response');
      for (const selection of query.query) {
        const actual = Object.keys(data.dimension?.[selection.code]?.category?.index || {}).sort();
        if (JSON.stringify(actual) !== JSON.stringify([...selection.selection.values].sort())) throw new Error(`Mortality response does not match request: ${selection.code}`);
      }
      release.mortality = { file: record.name, years: query.query.find(q => q.code === 'timeperiod_y').selection.values.map(Number).sort(), retrievedAt: record.retrievedAt };
    }
    const id = digest(JSON.stringify(release));
    const relative = `research/12 Source releases/${id}`;
    const destination = resolve(workspace, relative);
    stage = resolve(workspace, 'research/12 Source releases', `.staging-${randomUUID()}`);
    mkdirSync(stage, { recursive: true });
    for (const [name, raw] of files) writeFileSync(resolve(stage, name), raw);
    for (const request of requests) if (files.has(request.name) && sources.includes(request.source)) request.file = `${relative}/${request.name}`;
    if (sources.includes('screening')) for (const source of Object.values(release.screening.sources)) source.file = `${relative}/${source.file}`;
    if (sources.includes('mortality')) release.mortality.file = `${relative}/${release.mortality.file}`;
    if (sources.includes('prevention')) {
      for (const source of [release.prevention.regions, ...release.prevention.indicators.flatMap(i => [i.metadata, i.data])]) source.file = `${relative}/${source.file}`;
    }
    release.id = id;
    writeJsonAtomic(resolve(stage, 'release.json'), release);
    // Immutable input files become visible before the single active-snapshot swap.
    renameSync(stage, destination); stage = null;
    const reference = { id, file: `${relative}/release.json`, sha256: digest(readFileSync(resolve(destination, 'release.json'))) };
    const parts = buildData(workspace, { releaseReference: reference });
    const data = assembleDataset(structuredClone(parts));
    for (const source of Object.values(data.evidence)) source.sha256 ||= digest(readFileSync(resolve(workspace, source.file)));
    verifySourceFiles(data, workspace);
    const snapshot = createSnapshot(data);
    publishSnapshot(snapshot, workspace);
    writeJsonAtomic(resolve(workspace, 'data/refresh-status.json'), { state: 'succeeded', startedAt, completedAt: new Date().toISOString(), sources, revision: snapshot.revision, release: reference });
    return snapshot;
  } catch (error) {
    writeJsonAtomic(resolve(workspace, 'data/refresh-status.json'), { state: 'failed', startedAt, completedAt: new Date().toISOString(), sources, error: error.message });
    throw error;
  } finally { if (stage) rmSync(stage, { recursive: true, force: true }); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const source = args.length === 2 && args[0] === '--source' ? args[1] : args.length ? null : 'all';
  if (!['all', 'mortality', 'screening', 'prevention'].includes(source)) throw new Error('Usage: npm run data:refresh -- [--source all|screening|mortality|prevention]');
  const snapshot = await withPipelineLock(root, () => refreshSources(root, { sources: source === 'all' ? undefined : [source] }));
  console.log(`Refreshed and published ${snapshot.revision}: screening ${snapshot.data.year}; mortality ${snapshot.data.nationalObservations.mortality[0].period}.`);
}
