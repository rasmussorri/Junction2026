# Prevention source integration — 14 November 2026

Sotkanet REST access succeeded during this implementation, despite 403 responses in the earlier workspace research. The source catalog identified indicators 3869 (HPV girls), 3297 (HPV boys), 4404 (daily smoking, age 20+) and 4411 (AUDIT-C, alcohol users age 20+).

Verified metadata: [HPV girls](https://sotkanet.fi/sotkanet/fi/metadata/indicators/3869), [HPV boys](https://sotkanet.fi/sotkanet/fi/metadata/indicators/3297), [smoking](https://sotkanet.fi/sotkanet/fi/metadata/indicators/4404), [alcohol](https://sotkanet.fi/sotkanet/fi/metadata/indicators/4411).

Both HPV indicators describe two vaccine doses among children turning 13 in the reporting year. Although the metadata identifies female/male cohorts, the data API exposes these sex-specific indicators through `genders=total`; female/male requests returned empty arrays. An empty response was never treated as zero. Smoking and alcohol are self-reported survey estimates; the alcohol denominator is alcohol users.

County joins use official Sotkanet `HYVINVOINTIALUE` codes, including code 90 for Helsinki. The national row uses the separate `MAA` / code 358 entry. No municipal row is substituted for a county row. Four indicators now cover all 22 counties, with national context kept separately and history from 2022 where available. Latest HPV period: 2026; survey period: 2024. Every observation is INDIRECT and leaves the cancer-reduction target unassessed.

Exact successful requests, metadata, region catalog, values, timestamps and checksums are preserved under `research/12 Source releases/` and linked from the active dataset. Exploratory duplicate files were removed after the validated release was published. See [the operations runbook](../../docs/data-operations.md).

The workbook named in the supplied discovery prompt was not present in the current workspace. Existing research files and official APIs supplied the connected observations. ClinicalTrials.gov API reachability was checked, but a query count alone does not establish annual Finnish starts, registry-study totals or patient recruitment; no such metric was loaded from that probe.
