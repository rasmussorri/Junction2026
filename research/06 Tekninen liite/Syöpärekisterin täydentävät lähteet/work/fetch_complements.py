from pathlib import Path
from datetime import datetime,timezone
import urllib.request,json,hashlib
p=Path(__file__).resolve().parent
sources={'clinical_page':'https://syoparekisteri.fi/tilastot/kliinisten-ilmoitusten-tilasto/','myeloma':'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/myeloma.html','requests':'https://cancerregistry.fi/services/information-requests/','catalog':'https://aineistokatalogi.fi/catalog/studies/21085403-7be8-4f93-bf05-231518c642a0'}
log=[]
for key,url in sources.items():
 e={'key':key,'url':url,'timestamp_utc':datetime.now(timezone.utc).isoformat(),'method':'GET'}
 try:
  with urllib.request.urlopen(url,timeout=30) as r:
   raw=r.read(20000001)
   if len(raw)>20000000:raise RuntimeError('Size cap 20MB exceeded')
   (p/(key+'.html')).write_bytes(raw);e.update(status=r.status,bytes=len(raw),content_type=r.headers.get('Content-Type'),final_url=r.url,sha256=hashlib.sha256(raw).hexdigest())
 except Exception as ex:e['error']=str(ex)
 log.append(e)
(p/'http_log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n');print(json.dumps(log,ensure_ascii=False,indent=2))
