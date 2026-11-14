# Tekninen tarkistusloki

Tarkistukset tehty 14.11.2026 Suomen aikaa. Lokin UTC-ajat ovat 13.11.2026 klo 23 jälkeen.

## HTTP-pyynnöt

| Tiedostonimi/avain | Metodi | UTC-aika | Tulos | Tavua | SHA-256 |
|---|---|---|---|---:|---|
| 11be_meta | GET | 2026-11-13T23:37:12.687911+00:00 | 200 | 93453 | 100b2baf7acd5df332fdba3f0bedb3d7a98aa499f4e239eb67cb077b8b0f8ba8 |
| 13u5_meta | GET | 2026-11-13T23:37:13.073899+00:00 | 200 | 6496 | c294d9f1db6de67f184c9a69f0dc1d918422697d7ac20c661171d7a320e889d7 |
| sotka5643_meta | GET | 2026-11-13T23:37:13.360143+00:00 | HTTP Error 403: Forbidden | — | — |
| sotka5644_meta | GET | 2026-11-13T23:37:13.588951+00:00 | HTTP Error 403: Forbidden | — | — |
| sotka_regions | GET | 2026-11-13T23:37:13.703402+00:00 | HTTP Error 403: Forbidden | — | — |
| 11be_sample | POST | 2026-11-13T23:37:50.212811+00:00 | 200 | 4269 | c63a006a60770c14893ef621e5f53db26ffc525470ce8bf860b13b0772f567e5 |
| 13u5_sample | POST | 2026-11-13T23:37:50.443580+00:00 | 200 | 3224 | 2fc5b5f6b598e704b40e9b1cafd41eb8d8838a6592ee8611853e847872e6b96a |
| vaerak_catalog | GET | 2026-11-13T23:37:50.606648+00:00 | 200 | 4614 | 9637af6a0d2e21bab28475efcca873b1e795b16a4fd574f86db3a73285aaafc0 |
| paavo_catalog | GET | 2026-11-13T23:37:50.942601+00:00 | 200 | 752 | 0c52f61c8d8eb4912658f6588f4cba2d6cc1ea75ecd86273b26055ac3e4f0813 |
| sotka5643_sample | GET | 2026-11-13T23:37:51.075291+00:00 | HTTP Error 403: Forbidden | — | — |
| sotka5644_sample | GET | 2026-11-13T23:37:51.188737+00:00 | HTTP Error 403: Forbidden | — | — |
| 11re_meta | GET | 2026-11-13T23:38:10.336558+00:00 | 200 | 8280 | e2ceae6c3f74452f29181cc040551ad448c4b06f96a6661acaa44a120b8a6266 |
| paavo2026_catalog | GET | 2026-11-13T23:38:10.559899+00:00 | 200 | 1255 | 3fbf0bed2531512a6f130a60c339a59baeaac21ac864c6eebf9210b26e7c7dd4 |
| 11re_sample | POST | 2026-11-13T23:38:36.015797+00:00 | 200 | 3112 | 22c81d3bd046c5a572f49b653b4b5e245befb09e6b3950e88f5d36ed04bb0739 |
| paavo12ey_meta | GET | 2026-11-13T23:38:36.393189+00:00 | 200 | 121523 | bc4202b92f8bf1aa894e0caa593c4264c6fb607bc09346969052ace473e80376 |
| paavo12ey_sample | POST | 2026-11-13T23:39:21.270781+00:00 | 200 | 4916 | cd57e56e0e4f432c7bb45ead590653e65811f71d20e7ea47c30868712a3aa4ab |
| paavo_manual2026 | GET | 2026-11-13T23:39:38.887864+00:00 | 200 | 634188 | be9485a311e65e54815cd173669d81b44393fa5c251cdb072742de7fb3cf77dc |

URL:t ovat koneellisesti tiedostossa `work/request_log.json`. Epäonnistuneista vastauksista ei tallennettu sivusisältöä; HTTP-virhe ja aikaleima tallennettiin. Onnistuneet metadatavastaukset ja datanäytteet tallennettiin raakabitteinä.

## Kyselyt ja toisto

Jokaisen POST-kokeen tarkka JSON-runko on tiedostossa `<taulu>_sample_query.json`. Käytä sitä vastaavaan API-osoitteeseen POSTina, otsakkeella `Content-Type: application/json`. GET samaan osoitteeseen palauttaa muuttujat ja sallitut koodit. Näytteet käyttivät `response.format = json-stat2`.

Todettu tärkeä parserivaatimus: palvelin palautti 11be:n syyt järjestyksessä C18, C50 vaikka pyyntö luetteli C50, C18. Solujen merkitys on purettava palautetun `id`, `size` ja `dimension.*.category.index` -rakenteen perusteella, ei kyselyn arvojärjestyksestä. `work/decoded_samples.json` sisältää jokaisen 40 solun koodit, nimet, arvon ja statuksen.

## Suoritetut johdonmukaisuustarkistukset

- 11be:n ja 13u5:n C50-lukumäärät täsmäsivät vuosina 2024 ja 2025.
- Paavo 00100: miesten ja naisten määrä summautui kokonaismääräksi 18 492. Sama lasku toimi nollariville 00230.
- Näiden tulokset ovat `work/validation_checks.json`. Näytteet eivät ole kattava aineiston laadun arvio.

## PDF:n visuaalinen tarkistus

Paavo 2026 -käsikirja ladattiin viralliselta media.stat.fi-palvelimelta (PDF, 634 188 tavua). Painettu sivu 2 = PDF-sivu 3; painettu sivu 4 = PDF-sivu 5. Molemmat renderöitiin `pdftoppm`-ohjelmalla ja avattiin kuvina. Visuaalisesti tarkistettiin suojarajat, suojauksen esitystapa, aluevuoden/tilastovuoden ero, pinta-alaperusteinen kunta-avain ja koordinaattipuutteiden kuvaus.

## Päivämääräerojen hallinta

Tallenna erikseen latausaika, datavastauksen `updated`, tilastovuosi ja alueluokituksen vuosi. API-hakemistojen `updated` ei aina vastaa yksittäisen datataulun päivitysaikaa. Tässä Paavon 2026-hakemiston päivitys oli marraskuussa, mutta 12ey-vastauksen päivitys tammikuussa ja viimeinen tilastovuosi 2024.

## Web-metadatan varmistus

Sotkanetin HTML-kuvaukset 5643/5644 luettiin primäärisivuilta 14.11.2026. Niistä tallennetut tulkinnat ja suorat lähdelinkit ovat aineistomuistiossa; näiden HTML-sivujen raakabittejä ei tallennettu. API-403-lokia ei pidä tulkita todisteeksi, ettei aineisto olisi julkinen. Se osoittaa tämän yhteystavan kokeen epäonnistumisen.
