import {EPS0, K, NC} from './physics.js';
import {primitivesSVG} from './scene-primitives.js';

// Implemented from this author's independent opening-reference-contracts.json.
// These models deliberately remain outside the registered template catalog.
export const openingExtensionConstants = Object.freeze({
  epsilon0: EPS0, charge: 1.602176634e-19, electronMass: 9.1093837015e-31,
  boltzmann: 1.380649e-23, planck: 6.62607015e-34,
  hbar: 6.62607015e-34 / (2 * Math.PI), lightSpeed: 299792458,
});
const {charge: e, electronMass: me, boltzmann: kB, hbar, lightSpeed: c} = openingExtensionConstants;
const control = (key, label, min, max, step, units = '', integer = false) => ({key, label, min, max, step, units, ...(integer ? {integer: true} : {})});
export const openingExtensionDefaults = Object.freeze({
  'isolated-sphere-capacitance': Object.freeze({r: 1, q: 1, a: 2, b: 10, n: 0}),
  'plasma-wave-threshold': Object.freeze({r: 2, q: 12, a: 1, b: 0}),
  'plasma-quantum': Object.freeze({r: 29, n: 1}),
  'electrolyte-balance': Object.freeze({r: 1, q: 20, a: 300, b: 2}),
  'nonlinear-screening': Object.freeze({r: 2, q: 20, a: 300, b: 1}),
});
export const openingExtensionNames = Object.freeze(Object.keys(openingExtensionDefaults));
export function openingExtensionControls(scene) {
  switch (scene) {
    case 'isolated-sphere-capacitance': return [
      control('r', 'Sphere radius a', .25, 2, .025, 'm'), control('q', 'Sphere charge Q', -5, 5, .1, 'nC'),
      control('a', 'Observation radius r/a', 0, 5, .05), control('b', 'Finite outer radius b/a', 2, 20, .25),
      control('n', 'Reference: infinity (0) / concentric outer sphere (1)', 0, 1, 1, '', true),
    ];
    case 'plasma-wave-threshold': return [
      control('r', 'Frequency ratio ω/ωp', .05, 3, .01), control('q', 'Log₁₀ electron density', 8, 18, .1, 'm⁻³'),
      control('a', 'Distance xωp/c', 0, 8, .05), control('b', 'Wave phase', 0, 360, 5, 'degrees'),
    ];
    case 'plasma-quantum': return [control('r', 'Log₁₀ electron density', 27, 30, .05, 'm⁻³'), control('n', 'Selected level above ground', 0, 5, 1, 'quanta', true)];
    case 'electrolyte-balance': return [
      control('r', 'Distance x/λD', 0, 8, .05), control('q', 'Log₁₀ bulk density of each ion species', 18, 22, .1, 'm⁻³'),
      control('a', 'Temperature T', 250, 400, 5, 'K'), control('b', 'Surface potential eφs/(kBT)', -4, 4, .05),
    ];
    case 'nonlinear-screening': return [
      control('r', 'Surface potential eφs/(kBT)', -4, 4, .05), control('q', 'Log₁₀ bulk density of each ion species', 18, 22, .1, 'm⁻³'),
      control('a', 'Temperature T', 250, 400, 5, 'K'), control('b', 'Distance x/λD', 0, 8, .05),
    ];
    default: throw Error('Unknown opening extension model.');
  }
}
function positive(value, name) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError('Expected positive finite ' + name + '.');
}
function nonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError('Expected nonnegative finite ' + name + '.');
}

