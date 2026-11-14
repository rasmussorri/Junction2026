# Cancer Strategy Monitor – UI (local)

Quick look (no server): double-click `vahti.html`. Everything works except the AI chat and new AI reports.

Full version with AI chat (Python 3, nothing to install):

    double-click Kaynnista_vahti.command   (or: python3 server.py)

then open http://localhost:8765 and keep the Terminal window open.

The chat and new AI reports need a Gemini key: copy `.env.example` to `.env`, add the key and restart.

- `static/` UI (HTML/CSS/JS) and `data.json` (built from "Finland - Cancer data - Junction 2026.xlsx")
- `reports/` ready AI reports (screening, waiting times, mortality, HPV); others are compiled from the web on first open
- `data_adapter.py` reads the shared dataset (`../sisu-ui/data/dataset.json`) and falls back to `static/data.json`; `build_data.py` refreshes `static/data.json` from it
- `make_standalone.py` builds `vahti.html` (everything in one file)
- Font: DM Sans (`static/fonts`, SIL Open Font License)
- Contacts are placeholders (Example Person, example.example@<area>.fi), not real people or addresses.
