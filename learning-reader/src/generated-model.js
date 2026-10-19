import {unitDimensions,unitScaleToSI,equationDimension} from './source-contract.js';

export const GENERATED_MODEL_VERSION=1;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const finite=v=>{if(!Number.isFinite(v))throw Error('Generated expression is outside its finite domain.');return v;};
const allowed=new Set(['var','number','add','sub','mul','div','pow','power','sin','cos','log']);
const refs=(n,result=new Set())=>{if(!allowed.has(n.op))throw Error('No executable meaning supplied for '+n.op+'; preserve it as symbolic context or abstain.');if(n.op==='var')result.add(n.symbol);for(const a of n.args||[])refs(a,result);return result;};
const roundOut=(value,up)=>{finite(value);if(value===0)return up?Number.MIN_VALUE:-Number.MIN_VALUE;const b=new DataView(new ArrayBuffer(8));b.setFloat64(0,value);let bits=b.getBigUint64(0);bits+=(value>0)===up?1n:-1n;b.setBigUint64(0,bits);return finite(b.getFloat64(0));};
const bounds=(a,b)=>[roundOut(Math.min(a,b),false),roundOut(Math.max(a,b),true)];
const products=(a,b)=>{const v=[a[0]*b[0],a[0]*b[1],a[1]*b[0],a[1]*b[1]];return bounds(Math.min(...v),Math.max(...v));};
const fields=(x,names)=>{if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!names.includes(k)))throw Error('Unexpected generation recipe fields.');};
const converted=(value,scale)=>{const result=finite(value*scale);if(value!==0&&result===0)throw Error('Nonzero unit conversion underflows; use a representable reviewed domain.');return result;};

// Numeric values are canonical SI; source/display units remain attached to each symbol.
export function evaluateExpression(node,values){
 if(node.op==='var'){if(!Object.hasOwn(values,node.symbol))throw Error('Unbound symbol '+node.symbol);return finite(values[node.symbol]);}
 if(node.op==='number')return finite(node.value);
 const a=node.args.map(n=>evaluateExpression(n,values));let value;
 switch(node.op){
  case 'add':value=a.reduce((x,y)=>x+y,0);break;
  case 'sub':value=a.slice(1).reduce((x,y)=>x-y,a[0]);break;
  case 'mul':value=a.reduce((x,y)=>x*y,1);break;
  case 'div':if(a[1]===0)throw Error('Division by zero.');value=a[0]/a[1];break;
  case 'pow':if(a[0]===0&&node.exponent<0)throw Error('Zero to negative power.');value=a[0]**node.exponent;break;
  case 'power':if(a[0]<=0)throw Error('Variable power requires a strictly positive base.');value=a[0]**a[1];break;
  case 'sin':value=Math.sin(a[0]);break;
  case 'cos':value=Math.cos(a[0]);break;
  case 'log':if(a[0]<=0)throw Error('Log requires a positive value.');value=Math.log(a[0]);break;
  default:throw Error('Unsupported executable operator '+node.op);
 }
 return finite(value);
}

export function expressionInterval(node,values){
 if(node.op==='var'){if(!Object.hasOwn(values,node.symbol))throw Error('Unbound interval '+node.symbol);return values[node.symbol];}
 if(node.op==='number')return bounds(node.value,node.value);
 const a=node.args.map(n=>expressionInterval(n,values));
 switch(node.op){
  case 'add':return bounds(a.reduce((v,x)=>v+x[0],0),a.reduce((v,x)=>v+x[1],0));
  case 'sub':return bounds(a.slice(1).reduce((v,x)=>v-x[1],a[0][0]),a.slice(1).reduce((v,x)=>v-x[0],a[0][1]));
  case 'mul':return a.reduce(products,[1,1]);
  case 'div':if(a[1][0]<=0&&a[1][1]>=0)throw Error('Division domain can reach zero; numerical compilation abstains.');return products(a[0],bounds(1/a[1][1],1/a[1][0]));
  case 'pow':{const p=node.exponent;if(p<0&&a[0][0]<=0&&a[0][1]>=0)throw Error('Negative-power domain can reach zero.');const x=a[0][0]**p,y=a[0][1]**p;return bounds(p%2===0&&p>0&&a[0][0]<=0&&a[0][1]>=0?0:Math.min(x,y),Math.max(x,y));}
  case 'power':if(a[0][0]<=0)throw Error('Variable-power domain is not strictly positive.');return products([1,1],bounds(Math.min(...a[0].flatMap(x=>a[1].map(y=>x**y)),a[0][0]<=1&&a[0][1]>=1?1:Infinity),Math.max(...a[0].flatMap(x=>a[1].map(y=>x**y)),a[0][0]<=1&&a[0][1]>=1?1:-Infinity)));
  case 'sin':case 'cos':return [-1,1];
  case 'log':if(a[0][0]<=0)throw Error('Log domain can be nonpositive; compilation abstains.');return bounds(Math.log(a[0][0]),Math.log(a[0][1]));
  default:throw Error('Unsupported interval operator '+node.op);
 }
}

