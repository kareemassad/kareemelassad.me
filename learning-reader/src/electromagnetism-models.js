import {EPS0,K,NC} from './physics.js';
import {LIGHT_SPEED} from './foundation-models.js';
export const ELEMENTARY_CHARGE=1.602176634e-19;
export const HBAR=6.62607015e-34/(2*Math.PI);
export const MU0=1/(EPS0*LIGHT_SPEED**2);
const C=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export const electromagnetismDefaults=Object.freeze({
 'charge-force':{r:1,a:1,b:-1},'charge-accounting':{r:999,a:1000},'neutral-pairs':{r:.7,a:.1,q:1,n:0},'quantum-confinement':{r:1},'nuclear-range':{n:6},
 'lorentz-force':{r:90,q:1,a:1,b:1,n:1},'relativistic-momentum':{r:.7},'field-superposition':{r:.3,a:1,b:-1,q:1,n:1},'field-lines':{r:.7,q:1},'electric-flux':{r:60,a:1,q:1},'generic-circulation':{r:.7,q:.8,n:0},
 'gauss-electric':{r:1,q:1,b:1},'faraday-loop':{r:.8,q:1,n:0},'magnetic-box':{a:1,q:1},'wire-force':{r:1,q:1,b:1,a:90},'wire-field':{r:.7,q:1,b:45},'parallel-currents':{r:.5,q:1,b:1},'coil-polarity':{r:0},'capacitor-surfaces':{r:1,q:1,a:1,b:0,n:0},'motional-emf':{r:1,b:1,a:1},'field-frame':{r:.5,q:1,a:1,b:1},'small-magnetic':{r:0,q:.03,a:1,b:.5}
});
export const electromagnetismNames=Object.freeze(Object.keys(electromagnetismDefaults));
export function electromagnetismControls(scene){switch(scene){
 case 'charge-force':return [C('r','Charge separation R',.3,2,.05,'m'),C('a','Left charge Q',-2,2,.1,'nC'),C('b','Right charge q',-2,2,.1,'nC')];
 case 'charge-accounting':return [C('r','Number of electrons',980,1020,1),C('a','Number of protons',980,1020,1)];
 case 'neutral-pairs':return [C('r','Group center separation R',.3,1,.025,'m'),C('a','Dipole charge separation d',.02,.15,.005,'m'),C('q','Charge magnitude',.5,1.5,.05,'nC'),C('n','Second dipole: aligned / reversed',0,1,1)];
 case 'quantum-confinement':return [C('r','Position standard deviation Δx',.25,2,.05,'nm')];
 case 'nuclear-range':return [C('n','Particles in the illustrative chain',3,12,1)];
 case 'lorentz-force':return [C('r','Velocity angle to +z',0,180,5,'°'),C('q','Test charge',-1,1,.1,'nC'),C('a','Electric field E_x',-2,2,.1,'V/m'),C('b','Magnetic field B_z',-2,2,.1,'mT'),C('n','Speed v',0,2,.1,'km/s')];
 case 'relativistic-momentum':return [C('r','Speed divided by c',0,.95,.01)];
 case 'field-superposition':return [C('r','Observation coordinate x',-.6,.6,.05,'m'),C('a','Source charge Q₁',-1.5,1.5,.1,'nC'),C('b','Source charge Q₂',-1.5,1.5,.1,'nC'),C('n','Test charge: absent / present',0,1,1),C('q','Test charge q',-1,1,.1,'nC')];
 case 'field-lines':return [C('r','Inner observation radius R',.4,1.2,.05,'m'),C('q','Point charge Q',.5,2,.1,'nC')];
 case 'electric-flux':return [C('r','Normal angle θ',-180,180,5,'°'),C('a','Patch area A',.2,2,.05,'m²'),C('q','Uniform electric field E_x',-2,2,.1,'V/m')];
 case 'generic-circulation':return [C('r','Loop radius R',.2,1.2,.05,'m'),C('q','Rotation coefficient ω',-1,1,.05,'m⁻¹'),C('n','Traversal CCW / CW',0,1,1)];
 case 'gauss-electric':return [C('r','Sphere radius R',.3,1.5,.05,'m'),C('q','Enclosed point charge Q',-2,2,.1,'nC'),C('b','Uniform external E_z',-2,2,.1,'V/m')];
 case 'faraday-loop':return [C('r','Stationary loop radius R',.2,1.2,.05,'m'),C('q','Uniform ∂B_z/∂t',-2,2,.1,'mT/s'),C('n','Path and normal: CCW +z / CW −z',0,1,1)];
 case 'magnetic-box':return [C('a','Top and bottom face area A',.2,2,.05,'m²'),C('q','Constant magnetic field B_z',-2,2,.1,'mT')];
 case 'wire-force':return [C('r','Segment length L',.2,2,.05,'m'),C('q','Conventional current I',-2,2,.1,'A'),C('b','Signed imposed field coefficient B',-2,2,.1,'mT'),C('a','Angle from +x to B',0,180,5,'°')];
 case 'wire-field':return [C('r','Observation radius R',.1,2,.05,'m'),C('q','Conventional current I along +z',-2,2,.1,'A'),C('b','Observation angle φ',0,360,5,'°')];
 case 'parallel-currents':return [C('r','Wire separation d',.1,1,.025,'m'),C('q','Left wire current I₁',-2,2,.1,'A'),C('b','Right wire current I₂',-2,2,.1,'A')];
 case 'coil-polarity':return [C('r','Comparison polarity: forward / reversed',0,1,1)];
 case 'capacitor-surfaces':return [C('n','Spanning surface: S₁ wire / S₂ gap',0,1,1),C('r','Elapsed charging time t',0,2,.1,'ms'),C('q','Charging current I',.1,2,.1,'mA'),C('a','Ideal plate area A',.5,2,.05,'m²'),C('b','Initial plate charge Q₀',0,2,.1,'µC')];
 case 'motional-emf':return [C('r','Rod velocity u_x',-2,2,.1,'m/s'),C('b','Uniform magnetic field B_z',-2,2,.1,'mT'),C('a','Directed rod length L along +y',.2,2,.05,'m')];
 case 'field-frame':return [C('r','Observer boost speed u/c along +y',0,.8,.02),C('q','Test charge at rest in lab',-1,1,.1,'nC'),C('a','Uniform lab field E_x',.2,2,.1,'V/m'),C('b','Lab event coordinate y',.5,2,.05,'m')];
 case 'small-magnetic':return [C('r','Fractional line-charge imbalance δ',0,.05,.002),C('q','Moving negative charge speed β=v/c',0,.1,.005),C('a','Negative lab line-density magnitude λ',.5,2,.1,'nC/m'),C('b','Wire separation d',.2,1,.05,'m')];
 default:throw Error('Unknown electromagnetism model.');}}
