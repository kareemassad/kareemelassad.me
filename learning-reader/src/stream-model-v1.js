const integer=(v,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw Error('Invalid stream input');};
export function replayLogModel({start=0,earliest=0}={}){
 integer(start,0,8);integer(earliest,0,4);const records=Array.from({length:8},(_,offset)=>({offset,label:String.fromCharCode(65+offset),retained:offset>=earliest}));
 return {records,start,earliest,missing:start<earliest,readable:start<earliest?[]:records.filter(r=>r.offset>=start),fastStart:earliest};
}
export function eventProjectionModel({mode=1,compact=0}={}){
 integer(mode,0,1);integer(compact,0,1);const values=mode?[2,3,-1]:[2,5,4],events=values.map((value,id)=>({id,value,label:mode?(value>=0?'+':'')+value:'set '+value,retained:!compact||id===2}));let state=0;
 const states=events.map(e=>{if(e.retained)state=mode?state+e.value:e.value;return state;});
 return {events,states,value:state,expected:4,correct:state===4};
}
export function windowedEventsModel({clock=0,delay=18,policy=1}={}){
 integer(clock,0,1);integer(delay,8,22);integer(policy,0,1);
 const events=[1,4,7,11,13,16].map((time,id)=>({id,time,arrival:id===2?delay:time+1})).sort((a,b)=>a.arrival-b.arrival||a.id-b.id);const counts=[0,0,0],steps=[];
 for(const event of events){const basis=clock?event.arrival:event.time,window=Math.floor(basis/10),late=!clock&&event.arrival>=(window+1)*10+5,accepted=!late||policy===1;if(accepted)counts[window]++;steps.push({...event,window,late,accepted,counts:[...counts]});}
 return {events,steps,counts,dropped:steps.filter(e=>!e.accepted).length};
}
export function replayEffectModel({dedupe=1}={}){
 integer(dedupe,0,1);let value=0,lastApplied=0,ack=0;const states=[],push=(label,offset=null)=>states.push({label,offset,value,lastApplied,ack});const apply=(offset,amount)=>{const duplicate=dedupe&&offset<=lastApplied;if(!duplicate){value+=amount;lastApplied=offset;}push(duplicate?'Replay detected: leave output unchanged':'Apply +'+amount+' from offset '+offset,offset);};
 push('Start before the first message');apply(1,10);ack=1;push('Record consumer offset 1');apply(2,20);push('Crash after output, before recording offset 2');apply(2,20);ack=2;push('Record consumer offset 2');apply(3,30);ack=3;push('Record consumer offset 3');return {states,value,expected:60,correct:value===60};
}
