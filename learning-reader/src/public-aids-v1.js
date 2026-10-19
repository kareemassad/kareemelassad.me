import {validateTemplate} from './templates.js';
import {replicationState} from './replication-models.js';
import {positionNumber} from './pack-schema.js';

const only=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>keys.includes(key));
const prose=(value,max)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
const digest=/^[a-f0-9]{64}$/;
const point=(value,pages)=>only(value,['page','y'])&&Number.isInteger(value.page)&&value.page>=1&&value.page<=pages&&Number.isFinite(value.y)&&value.y>=0&&value.y<=1;

// Public derivatives carry original explanations and edition-specific positions.
// They never carry extracted selectors or claim to recheck private review evidence.
export function validatePublicAids(input){
 if(!only(input,['format','schemaVersion','books'])||input.format!=='reviewed-reader-aids'||input.schemaVersion!==1||!Array.isArray(input.books)||input.books.length!==2)throw Error('Unsupported public reading catalog.');
 const books=new Set();
 for(const book of input.books){
  if(!only(book,['source','packages'])||!only(book.source,['sha256','pages','title'])||!digest.test(book.source.sha256)||books.has(book.source.sha256)||!Number.isInteger(book.source.pages)||book.source.pages<1||!prose(book.source.title,240)||!Array.isArray(book.packages)||!book.packages.length||book.packages.length>256)throw Error('Invalid public book identity.');
  books.add(book.source.sha256);const ids=new Set();
  for(const pack of book.packages){
   if(!only(pack,['id','version','originalPackHash','coverage','passages'])||!prose(pack.id,100)||ids.has(pack.id)||!Number.isInteger(pack.version)||pack.version<1||!digest.test(pack.originalPackHash)||!Array.isArray(pack.coverage)||!pack.coverage.length||!Array.isArray(pack.passages)||!pack.passages.length||pack.passages.length>200)throw Error('Invalid public saved aid.');
   ids.add(pack.id);
   for(const c of pack.coverage)if(!only(c,['start','end'])||!point(c.start,book.source.pages)||!point(c.end,book.source.pages)||positionNumber(c.start)>=positionNumber(c.end))throw Error('Invalid public source interval.');
   const passages=new Set();
   for(const p of pack.passages){
    if(!only(p,['id','page','y','scene','lab','title','caption','defaults','source'])||!point({page:p.page,y:p.y},book.source.pages)||!prose(p.id,100)||passages.has(p.id)||!prose(p.title,240)||!prose(p.caption,1000)||!only(p.source,['page','printed','section','ref','text','limit'])||p.source.page!==p.page||!['printed','section','ref','text','limit'].every(k=>prose(p.source[k],k==='text'||k==='limit'?8000:1000))||!pack.coverage.some(c=>positionNumber(p)>=positionNumber(c.start)&&positionNumber(p)<positionNumber(c.end)))throw Error('Invalid public passage.');
    if(p.scene==='replication-lab')replicationState(p.lab,p.defaults);else {if(p.lab!==undefined)throw Error('Unexpected public lab.');validateTemplate(p.scene,p.defaults);}
    passages.add(p.id);
   }
  }
 }
 return structuredClone(input);
}
