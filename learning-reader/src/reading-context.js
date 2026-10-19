import {anchorPosition} from './source-anchor.js';
const normal=s=>s.normalize('NFKC').replace(/\s+/g,' ').trim();
// Only the first substantive body line can supply a leading aid. Earlier body
// context, an unsupported paragraph, or a different heading prevents discovery.
export function leadingBodyPassage(passages,content,view){
 const items=content.items.filter(i=>typeof i.str==='string'&&i.str.trim()),weights=new Map();
 for(const i of items){const height=Math.round((i.height||Math.hypot(i.transform[2],i.transform[3]))*10)/10;weights.set(height,(weights.get(height)||0)+normal(i.str).length);}
 const bodyHeight=[...weights].sort((a,b)=>b[1]-a[1])[0]?.[0];if(!bodyHeight)return null;
 const body=items.filter(i=>{const height=i.height||Math.hypot(i.transform[2],i.transform[3]),point=anchorPosition(i,view);return Math.abs(height-bodyHeight)<.15&&point.x<.65&&normal(i.str).length>2;}).map(i=>({item:i,...anchorPosition(i,view)})).sort((a,b)=>a.y-b.y||a.x-b.x);
 const first=body[0];if(!first||first.y>.25)return null;
 return passages.find(p=>typeof p.source?.anchor==='string'&&Math.abs(p.y-first.y)<.003&&normal(first.item.str).includes(normal(p.source.anchor)))||null;
}
export function readingScale(zoom,width,pageWidth,narrow){return zoom==='fit'?Math.max(width/pageWidth,narrow?1.25:0):Number(zoom);}

export const hasPotentialVariant=scene=>scene==='potential'||scene==='potential-loop';
export const readingScene=(scene,variant)=>hasPotentialVariant(scene)?(variant==='loop'?'potential-loop':'potential'):scene;
