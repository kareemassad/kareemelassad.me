// Local authored geometry only. No provider markup or executable functions.
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function primitivesSVG(shapes){
 return shapes.map(s=>{
  if(s.type==='text')return `<text x="${s.at[0]}" y="${s.at[1]}" text-anchor="middle" class="label">${escape(s.text)}</text>`;
  if(s.type==='circle')return `<circle cx="${s.at[0]}" cy="${s.at[1]}" r="${s.radius}" fill="none" stroke="#91a8b8" stroke-width="1.2"/>`;
  if(s.type==='point')return `<circle cx="${s.at[0]}" cy="${s.at[1]}" r="${s.probe?4:2.5}" class="probe-dot"/>`;
  if(s.type==='segment'||s.type==='arrow'){
   if(s.visible===false)return '';const [x,y]=s.from,[u,v]=s.to,angle=Math.atan2(v-y,u-x),head=5;
   return `<path d="M${x} ${y}L${u} ${v}${s.type==='arrow'?`M${u-head*Math.cos(angle-.5)} ${v-head*Math.sin(angle-.5)}L${u} ${v}L${u-head*Math.cos(angle+.5)} ${v-head*Math.sin(angle+.5)}`:''}" class="${s.type==='arrow'?'probe-vector':s.style==='axis'?'dimension':'construction'}${['normal','background','sample-field'].includes(s.style)?' boundary-'+s.style:''}"${['normal','background','sample-field'].includes(s.style)?` fill="none" stroke="${s.style==='sample-field'?'#a3784b':s.style==='normal'?'#6a879e':'#b3c1ca'}" stroke-width="${s.style==='background'?.8:1.4}"`: ""}/>`;
  }
  if(s.type==='curve'){
   let open=false,path='';for(const [x,y] of s.points){if(!Number.isFinite(x)||!Number.isFinite(y)){open=false;continue;}path+=(open?'L':'M')+x+' '+y;open=true;}
   return `<path d="${path}" fill="none" stroke="${s.style==='blue-curve'?'#6a879e':s.style==='gold-curve'?'#a3784b':s.style==='field'?'#24272b':s.style==='patch'?'#6a879e':'#b3c1ca'}" stroke-width="${['field','blue-curve','gold-curve'].includes(s.style)?1.4:.8}"${['reference','gold-curve'].includes(s.style)?' stroke-dasharray="4 4"':''}/>`;
  }
  throw Error('Unsupported authored SVG primitive.');
 }).join('');
}
