import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {replayLogModel,eventProjectionModel,windowedEventsModel,replayEffectModel} from './stream-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
const card=(x,y,w,h,fill='#e4ecdc')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}" stroke="#a9b49d"/>`;
const line=(x1,y1,x2,y2,color='#9dab93')=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="2" fill="none"/>`;
const dot=(x,y,color='#527e67',r=7)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
export function streamFrame(kind,p,t){let svg='',result='';
 if(kind==='log'){
  const m=replayLogModel({start:+p.start,earliest:+p.earliest}),x=n=>75+n*79,fast=Math.min(8,m.fastStart+t*1.7),slow=m.missing?m.start:Math.min(8,m.start+t*.7);
  svg=text(20,30,'One retained log, independent reading positions','scene-title');
  for(const r of m.records)svg+=card(x(r.offset)-30,100,60,65,r.retained?'#e0e9d6':'#eee4dd')+text(x(r.offset),125,r.offset,'tick','middle')+text(x(r.offset),151,r.retained?r.label:'gone','small','middle');
  for(const [y,position,label,color]of [[240,fast,'Consumer A','#527e67'],[325,slow,'Replay consumer B',m.missing?'#ad7857':'#687e9d']]){svg+=line(45,y,710,y)+text(20,y-25,label)+dot(x(Math.floor(position)),y,color)+text(20,y+28,position>=8?'At end; wait for new records':'Next offset: '+Math.floor(position));}
  if(m.missing)svg+=text(20,404,'Replay cannot cross deleted history','equation');else svg+=text(20,404,'Reading moves a cursor. It does not erase the log.','equation');
  result=m.missing?'The requested offset is older than retention. This consumer needs another recovery source; silently skipping records would produce incomplete state. Other consumers can continue.':'Each consumer controls its own position. Moving B back does not move A or alter retained records. This is one partition; offsets do not establish an order across different partitions.';
 }else if(kind==='projection'){
  const m=eventProjectionModel({mode:+p.mode,compact:+p.compact}),progress=Math.min(3,t*.65),count=Math.floor(progress),value=count?m.states[count-1]:0;
  svg=text(20,30,'State is a fold over the retained history','scene-title')+text(20,75,+p.mode?'Events express changes to quantity':'Change records contain the complete new quantity');
  for(const e of m.events){const x=100+e.id*200,active=e.id<count;svg+=card(x-70,120,140,65,e.retained?(active?'#d1e1c5':'#e7eddf'):'#eee4dd')+text(x,160,e.label,'equation','middle');if(!e.retained)svg+=line(x-60,130,x+60,175,'#b28568');if(e.id<2)svg+=line(x+70,152,x+130,152);}
  svg+=card(245,280,250,85,count<3?'#e7eddf':m.correct?'#e0ead7':'#f0ddd0')+text(370,309,'Derived quantity','small','middle')+text(370,348,value,'equation','middle');
  const current=m.events[Math.min(2,count)];if(count<3&&current.retained){const f=smooth(progress-count),x=100+current.id*200;svg+=dot(x+(370-x)*f,185+95*f);}
  svg+=text(20,416,count<3?'Apply retained records in order':m.correct?'Rebuilt quantity: 4':'Lost history changes the answer: −1 instead of 4','equation');
  result=+p.mode?'Adding 2, adding 3, then removing 1 produces 4. Keeping only the last delta loses necessary history. A snapshot plus its later events is a different, valid recovery scheme.':'Each change record replaces the complete quantity. For this one key, the last full value is sufficient to rebuild current state. This simplification does not apply to arbitrary delta events.';
 }else if(kind==='windows'){
  const m=windowedEventsModel({clock:+p.clock,delay:+p.delay,policy:+p.policy}),now=Math.min(25,t*3.5),seen=m.steps.filter(e=>e.arrival<=now),counts=seen.at(-1)?.counts??[0,0,0],x=n=>70+n*21;
  svg=text(20,30,+p.clock?'Arrival time determines the processing-time window':'Event time keeps the original window','scene-title')+text(20,75,'Top: event time · bottom: processing time');
  for(let i=0;i<3;i++){svg+=card(x(i*10),100,210,72,i%2?'#e8e0cb':'#e1ead8')+text(x(i*10)+105,123,`[${i*10}, ${(i+1)*10})`,'tick','middle');}
  svg+=line(70,250,705,250);for(const e of m.events){const arrived=e.arrival<=now;svg+=dot(x(e.time),148,'#b6c2a7',5)+line(x(e.time),160,x(e.arrival),250,arrived?'#82947a':'#d2d6c9');if(arrived)svg+=dot(x(e.arrival),250,e.id===2?'#ac7e46':'#557e68',6);else if(now>=e.time){const f=smooth((now-e.time)/(e.arrival-e.time));svg+=dot(x(e.time)+(x(e.arrival)-x(e.time))*f,160+90*f,e.id===2?'#ac7e46':'#557e68',6);}}
  svg+=line(x(now),220,x(now),280,'#ae7d4e')+text(x(now),300,'now '+Math.floor(now),'tick','middle');
  for(let i=0;i<3;i++)svg+=text(95+i*235,350,`Window ${i}: ${counts[i]}`,'equation');
  const late=seen.find(e=>e.late);svg+=text(20,407,+p.clock?'Arrival selects the window; the event timestamp does not':late?(late.accepted?'Late event revises its original window':'Late event dropped; original window stays incomplete'):'First event-time window is declared ready at processing time 15');
  result=+p.clock?'Processing-time windows group events by arrival. Delay or replay can move an event into a different window, even when its event timestamp stays the same.':'Event-time windows preserve when the event occurred. This example declares each window ready five time units after its end. A later event can be dropped or can produce a correction; readiness is a policy, not proof that every event arrived.';
 }else{
  const m=replayEffectModel({dedupe:+p.dedupe}),index=Math.min(m.states.length-1,Math.floor(t/.75)),s=m.states[index];
  svg=text(20,30,'Replaying a message can repeat its effect','scene-title')+text(20,75,s.label);
  for(const [i,amount]of [10,20,30].entries())svg+=card(40+i*240,105,190,65,s.offset===i+1?'#d4e3c8':'#e8eddf')+text(135+i*240,132,'offset '+(i+1),'tick','middle')+text(135+i*240,159,'+'+amount,'equation','middle');
  svg+=card(40,245,300,110)+text(190,273,'Durable output','small','middle')+text(190,311,'Total = '+s.value,'equation','middle')+text(190,339,+p.dedupe?'Applied offset stored atomically: '+s.lastApplied:'No duplicate detection','tick','middle');
  svg+=card(400,245,300,110,'#e9e2cf')+text(550,273,'Consumer checkpoint','small','middle')+text(550,316,'Offset '+s.ack,'equation','middle');
  if(s.lastApplied>s.ack)svg+=line(340,300,400,300,'#b28255')+text(370,222,'Output is ahead of the checkpoint','small','middle');
  svg+=text(20,414,index<m.states.length-1?'A crash can reopen this gap':m.correct?'Three messages, one effect each: total 60':'Offset 2 applied twice: total 80','equation');
  result='The consumer restarts from the recorded offset. Writing the applied offset atomically with the output lets the sink reject a replay. This bounded example assumes ordered deterministic input and one writer; it does not make arbitrary external side effects exactly once.';
 }return {svg,result};
}
export const streamDemos=[
 ['log','Logs, offsets, and replay',{start:0,earliest:0},[range('start','B starts at offset',0,8),range('earliest','Earliest retained offset',0,4)],'One partition with eight retained-or-expired records and two independent consumers. Cursors are the next offsets to read. No partition reassignment, broker failure, or cross-partition order.'],
 ['projection','Events and derived state',{mode:'1',compact:'0'},[select('mode','Record meaning',['Complete new value','Quantity delta']),select('compact','Keep history',['Keep all records','Keep last record only'])],'One key, initial quantity zero. Full records replace its value; delta events add to it. Last-record compaction is intentionally invalid for these deltas. No snapshot, deletion, or multiple-key transaction.'],
 ['windows','Event time and late arrivals',{clock:'0',delay:18,policy:'1'},[select('clock','Window clock',['Event time','Processing time']),range('delay','Arrival time of event at 7',8,22),{...select('policy','Late event',['Drop','Correct result']),visibleWhen:p=>+p.clock===0}],'Six synthetic events; half-open windows of width ten. An event-time window is declared ready five units after its end. This fixed illustrative policy is not a general watermark algorithm. Timestamps are assumed accurate.'],
 ['effects','Replay and duplicate effects',{dedupe:'1'},[select('dedupe','Output write',['Increment only','Increment with applied offset'])],'One ordered partition, deterministic increments, one active writer, durable sink. The applied offset and counter are stored atomically. Crash occurs after offset 2 affects output but before consumer checkpoint 2. No external email or payment effects.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-stream-'+kind,title,params,controls,limits,draw:(p,t)=>streamFrame(kind,p,t)}));