export function electromagnetismModel(scene,state){if(!electromagnetismNames.includes(scene))throw Error('Unknown electromagnetism model.');const s={...electromagnetismDefaults[scene],...state};for(const c of electromagnetismControls(scene))if(!Number.isFinite(s[c.key])||s[c.key]<c.min||s[c.key]>c.max||c.step===1&&!Number.isInteger(s[c.key]))throw Error('Invalid electromagnetism parameter: '+c.key);let m;const rad=s.r*Math.PI/180;
 if(scene==='charge-force')m={force:K*s.a*s.b*NC**2/s.r**2,profile:R=>K*s.a*s.b*NC**2/R**2};
 else if(scene==='charge-accounting')m={positive:s.a*ELEMENTARY_CHARGE,negative:-s.r*ELEMENTARY_CHARGE,net:(s.a-s.r)*ELEMENTARY_CHARGE,imbalance:s.a-s.r};
 else if(scene==='neutral-pairs'){const left=[{x:-s.a/2,q:s.q*NC},{x:s.a/2,q:-s.q*NC}],polarity=s.n?-1:1,right=[{x:s.r-s.a/2,q:polarity*s.q*NC},{x:s.r+s.a/2,q:-polarity*s.q*NC}],pairs=[];for(const B of right)for(const A of left){const dx=B.x-A.x;pairs.push({from:A.x,to:B.x,charges:[A.q,B.q],force:K*A.q*B.q*dx/Math.abs(dx)**3});}m={left,right,pairs,net:pairs.reduce((sum,p)=>sum+p.force,0)};}
 else if(scene==='quantum-confinement'){const dx=s.r*1e-9,dp=HBAR/(2*dx);m={dx,dp,product:dx*dp,positionVariance:dx*dx,momentumVariance:dp*dp,normalizedPosition:t=>Math.exp(-t*t/(2*s.r*s.r))/s.r,normalizedMomentum:t=>s.r*Math.exp(-t*t*s.r*s.r/2)};}
 else if(scene==='nuclear-range')m={repulsivePairs:s.n*(s.n-1)/2,neighborLinks:s.n-1,particles:Array.from({length:s.n},(_,i)=>i)};
 else if(scene==='lorentz-force'){const v=[s.n*1000*Math.sin(rad),0,s.n*1000*Math.cos(rad)],E=[s.a,0,0],B=[0,0,s.b*.001],electric=[s.q*NC*s.a,0,0],magnetic=[0,-s.q*NC*v[0]*B[2],0];m={v,E,B,electric,magnetic,force:electric.map((x,i)=>x+magnetic[i]),magneticPower:0};}
 else if(scene==='relativistic-momentum'){const gamma=1/Math.sqrt(1-s.r*s.r);m={beta:s.r,gamma,pOverMc:gamma*s.r,classicalOverMc:s.r,profile:beta=>beta/Math.sqrt(1-beta*beta)};}
 else if(scene==='field-superposition'){const P=[s.r,1],sources=[{at:[-1,0],Q:s.a*NC},{at:[1,0],Q:s.b*NC}],fields=sources.map(({at,Q})=>{const d=P.map((v,i)=>v-at[i]),r=Math.hypot(...d);return d.map(v=>K*Q*v/r**3);}),E=fields[0].map((v,i)=>v+fields[1][i]);m={P,sources,fields,E,force:s.n?E.map(v=>s.q*NC*v):null};}
 else if(scene==='field-lines')m={inner:K*s.q*NC/s.r**2,outer:K*s.q*NC/(2*s.r)**2};
 else if(scene==='electric-flux')m={normal:[Math.cos(rad),Math.sin(rad),0],density:s.q*Math.cos(rad),flux:s.q*Math.cos(rad)*s.a};
 else if(scene==='generic-circulation')m={orientation:s.n?-1:1,circulation:(s.n?-1:1)*2*Math.PI*s.q*s.r**2,field:([x,y])=>[-s.q*y,s.q*x]};
 else if(scene==='gauss-electric')m={radial:K*s.q*NC/s.r**2,chargeFlux:s.q*NC/EPS0,externalFlux:0,totalFlux:s.q*NC/EPS0,normalField:theta=>K*s.q*NC/s.r**2+s.b*Math.cos(theta)};
 else if(scene==='faraday-loop'){const derivative=s.q*.001,orientation=s.n?-1:1;m={derivative,orientation,area:Math.PI*s.r*s.r,fluxDerivative:orientation*derivative*Math.PI*s.r*s.r,circulation:-orientation*derivative*Math.PI*s.r*s.r,E:([x,y])=>[derivative*y/2,-derivative*x/2],tangentialAtR:-derivative*s.r/2};}
 else if(scene==='magnetic-box'){const B=s.q*.001;m={B,faceFluxes:[B*s.a,-B*s.a,0,0,0,0],total:0};}
 else if(scene==='wire-force'){const theta=s.a*Math.PI/180,B=[s.b*.001*Math.cos(theta),s.b*.001*Math.sin(theta),0];m={L:[s.r,0,0],B,current:s.q,force:[0,0,s.q*s.r*B[1]]};}
 else if(scene==='wire-field'){const phi=s.b*Math.PI/180,B=MU0*s.q/(2*Math.PI*s.r);m={B,vector:[-B*Math.sin(phi),B*Math.cos(phi),0],circulation:MU0*s.q,profile:R=>MU0*s.q/(2*Math.PI*R)};}
 else if(scene==='parallel-currents'){const force=MU0*s.q*s.b/(2*Math.PI*s.r);m={leftForce:force,rightForce:-force,B2AtLeft:[0,-MU0*s.b/(2*Math.PI*s.r),0],B1AtRight:[0,MU0*s.q/(2*Math.PI*s.r),0]};}
 else if(scene==='coil-polarity')m={polarity:s.r?-1:1,coilCurrent:s.r?-1:1,comparison:'Macroscopic orientation only; no microscopic spinning electron or calibrated field.'};
 else if(scene==='capacitor-surfaces'){const t=s.r*.001,I=s.q*.001,Q=s.b*1e-6+I*t,E=Q/(EPS0*s.a),displacement=I; m={t,I,Q,E,dEdt:I/(EPS0*s.a),wireConduction:I,wireDisplacement:0,gapConduction:0,gapDisplacement:displacement,selectedConduction:s.n===0?I:0,selectedDisplacement:s.n===0?0:I,selectedTotal:I,circulation:MU0*I};}
 else if(scene==='motional-emf'){const u=s.r,B=s.b*.001,L=s.a;m={u:[u,0,0],B:[0,0,B],L:[0,L,0],motionalField:[0,-u*B,0],emf:-u*B*L};}
 else if(scene==='field-frame'){const beta=s.r,gamma=1/Math.sqrt(1-beta*beta),E=s.a,q=s.q*NC,ep=gamma*E,bp=gamma*beta*E/LIGHT_SPEED,ve=-beta*LIGHT_SPEED,electric=q*ep,magnetic=q*ve*bp;m={beta,gamma,labE:[E,0,0],labB:[0,0,0],primeE:[ep,0,0],primeB:[0,0,bp],primeV:[0,ve,0],labForce:[q*E,0,0],primeElectric:[electric,0,0],primeMagnetic:[magnetic,0,0],primeForce:[q*E/gamma,0,0],labEvent:{ct:0,y:s.b},primeEvent:{ct:-gamma*beta*s.b,y:gamma*s.b},interval:-s.b*s.b,fieldInvariant:E*E};}
 else{const F0=(s.a*NC)**2/(2*Math.PI*EPS0*s.b),electric=s.r*s.r,magnetic=-s.q*s.q;m={F0,electric,magnetic,total:electric+magnetic,electricContributions:[(1+s.r)**2,-(1+s.r),-(1+s.r),1],electricForce:electric*F0,magneticForce:magnetic*F0,totalForce:(electric+magnetic)*F0};}
 return {...m,state:s};}

