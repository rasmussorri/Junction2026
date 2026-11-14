---
id: T03
päivä: 2026-11-14
tila: onnistunut-koepoiminta
hypoteesit: [H01, H02]
---
# Seulontasovellus – vahvistettu CSV ja yhteisositus

**Tulos:** julkisesta [seulontasovelluksesta](https://tilastot.syoparekisteri.fi/seulonta/) ladattiin kaksi oikeaa CSV-tiedostoa, ei pelkkää sovellusrunkoa. Helsinki × naiset × vuosi × kutsuikä toimii rinta- ja kohdunkaulaseulonnassa. Sovelluksen [ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html), päivitetty 26.5.2026, määrittää tarjotulle aineistolle **CC BY 4.0** -lisenssin ja dokumentoi CSV/XLSX-viennin. Näiden sovellusperäisten näytteiden käyttöperuste on siten vahvistettu; erillisten staattisten raporttien lisenssiä ei tämän perusteella muuteta.

## Mitä todella ladattiin

| Ominaisuus | Rinta | Kohdunkaula |
|---|---|---|
| Aihe | Kutsut ja tarkastukset | Kutsut ja tarkastukset, ikäryhmäseulonta |
| Kiinteä alue/sukupuoli | Helsingin kaupunki / Naiset | Helsingin kaupunki / Naiset |
| Yhteiset ulottuvuudet | Kutsuvuosi 2010–2024 × kutsuikä | Kutsuvuosi 1991–2024 × kutsuikä |
| Ikäluokat | 50–51, 52–53, …, 68–69 | 25–29, 30–34, …, 65–69 |
| Havaintorivit | **150 = 15 × 10** | **306 = 34 × 9** |
| Tiedoston koko | 9 402 tavua | 20 099 tavua |
| Duplikaattiavain | 0 | 0 |
| Epänumeerinen arvo puuttuvana | 0 tässä näytteessä | 0 tässä näytteessä |

Sarakkeet ovat kutsuvuosi, kutsuikä, kohdeväestö, rekisteröity kohdeväestö, rekisteröity kohdeväestö %, kutsuttu, peittävyys väestöstä %, tarkastettu ja tarkastettu kutsutuista %. Erotin on puolipiste ja desimaalierotin pilkku. CSV palauttaa suuremman numeerisen tarkkuuden kuin näytön kahden desimaalin esitys. Se ei lisää havaintojen mittaustarkkuutta.

**Olennainen metatieto:** yhden alueen CSV ei sisällä sarakkeissa ohjelmaa, aluetta, sukupuolta eikä kutsutyyppiä. Nämä on säilytetty `koepoiminnan_profiili.json`-tiedoston valintametadatassa ja johdettujen JSONien `provenance`-osassa. Pelkän CSV:n siirtäminen ilman tätä tietoa hukkaisi havaintoyksikön. ”Kutsuikä” on luokkana kaksi-/viisivuotinen, vaikka staattinen raportti nimeää kutsuiän yksittäisenä parillisena/viidellä jaollisena ikänä.

## Toteutunut käyttöliittymätesti

14.11.2026 natiivin Chromen vierasikkuna avasi sovelluksen ilman kirjautumista. Valittiin ohjelma → kutsut ja tarkastukset → naiset → Helsingin kaupunki → **Kutsuvuosi ja Kutsuikä** → Näytä → Taulukko → Pitkä taulu → CSV. Kummankin latauksen valmis-tila näkyi selaimessa ja paikalliset tiedostot avattiin. Tämä ratkaisi aiemman yrityksen selainliitännän saatavuusrajan; sovellus ei ollut viallinen.

Rinnan valittavat mittariperheet olivat kutsut/tarkastukset, testitulokset ja histologiset löydökset. Kohdunkaulassa näistä kustakin oli erikseen ikä- ja riskiryhmä, yhteensä kuusi perhettä. Ohjelmavalinnassa olivat **vain rinta ja kohdunkaula**. Viiveteemaa ei havaittu näissä avatuissa valikoissa. Tämä ei ole väite kaikista mahdollisista julkaisijan järjestelmistä, mutta tämän sovelluksen julkisesti havaitut valinnat eivät ratkaise suoliston H01-yhteisositusta tai viiveiden numerovientiä.

Download-linkki oli istuntokohtainen `/seulonta/session/{session_id}/download/download_csv?w=`. Sama linkki tuotti eri valinnan tiedoston tilan muuttuessa. Sitä ei dokumentoida pysyvänä API-osoitteena eikä tulevassa ajossa toisteta vanhan istunnon tunnuksella. Toistaminen tehdään yllä olevilla UI-valinnoilla; seuraavassa toteutuksessa voidaan selvittää palvelun dokumentoitu koneellinen toimitus.

## Laatu, vertailu ja uusi havainto

Kaikki **456 osallistumisprosenttia** täsmäsivät suhteeseen 100 × tarkastettu/kutsuttu toleranssilla 10⁻⁹ prosenttiyksikköä. Kummastakin tiedostosta kolme käyttöliittymästä luettua lukumääräsolua täsmäsi CSV:hen. Molempien vuosi–ikäruudukko on täydellinen tässä valinnassa; se ei todista kaikkien muiden alueiden kattavuutta.

Vuoden 2024 rinnan ikärivien summa on **28 686/38 630 = 74,2583 %**, täsmälleen sama osoittaja ja nimittäjä kuin staattisen raportin Helsinki-rivillä. Kohdunkaulan vähintään 30-vuotiaiden summa on **27 514/38 382 = 71,6846 %**, myös sama kuin staattisessa raportissa. Kohdunkaulan 25–29-vuotiaiden 3 499 osallistunutta ja 5 375 kutsuttua on jätettävä tämän vertailun ulkopuolelle. Kaikki viisi kohdunkaulan vuosien 2020–2024 kontrollisummaa täsmäsivät; rinnassa neljä vuotta täsmäsi, mutta vuoden 2021 CSV:ssä on **yksi kutsuttu ja yksi tarkastettu enemmän** kuin staattisessa raportissa. Eron syytä ei ratkaistu: vaihtoehtoja ovat versioero, laskentarajaus tai korjaus. Älä pakota lähteitä identtisiksi.

Lisäksi rinnassa 78/150 ja kohdunkaulassa 80/306 rivillä kutsuttujen N ylittää rekisteröidyn kohdeväestön N:n, mutta julkaistu peittävyys on 100 %. Tämä on laskennallinen havainto. Ohjeessa rinnan peittävyys käsittelee kahden vuoden kierrosta ja rekisteröity kohdeväestö tarkoittaa tietoja toimittaneiden kuntien kohdeväestöä. Siksi peittävyyttä ei voi korvata yksinkertaisesti jokaisen rivin kutsutut/kohdeväestö-suhteella ilman laskentasääntöä. Osallistumisen nimittäjä on tässä vientitiedostossa yksiselitteisesti kutsutut.

## Vaikutus tutkimustavoitteisiin ja MVP:hen

**H01 suolisto:** pysyy ratkaisematta. Suolistoa eikä alue × ikä × sukupuoli × edellinen tulos -yhteisositusta ole tässä sovelluksessa osoitettu.

**H02/rinta:** saatavuus on edennyt erillisistä marginaaleista aidosti testattuun aluekohtaisen vuosi–ikätaulukon vientiin. Seuraava falsifioitava tavoite: hanki sama yhteisositus kaikille 22 vertailualueelle, laske vuoden 2024 osallistuminen yhteisillä ikäpainoilla ja testaa, pysyykö Helsingin aiemmin havaittu alin sijoitus. Vasta jos alueaineisto läpäisee summakontrollit ja ikäluokkien vertailun, tulosta voidaan pitää ikärakenteesta riippumattomana kuvailevana erona. Tulokseen eivät sisälly yksilötason taustat eikä kausaalinen selitys.

**MVP-suosituksen tarkennus:** sovelluksesta ladattuun rintaseulonnan osallistumiseen perustuva prototyyppi on nyt käyttöoikeuden ja yhden toimivan vientireitin osalta GO. Tässä erässä ladattu data koskee yhtä aluetta; valtakunnallinen aluevertailu vaatii muun aluejoukon viennin, metadataan kirjattavan rajauksen ja samat tarkistukset. Alkuperäisen datan lähde, sovelluksen päivityspäivä, latauspäivä ja muutosten kuvaus säilytetään CC BY -attribuutiossa. Tämä ei avaa yksilödataa eikä viiveitä.

Raaka-CSV:t ovat `work/`-kansiossa. `work/profile_exports.py` toistaa poiminnan jälkeiset laskut offline; `koepoiminnan_profiili.json` sisältää valinnat, SHA-256:t, ajankohdat, laatu- ja vertailutulokset. Johdetut JSON-tiedostot säilyttävät alkuperäiset soluarvot ja kontekstin. Lisenssiohjeen tarkka HTML-versio on `work/seulonta_help_license_snapshot.html`.
