# Dashboard data integration — 14 November 2026

The initial UI exposed screening only and discarded useful measurements when a complete strategy target could not be assessed. The import now separates measurements from target assessment and attaches observations to the existing HVA IDs. The API, county cards, goal reports, map tooltips and AI context use the same joined dataset.

## Available data

| Goal | Integrated observations | Geography | Assessment limitation |
| --- | --- | --- | --- |
| Screening | Three 2024 programme participation rates | All 22 areas | Complete county target assessment |
| Survival | Five-year relative lung survival, women and men separately, 2020–2024, with confidence intervals | All 22 areas and Finland | Missing complete three-cancer comparison and comparable Nordic strategy baseline |
| Mortality | Annual cancer deaths, 2020–2025 | All 22 areas and Finland | Strategy reference 13,300 is national; no county baselines are specified |
| Treatment | Oncology specialty patients, 2015–2025; reported oncology queues over 180 days, 30 September 2026 | Reported area / provider, explicitly distinguished | Service use and queue snapshots do not measure cancer-specific diagnosis-to-treatment intervals |
| Early diagnosis | National localised/non-localised/unknown-stage diagnosis counts, 2020–2024 | Finland only | Not TNM I–II; not county data |
| Patient experience | No matching cancer-unit NPS observation found | — | Data source missing |
| New studies | No comparable clinical plus registry study series found | — | Data source missing |
| Trial participation | No matched patient recruitment numerator and denominator found | — | Data source missing |

DIRECT means the observation measures an outcome within the target; partial coverage or missing baselines can still prevent target assessment. INDIRECT means supporting context. Do not use an INDIRECT value to manufacture a target status. National and shared-provider observations remain separate from county observations. HUS figures are displayed as shared provider context for Helsinki and the four Uusimaa counties, never apportioned or counted five times.

## New source acquisition

Mortality: POST `mortality-query.json` to `https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px`. Metadata and the original JSON-stat2 response are saved alongside the query. Retrieved 2026-11-14. Select cause 04–21 (C00–C97), all 22 dashboard HVA IDs plus SSS, 2020–2025, and counts/crude rates. The dashboard currently displays death counts. The source uses 2026 boundaries. It reproduces the prior Helsinki 2024/2025 values (1,213/1,273) and national values (13,316/13,424).

Survival: [Finnish Cancer Registry, Syöpä 2024](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html), tables 15.12 and 15.13. Retrieved 2026-11-14 using the web reader after direct HTTP download returned 403. `lung-survival.json` stores the numeric table cells, sex, area, confidence bounds and method. Survival is age-standardised to the national patient age distribution. Do not average the sexes, confuse diagnosis period with follow-up duration, or compare this standardisation directly to a different NORDCAN estimator. Table names `Vantaa ja Kerava` and `Helsingin kaupunki` have explicit mappings to HVA04 and HVA90. Regional YTA aggregates are excluded from county joins.

Other observations replay the existing saved research responses. `data/observations.json` records source checksums, dates, URLs and source IDs. The stage CSV is checked against its selection/metadata sidecar. Queue count, denominator and percentage dimensions must match, and all reported ratios must agree to published rounding. Null/sparse cells stay null; actual zero remains zero.

## Useful guidance extracted from the supplied prompt

- Start with source dictionaries and indicator metadata; preserve original Finnish labels and explicit region mappings.
- Use DIRECT/INDIRECT classification and separate national, county and provider scopes.
- Preserve source URL, retrieval date, period, history and missingness for each observation.
- The named workbook and `vahti-ui/build_data.py` were not found in this checkout or the connected Drive searches. This app uses `scripts/import-data.js`, `data/`, and React in `src/`; the same structure is adapted here.
- A trial count divided by new patient cases is not a patient recruitment percentage. It is not used as the >10% trial participation metric.
- A queue over 90 or 180 days is not automatically a verified breach of a diagnosis-to-treatment measure without matching clock definitions and cohorts.
- The national stage documentation completeness figure (~42%) is not the share diagnosed at stages I–II.

Additional source checks: targeted official-source searches did not yield matching county cancer-unit NPS, TNM I–II rates or trial recruitment numerators/denominators. The NORDCAN survival interface was inspected, but no validated survival API response or historical 2023 benchmark was obtained in this pass. The incidence-only local NORDCAN sample is not used as survival data. These remain explicitly documented gaps rather than estimated values.

## Verification

`npm run data:import`, `npm test`, and `npm run build`. Regression checks cover all 22 area joins, source checksums, sparse queue cells vs zero, HUS separation, sex-specific survival/confidence bounds, national stage scope and mortality history. Browser checks verify API/evidence delivery, visible county measurements and map availability.