import {primitivesSVG} from './scene-primitives.js';
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString(),sci=n=>n===0?'0':n.toExponential(3),sign=n=>Math.abs(n)<1e-10?0:Math.sign(n);
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='field')=>({id,type:'arrow',from,to,style,visible:Math.hypot(to[0]-from[0],to[1]-from[1])>1e-9});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const samples=(f,N=100)=>Array.from({length:N+1},(_,i)=>f(i/N));
const readouts=(shapes,rows)=>rows.forEach((t,i)=>shapes.push(text('value-'+i,455,100+i*42,t)));
function graph(shapes,id,f,{xmin=-1,xmax=1,ymax=1,left=65,right=330,top=105,bottom=290,label=''}={}){const X=x=>left+(x-xmin)/(xmax-xmin)*(right-left),Y=y=>(top+bottom)/2-y/ymax*(bottom-top)/2;shapes.push(line(id+'-axis',[left,Y(0)],[right,Y(0)],'axis'),line(id+'-vertical',[left,top],[left,bottom],'axis'),curve(id+'-profile',samples(t=>{const x=xmin+t*(xmax-xmin);return[X(x),Y(f(x))];})),text(id+'-label',(left+right)/2,top-20,label),text(id+'-xmin',left,bottom+15,fmt(xmin)),text(id+'-xmax',right,bottom+15,fmt(xmax)),text(id+'-ymax',left-20,top,fmt(ymax)),text(id+'-ymin',left-20,bottom,fmt(-ymax)));return{X,Y};}
const zGlyph=n=>sign(n)>0?'⊙ +z':sign(n)<0?'⊗ −z':'0';
export function electromagnetismDefinition(scene,state){const m=electromagnetismModel(scene,state),s=m.state,shapes=[];let title,context,equation='em-'+scene;
 if(scene==='charge-force'){
  title='POINT CHARGES · SIGN AND INVERSE-SQUARE DISTANCE';context='Fixed electrostatic point charges · R>0 · no motion or material model';
  const x=120+75*s.r;shapes.push(point('left',[100,180]),point('right',[x,180]),text('Q',100,158,'Q='+fmt(s.a)+' nC'),text('q',x,211,'q='+fmt(s.b)+' nC'),line('separation',[100,240],[x,240]),text('R',(100+x)/2,257,'R='+fmt(s.r)+' m'),arrow('force',[x,180],[x+Math.sign(m.force)*40,180],'normal'));
  readouts(shapes,['Force on right charge = '+fmt(m.force*1e9)+' nN',m.force>0?'Rightward: repulsion':m.force<0?'Leftward: attraction':'No force in this model','F(2R) = F(R)/4','Arrow length shows direction only']);
 }else if(scene==='charge-accounting'){
  title='CHARGE ACCOUNTING · LARGE TERMS, SMALL NET';context='Authored proton/electron counts · Q=e(Np−Ne) · neutrality is not zero field everywhere';
  const base=190;shapes.push(arrow('positive',[90,base],[90+150*s.a/1020,base],'normal'),arrow('negative',[310,base+40],[310-150*s.r/1020,base+40],'sample-field'),text('protons',195,150,'Np='+s.a+' · each +e'),text('electrons',195,266,'Ne='+s.r+' · each −e'));
  readouts(shapes,['Q+ = '+sci(m.positive)+' C','Q− = '+sci(m.negative)+' C','Qnet = '+m.imbalance+' e','Qnet = '+sci(m.net)+' C','Small net charge can remain','Counts do not specify spatial fields']);
 }else if(scene==='neutral-pairs'){
  title='TWO NEUTRAL DIPOLES · SUM FOUR PAIR FORCES';context='Fixed classical charges · R>d>0 · aligned/reversed dipoles · no chemical-bond model';
  const positions=[100,140,250,290],charges=[...m.left,...m.right];charges.forEach((c,i)=>shapes.push(point('charge-'+i,[positions[i],205]),text('sign-'+i,positions[i],185,c.q>0?'+':'−')));m.pairs.forEach((p,i)=>{const left=m.left.findIndex(c=>c.x===p.from),right=m.right.findIndex(c=>c.x===p.to);shapes.push(curve('pair-'+i,[[positions[left],210],[190,245+i*12],[positions[right+2],210]],'reference'));});shapes.push(text('left-neutral',120,130,'Left: net Q=0'),text('right-neutral',270,130,'Right: net Q=0'),text('spacing',190,310,'Schematic spacing · R='+fmt(s.r)+' m · d='+fmt(s.a)+' m'));
  readouts(shapes,[...m.pairs.map((p,i)=>'Pair '+(i+1)+': '+fmt(p.force*1e9)+' nN'),'Net on right = '+fmt(m.net*1e9)+' nN',m.net<0?'Chosen orientation attracts':m.net>0?'Chosen orientation repels':'Zero in this state']);
 }else if(scene==='quantum-confinement'){
  title='QUANTUM CONFINEMENT · LINKED POSITION AND MOMENTUM SPREADS';context='Authored 1D minimum-uncertainty Gaussian · zero mean momentum · no atom or spectrum solver';
  graph(shapes,'position',x=>m.normalizedPosition(x)/Math.sqrt(2*Math.PI),{xmin:-5,xmax:5,ymax:2,top:96,bottom:178,label:'Position density (nm⁻¹) · x (nm)'});graph(shapes,'momentum',x=>m.normalizedMomentum(x)/Math.sqrt(2*Math.PI),{xmin:-5,xmax:5,ymax:1,top:232,bottom:314,label:'Momentum density · p/[ℏ/(2 nm)]'});
  readouts(shapes,['Δx = '+fmt(s.r)+' nm','Δp = '+sci(m.dp)+' kg m/s','Δx Δp = ℏ/2','Smaller Δx requires larger Δp','This state attains the lower bound']);
 }else if(scene==='nuclear-range'){
  title='RANGE OF INTERACTIONS · A QUALITATIVE COUNTING MODEL';context='Authored 1D particle chain · links only, no force magnitudes or nuclear stability prediction';
  const X=i=>65+i*260/(s.n-1);for(let i=0;i<s.n;i++){shapes.push(point('particle-'+i,[X(i),245]),text('proton-'+i,X(i),264,'+'));for(let j=i+1;j<s.n;j++)shapes.push(curve('repel-'+i+'-'+j,[[X(i),239],[(X(i)+X(j))/2,239-12-7*(j-i)],[X(j),239]],'reference'));if(i<s.n-1)shapes.push(line('bind-'+i,[X(i),282],[X(i+1),282],'normal'));}shapes.push(text('key',195,310,'All pairs: dashed · nearest-neighbor links: blue'));
  readouts(shapes,['Particles N = '+s.n,'Distinct repulsive pairs = '+m.repulsivePairs,'Nearest-neighbor links = '+m.neighborLinks,'Long range reaches distant pairs','Short range reaches nearby particles','No isotope, threshold or yield prediction']);
 }else if(scene==='lorentz-force'){
  title='LORENTZ FORCE · ONE LOCAL FIELD AND VELOCITY EVENT';context='E,B at the charge event · fixed sources · instantaneous force, no trajectory integration';
  const O=[175,205],F=m.force.map(x=>x*1e9);shapes.push(line('x-axis',[70,205],[315,205],'axis'),line('y-axis',[175,310],[175,100],'axis'),arrow('electric',O,[O[0]+22*m.electric[0]*1e9,O[1]],'normal'),arrow('magnetic',O,[O[0],O[1]-22*m.magnetic[1]*1e9],'sample-field'),arrow('total',O,[O[0]+22*F[0],O[1]-22*F[1]]),text('B-direction',175,90,'B: '+zGlyph(s.b)),text('velocity-z',175,320,'v_z='+fmt(m.v[2])+' m/s · +x projection '+fmt(m.v[0])+' m/s'));
  readouts(shapes,['Blue qE_x = '+fmt(m.electric[0]*1e9)+' nN','Gold (qv×B)_y = '+fmt(m.magnetic[1]*1e9)+' nN','Total F = ('+F.map(fmt).join(',')+') nN','v · F_B = 0 W','Parallel v and B: magnetic force zero','Reverse q: both force terms reverse']);
 }else if(scene==='relativistic-momentum'){
  title='RELATIVISTIC MOMENTUM · FORCE CHANGES γmv';context='m>0 · 0≤v<c · normalized momentum p/(mc) · no trajectory or mass calibration';
  const g=graph(shapes,'momentum',m.profile,{xmin:0,xmax:.95,ymax:3.1,label:'Blue: γv/c · gold: v/c'});shapes.push(curve('classical',samples(t=>[g.X(.95*t),g.Y(.95*t)]),'gold-curve'),point('momentum-value',[g.X(s.r),g.Y(m.pOverMc)]));
  readouts(shapes,['β=v/c = '+fmt(s.r),'γ = '+fmt(m.gamma),'p/(mc) = '+fmt(m.pOverMc),'mv/(mc) = '+fmt(s.r),'F = d(γmv)/dt','The two agree only as a low-speed limit']);
 }else if(scene==='field-superposition'){
  title='SOURCE FIELDS · ADD AT THE SAME OBSERVATION EVENT';context='Two fixed electrostatic sources at (±1,0)m · P=(x,1)m · ideal nonperturbing test charge';
  const X=([x,y])=>[185+65*x,250-65*y],P=X(m.P);m.sources.forEach((c,i)=>shapes.push(point('source-'+i,X(c.at)),text('source-charge-'+i,X(c.at)[0],275,'Q'+(i+1)+'='+fmt(c.Q/NC)+' nC')));shapes.push(point('observation',P),text('P',P[0],P[1]-18,'P'+(s.n?' · test q present':' · test q absent')));m.fields.forEach((v,i)=>shapes.push(arrow('component-'+i,P,[P[0]+5*v[0],P[1]-5*v[1]],i?'sample-field':'normal')));shapes.push(arrow('sum',P,[P[0]+5*m.E[0],P[1]-5*m.E[1]]));
  readouts(shapes,['E₁ = ('+m.fields[0].map(fmt).join(',')+') V/m','E₂ = ('+m.fields[1].map(fmt).join(',')+') V/m','E = E₁+E₂ = ('+m.E.map(fmt).join(',')+') V/m',s.n?'F=qE = ('+m.force.map(v=>fmt(v*1e9)).join(',')+') nN':'No test-charge force; E remains','Blue/gold: sources · black: sum']);
 }else if(scene==='field-lines'){
  title='FIELD ARROWS AND LINES · MAGNITUDE AND TANGENT';context='2D slice · normalized circles R,2R · shared E-arrow scale · gray line density uncalibrated';
  const O=[175,205];for(const R of [88,44])shapes.push({id:'circle-'+R,type:'circle',at:O,radius:R});for(let i=0;i<8;i++){const t=i*Math.PI/4,u=[Math.cos(t),-Math.sin(t)];shapes.push(line('field-line-'+i,O,[O[0]+120*u[0],O[1]+120*u[1]],'reference'));for(const [R,E,k]of[[44,m.inner,0],[88,m.outer,1]]){const P=[O[0]+R*u[0],O[1]+R*u[1]];shapes.push(arrow('field-'+i+'-'+k,P,[P[0]+.35*E*u[0],P[1]+.35*E*u[1]],'normal'));}}shapes.push(text('charge',175,205,'+'),text('key',175,315,'Gray: field-line tangents · blue: local E arrows'));
  readouts(shapes,['E(R) = '+fmt(m.inner)+' V/m','E(2R) = '+fmt(m.outer)+' V/m','E ratio = 4 · same arrow scale','Sphere area ratio = 4','Fixed line count: area density ×¼','Circumference ratio = 2 · density ×½','Gray lines: tangent sketch, not calibrated']);
 }else if(scene==='electric-flux'){
  title='ELECTRIC FLUX · SIGNED NORMAL COMPONENT';context='One uniform E=(E_x,0,0) V/m over a planar patch · area A is actual area';
  const O=[175,200];shapes.push(line('patch',[O[0]-55*m.normal[1],O[1]-55*m.normal[0]],[O[0]+55*m.normal[1],O[1]+55*m.normal[0]]),arrow('normal',O,[O[0]+70*m.normal[0],O[1]-70*m.normal[1]],'normal'),arrow('E',O,[O[0]+45*s.q,O[1]],'sample-field'),text('key',175,305,'Blue: chosen unit normal · gold: E'));
  readouts(shapes,['E · n = '+fmt(m.density)+' V/m','Area A = '+fmt(s.a)+' m²','Flux = '+fmt(m.flux)+' V m','Opposite normal reverses the sign','Tangent component contributes zero']);
 }else if(scene==='generic-circulation'||scene==='faraday-loop'){
  const faraday=scene==='faraday-loop',R=80,O=[170,200],orientation=faraday?m.orientation:m.orientation;title=faraday?'FARADAY LAW · A STATIONARY LOOP':'CIRCULATION · DIRECTED TANGENTIAL SUM';context=faraday?'Stationary circle · fixed schematic screen radius · uniform ∂B_z/∂t · no circuit current':'C=ω(−y,x,0) dimensionless · xy circle · fixed schematic screen radius · coordinates m';
  shapes.push({id:'loop',type:'circle',at:O,radius:R});for(let i=0;i<8;i++){const t=i*Math.PI/4,P=[O[0]+R*Math.cos(t),O[1]-R*Math.sin(t)],physical=[s.r*Math.cos(t),s.r*Math.sin(t)],v=faraday?m.E(physical):m.field(physical),scale=faraday?15000:30;shapes.push(arrow('field-'+i,P,[P[0]+scale*v[0],P[1]-scale*v[1]],'sample-field'));}shapes.push(arrow('path-direction',[250,200],[247,200-25*orientation],'normal'),text('orientation',170,309,orientation>0?'Path CCW · normal +z':'Path CW · normal −z'));
  readouts(shapes,faraday?['∂B_z/∂t = '+fmt(s.q)+' mT/s','dΦ_B/dt = '+fmt(m.fluxDerivative*1000)+' mV','∮E · dl = '+fmt(m.circulation*1000)+' mV','E_φ(R) = '+fmt(m.tangentialAtR*1000)+' mV/m','Reverse path and normal together','Conductor stays fixed']:['∮C · ds = '+fmt(m.circulation)+' m','C is dimensionless in this example','Reverse the path: reverse the sum','Arrows show field, not material flow']);
 }else if(scene==='gauss-electric'){
  title='GAUSS FLUX · ENCLOSED CHARGE AND EXTERNAL FIELD';context='Centered point Q plus uniform external E_z · R>0 · sphere symmetry only for charge part';
  const O=[170,185],R=75;shapes.push({id:'sphere',type:'circle',at:O,radius:R},text('charge',170,200,'Q'));for(let i=0;i<8;i++){const t=i*Math.PI/4,u=[Math.sin(t),-Math.cos(t)],P=[O[0]+R*u[0],O[1]+R*u[1]],E=[m.radial*u[0],m.radial*u[1]-s.b];shapes.push(arrow('field-'+i,P,[P[0]+.15*E[0],P[1]+.15*E[1]],'sample-field'));}shapes.push(arrow('external-field',[310,185],[310,185-20*s.b],'normal'),text('external-label',310,95,'External E_z = '+fmt(s.b)+' V/m'),text('external-scale',310,75,'External arrow: 20 px per V/m'),text('total-scale',170,300,'Surface arrows: total E · 0.15 px per V/m'),text('projection',170,315,'Plane slice of a closed 3D sphere'));
  readouts(shapes,['Charge radial E = '+fmt(m.radial)+' V/m','Charge flux Q/ε₀ = '+fmt(m.chargeFlux)+' V m','Uniform external flux = 0 V m','Total flux = '+fmt(m.totalFlux)+' V m','External E can be nonzero on the sphere','Background breaks total-field symmetry']);
 }else if(scene==='magnetic-box'){
  title='CLOSED MAGNETIC FLUX · NONZERO FIELD, ZERO SUM';context='Uniform B=(0,0,B_z) T · closed box · outward normals · no magnetic charge';
  shapes.push(curve('box',[[90,135],[240,135],[240,270],[90,270],[90,135]],'reference'),arrow('B',[210,205],[210,205-30*s.q],'sample-field'),arrow('top-normal',[165,135],[165,100],'normal'),arrow('bottom-normal',[165,270],[165,305],'normal'));
  readouts(shapes,['B_z = '+fmt(s.q)+' mT','Top flux = '+fmt(m.faceFluxes[0]*1000)+' mWb','Bottom flux = '+fmt(m.faceFluxes[1]*1000)+' mWb','Four side fluxes = 0','Closed sum = 0 Wb','Zero net flux does not mean zero B']);
 }else if(scene==='wire-force'){
  title='CURRENT SEGMENT · LOCAL MAGNETIC FORCE';context='Straight segment along +x · uniform imposed B in xy · conventional current · static example';
  const O=[170,200],theta=s.a*Math.PI/180;shapes.push(line('wire',[80,200],[270,200]),arrow('current',[135,200],[135+40*Math.sign(s.q),200]),arrow('B',O,[O[0]+45*s.b*Math.cos(theta),O[1]-45*s.b*Math.sin(theta)],'sample-field'),text('force-z',170,300,'F: '+zGlyph(m.force[2])),text('key',170,315,'Segment direction +x · B direction shown in plane'));
  readouts(shapes,['I = '+fmt(s.q)+' A','L = '+fmt(s.r)+' m','F_z = '+fmt(m.force[2]*1000)+' mN','F = I L × B','Parallel segment and B: no force','No hanging-wire deflection calibration']);
 }else if(scene==='wire-field'){
  title='LONG STRAIGHT WIRE · CONSTANT CIRCULATION';context='Stationary conventional current along +z · ideal long wire · R>0 outside its cross-section';
  const O=[135,190],R=35+30*s.r,t=s.b*Math.PI/180,P=[O[0]+R*Math.cos(t),O[1]-R*Math.sin(t)];shapes.push({id:'circle',type:'circle',at:O,radius:R},text('current',135,190,zGlyph(s.q)),point('observation',P),arrow('B',P,[P[0]-25*Math.sign(s.q)*Math.sin(t),P[1]-25*Math.sign(s.q)*Math.cos(t)],'normal'));
  const g=graph(shapes,'wire-profile',x=>m.profile(x)*1e6,{xmin:.1,xmax:2,ymax:4,left:280,right:535,top:110,bottom:242,label:'B_φ (µT) · radius R (m)'});shapes.push(point('B-probe',[g.X(s.r),g.Y(m.B*1e6)]),text('B-value',405,286,'B_φ = '+fmt(m.B*1e6)+' µT'),text('circulation-value',405,310,'2πR B_φ = μ₀I = '+sci(m.circulation)+' T m'),text('radius-value',135,305,'R='+fmt(s.r)+' m · directional B arrow'));
 }else if(scene==='parallel-currents'){
  title='TWO PARALLEL WIRES · FORCE ON EACH WIRE';context='Two long stationary currents along z · fixed separation d>0 · field from the other wire';
  const left=120,right=260;for(const [x,I,id]of[[left,s.q,'left'],[right,s.b,'right']])shapes.push(point('wire-'+id,[x,190]),text('I-'+id,x,170,zGlyph(I)));shapes.push(arrow('left-force',[left,225],[left+40*Math.sign(m.leftForce),225],'normal'),arrow('right-force',[right,225],[right+40*Math.sign(m.rightForce),225],'normal'),text('separation',190,280,'d='+fmt(s.r)+' m'));
  readouts(shapes,['Left F_x/length = '+fmt(m.leftForce*1e6)+' µN/m','Right F_x/length = '+fmt(m.rightForce*1e6)+' µN/m',m.leftForce>0?'Same-direction currents: attraction':m.leftForce<0?'Opposite currents: repulsion':'Zero current product: no force','Force arrows show direction only','Self-field is not used for own force']);
 }else if(scene==='coil-polarity'){
  title='COIL AND BAR MAGNET · MATCHED MACROSCOPIC POLARITY';context='Qualitative polarity comparison · no magnetization curve or literal spinning electron';
  shapes.push({id:'coil',type:'circle',at:[160,190],radius:60},arrow('coil-current',[220,190],[215,190-25*m.polarity],'normal'),text('coil-axis',160,190,'Axial field: '+zGlyph(m.polarity)),text('coil-label',160,285,'Viewed from +z · current '+(m.polarity>0?'CCW':'CW')),curve('bar',[[385,130],[465,130],[465,260],[385,260],[385,130]],'reference'),text('pole-top',425,145,m.polarity>0?'N':'S'),text('pole-bottom',425,245,m.polarity>0?'S':'N'),text('bar-label',425,285,'Side view: +z up · matched polarity'),text('spin-limit',300,320,'Microscopic spin needs quantum mechanics'));
 }else if(scene==='capacitor-surfaces'){
  title='AMPÈRE–MAXWELL · TWO SURFACES, ONE BOUNDARY';context='Ideal charging plates · negligible fringing · S₁ displacement neglected in this limit';
  shapes.push(line('wire',[80,190],[170,190]),line('left-plate',[170,145],[170,245]),line('right-plate',[225,145],[225,245]),arrow('charging-current',[95,190],[140,190],'normal'),arrow('gap-E',[180,210],[180+(m.E>0?35:0),210],'sample-field'),curve('wire-surface',[[105,150],[130,140],[140,190],[130,240],[105,230]],s.n===0?'field':'reference'),curve('gap-surface',[[105,150],[195,120],[200,190],[195,270],[105,230]],s.n===1?'field':'reference'),line('common-boundary',[105,150],[105,230],'normal'),text('S1',116,112,'S₁: crosses wire'),text('S2',255,280,'S₂: crosses gap'),text('same-loop',175,313,'Cross-sections · shared boundary Γ in blue'),text('Q',209,87,'Plate Q='+fmt(m.Q*1e6)+' µC'));
  readouts(shapes,['Selected '+(s.n===0?'S₁: wire crossing':'S₂: gap crossing'),'Icond = '+fmt(m.selectedConduction*1000)+' mA','Idisp = '+fmt(m.selectedDisplacement*1000)+' mA','Selected total = '+fmt(m.selectedTotal*1000)+' mA','E_gap = '+sci(m.E)+' V/m','Both surfaces: μ₀I = '+sci(m.circulation)+' T m']);
  shapes.push(text('time-vs-current',300,381,'Time changes Q and E · steady I keeps the circulation fixed'));
 }else if(scene==='motional-emf'){
  title='MOVING ROD · MAGNETIC MOTIONAL CONTRIBUTION';context='Directed straight rod +y · translation u_x · uniform B_z · no complete circuit or current prediction';
  shapes.push(line('rod',[170,110],[170,285]),arrow('rod-direction',[170,230],[170,175],'normal'),arrow('velocity',[170,205],[170+35*s.r,205]),text('B',170,90,'B: '+zGlyph(s.b)),arrow('motional',[220,205],[220,205+20*s.r*s.b],'sample-field'),text('key',175,315,'Rod: +y · black: u · gold: u × B'));
  readouts(shapes,['(u×B)_y = '+fmt(m.motionalField[1]*1000)+' mV/m','ε_{+y} = '+fmt(m.emf*1000)+' mV','ε = ∫(u×B) · dl','Positive charges respond along u×B','Electron force points oppositely','Resistance/circuit needed for current']);
 }else if(scene==='field-frame'){
  title='TWO INERTIAL FRAMES · TRANSFORM ALL LOCAL QUANTITIES';context='Lab test charge instantaneously at rest · primed observer moves +y at βc · uniform lab E_x';
  shapes.push(text('lab',145,78,'LAB · B=0'),text('prime',425,78,'PRIMED FRAME'),text('lab-E',145,104,'E_x='+fmt(s.a)+' V/m'),text('prime-E',425,104,'E′_x='+fmt(m.primeE[0])+' V/m'),arrow('lab-force',[135,155],[135+35*m.labForce[0]/NC,155],'normal'),arrow('prime-electric',[425,155],[425+35*m.primeElectric[0]/NC,155],'normal'),arrow('prime-magnetic',[425,190],[425+35*m.primeMagnetic[0]/NC,190],'sample-field'),text('force-key',300,225,'Blue: qE · gold: qv×B · common force scale (nN)'),text('prime-B',425,253,'B′_z='+sci(m.primeB[2])+' T'),text('prime-v',425,280,'v′_y=−βc'),text('lab-F',145,253,'F_x='+fmt(m.labForce[0]/NC)+' nN'),text('prime-F',425,308,'F′_x='+fmt(m.primeForce[0]/NC)+' nN = F_x/γ'),text('lab-event',145,280,'(ct,y)=(0,'+fmt(s.b)+') m'),text('prime-event',145,308,'(ct′,y′)=('+fmt(m.primeEvent.ct)+','+fmt(m.primeEvent.y)+') m'));
 }else{
  title='SMALL MAGNETIC TERMS · LARGE ELECTRIC TERMS CAN CANCEL';context='Two ideal long wires · prescribed lab densities +(1+δ)λ and −λ · negative charges move at βc';
  graph(shapes,'contributions',()=>0,{xmin:0,xmax:1,ymax:1.1,label:'All values normalized to F₀=λ²/(2πε₀d)'});const X=[105,170,235,300];m.electricContributions.forEach((value,i)=>shapes.push(line('component-'+i,[X[i],200],[X[i],200-value*70],i===0||i===3?'normal':'sample-field'),text('component-value-'+i,X[i],value>0?110:290,fmt(value))));
  readouts(shapes,['Net electrical term = δ² = '+fmt(m.electric),'Magnetic term = −β² = '+fmt(m.magnetic),'Total /F₀ = '+fmt(m.total),'F₀ = '+sci(m.F0)+' N/m','δ=0: exact symbolic electric cancellation','Normalized view; no 10⁻²⁵ subtraction']);
 }
 const c=electromagnetismControls(scene)[0],origin=65-c.min*210/(c.max-c.min),scale=210/(c.max-c.min);shapes.push(line('track',[65,357],[275,357],'axis'),point('probe',[origin+s[c.key]*scale,357],true),text('track-label',175,337,c.label+(c.units?' ('+c.units+')':'')),text('title',300,26,title),text('context',300,423,context),text('hint',300,445,'Drag the black control point · More controls below · ← / →: first control'));
 return {schemaVersion:1,scene,sourceScope:context,label:title,width:600,height:452,shapes,equations:[{id:equation,x:300,y:400}],probe:{id:'probe',parameter:c.key,origin,scale,min:c.min,max:c.max}};
}
export function drawElectromagnetism(scene,state){const d=electromagnetismDefinition(scene,state);return {body:primitivesSVG([...d.shapes.filter(p=>!['context','hint'].includes(p.id)),text('equation',300,400,electromagnetismEquations[d.equations[0].id].plain)]),metrics:[],label:d.label};}
export function electromagnetismChecks(scene){const states=[electromagnetismDefaults[scene]];for(const c of electromagnetismControls(scene))for(const value of [c.min,c.max])states.push({...electromagnetismDefaults[scene],[c.key]:value});for(const s of states){const m=electromagnetismModel(scene,s);if(!m.state)throw Error('Missing bounded state.');const d=electromagnetismDefinition(scene,s);if(new Set(d.shapes.map(x=>x.id)).size!==d.shapes.length)throw Error('Repeated geometry id.');}return {passed:true,states:states.length,method:'Bounded finite-state/topology checks; independent physics and source review required.'};}

