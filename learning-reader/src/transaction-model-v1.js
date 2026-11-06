const choice=(v,max)=>{if(!Number.isInteger(v)||v<0||v>max)throw Error('Invalid transaction input');};
export function atomicTransferModel({atomic=1,fail=1}={}){
 choice(atomic,1);choice(fail,1);let balances=[500,500];const states=[{label:'Begin with two accounts',balances:[...balances],status:'pending'}];balances[0]-=100;states.push({label:'Debit account A',balances:[...balances],status:atomic?'uncommitted':'partly applied'});
 if(fail){if(atomic)balances=[500,500];states.push({label:atomic?'Abort: undo the debit':'Failure leaves a partial transfer',balances:[...balances],status:atomic?'aborted':'failed'});}else{balances[1]+=100;states.push({label:'Credit B and commit',balances:[...balances],status:'committed'});}
 return {states,final:balances,total:balances.reduce((a,b)=>a+b,0)};
}
export function snapshotReadModel({snapshot=1}={}){
 choice(snapshot,1);const before=[500,500],after=[600,400],observed=[before[0],snapshot?before[1]:after[1]];
 return {before,after,observed,total:observed[0]+observed[1],states:[{label:'Read A before the transfer commits',observed:[500,null]},{label:'Writer commits both account changes',observed:[500,null]},{label:snapshot?'Read B from the original snapshot':'Read B from the latest committed version',observed}]};
}
export function counterUpdateModel({mode=0,retry=1}={}){
 choice(mode,2);choice(retry,1);let value=42;const events=[],push=(actor,label,kind,expected=null)=>events.push({actor,label,value,kind,expected});
 if(mode===1){value++;push('A','increment current value','increment');value++;push('B','increment current value','increment');return {events,value,rejected:false,lost:false,completed:2};}
 push('A','read 42','read');push('B','read 42','read');value=43;push('A','write 43',mode===2?'compare':'write',mode===2?42:null);let rejected=false;
 if(mode===0){value=43;push('B','write 43 from stale read','write');}else{rejected=true;push('B','compare 42 with 43 → reject','reject',42);if(retry){push('B','retry reads 43','read');value++;push('B','compare 43 → write 44','compare',43);}}
 return {events,value,rejected,lost:mode===0,completed:mode===2&&!retry?1:2};
}
export function writeSkewModel({mode=0}={}){
 choice(mode,2);const states=[{label:'Both doctors are on duty',on:[true,true],reads:[null,null]}];let on=[true,true],reads=[2,null];states.push({label:'A sees two doctors and may leave',on:[...on],reads:[...reads]});
 if(mode!==1){reads[1]=2;states.push({label:'B also sees two in its snapshot',on:[...on],reads:[...reads]});}
 on[0]=false;states.push({label:'A commits: A leaves duty',on:[...on],reads:[...reads]});
 if(mode===1){reads[1]=1;states.push({label:'B now sees one doctor and stays',on:[...on],reads:[...reads]});}else if(mode===2)states.push({label:'Serialization conflict: abort B',on:[...on],reads:[...reads]});else{on[1]=false;states.push({label:'B commits a different row: B leaves',on:[...on],reads:[...reads]});}
 return {states,on,invariant:on.some(Boolean),cycle:mode!==1,aborted:mode===2};
}
