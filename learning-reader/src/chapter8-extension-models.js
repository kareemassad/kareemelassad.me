import {EPS0,K,NC} from './physics.js';
import {energyModel} from './energy-models.js';
import {primitivesSVG} from './scene-primitives.js';

// Original standalone kernels. Nothing registers or accepts these source aids.
const finite=(x,name)=>{if(!Number.isFinite(x))throw RangeError('Finite '+name+' required.');return x;};
const positive=(x,name)=>{finite(x,name);if(x<=0)throw RangeError('Positive '+name+' required.');return x;};
const fraction=x=>{finite(x,'charge fraction');if(x<0||x>1)throw RangeError('Charge fraction must be in [0,1].');return x;};
const position=p=>{if(!Array.isArray(p)||p.length!==3||p.some(x=>!Number.isFinite(x)))throw RangeError('Finite3D source positions required.');return p;};
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));

export function pairInteractionKernel(charges){
 if(!Array.isArray(charges)||charges.length<1||charges.length>64)throw RangeError('Use1–64 prescribed charge sites.');
 const sites=charges.map((c,i)=>({q:finite(c.q,'charge'),p:[...position(c.p)],label:c.label??String(i+1)}));
 const orderedEnergy=sites.map(()=>sites.map(()=>null)),potentials=sites.map(()=>0),pairs=[];
 for(let i=0;i<sites.length;i++)for(let j=i+1;j<sites.length;j++){
  const r=positive(distance(sites[i].p,sites[j].p),'pair separation'),energy=K*sites[i].q*sites[j].q/r;
  pairs.push({i,j,r,energy});orderedEnergy[i][j]=energy;orderedEnergy[j][i]=energy;
  potentials[i]+=K*sites[j].q/r;potentials[j]+=K*sites[i].q/r;
 }
 const U=pairs.reduce((s,p)=>s+p.energy,0),siteProducts=sites.map((c,i)=>c.q*potentials[i]);
 const assemblyForOrder=order=>{
  if(!Array.isArray(order)||order.length!==sites.length||new Set(order).size!==sites.length||order.some(i=>!Number.isInteger(i)||i<0||i>=sites.length))throw RangeError('Assembly order must be a complete site permutation.');
  const added=[],steps=[];for(const i of order){let work=0;for(const j of added)work+=K*sites[i].q*sites[j].q/distance(sites[i].p,sites[j].p);steps.push({site:i,work});added.push(i);}return {steps,total:steps.reduce((s,v)=>s+v.work,0)};
 };
 return {sites,pairs,orderedEnergy,potentials,siteProducts,U,directedEnergy:siteProducts.reduce((s,v)=>s+v,0),pairCount:pairs.length,
  assemblyForOrder,assembly:assemblyForOrder(sites.map((_,i)=>i)),selfEnergyIncluded:false,reference:'Zero mutual energy at infinite separation; point self energies excluded.'};
}

export function matchedSphereEnergyKernel({QnC,R,probeRatio=.5}){
 finite(QnC,'charge in nC');positive(R,'radius');finite(probeRatio,'probe ratio');
 if(Math.abs(QnC)>5||R<.5||R>2||probeRatio<0||probeRatio>3)throw RangeError('Matched sphere parameters outside bounded domain.');
 const Q=QnC*NC,completedSolid=energyModel('sphere-assembly-energy',{r:1,q:Math.abs(QnC),a:R});
 const solidEnergy=completedSolid.finalU,shellEnergy=K*Q*Q/(2*R),insideFieldEnergy=completedSolid.insideFieldEnergy,outsideFieldEnergy=completedSolid.outsideFieldEnergy;
 const atRadius=r=>{
  finite(r,'radial distance');if(r<0)throw RangeError('Nonnegative radial distance required.');
  const x=r/R,solidPotential=x<=1?K*Q*(3-x*x)/(2*R):K*Q/r,shellPotential=x<=1?K*Q/R:K*Q/r;
  const solidField=x<=1?K*Q*x/R**2:K*Q/r**2,shellField=x<1?0:x>1?K*Q/r**2:null;
  return {r,ratio:x,solidPotential,shellPotential,solidField,shellField,shellSurface:x===1};
 };
 const probe=atRadius(probeRatio*R);
 return {Q,R,probeRatio,probe,C:R/K,surfacePotential:K*Q/R,solidEnergy,shellEnergy,energyDifference:solidEnergy-shellEnergy,
  solidInsideFieldEnergy:insideFieldEnergy,solidOutsideFieldEnergy:outsideFieldEnergy,shellInsideFieldEnergy:0,shellOutsideFieldEnergy:shellEnergy,
  energyRatio:Q===0?null:shellEnergy/solidEnergy,coefficientRatio:5/6,rho:3*Q/(4*Math.PI*R**3),sigma:Q/(4*Math.PI*R**2),
  shellBoundaryFields:{inside:0,outside:K*Q/R**2},atRadius,reusedKernel:'sphere-assembly-energy at completed fixed-density assembly; same Q and outer R.'};
}

