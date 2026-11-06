const integer=(v,min,max)=>{if(!Number.isInteger(v)||v<min||v>max)throw Error('Invalid batch input');};
export function shuffleModel({reducers=3,combine=0}={}){
 integer(reducers,1,3);integer(combine,0,1);
 const records=['A','B','A','C','A','B','C','A','B','A','C','A'].map((key,id)=>({id,key,value:1,mapper:Math.floor(id/4),reducer:(key.charCodeAt(0)-65)%reducers}));
 const sent=combine?[...Map.groupBy(records,r=>r.mapper+':'+r.key)].map(([,rs])=>({...rs[0],value:rs.length,ids:rs.map(r=>r.id)})):records.map(r=>({...r,ids:[r.id]}));
 const groups=[...Map.groupBy(sent,r=>r.key)].sort(([a],[b])=>a.localeCompare(b)).map(([key,items])=>({key,reducer:items[0].reducer,items,total:items.reduce((n,r)=>n+r.value,0)}));
 return {records,sent,groups,counts:Object.fromEntries(groups.map(g=>[g.key,g.total])),loads:Array.from({length:reducers},(_,i)=>sent.filter(r=>r.reducer===i).length)};
}
export function batchJoinModel({strategy=0,hot=8}={}){
 integer(strategy,0,2);integer(hot,4,12);const workers=3,profiles=[{key:'A',region:'East'},{key:'B',region:'West'},{key:'C',region:'North'}];
 const events=Array.from({length:hot+4},(_,id)=>({id,key:id<hot?'A':id<hot+2?'B':'C',worker:strategy===1?id%workers:strategy===2&&id<hot?id%workers:(id<hot?0:id<hot+2?1:2)}));
 const profileCopies=profiles.flatMap(p=>(strategy===1||strategy===2&&p.key==='A'?[0,1,2]:[p.key.charCodeAt(0)-65]).map(worker=>({...p,worker})));
 const output=events.map(e=>({...e,region:profileCopies.find(p=>p.key===e.key&&p.worker===e.worker).region}));
 const loads=Array.from({length:workers},(_,worker)=>events.filter(e=>e.worker===worker).length);
 return {events,profiles,profileCopies,output,loads,duration:Math.max(...loads),workers};
}
export function batchRecoveryModel({checkpoint=0,failure=1}={}){
 integer(checkpoint,0,1);integer(failure,0,1);const inputs=[[1,2,3,4],[5,6,7,8]],mapped=inputs.map(rows=>rows.map(n=>n*2)),filtered=mapped.map(rows=>rows.filter(n=>n>6)),sum=filtered.flat().reduce((a,b)=>a+b,0);
 const steps=[{label:'Read immutable input partitions',active:['input0','input1']},{label:'Map each value: multiply by two',active:['map0','map1']},{label:'Filter: retain values greater than six',active:['filter0','filter1']}];
 if(checkpoint)steps.push({label:'Persist intermediate output to durable storage',active:['disk0','disk1']});
 if(failure){steps.push({label:'Worker 0 fails: its memory is lost',active:['lost']});if(checkpoint)steps.push({label:'Read partition 0 from its durable checkpoint',active:['disk0']});else steps.push({label:'Replay partition 0 from immutable input',active:['input0','map0','filter0']});}
 steps.push({label:'Aggregate the recovered output exactly once',active:['sum']});
 return {inputs,mapped,filtered,sum,steps,recomputed:failure&&!checkpoint?2:0,persistedRecords:checkpoint?filtered.flat().length:0};
}
