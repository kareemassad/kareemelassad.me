import {primitivesSVG} from './scene-primitives.js';

// Authored static schematics. Coordinates and sign weights are drawing data,
// not atom parameters, microscopic response laws, or particle trajectories.
const freezeStates=states=>Object.freeze(Object.fromEntries(Object.entries(states).map(([name,state])=>[name,Object.freeze(state)])));
export const molecularEmissionDefaults=freezeStates({
 'induced-molecule':{r:1},
 'permanent-water-dipole':{r:0},
 'electron-emission':{r:0},
 'helium-ion-emission':{r:1,a:0}
});
export const molecularEmissionNames=Object.freeze(Object.keys(molecularEmissionDefaults));
const control=(key,label,min,max,step,units='',extra={})=>({key,label,min,max,step,units,...extra});
export function molecularEmissionControls(scene){
 if(scene==='induced-molecule')return [control('r','Field: 0 absent / 1 right / 2 left',0,2,1,'choice',{sourceControlKey:'fieldConfiguration',type:'enum',choices:{0:'Field absent',1:'Field right',2:'Field left'},meaning:'Static selection; no field amplitude or response calculation.'})];
 if(scene==='permanent-water-dipole')return [control('r','Molecule orientation (schematic)',0,360,1,'°',{sourceControlKey:'orientation',meaning:'Rigid geometric orientation; no molecular dynamics.'})];
 if(scene==='electron-emission')return [control('r','Selected source/screen ray (schematic)',-60,60,1,'°',{sourceControlKey:'sourceDirection',meaning:'Geometric correspondence; no emission probability or intensity.'})];
 if(scene==='helium-ion-emission')return [control('r','Stage: 0 neutral / 1 removal / 2 screen',0,2,1,'choice',{sourceControlKey:'eventStage',type:'enum',choices:{0:'Neutral encounter',1:'One electron removed',2:'Ion at selected screen point'},meaning:'Story stages; no elapsed time or ionization probability.'}),control('a','Selected ion/screen ray (schematic)',-60,60,1,'°',{sourceControlKey:'sourceDirection',meaning:'Geometric correspondence; no integrated trajectory.'})];
 throw Error('Unknown molecular/emission schematic.');
}

export const molecularEmissionGeometry=Object.freeze({boundRadius:72,cloudRadius:47,inducedOffset:18,waterA:50,waterB:45,tipRadius:20,screenRadius:110,enclosureRadius:117});
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const subtract=(a,b)=>[a[0]-b[0],a[1]-b[1]];
const scale=(v,k)=>[v[0]*k,v[1]*k];
const norm=v=>Math.hypot(...v);
const rotate=(v,degrees)=>{const angle=degrees*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);return [c*v[0]-s*v[1],s*v[0]+c*v[1]];};
const ray=degrees=>{const angle=degrees*Math.PI/180;return [Math.sin(angle),Math.cos(angle)];};
function stateFor(scene,values){
 if(!molecularEmissionNames.includes(scene))throw Error('Unknown molecular/emission schematic.');
 if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Invalid molecular/emission parameters.');
 const controls=molecularEmissionControls(scene),keys=new Set(controls.map(c=>c.key));
 for(const key of Object.keys(values))if(!keys.has(key))throw Error('Unknown molecular/emission parameter: '+key);
 const state={...molecularEmissionDefaults[scene],...values};
 for(const c of controls){const v=state[c.key];if(!Number.isFinite(v)||v<c.min||v>c.max||(c.type==='enum'&&!Object.hasOwn(c.choices,v)))throw Error('Invalid molecular/emission parameter: '+c.key);}
 return state;
}

