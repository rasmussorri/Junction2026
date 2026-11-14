from pathlib import Path
import json
from datetime import datetime, timezone

root = Path(__file__).resolve().parents[1]
cards = root / '03 Dataset-kortit'

def card(prefix, text):
    files = list(cards.glob(prefix + ' *.md'))
    assert len(files) == 1, files
    files[0].write_text(text.strip() + '\n')

card('D10', '''# D10 Hilmo — somaattinen erikoissairaanhoito alueittain

Tarkistettu 14.11.2026. **Vahvistettu tietotuote ja oikea pieni poiminta; osa vertailumääritelmistä avoin.** Perhe: THL:n terveydenhuollon hoitoilmoitusrekisteri. Omistaja/julkaisija: THL.

| Kenttä | Varmennettu sisältö ja raja |
|---|---|
| Lähde | [Julkinen pivot-raportti](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j?filter=speciality-17958) |
| Havaintoyksikkö | Alue–vuosi-aggregaatti valitulla erikoisalalla ja mittarilla; ei potilasrivi |
| Koepoiminnan kohortti | Erikoisala 65 Syöpätaudit (`speciality-17958`), Kaikki potilaat (`measure-17881`) |
| Aika | Varsinaiset vuodet 2015–2025; mukana tekninen Kaikki vuodet -luokka, jonka solut tyhjät |
| Alueet | 26 luokkaa: alueet, Helsinki, Ahvenanmaa sekä kokonais-/tuntematon-/ulkomaatluokkia. Asuinalueen ja luokituksen ajankohdan täsmennys vielä kesken |
| Muut ulottuvuudet | Metadata: päädiagnoosi, ikä, sukupuoli. Kaikkia yhteispoimintoja ei testattu |
| Mittarit | Potilaat, hoitojaksot, avohoitokäynnit ja hoitoaika löytyvät metadatasta; tässä testattu potilasmäärä |
| Stage ja aikaleimat | Ei TNM-ulottuvuutta tai yksilöllisiä diagnoosi–hoito-päiviä tarkistetussa avoimessa kuutiossa |
| Pääsy ja formaatti | Julkinen HTML ja JSON; pieni GET onnistui ilman tunnistautumista |
| Lisenssi ja tuoreus | Raportin footer: CC BY 4.0; päivitys 11.8.2026 |
| Otoksen laatu | 26 × 12 mahdollista solua, 286 arvoa, 26 tyhjää kokonaisvuoden solua; ei prosenttina rekisterin puuttuvuudesta |
| Yhdistelyavain | Aluekoodi, vuosi ja valittu kohortti; kokonaisluokat erotettava. Nimi tai sama vuosi ei yksin riitä |
| Soveltuvuus | Palvelukäytön ja sen raportoinnin kuvaus; pieni poiminta ja kuvaaja noin 2–4 h arviolta |

**Todellinen testattu pyyntö:** [JSON, syöpätautien potilaat](https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j.json?row=area-2079&column=time-6656&filter=speciality-17958&filter=measure-17881). Vuoden 2025 Koko maa 74 504, Helsinki 9 327 ja Kainuu 288 täsmäsivät HTML-soluihin. Tarkka HTTP-loki, raakavastaus, dimensiot ja tarkistus: `06 Tekninen liite/THL jatkotarkistus`.

**Mitä voi päätellä:** kuinka paljon potilaita raportin määrittelemällä syöpätautien erikoisalalla on kirjattu vuosittain. **Mitä ei:** kaikkien syöpäpotilaiden määrä, syövän ilmaantuvuus, jonotuksen kesto tai toteutumatta jäänyt hoito. Syöpähoitoja tehdään myös muilla erikoisaloilla. Hoitojakson keskimääräinen kesto ei ole hoidon aloitusviive. Avoimesta aggregaatista ei linkitetä potilaita seulontatulokseen.

Ennen aluevertailun julkaisemista varmista aluemääritelmä, tuottajien kattavuusmuutokset ja pienlukusäännöt. Tuntemattomia/ulkomaisia/koko maan luokkia ei summata alueriveihin. Viikonlopun lisänäkymä on mahdollinen, mutta tämä ei yksin vastaa projektin tärkeimpiin hoitopolkuviivekysymyksiin. [[THL - viivemittari ja korjatut poiminnat]].
''')

