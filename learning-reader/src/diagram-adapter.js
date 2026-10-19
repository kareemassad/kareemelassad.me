import {assetURL} from './assets.js';
import {adapterNames,adapterScene,probeValue} from './adapter-models.js';
let dependencies,sequence=0;
function visualAttributes(shape){
 if(shape.type==='curve'){const colors={'blue-curve':'#6a879e','gold-curve':'#a3784b',contour:'#b3c1ca',field:'#24272b',reference:'#a3b0b9',wedge:'#b0c2ce',patch:'#6a879e'};return {layer:shape.style==='patch'?4:3,strokeColor:colors[shape.style]||'#24272b',strokeWidth:shape.style==='patch'?2:shape.style==='contour'?.8:1.2,dash:['reference','gold-curve'].includes(shape.style)?2:0,fillColor:shape.fill?'#f1f5f7':'none',fillOpacity:shape.fill?1:0};}
 if(shape.type==='segment'||shape.type==='arrow')return {strokeColor:shape.style==='sample-field'?'#a3784b':shape.style==='normal'?'#6a879e':shape.style==='background'?'#b3c1ca':shape.type==='arrow'?'#24272b':'#b6c0c7',strokeWidth:shape.style==='background'?.8:shape.type==='arrow'?1.4:.9,dash:shape.style==='construction'?2:0,...(shape.type==='arrow'?{visible:shape.visible}:{})};
 return {};
}
function stylesheet(path){const link=document.createElement('link');link.rel='stylesheet';link.href=assetURL(path);document.head.append(link);}
function load(){
 if(!dependencies){stylesheet('vendor/renderers/katex/katex.min.css');stylesheet('src/math-equations.css');
  dependencies=Promise.all([import(assetURL('vendor/renderers/jsxgraph/core.mjs')),fetch(assetURL('src/math-equations.json')).then(r=>{if(!r.ok)throw Error('Missing prepared equations.');return r.json();})]).then(([module,math])=>{
   if(math.schemaVersion!==1||!math.equations['cone-cancellation']||!math.equations['shell-power'])throw Error('Invalid prepared equations.');
   return {JXG:module.default,math};
  });
 }
 return dependencies;
}
// Only audited scene names reach this adapter. All coordinates and callbacks
// come from local model code. Provider data cannot supply executable formulas.
export class PreparedAdapter{
 constructor(stage,{onReady,onChange,onError}){Object.assign(this,{stage,onReady,onChange,onError});this.current=null;this.scene='';this.board=null;this.token=0;}
 clear(){this.token++;if(this.board)this.library.JSXGraph.freeBoard(this.board);this.observer?.disconnect();if(this.scrollListener)this.stage.removeEventListener('scroll',this.scrollListener);clearTimeout(this.dragEndTimer);this.wrapper?.remove();this.board=null;this.wrapper=null;this.scene='';this.current=null;}
 render(scene,state,{explorationOnly=false}={}){
  if(!adapterNames.includes(scene)){if(this.scene)this.clear();return false;}
  if(this.scene!==scene){this.clear();this.scene=scene;}
  const next=adapterScene(scene,state);if(explorationOnly)for(const p of next.shapes)if(p.id==='hint')p.text=p.text.replaceAll('Space: pause / play','More controls below');const signature=next.shapes.map(s=>s.id+':'+s.type).join('|')+';'+next.equations.map(e=>e.id).join('|');
  if(this.board&&this.signature!==signature){this.clear();this.scene=scene;}
  this.current=next;this.signature=signature;
  if(this.failed)return false;
  if(!this.library){if(!this.pending){this.pending=true;load().then(({JXG,math})=>{this.library=JXG;this.math=math;this.pending=false;if(this.scene)this.onReady();}).catch(error=>{this.failed=true;this.pending=false;if(this.scene)this.onError(error);});}return false;}
  try{if(!this.board)this.mount();this.update();return true;}catch(error){this.clear();this.failed=true;this.onError(error);return false;}
 }
 mount(){
  const wrapper=document.createElement('div');wrapper.className='prepared-geometry';wrapper.dataset.renderer='jsxgraph';
  const canvas=document.createElement('div');canvas.className='prepared-geometry-canvas';canvas.id='prepared-geometry-'+(++sequence);wrapper.append(canvas);this.stage.replaceChildren(wrapper);this.wrapper=wrapper;this.canvas=canvas;
  const height=this.current.height||452;canvas.style.setProperty('--geometry-height',height+'px');
  const board=this.library.JSXGraph.initBoard(canvas,{boundingbox:[0,height,600,0],axis:false,renderer:'svg',keepaspectratio:false,showCopyright:false,showNavigation:false,resize:{enabled:false},pan:{enabled:false},browserPan:{enabled:true},zoom:{enabled:false},keyboard:{enabled:false},showInfobox:false});this.board=board;this.elements=[];this.elementStyles=[];
  canvas.style.touchAction='pan-x pan-y';
  // JSXGraph caches its container origin for up to one second. Our phone
  // canvas can scroll inside an ancestor, so invalidate before a new gesture.
  const refreshPosition=()=>{board.cPos=[];board.updateCSSTransforms();};
  canvas.addEventListener('pointerdown',event=>{
   if(event.target===this.probe?.rendNode){event.preventDefault();this.stage.focus({preventScroll:true});}
   refreshPosition();
  },true);this.scrollListener=refreshPosition;this.stage.addEventListener('scroll',refreshPosition,{passive:true});
  const at=(index,key)=>[()=>this.current.shapes[index][key][0],()=>height-this.current.shapes[index][key][1]];
  const base={fixed:true,highlight:false,withLabel:false,strokeColor:'#91a8b8',strokeWidth:1.2,fillColor:'#fff',fillOpacity:1,layer:5};
  for(const [index,shape] of this.current.shapes.entries()){
   let element;const attributes={...base};
   if(shape.type==='text')element=board.create('text',[...at(index,'at'),()=>this.current.shapes[index].text],{...attributes,layer:9,display:'internal',parse:false,anchorX:'middle',anchorY:'middle',fontSize:12,strokeColor:'#72808a',useMathJax:false,useKatex:false});
   else if(shape.type==='circle')element=board.create('circle',[at(index,'at'),()=>this.current.shapes[index].radius],{...attributes,layer:2});
   else if(shape.type==='point')element=board.create('point',shape.probe?shape.at.map((v,i)=>i?height-v:v):at(index,'at'),{...attributes,layer:8,fixed:!shape.probe,size:shape.probe?3:1.2,face:'o',fillColor:'#24272b',strokeColor:'#fff',strokeWidth:.8,name:'',showInfobox:false});
   else if(shape.type==='segment'||shape.type==='arrow')element=board.create(shape.type,[at(index,'from'),at(index,'to')],{...attributes,layer:6,...visualAttributes(shape),point1:{visible:false},point2:{visible:false}});
   else if(shape.type==='curve'){
    element=board.create('curve',[[],[]],{...attributes,...visualAttributes(shape)});
    element.updateDataArray=()=>{element.dataX=this.current.shapes[index].points.map(p=>p[0]);element.dataY=this.current.shapes[index].points.map(p=>height-p[1]);};
   }else throw Error('Unsupported geometry primitive.');
   this.elements.push(element);this.elementStyles.push(JSON.stringify(visualAttributes(shape)));
   if(shape.probe){this.probe=element;element.rendNode.style.touchAction='none';element.rendNode.style.cursor='ew-resize';element.on('down',()=>{this.dragging=true;});element.on('drag',()=>{this.onChange(this.current.probe.parameter,probeValue(this.current,element.X()));});}
  }
  this.mathNodes=[];for(const equation of this.current.equations){const node=document.createElement('div');node.className='math-equation';node.dataset.equation=equation.id;node.style.left=equation.x+'px';node.style.top=equation.y+'px';node.innerHTML=this.math.equations[equation.id].html;canvas.append(node);this.mathNodes.push(node);}
  wrapper.addEventListener('click',event=>{if(this.dragging){event.stopPropagation();this.dragging=false;}},true);
  wrapper.addEventListener('pointerup',()=>{clearTimeout(this.dragEndTimer);this.dragEndTimer=setTimeout(()=>{this.dragging=false;},0);},true);
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.stage);this.resize();
  const svg=canvas.querySelector('svg');svg?.setAttribute('role','img');svg?.setAttribute('aria-label',this.current.label);
 }
 update(){
  for(const [index,element] of this.elements.entries()){const shape=this.current.shapes[index],attributes=visualAttributes(shape),signature=JSON.stringify(attributes);if(this.elementStyles[index]!==signature){element.setAttribute(attributes);this.elementStyles[index]=signature;}if(shape.probe)element.setPosition(this.library.COORDS_BY_USER,[shape.at[0],(this.current.height||452)-shape.at[1]]);}
  this.board.update();
 }
 resize(){
  if(!this.wrapper)return;const mobile=matchMedia('(max-width:580px)').matches,scale=mobile?1:Math.max(.84,Math.min(this.stage.clientWidth/600,this.stage.clientHeight/(this.current.height||452)));
  this.wrapper.style.width=600*scale+'px';this.wrapper.style.height=(this.current.height||452)*scale+'px';this.canvas.style.transform='scale('+scale+')';
  this.board.cPos=[];this.board.updateCSSTransforms();
 }
}
