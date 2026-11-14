# Adaptiivinen tutkimus — löydöksestä uuteen kysymykseen

Käyttäjän 14.11.2026 lisäys: aineistoja ei vain kartoita ja validoi, vaan niistä etsitään kuvioita ja havaintojen perusteella asetetaan uusia tutkimustavoitteita. Tämä täydentää [[Syväanalyysin työohje]]-vaihetta. Kaikki päätelmät koskevat aineiston sallimaa aggregaattitasoa.

## Tutkimussykli

**Havaitse → keksi kilpailevat selitykset → määritä erottava testi → hanki puuttuva näyttö → testaa → päivitä kysymykset.**

1. Lue tutkimusjono, viimeisin hypoteesirekisteri ja aiempien testien tulokset. Älä aloita joka kerta tyhjästä.
2. Valitse oikea aineisto kysymykseen. Tarkista ensin havaintoyksikkö, määritelmät, nimittäjät, puuttuvuus ja alue-/aikavertailukelpoisuus. Avoin kuvaileva analyysi on sallittu, mutta sen epävarmuus kirjataan.
3. Tee aidot laskelmat: osallistumisprosentit, prosenttiyksikköerot, trendit, alueiden järjestyksen pysyvyys, poikkeavat muutokset, ohjelmien mahdolliset yhteiset aluekuviot. Käytä erillisiä kuvauksia, jos yhteistä vertailukelpoista avainta ei ole. Käytä tarvittaessa kuvaajaa, joka ei peitä nimittäjiä ja puuttuvuutta.
4. Tallenna löydös tarkkoine lukuineen, nimittäjineen, vuosineen, vertailujoukkoineen ja lähde-/koodiviitteineen. Kerro, montako aluetta, vuotta, mittaria ja vertailua käytiin läpi. Älä luo tuloksia muistin tai nimien perusteella.
5. Muodosta kustakin lupaavasta löydöksestä vähintään kaksi kilpailevaa selitystä. Esimerkki: palvelujen saatavuus vs. väestön ikä-/kielirakenne vs. ohjelman muuttunut kohdeväestö vs. raportointimuutos. Mukaan kuuluu myös mahdollisuus, ettei kuvio ole vertailukelpoinen tai pysyvä.
6. Luo testattava seuraava tavoite: täsmällinen kysymys, mitä tulosta pidettäisiin selitystä tukevana/heikentävänä, mitä aineistoa tarvitaan, testimenetelmä, odotettu päätösvaikutus ja toteutettavuus ennen määräaikaa. Tavoite ei saa olla vain 'tutki lisää'.
7. Suorita korkean arvon testi. Jos näyttöä puuttuu, etsi ensisijaisesti siihen tarvittava uusi tietotuote tai muuttuja. Jos sitä ei ole julkisesti saatavana, tallenna rajaus ja siirry seuraavaan kysymykseen.
8. Päivitä hypoteesin tila: **avoin / tutkittavana / kuvaileva tuki / heikentynyt / ei arvioitavissa / ristiriitainen**. Kuvaileva tuki ei tarkoita vahvistettua syy-yhteyttä.
9. Luo tai priorisoi uudelleen 1–3 seuraavaa tutkimustehtävää. Lisää tehtävät myös pääjonoon H-tunnuksilla, jotta seuraava ajastettu kierros poimii ne.
10. Päivitä raportti ja MVP vain näytön sallimissa rajoissa. Kirjaa myös epäonnistuneet selitykset ja nollatulokset; älä etsi rajattomasti vain kiinnostavaa signaalia.

## Priorisointi

Arvioi tavoitteen vaikutus MVP-valintaan, nykyinen epävarmuus, saatavilla olevan lisänäytön arvo ja työn määrä. Ensisijaisia ovat kysymykset, joihin yksi pieni julkinen poiminta voi vastata. Pidä kerralla enintään 5 aktiivista hypoteesia. Uusi tieto voi muuttaa järjestystä; vanhaa tavoitetta ei poisteta jäljettömiin.

Joka kierros saa luoda uusia tavoitteita löydösten perusteella, mutta alkuperäisen raportin kattavuus ja määräaika säilyvät. Viimeistään 15.11. klo 06.00 uusien sivupolkujen avaaminen lopetetaan. Klo 07.00 alkaen vain tärkeimpien väitteiden tarkistukset ja raportin viimeistely, viimeinen toimitus klo 08.00 Europe/Helsinki.

## Menetelmälliset rajat

- Pidä löytävä ja vahvistava analyysi erillään. Samalla datalla löydetty ja testattu kuvio ei ole riippumaton vahvistus. Käytä toista vuotta tai lähdettä, jos se on aidosti vertailukelpoinen; muuten nimeä toiston rajoite.
- Älä sovita monimutkaista mallia pienelle aluejoukolle vain saadaksesi selityksen. Jos regressio on perusteltu, ilmoita otoskoko, muuttujavalinnat, riippuvuus, puuttuvuus ja herkkyystarkistukset. Ei automaattista kausaalitulkintaa.
- Älä raportoi kaikkien läpikäytyjen vertailujen suurinta eroa 'merkittävänä' ilman monivertailun huomioimista. Kuvailevat erot ja järjestykset ovat yleensä parempi ensiaskel kuin p-arvojen etsiminen.
- Aggregaattien kokonaisluvut eivät ole yksinkertainen satunnaisotos; vältä perusteettomia luottamusvälejä ja näennäistä tarkkuutta.
- Yhdistä alueita vain perustellulla avaimella. Hoitopaikka ei ole asuinalue. Kahden ohjelman samanniminen alue ei tarkoita samaa kohdeväestöä.
- Suolistoseulonnan laajeneminen ja rintaseulonnan Ahvenanmaan kattavuusmuutos voivat vaikuttaa trendeihin. Tarkista kohortit ennen selityksiä.
- Lääketieteelliset vaikutusväitteet tarvitsevat omaa primäärinäyttöä. Alueellinen osallistumisero on havainto, ei osoitus puutteellisesta hoidosta.

## Hypoteesikortti

Jokaisesta tavoitteesta: tunnus, havainto, lähde, luokitus (havainto/päätelmä), kysymys, kilpailevat selitykset, tarvittavat tiedot, testi, tukeva/heikentävä tulos, prioriteetti, tila, tehdyt testit, seuraava askel. Koneellinen versio: `hypoteesit.json`; luettava versio ja löydökset tässä kansiossa.
