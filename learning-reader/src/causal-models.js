import {primitivesSVG} from './scene-primitives.js';
import {causalFrames,happensBefore,vectorRelation} from './causal-trace.js';
export const causalNames=Object.freeze(['causal-scalar-clock','causal-vector-clock']);
export const causalStepCount=causalFrames.frames.length;
const pairs=[['C2','B2'],['A1','A2'],['A2','C3']],v=values=>'['+values.join(',')+']';
export function causalState(s){
 const progress=s.progress??0,b=s.b??0;if(!Number.isFinite(progress)||progress<0||progress>=causalStepCount||!Number.isInteger(b)||b<0||b>2)throw Error('Invalid causal scene state.');
 const frame=causalFrames.frames[Math.floor(progress)],pair=pairs[b],events=pair.map(id=>frame.events.find(e=>e.id===id));
 return {frame,pair,events,relation:events.every(Boolean)?happensBefore(frame,...pair)?'before':happensBefore(frame,...[...pair].reverse())?'after':'concurrent':null};
}
export function drawCausal(scene,s){
 if(!causalNames.includes(scene))throw Error('Unsupported causal model.');const vector=scene==='causal-vector-clock',m=causalState(s),{frame,pair,events,relation}=m,y=p=>90+causalFrames.processes.indexOf(p)*74,x=e=>82+causalFrames.events.findIndex(i=>i.id===e.id)*38;
 let body=`<text x="300" y="30" text-anchor="middle" class="label">${vector?'VECTOR CLOCKS · CAUSAL HISTORY':'SCALAR CLOCKS · CAUSAL ORDER'}</text>`;
 for(const p of causalFrames.processes)body+=`<text x="35" y="${y(p)+4}" class="label">${p}</text><path d="M65 ${y(p)}H379" class="dimension"/><text x="457" y="${y(p)-10}" text-anchor="middle" class="label">${p} current ${vector?v(frame.vectors[p]):frame.lamport[p]}</text>`;
 for(const [from,to] of frame.edges){const a=frame.events.find(e=>e.id===from),b=frame.events.find(e=>e.id===to);if(a.process!==b.process)body+=primitivesSVG([{type:'arrow',from:[x(a),y(a.process)],to:[x(b),y(b.process)]}])+`<text x="${(x(a)+x(b))/2+16}" y="${(y(a.process)+y(b.process))/2}" class="label">${a.message}</text>`;}
 for(const e of causalFrames.events){const current=frame.events.find(i=>i.id===e.id),highlight=frame.operation?.eventId===e.id;if(current&&pair.includes(e.id))body+=`<circle cx="${x(e)}" cy="${y(e.process)}" r="10" fill="none" stroke="#6a879e" stroke-width="1.2"/>`;body+=`<circle cx="${x(e)}" cy="${y(e.process)}" r="${highlight?7:4}" fill="${current?'#24272b':'#fff'}" stroke="#adb9c1"/><text x="${x(e)}" y="${y(e.process)-16}" text-anchor="middle" class="label">${e.id}</text><text x="${x(e)}" y="${y(e.process)+20}" text-anchor="middle" class="label">${current?vector?v(current.vector):current.lamport:'·'}</text>`;}
 const op=frame.operation,rule=!op?'Initial clocks are zero':op.type==='receive'?vector?'Receive: componentwise max, then own +1':'Receive: max(local, message) + 1':vector?'Local / send: increment own component':'Local / send: increment local clock';
 body+=`<text x="300" y="283" text-anchor="middle" class="label">Step ${frame.step} / 8${op?' · '+op.eventId+' '+op.type:''}</text><text x="300" y="306" text-anchor="middle" class="label">${rule}</text><text x="300" y="328" text-anchor="middle" class="label">${op?vector?v(op.before.vector)+(op.incoming?' · incoming '+v(op.incoming.vector):'')+' → '+v(op.after.vector):op.before.lamport+(op.incoming?' · incoming '+op.incoming.lamport:'')+' → '+op.after.lamport:'Advance one event to inspect the clock update.'}</text>`;
 const verdict=relation===null?'Comparison waits for both events':relation==='concurrent'?'Concurrent: neither event reaches the other':relation==='before'?pair[0]+' happens before '+pair[1]:pair[1]+' happens before '+pair[0];
 body+=`<text x="300" y="355" text-anchor="middle" class="label">Compare ${pair.join(' and ')} · ${verdict}</text><text x="300" y="378" text-anchor="middle" class="label">${events.every(Boolean)?vector?'Vectors '+v(events[0].vector)+' and '+v(events[1].vector)+' · '+vectorRelation(events[0].vector,events[1].vector):'Clock values '+events[0].lamport+' and '+events[1].lamport+' · numerical order alone is insufficient':'Solid dots: recorded events · hollow dots: future events'}</text>`;
 return {body,label:vector?'Recorded local, send, and receive events with vector-clock updates and causal comparisons':'Recorded causal events with Lamport-clock updates and a concurrent-event counterexample',metrics:[{label:'Recorded step',value:frame.step+' / 8'},{label:'Selected pair',value:pair.join(' / ')},{label:'Causal relation',value:relation??'Both events must occur'},{label:'Clock guarantee',value:vector?'Vector order matches reachability':'Causality implies increasing clocks'}]};
}
export function causalChecks(){
 let pairs=0;for(const frame of causalFrames.frames)for(const a of frame.events)for(const b of frame.events){const hb=happensBefore(frame,a.id,b.id),rel=vectorRelation(a.vector,b.vector);if(hb!==(rel==='before')||hb&&a.lamport>=b.lamport)throw Error('Clock causality invariant failed.');pairs++;}
 const f=causalFrames.frames.at(-1),a=f.events.find(e=>e.id==='C2'),b=f.events.find(e=>e.id==='B2');if(a.lamport>=b.lamport||happensBefore(f,a.id,b.id)||happensBefore(f,b.id,a.id))throw Error('Scalar clock counterexample failed.');
 return {passed:true,method:'Every recorded prefix and event pair: vector ordering equals DAG reachability; Lamport order is necessary; concurrent scalar counterexample',frames:causalStepCount,pairs};
}