export function surfaceAverageFieldKernel({Q,A,f=.5}){
 finite(Q,'signed plate charge');positive(A,'plate area');fraction(f);
 const sigma=Q/A,E0=sigma/EPS0,Eaverage=E0/2,pressure=sigma*Eaverage,force=Q*Eaverage;
 const fieldAtFraction=x=>{fraction(x);return {total:E0*x,self:E0*(x-.5),other:Eaverage};};
 const forceToFraction=x=>{fraction(x);return {total:Q*E0*x*x/2,self:Q*E0*(x*x-x)/2,other:Q*Eaverage*x};};
 return {Q,A,f,sigma,E0,Eaverage,pressure,force,forceOnLeft:force,forceOnRight:-force,naiveFullGapForce:Q*E0,
  localFields:fieldAtFraction(f),partialForce:forceToFraction(f),fieldAtFraction,forceToFraction,coordinateDefined:Q!==0,
  coordinate:'Cumulative signed layer-charge fraction f; not geometric depth or elapsed time.',surfaceThickness:null};
}

export function capacitorSourceWorkKernel({A,d0,d,mode='fixed-voltage',Q0,V0}){
 positive(A,'plate area');positive(d0,'reference gap');positive(d,'current gap');
 if(!['fixed-charge','fixed-voltage'].includes(mode))throw RangeError('Invalid capacitor constraint.');
 const C0=EPS0*A/d0;
 if(Q0===undefined&&V0===undefined)throw RangeError('Reference charge or voltage required.');
 if(Q0!==undefined)finite(Q0,'reference charge');if(V0!==undefined)finite(V0,'source voltage');
 if(Q0!==undefined&&V0!==undefined&&Math.abs(Q0-C0*V0)>1e-25+1e-12*Math.max(Math.abs(Q0),Math.abs(C0*V0)))throw RangeError('Conflicting reference charge and voltage.');
 const initialQ=Q0??C0*V0,initialV=V0??initialQ/C0,U0=initialQ*initialQ/(2*C0);
 const stateAtGap=gap=>{positive(gap,'gap');const C=EPS0*A/gap,Q=mode==='fixed-charge'?initialQ:C*initialV,V=Q/C,U=Q*Q/(2*C);return {d:gap,C,Q,V,U};};
 const workAtGap=gap=>{const s=stateAtGap(gap),deltaQ=s.Q-initialQ,deltaU=s.U-U0,sourceWork=mode==='fixed-voltage'?initialV*deltaQ:0;return {...s,deltaQ,deltaU,sourceWork,externalWork:deltaU-sourceWork};};
 const forceAtGap=gap=>{const s=stateAtGap(gap);return s.Q*s.Q/(2*EPS0*A);};
 const current=workAtGap(d),externalForce=forceAtGap(d),electricForce=-externalForce;
 return {...current,A,d0,C0,Q0:initialQ,V0:initialV,U0,mode,E:current.V/d,externalForce,electricForce,
  sourceEnergyChange:-current.sourceWork,fieldOnlyGradient:mode==='fixed-voltage'?-externalForce:externalForce,
  effectiveMechanicalPotential:mode==='fixed-voltage'?current.U-current.V*current.Q:current.U,
  stateAtGap,workAtGap,forceAtGap,quasistatic:true,fringeCorrection:null,workConvention:'Positive source work enters capacitor; external work equals field change minus source work. Electric force points toward smaller d.'};
}

