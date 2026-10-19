import {affineField,affineLineIntegral,affineFaceFlux} from './boundary-models.js';
import {primitivesSVG} from './scene-primitives.js';
export const chapter3Names=Object.freeze(['gradient-path','boundary-partition','heat-balance','radial-heat-flux','heat-local','line-circulation','operator-identities']);
export const chapter3Defaults=Object.freeze({'gradient-path':{r:4,q:.8,b:0},'boundary-partition':{r:.8,a:.4,b:.7,q:.5,n:0},'heat-balance':{r:1,a:.5},'radial-heat-flux':{r:1,q:2},'heat-local':{r:0,a:1,b:2,q:4,n:0},'line-circulation':{r:.7,a:.4,b:.7,n:0},'operator-identities':{r:.4,q:.8,n:0}});
const p=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export function chapter3Controls(scene){switch(scene){
 case 'gradient-path':return [p('r','Segments per leg N',1,32,1),p('q','Curvature κ',0,1.5,.05,'°C/m²'),p('b','Path: direct / via corner',0,1,1)];
 case 'boundary-partition':return [p('n','Partition: volume / surface',0,1,1),p('q','Cut position f',.2,.8,.05),p('r','Outer side h',.2,1.2,.05,'m'),p('a','Expansion λ',-1,1,.1,'W/m³'),p('b','Rotation ω',-1,1,.1,'W/m³')];
 case 'heat-balance':return [p('r','Box side h',.2,1.2,.05,'m'),p('a','Heat-flux derivative α',-1,1,.05,'W/m³')];
 case 'radial-heat-flux':return [p('r','Sphere radius R',.3,2,.05,'m'),p('q','Source power W',1,5,.1,'W')];
 case 'heat-local':return [p('n','Spatial probe x',-1,1,.05,'m'),p('r','Elapsed time t',0,2,.05,'s'),p('a','Conductivity κ',.1,2,.1,'W/(m K)'),p('b','Heat capacity cᵥ',.5,4,.1,'J/(m³ K)'),p('q','Initial mode amplitude A',1,5,.1,'K')];
 case 'line-circulation':return [p('r','Loop radius R',.2,1.2,.05,'m'),p('a','Expansion λ',-1,1,.1,'W/m³'),p('b','Rotation ω',-1,1,.1,'W/m³'),p('n','Direction: CCW / CW',0,1,1)];
 case 'operator-identities':return [p('n','Identity: curl grad / div curl',0,1,1),p('q','Mixed derivative η',-1,1,.05),p('r','Probe coordinate x',-1,1,.05,'m')];
 default:throw Error('Unknown Chapter 3 model.');}}
