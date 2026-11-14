export function localObservations(region, goalId) {
  return region.observations?.[goalId] || [];
}
export function hasLocalObservation(region, goalId) {
  return localObservations(region, goalId).some(row => Number.isFinite(row.value));
}
export function formatObservation(row) {
  if (!Number.isFinite(row.value)) return 'Not reported';
  return row.unit === '%' ? `${row.value.toFixed(1)}%` : `${row.value.toLocaleString('en')} ${row.unit}`;
}
export function observationSources(data, region, goalId) {
  return [...new Set([...localObservations(region, goalId), ...(data.nationalObservations?.[goalId] || []), ...sharedObservations(data, region.id, goalId)].flatMap(row => row.sourceIds))];
}
export function sharedObservations(data, regionId, goalId) {
  return (data.providerObservations || []).filter(row => row.goalId === goalId && row.coveredRegionIds?.includes(regionId));
}
export function goalDefinition(data, goalId) {
  return data.goalDefinitions?.find(goal => goal.id === goalId) || GOALS.find(goal => goal.id === goalId);
}
export function goalView(data, region, goalId) {
  const goal = goalDefinition(data, goalId);
  const local = localObservations(region, goalId);
  const national = data.nationalObservations?.[goalId] || [];
  const shared = sharedObservations(data, region.id, goalId);
  const measured = local.filter(row => Number.isFinite(row.value));
  const assessment = goalResult(region, goalId, data);
  const availability = measured.length ? measured.some(row => row.relation === 'DIRECT') ? 'direct' : 'supporting' : national.some(row => Number.isFinite(row.value)) ? 'national_only' : shared.some(row => Number.isFinite(row.value)) ? 'shared_only' : 'missing';
  const summary = goalId === 'screening' && Number.isFinite(assessment.value) ? `${assessment.label} average · ${assessment.year}` : measured.length ? measured.slice(0, goalId === 'survival' ? 2 : 1).map(row => `${row.stratumLabel ? row.stratumLabel + ': ' : goalId === 'preventable-cancers' ? row.label + ': ' : ''}${formatObservation(row)} · ${row.period}`).join(' / ') : ({ national_only: 'National context available', shared_only: 'Shared provider context available', missing: 'Data source missing' })[availability];
  return { goal, local, national, shared, assessment, availability, summary: availability === 'supporting' ? `Supporting data: ${summary}` : summary, hasData: measured.length > 0, reason: assessment.status === 'unknown' ? goal?.reason : null };
}
export function countDescription(row) {
  if (row.numerator == null && row.denominator == null) return null;
  return `${row.numerator?.toLocaleString('en') ?? 'Not reported'} ${row.numeratorLabel || 'events'} / ${row.denominator?.toLocaleString('en') ?? 'not reported'} ${row.denominatorLabel || 'eligible people'}`;
}
export function connectObservations(screening, observations) {
  const ids = new Set(screening.regions.map(region => region.id));
  for (const id of Object.keys(observations.regions)) if (!ids.has(id)) throw new Error(`Unmatched observation area: ${id}`);
  return {
    ...screening,
    regions: screening.regions.map(region => ({ ...region, observations: observations.regions[region.id] || {} })),
    nationalObservations: observations.national,
    providerObservations: observations.providers,
  };
}
import { GOALS, goalResult } from './goals.js';
