// Version 1: bounded, deterministic Chapter 6 experiments. Synthetic records.
export const partitioningCodecV1=Object.freeze({version:1,scene:'partitioning-lab-v1',kinds:['placement','indexes','rebalance','split','routing']});
const defaults={placement:{method:0,workload:0,salts:1,query:0},indexes:{global:0,lag:0},rebalance:{fixed:0},split:{count:8,threshold:12},routing:{route:0,moved:0,fresh:1}};
export function partitionDefaults(kind){if(!Object.hasOwn(defaults,kind))throw Error('Unknown partition experiment');return {...defaults[kind]};}
const bounds={method:[0,1],workload:[0,2],salts:[1,4],query:[0,1],global:[0,1],lag:[0,1],fixed:[0,1],count:[4,24],threshold:[8,20],route:[0,2],moved:[0,1],fresh:[0,1]};
export function partitionInputs(kind,input={}){const state=partitionDefaults(kind);for(const key of Object.keys(input)){if(!Object.hasOwn(state,key))throw Error('Unsupported partition input: '+key);const value=input[key],[min,max]=bounds[key];if(!Number.isInteger(value)||value<min||value>max)throw Error('Invalid partition input: '+key);state[key]=value;}return state;}
export function keyHash(key){let h=2166136261;for(const c of String(key)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return h>>>0;}
export function placementModel(input={}){
 const s=partitionInputs('placement',input),records=Array.from({length:24},(_,i)=>{const key=s.workload===2?23:s.workload===1?18+i%6:i,salt=s.workload===2?i%s.salts:0;const hash=keyHash(s.salts>1&&s.workload===2?`${key}:${salt}`:key);return {id:i,key,salt,partition:s.method?Math.floor(hash/2**30):Math.floor(key/6)};});
 const counts=Array.from({length:4},(_,p)=>records.filter(r=>r.partition===p).length);
 const matching=records.filter(r=>r.key>=8&&r.key<=11),contacted=s.method?[0,1,2,3]:[1];
 return {state:s,records,counts,matching,contacted,max:Math.max(...counts),readKeys:s.workload===2?s.salts:1};
}
export function indexModel(input={}){
 const s=partitionInputs('indexes',input),records=Array.from({length:12},(_,i)=>({id:i,partition:i%3,red:[1,3,7,9].includes(i)}));
 // A new red record is already stored on partition 2. Its global posting can lag.
 records.push({id:14,partition:2,red:true,new:true});
 const actual=records.filter(r=>r.red),visible=s.global&&s.lag?actual.filter(r=>!r.new):actual;
 return {state:s,records,actual,visible,targets:s.global?[0]:[0,1,2],missing:actual.length-visible.length};
}
export function rebalanceModel(input={}){
 const s=partitionInputs('rebalance',input),records=Array.from({length:24},(_,i)=>{const partition=i%12,old=partition%3;const next=s.fixed?(partition>=9?3:old):i%4;return {id:i,partition,old,next,moved:old!==next};});
 return {state:s,records,moved:records.filter(r=>r.moved).length,loads:Array.from({length:4},(_,n)=>records.filter(r=>r.next===n).length)};
}
export function splitModel(input={}){
 const s=partitionInputs('split',input),split=s.count>s.threshold,cut=Math.ceil(s.count/2);
 return {state:s,split,cut,records:Array.from({length:s.count},(_,i)=>({id:i,old:0,next:split&&i>=cut?1:0})),loads:split?[cut,s.count-cut]:[s.count,0]};
}
export function routingModel(input={}){
 const s=partitionInputs('routing',input),owner=s.moved?2:1,known=s.fresh?owner:1;
 const path=s.route===0?['client','n0',`n${owner}`]:s.route===1?['client','router',`n${known}`]:['client',`n${known}`];
 // The forwarding node has current ownership in this bounded scenario.
 return {state:s,owner,known,path,correct:s.route===0||known===owner,hops:path.length-1};
}
export const partitionModel=(kind,state)=>({placement:placementModel,indexes:indexModel,rebalance:rebalanceModel,split:splitModel,routing:routingModel}[kind]?.(state)??(()=>{throw Error('Unknown partition experiment');})());
