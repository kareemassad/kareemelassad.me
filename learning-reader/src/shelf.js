import {assetURL} from './assets.js';
import {sha256,MAX_PDF_BYTES} from './book-bundle.js';
import {createReaderBook,readReaderBook} from './protocol-book-bundle.js';
import {SOURCE} from './passages.js';
import {ProgressStore} from './progress.js';
import {LocalLibrary,storageMessage} from './library-store.js';
import {PackCatalog} from './pack-catalog.js';
import {readerBooks,visibleReaderBook,restoredReaderBook} from './reader-books.js';
const $=id=>document.getElementById(id);
const ribbon='<svg viewBox="0 0 18 24" aria-hidden="true"><path d="M3 2h12v19l-6-4-6 4z"/></svg>';
const art='<svg viewBox="0 0 200 130" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7"><ellipse cx="100" cy="65" rx="76" ry="29"/><ellipse cx="100" cy="65" rx="29" ry="59"/><ellipse cx="100" cy="65" rx="65" ry="39" transform="rotate(-28 100 65)"/><ellipse cx="100" cy="65" rx="65" ry="39" transform="rotate(28 100 65)"/><path d="M19 65h162M100 4v122" stroke-dasharray="2 4"/><circle cx="100" cy="65" r="7"/></g><circle cx="165" cy="39" r="3" fill="currentColor"/></svg>';
const defaultBook=readerBooks[0];
export class BookShelf{
 constructor({load,capture,suspend,resume,configuration={},catalogFactory}){
  this.library=new LocalLibrary();this.catalog=catalogFactory?catalogFactory(this.library):new PackCatalog(this.library,{configuration});this.configuration=configuration;this.pendingSourceId=null;this.load=load;this.capture=capture;this.suspend=suspend;this.resume=resume;this.mode='shelf';this.current=null;this.timer=0;this.loaded=false;
  let storage;try{storage=localStorage;}catch{}
  this.progress=new ProgressStore(storage);this.books=new Map((configuration.mode==='static'?configuration.books.map(book=>[book.id,book]):readerBooks.map(book=>[book.id,{...book}])));this.motion=matchMedia('(prefers-reduced-motion: reduce)');
  $('bookmark-close').innerHTML=ribbon;$('bookmark-close').addEventListener('click',()=>this.close(true));$('back-to-shelf').addEventListener('click',()=>this.close(false));
  $('shelf-open-pdf').addEventListener('click',()=>$('pdf-file').click());
  $('export-progress').addEventListener('click',()=>this.export());$('import-progress').addEventListener('click',()=>$('progress-file').click());
  $('progress-file').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';if(!file||this.mode!=='shelf')return;try{if(file.size>1000000)throw Error('Progress file is too large.');const result=this.progress.import(await file.text());this.render();this.notice(result.ok?'Progress imported.':result.error,!result.ok);}catch(error){this.notice(error.message,true);}});
  addEventListener('pagehide',()=>this.save());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.save();});
  this.render();this.setMode('shelf');if(this.progress.error)this.notice(this.progress.error,true);
  this.restored=this.restoreBooks();this.setupPacks();this.setupPortable();
  addEventListener('resize',()=>this.resizeTransition());
 }
 setupPacks(){
  const render=()=>{$('pack-list').replaceChildren();for(const p of this.catalog.packs.values()){const row=document.createElement('div'),label=document.createElement('span'),button=document.createElement('button');label.textContent=p.source.title+' · v'+p.version+' · '+p.passages.length+' passage'+(p.passages.length===1?'':'s')+' · '+(p.validation.workflow?.status==='unreviewed'?'Awaiting review':p.validation.workflow?.review?.type==='agent'?'Agent review':'Source audit')+' · PDF '+p.coverage.map(c=>c.start.page+'–'+c.end.page).join(', ');button.textContent='Export';button.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=p.id+'-v'+p.version+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});row.append(label,button);$('pack-list').append(row);}const sessions=$('reading-sessions');sessions.replaceChildren();for(const session of this.catalog.sessions){const row=document.createElement('article'),title=document.createElement('strong'),detail=document.createElement('p'),gaps=document.createElement('p'),review=document.createElement('a'),start=document.createElement('button');row.dataset.session=session.id;title.textContent=session.title;detail.textContent=session.status+' · PDF '+session.pages.join(', ')+' · '+session.aids+' aids';gaps.textContent='Gaps: '+session.gaps.map(g=>g.title).join('; ')+'. Most of the book is unprepared.';review.href=assetURL(session.reviewUrl);review.target='_blank';review.rel='noopener';review.textContent='Coverage and review evidence';start.textContent='Start prepared session';start.disabled=session.status!=='ready';start.addEventListener('click',()=>{const book=this.books.get(session.source.sha256);if(!book)return;$('packs-dialog').close();this.open(book,{position:session.start});});row.append(title,detail,gaps,review,start);sessions.append(row);}const bounded=$('bounded-sections');bounded.replaceChildren();for(const section of this.catalog.sections){const row=document.createElement('article'),title=document.createElement('strong'),detail=document.createElement('p'),review=document.createElement('a'),start=document.createElement('button');row.dataset.section=section.id;title.textContent=section.title;detail.textContent=section.status+' · PDF '+section.pages.join(', ')+(section.coverage?' · '+section.coverage.acceptedPercent+'% accepted bounded coverage':'');review.href=assetURL(section.reviewUrl);review.target='_blank';review.rel='noopener';review.textContent='Source intervals and review';start.textContent='Read prepared section';start.disabled=!['ready','ready-with-gaps'].includes(section.status);start.addEventListener('click',()=>{const book=this.books.get(section.source.sha256);if(!book)return;$('packs-dialog').close();this.open(book,{position:{...section.start,y:Math.min(1,section.start.y+.005)}});});row.append(title,detail);if(section.error){const error=document.createElement('p');error.textContent=section.error;row.append(error);}for(const part of section.parts){const p=document.createElement('p');p.textContent=part.status+' · '+part.title;row.append(p);}row.append(review,start);bounded.append(row);}const jobs=$('preparation-jobs');jobs.replaceChildren();for(const j of this.catalog.jobs){const row=document.createElement('article'),title=document.createElement('strong'),detail=document.createElement('p'),link=document.createElement('a');title.textContent=j.title;detail.textContent=j.status+' · PDF '+(j.selection||[]).join(', ')+' · '+j.attempts+' proposal attempt'+(j.attempts===1?'':'s')+(j.provenance?.provider?' · '+j.provenance.provider:'');link.textContent='Source and diagram review';link.href=assetURL(j.reviewUrl);link.target='_blank';link.rel='noopener';row.append(title,detail,link);if(j.error){const error=document.createElement('p');error.textContent=j.error;row.append(error);}jobs.append(row);}};
  $('manage-packs').addEventListener('click',async()=>{await this.catalog.ready;await this.catalog.refreshPrepared();render();$('pack-status').textContent=this.catalog.warning;$('packs-dialog').showModal();});$('import-pack').addEventListener('click',()=>$('pack-file').click());
  $('pack-file').addEventListener('change',async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>1000000)throw Error('Pack is too large.');const result=await this.catalog.import(await file.text());render();$('pack-status').textContent=result.saved?'Pack saved locally. Its source anchors are checked when the matching PDF opens.':'Pack is available for this session only. Local storage is unavailable.';}catch(error){$('pack-status').textContent=error.message;}});
 }
 setupPortable(){
  $('import-book').addEventListener('click',()=>$('book-file').click());
  $('book-file').addEventListener('change',async event=>{const file=event.target.files[0];event.target.value='';if(!file||this.mode!=='shelf')return;try{await this.importPrepared(file);}catch(error){this.notice(error.message,true);}});
  $('export-book').addEventListener('click',async()=>{await this.catalog.ready;await this.catalog.refreshPrepared();$('export-book-select').replaceChildren();for(const book of this.books.values()){if(!this.preparedPacks(book.id).length)continue;const option=document.createElement('option');option.value=book.id;option.textContent=book.title;$('export-book-select').append(option);}if(!$('export-book-select').options.length){this.notice('No reviewed prepared book is available to export.',true);return;}$('include-source').checked=false;$('book-export-status').textContent='The default export contains aids and a bookmark. It contains no PDF.';$('book-export-dialog').showModal();});
  $('download-book').addEventListener('click',async()=>{const button=$('download-book');button.disabled=true;try{const book=this.books.get($('export-book-select').value),includeSource=$('include-source').checked;let source=book.file;if(includeSource&&!source&&book.persistent)source=(await this.library.getBook(book.id)).file;if(includeSource&&!source&&book.localUrl){const response=await fetch(assetURL(book.localUrl));if(response.ok)source=await response.blob();}const record=this.progress.get(book.id),blob=await createReaderBook({book:{...book,cover:book.cover==='orbit'?'plain':book.cover},packs:this.preparedPacks(book.id),progress:record?{version:1,books:{[book.id]:record}}:null,source,includeSource});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='prepared-'+book.id.slice(0,12)+(includeSource?'-with-pdf':'')+'.prepared-book';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('book-export-status').textContent=includeSource?'Exported with your PDF included.':'Exported without a PDF. Import the matching source when opening elsewhere.';}catch(error){$('book-export-status').textContent=error.message;}finally{button.disabled=false;}});
  $('storage-details').addEventListener('click',async()=>{try{const estimate=await navigator.storage?.estimate();$('storage-status').textContent=estimate?'Browser storage: about '+(estimate.usage/1048576).toFixed(1)+' MiB used of '+(estimate.quota/1048576).toFixed(0)+' MiB available. This includes offline assets; the browser can clear stored data. Local PDFs are limited to 128 MiB each.':'Storage estimates are unavailable. Keep the original PDF and export a prepared book.';}catch{$('storage-status').textContent='Storage estimates are unavailable. Keep your original PDF.';}});
 }
 preparedPacks(id){return [...this.catalog.packs.values()].filter(p=>p.source.sha256===id&&this.catalog.compatible(p)&&!this.catalog.jobs.some(j=>j.id===p.validation.workflow?.jobId&&j.status!=='accepted'));}
 async importPrepared(file){
  await this.catalog.ready;const {manifest,source}=await readReaderBook(file),packs=this.catalog.preflight(manifest.packs),known=this.books.get(manifest.source.sha256),book={...known,...manifest.book,id:manifest.source.sha256,pages:manifest.source.pages};if(source)book.file=new File([source],book.title+'.pdf',{type:'application/pdf'});
  let saved=false;try{const record=await this.library.putPreparedBook(book,source?book.file:null,packs);book.persistent=true;book.requiresSource=!record.blob;saved=true;}catch{book.persistent=!!known?.persistent&&!source;book.requiresSource=!book.file&&!book.persistent;}
  this.catalog.applyPrepared(packs);this.books.set(book.id,book);let progressSaved=true;if(manifest.progress)progressSaved=this.progress.import(JSON.stringify(manifest.progress)).ok;this.render();this.notice(saved&&progressSaved?'Prepared book saved in this browser. '+(book.requiresSource?'Import the matching PDF to read.':'Its exact source and bookmark are ready.'):'Prepared book is available for this session. Browser storage could not save everything; keep your export.',!saved||!progressSaved);
 }
 async restoreBooks(){
  try{for(const record of await this.library.listBooks()){this.books.set(record.id,restoredReaderBook(record,this.books.get(record.id)));}this.render();}catch{this.notice('Local book storage is unavailable. Imported PDFs will be session copies.',true);}
 }
 async remember(book){
  const known=this.books.get(book.id);if(known?.builtin)Object.assign(book,{...known,file:book.file,persistent:book.persistent,requiresSource:book.requiresSource});if(!book.file||book.persistent)return;
  try{await this.library.putBook(book,book.file);book.persistent=true;book.requiresSource=false;this.importNotice='PDF saved in this browser. No upload.';}catch(error){book.persistent=false;this.importNotice=storageMessage(error);this.notice(this.importNotice,true);}
 }
 notice(text,error=false){$('shelf-notice').textContent=text;$('shelf-notice').hidden=!text;$('shelf-notice').classList.toggle('save-error',error);$('save-state').textContent=error?'Not saved to browser':'';$('save-state').hidden=!error;}
 setMode(mode){this.mode=mode;document.body.dataset.view=mode;$('shelf').inert=mode!=='shelf';$('reader-shell').inert=mode!=='reader';$('bookmark-close').disabled=mode!=='reader';$('back-to-shelf').disabled=mode!=='reader';}
 cover(book){
  const span=document.createElement('span');span.className='cover-front';if(book.coverUrl){span.classList.add('pdf-cover');const image=document.createElement('img');image.src=assetURL(book.coverUrl);image.alt=book.title+' · actual PDF cover';image.draggable=false;span.append(image);return span;}if(book.cover==='network')span.classList.add('network-cover');
  span.innerHTML='<span class="cover-volume"></span><span class="cover-title"></span><span class="cover-art">'+art+'</span><span class="cover-rule"></span><span class="cover-subtitle"></span><span class="cover-imprint">PERSONAL READING COPY</span>';
  span.querySelector('.cover-volume').textContent=book.cover==='orbit'?'ORIGINAL NOTES':book.id===defaultBook?.id?'VOLUME II':book.builtin?'COMPUTER SCIENCE':'LOCAL PDF';
  if(book.cover==='network')span.querySelector('.cover-art').innerHTML='<svg viewBox="0 0 200 130" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M100 12L166 60L142 118H58L34 60Z M100 12L58 118M100 12L142 118M34 60H166"/><circle cx="100" cy="12" r="7"/><circle cx="166" cy="60" r="7"/><circle cx="142" cy="118" r="7"/><circle cx="58" cy="118" r="7"/><circle cx="34" cy="60" r="7"/></g></svg>';if(book.cover==='transactions'){span.classList.add('transaction-cover');span.querySelector('.cover-art').innerHTML='<svg viewBox="0 0 200 130" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".9"><rect x="18" y="25" width="64" height="80"/><rect x="118" y="25" width="64" height="80"/><path d="M18 50H82M18 77H82M118 50H182M118 77H182M82 39H118M82 91H118M100 39V91"/><circle cx="100" cy="65" r="5"/></g></svg>';}if(book.cover==='orbit')span.querySelector('.cover-art').innerHTML='<svg viewBox="0 0 200 130" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".7"><circle cx="100" cy="66" r="37"/><ellipse cx="100" cy="66" rx="65" ry="49" transform="rotate(-25 100 66)"/><ellipse cx="100" cy="66" rx="17" ry="37"/><path d="M63 66h74"/></g><circle cx="155" cy="31" r="3" fill="currentColor"/></svg>';span.querySelector('.cover-title').textContent=book.title;span.querySelector('.cover-subtitle').textContent=book.subtitle||'Your local reading copy';return span;
 }
 render(){
  $('book-row').replaceChildren();
  const visible=[...this.books.values()].filter(book=>visibleReaderBook(book,this.configuration));
  for(const book of visible){
   const record=this.progress.get(book.id),card=document.createElement('article');card.className='book-card';card.dataset.book=book.id;
   const button=document.createElement('button');button.className='physical-book';button.classList.toggle('transition-owned',book.id===this.transitionBookId);button.setAttribute('aria-label',(record?'Continue reading ':'Open ')+book.title);button.append(this.cover(book));
   const spine=document.createElement('span');spine.className='book-spine';button.append(spine);const pages=document.createElement('span');pages.className='book-edges';button.append(pages);
   if(record?.bookmark){const mark=document.createElement('span');mark.className='shelf-ribbon';mark.innerHTML=ribbon;button.append(mark);}
   button.addEventListener('click',()=>this.open(book));card.append(button);
   const label=document.createElement('div');label.className='book-label';
   const title=document.createElement('h2');title.textContent=book.title;const subtitle=document.createElement('p');subtitle.textContent=book.builtin?book.subtitle:book.persistent?'Saved in this browser':book.file?'Session copy - not saved':book.subtitle||'Local PDF';
   const progress=document.createElement('p');progress.className='book-place';progress.textContent=record?`Continue · Page ${record.position.page} of ${book.pages}`:'Open book';
   label.append(title,subtitle,progress);if(book.chapterStart){const start=document.createElement('button');start.className='chapter-start';start.textContent='Read Chapter 5 · Replication';start.addEventListener('click',()=>this.open(book,{position:book.chapterStart}));label.append(start);}card.append(label);
   if(book.persistent&&book.id!=='pending'){const remove=document.createElement('button');remove.className='remove-book';remove.textContent='Remove local copy';remove.title='Remove this browser copy; your original file and saved progress remain';remove.addEventListener('click',async()=>{if(this.mode!=='shelf')return;try{if(book.persistent)await this.library.removeBook(book.id);if(book.builtin||this.configuration.mode==='static'){this.books.set(book.id,{...book,file:null,persistent:false,requiresSource:!book.localUrl&&this.configuration.mode==='static'});}else this.books.delete(book.id);if(this.current?.id===book.id)this.current=null;this.render();this.notice('Local copy removed. Your original file is unchanged.');}catch(error){this.notice('The local copy could not be removed.',true);}});card.append(remove);}$('book-row').append(card);
  }
  $('shelf-count').textContent=visible.length===1?'1 book':visible.length+' books';
  if($('shelf-empty'))$('shelf-empty').hidden=visible.length>0;
 }
 locate(book){return [...document.querySelectorAll('.book-card')].find(c=>c.dataset.book===book.id)?.querySelector('.physical-book');}
 async wait(ms){if(!this.motion.matches)await new Promise(resolve=>setTimeout(resolve,ms));}
 async frame(){await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));}
 ownTransition(book){this.transitionBookId=book.id;this.locate(book)?.classList.add('transition-owned');}
 releaseTransition(){this.transitionNode?.remove();this.transitionNode=null;this.transitionBookId=null;this.transitionPhase=null;delete document.body.dataset.readerReveal;for(const book of document.querySelectorAll('.transition-owned'))book.classList.remove('transition-owned');}
 async settle(node,property,limit=1000){
  const properties=Array.isArray(property)?property:[property],started=performance.now();
  do{
   await this.frame();if(this.motion.matches)return;
   const animations=node.getAnimations().filter(a=>properties.includes(a.transitionProperty)&&a.playState!=='finished');if(!animations.length)return;
   let timer;try{await Promise.race([Promise.all(animations.map(a=>a.finished.catch(()=>{}))),new Promise(resolve=>{timer=setTimeout(resolve,Math.max(0,limit-(performance.now()-started)));})]);}finally{clearTimeout(timer);}
  }while(performance.now()-started<limit);
 }
 resizeTransition(){
  if(!this.transitionNode)return;
  const target=this.transitionPhase==='returning'?this.locate({id:this.transitionBookId})?.getBoundingClientRect():this.expanded();
  if(target)this.place(this.transitionNode,target);
 }
 async sourceFrame(){
  const started=performance.now();
  do{const pane=$('pdf-scroll').getBoundingClientRect();if([...$('pdf-scroll').querySelectorAll('.pdf-page.rendered canvas')].some(c=>{const r=c.getBoundingClientRect();return r.bottom>pane.top&&r.top<pane.bottom;}))return;await new Promise(resolve=>requestAnimationFrame(resolve));}while(performance.now()-started<2000);
 }
 makeTransition(book,rect,opened=false){
  const node=document.createElement('div');node.className='book-transition';node.setAttribute('aria-hidden','true');
  node.innerHTML='<div class="transition-pages"><div class="page-hint"></div></div><div class="transition-cover"></div><div class="transition-ribbon">'+ribbon+'</div>';
  node.querySelector('.transition-cover').append(this.cover(book));document.body.append(node);this.place(node,rect);if(opened)node.classList.add('cover-open');this.transitionNode=node;return node;
 }
 place(node,rect){for(const key of ['left','top','width','height'])node.style[key]=rect[key]+'px';}
 expanded(){const pane=$('pdf-scroll').getBoundingClientRect(),inset=12;return {width:Math.max(180,pane.width-inset*2),height:Math.max(180,pane.height-inset*2),left:pane.left+inset,top:pane.top+inset};}
 snapshot(node){
  const target=this.expanded(),pane=$('pdf-scroll').getBoundingClientRect(),snapshot=document.createElement('div');snapshot.className='source-snapshot';
  for(const canvas of $('pdf-scroll').querySelectorAll('canvas')){const rect=canvas.getBoundingClientRect();if(rect.bottom<pane.top||rect.top>pane.bottom)continue;const img=document.createElement('img');img.alt='';img.src=canvas.toDataURL();Object.assign(img.style,{left:rect.left-target.left+'px',top:rect.top-target.top+'px',width:rect.width+'px',height:rect.height+'px'});snapshot.append(img);}
  node.querySelector('.transition-pages').append(snapshot);
 }
 async open(book,{position}={}){
  if(this.mode!=='shelf')return;position??=this.progress.get(book.id)?.position||book.initialPosition;if(book.requiresSource){this.pendingSourceId=book.id;this.notice('Choose the matching PDF for this prepared book. The exact source hash is checked.');$('pdf-file').click();return;}const button=this.locate(book);if(!button)return;this.ownTransition(book);this.setMode('opening');this.suspend();this.notice('');
  const transition=this.makeTransition(book,button.getBoundingClientRect());this.transitionPhase='expanding';
  await this.frame();this.place(transition,this.expanded());const expanding=this.settle(transition,['left','top','width','height'],1000);
  try{
   if(book.persistent&&!book.file){try{book={...book,...await this.library.getBook(book.id)};}catch(error){if(!book.localUrl)throw error;book={...book,persistent:false};}}
   const result=await this.load(position?{...book,openingPosition:position}:book);if(!result)throw Error('The PDF could not be opened.');
   this.current={...book,...result};await this.remember(this.current);this.books.set(this.current.id,this.current);this.loaded=true;await expanding;await this.sourceFrame();this.snapshot(transition);this.transitionPhase='unfolding';transition.classList.add('cover-open');await this.settle(transition.querySelector('.transition-cover'),'transform',850);
   document.body.dataset.readerReveal='true';transition.classList.add('handoff');await this.settle(transition,'opacity',350);this.releaseTransition();this.setMode('reader');this.resume();this.save();if(this.importNotice){this.notice(this.importNotice,!this.current.persistent);this.importNotice='';}$('pdf-scroll').focus({preventScroll:true});return true;
  }catch(error){this.releaseTransition();this.loaded=false;this.current=null;this.setMode('shelf');this.notice(error.message,true);this.locate(book)?.focus({preventScroll:true});return false;}
 }
 async openFile(file){
  if(!['shelf','reader'].includes(this.mode))return;if(file.size>MAX_PDF_BYTES){this.notice('This reader supports local PDFs up to 128 MiB.',true);return;}
  if(this.pendingSourceId){const expected=this.pendingSourceId;if(await sha256(file)!==expected){this.notice('That PDF does not match this prepared book. Choose the exact source file.',true);return;}const book=this.books.get(expected);this.pendingSourceId=null;await this.open({...book,file,persistent:false,requiresSource:false});return;}
  if(this.mode==='shelf'){
   const id=await sha256(file),known=this.books.get(id)||readerBooks.find(b=>b.id===id);
   const book={...known,id,title:known?.title||file.name.replace(/\.pdf$/i,''),file,persistent:false,requiresSource:false,subtitle:known?.subtitle||'Local PDF'};this.books.set(id,book);this.render();const opened=await this.open(book);if(opened===false&&!known){this.books.delete(id);this.render();$('shelf-open-pdf').focus({preventScroll:true});}return;
  }
  this.setMode('opening');this.suspend();
  try{const result=await this.load({file});if(result){this.current={...result,file,subtitle:'Local PDF'};await this.remember(this.current);this.books.set(result.id,this.current);this.loaded=true;}this.setMode('reader');this.resume();this.save();if(this.importNotice){this.notice(this.importNotice,!this.current.persistent);this.importNotice='';}}catch(error){this.setMode('reader');this.resume();this.notice(error.message,true);}
 }
 changed(){if(this.mode!=='reader'||!this.current)return;clearTimeout(this.timer);this.timer=setTimeout(()=>this.save(),350);}
 save(bookmark=false){
  clearTimeout(this.timer);if(!this.current||!this.loaded||!['reader','closing'].includes(this.mode))return;
  const result=this.progress.save(this.current.id,this.current,this.capture(),bookmark);if(!result.ok)this.notice(result.error,true);else{$('save-state').hidden=true;}
  return result;
 }
 async close(bookmark){
  if(this.mode!=='reader')return;this.suspend();const result=this.save(bookmark);this.ownTransition(this.current);this.render();const transition=this.makeTransition(this.current,this.expanded(),true);this.snapshot(transition);this.setMode('closing');this.transitionPhase='folding';
  try{
   if(bookmark)transition.classList.add('has-ribbon');await this.frame();transition.classList.remove('cover-open');await this.settle(transition.querySelector('.transition-cover'),'transform',850);
   this.transitionPhase='returning';const target=this.locate(this.current);if(target){target.closest('.book-card').scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});this.place(transition,target.getBoundingClientRect());await this.settle(transition,['left','top','width','height'],1000);}
  }finally{this.releaseTransition();this.setMode('shelf');}
  history.replaceState(null,'',location.pathname);this.notice(result?.ok?(bookmark?'Bookmark saved':'Place saved')+` · PDF page ${this.progress.get(this.current.id).position.page}`:result?.error||'Place kept for this session.',!result?.ok);this.locate(this.current)?.focus({preventScroll:true});
 }
 export(){const blob=new Blob([this.progress.export()],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='reading-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);this.notice('Progress exported. This file contains reading positions, not PDFs.');}
}
