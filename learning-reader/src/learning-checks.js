import {sourceModelNames as chapter3Names,sourceModelReaderControls as chapter3ReaderControls} from './source-models.js';
import {gradientModel} from './gradient-models.js';
import {boundaryModel} from './boundary-models.js';
import {templateControls,templateInitial,validateTemplate} from './templates.js';
import {additionalChecks,additionalOutcome} from './additional-learning-checks.js';

const fmt=n=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(4)).toString();
export const predictionScenes=Object.freeze(['gradient-direction','gradient-coordinates','surface-flux','stokes-square',...Object.keys(additionalChecks)]);
export function predictionSpec(scene,variant='standard'){
 if(additionalChecks[scene]){const {before,after,question,choices}=additionalChecks[scene];return {before:{...before},after:{...after},question,choices};}
 if(scene==='gradient-direction')return {before:{r:.4,b:120,q:.5},after:{r:.8,b:120,q:.5},question:'At β = 120° and κ = 0.5, h goes from 0.4 to 0.8 m. What sign will the exact ΔT have?',choices:[['positive','Positive'],['negative','Negative'],['zero','Zero']]};
 if(scene==='surface-flux')return {before:{a:1,b:30,q:1},after:{a:1,b:210,q:1},question:'Reverse the normal from 30° to 210°. Keep C and area fixed. What happens to the flux?',choices:[['reverse','Its sign reverses'],['same','It stays the same'],['zero','It becomes zero']]};
 if(scene==='stokes-square')return {before:{r:.6,a:.4,b:.7,n:0},after:{r:.6,a:.4,b:.7,n:1},question:'Reverse both the boundary direction and normal. What happens to the circulation?',choices:[['reverse','Its sign reverses'],['same','It stays the same'],['zero','It becomes zero']]};
 if(scene==='gradient-coordinates'){
  const unfamiliar=variant==='unfamiliar',r=unfamiliar?.63:.5,b=unfamiliar?43:0,a=unfamiliar?37:90;
  return {before:{r,b,a:0},after:{r,b,a},question:`Keep the physical vectors fixed. Rotate the axes ${a}°. What happens to their dot product?`,choices:[['same','It stays the same'],['greater','It increases'],['less','It decreases']]};
 }
 throw Error('No prediction for this scene.');
}
export function predictionOutcome(scene,choice,variant='standard'){
 if(additionalChecks[scene])return additionalOutcome(scene,choice);
 const spec=predictionSpec(scene,variant);if(!spec.choices.some(c=>c[0]===choice))throw Error('Choose a listed prediction.');
 let answer,observed,question,reason;
 if(scene==='gradient-direction'){
  const a=gradientModel(scene,spec.before),b=gradientModel(scene,spec.after);answer=b.exact>1e-10?'positive':b.exact< -1e-10?'negative':'zero';
  observed=`Exact ΔT: ${fmt(a.exact)} → ${fmt(b.exact)} °C. First order at 0.8 m: ${fmt(b.linear)} °C.`;
  question='Why do the exact change and first-order prediction have different signs?';reason=`The first-order term is negative. The positive correction κh²/2 is ${fmt(b.error)} °C at h = 0.8 m and is larger in magnitude. This finite example does not replace the local derivative.`;
 }else if(scene==='gradient-coordinates'){
  const a=gradientModel(scene,spec.before),b=gradientModel(scene,spec.after);answer=Math.abs(a.rotatedDot-b.rotatedDot)<1e-10?'same':a.rotatedDot<b.rotatedDot?'greater':'less';
  observed=`Original dot product: ${fmt(b.linear)} °C. Rotated dot product: ${fmt(b.rotatedDot)} °C.`;question='Which components changed? Why did the scalar result stay the same?';reason='The same orthogonal rotation changes both gradient and displacement components. The two physical vectors stay fixed. Their dot product is invariant. Compare both operand pairs above.';
 }else if(scene==='surface-flux'){
  const a=boundaryModel(scene,spec.before),b=boundaryModel(scene,spec.after);answer=Math.abs(b.flux)<1e-10?'zero':Math.abs(a.flux-b.flux)<1e-10?'same':'reverse';
  observed=`Flux: ${fmt(a.flux)} → ${fmt(b.flux)} W. C and area are unchanged.`;question='What changed in C · n? Explain the sign reversal.';reason='The reversed unit normal is −n. The dot product C · n changes sign. Multiplication by the same positive area preserves that sign reversal.';
 }else{
  const a=boundaryModel(scene,spec.before),b=boundaryModel(scene,spec.after);answer=Math.abs(b.circulation)<1e-10?'zero':Math.abs(a.circulation-b.circulation)<1e-10?'same':'reverse';
  observed=`Circulation: ${fmt(a.circulation)} → ${fmt(b.circulation)} W/m. Normal curl times area changes with it.`;question='Why must the normal reverse with the boundary? Explain both minus signs.';reason='Reversing each directed edge reverses its line integral. Reversing the surface normal reverses (∇ × C) · n. The same field and surface keep the two sides of Stokes’ theorem consistent.';
 }
 return {answer,matched:answer===choice,observed,question,reason};
}
export function checkParameters(scene,state){
 if(!state||typeof state!=='object')throw Error('Missing check parameters.');
 const keys=templateControls(scene,templateInitial(scene)).map(c=>c.key),values=Object.fromEntries(keys.map(k=>[k,state[k]]));
 if(additionalChecks[scene]){validateTemplate(scene,values);additionalChecks[scene].model(scene,values);}else if(['gradient-direction','gradient-coordinates'].includes(scene))gradientModel(scene,values);else boundaryModel(scene,values);
 return values;
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function readCheckSession(text,scene){
 try{
  if(typeof text!=='string'||text.length>10000||!predictionScenes.includes(scene))return null;
  const r=JSON.parse(text);if(r.version!==1||r.scene!==scene||!['standard','unfamiliar'].includes(r.variant)||scene!=='gradient-coordinates'&&r.variant!=='standard'||!['fresh','prepared','tested','changed'].includes(r.phase)||typeof r.open!=='boolean'||typeof r.notes!=='string'||r.notes.length>1200)return null;
  const spec=predictionSpec(scene,r.variant);if(r.choice!==null&&!spec.choices.some(c=>c[0]===r.choice))return null;
  const original=r.original?checkParameters(scene,r.original):null,shown=checkParameters(scene,r.shown);
  if(r.phase!=='fresh'&&!original||r.phase==='tested'&&!r.choice||r.phase==='prepared'&&!same(shown,checkParameters(scene,spec.before))||r.phase==='tested'&&!same(shown,checkParameters(scene,spec.after)))return null;
  return {version:1,scene,variant:r.variant,phase:r.phase,open:r.open,choice:r.choice,notes:r.notes,original,shown};
 }catch{return null;}
}

// A bounded browser-local check. It evaluates model observations, not prose
// explanations or understanding. Neither answers nor notes leave this browser.
export class LearningTools{
 constructor(container,{onApply,storage}){if(storage===undefined)try{storage=globalThis.localStorage;}catch{}Object.assign(this,{container,onApply,storage});this.key='';this.session=null;}
 clear(){this.key='';this.session=null;this.sourceControls=false;this.scene='';this.slider=null;this.output=null;this.chapterInputs=[];this.passage=null;this.container.replaceChildren();this.container.hidden=true;}
 setPassage(passage){
  if(this.passage===passage)return;this.passage=passage;this.container.querySelector('.prepared-help')?.remove();
  if(!passage?.source)return;
  const help=document.createElement('div');help.className='prepared-help';help.dataset.passageId=passage.id;
  const question=document.createElement('p');question.className='prepared-question';question.textContent=passage.caption;
  const details=document.createElement('details');details.className='prepared-explanation';
  const summary=document.createElement('summary');summary.textContent='Explanation & source';details.append(summary);
  for(const [className,value]of [['prepared-text',passage.source.text],['prepared-ref',`PDF ${passage.page} · printed ${passage.source.printed} · ${passage.source.ref}`],['prepared-limits',passage.source.limit]]){if(!value)continue;const p=document.createElement('p');p.className=className;p.textContent=value;details.append(p);}
  help.append(question,details);this.container.prepend(help);this.container.hidden=false;
 }
 activate(scene,sourceHash,passageId,current,{explorationOnly=false}={}){
  this.clear();if(explorationOnly||chapter3Names.includes(scene)&&!predictionScenes.includes(scene)){this.sourceControls=true;this.scene=scene;this.container.hidden=false;const details=document.createElement('details');details.className='chapter3-controls';const summary=document.createElement('summary');summary.textContent='Explore this model';details.append(summary);this.chapterInputs=[];for(const c of chapter3ReaderControls(scene)){const label=document.createElement('label');label.textContent=c.label;const out=document.createElement('output'),input=document.createElement('input');input.type='range';Object.assign(input,{min:c.min,max:c.max,step:c.step,value:current[c.key]});input.dataset.chapterControl=c.key;input.setAttribute('aria-label',c.label);input.addEventListener('input',()=>this.onApply({[c.key]:Number(input.value)}));label.append(out,input);details.append(label);this.chapterInputs.push({c,input,out});}this.container.append(details);this.update(current);return current;}if(scene!=='gauss-cube'&&!predictionScenes.includes(scene))return current;
  this.scene=scene;this.container.hidden=false;
  if(scene==='gauss-cube'){
   this.container.innerHTML='<div class="cube-field-control"><label>Field twist ω <output></output><input type="range" min="-1" max="1" step="0.05" aria-label="Field twist omega" data-learning-control="omega"></label><span>ω adds (−ωy, ωx, 0), with zero divergence. Net flux stays fixed.</span></div>';
   this.slider=this.container.querySelector('input');this.output=this.container.querySelector('output');this.slider.addEventListener('input',()=>this.onApply({b:Number(this.slider.value)}));this.update(current);return current;
  }
  if(!/^[a-f0-9]{64}$/.test(sourceHash)||!/^[-a-z0-9]+$/.test(passageId))throw Error('Invalid check source identity.');
  this.key='visual-reader-check:v1:'+sourceHash+':'+passageId;
  let saved;try{saved=readCheckSession(this.storage?.getItem(this.key),scene);}catch{}
  this.session=saved||{version:1,scene,variant:'standard',phase:'fresh',open:false,choice:null,notes:'',original:null,shown:checkParameters(scene,current)};
  this.container.innerHTML='<details class="prediction-check"><summary>Predict &amp; test</summary><div class="prediction-panel"><p class="prediction-question"></p><div class="prediction-actions"><button type="button" data-action="setup">Set up example</button><span class="prediction-choices"></span><button type="button" data-action="test">Test</button><button type="button" data-action="restore">Restore my values</button><button type="button" data-action="unfamiliar" hidden>Try another angle</button></div><div class="prediction-result" hidden><p class="prediction-feedback" role="status"></p><label>Your explanation (optional)<textarea rows="2" maxlength="1200" aria-label="Your explanation"></textarea></label><details class="prediction-reason"><summary>Show reason</summary><p></p></details></div><p class="prediction-changed" hidden>Example changed. Set up again to test this prediction.</p></div></details>';
  this.details=this.container.querySelector('.prediction-check');this.question=this.container.querySelector('.prediction-question');this.choices=this.container.querySelector('.prediction-choices');this.feedback=this.container.querySelector('.prediction-feedback');this.result=this.container.querySelector('.prediction-result');this.note=this.container.querySelector('textarea');this.reason=this.container.querySelector('.prediction-reason p');this.changed=this.container.querySelector('.prediction-changed');this.buttons=Object.fromEntries([...this.container.querySelectorAll('[data-action]')].map(b=>[b.dataset.action,b]));
  this.details.open=this.session.open;this.note.value=this.session.notes;
  const mountedSession=this.session;
  this.details.addEventListener('toggle',()=>{if(this.session!==mountedSession)return;this.session.open=this.details.open;this.save();});
  this.note.addEventListener('input',()=>{this.session.notes=this.note.value;this.save();});
  this.buttons.setup.addEventListener('click',()=>this.setup());
  this.buttons.test.addEventListener('click',()=>{if(!this.session.choice||this.session.phase!=='prepared')return;this.session.phase='tested';this.session.shown=checkParameters(scene,predictionSpec(scene,this.session.variant).after);this.save();this.onApply(this.session.shown);this.paint();});
  this.buttons.restore.addEventListener('click',()=>{if(!this.session.original)return;this.session.phase='fresh';this.session.shown={...this.session.original};this.session.choice=null;this.save();this.onApply(this.session.shown);this.paint();});
  this.buttons.unfamiliar.addEventListener('click',()=>{this.session.variant='unfamiliar';this.session.choice=null;this.session.notes='';this.note.value='';this.setup();});
  this.paint();return saved?.open?saved.shown:current;
 }
 setup(){
  this.session.original||=this.session.shown;this.session.phase='prepared';this.session.choice=null;this.session.shown=checkParameters(this.scene,predictionSpec(this.scene,this.session.variant).before);this.save();this.onApply(this.session.shown);this.paint();
 }
 save(){if(this.session)try{this.storage?.setItem(this.key,JSON.stringify(this.session));}catch{}}
 update(state){
  if(this.container.hidden)return;
  if(this.sourceControls){for(const {c,input,out} of this.chapterInputs){input.value=state[c.key];out.textContent=fmt(state[c.key])+(c.units?' '+c.units:'');}return;}
  if(this.scene==='gauss-cube'){this.slider.value=state.b;this.output.textContent=fmt(state.b)+' W/m³';return;}
  if(!this.session)return;
  const shown=checkParameters(this.scene,state);if(same(shown,this.session.shown))return;
  this.session.shown=shown;if(['prepared','tested'].includes(this.session.phase))this.session.phase='changed';this.save();this.paint();
 }
 paint(){
  const r=this.session,spec=predictionSpec(this.scene,r.variant);this.question.textContent=spec.question;
  if(!this.choices.children.length)for(const [value,label] of spec.choices){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.choice=value;b.addEventListener('click',()=>{r.choice=value;this.save();this.paint();});this.choices.append(b);}
  for(const b of this.choices.children){b.setAttribute('aria-pressed',String(r.choice===b.dataset.choice));b.disabled=r.phase!=='prepared';}
  this.buttons.setup.textContent=r.phase==='fresh'?'Set up example':'Repeat';this.buttons.test.disabled=r.phase!=='prepared'||!r.choice;this.buttons.restore.hidden=!r.original;this.buttons.unfamiliar.hidden=this.scene!=='gradient-coordinates'||r.phase!=='tested'||r.variant!=='standard';this.result.hidden=r.phase!=='tested';this.changed.hidden=r.phase!=='changed';
  if(r.phase==='tested'){const o=predictionOutcome(this.scene,r.choice,r.variant);this.feedback.textContent=(o.matched?'Prediction matched. ':'Observed result differs. ')+o.observed+' '+o.question;this.reason.textContent=o.reason;}else{this.feedback.textContent='';this.reason.textContent='';}
 }
}
