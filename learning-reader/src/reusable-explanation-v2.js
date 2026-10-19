import {canonical, positionNumber} from './pack-schema.js';
import {validateExplanationRecipe as validateV1Recipe, validateReusablePack as validateV1Pack, reusableInputs} from './reusable-explanation-v1.js';

const only = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
const prose = (value, max) => typeof value === 'string' && value.trim() && value.length <= max;
const baseUnit = ({reading, ...unit}) => unit;
const baseRecipe = recipe => ({...recipe, schemaVersion: 1, units: recipe.units.map(baseUnit)});
function selector(point, unit) {
 if (!only(point, ['page', 'anchor', 'y']) || !Number.isInteger(point.page) || point.page < unit.start.page || point.page > unit.end.page || !prose(point.anchor, 240) || (point.y !== undefined && (!Number.isFinite(point.y) || point.y < 0 || point.y > 1))) throw Error('Invalid read-ahead source selector.');
}

// Version 2 adds a saved reading plan. One unit is one stable model and source
// interval. A beat can change checked inputs, never the renderer or its limits.
export function validateExplanationRecipeV2(input) {
 if (input?.schemaVersion !== 2 || !Array.isArray(input.units)) throw Error('Unsupported read-ahead recipe.');
 validateV1Recipe(baseRecipe(input));
 for (const unit of input.units) {
  if (unit.reading === undefined) continue;
  const plan = unit.reading;
  if (!only(plan, ['pages', 'beats']) || !Array.isArray(plan.pages) || !plan.pages.length || !Array.isArray(plan.beats) || !plan.beats.length || plan.beats.length > 64) throw Error('Invalid read-ahead plan.');
  // The final boundary can be a heading on the next page. That page needs no
  // summary unless this unit has source content on it.
  if (![unit.end.page, Math.max(unit.start.page, unit.end.page - 1)].includes(plan.pages.at(-1)?.page) || plan.pages.length !== plan.pages.at(-1).page - unit.start.page + 1) throw Error('Summarize each page in the source group.');
  for (const [i, page] of plan.pages.entries()) {
   if (!only(page, ['page', 'summary', 'evidence']) || page.page !== unit.start.page + i || !prose(page.summary, 800) || !Array.isArray(page.evidence) || !page.evidence.length || page.evidence.length > 8) throw Error('Invalid read-ahead page summary.');
   for (const point of page.evidence) {selector(point, unit); if (point.page !== page.page) throw Error('A page summary needs evidence on that page.');}
  }
  const ids = new Set();
  for (const beat of plan.beats) {
   if (!only(beat, ['id', 'at', 'caption', 'inputs']) || !/^[-a-z0-9]{1,80}$/.test(beat.id || '') || ids.has(beat.id) || !prose(beat.caption, 280)) throw Error('Invalid or duplicate reading step.');
   ids.add(beat.id); selector(beat.at, unit);
   if (!plan.pages.some(page => page.page === beat.at.page)) throw Error('A reading step needs a summarized page.');
   reusableInputs({model: unit.model, inputs: beat.inputs});
  }
  if (canonical(plan.beats[0].at) !== canonical(unit.start)) throw Error('The first reading step must start at the source group boundary.');
 }
 return structuredClone(input);
}

export const readingLocations = plan => plan ? [...plan.pages.flatMap(page => page.evidence), ...plan.beats.map(beat => beat.at)] : [];

export function bindReadingPlan(unit, select) {
 if (!unit.reading) return undefined;
 return {
  pages: unit.reading.pages.map(page => ({...page, evidence: page.evidence.map(select)})),
  beats: unit.reading.beats.map(beat => ({...beat, at: select(beat.at), inputs: reusableInputs({model: unit.model, inputs: beat.inputs})}))
 };
}

export function validateReusablePackV2(input) {
 if (input?.format !== 'reusable-explanations' || input.schemaVersion !== 2) throw Error('Unsupported read-ahead package.');
 const recipe = validateExplanationRecipeV2(input.recipe);
 validateV1Pack({...input, schemaVersion: 1, recipe: baseRecipe(recipe), passages: input.passages?.map(({reading, ...passage}) => passage)});
 for (const [i, unit] of recipe.units.entries()) {
  const plan = input.passages[i].reading, coverage = input.coverage[i];
  if (!unit.reading) {if (plan !== undefined) throw Error('Unexpected reading plan.'); continue;}
  const locations = readingLocations(plan);
  const declared = readingLocations(unit.reading);
  if (locations.length !== declared.length) throw Error('Reading plan differs from its recipe.');
  for (const [j, point] of locations.entries()) {
   const expected = declared[j];
   if (!only(point, ['page', 'anchor', 'y']) || point.page !== expected.page || point.anchor !== expected.anchor || !Number.isFinite(point.y) || point.y < 0 || point.y > 1 || (expected.y !== undefined && Math.abs(expected.y - point.y) >= .025) || positionNumber(point) < positionNumber(coverage.start) || positionNumber(point) >= positionNumber(coverage.end)) throw Error('A reading step or summary is outside its source group.');
  }
  const selected = new Map(declared.map((point, j) => [canonical(point), locations[j]]));
  if (canonical(plan) !== canonical(bindReadingPlan(unit, point => selected.get(canonical(point))))) throw Error('Reading plan differs from its recipe.');
  if (canonical(plan.beats[0].at) !== canonical(coverage.start)) throw Error('The reading plan starts outside its source group.');
  let previous = -Infinity;
  for (const beat of plan.beats) {
   const at = positionNumber(beat.at);
   if (at <= previous) throw Error('Reading steps must follow source order.');
   previous = at;
  }
 }
 return structuredClone(input);
}
