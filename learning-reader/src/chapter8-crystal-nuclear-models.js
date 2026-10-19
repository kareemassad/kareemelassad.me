import {primitivesSVG} from './scene-primitives.js';

// Original arithmetic and diagrams, after independent source/reference freezes.
// Reported data and explicitly chosen inputs are kept separate from solvers.
export const crystalConstants=Object.freeze({measuredEV:7.92,joulesPerEV:1.602e-19,formulaUnitsPerMole:6.02e23,joulesPerKcal:4190,spacingAngstrom:2.81,coulombScaleEV:5.12,madelung:1.747});
export function crystalConversionKernel(formulaCount=1){
 if(!Number.isFinite(formulaCount)||formulaCount<=0)throw RangeError('A positive bulk amount in formula units is required.');
 const k=crystalConstants,workEV=k.measuredEV*formulaCount,workJ=workEV*k.joulesPerEV,workForOneMole=k.measuredEV*k.joulesPerEV*k.formulaUnitsPerMole;
 return {formulaCount,ionCount:2*formulaCount,workEV,workJ,moleAmount:formulaCount/k.formulaUnitsPerMole,workForOneMole,kcalForOneMole:workForOneMole/k.joulesPerKcal};
}
export function bulkIonAccountingKernel(magnitudeEV=10,formulaCount=4){
 if(!Number.isFinite(magnitudeEV)||magnitudeEV<=0||!Number.isInteger(formulaCount)||formulaCount<1||formulaCount>12)throw RangeError('Positive supplied one-ion magnitude and integer bulk formula count1..12 required.');
 const oneIonSum=-magnitudeEV,perIon=oneIonSum/2,perFormula=2*perIon,total=perFormula*formulaCount;
 return {formulaCount,ionCount:2*formulaCount,oneIonSum,perIon,perFormula,total,orderedSum:2*total,separationMagnitude:-total};
}
export function adjacentLineKernel(N){
 if(!Number.isInteger(N)||N<0||N>128)throw RangeError('Use0..128 symmetric adjacent-line neighbor pairs.');
 let partial=-1;for(let j=1;j<=N;j++)partial+=2*(j%2?1:-1)/Math.sqrt(1+j*j);
 const next=partial+2*((N+1)%2?1:-1)/Math.sqrt(1+(N+1)**2),bound=2/Math.sqrt(1+(N+1)**2);
 return {N,partial,next,lower:Math.min(partial,next),upper:Math.max(partial,next),tailBound:bound,partialEV:partial*crystalConstants.coulombScaleEV,source3DEnergyEV:-crystalConstants.madelung*crystalConstants.coulombScaleEV};
}
export const mirrorSourceLevels=Object.freeze([
 ...[0,2.14,4.46,5.03,6.76,6.81,7.30,7.99,8.57,8.92,9.19,9.28,9.87,10.26,10.32,10.61].map((excitation,i)=>Object.freeze({id:i===0?'B11-ground':'B11-E'+String(i).padStart(2,'0'),isotope:'B11',excitation,uncertain:false})),
 ...[0,2.00,4.32,4.81,6.35,6.49,6.90,7.50,8.10,8.43,8.66,8.98,9.73,9.92,10.08,10.56,10.89].map((excitation,i)=>Object.freeze({id:i===0?'C11-ground':'C11-E'+String(i).padStart(2,'0'),isotope:'C11',excitation,uncertain:i===11||i===13}))
]);
export function mirrorLevelsKernel(selection=1,mode=0){
 if(!Number.isInteger(selection)||selection<0||selection>=mirrorSourceLevels.length||![0,1].includes(mode))throw RangeError('Select an actual source level and relative(0) or common-reference(1) mode.');
 const levels=mirrorSourceLevels.map(l=>({...l,displayEnergy:l.excitation+(mode===1&&l.isotope==='C11'?1.982:0)})),selected=levels[selection];
 return {selection,mode,selectedId:selected.id,selectedExcitation:selected.excitation,selectedDisplayEnergy:selected.displayEnergy,selectedUncertain:selected.uncertain,groundOffset:mode===1?1.982:0,appliedDisplayOffset:mode===1&&selected.isotope==='C11'?1.982:0,levels};
}
export const nuclearConstants=Object.freeze({couplingMeVFm:1.44,observedGroundMeV:1.982,restContributionMeV:-.784,electricalDifferenceMeV:2.766,massNumber:11,sourceRadiusFm:3.12,sourceEmpiricalRadiusFm:2.7,r0Fm:1.2});
export function distinctProtonKernel(Z,a){
 if(!Number.isInteger(Z)||Z<0||Z>12||!Number.isFinite(a)||a<=0)throw RangeError('Integer proton count0..12 and positive radius required.');
 const pairs=Z*(Z-1)/2,meanInverseDistance=6/(5*a),coupling=nuclearConstants.couplingMeVFm,mutualEnergy=coupling*pairs*meanInverseDistance,continuumEnergy=.6*coupling*Z*Z/a;
 return {Z,radiusFm:a,pairs,meanInverseDistance,mutualEnergy,continuumEnergy,selfCountingDifference:continuumEnergy-mutualEnergy};
}
export function mirrorRadiusKernel(radiusFm=3.12){
 if(!Number.isFinite(radiusFm)||radiusFm<=0)throw RangeError('Positive assumed radius required.');
 const k=nuclearConstants,electricalDifference=k.observedGroundMeV-k.restContributionMeV,inferredRadius=6*k.couplingMeVFm/electricalDifference,empiricalRadius=k.r0Fm*Math.cbrt(k.massNumber);
 return {radiusFm,observedGround:k.observedGroundMeV,restContribution:k.restContributionMeV,electricalDifference,predictedElectricalDifference:6*k.couplingMeVFm/radiusFm,inferredRadius,inferredRadiusCm:inferredRadius*1e-13,empiricalRadius,sourceRadius:k.sourceRadiusFm,sourceEmpiricalRadius:k.sourceEmpiricalRadiusFm};
}
export const chapter8CrystalNuclearDefaults=Object.freeze({'crystal-unit-conversion':Object.freeze({r:1}),'bulk-ion-pair-bookkeeping':Object.freeze({r:10,n:4}),'adjacent-crystal-line':Object.freeze({n:8}),'mirror-source-levels':Object.freeze({r:1,n:0}),'distinct-proton-energy':Object.freeze({r:3.12,n:5}),'mirror-radius-ledger':Object.freeze({r:3.12})});
export const chapter8CrystalNuclearNames=Object.freeze(Object.keys(chapter8CrystalNuclearDefaults));
const control=(key,label,min,max,step,units='')=>({key,label,min,max,step,units});
export function chapter8CrystalNuclearControls(scene){
 if(scene==='crystal-unit-conversion')return [control('r','Bulk accounting amount (NaCl formula units)',1,12,1)];
 if(scene==='bulk-ion-pair-bookkeeping')return [control('r','Supplied magnitude of one-ion interaction sum',2,12,.1,'eV'),control('n','Equivalent bulk formula units counted',1,12,1)];
 if(scene==='adjacent-crystal-line')return [control('n','Symmetric adjacent-line neighbor pairs',0,128,1)];
 if(scene==='mirror-source-levels')return [control('r','Source level annotation (B11, then C11)',0,32,1),control('n','Energy reference: 0 own ground; 1 B11 ground',0,1,1)];
 if(scene==='distinct-proton-energy')return [control('r','Assumed uniform proton-ball radius',2,5,.01,'fm'),control('n','Number of protons Z (counting example)',1,12,1)];
 if(scene==='mirror-radius-ledger')return [control('r','Assumed common radius for Coulomb comparison',2,5,.01,'fm')];
 throw Error('Unknown crystal/nuclear model.');
}
export function chapter8CrystalNuclearModel(scene,values={}){
 const state=Object.fromEntries(chapter8CrystalNuclearControls(scene).map(c=>[c.key,values[c.key]??chapter8CrystalNuclearDefaults[scene][c.key]]));
 for(const c of chapter8CrystalNuclearControls(scene))if(!Number.isFinite(state[c.key])||state[c.key]<c.min||state[c.key]>c.max||c.step===1&&!Number.isInteger(state[c.key]))throw RangeError('Invalid crystal/nuclear control '+c.key);
 const m=scene==='crystal-unit-conversion'?crystalConversionKernel(state.r):scene==='bulk-ion-pair-bookkeeping'?bulkIonAccountingKernel(state.r,state.n):scene==='adjacent-crystal-line'?adjacentLineKernel(state.n):scene==='mirror-source-levels'?mirrorLevelsKernel(state.r,state.n):scene==='distinct-proton-energy'?distinctProtonKernel(state.n,state.r):mirrorRadiusKernel(state.r);
 return {...m,state};
}
export const chapter8CrystalNuclearScope=Object.freeze({
 'crystal-unit-conversion':'Source-reported bulk NaCl separation work7.92eV per two-ion formula unit, nearest-ion spacing2.81angstrom, historical conversion1.602e-19J/eV and6.02e23formula/mol,4190J/kcal. The accounting amount rescales this bulk value; no finite-cluster prediction. Computed763807.968J/mol and182.293071kcal/mol are distinct from source-reported7.64e5J/mol and183kcal/mol. Checkerboard is a plane section of a cubic lattice, not an isolated molecule or inferred ionic radius.',
 'bulk-ion-pair-bookkeeping':'Supplied negative one-ion sum interacting with every other ion, self excluded, for equivalent ions in bulk. Default-10eV is authored, not measured NaCl lattice energy. Shared pairs give half that sum per ion; two ions per formula restore the full sum. Amount control counts bulk formula units, not a finite cluster with equivalent boundary ions. Source nearest-neighbor magnitude5.12eV is separate. Negative binding contribution and positive separation magnitude have different signs.',
 'adjacent-crystal-line':'Finite symmetric partial sum for one adjacent alternating line at distances sqrt(1+j²)a. N includes the nearest opposite ion plus N equal-distance pairs; next partial and alternating-series bound describe the same1D limit. Source1.747 is separately supplied for the full3D crystal, multiplied by source scale5.12eV. No finite line/cube derives1.747. Four nearest parallel lines plus further diagonal/distant lines contribute; no short-range repulsion or vibrational correction in this aid.',
 'mirror-source-levels':'Source-transcribed historical measured B11/C11 excitation levels, including each ground. Reference mode selects separate grounds or a common arbitrary zero at B11 ground with C11 offset1.982MeV. Only C11 excitation8.98 and9.92MeV are source-dashed/uncertain. Selection changes annotation, not measurements; no computed nuclear spectrum, automatic one-to-one matching or modern precision claim. B11/C11 both have30p-n pairs; C14/N14 comparisons separately change48 to49.',
 'distinct-proton-energy':'Authored integer distinct-proton counting under independent approximately uniform positions in a ball of positive radius. Mean inverse pair separation6/(5a) and Z(Z−1)/2 unordered pairs yield U=(3/5)Kqe²Z(Z−1)/a. Comparison Z² includes the unwanted continuum self-counting term. Adopted rounded Kqe²=1.44MeVfm. Radius/count controls are mathematical examples, not a strong-force, configuration, spectrum or measured-nucleus solver; Z1 has no distinct pairs.',
 'mirror-radius-ledger':'Source-era B11/C11 equal-radius and approximately charge-independent nuclear-component hypothesis. Observed C-minus-B ground difference1.982MeV includes rest contribution−0.784MeV, so Coulomb difference2.766MeV. Adopted rounded Kqe²=1.44MeVfm gives inferred3.123644fm; source reports3.12fm. Historical density law1.2A^(1/3)fm atA11 gives2.668776fm; source reports2.7fm and about15percent discrepancy. Assumed-radius control compares predictions; it does not change measured inputs or infer a modern precise radius. Core refinement belongs to the next source unit.'
});
export const chapter8CrystalNuclearEquations={
 'ch8-formula-conversion':{plain:'W1mol = 7.92 × 1.602×10⁻¹⁹ × 6.02×10²³ J; kcal = J/4190',tex:String.raw`W_{1\,\mathrm{mol}}=7.92(1.602\times10^{-19})(6.02\times10^{23})\,\mathrm J,\qquad W_{\mathrm{kcal}}=W_{\mathrm J}/4190`},
 'ch8-shared-ion':{plain:'Uper ion = S/2; Uper formula = 2(S/2) = S; Ubulk = Nformula S',tex:String.raw`U_{\rm ion}=\frac S2,\qquad U_{\rm formula}=2\frac S2=S,\qquad U_{\rm bulk}=N_{\rm formula}S`},
 'ch8-adjacent-partial':{plain:'SN = −1 + 2 Σj=1..N (−1)^(j+1)/√(1+j²)',tex:String.raw`S_N=-1+2\sum_{j=1}^N\frac{(-1)^{j+1}}{\sqrt{1+j^2}}`},
 'ch8-supplied-madelung':{plain:'U3D = −1.747 × 5.12 eV = −8.94464 eV (supplied source coefficient)',tex:String.raw`U_{\rm 3D}=-(1.747)(5.12)\,\mathrm{eV}=-8.94464\,\mathrm{eV}\quad\text{(supplied coefficient)}`},
 'ch8-distinct-pairs':{plain:'Npairs = Z(Z−1)/2; ⟨1/r12⟩ = 6/(5a)',tex:String.raw`N_{\rm pairs}=\frac{Z(Z-1)}2,\qquad\left\langle\frac1{r_{12}}\right\rangle=\frac6{5a}`},
 'ch8-discrete-energy':{plain:'Umutual = (3/5) Kqe² Z(Z−1)/a; Ucontinuum = (3/5) Kqe² Z²/a',tex:String.raw`U_{\rm mutual}=\frac35\frac{Kq_e^2Z(Z-1)}a,\qquad U_{\rm continuum}=\frac35\frac{Kq_e^2Z^2}a`},
 'ch8-rest-ledger':{plain:'1.982 = ΔUCoulomb − 0.784; ΔUCoulomb = 2.766 MeV',tex:String.raw`1.982=\Delta U_{\rm Coulomb}-0.784,\qquad\Delta U_{\rm Coulomb}=2.766\,\mathrm{MeV}`},
 'ch8-radius-inference':{plain:'r = 6 Kqe² / ΔUCoulomb; rdensity = 1.2 × 11^(1/3) fm',tex:String.raw`r=\frac{6Kq_e^2}{\Delta U_{\rm Coulomb}},\qquad r_{\rm density}=1.2\,11^{1/3}\,\mathrm{fm}`}
};
export const chapter8CrystalNuclearEquationSources=Object.freeze(Object.fromEntries(Object.keys(chapter8CrystalNuclearEquations).map(id=>[id,{sourcePages:id.includes('rest')||id.includes('radius')?[108,109]:id.includes('discrete')||id.includes('distinct')?[108]:[105,106],labels:id==='ch8-adjacent-partial'?['8.21']:id==='ch8-discrete-energy'?['8.22','8.23']:id==='ch8-radius-inference'?['8.24','8.25','8.26']:[],kind:id==='ch8-supplied-madelung'?'source-supplied3D coefficient, not derived by finite experiment':'Source relation and explicitly labelled authored arithmetic/input specialization'}])));
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value}),line=(id,A,B,style='normal')=>({id,type:'segment',from:A,to:B,style}),point=(id,at,probe=false)=>({id,type:'point',at,probe}),curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const fmt=x=>Math.abs(x)<1e-12?'0':Number(x.toPrecision(7)).toString();
const ledger=(shapes,rows,y=315)=>rows.forEach((s,i)=>shapes.push(text('ledger-'+i,300,y+27*i,s)));
function checkerboard(shapes){for(let row=0;row<4;row++)for(let col=0;col<6;col++){const x=150+60*col,y=74+60*row;shapes.push({id:'ion-'+row+'-'+col,type:'circle',at:[x,y],radius:17},text('charge-'+row+'-'+col,x,y,(row+col)%2?'Cl−':'Na+'));}shapes.push(line('spacing',[150,254],[210,254]),text('spacing-value',170,285,'a = 2.81 Å, nearest centers'),text('section-kind',420,285,'Plane section; equal lattice pitch'));}
export function chapter8CrystalNuclearDefinition(scene,values={}){
 const m=chapter8CrystalNuclearModel(scene,values),shapes=[],equations=[],metrics=[];let title,height=730;
 if(scene==='crystal-unit-conversion'){
  title='NaCl · SEPARATED IONS AND THE ENERGY DENOMINATOR';checkerboard(shapes);
  ledger(shapes,['Measured: 7.92 eV per NaCl formula unit = two ions','Count '+fmt(m.formulaCount)+' formula units → '+fmt(m.ionCount)+' ions; work '+fmt(m.workEV)+' eV','This bulk amount needs '+m.workJ.toExponential(6)+' J','Computed with printed constants: '+fmt(m.workForOneMole)+' J for one mole','Computed with printed constants: '+fmt(m.kcalForOneMole)+' kcal for one mole','Source reports rounded 7.64 × 10⁵ J/mol and 183 kcal/mol']);
  equations.push({id:'ch8-formula-conversion',x:300,y:523});shapes.push(text('conversion-limit',300,559,'Bulk work rescaling; boundary ions of a finite cluster are different'),text('separated-meaning',300,583,'Free ions: includes vaporization and dissociation; not neutral atoms'));
  metrics.push({label:'Bulk amount: formula units',value:fmt(m.formulaCount)},{label:'Separation work',value:fmt(m.workEV)+' eV'},{label:'Computed J for one mole',value:fmt(m.workForOneMole)});
 }else if(scene==='bulk-ion-pair-bookkeeping'){
  title='SHARED PAIRS · TWO IONS IN ONE FORMULA UNIT';
  shapes.push({id:'ion-A',type:'circle',at:[160,160],radius:55},{id:'ion-B',type:'circle',at:[440,160],radius:55},text('ion-A-label',160,156,'Representative ion A'),text('ion-B-label',440,156,'Representative ion B'),{id:'count-forward',type:'arrow',from:[223,133],to:[375,133],style:'normal',visible:true},{id:'count-backward',type:'arrow',from:[375,188],to:[223,188],style:'sample-field',visible:true},text('shared-pair',300,229,'The same pair appears in both ions’ interaction sums'),text('sum-scope',300,264,'Each representative S includes ALL other ions; self excluded'));
  ledger(shapes,['Supplied one-ion sum S = '+fmt(m.oneIonSum)+' eV (authored input)','Assigned per ion: S/2 = '+fmt(m.perIon)+' eV','Two ions per formula: 2 × (S/2) = '+fmt(m.perFormula)+' eV','Count '+m.formulaCount+' equivalent bulk formula units: U = '+fmt(m.total)+' eV','Ordered sum = '+fmt(m.orderedSum)+' eV; half gives total U','Positive separation magnitude of this contribution = '+fmt(m.separationMagnitude)+' eV']);
  equations.push({id:'ch8-shared-ion',x:300,y:523});shapes.push(text('nearest-scale',300,558,'Source nearest-neighbor magnitude Kqe²/a = 5.12 eV'),text('bookkeeping-limit',300,583,'No finite-cluster or NaCl potential solver; −10 eV default is supplied'));
  metrics.push({label:'Per ion (shared energy)',value:fmt(m.perIon)+' eV'},{label:'Per formula unit',value:fmt(m.perFormula)+' eV'},{label:'Bulk total contribution',value:fmt(m.total)+' eV'});
 }else if(scene==='adjacent-crystal-line'){
  title='ADJACENT LINE · FINITE SUM AND FULL CRYSTAL';
  for(let j=-4;j<=4;j++){const x=300+j*50;shapes.push(point('adjacent-ion-'+j,[x,110]),text('adjacent-sign-'+j,x,93,j%2===0?'−':'+'));}
  shapes.push(point('reference-ion',[300,160]),text('reference-charge',300,204,'Central Na+'),line('nearest-distance',[300,160],[300,110]),line('next-distance',[300,160],[350,110]),line('second-distance',[300,160],[400,110]),text('distance1',280,135,'a'),text('distance2',358,144,'√2 a'),text('distance3',411,167,'√5 a'),text('adjacent-geometry',300,288,'Nearby ions shown; the sum includes N symmetric pairs at √(1+j²)a'));
  ledger(shapes,['Finite symmetric line: N = '+m.N+' pairs, plus nearest opposite ion','S_N = '+fmt(m.partial)+'; next partial = '+fmt(m.next),'Same-line infinite limit lies between '+fmt(m.lower)+' and '+fmt(m.upper),'Alternating remainder ≤ '+fmt(m.tailBound)+' (dimensionless)','Finite adjacent-line contribution = '+fmt(m.partialEV)+' eV'],317);
  equations.push({id:'ch8-adjacent-partial',x:300,y:494},{id:'ch8-supplied-madelung',x:300,y:541});shapes.push(text('three-D-scope',300,579,'Four nearest parallel lines, then diagonal/distant lines: full 3D sum'),text('madelung-exclusion',300,604,'1.747 is source-supplied; the finite line does not derive it'));
  metrics.push({label:'Finite adjacent-line S_N',value:fmt(m.partial)},{label:'Same-line tail bound',value:fmt(m.tailBound)},{label:'Computed product from source 3D coefficient',value:fmt(m.source3DEnergyEV)+' eV; printed ≈ −8.94 eV'});
 }else if(scene==='mirror-source-levels'){
  title='MEASURED MIRROR LEVELS · CHOOSE THE ENERGY ZERO';height=770;
  const Y=e=>454-380*e/13;
  shapes.push(line('energy-axis',[75,74],[75,454],'axis'),text('energy-max',54,74,'13'),text('energy-zero',54,454,'0'),text('axis-unit',75,53,'MeV'),text('B-title',205,53,'B11: 5p + 6n'),text('C-title',430,53,'C11: 6p + 5n'));
  for(const l of m.levels){const x=l.isotope==='B11'?205:430;shapes.push(curve('level-'+l.id,[[x-72,Y(l.displayEnergy)],[x+72,Y(l.displayEnergy)]],l.uncertain?'reference':'blue-curve'));}
  const selected=m.levels[m.selection],sx=selected.isotope==='B11'?205:430;shapes.push(point('selected-level',[sx+80,Y(selected.displayEnergy)]),text('reference-mode',300,484,m.mode===0?'Each isotope ground = 0 (relative excitation)':'B11 ground = 0; C11 ground = 1.982 MeV'),text('level-selection',300,514,selected.id+': excitation '+fmt(selected.excitation)+' MeV; displayed '+fmt(selected.displayEnergy)+' MeV'),text('level-uncertainty',300,541,selected.uncertain?'Selected level is dashed: source experimental information uncertain':'Selected level is solid: source does not flag it as uncertain'),text('uncertain-legend',300,570,'Only C11 excitations 8.98 and 9.92 MeV are dashed'),text('data-limit',300,599,'All 33 source levels shown; controls annotate measured data'),text('pair-comparison',300,628,'B11/C11: 30 p–n pairs each; C14/N14: 48 versus 49'),text('correspondence-limit',300,653,'Similar patterns; no automatic one-to-one level correspondence'));
  metrics.push({label:'Selected measured source level',value:selected.id},{label:'Excitation above own ground',value:fmt(selected.excitation)+' MeV'},{label:'Displayed energy',value:fmt(selected.displayEnergy)+' MeV'});
 }else if(scene==='distinct-proton-energy'){
  title='PROTON PAIRS · EXCLUDE SELF BEFORE AVERAGING';
  shapes.push({id:'proton-ball',type:'circle',at:[140,167],radius:85},text('proton-count',140,146,'Z = '+m.Z+' prescribed protons'),text('ball-radius',140,174,'a = '+fmt(m.radiusFm)+' fm'),text('average-context',140,249,'Uniform independent positions'),text('position-limit',140,278,'No coordinates or strong force solved'));
  const X=z=>330+210*(z-1)/11,Y=e=>252-165*e/65;
  shapes.push(line('graph-x',[330,252],[540,252],'axis'),line('graph-y',[330,87],[330,252],'axis'),text('graph-zero-energy',318,252,'0'),text('graph-max-energy',318,87,'65'),text('energy-axis-label',436,54,'Energy in MeV; assumed radius fixed'),text('mutual-legend',436,74,'Blue: distinct; gold: continuum Z²'),curve('mutual-curve',Array.from({length:12},(_,i)=>[X(i+1),Y(distinctProtonKernel(i+1,m.radiusFm).mutualEnergy)])),curve('continuum-curve',Array.from({length:12},(_,i)=>[X(i+1),Y(distinctProtonKernel(i+1,m.radiusFm).continuumEnergy)]),'gold-curve'),point('energy-selected',[X(m.Z),Y(m.mutualEnergy)]),text('graph-start',330,275,'Z = 1'),text('graph-end',540,275,'12'));
  ledger(shapes,['Distinct unordered pairs = '+m.Z+' × '+(m.Z-1)+' / 2 = '+m.pairs,'Uniform-pair mean 1/r12 = '+fmt(m.meanInverseDistance)+' fm⁻¹','Mutual energy = '+fmt(m.mutualEnergy)+' MeV','Continuum Z² value = '+fmt(m.continuumEnergy)+' MeV','Difference from self counting = '+fmt(m.selfCountingDifference)+' MeV']);
  equations.push({id:'ch8-distinct-pairs',x:300,y:492},{id:'ch8-discrete-energy',x:300,y:540});shapes.push(text('coupling-role',300,581,'Adopted rounded Kqe² = 1.44 MeV·fm; no point self energy'));
  metrics.push({label:'Distinct unordered pairs',value:String(m.pairs)},{label:'Mutual energy (uniform mean)',value:fmt(m.mutualEnergy)+' MeV'},{label:'Continuum comparison',value:fmt(m.continuumEnergy)+' MeV'});
 }else{
  title='MIRROR RADIUS · KEEP THE REST-ENERGY SIGN';
  ledger(shapes,['Measured C11 − B11 ground difference: +1.982 MeV','Neutron → proton + electron rest contribution: −0.784 MeV','Electrical difference: 1.982 − (−0.784) = 2.766 MeV'],87);
  equations.push({id:'ch8-rest-ledger',x:300,y:197},{id:'ch8-radius-inference',x:300,y:249});
  const X=r=>70+220*(r-2)/3,Y=e=>445-110*(e-1.5)/3;
  shapes.push(line('radius-axis',[70,445],[290,445],'axis'),line('energy-axis',[70,335],[70,445],'axis'),curve('radius-prediction',Array.from({length:101},(_,i)=>[X(2+3*i/100),Y(8.64/(2+3*i/100))])),line('electrical-reference',[70,Y(2.766)],[290,Y(2.766)],'construction'),point('radius-selected',[X(m.radiusFm),Y(m.predictedElectricalDifference)]),text('prediction-min',46,445,'1.5'),text('prediction-max',46,335,'4.5'),text('prediction-units',51,315,'MeV'),text('radius-min',70,467,'2 fm'),text('radius-max',290,467,'5 fm'),text('prediction-title',180,311,'ΔUCoulomb = 6Kqe² / assumed r'),text('predicted-value',450,325,'At selected r: '+fmt(m.predictedElectricalDifference)+' MeV'),text('inferred-value',450,358,'Inferred: '+fmt(m.inferredRadius)+' fm'),text('source-inferred',450,389,'Source rounded: 3.12 fm'),text('density-computed',450,420,'Density law: '+fmt(m.empiricalRadius)+' fm'),text('density-source',450,451,'Source rounded: 2.7 fm'));
  shapes.push(text('radius-unit',300,507,'1 fm = 10⁻¹³ cm; adopted Kqe² = 1.44 MeV·fm'),text('rounding-limit',300,538,'Source’s about 15% comparison uses its rounded estimates'),text('assumption-limit',300,570,'Historical uniform/equal-radius hypothesis; core refinement follows'));
  metrics.push({label:'Electrical gap after rest correction',value:'2.766 MeV'},{label:'Computed inferred radius',value:fmt(m.inferredRadius)+' fm'},{label:'Computed historical density law',value:fmt(m.empiricalRadius)+' fm'});
 }
 const c=chapter8CrystalNuclearControls(scene)[0],probeY=height-59,scale=480/(c.max-c.min),origin=60-c.min*scale;
 shapes.push(text('title',300,24,title),line('probe-track',[60,probeY],[540,probeY],'axis'),point('control-probe',[origin+scale*m.state[c.key],probeY],true),text('hint',300,probeY+28,'Drag the marker or use the scoped controls below'));
 return {schemaVersion:1,scene,width:600,height,label:title,sourceScope:chapter8CrystalNuclearScope[scene],shapes,equations,metrics,probe:{id:'control-probe',parameter:c.key,origin,scale,min:c.min,max:c.max},context:chapter8CrystalNuclearScope[scene]};
}
const escape=value=>String(value).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function drawChapter8CrystalNuclear(scene,state){const d=chapter8CrystalNuclearDefinition(scene,state);return {body:primitivesSVG(d.shapes)+d.equations.map(e=>`<text x="${e.x}" y="${e.y}" text-anchor="middle" font-size="11">${escape(chapter8CrystalNuclearEquations[e.id].plain)}</text>`).join(''),metrics:d.metrics,label:d.label,height:d.height};}
export function chapter8CrystalNuclearChecks(scene){const states=[chapter8CrystalNuclearDefaults[scene]];for(const c of chapter8CrystalNuclearControls(scene))for(const v of [c.min,c.max])states.push({...chapter8CrystalNuclearDefaults[scene],[c.key]:v});for(const s of states){const m=chapter8CrystalNuclearModel(scene,s);if(!Object.values(m).filter(v=>typeof v==='number').every(Number.isFinite))throw Error('Nonfinite crystal/nuclear arithmetic.');}return {passed:true,states:states.length,method:'Endpoint arithmetic checks; source/data/independent references and native review remain separate.'};}
