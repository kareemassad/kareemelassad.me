import {MANAGERS} from './identity.mjs?v=0d6b293e43de';
export const sum = xs => xs.reduce((a,b)=>a+b,0);
export const compare = (a,b) => a>b ? 1 : a<b ? -1 : 0;
export const record = xs => ({w:xs.filter(x=>x>0).length,l:xs.filter(x=>x<0).length,t:xs.filter(x=>x===0).length});
export const recordText = r => `${r.w}–${r.l}${r.t?`–${r.t}`:''}`;
export function createLeague(data) {
  const ids=data.teams.map(t=>t.id), names=Object.fromEntries(data.teams.map(t=>[t.id,t.name]));
  const scores={}, opponents={};
  for(const week of data.weeks){scores[week.week]={}; opponents[week.week]={}; for(const m of week.matchups){
    scores[week.week][m.home]=Math.round(m.homePoints*100);scores[week.week][m.away]=Math.round(m.awayPoints*100);
    opponents[week.week][m.home]=m.away;opponents[week.week][m.away]=m.home;
  }}
  const replay=(team,schedule)=>data.weeks.map(({week})=>{
    const swapped=opponents[week][schedule]===team;
    const opponent=swapped?schedule:opponents[week][schedule];
    const score=scores[week][team],against=scores[week][opponent];
    const actualOpponent=opponents[week][team],actualAgainst=scores[week][actualOpponent];
    return {week,opponent,score,against,result:compare(score,against),actualResult:compare(score,actualAgainst),actualOpponent,actualAgainst,keptMatchup:swapped&&team!==schedule};
  });
  const teams=data.teams.map(team=>{
    const own=replay(team.id,team.id), actual=record(own.map(x=>x.result));
    const allplay=record(data.weeks.flatMap(({week})=>ids.filter(id=>id!==team.id).map(id=>compare(scores[week][team.id],scores[week][id]))));
    const expected=(allplay.w+allplay.t*.5)/(ids.length-1);
    const matrix=Object.fromEntries(ids.map(id=>[id,record(replay(team.id,id).map(x=>x.result))]));
    const wins=Object.values(matrix).map(r=>r.w+r.t*.5);
    return {...team,manager:MANAGERS[team.id]||null,actual,allplay,expected,luck:actual.w+actual.t*.5-expected,matrix,pf:sum(own.map(x=>x.score))/100,pa:sum(own.map(x=>x.against))/100,best:Math.max(...wins),worst:Math.min(...wins)};
  });
  const byId=Object.fromEntries(teams.map(t=>[t.id,t]));
  return {...data,ids,names,scores,opponents,replay,teams,byId,weeksPlayed:data.weeks.length};
}
