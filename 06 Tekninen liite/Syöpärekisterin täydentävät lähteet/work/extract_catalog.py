from pathlib import Path
import json,hashlib
p=Path(__file__).resolve().parent;f=p/'catalog_study.json';d=json.loads(f.read_text())
profiles=[]
for ds in d['datasets']:
 fields=[]
 for v in ds.get('instanceVariables',[]):
  fields.append({'id':v['id'],'technical_name':v.get('technicalName'),'label':v.get('prefLabel',{}).get('fi'),
   'group':v.get('partOfGroup',{}).get('fi'),'data_type':v.get('dataType'),'default_missing_value':v.get('defaultMissingValue'),
   'description':v.get('description',{}).get('fi'),'code_list':v.get('codeList')})
 profiles.append({'dataset_id':ds['id'],'label':ds['prefLabel']['fi'],'field_count':len(fields),
  'catalog_updated':ds.get('lastModifiedDate'),'fields':fields})
assert [r['field_count'] for r in profiles]==[38,41,26,49]
obj={'source_url':'https://aineistokatalogi.fi/api/v1/public/studies/'+d['id'],
 'source_sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'confidentiality_class':d.get('confidentialityClass'),
 'catalog_updated':d.get('lastModifiedDate'),'profiles':profiles}
(p/'catalog_dataset_profiles.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
print('Parsed',sum(r['field_count'] for r in profiles),'public metadata fields across',len(profiles),'datasets; no individual records downloaded.')
