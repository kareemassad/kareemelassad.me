import {PublicPackCatalog} from './public-pack-catalog.js';
import {validatePublicAids} from './public-aids-v1.js';
import {sha256} from './book-bundle.js';
import {assetURL} from './assets.js';
import {positionNumber,canonical} from './pack-schema.js';
import {passageBreakpoints} from './passage-breakpoints.js';

export const publicLibraryEnabled=configuration=>configuration.mode==='static'&&!!configuration.publicAids&&!!configuration.runtimeProfile;
const rendererPath=file=>/^src\/[a-z0-9-]+\.(?:js|css|json)$/.test(file)||/^vendor\/renderers\/(?:jsxgraph\/(?:core\.mjs|LICENSE\.MIT|core\.LICENSE\.txt)|katex\/(?:katex\.min\.css|LICENSE|fonts\/KaTeX_[A-Za-z0-9_-]+\.(?:ttf|woff2?)))$/.test(file);

export class PublicLibraryCatalog extends PublicPackCatalog{
 constructor(library,options){
  super(library,options);this.publicBooks=[];
  const existing=this.ready;
  this.ready=Promise.all([existing,this.loadPublic(options.configuration.publicAids,options.configuration.runtimeProfile)]).then(()=>{}).catch(error=>{this.warning=this.publicError=error.message;});
 }
 compatible(pack){
  if(this.localClock(pack))return true;
  const key=pack.source.sha256+':'+pack.id,value=canonical(pack);
  return this.serverKeys.get(key)===value&&this.packageKeys.get(key)===value;
 }
 preflight(packs){
  const checked=super.preflight(packs);
  if(checked.some(pack=>!this.compatible(pack)))throw Error('This hosted reader accepts the included saved aids and matching clock reading plans.');
  return checked;
 }
 async loadPublic(record,runtime){
  if(!record||!/^preparation\/[a-z0-9-]+\.json$/.test(record.url)||!/^[a-f0-9]{64}$/.test(record.sha256))throw Error('Missing saved library aids.');
  const response=await fetch(assetURL(record.url));if(!response.ok)throw Error('Saved library aids are unavailable.');
  const bytes=await response.arrayBuffer();if(bytes.byteLength>4*1024*1024||await sha256(bytes)!==record.sha256)throw Error('Saved library aids differ from this reader release.');
  const checked=validatePublicAids(JSON.parse(new TextDecoder().decode(bytes)));
  if(runtime?.url!=='runtime-profile.json'||!/^[a-f0-9]{64}$/.test(runtime.sha256))throw Error('Missing reviewed public renderer profile.');
  const profileResponse=await fetch(assetURL(runtime.url),{cache:'no-cache'});if(!profileResponse.ok)throw Error('The saved renderer profile is unavailable.');
  const profileBytes=await profileResponse.arrayBuffer();if(profileBytes.byteLength>200000||await sha256(profileBytes)!==runtime.sha256)throw Error('The renderer profile differs from this release.');
  const profile=JSON.parse(new TextDecoder().decode(profileBytes));
  if(profile.schemaVersion!==1||!Array.isArray(profile.files)||!profile.files.length||profile.files.length>200||new Set(profile.files.map(f=>f.file)).size!==profile.files.length||profile.files.some(f=>!rendererPath(f.file)||!/^[a-f0-9]{64}$/.test(f.publicSHA256)))throw Error('Invalid saved renderer profile.');
  for(let start=0;start<profile.files.length;start+=8)await Promise.all(profile.files.slice(start,start+8).map(async file=>{const r=await fetch(assetURL(file.file),{cache:'no-cache'});if(!r.ok||await sha256(await r.arrayBuffer())!==file.publicSHA256)throw Error('The renderer changed. Reload the current reader before opening saved aids.');}));
  this.publicBooks=checked.books;
 }
 visiblePacks(){return [...this.publicBooks.flatMap(b=>b.packages.map(p=>({...p,source:b.source,publicDerivative:true}))),...[...this.packs.values()].filter(p=>this.compatible(p))];}
 async forBook(document,hash){
  await this.ready;
  const additional=await super.forBook(document,hash),book=this.publicBooks.find(b=>b.source.sha256===hash&&b.source.pages===document.numPages);
  if(!book)return additional;
  const passages=book.packages.flatMap(pack=>pack.passages.map(p=>({...p,packId:pack.id,packVersion:pack.version}))).sort((a,b)=>positionNumber(a)-positionNumber(b));
  const coverage=book.packages.flatMap(p=>p.coverage),sections=[];
  const all=[...passages,...(additional?.passages||[])].sort((a,b)=>positionNumber(a)-positionNumber(b));
  for(const p of all)if(!sections.some(s=>s[0]===p.source.section))sections.push([p.source.section,p.title,p.page,p.y]);
  const markers=new Map(passageBreakpoints(all,coverage).map(p=>[p.page+':'+p.y,p]));
  for(const p of additional?.breakpoints||[]){const key=p.page+':'+p.y;if(!markers.has(key)||p.kind!=='gap')markers.set(key,p);}
  const breakpoints=[...markers.values()].filter(p=>p.kind!=='gap'||!additional?.at(p.page,p.y)&&!coverage.some(c=>positionNumber(c.start)<=positionNumber(p)&&positionNumber(p)<positionNumber(c.end))).sort((a,b)=>positionNumber(a)-positionNumber(b));
  return {passages:all,sections,leading:additional?.leading||new Map(),breakpoints,at:(page,y)=>{
   const n=page+y;let found=null;
   for(const pack of book.packages)if(pack.coverage.some(c=>n>=positionNumber(c.start)&&n<positionNumber(c.end))){let selected=null;for(const p of pack.passages)if(positionNumber(p)<=n)selected=p;if(selected)found={...selected,packId:pack.id,packVersion:pack.version};}
   return additional?.at(page,y)||found;
  }};
 }
}
