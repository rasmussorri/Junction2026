from pathlib import Path
import json,hashlib,re,html
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'10 Hypoteesit ja löydökset/H01 jatkotutkimus'
SOURCE=ROOT/'06 Tekninen liite'
class Text(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.parts=[]
 def handle_starttag(self,t,a):
  if t in ('script','style'):self.skip+=1
 def handle_endtag(self,t):
  if t in ('script','style'):self.skip=max(0,self.skip-1)
 def handle_data(self,d):
  if not self.skip:self.parts.append(d)
def text(s):
 p=Text();p.feed(s);return ' '.join(' '.join(p.parts).split())
raw=(SOURCE/'suolisto.html').read_text();rawtext=text(raw)
assert '419 966' in rawtext and '421 365' in rawtext
x=json.loads((SOURCE/'suolisto_tables.json').read_text());D={};extract=[]
for t in x:
 if 'Seulonnat edellisen tuloksen perusteella' not in t['headings']:continue
 y=int(t['headings'][-1]);D[y]={}
 for r in t['rows'][2:]:
  if r[0]=='Yhteensä' or r[1]=='Yhteensä':continue
  sex,status=r[:2];n,p=int(r[2]),int(r[3]);rate=100*p/n
  assert abs(rate-float(r[4].replace(',','.')))<=.050001
  D[y][(sex,status)]={'N':n,'P':p,'rate_pct':rate}
  extract.append({'year':y,'sex':sex,'previous_result':status,'selected_N':n,'participating_P':p,'pct':rate})
 totals=[r for r in t['rows'][2:] if r[:2]==['Yhteensä','Yhteensä']][0]
 assert sum(d['N'] for d in D[y].values())==int(totals[2])
 assert sum(d['P'] for d in D[y].values())==int(totals[3])
def weights(year):
 total=sum(d['N'] for d in D[year].values());return {k:v['N']/total for k,v in D[year].items()}
def std(year,base):return sum(weights(base)[k]*D[year][k]['rate_pct'] for k in D[year])
annual=[]
for y in sorted(D):
 N=sum(d['N'] for d in D[y].values());P=sum(d['P'] for d in D[y].values());groups=[]
 for status in ['Ensimmäinen kutsu','Negatiivinen','Positiivinen','Ei osallistunut']:
  n=sum(v['N'] for k,v in D[y].items() if k[1]==status);p=sum(v['P'] for k,v in D[y].items() if k[1]==status)
  groups.append({'previous_result':status,'selected_N':n,'participating_P':p,'participation_pct':100*p/n,'population_share_pct':100*n/N})
 annual.append({'year':y,'N':N,'P':P,'observed_pct':100*P/N,'sex_history_std_2022_pct':std(y,2022),'sex_history_std_2023_pct':std(y,2023),'groups':groups})
decompositions=[]
for y0,y1 in [(2022,2023),(2023,2024),(2022,2024)]:
 w0,w1=weights(y0),weights(y1)
 mix=sum((w1[k]-w0[k])*(D[y1][k]['rate_pct']+D[y0][k]['rate_pct'])/2 for k in w0)
 within=sum((D[y1][k]['rate_pct']-D[y0][k]['rate_pct'])*(w1[k]+w0[k])/2 for k in w0)
 delta=std(y1,y1)-std(y0,y0);assert abs(mix+within-delta)<1e-10
 decompositions.append({'from':y0,'to':y1,'observed_delta_pp':delta,'symmetric_composition_component_pp':mix,'symmetric_within_stratum_component_pp':within,'warning':'Algebraic decomposition only; strata are not age-adjusted or exchangeable. No causal interpretation.'})
selected,invited,participants=421365,419966,309871
sensitivity={'year':2024,'selected':selected,'invited':invited,'participants':participants,'not_sent_invitation_N':selected-invited,'not_sent_invitation_share_pct':100*(selected-invited)/selected,'reported_selected_denominator_pct':100*participants/selected,'hypothetical_same_numerator_invited_denominator_pct':100*participants/invited,'denominator_only_difference_pp':100*participants/invited-100*participants/selected,'maximum_increment_if_all_unsent_became_additional_participants_pp':100*(selected-invited)/selected,'warning':'Numerator may include people without mailed invitation. Invited-denominator calculation is sensitivity, not verified invited-person participation rate or causal estimate.'}
helptext=text((OUT/'work/seulonta_help_test.html').read_text());(OUT/'work/seulonta_help_text.txt').write_text(helptext)
app=(OUT/'work/seulontasovellus.html').read_text();selection=re.search(r'<select id="value_theme".*?</select>',app,re.S)[0]
availability={'screening_app_initial_cancer_choices':re.findall(r'<option value="([^"]+)"',selection),'help_updated':'26.05.2026' if '26.05.2026' in helptext else None,'help_has_cc_by_4':'CC BY 4.0' in helptext,'colorectal_region_age_sex_history_joint_export':'not verified; absent from inspected static report tables and initial app choices','license_scope':'CC BY4.0 explicitly stated for screening application; applicability to separate colorectal report requires confirmation.'}
output={'source':'https://stats.cancerregistry.fi/joukkistilastot/suolisto.html','raw_sha256':hashlib.sha256(raw.encode()).hexdigest(),'source_definition_confirmed':{'participation':'At least one successful FIT result per round / selected eligible people, including people not mailed an invitation.','history':'2019–2021 pilot histories included.'},'stratified_records':extract,'annual':annual,'decompositions':decompositions,'invitation_sensitivity':sensitivity,'availability':availability,'test_counts':{'sex_history_year_rate_checks':24,'sum_checks':6,'algebraic_decompositions':3},'H01_full_joint_test_status':'unresolved: age × sex × history × region joint strata unavailable in verified samples','proposed_status_change':'retain H01; record contrary evidence for simpler sex-history-only composition explanation'}
(OUT/'h01_tulokset.json').write_text(json.dumps(output,ensure_ascii=False,indent=2))
print(json.dumps({'annual':annual,'decompositions':decompositions,'invitation_sensitivity':sensitivity,'availability':availability},ensure_ascii=False,indent=2))
# Comparable age label, repeated annual cross-sections rather than a person cohort.
sixty=[]
for t in x:
 if t['headings'][1:3]!=['Koko maa','Ikäryhmät']:continue
 y=int(t['headings'][-1])
 for r in t['rows'][2:]:
  if r[0]=='60':sixty.append({'year':y,'sex':r[1],'selected_N':int(r[2]),'participating_P':int(r[3]),'pct':100*int(r[3])/int(r[2])})
output['age60_repeated_cross_sections']=sorted(sixty,key=lambda r:(r['year'],r['sex']))
output['test_counts']['age60_year_rates']=9
(OUT/'h01_tulokset.json').write_text(json.dumps(output,ensure_ascii=False,indent=2))
print('AGE60',json.dumps(output['age60_repeated_cross_sections'],ensure_ascii=False))
