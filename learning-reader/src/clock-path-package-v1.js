import {positionNumber} from './pack-schema.js';
import {clockPath} from './clock-path-v1.js';
export const CLOCK_PATH_ASSETS=Object.freeze(['src/clock-path-v1.js','src/clock-path-view.js','src/clock-path-package-v1.js','src/clock-path-state.js','src/clock-path.css','src/orbital-flight.css']);
const hash=/^[a-f0-9]{64}$/,text=(v,n=2000)=>typeof v==='string'&&v.trim().length>0&&v.length<=n;
const point=(p,pages)=>p&&Number.isInteger(p.page)&&p.page>=1&&p.page<=pages&&Number.isFinite(p.y)&&p.y>=0&&p.y<=1&&text(p.anchor,240);
export function clockInputs(value){if(!value||Object.keys(value).some(k=>!['heightRatio','phase'].includes(k))||!Number.isInteger(value.phase)||value.phase<0||value.phase>4)throw Error('Invalid clock reading state.');clockPath(value.heightRatio);return {...value};}
export function validateClockPathPack(input){
 if(input?.format!=='clock-path-explanations'||input.schemaVersion!==1||!/^[-a-z0-9]{1,80}$/.test(input.id||'')||!Number.isInteger(input.version)||input.version<1||!hash.test(input.source?.sha256||'')||!Number.isInteger(input.source.pages)||input.source.pages<1||!text(input.source.title,240))throw Error('Invalid clock-path package.');
 if(!Array.isArray(input.passages)||!Array.isArray(input.coverage)||input.passages.length!==1||input.coverage.length!==1)throw Error('Clock reading requires one continuous source group.');
 const p=input.passages[0],c=input.coverage[0],pages=input.source.pages;
 if(p.scene!=='clock-path'||p.lab!=='uniform-gravity-clock'||!text(p.id,80)||!text(p.title,120)||!text(p.caption,400)||!point(c.start,pages)||!point(c.end,pages)||positionNumber(c.start)>=positionNumber(c.end)||p.page!==c.start.page||p.y!==c.start.y||p.source?.page!==p.page||p.source.anchor!==c.start.anchor||!text(p.source.text)||!text(p.source.limit)||!text(p.source.ref,240))throw Error('Invalid clock source binding.');
 clockInputs(p.defaults);const reading=p.reading;
 if(!Array.isArray(reading?.beats)||reading.beats.length<1||reading.beats.length>32||!Array.isArray(reading.pages)||!reading.pages.length)throw Error('A clock lesson needs its reading plan.');
 const ids=new Set(),summaries=new Set();let last=-Infinity;
 for(const b of reading.beats){if(!text(b.id,80)||ids.has(b.id)||!text(b.caption,400)||!point(b.at,pages)||positionNumber(b.at)<positionNumber(c.start)||positionNumber(b.at)>=positionNumber(c.end)||positionNumber(b.at)<=last)throw Error('Invalid clock reading order.');ids.add(b.id);last=positionNumber(b.at);clockInputs(b.inputs);}
 if(positionNumber(reading.beats[0].at)!==positionNumber(c.start))throw Error('The clock plan must start at its source anchor.');
 for(const s of reading.pages){if(!Number.isInteger(s.page)||summaries.has(s.page)||!text(s.summary,800)||!Array.isArray(s.evidence)||!s.evidence.length||s.evidence.some(a=>!point(a,pages)||a.page!==s.page||positionNumber(a)<positionNumber(c.start)||positionNumber(a)>=positionNumber(c.end)))throw Error('Invalid clock page summary.');summaries.add(s.page);}
 if(reading.beats.some(b=>!summaries.has(b.at.page)))throw Error('Every clock reading page needs a summary.');
 const w=input.validation?.workflow;
 if(!w||!['unreviewed','accepted'].includes(w.status)||w.sourceHash!==input.source.sha256||!['proposalHash','extractionHash','codeHash'].every(k=>hash.test(w[k]||'')))throw Error('Missing clock review provenance.');
 if(w.status==='accepted'&&(!text(w.review?.reviewer,240)||!['sourceReviewed','modelReviewed','visualsReviewed'].every(k=>w.review[k]===true)||['sourceHash','proposalHash','extractionHash','codeHash'].some(k=>w.review[k]!==w[k])))throw Error('Clock acceptance requires a matching completed review.');
 return structuredClone(input);
}
