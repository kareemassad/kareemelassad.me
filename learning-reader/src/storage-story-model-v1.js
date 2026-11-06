// A bounded storage history shared by every stage of the visual story.
import {storageLog} from './storage-model-v1.js';

export function storageStory({count=8, key='C', scope='all', retain=true}={}) {
  if (!Number.isInteger(count)||count<1||count>8) throw Error('Invalid record count');
  const records=storageLog.slice(0,count).map((r,offset)=>({...r,offset}));
  const index={};
  for (const r of records) index[r.key]=r.offset;
  const latest=Object.values(index).map(i=>records[i]);
  const obsolete=records.filter(r=>index[r.key]!==r.offset);
  const start=scope==='recent'?3:0;
  const inputs=records.slice(start), winners=new Map();
  for(const r of inputs) winners.set(r.key,r);
  const output=[...winners.values()].filter(r=>r.value!==null||(start>0&&retain)).sort((a,b)=>a.key.localeCompare(b.key));
  const remaining=[...records.slice(0,start),...output];
  const found=remaining.filter(r=>r.key===key).at(-1);
  return {records,index,latest,obsolete,inputs,output,remaining,
    expected:latest.find(r=>r.key===key)?.value??null,
    actual:found?.value??null,
    scanReads:records.length,indexReads:key in index?1:0,
    reclaimed:inputs.length-output.length};
}
