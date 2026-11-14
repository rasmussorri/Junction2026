# Strategy goal data audit — 14 November 2026

> Historical audit of the initial snapshot. Superseded for data availability by [the integration audit](11%20Dashboard%20integration/integration-audit.md). County mortality and lung survival have since been sourced, and related observations now reach the frontend. Missing target components still prevent full county assessment.

Scope: the research files already in this repository. Web research for contacts does not supply or replace metric observations. Strategy targets are not observations. Missing county metrics display exactly `not found from current datasets` and remain unknown.

| Goal | Finding | Local evidence |
| --- | --- | --- |
| Cancer-unit NPS >80 | Target only; no observed county/unit scores | 01 Tausta/PDF-tarkistus/work/1_text.txt and 2_text.txt; 05 Raportti/Junction 2026 - syöpädata ja MVP.md |
| Screening >=80% in each programme | 2024 breast, colorectal and age-group cervical rates for 21 counties and Helsinki | 09 Aineistojen syväanalyysi/Yhdistelykoe/work/joined_2024_regions.json; 06 Tekninen liite/Kohdunkaula ja seulontaviiveet/kohdunkaula_taulukot.json, table index 75 |
| >=70% stages I–II | National localised/non-localised stage sample is not county TNM I–II | 06 Tekninen liite/Syöpärekisteri/stage_2020_2024_sample.csv; D01 dataset card |
| Poor-prognosis 5-year survival at Nordic level | No matching county lung, pancreas and liver survival plus Sweden–Norway benchmark | 06 Tekninen liite/Vertailu ja alueet/nordcan_profile.json contains an incidence sample; myeloma survival is a different cancer |
| Cancer mortality -10% | National and Helsinki 2024–2025 counts exist, but no confirmed strategy baseline for goal reduction | 06 Tekninen liite/Tilastokeskus ja Sotkanet/work/13u5_sample.json |
| Treatment within target times | Queue snapshots do not identify the required cancer-specific diagnosis-to-treatment cohort and target intervals | 03 Dataset-kortit/D14 Erikoissairaanhoidon hoitoonpääsy ja jonot.md |
| New clinical and registry studies +10% annually | No comparable annual county counts | Strategy and roadmap text; research inventory/report |
| Interventional trial recruitment >10% | No county recruitment numerator and matching cancer-patient denominator | Strategy and roadmap text; research inventory/report |

## Screening rules

The displayed average is the arithmetic mean of available published programme percentages, rounded to one decimal only for display. It is not a pooled patient participation rate: cohorts differ and people may appear in more than one programme. A screening goal passes only when EVERY included programme's published rate is at least 80%. Missing programmes are not assigned zero; coverage is shown. All 22 comparison areas have all three programmes. Cervical risk-group screening (table 76) is not mixed with age-group screening (table 75). Åland has cervical data but is outside the consistent 22-area comparison.

Peers pass in the selected programme and 2024, not necessarily the combined screening goal. All colorectal percentages are below 80%, so no area meets the combined goal. This yields 0 met, 1 missed and 7 unknown for each county. This is partial coverage, not evidence that the other seven goals failed. The strategy benchmark is applied retrospectively to 2024; no claim is made that a 2035 deadline has passed.

## Mortality context

13u5 sample dimensions are area, underlying cause, year, measure. Underlying cause 04–21 (C00–C97), count measure ksyylkm: Helsinki 1,213 (2024), 1,273 (2025); Finland 13,316 (2024), 13,424 (2025). These are contextual death counts, not a measured reduction against an established strategy baseline. Neither the strategy's rounded 13,300 nor the previous year is silently used as a baseline. County boundaries in the sample are 2026 boundaries.

## Responsibility verification

Existing contacts.json entries are county directors, not verified owners of these goals. They are excluded from the goal-owner UI. Official county screening service and organisation pages checked did not establish a named accountable owner with direct contact for a specific strategy goal. No owner is assigned on title alone. The goal owner registry remains empty until explicit responsibility and a direct contact route can be verified. The UI displays `Responsible person not verified.` Research can seek these contacts but must cite official evidence and distinguish service contacts from accountable owners.