/** Exact isolated conductor, or an explicitly concentric ±Q capacitor. SI inputs. */
export function isolatedSphereKernel({radius, charge, observer = radius, outerRadius = null}) {
  positive(radius, 'radius'); nonnegative(observer, 'observer');
  if (!Number.isFinite(charge)) throw new RangeError('Expected finite charge.');
  if (outerRadius !== null && (!Number.isFinite(outerRadius) || outerRadius <= radius)) throw new RangeError('Outer radius must exceed sphere radius.');
  const CInfinity = 4 * Math.PI * EPS0 * radius;
  const inverseOuter = outerRadius === null ? 0 : 1 / outerRadius;
  const C = outerRadius === null ? CInfinity : CInfinity / (1 - radius / outerRadius);
  const potentialAt = r => {
    nonnegative(r, 'radial position');
    return outerRadius !== null && r >= outerRadius ? 0 : K * charge * (1 / Math.max(radius, r) - inverseOuter);
  };
  const fieldAt = r => {
    nonnegative(r, 'radial position');
    // Null means an actual charged-surface discontinuity; expose both limits.
    if (charge !== 0 && (r === radius || r === outerRadius)) return null;
    return r < radius || (outerRadius !== null && r > outerRadius) ? 0 : K * charge / r ** 2;
  };
  return {radius, charge, observer, outerRadius, CInfinity, C, VInfinity: charge / CInfinity,
    V: charge / C, phi: potentialAt(observer), E: fieldAt(observer), sigma: charge / (4 * Math.PI * radius ** 2),
    innerField: 0, surfaceOutsideField: K * charge / radius ** 2,
    outerInsideField: outerRadius === null ? null : K * charge / outerRadius ** 2,
    outerOutsideField: 0, potentialAt, fieldAt};
}
export function plasmaFrequencyKernel(density) {
  positive(density, 'electron density');
  const omegaP = Math.sqrt(density * e ** 2 / (EPS0 * me));
  return {density, omegaP, fP: omegaP / (2 * Math.PI)};
}
/** Transverse, cold, uniform, unmagnetized, collisionless plasma. */
export function plasmaWaveKernel(density, ratio) {
  positive(ratio, 'frequency ratio');
  const base = plasmaFrequencyKernel(density), omega = ratio * base.omegaP;
  const signedNormalizedK2 = (ratio - 1) * (ratio + 1), lengthScale = c / base.omegaP;
  const regime = ratio > 1 ? 'propagating' : ratio < 1 ? 'evanescent' : 'cutoff';
  const realK = ratio > 1 ? Math.sqrt(signedNormalizedK2) / lengthScale : 0;
  const decayK = ratio < 1 ? Math.sqrt(-signedNormalizedK2) / lengthScale : 0;
  const refractiveIndex = ratio > 1 ? Math.sqrt(signedNormalizedK2) / ratio : null;
  const envelopeAt = xi => {nonnegative(xi, 'dimensionless distance'); return Math.exp(-decayK * lengthScale * xi);};
  const fieldAt = (xi, phase = 0) => {
    nonnegative(xi, 'dimensionless distance');
    if (!Number.isFinite(phase)) throw new RangeError('Expected finite wave phase.');
    return regime === 'propagating' ? Math.cos(realK * lengthScale * xi - phase) : envelopeAt(xi) * Math.cos(phase);
  };
  return {...base, ratio, omega, f: omega / (2 * Math.PI), regime, lengthScale, signedNormalizedK2,
    kSquared: signedNormalizedK2 / lengthScale ** 2, realK, decayK,
    wavelength: regime === 'propagating' ? 2 * Math.PI / realK : null,
    decayLength: regime === 'evanescent' ? 1 / decayK : null,
    refractiveIndex, groupVelocity: regime === 'propagating' ? c * refractiveIndex : regime === 'cutoff' ? 0 : null,
    phaseVelocity: regime === 'propagating' ? c / refractiveIndex : null,
    dielectricRelative: 1 - 1 / ratio ** 2, envelopeAt, fieldAt};
}
export function plasmaQuantumKernel(density, level = 0) {
  if (!Number.isInteger(level) || level < 0 || level > 5) throw new RangeError('Expected an integer level from zero through five.');
  const base = plasmaFrequencyKernel(density), increment = hbar * base.omegaP;
  return {...base, level, increment, incrementEV: increment / e, energyAboveGround: level * increment,
    levels: Array.from({length: 6}, (_, n) => ({n, joulesAboveGround: n * increment, eVAboveGround: n * increment / e}))};
}
/** Exact planar Poisson–Boltzmann solution with a symmetric ±e bulk reservoir. */
export function planarReservoirKernel({temperature, bulkDensity, surfaceU, xi = 0}) {
  positive(temperature, 'temperature'); positive(bulkDensity, 'bulk density'); nonnegative(xi, 'dimensionless distance');
  if (!Number.isFinite(surfaceU) || Math.abs(surfaceU) > 4) throw new RangeError('Surface potential must lie between -4 and 4 thermal units.');
  const thermalVoltage = kB * temperature / e, lambdaD = Math.sqrt(EPS0 * kB * temperature / (2 * bulkDensity * e ** 2));
  const gamma = Math.tanh(surfaceU / 4), surfaceSigma = 2 * EPS0 * thermalVoltage / lambdaD * Math.sinh(surfaceU / 2);
  const at = coordinate => {
    nonnegative(coordinate, 'dimensionless distance');
    const y = gamma * Math.exp(-coordinate), denominator = 1 - y ** 2;
    const u = 4 * Math.atanh(y), uPrime = -4 * y / denominator;
    const uSecond = 4 * y * (1 + y ** 2) / denominator ** 2;
    const nPlus = bulkDensity * Math.exp(-u), nMinus = bulkDensity * Math.exp(u);
    const rho = -2 * e * bulkDensity * Math.sinh(u), phiSecond = thermalVoltage / lambdaD ** 2 * uSecond;
    const E = -thermalVoltage / lambdaD * uPrime, phi = thermalVoltage * u;
    return {xi: coordinate, x: coordinate * lambdaD, u, phi, E, rho, nPlus, nMinus,
      uPrime, uSecond, phiSecond, poissonCharge: -EPS0 * phiSecond,
      positiveEnergy: e * phi, negativeEnergy: -e * phi,
      positiveChemicalBalance: Math.log(nPlus / bulkDensity) + u,
      negativeChemicalBalance: Math.log(nMinus / bulkDensity) - u,
      linearU: surfaceU * Math.exp(-coordinate), farU: 4 * y,
      linearChargeRelativeError: u === 0 ? 0 : Math.abs(Math.sinh(u) / u - 1),
      diffuseChargeRemaining: -EPS0 * E};
  };
  return {temperature, bulkDensity, surfaceU, surfacePhi: thermalVoltage * surfaceU, gamma, thermalVoltage,
    lambdaD, surfaceSigma, diffuseChargeTotal: -surfaceSigma, at, ...at(xi)};
}

