const options=document.getElementById('library-options');
if(options){
  const summary=options.querySelector('summary');
  document.addEventListener('click',event=>{if(options.open&&!options.contains(event.target))options.open=false;});
  options.addEventListener('keydown',event=>{if(event.key==='Escape'&&options.open){event.preventDefault();options.open=false;summary.focus();}});
  options.addEventListener('click',event=>{const button=event.target.closest('button');if(button&&button.id!=='storage-details'){options.open=false;summary.focus();}});
}
