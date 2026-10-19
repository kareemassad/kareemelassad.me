import {replicationDefaults} from './replication-lessons.js';
import {replicationControls, renderReplication} from './replication-view.js';
import {generatedDefaults} from './generated-model.js';
import {generatedControls, renderGenerated} from './generated-view.js';
import {orbitalFlightModel} from './orbital-flight-view.js';
import {clockPathModel} from './clock-path-view.js';

// Add a checked model family here. The reader uses the same interface for each
// family; book data cannot register a renderer or execute code.
const models = new Map([
 ['clock-path', clockPathModel],
 ['orbital-flight', orbitalFlightModel],
 ['replication-lab', Object.freeze({
  defaults: passage => replicationDefaults(passage.lab),
  controls: (container, passage, state, apply) => replicationControls(container, passage.lab, state, apply),
  render: (container, passage, state) => renderReplication(container, passage.lab, state),
  syncControls: (container, state) => {
   for (const input of container.querySelectorAll('[data-replication-control]')) {
    input.value = state[input.dataset.replicationControl];
    const output = input.closest('label')?.querySelector('output'); if (output) output.textContent = input.value;
   }
  }
 })],
 ['generated-model', Object.freeze({
  defaults: passage => generatedDefaults(passage.generated.model),
  controls: (container, passage, state, apply) => generatedControls(container, passage.generated.model, state, apply),
  render: (container, passage, state) => renderGenerated(container, passage.generated.model, state)
 })]
]);

export const hasLearningModel = scene => models.has(scene);
export const learningModelFor = passage => models.get(passage?.scene) || null;
