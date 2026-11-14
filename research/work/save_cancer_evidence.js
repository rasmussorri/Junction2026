const fs=require('fs'), path=require('path'),crypto=require('crypto');
const root=process.cwd(), dir=path.join(root,'06 Tekninen liite/Syöpärekisteri');
const raw=fs.readFileSync('/Users/rasmussorri/Downloads/table_2026-11-14.csv');
fs.writeFileSync(path.join(dir,'stage_2020_2024_sample.csv'),raw);
const lines=raw.toString('utf8').trim().split(/\r?\n/),head=lines.shift().split(';'),rows=lines.map(l=>Object.fromEntries(l.split(';').map((v,i)=>[head[i],i<2?v:Number(v.replace(',','.'))])));
if(rows.length!==6)throw new Error('Unexpected row count');
const checks=[['Miehet','Tuntematon',66484],['Miehet','Paikallinen',9799],['Naiset','Ei paikallinen',27137]];
for(const [sex,stage,n] of checks){const r=rows.find(r=>r.Sukupuoli===sex&&r['Syövän levinneisyys']===stage);if(r['Todettuja syöpiä']!==n)throw new Error('UI/csv mismatch');}
fs.writeFileSync(path.join(dir,'stage_sample_metadata.json'),JSON.stringify({retrieved_utc:new Date().toISOString(),method:'Browser UI .CSV link downloadMedia; first waitForEvent attempt timed out',source:'https://tilastot.syoparekisteri.fi/syovat/',selection:{theme:'Uudet syöpätapaukset (ilmaantuvuus)',area:'Koko maa',sex:['Miehet','Naiset'],cancer:'Kaikki syövät yhdessä',classification:'Syövän levinneisyys (2020-2024)',measure:'Todettuja syöpiä'},format:{encoding:'UTF-8',delimiter:';',decimal:','},bytes:raw.length,sha256:crypto.createHash('sha256').update(raw).digest('hex'),columns:head,rows,ui_cells_checked:checks,limitations:['Export omits selected years/area/cancer from columns, so sidecar is required','Coarse local/nonlocal/unknown classification; not TNM or stage IV','No stable API endpoint tested; session download URL is ephemeral','No HTTP status observed for browser transfer']},null,2));
console.log('6-row stage sample saved; three UI cells match.');
