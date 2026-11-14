# Junction 2026 – Suomen syöpädata ja toteutuskelpoinen MVP

**AstraZeneca-haasteen datakartoitus · Tilanne 14.11.2026 · Suomen julkiset aggregaatit ja luvanvaraisen jatkotutkimuksen reitit**

Tämä raportti kokoaa Suomessa saatavilla olevan syöpä-, seulonta- ja syöpähoitodatan, todelliset latauskokeet, aineistojen rajat sekä yhden perustellun viikonlopun toteutuksen. Raportti on itsenäinen: sen lukeminen ei edellytä aiempaa keskustelua tai projektin muistiinpanosovellusta. Teknisessä liitteessä mainitut paikalliset tallenteet ovat tarkistusjälki; keskeiset määritelmät, tulokset ja alkuperäislähteet esitetään tässä.

## 1. Päätös aamun MVP-valintaa varten

**Suositus on rakentaa rajattu tutkimusagentti, joka kuvaa Helsingin rintaseulontaan osallistumista vuosittain ja kutsuikäryhmittäin.** Todellinen CSV on jo ladattu: Helsinki, naiset, vuodet 2010–2024 ja kymmenen ikäluokkaa, yhteensä 150 havaintoriviä. Jokaisen rivin osallistumisprosentti on tarkistettu lukumääristä. Sovelluksen aineistolle on vahvistettu CC BY 4.0 -lisenssi. Demo voidaan toteuttaa tallennetusta aineistosta ilman kirjautumista, tietolupaa tai uutta onnistumista verkkolatauksessa. Ensisijainen esitysaikaväli on 2020–2024; pidempi sarja on tutkittavissa erikseen sen määritelmämuutokset huomioiden. [Seulontasovellus](https://tilastot.syoparekisteri.fi/seulonta/), [aineiston ohje ja käyttöehdot](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html).

**Datan puolesta valmiit kolme analyysiä ovat:** Helsingin rintaseulonnan osallistumisen kehitys, syöpätautien kiireettömän hoitojonon rajattu tilannekuva 30.9.2026 sekä kansallisten syöpäkuolemien rajattu vertailu 2024–2025. Niiden muuttujat, laskut ja rajat kuvataan luvussa 5. Ne ovat erillisiä analyysejä, eivät saman potilaan hoitopolun vaiheita. [THL:n jonotilanne](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne), [Tilastokeskuksen 11be](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/).

Laajempi kansallinen kuva on jo mahdollinen tutkimustarkoituksessa: seulontaraporttien todelliset HTML-taulukot on poimittu suolistosta, rinnasta ja kohdunkaulasta. Niissä näkyy alue- ja väestöryhmäeroja. Kaikkien alueiden vastaavaa sovellus-CSV-vientiä ei kuitenkaan löydy valmiista tallenteista, eikä sovelluksen lisenssiä ole automaattisesti ulotettu erillisiin staattisiin raportteihin. Siksi valtakunnallinen julkaistava aluevertailu on MVP:n ehdollinen laajennus. [Suolisto](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html), [rinta](https://stats.cancerregistry.fi/joukkistilastot/rinta.html), [kohdunkaula](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html).

**Avoin data ei tässä kartoituksessa mahdollista koko ketjun seulonta → poikkeava tulos → diagnoosi → hoito → seuranta potilaskohtaista seuraamista.** Seulonnan jatkotutkimusviiveitä on julkaistu kuvina, mutta tarkkaa numeroaineistoa, havaintomääriä ja kaikkia laskentasääntöjä ei saatu. Hoitojonot kuvaavat jonossa olevia, Hilmo ja Avohilmo kirjattua palvelukäyttöä, Kelan korvausoikeudet oikeutta korvaukseen. Yksikään niistä yksin osoita, että hoito jäi saamatta. Myöhäinen tai ei-paikallinen syöpä ei yksin osoita seulonnan epäonnistumista.

### Näytön lukutapa ja kartoituksen rajaus

Raportin merkinnät ovat:

- **V – vahvistettu:** primäärilähteen sisältö, metadata tai oikea havaintovastaus on aiemmassa tarkistuksessa nähty ja dokumentoitu. Vahvistus koskee nimettyä rajausta.
- **L – oma laskelma:** tulos on laskettu tallennetuista lähdeluvuista. Se ei ole uusi riippumaton tutkimustulos.
- **P – päätelmä tai ehdotus:** perusteltu tulkinta, toteutusvalinta tai työmääräarvio.
- **A – avoin / tarkistamatta:** välttämätön määritelmä, vienti, käyttöehto tai kattavuustieto puuttuu.

Luvuissa 2–3 faktaesitykset ovat V-tasoa, ellei rivillä tai kappaleessa ole muuta merkintää. Saatavuuden **data ladattu** tarkoittaa todellisia arvoja sisältävää vastausta; HTML-sovelluskuori, metadata ja HTTP 200 -virhesivu eivät täytä sitä. Teknisesti toimiva osoite ei yksin osoita pysyvää rajapintapalvelua tai uudelleenjakeluoikeutta. Tarkistukset tehtiin 14.11.2026 Suomen aikaa; UTC-lokeissa osa ajankohdista on 13.11.2026. Tätä lopullista koostetta varten käytettiin vain tallennettua näyttöä ja rajattuja paikallisia tarkistuksia.

Kartoitus priorisoi julkiset suomalaiset aggregaatit. Luvanvaraisista lähteistä tarkistettiin saatavuusreittejä ja metatietoja; henkilötason terveystietoa ei hankittu. Lomakkeita, hakemuksia tai yhteydenottoja ei lähetetty. Katalogi kattaa löydetyt olennaiset perheet, mutta se ei ole väite kaikkien Suomessa olemassa olevien tutkimusaineistojen täydellisestä inventaariosta.

### Strateginen yhteys

Toimitetun *Kansallisen syöpästrategian 2026–2035* sivun 5 tavoitteet ovat 80 %:n seulontaosallistuminen jokaisella hyvinvointialueella ja vähintään 70 % diagnooseista vaiheissa I–II vuoteen 2035. **V:** nämä ovat tulevaisuuden tavoitteita, eivät nykytilan havaintoja, kliinisiä hälytysrajoja tai tässä varmennettuja lakisääteisiä palvelutasoja. Strategian 90 %:n kattavuustavoitteet eivät myöskään kuvaa nykyistä rekisterikattavuutta. [Strategian alkuperäinen PDF](https://stm.fi/documents/1271139/1329769/Kansallinen_syopastrategia_2026_2035_FINAL.pdf/05ad3c9d-d8ba-a629-3e90-e8d10f4f5bbc?t=1767863923329).

Toimeenpanon tiekartta 2026–2031 käsittelee kuukausittaista seulontaraportointia, ohjelman ulkopuolisia testejä, syöpäkohtaisia hoitoketjuja ja laaturekisteriä kehittämistoimina (s. 50–60). Hoidon aloitusviiveet, uusiutuminen, haitat ja potilasraportoidut tiedot ovat tavoiteltuja tietosisältöjä (s. 80), eivät osoitus niiden nykyisestä avoimesta saatavuudesta. Kolme toimitettua PDF:ää luettiin; strategian ja tiekartan suorat latausosoitteet palauttivat aiemmissa kokeissa 403, joten sisältötarkistus perustui toimitettuihin tiedostoihin. Tiekartan julkaisu 23.9.2026 vahvistui FICANilta. [Tiekartta](https://stm.fi/documents/1271139/1359637/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf/6e826620-351e-d6b4-5096-4706357adc45?t=1790152929568), [FICAN](https://fican.fi/toiminta/syopastrategia/tiekartan-valmistelu/).

**A:** annetun [Junction-haasteen osoitteen](https://hackjunction.app/participate/45/challenges/344) suora tarkistus palautti 404. Tarkkoja arviointikriteereitä tai esimerkiksi synteettisen datan hyväksyttävyyttä ei saatu virallisesta haastetekstistä vahvistettua. MVP sopii käyttäjän määrittelemään makrotason tutkimustehtävään; kaikkien kilpailukohtaisten vaatimusten täyttymistä ei väitetä.

## 2. Ryhmitelty dataset-katalogi

D-tunnisteet säilyttävät alkuperäisen kartoituksen tunnistettavuuden. Ne nimeävät tietotuotteita, eivät toisistaan riippumattomia rekistereitä. D29–D31 ovat kartoituksessa lisättyjä tai täsmennettyjä tuotteita.

### 2.1 Syöpärekisteri ja seulontarekisterit

| Tietotuote ja alkuperäinen linkki | Todellinen sisältö ja kattavuus | Pääsy, käyttöehdot ja toteutettavuus |
|---|---|---|
| **D01 [Syöpätilastosovellus](https://tilastot.syoparekisteri.fi/syovat/)** | Ilmaantuvuus, kuolleisuus, vallitsevuus, suhteellinen elossaolo; vuosisarjoja 1953–2024. 2025 ennakkotieto. Levinneisyyskoe: kaikki syövät, koko maa, 2020–2024, kolme karkeaa luokkaa. | Todellinen 6 rivin CSV ladattu. CC BY 4.0. Istuntokohtainen vienti; ei varmennettua pysyvää API:a. |
| **D02 [Suolistoseulonnan vuositilasto](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html)** | Poimitut, onnistunut FIT-testi, positiivisuus, kirjattu kolonoskopia ja löydökset; kansallinen ohjelma 2022–2024, mukana pilottihistoriaa. | 34 aitoa HTML-taulukkoa poimittu. Kolme viivekuvaa, tarkat numerot A. Staattisen raportin datalisenssi A. Suolistoa ei havaittu seulontasovelluksen ohjelmavalinnoissa. |
| **D03 [Rintaseulonnan vuositilasto](https://stats.cancerregistry.fi/joukkistilastot/rinta.html)** ja [seulontasovellus](https://tilastot.syoparekisteri.fi/seulonta/) | Kutsut, tarkastukset, varmistuskutsut, lähetteet, löydökset ja havaitsemistapa. Raportin yksityiskohtaiset vuodet 2020–2024. | 61 HTML-taulukkoa. Sovelluksen Helsinki × vuosi × kutsuikä -CSV, 150 riviä, ladattu CC BY 4.0 -ehdoin. Viiveet viidessä PNG-kuvassa. |
| **D04 [Kohdunkaulaseulonnan vuositilasto](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html)** ja sama seulontasovellus | Ikä- ja riskiryhmäseulonta, kutsut, osallistuminen, HPV/Papa, kolposkopia ja histologia. | 126 HTML-taulukkoa. Sovelluksen Helsingin ikäryhmäseulonnan CSV 1991–2024, 306 riviä, CC BY 4.0. Kymmenen viivekuvaa; niiden numerovienti A. |
| **D05 [Kliinisten ilmoitusten tilasto](https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/)** / [sovellus](https://tilastot.syoparekisteri.fi/syopalaatu/) | Kliinisen ilmoituksen saaneet tapaukset / rekisteröidyt syöpätapaukset; 2000–2025, viimeinen ennakollinen. Kymmenen syöpäryhmää ja niiden yhdistelmä. | Käyttöliittymä ja määritelmä vahvistettu. Numeerinen vienti ja tuotteen lisenssi A. Mittari ei ole kaikkien todellisten syöpien rekisteröintikattavuus. |
| **D07 [Keuhkosyövän laaturaportti](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html)** | 14 873 uutta C33–C34-tapausta 2019–2023; Syöpärekisteri + Hilmo; hoitojen ja 12 kuukauden seurannan aggregaatit. | Raportti luettu, suora lataus 403. Taulukkovienti ja erillinen lisenssi A. Ei avointa potilastiedostoa. |
| **D08 [Myelooman laaturaportti](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html)** | 2 336 henkilöä, joille alkoi uusi lääkekorvausoikeus C90-alkuisella ICD-10-diagnoosilla 2019–2023; Hilmo + Kelan lääkeostot, hoitotietoja vuoden 2024 loppuun. | Päivitys 9.6.2026. Upotetusta JSONista 11 taulukkoa, 1 136 esitysriviä. Excel-painike havaittu, lataus testaamatta; datalisenssi A. |
| **D09 [Syöpä- ja seulontarekisterien tutkimuskatalogi](https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0)** / [metatieto-API](https://aineistokatalogi.fi/api/v1/public/studies/21085403-7be8-4f93-bf05-231518c642a0) | 154 kentän metadata: syöpärekisteri 38, kohdunkaula 41, rinta 26 ja suolisto 49. Metatieto päivitetty 23.10.2026. | Metadata ladattu; henkilötieto salassa pidettävää. Yksilöaineisto Findatan tietoluvalla, pelkkä THL-aineiston anonyymi aggregaattipyyntö THL:lle. Ei viikonlopun avoin syöte. |

**D08:n lisätulkinta, V/L:** myeloomaraportin kansallisen hoitotaulukon 18 prosenttilaskua täsmäsivät. Hoitoluokat ovat päällekkäisiä: esimerkiksi yhdistetty lääkehoitokirjaus 1 863/2 336 = 79,8 %, sairaalakoodi 1 236 ja lääkeosto 1 596 eivät muodosta erillisiä summattavia ryhmiä. Alueosuudet ovat ikävakioituja, joten julkaistu prosentti ei välttämättä ole näkyvien N-lukujen raakaosuus. Alueiden summa 2 301 jää koko maan kohortista 35 henkilöllä; syy jäi A-tasolle. Sairaalalääkityksen puutteet, ensimmäisen vuoden hoitorajaus ja korvausoikeuteen perustuva kohortti estävät tulkitsemasta lukua kaikkien myeloomapotilaiden hoidoksi. Raportin 1, 3 ja 5 vuoden elossaololuvut ovat oma mittarinsa. [Myelooman menetelmät ja taulukot](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html).

### 2.2 THL:n palvelukäyttö, hoitoonpääsy ja indeksit

| Tietotuote ja linkki | Todellinen sisältö | Varmennettu pääsy ja raja |
|---|---|---|
| **D10 [Hilmo, somaattinen erikoissairaanhoito alueittain](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j)** | Erikoisala, alue, vuosi; potilaat, käynnit ja jaksot mittarista riippuen. Syöpätautien potilaiden 2015–2025 poiminta. | 286 arvoa JSONina, CC BY 4.0. Erikoisala ei kata kaikkea syöpähoitoa. |
| **D11 [Hilmon toimenpiteet](https://sampo.thl.fi/pivot/prod/fi/thil/perus01/fact_thil_perus01)** | Toimenpideluokat ja vuosimäärät; testattu HA1CA mammografiaseulonta ja HA1AA rintarauhasten röntgen. | Oikeat pienet JSON-vastaukset. HA1CA:ssa 6 eksplisiittistä arvoa, joista 3 `..`; puuttuvia avaimia 5. HA1AA:ssa 10 numerohavaintoa. Eivät osoita ohjelman ulkopuolisen seulonnan täydellistä määrää. |
| **D12 [Avohilmon ICD-10-diagnoosit](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06)** | Diagnoosilla kirjatut asiakkaat alueittain ja vuosittain; C50-koe 2018–2026, vuosi 2026 kesken. | Korjattu aluevalinnan sisältävä kysely tuotti 258 arvoa. Vanha kysely antoi HTTP 200 ja tyhjän listan. CC BY 4.0. |
| **D13 [Avohilmon toimenpiteet](https://sampo.thl.fi/pivot/prod/fi/avo/perus13/fact_ahil_perus13)** | Toimenpidemäärät ja asiakkaat. Testattu seulontatoimenpiteen alue–vuosi-poiminta. | Kummassakin testatussa mittarissa vain 4 eksplisiittistä solua ja 256 puuttuvaa avainta. A: puuttuvuuden tulkinta ja riittävä kattavuus H03:n testaamiseen. |
| **D14 [Kiireettömän erikoissairaanhoidon jonot](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne)** | Mittaushetken odottajat ja odotusaikaluokat tuottajittain/erikoisaloittain. Syöpätautien viimeinen näyte 30.9.2026. | Lukumäärä- ja prosenttihaut toimivat; 1 444 osuuslaskua tarkistettu. Tämän tuotteen omassa alatunnisteessa CC BY 4.0, päivitys 19.10.2026. |
| **D15 [Perusterveydenhuollon hoitoonpääsy](https://sampo.thl.fi/pivot/prod/fi/avohpaasy/pthjono01/fact_ahil_pthjono01)** | Ensimmäisen hoitotapahtuman toteutuminen ja odotusluokat. Yleinen palvelumittari, ei syöpädiagnoosikohtainen. | Syyskuun 2026 lääkäripoiminnan määrä ja osuus ladattu: 137 numeerista solua kummassakin, 13 puuttuvaa. Rajatut valinnat säilytettävä. Ei syövän diagnoosi–hoito-viive. |
| **D16 [Sotkanet 5643](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643)** / [5644](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644) | Ikävakioitu/vakioimaton suhteellinen syöpäindeksi 2017–2024; kolmen vuoden jaksot. | Metadata ja CC BY 4.0 -alatunniste vahvistettu. REST palautti 403; numeerinen poiminta A. |

D11:n ja D13:n lisäpoiminnat osoittavat, että toimenpidekoodeille on tekninen hakureitti. Ne eivät ratkaise yksityisen tai ohjelman ulkopuolisen mammografian kattavuutta. D15:n 137 määrän ja prosentin parissa suurin laskennallinen ero oli 0,497 prosenttiyksikköä, kokonaislukuprosenttien pyöristymisen sisällä. Näitä yleisiä käyntejä ei nimetä syöpähoidoksi. [Hilmon toimenpideraportti](https://sampo.thl.fi/pivot/prod/fi/thil/perus01/fact_thil_perus01), [Avohilmon toimenpideraportti](https://sampo.thl.fi/pivot/prod/fi/avo/perus13/fact_ahil_perus13), [PTH:n määritelmät](https://thl.fi/data-ja-tilastot/hoitoon-paasy/perusterveydenhuolto).

### 2.3 Lääkkeet, korvaukset, kuolemansyyt ja väestökonteksti

| Tietotuote ja linkki | Sisältö, aika ja tarkkuus | Pääsy ja tulkintaraja |
|---|---|---|
| **D17 [Kelan sairaanhoitokorvaukset, pakettikuvaus](https://avoindata.suomi.fi/data/api/3/action/package_show?id=22368122-4f1b-4a8c-8a82-e70cdca843c9)** | Aika, kunta, ikä, sukupuoli, etuuslaji, saajat, kustannukset ja korvaukset. | Pieni 2025 JSON-otos onnistui, CC BY 4.0. Ei diagnoosia, ATC:tä tai korvausoikeuskoodia tässä tuotteessa. Suurta noin 283 MB:n CSV:tä ei ladattu. |
| **D18 [Korvattavat lääketoimitukset](https://tietotarjotin.fi/tilasto/2857522/tilasto-sairausvakuutuksesta-korvattavista-laaketoimituksista)** | Apteekkien korvatut lääkeostot, ATC ja korvausluokat. | Vanha NIT137A on 2008–2019-arkisto. Nykyinen Cognos 9105RS001 alkaa 2020; varsinainen datavienti A. ATC ei diagnoosi, eikä apteekkiaineisto kata sairaalalääkitystä. |
| **D19 [Fimean kulutustilastot](https://fimea.fi/en/databases_and_registeries/consumption)** ja [Suomen lääketilasto](https://tietotarjotin.fi/julkaisu/2080816/suomen-laaketilasto) | ATC-luokiteltu tukku-/sairaalamyynti ja DDD/1 000 asukasta/vrk; Fimea–Kela-yhteisjulkaisu. | Vuoden 2025 julkaisu löytyi ajantasaiselta listalta. PDF:n sisältö, tarkat taulukot ja lisenssi A (403). Kulutus ei potilaan toteutunut annos. |
| **D20 [Fimean haittavaikutuskatsaus 2024](https://sic.fimea.fi/-/millaisia-haittavaikutuksia-laakkeista-ilmoitettiin-vuonna-2024-)** | Epäillyt haitat ja ilmoitusmäärät; ATC-ryhmä L mukana tekstivastineessa. | HTML-sisältö luettu, suorissa latauksissa 403. Uudemman 2025 katsauksen sisältö A. Altistuneiden nimittäjä puuttuu: ei haittojen ilmaantuvuutta tai lääkkeiden turvallisuusjärjestystä. |
| **D29 [Kelan lääkekorvausoikeudet](https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet)** | Alkaneet, vuoden aikana/koko vuoden/vuoden lopussa voimassa sekä kuolemaan päättyneet oikeudet; alue × ikä × sukupuoli × oikeuskoodi; 1986–2025. | CC BY 4.0. Koodi 115 / 2025: kaikki 486 julkaistua aggregaattiriviä ladattu noin 157 kB:n JSONina. Oikeus ei lääkeosto tai hoidon aloitus. |
| **D21 [StatFin 11be](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/)** | Kuolemansyy ICD-10:n 3-merkkitasolla × ikä × sukupuoli, koko maa, 1998–2025. | 4 solun JSON-stat2 POST onnistui. CC BY 4.0. Ei aluetta tai potilaskohortin elossaoloa. |
| **D22 [StatFin 13u5](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/)** | Alue × laajempi kuolemansyyluokka, 1969–2025; kuolemat ja vakioimaton kuolleisuus. | 16 solun POST onnistui. Ei ikää eikä sukupuolta, joten kansallisista 11be-marginaaleista ei saada puuttuvaa alue–ikätaulukkoa. |
| **D30 [StatFin 11re](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/vaerak/11re.px)** ja [11ra](https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px) | 11re: kunta × ikä × sukupuoli, väestö 31.12., 1972–2025. 11ra: alueiden tunnusluvut, 1990–2025. | 10 ja 46 solun POSTit onnistuneet; CC BY 4.0. Vuoden 2026 aluejako takautuvasti. Vuodenlopun väestö ei korvaa seulontakutsujen nimittäjää. |
| **D23 [Paavo](https://stat.fi/en/services/statistical-data-services/statistical-databases/paavo)** / [2026-version väestö-API](https://pxdata.stat.fi/PxWeb/api/v1/en/Postinumeroalueittainen_avoin_tieto/2026/12ey_ja2026.px) | Postinumeroalueiden väestö; samaan perheeseen kuuluvat tulot, koulutus ja kotitaloudet. 2026-version väestövuodet 2010–2024. | Väestötaulusta 10 solua ladattu, CC BY 4.0. Muiden teemojen vienti A. Postinumero–kunta-avain perustuu suurimpaan pinta-alaosuuteen; suojaus ja alueversiot huomioitava. |

**D29:n rajattu syväprofiili, V/L:** 486 riviä ovat yksikäsitteisiä alue–ikä–sukupuoli–vuosi–koodi-avaimella. Alueita on 24, mukaan lukien Ahvenanmaa ja tuntematon alue, ikäluokkia näytteessä 17 ja sukupuolia kaksi. Julkaistuissa mittareissa ei ole puuttuvia arvoja, mutta havaittujen luokkien 816 mahdollisesta yhdistelmästä puuttuu 330 riviä. Niitä ei ole osoitettu nolliksi; alle 20-vuotiaiden luokkia ei näytteessä ole lainkaan. Alkanut oikeus ei tarkoita uutta diagnoosia ja kuolemaan päättynyt oikeus ei kerro kuolemansyytä. Julkaisija yhdistää saman koodin peräkkäisiä jaksoja enintään 90 päivän katkolla. Alue, ikä ja sukupuoli määräytyvät vuoden lopun tai kuolinpäivän mukaan. [Kelan määritelmät](https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet), [paketti ja lisenssi](https://avoindata.suomi.fi/data/api/3/action/package_show?id=70832958-f7b6-4e09-8350-615362e6ee30).

### 2.4 Tutkimusinfrastruktuurit, kansainvälinen vertailu ja aluejulkaisut

| Perhe / tietotuote | Vahvistettu sisältö ja pääsy | Projektin käyttö ja avoin raja |
|---|---|---|
| **D24 [FinnGen](https://www.finngen.fi/en/access_results)** | Julkinen DF13/GWAS-julkaisu 2.6.2026; manifesti ladattu, 2 754 riviä ja 7 saraketta. Sivulla ilmoitetaan 2 755 endpointia. Suuria GWAS-tiedostoja ei ladattu. | Geneettiset yhteenvetotulokset ja endpointit. Manifesti ei ole varianttidata eikä väestörekisteri. Ero 2 754/2 755 jää A-tasolle; latauslomaketta ei lähetetty. |
| **D25 [Risteys](https://risteys.finngen.fi/documentation)** / [R13-versio](https://r13.risteys.finngen.fi/documentation) | Endpoint-määritelmät ja aggregoidut taustatilastot. Pääsivusto käyttää R14:ää, erillinen R13 säilyy. R13-ohjeessa alle 5 henkilön tiedot jätetään julkaisematta. | Versioitava määrittelylähde. CSV/API-vientiä ei testattu. Ei avoimia henkilön hoitopolkuja. |
| **D26 [Findata / FinRegistry-valmisaineisto](https://findata.fi/en/data/ready-made-datasets/)** | Luvanvarainen monirekisteripoiminta, pseudonymisointi ja hyväksytty käyttöympäristö, ensisijaisesti Kapseli; maksullinen. Päivitetty 29.9.2026. | Valmisaineisto **ei sisällä** nimettyjä kokonaisuuksia Primary health care visits, Health care ja Intensive care. Kenttäpeitto varmistettava; ei viikonlopun avoin lataus. |
| **D27 [iCAN](https://ican.fi/what-is-ican/)** | Molekyyliprofiloinnin ja pitkittäisen terveystiedon tutkimusalusta. | A: tähän hankkeeseen saatava kenttäjoukko ja pääsy. Ei osoitettua avointa potilasdataa. |
| **D28 [Fingenious / biopankit](https://site.fingenious.fi/en/requests-service/)** | Julkinen kokoelmakatalogi sekä erilliset saatavuus- ja pääsypyynnöt. Palvelu ilmoittaa keskimäärin 2–3 ja 4–8 viikon käsittelyajat. | Tutkimuskohtainen näyte- ja tietoreitti. Ajat ovat palvelun keskiarvoja, eivät takuita. Ei viikonlopun aineistolupaus. |
| **D06 [NORDCAN](https://nordcan.iarc.who.int/en/database)** | Versio 9.6.1, 9.11.2026. Suomen ilmaantuvuus/kuolleisuus 1953–2024, prevalenssi 1973–2024, kansallinen elossaolo 1975–2024. Pieni JSON-otos onnistui. | Valikoitu pohjoismainen vertailu. Suomen 1–4 tapauksen soluja tasataan viiden vuoden sisällä. Järjestelmällinen kokoelman/tietokannan keruu edellyttää käyttöehtojen mukaista kirjallista lupaa. |
| **D31 [ECIS](https://ecis.jrc.ec.europa.eu/database-description)** | Historialliset rekisteritiedot, vuoden 2024 arviot ja 2050 projektiot erikseen. Suomen historiallinen sarja rekisteriluettelossa 1953–2023. | Primäärikuvaus luettu; suora kokeiltu vienti antoi 244 tavun virhe-HTML:n HTTP 200:lla. [Historiallisen datan lataus](https://ecis.jrc.ec.europa.eu/contact/download_the_dataset) ohjaa lomakkeelle, jota ei lähetetty. |
| **[HUSin hoitoonpääsy](https://www.hus.fi/potilaalle/opas-potilaalle/oikeutesi-potilaana/hoitoonpaasy-erikoissairaanhoidossa)** | 30.9.2026 syöpätautien odotusajan mediaani 7 vrk; HTML-taulukko ladattu, sivupäivitys 28.10.2026. | Kohortti ja aikapisteet eivät riitä nimeämään lukua diagnoosi–hoito-mediaaniksi. Paikallisen tuotteen datalisenssi A. |
| **[Päijät-Hämeen hoitoonpääsy](https://paijatha.fi/asiointiopas/hoitoon-paasy/)** / [huhtikuun 2026 PDF](https://paijatha.fi/wp-content/uploads/2026/05/Jonoraportti_04_2026.pdf) | Yhden sivun PDF ladattu ja tarkistettu. Syöpätaudit ja sädehoito: 0–90 vrk 1, kokonaismäärä 1; 91–180 vrk tyhjä. | Odottavien tilannekuva. >180 vrk -saraketta ei ole; sitä ei täydennetä nollaksi. Ei vahvista syyskuun THL-solun kattavuutta. Lisenssi A. |
| **[Varhan hoitoonpääsy](https://www.varha.fi/fi/tietoa-meista/asiakkaana-hyvinvointialueella/hoitoon-paasyn-tilastot-sote-palveluissa)** | Yleisen perusterveydenhuollon taulukot. Sivun mukaan toukokuusta 2026 alkaen lääkärin/hoitajan vastaanottotiedoissa on ohjelmistovirheestä johtuva vaje. | Laatuannotaatio on olennainen. Ei syöpäkohtainen mittari; suora GET 403, sisältö luettu verkkolukijalla. Lisenssi A. |
| **[Zenodo 6394091](https://zenodo.org/records/6394091)**, [Etsin](https://etsin.fairdata.fi/), [FinnGenin Risteys-koodi](https://github.com/FINNGEN/Risteys) | Zenodossa suomalaisen seulontaohjelman vuoden 2022 tutkimuksen parametriliite, yksi 20,4 kB XLSX; tiedostoa/lisenssiä ei tarkistettu. Etsin jäi sovelluskuoreksi. Risteys on virallinen MIT-lisensoitu koodivarasto. | Menetelmä- ja löytökanavia. Ei tässä varmennettua uutta Suomen ajantasaista hoitopolku-datasettiä. Ohjelmistolisenssi ei avaa taustarekisteriä. |

**Deduplikointi:** seulontasovellus, vuositilasto, kieliversio ja rekisteristä jalostettu indikaattori voivat käyttää samaa lähderekisteriä. Niiden yhtäpitävyys on tekninen kontrolli, ei riippumaton epidemiologinen vahvistus. Hilmon näkymät, laaturaportit ja paikallisen sivun linkittämä THL-kuutio voivat jakaa samoja ilmoituksia. Fimean ja Kelan lääketilasto on yksi yhteisjulkaisuperhe. FinnGenin, Risteyksen ja FinRegistryn välillä lähderekisterit voivat limittyä, mutta kohortit ja julkaistavat tuotteet eroavat.

## 3. Kymmenen keskeisen aineiston tarkemmat kortit

Kortit painottavat projektin tutkimuskysymyksiä. Kaikki kymmenen eivät läpäise viikonlopun toteutusporttia; esimerkiksi Sotkanetin ja laaturaporttien avoimet kohdat tuodaan näkyviin. Katalogin Kela-, väestö- ja tutkimusinfrastruktuuritäydennykset säilyvät erillisinä vaihtoehtoina.

### Kortti 1 — D01: Suomen Syöpärekisterin syöpätilastot

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Ylläpitäjä ja lähde | Suomen Syöpärekisteri; rekisterinpitäjä THL, tekninen ylläpito Suomen Syöpäyhdistys. [Sovellus](https://tilastot.syoparekisteri.fi/syovat/), [ohje](https://tilastot.syoparekisteri.fi/syovat/help_main_fi.html). |
| Havaintoyksikkö, muuttujat | Aggregaattiryhmä. Ilmaantuvuus, kuolleisuus, vallitsevuus, suhteellinen elossaolo ja riski. Testattu CSV: sukupuoli, karkea levinneisyys, tapausmäärä, vakioimaton sekä kahdella standardilla ikävakioitu suhde. |
| Syövät ja stage | Koepoiminnassa kaikki syövät yhdessä. Luokat tuntematon / paikallinen / ei paikallinen; eivät TNM I–IV. Syöpäkohtaiset valinnat käyttöliittymässä, kaikkia yhteistaulukoita ei testattu. |
| Hoitopolku | Ei yksilöpäiviä, hoitojen aikajärjestystä, lääkitystä, haittoja tai peruutuksia testatussa viennissä. Väestökuolleisuus ja suhteellinen elossaolo ovat erillisiä mittareita. |
| Aika ja alue | Vuosisarja 1953–2024, alkukattavuus syöpäkohtainen; 2025 ennakkotieto. Stage 2020–2024 yhdistettynä. Koko maa ja hyvinvointialueet; myös ikä-/koulutusvalintoja. |
| Tuoreus | Ohjeen datapäiväys 2.4.2026, sovellusversio 2026-04-22-001. Vuosipäivitys havaittu; seuraava julkaisupäivä A. |
| Pääsy ja lisenssi | Julkinen Shiny; 6 rivin CSV todella ladattu. XLSX-painike nähty, XLSX testaamatta. CC BY 4.0. Istuntolinkki ei pysyvä API. |
| Laatu ja yhdistely | Lukumäärät 1–4 salataan; viiva voi merkitä salausta tai laskematta jäämistä. Kiinteät alue-, vuosi- ja syöpävalinnat eivät sisälly CSV-sarakkeisiin: sivumetadata välttämätön. Aggregaattiliitos vain samoin määritellyillä avaimilla; henkilölinkitys vaatii luvan. |

**L:** vuoden 2024 vuosiraportin rajatussa kiinteiden kasvainten kohortissa stage-tieto on 13 285/31 731 = 41,9 %:lla ja puuttuu 18 446 tapauksesta eli 58,1 %:sta. Raportin tekstin 59,1 % on ristiriidassa taulukon kanssa; tässä käytetään näkyvistä N-luvuista laskettua osuutta. Kohortti rajaa pois muun muassa keskushermosto- ja hematologisia kasvaimia sekä vain kuolintodistuksesta tunnistettuja tapauksia. Sitä ei yhdistetä sovelluksen kaikkien syöpien 2020–2024 jakaumaan. [Vuosiraportti, taulukko 5.1](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html).

**P:** aineisto sopii syöpäkuorman ja levinneisyystiedon saatavuuden kuvaamiseen. Tarkka alueellinen stage-MVP vaatii lisää saman rajauksen vientiä. Ei-paikallinen ei tarkoita automaattisesti vaihetta IV eikä tuntemattomien poistaminen anna kattavaa vaihejakautumaa. Pienen valmiin CSV:n näyttö on muutaman tunnin työ; kattava vaihevertailu ei ole valmis.

### Kortti 2 — D02: Suolistosyövän seulontatilastot

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Ylläpitäjä ja lähde | Suomen Syöpärekisteri, joukkotarkastusrekisteri. [Suomenkielinen raportti](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html); englanninkielinen versio on saman tuotteen kieliversio. |
| Havaintoyksikkö ja mittarit | Ryhmä–vuosi/kierros. Kutsua varten poimitut, vähintään yhden onnistuneen FIT-testin palauttaneet, positiiviset, kirjattu kolonoskopia, kirurgista/neoadjuvanttihoitoa saaneet ja löydösluokat. Myös aiempi tulos/osallistuminen ja vuoden 2022 kierroksen välisyövät. |
| Kohdeväestö, aika | Kansallinen ohjelma 2022–2024; historiassa pilotit 2019–2021. Vuonna 2024 iät 60, 62, 64, 66, 68 ja 70. Julkaisu 20.5.2026, löydösten katkaisu 15.5.2026. |
| Alue ja taustat | 22 aluetta: 21 hyvinvointialuetta ja Helsinki; Ahvenanmaa ei kuulu ohjelmaan. Ikä, sukupuoli, kieli, koulutus, syntymäalue ja edellinen tulos erillisissä taulukoissa. Kaikkien yhteisositus A. |
| Viive, stage, hoito | Kolme PNG-kuviota positiivisesta testistä kolonoskopiaan: mediaani ja P10/P90 kuukausina. Numerovienti, viive-N ja keskeneräisten käsittely A. Ei kattavaa stagea, lääkehoitoa, haittoja tai elossaoloa. |
| Pääsy ja laatu | GET onnistui, 34 aitoa HTML-taulukkoa JSONiksi. Kaksi jäsentäjää tuotti samat solut. 276 alueketjun prosenttilaskua täsmäsi. Seitsemän `–`-solua säilytetään raakana; yleinen pienlukuraja A. |
| Lisenssi ja liitos | Staattisen raportin lisenssin soveltamisala A. Avaimet ohjelma, kutsuvuosi, aluetaso/koodi ja todellinen osite. Avoimia henkilöavaimia ei ole. |

**L:** osallistuminen 2024 on 309 871/421 365 = 73,5398 %. Lähetettyjä kutsuja on 419 966, joten 1 399 poimitulle ei lähetetty kutsua. Osallistumisnimittäjä on raportissa poimittu joukko. Kolonoskopiaprosentin otsikko on ristiriitainen: 10 244/14 083 = 72,7 % vastaa positiivisia testejä, vaikka otsikko viittaa osallistuneisiin. Tallennettava nimittäjä ratkaistaan luvuista ja määritelmästä, ristiriita säilytetään huomautuksena. Puuttuva kolonoskopiakirjaus voi johtua ilmoituksen puuttumisesta tai seurannan keskeneräisyydestä. [Raportin määritelmät ja seulontaketju](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html).

**P:** osallistumisen kuvaileva tutkimus onnistuu tallenteesta; arvio 0,5–1 kehittäjäpäivää. Julkaistava laaja uudelleenjakelu edellyttää lisenssin ratkaisua. Tarkka viivehälytys tai alueen yhteisvakiointi ei ole valmis. Ohjelman laajeneminen ja pilottihistoria on käsiteltävä ennen käyttäytymisselityksiä.

### Kortti 3 — D03: Rintasyövän seulontatilastot

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Ylläpitäjä ja lähteet | Suomen Syöpärekisteri, joukkotarkastusrekisteri. [Vuositilasto](https://stats.cancerregistry.fi/joukkistilastot/rinta.html), [sovellus](https://tilastot.syoparekisteri.fi/seulonta/), [ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html). |
| Havaintoyksikkö ja muuttujat | Ryhmä–vuosi. Kutsutut, osallistuneet, varmistustutkimuskutsut, erikoissairaanhoidon lähetteet, seulontatulos, histologia ja havaitsemistapa. CSV:ssä lisäksi kohdeväestö, rekisteröity kohdeväestö ja peittävyys. |
| Väestö ja aika | Ohjelman kohdeväestö 50–69-vuotiaat naiset; raportti käsittelee myös rintasyöpäriskissä olevien sukupuolivähemmistöjen oikeutta seulontaan. Kahden vuoden väli. Raportti 2020–2024, julkaisu 2.7.2026; löydökset kevääseen 2026. |
| Alue ja ositteet | Raportissa 22 aluetta vuonna 2024, Ahvenanmaa puuttuu. Sovellus-CSV: Helsinki × naiset × vuodet 2010–2024 × ikäluokat 50–51, 52–53, …, 68–69. 150 riviä, täydellinen tämän valinnan ruudukko. |
| Viive ja kliiniset tiedot | Viisi PNG-kuviota positiivisesta testistä varmistustutkimuksiin, mediaani/desiilirajat kuukausina. Tarkka numerovienti ja viive-N A. Ei varmennettua kattavaa stage-, lääke-, haitta- tai elossaolotaulukkoa tässä poiminnassa. |
| Pääsy ja lisenssi | 61 aitoa HTML-taulukkoa ladattu. Sovelluksen CSV ladattu ja CC BY 4.0 vahvistettu. Erillisen staattisen raportin lisenssi A. Vienti istuntokohtainen. |
| Laatu ja yhdistely | 357 alueketjun prosenttilaskua sekä 150 CSV-osallistumisprosenttia täsmäsivät. Raportissa 42 `–`-solua ja 2 rakenteisesti soveltumatonta `--`-prosenttia. Lähdeversio, ohjelma, alue, sukupuoli, vuosi ja ikäluokka säilytettävä; ei henkilölinkitystä. |

**L:** vuoden 2024 kokonaisrivi on 281 369/344 851 = 81,5915 %, Helsingissä 28 686/38 630 = 74,2583 %. Helsingin CSV ja staattinen raportti täsmäävät vuoden 2024 lukumäärissä. Vuonna 2021 CSV:ssä on yksi kutsuttu ja yksi tarkastettu enemmän; syy on A. Tietoja ei pakoteta identtisiksi. [Rintaseulontaraportti](https://stats.cancerregistry.fi/joukkistilastot/rinta.html), [seulontasovellus](https://tilastot.syoparekisteri.fi/seulonta/).

**V/P:** raportin pahanlaatuiseksi luokiteltu löydös sisältää myös in situ -kasvaimia; se ei ole automaattisesti invasiivisen syövän määrä. Läheteosuus ei todista jokaisen varmistuskutsun saaneen käyneen tutkimuksessa. Havaitsemistavan seulontasyövän ja välisyövän aikarajaukset eivät tuota suoraa näyttöä tutkimusvirheestä. Koulutuksen tuntematon on yhdistetty perusasteeseen ja kielessä muu/puuttuva yhdeksi ryhmäksi. **MVP-päätös: toteutuskelpoinen Helsingin osallistumiseen**, arviolta 0,5–1 kehittäjäpäivää; laajennukset erikseen.

### Kortti 4 — D04: Kohdunkaulan syövän seulontatilastot

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Ylläpitäjä ja lähteet | Suomen Syöpärekisteri, joukkotarkastusrekisteri. [Raportti kohtu.html](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html), [seulontasovellus](https://tilastot.syoparekisteri.fi/seulonta/). `cervix.html` on kieliversio. |
| Havaintoyksikkö ja mittarit | Ryhmä–vuosi–kutsutyyppi. Kutsutut, osallistuneet, riskiryhmäsuositus, kolposkopialähete/kirjattu tutkimus, HPV/Papa ja histologia. HSIL+ sisältää HSIL:n lisäksi AIS:n ja syövän. |
| Kohortti, aika ja tuoreus | Ikäryhmäseulonnan päätaulukko: kutsuiät 30, 35, …, 65. Riskiryhmäseulonta erillinen. Raportti 2020–2024, julkaisu 20.5.2026, löydökset kevääseen 2026. |
| Alue ja testattu yhteistaulukko | Raportissa 23 aluetta Ahvenanmaa mukaan lukien. Vuoden 2020 riskiryhmästä puuttuu 3 Uudenmaan alueriviä. CSV: Helsinki, naiset, ikäryhmäseulonta, 1991–2024, yhdeksän ikäluokkaa 25–29…65–69, 306 riviä. |
| Viive ja hoitotieto | Kymmenen PNG-kuviota positiivisesta testistä kolposkopiaan, myös menetelmä-/kutsutyyppierotteluja. Tarkat luvut, N ja päivälaskenta A. Ei avointa kattavaa stagea, hoitolääkkeitä, haittoja tai elossaoloa. |
| Pääsy ja lisenssi | 126 aitoa HTML-taulukkoa poimittu. Sovelluksen oikea CSV ja CC BY 4.0 vahvistettu. Staattisen raportin lisenssi A. |
| Laatu | 2 291 määriteltyä prosenttilaskua ja 270 lukumääräsummaa täsmäsivät; 19 suhdetta 0/0. Raportissa 105 `–`-solua ja 2 soveltumatonta `--`-prosenttia. CSV:n kaikki 306 osallistumisprosenttia täsmäsivät. |
| Yhdistely | Ohjelma, kutsutyyppi, vuosi, alue/koodi, ikä ja tarvittaessa menetelmä. Ikä- ja riskiryhmää tai 25–29-vuotiaita ei yhdistetä päätaulukkoon huomaamatta. Henkilötason linkitys erikseen luvalla. |

**V/L:** vuodesta 2020 kutsuttu tarkoittaa kaikkia kutsua varten poimittuja. Vuoden 2024 ikäryhmäseulonnassa osallistui 206 337/280 812 = 73,5 %, riskiryhmässä 9 341/11 298 = 82,7 %. Kolposkopia oli kirjattu 2 071/2 445 lähetteen saaneelle = 84,7 %. Nämä ovat eri nimittäjiä. Jatkotutkimustiedon kattavuus on parantunut noin vuodesta 2022; ”ei tietoa jatkotutkimuksista” voi tarkoittaa sekä tekemättä jäämistä että toimittamatonta tietoa. [Raportin määritelmät](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html).

**L/P:** Helsingissä vuoden 2024 vähintään 30-vuotiaiden CSV-summa 27 514/38 382 = 71,6846 % täsmää raporttiin. 25–29-vuotiaiden 3 499 tarkastettua / 5 375 kutsuttua jätetään tästä vertailusta pois. Kuvaileva osallistumisnäkymä on valmis aineistovalinta, arviolta 0,5–1,5 kehittäjäpäivää. Pitkä sarja vaatii kutsukäytäntöjen ja HPV/Papa-muutosten tulkinnan. Puuttuvista kirjauksista tehtävä tekemättömien tutkimusten laskenta ei ole perusteltu.

### Kortti 5 — D07: Keuhkosyövän kansallinen laaturaportti

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Ylläpitäjä ja lähde | Suomen Syöpärekisteri; yhdistetyn Syöpärekisteri–Hilmo-kohortin [julkinen laaturaportti](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html). |
| Kohortti ja havaintoyksikkö | 14 873 uutta primaaria C33–C34-tapausta 2019–2023, henkilön ensimmäinen keuhkosyöpä. Julkisessa tuotteessa aggregaattitaulukko/kuvio. |
| Tapahtumat ja aikarajaus | Diagnoosi, käynti, hoitojakso, toimenpide ja kuolema. Seuranta alkaa diagnoosista tai enintään 3 kuukautta aiemmasta määritellystä Hilmo-käynnistä; enintään 12 kuukautta, viimeistään 31.12.2024. |
| Hoidot ja elossaolo | Parantava, jarruttava ja oireenmukainen hoito; leikkaus-, säde- ja lääkehoitoluokat, osin päällekkäisiä. Raportoidut 12 kuukauden elossaolo-osuudet. Haittamuuttuja A. |
| Stage ja viive | Taulukko 4 kuvaa levinneisyystiedon luokitustapaa/kattavuutta: 7 097 ilman tietoa. Ei avoimeksi varmennettua TNM I–IV -potilastaulukkoa. Ei ladattuja diagnoosi–hoito-päiväpareja. |
| Alue ja väestö | Hyvinvointi-/yhteistyöalue, sukupuoli, ikäryhmä. Alue diagnoosivuoden alun kotikunnasta. Ahvenanmaa puuttuu aluekuvista pienlukujen vuoksi; 6 kotikuntaa puuttuu. |
| Pääsy, päivitys ja lisenssi | HTML luettu verkkolukijalla; suora GET 403. CSV/Excel-vientiä ei testattu. Julkaisupäivä, toistuva päivitysrytmi ja erillinen datalisenssi A. |
| Kattavuus ja liitokset | Avohilmo ei mukana; MDT-koodit eivät kata kaikkia moniammatillisia neuvotteluja. Aggregaattiyhdistely vain samalla kohortilla, alue- ja seurantamääritelmällä; ei julkista henkilölinkitystä. |

**P:** raportti sopii hoitokirjausten ja tiedon kattavuuden kuvaamiseen sekä jatkotutkimuksen määrittelyyn. Hoitoluokkien elossaoloeroihin vaikuttavat potilaiden lähtötilanne, ennuste ja hoidon valinta; ne eivät osoita hoitojen kausaalista paremmuutta. Ilman hoitokirjausta jäänyttä ei saa nimetä hoitamatta jääneeksi. Raportin tulkinta onnistuu heti, mutta automaattinen alue-/viivemalli ei läpäise toteutusporttia ennen viennin, lisenssin ja määritelmien ratkaisua. [Raportin menetelmät, prosessit ja elossaolo](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html).

### Kortti 6 — D10: Hilmo, somaattinen erikoissairaanhoito alueittain

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Julkaisija ja lähde | THL, terveydenhuollon hoitoilmoitusrekisteri. [Alueraportti](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j?filter=speciality-17958). |
| Testattu kohortti | Erikoisala 65 Syöpätaudit (`speciality-17958`), Kaikki potilaat (`measure-17881`). Havainto on alue–vuosi-aggregaatti. |
| Mittarit ja muut ulottuvuudet | Testattu potilasmäärä. Metadata sisältää myös käynnit, jaksot, hoitoajan sekä päädiagnoosi-, ikä- ja sukupuolivalintoja; kaikkia yhteispoimintoja ei testattu. |
| Aika ja alue | Varsinaiset vuodet 2015–2025; 26 alueluokkaa kokonais-, tuntematon- ja ulkomaatluokkineen. Asuinalueen ja luokitusajankohdan täsmällinen sääntö A. |
| Kliiniset rajat | Ei TNM-ulottuvuutta tai yksilöllisiä diagnoosi–hoito-aikoja testatussa kuutiossa. Erikoisala ei ole syöpädiagnoosikohortti eikä kaikkien syöpäpotilaiden joukko. |
| Pääsy ja tuoreus | HTML ja JSON toimivat ilman kirjautumista. Päivitys 11.8.2026; raportissa CC BY 4.0. Seuraava julkaisu A. |
| Laatu ja liitos | 26 × 12 solupaikkaa: 286 arvoa, 26 tyhjää teknisen Kaikki vuodet -luokan solua. Ei rekisteripuuttuvuuden prosentti. Avaimet aluekoodi, vuosi, kohortti ja mittari; kokonaisluokat erotettava. |

**V:** vuoden 2025 Koko maa 74 504, Helsinki 9 327 ja Kainuu 288 täsmäsivät HTML:n ja JSONin välillä. [Testattu JSON](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.json?row=area-2079&column=time-6656&filter=speciality-17958&filter=measure-17881).

**P:** valmis lisänäkymä kirjattuun palvelukäyttöön, arviolta 2–4 tuntia. Potilasmäärä ei ole ilmaantuvuus, hoitojakson kesto ei aloitusviive, eikä laskeva määrä yksin osoita hoitovajetta. Syöpähoitoa toteutetaan myös muilla erikoisaloilla. Aluejärjestystä varten tarvitaan vielä kattavuusmuutosten, aluemääritelmän ja pienlukusääntöjen tarkistus. Avoin taulu ei linkitä henkilöä seulontatulokseen.

### Kortti 7 — D12: Avohilmon diagnoosiasiakkaat alueittain

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Julkaisija ja lähde | THL, perusterveydenhuollon avohoidon hoitoilmoitustiedot. [Diagnoosiraportti](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06). |
| Testattu rajaus | C50 Rintasyöpä (`diagnoosi-121077`), Asiakkaat (`measure-87454`); havaintoyksikkö alue–vuosi–diagnoosi-aggregaatti. |
| Aika ja tarkkuus | 2018–2026 sekä Kaikki vuodet; vuosi 2026 kesken. 26 alueluokkaa. Palvelusektori, palvelumuoto ja ammatti metadatassa; tässä kuutiossa ei havaittu ikä-/sukupuolivalintoja. |
| Hoitopolku ja kliiniset tiedot | Ei stagea, suunniteltuja aikoja, peruutussyitä, lääkehoitoketjua tai henkilön tapahtumapäiviä. Asiakas ei uusi syöpätapaus. |
| Pääsy ja lisenssi | Korjattu JSON-haku toimii; alkuperäinen pelkkä diagnoosisuodatin antoi HTTP 200 ja tyhjän arvolistan. CC BY 4.0, päivitys 11.11.2026. |
| Laatu ja yhdistely | 26 × 10 solupaikkaa, 258 arvoa ja 2 puuttuvaa avainta. Pienlukusääntö ja alueen määrittelyhetki A. Liitos alue–vuosi–diagnoosimääritelmällä vain kuvaileva; henkilölinkitys ei onnistu. |

**V:** vuoden 2025 luvut Etelä-Karjala 169, Helsinki 1 288 ja Kaikki kunnat 12 926 täsmäsivät HTML:ään. Kaikki vuodet -luku 50 426 ei ole vuosien summa, koska sama asiakas voi esiintyä useana vuonna. [Toiminut JSON-pyyntö](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.json?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454).

**P:** kirjattujen asiakkaiden kehitys voidaan näyttää 2–4 tunnin teknisenä lisänäkymänä. Kanta-Hämeen 1 267 → 347 asiakasta vuosina 2024–2025 synnyttää raportointikattavuutta koskevan kysymyksen; se ei osoita syövän tai hoidon vastaavaa vähenemistä. Ensimmäinen jatkotarkistus olisi muiden diagnoosien ja sektorien kattavuus, ei hoidon epäonnistumisen selitys. Eri vuosien, sektorien ja alueluokkien henkilömäärien summauksessa on kaksoislaskennan riski.

### Kortti 8 — D14: Kiireettömän erikoissairaanhoidon jonot

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Julkaisija ja lähteet | THL:n hoitoonpääsytilasto; oma tietotuote, ei Hilmon kaikkien tapahtumien kooste. [Jonotilanne](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne), [tilastokuvaus](https://thl.fi/data-ja-tilastot/hoitoon-paasy/erikoissairaanhoito). |
| Kohortti ja havainto | Erikoisala 65 Syöpätaudit, tunniste `862186`; kiireetöntä hoitoa mittaushetkellä odottavat. Tuottaja–mittauspäivä–mittari, ei potilasrivi. |
| Mittarit | Kaikki odottajat `738214`, yli 180 vrk määrä `738216`, osuus `738217`, 1–90 vrk määrä `738218`. Ei yksittäistä syöpädiagnoosia tai TNM:ää. |
| Aika ja alue | Koepoiminnassa 110 ajankohtaluokkaa ja 20 tuottajaluokkaa, mukaan lukien kokonaisrivi. Uusin havainto 30.9.2026. Tuottaja ei ole potilaan asuinalue. |
| Odotusajan määritelmä | Tilastoraportin mukaan alku on hoitojonoon asettaminen tai käynnin varaaminen. Jonoon kuuluu hoidon tarpeen arvioinnin jälkeen resurssisyistä odottavia; lääketieteellisistä syistä myöhemmäksi suunniteltu, toistuva hoito ja määräaikainen seuranta rajataan pois. |
| Pääsy ja käyttöehdot | Mittarikohtaiset HTML/JSON-haut onnistuneet. Tämän jonotuotteen tallennetussa HTML:ssä CC BY 4.0 ja päivitys 19.10.2026. |
| Laatu | 2 200 solupaikkaa, 1 444 eksplisiittistä arvoa ja 756 puuttuvaa avainta per tarkistettu mittari. Organisaatioiden ja ajankohtien peitto vaihtelee. Kaikki 1 444 osuutta täsmäsivät lukumääräsuhteeseen yhden desimaalin tarkkuudella. |
| Yhdistely | Tuottaja–mittauspäivä–erikoisala–mittari. Historialliset organisaatiomuutokset ennen trendiä; ei suoraa asuinalue–vuosi-liitosta seulontaan. |

Määritelmälähde on *Hoitoon pääsy erikoissairaanhoidossa 2025*, tilastoraportti 21/2026, käsitteet ja määritelmät, s. 26. Se erottaa myös hoidon tarpeen arviointia odottavat hoitoa odottavista. **P:** näiden perusteella jonotilanteen luokka tulkitaan jonon kertynyksi odotusajaksi, ei diagnoosista alkavaksi kelloksi. Vuoden 2026 syöpäkohtaisen yksityiskohtaisen tapahtumaketjun määritelmää ei ole osoitettu tästä koepoiminnasta. [Todellinen PDF-lähde](https://www.julkari.fi/server/api/core/bitstreams/da98593f-8fb0-484e-b300-013f5946730a/content).

**V/L:** 30.9.2026 kokonaisrivillä 486 odottajaa, joista 2 yli 180 vrk: 0,4 %. Satakunnassa 2/8 = 25 %. Helsinki, Kainuu, Pirkanmaa ja Päijät-Häme ovat viimeisessä ajankohdassa tyhjiä. Ne eivät ole nollia. Kokonaisrivi ei todista kaikkien puuttuvien tuottajien kattavuutta. [Testattu osuushaku](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738217).

**P:** rajattu tilannekuva on toteutuskelpoinen 2–4 tunnissa. Jonossa olevien poikkileikkaus painottuu pitkiin odotuksiin; se ei ole hoidettujen potilaiden viivejakauma. Yli 180 vrk ei ole tässä osoitettu syöpäkohtaiseksi kliiniseksi tavoiteajaksi. Aineisto ei kata kaikkien syöpäpotilaiden kiireellistä hoitoa, peruutuksia tai seurannan katkoksia.

### Kortti 9 — D16: Sotkanetin syöpäindeksit 5643 ja 5644

| Kenttä | Vahvistettu sisältö tai nimetty raja |
|---|---|
| Julkaisija ja lähde | THL, Kansallinen terveysindeksi; syöpäkomponentin tiedot Syöpärekisteristä. [5643](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643), [5644](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644). |
| Havaintoyksikkö ja mittari | Alueen kolmen vuoden jakson indeksi. 5643 epäsuorasti viisivuotisikäryhmittäin ikävakioitu; 5644 vakioimaton. Koko maan viimeisimmän vuoden vertailutaso 100. |
| Syöpärajaus | Uusia tapauksia, pois lukien muut ihosyövät kuin melanooma. Sisältää myös D-/N-koodeja; ei sama rajaus kuin C00–C97. |
| Aika ja alue | 2017–2024; vuoden 2024 arvo koskee 2022–2024. Kunta, hyvinvointialue, yhteistyöalue ja koko maa metadatan mukaan. Nimittäjä keskiväkiluku. |
| Tuoreus | Metadata 11.6.2026. Myös vanhat indeksiarvot voivat muuttua uusissa versioissa; tarkka seuraava päivitys A. |
| Hoitopolku | Ei stagea, hoitoja, lääkitystä, haittoja, hoitoviiveitä tai potilaan elossaoloa tässä indikaattorissa. |
| Saatavuus ja lisenssi | Julkinen metadata avattu, alatunniste CC BY 4.0. REST-kokeet 403. Numeerinen data, REST-alue-ID:t ja vastauksen puuttuvuuskoodit A. |
| Yhdistely ja laatu | Aluekoodi, kolmen vuoden viitejakso ja vakiointiversio. Ei itsenäinen rekisteri eikä yhden vuoden seulonnan kanssa ajallisesti identtinen mittari. |

**P:** hyödyllinen alueellisen ilmaantuvuuden taustamuuttuja, kun numeerinen vienti saadaan. Korkea indeksi voi liittyä myös aktiiviseen diagnostiikkaan; se ei ole hoidon laatu- tai viivemittari. Vanhan sairastavuusindeksin 0–79-vuotiaiden rajaus ei automaattisesti kuvaa tätä tuotetta. **Ei välttämättömäksi MVP-syötteeksi:** aineistoarvoja ei ole vielä oikeasti saatu. HTTP 403 on tämän kokeen tulos, ei väite palvelun yleisestä käyttökelvottomuudesta.

### Kortti 10 — D21/D22: Tilastokeskuksen kuolemansyyt

| Kenttä | 11be | Alueellinen rinnakkaistuote 13u5 |
|---|---|---|
| Julkaisija ja lähde | Tilastokeskus, [11be](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/) | Tilastokeskus, [13u5](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/) |
| Havaintoyksikkö | Kuolemansyy–ikä–vuosi–sukupuoli-solu | Alue–kuolemansyy–vuosi–mittari-solu |
| Muuttujat ja vuodet | 1 731 kuolemansyyluokkaa, 22 ikäluokkaa, 3 sukupuolivalintaa; kuolemien määrä, 1998–2025 | 26 aluevalintaa, 65 kuolemansyyluokkaa; määrä ja vakioimaton kuolleisuus / 100 000, 1969–2025 |
| Alue / ryhmät | Koko maa; ei alueulottuvuutta | Asuinalue; ei ikää/sukupuolta. Vuoden 2026 aluejako takautuvasti |
| Pääsy ja tuoreus | Metadata GET ja 4 solun POST onnistui | Metadata GET ja 16 solun POST onnistui |
| Lisenssi ja päivitys | CC BY 4.0; 29.10.2026 klo 06 UTC | Samat käyttöehdot ja vastauspäivitys |
| Puuttuvuus | Selitteessä `...` salattu, `-` nollasuuruus | `.` puuttuva; pienessä koevastauksessa ei null/status-arvoja |

Luokkamäärät sisältävät kokonaisluokkia. Kummassakaan poiminnassa ei ole potilaan diagnoosi-/hoitopäiviä, vaihetta, lääkitystä tai peruutuksia. Kuolemansyy ei anna kaikkia potilaan aiempia diagnooseja, eikä väestökuolleisuus ole diagnoosikohortin elossaolo. [11be-metatieto](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px), [13u5-metatieto](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px), [käyttöehdot](https://stat.fi/fi/tietoa-meista/tutustu-tilastokeskukseen/lainsaadanto/kayttoehdot).

**V:** C50-rintasyöpäkuolemia koko maassa on 899 vuonna 2024 ja 907 vuonna 2025 kummassakin taulussa. C18-luku 11be:ssä on 928 ja 926. 13u5:n paksusuoliluokka sisältää C18–C19, joten se ei ole C18:n suora vastine; keuhkoa muistuttava luokka C32–C34 sisältää myös kurkunpään. Vuonna 2025 C00–C97-kuolemia on koko maassa 13 424, vakioimaton kuolleisuus 237,8/100 000; Helsingissä 1 273 ja 184,7/100 000. [11be](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/), [13u5](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/).

**P:** rajattu kansallinen kuolleisuustausta on toteutuskelpoinen 2–4 tunnissa. 13u5:n alueita ei järjestetä hoidon paremmuuden mukaan. Kansalliset ikäsolut eivät täydennä puuttuvia alue–ikäsoluja, eikä niiden marginaalien yhdistely tuota alueellista ikävakiointia. Vuosilopun väestö ei automaattisesti ole kuolleisuuden keskiväkiluku. Kokonaisalueita ei summata osiinsa.

## 4. Kysymys–aineisto-matriisi

| Hoitopolun kysymys | Paras varmennettu lähde | Mitä nykyisestä aineistosta voi tehdä | Ratkaiseva raja |
|---|---|---|---|
| Missä seulontaan osallistutaan vähän? | D02–D04 | Alueosuudet julkaistuista osoittajista ja nimittäjistä. Julkaistavan MVP:n valmis sovellus-otos Helsingistä. | Kaikkien alueiden sovellusvienti ja yhteiset taustaositteet A; raaka alue-ero ei palvelun vaikutus. |
| Miten osallistuminen muuttuu? | D02–D04 | Vuosi- ja ikäryhmämuutokset; samojen alueiden painotettu osuus. | Ohjelman laajeneminen, kutsukäytännöt, historia ja lähdeversiot; ei samojen henkilöiden seuranta. |
| Kuinka moni etenee jatkotutkimukseen? | Seulontaketjun kirjatut määrät | Oikein määritellyt testipositiivinen → kirjattu tutkimus -suhteet. | Puuttuva ilmoitus, muu tuottaja ja keskeneräinen seuranta; otsikkoristiriidat. |
| Poikkeava seulontatulos → jatkotutkimus / diagnoosi -viive? | D02–D04:n viivekuvat; D09:n metadata | Kuva kertoo julkaistusta viivemittarista; metadata auttaa suunnittelemaan poimintaa. | 18 PNG-kuvaa, ei varmennettua tarkkaa numerovientiä/N:ää. Diagnoosipäivä ei ole kaikissa julkisissa ketjuissa. |
| Diagnoosi → ensimmäinen hoito / hoitojen väli? | D07/D08 raporttikohtaisesti; D09 ja luvanvaraiset rekisterit | Julkaistun, nimenomaisesti määritellyn kohorttimittarin kuvaus. | Ei avoimeksi varmennettua kattavaa päiväparia; D14 ei ala diagnoosista. |
| Pitkittyykö kiireetön syöpätautien jono? | D14 | Odottajien määrä ja >180 vrk osuus mittaushetkellä. | Tuottaja ≠ asuinalue; pieni N, puuttuvat solut ja kiireellinen hoito. |
| Perutaanko/siirretäänkö aikoja tai jääkö hoito saamatta? | Ei soveltuvaa avointa syöpäkohtaista kohorttia varmennettu | Tietoaukon täsmällinen kuvaus. | Koodiston olemassaolo ei ole tapahtumadataa; tarvitaan suunnitelma, toteuma, syy ja seuranta. |
| Katkeaako sovittu seuranta? | Ei varmennettua avointa suunnitelma–toteuma-aineistoa | Ei luotettavaa määrää nykyisistä poiminnoista. | Muutto, kuolema, muu tuottaja, sovittu rytmi ja kirjauskattavuus. |
| Missä syöpä todetaan myöhään? | D01, syöpäkohtaiset laaturaportit | Karkea paikallinen/ei-paikallinen/tuntematon; tiedon kattavuus. | Ei-paikallinen ≠ vaihe IV; tuntematon ja kasvainjakauma. Ei näyttöä seulonnan epäonnistumisesta. |
| Mitä hoitoja kirjataan? | D07/D08, D10/D11 | Hoito- tai palveluaggregaatit määritellyssä kohortissa. | Päällekkäiset luokat, hoitovalikoituminen, sairaalalääkityksen aukot. |
| Mitä lääkkeitä toimitetaan tai mihin on korvausoikeus? | D18/D19 sekä ladattu D29 | D29:n julkaistut oikeussolut; D18/D19:n nykyvienti A. | Oikeus ≠ osto ≠ hoito; ATC ≠ diagnoosi; puuttuva yhdistelmä ≠ nolla. |
| Kuinka yleisiä haitat ovat? | D20 | Epäiltyjen haittojen ilmoitukset kuvailevasti. | Altistuneiden nimittäjä ja ilmoittamiskattavuus puuttuvat; ei riski-/turvallisuusjärjestystä. |
| Kuolleisuus tai elossaolo? | D21/D22, D01, D06 | Väestökuolleisuus tai lähteen erikseen määrittelemä elossaolomittari. | Eri kohortit, vakiointi, seuranta, diagnoosin aikaistuminen ja pienlukujen tasaus. |
| Selittääkö väestörakenne osallistumista? | D30/D23 + seulonnan todelliset ositteet | Kuvaileva aluekonteksti; 22/22 alueen tekninen väestöliitos tehty. | Koko väestön ikärakenne ei kutsuttujen ositus eikä alueyhteys yksilötason testi. |
| Onko Suomi muita Pohjoismaita jäljessä? | D06, täydentävä D31 | Yhteismitallisen syöpäkuorman/elossaolon valikoitu vertailu. | Harmonisoitu luokitus, standardiväestö, data/arvio-erottelu ja keruuehdot; ei suoraa seulonnan syyvaikutusta. |

Matriisin lähteet ja niiden saatavuusrajat on yksilöity katalogissa ja korteissa. ”Ei varmennettu” ei tarkoita, ettei tietoa kerättäisi missään rekisterissä.

## 5. Kolme aidosti toteutuskelpoista hackathon-analyysiä

Seuraavissa rajauksissa välttämättömät havaintoarvot on jo ladattu. Yksikään analyysi ei edellytä henkilötietoja, hakemusta, testaamatonta välttämätöntä muuttujaa tai usean rekisterin henkilölinkitystä. Toteutuskelpoisuus koskee nimettyä koelaajuutta; laajempaa aikasarjaa tai uusia alueita ei lasketa automaattisesti valmiiksi.

### Analyysi A — Helsingin rintaseulonnan osallistuminen 2020–2024 ja ikäryhmät

**Kysymys:** miten ohjelmaan kutsuttujen osallistuminen muuttui Helsingissä ja missä kutsuikäryhmissä vaihtelu näkyy? **Aineisto:** D03:n todellinen sovellus-CSV, 150 vuosi–ikä-riviä vuosilta 2010–2024. Ensimmäinen näkymä käyttää vuosien 2020–2024 50 riviä. **Käyttöoikeus:** CC BY 4.0. Alue, sukupuoli, ohjelma ja valittu aihe otetaan viennin sivumetadatasta. [Sovellus](https://tilastot.syoparekisteri.fi/seulonta/), [ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html).

**Avaimet ja laskenta:** ohjelma + Helsingin kaupunki + naiset + kutsuvuosi + kutsuikäluokka. Osallistuminen = 100 × tarkastettu / kutsuttu. Vuositulos lasketaan lukumääräsummien suhteena, ei kymmenen prosenttiluvun keskiarvona. Muutos ilmaistaan prosenttiyksikköinä. Ikäryhmän valinta käyttää samaa luokkaa eri vuosina; kaikkia rivejä ei tulkita samoiksi henkilöiksi.

| Vuosi | Tarkastettu | Kutsuttu | Osallistuminen, oma laskelma |
|---|---:|---:|---:|
| 2020 | 28 993 | 39 903 | 72,66 % |
| 2021 | 28 950 | 38 860 | 74,50 % |
| 2022 | 28 430 | 38 719 | 73,43 % |
| 2023 | 27 462 | 37 954 | 72,36 % |
| 2024 | 28 686 | 38 630 | 74,26 % |

**L:** 2020–2024 päätepisteiden muutos on +1,60 prosenttiyksikköä, mutta sarja ei nouse joka vuosi. Vuoden 2024 ero strategian 80 %:n tavoiteviivaan on −5,74 prosenttiyksikköä. Tämä on strateginen etäisyys, ei hoitovirheen tai yksilön riskin luokitus. CSV:n vuoden 2021 yksi lisäkutsu ja yksi lisätarkastus suhteessa staattiseen raporttiin säilytetään lähdeversiohuomiona.

**Demo, P:** vuosi- ja ikäryhmävalinta, lukumäärät ja osuus samassa näkymässä sekä agentin lyhyt lähteistetty vastaus kuten ”Miten vuoden 2024 osallistuminen muuttui edellisestä vuodesta?”. Jokainen lause palautuu valittuihin soluihin. Peittävyyttä ei lasketa kutsuttu/kohdeväestö-suhteesta: joissakin CSV-riveissä kutsuttuja on enemmän kuin rekisteröityä kohdeväestöä ja julkaistu peittävyys 100 %, joten sen laskentasääntö on osallistumisesta erillinen.

**Harhat ja rajat:** vuoden 2020 olosuhteita ei ole tässä selitetty, ohjelman ulkopuolista tutkimista ei tunnisteta, ikäryhmän ihmiset vaihtuvat ja pitkä sarja voi sisältää kutsukäytäntömuutoksia. Osallistumisen syy, seulonnan vaikutus kuolleisuuteen ja hoitamatta jääminen eivät kuulu tuloksiin. **Valmius:** näyte, määritelmä, lisenssi, 150/150 prosenttitarkistusta ja vertailusummat olemassa. Arvio 0,5–1 kehittäjäpäivää.

### Analyysi B — Syöpätautien kiireettömän jonon tilanne 30.9.2026

**Kysymys:** kuinka monta erikoisalan 65 kiireetöntä hoitoa odottavaa julkaistu tilannekuva sisältää, kuinka moni on odottanut yli 180 vrk ja mistä tuottajista tietoa puuttuu? **Aineisto:** D14:n kolme yhteismitallista mittaria, kaikki odottajat, >180 vrk määrä ja prosentti. **Käyttöoikeus:** jonotuotteen oma CC BY 4.0 -alatunniste. [Jonotilanne](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne).

**Avaimet ja laskenta:** tuottajan tunniste + mittauspäivä + erikoisala. Mittarit liitetään yksi-yhteen. Osuus = 100 × yli 180 vrk / kaikki odottajat, jos nimittäjä >0 ja molemmat arvot ovat olemassa. Julkaistu kokonaisrivi näytetään erillään tuottajista. Tyhjää solua ei muuteta nollaksi eikä kokonaismäärää rakenneta summaamalla pää-/alaluokkia.

| Näkymä | Yli 180 vrk | Kaikki odottajat | Osuus | Näytettävä huomio |
|---|---:|---:|---:|---|
| Julkaistu kokonaisrivi | 2 | 486 | 0,4 % | Ei osoita kaikkien tyhjien tuottajasolujen kattavuutta |
| Satakunta | 2 | 8 | 25,0 % | Pieni nimittäjä; prosentti ilman N:ää harhaanjohtava |
| Helsinki, Kainuu, Pirkanmaa, Päijät-Häme | puuttuu | puuttuu | ei lasketa | Tiedon puuttuminen, ei nolla odottajaa |

**Demo, P:** tuottajakohtainen taulukko, absoluuttiset määrät, puuttuvuuden näkyvä merkintä ja selitys ajan alkamisesta jonoon asettamisesta/varauksesta. Otsikko on ”kiireettömän syöpätautien jonon tilanne”, ei ”syöpädiagnoosista hoitoon”. Tämä voi toimia erillisenä esimerkkinä siitä, miten agentti estää mittarin väärän tulkinnan. [Odotusajan määritelmät](https://www.julkari.fi/server/api/core/bitstreams/da98593f-8fb0-484e-b300-013f5946730a/content).

**Harhat ja rajat:** tuottaja ei asuinalue, erikoisala ei diagnoosikohortti, kiireellinen hoito ja määräaikainen seuranta ovat eri asioita. Poikkileikkaus valikoi pitkiä odotuksia. Historiallinen trendi vaatii organisaatiokartoituksen, joten se ei ole tämän valmiin analyysin edellytys. **Valmius:** 1 444 määrä–prosenttiparia täsmäävät ja viimeinen tilannekuva on nähty; rajattu toteutus 2–4 tuntia.

### Analyysi C — Kansalliset C50- ja C18-kuolemat 2024–2025

**Kysymys:** miten kahden täsmällisen kuolemansyyluokan määrät muuttuivat koko maassa? **Aineisto:** D21:n jo ladatut neljä solua; molemmat sukupuolet ja kaikki iät. D22:n samat C50-kokonaisluvut toimivat sisäisenä tarkistuksena. **Käyttöoikeus:** Tilastokeskus CC BY 4.0. [11be](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/), [13u5](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/), [käyttöehdot](https://stat.fi/fi/tietoa-meista/tutustu-tilastokeskukseen/lainsaadanto/kayttoehdot).

**Avaimet ja laskenta:** kuolemansyykoodi + vuosi + ikärajauksen kokonaisluokka + sukupuolen kokonaisluokka + lukumäärämittari. Muutos = määrä 2025 − määrä 2024; suhteellinen muutos = muutos / määrä 2024. C18:aa ei liitetä 13u5:n C18–C19-luokkaan saman nimisenä.

| Kuolemansyy | 2024 | 2025 | Absoluuttinen muutos, L | Suhteellinen muutos, L |
|---|---:|---:|---:|---:|
| C50, rintasyöpä | 899 | 907 | +8 | +0,89 % |
| C18, paksusuolisyöpä | 928 | 926 | −2 | −0,22 % |

**Demo, P:** kaksi pientä trendi-/muutoskorttia sekä avattava luokitus ja lähdepäivä. Agentti vastaa vain kuolemien määrän muutokseen. Alueelliseksi lisätiedoksi voidaan näyttää jo ladatun 13u5:n vakioimaton kuolleisuus, mutta se on eri analyysi eikä hoidon laatuvertailu.

**Harhat ja rajat:** kaksi vuotta ei osoita kestävää trendiä, väestön ikärakenteen vaikutusta ei ole poistettu eikä tapausmäärä ole kuolleisuusriski. Hoitojen vaikutusta, seulontavaikutusta tai potilaan elossaoloa ei arvioida. Pidempi ikä-/sukupuolittainen sarja on API-metadatan perusteella lupaava laajennus, mutta sen latausta ei väitetä tehdyksi. **Valmius:** neljän solun alkuperäinen vastaus, tarkka POST-runko ja kahden C50-solun ristivarmennus olemassa; toteutus 2–4 tuntia.

## 6. Tallennetun aineiston eksploratiiviset löydökset

Tämä luku kokoaa jo tehdyn tutkimustyön. **Kaikki alla olevat vertailut ovat L-tason kuvailevia laskelmia.** Äärialueet ja jatkohypoteesit valittiin aineistoa tarkasteltaessa; kyse ei ole ennakkoon rekisteröidystä tutkimuksesta. P-arvoja tai kliinisiä syypäätelmiä ei ole tehty. Staattisten seulontaraporttien laajan datan uudelleenjakeluoikeuden avoimuus säilyy, vaikka niiden sisältöä ja laskelmia voidaan tässä lähteistää.

### 6.1 Suolistoseulonnan osallistuminen laski kaikilla 22 alueella

Samojen 22 alueen painotettu osallistuminen oli 273 708/354 174 = **77,2807 % vuonna 2022** ja 309 871/421 365 = **73,5398 % vuonna 2024**, muutos noin **−3,74 prosenttiyksikköä**. Kaikilla 22 alueella osuus laski. Osallistuneiden lukumäärä silti kasvoi, koska poimittu joukko laajeni. [Suolistoseulontaraportin vuosi- ja aluetaulukot](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html).

Kymmenen yhteisen kansallisen ikä–sukupuoliositteen (60, 62, 64, 66 ja 68 vuotta, miehet/naiset) vuoden 2022 poimittujen painoilla vuoden 2024 vakioitu osuus on **72,8187 %**. Kaikissa kymmenessä ositteessa osallistuminen laski. **P:** 70-vuotiaiden lisääminen tai yhteisten ikä–sukupuoliryhmien painomuutos ei yksin selitä laskua. Tämä ei ole aluevakiointi eikä samojen ihmisten seuranta.

Erillinen sukupuoli–edellinen tulos -vakiointi vuoden 2022 painoilla antaa vuodelle 2024 **68,7813 %**. Tämä on eri marginaalinen herkkyysanalyysi, ei ikä–sukupuoli–historian yhteisvakiointi. Sen tulos ei poista laskua. Aiemmin negatiivisen tuloksen saaneiden osuus poimituista kasvoi 6,3466 %:sta 60,9510 %:iin; pilottihistoria ja valtakunnallisen ohjelman uusintakierros muuttavat ryhmien koostumusta. Kahden vakioinnin tuloksia ei lasketa yhteen tai vähennetä toisistaan.

Vuoden 2024 1 399 lähettämättä jääneen kutsun vuoksi nimittäjän vaihtaminen poimituista lähetettyihin kutsuihin muuttaisi osuutta vain **+0,2450 prosenttiyksikköä**. Lasku käyttää samaa osallistujamäärää eikä varmista kutsukirjeen todella saaneiden osallistumisastetta. **P:** tämä yksi mekaaninen ero ei selitä koko laskua; kutsun tavoittavuus, muistutukset ja kirjaamisviive jäävät eri kysymyksiksi. [Raportin määritelmät ja historiataulukot](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html).

### 6.2 Aluejärjestys ja ohjelmien erot

Helsinki, Kymenlaakso sekä Vantaa ja Kerava olivat suolistoseulonnan kolme matalimman osuuden aluetta jokaisena vuonna 2022–2024. Vuonna 2024 osuudet olivat 69,5609 %, 69,9744 % ja 71,2779 %; korkein oli Etelä-Savossa 76,9166 %. Järjestys ei selitä eron syytä. [Suolistoseulontaraportti](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html).

Rintaseulonnassa samat 22 aluetta, Ahvenanmaa kaikista vuosista pois rajattuna, tuottavat **80,4594 % vuonna 2020 → 81,5915 % vuonna 2024**, muutos +1,1321 prosenttiyksikköä. Helsinki oli alin kaikissa viidessä vuositarkastelussa; vuonna 2024 Helsinki 74,2583 % ja Pohjois-Pohjanmaa 85,6027 %, ero 11,3444 prosenttiyksikköä. Kutsuttujen ikä- ja kielirakennetta sekä ohjelman ulkopuolisia tutkimuksia ei ole tässä vakioitu. [Rintaseulontaraportti](https://stats.cancerregistry.fi/joukkistilastot/rinta.html).

Vuoden 2024 kahden ohjelman 22 alueen osallistumisjärjestysten Spearmanin korrelaatio on **ρ = 0,5505**. Se on eksploratiivinen ekologinen yhteys eri kohdeväestöjen välillä. Se ei osoita samoja osallistumattomia henkilöitä, yhteistä syytä tai palvelujärjestelmän kausaalista vaikutusta. Havaintojen määrä on pieni ja lukuisia vertailuja tehtiin samoista riveistä.

### 6.3 Neljä avointa hypoteesia, ei neljä vahvistettua selitystä

| Tunnus | Löydöksestä syntynyt tutkimusväite | Tarvittava lisänäyttö ja nykytila |
|---|---|---|
| **H01** | Kierros- ja aiemman osallistumisen jakauman vakiointi poistaisi vähintään puolet kansallisesta vakioidusta laskusta. | Alue × vuosi × ikä × sukupuoli × historia yhteisessä taulukossa. Erilliset marginaalit antavat vastanäyttöä yksinkertaiselle koostumusselitykselle; varsinainen yhteistesti avoin. |
| **H02** | Suoliston kolme alinta aluetta pysyisivät alimmassa neljänneksessä yhteisellä ikä-, sukupuoli- ja kielivakioinnilla. | Ositetut alueelliset osoittajat/nimittäjät. Tarvittava yhteistaulukko A. |
| **H03** | Helsingin rintaseulontaero muihin 21 alueeseen olisi vakioinnin jälkeen yhä vähintään 5 prosenttiyksikköä vuonna 2024. | Kaikkien alueiden yhteisositus sekä ohjelman ulkopuolisen seulontamammografian erottaminen oireperusteisesta kuvantamisesta. Helsinki-vienti on valmis, kokonainen testi ei. |
| **H04** | Ohjelmien järjestysyhteys olisi yhteisessä ikä–sukupuoliryhmässä vähintään 0,4 jokaisena vuonna 2022–2024. | Yhteinen alue × vuosi × naiset × ikä -aineisto molemmista ohjelmista. Koko kohdeväestön korrelaation toisto ei korvaa tätä. |

50 %:n, 5 prosenttiyksikön ja ρ ≥ 0,4:n rajat ovat tässä tutkimustyössä valittuja operatiivisia jatkotestien kriteereitä, eivät kliinisiä rajoja. Ne eivät jälkikäteen tee löydöistä ennakkohypoteeseja. Myös Helsingin ikävakioinnin tai Kelan nollarivisäännön jatkoselvitys on eksploratiivinen tehtävä; sitä ei merkitä jo ratkaistuksi löydökseksi.

## 7. Tietoaukot ja täsmälliset jatkokysymykset

### 7.1 Mikä estää hoitopolun ongelmien tunnistamisen luotettavasti?

| Prioriteetti | Avoin kysymys | Miksi merkityksellinen | Seuraavaksi tarvittava vastaus / vastaanottaja |
|---|---|---|---|
| **Ennen laajaa seulontadatan julkaisua** | Koskeeko avoin lisenssi myös staattisten vuositilastojen taulukoita? | Sovelluksen CC BY 4.0 ei automaattisesti kata erillistä raporttia. | Syöpärekisteriltä tuotekohtainen käyttöehto tai vastaava sovellusvienti. Helsinki-MVP ei riipu tästä. |
| **Ennen valtakunnallista osallistumis-MVP:tä** | Saadaanko kaikilta 22 alueelta sama sovellus-CSV ja yhtenäiset ositteet? | Yhden alueen vienti ei todista koko ruudukon kattavuutta. | Alueiden vienti, ikäluokat, summat ja puuttuvuus; tulos talteen ennen laajuuslupausta. |
| **Ennen H01–H04:n varsinaista testausta** | Onko yhteinen alue × vuosi × ikä × sukupuoli × historia/kieli -taulukko saatavilla? | Erillisten marginaalien kertominen yhteen luo oletettuja, ei havaittuja soluja. | Syöpärekisterin aggregaattipoiminnan toteutettavuus ja pienlukurajat. Suolisto puuttui tarkistetusta sovellusvalikosta. |
| **Ennen viivehälytystä** | Saako seulonnan jatkotutkimusviiveet tarkkoina numeroina? | Kuvasta ei saada toistettavaa automaattista mittaria. | Mediaani, P10/P90, N, alku-/loppupäivä, puuttuvat päivät, keskeneräiset ja katkaisupäivä. |
| **Ennen hoitovajeväitettä** | Miksi jatkotutkimus tai hoito puuttuu rekisteristä? | Toteutunut mutta ilmoittamaton hoito sekoittuu tekemättä jääneeseen. | Ilmoittajien kattavuus ja sama kohortti myöhemmässä versiossa; suunnitelma–toteuma–syy. |
| **Ennen myöhäisvaiheen vertailua** | Mikä luokitus, vaiheajankohta ja tuntemattomien osuus ovat käytössä? | Paikallisuus, rekisterin oma stage ja TNM I–IV eivät vastaa toisiaan. | Syöpäkohtainen luokitusversio, muunnossäännöt ja saman kohortin puuttuvuus. |
| **Ennen alueiden vakiointia** | Mihin päivään asuinpaikka ja aluejako perustuvat? | Seulonnan ja väestön ajalliset kohortit voivat erota. | Julkisen seulontatuotteen alueversion vahvistus; muuttoliike ja takautuva luokitus. |
| **Ennen H03:n selitysmallia** | Voiko ohjelman ulkopuolisen seulonnan erottaa oireperusteisesta mammografiasta? | Yleinen tutkimusmäärä ei mittaa korvaavaa seulontaa. | Toimenpiteen tarkoitus, sektori, peitto ja yhteismitallinen nimittäjä. Hilmo/Avohilmo-koe ei ratkaissut tätä. |
| **Ennen Kelan aluekokonaisuuksia** | Ovatko julkaisematta jäävät yhdistelmät nollia, suojausta vai kattavuusaukkoja? | Nolliksi täydentäminen voisi luoda väärän hoitovajeen. | Kelan nollarivi-/suojaussääntö ja saman vuoden/koodin kontrollikokonaismäärä. |
| **Ennen kansainvälistä automatisointia** | Mikä käyttölaajuus ja versio on sallittu? | NORDCAN rajoittaa järjestelmällistä keruuta; ECIS-vientiä ei ole testattu. | Käyttöehdot, version kiinnitys, pienlukujen tasaus sekä havaintojen/arvioiden erottelu. |
| **Ennen kilpailukriteerien täyttymisväitettä** | Mikä on toimiva virallinen haasteteksti? | Annettu osoite palautti 404. | AstraZeneca-mentorin tai järjestäjän vahvistama tehtävänanto; erikseen agentin odotettu itsenäisyys ja arviointikriteerit. |

Taulukko on jatkotyön ehdotus, ei lähetetty tietopyyntö. Välitön Helsinki-MVP voidaan toteuttaa riippumatta näistä laajennuskysymyksistä.

### 7.2 Mitä luvanvaraisen viivetutkimuksen metadata todella lupaa?

**V:** D09:n julkinen katalogi luettelee syöpärekisterille `dg_date`- ja `ex_date`-kentät sekä seulonnoille kutsu-/osallistumispäiviä. Kohdunkaulan tutkimuskuvaus kattaa 1991–2024, rinnan 1992–2024 ja suoliston 2022–2024. Nämä eivät ole rekisterien alkuperäisiä keruun aloitusvuosia, eivätkä ne yksin takaa kentän kattavuutta jokaisena vuonna. Useita päivämääräkenttiä on merkitty erityismuuttujiksi. [154 kentän alkuperäinen metatieto](https://aineistokatalogi.fi/api/v1/public/studies/21085403-7be8-4f93-bf05-231518c642a0).

Sama kenttänimi voi tarkoittaa eri tapahtumaa. Rinnan `treatment_attended_date` on episodin ensimmäinen erikoissairaanhoidon päivä; kohdunkaulassa se on ensimmäinen syöpä- tai esiastehoidon päivä. Suoliston 49 kentän luettelossa tätä päivämääräkenttää ei ole, vaikka hoitoon kutsumisen/osallistumisen indikaattoreita on. Suoliston `primary_result_date`-kentälle ei löytynyt vastaavaa kenttää rinnan ja kohdunkaulan luetteloista. Osallistumispäivää ei siis saa nimetä poikkeavan tuloksen valmistumispäiväksi. [Tutkimuskatalogi](https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0).

Rekisterin `stage` on oma **0–6-luokitus**, jossa 0 on tuntematon; ehto `stage ∈ {1, 2}` ei toteuta strategian vaiheiden I–II mittaria. `met_def_type` kertoo, sisältävätkö `met_tumor`, `met_lymph_node` ja `met_metastases` TNM-, Stage/Ann Arbor- vai sanallista tietoa. Kuvattu keruuikkuna on neljä kuukautta toteamisesta. Muunnos tarvitsee syöpätyypin ja luokitusversion. Tietosuojailmoituksen kuvaamat hoitoilmoituksen aloitus-/lopetuspäivät eivät ole sama asia kuin nykyisen 38 kentän tutkimusluettelon saatavuus. [Syöpärekisterin osakatalogi](https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0/datasets/ca8a40b0-1e54-447f-9bd2-70cfe82296f4), [tietosuojailmoitus](https://syoparekisteri.fi/tietoa-syoparekisterista/tietosuojailmoitus/).

**P:** myöhempi poimintasuunnitelma tarvitsee pseudonyymin linkkiavaimen, määritellyt kutsu-, testi-, tulos-, lähete-, tutkimus-, diagnoosi- ja hoitopäivät, hoitopäätöksen, suunnitellun ja toteutuneen ajan, peruutus-/siirtosyyn sekä seurannan suunnitelman ja toteuman. Lisäksi tarvitaan kuolema, muutto, muu palveluntuottaja, kirjaamisaika ja havaintojen katkaisupäivä. Hoitoa vielä odottavia ei saa poistaa analyysistä vain loppupäivän puuttumisen vuoksi. Myös useiden testien episodisäännöt ja aikajärjestysvirheet on määriteltävä.

Yksilötason aineiston nykyinen reitti on Findatan tietolupa. Pelkkää THL:n rekistereistä muodostettavaa anonyymiä tilastoa koskeva pyyntö toimitetaan THL:lle. Luvan jälkeinen poiminta, pseudonymisointi ja hyväksytty käyttöympäristö ovat erillisiä vaiheita ja maksullisia. Tämä on jatkoprojektin reitti, ei viikonlopun riippuvuus. [Syöpärekisterin tietopyyntöohje](https://cancerregistry.fi/services/information-requests/), [Findatan tietoluvat](https://findata.fi/luvat/tietoluvat/).

## 8. Perusteltu viikonlopun MVP

### Tuote ja tarkka lupaus

**P:** työnimeksi sopii **Seulontatutka – Helsingin rintaseulonnan tutkimusnäkymä**. Kohdekäyttäjä on terveyspalvelujen kehittäjä tai tutkimustiimi. Tuote vastaa kysymykseen: *Miten rintaseulontaan kutsuttujen osallistuminen muuttuu Helsingissä eri vuosina ja kutsuikäryhmissä, ja mikä osa tulkinnasta jää aineiston ulkopuolelle?*

Agentti saa käyttöönsä yhden version aineistosta ja sen määritelmät. Se laskee määrätyt tunnusluvut, näyttää lähdesolut, kirjoittaa lyhyen suomalaisen selosteen ja nimeää tarvittaessa seuraavan tietotarpeen. Ajo on rajallinen ja käyttäjän käynnistämä. Automaattista jatkuvaa tutkimus- tai lataussilmukkaa ei tarvita.

| MVP-osa | Rajaus ja hyväksyttävä lopputulos |
|---|---|
| Aineisto | Sovellusperäinen Helsingin rinta-CSV, 150 riviä; ensimmäinen näkymä 2020–2024. Kiinteät valinnat mukana. |
| Päänäkymä | Vuosi-/ikävalinta, kutsutut, tarkastetut, osallistumisprosentti ja muutos prosenttiyksikköinä. |
| Selitys | Tulos erotellaan lähdeluvuksi, omaksi laskuksi ja avoimeksi selitykseksi. Lähdelinkki, päivitys-/latauspäivä ja nimittäjä näkyvät. |
| Strategiaviite | Haluttaessa 80 %:n viiva tekstillä ”Kansallisen syöpästrategian tavoite vuodelle 2035”. |
| Laatu | Nolla ja puuttuva erillään; lähdeversioero vuodelta 2021 näkyvissä. Ei peittävyyden omaa uudelleenlaskua. |
| Kysymykset | Esimerkiksi ”Mikä muuttui 2023–2024?” tai ”Näytä 60–61-vuotiaiden osallistuminen eri vuosina”. |
| Rajatun kysymyksen ylitys | Agentti kertoo, että syytä, diagnoosiviivettä, hoitovajetta tai vaikutusta kuolleisuuteen ei voi osoittaa valitusta datasta. |
| Vienti | Lähteistetty lyhyt tulosyhteenveto ja valittujen aggregaattisolujen taulukko CC BY 4.0 -attribuutiolla. |

**Miksi tämä valinta:** osallistuminen vastaa suoraan projektin ensimmäiseen kysymykseen; osoittaja ja nimittäjä ovat näkyvät; yhteinen vuosi–ikätaulukko on oikeasti ladattu; lisenssi on vahvistettu; 150 rivin aineisto on pieni ja tarkistettava. Rajaus tekee agentin päättelyketjusta demonstroitavan ilman väitettä toimivasta koko maan dataintegraatiosta. THL-jono sopii vaihtoehtoiseksi pieneksi demoksi, mutta sen yhteys varsinaiseen syövän hoitopolkuun on heikompi. Kuolemansyyt ovat varma tekninen vaihtoehto, mutta etäämmällä seulontaan osallistumisen kehittämisestä.

### Toteutusjärjestys ja valmiuden ehdot

Työmäärä on **P-tason arvio** yhdelle kehittäjälle, ei mitattu toteutusaika. Ensimmäiset 1–2 tuntia: lue valmiit CSV- ja metatiedot, säilytä lähteen lukumäärät ja tarkista valittu ruudukko. Seuraavat 2–4 tuntia: rakenna vuosi-/ikävalinnat ja tarkistettavat laskut. Seuraavat 2–3 tuntia: lisää rajattu kysymys–vastaus, lähteet ja määritelmät. Viimeiset 1–2 tuntia: käy läpi muutama tulkintaa haastava kysymys ja demon polku. Työ on realistisesti noin yksi kehittäjäpäivä, käyttöliittymän valmiista pohjasta riippuen.

Valmis demo hyväksytään, kun:

1. Vuoden 2024 kaikki ikäryhmät palauttavat **28 686 / 38 630 = 74,2583 %**.
2. Vuoden 2023 ja 2024 vertailu käyttää kummankin vuoden omia kutsumääriä; ikäosuuksista ei oteta painottamatonta keskiarvoa.
3. Jokainen esitetty luku voidaan jäljittää soluun tai näkyvään kaavaan, ja tiedoston ulkopuoliset kiinteät valinnat näkyvät.
4. Vastauksissa erotetaan osallistuminen, kohdeväestön peittävyys ja jatkotutkimus. Lähteen puuttuvuusmerkkiä ei muuteta nollaksi.
5. Agentti ei keksi vastausta kysymykseen ”Miksi Helsinki on matala?” tai ”Kuinka monta jäi ilman hoitoa?”. Se nimeää tarvittavan lisäaineiston.
6. Näytössä on asianmukainen lähde, CC BY 4.0, aineiston poiminta 14.11.2026 sekä tieto tehdyistä laskennallisista muunnoksista. [Lisenssi ja sovellusohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html).

**Ehdolliset laajennukset:** ensin sama vienti kaikilta 22 alueelta ja kontrollisummat; vasta sitten yhteisillä painoilla tehty alueellinen ikävakiointi. Kohdunkaulan valmis Helsinki-CSV on teknisesti mahdollinen toinen ohjelma, mutta kutsutyyppi ja 25–29-vuotiaiden rajaus on pidettävä erillään. Tarkkoja viivehälytyksiä, henkilökohtaisia hoitosuosituksia tai tuntemattomasta stagesta johdettuja ”myöhäisen diagnoosin” lukuja ei sisällytetä tähän määriteltyyn MVP:hen.

## 9. Tekninen liite: testatut toimitukset, rakenteet ja laskentasäännöt

### 9.1 Todella onnistuneet lataukset

Alla oleva näyttö on jo tehtyjen kokeiden tulos. Taulukko ei lupaa, että istunto, osoite tai palvelun rakenne pysyy muuttumattomana. Tiedostonimeen tai HTTP-koodiin ei luoteta ilman sisällön tarkistusta.

| Lähde | Testattu toimitus ja tulos | Havaittu rakenne / olennainen tarkistus |
|---|---|---|
| D01 syöpätilastosovellus | Selain-CSV, 439 tavua, 6 riviä | Puolipiste, desimaalipilkku; sukupuoli, levinneisyys, määrä ja suhteet. Kiinteät valinnat sivumetadataan. Kolme solua verrattu käyttöliittymään. |
| D02 suolistoseulonta | [HTML GET](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html), 7 368 210 tavua | 34 oikeaa taulukkoa. Raaka `<table>`-tekstihaku antaa 39, joista 5 JavaScript-malleja. |
| D03 rintaseulonta | [HTML GET](https://stats.cancerregistry.fi/joukkistilastot/rinta.html), 8 662 680 tavua | 61 taulukkoa; 66 tekstiosumasta 5 malleja. |
| D04 kohdunkaulaseulonta | [HTML GET](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html), 10 197 651 tavua | 126 taulukkoa, kahden jäsentäjän solut yhtenevät. Ikä-/riski- ja menetelmätaulukot erikseen. |
| D03/D04 sovellus | Oikeat selainlataukset, rinta 9 402 tavua / 150 riviä, kohdunkaula 20 099 tavua / 306 riviä | Vuosi, kutsuikä ja 7 numeerista saraketta. Ei duplikaattiavaimia tai epänumeerisia arvoja näytteissä. 456/456 osallistumisprosenttia täsmää. |
| D08 myelooma | HTML:n upotettu JSON | 11 DataTables-taulukkoa / 1 136 esitysriviä; sama tieto toistuu eri näkymissä. 18 kansallista hoito-osuutta tarkistettu. |
| D09 tutkimuskatalogi | [Julkinen metadata-GET](https://aineistokatalogi.fi/api/v1/public/studies/21085403-7be8-4f93-bf05-231518c642a0) | 154 kenttää, ei potilasdataa. Tietoluokitus salassa pidettävä. |
| D10 Hilmo | [Syöpätautien potilas-JSON](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.json?row=area-2079&column=time-6656&filter=speciality-17958&filter=measure-17881) | `dataset`-kääre, alue/aika, 286 eksplisiittistä arvoa; 26 teknistä tyhjää solua. |
| D12 Avohilmo | [Korjattu C50-asiakas-JSON](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.json?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454) | 258 arvoa, 2 puuttuvaa avainta. Tyhjä alkuperäinen vastaus säilytetty epäonnistuneena kokeena. |
| D14 THL-jono | [Osuus](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738217), [>180 vrk määrä](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738216), [kaikki odottajat](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738214) | Dimensiot tuottaja/ajankohta, koko 20 × 110, 1 444 arvoa per mittari. Arvot merkkijonoina; puuttuva avain ei nolla. |
| D11/D13/D15 lisätestit | Toimenpide- ja PTH-hoitoonpääsyn pienet JSON-vastaukset | HA1CA/HA1AA sekä Avohilmon seulontakoodi; PTH:n 137 määrä-/prosenttisolua. Niukka sisältö/kattavuus estää H03:n ratkaisun. |
| D21/D22/D30/D23 StatFin | Metadata GET + JSON-stat2 POST: 11be 4, 13u5 16, 11re 10 ja Paavo 10 solua; lisäksi 11ra 46 solua | Yhteensä 86 solua viidessä rajatussa aineistokokeessa. Vastauksen oma `id`, `size`, `dimension`, `value` ja mahdollinen `status` ohjaavat purkua. |
| D29 Kela | [DataStore-reitti, pieni esimerkkirajaus](https://avoindata.suomi.fi/data/api/3/action/datastore_search?resource_id=cc74cc46-2b92-42b5-9a52-55adb3df512f&limit=3); lisäksi kaikki koodin 115 vuoden 2025 julkaistut rivit | CKAN `success`, `result`, `fields`, `records`, `total`. Rajaus 486 riviä, määrä täsmää `total`-arvoon. `_id` on tilastorivin tunniste. |
| D17 Kela | [Kolmen rivin 2025-koe](https://avoindata.suomi.fi/data/api/3/action/datastore_search?resource_id=ed6d4355-f72e-4b4c-8f08-3b7875327b72&limit=3) | Todellinen pieni JSON. Koko 2 899 679 rivin resurssia ei ladattu. |
| D24 FinnGen | [R13-manifestin TSV](https://storage.googleapis.com/finngen-public-data-r13/summary_stats/finngen_R13_manifest.tsv), 820 805 tavua | 2 754 riviä: phenocode, phenotype, category, num_cases, num_controls, path_bucket, path_https. Ei ladattuja GWAS-tulostiedostoja. |
| D06 NORDCAN | [Rajattu vuoden 2024 Suomen naisten C50-otos](https://canapi.iarc.who.int/api/nordcan/v2/961/data/population/0/2/(246)/(180)/?ages_group=0_17&year_start=2024&year_end=2024&year_grouped=1) | JSON, 1 236 tavua, 1 dataset-rivi, 18 ikäryhmää, 24 kenttää, `error:[]`. Version 961 metadata vahvisti maa-/syöpä-ID:t. Käyttöehdot rajaavat jatkokeruuta. |

Seulonnan CSV:n käyttöliittymäpolku oli: ohjelma → Kutsut ja tarkastukset → Naiset → Helsingin kaupunki → Kutsuvuosi ja Kutsuikä → Näytä → Taulukko → Pitkä taulu → CSV. Kohdunkaulassa valittiin ikäryhmäseulonta. Lataus valmistui näkyvästi ja tiedostot avattiin paikallisesti. Osoite `/seulonta/session/{session_id}/download/download_csv?w=` oli istuntokohtainen ja riippui valinnoista; sitä **ei käytetä pysyvänä API-osoitteena**. [Sovellus](https://tilastot.syoparekisteri.fi/seulonta/).

### 9.2 Tarkka toimivaksi testattu PxWeb-esimerkkikysely

Seuraava runko lähetettiin POST-pyyntönä [11be:n API-osoitteeseen](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px). Se palautti neljä havaintosolua: C50/C18 × 2024/2025, kaikki iät ja molemmat sukupuolet. Tämä on **testattu pyyntö**, ei ehdotettu kenttäluettelo.

```json
{
  "query": [
    {"code": "kuolinsyyt_80_20210101", "selection": {"filter": "item", "values": ["C50", "C18"]}},
    {"code": "ikaryhma_10_20180101", "selection": {"filter": "item", "values": ["SSS"]}},
    {"code": "timeperiod_y", "selection": {"filter": "item", "values": ["2024", "2025"]}},
    {"code": "sukupuoli_9_20180101", "selection": {"filter": "item", "values": ["SSS"]}},
    {"code": "contentscode", "selection": {"filter": "item", "values": ["ksyylkm"]}}
  ],
  "response": {"format": "json-stat2"}
}
```

Vastauksen solujärjestys puretaan sen oman dimensiojärjestyksen ja indeksien avulla. Taulun `SSS` on kyseisen ulottuvuuden kokonaisluokka. Sama merkkijono toisessa taulussa ei yksin takaa samaa kohorttia. Sarakkeen `updated` kertoo lähteen päivitysajan; poiminta-aika tallennetaan erikseen.

### 9.3 Toimivaksi testattu Kela-rajaus ja muut skeemat

Kelan 486 rivin poiminta käytti DataStore-resurssia `cc74cc46-2b92-42b5-9a52-55adb3df512f`, suodattimina `vuosi = 2025` ja `korvausoikeus_koodi = 115`. [Täsmällinen toimivaksi testattu GET-pyyntö](https://avoindata.suomi.fi/data/api/3/action/datastore_search?resource_id=cc74cc46-2b92-42b5-9a52-55adb3df512f&limit=1000&filters=%7B%22korvausoikeus_koodi%22%3A+115%2C+%22vuosi%22%3A+2025%7D&sort=_id+asc) käytti enimmäismäärää 1 000 ja järjestystä `_id asc`; arvot varmistettiin jokaiselta riviltä. Tämä ei ole koko 1,7 miljoonan rivin resurssin lataus. [CKAN-paketti](https://avoindata.suomi.fi/data/api/3/action/package_show?id=70832958-f7b6-4e09-8350-615362e6ee30).

Olennaiset tietokentät ovat `aikatyyppi`, `vuosi`, `hyvinvointialue_nro`, `hyvinvointialue_nimi`, `ikaryhma`, `sukupuoli`, `korvausoikeus_koodi`, `korvausoikeus_selite`, `alkanut_lkm`, `kokovuosi_lkm`, `kuolema_lkm`, `voimassaolleet_lkm` ja `vuodenlopussa_lkm`. Koodeja ei muuteta ICD-10- tai ATC-koodeiksi. Saman rivin viittä mittaria ei summata henkilömääräksi.

THL:n testatuissa vastauksissa `dataset.dimension.id` ja `size` määrittävät ulottuvuudet. `category.index` yhdistää tunnisteen paikkaan, `category.label` nimeen ja `value` on usein indeksoitu sanakirja. Eksplisiittinen merkkijono `"0"`, puuttuva avain, `".."` ja null ovat eri tiloja. Tunniste- ja nimikartta säilytetään version mukana. Mittarisuodatin on tallennettava, vaikka vastaustaulukossa ei olisi erillistä mittarisaraketta.

Seulonta-CSV:t ovat UTF-8-tekstiä, erotin puolipiste ja desimaalierotin pilkku. Rintatiedostossa vuoden sarakenimi on `Kutsuvuosi (2010-2024)`, kohdunkaulassa `Kutsuvuosi (1991-2024)`. Muut sarakkeet ovat `Kutsuikä`, `Kohdeväestö`, `Rekisteröity kohdeväestö`, `Rekisteröity kohdeväestö, %`, `Kutsuttu`, `Peittävyys väestöstä, %`, `Tarkastettu` ja `Tarkastettu kutsutuista, %`. CSV:n pitkä desimaaliesitys ei tarkoita, että itse havaintojen mittaustarkkuus olisi näyttöä parempi.

### 9.4 Epäonnistuneet, osittaiset ja ehdotetut toimitukset

| Kohde | Todellinen tila | Mitä ei saa väittää / ehdotettu jatko |
|---|---|---|
| Seulontaviiveiden numerot | 3 suoliston, 5 rinnan ja 10 kohdunkaulan PNG-kuvaa. Raporttien JSON-kuviot sisälsivät muita trendejä/karttoja. | Ei testattua viive-CSV:tä, tarkkaa N:ää tai valmista viive-API:a. Ehdotus: julkaisijan dokumentoitu numerotoimitus. |
| Kaikkien alueiden seulontasovellusvienti | Valmiissa näytteissä Helsinki, kaksi ohjelmaa. | Ei väitettä 22 alueen CSV-kokonaisuudesta. Ehdotus: sama valinta alueittain ja riippumattomat summakontrollit. |
| Suoliston yhteisositus | Ohjelmaa ei havaittu avatun sovelluksen ohjelmavalinnoissa. | Ei kuviteltua alue × ikä × sukupuoli × historia -taulukkoa. |
| D05 kliiniset ilmoitukset | Sovelluksen käyttöliittymä/metatiedot luettu; ei numeroexporttia. | Ei automatisoitavaa kattavuussarjaa ennen todellista vientiä. |
| Sotkanet REST | Indikaattori-, alue- ja datahaut 403. | Ei toimivaksi testattua datarajapintaa tai vahvistettuja havaintoarvoja tässä työssä. |
| Kela 2020– Cognos | Nykyinen raportti tunnistettu; sovelluskuori, vienti testaamatta. | NIT137A:n arkistoa ei nimetä nykyiseksi. Ehdotus: yksi rajattu ATC-vienti ja sen määritelmät. |
| Keuhkoraportti / lääketilaston PDF | Sisältö osin luettu verkkolukijalla tai julkaisulista vahvistettu; suoria 403-vastauksia. | Katsottu kuvaus ei ole ladattu strukturoitu datasetti. |
| ECIS | HTTP 200, mutta 244 tavun `Request Rejected` -HTML. Lomaketta ei lähetetty. | Ei onnistunut CSV. Lomakereitti on pääsyreitti, ei anonyymiksi testattu lataus. |
| FinnGen / biopankit / Findata | Manifesti tai metadata; ei henkilötietoa tai suuria tulostiedostoja. | Ei potilaspolkuja. Lupaprosessi ja käyttöympäristö erikseen. |
| Suunnitelma–toteuma/peruutukset | Koodistoja ja ohjeita löytyi, soveltuvaa avointa syöpäkohtaista havaintotaulukkoa ei. | Koodin olemassaolo ei todista datan saatavuutta, kattavuutta tai peruutuksen syytä. |
| THL:n yksi PDF-niminen lataus | Julkari-osoite palautti HTML:n tiedostonimeen `queue_2025.pdf`; myöhempi `/server/api/core/bitstreams/.../content` palautti aidon PDF:n. | Tiedostopääte ja HTTP 200 eivät riitä. Raportin määritelmät perustuvat aitoon PDF-vastaukseen. |

Tässä raportissa ei ole keksittyjä API-osoitteita ehdotettujen toimitusten korvikkeena. Pidemmät kyselyt, kaikki alueet ja uusi ikävakiointi ovat vasta seuraavan toteutuksen tehtäviä.

### 9.5 Yhdistelykoe ja alueluokitusten rajat

**V/L:** vuoden 2024 rinta- ja suolistoseulonnan 22 aluetta liitettiin StatFin 11ra:n väestöön onnistuneesti, ilman puuttuvia vastinpareja tai monistuvia lopputaulun avaimia. Väestöpoiminta sisälsi 23 aluetta × 2 mittaria = 46 solua; Ahvenanmaa jäi tarkoituksellisesti seulontaliitoksen ulkopuolelle. Lopputaulussa on 22 riviä. Väestömittarit ovat 31.12.2024 väkiluku ja 65 vuotta täyttäneiden osuus. [11ra ja määritelmät](https://pxdata.stat.fi/PxWeb/pxweb/fi/StatFin/StatFin__vaerak/11ra.px/).

Seulontaraportin nimet kytkettiin metadatasta tarkistettuihin HVA-koodeihin täsmällisellä analyytikon vastaavuustaululla, ei sumealla nimihaulla. HVA01–HVA21 ovat hyvinvointialueet, HVA90 Helsinki ja HVA91 Ahvenanmaa. Esimerkiksi Helsinki → HVA90, Pohjois-Pohjanmaa → HVA19, Etelä-Karjala → HVA11. 11re:n Helsinki on puolestaan **KU091**. Sama sarakenimi `alue_23_20260101` 11re:ssä ja 13u5:ssä ei tee KU- ja HVA-koodeista samoja avaimia.

**Todettu liitosansa:** kaksi ohjelmaa pitkässä muodossa tuotti 44 seulontariviä, ja kaksi väestömittaria 46 riviä. Pelkkä alue–vuosi-liitos olisi tehnyt 22 monta-moneen-avainta ja 88 tulosriviä. Toteutettu koe muunsi ohjelmat ja väestömittarit omiksi sarakkeikseen ennen liitosta. Vaihtoehtoisessa pitkässä mallissa ohjelma ja mittari on pidettävä eksplisiittisinä ulottuvuuksina.

**V/A:** 11ra käyttää 1.1.2026 aluejakoa takautuvasti. Seulontarekisterien tutkimusmetadatassa asuinkunta määräytyy seulontavuotta edeltävän vuoden viimeisen päivän mukaan: vuoden 2024 seulonnassa 31.12.2023. Julkisen vuositilaston täsmällinen alueversio on kuitenkin vahvistettava erikseen. Tutkimuskatalogissa suoliston ja kohdunkaulan HVA-viite on 2025, rinnan viitteessä paikkamerkki `XXXX`. Tekninen 22/22-osuma ei siten todista alue- ja viitepäivien täydellistä vastaavuutta. [Seulontakatalogi](https://aineistokatalogi.fi/api/v1/public/studies/21085403-7be8-4f93-bf05-231518c642a0).

**P:** väestö on tässä konteksti, ei uusi seulontaosallistumisen nimittäjä. Helsingin 684 018 asukasta ja 17,6 %:n 65 vuotta täyttäneiden osuus eivät ole kutsuttujen ikäjakauma. Alueen tulot tai ikärakenne eivät kerro yksittäisen osallistumattoman henkilön ominaisuuksia. Paavon postinumeroiden summauksessa on lisäksi pinta-alaperusteinen kuntakytkentä ja noin prosentin koordinaattipuuttuvuus. [Paavon 2026-käsikirja](https://media.stat.fi/A7H6ohk0S8qafyCM4bfDaz/cmlt4oevajb2g06uqeojdtq58).

### 9.6 Ehdotettu analyysitaulun rakenne ja laskennan säännöt

Tämä alaluku on **P: toteutusehdotus**, ei alkuperäislähteiden jo tarjoama yhteinen skeema.

| Kenttäryhmä | Tallennettava sisältö |
|---|---|
| Alkuperä | Lähdeperhe, tuote, alkuperäinen URL, lisenssi, lähteen päivitys, latausaika ja tiedoston SHA-256 |
| Valinta | Ohjelma, syöpä-/erikoisala-/korvausoikeuskoodi omana tyyppinään, vuosi/ajankohta, sukupuoli, ikä, kutsutyyppi ja muut kiinteät suodattimet |
| Alue | Aluekoodi ja koodisto, nimi, aluejaon versio, asuinpaikan viitepäivä tai tuottajatunniste |
| Mittari | Mittarin tunnus, yksikkö, osoittaja, nimittäjä ja sen määritelmä, arvo sekä alkuperäinen raakatoken |
| Laatu | Nolla / havaittu / puuttuva / salattu / ei sovellu erikseen, seurannan katkaisu, lähdeversioero ja kattavuushuomiot |
| Tulos | Laskentakaava, käytetyt solut, mahdollinen painotus ja tulkinnan taso V/L/P/A |

Laskentasäännöt ovat osallistumiselle `100 × Σ osallistuneet / Σ kutsutut_tai_poimitut` ja suoralle vakioinnille `Σ yhteisen ositteen kiinteä paino × ositteen osallistumisaste`. Painot tallennetaan; iän ja historian eri marginaaleista ei valmisteta yhteistä taulukkoa. Prosenttiyksikkömuutos erotetaan suhteellisesta prosenttimuutoksesta. Tyhjällä tai nollalla nimittäjällä osuutta ei lasketa. Suojattuja/pääteltäväksi jääviä arvoja ei täydennetä nolliksi, eikä puuttuva hoitotapahtuma muutu luokaksi ”ei hoidettu”.

Paavon käsikirja määrittää osalle ryhmistä alle 10:n, muille alle 30:n suojausrajan; kokonaismäärät ovat erikseen. PxWebin suojattu `…` ja paikkatiedon `-1` eivät ole nollia. Näitä sääntöjä ei siirretä THL:n tai seulontaraporttien eri tuotteisiin. Syöpätilastosovelluksen 1–4-sääntö on oma tuotekohtainen sääntönsä. [Paavon käsikirja](https://media.stat.fi/A7H6ohk0S8qafyCM4bfDaz/cmlt4oevajb2g06uqeojdtq58), [syöpätilastosovelluksen ohje](https://tilastot.syoparekisteri.fi/syovat/help_main_fi.html).

NORDCAN-otoksen kokonaismäärä **5 231,6** on esimerkki harmonisoinnin seurauksesta, ei 0,6 ihmistä: pienet Suomen solut tasataan viiden vuoden sisällä. Ikäsolujen tapausmäärät täsmäävät kokonaisarvoon. Väestösolujen summa 2 837 574 eroaa `total_pop`-kentästä 2 837 576 kahdella; eroa ei korjattu oletuksella. `cum_risk` on null, vaikka ikärajatut riskikentät ovat numeerisia. Suomen NORDCAN-suuralueet eivät ole hyvinvointialueita, eikä niille ollut metadatassa elossaolotietoa. [Testattu rajattu otos](https://canapi.iarc.who.int/api/nordcan/v2/961/data/population/0/2/(246)/(180)/?ages_group=0_17&year_start=2024&year_end=2024&year_grouped=1), [tietokanta ja ehdot](https://nordcan.iarc.who.int/en/database).

### 9.7 Toistettavuuden paikallinen tarkistusjälki

Raportin päätelmät ja olennaiset lähteet ovat yllä. Täydentävä raakanäyttö sijaitsee alkuperäisessä projektissa `/Users/rasmussorri/Desktop/Junction2026`. Seuraavat linkit ovat paikallisia tarkistuspolkuja; raportin siirrettävä kopio ei edellytä niiden avautumista.

| Näyttö | Keskeinen paikallinen tiedosto |
|---|---|
| Sovellus-CSV:n rajaukset, tiivisteet ja 456 prosenttitarkistusta | [Seulontapoiminnan profiili](/Users/rasmussorri/Desktop/Junction2026/10%20Hypoteesit%20ja%20löydökset/Seulontasovelluksen%20koepoiminta/koepoiminnan_profiili.json) |
| Rinnan alkuperäinen 150 rivin CSV | [Rinta, Helsinki, vuosi–ikä](/Users/rasmussorri/Desktop/Junction2026/10%20Hypoteesit%20ja%20löydökset/Seulontasovelluksen%20koepoiminta/work/rinta_helsinki_vuosi_ika.csv) |
| Kolmen ohjelman taulukoiden laatu ja viiveiden saatavuus | [Kohdunkaulan ja viiveiden profiilit](/Users/rasmussorri/Desktop/Junction2026/06%20Tekninen%20liite/Kohdunkaula%20ja%20seulontaviiveet/saatavuusprofiilit.json) |
| THL:n määrä–prosenttilaskut | [1 444 vertailua](/Users/rasmussorri/Desktop/Junction2026/06%20Tekninen%20liite/THL%20jatkotarkistus/ratio_checks.json) |
| Jonotuotteen oma lisenssi ja päivitys | [Tallennettu jonoraportin HTML](/Users/rasmussorri/Desktop/Junction2026/06%20Tekninen%20liite/THL%20täydentävät%20lähteet/queue_report.html) |
| Tilastokeskuksen tarkat POST-rungot ja latausnäyttö | [Pyyntöloki](/Users/rasmussorri/Desktop/Junction2026/06%20Tekninen%20liite/Tilastokeskus%20ja%20Sotkanet/work/request_log.json) |
| Seulonta–väestö-liitoksen 22/22 kontrollit | [Liitostarkistukset](/Users/rasmussorri/Desktop/Junction2026/09%20Aineistojen%20syväanalyysi/Yhdistelykoe/work/join_checks.json) |
| Alue- ja aikahavaintojen laskenta | [Eksploratiiviset tulokset](/Users/rasmussorri/Desktop/Junction2026/10%20Hypoteesit%20ja%20löydökset/work/exploration_results.json) |
| H01:n erilliset historia-/nimittäjätestit | [H01-tulokset](/Users/rasmussorri/Desktop/Junction2026/10%20Hypoteesit%20ja%20löydökset/H01%20jatkotutkimus/h01_tulokset.json) |
| Kelan rajatun 486 rivin poiminnan profiili | [Kelan profiili](/Users/rasmussorri/Desktop/Junction2026/09%20Aineistojen%20syväanalyysi/Kelan%20korvausoikeudet/profile.json) |
| Tämän koosteen laadunvarmistus | [Raportin QA](/Users/rasmussorri/Desktop/Junction2026/05%20Raportti/Raportin%20QA.md) |

Lähdetiedostot on säilytetty muuttamatta. Aiempien tarkistusskriptien toimintatapa, poimintaparametrit ja lokit ovat samassa projektissa; verkkoa käyttävä päivitys ei ole tarpeen tämän raportin keskeisten lukujen tarkistamiseen. Eri tuotteiden päivityspäivää, aineiston viimeistä tilastovuotta ja omaa latauspäivää käsitellään kolmena eri tietona. Tämä erotus on myös suositellun tutkimusagentin luotettavuuden perusta.
