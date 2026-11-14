# Suomalaiset syöpä- ja hoitodatalähteet

Koottu 13.11.2026 Junction-hackathonia varten. Tämä dokumentti on itsenäinen lähdeluettelo: kaikki olennaiset linkit ovat tässä eikä muita projektitiedostoja tarvita sen lukemiseen.

## Projektin konteksti

Tuotteen tavoitteena on ensin seuloa syöpä- ja hoitodataa makrotasolla ja tunnistaa mahdollisia hoitopolun ongelmia: viiveitä, jatkotutkimuksiin tai hoitoon etenemisen katkoksia, hoitoaikojen siirtoja ja myöhäistä toteamista. Seuraavaksi selvitetään mahdolliset syyt ja ehdotetaan ammattilaiselle jatkotoimia. Pidemmän aikavälin visio on yksilöllisemmän hoitosuunnittelun ja ajoituksen tukeminen.

Strateginen ankkuri on Kansallisen syöpästrategian tavoite 3, yhdenvertainen ja vaikuttava syövänhoito:
https://files.hackjunction.app/resources/Kansallinen_syopastrategia_2026_2035_FINAL.pdf

Challenge:
https://hackjunction.app/participate/45/challenges/344

## Miten luetteloa tulkitaan?

Mukana on 28 aineistokokonaisuutta tai tietotuotetta. Ne eivät ole 28 toisistaan riippumatonta rekisteriä: osa on samojen rekisterien aggregaatteja tai raportteja. Mukana on myös taustadataa ja luvanvaraisia tutkimusaineistoja.

- **Avoin data:** koneluettava julkinen aineisto tai rajapinta.
- **Julkinen raportti/sovellus:** luettavissa verkossa; koneellinen vienti tai uudelleenkäyttölisenssi ei välttämättä ole varmistettu.
- **Luvanvarainen:** ei hackathonissa heti käyttöön otettavaa avointa potilasdataa.
- **Testattu** tarkoittaa onnistunutta teknistä testiä kartoituksen aikana. Dokumentoitu latausmahdollisuus ei ole sama asia kuin testattu vienti.

## A. Syöpä, seulonta ja hoidon laatu

### 1. Suomen Syöpärekisteri: syöpätilastot

Sovellus:
https://cancerregistry.fi/statistics/cancer-statistics/

Vuoden 2024 raportti ja lisätaulukot:
https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html

Sisältö: ilmaantuvuus, kuolleisuus, vallitsevuus ja elossaolo syövän, iän, sukupuolen, ajan ja alueen mukaan. Ilmaantuvuuden historia vuodesta 1953; nykyisessä raportissa 2024 ja alueellisia usean vuoden yhdistettyjä tuloksia. Julkinen sovellus; tilastojen lataus on tarjolla, mutta vientimuotoa ei testattu. Ei avointa kokonaista potilaan hoitoaikajanaa. Alue perustuu asumiseen, ei välttämättä hoitopaikkaan. Levinneisyystiedon puuttuminen rajoittaa vertailua.

### 2. Suolistosyövän seulontatilastot

https://stats.cancerregistry.fi/joukkistilastot/colorectal.html

Suomenkielinen versio:
https://stats.cancerregistry.fi/joukkistilastot/suolisto.html

Sisältö: kohdeväestö, kutsut, osallistuminen/FIT-testin palautus, positiivisuus, kolonoskopia, vaihtoehtoinen kuvantaminen, syövät ja esiasteet. Alue-, ikä-, sukupuoli- ja sosiodemografisia erotteluja. Vuosivalinnat 2022–2024. Julkinen raportti sisältää kolonoskopiaan pääsyn viivekuvioita; viiveiden numerovientiä tai API:a ei vahvistettu.

Sopivuus: erittäin relevantti makrotason seulontapolun tarkasteluun. Positiivisten testien ja kolonoskopioiden erotus ei yksin tarkoita hoitamatta jääneitä: vaihtoehtoiset tutkimukset, ajoitus, vasta-aiheet ja puuttuvat kirjaukset on selvitettävä.

### 3. Rintasyövän seulontatilastot

https://stats.cancerregistry.fi/joukkistilastot/breast.html

