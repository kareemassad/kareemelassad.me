import {EPS0,K,NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

// Standalone source-bound kernels. Registration and prepared source attachments
// are intentionally separate work; no current reader imports this module.
const controls={
 'dipole-displacement':[
  ['R','Observer distance',.5,2,.05,'m'],['q','Positive charge magnitude',.5,2,.05,'nC'],
  ['eta','Separation / observer distance',.02,.4,.01,''],['theta','Observer angle from displacement axis',0,180,1,'°']
 ],
 'conductor-trial-residual':[
  ['R','Trial sphere radius',.5,2,.05,'m'],['Q','Prescribed total charge',.5,2,.05,'nC'],['alpha','Trial anisotropy',-.9,.9,.05,'']
 ],
 'two-sphere-images':[
  ['a','Common sphere radius',.5,2,.05,'m'],['ratio','Center separation / radius',2.5,6,.05,''],
  ['Q','Opposite total charge magnitude',.5,2,.05,'nC'],['N','Reflection depth (0 = centers only)',0,16,1,'']
 ],
 'plate-fringing-sketch':[
  ['width','Square plate width for ideal baseline',.05,.2,.005,'m'],['eta','Gap / width for ideal baseline',.01,.1,.005,''],
  ['V','Voltage for ideal baseline',.5,2,.05,'V']
 ]
};
export const conductorExtensionKernelDefaults=Object.freeze({
 'dipole-displacement':Object.freeze({R:1,q:1,eta:.2,theta:60}),
 'conductor-trial-residual':Object.freeze({R:1,Q:1,alpha:.6}),
 'two-sphere-images':Object.freeze({a:1,ratio:3,Q:1,N:4}),
 'plate-fringing-sketch':Object.freeze({width:.1,eta:.02,V:1,view:'qualitative edge sketch'})
});
export const conductorExtensionNames=Object.freeze(Object.keys(conductorExtensionKernelDefaults));
export const conductorExtensionParameterMap=Object.freeze({
 'dipole-displacement':Object.freeze({r:'R',q:'q',a:'eta',b:'theta'}),
 'conductor-trial-residual':Object.freeze({r:'R',q:'Q',a:'alpha'}),
 'two-sphere-images':Object.freeze({r:'ratio',a:'a',q:'Q',n:'N'}),
 'plate-fringing-sketch':Object.freeze({r:'width',a:'eta',q:'V',n:'view'})
});
export const conductorExtensionDefaults=Object.freeze({
 'dipole-displacement':Object.freeze({r:1,q:1,a:.2,b:60}),
 'conductor-trial-residual':Object.freeze({r:1,q:1,a:.6}),
 'two-sphere-images':Object.freeze({r:3,a:1,q:1,n:4}),
 'plate-fringing-sketch':Object.freeze({r:.1,a:.02,q:1,n:1})
});
export function conductorExtensionControls(scene){
 if(!conductorExtensionNames.includes(scene))throw Error('Unknown conductor extension model.');
 const map=conductorExtensionParameterMap[scene];
 const out=controls[scene].map(([sourceKey,label,min,max,step,units])=>({key:Object.keys(map).find(key=>map[key]===sourceKey),label,min,max,step,units}));
 if(scene==='plate-fringing-sketch')out.push({key:'n',label:'View: 0 ideal · 1 qualitative edge sketch',min:0,max:1,step:1,units:''});
 return out;
}
const vec=p=>{if(!Array.isArray(p)||p.length!==3||p.some(x=>!Number.isFinite(x)))throw RangeError('A finite three-dimensional position is required.');return p;};
const length=p=>Math.hypot(...p);
const subtract=(a,b)=>a.map((x,i)=>x-b[i]);
const pointPotential=(q,P,S=[0,0,0])=>{const r=length(subtract(vec(P),vec(S)));if(r===0)throw RangeError('Point-source potential is singular at the source.');return K*q/r;};
const boundedCos=u=>{if(!Number.isFinite(u)||u< -1||u>1)throw RangeError('cos(theta) must be between −1 and1.');return u;};

function dipoleKernel(s){
 const q=s.q*NC,R=s.R,d=s.eta*R,theta=s.theta*Math.PI/180;
 const P=[R*Math.sin(theta),0,R*Math.cos(theta)],delta=[0,0,d/2];
 const originPotential=pointPotential(q,P),sourceMovedPotential=pointPotential(q,P,delta),observerMovedPotential=pointPotential(q,subtract(P,delta));
 const observationGradient=P.map(x=>-K*q*x/R**3),sourceGradient=observationGradient.map(x=>-x),unitSourceObservationGradient=P.map(x=>-K*x/R**3);
 const pairExactAtAngle=degrees=>{const t=degrees*Math.PI/180,p=[R*Math.sin(t),0,R*Math.cos(t)];return pointPotential(q,p,delta)-pointPotential(q,p,delta.map(x=>-x));};
 const pairDerivativeAtAngle=degrees=>K*q*d*Math.cos(degrees*Math.PI/180)/R**2;
 const pairExactPotential=pairExactAtAngle(s.theta),pairDerivativePotential=pairDerivativeAtAngle(s.theta),pairAbsoluteError=Math.abs(pairExactPotential-pairDerivativePotential),pairScale=K*q*d/R**2;
 const h=1e-5*R,shift=[0,0,h];
 const finiteDifferenceSourceDerivative=(pointPotential(q,P,shift)-pointPotential(q,P,shift.map(x=>-x)))/(2*h);
 const finiteDifferenceObserverDerivative=(pointPotential(q,P.map((x,i)=>x+shift[i]))-pointPotential(q,P.map((x,i)=>x-shift[i])))/(2*h);
 return {q,R,d,P,delta,p:[0,0,q*d],originPotential,sourceMovedPotential,observerMovedPotential,
  singleExactDelta:sourceMovedPotential-originPotential,singleFirstOrderDelta:sourceGradient[2]*d/2,
  observationGradient,sourceGradient,unitSourceObservationGradient,pairExactPotential,pairDerivativePotential,pairAbsoluteError,pairScaleNormalizedError:pairAbsoluteError/pairScale,
  pairScale,pairExactAtAngle,pairDerivativeAtAngle,finiteDifferenceSourceDerivative,finiteDifferenceObserverDerivative,
  derivativeCheckScale:K*q/R**2,finiteDifferenceStep:h,translationExact:true,pairIsApproximation:true};
}
function trialKernel(s){
 const R=s.R,Q=s.Q*NC,alpha=s.alpha,meanPotential=K*Q/R,sigmaMean=Q/(4*Math.PI*R*R),amplitude=meanPotential*alpha/3;
 const surfacePotential=u=>meanPotential+amplitude*boundedCos(u),sigma=u=>sigmaMean*(1+alpha*boundedCos(u));
 const potentialAt=P=>{const [x,y,z]=vec(P),r=Math.hypot(x,y,z);return r<=R?meanPotential+K*Q*alpha*z/(3*R**2):K*Q/r+K*Q*alpha*R*z/(3*r**3);};
 return {R,Q,alpha,sigmaMean,sigma,surfacePotential,potentialAt,dipoleMoment:[0,0,alpha*Q*R/3],meanPotential,
  northPotential:surfacePotential(1),equatorPotential:meanPotential,southPotential:surfacePotential(-1),sigmaNorth:sigma(1),sigmaSouth:sigma(-1),
  surfacePotentialSpread:2*Math.abs(amplitude),surfaceMaxResidual:Math.abs(amplitude),areaWeightedRMSResidual:Math.abs(amplitude)/Math.sqrt(3),
  tangentialField:u=>K*Q*alpha*Math.sqrt(Math.max(0,1-boundedCos(u)**2))/(3*R**2),maxTangentialField:K*Q*Math.abs(alpha)/(3*R**2),
  interiorField:[0,0,-K*Q*alpha/(3*R**2)],exactEquilibrium:alpha===0,trialIsPhysicalTime:false,
  status:alpha===0?'Exact equilibrium for this isolated sphere':'Trial fails equipotential condition',totalCharge:Q};
}
// Independent hyperbolic coefficient/energy derivative, used only as a
// converged reference. The displayed finite-depth force uses cross-image sums.
function convergedSphereReference(a,D,Q){
 const mu=Math.acosh(D/(2*a)),sh=Math.sinh(mu),coth=x=>1/Math.tanh(x);let S=0,dSdMu=0;
 for(let n=0;n<=80;n++){const g=sh/Math.sinh((n+1)*mu);S+=g;dSdMu+=g*(coth(mu)-(n+1)*coth((n+1)*mu));}
 const dSdD=dSdMu/(2*a*sh);
 return {coefficientSum:S,potential:K*Q/(a*S),energy:K*Q*Q/(a*S),forceOnRight:K*Q*Q*dSdD/(a*S*S),depth:80,method:'Independent hyperbolic coefficients and converged energy derivative; bounded separation domain.'};
}
function spheresKernel(s){
 const a=s.a,D=s.ratio*a,Q=s.Q*NC,N=s.N,t=[0],gamma=[1];
 for(let n=0;n<N;n++){const L=D-t[n];t.push(a*a/L);gamma.push(a*gamma[n]/L);}
 const coefficientSum=gamma.reduce((v,g)=>v+g,0),centralImageCharge=Q/coefficientSum;
 const leftImages=t.map((offset,n)=>({n,p:[-D/2+offset,0,0],q:centralImageCharge*gamma[n],offset,coefficient:gamma[n]}));
 const rightImages=t.map((offset,n)=>({n,p:[D/2-offset,0,0],q:-centralImageCharge*gamma[n],offset,coefficient:gamma[n]}));
 const L=D-t[N],constantPotentialPart=K*centralImageCharge/a,surfacePotentialSpread=2*K*a*centralImageCharge*gamma[N]/(L*L-a*a);
 const mu=Math.acosh(D/(2*a)),beta=Math.exp(-mu),seriesCoefficientTailBound=gamma[N]*beta/(1-beta);
 const equilibriumPotentialBracket=[K*Q/(a*(coefficientSum+seriesCoefficientTailBound)),constantPotentialPart];
 let forceOnRightApproximate=0;for(let i=0;i<=N;i++)for(let j=0;j<=N;j++)forceOnRightApproximate-=K*centralImageCharge**2*gamma[i]*gamma[j]/(D-t[i]-t[j])**2;
 const outside=P=>{vec(P);if(Math.hypot(P[0]+D/2,P[1],P[2])<a*(1-1e-12)||Math.hypot(P[0]-D/2,P[1],P[2])<a*(1-1e-12))throw RangeError('Fictitious-image fields are only valid outside both conductors.');return P;};
 const images=[...leftImages,...rightImages];
 const potentialAt=P=>{outside(P);return images.reduce((sum,c)=>sum+pointPotential(c.q,P,c.p),0);};
 const fieldAt=P=>{outside(P);const E=[0,0,0];for(const c of images){const r=subtract(P,c.p),distance=length(r);for(let i=0;i<3;i++)E[i]+=K*c.q*r[i]/distance**3;}return E;};
 const leftSurfacePotential=u=>constantPotentialPart-K*centralImageCharge*gamma[N]/Math.sqrt(L*L+a*a-2*a*L*boundedCos(u));
 const rightSurfacePotential=u=>-leftSurfacePotential(u); // u points toward the other sphere on both surfaces.
 const reference=convergedSphereReference(a,D,Q);
 return {a,D,Q,N,t,gamma,coefficientSum,centralImageCharge,leftImages,rightImages,leftTotalCharge:leftImages.reduce((v,c)=>v+c.q,0),rightTotalCharge:rightImages.reduce((v,c)=>v+c.q,0),
  constantPotentialPart,leftSurfacePotential,rightSurfacePotential,surfacePotentialSpread,leftSurfacePotentialSpread:surfacePotentialSpread,rightSurfacePotentialSpread:surfacePotentialSpread,
  seriesCoefficientTailBound,beta,equilibriumPotentialBracket,potentialAt,fieldAt,forceOnRightApproximate,forceOnLeftApproximate:-forceOnRightApproximate,
  reference,forceRelativeDifferenceFromReference:Math.abs((forceOnRightApproximate-reference.forceOnRight)/reference.forceOnRight),forceErrorBound:null,
  exactEquilibrium:false,imagesAreFictitious:true,forceMethod:'Cross-force of the displayed finite image representation; approximate conductor force.',
  warning:'Finite depth leaves a boundary residual. The coefficient tail is not a force-error bound. No force is obtained by differentiating truncated energy.'};
}
function fringingKernel(s){
 const width=s.width,A=width**2,d=s.eta*width,V=s.V,C0=EPS0*A/d,Q0=C0*V,E0=V/d;
 return {width,A,d,V,C0,Q0,E0,view:s.view,finiteCapacitance:null,fringeCorrection:null,finiteField:null,finiteSurfaceChargeDensity:null,
  finiteCapacitanceRelation:'Above C0 in the qualitative source comparison',diagramIsQuantitative:false,
  viewName:s.view,warning:'Only the uniform-field baseline is calculated. Curved paths and crowded charge marks are qualitative; no corrected capacitance or percentage is supplied.'};
}
export function conductorExtensionKernel(scene,values={}){
 if(!conductorExtensionNames.includes(scene))throw Error('Unknown conductor extension model.');
 const s={...conductorExtensionKernelDefaults[scene],...values};
 for(const [key,,min,max]of controls[scene])if(!Number.isFinite(s[key])||s[key]<min||s[key]>max)throw RangeError('Invalid conductor parameter: '+key);
 if(scene==='plate-fringing-sketch'&&!['ideal','qualitative edge sketch'].includes(s.view))throw RangeError('Invalid conductor parameter: view');
 if(scene==='two-sphere-images'&&!Number.isInteger(s.N))throw RangeError('Reflection depth must be an integer.');
 const m=scene==='dipole-displacement'?dipoleKernel(s):scene==='conductor-trial-residual'?trialKernel(s):scene==='two-sphere-images'?spheresKernel(s):fringingKernel(s);
 return {...m,state:s};
}
export function conductorExtensionModel(scene,values={}){
 if(!conductorExtensionNames.includes(scene))throw Error('Unknown conductor extension model.');
 const state={...conductorExtensionDefaults[scene]},named={};
 for(const [key,sourceKey]of Object.entries(conductorExtensionParameterMap[scene])){
  const generic=values[key],alias=sourceKey===key?undefined:values[sourceKey];
  if(generic!==undefined&&alias!==undefined&&generic!==alias)throw RangeError('Conflicting conductor aliases: '+key+'/'+sourceKey);
  let value=alias!==undefined?alias:generic!==undefined?generic:state[key];
  if(sourceKey==='view'){
   if(alias!==undefined)value=alias==='ideal'?0:alias==='qualitative edge sketch'?1:NaN;
   if(!Number.isInteger(value)||value<0||value>1)throw RangeError('View must be integer0 or1.');
   named.view=value===0?'ideal':'qualitative edge sketch';
  }else named[sourceKey]=value;
  state[key]=value;
 }
 const m=conductorExtensionKernel(scene,named);
 return {...m,state,kernelState:m.state};
}

const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const fmt=x=>x===0?'0':Number(x.toPrecision(4)).toString();
const sci=x=>x===0?'0':x.toExponential(3);
const readouts=(shapes,values)=>values.forEach((value,i)=>shapes.push(text('value-'+i,452,104+29*i,value)));
function graph(shapes,{id,label,xMin,xMax,yMax,functions,labels=[]}){
 const X=x=>45+270*(x-xMin)/(xMax-xMin),Y=y=>274-52*y/yMax;
 const tick=Number(yMax.toPrecision(3)).toString();
 shapes.push(line(id+'-x',[45,274],[315,274],'axis'),line(id+'-y',[45,215],[45,331],'axis'),text(id+'-label',180,203,label),text(id+'-min',45,347,fmt(xMin)),text(id+'-max',315,347,fmt(xMax)),text(id+'-positive',22,221,tick),text(id+'-zero',24,278,'0'),text(id+'-negative',22,331,'−'+tick));
 functions.forEach((f,j)=>shapes.push(curve(id+'-curve-'+j,Array.from({length:101},(_,i)=>{const x=xMin+(xMax-xMin)*i/100;return [X(x),Y(f(x))];}),j?'gold-curve':'blue-curve')));
 labels.forEach((label,i)=>shapes.push(text(id+'-key-'+i,180,343+14*i,label)));
 return {X,Y};
}
export const conductorExtensionScope=Object.freeze({
 'dipole-displacement':'Original plane slice of a3D point-charge problem. Source-up and observer-down equivalence is exact. The centered finite ±q pair is compared with its first-order dipole approximation. Zero reference at infinity; eta<=0.4, no singular observer positions. Error uses a nonzero dipole scale, including the mid-plane.',
 'conductor-trial-residual':'Original isolated-sphere trial sigma=Q(1+alpha cos(theta))/(4pi R²), fixed positive total Q. Exact potential of the prescribed trial diagnoses a nonequilibrium conductor guess. Only alpha=0 is equilibrium in this family. Alpha is a trial parameter, not time, physical relaxation or a general convergence algorithm.',
 'two-sphere-images':'Equal isolated spheres with fixed total +Q and −Q, vacuum, D/a>=2.5. Every finite image sequence is charge-normalized and remains approximate; both boundary residuals and cross-force are reported. Image fields valid only outside the spheres. Independent hyperbolic depth80 reference within the bounded domain; no rigorous finite-depth force-error bound.',
 'plate-fringing-sketch':'Original qualitative edge diagram and numerical ideal baseline for authored square plates, gap/width<=0.1. Only C0=epsilon0 A/d, Q0=C0 V and E0=V/d are calculated. Curves, charge marks and exaggerated sketch gap have no quantitative field scale. Actual finite capacitance, charge crowding and fringe correction remain uncomputed.'
});
export function conductorExtensionDefinition(scene,values={}){
 const m=conductorExtensionModel(scene,values),s=m.kernelState,shapes=[];let title,context;
 if(scene==='dipole-displacement'){
  title='SOURCE DISPLACEMENT · EXACT SHIFT, FIRST-ORDER DIPOLE';context='Blue: exact pair · gold: first-order dipole · error scale stays defined at zero potential';
  for(const [i,x]of [95,245].entries()){
   const origin=[x,116],observer=[x+40*Math.sin(s.theta*Math.PI/180),116-40*Math.cos(s.theta*Math.PI/180)];
   const labelY=y=>y>=158?y-6:y+4;
   shapes.push(point('origin-'+i,origin),text('q-label-'+i,x,139,'+q'),text('frame-'+i,x,67,i?'Observer down':'Source up'));
   if(i===0){const moved=[x,116-20*s.eta];shapes.push(point('source-moved',moved),arrow('source-up',origin,moved),point('P-0',observer),text('P-label-0',observer[0]+12,labelY(observer[1]),'P'));}
   else{const moved=[observer[0],observer[1]+20*s.eta];shapes.push(point('P-1',moved),arrow('observer-down',observer,moved),text('P-label-1',moved[0]+12,labelY(moved[1]),'P′'));}
  }
  shapes.push(text('shift-link',180,181,'Same displacement δ = d/2; exactly equal potentials'));
  graph(shapes,{id:'pair',label:'Pair potential (V) versus angle (°)',xMin:0,xMax:180,yMax:Math.max(m.pairExactAtAngle(0),m.pairScale)*1.1,functions:[m.pairExactAtAngle,m.pairDerivativeAtAngle]});
  readouts(shapes,['Source shifted: '+fmt(m.sourceMovedPotential)+' V','Observer shifted: '+fmt(m.observerMovedPotential)+' V','Exact single Δφ: '+fmt(m.singleExactDelta)+' V','First-order Δφ: '+fmt(m.singleFirstOrderDelta)+' V','Exact pair: '+fmt(m.pairExactPotential)+' V','Dipole estimate: '+fmt(m.pairDerivativePotential)+' V','Absolute error: '+sci(m.pairAbsoluteError)+' V','Scale error: '+sci(m.pairScaleNormalizedError)]);
 }else if(scene==='conductor-trial-residual'){
  title='TRIAL SURFACE CHARGE · EQUIPOTENTIAL DIAGNOSTIC';context='Fixed total Q · alpha chooses a trial, not time · only alpha = 0 is equilibrium here';
  shapes.push(circle('trial-sphere',[122,136],56),circle('uniform-comparison',[282,136],36),text('trial-label',122,64,'Chosen trial'),text('uniform-label',282,80,'α = 0'),text('uniform-potential',282,186,'Constant φ'));
  for(let i=0;i<20;i++){const theta=2*Math.PI*i/20,u=Math.cos(theta),at=[122+56*Math.sin(theta),136-56*u];shapes.push(circle('trial-charge-'+i,at,1.7+1.2*(1+s.alpha*u)));}
  shapes.push(arrow('tangential-field',[189,116],[189,116+32*Math.sign(s.alpha)],'normal',s.alpha!==0),text('Et-label',208,159,'Eθ'),arrow('interior-field',[122,118],[122,118+30*Math.sign(s.alpha)],'sample-field',s.alpha!==0),text('interior-field-label',122,107,s.alpha===0?'E inside = 0':'E inside'));
  graph(shapes,{id:'trial',label:'Surface φ − mean (V) versus cos θ',xMin:-1,xMax:1,yMax:Math.max(m.surfaceMaxResidual,.1*m.meanPotential),functions:[u=>m.surfacePotential(u)-m.meanPotential,()=>0],labels:['Gold: exact uniform-sphere comparison']});
  readouts(shapes,['Total Q: '+fmt(m.Q/NC)+' nC (fixed)','Mean φ: '+fmt(m.meanPotential)+' V','North φ: '+fmt(m.northPotential)+' V','South φ: '+fmt(m.southPotential)+' V','Potential span: '+fmt(m.surfacePotentialSpread)+' V','RMS residual: '+fmt(m.areaWeightedRMSResidual)+' V','Max |Eθ|: '+fmt(m.maxTangentialField)+' V/m',m.exactEquilibrium?'Exact equilibrium in this family':'Nonzero residual: trial is not equilibrium']);
 }else if(scene==='two-sphere-images'){
  title='TWO SPHERES · CHARGE-NORMALIZED IMAGE CORRECTIONS';context='Finite N leaves a residual · tail bound is not a force bound';
  const scale=270/(m.D+2*m.a),X=x=>180+scale*x,radius=scale*m.a;
  const centerY=115;
  shapes.push(circle('left-sphere',[X(-m.D/2),centerY],radius),circle('right-sphere',[X(m.D/2),centerY],radius),text('left-total',X(-m.D/2),50,'Total +Q'),text('right-total',X(m.D/2),50,'Total −Q'));
  for(let n=0;n<m.N;n++)for(const [side,source,image,sign]of [['left',m.rightImages[n],m.leftImages[n+1],-1],['right',m.leftImages[n],m.rightImages[n+1],1]]){
   const from=X(source.p[0]),to=X(image.p[0]),lift=16+2*n;
   shapes.push({...curve('reflection-'+side+'-'+n,Array.from({length:31},(_,j)=>{const t=j/30;return [from+(to-from)*t,centerY+sign*lift*Math.sin(Math.PI*t)];}),'reference'),cancelsBoundary:side,sourceImage:source.n,reflectedImage:image.n});
  }
  for(const [side,images]of [['L',m.leftImages],['R',m.rightImages]])for(const image of images)shapes.push(point('image-'+side+'-'+image.n,[X(image.p[0]),centerY]));
  if(m.N>0)shapes.push(text('left-cancellation-key',452,62,'Upper links cancel left boundary'),text('right-cancellation-key',452,80,'Lower links cancel right boundary'));
  shapes.push(text('image-count',180,190,'Fictitious images: '+(m.N+1)+' per sphere'));
  graph(shapes,{id:'surfaces',label:'Surface potentials (V) versus cos θ toward gap',xMin:-1,xMax:1,yMax:m.constantPotentialPart*1.1,functions:[m.leftSurfacePotential,m.rightSurfacePotential],labels:['Blue: left sphere · gold: right sphere']});
  readouts(shapes,['Depth N: '+m.N,'Left total: '+fmt(m.leftTotalCharge/NC)+' nC','Right total: '+fmt(m.rightTotalCharge/NC)+' nC','Both spans: '+sci(m.surfacePotentialSpread)+' V','Approx. right Fx: '+fmt(m.forceOnRightApproximate*1e9)+' nN','Reference Fx: '+fmt(m.reference.forceOnRight*1e9)+' nN','Coefficient tail ≤ '+sci(m.seriesCoefficientTailBound),'Voltage bracket: '+fmt(m.equilibriumPotentialBracket[0])+'…'+fmt(m.equilibriumPotentialBracket[1])+' V']);
 }else{
  title='FINITE PLATE EDGE · QUALITATIVE FRINGING';context='Only C0, Q0 and E0 are calculated · edge paths and charge marks have no strength scale';
  const gap=43+260*s.eta,top=151-gap/2,bottom=151+gap/2,edge=s.view==='qualitative edge sketch';
  shapes.push(line('upper-plate',[45,top],[252,top],'axis'),line('lower-plate',[45,bottom],[252,bottom],'axis'),text('upper-sign',148,top-17,'Negative upper plate'),text('lower-sign',148,bottom+26,'Positive lower plate'));
  for(const x of [75,120,165,210])shapes.push(arrow('straight-'+x,[x,bottom-3],[x,top+3]));
  if(edge){for(const [i,x]of [215,235,247].entries()){
    const extent=36+25*i,path=t=>[x+extent*Math.sin(Math.PI*t)**2,bottom-gap*t];
    shapes.push(curve('fringe-'+i,Array.from({length:51},(_,j)=>path(j/50))),arrow('fringe-direction-'+i,path(.46),path(.55)));
   }
   for(const [i,x]of [56,102,147,188,219,236,246,251].entries())shapes.push(text('plus-'+i,x,bottom+12,'+'),text('minus-'+i,x,top-5,'−'));
  }
  shapes.push(text('sketch-label',180,251,edge?'Original edge sketch; gap exaggerated':'Ideal uniform-field comparison'),text('sketch-scale',180,276,'Curves are qualitative; line count does not measure E'),text('edge-cue',180,301,edge?'Crowded marks cue increased charge density near edges':'Uniform interior field, edges omitted'));
  readouts(shapes,['Authored square A: '+fmt(m.A)+' m²','Gap d: '+fmt(m.d)+' m','Ideal C0: '+fmt(m.C0*1e12)+' pF','Ideal Q0: '+fmt(m.Q0*1e12)+' pC','Ideal E0: '+fmt(m.E0)+' V/m','Finite C: above C0 qualitatively','Fringe correction: not calculated','Field sketch has no numeric scale']);
 }
 const first=conductorExtensionControls(scene)[0],scale=220/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(text('title',300,29,title),line('track',[65,367],[285,367],'axis'),point('probe',[origin+m.state[first.key]*scale,367],true),text('track-label',175,388,first.label+(first.units?' ('+first.units+')':'')),text('context',300,432,context),text('hint',300,454,'Arrow keys or the black point change the first control'));
 return {schemaVersion:1,scene,label:title,sourceScope:conductorExtensionScope[scene],width:600,height:466,shapes,equations:[{id:scene,x:300,y:410}],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export const conductorExtensionEquations=Object.freeze({
 'dipole-displacement':{plain:'grad_S φ = −grad_P φ · φdip = K q d cos θ / R²',tex:String.raw`\nabla_S\phi=-\nabla_P\phi\qquad\phi_{\rm dip}=\frac{Kqd\cos\theta}{R^2}`},
 'conductor-trial-residual':{plain:'φsurface = (KQ/R)[1 + (α/3) cos θ] · equilibrium: α = 0',tex:String.raw`\phi_s=\frac{KQ}{R}\left(1+\frac\alpha3\cos\theta\right)\qquad\alpha=0\ \text{at equilibrium}`},
 'two-sphere-images':{plain:'tn+1 = a²/(D−tn) · γn+1 = aγn/(D−tn) · bN = Q/Σγn',tex:String.raw`t_{n+1}=\frac{a^2}{D-t_n}\quad\gamma_{n+1}=\frac{a\gamma_n}{D-t_n}\quad b_N=\frac{Q}{\sum_{n=0}^N\gamma_n}`},
 'plate-fringing-sketch':{plain:'Ideal baseline: C0 = ε0 A/d · Q0 = C0 V · E0 = V/d',tex:String.raw`C_0=\frac{\epsilon_0 A}{d}\qquad Q_0=C_0V\qquad E_0=\frac Vd`}
});
export function drawConductorExtension(scene,values={}){const d=conductorExtensionDefinition(scene,values);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,410,conductorExtensionEquations[scene].plain)]),metrics:[],label:d.label};}
export function conductorExtensionChecks(scene){
 const states=[conductorExtensionDefaults[scene]];
 for(const c of conductorExtensionControls(scene))for(const value of c.values||[c.min,c.max])states.push({...conductorExtensionDefaults[scene],[c.key]:value});
 const close=(a,b)=>{if(Math.abs(a-b)>1e-24+1e-10*Math.max(Math.abs(a),Math.abs(b)))throw Error('Conductor invariant failed.');};
 for(const state of states){const m=conductorExtensionModel(scene,state);
  if(scene==='dipole-displacement'){close(m.sourceMovedPotential,m.observerMovedPotential);close(m.sourceGradient[2],-m.observationGradient[2]);}
  if(scene==='conductor-trial-residual'){close(m.surfacePotentialSpread,Math.abs(m.northPotential-m.southPotential));close(m.maxTangentialField,Math.abs(m.interiorField[2]));}
  if(scene==='two-sphere-images'){close(m.leftTotalCharge,m.Q);close(m.rightTotalCharge,-m.Q);close(m.forceOnLeftApproximate,-m.forceOnRightApproximate);if(m.forceOnRightApproximate>=0||m.surfacePotentialSpread<=0)throw Error('Invalid finite image force or residual.');}
  if(scene==='plate-fringing-sketch'){close(m.C0*m.V,m.Q0);close(m.E0*m.d,m.V);if(m.fringeCorrection!==null||m.finiteCapacitance!==null)throw Error('Unvalidated fringe quantity.');}
  for(const shape of conductorExtensionDefinition(scene,state).shapes){if(shape.type==='text'&&/NaN|Infinity/.test(shape.text))throw Error('Nonfinite conductor readout.');for(const coordinates of [shape.at,shape.from,shape.to,...(shape.points||[])])if(coordinates?.some(x=>!Number.isFinite(x)))throw Error('Nonfinite conductor geometry.');}
 }
 return {passed:true,states:states.length,method:'Bounded endpoint identities and finite geometry. Independent numerical source-reference checks are in the standalone test file; no registration or coverage is inferred.'};
}
