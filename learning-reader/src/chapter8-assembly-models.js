import {energyControls,energyModel,energyDefinition} from './energy-models.js';
import {K,EPS0} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

// Source setup and continuation reuse the fixed-density assembly kernel.
export const chapter8AssemblyNames=Object.freeze(['uniform-sphere-assembly-source']);
export const chapter8AssemblyDefaults=Object.freeze({'uniform-sphere-assembly-source':Object.freeze({r:.6,q:2,a:1})});
export function chapter8AssemblyControls(scene){if(!chapter8AssemblyNames.includes(scene))throw Error('Unknown source assembly.');return energyControls('sphere-assembly-energy');}
export function chapter8AssemblyModel(scene,values={}){chapter8AssemblyControls(scene);const m=energyModel('sphere-assembly-energy',values);return {...m,coulombConstant:K,epsilon0:EPS0,densityFinalU:4*Math.PI*m.rho**2*m.R**5/(15*EPS0),meanInverseDistance:6/(5*m.R),radiusRatio:m.state.r};}
export const chapter8AssemblyEquations={
 'ch8-shell-work-source':{plain:'dU = φ(r) dQ; Qr = 4πρr³/3; dQ = 4πρr² dr',tex:String.raw`dU=\phi(r)\,dQ,\qquad Q_r=\frac{4\pi\rho r^3}{3},\qquad dQ=4\pi\rho r^2\,dr`},
 'ch8-density-energy-source':{plain:'U(a) = 4πρ²a⁵/(15ε0) = 3KQ²/(5a)',tex:String.raw`U(a)=\frac{4\pi\rho^2a^5}{15\epsilon_0}=\frac{3KQ^2}{5a}`},
 'ch8-mean-inverse-distance-source':{plain:'⟨1/r12⟩ = 6/(5a); U(a) = ½KQ²⟨1/r12⟩',tex:String.raw`\left\langle\frac1{r_{12}}\right\rangle=\frac6{5a},\qquad U(a)=\frac12KQ^2\left\langle\frac1{r_{12}}\right\rangle`}
};
export const chapter8AssemblyEquationSources=Object.freeze({'ch8-shell-work-source':{sourcePages:[101,102],labels:['8.4','8.5'],kind:'Source shell-work setup and uniform-density substitution'},'ch8-density-energy-source':{sourcePages:[102],labels:['8.6','8.7'],kind:'Equivalent source density and total-charge forms'},'ch8-mean-inverse-distance-source':{sourcePages:[102],labels:[],kind:'Source inverse-distance average; authored intermediate pair-energy identity'}});
export function chapter8AssemblyDefinition(scene,values={}){
 const m=chapter8AssemblyModel(scene,values),d=energyDefinition('sphere-assembly-energy',values);
 const shapes=d.shapes.filter(s=>!['hint','energy-probe','probe-track','track','probe','track-label'].includes(s.id)&&!(s.type==='text'&&s.at[1]>=350));
 const text=(id,y,value)=>({id,type:'text',at:[300,y],text:value}),fmt=x=>x===0?'0':Number(x.toPrecision(6)).toString();
 shapes.push({id:'final-radius-label',type:'text',at:[145,92],text:'Final a = '+fmt(m.R)+' m'});
 shapes.push(text('assembly-role',350,'Bring the incoming thin shell from infinity; inner charge sets φ(r)'),text('fixed-density-growth',376,'Fixed density: Qr = Q(r/a)³ and U(r) = U(a)(r/a)⁵'),text('final-density-check',535,'Final U: charge form '+fmt(m.finalU*1e9)+' nJ; density form '+fmt(m.densityFinalU*1e9)+' nJ'),text('mean-final',561,'Final uniform ball: mean inverse pair distance = '+fmt(m.meanInverseDistance)+' m⁻¹'),text('average-limit',587,'Pair average describes the final ball; point-charge self terms are excluded'),{id:'probe-track',type:'segment',from:[70,632],to:[530,632],style:'axis'},{id:'energy-probe',type:'point',at:[70+460*m.state.r,632],probe:true},text('hint',665,'Move the assembled radius at fixed prescribed density'));
 return {...d,scene,height:690,label:'Uniform sphere · shell work, density forms and pair average',sourceScope:'Source setup on PDF101 and explicit continuation on PDF102. Reuses the reviewed fixed-density shell-assembly kernel. Positive final radius; zero final charge is allowed with zero work. Q and a controls choose a new prescribed-density case, not fixed-Q compression. Mean inverse separation refers to independently distributed pairs in the final uniform ball. No nuclear dynamics or finite point self term.',shapes,equations:[{id:'ch8-shell-work-source',x:300,y:421},{id:'ch8-density-energy-source',x:300,y:463},{id:'ch8-mean-inverse-distance-source',x:300,y:503}],metrics:[{label:'Work assembled so far',value:fmt(m.U*1e9)+' nJ'},{label:'Final work (charge and density agree)',value:fmt(m.finalU*1e9)+' nJ'},{label:'Final mean inverse separation',value:fmt(m.meanInverseDistance)+' m⁻¹'}],probe:{id:'energy-probe',parameter:'r',origin:70,scale:460,min:0,max:1}};
}
const escape=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function drawChapter8Assembly(scene,state){const d=chapter8AssemblyDefinition(scene,state);return {body:primitivesSVG(d.shapes)+d.equations.map(e=>`<text x="${e.x}" y="${e.y}" text-anchor="middle" font-size="11">${escape(chapter8AssemblyEquations[e.id].plain)}</text>`).join(''),height:d.height,label:d.label,metrics:d.metrics};}
export function chapter8AssemblyChecks(scene){for(const r of [0,.25,.6,1])for(const q of [0,2,5]){const m=chapter8AssemblyModel(scene,{r,q});if(Math.abs(m.finalU-m.densityFinalU)>1e-12||Math.abs(m.dUdr-m.boundaryPotential*m.dQdr)>1e-12)throw Error('Assembly identity failed.');}return {passed:true,method:'Density and infinitesimal shell-work identities; independent reference/native checks remain required.'};}