export function openingExtensionModel(scene, values = {}) {
  const controls = openingExtensionControls(scene), state = {...openingExtensionDefaults[scene], ...values};
  for (const x of controls) if (!Number.isFinite(state[x.key]) || state[x.key] < x.min || state[x.key] > x.max || (x.integer && !Number.isInteger(state[x.key]))) throw Error('Invalid opening extension parameter: ' + x.key);
  let model;
  if (scene === 'isolated-sphere-capacitance') {
    const radius = state.r, charge = state.q * NC, observer = state.a * radius;
    model = isolatedSphereKernel({radius, charge, observer, outerRadius: state.n ? state.b * radius : null});
    model.infinityComparison = isolatedSphereKernel({radius, charge, observer});
    model.finiteComparison = isolatedSphereKernel({radius, charge, observer, outerRadius: state.b * radius});
  } else if (scene === 'plasma-wave-threshold') {
    model = plasmaWaveKernel(10 ** state.q, state.r);
    model.phase = state.b * Math.PI / 180; model.xi = state.a; model.x = state.a * model.lengthScale;
    model.selectedField = model.fieldAt(state.a, model.phase);
  } else if (scene === 'plasma-quantum') model = plasmaQuantumKernel(10 ** state.r, state.n);
  else model = planarReservoirKernel({temperature: state.a, bulkDensity: 10 ** state.q,
    surfaceU: scene === 'electrolyte-balance' ? state.b : state.r, xi: scene === 'electrolyte-balance' ? state.r : state.b});
  return {...model, state};
}

