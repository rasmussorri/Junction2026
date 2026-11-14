# Kiintiötauko ja seuraava rajattu työ

Tutkimuksen automaattiset käynnistykset on keskeytetty ja kolme rinnakkaista tutkijaa pysäytetty. Käyttäjä ilmoitti vaihtaneensa malliksi GPT-6.1 Sol, medium, ja viikkokiintiön kuluneen. Mallivalinta perustuu käyttäjän ilmoitukseen; agentti ei vaihtanut sovelluksen malliasetusta.

Kaikki jo tallennetut aineistot, kymmenen dataset-korttia, ryhmitelty katalogi, latauslokit ja analyysit säilyvät. **Lopullinen itsenäinen raportti ei vielä ole valmis.** Automaattista valmistumista klo 08 ei tauon aikana luvata.

## Seuraava työ: koostaminen tallennetusta näytöstä

1. Koosta raportti olemassa olevista lähdemuistioista ja kymmenestä kortista. Älä käynnistä uusia rinnakkaisia hakuja tai lataa aineistoja uudelleen.
2. Integroi uusimmat muistiot: Syöpärekisterin täydentävät lähteet, NORDCAN/ECIS ja alueet sekä seulontasovelluksen todelliset CSV-poiminnat. THL:n täydentävä erä jäi kesken; sen raakatiedostot säilyvät, väitteet tarkistetaan niistä ennen käyttöä.
3. Varmista kolme analyysiä ja valitse MVP. Rintaseulonnan sovelluksesta saatu Helsinki × vuosi × ikä -CSV on lupaava CC BY 4.0 -pohja; kaikkien alueiden vastaavan viennin valmistuminen jäi tarkistamatta.
4. Tee rajattu laaduntarkistus lähteille, nimittäjille, luokituksille ja raportin itsenäisyydelle. Säilytä tietoaukot.

## Tallennetut keskeiset löydöt

- Seulonnan todelliset taulukot ja laskutarkistukset: suolisto 34, rinta 61, kohdunkaula 126 taulukkoa. Viiveet olivat 18 PNG-kuvassa; numerovienti jäi auki.
- Suolistoseulonnan osallistuminen laski kaikilla 22 yhteisellä alueella 2022–2024. Kansallinen ikä–sukupuoliherkkyys säilytti laskun. Kutsukattavuus ja marginaalinen historiavakiointi eivät yksin selitä sitä; yhteisositus on vielä avoin.
- THL:n yli 180 vrk -jonoluokka on oikeasti ladattu ja sen nimittäjä tarkistettu. Se ei ole diagnoosi–hoito-viive.
- Avohilmon alkuperäinen C50-kysely palautti tyhjää; korjattu aluepoiminta toimii.
- Tilastokeskuksen pienet POST-poiminnat toimivat. Seulonta ja HVA-väestökonteksti yhdistyivät 22/22 alueelle; asuinpaikan ajankohdat eroavat.
- Kela-koodin 115 vuoden 2025 poiminta: 486 julkaistua aggregaattiriviä; puuttuvia yhdistelmiä ei muuteta nolliksi.
- Syöpärekisterin levinneisyys ei automaattisesti ole TNM I–IV. Tutkimusmetadatan stage-koodit 0–6 vaativat oman tulkinnan.
- NORDCANin systemaattista tietokannan kokoamista rajoittavat käyttöehdot; Suomen pienet vuosimäärät voivat olla tasattuja. ECIS:n HTTP 200 palautti myös virhesivun, ei havaintodataa.

## Jatkamisen toimintatapa

Käytä käyttäjän valitsemaa Sol Medium -mallia, yhtä työntekijää ja etukäteen rajattua toimitusta. Olemassa oleva näyttö riittää seuraavaksi koostamiseen. Halvempi malli ei yksin rajoita jatkuvan ajon kokonaiskulutusta. Automaatiota tai rinnakkaisia työntekijöitä ei käynnistetä uudelleen ilman uutta pyyntöä.
