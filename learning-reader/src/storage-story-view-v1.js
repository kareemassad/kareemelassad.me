import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {storageStory} from './storage-story-model-v1.js';

const ink='#355b4b',gold='#a77434',muted='#92978e',red='#ad5149';
const keyColor={A:'#527f99',B:'#8471a4',C:'#b47d41',D:'#56836b',E:'#a3657e'};
export const storageStages=[
 ['append','Keep the history','An update adds a record. The earlier value stays on disk.'],
 ['scan','The cost of finding the present','Read the whole history. The last matching record wins.'],
 ['index','Remember where the present lives','A small index points directly to the latest record.'],
 ['waste','Fast reads do not reclaim space','The index is current. The file still contains obsolete versions.'],
 ['compact','Carry only the surviving versions','Copy the latest records into a new file. Keep the old file until the new file is ready.'],
 ['delete','A deletion must survive the merge','Drop a tombstone too early and an older value becomes visible again.'],
 ['recover','Rebuild what memory forgot','A crash clears the index. Replay the durable log to rebuild it.'],
];
const pos=i=>({x:30+(i%4)*111,y:114+Math.floor(i/4)*68});
function record(r,x,y,{opacity=1,active=false,labels=true,copied=false}={}) {
 return `<g opacity="${opacity}"><rect x="${x}" y="${y}" width="99" height="43" rx="5" fill="${active?'#e3eee6':'#fffdf7'}" stroke="${active?ink:keyColor[r.key]}" stroke-width="${active?2:1}"/><rect x="${x}" y="${y}" width="5" height="43" rx="2" fill="${keyColor[r.key]}"/>${labels?text(x+13,y+19,r.key+' : '+(r.value===null?'DELETE':r.value),'small')+text(x+13,y+34,(copied?'from offset ':'offset ')+r.offset,'tick'):''}</g>`;
}
const path=(a,b,color=ink)=>`<path d="M${a.x} ${a.y} C${a.x} ${b.y},${b.x} ${a.y},${b.x} ${b.y}" fill="none" stroke="${color}" stroke-width="2"/>`;
function meter(x,y,label,value,max,color){return text(x,y,label,'tick')+`<rect x="${x}" y="${y+9}" width="140" height="7" rx="3" fill="#e6e5db"/><rect x="${x}" y="${y+9}" width="${140*value/max}" height="7" rx="3" fill="${color}"/>`+text(x+150,y+16,value,'small');}

