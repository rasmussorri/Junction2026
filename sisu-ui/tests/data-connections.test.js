import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildData } from '../scripts/build-data.js';
import { assembleDataset, validateDataset, buildCoverage } from '../src/data-contract.js';
import { goalResult } from '../src/goals.js';
import { metrics, peersFor, benchmark } from '../src/metrics.js';
import { goalView, countDescription, observationSources } from '../src/observations.js';
import { createSnapshot } from '../server/data-store.js';
import { buildChatContext, requireDataRevision } from '../server/chat-context.js';
import { loadAppData, sameAppData, validateAppPayload } from '../src/data-client.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = assembleDataset(buildData(root));
const snapshot = createSnapshot(data);
const map = JSON.parse(readFileSync(new URL('../public/counties.json', import.meta.url)));
const payload = () => ({ ...structuredClone(data), snapshot: { revision: snapshot.revision, importedAt: snapshot.importedAt, state: 'ready' }, capabilities: { aiConfigured: false } });
const helsinki = data.regions.find(r => r.id === 'HVA90');

test('canonical values reach programme calculations, goal views, peers and AI through the same selectors', () => {
  assert.equal(helsinki.screening, undefined);
  assert.equal(data.mortality, undefined);
  assert.equal(metrics(helsinki, 'breast', data.target).rate, 74.3);
  const view = goalView(data, helsinki, 'screening');
  const context = buildChatContext(snapshot, helsinki.id, 'screening', 'breast');
  assert.deepEqual(context.result, view.assessment);
  assert.deepEqual(context.selectedMetrics, metrics(helsinki, 'breast', data.target));
  assert.equal(context.successfulProgrammePeers.length, peersFor(data, helsinki.id, 'breast').length);
  assert.match(view.summary, /2024/);
  assert.match(countDescription(view.local[0]), /28,686 participants.*38,630/);
  assert.doesNotMatch(countDescription(view.local[0]), /waiting/);
});

test('changed target and period affect calculations and presentation together', () => {
  const next = structuredClone(data);
  next.year = 2025; next.target = 70;
  for (const region of next.regions) for (const row of region.observations.screening) row.period = '2025';
  next.goalDefinitions.find(g => g.id === 'screening').target = 'At least 70% in every programme';
  next.coverage = buildCoverage(next);
  validateDataset(next);
  const region = next.regions.find(r => r.id === 'HVA90');
  const view = goalView(next, region, 'screening');
  assert.equal(view.assessment.year, 2025);
  assert.equal(metrics(region, 'breast', next.target).met, true);
  assert.match(view.summary, /2025/);
  const context = buildChatContext(createSnapshot(next), region.id, 'screening', 'breast');
  assert.equal(context.program.year, 2025);
  assert.equal(context.program.target, 70);
  assert.equal(context.result.status, view.assessment.status);
});

test('missing and mismatched-period screening data never become zero or successful peers', () => {
  const region = structuredClone(helsinki);
  region.observations.screening = [{ ...region.observations.screening[0], value: 95 }];
  assert.equal(goalResult(region, 'screening', data).status, 'unknown');
  assert.equal(metrics(region, 'colon').met, null);
  assert.equal(metrics(region, 'colon').additional, null);
  region.observations.screening[0].period = '2023';
  assert.equal(goalResult(region, 'screening', data).value, null);
  assert.equal(benchmark({ regions: [] }, 'breast'), null);
  assert.deepEqual(peersFor(data, 'not-an-area', 'breast'), []);
});

test('national-only, direct, supporting and missing observations remain distinct', () => {
  assert.equal(goalView(data, helsinki, 'early-stage').availability, 'national_only');
  assert.equal(goalView(data, helsinki, 'early-stage').hasData, false);
  assert.equal(goalView(data, helsinki, 'survival').availability, 'direct');
  assert.equal(goalView(data, helsinki, 'survival').assessment.status, 'unknown');
  assert.equal(goalView(data, helsinki, 'treatment').availability, 'supporting');
  assert.equal(goalView(data, helsinki, 'nps').availability, 'missing');
});

