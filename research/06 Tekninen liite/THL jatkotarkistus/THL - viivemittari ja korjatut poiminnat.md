---
tila: osittain-vahvistettu
päivä: 2026-11-14
perheet: [THL-Hilmo, THL-Avohilmo, THL-hoitoonpääsy]
---
# THL — viivemittari ja korjatut poiminnat

Tämä jatkotarkistus teki aidot GET-haut ja tallensi lähdevastaukset. `http_test_log.json` ja `http_followup_log.json` sisältävät URL:n, tarkan UTC-ajan, HTTP-statuksen, sisältötyypin, koon ja SHA-256:n. Suurimman onnistuneen latauksen koko oli 514 261 tavua (Avohilmon dimensiot). `profiles.json` ja `ratio_checks.json` sisältävät toistettavan rakenne- ja aritmetiikkatarkistuksen.

## 1. Todellinen odotusaikaluokka löytyi numeroina

**Vahvistettu:** mittari 738217 on **Yli 180 vrk hoitoa odottaneet, %**, ja 738216 sen lukumäärä. Erikoisala 862186 on **65 Syöpätaudit**. Molemmat mittarit palauttivat numeroarvoja eksplisiittisellä suodatuksella. [Mittarin kuvaus: osuus](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne/738217), [lukumäärä](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne/738216).

Testattu osuuskysely:

<https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738217>

Lukumäärähaussa viimeinen suodatin on `measure-738216`; myös `measure-738218` (1–90 vrk hoitoa odottaneet) ladattiin. Tulokset ovat `dataset`-avaimen alla, ulottuvuudet tuottaja ja ajankohta, koko 20 × 110. Osuus- ja lukumääränäytteessä kummassakin on 1 444 eksplisiittistä arvoa, joista 1 117 on nollia, ja 756 puuttuvaa avainta. **Eksplisiittinen nolla ja puuttuva avain ovat eri asia.** Tässä ei näkynyt salausmerkkejä, mutta se ei osoita kaikkien lähteiden suojauskäytäntöjä.

**Oma laskentatarkistus:** kaikki 1 444 solua, joissa yli 180 vrk odottaneiden määrä, kaikki odottaneet ja prosentti olivat saatavilla, täsmäsivät kaavaan `100 × yli180 / kaikki_odottaneet` yhden desimaalin pyöristyksen tarkkuudella (±0,05 pp). Prosentin nimittäjä sai siis myös aritmeettisen varmistuksen.

Syyskuun 2026 havaintoja (30.9.2026):

| Tuottaja | Kaikki odottaneet | Yli 180 vrk | Osuus |
|---|---:|---:|---:|
| Etelä-Karjala | 9 | 0 | 0,0 % |
| HUS | 283 | 0 | 0,0 % |
| Satakunta | 8 | 2 | 25,0 % |
| Julkaistu kaikki hyvinvointialueet -rivi | 486 | 2 | 0,4 % |

Satakunnan 25 % perustuu vain kahteen kahdeksasta, eikä ole peruste nimetä aluetta huonoksi syövänhoitajaksi. Helsinki-, Kainuu-, Pirkanmaa- ja Päijät-Häme-tuottajarivit ovat kyseisen erikoisalan viimeisellä ajankohdalla tyhjiä. Niitä ei korvata nolliksi. Kokonaisrivi on julkaisijan kooste; se ei todista puuttuvien tuottajarivien täydellistä kattavuutta.

