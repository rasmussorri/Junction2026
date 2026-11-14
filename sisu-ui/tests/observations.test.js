import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { connectObservations, hasLocalObservation, formatObservation, observationSources } from '../src/observations.js';
import { goalResult } from '../src/goals.js';
const load = path => JSON.parse(readFileSync(path));
const observations = load('data/observations.json');
const data = connectObservations(load('data/screening.json'), observations);
const region = id => data.regions.find(row => row.id === id);

test('all 22 area IDs receive mortality, survival and service-use observations', () => {
  for (const row of data.regions) for (const goal of ['mortality', 'survival', 'treatment']) {
    assert.ok(hasLocalObservation(row, goal), `${row.id}: ${goal}`);
    assert.equal(goalResult(row, goal).status, 'unknown', 'related values do not manufacture target achievement');
  }
  assert.throws(() => connectObservations(data, { ...observations, regions: { HVA999: {} } }), /Unmatched/);
});
test('every observation retains classification, period, source URL, retrieval date and source checksum', () => {
  for (const source of Object.values(observations.sources)) assert.equal(createHash('sha256').update(readFileSync(source.file)).digest('hex'), source.sha256, source.file);
  for (const group of [...Object.values(observations.regions), observations.national]) for (const rows of Object.values(group)) for (const row of rows) {
    assert.ok(['DIRECT', 'INDIRECT'].includes(row.relation));
    assert.ok(row.period && row.sourceUrl.startsWith('https://') && /^2026-11-\d\d$/.test(row.retrievedAt));
    for (const id of row.sourceIds) assert.ok(observations.sources[id]);
  }
});
test('queue missing cells are not zero; provider denominators and shared HUS stay separate', () => {
  const queue = id => region(id).observations.treatment.find(row => row.id === 'oncology-queue');
  assert.equal(queue('HVA90').value, null);
  assert.equal(queue('HVA20').value, null);
  assert.equal(formatObservation(queue('HVA90')), 'Not reported');
  assert.equal(queue('HVA11').value, 0);
  assert.equal(formatObservation(queue('HVA11')), '0.0%');
  assert.equal(queue('HVA06').value, 25);
  assert.equal(queue('HVA06').numerator, 2);
  assert.equal(queue('HVA06').denominator, 8);
  assert.equal(queue('HVA01'), undefined);
  assert.equal(observations.providers[0].areaLabel, 'HUS');
  assert.equal(observations.providers[0].denominator, 283);
  for (const row of data.regions) assert.ok(row.observations.treatment.every(o => o.areaLabel !== 'HUS'));
});
test('lung survival preserves sex, source age-standardisation and confidence intervals', () => {
  const rows = region('HVA90').observations.survival;
  assert.deepEqual(rows.map(r => r.value), [32.9, 16.4]);
  assert.deepEqual(rows[0].confidenceInterval, [28.2, 38.3]);
  assert.equal(rows[0].period, '2020–2024');
  assert.equal(region('HVA04').observations.survival[0].value, 34.4);
  assert.equal(region('HVA21').observations.survival[0].value, 21.8);
});
test('national stage counts are never assigned to counties', () => {
  assert.deepEqual(data.nationalObservations['early-stage'].map(row => row.value), [22248, 51098, 118276]);
  for (const row of data.regions) assert.equal(hasLocalObservation(row, 'early-stage'), false);
  assert.ok(observationSources(data, region('HVA90'), 'early-stage').includes('stage-definition'));
});
test('mortality retains six-year history and latest actual values independently of target baseline', () => {
  const row = region('HVA90').observations.mortality[0];
  assert.equal(row.value, 1273);
  assert.equal(row.period, '2025');
  assert.deepEqual(row.series.map(point => point.period), ['2020', '2021', '2022', '2023', '2024', '2025']);
  assert.equal(data.nationalObservations.mortality[0].value, 13424);
});