export const chapter3ReaderControls=scene=>chapter3Controls(scene).filter(c=>!(['boundary-partition','operator-identities'].includes(scene)&&c.key==='n'));
function checked(scene,state){const s={...chapter3Defaults[scene],...state};for(const c of chapter3Controls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max||c.step===1&&!Number.isInteger(s[c.key]))throw Error('Invalid Chapter 3 parameter: '+c.key);return s;}
export const psi=([x,y],k)=>20+2*x+y+k*(x*x+y*y)/2;
export const gradPsi=([x,y],k)=>[2+k*x,1+k*y];
export function gradientPath(s){
 const vertices=s.b===0?[[0,0],[1,1]]:[[0,0],[1,0],[1,1]],segments=[];
 for(let leg=0;leg<vertices.length-1;leg++)for(let i=0;i<s.r;i++){const A=vertices[leg],B=vertices[leg+1],from=A.map((v,k)=>v+(B[k]-v)*i/s.r),to=A.map((v,k)=>v+(B[k]-v)*(i+1)/s.r),delta=to.map((v,k)=>v-from[k]),g=gradPsi(from,s.q);segments.push({from,to,delta,gradient:g,left:g.reduce((v,g,k)=>v+g*delta[k],0),exact:psi(to,s.q)-psi(from,s.q)});}
 const left=segments.reduce((v,d)=>v+d.left,0),exact=psi([1,1],s.q)-psi([0,0],s.q),telescoped=segments.reduce((v,d)=>v+d.exact,0);
 return {vertices,segments,left,exact,telescoped,error:exact-left,N:s.r,curvature:s.q,path:s.b};
}
export function partition(s){
 const h=s.r,cut=(s.q-.5)*h,xs=[-h/2,cut,h/2],cells=[];
 if(s.n===0){for(let j=0;j<2;j++){const width=xs[j+1]-xs[j],faces=[];for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){const center=[(xs[j]+xs[j+1])/2,0,0],normal=[0,0,0];center[axis]=axis===0?xs[j+(sign===1?1:0)]:sign*h/2;normal[axis]=sign;const area=axis===0?h*h:width*h;faces.push({axis,sign,center,normal,area,flux:affineFaceFlux(center,normal,area,s.a,s.b)});}cells.push({faces,volume:width*h*h,flux:faces.reduce((v,f)=>v+f.flux,0)});}
 const shared=[cells[0].faces[1].flux,cells[1].faces[0].flux],total=cells.reduce((v,c)=>v+c.flux,0);return {h,cut,cells,shared,total,exterior:3*s.a*h**3,mode:0};}
 for(let j=0;j<2;j++){const v=[[xs[j],-h/2,0],[xs[j+1],-h/2,0],[xs[j+1],h/2,0],[xs[j],h/2,0]],edges=v.map((from,i)=>({from,to:v[(i+1)%4],integral:affineLineIntegral(from,v[(i+1)%4],s.a,s.b)}));cells.push({edges,area:(xs[j+1]-xs[j])*h,circulation:edges.reduce((v,e)=>v+e.integral,0)});}
 return {h,cut,cells,shared:[cells[0].edges[1].integral,cells[1].edges[3].integral],total:cells.reduce((v,c)=>v+c.circulation,0),exterior:2*s.b*h*h,mode:1};
}
export function heat(scene,s){
 if(scene==='heat-balance'){const volume=s.r**3,faces=[-s.a*s.r/2,s.a*s.r/2],flux=faces[1]*s.r*s.r-faces[0]*s.r*s.r;return {volume,faces,flux,rate:-s.a*volume,densityRate:-s.a,divergence:s.a};}
 if(scene==='radial-heat-flux'){const area=4*Math.PI*s.r*s.r,density=s.q/area;return {area,density,total:density*area,power:s.q,radius:s.r};}
 const D=s.a/s.b,k=Math.PI,amplitude=s.q*Math.exp(-D*k*k*s.r),temperature=x=>20+amplitude*Math.cos(k*x),flux=x=>s.a*amplitude*k*Math.sin(k*x),curvature=x=>-amplitude*k*k*Math.cos(k*x),rate=x=>D*curvature(x);
 return {D,k,amplitude,temperature,flux,curvature,rate,densityRate:x=>s.b*rate(x),divergence:x=>s.a*amplitude*k*k*Math.cos(k*x)};
}
export function circulation(s){const sign=s.n===0?1:-1;return {sign,area:Math.PI*s.r*s.r,integral:sign*2*s.b*Math.PI*s.r*s.r,curl:2*s.b,radius:s.r};}
export function identities(s){return s.n===0?{mode:0,mixed:[s.q,s.q],curl:0,gradient:[2+s.q*0,1+s.q*s.r],point:[s.r,0]}:{mode:1,curlField:[s.q*s.r,0,0],derivatives:[s.q,-s.q,0],divergence:0,facePairs:[s.q,-s.q,0]};}
export function chapter3Model(scene,state){const s=checked(scene,state);return {...(scene==='gradient-path'?gradientPath(s):scene==='boundary-partition'?partition(s):scene.startsWith('heat-')||scene==='radial-heat-flux'?heat(scene,s):scene==='line-circulation'?circulation(s):identities(s)),state:s};}
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='field')=>({id,type:'arrow',from,to,style,visible:Math.hypot(to[0]-from[0],to[1]-from[1])>1e-10});
const curve=(id,points,style='field')=>({id,type:'curve',points,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const samples=(fn,n=100)=>Array.from({length:n+1},(_,i)=>fn(i/n));
const probeTrack=(shapes,key,value,min,max,label,y=357)=>{const origin=65-min*210/(max-min),scale=210/(max-min);shapes.push(line('track',[65,y],[275,y],'axis'),point('probe',[origin+value*scale,y],true),text('track-label',170,y-16,label));return {id:'probe',parameter:key,origin,scale,min,max};};
export function chapter3Definition(scene,state){
 const m=chapter3Model(scene,state),s=m.state,shapes=[];let equation,probe,context,title;
 if(scene==='gradient-path'){
  title='TANGENTIAL SUM → ENDPOINT CHANGE';const xy=([x,y])=>[90+160*x,270-160*y];
  for(let x=0;x<=1;x+=.25)for(let y=0;y<=1;y+=.25){const P=xy([x,y]),g=gradPsi([x,y],s.q);shapes.push(arrow('g-'+x+'-'+y,P,[P[0]+g[0]*12,P[1]-g[1]*12],'background'));}
  shapes.push(curve('direct',[xy([0,0]),xy([1,1])],s.b===0?'field':'reference'),curve('corner',[xy([0,0]),xy([1,0]),xy([1,1])],s.b===1?'field':'reference'),text('A',76,292,'A: ψ = 20 °C'),text('B',248,90,'B: ψ = '+fmt(23+s.q)+' °C'));
  // Fixed topology: unused sample points coincide at the endpoint.
  for(let i=0;i<64;i++){const d=m.segments[i],P=xy(d?.from||[1,1]);shapes.push(point('sample-'+i,P),arrow('tangent-'+i,P,d?[P[0]+d.delta[0]*70,P[1]-d.delta[1]*70]:P,'normal'));}
  const gy=v=>290-v/4.5*170,gx=N=>355+(N-1)/31*200;
  shapes.push(text('graph-label',455,68,'Left-endpoint sum (°C)'),line('gx',[355,290],[555,290],'axis'),line('gy',[355,105],[355,290],'axis'),curve('limit',[[355,gy(m.exact)],[555,gy(m.exact)]],'reference'),curve('sum',Array.from({length:32},(_,i)=>[gx(i+1),gy(gradientPath({...s,r:i+1}).left)])),point('sum-value',[gx(s.r),gy(m.left)]),text('N-min',355,308,'1'),text('N-max',555,308,'32'),text('N-axis',455,308,'N'),text('path-legend',165,313,'Pale: ∇ψ · blue: directed segments'),text('limit-value',455,91,'Exact endpoint Δψ = '+fmt(m.exact)+' °C'),text('sum-value-text',455,333,'Finite sum = '+fmt(m.left)+' °C'),text('error',455,356,'Finite error = '+fmt(m.error)+' °C'),text('telescoping',300,382,'Σ exact segment Δψ = '+fmt(m.telescoped)+' °C · both paths'));
  probe=probeTrack(shapes,'r',s.r,1,32,'N segments per leg');equation='gradient-line-integral';context='ψ = 20 + 2x + y + κ(x²+y²)/2 · x, y in m · global smooth field';
 }else if(scene==='boundary-partition'){
  title=m.mode===0?'INTERNAL FACE · OPPOSITE NORMALS':'SHARED EDGE · OPPOSITE DIRECTIONS';const xy=([x,y,z=0])=>[165+x*125+z*30,208-y*125-z*35];
  const x0=-m.h/2,x1=m.cut,x2=m.h/2,y0=-m.h/2,y1=m.h/2;
  const rectangle=(id,a,b,z)=>shapes.push(curve(id,[[a,y0,z],[b,y0,z],[b,y1,z],[a,y1,z],[a,y0,z]].map(xy)));
  const zfront=m.mode===0?-m.h/2:0;rectangle('front-left',x0,x1,zfront);rectangle('front-right',x1,x2,zfront);
  if(m.mode===0){rectangle('back-left',x0,x1,m.h/2);rectangle('back-right',x1,x2,m.h/2);for(const [xi,x] of [x0,x1,x2].entries())for(const [yi,y] of [y0,y1].entries())shapes.push(line('depth-'+xi+'-'+yi,xy([x,y,-m.h/2]),xy([x,y,m.h/2])));const P=xy([x1,0,0]);shapes.push(arrow('shared-positive',[P[0]-10,P[1]-8],[P[0]+24,P[1]-8],'normal'),arrow('shared-negative',[P[0]+10,P[1]+8],[P[0]-24,P[1]+8],'sample-field'));}
  else{const P0=xy([x1,y0]),P1=xy([x1,y1]);shapes.push(arrow('shared-up',[P0[0]-4,P0[1]],[P1[0]-4,P1[1]],'normal'),arrow('shared-down',[P1[0]+4,P1[1]],[P0[0]+4,P0[1]],'sample-field'));}
  const sample=[m.h/2,m.h/2,0],P=xy(sample),C=affineField(sample,s.a,s.b);shapes.push(arrow('sample-field',P,[P[0]+C[0]*20,P[1]-C[1]*20],'sample-field'),text('sample-label',165,313,'Gold: Cxy at outer corner'));
  const units=m.mode===0?'W':'W/m';shapes.push(text('cell-label',165,83,'Two adjacent '+(m.mode===0?'boxes':'CCW loops')),text('shared-title',455,85,'Same boundary · opposite signs'),text('shared-first',455,125,'Left cell: '+fmt(m.shared[0])+' '+units),text('shared-second',455,162,'Right cell: '+fmt(m.shared[1])+' '+units),text('shared-net',455,209,'Internal total = '+fmt(m.shared[0]+m.shared[1])+' '+units),text('cell-first',455,256,'Left total = '+fmt(m.mode===0?m.cells[0].flux:m.cells[0].circulation)+' '+units),text('cell-second',455,284,'Right total = '+fmt(m.mode===0?m.cells[1].flux:m.cells[1].circulation)+' '+units),text('outer',300,382,'Combined = exterior boundary = '+fmt(m.total)+' '+units));
  probe=probeTrack(shapes,'q',s.q,.2,.8,'Cut position f');equation=m.mode===0?'partition-flux':'partition-circulation';context='Exact authored affine field · cut changes cell contributions · shared terms cancel';
 }else if(scene==='heat-balance'){
  title='OUTWARD HEAT FLUX · STORED ENERGY';const h=s.r,scale=130,P=[165,210];shapes.push(curve('box',[[-h/2,-h/2],[h/2,-h/2],[h/2,h/2],[-h/2,h/2],[-h/2,-h/2]].map(([x,y])=>[P[0]+x*scale,P[1]-y*scale])));
  for(const sign of [-1,1]){const A=[P[0]+sign*h/2*scale,P[1]],v=s.a*sign*h/2;shapes.push(arrow('normal-'+sign,[A[0],A[1]-12],[A[0]+sign*28,A[1]-12],'normal'),arrow('heat-'+sign,[A[0],A[1]+4],[A[0]+v*70,A[1]+4]),text('face-'+sign,A[0],A[1]+31,'hₓ = '+fmt(v)+' W/m²'));}
  shapes.push(text('slice',165,92,'xy slice · full cube side h'),text('volume',165,300,'Volume = '+fmt(m.volume)+' m³'),text('field',455,92,'h = (αx, 0, 0)'),text('div',455,136,'∇ · h = '+fmt(m.divergence)+' W/m³'),text('out',455,190,'Net outward = '+fmt(m.flux)+' W'),text('rate',455,240,'dQ/dt = '+fmt(m.rate)+' W'),text('local',455,288,'∂q/∂t = '+fmt(m.densityRate)+' W/m³'),text('sign',300,382,s.a>0?'Positive outward flux: stored energy decreases':s.a<0?'Negative outward flux: stored energy increases':'Zero net outward flux: stored energy is constant'));
  probe=probeTrack(shapes,'a',s.a,-1,1,'Flux derivative α (W/m³)');equation='heat-conservation';context='Source-free fixed cube · q(t) = q₀ − αt · authored instantaneous heat field';
 }else if(scene==='radial-heat-flux'){
  title='STEADY POINT SOURCE · SPHERICAL HEAT FLUX';const center=[165,204],R=s.r*55;shapes.push({id:'sphere',type:'circle',at:center,radius:R},curve('equator',samples(t=>[165+R*Math.cos(t*2*Math.PI),204+R*.22*Math.sin(t*2*Math.PI)]),'reference'),point('source',center),text('source-label',165,188,'W = '+fmt(s.q)+' W'));
  for(let i=0;i<12;i++){const a=i*Math.PI/6,u=[Math.cos(a),Math.sin(a)],P=[165+R*u[0],204-R*u[1]],length=m.density*12;shapes.push(arrow('heat-'+i,P,[P[0]+length*u[0],P[1]-length*u[1]]));}
  const gx=r=>355+(r-.3)/1.7*200,gy=h=>285-h/5*170;shapes.push(text('density-title',455,82,'Radial heat flux hᵣ (W/m²)'),line('gx',[355,285],[555,285],'axis'),line('gy',[355,115],[355,285],'axis'),text('g5',338,115,'5'),text('g0',338,285,'0'),curve('density',samples(t=>{const r=.3+t*1.7;return [gx(r),gy(s.q/(4*Math.PI*r*r))];})),point('chosen-density',[gx(s.r),gy(m.density)]),text('density-value',455,316,'hᵣ = '+fmt(m.density)+' W/m²'),text('area',165,329,'Sphere area = '+fmt(m.area)+' m²'),text('total',300,382,'Total heat per second = hᵣ × area = '+fmt(m.total)+' W'));
  probe=probeTrack(shapes,'r',s.r,.3,2,'Radius R (m)');equation='radial-heat';context='Steady, isotropic point source · R > 0 · homogeneous large block away from edges';
 }else if(scene==='heat-local'){
  title='FOURIER CONDUCTION → TEMPERATURE DIFFUSION';const gx=x=>75+(x+1)*225,gy=T=>163-(T-20)*14,hy=h=>290-h/32*28;
  shapes.push(text('T-title',300,66,'T (°C) · blue: initial profile · black: time t'),line('T-axis',[75,163],[525,163]),curve('initial',samples(u=>[gx(-1+u*2),gy(20+s.q*Math.cos(Math.PI*(-1+u*2)))]),'blue-curve'),curve('temperature',samples(u=>[gx(-1+u*2),gy(m.temperature(-1+u*2))])),text('T-baseline',48,163,'20'),text('x-left',75,241,'−1 m'),text('x-right',525,241,'+1 m'),text('h-title',300,251,'hₓ (W/m²) · positive rightward · fixed scale ±32'),line('h-axis',[75,290],[525,290]),curve('flux',samples(u=>[gx(-1+u*2),hy(m.flux(-1+u*2))])),line('position-guide',[gx(s.n),83],[gx(s.n),315],'reference'),point('probe',[gx(s.n),gy(m.temperature(s.n))],true),point('flux-probe',[gx(s.n),hy(m.flux(s.n))]),text('position',300,327,'Probe x = '+fmt(s.n)+' m · T = '+fmt(m.temperature(s.n))+' °C · t = '+fmt(s.r)+' s'),text('curvature',300,351,'At probe: ∇²T = '+fmt(m.curvature(s.n))+' K/m² · ∂q/∂t = '+fmt(m.densityRate(s.n))+' W/m³'),text('rate',300,376,'∂T/∂t = '+fmt(m.rate(s.n))+' K/s · D = '+fmt(m.D)+' m²/s · '+(m.rate(s.n)>1e-10?'warming':m.rate(s.n)<-1e-10?'cooling':'locally unchanged')));
  probe={id:'probe',parameter:'n',origin:300,scale:225,min:-1,max:1};equation='heat-diffusion';context='Exact mode · k = π m⁻¹ · insulated x = ±1 m · uniform y,z · constant κ, cᵥ';
 }else if(scene==='line-circulation'){
  title='CIRCULATION · DIRECTED TANGENTIAL INTEGRAL';const R=s.r*80,center=[165,204];
  shapes.push({id:'loop',type:'circle',at:center,radius:R},text('orientation',165,82,m.sign===1?'Counterclockwise · +z normal':'Clockwise · −z normal'));
  for(let i=0;i<12;i++){const t=i*Math.PI/6,u=[Math.cos(t),Math.sin(t)],P=[165+R*u[0],204-R*u[1]],C=affineField([s.r*u[0],s.r*u[1],0],s.a,s.b),end=[P[0]+18*C[0],P[1]-18*C[1]],angle=t+m.sign*.12;shapes.push(arrow('field-'+i,P,end,'background'),arrow('direction-'+i,P,[165+R*Math.cos(angle),204-R*Math.sin(angle)]));}
  shapes.push(text('field',455,106,'Cxy = (1+λx−ωy, 0.5+ωx+λy)'),text('curl',455,156,'Normal curl = '+fmt(m.sign*m.curl)+' W/m³'),text('area',455,206,'Disk area = '+fmt(m.area)+' m²'),text('integral',455,258,'Circulation = '+fmt(m.integral)+' W/m'),text('expansion',455,311,'λ changes C · its loop contribution is 0'),text('total',300,382,'Reverse the direction: the circulation changes sign'));
  probe=probeTrack(shapes,'b',s.b,-1,1,'Rotation ω (W/m³)');equation='circle-circulation';context='Smooth authored affine field · xy projection · direction integral, not material motion';
 }else{
  title=s.n===0?'CURL OF A GRADIENT · MIXED DERIVATIVES':'DIVERGENCE OF A CURL · MIXED DERIVATIVES';
  for(let ix=-2;ix<=2;ix++)for(let iy=-2;iy<=2;iy++){const x=ix*.4,y=iy*.4,P=[165+x*90,210-y*90],v=s.n===0?[2+s.q*y,1+s.q*x]:[s.q*x,-s.q*y];shapes.push(arrow('field-'+ix+'-'+iy,P,[P[0]+v[0]*21,P[1]-v[1]*21]));}
  shapes.push(text('model',300,74,s.n===0?'ψ = 20 + 2x + y + ηxy (°C)':'C = (0, 0, ηxy) (W/m²)'),text('mixed-first',455,134,s.n===0?'∂x∂yψ = '+fmt(s.q)+' °C/m²':'∂x(∇×C)x = '+fmt(s.q)+' W/m⁴'),text('mixed-second',455,176,s.n===0?'∂y∂xψ = '+fmt(s.q)+' °C/m²':'∂y(∇×C)y = '+fmt(-s.q)+' W/m⁴'),text('identity',455,228,s.n===0?'Curl = η − η = 0':'Divergence = η − η = 0'),text('scope',455,283,'Smooth polynomial · mixed derivatives commute'),point('coordinate',[165+s.r*90,210]),text('probe-value',165,315,'Probe x = '+fmt(s.r)+' m'),text('general',300,382,'The general identity follows from equal mixed derivatives'));
  if(s.n===1)shapes.push(text('face-pairs',455,320,'Cube axis pairs: '+m.facePairs.map(fmt).join(', ')+' W/m'));
  probe=probeTrack(shapes,'r',s.r,-1,1,'Probe x (m)',357);equation=s.n===0?'curl-gradient':'div-curl';context=s.n===0?'Gradient: °C/m · η: °C/m² · global smooth scalar potential on this domain':'Displayed field: ∇×C (W/m³) · η: W/m⁴ · no converse global-potential claim';
 }
 shapes.push(text('title',300,26,title),text('context',300,422,context),text('hint',300,444,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:equation,x:300,y:400}],probe};
}
export function drawChapter3(scene,state){const d=chapter3Definition(scene,state);const equations={'gradient-path':'∫ ∇ψ · ds = ψ(B) − ψ(A)','boundary-partition':'Internal contributions cancel · combined boundary remains','heat-balance':'dQ/dt = −∮ h · n da · ∂q/∂t = −∇ · h','radial-heat-flux':'hR = W / (4πR²)','heat-local':'h = −κ∇T · ∂T/∂t = (κ/cᵥ)∇²T','line-circulation':'∮ C · ds = ±2ωπR²','operator-identities':state.n===1?'∇ · (∇ × C) = 0':'∇ × (∇ψ) = 0'};return {body:primitivesSVG([...d.shapes.filter(x=>!['context','hint'].includes(x.id)),text('equation',300,400,equations[scene])]),metrics:[],label:d.label};}
export function chapter3Checks(scene){let error=0,states=0;const test=(s,err)=>{const m=chapter3Model(scene,s);error=Math.max(error,Math.abs(err(m)));states++;};
 if(scene==='gradient-path')for(const r of [1,4,32])for(const q of [0,.8,1.5])for(const b of [0,1])test({r,q,b},m=>m.error-m.curvature/m.N);
 if(scene==='boundary-partition')for(const r of [.2,.8,1.2])for(const a of [-1,0,1])for(const b of [-1,0,1])for(const q of [.2,.5,.8])for(const n of [0,1])test({r,a,b,q,n},m=>Math.max(Math.abs(m.shared[0]+m.shared[1]),Math.abs(m.total-m.exterior)));
 if(scene==='heat-balance')for(const r of [.2,1.2])for(const a of [-1,0,1])test({r,a},m=>m.flux+m.rate);
 if(scene==='radial-heat-flux')for(const r of [.3,1,2])for(const q of [1,5])test({r,q},m=>m.total-m.power);
 if(scene==='heat-local')for(const r of [0,.5,2])for(const a of [.1,1,2])for(const b of [.5,2,4])for(const q of [1,5])for(const x of [-1,-.4,0,.6,1])test({r,a,b,q},m=>m.densityRate(x)+m.divergence(x));
 if(scene==='line-circulation')for(const r of [.2,.7,1.2])for(const a of [-1,0,1])for(const b of [-1,0,1])for(const n of [0,1])test({r,a,b,n},m=>m.integral-m.sign*m.curl*m.area);
 if(scene==='operator-identities')for(const r of [-1,.4,1])for(const q of [-1,0,1])for(const n of [0,1])test({r,q,n},m=>m.mode===0?m.mixed[0]-m.mixed[1]:m.derivatives.reduce((a,b)=>a+b,0));
 if(error>1e-10)throw Error('Chapter 3 invariant failed.');return {passed:true,method:'Bounded analytic identities and conservation across nondefault states; independent numerical checks are separate',states,maxError:error};}
