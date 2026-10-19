import {chapter8AssemblyNames,chapter8AssemblyDefinition} from './chapter8-assembly-models.js';
import {chapter8ArgumentNames,chapter8ArgumentDefinition} from './chapter8-argument-models.js';
import {chapter8CrystalNuclearNames,chapter8CrystalNuclearDefinition} from './chapter8-crystal-nuclear-models.js';
import {chapter8CapacitanceNames,chapter8CapacitanceDefinition} from './chapter8-capacitance-models.js';
import {chapter8FieldNames,chapter8FieldDefinition} from './chapter8-field-models.js';
import {seriesNames,seriesDefinition} from './series-models.js';
import {openingContextANames,openingContextADefinition} from './opening-context-a-models.js';
import {openingContextBNames,openingContextBDefinition} from './opening-context-b-models.js';
import {chapter8ExtensionNames,chapter8ExtensionDefinition} from './chapter8-extension-models.js';
import {conductorExtensionNames,conductorExtensionDefinition} from './conductor-extension-models.js';
import {molecularEmissionNames,molecularEmissionDefinition} from './molecular-emission-models.js';
import {openingExtensionNames,openingExtensionDefinition} from './opening-extension-models.js';
import {dielectricNames,dielectricDefinition} from './dielectric-models.js';
import {energyNames,energyDefinition} from './energy-models.js';
import {domainNames,domainDefinition} from './laplace-domain-models.js';
import {circumstancesNames,circumstancesDefinition} from './circumstances-models.js';
import {electrostaticsNames,electrostaticsDefinition} from './electrostatics-models.js';
import {gaussNames,gaussDefinition} from './gauss-models.js';
import {electromagnetismNames,electromagnetismDefinition} from './electromagnetism-models.js';
import {foundationNames,foundationDefinition} from './foundation-models.js';
import {chapter3Names,chapter3Definition} from './chapter3-models.js';
import {boundaryNames,boundaryDefinition} from './boundary-models.js';
import {gradientNames,gradientDefinition} from './gradient-models.js';
import {validateTemplate,templateControls} from './templates.js';
import {shellConePair} from './shell-cone-model.js';
import {shellPowerField} from './shell-experiments.js';
export const adapterNames=Object.freeze([...chapter8AssemblyNames,...chapter8ArgumentNames,...chapter8CrystalNuclearNames,...chapter8CapacitanceNames,...seriesNames,...openingContextANames,...openingContextBNames,...chapter8ExtensionNames,...openingExtensionNames,...molecularEmissionNames,...conductorExtensionNames,'shell-cone','shell-power-law',...gradientNames,...boundaryNames,...chapter3Names,...foundationNames,...electromagnetismNames,...electrostaticsNames,...gaussNames,...circumstancesNames,...domainNames,...energyNames,...dielectricNames,...chapter8FieldNames]);
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(3)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const segment=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='field',fill=false)=>({id,type:'curve',points,style,fill});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
function valid(scene,state){const values=Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]]));return validateTemplate(scene,values);}
export function adapterScene(scene,state){
 if(!adapterNames.includes(scene))throw Error('No audited package adapter for this model.');
 if(chapter8AssemblyNames.includes(scene))return chapter8AssemblyDefinition(scene,state);
 if(chapter8ArgumentNames.includes(scene))return chapter8ArgumentDefinition(scene,state);
 if(chapter8CrystalNuclearNames.includes(scene))return chapter8CrystalNuclearDefinition(scene,state);
 if(chapter8CapacitanceNames.includes(scene))return chapter8CapacitanceDefinition(scene,state);
 if(chapter8FieldNames.includes(scene))return chapter8FieldDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(seriesNames.includes(scene))return seriesDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(openingContextANames.includes(scene))return openingContextADefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(openingContextBNames.includes(scene))return openingContextBDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(chapter8ExtensionNames.includes(scene))return chapter8ExtensionDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(openingExtensionNames.includes(scene))return openingExtensionDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(molecularEmissionNames.includes(scene))return molecularEmissionDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(conductorExtensionNames.includes(scene))return conductorExtensionDefinition(scene,Object.fromEntries(templateControls(scene,state).map(c=>[c.key,state[c.key]])));
 if(dielectricNames.includes(scene))return dielectricDefinition(scene,state);
 if(energyNames.includes(scene))return energyDefinition(scene,state);
 if(domainNames.includes(scene))return domainDefinition(scene,state);
 if(circumstancesNames.includes(scene))return circumstancesDefinition(scene,state);
 if(gaussNames.includes(scene))return gaussDefinition(scene,state);
 if(electrostaticsNames.includes(scene))return electrostaticsDefinition(scene,state);
 // Runtime angles are continuous during drag and animation. The pure model
 // checks their bounds; integer proposal defaults are checked separately.
 if(electromagnetismNames.includes(scene))return electromagnetismDefinition(scene,state);
 if(foundationNames.includes(scene))return foundationDefinition(scene,state);
 if(chapter3Names.includes(scene))return chapter3Definition(scene,state);
 if(boundaryNames.includes(scene))return boundaryDefinition(scene,state);
 if(gradientNames.includes(scene))return gradientDefinition(scene,state);
 const s=valid(scene,state);
 const shapes=[];let equations,label,probe;
 if(scene==='shell-cone'){
  const m=shellConePair(s),scale=112/s.a,P=[300+m.p*scale,176],theta=s.b*Math.PI/180;
  const at=(distance,u=m.u)=>[P[0]+distance*scale*u[0],P[1]-distance*scale*u[1]];
  const end=(angle,sign)=>{const u=[Math.cos(angle),Math.sin(angle)],projection=m.p*u[0],root=Math.sqrt(s.a*s.a-m.p*m.p+projection*projection);return at(-projection+sign*root,u);};
  shapes.push(text('title',300,32,'UNIFORM SPHERICAL SHELL · INTERIOR P'),circle('shell',[300,176],112));
  for(const sign of [1,-1]){const patch=Array.from({length:17},(_,n)=>end(theta-.052+n*.104/16,sign));shapes.push(curve('wedge'+sign,[P,...patch,P],'wedge',true),curve('patch'+sign,patch,'patch'));}
  const near=at(m.near),far=at(-m.far);shapes.push(segment('axis',near,far));
  for(let n=0;n<8;n++){const a=n*Math.PI/4;shapes.push(text('charge'+n,300+123*Math.cos(a),180-123*Math.sin(a),'+'));}
  shapes.push(point('center',[300,176]),text('center-label',289,196,s.r===0?'':'C'),point('probe',P,true),text('probe-label',P[0],P[1]-17,s.r===0?'P = C':'P'));
  const distanceLabel=(id,A,value)=>text(id,(A[0]+P[0])/2+m.u[1]*16,(A[1]+P[1])/2+m.u[0]*16,value);
  shapes.push(distanceLabel('near-label',near,'r₁'),distanceLabel('far-label',far,'r₂'),text('near-patch',near[0]+20,near[1]-20,'dA₁'),text('far-patch',far[0]-24,far[1]-20,'dA₂'));
  for(const sign of [-1,1]){const tip=at(sign*42/scale);shapes.push({id:'field'+sign,type:'arrow',from:P,to:tip,visible:true},text('field-label'+sign,tip[0]-m.u[1]*16,tip[1]-m.u[0]*16,sign<0?'E₁':'E₂'));}
  shapes.push(text('slice',300,314,'Plane slice · differential patches · schematic wedges and arrows'),text('ratio',300,340,'Charge ratio = area ratio = (r₂/r₁)² = '+fmt(m.areaRatio)),text('cancel',300,396,'Equal field magnitudes · opposite directions · pair net = 0'));
  equations=[{id:'cone-cancellation',x:300,y:370}];label='Opposite differential cone patches cancel inside a uniform spherical shell under the inverse-square law';
  probe={id:'probe',parameter:'r',origin:300,scale:112,min:0,max:.85};
 }else{
  const value=shellPowerField(s.r,s.b),P=[130+s.r*90,180],samples=Array.from({length:171},(_,n)=>({r:n*.005,v:shellPowerField(n*.005,s.b)})),max=Math.max(.35,...samples.map(i=>Math.abs(i.v)))*1.1;
  const gx=r=>330+r/.85*215,gy=v=>190-v/max*96;
  shapes.push(text('title',300,32,'COUNTERFACTUAL LAW · PRESCRIBED UNIFORM POSITIVE SHELL'),circle('shell',[130,180],90));
  for(let n=0;n<8;n++){const a=n*Math.PI/4;shapes.push(text('charge'+n,130+102*Math.cos(a),184-102*Math.sin(a),'+'));}
  shapes.push(point('center',[130,180]),text('center-label',121,200,s.r===0?'':'C'),point('shell-probe',P),text('P-label',P[0]+7,163,s.r===0?'P = C':'P'));
  shapes.push({id:'field',type:'arrow',from:P,to:[P[0]+Math.sign(value)*34,180],visible:Math.abs(value)>1e-10});
  shapes.push(text('direction',130,295,value< -1e-10?'Inward':value>1e-10?'Outward':s.b===2?'Zero interior field':'Zero field at center'),text('slice',130,316,'Plane slice · schematic arrow length'));
  shapes.push(segment('y-axis',[330,80],[330,286],'axis'),segment('zero-line',[330,190],[545,190],'construction'),segment('x-axis',[330,286],[545,286],'axis'));
  shapes.push(text('graph-title',432,64,'Total radial E / Eref'),text('positive-tick',317,94,fmt(max)),text('zero-tick',317,190,'0'),text('negative-tick',315,286,fmt(-max)),text('start-tick',330,305,'0'),text('end-tick',541,305,'0.85'),text('x-label',434,323,'Interior position |CP| / R'));
  shapes.push(curve('inverse-square',[[330,190],[545,190]],'reference'),curve('total-field',samples.map(i=>[gx(i.r),gy(i.v)])),point('probe',[gx(s.r),gy(value)],true),text('value',430,344,'p = '+fmt(s.b)+' · E(P)/Eref = '+fmt(value)));
  shapes.push(text('scope',300,400,'d: charge–P distance · û: charge–P direction · no conductor redistribution'));
  equations=[{id:'shell-power',x:300,y:374}];label='Total interior field of a prescribed uniform shell under an illustrative inverse-power law; no conductor redistribution';
  probe={id:'probe',parameter:'r',origin:330,scale:215/.85,min:0,max:.85};
 }
 shapes.push(text('context',300,422,'Illustrative values · moving observation point in a static model'),text('hint',300,444,scene==='shell-cone'?'Drag P: position · ↑ / ↓: angle · Space: pause / play':'Drag graph point: position · ↑ / ↓: exponent · Space: pause / play'));
 return {schemaVersion:1,scene,sourceScope:label,label,width:600,height:452,shapes,equations,probe};
}
export function probeValue(definition,x){
 if(!Number.isFinite(x)||!definition?.probe)throw Error('Invalid adapter probe coordinate.');
 const p=definition.probe;return Math.min(p.max,Math.max(p.min,(x-p.origin)/p.scale));
}
