import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {referenceModel,queryPlanModel,reachabilityModel,regionNodes} from './data-shape-model-v1.js';
const box=(x,y,w,h,label,active=false)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${active?'#e0ecdc':'#fffdf7'}" stroke="#a7b39d"/>`+text(x+12,y+25,label);
const path=(a,b,active=false)=>`<path d="M${a} L${b}" fill="none" stroke="${active?'#47755c':'#c8cbbd'}" stroke-width="${active?3:1}"/>`;
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});
export function dataShapeFrame(kind,p,t){let svg='',result='';
 if(kind==='references'){
  const normalized=Number(p.normalized),m=referenceModel({normalized,updated:Number(p.updated)}),progress=smooth(t/3);
  svg=text(20,30,'One fact: where does its name live?','scene-title')+box(260,60,220,55,normalized?'Organization #7 · New name':'Rename organization #7',true);
  for(let i=0;i<6;i++){const x=30+i%3*240,y=180+Math.floor(i/3)*105,end=[x+105,y];if(normalized){svg+=path([370,115],end);const point=[370+(end[0]-370)*progress,115+(end[1]-115)*progress];svg+=`<circle cx="${point[0]}" cy="${point[1]}" r="5" fill="#47755c"/>`;}
   svg+=box(x,y,210,80,'Profile '+i)+text(x+12,y+54,normalized?'org_id: 7 → New name':t<1?'Old name':m.names[i],'small');}
  svg+=text(20,407,`${m.storedNames} stored name(s) · ${m.writes} rename write(s)`,'equation');
  result=normalized?'All six references resolve to one name. Reading a profile must also resolve the ID; a join or cache can do that.':`${m.stale} copied names remain stale. Increase Updated copies, then replace copied names with references.`;
 }else if(kind==='query'){
  const m=queryPlanModel({indexed:Number(p.indexed)}),step=Math.min(m.visited.length,Math.floor(t/3*m.visited.length)),seen=m.visited.slice(0,step);
  svg=text(20,30,'One question, two valid execution plans','scene-title')+text(20,68,'Find records where color = red. Result order is unspecified.');
  if(Number(p.indexed))svg+=box(230,90,280,46,'Index: red → 1, 4, 8',true);
  for(const r of m.rows){const x=36+r.id%6*116,y=165+Math.floor(r.id/6)*85;svg+=box(x,y,100,65,'ID '+r.id,seen.includes(r.id));svg+=`<circle cx="${x+78}" cy="${y+25}" r="7" fill="${r.match?'#ac665d':'#7a8ca1'}"/>`;}
  svg+=text(20,370,'Returned IDs: '+seen.filter(id=>m.matches.includes(id)).join(', '),'equation')+text(20,410,`${step} records examined · ${m.indexLookups} index lookup(s)`);
  result='Both plans return IDs 1, 4, and 8. An index changes the work, not the requested set. Index construction and maintenance are outside this count.';
 }else{
  const m=reachabilityModel({linked:Number(p.linked)}),round=Math.min(5,Math.floor(t/.8)),levels=m.levels[round],positions=[[65,130],[210,130],[355,130],[500,210],[645,210],[210,325],[355,325]];
  svg=text(20,30,'Follow relationships of unequal depth','scene-title')+text(20,65,'Which people live within Continent? Trace the chain backward.');
  svg+='<defs><marker id="shape-edge-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#6c8064"/></marker></defs>';
  for(const [a,b]of m.edges){const start=positions[a],end=positions[b],dx=end[0]-start[0],dy=end[1]-start[1],len=Math.hypot(dx,dy),from=[start[0]+dx/len*36,start[1]+dy/len*36],to=[end[0]-dx/len*36,end[1]-dy/len*36];svg+=path(from,to,Number.isFinite(levels[a])).replace('/>',' marker-end="url(#shape-edge-arrow)"/>')+text((from[0]+to[0])/2,(from[1]+to[1])/2-10,a===0||a===5?'lives in':'within','tick','middle');}
  positions.forEach(([x,y],i)=>{svg+=`<circle cx="${x}" cy="${y}" r="35" fill="${Number.isFinite(levels[i])?'#dbead8':'#fffdf7'}" stroke="#9aaa91"/>`+text(x,y+5,regionNodes[i],'small','middle');});
  svg+=text(20,410,'People reached: '+[0,5].filter(i=>Number.isFinite(levels[i])).map(i=>regionNodes[i]).join(', '),'equation');
  result='Ari has four relationships to Continent; Bea has three when Island belongs to Country. Remove that relationship: Bea no longer matches. This is reachability, not a ranking or shortest-path benchmark.';
 }
 return {svg,result};
}
export const dataShapeDemos=[
 ['references','Copied facts and references',{normalized:'0',updated:2},[select('normalized','Store organization name',['In each profile','Once, behind an ID']),{key:'updated',label:'Updated copies',type:'range',min:0,max:6,step:1,visibleWhen:p=>+p.normalized===0}],'Six synthetic profiles reference one organization. The rename is one logical write in normalized mode; joins and caching are not timed.'],
 ['query','The query and its plan',{indexed:'0'},[select('indexed','Execution plan',['Scan every row','Use the color index'])],'Twelve synthetic rows and an already-built index. Counts are records examined and index lookups, not latency or total storage I/O.'],
 ['graph','Relationships across a graph',{linked:'1'},[select('linked','Island relationship',['Disconnected','Within Country'])],'Seven synthetic nodes and directed containment edges. The first edge from a person means lives-in. The remaining edges mean within. Repeated propagation finds transitive reachability.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-shape-'+kind,title,params,controls,limits,draw:(p,t)=>dataShapeFrame(kind,p,t)}));