Suomenkielinen versio:
https://stats.cancerregistry.fi/joukkistilastot/rinta.html

Sisältö: kutsut, osallistuminen, jatkotutkimukset, lähetteet, löydökset ja syövän havaitsemistapa, mukaan lukien seulontakertojen välillä todetut syövät. Vuosivalinnat 2020–2024, alue- ja taustaryhmävertailuja. Julkinen raportti; jatkotutkimuksiin pääsyn viiveet näkyvät kuviona, ei vahvistettua numerovientiä/API:a.

### 4. Kohdunkaulan syövän seulontatilastot

https://stats.cancerregistry.fi/joukkistilastot/cervix.html

Sisältö: kutsut, osallistuminen, HPV-positiivisuus, jatkoseuranta, kolposkopiaan ohjaaminen ja osallistuminen, histologiset löydökset ja kolposkopiaviiveet. Vuosivalinnat 2020–2024. Julkinen raportti; vientiä/API:a ei testattu. Seulontaohjelman ulkopuolinen testaus on erillinen kattavuuskysymys.

### 5. Kliinisten syöpäilmoitusten kattavuus

https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/

Sisältö: hoitavan tahon kliinisen ilmoituksen saaneiden osuus rekisteröidyistä syövistä, valittavissa yleisiä syöpiä ja alueita. 2000–2025, viimeinen vuosi ennakollinen. Julkinen sovellus; vientiä/API:a ei vahvistettu. Mittaa kliinisten tietojen ilmoittamista, EI hoidon saamista tai syöpärekisterin koko tapauskattavuutta.

### 6. NORDCAN: pohjoismainen syöpätietokanta

https://nordcan.iarc.who.int/en/database

https://nordcan.iarc.who.int/en/dataviz

Sisältö: harmonisoitu ilmaantuvuus, kuolleisuus, vallitsevuus ja elossaolo; Suomi mukana. Tarkistetussa versiossa 9.6.1 (11/2026) Suomen tietoja vuoteen 2024. Julkinen tietokanta, vientiä/API:a ei testattu. Sopii pohjoismaiseen vertailuun, ei yksilön hoitoviiveisiin. Suomen alueellinen elossaolo ei ollut NORDCANin saatavuustaulukossa.

### 7. Keuhkosyöpä Suomessa 2019–2023: laaturaportti

https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html

Sisältö: diagnostiikka, hoitomuodot, levinneisyystiedon kattavuus, moniammatillisen käsittelyn kirjaukset ja elossaolo alueittain. Julkinen yhdistettyihin rekistereihin perustuva raportti, ei avoin potilasaineisto. Hoitoviivekenttiä ei vahvistettu. Kirjaamaton hoito ei tarkoita saamatta jäänyttä hoitoa; levinneisyystiedoissa on merkittävää puuttuvuutta.

### 8. Myelooma Suomessa 2019–2023: laaturaportti

https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html

Sisältö: korvausoikeusperusteinen potilaskohortti, ikä- ja aluejakaumat sekä hoitomuodot, kuten kantasolusiirto, lääkehoito, sädehoito ja palliatiivinen hoito. Hoitotietoja 2019–2024. Julkinen interaktiivinen raportti; Excel-latauspainikkeet havaittu kohortti- ja hoitotaulukoissa, latausta ei testattu. Kohortti ei ole sama kuin kaikki rekisteröidyt uudet myeloomat.

### 9. Syöpärekisterin ja seulontarekisterien yksilötason tutkimusaineistot

Katalogi:
https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0

Tietopyynnöt ja pääsy:
https://cancerregistry.fi/services/information-requests/

Sisältö: syöpärekisteri sekä kohdunkaulan, rinnan ja suoliston seulontarekisterit. **Luvanvarainen yksilötason data.** Tietopyynnöt Findatan tai THL:n kautta; yksilötason aineisto edellyttää tietolupaa. Ei viikonlopuksi luvattua avointa latausta. Haluttujen tapahtuma- ja levinneisyyskenttien todellinen saatavuus on varmistettava poimintakohtaisesti.

## B. THL: hoitotoiminta ja hoitoonpääsy

### 10. Hilmo: somaattinen erikoissairaanhoito alueittain

Kuutio:
https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j

