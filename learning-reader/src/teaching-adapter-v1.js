import {teachingBinding} from './teaching-content-v1.js';
import {teachingDefaults,teachingControls,renderTeaching,syncTeachingControls} from './teaching-view-v1.js';

// Only the reader shell chooses these additions. Published package codecs and
// their pinned model files continue to verify against their original bytes.
const adapters=new Map();
export function teachingModelFor(passage,sourceHash) {
 const binding=teachingBinding(passage,sourceHash);
 if(!binding)return null;
 if(!adapters.has(binding)){
  let apply;
  adapters.set(binding,Object.freeze({
   defaults:()=>teachingDefaults(binding),
   savedScene:(passage,state)=>state.savedDiagram&&binding.kind==='surface'?binding.scene:null,
   controls:(container,passage,state,onApply)=>{apply=onApply;teachingControls(container,binding,state,onApply);},
   render:(container,passage,state)=>renderTeaching(container,binding,state,values=>apply?.(values)),
   syncControls:syncTeachingControls
  }));
 }
 return adapters.get(binding);
}
