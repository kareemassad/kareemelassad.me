import {responseTimeDemo} from './response-time-view-v1.js';
export const foundationDemos=[responseTimeDemo];
export const foundationChapters=[{n:1,title:'Reliable, scalable and maintainable applications',page:22,sections:[{id:'1-response',title:'Service time and waiting time',page:33,y:.09368858654572942},{id:'1-percentiles',title:'The same requests as a distribution',page:35,y:.3282312925170068}]}];
export const foundationCues=[{at:{page:32,y:.4016036432350718},demo:'ddia-response-time',params:{view:'0'},note:'Each bar is one request. Watch short requests wait behind the slow request, then add another worker.'},{at:{page:33,y:.09368858654572942},demo:'ddia-response-time',params:{view:'0'},note:'Response time includes waiting and service. Gold measures waiting in this bounded queue model.'},{at:{page:35,y:.3282312925170068},demo:'ddia-response-time',params:{view:'1'},note:'Compare the median with the tail of the same workload. This scene does not yet model parallel request fanout.'},{at:{page:37,y:0},demo:'ddia-unprepared',note:'The performance experiment ends here. Maintainability scenes are still in preparation.'}];

import {dataShapeDemos} from './data-shape-view-v1.js';
foundationDemos.push(...dataShapeDemos);
const shapeSections=[['references','Copied facts and references',52,.4961322297808012],['query','The query and its plan',63,.1023688586545729],['graph','Relationships across a graph',69,.19772246409674976]];
foundationChapters.push({n:2,title:'Data models and query languages',page:46,sections:shapeSections.map(([kind,title,page,y])=>({id:'2-'+kind,title,page,y}))});
for(const [kind,,page,y]of shapeSections)foundationCues.push({at:{page,y},demo:'ddia-shape-'+kind,note:kind==='references'?'Rename one shared fact. Compare updating copies with resolving stable IDs.':kind==='query'?'Keep the query fixed. Change how the engine finds the matching rows.':'Follow the same containment relationship through paths of different lengths.'});
foundationCues.push({at:{page:80,y:.39976908541194256},demo:'ddia-shape-graph',note:'Repeatedly apply the reachability rule until no new person matches. This illustrates recursive inference, not a complete Datalog interpreter.'},{at:{page:88,y:0},demo:'ddia-unprepared',note:'Storage experiments are in preparation.'});

import {tradeoffDemos} from './system-tradeoffs-view-v1.js';
foundationDemos.push(...tradeoffDemos);
const tradeoffSections=[['reliability','Faults and service failures',25,.5523711564625851],['feed','The workload behind a timeline',30,.1929867876039304],['fanout','Why tails spread',35,.3282312925170068],['change','Boundaries and change',39,.7239015419501134]];
// The percentile distribution belongs to the percentile explanation on PDF 35.
foundationChapters[0].sections.find(s=>s.id==='1-percentiles').page=34;
foundationChapters[0].sections.find(s=>s.id==='1-percentiles').y=.2843288133030989;
const percentileCue=foundationCues.find(c=>c.at.page===35&&c.demo==='ddia-response-time');percentileCue.at={page:34,y:.2843288133030989};percentileCue.note='Sort the same requests from fastest to slowest. Compare the median and the high percentile.';
for(const [kind,title,page,y]of tradeoffSections){foundationChapters[0].sections.push({id:'1-'+kind,title,page,y});foundationCues.push({at:{page,y},demo:'ddia-tradeoff-'+kind,note:kind==='reliability'?'Separate a component fault from a failure of the whole service.':kind==='feed'?'Compare the work done when a post arrives with the work done when readers open their timelines.':kind==='fanout'?'The page needs all responses. One slow branch can delay the whole result.':'Change the implementation behind a stable interface, then change the interface itself.'});}
foundationCues.push({at:{page:27,y:.5249597732426303},demo:'ddia-tradeoff-reliability',params:{common:'1'},note:'The same software defect can affect all identical copies. Redundancy alone cannot remove this common cause.'});
const maintenanceGap=foundationCues.findIndex(c=>c.at.page===37&&c.demo==='ddia-unprepared');foundationCues.splice(maintenanceGap,1);
foundationCues.push({at:{page:37,y:.7383123507180649},demo:'ddia-tradeoff-change',note:'Use this dependency model to explore one part of maintainability: the spread of change. It does not measure operational quality or team productivity.'});
foundationChapters[0].sections.sort((a,b)=>a.page-b.page||a.y-b.y);

import {storageDemos} from './storage-view-v1.js';
foundationDemos.push(...storageDemos);
const storageSections=[['log','The log and its index',91,.09891647770219203],['merge','Sorted runs and compaction',95,.09891647770219203]];
foundationChapters.push({n:3,title:'Storage and retrieval',page:88,sections:storageSections.map(([kind,title,page,y])=>({id:'3-'+kind,title,page,y}))});
for(const [kind,,page,y]of storageSections)foundationCues.push({at:{page,y},demo:'ddia-storage-'+kind,note:kind==='log'?'Append records and move each key’s index pointer to its latest version.':'Follow the smallest remaining key through the merge. Keep the newest value and respect deletions.'});
foundationCues.push({at:{page:98,y:.781649312169312},demo:'ddia-storage-merge',note:'The sorted-run experiment remains visible. It does not model B-trees, which are still in preparation.'},{at:{page:128,y:0},demo:'ddia-unprepared',note:'Encoding experiments are in preparation.'});

