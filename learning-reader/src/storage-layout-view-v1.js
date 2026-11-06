import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';import {treePageModel,storageLayoutModel,compressionModel} from './storage-layout-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});
const box=(x,y,w,h,label,active=false)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${active?'#dcead7':'#fffdf7'}" stroke="#a5b497"/>`+text(x+w/2,y+Math.min(25,h-5),label,'small','middle');
export function storageLayoutFrame(kind,p,t){let svg='',result='';
 if(kind==='tree'){
  const m=treePageModel({key:+p.key,insert:+p.insert}),changed=t>2.5&&m.split,leaves=changed?m.leaves:m.before,separators=changed?m.separators:m.before.slice(1).map(a=>a[0]),target=changed?m.target:m.owner;
  svg=text(20,30,'A key chooses a path through page boundaries','scene-title')+box(200,70,340,65,'Root boundaries: '+separators.join(' | '),t<1.5);
  leaves.forEach((keys,i)=>{const x=20+i*140;svg+=`<path d="M370 135 L${x+65} 245" stroke="${i===target?'#47755c':'#d0d3c7'}" stroke-width="${i===target?3:1}"/>`+box(x,245,130,80,'Leaf '+i,i===target&&t>=1.5)+text(x+65,300,keys.join(' · '),'small','middle');});
  svg+=text(20,380,t<1.5?'Follow the root boundary to the leaf':m.split?(changed?'Full leaf split; parent boundary updated':'Insert into a full leaf'):m.found?'The chosen leaf contains the key':'The chosen leaf proves the key is absent','equation')+text(20,416,`Key ${m.key} · ${m.pagesRead} pages read · ${m.pagesWritten} page writes for this operation`);
  result='Internal pages choose a key range; the leaf checks the key. Inserting a missing odd key splits a full leaf. The parent has spare capacity in this example, so no root split is needed.';
 }else if(kind==='layout'){
  const m=storageLayoutModel({columnar:+p.columnar,query:+p.query}),a=smooth(t/2);
  svg=text(20,30,+p.query?'Reconstruct one row':'Sum one column across all rows','scene-title')+text(20,64,'Each outlined block is one page containing six fixed-size cells.');
  for(const c of m.cells){const x0=50+c.col*43,y0=100+c.row*23,x1=390+(c.offset%6)*43,y1=100+Math.floor(c.offset/6)*23;svg+=`<rect x="${x0+(x1-x0)*a}" y="${y0+(y1-y0)*a}" width="39" height="19" rx="3" fill="${c.needed?'#4e806c':m.pages.includes(c.page)?'#d3ad71':'#e8e6dd'}"/>`;if(c.needed)svg+=`<text x="${x0+(x1-x0)*a+19}" y="${y0+(y1-y0)*a+13}" fill="white" font-size="11" text-anchor="middle">${c.value}</text>`;}
  for(let n=0;n<12;n++)svg+=`<rect x="386" y="${96+n*23}" width="263" height="23" fill="none" stroke="#c0c8b5"/>`;
  svg+=text(20,405,`${m.pages.length} pages read · ${m.loaded} cells loaded · ${m.needed} used`,'equation');
  result=(+p.query?'Row 5: '+m.cells.filter(c=>c.needed).map(c=>c.value).join(', ')+'. ':'Column sum: '+m.sum+'. ')+'Green cells are needed; gold cells share a page but are not used. Layout changes the pages read, not the logical table.';
 }else{
  const m=compressionModel({sorted:+p.sorted}),a=smooth(t/2);svg=text(20,30,'Sort whole rows; repeated values form runs','scene-title');
  m.rows.forEach((r,i)=>{const y=80+(r.id+(i-r.id)*a)*24;svg+=text(45,y+15,'row '+r.id,'tick')+box(125,y-6,110,22,r.category)+text(255,y+15,'amount '+r.amount,'small');});
  m.runs.forEach((r,i)=>svg+=box(435,75+i*25,220,23,r.value+' × '+r.count,true));
  svg+=text(20,405,`12 category values → ${m.runs.length} run(s)`,'equation');result='All columns move together so categories remain paired with amounts. Sorting one column independently would corrupt those relationships. Run counts are not a byte-compression ratio.';
 }return {svg,result};
}
export const storageLayoutDemos=[
 ['tree','B-tree page boundaries',{key:13,insert:'0'},[{key:'key',label:'Lookup key',type:'range',min:0,max:31,step:1},select('insert','Operation',['Read','Insert or update'])],'A two-level synthetic B+tree, four keys per leaf, parent capacity for eight children. Values are inline. One leaf split is modeled; recursive splits, logging, and concurrency are not.'],
 ['layout','Rows, columns, and read work',{columnar:'1',query:'0'},[select('columnar','Physical layout',['Rows together','Columns together']),select('query','Query',['Sum column 2','Fetch row 5'])],'Twelve rows, six columns, six fixed-size cells per page, empty cache, and no index or compression. Counts compare this bounded layout only.'],
 ['compression','Sorted columns and compression',{sorted:'1'},[select('sorted','Row order',['Original order','Sort by category'])],'Twelve synthetic rows. Run-length encoding represents category runs as value/count pairs. Actual bytes depend on types and format; amounts stay attached to their original row.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-layout-'+kind,title,params,controls,limits,draw:(p,t)=>storageLayoutFrame(kind,p,t)}));
