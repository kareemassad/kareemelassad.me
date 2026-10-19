import {primitivesSVG} from './scene-primitives.js';

// Original source-context aids. Drawing coordinates, story selections and
// illustrative signs are not measurements, rates, distributions or solutions
// of an unspecified apparatus. The two mathematical examples are explicit.
const freezeStates=s=>Object.freeze(Object.fromEntries(Object.entries(s).map(([k,v])=>[k,Object.freeze(v)])));
export const openingContextBDefaults=freezeStates({
 'coordinate-basis':{r:0},
 'air-avalanche-context':{r:0},
 'electron-resolution-context':{r:3},
 'boundary-physical-analogs':{a:.5,r:0},
 'screening-context':{r:0,a:0,b:0},
 'mesh-shielding-context':{r:0,a:0}
});
export const openingContextBNames=Object.freeze(Object.keys(openingContextBDefaults));
const control=(key,label,min,max,step,units='',extra={})=>({key,label,min,max,step,units,...extra});
const choice=(key,label,choices)=>control(key,label,0,Object.keys(choices).length-1,1,'choice',{type:'enum',choices});
export function openingContextBControls(scene){
 if(scene==='coordinate-basis')return [control('r','Coordinate basis rotation about y',0,360,1,'°')];
 if(scene==='air-avalanche-context')return [choice('r','Encounter: 0 seed / 1 collision / 2 removal',{0:'Loose electron',1:'Selected ionizing encounter',2:'One electron removed'})];
 if(scene==='electron-resolution-context')return [choice('r','Cause: 0 geometry / 1 waves / 2 motion / 3 both',{0:'Geometric reference',1:'Electron-wave diffraction',2:'Transverse initial motion',3:'Both qualitative causes'})];
 if(scene==='boundary-physical-analogs')return [control('a','Probe x / L in the common domain',0,1,.01,''),choice('r','Analog: 0 vacuum / 1 current / 2 heat / 3 fluid / 4 membrane',{0:'Charge-free vacuum',1:'Uniform steady conductor',2:'Uniform steady heat flow',3:'Irrotational incompressible fluid',4:'Uniform-tension unloaded membrane'})];
 if(scene==='screening-context')return [choice('r','Example: 0 colloid / 1 charged chain',{0:'Colloidal particles',1:'Charged chains'}),choice('a','Context: 0 longer / 1 shorter screening range',{0:'Longer screening range',1:'Shorter screening range'}),choice('b','Layout: 0 separated / 1 possible closer arrangement',{0:'Separated or extended drawing',1:'Possible approach or coiling drawing'})];
 if(scene==='mesh-shielding-context')return [choice('r','Enclosure: 0 mesh / 1 solid reference',{0:'Closed conducting mesh',1:'Closed solid conductor reference'}),choice('a','Probe: 0 near an opening / 1 well inside',{0:'Near mesh aperture',1:'Away from apertures'})];
 throw Error('Unknown opening context B aid.');
}
function stateFor(scene,values){
 if(!openingContextBNames.includes(scene)||!values||typeof values!=='object'||Array.isArray(values))throw Error('Invalid opening context B aid or values.');
 const controls=openingContextBControls(scene),keys=new Set(controls.map(c=>c.key));
 for(const k of Object.keys(values))if(!keys.has(k))throw Error('Unknown opening context B parameter: '+k);
 const state={...openingContextBDefaults[scene],...values};
 for(const c of controls)if(!Number.isFinite(state[c.key])||state[c.key]<c.min||state[c.key]>c.max||(c.type==='enum'&&!Object.hasOwn(c.choices,state[c.key])))throw Error('Invalid opening context B parameter: '+c.key);
 return state;
}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const mul=(v,k)=>v.map(x=>x*k);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const norm=v=>Math.hypot(...v);
const finite=(x,min,max,name)=>{if(!Number.isFinite(x)||x<min||x>max)throw Error('Invalid '+name);return x;};

