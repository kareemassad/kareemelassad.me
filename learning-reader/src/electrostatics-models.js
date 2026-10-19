import {K,EPS0,NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

const c=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export const electrostaticsDefaults=Object.freeze({
 'volume-field':{n:3,r:2,q:1},'volume-potential':{n:3,r:2,q:1},
 'potential-reference':{r:1.4,q:1,b:5},'potential-sum':{r:0,a:1,b:-1},
 'potential-local':{r:.5,a:1,b:1},'radial-power':{r:1.5,q:1,b:2}
});
export const electrostaticsNames=Object.freeze(Object.keys(electrostaticsDefaults));
export function electrostaticsControls(scene){
 if(['volume-field','volume-potential'].includes(scene))return [c('n','Cells per cube edge N',1,6,1),c('r','Observation x',1,3,.05,'m'),c('q','Volume density ρ',-2,2,.1,'nC/m³')];
 if(scene==='potential-reference')return [c('r','Observation radius r',.5,3,.05,'m'),c('q','Source charge Q',-2,2,.1,'nC'),c('b','Potential offset C',-10,10,.5,'V')];
 if(scene==='potential-sum')return [c('r','Observation x at y = 1 m',-1,1,.05,'m'),c('a','Left charge Q₁',-2,2,.1,'nC'),c('b','Right charge Q₂',-2,2,.1,'nC')];
 if(scene==='potential-local')return [c('r','Finite step h',.02,1,.02,'m'),c('a','Initial slope α',-2,2,.1,'V/m'),c('b','Curvature κ',-2,2,.1,'V/m²')];
 if(scene==='radial-power')return [c('r','Observation radius r',.5,3,.05,'m'),c('b','Radial decay exponent p',1,3,.05),c('q','Amplitude charge scale Q',.5,2,.1,'nC')];
 throw Error('Unknown electrostatics model.');
}
export function volumeSum(n,x,rho){
 const cells=[],dv=1/n**3,dq=rho*NC*dv,E=[0,0,0];let potential=0;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++)for(let k=0;k<n;k++){
  const center=[-.5+(i+.5)/n,-.5+(j+.5)/n,-.5+(k+.5)/n],d=[x-center[0],-center[1],-center[2]],distance=Math.hypot(...d),field=d.map(v=>K*dq*v/distance**3);
  field.forEach((v,a)=>E[a]+=v);const phi=K*dq/distance;potential+=phi;cells.push({center,dq,dv,distance,field,phi});
 }
 return {cells,E,potential,totalCharge:rho*NC,dv,dq};
}
export function electrostaticsModel(scene,state={}){
 const s={...electrostaticsDefaults[scene],...state};
 for(const p of electrostaticsControls(scene))if(!Number.isFinite(s[p.key])||s[p.key]<p.min||s[p.key]>p.max||p.step===1&&!Number.isInteger(s[p.key]))throw Error('Invalid electrostatics parameter: '+p.key);
 let m;
 if(['volume-field','volume-potential'].includes(scene))m=volumeSum(s.n,s.r,s.q);
 else if(scene==='potential-reference')m={phi:r=>K*s.q*NC/r+s.b,base:r=>K*s.q*NC/r,E:K*s.q*NC/s.r**2,difference:K*s.q*NC*(1/s.r-1),reference:K*s.q*NC+s.b};
 else if(scene==='potential-sum'){
  const P=[s.r,1],sources=[[-1,0],[1,0]],charges=[s.a,s.b],terms=sources.map((p,i)=>{const d=P.map((v,a)=>v-p[a]),distance=Math.hypot(...d);return {phi:K*charges[i]*NC/distance,E:d.map(v=>K*charges[i]*NC*v/distance**3)};});
  m={P,sources,terms,phi:terms.reduce((a,t)=>a+t.phi,0),E:[0,1].map(i=>terms.reduce((a,t)=>a+t.E[i],0))};
 }else if(scene==='potential-local')m={phi:x=>s.a*x+s.b*x*x/2,local:s.a,secant:s.a+s.b*s.r/2,localField:-s.a,averageField:-s.a-s.b*s.r/2,delta:s.a*s.r+s.b*s.r*s.r/2,firstOrder:s.a*s.r};
 else {const referenceRadius=1,E0=K*s.q*NC/referenceRadius**2,E=r=>E0*(r/referenceRadius)**(-s.b),phi=r=>s.b===1?-E0*referenceRadius*Math.log(r/referenceRadius):E0*referenceRadius*((r/referenceRadius)**(1-s.b)-1)/(s.b-1);m={E0,E,phi,flux:r=>4*Math.PI*r*r*E(r),divergence:(2-s.b)*E(s.r)/s.r,referenceRadius};}
 return {...m,state:s};
}
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const arrow=(id,from,to,style='field')=>({id,type:'arrow',from,to,style,visible:Math.hypot(to[0]-from[0],to[1]-from[1])>1e-9});
function graph(shapes,id,series,{xmin=0,xmax=1,left=65,right=330,top=105,bottom=290,title='',scale}={}){
 const values=series.map(fn=>Array.from({length:121},(_,i)=>{const x=xmin+(xmax-xmin)*i/120;return [x,fn(x)];})),limit=scale||Math.max(.1,...values.flat().map(p=>Math.abs(p[1])))*1.1;
 const gx=x=>left+(x-xmin)/(xmax-xmin)*(right-left),gy=y=>(top+bottom)/2-y/limit*(bottom-top)/2;
 shapes.push(line(id+'-x',[left,gy(0)],[right,gy(0)],'axis'),line(id+'-y',[left,top],[left,bottom],'axis'),text(id+'-title',(left+right)/2,top-25,title),text(id+'-xmin',left,bottom+18,fmt(xmin)),text(id+'-xmax',right,bottom+18,fmt(xmax)),text(id+'-ymax',left-23,top,fmt(limit)),text(id+'-ymin',left-23,bottom,fmt(-limit)));
 values.forEach((v,i)=>shapes.push(curve(id+'-curve-'+i,v.map(([x,y])=>[gx(x),gy(y)]),i?'gold-curve':'blue-curve')));return {gx,gy};
}
const rows=(shapes,values)=>values.forEach((v,i)=>shapes.push(text('readout-'+i,457,110+42*i,v)));
export function electrostaticsDefinition(scene,state){
 const m=electrostaticsModel(scene,state),s=m.state,shapes=[];let title,context,equation;
 if(['volume-field','volume-potential'].includes(scene)){
  title=scene==='volume-field'?'CHARGE CELLS · VECTOR COULOMB SUM':'CHARGE CELLS · SCALAR POTENTIAL SUM';equation=scene;context='Uniform 1 m³ cube · midpoint cells in 3D · P outside · approximation, not exact integral';
  const left=75,top=105,size=125;
  for(let i=0;i<=s.n;i++){shapes.push(line('cell-v-'+i,[left+size*i/s.n,top],[left+size*i/s.n,top+size]),line('cell-h-'+i,[left,top+size*i/s.n],[left+size,top+size*i/s.n]));}
  shapes.push(point('P',[260,167]),text('P-label',260,143,'P: x = '+fmt(s.r)+' m'),text('cube-view',137,263,'Central plane slice'),text('cube-count',137,286,s.n**3+' equal 3D cells · ΔV = '+fmt(m.dv)+' m³'),text('charge-cell',137,309,'Δq = '+fmt(m.dq/NC)+' nC'));
  const value=scene==='volume-field'?m.E[0]:m.potential;
  rows(shapes,['Total Q = '+fmt(m.totalCharge/NC)+' nC',scene==='volume-field'?'Σ E_x = '+fmt(value)+' V/m':'Σ φ = '+fmt(value)+' V',scene==='volume-field'?'Σ E_y = Σ E_z = 0':'Scalar terms add with charge sign','Uniform transverse symmetry','No cells at P · no singularity']);
  if(scene==='volume-field')shapes.push(arrow('total-E',[260,167],[260+36*Math.sign(value),167]),text('arrow-key',410,313,'Arrow direction only · all cells enter the sum'));
  else shapes.push(text('scalar-key',410,313,'Scalar terms · no arrow-length sum'));
 }else if(scene==='potential-reference'){
  title='POTENTIAL REFERENCE · SAME FIELD';equation=scene;context='Fixed point Q · φ(r)=KQ/r+C · reference radius 1 m · arrows and curve use declared units';
  const g=graph(shapes,'offset',[m.phi,m.base],{xmin:.5,xmax:3,title:'φ (V) against r (m)',scale:50});shapes.push(point('value',[g.gx(s.r),g.gy(m.phi(s.r))]));
  rows(shapes,['Blue: φ = '+fmt(m.phi(s.r))+' V','Gold: KQ/r · C = '+fmt(s.b)+' V','φ(1 m) = '+fmt(m.reference)+' V','φ(r) − φ(1 m) = '+fmt(m.difference)+' V','E_r = '+fmt(m.E)+' V/m','C changes no derivative or force']);
 }else if(scene==='potential-sum'){
  title='SCALAR POTENTIAL · VECTOR FIELD';equation=scene;context='Fixed points (−1,0),(1,0) m · P=(x,1) m · φ=0 at infinity · no source at P';
  const origin=[170,230],at=p=>[origin[0]+60*p[0],origin[1]-60*p[1]];
  m.sources.forEach((p,i)=>shapes.push(point('source-'+i,at(p)),text('charge-'+i,at(p)[0],258,'Q'+(i+1)+' = '+fmt(i?s.b:s.a)+' nC')));shapes.push(point('P',at(m.P)),text('P-label',at(m.P)[0],at(m.P)[1]-20,'P'));
  m.terms.forEach((t,i)=>shapes.push(arrow('E-'+i,at(m.P),[at(m.P)[0]+2*t.E[0],at(m.P)[1]-2*t.E[1]],i?'sample-field':'normal')));shapes.push(arrow('total',at(m.P),[at(m.P)[0]+2*m.E[0],at(m.P)[1]-2*m.E[1]]),text('arrow-scale',170,310,'Arrows: 2 px per V/m · black: total E'));
  rows(shapes,['φ₁ = '+fmt(m.terms[0].phi)+' V','φ₂ = '+fmt(m.terms[1].phi)+' V','φ₁ + φ₂ = '+fmt(m.phi)+' V','E_x = '+fmt(m.E[0])+' V/m','E_y = '+fmt(m.E[1])+' V/m','Zero φ need not mean zero E']);
 }else if(scene==='potential-local'){
  title='LOCAL DERIVATIVE · FINITE STEP';equation=scene;context='Authored φ(x)=αx+κx²/2 V · y,z uniform · start x=0 · finite correction is explicit';
  const g=graph(shapes,'local',[m.phi,x=>s.a*x],{title:'Blue: φ (V) · gold: local tangent',scale:3.4});shapes.push(line('secant',[g.gx(0),g.gy(0)],[g.gx(s.r),g.gy(m.delta)],'reference'),point('end',[g.gx(s.r),g.gy(m.delta)]));
  rows(shapes,['Δφ = '+fmt(m.delta)+' V','αh = '+fmt(m.firstOrder)+' V','Local ∂xφ(0) = '+fmt(m.local)+' V/m','Finite Δφ/h = '+fmt(m.secant)+' V/m','E_x(0) = '+fmt(m.localField)+' V/m','As h → 0: secant → local slope']);
 }else{
  title='RADIAL FIELD · POTENTIAL FOR MANY POWERS';equation=scene;context='Mathematical radial family at r>0 · r₀=1 m · p≠2 is not a vacuum Coulomb field';
  const g=graph(shapes,'power',[r=>m.flux(r)/m.flux(1),()=>1],{xmin:.5,xmax:3,title:'Flux ratio Φ(r)/Φ(1 m) · r (m)'});shapes.push(point('ratio',[g.gx(s.r),g.gy(m.flux(s.r)/m.flux(1))]));
  rows(shapes,['p = '+fmt(s.b)+' · φ(1 m) = 0 V','E_r = '+fmt(m.E(s.r))+' V/m','φ(r) = '+fmt(m.phi(s.r))+' V','Flux = '+fmt(m.flux(s.r))+' V m','curl E = 0 outside origin','Radius-independent flux only p = 2']);
 }
 const first=electrostaticsControls(scene)[0],origin=65-first.min*210/(first.max-first.min),scale=210/(first.max-first.min);
 shapes.push(line('track',[65,357],[275,357],'axis'),point('probe',[origin+s[first.key]*scale,357],true),text('track-label',170,336,first.label+(first.units?' ('+first.units+')':'')),text('title',300,27,title),text('context',300,423,context),text('hint',300,445,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:equation,x:300,y:400}],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export function drawElectrostatics(scene,state){const d=electrostaticsDefinition(scene,state);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,400,electrostaticsEquations[scene].plain)]),metrics:[],label:d.label};}
