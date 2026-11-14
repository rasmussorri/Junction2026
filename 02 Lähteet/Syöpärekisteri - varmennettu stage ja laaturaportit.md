# Syöpärekisteri — varmennettu stage ja laaturaportit

Tarkistettu 14.11.2026. **Vahvistettu:** [syöpätilastosovelluksesta](https://tilastot.syoparekisteri.fi/syovat/) ladattiin CSV: koko maa, miehet ja naiset, kaikki syövät, levinneisyys 2020–2024, todettujen syöpien lukumäärä. Kolme luokkaa ovat **tuntematon, paikallinen, ei paikallinen**. Näitä ei saa nimetä TNM I–IV -vaiheiksi. CSV sisältää kuusi riviä ja myös ilmaantuvuussuhteet; taulukon näytössä valittu mittari ei rajaa CSV:tä vain yhteen numerokenttään.

[Ohjeen](https://tilastot.syoparekisteri.fi/syovat/help_main_fi.html) mukaan aineisto on CC BY 4.0, lukumäärät 1–4 salataan, ja vuosien alkukattavuus vaihtelee syöpätyypeittäin. Sovelluksessa vahvistettu 2024 lopullisena ja 2025 ennakkotietona. Ohjeen datapäiväys on 2.4.2026, sovellusversio 2026-04-22-001.

**Tekninen rajoite:** CSV:n sarakkeet eivät sisällä valittua vuotta, aluetta tai syöpäryhmää, kun ne ovat kiinteät valinnat. Siksi mukana pitää kulkea valintojen sivutiedosto. Session latausosoite ei ole pysyvä API. Testi ja raaka CSV: `06 Tekninen liite/Syöpärekisteri/stage_sample_metadata.json` ja `stage_2020_2024_sample.csv`.

## Vuosiraportti ja kattavuus

[Vuosiraportin 2024](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html) taulukko 5.1 antaa kiinteiden kasvainten stage-tiedon kattavuuden 13 285 / 31 731 = 41,9 %, puuttuvia 18 446 = 58,1 %. Teksti sanoo ristiriitaisesti 59,1 %. **Oma tarkistus:** taulukon luvut summautuvat oikein; tekstin prosenttia ei pidä käyttää. Raportti rajaa pois mm. keskushermosto- ja hematologiset kasvaimet sekä DCO-tapaukset. Tämä kattavuus ei ole sama mittari kuin sovelluksen kaikkien syöpien vuosien 2020–2024 karkea levinneisyysjakauma.

## Keuhkosyövän laaturaportti

[Raportti](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html) yhdistää Syöpärekisterin ja Hilmon: 14 873 uutta C33–C34-tapausta 2019–2023, seuranta enintään 12 kuukautta ja viimeistään 2024 loppuun. Taulukko 4 sisältää levinneisyystiedon **luokitustavan/kattavuuden**, ei stage I–IV -jakaumaa. Taulukoissa 5–11 ovat käynnit, toimenpiteet, hoitomuodot ja aluetietoja. Luokat voivat olla päällekkäisiä. Alue perustuu diagnoosivuoden alun kotikuntaan. Avohilmo puuttuu. Ilman hoitokirjausta jääminen ei osoita hoitamatta jäämistä; MDT-koodit eivät kata kaikkia neuvotteluja.

**Saatavuuden raja:** molemmat HTML-raportit luettiin verkkotyökalulla, mutta suora Python-lataus palautti 403. Niiden koneellista taulukkovientiä ei siis testattu onnistuneeksi. Syöpätilastosovelluksen CSV puolestaan ladattiin aidosti. Laaturaportin erillistä lisenssiä ei varmennettu sovelluksen lisenssistä.

## Seuraava tutkimustavoite

**Päätelmä:** vaiheisiin liittyvän MVP:n on näytettävä tuntemattomien osuus näkyvästi. Seuraavaksi tarvitaan syöpäkohtainen ja aluekohtainen sama 2020–2024-poiminta sekä luokituksen määritelmä. Karkean ei-paikallisen osuutta ei yhdistetä seulontaan myöhäisen diagnoosin syyvaikutuksena. Laaturaportin näennäinen hoitomuoto–eloonjäämisyhteys kärsii hoitovalikoitumisesta ja ennuste-eroista.
