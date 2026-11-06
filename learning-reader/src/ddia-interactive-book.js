// Original DDIA scenes for the shared reader. Accepted packages remain immutable.
import {replicationLessons,DDIA_SOURCE} from './replication-lessons.js';
import {replicationState,quorumResult} from './replication-models.js';
import {replicationTiming,vectorSpace} from './teaching-models-v1.js';
const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
const select=(key,label,options)=>({key,label,type:'select',options:options.map((label,value)=>({value,label}))});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const text=(x,y,s,cls='',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${escape(s)}</text>`;
const line=(x1,y1,x2,y2,cls='wire')=>`<path d="M${x1},${y1} L${x2},${y2}" class="${cls}"/>`;
const chip=(x,y,label,cls='')=>`<g class="chip ${cls}"><rect x="${x}" y="${y-20}" width="108" height="30" rx="15"/>${text(x+54,y,label,'small','middle')}</g>`;
const card=(x,y,name,value,state='')=>`<g class="replica ${state}"><rect x="${x}" y="${y}" width="164" height="96" rx="7"/>${text(x+16,y+26,name,'small')}${text(x+16,y+64,value,'value')}</g>`;
export function timingState(params,time){return replicationTiming({time:Math.round(params.run?Math.min(240,time*40):Number(params.time)),lagA:Math.round(params.lagA),lagB:Math.round(params.lagB),sync:Math.round(params.sync),failure:Math.round(params.failure),crash:Math.round(params.crash),promoted:Math.round(params.promoted)});}
function timingScene(p,time){
 const m=timingState(p,time),x=t=>146+t*2.1,ys=[80,158,236,314],names=['Client','Leader','Follower A','Follower B'];
 let svg=text(18,28,'ONE WRITE · v1 → v2','eyebrow')+text(716,28,m.time+' ms','clock','end');
 for(let i=0;i<4;i++){svg+=text(18,ys[i]+5,names[i],'small')+line(142,ys[i],650,ys[i],'lane');svg+=chip(614,ys[i]-23,i===0?(m.acknowledged?'success':'waiting'):'v'+m.versions[i-1],i===0?(m.acknowledged?'good':''):m.versions[i-1]===2?'good':'');}
 for(const message of m.messages){
  const delivered=message.end<(m.failure?m.crash:Infinity)&&m.time>=message.end;
  const stopped=m.failure&&m.time>=m.crash&&message.end>=m.crash;
  svg+=line(x(message.start),ys[message.from],x(message.end),ys[message.to],delivered?'delivered':stopped?'dropped':'pending');
  if(m.time>=message.start&&m.time<message.end&&!stopped){const a=(m.time-message.start)/(message.end-message.start);svg+=`<circle cx="${x(m.time)}" cy="${ys[message.from]+a*(ys[message.to]-ys[message.from])}" r="6" class="packet"/>`;}
 }
 if(m.failure){svg+=line(x(m.crash),52,x(m.crash),345,'failure')+text(x(m.crash)+7,365,'Leader fails','small warning');}
 svg+=line(x(m.time),48,x(m.time),340,'cursor');
 for(const tick of [0,60,120,180,240])svg+=text(x(tick),393,tick+' ms','tick','middle');
 svg+=text(18,430,m.readVersion===null?'Dots are messages in flight. Green paths have arrived.':'Promoted '+(m.promoted?'B':'A')+' returns v'+m.readVersion+(m.lostAcknowledged?' — the acknowledged write is missing.':'.'),'small');
 return {svg,result:m.result};
}
function quorumScene(p){
 const m=quorumResult(Math.round(p.w),Math.round(p.r),Math.round(p.start));let svg=text(20,30,'FIVE FIXED HOME REPLICAS','eyebrow');
 for(let i=0;i<5;i++){const x=44+i*140,w=m.written.includes(i),r=m.read.includes(i),over=w&&r;svg+=`<g class="set-node ${over?'overlap':''}"><rect x="${x}" y="126" width="112" height="130" rx="9"/>${text(x+56,160,String.fromCharCode(65+i),'value','middle')}${text(x+56,195,w?'v2':'v1','small','middle')}</g>`;if(w)svg+=line(x+56,76,x+56,126,'delivered')+text(x+56,65,'WRITE','tick','middle');if(r)svg+=line(x+56,256,x+56,306,'read-path')+text(x+56,329,'READ','tick','middle');if(over)svg+=text(x+56,235,'overlap','small','middle');}
 svg+=text(370,380,`${p.w} writes + ${p.r} reads ${m.guaranteed?'>':'≤'} 5`,'equation','middle')+text(370,416,m.overlap.length?'This read finds v2.':'This read misses the write.','small','middle');
 return {svg,result:(m.guaranteed?'Every read set must overlap. ':'Try another read set: overlap is not guaranteed. ')+(m.overlap.length?'These sets share '+m.overlap.length+' replica(s).':'These sets are disjoint.')};
}
function vectorScene(p){
 const m=vectorSpace(Object.fromEntries(['a0','a1','b0','b1'].map(k=>[k,Math.round(p[k])]))),x=n=>180+n*85,y=n=>365-n*75;
 let svg=text(20,28,'HISTORY IS A PARTIAL ORDER','eyebrow');
 for(let n=0;n<=4;n++)svg+=line(x(n),y(0),x(n),y(4),'lane')+line(x(0),y(n),x(4),y(n),'lane')+text(x(n),390,n,'tick','middle')+text(161,y(n)+4,n,'tick','end');
 svg+=text(350,423,'Updates from replica A','small','middle')+text(20,62,'Updates from B','small');
 for(const [v,name,cls] of [[m.a,'Version A','delivered'],[m.b,'Version B','read-path']])svg+=line(x(0),y(0),x(v[0]),y(v[1]),cls)+`<circle cx="${x(v[0])}" cy="${y(v[1])}" r="7" class="${cls}"/>`+text(x(v[0])+12,y(v[1])-12,name+' ['+v+']','small');
 return {svg,result:m.relation==='concurrent'?'Neither history includes the other. Keep both values until the application resolves them.':m.relation==='equal'?'The two version vectors describe equal histories.':m.relation+'. The later vector includes the earlier history.'};
}
function stepScene(id,p){
 const m=replicationState(id,{step:Math.round(p.step)}),n=m.nodes.length,positions=n<=3?m.nodes.map((_,i)=>[76+i*224,160]):m.nodes.map((_,i)=>[24+i*142,160]);
 let svg=text(20,30,'STEP '+(Number(p.step)+1)+' / '+m.lesson.cases.length,'eyebrow')+text(20,70,m.caseLabel,'scene-title');
 // Causal edges stay visible and the current state is stated on each copy.
 for(const e of m.edges){const [a,b]=[positions[e.from],positions[e.to]],mid=(a[0]+b[0])/2+82;svg+=`<path d="M${a[0]+82},${a[1]} Q${mid},95 ${b[0]+82},${b[1]}" class="delivered" marker-end="url(#ddia-arrow)"/>`+text(mid,112,e.label,'tick','middle');}
 for(let i=0;i<n;i++){const node=m.nodes[i],[x,y]=positions[i];if(n<=3)svg+=card(x,y,node.name,node.value,node.status==='offline'?'offline':'');else svg+=`<g class="replica"><rect x="${x}" y="${y}" width="130" height="96" rx="7"/>${text(x+10,y+27,node.name,'small')}${text(x+10,y+66,node.value,'value')}</g>`;}
 if(id==='monotonic'){const v=m.values.versions;svg+=line(300,312,500,v[1]<v[0]?363:312,v[1]<v[0]?'failure':'delivered')+text(370,402,m.values.monotonic?'No backward step':'The session moved backward','small','middle');}
 else if(id==='prefix')svg+=text(370,354,m.values.validPrefix?'Cause appears before its effect.':'The answer arrived without its question.','small','middle');
 else if(id==='own-writes')svg+=text(370,354,m.values.readVersion===null?'Minimum version not met → wait or route elsewhere.':'Client wrote v2 → this read returns v'+m.values.readVersion,'small','middle');
 else svg+=text(370,354,'Change the step to trace what happens next.','small','middle');
 return {svg,result:m.result};
}
const timingControls=[{key:'run',label:'Run timeline',type:'toggle'},range('time','Inspect time · ms',0,240),range('lagA','Delay to A · ms',20,160),range('lagB','Delay to B · ms',20,160),select('sync','Success reply',['After leader write','Wait for follower A']),select('failure','Leader',['Keep running','Fail at selected time']),range('crash','Failure time · ms',30,220),select('promoted','Promote',['Follower A','Follower B'])];
const camera={mode:'2d',center:[0,0],height:12,width:18};
function createScene(lesson){
 const timing=['leader','ack','failover'].includes(lesson.id),quorum=lesson.id==='quorum',vectors=lesson.id==='vectors';
 const params=timing?{run:true,time:0,lagA:100,lagB:150,sync:'0',failure:lesson.id==='failover'?'1':'0',crash:70,promoted:'0'}:quorum?{w:2,r:3,start:2}:vectors?{a0:1,a1:0,b0:0,b1:1}:{step:'0'};
 const controls=timing?timingControls:quorum?[range('w','Write responses · W',1,5),range('r','Read responses · R',1,5),range('start','Rotate the read set',0,4)]:vectors?[range('a0','Version A · replica A',0,4),range('a1','Version A · replica B',0,4),range('b0','Version B · replica A',0,4),range('b1','Version B · replica B',0,4)]:[select('step','Trace',lesson.cases)];
 return {id:'ddia-'+lesson.id,title:lesson.title,camera,params,controls,create(ctx){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('ddia-scene');svg.setAttribute('viewBox','0 0 740 450');svg.setAttribute('role','img');svg.setAttribute('aria-label',lesson.title);document.getElementById('canvas-wrap').append(svg);
  const status=document.createElement('p');status.className='ddia-result';const details=document.createElement('details'),summary=document.createElement('summary'),limit=document.createElement('p');summary.textContent='Model assumptions';limit.textContent=timing?'One key and one write. Failure drops messages not yet delivered, including equal-time arrivals. Promotion is 20 ms later. No election, fencing, disk failure, or split brain is modeled.':lesson.limit;details.append(summary,limit);ctx.panel.append(status,details);
  let previous='';return {frame(ctx){const result=timing?timingScene(ctx.params,ctx.time):quorum?quorumScene(ctx.params):vectors?vectorScene(ctx.params):stepScene(lesson.id,ctx.params);if(result.svg!==previous){svg.innerHTML='<defs><marker id="ddia-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#47755c"/></marker></defs>'+result.svg;previous=result.svg;}if(status.textContent!==result.result)status.textContent=result.result;},dispose(){svg.remove();}};
 }};
}
const questions={
 ack:['Does a leader-only success reply mean A already has the write?',['Yes','No'],1,'The reply reaches the client at 40 ms. With these delays, A receives the write at 120 ms.'],
 failover:['The client saw success. What will the promoted A return?',['v2','v1'],1,'The leader fails at 70 ms, before A receives the write at 120 ms. A still has v1.'],
 quorum:['W = 2, R = 3, N = 5. Must the response sets overlap?',['Always','Not always'],1,'At equality a disjoint read is possible. Increase W or R to force overlap.'],
 vectors:['Are [1,0] and [0,1] earlier and later versions?',['Yes','They are concurrent'],1,'Each history has an update missing from the other. Neither includes the other.'],
 monotonic:['Can a consistently stale session still be monotonic?',['Yes','No'],0,'Reading v1 twice does not move backward. Monotonic does not mean current.']
};
const unsupported={id:'ddia-unprepared',title:'Read at your own pace',camera,params:{},create(ctx){const p=document.createElement('p');p.textContent='Experiments are prepared for selected passages in Chapter 5. Use the section menu to open one.';ctx.panel.append(p);return {frame(){}};}};
const demos=replicationLessons.map(createScene),cues=[{at:{page:0,y:0},demo:unsupported.id,note:'The full book is readable. Interactive coverage is limited to selected replication passages.'}];
for(const lesson of replicationLessons){
 const q=questions[lesson.id],timing=['leader','ack','failover'].includes(lesson.id);
 cues.push({at:{page:lesson.start.page-1,y:lesson.start.y},demo:'ddia-'+lesson.id,params:timing?{run:true}:undefined,note:lesson.caption,...(q?{predict:{q:q[0],options:q[1],answer:q[2],explain:q[3],...(timing?{reveal:{run:true}}:{})}}:{})});
 const next=replicationLessons[replicationLessons.indexOf(lesson)+1];if(!next||next.start.page+next.start.y>lesson.end.page+lesson.end.y+.001)cues.push({at:{page:lesson.end.page-1,y:lesson.end.y},demo:unsupported.id,note:'No experiment is prepared for this interval. Continue reading or choose a lesson.'});
}
export const ddiaInteractiveBook={id:'ddia-interactive-v2',source:DDIA_SOURCE,pdf:'../../books/ddia.pdf',openingPosition:{page:166,y:.155},crops:Array.from({length:491},()=>[0,0,504,661.5]),metadata:{pages:491,chapters:[{n:5,title:'Replication · 14 interactive lessons',page:166,sections:replicationLessons.map(l=>({id:'5-'+l.id,title:l.title,page:l.start.page-1,y:l.start.y}))}],figures:{},tables:{}},demos:[unsupported,...demos],cues};
