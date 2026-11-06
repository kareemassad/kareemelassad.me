import {continuousSvgDemo,svgText as text,smooth} from './continuous-svg-demo.js';
import {reliabilityModel,fanoutModel,feedWorkModel,changeSurfaceModel} from './system-tradeoffs-model-v1.js';
const box=(x,y,w,label,active=true)=>`<rect x="${x}" y="${y}" width="${w}" height="64" rx="8" fill="${active?'#e1ecdb':'#f1ded8'}" stroke="#a4b196"/>`+text(x+w/2,y+36,label,'small','middle');
const line=(x,y,a,b)=>`<path d="M${x} ${y} L${a} ${b}" stroke="#acb8a2" fill="none"/>`;
const select=(key,label,labels)=>({key,label,type:'select',options:labels.map((label,i)=>({value:String(i),label}))});
const range=(key,label,min,max)=>({key,label,type:'range',min,max,step:1});
export function tradeoffFrame(kind,p,t){let svg='',result='';
 if(kind==='reliability'){
  const m=reliabilityModel({copies:+p.copies,faults:+p.faults,common:+p.common}),injected=t>1.3;
  svg=text(20,30,'A fault need not stop the service','scene-title')+box(275,65,190,'One client request');
  for(let i=0;i<m.copies;i++){const x=35+i*175,alive=!injected||i>=m.failed;svg+=line(370,129,x+70,220)+box(x,220,140,alive?'Copy '+i+' · ready':'Copy '+i+' · fault',alive);if(alive){const a=smooth((t%4)/2);svg+=`<circle cx="${370+(x+70-370)*a}" cy="${129+91*a}" r="6" fill="#4b7e63"/>`;}}
  svg+=text(20,380,!injected?'Before the fault':m.serving?'Service continues on a surviving copy':'No copy can serve the request','equation');
  result=+p.faults===0?'No fault is selected. Increase Faults to compare independent failures with a common cause.':m.common?'The same bad input affects every copy in this example. More identical copies do not remove that common cause.':'Lose selected copies. The service can continue while one copy remains available. This assumes current data and working routing.';
 }else if(kind==='fanout'){
  const m=fanoutModel({calls:+p.calls,slowPercent:+p.slowPercent});svg=text(20,30,'The page waits for its slowest dependency','scene-title')+box(270,65,200,'One page request');
  for(let i=0;i<m.calls;i++){const x=30+i%10*70,y=195+Math.floor(i/10)*80,slow=m.slowPercent===100||(m.slowPercent>0&&i===m.calls-1);svg+=line(370,129,x+27,y)+`<rect x="${x}" y="${y}" width="54" height="42" rx="5" fill="${slow?'#d4ab77':'#dbe9d7'}" stroke="#a4b196"/>`+text(x+27,y+26,i+1,'small','middle');const a=smooth(t/(slow?4:1.5));svg+=`<circle cx="${x+27+(370-x-27)*a}" cy="${y+(129-y)*a}" r="4" fill="#4b7e63"/>`;}
  svg+=text(20,363,`P(at least one slow call) = ${(100*m.slowProbability).toFixed(1)}%`,'equation')+text(20,398,`${m.calls} independent calls · ${m.slowPercent}% slow probability per call`);
  result=(m.slowPercent===0?'At zero probability, this model has no slow response. ':'The amber branch illustrates one slow response. ')+' The probability is calculated, not sampled from this animation. More calls increase exposure to a slow tail; correlated delays require a different model.';
 }else if(kind==='feed'){
  const m=feedWorkModel({followers:+p.followers,reads:+p.reads,push:+p.push});svg=text(20,30,'Move work between posting and reading','scene-title')+box(270,65,200,'One new post');
  for(let i=0;i<m.followers;i++){const x=30+i%6*118,y=200+Math.floor(i/6)*90;svg+=box(x,y,103,'Reader '+i)+line(370,129,x+51,y);const a=smooth(t/3),from=m.push?[370,129]:[x+51,y],to=m.push?[x+51,y]:[370,129];if(m.push||+p.reads>0)svg+=`<circle cx="${from[0]+(to[0]-from[0])*a}" cy="${from[1]+(to[1]-from[1])*a}" r="5" fill="#4b7e63"/>`;}
  svg+=text(20,398,`${m.postWrites} post writes · ${m.timelineAssemblies} timeline assemblies`,'equation');
  result=m.push?`Copy the post into ${m.followers} timeline caches. ${m.cacheReads} later reads use those caches. A large follower count makes the post expensive.`:'Each moving request represents one reader; it does not count every read. Store the post once. Each later timeline read must assemble relevant posts. The model counts assemblies, not the records or CPU work inside them.';
 }else{
  const m=changeSurfaceModel({boundary:+p.boundary,contract:+p.contract});svg=text(20,30,'How far does an implementation change spread?','scene-title');
  for(let i=0;i<5;i++){const x=25+i*142;svg+=box(x,95,125,'Client '+i,!(t>=3&&m.affectedClients.includes(i)))+line(x+62,159,370,245);}
  svg+=box(230,245,280,m.boundary?'Stable interface':'Clients know storage details',!m.contract)+box(270,325,200,'Storage implementation');
  if(t>=.5&&t<1.5){const a=smooth((t-.5));svg+=`<circle cx="370" cy="${325-16*a}" r="7" fill="#aa7e4a"/>`;}
  if(t>=1.5&&t<3&&m.affectedClients.length){const a=smooth((t-1.5)/1.5);for(const i of m.affectedClients){const x=87+i*142;svg+=`<circle cx="${370+(x-370)*a}" cy="${245-86*a}" r="7" fill="#aa7e4a"/>`;}}
  if(t>=1.5&&!m.affectedClients.length)svg+=`<circle cx="370" cy="309" r="10" fill="none" stroke="#527e67" stroke-width="3"/>`;
  svg+=text(20,420,t<1.5?'Change the storage implementation':t<3?'Check which dependencies expose the change':`${m.affectedClients.length} client changes in this dependency model`,'equation');
  result=m.boundary&&!m.contract?'A storage change stays behind an unchanged interface. Change the contract to see that the boundary cannot hide every change.':'Clients depend on the details being changed. This synthetic dependency graph illustrates change propagation; it does not measure maintainability or engineering effort.';
 }return {svg,result};
}
export const tradeoffDemos=[
 ['reliability','Faults and service failures',{copies:3,faults:1,common:'0'},[range('copies','Copies',1,4),range('faults','Faults',0,4),select('common','Fault type',['Selected copies fail','Common software fault'])],'Identical current copies and ideal routing. No recovery, quorum, durability, election, or failure probability model.'],
 ['feed','The workload behind a timeline',{followers:6,reads:3,push:'1'},[range('followers','Followers',1,12),range('reads','Reads per follower',0,8),select('push','Prepare timeline',['On read','On write'])],'One synthetic post. Count logical writes and timeline assemblies separately; their costs are not equal. No cache invalidation or hybrid celebrity policy.'],
 ['fanout','Why tails spread',{calls:8,slowPercent:5},[range('calls','Parallel calls',1,20),range('slowPercent','Slow calls · %',0,30)],'Independent identical slow-call probabilities. Page completion waits for all calls. The drawing illustrates a slow branch; the displayed probability is analytic.'],
 ['change','Boundaries and change',{boundary:'1',contract:'0'},[select('boundary','Dependency',['Storage details exposed','Stable interface']),select('contract','Change',['Implementation only','Interface contract too'])],'Five synthetic clients and one storage boundary. A dependency illustration, not a numeric quality score or a universal architectural rule.']
].map(([kind,title,params,controls,limits])=>continuousSvgDemo({id:'ddia-tradeoff-'+kind,title,params,controls,limits,draw:(p,t)=>tradeoffFrame(kind,p,t)}));
