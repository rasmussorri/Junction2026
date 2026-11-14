---
päivä: 2026-11-14
tila: osittain-vahvistettu
perheet: [Kela, Fimea]
---
# Kela ja Fimea — varmennus ja uudet lähteet

**Tärkeimmät tulokset:** lääkekorvausoikeuksista löytyi avoin, pienin JSON-kyselyin käytettävä syöpäkohtainen tietotuote. Vanha NIT137A-raportti päättyy vuoteen 2019, vaikka sen erillinen ohjesivu näyttää yleiseltä. Suomen lääketilaston uusin julkaisulista sisältää vuoden 2025 julkaisun. Tässä ei hankittu henkilötason tietoa eikä ladattu suuria CSV-tiedostoja.

## 1. Uusi lupaava tietotuote: lääkekorvausoikeudet

**Vahvistettu primäärikuvauksesta:** vuosittainen aineisto alkaa vuodesta 1986. Mittareina ovat alkaneet, koko vuoden / vuoden aikana / vuoden lopussa voimassa olleet ja kuolemaan päättyneet korvausoikeudet. Peräkkäisiä saman koodin jaksoja yhdistetään enintään 90 vuorokauden katkolla. Alue, ikä ja sukupuoli määräytyvät vuoden lopun tai kuolinpäivän mukaan; ennen vuotta 2021 alueistus käyttää vuoden 2021 luokitusta. Voimassa oleva oikeus ei todista lääkeostoa. [Kelan kuvaus](https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet).

