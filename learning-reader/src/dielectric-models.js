import {EPS0} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';
export const dielectricNames=Object.freeze(['linear-dielectric-slab']);
export const dielectricDefaults=Object.freeze({'linear-dielectric-slab':{r:2,sigma:50,a:2,b:.5}});
export const dielectricScope='Static ideal parallel plates, uniform linear isotropic dielectric fully filling the gap, prescribed equal opposite free surface-charge densities and negligible fringing. Q=σfree A; varying χ or d at fixed σfree and A holds Q fixed, while varying A at fixed σfree changes Q. P=ε₀χE is prescribed, not derived microscopically. Uniform P gives opposite bound surface charges and zero volume bound charge. E₀ is a vacuum comparison at the same free surface-charge density and geometry, not a finite clearance. No partial filling, nonlinearity, anisotropy, dispersion, remanence, varying polarization, battery work or force.';
export function dielectricControls(scene){
 if(!dielectricNames.includes(scene))throw Error('Unknown dielectric model.');
 return [{key:'r',label:'Susceptibility χ',min:0,max:5,step:.1,units:''},{key:'sigma',label:'Prescribed free surface density σfree',min:0,max:100,step:5,units:'nC/m²'},{key:'a',label:'Plate area A',min:1,max:4,step:.1,units:'cm²'},{key:'b',label:'Plate separation d',min:.1,max:1,step:.05,units:'mm'}];
}
export function dielectricModel(scene,values={}){
 const s={...dielectricDefaults[scene],...values};
 for(const c of dielectricControls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max)throw Error('Invalid dielectric parameter: '+c.key);
 const chi=s.r,kappa=1+chi,free=s.sigma*1e-9,A=s.a*1e-4,d=s.b*1e-3,epsilon=EPS0*kappa;
 const E0=free/EPS0,E=free/epsilon,P=EPS0*chi*E,C=epsilon*A/d,Q=free*A,V=E*d;
 return {state:s,chi,kappa,free,A,d,epsilon,E0,E,P,C,Q,V,boundLeft:-P,boundRight:P,volumeBoundCharge:0,fieldRatio:1/kappa,capacitanceRatio:kappa,vacuumC:EPS0*A/d,vacuumV:E0*d};
}
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='axis')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const fmt=x=>x===0?'0':Number(x.toPrecision(4)).toString();
export function dielectricDefinition(scene,values){
 const m=dielectricModel(scene,values),shapes=[text('title',300,28,'LINEAR DIELECTRIC · FREE AND BOUND CHARGE'),{id:'slab',type:'curve',points:[[72,108],[276,108],[276,270],[72,270],[72,108]],style:'patch',fill:true},line('left-plate',[72,100],[72,278]),line('right-plate',[276,100],[276,278]),text('material',174,91,'Full-gap dielectric · κ = '+fmt(m.kappa)),text('free-left-label',50,295,'+σfree'),text('free-right-label',297,295,'−σfree'),text('bound-left-label',110,319,'σb = −P'),text('bound-right-label',245,319,'σb = +P')];
 for(const [i,y] of [132,178,224].entries()){
  shapes.push(text('free-left-'+i,53,y,m.free?'+':'0'),text('free-right-'+i,295,y,m.free?'−':'0'),text('bound-left-'+i,91,y,m.P?'−':'0'),text('bound-right-'+i,257,y,m.P?'+':'0'),arrow('E-'+i,[126,y-5],[126+96/m.kappa,y-5],'normal',m.E!==0));
 }
 shapes.push(text('field-direction',174,252,m.P?'E and P point right':m.E?'E points right; P = 0':'E = P = 0'));
 const rows=['E₀ vacuum = '+fmt(m.E0)+' V/m','E dielectric = '+fmt(m.E)+' V/m','P = '+fmt(m.P*1e9)+' nC/m²','ε₀E + P = '+fmt(m.free*1e9)+' nC/m²','V = '+fmt(m.V)+' V','C = '+fmt(m.C*1e12)+' pF','Q = '+fmt(m.Q*1e12)+' pC'];
 rows.forEach((v,i)=>shapes.push(text('value-'+i,440,105+i*28,v)));
 shapes.push(text('ratios',440,316,'Field factor = 1/κ; C/C₀ = κ'),text('track-label',174,347,'Susceptibility χ'),line('track',[65,365],[285,365]),{id:'probe',type:'point',at:[65+44*m.chi,365],probe:true},text('context',300,425,'Prescribed σfree · Q = σfree A · arrows show E/E₀ when charged'),text('hint',300,446,'Drag the black point · Arrow keys vary susceptibility'));
 return {schemaVersion:1,scene,label:'LINEAR DIELECTRIC RESPONSE',sourceScope:dielectricScope,width:600,height:452,shapes,equations:[{id:scene,x:300,y:398}],probe:{id:'probe',parameter:'r',origin:65,scale:44,min:0,max:5}};
}
export const dielectricEquations=Object.freeze({'linear-dielectric-slab':{plain:'P = ε₀χE · E = σfree/[ε₀(1+χ)] · C = ε₀(1+χ)A/d',tex:String.raw`P=\epsilon_0\chi E\quad E=\frac{\sigma_{\rm free}}{\epsilon_0(1+\chi)}\quad C=\frac{\epsilon_0(1+\chi)A}{d}`}});
export function drawDielectric(scene,values){const d=dielectricDefinition(scene,values);return {body:primitivesSVG([...d.shapes.filter(s=>!['context','hint'].includes(s.id)),text('equation',300,398,dielectricEquations[scene].plain)]),metrics:[],label:d.label};}
export function dielectricChecks(scene){
 const initial=dielectricDefaults[scene],states=[initial,...dielectricControls(scene).flatMap(c=>[c.min,c.max].map(v=>({...initial,[c.key]:v})))];
 const close=(x,y)=>{if(Math.abs(x-y)>1e-24+1e-10*Math.max(Math.abs(x),Math.abs(y)))throw Error('Dielectric invariant failed.');};
 for(const s of states){const m=dielectricModel(scene,s);close(EPS0*m.E+m.P,m.free);close(m.C*m.V,m.Q);close(m.boundLeft+m.boundRight,0);close(m.P,EPS0*m.chi*m.E);if(m.d/Math.sqrt(m.A)>.10000000001)throw Error('Plate geometry outside ideal bound.');for(const p of dielectricDefinition(scene,s).shapes)if(p.type==='text'?/NaN|Infinity/.test(p.text):p.points?.flat().some(x=>!Number.isFinite(x)))throw Error('Nonfinite dielectric geometry.');}
 return {passed:true,states:states.length,method:'Free/bound charge balance, constitutive law, opposite-face cancellation and finite zero-charge limit at all control endpoints.'};
}
