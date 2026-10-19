import {K,EPS0,NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

// Original bounded examples. All coordinates and fields are in SI unless a
// control declares its conversion. No source text, solver or provider code.
const c=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export const circumstancesDefaults=Object.freeze({
 'poisson-curvature':{r:.5,a:1,b:-1,q:0},
 'dipole-far':{r:3,a:.6,b:45,q:1},
 'multipole-cancellation':{r:4,a:.6,n:1},
 'cosine-sphere':{r:.5,q:1,a:1},
 'image-plane':{r:1,a:1,q:1},
 'image-sphere':{r:45,a:1,b:2,n:0},
 'plate-capacitance':{r:.5,a:2,q:2},
 'curvature-spheres':{r:.5,a:2,q:10},
 'complex-quadratic':{r:.6,b:.5,a:2,n:0},
 'plasma-linear':{r:0,a:1,b:1,n:0},
 'plasma-continuity':{r:0,a:1,b:1,n:.25},
 'debye-planar':{r:1,a:1,b:300,q:0.08},
 'grid-harmonic':{r:.15,a:1,n:1,b:.125}
});
export const circumstancesNames=Object.freeze(Object.keys(circumstancesDefaults));
export function circumstancesControls(scene){
 const controls={
  'poisson-curvature':[c('r','Probe x at y = 0.4, z = 0.3',0,1,.02,'m'),c('a','x curvature α',-2,2,.1,'V/m²'),c('b','y curvature β',-2,2,.1,'V/m²'),c('q','z curvature γ',-2,2,.1,'V/m²')],
  'dipole-far':[c('r','Distance from midpoint r',2,8,.05,'m'),c('a','Charge separation d',.2,1,.02,'m'),c('b','Angle from +z θ',0,180,1,'°'),c('q','Positive charge magnitude Q',.5,2,.05,'nC')],
  'multipole-cancellation':[c('r','Observation +x distance R',2,8,.05,'m'),c('a','Source offset a',.2,1,.02,'m'),c('n','Distribution: charged / dipole / quadrupole',0,2,1)],
  'cosine-sphere':[c('r','Axis position z / R',-2,2,.02),c('q','Surface amplitude σ₀',-2,2,.1,'nC/m²'),c('a','Sphere radius R',.5,1.5,.05,'m')],
  'image-plane':[c('r','Surface distance ρ / h',0,3,.02),c('a','Real charge height h',.5,2,.05,'m'),c('q','Real charge Q',-2,2,.1,'nC')],
  'image-sphere':[c('r','Surface probe angle θ',0,180,1,'°'),c('a','Sphere radius R',.5,1.5,.05,'m'),c('b','Real charge distance d / R',1.5,4,.05),c('n','Sphere: grounded / isolated neutral',0,1,1)],
  'plate-capacitance':[c('r','Plate separation d',.1,1,.02,'mm'),c('a','Plate area A',1,4,.1,'cm²'),c('q','Plate charge magnitude Q',.5,5,.1,'pC')],
  'curvature-spheres':[c('r','Small sphere radius b',.2,1,.02,'m'),c('a','Large sphere radius a',1.5,3,.05,'m'),c('q','Common potential V',1,20,.5,'V')],
  'complex-quadratic':[c('r','Probe x',-1,1,.02,'m'),c('b','Probe y',-1,1,.02,'m'),c('a','Polynomial scale κ',.5,3,.1,'V/m²'),c('n','Potential: U / V',0,1,1)],
  'plasma-linear':[c('r','Phase ωₚt',0,360,1,'°'),c('a','Electron density n₀',.5,4,.1,'10¹² m⁻³'),c('b','Displacement amplitude s₀',.5,2,.1,'mm'),c('n','Spatial probe x / L',0,1,.005)],
  'debye-planar':[c('r','Surface distance x / D',0,4,.02),c('a','Each ion density n₀',.5,4,.1,'10¹⁸ m⁻³'),c('b','Temperature T',250,400,5,'K'),c('q','Surface ratio eφ₀ / kT',-.1,.1,.005)],
  'grid-harmonic':[c('r','Height z / a',0,1,.01),c('a','Wire spacing a',.5,2,.05,'m'),c('n','Harmonic number n',1,4,1),c('b','Horizontal position x / a',0,1,.005)]
 };
 if(scene==='plasma-continuity')return controls['plasma-linear'];
 if(!controls[scene])throw Error('Unknown circumstances model.');return controls[scene];
}
const ECHARGE=1.602176634e-19,ME=9.1093837139e-31,KB=1.380649e-23;
export function pointTerms(P,sources){
 const terms=sources.map(({at,Q})=>{const d=P.map((v,i)=>v-at[i]),length=Math.hypot(...d);if(length<1e-12)throw Error('Source singularity excluded.');return {phi:K*Q/length,E:d.map(v=>K*Q*v/length**3)};});
 return {phi:terms.reduce((v,t)=>v+t.phi,0),E:P.map((_,i)=>terms.reduce((v,t)=>v+t.E[i],0)),terms};
}
export function circumstancesModel(scene,state={}){
 const s={...circumstancesDefaults[scene],...state};
 for(const p of circumstancesControls(scene))if(!Number.isFinite(s[p.key])||s[p.key]<p.min||s[p.key]>p.max||['n'].includes(p.key)&&p.step===1&&!Number.isInteger(s[p.key]))throw Error('Invalid circumstances parameter: '+p.key);
 let m;
 if(scene==='poisson-curvature'){
  const curvatures=[s.a,s.b,s.q],P=[s.r,.4,.3],laplacian=curvatures.reduce((a,b)=>a+b,0);
  m={curvatures,P,phi:P=>P.reduce((v,x,i)=>v+curvatures[i]*x*x/2,0),E:P.map((v,i)=>-curvatures[i]*v),laplacian,rho:-EPS0*laplacian,curl:[0,0,0]};
 }else if(scene==='dipole-far'){
  const angle=s.b*Math.PI/180,P=[s.r*Math.sin(angle),s.r*Math.cos(angle)],moment=s.q*NC*s.a,sources=[{at:[0,s.a/2],Q:s.q*NC},{at:[0,-s.a/2],Q:-s.q*NC}],exact=pointTerms(P,sources),unit=P.map(v=>v/s.r),approxE=unit.map((v,i)=>K*moment/s.r**3*(3*unit[1]*v-(i===1?1:0)));
  m={P,sources,moment,exact,approxPhi:K*moment*unit[1]/s.r**2,approxE,relativeError:Math.hypot(...approxE.map((v,i)=>v-exact.E[i]))/Math.hypot(...exact.E),ratio:s.r/s.a};
 }else if(scene==='multipole-cancellation'){
  const charges=s.n===0?[1,1]:s.n===1?[-1,1]:[1,1,-2],locations=s.n===2?[-s.a,s.a,0]:[-s.a,s.a],sources=charges.map((v,i)=>({at:[locations[i],0],Q:v*NC})),Q=sources.reduce((v,t)=>v+t.Q,0),p=sources.reduce((v,t)=>v+t.Q*t.at[0],0),exact=pointTerms([s.r,0],sources),monopole=K*Q/s.r,dipole=K*p/s.r**2;
  m={sources,Q,p,exact,monopole,dipole,truncated:monopole+dipole};
 }else if(scene==='cosine-sphere'){
  const R=s.a,z=s.r*R,sigma=s.q*NC,p=4*Math.PI*sigma*R**3/3,inside=Math.abs(s.r)<1,surface=Math.abs(Math.abs(s.r)-1)<1e-10;
  m={R,z,sigma,p,surface,inside,phi:inside||surface?sigma*z/(3*EPS0):K*p*z/Math.abs(z)**3,E:surface?null:inside?-sigma/(3*EPS0):2*K*p/Math.abs(z)**3,Einside:-sigma/(3*EPS0),Eoutside:2*sigma/(3*EPS0),net:0};
 }else if(scene==='image-plane'){
  const h=s.a,rho=s.r*h,Q=s.q*NC,sources=[{at:[0,h],Q},{at:[0,-h],Q:-Q}],surface=pointTerms([rho,0],sources),sigma=EPS0*surface.E[1],force=-K*Q*Q/(4*h*h);
  m={h,rho,Q,sources,surface,sigma,force,totalInduced:-Q,sigmaAt:u=>-Q*h/(2*Math.PI*(u*u+h*h)**1.5)};
 }else if(scene==='image-sphere'){
  const R=s.a,d=s.b*R,Q=NC,qi=-Q*R/d,xi=R*R/d,qc=s.n?-qi:0,angle=s.r*Math.PI/180,P=[R*Math.cos(angle),R*Math.sin(angle)],sources=[{at:[d,0],Q},{at:[xi,0],Q:qi},...(qc?[{at:[0,0],Q:qc}]:[])],surface=pointTerms(P,sources),normal=P.map(v=>v/R),En=surface.E.reduce((v,e,i)=>v+e*normal[i],0),Et=surface.E[0]*-normal[1]+surface.E[1]*normal[0],force=K*Q*(qi/(d-xi)**2+qc/d**2);
  m={R,d,Q,qi,xi,qc,P,sources,surface,En,Et,sigma:EPS0*En,force,totalSphere:qi+qc,expectedPhi:K*qc/R};
 }else if(scene==='plate-capacitance'){
  const d=s.r*1e-3,A=s.a*1e-4,Q=s.q*1e-12,C=EPS0*A/d,E=Q/(EPS0*A),V=E*d;
  m={d,A,Q,C,E,V,sigma:Q/A,aspect:d/Math.sqrt(A)};
 }else if(scene==='curvature-spheres'){
  const Rbig=s.a,Rsmall=s.r,V=s.q,Qbig=V*Rbig/K,Qsmall=V*Rsmall/K;
  m={Rbig,Rsmall,V,Qbig,Qsmall,Ebig:V/Rbig,Esmall:V/Rsmall,fieldRatio:Rbig/Rsmall,chargeRatio:Rsmall/Rbig};
 }else if(scene==='complex-quadratic'){
  const x=s.r,y=s.b,k=s.a,U=k*(x*x-y*y),V=2*k*x*y,gU=[2*k*x,-2*k*y],gV=[2*k*y,2*k*x],gradient=s.n?gV:gU;
  m={x,y,k,U,V,gU,gV,gradient,E:gradient.map(v=>-v),dot:gU.reduce((v,a,i)=>v+a*gV[i],0),laplacian:0,critical:x===0&&y===0};
 }else if(['plasma-linear','plasma-continuity'].includes(scene)){
  // One sinusoidal small-amplitude displacement mode, L=1 m. The spatial
  // density relation is linearized, not exact density at displaced coordinates.
  const n0=s.a*1e12,s0=s.b*1e-3,L=1,k=2*Math.PI/L,phase=s.r*Math.PI/180,x=s.n*L,omega=Math.sqrt(n0*ECHARGE**2/(EPS0*ME)),spatial=Math.cos(k*x),displacement=s0*spatial*Math.cos(phase),velocity=-omega*s0*spatial*Math.sin(phase),slope=-k*s0*Math.sin(k*x)*Math.cos(phase),rho=n0*ECHARGE*slope,E=n0*ECHARGE*displacement/EPS0,force=-ECHARGE*E,acceleration=-(omega**2)*displacement;
  m={n0,s0,L,k,phase,x,omega,frequency:omega/(2*Math.PI),time:phase/omega,displacement,velocity,slope,rho,E,force,acceleration,density:n0*(1-slope),maxSlope:k*s0};
 }else if(scene==='debye-planar'){
  // Matches the source planar half-space and its two monovalent ion species.
  // Source uses vacuum epsilon; no water-permittivity or chemistry prediction.
  const n0=s.a*1e18,T=s.b,D=Math.sqrt(EPS0*KB*T/(2*n0*ECHARGE**2)),phi0=s.q*KB*T/ECHARGE,x=s.r*D,decay=Math.exp(-s.r),phi=phi0*decay,E=phi/D,rho=-EPS0*phi/(D*D),sigma=EPS0*phi0/D;
  m={n0,T,D,phi0,x,decay,phi,E,rho,sigma,linearPlus:n0*(1-s.q*decay),linearMinus:n0*(1+s.q*decay),nonlinearRho:-2*n0*ECHARGE*Math.sinh(s.q*decay),inducedToX:-sigma*(1-decay),totalInducedPerArea:-sigma};
 }else{
  const a=s.a,n=s.n,z=s.r*a,x=s.b*a,k=2*Math.PI*n/a,A=1,E0=1,decay=Math.exp(-k*z),theta=k*x,phi=-E0*z+A*decay*Math.cos(theta),Ex=A*k*decay*Math.sin(theta),Ez=E0+A*k*decay*Math.cos(theta);
  m={a,n,z,x,k,A,E0,decay,phi,E:[Ex,Ez],length:1/k,dxx:-k*k*A*decay*Math.cos(theta),dzz:k*k*A*decay*Math.cos(theta),at:(u,h)=>-E0*h+A*Math.exp(-k*h)*Math.cos(k*u)};
 }
 return {...m,state:s};
}
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString();
const t=(id,x,y,text)=>({id,type:'text',at:[x,y],text});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const pt=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const arrow=(id,from,vector,scale,style='field')=>({id,type:'arrow',from,to:[from[0]+vector[0]*scale,from[1]-vector[1]*scale],style,visible:Math.hypot(...vector)>1e-12});
const rows=(shapes,values)=>values.forEach((value,i)=>shapes.push(t('readout-'+i,449,104+30*i,value)));
function graph(shapes,id,functions,{xmin=0,xmax=4,title='',limit=1.15}={}){
 const gx=x=>55+(x-xmin)/(xmax-xmin)*250,gy=y=>190-y/limit*95;
 shapes.push(line(id+'-x',[55,190],[305,190],'axis'),line(id+'-y',[55,95],[55,285],'axis'),t(id+'-title',180,72,title),t(id+'-start',55,305,fmt(xmin)),t(id+'-end',305,305,fmt(xmax)),t(id+'-max',32,100,fmt(limit)),t(id+'-zero',32,194,'0'),t(id+'-min',30,285,fmt(-limit)));
 functions.forEach((fn,i)=>shapes.push(curve(id+'-curve-'+i,Array.from({length:161},(_,j)=>{const x=xmin+(xmax-xmin)*j/160;return [gx(x),gy(fn(x))];}),i?'gold-curve':'blue-curve')));return {gx,gy};
}
export function circumstancesDefinition(scene,state){
 const m=circumstancesModel(scene,state),s=m.state,shapes=[];let title,context;
 if(scene==='poisson-curvature'){
  title='POISSON EQUATION · SUM ALL THREE CURVATURES';context='Authored quadratic potential in 3D · local example · uniform ρ · boundary values not solved';
  shapes.push(line('zero',[65,190],[305,190],'axis'),t('bar-title',185,75,'Each second derivative (V/m²)'));
  m.curvatures.forEach((v,i)=>{const x=95+i*85;shapes.push(line('bar-'+i,[x,190],[x,190-40*v],'field'),t('bar-value-'+i,x,190-40*v+(v<0?20:-13),fmt(v)),t('bar-label-'+i,x,295,['∂²xφ','∂²yφ','∂²zφ'][i]));});
  rows(shapes,['∇²φ = '+fmt(m.laplacian)+' V/m²','ρ = '+fmt(m.rho/NC)+' nC/m³','φ(P) = '+fmt(m.phi(m.P))+' V','E_x(P) = '+fmt(m.E[0])+' V/m','E_y(P) = '+fmt(m.E[1])+' V/m','E_z(P) = '+fmt(m.E[2])+' V/m','Trace 0 ⇒ local charge density 0']);
 }else if(scene==='dipole-far'){
  title='FINITE CHARGE PAIR · COMPARE FAR DIPOLE';context='Exact blue / dipole gold · arrows auto-scale together · magnitude is reported below';
  const at=p=>[170+p[0]*16,200-p[1]*16],P=at(m.P),scale=50/Math.max(.01,Math.hypot(...m.exact.E),Math.hypot(...m.approxE));
  shapes.push(line('axis',[170,75],[170,280],'axis'),line('radius',[170,200],P),pt('P',P),t('P-label',P[0]+10,P[1]-20,'P'),arrow('moment-direction',[100,260],[0,1],36,'background'),t('moment-label',100,279,'p along +z'));
  m.sources.forEach((v,i)=>shapes.push(pt('source-'+i,at(v.at)),t('charge-'+i,130,at(v.at)[1]+(i?15:-12),i?'−Q':'+Q')));
  shapes.push(arrow('exact-E',P,m.exact.E,scale,'normal'),arrow('dipole-E',P,m.approxE,scale,'sample-field'),t('scale',449,339,'E scale: '+fmt(scale)+' px per V/m'));
  rows(shapes,['p = Qd = '+fmt(m.moment/NC)+' nC m','p · n̂ = '+fmt(m.moment/NC*m.P[1]/s.r)+' nC m','r / d = '+fmt(m.ratio),'Exact φ = '+fmt(m.exact.phi)+' V','Dipole φ = '+fmt(m.approxPhi)+' V','Dipole E_x = '+fmt(m.approxE[0])+' V/m','Dipole E_z = '+fmt(m.approxE[1])+' V/m','Vector error = '+fmt(100*m.relativeError)+'%','|E_exact| = '+fmt(Math.hypot(...m.exact.E))+' V/m']);
  for(const shape of shapes.filter(p=>p.id.startsWith('readout-')))shape.at[1]=85+Number(shape.id.split('-').at(-1))*26;
 }else if(scene==='multipole-cancellation'){
  title='MONOPOLE · DIPOLE · NEGLECTED TERMS';context='Held point-source examples on x axis · P to the right · truncation is not an exact field';
  const at=x=>[110+25*x,190];shapes.push(line('axis',[55,190],[320,190],'axis'),pt('P',at(s.r)),t('P-label',at(s.r)[0],165,'P'));
  m.sources.forEach((source,i)=>shapes.push(pt('charge-'+i,at(source.at[0])),t('charge-label-'+i,at(source.at[0])[0],225+(i===2?22:0),fmt(source.Q/NC)+' nC')));
  rows(shapes,['Q_total = '+fmt(m.Q/NC)+' nC','p_x = '+fmt(m.p/NC)+' nC m','Exact φ = '+fmt(m.exact.phi)+' V','KQ/R = '+fmt(m.monopole)+' V','Kp_x/R² = '+fmt(m.dipole)+' V','Truncated φ = '+fmt(m.truncated)+' V',s.n===2?'Q = p = 0; higher terms remain':'Increase R / a to reduce omission']);
  shapes.push(t('omitted',180,290,'Exact − truncated = '+fmt(m.exact.phi-m.truncated)+' V'));
 }else if(scene==='cosine-sphere'){
  title='COSINE SURFACE CHARGE · INSIDE AND OUTSIDE';context='Prescribed σ=σ₀ cosθ on sphere · axis probe · not a conductor · surface field has two limits';
  const center=[175,190],radius=55,P=[175,190-s.r*55];shapes.push(circle('sphere',center,radius),line('axis',[175,65],[175,315],'axis'),pt('P',P),t('P-label',197,P[1],'P'));
  for(let i=0;i<12;i++){const angle=i*Math.PI/6,sign=Math.sign(s.q*Math.cos(angle));if(sign)shapes.push(t('surface-'+i,175+65*Math.sin(angle),190-65*Math.cos(angle),sign>0?'+':'−'));}
  if(m.E!==null)shapes.push(arrow('E',P,[0,m.E],30/Math.max(1,Math.abs(m.E))),t('arrow-key',449,314,'E arrow: direction only'));
  rows(shapes,['p_z = '+fmt(m.p/NC)+' nC m','Net surface charge = 0','φ(P) = '+fmt(m.phi)+' V',m.surface?'P on surface: E is not single-valued':'E_z(P) = '+fmt(m.E)+' V/m','Interior E_z = '+fmt(m.Einside)+' V/m','Exterior pole E_z = '+fmt(m.Eoutside)+' V/m','Inside uniform · outside pure dipole']);
 }else if(scene==='image-plane'){
  title='GROUNDED PLANE · REAL CHARGE AND IMAGE';context='Upper half-space physical · image below plane is fictitious · E in conductor = 0';
  shapes.push(line('plane',[55,195],[305,195],'field'),t('plane-label',180,65,'Grounded plane φ = 0'),pt('real',[95,110]),t('real-label',95,88,fmt(s.q)+' nC · real'),pt('image',[95,280]),t('image-label',95,306,fmt(-s.q)+' nC · image'),line('mirror',[95,110],[95,280]),pt('surface-probe',[95+55*s.r,195]),t('rho-label',200,178,'P: ρ/h = '+fmt(s.r)));
  shapes.push(arrow('surface-E',[95+55*s.r,195],[0,m.surface.E[1]],35/Math.max(1,Math.abs(m.surface.E[1]))),t('arrow-key',449,314,'Normal E arrow: direction only'));
  rows(shapes,['φ(P) = '+fmt(m.surface.phi)+' V','Tangential E(P) = 0','Normal E(P) = '+fmt(m.surface.E[1])+' V/m','σ(P) = '+fmt(m.sigma/NC)+' nC/m²','Total induced = '+fmt(-s.q)+' nC','F_z on Q = '+fmt(m.force/NC)+' nN','Force is toward plane for ±Q']);
 }else if(scene==='image-sphere'){
  title=s.n?'SPHERE IMAGE · ISOLATED NEUTRAL':'SPHERE IMAGE · GROUNDED';context='Real Q=+1 nC outside · images inside are fictitious · exterior solution only · metal E=0';
  const at=p=>[105+47*p[0]/m.R,195-47*p[1]/m.R],P=at(m.P);shapes.push(circle('sphere',[105,195],47),line('axis',[55,195],[310,195],'axis'),pt('real',at([m.d,0])),t('real-label',at([m.d,0])[0],170,'+Q real'),pt('image',at([m.xi,0])),t('image-label',165,250,'q′ at R²/d · fictitious'),pt('P',P),t('P-label',P[0],P[1]-18,'P'));
  if(m.qc)shapes.push(pt('center-charge',[105,195]),t('center-label',169,275,'q″ at center · fictitious'));
  shapes.push(arrow('normal-E',P,m.surface.E,27/Math.max(1,Math.hypot(...m.surface.E))),t('arrow-key',185,310,'Exterior E arrow: direction only'));
  rows(shapes,['q′ = '+fmt(m.qi/NC)+' nC','q″ = '+fmt(m.qc/NC)+' nC','Sphere net = '+fmt(m.totalSphere/NC)+' nC','φ(P) = '+fmt(m.surface.phi)+' V','Tangent E = '+fmt(m.Et)+' V/m','σ(P) = '+fmt(m.sigma/NC)+' nC/m²','F_x on Q = '+fmt(m.force/NC)+' nN']);
 }else if(scene==='plate-capacitance'){
  title='PARALLEL PLATES · GEOMETRY SETS CAPACITANCE';context='Vacuum · equal ±Q · d ≪ width · ideal uniform field · finite edges not calculated';
  const half=45*Math.sqrt(s.a),gap=40+60*s.r,top=180-gap/2,bottom=180+gap/2;shapes.push(line('positive-plate',[180-half,top],[180+half,top],'field'),line('negative-plate',[180-half,bottom],[180+half,bottom],'field'),t('positive',180,top-18,'+Q'),t('negative',180,bottom+25,'−Q'));
  for(const x of [140,180,220])shapes.push(arrow('E-'+x,[x,top+8],[0,-1],gap-16));shapes.push(t('gap',180,308,'Gap d = '+fmt(s.r)+' mm · arrows: direction only'));
  rows(shapes,['C = '+fmt(m.C/1e-12)+' pF','Q = '+fmt(s.q)+' pC','V = Q/C = '+fmt(m.V)+' V','E = '+fmt(m.E)+' V/m','σ = '+fmt(m.sigma/NC)+' nC/m²','d / √A = '+fmt(m.aspect),'C unchanged when Q changes']);
 }else if(scene==='curvature-spheres'){
  title='CONNECTED SPHERES · SAME POTENTIAL';context='Widely separated spheres · thin connecting wire · approximate isolated-sphere fields';
  const big=27*s.a,small=27*s.r;shapes.push(circle('big',[125,195],big),circle('small',[280,195],small),line('wire',[125+big,195],[280-small,195]),t('big-radius',125,195,'a = '+fmt(s.a)+' m'),t('small-radius',280,235,'b = '+fmt(s.r)+' m'),t('potential',195,78,'Both at '+fmt(m.V)+' V'));
  const scale=45/m.Esmall;shapes.push(arrow('big-E',[125,195-big],[0,m.Ebig],scale),arrow('small-E',[280,195-small],[0,m.Esmall],scale),t('arrow-key',180,315,'Common scale: '+fmt(scale)+' px per V/m'));
  rows(shapes,['Q_big ≈ '+fmt(m.Qbig/NC)+' nC','Q_small ≈ '+fmt(m.Qsmall/NC)+' nC','E_big ≈ '+fmt(m.Ebig)+' V/m','E_small ≈ '+fmt(m.Esmall)+' V/m','Q_small/Q_big ≈ '+fmt(m.chargeRatio),'E_small/E_big ≈ '+fmt(m.fieldRatio),'Mutual induction is omitted']);
 }else if(scene==='complex-quadratic'){
  title='COMPLEX POLYNOMIAL · POTENTIAL AND FIELD';context='F=κ(x+iy)² · analytic everywhere · x,y in m · κ in V/m² · critical point excluded from orthogonality';
  const at=(x,y)=>[180+85*x,190-85*y];shapes.push(line('x-axis',at(-1,0),at(1,0),'axis'),line('y-axis',at(0,-1),at(0,1),'axis'));
  // Exact level curves for U and V. The paths break at excluded divisions.
  for(const value of [-.6,-.25,0,.25,.6]){
   if(value===0){shapes.push(line('U-zero-1',at(-1,-1),at(1,1),'normal'),line('U-zero-2',at(-1,1),at(1,-1),'normal'),line('V-zero-x',at(-1,0),at(1,0),'sample-field'),line('V-zero-y',at(0,-1),at(0,1),'sample-field'));continue;}
   for(const sign of [-1,1])shapes.push(curve('U-'+value+'-'+sign,Array.from({length:161},(_,i)=>{const x=-1+i/80,y2=x*x-value;return y2>=0&&y2<=1?at(x,sign*Math.sqrt(y2)):[NaN,NaN];}),'blue-curve'));
   for(const sign of [-1,1])shapes.push(curve('V-'+value+'-'+sign,Array.from({length:81},(_,i)=>{const x=sign*(.01+i*.99/80),y=value/(2*x);return Math.abs(y)<=1?at(x,y):[NaN,NaN];}),'gold-curve'));
  }
  const P=at(m.x,m.y);shapes.push(pt('P',P),arrow('E',P,m.E,4),t('curves-key',180,306,'Blue: U constant · gold: V constant'),t('arrow-key',180,325,'E arrow: 4 px per V/m'));
  rows(shapes,[(s.n?'φ = V':'φ = U')+' = '+fmt(s.n?m.V:m.U)+' V','E_x = '+fmt(m.E[0])+' V/m','E_y = '+fmt(m.E[1])+' V/m','∇²φ = 0 · no charge here','∇U · ∇V = '+fmt(m.dot),m.critical?'At origin: both gradients zero':'Regular point: contours orthogonal','No beam trajectory is calculated']);
 }else if(scene==='plasma-continuity'){
  title='PLASMA CONTINUITY · DISPLACEMENT GRADIENT';context='Small sinusoidal electron displacement · fixed ions · linearized density · L=1 m';
  const phase=Math.cos(m.phase),g=graph(shapes,'continuity',[u=>Math.cos(2*Math.PI*u)*phase,u=>Math.sin(2*Math.PI*u)*phase],{xmax:1,title:'Blue: s/s₀ · gold: (n−n₀)/(n₀ks₀)'});shapes.push(pt('spatial-probe',[g.gx(s.n),g.gy(Math.sin(2*Math.PI*s.n)*phase)]));
  rows(shapes,['x/L = '+fmt(s.n),'∂s/∂x = '+fmt(m.slope),'n/n₀ ≈ '+fmt(m.density/m.n0),'Exact Jacobian ratio = '+fmt(1/(1+m.slope)),'ρ(P) = '+fmt(m.rho/NC)+' nC/m³','E_x(P) = '+fmt(m.E)+' V/m','Compression ⇒ more electrons']);
 }else if(scene==='plasma-linear'){
  title='PLASMA MODE · DISPLACEMENT TO RESTORING FORCE';context='Linear cold electron mode · fixed ions · L=1 m · no collisions, radiation or radio-wave solver';
  const spatial=Math.cos(2*Math.PI*s.n),g=graph(shapes,'plasma',[phase=>spatial*Math.cos(phase*Math.PI/180),phase=>-spatial*Math.sin(phase*Math.PI/180)],{xmax:360,title:'Blue: s/s₀ · gold: v/(ωₚs₀)'});
  shapes.push(pt('phase-point',[g.gx(s.r),g.gy(m.displacement/m.s0)]));
  rows(shapes,['ωₚ = '+fmt(m.omega)+' rad/s','fₚ = '+fmt(m.frequency/1e6)+' MHz','t = '+fmt(m.time*1e9)+' ns','s(P) = '+fmt(m.displacement*1e3)+' mm','E_x(P) = '+fmt(m.E)+' V/m','ρ(P) = '+fmt(m.rho/NC)+' nC/m³','F_x = '+fmt(m.force/1e-18)+' aN']);
 }else if(scene==='debye-planar'){
  title='DEBYE SHEATH · PLANAR EXPONENTIAL DECAY';context='Fixed surface ratio · σ changes with density or T · source ε₀ · |eφ/kT|≤0.1';
  const g=graph(shapes,'debye',[u=>Math.exp(-u)],{title:'Unit-amplitude decay exp(−x/D) · x/D'});shapes.push(pt('value',[g.gx(s.r),g.gy(m.decay)]));
  shapes.push(t('probe-note',185,315,'Fixed x/D: physical x moves with D'));
  const u=s.q*m.decay,error=u===0?0:Math.abs(1-u/Math.sinh(u));rows(shapes,['D = '+fmt(m.D*1e6)+' μm · x = '+fmt(m.x*1e6)+' μm','φ₀ = '+fmt(m.phi0*1e3)+' mV','φ(P) = '+fmt(m.phi*1e3)+' mV','E_x(P) = '+fmt(m.E)+' V/m','ρ/(2n₀e): linear '+fmt(-u),'Local exact Boltzmann: '+fmt(-Math.sinh(u)),'Charge linearization error = '+fmt(100*error)+'%','σ = '+fmt(m.sigma/NC)+' nC/m²']);
 }else{
  title='GRID FOURIER MODE · EXPONENTIAL HEIGHT DECAY';context='One chosen 1 V mode + uniform 1 V/m field · z≥0 · not a fitted full wire-grid solution';
  const g=graph(shapes,'grid',[u=>Math.exp(-2*Math.PI*s.n*s.r)*Math.cos(2*Math.PI*s.n*u)],{xmax:1,title:'φ + E₀z (V) at selected z · x/a'});shapes.push(pt('value',[g.gx(s.b),g.gy(m.decay*Math.cos(2*Math.PI*s.n*s.b))]));
  rows(shapes,['z₀ = a/(2πn) = '+fmt(m.length)+' m','Amplitude ratio = '+fmt(m.decay),'φ(P) = '+fmt(m.phi)+' V','E_x(P) = '+fmt(m.E[0])+' V/m','E_z(P) = '+fmt(m.E[1])+' V/m','∂²xφ + ∂²zφ = 0','Higher n decays over shorter z₀']);
 }
 const first=circumstancesControls(scene)[0],scale=210/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(line('track',[65,359],[275,359],'axis'),pt('probe',[origin+s[first.key]*scale,359],true),t('track-label',170,340,first.label+(first.units?' ('+first.units+')':'')),t('title',300,27,title),t('context',300,423,context),t('hint',300,445,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:scene,x:300,y:399}],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export function drawCircumstances(scene,state){const d=circumstancesDefinition(scene,state);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),t('equation',300,399,circumstancesEquations[scene].plain)]),metrics:[],label:d.label};}