import {storageLayoutDemos} from './storage-layout-view-v1.js';
import {encodingDemos} from './encoding-view-v1.js';
foundationDemos.push(...storageLayoutDemos,...encodingDemos);
const layoutSections=[['tree','B-tree page boundaries',98,.781649312169312],['layout','Rows, columns, and read work',114,.1023688586545729],['compression','Sorted columns and compression',117,.7091748601662886]];
for(const [kind,title,page,y]of layoutSections){foundationChapters.find(c=>c.n===3).sections.push({id:'3-'+kind,title,page,y});foundationCues.push({at:{page,y},demo:'ddia-layout-'+kind,note:kind==='tree'?'A root boundary selects a leaf page. Insert a missing key to split a full leaf.':kind==='layout'?'Keep the same logical table. Change its physical layout and compare the pages needed by two queries.':'Move whole rows into category order. Watch equal category values form longer runs.'});}
const encodingSections=[['tagged','Field tags and compatibility',137,.6314478609221467],['schemas','Writer and reader schemas',141,.6937598790627362],['roundtrip','The read-modify-write trap',146,.3586708390022676]];
foundationChapters.push({n:4,title:'Encoding and evolution',page:128,sections:encodingSections.map(([kind,title,page,y])=>({id:'4-'+kind,title,page,y}))});
for(const [kind,,page,y]of encodingSections)foundationCues.push({at:{page,y},demo:'ddia-encoding-'+kind,note:kind==='tagged'?'Switch writer and reader versions. A field tag must keep its meaning even when its name changes.':kind==='schemas'?'Match the writer fields against the reader schema. Missing fields need a declared default.':'An old application can read a record successfully and still lose unknown fields when it writes the record back.'});
// Replace preparation gaps with relevant chapter previews; keep model scope explicit.
for(let i=foundationCues.length-1;i>=0;i--)if(foundationCues[i].demo==='ddia-unprepared'||foundationCues[i].note.includes('B-trees, which are still'))foundationCues.splice(i,1);
for(const [page,demo,note]of [[22,'ddia-tradeoff-reliability','Chapter preview: explore how a component fault differs from service failure. Other system requirements need different models.'],[46,'ddia-shape-references','Chapter preview: compare copied facts with references. This scene does not represent every data model.'],[88,'ddia-storage-log','Chapter preview: follow an append-only log and its index before comparing other storage layouts.'],[128,'ddia-encoding-tagged','Chapter preview: use field tags to explore compatibility. The illustration is conceptual, not a byte-level codec.']])foundationCues.push({at:{page,y:0},demo,note});
foundationCues.push({at:{page:148,y:0},demo:'ddia-encoding-roundtrip',note:'Keep the compatibility example in view. It does not model RPC delivery, broker behavior, or transport failures.'});

// One persistent history develops with the source; each new problem motivates a step.
import {storageStoryDemo} from './storage-story-view-v1.js';
foundationDemos.push(storageStoryDemo);
const storageStorySteps=[
 ['append','Append without erasing history',89,.21677009826152682,'An update appends a new record. Follow the same keys through every step.'],
 ['scan','Find the latest value by scanning',90,.27976303854875284,'The last matching record wins. Increase the history length and watch the read work grow.'],
 ['index','Jump directly to the latest record',91,.09891647770219203,'Keep the same file. Add a memory index that remembers the latest offset.'],
 ['waste','See the history that reads hide',92,.2652811942554799,'The index makes reads fast, but obsolete versions still occupy disk space.'],
 ['compact','Copy the survivors into a new file',92,.3224240816326529,'Compaction changes the stored history while preserving the current answers.'],
 ['delete','Prevent deleted values from returning',93,.6619844293272865,'Try dropping a tombstone while an older file remains. Then keep the tombstone and compare the answer.'],
 ['recover','Recover the memory index from disk',93,.7678046107331822,'The durable history survives a restart. Replay it to rebuild the index, including deletion records.'],
];
const storageChapter=foundationChapters.find(c=>c.n===3);
storageChapter.sections=storageChapter.sections.filter(s=>s.id!=='3-log');
for(let i=foundationCues.length-1;i>=0;i--)if(foundationCues[i].demo==='ddia-storage-log')foundationCues.splice(i,1);
for(const [stage,title,page,y,note] of storageStorySteps){
 storageChapter.sections.push({id:stage==='index'?'3-log':'3-story-'+stage,title,page,y});
 foundationCues.push({at:{page,y},demo:'ddia-storage-story',params:{stage,count:8,key:'C',scope:'recent',retain:'1'},note});
}
storageChapter.sections.sort((a,b)=>a.page-b.page||a.y-b.y);
foundationCues.push({at:{page:88,y:0},demo:'ddia-storage-story',params:{stage:'append'},note:'Follow one small database as its history grows. Each next step solves a problem created by the previous design.'});
