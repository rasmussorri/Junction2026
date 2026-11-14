import { screeningObservation } from './metrics.js';
export const MISSING = 'not found from current datasets';
export const PROGRAMS = ['breast', 'colon', 'cervical'];
export const GROUPS = [
  'Strengthen participation and develop people-centred services',
  'Reduce the cancer burden through prevention and early detection',
  'Ensure equitable and effective cancer care',
  'Stay at the forefront in a changing environment',
  'Equity',
];
export const GOALS = [
  { id: 'patient-reported-measures', group: 0, name: 'Patient-reported measures', measure: 'Care experience, quality of life and wellbeing', target: 'Systematically measure and report care experience (NPS), quality of life and wellbeing (PROM)', reason: 'The current dataset does not establish whether these measures are systematically collected and reported by each county. No numeric PROM threshold is specified in the strategy figure.' },
  { id: 'nps', group: 0, name: 'Patient experience', measure: 'NPS at cancer treating units', target: 'NPS above 80 in units treating cancer patients', reason: 'The research contains the NPS target, but no measured cancer-unit NPS by county.' },
  { id: 'preventable-cancers', group: 1, name: 'Preventable cancers', measure: 'Annual reduction in preventable cancer cases', target: '1,000 fewer preventable cancer cases per year nationally', strategyNote: 'The strategy estimates around 10,000 preventable cancers nationally. This is a reference estimate, not an observed county value or a county allocation.', reason: 'No comparable county measurements of preventable cancer cases or assigned county reduction targets are loaded. Total cancer incidence cannot be substituted for preventable cases.' },
  { id: 'screening', group: 1, name: 'Screening participation', measure: 'Average across available programmes', target: 'At least 80% participation in every screening programme in every county', reason: 'Published 2024 breast, colorectal and age-group cervical screening rates are available for all 22 areas.' },
  { id: 'early-stage', group: 1, name: 'Early diagnosis', measure: 'Diagnoses at stages I–II', target: 'At least 70% of cancers diagnosed at stages I–II', reason: 'The stage sample is national and uses localised/non-localised categories. It does not provide county-level TNM stages I–II.' },
  { id: 'survival', group: 2, name: 'Five-year survival', measure: 'Poor-prognosis cancers', target: 'Five-year survival for poor-prognosis cancers reaches the Nordic level', strategyNote: 'The Nordic benchmark is the mean of Sweden and Norway. The strategy footnote specifies increases from the 2023 NORDCAN level of more than 14 percentage points for lung cancer, 6 for pancreatic cancer and 14 for liver cancer.', reason: 'County lung cancer five-year relative survival is available for women and men. The full goal also needs pancreatic and liver survival plus a comparable Sweden–Norway benchmark tied to the strategy baseline.' },
  { id: 'mortality', group: 2, name: 'Cancer mortality', measure: 'Reduction from strategy baseline', target: 'Reduce cancer mortality by 10%', strategyNote: 'The strategy cites approximately 13,300 cancer deaths per year nationally. It does not assign county baselines.', reason: 'Annual cancer deaths for 2020–2025 are available for all 22 areas. The strategy gives a rounded national reference of 13,300 deaths (10% lower is 11,970), but does not specify county baselines. County counts are shown without inventing county reduction targets.' },
  { id: 'treatment', group: 2, name: 'Timely treatment', measure: 'Patients treated within target times', target: 'Patients receive treatment within cancer-specific target times', strategyNote: 'The strategy refers to THL Guidance 21/2016 on monitoring access to cancer treatment.', reason: 'The waiting-list snapshots do not measure the required cancer-specific diagnosis-to-treatment intervals. General waiting-list figures cannot establish this goal.' },
  { id: 'studies', group: 3, name: 'New cancer studies', measure: 'Annual growth in clinical and registry studies', target: 'Increase new clinical cancer and registry studies by 10% per year', strategyNote: 'The strategy footnote sets a national ambition of approximately 200 new clinical cancer studies per year by 2035. This is an annual total, not 200 cumulative studies or a county quota.', reason: 'No comparable annual county-level counts of new clinical cancer and registry studies were found.' },
  { id: 'trials', group: 3, name: 'Trial participation', measure: 'Cancer patients recruited to interventional trials', target: 'More than 10% of cancer patients recruited to interventional trials', reason: 'No county-level trial recruitment count and matching cancer-patient denominator were found.' },
  { id: 'medicine-assessment', group: 3, name: 'Cancer-medicine assessment', measure: 'Assessment pathway for cancer medicines', target: 'Assess cancer medicines through a single assessment pathway', reason: 'No measurement of implementation of the single assessment pathway is loaded. This is a system-level process goal, not a numeric county outcome.' },
  { id: 'equity', group: 4, name: 'Equity in cancer services', measure: 'Use of regional and socioeconomic differences in service planning', target: 'Make regional and socioeconomic differences in cancer incidence, care and mortality available and use them to guide services', reason: 'Regional observations alone do not establish this goal. The current dataset does not demonstrate that the required socioeconomic comparisons are available or that these differences are used to guide each county’s services.' },
];
export function goalResult(region, goalId, config = {}) {
  if (goalId !== 'screening') return { status: 'unknown', value: null, label: MISSING, year: null };
  const rows = Object.fromEntries(PROGRAMS.map(p => [p, screeningObservation(region, p)]));
  const year = config.year ?? region.screeningYear ?? Number(PROGRAMS.map(p => rows[p]).find(row => Number.isFinite(row.rate))?.period);
  const target = config.target ?? 80;
  const available = PROGRAMS.filter(p => Number.isFinite(rows[p].rate) && rows[p].period === String(year));
  if (!available.length) return { status: 'unknown', value: null, label: MISSING, year: null };
  const value = available.reduce((sum, p) => sum + rows[p].rate, 0) / available.length;
  // A failing programme establishes a miss, but partial passing coverage cannot
  // establish that every required programme met the target.
  const status = available.some(p => rows[p].rate < target) ? 'missed' : available.length === PROGRAMS.length ? 'met' : 'unknown';
  return { status, value, label: `${value.toFixed(1)}%`, year, programs: available };
}
export function goalCounts(region, config) {
  return GOALS.reduce((counts, goal) => { counts[goalResult(region, goal.id, config).status]++; return counts; }, { met: 0, missed: 0, unknown: 0 });
}
export function goalOwner(data, regionId, goalId) {
  // A leadership title alone is not evidence of responsibility for a strategy goal.
  return data.goalOwners?.[regionId]?.[goalId] || null;
}
