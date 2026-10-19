import {clockPath} from './clock-path-v1.js';
const key=p=>'learning-reader.clock.v1:'+p.packId+':'+p.packVersion+':'+p.id;
const valid=s=>{try{clockPath(s.heightRatio);return Number.isInteger(s.phase)&&s.phase>=0&&s.phase<=4&&Number.isFinite(s.trace)&&s.trace>=0&&s.trace<=1&&typeof s.moving==='boolean';}catch{return false;}};
export function restoreClock(p,storage){try{storage??=globalThis.localStorage;const value=JSON.parse(storage.getItem(key(p)));return value?.version===1&&typeof value.exploring==='boolean'&&valid(value.state)?value:null;}catch{return null;}}
export function persistClock(p,state,selection,storage){try{storage??=globalThis.localStorage;const s={heightRatio:state.heightRatio,phase:state.phase,trace:state.trace||0,moving:!!state.moving};if(!valid(s))return false;storage.setItem(key(p),JSON.stringify({version:1,state:s,exploring:selection?.following===false}));return true;}catch{return false;}}