API-hakemisto:
https://sampo.thl.fi/pivot/prod/api/thil/perus03j.json

Testattu syöpätautien rajaus:
https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.json?filter=speciality-17958

Sisältö: potilaat, avohoitokäynnit, hoitojaksot ja hoitoaika alueittain, erikoisaloittain ja päädiagnoosin mukaan. Vuositaso 2015–2025. JSON testattu. Syöpätautien erikoisala ei kata kaikkea syöpähoitoa; diagnoosiryhmä C00–D48 sisältää myös muita kuin pahanlaatuisia kasvaimia. Ei suunniteltuja/siirrettyjä aikoja eikä TNM-vaihetta.

### 11. Hilmo: toimenpiteet vuosittain

https://sampo.thl.fi/pivot/prod/fi/thil/perus01/fact_thil_perus01

API:
https://sampo.thl.fi/pivot/prod/api/thil/perus01.json

Sisältö: toimenpidekoodit, määrät, potilaat ja hoitojaksot, 2016–2025. Oletus-JSON testattu. Tässä kuutiossa ei alueulottuvuutta tai diagnoosin ristiinrajausta. Toimenpide ei automaattisesti osoita syöpää.

### 12. Avohilmo: ICD-10-diagnoosit alueittain

https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06

API:
https://sampo.thl.fi/pivot/prod/api/avo/perus06.json

Testattu rintasyövän C50-rajaus:
https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.json?filter=diagnoosi-121077

Testattu oletus-CSV:
https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.csv

Sisältö: ICD-10-diagnooseihin liittyvät asiakkaat ja kirjaukset, alue, aika, sektori, palvelumuoto ja ammatti. 2018–2026, viimeinen vuosi kesken. JSON, CSV ja C50-rajaus testattu. Diagnoosikirjaus ei ole uusi syöpätapaus. Pienet luvut salataan; sektorien kattavuus muuttuu ajassa. Ei siirrettyjä aikoja tai stage IV -tietoa.

### 13. Avohilmo: toimenpiteet alueittain

https://sampo.thl.fi/pivot/prod/fi/avo/perus13/fact_ahil_perus13

API:
https://sampo.thl.fi/pivot/prod/api/avo/perus13.json

Sisältö: toimenpiteet, asiakkaat, alue, sektori ja palvelumuoto, 2018–2026. JSON testattu. Ei itsessään syöpäaineisto. Tarkistetun raportin jatkohoitoon liittyvät SPAT-koodit on rajattu pois: tätä ei pidä tulkita puuttuvan seurannan tietolähteeksi.

### 14. Erikoissairaanhoidon hoitoonpääsy ja jonot

https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne

Kuvaus:
https://thl.fi/data-ja-tilastot/hoitoon-paasy/erikoissairaanhoito

Testattu syöpätautien rajaus:
https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?filter=erikoisala-862186

Sisältö: odottajat, odotusaikaluokat, osuudet ja lähetteiden käsittely alue-/palveluntuottaja- ja erikoisalatasolla. Historia 2007–9/2026, kuukausikeruu vuodesta 2021. JSON ja syöpätautien rajaus testattu. **Julkinen kiireetön erikoissairaanhoito**, ei kaikki kiireellinen syövänhoito. 90/180 päivän luokat eivät ole syöpäkohtaisia tavoiteaikoja. Ei yksilön ajan siirtoja.

### 15. Perusterveydenhuollon ensimmäiseen hoitotapahtumaan pääsy

https://sampo.thl.fi/pivot/prod/fi/avohpaasy/pthjono01/fact_ahil_pthjono01

Kuvaus ja laatu:
https://thl.fi/data-ja-tilastot/hoitoon-paasy/perusterveydenhuolto

Sisältö: toteutuneet ensimmäiset kiireettömät kontaktit, odotusluokat, alue/palveluntuottaja ja ammatti. 2022–9/2026. JSON testattu. **Ei diagnoosiulottuvuutta**, joten ei syöpärajausta tarkistetussa kuutiossa. Yleinen taustamuuttuja, ei syöpäpotilaan hoitopolku. Kirjaustavat ja lainsäädäntömuutokset vaikuttavat vertailuun.

