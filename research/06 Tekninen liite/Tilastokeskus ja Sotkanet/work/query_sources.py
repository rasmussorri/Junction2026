from pathlib import Path
import urllib.request,json,hashlib,datetime
W=Path(__file__).resolve().parent
log=json.loads((W/'request_log.json').read_text())
def get(key,url,body=None):
 record={'key':key,'url':url,'method':'POST' if body else 'GET','timestamp_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 if body is not None:(W/(key+'_query.json')).write_text(json.dumps(body,ensure_ascii=False,indent=2))
 try:
  req=urllib.request.Request(url,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json','Accept':'application/json'})
  with urllib.request.urlopen(req,timeout=30) as r:
   data=r.read();record.update(status=r.status,content_type=r.headers.get('Content-Type'),bytes=len(data),sha256=hashlib.sha256(data).hexdigest());(W/(key+'.json')).write_bytes(data)
  d=json.loads(data);print(key,repr(d)[:1000]);return d
 except Exception as e:record['error']=str(e);print(key,e)
 finally:log.append(record);(W/'request_log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2))
def query(table,selection):
 meta=json.loads((W/(table+'_meta.json')).read_text());q=[]
 for v in meta['variables']:
  vals=selection[v['code']]
  assert set(vals)<=set(v['values'])
  q.append({'code':v['code'],'selection':{'filter':'item','values':vals}})
 return {'query':q,'response':{'format':'json-stat2'}}
get('11be_sample','https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/11be.px',query('11be',{'kuolinsyyt_80_20210101':['C50','C18'],'ikaryhma_10_20180101':['SSS'],'timeperiod_y':['2024','2025'],'sukupuoli_9_20180101':['SSS'],'contentscode':['ksyylkm']}))
get('13u5_sample','https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/ksyyt/13u5.px',query('13u5',{'alue_23_20260101':['SSS','HVA90'],'kuolinsyyt_1_20210101':['04-21','13'],'timeperiod_y':['2024','2025'],'contentscode':['ksyylkm','ksyycdr']}))
get('vaerak_catalog','https://pxdata.stat.fi/PxWeb/api/v1/en/StatFin/vaerak')
get('paavo_catalog','https://pxdata.stat.fi/PxWeb/api/v1/en/Postinumeroalueittainen_avoin_tieto')
get('sotka5643_sample','https://sotkanet.fi/rest/1.1/json?indicator=5643&years=2024&genders=total')
get('sotka5644_sample','https://sotkanet.fi/rest/1.1/json?indicator=5644&years=2024&genders=total')
