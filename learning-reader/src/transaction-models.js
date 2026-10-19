import {createTransaction,transactionStep} from './models.js';
export const transactionNames=['snapshot-write-skew','serializable-retry'];
export function transactionFrame(kind,phase=0){
 if(!transactionNames.includes(kind))throw Error('Unknown transaction template.');
 const state=createTransaction(kind==='serializable-retry'?'serializable':'snapshot');for(let i=0;i<Math.max(0,Math.min(5,Math.floor(phase)));i++)transactionStep(state);return state;
}
export function serialApplication(initial,order){const rows=[...initial];for(const doctor of order)if(rows.filter(Boolean).length>=2)rows[doctor]=false;return rows;}
export function transactionChecks(kind){
 const final=transactionFrame(kind,5),serialCounts=[[0,1],[1,0]].map(order=>serialApplication([true,true],order).filter(Boolean).length);
 if(serialCounts.some(n=>n!==1)||final.doctors.filter(Boolean).length!==(kind==='serializable-retry'?1:0))throw Error('Transaction schedule invariant failed.');
 if(kind==='serializable-retry'&&final.statuses[1]!=='Retried: stays on call')throw Error('Serializable model did not retry the full transaction.');
 return {passed:true,method:'Fixed concurrent snapshot schedule compared with both serial application orders and full retry',serialCounts,finalOnCall:final.doctors.filter(Boolean).length};
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function drawTransaction(kind,s){
 const phase=Math.max(0,Math.min(5,Math.floor(s.progress||0))),state=transactionFrame(kind,phase),serial=kind==='serializable-retry',count=state.doctors.filter(Boolean).length;
 let body=`<text x="300" y="39" text-anchor="middle" class="label">${serial?'SERIALIZABLE · ABORT AND RETRY':'SNAPSHOT ISOLATION · WRITE SKEW'}</text><text x="300" y="77" text-anchor="middle" class="large-equation">At least one doctor on call</text>`;
 for(let i=0;i<2;i++){
  const x=80+i*280,on=state.doctors[i],name=i===0?'A':'B',snapshot=state.snapshots[i];
  body+=`<rect x="${x}" y="113" width="160" height="68" rx="7" fill="${on?'#f0f5f4':'#f8f3ef'}" stroke="${on?'#9aafa4':'#b9a896'}"/><text x="${x+80}" y="140" text-anchor="middle" class="label">DOCTOR ${name}</text><text x="${x+80}" y="165" text-anchor="middle" class="node-name">${on?'ON CALL':'OFF CALL'}</text><text x="${x+80}" y="217" text-anchor="middle" class="label">T${i+1}: ${snapshot?'snapshot ['+snapshot.map(v=>v?'on':'off').join(', ')+']':'not started'}</text><text x="${x+80}" y="242" text-anchor="middle" class="label">${escape(state.statuses[i])}</text>`;
 }
 body+=`<text x="300" y="285" text-anchor="middle" class="large-equation">${count} on call</text><text x="300" y="312" text-anchor="middle" class="label">${count>=1?'RULE HOLDS':'RULE VIOLATED'} · STEP ${phase} / 5</text>`;
 const events=['Both doctors start on call.','T1 reads both rows.','T2 reads the same two rows.','T1 commits its own row.',serial?'T2 aborts; its write does not commit.':'T2 commits the other row.',serial?'T2 retries: one on call, so B stays.':'Both commits succeed. The shared rule fails.'];
 body+=`<text x="300" y="371" text-anchor="middle" class="label">${escape(events[phase])}</text>`;
 return {body,label:serial?'A conflicting transaction aborts and retries with a fresh snapshot':'Concurrent snapshot transactions update distinct rows and violate the shared invariant',metrics:[{label:'Doctors on call',value:String(count)},{label:'Schedule step',value:String(phase)},{label:'Application invariant',value:count>=1?'Holds':'Violated'}]};
}
