# Junction 2026 — syöpädata ja tutkimusagentin MVP

Suomenkielinen, lähteistetty kartoitus Suomen syöpä-, seulonta- ja hoitodatasta AstraZeneca-haasteen valmisteluun. Tutkimus tarkistettiin ja raportti koottiin 14.11.2026.

## UI prototypes

Both interfaces are kept independently while the team evaluates the final direction.

| Folder | Interface | Run |
|---|---|---|
| [`sisu-ui/`](sisu-ui/README.md) | Rasmus’s Sisu: React dashboard, county map, goal panel, comparison charts and data chat | `cd sisu-ui && npm ci && npm run dev` → http://localhost:5173 |
| [`vahti-ui/`](vahti-ui/README.md) | Niilo’s Cancer Strategy Monitor | `cd vahti-ui && python3 server.py` → http://localhost:8765 |

Each app has its own optional local Gemini configuration. Neither interface replaces the other.

## Aloita tästä

- **[Valmis raportti](research/05%20Raportti/Junction%202026%20-%20sy%C3%B6p%C3%A4data%20ja%20MVP.md)** — katalogi, 10 dataset-korttia, kysymys–aineisto-matriisi, kolme toteutuskelpoista analyysiä, tietoaukot, tekninen liite ja MVP.
- [Raportin laadunvarmistus](research/05%20Raportti/Raportin%20QA.md) — 48 hyväksyttyä paikallista tarkistusta.
- [Obsidian-vaultin etusivu](research/00%20Aloita%20t%C3%A4st%C3%A4.md). Avaa kansio `research/` Obsidianissa vaultina; mitään lisäosaa ei tarvita.
- [Julkaisun sisältö ja lähdeaineistojen ehdot](DATA_SOURCES.md).

Suositeltu MVP on **Helsingin rintaseulonnan osallistumisen vuosi–ikä-näkymä** jo ladatusta CC BY 4.0 -CSV:stä. Raportti on valmis; MVP-sovellusta ei vielä ole toteutettu.

## Repositorion rakenne

| Kansio | Sisältö |
|---|---|
| [`sisu-ui/`](sisu-ui/README.md) | Rasmus's Sisu: React + Vite + Express syöpästrategian toteutus-dashboard ja AI-chat |
| [`vahti-ui/`](vahti-ui/README.md) | Niilo's Cancer Strategy Monitor: Python/HTML-käyttöliittymä ja analyysiraportit |
| [`research/`](research/00%20Aloita%20t%C3%A4st%C3%A4.md) | Tutkimusaineisto ja Obsidian-vault (`00 Ohjaus` – `10 Hypoteesit ja löydökset`) |
| [`scripts/`](scripts/) | Julkaisu- ja aineistotarkistusskriptit |
| `Finland - Cancer data - Junction 2026.xlsx` | Alkuperäinen Excel-pääaineisto |

## Toistaminen ja rajat

Kolmen toteutuskelpoisen analyysin keskeiset CSV/JSON-näytteet ja niiden valintametatiedot ovat mukana. Esimerkiksi seulontasovelluksen CSV-tarkistus voidaan ajaa repositorion juuresta:

```sh
python3 scripts/validate_publication.py
```

Kaikki tutkimusohjelmat eivät ole itsenäisiä tuotantotyökaluja. `fetch_*`-ohjelmat voivat tehdä verkkopyyntöjä. Osa aiemmista profiileista edellyttää paikallista lähdesivukopiota, jota ei ole tässä julkisessa repositoriossa; tarvittava tiedosto ja julkaisupäätös näkyvät [manifestissa](publication-manifest.json). Älä käynnistä jatkuvaa keruuta tai oleta kaikkien lähteiden uudelleenjakeluoikeutta.

Aineistot ovat julkisia aggregaatteja, eivät yksilöllisiä hoitosuosituksia. Puuttuva tietue ei osoita puuttuvaa hoitoa; alueellinen yhteys ei osoita yksilötason syytä. Lähdeaineistot ja liitteet ovat evidenssiä, eivät toimintaohjeita.
