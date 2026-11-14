import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

// Keep related measurements separate from strategy assessments. Provider queues,
// service use and national stage counts cannot be scored as county goal results.
export function buildObservations(regions, mortality, root) {
  const sources = {};
  function read(id, file, title, url) {
    const raw = readFileSync(resolve(root, file));
    sources[id] = { file, title, url, retrievedAt: id === 'early-stage' || id === 'stage-definition' ? '2026-11-13' : '2026-11-14', sha256: createHash('sha256').update(raw).digest('hex') };
    return file.endsWith('.csv') ? raw.toString('utf8') : JSON.parse(raw);
  }
  const base = 'research/06 Tekninen liite';
  const hilmo = read('oncology-patients', `${base}/THL jatkotarkistus/hilmo_oncology_explicit.json`, 'THL oncology specialty patients', 'https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j?filter=speciality-17958').dataset;
  const total = read('queue-total', 'research/09 Aineistojen syväanalyysi/work/thl_explicit.json', 'THL oncology waiting-list counts', 'https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne').dataset;
  const long = read('queue-long', `${base}/THL jatkotarkistus/queue_gt180_count.json`, 'THL oncology waits over 180 days', sources['queue-total'].url).dataset;
  const pct = read('queue-percent', `${base}/THL jatkotarkistus/queue_gt180_pct.json`, 'THL oncology waits over 180 days (%)', sources['queue-total'].url).dataset;
  const crosswalk = read('region-crosswalk', 'research/09 Aineistojen syväanalyysi/Yhdistelykoe/work/region_crosswalk.json', 'Explicit area name/code correspondence');
  if (JSON.stringify(total.dimension) !== JSON.stringify(long.dimension) || JSON.stringify(total.dimension) !== JSON.stringify(pct.dimension)) throw new Error('Queue dimensions differ');
  function cell(dataset, coordinates) {
    const dim = dataset.dimension;
    if (coordinates.length !== dim.id.length) throw new Error('Wrong number of coordinates');
    let offset = 0;
    dim.id.forEach((id, i) => {
      const index = dim[id].category.index[coordinates[i]];
      if (!Number.isInteger(index)) throw new Error(`Missing coordinate ${id}: ${coordinates[i]}`);
      offset = offset * dim.size[i] + index;
    });
    const raw = dataset.value[offset];
    // JSON-stat sparse cells, nulls and suppression tokens are not zero.
    if (raw == null || raw === '' || !/^\d+(\.\d+)?$/.test(String(raw))) return null;
    return Number(raw);
  }
  function keyFor(dataset, dimension, label) {
    const matches = Object.entries(dataset.dimension[dimension].category.label).filter(([, value]) => value === label);
    if (matches.length !== 1) throw new Error(`Missing or ambiguous ${dimension}: ${label}`);
    return matches[0][0];
  }
  const result = { schemaVersion: 1, sources, regions: {}, national: {} };
  function patients(label) {
    const area = keyFor(hilmo, 'area', label);
    const series = Object.entries(hilmo.dimension.time.category.label)
      .filter(([, year]) => /^\d{4}$/.test(year))
      .map(([time, year]) => ({ period: year, value: cell(hilmo, [area, time]) }))
      .sort((a, b) => a.period.localeCompare(b.period));
    return { id: 'oncology-patients', label: 'Oncology specialty patients', areaLabel: label, scope: 'Reported area', ...series.at(-1), unit: 'patients', series, sourceIds: ['oncology-patients', 'region-crosswalk'], note: 'Patients recorded in specialty 65 (oncology), not all cancer patients or patients treated on time. Source area definitions and boundary timing are not fully verified; do not rank counties or combine with screening cohorts.' };
  }
  const queueDate = '30.09.2026';
  function queue(label) {
    const area = keyFor(total, 'tuottaja', label);
    const time = keyFor(total, 'ajankohta', queueDate);
    const denominator = cell(total, [area, time]);
    const numerator = cell(long, [area, time]);
    const value = cell(pct, [area, time]);
    if (value !== null && (denominator === null || numerator === null || denominator <= 0 || numerator > denominator || Math.abs(100 * numerator / denominator - value) > .050001)) throw new Error(`Invalid queue ratio: ${label}`);
    return { id: 'oncology-queue', label: 'Oncology waiting over 180 days', areaLabel: label, scope: 'Provider', period: '2026-09-30', value, unit: '%', numerator, denominator, numeratorLabel: 'patients waiting over 180 days', denominatorLabel: 'patients on the waiting list', sourceIds: ['queue-total', 'queue-long', 'queue-percent'], note: 'Non-urgent oncology waiting list on the snapshot date: provider geography, not patient residence. This is not diagnosis-to-treatment time or a cancer-specific target. Missing cells stay missing; 180 days is not the strategy target.' };
  }
  for (const region of regions) {
    const matches = crosswalk.filter(row => row.statfin_region_code === region.id);
    if (matches.length !== 1) throw new Error(`Missing area mapping: ${region.id}`);
    const label = matches[0].statfin_region_label.replace(/^HVA\d+ /, '');
    const observations = [patients(label)];
    // Exact provider correspondence only; never distribute HUS across Uusimaa.
    const provider = region.id === 'HVA90' ? 'Helsingin sosiaali-, terveys- ja pelastustoimi' : label;
    if (Object.values(total.dimension.tuottaja.category.label).includes(provider)) observations.push(queue(provider));
    result.regions[region.id] = { treatment: observations };
  }
  result.national.treatment = [{ ...patients('Koko maa'), scope: 'Finland' }, { ...queue('Kaikki hyvinvointialueet'), scope: 'Published provider total' }];
  result.providers = [{ ...queue('HUS'), providerId: 'HUS', goalId: 'treatment', coveredRegionIds: ['HVA90', 'HVA01', 'HVA02', 'HVA03', 'HVA04'] }];

  read('mortality', mortality.source, 'Statistics Finland cancer death counts', 'https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/');
  sources.mortality.retrievedAt = mortality.retrievedAt;
  function deaths(rows, areaLabel, scope) {
    const series = rows.map(row => ({ period: String(row.year), value: row.deaths }));
    return { id: 'cancer-deaths', label: 'Cancer deaths (C00–C97)', areaLabel, scope, ...series.at(-1), unit: 'deaths', series, sourceIds: ['mortality'], note: 'Annual counts, not age-standardised rates. The strategy gives a rounded national reference of 13,300 deaths (10% lower is 11,970), not county-specific reduction baselines. Source uses 2026 county boundaries.' };
  }
  for (const [id, rows] of Object.entries(mortality.regions)) result.regions[id].mortality = [deaths(rows, regions.find(r => r.id === id).name, 'Reported area')];
  result.national.mortality = [deaths(mortality.national, 'Finland', 'Finland')];

  const lung = read('lung-survival', 'research/11 Dashboard integration/lung-survival.json', 'Cancer Registry 2024: regional lung cancer survival (tables 15.12–15.13)', 'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html');
  function survival(area) {
    const rows = lung.rows.filter(row => row.area === area);
    if (rows.length !== 2 || new Set(rows.map(r => r.sex)).size !== 2) throw new Error(`Missing lung survival: ${area}`);
    return rows.map(row => ({ id: `lung-survival-${row.sex}`, label: `Lung cancer five-year survival · ${row.sex}`, value: row.value, stratumLabel: row.sex, confidenceInterval: [row.lower, row.upper], unit: '%', period: lung.period, areaLabel: area, scope: area === 'Koko maa' ? 'Finland' : 'Reported area', sourceIds: ['lung-survival'], relation: 'DIRECT', note: 'Five-year relative survival, age-standardised to the national patient age distribution. Lung cancer only; sexes are separate. Pancreatic/liver county results and a matching Nordic strategy benchmark are still missing, so the complete goal cannot be scored.' }));
  }
  for (const region of regions) {
    const area = region.id === 'HVA90' ? 'Helsingin kaupunki' : region.id === 'HVA04' ? 'Vantaa ja Kerava' : region.name;
    result.regions[region.id].survival = survival(area);
  }
  result.national.survival = survival('Koko maa');

  const stage = read('early-stage', `${base}/Syöpärekisteri/stage_2020_2024_sample.csv`, 'Finnish Cancer Registry national stage counts', 'https://tilastot.syoparekisteri.fi/syovat/');
  const metadata = read('stage-definition', `${base}/Syöpärekisteri/stage_sample_metadata.json`, 'Stage sample cohort and selection');
  if (metadata.sha256 !== sources['early-stage'].sha256 || metadata.selection.area !== 'Koko maa') throw new Error('Stage sample provenance mismatch');
  const stageRows = stage.trim().split(/\r?\n/).slice(1).map(line => line.split(';'));
  result.national['early-stage'] = Object.entries({ Paikallinen: 'Localised cancer diagnoses', 'Ei paikallinen': 'Non-localised cancer diagnoses', Tuntematon: 'Diagnoses with unknown stage' }).map(([category, label]) => {
    const rows = stageRows.filter(row => row[1] === category);
    if (rows.length !== 2 || rows.some(row => !/^\d+$/.test(row[2]))) throw new Error('Invalid stage rows');
    return { id: `stage-${category}`, label, value: rows.reduce((sum, row) => sum + Number(row[2]), 0), unit: 'diagnoses', period: '2020–2024', scope: 'Finland', areaLabel: 'Finland · all cancers · both sexes', sourceIds: ['early-stage', 'stage-definition'], note: 'National aggregate across 2020–2024. Localised/non-localised is not TNM stages I–II; these counts cannot establish the county early-diagnosis goal.' };
  });
  for (const goals of [...Object.values(result.regions), result.national]) for (const [goal, rows] of Object.entries(goals)) for (const row of rows) {
    row.relation ||= goal === 'mortality' ? 'DIRECT' : 'INDIRECT';
    row.retrievedAt = sources[row.sourceIds[0]].retrievedAt;
    row.sourceUrl = sources[row.sourceIds[0]].url;
  }
  for (const row of result.providers) { row.relation = 'INDIRECT'; row.retrievedAt = sources['queue-total'].retrievedAt; row.sourceUrl = sources['queue-total'].url; }
  return result;
}
