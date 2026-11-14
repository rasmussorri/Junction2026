import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, cpSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildData } from '../scripts/build-data.js';
import { assembleDataset } from '../src/data-contract.js';
import { createSnapshot, createDataStore, publishSnapshot, publishedHistory, archivedSnapshot, rollbackSnapshot, readSnapshotEvidence, digest } from '../server/data-store.js';
import { download, screeningTables, selectScreening, mortalityQuery, refreshSources } from '../scripts/refresh-data.js';
import { withPipelineLock, readRelease } from '../scripts/source-release.js';
import { preventionObservations } from '../scripts/import-prevention.js';
import { goalResult } from '../src/goals.js';
import { goalView } from '../src/observations.js';
import { buildChatContext } from '../server/chat-context.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const parts = buildData(root, { releaseReference: null });
const preventionFixture = JSON.parse(readFileSync(resolve(root, 'tests/fixtures/prevention-release.json')));
const config = JSON.parse(readFileSync(resolve(root, 'data/refresh-sources.json')));
const htmlFiles = {
  breast: 'research/06 Tekninen liite/rinta.html', colon: 'research/06 Tekninen liite/suolisto.html',
  cervical: 'research/06 Tekninen liite/Kohdunkaula ja seulontaviiveet/work/kohtu.html',
};
const tables = Object.fromEntries(Object.entries(htmlFiles).map(([key, path]) => [key, screeningTables(readFileSync(resolve(root, path)))]));
const temporary = t => { const path = mkdtempSync(resolve(tmpdir(), 'sisu-operations-')); t.after(() => rmSync(path, { recursive: true, force: true })); return path; };
function archiveFixture(t) {
  const workspace = temporary(t);
  const data = assembleDataset(structuredClone(parts));
  for (const [id, source] of Object.entries(data.evidence)) {
    source.file = `research/fixture/${id}.txt`; source.sha256 = digest(id);
    mkdirSync(dirname(resolve(workspace, source.file)), { recursive: true });
    writeFileSync(resolve(workspace, source.file), id);
  }
  return { workspace, data };
}

test('durable archives preserve source bytes, recover after a server restart, and restore an explicit revision', t => {
  const { workspace, data } = archiveFixture(t);
  const first = createSnapshot(data);
  publishSnapshot(first, workspace);
  const nextData = structuredClone(data); nextData.periodNote = 'Second publication';
  const next = createSnapshot(nextData); publishSnapshot(next, workspace);
  assert.deepEqual(publishedHistory(workspace).map(r => r.revision), [next.revision, first.revision]);
  writeFileSync(resolve(workspace, data.evidence.mortality.file), 'changed upstream');
  assert.equal(readSnapshotEvidence(first, 'mortality', workspace).toString(), 'mortality');
  const path = resolve(workspace, 'data/dataset.json');
  writeFileSync(path, '{broken');
  const restarted = createDataStore(path);
  assert.equal(restarted.read().revision, next.revision);
  assert.equal(restarted.status().state, 'serving_previous_snapshot');
  rollbackSnapshot(workspace, first.revision);
  assert.equal(restarted.read().revision, first.revision);
  assert.equal(restarted.status().state, 'ready');
  assert.throws(() => rollbackSnapshot(workspace, '../oops'), /not previously published/);
  assert.throws(() => archivedSnapshot(workspace, '../oops'), /64-character/);
});

test('damaged archives are rejected and restart recovery tries the previous published revision', t => {
  const { workspace, data } = archiveFixture(t);
  const first = createSnapshot(data); publishSnapshot(first, workspace);
  const second = structuredClone(data); second.periodNote = 'Next';
  const next = createSnapshot(second); publishSnapshot(next, workspace);
  writeFileSync(resolve(workspace, `data/history/${next.revision}/evidence`, data.evidence.mortality.file), 'corrupt');
  assert.throws(() => rollbackSnapshot(workspace, next.revision), /checksum/);
  rmSync(resolve(workspace, 'data/dataset.json'));
  assert.equal(createDataStore(resolve(workspace, 'data/dataset.json')).read().revision, first.revision);
});