// This compiles supplied source semantics. It neither reads prose nor solves implicit equations.
export function compileGeneratedModel(contract,recipe){
 fields(recipe,['schemaVersion','kind','equationIds','inputs','constants','outputs','sweep']);
 if(recipe.schemaVersion!==1||!['equations','argument'].includes(recipe.kind))throw Error('Choose a bounded generated equation or argument recipe.');
 if(recipe.kind==='argument'){
  if(Object.keys(recipe).some(k=>!['schemaVersion','kind'].includes(k)))throw Error('Argument recipes have no numerical controls or outputs.');
  if(contract.contractKind!=='qualitative-argument')throw Error('Argument generation requires reviewed qualitative claims.');
  if(!Array.isArray(contract.claims)||contract.claims.length<2||contract.claims.length>16||!Array.isArray(contract.relations)||contract.relations.length>24)throw Error('Bound the argument claims and links.');
  if(contract.claims.some(c=>typeof c.id!=='string'||typeof c.statement!=='string'||!['established','conditional','motivation','limitation','source-era-limitation'].includes(c.status))||new Set(contract.claims.map(c=>c.id)).size!==contract.claims.length||contract.relations.some(r=>!['support','qualifies','alternative'].includes(r.kind)))throw Error('Invalid declared argument semantics.');
  const ids=new Set(contract.claims.map(c=>c.id));
  if(contract.relations.some(r=>!ids.has(r.from)||!ids.has(r.to)))throw Error('Argument link refers to an unknown claim.');
  return {schemaVersion:1,kind:'argument',claims:structuredClone(contract.claims),relations:structuredClone(contract.relations),contextOnly:true,numericalOutputs:[],layout:'source-order',cyclePolicy:'Keep declared links; layout order implies no proof order or causality.'};
 }
 if(contract.contractKind==='qualitative-argument'||contract.equations?.some(e=>e.purpose==='source-context-only'))throw Error('Qualitative source context cannot become numerical output.');
 if(!Array.isArray(contract.quantities)||contract.quantities.length>32||new Set(contract.quantities.map(q=>q.symbol)).size!==contract.quantities.length||!Array.isArray(contract.equations)||contract.equations.length>16)throw Error('Bound declared model semantics.');
 const quantities=new Map(contract.quantities.map(q=>[q.symbol,q]));
 for(const q of quantities.values()){if(!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(q.symbol))throw Error('Invalid quantity symbol.');unitDimensions(q.unit);}
 if(!Array.isArray(recipe.equationIds)||!recipe.equationIds.length||recipe.equationIds.length>16||new Set(recipe.equationIds).size!==recipe.equationIds.length)throw Error('Select unique source equation IDs.');
 const selected=recipe.equationIds.map(id=>{const e=contract.equations.find(e=>e.id===id);if(!e)throw Error('Unknown source equation '+id);if(e.lhs.op!=='var')throw Error('Only explicit single-symbol assignments are executable; implicit equations require author interpretation.');return e;});
 for(const e of selected){if(!same(equationDimension(e.lhs,quantities),equationDimension(e.rhs,quantities)))throw Error('Inconsistent generated output dimensions.');}
 const assignments=new Map();for(const e of selected){if(assignments.has(e.lhs.symbol))throw Error('Duplicate output definition '+e.lhs.symbol);refs(e.rhs);assignments.set(e.lhs.symbol,e);}
 const inputs=recipe.inputs||[],constants=recipe.constants||[];
 if(!Array.isArray(inputs)||!Array.isArray(constants)||inputs.length>8||constants.length>24||!Array.isArray(recipe.outputs)||!recipe.outputs.length||recipe.outputs.length>8||new Set(recipe.outputs).size!==recipe.outputs.length)throw Error('Bound the inputs/constants and select unique outputs.');
 const supplied=new Set(),intervals={},modelInputs=[],modelConstants=[];
 for(const [kind,list]of [['input',inputs],['constant',constants]])for(const p of list){
  fields(p,kind==='input'?['symbol','min','max','step','default','origin','justification','displayUnit']:['symbol','value','origin','justification']);
  const q=quantities.get(p.symbol);if(!q||supplied.has(p.symbol)||assignments.has(p.symbol))throw Error('Unknown, duplicate or computed input '+p.symbol);supplied.add(p.symbol);
  if(!['source','authored-specialization'].includes(p.origin)||typeof p.justification!=='string'||p.justification.length<20)throw Error('Explicit input value/domain origin and source relationship required.');
  const scale=unitScaleToSI(q.unit),display=p.displayUnit||q.unit;
  const displayScale=display==='deg'&&q.unit==='rad'?Math.PI/180:unitScaleToSI(display);
  if(display!=='deg'&&!same(unitDimensions(display),unitDimensions(q.unit)))throw Error('Input display units differ from source quantity.');
  if(kind==='input'){
   const aligned=v=>Math.abs(v-Math.round(v))<1e-8;
   if(![p.min,p.max,p.step,p.default].every(Number.isFinite)||p.min>=p.max||p.step<=0||p.default<p.min||p.default>p.max||(p.max-p.min)/p.step>2000||!aligned((p.max-p.min)/p.step)||!aligned((p.default-p.min)/p.step))throw Error('Declare a finite bounded control domain with step-aligned endpoints and default.');
   intervals[p.symbol]=bounds(converted(p.min,displayScale),converted(p.max,displayScale));converted(p.default,displayScale);modelInputs.push({...p,label:q.description,sourceUnit:q.unit,displayUnit:display,displayScale});
  }else{finite(p.value);intervals[p.symbol]=bounds(converted(p.value,scale),converted(p.value,scale));modelConstants.push({...p,unit:q.unit,scale});}
 }
 const visiting=new Set(),done=new Set(),order=[],usedSupplied=new Set();
 const visit=s=>{if(supplied.has(s)){usedSupplied.add(s);return;}if(done.has(s))return;if(visiting.has(s))throw Error('Cyclic numerical dependency; no implicit solution is inferred.');const e=assignments.get(s);if(!e)throw Error('Missing input or equation for '+s);visiting.add(s);for(const d of refs(e.rhs))visit(d);visiting.delete(s);done.add(s);order.push(e);};
 for(const symbol of recipe.outputs){if(!assignments.has(symbol)||!quantities.has(symbol))throw Error('Requested output is not an explicit source assignment.');visit(symbol);}
 if(done.size!==assignments.size)throw Error('Unused selected equations must be removed or declared symbolic context.');
 if(usedSupplied.size!==supplied.size)throw Error('Unused controls/constants have no numerical role; preserve them as noncontrolled source context.');
 for(const e of order){if(!same(equationDimension(e.lhs,quantities),equationDimension(e.rhs,quantities)))throw Error('Inconsistent generated output dimensions.');intervals[e.lhs.symbol]=expressionInterval(e.rhs,intervals);}
 for(const e of order){const symbol=e.lhs.symbol,scale=unitScaleToSI(quantities.get(symbol).unit);for(const value of intervals[symbol])finite(value/scale);}
 if(recipe.sweep&&!modelInputs.some(p=>p.symbol===recipe.sweep))throw Error('Sweep axis must be a declared controlled input.');
 return {schemaVersion:1,kind:'equations',inputs:modelInputs,constants:modelConstants,equations:order.map(e=>({...structuredClone(e),outputUnit:quantities.get(e.lhs.symbol).unit,outputScale:unitScaleToSI(quantities.get(e.lhs.symbol).unit)})),outputs:recipe.outputs.map(s=>({symbol:s,unit:quantities.get(s).unit,scale:unitScaleToSI(quantities.get(s).unit),meaning:quantities.get(s).description})),sweep:recipe.sweep||null,intervals,contextOnly:false,numericalOutputs:recipe.outputs,geometry:'Functional dependency graph and one-dimensional parameter sweep; no physical source geometry is inferred.'};
}

