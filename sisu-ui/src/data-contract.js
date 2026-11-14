import { GOALS, GROUPS, PROGRAMS, goalResult } from './goals.js';
import { connectObservations } from './observations.js';

export const DATA_SCHEMA_VERSION = 2;
export const REGION_IDS = [...Array.from({ length: 21 }, (_, i) => `HVA${String(i + 1).padStart(2, '0')}`), 'HVA90'];

// This contract is shared by offline imports and the API loader. Missing values
// are explicit nulls; a numeric zero is always an observation.
export function validateDataset(data, { checkCoverage = true } = {}) {
  const errors = [];
  const check = (ok, path, message) => { if (!ok) errors.push(`${path}: ${message}`); };
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  const period = value => typeof value === 'string' && (/^\d{4}$/.test(value) || date(value) || (/^\d{4}–\d{4}$/.test(value) && value.slice(0, 4) <= value.slice(5)));
  const url = value => { try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; } };
  const fail = () => { const error = new Error(`Dataset validation failed (${errors.length}):\n${errors.join('\n')}`); error.issues = errors; throw error; };
  if (!object(data)) { check(false, 'dataset', 'expected an object'); fail(); }
  check(data.schemaVersion === DATA_SCHEMA_VERSION, 'schemaVersion', 'unsupported version');
  check(!Object.hasOwn(data, 'mortality'), 'mortality', 'duplicate measurement store is not allowed');
  check(Number.isInteger(data.year), 'year', 'screening year required');
  if (data.sourceRelease != null) {
    const ref = data.sourceRelease;
    check(object(ref) && /^[a-f0-9]{64}$/.test(ref.id) && ref.file === `research/12 Source releases/${ref.id}/release.json` && /^[a-f0-9]{64}$/.test(ref.sha256), 'sourceRelease', 'invalid immutable release reference');
  }
  check(Number.isFinite(data.target) && data.target >= 0 && data.target <= 100, 'target', 'invalid screening target');
  for (const program of PROGRAMS) {
    const def = data.programs?.[program];
    check(object(def) && text(def.name) && text(def.denominatorLabel) && text(def.note) && url(def.sourceUrl), `programs.${program}`, 'name, denominator label, note and source URL required');
  }
  const definitions = Array.isArray(data.goalDefinitions) ? data.goalDefinitions : [];
  const definitionIds = definitions.filter(object).map(g => g.id);
  check(definitions.length === GOALS.length && new Set(definitionIds).size === GOALS.length && GOALS.every(g => definitionIds.includes(g.id)), 'goalDefinitions', 'expected all strategy goal definitions exactly once');
  for (const goal of definitions) check(object(goal) && text(goal.name) && text(goal.target) && text(goal.reason) && text(goal.measure) && Number.isInteger(goal.group) && goal.group >= 0 && goal.group < GROUPS.length, 'goalDefinitions', 'invalid definition');
  const sources = object(data.evidence) ? data.evidence : {};
  check(object(data.evidence), 'evidence', 'expected a source registry');
  for (const [id, source] of Object.entries(sources)) {
    if (!object(source)) { check(false, `evidence.${id}`, 'expected an object'); continue; }
    check(text(source.title), `evidence.${id}`, 'title required');
    check(text(source.file) && source.file.startsWith('research/') && !source.file.split('/').includes('..'), `evidence.${id}`, 'must reference a research file');
    if (source.url) check(url(source.url), `evidence.${id}.url`, 'invalid source URL');
  }
  const regions = Array.isArray(data.regions) ? data.regions : [];
  const ids = regions.filter(object).map(r => r.id);
  check(ids.length === REGION_IDS.length && new Set(ids).size === ids.length && REGION_IDS.every(id => ids.includes(id)), 'regions', 'expected exactly 21 counties and Helsinki, with unique HVA IDs');
  const semantics = new Map();
  function observations(groups, path, allowedScopes, shared = false) {
    if (!object(groups)) { check(false, path, 'expected goal-to-observation arrays'); return; }
    for (const [goal, rows] of Object.entries(groups)) {
      check(GOALS.some(g => g.id === goal), `${path}.${goal}`, 'unknown goal');
      if (!Array.isArray(rows)) { check(false, `${path}.${goal}`, 'expected an array'); continue; }
      const unique = new Set();
      for (const row of rows) {
        if (!object(row)) { check(false, `${path}.${goal}`, 'expected observation object'); continue; }
        const p = `${path}.${goal}.${row.id}`;
        const key = shared ? `${row.providerId}:${row.id}` : row.id;
        check(text(row.id) && !unique.has(key), p, 'missing or duplicate observation ID'); unique.add(key);
        check(text(row.label) && text(row.unit) && period(row.period) && text(row.areaLabel), p, 'label, unit, valid period and geography required');
        if (row.stratumLabel != null) check(text(row.stratumLabel), p, 'stratum label must be nonempty text');
        check(allowedScopes.includes(row.scope), p, 'observation is in the wrong geography scope');
        check(['DIRECT', 'INDIRECT'].includes(row.relation), p, 'DIRECT/INDIRECT classification required');
        const count = ['patients', 'deaths', 'diagnoses'].includes(row.unit);
        const validValue = v => v === null || (Number.isFinite(v) && v >= 0 && (row.unit !== '%' || v <= 100) && (!count || Number.isInteger(v)));
        check(validValue(row.value), p, 'value must be finite, within range, integer for counts, or explicitly null');
        if (row.value === null) check(row.availability === 'unavailable' && text(row.missingReason), p, 'missing value requires an explicit reason');
        else check(row.availability === 'observed' && row.missingReason === null, p, 'observed value marked missing');
        check(date(row.retrievedAt) && url(row.sourceUrl), p, 'source URL and retrieval date required');
        const sourceIds = Array.isArray(row.sourceIds) ? row.sourceIds : [];
        check(sourceIds.length > 0 && new Set(sourceIds).size === sourceIds.length, p, 'unique source references required');
        for (const id of sourceIds) {
          check(object(sources[id]), p, `unresolved source ${id}`);
          check(/^[a-f0-9]{64}$/.test(sources[id]?.sha256 || ''), p, `checksum missing for ${id}`);
        }
        const primary = sources[sourceIds[0]];
        check(primary?.url === row.sourceUrl && primary?.retrievedAt === row.retrievedAt, p, 'provenance differs from primary source');
        if (row.confidenceInterval != null) check(Array.isArray(row.confidenceInterval) && row.confidenceInterval.length === 2 && row.confidenceInterval.every(Number.isFinite) && Number.isFinite(row.value) && row.confidenceInterval[0] <= row.value && row.confidenceInterval[1] >= row.value, p, 'invalid confidence interval');
        if (Object.hasOwn(row, 'numerator') || Object.hasOwn(row, 'denominator')) {
          const n = row.numerator, d = row.denominator;
          check((n === null || (Number.isInteger(n) && n >= 0)) && (d === null || (Number.isInteger(d) && d >= 0)) && (n === null || d === null || n <= d), p, 'invalid numerator/denominator');
          check(text(row.numeratorLabel) && text(row.denominatorLabel), p, 'ratio count labels required');
          if (row.value !== null) check(d > 0 && n !== null && Math.abs(row.value - 100 * n / d) <= .050001, p, 'percentage disagrees with counts');
        }
        if (row.series != null) {
          if (!Array.isArray(row.series) || !row.series.length) check(false, p, 'history must be a nonempty array');
          else {
            let last = '';
            for (const point of row.series) {
              if (!object(point)) { check(false, p, 'invalid history point'); continue; }
              check(period(point.period) && point.period > last, p, 'history periods must be unique and chronological'); last = point.period;
              check(validValue(point.value), p, 'invalid historical value');
            }
            check(row.series.at(-1)?.period === row.period && row.series.at(-1)?.value === row.value, p, 'latest observation must match history');
          }
        }
        const signature = JSON.stringify([goal, row.unit, row.relation, row.numeratorLabel, row.denominatorLabel]);
        check(!semantics.has(row.id) || semantics.get(row.id) === signature, p, 'metric semantics differ across areas'); semantics.set(row.id, signature);
        if (goal === 'screening') {
          check(PROGRAMS.some(program => row.id === `screening-${program}`), p, 'unknown screening programme');
          check(row.period === String(data.year) && row.unit === '%' && row.relation === 'DIRECT', p, 'screening period or semantics differ from dataset configuration');
        }
        if (shared) check(text(row.providerId) && row.goalId === goal && Array.isArray(row.coveredRegionIds) && row.coveredRegionIds.length > 0 && new Set(row.coveredRegionIds).size === row.coveredRegionIds.length && row.coveredRegionIds.every(id => REGION_IDS.includes(id)), p, 'provider requires a goal and explicit unique county coverage');
      }
    }
  }
  for (const region of regions) {
    if (!object(region)) { check(false, 'regions', 'expected an area object'); continue; }
    check(text(region.name) && Number.isInteger(region.population) && region.population > 0, region.id, 'name and population required');
    check(!Object.hasOwn(region, 'screening'), region.id, 'duplicate screening measurement store is not allowed');
    observations(region.observations, region.id, ['Reported area', 'Provider']);
  }
  observations(data.nationalObservations, 'national', ['Finland', 'Published provider total']);
  const providers = Array.isArray(data.providerObservations) ? data.providerObservations : [];
  check(Array.isArray(data.providerObservations), 'providers', 'expected an array');
  observations(Object.groupBy(providers, row => row?.goalId || 'unknown'), 'providers', ['Provider'], true);
  check(object(data.goalOwners), 'goalOwners', 'expected an object');
  for (const [id, owners] of Object.entries(object(data.goalOwners) ? data.goalOwners : {})) {
    check(REGION_IDS.includes(id) && object(owners), `goalOwners.${id}`, 'unknown county or invalid owner map');
    for (const [goal, owner] of Object.entries(object(owners) ? owners : {})) check(object(owner) && GOALS.some(g => g.id === goal) && text(owner.name) && text(owner.role) && (text(owner.email) || text(owner.phone)) && url(owner.sourceUrl) && date(owner.checkedAt), `goalOwners.${id}.${goal}`, 'owner requires a known goal, name, role, direct contact, source URL and checked date');
  }
  if (errors.length) fail();
  if (checkCoverage) check(JSON.stringify(data.coverage) === JSON.stringify(buildCoverage(data)), 'coverage', 'does not match the observations and assessment rules');
  if (errors.length) fail();
  return data;
}

