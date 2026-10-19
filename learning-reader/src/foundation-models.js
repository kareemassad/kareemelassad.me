import {primitivesSVG} from './scene-primitives.js';

const control=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
const angle=control('r','Angle θ',-180,180,5,'°');
const magnitude=[control('a','Magnitude A',.5,1.5,.05),control('b','Magnitude B',.5,1.5,.05)];
const vectorScenes=['vector-dot','vector-cross','scalar-triple','vector-triple'];
export const foundationDefaults=Object.freeze({
 'vector-dot':{r:60,a:1,b:1},'vector-cross':{r:60,a:1,b:1},'scalar-triple':{r:60,a:1,b:1,q:.8},'vector-triple':{r:60,a:1,b:1,q:.8},
 'mixed-partials':{r:.4,q:.8},'del-operator':{r:.4,a:2,b:1,q:.5},'fourier-vector':{r:.4,a:2,b:1,q:1},'vector-potential':{r:.4,q:.8},'scalar-field':{r:.4,a:2,b:1},'rotating-field':{r:.6,q:.8},'operator-order':{r:.4,a:.8,b:1},
 'affine-divergence':{r:.4,a:.4,b:.7},'affine-curl':{r:.4,a:.4,b:.7},
 'slab-conduction':{r:1,q:4,a:1,b:1},'laplacian-scalar':{r:.4,q:3,a:2},'laplacian-vector':{r:.4,q:1,a:2},
 'curl-curl':{r:.4,q:1,a:2,b:1},'grad-div':{r:.4,q:.8,b:.6},'gradient-cross':{r:60,a:1,b:1},
 'varying-basis':{r:60,a:1},'maxwell-wave':{r:60,q:1,b:0},'closing-surface':{r:.6,q:.8,a:1}
});
export const foundationNames=Object.freeze(Object.keys(foundationDefaults));
export function foundationControls(scene){
 if(vectorScenes.includes(scene))return [angle,...magnitude,...(scene.includes('triple')?[control('q','Signed component C_z',-1,1,.05)]:[])];
 switch(scene){
 case 'mixed-partials':return [control('r','Derivative probe coordinate',-1,1,.05,'m'),control('q','Mixed coefficient η',-1,1,.05,'K/m²')];
 case 'del-operator':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('a','Temperature slope α',-2,2,.1,'K/m'),control('b','Temperature slope β',-2,2,.1,'K/m'),control('q','Temperature slope γ',-2,2,.1,'K/m')];
 case 'fourier-vector':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('a','Temperature slope α',-2,2,.1,'K/m'),control('b','Temperature slope β',-2,2,.1,'K/m'),control('q','Conductivity κ',.2,2,.1,'W/(m K)')];
 case 'vector-potential':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('q','Rotation coefficient ω',-1,1,.05,'m⁻¹')];
 case 'scalar-field':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('a','Temperature slope α',-2,2,.1,'K/m'),control('b','Temperature slope β',-2,2,.1,'K/m')];
 case 'rotating-field':return [control('r','Probe coordinate x',-.9,.9,.05,'m'),control('q','Angular velocity ω',-1,1,.05,'s⁻¹')];
 case 'operator-order':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('a','Slope α in T',-1,1,.05,'m⁻¹'),control('b','Coefficient β in f',.5,2,.05,'m⁻²')];
 case 'affine-divergence':case 'affine-curl':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('a','Expansion λ',-1,1,.05,'m⁻¹'),control('b','Rotation ω',-1,1,.05,'m⁻¹')];
 case 'slab-conduction':return [control('r','Slab thickness d',.2,2,.05,'m'),control('q','T_right − T_left',-5,5,.1,'K'),control('a','Conductivity κ',.2,2,.1,'W/(m K)'),control('b','Cross-section area A',.2,2,.05,'m²')];
 case 'laplacian-scalar':case 'laplacian-vector':case 'curl-curl':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('q','Amplitude H',.2,scene==='laplacian-scalar'?5:2,.1,scene==='laplacian-scalar'?'K':'W/m²'),control('a','Wave number k',.5,3,.1,'m⁻¹'),...(scene==='curl-curl'?[control('b','Longitudinal amplitude L',-2,2,.1,'W/m²')]:[])];
 case 'grad-div':return [control('r','Probe coordinate x',-1,1,.05,'m'),control('q','Longitudinal coefficient α',-1,1,.05,'W/m⁴'),control('b','Transverse coefficient β',-1,1,.05,'W/m⁴')];
 case 'gradient-cross':return [angle,control('a','Magnitude ∇ψ',.5,1.5,.05,'m⁻¹'),control('b','Magnitude ∇φ',.5,1.5,.05,'m⁻¹')];
 case 'varying-basis':return [angle,control('a','Radius R',.5,2,.05,'m')];
 case 'maxwell-wave':return [control('r','Wave phase at x = 0',0,360,5,'°'),control('b','Spatial probe x',-1,1,.05,'m'),control('q','Electric amplitude E₀',.2,2,.1,'V/m')];
 case 'closing-surface':return [control('r','Hole polar angle α',.05,1,.05,'rad'),control('q','Curl component ω',-1,1,.05,'W/m³'),control('a','Sphere radius R',.5,1.5,.05,'m')];
 default:throw Error('Unknown foundation model.');
 }
}
export const dot=(a,b)=>a.reduce((sum,value,i)=>sum+value*b[i],0);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const affineVector=([x,y,z],l,w)=>[1+l*x-w*y,.5+w*x+l*y,.25+l*z];
export const LIGHT_SPEED=299792458;
export function foundationModel(scene,state){
 if(!foundationNames.includes(scene))throw Error('Unknown foundation model.');
 const s={...foundationDefaults[scene],...state};
 for(const c of foundationControls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max)throw Error('Invalid foundation parameter: '+c.key);
 const theta=s.r*Math.PI/180;let m;
 if(vectorScenes.includes(scene)||scene==='gradient-cross'){
  const A=[s.a,0,0],B=[s.b*Math.cos(theta),s.b*Math.sin(theta),0],C=[0,0,s.q??0],AB=cross(A,B),BC=cross(B,C);
  m={A,B,C,AB,BC,otherParentheses:cross(AB,C),dot:dot(A,B),cross:AB[2],scalarTriple:dot(A,BC),scalarTripleOther:dot(AB,C),vectorTriple:cross(A,BC),vectorTripleOther:B.map((v,i)=>v*dot(A,C)-C[i]*dot(A,B)),theta};
 }else if(scene==='mixed-partials')m={dx:y=>2+s.q*y,dy:x=>1+s.q*x,mixed:[s.q,s.q]};
 else if(scene==='del-operator')m={temperature:([x,y,z])=>20+s.a*x+s.b*y+s.q*z,gradient:[s.a,s.b,s.q]};
 else if(scene==='fourier-vector')m={temperature:([x,y])=>20+s.a*x+s.b*y,gradient:[s.a,s.b,0],heat:[-s.q*s.a,-s.q*s.b,0],probe:[s.r,0]};
 else if(scene==='vector-potential')m={potential:([x,y])=>[0,0,-s.q*(x*x+y*y)/2],curl:([x,y])=>[-s.q*y,s.q*x,0],divergence:0};
 else if(scene==='scalar-field')m={temperature:([x,y])=>20+s.a*x+s.b*y,gradient:[s.a,s.b,0],probe:[s.r,0]};
 else if(scene==='rotating-field')m={velocity:([x,y])=>[-s.q*y,s.q*x,0],probe:[s.r,0],speed:Math.abs(s.q*s.r)};
 else if(scene==='operator-order'){
  const T=x=>1+s.a*x,f=x=>s.b*x*x;
  m={T,f,gradientT:s.a,operatorOnF:x=>T(x)*2*s.b*x,gradientTimesF:x=>s.a*f(x),gradientProduct:x=>2*s.b*x+3*s.a*s.b*x*x};
 }else if(scene==='affine-divergence'||scene==='affine-curl')m={field:p=>affineVector(p,s.a,s.b),jacobian:[[s.a,-s.b,0],[s.b,s.a,0],[0,0,s.a]],divergence:3*s.a,curl:[0,0,2*s.b],probe:[s.r,0,0]};
 else if(scene==='slab-conduction')m={left:20,right:20+s.q,slope:s.q/s.r,flux:-s.a*s.q/s.r,power:-s.a*s.q*s.b/s.r,temperature:x=>20+s.q*x/s.r};
 else if(['laplacian-scalar','laplacian-vector','curl-curl'].includes(scene)){
  const profile=x=>s.q*Math.cos(s.a*x),first=x=>-s.q*s.a*Math.sin(s.a*x),second=x=>-s.q*s.a*s.a*Math.cos(s.a*x);
  const longitudinal=x=>(s.b||0)*Math.cos(s.a*x),longFirst=x=>-(s.b||0)*s.a*Math.sin(s.a*x),longSecond=x=>-(s.b||0)*s.a*s.a*Math.cos(s.a*x);
  m={profile,first,second,laplacian:second,field:x=>[longitudinal(x),profile(x),0],vectorLaplacian:x=>[longSecond(x),second(x),0],curl:x=>[0,0,first(x)],curlCurl:x=>[0,-second(x),0],divergence:longFirst,gradientDivergence:x=>[longSecond(x),0,0]};
 }else if(scene==='grad-div')m={field:x=>[s.q*x*x,s.b*x*x,0],divergence:x=>2*s.q*x,gradientDivergence:[2*s.q,0,0],vectorLaplacian:[2*s.q,2*s.b,0]};
 else if(scene==='varying-basis')m={vector:[1,0],radial:[Math.cos(theta),Math.sin(theta)],angular:[-Math.sin(theta),Math.cos(theta)],radialComponent:Math.cos(theta),angularComponent:-Math.sin(theta),scalarRadialLaplacian:-Math.cos(theta)/(s.a*s.a),vectorLaplacian:[0,0],componentDerivative:[-Math.sin(theta),-Math.cos(theta)],theta};
 else if(scene==='maxwell-wave'){
  const k=Math.PI,phase=theta,t=phase/(k*LIGHT_SPEED),E=x=>s.q*Math.cos(k*x-phase),B=x=>E(x)/LIGHT_SPEED,sine=x=>Math.sin(k*x-phase);
  m={k,phase,t,E,B,curlE:x=>-s.q*k*sine(x),minusDtB:x=>-s.q*k*sine(x),curlB:x=>s.q*k/LIGHT_SPEED*sine(x),dtE:x=>s.q*k*LIGHT_SPEED*sine(x),divE:0,divB:0};
 }else{
  const radius=s.a*Math.sin(s.r),area=Math.PI*radius*radius;
  m={holeRadius:radius,holeDiskArea:area,capArea:2*Math.PI*s.a*s.a*(1-Math.cos(s.r)),surfaceFlux:-s.q*area,circulation:-s.q*area,fullSphereFlux:0};
 }
 return {...m,state:s};
}

