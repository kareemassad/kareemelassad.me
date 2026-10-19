// Original bounded trace engine. JSAV's licensed recorded-step interaction is
// the design reference. Its runtime and other projects' clock code are unused.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const name=value=>typeof value==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,23}$/.test(value);
export function validateTrace(spec){
 if(!spec||Object.keys(spec).some(k=>!['processes','events'].includes(k))||!Array.isArray(spec.processes)||spec.processes.length<2||spec.processes.length>4||spec.processes.some(p=>!name(p))||new Set(spec.processes).size!==spec.processes.length||!Array.isArray(spec.events)||!spec.events.length||spec.events.length>24)throw Error('Invalid bounded causal trace.');
 const ids=new Set(),sends=new Map(),received=new Set();
 for(const e of spec.events){
  if(!e||Object.keys(e).some(k=>!['id','process','type','message'].includes(k))||!name(e.id)||ids.has(e.id)||!spec.processes.includes(e.process)||!['local','send','receive'].includes(e.type))throw Error('Invalid causal event.');ids.add(e.id);
  if(e.type==='local'){if(e.message!==undefined)throw Error('Local events cannot name a message.');}
  else if(!name(e.message))throw Error('Invalid causal message.');
  else if(e.type==='send'){if(sends.has(e.message))throw Error('Message IDs must be unique.');sends.set(e.message,e.process);}
  else{if(!sends.has(e.message)||sends.get(e.message)===e.process||received.has(e.message))throw Error('Receive needs one prior send from another process.');received.add(e.message);}
 }return spec;
}
export function compileTrace(spec){
 validateTrace(spec);const processes=[...spec.processes],lamport=Object.fromEntries(processes.map(p=>[p,0])),vectors=Object.fromEntries(processes.map(p=>[p,processes.map(()=>0)])),messages=Object.create(null),last=Object.create(null),events=[],edges=[],frames=[];
 const frame=operation=>({step:events.length,operation,lamport:{...lamport},vectors:Object.fromEntries(processes.map(p=>[p,[...vectors[p]]])),messages:structuredClone(messages),events:structuredClone(events),edges:structuredClone(edges)});
 frames.push(frame(null));
 for(const input of spec.events){
  const e={...input},p=e.process,index=processes.indexOf(p),before={lamport:lamport[p],vector:[...vectors[p]]};let incoming=null;
  if(last[p])edges.push([last[p],e.id]);
  if(e.type==='receive'){
   incoming=messages[e.message];lamport[p]=Math.max(lamport[p],incoming.lamport);vectors[p]=vectors[p].map((v,i)=>Math.max(v,incoming.vector[i]));edges.push([incoming.eventId,e.id]);
  }
  lamport[p]++;vectors[p][index]++;
  if(e.type==='send')messages[e.message]={eventId:e.id,from:p,lamport:lamport[p],vector:[...vectors[p]]};
  const event={...e,lamport:lamport[p],vector:[...vectors[p]]};events.push(event);last[p]=e.id;
  frames.push(frame({eventId:e.id,process:p,type:e.type,before,incoming:incoming?structuredClone(incoming):null,after:{lamport:lamport[p],vector:[...vectors[p]]}}));
 }
 return freeze({processes,events,edges,frames});
}
export function happensBefore(trace,first,second){
 if(first===second)return false;if(!trace.events.some(e=>e.id===first)||!trace.events.some(e=>e.id===second))throw Error('Causal comparison needs visible event IDs.');
 const seen=new Set(),stack=[first];while(stack.length){const id=stack.pop();if(seen.has(id))continue;seen.add(id);for(const [from,to] of trace.edges)if(from===id){if(to===second)return true;stack.push(to);}}return false;
}
export function vectorRelation(a,b){
 if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length||a.length<2||a.some(n=>!Number.isSafeInteger(n)||n<0)||b.some(n=>!Number.isSafeInteger(n)||n<0))throw Error('Invalid vector comparison.');
 const less=a.every((n,i)=>n<=b[i])&&a.some((n,i)=>n<b[i]),greater=b.every((n,i)=>n<=a[i])&&b.some((n,i)=>n<a[i]);return less?'before':greater?'after':a.every((n,i)=>n===b[i])?'equal':'concurrent';
}
export const causalExample=freeze({processes:['A','B','C'],events:[{id:'A1',process:'A',type:'local'},{id:'A2',process:'A',type:'send',message:'mAB'},{id:'B1',process:'B',type:'local'},{id:'C1',process:'C',type:'local'},{id:'B2',process:'B',type:'receive',message:'mAB'},{id:'B3',process:'B',type:'send',message:'mBC'},{id:'C2',process:'C',type:'local'},{id:'C3',process:'C',type:'receive',message:'mBC'}]});
export const causalFrames=compileTrace(causalExample);
