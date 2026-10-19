const rendered=new WeakMap();
export function localPDFCover(document){
 if(!rendered.has(document))rendered.set(document,(async()=>{
  const page=await document.getPage(1),base=page.getViewport({scale:1}),viewport=page.getViewport({scale:260/base.width});
  const canvas=globalThis.document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
  await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
  const image=canvas.toDataURL('image/jpeg',.86);canvas.width=canvas.height=0;return image;
 })().catch(()=>null));
 return rendered.get(document);
}
