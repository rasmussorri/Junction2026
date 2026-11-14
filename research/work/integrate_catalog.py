from pathlib import Path
root=Path(__file__).resolve().parents[1]
catalog='''# Dataset-katalogi

Päivitetty 14.11.2026. Tämä on varmennusten tilanne, ei lupaus jokaisen lähteen täydellisestä kattavuudesta. **V** = primäärisisältö avattu; **D** = oikea havaintodata todella ladattu; **M** = vain metadata/lähdekuvaus; **A** = lisätarkistus avoin. Lisenssi kuuluu tietotuotteelle, ei automaattisesti koko organisaation kaikille lähteille. HTTP 200 ilman arvoja ei ole D.

## Perheet ja tietotuotteet

| Perhe | ID:t ja tietotuotteet | Mitä saadaan | Pääsy / tekninen näyttö | Käyttöehto ja päätös |
|---|---|---|---|---|
| Suomen Syöpärekisteri, syöpätilastot | D01 [tilastosovellus](https://tilastot.syoparekisteri.fi/syovat/); D05 [kliiniset ilmoitukset](https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/) | Ilmaantuvuus, kuolleisuus, vallitsevuus, suhteellinen elossaolo; sovelluksen levinneisyys on tuntematon/paikallinen/ei paikallinen | D01 V+D: kuuden rivin stage-CSV 2020–2024. D05 A | Sovellus CC BY 4.0. Ilmoitusten kattavuus ei sama asia kuin syöpätapausten kattavuus |
| Syöpärekisteri, seulontarekisterit | D02 [suolisto](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html), D03 [rinta](https://stats.cancerregistry.fi/joukkistilastot/rinta.html), D04 [kohdunkaula](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html), [seulontasovellus](https://tilastot.syoparekisteri.fi/seulonta/) | Poimitut/kutsutut, osallistuneet, löydökset ja ohjelmakohtaiset jatkotutkimukset; alue/vuosi sekä erilliset ositteet | D02/D03 V+D: 34/61 todellista HTML-taulukkoa. D04 tarkistuserä käynnissä. Viiveet PNG-kuvioita, numerovienti A | Sovelluksen ohje CC BY 4.0; staattisen raportin aineistolisenssin soveltamisala vielä A. Ensisijainen tutkimus/MVP-perhe |
| Syöpärekisterin laaturaportit | D07 [keuhko 2019–2023](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html), D08 [myelooma](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html) | Rekisterilinkitykseen perustuva hoidon ja kattavuuden julkinen raportti | D07 V, HTML luettu verkkolukijalla; suora GET 403. D08 A | Ei avoimia henkilörivejä. Hoitokirjauksen puute ei todista hoidon puuttumista. Raportit eivät ole itsenäisiä perusrekistereitä |
| Syöpä- ja seulontarekisterien tutkimusaineistot | D09 [aineistokatalogin kuvaus](https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0) | Mahdollinen henkilötason linkitys tutkimusluvalla | A: tähän projektiin poimittavaa kenttäluetteloa ja reittiä ei vielä vahvistettu | Ei viikonlopun avoin syöte |
| THL Hilmo | D10 [alueittain](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j); D11 [toimenpiteet](https://sampo.thl.fi/pivot/prod/fi/thil/perus01/fact_thil_perus01) | Potilaat, käynnit/jaksot; erikoisala ja diagnoosivalinnat. Toimenpidetuote erillinen näkymä | D10 V+D: syöpätautien potilaat 2015–2025, 286 arvoa. D11 A | D10 CC BY 4.0. Ei diagnoosi–hoito-tapahtumaketjua avoimessa koepoiminnassa |
| THL Avohilmo | D12 [diagnoosit](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06); D13 [toimenpiteet](https://sampo.thl.fi/pivot/prod/fi/avo/perus13/fact_ahil_perus13) | Perusterveydenhuollon kirjattu käyttö, asiakkaat/palveluvalinnat | D12 V+D: korjattu C50-kysely, 258 arvoa. Vanha URL palautti tyhjää. D13 A | D12 CC BY 4.0. Asiakas ei uusi syöpätapaus; 2026 kesken |
| THL hoitoonpääsy | D14 [erikoissairaanhoidon jonot](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne); D15 [perusterveydenhuolto](https://sampo.thl.fi/pivot/prod/fi/avohpaasy/pthjono01/fact_ahil_pthjono01) | Mittaushetken kiireettömän hoidon odottajat ja odotusluokat; PTH erillinen tuote | D14 V+D: yli180vrk määrä ja osuus, 1 444 arvoa, viimeinen 30.9.2026. D15 A | D14 tarkka lisenssi/alkutapahtuma A. Tuottaja ≠ asuinalue; ei kaikkien syöpäpotilaiden viive |
| THL Kansallinen terveysindeksi/Sotkanet | D16 [5643 ikävakioitu](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643), [5644 vakioimaton](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644) | Kolmen vuoden syöpäilmaantuvuuteen perustuva suhteellinen indeksi 2017–2024 | V+M; REST 403, numeerinen poiminta A | CC BY 4.0 metadatafooter. Vuoden2024 arvo koskee2022–2024, ei yhden vuoden viivettä |
| Kela korvaustilastot | D17 [sairaanhoitokorvaukset](https://avoindata.suomi.fi/data/api/3/action/package_show?id=22368122-4f1b-4a8c-8a82-e70cdca843c9); uusi D29 [lääkekorvausoikeudet](https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet) | D17 yleinen korvaus-/palvelutausta. D29 alue×ikä×sukupuoli×oikeuskoodi: alkaneet, voimassa, päättyneet | V+D molemmat pienillä CKAN DataStore-JSON-hauilla; D29 koodi115/vuosi2025 oikeasti suodatettu | CC BY 4.0. Oikeus ei lääkeosto, alkanut oikeus ei uusi diagnoosi. Suuria CSV:tä ei tarvita |
| Kela lääketoimitukset | D18 [nykyinen tilastosivu](https://tietotarjotin.fi/tilasto/2857522/tilasto-sairausvakuutuksesta-korvattavista-laaketoimituksista) | Korvatut apteekkilääkkeet ATC/korvausluokittain | V: NIT137A arkisto2008–2019; Cognos9105RS001 vuodesta2020, vienti A | Sairaalalääkkeet eivät kattavasti mukana; ATC ei diagnoosi |
| Fimea–Kela lääketilasto | D19 [kulutus](https://fimea.fi/en/databases_and_registeries/consumption), [Suomen lääketilasto](https://tietotarjotin.fi/julkaisu/2080816/suomen-laaketilasto) | ATC, tukku-/sairaalamyynti, DDD; vuosijulkaisu | V:2025-julkaisu vahvistettu listalta; PDF403, tarkat taulukot ja vienti A | Kaksi julkaisijaa sama perhe. Ei potilaskohtaista annosta, vastetta tai aloituspäivää |
| Fimea haittavaikutukset | D20 [2024-katsaus](https://sic.fimea.fi/-/millaisia-haittavaikutuksia-laakkeista-ilmoitettiin-vuonna-2024-) | Epäillyt haitat ja ilmoitusmäärät | V:2024 HTML; numeerisen PDF:n suora lataus403;2025sisältö A | Ei altistuneiden nimittäjää: ei riskien tai lääkkeiden turvallisuusjärjestystä |
| Tilastokeskus kuolemansyyt | D21 [11be](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px), D22 [13u5](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px) | 11be kansallinen ICD3×ikä×sukupuoli1998–2025;13u5 alue×laajempi kuolemansyy1969–2025, määrä ja vakioimaton kuolleisuus | V+D:4 ja16 solun JSON-stat2 POST, C50-kansallisluku ristivarmennettu | CC BY 4.0.13u5 ei sisällä ikä/sukupuolta; ei alueellista ikävakiointia näitä marginaaleja yhdistämällä |
| Tilastokeskus väestö/Paavo | uusi D30 [11re väestö](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/vaerak/11re.px); D23 [Paavo](https://stat.fi/en/services/statistical-data-services/statistical-databases/paavo) | Kunta×ikä×sukupuoli vuodenlopussa; postinumeroiden väestö/sosioekonomia | V+D:11re ja Paavo12ey kumpikin10solua. Paavo2026versio sisältää väestövuodet2010–2024 | CC BY 4.0. KU/HVA/PA-koodistot erillisiä; postinumero–kunta-avain pinta-alapohjainen |
| FinnGen/Risteys | D24 [FinnGen-tulokset](https://www.finngen.fi/en/access_results), D25 [Risteys](https://risteys.finngen.fi/documentation) | GWAS-yhteenvedot; endpoint-määritelmät ja aggregoidut taustatilastot | V+D vain R13-manifesti2 754riviä; ei suuria GWAS-tiedostoja. Risteys pääsivuR14, R13erillinen | Latausohje sisältää lomakkeen; ei täytetty. Ei avoimia henkilön hoitopolkuja. Versiot erotettava |
| Findata/FinRegistry | D26 [valmisaineisto](https://findata.fi/en/data/ready-made-datasets/) | Luvanvarainen usean rekisterin tutkimuspoiminta | V+M; ei datalatausta. Päivitys29.9.2026 rajaa pois Primary health care visits, Health care, Intensive care | Lupa, maksu, turvallinen ympäristö. Ei valmis avoin täysi hoitopolku |
| iCAN ja biopankit | D27 [iCAN](https://ican.fi/what-is-ican/), D28 [Fingenious](https://site.fingenious.fi/en/requests-service/) | Molekyyli-/näyte-/terveystiedon tutkimusreitit, kokoelmakatalogi | M: ei potilasdataa tai avointa hoitopolkuvientiä testattu | Tutkimuskohtainen pääsy. Fingenious kuvaa2–3viikon feasibility- ja4–8viikon access-käsittelyn keskimääräisinä, ei takuuna |
| Pohjoismainen/eurooppalainen vertailu | D06 [NORDCAN](https://nordcan.iarc.fr/en/database), uusi D31 [ECIS](https://ecis.jrc.ec.europa.eu/) | Maiden syöpäkuorma ja elossaolo/ennusteet tuotteen mukaan | T09 käynnissä; käyttöehdot ja pienlukujen muokkaus tarkistetaan | Ei automaattisesti Suomen aineistosta riippumaton, eikä avoin ingestio-oikeus oletuksena |

## Deduplikointi ja puuttuvat perheet

Seulonnan vuositilastot, sovellus, PDF ja Sotkanetin indikaattori voivat perustua samaan rekisteriin. Niiden yhtäpitävyys tukee teknistä tarkistusta mutta ei riippumatonta kausaalista vahvistusta. Hilmon erikoisala-, toimenpide- ja laaturaportit ovat eri näkymiä osin samoihin ilmoituksiin. Kela–Fimea-yhteisjulkaisua ei lasketa kahdeksi aineistoksi. FinnGen, Risteys ja FinRegistry voivat jakaa lähderekistereitä, mutta kohortti ja julkaisutuote eroavat.

Hyvinvointialueiden/sairaaloiden raportit, Etsin/Zenodo ja viralliset koodivarastot tarkistetaan erillisinä löytökanavina. Katalogimerkintä ei vielä tarkoita avointa tiedostoa. Rekisterikuvaus tai hanke-esite ei ole havaintodata. Alkuperäiset28tietotuotetta on säilytetty tunnisteineen; D29–D31 ovat uusia tai täsmennettyjä löytöjä.
'''
(root/'02 Lähteet/Dataset-katalogi.md').write_text(catalog)