### 16. Sotkanet: syöpäindeksi 5643 / 5644

https://sotkanet.fi/sotkanet/fi/metadata/indicators/5643

Testattu JSON:
https://sotkanet.fi/rest/1.1/json?indicator=5643&years=2024&genders=total

Sisältö: ikävakioitu/vakioimaton alueellinen syöpäindeksi, 2017–2024. Kolmen vuoden liukuva laskentajakso. JSON testattu. Taustamittari, ei nopea hoitopolun hälytin. Alue-ID:t on yhdistettävä Sotkanetin aluehakemistoon.

Lisäjakelukanava, ei uusi riippumaton aineisto: rintasyövän viiden vuoden suhteellinen elossaololuku 3625, lähde Syöpärekisteri:
https://sotkanet.fi/sotkanet/fi/metadata/indicators/3625

Testattu JSON:
https://sotkanet.fi/rest/1.1/json?indicator=3625&years=2024&genders=total

## C. Lääkkeet, haitat, kuolleisuus ja taustatekijät

### 17. Kela: sairaanhoitokorvausten saajat ja maksetut korvaukset

https://avoindata.suomi.fi/data/en_GB/dataset/sairaanhoitokorvausten-saajat-ja-maksetut-korvaukset

Testattu 2025 CSV:
https://avoindata.suomi.fi/data/dataset/22368122-4f1b-4a8c-8a82-e70cdca843c9/resource/ed6d4355-f72e-4b4c-8f08-3b7875327b72/download/data_2025.csv

Sisältö: aika, kunta, ikäryhmä, sukupuoli, etuuslaji, saajat, kustannukset, korvaukset ja toimitukset. Kuukausitietoja 2018 alkaen, vuositietoja pidemmältä ajalta. Avoin CSV testattu, noin 277 miljoonaa merkkiä: suuri tiedosto. Ei diagnoosia, ATC:tä tai potilastunnistetta tarkistetussa CSV:ssä; ei suoraan syöpäkohtainen.

### 18. Kelasto NIT137A: lääkekorvausten saajat ja reseptitiedot

Muuttujakuvaus:
https://raportit.kela.fi/approot/lisatied/NIT137A_fi.html

Raportti:
https://raportit.kela.fi/ibi_apps/WFServlet?IBIF_ex=NIT137AL&YKIELI=E

Sisältö: ATC-ryhmät, ostajat, lääke-erätoimitukset, kustannukset ja korvaukset, vuosittain 2008 alkaen sekä neljännesvuosittain lähivuosilta. Julkinen raportti; vientiä/API:a ei testattu. Apteekkitoimitukset eivät kata kaikkea sairaalassa annettua syöpähoitoa. Lääkeosto ei ole yksi hoitokuuri tai uusi potilas.

### 19. Fimea: lääkkeiden kulutus / Suomen lääketilasto 2024

https://fimea.fi/en/databases_and_registeries/consumption

Julkaisu:
https://www.julkari.fi/handle/10024/151649

Sisältö: lääkkeiden tukkumyynti apteekeille ja sairaaloille, ATC, DDD ja kustannukset. Julkinen julkaisu; PDF-taulukoita tai CSV/API:a ei testattu. Tukkumyynti ei osoita potilaan saamaa annosta, hoidon alkua tai tehoa.

### 20. Fimea: haittavaikutusilmoitusten vuositilasto 2024

https://sic.fimea.fi/-/millaisia-haittavaikutuksia-laakkeista-ilmoitettiin-vuonna-2024-

Sisältö: epäiltyjen lääke- ja rokotehaittojen vuosiyhteenveto, lääkeryhmiä ja ilmoitusten ominaisuuksia. Julkinen artikkeli ja kuviot, ei avoimeksi vahvistettua potilastason haittadatasettiä/API:a. Vapaaehtoiset ilmoitukset eivät mittaa haitan ilmaantuvuutta eivätkä todista syy-yhteyttä.

### 21. Tilastokeskus 11be: kuolemansyyt ICD-10:n 3-merkkisellä tasolla

https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__ksyyt/11be.px/

Testattu API-metatieto:
https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px

