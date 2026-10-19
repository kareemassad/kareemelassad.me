import {chapter8AssemblyNames,chapter8AssemblyDefaults,chapter8AssemblyControls,drawChapter8Assembly,chapter8AssemblyChecks} from './chapter8-assembly-models.js';
import {chapter8ArgumentNames,chapter8ArgumentDefaults,chapter8ArgumentControls,drawChapter8Argument,chapter8ArgumentChecks} from './chapter8-argument-models.js';
import {chapter8CrystalNuclearNames,chapter8CrystalNuclearDefaults,chapter8CrystalNuclearControls,drawChapter8CrystalNuclear,chapter8CrystalNuclearChecks} from './chapter8-crystal-nuclear-models.js';
import {chapter8CapacitanceNames,chapter8CapacitanceDefaults,chapter8CapacitanceControls,drawChapter8Capacitance,chapter8CapacitanceChecks} from './chapter8-capacitance-models.js';
import {chapter8FieldNames,chapter8FieldDefaults,chapter8FieldControls,chapter8FieldFrame,drawChapter8Field,chapter8FieldChecks} from './chapter8-field-models.js';
import {seriesNames,seriesDefaults,seriesControls,drawSeries,checkSeries} from './series-models.js';
import {openingContextANames,openingContextADefaults,openingContextAControls,drawOpeningContextA,openingContextAChecks} from './opening-context-a-models.js';
import {openingContextBNames,openingContextBDefaults,openingContextBControls,drawOpeningContextB,openingContextBChecks} from './opening-context-b-models.js';
import {chapter8ExtensionNames,chapter8ExtensionDefaults,chapter8ExtensionControls,drawChapter8Extension,chapter8ExtensionChecks} from './chapter8-extension-models.js';
import {conductorExtensionNames,conductorExtensionDefaults,conductorExtensionControls,drawConductorExtension,conductorExtensionChecks} from './conductor-extension-models.js';
import {molecularEmissionNames,molecularEmissionDefaults,molecularEmissionControls,drawMolecularEmission,molecularEmissionChecks} from './molecular-emission-models.js';
import {openingExtensionNames,openingExtensionDefaults,openingExtensionControls,drawOpeningExtension,openingExtensionChecks} from './opening-extension-models.js';
import {dielectricNames,dielectricDefaults,dielectricControls,drawDielectric,dielectricChecks} from './dielectric-models.js';
import {energyNames,energyDefaults,energyControls,drawEnergy,energyChecks} from './energy-models.js';
import {domainNames,domainDefaults,domainControls,drawDomain,domainChecks} from './laplace-domain-models.js';
import {circumstancesNames,circumstancesDefaults,circumstancesControls,drawCircumstances,circumstancesChecks} from './circumstances-models.js';
import {electrostaticsNames,electrostaticsDefaults,electrostaticsControls,drawElectrostatics,electrostaticsChecks} from './electrostatics-models.js';
import {gaussNames,gaussDefaults,gaussControls,drawGauss,gaussChecks} from './gauss-models.js';
import {electromagnetismNames,electromagnetismDefaults,electromagnetismControls,drawElectromagnetism,electromagnetismChecks} from './electromagnetism-models.js';
import {foundationNames,foundationDefaults,foundationControls,drawFoundation,foundationChecks} from './foundation-models.js';
import {chapter3Names,chapter3Defaults,chapter3Controls,drawChapter3,chapter3Checks} from './chapter3-models.js';
import {boundaryNames,boundaryDefaults,drawBoundary,boundaryChecks} from './boundary-models.js';
import {gradientNames,drawGradient,gradientChecks} from './gradient-models.js';
import {causalNames,drawCausal,causalChecks} from './causal-models.js';
import {diagramContext} from './diagram-context.js';
import {EPS0,NC,K} from './physics.js';
import {planarNames,drawPlanar,planarChecks} from './planar-models.js';
import {sphericalNames,drawSpherical,sphericalChecks} from './spherical-models.js';
import {transactionNames,drawTransaction,transactionChecks} from './transaction-models.js';
import {drawShellCone,shellConeChecks} from './shell-cone-model.js';
import {shellExperimentNames,drawShellPower,drawNull,drawChargeSampling,shellExperimentChecks} from './shell-experiments.js';
export const TEMPLATE_VERSION=1;
export const templateNames=[...chapter8AssemblyNames,...chapter8ArgumentNames,...chapter8CrystalNuclearNames,...chapter8CapacitanceNames,...seriesNames,...openingContextANames,...openingContextBNames,...chapter8ExtensionNames,...openingExtensionNames,...molecularEmissionNames,...conductorExtensionNames,'line-charge','quorum','sheet-charge',...sphericalNames,...transactionNames,...planarNames,'shell-cone',...shellExperimentNames,...gradientNames,...causalNames,...boundaryNames,...chapter3Names,...foundationNames,...electromagnetismNames,...electrostaticsNames,...gaussNames,...circumstancesNames,...domainNames,...energyNames,...dielectricNames,...chapter8FieldNames];
export const templateInitial=scene=>chapter8AssemblyNames.includes(scene)?{...chapter8AssemblyDefaults[scene]}:chapter8ArgumentNames.includes(scene)?{...chapter8ArgumentDefaults[scene]}:chapter8CrystalNuclearNames.includes(scene)?{...chapter8CrystalNuclearDefaults[scene]}:chapter8CapacitanceNames.includes(scene)?{...chapter8CapacitanceDefaults[scene]}:chapter8FieldNames.includes(scene)?{...chapter8FieldDefaults[scene]}:seriesNames.includes(scene)?{...seriesDefaults[scene]}:openingContextANames.includes(scene)?{...openingContextADefaults[scene]}:openingContextBNames.includes(scene)?{...openingContextBDefaults[scene]}:chapter8ExtensionNames.includes(scene)?{...chapter8ExtensionDefaults[scene]}:openingExtensionNames.includes(scene)?{...openingExtensionDefaults[scene]}:molecularEmissionNames.includes(scene)?{...molecularEmissionDefaults[scene]}:conductorExtensionNames.includes(scene)?{...conductorExtensionDefaults[scene]}:dielectricNames.includes(scene)?{...dielectricDefaults[scene]}:energyNames.includes(scene)?{...energyDefaults[scene]}:domainNames.includes(scene)?{...domainDefaults[scene]}:circumstancesNames.includes(scene)?{...circumstancesDefaults[scene]}:gaussNames.includes(scene)?{...gaussDefaults[scene]}:electrostaticsNames.includes(scene)?{...electrostaticsDefaults[scene]}:electromagnetismNames.includes(scene)?{...electromagnetismDefaults[scene]}:foundationNames.includes(scene)?{...foundationDefaults[scene]}:chapter3Names.includes(scene)?{...chapter3Defaults[scene]}:boundaryNames.includes(scene)?{...boundaryDefaults[scene]}:scene==='gradient-direction'?{r:.45,b:30,q:1}:scene==='gradient-coordinates'?{r:.6,b:0,a:35}:causalNames.includes(scene)?{progress:0,b:0}:scene==='shell-power-law'?{q:1,a:1.6,r:.55,b:3}:scene==='null-comparison'?{b:0,sigma:.2}:scene==='shell-cone'?{q:1,a:1.6,r:.55,b:25}:scene==='line-charge'?{lambda:1,r:2}:scene==='quorum'?{n:5,w:2,r:2,progress:0,phase:0}:scene==='sheet-charge'?{sigma:1,r:2}:sphericalNames.includes(scene)?{q:1,a:1.6,r:.8}:transactionNames.includes(scene)?{progress:0}:scene==='sheet-background'?{sigma:1.5,b:40}:scene==='parallel-sheets'?{sigma:1.5,a:1.2,r:0}:{};
export function normalizeTemplate(scene,s){if(scene==='quorum'){s.n=Math.round(s.n);s.w=Math.max(1,Math.min(s.n,Math.round(s.w)));s.r=Math.max(1,Math.min(s.n,Math.round(s.r)));s.phase=Math.floor(s.phase||0)%s.n;}return s;}
export function templateControls(scene,s={}){
 if(chapter8AssemblyNames.includes(scene))return chapter8AssemblyControls(scene);
 if(chapter8ArgumentNames.includes(scene))return chapter8ArgumentControls(scene);
 if(chapter8CrystalNuclearNames.includes(scene))return chapter8CrystalNuclearControls(scene);
 if(chapter8CapacitanceNames.includes(scene))return chapter8CapacitanceControls(scene);
 if(chapter8FieldNames.includes(scene))return chapter8FieldControls(scene);
 if(seriesNames.includes(scene))return seriesControls(scene);
 if(openingContextANames.includes(scene))return openingContextAControls(scene);
 if(openingContextBNames.includes(scene))return openingContextBControls(scene);
 if(chapter8ExtensionNames.includes(scene))return chapter8ExtensionControls(scene);
 if(openingExtensionNames.includes(scene))return openingExtensionControls(scene);
 if(molecularEmissionNames.includes(scene))return molecularEmissionControls(scene);
 if(conductorExtensionNames.includes(scene))return conductorExtensionControls(scene);

 if(dielectricNames.includes(scene))return dielectricControls(scene);
 if(energyNames.includes(scene))return energyControls(scene);
 if(domainNames.includes(scene))return domainControls(scene);
 if(circumstancesNames.includes(scene))return circumstancesControls(scene);
 if(gaussNames.includes(scene))return gaussControls(scene);
 if(electrostaticsNames.includes(scene))return electrostaticsControls(scene);
 if(electromagnetismNames.includes(scene))return electromagnetismControls(scene);
 if(foundationNames.includes(scene))return foundationControls(scene);
 if(chapter3Names.includes(scene))return chapter3Controls(scene);
 const p=(key,label,min,max,step,units)=>({key,label,min,max,step,units});
 if(scene==='surface-flux')return [p('a','Face area A',.2,2,.05,'m²'),p('b','Chosen normal angle θ',0,360,1,'°'),p('q','Illustrative field q',.25,2,.05,'W/m²')];
 if(['gauss-cube','stokes-square'].includes(scene))return [p('r','Cube or square side h',.2,1.2,.01,'m'),p('a','Expansion derivative λ',-1,1,.1,'W/m³'),p('b','Rotation derivative ω',-1,1,.1,'W/m³'),...(scene==='stokes-square'?[p('n','Path and normal: CCW +z / CW −z',0,1,1,'')]:[])];
 if(scene==='gradient-direction')return [p('r','Step length h',.02,.8,.01,'m'),p('b','Displacement direction β',0,360,1,'°'),p('q','Curvature κ',0,1.5,.05,'°C/m²')];
 if(scene==='gradient-coordinates')return [p('r','Step length h',.1,.8,.01,'m'),p('b','Displacement direction β',0,360,1,'°'),p('a','Axis rotation θ',-90,90,1,'°')];
 if(causalNames.includes(scene))return [p('b','Comparison pair: concurrent / local / message chain',0,2,1,'')];
 if(scene==='charge-sampling')return [];
 if(scene==='null-comparison')return [p('b','Observed residual m',-2,2,.05,'illustrative units'),p('sigma','Assumed error bound u',.05,1,.05,'illustrative units')];
 if(scene==='shell-power-law')return [p('q','Prescribed shell charge Q',.5,3,.25,'nC'),p('a','Reference shell radius R',.8,2.4,.025,'m'),p('r','Interior position |CP| / R',0,.85,.01,''),p('b','Decay exponent p',1,3,.05,'')];
 if(scene==='shell-cone')return [p('q','Shell charge Q',.5,3,.25,'nC'),p('a','Shell radius R',.8,2.4,.025,'m'),p('r','Interior position |CP| / R',0,.85,.01,''),p('b','Cone-axis angle',0,80,1,'°')];
 if(scene==='line-charge')return [p('lambda','Line density λ',.5,3,.25,'nC/m'),p('r','Cylinder radius r',.6,3.3,.025,'m')];
 if(scene==='sheet-charge')return [p('sigma','Surface density σ',.5,3,.25,'nC/m²'),p('r','Distance from sheet',.6,3.3,.025,'m')];
 if(sphericalNames.includes(scene))return [p('q','Total charge Q',.5,3,.25,'nC'),p('a','Source radius R',.8,2.4,.025,'m'),p('r','Observation radius r',0,4.5,.025,'m')];
 if(scene==='sheet-background')return [p('sigma','Surface density σ',.5,3,.25,'nC/m²'),p('b','Uniform background b',-250,250,1,'N/C')];
 if(scene==='parallel-sheets')return [p('sigma','Surface density magnitude σ',.5,3,.25,'nC/m²'),p('a','Half separation a',.8,2.4,.025,'m'),p('r','Observation coordinate x',-3.3,3.3,.025,'m')];
 if(transactionNames.includes(scene))return [];
 if(scene==='quorum')return [p('n','Replicas N',3,9,1,''),p('w','Write threshold W',1,s.n||5,1,''),p('r','Read threshold R',1,s.n||5,1,'')];return null;
}
export function lineField(lambda,r){return lambda/(2*Math.PI*EPS0*r);}
export function sheetField(sigma){return sigma/(2*EPS0);}
export function quorumSets(n,w,r,phase=0){
 const written=Array.from({length:w},(_,i)=>i),read=Array.from({length:r},(_,i)=>(i+phase)%n),overlap=read.filter(i=>written.includes(i));
 return {written,read,overlap,minimum:Math.max(0,w+r-n),version:overlap.length?1:0,guaranteed:w+r>n};
}
const fmt=n=>Number(n.toPrecision(3));
const metric=(label,value)=>({label,value});
export function drawTemplate(scene,s){
 let body='',metrics=[],label='';
 if(chapter8AssemblyNames.includes(scene)){const result=drawChapter8Assembly(scene,s);return {svg:`<svg viewBox="0 0 600 ${result.height}" role="img" aria-label="${result.label}" xmlns="http://www.w3.org/2000/svg">${result.body}</svg>`,metrics:result.metrics,caption:result.label};}
 if(chapter8ArgumentNames.includes(scene)){const result=drawChapter8Argument(scene,s);return {svg:`<svg viewBox="0 0 600 ${result.height}" role="img" aria-label="${result.label}" xmlns="http://www.w3.org/2000/svg">${result.body}</svg>`,metrics:result.metrics,caption:result.label};}
 if(chapter8CrystalNuclearNames.includes(scene)){const result=drawChapter8CrystalNuclear(scene,s);return {svg:`<svg viewBox="0 0 600 ${result.height}" role="img" aria-label="${result.label}" xmlns="http://www.w3.org/2000/svg">${result.body}</svg>`,metrics:result.metrics,caption:result.label};}
 if(chapter8CapacitanceNames.includes(scene)){const result=drawChapter8Capacitance(scene,s);return {svg:`<svg viewBox="0 0 600 676" role="img" aria-label="${result.label}" xmlns="http://www.w3.org/2000/svg">${result.body}</svg>`,metrics:result.metrics,caption:result.label};}
 if(chapter8FieldNames.includes(scene)){const result=drawChapter8Field(scene,Object.fromEntries(chapter8FieldControls(scene).map(c=>[c.key,s[c.key]])));return {svg:`<svg viewBox="0 0 600 ${chapter8FieldFrame(scene)}" role="img" aria-label="${result.label}" xmlns="http://www.w3.org/2000/svg">${result.body}</svg>`,metrics:result.metrics,caption:result.label};
 }else if(seriesNames.includes(scene)){const result=drawSeries(scene,Object.fromEntries(seriesControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(openingContextANames.includes(scene)){const result=drawOpeningContextA(scene,Object.fromEntries(openingContextAControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(openingContextBNames.includes(scene)){const result=drawOpeningContextB(scene,Object.fromEntries(openingContextBControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(chapter8ExtensionNames.includes(scene)){const result=drawChapter8Extension(scene,Object.fromEntries(chapter8ExtensionControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(openingExtensionNames.includes(scene)){const result=drawOpeningExtension(scene,Object.fromEntries(openingExtensionControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(molecularEmissionNames.includes(scene)){const result=drawMolecularEmission(scene,Object.fromEntries(molecularEmissionControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(conductorExtensionNames.includes(scene)){const result=drawConductorExtension(scene,Object.fromEntries(conductorExtensionControls(scene).map(c=>[c.key,s[c.key]])));body=result.body;metrics=result.metrics;label=result.label;
 }else if(scene==='line-charge'){
  const a=s.r*52,e=lineField(s.lambda*NC,s.r),flux=e*2*Math.PI*s.r,arrow=2*e,head=Math.min(5,arrow*.4);
  body=`<line x1="300" y1="32" x2="300" y2="354" class="vector"/><ellipse cx="300" cy="112" rx="${a}" ry="${a*.2}" class="gaussian"/><ellipse cx="300" cy="280" rx="${a}" ry="${a*.2}" class="gaussian"/><path d="M${300-a} 112V280M${300+a} 112V280" class="gaussian"/><line x1="300" y1="202" x2="${300+a}" y2="202" class="dimension"/><circle cx="${300+a}" cy="202" r="4" class="probe-dot"/><path d="M${300+a} 202h${arrow}l-${head}-${head*.55}m${head} ${head*.55}-${head} ${head*.55}" class="probe-vector"/><text x="${300+a/2}" y="224" text-anchor="middle" class="label">r</text><text x="320" y="48" class="label">+λ</text><text x="${300-a-18}" y="197" text-anchor="end" class="label">L = 1 m</text><text x="300" y="385" text-anchor="middle" class="large-equation">E(r) = λ / (2πε₀r)</text>`;
  metrics=[metric('|E(r)|',fmt(e)+' N/C'),metric('Cylinder flux',fmt(flux)+' V·m'),metric('End-face flux','0 V·m')];label='Infinite line charge and a coaxial Gaussian cylinder';
 }else if(scene==='sheet-charge'){
  const e=sheetField(s.sigma*NC),offset=s.r*52,arrow=e*.65;
  body='<path d="M275 95l50-40v230l-50 40z" fill="#f3f6f8" stroke="#a1b4c2" stroke-width="1"/>';
  body+='<path d="M220 145l30-24v100l-30 24zM395 145l30-24v100l-30 24zM220 145H395M250 121H425M220 245H395M250 221H425" class="gaussian"/><text x="208" y="238" text-anchor="end" class="label">A</text><text x="439" y="215" class="label">A</text>';
  for(const y of [115,180,245]){body+=`<path d="M325 ${y}h${arrow}l-5-3m5 3-5 3M275 ${y}h-${arrow}l5-3m-5 3 5 3" class="probe-vector"/>`;}
  body+=`<text x="300" y="41" text-anchor="middle" class="label">+σ</text><line x1="300" y1="290" x2="${300+offset}" y2="290" class="dimension"/><circle cx="${300+offset}" cy="180" r="4" class="probe-dot"/><path d="M${300+offset} 180h${arrow}l-5-3m5 3-5 3" class="probe-vector"/><text x="${300+offset/2}" y="310" text-anchor="middle" class="label">r</text><text x="300" y="347" text-anchor="middle" class="label">EA + EA = σA / ε₀</text><text x="300" y="383" text-anchor="middle" class="large-equation">|E| = σ / (2ε₀)</text>`;
  metrics=[metric('|E| on either side',fmt(e)+' N/C'),metric('Distance r',fmt(s.r)+' m'),metric('Flux / box area',fmt(2*e)+' V/m')];label='Infinite isolated uniform sheet, equal outward fields on both sides';
 }else if(scene==='quorum'){
  const q=quorumSets(s.n,s.w,s.r,s.phase||0),point=i=>{const a=-Math.PI/2+i*2*Math.PI/s.n;return [300+135*Math.cos(a),188+135*Math.sin(a)];};
  for(let i=0;i<s.n;i++){const [x,y]=point(i),written=q.written.includes(i),read=q.read.includes(i);if(read)body+=`<line x1="300" y1="188" x2="${x}" y2="${y}" class="construction"/><circle cx="${x}" cy="${y}" r="33" class="read-ring"/>`;body+=`<circle cx="${x}" cy="${y}" r="25" class="${written?'written-node':'old-node'}"/><text x="${x}" y="${y-3}" text-anchor="middle" class="node-name">${String.fromCharCode(65+i)}</text><text x="${x}" y="${y+13}" text-anchor="middle" class="node-version">v${written?1:0}</text>`;}
  body+=`<text x="300" y="178" text-anchor="middle" class="label">READ RETURNS</text><text x="300" y="207" text-anchor="middle" class="large-equation">v${q.version}</text><text x="300" y="380" text-anchor="middle" class="label">Blue: completed write · Rings: current read group</text>`;
  metrics=[metric('Current overlap',q.overlap.length+' replica'+(q.overlap.length===1?'':'s')),metric('Minimum overlap',q.minimum+' replica'+(q.minimum===1?'':'s')),metric('Every read sees v1?',q.guaranteed?'Yes, under these assumptions':'No')];label='Fixed completed write and changing read quorum';
 }else if(domainNames.includes(scene)){const result=drawDomain(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(circumstancesNames.includes(scene)){const result=drawCircumstances(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(gaussNames.includes(scene)){const result=drawGauss(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(dielectricNames.includes(scene)){const result=drawDielectric(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(energyNames.includes(scene)){const result=drawEnergy(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(electrostaticsNames.includes(scene)){const result=drawElectrostatics(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(electromagnetismNames.includes(scene)){const result=drawElectromagnetism(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(foundationNames.includes(scene)){const result=drawFoundation(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(chapter3Names.includes(scene)){const result=drawChapter3(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(boundaryNames.includes(scene)){const result=drawBoundary(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(gradientNames.includes(scene)||causalNames.includes(scene)){const result=gradientNames.includes(scene)?drawGradient(scene,s):drawCausal(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(shellExperimentNames.includes(scene)){const result=scene==='shell-power-law'?drawShellPower(s):scene==='null-comparison'?drawNull(s):drawChargeSampling();body=result.body;metrics=result.metrics;label=result.label;
 }else if(scene==='shell-cone'){const result=drawShellCone(s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(planarNames.includes(scene)){const result=drawPlanar(scene,s);body=result.body;metrics=result.metrics;label=result.label;
 }else if(sphericalNames.includes(scene)||transactionNames.includes(scene)){const result=sphericalNames.includes(scene)?drawSpherical(scene,s):drawTransaction(scene,s);body=result.body;metrics=result.metrics;label=result.label;}
 else throw Error('Unknown template.');
 return {svg:diagramContext(`<svg viewBox="0 0 600 ${chapter8FieldNames.includes(scene)?(scene.endsWith('-map')?650:562):seriesNames.includes(scene)?562:chapter8ExtensionNames.includes(scene)?472:conductorExtensionNames.includes(scene)?466:[...seriesNames,...openingContextANames,...openingContextBNames,...openingExtensionNames,...molecularEmissionNames].includes(scene)?452:400}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`,scene,s),metrics,caption:label};
}
export function validateTemplate(scene,defaults={}){
 if(!templateNames.includes(scene))throw Error('Unsupported visualization template.');const s={...templateInitial(scene),...defaults},controls=templateControls(scene,s);
 for(const [key,value] of Object.entries(defaults)){const c=controls.find(c=>c.key===key);if(!c||!Number.isFinite(value)||value<c.min||value>c.max||(c.step===1&&!Number.isInteger(value)))throw Error('Invalid template parameter: '+key);}
 for(const c of controls)if(s[c.key]<c.min||s[c.key]>c.max)throw Error('Template parameters are inconsistent.');return s;
}
export function invariantChecks(scene){
 if(chapter8AssemblyNames.includes(scene))return chapter8AssemblyChecks(scene);
 if(chapter8ArgumentNames.includes(scene))return chapter8ArgumentChecks(scene);
 if(chapter8CrystalNuclearNames.includes(scene))return chapter8CrystalNuclearChecks(scene);
 if(chapter8CapacitanceNames.includes(scene))return chapter8CapacitanceChecks(scene);
 if(chapter8FieldNames.includes(scene))return chapter8FieldChecks(scene);
 if(seriesNames.includes(scene))return checkSeries(scene);
 if(openingContextANames.includes(scene))return openingContextAChecks(scene);
 if(openingContextBNames.includes(scene))return openingContextBChecks(scene);
 if(chapter8ExtensionNames.includes(scene))return chapter8ExtensionChecks(scene);
 if(openingExtensionNames.includes(scene))return openingExtensionChecks(scene);
 if(molecularEmissionNames.includes(scene))return molecularEmissionChecks(scene);
 if(conductorExtensionNames.includes(scene))return conductorExtensionChecks(scene);

 if(dielectricNames.includes(scene))return dielectricChecks(scene);
 if(energyNames.includes(scene))return energyChecks(scene);
 if(domainNames.includes(scene))return domainChecks(scene);
 if(circumstancesNames.includes(scene))return circumstancesChecks(scene);
 if(gaussNames.includes(scene))return gaussChecks(scene);
 if(electrostaticsNames.includes(scene))return electrostaticsChecks(scene);
 if(electromagnetismNames.includes(scene))return electromagnetismChecks(scene);
 if(foundationNames.includes(scene))return foundationChecks(scene);
 if(chapter3Names.includes(scene))return chapter3Checks(scene);
 if(boundaryNames.includes(scene))return boundaryChecks(scene);
 if(gradientNames.includes(scene))return gradientChecks(scene);
 if(causalNames.includes(scene))return causalChecks();
 if(shellExperimentNames.includes(scene))return shellExperimentChecks(scene);
 if(scene==='shell-cone')return shellConeChecks();
 if(planarNames.includes(scene))return planarChecks(scene);
 if(sphericalNames.includes(scene))return sphericalChecks(scene);
 if(transactionNames.includes(scene))return transactionChecks(scene);
 if(scene==='sheet-charge'){
  let maxError=0,maxRelativeError=0;for(const sigma of [.5*NC,NC,3*NC])for(const distance of [.6,1,2,3.3]){const e=sheetField(sigma),radius=1000000,disk=2*Math.PI*K*sigma*(1-distance/Math.sqrt(radius*radius+distance*distance));maxError=Math.max(maxError,Math.abs(2*e-sigma/EPS0));maxRelativeError=Math.max(maxRelativeError,Math.abs(disk-e)/e);}
  if(maxError>1e-10||maxRelativeError>4e-6)throw Error('Sheet flux or finite-disk limit check failed.');return {passed:true,method:'Finite-disk Coulomb integral limit and two-face pillbox flux per area',maxFluxError:maxError,maxRelativeError};
 }
 if(scene==='line-charge'){
  let error=0,fluxError=0;for(const lambda of [.5*NC,NC,3*NC])for(const r of [.6,1,2,3.3]){const L=2000,finite=2*K*lambda/r*L/Math.sqrt(L*L+r*r);error=Math.max(error,Math.abs(finite-lineField(lambda,r))/lineField(lambda,r));fluxError=Math.max(fluxError,Math.abs(lineField(lambda,r)*2*Math.PI*r-lambda/EPS0));}
  if(error>2e-6||fluxError>1e-10)throw Error('Independent line-field or cylinder-flux check failed.');return {passed:true,method:'Finite-line integral limit and radius-independent cylindrical flux',maxRelativeError:error,maxFluxError:fluxError};
 }
 let combinations=0;for(let n=3;n<=9;n++)for(let w=1;w<=n;w++)for(let r=1;r<=n;r++){
  const choices=(start,remaining,set=[])=>{if(!remaining){const overlap=set.filter(i=>i<w).length;if(overlap<Math.max(0,w+r-n)||w+r>n&&overlap===0)throw Error('Quorum intersection check failed.');combinations++;return;}for(let i=start;i<=n-remaining;i++)choices(i+1,remaining-1,[...set,i]);};choices(0,r);
 }return {passed:true,method:'Enumerated all read subsets for N=3..9 and all thresholds',combinations};
}