export function buildCoverage(data) {
  return Object.fromEntries(GOALS.map(goal => {
    const counts = { areas: data.regions.length, measured: 0, direct: 0, indirect: 0, assessable: 0, missing: [], periods: [], national: (data.nationalObservations?.[goal.id] || []).length };
    const periods = new Set();
    for (const region of data.regions) {
      const rows = (region.observations?.[goal.id] || []).filter(row => Number.isFinite(row.value));
      if (rows.length) counts.measured++; else counts.missing.push(region.id);
      if (rows.some(r => r.relation === 'DIRECT')) counts.direct++;
      if (rows.some(r => r.relation === 'INDIRECT')) counts.indirect++;
      if (goalResult(region, goal.id, data).status !== 'unknown') counts.assessable++;
      for (const row of rows) periods.add(row.period);
    }
    counts.periods = [...periods].sort();
    counts.reason = data.goalDefinitions?.find(g => g.id === goal.id)?.reason || goal.reason;
    return [goal.id, counts];
  }));
}

export function assembleDataset({ screening, observations, evidence, goalOwners }) {
  const data = { schemaVersion: DATA_SCHEMA_VERSION, ...connectObservations(screening, observations), goalOwners, evidence: { ...evidence, ...observations.sources } };
  data.goalDefinitions = GOALS.map(goal => ({ ...goal, ...(goal.id === 'screening' ? { target: `At least ${screening.target}% participation in every screening programme in every county`, reason: 'Every required screening programme must have an observation in the selected period and reach the participation target.' } : {}) }));
  for (const program of PROGRAMS) {
    const cervical = program === 'cervical';
    data.evidence[`screening-${program}`] = {
      title: `${screening.programs[program].name} source`, url: screening.programs[program].sourceUrl,
      file: cervical ? screening.cervicalSource : screening.source,
      sha256: cervical ? screening.cervicalSourceSha256 : screening.sourceSha256,
      retrievedAt: screening.checkedAt,
      ...screening.programSources?.[program],
    };
  }
  for (const region of data.regions) {
    region.observations = { ...region.observations, screening: PROGRAMS.map(program => ({
      id: `screening-${program}`, label: screening.programs[program].name, value: region.screening[program].rate,
      unit: '%', numerator: region.screening[program].participated, denominator: region.screening[program].denominator,
      numeratorLabel: 'participants', denominatorLabel: screening.programs[program].denominatorLabel,
      period: String(screening.year), areaLabel: region.name, scope: 'Reported area', relation: 'DIRECT',
      sourceIds: [`screening-${program}`], sourceUrl: data.evidence[`screening-${program}`].url, retrievedAt: data.evidence[`screening-${program}`].retrievedAt,
      note: screening.programs[program].note,
    })) };
    delete region.screening;
  }
  delete data.programSources;
  const groups = [...data.regions.map(r => r.observations), data.nationalObservations, { treatment: data.providerObservations || [] }];
  for (const goals of groups) for (const rows of Object.values(goals || {})) for (const row of rows) {
    row.availability = row.value === null ? 'unavailable' : 'observed';
    row.missingReason = row.value === null ? 'No numeric value reported in this source for this area and period.' : null;
  }
  validateDataset(data, { checkCoverage: false });
  data.coverage = buildCoverage(data);
  validateDataset(data);
  return data;
}