export function molecularEmissionProjection(scene,state){
 if(scene==='induced-molecule')return {fieldConfiguration:state.r};
 if(scene==='permanent-water-dipole')return {orientation:state.r};
 if(scene==='electron-emission')return {sourceDirection:state.r};
 if(scene==='helium-ion-emission')return {eventStage:state.r,sourceDirection:state.a};
 throw Error('Unknown molecular/emission schematic.');
}
export function molecularEmissionModel(scene,values={}){
 const state=stateFor(scene,values),configuration=molecularEmissionProjection(scene,state),g=molecularEmissionGeometry;
 if(scene==='induced-molecule'){
  const fieldDirection=[configuration.fieldConfiguration===0?0:configuration.fieldConfiguration===1?1:-1,0],separation=configuration.fieldConfiguration===0?0:g.inducedOffset;
  const positiveCenter=[0,0],negativeCenter=scale(fieldDirection,-separation);
  return {scene,state,configuration,coordinateUnits:'authored drawing units',fieldPresent:separation!==0,fieldDirection,positiveCenter,negativeCenter,negativeDisplacement:[...negativeCenter],dipoleDirection:subtract(positiveCenter,negativeCenter),separation,relativeCharges:[1,-1],netRelativeCharge:0,distributedChargeCenters:true};
 }
 if(scene==='permanent-water-dipole'){
  const oxygen=[0,0],hydrogen1=rotate([-g.waterA,-g.waterB],configuration.orientation),hydrogen2=rotate([g.waterA,-g.waterB],configuration.orientation),positiveCenter=scale(add(hydrogen1,hydrogen2),.5),negativeCenter=[...oxygen];
  const chargeSites=[{identity:'O',relativeWeight:-2,at:oxygen},{identity:'H1',relativeWeight:1,at:hydrogen1},{identity:'H2',relativeWeight:1,at:hydrogen2}];
  return {scene,state,configuration,coordinateUnits:'authored drawing units',chargeWeightUnits:'illustrative s; no physical partial-charge fit',oxygen,hydrogen1,hydrogen2,chargeSites,positiveCenter,negativeCenter,polarityDirection:subtract(positiveCenter,negativeCenter),momentPerRelativeWeight:chargeSites.reduce((v,p)=>add(v,scale(p.at,p.relativeWeight)),[0,0]),netRelativeCharge:chargeSites.reduce((sum,p)=>sum+p.relativeWeight,0),externalFieldRequired:false};
 }
 const direction=ray(configuration.sourceDirection),tipPoint=scale(direction,g.tipRadius),screenPoint=scale(direction,g.screenRadius),electronMode=scene==='electron-emission';
 const common={scene,state,configuration,coordinateUnits:'authored drawing units',direction,tipRadius:g.tipRadius,screenRadius:g.screenRadius,tipPoint,screenPoint,needleRelativeSign:electronMode?-1:1,screenRelativeSign:electronMode?1:-1,fieldDirection:scale(direction,electronMode?-1:1),selectedMarkerMeaning:'Geometric correspondence only; no brightness, probability, or detector response.',sourceApproximation:'Radial needle-to-screen correspondence for the source apparatus; no exact sharp-needle field solution.'};
 if(electronMode)return {...common,particle:{identity:'electron',label:'e−',chargeSign:-1,at:scale(direction,83)},particleForceDirection:[...direction],particlePathDirection:[...direction],imageProperty:'emissivity'};
 const ionized=configuration.eventStage!==0,encounterPoint=scale(direction,g.tipRadius+7),electronOffset=scale([direction[1],-direction[0]],30);
 return {...common,eventStage:configuration.eventStage,ionized,encounterPoint,helium:{identity:ionized?'He+':'He',label:ionized?'He+':'He (neutral)',chargeSign:ionized?1:0,at:configuration.eventStage===2?[...screenPoint]:[...encounterPoint]},removedElectron:ionized?{identity:'electron',label:'removed e−',chargeSign:-1,at:add(encounterPoint,electronOffset),destination:null}:null,netEventCharge:ionized?1-1:0,particleForceDirection:ionized?[...direction]:[0,0],particlePathDirection:ionized?[...direction]:null,conditionalBlurStatement:'Source conditions: smaller wavelength; less thermal smearing when temperature is sufficiently low.'};
}
export const pureModel=molecularEmissionModel;

