// Source data is declarative. No expressions, document text or review records
// are executed. Compatibility is conditional on separately reviewed facts.
export const SOURCE_CONTRACT_VERSION=2;
export const sourceReviewChecks=['bounds','quantities','equations','assumptions','geometry','objective'];
export const reviewChecksFor=contract=>[...sourceReviewChecks,...(contract?.contractKind==='qualitative-argument'?['claims','relations','contextOnly']:[])];
const units={
 '1':[0,0,0,0,0],rad:[0,0,0,0,0],m:[0,1,0,0,0],'m^2':[0,2,0,0,0],'m^3':[0,3,0,0,0],s:[0,0,1,0,0],A:[0,0,0,1,0],K:[0,0,0,0,1],kg:[1,0,0,0,0],
 'J/eV':[0,0,0,0,0],eV:[1,2,-2,0,0],MeV:[1,2,-2,0,0],fm:[0,1,0,0,0],'1/m':[0,-1,0,0,0],'1/fm':[0,-1,0,0,0],'MeV*fm':[1,3,-2,0,0],
 W:[1,2,-3,0,0],C:[0,0,1,1,0],nC:[0,0,1,1,0],J:[1,2,-2,0,0],N:[1,1,-2,0,0],V:[1,2,-3,-1,0],F:[-1,-2,4,2,0],
 'V/m':[1,1,-3,-1,0],'V*m':[1,3,-3,-1,0],'C/m^2':[0,-2,1,1,0],'C/m^3':[0,-3,1,1,0],'nC/m^3':[0,-3,1,1,0],
 'N*m^2/C^2':[1,3,-4,-2,0],'F/m':[-1,-3,4,2,0],T:[1,0,-2,-1,0],'N/m^2':[1,-1,-2,0,0],
 'C/m':[0,-1,1,1,0],'J/m^3':[1,-1,-2,0,0],'m/s':[0,1,-1,0,0],'W/m^2':[1,0,-3,0,0],'W/m^3':[1,-1,-3,0,0]
};
for(const [prefix,factor]of Object.entries({n:1e-9,u:1e-6,m:1e-3,k:1e3,M:1e6}))for(const base of ['C','J','N','V','F','T','W','s','A']){units[prefix+base]=[...units[base]];}
const prefixScale=name=>({n:1e-9,u:1e-6,m:1e-3,k:1e3,M:1e6})[name[0]];
const stable=x=>Array.isArray(x)?'['+x.map(stable).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}':JSON.stringify(x);
const same=(a,b)=>stable(a)===stable(b),zero=units['1'],add=(a,b)=>a.map((v,i)=>v+b[i]);
export const unitScaleToSI=unit=>parsedUnit(unit).scale;
export function parsedUnit(unit){
 if(Object.hasOwn(units,unit))return {dimensions:[...units[unit]],scale:({'J/eV':1/1.602176634e-19,nC:1e-9,'nC/m^3':1e-9,eV:1.602176634e-19,MeV:1.602176634e-13,fm:1e-15,'1/fm':1e15,'MeV*fm':1.602176634e-28})[unit]??(Object.hasOwn(units,unit.slice(1))?prefixScale(unit):undefined)??1};
 if(typeof unit!=='string'||unit.length>80||! /^(?:1|[A-Za-z]+)(?:\^-?[1-6])?(?:[*/](?:1|[A-Za-z]+)(?:\^-?[1-6])?)*$/.test(unit))throw Error('Unsupported unit: '+unit+'. Declare a reviewed SI-derived product or quotient.');
 let dimensions=[...zero],scale=1,sign=1;
 for(const token of unit.split(/([*/])/)){if(token==='*'){sign=1;continue;}if(token==='/'){sign=-1;continue;}const [name,exponent]=token.split('^'),base=Object.hasOwn(units,name)?units[name]:null;if(!base)throw Error('Unsupported unit base: '+name);const power=(exponent?Number(exponent):1)*sign;dimensions=dimensions.map((v,i)=>v+base[i]*power);scale*=(( {nC:1e-9,eV:1.602176634e-19,MeV:1.602176634e-13,fm:1e-15})[name]??(Object.hasOwn(units,name.slice(1))?prefixScale(name):undefined)??1)**power;}
 if(!Number.isFinite(scale)||scale<=0)throw Error('Unit scale is outside the finite positive conversion domain.');
 return {dimensions,scale};
}
export const unitDimensions=unit=>parsedUnit(unit).dimensions;
const text=(s,label,max=1800)=>{if(typeof s!=='string'||!s.trim()||s.length>max)throw Error('Supply '+label+'.');};
const keys=(o,allowed,label)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).some(k=>!allowed.includes(k)))throw Error('Unexpected '+label+' fields.');};
export function equationDimension(node,quantities,{depth=0,budget={n:0}}={}){
 if(depth>24||++budget.n>256)throw Error('Equation exceeds the bounded expression size.');
 keys(node,['op','symbol','value','args','exponent','index','lower','domain'],'equation');
 keys(node,node.op==='var'?['op','symbol']:node.op==='number'?['op','value']:node.op==='pow'?['op','args','exponent']:node.op==='finite-sum'?['op','args','index','lower']:node.op==='integral'?['op','args','domain']:['op','args'],'equation operation');
 if(node.op==='var'){if(!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(node.symbol)||!quantities.has(node.symbol))throw Error('Undeclared equation quantity: '+node.symbol);return unitDimensions(quantities.get(node.symbol).unit);}
 if(node.op==='number'){if(!Number.isFinite(node.value))throw Error('Finite dimensionless equation numbers only.');return [...zero];}
 const args=node.args;if(!Array.isArray(args)||args.length>16)throw Error('Equation operands are required.');
 if(node.op==='finite-sum'){if(args.length!==2||node.lower!==1||! /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(node.index)||quantities.has(node.index))throw Error('Use an explicitly bounded1..N sum with a fresh index.');const inner=new Map(quantities);inner.set(node.index,{unit:'1',role:'summation-index'});const term=equationDimension(args[0],inner,{depth:depth+1,budget}),upper=equationDimension(args[1],quantities,{depth:depth+1,budget});if(!same(upper,zero))throw Error('A finite sum upper index must be dimensionless.');return term;}
 const ds=args.map(a=>equationDimension(a,quantities,{depth:depth+1,budget}));
 if(node.op==='integral'){if(args.length!==2||!['all-space','finite-volume','boundary-surface'].includes(node.domain)||args[1].op!=='var')throw Error('A symbolic integral needs a declared measure and reviewed domain.');if(!same(ds[1],units[node.domain==='boundary-surface'?'m^2':'m^3']))throw Error('Integral measure dimensions must match its reviewed volume or surface domain.');return add(ds[0],ds[1]);}
 if(['add','sub'].includes(node.op)){if(ds.length<2||ds.some(d=>!same(d,ds[0])))throw Error('Cannot add or subtract quantities with different dimensions.');return ds[0];}
 if(node.op==='mul'){if(ds.length<2)throw Error('Multiplication needs operands.');return ds.reduce(add,[...zero]);}
 if(node.op==='div'){if(ds.length!==2)throw Error('Division needs two operands.');return ds[0].map((v,i)=>v-ds[1][i]);}
 if(node.op==='pow'){if(ds.length!==1||!Number.isInteger(node.exponent)||Math.abs(node.exponent)>8)throw Error('Use a bounded integer equation power.');return ds[0].map(v=>v*node.exponent);}
 if(node.op==='power'){if(ds.length!==2||ds.some(d=>!same(d,zero)))throw Error('A variable exponent requires a dimensionless base and exponent.');return [...zero];}
 if(['sin','cos','log'].includes(node.op)){if(ds.length!==1||!same(ds[0],zero))throw Error(node.op+' requires a dimensionless argument.');return [...zero];}
 throw Error('Unsupported declarative equation operation: '+node.op);
}
// Sort only commutative products/sums. No algebraic or physical equivalence is
// inferred beyond this narrow normalization; other forms need author review.
export function normalizedEquation(node,quantities){
 if(node.op==='var')return {role:quantities.get(node.symbol).role};
 if(node.op==='number')return {number:node.value};
 if(node.op==='finite-sum'){const inner=new Map(quantities);inner.set(node.index,{unit:'1',role:'summation-index'});return {op:node.op,args:[normalizedEquation(node.args[0],inner),normalizedEquation(node.args[1],quantities)],lower:node.lower};}
 let args=node.args.map(a=>normalizedEquation(a,quantities));if(['mul','add'].includes(node.op))args=args.sort((a,b)=>stable(a).localeCompare(stable(b)));
 return {op:node.op,args,...(node.op==='pow'?{exponent:node.exponent}:{}),...(node.op==='integral'?{domain:node.domain}:{})};
}
export function validateSourceContract(contract,extraction){
 const v2=contract?.schemaVersion===2,qualitative=v2&&contract.contractKind==='qualitative-argument';
 keys(contract,['schemaVersion','id','author','source','objective','quantities','assumptions','equations','geometry','limits',...(v2?['contractKind','claims','relations']:[])],'source contract');
 if(![1,2].includes(contract.schemaVersion)||!/^[-a-z0-9]{1,60}$/.test(contract.id)||v2&&!['quantitative','qualitative-argument'].includes(contract.contractKind))throw Error('Use a version1 quantitative or discriminated version2 source contract with a unique id.');text(contract.author,'the source-contract author',120);
 const s=contract.source;keys(s,['sha256','startItemId','endItemId','evidenceItemIds','region'],'source selection');
 if(s.sha256!==extraction.source.sha256)throw Error('Contract belongs to another source PDF.');
 const items=new Map(extraction.pages.flatMap(p=>p.items.map(i=>[i.id,i]))),start=items.get(s.startItemId),end=items.get(s.endItemId),position=i=>i.page+i.y;
 if(!start||!end||position(start)>=position(end))throw Error('Choose real ordered start and exclusive-end anchors.');
 for(let p=start.page;p<=end.page;p++)if(!extraction.selection.includes(p))throw Error('A contract cannot bridge uninspected pages.');
 keys(s.region,['minX','maxX','maxY','kind'],'source region');const r=s.region;
 if(!['main','sidebar'].includes(r.kind)||![r.minX,r.maxX,r.maxY].every(Number.isFinite)||r.minX<0||r.maxX>1||r.minX>=r.maxX||r.maxY<=0||r.maxY>1)throw Error('Declare one bounded main or sidebar region.');
 const inRegion=i=>[i.x,i.y,i.width,i.height].every(Number.isFinite)&&i.width>=0&&i.height>=0&&i.x>=r.minX&&i.x+i.width<=r.maxX+1e-10&&i.y+i.height<=r.maxY+1e-10;
 const cite=(ids,label)=>{if(!Array.isArray(ids)||ids.length<1||ids.length>24||new Set(ids).size!==ids.length||ids.some(id=>{const i=items.get(id);return !i||position(i)<position(start)||position(i)>=position(end)||!inRegion(i)||(i.page===end.page&&i.y+i.height>end.y+1e-10);}))throw Error(label+' must cite unique in-bound items in the declared source region.');};
 if(!inRegion(start)||!inRegion(end))throw Error('Source anchors must lie in the declared region.');cite(s.evidenceItemIds,'Source evidence');if(s.evidenceItemIds.length<2)throw Error('Cite at least two source items.');
 const o=contract.objective;keys(o,['question','task','coverageKind','parentTask','omittedReasoning','requiredFeatures','evidenceItemIds'],'learning objective');text(o.question,'the learning question',500);text(o.task,'an operational learning task',100);text(o.parentTask,'the broader source task',500);
 if(!['bounded-helper','bounded-specialization'].includes(o.coverageKind))throw Error('This workflow certifies bounded aids only. Full-unit or chapter completion requires a separate coverage audit.');
 text(o.omittedReasoning,'reasoning outside this aid',1000);cite(o.evidenceItemIds,'Learning objective');
 if(!Array.isArray(o.requiredFeatures)||!o.requiredFeatures.length||o.requiredFeatures.some(x=>typeof x!=='string'||!x.trim()))throw Error('List the reasoning features this aid must supply.');
 keys(contract.geometry,['kind','description','evidenceItemIds'],'geometry');text(contract.geometry.kind,'the physical geometry',100);text(contract.geometry.description,'geometry and its source relationship');cite(contract.geometry.evidenceItemIds,'Geometry');
 if(!Array.isArray(contract.quantities)||(!qualitative&&!contract.quantities.length)||contract.quantities.length>32)throw Error('Declare the quantities and units before selecting a model.');
 const quantities=new Map(),roles=new Set();
 for(const q of contract.quantities){keys(q,['symbol','role','unit','description','origin','evidenceItemIds','justification',...(qualitative?['purpose']:[])],'quantity');if(!/^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(q.symbol)||quantities.has(q.symbol)||roles.has(q.role))throw Error('Quantity symbols and physical roles must be unique.');text(q.role,'a physical quantity role',100);text(q.description,'what '+q.symbol+' means');unitDimensions(q.unit);cite(q.evidenceItemIds,'Quantity '+q.symbol);if(!['source','authored-specialization'].includes(q.origin))throw Error('Declare whether each quantity is from the source or an authored specialization.');if(q.origin==='authored-specialization')text(q.justification,'the source relationship of the authored quantity');if(qualitative&&q.purpose!=='source-context-only')throw Error('Qualitative quantities are noncomputed source context only.');quantities.set(q.symbol,q);roles.add(q.role);}
 if(!Array.isArray(contract.assumptions)||!contract.assumptions.length||contract.assumptions.length>32)throw Error('Declare model assumptions; absence is never treated as agreement.');
 const assumptions=new Set();for(const a of contract.assumptions){keys(a,['id','statement','origin','evidenceItemIds','justification'],'assumption');text(a.id,'an assumption id',100);text(a.statement,'the assumption statement');if(assumptions.has(a.id)||!['source','authored-specialization'].includes(a.origin))throw Error('Unique assumptions with an explicit origin are required.');cite(a.evidenceItemIds,'Assumption '+a.id);if(a.origin==='authored-specialization')text(a.justification,'the justification for a specialization');assumptions.add(a.id);}
 if(!Array.isArray(contract.equations)||(!qualitative&&!contract.equations.length)||contract.equations.length>16)throw Error('Author source equations from the rendered page before suggesting a quantitative visualization.');
 const equations=new Map();for(const e of contract.equations){keys(e,['id','label','meaning','lhs','rhs','evidenceItemIds',...(qualitative?['purpose']:[])],'source equation');text(e.id,'an equation id',100);text(e.label,'the source equation label',100);text(e.meaning,'the equation meaning');if(equations.has(e.id))throw Error('Equation ids must be unique.');cite(e.evidenceItemIds,'Equation '+e.id);const left=equationDimension(e.lhs,quantities),right=equationDimension(e.rhs,quantities);if(!same(left,right))throw Error('Equation '+e.id+' has inconsistent dimensions.');if(qualitative&&e.purpose!=='source-context-only')throw Error('Qualitative equations are noncomputed source context only.');equations.set(e.id,{lhs:normalizedEquation(e.lhs,quantities),rhs:normalizedEquation(e.rhs,quantities)});}
 const claims=new Map(),relations=new Map();
 if(qualitative){
  if(!Array.isArray(contract.claims)||contract.claims.length<2||contract.claims.length>16||!Array.isArray(contract.relations)||!contract.relations.length||contract.relations.length>24)throw Error('Qualitative arguments require actual source-cited claims and typed relations.');
  for(const c of contract.claims){keys(c,['id','statement','status','evidenceItemIds'],'argument claim');text(c.id,'a claim id',100);text(c.statement,'the source claim');if(claims.has(c.id)||!['established','conditional','motivation','limitation','source-era-limitation'].includes(c.status))throw Error('Declare unique claims and explicit epistemic status.');cite(c.evidenceItemIds,'Claim '+c.id);claims.set(c.id,c);}
  for(const r of contract.relations){keys(r,['id','from','to','kind','evidenceItemIds'],'argument relation');text(r.id,'a relation id',100);if(relations.has(r.id)||!claims.has(r.from)||!claims.has(r.to)||r.from===r.to||!['support','qualifies','alternative'].includes(r.kind))throw Error('Argument relations must connect distinct declared claims with a reviewed relation.');cite(r.evidenceItemIds,'Relation '+r.id);relations.set(r.id,r);}
 }else if(v2&&(contract.claims?.length||contract.relations?.length))throw Error('Quantitative contracts cannot silently carry argument claims.');
 if(!Array.isArray(contract.limits)||!contract.limits.length||contract.limits.some(s=>typeof s!=='string'||!s.trim()))throw Error('State source and model limits.');
 return {contract,quantities,assumptions,equations,claims,relations,contractKind:qualitative?'qualitative-argument':'quantitative',sourceBounds:{start,end},sourceEvidence:s.evidenceItemIds};
}
export function compareCapability(checked,capability){
 const c=checked.contract,reasons=[];
 if(checked.contractKind!==(capability.contractKind||'quantitative'))reasons.push('Contract and model reasoning kinds differ.');
 if(checked.contractKind==='qualitative-argument'){if(checked.claims.size!==(capability.claims||[]).length||checked.relations.size!==(capability.relations||[]).length||checked.quantities.size!==Object.keys(capability.quantities).length||checked.equations.size!==capability.equations.length)reasons.push('Argument diagram must cover the exact declared claims, relations and noncomputed context.');for(const claim of capability.claims||[]){const actual=checked.claims.get(claim.id);if(!actual||actual.status!==claim.status)reasons.push('Argument claim/status missing: '+claim.id+'.');}for(const relation of capability.relations||[]){const actual=checked.relations.get(relation.id);if(!actual||['from','to','kind'].some(k=>actual[k]!==relation[k]))reasons.push('Argument relation missing or differs: '+relation.id+'.');}}
 if(c.objective.task!==capability.task)reasons.push('Learning task differs: model supplies '+capability.task+'.');
 if(c.geometry.kind!==capability.geometry)reasons.push('Geometry differs: model requires '+capability.geometry+'.');
 for(const feature of c.objective.requiredFeatures)if(!capability.features.includes(feature))reasons.push('Model does not supply required reasoning: '+feature+'.');
 for(const assumption of capability.assumptions)if(!checked.assumptions.has(assumption))reasons.push('Required assumption is not established: '+assumption+'.');
 for(const [role,unit] of Object.entries(capability.quantities)){const q=[...checked.quantities.values()].find(q=>q.role===role);if(!q)reasons.push('Missing quantity role: '+role+'.');else if(!same(unitDimensions(q.unit),unitDimensions(unit)))reasons.push('Quantity dimensions differ for '+role+'.');}
 for(const equation of capability.equations){const actual=checked.equations.get(equation.id);if(!actual||!same(actual,{lhs:equation.lhs,rhs:equation.rhs}))reasons.push('Source equation does not establish the model relation: '+equation.id+'.');}
 return {template:capability.template,compatible:reasons.length===0,reasons,status:reasons.length?'unsupported-for-this-contract':'candidate-needs-model-and-native-review',automaticAcceptance:false};
}
