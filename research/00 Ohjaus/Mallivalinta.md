# Nykyinen käyttäjän valinta

Käyttäjä ilmoitti 14.11.2026 valinneensa GPT-6.1 Sol / medium. Tämä syrjäyttää alla olevan aiemman Astra-suosituksen. Jatkuva rinnakkaistutkimus keskeytettiin kiintiön vuoksi; seuraava työ rajataan yhden agentin raporttikoosteeksi tallennetusta näytöstä. Katso [[Kiintiötauko ja jatko]].

---

# Mallivalinta tutkimussilmukkaan

Arvioitu 14.11.2026. **Suositus on työkuormaan perustuva arvio, ei tämän aineiston vertailukokeen tulos.**

## Suositus

Laajennetun, itse uusia tutkimuskysymyksiä muodostavan silmukan päämallisuositus: **GPT-6 Astra, reasoning high**. Nykyinen chat käyttää jo Astraa; reasoning-asetusta ei muutettu työkalulla. Rutiinipoiminnat, metadatan muotoilu ja toistettavien laskentojen valmistelu: **GPT-6.1 Sol, reasoning high**, jos erillinen työnjako myöhemmin otetaan käyttöön. High-taso on suositus, ei mitattu optimi.

Perustelu: käyttäjän lisäämä avoin hypoteesinmuodostus, vaihtoehtoisten selitysten arviointi ja seuraavien tavoitteiden valinta painottavat harkintaa enemmän kuin pelkkä lähdekatalogin täyttäminen. Siksi päämallisuositus on tässä laajennetussa tehtävässä Astra. Sol pysyy kustannustietoisena vaihtoehtona ja rutiinityön mallina, kun parivertailu osoittaa laadun riittäväksi.

OpenAI kuvaa Solia monimutkaisiin tehtäviin sopivaksi malliksi, jolla on Astraa pienempi kustannus. Astra on valmistajan kyvykkäin vaihtoehto vaativaan tutkimukseen ja dokumenttien tuottamiseen. Molempien dokumentaatio ilmoittaa verkkohakujen, työkalukutsujen ja rakenteisten tulosteiden tuen. [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra).

| Malli | Rooli tässä työssä — arvio | Rajoite |
|---|---|---|
| GPT-6.1 Sol | Rutiinityö: lähteet, metadata, tekniset kokeet, kortit | Vaatii saman evidenssikontrollin kuin Astra; ei kliinistä luotettavuustakuuta |
| GPT-6 Astra | Adaptiivisen silmukan ohjaus, hypoteesit, ristiriidat, loppusynteesi | Valmistajan mukaan Solia kalliimpi; tarkkaa tämän ajon kustannusta ei tiedetä |
| GPT-6.1 Terra | Visuaalisten raporttien ja käyttöliittymien tulkinta tarvittaessa | Ei osoitettua etua tämän tutkimussilmukan päämalliksi |
| GPT-6 Luna | Rajattu luokittelu ja metatietojen muotoilu tarkistettavasta aineistosta | Ei valita itsenäiseen lääketieteellisen aineiston tulkintaan ilman arviointia |

Terra- ja Luna-roolit perustuvat [virallisen malliluettelon](https://developers.openai.com/api/docs/models) kuvauksiin, eivät paikallisiin nopeus- tai laatumittauksiin. Mallit näkyivät myös paikallisessa Codex-malliluettelossa 14.11.; tämä ei takaa rajatonta tilikiintiötä.

## Nyt luotu ajastus

Ajastus on **tämän chatin heartbeat**, ei uusi API-ohjelma. Chatissa käytössä on GPT-6 Astra. Heartbeat-luontityökalun tarjottu rakenne ei sisältänyt erillistä model/reasoning-valintaa, eikä niitä muutettu. Asetuksista ei siis saa väittää, että Sol/high olisi jo käytössä. Suositeltu mallijako on tulevan erillisen toteutuksen valinta; tämä yöajo jatkaa nykyisen chatin asetuksilla.

API-hintoja ei muunneta Codex-tilauksen kuluiksi. Tilin jäljellä olevaa kiintiötä, nopeutta tai yön kokonaishintaa ei tarkistettu. Ajastus ei vaadi projektin .env-tiedoston lukemista tai uuden API-integraation rakentamista.

## Hyväksymiskoe ennen mallin vaihtoa

Aja Solilla ja Astralla samat 6 tehtävää samoista tallennetuista lähdeotoksista: (1) seulonnan nimittäjä, (2) viivekuvan ja numerodatan ero, (3) THL-suodattimen todellinen sisältö, (4) stage-puuttuvuus, (5) käyttöehtojen erottelu ja (6) ristiriitaisen alue–vuosi-yhdistelyn hylkääminen. Pisteytä lähdeuskollisuus, epävarmuuden ilmaisu, testien toistettavuus ja virheellisten kliinisten päätelmien puuttuminen. Mittaa kesto ja käytettävissä oleva todellinen käyttökustannus.

Ehdotettu portti: ei yhtään sepitettyä muuttujaa, lataustestiä tai lähdeviitettä; kaikki 6 kriittistä tulkintaa oikein; tekniset poiminnat toistettavia. Valitse halvempi malli vasta, kun se läpäisee portin. Tätä parivertailua ei ole vielä ajettu.

## Ajastuksen käyttöedellytys

Paikallisia tiedostoja käyttävässä ajastuksessa koneen on oltava päällä ja sovelluksen käynnissä. [Virallinen ajastusohje](https://developers.openai.com/codex/app/automations). Määräaika on tallennettu sekä ajastukseen että tutkimusohjeeseen; tämä ei ole käyttökatkoilta suojattu palvelinajo.
