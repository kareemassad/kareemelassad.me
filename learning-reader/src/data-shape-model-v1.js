// Chapter 2: finite synthetic models of references, query plans, and reachability.
export function referenceModel({normalized=0,updated=2}={}){
 if(![0,1].includes(normalized)||!Number.isInteger(updated)||updated<0||updated>6)throw Error('Invalid reference inputs');
 const names=Array.from({length:6},(_,i)=>normalized||i<updated?'New name':'Old name');
 return {names,writes:normalized?1:updated,stale:names.filter(n=>n==='Old name').length,storedNames:normalized?1:6};
}
export function queryPlanModel({indexed=0}={}){
 if(![0,1].includes(indexed))throw Error('Invalid query plan');
 const rows=Array.from({length:12},(_,id)=>({id,match:[1,4,8].includes(id)})),visited=indexed?rows.filter(r=>r.match):rows;
 return {rows,visited:visited.map(r=>r.id),matches:rows.filter(r=>r.match).map(r=>r.id),indexLookups:indexed?1:0};
}
export const regionNodes=['Ari','Town','Region','Country','Continent','Bea','Island'];
export function reachabilityModel({linked=1}={}){
 if(![0,1].includes(linked))throw Error('Invalid graph input');
 const edges=[[0,1],[1,2],[2,3],[3,4],[5,6],...(linked?[[6,3]]:[])],levels=[Array(regionNodes.length).fill(Infinity)];levels[0][4]=0;
 for(let round=0;round<5;round++){const next=[...levels.at(-1)];for(const [from,to]of edges)if(levels.at(-1)[to]<Infinity)next[from]=Math.min(next[from],levels.at(-1)[to]+1);levels.push(next);}
 return {edges,levels,matches:[0,5].filter(id=>Number.isFinite(levels.at(-1)[id]))};
}
