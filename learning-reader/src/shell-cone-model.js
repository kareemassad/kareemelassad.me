import {K,NC} from './physics.js';
// Infinitesimal opposite cones at an interior point of a uniform spherical shell.
// Visible wedge widths are schematic; these ratios are differential limits.
export function shellConePair({q=1,a=1.6,r=.55,b=25}={}){
 if(![q,a,r,b].every(Number.isFinite)||q<=0||a<=0||r<0||r>=1||b<0||b>90)throw Error('Invalid interior shell-cone geometry.');
 const angle=b*Math.PI/180,p=r*a,u=[Math.cos(angle),Math.sin(angle)],projection=p*u[0],root=Math.sqrt(a*a-p*p+projection*projection),near=root-projection,far=root+projection,cosine=root/a;
 const sigma=q*NC/(4*Math.PI*a*a),fieldPerSolidAngle=K*sigma/cosine,areaRatio=(far/near)**2;
 return {u,p,near,far,cosine,areaRatio,chargeRatio:areaRatio,nearFieldPerSolidAngle:fieldPerSolidAngle,farFieldPerSolidAngle:fieldPerSolidAngle,fieldRatio:1,pairNet:0};
}
const fmt=n=>Number(n.toPrecision(3));
export function drawShellCone(s){
 const m=shellConePair(s),scale=112/s.a,c=[300,176],P=[c[0]+m.p*scale,c[1]],point=(distance,u=m.u)=>[P[0]+distance*scale*u[0],P[1]+distance*scale*u[1]],near=point(m.near),far=point(-m.far),xy=p=>p.map(n=>n.toFixed(3)).join(' ');
 const ends=(angle,sign)=>{const u=[Math.cos(angle),Math.sin(angle)],projection=m.p*u[0],root=Math.sqrt(s.a*s.a-m.p*m.p+projection*projection);return point(-projection+sign*root,u);};
 const theta=s.b*Math.PI/180,wide=.052,nearA=ends(theta-wide,1),nearB=ends(theta+wide,1),farA=ends(theta-wide,-1),farB=ends(theta+wide,-1);
 let body=`<text x="300" y="32" text-anchor="middle" class="label">UNIFORM SPHERICAL SHELL · INTERIOR P</text><circle cx="300" cy="176" r="112" fill="white" stroke="#91a8b8" stroke-width="1.2"/><path d="M${xy(P)}L${xy(nearA)}A112 112 0 0 1 ${xy(nearB)}Z M${xy(P)}L${xy(farA)}A112 112 0 0 1 ${xy(farB)}Z" fill="#f1f5f7" stroke="#a9bac7" stroke-width=".8"/><path d="M${xy(near)}L${xy(far)}" class="construction"/><path d="M${xy(nearA)}A112 112 0 0 1 ${xy(nearB)}M${xy(farA)}A112 112 0 0 1 ${xy(farB)}" fill="none" stroke="#6a879e" stroke-width="2"/>`;
 for(let n=0;n<8;n++){const t=n*Math.PI/4;body+=`<text x="${300+123*Math.cos(t)}" y="${180+123*Math.sin(t)}" text-anchor="middle" class="label">+</text>`;}
 body+=`<circle cx="${P[0]}" cy="${P[1]}" r="3.5" class="probe-dot"/><text x="${P[0]+(s.r===0?12:-7)}" y="${P[1]-14}" class="label">${s.r===0?'P = C':'P'}</text>${s.r===0?'':'<circle cx="300" cy="176" r="1.8" fill="#9aa9b5"/><text x="290" y="194" class="label">C</text>'}<text x="${(near[0]+P[0])/2+8}" y="${(near[1]+P[1])/2-8}" class="label">r₁</text><text x="${(far[0]+P[0])/2-8}" y="${(far[1]+P[1])/2-8}" class="label">r₂</text><text x="${near[0]+19}" y="${near[1]-20}" class="label">ΔA₁</text><text x="${far[0]-40}" y="${far[1]-20}" class="label">ΔA₂</text>`;
 for(const sign of [-1,1]){const end=point(sign*42/scale),back=point(sign*36/scale),normal=[-m.u[1]*3,m.u[0]*3];body+=`<path d="M${xy(P)}L${xy(end)}L${xy([back[0]+normal[0],back[1]+normal[1]])}M${xy(end)}L${xy([back[0]-normal[0],back[1]-normal[1]])}" class="probe-vector"/><text x="${end[0]-m.u[1]*16}" y="${end[1]+m.u[0]*16}" text-anchor="middle" class="label">${sign<0?'E₁':'E₂'}</text>`;}
 body+=`<text x="300" y="318" text-anchor="middle" class="label">Plane slice · field arrow lengths are schematic</text><text x="300" y="339" text-anchor="middle" class="label">Same infinitesimal solid angle · visible wedges are schematic</text><text x="300" y="360" text-anchor="middle" class="label">ΔA₂ / ΔA₁ = Δq₂ / Δq₁ = r₂² / r₁² = ${fmt(m.areaRatio)}</text><text x="300" y="395" text-anchor="middle" class="large-equation">|E₂| / |E₁| = 1 · opposite directions</text>`;
 return {body,label:'Opposite infinitesimal cone patches cancel at an interior point of a uniform spherical shell under the inverse-square law',metrics:[{label:'Near distance r₁',value:fmt(m.near)+' m'},{label:'Far distance r₂',value:fmt(m.far)+' m'},{label:'Field magnitude ratio',value:'1'},{label:'Pair net field',value:'0 N/C'}]};
}
export function shellConeChecks(){
 let cases=0,maxResidual=0;for(const q of [.5,1,3])for(const a of [.8,1.6,2.4])for(const r of [0,.2,.55,.85])for(const b of [0,25,60,80]){
  const m=shellConePair({q,a,r,b}),x=r*a;
  // Independent sphere-intersection positions, surface normal incidence and charge/field ratios.
  const near=[x+m.near*m.u[0],m.near*m.u[1]],far=[x-m.far*m.u[0],-m.far*m.u[1]],c1=Math.abs((near[0]*m.u[0]+near[1]*m.u[1])/a),c2=Math.abs((far[0]*m.u[0]+far[1]*m.u[1])/a),area1=m.near**2/c1,area2=m.far**2/c2,E1=area1/m.near**2,E2=area2/m.far**2;
  const residual=Math.max(Math.abs(Math.hypot(...near)-a)/a,Math.abs(Math.hypot(...far)-a)/a,Math.abs(c1-c2),Math.abs(area2/area1-m.areaRatio)/m.areaRatio,Math.abs(E2/E1-1));maxResidual=Math.max(maxResidual,residual);cases++;
 }
 if(maxResidual>1e-12)throw Error('Shell-cone intersection or inverse-square cancellation check failed.');return {passed:true,method:'Independent sphere intersections, equal normal-incidence factors, differential patch charge ratios and opposite Coulomb vectors',cases,maxResidual};
}
