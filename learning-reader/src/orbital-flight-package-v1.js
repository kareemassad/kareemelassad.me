import {positionNumber} from './pack-schema.js';
import {orbitalInvariants} from './orbital-flight-v1.js';
const hash=/^[a-f0-9]{64}$/;
const prose=(s,max=2000)=>typeof s==='string'&&s.trim()&&s.length<=max;
const point=(p,pages)=>p&&Number.isInteger(p.page)&&p.page>0&&p.page<=pages&&Number.isFinite(p.y)&&p.y>=0&&p.y<=1&&prose(p.anchor,240);
export function flightInputs(value){
 if(!value||Object.keys(value).some(key=>!['speed','phase'].includes(key))||!Number.isInteger(value.phase)||value.phase<0||value.phase>4)throw Error('Invalid orbital reading state.');
 orbitalInvariants(value.speed);return {speed:value.speed,phase:value.phase};
}
// This codec is additive. The published Feynman and replication codecs stay fixed.
export function validateOrbitalFlightPack(input){
 if(input?.format!=='orbital-flight-explanations'||input.schemaVersion!==1||!/^[-a-z0-9]{1,80}$/.test(input.id||'')||!Number.isInteger(input.version)||input.version<1||!hash.test(input.source?.sha256||'')||!Number.isInteger(input.source.pages)||input.source.pages<1||!prose(input.source.title,240))throw Error('Invalid orbital explanation package.');
 if(input.passages?.length!==1||input.coverage?.length!==1)throw Error('An orbital reading group must keep one continuous model.');
 const p=input.passages[0],c=input.coverage[0],pages=input.source.pages;
 if(p.scene!=='orbital-flight'||p.lab!=='newtonian-cannon'||!prose(p.id,80)||!prose(p.title,100)||!prose(p.caption,280)||!point(c.start,pages)||!point(c.end,pages)||positionNumber(c.start)>=positionNumber(c.end)||p.page!==c.start.page||p.y!==c.start.y||p.source?.anchor!==c.start.anchor||p.source.page!==p.page||!prose(p.source.text)||!prose(p.source.limit)||!prose(p.source.ref,240))throw Error('Invalid orbital source binding.');
 flightInputs(p.defaults);
 const plan=p.reading;if(!Array.isArray(plan?.pages)||!plan.pages.length||!Array.isArray(plan.beats)||!plan.beats.length||plan.beats.length>32)throw Error('An orbital explanation needs its saved reading plan.');
 let last=-Infinity;const ids=new Set();
 for(const beat of plan.beats){if(!prose(beat.id,80)||ids.has(beat.id)||!prose(beat.caption,280)||!point(beat.at,pages)||positionNumber(beat.at)<positionNumber(c.start)||positionNumber(beat.at)>=positionNumber(c.end)||positionNumber(beat.at)<=last)throw Error('Invalid orbital reading order.');ids.add(beat.id);last=positionNumber(beat.at);flightInputs(beat.inputs);}
 if(positionNumber(plan.beats[0].at)!==positionNumber(c.start))throw Error('Reading must begin at its source anchor.');
 const summaryPages=new Set();for(const page of plan.pages){if(!Number.isInteger(page.page)||summaryPages.has(page.page)||!prose(page.summary,800)||!Array.isArray(page.evidence)||!page.evidence.length||page.evidence.some(p=>!point(p,pages)||p.page!==page.page||positionNumber(p)<positionNumber(c.start)||positionNumber(p)>=positionNumber(c.end)))throw Error('Invalid orbital page summary.');summaryPages.add(page.page);}
 if(plan.beats.some(beat=>!summaryPages.has(beat.at.page)))throw Error('Each reading page needs its source summary.');
 const w=input.validation?.workflow;
 if(!w||!['unreviewed','accepted'].includes(w.status)||w.sourceHash!==input.source.sha256||!['proposalHash','extractionHash','codeHash'].every(k=>hash.test(w[k]||'')))throw Error('Missing orbital review provenance.');
 if(w.status==='accepted'&&(!w.review?.reviewer||!['sourceReviewed','modelReviewed','visualsReviewed'].every(k=>w.review[k]===true)||['sourceHash','proposalHash','extractionHash','codeHash'].some(k=>w.review[k]!==w[k])))throw Error('Orbital acceptance requires its recorded matching review.');
 return structuredClone(input);
}
