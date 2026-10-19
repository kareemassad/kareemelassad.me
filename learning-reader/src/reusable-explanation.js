import {validatePack} from './pack-schema.js';
import {validateReplicationPack} from './replication-package.js';
import {validateExplanationRecipe as validateV1Recipe, validateReusablePack as validateV1Pack} from './reusable-explanation-v1.js';
import {validateExplanationRecipeV2, validateReusablePackV2} from './reusable-explanation-v2.js';
import {validateOrbitalFlightPack} from './orbital-flight-package-v1.js';
import {validateClockPathPack} from './clock-path-package-v1.js';
export {reusableModels, reusableModel, reusableInputs} from './reusable-explanation-v1.js';
export const validateExplanationRecipe = input => input?.schemaVersion === 2 ? validateExplanationRecipeV2(input) : validateV1Recipe(input);
export const validateReusablePack = input => input?.schemaVersion === 2 ? validateReusablePackV2(input) : validateV1Pack(input);

// Extend this dispatcher with new immutable codecs. Existing model profiles pin
// their versioned codec, not this shell dispatcher.
export const isNativeReaderPack = pack => ['replication-explanations', 'reusable-explanations','orbital-flight-explanations','clock-path-explanations'].includes(pack?.format);
export function validateReaderPack(pack) {
 if (pack?.format === 'clock-path-explanations') return validateClockPathPack(pack);
 if (pack?.format === 'orbital-flight-explanations') return validateOrbitalFlightPack(pack);
 if (pack?.format === 'reusable-explanations') return validateReusablePack(pack);
 if (pack?.format === 'replication-explanations') return validateReplicationPack(pack);
 return validatePack(pack);
}
