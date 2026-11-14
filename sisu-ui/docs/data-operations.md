# Refresh, replay and recovery

Implemented 14 November 2026. The app still consumes one validated snapshot. Network acquisition and source parsing happen outside request handlers.

## Commands

```sh
npm run data:refresh                         # Screening, mortality and prevention
npm run data:refresh -- --source screening   # All three screening programmes together
npm run data:refresh -- --source mortality
npm run data:refresh -- --source prevention
npm run data:check                           # Offline consistency check
npm run data:import                          # Offline replay; also updates compatibility exports
npm run data:history                         # Published full revision IDs, newest activation first
npm run data:rollback -- FULL_REVISION       # Restore a previously published snapshot
```

Node 22+ and Python 3 are required for refresh. Python uses only its standard library to parse screening HTML; it never executes report scripts. These are one-shot commands suitable for an external scheduler. No recurring background job is installed on the user's machine.

`data/refresh-sources.json` declares endpoints, adapters, metric IDs, minimum periods and reviewed cohort definitions. All pipeline commands use `data/.pipeline.lock` to prevent simultaneous writers. If a process was forcibly killed, inspect `owner.json` and remove the lock directory only after confirming its process has stopped.

## Publication and provenance

Each refresh downloads exact responses, with HTTP method/body, request time, retrieval date, final URL, status, byte count and SHA-256 in an immutable release under `research/12 Source releases/`. The release retains inputs from sources not selected for that refresh. The active snapshot contains the selected release reference. `data:import` and `data:check` replay it without network access; they do not silently return to the original hard-coded files. Source observation periods remain distinct from retrieval/import dates.

Responses have a 30-second timeout and 40 MiB size limit. Transient network failures, HTTP 429 and server errors get at most three attempts. All selected sources must download, parse, join and pass the dataset contract before the active snapshot is replaced. A failed download or validation leaves the active revision intact. `data/refresh-status.json` records the latest attempt; `/api/data/status` exposes it alongside the active revision and recovery state. Failed candidates are never selected by the server.

`data:refresh` publishes the canonical API snapshot. Run `data:import` afterwards if standalone `screening.json`, `mortality.json` and `observations.json` compatibility exports are needed. The frontend does not read those exports.

## Adapter rules

- Screening: select the latest common county year across breast, colorectal and cervical reports, never older than the active period. Verify table headings, column meanings, unique county correspondence and published percentage/count arithmetic. Cervical data must explicitly be age-group screening. Åland and national total rows do not enter the 22-county join. Population remains separately labelled 2024 context.
- Mortality: query StatFin metadata first, then request C00–C97 death counts for all 22 HVA IDs and Finland, from 2020 through the latest available completed year. Reject changed dimension codes, missing selections and older releases. Counts do not create a county reduction baseline.
- Prevention: Sotkanet IDs 3869 (HPV girls), 3297 (HPV boys), 4404 (daily smoking), 4411 (AUDIT-C). Use official `HYVINVOINTIALUE` codes for county joins and the separate Finland entry. Preserve returned periods and historical observations; a missing latest cell stays null. The HPV API exposes `gender=total` within each sex-specific indicator. Female/male queries returned empty arrays and are not used. Metadata descriptions are pinned by checksum so a changed cohort requires review. All four metrics remain **INDIRECT**; none scores the preventable-cancer reduction target.

## Durable history and rollback

Before replacement, the publisher archives the previous and new snapshot, including every allowlisted evidence file, under `data/history/<revision>/`. `published.json` records activated revisions. The archive is not exposed as a static web directory.

If the active JSON is missing or invalid at server startup, the server tries the most recently activated valid archive, then older published archives. Archive snapshots and source bytes must pass checksum validation. The UI receives `serving_previous_snapshot` until a valid snapshot is restored. Current evidence requests use matching live bytes or the archived copy, so edits to research files cannot silently change the evidence supporting a displayed value. Saved HTML is served as plain source text.

Rollback validates the selected archive and atomically replaces the active snapshot. It does not overwrite research files or owner configuration. It restores that snapshot's source-release selection; replay works while the selected source files and other build inputs remain available and unchanged. If current inputs differ, `data:check` reports the difference instead of overwriting the restored dataset. Archived evidence remains readable even if the originals were changed or removed.

Back up both `data/history/` and `research/12 Source releases/` to retain recovery and reproducibility. Archives are retained; automated retention/pruning is not implemented. Future incompatible schema changes need migration before old snapshots can be restored.

## Verified result

Live official-source refresh succeeded for screening (2024), mortality (2025), HPV vaccination (2026) and smoking/alcohol use (2024). Four prevention measurements now cover every county, bringing measured county goals from four to five. Their target assessment remains unknown because risk factors are not observed preventable-cancer reductions.

48 automated tests cover source reproduction, incomplete joins, changed definitions, wrong strata, nulls, download failures, concurrency, archived evidence, restart recovery and rollback. Offline replay matches the published revision. A real rollback to the prior release and restoration of the new release both passed consistency checks.

NPS/PROM, county TNM I–II, the complete Nordic survival benchmark, trial recruitment and registry-study counts still need suitable evidence. No values were estimated for them. Endpoint reachability or an aggregate registry search count alone does not establish those outcomes.