export const molecularEmissionScope=Object.freeze({
 'induced-molecule':'Initially unpolarized bound-charge schematic. External-field selection mirrors a fixed small authored displacement of the negative center; neutrality persists. Charge centers represent distributed charges. No polarizability, response amplitude, microscopic dynamics, carrier transport or atomic near field.',
 'permanent-water-dipole':'Rigid original bent H–O–H partial-sign schematic. Two illustrative +s weights and one −2s weight preserve neutrality without fitted partial charges. No applied E, bond-angle fit, physical dipole magnitude, molecular field, torque or thermal alignment calculation.',
 'electron-emission':'Original evacuated needle-to-fluorescent-screen geometric correspondence using the source apparatus approximation. Needle is negative relative to screen: E inward, electron force/path outward. One selected marker is not brightness or emission probability. No exact needle field, atomic image, blur law, kinetics or measured magnification.',
 'helium-ion-emission':'Original reversed-polarity helium story schematic. Needle positive relative to screen; a neutral encounter becomes He+ plus one removed e−. E and ion direction outward after ionization. Stages are static authored selections. Electron destination unspecified. Less-blur statement retains the low-temperature source condition. No He++, probability, rate, wavelength calculation, blur synthesis or atomic image.'
});
const sourceHash='17b2ad182d7eff221e983a0250793dc8fc73c97f6f68331726c2bb154af91a79';
export const molecularEmissionSources=Object.freeze({
 'induced-molecule':Object.freeze({unitId:'c6-c04',sourceHash,startItemId:'local-source-item',endItemId:'local-source-item',endExclusive:true,start:Object.freeze({page:77,y:.35586858585858583}),end:Object.freeze({page:77,y:.5219127777777778}),order:'physical page/y',separateVisualContext:'No dedicated induced-atom source figure; original schematic only.'}),
 'permanent-water-dipole':Object.freeze({unitId:'c6-c05',sourceHash,startItemId:'local-source-item',endItemId:'local-source-item',endExclusive:true,start:Object.freeze({page:77,y:.5219127777777778}),end:Object.freeze({page:77,y:.6577675757575757}),order:'physical page/y',separateVisualContext:'Fig.6-2 and caption local-source-item…local-source-item inform signs/geometry; do not enlarge exclusive body bounds.'}),
 'electron-emission':Object.freeze({unitId:'c6-c31',sourceHash,startItemId:'local-source-item',endItemId:'local-source-item',endExclusive:true,start:Object.freeze({page:89,y:.07061227272727263}),end:Object.freeze({page:89,y:.37251126262626266}),order:'physical page/y',separateVisualContext:'Fig.6-16 apparatus; adjacent electron-blur and atomic-image units excluded.'}),
 'helium-ion-emission':Object.freeze({unitId:'c6-c33',sourceHash,startItemId:'local-source-item',endItemId:'local-source-item',endExclusive:true,start:Object.freeze({page:89,y:.493270101010101}),end:Object.freeze({page:89,y:.6593142929292929}),order:'physical page/y',separateVisualContext:'Reversed Fig.6-16 apparatus; subsequent tungsten/ring image excluded.'})
});
export const molecularEmissionEquations=Object.freeze({
 'induced-molecule':Object.freeze({plain:'(+Q) + (−Q) = 0',basis:'Equal opposite schematic total charges; no response law.'}),
 'permanent-water-dipole':Object.freeze({plain:'(+s) + (+s) + (−2s) = 0',basis:'Illustrative relative sign weights, not measured molecular partial charges.'}),
 'electron-emission':Object.freeze({plain:'Electron charge < 0 · E inward · electron force outward',basis:'Charge sign and direction only; source radial apparatus approximation.'}),
 'helium-ion-emission':Object.freeze({plain:'He (neutral) → He+ + e− · 0 = (+e) + (−e)',basis:'Single-electron removal and event charge accounting; no ionization law.'})
});

const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const curve=(id,points,style='reference')=>({id,type:'curve',points,style});
const screen=(v,origin=[185,190])=>[origin[0]+v[0],origin[1]-v[1]];
const fmt=value=>Number(value.toFixed(2)).toString();
function readouts(shapes,rows){rows.forEach((row,i)=>shapes.push(text('value-'+i,466,102+25*i,row)));}
function apparatus(shapes,m){
 const origin=[182,210],S=v=>screen(v,origin),g=molecularEmissionGeometry;
 shapes.push(circle('evacuated-enclosure',origin,g.enclosureRadius),circle('fluorescent-screen',origin,g.screenRadius),text('screen-label',182,78,'Conducting fluorescent screen'),text('vacuum-label',182,339,'Evacuated enclosure'));
 // Upper cap is the selected emitting/encounter surface. The body behind it
 // is shown only as needle context, never as another emitting surface.
 const cap=Array.from({length:41},(_,i)=>{const angle=Math.PI*i/40;return S([g.tipRadius*Math.cos(angle),g.tipRadius*Math.sin(angle)]);});
 shapes.push(curve('tip-cap',cap,'field'),line('needle-left',S([-g.tipRadius,0]),S([-8,-78])),line('needle-right',S([g.tipRadius,0]),S([8,-78])),line('needle-base',S([-8,-78]),S([8,-78])),text('needle-polarity',182,312,m.needleRelativeSign<0?'Needle − (relative)':'Needle + (relative)'));
 for(const angle of [-45,0,45]){const v=ray(angle),r1=m.needleRelativeSign<0?76:48,r2=m.needleRelativeSign<0?48:76;shapes.push(arrow('field-'+angle,S(scale(v,r1)),S(scale(v,r2)),'normal'));}
 shapes.push(line('selected-ray',S(m.tipPoint),S(m.screenPoint)),point('selected-tip-patch',S(m.tipPoint)),circle('selected-screen-marker',S(m.screenPoint),5),arrow('selected-E',S(scale(m.direction,m.needleRelativeSign<0?76:48)),S(scale(m.direction,m.needleRelativeSign<0?48:76)),'normal'));
 return S;
}