const sign=n=>Math.abs(n)<1e-10?0:Math.sign(n);
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='field')=>({id,type:'arrow',from,to,style,visible:Math.hypot(to[0]-from[0],to[1]-from[1])>1e-9});
const curve=(id,points,style='field')=>({id,type:'curve',points,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const samples=(fn,n=120)=>Array.from({length:n+1},(_,i)=>fn(i/n));
function graph(shapes,id,fn,{xmin=-1,xmax=1,ymax=1,left=65,right=335,top=100,bottom=290,label='',style='blue-curve'}={}){
 const gx=x=>left+(x-xmin)/(xmax-xmin)*(right-left),gy=y=>(top+bottom)/2-y/ymax*(bottom-top)/2;
 shapes.push(line(id+'-axis',[left,gy(0)],[right,gy(0)],'axis'),line(id+'-vertical',[left,top],[left,bottom],'axis'),curve(id+'-curve',samples(t=>{const x=xmin+t*(xmax-xmin);return [gx(x),gy(fn(x))];}),style),text(id+'-title',(left+right)/2,top-20,label),text(id+'-xmin',left,bottom+17,fmt(xmin)),text(id+'-xmax',right,bottom+17,fmt(xmax)),text(id+'-ymax',left-18,top,fmt(ymax)),text(id+'-ymin',left-18,bottom,fmt(-ymax)));
 return {gx,gy};
}
function track(shapes,c,value){const origin=65-c.min*210/(c.max-c.min),scale=210/(c.max-c.min);shapes.push(line('track',[65,357],[275,357],'axis'),point('probe',[origin+value*scale,357],true),text('track-label',170,337,c.label+(c.units?' ('+c.units+')':'')));return {id:'probe',parameter:c.key,origin,scale,min:c.min,max:c.max};}
const readouts=(shapes,rows)=>rows.forEach((value,i)=>shapes.push(text('readout-'+i,460,104+i*43,value)));

export function foundationDefinition(scene,state){
 const m=foundationModel(scene,state),s=m.state,shapes=[];let title,context,equation;
 const vectorPlane=(A,B,units='')=>{const origin=[175,215],p=v=>[origin[0]+65*v[0],origin[1]-65*v[1]];shapes.push(line('x-axis',[65,215],[290,215],'axis'),line('y-axis',[175,300],[175,95],'axis'),text('x-label',298,215,'x'),text('y-label',175,83,'y'),arrow('A',origin,p(A),'normal'),arrow('B',origin,p(B),'sample-field'),curve('parallelogram',[p(A),p(A.map((v,i)=>v+B[i])),p(B)],'reference'),text('A-label',175,300,'Blue: A · gold: B'+units));};
 if(vectorScenes.includes(scene)||scene==='gradient-cross'){
  vectorPlane(m.A,m.B,scene==='gradient-cross'?' (m⁻¹)':'');
  if(scene==='gradient-cross')shapes.find(p=>p.id==='A-label').text='Blue: ∇ψ · gold: ∇φ (m⁻¹)';
  if(scene==='vector-dot')shapes.push(line('projection',[175+65*m.B[0],215-65*m.B[1]],[175+65*m.B[0],215],'reference'),point('projection-point',[175+65*m.B[0],215]));
  const value=scene==='vector-dot'?m.dot:scene==='scalar-triple'?m.scalarTriple:scene==='vector-triple'?m.vectorTriple[2]:m.cross;
  const isGrad=scene==='gradient-cross';
  title={'vector-dot':'DOT PRODUCT · SIGNED PROJECTION','vector-cross':'CROSS PRODUCT · NORMAL TO THE PLANE','scalar-triple':'SCALAR TRIPLE PRODUCT · TWO EQUAL ORDERS','vector-triple':'VECTOR TRIPLE PRODUCT · ORDER MATTERS','gradient-cross':'TWO GRADIENTS · THEIR CROSS PRODUCT'}[scene];
  equation={'vector-dot':'foundation-dot','vector-cross':'foundation-cross','scalar-triple':'foundation-scalar-triple','vector-triple':'foundation-vector-triple','gradient-cross':'foundation-gradient-cross'}[scene];
  if(scene==='vector-dot')readouts(shapes,['A · B = '+fmt(value),'B_x = B cos θ = '+fmt(m.B[0]),'A · B is a scalar','θ = '+fmt(s.r)+'°','Perpendicular: dot product = 0']);
  else if(scene==='scalar-triple')readouts(shapes,['C = (0, 0, '+fmt(s.q)+')','A · (B × C) = '+fmt(value),'(A × B) · C = '+fmt(m.scalarTripleOther),'B · (C × A) = '+fmt(dot(m.B,cross(m.C,m.A))),'Swap A,B: '+fmt(-m.scalarTriple)]);
  else if(scene==='vector-triple')readouts(shapes,['C_z = '+fmt(s.q),'[A × (B × C)]_z = '+fmt(value),'[B(A·C)−C(A·B)]_z = '+fmt(m.vectorTripleOther[2]),'(A × B) × C = ('+m.otherParentheses.map(fmt).join(',')+')','The parentheses fix the order']);
  else readouts(shapes,[(isGrad?'(∇ψ × ∇φ)_z = ':'(A × B)_z = ')+fmt(value)+(isGrad?' m⁻²':''),sign(value)>0?'Normal: +z · out of screen':sign(value)<0?'Normal: −z · into screen':'Parallel: cross product is zero',(isGrad?'(∇φ × ∇ψ)_z = ':'B × A has z component ')+fmt(-m.cross)+(isGrad?' m⁻²':''),isGrad?'Cross product is perpendicular to both gradients':'A · (A × B) = B · (A × B) = 0','θ = '+fmt(s.r)+'°']);
  if(scene!=='vector-dot'){const z=scene==='scalar-triple'?s.q:value;shapes.push(text('z-sign',305,140,(scene==='scalar-triple'?'C: ':'')+(sign(z)>0?'⊙ +z':sign(z)<0?'⊗ −z':'0')));}
  context=isGrad?'ψ = ax · φ = b(x cos θ + y sin θ) · smooth global fields':scene.includes('triple')?'A=(a,0,0) · B=(b cos θ,b sin θ,0) · C=(0,0,q) · dimensionless':'A=(a,0,0) · B=(b cos θ,b sin θ,0) · dimensionless vectors';
 }else if(scene==='mixed-partials'){
  title='MIXED DERIVATIVES · TWO SMOOTH DERIVATIVE PATHS';equation='foundation-mixed';context='ψ=20+2x+y+ηxy (°C) · smooth global polynomial · x,y,z in m';
  const g=graph(shapes,'partials',m.dx,{ymax:3,label:'Blue: ∂xψ(y) · gold: ∂yψ(x) (K/m)'});shapes.push(curve('other-partial',samples(t=>{const x=-1+2*t;return [g.gx(x),g.gy(m.dy(x))];}),'gold-curve'));
  shapes.push(point('partial-x-probe',[g.gx(s.r),g.gy(m.dx(s.r))]),point('partial-y-probe',[g.gx(s.r),g.gy(m.dy(s.r))]));
  readouts(shapes,['∂xψ(y=r) = '+fmt(m.dx(s.r))+' K/m','Then ∂y: '+fmt(s.q)+' K/m²','∂yψ(x=r) = '+fmt(m.dy(s.r))+' K/m','Then ∂x: '+fmt(s.q)+' K/m²','Equal mixed derivatives','Continuous second partials suffice']);
 }else if(scene==='del-operator'){
  title='DEL · A VECTOR OPERATOR NEEDS AN OPERAND';equation='foundation-del';context='T=20+αx+βy+γz (°C) · smooth scalar · x,y,z in m';
  for(const [i,axis] of ['x','y','z'].entries()){shapes.push(text('operator-'+axis,120,130+i*67,'∂/∂'+axis),arrow('input-'+axis,[155,130+i*67],[230,130+i*67],'normal'),text('operand-'+axis,265,130+i*67,'T'),arrow('output-'+axis,[290,130+i*67],[365,130+i*67],'sample-field'));}
  readouts(shapes,['∂xT = '+fmt(s.a)+' K/m','∂yT = '+fmt(s.b)+' K/m','∂zT = '+fmt(s.q)+' K/m','∇T = ('+m.gradient.map(fmt).join(',')+') K/m','T(probe) = '+fmt(m.temperature([s.r,0,0]))+' °C']);
 }else if(scene==='vector-potential'){
  title='VECTOR POTENTIAL · ONE GLOBAL CONSTRUCTION';equation='foundation-vector-potential';context='D dimensionless · C has m · ω has m⁻¹ · smooth global fields on R³';
  for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const P=[175+i*38,205-j*38],v=m.curl([i*.4,j*.4]);shapes.push(arrow('D-'+i+'-'+j,P,[P[0]+45*v[0],P[1]-45*v[1]]));}
  readouts(shapes,['C=(0,0,−ω(x²+y²)/2)','C_z(probe) = '+fmt(m.potential([s.r,0])[2])+' m','D = curl C = ω(−y,x,0)','D(probe) = (0,'+fmt(s.q*s.r)+',0)','∇ · D = 0 m⁻¹','Constructive example, not inverse solver']);
 }else if(scene==='scalar-field'||scene==='rotating-field'||scene==='fourier-vector'){
  const xy=([x,y])=>[175+85*x,205-85*y];
  for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){
   const p=[i*.8,j*.8],P=xy(p);
   if(scene!=='rotating-field'){shapes.push(point('sample-'+i+'-'+j,P));if(scene!=='fourier-vector')shapes.push(text('value-'+i+'-'+j,P[0],P[1]-13,fmt(m.temperature(p))+' °C'));}
   else{const v=m.velocity(p);shapes.push(arrow('velocity-'+i+'-'+j,P,[P[0]+v[0]*45,P[1]-v[1]*45]));}
  }
  const P=xy(m.probe);shapes.push(point('position',P),text('probe-text',175,305,'Probe: ('+fmt(s.r)+', 0) m'));
  if(scene!=='rotating-field'){
   for(const level of [-2,-1,0,1,2]){const candidates=[];if(Math.abs(s.b)>1e-12)for(const x of [-1,1]){const y=(level-s.a*x)/s.b;if(Math.abs(y)<=1)candidates.push([x,y]);}if(Math.abs(s.a)>1e-12)for(const y of [-1,1]){const x=(level-s.b*y)/s.a;if(Math.abs(x)<=1)candidates.push([x,y]);}const unique=candidates.filter((p,i)=>candidates.findIndex(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-9)===i);if(unique.length>1)shapes.push(curve('isotherm-'+level,unique.slice(0,2).map(xy),'reference'));}
  }
  if(scene==='fourier-vector'){
   title='FOURIER VECTOR LAW · HEAT POINTS DOWNHILL';equation='foundation-fourier-vector';context='T=20+αx+βy (°C) · constant κ · uniform z · separate arrow scales';
   const P=xy(m.probe);shapes.push(arrow('gradient',P,[P[0]+18*m.gradient[0],P[1]-18*m.gradient[1]],'normal'),arrow('heat',P,[P[0]+18*m.heat[0],P[1]-18*m.heat[1]],'sample-field'));
   readouts(shapes,['Blue: ∇T=('+m.gradient.slice(0,2).map(fmt).join(',')+') K/m','Gold: h=('+m.heat.slice(0,2).map(fmt).join(',')+') W/m²','κ = '+fmt(s.q)+' W/(m K)','T(probe) = '+fmt(m.temperature(m.probe))+' °C',Math.hypot(...m.gradient)>0?'h points opposite to ∇T':'Uniform temperature: h = 0']);
  }else if(scene==='scalar-field'){
   title='SCALAR FIELD · ONE NUMBER AT EACH POINT';equation='foundation-scalar-field';context='T = 20 + αx + βy (°C) · xy slice · uniform z';
   readouts(shapes,['T(probe) = '+fmt(m.temperature(m.probe))+' °C','At each position: one scalar','α = '+fmt(s.a)+' K/m','β = '+fmt(s.b)+' K/m','Time is fixed']);
  }else{
   title='VECTOR FIELD · RIGID ROTATION';equation='foundation-rotation';context='v = ω(−y,x,0) m/s · ω in s⁻¹ · instantaneous velocity arrows';
   const v=m.velocity(m.probe);readouts(shapes,['v(probe) = (0, '+fmt(v[1])+', 0) m/s','Speed = '+fmt(m.speed)+' m/s','ω = '+fmt(s.q)+' s⁻¹','Arrow direction changes by position','Arrows are velocities, not paths']);
  }
 }else if(scene==='operator-order'){
  title='OPERATOR ORDER · CHOOSE WHAT IS DIFFERENTIATED';equation='foundation-operator';context='T=1+αx · f=βx² · both dimensionless · 1D example, uniform y,z';
  const g=graph(shapes,'operator',m.operatorOnF,{ymax:8,label:'Blue: T f′ · gold: T′ f (m⁻¹)'});
  shapes.push(curve('other',samples(t=>{const x=-1+2*t;return [g.gx(x),g.gy(m.gradientTimesF(x))];}),'gold-curve'),point('operator-value',[g.gx(s.r),g.gy(m.operatorOnF(s.r))]));
  readouts(shapes,['T∇ needs a field to act on','∇T = ('+fmt(s.a)+',0,0) m⁻¹','(T∇)f = '+fmt(m.operatorOnF(s.r))+' m⁻¹','(∇T)f = '+fmt(m.gradientTimesF(s.r))+' m⁻¹','Different objects; stated f comparison']);
 }else if(scene==='affine-divergence'||scene==='affine-curl'){
  title=scene==='affine-divergence'?'DIVERGENCE · SUM THE DIAGONAL DERIVATIVES':'CURL · SUBTRACT THE CROSS DERIVATIVES';
  equation=scene==='affine-divergence'?'foundation-divergence':'foundation-curl';context='Dimensionless C=(1+λx−ωy, 0.5+ωx+λy, 0.25+λz) · x,y,z in m';
  for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const p=[i*.4,j*.4,0],P=[175+p[0]*95,205-p[1]*95],v=m.field(p);shapes.push(arrow('field-'+i+'-'+j,P,[P[0]+v[0]*20,P[1]-v[1]*20]));}
  shapes.push(text('matrix-label',460,76,'Jacobian rows Cx,Cy,Cz · columns x,y,z'));
  m.jacobian.forEach((row,i)=>shapes.push(text('matrix-'+i,460,113+i*30,row.map(fmt).join('     ')+' m⁻¹')));
  shapes.push(point('field-probe',[175+s.r*95,205]),text('probe-value',175,309,'C(probe) = ('+m.field(m.probe).map(fmt).join(', ')+')'));
  readouts(shapes,[]);shapes.push(text('result',460,245,scene==='affine-divergence'?'∇ · C = '+fmt(m.divergence)+' m⁻¹':'∇ × C = (0,0,'+fmt(m.curl[2])+') m⁻¹'),text('result-type',460,282,scene==='affine-divergence'?'Result: scalar field':'Result: vector field'),text('scope-note',460,313,'Derivatives are constant in this example'));
 }else if(scene==='slab-conduction'){
  title='FOURIER CONDUCTION · A LINEAR TEMPERATURE SLAB';equation='foundation-slab';context='Steady 1D slab · constant κ · no internal source · +x points right';
  const g=graph(shapes,'temperature',x=>m.temperature(x)-20,{xmin:0,xmax:2,ymax:5,label:'T − 20 °C (K) · x (m)'});
  // The temperature profile is defined only inside the slab.
  shapes.find(p=>p.id==='temperature-curve').points=samples(t=>[g.gx(t*s.r),g.gy(m.temperature(t*s.r)-20)]);
  shapes.push(line('slab-end',[g.gx(s.r),100],[g.gx(s.r),290],'reference'),arrow('heat',[110,310],[110+Math.sign(m.flux)*40,310],'normal'));
  readouts(shapes,['T_left = 20 °C','T_right = '+fmt(m.right)+' °C','∂xT = '+fmt(m.slope)+' K/m','h_x = '+fmt(m.flux)+' W/m²','Heat rate h_x A = '+fmt(m.power)+' W']);
 }else if(['laplacian-scalar','laplacian-vector','curl-curl'].includes(scene)){
  const scalar=scene==='laplacian-scalar';title=scalar?'LAPLACIAN · CURVATURE OF TEMPERATURE':scene==='curl-curl'?'CURL OF CURL · COMPARE TWO COMPUTATIONS':'VECTOR LAPLACIAN · FIXED CARTESIAN COMPONENTS';
  equation=scalar?'foundation-laplacian-scalar':scene==='curl-curl'?'foundation-curl-curl':'foundation-laplacian-vector';
  const ymax=scalar?5:2,units=scalar?'K':'W/m²',outUnits=scalar?'K/m²':'W/m⁴';
  graph(shapes,'profile',m.profile,{left:65,right:335,top:96,bottom:180,ymax,label:scalar?'T − 20 °C (K)':'h_y (W/m²)'});
  const g=graph(shapes,'curvature',scene==='curl-curl'?x=>m.curlCurl(x)[1]:m.second,{left:65,right:335,top:231,bottom:315,ymax:scalar?45:18,label:scene==='curl-curl'?'(curl curl h)_y (W/m⁴)':'Second derivative ('+outUnits+')'});
  shapes.push(point('curvature-value',[g.gx(s.r),g.gy(scene==='curl-curl'?m.curlCurl(s.r)[1]:m.second(s.r))]));
  if(scene==='curl-curl'){
   shapes.push(curve('identity-y',samples(t=>{const x=-1+2*t;return [g.gx(x),g.gy(m.gradientDivergence(x)[1]-m.vectorLaplacian(x)[1])];}),'reference'),curve('longitudinal-profile',samples(t=>{const x=-1+2*t;return [65+(x+1)*135,138-m.field(x)[0]*21];}),'gold-curve'));
   const vector=v=>'('+v.map(fmt).join(',')+')';
   readouts(shapes,['Blue: h_y · gold: h_x (W/m²)','div h = '+fmt(m.divergence(s.r))+' W/m³','grad div h = '+vector(m.gradientDivergence(s.r))+' W/m⁴','∇²h = '+vector(m.vectorLaplacian(s.r))+' W/m⁴','curl curl h = '+vector(m.curlCurl(s.r))+' W/m⁴','grad div h − ∇²h equals curl curl h']);
   context='h=(L cos(kx),H cos(kx),0) W/m² · uniform y,z · global smooth field';
  }else{
   readouts(shapes,['Probe x = '+fmt(s.r)+' m','Profile = '+fmt(m.profile(s.r))+' '+units,'Laplacian = '+fmt(m.second(s.r))+' '+outUnits,'Uniform transverse coordinates',scalar?'1D curvature = scalar Laplacian':'∇ · h = 0 · fixed Cartesian basis']);
   context=scalar?'T=20+H cos(kx) (°C) · uniform y,z · k in m⁻¹':'h=(0,H cos(kx),0) W/m² · uniform y,z · global smooth field';
  }
 }else if(scene==='grad-div'){
  title='GRADIENT OF DIVERGENCE · SCALAR THEN VECTOR';equation='foundation-grad-div';context='h=(αx²,βx²,0) W/m² · α,β in W/m⁴ · smooth global polynomial';
  graph(shapes,'divergence',m.divergence,{ymax:2,label:'∇ · h (W/m³) · x (m)'});
  readouts(shapes,['∇ · h = 2αx','At probe: '+fmt(m.divergence(s.r))+' W/m³','∇(∇ · h) = ('+fmt(2*s.q)+',0,0) W/m⁴','∇²h = ('+m.vectorLaplacian.map(fmt).join(',')+') W/m⁴','First scalar, then vector; different from ∇²h if β≠0']);
 }else if(scene==='varying-basis'){
  title='VARYING BASIS · CONSTANT VECTOR, CHANGING COMPONENT';equation='foundation-varying-basis';context='V=(1,0) dimensionless · polar basis at R>0 · Cartesian derivatives vanish';
  const center=[170,210],P=[170+70*m.radial[0],210-70*m.radial[1]];
  shapes.push({id:'circle',type:'circle',at:center,radius:70},point('position',P),arrow('V',P,[P[0]+60,P[1]],'field'),arrow('radial',P,[P[0]+45*m.radial[0],P[1]-45*m.radial[1]],'normal'),arrow('angular',P,[P[0]+45*m.angular[0],P[1]-45*m.angular[1]],'sample-field'),text('basis-key',175,305,'Black: V · blue: e_r · gold: e_θ'));
  readouts(shapes,['V_r = cos θ = '+fmt(m.radialComponent),'V_θ = −sin θ = '+fmt(m.angularComponent),'Scalar ∇²V_r = '+fmt(m.scalarRadialLaplacian)+' m⁻²','e_r · (∇²V) = 0','The basis itself varies with θ']);
 }else if(scene==='maxwell-wave'){
  title='MAXWELL EQUATIONS · ONE VACUUM PLANE WAVE';equation='foundation-maxwell';context='E along y · B along z (normal to page) · propagation +x · source-free vacuum';
  const x=s.b,E=m.E(x),B=m.B(x),g=graph(shapes,'wave',m.E,{ymax:2,left:65,right:320,top:105,bottom:225,label:'Blue E_y · gold cB_z (V/m) · x (m)'});
  shapes.push(curve('rescaled-magnetic',samples(t=>{const x=-1+2*t;return [g.gx(x),g.gy(LIGHT_SPEED*m.B(x))];}),'gold-curve'),point('wave-probe',[g.gx(x),g.gy(E)]),line('position-guide',[g.gx(x),100],[g.gx(x),235],'reference'));
  const P=[452,180],sgn=Math.abs(E)<1e-10?0:Math.sign(B);
  shapes.push(text('physical-vectors',450,74,'Physical directions at the same P'),arrow('axis-x',P,[535,180],'reference'),arrow('axis-y',P,[452,103],'reference'),text('x-axis-label',533,200,'+x propagation'),text('y-axis-label',467,105,'+y'),arrow('E-direction',P,[452,180-34*E],'normal'),text('E-label',522,133,'E_y in the page'),text('B-axis-label',452,230,sgn>0?'B_z: out of page (+z)':sgn<0?'B_z: into page (−z)':'B_z = 0 at this event'));
  if(sgn){shapes.push(curve('B-direction-ring',samples(t=>[452+17*Math.cos(t*2*Math.PI),180+17*Math.sin(t*2*Math.PI)]),'gold-curve'));if(sgn>0)shapes.push(point('B-out',[452,180]));else shapes.push(line('B-in-a',[442,170],[462,190],'sample-field'),line('B-in-b',[442,190],[462,170],'sample-field'));}
  shapes.push(text('same-event',450,263,'P: x='+fmt(x)+' m · t='+fmt(m.t*1e9)+' ns'),text('electric-value',185,271,'E_y(P) = '+fmt(E)+' V/m'),text('magnetic-value',450,286,'B_z(P) = '+(Math.abs(E)<1e-10?'0':B.toExponential(3))+' T'),text('electric-slope',185,295,'∂xE_y = '+fmt(m.curlE(x))+' V/m²'),text('magnetic-time',450,309,'−∂tB_z = '+fmt(m.minusDtB(x))+' V/m²'),text('magnetic-slope',185,318,'−c∂xB_z = '+fmt(LIGHT_SPEED*m.curlB(x))+' V/m²'),text('electric-time',450,332,'∂tE_y/c = '+fmt(m.dtE(x)/LIGHT_SPEED)+' V/m²'));
 }else{
  title='CLOSING A SURFACE · SHRINK ITS BOUNDARY';equation='foundation-closing-surface';context='Sphere minus north cap · C=ω(−y,x,0)/2 W/m² · global smooth field';
  const R=65*s.a,center=[130,185],yy=185-R*Math.cos(s.r),rr=65*m.holeRadius;
  const meridian=(start,end)=>samples(t=>{const a=start+(end-start)*t;return [center[0]+R*Math.sin(a),center[1]-R*Math.cos(a)];},80);
  shapes.push(curve('remaining-surface',meridian(s.r,2*Math.PI-s.r),'field'),curve('removed-cap',meridian(-s.r,s.r),'reference'),curve('hole',samples(t=>[130+rr*Math.cos(t*2*Math.PI),yy+rr*.18*Math.sin(t*2*Math.PI)]),'blue-curve'),line('north-axis',center,[130,185-R],'reference'),text('cap-label',130,65,'Dashed cap is removed'),text('orientation',130,300,'Boundary: clockwise viewed from +z'));
  const above=[130+rr,yy];shapes.push(arrow('clockwise-boundary',above,[above[0]-5,above[1]+10],'normal'));
  const g=graph(shapes,'closure-limit',a=>-s.q*Math.PI*s.a*s.a*Math.sin(a)**2,{xmin:0,xmax:1,ymax:7.1,left:280,right:530,top:107,bottom:238,label:'Remaining-surface flux (W/m) · α (rad)'});
  shapes.push(point('closure-flux',[g.gx(s.r),g.gy(m.surfaceFlux)]),text('closure-values',405,271,'∫ curl C · n da = ∮ C · ds = '+fmt(m.surfaceFlux)+' W/m'),text('hole-values',300,313,'Hole radius '+fmt(m.holeRadius)+' m · boundary length '+fmt(2*Math.PI*m.holeRadius)+' m'),text('closure-result',405,301,'As α → 0: both → 0 · closed-sphere flux = 0'));

 }
 const c=foundationControls(scene)[0],probe=track(shapes,c,s[c.key]);
 shapes.push(text('title',300,26,title),text('context',300,423,context),text('hint',300,445,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:equation,x:300,y:400}],probe};
}
export function drawFoundation(scene,state){const d=foundationDefinition(scene,state);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,400,foundationEquations[d.equations[0].id].plain)]),metrics:[],label:d.label};}
export function foundationChecks(scene){
 const defaults=foundationDefaults[scene],states=[defaults];for(const c of foundationControls(scene))for(const value of [c.min,(c.min+c.max)/2,c.max])states.push({...defaults,[c.key]:value});
 let maxError=0;for(const s of states){const m=foundationModel(scene,s);let errors=[];
  if(vectorScenes.includes(scene)||scene==='gradient-cross')errors=[dot(m.A,m.AB),dot(m.B,m.AB),m.scalarTriple-m.scalarTripleOther,...m.vectorTriple.map((v,i)=>v-m.vectorTripleOther[i])];
  if(scene==='slab-conduction')errors=[m.flux+s.a*m.slope,m.power-m.flux*s.b];
  if(['laplacian-scalar','laplacian-vector','curl-curl'].includes(scene))errors=[m.curlCurl(s.r)[1]+m.laplacian(s.r)];
  if(scene==='varying-basis')errors=m.vector.map((v,i)=>v-m.radialComponent*m.radial[i]-m.angularComponent*m.angular[i]);
  if(scene==='maxwell-wave')errors=[m.curlE(.3)-m.minusDtB(.3),LIGHT_SPEED*m.curlB(.3)-m.dtE(.3)/LIGHT_SPEED];
  if(scene==='closing-surface')errors=[m.surfaceFlux-m.circulation];
  maxError=Math.max(maxError,...errors.map(Math.abs));
 }
 if(maxError>1e-10)throw Error('Foundation invariant failed.');return {passed:true,states:states.length,maxError,method:'Bounded authored identities; independent derivatives and source checks remain separate.'};
}

