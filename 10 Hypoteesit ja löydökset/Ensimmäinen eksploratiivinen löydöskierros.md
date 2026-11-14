---
tilanne: eksploratiivinen
tarkistettu: 2026-11-14
aineistot: [suolistoseulonta, rintaseulonta]
---
# Ensimmäinen eksploratiivinen löydöskierros

Tämä kierros etsii jo varmennetuista taulukoista toistuvia alue- ja aikakuvioita. Neljä löydöstä ovat **kuvailevia laskentatuloksia**, eivät vahvistettuja selityksiä, riippumattomia tutkimustuloksia tai näyttöä hoidon virheistä. Jokainen synnyttää testattavan jatkotavoitteen. P-arvoja ei laskettu.

Lähteet: [Suomen Syöpärekisterin suolistoseulontaraportti](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html) ja [rintaseulontaraportti](https://stats.cancerregistry.fi/joukkistilastot/rinta.html). Käytettiin kansioon `06 Tekninen liite` tallennettuja HTML-näytteitä, joiden tarkistussummat ovat johdetussa JSONissa. Aineistopoiminnassa kaikki solut verrattiin riippumattomaan HTML-jäsennykseen.

## 1. Suolistoseulonnan osallistumisen lasku koskee kaikkia 22 aluetta – pelkkä ikäryhmälaajennus ei riitä selitykseksi

Suolistoseulonnan nimittäjä on **Poimittu**, ei lähetettyjen kutsujen tai potilaiden määrä. Samojen 22 alueen painotettu osallistuminen laski 273 708 / 354 174 = **77,2807 %** vuonna 2022 tasolle 309 871 / 421 365 = **73,5398 %** vuonna 2024, eli **−3,7408 prosenttiyksikköä**. Kaikki 22 aluetta laskivat 2022→2024. Laskua oli 22/22 alueella 2022→2023 ja 18/22 alueella 2023→2024. Suurin 2022→2024 muutos oli Pohjois-Karjalassa: 9 968 / 12 737 = 78,2602 % → 10 833 / 14 800 = 73,1959 %, **−5,0642 pp**. Osallistuneiden määrä siis kasvoi samalla kun osuus laski.

Havainto johti heti uuteen tarkistukseen: vakioitiin koko maan 60-, 62-, 64-, 66- ja 68-vuotiaiden miesten ja naisten kymmenen ositteen painot vuoden 2022 poimittuihin. Suoraan vakioitu osuus laski **77,2807 % → 72,8187 %**. Vuonna 2024 näissä yhteisissä ikäluokissa osallistui 256 706 / 352 828 = 72,7567 % ennen vakiointia. Kaikki 10 ikä–sukupuoliositetta laskivat 2022→2024. Siten 70-vuotiaiden lisääminen kohdejoukkoon tai näiden yhteisten ikä–sukupuoliryhmien painomuutos ei yksin selitä laskua. Tämä on kansallinen vakiointi, ei alueellinen eikä samojen henkilöiden seuranta.

**Uusi tavoite H01, prioriteetti 1:** selvitä ensin alueittainen ikä–sukupuoli–seulontakelpoisuus- ja kutsukattavuusrakenne ja testaa sitten, selittääkö ensimmäisen/uusintakierroksen ja aiemman osallistumisen jakauma vähintään puolet kansallisesta vakioidusta laskusta. Ennakkoon määritelty vertailu: yhteiset ikä–sukupuoliryhmät ja vakioitu kierros-/aiempi osallistumisjakauma; hypoteesi vähintään puolen laskun selittymisestä ei saa tukea, jos lisävakiointi poistaa alle puolet laskusta. Kilpailevat selitykset: lähetys- ja muistutuskäytäntöjen muutokset, kirjautumisviive, muuttunut poiminta ja väestörakenne. Tarvitaan julkaistut laskurit vuosi × ikä × sukupuoli × kierros × aiempi osallistuminen; nykyisten marginaalitaulukoiden kertominen yhteen ei kelpaa. Etsi ensin alueittaiset ikä–sukupuolierittelyt, kelpoisuuden ja poiminnan vuosimuutokset sekä raportin edellisen tuloksen taulukot. Selvitä poimittujen ja todella kutsuttujen ero ennen selitysmallia.

## 2. Suolistoseulonnan aluejärjestyksessä on pysyvä alapää

Helsinki, Kymenlaakso sekä Vantaa ja Kerava olivat **samat kolme matalimman osallistumisen aluetta kaikkina vuosina 2022–2024**, vaikka keskinäinen järjestys vaihteli. Vuonna 2024:

| Alue | Osallistuneet / poimitut | Osuus |
|---|---:|---:|
| Helsinki | 29 226 / 42 015 | 69,5609 % |
| Kymenlaakso | 10 098 / 14 431 | 69,9744 % |
| Vantaa ja Kerava | 12 433 / 17 443 | 71,2779 % |
| Etelä-Savo, korkein osuus | 10 093 / 13 122 | 76,9166 % |

Alueiden vaihteluväli oli 8,0866 pp vuonna 2022, 8,2434 pp vuonna 2023 ja **7,3558 pp vuonna 2024**. Pysyvä järjestys ei kerro, johtuuko ero palvelusta, väestöstä vai kirjaamisesta. Aluejärjestys on valittu aineiston tarkastelun jälkeen eikä ole ulkoisesti validoitu.

**Uusi tavoite H02, prioriteetti 1:** pysyvätkö nämä kolme aluetta alimmassa neljänneksessä, kun ikä, sukupuoli ja kieli vakioidaan samoilla painoilla? Hypoteesi kaikkien kolmen alueen pysymisestä alimmassa neljänneksessä ei saa tukea, jos yksikin niistä siirtyy vakioinnissa pois alimmasta neljänneksestä. Kilpailevat selitykset: kieli-/koulutusrakenne, poimittujen ja kutsuttujen ero, erilaiset muistutukset sekä aluetiedon määritelmä. Tarvitaan alueittaiset yhteiset ositetut aggregaatit, ei vain erilliset kansalliset kielijakaumat. Lisenssi ja pienlukujen julkaisukelpoisuus on tarkistettava.

## 3. Rintaseulonnan vakioalueinen kokonaiskehitys on erilainen, mutta Helsingissä ero pysyy

Ahvenanmaa jätettiin **kaikista vuosista** pois, jotta 2020–2024 aluejoukko pysyy samana 22 alueena. Rintaseulonnan nimittäjä on **Kutsuttu**. Painotettu osuus oli 289 612 / 359 948 = **80,4594 %** vuonna 2020 ja 281 369 / 344 851 = **81,5915 %** vuonna 2024 (**+1,1321 pp**). Vain 6/22 alueella osuus oli 2024 pienempi kuin 2020. Kehitys ei kuitenkaan ollut yhtäjaksoista: painotettu osuus nousi 2021 tasolle 82,1564 %, laski 2022–2023 ja nousi hieman 2024. Vuoden 2020 olosuhteita ei ole tässä selvitetty.

Helsinki oli alin kaikissa viidessä vuositarkastelussa. Vuonna 2024 Helsinki 28 686 / 38 630 = **74,2583 %**, Pohjois-Pohjanmaa 20 168 / 23 560 = **85,6027 %**; ero **11,3444 pp**. Tässä ei verrata samoja naisia eri vuosina eikä arvioida muiden kuin seulontaohjelmassa kirjattujen tutkimusten käyttöä.

**Uusi tavoite H03, prioriteetti 2:** testaa, pysyykö Helsingin poikkeama valtakunnallisesta osallistumisesta, kun ohjelman ulkopuolinen mammografiatoiminta ja kutsuttujen ikä–kielirakenne huomioidaan. Ennalta rajattu falsifioitava väite: vakioinnin jälkeen ero muihin 21 alueeseen on edelleen vähintään 5 pp vuonna 2024. Kilpailevat selitykset: erilainen kohdeväestö, ohjelman ulkopuolinen tutkiminen, kutsujen tavoittavuus tai vuoden 2020 poikkeus. Tarvitaan alueelliset seulontaohjelman ulkopuoliset tutkimusaggregaatit ja soveltuvat nimittäjät; yleinen mammografioiden määrä ei yksin osoita korvaavaa seulontaa. Näiden muuttujien julkista saatavuutta ei ole vahvistettu.

## 4. Kahden seulontaohjelman aluejärjestykset liittyvät osittain yhteen

Vuoden 2024 samoilla 22 alueella suolisto- ja rintaseulonnan osallistumisjärjestysten **Spearmanin ρ = 0,5505**. Järjestys laskettiin täsmällisistä lukumääräosuuksista; tasatuloksia ei ollut. Tämä on yksi eksploratiivinen ekologinen tunnusluku. Siinä verrataan eri ikä- ja sukupuolijoukkoja sekä eri nimittäjiä, joten se ei osoita samoja osallistumattomia henkilöitä tai yhteistä syytä. Kymenlaakso havainnollistaa eroa: suolistoseulonnassa 10 098 / 14 431 = 69,9744 %, rintaseulonnassa 9 142 / 11 143 = 82,0425 %.

**Uusi tavoite H04, prioriteetti 3:** säilyykö positiivinen järjestysyhteys yhteisessä ikä–sukupuoliryhmässä ja vuosina 2022 sekä 2023? Määritä ennen lisälaskentaa päätöskriteeriksi ρ ≥ 0,4 jokaisessa kolmessa vuodessa; jos ei, vuoden 2024 yleistäminen ei saa tukea. Kilpailevat selitykset: alueiden sosiodemografia, satunnaisesti valittu vuosi, eri kohdeväestöt ja ohjelmakohtaiset käytännöt. Tarvitaan rinta- ja suolistoseulonnan alue × vuosi × naiset × yhteiset ikäluokat; yhteisen kohortin saatavuus on vielä avoin. Pelkkä kaikkien ikäryhmien korrelaation toisto ei ratkaise väestöeroa.

## Mitä etsittiin ja miten toistaa

Laskentaan kuului 66 suoliston ja 114 rinnan alue–vuosiriviä. Vakioalueinen rintatarkastelu käytti 110 riviä. Vertailuja tehtiin suolistolle 44 ja rinnalle 88 vierekkäisten vuosien aluekohtaista muutosta sekä kummallekin 22 päätepistevertailua. Vuotuisia minimi–maksimieroja laskettiin 3 + 5; lisäksi yksi 22 alueen järjestyskorrelaatio ja 10 kansallista ikä–sukupuoliositteiden päätepistevertailua. Samoista riveistä johdetut tulokset eivät ole riippumatonta näyttöä. Lukuisat vertailut ja jälkikäteen valitut äärialueet rajoittavat löytöjen yleistävää tulkintaa.

Ei poimittu kolonoskopiaosuutta, viiveitä, diagnooseja tai hoitoja tämän analyysin lopputuloksiksi. Osallistumatta jääminen ei yksin tarkoita puuttuvaa hoitoa. Lähdeaineiston ikä-/kierrosrakenteet ja aluekoodien takautuva käsittely vaativat jatkotyötä.

Johdettu aineisto: `alue_vuosi_osallistuminen.json`. Kaikki tunnusluvut: `work/exploration_results.json`. Tutkimusjonoon vietävät tavoitteet: `hypoteesit.json`. Toistaminen projektihakemistosta:

```sh
python3 '10 Hypoteesit ja löydökset/work/explore_participation.py'
```

Skripti ei hae verkosta uusia tietoja. Se lukee tallennetut lähteet, varmistaa poiminnan, laskee lukumääristä osuudet ja tuottaa johdetut JSON-tiedostot.

## Testikriteerien asema

Jatkotavoitteiden 50 prosentin, 5 prosenttiyksikön ja ρ ≥ 0,4 rajat ovat tätä eksploratiivista jatkotyötä varten valittuja operatiivisia kriteereitä, eivät kliinisiä raja-arvoja tai ennalta rekisteröidyn tutkimuksen päätöksiä. Niiden täyttyminen ei yksin vahvista selitystä. Nykyisillä aineistoilla löytyneet kuviot vaativat vertailukelpoista lisänäyttöä.
