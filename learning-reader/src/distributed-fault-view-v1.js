import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';import {uncertainRequestModel,clockOrderModel,fencingModel} from './distributed-fault-model-v1.js';
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
const box=(x,y,w,h,title,good=true)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${good?'#e3eddd':'#f0ded6'}" stroke="#a5b49c"/>`+text(x+12,y+25,title);
export function distributedFaultFrame(kind,p,t){let svg='',result='';
 if(kind==='uncertainty'){
  const m=uncertainRequestModel({world:+p.world,delay:+p.delay,timeout:+p.timeout}),now=Math.min(220,t*45),x=n=>170+n*2.25;
  const observation=m.replyAt!==null&&now>=m.replyAt?(m.timedOut?'Late success reply received':'Success reply received'):now>=m.timeout?'Timeout · outcome unknown':'Waiting · no reply yet';
  svg=text(20,30,'One observation. Three possible histories.','scene-title')+text(20,61,'Move the timeout. Reveal the server histories. Compare the evidence.','small');
  svg+=box(20,79,700,66,'CLIENT SEES: '+observation,now<m.timeout||!m.timedOut);
  svg+=text(710,166,'Moving dots: elapsed time · dashed line: timeout '+p.timeout+' ms','tick','end');
  const names=['Request lost','Reply lost','Slow execution'];
  for(let world=0;world<3;world++){
   const h=uncertainRequestModel({world,delay:+p.delay,timeout:+p.timeout}),y=205+world*68,chosen=world===+p.world;
   svg+=`<rect x="20" y="${y-30}" width="700" height="60" rx="7" fill="${chosen?'#e6eee1':'#f2f1e9'}" stroke="${chosen?'#6c8965':'#d4d7ca'}"/>`+text(32,y-8,+p.reveal?names[world]:'Hidden history '+(world+1),'small')+text(32,y+13,chosen?'selected':'alternative','tick');
   svg+=`<path d="M170 ${y} H665" stroke="#aab5a0"/><path d="M${x(+p.timeout)} ${y-23} V${y+23}" stroke="#b27e48" stroke-dasharray="3 3"/>`;
   if(+p.reveal){
    if(h.executedAt!==null){const e=x(h.executedAt);svg+=`<circle cx="${e}" cy="${y}" r="7" fill="${now>=h.executedAt?'#527b60':'#d5decd'}"/>`+text(e,y-12,'execute','tick','middle');}
    if(h.replyAt!==null){const e=x(h.replyAt);svg+=`<path d="M${x(h.executedAt)} ${y} H${e}" stroke="#527b60" stroke-width="3"/>`+text(e,y+22,'reply','tick','middle');if(now>=h.replyAt)svg+=`<circle cx="${e}" cy="${y}" r="8" fill="#527b60"/>`;}
    else{const lost=world===0?25:65,e=x(lost);svg+=`<path d="M${e-5} ${y-5} l10 10 m0 -10 l-10 10" stroke="#b76857" stroke-width="2"/>`+text(e,y+22,'lost','tick','middle');}
   }
   svg+=`<circle cx="${x(now)}" cy="${y}" r="4" fill="#344f40"/>`;
  }
  for(const tick of [0,40,80,120,160,200])svg+=text(x(tick),390,tick+' ms','tick','middle');
  svg+=text(20,423,+p.reveal?'These are alternative worlds, not three requests.':'The client cannot see which hidden path its request took.','small');
  result=+p.reveal?'With a short timeout, all three histories produce silence. A longer timeout can expose the slow reply, but cannot distinguish a lost request from a lost reply.':'Select another hidden history: the same client observation can conceal a different outcome. Reveal the histories to see why retrying may repeat work that already happened.';
 }else if(kind==='clocks'){
  const m=clockOrderModel({skew:+p.skew}),now=Math.min(140,80+t*12);svg=text(20,30,'Clock order can contradict causal order','scene-title');
  for(let i=0;i<2;i++){const y=140+i*115;svg+=text(25,y-25,i?'B observes A, then writes x = 2':'A writes x = 1');svg+=`<path d="M90 ${y} H670" stroke="#b0baa6"/>`;for(const n of [90,100,110,120,130])svg+=text(90+(n-80)*10,y+25,n,'tick','middle');svg+=`<circle cx="${90+(m.realTimes[i]-80)*10}" cy="${y}" r="9" fill="${i?'#667e9f':'#a47a47'}"/>`+text(430,y-10,'Timestamp attached: '+m.stamps[i]);}
  svg+=`<path d="M290 140 L390 255" stroke="#7c9773" stroke-width="2"/>`+text(90,320,'Horizontal axes show real event time, not either machine’s clock.','tick');
  svg+=text(20,395,now<110?'Wait for B’s causally later write':m.winner===null?'Equal timestamps: tie policy needed':m.lost?'Timestamp winner: x = 1 · later write lost':'Timestamp winner: x = 2','equation');result='B writes after observing A. Increase A’s clock offset beyond the 10 ms real-time gap: last-write-wins then keeps the earlier value. Timestamp order does not establish causality.';
 }else{
  const m=fencingModel({check:+p.check,pause:+p.pause}),now=t*20,visible=m.events.filter(e=>e.time<=now),latest=visible.at(-1);
  svg=text(20,30,'A resumed process may hold an expired lease','scene-title')+box(25,80,210,75,'Client A · token 33')+box(500,80,210,75,'Client B · token 34')+box(240,280,260,95,+p.check?'Storage checks the token':'Storage accepts unchecked writes',+p.check===1);
  for(const e of m.events){const start=e.client==='A'?[130,155]:[605,155],end=[370,280],a=smooth((now-e.time+15)/15);svg+=`<path d="M${start} L${end}" stroke="#b6bfac"/>`;if(now>=e.time-15&&now<=e.time)svg+=`<circle cx="${start[0]+(end[0]-start[0])*a}" cy="${start[1]+(end[1]-start[1])*a}" r="7" fill="#4e806c"/>`;if(now>=e.time)svg+=text(e.client==='A'?25:490,205,`${e.token}: ${e.accepted?'accepted':'rejected'}`);}
  svg+=text(370,340,latest?'Highest token: '+latest.highest:'No write yet','small','middle')+text(20,415,'Stored value: '+(latest?.value??'unchanged'),'equation');result=+p.pause?'A resumes after B has acquired a newer lease and written. The resource must reject the older token; checking a lease before a pause is insufficient.':'Without the pause, A writes before B. Both writes are in token order and the newer work remains. Tokens must come from a trusted monotonic authority.';
 }return {svg,result};
}
export const distributedFaultDemos=[
 ['uncertainty','What a timeout can tell you',{world:'0',delay:120,timeout:80,reveal:'0'},[select('world','Hidden history',['Request lost','Reply lost','Slow execution']),range('delay','Slow execution · ms',40,180),range('timeout','Timeout · ms',30,200),select('reveal','Server history',['Hide','Reveal'])],'One request, deterministic selected delays, no retry. A successful reply arrives 20 ms after slow execution. Timeout is a client observation, not evidence of rollback.'],
 ['clocks','Clock order and causal order',{skew:15},[range('skew','A clock ahead · ms',0,30)],'Two causally ordered writes 10 ms apart. A is ahead by the selected offset; B has zero offset. The largest timestamp wins. Equal timestamps need a separate tie policy.'],
 ['fencing','Fencing a stale process',{check:'1',pause:'1'},[select('check','Storage validation',['No token check','Reject lower token']),select('pause','Client A',['No pause','Pause past lease expiry'])],'A holds token 33; B later holds token 34. Storage remembers the highest accepted token. Tokens are trusted and monotonically issued. No Byzantine clients or token-generation protocol.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-fault-'+kind,title,params,controls,limits,draw:(p,t)=>distributedFaultFrame(kind,p,t)}));
