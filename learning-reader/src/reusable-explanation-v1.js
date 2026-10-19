import {canonical, positionNumber} from './pack-schema.js';
import {replicationLessons, replicationDefaults} from './replication-lessons.js';
import {replicationState} from './replication-models.js';

const hash = /^[a-f0-9]{64}$/;
const id = /^[-a-z0-9]{1,80}$/;
const text = (value, name, max = 2000) => {
 if (typeof value !== 'string' || !value.trim() || value.length > max) throw Error('Invalid ' + name + '.');
 return value;
};
const only = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
const location = (point, pages) => point && Number.isInteger(point.page) && point.page > 0 && point.page <= pages && Number.isFinite(point.y) && point.y >= 0 && point.y <= 1;

// A model reference selects existing checked code. Recipes never execute code.
// Book titles, prose, citations and locations belong to the recipe, not the model.
export const reusableModels = Object.freeze(replicationLessons.map(lesson => Object.freeze({
 id: 'replication/' + lesson.id, version: 1, scene: 'replication-lab', lab: lesson.id,
 assumptions: lesson.limit, cases: Object.freeze([...lesson.cases]),
 defaults: Object.freeze(replicationDefaults(lesson.id)),
 inputs: Object.freeze({step: Object.freeze([0, lesson.cases.length - 1]), ...(lesson.id === 'quorum' ? {w: Object.freeze([1, 5]), r: Object.freeze([1, 5]), start: Object.freeze([0, 4])} : lesson.id === 'ack' ? {sync: Object.freeze([0, 1])} : {})}),
 dependencies: Object.freeze(['src/replication-lessons.js', 'src/replication-models.js', 'src/replication-view.js'])
})));
export function reusableModel(reference) {
 const model = reusableModels.find(model => model.id === reference?.id && model.version === reference.version);
 if (!model) throw Error('Unknown reusable model or version.');
 return model;
}
export function reusableInputs(unit) {
 const model = reusableModel(unit.model), supplied = unit.inputs || {};
 if (!only(supplied, Object.keys(model.inputs))) throw Error('Unsupported reusable model input.');
 const state = {...model.defaults, ...supplied};
 for (const [key, [min, max]] of Object.entries(model.inputs)) if (!Number.isInteger(state[key]) || state[key] < min || state[key] > max) throw Error('Reusable model input is outside its checked domain.');
 replicationState(model.lab, state);
 return state;
}

export function validateExplanationRecipe(input) {
 if (!only(input, ['format', 'schemaVersion', 'id', 'version', 'source', 'units', 'basedOn']) || input.format !== 'reusable-explanation-recipe' || input.schemaVersion !== 1 || !id.test(input.id || '') || !Number.isInteger(input.version) || input.version < 1 || input.version > 999) throw Error('Unsupported explanation recipe.');
 const source = input.source;
 if (!only(source, ['sha256', 'pages', 'title', 'edition']) || !hash.test(source.sha256 || '') || !Number.isInteger(source.pages) || source.pages < 1 || source.pages > 100000) throw Error('Invalid recipe source.');
 text(source.title, 'source title', 240); text(source.edition, 'source edition', 240);
 if (!Array.isArray(input.units) || !input.units.length || input.units.length > 200) throw Error('Invalid explanation units.');
 const seen = new Set();
 for (const unit of input.units) {
  if (!only(unit, ['id', 'model', 'inputs', 'title', 'caption', 'text', 'limit', 'start', 'end', 'citation']) || !id.test(unit.id || '') || seen.has(unit.id)) throw Error('Invalid or duplicate explanation unit.');
  seen.add(unit.id);
  if (!only(unit.model, ['id', 'version'])) throw Error('Invalid reusable model reference.');
  reusableModel(unit.model);
  reusableInputs(unit);
  text(unit.title, 'unit title', 100); text(unit.caption, 'unit caption', 280); text(unit.text, 'original explanation'); text(unit.limit, 'source limits');
  if (!only(unit.citation, ['printed', 'section', 'ref'])) throw Error('Invalid edition citation.');
  text(unit.citation.printed, 'printed page', 60); text(unit.citation.section, 'section', 60); text(unit.citation.ref, 'reference', 240);
  for (const selector of [unit.start, unit.end]) {
   if (!only(selector, ['page', 'anchor', 'y']) || !Number.isInteger(selector.page) || selector.page < 1 || selector.page > source.pages || (selector.y !== undefined && (!Number.isFinite(selector.y) || selector.y < 0 || selector.y > 1))) throw Error('Invalid source selector.');
   text(selector.anchor, 'exact source selector', 240);
  }
  if (unit.end.page < unit.start.page || unit.end.page - unit.start.page > 12) throw Error('Use an ordered source unit of at most thirteen pages.');
 }
 if (input.basedOn !== undefined) {
  if (!only(input.basedOn, ['id', 'version', 'sourceHash', 'packHash']) || !id.test(input.basedOn.id || '') || !Number.isInteger(input.basedOn.version) || input.basedOn.version < 1 || !hash.test(input.basedOn.sourceHash || '') || !hash.test(input.basedOn.packHash || '')) throw Error('Invalid explanation lineage.');
  if (input.basedOn.id === input.id && input.basedOn.version >= input.version) throw Error('An extension requires a newer version.');
 }
 return structuredClone(input);
}

