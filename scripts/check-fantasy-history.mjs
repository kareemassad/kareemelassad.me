import assert from 'node:assert/strict';
import history,{unavailable} from '../public/fantasy/history.mjs';
import {createLeague} from '../public/fantasy/engine.mjs';
import {manager} from '../public/fantasy/identity.mjs';
assert(history['2025']);assert(unavailable.some(s=>s.season==='2024'));
for(const data of Object.values(history)){
  const league=createLeague(data);assert(data.seasonComplete);assert(data.archived);
  for(const t of league.teams){const official=data.standings.find(s=>s.id===t.id);assert.deepEqual(t.actual,{w:official.w,l:official.l,t:official.t});assert.equal(t.pf,official.pf);assert.equal(t.pa,official.pa);for(const s of league.teams){assert(league.replay(t.id,s.id).every(w=>w.opponent!==t.id));}}
  assert(Math.abs(league.teams.reduce((n,t)=>n+t.luck,0))<1e-8);
}
assert.equal(manager({id:1,name:'Past manager',manager:null}),'Past manager');
assert.equal(manager({id:1,name:'Old team',manager:'Rory'}),'Rory');
console.log('PASS: historical standings, all schedule replays, no self-matchups, balanced luck, owner identities, and unavailable seasons.');
