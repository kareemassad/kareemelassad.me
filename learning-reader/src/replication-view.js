import {replicationState} from './replication-models.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const element=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
const xFor=(i,n)=>n===2?190+i*240:65+i*490/(n-1);
function chassis(i,n){const x=xFor(i,n),y=137;return `<g data-replica="${i}" class="replication-node"><ellipse cx="${x}" cy="228" rx="47" ry="8" class="rep-shadow"/><path d="M${x-30} ${y}l16 -12h60l-16 12z" class="rep-top"/><path d="M${x+30} ${y}l16 -12v73l-16 12z" class="rep-side"/><rect x="${x-30}" y="${y}" width="60" height="73" rx="3" class="rep-face"/>${[0,1,2].map(row=>`<rect x="${x-23}" y="${y+8+row*18}" width="46" height="12" rx="2" class="rep-slot"/><circle cx="${x-16}" cy="${y+14+row*18}" r="2" class="rep-led"/>${[0,1,2,3].map(j=>`<path d="M${x-5+j*5} ${y+11+row*18}v6" class="rep-vent"/>`).join('')}`).join('')}<circle cx="${x-25}" cy="${y+5}" r="1.3" class="rep-screw"/><circle cx="${x+25}" cy="${y+5}" r="1.3" class="rep-screw"/><circle cx="${x-25}" cy="${y+68}" r="1.3" class="rep-screw"/><circle cx="${x+25}" cy="${y+68}" r="1.3" class="rep-screw"/><circle cx="${x}" cy="${y+73}" r="3" class="rep-port"/><text data-name x="${x}" y="108" text-anchor="middle"/><text data-value x="${x}" y="251" text-anchor="middle"/><text data-status x="${x}" y="270" text-anchor="middle"/></g>`;}

export function replicationControls(container,id,state,onApply){
 container.replaceChildren();const details=element('details');details.className='replication-controls';details.open=true;details.append(element('summary','Explore this replication case'));
 const result=replicationState(id,state),label=element('label','Case'),select=element('select');select.setAttribute('aria-label','Replication case');select.dataset.replicationControl='step';
 for(const [i,name]of result.lesson.cases.entries()){const option=element('option',name);option.value=i;select.append(option);}select.value=state.step;select.addEventListener('change',()=>onApply({step:Number(select.value)}));label.append(select);details.append(label);
 const controls=id==='quorum'?[['w','Write responses W',1,5],['r','Read responses R',1,5],['start','Read set starts at replica',0,4]]:id==='ack'?[['sync','Wait for follower A',0,1]]:[];
 for(const [key,text,min,max]of controls){const row=element('label',text),out=element('output',state[key]),input=element('input');input.type='range';Object.assign(input,{min,max,step:1,value:state[key]});input.dataset.replicationControl=key;input.setAttribute('aria-label',text);input.addEventListener('input',()=>{out.textContent=input.value;onApply({[key]:Number(input.value)});});row.append(out,input);details.append(row);}
 details.append(element('small','Original synthetic data. Choose a case or use the keyboard.'));container.append(details);container.hidden=false;
}

export function renderReplication(container,id,state){
 const model=replicationState(id,state),n=model.nodes.length;
 if(container.dataset.replicationLab!==id||!container.querySelector('.replication-figure')){
  container.dataset.replicationLab=id;
  container.innerHTML=`<article class="replication-lab"><p class="replication-eyebrow">REPLICATION EXPERIMENT</p><svg class="replication-figure" viewBox="0 0 620 372" role="img" aria-label="${esc(model.lesson.title)}"><defs><marker id="replication-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8z"/></marker></defs><path d="M18 211L34 199H601L585 211v18H18z" class="rep-platform"/>${Array.from({length:20},(_,i)=>`<path d="M${30+i*29} 213v${i%5===0?7:3}" class="rep-tick"/>`).join('')}${Array.from({length:n},(_,i)=>chassis(i,n)).join('')}<g data-messages></g><text x="310" y="350" text-anchor="middle" class="rep-synthetic">Event order is illustrative; distances do not measure latency.</text></svg><p class="replication-result" role="status"></p><p class="replication-case"></p><dl class="replication-readouts"></dl></article>`;
 }
 for(const [i,node]of model.nodes.entries()){
  const group=container.querySelector(`[data-replica="${i}"]`);group.classList.toggle('offline',node.status==='offline');group.classList.toggle('read',!!node.read);group.classList.toggle('written',!!node.written);
  group.querySelector('[data-name]').textContent=node.name;group.querySelector('[data-value]').textContent=node.value;
  group.querySelector('[data-status]').textContent=node.status==='offline'?'offline':node.read?'read set':node.written?'write set':'';
 }
 container.querySelector('[data-messages]').innerHTML=model.edges.map((edge,i)=>{const x1=xFor(edge.from,n),x2=xFor(edge.to,n),y=299+i*25;return `<path d="M${x1} 213C${x1} ${y},${x2} ${y},${x2} 216" class="rep-message" marker-end="url(#replication-arrow)"/><text x="${(x1+x2)/2}" y="${y+4}" text-anchor="middle" class="rep-message-label">${esc(edge.label)}</text>`;}).join('');
 container.querySelector('.replication-result').textContent=model.result;container.querySelector('.replication-case').textContent=model.caseLabel;
 const readouts=id==='quorum'?[['Fixed replicas','5'],['W + R',state.w+state.r],['Overlap',model.values.overlap.length],['Read value','v'+model.values.version]]:id==='ack'?[['Policy',state.sync?'wait for A':'asynchronous'],['Client reply',model.values.acknowledged?'acknowledged':'pending']]:id==='vectors'?[['Relation',model.values.relation]]:[];
 container.querySelector('.replication-readouts').innerHTML=readouts.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('');
 return model;
}
