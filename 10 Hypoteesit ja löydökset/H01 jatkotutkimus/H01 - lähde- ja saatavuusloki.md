---
tarkistettu: 2026-11-14
hypoteesi: H01
---
# H01 – lähde- ja saatavuusloki

## Todellinen aineistosisältö

[Suoliston HTML-raportissa](https://stats.cancerregistry.fi/joukkistilastot/suolisto.html) on erilliset alue–vuosi-, kansalliset ikä–sukupuoli–vuosi- ja kansalliset edellinen tulos–sukupuoli–vuosi-taulukot. Niistä ei löydetty yhteistä alue × ikä × sukupuoli × edellinen tulos -taulukkoa. Erillisiä marginaaleja ei voi yhdistää tällaiseksi taulukoksi ilman todentamatonta riippumattomuusoletusta.

Taulukkotietojen otsikot, 24 sukupuoli–historiarivin prosentit ja niiden summat tarkistettiin. Lähdekoodi ei muokkaa alkuperäisiä HTML- tai JSON-näytteitä. Kaikki johdetut tiedot säilyvät tässä alikansiossa.

[Rekisteröinnin kuvaus](https://syoparekisteri.fi/seulonta/tietojen-rekisterointi/) kertoo rekisteriin toimitettavista kutsu-, osallistumis- ja tutkimustapahtumista. Se ei ole lupaus avoimesta henkilötason tapahtumadatasta tai halutusta ristiintaulukosta. Sivun sairaanhoitopiirisanasto on myös vanhempi kuin nykyisen raportin hyvinvointialuejaottelu: sivua ei pidä käyttää nykyisen alueviennin teknisenä määritelmänä.

[Vuoden 2024 tietotilinpäätös](https://syoparekisteri.fi/tietoa-syoparekisterista/tietotilinpaatos-2024/) vahvistaa ohjelman alkaneen 60–68-vuotiailla 2022 ja laajentuneen 70-vuotiaisiin 2023. Se erottelee rinta-/kohdunkaulatietojen viennin tilastosovellukseen ja suoliston vuositilaston. Henkilöaineiston olemassaolo rekisterissä ei tarkoita avoimen ositetun latauksen olemassaoloa.

## Tilastosovellus ja ladattu ohje

[Virallinen seulontatilastosivu](https://syoparekisteri.fi/tilastot/seulontatilastot/) linkittää [vuorovaikutteisen sovelluksen](https://tilastot.syoparekisteri.fi/seulonta/). Suora GET palautti sovelluksen HTML-rungon (24 710 tavua). `value_theme`-valinnan alkuperäisissä vaihtoehdoissa olivat vain `breast` ja `cervical`. Dynaamista selaimen istuntoa ei tässä erässä ajettu: havainto ei ole lopullinen todiste siitä, ettei palvelussa voisi olla muita näkymiä.

[Seulontasovelluksen ohje](https://tilastot.syoparekisteri.fi/seulonta/help_main_fi.html) löytyi kokeilemalla saman palvelun syöpätilastosovelluksen ohjepolun rakennetta. Verkkotekstin lukutyökalu ei avannut sitä, mutta suora Python GET onnistui: HTTP 200, 1 112 262 tavua, HTML. Ohjeen teksti on tarkistettu paikallisesta vastauksesta. Ohje käsittelee rinta- ja kohdunkaulaseulontaa, aluevalintoja sekä kutsuiän ja kutsuvuoden luokittelua. Vientipainikkeet ovat dokumentoituja, mutta vientiä ei testattu tässä erässä.

**Vahvistettu lisenssitieto:** ohjeen §6 ilmoittaa tarjotun aineiston CC BY 4.0 -lisenssin ja viittaa seulontasovellukseen; ohjeen päiväys on 26.5.2026. **Rajaus:** tämä vahvistaa sovelluksen ilmoitetun lisenssin. Erillisen `stats.cancerregistry.fi/joukkistilastot/suolisto.html`-raportin nimenomaista kuulumista samaan lisenssijulkaisuun ei tässä vahvistettu. Samassa HTML:ssä olevat karttapohjien CC-lisenssit eivät määrittele seulontadatan lisenssiä.

Myös [syöpätilastosovelluksen ohje](https://tilastot.syoparekisteri.fi/syovat/help_main_fi.html) ilmoittaa CC BY 4.0, mutta se koskee omaa tietotuotettaan. Tästä ei johdeta seulontaraportin käyttöehtoja.

## Mitä lataustesteissä tapahtui

| URL / aineisto | Väline ja tulos | Mitä osoittaa |
|---|---|---|
| Seulontasovelluksen juuri | Python GET 200 | Sovelluksen alkutilan HTML saatiin; ei datavienti |
| Seulontasovelluksen `help_main_fi.html` | Verkkolukija epäonnistui; Python GET 200 | Ohje oikeasti saatiin ja sisältö tarkistettiin |
| Syöpätilastosovelluksen ohje | Python GET 200 ja verkkolukija onnistui | Tämän tietotuotteen ohje saatiin |
| Seulontatilastosivu | Verkkolukija onnistui; Python GET 403 | Python-esto ei tarkoita sivun puuttumista |
| Rekisteröintisivu | Verkkolukija onnistui; Python GET 403 | Sisältö luettu verkkotyökalulla |
| Laatuselostesivu | Verkkolukija onnistui; Python GET 403 | Sisältö luettu; vanhoja määritelmiä ei sovellettu automaattisesti |

Pyyntökohtaiset URL:t, tarkat UTC-ajat, tilakoodit, koot ja tarkistussummat ovat `work/download_manifest.json`-tiedostossa. Aluksi haetun sovellusjuuren tarkkaa pyyntöaikaa ei kirjattu; sen tiedoston tallennusaika on merkitty erikseen.

Hakuja tehtiin Syöpärekisterin sivuilta sanoilla seulonta, CC BY, lisenssi, alueittain, ikä ja edellinen tulos sekä englanniksi screening/licence. Löytyi varmennettu sovelluslisenssi, mutta ei tarpeellista suoliston yhteisositettua vientiä. Hakutuloskatkelmaa ei käytetty vahvistetun väitteen ainoana näyttönä.

## Ehdotus seuraavalle tutkimuserälle

1. Varmista selaimessa, tarjoaako seulontasovellus uudemman suolistovalinnan tai jaettavan kyselylinkin. Tee pienin alue–ikä–sukupuolirajaus ja tarkista yksi vienti, jos valinta löytyy.
2. Etsi suolistoseulonnan määrittelyistä ensimmäisen kutsun luokan täsmällinen historiaikkuna sekä pilotin ja valtakunnallisen kutsun luokitus.
3. Jos avointa yhteisositetta ei löydy, merkitse H01:n kausaalinen/syyselittävä osa aineistorajoitteiseksi ja valmistele mentorille yksilöity kenttälista. Älä korvaa puuttuvaa ristiintaulukkoa marginaalien tulolla.