infra=root/'06 Tekninen liite/Tutkimusinfrastruktuurit/Tutkimusinfrastruktuurit - pääsy ja versiot.md'
t=infra.read_text().replace('Täsmällinen pääsyprosessi tarkistetaan [palvelun omalta sivulta](https://site.fingenious.fi/en/requests-service/); tämän muistion ensimmäinen vanha FINBB-osoite palautti pelkän sovelluskuoren.','**Vahvistettu** [palvelun omalta sivulta](https://site.fingenious.fi/en/requests-service/): feasibility- ja access-pyyntöjen keskimääräiset käsittelyajat ovat 2–3 ja 4–8 viikkoa. Nämä ovat palvelun ilmoittamia keskiarvoja, eivät takuuaikoja tai viikonlopun toimituslupaus. [Rekisteröitymissivu](https://site.fingenious.fi/en/register/) erottaa julkisen kokoelmaselailun, tarkemman saatavuuspyynnön ja varsinaisen pääsypyynnön. Vanha FINBB-osoite palautti pelkän sovelluskuoren.')
infra.write_text(t)

for name,title,body in [
('D16','D16 Sotkanet — syöpäindeksi 5643 / 5644','''Omistaja/julkaisija THL, Kansallinen terveysindeksi; syöpäkomponentin tiedot Syöpärekisteristä. Tämä on rekisteritiedon jalostettu indikaattori, ei itsenäinen potilasaineisto.

| Kenttä | Varmennus |
|---|---|
| Primäärilähteet | [5643](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643), [5644](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644) |
| Mittari | 5643 epäsuorasti viisivuotisikäryhmittäin ikävakioitu, 5644 vakioimaton suhteellinen syöpäindeksi |
| Aika | 2017–2024; kolmen vuoden jaksot, joten2024 =2022–2024 |
| Alue | Kunta, hyvinvointialue, yhteistyöalue, koko maa metadatan mukaan; REST-alue-ID:t vahvistamatta |
| Rajaus | Uusia syöpätapauksia, pois lukien muut ihosyövät kuin melanooma. Myös D-/N-koodeja, ei sama kuin C00–C97 |
| Nimittäjä | Keskiväkiluku. Koko maan viimeisimmän vuoden vertailutaso100 |
| Päivitys | Metadata11.6.2026; myös vanhat indeksiluvut voivat tarkentua |
| Pääsy ja lisenssi | Julkinen metadata avattu, footerCC BY4.0. REST-koe403, ei toimivaksi vahvistettua havaintodatahakua |
| Stage/hoidot/viiveet | Ei tässä indikaattorissa |
| Puuttuvuus | Numeerisen vastauksen null/suojauskoodeja ei nähty; ei keksitty sääntöä |
| Yhdistely | Aluekoodi, kolmen vuoden viitejakso, vakiointiversio. Yhden vuoden seulontaosuuteen liitos ei saman ajanjakson mittaus |
| Työmäärä | Metadata heti käytettävissä. Numeropoiminnan työmäärä avoin403:n vuoksi |

**Sopii:** alueellisen syöpäilmaantuvuuden suhteellisen taustan kuvaamiseen. **Ei sovi:** hoitoviiveiden, uusiutumisen, hoidon laadun tai yksilön riskin mittariksi. Korkea indeksi voi liittyä myös aktiiviseen diagnostiikkaan. Vanhan sairastavuusindeksin0–79vuoden rajaus ei automaattisesti kuvaa nykyistä tuotetta.

Testatut REST-yritykset `/rest/1.1/indicators/5643`, `/5644`, `/regions` ja vuosirajatut datahaut palauttivat403. Tästä ei päätellä palvelun olevan kaikille poissa käytöstä. **MVP-portti ei vielä läpäisty:** todellinen numeerinen poiminta puuttuu. Seuraava työ on dokumentoitu lataustapa tai käyttöliittymän vienti; ei arvattuja arvoja. Evidenssi: [[Tilastokeskus ja Sotkanet — varmennetut aineistot]] ja sen `work/request_log.json`.
'''),
('D21','D21 Tilastokeskus — kuolemansyyt 11be ja alueellinen rinnakkaistuote13u5','''Omistaja/julkaisija Tilastokeskus. Perhe: kuolemansyytilasto. Havainto on taulukon aggregaattisolu, ei yksittäinen kuolintodistus.

| Kenttä | 11be | 13u5, saman perheen täydentävä tuote |
|---|---|---|
| Lähde | [11be](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/) | [13u5](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/) |
| Vuodet |1998–2025 |1969–2025 |
| Ulottuvuudet |1 731kuolemansyyluokkaa,22ikäluokkaa,3sukupuolivalintaa |26aluevalintaa,65kuolemansyyluokkaa; ei ikää/sukupuolta |
| Mittarit |Kuolemien määrä |Määrä, vakioimaton kuolleisuus/100 000 |
| Päivitys |29.10.2026 klo06UTC |Sama |
| Pääsy |PxWebGET-metadata ja4solunJSON-stat2POSTonnistui |GET ja16solunPOSTonnistui |
| Lisenssi |CC BY4.0 |CC BY4.0 |
| Puuttuvuus |Selitteen `...`salattu, `-`nollasuuruus |`.`puuttuva. Pienissä JSON-näytteissä ei null/statuskenttää |

Luokkamäärät sisältävät kokonaisluokat. [API11be](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px), [API13u5](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px). [Käyttöehdot](https://stat.fi/fi/tietoa-meista/tutustu-tilastokeskukseen/lainsaadanto/kayttoehdot). Tarkat POST-rungot ja raakavastaukset: `06 Tekninen liite/Tilastokeskus ja Sotkanet/work`.

**Tarkistettu laskuesimerkki:** C50-rintasyöpäkuolemat koko maassa899vuonna2024 ja907vuonna2025 molemmissa tauluissa.11beC18:928ja926;13u5:n paksusuoliluokka sisältää C18–C19, joten sitä ei käytetä saman rajauksen vastineena.13u5:n keuhkoa muistuttava luokka11 kattaa C32–C34 myös kurkunpään. Vuonna2025 C00–C97-kuolemat koko maassa13 424, vakioimaton kuolleisuus237,8/100 000; Helsinki1 273ja184,7. Näistä ei laadita hoidon paremmuusjärjestystä.

**Alue ja yhdistely:**13u5 käyttää vuoden2026 aluejakoa takautuvasti; kuolleisuus asuinalueen mukaan. Koodit HVA01–HVA21,HVA90Helsinki sekä SSS/MA1/Ahvenanmaan luokittelutasot erotettava.11re-väestötaulun saman niminen aluesarake käyttää KU-koodeja. Kokonaisluokkien ja osien summaaminen tuottaa kaksoislaskentaa. Vuosiluvut eivät ole potilaan diagnoosi-/hoitopäiviä.

**Sopii:** kansallinen ikä-/sukupuolittainen syöpäkuolleisuus ja erikseen rajattu alueellinen vakioimaton kuvaus. **Ei sovi:** potilaskohtainen elossaolo, diagnoosi–hoito-viive tai kuoleman aiheuttaneen palveluviiveen tunnistaminen.11be:n kansalliset ikäsolut eivät täydennä13u5:n puuttuvia alue–ikäsoluja; alueellista ikävakiointia ei saada näitä marginaaleja yhdistämällä.

**Viikonloppu:** rajattu kuolleisuustaustan analyysi teknisesti ja käyttöehdoiltaan toteutuskelpoinen, arviolta2–4h. Laajempi aikasarja tarkistaa kuolemansyyluokituksen muutokset metadatan huomautuksista ja pitää vuodenlopun väestön erillään keskiväkiluvusta. [[Tilastokeskus ja Sotkanet — varmennetut aineistot]].
''')]:
    files=list((root/'03 Dataset-kortit').glob(name+' *.md')); assert len(files)==1
    files[0].write_text('# '+title+'\n\nTarkistettu14.11.2026.\n\n'+body)
print('Updated grouped catalog, infrastructure status and cards D16 D21')
