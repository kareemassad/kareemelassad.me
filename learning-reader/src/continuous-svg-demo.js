// Shared playback adapter for authored textbook scenes. Models own their data.
export const svgText=(x,y,value,cls='small',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${String(value).replaceAll('&','&amp;').replaceAll('<','&lt;')}</text>`;
export const smooth=t=>{const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v);};
let outgoing=null;
export function continuousSvgDemo({id,title,params,controls,draw,loopFrame,limits,duration=10}){
 return {id,title,params,controls,resetOn:Object.keys(params),camera:{mode:'2d',center:[0,0],height:12,width:18},create(ctx){
  const wrap=document.getElementById('canvas-wrap'),svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('ddia-scene');svg.setAttribute('viewBox','0 0 740 450');svg.setAttribute('role','img');svg.setAttribute('aria-label',title);wrap.append(svg);
  const status=document.createElement('p');status.className='ddia-result';const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent='Model assumptions';p.textContent=limits;details.append(summary,p);ctx.panel.append(status,details);
  // Inspection controls belong to playback, never to the domain model inputs.
  const transport=document.createElement('div');transport.className='ddia-inspect';
  const positionLabel=document.createElement('label');positionLabel.textContent='Inspect the animation';
  const seek=document.createElement('input');seek.type='range';seek.min='0';seek.max=String(duration-2);seek.step='.05';seek.value='0';seek.setAttribute('aria-label','Animation position');
  const progress=document.createElement('output');progress.className='ddia-inspect-position';
  const speedLabel=document.createElement('label');speedLabel.textContent='Speed';
  const speed=document.createElement('select');speed.setAttribute('aria-label','Animation speed');
  for(const [value,label]of [[.5,'½×'],[1,'1×']]){const option=document.createElement('option');option.value=String(value);option.textContent=label;speed.append(option);}speed.value='1';
  positionLabel.append(seek);speedLabel.append(speed);transport.append(positionLabel,progress,speedLabel);ctx.panel.prepend(transport);
  let playbackRate=1,timeOffset=0,inspection=null,pendingInspection=null;
  const controlRows=[...document.querySelectorAll('#controls > .ctl')];
  const syncVisibility=()=>{for(const [i,control]of controls.entries())if(control.visibleWhen&&controlRows[i])controlRows[i].hidden=!control.visibleWhen(ctx.params);};
  const pause=()=>{const button=document.getElementById('play');if(button?.getAttribute('aria-pressed')==='false')button.click();};
  seek.addEventListener('input',()=>{pause();inspection=Number(seek.value);timeOffset=inspection-ctx.time*playbackRate;old=null;elapsed=1;frame(ctx);});
  speed.addEventListener('change',()=>{const before=ctx.time*playbackRate+timeOffset;playbackRate=Number(speed.value);timeOffset=before-ctx.time*playbackRate;});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let old=document.getElementById('play')?.getAttribute('aria-pressed')!=='true'&&outgoing?.wrap===wrap&&performance.now()-outgoing.at<100?outgoing.svg:null,elapsed=0,current='';outgoing=null;
  function frame(ctx,dt=0){elapsed+=dt;
   syncVisibility();
   if(!reduced.matches&&document.getElementById('play')?.getAttribute('aria-pressed')==='false')inspection=null;
   const time=ctx.time*playbackRate+timeOffset,phase=inspection??(reduced.matches?duration-2:((time%duration)+duration)%duration),stable=reduced.matches&&inspection===null;
   const result=loopFrame?loopFrame(ctx.params,inspection??time,{reducedMotion:stable}):draw(ctx.params,Math.min(phase,duration-2));const blend=phase>duration-1?smooth(phase-duration+1):0;
   current=loopFrame?result.svg:`<g data-loop-phase="${phase.toFixed(3)}"><g opacity="${1-blend}">${result.svg}</g>${blend?`<g opacity="${blend}">${draw(ctx.params,0).svg}</g>`:''}${svgText(720,445,inspection!==null?'Inspecting':stable?'Stable view':blend?'Replay · same example':'Repeating example','tick','end')}</g>`;
   seek.value=String(Math.min(phase,duration-2));progress.textContent=blend?'Replay':Math.round(Math.min(phase/(duration-2),1)*100)+'%';
   const mix=reduced.matches?1:smooth(elapsed/.65);svg.innerHTML=old&&mix<1?`<g opacity="${1-mix}" aria-hidden="true">${old}</g><g opacity="${mix}">${current}</g>`:current;if(mix>=1)old=null;if(status.textContent!==result.result)status.textContent=result.result;
  }
  frame(ctx);return {frame,reset(){inspection=pendingInspection;timeOffset=inspection??0;pendingInspection=null;},onParams(){const paused=document.getElementById('play')?.getAttribute('aria-pressed')==='true';old=paused?null:current;pendingInspection=paused?inspection:null;elapsed=0;timeOffset=0;inspection=null;},dispose(){outgoing={wrap,svg:current,at:performance.now()};svg.remove();transport.remove();}};
 }};
}
