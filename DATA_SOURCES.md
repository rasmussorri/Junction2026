# Lähdeaineistot ja julkaisurajaus

Repositorion alkuperäinen MIT-lisenssi säilyy. **Se ei uudelleenlisensoi kolmansien osapuolten aineistoja tai liitteitä.** Niiden omat ehdot ja lähdeviitteet pätevät. Raportissa ja koepoimintojen metatiedoissa on tarkka rajaus, latauspäivä ja alkuperäinen osoite.

## Mukana olevat tietotuoteperheet

| Aineisto | Alkuperä ja ehdot |
|---|---|
| Syöpätilastosovelluksen stage-CSV ja seulontasovelluksen Helsinki-CSV:t | Suomen Syöpärekisteri, poiminta 14.11.2026, [syöpätilastojen ohje](https://tilastot.syoparekisteri.fi/syovat/help_main_fi.html), [seulonnan ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html), CC BY 4.0. Mukana omia JSON-muunnoksia ja laskelmia. |
| THL:n Hilmo-, Avohilmo- ja hoitojonojen pienpoiminnat | THL, [tilastopalvelu](https://sampo.thl.fi/), tietotuotteiden CC BY 4.0 -ehdot varmennettu tutkimuksessa. Tarkat pyynnöt ja rajaukset kansiossa `06 Tekninen liite`. |
| StatFin- ja Paavo-näytteet/metatiedot | Tilastokeskus, [käyttöehdot](https://stat.fi/fi/tietoa-meista/tutustu-tilastokeskukseen/lainsaadanto/kayttoehdot), CC BY 4.0; poiminta 14.11.2026. |
| Kelan korvaus- ja korvausoikeusaggregaatit | Kela, [korvausoikeusaineisto](https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet), pakettimetadatassa CC BY 4.0. Oikeus ei ole lääkeosto tai hoidon toteuma. |
| Käyttäjän toimittamat PDF-liitteet ja niistä tehdyt otteet | Alkuperäiset julkaisijat ja lähdeosoitteet löytyvät `01 Tausta/Liitteiden manifesti.json`-tiedostosta ja PDF-tarkistusmuistiosta. Nämä dokumentit eivät kuulu repositorion MIT-lisenssin alle. |
| Tutkimuksen omat muistiot, laskelmat ja ohjelmat | Tämä projekti. Lähdetietojen ehdot eivät muutu johdetun laskelman tai tiedostomuunnoksen vuoksi. |

[CC BY 4.0 -lisenssi](https://creativecommons.org/licenses/by/4.0/) edellyttää asianmukaista nimeämistä ja muutosten ilmoittamista. Tässä julkaistut johdetut JSON-profiilit ja raportin laskelmat ovat projektin tekemiä muunnoksia; alkuperäisiä julkaisijoita ei esitetä projektin johtopäätösten hyväksyjinä.

## Paikalliseksi jätetyt tiedostot

`publication-manifest.json` luettelee jokaisen työtilan tiedoston julkaisupäätöksen. Salaisuuksien sisältöä ei luettu eikä niiden tarkistussummia laskettu. Lähdekopioiden tarkistussummat säilytetään jäljitettävyyttä varten.

Julkiseen kopioon ei sisälly `.env`, paikallinen automaation tila/lukko/STOP, ladattujen verkkosovellusten ohjelmakoodi, täydelliset verkkosivukopiot tai sellaiset täydelliset raporttitaulukot/kuvat, joiden erillistä uudelleenjakeluehtoa ei vahvistettu. NORDCANin lähdepoiminnat säilyvät paikallisessa tutkimuskopiossa; sen rajatut havainnot ja lähdeviitteet ovat raportissa. Tämä ei väitä, että kaikki pois jätetyt materiaalit olisivat suljettuja: kyse on tässä julkaisussa vahvistetusta käyttölaajuudesta.

GitHub-kopion Markdown-tiedostojen konekohtaiset paikallislinkit muutettiin suhteellisiksi. Alkuperäisen raportin SHA-256 ja QA kuvaavat alkuperäistä tarkistettua tiedostoa; julkaistun kopion oma tiiviste on manifestissa. Sisältölukuja tai tutkimustuloksia ei muutettu. Tutkimussilmukka pysyy pysäytettynä; tämä repositorio ei luo ajastuksia.
