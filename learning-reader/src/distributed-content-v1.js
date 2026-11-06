import {transactionDemos} from './transaction-view-v1.js';
import {distributedFaultDemos} from './distributed-fault-view-v1.js';
export const distributedDemos=[...transactionDemos,...distributedFaultDemos];
const sections=[
 [7,'atomic','Atomicity and aborts',237,.09430234315948594,'A failed transfer must undo its partial changes. Atomicity does not by itself define isolation.'],
 [7,'snapshot','Read skew and snapshots',249,.5059121390778534,'Keep the stored total fixed. Compare reading two committed versions with reading one snapshot.'],
 [7,'counter','Preventing lost updates',254,.731296976568405,'Trace two increments. Change the update method to see whether both increments survive.'],
 [7,'skew','Write skew and serial order',258,.635514618291761,'Two transactions write different rows, but their decisions depend on the same condition.'],
 [8,'uncertainty','What a timeout can tell you',290,.7479114134542706,'Compare different hidden server histories. Silence at the client does not identify which history occurred.'],
 [8,'clocks','Clock order and causal order',304,.25629782312925165,'B observes A before writing. Change the clock offset to separate timestamp order from causal order.'],
 [8,'fencing','Fencing a stale process',315,.36608749811035524,'The storage service must check the token. A process can resume after its lease has expired.']
];
const demo=(chapter,kind)=>`ddia-${chapter===7?'transaction':'fault'}-${kind}`;
export const distributedChapters=[{n:7,title:'Transactions',page:234},{n:8,title:'The trouble with distributed systems',page:286}].map(c=>({...c,sections:sections.filter(s=>s[0]===c.n).map(([n,kind,title,page,y])=>({id:n+'-'+kind,title,page,y}))}));
export const distributedCues=sections.map(([n,kind,,page,y,note])=>({at:{page,y},demo:demo(n,kind),note}));
for(const [page,id,note]of [
 [234,'ddia-transaction-atomic','Chapter preview: trace a failed transfer. Later scenes separate atomicity, snapshots, lost updates, and write skew.'],
 [286,'ddia-fault-uncertainty','Chapter preview: compare what actually happened with what the client can observe.'],
])distributedCues.push({at:{page,y:0},demo:id,note});
distributedCues.push({at:{page:294,y:.3886028722600151},demo:'ddia-fault-uncertainty',params:{world:'2'},note:'Increase the timeout to allow a slow reply. A shorter wait detects some failures sooner but can also suspect a healthy server.'});
// Keep the next chapter explicit until its source-linked models are available.
distributedCues.push({at:{page:332,y:0},demo:'ddia-unprepared',note:'Chapter 9 models are in preparation. The preceding fencing model does not explain consensus.'});