export const chapter8ExtensionDefaults=Object.freeze({
 'charge-pair-energy':Object.freeze({r:1,q:1,a:1,b:1,n:3}),
 'shell-solid-energy':Object.freeze({r:.5,q:1,a:1}),
 'surface-charge-average-field':Object.freeze({r:.5,q:2,a:2}),
 'capacitor-source-work':Object.freeze({r:.7,q:2,a:2,b:.5,n:1})
});
export const chapter8ExtensionNames=Object.freeze(Object.keys(chapter8ExtensionDefaults));
const control=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export function chapter8ExtensionControls(scene){
 if(scene==='charge-pair-energy')return [control('r','Base separation R',.5,2,.05,'m'),control('q','Positive charge scale q',.5,2,.05,'nC'),control('a','Site B negative-charge magnitude / q',.5,2,.05),control('b','Site C positive-charge magnitude / q',.5,2,.05),control('n','Assembled sites (A, then B, then C)',1,3,1)];
 if(scene==='shell-solid-energy')return [control('r','Probe radius / common outer radius',0,3,.05),control('q','Same signed total charge Q',-5,5,.25,'nC'),control('a','Same outer radius R',.5,2,.05,'m')];
 if(scene==='surface-charge-average-field')return [control('r','Cumulative layer-charge fraction f',0,1,.02),control('q','Signed left-plate charge Q',-5,5,.25,'pC'),control('a','Plate area A',1,4,.1,'cm²')];
 if(scene==='capacitor-source-work')return [control('r','Current plate gap d',.1,1,.02,'mm'),control('q','Reference charge Q0',0,5,.1,'pC'),control('a','Plate area A',1,4,.1,'cm²'),control('b','Reference gap d0',.1,1,.02,'mm'),control('n','Constraint: 0 fixed charge · 1 fixed voltage',0,1,1)];
 throw Error('Unknown Chapter8 extension model.');
}
export function chapter8ExtensionModel(scene,values={}){
 if(!chapter8ExtensionNames.includes(scene))throw Error('Unknown Chapter8 extension model.');
 const s={...chapter8ExtensionDefaults[scene],...values};for(const c of chapter8ExtensionControls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max)throw RangeError('Invalid Chapter8 parameter: '+c.key);
 if(['charge-pair-energy','capacitor-source-work'].includes(scene)&&!Number.isInteger(s.n))throw RangeError('Discrete Chapter8 control must be an integer.');
 let m;if(scene==='charge-pair-energy'){
  const allSites=[{q:s.q*NC,p:[0,0,0],label:'A'},{q:-s.a*s.q*NC,p:[s.r,0,0],label:'B'},{q:s.b*s.q*NC,p:[.25*s.r,.75*s.r,0],label:'C'}];
  m={...pairInteractionKernel(allSites.slice(0,s.n)),allSites,R:s.r};
 }else if(scene==='shell-solid-energy')m=matchedSphereEnergyKernel({QnC:s.q,R:s.a,probeRatio:s.r});
 else if(scene==='surface-charge-average-field')m=surfaceAverageFieldKernel({Q:s.q*1e-12,A:s.a*1e-4,f:s.r});
 else m=capacitorSourceWorkKernel({A:s.a*1e-4,d0:s.b*1e-3,d:s.r*1e-3,Q0:s.q*1e-12,mode:s.n?'fixed-voltage':'fixed-charge'});
 return {...m,state:s};
}