card('D12', '''# D12 Avohilmo — ICD-10-diagnoosit alueittain

Tarkistettu 14.11.2026. **Vahvistettu korjattu C50-poiminta.** Perhe: THL:n perusterveydenhuollon avohoidon hoitoilmoitustiedot. Julkaisija THL.

| Kenttä | Varmennettu sisältö ja raja |
|---|---|
| Lähde | [Avohilmon diagnoosiraportti](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06) |
| Havaintoyksikkö | Alue–vuosi–diagnoosi-aggregaatti; Asiakkaat on valittu mittari, ei tapahtumarivi |
| Koepoiminnan rajaus | C50 Rintasyöpä (`diagnoosi-121077`), Asiakkaat (`measure-87454`) |
| Ajallinen kattavuus | 2018–2026 ja Kaikki vuodet; 2026 kesken |
| Alueet | 26 alueluokkaa; mukana kokonais- ja erityisluokkia. Asuinalueen täsmällinen ajankohta vielä tarkistettava |
| Muut muuttujat | Palvelusektori, palvelumuoto ja ammatti metadatassa. Tässä kuutiossa ei havaittu ikää/sukupuolta |
| Stage, hoidot ja viive | Ei stagea, hoitosuunnitelmaa, peruutussyytä tai potilaan tapahtumaketjun aikaleimoja |
| Pääsy | Julkinen HTML/JSON ilman tunnistautumista; oikea koepoiminta onnistui |
| Lisenssi ja päivitys | CC BY 4.0 footerissa; 11.11.2026 |
| Otoksen rakenne | 26 × 10 luokkaa, 258 arvoa, kaksi puuttuvaa avainta |
| Yhdistely | Aluekoodi–vuosi–diagnoosimääritelmä; ei henkilötason linkitystä eikä suoraa nimittäjää seulonnalle |
| Työmäärä | Tekninen kuvaileva näkymä arviolta 2–4 h; kattavuuspoikkeaman selvitys erikseen |

**Korjattu, oikeasti testattu [JSON-pyyntö](https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06.json?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454).** Alkuperäisen kartoituksen pelkkä diagnoosisuodatin palautti HTTP 200 mutta tyhjän arvolistan. Vasta alueiden eksplisiittinen valinta riveille tuotti C50-asiakkaat. Tyhjä vastaus ei siis ollut nolla asiakasta.

Vuoden 2025 HTML-vertailut: Etelä-Karjala 169, Helsinki 1 288, Kaikki kunnat 12 926. Kaikki vuodet -kokonaismäärä 50 426 ei ole vuosien summa, koska sama asiakas voi esiintyä eri vuosina. Eri sektoreita tai alueita ei myöskään summata ennen laskentasääntöjen varmistamista.

**Sopii:** diagnoosilla kirjattujen asiakkaiden palvelukäytön ja raportoinnin vaihtelun kuvaamiseen. **Ei sovi:** uusien rintasyöpätapausten, hoitamattomien potilaiden, hoidon ajoituksen tai seulonnan vaikuttavuuden laskentaan. Kanta-Hämeen 1 267 → 347 asiakasta vuosina 2024–2025 synnyttää kattavuuskysymyksen; se ei osoita hoidon romahtamista.

Jatkotesti vertaa ensin muita diagnooseja ja sektorikohtaisia kattavuusmuutoksia. Pienlukusääntö jäi vahvistamatta, koska ohjesivu palautti 403. Tarkat lähdevastaukset ja laskenta: `06 Tekninen liite/THL jatkotarkistus`; [[THL - viivemittari ja korjatut poiminnat]].
''')

