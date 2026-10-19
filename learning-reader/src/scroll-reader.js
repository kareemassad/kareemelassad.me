import {assetURL} from './assets.js';
import {readingScale} from './reading-context.js';
import {breakpointKey,breakpointState} from './passage-breakpoints.js';
let pdfjs;
export class ScrollReader {
 constructor(scroll,onPosition,onStatus){this.scroll=scroll;this.onPosition=onPosition;this.onStatus=onStatus;this.version=0;this.zoom='fit';this.nodes=[];this.jobs=new Map();this.near=new Set();this.running=0;this.raf=0;scroll.addEventListener('scroll',()=>this.schedule());}
 async open(bytes,markers=[],uniform=false){
  if(!pdfjs){pdfjs=await import(assetURL('vendor/legacy/build/pdf.mjs'));pdfjs.GlobalWorkerOptions.workerSrc=assetURL('vendor/legacy/build/pdf.worker.mjs');}
  this.onStatus('Opening PDF…');
  const loading=pdfjs.getDocument({data:new Uint8Array(bytes),cMapUrl:assetURL('vendor/cmaps/'),cMapPacked:true,standardFontDataUrl:assetURL('vendor/standard_fonts/'),wasmUrl:assetURL('vendor/wasm/'),isEvalSupported:false,enableXfa:false});
  let document;try{document=await loading.promise;}catch(error){await loading.destroy();throw error;}
  this.version++;this.observer?.disconnect();for(const job of this.jobs.values())job.task?.cancel();this.jobs.clear();
  if(this.loading)await this.loading.destroy();
  this.loading=loading;this.document=document;
  this.count=this.document.numPages;this.markers=markers;const first=await this.document.getPage(1);this.base=first.getViewport({scale:1});this.dimensions=Array(this.count).fill(this.base);
  for(let start=1;start<this.count;start+=24){const entries=await Promise.all(Array.from({length:Math.min(24,this.count-start)},async(_,i)=>{const n=start+i;return [n,(await this.document.getPage(n+1)).getViewport({scale:1})];}));for(const [n,size] of entries)this.dimensions[n]=size;}
  this.build();return this.count;
 }
 position(){
  if(!this.nodes.length)return {page:1,y:0};
  const line=this.scroll.getBoundingClientRect().top+Math.min(160,this.scroll.clientHeight*.28);
  let lo=0,hi=this.count-1;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(this.nodes[mid].getBoundingClientRect().top<=line)lo=mid;else hi=mid-1;}
  const index=lo,rect=this.nodes[index].getBoundingClientRect(),offset=line-rect.top,height=rect.height;
  return {page:index+1,y:Math.max(0,Math.min(1,offset/height)),gap:Math.max(0,Math.min(18,offset-height))};
 }
 build(restore){
  this.version++;this.observer?.disconnect();for(const job of this.jobs.values())job.task?.cancel();this.jobs.clear();this.near.clear();
  const width=Math.max(180,this.scroll.clientWidth-40);this.scales=this.dimensions.map(size=>readingScale(this.zoom,width,size.width,matchMedia('(max-width:580px)').matches));
  this.widths=this.dimensions.map((size,i)=>size.width*this.scales[i]);this.heights=this.dimensions.map((size,i)=>size.height*this.scales[i]);this.starts=[];let offset=0;for(const h of this.heights){this.starts.push(offset);offset+=h+18;}
  this.scale=this.scales[0];this.width=this.widths[0];this.height=this.heights[0];
  const pages=document.createElement('div');pages.className='pdf-pages';this.nodes=[];
  // Let the final source passage reach the reading line, even on a short page.
  pages.style.paddingBottom=Math.max(0,this.scroll.clientHeight-Math.min(160,this.scroll.clientHeight*.28))+'px';
  for(let n=1;n<=this.count;n++){
   const page=document.createElement('div');page.className='pdf-page';page.dataset.page=n;page.style.width=this.widths[n-1]+'px';page.style.height=this.heights[n-1]+'px';page.setAttribute('aria-label','PDF page '+n);
   const label=document.createElement('span');label.className='page-placeholder';label.textContent=n;page.append(label);
   for(const marker of this.markers.filter(m=>m.page===n)){
    const button=document.createElement('button');button.className='passage-marker';button.style.top=marker.y*100+'%';button.dataset.kind=marker.kind||'aid';button.dataset.title=marker.title;button.setAttribute('aria-label',(marker.kind==='gap'?'Show unprepared passage: ':'Show aid: ')+marker.title);button.title=marker.title;button.dataset.passage=breakpointKey(marker);const label=document.createElement('span');label.className='marker-label';label.textContent=marker.kind==='gap'?'End':'Aid';button.append(label);button.addEventListener('click',()=>this.jump(n,Math.min(1,marker.y+1/this.nodes[n-1].getBoundingClientRect().height),false));page.append(button);
   }
   pages.append(page);this.nodes.push(page);
  }
  this.scroll.replaceChildren(pages);this.pages=pages;this.origin=pages.offsetTop;
  this.observer=new IntersectionObserver(entries=>{
   for(const e of entries){const n=Number(e.target.dataset.page);if(e.isIntersecting){this.near.add(n);this.enqueue(n);}else{this.near.delete(n);this.release(n);}}
   this.pump();
  },{root:this.scroll,rootMargin:'950px 0px'});
  for(const node of this.nodes)this.observer.observe(node);
  if(restore)this.jump(restore.page,restore.y,false,restore.gap||0);else this.schedule();
 }
 jump(page,y=0,align=true,gap=0){
  const n=Math.max(1,Math.min(this.count,Number(page)||1));
  const rect=this.nodes[n-1].getBoundingClientRect(),pane=this.scroll.getBoundingClientRect();
  this.scroll.scrollTop+=rect.top-pane.top+y*rect.height+gap-(align?24:Math.min(160,this.scroll.clientHeight*.28));
  this.near.add(n);this.enqueue(n);this.pump();this.schedule();
 }
 setZoom(value){const p=this.position();this.zoom=value;this.build(p);}
 resize(){if(this.document)this.build(this.position());}
 schedule(){if(this.raf)return;this.raf=requestAnimationFrame(()=>{this.raf=0;this.onPosition(this.position());});}
 enqueue(n){if(this.jobs.has(n)||this.nodes[n-1]?.querySelector('canvas'))return;this.jobs.set(n,{state:'waiting',version:this.version});}
 release(n){const job=this.jobs.get(n);job?.task?.cancel();this.jobs.delete(n);const node=this.nodes[n-1];if(node){node.querySelector('canvas')?.remove();node.querySelector('.textLayer')?.remove();}}
 pump(){
  while(this.running<2){
   const candidates=[...this.jobs.entries()].filter(([n,j])=>j.state==='waiting'&&this.near.has(n)).sort((a,b)=>Math.abs(a[0]-this.position().page)-Math.abs(b[0]-this.position().page));
   if(!candidates.length)return;const[n,job]=candidates[0];job.state='running';this.running++;this.render(n,job).finally(()=>{this.running--;if(this.jobs.get(n)===job&&job.state!=='done')this.jobs.delete(n);this.pump();});
  }
 }
 async render(n,job){
  try{
   const page=await this.document.getPage(n);if(job.version!==this.version||this.jobs.get(n)!==job)return;
   const viewport=page.getViewport({scale:this.scales[n-1]}),density=Math.min(devicePixelRatio||1,2),node=this.nodes[n-1];
   const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width*density);canvas.height=Math.ceil(viewport.height*density);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';canvas.setAttribute('aria-label','Rendered PDF page '+n);
   node.prepend(canvas);node.style.setProperty('--total-scale-factor',this.scales[n-1]);node.style.setProperty('--scale-round-x','1px');node.style.setProperty('--scale-round-y','1px');
   job.task=page.render({canvasContext:canvas.getContext('2d'),viewport,transform:density!==1?[density,0,0,density,0,0]:null});await job.task.promise;
   if(job.version!==this.version||this.jobs.get(n)!==job)return;
   const layer=document.createElement('div');layer.className='textLayer';node.append(layer);
   await new pdfjs.TextLayer({textContentSource:await page.getTextContent(),container:layer,viewport}).render();
   if(job.version!==this.version||this.jobs.get(n)!==job)return;
   job.state='done';node.classList.add('rendered');this.onStatus('');
  }catch(error){if(error.name!=='RenderingCancelledException'&&job.version===this.version)this.onStatus('Page '+n+' could not be rendered.');}
 }
 markActive(passage,position=this.position()){
  const state=breakpointState(this.markers,passage,position);
  for(const marker of this.scroll.querySelectorAll('.passage-marker')){
   const active=marker.dataset.passage===state.active,next=marker.dataset.passage===state.next;marker.classList.toggle('active',active);marker.classList.toggle('upcoming',next);if(active)marker.setAttribute('aria-current','location');else marker.removeAttribute('aria-current');marker.querySelector('.marker-label').textContent=marker.dataset.kind==='gap'?(next?'End':'Gap'):(next?'Next':'Aid');marker.setAttribute('aria-label',(active?'Active aid: ':next?(marker.dataset.kind==='gap'?'Upcoming unprepared passage: ':'Upcoming aid: '):marker.dataset.kind==='gap'?'Show unprepared passage: ':'Show aid: ')+marker.dataset.title);
  }
 }
}
