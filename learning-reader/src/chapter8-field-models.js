import {primitivesSVG} from './scene-primitives.js';

// Implemented from independently frozen source/math contracts before this file.
// Numerical scenes are original uniform-volume-sphere / positive-cutoff examples.
// Argument maps expose categorical source claims; selection supplies no physics.
const finiteNonnegative=(value,name)=>{if(!Number.isFinite(value)||value<0)throw RangeError(name+' must be finite and nonnegative.');return value;};
export function regularSphereKernel(s){
 finiteNonnegative(s,'R/a');
 const inside=s<=1,inverse=inside?0:1/s;
 const field=inside?s:inverse*inverse,potential=inside?(3-s*s)/2:inverse;
 const rhoEnergy=inside?s**3*(3/4-3*s*s/20):3/5;
 const fieldEnergy=inside?s**5/10:3/5-inverse/2;
 const boundaryTerm=inside?-(s**3)*(3-s*s)/4:-inverse/2;
 const energyDensity=field*field/(8*Math.PI);
 if(![field,potential,rhoEnergy,fieldEnergy,boundaryTerm,energyDensity].every(Number.isFinite)||(s>1&&energyDensity===0))throw RangeError('Radius exceeds finite reference arithmetic.');
 return {s,rhoEnergy,fieldEnergy,boundaryTerm,totalEnergy:3/5,field,potential,density:inside?1:0,energyDensity};
}
export function pointCutoffKernel(cutoff,outerRadius=4){
 if(!Number.isFinite(cutoff)||cutoff<=0||!Number.isFinite(outerRadius)||outerRadius<cutoff)throw RangeError('Positive cutoff and finite R/a ≥ cutoff required.');
 const cutoffToInfinity=.5/cutoff,outerTail=.5/outerRadius,annulusEnergy=cutoffToInfinity-outerTail;
 if(![cutoffToInfinity,outerTail,annulusEnergy].every(Number.isFinite)||outerTail<=0)throw RangeError('Cutoff arithmetic must remain finite and positive.');
 const primitiveAtInner=-cutoffToInfinity,primitiveAtOuter=-outerTail;
 return {cutoff,outerRadius,annulusEnergy,outerTail,cutoffToInfinity,primitiveAtInner,primitiveAtOuter};
}

