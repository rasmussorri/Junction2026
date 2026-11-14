import { validateDataset } from './data-contract.js';

export function validateAppPayload(data, map) {
  validateDataset(data);
  if (!/^[a-f0-9]{64}$/.test(data.snapshot?.revision || '') || !Number.isFinite(Date.parse(data.snapshot?.importedAt)) || !['ready', 'serving_previous_snapshot'].includes(data.snapshot?.state) || typeof data.capabilities?.aiConfigured !== 'boolean') throw new Error('Unsupported data response. Reload the app to use the current version.');
  const features = map?.features;
  if (!Array.isArray(features) || typeof map.viewBox !== 'string' || typeof map.sourceUrl !== 'string' || features.some(f => !f || typeof f.path !== 'string' || !f.path.startsWith('M')) || new Set(features.map(f => f.id)).size !== features.length || !data.regions.every(r => features.some(f => f.id === r.id))) throw new Error('Map boundaries do not match the dataset.');
  return data;
}

export async function loadAppData({ fetchImpl = fetch, signal, map, timeoutMs = 15000 } = {}) {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(new DOMException('Data request timed out. Try again.', 'TimeoutError')), timeoutMs);
  const requestSignal = signal ? AbortSignal.any([signal, timeout.signal]) : timeout.signal;
  async function json(url) {
    const response = await fetchImpl(url, { signal: requestSignal });
    if (!response.ok) throw new Error('Could not load the app data. Reload to try again.');
    return response.json();
  }
  try {
    const [data, nextMap] = await Promise.all([json('/api/data'), map || json('/counties.json')]);
    validateAppPayload(data, nextMap);
    return { data, map: nextMap, health: { aiConfigured: data.capabilities.aiConfigured } };
  } finally { clearTimeout(timer); timeout.abort(); }
}

export function sameAppData(previous, next) {
  return previous?.data.snapshot.revision === next.data.snapshot.revision && previous.data.snapshot.importedAt === next.data.snapshot.importedAt && previous.data.snapshot.state === next.data.snapshot.state && previous.health.aiConfigured === next.health.aiConfigured;
}
