import {primitivesSVG} from './scene-primitives.js';
// Central-ion interaction with symmetric neighbor pairs, not the total energy
// of a finite chain. The logarithmic limit and tail bound are analytic facts.
export function alternatingLineKernel(N){
 if(!Number.isInteger(N)||N<1||N>256)throw RangeError('N must be an integer from1 to256.');
 let sum=0,compensation=0;for(let n=1;n<=N;n++){const term=(n%2?1:-1)/n,y=term-compensation,next=sum+y;compensation=(next-sum)-y;sum=next;}
 const nextPartial=sum+(N%2?-1:1)/(N+1),normalizedEnergy=-2*sum,nextEnergy=-2*nextPartial,limit=-2*Math.log(2),bracket=[Math.min(normalizedEnergy,nextEnergy),Math.max(normalizedEnergy,nextEnergy)];
 const displayTailBound=(Math.ceil(200000000/(N+1))/100000000).toFixed(8),displayBracket=[(Math.floor((bracket[0]-1e-12)*1e8)/1e8).toFixed(8),(Math.ceil((bracket[1]+1e-12)*1e8)/1e8).toFixed(8)];
 return {displayTailBound,displayBracket,N,partialSum:sum,nextPartial,normalizedEnergy,nextEnergy,harmonicLimit:Math.log(2),normalizedLimit:limit,bracket,normalizedTailBound:2/(N+1),normalizedError:normalizedEnergy-limit,sourceRoundedCoefficient:-1.386,sourceRoundedIsExact:false,side:N%2?'below':'above',includedNeighborCharges:2*N,centralCharge:1,totalFiniteChainEnergyComputed:false};
}
export function lineEnergyScale({coulombConstant,chargeC,spacingM}){if(![coulombConstant,chargeC,spacingM].every(Number.isFinite)||coulombConstant<=0||chargeC<=0||spacingM<=0)throw RangeError('Positive finite Coulomb constant, elementary charge and spacing required.');const scale=coulombConstant*chargeC**2/spacingM;if(!Number.isFinite(scale)||scale<=0)throw RangeError('Computed energy scale must remain finite and positive.');return scale;}
export const seriesNames=Object.freeze(['alternating-line-energy']);
export const seriesDefaults=Object.freeze({'alternating-line-energy':Object.freeze({n:16})});
export const seriesControls=scene=>{if(!seriesNames.includes(scene))throw Error('Unknown series model.');return [{key:'n',label:'Symmetric neighbor pairs N',min:1,max:256,step:1,units:'pairs'}];};
export const seriesScope=Object.freeze({'alternating-line-energy':'Central+e interacts with charges q(±n)=(-1)^n e at±na in a vacuum electrostatic alternating line. Positive a and reference at infinite separation. Sum in symmetric distance order. Energies shown divided by Ea=K e²/a; no measured spacing, material law or absolute binding prediction. Partial sum excludes all neighbors beyondN; the limit is separately analytic. Derived remainder bound2/(N+1) is conservative, with a tighter consecutive-partial bracket. No total finite-chain energy or3DNaCl/Madelung result.'});
export function seriesModel(scene,state={}){if(!seriesNames.includes(scene))throw Error('Unknown series model.');const n=state.n??16;return {...alternatingLineKernel(n),state:{n}};}
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const fmt=x=>Number(x.toPrecision(7)).toString();
export function seriesDefinition(scene,state={}){
 const m=seriesModel(scene,state),shapes=[];
 shapes.push(text('title',300,26,'ALTERNATING LINE · CENTRAL-ION INTERACTION'),line('lattice-line',[40,105],[560,105],'reference'));
 for(let i=-4;i<=4;i++){const x=300+55*i,positive=Math.abs(i)%2===0;shapes.push({id:'ion-'+i,type:'circle',at:[x,105],radius:i===0?10:7},text('ion-charge-'+i,x,82,positive?'+e':'−e'),text('ion-position-'+i,x,133,i===0?'0':(i>0?'+':'−')+Math.abs(i)+'a'));if(i)shapes.push(line('included-'+i,[x-15,119],[x+15,119],Math.abs(i)<=m.N?(Math.abs(i)%2?'normal':'sample-field'):'background'));}
 shapes.push(text('lattice-key',300,157,'Nearest 4 pairs drawn · colored marks show included pairs'),text('lattice-scope',300,177,'Sum uses all N pairs · neighbors beyond N omitted · line continues to∞'));
 const X=n=>70+330*Math.log2(n)/8,Y=u=>358-(u+2)*122;
 shapes.push(line('energy-x',[70,358],[400,358],'axis'),line('energy-y',[70,230],[70,358],'axis'),text('energy-title',245,206,'Ucentral / Ea · logarithmic N axis'),text('energy-minus-one',45,Y(-1),'−1'),text('energy-minus-two',45,Y(-2),'−2'));
 for(const n of [1,2,4,8,16,32,64,128,256])shapes.push(text('tick-'+n,X(n),378,String(n)));
 shapes.push({id:'partial-curve',type:'curve',points:Array.from({length:256},(_,i)=>{const a=alternatingLineKernel(i+1);return [X(i+1),Y(a.normalizedEnergy)];}),style:'blue-curve'},line('limit',[70,Y(m.normalizedLimit)],[400,Y(m.normalizedLimit)],'reference'),point('chosen-energy',[X(m.N),Y(m.normalizedEnergy)]),line('consecutive-bracket',[X(m.N),Y(m.bracket[0])],[X(m.N),Y(m.bracket[1])],'sample-field'));
 const values=['N: '+m.N+' symmetric pairs','S_N ≈ '+fmt(m.partialSum),'U_N / Ea ≈ '+fmt(m.normalizedEnergy),'Limit ≈ '+fmt(m.normalizedLimit),'Odd below · even above','Bracket: ['+m.displayBracket[0]+',','              '+m.displayBracket[1]+']','Derived |error| < '+m.displayTailBound,'Source rounded: −1.386'];
 values.forEach((v,i)=>shapes.push(text('readout-'+i,516,220+23*i,v)));
 shapes.push(line('probe-track',[75,432],[525,432],'axis'),point('pair-probe',[75+450*(m.N-1)/255,432],true),text('probe-label',300,454,'Choose N · predict which side of the limit comes next'),text('limit-key',235,397,'Gray: analytic limit · gold: partial-sum bracket'),text('quantity-limit',300,502,'Central interaction with2N neighbors ≠ total(2N+1)-ion chain energy'));
 return {schemaVersion:1,scene,width:600,height:562,label:'Central-ion energy in an infinite alternating line',viewBox:[0,0,600,562],title:'Central-ion energy in an infinite alternating line',sourceScope:seriesScope[scene],shapes,equations:[{id:'alternating-line-series',x:300,y:476}],probe:{id:'pair-probe',parameter:'n',origin:75-450/255,scale:450/255,min:1,max:256},metrics:[{label:'Central energy / Ea',value:fmt(m.normalizedEnergy)},{label:'Infinite limit / Ea',value:fmt(m.normalizedLimit)},{label:'Rigorous normalized tail bound',value:'< '+m.displayTailBound}],context:seriesScope[scene]};
}
export const seriesEquations={'alternating-line-series':{plain:'Ucentral,N / Ea = −2 Σ(n=1..N)(−1)^(n+1)/n → −2 ln2',tex:String.raw`\frac{U_{\mathrm{central},N}}{E_a}=-2\sum_{n=1}^{N}\frac{(-1)^{n+1}}{n}\ \longrightarrow\ -2\ln 2`}};
export function drawSeries(scene,state){const d=seriesDefinition(scene,state);return {body:primitivesSVG(d.shapes)+`<text x="300" y="476" text-anchor="middle">${seriesEquations['alternating-line-series'].plain}</text>`,metrics:d.metrics,label:d.title};}
export function checkSeries(scene){for(const N of [1,2,3,4,10,16,100,256]){const m=seriesModel(scene,{n:N});if(!(m.bracket[0]<=m.normalizedLimit&&m.normalizedLimit<=m.bracket[1])||Math.abs(m.normalizedError)>=m.normalizedTailBound||m.totalFiniteChainEnergyComputed)throw Error('Alternating-line bound/quantity invariant failed.');}return {passed:true,states:8,method:'Analytic alternating-series bracket and bound invariants; independent exact reference cases are tested separately.'};}
