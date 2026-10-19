// Static hosting adapter. The book shell, PDF reader, progress, accepted source
// checks and flight model are shared with the private reader. No server or upload.
import {siteConfiguration} from './site-config.js';
import {assetURL} from './assets.js';
import {sha256,MAX_PDF_BYTES} from './book-bundle.js';
import {BookShelf} from './shelf.js';
import {ScrollReader} from './scroll-reader.js';
import {ReadingFollower} from './reading-plan.js';
import {readingPlanControls,updateReadingPlanControls} from './reading-plan-view.js';
import {orbitalFlightModel} from './orbital-flight-view.js';
import {clockPathModel} from './clock-path-view.js';
import {PublicPackCatalog} from './public-pack-catalog.js';
import {installClockBinding} from './clock-binding-book.js';
const modelFor=passage=>passage.scene==='clock-path'?clockPathModel:orbitalFlightModel;
let model=orbitalFlightModel;
import {installOrbitCompanion} from './orbit-companion-book.js';
const $=id=>document.getElementById(id),configuration=await siteConfiguration(),states=new Map(),follower=new ReadingFollower();
let shelf,book=null,active=null,state=null,frame=0,last=0,bindingNotice='';
const status=text=>{text=text||bindingNotice;$('status').textContent=text;$('status').hidden=!text;};
const reader=new ScrollReader($('pdf-scroll'),position=>{
 $('page-label').textContent=`PDF ${position.page} / ${reader.count}`;
 if(shelf?.mode!=='reader')return;history.replaceState(null,'','#page='+position.page);shelf.changed();
 const next=book?.at(position.page,position.y);
 if(!next){if(active){model.persist(active,state,follower.update(active,position));cancelAnimationFrame(frame);frame=0;active=null;state=null;}$('stage').replaceChildren();const empty=document.createElement('span');empty.className='empty-aid';empty.textContent='No prepared aid for this passage';$('stage').append(empty);$('learning-tools').replaceChildren();$('learning-tools').hidden=true;return;}
 const changed=active?.id!==next.id;if(changed)model=modelFor(next);
 if(changed&&!states.has(next.id)){const saved=model.restore(next);if(saved){states.set(next.id,saved.state);if(saved.exploring)follower.manual(next);}}
 const reading=follower.update(next,position);active=next;reader.markActive(next);
 if(changed){state=states.get(next.id)||{...model.defaults(next),...next.defaults};if(reading.following)Object.assign(state,reading.beat.inputs);states.set(next.id,state);controls();paint();start();}
 else if(reading.changed){Object.assign(state,reading.beat.inputs);paint();start();}
 updateReadingPlanControls($('learning-tools'),reading);
},status);
function paint(){if(active){model.render($('stage'),active,state);model.syncControls($('learning-tools'),state);}}
const visibleScene=()=>!mobile.matches||document.body.dataset.mobilePane==='diagram';
function start(){if(!frame&&state?.moving&&shelf?.mode==='reader'&&visibleScene())frame=requestAnimationFrame(tick);}
function tick(now){frame=0;if(!active||!state?.moving||shelf.mode!=='reader'||!visibleScene()){last=0;return;}if(last)model.advance(state,Math.min(80,now-last));last=now;paint();start();}
function controls(){
 const tools=$('learning-tools');tools.replaceChildren();tools.hidden=false;
 model.controls(tools,active,state,values=>{follower.manual(active);Object.assign(state,values);states.set(active.id,state);paint();const selection=follower.update(active,reader.position());model.persist(active,state,selection);updateReadingPlanControls(tools,selection);last=0;start();});
 readingPlanControls(tools,()=>{const selection=follower.resume(active,reader.position());Object.assign(state,selection.beat.inputs);paint();updateReadingPlanControls(tools,selection);model.persist(active,state,selection);last=0;start();},direction=>{const selection=follower.update(active,reader.position()),index=Math.max(0,Math.min(active.reading.beats.length-1,selection.index+direction)),at=active.reading.beats[index].at;reader.jump(at.page,Math.min(.99,at.y+.012),false);});
}
async function openBook(value){
 bindingNotice='';
 let file=value.file;if(!file){const response=await fetch(assetURL(value.localUrl));if(!response.ok)throw Error('Choose your local PDF to open this book.');file=await response.blob();}
 if(file.size>MAX_PDF_BYTES)throw Error('This reader supports PDFs up to 128 MiB.');const bytes=await file.arrayBuffer(),id=await sha256(bytes);
 if(value.id&&value.id!=='pending'&&value.id!==id)throw Error('This PDF differs from the selected book.');
 const saved={page:1,y:0,zoom:'fit',split:50,left:0,...(value.openingPosition||shelf.progress.get(id)?.position||{})};
 if(active&&state)model.persist(active,state,follower.update(active,reader.position()));active=null;state=null;cancelAnimationFrame(frame);frame=0;
 reader.zoom=saved.zoom;$('zoom').value=saved.zoom;setSplit(saved.split);await reader.open(bytes,[],false);book=await shelf.catalog.forBook(reader.document,id);$('workspace').classList.toggle('hide-aid',!book);reader.markers=book?.breakpoints||[];reader.build();reader.jump(saved.page,saved.y,false,saved.gap);$('pdf-scroll').scrollLeft=saved.left;const localPlan=[...shelf.catalog.packs.values()].some(p=>p.source.sha256===id&&p.format==='clock-path-explanations');bindingNotice=book?'':localPlan?'Passage anchors did not match this PDF. The source is readable; no lesson was activated.':'Local PDF opened. No matching reading plan is installed.';status('');
 const title=value.title||(file.name||'Local PDF').replace(/\.pdf$/i,'');$('book-title').textContent=title;return {id,title,pages:reader.count};
}
const divider=$('divider');function setSplit(value){value=Math.max(35,Math.min(65,value));$('workspace').style.setProperty('--split',value+'%');divider.setAttribute('aria-valuenow',String(value));}
divider.addEventListener('pointerdown',e=>divider.setPointerCapture(e.pointerId));divider.addEventListener('pointermove',e=>{if(divider.hasPointerCapture(e.pointerId)){const b=$('workspace').getBoundingClientRect();setSplit((e.clientX-b.left)/b.width*100);reader.resize();}});divider.addEventListener('pointerup',e=>{if(divider.hasPointerCapture(e.pointerId))divider.releasePointerCapture(e.pointerId);});divider.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();setSplit(Number(divider.getAttribute('aria-valuenow'))+(e.key==='ArrowRight'?2:-2));reader.resize();}});
shelf=new BookShelf({configuration,catalogFactory:library=>new PublicPackCatalog(library,{configuration}),load:openBook,capture:()=>({...reader.position(),zoom:reader.zoom,split:Number(divider.getAttribute('aria-valuenow')),left:$('pdf-scroll').scrollLeft,hideAid:false}),suspend:()=>{if(active&&state)model.persist(active,state,follower.update(active,reader.position()));cancelAnimationFrame(frame);frame=0;last=0;},resume:()=>{reader.schedule();last=0;start();}});
$('pdf-file').addEventListener('change',async event=>{const file=event.target.files[0];event.target.value='';if(file)await shelf.openFile(file);});
$('open-pdf').addEventListener('click',()=>$('pdf-file').click());
$('zoom').addEventListener('change',event=>reader.setZoom(event.target.value));
$('page-label').addEventListener('click',()=>{$('page-number').value=reader.position().page;$('page-number').max=reader.count;$('page-jump').showModal();});
$('page-form').addEventListener('submit',e=>{if(e.submitter?.value==='go'){const n=Number($('page-number').value);if(!Number.isInteger(n)||n<1||n>reader.count){e.preventDefault();return;}reader.jump(n,.045);}});
const mobile=matchMedia('(max-width:580px)');document.body.dataset.mobilePane='source';
$('mobile-pane').addEventListener('click',()=>{const diagram=document.body.dataset.mobilePane!=='diagram';document.body.dataset.mobilePane=diagram?'diagram':'source';$('mobile-pane').setAttribute('aria-label',diagram?'Show source':'Show diagram');$('mobile-pane').textContent=diagram?'Source':'Diagram';if(diagram){last=0;start();}else{cancelAnimationFrame(frame);frame=0;last=0;}});$('mobile-pane').setAttribute('aria-label','Show diagram');
addEventListener('resize',()=>{reader.resize();if(visibleScene())start();else{cancelAnimationFrame(frame);frame=0;last=0;}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&shelf.mode==='reader'&&!document.querySelector('dialog[open]'))shelf.close(false);});
await installOrbitCompanion(shelf,configuration);
await installClockBinding(shelf);
