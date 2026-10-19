import {K,EPS0,NC} from './physics.js';
export const sphericalNames=['solid-sphere','spherical-shell'];
export function sphericalField(kind,q,radius,r){
 if(!sphericalNames.includes(kind)||![q,radius,r].every(Number.isFinite)||radius<=0||r<0)throw Error('Invalid spherical model.');
 if(kind==='spherical-shell'&&Math.abs(r-radius)<1e-10)return {field:null,enclosed:null,region:'surface excluded'};
 const inside=r<radius,enclosed=inside?(kind==='solid-sphere'?q*(r/radius)**3:0):q;
 return {field:r===0?0:K*enclosed/(r*r),enclosed,region:inside?'inside':'outside'};
}
const number=n=>Number(n.toPrecision(3));
export function drawSpherical(kind,s){
 const q=s.q*NC,R=s.a,r=s.r,result=sphericalField(kind,q,R,r),shell=kind==='spherical-shell',scale=28,cx=154,cy=176,chargeRadius=R*scale,probeX=cx+r*scale;
 const rho=3*q/(4*Math.PI*R**3),graphLeft=330,graphBottom=250,graphWidth=225,maxR=4.8,peak=K*q/R**2,graphHeight=137,px=t=>graphLeft+t/maxR*graphWidth,py=e=>graphBottom-e/peak*graphHeight;
 let body=`<circle cx="${cx}" cy="${cy}" r="${chargeRadius}" fill="${shell?'white':'#f1f5f7'}" stroke="#91a8b8" stroke-width="${shell?2:1}"/><circle cx="${cx}" cy="${cy}" r="2" fill="#96a3ae"/><text x="${cx}" y="66" text-anchor="middle" class="label">${shell?'UNIFORM THIN SHELL':'UNIFORM SOLID SPHERE'}</text><text x="${cx-chargeRadius*.55}" y="${cy-chargeRadius*.75}" class="label">R</text>`;
 let moving=`<circle cx="${cx}" cy="${cy}" r="${r*scale}" class="gaussian"/><line x1="${cx}" y1="${cy+6}" x2="${probeX}" y2="${cy+6}" class="dimension"/><circle cx="${probeX}" cy="${cy}" r="4" class="probe-dot"/><text x="${(cx+probeX)/2}" y="${cy+25}" text-anchor="middle" class="label">r</text>`;
 if(result.field!==null&&result.field>0){const arrow=result.field*1.5,head=Math.min(5,arrow*.4);moving+=`<path d="M${probeX} ${cy}h${arrow}l-${head}-${head*.6}m${head} ${head*.6}-${head} ${head*.6}" class="probe-vector"/>`;}
 body+=`<path d="M${graphLeft} 95V${graphBottom}H568" class="dimension"/><text x="${graphLeft}" y="77" class="label">E / E(R⁺)</text><text x="${graphLeft-15}" y="${py(peak)+4}" class="label">1</text><text x="575" y="${graphBottom+4}" class="label">r</text><line x1="${px(R)}" y1="100" x2="${px(R)}" y2="${graphBottom}" class="gaussian"/><text x="${px(R)}" y="${graphBottom+19}" text-anchor="middle" class="label">R</text>`;
 let path=`M${px(0)} ${py(0)}`;
 if(shell){path+=`L${px(R)} ${py(0)}`;body+=`<path d="${path}" class="vector"/><circle cx="${px(R)}" cy="${py(0)}" r="3" fill="white" stroke="#788894"/><circle cx="${px(R)}" cy="${py(peak)}" r="3" fill="white" stroke="#788894"/>`;path=`M${px(R)} ${py(peak)}`;}
 else path+=`L${px(R)} ${py(peak)}`;
 for(let i=1;i<=80;i++){const t=R+(maxR-R)*i/80;path+=`L${px(t)} ${py(K*q/t**2)}`;}
 body+=`<path d="${path}" class="vector"/>`;
 if(result.field!==null)moving+=`<circle cx="${px(r)}" cy="${py(result.field)}" r="4" class="probe-dot"/>`;
 body+=`<text x="154" y="327" text-anchor="middle" class="label">Gaussian sphere · plane cut</text><text x="${graphLeft+50}" y="299" class="label">${shell?'r &lt; R: E = 0':'r &lt; R: E = ρr / (3ε₀)'}</text><text x="${graphLeft+50}" y="324" class="label">r &gt; R: E = Q / (4πε₀r²)</text>`;
 moving+=`<text x="300" y="361" text-anchor="middle" class="large-equation">${result.field===null?'Surface excluded':number(result.field)+' N/C'}</text><text x="300" y="386" text-anchor="middle" class="label">${result.region.toUpperCase()} · r = ${number(r)} m · R = ${number(R)} m · ${shell?'Q = '+number(s.q)+' nC':'ρ = '+number(rho/NC)+' nC/m³'}</text>`;
 body+=`<g data-motion>${moving}</g>`;
 return {body,label:shell?'Uniform spherical shell: zero interior field and inverse-square exterior field':'Uniform solid sphere: linear interior field and inverse-square exterior field',metrics:[{label:'Electric field',value:result.field===null?'Surface excluded':number(result.field)+' N/C'},{label:'Enclosed charge',value:result.enclosed===null?'Surface excluded':number(result.enclosed/NC)+' nC'},{label:'Gaussian flux',value:result.enclosed===null?'Surface excluded':number(result.enclosed/EPS0)+' V·m'}]};
}
export function sphericalChecks(kind){
 let cases=0,maxFluxError=0;for(const q of [.5*NC,NC,3*NC])for(const radius of [.8,1.6,2.4])for(const ratio of [0,.25,.8,1,1.2,2]){
  const r=radius*ratio,m=sphericalField(kind,q,radius,r);if(m.field===null){if(kind!=='spherical-shell'||ratio!==1)throw Error('Incorrect excluded surface.');continue;}
  maxFluxError=Math.max(maxFluxError,Math.abs(4*Math.PI*r*r*m.field-m.enclosed/EPS0));if(kind==='spherical-shell'&&ratio<1&&m.field!==0)throw Error('Nonzero interior shell field.');cases++;
 }
 if(maxFluxError>1e-10)throw Error('Spherical flux invariant failed.');
 if(kind==='solid-sphere'){const q=NC,R=1.6,left=sphericalField(kind,q,R,R*(1-1e-8)).field,right=sphericalField(kind,q,R,R*(1+1e-8)).field;if(Math.abs(left-right)/(K*q/R**2)>4e-8)throw Error('Solid-sphere field is not continuous at its surface.');}
 return {passed:true,method:'Enclosed-charge Gauss flux; solid-sphere continuity or shell interior zero and excluded surface',cases,maxFluxError};
}
