---
tila: testattu
päivä: 2026-11-14
---
# Ensivarmennusten tekninen loki

Testit 14.11.2026 noin klo 01.16 Europe/Helsinki. Pythonin `urllib.request.urlopen` teki aidot GET-pyynnöt julkisiin osoitteisiin. Vastaukset tallennettiin tämän muistiinpanon kansioon. Testien URL, UTC-aikaleima, koko, HTTP-status, sisältötyyppi ja SHA-256 ovat `*_test.json`-tiedostoissa. Verkkolukijan THL-JSON-avaus epäonnistui, mutta suora Python-lataus onnistui; nämä ovat eri havaintoja.

| Testi | Tulos | Tallenne |
|---|---|---|
| [Suolistoseulonta](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html) | HTTP 200, HTML, 7 368 210 tavua | `suolisto.html`, `suolisto_test.json` |
| [Rintaseulonta](https://stats.cancerregistry.fi/joukkistilastot/rinta.html) | HTTP 200, HTML, 8 662 680 tavua | `rinta.html`, `rinta_test.json` |
| [THL suodatettu jono](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?filter=erikoisala-862186) | HTTP 200, JSON, 25 154 tavua | `thl_eshjono.json`, `thl_eshjono_test.json` |
| [THL kokoelman metadata](https://sampo.thl.fi/pivot/prod/api/eshjono/jonotilanne.json) | HTTP 200, 288 tavua; updated 2026-10-19 | `thl_eshjono_metadata.json` |

## Havaitut rakenteet

Seulontaraporteista poimittiin Pythonin HTMLParserilla 34 suolisto- ja 61 rintataulukkoa tiedostoihin `suolisto_tables.json` ja `rinta_tables.json`. Jokainen sisältää `headings`-polun sekä `rows`-solut. Ensimmäiset kaksi riviä voivat muodostaa monitasoisen otsikon: poiminta ei ratkaise colspan/rivilaajennuksia. Sisältö on tekstimuotoista, desimaalipilkku säilyy. Tämä on paikallinen johdettu aineisto, ei julkaisijan JSON-rajapinta.

Alkuperäisessä muistiossa mainitut indeksit 24 ja 50 on tarkistettava suhteessa käytettyyn poimintatiedostoon; älä käytä niitä sokkona laskennassa. Viipeet löytyvät kuvalohkoista; tällä testillä ei vahvistettu niiden lukuarvoja.

THL-vastaus: `dataset.dimension.id = ["tuottaja", "ajankohta"]`, `size = [20, 110]`. `value` on harva avain–arvo-olio, 1 444 tallennettua arvoa, ei täydellinen 2 200 solun lista. Arvot ovat merkkijonoja. Ajankohtiin kuuluvat 31.12.2007–30.9.2026 sekä aggregaattivalinta Kaikki ajankohdat. Puuttuvia indeksejä ei muuteta nolliksi. Valitun erikoisalan ja oletusmittarin merkitys odottaa lisävarmennusta.

## Seuraavat testit

1. Varmista THL:n dimensioiden tunnisteista erikoisala 862186 ja oletusmittari; tee eksplisiittinen alue–aika–mittari–erikoisala-kysely.
2. Tarkista HTML-otsikot ja vähintään kolme poimittua seulontasolua lähdenäkymää vastaan ennen laskentaa.
3. Selvitä viivekuvien numerolähde. Älä digitoi kuvaa ja esitä tuloksia alkuperäisenä tarkkana datana.
4. Varmista lisenssit erikseen. Julkinen lataus ei yksin vahvista uudelleenkäyttöehtoja.

Esimerkkilatauksen toistaminen (Python 3):

```python
from urllib.request import urlopen
import json
url = "https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?filter=erikoisala-862186"
with urlopen(url, timeout=30) as response:
    assert response.status == 200
    payload = json.load(response)
assert payload["dataset"]["dimension"]["id"] == ["tuottaja", "ajankohta"]
```

Yllä oleva pyyntö on testattu; esitetty assert-versio dokumentoi testin rakennetta. Testaamattomat jatkokyselyt eivät ole toimiviksi vahvistettuja.

## Oikaisu syväanalyysin perusteella

Ensimmäinen lukumäärä 39/66 sisälsi viisi JavaScript-mallineissa esiintyvää table-merkkijonoa kummastakin HTML-tiedostosta. Varsinaisia poimittuja datataulukoita on 34/61. Katso kansion `09 Aineistojen syväanalyysi` tarkistukset. Tämä on rakenteen laskentatavan korjaus, ei julkaisijan aineiston muutos.
