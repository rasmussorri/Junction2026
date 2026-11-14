from pathlib import Path
import urllib.request,json,hashlib,datetime,concurrent.futures
P=Path(__file__).resolve().parent
urls={
 'kela_rights_package.json':'https://avoindata.suomi.fi/data/api/3/action/package_show?id=70832958-f7b6-4e09-8350-615362e6ee30',
 'kela_general_package.json':'https://avoindata.suomi.fi/data/api/3/action/package_show?id=22368122-4f1b-4a8c-8a82-e70cdca843c9',
 'kelasto_nit137_metadata.html':'https://raportit.kela.fi/approot/lisatied/NIT137A_fi.html',
 'kelasto_nit137_report.html':'https://raportit.kela.fi/ibi_apps/WFServlet?IBIF_ex=NIT137AL&YKIELI=E',
 'fimea_consumption.html':'https://fimea.fi/en/databases_and_registeries/consumption',
 'fimea_news2025.html':'https://fimea.fi/-/laakemyynti-kasvoi-165-miljoonaa-euroa-vuonna-2025-uudet-laakkeet-ja-laajentunut-kaytto-selittavat-kasvua',
 'fimea_adverse2025.html':'https://sic.fimea.fi/-/millaisia-haittavaikutuksia-laakkeista-ilmoitettiin-vuonna-2025-',
 'fimea_adverse2024.html':'https://sic.fimea.fi/-/millaisia-haittavaikutuksia-laakkeista-ilmoitettiin-vuonna-2024-',
 'julkari_2025.html':'https://www.julkari.fi/items/55de2a38-552a-4014-863f-5c54afdeef94',
 'kela_rights_page.html':'https://tietotarjotin.fi/tilastodata/1084823/voimassa-olleet-alkaneet-ja-paattyneet-laakekorvausoikeudet'
}
def fetch(item):
 n,u=item;rec={'file':n,'url':u,'at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'GET'}
 try:
  with urllib.request.urlopen(u,timeout=30) as r:
   b=r.read(2_000_001)
   if len(b)>2_000_000:raise ValueError('2MB cap')
   (P/n).write_bytes(b);rec.update(status=r.status,content_type=r.headers.get('Content-Type'),final_url=r.url,bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
 except Exception as e:rec['error']=str(e)
 return rec
rows=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,urls.items()));(P/'http_log.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
for r in rows:print(r['file'],r.get('status'),r.get('bytes'),r.get('error',''))
