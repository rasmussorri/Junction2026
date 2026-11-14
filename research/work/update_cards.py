from pathlib import Path
v=Path.cwd()
cards={1:'''# D01 Suomen Syöpärekisterin syöpätilastot

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
''',7:'''# D07 Keuhkosyövän kansallinen laaturaportti

Tila: raportin sisältö vahvistettu, koneellinen lataus osin estyi 14.11.2026. Perhe: Syöpärekisteri + Hilmo, yhdistetyn luvanvaraisen kohortin julkinen raportti.

| Kenttä | Havainto |
|---|---|
| Ylläpitäjä ja lähde | Suomen Syöpärekisteri, [keuhkosyöpäraportti](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html) |
| Kohortti | 14 873 uutta primaaria C33–C34-tapausta 2019–2023; henkilön ensimmäinen keuhkosyöpä |
| Tapahtumat | Syöpärekisterin diagnoosi, Hilmon käynti/jakso/toimenpide, hoitoluokat ja kuolema |
| Aika | Seuranta alkaa diagnoosista tai enintään 3 kk aiemmasta määritellystä Hilmo-käynnistä. Enintään 12 kk seuranta, viimeistään 31.12.2024 |
| Viive | Yksilöiden päivämääriä ei julkaista. Hoitopolku-/seurantakuva ei itsessään ole diagnoosi–hoito-viiveen numerodata |
| Stage | Taulukko 4 kuvaa käytetyn levinneisyysluokituksen saatavuutta; 7 097 ilman tietoa. Ei avoimeksi varmennettua TNM I–IV -potilastaulukkoa |
| Hoidot | Parantava, jarruttava, oireenmukainen; leikkaus-, säde- ja lääkehoitoluokat; ryhmät osin päällekkäisiä |
| Haitat | Ei varmennettua haittamuuttujaa |
| Elossaolo | Raportoidut 12 kk elossaolo-osuudet ja hoitoluokkakohtaiset kuvaukset; hoitovalikoituminen estää suoran vaikuttavuustulkinnan |
| Alue ja väestö | Hyvinvointi-/yhteistyöalue, sukupuoli, ikäryhmä; alue diagnoosivuoden alun kotikunnasta |
| Havaintoyksikkö | Julkinen aggregaattitaulukko/kuvio; taustalla linkitetty henkilökohortti |
| Formaatti ja pääsy | Julkinen HTML, taulukot ja kuvat. Verkkolukija luki raportin; Python GET palautti 403. Tämän raportin CSV/Excel-vientiä ei testattu |
| Päivitys ja julkaisu | Kohortti- ja seurantavuodet varmennettu; julkaisupäivää/toistuvaa päivitysrytmiä ei varmennettu |
| Lisenssi | Erillisen laaturaportin uudelleenkäyttöehto tarkistamatta; sovelluksen CC BY -ehtoa ei automaattisesti siirretä tähän |
| Kattavuus | Avohilmo ei mukana, MDT-koodit eivät kata kaikkia neuvotteluja. Ahvenanmaa ei aluekuvissa pienlukujen vuoksi; 6 puuttuvaa kotikuntaa |
| Yhdistely | Vain yhteismitallinen aggregaattiyhdistely; 2019–2023-koonti ei vastaa yhden vuoden seulontakohorttia |
| Viikonloppukelpoisuus | Raportin kuvaileva tulkinta heti; automaattinen poiminta ja tarkat ajalliset analyysit vaativat lisäselvitystä |

Lähdeviitteet: raportin §3 menetelmät, §4.1.3 stage-kattavuus, §4.2 prosessit ja §4.3 elossaolo. Tarkistusmuistio: [[Syöpärekisteri - varmennettu stage ja laaturaportit]].

**Päätelmä:** vahva lähde datakattavuuden ja hoitokirjaamisen eroille. Ilman hoitokirjausta jäänyt ei ole automaattisesti hoitoa vaille jäänyt potilas. Hoitoluokkien ennuste-erot eivät osoita hoidon kausaalista vaikutusta.
'''}
for n,s in cards.items():
 p=next((v/'03 Dataset-kortit').glob(f'D{n:02d} *.md'));p.write_text(s)
p=v/'00 Ohjaus/state.json';import json,datetime
d=json.loads(p.read_text());d['completed_cycles']+=1;d['last_checkpoint']=datetime.datetime.now(datetime.timezone.utc).isoformat();d['last_completed_task']='Cancer registry stage export and quality-report verification; parallel PDF/H01/THL evidence complete';p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
p=v/'work/research.lock';d=json.loads(p.read_text());d['updated']=datetime.datetime.now(datetime.timezone.utc).isoformat();p.write_text(json.dumps(d))
p=v/'07 Tutkimusloki/Tutkimusloki.md';p.write_text(p.read_text()+'''\n## 14.11. klo 01.40 — ensimmäinen ajastettu työerä\n\nSyöpätilastosovelluksen 2020–2024 karkea levinneisyys-CSV ladattu aidosti; kuusi riviä, kolme solua tarkistettu käyttöliittymään. Stage I–IV -luokkia ei tässä viennissä ole. Sovelluksen CC BY4 ja pienlukusuoja 1–4 vahvistettu ohjeesta. Raporttien suora lataus403 erotettu onnistuneesta sovellusviennistä. Vuosiraportin stage-kattavuuden tekstiprosentissa havaittu ristiriita taulukkoon. D01/D07 päivitetty. PDF-, H01- ja THL-rinnakkaistutkimuksen tulokset yhdistetään seuraavassa checkpointissa.\n''')
print('Cards and checkpoint updated.')
