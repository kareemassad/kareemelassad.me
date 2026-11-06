import {ddiaBook} from './reader-books.js';
import {assetURL} from './assets.js';
export const feynmanReferenceBook={id:'6d9d04812712a5029bc0f9a04e893cb4c8a3c638ede7d8ff13fb71edac9249af',title:'Feynman · Interactive Volume I',subtitle:'Chapters 1–14 · Text and interactive models',pages:138,cover:'orbit',builtin:true,requiresSource:false,reference:true};
export async function installFeynmanReference(shelf,configuration){
 if(configuration.mode==='static'&&!configuration.referenceFeynman)return;
 await shelf.restored;shelf.books.set(feynmanReferenceBook.id,{...feynmanReferenceBook,builtin:false});shelf.render();
 let currentBook=feynmanReferenceBook,panel=null,frame=null,position={page:1,y:0},ready=null,finish=null,resumePlayback=false,parkedPosition=null;
 const methods=Object.fromEntries(['load','capture','suspend','resume','sourceSurface','setMode'].map(k=>[k,shelf[k].bind(shelf)]));
 const active=()=>!!frame&&panel.style.visibility!=='hidden';
 const pause=()=>{const play=frame?.contentDocument?.getElementById('play');if(play?.textContent.trim()==='Pause'){resumePlayback=true;play.click();}};
 const remove=()=>{panel?.remove();panel=null;frame=null;resumePlayback=false;delete document.body.dataset.referenceReader;};
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==frame?.contentWindow||event.data?.type!=='feynman-position')return;
  const {page,y}=event.data;if(!Number.isInteger(page)||page<1||page>currentBook.pages||!Number.isFinite(y)||y<0||y>1)return;
  position={page,y};const input=panel?.querySelector('.reference-page-jump input');if(input&&document.activeElement!==input)input.value=String(page);finish?.();finish=null;shelf.changed();
 });
 shelf.load=async book=>{
  if(![feynmanReferenceBook.id,ddiaBook.id].includes(book.id)){remove();return methods.load(book);}
  const isDDIA=book.id===ddiaBook.id;
  if(frame&&currentBook.id===book.id&&panel.style.visibility==='hidden'&&!book.explicitPosition&&(!book.openingPosition||(parkedPosition?.page===book.openingPosition.page&&Math.abs(parkedPosition.y-book.openingPosition.y)<.000001))){panel.style.visibility='';panel.inert=false;frame.contentWindow.postMessage({type:'reader-visibility',visible:true},location.origin);document.body.dataset.referenceReader='true';return {id:book.id,title:book.title,pages:book.pages};}
  remove();currentBook=book;position=book.openingPosition||(isDDIA?{page:167,y:.155}:{page:1,y:0});
  try{localStorage.setItem('learning-reader:'+(isDDIA?'ddia-interactive-v2':'feynman')+':pos',JSON.stringify({page:position.page-1,y:position.y}));}catch{}
  document.body.dataset.referenceReader='true';panel=document.createElement('section');panel.id='reference-reader';
  const bar=document.createElement('div');bar.className='reference-toolbar';const close=document.createElement('button');close.textContent='Save and close book';close.addEventListener('click',()=>shelf.close(true));
  const title=document.createElement('strong');title.textContent=isDDIA?'DDIA · Replication':'Feynman · Volume I';const credit=document.createElement('a');credit.href='https://huggingface.co/spaces/mishig/feynman-interactive';credit.target='_blank';credit.rel='noopener';credit.textContent=isDDIA?'Reader based on mishig’s Feynman edition':'Interactive edition by mishig';const jump=document.createElement('form');jump.className='reference-page-jump';const input=document.createElement('input');input.type='number';input.min='1';input.max=String(book.pages);input.value=String(position.page);input.setAttribute('aria-label','PDF page');const go=document.createElement('button');go.textContent='Go';go.title='Go to PDF page';jump.append(input,go);jump.addEventListener('submit',event=>{event.preventDefault();const page=Number(input.value);if(Number.isInteger(page)&&page>=1&&page<=book.pages)frame.contentWindow.postMessage({type:'reader-go-to-page',page},location.origin);});bar.append(close,title,jump,credit);
  frame=document.createElement('iframe');frame.title=book.title+': textbook and interactive models';frame.src=assetURL('interactive/index.html')+(isDDIA?'?book=ddia':'');
  ready=new Promise(resolve=>{finish=resolve;});panel.append(bar,frame);document.getElementById('reader-shell').append(panel);
  let timer;try{await Promise.race([ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('The interactive book could not load. Please retry.')),45000);})]);}catch(e){remove();throw e;}finally{clearTimeout(timer);}
  return {id:book.id,title:book.title,pages:book.pages};
 };
 shelf.capture=()=>active()?{...position,zoom:'fit',split:50,left:0}:methods.capture();
 shelf.suspend=()=>{if(active()){parkedPosition={...position};pause();}else methods.suspend();};
 shelf.resume=()=>{if(active()){const play=frame.contentDocument?.getElementById('play');if(resumePlayback&&play?.textContent.trim()==='Play')play.click();resumePlayback=false;}else methods.resume();};
 shelf.sourceSurface=()=>{
  const pane=frame?.contentDocument?.getElementById('reader');if(!pane)return methods.sourceSurface();
  const {left,top}=frame.getBoundingClientRect();return {pane,canvases:[...pane.querySelectorAll('.page canvas')],left,top};
 };
 shelf.setMode=mode=>{methods.setMode(mode);if(mode==='shelf'&&panel){pause();frame.contentWindow.postMessage({type:'reader-visibility',visible:false},location.origin);panel.style.visibility='hidden';panel.inert=true;delete document.body.dataset.referenceReader;}};
}
