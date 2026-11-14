import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { metrics, peersFor, benchmark } from '../src/metrics.js';
import { parseResponse } from '../server/ai.js';
const data = JSON.parse(readFileSync(new URL('../data/screening.json', import.meta.url)));
test('snapshot matches its research source checksum and 44 published rates', () => {
  const raw = readFileSync(data.source);
  assert.equal(createHash('sha256').update(raw).digest('hex'), data.sourceSha256);
  const original = JSON.parse(raw);
  assert.equal(data.regions.length, 22);
  for (const r of data.regions) for (const p of ['breast', 'colon']) assert.equal(r.screening[p].rate, original.find(x => x.region_code === r.id)[`${p}_participation_percent_published`]);
});
test('Helsinki breast gap uses actual counts and the source denominator', () => {
  assert.deepEqual(metrics(data.regions.find(r => r.id === 'HVA90'), 'breast'), { rate: 74.3, participated: 28686, denominator: 38630, met: false, gap: 5.7, additional: 2218 });
});
test('only same-programme successful peers are suggested; no colorectal successes', () => {
  assert.equal(peersFor(data, 'HVA90', 'breast').length, 18);
  assert.deepEqual(peersFor(data, 'HVA90', 'breast').slice(0, 3).map(r => r.id), ['HVA08', 'HVA05', 'HVA19']);
  assert.equal(peersFor(data, 'HVA90', 'colon').length, 0);
  assert.equal(peersFor(data, 'HVA08', 'breast').some(r => r.id === 'HVA08'), false);
});
test('meeting target never yields negative participant shortfall', () => {
  assert.equal(metrics(data.regions.find(r => r.id === 'HVA08'), 'breast').additional, 0);
  assert.equal(metrics({ screening: { breast: { rate: 80, denominator: 10, participated: 8 } } }, 'breast').met, true);
});
test('weighted benchmark is not the mean of county rates', () => {
  const sample = { regions: [{ screening: { breast: { participated: 1, denominator: 2 } } }, { screening: { breast: { participated: 9, denominator: 10 } } }] };
  assert.ok(Math.abs(benchmark(sample, 'breast') - 83.3333333) < .0001);
});
test('grounding references preserve UTF-8 text and source indices', () => {
  const text = 'Häme has evidence.';
  const result = parseResponse({ candidates: [{ content: { parts: [{ text }] }, groundingMetadata: { webSearchQueries: ['screening'], groundingChunks: [{ web: { title: 'Study', uri: 'https://example.org/study' } }], groundingSupports: [{ segment: { endIndex: Buffer.byteLength(text) }, groundingChunkIndices: [0] }] } }] });
  assert.equal(result.text, 'Häme has evidence. [[1]](https://example.org/study)');
  assert.equal(result.sources.length, 1);
  assert.equal(result.searched, true);
});
test('empty AI results fail explicitly', () => assert.throws(() => parseResponse({ candidates: [] }), /no answer/));

test('map covers every screening area and marks Åland as the only unmatched area', () => {
  const map = JSON.parse(readFileSync(new URL('../public/counties.json', import.meta.url)));
  const ids = map.features.map(f => f.id);
  assert.equal(new Set(ids).size, 23);
  for (const region of data.regions) assert.ok(ids.includes(region.id), region.name);
  assert.deepEqual(ids.filter(id => !data.regions.some(r => r.id === id)), ['HVA91']);
  assert.ok(map.features.every(f => f.path.startsWith('M') && f.path.endsWith('Z') && !/NaN|Infinity/.test(f.path)));
});

