# PDF-aineiston tekninen tarkistusloki

Tarkistus 14.11.2026 Europe/Helsinki. Työ rajattiin kansioon `01 Tausta/PDF-tarkistus`; alkuperäisiä PDF:iä ei muutettu.

- Popplerin `pdfinfo`: sivumäärät 64, 111 ja 2; metadata ja SHA-256 tallennettu `work/pdf_manifest.json`.
- Popplerin `pdftotext -layout`: kaikkien kolmen PDF:n tekstikerros purettu tiedostoihin `work/1_text.txt`, `2_text.txt`, `3_text.txt`. Nämä ovat työaineistoa, eivät uusi käyttäjälle tarkoitettu julkaisu.
- `pdfinfo -url`: kaikkien kolmen dokumentin URL-annotaatiot tiedostoihin `work/1_urls.txt`, `2_urls.txt`, `3_urls.txt`. Linkkikokoelman deduplikoitu URL-lista on `work/link_inventory.json`.
- `pdftoppm`: PNG-renderöinti ja visuaalinen tarkistus P1:n sivuille 5 ja 36; P2:n sivuille 50, 57, 60 ja 80; P3:n sivulle 1. Sivunumerointi, taulukon otsikot, alaviitteet ja tavoitteiden aikajänne tarkistettiin kuvista.
- Pythonin aidot GET-pyynnöt: kumpikin STM:n PDF-osoite palautti 403; haasteosoite palautti 404. Tarkat URL:t ja UTC-aikaleimat ovat `work/official_download_tests.json` ja `work/challenge_test.json`. Etäkopioiden ja toimitettujen PDF:ien bittiyhtäläisyyttä ei voitu siksi todeta.
- Verkkolukijalla avattu FICANin tiekartan toteutussivu vahvisti julkaisuajankohdan 23.9.2026 ja linkin STM:n julkaisuun. Päiväys ei perustu hakukatkelmaan.
- Julkarin pre-pack-lääketilaston kohdesivu palautti verkkolukijalle 403. THL-määritysoppaan vanha osoite palautti 404. Uusi hakutuloksesta löytynyt bitstream-osoite on vielä testaamaton lähdevihje.

P1:n tavoitelukujen visuaalinen tarkistus ei ole mittarien laskennan validointi eikä datan ajantasaisuustarkistus. P2:n aikatauluja ei tulkittu jo toteutuneiksi toimenpiteiksi.
