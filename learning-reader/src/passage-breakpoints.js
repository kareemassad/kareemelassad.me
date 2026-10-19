import {positionNumber} from './pack-schema.js';
export const breakpointKey=p=>p.page+':'+p.y;
// Duplicate revisions at one source location share one visible marker.
export function passageBreakpoints(passages,coverage=[]){
 const points=new Map();for(const p of passages)points.set(breakpointKey(p),{page:p.page,y:p.y,title:p.title,kind:'aid'});
 for(const {end} of coverage){const key=breakpointKey(end),at=positionNumber(end);if(!points.has(key)&&!coverage.some(c=>positionNumber(c.start)<=at&&at<positionNumber(c.end)))points.set(key,{page:end.page,y:end.y,title:'No prepared aid after this point',kind:'gap'});}
 return [...points.values()].sort((a,b)=>positionNumber(a)-positionNumber(b));
}
export function breakpointState(markers,passage,position){
 const active=passage?breakpointKey(passage):null,next=markers.find(m=>positionNumber(m)>positionNumber(position)+1e-7&&breakpointKey(m)!==active);
 return {active,next:next?breakpointKey(next):null};
}
