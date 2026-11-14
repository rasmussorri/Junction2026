---

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.
id: D02
status: html-data-vahvistettu-viivevienti-avoin
tarkistettu: 2026-11-14
tags: [dataset, seulonta, mvp]
---
# Suolistosyövän seulontatilastot

**Tarkoitus ja ylläpitäjä.** Suomen Syöpärekisterin joukkotarkastusrekisteriin perustuva [suolistoseulonnan vuositilasto](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html) kuvaa väestötason seulontaketjua. Se on dataset-perhe; [englanninkielinen raportti](https://stats.cancerregistry.fi/joukkistilastot/colorectal.html) on saman tuotteen kieliversio. Julkaisu 20.5.2026, löydösten katkaisupäivä 15.5.2026.

**Todelliset muuttujat.** Poimitut, vähintään yhden onnistuneen FIT-testin palauttaneet, testipositiiviset, kirjattu kolonoskopia, kirurgista/neoadjuvanttihoitoa saaneet sekä syöpä-/esiaste-/muut löydösluokat. Erikoistilastoissa aiempi osallistuminen/tulos, 2022-kierroksen välisyövät ja episodisensitiivisyys. Taulukoissa N ja prosentteja eri nimittäjillä. Tavalliset löydökset perustuvat seulontarekisteriin; välisyöpäluokitus käyttää myös syöpärekisteriä. Yksilöllisiä päivämääriä, kattavaa stagea, lääkitystä, haittoja tai eloonjäämistä ei toimiteta näissä aggregaateissa.

**Väestö, aika ja alue.** Vuositaulukot 2022–2024; vuonna 2024 kohdeväestö on 60-, 62-, 64-, 66-, 68- ja 70-vuotiaat. Kansallinen ohjelma alkoi 2022; historiataulukoissa on myös 2019–2021 pilottien seulontoja. Julkaistuja erotteluja ovat vuosi, sukupuoli, ikä, alue, äidinkieli, koulutus, syntymäalue ja edellinen tulos, mutta kaikki eivät ole yhteisessä ristiintaulukossa. Alueketjussa on 22 aluetta (21 hyvinvointialuetta ja Helsinki); Ahvenanmaa ei kuulu ohjelmaan. Kuntakartta on erillinen esitys. Havaintoyksikkö on ryhmän vuosittainen/kierroskohtainen aggregaatti.

**Pääsy, toimiva pyyntö ja lisenssi.** `GET https://stats.cancerregistry.fi/joukkistilastot/suolisto.html` onnistui ilman kirjautumista, HTTP 200, `text/html`, 7 368 210 tavua. Talletettu `06 Tekninen liite/suolisto.html` ja 34 oikeaa HTML-taulukkoa JSONina. Kaksi jäsentäjää tuotti samat solut; 39 raakaa `<table>`-tekstiosumaa sisältäisi viisi JavaScript-mallia. [Seulontasovelluksen ohjeen](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html) CC BY 4.0 ja CSV/XLSX-vienti koskevat dokumentoitua sovellusta; suolistoa ei havaittu sen ensivasteen ohjelmavalinnoissa. Staattisen raportin lisenssin soveltaminen edelleenjakeluun on vahvistamatta. HTML-lataus ei ole väite virallisesta API:sta.

**Nimittäjät ja laatu.** Osallistuminen = onnistuneen testin palauttaneet / kutsua varten poimitut. Vuonna 2024 421 365 poimittua, 419 966 lähetettyä kutsua ja 309 871 osallistunutta. Lähettämättä jääneiden 1 399 osuus on 0,3320 %; nimittäjän vaihto muuttaisi laskettua osuutta vain +0,2450 prosenttiyksikköä, eikä tuota varmennettua kutsun saaneiden osallistumisastetta. Kolonoskopiaprosentin otsikossa on ristiriita: 10 244/14 083 = 72,7 % testipositiivisista, vaikka otsikossa lukee osallistuneista. Malliin tallennetaan laskennallisesti todennettu nimittäjä ja lähdehuomio. Alueketjun 276 prosenttilaskua ja summat täsmäsivät. Uusi merkkitarkistus löysi seitsemän `–`-solua; raakatoken säilytetään, ei muuteta nollaksi tai oletetuksi salaukseksi. Perusaste/tuntematon ja muu/puuttuva kieli ovat yhdistelmäluokkia. Tiedot täydentyvät takautuvasti; puuttuva kolonoskopia ei osoita hoidon puuttumista.

**Viiveet.** Kolme aluekohtaista PNG-kuviota kuvaa positiivisesta testistä kolonoskopiaan kuluvia kuukausia. Raportin määritelmät vahvistavat mediaanin ja P10/P90-rajat. Tarkat numerot, havainto-N ja keskeneräisen seurannan laskentasääntö eivät olleet ladattavina taulukkoina tässä otoksessa. Neljä JSON-kuviota käsittelevät muita muuttujia. Täsmällinen viivemalli on ehdollinen.

**Vastattavat kysymykset ja rajat.** Soveltuu julkaistujen alue- ja väestöryhmäerojen, osallistumisen muutosten ja seulontaketjun kirjattujen määrien kuvaukseen. Ikä-/sukupuolivakiointi ja sukupuoli-/historiavakiointi ovat erillisiä kansallisia herkkyystestejä, eivät yhteinen aluevakiointi. H01:n vaatimaa alue × vuosi × ikä × sukupuoli × aiempi tulos -aineistoa ei vahvistettu. Ei ratkaise myöhäisen diagnoosin syytä, peruutuksia tai yksilön hoitamatta jäämistä.

**Liitokset ja työmäärä.** Avaimet: ohjelma, kutsuvuosi, aluetaso, tarkistettu aluekoodi, ikä-/sukupuoliluokka ja tarvittaessa historiaryhmä; aina sama nimittäjä ja aluejako. Henkilötason linkitystä ei ole avoimessa taulukossa. Osallistumis-MVP: GO, olemassa olevan poiminnan siistiminen arviolta 0,5–1 kehittäjäpäivää; uudelleenjulkaisun lisenssi ja viivevienti ovat erilliset avoimet ehdot. Perustestit: [[Seulontanäytteiden syväprofiili]], [[H01 - kierrosrakenteen ja nimittäjän testi]], [[Seulontaviiveet - numeroviennin saatavuustesti]].
