import {learningModelFor as savedLearningModelFor,hasLearningModel} from './learning-models.js';
import {teachingModelFor} from './teaching-adapter-v1.js';
import {ReadingFollower} from './reading-plan.js';
import {readingPlanControls,updateReadingPlanControls} from './reading-plan-view.js';
import {chapter8AssemblyNames} from './chapter8-assembly-models.js';
import {chapter8ArgumentNames} from './chapter8-argument-models.js';
import {chapter8CrystalNuclearNames} from './chapter8-crystal-nuclear-models.js';
import {chapter8CapacitanceNames} from './chapter8-capacitance-models.js';
import {chapter8FieldNames} from './chapter8-field-models.js';
import {seriesNames} from './series-models.js';
import {openingContextANames} from './opening-context-a-models.js';
import {openingContextBNames} from './opening-context-b-models.js';
import {chapter8ExtensionNames} from './chapter8-extension-models.js';
import {openingExtensionNames} from './opening-extension-models.js';
import {molecularEmissionNames} from './molecular-emission-models.js';
import {conductorExtensionNames} from './conductor-extension-models.js';
const sourceExplorationNames=[...chapter8AssemblyNames,...chapter8ArgumentNames,...chapter8CrystalNuclearNames,...chapter8CapacitanceNames,...energyNames,...seriesNames,...openingContextANames,...openingContextBNames,...chapter8ExtensionNames,...chapter8FieldNames];
const extensionNames=[...chapter8AssemblyNames,...chapter8ArgumentNames,...chapter8CrystalNuclearNames,...chapter8CapacitanceNames,...seriesNames,...openingContextANames,...openingContextBNames,...chapter8ExtensionNames,...openingExtensionNames,...molecularEmissionNames,...conductorExtensionNames,...chapter8FieldNames];
import {dielectricNames,dielectricControls} from './dielectric-models.js';
import {sourceModelNames as chapter3Names,sourceModelReaderControls as chapter3ReaderControls} from './source-models.js';
import {boundaryNames} from './boundary-models.js';
import {energyNames,energyControls} from './energy-models.js';
import {LearningTools} from './learning-checks.js';
import {gradientNames} from './gradient-models.js';
import {causalNames,causalStepCount} from './causal-models.js';
import {PreparedAdapter} from './diagram-adapter.js';
import {assetURL} from './assets.js';
import {readingScene,hasPotentialVariant} from './reading-context.js';
import {siteConfiguration,offlineCopy} from './site-config.js';
import {MAX_PDF_BYTES} from './book-bundle.js';
const configuration=await siteConfiguration();
const hostedLibrary=publicLibraryEnabled(configuration);
import {SOURCE,passages,passageAt,sections} from './passages.js';
import {initial,controls,draw} from './scenes.js';
import {ScrollReader} from './scroll-reader.js';
import {BookShelf} from './shelf.js';
import {PublicLibraryCatalog,publicLibraryEnabled} from './public-library-catalog.js';
import {PublicLibraryStore} from './public-library-store.js';
import {localPDFCover} from './local-pdf-cover.js';
import {normalizeTemplate,templateNames} from './templates.js';
const $=id=>document.getElementById(id);
let matched=false,active=null,state=null,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,states=new Map(),frame=0,last=0,shape='',lastMetrics='',speed=1,busy=false;
const reader=new ScrollReader($('pdf-scroll'),positionChanged,status);
let shelf,preparedBook=null,loadedRevision=-1,currentSourceHash=null;
const passageKey=passage=>JSON.stringify([passage?.packId||'',passage?.packVersion||0,passage?.id]);
const learningModelFor=passage=>teachingModelFor(passage,currentSourceHash)||savedLearningModelFor(passage);
let readingFollower=new ReadingFollower();
function navigation(){
 const items=preparedBook?.sections||[];$('section').replaceChildren();const empty=document.createElement('option');empty.value='';empty.disabled=true;empty.textContent='Read normally';$('section').append(empty);for(const [id,title] of items){const o=document.createElement('option');o.value=id;o.textContent=id+' · '+title;$('section').append(o);}
 $('chapter').replaceChildren();for(const id of [...new Set(items.map(s=>s[0].split('-')[0]))]){const o=document.createElement('option');o.value=id;o.textContent='Prepared · '+id;$('chapter').append(o);}
}
$('section').innerHTML='<option value="" disabled>Read normally</option>'+sections.map(([id,name])=>`<option value="${id}">${id} · ${name}</option>`).join('');
function status(message){$('status').textContent=message;$('status').hidden=!message;}
function positionChanged(position){
 if(busy)return;
 $('page-label').textContent=`PDF ${position.page} / ${reader.count||SOURCE.pages}`;
 if(shelf?.mode==='reader')history.replaceState(null,'',`#page=${position.page}`);
 shelf?.changed();
 let next=preparedBook?.at(position.page,position.y);
 const leading=preparedBook?.leading?.get(position.page);if(!next&&leading&&position.y<leading.y){const node=reader.nodes[position.page-1],rect=node.getBoundingClientRect(),pane=$('pdf-scroll').getBoundingClientRect(),top=rect.top+leading.y*rect.height-pane.top;if(top>=0&&top<reader.scroll.clientHeight-60)next=leading;}
 if(!next){if(active){active=null;shape='';cancelAnimationFrame(frame);frame=0;empty();}else if(!$('stage').querySelector('.empty-aid'))empty();return;}
 const changed=passageKey(active)!==passageKey(next);
 const nextModel=learningModelFor(next);
 if(changed&&!states.has(passageKey(next))&&nextModel?.restore){const saved=nextModel.restore(next);if(saved){states.set(passageKey(next),saved.state);if(saved.exploring)readingFollower.manual(next);}}
 const reading=readingFollower.update(next,position);
 active=next;reader.markActive(next);$('section').value=next.source.section;$('chapter').value=next.source.section.split('-')[0];
 $('source-ref').textContent=`p. ${next.source.printed} · ${next.source.ref}`;
 $('demo-title').textContent=next.title;$('demo-caption').textContent=reading?.following?reading.beat.caption:next.caption;
 if(changed){
  delete $('stage').dataset.teachingBinding;$('stage').scrollTop=0;
  state=states.get(passageKey(next))||{...(learningModelFor(next)?.defaults(next)||initial(next.scene)),...next.defaults,variant:next.scene==='potential-loop'?'loop':'0'};state={...state,...learning.activate(next.scene,shelf?.current?.id||SOURCE.sha256,next.id,state,{explorationOnly:sourceExplorationNames.includes(next.scene)||/^chapter[124567]-/.test(next.packId||'')})};if(reading?.following)Object.assign(state,reading.beat.inputs);states.set(passageKey(next),state);if(nextModel?.animated&&state.moving===false)playing=false;shape='';buildControls();render();last=0;start();
 }
 else if(reading?.changed){const changedInputs=Object.entries(reading.beat.inputs).some(([key,value])=>state[key]!==value);Object.assign(state,reading.beat.inputs);states.set(passageKey(next),state);if(changedInputs){render();if(nextModel?.animated){if(state.moving===false)playing=false;last=0;start();}}}
 updateReadingPlanControls($('learning-tools'),reading);
 learning.setPassage(next);
}
const adapter=new PreparedAdapter($('stage'),{onReady:()=>render(),onChange:(key,value)=>{if(!state||!active)return;pause();const c=controls(active.scene,state).find(c=>c.key===key);state[key]=extensionNames.includes(active.scene)&&c?Math.max(c.min,Math.min(c.max,Number((c.min+Math.round((value-c.min)/c.step)*c.step).toFixed(6)))):chapter3Names.includes(active.scene)&&c?.step===1?Math.round(value):value;render();},onError:()=>status('Geometry unavailable. Showing the reviewed static drawing.')});
const learning=new LearningTools($('learning-tools'),{onApply:values=>{if(!state||!active)return;pause();Object.assign(state,values);states.set(passageKey(active),state);shape='';buildControls();render();}});
function empty(){
 adapter.clear();
 learning.clear();
 $('stage').closest('.demo').dataset.empty='true';
 $('stage').replaceChildren();const placeholder=document.createElement('span');placeholder.className='empty-aid';placeholder.textContent='No prepared aid for this passage';$('stage').append(placeholder);$('readouts').replaceChildren();$('parameters').replaceChildren();lastMetrics='';reader.markActive(null);$('section').value='';
 $('demo-title').textContent='READING';$('demo-caption').textContent=preparedBook?'No prepared diagram at this passage. Keep reading or choose a prepared section.':'This PDF has no prepared diagrams yet.';
 $('play').disabled=true;$('restart').disabled=true;$('scene').hidden=true;$('lines-label').hidden=true;$('contours-label').hidden=true;$('source-ref').textContent='';
}
const staticAid=scene=>!!teachingModelFor(active,currentSourceHash)||(hasLearningModel(scene)&&!learningModelFor({scene})?.animated)||sourceExplorationNames.includes(scene)||['statics','charge-sampling','null-comparison',...chapter3Names,...energyNames,...dielectricNames].includes(scene)||/^chapter[124567]-/.test(active?.packId||'');
function type(){return readingScene(active.scene,state.variant);}
function buildControls(){
 $('reset-values').hidden=true;
 $('stage').closest('.demo').dataset.empty='false';
 $('play').disabled=staticAid(active.scene);$('restart').disabled=staticAid(active.scene);$('play').textContent=playing&&!staticAid(active.scene)?'Pause':'Play';
 const model=learningModelFor(active);if(model){$('parameters').replaceChildren();$('learning-tools').replaceChildren();$('scene').hidden=true;$('lines-label').hidden=true;$('contours-label').hidden=true;model.controls($('learning-tools'),active,state,values=>{if(active.reading){readingFollower.manual(active);$('demo-caption').textContent=active.caption;}Object.assign(state,values);states.set(passageKey(active),state);render();const selection=readingFollower.update(active,reader.position());updateReadingPlanControls($('learning-tools'),selection);model.persist?.(active,state,selection);if(model.animated){playing=state.moving!==false;last=0;start();}});if(active.reading)readingPlanControls($('learning-tools'),()=>{const reading=readingFollower.resume(active,reader.position());Object.assign(state,reading.beat.inputs);states.set(passageKey(active),state);$('demo-caption').textContent=reading.beat.caption;render();updateReadingPlanControls($('learning-tools'),reading);model.persist?.(active,state,reading);if(model.animated){playing=state.moving!==false;last=0;start();}},direction=>{const selection=readingFollower.update(active,reader.position()),index=Math.max(0,Math.min(active.reading.beats.length-1,selection.index+direction)),at=active.reading.beats[index].at;reader.jump(at.page,Math.min(.99,at.y+.012),false);});return;}
 const params=controls(active.scene,state).filter(c=>c.key!=='progress');
 $('parameters').innerHTML=params.map(c=>`<label>${c.label}<output id="value-${c.key}"></output><input data-key="${c.key}" aria-label="${c.label}" type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${state[c.key]}"></label>`).join('');
 const potential=hasPotentialVariant(active.scene);$('scene').hidden=!potential;if(potential)$('scene').value=state.variant;
 const contours=['point','dipole'].includes(active.scene);$('lines-label').hidden=!contours;$('contours-label').hidden=!contours;$('lines').checked=state.lines;$('contours').checked=state.contours;
 $('reset-values').hidden=true;
}
function render(){
 if(!active||!state)return;
 const model=learningModelFor(active),savedScene=model?.savedScene?.(active,state);if(model&&!savedScene){adapter.clear();model.render($('stage'),active,state);model.syncControls?.($('learning-tools'),state);$('readouts').replaceChildren();lastMetrics='';return;}
 if($('stage').dataset.teachingBinding){delete $('stage').dataset.teachingBinding;$('stage').scrollTop=0;}
 if(savedScene)model.syncControls?.($('learning-tools'),state);
 const scene=savedScene||type(),result=draw(scene,state),explorationOnly=sourceExplorationNames.includes(scene)||/^chapter[124567]-/.test(active.packId||'');if(explorationOnly)result.svg=result.svg.replaceAll('Click or Space: pause / play','More controls below').replaceAll('Space: pause / play','More controls below');
 learning.update(state);
 const displayState=['snapshot-write-skew','serializable-retry',...causalNames].includes(scene)?{...state,progress:Math.floor(state.progress)}:state;
 const key=scene+':'+JSON.stringify(Object.fromEntries(Object.entries(displayState).filter(([k])=>!((['dipole','point','potential','potential-loop'].includes(scene)&&['x','y','angle','progress'].includes(k))||(['solid-sphere','spherical-shell','parallel-sheets'].includes(scene)&&k==='r')||(scene==='sheet-background'&&k==='b')||(scene==='quorum'&&k==='progress')))));
 const adapted=adapter.render(scene,state,{explorationOnly});
 const moving=result.svg.match(/<g data-motion>([\s\S]*?)<\/g>/),old=$('stage').querySelector('[data-motion]');
 if(!adapted&&shape===key&&moving&&old)old.innerHTML=moving[1];else if(!adapted&&(shape!==key||!$('stage').querySelector('svg'))){$('stage').innerHTML=result.svg;shape=key;}
 const metrics=result.metrics.map(m=>`<div><span>${m.label}</span><strong>${m.value}</strong></div>`).join('');if(metrics!==lastMetrics){$('readouts').innerHTML=metrics;lastMetrics=metrics;}
 for(const c of controls(active.scene,state).filter(c=>c.key!=='progress')){
  const output=$('value-'+c.key);if(output)output.textContent=Number(state[c.key].toFixed(2))+(c.units?' '+c.units:'');
  const input=$('parameters').querySelector(`[data-key="${c.key}"]`);if(input)input.value=state[c.key];
 }
}
function animate(dt){
 const t=dt*speed;
 const model=learningModelFor(active);if(model?.advance){model.advance(state,t);return;}
 switch(type()){
  case 'potential':case 'potential-loop':state.progress=(state.progress+t/6500)%1;break;
  case 'point':state.angle=(state.angle+t*.035)%360;break;
  case 'dipole':state.x=0;state.y+=t*.0006*(state.direction||-1);if(Math.abs(state.y)>2.1){state.y=Math.sign(state.y)*2.1;state.direction=-(state.direction||-1);}break;
  case 'gradient':case 'flux':state.r+=t*.00035*(state.direction||1);if(state.r>3.2||state.r<.6){state.r=Math.max(.6,Math.min(3.2,state.r));state.direction=-(state.direction||1);}break;
  case 'sphere':state.R+=t*.0003*(state.direction||1);if(state.R>3.4||state.R<1){state.R=Math.max(1,Math.min(3.4,state.R));state.direction=-(state.direction||1);}break;
  case 'cone':state.outer+=t*.0003*(state.direction||1);if(state.outer>3.3||state.outer<1.5){state.outer=Math.max(1.5,Math.min(3.3,state.outer));state.direction=-(state.direction||1);}break;
  case 'gauss':state.r+=t*.00032*(state.direction||1);if(state.r>3||state.r<.8){state.r=Math.max(.8,Math.min(3,state.r));state.direction=-(state.direction||1);}break;
  case 'superposition':state.x+=t*.00035*(state.direction||1);if(Math.abs(state.x)>2.5){state.x=Math.sign(state.x)*2.5;state.direction=-(state.direction||1);}break;
  case 'line-charge':state.r+=t*.0003*(state.direction||1);if(state.r>3.3||state.r<.6){state.r=Math.max(.6,Math.min(3.3,state.r));state.direction=-(state.direction||1);}break;
  case 'sheet-charge':state.r+=t*.0003*(state.direction||1);if(state.r>3.3||state.r<.6){state.r=Math.max(.6,Math.min(3.3,state.r));state.direction=-(state.direction||1);}break;
  case 'sheet-background':state.b+=t*.045*(state.direction||1);if(state.b>250||state.b< -250){state.b=Math.max(-250,Math.min(250,state.b));state.direction=-(state.direction||1);}break;
  case 'parallel-sheets':state.r+=t*.00065*(state.direction||1);if(state.r>3.3||state.r< -3.3){state.r=Math.max(-3.3,Math.min(3.3,state.r));state.direction=-(state.direction||1);}break;
  case 'solid-sphere':case 'spherical-shell':state.r+=t*.00065*(state.direction||1);if(state.r>4.5||state.r<0){state.r=Math.max(0,Math.min(4.5,state.r));state.direction=-(state.direction||1);}break;
  case 'shell-cone':case 'shell-power-law':state.r+=t*.00012*(state.direction||1);if(state.r>.85||state.r<0){state.r=Math.max(0,Math.min(.85,state.r));state.direction=-(state.direction||1);}break;
  case 'snapshot-write-skew':case 'serializable-retry':state.progress=(state.progress+t/1500)%6;break;
  case 'surface-flux':state.b=(state.b+t*.02)%360;break;
  case 'gauss-cube':state.r+=t*.0003*(state.direction||1);if(state.r>1.2||state.r<.2){state.r=Math.max(.2,Math.min(1.2,state.r));state.direction=-(state.direction||1);}break;
  case 'stokes-square':state.b+=t*.0006*(state.direction||1);if(state.b>1||state.b< -1){state.b=Math.max(-1,Math.min(1,state.b));state.direction=-(state.direction||1);}break;
  case 'gradient-direction':state.b=(state.b+t*.025)%360;break;
  case 'gradient-coordinates':state.a+=t*.025*(state.direction||1);if(state.a>90||state.a< -90){state.a=Math.max(-90,Math.min(90,state.a));state.direction=-(state.direction||1);}break;
  case 'causal-scalar-clock':case 'causal-vector-clock':state.progress=(state.progress+t/1700)%causalStepCount;break;
  case 'quorum':state.progress=(state.progress+t/1300)%state.n;state.phase=Math.floor(state.progress);break;
  case 'coulomb':state.r+=t*.0003*(state.direction||1);if(state.r>3.5||state.r<.6){state.r=Math.max(.6,Math.min(3.5,state.r));state.direction=-(state.direction||1);}break;
 }
}
function tick(now){
 frame=0;if(!playing||!active||staticAid(active.scene)||(learningModelFor(active)?.animated&&state.moving===false)||$('workspace').classList.contains('hide-aid')||shelf?.mode!=='reader'||(matchMedia('(max-width:580px)').matches&&document.body.dataset.mobilePane!=='diagram'))return;
 if(!last)last=now;if(now-last>=32){animate(Math.min(80,now-last));last=now;render();}frame=requestAnimationFrame(tick);
}
function start(){if(!frame&&playing&&active&&!staticAid(active.scene)&&shelf?.mode==='reader')frame=requestAnimationFrame(tick);}
function pause(){playing=false;cancelAnimationFrame(frame);frame=0;last=0;$('play').textContent='Play';}
$('play').addEventListener('click',()=>{if(playing)pause();else{playing=true;last=0;$('play').textContent='Pause';start();}});
$('restart').addEventListener('click',()=>{
 if(!active)return;
 if(learningModelFor(active)?.animated){Object.assign(state,{trace:0,moving:true});playing=true;render();last=0;start();return;}
 const defaults=initial(active.scene),keys={potential:['progress'],'potential-loop':['progress'],point:['angle'],dipole:['x','y'],gradient:['r'],flux:['r'],sphere:['R'],cone:['outer'],gauss:['r'],superposition:['x'],coulomb:['r'],'line-charge':['r'],'sheet-charge':['r'],quorum:['progress','phase'],'sheet-background':['b'],'parallel-sheets':['r'],'solid-sphere':['r'],'spherical-shell':['r'],'shell-cone':['r'],'shell-power-law':['r'],'snapshot-write-skew':['progress'],'serializable-retry':['progress'],'surface-flux':['b'],'gauss-cube':['r'],'stokes-square':['b'],'gradient-direction':['b'],'gradient-coordinates':['a'],'causal-scalar-clock':['progress'],'causal-vector-clock':['progress']}[type()]||[];
 for(const key of keys)state[key]=defaults[key];state.direction=1;shape='';render();last=0;start();
});
$('parameters').addEventListener('input',e=>{const key=e.target.dataset.key;if(!key)return;pause();state[key]=Number(e.target.value);normalizeTemplate(active.scene,state);if(active.scene==='quorum'&&key==='n')buildControls();shape='';render();$('reset-values').hidden=false;});
$('reset-values').addEventListener('click',()=>{state={...(active.generated?generatedDefaults(active.generated.model):initial(active.scene)),...active.defaults,variant:active.scene==='potential-loop'?'loop':'0'};states.set(passageKey(active),state);shape='';buildControls();render();});
$('scene').addEventListener('change',e=>{state.variant=e.target.value;state.path=e.target.value==='1'?1:0;state.progress=0;shape='';render();});
for(const key of ['lines','contours'])$(key).addEventListener('change',e=>{state[key]=e.target.checked;shape='';render();});
$('speed').addEventListener('input',e=>speed=Number(e.target.value));
$('stage').addEventListener('click',e=>{
 if(!active||staticAid(active.scene))return;if(!['dipole','point'].includes(active.scene)){if(playing)pause();else{playing=true;last=0;$('play').textContent='Pause';start();}return;}pause();const svg=$('stage').querySelector('svg'),point=svg.createSVGPoint();point.x=e.clientX;point.y=e.clientY;const local=point.matrixTransform(svg.getScreenCTM().inverse()),k=active.scene==='point'?52:78;
 const x=(local.x-300)/k,y=(202-local.y)/k;
 if(active.scene==='point'){state.r=Math.max(.5,Math.min(3.2,Math.hypot(x,y)));state.angle=(Math.atan2(y,x)*180/Math.PI+360)%360;}else{state.x=Math.max(-3.4,Math.min(3.4,x));state.y=Math.max(-2.3,Math.min(2.3,y));}render();
});
$('stage').addEventListener('keydown',e=>{if(!active||!['dipole','point'].includes(active.scene)||!e.key.startsWith('Arrow'))return;e.preventDefault();pause();if(active.scene==='point'){if(e.key==='ArrowLeft'||e.key==='ArrowRight')state.angle=(state.angle+(e.key==='ArrowLeft'?5:-5)+360)%360;else state.r=Math.max(.5,Math.min(3.2,state.r+(e.key==='ArrowUp'?.05:-.05)));}else{if(e.key==='ArrowLeft'||e.key==='ArrowRight')state.x=Math.max(-3.4,Math.min(3.4,state.x+(e.key==='ArrowLeft'?-.1:.1)));else state.y=Math.max(-2.3,Math.min(2.3,state.y+(e.key==='ArrowUp'?.1:-.1)));}render();});
$('stage').addEventListener('keydown',e=>{if(!active||active.scene!=='quorum'||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();if(e.key==='ArrowUp'||e.key==='ArrowDown')state.r=Math.max(1,Math.min(state.n,state.r+(e.key==='ArrowUp'?1:-1)));else state.phase=(state.phase+(e.key==='ArrowRight'?1:state.n-1))%state.n;shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!['shell-cone','shell-power-law','null-comparison'].includes(active.scene)||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();pause();if(['shell-cone','shell-power-law'].includes(active.scene)){if(e.key==='ArrowLeft'||e.key==='ArrowRight')state.r=Math.max(0,Math.min(.85,state.r+(e.key==='ArrowRight'?.05:-.05)));else state.b=active.scene==='shell-cone'?Math.max(0,Math.min(80,state.b+(e.key==='ArrowUp'?5:-5))):Math.max(1,Math.min(3,state.b+(e.key==='ArrowUp'?.1:-.1))); }else{if(e.key==='ArrowLeft'||e.key==='ArrowRight')state.b=Math.max(-2,Math.min(2,state.b+(e.key==='ArrowRight'?.1:-.1)));else state.sigma=Math.max(.05,Math.min(1,state.sigma+(e.key==='ArrowUp'?.05:-.05)));}shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!['snapshot-write-skew','serializable-retry'].includes(active.scene)||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();state.progress=Math.max(0,Math.min(5,Math.floor(state.progress)+(e.key==='ArrowRight'?1:-1)));shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!gradientNames.includes(active.scene)||!e.key.startsWith('Arrow'))return;e.preventDefault();pause();if(e.key==='ArrowUp'||e.key==='ArrowDown')state.b=(state.b+(e.key==='ArrowUp'?5:355))%360;else if(active.scene==='gradient-direction')state.r=Math.max(.02,Math.min(.8,state.r+(e.key==='ArrowRight'?.05:-.05)));else state.a=Math.max(-90,Math.min(90,state.a+(e.key==='ArrowRight'?5:-5)));shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!causalNames.includes(active.scene)||!e.key.startsWith('Arrow'))return;e.preventDefault();pause();if(e.key==='ArrowLeft'||e.key==='ArrowRight')state.progress=Math.max(0,Math.min(causalStepCount-1,Math.floor(state.progress)+(e.key==='ArrowRight'?1:-1)));else state.b=(state.b+(e.key==='ArrowUp'?1:2))%3;shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!chapter3Names.includes(active.scene)||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();const c=chapter3ReaderControls(active.scene)[0];state[c.key]=Math.max(c.min,Math.min(c.max,Number((state[c.key]+(e.key==='ArrowRight'?c.step:-c.step)).toFixed(6))));shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!energyNames.includes(active.scene)||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();const c=energyControls(active.scene)[0];state[c.key]=Math.max(c.min,Math.min(c.max,Number((state[c.key]+(e.key==='ArrowRight'?c.step:-c.step)).toFixed(6))));shape='';render();});
$('section').addEventListener('change',e=>{const p=preparedBook?.sections.find(p=>p[0]===e.target.value);if(p)reader.jump(p[2],p[3]+1/reader.nodes[p[2]-1].getBoundingClientRect().height,false);});
$('chapter').addEventListener('change',e=>{const p=preparedBook?.sections.find(s=>s[0].split('-')[0]===e.target.value);if(p)reader.jump(p[2],p[3]+1/reader.nodes[p[2]-1].getBoundingClientRect().height,false);});
$('zoom').addEventListener('change',e=>reader.setZoom(e.target.value));
$('hide-aid').addEventListener('click',()=>{const hidden=$('workspace').classList.toggle('hide-aid');$('hide-aid').textContent=hidden?'Show demo':'Hide demo';if(hidden){cancelAnimationFrame(frame);frame=0;}else start();reader.resize();});
$('model-info').addEventListener('click',()=>{
 $('info-title').textContent=active?.title||'Prepared source pack';$('info-ref').textContent=active?`PDF ${active.page} · printed ${active.source.printed} · ${active.source.ref}`:'Selected passages only';
 $('info-text').textContent=active?.source.text.replace(/<[^>]*>/g,'')||'The reader supports the supplied local PDF.';
 $('info-limits').textContent=(active?.source.limit||'')+(templateNames.includes(active?.scene)||hasLearningModel(active?.scene)?'':' Animation traces an observation position or scans static configurations; it is not a dynamical simulation of charge motion. Field-line counts and arrow lengths are schematic. Curves are numerical approximations of the analytic field.');
 $('info').showModal();
});
async function openBook(book){
 if(busy)return null;busy=true;cancelAnimationFrame(frame);frame=0;status('Opening local PDF…');$('open-pdf').disabled=true;
 try{
  if(book.id&&shelf.current?.id===book.id&&reader.document&&loadedRevision===shelf.catalog.revision){
   const stored=book.openingPosition||shelf.progress.get(book.id)?.position,saved=stored?{zoom:'fit',split:50,gap:0,left:0,...stored,hideAid:false}:null;
   if(saved){
    const rebuild=reader.zoom!==saved.zoom||Number(divider.getAttribute('aria-valuenow'))!==saved.split||$('workspace').classList.contains('hide-aid')!==saved.hideAid;
    reader.zoom=saved.zoom;$('zoom').value=saved.zoom;split(saved.split);$('workspace').classList.toggle('hide-aid',saved.hideAid);$('hide-aid').textContent=saved.hideAid?'Show demo':'Hide demo';
    if(rebuild)reader.build(saved);else reader.jump(saved.page,saved.y,false,saved.gap);$('pdf-scroll').scrollLeft=saved.left;
   }
   status('');return {id:book.id,title:shelf.current.title,pages:reader.count};
  }
  let file=book.file;if(!file){if(!book.localUrl&&book.id!==SOURCE.sha256)throw Error('Import the matching PDF to read this prepared book.');const response=await fetch(assetURL(book.localUrl||SOURCE.localUrl));if(!response.ok)throw Error('Sample PDF is missing. Select it with Open PDF.');file=await response.blob();}
  if(file.size>MAX_PDF_BYTES)throw Error('This reader supports local PDFs up to 128 MiB.');const bytes=await file.arrayBuffer(),hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join(''),sourceMatches=hash===SOURCE.sha256;
  if(book.builtin&&book.id!==hash)throw Error('This local PDF does not match the selected book. Import the matching PDF.');
  const saved={page:1,y:0,gap:0,zoom:'fit',split:50,left:0,...(book.openingPosition||shelf.progress.get(hash)?.position||{}),hideAid:false};
  reader.zoom=saved.zoom;$('zoom').value=saved.zoom;split(saved.split);$('workspace').classList.toggle('hide-aid',saved.hideAid);$('hide-aid').textContent=saved.hideAid?'Show demo':'Hide demo';
  await reader.open(bytes,[],sourceMatches);preparedBook=await shelf.catalog.forBook(reader.document,hash);reader.markers=preparedBook?.breakpoints||[];reader.build();loadedRevision=shelf.catalog.revision;matched=!!preparedBook;navigation();states.clear();readingFollower.clear();active=null;
  const title=book.builtin?book.title:sourceMatches?'The Feynman Lectures on Physics':(file.name||book.title||'Local PDF');
  $('book-title').textContent=sourceMatches?'The Feynman Lectures · Vol. II':title;$('chapter').disabled=!matched;$('section').disabled=!matched;
  currentSourceHash=hash;reader.jump(saved.page,saved.y,false,saved.gap);$('pdf-scroll').scrollLeft=saved.left;status('');
  return {id:hash,title,pages:reader.count,...(hostedLibrary?{coverDataUrl:await localPDFCover(reader.document)}:{})};
 }finally{busy=false;$('open-pdf').disabled=false;reader.schedule();}
}
$('open-pdf').addEventListener('click',()=>$('pdf-file').click());$('pdf-file').addEventListener('change',e=>{if(e.target.files[0])shelf.openFile(e.target.files[0]);e.target.value='';});
$('page-label').addEventListener('click',()=>{$('page-number').max=reader.count;$('page-number').value=reader.position().page;$('page-jump').showModal();$('page-number').select();});
$('page-form').addEventListener('submit',e=>{if(e.submitter?.value!=='go')return;e.preventDefault();const page=Number($('page-number').value);if(Number.isInteger(page)&&page>=1&&page<=reader.count){$('page-jump').close();reader.jump(page,0);}});
document.addEventListener('keydown',e=>{if(shelf?.mode!=='reader'||document.querySelector('dialog[open]')||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
 if((e.ctrlKey||e.metaKey)&&['+','=','-','0'].includes(e.key)){e.preventDefault();const scale=reader.scales?.[reader.position().page-1]||1,options=[1,1.25,1.5],next=e.key==='-'?[...options].reverse().find(v=>v<scale-.005):options.find(v=>v>scale+.005),value=e.key==='0'?'fit':next===undefined?reader.zoom:String(next);$('zoom').value=value;reader.setZoom(value);}
 else if(e.key==='Escape'){e.preventDefault();shelf.close(false);}
 else if(e.code==='Space'&&e.target.closest('#stage')&&!e.target.closest('button,summary,a,[role="button"],[contenteditable="true"]')){e.preventDefault();$('play').click();}
});
const mobileView=matchMedia('(max-width:580px)');document.body.dataset.mobilePane='source';
function mobilePane(value){document.body.dataset.mobilePane=value;$('mobile-pane').textContent=value==='source'?'Diagram':'Source';$('mobile-pane').setAttribute('aria-label',value==='source'?'Show diagram':'Show source');$('mobile-help').textContent=value==='source'?'Swipe sideways for the full source page':'Swipe sideways for the full diagram';if(value==='diagram')start();else{cancelAnimationFrame(frame);frame=0;}}
$('mobile-pane').addEventListener('click',()=>mobilePane(document.body.dataset.mobilePane==='source'?'diagram':'source'));
mobileView.addEventListener('change',()=>{if(!mobileView.matches)start();});mobilePane('source');
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>reader.resize(),180);});
addEventListener('hashchange',()=>{if(!busy&&reader.document&&shelf.mode==='reader'){const n=Number(location.hash.match(/page=(\d+)/)?.[1]);if(n)reader.jump(n,.045);}});
const divider=$('divider');function split(v){v=Math.max(35,Math.min(65,v));$('workspace').style.setProperty('--split',v+'%');divider.setAttribute('aria-valuenow',String(v));}
divider.addEventListener('pointerdown',e=>{divider.setPointerCapture(e.pointerId);document.body.classList.add('resizing');});divider.addEventListener('pointermove',e=>{if(divider.hasPointerCapture(e.pointerId)){const b=$('workspace').getBoundingClientRect();split((e.clientX-b.left)/b.width*100);}});divider.addEventListener('pointerup',e=>{divider.releasePointerCapture(e.pointerId);document.body.classList.remove('resizing');reader.resize();});divider.addEventListener('pointercancel',()=>document.body.classList.remove('resizing'));divider.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();split(Number(divider.getAttribute('aria-valuenow'))+(e.key==='ArrowLeft'?-2:2));reader.resize();}});

