# D16 Sotkanet — syöpäindeksi 5643 / 5644

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.

Tarkistettu14.11.2026.

Omistaja/julkaisija THL, Kansallinen terveysindeksi; syöpäkomponentin tiedot Syöpärekisteristä. Tämä on rekisteritiedon jalostettu indikaattori, ei itsenäinen potilasaineisto.

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
