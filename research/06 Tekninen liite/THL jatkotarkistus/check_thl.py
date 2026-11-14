from pathlib import Path
import urllib.request,json,hashlib,datetime,concurrent.futures
ROOT=Path(__file__).resolve().parent
BASE='https://sampo.thl.fi/pivot/prod/fi/'
Q=BASE+'eshjono/jonotilanne/fact_eshjono_jonotilanne'
H=BASE+'thil/perus03j/fact_thil_perus03j'
A=BASE+'avo/perus06/fact_ahil_perus06'
urls={
 'queue_gt180_pct.json':Q+'.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738217',
 'queue_gt180_count.json':Q+'.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738216',
 'queue_1_90_count.json':Q+'.json?row=tuottaja-976329&column=ajankohta-976319&filter=erikoisala-862186&filter=measure-738218',
 'queue_measure_pct.html':Q+'/738217',
 'queue_measure_count.html':Q+'/738216',
 'hilmo_oncology.json':H+'.json?filter=speciality-17958',
 'hilmo_dimensions.js':H+'.dimensions.json',
 'hilmo_view.html':H+'?filter=speciality-17958',
 'avohilmo_c50.json':A+'.json?filter=diagnoosi-121077',
 'avohilmo_dimensions.js':A+'.dimensions.json',
 'avohilmo_view.html':A+'?filter=diagnoosi-121077',
}
def fetch(item):
 name,url=item;row={'filename':name,'url':url,'requested_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'GET'}
 try:
  with urllib.request.urlopen(url,timeout=40) as r:
   data=r.read(5_000_001);row.update(http_status=r.status,content_type=r.headers.get('Content-Type'),final_url=r.url)
   if len(data)>5_000_000:raise ValueError('response exceeds 5MB cap')
   (ROOT/name).write_bytes(data);row.update(bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
 except Exception as e:row['error']=str(e)
 return row
rows=list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch,urls.items()))
(ROOT/'http_test_log.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
for x in rows:print(x['filename'],x.get('http_status'),x.get('bytes'),x.get('error',''))
