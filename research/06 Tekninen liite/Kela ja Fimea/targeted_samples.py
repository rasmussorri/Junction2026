from pathlib import Path
import urllib.request,urllib.parse,json,hashlib,datetime
p=Path(__file__).resolve().parent
q={'resource_id':'cc74cc46-2b92-42b5-9a52-55adb3df512f','limit':10,'filters':json.dumps({'korvausoikeus_koodi':115,'vuosi':2025}),'sort':'vuodenlopussa_lkm desc'}
urls={
 'rights_breast2025_sample.json':'https://avoindata.suomi.fi/data/api/3/action/datastore_search?'+urllib.parse.urlencode(q),
 'fimea_adverse2024_atc.pdf':'https://sic.fimea.fi/documents/135733865/231624454/TEKSTIVASTINE%20EXCEL%20Kuva%201.%20Haittavaikutusilmoitusten%20m%C3%A4%C3%A4r%C3%A4%20l%C3%A4%C3%A4keaineiden%20ATC-luokittain%20(1).pdf/476ea4d7-daa0-7caa-27bd-60b6504cd2da?t=1765475080391'
}
logs=[]
for n,u in urls.items():
 rec={'file':n,'url':u,'method':'GET','at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  with urllib.request.urlopen(u,timeout=30) as r:
   b=r.read(1_000_001)
   if len(b)>1_000_000:raise ValueError('1MB cap')
   (p/n).write_bytes(b);rec.update(status=r.status,content_type=r.headers.get('Content-Type'),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
 except Exception as e:rec['error']=str(e)
 logs.append(rec)
(p/'targeted_http_log.json').write_text(json.dumps(logs,ensure_ascii=False,indent=2));print(json.dumps(logs,ensure_ascii=False,indent=2))
if (p/'rights_breast2025_sample.json').exists():
 d=json.loads((p/'rights_breast2025_sample.json').read_text());print('result',str(d)[:2500])
