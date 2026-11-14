# Sisu

A local dashboard for Finnish cancer strategy implementation. This is Rasmus’s UI; Niilo’s separate prototype lives in `../vahti-ui/`. Run the commands below from `sisu-ui/`.

- National map: the first screen shows the Finland map. Hover/focus previews goal counts; select a county on the map or in the dropdown to open its side panel.
- County side panel: all 12 strategy items, including the cross-cutting equity goal, with coloured theme cards and the target visible on every card. Select a goal for details; close the panel or press Escape to return to the map.
- Goal detail: programme percentages and a compact county bar chart, sorted by participation rate with the selected county highlighted and the target marked. Sources and definitions are expandable; chat and optional web research remain available. Verified goal owners appear when available.

## Run

Node.js 22+:

```sh
npm ci
cp .env.example .env  # optional: add a Gemini key for chat
npm run dev
```

Open http://localhost:5173. Set `GEMINI_API_KEY` in `.env`; restart the server after changing it. `GEMINI_MODEL` defaults to `gemini-3.5-flash`. React + Vite, Express, local JSON; no database or login.

```sh
npm test
npm run build
npm start
```

Stop the development server before starting production on the same port. The server binds to localhost. Frontend changes reload automatically; restart for backend code changes. Published data imports are picked up without restarting, and open pages refresh on focus or once per minute while visible.

## Data pipeline

```sh
npm run data:import   # Build, validate, and publish a snapshot from saved sources
npm run data:check    # Check sources, contract, checksums, and published/input consistency
npm run data:refresh  # Download and validate official screening, mortality and prevention sources
npm run data:history  # List archived published revisions
npm run data:rollback -- FULL_REVISION  # Restore a published revision
```

The API reads one canonical file, `data/dataset.json`. Imports build all components in memory and validate region IDs, source references, counts/rates, history, confidence intervals and missing values before publishing with an atomic rename. An invalid import does not replace the active snapshot. `screening.json`, `mortality.json`, and `observations.json` remain offline compatibility exports; the server does not combine them at request time.

`GET /api/data` returns schema v2: canonical measurements in observations, `goalDefinitions`, `snapshot` (revision, import time and reload state), `capabilities`, and per-goal `coverage`. The API no longer exposes the duplicate `region.screening` or top-level mortality measurement stores. Use `screeningObservation`/`metrics` and `goalView` to read values. Screening and other metrics share the `regions[].observations` contract: ID, label, value/null, unit, period, scope, DIRECT/INDIRECT classification, source IDs/URL/retrieval date, availability, missing reason, and optional history/interval/counts. Shared provider rows also declare their goal and covered HVA IDs. Ratio labels and survival strata belong to data. Source retrieval dates and measurement periods are preserved; importing does not make an old observation fresh.

`GET /api/data/status` reports the active revision, import time, coverage, and reload health. The server automatically loads changed snapshots, checks the payload checksum and schema, and keeps the last valid snapshot if a replacement is invalid. Published snapshots and their evidence are archived on disk; startup can recover from those archives if the active file is missing or damaged. The UI validates each response, bounds requests to 15 seconds, and reports fallback/refresh failures while retaining loaded data. Reload state is returned with the data, rather than joined from a separate health request. Conditional GETs use ETags. Evidence downloads are checked against the snapshot checksum and fall back to the archived bytes when originals change. Edit owners or source data, then reimport; do not hand-edit the generated snapshot.

Implementation: `scripts/build-data.js` and `scripts/import-observations.js` are source adapters; `src/data-contract.js` defines assembly and validation; `server/data-store.js` owns publication and reloads. No network calls are made during import/check. The separate refresh command uses the manifest in `data/refresh-sources.json`, validates all selected sources before publishing, and records immutable inputs plus exact requests. It requires Python 3 for standard-library HTML parsing. Commands resolve paths from the project root, independently of the shell's working directory.

## Data rules

`npm run data:import` reproduces screening, mortality and related observations from saved research sources, with checksums and explicit area mapping. It does not refresh remote data; use `data:refresh` for that. It replays the source release selected by the active snapshot. Original integration files are in `research/11 Dashboard integration/`; immutable refresh inputs and request manifests are in `research/12 Source releases/`. See [the operations runbook](docs/data-operations.md).

Screening includes published 2024 breast, colorectal and age-group cervical percentages for 21 counties and Helsinki. The card average is the simple mean of the three programme rates, not a pooled patient rate. The goal passes only if all three required programmes are present and reach 80%. Partial passing coverage stays unassessed; any observed programme below target establishes a miss. Risk-group cervical follow-up is excluded. Åland is outside the consistent comparison, although the cervical source includes it.

Five goals have area measurements: prevention risk factors; screening; 2020–2025 cancer deaths for all 22 areas; 2020–2024 five-year lung survival for women and men; and oncology specialty patient counts with available provider queue observations. National stage counts appear separately. Each observation carries DIRECT/INDIRECT classification, period, geography, source URL, retrieval date and source checksum. History and confidence intervals are displayed where available.

Prevention includes HPV two-dose coverage for girls/boys turning 13 (2026), adult daily smoking and excess alcohol use (2024), with history from 2022 where reported. These Sotkanet indicators are INDIRECT; the alcohol measure concerns alcohol users aged 20+, and HPV cohorts remain separate. They do not establish the number of cancers prevented.

Only screening currently has a complete county target assessment. The other values remain visible even when the full target cannot be scored. Mortality has no county strategy baselines; lung survival lacks the full three-cancer Nordic baseline comparison; oncology queues/service use are supporting indicators. Missing provider cells remain null and HUS appears only as shared provider context. No national figures are copied into county measurements. See [the integration audit](research/11%20Dashboard%20integration/integration-audit.md).

Peers meet 80% in the selected programme and year; closest total population first. None meets the combined screening goal in this snapshot. Outcomes alone are not evidence of what intervention worked.

`data/goal-owners.json` is currently empty. Only add a person when an official source explicitly establishes responsibility for that goal and provides direct contact details. Record `name`, `role`, `email` and/or `phone`, `sourceUrl`, and `checkedAt` under county ID and goal ID. Generic county directors in the old contacts file are not shown as goal owners. No messages are sent.

Chat receives all strategy goal definitions, selected-area observations, relevant national/shared context, programme peers and source references. Requests and saved-evidence citations carry the displayed dataset revision; stale revisions return 409 before a model call. Web research can find external evidence and responsible contacts but must not fill missing local metric values. Live chat and web research require a valid Gemini key and available provider credits. Data views work without AI.

Map: Statistics Finland 2024 wellbeing services counties, 1:4,500,000 geometry, EPSG:3067 projected to SVG, CC BY 4.0. Source layer `tilastointialueet:hyvinvointialue4500k_2024` at https://geo.stat.fi/geoserver/tilastointialueet/wfs.

This folder includes the research files required by its snapshot, importer and tests in `research/`; the full shared research vault remains at the repository root. Generated publication history is local and excluded from Git. Only explicitly allowlisted evidence files are exposed at `/api/evidence/:id`; the research directory and environment files are not generally served.

See the [data model audit and implementation plan](docs/data-model-audit.md) for the data-flow diagrams, prioritized findings, completed fixes and remaining work.
