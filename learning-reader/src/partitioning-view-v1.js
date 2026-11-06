import {partitionDefaults,partitionModel} from './partitioning-model-v1.js';
const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,value)=>({value:String(value),label}))});
export const partitionControls={
 placement:[select('method','Partition by',['Key range','Hash of key']),select('workload','Writes',['Keys across the range','Recent keys only','One very hot key']),range('salts','Hot-key suffixes',1,4),select('query','Highlight',['Write placement','Range query: keys 8–11'])],
 indexes:[select('global','Index layout',['Local to each data partition','Global, partitioned by term']),select('lag','New red record',['Index updated','Global index update delayed'])],
 rebalance:[select('fixed','Assignment',['hash mod number of nodes','12 fixed partitions'])],
 split:[range('count','Stored records',4,24),range('threshold','Split above this size',8,20)],
 routing:[select('route','Routing',['Any node forwards','Routing tier','Partition-aware client']),select('moved','Partition owner',['Node 1','Moved to node 2']),select('fresh','Routing map',['Stale: still says node 1','Current'])]
};
const limits={placement:'24 synthetic writes, four partitions. Hashing is deterministic; this small sample need not balance exactly. Suffixes split hot-key writes only in hash mode. Combining those keys adds read work. No replicas or throughput benchmark.',indexes:'13 synthetic records and one indexed term. Global lookup returns record IDs; fetching documents can still contact several data partitions. Lag is a selected delayed index update, not a measured delay.',rebalance:'24 equal-size records, three existing nodes and one added node. Fixed mode retains 12 partitions and moves three to the new node. Paths show copies; ownership changes after transfer. No concurrent writes or recovery protocol.',split:'One ordered range, at most 24 equal-size records, one split at the median. A half moves to node 1. No recursive splits, merges, replication, or concurrent writes.',routing:'One key and three nodes. The forwarding node knows the current owner. A stale router or client receives a wrong-owner result; retry and metadata consensus are outside this scene. Path length is not latency.'};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,cls='small',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(a,b,cls='lane')=>`<path d="M${a} L${b}" class="${cls}"/>`;
const colors=['#447866','#aa793e','#6b78a5','#a96566'];
const dot=(x,y,label,color,opacity=1)=>`<g opacity="${opacity}"><rect x="${x-11}" y="${y-10}" width="22" height="20" rx="4" fill="${color}"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="white" font-size="10">${label}</text></g>`;
const ease=t=>{const p=Math.max(0,Math.min(1,t));return p*p*(3-2*p);};
const interpolate=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*ease(t));
function box(x,y,w,h,title,active=false){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${active?'#e4efdf':'#fffdf7'}" stroke="#aab8a2"/>`+text(x+12,y+24,title);}
function packet(a,b,t){const p=interpolate(a,b,t);return line(a,b,'pending')+(t>=0&&t<=1?`<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#447866"/>`:'');}
export function partitionFrame(kind,input,time=0){
 const state=Object.fromEntries(Object.keys(partitionDefaults(kind)).map(k=>[k,Math.round(Number(input[k]))])),m=partitionModel(kind,state),t=Math.max(0,time);let svg='',result='';
 if(kind==='placement'){
  svg+=text(20,28,state.query?'A range query needs every possible owner':'Follow the same keys into four partitions','scene-title');
  const slots=[0,0,0,0],arrived=[0,0,0,0];m.records.forEach((r,i)=>{const start=[40+i*28,85],slot=slots[r.partition]++,end=[48+r.partition*176+(slot%5)*27,207+Math.floor(slot/5)*29],progress=(t-i*.06)/1.5,p=state.query?end:interpolate(start,end,progress),hit=!state.query||(r.key>=8&&r.key<=11);if(progress>=1||state.query)arrived[r.partition]++;if(progress>0&&progress<1&&!state.query)svg+=line(start,end);svg+=dot(p[0],p[1],state.workload===2&&state.method&&state.salts>1?r.key+String.fromCharCode(97+r.salt):r.key,colors[r.partition],hit?1:.22);});
  for(let p=0;p<4;p++){svg+=`<rect x="${22+p*176}" y="164" width="164" height="210" rx="8" fill="none" stroke="${state.query&&m.contacted.includes(p)?'#447866':'#ccd3c4'}" stroke-width="${state.query&&m.contacted.includes(p)?3:1}"/>`+text(35+p*176,188,state.method?'Hash partition '+p:`Keys ${p*6}–${p*6+5}`)+text(35+p*176,352,arrived[p]+' writes')+`<rect x="${35+p*176}" y="362" width="${138*arrived[p]/24}" height="5" rx="2" fill="${colors[p]}"/>`;}
  if(state.query){svg+=text(370,75,'Read keys 8–11','small','middle');for(const p of m.contacted){const a=[370,90],b=[104+p*176,164];svg+=packet(a,b,t/1.1)+packet(b,a,(t-1.7)/1.1);}}
  svg+=text(20,410,state.query?`${m.contacted.length} partitions contacted · ${t<2.8?0:m.matching.length} matches returned`:`Busiest partition: ${Math.max(...arrived)} of ${arrived.reduce((a,b)=>a+b,0)} writes`,'equation');
  result=state.query?(state.method?'Hash placement loses key order. The highlighted query fans out to all four partitions.':'Ordered ranges let this query go directly to the partition for keys 6–11.'):state.workload===2?`Identical keys keep the same owner. ${state.method&&state.salts>1?`Suffixes spread this key across ${state.salts} logical keys; a combined read must fetch all of them.`:'Hashing alone cannot split this hot key.'}`:state.workload===1&&!state.method?'All recent writes enter the final range. Other partitions sit idle.':'Key color identifies the computed owner. Switch the method and watch the same writes move.';
 }else if(kind==='indexes'){
  svg+=text(20,28,'Find every red record','scene-title');svg+=box(270,50,200,45,'Query: color = red');
  const targetY=state.global?140:235;
  for(const p of m.targets){const target=[state.global?370:132+p*245,targetY];svg+=packet([370,95],target,t/1.4)+packet(target,[370,95],(t-2)/1.4);}
  if(t>=3.4)svg+=text(370,119,'Returned IDs: '+m.visible.map(r=>r.id).join(', '),'small','middle');
  if(state.global){svg+=box(210,140,320,60,'Term owner: color:red',true);svg+=text(225,184,'Record IDs: '+m.visible.map(r=>r.id).join(', '));}
  for(let p=0;p<3;p++){svg+=box(20+p*245,235,225,140,'Data partition '+p);m.records.filter(r=>r.partition===p).forEach((r,i)=>{svg+=dot(45+p*245+i*38,295,r.id,r.red?'#ad5c4d':'#8399ab');if(r.new)svg+=text(45+p*245,330,'14: new record');});if(!state.global)svg+=text(32+p*245,354,'Local red IDs: '+m.visible.filter(r=>r.partition===p).map(r=>r.id).join(', '));}
  svg+=text(20,420,`${m.targets.length} index partitions queried · ${t>=3.4?m.visible.length:0} / ${m.actual.length} red IDs returned`,'equation');result=m.missing?'The data contains record 14, but the delayed global posting omits it. Set Index updated to include it.':state.global?'One term lookup collects IDs across the data partitions. Document fetching remains a separate operation.':'Each local index sees only its own records. The query must gather results from all three.';
 }else if(kind==='rebalance'){
  svg+=text(20,28,'Add node 3: what must move?','scene-title');
  for(let n=0;n<4;n++)svg+=box(20+n*180,65,165,300,'Node '+n,n===3);
  const oldSlots=[0,0,0],newSlots=[0,0,0,0];m.records.forEach(r=>{const a=oldSlots[r.old]++,b=newSlots[r.next]++,start=[46+r.old*180+(a%4)*33,130+Math.floor(a/4)*55],end=[46+r.next*180+(b%4)*33,130+Math.floor(b/4)*55],p=interpolate(start,end,(t-.4)/3);if(r.moved){if(t<3.4)svg+=dot(start[0],start[1],state.fixed?'p'+r.partition:r.id,colors[r.old],.25);svg+=line(start,end,'pending');}svg+=dot(p[0],p[1],state.fixed?'p'+r.partition:r.id,colors[r.old]);});
  svg+=text(20,402,`${m.moved} / 24 records move · final loads ${m.loads.join(' / ')}`,'equation');svg+=text(20,433,t<3.4?'Copying: requests still use the old ownership map.':'Transfer complete: the new ownership map takes effect.');result=state.fixed?'Partition IDs stay fixed. Three complete partitions move to the new node; existing nodes keep the rest.':'Changing modulo 3 to modulo 4 changes many owners, even between existing nodes. Compare fixed partitions.';
 }else if(kind==='split'){
  svg+=text(20,28,'A range grows, then splits','scene-title')+box(25,90,330,270,'Node 0')+box(385,90,330,270,'Node 1');
  m.records.forEach(r=>{const before=[55+(r.id%8)*36,160+Math.floor(r.id/8)*45],index=r.next?r.id-m.cut:r.id,after=[55+r.next*360+(index%8)*36,160+Math.floor(index/8)*45],p=interpolate(before,after,(t-.5)/2.5);if(r.next){if(t<3)svg+=dot(before[0],before[1],r.id,colors[0],.25);svg+=line(before,after,'pending');}svg+=dot(p[0],p[1],r.id,colors[r.next]);});
  svg+=text(20,74,m.split?(t<.5?'Threshold exceeded → split at the median':t<3?'Copy the upper range; retain the source until complete':'Transfer complete · two disjoint ranges'):'Below threshold · one range keeps all records');
  svg+=text(20,402,m.split?`Range 0–${m.cut-1} | Range ${m.cut}–${state.count-1}`:`One range: 0–${state.count-1}`,'equation');result=m.split?`${state.count} records exceed the threshold ${state.threshold}. Split at the median and transfer the upper half. Loads: ${m.loads.join(' / ')}.`:`${state.count} records fit within the threshold ${state.threshold}. Every write still goes to node 0. Increase Stored records.`;
 }else{
  const points={client:[80,225],router:[290,225],n0:[585,100],n1:[585,225],n2:[585,350]};svg+=text(20,28,'Who knows where the partition lives?','scene-title');
  svg+=box(20,190,130,70,'Client')+box(215,190,150,70,'Routing tier');for(let n=0;n<3;n++)svg+=box(500,65+n*125,210,75,`Node ${n}${n===m.owner?' · owns key':''}`,n===m.owner);
  m.path.slice(1).forEach((name,i)=>{svg+=packet(points[m.path[i]],points[name],(t-i*1.3)/1.2);});
  const replyAt=m.hops*1.3;const reversed=[...m.path].reverse();reversed.slice(1).forEach((name,i)=>{svg+=packet(points[reversed[i]],points[name],(t-replyAt-i*.65)/.6);});
  svg+=text(20,420,t<m.hops*1.3?'Request in flight':t<replyAt+m.hops*.65?(m.correct?'Owner returns the value':'Wrong-owner response returns'):(m.correct?'Client receives the value':'Wrong owner: refresh the routing map'),'equation');result=`${m.hops} request hop(s). ${m.correct?'The route reaches node '+m.owner+'.':'The map still selects node 1, but the partition now belongs to node 2. No value is returned in this model.'}`;
 }
 return {svg,result,model:m};
}
export function renderPartitioning(container,kind,state,time=0){const result=partitionFrame(kind,state,time);container.innerHTML=`<svg class="ddia-scene" viewBox="0 0 740 450" role="img" aria-label="Partitioning: ${kind}">${result.svg}</svg>`;return result;}
export const partitioningLearningModel={defaults:p=>partitionDefaults(p.partitionKind),controls(container,p,state,apply){container.replaceChildren();for(const c of partitionControls[p.partitionKind]){const label=document.createElement('label');label.textContent=c.label;const el=document.createElement(c.type==='select'?'select':'input');if(c.type==='select')for(const o of c.options)el.add(new Option(o.label,o.value));else Object.assign(el,{type:'range',min:c.min,max:c.max,step:1});el.value=state[c.key];el.addEventListener(c.type==='select'?'change':'input',()=>apply({[c.key]:Number(el.value)}));label.append(el);container.append(label);}},render(container,p,state){renderPartitioning(container,p.partitionKind,state,4);}};

// Replay the same bounded experiment. The final state stays readable for three
// seconds, then dissolves into the next replay. No reverse migration is implied.
export const PARTITION_LOOP_SECONDS=9;
export function partitionLoopFrame(kind,state,time,{reducedMotion=false}={}){
 const phase=reducedMotion?5:Math.max(0,time)%PARTITION_LOOP_SECONDS;
 const frame=partitionFrame(kind,state,Math.min(phase,5));
 const blend=phase>8?ease(phase-8):0;
 const opening=blend?partitionFrame(kind,state,0):null;
 const caption=reducedMotion?'Paused view':phase<.6?'Replay · same data':phase<4.2?'Follow the operation':phase<8?'Read the result':'Next replay · same data';
 return {...frame,phase,svg:`<g data-loop-phase="${phase.toFixed(3)}"><g opacity="${1-blend}">${frame.svg}</g>${opening?`<g opacity="${blend}">${opening.svg}</g>`:''}${text(720,49,caption,'tick','end')}<path d="M20 447 H720" class="lane"/><path d="M20 447 H${20+700*phase/PARTITION_LOOP_SECONDS}" stroke="#72937a" stroke-width="2"/></g>`};
}
export function partitionReaderParams(kind,state){return Object.fromEntries(Object.entries(state).map(([key,value])=>[key,partitionControls[kind].find(c=>c.key===key)?.type==='select'?String(value):value]));}
let outgoingFrame=null;
export function partitionDemo(kind,title){return {
 id:'ddia-partition-'+kind,title,camera:{mode:'2d',center:[0,0],height:12,width:18},params:partitionReaderParams(kind,partitionDefaults(kind)),controls:partitionControls[kind],resetOn:Object.keys(partitionDefaults(kind)),
 create(ctx){
  const wrap=document.getElementById('canvas-wrap'),host=document.createElementNS('http://www.w3.org/2000/svg','svg');
  host.classList.add('ddia-scene');host.setAttribute('viewBox','0 0 740 450');host.setAttribute('role','img');host.setAttribute('aria-label',title);wrap.append(host);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let old=outgoingFrame?.wrap===wrap&&performance.now()-outgoingFrame.at<100?outgoingFrame.svg:null;
  outgoingFrame=null;
  let elapsed=0,current='',previous='';
  const status=document.createElement('p');status.className='ddia-result';
  const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent='Model assumptions';p.textContent=limits[kind]+' Playback repeats the same example; it does not add operations to the model.';details.append(summary,p);ctx.panel.append(status,details);
  function frame(ctx,dt=0){
   elapsed+=dt;const result=partitionLoopFrame(kind,ctx.params,ctx.time,{reducedMotion:motion.matches});
   const mix=motion.matches?1:ease(elapsed/.65);
   current=result.svg;
   const svg=old&&mix<1?`<g opacity="${1-mix}" aria-hidden="true">${old}</g><g opacity="${mix}">${current}</g>`:current;
   if(mix>=1)old=null;
   if(svg!==previous){host.innerHTML=svg;previous=svg;}
   if(status.textContent!==result.result)status.textContent=result.result;
  }
  frame(ctx);
  return {frame,onParams(){old=document.getElementById('play')?.getAttribute('aria-pressed')==='true'?null:current;elapsed=0;},reset(){/* The reader resets its clock; Pause remains in control. */},dispose(){outgoingFrame={wrap,svg:current,at:performance.now()};host.remove();}};
 }
};}
