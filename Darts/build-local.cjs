const fs=require('fs');
let html=fs.readFileSync('dist/index.html','utf8');
const css=fs.readFileSync('dist/style.css','utf8').replace(/@import[^\r\n]+/,'');
const data=fs.readFileSync('dist/workbook.json','utf8');
const base64=fs.readFileSync('dist/template.xlsx').toString('base64');
const boot=`const workbookData=${data};const workbookBytes='${base64}';window.fetch=async(path)=>({ok:true,json:async()=>workbookData,arrayBuffer:async()=>Uint8Array.from(atob(workbookBytes),c=>c.charCodeAt(0)).buffer});`;
const script=s=>'<script>'+s.replace(/<\/script/gi,'<\\/script')+'</script>';
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+css+'</style>');
html=html.replace('<script src="fflate.js"></script>',()=>script(fs.readFileSync('dist/fflate.js','utf8')));
html=html.replace('<script src="app.js"></script>',()=>script(boot)+script(fs.readFileSync('dist/app.js','utf8')));
fs.writeFileSync('VFW Darts League Desk.html',html);

