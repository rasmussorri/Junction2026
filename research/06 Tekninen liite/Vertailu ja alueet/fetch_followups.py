from urllib.request import Request,urlopen
from urllib.error import HTTPError
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib,json
p=Path(__file__).parent
items=[('nordcan_main.js','https://nordcan.iarc.who.int/assets/main-CSBjvrOB.js'),('ecis_database.html','https://ecis.jrc.ec.europa.eu/database-description'),('ecis_explorer.html','https://ecis.jrc.ec.europa.eu/data-explorer'),('paijathame_202604.pdf','https://paijatha.fi/wp-content/uploads/2026/05/Jonoraportti_04_2026.pdf')]
def fetch(item):
 f,u=item; d={'file':f,'url':u,'method':'GET','utc':datetime.now(timezone.utc).isoformat()}
 try:
  with urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:
   d.update(status=r.status,final_url=r.url,content_type=r.headers.get('Content-Type')); b=r.read(5000001)
   if len(b)>5000000: raise ValueError('Limit 5 MB exceeded')
   (p/f).write_bytes(b); d.update(bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
 except Exception as e:d['error']=str(e)
 return d
with ThreadPoolExecutor(max_workers=4) as pool: out=list(pool.map(fetch,items))
(p/'followup_http_log.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)); print(json.dumps(out,ensure_ascii=False,indent=2))
