# Löydetyn aineiston syväanalyysi

Tavoite on siirtyä lähdeluettelosta todelliseen aineiston ymmärtämiseen. Käyttäjä lisäsi tämän vaiheen 14.11.2026. Pelkkä toimiva URL tai muuttujan nimi ei riitä MVP-suositukseksi.

## Milloin vaihe käynnistyy?

Kun uusi julkinen aineisto on ladattu ja vaikuttaa hyödylliseltä, lisää se syväanalyysijonoon. Valitse ensin seulonnan osallistuminen ja viiveet, sitten THL:n syöpätautien jonodata ja stage-/laaturaportit. Tutki vain tarpeellinen pieni otos; kerro rajaus ja vältä koko tietokannan imurointia.

## Jokaisen ehdokkaan tarkistus

1. **Alkuperä ja havaintoyksikkö:** rekisteri, tietotuote, poimintahetki, vuodet, yksikkö, lähdetiedoston SHA-256. Erottele lähteen julkaisu ja omat johdetut tiedostot.
2. **Rakenne:** kenttäluettelo, tyypit, luokat, yksiköt, avaimet, otsikkotasot ja kokonaisrivit. JSON-statissa varmista ulottuvuusjärjestys, indeksit sekä harva/arvovektori; HTML:ssa colspan/rowspan.
3. **Sisältö:** laske otoksen rivit ja uniikit luokat, puuttuvat kentät, salausmerkit, duplikaatit, vuodet ja alueet. Nimeä nämä otoksen, ei koko rekisterin ominaisuuksiksi.
4. **Määritelmät:** lue muuttujien kuvaukset. Tarkista viiveen alkutapahtuma ja lopputapahtuma, seuranta-aika, nimittäjä ja poissulut. Älä päättele sisältöä pelkästä teknisestä kenttänimestä.
5. **Toistettavuus:** tallenna pieni poimintakoodi ja syötteen tarkistussumma. Vertaa vähintään kolmea solua alkuperäiseen HTML-taulukkoon, PDF-sivuun tai dokumentoituun lähdenäkymään. Näytä täsmällinen sijainti.
6. **Sisäiset tarkistukset:** osuus = osoittaja/nimittäjä, kokonaisrivit, pyöristys, mahdottomat arvot. Älä summaa päällekkäisiä ikä-/alue-/sukupuoliryhmiä. Merkitse ristiriita, älä korjaa julkaisijan lukua hiljaisesti.
7. **Yhdistelykoe:** vain jos kaksi aineistoa todella on käytettävissä. Raportoi avainten uniikkius, yhteiset alueet/vuodet, match-osuus, rivimäärä ennen/jälkeen ja mahdollinen monesta moneen -liitos. Tarkista aluereformit sekä tuottaja vs. asuinalue.
8. **Pieni laskenta:** laske vain vahvistetusta otoksesta järkevä kuvaileva mittari. Näytä kaava ja nimittäjä. Erota oma laskelma julkaisijan raportoidusta luvusta. Epävarmuusvälit vain perusteltuna, ei oletusarvoisesti hallinnollisiin kokonaisaineistoihin.
9. **Mitä ei voi päätellä:** kirjaaminen vs. toteuma, kiireetön vs. kaikki hoito, aggregaatti vs. potilas, korrelaatio vs. kausaliteetti.
10. **Päätös:** jatka / vaatii selvitystä / hylkää MVP:stä, perusteluna tarkistettava näyttö ja seuraava kysymys.

## Tulosteet

Jokaisesta ehdokkaasta muistiinpano tähän kansioon, koneellinen profiili (JSON), tarvittaessa pieni johdettu taulukko ja toistettava laskenta. Päivitä dataset-kortin sekä raportin väitteet vasta tulosten perusteella. Näytä epäonnistuneet kokeet teknisessä liitteessä. Kolme toteutuskelpoista analyysiä vaatii tämän portin läpäisyn niiden välttämättömiltä aineistoilta.

## Priorisointi ja lopetus

Syväanalyysi kilpailee uusien lähteiden etsimisen kanssa: käytä vähintään joka toinen varsinainen tutkimuskierros jo löydettyjen lupaavien aineistojen tutkimiseen, kun niitä on jonossa. Koko lähdeperhekattavuus pitää silti saavuttaa. Klo 15.11.07.00 jälkeen tehdään vain raportin kannalta välttämättömät tarkistukset ja viimeistely. Sama määräaika 15.11.2026 klo 08.00 koskee tätä vaihetta.
