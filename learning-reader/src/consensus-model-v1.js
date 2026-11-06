const integer=(v,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw Error('Invalid consensus input');};
// A bounded one-write register history. Reads can take effect anywhere in their interval.
export function linearizationModel({laterValue=0,overlap=0}={}){
 integer(laterValue,0,1);integer(overlap,0,1);
 const operations=[{id:'W',start:1,end:10,value:1},{id:'A',start:3,end:5,value:1},{id:'B',start:overlap?4:6,end:8,value:laterValue}];
 const lower=Math.max(1,...operations.slice(1).filter(o=>o.value===0).map(o=>o.start));
 const upper=Math.min(10,...operations.slice(1).filter(o=>o.value===1).map(o=>o.end));
 const valid=lower<upper,point=valid?(lower+upper)/2:null;
 const witness=valid?operations.map(o=>({...o,point:o.id==='W'?point:o.value===0?(o.start+Math.min(o.end,point))/2:(Math.max(o.start,point)+o.end)/2})).sort((a,b)=>a.point-b.point):[];
 return {operations,lower,upper,valid,point,witness};
}
export function logicalClockModel({carry=1,start=5}={}){
 integer(carry,0,1);integer(start,2,9);
 const events=[{id:'a',node:'A',counter:start+1,time:1},{id:'b',node:'B',counter:2,time:2},{id:'c',node:'B',counter:carry?Math.max(2,start+1)+1:3,time:4},{id:'d',node:'A',counter:start+2,time:5}];
 const totalOrder=[...events].sort((a,b)=>a.counter-b.counter||a.node.localeCompare(b.node));
 return {events,causalEdge:['a','c'],causalOrder:totalOrder.findIndex(e=>e.id==='a')<totalOrder.findIndex(e=>e.id==='c'),totalOrder,concurrent:['c','d']};
}
export function atomicCommitModel({vote=1,crash=1,recover=0}={}){
 integer(vote,0,1);integer(crash,0,2);integer(recover,0,1);
 let participants=['working','working'],coordinator='working',log=null;
 const states=[],push=(label,message=null)=>states.push({label,participants:[...participants],coordinator,log,message});
 push('Both participants hold uncommitted work');coordinator='preparing';push('Send prepare requests');
 participants=['prepared',vote?'prepared':'aborted'];push(vote?'Both promise they can commit':'B votes no; A has already promised',{from:'C',to:'both',label:'prepare'});
 push('Coordinator receives the votes',{from:'both',to:'C',label:vote?'yes':'A yes · B no'});
 const decision=vote?'committed':'aborted';
 if(crash===1){coordinator='crashed';push('Coordinator fails before logging a decision');if(!recover)return {states,decision:null,blocked:true};coordinator='recovering';push('Recovery finds no commit record: choose abort');}
 log=crash===1?'aborted':decision;coordinator=log;push('Durable coordinator decision: '+log);
 participants[0]=log;push('A receives the decision',{from:'C',to:'A',label:log});
 if(crash===2){coordinator='crashed';push('Coordinator fails before B receives the decision');if(!recover)return {states,decision:log,blocked:participants.includes('prepared')};coordinator='recovering';push('Recovery reads the durable decision: '+log);}
 participants[1]=log;coordinator=log;push('Both participants finish with the same outcome',{from:'C',to:'B',label:log});
 return {states,decision:log,blocked:false};
}
export function epochQuorumModel({split=2}={}){
 integer(split,0,5);const nodes=Array.from({length:5},(_,i)=>({id:i,promised:i<split?1:2})),oldVotes=nodes.filter(n=>n.promised===1).map(n=>n.id),newVotes=nodes.filter(n=>n.promised===2).map(n=>n.id);
 return {nodes,oldVotes,newVotes,oldCanDecide:oldVotes.length>=3,newCanDecide:newVotes.length>=3,quorum:3};
}