export function molecularEmissionDefinition(scene,values={}){
 const m=molecularEmissionModel(scene,values),s=m.configuration,g=molecularEmissionGeometry,shapes=[];let title,context;
 if(scene==='induced-molecule'){
  title='INDUCED SEPARATION · THE WHOLE ATOM STAYS NEUTRAL';
  const S=v=>screen(v),positive=S(m.positiveCenter),negative=S(m.negativeCenter),left=m.fieldDirection[0]>0?105:265,right=m.fieldDirection[0]>0?265:105;
  shapes.push(circle('bound-outline',[185,190],g.boundRadius),circle('negative-cloud-envelope',negative,g.cloudRadius),point('positive-center',positive),point('negative-center',negative),text('positive-center-label',positive[0],positive[1]-17,'Positive center +Q'),text('negative-center-label',negative[0],negative[1]+24,'Negative center −Q'));
  for(const y of [82,104])shapes.push(arrow('external-E-'+y,[left,y],[right,y],'normal',m.fieldPresent));
  shapes.push(text('external-field-label',185,64,m.fieldPresent?'External E: '+(s.fieldConfiguration===1?'right':'left'):'External field absent'),arrow('dipole-direction',[negative[0],279],[positive[0],279],'field',m.fieldPresent),text('dipole-label',185,300,m.fieldPresent?'Dipole direction: negative → positive':'Chosen reference: coincident centers'),text('center-note',185,322,'Centers represent distributed charges'));
  readouts(shapes,['Whole atom: neutral','+Q and −Q remain equal',m.fieldPresent?'Centers: slightly separated':'Centers: coincident',m.fieldPresent?'Negative center opposite E':'No induced separation','Offset: authored, not measured','Bound charge stays in atom','A conductor can move charge','to its surface instead.']);
  context=['Selected field configuration; small offsets are schematic.','No atomic response amplitude or time evolution is calculated.'];
 }else if(scene==='permanent-water-dipole'){
  title='PERMANENT MOLECULAR POLARITY · ZERO TOTAL CHARGE';
  const S=v=>screen(v),R=v=>rotate(v,s.orientation),O=S(m.oxygen),H1=S(m.hydrogen1),H2=S(m.hydrogen2);
  shapes.push(line('bond-guide-1',O,H1),line('bond-guide-2',O,H2),circle('oxygen',O,27),circle('hydrogen-1',H1,18),circle('hydrogen-2',H2,18),text('oxygen-label',O[0],O[1]-12,'O'),text('hydrogen-1-label',H1[0],H1[1]+4,'H'),text('hydrogen-2-label',H2[0],H2[1]+4,'H'));
  for(const [id,v,label]of[['oxygen-partial',[0,43],'δ−'],['hydrogen-1-partial',[-g.waterA,-g.waterB-30],'δ+'],['hydrogen-2-partial',[g.waterA,-g.waterB-30],'δ+']]){const p=S(R(v));shapes.push(text(id,...p,label));}
  shapes.push(point('negative-charge-center',S(m.negativeCenter)),point('positive-charge-center',S(m.positiveCenter)),arrow('polarity-direction',S(R([95,0])),S(R([95,-g.waterB])),'field'),text('polarity-label',185,308,'Polarity direction: O → H side'),text('water-geometry-note',185,328,'Fixed bent drawing; no fitted bond angle'));
  readouts(shapes,['Whole water molecule: neutral','O side: partial negative','H sides: partial positive','Polarity without external E','Orientation: '+fmt(s.orientation)+'°','Weights: −2s, +s, +s','s is illustrative, not fitted','Partial signs are not ions']);
  context=['Rotate the entire sign schematic; permanent polarity persists.','From far away it acts as a dipole; no molecular field is computed.'];
 }else{
  const S=apparatus(shapes,m),direction=m.direction;
  if(scene==='electron-emission'){
   title='ELECTRON EMISSION · E INWARD, ELECTRONS OUTWARD';
   const particle=S(m.particle.at);
   shapes.push(arrow('electron-outward',S(scale(direction,82)),S(scale(direction,103)),'field'),circle('electron-token',particle,4),text('electron-token-label',particle[0]+17,particle[1]+4,'e−'));
   readouts(shapes,['Needle: negative relative','to the fluorescent screen','E points inward (blue)','e− path outward (dark)','Selected ray: '+fmt(s.sourceDirection)+'°','Tip patch ↔ screen marker','Image property: emissivity','Marker encodes no intensity']);
   context=['Radial correspondence is the source apparatus approximation.','Selected ray and marker show geometry, without an emission-rate law.'];
  }else{
   title='HELIUM ION EMISSION · ONE ELECTRON REMOVED';
   const p=S(m.helium.at),perp=[direction[1],-direction[0]],labelAt=S(add(m.helium.at,scale(perp,m.eventStage===2?-30:37)));
   shapes.push(circle('helium-token',p,m.ionized?6:8),text('helium-token-label',labelAt[0],labelAt[1]+4,m.helium.label));
   if(m.ionized){const electron=S(m.removedElectron.at);shapes.push(point('removed-electron',electron),text('removed-electron-label',electron[0]+10,electron[1]+19,'removed e−'),arrow('ion-outward',S(scale(direction,82)),S(scale(direction,103)),'field'));}
   readouts(shapes,['Needle: positive relative','to the fluorescent screen','E points outward (blue)',m.ionized?'He+ path outward (dark)':'He encounter: neutral','Stage '+s.eventStage+': authored selection',m.ionized?'He+ and removed e−: sum 0':'No charged-particle path',m.ionized?'Removed e− destination':'Encounter: selected, not timed',m.ionized?'is not specified here.':'No ionization rate modeled']);
   context=['Source: smaller wavelength; less thermal smearing at low temperature.','Stage selection supplies no elapsed time, probability, or blur image.'];
  }
 }
 const first=molecularEmissionControls(scene)[0],probeScale=220/(first.max-first.min),origin=65-first.min*probeScale;
 shapes.push(text('title',300,29,title),text('track-label',175,358,first.label),line('track',[65,377],[285,377],'axis'),point('probe',[origin+m.state[first.key]*probeScale,377],true),text('equation',300,403,molecularEmissionEquations[scene].plain),text('context',300,423,context[0]),text('context-detail',300,441,context[1]));
 return {schemaVersion:1,scene,label:title,sourceScope:molecularEmissionScope[scene],source:molecularEmissionSources[scene],width:600,height:452,shapes,equations:[],plainEquation:molecularEmissionEquations[scene],probe:{id:'probe',parameter:first.key,origin,scale:probeScale,min:first.min,max:first.max},schematic:true,timeEvolution:false};
}
export function drawMolecularEmission(scene,values={}){
 const d=molecularEmissionDefinition(scene,values);
 return {body:primitivesSVG(d.shapes),metrics:[],label:d.label};
}
export function molecularEmissionChecks(scene){
 const controls=molecularEmissionControls(scene),states=[{...molecularEmissionDefaults[scene]}];
 for(const c of controls)for(const value of c.type==='enum'?Object.keys(c.choices).map(Number):[c.min,c.max])states.push({...molecularEmissionDefaults[scene],[c.key]:value});
 const close=(a,b)=>{if(Math.abs(a-b)>1e-10)throw Error('Schematic geometric invariant failed.');};
 for(const state of states){
  const m=molecularEmissionModel(scene,state),d=molecularEmissionDefinition(scene,state);
  if(scene==='induced-molecule'){close(m.relativeCharges.reduce((a,b)=>a+b,0),0);close(norm(m.dipoleDirection),m.separation);close(m.negativeDisplacement[0],-m.fieldDirection[0]*m.separation);}
  else if(scene==='permanent-water-dipole'){close(m.netRelativeCharge,0);close(norm(m.polarityDirection),molecularEmissionGeometry.waterB);for(const H of [m.hydrogen1,m.hydrogen2])close(norm(H),Math.hypot(molecularEmissionGeometry.waterA,molecularEmissionGeometry.waterB));}
  else{close(norm(m.direction),1);close(norm(m.tipPoint),m.tipRadius);close(norm(m.screenPoint),m.screenRadius);if(scene==='helium-ion-emission')close(m.helium.chargeSign+(m.removedElectron?.chargeSign||0),0);}
  const ids=new Set();for(const p of d.shapes){if(ids.has(p.id))throw Error('Duplicate schematic primitive ID.');ids.add(p.id);const coordinates=p.at?[p.at]:p.points||(p.from?[p.from,p.to]:[]);for(const v of coordinates)if(v.some(x=>!Number.isFinite(x)))throw Error('Nonfinite schematic geometry.');if(p.type==='circle'&&!(p.radius>0))throw Error('Invalid schematic radius.');}
 }
 return {passed:true,states:states.length,method:'Static geometric direction, relative charge bookkeeping, bound controls, and finite original primitives; no microscopic or emission law claimed.'};
}
