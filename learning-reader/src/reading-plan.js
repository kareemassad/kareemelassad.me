import {positionNumber} from './pack-schema.js';
const key = passage => [passage.packId || '', passage.packVersion || '', passage.id].join(':');

// Reading only selects saved states. A small dead band prevents repeated changes
// at a source anchor. Manual exploration stays paused until the reader resumes it.
export class ReadingFollower {
 constructor(snapshot = []) {this.records = new Map(snapshot.filter(([id, value]) => typeof id === 'string' && typeof value?.following === 'boolean' && (value.index === null || Number.isInteger(value.index) && value.index >= 0)));}
 clear() {this.records.clear();}
 snapshot() {return [...this.records].map(([id, value]) => [id, {...value}]);}
 manual(passage) {const record = this.record(passage); record.following = false;}
 record(passage) {
  const id = key(passage);
  if (!this.records.has(id)) this.records.set(id, {following: true, index: null});
  return this.records.get(id);
 }
 resume(passage, position) {const record = this.record(passage); record.following = true; record.index = null; return this.update(passage, position);}
 update(passage, position) {
  const plan = passage?.reading;
  if (!plan) return null;
  const record = this.record(passage), at = positionNumber(position), previous = record.index;
  let index = Math.max(0, plan.beats.findLastIndex(beat => positionNumber(beat.at) <= at));
  if (!record.following) index = Math.min(previous ?? index, plan.beats.length - 1);
  else if (previous !== null && previous < plan.beats.length) {
   if (index > previous && at < positionNumber(plan.beats[index].at) + .008) index = previous;
   else if (index < previous && at >= positionNumber(plan.beats[previous].at) - .008) index = previous;
  }
  const changed = record.following && index !== previous;
  record.index = index;
  return {following: record.following, changed, index, total: plan.beats.length, beat: plan.beats[index], caption: record.following ? plan.beats[index].caption : passage.caption, page: plan.pages.find(page => page.page === position.page) || null};
 }
}
