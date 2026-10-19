import {validatePack,canonical} from './pack-schema.js';
import {ProgressStore} from './progress.js';
export const MAX_PDF_BYTES=128*1024*1024,MAX_MANIFEST_BYTES=4*1024*1024,MAX_PREPARED_PACKS=256;
const magic='VRBK0001',encoder=new TextEncoder();
export async function sha256(data){const bytes=data instanceof Blob?await data.arrayBuffer():typeof data==='string'?encoder.encode(data):data;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');}
const only=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(k=>keys.includes(k));
export function validatePreparedManifest(value){
 if(!only(value,['format','version','source','book','packs','packHashes','progress','sourceIncluded','sourceBytes'])||value.format!=='visual-reader-book'||value.version!==1)throw Error('Unsupported prepared-book format.');
 const s=value.source;if(!only(s,['sha256','pages'])||!/^[a-f0-9]{64}$/.test(s.sha256)||!Number.isInteger(s.pages)||s.pages<1||s.pages>100000)throw Error('Invalid prepared-book source identity.');
 const b=value.book;if(!only(b,['title','subtitle','cover'])||typeof b.title!=='string'||!b.title.trim()||b.title.length>240||typeof b.subtitle!=='string'||b.subtitle.length>240||!['plain','network','transactions'].includes(b.cover))throw Error('Invalid prepared-book metadata.');
 if(!Array.isArray(value.packs)||!value.packs.length||value.packs.length>MAX_PREPARED_PACKS||!Array.isArray(value.packHashes)||value.packHashes.length!==value.packs.length||value.packHashes.some(h=>!/^[a-f0-9]{64}$/.test(h)))throw Error('Invalid prepared-book pack list.');
 const ids=new Set(),packs=value.packs.map(validatePack);for(const p of packs){if(p.source.sha256!==s.sha256||p.source.pages!==s.pages||ids.has(p.id)||p.validation.workflow?.status==='unreviewed')throw Error('Prepared-book packs must be distinct, reviewed, and match one exact source.');ids.add(p.id);}
 if(typeof value.sourceIncluded!=='boolean'||!Number.isInteger(value.sourceBytes)||value.sourceBytes<0||value.sourceBytes>MAX_PDF_BYTES||value.sourceIncluded!==(value.sourceBytes>0))throw Error('Invalid prepared-book source inclusion.');
 if(value.progress!==null){const store=new ProgressStore({getItem:()=>null,setItem:()=>{}});store.import(JSON.stringify(value.progress));const books=Object.entries(JSON.parse(store.export()).books);if(books.length!==1||books[0][0]!==s.sha256||books[0][1].pages!==s.pages)throw Error('Prepared-book progress belongs to another source.');}
 return {...value,packs};
}
export async function createPreparedBook({book,packs,progress=null,source=null,includeSource=false}){
 if(includeSource&&(!(source instanceof Blob)||source.size<5||source.size>MAX_PDF_BYTES))throw Error('Import the matching PDF before including it; the local limit is 128 MiB.');
 const checked=packs.map(validatePack),manifest=validatePreparedManifest({format:'visual-reader-book',version:1,source:{sha256:book.id,pages:book.pages},book:{title:book.title,subtitle:book.subtitle||'Prepared local book',cover:book.cover||'plain'},packs:checked,packHashes:await Promise.all(checked.map(p=>sha256(canonical(p)))),progress,sourceIncluded:includeSource,sourceBytes:includeSource?source.size:0});
 if(includeSource&&await sha256(source)!==manifest.source.sha256)throw Error('The included PDF does not match the prepared source.');
 const encoded=encoder.encode(JSON.stringify(manifest));if(encoded.length>MAX_MANIFEST_BYTES)throw Error('Prepared-book metadata exceeds 4 MiB.');const header=new Uint8Array(12);header.set(encoder.encode(magic));new DataView(header.buffer).setUint32(8,encoded.length);
 return new Blob([header,encoded,...(includeSource?[source]:[])],{type:'application/octet-stream'});
}
export async function readPreparedBook(file){
 if(!(file instanceof Blob)||file.size<12||file.size>MAX_PDF_BYTES+MAX_MANIFEST_BYTES+12)throw Error('Prepared book is missing or too large.');
 const head=await file.slice(0,12).arrayBuffer();if(new TextDecoder().decode(new Uint8Array(head,0,8))!==magic)throw Error('This is not a prepared-book file.');const length=new DataView(head).getUint32(8);if(length<2||length>MAX_MANIFEST_BYTES||12+length>file.size)throw Error('Prepared-book header is invalid.');
 const manifest=validatePreparedManifest(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(await file.slice(12,12+length).arrayBuffer())));
 if(file.size!==12+length+manifest.sourceBytes)throw Error('Prepared-book bytes are truncated or inconsistent.');
 for(let i=0;i<manifest.packs.length;i++)if(await sha256(canonical(manifest.packs[i]))!==manifest.packHashes[i])throw Error('A prepared pack changed after export.');
 const source=manifest.sourceIncluded?file.slice(12+length,file.size,'application/pdf'):null;if(source&&await sha256(source)!==manifest.source.sha256)throw Error('The bundled PDF source hash does not match.');
 return {manifest,source};
}
