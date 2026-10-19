import {EPS0,NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

const control=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export const domainDefaults=Object.freeze({
 'laplace-square':{r:1,n:2,q:0,a:.375,b:.625},
 'longitudinal-invariance':{r:0,n:0,q:1,a:.4,b:.3},
 'complex-wedge':{r:.25,n:0,q:1,a:.25,b:1},
 'complex-edge':{r:.25,q:1,a:.25,b:1},
 'complex-corner':{r:.25,q:1,a:.25,b:1},
 'complex-log-domain':{r:1,q:1,a:45,b:0},
 'line-dipole-domain':{r:2,q:1,a:.4,b:60}
});
export const domainNames=Object.freeze(Object.keys(domainDefaults).filter(n=>n!=='complex-wedge'));
export function domainControls(scene){
 const all={
  'laplace-square':[control('r','Top boundary amplitude V₀',-2,2,.05,'V'),control('n','Grid level: 9 / 17 / 33 / 65 nodes',0,3,1),control('q','Top: conductor / smooth verification profile',0,1,1),control('a','Probe x / L',.125,.875,.025),control('b','Probe y / L',.125,.875,.025)],
  'longitudinal-invariance':[control('r','Physical longitudinal Z / L',-.5,.5,.025),control('n','Example: invariant / Z-dependent',0,1,1),control('q','Potential amplitude A',-2,2,.05,'V'),control('a','Probe x / L',-.8,.8,.025),control('b','Probe y / L',-.8,.8,.025)],
  'complex-wedge':[control('r','Distance from tip r / L',.02,.9,.01),control('n','Metal: thin plate / right-angle corner',0,1,1),control('q','Outer amplitude A',-2,2,.05,'V'),control('a','Angle fraction θ / Ω',.02,.98,.01),control('b','Reference length L',.5,2,.05,'m')],
  'complex-log-domain':[control('r','Radius r / rref',.1,3,.025),control('q','Infinite line density λ',-2,2,.05,'nC/m'),control('a','Angle θ (cut endpoints are one-sided limits)',-180,180,1,'°'),control('b','Conjugate branch index',-1,1,1)],
  'line-dipole-domain':[control('r','Distance from midpoint r',1,4,.025,'m'),control('q','Line density magnitude λ',.5,2,.05,'nC/m'),control('a','Wire separation d',.1,.5,.025,'m'),control('b','Observation angle from +x',0,360,1,'°')]
 };
 if(scene==='complex-edge'||scene==='complex-corner')return all['complex-wedge'].filter(c=>c.key!=='n');
 if(!all[scene])throw Error('Unknown Laplace domain model.');return all[scene];
}
const gridSizes=[9,17,33,65],gridCache=new Map();
// Stable sinh(k*y)/sinh(k), with unit square coordinates and k>0.
const sinhRatio=(k,y)=>Math.exp(-k*(1-y))*(-Math.expm1(-2*k*y))/(-Math.expm1(-2*k));
export function squareReference(mode,x,y,terms=256){
 if(![0,1].includes(mode)||!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>1||y<0||y>1||!Number.isInteger(terms)||terms<1)throw Error('Square reference domain.');
 if(mode===1)return {phi:Math.sin(Math.PI*x)*sinhRatio(Math.PI,y),tailBound:0};
 if(y===0||x===0||x===1)return {phi:0,tailBound:0};
 if(y===1)return {phi:1,tailBound:0};
 let phi=0;
 for(let j=0;j<terms;j++){const n=2*j+1;phi+=4/(Math.PI*n)*Math.sin(n*Math.PI*x)*sinhRatio(n*Math.PI,y);}
 const next=2*terms+1,d=1-y,tailBound=4/Math.PI*Math.exp(-next*Math.PI*d)/(next*(-Math.expm1(-2*Math.PI*d))*(-Math.expm1(-2*Math.PI)));
 return {phi,tailBound};
}
export function interpolateGrid(grid,x,y,values=grid.values){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>1||y<0||y>1)throw Error('Grid interpolation domain.');
 const u=x*(grid.N-1),v=y*(grid.N-1),i=Math.min(grid.N-2,Math.floor(u)),j=Math.min(grid.N-2,Math.floor(v)),tx=u-i,ty=v-j,at=(a,b)=>values[b*grid.N+a];
 return (1-tx)*(1-ty)*at(i,j)+tx*(1-ty)*at(i+1,j)+(1-tx)*ty*at(i,j+1)+tx*ty*at(i+1,j+1);
}
export function solveSquare(mode,N,{tolerance=1e-8,maxSweeps=20000}={}){
 if(![0,1].includes(mode)||!gridSizes.includes(N)||!(tolerance>0)||!Number.isInteger(maxSweeps)||maxSweeps<1)throw Error('Bounded grid settings required.');
 const h=1/(N-1),values=new Float64Array(N*N),at=(i,j)=>j*N+i,omega=2/(1+Math.sin(Math.PI/(N-1)));
 for(let i=1;i<N-1;i++)values[at(i,N-1)]=mode?Math.sin(Math.PI*i*h):1;
 // The two top corners are insulated ideal junctions. Their nodal convention
 // does not enter any interior five-point equation. No touching conductors.
 values[at(0,N-1)]=mode?0:.5;values[at(N-1,N-1)]=mode?0:.5;
 let residual=Infinity,sweeps=0;
 for(;sweeps<maxSweeps;sweeps++){
  for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const p=at(i,j),mean=(values[p-1]+values[p+1]+values[p-N]+values[p+N])/4;values[p]+=omega*(mean-values[p]);}
  if(sweeps%4===3||sweeps===maxSweeps-1){residual=0;for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const p=at(i,j);residual=Math.max(residual,Math.abs(values[p-1]+values[p+1]+values[p-N]+values[p+N]-4*values[p])/(h*h));}if(residual<=tolerance){sweeps++;break;}}
 }
 if(residual>tolerance)throw Error('Laplace grid did not converge within its bounded sweep budget.');
 const Ex=new Float64Array(N*N),Ey=new Float64Array(N*N);
 for(let j=1;j<N-1;j++)for(let i=1;i<N-1;i++){const p=at(i,j);Ex[p]=-(values[p+1]-values[p-1])/(2*h);Ey[p]=-(values[p+N]-values[p-N])/(2*h);}
 const grid={N,h,mode,values,Ex,Ey,residual,sweeps,tolerance};let coreError=0,maxSeriesTail=0;
 for(let j=0;j<=12;j++)for(let i=0;i<=12;i++){const x=.125+i/16,y=.125+j/16,ref=squareReference(mode,x,y);coreError=Math.max(coreError,Math.abs(interpolateGrid(grid,x,y)-ref.phi));maxSeriesTail=Math.max(maxSeriesTail,ref.tailBound);}
 return {...grid,coreError,maxSeriesTail};
}
const cachedGrid=(mode,N)=>{const key=mode+':'+N;if(!gridCache.has(key))gridCache.set(key,solveSquare(mode,N));return gridCache.get(key);};
export function wedgeValue(n,A,L,r,theta){
 const alpha=n?2/3:.5,opening=Math.PI/alpha;
 if(![0,1].includes(n)||!Number.isFinite(A)||!Number.isFinite(r)||!Number.isFinite(theta)||!(r>0)||theta<0||theta>opening||!Number.isFinite(L)||!(L>0))throw Error('Exterior wedge excludes its tip and metal.');
 const rho=r/L,U=A*rho**alpha*Math.cos(alpha*theta),phi=A*rho**alpha*Math.sin(alpha*theta),g=A*alpha/L*rho**(alpha-1);
 return {alpha,opening,U,phi,E:[-g*Math.sin((alpha-1)*theta),-g*Math.cos((alpha-1)*theta)],fieldMagnitude:Math.abs(g)};
}
export function logValue(lambda,r,theta,branch=0,rref=1){
 if(!Number.isFinite(lambda)||!Number.isFinite(r)||!Number.isFinite(theta)||!(r>0)||!Number.isFinite(rref)||!(rref>0)||!Number.isInteger(branch))throw Error('Logarithm excludes the line and needs a finite reference.');
 const coefficient=lambda/(2*Math.PI*EPS0),phi=-coefficient*Math.log(r/rref),conjugate=-coefficient*(theta+2*Math.PI*branch);
 return {phi,conjugate,E:[coefficient/r*Math.cos(theta),coefficient/r*Math.sin(theta)],coefficient};
}
export function linePairValue(lambda,d,P){
 if(!Number.isFinite(lambda)||lambda===0||!Number.isFinite(d)||!(d>0)||!Array.isArray(P)||P.length!==2||!P.every(Number.isFinite))throw Error('Nonzero bounded line pair required.');
 const plus=[P[0]-d/2,P[1]],minus=[P[0]+d/2,P[1]],rp=Math.hypot(...plus),rm=Math.hypot(...minus),C=lambda/(2*Math.PI*EPS0),r=Math.hypot(...P),D=C*d;
 if(Math.min(rp,rm,r)<=0)throw Error('Line-source singularity excluded.');
 const exactPhi=C*Math.log(rm/rp),exactE=P.map((_,i)=>C*(plus[i]/rp**2-minus[i]/rm**2)),phi=D*P[0]/r**2,E=[D*(P[0]**2-P[1]**2)/r**4,2*D*P[0]*P[1]/r**4];
 return {exactPhi,exactE,phi,E,momentPerLength:lambda*d,relativeError:Math.hypot(...E.map((v,i)=>v-exactE[i]))/Math.hypot(...exactE),r,ratio:r/d};
}
export function domainModel(scene,state={}){
 const s={...domainDefaults[scene],...state};
 if(scene==='complex-edge'||scene==='complex-corner'){const mode=scene==='complex-corner'?1:0;if(s.n!==undefined&&s.n!==mode)throw Error('Source wedge topology is fixed.');s.n=mode;}
 for(const c of domainControls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max||c.step===1&&!Number.isInteger(s[c.key]))throw Error('Invalid domain parameter: '+c.key);
 let m;
 if(scene==='laplace-square'){
  const N=gridSizes[s.n],grid=cachedGrid(s.q,N),ref=squareReference(s.q,s.a,s.b),phi=s.r*interpolateGrid(grid,s.a,s.b),otherN=gridSizes[s.n===3?2:s.n+1],other=cachedGrid(s.q,otherN),otherPhi=s.r*interpolateGrid(other,s.a,s.b),reference=s.r*ref.phi;
  m={grid,N,h:grid.h,phi,reference,error:Math.abs(phi-reference),coreError:Math.abs(s.r)*grid.coreError,residual:Math.abs(s.r)*grid.residual,otherN,gridDifference:Math.abs(phi-otherPhi),seriesTail:Math.abs(s.r)*ref.tailBound,E:[s.r*interpolateGrid(grid,s.a,s.b,grid.Ex),s.r*interpolateGrid(grid,s.a,s.b,grid.Ey)],P:[s.a,s.b]};
 }else if(scene==='longitudinal-invariance'){
  const x=s.a,y=s.b,Z=s.r,A=s.q,L=1,phi=A*(s.n?x*x+y*y-2*Z*Z:x*x-y*y),E=[-2*A*x,(s.n?-2:2)*A*y,s.n?4*A*Z:0],second=[2*A,s.n?2*A:-2*A,s.n?-4*A:0];
  m={x,y,Z,A,L,phi,E,second,laplacian:second.reduce((a,b)=>a+b,0),sliceLaplacian:second[0]+second[1],phiAt:z=>A*(s.n?x*x+y*y-2*z*z:x*x-y*y)};
 }else if(['complex-wedge','complex-edge','complex-corner'].includes(scene)){
  const alpha=s.n?2/3:.5,opening=Math.PI/alpha,theta=s.a*opening,L=s.b,r=s.r*L,value=wedgeValue(s.n,s.q,L,r,theta);
  m={...value,r,L,theta,P:[r*Math.cos(theta),r*Math.sin(theta)],surfaceCharge:-EPS0*s.q*alpha/L*s.r**(alpha-1),doublingRatio:2**(alpha-1),phiAt:(x,y)=>{let t=Math.atan2(y,x);if(t<0)t+=2*Math.PI;return wedgeValue(s.n,s.q,L,Math.hypot(x,y),t).phi;}};
 }else if(scene==='complex-log-domain'){
  const theta=s.a*Math.PI/180,r=s.r,lambda=s.q*NC,value=logValue(lambda,r,theta,s.b);
  m={...value,r,theta,lambda,rref:1,P:[r*Math.cos(theta),r*Math.sin(theta)],flux:lambda/EPS0,branchJump:-lambda/EPS0,phiAt:(x,y)=>logValue(lambda,Math.hypot(x,y),Math.atan2(y,x),s.b).phi};
 }else{
  const theta=s.b*Math.PI/180,P=[s.r*Math.cos(theta),s.r*Math.sin(theta)],lambda=s.q*NC,d=s.a;
  m={...linePairValue(lambda,d,P),theta,P,lambda,d,phiAt:(x,y)=>linePairValue(lambda,d,[x,y]).phi};
 }
 return {...m,state:s};
}
const fmt=n=>Math.abs(n)<1e-14?'0':Number(n.toPrecision(4)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const arrow=(id,P,E,scale,style='normal')=>({id,type:'arrow',from:P,to:[P[0]+E[0]*scale,P[1]-E[1]*scale],style,visible:Math.hypot(E[0],E[1])>1e-12});
const rows=(shapes,values)=>values.forEach((v,i)=>shapes.push(text('readout-'+i,450,85+i*29,v)));
function contours(fn,levels,at,lo,hi,N=33){
 const result=[];
 for(const level of levels){const points=[];for(let j=0;j<N-1;j++)for(let i=0;i<N-1;i++){
  const x=lo+(hi-lo)*i/(N-1),y=lo+(hi-lo)*j/(N-1),h=(hi-lo)/(N-1),vertices=[[x,y],[x+h,y],[x+h,y+h],[x,y+h]],values=vertices.map(p=>fn(...p)),cross=[];
  for(let e=0;e<4;e++){const f=(e+1)%4,a=values[e],b=values[f];if(a<=level&&b>level||b<=level&&a>level){const t=(level-a)/(b-a);cross.push(at(vertices[e][0]+t*(vertices[f][0]-vertices[e][0]),vertices[e][1]+t*(vertices[f][1]-vertices[e][1])));}}
  for(let k=0;k+1<cross.length;k+=2)points.push(cross[k],cross[k+1],[NaN,NaN]);
 }result.push(points);}return result;
}
export function domainDefinition(scene,state){
 const m=domainModel(scene,state),s=m.state,shapes=[];let title,context;
 if(scene==='laplace-square'){
  title='LAPLACE · BOUNDARIES AND GRID ERROR';context='1 m square · fixed boundaries · insulated corner junctions · E arrow direction only';
  const at=(x,y)=>[55+230*x,305-230*y];
  if(s.r!==0)contours((x,y)=>interpolateGrid(m.grid,x,y),[.15,.3,.45,.6,.75,.9],at,0,1).forEach((p,i)=>shapes.push(curve('contour-'+i,p)));
  shapes.push(line('bottom',at(0,0),at(1,0),'axis'),line('left',at(0,0),at(0,1),'axis'),line('right',at(1,0),at(1,1),'axis'),line('top',at(.025,1),at(.975,1),'normal'),text('top-value',170,55,s.q?'Top: V₀ sin(πx/L)':'Top conductor: '+fmt(s.r)+' V'),text('left-zero',35,190,'0 V'),text('right-zero',306,190,'0 V'),text('bottom-zero',170,319,'0 V'));
  const P=at(...m.P),scale=27/Math.max(1,Math.hypot(...m.E));shapes.push(point('P',P),text('P-label',P[0]+10,P[1]-15,'P'),arrow('E',P,m.E,scale));
  rows(shapes,['N = '+m.N+' · h = '+fmt(m.h)+' m','Discrete residual = '+fmt(m.residual)+' V/m²','φ_h(P) = '+fmt(m.phi)+' V','φ_ref(P) = '+fmt(m.reference)+' V','P error = '+fmt(m.error)+' V','Core sample error = '+fmt(m.coreError)+' V','|φ_'+m.N+' − φ_'+m.otherN+'| = '+fmt(m.gridDifference)+' V','|E_h(P)| ≈ '+fmt(Math.hypot(...m.E))+' V/m','SOR sweeps = '+m.grid.sweeps+' · refine N']);
  shapes.push(text('contour-key',170,335,s.r===0?'Zero boundary data: φ = 0, E = 0':'Blue: φ/V₀ = 0.15, 0.30, …, 0.90'));
 }else if(scene==='longitudinal-invariance'){
  title='PHYSICAL Z · WHEN A 2D REDUCTION IS VALID';context='Local harmonic 3D examples · L=1 m · xy arrow scale: 13 px per V/m';
  const at=(x,y)=>[175+110*x,188-110*y];
  if(s.q!==0)contours((x,y)=>s.n?x*x+y*y-2*s.r*s.r:x*x-y*y,[-.8,-.4,0,.4,.8],at,-1,1).forEach((p,i)=>shapes.push(curve('level-'+i,p)));
  shapes.push(line('x-axis',at(-1,0),at(1,0),'axis'),line('y-axis',at(0,-1),at(0,1),'axis'),point('P',at(m.x,m.y)),arrow('E',at(m.x,m.y),m.E,13),text('slice-title',175,62,'Contours in the selected physical Z plane'));
  const zValues=[-.5,0,.5];zValues.forEach((z,i)=>{shapes.push(text('Z-'+i,82+i*92,310,'Z/L='+z),text('slice-'+i,82+i*92,327,fmt(m.phiAt(z))+' V'));});
  rows(shapes,['φ(P) = '+fmt(m.phi)+' V','E_x = '+fmt(m.E[0])+' V/m','E_y = '+fmt(m.E[1])+' V/m','E_Z = '+fmt(m.E[2])+' V/m','∂²xφ = '+fmt(m.second[0])+' V/m²','∂²yφ = '+fmt(m.second[1])+' V/m²','∂²Zφ = '+fmt(m.second[2])+' V/m²','3D sum = '+fmt(m.laplacian)+' V/m²','2D sum = '+fmt(m.sliceLaplacian)+' V/m²']);
 }else if(['complex-wedge','complex-edge','complex-corner'].includes(scene)){
  title=s.n?'EXTERIOR CORNER · 270° VACUUM WEDGE':'THIN PLATE EDGE · POSITIVE-X BRANCH CUT';context='Local ideal wedge · tip excluded · blue φ / gold U · E arrow direction only';
  const at=(rho,theta)=>[177+115*rho*Math.cos(theta),192-115*rho*Math.sin(theta)];
  for(const [kind,levels] of [['phi',[.2,.4,.6,.8]],['U',[-.8,-.4,0,.4,.8]]])for(const value of levels){
   if(kind==='U'&&value===0){if(s.q!==0)shapes.push(curve('U-zero',Array.from({length:65},(_,i)=>at(.015+.985*i/64,Math.PI/(2*m.alpha))),'gold-curve'));continue;}
   const points=Array.from({length:321},(_,i)=>{const theta=.0001+(m.opening-.0002)*i/320,den=kind==='phi'?Math.sin(m.alpha*theta):Math.cos(m.alpha*theta);if(Math.abs(den)<1e-8)return [NaN,NaN];const ratio=value/den;if(ratio<0)return [NaN,NaN];const rho=ratio**(1/m.alpha);return rho>=.015&&rho<=1?at(rho,theta):[NaN,NaN];});
   if(s.q!==0)shapes.push(curve(kind+'-'+value,points,kind==='phi'?'blue-curve':'gold-curve'));
  }
  shapes.push(line('face-1',at(0,0),at(1,0),'axis'),text('origin',160,205,'tip excluded'));
  if(s.n){shapes.push(line('face-2',at(0,0),at(1,m.opening),'axis'));for(let i=1;i<=7;i++)shapes.push(line('metal-'+i,[177+i*13,197],[182+i*13,220+i*5],'background'));shapes.push(text('metal-label',239,268,'90° metal'));}else shapes.push(text('plate-label',250,218,'grounded ray'));
  const P=at(s.r,m.theta),scale=26/Math.max(1,Math.hypot(...m.E));shapes.push(point('P',P),text('P-label',P[0]+12,P[1]-14,'P'),arrow('E',P,m.E,scale));
  rows(shapes,['α = '+fmt(m.alpha)+' · Ω = '+fmt(m.opening*180/Math.PI)+'°','r = '+fmt(m.r)+' m · θ = '+fmt(m.theta*180/Math.PI)+'°','φ(P) = '+fmt(m.phi)+' V','E_x = '+fmt(m.E[0])+' V/m','E_y = '+fmt(m.E[1])+' V/m','|E| = '+fmt(m.fieldMagnitude)+' V/m','σ on either face = '+fmt(m.surfaceCharge/NC)+' nC/m²','Double r: |E| × '+fmt(m.doublingRatio),'φ = 0 on both metal faces']);
  shapes.push(text('domain-key',175,315,'Only the exterior vacuum domain is drawn'));
 }else if(scene==='complex-log-domain'){
  title='COMPLEX LOG · PHYSICAL FIELD AND BRANCH';context='Infinite Z line · rref=1 m · conjugate angle cut · E arrow direction only';
  const at=(x,y)=>[175+36*x,190-36*y];
  if(s.q!==0){for(const radius of [.5,1,2,3])shapes.push(curve('level-'+radius,Array.from({length:129},(_,i)=>at(radius*Math.cos(i*Math.PI/64),radius*Math.sin(i*Math.PI/64)))));
   for(let i=0;i<12;i++){const theta=i*Math.PI/6;shapes.push(line('ray-'+i,at(.2*Math.cos(theta),.2*Math.sin(theta)),at(3*Math.cos(theta),3*Math.sin(theta)),'sample-field'));}}
  shapes.push(line('angle-cut',at(-3,0),at(0,0),'background'),point('line-source',[175,190]),text('line-label',175,219,'λ · line excluded'),text('cut-label',85,169,'angle cut'));
  const P=at(...m.P),scale=25/Math.max(1,Math.hypot(...m.E));shapes.push(point('P',P),text('P-label',P[0]+12,P[1]-14,'P'),arrow('E',P,m.E,scale));
  rows(shapes,['φ(P) = '+fmt(m.phi)+' V','ψ(P) = '+fmt(m.conjugate)+' V','E_x = '+fmt(m.E[0])+' V/m','E_y = '+fmt(m.E[1])+' V/m','2πr E_r = '+fmt(m.flux)+' V','Branch shift Δψ = '+fmt(m.branchJump)+' V','Branch leaves φ and E unchanged','φ(rref) = 0 · finite reference']);
  shapes.push(text('log-key',175,315,s.q===0?'Zero density: φ = ψ = 0, E = 0':'Blue: φ levels · gold: local ψ levels'));
 }else{
  title='LINE DIPOLE · TWO WIRES AND THEIR FAR LIMIT';context='Infinite parallel wires along Z · exact blue / dipole gold · fixed λ when d changes';
  const at=p=>[175+28*p[0],188-28*p[1]],P=at(m.P),scale=27/Math.max(1,Math.hypot(...m.exactE),Math.hypot(...m.E));
  shapes.push(line('x-axis',[50,188],[300,188],'axis'),line('radius',[175,188],P),point('plus',at([m.d/2,0])),point('minus',at([-m.d/2,0])),text('plus-label',197,163,'+λ'),text('minus-label',151,216,'−λ'),point('P',P),text('P-label',P[0]+12,P[1]-14,'P'),arrow('exact',P,m.exactE,scale,'normal'),arrow('approx',P,m.E,scale,'sample-field'));
  rows(shapes,['p per unit length = '+fmt(m.momentPerLength/NC)+' nC','r / d = '+fmt(m.ratio),'Exact φ = '+fmt(m.exactPhi)+' V','Dipole φ = '+fmt(m.phi)+' V','|E_dip| = '+fmt(Math.hypot(...m.E))+' V/m','Vector error = '+fmt(100*m.relativeError)+'%','Double r: line E × 1/4','Point dipole E × 1/8 (own norm)','E scale = '+fmt(scale)+' px per V/m']);
  shapes.push(text('wire-key',175,295,'Wire cross-sections · line moment has units C'),text('power-key',175,315,'Each decay ratio uses its own E(r)'));
 }
 const first=domainControls(scene)[0],scale=210/(first.max-first.min),origin=65-first.min*scale;
 shapes.push(line('track',[65,363],[275,363],'axis'),point('probe',[origin+s[first.key]*scale,363],true),text('track-label',170,350,first.label+(first.units?' ('+first.units+')':'')),text('title',300,27,title),text('context',300,423,context),text('hint',300,445,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:scene,x:300,y:399}],probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export function drawDomain(scene,state){const d=domainDefinition(scene,state);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,386,(domainEquations[scene]||authoredEquations['complex-wedge']).plain)]),metrics:[],label:d.label};}
