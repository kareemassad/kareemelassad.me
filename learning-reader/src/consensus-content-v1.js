import {consensusDemos} from './consensus-view-v1.js';
export {consensusDemos};
const sections=[
 ['linear','Finding a linearization point',336,.35443808012093725,'Move the read intervals and change the returned value. Can one atomic write fit the whole history?'],
 ['logical','Causality and logical clocks',357,.2874391383219954,'Follow the counter carried by a message. A logical timestamp respects causality but cannot identify concurrent events.'],
 ['commit','Two-phase commit and uncertainty',367,.2281799244142101,'Follow the prepare promises and the durable decision. Stop the coordinator at either point, then recover it.'],
 ['epochs','Epochs and quorum barriers',379,.2943930612244897,'Move voters to the higher epoch. Compare the votes each leader can still obtain.']
];
export const consensusChapter={n:9,title:'Consistency and consensus',page:332,sections:sections.map(([id,title,page,y])=>({id:'9-'+id,title,page,y}))};
export const consensusCues=sections.map(([id,,page,y,note])=>({at:{page,y},demo:'ddia-consensus-'+id,note}));
consensusCues.push({at:{page:332,y:0},demo:'ddia-consensus-linear',note:'Chapter preview: test one single-copy guarantee before exploring ordering and agreement.'},{at:{page:370,y:0},demo:'ddia-consensus-commit',params:{crash:'2',recover:'0'},note:'A durable commit decision exists, but one participant has not received it. A timeout cannot authorize that participant to abort.'},{at:{page:398,y:0},demo:'ddia-unprepared',note:'Batch-processing scenes are in preparation. The preceding quorum model does not describe batch dataflow.'});