const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const fmt=x=>x===0?'0':Number(x.toPrecision(4)).toString();
const sci=x=>x===0?'0':x.toExponential(3);
const readouts=(shapes,values)=>values.forEach((value,i)=>shapes.push(text('value-'+i,454,90+27*i,value)));
export const chapter8ExtensionScope=Object.freeze({
 'charge-pair-energy':'Original finite planar three-site example in3D vacuum; signed Coulomb mutual energy, zero at infinity, self diagonal excluded. Each unordered pair once; directed products twice. Assembly is quasistatic bookkeeping, not physical motion. No continuous charge or nuclear inference.',
 'shell-solid-energy':'Matched signed total Q and outer R. Isolated thin conducting shell versus prescribed uniform volume charge. The solid is not a conductor. Reuses completed sphere-assembly-energy. Fields have a shell jump; exact shell surface field is excluded with one-sided values. No dynamics, equilibrium stability or point-charge limit.',
 'surface-charge-average-field':'Local planar vacuum conductor with Einside=0 and opposite plate charge. f is cumulative charge fraction, not spatial depth/time. Fields and signed components are calculated; thickness is schematic and uncomputed. Average/external field E0/2 gives attraction; own full-layer force cancels. Formal f at Q=0.',
 'capacitor-source-work':'Ideal vacuum parallel plates, quasistatic reversible changes, no fringing or dissipation; d/sqrt(A)<=0.1. Fixed-Q or ideal fixed-V source. Q0 at d0 defines V0 in both comparisons. Exact finite work ledger; force is an instantaneous derivative with explicitly labelled external/electric signs. No arbitrary geometry solver.'
});
export function chapter8ExtensionDefinition(scene,values={}){
 const m=chapter8ExtensionModel(scene,values),s=m.state,shapes=[];let title,context;
 if(scene==='charge-pair-energy'){
  title='PAIR ENERGY · ONCE PER UNORDERED PAIR';context='Each pair appears twice in the matrix · self diagonal excluded';
  const xy=p=>[75+150*p[0]/m.R,181-150*p[1]/m.R];
  for(const pair of m.pairs)shapes.push(line('pair-'+pair.i+'-'+pair.j,xy(m.sites[pair.i].p),xy(m.sites[pair.j].p)));
  for(const [i,c]of m.allSites.entries()){const p=xy(c.p);shapes.push(circle('site-'+i,p,8));if(i<s.n)shapes.push(point('added-'+i,p));shapes.push(text('site-label-'+i,p[0],i===2?p[1]-18:p[1]+24,c.label+': '+(i<s.n?fmt(c.q/NC)+' nC':'not added')));}
  shapes.push(text('matrix-title',180,231,'Ordered pair contributions (nJ)'));
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)shapes.push(text('matrix-'+i+'-'+j,80+100*j,256+25*i,i>=s.n||j>=s.n?'—':i===j?'self excluded':fmt(m.orderedEnergy[i][j]*1e9)));
  shapes.push(text('matrix-key',180,333,'Rows/columns: A, B, C · same pair in both directions'));
  readouts(shapes,['Assembled sites: '+s.n,'Unordered pairs: '+m.pairCount,'Mutual U: '+fmt(m.U*1e9)+' nJ','Directed sum: '+fmt(m.directedEnergy*1e9)+' nJ','½ directed sum: '+fmt(m.directedEnergy*5e8)+' nJ',...m.assembly.steps.map(v=>'Add '+m.sites[v.site].label+': '+fmt(v.work*1e9)+' nJ'),'Negative U is permitted']);
 }else if(scene==='shell-solid-energy'){
  title='SAME CHARGE, SAME RADIUS · SHELL VERSUS SOLID';context='Matched physical R and Q · shell surface is one-sided · solid is prescribed volume charge';
  for(const [i,x]of [100,270].entries()){
   shapes.push(circle('sphere-'+i,[x,127],47),text('kind-'+i,x,61,i?'Uniform solid':'Conducting shell'));
   for(let j=0;j<12;j++){const theta=2*Math.PI*j/12,p=[x+47*Math.cos(theta),127+47*Math.sin(theta)];if(i===0&&m.Q!==0)shapes.push(circle('surface-charge-'+j,p,2));}
   if(i===1&&m.Q!==0)for(const [j,p]of [[-23,-18],[0,-25],[23,-18],[-23,7],[0,0],[23,7],[-10,25],[13,25]].entries())shapes.push(circle('volume-charge-'+j,[x+p[0],127+p[1]],2));
   if(s.r<=1)shapes.push(point('sphere-probe-'+i,[x+47*s.r,127]));
   shapes.push(text('radius-'+i,x,190,'Common R = '+fmt(m.R)+' m'));
  }
  const X=x=>55+260*x/3,Y=y=>318-82*y;
  shapes.push(line('radial-x',[55,318],[315,318],'axis'),line('radial-y',[55,236],[55,318],'axis'),text('radial-title',180,215,m.Q?'Magnitude profile |E| / (K|Q|/R²)':'Reference profiles for nonzero Q'),text('radial-one',55,235,'1'),text('radial-zero',55,336,'0'),text('radial-three',315,336,'3'),line('outer-radius',[X(1),236],[X(1),318],'reference'));
  shapes.push(curve('solid-field',Array.from({length:121},(_,j)=>{const x=j/40;return [X(x),Y(x<=1?x:1/x**2)];})),curve('shell-inside',[[X(0),Y(0)],[X(1),Y(0)]],'gold-curve'),curve('shell-outside',Array.from({length:81},(_,j)=>{const x=1+j/40;return [X(x),Y(1/x**2)];}),'gold-curve'));
  shapes.push(point('radial-solid-probe',[X(s.r),Y(s.r<=1?s.r:1/s.r**2)]));
  if(s.r!==1)shapes.push(point('radial-shell-probe',[X(s.r),Y(s.r<1?0:1/s.r**2)]));
  shapes.push(text('radial-key',185,348,'Blue solid · gold shell · x = radial distance/R'));
  readouts(shapes,['Same Q: '+fmt(m.Q/NC)+' nC','Solid U: '+fmt(m.solidEnergy*1e9)+' nJ','Shell U: '+fmt(m.shellEnergy*1e9)+' nJ','Difference: '+fmt(m.energyDifference*1e9)+' nJ',m.energyRatio===null?'Q=0: numeric ratio undefined':'Shell/solid: '+fmt(m.energyRatio)+' = 5/6','Solid interior U: '+fmt(m.solidInsideFieldEnergy*1e9)+' nJ','Both exterior U: '+fmt(m.solidOutsideFieldEnergy*1e9)+' nJ','Probe solid E: '+fmt(m.probe.solidField)+' V/m',m.probe.shellSurface?'Shell surface: 0 / '+fmt(m.shellBoundaryFields.outside)+' V/m':'Probe shell E: '+fmt(m.probe.shellField)+' V/m']);
 }else if(scene==='surface-charge-average-field'){
  title='SURFACE FORCE · AVERAGE FIELD, SELF FIELD EXCLUDED';context='f counts accumulated charge · drawn layer thickness is schematic · arrows show direction';
  shapes.push(curve('conductor',[[65,80],[133,80],[133,176],[65,176],[65,80]],'reference'),line('layer-inner',[133,80],[133,176],'axis'),line('layer-outer',[150,80],[150,176],'axis'),text('inside-label',95,63,'Conductor: E = 0'),text('gap-label',240,63,'Gap: E0 = σ/ε0'),text('layer-label',140,195,'Thin charge layer'));
  shapes.push(arrow('gap-field',[220,122],[220+45*Math.sign(m.E0),122],'normal',m.Q!==0),arrow('left-attraction',[141,155],[188,155],'sample-field',m.Q!==0));
  const X=f=>55+260*f,Y=e=>305-65*e;
  shapes.push(line('f-x',[55,305],[315,305],'axis'),line('f-y',[55,236],[55,338],'axis'),text('field-title',180,221,m.Q?'Normal E/E0 versus cumulative charge fraction':'Reference profile for nonzero charge'),text('f-zero',55,354,'0'),text('f-one',315,354,'1'),text('e-one',30,244,'1'),text('e-half',28,277,'½'),text('e-minus',28,338,'−½'));
  shapes.push(curve('total-field',[[X(0),Y(0)],[X(1),Y(1)]]),curve('self-field',[[X(0),Y(-.5)],[X(1),Y(.5)]],'gold-curve'),curve('other-field',[[X(0),Y(.5)],[X(1),Y(.5)]],'reference'),point('field-probe',[X(s.r),Y(s.r)]),text('field-key',180,343,'Blue total · gold self · gray other plate'));
  readouts(shapes,['σ: '+sci(m.sigma)+' C/m²','Gap E0: '+fmt(m.E0)+' V/m','Average E: '+fmt(m.Eaverage)+' V/m','Pressure: '+sci(m.pressure)+' Pa','Actual attraction: '+fmt(m.force*1e9)+' nN','Using Q E0: '+fmt(m.naiveFullGapForce*1e9)+' nN','Partial force: '+fmt(m.partialForce.total*1e9)+' nN','Whole-layer self force: 0',m.coordinateDefined?'f is charge fraction, not depth':'Q=0: f is a formal coordinate']);
 }else{
  title='CAPACITOR + SOURCE · REVERSIBLE WORK ACCOUNTING';context='Positive source work enters capacitor · ΔU = Wsource + Wexternal';
  const gap=55+35*s.r,left=95,right=left+gap;
  shapes.push(line('left-plate',[left,98],[left,177],'axis'),line('right-plate',[right,98],[right,177],'axis'),text('left-sign',left,193,'+Q'),text('right-sign',right,193,'−Q'),text('constraint',185,55,m.mode==='fixed-voltage'?'Ideal source holds V fixed':'Isolated capacitor holds Q fixed'),arrow('electric-attraction',[right,123],[right-24,123],'normal',m.Q!==0),text('electric-label',right-13,114,'Fe'),arrow('external-balance',[right,154],[right+24,154],'sample-field',m.Q!==0),text('external-label',right+24,145,'Fext'));
  if(m.mode==='fixed-voltage')shapes.push(curve('source-wire',[[left,98],[left,73],[285,73],[285,177],[right,177]],'reference'),line('source-terminal-1',[276,100],[294,100],'axis'),line('source-terminal-2',[280,109],[290,109],'axis'),text('source-label',286,133,'V0'),text('charge-transfer-label',215,92,m.deltaQ===0?'No net charge transfer':'Positive charge flow'),arrow('charge-transfer',m.deltaQ>=0?[239,73]:[172,73],m.deltaQ>=0?[172,73]:[239,73],'sample-field',m.deltaQ!==0));
  const max=Math.max(Math.abs(m.deltaU),Math.abs(m.sourceWork),Math.abs(m.externalWork),1e-30),X=value=>145+70*value/max;
  shapes.push(text('work-title',180,222,'Signed work ledger · zero at vertical line'),line('work-zero',[145,236],[145,327],'axis'),text('work-zero-value',145,342,'0'));
  for(const [i,label,value]of [[0,'ΔU',m.deltaU],[1,'Source',m.sourceWork],[2,'External',m.externalWork]])shapes.push(text('work-key-'+i,40,257+29*i,label),line('work-bar-'+i,[145,253+29*i],[X(value),253+29*i],'axis'),point('work-value-'+i,[X(value),253+29*i]));
  readouts(shapes,['Constraint: '+m.mode,'V0: '+fmt(m.V0)+' V','Current Q: '+fmt(m.Q*1e12)+' pC','ΔU field: '+fmt(m.deltaU*1e12)+' pJ','Source work: '+fmt(m.sourceWork*1e12)+' pJ','External work: '+fmt(m.externalWork*1e12)+' pJ','Electric Fd: '+fmt(m.electricForce*1e9)+' nN','External Fd: '+fmt(m.externalForce*1e9)+' nN','Field-only derivative: '+fmt(m.fieldOnlyGradient*1e9)+' nN']);
 }
 const first=chapter8ExtensionControls(scene)[0],scale=220/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(text('title',300,29,title),line('track',[65,372],[285,372],'axis'),point('probe',[origin+s[first.key]*scale,372],true),text('track-label',175,393,first.label+(first.units?' ('+first.units+')':'')),text('context',300,438,context),text('hint',300,460,'Drag the black point · Arrow keys change the first control'));
 return {schemaVersion:1,scene,label:title,sourceScope:chapter8ExtensionScope[scene],width:600,height:472,shapes,equations:[{id:scene,x:300,y:415}],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export const chapter8ExtensionEquations=Object.freeze({
 'charge-pair-energy':{plain:'U = Σ(i<j) K qi qj/rij = ½ Σi qi φother(i)',tex:String.raw`U=\sum_{i<j}\frac{Kq_iq_j}{r_{ij}}=\frac12\sum_iq_i\phi_{\rm other}(i)`},
 'shell-solid-energy':{plain:'Ushell = KQ²/(2R) · Usolid = 3KQ²/(5R) · coefficient ratio = 5/6',tex:String.raw`U_{\rm shell}=\frac{KQ^2}{2R}\quad U_{\rm solid}=\frac{3KQ^2}{5R}\quad\frac{1/2}{3/5}=\frac56`},
 'surface-charge-average-field':{plain:'F = ½Q E0 · E(f) = E0 f · whole-layer self force = 0',tex:String.raw`F=QE_{\rm average}=\frac12QE_0\quad E(f)=E_0f\quad\int dF_{\rm self}=0`},
 'capacitor-source-work':{plain:'ΔU = Wsource + Wexternal · fixed V: Wsource = V²ΔC · fixed Q: Wsource = 0',tex:String.raw`\Delta U=W_{\rm source}+W_{\rm external}\quad\left.W_{\rm source}\right|_{V\ {\rm fixed}}=V^2\Delta C\quad\left.W_{\rm source}\right|_{Q\ {\rm fixed}}=0`}
});
export function drawChapter8Extension(scene,values={}){const d=chapter8ExtensionDefinition(scene,values);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,415,chapter8ExtensionEquations[scene].plain)]),metrics:[],label:d.label};}
export function chapter8ExtensionChecks(scene){
 const states=[chapter8ExtensionDefaults[scene]];for(const c of chapter8ExtensionControls(scene))for(const v of [c.min,c.max])states.push({...chapter8ExtensionDefaults[scene],[c.key]:v});
 const close=(a,b)=>{if(Math.abs(a-b)>1e-24+1e-10*Math.max(Math.abs(a),Math.abs(b)))throw Error('Chapter8 invariant failed.');};
 for(const s of states){const m=chapter8ExtensionModel(scene,s);
  if(scene==='charge-pair-energy'){close(m.directedEnergy,2*m.U);close(m.assembly.total,m.U);if(m.pairCount!==s.n*(s.n-1)/2)throw Error('Pair count failed.');}
  if(scene==='shell-solid-energy'){close(m.solidEnergy,m.solidInsideFieldEnergy+m.solidOutsideFieldEnergy);close(m.shellEnergy,m.shellOutsideFieldEnergy);if(m.energyRatio!==null)close(m.energyRatio,5/6);}
  if(scene==='surface-charge-average-field'){close(m.force,m.Q*m.Eaverage);close(m.partialForce.total,m.partialForce.self+m.partialForce.other);close(m.forceToFraction(1).self,0);}
  if(scene==='capacitor-source-work'){close(m.deltaU,m.sourceWork+m.externalWork);close(m.electricForce,-m.externalForce);if(m.fringeCorrection!==null)throw Error('Unvalidated fringe correction.');}
  for(const shape of chapter8ExtensionDefinition(scene,s).shapes){if(shape.type==='text'&&/NaN|Infinity/.test(shape.text))throw Error('Nonfinite Chapter8 text.');for(const p of [shape.at,shape.from,shape.to,...(shape.points||[])])if(p?.some(v=>!Number.isFinite(v)))throw Error('Nonfinite Chapter8 geometry.');}
 }
 return {passed:true,states:states.length,method:'Bounded endpoint invariants and finite original geometry; independent numeric fixtures and quadrature are tested separately. No source acceptance inferred.'};
}
