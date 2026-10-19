import {orbitalFlight,flightPosition,FLIGHT_LIMITS} from './orbital-flight-v1.js';
import {restoreFlight,persistFlight} from './flight-exploration.js';

export const flightStory = Object.freeze([
 {title:'A fall with a sideways start',text:'The launch gives the ball sideways speed. Gravity keeps turning its velocity toward Earth. With a slow launch, the ground gets in the way.',speed:.35},
 {title:'Faster sends it farther',text:'A faster launch carries the ball farther around the curved surface before it lands. It is still falling the whole time.',speed:.8},
 {title:'Keep falling. Keep missing.',text:'At circular speed, the path bends just as quickly as the surface curves away. The ball stays at one radius because it is continually falling around Earth.',speed:1},
 {title:'An orbit need not be a circle',text:'A little more speed lifts the far side of the orbit. Gravity slows the ball as it climbs and speeds it up as it comes back.',speed:1.15},
 {title:'Enough energy to leave',text:'At the escape threshold, the ball can keep moving outward without another push. That threshold is √2 times the circular speed at the same launch height.',speed:Math.SQRT2}
]);
const mounted=new WeakMap();
const labels={impact:'Meets the surface',circular:'Circular orbit',elliptical:'Bound elliptical orbit',parabolic:'Escape threshold',escape:'Unbound flight'};
const element=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const pathOf=(points,scale,cx=300,cy=204)=>points.map((p,i)=>(i?'L':'M')+(cx+p.x*scale).toFixed(2)+' '+(cy-p.y*scale).toFixed(2)).join(' ');
const defaults=()=>({speed:.35,phase:0,trace:0,moving:!matchMedia('(prefers-reduced-motion: reduce)').matches,compare:true,straight:false});