import { GOALS, MISSING, goalResult, goalCounts, goalOwner } from '../src/goals.js';
test('cervical import uses only 2024 age-group screening and preserves all 22 published rates', () => {
  const raw = readFileSync(data.cervicalSource);
  assert.equal(createHash('sha256').update(raw).digest('hex'), data.cervicalSourceSha256);
  const table = JSON.parse(raw).find(t => t.index === 75);
  assert.equal(table.screening_group_explicit_label, 'Ikäryhmäseulonta');
  for (const r of data.regions) {
    const row = table.rows.find(row => row[0] === (r.id === 'HVA90' ? 'Helsingin kaupunki' : r.name));
    assert.deepEqual(r.screening.cervical, { rate: Number(row[3].replace(',', '.')), participated: Number(row[2]), denominator: Number(row[1]) });
  }
  assert.equal(peersFor(data, 'HVA90', 'cervical').length, 2);
});
test('screening mean is arithmetic and does not override a failed programme', () => {
  const r = { screening: { breast: { rate: 95, denominator: 1000 }, colon: { rate: 70, denominator: 100 }, cervical: { rate: 90, denominator: 10 } } };
  assert.equal(goalResult(r, 'screening').value, 85);
  assert.equal(goalResult(r, 'screening').status, 'missed');
  r.screening.colon.rate = 80;
  assert.equal(goalResult(r, 'screening').status, 'met');
  r.screening.colon.rate = 79.99;
  assert.equal(goalResult(r, 'screening').status, 'missed');
});
test('missing programmes are excluded from the mean and coverage remains explicit', () => {
  const result = goalResult({ screening: { breast: { rate: 80 } } }, 'screening');
  assert.equal(result.value, 80);
  assert.deepEqual(result.programs, ['breast']);
  assert.equal(goalResult({ screening: {} }, 'screening').label, MISSING);
});
test('all strategy goals are counted; missing observations never become failures or zero values', () => {
  assert.equal(GOALS.length, 12);
  for (const r of data.regions) {
    assert.deepEqual(goalCounts(r), { met: 0, missed: 1, unknown: 11 });
    for (const goal of GOALS.filter(g => g.id !== 'screening')) {
      assert.deepEqual(goalResult(r, goal.id), { status: 'unknown', value: null, label: MISSING, year: null });
    }
  }
});
test('mortality counts retain provenance but do not manufacture a reduction baseline', () => {
  const m = JSON.parse(readFileSync(new URL('../data/mortality.json', import.meta.url)));
  assert.equal(createHash('sha256').update(readFileSync(m.source)).digest('hex'), m.sourceSha256);
  assert.equal(m.baseline, null);
  assert.deepEqual(m.regions.HVA90.slice(-2), [{ year: 2024, deaths: 1213 }, { year: 2025, deaths: 1273 }]);
  assert.equal(Object.keys(m.regions).length, 22);
  assert.ok(Object.values(m.regions).every(rows => rows.length === 6 && rows[0].year === 2020 && rows.at(-1).year === 2025));
});
test('generic directors cannot be used as verified goal owners', () => {
  assert.equal(goalOwner({ contacts: { HVA90: { name: 'Director' } } }, 'HVA90', 'screening'), null);
});

import { screeningComparison } from '../src/metrics.js';
test('county chart ranks all comparable areas by rate, including below-target and selected areas', () => {
  const before = data.regions.map(r => r.id);
  const rows = screeningComparison(data, 'breast');
  assert.equal(rows.length, 22);
  assert.ok(rows.every((row, i) => !i || rows[i - 1].rate >= row.rate));
  assert.equal(rows.find(row => row.id === 'HVA90').rate, 74.3);
  assert.ok(rows.some(row => row.rate < data.target));
  assert.deepEqual(data.regions.map(r => r.id), before);
});
test('county chart excludes missing and different-year rates instead of plotting them as zero', () => {
  const row = (id, value, period) => ({ id, name: id, observations: { screening: [{ id: 'screening-breast', value, period }] } });
  const rows = screeningComparison({ year: 2024, regions: [row('missing', null, '2024'), row('old', 95, '2023'), row('zero', 0, '2024'), row('current', 80, '2024')] }, 'breast');
  assert.deepEqual(rows.map(row => [row.id, row.rate]), [['current', 80], ['zero', 0]]);
});
