// Original, deterministic teaching models. Saved codecs and packages stay unchanged.
export const TEACHING_VERSION = 1;
const integer=(value,min,max)=>Number.isInteger(value)&&value>=min&&value<=max;
const finite=(value,min,max)=>Number.isFinite(value)&&value>=min&&value<=max;
export function replicationTiming(input={}) {
 const s={time:100,lagA:60,lagB:150,sync:0,failure:0,crash:70,promoted:0,...input};
 if(!integer(s.time,0,240)||!integer(s.lagA,20,160)||!integer(s.lagB,20,160)||![s.sync,s.failure,s.promoted].every(v=>v===0||v===1)||!integer(s.crash,30,220))throw Error('Invalid replication timing input.');
 const cutoff=s.failure?s.crash:Infinity,arrivalA=20+s.lagA,arrivalB=20+s.lagB;
 // The fixture drops every message that has not arrived when the leader fails.
 // Equal-time arrivals are dropped too. No election protocol is implied.
 const delivered=at=>at<cutoff&&s.time>=at;
 const ackAt=s.sync?arrivalA+40:40;
 const versions=[delivered(20)?2:1,delivered(arrivalA)?2:1,delivered(arrivalB)?2:1];
 const readAt=s.crash+20,readVersion=s.failure&&s.time>=readAt?versions[s.promoted+1]:null;
 const acknowledged=delivered(ackAt),lostAcknowledged=acknowledged&&readVersion===1;
 const messages=[{from:0,to:1,start:0,end:20,label:'write v2'},
  {from:1,to:2,start:20,end:arrivalA,label:'replicate v2'},
  {from:1,to:3,start:20,end:arrivalB,label:'replicate v2'},
  ...(s.sync?[{from:2,to:1,start:arrivalA,end:arrivalA+20,label:'A confirms'}]:[]),
  {from:1,to:0,start:ackAt-20,end:ackAt,label:'success reply'}];
 return {...s,arrivalA,arrivalB,ackAt,versions,readAt,readVersion,acknowledged,lostAcknowledged,messages,
  result:lostAcknowledged?'The client received success, but the promoted follower returns v1.':readVersion===2?'The promoted follower has v2 in this failure trace.':readVersion===1?'The promoted follower returns v1. The client has no success reply.':acknowledged?'The client has received success. Check which followers have v2.':'The client is still waiting for success.'};
}
const members=mask=>Array.from({length:5},(_,i)=>i).filter(i=>mask&(1<<i));
export function quorumSpace(w,r,selection=0) {
 if(!integer(w,1,5)||!integer(r,1,5))throw Error('Use W and R from 1 to 5.');
 const written=Array.from({length:w},(_,i)=>i);
 const sets=Array.from({length:31},(_,i)=>members(i+1)).filter(s=>s.length===r).map(read=>({read,overlap:read.filter(i=>written.includes(i))}));
 if(!integer(selection,0,sets.length-1))throw Error('Select an existing read set.');
 return {written,sets,selected:sets[selection],misses:sets.filter(s=>!s.overlap.length).length,guaranteed:w+r>5,minOverlap:Math.max(0,w+r-5),w,r,selection};
}
export function vectorSpace(input={}) {
 const s={a0:1,a1:0,b0:0,b1:1,...input};
 if(!['a0','a1','b0','b1'].every(k=>integer(s[k],0,4)))throw Error('Use vector components from 0 to 4.');
 const a=[s.a0,s.a1],b=[s.b0,s.b1],aBefore=a.every((v,i)=>v<=b[i]),bBefore=b.every((v,i)=>v<=a[i]);
 return {...s,a,b,joined:a.map((v,i)=>Math.max(v,b[i])),relation:aBefore&&bBefore?'equal':aBefore?'A before B':bBefore?'B before A':'concurrent'};
}
export function surfaceProjection(input={}) {
 const s={a:1,b:30,q:1,...input};
 if(!finite(s.a,.2,2)||!finite(s.b,0,360)||!finite(s.q,.25,2))throw Error('Invalid uniform surface patch.');
 const angle=s.b*Math.PI/180,normal=[Math.cos(angle),Math.sin(angle),0],tangent=[-normal[1],normal[0],0],field=[s.q,s.q/2,0];
 const component=field[0]*normal[0]+field[1]*normal[1],flux=component*s.a;
 return {...s,normal,tangent,field,component,flux,fieldMagnitude:Math.hypot(...field),projectedArea:s.a*component/Math.hypot(...field)};
}
export function lineCylinder(input={}) {
 const s={r:1.5,lambda:1.5,length:1,...input};
 if(!finite(s.r,.6,3.3)||!finite(s.lambda,.5,3)||!finite(s.length,.5,3))throw Error('Invalid positive infinite line-charge cylinder.');
 // Normalized units: epsilon_0 = 1. Lambda, radius and length are illustrative.
 const area=2*Math.PI*s.r*s.length,enclosed=s.lambda*s.length,field=s.lambda/(2*Math.PI*s.r);
 return {...s,area,enclosed,field,sideFlux:field*area,endFlux:0};
}
