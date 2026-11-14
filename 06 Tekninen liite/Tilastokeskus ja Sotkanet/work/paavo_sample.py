from pathlib import Path
import json,urllib.request,datetime,hashlib,itertools,subprocess
W=Path(__file__).resolve().parent
m=json.loads((W/'paavo12ey_meta.json').read_text());sel={'postinumeroalue_4_20260101':['00100','00230'],'contentscode':['he_vakiy','he_miehet','he_naiset','he_kika','he_60_64'],'timeperiod_y':['2024']}
q={'query':[],'response':{'format':'json-stat2'}}
for v in m['variables']:
 assert set(sel[v['code']])<=set(v['values']);q['query'].append({'code':v['code'],'selection':{'filter':'item','values':sel[v['code']]}})
(W/'paavo12ey_sample_query.json').write_text(json.dumps(q,indent=2));url='https://pxdata.stat.fi/PxWeb/api/v1/en/Postinumeroalueittainen_avoin_tieto/2026/12ey_ja2026.px';log=json.loads((W/'request_log.json').read_text());r={'key':'paavo12ey_sample','url':url,'method':'POST','timestamp_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
try:
 with urllib.request.urlopen(urllib.request.Request(url,data=json.dumps(q).encode(),headers={'Content-Type':'application/json'}),timeout=30) as resp:
  b=resp.read();r.update(status=resp.status,content_type=resp.headers.get('Content-Type'),bytes=len(b),sha256=hashlib.sha256(b).hexdigest());(W/'paavo12ey_sample.json').write_bytes(b)
except Exception as e:r['error']=str(e)
log.append(r);(W/'request_log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2))
# Decode using returned index order, never request order.
profiles={}
for name in ['11be','13u5','11re','paavo12ey']:
 d=json.loads((W/(name+'_sample.json')).read_text());keys=[]
 for dim in d['id']:
  cat=d['dimension'][dim]['category'];idx=cat['index'];keys.append(sorted(idx,key=idx.get) if isinstance(idx,dict) else idx)
 rows=[]
 for i,coords in enumerate(itertools.product(*keys)):
  row={k:{'code':c,'label':d['dimension'][k]['category']['label'][c]} for k,c in zip(d['id'],coords)}
  val=d['value'];row['value']=val[i] if isinstance(val,list) else val.get(str(i));row['status']=d.get('status',{}).get(str(i)) if isinstance(d.get('status',{}),dict) else d['status'][i];rows.append(row)
 profiles[name]={'updated':d.get('updated'),'shape':d['size'],'notes':d.get('note'),'rows':rows,'status':d.get('status')}
 print(name,'updated',d.get('updated'),'values',[x['value'] for x in rows],'status',d.get('status'))
(W/'decoded_samples.json').write_text(json.dumps(profiles,ensure_ascii=False,indent=2))
