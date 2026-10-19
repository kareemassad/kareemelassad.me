import {primitivesSVG} from './scene-primitives.js';
export const boundaryNames=Object.freeze(['surface-flux','gauss-cube','stokes-square']);
export const boundaryDefaults=Object.freeze({'surface-flux':{a:1,b:30,q:1},'gauss-cube':{r:.8,a:.5,b:.5},'stokes-square':{r:.8,a:.5,b:.5,n:0}});
const dot=(u,v)=>u.reduce((sum,x,i)=>sum+x*v[i],0),radians=x=>x*Math.PI/180;
const finite=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
// Authored units: C W/m²; coordinates m; λ and ω W/m³.
export function affineField(point,lambda,omega){
 if(point.length!==3||!point.every(Number.isFinite)||![lambda,omega].every(Number.isFinite))throw Error('Invalid affine field.');
 const [x,y,z]=point;return [1+lambda*x-omega*y,.5+omega*x+lambda*y,.25+lambda*z];
}
export function affineLineIntegral(from,to,lambda,omega){
 if(from.length!==3||to.length!==3||![...from,...to].every(Number.isFinite))throw Error('Use two finite three-dimensional endpoints.');
 const delta=to.map((x,i)=>x-from[i]),midpoint=to.map((x,i)=>(x+from[i])/2);
 return dot(affineField(midpoint,lambda,omega),delta);
}
export function affineFaceFlux(center,normal,area,lambda,omega){
 if(!finite(area,0,Infinity)||normal.length!==3||!normal.every(Number.isFinite)||Math.abs(Math.hypot(...normal)-1)>1e-12)throw Error('Use a unit normal and a nonnegative area.');
 return dot(affineField(center,lambda,omega),normal)*area;
}
export function boundaryModel(scene,state){
 if(!boundaryNames.includes(scene))throw Error('Unsupported boundary model.');
 const s={...boundaryDefaults[scene],...state};
 if(scene==='surface-flux'){
  if(!finite(s.a,.2,2)||!finite(s.b,0,360)||!finite(s.q,.25,2))throw Error('Invalid face state.');
  const theta=radians(s.b),normal=[Math.cos(theta),Math.sin(theta),0],field=[s.q,.5*s.q,0],component=dot(field,normal),flux=component*s.a;
  return {area:s.a,theta:s.b,normal,field,component,flux};
 }
 if(!finite(s.r,.2,1.2)||!finite(s.a,-1,1)||!finite(s.b,-1,1))throw Error('Invalid affine boundary state.');
 const h=s.r,lambda=s.a,omega=s.b,divergence=3*lambda,curl=[0,0,2*omega],volume=h**3,area=h*h;
 if(scene==='gauss-cube'){
  const faces=[];for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
   const center=[0,0,0],normal=[0,0,0];center[axis]=sign*h/2;normal[axis]=sign;
   faces.push({axis,sign,center,normal,flux:affineFaceFlux(center,normal,area,lambda,omega)});
  }
  const pairs=[0,1,2].map(axis=>faces.filter(f=>f.axis===axis).reduce((sum,f)=>sum+f.flux,0));
  const samplePoint=[h/2,0,0],sampleField=affineField(samplePoint,lambda,omega);
  return {h,lambda,omega,faces,pairs,volume,area,divergence,curl,samplePoint,sampleField,flux:faces.reduce((sum,f)=>sum+f.flux,0),volumeIntegral:divergence*volume};
 }
 if(![0,1].includes(s.n))throw Error('Choose one coupled path and normal orientation.');
 const sign=s.n===0?1:-1,corners=[[-h/2,-h/2,0],[h/2,-h/2,0],[h/2,h/2,0],[-h/2,h/2,0]];
 const edges=corners.map((p,i)=>{const q=corners[(i+1)%4],from=sign===1?p:q,to=sign===1?q:p;return {from,to,integral:affineLineIntegral(from,to,lambda,omega)};});
 const normal=[0,0,sign],circulation=edges.reduce((sum,e)=>sum+e.integral,0),curlIntegral=dot(curl,normal)*area;
 return {h,lambda,omega,divergence,curl,area,normal,sign,corners,edges,circulation,curlIntegral};
}
export function boundaryContext(scene){
 if(scene==='surface-flux')return {values:'Uniform patch · chosen unit normal · C arrows and n use separate scales',hint:'Drag: normal angle · ↑ / ↓: area · Space: pause / play'};
 if(scene==='gauss-cube')return {values:'C = (1+λx−ωy, 0.5+ωx+λy, 0.25+λz)',hint:'C: W/m² · λ, ω: W/m³ · ← / →: h · ↑ / ↓: λ · [ / ]: ω'};
 return {values:'Same affine field · xy square · exact midpoint edge integrals',hint:'Drag: ω · ↑ / ↓: size · O: reverse path and normal · Space: play'};
}
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(3)).toString();
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='field')=>({id,type:'arrow',from,to,style,visible:Math.hypot(to[0]-from[0],to[1]-from[1])>1e-10});
const curve=(id,points,style='field')=>({id,type:'curve',points,style});
const point=(id,at)=>({id,type:'point',at,probe:true});
function graph(shapes,{title,units,min,max,value,at,parameter,sample,yLimit=3}){
 const gx=v=>350+(v-min)/(max-min)*220,gy=v=>210-v/yLimit*90;
 shapes.push(text('graph-title',460,70,title),text('graph-units',460,90,units),line('graph-x',[350,300],[570,300],'axis'),line('graph-y',[350,120],[350,300],'axis'),line('graph-zero',[350,210],[570,210]),text('graph-top',332,120,fmt(yLimit)),text('graph-bottom',332,300,'−'+fmt(yLimit)),text('graph-zero-label',332,210,'0'),text('graph-min',350,320,fmt(min)),text('graph-max',570,320,fmt(max)),curve('graph-values',Array.from({length:101},(_,i)=>{const v=min+(max-min)*i/100;return [gx(v),gy(sample(v))];})),point('probe',[gx(at),gy(value)]));
 return {id:'probe',parameter,origin:350-min*220/(max-min),scale:220/(max-min),min,max};
}
export function boundaryDefinition(scene,state){
 const m=boundaryModel(scene,state),shapes=[];let probe,equation,label;
 if(scene==='surface-flux'){
  const P=[165,210],screen=v=>[P[0]+v[0]*75,P[1]-v[1]*75],t=[-m.normal[1],m.normal[0],0],half=Math.sqrt(m.area)*.6;
  shapes.push(text('title',300,24,'NORMAL COMPONENT · SIGNED FACE FLUX'),line('surface',screen(t.map(x=>-half*x)),screen(t.map(x=>half*x)),'axis'),arrow('field',P,screen(m.field)),arrow('normal',P,screen(m.normal),'normal'),line('projection',screen(m.field),screen(m.normal.map(x=>x*m.component))),arrow('normal-component',P,screen(m.normal.map(x=>x*m.component))),text('field-label',250,125,'C = (q, q/2, 0)'),text('normal-label',135,110,'Blue: unit normal n'),text('face-area',165,310,'Edge-on patch · A = '+fmt(m.area)+' m²'),text('face-component',165,335,'C · n = '+fmt(m.component)+' W/m²'));
  probe=graph(shapes,{title:'Signed flux as the normal turns',units:'Φ (W) · normal angle θ (degrees)',min:0,max:360,value:m.flux,at:m.theta,parameter:'b',sample:v=>m.area*(m.field[0]*Math.cos(radians(v))+m.field[1]*Math.sin(radians(v))),yLimit:5});
  shapes.push(text('face-flux',460,348,'Φ = '+fmt(m.flux)+' W'));
  equation='surface-normal-flux';label='Uniform authored heat-flow field, chosen face area and unit normal';
 }else if(scene==='gauss-cube'){
  const project=([x,y,z])=>[160+85*x+40*y,215-85*z-40*y],vertices=[];
  for(let z=-1;z<=1;z+=2)for(let y=-1;y<=1;y+=2)for(let x=-1;x<=1;x+=2)vertices.push([x*m.h/2,y*m.h/2,z*m.h/2]);
  for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(vertices[i].filter((v,k)=>v!==vertices[j][k]).length===1)shapes.push(line('cube-'+i+'-'+j,project(vertices[i]),project(vertices[j]),'axis'));
  shapes.push(arrow('axis-x',[50,280],[85,280],'background'),arrow('axis-y',[50,280],[66,264],'background'),arrow('axis-z',[50,280],[50,245],'background'),text('axis-x-label',96,280,'x'),text('axis-y-label',76,258,'y'),text('axis-z-label',50,233,'z'),text('normal-legend',165,65,'Blue: outward unit normals'),text('component-legend',165,85,'Black: normal components'),text('sample-legend',165,105,'Gold: full C at +x face centre'),text('sample-value',165,127,'Cᵧ(+x) = '+fmt(m.sampleField[1])+' W/m²'));
  m.faces.forEach((face,i)=>{const P=project(face.center),N=project(face.center.map((x,k)=>x+face.normal[k]*.28)),component=face.flux/m.area,componentEnd=project(face.center.map((x,k)=>x+face.normal[k]*component*.35));shapes.push(arrow('normal-'+i,P,N,'normal'),arrow('component-'+i,P,componentEnd),text('face-'+i,330,125+i*27,(face.sign<0?'−':'+')+'xyz'[face.axis]),text('flux-'+i,535,125+i*27,fmt(face.flux)+' W'),line('bar-'+i,[390,125+i*27],[390+face.flux*20,125+i*27],'axis'));});
  const fullEnd=project(m.samplePoint.map((v,i)=>v+.35*m.sampleField[i])),normalEnd=project(m.samplePoint.map((v,i)=>v+(i===0?.35*m.sampleField[0]:0)));
  shapes.push(line('sample-projection',normalEnd,fullEnd,'construction'),arrow('sample-field',project(m.samplePoint),fullEnd,'sample-field'));
  shapes.push(text('title',300,24,'SIX OUTWARD FACES · DIVERGENCE'),text('bars-title',465,77,'Signed outward face integrals'),line('bars-zero',[390,108],[390,278]),text('cube-side',160,309,'Cube side h = '+fmt(m.h)+' m'),text('cube-derivative',160,333,'∇ · C = 3λ = '+fmt(m.divergence)+' W/m³'),text('cube-total',465,307,'Total Φ = '+fmt(m.flux)+' W'),text('cube-volume',465,332,'3λV = '+fmt(m.volumeIntegral)+' W'));
  probe={id:'probe',parameter:'r',origin:45,scale:220/1.2,min:.2,max:1.2};shapes.push(line('size-axis',[45,357],[265,357],'axis'),point('probe',[45+m.h*220/1.2,357]),text('size-label',155,347,'h (m)'));
  equation='cube-divergence';label='Exact six-face flux in one smooth authored affine vector field';
 }else{
  const xy=([x,y])=>[165+x*100,200-y*100];
  for(let ix=-2;ix<=2;ix++)for(let iy=-2;iy<=2;iy++){const p=[ix*.3,iy*.3,0],C=affineField(p,m.lambda,m.omega),P=xy(p);shapes.push(arrow('field-'+ix+'-'+iy,P,[P[0]+C[0]*17,P[1]-C[1]*17],'background'));}
  m.edges.forEach((e,i)=>{shapes.push(arrow('edge-'+i,xy(e.from),xy(e.to)));const mid=e.from.map((x,k)=>(x+e.to[k])/2),P=xy(mid),offset=[[0,21],[25,0],[0,-21],[-25,0]][i];shapes.push(text('edge-label-'+i,P[0]+offset[0],P[1]+offset[1],String(i+1)));});
  shapes.push(text('title',300,24,'FOUR DIRECTED EDGES · NORMAL CURL'),text('normal',165,201,m.sign===1?'⊙':'⊗'),text('orientation',165,304,m.sign===1?'CCW path · normal +z':'CW path · normal −z'),text('curl',165,329,'(∇ × C)z = 2ω = '+fmt(2*m.omega)+' W/m³'));
  probe=graph(shapes,{title:'Circulation as ω changes',units:'∮ C · ds (W/m) · ω (W/m³)',min:-1,max:1,value:m.circulation,at:m.omega,parameter:'b',sample:w=>m.sign*2*w*m.area});
  shapes.push(text('edge-values',300,352,'Edges 1–4: '+m.edges.map(e=>fmt(e.integral)).join(' , ')+' W/m'));
  equation='square-curl';label='Exact affine line integrals around a planar square and coupled path-normal orientation';
 }
 const {values,hint}=boundaryContext(scene);shapes.push(text('context',300,420,values),text('hint',300,442,hint));
 return {schemaVersion:1,scene,label,sourceScope:label,width:600,height:452,shapes,equations:[{id:equation,x:300,y:391}],probe};
}
export function drawBoundary(scene,state){
 const m=boundaryModel(scene,state),d=boundaryDefinition(scene,state),shapes=d.shapes.filter(x=>x.at?.[1]!==420&&x.at?.[1]!==442);
 const formulas={'surface-flux':'Φ = (C · n) A','gauss-cube':'Σ face flux = (∇ · C) V = 3λh³','stokes-square':'∮ C · ds = (∇ × C) · n A'};
 shapes.push(text('equation',300,391,formulas[scene]));
 const metrics=scene==='surface-flux'?[{label:'Normal component',value:fmt(m.component)+' W/m²'},{label:'Signed patch flux',value:fmt(m.flux)+' W'}]:scene==='gauss-cube'?[{label:'Net outward flux',value:fmt(m.flux)+' W'},{label:'Volume integral',value:fmt(m.volumeIntegral)+' W'},{label:'Divergence',value:fmt(m.divergence)+' W/m³'}]:[{label:'Four edge integrals',value:m.edges.map(e=>fmt(e.integral)).join(', ')+' W/m'},{label:'Circulation',value:fmt(m.circulation)+' W/m'},{label:'Normal curl times area',value:fmt(m.curlIntegral)+' W/m'}];
 return {body:primitivesSVG(shapes),metrics,label:d.label};
}
export function boundaryChecks(scene){
 let states=0,error=0;
 if(scene==='surface-flux'){for(const a of [.2,1,2])for(const b of [0,90,180,270,360])for(const q of [.25,1,2]){const m=boundaryModel(scene,{a,b,q}),opposite=boundaryModel(scene,{a,b:(b+180)%360,q});error=Math.max(error,Math.abs(m.flux+opposite.flux));states++;}}
 else for(const r of [.2,.6,1.2])for(const a of [-1,0,1])for(const b of [-1,0,1])for(const n of [0,1]){const m=boundaryModel(scene,{r,a,b,n});error=Math.max(error,Math.abs(scene==='gauss-cube'?m.flux-m.volumeIntegral:m.circulation-m.curlIntegral));states++;}
 if(error>1e-12)throw Error('Boundary integral invariant failed.');return {passed:true,method:'Signed unit-normal projection, six exact affine face integrals, four exact midpoint edge integrals and coupled orientation',states,maxError:error};
}
