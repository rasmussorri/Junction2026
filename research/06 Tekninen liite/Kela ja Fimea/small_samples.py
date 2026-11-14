from pathlib import Path
import urllib.request,urllib.parse,json,datetime,hashlib
p=Path(__file__).resolve().parent
base='https://avoindata.suomi.fi/data/api/3/action/'
urls={
 'rights_schema.json':'https://avoindata.suomi.fi/data/dataset/70832958-f7b6-4e09-8350-615362e6ee30/resource/b223d529-6ccb-48e8-9124-662da96ce97f/download/package.json',
 'general_schema.json':'https://avoindata.suomi.fi/data/dataset/22368122-4f1b-4a8c-8a82-e70cdca843c9/resource/58500dce-e46e-476c-be70-6e54c2fac44c/download/package.json',
 'rights_sample.json':base+'datastore_search?resource_id=cc74cc46-2b92-42b5-9a52-55adb3df512f&limit=3',
 'general2025_sample.json':base+'datastore_search?resource_id=ed6d4355-f72e-4b4c-8f08-3b7875327b72&limit=3',
}
log=[]
for name,u in urls.items():
 rec={'file':name,'url':u,'method':'GET','at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  with urllib.request.urlopen(u,timeout=30) as r:
   b=r.read(1_000_001)
   if len(b)>1_000_000:raise ValueError('1MB cap')
   (p/name).write_bytes(b);rec.update(status=r.status,content_type=r.headers.get('Content-Type'),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
 except Exception as e:rec['error']=str(e)
 log.append(rec)
(p/'sample_http_log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2));print(json.dumps(log,indent=2))
