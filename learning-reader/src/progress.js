// Only reading metadata is stored. PDFs and generated aids are not exported here.
export const PROGRESS_KEY='visual-reader.progress.v1';
const zooms=new Set(['fit','1','1.25','1.5']);
const finite=(v,min,max)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export function validatePosition(p,pages){
 if(!p||!Number.isInteger(p.page)||p.page<1||p.page>pages||!finite(p.y,0,1))throw new Error('Invalid reading position.');
 const zoom=String(p.zoom??'fit'),split=p.split??50,gap=p.gap??0,left=p.left??0;
 if(!zooms.has(zoom)||!finite(split,35,65)||!finite(gap,0,18)||!finite(left,0,10000)||p.hideAid!==undefined&&typeof p.hideAid!=='boolean')throw new Error('Invalid reader settings.');
 return {page:p.page,y:p.y,gap,zoom,split,left,hideAid:p.hideAid??false};
}
function parse(data){
 if(!data||data.version!==1||!data.books||typeof data.books!=='object'||Array.isArray(data.books))throw new Error('This is not a supported progress file.');
 const entries=Object.entries(data.books);if(entries.length>200)throw new Error('Too many book records.');
 const books=Object.create(null);
 for(const [id,b] of entries){
  if(!/^[a-f0-9]{64}$/.test(id)||!b||!Number.isInteger(b.pages)||b.pages<1||b.pages>100000||typeof b.title!=='string'||b.title.length>240)throw new Error('Invalid book record.');
  const updatedAt=b.updatedAt;if(typeof updatedAt!=='string'||!Number.isFinite(Date.parse(updatedAt)))throw new Error('Invalid progress date.');
  books[id]={title:b.title,pages:b.pages,position:validatePosition(b.position,b.pages),bookmark:b.bookmark?validatePosition(b.bookmark,b.pages):null,updatedAt};
 }
 return books;
}
export class ProgressStore{
 constructor(storage){
  this.storage=storage;this.books=Object.create(null);this.error='';
  try{const raw=storage?.getItem(PROGRESS_KEY);if(raw)this.books=parse(JSON.parse(raw));if(!storage)this.error='Browser storage is unavailable.';}catch{this.error='Saved progress could not be read.';}
 }
 get(id){const value=this.books[id];return value?structuredClone(value):null;}
 persist(){try{if(!this.storage)throw Error();this.storage.setItem(PROGRESS_KEY,this.export());this.error='';return {ok:true};}catch{this.error='Your place is kept for this session. Browser storage is unavailable. Export progress to keep a copy.';return {ok:false,error:this.error};}}
 save(id,meta,position,bookmark=false){
  if(!/^[a-f0-9]{64}$/.test(id))throw new Error('Invalid source identity.');
  if(!Number.isInteger(meta.pages)||meta.pages<1||meta.pages>100000)throw new Error('Invalid page count.');
  const p=validatePosition(position,meta.pages),old=this.books[id];
  this.books[id]={title:String(meta.title).slice(0,240),pages:meta.pages,position:p,bookmark:bookmark?structuredClone(p):old?.bookmark||null,updatedAt:new Date().toISOString()};
  return this.persist();
 }
 export(){return JSON.stringify({version:1,books:this.books},null,2);}
 import(text){
  if(typeof text!=='string'||text.length>1000000)throw new Error('Progress file is too large.');
  const incoming=parse(JSON.parse(text));this.books=Object.assign(Object.create(null),this.books,incoming);return {count:Object.keys(incoming).length,...this.persist()};
 }
}
