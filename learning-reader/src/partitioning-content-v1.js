import {partitionDemo,partitionReaderParams} from './partitioning-view-v1.js';
// Physical PDF pages, converted to zero-based positions below. Source: DDIA_SOURCE.
const passages=[
 ['range',216,.34406,'placement','Partition by key range',{method:0,workload:0,salts:1,query:0},'Watch ordered keys enter contiguous ranges. Select Recent keys only to put all writes in the final range.'],
 ['hash',217,.31634,'placement','Partition by hash',{method:1,workload:0,salts:1,query:0},'Hash the same keys. Then highlight the range query: nearby keys no longer have one owner.'],
 ['hot-key',218,.83719,'placement','One hot key',{method:1,workload:2,salts:1,query:0},'Hashing cannot divide one hot key. Increase Hot-key suffixes and compare the busiest partition. A combined read must fetch each suffix.'],
 ['local-index',220,.51949,'indexes','Local secondary indexes',{global:0,lag:0},'Find red records. Each local index knows only its data partition, so all three must answer.'],
 ['global-index',222,.09892,'indexes','A global term index',{global:1,lag:0},'The red term has one index owner. Delay the new posting to see a stored record disappear from the index result.'],
 ['modulo',223,.63745,'rebalance','Adding a node with modulo',{fixed:0},'Follow 24 records as the divisor changes from three nodes to four. Count how many owners change.'],
 ['fixed',224,.21820,'rebalance','Keep partition IDs fixed',{fixed:1},'Keep 12 partition IDs. Move three complete partitions to the new node and compare the number of records moved.'],
 ['split',225,.43765,'split','Split a growing range',{count:18,threshold:12},'Increase Stored records beyond the threshold. Split the ordered range at its median and transfer its upper half.'],
 ['routing',227,.45350,'routing','Route to the owner',{route:0,moved:0,fresh:1},'Compare forwarding, a routing tier, and a direct client. Move the partition, then use a stale map to expose the wrong destination.']
];
const titles={placement:'Key placement and hot spots',indexes:'Secondary indexes',rebalance:'Rebalancing partitions',split:'Dynamic range splitting',routing:'Request routing'};
export const partitionDemos=Object.entries(titles).map(([kind,title])=>partitionDemo(kind,title));
export const partitionChapter={n:6,title:'Partitioning · 5 visual experiments',page:212,sections:passages.map(([id,page,y,,title])=>({id:'6-'+id,page:page-1,y,title}))};
export const partitionCues=passages.map(([,page,y,kind,,params,note])=>({at:{page:page-1,y},demo:'ddia-partition-'+kind,params,note}));
// Keep the previous experiment visible between sections. Notes state its scope.
partitionCues.push({at:{page:212,y:.18397},demo:'ddia-partition-placement',params:{method:0,workload:0,salts:1,query:0},note:'Chapter 6 starts with one dataset and four partitions. Follow its keys, then compare how placement changes the work.'});
for(const [page,y,kind,note] of [
 [218,.16678,'placement','Keep exploring key placement while reading this sidebar. This scene uses four fixed hash ranges; it does not model a consistent-hash ring.'],
 [219,.59591,'placement','Keep the hot-key experiment in view. The next scene adds secondary indexes to partitioned data.'],
 [223,.10237,'indexes','Keep comparing local and global indexes. The next scene shows what changes when a node joins.'],
 [226,.41775,'split','The range-splitting experiment stays in view here. Other balancing strategies and operational failures are outside this model.'],
 [229,.68975,'routing','The routing experiment stays in view through the chapter summary. It does not model parallel query execution.']
]){const previous=[...partitionCues].filter(c=>c.at.page<page-1||c.at.page===page-1&&c.at.y<y).sort((a,b)=>b.at.page-a.at.page||b.at.y-a.at.y)[0];partitionCues.push({at:{page:page-1,y},demo:'ddia-partition-'+kind,params:previous.params,note});}
partitionCues.push({at:{page:234,y:0},demo:'ddia-unprepared',note:'Chapter 6 experiments end here. Choose a prepared section to explore another model.'});
partitionCues.sort((a,b)=>a.at.page-b.at.page||a.at.y-b.at.y);

for(const cue of partitionCues)if(cue.params)cue.params=partitionReaderParams(cue.demo.replace('ddia-partition-',''),cue.params);
