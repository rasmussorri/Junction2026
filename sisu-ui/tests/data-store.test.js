import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildData } from '../scripts/build-data.js';
import { assembleDataset, validateDataset, buildCoverage } from '../src/data-contract.js';
import { createSnapshot, validateSnapshot, createDataStore, writeJsonAtomic, publishSnapshot } from '../server/data-store.js';
import { goalResult } from '../src/goals.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = assembleDataset(buildData(root));
const fresh = () => structuredClone(fixture);

test('screening shares the observation contract and coverage counts actual data separately from assessment', () => {
  const row = fixture.regions.find(r => r.id === 'HVA90');
  assert.equal(row.observations.screening.length, 3);
  assert.equal(row.observations.screening[0].value, 74.3);
  assert.equal(row.screening, undefined);
  assert.equal(fixture.mortality, undefined);
  assert.equal(row.observations.screening[0].availability, 'observed');
  assert.equal(row.observations.treatment.find(r => r.id === 'oncology-queue').availability, 'unavailable');
  const coverage = buildCoverage(fixture);
  assert.equal(coverage.screening.assessable, 22);
  assert.equal(coverage.survival.measured, 22);
  assert.equal(coverage.survival.assessable, 0);
  assert.equal(coverage.treatment.indirect, 22);
  assert.equal(coverage['early-stage'].measured, 0);
  assert.equal(coverage['early-stage'].national, 3);
});

test('contract rejects damaged joins, missing provenance, duplicates and invalid history', () => {
  for (const [change, pattern] of [
    [d => { d.regions[0].id = d.regions[1].id; }, /unique HVA IDs/],
    [d => { d.regions[0].observations.mortality[0].sourceIds = ['no-source']; }, /unresolved source/],
    [d => { d.regions[0].observations.survival.push(d.regions[0].observations.survival[0]); }, /duplicate observation/],
    [d => { d.regions[0].observations.survival[0].value = Infinity; }, /finite/],
    [d => { d.regions[0].observations.mortality[0].value = null; }, /missing value requires/],
    [d => { d.regions[0].observations.mortality[0].series[0].period = '2025'; }, /chronological/],
    [d => { d.regions[0].observations.mortality[0].value++; }, /match history/],
    [d => { d.regions[0].observations.survival[0].scope = 'Finland'; }, /geography scope/],
    [d => { d.evidence.mortality.file = 'research/../.env'; }, /research file/],
    [d => { d.regions[0].observations.screening[0].denominator = 0; }, /numerator\/denominator|disagrees with counts/],
  ]) {
    const data = fresh(); change(data); assert.throws(() => validateDataset(data), pattern);
  }
});

test('snapshot revision is reproducible and detects valid-looking tampering', () => {
  const a = createSnapshot(fresh(), '2026-11-14T12:00:00Z');
  const b = createSnapshot(fresh(), '2026-11-14T13:00:00Z');
  assert.equal(a.revision, b.revision);
  a.data.periodNote = 'Changed';
  assert.throws(() => validateSnapshot(a), /checksum mismatch/);
});

test('store reloads valid publications, keeps last good data through broken or missing files, then recovers', t => {
  const dir = mkdtempSync(resolve(tmpdir(), 'sisu-store-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = resolve(dir, 'dataset.json');
  assert.throws(() => createDataStore(path), /Run npm run data:import/);
  writeJsonAtomic(path, createSnapshot(fresh()));
  const store = createDataStore(path);
  const first = store.read();
  const next = fresh(); next.periodNote = 'A validated new revision';
  writeJsonAtomic(path, createSnapshot(next));
  assert.notEqual(store.read().revision, first.revision);
  assert.equal(store.read().data.periodNote, next.periodNote);
  assert.throws(() => { store.read().data.regions[0].name = 'Changed'; }, TypeError);
  const goodRevision = store.read().revision;
  writeFileSync(path, '{"partial":');
  assert.equal(store.read().revision, goodRevision);
  assert.equal(store.status().state, 'serving_previous_snapshot');
  assert.equal(store.read().revision, goodRevision, 'repeated reads of the same broken file keep the fallback');
  rmSync(path);
  assert.equal(store.read().revision, goodRevision);
  writeJsonAtomic(path, createSnapshot(fresh()));
  assert.equal(store.status().state, 'ready');
  assert.equal(store.status().error, null);
});

test('failed publication does not overwrite the active snapshot', t => {
  const dir = mkdtempSync(resolve(tmpdir(), 'sisu-publish-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = resolve(dir, 'data/dataset.json');
  const snapshot = createSnapshot(fresh());
  writeJsonAtomic(path, snapshot);
  const original = readFileSync(path, 'utf8');
  const invalid = structuredClone(snapshot); invalid.data.regions.pop();
  assert.throws(() => publishSnapshot(invalid, dir), /validation failed/);
  assert.equal(readFileSync(path, 'utf8'), original);
  assert.throws(() => publishSnapshot(snapshot, dir), /Missing or changed evidence/, 'missing source files block publication too');
  assert.equal(readFileSync(path, 'utf8'), original);
});

test('screening never passes incomplete coverage, and uses the imported year', () => {
  const partial = { screeningYear: 2025, screening: { breast: { rate: 90 } } };
  assert.equal(goalResult(partial, 'screening').status, 'unknown');
  assert.equal(goalResult(partial, 'screening').year, 2025);
  partial.screening.breast.rate = 70;
  assert.equal(goalResult(partial, 'screening').status, 'missed');
});
