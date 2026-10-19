import {replicationLesson,replicationDefaults} from './replication-lessons.js';
const node=(name,value,status='ready')=>({name,value,status});
const edge=(from,to,label)=>({from,to,label});
export function vectorRelation(a,b){if(a.length!==b.length)throw Error('Vector dimensions differ.');const aLe=a.every((v,i)=>v<=b[i]),bLe=b.every((v,i)=>v<=a[i]);return aLe&&bLe?'equal':aLe?'before':bLe?'after':'concurrent';}
export function quorumResult(w,r,start=0){if(![w,r,start].every(Number.isInteger)||w<1||w>5||r<1||r>5||start<0||start>4)throw Error('Outside the five-replica domain.');const written=Array.from({length:w},(_,i)=>i),read=Array.from({length:r},(_,i)=>(start+i)%5),overlap=read.filter(i=>written.includes(i));return {written,read,overlap,guaranteed:w+r>5,version:overlap.length?2:1};}
export function replicationState(id,input={}){
 const lesson=replicationLesson(id);if(!lesson)throw Error('Unknown replication lesson.');
 const state={...replicationDefaults(id),...input};
 if(!Number.isInteger(state.step)||state.step<0||state.step>=lesson.cases.length)throw Error('Outside the reviewed step domain.');
 const t=state.step;let nodes=[],edges=[],result='',values={};
 const replicas=(a,b,c)=>[node('Leader',a),node('Follower A',b),node('Follower B',c)];
 if(id==='overview'||id==='summary'){
  nodes=t===0?replicas('writes','reads','reads'):t===1?[node('Leader A','writes'),node('Leader B','writes'),node('Follower','reads')]:[node('Replica A','read / write'),node('Replica B','read / write'),node('Replica C','read / write')];
  edges=t===0?[edge(0,1,'ordered log'),edge(0,2,'ordered log')]:t===1?[edge(0,1,'updates'),edge(1,0,'updates'),edge(1,2,'updates')]:[edge(0,1,'versions'),edge(1,2,'versions')];
  result=['One write order; follower reads may lag.','Multiple write origins; conflicts need a policy.','Responses and version reconciliation determine reads.'][t];
 }else if(id==='leader'||id==='ack'){
  nodes=replicas(t>=1?'v2':'v1',t>=2?'v2':'v1',t>=3?'v2':'v1');
  edges=t===1?[edge(0,1,'send log 11'),edge(0,2,'send log 11')]:t===2?[edge(1,0,'ack log 11')]:t===3?[edge(2,0,'ack log 11')]:[];
  if(id==='ack'){if(![0,1].includes(state.sync))throw Error('Unknown acknowledgment mode.');values.acknowledged=t>=(state.sync?2:1);result=values.acknowledged?'Client has an acknowledgment.':'Client is waiting.';}
  else result=['The client has not written.','The leader has v2; followers can still return v1.','A has caught up; B still lags.','All three copies contain v2.'][t];
 }else if(id==='bootstrap'){
  nodes=[node('Leader',t===0?'v1 · log 10':'v2 · log 11'),node('Snapshot','v1 · log 10'),node('New follower',t<2?'empty':t===2?'v1':'v2')];edges=t===2?[edge(1,2,'load snapshot')]:t===3?[edge(0,2,'replay log 11')]:[];result=t===3?'Snapshot plus catch-up includes the intervening write.':'The snapshot records a consistent state and its log position.';
 }else if(id==='failover'){
  nodes=[node('Old leader','v2',t>=1?'offline':'ready'),node(t>=2?'New leader':'Follower A','v1'),node('Follower B','v1')];edges=t===3?[edge(1,2,'serve v1')]:[];values.acknowledgedVersion=2;values.readVersion=t===3?1:null;result=t>=2?'The promoted copy lacks the acknowledged v2 write.':'v2 exists only on the asynchronously replicated leader.';
 }else if(id==='own-writes'){
  nodes=[node('Client','requires v2'),node('Leader','v2'),node('Follower','v1')];values.readVersion=t===0?1:t===1?2:null;values.ownWriteVisible=t===1;edges=[edge(0,t===1?1:2,t===2?'minimum v2':'read')];result=t===0?'The read misses the client’s own write.':t===1?'This read observes the client’s v2 write.':'Do not return v1. Wait or route to a suitable replica.';
 }else if(id==='monotonic'){
  const versions=[[2,1],[1,1],[2,2]][t];values.versions=versions;values.monotonic=versions[1]>=versions[0];nodes=[node('Client','one session'),node('Read 1','v'+versions[0]),node('Read 2','v'+versions[1])];edges=[edge(1,0,'first'),edge(2,0,'second')];result=values.monotonic?(t===1?'Consistently stale; still monotonic.':'The session does not move backward.'):'New then old violates monotonic reads.';
 }else if(id==='prefix'){
  const observed=[['answer'],[],['question','answer']][t];values.observed=observed;values.validPrefix=!observed.includes('answer')||observed.indexOf('question')>=0&&observed.indexOf('question')<observed.indexOf('answer');nodes=[node('Question stream',t===2?'question':'pending'),node('Answer stream',t===1?'pending':'answer'),node('Observer',observed.join(' → ')||'nothing yet')];edges=t===0?[edge(1,2,'answer first')]:t===2?[edge(0,2,'question'),edge(1,2,'answer')]:[];result=values.validPrefix?'The observed events respect this causal dependency.':'The observer sees the dependent answer without its question.';
 }else if(id==='conflict'){
  const content=t===0?['blue','green']:t===1?['blue | green','blue | green']:['blue + green','blue + green'];nodes=[node('Leader A',content[0]),node('Leader B',content[1])];edges=t===1?[edge(0,1,'exchange edits'),edge(1,0,'exchange edits')]:[];values.siblings=t===2?1:2;result=t===2?'The application explicitly combines both edits.':'Two successful local writes require conflict handling.';
 }else if(id==='repair'){
  nodes=[node('Replica A','v2'),node('Replica B','v2'),node('Replica C',t===3?'v2':'v1',t===0?'offline':'ready')];edges=t===2?[edge(0,2,'compare v2 with v1')]:t===3?[edge(0,2,'repair with v2')]:[];values.readVersion=t>=2?2:null;result=t===3?'The stale replica has been repaired.':t===2?'A read finds the newer value in this ordered fixture.':'A missed write leaves C behind.';
 }else if(id==='quorum'){
  values=quorumResult(state.w,state.r,state.start);nodes=Array.from({length:5},(_,i)=>({...node('Replica '+String.fromCharCode(65+i),values.written.includes(i)?'v2':'v1'),read:values.read.includes(i),written:values.written.includes(i)}));result=(values.guaranteed?'Overlap is guaranteed. ':'A disjoint read is possible. ')+(values.overlap.length?'This read returns v2.':'This read misses v2 and returns v1.');
 }else if(id==='sloppy'){
  nodes=[node('Home A',t===2?'v2':'v1'),node('Home B',t===2?'v2':'v1'),node('Home C','v1'),node('Fallback D','v2'),node('Fallback E','v2')];edges=t===2?[edge(3,0,'handoff'),edge(4,1,'handoff')]:[];values.homeN=3;values.w=2;values.r=2;values.readVersion=t===2?2:1;result=t===2?'Handoff returns the value to home replicas.':'W + R = 4 exceeds home N = 3, but the write used a different set.';
 }else if(id==='vectors'){
  const a=[1,0],b=t===2?[1,1]:[0,1];values.relation=vectorRelation(a,b);nodes=[node('Version A','[1,0]'),node('Version B','['+b.join(',')+']'),node('Application',t===2?'includes both':'retain siblings')];edges=t===2?[edge(0,2,'included'),edge(1,2,'later context')]:[];result=values.relation==='concurrent'?'Neither vector dominates: retain both versions.':'The later context dominates the earlier vector in this fixture.';
 }
 return {lesson,state,nodes,edges,result,values,caseLabel:lesson.cases[t]};
}