export const openingExtensionScope = Object.freeze({
  'isolated-sphere-capacitance': 'Spherical conductor in vacuum, electrostatic equilibrium, potential zero at infinity. The optional finite reference is an exact concentric outer sphere carrying the opposite charge. No nearby arbitrary electrode, dielectric, leakage or breakdown. Charged surfaces have separate one-sided fields.',
  'plasma-wave-threshold': 'Small transverse electromagnetic disturbance in an ideal cold, uniform, unmagnetized, collisionless plasma with stationary neutralizing ions. Above cutoff: propagation; below cutoff: evanescent imposed-boundary field. No transmission percentages, interface matching, finite slab, real ionosphere, collisions, magnetic field or radio-path forecast.',
  'plasma-quantum': 'Energy spacing of an ideal collective harmonic plasma oscillator. Electron density sets the free-electron plasma frequency. Levels are shown relative to the ground state. No metal-specific density, band structure, foil scattering probabilities, intensities or transmission model.',
  'electrolyte-balance': 'Locally planar equilibrium half-space with symmetric singly charged ideal ions, equal bulk density per species, fixed surface potential, and neutral reservoir at infinity. Source ε₀ idealization. The same exact nonlinear profile satisfies Boltzmann statistics and Poisson. No solvent chemistry, transport dynamics, curvature or colloid stability prediction.',
  'nonlinear-screening': 'Exact planar nonlinear Poisson–Boltzmann reservoir solution with ±e ions, equal bulk density per species, fixed thermal surface potential, and potential/field zero at infinity. Source ε₀ idealization; surface charge is derived assuming zero interior field. No ion size, correlations, real solvent permittivity, chemistry, curvature, adsorption or time evolution.',
});
const sourceHash = '17b2ad182d7eff221e983a0250793dc8fc73c97f6f68331726c2bb154af91a79';
export const openingExtensionEquationSources = Object.freeze({
  'isolated-sphere-capacitance': {id: 'isolated-sphere-capacitance', plain: 'C∞ = 4πε₀a · V = Q/C · φ(∞) = 0', tex: String.raw`C_\infty=4\pi\epsilon_0a\qquad V=Q/C\qquad\phi(\infty)=0`, sourceHash, sourceUnits: ['c6-c27'], sourceLabels: ['unnumbered sphere capacitance'], sourceBounds: ['local-source-item', 'local-source-item'], derivation: 'Finite concentric comparison: C = 4πε₀ab/(b−a), with opposite charge on the outer sphere.'},
  'plasma-wave-threshold': {id: 'plasma-wave-threshold', plain: 'ωp² = ne²/(ε₀me) · c²k² = ω² − ωp²', tex: String.raw`\omega_p^2=\frac{ne^2}{\epsilon_0m_e}\qquad c^2k^2=\omega^2-\omega_p^2`, sourceHash, sourceUnits: ['c7-c16'], sourceLabels: ['7.25 (preceding context)', 'threshold prose'], sourceBounds: ['local-source-item', 'local-source-item'], derivation: 'Transverse dispersion independently derived from cold-electron polarization and Maxwell equations; the bounded paragraph states only the qualitative threshold.'},
  'plasma-quantum': {id: 'plasma-quantum', plain: 'ΔE = ħωp = hfp · En − E0 = nΔE', tex: String.raw`\Delta E=\hbar\omega_p=hf_p\qquad E_n-E_0=n\Delta E`, sourceHash, sourceUnits: ['c7-c17'], sourceLabels: ['unnumbered quantum spacing', '7.25 (preceding context)'], sourceBounds: ['local-source-item', 'local-source-item'], derivation: 'The levels use an explicit ground-state energy reference; no probability model is implied.'},
  'electrolyte-balance': {id: 'electrolyte-balance', plain: 'n± = n₀ exp(∓u) · ρ = e(n+ − n−) · φ″ = −ρ/ε₀', tex: String.raw`n_\pm=n_0e^{\mp u}\qquad\rho=e(n_+-n_-)\qquad\phi''=-\rho/\epsilon_0`, sourceHash, sourceUnits: ['c7-c18'], sourceLabels: ['7.28', '7.29–7.31 (following context)'], sourceBounds: ['local-source-item', 'local-source-item'], derivation: 'Same exact nonlinear reservoir solution as nonlinear-screening; chemical potential balances are derived from the Boltzmann densities.'},
  'nonlinear-screening': {id: 'nonlinear-screening', plain: 'u = 4 atanh[tanh(us/4) exp(−x/λD)]', tex: String.raw`u=4\operatorname{atanh}\!\left[\tanh(u_s/4)e^{-x/\lambda_D}\right]`, sourceHash, sourceUnits: ['c7-c19'], sourceLabels: ['7.29–7.31', '7.35–7.39 (following boundary context)'], sourceBounds: ['local-source-item', 'local-source-item'], derivation: 'Original exact solution of Eq.7.31 with a neutral half-space reservoir and fixed surface potential; p98 prints the linear limit, not this nonlinear closed form.'},
});