export function generatedDefaults(model){return model.kind==='argument'?{step:0}:Object.fromEntries(model.inputs.map(p=>[p.symbol,p.default]));}
export function evaluateGeneratedModel(model,state){
 if(model.kind==='argument')return {selected:Math.max(0,Math.min(model.claims.length-1,Math.round(state.step||0))),outputs:[],values:{}};
 const values={};for(const c of model.constants)values[c.symbol]=converted(c.value,c.scale);
 for(const p of model.inputs){const v=state[p.symbol];if(!Number.isFinite(v)||v<p.min||v>p.max)throw Error('Control outside reviewed domain: '+p.symbol);values[p.symbol]=converted(v,p.displayScale);}
 for(const e of model.equations)values[e.lhs.symbol]=evaluateExpression(e.rhs,values);
 return {values,outputs:model.outputs.map(o=>({...o,value:finite(values[o.symbol]/o.scale)}))};
}

export function expressionText(n){if(n.op==='var')return n.symbol;if(n.op==='number')return String(n.value);const a=n.args.map(expressionText);return n.op==='pow'?`(${a[0]})^${n.exponent}`:n.op==='power'?`(${a[0]})^(${a[1]})`:['sin','cos','log'].includes(n.op)?`${n.op}(${a[0]})`:`(${a.join({add:' + ',sub:' − ',mul:' × ',div:' / '}[n.op]||' ? ')})`;}
