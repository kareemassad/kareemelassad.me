import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {leaderLogModel} from './leader-log-model-v1.js';
const colors={A:'#a67c45',B:'#5c809e'};
const card=(x,y,w,h,label)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#fffdf7" stroke="#a6b49c"/>`+text(x+12,y+24,label,'small');
export function leaderLogFrame(p,t){
 const m=leaderLogModel({...p,delay:+p.delay,time:t});
 let svg=text(20,30,'Two writes. One chosen order.','scene-title')+text(20,62,'Both clients set the same key x. Followers apply log positions in order.','small');
 svg+=card(25,95,160,65,'Client A: x = 1')+card(25,180,160,65,'Client B: x = 2');
 svg+=card(255,95,195,197,'Leader log')+card(520,95,195,197,'Follower log');
 for(const w of m.log){
  const y=148+(w.position-1)*58,accepted=t>=w.accepted,received=m.received.some(r=>r.position===w.position),applied=m.applied>=w.position;
  for(const [x,visible,buffered]of [[270,accepted,false],[535,received,received&&!applied]]){
   svg+=`<rect x="${x}" y="${y}" width="165" height="42" rx="5" fill="${visible?buffered?'#f1e3c6':'#e1ecdb':'#efeee6'}" stroke="${visible?colors[w.client]:'#d5d7cc'}"/>`+text(x+9,y+18,visible?`#${w.position} · ${w.client} sets x = ${w.value}`:`#${w.position} · waiting`,'small')+text(x+9,y+33,visible?(buffered?'buffered; #1 is missing':x===270?'accepted':'applied'):'','tick');
  }
  const startY=w.client==='A'?127:212;
  svg+=`<path d="M185 ${startY} L270 ${y+21} M435 ${y+21} H535" stroke="#b8c0ad" fill="none"/>`;
  if(t>=w.accepted-.8&&t<w.accepted){const f=smooth((t-w.accepted+.8)/.8);svg+=`<circle cx="${185+85*f}" cy="${startY+(y+21-startY)*f}" r="6" fill="${colors[w.client]}"/>`;}
  const arrival=m.arrivals[w.position-1].at;
  if(t>=w.accepted&&t<arrival){const f=smooth((t-w.accepted)/(arrival-w.accepted));svg+=`<circle cx="${435+100*f}" cy="${y+21}" r="6" fill="${colors[w.client]}"/>`;}
 }
 svg+=text(270,269,'x = '+m.leaderValue,'small')+text(535,269,'x = '+m.followerValue,'small');
 const observation=m.buffered.length?'#2 arrived first. Keep it buffered; do not apply it.':m.applied===2?'Both copies applied #1, then #2. They agree on x.':m.leader.length===0?'Neither write has reached the leader yet.':m.applied===1?'The follower has applied only the first log entry.':'The leader has accepted writes; the follower is behind.';
 svg+=text(20,340,observation,'small')+text(20,385,'Change which client reaches the leader first. Then delay or reorder delivery.','small')+text(20,420,'Lag changes the visible prefix. It does not reverse the log.','small');
 return {svg,result:m.applied===2?`The last log entry sets x = ${m.followerValue}. Reversing the accepted order changes that final value. A follower must wait for missing earlier entries before applying a later entry.`:'The leader assigns positions to two conflicting writes. Colored packets show those entries moving; log rows and x change only after arrival and ordered application.'};
}
export const leaderLogDemo=continuousSvgDemo({id:'ddia-leader',title:'One leader orders the write stream',params:{first:'A',delay:2,reorder:'0'},controls:[
 {key:'first',label:'First write accepted',type:'select',options:[{value:'A',label:'A sets x = 1 first'},{value:'B',label:'B sets x = 2 first'}]},
 {key:'delay',label:'Follower delay · model time',type:'range',min:1,max:4,step:1},
 {key:'reorder',label:'Delivery to follower',type:'select',options:[{value:'0',label:'In log order'},{value:'1',label:'Entry 2 arrives first'}]},
],draw:leaderLogFrame,limits:'Two writes to one key, one leader, one follower, initially x = 0. The leader selects an order by arrival. The follower buffers an entry received before its predecessor. Times are illustrative units. No client acknowledgment, crash, election, transaction isolation, or claim that all transports reorder messages.'});
