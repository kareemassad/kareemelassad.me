import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';import {atomicTransferModel,snapshotReadModel,counterUpdateModel,writeSkewModel} from './transaction-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});
const panel=(x,y,w,h,title,good=true)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${good?'#e2ecdb':'#f1ded6'}" stroke="#9eaf96"/>`+text(x+w/2,y+27,title,'small','middle');
const stage=(states,t)=>states[Math.min(states.length-1,Math.floor(t/.95))];
export function transactionFrame(kind,p,t){let svg='',result='';
 if(kind==='atomic'){
  const m=atomicTransferModel({atomic:+p.atomic,fail:+p.fail}),step=t<2?0:t<4?1:2,s=m.states[step];
  const caption=t<1?'Begin with 500 in each account':t<2?'Take 100 from A for the transfer':t<3?'The debit is applied; the credit has not happened':t<4?(+p.fail?+p.atomic?'Failure: roll the debit back':'Failure: no transaction can roll it back':'Apply the matching credit to B'):s.label;
  svg=text(20,30,'Can a failed transfer leave half a change?','scene-title')+text(20,73,caption);
  s.balances.forEach((value,i)=>{const x=55+i*450;svg+=panel(x,113,180,202,'Account '+['A','B'][i])+text(x+90,190,value,'equation','middle');for(let n=0;n<6;n++)svg+=`<rect x="${x+40}" y="${284-n*12}" width="100" height="9" rx="2" fill="${n<value/100?'#5b876e':'#dce2d3'}"/>`;});
  svg+=`<path d="M235 205 H505" stroke="#c7cbbb" stroke-dasharray="4 5"/>`+text(370,258,+p.atomic?'Transaction work':'Separate writes','small','middle');
  if(t>=1&&t<4){let x=235+(370-235)*smooth(t-1);if(t>=3)x=370+((+p.fail?(+p.atomic?235:370):505)-370)*smooth(t-3);svg+=`<rect x="${x-29}" y="182" width="58" height="46" rx="6" fill="#d8b879" stroke="#a47c3e"/>`+text(x,211,'100','small','middle');}
  const total=s.balances[0]+s.balances[1];
  svg+=text(30,355,step===1&&+p.atomic?'Internal pending total: 900':`Stored total: ${total}`,'equation');
  svg+=text(30,388,step===1&&+p.atomic?'This internal view does not specify what concurrent readers see.':step===2?(total===1000?'Both changes happened, or neither change remains.':'Only the debit remains. The transfer lost 100.'): 'Follow the gold block: it represents the same 100 throughout.','small');
  result=step<2?'Follow the debit, then the failure or credit. Change “Writes” while keeping the same failure to compare the outcome.':+p.fail?(+p.atomic?'Abort restores A to 500. Neither part of the failed transfer remains. Atomicity does not by itself define isolation or durability.':'The debit succeeded before the failure. With separate writes, no transaction restores it; A + B is now 900.'):'The debit and credit both complete. A + B remains 1000.';
 }else if(kind==='snapshot'){
  const m=snapshotReadModel({snapshot:+p.snapshot}),readA=t>=1.2,committed=t>=2,readB=t>=4.2;
  svg=text(20,30,'One read can combine two committed versions','scene-title')+text(20,74,t<1.2?'Read A from the original committed version':t<2?'A returns 500; the writer has not committed':t<3?'Writer commits A = 600 and B = 400':t<4.2?'Read B using the selected read policy':'Compare the two values the reader observed');
  const route=(side,startY,start,duration)=>{const x=side?715:25,target=side?610:130,source=side?700:40,y=350;svg+=`<path d="M${source} ${startY} H${x} V${y} H${target}" fill="none" stroke="#ad8755" stroke-width="2"/>`;const f=smooth((t-start)/duration),length=15+y-startY+Math.abs(target-x),distance=length*f;let px,py;if(distance<15){px=source+(x-source)*distance/15;py=startY;}else if(distance<15+y-startY){px=x;py=startY+distance-15;}else{px=x+(target-x)*(distance-15-y+startY)/Math.abs(target-x);py=y;}if(t>=start&&t<start+duration)svg+=`<circle cx="${px}" cy="${py}" r="6" fill="#ad8755"/>`;};
  route(0,147,0,1.2);route(1,+p.snapshot?147:242,3,1.2);
  svg+=panel(40,110,660,75,'Original committed version: A = 500, B = 500');
  svg+=panel(40,205,660,75,committed?'New committed version: A = 600, B = 400':'Writer has not committed its new version');
  svg+=panel(130,320,180,60,'Read A: '+(readA?'500':'waiting'))+panel(430,320,180,60,'Read B: '+(readB?m.observed[1]:'waiting'));
  svg+=text(20,416,readB?`Observed total: ${m.total} · stored total remains 1000`:'Read A → writer commits → read B','equation');
  result=+p.snapshot?'Both reads use one committed snapshot. The reader gets 500 + 500 even after the writer commits. This read-only example does not imply snapshot isolation prevents write skew.':'Each read is committed, but they come from different points in time: 500 + 400 = 900. No money is missing from the stored database.';
 }else if(kind==='counter'){
  const m=counterUpdateModel({mode:+p.mode,retry:+p.retry}),slot=.95,index=Math.floor(t/slot),count=Math.min(m.events.length,Math.max(0,Math.floor((t-.75)/slot)+1)),shown=m.events.slice(0,count),current=m.events[index],value=shown.at(-1)?.value??42;
  const done=count===m.events.length,copies={A:null,B:null};for(const e of shown)if(e.kind==='read')copies[e.actor]=e.value;
  svg=text(20,30,'Two increments should turn 42 into 44','scene-title')+text(20,71,done?'Inspect the history, then change the update method':current?'Client '+current.actor+': '+current.label:'Begin at 42');
  for(const [i,actor]of ['A','B'].entries()){const x=i?520:25;svg+=panel(x,113,195,133,'Client '+actor)+text(x+98,181,+p.mode===1?'send +1':copies[actor]===null?'no value read':'read '+copies[actor],'equation','middle')+text(x+98,220,+p.mode===1?'use current value':copies[actor]===null?'':'plans to write '+(copies[actor]+1),'small','middle');}
  svg+=panel(295,139,150,102,'Stored counter')+text(370,209,value,'equation','middle');
  svg+=`<path d="M220 194 H295 M445 194 H520" stroke="#bec8b5" stroke-width="2"/>`;
  if(current&&(t%slot)<.75){const read=current.kind==='read',client=current.actor==='A'?220:520,store=current.actor==='A'?295:445,a=smooth((t%slot)/.75),x=(read?store:client)+((read?client:store)-(read?store:client))*a;svg+=`<circle cx="${x}" cy="194" r="8" fill="${current.kind==='reject'?'#b86656':'#b18b4e'}"/>`;}
  svg+=text(25,281,'STORED VALUE AFTER EACH COMPLETED OPERATION','tick');
  const px=i=>100+i*90,py=v=>378-(v-42)*31;
  svg+=`<path d="M100 ${py(44)} H665" stroke="#afba9c" stroke-dasharray="4 4"/>`+text(669,py(44)+4,'44','tick');
  for(const v of [42,43])svg+=text(84,py(v)+4,v,'tick','end');
  let d=`M${px(0)} ${py(42)}`;shown.forEach((e,i)=>{d+=` H${px(i+1)} V${py(e.value)}`;svg+=`<circle cx="${px(i+1)}" cy="${py(e.value)}" r="4" fill="${e.kind==='reject'?'#b86656':'#47755c'}"/>`+text(px(i+1),395,(i+1)+' · '+e.actor,'tick','middle')+text(px(i+1),410,e.kind==='compare'?'write if equal':e.kind,'tick','middle');});svg+=`<path d="${d}" fill="none" stroke="#47755c" stroke-width="2.5"/>`;
  svg+=text(20,429,done?(m.value===44?'Both increments survive: 42 → 44':m.lost?'Two writes of 43 still leave only one increment':'The stale write was rejected; retry is still needed'):'The trace changes only when an operation completes.','small');
  result=!done?'Compare each client’s remembered value with the current stored value. The lower trace records what actually happened.':m.lost?'Both clients computed 42 + 1. The second write stores 43 again, so the trace stays flat and one increment is lost.':m.rejected?`Compare-and-set rejects the stale write. ${+p.retry?'The retry reads 43 and writes 44.':'Rejection prevents overwriting newer work, but the second increment remains incomplete.'}`:'Each increment reads and changes the current value as one atomic operation. No stale client value is written back.';
 }else{
  const m=writeSkewModel({mode:+p.mode}),s=stage(m.states,t);svg=text(20,30,'Different rows can violate one shared condition','scene-title')+text(20,74,s.label);
  for(let i=0;i<2;i++)svg+=panel(80+i*350,135,230,145,'Doctor '+['A','B'][i],s.on[i])+text(195+i*350,213,s.on[i]?'ON DUTY':'OFF DUTY','equation','middle')+text(195+i*350,255,'Read count: '+(s.reads[i]??'—'),'small','middle');
  if(m.cycle&&t>1)svg+=`<path d="M310 170 Q370 90 430 170 M430 250 Q370 330 310 250" fill="none" stroke="#aa7951" stroke-width="3"/>`+text(370,330,'Each decision depends on the other row','small','middle');
  svg+=text(20,405,s.on.some(Boolean)?'At least one doctor remains on duty':'Invariant broken: no doctor remains','equation');result=+p.mode===0?'Both snapshots contained two doctors. Their writes touch different rows, so ordinary write-write conflict detection does not catch this write skew.':+p.mode===1?'In this serial schedule, B observes A’s committed change and stays. The same application rule now preserves the invariant.':'The read/write dependency cycle cannot fit a serial order. This bounded validator aborts B; it illustrates conflict detection, not a complete SSI implementation.';
 }return {svg,result};
}
export const transactionDemos=[
 ['atomic','Atomicity and aborts',{atomic:'1',fail:'1'},[select('atomic','Writes',['Separate writes','Atomic transaction']),select('fail','Outcome',['Complete transfer','Fail after debit'])],'Two accounts, one transfer of 100, one selected fault. Pending state is internal; this scene does not claim an isolation or durability guarantee.'],
 ['snapshot','Read skew and snapshots',{snapshot:'0'},[select('snapshot','Read policy',['Latest committed per read','One transaction snapshot'])],'Two reads straddle one atomic committed transfer. No dirty reads. Snapshot contents are fixed at the first read in this scenario.'],
 ['counter','Preventing lost updates',{mode:'0',retry:'1'},[select('mode','Update method',['Read then write','Atomic increment','Compare-and-set']),{...select('retry','After rejection',['Leave incomplete','Retry with fresh read']),visibleWhen:p=>p.mode==='2'}],'One register, two increments, an explicit interleaving. Compare-and-set is assumed atomic and compares the current value. No ABA, replication, or crash behavior.'],
 ['skew','Write skew and serial order',{mode:'0'},[select('mode','Execution',['Concurrent snapshots','Serial execution','Validate dependency cycle'])],'Two doctor rows; at least one must remain on duty. A bounded conflict-cycle validator rejects B. No general-purpose SSI implementation, locks, or arbitrary transaction language.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-transaction-'+kind,title,params,controls,limits,draw:(p,t)=>transactionFrame(kind,p,t)}));
