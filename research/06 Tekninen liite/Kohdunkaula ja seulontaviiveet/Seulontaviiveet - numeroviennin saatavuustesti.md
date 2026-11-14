---
id: T02-viive
päivä: 2026-11-14
tila: staattiset-kuvat-vahvistettu-numerovienti-avoin
---
# Seulontaviiveet – numeroviennin saatavuustesti

**Vastaus saatavuuskysymykseen:** kolmesta tutkitusta vuositilaston HTML-tiedostosta saatiin viivekuvat, mutta ei niiden täsmällisiä numeerisia aikasarjoja. Tiedostojen 18 viivekuvaa ovat PNG-kuvia; viivearvoja ei löytynyt taulukoista eikä 13 JSON-kuviosta. Tämä on rajattu tiedostohavainto, ei todistus siitä, ettei julkaisijalla olisi muuta julkista numerovientiä.

| Julkinen raportti | Viivekuvia | Vuosiryhmät | Kuvan mittari / yksikkö |
|---|---:|---|---|
| [Suolisto](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html) | 3 | 2022–2024 | Positiivisesta testistä kolonoskopiaan, kuukautta |
| [Rinta](https://stats.cancerregistry.fi/joukkistilastot/rinta.html) | 5 | 2020–2024 | Positiivisesta testistä varmistustutkimuksiin, kuukautta |
| [Kohdunkaula](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html) | 10 | 2020–2024 × alue-/menetelmäkuvio | Positiivisesta testistä kolposkopiaan, kuukautta; ikä-/riskiryhmä erikseen |

Kaikkien viivekuvien yhteydessä on mediaanipiste, rajat ja vertailumediaani. Suoliston oma määrittely sanoo ensimmäisen desiilin ylärajan kuvaavan 10 %:n ja kymmenennen desiilin alarajan 90 %:n rajaa. Nämä ovat P10/P90-rajat, eivät keskiarvon luottamusväli. Rinnan ja kohdunkaulan kuvan lyhennetty akseliteksti on samaa tyyppiä; vastaavaa rajojen sanallista täsmennystä ei löytynyt niiden tekstiosasta. Siirrettävä P10/P90-tulkinta on siksi erikseen vahvistettava niiden osalta. Kuvien ”positiivinen testi” ei yksilöi, käytetäänkö näytteenotto-, tulos-, raportointi- vai muuta päivää, eikä kuukausimuunnoksen sääntöä; näitä ei keksitä.

Kuvista ei käy ilmi jokaisen mediaanin havaintomäärä, viivepäivien puuttuvuus, negatiivisten/poikkeavien aikojen käsittely tai mahdollinen kesken olevan seurannan käsittely. Suoliston tekstin testipositiivisille esitetty määritelmä ei yksin kuvaa sensuroinnin laskentamenetelmää. Jos mukaan pääsevät vain toteutuneen tutkimuksen tiedot, pitkään odottavat voivat puuttua jakaumasta; tämä on tarkistettava menetelmäkysymys, ei todettu toteutustapa.

## Miten numerodatan puuttuminen tästä otoksesta testattiin

`work/audit_screening.py` lukee alkuperäiset HTML-tiedostot. Se erottelee kokonaiset script-lohkot, aidot HTML-taulukot, application/json-kuviot ja kuvat sekä säilyttää otsikkopolun. Aidot taulukkomäärät ovat suolisto 34, rinta 61 ja kohdunkaula 126. Yhdessäkään taulukkootsikossa ei ole viivemittaria. Kaikki viiveotsikoiden alla olevat kuvat ovat `data:image/png;base64`-muodossa. Kuvat purettiin tarkistettaviksi; niistä **ei** luettu pikselikoordinaatteja numeroaineistoksi.

JSON-kuvioiden sisällöt ja otsikkokontekstit tarkistettiin: suoliston 4 ja rinnan 4 kuviota ovat osallistumis-/positiivisuustrendejä tai osallistumiskarttoja; kohdunkaulan 5 kuviota ovat kolme trendiä ja kaksi osallistumiskarttaa. Otsikot, akselit ja JSONin avaimet on tallennettu. Näistä ei löytynyt viivemuuttujaa. Suoria `.csv`, `.xlsx` tai `.json`-latauslinkkejä ei havaittu näissä raporttitiedostoissa.

## Tilastosovellus on erillinen tuote

[Seulontasovelluksen](https://tilastot.syoparekisteri.fi/seulonta/) ensimmäinen HTML-vaste sisältää rinta- ja kohdunkaulaohjelmat, mutta ei suolisto-ohjelmaa. [Virallinen ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html), päiväys 26.5.2026, dokumentoi taulukon CSV/XLSX-tallennuksen ja CC BY 4.0 -lisenssin. Ohjeen tekstihaussa ei ollut viive-, mediaani- tai desiilitermiä. Ensivasteessa CSV/XLSX-painikkeiden `href` on tyhjä; se ei ole toimiva itsenäinen latausosoite. Taulukonvalinnan tunnisteet ovat invitation/result/histology-tyyppisiä, mutta palvelimen päivittämiä valintoja ei vahvistettu.

Sovellusta ei saatu tässä ympäristössä tarkistettua varsinaisella selainistunnolla: selaintyökalun inventaariossa ei ollut käytettävää selainta. Rajattu kokeilu arvatulla Shiny WebSocket -polulla palautti 404:n. Tämä osoittaa vain kyseisen polun epäonnistumisen, ei sovelluksen toimimattomuutta. Onnistunutta sovelluksen CSV/XLSX-näytelatausta tai viivetaulukon olemassaoloa **ei kirjata vahvistetuksi**.

## Päätös MVP:lle ja konkreettinen seuraava testi

- **GO:** vuositilastojen lukumäärät ja osallistumisosuudet, joista on alkuperäinen HTML, onnistunut poiminta ja sisäiset laskutarkistukset.
- **CONDITIONAL:** viiveiden laadullinen esittely alkuperäiskuvasta lähteineen; täsmällinen alueellinen viivetilasto vasta numeroviennin ja laskentapopulaation varmistamisen jälkeen.
- **NO-GO tässä toteutuksessa:** kuvasta arvioitujen pisteiden esittäminen täsmällisinä päivinä/kuukausina, automaattinen viivehälytys tai kuvien rajojen tulkitseminen hoitotakuurajoiksi.

Seuraava erillinen tavoite: avaa toimiva seulontasovellus, tarkista jokainen mittariperhe ja lataa yksi viivetaulukko, **jos** sellainen on tarjolla. Hyväksymisehto: tiedostossa toistuvat sama ohjelma, vuosi, alue, kutsutyyppi, mediaani ja jakaumarajat sekä havaintomäärä/puuttuvuuden dokumentaatio. Jos viivetaulukkoa ei ole, valmistellaan julkaisijalle/mentorille muuttujapyyntö (ei lähetetty): täsmälliset mediaanit ja P10/P90, viivehavainnon N, poissuljetut, alkutapahtuma, loppu­tapahtuma, katkaisupäivä, keskeneräisten käsittely ja lisenssi.

Tallenteet: `saatavuusprofiilit.json`, `work/*_widget_inventory.json`, `work/*_delay_*.png`, `work/shiny_protocol_probe.json`; sovelluksen ensivaste ja ohje ovat [[H01 - lähde- ja saatavuusloki]]-muistion dokumentoimissa tiedostoissa.

## Myöhempi saatavuusratkaisu 14.11.2026

Natiivin Chromen kautta seuraava tutkimuserä onnistui: rinnan ja kohdunkaulan osallistumis-CSV:t ladattiin ja testattiin. Todellisessa UI:ssa nähtiin kaksi ohjelmaa ja 3/6 mittariperhettä, eikä viiveteemaa. Edellä kuvattu epäonnistunut ensimmäinen selain-/protokollayritys on testihistoriaa; se ei enää ole CSV-viennin este. Viiveiden numerovienti pysyy avoimena. Katso [[Seulontasovellus - vahvistettu CSV ja yhteisositus]].
