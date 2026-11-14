---
tila: osittain-vahvistettu
päivitetty: 2026-11-14
---
# Seulontanäytteiden syväprofiili

## Porttipäätös

**GO tekniseen prototyyppiin:** vuoden 2024 alueellisten osallistumisosuuksien kuvaus kummastakin seulonnasta erillisenä näkymänä. Lähdearvot, poiminta, nimittäjät ja aluetason summat läpäisivät tämän näytteen tarkistukset. **Ehdollinen julkaisu:** uudelleenkäyttöehdot ja raportin laatu-/kattavuusrajaukset on vielä varmistettava. **NO-GO nykyisellä numeronäytteellä:** jatkotutkimusviiveiden laskenta, yksilöiden hoitokatkosten tunnistaminen ja kausaalinen hoitovaikutusanalyysi.

Lähteet: [suolistosyövän seulonta](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html), [rintasyövän seulonta](https://stats.cancerregistry.fi/joukkistilastot/rinta.html). Tutkimus kohdistui kansioon `06 Tekninen liite` aiemmin ladattuihin HTML-tiedostoihin; luvut eivät ole uusi reaaliaikainen poiminta.

## Poiminnan korjaus ja riippumaton tarkistus

Todellisia taulukoita on **34 suolisto- ja 61 rintataulukkoa**. Aiemmat 39 ja 66 olivat `<table`-tekstiesiintymiä: kummassakin oli viisi JavaScriptin käyttöliittymäpohjaa. Varsinaiseen JSON-poimintaan näitä ei ollut tullut, joten korjaus koskee raportoitua taulukkomäärää, ei poimittuja tietoja.

Poistamalla script-lohkot ja lukemalla jäljelle jäävät solut riippumattomalla menetelmällä kaikki taulukoiden solutekstit täsmäsivät aiempaan HTMLParser-poimintaan. Tämä vahvistaa poiminnan tekstiuskollisuutta, ei otsikoiden tulkintaa eikä rekisterin kattavuutta.

Raaka-HTML:n `<td>`-solut luettiin myös suoraan seuraaville kolmelle alueelle kummastakin aineistosta ja verrattiin JSONiin:

| Aineisto ja vuosi | Alue | Osallistuneet: HTML = JSON |
|---|---|---:|
| Suolisto 2024 | Etelä-Karjala | 8 241 |
| Suolisto 2024 | Etelä-Pohjanmaa | 11 899 |
| Suolisto 2024 | Etelä-Savo | 10 093 |
| Rinta 2024 | Etelä-Karjala | 7 047 |
| Rinta 2024 | Etelä-Pohjanmaa | 10 069 |
| Rinta 2024 | Etelä-Savo | 7 741 |

## Nimittäjät ja aritmetiikka

Suoliston alueellisissa seulontaketjuissa tarkistettiin 276 osuuslaskua vuosilta 2022–2024. Rinnan vastaavissa taulukoissa tarkistettiin 357 laskua vuosilta 2020–2024. Kaikki olivat julkaistun yhden desimaalin arvon ±0,05 prosenttiyksikön sisällä. Kaikki tarkistettujen lukumääräsarakkeiden aluesummat täsmäsivät Yhteensä-riviin. Tarkistukset ja kaavat on tallennettu koneellisesti.

**Suoliston otsikkoristiriita säilyy.** Koko maan vuoden 2024 taulukossa kolonoskopiaosuus 72,7 % vastaa 10 244 / 14 083 testipositiivista. Osallistuneista laskettuna 10 244 / 309 871 olisi noin 3,31 %. Myös kaikki alueelliset kolonoskopiaosuudet täsmäsivät testipositiiviseen nimittäjään. Raportin tekstissä mainitut vaihtoehtoiset tutkimukset eivät selitä otsikon nimittäjäsanaa. Tämä on vahva laskennallinen näyttö otsikkovirheestä, ei julkaisijan vahvistus. Säilytä molemmat nimittäjät dokumentoituna ja jätä tämä osuus MVP:n ydinnäkymän ulkopuolelle, kunnes semantiikka vahvistetaan.

## Puuttuvuus, luokitukset ja yhdistäminen

- Suoliston dataosassa ei löytynyt etsittyjä merkkejä `--`, `..`, `NA`, `*` tai tyhjiä solutekstejä; nollia esiintyy. Tämä ei todista täydellistä kattavuutta tai pienlukusuojauksen puuttumista.
- Rinnan dataosassa on kaksi `--`-arvoa, taulukossa Syövän havaitsemistapa, riveillä Seulontaikää nuorempi/vanhempi. Merkin määritelmää ei vahvistettu; älä muuta nollaksi. Lukumäärä- ja prosenttinollat ovat erillisiä havaintoja.
- Vuonna 2024 kummassakin alueketjussa on samat 22 aluenimeä ja erillinen Yhteensä-rivi. Aluenimissä ei ollut duplikaatteja. Tämä tukee teknistä nimiliitosta, mutta ei osoita samaa kohdeväestöä.
- Rinnan vuosien 2020–2023 aluejoukossa on lisäksi Ahvenanmaa. Trendissä on joko vakioitava aluejoukko tai näytettävä kattavuuden muutos.
- Väestöryhmätaulukot eivät muodosta täyttä alue × ikä × kieli × koulutus -kuutiota. Niitä ei saa kertoa yhteen tai esittää yksilötason ristiintaulukkona.

Jatkotoimet: käyttöehdot, kohorttimääritelmät, alueluokitusten ajallinen käsittely sekä viivekuvien numeerisen lähteen selvitys. Kuvat eivät ole testattu numerodata.
