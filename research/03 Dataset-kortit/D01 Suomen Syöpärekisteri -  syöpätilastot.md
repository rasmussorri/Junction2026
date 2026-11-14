# D01 Suomen Syöpärekisterin syöpätilastot

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.

Tila: osittain vahvistettu 14.11.2026. Perhe: valtakunnallinen syöpärekisteri. Raportti, tilastosovellus ja Sotkanet-uudelleenjakelu eivät ole riippumattomia rekistereitä.

| Kenttä | Havainto |
|---|---|
| Ylläpitäjä | Suomen Syöpärekisteri; rekisterinpitäjä THL, tekninen ylläpito Suomen Syöpäyhdistys |
| Alkuperäislähde | [Tilastosovellus](https://tilastot.syoparekisteri.fi/syovat/), [ohje](https://tilastot.syoparekisteri.fi/syovat/help_main_fi.html) |
| Tietotuotteet | Ilmaantuvuus, kuolleisuus, vallitsevuus, suhteellinen elossaolo, sairastumisriski; erillinen ennakkotieto |
| Vahvistettu esimerkkipoiminta | Kaikki syövät, koko maa, miehet/naiset, 2020–2024, levinneisyys; kuusi riviä CSV:nä |
| Stage | Tässä viennissä tuntematon / paikallinen / ei paikallinen. Ei TNM I–IV |
| Hoitopolku ja viive | Testattu poiminta ei sisällä tapahtumapäiviä, suunniteltuja aikoja eikä diagnoosi–hoito-viivettä |
| Hoidot ja lääkitys | Ei testatussa CSV:ssä; erilliset laaturaportit samaan perheeseen liittyviä tietotuotteita |
| Ajallinen kattavuus | Sovelluksessa vuosisarja 1953–2024; tietyt syövät alkavat myöhemmin. Vuosi 2025 on ennakkotieto; stage-valinta yhdistää 2020–2024 |
| Päivitys | Ohjeen datapäiväys 2.4.2026, sovellus 2026-04-22-001; vuosipäivitys havaittu, seuraavaa julkaisupäivää ei vahvistettu |
| Alue ja ryhmät | Käyttöliittymässä koko maa ja hyvinvointialueet, sukupuoli, ikä-, koulutus- ja syöpäryhmävalintoja; ei kaikkien kenttien vapaata ristiintaulukointia varmennettu |
| Havaintoyksikkö | Aggregaattitaulukon ryhmä; ei henkilörivi |
| Formaatti ja pääsy | Julkinen Shiny-sovellus. CSV-vienti testattu, XLSX-painike havaittu, XLSX-latausta ei testattu. Ei varmennettua pysyvää API:a |
| Lisenssi | Sovelluksen aineisto CC BY 4.0, ohje §10 |
| Pienluvut ja puuttuvuus | Lukumäärät 1–4 salataan; viiva voi olla sensuroitu tai laskematta jäänyt arvo. Levinneisyyden tuntematon on oma luokka |
| Yhdistely | Alue/vuosi/sukupuoli/syöpä vain samoilla määritelmillä; kiinteät valinnat on säilytettävä erillisessä metadatassa, koska ne puuttuvat CSV-sarakkeista |
| Henkilötason linkitys | Ei mahdollista avoimesta poiminnasta; tietoluvan varainen rekisterityö erikseen |
| Viikonloppukelpoisuus | CSV-data heti käytettävissä. Täsmällinen aluekohtainen stage-analyysi vaatii vielä rajatun lisäpoiminnan ja luokituksen tulkinnan |

Tekninen näyttö: [[Syöpärekisteri - varmennettu stage ja laaturaportit]], `06 Tekninen liite/Syöpärekisteri/stage_sample_metadata.json`. Kolme CSV-solua verrattiin käyttöliittymään. Lataus sisältää useita numeromittareita riippumatta leveän taulukon valitusta mittarista.

**Raja:** ei-paikallinen ei tarkoita automaattisesti stage IV:tä. Raportin 2024 kiinteiden kasvainten stage-kattavuus ja sovelluksen kaikkien syöpien 2020–2024 levinneisyys eivät ole sama kohortti. [Vuosiraportti §5](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html).