card('D14', '''# D14 Erikoissairaanhoidon hoitoonpääsy ja jonot

Tarkistettu 14.11.2026. **Vahvistettu rajattu jonotilanteen numeropoiminta.** Perhe: THL:n julkisen kiireettömän erikoissairaanhoidon hoitoonpääsytilasto. Tämä on oma keruu/tietotuote; sitä ei rinnasteta Hilmon kaikkiin hoitotapahtumiin.

| Kenttä | Varmennettu sisältö ja raja |
|---|---|
| Lähde | [Jonotilanne](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne), [THL:n tilastokuvaus](https://thl.fi/data-ja-tilastot/hoitoon-paasy/erikoissairaanhoito) |
| Kohortti | Erikoisala 65 Syöpätaudit, tunniste 862186; kiireettömän hoidon jonossa mittaushetkellä olevat |
| Mittarit | Kaikki odottajat 738214; yli 180 vrk odottaneet 738216; heidän osuutensa 738217; 1–90 vrk määrä 738218 |
| Aika | 110 ajankohtaluokkaa koepoiminnassa; uusin havaittu 30.9.2026. Ei henkilön diagnoosipäivä |
| Alue | 20 tuottajaluokkaa mukaan lukien julkaistu kokonaisrivi. Tuottaja ei automaattisesti ole potilaan asuinalue |
| Syöpä/stage | Erikoisala, ei yksittäinen syöpädiagnoosi tai TNM |
| Pääsy | HTML ja JSON ilman tunnistautumista, useita pieniä mittarikohtaisia GET-hakuja testattu |
| Lisenssi | THL:n raporttijakelun käyttöehto tarkistettava nimenomaan tästä tuotteesta ennen uudelleenjulkaisua; Hilmon footer ei yksin kata tätä tuotetta |
| Havaittu laatu | 2 200 mahdollista solua; 1 444 eksplisiittistä arvoa ja 756 puuttuvaa avainta per mittari. Ajanjaksot ja organisaatiot vaihtelevat |
| Viivemääritelmä | Jonossa vietetyn ajan luokka; täsmällinen alkutapahtuma keruuohjeesta vielä auki |
| Yhdistely | Tuottaja–mittauspäivä–erikoisala–mittari. Ei suoraa asuinalue–vuosi-liitosta seulontaan |
| Työmäärä | Rajattu nykyhetken näkymä arviolta 2–4 h; historialliset vertailut vaativat organisaatiokartoituksen |

**Testattu [yli 180 vrk osuus JSON:na](https://sampo.thl.fi/pivot/prod/fi/eshjono/jonotilanne/fact_eshjono_jonotilanne.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738217).** Lukumäärä saadaan vaihtamalla viimeiseksi mittariksi 738216. Kaikki 1 444 vertailukelpoista osuutta täsmäsivät kaavaan 100 × yli180 / kaikki_odottaneet yhden desimaalin pyöristystarkkuudella. Tässä lukumäärä-/osuusaineistossa 1 117 eksplisiittistä nollaa; niitä ei sekoiteta puuttuviin avaimiin.

Syyskuu 2026: julkaistu kokonaisrivi 486 odottajaa, joista kaksi yli 180 vrk eli 0,4 %. Satakunta 2/8 eli 25 %. Pieni nimittäjä on näytettävä osuuden rinnalla. Helsinki, Kainuu, Pirkanmaa ja Päijät-Häme olivat näytteen viimeisessä ajankohdassa tyhjiä. Kokonaisrivi ei todista niiden täydellistä kattavuutta.

**Sopii:** tietyn erikoisalan kiireettömän jonon tilanteen kuvaamiseen. **Ei sovi:** kaikkien syöpäpotilaiden diagnoosi–hoito-mediaaniviiveeseen, kiireelliseen hoitoon, peruttuihin aikoihin tai hoidon laatujärjestykseen. Yli 180 vrk ei tässä ole osoitettu syöpäkohtaiseksi tavoiteajaksi. Jonossa olevien poikkileikkaus painottuu pitkiin odotuksiin; se ei ole hoidettujen potilaiden viivejakauma.

Tekninen toistettavuus, alkuperäiset solut ja lähdemääritelmät: [[THL - viivemittari ja korjatut poiminnat]], `06 Tekninen liite/THL jatkotarkistus`. MVP-portissa jäljellä täsmällinen odotusajan alku ja tämän tuotteen käyttöehdon vahvistus.
''')

