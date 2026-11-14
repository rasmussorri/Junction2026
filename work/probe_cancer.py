from pathlib import Path
import urllib.request,json,hashlib,datetime,re
from html.parser import HTMLParser
out=Path('06 Tekninen liite/Syöpärekisteri'); logs=[]
urls={'cancer2024':'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html','lung':'https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html','app':'https://tilastot.syoparekisteri.fi/syovat/'}
class P(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.ignore=0;self.links=[]
 def handle_starttag(self,t,a):
  attrs=dict(a)
  if t=='script':self.ignore+=1
  if self.ignore:return
  if t=='a' and 'href' in attrs:self.links.append(attrs['href'])
  if t=='table':self.table=[]
  if t=='tr' and self.table is not None:self.row=[]
  if t in ['td','th'] and self.row is not None:self.cell=[]
 def handle_data(self,s):
  if not self.ignore and self.cell is not None:self.cell.append(s)
 def handle_endtag(self,t):
  if t=='script':self.ignore=max(0,self.ignore-1);return
  if self.ignore:return
  if t in ['td','th'] and self.cell is not None:self.row.append(' '.join(' '.join(self.cell).split()));self.cell=None
  if t=='tr' and self.row is not None:self.table.append(self.row);self.row=None
  if t=='table' and self.table is not None:self.tables.append(self.table);self.table=None
for name,url in urls.items():
 stamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
 try:
  with urllib.request.urlopen(url,timeout=40) as r:
   data=r.read(20000001); status=r.status;ct=r.headers.get('Content-Type');final=r.url
  if len(data)>20000000:raise ValueError('Response over 20 MB cap; not saved')
  (out/(name+'.html')).write_bytes(data);html=data.decode('utf-8');p=P();p.feed(html)
  (out/(name+'_tables.json')).write_text(json.dumps(p.tables,ensure_ascii=False,indent=2));(out/(name+'_links.json')).write_text(json.dumps(p.links,ensure_ascii=False,indent=2))
  logs.append(dict(name=name,url=url,final_url=final,utc=stamp,status=status,content_type=ct,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),tables=len(p.tables)))
 except Exception as e:logs.append(dict(name=name,url=url,utc=stamp,error=str(e)))
(out/'tests.json').write_text(json.dumps(logs,ensure_ascii=False,indent=2));print(json.dumps(logs,indent=2))