export function coordinateBasisKernel({degrees=0}={}){
 finite(degrees,0,360,'basis angle');
 const theta=degrees*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta),basis=[[c,0,-s],[0,1,0],[s,0,c]],gradientDiagonal=[1,2,3];
 // E=(x,2y,3z) V/m for SI coordinates; its gradient coefficients have V/m².
 // This authored electrostatic example is not the source dipole field.
 const observer=[1,1,1],physicalE=[1,2,3],components=basis.map(e=>dot(e,physicalE)),jacobian=basis.map(e=>basis.map(f=>e.reduce((sum,x,i)=>sum+x*gradientDiagonal[i]*f[i],0)));
 const partials=jacobian.map((row,i)=>row[i]),reconstructed=basis.reduce((v,e,i)=>add(v,mul(e,components[i])),[0,0,0]);
 return {degrees,basis,observer,physicalE,components,jacobian,partials,reconstructed,divergence:partials.reduce((a,b)=>a+b,0),physicalMagnitude:norm(physicalE),componentMagnitude:norm(components),potentialAtObserver:-3,coordinateUnits:'m',fieldUnits:'V/m',gradientUnits:'V/m²',potentialUnits:'V',timeEvolution:false};
}
export function boundaryAnalogKernel({position=.5,analog=0}={}){
 finite(position,0,1,'dimensionless position');if(!Number.isInteger(analog)||analog<0||analog>4)throw Error('Invalid physical analog.');
 const labels=['Potential φ','Potential φ','Temperature T','Velocity potential ψ','Membrane displacement h'],conditions=[
  'Charge-free vacuum; electrostatic boundary values.',
  'Uniform conductivity; steady current; no bulk current source.',
  'Uniform thermal conductivity; steady state; no heat source.',
  'Irrotational and incompressible; velocity v = ∇ψ.',
  'Uniform tension; small slopes; no transverse loading.'
 ],physicalUnits=['V','V','K','m²/s','m'],direction=analog===3?1:analog===4?null:-1;
 return {position,analog,u:position,gradient:[1,0],gradientCoordinates:'normalized coordinates x/L, y/L',laplacian:0,boundary:{left:0,right:1,topNormalDerivative:0,bottomNormalDerivative:0},quantity:labels[analog],physicalUnits:physicalUnits[analog],condition:conditions[analog],direction,vectorMeaning:['Electric field E','Current density J','Heat flux','Fluid velocity v','Displacement gradient'][analog],normalized:true,physicalAmplitude:null,physicalCalibration:false};
}
export function openingContextBModel(scene,values={}){
 const state=stateFor(scene,values);
 if(scene==='coordinate-basis')return {scene,state,...coordinateBasisKernel({degrees:state.r})};
 if(scene==='boundary-physical-analogs')return {scene,state,...boundaryAnalogKernel({position:state.a,analog:state.r})};
 if(scene==='air-avalanche-context')return {scene,state,stage:state.r,neutralAtom:state.r<2,freeElectronCount:state.r===2?2:1,ionChargeSign:state.r===2?1:0,totalChargeInElectronUnits:-1,fieldDirection:[1,0],electronForceDirection:[-1,0],ionizationConditional:true,time:null,rate:null,threshold:null,trajectory:false};
 if(scene==='electron-resolution-context')return {scene,state,diffraction:state.r===1||state.r===3,transverseMotion:state.r===2||state.r===3,geometryReference:state.r===0,sourceEraResolution:{value:25,units:'Å',approximately:true,prediction:false},pointSpreadFunction:null,resolutionPrediction:null,magnificationPrediction:null,drawingUnits:'authored schematic units'};
 if(scene==='screening-context')return {scene,state,example:state.r===0?'colloid':'charged chain',shorterRange:state.a===1,possibleCloserLayout:state.b===1,particleChargeSign:-1,counterionChargeSign:1,rangePixels:state.a===1?26:45,rangeMeaning:'Authored halo depicts only relative screening range; no density or Debye length fit.',positionsMeaning:'Manually selected layouts, independent of screening choice; no equilibrium prediction.',force:null,collisionRate:null,precipitationThreshold:null,chainEnergy:null};
 if(scene==='mesh-shielding-context')return {scene,state,solidReference:state.r===1,nearOpening:state.a===0,probe:state.a===0?[109,201]:[242,185],interiorCharge:false,electrostatic:true,localStatus:state.r===1?'Zero interior E under the stated closed-solid conditions.':state.a===0?'Local E can remain close to mesh apertures.':'Source approximation: small interior E away from apertures.',fieldMagnitude:null,attenuation:null,screenCorrectionLaw:null,closedEnclosure:true,drawingUnits:'authored schematic units'};
 throw Error('Unknown opening context B aid.');
}
export const pureModel=openingContextBModel;
const sourceHash='17b2ad182d7eff221e983a0250793dc8fc73c97f6f68331726c2bb154af91a79';
const source=(unitId,startItemId,endItemId,start,end)=>Object.freeze({unitId,sourceHash,startItemId,endItemId,start:Object.freeze(start),end:Object.freeze(end),endExclusive:true,order:'physical page/y; main body only'});
export const openingContextBSources=Object.freeze({
 'coordinate-basis':source('c6-c09','local-source-item','local-source-item',{page:79,y:.21536101010100997},{page:79,y:.7143016666666667}),
 'air-avalanche-context':source('c6-c30','local-source-item','local-source-item',{page:88,y:.802715808080808},{page:89,y:.04797085858585848}),
 'electron-resolution-context':source('c6-c32','local-source-item','local-source-item',{page:89,y:.37251126262626266},{page:89,y:.493270101010101}),
 'boundary-physical-analogs':source('c7-c02','local-source-item','local-source-item',{page:90,y:.8932852525252525},{page:91,y:.15363499999999994}),
 'screening-context':source('c7-c23','local-source-item','local-source-item',{page:99,y:.14084964646464643},{page:99,y:.4604632828282828}),
 'mesh-shielding-context':source('c7-c27','local-source-item','local-source-item',{page:100,y:.6879910606060606},{page:100,y:.9459556565656565})
});
export const openingContextBScope=Object.freeze({
 'coordinate-basis':'Fixed physical field and observer, rotating Cartesian basis about y. Authored SI example E=(x,2y,3z), φ=−(x²+2y²+3z²)/2; coefficients in V/m². All three partial derivatives are included. This is not a dipole field or a physical rotation of source or observer.',
 'air-avalanche-context':'Conditional static collision story in air: a free electron is accelerated, and a sufficiently energetic collision can remove one atomic electron. One illustrated event conserves charge; counts are bookkeeping, not a growth law. No pressure, collision cross section, threshold, timing, breakdown voltage or operating instruction.',
 'electron-resolution-context':'Original schematic of geometric correspondence and two source-named image blur causes: electron-wave diffraction and initial transverse motion. Uncalibrated overlay geometry, no intensity, probability distribution, point-spread function, blur sum or calculated resolution. About 25 Å is the source-era apparatus report.',
 'boundary-physical-analogs':'Explicit common normalized solution u=x/L on a rectangular domain, left/right values 0/1 and zero top/bottom normal derivative. The physical analogy requires the same domain, equation and boundary conditions, plus the medium assumptions shown. Units and transport signs differ; no apparatus calibration or measurement simulation.',
 'screening-context':'Qualitative source consequences for negatively charged colloids or chains and opposite-sign counterions. Halo widths and manually selected arrangements are drawing data. Shorter screening can weaken repulsion and permit approach/coiling; it does not determine force, conformation, adhesion, collision rate, salt chemistry or precipitation threshold.',
 'mesh-shielding-context':'Original closed-enclosure electrostatic schematic with no interior charge. Mesh shielding is approximate away from apertures when spacing is small relative to distance and enclosure size; local fields can remain near openings. Closed solid conductor is a separate ideal reference. No leakage magnitude, general 3D correction law, AC attenuation or shield certification.'
});
export const openingContextBEquations=Object.freeze({
 'coordinate-basis':Object.freeze({plain:'div E = ∂E₁/∂x₁ + ∂E₂/∂x₂ + ∂E₃/∂x₃ = 6 V/m²',basis:'Source Cartesian divergence; authored affine SI example.',tex:'\\nabla\\cdot\\mathbf E=\\mathrm{tr}(R^T A R)=6\\,\\mathrm{V/m^2}',sourceEquationLabel:null}),
 'air-avalanche-context':Object.freeze({plain:'e− + A → A+ + 2e−  ·  total charge: −e',basis:'Charge accounting of one conditional ionizing event, not a rate.',sourceEquationLabel:null}),
 'electron-resolution-context':Object.freeze({plain:'Geometric magnification does not fix image resolution.',basis:'Qualitative source distinction; no numerical blur equation.',sourceEquationLabel:null}),
 'boundary-physical-analogs':Object.freeze({plain:'u = x / L  ·  ∇²u = 0  ·  matching normalized boundary data',basis:'Authored exact common boundary example; source analog argument.',tex:'u=x/L,\\qquad\\nabla^2u=0',sourceEquationLabel:'7.1 (context immediately before unit)'}),
 'screening-context':Object.freeze({plain:'Shorter screening range → weaker distant repulsion (qualitative).',basis:'No universal salt-to-conformation or precipitation law.',sourceEquationLabel:null}),
 'mesh-shielding-context':Object.freeze({plain:'Near mesh apertures: local E may remain · away: shielding approximation.',basis:'Closed-screen qualitative claim, not a computed field.',sourceEquationLabel:null})
});
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='normal')=>({id,type:'arrow',from,to,style,visible:true});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const curve=(id,points,style='reference')=>({id,type:'curve',points,style});
const fmt=x=>Math.abs(x)<1e-10?'0':Number(x.toFixed(3)).toString();
const rect=(id,x,y,w,h)=>curve(id,[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],'field');
function rows(shapes,values){values.forEach((v,i)=>shapes.push(text('readout-'+i,460,84+i*25,v)));}