// Original equations for local prepared assets. Providers cannot add code or TeX.
export const electromagnetismEquations=Object.freeze(Object.fromEntries(Object.entries({
 'charge-force':['F_R=K Qq/R²',String.raw`F_R=K\frac{Qq}{R^2}`],
 'charge-accounting':['Qnet=e(Np−Ne)',String.raw`Q_{\rm net}=e(N_p-N_e)`],
 'neutral-pairs':['F_Bx=Σpairs K Q_A q_B Δx/|Δx|³',String.raw`F_{B,x}=\sum_{A,B}KQ_Aq_B\frac{x_B-x_A}{|x_B-x_A|^3}`],
 'quantum-confinement':['Δx Δp≥ℏ/2; chosen Gaussian: equality',String.raw`\Delta x\,\Delta p\ge\frac{\hbar}{2}\qquad\text{chosen Gaussian: equality}`],
 'nuclear-range':['Pair count=N(N−1)/2; neighbor links=N−1',String.raw`N_{\rm pairs}=\frac{N(N-1)}2\qquad N_{\rm neighbor\ links}=N-1`],
 'lorentz-force':['F=q(E+v×B)',String.raw`\mathbf F=q(\mathbf E+\mathbf v\times\mathbf B)`],
 'relativistic-momentum':['p=γmv; F=dp/dt',String.raw`\mathbf p=\gamma m\mathbf v\qquad\mathbf F=\frac{d\mathbf p}{dt}`],
 'field-superposition':['E(P)=E₁(P)+E₂(P); F=qE(P)',String.raw`\mathbf E(P)=\mathbf E_1(P)+\mathbf E_2(P)\qquad\mathbf F=q\mathbf E(P)`],
 'field-lines':['E(2R)=E(R)/4',String.raw`E(2R)=\frac{E(R)}4`],
 'electric-flux':['Φ_E=(E · n)A',String.raw`\Phi_E=(\mathbf E\cdot\hat{\mathbf n})A`],
 'generic-circulation':['∮C · ds=±2πωR²',String.raw`\oint\mathbf C\cdot d\mathbf s=\pm 2\pi\omega R^2`],
 'gauss-electric':['∮E · n da=Q/ε₀',String.raw`\oint\mathbf E\cdot\hat{\mathbf n}\,da=\frac{Q}{\epsilon_0}`],
 'faraday-loop':['∮E · dl=−dΦ_B/dt',String.raw`\oint\mathbf E\cdot d\mathbf l=-\frac{d\Phi_B}{dt}`],
 'magnetic-box':['∮B · n da=0',String.raw`\oint\mathbf B\cdot\hat{\mathbf n}\,da=0`],
 'wire-force':['F=I L×B',String.raw`\mathbf F=I\mathbf L\times\mathbf B`],
 'wire-field':['B_φ=μ₀I/(2πR); 2πR B_φ=μ₀I',String.raw`B_\phi=\frac{\mu_0I}{2\pi R}\qquad2\pi R B_\phi=\mu_0I`],
 'parallel-currents':['F_left,x/length=μ₀I₁I₂/(2πd)',String.raw`\frac{F_{{\rm left},x}}{\ell}=\frac{\mu_0I_1I_2}{2\pi d}`],
 'coil-polarity':['Reverse coil current: reverse axial polarity',String.raw`I\to-I\quad\Longrightarrow\quad\text{axial polarity reverses}`],
 'capacitor-surfaces':['∮B · dl=μ₀(Icond+ε₀ dΦ_E/dt)',String.raw`\oint\mathbf B\cdot d\mathbf l=\mu_0\left(I_{\rm cond}+\epsilon_0\frac{d\Phi_E}{dt}\right)`],
 'motional-emf':['ε_{+y}=∫(u×B) · dl=−u_x B_z L',String.raw`\mathcal E_{+y}=\int(\mathbf u\times\mathbf B)\cdot d\mathbf l=-u_xB_zL`],
 'field-frame':['E′_x=γE_x; cB′_z=γβE_x; F′_x=F_x/γ',String.raw`E'_x=\gamma E_x\quad cB'_z=\gamma\beta E_x\quad F'_x=F_x/\gamma`],
 'small-magnetic':['Fnet/F₀=δ²−β²',String.raw`\frac{F_{\rm net}}{F_0}=\delta^2-\beta^2`]
}).map(([name,[plain,tex]])=>['em-'+name,{plain,tex}])));