test('shared provider coverage and evidence use the data relationship, including absent local queue rows', () => {
  const uusimaa = data.regions.find(r => r.id === 'HVA01');
  const unrelated = data.regions.find(r => r.id === 'HVA08');
  assert.equal(goalView(data, uusimaa, 'treatment').shared[0].providerId, 'HUS');
  assert.equal(goalView(data, unrelated, 'treatment').shared.length, 0);
  assert.ok(observationSources(data, uusimaa, 'treatment').includes('queue-long'));
  const next = structuredClone(data); next.providerObservations[0].coveredRegionIds = ['HVA08'];
  assert.equal(goalView(next, uusimaa, 'treatment').shared.length, 0);
  assert.equal(goalView(next, unrelated, 'treatment').shared.length, 1);
});

test('malformed containers fail with actionable validation errors, not incidental TypeErrors', () => {
  for (const mutate of [d => { d.evidence = null; }, d => { d.regions[0] = null; }, d => { d.regions[0].observations.mortality = [null]; }, d => { d.regions[0].observations.survival[0].confidenceInterval = 'bad'; }, d => { d.regions[0].observations.mortality[0].series = {}; }, d => { d.providerObservations = [null]; }, d => { d.coverage.mortality.measured = 0; }]) {
    const next = structuredClone(data); mutate(next);
    assert.throws(() => validateDataset(next), error => Array.isArray(error.issues) && error.message.startsWith('Dataset validation failed'));
  }
});

test('zero denominator can be explicitly unavailable but never a numeric percentage', () => {
  const next = structuredClone(data);
  const row = next.regions.find(r => r.id === 'HVA90').observations.treatment.find(r => r.id === 'oncology-queue');
  row.numerator = 0; row.denominator = 0;
  validateDataset(next);
  row.value = 0; row.availability = 'observed'; row.missingReason = null;
  assert.throws(() => validateDataset(next), /percentage disagrees/);
});

test('chat context is bounded, carries provenance, and rejects mismatched revisions before model use', () => {
  const context = buildChatContext(snapshot, 'HVA90', 'survival');
  assert.equal(context.dataRevision, snapshot.revision);
  assert.equal(context.observations.survival[0].value, 32.9);
  assert.equal(context.dataset, undefined);
  assert.equal(context.nationalObservations.length, 2);
  assert.ok(context.evidence['lung-survival'].snapshotUrl);
  assert.ok(JSON.stringify(context).length < JSON.stringify(data).length * .4);
  assert.doesNotThrow(() => requireDataRevision(snapshot, snapshot.revision));
  assert.throws(() => requireDataRevision(snapshot, 'old'), error => error.status === 409);
  assert.throws(() => requireDataRevision(snapshot), error => error.status === 409);
});

test('client loads coherent data and state in one request, caches the map and recognizes unchanged revisions', async () => {
  const calls = [];
  const fetchImpl = async url => { calls.push(url); return { ok: true, json: async () => url === '/api/data' ? payload() : map }; };
  const first = await loadAppData({ fetchImpl });
  assert.deepEqual(calls.sort(), ['/api/data', '/counties.json']);
  calls.length = 0;
  const second = await loadAppData({ fetchImpl, map: first.map });
  assert.deepEqual(calls, ['/api/data']);
  assert.equal(sameAppData(first, second), true);
  second.data.snapshot.state = 'serving_previous_snapshot';
  assert.equal(sameAppData(first, second), false);
});

test('client rejects incompatible versions, unmatched maps, HTTP failures and bounded timeouts', async () => {
  const bad = payload(); bad.schemaVersion = 999;
  assert.throws(() => validateAppPayload(bad, map), /unsupported version/);
  assert.throws(() => validateAppPayload(payload(), { ...map, features: [] }), /Map boundaries/);
  await assert.rejects(loadAppData({ map, fetchImpl: async () => ({ ok: false }) }), /Could not load/);
  const hung = (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
  await assert.rejects(loadAppData({ map, fetchImpl: hung, timeoutMs: 10 }), { name: 'TimeoutError' });
});
