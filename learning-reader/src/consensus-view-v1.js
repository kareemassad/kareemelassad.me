import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {linearizationModel,logicalClockModel,atomicCommitModel,epochQuorumModel} from './consensus-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});
const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
const path=(d,color='#a8b39d',width=2)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
const dot=(x,y,color='#517e65',r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const rect=(x,y,w,h,color='#e4ecdf')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${color}" stroke="#a5b29c"/>`;
const packet=(a,b,t,color='#517e65')=>{const f=smooth(t);return dot(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,color,7);};
export function consensusFrame(kind,p,t){let svg='',result='';
 if(kind==='linear'){
  const m=linearizationModel({laterValue:+p.laterValue,overlap:+p.overlap}),x=n=>105+n*55,progress=smooth(t/3);
  svg=text(20,30,'Can one instant explain every read?','scene-title');
  for(const [i,o]of m.operations.entries()){const y=100+i*70;svg+=text(15,y+6,o.id==='W'?'Write 1':'Read '+o.id)+path(`M${x(o.start)} ${y} H${x(o.end)}`,'#a9b7a0',16)+text(x(o.end)+10,y+5,o.id==='W'?'ok':String(o.value));for(const edge of [o.start,o.end])svg+=path(`M${x(edge)} ${y-13} V${y+13}`);}
  for(let n=1;n<=10;n++)svg+=text(x(n),285,n,'tick','middle');
  svg+=text(105,302,'Observer time · each bar spans request to response','tick');
  // A continuously narrowing band exposes the constraint, not a chosen answer.
  const left=1+(m.lower-1)*progress,right=10+(m.upper-10)*progress;
  svg+=rect(x(Math.min(left,right)),316,Math.max(2,Math.abs(right-left)*55),35,m.valid?'#d7e6cf':'#f0d6ca');
  svg+=path(`M${x(left)} 303 V362`,'#9f764d')+path(`M${x(right)} 303 V362`,'#517e65');
  if(m.valid&&t>3){svg+=path(`M${x(m.point)} 82 V352`,'#517e65');for(const o of m.witness)svg+=dot(x(o.point),100+m.operations.findIndex(a=>a.id===o.id)*70);}
  svg+=text(20,378,m.valid?'Green band: possible write instants':`Required: after ${m.lower}, but before ${m.upper}`,'small');
  svg+=text(20,418,progress<1?'Narrow the possible write instant…':m.valid?'A legal single-copy order exists':'No possible write instant','equation');
  result=t<=3?'The bars show completed operations. Narrow the range of possible write instants using the returned values and the request intervals.':m.valid?'The marked instants form a legal order inside the request intervals. Overlapping reads can take effect in either order. Real-time order constrains reads only when their intervals do not overlap.':'A returned 1 before B started, but B returned 0. The write would need to take effect before A finished and after B started. Those constraints conflict.';
 }else if(kind==='logical'){
  const m=logicalClockModel({carry:+p.carry,start:+p.start}),positions={a:[170,130],b:[290,260],c:[470,260],d:[590,130]},travel=smooth((t-1)/3);
  svg=text(20,30,'Carry the causal past into the next counter','scene-title')+text(25,135,'Node A')+text(25,265,'Node B')+path('M110 130 H700')+path('M110 260 H700');
  svg+=path('M170 130 L470 260','#b18a57');if(t>=1&&t<4)svg+=packet(positions.a,positions.c,travel,'#ac7c45');
  svg+=text(320,175,+p.carry?'Message carries '+(Number(p.start)+1):'Counter omitted','tick','middle');
  for(const e of m.events){const [x,y]=positions[e.id],visible=t>=e.time;svg+=dot(x,y,visible?'#517e65':'#c5cbbb',9)+text(x,y-24,e.id,'small','middle')+text(x,y+30,visible?`(${e.counter}, ${e.node})`:'…','small','middle');}
  svg+=text(20,345,t<5?'Wait for all four event timestamps':'Total order: '+m.totalOrder.map(e=>e.id).join(' → '),'equation')+text(20,395,t<5?'The message can carry knowledge of an earlier event.':m.causalOrder?(+p.carry?'The order respects a → c':'This ordering fits by chance; no causal guarantee'):'Broken order: c sorts before its cause a');
  result='The pair (counter, node ID) breaks ties. Carrying the largest observed counter preserves causal order. Events c and d are concurrent, even though their timestamps put them in one order. Timestamp order cannot prove a causal link.';
 }else if(kind==='commit'){
  const m=atomicCommitModel({vote:+p.vote,crash:+p.crash,recover:+p.recover}),step=Math.min(m.states.length-1,Math.floor(t/.8)),s=m.states[step],message=m.states[step+1]?.message,fraction=(t/.8)%1;
  svg=text(20,30,'A promise is not a commit decision','scene-title')+text(20,70,s.label);
  const points={C:[370,170],A:[155,315],B:[585,315]};svg+=path('M370 170 L155 315 M370 170 L585 315');
  svg+=rect(235,95,270,95,s.coordinator==='crashed'?'#f0d9cf':'#e4ecdf')+text(370,122,'Coordinator','small','middle')+text(370,150,s.coordinator,'small','middle')+text(370,177,'Durable log: '+(s.log??'no decision'),'tick','middle');
  for(let i=0;i<2;i++){const x=45+i*430,state=s.participants[i];svg+=rect(x,300,220,85,state==='prepared'?'#f0e4c6':state==='aborted'?'#efddd4':'#e1ebd9')+text(x+110,325,'Participant '+['A','B'][i],'small','middle')+text(x+110,360,state,'equation','middle');}
  if(message){const from=message.from==='both'?['A','B']:[message.from],to=message.to==='both'?['A','B']:[message.to];for(const a of from)for(const b of to)svg+=packet(points[a],points[b],fraction);svg+=text(370,252,message.label,'small','middle');}
  svg+=text(20,420,s.participants.includes('prepared')?'Prepared: retain the promise while waiting':step===0?'Work is still uncommitted':'No participant remains in doubt');
  result='A yes vote gives up the right to abort alone. The coordinator records its decision before sending it. Recovery repeats that durable decision; without a commit record, this model aborts. A prepared participant cannot infer an outcome from a timeout.';
 }else{
  const m=epochQuorumModel({split:+p.split}),f=smooth(t/3);
  svg=text(20,30,'Leadership needs a current majority','scene-title')+text(20,73,'Five voters · three votes needed · fixed membership');
  svg+=text(120,130,'Epoch 1 leader','small','middle')+text(620,130,'Epoch 2 candidate','small','middle');
  for(const n of m.nodes){const x=90+n.id*140,color=n.promised===1?'#9d7848':'#537b69',leader=n.promised===1?[120,145]:[620,145];svg+=path(`M${leader} L${x} 238`,color);if(t<3)svg+=packet([x,238],leader,f,color);svg+=rect(x-48,238,96,85,n.promised===1?'#eee1ca':'#dfe9d8')+text(x,266,String.fromCharCode(65+n.id),'small','middle')+text(x,300,'epoch '+n.promised,'tick','middle');}
  svg+=text(120,365,t<3?'Collecting votes':`${m.oldVotes.length} / 3 votes`,'equation','middle')+text(620,365,t<3?'Collecting votes':`${m.newVotes.length} / 3 votes`,'equation','middle');
  svg+=text(370,411,t<3?'Wait for replies from the fixed voter groups':m.newCanDecide?'New epoch has a majority; old leader cannot decide':'New epoch lacks a majority; it cannot take over','small','middle');
  result='Each voter rejects lower epochs after promising a higher one. Two disjoint sets cannot both contain three of these five voters. This shows the quorum barrier; preserving earlier decisions also requires the protocol’s log or accepted-value rules.';
 }return {svg,result};
}
export const consensusDemos=[
 ['linear','Finding a linearization point',{laterValue:'0',overlap:'0'},[select('laterValue','Read B returns',['Old value 0','New value 1']),select('overlap','Read intervals',['B starts after A finishes','A and B overlap'])],'One register initially 0, one successful write of 1, two reads. Intervals use an external observer’s time. The feasibility check is specific to this bounded history, not a general checker.'],
 ['logical','Causality and logical clocks',{carry:'1',start:5},[select('carry','Message metadata',['No counter','Carry observed counter']),range('start','Initial counter at A',2,9)],'Two nodes and four events. Each local event increments a counter; a receive first takes the maximum observed counter. Node ID breaks ties. No physical-clock claim.'],
 ['commit','Two-phase commit and uncertainty',{vote:'1',crash:'2',recover:'0'},[select('vote','Participant B vote',['No','Yes']),select('crash','Coordinator fault',['None','After votes, before decision','After decision reaches A']),select('recover','Recovery',['Remain stopped','Recover from durable log'])],'Two participants, one coordinator, durable prepare and decision records. No peer recovery protocol. A voted-no participant can abort. Prepared work remains unresolved until the decision arrives.'],
 ['epochs','Epochs and quorum barriers',{split:2},[range('split','Voters still in epoch 1',0,5)],'Five fixed voters divided by their highest promised epoch. Each votes for one side in this example. This is a necessary quorum constraint, not a complete consensus protocol or proof of log safety.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-consensus-'+kind,title,params,controls,limits,draw:(p,t)=>consensusFrame(kind,p,t)}));