Sisältö: peruskuolemansyy, ikä, sukupuoli, vuosi, kuolleiden määrä, 1998–2025. Ei alueulottuvuutta tässä taulukossa. Avoin PxWeb; API-metatieto testattu, varsinaista datakyselyä ei tehty. Kuolleisuus ei yksin kerro hoitoviiveen vaikutuksesta.

### 22. Tilastokeskus 13u5: alueellinen kuolleisuus

Virallinen taulukkoluettelo, valitse 13u5:
https://pxdata.stat.fi/PXWeb/pxweb/en/StatFin/StatFin__ksyyt/?tablelist=true

Sisältö: peruskuolemansyy aikasarjaluokituksella, hyvinvointialue, vuosi, kuolleet ja karkea kuolleisuus, 1969–2025. Aineiston olemassaolo varmennettu luettelosta; tarkkaa datavientiä ei testattu. Karkea kuolleisuus vaatii alueen ikärakenteen huomioimisen.

### 23. Paavo: postinumeroalueiden avoin tieto

https://stat.fi/en/services/statistical-data-services/statistical-databases/paavo

Tietokanta:
https://pxdata.stat.fi/PxWeb/pxweb/en/Postinumeroalueittainen_avoin_tieto/

Sisältö: väestö, ikä, tulot, koulutus, asuminen ja muut alueelliset taustatekijät. Avoin tietokanta ja dokumentoitu API; yksittäistä kyselyä ei testattu. Ei syöpädataa. Aluetietoa ei saa tulkita yksilön ominaisuudeksi; alue- ja vuosiluokitukset on harmonisoitava.

## D. Genetiikka ja luvanvaraiset tutkimuskokonaisuudet

### 24. FinnGen R13: geneettiset yhteenvetotulokset

https://www.finngen.fi/en/access_results

Latausohje:
https://finngen.gitbook.io/documentation/data-download

Tulosselain:
https://r13.finngen.fi/

Testattu tiedostomanifesti:
https://storage.googleapis.com/finngen-public-data-r13/summary_stats/finngen_R13_manifest.tsv

Sisältö: GWAS-yhteenvetotulokset, päätetapahtumat, tapaus-/kontrollimäärät ja varianttikohtaiset assosiaatiot. Julkinen manifesti testattu; varsinaisia GWAS-tiedostoja ei ladattu. Ei potilasrivejä, hoitopäivämääriä tai hoitovasteita. Geneettinen assosiaatio ei ole hoitosuositus.

### 25. Risteys: sairauksien aggregoitu ajallinen kuvailu

Tarkistetun version dokumentaatio:
https://r10.risteys.finregistry.fi/documentation

Nykyinen palveluosoite, ei erikseen tarkistettu:
https://risteys.finregistry.fi/

Sisältö: päätetapahtumien määritelmät, tapausmäärät, sairastumisikä, päällekkäisyydet, ilmaantuvuus ja ajalliset yhteydet. Julkinen verkkotyökalu; API/bulkkivientiä ei vahvistettu. Tarkistettu R10-dokumentaatio ei välttämättä kuvaa nykyversion vuosipeittoa. Ei yksilön hoitopolkuja tai todistettuja hoitohaittoja.

### 26. FinRegistry: Findatan valmisaines

https://findata.fi/en/data/ready-made-datasets/

Katalogi:
https://aineistokatalogi.fi/catalog/studies/8c9802fe-e41a-4947-8b61-98dfc49f0b5f

Projektin kuvaus:
https://www.finregistry.fi/finnish-registry-data

Sisältö: yli 20 rekisterilähteeseen perustuva pitkittäinen tutkimusdata, mukana syöpä-, kuolemansyy- ja lääketietoja. Luvanvarainen, hankekohtaisesti pseudonymisoitu; tietoturvallinen analyysiympäristö ja maksuja.

Tärkeä nykyinen rajoitus: Findatan 29.9.2026 päivitetty sivu sulkee valmisainesten ulkopuolelle Primary health care visits-, Health care- ja Intensive care -aineistot. Älä oleta täydellistä hoitotapahtumaketjua tai kaikkien lähteiden yhteistä viimeistä seurantavuotta.

### 27. iCAN Discovery Platform

https://ican.fi/what-is-ican/

Datateemat:
https://ican.fi/flagship-project/focus-areas-and-subprojects/data/

