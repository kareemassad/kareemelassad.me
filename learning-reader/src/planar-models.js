import {EPS0,NC,K} from './physics.js';
export const planarNames=['sheet-background','parallel-sheets'];
export function sheetWithBackground(sigma,b){
 if(![sigma,b].every(Number.isFinite))throw Error('Invalid sheet field.');
 const sheet=sigma/(2*EPS0);return {sheet,left:b-sheet,right:b+sheet,e1:b+sheet,e2:sheet-b};
}
export function parallelSheetField(sigma,a,x){
 if(![sigma,a,x].every(Number.isFinite)||a<=0)throw Error('Invalid parallel sheets.');
 if(Math.abs(Math.abs(x)-a)<1e-10)return {field:null,region:'surface excluded'};
 return {field:Math.abs(x)<a?sigma/EPS0:0,region:x< -a?'left outside':x>a?'right outside':'between'};
}
const n=value=>Number(value.toPrecision(3));
const arrow=(x,y,value,scale=.18)=>{if(Math.abs(value)<1e-10)return '';const length=value*scale,head=Math.sign(length)*Math.min(5,Math.abs(length)*.4);return `<path d="M${x} ${y}h${length}l${-head} -3m${head} 3l${-head} 3" class="probe-vector"/>`;};
export function drawPlanar(kind,s){
 const sigma=s.sigma*NC;
 if(kind==='sheet-background'){
  const m=sheetWithBackground(sigma,s.b);
  let body='<text x="300" y="40" text-anchor="middle" class="label">SHEET + UNIFORM BACKGROUND</text><path d="M278 91l44-28v222l-44 28z" fill="#f2f5f7" stroke="#91a8b8"/><path d="M190 140h215v105H190z" class="gaussian"/><text x="300" y="83" text-anchor="middle" class="label">+σ</text>';
  body+=`<text x="300" y="326" text-anchor="middle" class="label">Signed outward components · right E₁ · left E₂</text><text x="300" y="356" text-anchor="middle" class="large-equation">E₁ + E₂ = σ / ε₀</text><g data-motion><text x="300" y="380" text-anchor="middle" class="label">b = ${n(s.b)} N/C · σ = ${n(s.sigma)} nC/m²</text>`;
  for(const y of [140,193,246])body+=arrow(155,y,m.left)+arrow(440,y,m.right);
  body+=`<text x="155" y="289" text-anchor="middle" class="label">E₂ = ${n(m.e2)} N/C</text><text x="440" y="289" text-anchor="middle" class="label">E₁ = ${n(m.e1)} N/C</text></g>`;
  return {body,label:'An infinite uniform sheet with an illustrative uniform normal background field',metrics:[{label:'Right outward E₁',value:n(m.e1)+' N/C'},{label:'Left outward E₂',value:n(m.e2)+' N/C'},{label:'Outward sum',value:n(m.e1+m.e2)+' N/C'}]};
 }
 const a=s.a,x=s.r,left=300-a*55,right=300+a*55,m=parallelSheetField(sigma,a,x),field=sigma/EPS0;
 let body=`<text x="300" y="40" text-anchor="middle" class="label">TWO EQUAL AND OPPOSITE SHEETS</text><path d="M${left} 95v184M${right} 95v184" class="vector"/><text x="${left}" y="80" text-anchor="middle" class="label">+σ</text><text x="${right}" y="80" text-anchor="middle" class="label">−σ</text>`;
 for(const y of [140,195,250])body+=arrow(300-field*.09,y,field);
 body+=`<text x="97" y="205" text-anchor="middle" class="large-equation">0</text><text x="503" y="205" text-anchor="middle" class="large-equation">0</text><text x="300" y="304" text-anchor="middle" class="label">Between: σ / ε₀ · outside: 0</text><text x="300" y="327" text-anchor="middle" class="label">Field points from the positive sheet to the negative sheet</text><g data-motion><circle cx="${300+x*55}" cy="223" r="4" class="probe-dot"/><text x="300" y="362" text-anchor="middle" class="large-equation">${m.field===null?'Surface excluded':n(m.field)+' N/C'}</text><text x="300" y="388" text-anchor="middle" class="label">${m.region.toUpperCase()} · x = ${n(x)} m · sheets at ±${n(a)} m</text></g>`;
 return {body,label:'Two infinite parallel sheets with equal opposite surface charge, zero exterior field, and a uniform interior field',metrics:[{label:'Field at probe',value:m.field===null?'Surface excluded':n(m.field)+' N/C'},{label:'Between sheets',value:n(field)+' N/C'},{label:'Outside sheets',value:'0 N/C'}]};
}
export function planarChecks(kind){
 let cases=0,maxError=0;
 for(const sigma of [.5*NC,1.5*NC,3*NC]){
  if(kind==='sheet-background')for(const b of [-250,-80,0,80,250]){const m=sheetWithBackground(sigma,b);maxError=Math.max(maxError,Math.abs(m.e1+m.e2-sigma/EPS0));cases++;}
  else for(const a of [.8,1.2,2.4])for(const x of [-3.3,-a*.5,0,a*.5,3.3]){const exact=parallelSheetField(sigma,a,x),disk=(z,L)=>2*Math.PI*K*sigma*Math.sign(z)*(1-Math.abs(z)/Math.hypot(z,L)),finite=disk(x+a,1e7)-disk(x-a,1e7);maxError=Math.max(maxError,Math.abs(finite-exact.field)/(sigma/EPS0));cases++;}
 }
 if(maxError>(kind==='sheet-background'?1e-10:3e-7))throw Error('Planar field invariant failed.');
 return {passed:true,cases,maxError,method:kind==='sheet-background'?'Signed outward flux under positive and negative uniform background fields':'Independent finite-disk Coulomb limit for two opposite sheets'};
}
