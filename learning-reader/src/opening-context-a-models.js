import {primitivesSVG} from './scene-primitives.js';

// Original bounded-source aids. Quantities are either exact geometry or an
// explicitly normalized illustrative family; none fit experimental data.
const freeze = values => Object.freeze(Object.fromEntries(Object.entries(values).map(([key,value])=>[key,Object.freeze(value)])));
export const openingContextADefaults=freeze({
 'electron-self-question':{r:2},
 'area-volume-elements':{r:1,a:.6,b:.8},
 'surface-small-loops':{r:3,a:1},
 'null-law-calibration':{r:2},
 'spectral-energy-difference':{r:.2,a:2},
 'nuclear-evidence-scope':{r:1},
 'coefficient-exponent-separation':{r:1,a:2,b:2}
});
export const openingContextANames=Object.freeze(Object.keys(openingContextADefaults));
const control=(key,label,min,max,step,units='',extra={})=>({key,label,min,max,step,units,...extra});
const choice=(key,label,choices)=>control(key,label,0,choices.length-1,1,'choice',{type:'enum',integer:true,choices:Object.fromEntries(choices.map((value,index)=>[index,value]))});
export function openingContextAControls(scene){
 switch(scene){
  case 'electron-self-question':return [choice('r','Focus: parts / point / open question',['If electron has parts','Point hypothesis','Source leaves question open'])];
  case 'area-volume-elements':return [control('r','Element length dx',.2,2,.05,'length units'),control('a','Element length dy',.2,2,.05,'length units'),control('b','Element length dz',.2,2,.05,'length units')];
  case 'surface-small-loops':return [control('r','Squares per side N',2,6,1,'count',{integer:true}),choice('a','View: loops / shared edges / boundary',['Small oriented loops','Shared-edge pair','Remaining boundary'])];
  case 'null-law-calibration':return [choice('r','Focus: null / field calibration / response',['Null observation','Sensitivity plus geometry','Response versus exponent'])];
  case 'spectral-energy-difference':return [control('r','Gap between drawn levels',.05,.4,.01,'drawing energy units'),control('a','Common level offset',1,4,.05,'drawing energy units')];
  case 'nuclear-evidence-scope':return [choice('r','Focus: atomic / nuclear / shorter',['Atomic context from preceding unit','Nuclear evidence in this unit','Shorter distances outside this unit'])];
  case 'coefficient-exponent-separation':return [control('r','Relative coefficient A',.5,2,.05,'normalized'),control('a','Illustrative exponent p',1.5,2.5,.05),control('b','Probe distance ratio z',.5,4,.05,'r/r0')];
  default:throw Error('Unknown opening context A model.');
 }
}
const sourceHash='17b2ad182d7eff221e983a0250793dc8fc73c97f6f68331726c2bb154af91a79';
const source=(ledgerId,section,startItemId,endItemId,start,end)=>Object.freeze({ledgerId,section,sourceHash,startItemId,endItemId,endExclusive:true,start:Object.freeze(start),end:Object.freeze(end),readingOrder:'physical page/y with equation-line association'});
export const openingContextASources=Object.freeze({
 'electron-self-question':source('1:c06','1-1','local-source-item','local-source-item',{page:21,y:.33540267676767677},{page:21,y:.4869809595959596}),
 'area-volume-elements':source('3:c03','3-2','local-source-item','local-source-item',{page:44,y:.7800731313131313},{page:45,y:.17904282828282828}),
 'surface-small-loops':source('3:c15','3-5','local-source-item','local-source-item',{page:51,y:.04797085858585848},{page:51,y:.21611984848484836}),
 'null-law-calibration':source('5:c5-c20','5-8','local-source-item','local-source-item',{page:72,y:.5159127777777778},{page:72,y:.6668622727272726}),
 'spectral-energy-difference':source('5:c5-c21','5-8','local-source-item','local-source-item',{page:72,y:.6668622727272726},{page:73,y:.1386046969696969}),
 'nuclear-evidence-scope':source('5:c5-c22','5-8','local-source-item','local-source-item',{page:73,y:.1386046969696969},{page:73,y:.22923979797979793}),
 'coefficient-exponent-separation':source('5:c5-c24','5-8','local-source-item','local-source-item',{page:73,y:.455729696969697},{page:73,y:.5010794444444444})
});
export const openingContextAScope=Object.freeze({
 'electron-self-question':'Historical unresolved electron-structure/self-force question. Hypotheses are conditional argument branches, not models of a resolved charged ball or a binding force; no modern resolution asserted.',
 'area-volume-elements':'Exact rectangular area and rectangular-prism volume in generic length units. Finite drawing elements illustrate differential notation; no flux, motion, heat-transfer solver or fixed minimum infinitesimal is implied.',
 'surface-small-loops':'Original flat square grid illustrating consistently oriented small loops and cancellation of shared traversals. No arbitrary curved mesh, curvature error bound, vector field, curl or new circulation value is calculated.',
 'null-law-calibration':'Input-dependency map for a calibrated null experiment. Detector sensitivity, apparatus geometry and response-to-exponent calibration are not supplied numerically, so no new epsilon bound is generated.',
 'spectral-energy-difference':'Two authored schematic energy labels and a magnified gap, in drawing units. DeltaE=hbar omega is source context only; no atomic eigenvalues, emitted frequency, exponent fit, uncertainty or spectrum is computed.',
 'nuclear-evidence-scope':'Source-era qualitative evidence at about 10^-13 cm, converted to 10^-15 m. Atomic-scale evidence is explicitly preceding context. No nuclear precision percentage, present-day claim or conclusion for shorter distances.',
 'coefficient-exponent-separation':'Illustrative dimensionless monomial f(z)=A z^-p at a fixed arbitrary normalization radius. Separates amplitude and shape; no physical coefficient measurement, exponent limit or historical precision fit is calculated.'
});
export const openingContextAEquations=freeze({
 'electron-self-question':{plain:'Source status: unresolved question, not a solved electron model',basis:'Conditional source argument, no numerical physics.'},
 'area-volume-elements':{plain:'da = dx dy · dV = dx dy dz',basis:'Source notation; exact products for authored rectangular elements.'},
 'surface-small-loops':{plain:'Shared traversal + reversed traversal = 0',basis:'Original oriented-edge bookkeeping; no field integral value.'},
 'null-law-calibration':{plain:'Null + sensitivity + geometry + response → a possible bound',basis:'Source dependency statement; all calibration numbers remain unspecified.'},
 'spectral-energy-difference':{plain:'ΔE = ħω · drawn gap = upper label − lower label',basis:'Source photon energy relation; drawing labels are not atomic energies.'},
 'nuclear-evidence-scope':{plain:'10^-13 cm = 10^-15 m · evidence has a distance domain',basis:'Exact unit conversion of source-era approximate distance.'},
 'coefficient-exponent-separation':{plain:'f(z) = A z^(-p) · z = r/r0 · normalized illustrative family',basis:'Original monomial comparison; no experimental calibration.'}
});

