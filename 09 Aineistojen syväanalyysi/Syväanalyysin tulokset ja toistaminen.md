# Syväanalyysin tulokset ja toistaminen

14.11.2026 tarkistettu kolme olemassa olevaa aineistonäytettä. Tämä täydentää ensivarmennuksia, eikä korvaa dataset-korttien lisenssi- ja kattavuustarkistuksia.

| Näyte | Tekninen käyttö | Ratkaistu | Vielä avoin |
|---|---|---|---|
| Suolistoseulonta | GO osallistumislukujen prototyyppiin | 34 oikeaa taulukkoa; solut, summat ja osuuslaskut | Kolonoskopiaotsikon nimittäjä; viiveiden numerot; käyttöehdot |
| Rintaseulonta | GO osallistumislukujen prototyyppiin | 61 oikeaa taulukkoa; solut, summat ja osuuslaskut | Ahvenanmaan ajallinen kattavuus; viiveiden numerot; käyttöehdot |
| THL-jono | GO lukumäärän tekniseen kokeeseen; aluevertailu ehdollinen | Erikoisala 862186 ja mittari 738214; HTML/JSON-vastaavuus | Tyhjien solujen merkitys; kattavuus; muut mittarit |

Lue [[Seulontanäytteiden syväprofiili]] ja [[THL-jononäytteen syväprofiili]]. Kaikki GO-päätökset koskevat nimettyä rajausta; eivät yksilöiden hoitopolkuja tai syy-seurausväitteitä.

- `aineistoprofiilit.json`: tiivis koneellinen profiili, tarkistusnäytteet ja testiyhteenvedot.
- `work/tarkistukset_yksityiskohtaiset.json`: kaikki 633 osuuslaskua ja tulokset.
- `work/lataustestit.json`: uudet THL-pyynnöt, tiedostokoot ja SHA-256-tunnisteet. Tarkka pyyntökohtainen kellonaika ei tallentunut; tarkistuspäivä tallennettiin.
- `work/thl_filtered.html`, `thl_dimensions.json`, `thl_measure.html`, `thl_explicit.json`: uudet lähdevastaukset.
- `work/profile_samples.py`: paikallinen uusittava profiili. Ei verkko-operaatioita; lukee tallennetut lähteet ja tuottaa profiilit uudelleen.

Toista projektihakemistosta:

```sh
python3 '09 Aineistojen syväanalyysi/work/profile_samples.py'
```

Tarkistus ei ratkaise automaattisesti monitasoisten taulukko-otsikoiden merkitystä. Suoliston otsikkoristiriita on tästä konkreettinen esimerkki. Tietojen puuttumisen, suojaamisen tai julkaisematta jättämisen erottelu tarvitsee julkaisijan määritelmät.
