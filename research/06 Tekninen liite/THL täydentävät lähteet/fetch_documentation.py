from urllib.request import Request,urlopen
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime,timezone
import hashlib,json
p=Path(__file__).parent
base='https://sampo.thl.fi/pivot/prod/fi/'
items=[('cancellation_code.html', 'https://koodistopalvelu.kanta.fi/codeserver/pages/classification-view-page.xhtml?classificationKey=309&versionKey=386'), ('pth_definition.html', 'https://thl.fi/data-ja-tilastot/hoitoon-paasy/perusterveydenhuolto'), ('avohilmo_summary.html', 'https://sampo.thl.fi/pivot/prod/fi/avo/perus13/summary_ahil_perus13acc'), ('hilmo_api_index.json', 'https://sampo.thl.fi/pivot/prod/api/thil/perus01.json'), ('avohilmo_api_index.json', 'https://sampo.thl.fi/pivot/prod/api/avo/perus13.json')]
def fetch(item):
 f,u=item;d={'file':f,'url':u,'method':'GET','utc':datetime.now(timezone.utc).isoformat()}
 try:
  with urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r:
   d.update(status=r.status,final_url=r.url,content_type=r.headers.get('Content-Type'));b=r.read(3000001)
   if len(b)>3000000:raise ValueError('3MB cap exceeded')
   (p/f).write_bytes(b);d.update(bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
 except Exception as e:d['error']=str(e)
 return d
with ThreadPoolExecutor(max_workers=4) as pool:out=list(pool.map(fetch,items))
(p/'http_documentation_log.json').write_text(json.dumps(out,indent=2,ensure_ascii=False));print(json.dumps(out,indent=2,ensure_ascii=False))
