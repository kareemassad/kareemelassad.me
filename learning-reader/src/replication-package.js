import {DDIA_SOURCE,replicationLesson,replicationDefaults} from './replication-lessons.js';
import {replicationState} from './replication-models.js';
const hash=/^[a-f0-9]{64}$/;
const point=p=>p&&Number.isInteger(p.page)&&p.page>=1&&p.page<=491&&Number.isFinite(p.y)&&p.y>=0&&p.y<=1&&typeof p.anchor==='string'&&p.anchor.length>0&&p.anchor.length<=240;
export function validateReplicationPack(input){
 if(input?.format!=='replication-explanations'||input.schemaVersion!==1||!/^[-a-z0-9]{1,80}$/.test(input.id)||!Number.isInteger(input.version)||input.version<1||input.version>999||input.source?.sha256!==DDIA_SOURCE.sha256||input.source.pages!==491)throw Error('Unsupported replication explanation package.');
 if(!Array.isArray(input.passages)||!input.passages.length||input.passages.length>20||!Array.isArray(input.coverage)||input.coverage.length!==input.passages.length)throw Error('Invalid replication source coverage.');
 const seen=new Set();
 for(const [i,p]of input.passages.entries()){
  const lesson=replicationLesson(p.lab),coverage=input.coverage[i];
  if(!lesson||seen.has(p.id)||p.id!=='ddia-'+lesson.id||p.scene!=='replication-lab'||p.title!==lesson.title||p.caption!==lesson.caption||!point({...p,anchor:p.source?.anchor})||p.source.page!==p.page||p.source.text!==lesson.text||p.source.limit!==lesson.limit||p.source.section!==lesson.section||p.source.ref!==lesson.ref||p.source.printed!==lesson.printed||JSON.stringify(p.defaults)!==JSON.stringify(replicationDefaults(lesson.id)))throw Error('Replication content differs from its versioned lesson.');
  if(!point(coverage?.start)||!point(coverage?.end)||coverage.start.page+coverage.start.y>=coverage.end.page+coverage.end.y||p.page!==coverage.start.page||Math.abs(p.y-coverage.start.y)>.000001||p.page!==lesson.start.page||coverage.end.page!==lesson.end.page)throw Error('Invalid replication source boundary.');
  replicationState(p.lab,p.defaults);seen.add(p.id);
 }
 const w=input.validation?.workflow;
 if(w?.status!=='accepted'||w.sourceHash!==input.source.sha256||!['proposalHash','extractionHash','codeHash'].every(key=>hash.test(w[key]||''))||w.review?.type!=='agent'||!w.review.reviewer||w.review.proposalHash!==w.proposalHash||!['sourceReviewed','modelReviewed','visualsReviewed'].every(key=>w.review[key]===true))throw Error('Replication package needs its recorded author checks.');
 return structuredClone(input);
}