export function orientedGridKernel(N){
 if(!Number.isInteger(N)||N<2||N>6)throw Error('Invalid grid subdivision.');
 const cells=[],edgeMap=new Map(),key=point=>point.join(',');
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){
  const vertices=[[i,j],[i+1,j],[i+1,j+1],[i,j+1]],edges=[];
  for(let k=0;k<4;k++){
   const from=vertices[k],to=vertices[(k+1)%4],forward=key(from)<key(to),edgeKey=forward?key(from)+'|'+key(to):key(to)+'|'+key(from);
   const traversal={from,to,sign:forward?1:-1,cell:[i,j]};edges.push(traversal);
   if(!edgeMap.has(edgeKey))edgeMap.set(edgeKey,{key:edgeKey,from:forward?from:to,to:forward?to:from,traversals:[]});
   edgeMap.get(edgeKey).traversals.push(traversal);
  }
  cells.push({i,j,vertices,edges});
 }
 const edges=[...edgeMap.values()].map(edge=>({...edge,netOrientation:edge.traversals.reduce((sum,item)=>sum+item.sign,0),boundary:edge.traversals.length===1}));
 return {N,cells,edges,cellCount:cells.length,sharedEdgeCount:edges.filter(edge=>!edge.boundary).length,boundaryEdgeCount:edges.filter(edge=>edge.boundary).length,orientedTraversalCount:4*N*N,curvedSurfaceConstructed:false};
}
export function normalizedForceFamilyKernel(A,p,z){
 if(![A,p,z].every(Number.isFinite)||A<=0||z<=0)throw Error('Invalid normalized family.');
 return {A,p,z,value:A*z**(-p),baseline:z**(-2),doublingRatio:2**(-p),logSlope:-p,logIntercept:Math.log2(A),valueAt:distance=>{if(!Number.isFinite(distance)||distance<=0)throw Error('Invalid normalized distance.');return A*distance**(-p);}};
}
export function openingContextAModel(scene,values={}){
 if(!openingContextANames.includes(scene))throw Error('Unknown opening context A model.');
 if(!values||typeof values!=='object'||Array.isArray(values))throw Error('Invalid context parameters.');
 const controls=openingContextAControls(scene),allowed=new Set(controls.map(c=>c.key));
 for(const key of Object.keys(values))if(!allowed.has(key))throw Error('Unknown context parameter: '+key);
 const state={...openingContextADefaults[scene],...values};
 for(const c of controls){const value=state[c.key];if(!Number.isFinite(value)||value<c.min||value>c.max||c.integer&&!Number.isInteger(value))throw Error('Invalid context parameter: '+c.key);}
 let result;
 if(scene==='electron-self-question')result={focus:state.r,status:'unresolved in this source',electronHasParts:null,bindingForce:null,selfForcePrescription:null,conditionalBranches:['If charge has parts: why do they remain together?','If point charge: what self-action assumption is made?'],physicalElectronGeometry:false};
 else if(scene==='area-volume-elements')result={dx:state.r,dy:state.a,dz:state.b,area:state.r*state.a,volume:state.r*state.a*state.b,areaDimension:2,volumeDimension:3,units:'generic length units',finiteDrawing:true};
 else if(scene==='surface-small-loops')result={...orientedGridKernel(state.r),focus:state.a,circulationValue:null};
 else if(scene==='null-law-calibration')result={focus:state.r,focusedInput:['null observation','sensitivity plus geometry','response versus exponent'][state.r],allDependencyNodesVisible:true,calibrationValuesProvided:false,observedNull:true,exactZeroEstablished:false,detectionThreshold:null,apparatusResponse:null,exponentBound:null,numericBoundReady:false,historicalResults:'Source reports Maxwell <1/10000; Plimpton–Lawton <1 part per billion.'};
 else if(scene==='spectral-energy-difference')result={lower:state.a,upper:state.a+state.r,gap:state.r,commonOffset:state.a,energyUnits:'authored drawing units',omega:null,atomicEigenvalues:false,exponentBound:null};
 else if(scene==='nuclear-evidence-scope')result={focus:state.r,nuclearSourceCmExponent:-13,nuclearConvertedMExponent:-15,atomicContextMExponent:-10,sourceStatus:'approximately inverse-square; at least to some extent',precisionBound:null,shorterDistanceConclusion:null,currentMeasurementClaim:false};
 else result={...normalizedForceFamilyKernel(state.r,state.a,state.b),physicalCoefficient:null,exponentBound:null,historicalCoefficientComparison:'Source reports consistency within 15 parts per million.'};
 return {...result,state};
}
export const pureModel=openingContextAModel;

