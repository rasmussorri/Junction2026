---
tarkistettu: 2026-11-14
tila: osittain-vahvistettu
---
# Tutkimusinfrastruktuurit — pääsy ja versiot

## FinnGen: avoimet yhteenvedot, ei avoimia henkilörivejä

**Vahvistettu:** [FinnGenin tulossivu](https://www.finngen.fi/en/access_results) nimeää julkiseksi GWAS-julkaisuksi DF13:n (2.6.2026), 500 186 osallistujaa ja 2 755 endpointia. Sivun latausprosessi ohjaa lomakkeeseen ja sähköpostiohjeisiin; lomaketta ei täytetty. Avoin tulosselain ja yhteenvetotulokset eivät anna henkilötason hoitopolkuja. Syöpäendpointin tapausmäärä on biopankkikohortin määrä eikä Suomen syöpäilmaantuvuus.

**Todellinen pieni lataus:** [R13-manifesti](https://storage.googleapis.com/finngen-public-data-r13/summary_stats/finngen_R13_manifest.tsv) palautti HTTP 200, 820 805 tavua, seitsemän saraketta ja **2 754 datariviä**. Lokissa ovat aika, sisältötyyppi ja SHA-256 (`finngen_manifest_test.json`). Sarakkeet: `phenocode`, `phenotype`, `category`, `num_cases`, `num_controls`, `path_bucket`, `path_https`. Tämä on tiedostoluettelo ja tapaus-/verrokkimäärät, ei itse varianttikohtainen GWAS-aineisto. Varsinaisia suuria `.gz`-tulostiedostoja ei ladattu.

Esimerkiksi `C3_BREAST_WIDE` sisältää manifestissa 25 272 tapausta ja `C3_COLORECTAL` 10 545. Endpointit ovat osin sisäkkäisiä; niitä ei summata syöpäpotilaiden kokonaismääräksi. Julkaisusivun 2 755 endpointin ja tämän manifestin 2 754 rivin ero jää näkyväksi versio-/jakelukysymykseksi. Kumpaakaan lukua ei korjata arvaamalla. Datan käyttöehtojen täydellistä lisenssitulkintaa ei tässä tehty.

## Risteys: versiota ei saa päätellä FinnGenin yleissivulta

**Vahvistettu:** vanha `risteys.finregistry.fi` ohjautuu Risteyksen R14-sivustoon. [Muutosloki](https://risteys.finngen.fi/changelog) ilmoittaa version 2.8.0 (20.5.2026) käyttävän R14:n fenotyyppi-, genotyyppi- ja laboratoriotietoja. [Erillinen R13-dokumentaatio](https://r13.risteys.finngen.fi/documentation) säilyy saavutettavana. Näin Risteyksen näkyvä versio ja julkisen GWAS-tiedostojulkaisun versio eivät ole yksi yhteinen kello.

Risteys kuvaa endpointin määritelmää, tapausmääriä, ikä- ja sukupuolijakaumaa sekä sairauksien välisiä ajallisia yhteyksiä. R13-dokumentaation mukaan alle viiden henkilön tietoja ei julkaista. Selattava fenotyyppiyhteenveto ei ole avoin tapahtumaketju eikä hoidon ajoitusta optimoiva aineisto. Varsinaista Risteys-taulukon CSV-vientiä tai vakaata API:a ei tässä testattu. Käytettävä versio on aina kirjattava poimintaan.

## Findata ja FinRegistry

**Vahvistettu 29.9.2026 päivitetyltä [Findatan sivulta](https://findata.fi/en/data/ready-made-datasets/):** FinRegistry-valmisaineisto haetaan tietoluvalla, poimitaan ja pseudonymisoidaan luvanhaltijakohtaisesti sekä käsitellään hyväksytyssä ympäristössä, ensisijaisesti Kapselissa. Maksuja syntyy. Yli 20 lähteen kokonaisuus sisältää usein vähemmän muuttujia kuin alkuperäisrekisterit.

Sivun nimenomainen oikaisu on olennainen: **Primary health care visits, Health care ja Intensive care eivät sisälly valmisaineistoon** niiden koon ja rakenteen vuoksi. FinRegistry-tutkimuksen kaikki lähteet eivät siis automaattisesti kuulu saatavilla olevaan valmisaineistoon. Syöpärekisteri, kuolemansyyt, lääketoimitukset, korvausoikeudet sekä reseptit on lueteltu, mutta tähän hankkeeseen saatava kenttä- ja aikapeitto on varmistettava aineistokuvauksesta ja luvasta. Ei viikonlopun avoin lataus, eikä hakemusta tehty.

## iCAN ja biopankit

[iCANin kuvaus](https://ican.fi/what-is-ican/) on tutkimusalustan lähde molekyyliprofiloinnin ja pitkittäisen terveystiedon yhdistämiseen. Aiemmassa verkkoluvussa kuvattiin kumppaneiden sopimuksiin perustuva ympäristö; kaksi tämän erän uudelleenavausta aikakatkaistiin. Tässä ei ole osoitettu avointa aineistovientiä, tarkkaa kenttäluetteloa tai lupaa käyttää potilastietoa. iCAN kuuluu jatkotutkimuksen infrastruktuuriin, ei MVP:n välittömiin syötteisiin.

FINBB/Fingenious on näyte- ja tietohakujen palvelu, ei yksi valmis kansallinen hoitopolku-datasetti. Julkinen kokoelmakatalogi ja tutkimuskohtainen näyte-/tietopyyntö on erotettava. **Vahvistettu** [palvelun omalta sivulta](https://site.fingenious.fi/en/requests-service/): feasibility- ja access-pyyntöjen keskimääräiset käsittelyajat ovat 2–3 ja 4–8 viikkoa. Nämä ovat palvelun ilmoittamia keskiarvoja, eivät takuuaikoja tai viikonlopun toimituslupaus. [Rekisteröitymissivu](https://site.fingenious.fi/en/register/) erottaa julkisen kokoelmaselailun, tarkemman saatavuuspyynnön ja varsinaisen pääsypyynnön. Vanha FINBB-osoite palautti pelkän sovelluskuoren. Yksilötason dataa ei hankittu.

## Merkitys MVP:lle

FinnGen/Risteys auttaa sanastossa ja tutkimuskysymysten taustoituksessa. Findata, iCAN ja biopankit ovat mahdollisia luvanvaraisen jatkoprojektin reittejä. Niitä ei esitetä viikonlopun avoimina hoitopolkulatauksina. Lisäaineiston tarve tulee määritellä tapahtumien, aikaleimojen, seurannan, kohortin ja kattavuuden kautta ennen hakemusta.
