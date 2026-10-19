import {K,EPS0,NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';
const c=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export const gaussDefaults=Object.freeze({
 'external-flux-pairs':{r:2,b:.4,q:1},
 'tilted-flux':{r:2,q:1,a:25,b:45},'flux-layer':{r:2,q:1},'electrostatic-cube':{r:.6,a:1,b:.5},'electrostatic-equations':{r:.4,a:1,b:.5,q:0},
 'triangle-equilibrium':{r:.2,q:1,b:0},'restoring-flux':{r:.6,a:1},'rigid-translation':{r:.25,a:1,q:1,b:0},'tube-constraint':{r:.25,q:1,b:0},
 'conductor-energy':{r:.4,a:1,b:.5},'active-charge-control':{r:.3,a:1},'orbit-energy-loss':{n:0},
 'conducting-sphere':{r:.7,q:1,a:1.2},'conductor-pillbox':{q:1,a:1},
 'cavity-gauss':{q:1},'cavity-loop':{q:1,a:1,b:0},'charged-cavity':{r:.6,q:1,b:0},'electrostatic-shield':{r:.4,a:1,q:0,b:1}
});
export const gaussNames=Object.freeze(Object.keys(gaussDefaults));
export function gaussControls(scene){
 if(scene==='external-flux-pairs')return [c('r','External charge distance d',1.5,3,.05,'m'),c('b','Ray angle / tangent angle',0,.8,.05),c('q','External source Q',.5,2,.1,'nC')];
 if(scene==='tilted-flux')return [c('r','Outer radius r₂',1.5,3,.05,'m'),c('a','Inner patch tilt θ₁',0,65,5,'°'),c('b','Outer patch tilt θ₂',0,65,5,'°'),c('q','Source charge Q',.5,2,.1,'nC')];
 if(scene==='flux-layer')return [c('r','Outer sphere radius R',1.5,3,.05,'m'),c('q','Enclosed source Q',.5,2,.1,'nC')];
 if(scene==='electrostatic-cube')return [c('r','Cube side h',.2,1.2,.02,'m'),c('a','Field derivative α',-2,2,.1,'V/m²'),c('b','Uniform field B_x',-2,2,.1,'V/m')];
 if(scene==='electrostatic-equations')return [c('r','Probe coordinate x',-.8,.8,.05,'m'),c('a','Expansion α',-2,2,.1,'V/m²'),c('q','Rotation ω',-2,2,.1,'V/m²'),c('b','Uniform E_x',-2,2,.1,'V/m')];
 if(scene==='triangle-equilibrium')return [c('r','Signed probe displacement d',-.5,.5,.02,'m'),c('b','Direction: triangle plane to +z',0,90,5,'°'),c('q','Each negative source magnitude',.5,2,.1,'nC')];
 if(scene==='restoring-flux')return [c('r','Gaussian sphere radius R',.3,1.2,.05,'m'),c('a','Inward-field coefficient κ',.5,2,.1,'V/m²')];
 if(scene==='rigid-translation')return [c('r','Center displacement d',-.6,.6,.02,'m'),c('b','Direction: x / y',0,1,1),c('a','Saddle coefficient κ',.5,2,.1,'V/m²'),c('q','Each rod charge',.5,2,.1,'nC')];
 if(scene==='tube-constraint')return [c('r','Signed displacement d',-.6,.6,.02,'m'),c('b','Direction: along tube / sideways',0,1,1),c('q','Each positive end-source Q',.5,2,.1,'nC')];
 if(scene==='conductor-energy')return [c('r','Displacement x',-.8,.8,.02,'m'),c('a','Frozen quadratic coefficient a',.5,2,.1,'nJ/m²'),c('b','Relaxation quadratic coefficient b',0,1.5,.1,'nJ/m²')];
 if(scene==='active-charge-control')return [c('r','Detected displacement x',-.5,.5,.02,'m'),c('a','Command gain g',.5,2,.1,'V/m²')];
 if(scene==='orbit-energy-loss')return [c('n','Qualitative stage: orbit / radiation / smaller orbit',0,2,1)];
 if(scene==='conducting-sphere')return [c('r','Observation radius r',0,3,.05,'m'),c('a','Solid conductor radius R',.8,1.6,.05,'m'),c('q','Excess charge Q',-2,2,.1,'nC')];
 if(scene==='conductor-pillbox')return [c('q','Local surface charge σ',-2,2,.1,'nC/m²'),c('a','Small face area A',.2,2,.05,'m²')];
 if(scene==='cavity-gauss')return [c('q','Hypothetical separated charge magnitude',0,2,.1,'nC')];
 if(scene==='cavity-loop')return [c('b','Hypothesis / electrostatic result',0,1,1),c('q','Hypothetical field along cavity',.2,2,.1,'V/m'),c('a','Cavity path length L',.5,1.5,.05,'m')];
 if(scene==='charged-cavity')return [c('r','Observation radius r',.2,3,.05,'m'),c('q','Fixed central cavity charge Q',-2,2,.1,'nC'),c('b','Neutral isolated / grounded shell',0,1,1)];
 if(scene==='electrostatic-shield')return [c('r','Observation radius r',.2,3,.05,'m'),c('a','Imposed uniform external E₀',-2,2,.1,'V/m'),c('q','Fixed central cavity charge Q',-2,2,.1,'nC'),c('b','Neutral isolated / grounded shell',0,1,1)];
 throw Error('Unknown Gauss source model.');
}
const pointField=(P,sources)=>sources.reduce((E,{position,charge})=>{const d=P.map((x,i)=>x-position[i]),r=Math.hypot(...d);return E.map((v,i)=>v+K*charge*NC*d[i]/r**3);},[0,0,0]);
export function cavitySolution(r,Q,grounded,E0=0){
 const inner=1,outer=2,outerCharge=grounded?0:Q,metalPhi=K*outerCharge*NC/outer,boundary=Math.abs(r-inner)<1e-9||Math.abs(r-outer)<1e-9;
 const region=r<inner?'cavity':r<outer?'metal':'outside',field=boundary?null:region==='cavity'?K*Q*NC/r**2:region==='metal'?0:K*outerCharge*NC/r**2+E0*(1+2*outer**3/r**3);
 const phi=region==='cavity'?metalPhi+K*Q*NC*(1/r-1/inner):region==='metal'?metalPhi:K*outerCharge*NC/r-E0*(r-outer**3/r**2);
 return {inner,outer,outerCharge,innerCharge:-Q,conductorCharge:outerCharge-Q,metalPhi,field,phi,region,boundary};
}
export function gaussModel(scene,state={}){
 const s={...gaussDefaults[scene],...state};for(const p of gaussControls(scene))if(!Number.isFinite(s[p.key])||s[p.key]<p.min||s[p.key]>p.max||p.step===1&&!Number.isInteger(s[p.key]))throw Error('Invalid Gauss model parameter: '+p.key);
 let m;
 if(scene==='external-flux-pairs'){const omega=.001,theta=s.b*Math.asin(1/s.r),u=[Math.cos(theta),Math.sin(theta)],root=Math.sqrt(1-s.r*s.r*Math.sin(theta)**2),radii=[s.r*Math.cos(theta)-root,s.r*Math.cos(theta)+root],points=radii.map(t=>[-s.r+t*u[0],t*u[1]]),normalFields=radii.map((t,i)=>(i?1:-1)*K*s.q*NC*root/t**2),areas=radii.map(t=>omega*t*t/root);m={omega,theta,u,radii,points,incidence:root,areas,normalFields,fluxes:areas.map((a,i)=>a*normalFields[i])};}
 else if(scene==='tilted-flux'){const omega=.01,angles=[s.a,s.b].map(a=>a*Math.PI/180),radii=[1,s.r],areas=radii.map((r,i)=>omega*r*r/Math.cos(angles[i])),normalFields=radii.map((r,i)=>(i?1:-1)*K*s.q*NC/r**2*Math.cos(angles[i]));m={omega,angles,radii,areas,normalFields,fluxes:areas.map((a,i)=>a*normalFields[i])};}
 else if(scene==='flux-layer')m={innerRadius:1,outerRadius:s.r,innerFlux:-s.q*NC/EPS0,outerFlux:s.q*NC/EPS0,layerCharge:0};
 else if(scene==='electrostatic-cube'){const h=s.r,area=h*h,faces=[s.a*h/2+s.b,s.a*h/2-s.b,...Array(4).fill(s.a*h/2)].map(v=>v*area);m={faces,volume:h**3,divergence:3*s.a,rho:3*EPS0*s.a,flux:3*s.a*h**3,E:P=>P.map((x,i)=>s.a*x+(i===0?s.b:0)),curl:[0,0,0]};}
 else if(scene==='electrostatic-equations')m={E:([x,y,z])=>[s.a*x-s.q*y+s.b,s.a*y+s.q*x,s.a*z],divergence:3*s.a,rho:3*EPS0*s.a,curl:[0,0,2*s.q],electrostatic:s.q===0};
 else if(scene==='triangle-equilibrium'){
  const sources=Array.from({length:3},(_,i)=>({position:[Math.cos(i*2*Math.PI/3),Math.sin(i*2*Math.PI/3),0],charge:-s.q})),angle=s.b*Math.PI/180,direction=[Math.cos(angle),0,Math.sin(angle)],P=direction.map(v=>v*s.r),E=pointField(P,sources),parallel=(d,theta)=>{const u=[Math.cos(theta),0,Math.sin(theta)];return pointField(u.map(v=>v*d),sources).reduce((a,v,i)=>a+v*u[i],0);};
  m={sources,P,E,direction,parallel,projectedForce:parallel(s.r,angle),centerField:pointField([0,0,0],sources),planeSlope:1.5*K*s.q*NC,normalSlope:-3*K*s.q*NC};
 }else if(scene==='restoring-flux'){const volume=4*Math.PI*s.r**3/3;m={volume,fieldAtSurface:-s.a*s.r,divergence:-3*s.a,rho:-3*EPS0*s.a,charge:-3*EPS0*s.a*volume,flux:-4*Math.PI*s.a*s.r**3};}
 else if(scene==='rigid-translation'){const center=s.b?[0,s.r,0]:[s.r,0,0],positions=[[-.2,0,0],[.2,0,0]].map(p=>p.map((v,i)=>v+center[i])),fields=positions.map(([x,y,z])=>[-2*s.a*x,s.a*y,s.a*z]),forces=fields.map(E=>E.map(v=>s.q*v)),force=forces.reduce((sum,F)=>sum.map((v,i)=>v+F[i]),[0,0,0]);m={center,positions,fields,forces,force,trace:0};}
 else if(scene==='tube-constraint'){const sources=[{position:[-1,0,0],charge:s.q},{position:[1,0,0],charge:s.q}],P=s.b?[0,s.r,0]:[s.r,0,0],E=pointField(P,sources),force=d=>pointField(s.b?[0,d,0]:[d,0,0],sources)[s.b?1:0];m={sources,P,E,force,projectedForce:E[s.b?1:0],axialSlope:-4*K*s.q*NC,lateralSlope:2*K*s.q*NC};}
 else if(scene==='conductor-energy')m={frozen:x=>-s.a*x*x,relaxed:x=>-(s.a+s.b)*x*x,frozenForce:2*s.a*s.r,relaxedForce:2*(s.a+s.b)*s.r};
 else if(scene==='active-charge-control')m={position:s.r,commandField:-s.a*s.r,commandForce:-s.a*s.r};
 else if(scene==='orbit-energy-loss')m={stage:s.n,stages:['Accelerated classical orbit','Radiation carries energy away','Same fixed orbit cannot persist'],radius:[72,72,49][s.n]};
 else if(scene==='conducting-sphere'){const surface=Math.abs(s.r-s.a)<1e-9;m={surface,field:surface?null:s.r<s.a?0:K*s.q*NC/s.r**2,phi:K*s.q*NC/Math.max(s.r,s.a),surfacePhi:K*s.q*NC/s.a,outerField:K*s.q*NC/s.a**2,sigma:s.q*NC/(4*Math.PI*s.a*s.a),bulkRho:0,E:r=>r<s.a?0:K*s.q*NC/r**2,potential:r=>K*s.q*NC/Math.max(r,s.a)};}
 else if(scene==='conductor-pillbox'){const local=s.q*NC/(2*EPS0);m={local,other:local,inside:-local+local,outside:local+local,charge:s.q*NC*s.a,flux:s.q*NC*s.a/EPS0};}
 else if(scene==='cavity-gauss')m={positive:s.q,negative:-s.q,netCharge:0,flux:0,fieldDecided:false};
 else if(scene==='cavity-loop')m={hypothesis:s.b===0,field:s.b===0?s.q:0,cavityIntegral:s.b===0?s.q*s.a:0,metalIntegral:0,circulation:s.b===0?s.q*s.a:0};
 else m={...cavitySolution(s.r,s.q,s.b===1,scene==='electrostatic-shield'?s.a:0),external:scene==='electrostatic-shield'?s.a:0};
 return {...m,state:s};
}
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const arrow=(id,from,to,style='field')=>({id,type:'arrow',from,to,style,visible:Math.hypot(to[0]-from[0],to[1]-from[1])>1e-9});
const rows=(shapes,values)=>values.forEach((v,i)=>shapes.push(text('readout-'+i,453,98+35*i,v)));
const samples=(f,n=100)=>Array.from({length:n+1},(_,i)=>f(i/n));
function plot(shapes,id,functions,{xmin=-.6,xmax=.6,left=65,right=330,top=110,bottom=280,title='',scale}={}){
 const values=functions.map(fn=>samples(t=>{const x=xmin+(xmax-xmin)*t;return [x,fn(x)];})),max=scale||Math.max(.1,...values.flat().map(p=>Math.abs(p[1])))*1.1,gx=x=>left+(x-xmin)/(xmax-xmin)*(right-left),gy=y=>(top+bottom)/2-y/max*(bottom-top)/2;
 shapes.push(line(id+'-x',[left,gy(0)],[right,gy(0)],'axis'),line(id+'-y',[gx(0),top],[gx(0),bottom],'axis'),text(id+'-title',(left+right)/2,top-22,title),text(id+'-xmin',left,bottom+18,fmt(xmin)),text(id+'-xmax',right,bottom+18,fmt(xmax)),text(id+'-ymax',left-20,top,fmt(max)),text(id+'-ymin',left-20,bottom,fmt(-max)));
 values.forEach((v,i)=>shapes.push(curve(id+'-curve-'+i,v.map(([x,y])=>[gx(x),gy(y)]),i===0?'blue-curve':i===1?'gold-curve':'field')));return {gx,gy};
}
function rectangle(shapes,id,left,top,right,bottom){shapes.push(curve(id,[[left,top],[right,top],[right,bottom],[left,bottom],[left,top]],'reference'));}
function controlTrack(shapes,scene,s){const p=gaussControls(scene)[0],scale=210/(p.max-p.min),origin=65-p.min*scale;shapes.push(line('track',[65,357],[275,357],'axis'),point('probe',[origin+s[p.key]*scale,357],true),text('control-label',170,335,p.label+(p.units?' ('+p.units+')':'')));return {id:'probe',parameter:p.key,origin,scale,min:p.min,max:p.max};}
export function gaussDefinition(scene,state){
 const m=gaussModel(scene,state),s=m.state,shapes=[];let title,context,equation=scene;
 if(scene==='external-flux-pairs'){
  title='EXTERNAL CHARGE · ENTRY AND EXIT CANCEL';context='Sphere radius1 m · one infinitesimal ray pair · Ω=.001 sr · schematic patch widths';
  const center=[285,190],scale=85,source=[285-scale*s.r,190],P=m.points.map(([x,y])=>[285+scale*x,190-scale*y]);shapes.push(circle('closed-sphere',center,85),point('source',source),text('source-label',source[0],166,'+Q outside'),line('ray',source,P[1]));
  P.forEach((p,i)=>{const n=m.points[i],tangent=[-n[1],-n[0]],half=scale*Math.sqrt(m.areas[i])/2;shapes.push(line('patch-'+i,[p[0]-half*tangent[0],p[1]-half*tangent[1]],[p[0]+half*tangent[0],p[1]+half*tangent[1]],'axis'),arrow('normal-'+i,p,[p[0]+24*n[0],p[1]-24*n[1]],'normal'),arrow('E-'+i,[p[0],p[1]-35],[p[0]+25*m.u[0],p[1]-35-25*m.u[1]]),text('crossing-'+i,p[0],p[1]+32,i?'Exit':'Entry'));});
  rows(shapes,['d = '+fmt(s.r)+' m','r₁ = '+fmt(m.radii[0])+' m','r₂ = '+fmt(m.radii[1])+' m','Entry flux: '+fmt(m.fluxes[0])+' V m','Exit flux: '+fmt(m.fluxes[1])+' V m','Pair sum = 0 V m','Local E is nonzero']);shapes.push(text('pair-key',225,302,'Blue: outward normals · black: radial E · arrows show direction'));
 }else if(scene==='tilted-flux'){
  title='TILTED DIFFERENTIAL PATCHES · ONE SOLID ANGLE';context='Ω=.01 sr · uniform-center approximation on infinitesimal patches · schematic slice';
  const source=[62,192],centers=[[137,192],[62+75*s.r,192]];shapes.push(point('source',source),text('source-label',62,164,'+Q'));
  for(let i=0;i<2;i++){const t=m.angles[i],P=centers[i],half=75*m.radii[i]*Math.sqrt(m.omega)/2/Math.cos(t),u=[-Math.sin(t),Math.cos(t)],normal=[(i?1:-1)*Math.cos(t),(i?1:-1)*Math.sin(t)];shapes.push(line('ray-top-'+i,source,[P[0]+half*u[0],P[1]-half*u[1]]),line('ray-bottom-'+i,source,[P[0]-half*u[0],P[1]+half*u[1]]),line('patch-'+i,[P[0]-half*u[0],P[1]+half*u[1]],[P[0]+half*u[0],P[1]-half*u[1]],'axis'),arrow('normal-'+i,P,[P[0]+26*normal[0],P[1]-26*normal[1]],'normal'),arrow('E-'+i,[P[0],P[1]+58],[P[0]+30,P[1]+58]),text('patch-label-'+i,P[0],95,'r'+(i+1)+' = '+fmt(m.radii[i])+' m'));}
  rows(shapes,['dA₁ = '+fmt(m.areas[0])+' m²','dA₂ = '+fmt(m.areas[1])+' m²','E·n₁ = '+fmt(m.normalFields[0])+' V/m','E·n₂ = '+fmt(m.normalFields[1])+' V/m','Inner flux = '+fmt(m.fluxes[0])+' V m','Outer flux = '+fmt(m.fluxes[1])+' V m','Pair net = 0 V m']);
  shapes.push(text('patch-key',185,298,'Blue: outward normals · black: radial E · direction-only arrows'));
 }else if(scene==='flux-layer'){
  title='REMOVE THE CHARGE · INNER BOUNDARY REVERSES';context='One centered Q · concentric spheres at 1 m and R · charge-free layer · plane slice';
  const center=[185,183],outer=92,inner=outer/s.r;shapes.push(circle('outer',center,outer),circle('inner',center,inner),point('Q',center),text('Q-label',185,165,'+Q'));
  shapes.push(arrow('outer-normal',[185+outer,183],[215+outer,183],'normal'),arrow('inner-normal',[185+inner,183],[160+inner,183],'normal'),text('layer-label',185,65,'The volume is between the circles'),text('inner-label',185,183+inner+18,'Inner boundary: toward Q'),text('outer-label',185,296,'Outer boundary: away from Q'));
  rows(shapes,['Layer charge = 0 C','Layer net flux = 0 V m','Inner: '+fmt(m.innerFlux)+' V m','Outer: '+fmt(m.outerFlux)+' V m','Flux through outer S = Q/ε₀','The inner sphere is not the volume']);
 }else if(scene==='electrostatic-cube'){
  title='LOCAL GAUSS LAW · A SMOOTH ELECTRIC FIELD';context='E=α(x,y,z)+(B_x,0,0) V/m · exact affine cube identity · source limit is infinitesimal';
  const v=[[107,137],[220,137],[220,250],[107,250],[150,95],[263,95],[263,208],[150,208]],edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  edges.forEach(([i,j],k)=>shapes.push(line('edge-'+k,v[i],v[j])));const normals=[[[235,168],[267,168],'+x'],[[120,206],[88,206],'−x'],[[181,115],[181,83],'+y'],[[162,232],[162,263],'−y'],[[255,111],[276,90],'+z'],[[129,226],[106,249],'−z']];normals.forEach(([P,end,label],i)=>shapes.push(arrow('normal-'+i,P,end,'normal'),text('normal-label-'+i,end[0]+(i%2?-12:12),end[1],label)));shapes.push(text('side-label',167,275,'h = '+fmt(s.r)+' m'),text('field-label',184,308,'Outward normals on all six faces'));
  rows(shapes,['+x flux: '+fmt(m.faces[0])+' V m','−x flux: '+fmt(m.faces[1])+' V m','Each y,z face: '+fmt(m.faces[2])+' V m','Total flux = '+fmt(m.flux)+' V m','div E = '+fmt(m.divergence)+' V/m²','ρ = '+fmt(m.rho/NC)+' nC/m³','Q = '+fmt(m.rho*m.volume/NC)+' nC']);
 }else if(scene==='electrostatic-equations'){
  title='GAUSS CONSTRAINS DIVERGENCE · CHECK CURL TOO';context='Authored affine E in V/m · rotation ω≠0 violates electrostatics · no arbitrary field solver';
  for(const x of [-.7,0,.7])for(const y of [-.7,0,.7]){const P=[180+80*x,190-80*y],E=m.E([x,y,0]);shapes.push(arrow('E-'+x+'-'+y,P,[P[0]+16*E[0],P[1]-16*E[1]]));}
  shapes.push(point('P',[180+80*s.r,190]),text('P-label',180+80*s.r,172,'P'),text('field-scale',180,299,'Field arrows: 16 px per V/m'));
  rows(shapes,['div E = '+fmt(m.divergence)+' V/m²','ρ = '+fmt(m.rho/NC)+' nC/m³','curl E = (0,0,'+fmt(m.curl[2])+') V/m²','ω changes curl, not divergence','Uniform E_x changes neither','Both equations pass? '+(m.electrostatic?'Yes, for this field':'No: nonzero curl')]);
 }else if(scene==='triangle-equilibrium'){
  title='ZERO FORCE · STILL UNSTABLE';context='Three fixed −Q sources on radius-1 m triangle · +1 nC probe · compare plane and normal';
  const g=plot(shapes,'triangle',[d=>m.parallel(d,0),d=>m.parallel(d,Math.PI/2),d=>m.parallel(d,s.b*Math.PI/180)],{xmin:-.5,xmax:.5,title:'Projected force (nN) · d (m)'});shapes.push(point('selected',[g.gx(s.r),g.gy(m.projectedForce)]));
  rows(shapes,['Blue: triangle-plane +x','Gold: normal +z','Black: selected direction','Projected F = '+fmt(m.projectedForce)+' nN','At center: E = 0 V/m','Plane slope: '+fmt(m.planeSlope)+' nN/m','Normal slope: '+fmt(m.normalSlope)+' nN/m']);
 }else if(scene==='restoring-flux'){
  title='INWARD IN EVERY DIRECTION · CHARGE REQUIRED';context='Authored E=−κ(x,y,z) · positive probe could be restored only inside held negative charge';
  const center=[184,184];shapes.push(circle('sphere',center,88));for(let i=0;i<8;i++){const a=i*Math.PI/4,P=[184+82*Math.cos(a),184-82*Math.sin(a)];shapes.push(arrow('inward-'+i,P,[184+47*Math.cos(a),184-47*Math.sin(a)]));}
  shapes.push(text('inward-label',184,298,'Inward arrows show direction · not charge-free space'));
  rows(shapes,['E_r(R) = '+fmt(m.fieldAtSurface)+' V/m','Net flux = '+fmt(m.flux)+' V m','div E = '+fmt(m.divergence)+' V/m²','ρ = '+fmt(m.rho/NC)+' nC/m³','Required Q = '+fmt(m.charge/NC)+' nC','Charge-free Gauss flux would be 0']);
 }else if(scene==='rigid-translation'){
  title='RIGID CHARGES · NO RESTORING FORCE IN ALL AXES';context='Authored charge-free saddle E=κ(−2x,y,z) · two +q charges, fixed 0.4 m rod · translation';
  const at=p=>[180+105*p[0],192-105*p[1]],A=at(m.positions[0]),B=at(m.positions[1]);shapes.push(line('rod',A,B,'axis'));
  m.positions.forEach((p,i)=>{const P=at(p),F=m.forces[i];shapes.push(point('rod-charge-'+i,P),text('rod-label-'+i,P[0],P[1]-20,'+q'),arrow('rod-force-'+i,P,[P[0]+30*F[0],P[1]-30*F[1]],i?'sample-field':'normal'));});
  rows(shapes,['Total F_x = '+fmt(m.force[0])+' nN','Total F_y = '+fmt(m.force[1])+' nN','F_z = 0 nN','Translation-force divergence = 0','x: restoring · y,z: unstable','Internal spacing stays fixed']);shapes.push(text('rod-key',180,300,'Arrows: 30 px per nN · external forces only'));
 }else if(scene==='tube-constraint'){
  title='A TUBE SUPPLIES THE MISSING CONSTRAINT';context='Two fixed +Q sources at x=±1 m · +1 nC test charge · tube blocks sideways motion';
  const g=plot(shapes,'tube',[m.force],{title:'Selected-axis force (nN) · d (m)'});shapes.push(point('tube-probe',[g.gx(s.r),g.gy(m.projectedForce)]));
  rows(shapes,[s.b?'Sideways displacement':'Along-tube displacement','Projected F = '+fmt(m.projectedForce)+' nN','Axial slope = '+fmt(m.axialSlope)+' nN/m','Sideways slope = '+fmt(m.lateralSlope)+' nN/m','Sideways restoration needs tube walls','No free 3D stable equilibrium']);
 }else if(scene==='conductor-energy'){
  title='PASSIVE REDISTRIBUTION · ENERGY CAN FALL FURTHER';context='Authored quadratic energy ordering · frozen/relaxed curves illustrate argument, not conductor solution';
  const g=plot(shapes,'energy',[m.frozen,m.relaxed],{xmin:-.8,xmax:.8,title:'Energy (nJ) · x (m)'});shapes.push(point('frozen-point',[g.gx(s.r),g.gy(m.frozen(s.r))]),point('relaxed-point',[g.gx(s.r),g.gy(m.relaxed(s.r))]));
  rows(shapes,['Blue: charges frozen','Gold: charges relaxed','U_frozen = '+fmt(m.frozen(s.r))+' nJ','U_relaxed = '+fmt(m.relaxed(s.r))+' nJ','U_relaxed ≤ U_frozen here','x=0 is not an energy minimum','No general force derivative claimed']);
 }else if(scene==='active-charge-control'){
  title='ACTIVE CONTROL · SUPPORTING SOURCES MUST CHANGE';context='Authored instantaneous command map for +1 nC probe · no delay, actuator or stability simulation';
  for(let i=0;i<3;i++){rectangle(shapes,'block-'+i,52+i*178,135,196+i*178,215);if(i<2)shapes.push(arrow('connection-'+i,[196+i*178,175],[224+i*178,175]));}
  shapes.push(text('detect',124,164,'Detect x'),text('position',124,190,fmt(s.r)+' m'),text('command',302,164,'Change source field'),text('field-value',302,190,'E_cmd = '+fmt(m.commandField)+' V/m'),text('response',480,164,'Command qE'),text('force-value',480,190,fmt(m.commandForce)+' nN'),text('control-limit',300,272,'Each selected position receives a new command'),text('control-result',300,299,'This map is not one fixed electrostatic source configuration'));
 }else if(scene==='orbit-energy-loss'){
  title='CLASSICAL ORBIT · ENERGY LOSS';context='Qualitative classical argument only · no radiation rate, elapsed time or quantum orbit model';
  const center=[166,186];shapes.push(circle('original-orbit',center,72),circle('smaller-orbit',center,49),point('nucleus',center),text('nucleus-label',166,209,'+'),point('electron',[166+m.radius,186]),text('electron-label',166+m.radius,162,'−'),text('orbit-key',166,298,'Circles show two possible radii · no trajectory is solved'));
  rows(shapes,[m.stages[s.n],'Acceleration is nonzero','Radiation removes orbital energy','A fixed classical orbit fails','Source next invokes uncertainty','No numerical collapse time']);
 }else if(scene==='conducting-sphere'){
  title='SOLID CONDUCTOR · FLAT POTENTIAL IN METAL';context='Isolated spherical conductor · electrostatic equilibrium · r=R field has one-sided limits';
  const g=plot(shapes,'conductor-potential',[m.potential],{xmin:0,xmax:3,title:'Potential φ (V) · r (m)',scale:25});shapes.push(point('potential-probe',[g.gx(s.r),g.gy(m.phi)]),line('surface-mark',[g.gx(s.a),95],[g.gx(s.a),285],'reference'),text('metal-label',g.gx(s.a/2),305,'Metal'),text('outside-label',g.gx((3+s.a)/2),305,'Vacuum'));
  rows(shapes,['φ = '+fmt(m.phi)+' V',m.surface?'At surface: one-sided E limits':'E_r = '+fmt(m.field)+' V/m','E_metal = 0 V/m','Bulk excess ρ = 0 C/m³','Surface σ = '+fmt(m.sigma/NC)+' nC/m²','E(R⁺) = '+fmt(m.outerField)+' V/m','Total excess Q = '+fmt(s.q)+' nC']);
  shapes.push(arrow('surface-normal',[85,73],[105,73],'normal'),arrow('surface-field',[165,73],[165+20*Math.sign(s.q),73]),text('normal-key',231,55,'Surface E is normal · direction only'));
 }else if(scene==='conductor-pillbox'){
  title='CONDUCTOR PILLBOX · ONE FACE CONTRIBUTES';context='Local planar equilibrium limit · metal on left · direction-only arrows · uniform patch approximation';
  rectangle(shapes,'metal',65,87,185,265);rectangle(shapes,'pillbox',142,135,230,220);shapes.push(line('surface',[185,70],[185,284],'axis'),text('metal-label',119,106,'Metal: E=0'),text('outside-label',261,106,'Outside'),arrow('outside-E',[230,176],[230+37*Math.sign(m.outside),176]),text('surface-label',185,301,'Local σ · outward normal +x'));
  rows(shapes,['Local sheet |signed| term: '+fmt(m.local)+' V/m','Other charges: '+fmt(m.other)+' V/m','Inside: −local + other = 0','Outside: local + other','E_out = '+fmt(m.outside)+' V/m','Flux = '+fmt(m.flux)+' V m','σA = '+fmt(m.charge/NC)+' nC']);
 }else if(scene==='cavity-gauss'||scene==='cavity-loop'){
  const isLoop=scene==='cavity-loop',hypothesis=!isLoop||m.hypothesis;title=isLoop?'EMPTY CAVITY · TEST THE CLOSED LOOP':'EMPTY CAVITY · GAUSS ALONE IS INSUFFICIENT';context='Hypothetical inner charges/field are tested, not an equilibrium solution · enclosed conductor';
  rectangle(shapes,'outer-metal',78,85,280,276);rectangle(shapes,'cavity',115,128,244,218);shapes.push(text('metal',180,104,'Metal: E = 0'),text('cavity-label',180,244,'Empty cavity: no free charge'),text('plus',120,174,hypothesis?'+':''),text('minus',239,174,hypothesis?'−':''));
  if(isLoop){shapes.push(curve('loop',[[122,177],[238,177],[238,258],[122,258],[122,177]],'blue-curve'),arrow('path-direction',[155,177],[199,177],'normal'),arrow('return-direction',[199,258],[155,258],'normal'),arrow('candidate-E',[149,156],[149+34*m.field,156]),text('loop-label',180,304,hypothesis?'Hypothesis gives nonzero circulation':'Electrostatic result: E_cavity = 0'));
   rows(shapes,['∫cavity E·ds = '+fmt(m.cavityIntegral)+' V','∫metal E·ds = 0 V','Closed sum = '+fmt(m.circulation)+' V',hypothesis?'Fails electrostatic closed-loop law':'Closed-loop law satisfied','No arbitrary cavity solver']);
  }else{rows(shapes,['Hypothetical inner +q and −q','Net enclosed charge = 0 C','Gauss net flux = 0 V m','These sums do not fix local E','Apply the closed-loop law next','Drawing is a rejected hypothesis']);shapes.push(text('net-values',180,301,'+q = '+fmt(s.q)+' nC · −q = '+fmt(-s.q)+' nC'));}
 }else{
  const shielding=scene==='electrostatic-shield';title=shielding?'CLOSED SHELL · STATIC FIELDS ON BOTH SIDES':'CHARGE IN THE CAVITY · EMPTY-CAVITY RULE ENDS';context='Exact centered-charge spherical example · inner radius1 m, outer2 m · external uniform E₀ along+x';
  const center=[180,182],scale=42;shapes.push(circle('outer',center,84),circle('inner',center,42),point('central-charge',center),text('central-label',180,163,'Q = '+fmt(s.q)+' nC'),point('sample',[180+scale*s.r,182]),text('sample-label',180+scale*s.r,209,'P'));
  if(shielding)for(let i=0;i<3;i++)shapes.push(arrow('imposed-'+i,[62,98+82*i],[62+22*m.external,98+82*i],'sample-field'));
  shapes.push(arrow('probe-field',[180+scale*s.r,182],[180+scale*s.r+32*Math.sign(m.field??0),182]),text('metal-region',180,282,'Metal E=0 · '+(s.b?'grounded':'initially neutral isolated')),text('sphere-key',180,305,'Plane slice · arrows show direction only'));
  rows(shapes,['P region: '+m.region,m.boundary?'Surface: use one-sided E limits':'E_x(P) = '+fmt(m.field)+' V/m','Inner induced Q = '+fmt(m.innerCharge)+' nC','Outer net Q = '+fmt(m.outerCharge)+' nC','Conductor net Q = '+fmt(m.conductorCharge)+' nC','External E₀ = '+fmt(m.external)+' V/m',s.b?'Q changes no exterior field':'Q can change exterior field']);
 }
 const probe=controlTrack(shapes,scene,s);shapes.push(text('title',300,27,title),text('context',300,423,context),text('hint',300,445,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:equation,x:300,y:400}],probe};
}
export function drawGauss(scene,state){const d=gaussDefinition(scene,state);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,400,gaussEquations[scene].plain)]),metrics:[],label:d.label};}
export function gaussChecks(scene){
 const states=[gaussDefaults[scene]];for(const p of gaussControls(scene))for(const value of [p.min,p.step===1?Math.round((p.min+p.max)/2):(p.min+p.max)/2,p.max])states.push({...gaussDefaults[scene],[p.key]:value});let checks=0;
 for(const state of states){const m=gaussModel(scene,state),s=m.state;let error=0;
  if(scene==='tilted-flux'||scene==='external-flux-pairs')error=m.fluxes[0]+m.fluxes[1];
  if(scene==='flux-layer')error=m.innerFlux+m.outerFlux;
  if(scene==='electrostatic-cube')error=Math.max(Math.abs(m.faces.reduce((a,v)=>a+v,0)-m.flux),Math.abs(m.flux-m.rho*m.volume/EPS0));
  if(scene==='triangle-equilibrium')error=Math.hypot(...m.centerField);
  if(scene==='restoring-flux')error=m.flux-m.charge/EPS0;
  if(scene==='rigid-translation')error=m.force[s.b?1:0]-(s.b?2:-4)*s.q*s.a*s.r;
  if(scene==='conductor-energy'&&m.relaxed(s.r)>m.frozen(s.r)+1e-12)throw Error('Energy ordering failed.');
  if(scene==='conductor-pillbox')error=Math.max(Math.abs(m.inside),Math.abs(m.outside-m.charge/(s.a*EPS0)),Math.abs(m.flux-m.charge/EPS0));
  if(['charged-cavity','electrostatic-shield'].includes(scene))error=m.innerCharge+s.q;
  if(!Number.isFinite(error)||Math.abs(error)>1e-10)throw Error('Gauss model invariant failed: '+scene);
  for(const p of gaussDefinition(scene,state).shapes){if(p.type==='text'&&/NaN|Infinity/.test(p.text))throw Error('Nonfinite readout.');if(p.points&&p.points.flat().some(v=>!Number.isFinite(v)))throw Error('Nonfinite curve.');}checks++;
 }
 return {passed:true,states:states.length,checks,method:'Signed flux/charge, force sums, zero-field center, local pillbox, and energy ordering. Independent source/numerical/native review remains required.'};
}
export const gaussEquations=Object.freeze({
 'external-flux-pairs':{plain:'Entry: −KQ dΩ · exit: +KQ dΩ · net=0',tex:String.raw`d\Phi_{\rm entry}=-KQ\,d\Omega\qquad d\Phi_{\rm exit}=+KQ\,d\Omega`},
 'tilted-flux':{plain:'dA=Ωr²/cosθ · (E·n)dA=±KQΩ',tex:String.raw`dA=\frac{\Omega r^2}{\cos\theta}\qquad(\mathbf E\cdot\hat{\mathbf n})dA=\pm KQ\Omega`},
 'flux-layer':{plain:'Φouter + Φinner = Q/ε₀ − Q/ε₀ = 0',tex:String.raw`\Phi_{\rm outer}+\Phi_{\rm inner}=\frac Q{\epsilon_0}-\frac Q{\epsilon_0}=0`},
 'electrostatic-cube':{plain:'Φ=3αh³=ρh³/ε₀ · div E=ρ/ε₀',tex:String.raw`\Phi=3\alpha h^3=\frac{\rho h^3}{\epsilon_0}\qquad\nabla\cdot\mathbf E=\frac\rho{\epsilon_0}`},
 'electrostatic-equations':{plain:'div E=ρ/ε₀ · curl E=0',tex:String.raw`\nabla\cdot\mathbf E=\rho/\epsilon_0\qquad\nabla\times\mathbf E=0`},
 'triangle-equilibrium':{plain:'E(0)=0 · restoring force must oppose every displacement',tex:String.raw`\mathbf E(0)=0\qquad\mathbf F\cdot\Delta\mathbf r<0\ \text{in every direction for restoration}`},
 'restoring-flux':{plain:'E=−κr · Φ=−4πκR³ · ρ=−3ε₀κ',tex:String.raw`\mathbf E=-\kappa\mathbf r\qquad\Phi=-4\pi\kappa R^3\qquad\rho=-3\epsilon_0\kappa`},
 'rigid-translation':{plain:'Ftotal=Σ qᵢEᵢ · divtranslation Ftotal=Σ qᵢ div Eᵢ=0',tex:String.raw`\mathbf F_{\rm total}=\sum_iq_i\mathbf E_i\quad\nabla_{\rm translation}\cdot\mathbf F_{\rm total}=\sum_iq_i\nabla\cdot\mathbf E_i=0`},
 'tube-constraint':{plain:'Along x: restoring · sideways: unstable · walls impose constraint',tex:String.raw`F_x\simeq-4KQq\,x/d^3\qquad F_y\simeq2KQq\,y/d^3\quad(d=1\,\mathrm m)`},
 'conductor-energy':{plain:'Urelaxed(x)≤Ufrozen(x) · quadratic example has no minimum at 0',tex:String.raw`U_{\rm relaxed}(x)\le U_{\rm frozen}(x)\qquad U_{\rm frozen}=-ax^2\quad U_{\rm relaxed}=-(a+b)x^2`},
 'active-charge-control':{plain:'Observed x → changed Ecmd=−gx → qEcmd',tex:String.raw`x_{\rm observed}\ \longrightarrow\ E_{\rm cmd}=-g x\ \longrightarrow\ qE_{\rm cmd}`},
 'orbit-energy-loss':{plain:'Radiation carries energy away · dEorbit/dt<0',tex:String.raw`\frac{dE_{\rm orbit}}{dt}<0\qquad\text{radiation carries energy away}`},
 'conducting-sphere':{plain:'Emetal=0 · φmetal=constant · ρbulk,excess=0',tex:String.raw`\mathbf E_{\rm metal}=0\qquad\phi_{\rm metal}=\text{constant}\qquad\rho_{\rm bulk,excess}=0`},
 'conductor-pillbox':{plain:'Eout A=σA/ε₀ · Eout=σ/ε₀ · Ein=0',tex:String.raw`E_{\rm out}A=\sigma A/\epsilon_0\qquad E_{\rm out}=\sigma/\epsilon_0\quad E_{\rm in}=0`},
 'cavity-gauss':{plain:'Qinner=0 ⇒ net flux=0 · this alone does not determine E',tex:String.raw`Q_{\rm inner}=0\ \Longrightarrow\ \oint\mathbf E\cdot\hat{\mathbf n}\,da=0\quad\text{does not alone determine }\mathbf E`},
 'cavity-loop':{plain:'∮ E·ds = ∫cavity E·ds + 0 = 0',tex:String.raw`\oint\mathbf E\cdot d\mathbf s=\int_{\rm cavity}\mathbf E\cdot d\mathbf s+0=0`},
 'charged-cavity':{plain:'Qinner=−Q · neutral isolated: Qouter=Q · grounded: Qouter=0',tex:String.raw`Q_{\rm inner}=-Q\qquad Q_{\rm outer}=Q\ (\text{isolated}),\quad0\ (\text{grounded})`},
 'electrostatic-shield':{plain:'Closed grounded shell · external sources affect no cavity field',tex:String.raw`\text{closed grounded shell: }\mathbf E_{\rm cavity}\text{ independent of external sources}`}
});