test('screening refresh reproduces all 66 rates from original reports and excludes cervical risk-group follow-up', () => {
  const selected = selectScreening(tables, config.screening, parts.screening.regions, 2024);
  assert.equal(selected.year, 2024);
  for (const region of selected.regions) assert.deepEqual(region.screening, parts.screening.regions.find(r => r.id === region.id).screening);
  assert.throws(() => selectScreening(tables, config.screening, parts.screening.regions, 2025), /No complete common/);
  const changed = structuredClone(tables);
  const table = changed.breast.find(t => t.headings.join('|').endsWith('Hyvinvointialueet|Seulontaketju|2024'));
  table.rows[0][1] = 'Different denominator';
  assert.throws(() => selectScreening(changed, config.screening, parts.screening.regions, 2024), /column definitions/);
});

test('refresh refuses duplicate or missing counties and percentages inconsistent with source counts', () => {
  for (const change of [rows => rows.pop(), rows => rows.push(rows[2]), rows => { rows[2][3] = '99,9'; }]) {
    const changed = structuredClone(tables);
    const table = changed.colon.find(t => t.headings.join('|').endsWith('Hyvinvointialueet|Seulontaketju|2024'));
    if (table.rows.at(-1)[0] === 'Yhteensä') table.rows.pop();
    change(table.rows);
    assert.throws(() => selectScreening(changed, config.screening, parts.screening.regions, 2024), /coverage|duplicate|differs/);
  }
});

test('mortality refresh selects published complete years and fails on changed dimensions or older releases', () => {
  const metadata = JSON.parse(readFileSync(resolve(root, 'research/11 Dashboard integration/mortality-metadata.json')));
  const query = mortalityQuery(metadata, config.mortality, parts.screening.regions, 2025, new Date('2026-11-14'));
  assert.equal(query.query[0].selection.values.length, 23);
  assert.deepEqual(query.query.find(q => q.code === 'timeperiod_y').selection.values, ['2020', '2021', '2022', '2023', '2024', '2025']);
  assert.throws(() => mortalityQuery(metadata, config.mortality, parts.screening.regions, 2026, new Date('2026-11-14')), /older/);
  metadata.variables[0].code = 'new-boundaries';
  assert.throws(() => mortalityQuery(metadata, config.mortality, parts.screening.regions, 2025, new Date('2026-11-14')), /unavailable/);
});

test('downloads reject HTTP errors, empty bodies, oversized responses, and timeouts', async () => {
  const url = 'https://example.test/data';
  await assert.rejects(download(url, { fetchImpl: async () => new Response('error', { status: 500 }) }), /HTTP 500/);
  await assert.rejects(download(url, { fetchImpl: async () => new Response('') }), /empty/);
  await assert.rejects(download(url, { maxBytes: 2, fetchImpl: async () => new Response('123') }), /size limit/);
  await assert.rejects(download(url, { timeoutMs: 5, fetchImpl: async (_, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason))) }), /timed out/);
});

test('pipeline lock prevents concurrent publishers and is released on failure', async t => {
  const workspace = temporary(t);
  await withPipelineLock(workspace, async () => {
    await assert.rejects(withPipelineLock(workspace, () => {}), /Another data command/);
  });
  await assert.rejects(withPipelineLock(workspace, () => { throw new Error('test failure'); }), /test failure/);
  await withPipelineLock(workspace, () => {});
});

test('a refresh publishes reproducible inputs atomically; a failed follow-up leaves that revision untouched', async t => {
  const workspace = temporary(t);
  const paths = new Set([...Object.values(parts.evidence), ...Object.values(parts.observations.sources)].map(s => s.file));
  for (const path of [...paths, 'data/goal-owners.json', 'data/evidence-sources.json', 'data/refresh-sources.json']) {
    mkdirSync(dirname(resolve(workspace, path)), { recursive: true }); cpSync(resolve(root, path), resolve(workspace, path));
  }
  const fetchImpl = async url => {
    const program = Object.keys(config.screening.programs).find(p => config.screening.programs[p].url === url);
    return new Response(readFileSync(resolve(root, htmlFiles[program])), { headers: { 'content-type': 'text/html' } });
  };
  const snapshot = await refreshSources(workspace, { sources: ['screening'], fetchImpl });
  const rebuilt = assembleDataset(buildData(workspace));
  for (const source of Object.values(rebuilt.evidence)) source.sha256 ||= digest(readFileSync(resolve(workspace, source.file)));
  assert.equal(createSnapshot(rebuilt).revision, snapshot.revision);
  const release = readRelease(workspace, snapshot.data.sourceRelease);
  assert.equal(release.requests.length, 3);
  assert.ok(release.requests.every(r => r.status === 200 && r.method === 'GET' && r.sha256 && r.requestedAt));
  const path = resolve(workspace, 'data/dataset.json'), original = readFileSync(path, 'utf8');
  await assert.rejects(refreshSources(workspace, { sources: ['screening', 'mortality'], fetchImpl: async url => url.includes('cancerregistry.fi') ? fetchImpl(url) : new Response('upstream failure', { status: 503 }) }), /HTTP 503/);
  assert.equal(readFileSync(path, 'utf8'), original);
  assert.equal(JSON.parse(readFileSync(resolve(workspace, 'data/refresh-status.json'))).state, 'failed');
  writeFileSync(resolve(workspace, release.requests[0].file), 'tampered');
  assert.throws(() => buildData(workspace), /checksum mismatch/);
});