export function validateReusablePack(input) {
 if (input?.format !== 'reusable-explanations' || input.schemaVersion !== 1) throw Error('Unsupported reusable explanation package.');
 const recipe = validateExplanationRecipe(input.recipe);
 if (input.id !== recipe.id || input.version !== recipe.version || canonical(input.source) !== canonical(recipe.source) || !Array.isArray(input.passages) || !Array.isArray(input.coverage) || input.passages.length !== recipe.units.length || input.coverage.length !== recipe.units.length) throw Error('Package differs from its recipe.');
 let previous = -Infinity;
 for (const [i, unit] of recipe.units.entries()) {
  const passage = input.passages[i], coverage = input.coverage[i], model = reusableModel(unit.model);
  if (!location(coverage?.start, recipe.source.pages) || !location(coverage?.end, recipe.source.pages) || positionNumber(coverage.start) >= positionNumber(coverage.end) || positionNumber(coverage.start) < previous) throw Error('Unordered or overlapping source coverage.');
  previous = positionNumber(coverage.end);
  for (const [point, selector] of [[coverage.start, unit.start], [coverage.end, unit.end]]) {
   if (point.page !== selector.page || point.anchor !== selector.anchor || (selector.y !== undefined && Math.abs(point.y - selector.y) >= .025)) throw Error('Source boundary differs from its recipe.');
  }
  const expected = {id: recipe.id + '--' + unit.id, model: unit.model, scene: model.scene, lab: model.lab, page: coverage.start.page, y: coverage.start.y,
   title: unit.title, caption: unit.caption, defaults: reusableInputs(unit),
   source: {page: coverage.start.page, ...unit.citation, text: unit.text, limit: model.assumptions + ' ' + unit.limit, anchor: coverage.start.anchor}};
  if (canonical(passage) !== canonical(expected)) throw Error('Explanation, model assumptions or controls differ from the recipe.');
  replicationState(model.lab, passage.defaults);
 }
 const workflow = input.validation?.workflow;
 if (!workflow || !['unreviewed', 'accepted'].includes(workflow.status) || workflow.sourceHash !== recipe.source.sha256 || !['proposalHash', 'extractionHash', 'codeHash'].every(key => hash.test(workflow[key] || ''))) throw Error('Invalid reusable preparation record.');
 if (workflow.status === 'accepted') {
  const review = workflow.review;
  if (!['agent', 'human'].includes(review?.type) || !review.reviewer || review.proposalHash !== workflow.proposalHash || review.extractionHash !== workflow.extractionHash || review.codeHash !== workflow.codeHash || review.sourceHash !== recipe.source.sha256 || !['sourceReviewed', 'modelReviewed', 'visualsReviewed'].every(key => review[key] === true)) throw Error('Reusable explanation needs a matching recorded review.');
 }
 return structuredClone(input);
}

