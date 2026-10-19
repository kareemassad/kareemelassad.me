import {primitivesSVG} from './scene-primitives.js';
export const gradientNames=Object.freeze(['gradient-direction','gradient-coordinates']);
const radians=angle=>angle*Math.PI/180;
export const rotateComponents=(v,theta)=>{const c=Math.cos(radians(theta)),s=Math.sin(radians(theta));return [c*v[0]+s*v[1],-s*v[0]+c*v[1]];};
export const temperature=(x,y,kappa)=>20+2*x+y+kappa*(x*x+y*y)/2;
export function gradientModel(scene,s){
 if(!gradientNames.includes(scene))throw Error('Unsupported gradient model.');
 const h=s.r,beta=s.b,theta=scene==='gradient-coordinates'?s.a:0,kappa=scene==='gradient-direction'?s.q:0;
 if(![h,beta,theta,kappa].every(Number.isFinite)||h<(scene==='gradient-direction'?.02:.1)||h>.8||beta<0||beta>360||theta< -90||theta>90||kappa<0||kappa>1.5)throw Error('Invalid gradient state.');
 const u=[Math.cos(radians(beta)),Math.sin(radians(beta))],displacement=u.map(n=>n*h),gradient=[2,1],directional=2*u[0]+u[1],linear=h*directional,exact=temperature(...displacement,kappa)-20,error=kappa*h*h/2;
 const rotatedGradient=rotateComponents(gradient,theta),rotatedDisplacement=rotateComponents(displacement,theta),rotatedDot=rotatedGradient.reduce((sum,n,i)=>sum+n*rotatedDisplacement[i],0);
 return {h,beta,theta,kappa,u,displacement,gradient,directional,linear,exact,error,rotatedGradient,rotatedDisplacement,rotatedDot};
}
// Two analytic branches per level keep the adapter's primitive topology stable.
// NaN separates clipped curve fragments. It never enters a numerical model value.
export function contourPoints(level,kappa,branch){
 const points=[];for(let i=0;i<=120;i++){
  const x=-1.5+i/40;let y;
  if(kappa===0)y=branch===1?level-2*x:NaN;
  else{const d=1-2*kappa*(2*x+kappa*x*x/2-level);y=d>=0?(-1+branch*Math.sqrt(d))/kappa:NaN;}
  points.push(Number.isFinite(y)&&Math.abs(y)<=1.5?[x,y]:[NaN,NaN]);
 }return points;
}
const fmt=n=>Math.abs(n)<1e-9?'0':Number(n.toPrecision(3)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const curve=(id,points,style='field')=>({id,type:'curve',points,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
export function gradientDefinition(scene,s){
 const m=gradientModel(scene,s),shapes=[],P=[155,185],scale=62,at=v=>[P[0]+v[0]*scale,P[1]-v[1]*scale],Q=at(m.displacement),G=[P[0]+60,P[1]-30];
 shapes.push(text('title',300,30,scene==='gradient-direction'?'LOCAL GRADIENT · FIRST-ORDER PREDICTION':'ROTATED AXES · FIXED PHYSICAL VECTORS'));
 for(const level of [-3,-2,-1,0,1,2,3])for(const branch of [1,-1])shapes.push(curve('contour'+level+':'+branch,contourPoints(level,m.kappa,branch).map(at),'contour'));
 shapes.push(line('x',at([-1.5,0]),at([1.5,0]),'axis'),line('y',at([0,-1.5]),at([0,1.5]),'axis'),text('x-label',268,195,scene==='gradient-coordinates'&&m.theta===0?'x = x′':'x'),text('y-label',155,74,scene==='gradient-coordinates'&&m.theta===0?'y = y′':'y'));
 shapes.push({id:'gradient',type:'arrow',from:P,to:G,visible:true},text('gradient-label',155,55,'∇T(P) = (2, 1) °C/m'),{id:'displacement',type:'arrow',from:P,to:Q,visible:true},point('P',P),text('P-label',145,201,'P'),point('Q',Q),text('Q-label',Q[0]+10,Q[1]-18,'Q'));
 shapes.push(text('field-model',155,305,'T = 20 + 2x + y + κ(x²+y²)/2'),text('field-units',155,325,'x, y: m · T: °C · P = (0, 0)'),text('field-scale',155,345,'Contours: 1 °C · ∇T arrow: separate scale'));
 let probe,equations,label;
 if(scene==='gradient-direction'){
  // The full audited domain has |ΔT| < 2.27 °C. Keep one ±2.5 °C
  // scale so changing direction or curvature remains comparable.
  const samples=Array.from({length:81},(_,i)=>i*.01),lo=-2.5,hi=2.5,gx=h=>335+h/.8*220,gy=v=>187-v/2.5*85;
  shapes.push(line('dx',P,[Q[0],P[1]]),line('dy',[Q[0],P[1]],Q),text('dx-label',(P[0]+Q[0])/2,P[1]+38,'Δx'),text('dy-label',Q[0]+27,(P[1]+Q[1])/2,'Δy'));
  shapes.push(text('profile-title',445,64,'Change along the selected direction'),text('profile-units',445,82,'ΔT (°C)'),line('profile-x',[335,272],[555,272],'axis'),line('profile-y',[335,102],[335,272],'axis'),line('profile-zero',[335,gy(0)],[555,gy(0)]),text('hi',317,102,fmt(hi)),text('lo',317,272,fmt(lo)),text('zero',335,294,'0'),text('end',552,294,'0.8'),text('distance',445,314,'Distance s along ΔR (m)'));
  shapes.push(curve('exact',samples.map(h=>[gx(h),gy(m.directional*h+m.kappa*h*h/2)])),curve('tangent',samples.map(h=>[gx(h),gy(m.directional*h)]),'reference'),point('probe',[gx(m.h),gy(m.exact)],true),line('error',[gx(m.h),gy(m.linear)],[gx(m.h),gy(m.exact)]),text('legend',445,337,'Solid: exact · dashed: first order'));
  shapes.push(text('finite-exact',165,363,'Exact ΔT = '+fmt(m.exact)+' °C'),text('finite-linear',445,363,'First order = '+fmt(m.linear)+' °C'));
  equations=[{id:'gradient-differential',x:300,y:389}];probe={id:'probe',parameter:'r',origin:335,scale:220/.8,min:.02,max:.8};label='Authored scalar temperature field, local gradient, linked exact finite change and first-order prediction';
 }else{
  const e1=[Math.cos(radians(m.theta)),Math.sin(radians(m.theta))],e2=[-e1[1],e1[0]],axis=v=>[P[0]+v[0]*88,P[1]-v[1]*88],component=e1.map(v=>v*m.rotatedGradient[0]*30),componentEnd=[P[0]+component[0],P[1]-component[1]];
  shapes.push(line('prime-x',axis(e1.map(v=>-v)),axis(e1),'axis'),line('prime-y',axis(e2.map(v=>-v)),axis(e2),'axis'),text('prime-x-label',P[0]+96*e1[0]+14*e2[0],P[1]-96*e1[1]-14*e2[1],m.theta===0?'':'x′'),text('prime-y-label',P[0]+96*e2[0]-14*e1[0],P[1]-96*e2[1]+14*e1[1],m.theta===0?'':'y′'),line('component1',P,componentEnd),line('component2',componentEnd,G));
  const gx=t=>335+(t+90)/180*220,gy=v=>187-v/2.5*85,samples=Array.from({length:91},(_,i)=>-90+i*2);
  shapes.push(text('profile-title',445,64,'Gradient components in rotated axes'),text('profile-units',445,82,'Components (°C/m)'),line('profile-x',[335,272],[555,272],'axis'),line('profile-y',[335,102],[335,272],'axis'),line('profile-zero',[335,187],[555,187]),text('hi',317,102,'2.5'),text('lo',317,272,'−2.5'),text('start',335,291,'−90°'),text('end',553,291,'90°'),text('angle',445,314,'Axis rotation θ'));
  shapes.push(curve('gx-prime',samples.map(t=>[gx(t),gy(rotateComponents(m.gradient,t)[0])])),curve('gy-prime',samples.map(t=>[gx(t),gy(rotateComponents(m.gradient,t)[1])]),'patch'),point('probe',[gx(m.theta),gy(m.rotatedGradient[0])],true),text('legend',445,337,'Dark: ∂T/∂x′ · blue: ∂T/∂y′'));
  const pair=v=>'('+v.map(fmt).join(', ')+')';
  shapes.push(text('original-dot',300,359,'g · ΔR: (2, 1) · '+pair(m.displacement)+' ≈ '+fmt(m.linear)+' °C'),text('rotated-dot',300,378,'g′ · ΔR′: '+pair(m.rotatedGradient)+' · '+pair(m.rotatedDisplacement)+' ≈ '+fmt(m.rotatedDot)+' °C'));
  equations=[{id:'gradient-rotation',x:300,y:400}];probe={id:'probe',parameter:'a',origin:445,scale:220/180,min:-90,max:90};label='Same physical gradient and displacement, rotated coordinate axes and linked gradient components';
 }
 shapes.push(text('context',300,425,scene==='gradient-direction'?'Correction κh²/2 = '+fmt(m.error)+' °C · fixed plot scale · z fixed':'Rounded components · linear field (κ = 0) · vectors fixed'),text('hint',300,443,scene==='gradient-direction'?'Drag graph point: distance · ↑ / ↓: direction · Space: pause / play':'Drag graph point: axis angle · ↑ / ↓: direction · Space: pause / play'));
 return {schemaVersion:1,scene,label,sourceScope:label,width:600,height:452,shapes,equations,probe};
}
export function drawGradient(scene,s){
 const m=gradientModel(scene,s),d=gradientDefinition(scene,s),shapes=d.shapes.filter(x=>!['context','hint'].includes(x.id));
 shapes.push(text('equation',300,d.equations[0].y,scene==='gradient-direction'?'dT = ∇T · dR     ΔT = ∇T(P) · ΔR + κh²/2':'g′ = R(−θ)g     ΔR′ = R(−θ)ΔR     g′ · ΔR′ = g · ΔR'));
 return {body:primitivesSVG(shapes),label:d.label,metrics:scene==='gradient-direction'?[{label:'Directional derivative at P',value:fmt(m.directional)+' °C/m'},{label:'First-order prediction',value:fmt(m.linear)+' °C'},{label:'Exact illustrative change',value:fmt(m.exact)+' °C'},{label:'Finite-step correction',value:fmt(m.error)+' °C'}]:[{label:'Gradient (x′, y′)',value:m.rotatedGradient.map(fmt).join(', ')+' °C/m'},{label:'Displacement (x′, y′)',value:m.rotatedDisplacement.map(fmt).join(', ')+' m'},{label:'Dot product, both bases',value:fmt(m.rotatedDot)+' °C'},{label:'Gradient magnitude',value:fmt(Math.sqrt(5))+' °C/m'}]};
}
export function gradientChecks(scene){
 let maxError=0,states=0;for(const r of [.02,.1,.4,.8])for(const b of [0,30,90,122,180,270,360])for(const a of [-90,-35,0,35,90])for(const q of [0,.5,1.5]){
  if(scene==='gradient-coordinates'&&r<.1)continue;const m=gradientModel(scene,{r,b,a,q}),dot=m.gradient.reduce((n,v,i)=>n+v*m.displacement[i],0);
  maxError=Math.max(maxError,Math.abs(m.exact-m.linear-m.error),Math.abs(m.rotatedDot-dot),Math.abs(Math.hypot(...m.rotatedGradient)-Math.sqrt(5)));states++;
 }if(maxError>1e-12)throw Error('Gradient invariant check failed.');return {passed:true,method:'Analytic finite difference, quadratic remainder, orthogonal coordinate transformation and invariant dot product',states,maxError};
}
