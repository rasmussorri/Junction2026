---
title: NORDCAN, ECIS ja alueelliset hoitoonpääsylähteet
tarkistettu: 2026-11-14
tila: varmennettu-rajattu-otos
---

# NORDCAN, ECIS ja alueelliset hoitoonpääsylähteet

Tarkistus 14.11.2026 klo 01.41–01.47 Suomen aikaa. Tarkat UTC-ajat, HTTP-vastaukset, tiedostokoot ja SHA256-tiivisteet ovat tämän kansion `*_http_log.json`-tiedostoissa. Aineistot ovat aggregaatteja. Alueportaali ja sen linkittämä THL-kuutio eivät ole kaksi riippumatonta aineistoa.

## NORDCAN: toimiva pieni JSON-poiminta, käyttöehdot rajaavat jatkuvaa keruuta

[NORDCANin tietokanta](https://nordcan.iarc.who.int/en/database) ja [tietoja palvelusta](https://nordcan.iarc.who.int/en/about) ovat JavaScript-sovellus. Web-lukija epäonnistui, mutta suora HTML-lataus onnistui. HTML osoittaa käytössä olevan tietokannan `961`; julkisen sovelluksen [tietokantakomponentti](https://nordcan.iarc.who.int/assets/Database-BA-JM42B.js) vahvistaa version **9.6.1 (9.11.2026)**. Suomen ilmaantuvuus ja kuolleisuus kattavat 1953–2024, prevalenssi 1973–2024 ja kansallinen eloonjääminen 1975–2024. Viiden Suomen suuralueen saatavuustaulukossa ei ole eloonjäämistä. Nämä alueet eivät ole hyvinvointialueita.

[Julkisen sovelluksen sisältö](https://nordcan.iarc.who.int/assets/main-CSBjvrOB.js) kertoo kansainvälisestä luokittelujen harmonisoinnista sekä Suomen pienten lukujen käsittelystä: 1–4 tapauksen soluja tasataan viiden vuoden jaksoissa. Siksi myös ikäryhmien summat voivat olla desimaaleja. NORDCANin arvoja ei saa tulkita aina kokonaislukuisiksi havaituksi vuosimääriksi. Sovellus tarjoaa CSV/XLSX-viennin, mutta tätä käyttöliittymävientiä ei tässä testattu.

Saman lähteen käyttöehdot sallivat tietojen käytön lähdeviitteellä, mutta edellyttävät ANCR:n kirjallista lupaa järjestelmälliseen poimintaan kokoelman, tietokannan tai hakemiston kokoamiseksi. **Älä luokittele lähdettä rajoituksettomaksi avoimeksi API-aineistoksi tai lisää sitä automaattisen jatkuvan massakeruun kohteeksi.** Yksi rajattu vertailupoiminta ja menetelmätarkistus ovat tässä tehty työ; jatkokäytön laajuus on ratkaistava erikseen.

### Toteutunut lataustesti

Sovelluksen HTML:stä ja lataamasta taulukkokomponentista löydetyt osoitteet, ei arvattu API:

- [Syöpäluokituksen JSON](https://canapi.iarc.who.int/api/nordcan/v2/961/meta/cancers/all/): 65 luokitteluriviä, 12 791 tavua; `180 = Breast`, ICD `C50`.
- [Väestöluokituksen JSON](https://canapi.iarc.who.int/api/nordcan/v2/961/meta/populations/all/): 31 riviä, 7 500 tavua; `246 = Finland`, suuralueet `2460`–`2464`; kansallisella rivillä `survival:true`, Suomen alueriveillä `false`.
- [Yhden vuoden ja syöpäryhmän JSON-otos](https://canapi.iarc.who.int/api/nordcan/v2/961/data/population/0/2/(246)/(180)/?ages_group=0_17&year_start=2024&year_end=2024&year_grouped=1): GET → 200, `application/json`, 1 236 tavua, **yksi dataset-rivi**, `error:[]`.

Otoksessa `country=246`, `cancer=180`, `year=2024`, `type=0`, `sex=2`, 18 ikäryhmää ja 24 kenttää. Kenttiä ovat `ages`, `populations`, `total`, `total_pop`, `crude_rate`, `asr`, `asr_e`, `asr_e2013`, `asr_n` ja kumulatiivisen riskin kentät. Standardiväestöä ei saa vaihtaa huomaamatta vertailun aikana. Tämä on sovelluksen käyttämä, teknisesti toimiva JSON-päätepiste; julkista erillistä API-palvelulupausta ei varmennettu.

Otos osoittaa konkreettisen laaduntarkistustarpeen: `total=5231.6`, kahdessa nuorten ikäryhmässä luvut 0.2 ja 1.4. Ikäryhmien tapausmäärien summa täsmää kokonaisarvoon. `total_pop=2837576`, mutta julkaistujen ikäryhmäväestöjen summa on 2837574: kahden henkilön ero jätetään dokumentoiduksi, eikä korjata oletuksella. Karkea ilmaantuvuus täsmää laskuun `total / total_pop * 100000`. `cum_risk` on null, vaikka `cum_risk_74` ja `cum_risk_79` ovat numeerisia. Null ei ole nolla. Kenttätarkistus: `nordcan_profile.json`.

**Hackathon-käyttö:** valikoitu pohjoismainen taustavertailu. Ei seulontakutsuja, poikkeavan löydöksen jälkeisiä tapahtumapäiviä tai henkilökohtaisia hoitopolkuja.

## ECIS: ennusteet ja historialliset havainnot erotettava

[ECISin tietokantakuvaus](https://ecis.jrc.ec.europa.eu/database-description) erottaa vuoden 2024 ilmaantuvuus-/kuolleisuusarviot historiallisista rekisteritiedoista sekä vuoden 2050 projektiot. Vuoden 2024 arviot on julkaistu 17.12.2025 ja päivitetty 2026. Suomen 1–4 tapauksen/kuoleman soluja käsitellään viiden vuoden jaksojen sisällä niin, että jakson summa säilyy mutta yksittäisten vuosien määrät voivat muuttua. Vuosittainen pienten solujen poikkeama ei tällöin suoraan kuvaa havaittua ilmiötä.

[Rekisteriluettelossa](https://ecis.jrc.ec.europa.eu/list-registries-contributing-ecis-historical-data) Suomen ilmaantuvuuden, kuolleisuuden ja väestön ajanjakso on **1953–2023**, päivitys **15.12.2025**. Tämä eroaa NORDCANin varmennetusta 2024-päätevuodesta. Listan eri syöpäluokkien lukumääriä ei summattu uusiksi potilasmääriksi.

[Datatutkain](https://ecis.jrc.ec.europa.eu/data-explorer) on selainpalvelu. Suorat tämän tarkistuksen lataukset tietokantakuvaukseen ja tutkainsivulle palauttivat **HTTP 200, mutta vain 244 tavun `Request Rejected` -HTML:n**. HTTP-koodia ei siten lasketa onnistuneeksi dataset-lataukseksi. Web-lukija pystyi lukemaan primäärisivujen sisällöt. Koneellista pientä dataexporttia ei saatu varmennettua.

[Koko historiallisen aineiston CSV-lataus](https://ecis.jrc.ec.europa.eu/contact/download_the_dataset) ohjaa lomakkeelle, jossa kysytään organisaatiota, tutkimuksen tarkoitusta ja odotettua tuotosta. Lomaketta ei täytetty tai lähetetty. Ei pidä merkitä tähän suoraa anonyymisti testattua CSV-osoitetta.

[Komission oikeudellinen huomautus](https://commission.europa.eu/legal-notice_en) antaa EU:n omistamalle sisällölle lähtökohtaisesti CC BY 4.0 -ehdon, ellei muuta mainita; kolmansien osapuolten oikeudet on huomioitava. ECIS ohjeistaa lähdeviitteen ja käyttöpäivän. Varsinaisen ladattavan tiedoston mahdollisia lisäehtoja ei tässä varmennettu. **Hackathonissa ECIS sopii eurooppalaisen mittakaavan vertailuun, ei Suomen alueellisen seulonta–diagnoosi-viiveen lähteeksi.**

## Kolme alueellista primäärilähdettä

| Lähde ja varmennettu sisältö | Julkaisumuoto ja lataus | Tulkinta ja rajoitus |
|---|---|---|
| [HUS: hoitoonpääsy](https://www.hus.fi/potilaalle/opas-potilaalle/oikeutesi-potilaana/hoitoonpaasy-erikoissairaanhoidossa), 30.9.2026: syöpätautien odotusajan mediaani **7 vrk**; sivu päivitetty 28.10.2026 | Aito HTML-taulukko, GET200, 294152 tavua. Linkit THL:n alue- ja erikoisalakuutioihin. Ei erillistä avointa CSV/API-jakelua varmennettu tältä sivulta. | Erikoisalapohjainen mittari, ei kaikkien syöpäpotilaiden tai syöpäkirurgian mittari. Sivun sanallinen mediaanikuvaus ei yksilöi laskennan alku-/loppupäivää ja kohorttia riittävän tarkasti: **ei diagnoosista hoitoon -mediaani**. |
| [Päijät-Häme: hoitoon pääsy](https://paijatha.fi/asiointiopas/hoitoon-paasy/), [huhtikuun 2026 PDF](https://paijatha.fi/wp-content/uploads/2026/05/Jonoraportti_04_2026.pdf) | GET200, `application/pdf`, 41687 tavua, yksi sivu. Teksti purettu ja sivukuva tarkastettu. Syöpätaudit ja sädehoito: 0–90vrk **1**, 91–180vrk **tyhjä**, total **1**. Sivu linkittää myös vuoden2026 THL-näkymään ja kuukausi-PDF-arkistoon. | **Hoitoa odottavien tilannekuva**, ei toteutunut hoidon viive. PDF:ssä ei ole >180vrk-saraketta; tyhjän solun semantiikkaa ei selitetä. Älä laajenna puuttuvaa saraketta nolliksi. Historiallinen PDF ei vahvista syyskuun THL-solun kattavuutta. |
| [Varha: hoitoon pääsyn tilastot](https://www.varha.fi/fi/tietoa-meista/asiakkaana-hyvinvointialueella/hoitoon-paasyn-tilastot-sote-palveluissa), syyskuu2026, päivitys21.10.2026 | Web-lukijalla varmennetut julkiset HTML-prosenttitaulukot kunnittain/palveluntuottajittain, ikäryhmittäin sekä lääkäri-/hoitajakäynneittäin. Suora HTTP-lataus403. Lähdelinkit THL:ään. | Yleinen perusterveydenhuolto, ei syöpädiagnoosikohtainen. Mittari alkaa hoidon tarpeen arvioinnista ja päättyy toteutuneeseen käyntiin; mukana etäasiointi. **Sivun mukaan toukokuusta2026 alkaen lääkärin ja hoitajan vastaanottojen tiedoissa on ohjelmistovirheestä johtuvaa vajetta.** Myös arvioinnin ja käynnin yhdistämisessä on ollut ongelmia. |

Näille kolmelle paikalliselle julkaisulle ei varmistunut erillistä avointa datalisenssiä. Julkinen katselu ja tekninen latautuminen eivät yksin todista rajoituksetonta uudelleenjakelua. HUSin ja Päijät-Hämeen THL-linkit ovat saman hoitoonpääsyperheen alueellisia näkymiä, eivät lisättävää riippumatonta evidenssiä. Varhan dokumentoitu ohjelmistovaje on hyödyllinen laatuannotaatio ennen minkään alueellisen viivevertailun tulkintaa.

## Seuraavat tutkimustavoitteet

1. **Määritelmäauditointi:** varmista HUSin 7vrk-mittarin kohortti ja aikapisteet THL:n mittarimetadatasta ennen vertailua muiden alueiden mediaaneihin. Nykyinen näyttö riittää vain erikoisalan julkisen tunnusluvun tunnistamiseen.
2. **Saatavuusero:** selvitä Päijät-Hämeen huhtikuun paikallisen onkologiarivin ja myöhempien THL-puuttuvuuksien raportointiketju. Nykyinen PDF ei osoita hoitokatkosta eikä syyskuun nollaa.
3. **Yhteismitallinen kansainvälinen vertailu:** jos vertailupoiminnan käyttölaajuus sopii ehtoihin, kiinnitä syöpäluokka, ikävakioinnin standardi, sukupuoli ja viiden vuoden jakso; erottele NORDCAN-havainnot ja ECIS-arviot. Älä käytä näitä seulonnan onnistumisen kausaalisena testinä.

## Toistettavuus

HTTP-lokit: `http_log.json`, `followup_http_log.json`, `nordcan_metadata_http_log.json`, `nordcan_helper_http_log.json`, `nordcan_sample_http_log.json`. Alkuperäiset HTML/JS/JSON/PDF-vastaukset säilytettiin tässä kansiossa; ne eivät ole uusi yhdenmukaistettu avoin dataset. Pienimmän NORDCAN-dataotoksen SHA256: `9d356b19eefb60059092224e3373e952c47b2cee3e7c56c54a59957f985178a7`. Päijät-Hämeen PDF:n SHA256: `febc81b2360d0e4b1a99e3fb0c59f3173380ac2cba874ad78a78ed137669ced8`.

Web-lukijalla ilman paikallista onnistunutta sisältölatausta tarkistettiin ECISin tietokantakuvaus, rekisteriluettelo, latauslomake ja komission käyttöehdot sekä Varhan sisältö. Niille ei keksitä paikallisen datasetin HTTP- tai SHA-tietoa. Epäonnistuneen 244-tavuisen ECIS-vastauksen tiiviste on lokissa **virhevastauksen**, ei datan, tiiviste.
