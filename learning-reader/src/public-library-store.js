import {LocalLibrary} from './library-store.js';

// Keep the storage module pinned by the original saved packages unchanged.
// This public adapter adds a cover rendered only from the user's local PDF.
export class PublicLibraryStore extends LocalLibrary{
 async putBook(book,file){
  if(!/^[a-f0-9]{64}$/.test(book.id)||!(file instanceof Blob)||!Number.isInteger(book.pages))throw Error('Invalid local book.');
  const record={id:book.id,title:book.title,pages:book.pages,name:file.name||book.title+'.pdf',subtitle:book.subtitle||'Local PDF',cover:book.cover||'plain',coverDataUrl:book.coverDataUrl||null,blob:file,importedAt:new Date().toISOString()};
  await this.write('books',record);return record;
 }
 async putPreparedBook(book,file,packs){
  const db=await this.ready;
  return new Promise((resolve,reject)=>{
   const tx=db.transaction(['books','packs'],'readwrite'),books=tx.objectStore('books'),request=books.get(book.id);let record;
   request.onsuccess=()=>{try{const previous=request.result;record={id:book.id,title:book.title,pages:book.pages,name:file?.name||previous?.name||book.title+'.pdf',subtitle:book.subtitle||'Prepared book',cover:book.cover||'plain',coverDataUrl:book.coverDataUrl||previous?.coverDataUrl||null,blob:file||previous?.blob||null,importedAt:new Date().toISOString()};books.put(record);for(const pack of packs)tx.objectStore('packs').put({id:pack.source.sha256+':'+pack.id,pack});}catch(error){tx.abort();reject(error);}};
   tx.oncomplete=()=>resolve(record);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Prepared-book save was cancelled.'));
  });
 }
}