export function openingContextBDefinition(scene,values={}){
 const m=openingContextBModel(scene,values),s=m.state,shapes=[];let title,context;
 if(scene==='coordinate-basis'){
  title='ROTATE THE BASIS · KEEP THE PHYSICAL FIELD FIXED';
  const S=v=>[170+v[0]*32,212-v[2]*32],O=S([0,0,0]),E=S(m.physicalE),C=m.basis;
  shapes.push(line('fixed-x',[80,212],[300,212],'axis'),line('fixed-z',[170,290],[170,63],'axis'),text('fixed-x-label',307,217,'x'),text('fixed-z-label',170,51,'z'));
  for(const [i,label] of [[0,'x₁'],[2,'x₃']]){const v=C[i],a=S(mul(v,-2)),b=S(mul(v,3)),labelAt=S(mul(v,2.5));shapes.push(arrow('rotated-axis-'+i,a,b,'background'),text('axis-label-'+i,labelAt[0],labelAt[1]+4,label));}
  const first=S(mul(C[0],m.components[0]));
  shapes.push(arrow('component-1',O,first),arrow('component-3',first,E),arrow('physical-E',O,E,'field'),point('field-tip',E),text('physical-label',263,109,'fixed E'),text('slice-label',180,314,'x–z slice; E₂ = 2 V/m out of plane'));
  rows(shapes,['Fixed P = (1, 1, 1) m','E = (1, 2, 3) V/m','Basis angle: '+fmt(s.r)+'°','E₁ = '+fmt(m.components[0])+' V/m','E₂ = 2 V/m','E₃ = '+fmt(m.components[2])+' V/m','|E| = '+fmt(m.physicalMagnitude)+' V/m','Three slope terms (V/m²):',m.partials.map(fmt).join(' + ')+' = '+fmt(m.divergence)]);
  context=['Authored affine field, not a calculated dipole field.','Changing components preserves E and the sum of all three derivatives.'];
 }else if(scene==='air-avalanche-context'){
  title='AIR DISCHARGE · ONE CONDITIONAL IONIZING COLLISION';
  for(const y of [84,107])shapes.push(arrow('field-'+y,[62,y],[320,y]),text('E-label-'+y,338,y+4,'E'));
  shapes.push(circle('atom-cloud',[207,191],36),point('atom-center',[207,191]),text('atom-label',207,266,m.neutralAtom?'Atom A: neutral':'Residual ion A+'));
  const electron=s.r===0?[305,191]:s.r===1?[242,191]:[140,162];
  shapes.push(circle('seed-electron',electron,5),text('seed-label',electron[0],electron[1]+23,s.r===2?'free e−':'seed e−'),arrow('electron-force',[electron[0]-9,electron[1]],[electron[0]-44,electron[1]],'field'));
  if(s.r===2){shapes.push(text('ion-sign',207,195,'+'),circle('released-electron',[142,221],5),text('released-label',142,245,'released e−'),arrow('released-force',[131,221],[98,221],'field'));}
  else shapes.push(point('bound-electron',[228,178]),text('bound-label',269,167,'bound e−'));
  if(s.r===1)shapes.push(circle('encounter',[242,191],10),text('encounter-label',179,283,'Selected energetic encounter'));
  shapes.push(text('spatial-note',184,314,'Static event drawing; arrows show force direction'));
  rows(shapes,['E points right','Electron force points left',s.r===0?'A loose carrier gains energy':s.r===1?'Collision can ionize an atom':'One more free electron','Ionization is conditional','Free electrons shown: '+m.freeElectronCount,'Residual ion sign: '+(m.ionChargeSign?'+':'0'),'Total event charge: −e','Further collisions can multiply','carriers; no growth rate given']);
  context=['The field must give enough energy before a collision for ionization.','No field threshold, time, collision distribution or discharge setting.'];
 }else if(scene==='electron-resolution-context'){
  title='ELECTRON IMAGE · TWO DISTINCT BLUR CAUSES';
  const source=[83,199],screenX=292,targets=[[screenX,169],[screenX,229]];
  shapes.push(line('screen',[screenX,92],[screenX,292],'axis'),text('screen-label',screenX,78,'Screen'),circle('needle-tip',source,18),text('tip-label',83,256,'Needle tip'),point('site-1',[83,190]),point('site-2',[83,207]));
  for(let i=0;i<2;i++){const from=[83,190+17*i],to=targets[i];shapes.push(line('geometric-ray-'+i,from,to),point('image-center-'+i,to));}
  if(m.diffraction){
   for(let i=0;i<2;i++){const from=[83,190+17*i],to=targets[i];shapes.push(line('wave-envelope-top-'+i,from,[screenX,to[1]-24]),line('wave-envelope-bottom-'+i,from,[screenX,to[1]+24]));for(const distance of [50,91,132]){const t=distance/(screenX-from[0]),cy=from[1]+(to[1]-from[1])*t;shapes.push(curve('wavefront-'+i+'-'+distance,Array.from({length:17},(_,j)=>{const v=(j-8)/8;return [from[0]+distance-6*v*v,cy+v*24*t];}),'blue-curve'));}}
  }
  if(m.transverseMotion){
   for(let i=0;i<2;i++){const from=[83,190+17*i],to=targets[i];shapes.push(arrow('v-perp-'+i,from,[from[0],from[1]+(i?27:-27)],'sample-field'),curve('sideways-path-'+i,[from,[182,to[1]+(i?16:-16)],[screenX,to[1]+(i?26:-26)]],'gold-curve'));}
  }
  shapes.push(text('drawing-note',187,316,'Overlay spread is illustrative, with no calibrated width'));
  rows(shapes,['Geometry maps tip to screen',m.diffraction?'Wave diffraction: shown':'Wave overlay: hidden',m.transverseMotion?'Transverse motion: shown':'Motion overlay: hidden','Source-era apparatus report:','about 25 Å resolution','No numerical blur prediction','No brightness or PSF model','Large magnification alone','does not resolve fine detail']);
  context=['Diffraction and random sideways initial motion both smear the image.','Cause selection supplies no probability distribution or combined blur law.'];
 }else if(scene==='boundary-physical-analogs'){
  title='SAME DOMAIN AND BOUNDARY DATA · SAME NORMALIZED SOLUTION';
  const x=72,y=100,w=250,h=160;
  shapes.push(rect('domain',x,y,w,h),text('left-value',53,183,'0'),text('right-value',339,183,'1'),text('top-bc',197,79,'Zero normal derivative'),text('bottom-bc',197,283,'Zero normal derivative'));
  for(const u of [.2,.4,.6,.8])shapes.push(line('contour-'+u,[x+w*u,y],[x+w*u,y+h]),text('contour-label-'+u,x+w*u,306,fmt(u)));
  for(const yy of [136,180,224]){const direction=m.direction??1;shapes.push(arrow('transport-'+yy,[190-direction*35,yy],[190+direction*35,yy],m.direction===null?'background':'normal'));}
  shapes.push(point('domain-probe',[x+s.a*w,180]),text('vector-meaning',194,329,m.vectorMeaning+(m.direction===null?' (no transport flow)':'')));
  rows(shapes,[m.quantity,'Native unit: '+m.physicalUnits,'u = (quantity − left) / Δ','Same boundary values: 0, 1','Probe x/L = '+fmt(s.a),'u at probe = '+fmt(m.u),'∇²u = 0',m.direction===1?'Velocity follows +∇ψ':m.direction===null?'Height slope is +∇h':'Transport follows −gradient','Physical amplitudes unspecified']);
  context=[m.condition,'Same normalized solution requires matching equation and boundaries.'];
 }else if(scene==='screening-context'){
  title='SCREENING CONTEXT · REPULSION AND POSSIBLE ARRANGEMENTS';
  if(s.r===0){
   const centers=s.b===0?[[114,192],[275,192]]:[[164,192],[225,192]];
   for(let i=0;i<2;i++){const p=centers[i];shapes.push(circle('colloid-'+i,p,22),circle('halo-'+i,p,m.rangePixels),text('particle-sign-'+i,p[0],p[1]+4,'−'));for(const j of [0,1,2]){const t=j*2*Math.PI/3;shapes.push(text('counterion-'+i+'-'+j,p[0]+(m.rangePixels-5)*Math.cos(t),p[1]+(m.rangePixels-5)*Math.sin(t)+4,'+'));}}
   shapes.push(text('colloid-note',194,293,s.b===0?'Two separate negative particles':'Possible closer layout; no adhesion prediction'));
  }else{
   const chains=s.b===0?[[[65,149],[115,166],[162,150],[210,166],[255,149],[310,166]],[[65,229],[115,246],[162,230],[210,246],[255,229],[310,246]]]:[[[134,139],[174,150],[184,187],[157,212],[121,199],[116,167]],[[242,157],[280,170],[285,208],[257,231],[223,213],[218,180]]];
   for(let i=0;i<2;i++){shapes.push(curve('chain-'+i,chains[i],'field'));for(let j=0;j<chains[i].length;j++){const p=chains[i][j];shapes.push(circle('chain-halo-'+i+'-'+j,p,m.rangePixels*.56),text('chain-sign-'+i+'-'+j,p[0],p[1]+4,'−'));}}
   shapes.push(text('chain-note',190,291,s.b===0?'Extended, separated reference layouts':'Possible coiling/approach; no energy minimization'));
  }
  shapes.push(text('halo-note',193,315,'Halo size: qualitative screening range only'));
  rows(shapes,[s.r===0?'Colloid example':'Charged-chain example','Particle signs: negative','Counterions: opposite sign',m.shorterRange?'Shorter screening range':'Longer screening range','Salt can shorten Debye range','Weaker distant repulsion can','permit approach or coiling','Layout is selected separately','No precipitation threshold']);
  context=['Source connects screening to coagulation and chain precipitation.','The sketch computes no salt chemistry, collision rate or conformation.'];
 }else{
  title='CLOSED MESH · LOCAL APERTURE FIELD AND INTERIOR APPROXIMATION';
  const x=104,y=98,w=204,h=196;
  if(m.solidReference)shapes.push(rect('closed-solid',x,y,w,h));
  else{
   const gap=9,step=27;
   for(let xx=x;xx<x+w;xx+=step)for(const yy of [y,y+h])shapes.push(line('mesh-h-'+xx+'-'+yy,[xx,yy],[Math.min(x+w,xx+step-gap),yy],'axis'));
   for(let yy=y;yy<y+h;yy+=step)for(const xx of [x,x+w])shapes.push(line('mesh-v-'+xx+'-'+yy,[xx,yy],[xx,Math.min(y+h,yy+step-gap)],'axis'));
   // A single local aperture influence is illustrative, with no field amplitude.
   shapes.push(curve('local-aperture-influence',[[76,201],[99,201],[113,200],[128,199],[141,205]],'blue-curve'),arrow('local-field-direction',[108,201],[130,201]));
  }
  for(const yy of [115,149,225,265])shapes.push(arrow('external-E-'+yy,[47,yy],[90,yy]));
  shapes.push(text('outside-label',56,83,'External E'),text('enclosure-label',204,76,m.solidReference?'Closed solid conductor':'Closed conducting mesh'),point('interior-probe',m.probe),text('probe-label',m.probe[0]+12,m.probe[1]-14,'P'),text('no-charge',218,240,'No interior charge'),text('enclosure-note',204,318,'Enclosure slice; drawn gaps are schematic'));
  rows(shapes,[m.solidReference?'Solid reference: ideal case':'Mesh: approximate shielding',m.nearOpening?(m.solidReference?'P near solid boundary':'P near aperture zone'):'P well inside enclosure',m.solidReference?'Interior E = 0':m.nearOpening?'Local E can remain':'Small E in source approximation','Closed enclosure required','Electrostatic equilibrium','Wire spacing small relative','to distance and enclosure size','No calculated field magnitude','No frequency-response claim']);
  context=['A local open-grid harmonic does not specify the closed interior field.','Mesh apertures qualify the solid-conductor shielding comparison.'];
 }
 const first=openingContextBControls(scene)[0],scale=220/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(text('title',300,29,title),text('track-label',185,358,first.label),line('control-track',[65,377],[285,377],'axis'),point('probe',[origin+s[first.key]*scale,377],true),text('equation',300,403,openingContextBEquations[scene].plain),text('context',300,425,context[0]),text('context-detail',300,443,context[1]));
 return {schemaVersion:1,scene,label:title,sourceScope:openingContextBScope[scene],source:openingContextBSources[scene],width:600,height:452,shapes,equations:[],plainEquation:openingContextBEquations[scene],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max,...(first.type==='enum'?{step:1}: {})},schematic:scene!=='coordinate-basis'&&scene!=='boundary-physical-analogs',timeEvolution:false};
}
export function drawOpeningContextB(scene,values={}){const d=openingContextBDefinition(scene,values);return {body:primitivesSVG(d.shapes),metrics:[],label:d.label};}
export function openingContextBChecks(scene){
 const controls=openingContextBControls(scene),states=[{...openingContextBDefaults[scene]}];
 for(const c of controls)for(const v of c.type==='enum'?Object.keys(c.choices).map(Number):[c.min,c.max])states.push({...openingContextBDefaults[scene],[c.key]:v});
 const near=(a,b)=>{if(Math.abs(a-b)>1e-10)throw Error('Opening context invariant failed.');};
 for(const s of states){const m=openingContextBModel(scene,s),d=openingContextBDefinition(scene,s);
  if(scene==='coordinate-basis'){near(m.divergence,6);near(m.componentMagnitude,m.physicalMagnitude);for(let i=0;i<3;i++)near(m.reconstructed[i],m.physicalE[i]);}
  if(scene==='boundary-physical-analogs'){near(m.u,s.a);near(m.laplacian,0);}
  if(scene==='air-avalanche-context')near(-m.freeElectronCount+m.ionChargeSign,-1);
  const ids=new Set();for(const p of d.shapes){if(ids.has(p.id))throw Error('Duplicate primitive id.');ids.add(p.id);for(const v of p.at?[p.at]:p.points||(p.from?[p.from,p.to]:[]))if(v.some(x=>!Number.isFinite(x)))throw Error('Nonfinite primitive geometry.');}
 }
 return {passed:true,states:states.length,method:'Explicit field/basis invariants, exact common normalized boundary solution, event charge accounting, bounded qualitative controls and finite authored primitives.'};
}
