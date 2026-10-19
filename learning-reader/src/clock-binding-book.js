export async function installClockBinding(shelf){
 const button=document.createElement('button');button.type='button';button.textContent='Read local clock lesson';
 const open=async()=>{await shelf.restored;await shelf.catalog.ready;const pack=[...shelf.catalog.packs.values()].find(p=>p.scene==='clock-path'||p.format==='clock-path-explanations');if(!pack||!shelf.catalog.compatible(pack)){shelf.notice('Import the local prepared reading plan, then choose its matching PDF.');return;}const book=shelf.books.get(pack.source.sha256);if(!book){shelf.notice('Import the matching local PDF for this reading plan.');return;}const at=pack.coverage[0].start;await shelf.open(book,{position:{page:at.page,y:at.y+.012,zoom:'fit',split:50,left:0}});};
 button.addEventListener('click',open);document.querySelector('.library-options-panel')?.prepend(button);if(new URLSearchParams(location.search).get('lesson')==='clock')await open();
}