export function electrostaticsChecks(scene){
 const states=[electrostaticsDefaults[scene]];for(const p of electrostaticsControls(scene))for(const v of [p.min,p.step===1?Math.round((p.min+p.max)/2):(p.min+p.max)/2,p.max])states.push({...electrostaticsDefaults[scene],[p.key]:v});
 let checks=0;
 for(const state of states){const m=electrostaticsModel(scene,state);if(['volume-field','volume-potential'].includes(scene)){if(Math.abs(m.cells.reduce((a,v)=>a+v.dq,0)-m.totalCharge)>1e-20||Math.abs(m.E[1])+Math.abs(m.E[2])>1e-12)throw Error('Cell conservation or transverse symmetry failed.');checks+=2;}
  if(scene==='potential-local'&&Math.abs(m.delta-m.firstOrder-state.b*state.r**2/2)>1e-12)throw Error('Finite slope failed.');
  if(scene==='potential-reference'&&Math.abs(m.phi(state.r)-m.reference-m.difference)>1e-12)throw Error('Potential offset failed.');
  if(scene==='potential-sum'&&Math.abs(m.phi-m.terms[0].phi-m.terms[1].phi)>1e-12)throw Error('Scalar sum failed.');
  if(scene==='radial-power'){const h=1e-5,x=state.r,derivative=(m.phi(x+h)-m.phi(x-h))/(2*h);if(Math.abs(derivative+m.E(x))/Math.max(1,Math.abs(m.E(x)))>1e-8)throw Error('Radial potential derivative failed.');}
  for(const p of electrostaticsDefinition(scene,state).shapes){if(p.type==='text'&&/NaN|Infinity/.test(p.text))throw Error('Nonfinite readout.');if(p.points&&p.points.flat().some(v=>!Number.isFinite(v)))throw Error('Nonfinite curve.');}checks++;
 }
 return {passed:true,states:states.length,checks,method:'Charge conservation, scalar sums, finite-step correction and independent finite-difference derivative.'};
}
export const electrostaticsEquations=Object.freeze({
 'volume-field':{plain:'Δq=ρΔV · E≈Σ K Δq d/|d|³',tex:String.raw`\Delta q=\rho\Delta V\qquad\mathbf E\approx\sum K\Delta q\frac{\mathbf d}{|\mathbf d|^3}`},
 'volume-potential':{plain:'φ≈Σ KρΔV/|d| → ∫ Kρ/|d| dV',tex:String.raw`\phi\approx\sum\frac{K\rho\Delta V}{|\mathbf d|}\quad\longrightarrow\quad\int\frac{K\rho}{|\mathbf d|}\,dV`},
 'potential-reference':{plain:'φ=KQ/r+C · E_r=KQ/r²',tex:String.raw`\phi=\frac{KQ}{r}+C\qquad E_r=-\partial_r\phi=\frac{KQ}{r^2}`},
 'potential-sum':{plain:'φ=φ₁+φ₂ · E=E₁+E₂=−∇φ',tex:String.raw`\phi=\phi_1+\phi_2\qquad\mathbf E=\mathbf E_1+\mathbf E_2=-\nabla\phi`},
 'potential-local':{plain:'Δφ=αh+κh²/2 · E_x(0)=−α',tex:String.raw`\Delta\phi=\alpha h+\frac{\kappa h^2}{2}\qquad E_x(0)=-\alpha`},
 'radial-power':{plain:'E_r=E₀(r/r₀)^(−p) · φ(r)=−∫r₀ʳ E_r ds · Φ∝r^(2−p)',tex:String.raw`E_r=E_0(r/r_0)^{-p}\quad\phi(r)=-\int_{r_0}^{r}E_r(s)\,ds\quad\Phi\propto r^{2-p}`}
});
