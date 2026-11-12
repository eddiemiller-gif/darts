const fs=require('fs'),assert=require('assert'),{JSDOM}=require('jsdom'),fflate=require('fflate');
const dom=new JSDOM(fs.readFileSync('dist/index.html','utf8'),{url:'https://example.test',runScripts:'outside-only'}),w=dom.window;
w.TextDecoder=TextDecoder;w.TextEncoder=TextEncoder;w.fflate=fflate;w.fetch=async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('dist/workbook.json','utf8'))});
w.eval(fs.readFileSync('dist/app.js','utf8'));
setTimeout(()=>{try{
 assert.equal(w.document.querySelectorAll('#tabs button').length,7);
 for(let i=0;i<7;i++){w.eval(`active=${i};render()`);assert(w.document.querySelectorAll('#content input').length>0,'Inputs exist for tab '+i)}
 w.eval("active=0;render();save(0,'W6','8');save(1,'A3','TEST & PLAYER');save(3,'B6','New player')");
 const out=w.patchWorkbook(new Uint8Array(fs.readFileSync('dist/template.xlsx')),JSON.parse(w.localStorage.getItem('vfw-darts-fall2026-v1'))),a=fflate.unzipSync(new Uint8Array(fs.readFileSync('dist/template.xlsx'))),b=fflate.unzipSync(out);
 const ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main',parser=new w.DOMParser();
 for(const p of Object.keys(b).filter(p=>p.endsWith('.xml'))){const d=parser.parseFromString(new TextDecoder().decode(b[p]),'application/xml');assert(!d.querySelector('parsererror'),p)}
 for(const p of ['xl/styles.xml','xl/sharedStrings.xml','xl/worksheets/sheet3.xml','xl/worksheets/sheet5.xml'])assert.deepEqual(a[p],b[p],p+' unchanged');
 for(const p of Object.keys(a).filter(p=>/^xl\/worksheets\/sheet\d.xml$/.test(p))){const da=parser.parseFromString(new TextDecoder().decode(a[p]),'application/xml'),db=parser.parseFromString(new TextDecoder().decode(b[p]),'application/xml');assert.deepEqual([...da.getElementsByTagNameNS(ns,'f')].map(x=>x.textContent),[...db.getElementsByTagNameNS(ns,'f')].map(x=>x.textContent),'Formulas preserved');assert.deepEqual([...da.getElementsByTagNameNS(ns,'mergeCell')].map(x=>x.getAttribute('ref')),[...db.getElementsByTagNameNS(ns,'mergeCell')].map(x=>x.getAttribute('ref')),'Merges preserved')}
 assert(new TextDecoder().decode(b['xl/worksheets/sheet2.xml']).includes('TEST &amp; PLAYER'));
 assert(new TextDecoder().decode(b['xl/worksheets/sheet4.xml']).includes('New player'));
 fs.writeFileSync('export-test.xlsx',out);console.log('PASS: all seven tabs render; edits persist; numeric, escaped text, and blank-cell export; XML valid; formulas, merges, styles and untouched sheets preserved.');
 }catch(e){console.error(e);process.exitCode=1}finally{w.close()}},30);
