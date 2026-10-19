import {replicationTiming,quorumSpace,vectorSpace,surfaceProjection,lineCylinder} from './teaching-models-v1.js';
import {replicationDefaults} from './replication-lessons.js';
import {replicationControls,renderReplication} from './replication-view.js';
import {draw,controls as savedControls} from './scenes.js';
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=value=>Math.abs(value)<1e-9?'0':Number(value.toPrecision(3)).toString();
const names=indices=>indices.map(i=>'ABCDE'[i]).join(', ');
const line=(x1,y1,x2,y2,cls='guide')=>`<line class="teach-${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const text=(x,y,value,cls='')=>`<text x="${x}" y="${y}" class="${cls}">${esc(value)}</text>`;
const arrow=(from,to,cls='field')=>`<path d="M${from}L${to}" class="teach-${cls}" marker-end="url(#teach-arrow-${cls})"/>`;
const svg=(body,label)=>`<svg class="teaching-figure" viewBox="0 0 560 340" role="img" aria-label="${esc(label)}"><defs>${['field','normal','message'].map(cls=>`<marker id="teach-arrow-${cls}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8z" class="teach-fill-${cls}"/></marker>`).join('')}</defs>${body}</svg>`;
const stats=items=>`<dl class="teaching-stats">${items.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
export function teachingDefaults(binding) {
 const common={savedDiagram:0,prediction:null};
 if(binding.kind==='timing')return {...common,time:binding.id==='ddia-failover'?110:60,lagA:60,lagB:150,sync:0,failure:binding.id==='ddia-failover'?1:0,crash:70,promoted:0};
 if(binding.kind==='quorum')return {...common,w:2,r:3,selection:0};
 if(binding.kind==='vectors')return {...common,a0:1,a1:0,b0:0,b1:1};
 if(binding.kind==='surface')return {...common,a:1,b:30,q:1};
 return {...common,r:1.5,lambda:1.5,length:1};
}
function timingFigure(m) {
 const x=t=>110+t*1.7,ys=[45,115,185,255];let body='';
 if(m.failure)body+=`<rect x="${x(m.crash)}" y="15" width="${x(240)-x(m.crash)}" height="267" class="teach-failure-zone"/>`;
 ['Client','Leader','Follower A','Follower B'].forEach((name,i)=>{body+=text(8,ys[i]-9,name)+line(110,ys[i],518,ys[i]);body+=text(8,ys[i]+12,i===0?(m.acknowledged?'success':'waiting'):i===1&&m.failure&&m.time>=m.crash?'offline':'v'+m.versions[i-1],'teach-small');});
 for(const msg of m.messages){
  const dropped=m.failure&&msg.end>=m.crash;
  body+=`<path d="M${x(msg.start)} ${ys[msg.from]}L${x(msg.end)} ${ys[msg.to]}" class="teach-message ${dropped?'teach-dropped':m.time<msg.end?'teach-future':''}" marker-end="url(#teach-arrow-message)"/>`;
  if(!dropped&&m.time>=msg.start&&m.time<msg.end){const p=(m.time-msg.start)/(msg.end-msg.start);body+=`<circle class="teach-packet" r="5" cx="${x(m.time)}" cy="${ys[msg.from]+p*(ys[msg.to]-ys[msg.from])}"/>`;}
  if(m.time>=msg.end&&!dropped)body+=`<circle class="teach-arrived" r="4" cx="${x(msg.end)}" cy="${ys[msg.to]}"/>`;
 }
 if(m.failure)body+=line(x(m.crash),18,x(m.crash),281,'crash')+text(Math.min(447,x(m.crash)+5),305,'failure','teach-small');
 body+=line(x(m.time),15,x(m.time),282,'cursor');
 [0,60,120,180,240].forEach(t=>{body+=line(x(t),280,x(t),286)+text(x(t)-8,325,t+'','teach-small');});
 return svg(body,'One write on four time lanes. A vertical cursor shows the selected time; arrows show message delivery.');
}
function timing(binding,s) {
 const m=replicationTiming(s),reply=m.acknowledged?'success at '+m.ackAt+' ms':'waiting',follower=s.promoted===0?'A':'B';
 return {figure:timingFigure(m),readouts:[['Client reply',reply],['Follower A','v'+m.versions[1]],['Follower B','v'+m.versions[2]],...(m.failure?[['Promoted '+follower,m.readVersion===null?'not yet promoted':'returns v'+m.readVersion]]:[])],result:m.result,
  detail:'Time in ms is synthetic. A receives v2 at '+m.arrivalA+' ms; B at '+m.arrivalB+' ms. '+(m.failure?'Only deliveries before '+m.crash+' ms survive this trace.':'Solid endpoints mark completed deliveries; dashed arrows mark future deliveries.'),
  question:m.failure?'Does the promoted follower contain v2 at the selected time?':'Has the client received success at the selected time?',correct:m.failure?m.readVersion===null?null:m.readVersion===2:m.acknowledged,
  feedback:m.failure?'Promotion does not recreate a write that never reached the promoted follower.':'An asynchronous reply follows the leader. A synchronous reply also waits for A’s confirmation and the return trips.'};
}
function quorum(binding,s) {
 const m=quorumSpace(s.w,s.r,s.selection),read=m.selected.read;let body='';
 for(let i=0;i<5;i++){
  const x=61+i*110,w=m.written.includes(i),r=read.includes(i);
  body+=`<rect x="${x-32}" y="65" width="64" height="94" rx="6" class="teach-replica ${w?'teach-written':''}"/>`;
  [0,1,2].forEach(j=>{body+=`<rect x="${x-23}" y="${77+j*22}" width="46" height="15" rx="2" class="teach-slot"/>`;});
  body+=text(x-6,49,'ABCDE'[i])+text(x-12,186,w?'v2':'v1');
  if(r)body+=`<path d="M${x-36} 59h72v106h-72z" class="teach-read-outline"/>`;
  body+=text(x-25,213,r?'read':'','teach-small');
 }
 body+=text(25,267,'W + R = '+(s.w+s.r)+'     N = 5')+text(25,300,m.guaranteed?'Every response set must overlap.':'A disjoint response set exists.');
 return {figure:svg(body,'Five home replicas. Filled storage holds v2. Outlined replicas belong to the selected read set.'),readouts:[['Write set',names(m.written)],['Read set',names(read)],['Shared replicas',names(m.selected.overlap)||'none'],['Read returns',m.selected.overlap.length?'v2':'v1']],result:m.selected.overlap.length?'This read finds v2. Does every possible read find it?':'This is a counterexample: the completed write is missed.',
  detail:m.misses+' of '+m.sets.length+' possible read sets miss v2. Minimum possible overlap: '+m.minOverlap+'. Sets describe possibilities, not probabilities.',sets:m.sets,
  question:'Can any read set miss v2 with these W and R values?',correct:m.misses>0,feedback:m.guaranteed?'A read cannot fit entirely outside the write set: W + R > 5.':'There are at least R replicas outside the write set. They can all respond with v1.'};
}
function vectors(binding,s) {
 const m=vectorSpace(s),P=([a,b])=>[100+a*80,280-b*58];let body='';
 for(let i=0;i<=4;i++){body+=line(...P([i,0]),...P([i,4]))+line(...P([0,i]),...P([4,i]));body+=text(P([i,0])[0]-4,305,i)+text(72,P([0,i])[1]+5,i);}
 const [ax,ay]=P(m.a),[bx,by]=P(m.b),[jx,jy]=P(m.joined);
 body+=`<rect x="${ax}" y="48" width="${420-ax}" height="${ay-48}" class="teach-dominance"/>`;
 body+=line(ax,ay,jx,jy,'normal')+line(bx,by,jx,jy,'field');
 body+=`<circle cx="${ax}" cy="${ay}" r="9" class="teach-version-a"/><circle cx="${bx}" cy="${by}" r="6" class="teach-version-b"/>`;
 body+=text(Math.min(435,ax+13),Math.max(25,ay-12),'A ['+m.a+']')+text(Math.min(435,bx+13),by+24,'B ['+m.b+']');
 body+=text(100,23,'events at replica 2 ↑')+text(245,332,'events at replica 1 →');
 return {figure:svg(body,'Version vectors on an event-count lattice. The shaded upper-right region contains contexts that include A.'),readouts:[['Version A','['+m.a+']'],['Version B','['+m.b+']'],['Relation',m.relation],['Joined context','['+m.joined+']']],result:m.relation==='concurrent'?'Neither context includes the other. Keep both values until the application resolves them.':m.relation==='equal'?'The causal contexts are equal. This comparison alone does not inspect application values.':m.relation+'. The later context includes the earlier one.',detail:'Shading shows contexts that include A. The joined context uses the maximum on each axis. Joining contexts does not merge payloads.',question:'Are these contexts concurrent?',correct:m.relation==='concurrent',feedback:'Compare every component. One context precedes another only when every component is less than or equal, with at least one strict inequality.'};
}
function surface(binding,s) {
 const m=surfaceProjection(s),P=([x,y,z])=>[166+x*68-y*28,163-y*35-z*68],h=Math.sqrt(m.a)*.65;
 const corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([t,z])=>P([m.tangent[0]*h*t,m.tangent[1]*h*t,h*z]));let body='';
 for(const z of [-.8,0,.8]){const from=[-1.6,-.8,z],to=[1.6,.8,z];body+=arrow(P(from),P(to),'field');}
 body+=`<polygon points="${corners.map(p=>p.join(',')).join(' ')}" class="teach-patch"/>`;
 const O=P([0,0,0]),F=P(m.field),N=P(m.normal.map(v=>v*1.35)),C=P(m.normal.map(v=>v*m.component));
 body+=arrow(O,F,'field')+arrow(O,N,'normal')+line(...F,...C,'projection')+arrow(O,C,'message');
 body+=text(20,27,'One uniform field · one patch')+text(N[0]+7,N[1]-4,'n')+text(20,303,'Actual area A = '+fmt(m.a)+' m²');
 const gx=degrees=>338+degrees/360*192,gy=flux=>160-flux/5*105;
 body+=line(338,55,338,265)+line(338,160,530,160)+text(336,27,'Φ = (C · n)A');
 const points=Array.from({length:121},(_,i)=>{const angle=i*3*Math.PI/180;return [gx(i*3),gy(s.a*s.q*(Math.cos(angle)+.5*Math.sin(angle)))];});
 body+=`<polyline points="${points.map(p=>p.join(',')).join(' ')}" class="teach-curve"/><circle cx="${gx(s.b)}" cy="${gy(m.flux)}" r="6" class="teach-probe"/>`;
 body+=text(338,285,'0°')+text(422,285,'180°')+text(501,285,'360°')+text(338,310,'Normal angle θ');
 return {figure:svg(body,'An oriented surface patch and its unit normal in a uniform field. The curve shows signed flux versus normal angle.'),readouts:[['Actual area',fmt(m.a)+' m²'],['Normal component',fmt(m.component)+' W/m²'],['Signed heat rate',fmt(m.flux)+' W']],result:Math.abs(m.flux)<1e-8?'The field is tangent to the patch. No heat crosses it.':m.flux>0?'Positive flux crosses in the direction of the selected normal.':'Negative flux crosses opposite to the selected normal.',detail:'Green: field C. Blue: unit normal n. Dashed segment: projection. Arrow lengths use separate scales. The curve and patch use the same model.',question:'Is the signed flux positive at this angle?',correct:m.flux>1e-8,feedback:'The sign follows C · n. A positive area changes the magnitude, not the sign.'};
}
function cylinder(binding,s) {
 const m=lineCylinder(s),cx=270,cy=150,rx=m.r*28,ry=rx*.4,half=m.length*25;let body='';
 body+=`<path d="M${cx-rx} ${cy-half}v${half*2}a${rx} ${ry} 0 0 0 ${rx*2} 0v-${half*2}" class="teach-cylinder"/><ellipse cx="${cx}" cy="${cy-half}" rx="${rx}" ry="${ry}" class="teach-cylinder"/><ellipse cx="${cx}" cy="${cy+half}" rx="${rx}" ry="${ry}" class="teach-cylinder-end"/>`;
 body+=line(cx,28,cx,280,'charge');
 for(let y=40;y<=275;y+=23)body+=text(cx-5,y,'+','teach-charge-label');
 for(const sign of [-1,1]){const start=[cx+sign*rx,cy],tip=[cx+sign*(rx+m.field*180),cy];body+=arrow(start,tip,'field');}
 body+=line(cx,cy+half+32,cx+rx,cy+half+32,'normal')+text(cx+rx/2-15,cy+half+55,'r='+fmt(m.r));
 body+=text(25,25,'Coaxial Gaussian cylinder')+text(25,55,'E is radial')+text(25,85,'End flux = 0')+text(415,110,'L='+fmt(m.length))+text(20,330,'Normalized units: ε₀ = 1');
 return {figure:svg(body,'A positive infinite line charge through a coaxial cylinder. Radial field arrows leave the curved surface and are tangent to the ends.'),readouts:[['Curved area 2πrL',fmt(m.area)],['Radial field λ/(2πr)',fmt(m.field)],['Enclosed charge λL',fmt(m.enclosed)],['Side flux E × area',fmt(m.sideFlux)]],result:'E × 2πrL = λL. Radius cancels from the flux; length cancels from the field.',detail:'The line continues beyond the cylinder. The cylinder is an imaginary measurement surface, not a conductor. Increase L to include more charge without changing E at this radius.',question:'If only the cylinder length doubles, does E change?',correct:false,feedback:'Both side area and enclosed charge double. Their ratio, and therefore E, stays fixed.'};
}
const calculations={timing,quorum,vectors,surface,line:cylinder};
export function renderTeaching(container,binding,s,onApply) {
 const key=JSON.stringify([binding.pack,binding.version,binding.id,binding.page,!!s.savedDiagram]);
 const sameBinding=container.dataset.teachingBinding===key;
 const scroll=sameBinding?container.scrollTop:0;
 container.dataset.teachingBinding=key;
 container.dataset.teaching=binding.kind;
 if(s.savedDiagram){
  if(binding.scene==='replication-lab')renderReplication(container,binding.id.slice(5),{...replicationDefaults(binding.id.slice(5)),...s});
  else {const saved=draw(binding.scene,s);container.innerHTML=`<article class="teaching-saved"><div>${saved.svg}</div>${stats(saved.metrics.map(item=>[item.label,item.value]))}</article>`;}
  container.scrollTop=scroll;return;
 }
 const m=calculations[binding.kind](binding,s);
 const focused=container.contains(document.activeElement)?document.activeElement:null;
 const focusKey=focused?.dataset.readSet!==undefined?'readSet':focused?.dataset.predict!==undefined?'predict':null;
 const focusValue=focusKey?focused.dataset[focusKey]:null;
 const open=Object.fromEntries(['prediction','limits'].map(key=>[key,sameBinding&&container.querySelector('.teaching-'+key)?.open]));
 container.innerHTML=`<article class="teaching-lab"><p class="teaching-kicker">SAVED EXPERIMENT · VERSION 1</p><h2>${esc(binding.title)}</h2><p class="teaching-intro">${esc(binding.intro)}</p><div class="teaching-drawing">${m.figure}</div>${stats(m.readouts)}<p class="teaching-result" role="status">${esc(m.result)}</p><p class="teaching-detail">${esc(m.detail)}</p>${m.sets?`<div class="teaching-sets" aria-label="All possible read response sets">${m.sets.map((set,i)=>`<button type="button" data-read-set="${i}" aria-pressed="${i===s.selection}" aria-label="Read ${names(set.read)}; ${set.overlap.length?'finds v2':'misses v2'}" class="${set.overlap.length?'':'teach-miss'}">${set.read.map(j=>'ABCDE'[j]).join('')} <span>${set.overlap.length?'v2':'v1'}</span></button>`).join('')}</div>`:''}<details class="teaching-prediction"><summary>Check your reasoning</summary><p>${esc(m.question)}</p><div><button type="button" data-predict="yes" aria-pressed="${s.prediction==='yes'}">Yes</button><button type="button" data-predict="no" aria-pressed="${s.prediction==='no'}">No</button></div><p role="status">${s.prediction?m.correct===null?'Choose a time after promotion to evaluate the read.':((s.prediction==='yes')===m.correct?'Correct. ':'Try the model again. ')+esc(m.feedback):'Choose an answer, then test it with the controls.'}</p></details><details class="teaching-limits"><summary>Assumptions and source</summary><p>${esc(binding.limit)}</p><p>Bound to this PDF edition, saved package ${esc(binding.pack)} v${binding.version}, PDF page ${binding.page}. Other passages retain their saved diagrams.</p></details></article>`;
 for(const key of ['prediction','limits'])container.querySelector('.teaching-'+key).open=!!open[key];
 container.scrollTop=scroll;
 container.querySelectorAll('[data-read-set]').forEach(button=>button.addEventListener('click',()=>onApply({selection:Number(button.dataset.readSet),prediction:null})));
 container.querySelectorAll('[data-predict]').forEach(button=>button.addEventListener('click',()=>onApply({prediction:button.dataset.predict})));
 if(focusKey)for(const button of container.querySelectorAll('button'))if(button.dataset[focusKey]===focusValue)button.focus({preventScroll:true});
}
function range(container,s,apply,key,label,min,max,step=1,unit='') {
 const row=el('label'),title=el('span',label),output=el('output',fmt(s[key])+unit),input=el('input');
 input.type='range';Object.assign(input,{min,max,step,value:s[key]});input.dataset.teachingControl=key;input.dataset.unit=unit;input.setAttribute('aria-label',label);
 input.addEventListener('input',()=>apply({[key]:Number(input.value),prediction:null,...(['w','r'].includes(key)?{selection:0}:{})}));row.append(title,output,input);container.append(row);
}
function choose(container,s,apply,key,label,options) {
 const row=el('label'),title=el('span',label),select=el('select');select.setAttribute('aria-label',label);select.dataset.teachingControl=key;
 options.forEach(([value,name])=>{const option=el('option',name);option.value=value;select.append(option);});select.value=s[key];select.addEventListener('change',()=>apply({[key]:Number(select.value),prediction:null}));row.append(title,select);container.append(row);
}
export function teachingControls(container,binding,s,apply) {
 const help=container.querySelector(':scope > .prepared-help');
 container.replaceChildren(...(help?[help]:[]));container.hidden=false;
 const toolbar=el('div');toolbar.className='teaching-toolbar';const toggle=el('button',s.savedDiagram?'Use new experiment':'View original saved diagram');toggle.type='button';toggle.dataset.teachingToggle='';toggle.addEventListener('click',()=>{const focused=document.activeElement===toggle;apply({savedDiagram:s.savedDiagram?0:1});teachingControls(container,binding,s,apply);if(focused)container.querySelector('[data-teaching-toggle]').focus({preventScroll:true});});toolbar.append(toggle);container.append(toolbar);
 if(s.savedDiagram&&binding.scene==='replication-lab'){
  const original=el('div');container.append(original);replicationControls(original,binding.id.slice(5),{...replicationDefaults(binding.id.slice(5)),...s},values=>apply({...values,...('w' in values||'r' in values?{selection:0}:{}),prediction:null}));return;
 }
 const grid=el('div');grid.className='teaching-controls';container.append(grid);
 if(s.savedDiagram){for(const control of savedControls(binding.scene,s))range(grid,s,apply,control.key,control.label,control.min,control.max,control.step,control.units?' '+control.units:'');return;}
 if(binding.kind==='timing'){
  range(grid,s,apply,'time','Time',0,240,1,' ms');choose(grid,s,apply,'sync','Reply policy',[[0,'Reply after leader'],[1,'Wait for follower A']]);
  range(grid,s,apply,'lagA','Delivery delay to A',20,160,1,' ms');range(grid,s,apply,'lagB','Delivery delay to B',20,160,1,' ms');
  if(binding.id==='ddia-failover'){range(grid,s,apply,'crash','Leader failure time',30,220,1,' ms');choose(grid,s,apply,'promoted','Promote follower',[[0,'Follower A'],[1,'Follower B']]);}
  const steps=el('div');steps.className='teaching-presets';
  const cases=binding.id==='ddia-failover'?[['Lose an acknowledged write',{time:110,lagA:100,lagB:150,sync:0,crash:70,promoted:0}],['Wait, then fail',{time:110,lagA:100,lagB:150,sync:1,crash:70,promoted:0}],['A receives the write',{time:110,lagA:20,lagB:150,sync:0,crash:70,promoted:0}]]:[['1 · Send',{time:10,sync:0}],['2 · Client sees success',{time:40,sync:0}],['3 · A catches up',{time:80,lagA:60,sync:0}],['4 · Wait for A',{time:80,lagA:60,sync:1}]];
  cases.forEach(([label,values])=>{const button=el('button',label);button.addEventListener('click',()=>apply({...values,prediction:null}));steps.append(button);});container.append(steps);
 }else if(binding.kind==='quorum'){
  range(grid,s,apply,'w','Write responses W',1,5);range(grid,s,apply,'r','Read responses R',1,5);const p=el('p','Select a response set in the experiment. Every possible set is shown.');p.className='teaching-hint';container.append(p);
 }else if(binding.kind==='vectors'){
  for(const [key,label]of [['a0','A · replica 1 events'],['a1','A · replica 2 events'],['b0','B · replica 1 events'],['b1','B · replica 2 events']])range(grid,s,apply,key,label,0,4);
 }else if(binding.kind==='surface'){
  range(grid,s,apply,'b','Normal angle θ',0,360,.1,'°');range(grid,s,apply,'a','Actual area A',.2,2,.05,' m²');range(grid,s,apply,'q','Field scale q',.25,2,.05,' W/m²');
  const button=el('button','Make the field tangent');button.addEventListener('click',()=>apply({b:Math.atan(.5)*180/Math.PI+90,prediction:null}));container.append(button);
 }else{
  range(grid,s,apply,'r','Cylinder radius r',.6,3.3,.05);range(grid,s,apply,'lambda','Charge per length λ',.5,3,.05);range(grid,s,apply,'length','Cylinder length L',.5,3,.05);
 }
}
export function syncTeachingControls(container,s) {
 for(const input of container.querySelectorAll('[data-teaching-control]')){input.value=s[input.dataset.teachingControl];const output=input.closest('label')?.querySelector('output');if(output)output.textContent=fmt(Number(input.value))+(input.dataset.unit||'');}
}