// Original prepared equations. Provider proposals cannot supply TeX or markup.
export const foundationEquations=Object.freeze({
 'foundation-dot':{plain:'A · B = |A| |B| cos θ',tex:String.raw`\mathbf A\cdot\mathbf B=|\mathbf A|\,|\mathbf B|\cos\theta`},
 'foundation-cross':{plain:'A × B = −B × A · |A × B| = |A| |B| |sin θ|',tex:String.raw`\mathbf A\times\mathbf B=-\mathbf B\times\mathbf A\quad |\mathbf A\times\mathbf B|=|\mathbf A|\,|\mathbf B|\,|\sin\theta|`},
 'foundation-scalar-triple':{plain:'A · (B × C) = (A × B) · C',tex:String.raw`\mathbf A\cdot(\mathbf B\times\mathbf C)=(\mathbf A\times\mathbf B)\cdot\mathbf C`},
 'foundation-vector-triple':{plain:'A × (B × C) = B(A · C) − C(A · B)',tex:String.raw`\mathbf A\times(\mathbf B\times\mathbf C)=\mathbf B(\mathbf A\cdot\mathbf C)-\mathbf C(\mathbf A\cdot\mathbf B)`},
 'foundation-mixed':{plain:'∂y(∂xψ) = ∂x(∂yψ) = η',tex:String.raw`\partial_y(\partial_x\psi)=\partial_x(\partial_y\psi)=\eta`},
 'foundation-del':{plain:'∇ = (∂x, ∂y, ∂z) · ∇T = (α, β, γ)',tex:String.raw`\nabla=(\partial_x,\partial_y,\partial_z)\qquad\nabla T=(\alpha,\beta,\gamma)`},
 'foundation-scalar-field':{plain:'T(x,y,z) = 20 + αx + βy',tex:String.raw`T(x,y,z)=20+\alpha x+\beta y`},
 'foundation-rotation':{plain:'v(x,y,z) = ω(−y, x, 0)',tex:String.raw`\mathbf v(x,y,z)=\omega(-y,x,0)`},
 'foundation-operator':{plain:'(T∇)f = T ∇f · (∇T)f = f ∇T',tex:String.raw`(T\nabla)f=T\nabla f\qquad(\nabla T)f=f\nabla T`},
 'foundation-divergence':{plain:'∇ · C = ∂xCx + ∂yCy + ∂zCz = 3λ',tex:String.raw`\nabla\cdot\mathbf C=\partial_x C_x+\partial_y C_y+\partial_z C_z=3\lambda`},
 'foundation-curl':{plain:'∇ × C = (0, 0, 2ω)',tex:String.raw`\nabla\times\mathbf C=(0,0,2\omega)`},
 'foundation-slab':{plain:'h_x = −κ ΔT/d · heat rate = h_x A',tex:String.raw`h_x=-\kappa\frac{\Delta T}{d}\qquad \dot Q_{+x}=h_x A`},
 'foundation-fourier-vector':{plain:'h = −κ∇T = −κ(α,β,0)',tex:String.raw`\mathbf h=-\kappa\nabla T=-\kappa(\alpha,\beta,0)`},
 'foundation-vector-potential':{plain:'D = ∇ × C = ω(−y,x,0) · ∇ · D = 0',tex:String.raw`\mathbf D=\nabla\times\mathbf C=\omega(-y,x,0)\qquad\nabla\cdot\mathbf D=0`},
 'foundation-laplacian-scalar':{plain:'∇²T = ∂x²T = −Hk² cos(kx)',tex:String.raw`\nabla^2T=\partial_x^2T=-Hk^2\cos(kx)`},
 'foundation-laplacian-vector':{plain:'∇²h = (0, −Hk² cos(kx), 0)',tex:String.raw`\nabla^2\mathbf h=(0,-Hk^2\cos(kx),0)`},
 'foundation-curl-curl':{plain:'∇ × (∇ × h) = ∇(∇ · h) − ∇²h',tex:String.raw`\nabla\times(\nabla\times\mathbf h)=\nabla(\nabla\cdot\mathbf h)-\nabla^2\mathbf h`},
 'foundation-grad-div':{plain:'∇ · h = 2αx · ∇(∇ · h) = (2α,0,0)',tex:String.raw`\nabla\cdot\mathbf h=2\alpha x\qquad\nabla(\nabla\cdot\mathbf h)=(2\alpha,0,0)`},
 'foundation-gradient-cross':{plain:'∇ψ × ∇φ = (0,0,ab sin θ)',tex:String.raw`\nabla\psi\times\nabla\phi=(0,0,ab\sin\theta)`},
 'foundation-varying-basis':{plain:'∇²(V · e_r) = −cos θ/R² · (∇²V) · e_r = 0',tex:String.raw`\nabla^2(\mathbf V\cdot\mathbf e_r)=-\frac{\cos\theta}{R^2}\qquad(\nabla^2\mathbf V)\cdot\mathbf e_r=0`},
 'foundation-maxwell':{plain:'∇ · E = ∇ · B = 0 · ∇ × E = −∂tB · c²∇ × B = ∂tE',tex:String.raw`\nabla\cdot\mathbf E=\nabla\cdot\mathbf B=0\quad\nabla\times\mathbf E=-\partial_t\mathbf B\quad c^2\nabla\times\mathbf B=\partial_t\mathbf E`},
 'foundation-closing-surface':{plain:'∫S curl C · n da = ∮∂S C · ds = −ωπR² sin²α → 0',tex:String.raw`\int_S(\nabla\times\mathbf C)\cdot\mathbf n\,da=\oint_{\partial S}\mathbf C\cdot d\mathbf s=-\omega\pi R^2\sin^2\alpha\to0`}
});
