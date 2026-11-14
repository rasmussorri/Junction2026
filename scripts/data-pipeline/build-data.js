import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { buildObservations } from './import-observations.js';
import { activeRelease, readRelease } from './source-release.js';
import { preventionObservations } from './import-prevention.js';

export function buildData(root, { releaseReference = activeRelease(root) } = {}) {
  const release = readRelease(root, releaseReference);
  const read = path => readFileSync(resolve(root, path));
  const source = 'research/09 Aineistojen syväanalyysi/Yhdistelykoe/work/joined_2024_regions.json';
  const raw = read(source);
  const rows = JSON.parse(raw);
  if (rows.length !== 22 || new Set(rows.map(r => r.region_code)).size !== 22) throw new Error('Expected 22 unique areas');
  const cervicalSource = 'research/06 Tekninen liite/Kohdunkaula ja seulontaviiveet/kohdunkaula_taulukot.json';
  const cervicalRaw = read(cervicalSource);
  const cervicalTable = JSON.parse(cervicalRaw).filter(t => t.headings.join('|') === 'Kohdunkaulasyövän seulontaohjelma: vuositilasto|Hyvinvointialueet|Seulontaketju|2024' && t.screening_group_explicit_label === 'Ikäryhmäseulonta');
  if (cervicalTable.length !== 1) throw new Error('Expected one 2024 cervical age-group table');
  const cervicalRows = cervicalTable[0].rows.slice(2);
  const programs = {
    breast: { name: 'Breast screening', denominatorLabel: 'Invited (Kutsuttu)', sourceUrl: 'https://stats.cancerregistry.fi/joukkistilastot/rinta.html', note: 'The source table labels the denominator “invited”; its introduction describes the total as selected. We retain the published rate.' },
    colon: { name: 'Colorectal screening', denominatorLabel: 'Selected (Poimittu)', sourceUrl: 'https://stats.cancerregistry.fi/joukkistilastot/suolisto.html', note: 'The denominator is people selected for screening, which is not necessarily the number actually sent an invitation.' }
  };
  programs.cervical = { name: 'Cervical screening', denominatorLabel: 'Invited (Kutsuttu)', sourceUrl: 'https://stats.cancerregistry.fi/joukkistilastot/kohtu.html', note: 'Age-group screening only. Risk-group follow-up is excluded. Since 2020, the source treats selected people as invited.' };
  const regions = rows.map(r => ({
    id: r.region_code, name: r.region_name === 'Helsingin kaupunki' ? 'Helsinki' : r.region_name,
    population: r.population_31dec_all_ages,
    screening: Object.fromEntries(['breast', 'colon'].map(p => [p, {
      rate: r[`${p}_participation_percent_published`], participated: r[`${p}_participated_count`],
      denominator: r[p === 'breast' ? 'breast_invited_label_count' : 'colon_selected_count']
    }]))
  }));
  for (const r of regions) {
    const name = r.id === 'HVA90' ? 'Helsingin kaupunki' : r.name;
    const matches = cervicalRows.filter(row => row[0] === name);
    if (matches.length !== 1) throw new Error(`Missing or duplicate cervical area: ${name}`);
    const row = matches[0];
    r.screening.cervical = { rate: Number(row[3].replace(',', '.')), participated: Number(row[2]), denominator: Number(row[1]) };
  }
  for (const r of regions) for (const m of Object.values(r.screening)) {
    if (![m.rate, m.participated, m.denominator].every(Number.isFinite) || m.participated > m.denominator || m.rate < 0 || m.rate > 100) throw new Error('Invalid screening observation');
  }
  const screening = {
    year: 2024, target: 80, checkedAt: '2026-11-14', source, sourceSha256: createHash('sha256').update(raw).digest('hex'),
    cervicalSource, cervicalSourceSha256: createHash('sha256').update(cervicalRaw).digest('hex'),
    coverage: '21 wellbeing services counties and Helsinki. Åland is excluded from this comparison; the cervical source includes it.',
    periodNote: 'Annual 2024 snapshot, assessed against the strategy benchmark. This is not a live feed or a single invitation round.',
    populationNote: 'Population is context only: year-end 2024 on 2026 boundaries. Screening geography timing is not fully verified. Never use population as the screening denominator.',
    programs, regions
  };

  if (release?.screening) {
    screening.year = release.screening.year;
    screening.checkedAt = release.screening.sources.breast.retrievedAt;
    screening.programSources = release.screening.sources;
    screening.periodNote = `Annual ${screening.year} snapshot, assessed against the strategy benchmark. This is not a live feed or a single invitation round.`;
    for (const region of regions) {
      const matches = release.screening.regions.filter(row => row.id === region.id);
      if (matches.length !== 1) throw new Error(`Invalid screening release area: ${region.id}`);
      region.screening = matches[0].screening;
    }
  }
  const mortalitySource = release?.mortality?.file || 'research/11 Dashboard integration/mortality-2020-2025.json';
  const mortalityRaw = read(mortalitySource);
  const mortality = JSON.parse(mortalityRaw);
  function deathCount(area, year) {
    const coordinates = [area, '04-21', String(year), 'ksyylkm'];
    if (mortality.id.join(',') !== 'alue_23_20260101,kuolinsyyt_1_20210101,timeperiod_y,contentscode') throw new Error('Unexpected mortality dimensions');
    let offset = 0;
    mortality.id.forEach((id, i) => {
      const index = mortality.dimension[id].category.index[coordinates[i]];
      if (!Number.isInteger(index)) throw new Error('Mortality coordinate missing');
      offset = offset * mortality.size[i] + index;
    });
    const count = mortality.value[offset];
    if (!Number.isInteger(count) || count < 0) throw new Error('Invalid mortality count');
    return { year, deaths: count };
  }
  const mortalityYears = release?.mortality?.years || [2020, 2021, 2022, 2023, 2024, 2025];
  const mortalitySnapshot = { source: mortalitySource, sourceSha256: createHash('sha256').update(mortalityRaw).digest('hex'), retrievedAt: release?.mortality?.retrievedAt || '2026-11-14', baseline: null, national: mortalityYears.map(y => deathCount('SSS', y)), regions: Object.fromEntries(regions.map(r => [r.id, mortalityYears.map(y => deathCount(r.id, y))])) };
  const evidence = JSON.parse(read('data/evidence-sources.json'));
  if (release) {
    screening.sourceRelease = releaseReference;
    evidence['source-release'] = { title: 'Source release manifest and exact requests', ...releaseReference };
    release.requests.forEach((request, i) => { evidence[`release-input-${i}`] = { title: request.title, file: request.file, sha256: request.sha256, url: request.url, retrievedAt: request.retrievedAt }; });
  }
  const observations = buildObservations(regions, mortalitySnapshot, root);
  if (release?.prevention) {
    const prevention = preventionObservations(release.prevention, root, regions);
    Object.assign(observations.sources, prevention.sources);
    for (const region of regions) observations.regions[region.id]['preventable-cancers'] = prevention.observations[region.id];
    observations.national['preventable-cancers'] = prevention.observations.national;
  }
  return { screening, mortality: mortalitySnapshot, observations, evidence, goalOwners: JSON.parse(read('data/goal-owners.json')) };
}