hp = root / '10 Hypoteesit ja löydökset/hypoteesit.json'
h = json.loads(hp.read_text())
h01 = h['hypotheses'][0]
testname='2024 invitation denominator sensitivity and national sex-history standardization'
if not any(x['test']==testname for x in h01['tests_completed']):
    h01['tests_completed'].append({'test':testname,'result':'1399 selected without mailed invitation; denominator change +0.2450 pp. 2022 sex-history weights give 2024 68.7813% versus observed 73.5398%.','interpretation':'Simple marginal composition-only explanation not supported; joint age-sex-history-region claim remains unresolved.','evidence':'H01 jatkotutkimus/H01 - kierrosrakenteen ja nimittäjän testi.md'})
h01['status']='avoin; osittainen vastanäyttö yksinkertaiselle marginaaliselitykselle'
h01['next_action']='Resolve availability of joint region × year × age60 × sex × first-invitation selected/invited/participating counts; distinguish pilot history. Do not add correlations of existing marginals as substitute.'
hp.write_text(json.dumps(h,ensure_ascii=False,indent=2)+'\n')

q=root/'00 Ohjaus/Tutkimusjono.md'
text=q.read_text()
for task in ('T01','T03','T04','T05','T07','T13','T14','T18'):
    text=text.replace(f'- [ ] {task} ',f'- [x] {task} ')
text+='\n## Tarkistusrajojen checkpoint 14.11.2026\n\nValmis rasti tarkoittaa sovitun tarkistuserän valmistumista, ei kaikkien aineiston ominaisuuksien vahvistusta. T01: toimitetut PDF:t luettu, haaste-URL 404. T03: stage-CSV ja keuhkoraportti tarkistettu. T04: jonon osuus/nimittäjä testattu; odotusajan alku ja käyttöehto auki. T05: Hilmo ja korjattu Avohilmo-poiminta toimivat, aluemääritelmät kesken. T07: Kela-pienpoiminnat ja lähdeoikaisut, Cognos-vienti kesken. T13/T14: profiilit valmiit. T18: H01:n marginaalitesti tehty; yhteisosituksen tavoite edelleen auki.\n'
q.write_text(text)

now=datetime.now(timezone.utc).isoformat()
statepath=root/'00 Ohjaus/state.json'
state=json.loads(statepath.read_text())
state.update(last_checkpoint=now,last_completed_task='Integrated PDF/H01/THL/Kela evidence; FinnGen manifest tested and version discrepancies retained',completed_cycles=3)
statepath.write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n')
lock=root/'work/research.lock'
l=json.loads(lock.read_text());l['updated']=now;lock.write_text(json.dumps(l)+'\n')
with (root/'07 Tutkimusloki/Tutkimusloki.md').open('a') as f:
    f.write(f'\n## Checkpoint {now}\n\nTHL:n oikeat viivemittarit sekä Hilmon/Avohilmon poiminnat tarkistettu ja kortit päivitetty. H01:n kutsukattavuus- ja historiavakiointitestit eivät tue yksinkertaista jakaumaselitystä; yhteisositus edelleen avoin. Kela-korvausoikeudet uusi toimiva pieni JSON-lähde, NIT137A arkisto 2008–2019. FinnGen R13 -manifestissa 2 754 riviä vs julkaisusivun 2 755 endpointia; Risteyksen pääsivu R14. Versioeroja ei silotettu. Jatkuva työ jatkuu seuraavaan erään.\n')
print('Integrated cards D10 D12 D14, H01 tests, queue and checkpoint')
