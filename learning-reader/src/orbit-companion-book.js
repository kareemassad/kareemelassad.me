import {assetURL} from './assets.js';
export async function installOrbitCompanion(shelf,configuration){
 let data;try{const response=await fetch(assetURL('src/orbit-companion-data.json'));if(!response.ok)return;data=await response.json();}catch{return;}
 const {source,passages}=data.envelope.pack;
 const book={id:source.sha256,title:'Falling into orbit',subtitle:'Original companion notes · Newtonian gravity',pages:source.pages,localUrl:assetURL('src/books/orbit-companion.pdf'),cover:'orbit',builtin:false,initialPosition:{page:1,y:passages[0].y+.005}};
 const open=async()=>{await shelf.restored;shelf.books.set(book.id,{...book,revealAuxiliary:true});shelf.render();await shelf.open(book);};
 const button=document.createElement('button');button.type='button';button.textContent='Read original gravity companion';button.addEventListener('click',open);
 document.querySelector('.library-options-panel')?.prepend(button);
 if(shelf.progress.get(book.id)){await shelf.restored;shelf.books.set(book.id,book);shelf.render();}
 if(configuration.mode==='static'&&shelf.books.has(book.id))shelf.books.set(book.id,{...shelf.books.get(book.id),...book});
 if(new URLSearchParams(location.search).get('lesson')==='gravity')await open();
}
