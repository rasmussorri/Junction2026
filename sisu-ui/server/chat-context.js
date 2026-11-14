import { goalView } from '../src/observations.js';
import { goalCounts } from '../src/goals.js';
import { metrics, peersFor } from '../src/metrics.js';

export function requireDataRevision(snapshot, revision) {
  if (revision !== snapshot.revision) {
    const error = new Error('The dataset has changed. Refresh the data and retry your question.');
    error.status = 409;
    throw error;
  }
}

export function buildChatContext(snapshot, regionId, goalId, program) {
  const data = snapshot.data;
  const region = data.regions.find(r => r.id === regionId);
  if (!region) throw new Error('Unknown county');
  const view = goalView(data, region, goalId);
  if (!view.goal) throw new Error('Unknown goal');
  const peers = goalId === 'screening' ? peersFor(data, regionId, program).map(r => ({ id: r.id, name: r.name, ...metrics(r, program, data.target), owner: data.goalOwners[r.id]?.screening || null })) : [];
  const sourceIds = new Set(['strategy', 'audit', ...Object.values(region.observations).flat().flatMap(row => row.sourceIds), ...[...view.national, ...view.shared].flatMap(row => row.sourceIds)]);
  const evidence = Object.fromEntries([...sourceIds].filter(id => data.evidence[id]).map(id => {
    const source = data.evidence[id];
    return [id, { title: source.title, url: source.url, retrievedAt: source.retrievedAt, snapshotUrl: `/api/evidence/${id}?revision=${snapshot.revision}`, sha256: source.sha256 }];
  }));
  return {
    dataRevision: snapshot.revision,
    dataScope: 'All observations for the selected county. National and shared-provider context is limited to the selected goal. Other county values are limited to the listed successful programme peers.',
    selectedArea: { id: region.id, name: region.name }, selectedGoal: view.goal,
    result: view.assessment, availability: view.availability, assessmentReason: view.reason,
    goalCounts: goalCounts(region, data), goals: data.goalDefinitions,
    observations: region.observations, nationalObservations: view.national, sharedProviderObservations: view.shared,
    program: goalId === 'screening' ? { id: program, ...data.programs[program], year: data.year, target: data.target } : null,
    selectedMetrics: goalId === 'screening' ? metrics(region, program, data.target) : null,
    successfulProgrammePeers: peers, goalOwners: data.goalOwners[regionId] || {},
    definitions: { coverage: data.coverage[goalId], periodNote: data.periodNote, populationNote: data.populationNote }, evidence,
  };
}
