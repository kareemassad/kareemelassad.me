import {canonical} from './pack-schema.js';
import {validateReaderPack} from './reusable-explanation.js';
const verified = new Map();
let verifiedBytes = 0;
const maxVerifiedBytes = 8 * 1024 * 1024;
const sha256 = /^[a-f0-9]{64}$/;
const digest = async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(byte => byte.toString(16).padStart(2, '0')).join('');

// The local catalog verifies model and schema dependencies. The browser verifies
// package content here, then PackCatalog verifies anchors against the opened PDF.
export async function validateExplanationPackage(envelope, modelAssetsHash, schemaCompatibilityHash) {
 if (envelope?.format !== 'learning-explanation-package' || envelope.schemaVersion !== 1 ||
  envelope.modelAssetsHash !== modelAssetsHash || !sha256.test(modelAssetsHash || '') || !sha256.test(schemaCompatibilityHash || '')) {
  throw Error('Unsupported explanation package or compatibility profile.');
 }
 const key = envelope.packHash + '|' + modelAssetsHash + '|' + schemaCompatibilityHash;
 const fingerprint = canonical(envelope), cached = verified.get(key);
 if (cached?.fingerprint === fingerprint) return structuredClone(cached.pack);
 const pack = validateReaderPack(envelope.pack);
 if (envelope.id !== pack.id || envelope.version !== pack.version || envelope.source?.sha256 !== pack.source.sha256 ||
  envelope.source?.pages !== pack.source.pages || canonical(envelope.coverage) !== canonical(pack.coverage) ||
  canonical(pack) !== canonical(envelope.pack) || await digest(canonical(pack)) !== envelope.packHash ||
  !['preserved-accepted-package','authored-source-package'].includes(envelope.provenance?.kind) || envelope.provenance.originalAcceptedPackHash !== envelope.packHash ||
  pack.validation.workflow?.status !== 'accepted' || canonical(envelope.provenance.originalReview) !== canonical(pack.validation.workflow.review)) {
  throw Error('Saved explanation content or original review changed.');
 }
 if (fingerprint.length * 2 <= 512 * 1024) {
  if (cached) verifiedBytes -= cached.fingerprint.length * 2;
  verified.set(key, {fingerprint, pack: structuredClone(pack)});
  verifiedBytes += fingerprint.length * 2;
  while (verifiedBytes > maxVerifiedBytes || verified.size > 256) {
   const first = verified.keys().next().value;
   verifiedBytes -= verified.get(first).fingerprint.length * 2; verified.delete(first);
  }
 }
 return pack;
}
