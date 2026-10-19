import {primitivesSVG} from './scene-primitives.js';

// Original supplied analytic inputs. Source Fig8-3 supplies no C(theta) law.
// Independent numerical and source references were frozen before implementation.
export const capacitanceScales=Object.freeze({charge:20e-9,capacitance:100e-12,length:1e-3,energy:2e-6,force:2e-3});
export function suppliedCapacitanceKernel(s,n=0){
 if(!Number.isFinite(s)||s<.2||s>2||!Number.isInteger(n)||n<0||n>2)throw RangeError('Supply x/L in [0.2,2] and family index 0,1 or2.');
 const c=n===0?1/s:n===1?1+s:Math.exp(s),derivative=n===0?-1/(s*s):n===1?1:c;
 const normalizedEnergy=1/c,normalizedExternalForce=-derivative/(c*c);
 return {s,family:n,normalizedCapacitance:c,normalizedDerivative:derivative,normalizedEnergy,normalizedExternalForce,normalizedElectricForce:-normalizedExternalForce,capacitance:c*capacitanceScales.capacitance,capacitanceDerivative:derivative*capacitanceScales.capacitance/capacitanceScales.length,energy:normalizedEnergy*capacitanceScales.energy,externalForce:normalizedExternalForce*capacitanceScales.force,electricForce:-normalizedExternalForce*capacitanceScales.force};
}
export function suppliedTorqueKernel(degrees){
 if(!Number.isFinite(degrees)||degrees<0||degrees>180)throw RangeError('Supply angle in [0,180] degrees.');
 const angle=degrees*Math.PI/180,c=1+.4*Math.cos(angle),derivative=degrees===0||degrees===180?0:-.4*Math.sin(angle),normalizedEnergy=1/c,normalizedExternalTorque=-derivative/(c*c);
 return {degrees,angle,normalizedCapacitance:c,normalizedDerivative:derivative,normalizedEnergy,normalizedExternalTorque,normalizedElectricTorque:-normalizedExternalTorque,capacitance:c*capacitanceScales.capacitance,capacitanceDerivative:derivative*capacitanceScales.capacitance,energy:normalizedEnergy*capacitanceScales.energy,externalTorque:normalizedExternalTorque*capacitanceScales.energy,electricTorque:-normalizedExternalTorque*capacitanceScales.energy};
}
export const chapter8CapacitanceDefaults=Object.freeze({'supplied-capacitance-work':Object.freeze({r:1,n:0}),'supplied-capacitance-torque':Object.freeze({r:60})});
export const chapter8CapacitanceNames=Object.freeze(Object.keys(chapter8CapacitanceDefaults));
export function chapter8CapacitanceControls(scene){
 if(scene==='supplied-capacitance-work')return [{key:'r',label:'Position x / L',min:.2,max:2,step:.01,units:''},{key:'n',label:'Supplied curve: 0 = 1/s; 1 = 1+s; 2 = exp(s)',min:0,max:2,step:1,units:''}];
 if(scene==='supplied-capacitance-torque')return [{key:'r',label:'Angle θ (converted to radians for derivatives)',min:0,max:180,step:1,units:'°'}];
 throw Error('Unknown supplied capacitance model.');
}
export function chapter8CapacitanceModel(scene,values={}){
 const state=Object.fromEntries(chapter8CapacitanceControls(scene).map(c=>[c.key,values[c.key]??chapter8CapacitanceDefaults[scene][c.key]]));
 return {...(scene==='supplied-capacitance-work'?suppliedCapacitanceKernel(state.r,state.n):suppliedTorqueKernel(state.r)),state};
}
const common='Fixed isolated charge Q=20 nC; supplied positive capacitance C0=100 pF times c. E0=Q²/(2C0)=2 microjoule. Quasistatic lossless balance: externally applied generalized force equals the derivative of stored energy; electrical force has the opposite sign. Source general reasoning is retained in original prepared prose. No connected voltage source or inferred fringing/overlap law; no arbitrary expression execution.';
export const chapter8CapacitanceScope=Object.freeze({
 'supplied-capacitance-work':common+' Authored analytic input c(s) is 1/s, 1+s or exp(s), with s=x/L in[.2,2], L=1 mm. The derivative is per physical metre. F0=E0/L=2 mN. The sketch is an abstract coordinate, not a geometry-derived capacitor calculation.',
 'supplied-capacitance-torque':common+' Authored analytic input c(theta)=1+0.4 cos(theta) stays positive. UI degrees are converted to radians; C derivative and torque use radians. Torque unit J=N*m. The source Fig8-3 motivates an angular coordinate but supplies no capacitance law; this curve is not inferred from its shape.'
});
export const chapter8CapacitanceEquations={
 'ch8-supplied-energy':{plain:'U = Q²/(2C); Q fixed; U/E0 = 1/c',tex:String.raw`U=\frac{Q^2}{2C},\qquad Q\text{ fixed},\qquad \frac{U}{E_0}=\frac1c`},
 'ch8-supplied-force':{plain:'Fext = dU/dx = −Q²/(2C²) dC/dx; Felec = −Fext',tex:String.raw`F_{\rm ext}=\frac{dU}{dx}=-\frac{Q^2}{2C^2}\frac{dC}{dx},\qquad F_{\rm elec}=-F_{\rm ext}`},
 'ch8-supplied-torque':{plain:'τext = dU/dθ = −Q²/(2C²) dC/dθ; τelec = −τext',tex:String.raw`\tau_{\rm ext}=\frac{dU}{d\theta}=-\frac{Q^2}{2C^2}\frac{dC}{d\theta},\qquad \tau_{\rm elec}=-\tau_{\rm ext}`},
 'ch8-supplied-angle':{plain:'θrad = θdeg π/180; c = 1 + 0.4 cos θrad (authored)',tex:String.raw`\theta_{\rm rad}=\theta_{\rm deg}\frac\pi{180},\qquad c=1+0.4\cos\theta_{\rm rad}\quad\text{(authored)}`}
};
export const chapter8CapacitanceEquationSources=Object.freeze({
 'ch8-supplied-energy':{sourcePages:[102,103],labels:['8.9'],kind:'source fixed-charge capacitor energy with authored normalization'},
 'ch8-supplied-force':{sourcePages:[103],labels:['8.12','8.13','8.14','8.15'],kind:'source external virtual-work sign and fixed-charge derivative; input C(x) authored'},
 'ch8-supplied-torque':{sourcePages:[103],labels:[],kind:'source arbitrary-coordinate extension; angular derivative at fixed charge, supplied curve authored'},
 'ch8-supplied-angle':{sourcePages:[103],labels:[],kind:'authored positive angular capacitance law; not a law inferred from Fig8-3'}
});
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const curve=(id,points,style)=>({id,type:'curve',points,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const fmt=x=>Math.abs(x)<1e-14?'0':Number(x.toPrecision(6)).toString();
export function chapter8CapacitanceDefinition(scene,values={}){
 const m=chapter8CapacitanceModel(scene,values),angular=scene==='supplied-capacitance-torque',shapes=[],equations=[],max=angular?180:2,min=angular?0:.2,X=x=>320+240*(x-min)/(max-min),Y=v=>245-140*v/(angular?2:8),at=x=>angular?suppliedTorqueKernel(x):suppliedCapacitanceKernel(x,m.family);
 shapes.push(text('title',300,24,angular?'FIXED CHARGE · SUPPLIED ANGULAR CAPACITANCE':'FIXED CHARGE · SUPPLIED CAPACITANCE CURVE'),text('input-note',300,50,'Analytic input is authored; geometry below is schematic'));
 if(angular){
  const center=[135,160],tip=[135+75*Math.cos(m.angle),160-75*Math.sin(m.angle)];
  shapes.push({id:'angle-reference',type:'circle',at:center,radius:75},line('zero-angle',center,[210,160],'reference'),line('angular-arm',center,tip,'sample-field'),point('angular-center',center),text('coordinate-readout',135,263,'θ = '+fmt(m.degrees)+'°; radians = '+fmt(m.angle)));
 }else{
  shapes.push(line('device-top',[70,122],[210,122],'normal'),line('device-base',[70,197],[210,197],'normal'),text('isolated-charge',135,163,'Isolated · fixed Q'),line('coordinate-track',[60,240],[220,240],'axis'),point('coordinate-position',[60+160*(m.s-.2)/1.8,240]),text('coordinate-readout',135,263,'x = '+fmt(m.s)+' mm; L = 1 mm'));
 }
 shapes.push(text('capacitance-curve-label',440,77,'Blue: C/C0'),text('energy-curve-label',440,94,'Gold: U/E0'),line('graph-x',[320,245],[560,245],'axis'),line('graph-y',[320,105],[320,245],'axis'),text('graph-zero',305,245,'0'),text('graph-max',305,105,angular?'2':'8'),text('graph-min-tick',320,265,String(min)),text('graph-max-tick',560,265,String(max)),text('graph-coordinate',440,287,angular?'θ in degrees; physics uses radians':'s = x/L; derivative uses metres'));
 const samples=Array.from({length:181},(_,i)=>min+(max-min)*i/180);
 shapes.push(curve('capacitance-curve',samples.map(x=>[X(x),Y(at(x).normalizedCapacitance)]),'blue-curve'),curve('stored-energy-curve',samples.map(x=>[X(x),Y(at(x).normalizedEnergy)]),'gold-curve'),point('energy-selection',[X(m.state.r),Y(m.normalizedEnergy)]));
 shapes.push(text('supplied-law',300,319,angular?'Supplied c(θ) = 1 + 0.4 cos(θrad); C stays positive':'Supplied c(s) = '+['1/s','1+s','exp(s)'][m.family]+'; C stays positive'),text('fixed-scales',300,345,'Q = 20 nC · C0 = 100 pF · E0 = 2 µJ'));
 equations.push({id:'ch8-supplied-energy',x:300,y:382},{id:angular?'ch8-supplied-torque':'ch8-supplied-force',x:300,y:430});
 const external=angular?m.externalTorque/1e-6:m.externalForce/1e-3,electric=-external,unit=angular?'µN·m':'mN';
 shapes.push(text('external-force',300,473,(angular?'External torque':'External force')+' = '+fmt(external)+' '+unit),text('electric-force',300,497,(angular?'Electrical torque':'Electrical force')+' = '+fmt(electric)+' '+unit),text('sign-meaning',300,522,'External balance follows dU; electrical tendency follows −dU'));
 if(angular)equations.push({id:'ch8-supplied-angle',x:300,y:558});
 else shapes.push(text('derivative-units',300,554,'dC/dx = '+fmt(m.capacitanceDerivative/1e-9)+' nF/m; F0 = 2 mN'));
 shapes.push(text('source-limit',300,592,angular?'Fig8-3 supplies no C(θ) law; this input is an example':'The source applies to any supplied differentiable positive C(x)'));
 const origin=60,scale=480/(max-min);
 shapes.push(line('probe-track',[60,625],[540,625],'axis'),point('coordinate-probe',[origin+(m.state.r-min)*scale,625],true),text('hint',300,654,'Drag the marker; change the supplied input using controls below'));
 return {schemaVersion:1,scene,width:600,height:676,label:angular?'Energy derivative gives external torque at fixed charge':'Energy derivative gives external force at fixed charge',sourceScope:chapter8CapacitanceScope[scene],shapes,equations,metrics:[{label:'Capacitance',value:fmt(m.capacitance/1e-12)+' pF'},{label:'Stored energy',value:fmt(m.energy/1e-6)+' µJ'},{label:angular?'External torque':'External force',value:fmt(external)+' '+unit},{label:angular?'Electrical torque':'Electrical force',value:fmt(electric)+' '+unit}],probe:{id:'coordinate-probe',parameter:'r',origin:origin-min*scale,scale,min,max},context:chapter8CapacitanceScope[scene]};
}
const escape=value=>String(value).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function drawChapter8Capacitance(scene,state){const d=chapter8CapacitanceDefinition(scene,state);return {body:primitivesSVG(d.shapes)+d.equations.map(e=>`<text x="${e.x}" y="${e.y}" text-anchor="middle" font-size="11">${escape(chapter8CapacitanceEquations[e.id].plain)}</text>`).join(''),metrics:d.metrics,label:d.label};}
export function chapter8CapacitanceChecks(scene){
 const control=chapter8CapacitanceControls(scene)[0],families=scene==='supplied-capacitance-work'?[0,1,2]:[undefined];let states=0;
 for(const n of families)for(let i=0;i<=Math.round((control.max-control.min)/control.step);i++){
  const m=chapter8CapacitanceModel(scene,{r:Number((control.min+i*control.step).toFixed(10)),...(n===undefined?{}:{n})});
  if(m.capacitance<=0||m.energy<=0||!Object.values(m).filter(v=>typeof v==='number').every(Number.isFinite))throw Error('Supplied capacitance arithmetic failed.');states++;
 }
 return {passed:true,states,method:'Positive-input and finite-arithmetic checks; independent derivative and source review remain separate.'};
}
