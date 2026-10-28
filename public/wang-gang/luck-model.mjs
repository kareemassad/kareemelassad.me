import {compare,sum} from './engine.mjs?v=13978723b8da';

// One equally likely opponent among the other managers, using that week's scores.
export function scheduleLuckBreakdown(league,teamId){
  const team=league.byId[Number(teamId)],opponentsPerWeek=league.ids.length-1;
  if(!team||opponentsPerWeek<1)return null;
  const weeks=league.weeks.map(({week})=>{
    const score=league.scores[week][team.id],opponent=league.opponents[week][team.id],against=league.scores[week][opponent];
    const comparisons=league.ids.filter(id=>id!==team.id).map(id=>compare(score,league.scores[week][id]));
    const beaten=comparisons.filter(r=>r>0).length,tied=comparisons.filter(r=>r===0).length;
    const expected=(beaten+tied*.5)/opponentsPerWeek,result=compare(score,against),actual=result>0?1:result===0?.5:0;
    return {week,score,opponent,against,beaten,tied,expected,actual,result,difference:actual-expected};
  });
  const actualWins=sum(weeks.map(w=>w.actual)),expectedWins=sum(weeks.map(w=>w.expected));
  return {team,weeks,opponentsPerWeek,comparisons:opponentsPerWeek*weeks.length,beaten:sum(weeks.map(w=>w.beaten)),tied:sum(weeks.map(w=>w.tied)),actualWins,expectedWins,difference:actualWins-expectedWins};
}
