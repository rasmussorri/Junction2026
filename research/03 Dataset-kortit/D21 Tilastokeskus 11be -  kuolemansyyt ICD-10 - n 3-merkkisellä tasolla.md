# D21 Tilastokeskus — kuolemansyyt 11be ja alueellinen rinnakkaistuote13u5

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.

Tarkistettu14.11.2026.

Omistaja/julkaisija Tilastokeskus. Perhe: kuolemansyytilasto. Havainto on taulukon aggregaattisolu, ei yksittäinen kuolintodistus.

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
