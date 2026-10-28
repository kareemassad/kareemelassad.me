import {fitsSlot} from './insights.mjs?v=dac01f61efdc';
import {record} from './engine.mjs?v=dac01f61efdc';
const cache=new WeakMap();
export function lineupManagerLeaders(standings){
  if(!standings.complete)return null;
  const teams=standings.teams.filter(t=>Number.isFinite(t.capture));
  if(!teams.length)return null;
  const high=Math.max(...teams.map(t=>t.capture)),low=Math.min(...teams.map(t=>t.capture));
  return {best:teams.filter(t=>Math.abs(t.capture-high)<1e-9),worst:teams.filter(t=>Math.abs(t.capture-low)<1e-9),allTied:Math.abs(high-low)<1e-9};
}
export function optimizeLineup(lineup,playerInfo){
  if(lineup?.status!=='complete'||!lineup.starters?.length)return {ok:false,reason:'Incomplete historical lineup data'};
  const slots=lineup.starters.map(p=>p.slot);
  if(slots.length>16)return {ok:false,reason:'Lineup has more slots than supported'};
  const pool=new Map();
  for(const p of [...lineup.starters,...lineup.bench]){
    if(!p.id)continue;
    if(!Number.isInteger(p.points)||!playerInfo[p.id]?.positions?.length)return {ok:false,reason:'Missing player score or position'};
    if(pool.has(p.id)&&pool.get(p.id).points!==p.points)return {ok:false,reason:'Conflicting player scores'};
    pool.set(p.id,{id:p.id,points:p.points,positions:playerInfo[p.id].positions});
  }
  if(lineup.starters.some(p=>p.id&&!fitsSlot(playerInfo[p.id].positions,p.slot)))return {ok:false,reason:'Current eligibility does not reconstruct an original starter slot'};
  const size=1<<slots.length,filled=new Uint8Array(size);for(let i=1;i<size;i++)filled[i]=filled[i>>1]+(i&1);
  let dp=new Float64Array(size);dp.fill(-Infinity);dp[0]=0;let paths=Array(size).fill(null);
  for(const player of pool.values()){
    const eligible=slots.map((slot,i)=>fitsSlot(player.positions,slot)?i:-1).filter(i=>i>=0);
    const next=dp.slice(),nextPaths=paths.slice();
    for(let mask=0;mask<size;mask++){
      if(dp[mask]===-Infinity)continue;
      for(const slot of eligible){const bit=1<<slot;if(mask&bit)continue;const target=mask|bit,value=dp[mask]+player.points;if(value>next[target]){next[target]=value;nextPaths[target]={id:player.id,slot,previous:paths[mask]};}}
    }
    dp=next;paths=nextPaths;
  }
  let best=0;for(let mask=1;mask<size;mask++)if(dp[mask]>dp[best]||dp[mask]===dp[best]&&filled[mask]>filled[best])best=mask;
  const assignments=slots.map((slot,i)=>({slot,id:null,points:0,originalId:lineup.starters[i].id}));
  for(let node=paths[best];node;node=node.previous)assignments[node.slot]={...assignments[node.slot],id:node.id,points:pool.get(node.id).points};
  const actual=lineup.starters.reduce((s,p)=>s+p.points,0);
  return {ok:true,points:dp[best],actual,gain:dp[best]-actual,assignments};
}
export function perfectStandings(league){
  if(cache.has(league))return cache.get(league);
  const required=league.teams.length*league.weeks.length,byWeek={};let complete=0;const missing=[];
  for(const {week} of league.weeks){byWeek[week]={};for(const team of league.teams){const lineup=league.lineups?.find(r=>r.week===week&&r.teamId===team.id),opt=optimizeLineup(lineup,league.playerInfo??{});if(opt.ok&&opt.actual===league.scores[week][team.id]){byWeek[week][team.id]=opt;complete++;}else missing.push({week,teamId:team.id,reason:opt.reason??'Starter total does not reconcile'});}}
  if(complete!==required){const result={complete:false,coverage:{complete,required},missing,byWeek,teams:[]};cache.set(league,result);return result;}
  const cmp=(a,b)=>a>b?1:a<b?-1:0;
  const teams=league.teams.map(t=>{const weeks=league.weeks.map(({week})=>{const opponent=league.opponents[week][t.id],own=byWeek[week][t.id],other=byWeek[week][opponent],actualFor=league.scores[week][t.id],actualAgainst=league.scores[week][opponent];return {week,opponent,actualFor,actualAgainst,optimalFor:own.points,optimalAgainst:other.points,gain:own.gain,actualResult:cmp(actualFor,actualAgainst),perfectResult:cmp(own.points,other.points),ownOnlyResult:cmp(own.points,actualAgainst)};});const perfect=record(weeks.map(w=>w.perfectResult)),ownOnly=record(weeks.map(w=>w.ownOnlyResult)),optimalPoints=weeks.reduce((s,w)=>s+w.optimalFor,0),actualPoints=weeks.reduce((s,w)=>s+w.actualFor,0);return {...t,perfect,ownOnly,weeks,optimalPoints,pointsLeft:optimalPoints-actualPoints,capture:optimalPoints>0?actualPoints/optimalPoints*100:null,winChange:perfect.w+perfect.t*.5-t.actual.w-t.actual.t*.5,recoverableLosses:weeks.filter(w=>w.actualResult<0&&w.ownOnlyResult>0).length};}).sort((a,b)=>b.perfect.w+b.perfect.t*.5-a.perfect.w-a.perfect.t*.5||b.optimalPoints-a.optimalPoints);
  const result={complete:true,coverage:{complete,required},byWeek,teams};cache.set(league,result);return result;
}