export function domainChecks(scene){
 const states=[domainDefaults[scene]];for(const c of domainControls(scene))for(const value of [c.min,(c.min+c.max)/2,c.max])states.push({...domainDefaults[scene],[c.key]:c.step===1?Math.round(value):value});let checks=0;
 for(const s of states){const m=domainModel(scene,s);
  if(scene==='laplace-square'){if(m.residual>2.01e-8||m.grid.values.some(v=>v< -1e-10||v>1+1e-10))throw Error('Grid convergence or maximum principle failed.');checks+=2;}
  if(scene==='longitudinal-invariance'){if(Math.abs(m.laplacian)>1e-12||!s.n&&m.E[2]!==0)throw Error('Longitudinal identity failed.');checks+=2;}
  if(['complex-wedge','complex-edge','complex-corner'].includes(scene)){if(Math.abs(wedgeValue(m.state.n,s.q,s.b,m.r,0).phi)>1e-12||Math.abs(wedgeValue(m.state.n,s.q,s.b,m.r,m.opening).phi)>1e-12)throw Error('Wedge boundary failed.');checks+=2;}
  if(scene==='complex-log-domain'){if(Math.abs(2*Math.PI*m.r*Math.hypot(...m.E)-Math.abs(m.flux))>1e-10)throw Error('Line flux failed.');checks++;}
  if(scene==='line-dipole-domain'){if(m.ratio<2||Math.abs(Math.hypot(...m.E)-Math.abs(m.momentPerLength)/(2*Math.PI*EPS0*m.r**2))>1e-10)throw Error('Line dipole domain or field law failed.');checks+=2;}
  for(const p of domainDefinition(scene,s).shapes)if(p.type==='text'&&/NaN|Infinity/.test(p.text))throw Error('Nonfinite domain readout.');checks++;
 }
 return {passed:true,states:states.length,checks,method:'Bounded grid residual/maximum principle, exact longitudinal identities, wedge boundary conditions, line flux and line-dipole radial law.'};
}
const authoredEquations={
 'laplace-square':{plain:'Δ_hφ = (φ_E + φ_W + φ_N + φ_S − 4φ)/h² ≈ 0',tex:String.raw`\Delta_h\phi=\frac{\phi_E+\phi_W+\phi_N+\phi_S-4\phi}{h^2}\approx0`},
 'longitudinal-invariance':{plain:'∂²xφ + ∂²yφ + ∂²Zφ = 0 · invariance requires ∂Zφ = 0',tex:String.raw`\partial_x^2\phi+\partial_y^2\phi+\partial_Z^2\phi=0\quad\partial_Z\phi=0\ \text{for invariance}`},
 'complex-wedge':{plain:'φ = A(r/L)^α sin(αθ) · αΩ = π · |E| = |A|α(r/L)^(α−1)/L',tex:String.raw`\phi=A(r/L)^\alpha\sin(\alpha\theta)\quad\alpha\Omega=\pi\quad|\mathbf E|=\frac{|A|\alpha}{L}(r/L)^{\alpha-1}`},
 'complex-log-domain':{plain:'φ = −λ ln(r/rref)/(2πε₀) · E_r = λ/(2πε₀r)',tex:String.raw`\phi=-\frac{\lambda}{2\pi\epsilon_0}\ln(r/r_{\rm ref})\qquad E_r=\frac{\lambda}{2\pi\epsilon_0r}`},
 'line-dipole-domain':{plain:'p_L = λd (C) · φ_dip = p_L cosθ/(2πε₀r) · |E_dip| = |p_L|/(2πε₀r²)',tex:String.raw`p_L=\lambda d\ (\mathrm C)\quad\phi_{\rm dip}=\frac{p_L\cos\theta}{2\pi\epsilon_0r}\quad|\mathbf E_{\rm dip}|=\frac{|p_L|}{2\pi\epsilon_0r^2}`}
};
export const domainEquations=Object.freeze(Object.fromEntries(domainNames.map(n=>[n,authoredEquations[n]||authoredEquations['complex-wedge']])));
