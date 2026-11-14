# Junction 2026 — Cancer Strategy Monitor (Vahti UI)

> **Implementation and policy action platform for Finland's National Cancer Strategy 2026–2035**  
> An evidence-based data and AI solution for the AstraZeneca challenge. Tracks cancer screening participation, care pathway delays, and mortality targets across all 22 Finnish wellbeing services counties (*hyvinvointialueet*).

---

## 🌟 Key Features

- **Interactive Wellbeing County Map**: Visual comparison and ranking of all 22 wellbeing services counties against national strategic targets.
- **National Strategy Indicators**:
  - Cancer screening participation rates (breast, cervical, and colorectal cancer)
  - HPV vaccination coverage (girls and boys)
  - Cancer treatment guarantee compliance (THL specialized healthcare queues and >90-day delays)
  - Cancer mortality trends and reduction trajectories
- **Reliable, Grounded AI Chat (Gemini 3.5 Flash)**:
  - Directly reads the active page view and canonical dataset to ground its responses.
  - Powered by Google Search grounding for real-world research evidence.
  - Whitelist-enforced source citations: only links from verified health authorities and academic publishers (THL, Finnish Cancer Registry, Duodecim, STM, Fimea, HUS) are displayed.
- **Action Reports & Peer Learning**: Pre-compiled policy reports highlighting peer solutions from Finnish counties and Nordic neighbours that successfully meet targets.
- **Standalone Single-File Distribution**: Complete dashboard bundled into an offline, self-contained HTML file ([vahti.html](vahti-ui/vahti.html)).

---

## 🚀 Getting Started & Execution

### 1. Local Development (Python Standard Library)

```bash
# Start the server (Python 3 standard library only, zero external pip dependencies)
cd vahti-ui && python3 server.py
```
Open in browser: **http://localhost:8765**

*(macOS: you can also double-click `vahti-ui/Kaynnista_vahti.command`)*

### 2. Standalone HTML (Zero Server / Offline)
Double-click [vahti-ui/vahti.html](vahti-ui/vahti.html). The complete UI, map visualizations, data, local fonts, and policy reports run directly in your browser (excluding live streaming AI chat).

### 3. Vercel Cloud Deployment
The repository is pre-configured for one-click deployment on Vercel:
- **Static Assets**: Distributed globally via Vercel Edge CDN ([public/](public/)).
- **Serverless API**: Streaming Python Serverless Functions ([api/index.py](api/index.py)).

**Deployment Steps:**
1. Import the repository into Vercel (`New Project` → select `Junction2026`).
2. Add Environment Variables:
   - `GEMINI_API_KEY`: your Gemini API key
   - `GEMINI_MODEL`: `gemini-3.5-flash`
3. Click **Deploy**.

---

## 🔑 Environment Variables (`.env`)

A single [/.env](.env) file in the repository root configures both local runs and cloud environments:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
EXA_API_KEY=your_exa_api_key
```

---

## 📁 Repository Structure

| Directory / File | Description |
|---|---|
| [`vahti-ui/`](vahti-ui/) | Primary application: Python server (`server.py`), standalone bundler (`make_standalone.py`), and policy reports |
| [`public/`](public/) | Static web assets served by Vercel Edge CDN (`index.html`, `app.js`, `styles.css`, `data.json`, `fonts/`) |
| [`api/`](api/) | Vercel Serverless Function entry point (`api/index.py`) |
| [`data/`](data/) | Canonical data layer (`dataset.json`, screening rates, mortality, and regional statistics) |
| [`research/`](research/) | Research vault and Obsidian notes (`00 Ohjaus` – `13 Prevention integration`) |
| [`docs/`](docs/) | Architecture, data model audits, and integration documentation |
| [`scripts/`](scripts/) | Verification and data pipeline tools (`validate_publication.py`, `scripts/data-pipeline/`) |
| [`archive/`](archive/) | Archived earlier prototypes (gitignored) |
| `Finland - Cancer data - Junction 2026.xlsx` | Primary raw research dataset |

---

## 🧪 Data Validation & Quality Assurance

Verify dataset integrity and sample calculations from the project root:

```bash
python3 scripts/validate_publication.py
```

Rebuild `static/data.json`, `public/data.json`, and the standalone `vahti.html` from the canonical dataset:

```bash
cd vahti-ui
python3 build_data.py       # Syncs data/dataset.json -> static/data.json & public/data.json
python3 make_standalone.py  # Builds standalone vahti.html
```

---

## 📜 Data Sources & Disclaimer

- **Data Sources**: Finnish Cancer Registry (*Suomen Syöpärekisteri*), Finnish Institute for Health and Welfare (*THL*), Statistics Finland (*Tilastokeskus*), NORDCAN, and Finland's National Cancer Strategy 2026–2035. License details: [DATA_SOURCES.md](DATA_SOURCES.md).
- **Disclaimer**: Data and indicators represent regional population-level aggregates and do not constitute individual medical advice or clinical guidelines. A missing observation does not imply missing care; regional correlation does not imply individual causation.