const text = (id, x, y, value) => ({id, type: 'text', at: [x, y], text: value});
const line = (id, from, to, style = 'axis') => ({id, type: 'segment', from, to, style});
const arrow = (id, from, to, style = 'normal', visible = true) => ({id, type: 'arrow', from, to, style, visible});
const point = (id, at, probe = false) => ({id, type: 'point', at, probe});
const curve = (id, points, style = 'blue-curve') => ({id, type: 'curve', points, style});
const fmt = value => Math.abs(value) < 1e-15 ? '0' : Number(value.toPrecision(4)).toString();
const sci = value => value === 0 ? '0' : value.toExponential(3);
const sample = (f, min, max, count = 96) => Array.from({length: count + 1}, (_, i) => f(min + (max - min) * i / count));
function box(shapes, id, x0, y0, x1, y1) {shapes.push(curve(id, [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]], 'patch'));}
function plot(shapes, id, {left, right, top, bottom, xmin, xmax, ymin, ymax, title, xLabel, yLabel}) {
  const X = x => left + (right - left) * (x - xmin) / (xmax - xmin), Y = y => bottom - (bottom - top) * (y - ymin) / (ymax - ymin);
  shapes.push(line(id + '-horizontal', [left, Y(0)], [right, Y(0)]), line(id + '-vertical', [left, top], [left, bottom]),
    text(id + '-title', (left + right) / 2, top - 19, title), text(id + '-x-label', (left + right) / 2, bottom + 29, xLabel),
    text(id + '-y-label', (left + right) / 2, top - 3, yLabel),
    text(id + '-min-x', left, bottom + 13, fmt(xmin)), text(id + '-max-x', right, bottom + 13, fmt(xmax)),
    text(id + '-min-y', left - 18, bottom - 7, fmt(ymin)), text(id + '-max-y', left - 18, top + 4, fmt(ymax)));
  return {X, Y};
}
function sphereDiagram(shapes, m) {
  const s = m.state, center = [117,165];
  shapes.push({id:'sphere',type:'circle',at:center,radius:47},{id:'finite-reference',type:'circle',at:center,radius:78},
    text('sphere-label',117,89,'Inner sphere: a = '+fmt(m.radius)+' m'), text('sphere-charge',117,168,'Q = '+fmt(s.q)+' nC'),
    text('outer-reference-label',117,270,'Finite comparison: b/a = '+fmt(s.b)), text('radii-schematic',117,290,'Schematic radii · arrows show direction'));
  for (let j=0;j<8;j++) {
    const angle=j*Math.PI/4,from=[117+52*Math.cos(angle),165+52*Math.sin(angle)],to=[117+70*Math.cos(angle),165+70*Math.sin(angle)];
    shapes.push(arrow('sphere-field-'+j,m.charge<0?to:from,m.charge<0?from:to,'normal',m.charge!==0));
  }
  const scale = Math.max(Math.abs(m.VInfinity),1), graph = plot(shapes,'sphere-potential',{left:300,right:560,top:115,bottom:232,xmin:0,xmax:5,ymin:-scale,ymax:scale,title:'Potential from the chosen reference',xLabel:'r/a',yLabel:'φ (V)'});
  const other=m.outerRadius===null?m.finiteComparison:m.infinityComparison;
  shapes.push(curve('chosen-potential',sample(x=>[graph.X(x),graph.Y(m.potentialAt(x*m.radius))],0,5)),
    curve('other-potential',sample(x=>[graph.X(x),graph.Y(other.potentialAt(x*m.radius))],0,5),'gold-curve'),point('radial-observer',[graph.X(s.a),graph.Y(m.phi)]),
    text('reference-choice',430,279,m.outerRadius===null?'Blue: infinity; dashed: finite b':'Blue: finite b; dashed: infinity'),
    text('sphere-capacity',430,298,(m.outerRadius===null?'C∞ = ':'Cb = ')+fmt(m.C*1e12)+' pF; '+(m.outerRadius===null?'V = ':'ΔV = ')+fmt(m.V)+' V'),
    text('sphere-field-readout',430,319,m.E===null?'Surface: E− = 0; E+ = '+fmt(m.surfaceOutsideField)+' V/m':'At r = '+fmt(m.observer)+' m: E = '+fmt(m.E)+' V/m'));
  // The outer charged surface has the opposite jump to the inner sphere.
  if(m.outerRadius!==null && m.observer===m.outerRadius)shapes.find(x=>x.id==='sphere-field-readout').text='Outer surface: E− = '+fmt(m.outerInsideField)+'; E+ = 0 V/m';
}
function plasmaDiagram(shapes,m) {
  const phase=m.phase, left=plot(shapes,'dispersion',{left:55,right:280,top:113,bottom:231,xmin:.05,xmax:3,ymin:-1,ymax:8,title:'Propagation threshold',xLabel:'ω/ωp',yLabel:'c²k²/ωp²'});
  shapes.push(curve('positive-dispersion',sample(x=>[left.X(x),left.Y(x*x-1)],1,3)),curve('negative-dispersion',sample(x=>[left.X(x),left.Y(x*x-1)],.05,1),'gold-curve'),
    line('cutoff-marker',[left.X(1),113],[left.X(1),231],'reference'),point('frequency-point',[left.X(m.ratio),left.Y(m.signedNormalizedK2)]));
  const right=plot(shapes,'field-profile',{left:355,right:565,top:113,bottom:231,xmin:0,xmax:8,ymin:-1,ymax:1,title:m.regime==='propagating'?'Traveling transverse field':m.regime==='evanescent'?'Decaying boundary field':'Cutoff: spatial k = 0',xLabel:'xωp/c',yLabel:'E/E₀ (imposed amplitude)'});
  shapes.push(curve('plasma-profile',sample(x=>[right.X(x),right.Y(m.fieldAt(x,phase))],0,8)),
    curve('plasma-envelope',sample(x=>[right.X(x),right.Y(m.envelopeAt(x))],0,8),'gold-curve'),
    point('plasma-position',[right.X(m.xi),right.Y(m.selectedField)]),
    text('plasma-frequency',165,280,'fp = '+fmt(m.fP/1e6)+' MHz; ωp = '+sci(m.omegaP)+' rad/s'),
    text('plasma-regime',165,302,m.regime.toUpperCase()+' · n = '+sci(m.density)+' m⁻³'),
    text('plasma-length',460,280,m.regime==='propagating'?'λ = '+fmt(m.wavelength)+' m':m.regime==='evanescent'?'Decay length = '+fmt(m.decayLength)+' m':'Cutoff: length tends to ∞'),
    text('plasma-wave-number',460,302,(m.regime==='evanescent'?'κ = '+fmt(m.decayK):'k = '+fmt(m.realK))+' m⁻¹; x = '+fmt(m.x)+' m'),
    text('plasma-group-speed',460,322,m.regime==='propagating'?'vg/c = '+fmt(m.groupVelocity/c):m.regime==='cutoff'?'Cutoff: group velocity = 0':'No traveling bulk wave below cutoff'));
}
function quantumDiagram(shapes,m) {
  shapes.push(text('levels-title',160,86,'Levels above the ground state (eV)'),text('levels-scale',160,309,'Level axis rescales with ΔE'));
  for (const level of m.levels) {
    const y=276-level.n*31;
    shapes.push(line('level-'+level.n,[65,y],[175,y],level.n===m.level?'normal':'axis'),text('level-label-'+level.n,229,y+4,level.n+': '+fmt(level.eVAboveGround)+' eV'));
  }
  const lower=Math.min(m.level,4);
  shapes.push(arrow('one-quantum',[95,276-lower*31],[95,276-(lower+1)*31]),point('selected-level',[175,276-m.level*31]));
  const graph=plot(shapes,'quantum-density',{left:355,right:565,top:113,bottom:242,xmin:27,xmax:30,ymin:0,ymax:40,title:'Density sets the energy spacing',xLabel:'log₁₀ n (m⁻³)',yLabel:'ΔE (eV)'});
  shapes.push(curve('quantum-spacing',sample(x=>[graph.X(x),graph.Y(plasmaQuantumKernel(10**x).incrementEV)],27,30)),point('quantum-density-probe',[graph.X(m.state.r),graph.Y(m.incrementEV)]),
    text('quantum-increment',460,292,'ΔE = '+fmt(m.incrementEV)+' eV = '+sci(m.increment)+' J'),
    text('quantum-selected',460,313,'Selected offset = '+fmt(m.energyAboveGround/e)+' eV'));
}
function balanceDiagram(shapes,m) {
  box(shapes,'potential-box',35,92,195,170);box(shapes,'population-box',235,92,405,170);box(shapes,'charge-box',445,92,585,170);box(shapes,'poisson-box',420,212,585,266);
  shapes.push(text('potential-title',115,107,'One potential at x'),text('potential-value',115,126,'φ = '+fmt(m.phi*1e3)+' mV'),text('positive-energy',115,145,'U+ = '+sci(m.positiveEnergy)+' J'),text('negative-energy',115,164,'U− = '+sci(m.negativeEnergy)+' J'),
    text('population-title',320,111,'Boltzmann populations'),text('positive-population',320,132,'n+ = '+sci(m.nPlus)+' m⁻³'),text('negative-population',320,153,'n− = '+sci(m.nMinus)+' m⁻³'),
    text('charge-title',515,111,'Signed charge'),text('charge-value',515,135,'ρ = '+fmt(m.rho)+' C/m³'),text('charge-rule',515,156,'ρ = e(n+ − n−)'),
    text('poisson-title',502,230,'Poisson curvature'),text('poisson-value',502,250,'φ″ = '+sci(m.phiSecond)+' V/m²'),
    arrow('potential-to-populations',[198,129],[231,129]),arrow('populations-to-charge',[408,129],[442,129]),arrow('charge-to-poisson',[515,174],[515,208]),
    arrow('poisson-to-potential',[416,237],[115,237]),arrow('closure-to-potential',[115,233],[115,174]),
    text('closure-label',265,222,'The same φ satisfies both laws'),
    text('positive-balance',217,286,'ln(n+/n₀) + u = '+fmt(m.positiveChemicalBalance)),text('negative-balance',217,307,'ln(n−/n₀) − u = '+fmt(m.negativeChemicalBalance)),
    text('balance-distance',490,286,'x = '+fmt(m.x*1e9)+' nm; λD = '+fmt(m.lambdaD*1e9)+' nm'),
    text('balance-density-residual',490,307,'−ε₀φ″ = '+fmt(m.poissonCharge)+' C/m³'));
}
function screeningDiagram(shapes,m) {
  const left=plot(shapes,'screening-profile',{left:55,right:280,top:113,bottom:229,xmin:0,xmax:8,ymin:-4,ymax:4,title:'Nonlinear and linear profiles',xLabel:'x/λD',yLabel:'u = eφ/(kBT)'});
  const right=plot(shapes,'ion-profiles',{left:355,right:565,top:113,bottom:229,xmin:0,xmax:8,ymin:-2,ymax:2,title:'Separate ion populations',xLabel:'x/λD',yLabel:'log₁₀(n±/n₀)'});
  shapes.push(curve('nonlinear-potential',sample(x=>[left.X(x),left.Y(m.at(x).u)],0,8)),curve('linear-potential',sample(x=>[left.X(x),left.Y(m.at(x).linearU)],0,8),'gold-curve'),
    curve('positive-ion-profile',sample(x=>[right.X(x),right.Y(-m.at(x).u/Math.LN10)],0,8)),curve('negative-ion-profile',sample(x=>[right.X(x),right.Y(m.at(x).u/Math.LN10)],0,8),'gold-curve'),
    point('screening-probe',[left.X(m.xi),left.Y(m.u)]),point('positive-ion-probe',[right.X(m.xi),right.Y(-m.u/Math.LN10)]),point('negative-ion-probe',[right.X(m.xi),right.Y(m.u/Math.LN10)]),
    text('profile-key',168,279,'Blue: nonlinear; dashed: linear'),text('ion-key',460,279,'Blue: positive; dashed: negative'),
    text('screening-position',168,299,'x = '+fmt(m.x*1e9)+' nm; λD = '+fmt(m.lambdaD*1e9)+' nm'),text('screening-charge',168,319,'ρ = '+fmt(m.rho)+' C/m³; φ = '+fmt(m.phi*1e3)+' mV'),
    text('ion-positive-readout',460,299,'n+ = '+sci(m.nPlus)+'; n− = '+sci(m.nMinus)+' m⁻³'),text('surface-charge-readout',460,319,'σ = '+fmt(m.surfaceSigma*1e6)+' µC/m²; E = '+sci(m.E)+' V/m'));
}

