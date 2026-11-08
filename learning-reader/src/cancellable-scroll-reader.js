import {ScrollReader} from './scroll-reader.js';
import {assetURL} from './assets.js';
let pdfjs;

// Preserve the reader pinned by saved packages and extend PDF opening only.
export class CancellableScrollReader extends ScrollReader {
 async open(bytes,markers=[],uniform=false,{signal}={}){
  signal?.throwIfAborted();
  if(!pdfjs){pdfjs=await import(assetURL('vendor/legacy/build/pdf.mjs'));pdfjs.GlobalWorkerOptions.workerSrc=assetURL('vendor/legacy/build/pdf.worker.mjs');}
  signal?.throwIfAborted();this.onStatus('Opening PDF…');
  const loading=pdfjs.getDocument({data:new Uint8Array(bytes),cMapUrl:assetURL('vendor/cmaps/'),cMapPacked:true,standardFontDataUrl:assetURL('vendor/standard_fonts/'),wasmUrl:assetURL('vendor/wasm/'),isEvalSupported:false,enableXfa:false});
  const abort=()=>{void loading.destroy().catch(()=>{});};signal?.addEventListener('abort',abort,{once:true});
  try{
   const document=await loading.promise;signal?.throwIfAborted();
   const count=document.numPages,first=await document.getPage(1);signal?.throwIfAborted();
   const base=first.getViewport({scale:1}),dimensions=Array(count).fill(base);
   for(let start=1;start<count;start+=24){const entries=await Promise.all(Array.from({length:Math.min(24,count-start)},async(_,i)=>{const n=start+i;return [n,(await document.getPage(n+1)).getViewport({scale:1})];}));signal?.throwIfAborted();for(const [n,size] of entries)dimensions[n]=size;}
   // Commit only a complete, uncancelled document. Older loads cannot rebuild a retry.
   this.version++;this.observer?.disconnect();for(const job of this.jobs.values())job.task?.cancel();this.jobs.clear();
   const previous=this.loading;this.loading=loading;this.document=document;this.count=count;this.markers=markers;this.base=base;this.dimensions=dimensions;
   if(previous)void previous.destroy().catch(()=>{});
   this.build();return this.count;
  }catch(error){void loading.destroy().catch(()=>{});signal?.throwIfAborted();throw error;}
  finally{signal?.removeEventListener('abort',abort);}
 }
 // Use the PDF.js module loaded by this opening path for text layers.
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
}
