---
status: varmennettu osittain
checked: 2026-11-14
scope: T06
---
# Tilastokeskus ja Sotkanet — varmennetut aineistot

Tarkistus tehtiin 14.11.2026 klo 01.37–01.45 Suomen aikaa primäärimetadatasta ja neljällä pienellä latauksella. Tilastokeskuksen neljä JSON-stat2-koetta palauttivat yhteensä 40 solua. Sotkanetin kuvaukset avautuivat, mutta sen REST-kokeet palauttivat HTTP 403. Rajapinnan toimivuutta ei siten voi vahvistaa tämän tarkistuksen perusteella. Alla olevat vuosirajaukset perustuvat todellisiin metadatavastauksiin, eivät alkuperäiseen linkkikatalogiin.

## Aineistoperheet ja käyttökelpoisuus

| Perhe ja testattu taulu | Todettu kattavuus ja ulottuvuudet | Saatavuus | Käyttö projektissa |
|---|---|---|---|
| Kuolemansyyt, **11be** | 1998–2025; 1 731 kuolemansyyluokkaa, 22 ikäluokkaa, 3 sukupuolivalintaa, kuolemien määrä | GET + 4 solun POST onnistui | Kansallinen syöpäkohtainen kuolleisuus ja ikä-/sukupuolierot. Ei alueulottuvuutta. |
| Kuolemansyyt, **13u5** | 1969–2025; 26 aluevalintaa, 65 kuolemansyyluokkaa; lukumäärä ja vakioimaton kuolleisuus / 100 000 | GET + 16 solun POST onnistui | Hyvinvointialueiden kuolleisuustrendit. Ei ikä- eikä sukupuoliulottuvuutta. |
| Väestörakenne, **11re** | 1972–2025; 309 aluevalintaa, 102 ikävalintaa, 3 sukupuolivalintaa; väestö 31.12. | GET + 10 solun POST onnistui | Kuntien väestörakenne ja erikseen määriteltävien kohdeväestöjen suuruusluokka. |
| Paavo, **12ey_ja2026** | 2010–2024; 3 019 aluevalintaa, 24 väestörakennemuuttujaa; vuoden 2026 postinumeroaluejako | GET + 10 solun POST onnistui | Alueiden väestörakenteen konteksti; samaan perheeseen kuuluvat koulutus- ja tulotaulut jatkotutkimukseen. |
| Kansallinen terveysindeksi, **Sotkanet 5643/5644** | Metadatan mukaan 2017–2024; kunta, hyvinvointialue, yhteistyöalue, koko maa; ikävakioitu / vakioimaton syöpäindeksi | HTML-metatieto varmennettu; REST 403 | Ilmaantuvuuden suhteellinen aluekonteksti. Ei yksilöpolkujen eikä hoitoviiveen mittari. |

