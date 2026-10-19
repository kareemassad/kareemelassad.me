import {diagramContext} from './diagram-context.js';
import {templateNames,templateInitial,templateControls,drawTemplate} from './templates.js';
import {K, EPS0, NC, norm, unit, field, potential, pairForce, externalWork, enclosedFlux, coneFlux, sphereOutside, dipole, traceLine, contourSegments, joinContourSegments} from './physics.js';
export const initial = scene => ({q:1, q1:1, q2:1, r:2, a:.8, R:2, alpha:22, outer:2.8, x:0, y:1.1, separation:1.6, ra:1.1, rb:2.6, path:0, progress:0, angle:37, lines:true, contours:true, ... (scene==='gauss'?{x:2.3}:{}), ...(scene==='dipole'?{x:0,y:1.1}:{}), ...(scene==='point'?{r:1.6}: {}),...templateInitial(scene)});
export function controls(scene,state) {
 if(templateNames.includes(scene))return templateControls(scene,state);
 const p = (key,label,min,max,step,units) => ({key,label,min,max,step,units});
 switch(scene) {
  case 'statics':return [];
  case 'coulomb':return [p('q1','Charge q₁',-3,3,.25,'nC'),p('q2','Charge q₂',-3,3,.25,'nC'),p('r','Separation r₁₂',.6,3.5,.05,'m')];
  case 'superposition':return [p('q1','Left source q₁',.5,3,.25,'nC'),p('q2','Right source q₂',.5,3,.25,'nC'),p('x','Probe x',-2.5,2.5,.05,'m'),p('y','Probe y',.3,2,.05,'m')];
  case 'potential-loop':
  case 'potential':return [p('ra','Start radius rₐ',.7,3.3,.05,'m'),p('rb','End radius rb',.7,3.3,.05,'m'),p('progress','Position along path',0,1,.005,'')];
  case 'cone':return [p('outer','Outer cap radius b',1.5,3.3,.05,'m'),p('alpha','Cone half-angle α',10,35,1,'°')];
  case 'gauss':return [p('x','Negative charge x',0,3,.025,'m'),p('r','Gaussian radius',.8,3,.025,'m')];
  case 'sphere':return [p('R','Observation radius R',1,3.4,.05,'m'),p('q','Charge density ρ',.5,3,.25,'nC/m³')];
  case 'dipole':return [p('q','Charge magnitude |q|',.5,3,.25,'nC'),p('separation','Separation d',.8,2.4,.05,'m')];
  case 'point':return [p('q','Positive charge q',.5,3,.25,'nC'),p('r','Probe radius r',.5,3.2,.025,'m'),p('angle','Probe angle',0,360,1,'°')];
  default:return [p('q','Source charge q',.5,3,.25,'nC'),p('r','Observation radius r',.6,3.2,.025,'m')];
 }
}
let drawingScale = 78;
const X=x=>300+x*drawingScale, Y=y=>202-y*drawingScale;
const fmt=(n,d=3)=>Number.isFinite(n)?(Math.abs(n)<1e-12?'0':Number(n.toPrecision(d)).toString()):'undefined';
const pt=p=>`${X(p[0]).toFixed(2)},${Y(p[1]).toFixed(2)}`;
const line=(a,b,cls='line',extra='')=>`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" class="${cls}" ${extra}/>`;
const text=(x,y,s,cls='label',extra='')=>`<text x="${X(x)}" y="${Y(y)}" class="${cls}" ${extra}>${s}</text>`;
const circle=(p,r,cls='line')=>`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${r*drawingScale}" class="${cls}"/>`;
const charge=(p,q,label='')=>`${circle(p,.095,q<0?'charge negative':'charge positive')}${text(p[0],p[1]-.05,q<0?'−':q>0?'+':'0','charge-sign','text-anchor="middle"')}${label?text(p[0],p[1]-.42,label,'label','text-anchor="middle"'):''}`;
const arrow=(p,v,cls='vector',len=.55)=>{const u=unit(v),tip=[p[0]+u[0]*len,p[1]+u[1]*len],back=[tip[0]-u[0]*.085,tip[1]-u[1]*.085],a=[back[0]-u[1]*.036,back[1]+u[0]*.036],b=[back[0]+u[1]*.036,back[1]-u[0]*.036];return line(p,tip,cls)+`<polygon points="${pt(tip)} ${pt(a)} ${pt(b)}" fill="${cls==='probe-vector'?'#356c9d':'#1f2328'}"/>`};
const probe=p=>`${circle(p,.062,'probe-dot')}${text(p[0]+.14,p[1]+.12,'P','probe-label')}`;
const poly=(points,cls='line',extra='')=>`<polyline points="${points.map(pt).join(' ')}" class="${cls}" ${extra}/>`;
const axis=()=>line([-3.4,0],[3.4,0],'axis')+line([0,-2.3],[0,2.3],'axis');
const wrap=(body,label)=>`<svg viewBox="0 0 600 400" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8" fill="#1f2328"/></marker><marker id="blue-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#356c9d"/></marker></defs>${body}</svg>`;
const metrics=(...values)=>values.map(([label,value])=>({label,value}));
const dipoleCache=new Map();
const qpoint=s=>[{q:s.q*NC,p:[0,0,0]}];
export function pathPoint(s,t=s.progress) {
 // Two constructions with identical endpoints, as in the radial/arc argument.
 if(s.loop)return t<=.5?pathPoint({...s,loop:false,path:0},t*2):pathPoint({...s,loop:false,path:1},2-2*t);
 const theta=1.0;
 if(s.path===0) return t<.5?[s.ra*Math.cos(2*t*theta),s.ra*Math.sin(2*t*theta),0]:[(s.ra+(s.rb-s.ra)*(2*t-1))*Math.cos(theta),(s.ra+(s.rb-s.ra)*(2*t-1))*Math.sin(theta),0];
 return t<.5?[s.ra+(s.rb-s.ra)*2*t,0,0]:[s.rb*Math.cos((2*t-1)*theta),s.rb*Math.sin((2*t-1)*theta),0];
}
export function draw(scene,s) {
 if(templateNames.includes(scene))return drawTemplate(scene,s);
 if(scene==='potential-loop'){scene='potential';s={...s,loop:true};}
 drawingScale = ['flux','gauss','sphere','point','potential'].includes(scene) ? 52 : 78;
 let body='',out=[],caption='',probePoint;
 if(scene==='statics') {
  body=`<text x="300" y="42" text-anchor="middle" class="large-equation">No time dependence</text><text x="300" y="78" text-anchor="middle" class="label">Stationary charges · steady currents</text><line x1="300" y1="92" x2="300" y2="125" class="line"/><path d="M145 147 V125 H455 V147" class="line"/><rect x="36" y="147" width="252" height="182" rx="4" class="equation-box"/><rect x="312" y="147" width="252" height="182" rx="4" class="equation-box"/><text x="162" y="184" text-anchor="middle" class="label">ELECTROSTATICS</text><text x="438" y="184" text-anchor="middle" class="label">MAGNETOSTATICS</text><text x="162" y="234" text-anchor="middle" class="large-equation">∇ · E = ρ/ε₀</text><text x="162" y="285" text-anchor="middle" class="large-equation">∇ × E = 0</text><text x="438" y="234" text-anchor="middle" class="large-equation">∇ · B = 0</text><text x="438" y="285" text-anchor="middle" class="large-equation">∇ × B = j/(ε₀c²)</text><text x="300" y="367" text-anchor="middle" class="label">The electric and magnetic equations separate.</text>`;
  caption='The static limit of Maxwell’s equations, Eqs. (4.5)–(4.8).';
  out=metrics(['∂E/∂t','0'],['∂B/∂t','0'],['Sources','Fixed in time']);
 } else if(scene==='coulomb') {
  const a=[s.r/2,0,0],b=[-s.r/2,0,0],f=pairForce(s.q1*NC,s.q2*NC,a,b);
  body=line(b,a,'axis')+charge(b,s.q2,'q₂')+charge(a,s.q1,'q₁');
  if(norm(f)>0)body+=arrow(a,f)+arrow(b,f.map(v=>-v));
  body+=line([b[0],-.75],[a[0],-.75],'dimension')+text(0,-1.02,`r₁₂ = ${fmt(s.r)} m`,'label','text-anchor="middle"')+arrow([b[0],1.1],[1,0,0],'vector',s.r)+text(0,1.35,'e₁₂ points from q₂ to q₁','label','text-anchor="middle"');
  out=metrics(['|F₁| = |F₂|',`${fmt(norm(f)/NC)} nN`],['Interaction',s.q1*s.q2>0?'Repulsion':s.q1*s.q2<0?'Attraction':'Zero force'],['F₁ + F₂','0 N']);
  caption='Equal and opposite Coulomb forces. Arrow lengths show direction only.';
 } else if(scene==='superposition') {
  const cs=[{q:s.q1*NC,p:[-1,0,0]},{q:s.q2*NC,p:[1,0,0]}],p=[s.x,s.y,0],e=field(cs,p),e1=field([cs[0]],p),e2=field([cs[1]],p);
  const scale=.075;
  body=axis()+charge(cs[0].p,s.q1,'q₁')+charge(cs[1].p,s.q2,'q₂')+line(cs[0].p,p,'construction')+line(cs[1].p,p,'construction');
  // Use a common scale, bounded to keep the vector sum in the drawing.
  const max=Math.max(norm(e1),norm(e2),norm(e));let vscale=Math.min(scale,1.15/max);
  for(const vector of [e1,e])for(let j=0;j<2;j++){const bound=j===0?3.6:2.35;if(vector[j]>0)vscale=Math.min(vscale,(bound-p[j])/vector[j]);else if(vector[j]<0)vscale=Math.min(vscale,(-bound-p[j])/vector[j]);}
  const v1=p.map((v,i)=>v+e1[i]*vscale),vsum=v1.map((v,i)=>v+e2[i]*vscale);
  body+=line(p,v1,'component','marker-end="url(#arrow)"')+line(v1,vsum,'component','marker-end="url(#arrow)"')+line(p,vsum,'probe-vector','marker-end="url(#blue-arrow)"')+probe(p);
  out=metrics(['Ex',`${fmt(e[0])} N/C`],['Ey',`${fmt(e[1])} N/C`],['|E|',`${fmt(norm(e))} N/C`]);
  caption='Head-to-tail vector addition: grey contributions, blue resultant. A common arrow scale preserves the sum.';
 } else if(scene==='potential') {
  const cs=qpoint(s),a=pathPoint(s,0),b=pathPoint({...s,loop:false},1),p=pathPoint(s),delta=externalWork(cs,a,b);
  const full0=Array.from({length:121},(_,i)=>pathPoint({...s,loop:false,path:0},i/120));
  const full1=Array.from({length:121},(_,i)=>pathPoint({...s,loop:false,path:1},i/120));
  body=charge([0,0,0],1,'q')+circle([0,0],s.ra,'equipotential')+circle([0,0],s.rb,'equipotential')+poly(full0,(s.loop||s.path===0)?'path-active':'construction')+poly(full1,(s.loop||s.path===1)?'path-active':'construction')+'<g data-motion>'+probe(p)+arrow(p,field(cs,p),'probe-vector')+'</g>';
  body+=text(a[0],a[1]-.32,'a','label','text-anchor="middle"')+text(b[0]+.1,b[1]+.22,'b','label');
  const phase=s.loop?((s.progress<.25||s.progress>=.5&&s.progress<.75)?'Circular arc: zero work':'Radial segment'):s.path===0?(s.progress<.5?'Circular arc: zero work':'Radial segment'):(s.progress<.5?'Radial segment':'Circular arc: zero work');
  out=metrics(['Accumulated W/qtest',`${fmt(externalWork(cs,a,p))} V`],[s.loop?'Full loop Δφ':'Final Δφ',`${fmt(s.loop?0:delta)} V`],['Current part',phase]);
  caption='Two arc-and-radius paths between the same endpoints. The moving marker shows path position.';
 } else if(scene==='gradient') {
  const graphX=r=>80+132*r,graphY=v=>335-v*(280/60);
  const points=Array.from({length:140},(_,i)=>{const r=.45+i*.021;return [graphX(r),graphY(K*s.q*NC/r)]});
  const phi=K*s.q*NC/s.r,e=K*s.q*NC/s.r**2,cx=graphX(s.r),cy=graphY(phi),h=Math.min(.3,s.r*.18);
  body=Array.from({length:7},(_,i)=>`<text x="60" y="${graphY(i*10)+4}" text-anchor="end" class="label">${i*10}</text><line x1="70" y1="${graphY(i*10)}" x2="535" y2="${graphY(i*10)}" class="axis"/>`).join('')+`<path d="M70 55 V335 H535" class="axis"/><text x="76" y="41" class="label">φ (V)</text><text x="548" y="341" class="label">r (m)</text><polyline points="${points.map(p=>p.join(',')).join(' ')}" class="vector"/><line x1="${graphX(s.r-h)}" y1="${graphY(phi+e*h)}" x2="${graphX(s.r+h)}" y2="${graphY(phi-e*h)}" class="probe-vector"/><circle cx="${cx}" cy="${cy}" r="4" class="probe-dot"/><path d="M${cx} ${cy} V335" class="construction"/><text x="${cx}" y="359" text-anchor="middle" class="probe-label">${fmt(s.r)} m</text><text x="316" y="77" class="large-equation">Eᵣ = −dφ/dr</text>`;
  out=metrics(['φ',`${fmt(phi)} V`],['dφ/dr',`${fmt(-e)} V/m`],['Outward Er',`${fmt(e)} N/C`]);caption='The blue tangent shows the potential slope at the selected radius. 1 V/m = 1 N/C.';
 } else if(scene==='flux') {
  const e=K*s.q*NC/s.r**2,area=4*Math.PI*s.r**2;
  body=circle([0,0],s.r,'gaussian')+`<ellipse cx="300" cy="202" rx="${s.r*drawingScale}" ry="${s.r*drawingScale*.26}" class="construction"/>`+charge([0,0,0],s.q,'q');
  for(let i=0;i<12;i++){let a=i*Math.PI/6;body+=arrow([s.r*Math.cos(a),s.r*Math.sin(a),0],[Math.cos(a),Math.sin(a),0],'vector',.36)}
  body+=line([0,0],[s.r,0],'dimension')+text(s.r/2,-.23,`r = ${fmt(s.r)} m`,'label','text-anchor="middle"');
  out=metrics(['Normal field',`${fmt(e)} N/C`],['Surface area',`${fmt(area)} m²`],['Total flux',`${fmt(e*area)} V·m`]);caption='A closed sphere around one point charge. The ellipse indicates a three-dimensional surface.';
 } else if(scene==='cone') {
  const a=s.a,b=s.outer,alpha=s.alpha*Math.PI/180,f=coneFlux(s.q*NC,a,b,alpha);
  const shift=p=>[p[0]-1.9,p[1],0],polar=(r,t)=>shift([r*Math.cos(t),r*Math.sin(t)]);
  const lowA=polar(a,-alpha),lowB=polar(b,-alpha),highA=polar(a,alpha),highB=polar(b,alpha);
  body=charge([-1.9,0,0],s.q,'q outside')+line([-1.9,0],lowA,'construction')+line([-1.9,0],highA,'construction')+line(lowA,lowB)+line(highA,highB);
  body+=poly(Array.from({length:51},(_,i)=>polar(a,-alpha+2*alpha*i/50)),'inner-cap')+poly(Array.from({length:51},(_,i)=>polar(b,-alpha+2*alpha*i/50)),'outer-cap');
  for(let t of [-alpha*.7,0,alpha*.7])body+=arrow(polar(1.35,t),[Math.cos(t),Math.sin(t),0]);
  body+=arrow(polar(a,0),[-1,0,0],'probe-vector',.42)+arrow(polar(b,0),[1,0,0],'probe-vector',.42)+text(-1.9+a,-1.3,'inner cap: −','label','text-anchor="middle"')+text(-1.9+b,-1.3,'outer cap: +','label','text-anchor="middle"')+text(-.35,1.65,'Radial walls: E · n = 0','label','text-anchor="middle"');
  out=metrics(['Inner flux',`${fmt(f.inner)} V·m`],['Outer flux',`${fmt(f.outer)} V·m`],['Total flux','0 V·m']);caption=`Spherical caps subtend the same solid angle Ω = ${fmt(f.omega)} sr. Blue arrows are outward surface normals.`;
 } else if(scene==='gauss') {
  const cs=[{q:2*NC,p:[-.45,0,0]},{q:-NC,p:[s.x,0,0]}],near=Math.abs(s.x-s.r)<1e-8,flux=near?NaN:enclosedFlux(cs,s.r);
  body=circle([0,0],s.r,'gaussian')+`<ellipse cx="300" cy="202" rx="${s.r*drawingScale}" ry="${s.r*drawingScale*.26}" class="construction"/>`+charge(cs[0].p,2,'+2 nC')+charge(cs[1].p,-1,'−1 nC');
  for(let i=0;i<16;i++){const a=2*Math.PI*i/16,p=[s.r*Math.cos(a),s.r*Math.sin(a),0]; if(norm(p.map((v,j)=>v-cs[1].p[j]))>.13)body+=arrow(p,field(cs,p),'vector',.26)}
  body+=text(0,2.3,'Closed Gaussian sphere','label','text-anchor="middle"');
  out=metrics(['Qinside',near?'On boundary':`${s.x<s.r?1:2} nC`],['Total flux',near?'Not evaluated':`${fmt(flux)} V·m`],['Negative charge',near?'On the surface':s.x<s.r?'Inside':'Outside']);caption='Arrows show the actual total field direction on a spherical cross-section. Flux uses the full three-dimensional surface.';
 } else if(scene==='sphere') {
  const {q,e}=sphereOutside(s.q*NC,s.a,s.R);
  body=circle([0,0],s.a,'uniform-sphere')+circle([0,0],s.R,'gaussian')+`<ellipse cx="300" cy="202" rx="${s.R*drawingScale}" ry="${s.R*drawingScale*.26}" class="construction"/>`+line([0,0],[s.a*Math.cos(.9),s.a*Math.sin(.9)],'dimension')+text(.18,.6,'a','label')+line([0,0],[s.R,0],'dimension')+probe([s.R,0,0])+arrow([s.R,0,0],[1,0,0],'probe-vector')+text(s.R/2,-.23,'R','label','text-anchor="middle"')+text(-.25,-.3,'ρ','large-equation')+text(0,2.35,'Uniform charge sphere inside S','label','text-anchor="middle"');
  out=metrics(['Source radius a',`${fmt(s.a)} m`],['Enclosed charge Q',`${fmt(q/NC)} nC`],['Exterior |E(R)|',`${fmt(e)} N/C`]);caption='Fig. 4-11 configuration: a concentric Gaussian sphere with R > a. The source is a continuous charge distribution.';
 } else if(scene==='point') {
  const cs=qpoint(s),p=[s.r*Math.cos(s.angle*Math.PI/180),s.r*Math.sin(s.angle*Math.PI/180),0];
  if(s.contours)for(let level of [3,6,9,12,15]){const r=K*s.q*NC/level;if(r<3.5)body+=circle([0,0],r,'equipotential')+text(-r-.03,0.09,`${level} V`,'contour-label','text-anchor="end"')}
  if(s.lines)for(let i=0;i<16;i++){const a=2*Math.PI*i/16,u=[Math.cos(a),Math.sin(a),0];body+=line(u.map(v=>v*.13),u.map(v=>v*3.4),'line')+arrow(u.map(v=>v*2.55),u,'vector',.32)}
  const e=field(cs,p),t=[-e[1],e[0],0];
  body+=charge([0,0,0],s.q,'q')+'<g data-motion>'+probe(p)+arrow(p,e,'probe-vector')+line(unit(t).map((v,i)=>p[i]-v*.3),unit(t).map((v,i)=>p[i]+v*.3),'tangent')+'</g>';
  out=metrics(['φ(P)',`${fmt(potential(cs,p))} V`],['|E(P)|',`${fmt(norm(e))} N/C`],['E · unit tangent','0 N/C']);caption='Solid curves follow E. Dashed curves are equipotential spheres cut by the drawing plane.';probePoint=p;
 } else if(scene==='dipole') {
  const cs=dipole(s.q*NC,s.separation),p=[s.x,s.y,0];
  const cacheKey=[s.q,s.separation,s.lines,s.contours].join(':');
  if(dipoleCache.has(cacheKey))body=dipoleCache.get(cacheKey);else{
  if(s.contours){for(const level of [-15,-9,-6,-3,3,6,9,15])body+=joinContourSegments(contourSegments(cs,level)).map(path=>poly(path,'equipotential')).join('');body+=line([0,-2.5],[0,2.5],'zero-contour')+text(.1,-2.35,'φ = 0','contour-label');}
  if(s.lines)for(let i=0;i<24;i++){const a=2*Math.PI*(i+.5)/24,start=[cs[1].p[0]+.10*Math.cos(a),.10*Math.sin(a),0],path=traceLine(cs,start);body+=poly(path);for(const j of [35,95,165])if(path[j]&&path[j+1])body+=arrow(path[j],field(cs,path[j]),'vector',.13)}
  // Add the outer branches that enter from beyond the left edge. A trace from
  // the positive source alone cannot show these after it leaves the viewport.
  if(s.lines)for(let i=0;i<24;i++){
    const a=2*Math.PI*(i+.5)/24,start=[cs[0].p[0]+.10*Math.cos(a),.10*Math.sin(a),0],path=traceLine(cs,start,-1);
    const end=path.at(-1);
    if(norm(end.map((v,j)=>v-cs[1].p[j])) < .13)continue; // Already represented by a connecting trace.
    body+=poly(path);for(const j of [35,95,165])if(path[j])body+=arrow(path[j],field(cs,path[j]),'vector',.13);
  }
  body+=charge(cs[0].p,-s.q,'−q')+charge(cs[1].p,s.q,'+q');
  if(dipoleCache.size>=8)dipoleCache.delete(dipoleCache.keys().next().value);dipoleCache.set(cacheKey,body);
  }
  const near=cs.some(c=>norm(p.map((v,i)=>v-c.p[i]))<.14),e=near?[NaN,NaN,NaN]:field(cs,p);
  if(!near){const u=unit(e),t=[-u[1],u[0],0];body+='<g data-motion>'+probe(p)+arrow(p,e,'probe-vector',.5)+line(t.map((v,i)=>p[i]-v*.35),t.map((v,i)=>p[i]+v*.35),'tangent');
    const c=p.map((v,i)=>v+u[i]*.1+t[i]*.1);body+=poly([p.map((v,i)=>v+u[i]*.1),c,p.map((v,i)=>v+t[i]*.1)],'right-angle')+'</g>';}
  out=metrics(['φ(P)',near?'Point-charge region':`${fmt(potential(cs,p))} V`],['|E(P)|',near?'Masked':`${fmt(norm(e))} N/C`],['E ⟂ equipotential',near?'Probe too close':'90° (analytic)']);
  caption='Fig. 4-13 configuration. Solid: total field lines. Dashed: total potential contours. Blue: field at P. Click to move P.';probePoint=p;
 }
 return {svg:diagramContext(wrap(body,caption),scene),metrics:out,caption,probePoint};
}