export function circumstancesChecks(scene){
 const states=[circumstancesDefaults[scene]];for(const p of circumstancesControls(scene))for(const value of [p.min,(p.min+p.max)/2,p.max])states.push({...circumstancesDefaults[scene],[p.key]:p.step===1?Math.round(value):value});let checks=0;
 const close=(a,b,tol=1e-8)=>{if(Math.abs(a-b)>tol*Math.max(1e-12,Math.abs(a),Math.abs(b)))throw Error('Circumstances invariant failed: '+scene+' '+a+' '+b);checks++;};
 for(const state of states){const m=circumstancesModel(scene,state);
  if(scene==='poisson-curvature'){close(m.rho,-EPS0*m.laplacian);const h=1e-5,P=m.P,plus=[P[0]+h,P[1],P[2]],minus=[P[0]-h,P[1],P[2]];close(-(m.phi(plus)-m.phi(minus))/(2*h),m.E[0],1e-6);}
  if(scene==='dipole-far'){const h=1e-5;for(let i=0;i<2;i++){const p=[...m.P],n=[...m.P];p[i]+=h;n[i]-=h;const derivative=-(pointTerms(p,m.sources).phi-pointTerms(n,m.sources).phi)/(2*h);if(Math.abs(derivative-m.exact.E[i])>1e-7*Math.max(1,Math.abs(m.exact.E[i])))throw Error('Finite-pair gradient failed.');checks++;}if(m.ratio<2)throw Error('Far comparison domain failed.');}
  if(scene==='multipole-cancellation'){close(m.Q,m.sources.reduce((v,t)=>v+t.Q,0));close(m.p,m.sources.reduce((v,t)=>v+t.Q*t.at[0],0));}
  if(scene==='cosine-sphere'){close(m.p,4*Math.PI*m.sigma*m.R**3/3);close(m.Eoutside-m.Einside,m.sigma/EPS0);}
  if(scene==='image-plane'){close(m.surface.phi,0);close(m.surface.E[0],0);close(m.sigma,m.sigmaAt(m.rho));}
  if(scene==='image-sphere'){if(Math.abs(m.surface.phi-m.expectedPhi)>1e-11||Math.abs(m.Et)>1e-11)throw Error('Sphere boundary condition failed.');checks+=2;close(m.totalSphere,m.state.n?0:m.qi);}
  if(scene==='plate-capacitance'){close(m.C*m.V,m.Q);close(m.E*m.d,m.V);}
  if(scene==='curvature-spheres'){close(K*m.Qbig/m.Rbig,m.V);close(m.Esmall/m.Ebig,m.Rbig/m.Rsmall);}
  if(scene==='complex-quadratic'){close(m.dot,0);close(m.gU[0],m.gV[1]);close(m.gU[1],-m.gV[0]);}
  if(['plasma-linear','plasma-continuity'].includes(scene)){close(m.force,ME*m.acceleration);close(m.rho,m.n0*ECHARGE*m.slope);if(m.maxSlope>.013)throw Error('Linear mode range failed.');}
  if(scene==='debye-planar'){close(m.D*m.D,EPS0*KB*m.T/(2*m.n0*ECHARGE**2));close(m.E,-(-m.phi/m.D));close(EPS0*m.E,m.sigma*m.decay);}
  if(scene==='grid-harmonic'){close(m.dxx+m.dzz,0);close(m.decay,Math.exp(-m.z/m.length));}
  const d=circumstancesDefinition(scene,state);for(const shape of d.shapes){if(shape.type==='text'&&/NaN|Infinity/.test(shape.text))throw Error('Nonfinite readout.');if(shape.at&&shape.at.some(v=>!Number.isFinite(v)))throw Error('Nonfinite point.');}checks++;
 }
 return {passed:true,states:states.length,checks,method:'Exact boundary conditions, superposition, density/force identities and finite-difference gradients within the declared model domains.'};
}
export const circumstancesEquations=Object.freeze({
 'poisson-curvature':{plain:'φ=(αx²+βy²+γz²)/2 · ∇²φ=α+β+γ=−ρ/ε₀',tex:String.raw`\phi=\frac{\alpha x^2+\beta y^2+\gamma z^2}{2}\quad\nabla^2\phi=\alpha+\beta+\gamma=-\rho/\epsilon_0`},
 'dipole-far':{plain:'φ_exact=KQ(1/r₊−1/r₋) · φ_dip=Kp cosθ/r²',tex:String.raw`\phi_{\rm exact}=KQ(1/r_+-1/r_-)\qquad\phi_{\rm dip}=Kp\cos\theta/r^2`},
 'multipole-cancellation':{plain:'φ=KΣQᵢ/|R−dᵢ| ≈ KQ/R + Kpₓ/R²',tex:String.raw`\phi=K\sum_i\frac{Q_i}{|\mathbf R-\mathbf d_i|}\approx\frac{KQ}{R}+\frac{Kp_x}{R^2}`},
 'cosine-sphere':{plain:'σ=σ₀cosθ · p=4πσ₀R³/3 · E_inside=−σ₀ẑ/(3ε₀)',tex:String.raw`\sigma=\sigma_0\cos\theta\quad p=4\pi\sigma_0R^3/3\quad\mathbf E_{\rm in}=-\sigma_0\hat{\mathbf z}/(3\epsilon_0)`},
 'image-plane':{plain:'σ(ρ)=−Qh/[2π(h²+ρ²)^(3/2)] · F_z=−KQ²/(4h²)',tex:String.raw`\sigma(\rho)=-\frac{Qh}{2\pi(h^2+\rho^2)^{3/2}}\qquad F_z=-\frac{KQ^2}{4h^2}`},
 'image-sphere':{plain:'q′=−QR/d at R²/d · neutral: q″=−q′ at center',tex:String.raw`q'=-QR/d\ \text{at}\ R^2/d\qquad\text{neutral: }q''=-q'\ \text{at center}`},
 'plate-capacitance':{plain:'C≈ε₀A/d · V=Q/C · E≈V/d',tex:String.raw`C\approx\epsilon_0A/d\qquad V=Q/C\qquad E\approx V/d`},
 'curvature-spheres':{plain:'Q_big/a ≈ Q_small/b · E_small/E_big ≈ a/b',tex:String.raw`\frac{Q_{\rm big}}{a}\approx\frac{Q_{\rm small}}{b}\qquad\frac{E_{\rm small}}{E_{\rm big}}\approx\frac ab`},
 'complex-quadratic':{plain:'U=κ(x²−y²), V=2κxy · ∇²U=∇²V=0 · ∇U·∇V=0',tex:String.raw`U=\kappa(x^2-y^2),\ V=2\kappa xy\quad\nabla^2U=\nabla^2V=0\quad\nabla U\cdot\nabla V=0`},
 'plasma-linear':{plain:'ρ=n₀e ∂s/∂x · E_x=n₀es/ε₀ · ωₚ²=n₀e²/(ε₀mₑ)',tex:String.raw`\rho=n_0e\,\partial_xs\quad E_x=n_0es/\epsilon_0\quad\omega_p^2=n_0e^2/(\epsilon_0m_e)`},
 'plasma-continuity':{plain:'n=n₀/(1+∂ₓs) ≈ n₀(1−∂ₓs) · ρ≈n₀e ∂ₓs',tex:String.raw`n=\frac{n_0}{1+\partial_xs}\approx n_0(1-\partial_xs)\qquad\rho\approx n_0e\,\partial_xs`},
 'debye-planar':{plain:'D²=ε₀kT/(2n₀e²) · φ=φ₀e^(−x/D) · φ₀=σD/ε₀',tex:String.raw`D^2=\frac{\epsilon_0kT}{2n_0e^2}\quad\phi=\phi_0e^{-x/D}\quad\phi_0=\sigma D/\epsilon_0`},
 'grid-harmonic':{plain:'φ=−E₀z+A e^(−2πnz/a)cos(2πnx/a) · z₀=a/(2πn)',tex:String.raw`\phi=-E_0z+Ae^{-2\pi nz/a}\cos(2\pi nx/a)\quad z_0=a/(2\pi n)`}
});
