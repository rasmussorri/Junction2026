from pathlib import Path
import json,urllib.request,hashlib,datetime
p=Path(__file__).resolve().parent
A='https://sampo.thl.fi/pivot/prod/fi/avo/perus06/fact_ahil_perus06'
H='https://sampo.thl.fi/pivot/prod/fi/thil/perus03j/fact_thil_perus03j'
urls={
 'avohilmo_c50_area_clients.json':A+'.json?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454',
 'avohilmo_c50_area_view.html':A+'?row=alue-11810&column=aika-87596&filter=diagnoosi-121077&filter=measure-87454',
 'hilmo_oncology_explicit.json':H+'.json?row=area-2079&column=time-6656&filter=speciality-17958&filter=measure-17881',
 'avohilmo_metadata.html':A+'/meta',
 'hilmo_metadata.html':H+'/meta',
}
rows=[]
for n,u in urls.items():
 row={'filename':n,'url':u,'requested_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'GET'}
 try:
  with urllib.request.urlopen(u,timeout=30) as r:
   b=r.read(5_000_001)
   if len(b)>5_000_000:raise ValueError('5MB cap')
   row.update(http_status=r.status,content_type=r.headers.get('Content-Type'),bytes=len(b),sha256=hashlib.sha256(b).hexdigest());(p/n).write_bytes(b)
 except Exception as e:row['error']=str(e)
 rows.append(row)
(p/'http_followup_log.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
for r in rows:print(r['filename'],r.get('http_status'),r.get('bytes'),r.get('error',''))