**Tulkintaraja:** tämä on mittaushetkellä jonossa olevien odotusajan luokka ja osuus, ei hoidettujen mediaaniviive, yksilön diagnoosi–hoito-aika eikä kiireellisen syövänhoidon kattava seuranta. Hoitoonpääsyn tilasto koskee julkista kiireetöntä erikoissairaanhoitoa; kuukausitiedot voivat tarkentua ja hoidon tarpeen arvioinnin kirjaaminen vaihtelee. [THL:n tilastokuvaus](https://thl.fi/data-ja-tilastot/hoitoon-paasy/erikoissairaanhoito).

**Päätelmä:** teknisesti käyttökelpoinen viikonlopun rajattuun jonotilanteen kuvaamiseen. Julkaisun tarkka odotusajan alkutapahtuma, kattavuus ja organisaatioiden ajallinen vertailukelpoisuus on vielä varmistettava. 180 vuorokauden raja ei ole tässä osoitettu syöpäkohtaiseksi hoitotavoitteeksi.

## 2. Hilmo: syöpätautien potilaat, ei syövän ilmaantuvuus

**Vahvistettu:** `speciality-17958` tarkoittaa Syöpätaudit (koodi 65); oletusmittari on 17881 **Kaikki potilaat**. Sekä alkuperäinen lyhyt URL että alla oleva eksplisiittinen pyyntö tuottivat identtisen datasetin. [Näkymä](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j?filter=speciality-17958), [dimensiot](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.dimensions.json).

<https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.json?row=area-2079&column=time-6656&filter=speciality-17958&filter=measure-17881>

Näyte: 26 alueluokkaa × 12 aikaluokkaa, 286 arvoa. Varsinaiset vuodet ovat 2015–2025; kahdestoista aikaluokka on Kaikki vuodet, jonka 26 solua ovat tyhjiä. Alueluokkiin sisältyvät hyvinvointialueet, Helsinki, Ahvenanmaa, Ulkomaat, Tieto puuttuu ja Koko maa. Näitä ei summata keskenään. Vuonna 2025 julkaisun Koko maa -arvo on 74 504; Helsinki 9 327 ja Kainuu 288. Nämä samat solut näkyvät tallennetussa HTML:ssä.

Metadata sisältää lisäksi päädiagnoosin, ikäryhmän, sukupuolen sekä muun muassa hoitojaksojen ja avohoitokäyntien mittarit. Niiden yhdistelmäpoimintoja ei tässä kokeessa ajettu. Hoitoaika keskimäärin (vrk) on hoitojakson mittari, jota ei saa nimetä hoitoonpääsyn viiveeksi ilman erillistä määritelmää. Ei avoimia potilasrivejä, TNM-ulottuvuutta tai suunniteltujen/peruttujen aikojen ulottuvuutta tarkistetussa kuutiossa.

**Vahvistettu sivulta:** footer näyttää CC BY 4.0 -merkinnän ja päivityksen 11.8.2026. **Päätelmä:** soveltuu palvelukäytön makrokuvaukseen, mutta erikoisala ei ole kaikkien syöpäpotilaiden tai syöpähoitojen kohortti. Alueen määritelmä (asuinalue ja alueluokituksen ajankohta) on varmistettava ennen seulontaliitosta.

## 3. Avohilmo: alkuperäinen C50-kysely korjattiin

**Tärkeä tekninen oikaisu:** alkuperäisen kartoituksen URL `...fact_ahil_perus06.json?filter=diagnoosi-121077` palautti HTTP 200, mutta `value: []`. Oletusrivit olivat 23 diagnoosipääluokkaa × 10 aikaluokkaa. Tätä vastausta ei saa merkitä toimivaksi rintasyövän datapoiminnaksi. Tyhjä tulos ei tarkoita, ettei rintasyöpäasiakkaita olisi.

**Korjattu ja testattu** poiminta käyttää alueita riveinä ja eksplisiittistä Asiakkaat-mittaria:

<https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.json?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454>

[HTML-näkymä](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454) näyttää samat rajaukset: C50 Rintasyöpä, Asiakkaat. [Dimensiot](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.dimensions.json) vahvistavat tunnisteet 121077 ja 87454. Vastauksessa 26 alueluokkaa × 10 aikaluokkaa, 258 arvoa ja 2 puuttuvaa avainta. Vuodet 2018–2026 sekä Kaikki vuodet; vuosi 2026 on kesken. Ajankohdat eivät ole henkilön tapahtumapäiviä.

Vuoden 2025 esimerkit: Etelä-Karjala 169, Helsinki 1 288, Kaikki kunnat 12 926. Saman taulukon Kaikki vuodet -rivin kokonaisasiakasmäärä 50 426 ei ole vuosilukujen summa. Henkilö voi olla usean vuoden asiakas. Sama koskee alue-/sektorilukujen mahdollista päällekkäisyyttä: yhteenlaskun sallittavuus pitää vahvistaa.

Skeeman muut ulottuvuudet: palvelusektori, palvelumuoto ja ammatti. Tässä kuutiossa ei näy ikää, sukupuolta, stagea eikä potilaan hoitoketjun aikaleimoja. Diagnoosikirjauksiin liittyvä asiakas ei ole uusi syöpätapaus. Footer näyttää CC BY 4.0 ja päivityksen 11.11.2026.

**Päätelmä:** teknisesti käyttökelpoinen C50-diagnoosilla kirjattujen asiakkaiden palvelukäytön kuvaus. Potilaspolkujen viiveet ja poisjäännit eivät ole tällä poiminnalla selvitettävissä. Esimerkiksi Kanta-Hämeen asiakkaiden muutos 1 267 → 347 vuosina 2024–2025 on ensin kattavuus-/kirjaamisjatkokysymys, ei näyttö hoidon romahtamisesta.

## 4. Epäonnistumiset ja seuraavat tarkistukset

- Arvatut `/meta`-päätteet palauttivat HTTP 200 mutta vain 41 tavun tyhjän HTML-rungon. Niitä ei käytetä metadatalähteinä. Kelvolliset dimensiot saatiin sivun oikeista `.dimensions.json`-linkeistä; sisältö on JavaScript-kääreessä, joka jäsennettiin tekstinä ilman suorittamista.
- Avohilmon näkymän Lue lisää -linkki usein kysyttyihin kysymyksiin palautti 403 sekä verkkolukijalla että suoralla GET-kokeella. `faq_test.json` dokumentoi suoran yrityksen. Pienlukusuojauksen tarkkaa sääntöä ei siksi vahvistettu tässä erässä.
- Selvitä odotusajan alkutapahtuma ja puuttuvien tuottajasolujen merkitys alkuperäisestä keruuohjeesta; tarkista mahdolliset organisaatiomuutokset.
- Ennen alueiden yhdistelyä varmista Hilmon/Avohilmon asuinaluekäsitteet, luokitusvuosi sekä seulonnan aluekoodit. Jonon tuottaja ei ole suoraan asuinalue.
- Mahdollinen uusi tutkimustavoite: selittyykö Avohilmon Kanta-Hämeen 2024–2025 C50-asiakasmäärän muutos diagnoosikirjausten yleisellä kattavuusmuutoksella? Vertaa ensin muiden diagnoosien/kaikkien asiakkaiden ja sektorien raportointia, älä tulkitse yksittäistä laskua hoidon muutokseksi.

Toistaminen: `check_thl.py` ja `followup_downloads.py` tekevät verkkopyynnöt; `profile_thl.py` laskee tallennetuista näytteistä profiilit ja yli 180 vrk -osuuksien aritmetiikkatarkistuksen. Vältä turhia uudelleenlatauksia: nykyiset lähdevastaukset ovat tässä kansiossa.
