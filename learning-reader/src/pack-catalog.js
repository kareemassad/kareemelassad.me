import {assetURL} from './assets.js';
import {validateExplanationPackage} from './explanation-package.js';
import {validateReaderPack, isNativeReaderPack} from './reusable-explanation.js';
import {readingLocations} from './reusable-explanation-v2.js';
const physicsPack=null;
const csPack={source:{sha256:"0000000000000000000000000000000000000000000000000000000000000000",pages:2}};
import {leadingBodyPassage} from './reading-context.js';
import {SOURCE} from './passages.js';
import {scopedLegacyPassages as legacy,scopedLegacyAt as legacyAt,legacyCoverage} from './legacy-scopes.js';
import {anchorPosition} from './source-anchor.js';
import {validatePack,packPassageAt,positionNumber,canonical} from './pack-schema.js';
import {passageBreakpoints} from './passage-breakpoints.js';
export const originalBook={id:csPack.source.sha256,title:'Quorum reads',subtitle:'Original CS reading sample',pages:2,localUrl:'/src/books/quorum-primer.pdf',cover:'network',builtin:true};
export const transactionBook={id:'6fd33f2fc2879609eaa0ed215186d6b2041027420c1abed83bf274c7e23d0df2',title:'Transaction schedules',subtitle:'Snapshot isolation · Serializable retry',pages:2,localUrl:'/src/books/transaction-primer.pdf',cover:'transactions',builtin:true};
export const responseSetsBook={id:'ea40079b7c2a5424d5b09820182968f55b5345f91be68ed70c0f5d207e895eff',title:'Response sets',subtitle:'Original CS planner sample',pages:2,localUrl:'/src/books/response-sets-primer.pdf',cover:'network',builtin:true};
export const causalBook={id:'82de267c89fca3b7341c4aa726f9284c1421aa4d0ff08e9b1103200cdb06ef17',title:'Causal histories',subtitle:'Original CS sample · Scalar and vector clocks',pages:2,localUrl:'/src/books/causal-primer.pdf',cover:'network',builtin:true};
export const originalBooks=[causalBook,originalBook,transactionBook,responseSetsBook];
const key=p=>p.source.sha256+':'+p.id;
const validate=validateReaderPack;
const sameEntries=(a,b)=>a.size===b.size&&[...a].every(([key,value])=>b.get(key)===value);
export class PackCatalog{
 constructor(library,{fetcher=globalThis.fetch?.bind(globalThis),configuration={}}={}){this.library=library;this.fetcher=fetcher;this.jobs=[];this.sessions=[];this.sections=[];this.codeHash=configuration.codeHash||null;this.staticMode=configuration.mode==='static';this.legacyEnabled=!this.staticMode||configuration.books?.some(b=>b.id===SOURCE.sha256);this.warning='';this.serverKeys=new Map();this.packageKeys=new Map();this.packs=new Map((this.staticMode?[]:[physicsPack,csPack]).map(p=>[key(p),validatePack(p)]));this.revision=0;this.ready=this.restore();}
 async restore(){try{for(const r of await this.library.listPacks()){try{const p=validate(r.pack),old=this.packs.get(key(p));if(!old||p.version>old.version)this.packs.set(key(p),p);}catch{}}}catch{}await this.refreshPrepared();}
 async refreshPrepared(sourceHash=null){
  const scopeKey=sourceHash||'*';this.refreshes ||= new Map();if(this.refreshes.has(scopeKey))return this.refreshes.get(scopeKey);
  const operation=this.loadPrepared(sourceHash);this.refreshes.set(scopeKey,operation);try{return await operation;}finally{if(this.refreshes.get(scopeKey)===operation)this.refreshes.delete(scopeKey);}
 }
 async loadPrepared(sourceHash){
  if(!this.fetcher)return;try{const response=await this.fetcher(assetURL('preparation/catalog.json')+(sourceHash?'?source='+sourceHash:''));if(!response.ok)throw Error('The saved explanation catalog is unavailable.');const data=await response.json();if(!Array.isArray(data.jobs)||!Array.isArray(data.packs))throw Error('The saved explanation catalog is invalid.');
   if(data.codeHash&&this.codeHash&&data.codeHash!==this.codeHash){this.clearServerPacks();this.warning='The reader code changed. Close this tab and reopen before importing or updating aids.';return;}if(data.codeHash)this.codeHash=data.codeHash;
   const scope=data.sourceScope||null;if(scope&&(scope!==sourceHash||[...data.packs,...(data.explanationPackages||[])].some(p=>(p.pack||p).source.sha256!==scope)))throw Error('The catalog returned a different source.');
   const persisted=await Promise.all((data.explanationPackages||[]).map(p=>{if(!data.explanationModelAssetsHashes?.includes(p.modelAssetsHash))throw Error('Missing reviewed model profile.');return validateExplanationPackage(p,p.modelAssetsHash,data.explanationSchemaCompatibilityHash);}));
   const previous={revision:this.revision,server:new Map(this.serverKeys),packages:new Map(this.packageKeys),warning:this.warning};
   const packs=[...data.packs.map(validatePack).filter(p=>p.validation.workflow?.status==='accepted'),...persisted];this.clearServerPacks(scope);for(const p of persisted)this.packageKeys.set(key(p),canonical(p));const merge=(previous,next)=>{const ids=new Set(next.map(x=>x.id));return scope?[...previous.filter(x=>x.source?.sha256!==scope&&!ids.has(x.id)),...next]:next;};this.jobs=merge(this.jobs,data.jobs);this.sessions=merge(this.sessions,Array.isArray(data.sessions)?data.sessions:[]);this.sections=merge(this.sections,Array.isArray(data.sections)?data.sections:[]);this.warning=data.explanationWarning||'';
   for(const p of packs){const k=key(p),old=this.packs.get(k);if(old&&(old.version>p.version||old.version===p.version&&canonical(old)!==canonical(p))){this.warning='A local pack is newer or differs at the same version. The server copy did not replace it.';continue;}this.packs.set(k,p);this.serverKeys.set(k,canonical(p));}this.revision=previous.revision+(sameEntries(previous.server,this.serverKeys)&&sameEntries(previous.packages,this.packageKeys)&&previous.warning===this.warning?0:1);
  }catch(error){this.clearServerPacks();this.warning=error.message;}
 }
 clearServerPacks(sourceHash=null){for(const [k,previous] of this.serverKeys){if(sourceHash&&!k.startsWith(sourceHash+':'))continue;if(canonical(this.packs.get(k))===previous)this.packs.delete(k);this.serverKeys.delete(k);}for(const k of this.packageKeys.keys())if(!sourceHash||k.startsWith(sourceHash+':'))this.packageKeys.delete(k);this.revision++;}
 compatible(pack){const saved=this.packageKeys?.get(key(pack))===canonical(pack);if(isNativeReaderPack(pack))return saved;return saved||!pack.validation.workflow||pack.validation.workflow.status==='accepted'&&pack.validation.workflow.codeHash===this.codeHash;}
 preflight(packs){const checked=packs.map(validate);for(const p of checked){if(isNativeReaderPack(p)&&this.serverKeys.get(key(p))!==canonical(p))throw Error('Prepared protocols must match the checked local catalog.');if(p.passages.some(x=>x.scene==='generated-model')&&this.serverKeys.get(key(p))!==canonical(p))throw Error('Generated aids must match the independently reviewed current local catalog.');const old=this.packs.get(key(p));if(p.validation.workflow&&!this.compatible(p))throw Error('This pack is unreviewed or belongs to another reader revision. Validate and review it again.');if(old&&p.version<old.version)throw Error('An older pack cannot replace a newer version.');if(old&&p.version===old.version&&canonical(old)!==canonical(p))throw Error('Changed pack contents require a new pack version.');}return checked;}
 applyPrepared(packs){for(const p of this.preflight(packs))this.packs.set(key(p),p);this.revision++;}
 async import(text){await this.ready;if(text.length>1000000)throw Error('Pack is too large.');const p=this.preflight([JSON.parse(text)])[0],old=this.packs.get(key(p));if(old&&p.version<old.version)throw Error('An older pack version cannot replace a newer one.');if(old&&old.version===p.version&&canonical(old)!==canonical(p))throw Error('Different contents require a new pack version.');this.packs.set(key(p),p);this.revision++;try{await this.library.putPack(p);return {pack:p,saved:true};}catch{return {pack:p,saved:false};}}
 async forBook(document,hash){
  await this.ready;await this.refreshPrepared(hash);const accepted=[];this.sourcePages ||= new WeakMap();let cached=this.sourcePages.get(document);if(!cached||cached.hash!==hash||cached.count!==document.numPages){cached={hash,count:document.numPages,pages:new Map()};this.sourcePages.set(document,cached);}const pages=cached.pages;
  const matches=async location=>{
   if(!pages.has(location.page)){
    const operation=(async()=>{const page=await document.getPage(location.page),content=await page.getTextContent(),view=page.getViewport({scale:1});return {content,view,anchors:content.items.filter(x=>typeof x.str==='string').map(item=>({text:item.str.normalize('NFKC').replace(/\s+/g,' '),y:anchorPosition(item,view).y}))};})();
    pages.set(location.page,operation);operation.catch(()=>{if(pages.get(location.page)===operation)pages.delete(location.page);});
   }
   const {anchors}=await pages.get(location.page);return anchors.some(item=>item.text.includes(location.anchor)&&Math.abs(item.y-location.y)<.025);
  };
  for(const p of this.packs.values())if(p.source.sha256===hash&&p.source.pages===document.numPages&&this.compatible(p)&&!this.jobs.some(j=>j.id===p.validation.workflow?.jobId&&j.status!=='accepted')){
   if(p.passages.some(x=>x.scene==='generated-model')&&this.serverKeys.get(key(p))!==canonical(p))continue;
   let valid=true;const locations=[...p.passages.map(x=>({...x,anchor:x.source.anchor})),...p.coverage.flatMap(c=>[c.start,c.end]).filter(x=>x.anchor),...p.passages.flatMap(x=>readingLocations(x.reading))];for(const location of locations)if(!await matches(location)){valid=false;break;}
   if(valid)accepted.push(p);
  }
  const isLegacy=this.legacyEnabled&&hash===SOURCE.sha256&&document.numPages===SOURCE.pages,all=[...(isLegacy?legacy:[]),...accepted.flatMap(p=>p.passages.map(x=>({...x,packId:p.id,packVersion:p.version})))].sort((a,b)=>positionNumber(a)-positionNumber(b));
  if(!all.length)return null;
  const sections=[];for(const p of all)if(!sections.some(s=>s[0]===p.source.section))sections.push([p.source.section,p.title.toLowerCase().replace(/^./,x=>x.toUpperCase()),p.page,p.y]);
  const leading=new Map();for(const [page,result] of pages){const {content,view}=await result;const candidate=leadingBodyPassage(all.filter(p=>p.page===page),content,view);if(candidate)leading.set(page,candidate);}
  const coverage=[...(isLegacy?legacyCoverage:[]),...accepted.flatMap(p=>p.coverage)];
  return {passages:all,breakpoints:passageBreakpoints(all,coverage),sections,leading,at:(page,y)=>{let found=isLegacy?legacyAt(page,y):null;if(found?.sourceScope?.kind==='figure-illustration')return found;for(const p of accepted){const next=packPassageAt(p,page,y);if(next)found={...next,packId:p.id,packVersion:p.version};}return found;}};
 }
}