const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const fmt=value=>Number(value.toPrecision(4)).toString();
function box(shapes,id,left,top,right,bottom,style='patch'){shapes.push(curve(id,[[left,top],[right,top],[right,bottom],[left,bottom],[left,top]],style));}
function rows(shapes,id,x,y,values,spacing=25){values.forEach((value,index)=>shapes.push(text(id+'-'+index,x,y+index*spacing,value)));}
function electronDiagram(shapes,m){
 box(shapes,'parts-box',35,94,277,257);box(shapes,'point-box',323,94,565,257);
 rows(shapes,'parts',156,119,['CONDITIONAL: HAS PARTS','Same-sign parts would repel.','What holds them together?','Source supplies no binding force.'],33);
 rows(shapes,'point',444,119,['CONDITIONAL: IS A POINT','No parts to separate?','Would it act on itself?','This is a proposed assumption.'],33);
 if(m.focus<2)shapes.push(point('selected-branch',[m.focus===0?156:444,239]));
 shapes.push(arrow('parts-to-question',[156,261],[255,285]),arrow('point-to-question',[444,261],[345,285]));
 rows(shapes,'open',300,306,['Source leaves the question unresolved.','Selecting a hypothesis does not resolve it.'],24);
}
function elementsDiagram(shapes,m){
 const x=55,y=273,w=88*m.dx,h=78*m.dy;
 box(shapes,'area-element',x,y-h,x+w,y,'field');
 shapes.push(text('area-title',156,88,'Two-dimensional element'),text('area-dx',x+w/2,y+20,'dx = '+fmt(m.dx)),text('area-dy',x-17,y-h/2,'dy'),text('area-value',156,319,'da = '+fmt(m.area)+' length units²'));
 const origin=[365,272],u=[68*m.dx,0],v=[0,-58*m.dy],z=[24*m.dz,-29*m.dz],add=(...vs)=>vs.reduce((a,b)=>a.map((value,i)=>value+b[i]),[0,0]);
 const P=(i,j,k)=>add(origin,u.map(value=>value*i),v.map(value=>value*j),z.map(value=>value*k));
 for(let j=0;j<2;j++)for(let k=0;k<2;k++)shapes.push(line('prism-x-'+j+k,P(0,j,k),P(1,j,k),'normal'));
 for(let i=0;i<2;i++)for(let k=0;k<2;k++)shapes.push(line('prism-y-'+i+k,P(i,0,k),P(i,1,k),'normal'));
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)shapes.push(line('prism-z-'+i+j,P(i,j,0),P(i,j,1),'normal'));
 shapes.push(text('volume-title',452,88,'Three-dimensional element'),text('prism-dx',origin[0]+u[0]/2,origin[1]+20,'dx'),text('prism-dy',origin[0]-17,origin[1]+v[1]/2,'dy'),text('prism-dz',origin[0]+u[0]+z[0]/2+15,origin[1]+z[1]/2,'dz'),text('volume-value',452,319,'dV = '+fmt(m.volume)+' length units³'));
}
function gridDiagram(shapes,m){
 const S=([x,y])=>[52+202*x/m.N,288-202*y/m.N];
 for(const edge of m.edges)shapes.push(line('grid-'+edge.key,S(edge.from),S(edge.to),edge.boundary?'normal':'construction'));
 if(m.focus===0)for(const cell of m.cells)for(let k=0;k<4;k++){
  const edge=cell.edges[k],a=S(edge.from),b=S(edge.to),dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),shift=[dy/len*5,-dx/len*5];
  shapes.push(arrow('cell-'+cell.i+'-'+cell.j+'-'+k,a.map((v,i)=>v+.33*[dx,dy][i]+shift[i]),a.map((v,i)=>v+.67*[dx,dy][i]+shift[i])));
 }
 if(m.focus===1){const edge=m.edges.find(edge=>!edge.boundary);for(let k=0;k<2;k++){const t=edge.traversals[k],a=S(t.from),b=S(t.to),d=b.map((v,i)=>v-a[i]),len=Math.hypot(...d),shift=[d[1]/len*7,-d[0]/len*7];shapes.push(arrow('opposite-shared-'+k,a.map((v,i)=>v+.25*d[i]+shift[i]),a.map((v,i)=>v+.75*d[i]+shift[i]),'field'));}}
 if(m.focus===2)for(const edge of m.edges.filter(edge=>edge.boundary)){const t=edge.traversals[0],a=S(t.from),b=S(t.to);shapes.push(arrow('boundary-'+edge.key,a.map((v,i)=>v+.3*(b[i]-v)),a.map((v,i)=>v+.7*(b[i]-v)),'field'));}
 shapes.push(text('grid-label',153,312,'Original flat-grid illustration'));
 rows(shapes,'grid-readout',444,111,[m.cellCount+' local squares',m.sharedEdgeCount+' shared edge pairs',m.boundaryEdgeCount+' outer edge segments','Every shared edge is traversed','in opposite directions.','Only the outer path remains.','No field value is assigned.'],27);
}
function nullDiagram(shapes,m){
 const nodes=[
  {id:'null',bounds:[22,75,187,143],x:104,y:94,spacing:23,rows:['OBSERVED NULL','No detected deflection']},
  {id:'sensitivity',bounds:[22,174,187,263],x:104,y:193,spacing:23,rows:['METER SENSITIVITY','+ GEOMETRY','Detector calibration']},
  {id:'minimum',bounds:[226,100,406,190],x:316,y:119,spacing:24,rows:['FIELD DETECTION LIMIT','Null below this limit','No number supplied']},
  {id:'response',bounds:[218,226,408,309],x:313,y:245,spacing:23,rows:['RESPONSE VS EXPONENT','Apparatus/model input','How E depends on epsilon']},
  {id:'bound',bounds:[438,167,582,283],x:510,y:186,spacing:23,rows:['COMPARE','AND CONSTRAIN','Response vs limit','No bound computed']}
 ];
 for(const n of nodes){box(shapes,n.id+'-box',...n.bounds);rows(shapes,n.id+'-text',n.x,n.y,n.rows,n.spacing);}
 // The detector limit and the response law are separate inputs to comparison.
 // Neither the observed null nor the field limit derives the response model.
 shapes.push(arrow('null-minimum',[187,110],[226,130]),arrow('sensitivity-minimum',[187,217],[226,172]),arrow('minimum-bound',[406,150],[438,194]),arrow('response-bound',[408,267],[438,250]));
 const focus=m.focus===0?[31,83]:m.focus===1?[31,182]:[226,234];shapes.push(point('input-focus',focus));
 shapes.push(text('null-limit',300,330,'A null is below detection; it does not establish exact zero.'));
}
function levelsDiagram(shapes,m){
 const Y=energy=>287-36*energy,low=Y(m.lower),high=Y(m.upper);
 shapes.push(line('energy-axis',[58,300],[58,91],'axis'),line('lower-level',[82,low],[226,low],'normal'),line('upper-level',[82,high],[226,high],'normal'),text('level-overview',152,84,'Schematic common energy scale'),text('lower-value',156,317,'Lower label: '+fmt(m.lower)),text('upper-value',156,337,'Upper label: '+fmt(m.upper)));
 const bottom=293,top=bottom-340*m.gap;
  shapes.push(line('zoom-lower',[359,bottom],[552,bottom],'normal'),line('zoom-upper',[359,top],[552,top],'normal'),arrow('gap-arrow',[390,bottom],[390,top],'field'),text('gap-title',456,84,'Magnified difference'),text('gap-label',456,119,'Gap = '+fmt(m.gap)),text('zoom-zero',456,317,'Lower level is the zoom reference'),text('zoom-scale',456,337,'Common offset does not change gap'));
}
function domainDiagram(shapes,m){
 const X=exponent=>84+430*(exponent+16)/7;
 shapes.push(line('distance-axis',[84,177],[514,177],'axis'),text('distance-title',300,87,'Distance domain of source-era evidence'),text('distance-axis-title',300,203,'Logarithmic distance in meters (authored axis window)'));
 for(const exponent of [-16,-15,-14,-13,-12,-11,-10,-9]){const x=X(exponent);shapes.push(line('distance-tick-'+exponent,[x,171],[x,183]),text('distance-label-'+exponent,x,226,'10^'+exponent));}
 const selected=m.focus===0?X(-10):m.focus===1?X(-15):X(-15.65);
 shapes.push(point('domain-focus',[selected,177]),text('nuclear-marker',X(-15),152,'Nuclear'),text('atomic-marker',X(-10),152,'Atomic context'));
 rows(shapes,'domain-detail',300,269,m.focus===0?['Earlier unit: atomic-scale spectroscopy.','That evidence alone does not establish the nuclear domain.']:m.focus===1?['This unit: about 10^-13 cm = 10^-15 m.','Source says approximately inverse-square, with limited scope.']:['Shorter distances require additional evidence.','This bounded unit supplies no conclusion for them.'],25);
 shapes.push(text('domain-historical',300,329,'Historical source statement; no present-day precision is computed.'));
}
function coefficientDiagram(shapes,m){
 const X=x=>57+248*(x+1)/3,Y=y=>276-166*(y+6)/10;
 shapes.push(line('family-x',[57,276],[305,276],'axis'),line('family-y',[57,110],[57,276],'axis'),text('family-title',179,84,'Amplitude and shape are separate'),text('family-x-label',179,308,'log2 z; z = r/r0'),text('family-y-label',179,102,'log2 f(z)'));
 for(const x of [-1,0,1,2])shapes.push(line('family-x-tick-'+x,[X(x),276],[X(x),280]),text('family-x-number-'+x,X(x),293,String(x)));
 for(const y of [-6,-4,-2,0,2,4])shapes.push(line('family-y-tick-'+y,[53,Y(y)],[57,Y(y)]),text('family-y-number-'+y,41,Y(y)+4,String(y)));
 const sample=fn=>Array.from({length:81},(_,i)=>{const x=-1+3*i/80;return [X(x),Y(fn(x))];});
 shapes.push(curve('baseline-family',sample(x=>-2*x),'gold-curve'),curve('selected-family',sample(x=>m.logIntercept-m.p*x)),point('family-probe',[X(Math.log2(m.z)),Y(Math.log2(m.value))]));
 rows(shapes,'family-readout',458,111,['A = '+fmt(m.A),'p = '+fmt(m.p),'At z = '+fmt(m.z)+': f = '+fmt(m.value),'Slope = −p = '+fmt(-m.p),'f(2z)/f(z) = '+fmt(m.doublingRatio),'A shifts height; p changes slope.','Source coefficient comparison:','15 ppm, a source-era report.'],26);
 shapes.push(text('family-baseline-label',179,331,'Dashed reference: A = 1, p = 2'));
}
export function openingContextADefinition(scene,values={}){
 const m=openingContextAModel(scene,values),shapes=[];
 const titles={'electron-self-question':'ELECTRON STRUCTURE · FOLLOW THE OPEN QUESTION','area-volume-elements':'AREA AND VOLUME · COUNT THE LENGTH FACTORS','surface-small-loops':'SMALL SURFACE LOOPS · SHARED EDGES CANCEL','null-law-calibration':'NULL EXPERIMENT · WHAT MAKES A BOUND POSSIBLE?','spectral-energy-difference':'NEARBY LEVELS · MEASURE THE DIFFERENCE','nuclear-evidence-scope':'EVIDENCE · KEEP ITS DISTANCE DOMAIN','coefficient-exponent-separation':'COEFFICIENT AND EXPONENT · DIFFERENT QUESTIONS'};
 const contexts={
  'electron-self-question':['Conditional hypotheses from the source; no electron shape is drawn.','The source leaves self-force and binding unresolved.'],
  'area-volume-elements':['Finite rectangular drawings illustrate differential notation.','Area has two length factors; volume has three. No heat-flow calculation.'],
  'surface-small-loops':['Flat grid only; the source motivates local flatness on a smooth surface.','Consistent orientation cancels shared traversals; no curl is calculated.'],
  'null-law-calibration':['All calibration values remain unspecified in this aid.','Historical bounds are source reports, not outputs of the selector.'],
  'spectral-energy-difference':['Drawing energy units only: no hydrogen eigenvalues or photon frequency.','Atomic inference needs a quantum calculation; no exponent fit is supplied.'],
  'nuclear-evidence-scope':['Atomic marker is preceding context; nuclear statement belongs to this unit.','No extension to shorter distances or modern accuracy claim.'],
  'coefficient-exponent-separation':['Illustrative normalized family, with a fixed arbitrary reference radius r0.','No force measurement, physical coefficient fit, or exponent precision bound.']
 };
 const draw={ 'electron-self-question':electronDiagram,'area-volume-elements':elementsDiagram,'surface-small-loops':gridDiagram,'null-law-calibration':nullDiagram,'spectral-energy-difference':levelsDiagram,'nuclear-evidence-scope':domainDiagram,'coefficient-exponent-separation':coefficientDiagram};
 draw[scene](shapes,m);
 const first=openingContextAControls(scene)[0],scale=220/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(text('title',300,30,titles[scene]),text('track-label',175,360,first.label),line('track',[65,377],[285,377],'axis'),point('probe',[origin+m.state[first.key]*scale,377],true),text('equation',300,402,openingContextAEquations[scene].plain),text('context',300,425,contexts[scene][0]),text('context-detail',300,443,contexts[scene][1]));
 return {schemaVersion:1,scene,label:titles[scene],sourceScope:openingContextAScope[scene],source:openingContextASources[scene],width:600,height:452,shapes,equations:[],plainEquation:openingContextAEquations[scene],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max},schematic:true,timeEvolution:false};
}
export function drawOpeningContextA(scene,values={}){const d=openingContextADefinition(scene,values);return {body:primitivesSVG(d.shapes),metrics:[],label:d.label};}
export function openingContextAChecks(scene){
 const states=[{...openingContextADefaults[scene]}];
 for(const c of openingContextAControls(scene))for(const value of c.type==='enum'?Object.keys(c.choices).map(Number):[c.min,c.max])states.push({...openingContextADefaults[scene],[c.key]:value});
 for(const state of states){const m=openingContextAModel(scene,state),d=openingContextADefinition(scene,state),ids=new Set();
  if(scene==='surface-small-loops'&&m.edges.some(edge=>!edge.boundary&&edge.netOrientation!==0))throw Error('Shared edge did not cancel.');
  for(const shape of d.shapes){if(ids.has(shape.id))throw Error('Duplicate context primitive.');ids.add(shape.id);const coordinates=shape.at?[shape.at]:shape.points||(shape.from?[shape.from,shape.to]:[]);for(const coordinate of coordinates)if(coordinate.some(value=>!Number.isFinite(value)))throw Error('Nonfinite context geometry.');}
 }
 return {passed:true,states:states.length,method:'Finite bounded original geometry and oriented-edge accounting; physical calibration and atomic inference are not computed.'};
}
export const openingContextAAdapter=Object.freeze({names:openingContextANames,defaults:openingContextADefaults,controls:openingContextAControls,model:openingContextAModel,definition:openingContextADefinition,draw:drawOpeningContextA,checks:openingContextAChecks});
