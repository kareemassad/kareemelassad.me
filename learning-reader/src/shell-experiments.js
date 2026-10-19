import {K,NC} from './physics.js';
export const shellExperimentNames=['shell-power-law','null-comparison','charge-sampling'];
const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(3));
// Uniform prescribed shell, not a conductor. Reference length equals shell radius.
// dE = (K dq / R²) (R/d)^p unit(P-source); field is relative to KQ/R².
export function shellPowerField(r,p){
 if(!Number.isFinite(r)||!Number.isFinite(p)||r<0||r>.85||p<1||p>3)throw Error('Invalid counterfactual shell parameters.');
 if(r===0||p===2)return 0;
 if(r<1e-4)return (2-p)*r/3;
 const lo=Math.log1p(-r),delta=Math.log1p(r)-lo;
 const integral=v=>Math.abs(v)<1e-12?delta:Math.exp(v*lo)*Math.expm1(v*delta)/v;
 return ((r*r-1)*integral(1-p)+integral(3-p))/(4*r*r);
}
export function drawShellPower(s){
 const value=shellPowerField(s.r,s.b),reference=K*s.q*NC/(s.a*s.a),px=130+s.r*90;
 const points=Array.from({length:86},(_,i)=>({r:i/100,v:shellPowerField(i/100,s.b)})),max=Math.max(.35,...points.map(x=>Math.abs(x.v)))*1.1;
 const gx=r=>330+r/.85*215,gy=v=>190-v/max*96;
 let body='<text x="300" y="32" text-anchor="middle" class="label">COUNTERFACTUAL DECAY LAW · UNIFORM POSITIVE SHELL</text><circle cx="130" cy="180" r="90" fill="white" stroke="#91a8b8" stroke-width="1.2"/>';
 for(let i=0;i<8;i++){const t=i*Math.PI/4;body+=`<text x="${130+102*Math.cos(t)}" y="${184+102*Math.sin(t)}" text-anchor="middle" class="label">+</text>`;}
 body+=`<circle cx="130" cy="180" r="2" fill="#9aa9b5"/><text x="120" y="199" class="label">C</text><circle cx="${px}" cy="180" r="3.5" class="probe-dot"/><text x="${px+5}" y="165" class="label">${s.r===0?'P = C':'P'}</text>`;
 if(Math.abs(value)>1e-10){const end=px+Math.sign(value)*34,back=end-Math.sign(value)*6;body+=`<path d="M${px} 180H${end}L${back} 177M${end} 180L${back} 183" class="probe-vector"/>`;}
 body+=`<text x="130" y="302" text-anchor="middle" class="label">${value< -1e-10?'Inward':value>1e-10?'Outward':s.b===2?'Zero interior field':s.r===0?'Zero field at center':'Zero field at P'}</text><text x="130" y="323" text-anchor="middle" class="label">Plane slice · arrow length schematic</text><path d="M330 80V295M330 190H545" class="axis" stroke="#b6bfc6" fill="none"/><text x="330" y="68" class="label">Total radial E / Eref</text><text x="550" y="194" class="label">0</text><text x="330" y="312" class="label">0</text><text x="545" y="312" text-anchor="end" class="label">0.85 · |CP|/R</text><polyline points="${points.map(x=>gx(x.r)+','+gy(x.v)).join(' ')}" class="probe-vector"/><circle cx="${gx(s.r)}" cy="${gy(value)}" r="4" class="probe-dot"/><text x="430" y="345" text-anchor="middle" class="label">p = ${fmt(s.b)} · E(P)/Eref = ${fmt(value)}</text><text x="300" y="372" text-anchor="middle" class="label">dE = (K dq / R²) (R/d)ᵖ · direction from charge to P</text><text x="300" y="395" text-anchor="middle" class="label">Eref = KQ/R² · reference length R · no conductor redistribution</text>`;
 return {body,label:'The total interior field of a prescribed uniform positive shell under an illustrative inverse-power law',metrics:[{label:'Decay exponent p',value:fmt(s.b)},{label:'Total radial E / Eref',value:fmt(value)},{label:'Reference field Eref',value:fmt(reference)+' N/C'},{label:'Radial field at P',value:fmt(value*reference)+' N/C'}]};
}
export function nullInterval(m,u){
 if(!Number.isFinite(m)||!Number.isFinite(u)||Math.abs(m)>2||u<.05||u>1)throw Error('Invalid illustrative null interval.');
 return {lo:m-u,hi:m+u,zeroAllowed:Math.abs(m)<=u+1e-12,absoluteBound:Math.abs(m)+u};
}
export function drawNull(s){
 const z=nullInterval(s.b,s.sigma),x=v=>300+v*76;
 const body=`<text x="300" y="34" text-anchor="middle" class="label">NULL COMPARISON · ILLUSTRATIVE BOUNDED ERROR</text><text x="300" y="83" text-anchor="middle" class="label">Ideal inverse-square result: zero interior field</text><path d="M72 194H528M300 132V240" class="construction"/><text x="300" y="261" text-anchor="middle" class="label">Ideal zero</text><path d="M${x(z.lo)} 174V214M${x(z.lo)} 194H${x(z.hi)}M${x(z.hi)} 174V214" class="probe-vector"/><circle cx="${x(s.b)}" cy="194" r="5" class="probe-dot"/><text x="${x(s.b)}" y="117" text-anchor="middle" class="label">Observed residual m = ${fmt(s.b)}</text><text x="300" y="299" text-anchor="middle" class="large-equation">${z.zeroAllowed?'Zero remains allowed':'Zero lies outside the interval'}</text><text x="300" y="331" text-anchor="middle" class="label">If |measurement error| ≤ u, true residual lies in [m − u, m + u]</text><text x="300" y="357" text-anchor="middle" class="label">Then |true residual| ≤ |m| + u = ${fmt(z.absoluteBound)}</text><text x="300" y="389" text-anchor="middle" class="label">No detected residual does not establish exact zero.</text>`;
 return {body,label:'An illustrative error interval around a null measurement, with zero allowed or excluded under a stated bounded-error assumption',metrics:[{label:'Observed residual m',value:fmt(s.b)+' illustrative units'},{label:'Assumed error bound u',value:fmt(s.sigma)+' illustrative units'},{label:'Zero allowed?',value:z.zeroAllowed?'Yes':'No, if the error bound holds'}]};
}
export function samplingGeometry(){return {outerRadius:38,innerRadius:32,ballRadius:7,outsideCenter:45,insideCenter:25};}
export function drawChargeSampling(){
 const g=samplingGeometry();let body='<text x="300" y="30" text-anchor="middle" class="label">CHARGED HOLLOW CONDUCTOR · TWO INDEPENDENT TRIALS</text><text x="105" y="67" text-anchor="middle" class="label">1 · Touch</text><text x="300" y="67" text-anchor="middle" class="label">2 · Remove ball</text><text x="500" y="67" text-anchor="middle" class="label">3 · Touch meter</text>';
 for(const [inside,y] of [[false,139],[true,276]]){
  const cx=100,bx=cx+(inside?g.insideCenter:g.outsideCenter);
  body+=`<text x="36" y="${y-47}" class="label">${inside?'Inside contact':'Outside contact'}</text><circle cx="100" cy="${y}" r="38" fill="#eef3f5" stroke="#91a8b8"/><circle cx="100" cy="${y}" r="32" fill="white" stroke="#91a8b8"/><circle cx="${bx}" cy="${y}" r="7" fill="white" stroke="#293136"/><text x="65" y="${y+4}" class="label">+</text><path d="M170 ${y}H254M354 ${y}H440" class="construction"/><circle cx="300" cy="${y}" r="7" fill="white" stroke="#293136"/>${inside?'':`<text x="300" y="${y+4}" text-anchor="middle" class="label">+</text>`}<text x="300" y="${y+29}" text-anchor="middle" class="label">${inside?'No charge detected':'Charge carried'}</text><circle cx="500" cy="${y-53}" r="7" fill="white" stroke="#293136"/>${inside?'':`<text x="500" y="${y-49}" text-anchor="middle" class="label">+</text>`}<path d="M500 ${y-46}V${y-35}" stroke="#91a8b8"/><path d="M461 ${y+4}A39 39 0 0 1 539 ${y+4}" fill="none" stroke="#91a8b8"/><path d="M500 ${y+4}V${y-27}" class="construction"/><path d="M500 ${y+4}L${inside?500:523} ${inside?y-27:y-20}" class="probe-vector"/><circle cx="500" cy="${y+4}" r="3" class="probe-dot"/><text x="500" y="${y+29}" text-anchor="middle" class="label">${inside?'No visible deflection':'Deflection'}</text>`;
 }
 body+='<text x="300" y="342" text-anchor="middle" class="label">Reset meter + neutral ball for each trial · empty cavity</text><text x="300" y="365" text-anchor="middle" class="label">Ball locations and meter pointers are schematic.</text><text x="300" y="391" text-anchor="middle" class="label">The simple null gives a coarse bound, not proof of exact zero.</text>';
 return {body,label:'A static comparison of outside and inside charge sampling from a hollow conductor, followed by a qualitative electrometer reading',metrics:[]};
}
export function shellExperimentChecks(scene){
 if(scene==='charge-sampling'){const g=samplingGeometry();if(g.outsideCenter-g.ballRadius!==g.outerRadius||g.insideCenter+g.ballRadius!==g.innerRadius)throw Error('Contact geometry failed.');return {passed:true,method:'Static contact geometry only; qualitative outcomes require source and independent visual review',cases:2};}
 if(scene==='null-comparison'){let cases=0;for(const m of [-2,-.2,0,.2,2])for(const u of [.05,.2,1]){const z=nullInterval(m,u);if(z.absoluteBound!==Math.max(Math.abs(z.lo),Math.abs(z.hi))||z.zeroAllowed!==(z.lo<=1e-12&&z.hi>=-1e-12))throw Error('Null interval arithmetic failed.');cases++;}return {passed:true,method:'Interval arithmetic under an explicit bounded-error assumption; no calibration or confidence level',cases};}
 // Independent Simpson quadrature of the full shell angular integral.
 let cases=0,maxError=0;for(const r of [0,.15,.55,.85])for(const p of [1,1.5,2,2.5,3]){const n=20000,h=2/n,f=mu=>(r-mu)/(1+r*r-2*r*mu)**((p+1)/2);let sum=f(-1)+f(1);for(let i=1;i<n;i++)sum+=(i%2?4:2)*f(-1+i*h);const direct=sum*h/6,value=shellPowerField(r,p);maxError=Math.max(maxError,Math.abs(direct-value));if(p>2&&r>0&&value>=0||p<2&&r>0&&value<=0)throw Error('Shell power direction failed.');cases++;}
 if(maxError>2e-8)throw Error('Independent full-shell quadrature failed.');return {passed:true,method:'Independent full-shell angular quadrature, zero center, inverse-square cancellation and altered-power direction',cases,maxError};
}
