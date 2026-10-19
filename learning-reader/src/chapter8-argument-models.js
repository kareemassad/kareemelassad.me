import data from './chapter8-argument-data.json' with {type:'json'};
import {primitivesSVG} from './scene-primitives.js';

// Original static source reasoning. Focus changes annotation only, never force.
export const chapter8ArgumentNames=Object.freeze(Object.keys(data));
export const chapter8ArgumentDefaults=Object.freeze(Object.fromEntries(chapter8ArgumentNames.map(s=>[s,Object.freeze({n:0})])));
export const chapter8ArgumentData=Object.freeze(data);
export function chapter8ArgumentControls(scene){if(!data[scene])throw Error('Unknown source argument.');return [{key:'n',label:'Source argument focus',min:0,max:data[scene].claims.length-1,step:1,units:''}];}
export function chapter8ArgumentModel(scene,values={}){const d=data[scene],n=values.n??0;if(!d||!Number.isInteger(n)||n<0||n>=d.claims.length)throw RangeError('Choose a declared source claim.');return {state:{n},selectedClaimId:d.claims[n].id,visibleClaimIds:d.claims.map(c=>c.id),visibleRelationIds:d.relations.map(r=>r.id),sourceStatus:d.claims[n].status};}
export const chapter8ArgumentEquations={
 'ch8-core-context':{plain:'ΔUcore = ZB qe²/(4πε0 r); ZB = 5 (source hypothesis)',tex:String.raw`\Delta U_{\rm core}=\frac{Z_Bq_e^2}{4\pi\epsilon_0r},\qquad Z_B=5\quad\text{(source hypothesis)}`},
 'ch8-core-radius-context':{plain:'rcore = (5/6) rprevious (same inferred energy difference)',tex:String.raw`r_{\rm core}=\frac56r_{\rm previous}\quad\text{(same inferred energy difference)}`}
};
export const chapter8ArgumentEquationSources=Object.freeze({'ch8-core-context':{sourcePages:[109],labels:[],kind:'Noncomputed source-context hypothesis; no nuclear dynamics'},'ch8-core-radius-context':{sourcePages:[109],labels:['8.24'],kind:'Noncomputed source-context ratio to separately reviewed previous radius'}});
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value}),line=(id,A,B,style='construction')=>({id,type:'segment',from:A,to:B,style}),arrow=(id,A,B,style='normal')=>({id,type:'arrow',from:A,to:B,style,visible:true}),circle=(id,at,radius)=>({id,type:'circle',at,radius}),curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const wrap=(s,width=82)=>{const out=[];let row='';for(const w of s.split(' ')){if((row+' '+w).trim().length>width){out.push(row);row=w;}else row=(row+' '+w).trim();}if(row)out.push(row);return out;};
function spinPair(shapes,id,cx,cy,vertical,opposite){const A=vertical?[cx,cy-17]:[cx-22,cy],B=vertical?[cx,cy+17]:[cx+22,cy];for(const [i,P]of [A,B].entries()){shapes.push(circle(id+'-particle-'+i,P,7),arrow(id+'-spin-'+i,[P[0],P[1]],[P[0],P[1]+(opposite&&i===1?23:-23)]));}}
function sourceGraphic(scene,shapes,equations){
 if(scene==='energy-state-comparison-map'){
  shapes.push(circle('initial-state',[140,130],57),circle('final-state',[460,130],57),text('initial-label',140,128,'Initial configuration'),text('final-label',460,128,'Final configuration'),arrow('state-accounting',[210,130],[390,130]),text('accounting-role',300,105,'Energy-accounting relation'),text('process-unspecified',300,220,'Intervening process is unspecified'),text('electrostatic-motivation',300,262,'Transfer this state-comparison method to electrostatics'));
 }else if(scene==='crystal-corrections-map'){
  const rows=[['Prior unit: attraction-only work',8.94,8.94],['Repulsion released (opposite sign)',-.9510638297872341,-.9510638297872341],['Rounded source correction',7.99,7.99],['Observed separation work',7.92,7.92]];
  for(const [i,[label,value,bar]]of rows.entries()){const y=81+i*43;shapes.push(text('budget-label-'+i,175,y-14,label),line('budget-bar-'+i,[340,y],[340+20*bar,y],bar<0?'sample-field':'normal'),text('budget-value-'+i,550,y,String(Number(value.toPrecision(6)))+' eV'));}
  shapes.push(text('prior-context',300,245,'8.94 eV belongs to the preceding attraction-only passage'),text('static-recompute',300,269,'Prior rounded input: 8.94 × (1 − 1/9.4) = 7.98894 ≈ 7.99 eV'),text('vibration-unknown',300,291,'Vibration contribution: unspecified; no residual is fitted'));
 }else if(scene==='nuclear-dependencies-map'){
  for(const [i,label]of ['a: parallel spins','b: opposite spins','c: separation along spins','d: changed relative spins','e: orbit aligned with spin','f: orbit opposed to spin'].entries()){
   const cx=100+(i%3)*200,cy=100+Math.floor(i/3)*115;
   if(i<4)spinPair(shapes,'configuration-'+i,cx,cy,i>=2,i%2===1);
   else{for(const [j,x]of [cx,cx+46].entries())shapes.push(circle('configuration-'+i+'-particle-'+j,[x,cy],7),arrow('configuration-'+i+'-spin-'+j,[x,cy],[x,cy-23]));shapes.push(curve('orbit-'+i,Array.from({length:65},(_,j)=>[cx+46*Math.cos(j*Math.PI/32),cy+19*Math.sin(j*Math.PI/32)]),'reference'),arrow('orbital-sense-'+i,i===4?[cx-13,cy+18]:[cx+13,cy+18],i===4?[cx+13,cy+18]:[cx-13,cy+18],'sample-field'));}
   shapes.push(text('configuration-label-'+i,cx,cy+44,label));
  }
  shapes.push(text('arrow-roles',300,291,'Six schematic source configurations; arrows are spin/orbit, not forces'));
 }else if(scene==='nuclear-component-symmetry-map'){
  for(const [i,pair]of [['p','p'],['p','n'],['n','n']].entries()){const x=100+i*200;for(let j=0;j<2;j++)shapes.push(circle('nucleon-'+i+'-'+j,[x-22+44*j,125],14),text('nucleon-type-'+i+'-'+j,x-22+44*j,125,pair[j]));shapes.push(text('nuclear-role-'+i,x,180,'Nuclear component'));}
  shapes.push(text('substitution-scope',300,227,'Approximate source charge independence under p ↔ n substitution'),text('electrical-separate',300,266,'Electrical contributions remain separate; complete forces differ'));
 }else{
  shapes.push(circle('core-boundary',[215,143],70));
  for(let i=0;i<10;i++){const angle=i*Math.PI/5;shapes.push(circle('core-nucleon-'+i,[215+45*Math.cos(angle),143+45*Math.sin(angle)],9),text('core-type-'+i,215+45*Math.cos(angle),143+45*Math.sin(angle),i%2?'n':'p'));}
  shapes.push(circle('outer-proton',[470,143],13),text('outer-type',470,143,'p'),line('core-radius',[215,143],[470,143]),text('radius-label',355,130,'r'),text('core-count',215,237,'Tentative core: 5p + 5n'),text('outer-label',470,237,'Outer particle'),text('core-geometry-role',300,274,'Static hypothetical arrangement; no reconstructed orbit'));
  equations.push({id:'ch8-core-context',x:300,y:316},{id:'ch8-core-radius-context',x:300,y:358});
 }
}
export function chapter8ArgumentDefinition(scene,values={}){
 const m=chapter8ArgumentModel(scene,values),d=data[scene],shapes=[],equations=[],core=scene==='nuclear-core-refinement-map',top=core?404:330;
 sourceGraphic(scene,shapes,equations);shapes.push(text('title',300,24,{'energy-state-comparison-map':'ENERGY · COMPARE STATES','crystal-corrections-map':'CRYSTAL BINDING · CORRECTIONS','nuclear-dependencies-map':'NUCLEAR FORCE · CONFIGURATION DEPENDENCIES','nuclear-component-symmetry-map':'NUCLEAR COMPONENT · CHARGE INDEPENDENCE','nuclear-core-refinement-map':'CORE HYPOTHESIS · REVISED RADIUS'}[scene]));
 for(const [i,c]of d.claims.entries()){const y=top+Math.floor(i/2)*55,x=i%2?450:150;shapes.push(text('claim-'+c.id,x,y,c.title),text('claim-status-'+c.id,x,y+18,c.status),line('claim-focus-'+c.id,[x-115,y+28],[x+115,y+28],c.id===m.selectedClaimId?'sample-field':'background'));}
 const relationTop=top+Math.ceil(d.claims.length/2)*55+5;
 for(const [i,r]of d.relations.entries()){const y=relationTop+i*24,from=d.claims.find(c=>c.id===r.from),to=d.claims.find(c=>c.id===r.to);shapes.push(arrow('relation-'+r.id,[35,y],[63,y],m.selectedClaimId===r.from||m.selectedClaimId===r.to?'sample-field':'normal'),text('relation-meaning-'+r.id,325,y,from.title+' '+r.kind+' '+to.title));}
 const focusTop=relationTop+d.relations.length*24+20,selected=d.claims[m.state.n];
 const maxRows=Math.max(...d.claims.map(c=>wrap(c.statement).length)),rows=wrap(selected.statement);for(let i=0;i<maxRows;i++)shapes.push(text('focus-statement-'+i,300,focusTop+i*23,rows[i]||''));
 const last=focusTop+maxRows*23+12,height=last+111,c=chapter8ArgumentControls(scene)[0],origin=70,scale=460/c.max;
 shapes.push(text('argument-limit',300,last,'Source reasoning only; selection changes annotation, not a physical system'),line('focus-track',[70,last+42],[530,last+42],'axis'),{id:'focus-probe',type:'point',at:[origin+m.state.n*scale,last+42],probe:true},text('hint',300,last+75,'Select a source claim; every claim and relation remains visible'));
 return {schemaVersion:1,scene,width:600,height,label:d.title,sourceScope:'Original source-matched categorical explanation for '+d.unitId+'. All claims and typed relations remain visible. Selection changes focus only. Context values/equations are uncomputed source context; no inferred dynamics, force, interaction-energy curve, calibration or modern historical-status update.',shapes,equations,metrics:[{label:'Selected source reasoning',value:selected.title},{label:'Source argument role',value:selected.status}],probe:{id:'focus-probe',parameter:'n',origin,scale,min:0,max:c.max}};
}
const escape=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function drawChapter8Argument(scene,state){const d=chapter8ArgumentDefinition(scene,state);return {body:primitivesSVG(d.shapes)+d.equations.map(e=>`<text x="${e.x}" y="${e.y}" text-anchor="middle" font-size="11">${escape(chapter8ArgumentEquations[e.id].plain)}</text>`).join(''),height:d.height,label:d.label,metrics:d.metrics};}
export function chapter8ArgumentChecks(scene){const c=chapter8ArgumentControls(scene)[0];for(let n=0;n<=c.max;n++){const m=chapter8ArgumentModel(scene,{n});if(m.visibleClaimIds.length!==c.max+1||m.visibleRelationIds.length!==data[scene].relations.length)throw Error('Source reasoning omitted.');}return {passed:true,states:c.max+1,method:'Categorical completeness checks; independent actual source/figure/native review remains required.'};}