export function flightControls(container,passage,state,apply){
 const controls=element('section');controls.className='flight-controls';controls.setAttribute('aria-label','Explore the flight');
 const row=element('div');row.className='flight-actions';
 const play=element('button');play.type='button';play.dataset.flightPlay='';play.addEventListener('click',()=>apply({moving:!state.moving,trace:state.trace>=1?0:state.trace}));
 const restart=element('button','Launch again');restart.type='button';restart.addEventListener('click',()=>apply({trace:0,moving:true}));row.append(play,restart);
 const sliderLabel=element('label','Launch speed');sliderLabel.className='flight-speed-label';const out=element('output');out.dataset.flightSpeed='';
 const slider=element('input');slider.type='range';Object.assign(slider,{min:0,max:1.65,step:.01,value:state.speed});slider.setAttribute('aria-label','Launch speed relative to circular speed');slider.dataset.flightControl='speed';slider.addEventListener('input',()=>apply({speed:Number(slider.value),trace:0,moving:true}));sliderLabel.append(out,slider);
 const presets=element('div');presets.className='flight-presets';
 for(const [label,speed] of [['Slow shot',.35],['Orbit',1],['Faster',1.15],['Escape',Math.SQRT2]]){const b=element('button',label);b.type='button';b.dataset.flightPreset=speed;b.addEventListener('click',()=>apply({speed,trace:0,moving:true}));presets.append(b);}
 const toggles=element('div');toggles.className='flight-toggles';for(const [key,label] of [['compare','Earlier launches'],['straight','Without gravity']]){const l=element('label'),input=element('input');input.type='checkbox';input.checked=state[key];input.dataset.flightControl=key;input.addEventListener('change',()=>apply({[key]:input.checked}));l.append(input,document.createTextNode(label));toggles.append(l);}
 controls.append(row,sliderLabel,presets,toggles);container.append(controls);container.hidden=false;syncFlightControls(container,state);
}
export function syncFlightControls(container,state){
 const play=container.querySelector('[data-flight-play]');if(play){play.textContent=state.moving?'Pause flight':state.trace>=1?'Replay flight':'Play flight';play.setAttribute('aria-pressed',String(state.moving));}
 const out=container.querySelector('[data-flight-speed]');if(out)out.textContent=state.speed.toFixed(Math.abs(state.speed-Math.SQRT2)<1e-10?3:2)+' × circular speed';
 for(const input of container.querySelectorAll('[data-flight-control]')){const key=input.dataset.flightControl;if(input.type==='checkbox')input.checked=state[key];else input.value=state[key];}
 for(const b of container.querySelectorAll('[data-flight-preset]'))b.setAttribute('aria-pressed',String(Math.abs(Number(b.dataset.flightPreset)-state.speed)<.005));
}
export function renderFlight(container,passage,state){
 let record=mounted.get(container);
 if(!record||!container.querySelector('.flight-scene')){
  container.innerHTML='<article class="flight-scene"><div class="flight-narrative"><span class="flight-kicker">A THOUGHT EXPERIMENT</span><h2></h2><p></p></div><svg viewBox="0 0 600 410" class="flight-diagram" role="img" aria-label="A sideways launch curves under gravity"><defs><radialGradient id="flight-earth-shade"><stop offset="0" stop-color="#edf1eb"/><stop offset="1" stop-color="#cdd9ce"/></radialGradient><clipPath id="flight-earth-clip"><circle cx="300" cy="204" r="78"/></clipPath><marker id="flight-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8z" fill="#385944"/></marker><marker id="flight-gravity-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L8 4L0 8z" fill="#9b6e4e"/></marker></defs><g data-flight-comparisons></g><g data-flight-time-marks></g><path data-flight-straight class="flight-straight"/><circle data-earth cx="300" cy="204" r="78" fill="url(#flight-earth-shade)"/><g data-earth-grid></g><path data-flight-path class="flight-path"/><path data-flight-trail class="flight-trail"/><path data-flight-velocity class="flight-velocity" marker-end="url(#flight-arrow)"/><path data-flight-gravity class="flight-gravity" marker-end="url(#flight-gravity-arrow)"/><circle data-launch cx="300" cy="122" r="3" class="flight-launch"/><circle data-ball cx="300" cy="122" r="5" class="flight-ball"/><text data-earth-label x="300" y="210" text-anchor="middle" class="flight-earth-label">Earth</text><text x="300" y="390" text-anchor="middle" class="flight-diagram-note"></text></svg><div class="flight-readouts" aria-live="off"><div><span>THIS LAUNCH</span><strong data-flight-kind></strong></div><div><span>LAUNCH ENERGY</span><strong data-flight-energy></strong></div><div><span>ESCAPE THRESHOLD</span><strong>1.414 × circular</strong></div></div><p class="flight-insight" role="status"></p><p class="flight-assumptions">One spherical Earth. No air, rotation, thrust, or other bodies. Launch height is 5% of Earth’s radius; height is exaggerated to make the geometry visible.</p></article>';
  record={key:'',flight:null,scale:78,phase:-1};mounted.set(container,record);
 }
 const phase=Math.max(0,Math.min(4,state.phase||0)),story=flightStory[phase];
 if(record.phase!==phase){container.querySelector('h2').textContent=story.title;container.querySelector('.flight-narrative p').textContent=story.text;record.phase=phase;}
 const key=state.speed+'|'+state.compare+'|'+state.straight;
 if(record.key!==key){
  if(record.flight?.invariants.speed!==state.speed){if(record.flight){state.trace=0;state.moving=!matchMedia('(prefers-reduced-motion: reduce)').matches;}record.flight=orbitalFlight(state.speed);}
  const f=record.flight;record.scale=Number.isFinite(f.invariants.apoapsis)?Math.min(116,155/Math.min(2.2,Math.max(1.35,f.invariants.apoapsis))):116;
  const visible=[];for(const point of f.points){visible.push(point);const sx=300+point.x*record.scale,sy=204-point.y*record.scale;if(sx<24||sx>576||sy<24||sy>365)break;}record.visibleFlight={...f,points:visible,duration:visible.at(-1).t};
  container.querySelector('[data-flight-time-marks]').innerHTML=Array.from({length:17},(_,i)=>flightPosition(record.visibleFlight,i/16)).map(p=>'<circle cx="'+(300+p.x*record.scale)+'" cy="'+(204-p.y*record.scale)+'" r="1.6"/>').join('');
  const scale=record.scale,earth=container.querySelector('[data-earth]');earth.setAttribute('r',scale);container.querySelector('#flight-earth-clip circle').setAttribute('r',scale);
  container.querySelector('[data-earth-grid]').innerHTML='<ellipse cx="300" cy="204" rx="'+(scale*.42)+'" ry="'+scale+'"/><ellipse cx="300" cy="204" rx="'+scale+'" ry="'+(scale*.32)+'"/><path d="M'+(300-scale)+' 204H'+(300+scale)+' M300 '+(204-scale)+'V'+(204+scale)+'"/>';
  container.querySelector('[data-earth-label]').setAttribute('y',204+scale*.5);container.querySelector('[data-launch]').setAttribute('cy',204-FLIGHT_LIMITS.launchRadius*scale);
  container.querySelector('[data-flight-path]').setAttribute('d',pathOf(record.visibleFlight.points,scale));
  container.querySelector('[data-flight-comparisons]').innerHTML=state.compare?[.35,.8,1].filter(v=>v<state.speed-.01).map(v=>'<path d="'+pathOf(orbitalFlight(v).points,scale)+'" class="flight-comparison"/>').join(''):'';
  container.querySelector('[data-flight-straight]').setAttribute('d',state.straight?'M300 '+(204-FLIGHT_LIMITS.launchRadius*scale)+'H565':'');
  container.querySelector('[data-flight-kind]').textContent=labels[f.invariants.kind];
  container.querySelector('[data-flight-energy]').textContent=Math.abs(f.invariants.energy)<1e-10?'Zero · just unbound':f.invariants.energy<0?'Negative · gravitationally bound':'Positive · unbound';
  container.querySelector('.flight-diagram-note').textContent=record.visibleFlight.points.length<f.points.length?'This path continues beyond the view. Energy determines whether it returns.':'Dots: equal time within this flight. Arrows: velocity (green), gravity (brown).';
  record.key=key;
 }
 const f=record.visibleFlight,p=flightPosition(f,state.trace),scale=record.scale,cx=300+p.x*scale,cy=204-p.y*scale;
 const ball=container.querySelector('[data-ball]');ball.setAttribute('cx',cx);ball.setAttribute('cy',cy);
 const nearest=f.points[Math.min(f.points.length-1,Math.round(state.trace*(f.points.length-1)))];
 const norm=Math.hypot(nearest.vx,nearest.vy)||1,radial=Math.hypot(p.x,p.y)||1;
 container.querySelector('[data-flight-gravity]').setAttribute('d','M'+cx+' '+cy+'l'+(-p.x/radial*28)+' '+(p.y/radial*28));
 container.querySelector('[data-flight-velocity]').setAttribute('d','M'+cx+' '+cy+'l'+(nearest.vx/norm*28)+' '+(-nearest.vy/norm*28));
 container.querySelector('[data-flight-trail]').setAttribute('d',pathOf(f.points.filter(point=>point.t<=p.t).concat(p),scale));
 const insight=container.querySelector('.flight-insight');
 const text=state.trace>=1&&f.stop==='impact'?'The ground ends this flight. Add speed and compare where it lands.':f.invariants.kind==='circular'?'Gravity is not switched off in orbit. It changes the direction of motion.':f.invariants.kind==='elliptical'?'Watch the spacing: motion is slowest far from Earth and fastest near it.':f.invariants.energy>=0?'Escaping does not mean gravity vanishes. The ball keeps slowing as it climbs.':'Sideways motion and inward acceleration act together.';
 if(insight.textContent!==text)insight.textContent=text;
}
export const orbitalFlightModel=Object.freeze({animated:true,defaults,controls:flightControls,render:renderFlight,syncControls:syncFlightControls,restore:restoreFlight,persist:persistFlight,advance:(state,dt)=>{if(state.moving){state.trace=Math.min(1,(state.trace||0)+dt/9000);if(state.trace>=1)state.moving=false;}}});