export function storageStoryFrame(p,t){
 const stage=p.stage||'append',count=+p.count||8,key=p.key||'C';
 const m=storageStory({count,key,scope:p.scope||'recent',retain:p.retain!=='0'});
 const stageIndex=storageStages.findIndex(s=>s[0]===stage),[,title,description]=storageStages[stageIndex];
 const scan=Math.min(count,Math.floor(Math.max(0,t-1)/.6));
 const building=['append','recover'].includes(stage);
 const visibleCount=stage==='append'?Math.min(count,1+Math.floor(t/.65)):count;
 const built=storageStory({count:Math.max(1,stage==='recover'?scan:visibleCount),key});
 let svg=text(24,28,title,'scene-title')+text(24,55,description,'small');
 svg+=text(30,94,'DURABLE LOG  ·  oldest → newest','tick')+text(510,94,stage==='recover'?'MEMORY AFTER RESTART':['compact','delete'].includes(stage)?'INDEX BEFORE MERGE':'LATEST VALUE INDEX','tick');
 const activeIndex=stage==='scan'||stage==='recover'?scan-1:m.index[key];
 m.records.forEach((r,i)=>{const at=pos(i);let opacity=i<visibleCount?1:.12;
  if(stage==='waste'&&m.index[r.key]!==i)opacity=.28;
  svg+=record(r,at.x,at.y,{opacity,active:(stage==='scan'||stage==='recover')?i===activeIndex:stage==='index'&&i===activeIndex});
  if(stage==='waste'&&m.index[r.key]!==i)svg+=`<path d="M${at.x+10} ${at.y+36} l77 -29" stroke="${red}" stroke-width="2"/>`;
 });
 const index=stage==='recover'&&scan===0?{}:building?built.index:m.index;
 const showIndex=!['append','scan'].includes(stage);
 if(!showIndex)svg+=text(510,132,stage==='scan'?'No shortcut yet':'Index comes next','small');
 if(showIndex)Object.entries(index).forEach(([k,offset],i)=>{
  const y=120+i*25;
  svg+=`<g opacity="${showIndex?1:.15}">${text(516,y,k,'small')}${text(552,y,'→ '+offset,'small')}${text(618,y,m.records[offset].value===null?'deleted':'v'+m.records[offset].value,'tick')}</g>`;
  if(showIndex&&k===key&&stage==='index'){
   const at=pos(offset),a={x:505,y:y-5},b={x:at.x+99,y:at.y+21};svg+=path(a,b);
   const f=smooth(Math.min(1,t/2)),u=1-f;svg+=`<circle cx="${u*u*u*a.x+3*u*u*f*a.x+3*u*f*f*b.x+f*f*f*b.x}" cy="${u*u*u*a.y+3*u*u*f*b.y+3*u*f*f*a.y+f*f*f*b.y}" r="5" fill="${keyColor[key]}"/>`;
  }
 });
 let result;
 if(['append','scan','index','waste','recover'].includes(stage)){
  const scanPrefix=m.records.slice(0,scan),found=scanPrefix.filter(r=>r.key===key).at(-1);
  if(stage==='scan')result=scan<count?`Scanning ${scan} / ${count}. Latest ${key} seen: ${found?found.value===null?'deleted':found.value:'none'}. The scan is not finished.`:`Scanned all ${count}. ${key} = ${m.expected===null?'not found':m.expected}.`;
  else if(stage==='recover')result=scan<count?`Rebuilt ${Object.keys(scan?built.index:{}).length} index entries from ${scan} durable records.`:'Index restored. Disk records did not move. Reads can use the rebuilt offsets.';
  else if(stage==='waste')result=`${m.obsolete.length} obsolete records still occupy space. The index hides them from reads, but does not remove them.`;
  else if(stage==='index')result=`Find ${key} in memory, then read ${m.indexReads} record on disk. Updating the index is extra write work.`;
  else result=`${visibleCount} records appended. ${Object.keys(built.index).length} distinct keys. Watch A and B receive a second value.`;
  svg+=meter(30,290,'RECORDS IN FILE',stage==='append'?visibleCount:count,8,ink);
  svg+=meter(285,290,'OBSOLETE VERSIONS',stage==='append'?built.obsolete.length:m.obsolete.length,8,gold);
  svg+=meter(540,290,stage==='index'?'DISK RECORDS READ':'RECORDS EXAMINED',stage==='index'?m.indexReads:stage==='scan'||stage==='recover'?scan:0,8,ink);
  svg+=text(30,360,stage==='scan'?'The same answer requires reading more history.':stage==='index'?'Same records. Same answer. A different path to the answer.':stage==='recover'?'The log is the evidence. The index is a rebuildable shortcut.':stage==='waste'?'Next: preserve the answer while discarding obsolete history.':'The log grows even when the number of keys does not.','small');
 }else{
  const full=stage==='compact';
  const c=full?storageStory({count,key,scope:'all'}):m;
  const ready=t>=4.8;
  svg+=text(30,273,full||p.scope==='all'?'NEW FILE  ·  all older versions included':'NEW FILE  ·  old offsets 0–2 remain outside the merge','tick');
  c.output.forEach((r,i)=>{const from=pos(r.offset),to={x:30+i*111,y:291},f=smooth((t-1-i*.5)/1.3);svg+=record(r,to.x,to.y,{opacity:f===1?1:.15,active:ready&&r.key===key,labels:f===1,copied:true});if(f>0&&f<1){const a={x:from.x+49,y:from.y+43},b={x:to.x+49,y:to.y};svg+=`<path d="M${a.x} ${a.y} L${b.x} ${b.y}" fill="none" stroke="${keyColor[r.key]}" stroke-opacity=".35"/><circle cx="${a.x+(b.x-a.x)*f}" cy="${a.y+(b.y-a.y)*f}" r="7" fill="${keyColor[r.key]}"/>`;}});
  const wrong=ready&&!full&&c.actual!==c.expected;
  result=!ready?'Copy surviving records into the new file. Reads still use the old files until the new file is ready.':full?`${c.inputs.length} records → ${c.output.length} live records. Reads return the same values after the file switch.`:wrong?`BUG: ${key} returns ${c.actual}. Its deletion was dropped, but the older value is still in the unmerged file.`:`${key} stays ${c.actual===null?'absent':'at '+c.actual}. ${p.scope==='all'?'All older versions were included.':key==='C'&&count>=6?'The tombstone still hides its older value.':'The newest remaining record determines this answer.'}`;
  svg+=text(30,370,!ready?'Copy first. Publish only after the new file is complete.':full?'The new file is ready. The old files can now be replaced.':wrong?'The old value has come back. Restore “Keep tombstones” to fix it.':'Compare keeping and dropping the tombstone for key C.','small');
  if(wrong){const old=m.records.find(r=>r.key===key&&r.value!==null);if(old){const at=pos(old.offset);svg+=`<rect x="${at.x-3}" y="${at.y-3}" width="105" height="49" rx="6" fill="none" stroke="${red}" stroke-width="3"/>`;}}
 }
 storageStages.forEach(([id],i)=>{svg+=`<rect x="${24+i*99}" y="407" width="88" height="4" rx="2" fill="${i<=stageIndex?ink:'#dedfd5'}"/>`+text(24+i*99,429,`${i+1} ${['Append','Scan','Index','Space','Compact','Delete','Recover'][i]}`,'tick');});
 return {svg,result};
}
export const storageStoryDemo=continuousSvgDemo({id:'ddia-storage-story',title:'From a log to a storage engine',params:{stage:'append',count:8,key:'C',scope:'recent',retain:'1'},controls:[
 {key:'stage',label:'Story step',type:'select',options:storageStages.map(([value,label])=>({value,label}))},
 {key:'count',label:'Records in the history',type:'range',min:1,max:8,step:1},
 {key:'key',label:'Read key',type:'select',visibleWhen:p=>['scan','index','delete'].includes(p.stage),options:['A','B','C','D','E'].map(value=>({value,label:value}))},
 {key:'scope',label:'Merge scope',type:'select',visibleWhen:p=>p.stage==='delete',options:[{value:'recent',label:'Recent records only'},{value:'all',label:'All records'}]},
 {key:'retain',label:'Deletion policy',type:'select',visibleWhen:p=>p.stage==='delete',options:[{value:'1',label:'Keep required tombstones'},{value:'0',label:'Drop tombstones too early'}]},
],draw:storageStoryFrame,limits:'Eight synthetic records; offsets count records, not bytes. One writer, durable complete log records, and no concurrent file switch. Recovery rebuilds a hash index, not transactions. Dropping a tombstone is safe here only when all older versions are included. No measured performance or byte-size claims.'});
