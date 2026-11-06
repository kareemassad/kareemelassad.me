import {assetURL} from './assets.js';
export const feynmanReferenceBook={id:'6d9d04812712a5029bc0f9a04e893cb4c8a3c638ede7d8ff13fb71edac9249af',title:'Feynman · Interactive Volume I',subtitle:'Chapters 1–14 · Text and interactive models',pages:138,cover:'orbit',builtin:true,requiresSource:false,reference:true};
export async function installFeynmanReference(shelf,configuration){
 if(configuration.mode==='static'&&!configuration.referenceFeynman)return;
 await shelf.restored;shelf.books.set(feynmanReferenceBook.id,{...feynmanReferenceBook,builtin:false});shelf.render();
 let panel=null,frame=null,position={page:1,y:0},ready=null,finish=null;
 const methods=Object.fromEntries(['load','capture','suspend','resume','expanded','sourceFrame','snapshot','setMode'].map(k=>[k,shelf[k].bind(shelf)]));
 const remove=()=>{panel?.remove();panel=null;frame=null;delete document.body.dataset.referenceReader;};
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==frame?.contentWindow||event.data?.type!=='feynman-position')return;
  const {page,y}=event.data;if(!Number.isInteger(page)||page<1||page>138||!Number.isFinite(y)||y<0||y>1)return;
  position={page,y};finish?.();finish=null;shelf.changed();
 });
 shelf.load=async book=>{
  if(book.id!==feynmanReferenceBook.id){remove();return methods.load(book);}
  remove();position=book.openingPosition||{page:1,y:0};
  try{localStorage.setItem('learning-reader:feynman:pos',JSON.stringify({page:position.page-1,y:position.y}));}catch{}
  document.body.dataset.referenceReader='true';panel=document.createElement('section');panel.id='reference-reader';
  const bar=document.createElement('div');bar.className='reference-toolbar';const close=document.createElement('button');close.textContent='Save and close book';close.addEventListener('click',()=>shelf.close(true));
  const title=document.createElement('strong');title.textContent='Feynman · Volume I';const credit=document.createElement('a');credit.href='https://huggingface.co/spaces/mishig/feynman-interactive';credit.target='_blank';credit.rel='noopener';credit.textContent='Interactive edition by mishig';bar.append(close,title,credit);
  frame=document.createElement('iframe');frame.title='Feynman Volume I: textbook and interactive models';frame.src=assetURL('reference/feynman/index.html');
  ready=new Promise(resolve=>{finish=resolve;});panel.append(bar,frame);document.getElementById('reader-shell').append(panel);
  let timer;try{await Promise.race([ready,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('The interactive book could not load. Please retry.')),45000);})]);}catch(e){remove();throw e;}finally{clearTimeout(timer);}
  return {id:book.id,title:book.title,pages:138};
 };
 shelf.capture=()=>frame?{...position,zoom:'fit',split:50,left:0}:methods.capture();
 shelf.suspend=()=>{if(!frame)methods.suspend();};shelf.resume=()=>{if(!frame)methods.resume();};
 shelf.expanded=()=>frame?frame.getBoundingClientRect():methods.expanded();
 shelf.sourceFrame=()=>frame?ready:methods.sourceFrame();shelf.snapshot=node=>{if(!frame)methods.snapshot(node);};
 shelf.setMode=mode=>{methods.setMode(mode);if(mode==='shelf')remove();};
}
