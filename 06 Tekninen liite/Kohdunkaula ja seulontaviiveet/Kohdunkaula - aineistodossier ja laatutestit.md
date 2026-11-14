---
id: T02
päivä: 2026-11-14
status: varmennettu-rajattu-otos
perhe: seulontarekisterit
---
# Kohdunkaula – aineistodossier ja laatutestit

**Päätös:** GO julkisten osallistumis-, tulos- ja löydösaggregaat­tien poimintaan. CONDITIONAL täsmälliseen viivevertailuun: kuvat ovat saatavilla, lukuarvojen vientiä ei ole vahvistettu. NO-GO päätelmälle, että jatkotutkimustiedon puuttuminen osoittaisi tutkimuksen jääneen tekemättä.

## Lähde ja tekninen näyttö

Suomen Syöpärekisterin [Kohdunkaulasyövän seulontaohjelma: vuositilasto](https://stats.cancerregistry.fi/joukkistilastot/kohtu.html), julkaisu 20.5.2026. Oikea suomenkielinen osoite päättyy **kohtu.html**. [Englanninkielinen versio](https://stats.cancerregistry.fi/joukkistilastot/cervix.html) toimii; arvattu `kohdunkaula.html` antoi 404:n. Suomenkielinen tiedosto saatiin 14.11.2026 klo 01.38 Suomen aikaa: HTTP 200, 10 197 651 tavua, `text/html`; SHA-256 `275e967bd2c9e38455f21261fa15d88e8ea9407cc67f01d282044463ac58f5b7`. Tarkat pyynnöt ovat `work/download_manifest.json`-tiedostossa.

HTML:ssä on **126 todellista taulukkoa**. JavaScriptin sisäisten mallien `<table>`-tekstien laskeminen antaisi väärän määrän. Kaksi erillistä jäsentäjää tuotti samat taulukot ja jokaisen solun. Kolme käsin tarkistettua solua: 2024 ikäryhmäseulonta / 30-vuotiaat / osallistuneet 23 907; riskiryhmäseulonta / 30–34-vuotiaat / kutsutut 2 442; ikäryhmäseulonta / yhteensä / kolposkopiassa käyneet 2 071. Raakateksti, taulukkopoiminta ja tarkistustulokset säilytettiin.

## Todellinen sisältö ja havaintoyksikkö

Taulukko on julkaistu aggregaatti, ei henkilön hoitopolku. Laskentaan on luokiteltu henkilön seulontakierroksen vakavin löydös. Ryhmät on säilytettävä: **ikäryhmäseulonta ja riskiryhmäseulonta ovat eri populaatioita**. Kansallinen ikäryhmätaulukko sisältää iät 30, 35, …, 65; riskiryhmätaulukko luokat 30–34, …, 65–69. Raportti kertoo myös joidenkin kuntien 25-vuotiaiden kutsuista, mutta nämä eivät muodosta päätaulukon 30–65-vuotiaiden lukua.

| Taulukkoperhe | Taulukoita | Todelliset muuttujat |
|---|---:|---|
| Koko maa | 30 | Seulontaketju, tulokset, histologia; ikä ja kutsutyyppi |
| Väestöryhmät | 15 | Äidinkieli, koulutus, syntymäalue; kukin erillinen marginaali |
| Yhteistyöalueet | 30 | Ketju, tulokset, histologia; ikä-/riskiryhmä |
| Hyvinvointialueet | 30 | Samat kolme perhettä ja kaksi kutsutyyppiä |
| Testimenetelmä | 20 | HPV/Papa × tulokset/histologia × kutsutyyppi |
| Syövän havaitsemistapa | 1 | Rekistereitä yhdistävä 2020–2024 yhteenveto |

Ketjun kentät: kutsutut N; osallistuneet N ja % kutsutuista; riskiryhmäseulontasuositus N ja % osallistuneista; kolposkopialähete N ja % osallistuneista; kirjattu kolposkopia N ja % lähetteen saaneista; HSIL+ N ja % kolposkopiassa käyneistä. Tulosperheessä lisäksi normaali, ei tulkittavissa/tieto puuttuu, HPV-testatut ja HPV-positiiviset; viimeisen osuuden nimittäjä on HPV-testatut. Histologia sisältää kohdunkaulan syövän, AIS:n, HSIL:n, LSIL:n, normaalin/hyvänlaatuisen, muu/ei tietoa ja ei tietoa jatkotutkimuksista. HSIL+ yhdistää HSIL:n, AIS:n ja syövän; sitä ei saa nimetä pelkäksi syöpäluvuksi.

Vuositaulukot kattavat **2020–2024**, löydöksiä raportoitu kevääseen 2026. Interaktiivisten trendikuvien historia on pitempi, mutta sitä ei ole tässä validoitu pitkittäisaineistoksi. Vuoden 2024 aluetiedoissa on **23 aluetta: 21 hyvinvointialuetta, Helsinki ja Ahvenanmaa**. Samaa 22 alueen listaa kuin suolisto-/rintavertailussa ei saa käyttää huomaamatta. Vuoden 2020 riskiryhmäseulonnan alueketjusta puuttuvat Keski-Uusimaa, Länsi-Uusimaa ja Vantaa ja Kerava; siinä on vain 20 alue­riviä. Puuttuvaa riviä ei muuteta nollaksi. Osallistumiskartta on erikseen kunnittain vuodelta 2024.

## Nimittäjät, laatumerkinnät ja testit

Vuodesta 2020 kaikki kutsua varten **poimitut** tulkitaan kutsutuiksi, vaikka todellinen lähetettyjen kutsujen määrä voi erota. Osallistumisaste kuvaa tätä ilmoitettua nimittäjää. Kolposkopialähete sisältää myös tuloksen, joka edellyttää lähetettä. Kolposkopiakäynti edellyttää sekä toteutunutta käyntiä että tiedon toimittamista rekisteriin; kattavuutta on saatu noin vuodesta 2022.

Vuoden 2024 ikäryhmäseulonnassa osallistuneet/kutsutut = 206 337/280 812 (73,5 %), kirjattu kolposkopia/lähete = 2 071/2 445 (84,7 %) ja HSIL+/kirjattu kolposkopia = 796/2 071 (38,4 %). Riskiryhmäseulonnassa vastaavat ovat 9 341/11 298 (82,7 %), 3 517/4 132 (85,1 %) ja 695/3 517 (19,8 %). Histologiataulukoissa ilman jatkotutkimustietoa ovat 374/2 445 ja 615/4 132. Nämä ovat raportoitua tietotilannetta, eivät vahvistettuja tekemättömiä tutkimuksia.

**Toistettavat tarkistukset:** 2 310 ketju-/väestöryhmäprosentin laskuyritystä; 2 291 määriteltyä suhdetta täsmää julkaistuun yhden desimaalin prosenttiin ±0,05 prosenttiyksikön sisällä, nolla virhettä. Loput 19 ovat nollanimittäjän suhteita. Kaikki 270 testattua lukumäärän summausta täsmäävät. Tämä on sisäinen laskutarkistus, ei osoitus rekisterin täydellisyydestä.

Kaikkien taulukoiden numeerisissa soluissa havaittiin 105 pitkää ajatusviivaa `–` ja kaksi `--`-merkkiä. Nollanimittäjät selittävät ketjutaulukoiden 19 ajatusviivaa; muiden perheiden merkit säilytetään erittelemättä oletettuna peittona. `--` esiintyy seulontaikää nuorempien/vanhempien sarakkeessa ”seulontaikäisten syövistä” ja on rakenteisesti soveltumaton. Erillistä pienlukusuojauksen kynnystä ei vahvistettu. Koulutuksessa perusaste ja tuntematon on yhdistetty, kielessä muu ja puuttuva; niitä ei saa käsitellä puhtaana koulutus- tai kielierona.

## Tulkinta ja seuraava rajattu kysymys

Aineisto vastaa siihen, miten osallistuminen, kirjattu jatkotutkimus ja löydösluokat jakautuvat julkaistuissa ryhmissä. Se ei yhdistä avointa yksilöpolkua myöhempään hoitoon, lääkkeisiin, haittoihin, eloonjäämiseen tai todelliseen hoitoon pääsemättömyyteen. Seulonnan ulkopuolinen testaus ei sisälly tavallisiin seulontalöydöstaulukoihin. Havaitsemistapaluokittelu yhdistää syöpärekisterin ja seulontarekisterin, mutta on erillinen 2020–2024 aggregaatti.

**Jatkotutkimustavoite:** selvitä, kuinka suuri osa vuoden 2024 korkeammasta ”ei tietoa jatkotutkimuksista” -osuudesta poistuu saman vuosikohortin myöhemmässä rekisteriversiossa. Kilpailevat selitykset: raportoinnin täydentyminen, seuranta-ajan pituus, testimenetelmän/ryhmien muutos tai todellinen polun muutos. Tarvitaan versionseuranta ja alue × kutsutyyppi × menetelmä -määrät sekä ajankohdan laskentasäännöt; nykyinen havainto ei ratkaise selitystä.

## Käyttö, yhdistely ja toistettavuus

HTML on ilman kirjautumista luettavissa ja paikallisesti poimittu. Seulontasovelluksen [ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html) dokumentoi CSV/XLSX-viennin ja CC BY 4.0:n. Tämä ei yksin varmista erillisen staattisen raportin lisenssiä eikä viivearvojen vientiä. Lisenssin soveltamisala on varmistettava ennen laajaa edelleenjakelua.

Liitosavaimet: ohjelma, kutsutyyppi, kutsuvuosi, aluetaso, alueen nimi/erikseen tarkistettu koodi, ikäluokka, muuttuja ja nimittäjä. Väestöryhmien marginaaleista ei voi rakentaa puuttuvaa alue × ikä × koulutus -ristiintaulukkoa. Taulukossa ei ole avointa henkilötunnusta. Henkilötason yhdistäminen vaatii erillisen luvan ja aineistotoimituksen, ei viikonlopun avoimen datan toteutusta.

Aja `python3 '06 Tekninen liite/Kohdunkaula ja seulontaviiveet/work/audit_screening.py'` vaultin juuresta. Tulos: `kohdunkaula_taulukot.json`, `saatavuusprofiilit.json`, yksityiskohtaiset laskut `work/arithmetic_checks.json`. Viiveiden erillinen tekninen päätös on [[Seulontaviiveet - numeroviennin saatavuustesti]].

Myöhemmässä erässä tehtiin myös onnistunut kohdunkaulan sovellus-CSV-koepoiminta ja vahvistettiin sen CC BY 4.0 -käyttöperuste; ks. [[Seulontasovellus - vahvistettu CSV ja yhteisositus]]. Staattisen raportin oma lisenssikysymys ja viivenumerot pysyvät erillisinä.
