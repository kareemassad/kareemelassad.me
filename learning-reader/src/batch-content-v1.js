import {batchDemos} from './batch-view-v1.js';
export {batchDemos};
const sections=[
 ['shuffle','Partition, shuffle, and reduce',408,.09891647770219203,'Keep the same input records. Change the reducer count or combine local counts before sending them.'],
 ['join','Bring join inputs together',414,.3796538926681783,'Route each event and its matching profile to one worker. The same logical join can use different data movement.'],
 ['skew','The slowest reducer holds up the job',416,.54289888133031,'Increase the hot key’s event count. Then split that key and copy its profile to each worker.'],
 ['recovery','Dataflow and recovery',428,.5630550264550265,'Compare saving intermediate data with recomputing it after a worker loses memory.']
];
export const batchChapter={n:10,title:'Batch processing',page:398,sections:sections.map(([id,title,page,y])=>({id:'10-'+id,title,page,y}))};
export const batchCues=sections.map(([id,,page,y,note])=>({at:{page,y},demo:'ddia-batch-'+(id==='skew'?'join':id),...(id==='skew'?{params:{strategy:'0',hot:12}}:{}),note}));
batchCues.push({at:{page:398,y:0},demo:'ddia-batch-shuffle',note:'Chapter preview: a fixed input dataset moves through grouping and aggregation.'},{at:{page:417,y:.6859412849584279},demo:'ddia-batch-join',params:{strategy:'1'},note:'Broadcast the small profile table to every worker. This avoids repartitioning events, but each worker must have room for the profiles.'},{at:{page:431,y:.3134406953892668},demo:'ddia-batch-recovery',params:{failure:'1'},note:'A lost intermediate result must come from durable storage or deterministic recomputation. Neither method authorizes repeating an external side effect.'},{at:{page:446,y:0},demo:'ddia-unprepared',note:'Stream-processing scenes are in preparation. Batch scenes use a fixed input dataset.'});