export const localityClaims=Object.freeze([
 {id:'global-total',title:'Global total',status:'established',lines:['Conserving a total does not prescribe a spatial route.','It alone could allow loss here and gain far away.']},
 {id:'local-balance',title:'Local balance',status:'conditional',lines:['A volume change must be accounted for at its boundary.','This is stronger; the source concludes nature conserves locally.']},
 {id:'transport-accounting',title:'Transfer accounting',status:'conditional',lines:['Local accounting requires transfer into or out of a volume.','These paragraphs do not calculate its route, speed or rate.']},
 {id:'gravity-motivation',title:'Gravity motivation',status:'motivation',lines:['The source uses mass–energy equivalence to motivate location.','This sketch supplies no gravitational field calculation.']},
 {id:'electrostatics-nonunique',title:'Static limitation',status:'limitation',lines:['Electrostatics alone does not settle a unique energy location.','Fuller Maxwell dynamics gives more information, still not unique.']}
]);
export const localityRelations=Object.freeze([
 {id:'global-to-local',from:'global-total',to:'local-balance',kind:'qualifies'},
 {id:'local-to-transfer',from:'local-balance',to:'transport-accounting',kind:'support'},
 {id:'gravity-to-location',from:'gravity-motivation',to:'local-balance',kind:'support'},
 {id:'static-caveat',from:'electrostatics-nonunique',to:'local-balance',kind:'qualifies'}
]);
export const classicalClaims=Object.freeze([
 {id:'classical-tension',title:'Classical tension',status:'established',lines:['Ideal point charges plus classical field energy give divergence.','A finite positive excision cutoff does not resolve that tension.']},
 {id:'extended-charge',title:'Finite extent?',status:'conditional',lines:['The source considers small extended charge distributions.','No measured elementary-charge radius or shape is supplied.']},
 {id:'small-scale-laws',title:'Small-distance laws?',status:'conditional',lines:['It also questions short-distance electricity or local accounting.','No replacement law or quantitative correction is given.']},
 {id:'historical-unresolved',title:'Source-era caveat',status:'source-era-limitation',lines:['The unresolved statement belongs to this historical discussion.','It is not a present-day status claim or a proposed resolution.']}
]);
export const classicalRelations=Object.freeze([
 {id:'charge-alternative',from:'classical-tension',to:'extended-charge',kind:'alternative'},
 {id:'law-alternative',from:'classical-tension',to:'small-scale-laws',kind:'alternative'},
 {id:'unresolved-charge',from:'historical-unresolved',to:'extended-charge',kind:'qualifies'},
 {id:'unresolved-laws',from:'historical-unresolved',to:'small-scale-laws',kind:'qualifies'}
]);
export function fieldReasoningKernel(scene,n){
 const local=scene==='energy-locality-map';
 if(!local&&scene!=='classical-charge-limits-map')throw Error('Unknown field-energy argument map.');
 const claims=local?localityClaims:classicalClaims,relations=local?localityRelations:classicalRelations;
 if(!Number.isInteger(n)||n<0||n>=claims.length)throw RangeError('Argument focus must be a valid integer index.');
 return {selectedClaimId:claims[n].id,visibleClaimIds:claims.map(c=>c.id),visibleRelationIds:relations.map(r=>r.id),sourceStatus:claims[n].status};
}
export const chapter8FieldDefaults=Object.freeze({
 'rho-phi-energy':Object.freeze({r:1}),'energy-locality-map':Object.freeze({n:0}),
 'radial-vacuum-energy':Object.freeze({r:2}),'finite-boundary-energy':Object.freeze({r:2}),
 'point-cutoff-energy':Object.freeze({r:.25}),'classical-charge-limits-map':Object.freeze({n:0})
});
export const chapter8FieldNames=Object.freeze(Object.keys(chapter8FieldDefaults));
export function chapter8FieldControls(scene){
 if(!chapter8FieldNames.includes(scene))throw Error('Unknown Chapter8 field model.');
 if(scene==='energy-locality-map'||scene==='classical-charge-limits-map')return [{key:'n',label:'Argument focus',min:0,max:scene==='energy-locality-map'?4:3,step:1,units:''}];
 if(scene==='point-cutoff-energy')return [{key:'r',label:'Positive inner cutoff b / reference a',min:.025,max:1,step:.025,units:''}];
 return [{key:'r',label:'Selected volume radius R / charge radius a',min:0,max:8,step:.05,units:''}];
}
export function chapter8FieldModel(scene,values={}){
 const controls=chapter8FieldControls(scene),state=Object.fromEntries(controls.map(c=>[c.key,values[c.key]??chapter8FieldDefaults[scene][c.key]]));
 for(const c of controls)if(!Number.isFinite(state[c.key])||state[c.key]<c.min||state[c.key]>c.max||(c.step===1&&!Number.isInteger(state[c.key])))throw RangeError('Invalid Chapter8 field parameter: '+c.key);
 const m=scene.endsWith('-map')?fieldReasoningKernel(scene,state.n):scene==='point-cutoff-energy'?pointCutoffKernel(state.r,4):regularSphereKernel(state.r);
 return {...m,...(scene==='finite-boundary-energy'?{omittedFieldEnergy:m.totalEnergy-m.fieldEnergy}:{}),state};
}
export function chapter8FieldFrame(scene){return scene.endsWith('-map')?650:scene==='finite-boundary-energy'?628:scene==='point-cutoff-energy'?676:562;}
const sphereScope='Authored vacuum uniform volume charge sphere, fixed Q>0 and radius a>0, with phi(infinity)=0. R/a selects an integration volume, not a changing source or time. For R<a only part of the charge is inside; for R≥a rho-phi energy is3Ea/5. Ea=KQ²/a; Eref=KQ/a²; phiref=KQ/a. Outputs are normalized, not joules; no charge control or zero-charge normalization. The solid is not a conductor. No arbitrary charge solver, motion, radiation, gravity or point singularity.';
export const chapter8FieldScope=Object.freeze({
 'rho-phi-energy':sphereScope+' Pair accounting counts both directions before the factor1/2; the point mutual example excludes each charge’s own potential.',
 'radial-vacuum-energy':sphereScope+' Original nonuniform example of Eq8.30. Local density annotation is derived context; it does not enlarge the earlier Eq8.30 source interval into Eq8.31.',
 'finite-boundary-energy':sphereScope+' Signed B_R=(epsilon0/2)∮phi*normal-gradient(phi)dA. U_rhophi(V_R)=U_field(V_R)−B_R. The separately evaluated omitted FIELD energy is U_field(all space)−U_field(V_R), valid even inside the charged ball. It equals −B_R only R≥a; inside, remaining rho-phi energy also contributes. The finite term is retained; no boundary is silently moved to infinity.',
 'point-cutoff-energy':'Classical fixed q>0 point field outside positive b, with R=4a fixed and b/a from.025 to1. a>0 is a reference length, not an assumed particle size. Energy divided by positive Ea=Kq²/a; no charge control or zero-charge normalization. A(r)=−Kq²/(2r) is the radial integral primitive, not a local energy or force. Its negative endpoint values give positive A(R)−A(b). Additive constant is chosen zero, with A(infinity)→0. Annulus energy plus analytic outer tail equals cutoff-to-infinity energy. No r=0 numeric state, finite total point self energy, uniform-ball interior or microscopic cure.',
 'energy-locality-map':'Original categorical reasoning map for the source argument: global total, stronger local balance, boundary-transfer accounting, gravity motivation and electrostatics/Maxwell non-uniqueness. All claims and declared relations stay visible; n selects focus only. Conditional labels describe logical premises, not denial of the source conclusion that nature conserves locally. No numerical flow, speed, field transport law or gravity calculation.',
 'classical-charge-limits-map':'Original categorical map of the source’s classical point-charge tension, finite-extent and short-distance-law/local-accounting alternatives, and historical unresolved caveat. All claims/relations remain visible. No present-day status assessment, measured elementary radius, replacement force law, quantum law or resolution probability.'
});
export const chapter8FieldEquations={
 'ch8-rho-phi':{plain:'U = ½ ∫∫ ρ(1)ρ(2)/(4πε0 r12) dV1dV2 = ½ ∫ ρφ dV',tex:String.raw`U=\frac12\iint\frac{\rho(1)\rho(2)}{4\pi\epsilon_0r_{12}}\,dV_1dV_2=\frac12\int\rho\phi\,dV`},
 'ch8-mutual-pair':{plain:'Upair = ½[q1 φother(1) + q2 φother(2)]',tex:String.raw`U_{\rm pair}=\frac12\bigl[q_1\phi_{\rm other}(1)+q_2\phi_{\rm other}(2)\bigr]`},
 'ch8-radial-field':{plain:'Ufield(VR) = ε0/2 ∫VR E² dV ; Ufield(all space) = 3Ea/5',tex:String.raw`U_E(V_R)=\frac{\epsilon_0}{2}\int_{V_R}E^2\,dV,\qquad U_E(\mathbb R^3)=\frac35E_a`},
 'ch8-finite-boundary':{plain:'Uρφ(VR) = Ufield(VR) − BR ; BR = ε0/2 ∮ φ ∂nφ da',tex:String.raw`U_{\rho\phi}(V_R)=U_E(V_R)-B_R,\qquad B_R=\frac{\epsilon_0}{2}\oint_{\partial V_R}\phi\,\partial_n\phi\,da`},
 'ch8-point-cutoff':{plain:'Ub,R = Kq²/2 (1/b − 1/R) ; UR,∞ = Kq²/(2R)',tex:String.raw`U_{b,R}=\frac{Kq^2}{2}\!\left(\frac1b-\frac1R\right),\qquad U_{R,\infty}=\frac{Kq^2}{2R}`},
 'ch8-local-gravity':{plain:'E = mc² (source motivation only)',tex:String.raw`E=mc^2\quad\text{(source motivation)}`},
 'ch8-field-outside':{plain:'Ufield,out(R) = ε0/2 ∫r>R E² dV = Ufield(all space) − Ufield(VR)',tex:String.raw`U_{E,\mathrm{out}}(R)=\frac{\epsilon_0}{2}\int_{r>R}E^2\,dV=U_E(\mathbb R^3)-U_E(V_R)`},
 'ch8-point-primitive':{plain:"A(r) = −Kq²/(2r) ; A′(r) = Kq²/(2r²), r>0",tex:String.raw`A(r)=-\frac{Kq^2}{2r},\qquad A'(r)=\frac{Kq^2}{2r^2},\quad r>0`},
 'ch8-point-evaluation':{plain:'Ub,R = [A(r)]bR = A(R) − A(b)',tex:String.raw`U_{b,R}=\bigl[A(r)\bigr]_b^R=A(R)-A(b)`}
};
export const chapter8FieldEquationSources=Object.freeze({
 'ch8-rho-phi':{sourcePages:[109,110],labels:['8.27','8.28'],kind:'source equations; displayed integrals are over the complete distribution'},
 'ch8-mutual-pair':{sourcePages:[110],labels:['8.29'],kind:'source mutual-energy example; self potentials excluded'},
 'ch8-radial-field':{sourcePages:[111],labels:['8.30'],kind:'source field integral plus explicitly authored uniform-volume-sphere specialization3Ea/5'},
 'ch8-finite-boundary':{sourcePages:[111,112],labels:['8.32','8.33','8.34','8.35'],kind:'finite-volume identity derived with signed boundary retained'},
 'ch8-point-cutoff':{sourcePages:[112],labels:['8.36'],kind:'authored strictly positive finite cutoff and analytic outer-tail decomposition'},
 'ch8-local-gravity':{sourcePages:[111],labels:[],kind:'source motivation; no computed gravitational field'},
 'ch8-field-outside':{sourcePages:[111,112],labels:['8.30','8.35'],kind:'authored regular-ball partition of the all-space source field integral; distinct from the signed boundary correction'},
 'ch8-point-primitive':{sourcePages:[112],labels:['8.36'],kind:'source negative radial antiderivative plus independently checked derivative on strictly positive radii'},
 'ch8-point-evaluation':{sourcePages:[112],labels:['8.36'],kind:'source upper-minus-lower evaluation specialized to a positive finite cutoff and finite outer radius'}
});
const text=(id,x,y,value)=>({id,type:'text',at:[x,y],text:value});
const line=(id,from,to,style='construction')=>({id,type:'segment',from,to,style});
const arrow=(id,from,to,style='normal',visible=true)=>({id,type:'arrow',from,to,style,visible});
const circle=(id,at,radius)=>({id,type:'circle',at,radius});
const point=(id,at,probe=false)=>({id,type:'point',at,probe});
const curve=(id,points,style='blue-curve')=>({id,type:'curve',points,style});
const fmt=x=>Object.is(x,-0)||x===0?'0':Number(x.toPrecision(6)).toString();
const box=(shapes,id,x,y,w,h)=>{for(const [i,A,B]of [[0,[x,y],[x+w,y]],[1,[x+w,y],[x+w,y+h]],[2,[x+w,y+h],[x,y+h]],[3,[x,y+h],[x,y]]])shapes.push(line(id+'-'+i,A,B,'background'));};
function sphereSketch(shapes,s){
 const center=[140,155],scale=80/Math.max(1,s);
 shapes.push(circle('charge-boundary',center,scale),circle('selected-volume',center,s*scale),point('charge-center',center));
 for(let i=0;i<8;i++){const angle=i*Math.PI/4,x=center[0]+scale*.48*Math.cos(angle),y=center[1]+scale*.48*Math.sin(angle);shapes.push(text('charge-mark-'+i,x,y,scale>=24?'+':''));}
 shapes.push(text('aggregate-charge',140,155,scale<24?'+':''));
 for(let i=0;i<8;i++){const angle=(i+.5)*Math.PI/4,c=Math.cos(angle),t=Math.sin(angle);shapes.push(arrow('radial-field-'+i,[140+scale*1.18*c,155+scale*1.18*t],[140+(scale*1.18+13)*c,155+(scale*1.18+13)*t]));}
 shapes.push(line('selected-radius',[140,155],[140+s*scale,155],'sample-field'),text('charge-caption',140,35,'Uniform volume charge · Q > 0'),text('sphere-key',140,252,'a: source edge · R: selected volume'),text('sphere-zoom',140,274,'Cross-section rescales; arrows schematic'));
}
function graph(shapes,{maximum,first,second,firstLabel,secondLabel}){
 const X=x=>320+240*x/8,Y=v=>232-150*v/maximum;
 shapes.push(line('graph-x',[320,232],[560,232],'axis'),line('graph-y',[320,82],[320,232],'axis'),text('graph-zero',305,232,'0'),text('graph-max',303,82,fmt(maximum)));
 for(const x of [0,1,4,8])shapes.push(text('r-tick-'+x,X(x),252,String(x)));
 shapes.push(text('graph-radius',440,275,'Selected radius R / a'),curve('graph-first',Array.from({length:161},(_,i)=>[X(i/20),Y(first(i/20))]),'blue-curve'),curve('graph-second',Array.from({length:161},(_,i)=>[X(i/20),Y(second(i/20))]),'gold-curve'),text('graph-first-label',440,48,firstLabel),text('graph-second-label',440,65,secondLabel));
 return {X,Y};
}
function energyBar(shapes,id,y,label,value,color='normal'){
 shapes.push(text(id+'-label',80,y,label),line(id+'-bar',[300,y],[300+166*value,y],color),text(id+'-value',535,y,fmt(value)));
}
function numericDefinition(scene,m){
 const shapes=[],equations=[],s=m.state.r;let title;
 if(scene==='point-cutoff-energy'){
  title='POINT FIELD · POSITIVE INNER CUTOFF';
  shapes.push(circle('outer-boundary',[140,155],80),circle('inner-cutoff',[140,155],20*s),point('point-charge',[140,155]),text('charge-plus',140,134,'+q (q > 0)'));
  for(let i=0;i<8;i++){const angle=(i+.5)*Math.PI/4,c=Math.cos(angle),t=Math.sin(angle);shapes.push(arrow('point-field-'+i,[140+53*c,155+53*t],[140+69*c,155+69*t]));}
  shapes.push(text('cutoff-legend',140,252,'Inner b > 0 · outer R = 4a'),text('cutoff-limit',140,274,'a is a reference length, not particle size'));
  const X=b=>320+240*Math.log(b/.025)/Math.log(40),Y=u=>232-150*u/20;
  shapes.push(line('graph-x',[320,232],[560,232],'axis'),line('graph-y',[320,82],[320,232],'axis'),text('graph-zero',305,232,'0'),text('graph-max',301,82,'20'),text('graph-first-label',440,48,'Blue: cutoff-to-infinity / Ea'),text('graph-second-label',440,65,'Gold: finite annulus / Ea'));
  for(const b of [.025,.1,.25,1])shapes.push(text('cutoff-tick-'+b,X(b),252,String(b)));
  const bs=Array.from({length:121},(_,i)=>.025*Math.exp(Math.log(40)*i/120));
  shapes.push(curve('cutoff-total',bs.map(b=>[X(b),Y(.5/b)])),curve('cutoff-annulus',bs.map(b=>[X(b),Y(.5/b-.125)]),'gold-curve'),point('selected-energy',[X(s),Y(m.annulusEnergy)]),text('graph-radius',440,275,'b / a · logarithmic cutoff axis'));
  shapes.push(text('ledger-units',300,310,'Energy ledger divided by Ea = Kq²/a; R remains finite'),line('bar-origin',[300,321],[300,395],'reference'));
  energyBar(shapes,'annulus',334,'Finite annulus',m.annulusEnergy/20,'sample-field');energyBar(shapes,'tail',358,'Outer tail',m.outerTail/20);energyBar(shapes,'cutoff-total',382,'Sum to infinity',m.cutoffToInfinity/20);
  // Ledger bars share a fixed20-energy-unit length scale; values are actual ratios.
  for(const shape of shapes)if(['annulus-value','tail-value','cutoff-total-value'].includes(shape.id))shape.text=fmt(shape.id==='annulus-value'?m.annulusEnergy:shape.id==='tail-value'?m.outerTail:m.cutoffToInfinity);
  equations.push({id:'ch8-point-primitive',x:300,y:424},{id:'ch8-point-evaluation',x:300,y:465},{id:'ch8-point-cutoff',x:300,y:506});
  shapes.push(text('primitive-endpoint-values',300,540,'A(R)/Ea − A(b)/Ea = '+fmt(m.primitiveAtOuter)+' − ('+fmt(m.primitiveAtInner)+') = '+fmt(m.annulusEnergy)),text('point-diagnosis',300,565,'A(∞) → 0; A(b) → −∞ as b → 0+; integral → +∞'),text('point-exclusion',300,587,'Primitive values are not local energy; no numeric evaluation at zero'));
 }else{
  sphereSketch(shapes,s);
  if(scene==='rho-phi-energy'){
   title='CHARGE–POTENTIAL ENERGY · HALF-WEIGHTED INTEGRAL';
   const g=graph(shapes,{maximum:1.2,first:x=>2*regularSphereKernel(x).rhoEnergy,second:x=>regularSphereKernel(x).rhoEnergy,firstLabel:'Blue: ∫ ρφ / Ea in selected volume',secondLabel:'Gold: ½ ∫ ρφ / Ea'});
   shapes.push(point('selected-energy',[g.X(s),g.Y(m.rhoEnergy)]),text('pair-count',300,306,'Full distribution: pair (1,2) / (2,1) is counted twice'),line('bar-origin',[300,318],[300,367],'reference'));
   energyBar(shapes,'ordered',332,'Integral before ½',2*m.rhoEnergy);energyBar(shapes,'half-sum',357,'Half-weighted integral',m.rhoEnergy,'sample-field');
   equations.push({id:'ch8-rho-phi',x:300,y:402},{id:'ch8-mutual-pair',x:300,y:450});
   shapes.push(text('pair-exclusion',300,479,'Point mutual example: φother excludes each charge’s own potential'),text('partial-charge-note',300,497,s<1?'R < a: this is a partial final-distribution integral, not a smaller assembled ball':'R ≥ a: all charge is included; Uρφ / Ea = 3/5'));
  }else if(scene==='radial-vacuum-energy'){
   title='NONUNIFORM FIELD · ALL-SPACE ENERGY';
   const g=graph(shapes,{maximum:1,first:x=>regularSphereKernel(x).field,second:x=>regularSphereKernel(x).field**2,firstLabel:'Blue: E / Eref',secondLabel:'Gold: E² / Eref²'});
   shapes.push(point('selected-field',[g.X(s),g.Y(m.field)]),text('density-value',300,307,'Derived local u a³ / Ea ≈ '+fmt(m.energyDensity)+' · Eref = KQ/a²'),line('bar-origin',[300,322],[300,391],'reference'));
   energyBar(shapes,'field-inside',336,'Inside selected R',m.fieldEnergy,'sample-field');energyBar(shapes,'field-rest',360,'Rest of all space',m.totalEnergy-m.fieldEnergy);energyBar(shapes,'field-all',384,'All-space sum',m.totalEnergy);
   equations.push({id:'ch8-radial-field',x:300,y:433});shapes.push(text('radial-scope',300,465,'3/5 is this authored uniform-volume-sphere example'),text('radial-density-context',300,487,'Local density annotation is derived context for the field integral'));
  }else{
   title='FINITE VOLUME · SIGNED BOUNDARY RETAINED';
   const g=graph(shapes,{maximum:.6,first:x=>regularSphereKernel(x).rhoEnergy,second:x=>regularSphereKernel(x).fieldEnergy,firstLabel:'Blue: charge–potential energy / Ea',secondLabel:'Gold: field energy inside R / Ea'});
   shapes.push(point('selected-energy',[g.X(s),g.Y(m.fieldEnergy)]),text('finite-key',300,307,'Common scale: Uρφ = Ufield − B; outward ∂nφ = −E'),line('bar-origin',[300,322],[300,391],'reference'));
   energyBar(shapes,'rho-energy',336,'Uρφ / Ea',m.rhoEnergy);energyBar(shapes,'field-energy',360,'Ufield / Ea',m.fieldEnergy,'sample-field');energyBar(shapes,'boundary-energy',384,'Signed B / Ea',m.boundaryTerm);energyBar(shapes,'omitted-field-energy',408,'Outside R: field / Ea',m.omittedFieldEnergy);
   shapes.find(s=>s.id==='bar-origin').to[1]=416;
   equations.push({id:'ch8-finite-boundary',x:300,y:449},{id:'ch8-field-outside',x:300,y:488});shapes.push(text('finite-volume-scope',300,523,s<1?'R < a: outside field energy differs from −B':'R ≥ a: outside field energy equals −B'),text('finite-infinity',300,547,'φ(∞) = 0; only the analytic R → ∞ boundary vanishes'));
  }
 }
 const c=chapter8FieldControls(scene)[0],origin=60,scale=480/(c.max-c.min),probeY=scene==='finite-boundary-energy'?584:scene==='point-cutoff-energy'?632:520;
 shapes.push(text('title',300,24,title),line('probe-track',[60,probeY],[540,probeY],'axis'),point('radius-probe',[origin+(s-c.min)*scale,probeY],true),text('hint',300,probeY+25,'Drag the marker or use the radius control below'));
 const metrics=scene==='point-cutoff-energy'?[{label:'Finite annulus / Ea',value:fmt(m.annulusEnergy)},{label:'Outer tail / Ea',value:fmt(m.outerTail)},{label:'Cutoff to infinity / Ea',value:fmt(m.cutoffToInfinity)}]:[{label:'R / a',value:fmt(m.s)},{label:'Charge–potential / Ea',value:fmt(m.rhoEnergy)},{label:'Field inside R / Ea',value:fmt(m.fieldEnergy)},{label:'Signed boundary / Ea',value:fmt(m.boundaryTerm)}];
 if(scene==='finite-boundary-energy')metrics.push({label:'Outside R: field / Ea',value:fmt(m.omittedFieldEnergy)});
 if(scene==='point-cutoff-energy')metrics.push({label:'Primitive at b / Ea',value:fmt(m.primitiveAtInner)},{label:'Primitive at R / Ea',value:fmt(m.primitiveAtOuter)});
 return {schemaVersion:1,scene,width:600,height:chapter8FieldFrame(scene),label:title,sourceScope:chapter8FieldScope[scene],shapes,equations,metrics,probe:{id:'radius-probe',parameter:'r',origin:origin-c.min*scale,scale,min:c.min,max:c.max},context:chapter8FieldScope[scene]};
}
function reasoningDefinition(scene,m){
 const local=scene==='energy-locality-map',claims=local?localityClaims:classicalClaims,relations=local?localityRelations:classicalRelations,shapes=[],equations=[];
 const positions=local?{'global-total':[130,288],'local-balance':[450,288],'transport-accounting':[450,380],'gravity-motivation':[130,380],'electrostatics-nonunique':[300,457]}:{'classical-tension':[300,275],'extended-charge':[135,367],'small-scale-laws':[465,367],'historical-unresolved':[300,457]};
 const routes=local?[[[210,288],[368,288],[292,268]],[[450,317],[450,348],[518,334]],[[175,350],[405,318],[283,349]],[[350,431],[415,318],[390,416]]]:[[[263,306],[175,338],[205,315]],[[337,306],[425,338],[398,315]],[[250,431],[176,399],[190,431]],[[350,431],[424,399],[413,431]]];
 shapes.push(text('title',300,24,local?'LOCAL ENERGY · MORE THAN A CONSERVED TOTAL':'CLASSICAL POINT CHARGE · SOURCE ARGUMENT'));
 if(local){
  box(shapes,'closed-system',45,66,510,150);line('interface',[300,66],[300,216],'reference');shapes.push(text('volume-A',170,90,'Volume A'),text('volume-B',430,90,'Volume B'),text('change-A',170,125,'Change of energy in A'),text('change-B',430,125,'Change of energy in B'),arrow('transfer-role',[268,163],[333,163],'sample-field'),text('interface-label',300,193,'Boundary-transfer role · schematic'),text('global-geometry',300,236,'Global total alone does not supply this route or a rate'));
  equations.push({id:'ch8-local-gravity',x:145,y:428});
 }else{
  shapes.push(point('ideal-charge',[145,140]),text('ideal-plus',145,119,'+q'),circle('extended-shape',[455,140],58),text('ideal-label',145,214,'Ideal point: classical divergence'),text('extent-label',455,214,'Finite extent? Shape unspecified'));
  for(let i=0;i<6;i++){const angle=i*Math.PI/3,c=Math.cos(angle),t=Math.sin(angle);shapes.push(arrow('ideal-field-'+i,[145+31*c,140+31*t],[145+50*c,140+50*t]),text('extended-charge-mark-'+i,455+31*c,140+31*t,'+'));}
  shapes.push(text('classical-geometry',300,242,'Two alternatives to consider; neither is a computed resolution'));
 }
 for(let i=0;i<relations.length;i++){const r=relations[i],[A,B,L]=routes[i];shapes.push(arrow('relation-'+r.id,A,B,m.selectedClaimId===r.from||m.selectedClaimId===r.to?'sample-field':'background'),text('relation-kind-'+r.id,L[0],L[1],r.kind));}
 for(const c of claims){const [x,y]=positions[c.id];shapes.push(text('claim-'+c.id,x,y,c.title),line('claim-focus-'+c.id,[x-75,y+15],[x+75,y+15],c.id===m.selectedClaimId?'sample-field':'background'));}
 const chosen=claims[m.state.n];shapes.push(text('focus-title',300,495,'Focus: '+chosen.title+' · role: '+chosen.status),text('focus-meaning-0',300,521,chosen.lines[0]),text('focus-meaning-1',300,543,chosen.lines[1]),text('argument-scope',300,574,local?'Conditional = a logical premise; source concludes conservation is local':'Historical source discussion; no present-day status or replacement law'));
 const c=chapter8FieldControls(scene)[0],origin=70,scale=460/c.max;
 shapes.push(line('focus-track',[70,606],[530,606],'axis'),point('focus-probe',[origin+scale*m.state.n,606],true),text('hint',300,633,'Select a focus; all claims and relations remain visible'));
 return {schemaVersion:1,scene,width:600,height:650,label:local?'Global and local conservation argument':'Classical point-charge description limits',sourceScope:chapter8FieldScope[scene],shapes,equations,metrics:[{label:'Selected source claim',value:m.selectedClaimId},{label:'Argument role',value:m.sourceStatus}],probe:{id:'focus-probe',parameter:'n',origin,scale,min:0,max:c.max},context:chapter8FieldScope[scene]};
}
export function chapter8FieldDefinition(scene,values={}){const m=chapter8FieldModel(scene,values);return scene.endsWith('-map')?reasoningDefinition(scene,m):numericDefinition(scene,m);}
const escape=value=>String(value).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export function drawChapter8Field(scene,state){const d=chapter8FieldDefinition(scene,state);return {body:primitivesSVG(d.shapes)+d.equations.map(e=>`<text x="${e.x}" y="${e.y}" text-anchor="middle" font-size="11">${escape(chapter8FieldEquations[e.id].plain)}</text>`).join(''),metrics:d.metrics,label:d.label};}
export function chapter8FieldChecks(scene){
 const c=chapter8FieldControls(scene)[0],count=Math.round((c.max-c.min)/c.step)+1;
 for(let i=0;i<count;i++){const value=Number((c.min+i*c.step).toFixed(10)),m=chapter8FieldModel(scene,{[c.key]:value});
  if(scene.endsWith('-map')){if(m.visibleClaimIds.length!==c.max+1||m.visibleRelationIds.length!==4)throw Error('Reasoning context omitted.');}
  else if(scene==='point-cutoff-energy'){if(Math.abs(m.annulusEnergy+m.outerTail-m.cutoffToInfinity)>1e-12)throw Error('Cutoff energy ledger failed.');}
  else if(Math.abs(m.rhoEnergy-(m.fieldEnergy-m.boundaryTerm))>1e-12||m.energyDensity<0)throw Error('Finite-volume energy identity failed.');
 }
 return {passed:true,states:count,method:'Bounded normalized identity checks; independently frozen source/reference fixtures and native review remain separate.'};
}
