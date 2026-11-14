# Junction 2026 — Cancer Strategy Monitor (Vahti UI)

Suomenkielinen, lähteistetty kartoitus Suomen syöpä-, seulonta- ja hoitodatasta AstraZeneca-haasteeseen. Sovellus seuraa Suomen Kansallisen syöpästrategian 2026–2035 tavoitteiden toteutumista hyvinvointialueittain.

## Sovellus: Vahti UI (Cancer Strategy Monitor)

Projektin pääkäyttöliittymä on **Vahti UI** (`vahti-ui/`).

| Käynnistystapa | Komento | Kuvaus |
|---|---|---|
| **Paikallinen palvelin (AI-chat & raportit)** | `cd vahti-ui && python3 server.py` | Avaa selaimessa http://localhost:8765 |
| **Yhden klikkauksen käynnistys (macOS)** | Tuplaklikkaa `vahti-ui/Kaynnista_vahti.command` | Käynnistää palvelimen ja avaa selaimen |
| **Itsenäinen HTML (ilman palvelinta)** | Tuplaklikkaa `vahti-ui/vahti.html` | Toimii suoraan selaimessa (ilman live-chattiä) |

### AI-chat ja raportit (Gemini)
AI-chat ja verkkolähteistä koottavat toimenpideraportit käyttävät Gemini-mallia.
Aseta juuren `.env`-tiedostoon (tai Vercelin Environment Variables -asetuksiin):
```env
GEMINI_API_KEY=oma_avaimesi
GEMINI_MODEL=gemini-3.5-flash
```

## Vercel-julkaisu

Sovellus on valmis julkaistavaksi Vercelissä:
1. Yhdistä GitHub-repositorio Verceliin (`New Project` → valitse `Junction2026`).
2. Lisää Environment Variables -osioon:
   - `GEMINI_API_KEY`: oma Gemini API -avain
   - `GEMINI_MODEL`: `gemini-3.5-flash`
3. Paina **Deploy**.
   - Staattiset tiedostot (`public/`) jaetaan globaalin CDN:n kautta.
   - AI-chat ja API-reitit (`api/index.py`) toimivat Python-palvelinrutiineina Vercel Serverless -alustalla.

## Repositorion rakenne

| Kansio / Tiedosto | Kuvaus |
|---|---|
| [`vahti-ui/`](vahti-ui/README.md) | Cancer Strategy Monitor: käyttöliittymä, karttanäkymä, toimenpideraportit ja AI-chat |
| [`data/`](data/) | Kanoninen tietokerros (`dataset.json`, seulonta-, kuolleisuus-, ja havaintodata) |
| [`research/`](research/00%20Aloita%20t%C3%A4st%C3%A4.md) | Tutkimusaineisto ja Obsidian-vault (`00 Ohjaus` – `13 Prevention integration`) |
| [`docs/`](docs/) | Aineisto- ja integraatioarkkitehtuurin dokumentaatio |
| [`scripts/`](scripts/) | Validointi- ja aineistoputkityökalut (`validate_publication.py`, `scripts/data-pipeline/`) |
| `Finland - Cancer data - Junction 2026.xlsx` | Alkuperäinen Excel-pääaineisto |

## Aloita tästä

- **[Valmis raportti](research/05%20Raportti/Junction%202026%20-%20sy%C3%B6p%C3%A4data%20ja%20MVP.md)** — katalogi, 10 dataset-korttia, kysymys–aineisto-matriisi, kolme toteutuskelpoista analyysiä, tietoaukot, tekninen liite ja MVP.
- [Raportin laadunvarmistus](research/05%20Raportti/Raportin%20QA.md) — hyväksytyt paikalliset tarkistukset.
- [Obsidian-vaultin etusivu](research/00%20Aloita%20t%C3%A4st%C3%A4.md). Avaa kansio `research/` Obsidianissa vaultina; mitään lisäosaa ei tarvita.
- [Julkaisun sisältö ja lähdeaineistojen ehdot](DATA_SOURCES.md).

## Datan validointi

Aineistojen eheyden voi tarkistaa repositorion juuresta:

```sh
python3 scripts/validate_publication.py
```

Aineistot ovat julkisia aggregaatteja, eivät yksilöllisiä hoitosuosituksia. Puuttuva tietue ei osoita puuttuvaa hoitoa; alueellinen yhteys ei osoita yksilötason syytä. Lähdeaineistot ja liitteet ovat evidenssiä, eivät toimintaohjeita.
