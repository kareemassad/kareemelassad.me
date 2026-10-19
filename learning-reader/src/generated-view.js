import {evaluateGeneratedModel,expressionText} from './generated-model.js';
const el=(tag,text,className)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;};
const fmt=n=>n===0?'0':Math.abs(n)>=.001&&Math.abs(n)<10000?Number(n.toPrecision(5)).toString():n.toExponential(3);
const unitLabel=unit=>unit==='1'?'dimensionless':unit;
const valueLabel=(value,unit)=>fmt(value)+(unit==='1'?'':' '+unit);
const svg=(tag,attrs,text)=>{const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;};
export function generatedControls(container,model,state,onApply){
 container.querySelector('.generated-controls')?.remove();const details=el('details',undefined,'generated-controls');details.open=true;details.append(el('summary','Explore the declared relationships'));
 if(model.kind==='argument'){
  const label=el('label','Inspect a claim');const select=el('select');select.dataset.generatedControl='step';select.size=Math.min(6,model.claims.length);select.setAttribute('aria-label','Inspect a claim');model.claims.forEach((c,i)=>{const option=el('option',`${i+1}. ${c.id} · ${c.status}`);option.value=i;select.append(option);});select.value=state.step||0;select.addEventListener('change',()=>onApply({step:Number(select.value)}));label.append(select,el('small','Choose a claim to highlight its reasoning links.'));details.append(label);
 }else{
  for(const p of model.inputs){const label=el('label',`${p.symbol} · ${p.label}`),out=el('output',valueLabel(state[p.symbol],p.displayUnit)),input=el('input');input.type='range';Object.assign(input,{min:p.min,max:p.max,step:p.step,value:state[p.symbol]});input.dataset.generatedControl=p.symbol;input.setAttribute('aria-label',p.label+' ('+unitLabel(p.displayUnit)+')');input.addEventListener('input',()=>{out.textContent=valueLabel(Number(input.value),p.displayUnit);onApply({[p.symbol]:Number(input.value)});});label.append(out,input,el('small',`${p.min}–${p.max} ${unitLabel(p.displayUnit)} · ${p.origin}`));details.append(label);}
  if(model.sweep&&model.outputs.length>1){const label=el('div',undefined,'generated-output-choices');label.append(el('p','Plot output'));for(const o of model.outputs){const button=el('button',o.symbol+' ('+unitLabel(o.unit)+')');button.type='button';button.dataset.generatedOutputChoice=o.symbol;button.setAttribute('aria-pressed',String(o.symbol===(state._output||model.outputs[0].symbol)));button.addEventListener('click',()=>{for(const b of label.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===button));onApply({_output:o.symbol});});label.append(button);}details.append(label);}
 }
 container.append(details);container.hidden=false;
}
export function renderGenerated(container,model,state){
 const result=evaluateGeneratedModel(model,state),board=el('article',undefined,'generated-board');board.dataset.generatedKind=model.kind;board.append(el('p',model.kind==='argument'?'SOURCE REASONING':'SOURCE EQUATIONS','generated-eyebrow'));
 if(model.kind==='argument'){
  board.append(el('h2','Follow the argument'),el('p','Links express the declared reasoning. They imply no physical transport or proof order.','generated-note'));
  const selected=model.claims[result.selected];for(const[i,c]of model.claims.entries()){const card=el('div',undefined,'generated-claim'+(i===result.selected?' selected':''));card.dataset.claim=c.id;card.append(el('span',`${i+1} · ${c.status}`,'generated-status'),el('h3',c.id),el('p',c.statement),el('small','Source items: '+c.evidenceItemIds.join(', ')));board.append(card);}
  board.append(el('h3','Declared links'));for(const r of model.relations){const link=el('p',`${r.from} → ${r.to} · ${r.kind}`,r.from===selected.id||r.to===selected.id?'generated-link selected':'generated-link');link.dataset.relation=r.id;board.append(link);}
  board.append(el('p','Symbolic context is retained in the reviewed source declaration; no numerical values are computed.','generated-note'));
 }else{
  board.append(el('h2','Change an input. Trace the result.'),el('p','Functional relationships from the supplied equations; the layout does not infer physical geometry.','generated-note'));
  const outputs=el('div',undefined,'generated-results');for(const o of result.outputs){const card=el('div');card.dataset.generatedOutput=o.symbol;card.append(el('span',o.meaning+(o.unit==='1'?' · dimensionless':'')),el('strong',`${o.symbol} = ${valueLabel(o.value,o.unit)}`));outputs.append(card);}board.append(outputs);
  const equationDetails=el('details',undefined,'generated-trace');equationDetails.append(el('summary','Trace the calculation'));
  for(const e of model.equations){const row=el('div',undefined,'generated-equation');row.dataset.equation=e.id;row.append(el('strong',`${expressionText(e.lhs)} = ${expressionText(e.rhs)}`),el('p',`${valueLabel(result.values[e.lhs.symbol]/e.outputScale,e.outputUnit)}${e.outputUnit==='1'?' (dimensionless)':''} · ${e.meaning}`),el('small',e.label));equationDetails.append(row);}
  if(model.sweep){
   const p=model.inputs.find(p=>p.symbol===model.sweep),output=model.outputs.find(o=>o.symbol===state._output)||model.outputs[0],points=[];for(let i=0;i<=80;i++){const x=p.min+(p.max-p.min)*(i/80),y=evaluateGeneratedModel(model,{...state,[p.symbol]:x}).outputs.find(o=>o.symbol===output.symbol).value;points.push([x,y]);}
   const rawLo=Math.min(...points.map(p=>p[1])),rawHi=Math.max(...points.map(p=>p[1])),axisScale=Math.max(Math.abs(rawLo),Math.abs(rawHi),1e-100);let lo=rawLo/axisScale,hi=rawHi/axisScale;const pad=lo===hi?.1:(hi-lo)*.08;lo=Math.max(-Number.MAX_VALUE/axisScale,lo-pad);hi=Math.min(Number.MAX_VALUE/axisScale,hi+pad);
   const x=v=>84+474*((v-p.min)/(p.max-p.min)),y=v=>214-160*((v/axisScale-lo)/(hi-lo)),chart=svg('svg',{viewBox:'0 0 600 265',role:'img','aria-label':`${output.symbol} in ${unitLabel(output.unit)} versus ${p.symbol} in ${unitLabel(p.displayUnit)}`});
   chart.append(svg('path',{d:'M84 48V214H558',class:'generated-axis'}));for(const v of [lo,hi]){const actual=Math.max(-Number.MAX_VALUE,Math.min(Number.MAX_VALUE,v*axisScale));chart.append(svg('text',{x:78,y:y(actual)+4,'text-anchor':'end',class:'generated-tick'},fmt(Math.abs(actual)<Math.max(Math.abs(rawLo),Math.abs(rawHi))*1e-12?0:actual)));}
   chart.append(svg('text',{x:84,y:238,class:'generated-tick'},fmt(p.min)),svg('text',{x:558,y:238,'text-anchor':'end',class:'generated-tick'},fmt(p.max)),svg('text',{x:308,y:259,'text-anchor':'middle',class:'generated-tick'},p.symbol+' ('+unitLabel(p.displayUnit)+')'),svg('text',{x:84,y:24,class:'generated-tick'},output.symbol+' ('+unitLabel(output.unit)+')'));
   chart.append(svg('polyline',{points:points.map(([a,b])=>x(a)+','+y(b)).join(' '),class:'generated-curve'}));const current=result.outputs.find(o=>o.symbol===output.symbol);chart.append(svg('circle',{cx:x(state[p.symbol]),cy:y(current.value),r:5,class:'generated-point'}));board.append(chart);
   const held=[...model.inputs.filter(q=>q.symbol!==p.symbol).map(q=>`${q.symbol}=${valueLabel(state[q.symbol],q.displayUnit)}`),...model.constants.map(q=>`${q.symbol}=${valueLabel(q.value,q.unit)}`)];board.append(el('p',`Sweep ${p.symbol}: ${p.min}–${p.max} ${unitLabel(p.displayUnit)}. Held: ${held.join('; ')||'no other inputs'}.`,'generated-note'));
  }
  board.append(equationDetails);
 }
 container.replaceChildren(board);return result;
}
