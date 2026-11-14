# Raportin laadunvarmistus

Tarkistettu 14.11.2026. Kooste tehtiin tallennetusta näyttöaineistosta; tässä viimeistelyssä ei tehty uusia verkkohakuja, latauksia, hakemuksia tai jatkuvaa tutkimusajoa. Raakatiedostoja ja alkuperäisiä liitteitä ei muutettu.

Raportti: [Junction 2026 – syöpädata ja MVP](Junction%202026%20-%20sy%C3%B6p%C3%A4data%20ja%20MVP.md). Laajuus: **9 853 sanaa** välilyönneittäin laskettuna, 94 027 merkkiä, 9 päälukua, 10 aineistokorttia. Lähteet: 138 julkista URL-viittausta, 78 eri julkista URL:ää; lisäksi 11 paikallista tarkistuslinkkiä. URL-syntaksi tarkistettiin, lähteiden tämänhetkistä verkkovastetta ei testattu uudelleen.

| Vaatimus | Tulos |
|---|---|
| Itsenäinen suomenkielinen raportti | Tiivistelmä, näytön merkinnät ja strateginen konteksti sisältyvät |
| Ryhmitelty dataset-katalogi | D01–D31 sekä aluejulkaisut ja tutkimusrepositoriot; päällekkäisyydet selitetty |
| Kymmenen tarkempaa korttia | D01, D02, D03, D04, D07, D10, D12, D14, D16 ja D21/D22 kokonaan mukana |
| Kysymys–aineisto-matriisi | Osallistuminen, viiveet, hoitovaje, peruutukset, seuranta, vaihe, hoidot, haitat ja elossaolo |
| Kolme toteutuskelpoista analyysiä | Helsinki-rinta, syöpätautien jonotilanne ja kansalliset kuolemansyyt; kaikissa todellinen näyte ja käyttöehdot |
| Tietoaukot ja jatkokysymykset | Yksilöidyt riippuvuudet sekä luvanvaraisen poiminnan kenttien merkityserot |
| Tekninen liite | Testatut toimitukset, tarkka PxWeb-POST, Kela-GET, skeemat, erikseen epäonnistuneet/ehdotetut haut |
| Perusteltu MVP | Yhden alueen valmis CSV, rajattu agentti, työmäärä ja hyväksymiskriteerit |
| Lähteet ja siirrettävyys | Väitteiden lähellä alkuperäiset URL:t; ei Obsidian-wikilinkkejä; sama raportti kahdessa paikassa |

## Tarkistettu näyttö

- **Uudelleen laskettu alkuperäisistä CSV:istä:** 150 rinnan ja 306 kohdunkaulan osallistumisprosenttia, avainten yksikäsitteisyys ja tiedostojen SHA-256:t. Rinnan vuosien 2020–2024 summat täsmäsivät raportin analyysiin.
- **Uudelleen laskettu alkuperäisistä THL-JSONeista:** 1 444 yli 180 vuorokauden osuutta, yhteiset dimensiot, syyskuun kokonaisrivi 2/486, Satakunta 2/8 sekä neljä puuttuvaa tuottajariviä. Jonotuotteen oma CC BY 4.0 -linkki ja päivitys 19.10.2026 tarkistettiin tallennetusta HTML:stä.
- **Alkuperäisvastauksista tarkistettu:** kuolemansyyotoksen neljä solua; StatFinin 4 + 16 + 10 + 10 + 46 solun rakenteet; Kelan 486 julkaistua riviä, täsmäävä total ja yksikäsitteiset avaimet.
- **Tallennettuihin validoituihin tuloksiin verrattu:** 22/22 alueliitos ja puuttumattomat väestösolut, kaikkien 22 suolistoalueen lasku, vuosittaisten summien prosentit, erilliset ikä–sukupuoli- ja sukupuoli–historiavakioinnit sekä nimittäjän +0,2450 prosenttiyksikön herkkyys. Näitä vanhoja poimintaputkia ei ajettu uudelleen tai päivitetty.
- **Toimitukselliset tarkistukset:** kymmenen korttia, kaikki D-tunnisteet, kolme analyysiä, taulukoiden sarakemäärät, tasapainoiset koodilohkot, paikallisten linkkien kohteet ja julkisten URL:ien rakenne. Myelooman C90 kuvataan ICD-10-diagnoosina, ei korvausoikeuskoodina.

Tarkat tulokset: [koneellinen tarkistusloki](Raportin%20QA%20-%20tarkistukset.json). Lopullinen kopioidenttisyys tarkistettiin SHA-256:lla. Raportin tiiviste: `6777f6211d42d17cdcdf6e037958830eb152f6a8bb183db7af9a093183f501ef`.

## Olennaiset avoimet rajat

Kaikkien 22 alueen sovellus-CSV ei ole valmiina. Staattisten seulonta-/laaturaporttien datalisenssiä ei päätellä sovelluksen lisenssistä. Seulontaviiveiden tarkat numerot ja yhteisositukset puuttuvat. Jonotilanne ei ole diagnoosi–hoito-viive; neljä tuottajasolua puuttuu. Alueiden version ja asuinpaikan viitepäivän yhteensopivuus on vain osittain ratkaistu. Stage-luokitukset ja puuttuvuus estävät I–II-tavoitteen suoran mittauksen. Kelan puuttuvien yhdistelmien nollarivisääntö, myelooman 35 henkilön alue-ero ja viralliset kilpailukriteerit jäävät avoimiksi. Nämä rajat on esitetty myös varsinaisessa raportissa.

Suositeltu MVP on **toteutusehdotus**, ei tässä työssä rakennettu tai julkaistu sovellus. Raportti ja sen siirrettävä kopio ovat tämän tehtävän valmiit toimitukset.

## GitHub-julkaisu

Julkaisukopiossa konekohtaiset Markdown-linkit muutettiin suhteellisiksi. Yllä oleva tiiviste koskee alkuperäistä paikallista raporttia. Julkaistun raportin tiiviste ja mukaan otetut/pois jätetyt lähdetiedostot ovat repositorion `publication-manifest.json`-tiedostossa. Tutkimustuloksia ei muutettu.
