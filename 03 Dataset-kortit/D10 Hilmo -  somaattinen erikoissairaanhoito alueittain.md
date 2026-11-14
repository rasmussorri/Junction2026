# D10 Hilmo — somaattinen erikoissairaanhoito alueittain

> Lopullinen tarkistettu ja täydennetty kortti sisältyy raporttiin [[Junction 2026 - syöpädata ja MVP]]. Tämä erillinen muistiinpano säilyttää kokoamista edeltäneen tarkistustilanteen.

Tarkistettu 14.11.2026. **Vahvistettu tietotuote ja oikea pieni poiminta; osa vertailumääritelmistä avoin.** Perhe: THL:n terveydenhuollon hoitoilmoitusrekisteri. Omistaja/julkaisija: THL.

| Kenttä | Varmennettu sisältö ja raja |
|---|---|
| Lähde | [Julkinen pivot-raportti](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j?filter=speciality-17958) |
| Havaintoyksikkö | Alue–vuosi-aggregaatti valitulla erikoisalalla ja mittarilla; ei potilasrivi |
| Koepoiminnan kohortti | Erikoisala 65 Syöpätaudit (`speciality-17958`), Kaikki potilaat (`measure-17881`) |
| Aika | Varsinaiset vuodet 2015–2025; mukana tekninen Kaikki vuodet -luokka, jonka solut tyhjät |
| Alueet | 26 luokkaa: alueet, Helsinki, Ahvenanmaa sekä kokonais-/tuntematon-/ulkomaatluokkia. Asuinalueen ja luokituksen ajankohdan täsmennys vielä kesken |
| Muut ulottuvuudet | Metadata: päädiagnoosi, ikä, sukupuoli. Kaikkia yhteispoimintoja ei testattu |
| Mittarit | Potilaat, hoitojaksot, avohoitokäynnit ja hoitoaika löytyvät metadatasta; tässä testattu potilasmäärä |
| Stage ja aikaleimat | Ei TNM-ulottuvuutta tai yksilöllisiä diagnoosi–hoito-päiviä tarkistetussa avoimessa kuutiossa |
| Pääsy ja formaatti | Julkinen HTML ja JSON; pieni GET onnistui ilman tunnistautumista |
| Lisenssi ja tuoreus | Raportin footer: CC BY 4.0; päivitys 11.8.2026 |
| Otoksen laatu | 26 × 12 mahdollista solua, 286 arvoa, 26 tyhjää kokonaisvuoden solua; ei prosenttina rekisterin puuttuvuudesta |
| Yhdistelyavain | Aluekoodi, vuosi ja valittu kohortti; kokonaisluokat erotettava. Nimi tai sama vuosi ei yksin riitä |
| Soveltuvuus | Palvelukäytön ja sen raportoinnin kuvaus; pieni poiminta ja kuvaaja noin 2–4 h arviolta |

**Todellinen testattu pyyntö:** [JSON, syöpätautien potilaat](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.json?row=area-2079&column=time-6656&filter=speciality-17958&filter=measure-17881). Vuoden 2025 Koko maa 74 504, Helsinki 9 327 ja Kainuu 288 täsmäsivät HTML-soluihin. Tarkka HTTP-loki, raakavastaus, dimensiot ja tarkistus: `06 Tekninen liite/THL jatkotarkistus`.

**Mitä voi päätellä:** kuinka paljon potilaita raportin määrittelemällä syöpätautien erikoisalalla on kirjattu vuosittain. **Mitä ei:** kaikkien syöpäpotilaiden määrä, syövän ilmaantuvuus, jonotuksen kesto tai toteutumatta jäänyt hoito. Syöpähoitoja tehdään myös muilla erikoisaloilla. Hoitojakson keskimääräinen kesto ei ole hoidon aloitusviive. Avoimesta aggregaatista ei linkitetä potilaita seulontatulokseen.

Ennen aluevertailun julkaisemista varmista aluemääritelmä, tuottajien kattavuusmuutokset ja pienlukusäännöt. Tuntemattomia/ulkomaisia/koko maan luokkia ei summata alueriveihin. Viikonlopun lisänäkymä on mahdollinen, mutta tämä ei yksin vastaa projektin tärkeimpiin hoitopolkuviivekysymyksiin. [[THL - viivemittari ja korjatut poiminnat]].