Luokkamäärät sisältävät kokonais- ja välisummia, eivät vain keskenään erillisiä havaintoluokkia. Primäärilähteet: [11be API](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px), [13u5 API](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px), [11re API](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/vaerak/11re.px), [Paavo 12ey API](https://pxdata.stat.fi/PxWeb/api/v1/en/Postinumeroalueittainen_avoin_tieto/2026/12ey_ja2026.px), [5643](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643), [5644](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644).

## Kuolemansyyt: varmennettu sisältö ja näyte

11be:n ICD-10-koodilla `C50` Suomen rintasyöpäkuolemia on 899 vuonna 2024 ja 907 vuonna 2025 (molemmat sukupuolet ja kaikki iät). `C18`-paksusuolisyöpäkuolemia on vastaavasti 928 ja 926. Samat C50-lukumäärät löytyvät 13u5:n luokasta `13`, mikä toimii kahden taulun pienenä sisäisen johdonmukaisuuden tarkistuksena. Molempien vastauksen `updated` on 29.10.2026 klo 06.00 UTC. Tämä on aineiston päivitysaika; omat latausajat ovat erillisessä lokissa. [11be-taulu](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/), [13u5-taulu](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/).

13u5:n kaikkien pahanlaatuisten kasvainten `04-21` (C00–C97) kuolemat ovat koko maassa 13 424 vuonna 2025 ja vakioimaton kuolleisuus 237,8 / 100 000. Helsingissä vastaavat luvut ovat 1 273 ja 184,7. Ero ei ole ikävakioitu, eikä se osoita hoidon laatua. Taulu käyttää vuoden 2026 aluejakoa koko aikasarjassa. Alueet sisältävät `SSS` (koko maa), `MA1` (Manner-Suomi), `HVA01`–`HVA21`, `HVA90` (Helsinki) sekä Ahvenanmaan kahdessa luokittelutasossa; näitä kaikkia ei saa laskea yhteen. Kuolleisuus perustuu asuinalueeseen, ei hoitopaikkaan. [13u5](https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/13u5.px/).

Kuolemansyyluokat vaativat tarkan rajauksen: 13u5:n `07` sisältää C18–C19, kun 11be-kokeen C18 ei sisällä C19:ää. 13u5:n `11` sisältää C32–C34 eli myös kurkunpään; `04-22` sisältää myös muita kuin pahanlaatuisia kasvaimia. 11be:n huomautukset ilmoittavat luokitusmuutoksia aikasarjassa. Kuolemansyy ei ole sama kuin kaikki potilaan aiemmat syöpädiagnoosit tai hoidon tulosmuuttuja ilman kohorttimäärittelyä. [11be-metadata](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px), [13u5-metadata](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px).

## Väestö ja alueavaimet

11re:n Helsingin koodi on `KU091`; esimerkiksi 60-vuotiaita miehiä on 3 819 ja naisia 4 169 vuoden 2024 lopussa. Metadatassa viimeinen vuosi on 2025, vaikka testi valittiin seulontavuoteen 2024 sopivaksi. Vastauksen päivitysaika on 1.4.2026. Ikä on täytetty ikä vuoden lopussa. Taulu soveltaa vuoden 2026 kuntajakoa takautuvasti; osakuntaliitosten käsittelyyn liittyy huomautus. [11re](https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/vaerak/11re.px).

**Liitosansaksi todettu:** 11re ja 13u5 käyttävät samaa sarakenimeä `alue_23_20260101`, mutta sisältävät eri koodistot (KU vs HVA). Sarakenimien yhtäläisyys ei takaa avainten yhteensopivuutta. Kunta–hyvinvointialue-vastaavuus on varmennettava samalle aluevuodelle. Vuoden lopun väestö ei myöskään ole automaattisesti seulontaan kutsuttujen nimittäjä tai kuolleisuusluvun käyttämä keskiväkiluku.

## Paavo: ajan, alueen ja suojauksen erottaminen

Vuoden **2026 julkaisuversion** väestötaulun uusin **tilastovuosi on 2024**, ja vastauksen päivitysaika on 26.1.2026. Postinumero `00100` palautti 18 492 asukasta, joista 8 758 miestä ja 9 734 naista; summat täsmäävät. `00230` palautti nollia, ei suojattuja arvoja. Etunollat säilytetään merkkijonoissa. Hakemistossa havaittiin myös koulutus `12ez_ja2026`, tulot `12f1_ja2026`, kotitaloudet `12f2_ja2026`, koonti `12f7_ja2026` ja kuntakoonti `12f8_ja2026`; näistä ei tässä tehty datalatausta. [Paavo-palvelu](https://stat.fi/en/services/statistical-data-services/statistical-databases/paavo), [2026-katalogi](https://pxdata.stat.fi/PxWeb/api/v1/en/Postinumeroalueittainen_avoin_tieto/2026).

Paavo-käsikirjan painetun sivun 2 (PDF-sivu 3) mukaan työpaikka- ja asuntoryhmien suojaraja on alle 10 ja muiden ryhmien alle 30; ryhmien kokonaismäärät eivät ole suojattuja. Suojatut arvot ovat PxWebissä `…` ja paikkatiedossa `-1`. Eri julkaisuvuosien alueluokituksia ei verrata sellaisenaan; nykyinen aikasarja käyttää viimeisintä luokitusta. Painetulla sivulla 4 (PDF-sivu 5) postinumero–kunta-avain määräytyy suurimman pinta-alaosuuden, ei väestöpainon mukaan. Noin prosentilta väestöstä puuttuu kohdentava koordinaatti. Paikkatiedon `vuosi` tarkoittaa julkaisuvuotta, PxWebin vuosi tilastovuotta. Molemmat sivut tarkastettiin myös renderöidyistä kuvista. [Vuoden 2026 virallinen käsikirja](https://media.stat.fi/A7H6ohk0S8qafyCM4bfDaz/cmlt4oevajb2g06uqeojdtq58).

Tulkinta: Paavon sosioekonomiset piirteet sopivat ekologiseen taustakuvaukseen. Postinumeroalueen tuloista ei voi päätellä yksittäisen syöpäpotilaan tuloja. Postinumeroiden summia ei pidä sellaisenaan pitää täsmällisinä kuntaväestöinä.

## Sotkanet: toiminnallinen tulkinta ja latausrajoite

5643 on ikävakioitu (epäsuora vakiointi viisivuotisikäryhmittäin), 5644 vakioimaton syöpäindeksi. Molempien metadata ilmoittaa vuosiksi 2017–2024 ja päivitykseksi 11.6.2026. Nimittäjänä on keskiväkiluku. Arvot perustuvat kolmen vuoden jaksoihin: vuoden 2024 havainto koskee siis vuosia 2022–2024. Koko maan viimeisimmän vuoden vertailutaso on 100; aiemmatkin indeksiarvot muuttuvat päivityksissä. [5643-metadata](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643), [5644-metadata](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644).

Indeksi kuvaa uusia tapauksia, pois lukien muut ihosyövät kuin melanooma. Rajaus sisältää myös D- ja N-koodeja: sitä ei tule nimetä pelkäksi C00–C97-kuormaksi tai verrata suoraan kuolemansyytaulun rajaukseen. Korkea arvo voi liittyä myös tehokkaaseen varhaisdiagnostiikkaan. Indeksi ei mittaa uusiutumista, hoitoviivettä tai syöpien erilaista kuolleisuutta. Se poikkeaa myös vanhan sairastavuusindeksin 0–79-vuotiaiden rajauksesta. [5643](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643), [5644](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5644).

Testit `/rest/1.1/indicators/5643`, `/5644`, `/regions` ja pienet vuosirajatut datahaut palauttivat 403. Tässä erässä ei varmennettu numeerisia arvoja, alue-ID:itä, RESTin palautusmuotoa eikä puuttuvuuskoodia. HTML-kuvaus ei yksin takaa automaattisen latauksen onnistumista. Seuraava rajattu tehtävä on kokeilla palvelun dokumentoitua latausta toisella tuetulla yhteystavalla ja tallentaa onnistunut vastaus; arvoja ei täydennetä arvaamalla.

## Lisenssi, puuttuvuus ja MVP-päätös

Tilastokeskuksen julkinen aineisto on lähtökohtaisesti CC BY 4.0 -lisensoitua; lähde, poiminta-aika ja tehdyt muokkaukset kirjataan. Sotkanetin metatietosivujen alatunnisteessa on CC BY 4.0. [Tilastokeskuksen käyttöehdot](https://stat.fi/fi/tietoa-meista/tutustu-tilastokeskukseen/lainsaadanto/kayttoehdot), [Sotkanet 5643](https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643).

11be:n selitteessä `...` merkitsee salattua ja `-` nollasuuruutta; 13u5:n `.` puuttuvaa. Näissä pienissä näytteissä JSON-stat2:n `status`-kenttää tai null-arvoja ei esiintynyt. Tämä ei osoita koko taulua täydelliseksi. Paavossa nolla, suojattu ja puuttuva on pidettävä erillään. Vastauksen omia huomautuksia ja `status`-koodeja on luettava jokaisella latauksella.

**MVP:ssä käytä 11re:tä väestökontekstiin ja 13u5:tä kuvailevaan kuolleisuustaustaan.** Näiden toimiva lataus on todettu. Seulonnan osallistumisnimittäjä otetaan seulontarekisteristä. Älä esitä 13u5:n vakioimattomia lukuja alueiden hoidon paremmuusjärjestyksenä. 11be:n kansalliset ikäsolut eivät täydennä 13u5:n puuttuvia alue–ikäsoluja, joten näiden yhdistelmä ei yksin mahdollista alueellista ikävakiointia. Paavo on jatkoanalyysin rikaste; Sotkanetin automaattinen poiminta jää teknisesti avoimeksi.

Kaikki näytteet, lähetetyt kyselyt, vastausten tarkistussummat ja tulkittu solujärjestys ovat tämän kansion `work`-alihakemistossa. Ks. [[Tekninen tarkistusloki]].
