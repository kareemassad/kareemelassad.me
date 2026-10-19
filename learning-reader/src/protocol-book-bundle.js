import {canonical} from './pack-schema.js';
import {validateReaderPack, isNativeReaderPack} from './reusable-explanation.js';
import {sha256,MAX_PDF_BYTES,MAX_MANIFEST_BYTES,createPreparedBook,readPreparedBook} from './book-bundle.js';
import {ProgressStore} from './progress.js';
const magic='RPLBK001',encoder=new TextEncoder();
const only=(object,keys)=>object&&typeof object==='object'&&!Array.isArray(object)&&Object.keys(object).every(key=>keys.includes(key));
function validateManifest(input){
 if(!only(input,['format','version','source','book','pack','packHash','progress','sourceIncluded','sourceBytes'])||input.format!=='replication-prepared-book'||input.version!==1)throw Error('Unsupported protocol book format.');
 if(!isNativeReaderPack(input.pack))throw Error('Unsupported reusable book package.');
 const pack=validateReaderPack(input.pack);
 if(pack.validation?.workflow?.status!=='accepted')throw Error('Export requires a reviewed reusable package.');
 if(!only(input.source,['sha256','pages'])||input.source.sha256!==pack.source.sha256||input.source.pages!==pack.source.pages||!/^[a-f0-9]{64}$/.test(input.packHash||''))throw Error('Protocol book source does not match its package.');
 const book=input.book;
 if(!only(book,['title','subtitle','cover'])||typeof book.title!=='string'||!book.title.trim()||book.title.length>240||typeof book.subtitle!=='string'||book.subtitle.length>240||!['plain','network','transactions'].includes(book.cover))throw Error('Invalid protocol book metadata.');
 if(typeof input.sourceIncluded!=='boolean'||!Number.isInteger(input.sourceBytes)||input.sourceBytes<0||input.sourceBytes>MAX_PDF_BYTES||input.sourceIncluded!==(input.sourceBytes>0))throw Error('Invalid protocol book source inclusion.');
 if(input.progress!==null){const store=new ProgressStore({getItem:()=>null,setItem:()=>{}});store.import(JSON.stringify(input.progress));const books=Object.entries(JSON.parse(store.export()).books);if(books.length!==1||books[0][0]!==input.source.sha256||books[0][1].pages!==input.source.pages)throw Error('Protocol bookmark belongs to a different source.');}
 return {...input,pack};
}
export async function createReaderBook(options){
 const {book,packs,progress=null,source=null,includeSource=false}=options;
 if(!packs.some(isNativeReaderPack))return createPreparedBook(options);
 if(packs.length!==1||!isNativeReaderPack(packs[0]))throw Error('Export protocol and legacy packages separately.');
 const pack=validateReaderPack(packs[0]);
 if(book.id!==pack.source.sha256||book.pages!==pack.source.pages)throw Error('Protocol book and package source differ.');
 if(includeSource&&(!(source instanceof Blob)||source.size<5||source.size>MAX_PDF_BYTES||await sha256(source)!==book.id))throw Error('Import the exact source PDF before including it.');
 const manifest=validateManifest({format:'replication-prepared-book',version:1,source:{sha256:book.id,pages:book.pages},book:{title:book.title,subtitle:book.subtitle||'Prepared local book',cover:book.cover||'plain'},pack,packHash:await sha256(canonical(pack)),progress,sourceIncluded:includeSource,sourceBytes:includeSource?source.size:0});
 const bytes=encoder.encode(JSON.stringify(manifest));if(bytes.length>MAX_MANIFEST_BYTES)throw Error('Protocol book metadata is too large.');
 const header=new Uint8Array(12);header.set(encoder.encode(magic));new DataView(header.buffer).setUint32(8,bytes.length);
 return new Blob([header,bytes,...(includeSource?[source]:[])],{type:'application/octet-stream'});
}
export async function readReaderBook(file){
 if(!(file instanceof Blob)||file.size<12)throw Error('Prepared book is missing or truncated.');
 const header=await file.slice(0,12).arrayBuffer();
 if(new TextDecoder().decode(new Uint8Array(header,0,8))!==magic)return readPreparedBook(file);
 if(file.size>MAX_PDF_BYTES+MAX_MANIFEST_BYTES+12)throw Error('Protocol book is too large.');
 const length=new DataView(header).getUint32(8);if(length<2||length>MAX_MANIFEST_BYTES||12+length>file.size)throw Error('Invalid protocol book header.');
 const data=validateManifest(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(await file.slice(12,12+length).arrayBuffer())));
 if(file.size!==12+length+data.sourceBytes||await sha256(canonical(data.pack))!==data.packHash)throw Error('Protocol book bytes changed or were truncated.');
 const source=data.sourceIncluded?file.slice(12+length):null;
 if(source&&await sha256(source)!==data.source.sha256)throw Error('Included PDF does not match the source fingerprint.');
 return {manifest:{source:data.source,book:data.book,packs:[data.pack],progress:data.progress},source};
}
