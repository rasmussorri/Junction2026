# Kelan rintasyövän korvausoikeudet — vuoden 2025 syväprofiili

**Todellinen täydellinen rajattu poiminta:** korvausoikeuskoodi 115, vuosi 2025. DataStore palautti 486 riviä ja ilmoitti täsmälleen 486 vastaavaa riviä; kokonaismäärä ei ollut arvio. Tämä on koko rajauksen julkaistu aggregaatti, ei koko korvausoikeusrekisteri. Poiminta mahtui yhteen pieneen JSON-vastaukseen. [Alkuperäinen aineistokuvaus](https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet), [CKAN-paketti ja lisenssi](https://avoindata.suomi.fi/data/api/3/action/package_show?id=70832958-f7b6-4e09-8350-615362e6ee30).

Avain aika × alue × ikäryhmä × sukupuoli × korvausoikeuskoodi oli yksikäsitteinen kaikilla 486 rivillä. Aikaisemman riippumattoman, eri järjestyksessä tehdyn kymmenen rivin kyselyn kaikki kentät täsmäsivät tähän poimintaan. Molemmat kyselyt ovat samasta julkaisuresurssista; tämä on poiminnan johdonmukaisuuden tarkistus, ei riippumaton epidemiologinen vahvistus.

| Ominaisuus | Havainto |
|---|---:|
| Aluekoodeja | 24: 21 hyvinvointialuetta, Helsinki, Ahvenanmaa, Tuntematon (00) |
| Havaittuja ikäluokkia | 17: 20–24:stä 95–99:ään ja 100– |
| Sukupuolia | 2 |
| Havaittujen luokkien mahdollinen ristikko | 816 yhdistelmää |
| Julkaistuja rivejä | 486 |
| Puuttuvia mittariarvoja julkaistuissa riveissä | 0 |
| Vuoden aikana voimassa -mittarin nollia | 0 |
| Alkaneiden oikeuksien nollia | 138 |
| Kuolemaan päättyneiden oikeuksien nollia | 220 |
| Vuoden lopussa voimassa -mittarin nollia | 14 |
| Testattujen sisältyvyysehtojen rikkomuksia | 0 |

**Olennainen ero:** nolla mittarikentässä, puuttuva rivi ja tuntematon asuinalue ovat kolme eri asiaa. Kaikki julkaistut rivit sisältävät vähintään yhden vuoden aikana voimassa olleen oikeuden, mutta tästä ei vielä päätellä, että puuttuvat 330 havaitun luokkajoukon yhdistelmää olisivat varmasti nollia. Myös kokonaan puuttuvat alle 20-vuotiaiden luokat osoittavat, ettei havaituista luokista laskettu 816 ole koko mahdollisen väestön universumi. Julkaisun nollarivien/suojauksen sääntö pitää vahvistaa ennen täyden ruudukon luomista.

Sisältyvyystestissä koko vuoden voimassa, vuoden lopussa voimassa, alkaneet ja kuolemaan päättyneet eivät ylittäneet samassa solussa vuoden aikana voimassa olleita. Tämä ei ole tapahtumien taseyhtälö: vuoden alun varanto, muut päättymissyyt ja peräkkäisten jaksojen yhdistely puuttuvat. Näitä viittä mittaria ei summata henkilömääräksi. Julkaisijan mukaan saman koodin peräkkäisiä oikeusjaksoja yhdistetään korkeintaan 90 vuorokauden katkolla. Oikeus ei tarkoita lääkeostoa tai toteutunutta hoitoa.

**Päätelmä analyysille:** julkaistujen solujen ikä- ja aluerakenteen kuvaus on teknisesti mahdollinen. Väestösuhteutus, alueiden kokonaismäärät ja aikasarjamuutos edellyttävät vielä julkaisematta jäävien yhdistelmien sääntöä, saman koodin ajallista määritelmää sekä yhtenäisiä alueita. Ikäluokkien alustavat summat ovat `profile.json`-tiedostossa tarkistusta varten; niitä ei vielä esitetä valtakunnallisina henkilömäärinä.

**Uusi rajattu tutkimuskysymys, odotusjonossa:** jättääkö DataStore julkaisusta pois kaikki nollarivit, vai sisältyykö poisjättöihin suojausta tai kattavuuseroja? Kilpailevat selitykset on erotettava metadatasta ja julkaisijan toisesta aggregaattituotteesta. Hyväksyttävä testi vertaa saman vuoden/koodin julkaistua kokonaislukua laskettuun solusummaan ja tarkistaa nollarivisäännön; summien yhtäpitävyys yksin ei selvitä salauksen käytäntöä. Tämä ei vielä muuta neljän aktiivisen hypoteesin prioriteetteja.

Toistettavuus: `python3 work/profile_kela_rights.py` käyttää tallennetta; `--refresh` tekee saman rajatun verkkopyynnön. `request_log.json` säilyttää tarkan URL:n, ajan, HTTP-tilan, koon ja SHA-256:n. `rights115_2025.json` on alkuperäinen vastaus ja `profile.json` tarkistustulos. Skripti keskeyttää, jos rajaus, rivimäärä tai avainten yksikäsitteisyys muuttuu.
