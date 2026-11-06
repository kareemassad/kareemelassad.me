// Small page models. Counts describe logical pages, not measured storage I/O.
export function treePageModel({key=13,insert=0}={}){
 if(!Number.isInteger(key)||key<0||key>31||![0,1].includes(insert))throw Error('Invalid tree inputs');
 const before=Array.from({length:4},(_,p)=>Array.from({length:4},(_,i)=>p*8+i*2)),owner=Math.min(3,Math.floor(key/8)),exists=before[owner].includes(key),leaves=before.map(a=>[...a]);let split=false;
 if(insert&&!exists){const added=[...leaves[owner],key].sort((a,b)=>a-b);leaves.splice(owner,1,added.slice(0,2),added.slice(2));split=true;}
 const separators=leaves.slice(1).map(a=>a[0]);let target=0;for(const separator of separators)if(key>=separator)target++;
 return {key,before,leaves,owner,target,separators,exists,split,found:leaves[target].includes(key),pagesRead:2,pagesWritten:insert?(split?3:1):0};
}
export function storageLayoutModel({columnar=1,query=0}={}){
 if(![0,1].includes(columnar)||![0,1].includes(query))throw Error('Invalid layout inputs');
 const cells=Array.from({length:72},(_,id)=>{const row=Math.floor(id/6),col=id%6,offset=columnar?col*12+row:id;return {id,row,col,offset,page:Math.floor(offset/6),needed:query?row===5:col===2,value:col===2?row+1:row*6+col};});
 const pages=[...new Set(cells.filter(c=>c.needed).map(c=>c.page))];return {cells,pages,needed:query?6:12,loaded:pages.length*6,sum:78};
}
export function compressionModel({sorted=0}={}){
 if(![0,1].includes(sorted))throw Error('Invalid compression input');
 const rows=Array.from({length:12},(_,id)=>({id,category:['A','B','C'][id%3],amount:id+1}));if(sorted)rows.sort((a,b)=>a.category.localeCompare(b.category)||a.id-b.id);
 const runs=[];for(const row of rows){const last=runs.at(-1);if(last?.value===row.category)last.count++;else runs.push({value:row.category,count:1});}return {rows,runs};
}
