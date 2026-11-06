import {streamDemos} from './stream-view-v1.js';
export {streamDemos};
const sections=[
 ['log','Logs, offsets, and replay',454,.3796538926681783,'Move a consumer back through the retained log. Reading leaves the log intact, but retention limits replay.'],
 ['projection','Events and derived state',463,.8174605593348451,'Rebuild the quantity from its history. Compare full replacement values with events that change the quantity.'],
 ['windows','Event time and late arrivals',474,.3796538926681783,'Delay one event without changing when it occurred. Compare the two clocks and the treatment of a late result.'],
 ['effects','Replay and duplicate effects',482,.605038790627362,'Crash after the output changes but before the consumer position is recorded. Replay must not repeat the effect.']
];
export const streamChapter={n:11,title:'Stream processing',page:446,sections:sections.map(([id,title,page,y])=>({id:'11-'+id,title,page,y}))};
export const streamCues=sections.map(([id,,page,y,note])=>({at:{page,y},demo:'ddia-stream-'+id,note}));
streamCues.push({at:{page:446,y:0},demo:'ddia-stream-log',note:'Chapter preview: follow a retained input log through independent consumers. Other messaging systems can use different delivery rules.'},{at:{page:457,y:.4177491609977323},demo:'ddia-stream-log',params:{start:0},note:'A fresh consumer can replay retained records without moving another consumer’s position.'},{at:{page:460,y:.22110470143613004},demo:'ddia-stream-projection',params:{mode:'0',compact:'0'},note:'A full change record replaces the derived value. This one-key model does not show capture infrastructure or cross-key transactions.'},{at:{page:475,y:.5152362358276644},demo:'ddia-stream-windows',params:{clock:'0',delay:18},note:'Declaring a window ready does not prove that every event arrived. Compare dropping a late event with issuing a corrected result.'});