Alustapääsyn esimerkki:
https://ican.fi/news-events/introduction-to-ican-discovery-platform-for-new-users/

Sisältö: kasvainten molekyyliprofilointi ja pitkittäiset terveystiedot, kliinistä raaka-/OMOP-tietoa ja rekisteritietoa. Luvanvarainen tutkimusalusta; ei varmennettua avointa latausta. Hoidon ajoituksen, vasteen ja haittojen tarkat kentät on tarkistettava käyttöluvasta ja metadatasta. Ei luvattua viikonloppupääsyä.

### 28. Fingenious / suomalaiset julkiset biopankit

https://finbb.fi/fingenious-service/

https://site.fingenious.fi/en/

Konkreettinen esimerkki saatavuusprosessista, Tampere:
https://www.pirha.fi/web/english/for-professionals/finnish-clinical-biobank-tampere/biobank-services-for-researchers/sample-and-data-access-process-in-fcbt

Sisältö: näytteet sekä niihin liittyvät fenotyyppi- ja genotyyppitiedot. Saatavuusselvitys, tutkimusluvat ja sopimukset; ei yksi yhtenäinen avoin datasetti. Näytteen löytyminen ei takaa hoitopäivämäärien, vasteen tai haittojen kattavuutta. Tampereen prosessin yksityiskohdat eivät ole kaikkien biopankkien yleissääntö.

## Teknisiä lisälinkkejä

THL:n avoin data ja lisenssikuvaus:
https://thl.fi/tutkimus/avoin-data

THL:n Sampo-rajapinnan ohje:
https://yhteistyotilat.fi/wiki08/spaces/THLKA/pages/27557958/THL+n+avoimen+datan+rajapinnan+kuvaus

Sotkanet REST -ohje:
https://yhteistyotilat.fi/wiki08/spaces/THLKA/pages/27557907/Sotkanet+REST+API+avoimen+datan+rajapinta

Sotkanetin aluehakemisto:
https://sotkanet.fi/rest/1.1/regions

Tilastokeskuksen PxWeb API:
https://pxdata.stat.fi/api1.html

FICANin syöpien laaturekisterihankkeen kuvaus:
https://fican.fi/toiminta/arviointi-ja-seuranta/syopien-laaturekisterit/

Sampo-toteutusansa: testatuissa suodatuksissa käytettiin dimensions-metadatan `sid`-arvoa, ei sisäistä `id`:tä. Väärä tunniste palautti joissain kokeissa 403:n avoimestakin aineistosta. Testatuissa vastauksissa JSON-stat oli `dataset`-avaimen sisällä. Yhdistetty alue-/aika-/syöpärajaus on vielä testattava valittua demoa varten.

## Johtopäätös hackathonin rajaukseen

Lupaavimmat ensimmäiset lähteet ovat suolistosyövän seulontatilastot, rintasyövän seulontatilastot, THL:n kiireettömän erikoissairaanhoidon jonodata sekä keuhkosyövän laaturaportti. Tämä on kartoituksen suositus, ei tiimin vahvistettu päätös.

Avoimista lähteistä voidaan tunnistaa alue- ja ryhmätason signaaleja. Yksilön siirretty vastaanotto, puuttuva kontrolli tai hoitoon etenemisen katkos tarvitsee linkitettyä tapahtuma- ja suunnitelmatietoa, jota tässä ei vahvistettu avoimesti saatavaksi.

Stage IV -diagnoosi ei yksin todista missattua seulontaa. Puuttuva tapahtuma ei yksin todista puuttuvaa hoitoa. Alueellinen ero ei yksin osoita palvelun virhettä tai syy-yhteyttä. Synteettinen aineisto on erotettava todellisista havainnoista, eikä sen hyväksyttävyyttä kilpailussa ole tässä vahvistettu.

Kaikkien vientien, lisenssien ja kenttien täydellistä auditointia ei tehty. NordScreen tutkittiin mutta jätettiin varsinaisen luettelon ulkopuolelle: tietokanta-/analyysilinkit palauttivat 404:n ja löytynyt Suomen tietolehti oli historiallinen. Mitään tietolupia, lomakkeita tai yhteydenottoja ei lähetetty.