**Teknisesti testattu:** [CKAN-paketin metadata](https://avoindata.suomi.fi/data/api/3/action/package_show?id=70832958-f7b6-4e09-8350-615362e6ee30), [muuttujakuvaus](https://avoindata.suomi.fi/data/dataset/70832958-f7b6-4e09-8350-615362e6ee30/resource/b223d529-6ccb-48e8-9124-662da96ce97f/download/package.json) ja [kolmen rivin DataStore-koepoiminta](https://avoindata.suomi.fi/data/api/3/action/datastore_search?resource_id=cc74cc46-2b92-42b5-9a52-55adb3df512f&limit=3) onnistuivat HTTP 200. Näytteessä vuosi **2025**; metadatan vuosi-arvot 1986–2025. API ilmoittaa koko resurssille 1 729 930 riviä, mutta sitä ei ladattu kokonaan. Paketti ilmoittaa lisenssiksi **CC BY 4.0**.

Vahvistetut kentät: `aikatyyppi`, `vuosi`, `hyvinvointialue_nro`, `hyvinvointialue_nimi`, `ikaryhma`, `sukupuoli`, `korvausoikeus_koodi`, `korvausoikeus_selite`, `alkanut_lkm`, `kokovuosi_lkm`, `kuolema_lkm`, `voimassaolleet_lkm`, `vuodenlopussa_lkm`. API lisää `_id`-rivitunnisteen; se on tilastorivin tunniste, ei potilastunnus. Tarkkuus on alue × viiden vuoden ikäryhmä × sukupuoli × korvausoikeus × vuosi. Metadatassa on esimerkiksi **115 Rintasyöpä**, **116 Eturauhassyöpä**, **117 Leukemiat…** ja **128 Gynekologiset syövät**. Koodit ovat korvausoikeusluokitusta, eivät ICD-10 tai ATC.

Myös rajattu koodi 115 / vuosi 2025 -haku onnistui: 10 pyydettyä riviä, jokaisessa oikea koodi ja vuosi. Tarkka URL on `targeted_http_log.json`-tiedostossa. Esimerkkirivi Helsinki, naiset 75–79: 84 alkanutta oikeutta, 733 vuoden aikana voimassa ja 662 vuoden lopussa. Tämä ei ole 84 uutta syöpädiagnoosia tai 662 hoidettua potilasta.

**Varoitus tuoreudesta:** CSV-resurssin `last_modified` on 17.3.2025, mutta DataStore-näytteessä on vuosi 2025 ja paketin metadata päivitetty 15.10.2026. Nämä kellot mittaavat eri asioita; resurssin muokkauspäivää ei saa käyttää yksin datan viimeisenä seurantavuotena.

**Sopivuus:** heti teknisesti käytettävä alueellinen syöpäkorvausoikeuksien kuvaus. Ei hoidon aloituspäivää, lääkkeen toimitusta, stagea tai vasteita. Kuolemaan päättynyt oikeus ei kerro kuolemansyytä. Syöpärekisteriin voidaan tehdä kuvaileva alue–vuosi–ikä–sukupuoli-vertailu vain määritelmät harmonisoiden; aggregaattien erotus ei mittaa hoitovajetta. Pienlukusuojauksen sääntöä ei vahvistettu tässä tarkistuksessa.

## 2. Yleinen sairaanhoitokorvausaineisto

[CKAN-paketti](https://avoindata.suomi.fi/data/api/3/action/package_show?id=22368122-4f1b-4a8c-8a82-e70cdca843c9) vahvisti CSV-resurssit ja CC BY 4.0:n. Vuoden 2025 resurssin ilmoitettu koko on **283 050 944 tavua**. Koko tiedoston sijaan testattiin [kolmen rivin JSON-poiminta](https://avoindata.suomi.fi/data/api/3/action/datastore_search?resource_id=ed6d4355-f72e-4b4c-8f08-3b7875327b72&limit=3): onnistui, 2 076 tavua; vastaus ilmoittaa 2 899 679 kokonaisriviä.

Skeemassa ovat aika, kunta, ikäryhmä, sukupuoli, etuuslaji, saajat, korvaukset, kustannukset, omavastuukerrat ja toimitukset. **Ei ATC:tä, diagnoosia tai korvausoikeuskoodia** tässä tietotuotteessa. Sitä ei pidä sekoittaa yllä olevaan lääkekorvausoikeusaineistoon. Eri etuusluokkien kokonais- ja alaluokkia ei summata päällekkäin. Pääasiallinen rooli on yleinen palvelu-/korvaustausta, ei syöpäkohtainen hoitopolku.

## 3. NIT137A on arkistoraportti; uusi 2020–-raportti löytyi

**Vahvistettu:** [vanhan raportin HTML](https://raportit.kela.fi/ibi_apps/WFServlet?IBIF_ex=NIT137AL&YKIELI=E) ilmoittaa tietojen siirtyneen 1.1.2020 alkaen raportille Sairausvakuutuksesta korvattavat lääketoimitukset, ja sen vuosivalikoima on 2008–2019. Tallenne `kelasto_nit137_report.html` käyttää ISO-8859-1-merkistöä.

[Vanha muuttujakuvaus](https://raportit.kela.fi/approot/lisatied/NIT137A_fi.html) vahvistaa ATC-luokan, korvausluokan, ajan, ostajat, lääke-erätoimitukset, kustannukset ja korvaukset. Sen yleistä päivitystiheyskuvausta ei pidä käyttää näyttönä tämän arkistoraportin nykyisestä tuoreudesta. Sivun vanhoja omavastuu-/korvaussääntöjä ei kopioitu nykyiseksi ohjeeksi.

[Kelan nykyinen tilastosivu](https://tietotarjotin.fi/tilasto/2857522/tilasto-sairausvakuutuksesta-korvattavista-laaketoimituksista) erottaa 2008–2019- ja **2020–**-raportit. Uusi raportti on Cognos-tietotuote **9105RS001**, osoitteessa `tilastot.kela.fi/ibmcognos/bi/` (täysi lähdelinkki nykyisellä tilastosivulla). Sivu vahvistaa apteekkien välityksellä korvattavat lääkeostot ja vuoden 2025 julkistuksen 16.6.2026. Uuden interaktiivisen raportin varsinaista ATC-datavientiä ei tässä testattu; verkkolukija näki tyhjän sovelluskuoren.

**Tulkinta:** ATC on lääkeryhmä, ei yksilön syöpädiagnoosi. L-pääryhmä sisältää myös immuunivasteen muuntajia. Apteekkitoimituksista ei saa sairaalassa annettujen syöpälääkkeiden täydellistä kuvaa. Toimitus ei ole hoitokuuri, ostaja ei ole uusi syöpäpotilas. Uusi raportti vaatii teknistä lisäselvitystä ennen MVP-valintaa.

## 4. Fimea: kulutus ja Suomen lääketilasto 2025

**Vahvistettu:** [Fimean kulutuskuvaus](https://fimea.fi/en/databases_and_registeries/consumption) kertoo tukkuliikkeiden apteekki- ja sairaalamyynnistä, ATC-luokituksesta, arvonlisäverottomista tukkuhinnoista sekä DDD/1 000 asukasta/vrk -kulutusmitasta. Kyse ei ole potilaan saamasta annoksesta tai hoidon aloituksesta.

Fimean englanninkielinen sivu linkittää edelleen vuoden 2024 julkaisuun. [Kelan yhteisjulkaisun ajantasainen listaus](https://tietotarjotin.fi/julkaisu/2080816/suomen-laaketilasto) sisältää **Suomen lääketilaston 2025**. Molemmat ovat saman Fimea–Kela-tietotuoteperheen jakelukanavia, eivät riippumatonta vahvistusaineistoa. Nykyinen Kelan tilastosivu vahvistaa vuoden 2025 julkistuksen 16.6.2026.

**Rajoite:** vuoden 2025 Julkari-kohde ja URN-ohjaus palauttivat avauksessa 403. Julkaisun olemassaolo ja vuosikerta on vahvistettu, mutta sen PDF-taulukoiden kenttiä, ATC-kohtaista vientiä ja PDF:n lisenssiä ei tässä varmennettu. Hakutuloksessa näkyvää CC BY -merkintää ei hyväksytty varmennetuksi PDF-lisenssiksi. Ei osoitettua CSV/API-kulutuspoimintaa tässä erässä.

## 5. Haittavaikutusilmoitukset

[Vuoden 2024 Sic-artikkeli](https://sic.fimea.fi/-/millaisia-haittavaikutuksia-laakkeista-ilmoitettiin-vuonna-2024-) saatiin luettua verkkolukijalla; julkaistu 12.12.2025. Se kuvaa epäiltyjä haittoja, vapaaehtoista ilmoittamista ja signaalien etsintää. Lääkeaineiden yleisimpiä ilmoituksia on HTML-taulukossa ja ATC-ryhmien kuvasta on linkitetty saavutettava yhden sivun PDF-tekstivastine. Tekstivastineen verkkopoiminnassa ryhmä **L (syöpälääkkeet ja immuunivasteen muuntajat)** on mukana. Tämä osoittaa, ettei kaikki numeerinen esitys ole pelkkä kuva.

**Tekninen raja:** PDF:n suora lataus ja artikkelin suora GET palauttivat tässä ympäristössä 403, vaikka verkkolukija palautti artikkelin ja PDF:n tekstin. Kuvankaappaus ei palautunut näkyvänä kuvana työkaluketjussa, joten PDF-taulukkoa ei merkitty visuaalisesti varmennetuksi eikä siitä tehty analyysidatasettiä. Linkki ja virhe ovat `targeted_http_log.json`-tiedostossa.

Vuoden 2025 haittakatsaus löytyi hakutuloksesta/virallisen sivun linkkivihjeenä, mutta sen sisältöä ei saatu avatuksi (403). **Viimeisin tässä sisällöllisesti vahvistettu haittaraportti on 2024; se ei tarkoita, ettei uudempaa olisi.**

Ilmoitusmäärät eivät anna haittojen ilmaantuvuutta: altistuneiden nimittäjä ja raportoinnin kattavuus puuttuvat. Ilmoitus ei vahvista lääkkeen aiheuttaneen haittaa. Eri lääkkeiden tai alueiden turvallisuusjärjestystä ei voi päätellä näistä määristä. Julkinen potilastason haitta-aineisto ja sen käyttöehdot eivät tässä varmistuneet.

## Seuraavat toimenpiteet

1. Lisää korvausoikeudet Kela-perheen erilliseksi tietotuotteeksi katalogiin; tämä on avoin, teknisesti varmennettu uusi lähde.
2. Korjaa NIT137A:n kattavuus arkistoksi 2008–2019 ja liitä nykyinen 2020–-raportti.
3. Testaa nykyisen Cognos-raportin yksi rajattu ATC-vienti ja muuttujamääritelmät. Älä tulkitse ATC L:ää syöpädiagnoosiksi.
4. Jatka vuoden 2025 lääketilaston ja haittakatsauksen primäärisisällön tavoittamista myöhemmässä kierroksessa; tässä 403-kohteita ei hakattu toistuvasti.
5. Korvausoikeuksien alueliitos voi tuottaa uuden kuvailevan hypoteesin, mutta se ei tuota hoitovajeen, eloonjäämisen tai haitan riskimittaria ilman sopivia määritelmiä ja lisädataa.
