from urllib.request import Request,urlopen
from urllib.error import HTTPError
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib,json
p=Path(__file__).parent
items=[('nordcan_finland_breast_2024.json','https://canapi.iarc.who.int/api/nordcan/v2/961/data/population/0/2/(246)/(180)/?ages_group=0_17&year_start=2024&year_end=2024&year_grouped=1')]
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
(p/'nordcan_sample_http_log.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)); print(json.dumps(out,ensure_ascii=False,indent=2))
