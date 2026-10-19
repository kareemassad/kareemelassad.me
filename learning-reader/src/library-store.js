// Browser-local copies only. No network calls, paths, or account identifiers.
export function storageMessage(error){return error?.name==='QuotaExceededError'?'Not enough browser storage. This PDF is available for this session only. Free space or remove a local copy, then import it again.':'The local PDF copy could not be saved. It is available for this session only.';}
export class LocalLibrary{
 constructor(api=globalThis.indexedDB){
  this.ready=new Promise((resolve,reject)=>{
   if(!api){reject(new Error('Local book storage is unavailable.'));return;}
   const request=api.open('visual-reader-library',1);
   request.onupgradeneeded=()=>{for(const name of ['books','packs'])if(!request.result.objectStoreNames.contains(name))request.result.createObjectStore(name,{keyPath:'id'});};
   request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Close another reader tab and retry.'));
  });this.ready.catch(()=>{});
 }
 async read(store,id){const db=await this.ready;return new Promise((resolve,reject)=>{const request=db.transaction(store).objectStore(store)[id===undefined?'getAll':'get'](id);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
 async write(store,value,remove=false){const db=await this.ready;return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');try{tx.objectStore(store)[remove?'delete':'put'](value);}catch(e){reject(e);return;}tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Local save was cancelled.'));});}
 listBooks(){return this.read('books');}
 async getBook(id){const b=await this.read('books',id);if(!b?.blob)throw Error('The matching PDF is missing. Import it again.');return {...b,file:new File([b.blob],b.name,{type:'application/pdf'}),persistent:true};}
 async putBook(book,file){
  if(!/^[a-f0-9]{64}$/.test(book.id)||!(file instanceof Blob)||!Number.isInteger(book.pages))throw Error('Invalid local book.');
  const record={id:book.id,title:book.title,pages:book.pages,name:file.name||book.title+'.pdf',subtitle:'Local PDF',blob:file,importedAt:new Date().toISOString()};await this.write('books',record);return record;
 }
 removeBook(id){if(!/^[a-f0-9]{64}$/.test(id))throw Error('Invalid local book.');return this.write('books',id,true);}
 listPacks(){return this.read('packs');}
 putPack(pack){return this.write('packs',{id:pack.source.sha256+':'+pack.id,pack});}
 async putPreparedBook(book,file,packs){
  const db=await this.ready;return new Promise((resolve,reject)=>{const tx=db.transaction(['books','packs'],'readwrite'),books=tx.objectStore('books'),request=books.get(book.id);let record;
   request.onsuccess=()=>{try{const previous=request.result;record={id:book.id,title:book.title,pages:book.pages,name:file?.name||previous?.name||book.title+'.pdf',subtitle:book.subtitle||'Prepared book',cover:book.cover||'plain',blob:file||previous?.blob||null,importedAt:new Date().toISOString()};books.put(record);for(const pack of packs)tx.objectStore('packs').put({id:pack.source.sha256+':'+pack.id,pack});}catch(error){tx.abort();reject(error);}};
   tx.oncomplete=()=>resolve(record);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Prepared-book save was cancelled.'));
  });
 }
}
