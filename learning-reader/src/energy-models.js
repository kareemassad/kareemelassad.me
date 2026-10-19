import {EPS0,K,NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

const control=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export const energyDefaults=Object.freeze({
 'capacitor-energy':{r:.6,q:2,a:2},
 'plate-energy-force':{r:.5,q:2,a:2},
 'sphere-assembly-energy':{r:.6,q:2,a:1},
 'vacuum-field-energy':{r:60,a:1,b:1}
});
export const energyNames=Object.freeze(Object.keys(energyDefaults));
export function energyControls(scene){
 if(scene==='capacitor-energy')return [control('r','Transferred fraction x',0,1,.02),control('q','Final charge Q',0,5,.1,'pC'),control('a','Fixed capacitance C',.5,4,.1,'pF')];
 if(scene==='plate-energy-force')return [control('r','Plate separation d',.1,1,.02,'mm'),control('q','Fixed charge magnitude Q',0,5,.1,'pC'),control('a','Plate area A',1,4,.1,'cm²')];
 if(scene==='sphere-assembly-energy')return [control('r','Assembled radius / final radius',0,1,.02),control('q','Final sphere charge Q',0,5,.1,'nC'),control('a','Final sphere radius R',.5,2,.1,'m')];
 if(scene==='vacuum-field-energy')return [control('r','Uniform electric field E',0,100,1,'V/m'),control('a','Region cross-section A',.5,2,.1,'m²'),control('b','Region length L',.5,2,.1,'m')];
 throw Error('Unknown electrostatic energy model.');
}
export function energyModel(scene,values={}){
 if(!energyNames.includes(scene))throw Error('Unknown electrostatic energy model.');
 const s={...energyDefaults[scene],...values};
 for(const c of energyControls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max)throw Error('Invalid energy parameter: '+c.key);
 let m;
 if(scene==='capacitor-energy'){
  const Q=s.q*1e-12,C=s.a*1e-12,charge=s.r*Q,V=charge/C,U=charge*charge/(2*C);
  m={Q,C,charge,V,U,finalV:Q/C,finalU:Q*Q/(2*C),potential:x=>x*Q/C,energy:x=>(x*Q)**2/(2*C)};
 }else if(scene==='plate-energy-force'){
  const Q=s.q*1e-12,A=s.a*1e-4,d=s.r*1e-3,C=EPS0*A/d,E=Q/(EPS0*A),V=E*d,U=Q*Q/(2*C),force=Q*Q/(2*EPS0*A);
  m={Q,A,d,C,E,V,U,externalForce:force,electricForce:-force,pressure:EPS0*E*E/2,density:EPS0*E*E/2,energyAtGap:x=>Q*Q*x/(2*EPS0*A)};
 }else if(scene==='sphere-assembly-energy'){
  const Q=s.q*NC,R=s.a,radius=s.r*R,rho=3*Q/(4*Math.PI*R**3),charge=Q*s.r**3,finalU=3*K*Q*Q/(5*R),U=finalU*s.r**5;
  m={Q,R,radius,rho,charge,U,finalU,boundaryPotential:K*Q*s.r**2/R,dQdr:3*Q*s.r**2/R,dUdr:3*K*Q*Q*s.r**4/R**2,energy:x=>finalU*x**5,insideFieldEnergy:K*Q*Q*s.r**5/(10*R),outsideFieldEnergy:K*Q*Q*s.r**5/(2*R)};
 }else{
  const E=s.r,A=s.a,L=s.b,volume=A*L,density=EPS0*E*E/2;
  m={E,A,L,volume,density,U:density*volume,Q:EPS0*E*A,V:E*L,C:EPS0*A/L};
 }
 return {...m,state:s};
}

const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const fmt=x=>x===0?'0':Number(x.toPrecision(4)).toString();
const sci=x=>x===0?'0':x.toExponential(3);
// Physical plot data: V × pC = pJ. The fraction control determines how far
// along this charge axis we have transferred; it is not the axis quantity.
export function chargingWorkPlot(values={}){
 const m=energyModel('capacitor-energy',values),finalChargePico=m.Q*1e12,chargePico=m.charge*1e12;
 return {xUnits:'pC',yUnits:'V',areaUnits:'pJ',xMax:finalChargePico||1,yMax:Math.max(1,m.finalV),line:Array.from({length:101},(_,i)=>{const charge=m.Q*i/100;return [charge*1e12,charge/m.C];}),area:[[0,0],[chargePico,m.V],[chargePico,0],[0,0]],probe:[chargePico,m.V]};
}
function chargingGraph(shapes,plot){
 const X=q=>60+260*q/plot.xMax,Y=v=>290-180*v/plot.yMax;
 shapes.push(line('charge-x',[60,290],[320,290],'axis'),line('charge-y',[60,110],[60,290],'axis'),curve('charge-curve',plot.line.map(([q,v])=>[X(q),Y(v)])),text('charge-label',190,80,'Voltage V (V) versus charge q (pC)'),text('charge-zero',60,309,'0'),text('charge-max-q',320,309,fmt(plot.xMax)+' pC'),text('charge-max-v',35,110,fmt(plot.yMax)));
 shapes.push(curve('work-area',plot.area.map(([q,v])=>[X(q),Y(v)]),'gold-curve'),point('voltage-point',[X(plot.probe[0]),Y(plot.probe[1])]));
}
function readouts(shapes,values){values.forEach((v,i)=>shapes.push(text('value-'+i,457,108+34*i,v)));}
export const energyScope=Object.freeze({
 'capacitor-energy':'Linear electrostatic capacitor with fixed positive C; quasistatic charge transfer from 0 to Q. Physical charge q is plotted in pC against voltage in V; the area under V(q) is work in pJ. No dielectric constitutive law, battery, dissipation, force or variable-C path.',
 'plate-energy-force':'Ideal vacuum parallel plates; fixed equal opposite free charges, uniform interior field, negligible fringing. Increasing separation requires positive external work. Electric attraction opposes increasing d. No voltage source, dielectric, torque or arbitrary conductor geometry.',
 'sphere-assembly-energy':'Prescribed uniform volume charge assembled in concentric shells from infinity at fixed density. Radius fraction x changes assembled charge to Qx³ and energy to U_final x⁵. Not a conducting shell, fixed-Q compression, nuclear stability or a point-charge self-energy.',
 'vacuum-field-energy':'Uniform static electric field in an authored vacuum region. Energy density ε₀E²/2 and U=uAL. Equivalent infinite-plane patch Q,V,C are comparisons, not a finite capacitor or arbitrary boundary solution. No material response, magnetic energy, spatially varying integral, radiation or battery accounting.'
});
export function energyDefinition(scene,values){
 const m=energyModel(scene,values),s=m.state,shapes=[];let title,context;
 if(scene==='capacitor-energy'){
  title='CHARGING WORK · AREA UNDER THE VOLTAGE CURVE';context='Fixed C · physical q axis in pC · V × pC = pJ · outlined triangle is work';
  chargingGraph(shapes,chargingWorkPlot(s));
  readouts(shapes,['Transferred q = '+fmt(m.charge*1e12)+' pC','V(q) = '+fmt(m.V)+' V','Work U = '+fmt(m.U*1e12)+' pJ','Final work = '+fmt(m.finalU*1e12)+' pJ',m.finalU?'U / Ufinal = '+fmt(s.r**2):'U/Ufinal undefined when Q = 0','Zero Q: voltage and work are zero']);
 }else if(scene==='plate-energy-force'){
  title='FIXED CHARGE · ENERGY AND PLATE ATTRACTION';context='Vacuum · uniform interior field · d/√A ≤ 0.1 · fixed Q · force arrows show direction only';
  const gap=45+70*s.r,left=175-gap/2,right=175+gap/2;
  shapes.push(line('left-plate',[left,110],[left,275],'axis'),line('right-plate',[right,110],[right,275],'axis'),text('positive',left,90,'+Q'),text('negative',right,90,'−Q'),arrow('attraction-left',[left,175],[left+22,175],'normal',m.Q!==0),arrow('attraction-right',[right,175],[right-22,175],'normal',m.Q!==0),line('gap',[left,300],[right,300]),text('gap-label',175,321,'d = '+fmt(s.r)+' mm'));
  readouts(shapes,['C = '+fmt(m.C*1e12)+' pF','U = '+fmt(m.U*1e12)+' pJ','V = '+fmt(m.V)+' V','E = '+fmt(m.E)+' V/m','External F = '+fmt(m.externalForce*1e9)+' nN','Electric F_d = '+fmt(m.electricForce*1e9)+' nN','Increasing d raises U at fixed Q']);
 }else if(scene==='sphere-assembly-energy'){
  title='UNIFORM SPHERE · BUILDING CONCENTRIC CHARGE SHELLS';context='Fixed density · grow radius xR · Qassembled = Qx³ · potential zero at infinity';
  shapes.push({id:'final-sphere',type:'circle',at:[145,182],radius:78});
  if(s.r>0)shapes.push({id:'assembled-sphere',type:'circle',at:[145,182],radius:78*s.r});
  shapes.push(line('radius',[145,182],[145+78*s.r,182]),text('radius-label',145,284,'r = '+fmt(m.radius)+' m'),text('fixed-density',145,307,'ρ = '+sci(m.rho)+' C/m³'));
  const X=x=>275+80*x,Y=y=>270-140*y;
  shapes.push(line('assembly-axis',[275,270],[355,270],'axis'),curve('assembly-energy',Array.from({length:81},(_,i)=>[X(i/80),Y((i/80)**5)])),point('assembly-value',[X(s.r),Y(s.r**5)]),text('assembly-label',315,91,m.finalU?'U/Ufinal = x⁵':'Energy shape x⁵ (Q = 0)'),text('assembly-x',315,307,'x: 0 → 1'));
  readouts(shapes,['Qassembled = '+fmt(m.charge/NC)+' nC','Uassembled = '+fmt(m.U*1e9)+' nJ','Ufinal = '+fmt(m.finalU*1e9)+' nJ','Shell potential = '+fmt(m.boundaryPotential)+' V','dU/dr = '+fmt(m.dUdr*1e9)+' nJ/m','No conducting redistribution']);
 }else{
  title='VACUUM ELECTRIC FIELD · LOCAL ENERGY DENSITY';context='Uniform static vacuum field in volume AL · illustrative region, not a general field solver';
  shapes.push(curve('region',[[75,110],[310,110],[310,275],[75,275],[75,110]]));
  for(const y of [145,190,235])shapes.push(arrow('E-'+y,[105,y],[280,y],'normal',m.E!==0));
  shapes.push(text('region-label',190,91,'Uniform E = '+fmt(m.E)+' V/m'),text('volume-label',190,305,'Volume AL = '+fmt(m.volume)+' m³'));
  readouts(shapes,['u = '+sci(m.density)+' J/m³','U = '+sci(m.U)+' J','Infinite-plane patch Q = '+sci(m.Q)+' C','Equivalent V = '+fmt(m.V)+' V','½ QV = '+sci(m.Q*m.V/2)+' J','Doubling E multiplies u by four']);
 }
 const first=energyControls(scene)[0],scale=220/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(text('title',300,29,title),line('track',[65,357],[285,357],'axis'),point('probe',[origin+s[first.key]*scale,357],true),text('track-label',175,339,first.label+(first.units?' ('+first.units+')':'')),text('context',300,423,context),text('hint',300,445,'Drag the black point · Arrow keys change the first control'));
 return {schemaVersion:1,scene,label:title,sourceScope:energyScope[scene],width:600,height:452,shapes,equations:[{id:scene,x:300,y:400}],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export const energyEquations=Object.freeze({
 'capacitor-energy':{plain:'dU = V dq · V(q) = q/C · U(q) = q²/(2C) = ½C V(q)²',tex:String.raw`dU=V\,dq\quad V(q)=\frac qC\quad U(q)=\frac{q^2}{2C}=\frac12C V(q)^2`},
 'plate-energy-force':{plain:'U = Q²d/(2ε₀A) · Fext = ∂U/∂d|Q = Q²/(2ε₀A) = ½ε₀E²A',tex:String.raw`U=\frac{Q^2d}{2\epsilon_0 A}\quad F_{\rm ext}=\left.\frac{\partial U}{\partial d}\right|_Q=\frac{Q^2}{2\epsilon_0 A}=\frac12\epsilon_0 E^2 A`},
 'sphere-assembly-energy':{plain:'dU = (KQr/r)dQr · Ufinal = 3KQ²/(5R) · U(x) = Ufinal x⁵',tex:String.raw`dU=\frac{KQ_r}{r}\,dQ_r\qquad U_{\rm final}=\frac{3KQ^2}{5R}\qquad U(x)=U_{\rm final}x^5`},
 'vacuum-field-energy':{plain:'u = ½ε₀E² · U = uAL = ½QV',tex:String.raw`u=\frac12\epsilon_0E^2\qquad U=uAL=\frac12QV`}
});
export function drawEnergy(scene,values){const d=energyDefinition(scene,values);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,400,energyEquations[scene].plain)]),metrics:[],label:d.label};}
export function energyChecks(scene){
 const states=[energyDefaults[scene]];for(const c of energyControls(scene))for(const v of [c.min,c.max])states.push({...energyDefaults[scene],[c.key]:v});
 for(const s of states){const m=energyModel(scene,s),close=(a,b)=>{if(Math.abs(a-b)>1e-24+1e-10*Math.max(Math.abs(a),Math.abs(b)))throw Error('Energy invariant failed.');};
  if(scene==='capacitor-energy')close(m.U,m.C*m.V*m.V/2);
  if(scene==='plate-energy-force'){close(m.U,m.density*m.A*m.d);close(m.externalForce,m.pressure*m.A);}
  if(scene==='sphere-assembly-energy'){close(m.U,m.insideFieldEnergy+m.outsideFieldEnergy);close(m.dUdr,m.boundaryPotential*m.dQdr);}
  if(scene==='vacuum-field-energy')close(m.U,m.Q*m.V/2);
  for(const p of energyDefinition(scene,s).shapes)if(p.type==='text'?/NaN|Infinity/.test(p.text):p.points?.flat().some(x=>!Number.isFinite(x)))throw Error('Nonfinite energy geometry.');
 }
 return {passed:true,states:states.length,method:'Declared unit relations and independent energy/force identities at control endpoints; numerical integration tests are separate.'};
}
