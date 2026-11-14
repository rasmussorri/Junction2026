# D12 Avohilmo — ICD-10-diagnoosit alueittain

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.

Tarkistettu 14.11.2026. **Vahvistettu korjattu C50-poiminta.** Perhe: THL:n perusterveydenhuollon avohoidon hoitoilmoitustiedot. Julkaisija THL.

| Kenttä | Varmennettu sisältö ja raja |
|---|---|
| Lähde | [Avohilmon diagnoosiraportti](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06) |
| Havaintoyksikkö | Alue–vuosi–diagnoosi-aggregaatti; Asiakkaat on valittu mittari, ei tapahtumarivi |
| Koepoiminnan rajaus | C50 Rintasyöpä (`diagnoosi-121077`), Asiakkaat (`measure-87454`) |
| Ajallinen kattavuus | 2018–2026 ja Kaikki vuodet; 2026 kesken |
| Alueet | 26 alueluokkaa; mukana kokonais- ja erityisluokkia. Asuinalueen täsmällinen ajankohta vielä tarkistettava |
| Muut muuttujat | Palvelusektori, palvelumuoto ja ammatti metadatassa. Tässä kuutiossa ei havaittu ikää/sukupuolta |
| Stage, hoidot ja viive | Ei stagea, hoitosuunnitelmaa, peruutussyytä tai potilaan tapahtumaketjun aikaleimoja |
| Pääsy | Julkinen HTML/JSON ilman tunnistautumista; oikea koepoiminta onnistui |
| Lisenssi ja päivitys | CC BY 4.0 footerissa; 11.11.2026 |
| Otoksen rakenne | 26 × 10 luokkaa, 258 arvoa, kaksi puuttuvaa avainta |
| Yhdistely | Aluekoodi–vuosi–diagnoosimääritelmä; ei henkilötason linkitystä eikä suoraa nimittäjää seulonnalle |
| Työmäärä | Tekninen kuvaileva näkymä arviolta 2–4 h; kattavuuspoikkeaman selvitys erikseen |

**Korjattu, oikeasti testattu [JSON-pyyntö](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.json?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454).** Alkuperäisen kartoituksen pelkkä diagnoosisuodatin palautti HTTP 200 mutta tyhjän arvolistan. Vasta alueiden eksplisiittinen valinta riveille tuotti C50-asiakkaat. Tyhjä vastaus ei siis ollut nolla asiakasta.

Vuoden 2025 HTML-vertailut: Etelä-Karjala 169, Helsinki 1 288, Kaikki kunnat 12 926. Kaikki vuodet -kokonaismäärä 50 426 ei ole vuosien summa, koska sama asiakas voi esiintyä eri vuosina. Eri sektoreita tai alueita ei myöskään summata ennen laskentasääntöjen varmistamista.

**Sopii:** diagnoosilla kirjattujen asiakkaiden palvelukäytön ja raportoinnin vaihtelun kuvaamiseen. **Ei sovi:** uusien rintasyöpätapausten, hoitamattomien potilaiden, hoidon ajoituksen tai seulonnan vaikuttavuuden laskentaan. Kanta-Hämeen 1 267 → 347 asiakasta vuosina 2024–2025 synnyttää kattavuuskysymyksen; se ei osoita hoidon romahtamista.

Jatkotesti vertaa ensin muita diagnooseja ja sektorikohtaisia kattavuusmuutoksia. Pienlukusääntö jäi vahvistamatta, koska ohjesivu palautti 403. Tarkat lähdevastaukset ja laskenta: `06 Tekninen liite/THL jatkotarkistus`; [[THL - viivemittari ja korjatut poiminnat]].
