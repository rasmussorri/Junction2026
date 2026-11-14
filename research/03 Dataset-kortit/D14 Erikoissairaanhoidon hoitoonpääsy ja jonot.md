# D14 Erikoissairaanhoidon hoitoonpääsy ja jonot

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.

Tarkistettu 14.11.2026. **Vahvistettu rajattu jonotilanteen numeropoiminta.** Perhe: THL:n julkisen kiireettömän erikoissairaanhoidon hoitoonpääsytilasto. Tämä on oma keruu/tietotuote; sitä ei rinnasteta Hilmon kaikkiin hoitotapahtumiin.

| Kenttä | Varmennettu sisältö ja raja |
|---|---|
| Lähde | [Jonotilanne](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne), [THL:n tilastokuvaus](https://thl.fi/data-ja-tilastot/hoitoon-paasy/erikoissairaanhoito) |
| Kohortti | Erikoisala 65 Syöpätaudit, tunniste 862186; kiireettömän hoidon jonossa mittaushetkellä olevat |
| Mittarit | Kaikki odottajat 738214; yli 180 vrk odottaneet 738216; heidän osuutensa 738217; 1–90 vrk määrä 738218 |
| Aika | 110 ajankohtaluokkaa koepoiminnassa; uusin havaittu 30.9.2026. Ei henkilön diagnoosipäivä |
| Alue | 20 tuottajaluokkaa mukaan lukien julkaistu kokonaisrivi. Tuottaja ei automaattisesti ole potilaan asuinalue |
| Syöpä/stage | Erikoisala, ei yksittäinen syöpädiagnoosi tai TNM |
| Pääsy | HTML ja JSON ilman tunnistautumista, useita pieniä mittarikohtaisia GET-hakuja testattu |
| Lisenssi | THL:n raporttijakelun käyttöehto tarkistettava nimenomaan tästä tuotteesta ennen uudelleenjulkaisua; Hilmon footer ei yksin kata tätä tuotetta |
| Havaittu laatu | 2 200 mahdollista solua; 1 444 eksplisiittistä arvoa ja 756 puuttuvaa avainta per mittari. Ajanjaksot ja organisaatiot vaihtelevat |
| Viivemääritelmä | Jonossa vietetyn ajan luokka; täsmällinen alkutapahtuma keruuohjeesta vielä auki |
| Yhdistely | Tuottaja–mittauspäivä–erikoisala–mittari. Ei suoraa asuinalue–vuosi-liitosta seulontaan |
| Työmäärä | Rajattu nykyhetken näkymä arviolta 2–4 h; historialliset vertailut vaativat organisaatiokartoituksen |

**Testattu [yli 180 vrk osuus JSON:na](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738217).** Lukumäärä saadaan vaihtamalla viimeiseksi mittariksi 738216. Kaikki 1 444 vertailukelpoista osuutta täsmäsivät kaavaan 100 × yli180 / kaikki_odottaneet yhden desimaalin pyöristystarkkuudella. Tässä lukumäärä-/osuusaineistossa 1 117 eksplisiittistä nollaa; niitä ei sekoiteta puuttuviin avaimiin.

Syyskuu 2026: julkaistu kokonaisrivi 486 odottajaa, joista kaksi yli 180 vrk eli 0,4 %. Satakunta 2/8 eli 25 %. Pieni nimittäjä on näytettävä osuuden rinnalla. Helsinki, Kainuu, Pirkanmaa ja Päijät-Häme olivat näytteen viimeisessä ajankohdassa tyhjiä. Kokonaisrivi ei todista niiden täydellistä kattavuutta.

**Sopii:** tietyn erikoisalan kiireettömän jonon tilanteen kuvaamiseen. **Ei sovi:** kaikkien syöpäpotilaiden diagnoosi–hoito-mediaaniviiveeseen, kiireelliseen hoitoon, peruttuihin aikoihin tai hoidon laatujärjestykseen. Yli 180 vrk ei tässä ole osoitettu syöpäkohtaiseksi tavoiteajaksi. Jonossa olevien poikkileikkaus painottuu pitkiin odotuksiin; se ei ole hoidettujen potilaiden viivejakauma.

Tekninen toistettavuus, alkuperäiset solut ja lähdemääritelmät: [[THL - viivemittari ja korjatut poiminnat]], `06 Tekninen liite/THL jatkotarkistus`. MVP-portissa jäljellä täsmällinen odotusajan alku ja tämän tuotteen käyttöehdon vahvistus.
