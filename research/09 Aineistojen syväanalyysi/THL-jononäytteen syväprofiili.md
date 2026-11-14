---
tila: osittain-vahvistettu
päivitetty: 2026-11-14
---
# THL-jononäytteen syväprofiili

**GO rajatulle tekniselle kokeelle:** syöpätautien erikoisalan hoitoa odottaneiden julkaistut lukumäärät. **Ehdollinen aluevertailu:** tyhjien solujen merkitys, palveluntuottajien kattavuus ja ajalliset organisaatiomuutokset pitää tarkistaa. **NO-GO tästä näytteestä:** diagnoosista hoitoon kuluvan ajan tai syövän kiireellisen hoidon arviointi. Näytteen oletusmittari on lukumäärä, ei viive.

## Rajaus saatiin varmennettua

[Suodatettu HTML](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne?filter=erikoisala-862186) näyttää valinnan **65 Syöpätaudit**. Sen latauslinkki lisää oletusmittarin **measure-738214**. [Mittarin kuvaus](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne/738214) nimeää sen Hoitoa odottaneet. [Dimensiot](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.dimensions.json) vahvistavat molemmat `sid`-tunnisteet.

Dimensioresurssin tiedostopääte on `.json`, mutta sisältö on JavaScript-kutsu `thl.pivot.loadDimensions([...])`. Se käsiteltiin tekstinä ja JSON-lista irrotettiin; JavaScriptiä ei suoritettu.

[Uusi eksplisiittinen pyyntö](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738214) palautti HTTP 200, ja `dataset` oli sama kuin aiempi näyte. Kaikki 2 200 HTML-solupaikkaa vastasivat JSON-arvoja tai avaimen puuttumista. Kolme erikseen tarkastettua solua 30.9.2026: Etelä-Karjala 9, Etelä-Pohjanmaa 13, Etelä-Savo 12.

## Rakenteellinen profiili ja rajoitukset

20 tuottajaluokkaa × 110 aikaluokkaa sisältää 1 444 eksplisiittistä merkkijonoarvoa ja 756 puuttuvaa avainta. Eksplisiittisiä null- tai nolla-arvoja ei löytynyt. Aika-akselilla on myös Kaikki ajankohdat, ja tuottajissa Kaikki hyvinvointialueet. Siksi 756/2 200 ei ole potilastiedon puuttuvuusaste eikä aineiston kattavuusmittari.

Viimeisellä päiväyksellä neljän tuottajan solu on tyhjä: Helsinki, Kainuu, Pirkanmaa ja Päijät-Häme. Ei ole osoitettu, tarkoittavatko nämä nollia, raportoimattomuutta vai rakenteellista puuttumista. Niitä ei saa korvata nollilla.

Dimensioista löytyvät myös odotusluokkien ja yli 90/180 päivän osuuksien mittarit. **Niiden datavastauksia ei tämän tarkistuksen aikana ladattu**, joten niitä ei vielä hyväksytä toteutuskelpoisen analyysin perustaksi. Yhteisavaimiksi seulontaan eivät riitä tuottajien nimet: esimerkiksi HUS ei ole yksi seulontaraportin asuinalue.
