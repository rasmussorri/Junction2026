---
tila: osittain-vahvistettu
tarkistettu: 2026-11-14
perhe: THL-hoitoonpaasy
---
# THL erikoissairaanhoidon jonot – ensivarmennus

**Vahvistettu:** [THL:n kuvaus](https://thl.fi/data-ja-tilastot/hoitoon-paasy/erikoissairaanhoito) rajaa tietokantaraportit julkiseen kiireettömään erikoissairaanhoitoon. Kuukausitiedot voivat tarkentua. Hoidon tarpeen arvioinnin kirjaamistavat eroavat alueittain. Tämä ei ole kaikkien syöpäpotilaiden diagnoosista hoitoon -viiveaineisto.

**Teknisesti vahvistettu:** [lähdemuistion suodatettu JSON-osoite](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?filter=erikoisala-862186) palautti HTTP 200 ja `dataset`-olion. Tuloksessa on tuottaja- ja ajankohtaulottuvuudet. [[Ensivarmennusten tekninen loki]] sisältää vastauksen ja tarkistussumman.

**Tarkistamatta:** suodattimen 862186 merkitys nykyisessä metadatassa ja oletusmittari. HTTP 200 ei yksin todista oikeaa syöpärajausta! Tarvitaan mittari- ja erikoisalametadatan sekä vähintään yhden selaimessa näkyvän solun vertailu ennen analyysiä.

**Päätelmä:** sopii palvelujärjestelmän taustakuvaukseen, kun rajaus vahvistetaan. Puuttuva solu ei osoita nollaa eikä puuttuvaa hoitoa. Tuottaja ei automaattisesti tarkoita potilaan asuinaluetta.

## Jatkotarkistus

Tämän ensimmäisen muistion jälkeen aineistoille tehdään syväanalyysi kansiossa `09 Aineistojen syväanalyysi`. Käytä viimeisintä profiilia yhdessä tämän lähdekuvauksen kanssa.

## Ratkaistu myöhemmässä syväanalyysissä

Erikoisala 862186 = 65 Syöpätaudit ja oletusmittari 738214 = Hoitoa odottaneet vahvistettiin HTML-näkymästä ja dimensioista. Eksplisiittinen suodatus palautti saman aineiston. Katso [[THL-jononäytteen syväprofiili]]. Aiempi 'tarkistamatta' tätä tunnisteparia koskeva merkintä on siten ratkaistu; puuttuvien solujen merkitys on edelleen avoin.