shelf=new BookShelf({configuration,libraryFactory:hostedLibrary?()=>new PublicLibraryStore():undefined,catalogFactory:hostedLibrary?library=>new PublicLibraryCatalog(library,{configuration}):undefined,load:openBook,capture:()=>({...reader.position(),zoom:reader.zoom,split:Number(divider.getAttribute('aria-valuenow')),left:$('pdf-scroll').scrollLeft,hideAid:$('workspace').classList.contains('hide-aid')}),suspend:()=>{if(active&&state)learningModelFor(active)?.persist?.(active,state,readingFollower.update(active,reader.position()));cancelAnimationFrame(frame);frame=0;last=0;},resume:()=>{reader.schedule();last=0;start();}});

import {installOrbitCompanion} from './orbit-companion-book.js';
await installOrbitCompanion(shelf,configuration);
import {installClockBinding} from './clock-binding-book.js';
await installClockBinding(shelf);

offlineCopy(configuration,message=>{const node=document.getElementById('offline-state');node.textContent=message;node.hidden=false;});

$('stage').addEventListener('keydown',e=>{if(!active||!boundaryNames.includes(active.scene)||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','o','O','[',']'].includes(e.key))return;e.preventDefault();pause();if(active.scene==='stokes-square'&&['o','O'].includes(e.key))state.n=1-state.n;else if(active.scene==='gauss-cube'&&['[',']'].includes(e.key))state.b=Math.max(-1,Math.min(1,state.b+(e.key===']'?.1:-.1)));else if(e.key.startsWith('Arrow')){const change=['ArrowRight','ArrowUp'].includes(e.key)?1:-1;if(active.scene==='surface-flux'){if(['ArrowLeft','ArrowRight'].includes(e.key))state.b=(state.b+change*5+360)%360;else state.a=Math.max(.2,Math.min(2,state.a+change*.05));}else if(active.scene==='gauss-cube'){if(['ArrowLeft','ArrowRight'].includes(e.key))state.r=Math.max(.2,Math.min(1.2,state.r+change*.05));else state.a=Math.max(-1,Math.min(1,state.a+change*.1));}else if(['ArrowLeft','ArrowRight'].includes(e.key))state.b=Math.max(-1,Math.min(1,state.b+change*.1));else state.r=Math.max(.2,Math.min(1.2,state.r+change*.05));}shape='';render();});
$('stage').addEventListener('keydown',e=>{if(!active||!dielectricNames.includes(active.scene)||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();const c=dielectricControls(active.scene)[0];state[c.key]=Math.max(c.min,Math.min(c.max,Number((state[c.key]+(e.key==='ArrowRight'?c.step:-c.step)).toFixed(6))));shape='';render();});

$('stage').addEventListener('keydown',e=>{if(!active||!extensionNames.includes(active.scene)||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();pause();const c=controls(active.scene,state)[0];state[c.key]=Math.max(c.min,Math.min(c.max,Number((state[c.key]+(e.key==='ArrowRight'?c.step:-c.step)).toFixed(6))));shape='';render();});

// Local development refreshes reuse saved packages; no generation runs here.
import {connectHotReload} from './hot-reload.js';
await connectHotReload(configuration,{
 ready:()=>['shelf','reader'].includes(shelf.mode)&&!document.querySelector('dialog[open]'),
 capture:()=>{
  if(shelf.mode!=='reader')return {bookId:null};
  if(!shelf.current.persistent&&!shelf.current.localUrl)return null;
  shelf.save();
  return {bookId:shelf.current.id,position:shelf.capture(),states:[...states],reading:readingFollower.snapshot(),playing,speed};
 },
 restore:async snapshot=>{
  if(!snapshot?.bookId)return;
  await shelf.restored;
  const book=shelf.books.get(snapshot.bookId);if(!book)return;
  await shelf.open(book,{position:snapshot.position});
  if(snapshot.states){states=new Map(snapshot.states);readingFollower=new ReadingFollower(snapshot.reading);active=null;shape='';reader.schedule();}
  playing=snapshot.playing??playing;speed=snapshot.speed??speed;
 },
 stylesApplied:async snapshot=>{
  const updated=await siteConfiguration();shelf.catalog.codeHash=updated.codeHash;
  if(snapshot?.bookId&&shelf.mode==='reader')reader.build(snapshot.position);
 },
 notice:message=>status(message)
});