export function openingExtensionDefinition(scene, values = {}) {
  const m=openingExtensionModel(scene,values),shapes=[];
  const finiteSphereReference=scene==='isolated-sphere-capacitance' && m.outerRadius!==null;
  const titles={
    'isolated-sphere-capacitance':finiteSphereReference?'CONCENTRIC SPHERES · CAPACITANCE BETWEEN SURFACES':'ONE SPHERE · CAPACITANCE RELATIVE TO INFINITY',
    'plasma-wave-threshold':'PLASMA FREQUENCY · PROPAGATION OR EVANESCENCE',
    'plasma-quantum':'PLASMA OSCILLATOR · DISCRETE ENERGY INCREMENTS',
    'electrolyte-balance':'THERMAL EQUILIBRIUM AND ELECTROSTATICS',
    'nonlinear-screening':'NONLINEAR SCREENING · TWO ION POPULATIONS',
  };
  const contexts={
    'isolated-sphere-capacitance':finiteSphereReference?'Vacuum · concentric ±Q spheres · Vouter = 0 · ΔV = Vinner − Vouter':'Vacuum · electrostatic equilibrium · φ(∞) = 0 · both surface field limits are distinct',
    'plasma-wave-threshold':'Cold uniform unmagnetized plasma · imposed field amplitude · ideal bulk threshold',
    'plasma-quantum':'Ideal collective oscillator · energy relative to ground · density is illustrative',
    'electrolyte-balance':'Equal ±e reservoir · fixed surface potential · source ε₀ idealization · φ(∞) = 0',
    'nonlinear-screening':'Equal ±e reservoir · fixed φs · source ε₀ idealization · derived σ assumes zero interior field',
  };
  if(scene==='isolated-sphere-capacitance')sphereDiagram(shapes,m);
  else if(scene==='plasma-wave-threshold')plasmaDiagram(shapes,m);
  else if(scene==='plasma-quantum')quantumDiagram(shapes,m);
  else if(scene==='electrolyte-balance')balanceDiagram(shapes,m);
  else screeningDiagram(shapes,m);
  const first=openingExtensionControls(scene)[0],scale=220/(first.max-first.min),origin=65-first.min*scale;
  const equation=finiteSphereReference?{...openingExtensionEquationSources[scene],
    plain:'Cb = 4πε₀ab/(b−a) · Vinner − Vouter = Q/Cb',
    tex:String.raw`C_b=\frac{4\pi\epsilon_0ab}{b-a}\qquad V_{\rm inner}-V_{\rm outer}=Q/C_b`,
    activeReference:'finite-concentric'}:openingExtensionEquationSources[scene];
  shapes.push(text('title',300,29,titles[scene]),text('track-label',175,342,first.label+(first.units?' ('+first.units+')':'')),line('track',[65,361],[285,361]),
    point('probe',[origin+m.state[first.key]*scale,361],true),text('equation',300,398,equation.plain),text('context',300,423,contexts[scene]),
    text('hint',300,445,'Drag the black point · More controls below · Arrow keys vary the first control'));
  return {schemaVersion:1,scene,label:titles[scene],sourceScope:openingExtensionScope[scene],width:600,height:452,shapes,
    // No math-asset lookup until a separately reviewed catalog integration.
    equations:[],equationSources:[{...equation,x:300,y:398}],
    probe:{id:'probe',parameter:first.key,origin,scale,min:first.min,max:first.max}};
}
export function drawOpeningExtension(scene, values = {}) {
  const definition=openingExtensionDefinition(scene,values);
  return {body:primitivesSVG(definition.shapes.filter(s=>!['context','hint'].includes(s.id))),metrics:[],label:definition.label};
}
export function openingExtensionChecks(scene) {
  const initial=openingExtensionDefaults[scene],controls=openingExtensionControls(scene);
  const states=[initial,...controls.flatMap(x=>[x.min,x.max].map(value=>({...initial,[x.key]:value})))];
  if(scene==='electrolyte-balance')states.push({...initial,b:0});
  if(scene==='nonlinear-screening')states.push({...initial,r:0});
  if(scene==='plasma-wave-threshold')states.push({...initial,r:1});
  const close=(a,b,scale=Math.max(Math.abs(a),Math.abs(b)))=>{if(Math.abs(a-b)>1e-25+1e-10*scale)throw Error('Opening extension invariant failed.');};
  for(const state of states){
    const m=openingExtensionModel(scene,state);
    if(scene==='isolated-sphere-capacitance'){close(m.C*m.V,m.charge);close(m.CInfinity*m.VInfinity,m.charge);close(m.surfaceOutsideField, m.sigma/EPS0);}
    else if(scene==='plasma-wave-threshold'){close(c*c*m.kSquared,m.omega*m.omega-m.omegaP*m.omegaP,m.omegaP*m.omegaP);}
    else if(scene==='plasma-quantum'){close(m.increment/hbar,m.omegaP);close(m.levels[5].joulesAboveGround,5*m.increment);}
    else {close(m.poissonCharge,m.rho,e*m.bulkDensity);close(e*(m.nPlus-m.nMinus),m.rho,e*m.bulkDensity);close((m.nPlus/m.bulkDensity)*(m.nMinus/m.bulkDensity),1);close(m.uSecond,Math.sinh(m.u));}
    for(const shape of openingExtensionDefinition(scene,state).shapes){
      const coordinates=[...(shape.at||[]),...(shape.from||[]),...(shape.to||[]),...(shape.points||[]).flat(),...(shape.radius===undefined?[]:[shape.radius])];
      if(coordinates.some(x=>!Number.isFinite(x)) || (shape.type==='text' && /NaN|Infinity|undefined/.test(shape.text)))throw Error('Nonfinite opening extension diagram.');
    }
  }
  return {passed:true,states:states.length,method:'SI relations, independent charge/field identities and finite diagram geometry at control endpoints, with exact zero/cutoff cases. Independent numerical reference and integration tests are separate.',acceptance:'Implementation self-check only; different evaluator must perform source/native acceptance.'};
}
