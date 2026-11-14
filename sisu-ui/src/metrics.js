export function screeningObservation(region, program) {
  // The fallback supports standalone legacy exports; canonical snapshots never
  // contain region.screening. An explicitly missing canonical row stays missing.
  if (region.observations?.screening) {
    const row = region.observations.screening.find(row => row.id === `screening-${program}`);
    return { rate: row?.value ?? null, participated: row?.numerator ?? null, denominator: row?.denominator ?? null, period: row?.period ?? null };
  }
  return { rate: null, participated: null, denominator: null, ...region.screening?.[program], period: String(region.screeningYear ?? 2024) };
}
export function metrics(region, program, target = 80) {
  const { rate, participated, denominator } = screeningObservation(region, program);
  const observed = Number.isFinite(rate);
  return { rate, participated, denominator, met: observed ? rate >= target : null, gap: observed ? +(target - rate).toFixed(1) : null, additional: observed && Number.isFinite(denominator) && denominator > 0 && Number.isFinite(participated) ? Math.max(0, Math.ceil(denominator * target / 100) - participated) : null };
}
export function peersFor(dataset, regionId, program) {
  const selected = dataset.regions.find(r => r.id === regionId);
  if (!selected) return [];
  const period = screeningObservation(selected, program).period;
  return dataset.regions.filter(r => r.id !== regionId && screeningObservation(r, program).period === period && metrics(r, program, dataset.target).met)
    .sort((a, b) => Math.abs(a.population - selected.population) - Math.abs(b.population - selected.population));
}
export function benchmark(dataset, program) {
  const rows = dataset.regions.map(r => screeningObservation(r, program)).filter(r => Number.isFinite(r.participated) && Number.isFinite(r.denominator) && r.denominator > 0 && (!dataset.year || r.period === String(dataset.year)));
  const total = rows.reduce((s, r) => s + r.denominator, 0);
  return total ? rows.reduce((s, r) => s + r.participated, 0) / total * 100 : null;
}

export function screeningComparison(dataset, program) {
  return dataset.regions.map(region => ({
    id: region.id, name: region.name, ...screeningObservation(region, program),
  })).filter(row => Number.isFinite(row.rate) && row.period === String(dataset.year))
    .sort((a, b) => b.rate - a.rate || a.name.localeCompare(b.name, 'fi'));
}
