# Junction 2026 — Cancer Strategy Monitor (Vahti UI)

> **Suomen Kansallisen syöpästrategian 2026–2035 seuranta- ja toimenpidealusta**  
> Lähteistetty data- ja tekoälyratkaisu AstraZeneca-haasteeseen. Seuraa syöpäseulontojen, hoitoviiveiden ja kuolleisuustavoitteiden toteutumista hyvinvointialueittain.

---

## 🌟 Tärkeimmät ominaisuudet

- **Interaktiivinen hyvinvointialuekartta**: Kaikkien 22 hyvinvointialueen vertailu ja sijoitus suhteessa kansallisiin tavoitteisiin.
- **Kansallisen strategian mittarit**:
  - Syöpäseulontojen osallistumisasteet (rinta-, kohdunkaula- ja suolistosyöpä)
  - HPV-rokotuskattavuus (tytöt ja pojat)
  - Syövän hoitotakuun toteutuminen (THL:n erikoissairaanhoidon jonot ja >90 vrk viiveet)
  - Syöpäkuolleisuuden kehityssuunnat
- **Luotettava, lähteistetty AI-chat (Gemini 3.5 Flash)**:
  - Vastaa kysymyksiin sovelluksen avoimen näkymän ja kanonisen datan pohjalta.
  - Hyödyntää Google Search -ankkurointia (Grounding).
  - Vahvistaa lähteet vain virallisten terveysviranomaisten ja tutkimustahojen (THL, Syöpärekisteri, Duodecim, STM, Fimea, HUS) verkkotunnuksista.
- **Toimenpideraportit & vertaisoppiminen**: Esimerkkejä ja vertaisratkaisuja alueilta ja Pohjoismaista, joissa tavoitteet on saavutettu.
- **Yhden tiedoston standalone-tuki**: Voidaan paketoida ja avata suoraan selaimessa ilman palvelinta.

---

## 🚀 Käynnistys ja käyttö

### 1. Paikallinen ajo (Local Development)

```bash
# Käynnistä palvelin (Python 3 standardikirjasto, ei raskaita asennuksia)
cd vahti-ui && python3 server.py
```
Avaa selaimessa: **http://localhost:8765**

*(macOS: voit myös kaksoisnapsauttaa tiedostoa `vahti-ui/Kaynnista_vahti.command`)*

### 2. Itsenäinen HTML (ilman palvelinta)
Avaa kaksoisnapsauttamalla [vahti-ui/vahti.html](vahti-ui/vahti.html). Kaikki aineistot, kartat, fontit ja raportit toimivat suoraan selaimessa (pois lukien suoratoistava AI-livechat).

### 3. Vercel Cloud Deployment
Sovellus on optimoitu ja esikonfiguroitu ajettavaksi Vercelissä:
- **Staattinen käyttöliittymä**: Jaellaan globaalisti Vercel Edge CDN:n kautta ([public/](public/)).
- **Palvelinrutiinit**: Suoratoistava Python Serverless -rajapinta ([api/index.py](api/index.py)).

**Käyttöönotto:**
1. Tuo repositorio Verceliin (`New Project` → valitse `Junction2026`).
2. Lisää Environment Variables:
   - `GEMINI_API_KEY`: oma Gemini API -avain
   - `GEMINI_MODEL`: `gemini-3.5-flash`
3. Klikkaa **Deploy**.

---

## 🔑 Ympäristömuuttujat (`.env`)

Projektin juuren [/.env](.env) ohjaa sovellusta:

```env
GEMINI_API_KEY=oma_gemini_api_avain
GEMINI_MODEL=gemini-3.5-flash
```

---

## 📁 Repositorion rakenne

| Kansio / Tiedosto | Kuvaus |
|---|---|
| [`vahti-ui/`](vahti-ui/) | Pääsovelluskansio: Python-palvelin (`server.py`), standalone-kokoaja (`make_standalone.py`) ja raportit |
| [`public/`](public/) | Vercel Edge CDN:n tarjoilemat staattiset tiedostot (`index.html`, `app.js`, `styles.css`, `data.json`) |
| [`api/`](api/) | Vercel Serverless Function -rajapinta (`api/index.py`) |
| [`data/`](data/) | Kanoninen tietokerros (`dataset.json`, seulonta-, kuolleisuus- ja aluedata) |
| [`research/`](research/) | Tutkimusaineisto ja Obsidian-vault (`00 Ohjaus` – `13 Prevention integration`) |
| [`docs/`](docs/) | Aineistoarkkitehtuurin ja tietomallin dokumentaatio |
| [`scripts/`](scripts/) | Validointi- ja aineistoputkityökalut (`validate_publication.py`, `scripts/data-pipeline/`) |
| [`archive/`](archive/) | Arkistoidut aiemmat prototyypit (sisu-ui, gitignored) |
| `Finland - Cancer data - Junction 2026.xlsx` | Alkuperäinen Excel-pääaineisto |

---

## 🧪 Datan laadunvarmistus ja validointi

Aineiston ja analyysinäytteiden eheys voidaan verifioida ajamalla:

```bash
python3 scripts/validate_publication.py
```

Päivitetty `data.json` ja standalone `vahti.html` voidaan tarvittaessa luoda uudelleen kanonisesta datasta:

```bash
cd vahti-ui
python3 build_data.py       # Synkronoi data/dataset.json -> static/data.json & public/data.json
python3 make_standalone.py  # Kokoaa vahti.html:n
```

---

## 📜 Lähteet ja vastuuvapauslauseke

- **Lähdeaineistot**: Suomen Syöpärekisteri, Terveyden ja hyvinvoinnin laitos (THL), Tilastokeskus, NORDCAN, Kansallinen syöpästrategia 2026–2035. Tarkemmat lisenssit: [DATA_SOURCES.md](DATA_SOURCES.md).
- **Vastuuvapaus**: Aineistot ja mittarit ovat alueellisia väestötason aggregaatteja, eivät yksilöllisiä hoitosuosituksia tai kliinisiä hoitopäätöksiä. Puuttuva havaintotietue ei osoita puuttuvaa hoitoa.
