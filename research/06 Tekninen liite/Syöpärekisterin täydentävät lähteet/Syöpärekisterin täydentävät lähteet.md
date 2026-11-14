---
checked: 2026-11-14
status: julkinen metadata ja myelooman numeropoiminta varmennettu
covers: [D05, D08, D09]
---
# Syöpärekisterin täydentävät lähteet

Tässä tarkistuksessa varmistettiin kliinisten ilmoitusten mittarin määritelmä, poimittiin myelooman laaturaportin julkiset numerotaulukot ja avattiin tutkimusaineistojen muuttujakatalogi sen julkisesta JSON-rajapinnasta. Raportit, metatiedot ja yksilötason rekisteriaineistot pidetään erillisinä tuotteina.

## D05 — kliinisten ilmoitusten kattavuus

[Julkinen kuvaus](https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/) ohjaa [tilastosovellukseen](https://tilastot.syoparekisteri.fi/syopalaatu/). Sovelluksen HTML palautui HTTP 200. Sen kuvauksen perusteella aikajakso on **2000–2025**, viimeinen vuosi ennakollinen. Valittavana on 10 syöpäryhmää sekä niiden yhdistelmä. Aluevalintoja on 24 hyvinvointialuenäkymässä (sisältää koko maan ja Ahvenanmaan) ja 7 yhteistyöaluenäkymässä. Nämä eivät ole keskenään erillisiä summattavia alueita. Yhdistelmä tarkoittaa sovelluksessa lueteltuja syöpäryhmiä, ei automaattisesti kaikkia ICD-10:n pahanlaatuisia kasvaimia.

**Nimittäjänä ovat rekisteröidyt syöpätapaukset, osoittajana tapaukset, joista on kliininen ilmoitus.** Mittari ei ole kaikkien todellisten syöpien rekisteröintikattavuus eikä hoidettujen osuus. Kliinisen ilmoituksen puuttuminen ei todista hoidon puuttumista. [Sovellus](https://tilastot.syoparekisteri.fi/syopalaatu/).

Kliiniset ilmoitukset ovat keskeisiä levinneisyystiedolle. Myös tapausten rekisteröinti voi kärsiä erityisesti histologisesti vahvistamattomissa ja hematologisissa syövissä; kahta kattavuuskäsitettä ei silti saa korvata toisillaan. Vuoden 2024 vuosiraportti ilmoittaa levinneisyystiedon kattavuudeksi 42 % siinä rajatuista kiinteistä kasvaimista (pois aivot/keskushermosto). Tämä ei ole kliinisten ilmoitusten prosentti. [Syöpä 2024, esipuhe ja tiedonkeruu](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2024_tilastoraportti.html).

HTML sisältää Shiny-käyttöliittymän, syöpäryhmät ja aluevalinnat, mutta ei kuvioiden numeerisia aikasarjoja. Tässä erässä ei varmennettu numeerista vientiä, avointa CSV-rajapintaa, suojauksen sääntöä tai täsmällistä päivityspäivää. Soveltuu laadun taustamittarin lähteeksi; toimivaa automaattipoimintaa ei merkitä valmiiksi. Uudelleenkäyttölisenssiä ei vahvistettu.

## D08 — myelooman laaturaportti

[Raportti](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html) on päivitetty **9.6.2026**, hoitotiedot ulottuvat **31.12.2024** asti. Kohortti on vuosina **2019–2023** uuden **C90-alkuisen lääkekorvausoikeuden** saanut joukko, **2 336 henkilöä**. Tämä ei ole kaikkien rekisteröityjen myeloomadiagnoosien kohortti. Hoitoseuranta alkaa oikeuden myöntämisestä tai enintään 30 päivää aiemmasta C90-Hilmo-käynnistä ja kestää enintään vuoden tai kuolemaan. Tiedot yhdistävät Hilmon ja Kelan lääkeostot.

Julkinen HTML sisältää **11 DataTables-taulukkoa**, yhteensä **1 136 esitysriviä**; samat tiedot esiintyvät useissa näkymissä. Mukana ovat kohortti, ilmaantuvuus, hoitomuodot, suhteellinen elossaolo sekä hoito-/ATC-koodit. Excel-painikkeiden asetukset löytyvät lähteestä; itse selainlatausta ei testattu. Numerotaulukot poimittiin suoraan upotetusta JSONista.

Puuttuvat hoitokirjaukset eivät merkitse hoitamattomuutta. Raportti varoittaa sairaalalääkityksen ja osan lääkeostojen puutteista. Esillä ovat ensimmäisen vuoden hoitoluokat, eivät seuraavat hoitolinjat. Julkisista taulukoista ei löytynyt levinneisyysluokkaa, haittatapahtumia tai diagnoosi–hoidonaloitus-viivettä. Elossaolo esitetään erikseen 1, 3 ja 5 vuodelle; yhden vuoden hoitoseurannan määritelmää ei siirretä sellaisenaan elossaoloanalyysin seurantamääritelmäksi. [Raportin menetelmäkuvaus](https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html).

### Poimitut luvut ja tarkistukset

| Hoitoluokka, kaikki iät | Henkilöitä | Julkaistu osuus |
|---|---:|---:|
| Autologinen kantasolusiirto | 472 | 20,2 % |
| Lääkehoito, yhdistetty | 1 863 | 79,8 % |
| Lääkehoito, sairaalakoodi | 1 236 | 52,9 % |
| Lääkehoito, lääkeosto | 1 596 | 68,3 % |
| Palliatiivinen hoito | 260 | 11,1 % |
| Sädehoito | 439 | 18,8 % |

Nimittäjä on 2 336. Hoitoluokat menevät päällekkäin. Kaikki 18 kansallisen hoitotaulukon osuuslaskua täsmäsivät yhden desimaalin pyöristykseen.

**Alueosuudet ovat ikävakioituja:** kuvioiden akselitekstit vahvistavat tämän. Etelä-Suomen kantasolusiirtorivillä 154/800 = 19,25 %, mutta julkaistu ikävakioitu osuus on 18,0 % (15,3–21,1). Se ei ole aritmeettinen virhe eikä sitä korvata raakaosuudella. Tarkka vakiointiväestö ja luottamusvälien menetelmä eivät selvinneet tämän poiminnan tekstistä.

**Kattavuusero jäi avoimeksi:** 22 HVA-rivin summa ja viiden YTA:n summa ovat 2 301; koko maan kohortti 2 336. Erotus on **35**. Vuosien 2019–2023 kansalliset tapausmäärät 476 + 457 + 483 + 456 + 464 täsmäävät 2 336:een. Alue-eron syytä ei varmennettu, eikä sitä nimetty Ahvenanmaaksi, puuttuvaksi hoidoksi tai duplikaateiksi.

Kooditaulukossa on viisi null-solua toimenpiteiden lukumäärässä ATC-riveillä; niitä ei muuteta nolliksi. Etsittyjä suojamerkkejä `NA`, `...`, `..`, `--`, `*` ei löytynyt taulukoista, mutta tämä ei vahvista pienlukusuojauksen puuttumista. Julkisen raportin tai aineiston nimenomaista avointa lisenssiä ei löytynyt. Poiminta on lähteistetty paikallinen tutkimuskopio.

## D09 — yksilöaineistojen saatavuus ja todetut kentät

[Katalogin sivu](https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0) palautti aluksi vain sovelluskuoren. Sen julkaistusta ohjelmasta tunnistettu [julkinen metatieto-API](https://aineistokatalogi.fi/api/v1/public/studies/21085403-7be8-4f93-bf05-231518c642a0) palautti kuvaukset ja **154 kenttää**. Metatieto on päivitetty **23.10.2026**. Kyse on metadatasta, ei potilastietojen avoimesta latauksesta: luokitus on `CONFIDENTIAL`.

| Katalogin osakokonaisuus | Kenttiä | Kuvauksessa ilmoitettu saatavuus | Keskeisiä ajallisia muuttujia |
|---|---:|---|---|
| Syöpärekisteri | 38 | Rekisteri alkaa 1953; tiedot vuoteen 2025, joka ennakollinen | `dg_date`, `ex_date`; levinneisyyskentät |
| Kohdunkaulaseulonta | 41 | 1991–2024 | `primary_invited_date`, `primary_attended_date`, `colposcopy_attended_date`, `treatment_attended_date` |
| Rintaseulonta | 26 | 1992–2024 | `primary_invited_date`, `primary_attended_date`, `secondary_attended_date`, `treatment_attended_date` |
| Suolistoseulonta | 49 | 2022–2024 | `primary_invited_date`, `primary_attended_date`, `primary_result_date`, `colonoscopy_attended_date` |

Rekisterin historiallinen keruun aloitus ei ole sama kuin nykyisessä tutkimuskatalogissa luvattu poimintajakso: kohdunkaulatietojen keruu alkoi 1963 ja rintatietojen 1987, mutta yllä ovat tämänhetkisen tutkimuskuvauksen saatavuusvuodet. Kutsupäivä ja useat jatkotutkimuspäivät on merkitty erityismuuttujiksi. Kentän kuvaus ei takaa sen kattavuutta jokaisessa vuosikerrassa. Puuttuvan oletusarvoksi ilmoitetaan `NA`; havaittua puuttuvuusosuutta ei metadatasta saada.

### Levinneisyys ja hoitoajan semantiikka

**`stage` ei ole suoraan TNM-vaihe I–IV.** Se on rekisterin oma 0–6-luokitus (0 tuntematon; muut luokat kuvaavat paikallisuutta ja leviämisen tapaa). Siksi strategian I–II-tavoitetta ei toteuteta ehdolla `stage in {1,2}`. Erityismuuttuja `met_def_type` kertoo, sisältävätkö `met_tumor`, `met_lymph_node` ja `met_metastases` TNM-, Stage/Ann Arbor- vai sanallista tietoa; kuvattu keruuikkuna on neljä kuukautta toteamisesta. Tarkka muunnos tarvitsee syöpätyypin ja käytetyn luokituksen version. [Syöpärekisterin osakatalogi](https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0/datasets/ca8a40b0-1e54-447f-9bd2-70cfe82296f4).

Rinnan `treatment_attended_date` tarkoittaa episodin ensimmäistä **erikoissairaanhoidon päivää**, kohdunkaulan samanniminen kenttä ensimmäistä **syöpä- tai esiastehoidon päivää**. Suoliston 49 kentän luettelossa tätä päivämääräkenttää ei ole, vaikka hoitoon kutsumisen/osallistumisen indikaattorit ja ensimmäisen toimenpiteen kuvaus ovat. Kolmen rekisterin samannimisiä tapahtumia ei yhdenmukaisteta ilman määritelmävertailua. Rinnassa ja kohdunkaulassa ei ole tämän luettelon perusteella suoliston `primary_result_date`-kenttää; osallistumispäivä ei sellaisenaan ole poikkeavan tuloksen valmistumispäivä.

Tietosuojailmoitus kuvaa lisäksi syöpärekisterin hoitoilmoituksen aloitus- ja lopetuspäivän, mutta näitä ei ole nykyisen 38 kentän tutkimusluettelossa. **Kerättävä tietosisältö ja tarjottavan tutkimuspoiminnan kentät ovat eri asia.** Saatavuus ja kattavuus on vahvistettava poimintakohtaisesti. [Tietosuojailmoituksen kohta 4](https://syoparekisteri.fi/tietoa-syoparekisterista/tietosuojailmoitus/).

### Aluepäivä ja yhteys yhdistelykokeeseen

Seulontakatalogin `scr_munic_scry`, `scr_munic_staty` ja `scr_wsc_staty` perustuvat seulontavuotta edeltävän vuoden viimeisen päivän kotikuntaan. Vuoden 2024 seulonnassa viitepäivä on siten **31.12.2023**. Kuntaluokitus erotellaan seulontavuoden ja tilastovuoden mukaiseksi. Suoliston ja kohdunkaulan HVA-koodistoviite on vuoden 2025 luokitus; rinnan viitteessä on `XXXX`-paikkamerkki. Julkisten vuosiraporttien täsmällinen aluevuosi on edelleen vahvistettava erikseen. Tulos täydentää [[Seulonnan ja väestön yhdistelykoe 2024]] -koetta: 31.12.2024 väestö on ajallisesti eri taustamitta, ei seulonnan kutsunimittäjä. [Metatieto-API](https://aineistokatalogi.fi/api/v1/public/studies/21085403-7be8-4f93-bf05-231518c642a0).

### Nykyinen lupapolku

Rekisterinpitäjä on THL; Suomen Syöpäyhdistys toimii ylläpitäjänä/käsittelijänä. Yksilötason syöpä- ja seulontarekisteriaineistoon haetaan **Findatan tietolupa**. Pelkkää THL:n rekistereistä muodostettavaa aggregoitua tilastoa koskeva tietopyyntö toimitetaan **THL:lle**. Findatan ajantasainen ohje vahvistaa THL:n siirtäneen tietolupatoimivallan Findatalle, mutta tilastotietopyynnöt ovat poikkeus. [Syöpärekisterin tietopyyntöohje](https://cancerregistry.fi/services/information-requests/), [Findatan tietolupaohje, THL-poikkeus](https://findata.fi/luvat/tietoluvat/).

Ennen hakemusta tarvitaan tarkka kohortti, kasvainrajaus, muuttujat ja rekisterilinkitykset sekä poiminnan toteutettavuusarvio. Luvan jälkeinen aineisto poimitaan, pseudonymisoidaan ja käsitellään hyväksytyssä ympäristössä; lupa- ja aineistotyö on maksullista. Tietopyynnön anonyymi aggregaatti on eri tuote kuin yksilötason aineisto. Tämä erä ei sisältänyt hakemusta, yhteydenottoa eikä oletusta viikonlopun toimituksesta. [Findatan ohje](https://findata.fi/luvat/tietoluvat/).

## Tutkimuksen seuraavat rajatut tehtävät

1. Selvitä myelooman 35 tapauksen alue-eron määritelmä ja alueosuuksien vakiointimenetelmä ennen aluevertailun julkaisemista.
2. Määrittele luvanvarainen viivetutkimus kunkin seulontaohjelman todellisten päivämääräkenttien mukaan. Pyydä saatavuusarviossa erikseen puuttuvuus, aikajärjestysvirheet, useiden testien episodisäännöt ja kuoleman/muuton käsittely.
3. Hanki kliinisten ilmoitusten numeerinen vienti ja dokumentoitu päivitysaika, jotta ilmoituskattavuutta voi käyttää levinneisyysanalyysin laadun porttina. Puuttuvia osuuksia ei täydennetä kuvista arvaamalla.

Tekniset lokit, lähteiden tarkistussummat ja toistettavat poiminnat ovat `work`-kansiossa. Ks. [[Täydentävien lähteiden tekninen loki]].
