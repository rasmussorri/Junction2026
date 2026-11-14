---
status: tekninen yhdistäminen varmennettu; aluevuoden vastaavuus avoin
checked: 2026-11-14
scope: T15
---
# Seulonnan ja väestökontekstin yhdistelykoe 2024

**Tekninen liitos onnistui kaikille 22 seulonta-alueelle.** Vuoden 2024 rinta- ja suolistoseulonnan valmiiksi tarkistetut aluepoiminnat yhdistettiin toisiinsa sekä Tilastokeskuksen suoraan hyvinvointialuetasoiseen väestötauluun 11ra. Lopputulos on 22 riviä ilman monistuvia avaimia. Väestöpuolen 23. alue Ahvenanmaa jää tarkoituksellisesti liitoksen ulkopuolelle, koska se puuttuu kummastakin vuoden 2024 seulontataulukosta.

Koe osoittaa avainten teknisen yhteensopivuuden. Se ei vielä varmista seulontarekisterin ja väestötilaston aluejaon tai asuinpaikan määrittelyajankohdan täydellistä vastaavuutta. Väestö toimii taustatietona; osallistumisosuudet säilytettiin julkaisijan esittäminä.

## Aineistot ja todellinen poiminta

- Syöpärekisterin aiemmin tallennetut [suolistoseulonnan](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html) ja [rintaseulonnan](https://stats.cancerregistry.fi/joukkistilastot/rinta.html) HTML-taulukot: `Hyvinvointialueet / Seulontaketju / 2024`. Tässä kokeessa ei ladattu seulontaraportteja uudelleen. JSON-tiedostojen tarkistussummat ja taulukkoindeksit ovat `work/source_manifest.json`-tiedostossa.
- Uusi havaittu lähde [StatFin 11ra API](https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px): GET-metadata ja 46 solun POST tehtiin 14.11.2026. Metadatassa on 568 eritasoista aluevalintaa, 43 tunnuslukua ja vuodet 1990–2025. Kokeeseen valittiin vain HVA01–HVA21, HVA90 ja HVA91, vuoden 2024 väestö 31.12. (`vaerak-vaesto`) ja 65 vuotta täyttäneiden osuus (`vaesto_yli64_p`). Ei kuntien summauksia.
- Vastauksen päivitysaika on 29.5.2026 klo 05.00 UTC. Tilastovuosi on 2024, vaikka aineiston uusin saatavilla oleva vuosi on 2025. Taulu käyttää 1.1.2026 aluejakoa koko aikasarjassa. Väkiluku kuvaa vuoden loppua. [11ra-taulun määritelmät](https://pxdata.stat.fi/PxWeb/pxweb/fi/StatFin/StatFin__vaerak/11ra.px/).

## Eksplisiittinen aluevastaavuus

Seulontataulut julkaisevat aluenimet ilman HVA-koodeja. Alla oleva vastaavuus on analyytikon nimivastaavuuteen perustuva kartoitus, jonka koodit ja viralliset nimet tarkistettiin ladatusta Tilastokeskuksen metadatasta. Se ei ole julkaisijan toimittama valmis yhdistelyavain eikä historiallisten aluerajojen varmennus. Kaikki nimet käsitellään täsmällisinä; sumeaa nimiosumaa ei käytetä.

| Seulontaraportin nimi | StatFin-koodi | Tilastokeskuksen metadatan nimi |
|---|---|---|
| Etelä-Karjala | HVA11 | HVA11 Etelä-Karjalan hyvinvointialue |
| Etelä-Pohjanmaa | HVA16 | HVA16 Etelä-Pohjanmaan hyvinvointialue |
| Etelä-Savo | HVA12 | HVA12 Etelä-Savon hyvinvointialue |
| Helsingin kaupunki | HVA90 | HVA90 Helsingin kaupunki |
| Itä-Uusimaa | HVA01 | HVA01 Itä-Uudenmaan hyvinvointialue |
| Kainuu | HVA20 | HVA20 Kainuun hyvinvointialue |
| Kanta-Häme | HVA07 | HVA07 Kanta-Hämeen hyvinvointialue |
| Keski-Pohjanmaa | HVA18 | HVA18 Keski-Pohjanmaan hyvinvointialue |
| Keski-Suomi | HVA15 | HVA15 Keski-Suomen hyvinvointialue |
| Keski-Uusimaa | HVA02 | HVA02 Keski-Uudenmaan hyvinvointialue |
| Kymenlaakso | HVA10 | HVA10 Kymenlaakson hyvinvointialue |
| Lappi | HVA21 | HVA21 Lapin hyvinvointialue |
| Länsi-Uusimaa | HVA03 | HVA03 Länsi-Uudenmaan hyvinvointialue |
| Pirkanmaa | HVA08 | HVA08 Pirkanmaan hyvinvointialue |
| Pohjanmaa | HVA17 | HVA17 Pohjanmaan hyvinvointialue |
| Pohjois-Karjala | HVA14 | HVA14 Pohjois-Karjalan hyvinvointialue |
| Pohjois-Pohjanmaa | HVA19 | HVA19 Pohjois-Pohjanmaan hyvinvointialue |
| Pohjois-Savo | HVA13 | HVA13 Pohjois-Savon hyvinvointialue |
| Päijät-Häme | HVA09 | HVA09 Päijät-Hämeen hyvinvointialue |
| Satakunta | HVA06 | HVA06 Satakunnan hyvinvointialue |
| Vantaa ja Kerava | HVA04 | HVA04 Vantaan ja Keravan hyvinvointialue |
| Varsinais-Suomi | HVA05 | HVA05 Varsinais-Suomen hyvinvointialue |

Koodikartta on myös koneellisena `work/region_crosswalk.json`-tiedostossa. `Yhteensä`-rivit jätetään alueliitoksista pois. Ahvenanmaa säilyy väestön poiminnassa erillisenä havaitsemattoman vastinparin tarkistuksena.

## Liitostestit

| Tarkistus | Tulos |
|---|---:|
| Suolisto: yksikäsitteiset alue–vuosi-avaimet | 22 / 22 |
| Rinta: yksikäsitteiset alue–vuosi-avaimet | 22 / 22 |
| Seulontaohjelmien yhteiset alueet | 22 |
| Vain jommassakummassa seulonnassa esiintyvät alueet | 0 |
| Ristikkäiskartan yksikäsitteiset HVA-koodit | 22 / 22 |
| Väestön lähdesolut | 46 |
| Väestö leveäksi muunnettuna: yksikäsitteiset alue–vuosi-avaimet | 23 / 23 |
| Seulonnan ja väestön vastinparit | 22 |
| Seulontarivejä ilman väestötietoa | 0 |
| Väestöalue ilman vuoden 2024 seulontavastinparia | HVA91 Ahvenanmaa |
| Lopputaulun rivejä / päällekkäisiä avaimia | 22 / 0 |
| Poiminnan puuttuvia väestösoluja | 0 / 46 |

**Todettu monistumisriski:** kahden ohjelman 44 pitkää seulontariviä ja kahden mittarin 46 pitkää väestöriviä tuottavat pelkällä alue–vuosi-avaimella 22 monta-moneen-avainta ja 88 riviä. Toteutettu liitos muuntaa ohjelmat ja väestömittarit omiksi sarakkeikseen ennen yhdistämistä. Vaihtoehtona pitkässä mallissa ohjelma ja mittari on säilytettävä eksplisiittisinä ulottuvuuksina. Testitulokset ovat `work/join_checks.json`-tiedostossa.

## Esimerkki lopputaulusta

| Alue | Suoliston julkaistu osallistuminen | Rinnan julkaistu osallistuminen | Väestö 31.12.2024, kaikki iät | 65 vuotta täyttäneitä |
|---|---:|---:|---:|---:|
| Etelä-Karjala | 74,0 % | 83,2 % | 125 083 | 29,4 % |
| Helsingin kaupunki | 69,6 % | 74,3 % | 684 018 | 17,6 % |

Väestön suuruus tai ikärakenne ei ole osallistumisosuuksien nimittäjä. Lähdelukumäärät ja julkaistut osuudet on säilytetty koko 22 rivin aineistossa `work/joined_2024_regions.json`.

## Rajaukset ja seuraavat tutkimustavoitteet

1. **Nimittäjä säilyy seulontaohjelman omana.** Suoliston sarake on `Poimittu`; raportin johdannossa kaikki poimitut ja todella lähetetyt kutsut erotetaan. Rinnan taulukkosarake on `Kutsuttu`, vaikka johdanto kuvaa saman kokonaismäärän poimituiksi. Kokeessa säilytetään lähteen sarakenimi ja julkaistu osuus, eikä tätä terminologista eroa ratkaista väestöluvuilla. Vuosilopun väestöstä ei laskettu uutta seulonnan kattavuutta. [Suolisto](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html), [rinta](https://stats.cancerregistry.fi/joukkistilastot/rinta.html).
2. **Ohjelmien kohdeväestöt eroavat.** Suolistoseulonnan vuoden 2024 ikäkohortit ja rintaseulonnan kohortit sekä sukupuolirajaukset eivät ole samat. Alueiden prosentteja voi näyttää rinnakkain kuvailevana tietona; prosenttieroa ei tulkita yhden hoitopolun pudotukseksi tai saman henkilökohortin muutokseksi.
3. **Varmista alueiden ajallinen vastaavuus.** Selvitä seulontatilaston kuntajaon versio sekä se, määräytyykö asuinalue poiminta-, kutsu- vai tutkimushetkellä. Vertaa tätä 11ra:n vuoden 2026 aluejakoon. Nimen vastaavuus ei yksin ratkaise rajasiirtoja tai muuttoliikettä. Nykyinen tulos on käyttökelpoinen tekniseen prototyyppiin ehdollisena kontekstiliitoksena.
4. **Mahdollinen seuraava analyysi:** testaa, esiintyykö alueiden matala osallistuminen molemmissa ohjelmissa samalla aluejoukolla. Määrittele etukäteen korrelaatiomittari, herkkyystarkistus Helsingin poistolle ja alueväestön rakenteen vaikutuksen arvio. N=22 on pieni; tulos olisi ekologinen yhteys. Nykyisestä yhdistelykokeesta ei raportoida tilastollista yhteyttä tai syytä.

## Toistaminen ja jäljitettävyys

Aja tämän kansion `work/join_screening_population.py`. Oletuksena se käyttää tallennettua StatFin-vastausta ja alkuperäisiä tarkistettuja seulontapoimintoja ilman verkkoyhteyttä. `--refresh` päivittää vain pienen 46 solun väestökyselyn; metadatan tai alueluokituksen muutos tulee huomioida erikseen. Ohjelma pysähtyy poikkeaviin avainjoukkoihin, tupliin tai puuttuviin koesoluihin. Se ei muuta alkuperäisiä aineistoja.

`work/http_log.json` sisältää latausajan, URL:n, HTTP-statuksen, tavumäärän ja SHA-256:n; `11ra_hva2024_query.json` tarkan POST-rungon; `11ra_hva2024_sample.json` raakavastauksen; `join_checks.json` avain- ja kardinaliteettitestit. JSON-stat2 puretaan vastauksen oman dimensiojärjestyksen mukaan. Toinen paikallinen ajo varmisti, että lopputaulun tarkistussumma säilyi samana.
