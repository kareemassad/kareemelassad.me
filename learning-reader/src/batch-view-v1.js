import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {shuffleModel,batchJoinModel,batchRecoveryModel} from './batch-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
const colors={A:'#527d65',B:'#a77c45',C:'#687f9c'};
const line=(a,b,color='#bbc3b0',width=2)=>`<path d="M${a} L${b}" stroke="${color}" stroke-width="${width}" fill="none"/>`;
const card=(x,y,w,h,fill='#e5ecdf')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}" stroke="#a9b69d"/>`;
const chip=(x,y,label,key)=>`<rect x="${x-20}" y="${y-12}" width="40" height="24" rx="5" fill="${colors[key]}"/>`+`<text x="${x}" y="${y+5}" fill="white" font-size="13" text-anchor="middle">${label}</text>`;
export function recoveryDisplay(m,index){
 const available=new Set(['input0','input1']);let persisted=0,recomputed=0;
 for(const [i,s]of m.steps.slice(0,index+1).entries()){
  if(s.active.includes('lost')){available.delete('map0');available.delete('filter0');}
  else for(const key of s.active)available.add(key);
  if(s.active.includes('disk1'))persisted=m.persistedRecords;
  if(s.active.includes('disk0')&&!s.active.includes('disk1'))available.add('filter0');
  if(i>2&&s.active.includes('input0'))recomputed=m.recomputed;
 }
 return {available,persisted,recomputed};
}
export function batchFrame(kind,p,t){let svg='',result='';
 if(kind==='shuffle'){
  const m=shuffleModel({reducers:+p.reducers,combine:+p.combine}),a=smooth(t/2),b=smooth((t-2)/3),c=smooth((t-5)/2);
  svg=text(20,30,'Same key, same place, one combined result','scene-title')+text(85,75,'Input partitions','small','middle')+text(350,75,'Shuffle by key','small','middle')+text(640,75,'Counts','small','middle');
  for(let mapper=0;mapper<3;mapper++)svg+=card(20,95+mapper*85,145,75)+text(25,113+mapper*85,'mapper '+(mapper+1),'tick');
  for(let reducer=0;reducer<m.loads.length;reducer++)svg+=card(270,95+reducer*90,190,m.loads[reducer]>8?115:80)+text(280,114+reducer*90,'reducer '+(reducer+1),'tick');
  const groupYs={A:145,B:235,C:325};for(const g of m.groups)svg+=card(575,groupYs[g.key]-27,130,54)+text(640,groupYs[g.key]+6,g.key+' = '+(c===1?g.total:'…'),'equation','middle');
  if(t<2){for(const r of m.records){const x=42+(r.id%4)*34,y=140+r.mapper*85;svg+=chip(x+150*a,y,r.key,r.key);}}
  else{for(const r of m.sent){const peers=m.sent.filter(i=>i.reducer===r.reducer).sort((a,b)=>a.key.localeCompare(b.key)||a.id-b.id),slot=peers.indexOf(r),x0=195+(r.id%4)*18,y0=140+r.mapper*85,x1=295+(slot%4)*42,y1=139+r.reducer*90+Math.floor(slot/4)*25;const x=x0+(x1-x0)*b,y=y0+(y1-y0)*b;svg+=chip(x,y,r.key+(r.value>1?'×'+r.value:''),r.key);}}
  if(t>=5)for(const g of m.groups){const start=[460,140+g.reducer*90],end=[575,groupYs[g.key]];svg+=line(start,end,colors[g.key]);if(t<7)svg+=chip(start[0]+(end[0]-start[0])*c,start[1]+(end[1]-start[1])*c,g.key,g.key);}
  svg+=text(20,410,`12 input records → ${m.sent.length} shuffled pairs → 3 key totals`,'equation');result=+p.combine?'The combiner sums each key locally before the shuffle. Addition is associative and commutative, so the final counts stay A = 6, B = 3, C = 3. The shuffle carries fewer pairs.':'The shuffle groups all records with the same key at one reducer. More reducers change placement, not the totals. Different keys can share one reducer.';
 }else if(kind==='join'){
  const m=batchJoinModel({strategy:+p.strategy,hot:+p.hot}),move=smooth(t/2),work=Math.max(0,(t-2)*2.5);
  svg=text(20,30,'Bring events and their matching profiles together','scene-title')+text(20,73,['Partition both inputs by user ID','Broadcast the small profile table','Split the hot key; copy its profile'][+p.strategy]);
  for(let worker=0;worker<3;worker++){
   const x=35+worker*240,events=m.events.filter(e=>e.worker===worker),profiles=m.profileCopies.filter(p=>p.worker===worker),done=Math.min(events.length,Math.floor(work));
   svg+=card(x,112,210,260)+text(x+105,140,'Worker '+(worker+1),'small','middle');
   profiles.forEach((p,i)=>{svg+=chip(x+40+i*61,170,p.key,p.key)+text(x+40+i*61,192,p.region,'tick','middle');});
   events.forEach((e,i)=>{const target=[x+30+(i%6)*30,210+Math.floor(i/6)*30],start=[370,90],px=start[0]+(target[0]-start[0])*move,py=start[1]+(target[1]-start[1])*move;svg+=`<circle cx="${px}" cy="${py}" r="10" fill="${colors[e.key]}" opacity="${i<done?'.28':'1'}"/>`;});
   svg+=text(x+105,310,`${done} / ${events.length} events joined`,'small','middle')+`<rect x="${x+15}" y="330" width="180" height="12" fill="#d2d9c8"/><rect x="${x+15}" y="330" width="${180*done/events.length||0}" height="12" fill="#547d67"/>`;
  }
  svg+=text(20,410,`${m.profileCopies.length} profile copies · slowest worker: ${m.duration} events`,'equation');result='Each event joins exactly one matching profile. A single hot key can keep one worker busy after the others finish. Splitting that key needs copies of its profile. Broadcasting all profiles is practical only when that dataset is small enough.';
 }else{
  const m=batchRecoveryModel({checkpoint:+p.checkpoint,failure:+p.failure}),index=Math.min(m.steps.length-1,Math.floor(t/.95)),s=m.steps[index],display=recoveryDisplay(m,index);
  svg=text(20,30,'Keep the data, or repeat the computation?','scene-title')+text(20,75,s.label);
  const xs=[85,260,435],ys=[170,290];for(let row=0;row<2;row++){
   const keys=['input'+row,'map'+row,'filter'+row],values=[m.inputs[row],m.mapped[row],m.filtered[row]];
   for(let col=0;col<3;col++){const x=xs[col],y=ys[row],key=keys[col],active=s.active.includes(key),ready=display.available.has(key);if(col<2)svg+=line([x+65,y],[xs[col+1]-65,y],active?'#688865':'#b9c2ad');svg+=card(x-65,y-32,130,65,active?'#cdddbe':!ready&&row===0&&index>2?'#efdbd2':'#e7ecdf')+text(x,y-10,['input','× 2','> 6'][col],'tick','middle')+text(x,y+18,ready?values[col].join(', '):index>2?'lost':'pending','small','middle');}
   svg+=line([500,ys[row]],[620,230]);if(+p.checkpoint)svg+=card(405,ys[row]+38,70,25,s.active.includes('disk'+row)?'#d8bb7b':'#e9dfc9')+text(440,ys[row]+55,display.available.has('disk'+row)?'saved':'empty','tick','middle');
  }
  svg+=card(565,195,140,70,s.active.includes('sum')?'#cdddbe':'#e7ecdf')+text(635,223,'SUM','tick','middle')+text(635,250,s.active.includes('sum')?m.sum:'waiting','equation','middle');
  svg+=text(20,410,`${display.persisted} stored intermediate records · ${display.recomputed} operators replayed`,'equation');result='Each frame shows the state after the named event. Immutable input and deterministic operators make recomputation repeatable. Durable checkpoints reduce replay after memory loss. This example replaces a lost task result; it does not repeat external side effects.';
 }return {svg,result};
}
export const batchDemos=[
 ['shuffle','Partition, shuffle, and reduce',{reducers:3,combine:'0'},[range('reducers','Reducer count',1,3),select('combine','Local aggregation',['Send every record','Combine per mapper'])],'Twelve synthetic records, three mapper partitions, counts by key. A fixed key hash chooses the reducer. A combiner is valid here because the reduction is summation; not every reducer admits a combiner.'],
 ['join','Joins and skew',{strategy:'0',hot:8},[select('strategy','Join strategy',['Partition by key','Broadcast profiles','Split hot key']),range('hot','Events for user A',4,12)],'Three workers, three unique user profiles, synthetic events. Each event joins one profile. Work units count event joins only; profile loading, sort cost, network bytes, and memory capacity are not timed.'],
 ['recovery','Dataflow and recovery',{checkpoint:'0',failure:'1'},[select('checkpoint','Intermediate output',['Keep in memory','Persist checkpoint']),select('failure','Worker 0',['No failure','Lose memory before aggregate'])],'Two input partitions; multiply by two, filter values greater than six, then sum. Failure loses both intermediate operators on worker 0. Durable input and optional checkpoints survive. Deterministic replay, no external side effects.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-batch-'+kind,title,params,controls,limits,draw:(p,t)=>batchFrame(kind,p,t)}));