test('all four prevention measures reach all 22 counties and AI as supporting evidence with their original periods', () => {
  const data = assembleDataset(buildData(root, { releaseReference: preventionFixture }));
  assert.equal(data.coverage['preventable-cancers'].measured, 22);
  assert.equal(data.coverage['preventable-cancers'].assessable, 0);
  for (const region of data.regions) {
    const rows = region.observations['preventable-cancers'];
    assert.equal(rows.length, 4);
    assert.ok(rows.every(row => row.relation === 'INDIRECT' && Number.isFinite(row.value) && row.sourceIds.length === 3));
    assert.equal(goalResult(region, 'preventable-cancers', data).status, 'unknown');
  }
  const helsinki = data.regions.find(r => r.id === 'HVA90');
  assert.deepEqual(helsinki.observations['preventable-cancers'].map(r => [r.id, r.value, r.period]), [
    ['hpv-girls', 70.2, '2026'], ['hpv-boys', 63.2, '2026'], ['daily-smoking', 6.8, '2024'], ['alcohol-auditc', 29.2, '2024'],
  ]);
  assert.match(goalView(data, helsinki, 'preventable-cancers').summary, /Supporting data: HPV/);
  const context = buildChatContext(createSnapshot(data), helsinki.id, 'preventable-cancers');
  assert.equal(context.availability, 'supporting');
  assert.equal(context.nationalObservations.length, 4);
  assert.match(context.evidence['sotkanet-3869'].snapshotUrl, /revision=/);
});

test('Sotkanet missing cells stay null; duplicate cells, wrong sex and cohort changes are rejected', t => {
  const workspace = temporary(t);
  const release = structuredClone(readRelease(root, preventionFixture).prevention);
  for (const source of [release.regions, ...release.indicators.flatMap(i => [i.data, i.metadata])]) {
    mkdirSync(dirname(resolve(workspace, source.file)), { recursive: true }); cpSync(resolve(root, source.file), resolve(workspace, source.file));
  }
  const indicator = release.indicators.find(i => i.id === 3869);
  const original = JSON.parse(readFileSync(resolve(workspace, indicator.data.file)));
  function set(source, value) {
    const raw = JSON.stringify(value); writeFileSync(resolve(workspace, source.file), raw); source.sha256 = digest(raw);
  }
  set(indicator.data, original.filter(r => !(r.region === 960 && r.year === 2026)));
  const partial = preventionObservations(release, workspace, parts.screening.regions);
  assert.equal(partial.observations.HVA90[0].value, null);
  assert.equal(partial.observations.HVA90[0].period, '2026');
  set(indicator.data, [...original, original[0]]);
  assert.throws(() => preventionObservations(release, workspace, parts.screening.regions), /Duplicate/);
  set(indicator.data, original.map((r, i) => i ? r : { ...r, gender: 'female' }));
  assert.throws(() => preventionObservations(release, workspace, parts.screening.regions), /Unexpected/);
  set(indicator.data, original);
  const metadata = JSON.parse(readFileSync(resolve(workspace, indicator.metadata.file)));
  metadata.description.en = 'Changed to a one-dose cohort'; set(indicator.metadata, metadata);
  assert.throws(() => preventionObservations(release, workspace, parts.screening.regions), /definition changed/);
});
