from pathlib import Path
from collections import Counter
import re, json, html, hashlib, datetime
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'09 Aineistojen syväanalyysi'
SOURCE=ROOT/'06 Tekninen liite'
def plain(s): return ' '.join(html.unescape(re.sub('<[^>]*>',' ',s)).split())
def independent_tables(s):
    s=re.sub(r'<script\b[^>]*>.*?</script>','',s,flags=re.S|re.I)
    return [ [[plain(c) for c in re.findall(r'<t[dh]\b[^>]*>(.*?)</t[dh]>',r,re.S|re.I)] for r in re.findall(r'<tr\b[^>]*>(.*?)</tr>',t,re.S|re.I)] for t in re.findall(r'<table\b[^>]*>.*?</table>',s,re.S|re.I)]
report={'created_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Saved snapshots; verification is sample-specific, not population completeness.'}
for name,area_i in [('suolisto',24),('rinta',50)]:
    raw=SOURCE.joinpath(name+'.html').read_text(); extracted=json.loads(SOURCE.joinpath(name+'_tables.json').read_text()); independent=independent_tables(raw)
    p={'sha256_html':hashlib.sha256(raw.encode()).hexdigest(),'real_table_count':len(independent),'extracted_table_count':len(extracted),'raw_table_token_count':len(re.findall(r'<table\b',raw)), 'all_cells_match_independent_parser':independent==[t['rows'] for t in extracted]}
    p['manual_checks']=[{'table_index':area_i,'row_index':r,'column_index':2,'region':independent[area_i][r][0],'raw_html_value':independent[area_i][r][2],'extracted_value':extracted[area_i]['rows'][r][2]} for r in [2,3,4]]
    p['special_tokens_after_two_header_rows']=dict(Counter(c for t in extracted for row in t['rows'][2:] for c in row if c in ('','-','--','..','...','NA','N/A','NaN','*','0','0,0')))
    p['special_token_locations']=[{'table':i,'row':r,'column':c,'value':v,'heading':t['headings'],'row_label':row[0]} for i,t in enumerate(extracted) for r,row in enumerate(t['rows']) if r>=2 for c,v in enumerate(row) if v in ('','-','--','..','...','NA','N/A','NaN','*')]
    area=[(i,t) for i,t in enumerate(extracted) if 'Hyvinvointialueet' in t['headings'] and 'Seulontaketju' in t['headings']]
    p['area_year_profiles']=[];p['arithmetic_checks']=[]
    for i,t in area:
        rows=t['rows'][2:];detail=[r for r in rows if r[0]!='Yhteensä'];total=next(r for r in rows if r[0]=='Yhteensä'); countcols=[1,2,4,6]+([8] if name=='suolisto' else [])
        p['area_year_profiles'].append({'year':t['headings'][-1],'regions':[r[0] for r in detail],'row_widths':dict(Counter(map(len,rows))),'duplicate_region_labels':len(detail)-len({r[0] for r in detail}),'total_count_matches':{str(c):sum(int(r[c]) for r in detail)==int(total[c]) for c in countcols}})
        for row in rows:
            for label, numerator,denominator,pct in ([('participation',2,1,3),('positive',4,2,5),('colonoscopy_test_positive_denominator',6,4,7),('treatment_colonoscopy_denominator',8,6,9)] if name=='suolisto' else [('participation',2,1,3),('recall',4,2,5),('referral_recall_denominator',6,4,7)]):
                a,b=int(row[numerator]),int(row[denominator]); reported=float(row[pct].replace(',','.')); calc=100*a/b if b else None
                p['arithmetic_checks'].append({'year':t['headings'][-1],'region':row[0],'metric':label,'numerator':a,'denominator':b,'reported_pct':reported,'calculated_pct':calc,'within_half_tenth':calc is not None and abs(calc-reported)<=0.050001})
    p['arithmetic_summary']={'checks':len(p['arithmetic_checks']),'failed':sum(not a['within_half_tenth'] for a in p['arithmetic_checks'])}
    if name=='suolisto':
        r=extracted[0]['rows'][-1];p['denominator_issue']={'table_header':extracted[0]['rows'][0][4],'reported_percent':r[7],'colonoscopy_N':int(r[6]),'test_positive_N':int(r[4]),'participants_N':int(r[2]),'percent_of_positive':100*int(r[6])/int(r[4]),'percent_of_participants':100*int(r[6])/int(r[2])}
    report[name]=p
j=json.loads(SOURCE.joinpath('thl_eshjono.json').read_text())['dataset']; ex=json.loads(OUT.joinpath('work/thl_explicit.json').read_text())['dataset']; vals=j['value']; dims=j['dimension']; size=dims['size']; p={'dimension_ids':dims['id'],'shape':size,'explicit_value_count':len(vals),'absent_cell_count':size[0]*size[1]-len(vals),'explicit_null_count':sum(v is None for v in vals.values()),'explicit_zero_count':sum(str(v) in ('0','0.0') for v in vals.values()),'value_types':dict(Counter(type(v).__name__ for v in vals.values())),'explicit_filter_equals_original':j==ex,'specialty':{'sid':862186,'label':'65 Syöpätaudit'},'measure':{'sid':738214,'label':'Hoitoa odottaneet'}}
s=OUT.joinpath('work/thl_filtered.html').read_text();t=re.search(r'<table id="to-main-content".*?</table>',s,re.S)[0]
rows=[]
for r in re.findall(r'<tr\b[^>]*>.*?</tr>',t,re.S):
    hdr=re.search(r'<a[^>]+class="rowhdr"[^>]*>(.*?)</a>',r,re.S)
    if hdr:rows.append((plain(hdr[1]),[plain(c) for c in re.findall(r'<td[^>]*>(.*?)</td>',r,re.S)]))
indices={dim:sorted(dims[dim]['category']['index'],key=dims[dim]['category']['index'].get) for dim in dims['id']}
p['html_rows']=len(rows);p['html_all_cells_equal_json']=all(cell==vals.get(str(i*size[1]+k),'') for i,(_,cells) in enumerate(rows) for k,cell in enumerate(cells))
p['manual_checks']=[]
for i in [0,1,2]:
 k=108; a=indices['ajankohta'][k];p['manual_checks'].append({'producer':rows[i][0],'date':dims['ajankohta']['category']['label'][a],'html_value':rows[i][1][k],'json_value':vals.get(str(i*size[1]+k))})
p['latest_date_absences']=[rows[i][0] for i in range(len(rows)) if str(i*size[1]+108) not in vals]
p['absent_cells_warning']='Not a measured missing-data rate: cells include aggregate selections and structurally unavailable producer-period combinations; absent is not zero.'
report['thl']=p
OUT.joinpath('work/tarkistukset_yksityiskohtaiset.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
compact=json.loads(json.dumps(report))
for name in ['suolisto','rinta']: compact[name].pop('arithmetic_checks')
OUT.joinpath('aineistoprofiilit.json').write_text(json.dumps(compact,ensure_ascii=False,indent=2))
for n in ['suolisto','rinta']:
 p=report[n]; print(n,p['real_table_count'],p['all_cells_match_independent_parser'],p['arithmetic_summary']);print('token exceptions',p['special_token_locations']);print('sumtests',[(y['year'],y['total_count_matches']) for y in p['area_year_profiles']])
print('THL',p if False else report['thl'])
