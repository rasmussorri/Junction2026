import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { digest } from '../server/data-store.js';

export function preventionObservations(release, root, regions) {
  const sources = {};
  function read(id, source, title) {
    const raw = readFileSync(resolve(root, source.file));
    if (digest(raw) !== source.sha256) throw new Error(`Prevention source checksum mismatch: ${id}`);
    sources[id] = { ...source, title };
    return JSON.parse(raw);
  }
  const geography = read('sotkanet-regions', release.regions, 'Sotkanet official region identifiers');
  const areas = regions.map(region => {
    const matches = geography.filter(r => r.category === 'HYVINVOINTIALUE' && `HVA${r.code}` === region.id);
    if (matches.length !== 1) throw new Error(`Sotkanet county mapping missing or ambiguous: ${region.id}`);
    return { id: region.id, name: region.name, sourceId: matches[0].id, scope: 'Reported area' };
  });
  const national = geography.filter(r => r.category === 'MAA' && r.code === '358');
  if (national.length !== 1) throw new Error('Sotkanet Finland mapping missing or ambiguous');
  areas.push({ id: 'national', name: 'Finland', sourceId: national[0].id, scope: 'Finland' });
  const observations = Object.fromEntries(areas.map(area => [area.id, []]));
  for (const indicator of release.indicators) {
    const id = `sotkanet-${indicator.id}`;
    const rows = read(id, indicator.data, indicator.label);
    const metadata = read(`${id}-metadata`, indicator.metadata, `${indicator.label}: definition and limitations`);
    if (metadata.id !== indicator.id || metadata.title?.en !== indicator.title || metadata.primaryValueType?.code !== 'PROS' || (indicator.descriptionSha256 && digest(metadata.description?.en || '') !== indicator.descriptionSha256)) throw new Error(`Sotkanet indicator definition changed: ${indicator.id}`);
    if (!Array.isArray(rows) || !rows.length) throw new Error(`Empty Sotkanet indicator: ${indicator.id}`);
    const cells = new Map();
    for (const row of rows) {
      if (row.indicator !== indicator.id || row.gender !== 'total' || !indicator.years.includes(row.year) || !Number.isInteger(row.region) || !(row.value === null || (Number.isFinite(row.value) && row.value >= 0 && row.value <= 100))) throw new Error(`Unexpected Sotkanet observation: ${indicator.id}`);
      const key = `${row.region}:${row.year}`;
      if (cells.has(key)) throw new Error(`Duplicate Sotkanet observation: ${key}`);
      cells.set(key, row.value);
    }
    const latest = Math.max(...indicator.years);
    if (!areas.some(area => Number.isFinite(cells.get(`${area.sourceId}:${latest}`)))) throw new Error(`No current county/national observations: ${indicator.id}`);
    for (const area of areas) {
      // Keep the source's latest period explicit even when that county is missing.
      const series = indicator.years.filter(year => cells.has(`${area.sourceId}:${year}`) || year === latest)
        .map(year => ({ period: String(year), value: cells.get(`${area.sourceId}:${year}`) ?? null }));
      observations[area.id].push({ id: indicator.key, label: indicator.label, ...series.at(-1), series, unit: '%',
        areaLabel: area.name, scope: area.scope, relation: 'INDIRECT', sourceIds: [id, `${id}-metadata`, 'sotkanet-regions'],
        sourceUrl: indicator.data.url, retrievedAt: indicator.data.retrievedAt, note: indicator.note });
    }
  }
  return { sources, observations };
}
