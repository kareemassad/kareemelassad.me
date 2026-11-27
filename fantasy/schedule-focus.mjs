export const winTotal=record=>record.w+record.t*.5;

export function scheduleComparison(league,teamId,scheduleId){
  const team=league.byId[teamId],schedule=league.byId[scheduleId];
  if(!team||!schedule)return null;
  const replay=team.matrix[schedule.id],weeks=league.replay(team.id,schedule.id);
  return {team,schedule,actual:team.actual,replay,delta:winTotal(replay)-winTotal(team.actual),flips:weeks.filter(w=>w.result!==w.actualResult).length};
}

export function pickSchedule(league,teamId,kind){
  const team=league.byId[teamId];if(!team)return null;
  if(kind==='own')return team.id;
  return [...league.teams].sort((a,b)=>{
    const delta=winTotal(team.matrix[b.id])-winTotal(team.matrix[a.id]);
    return (kind==='fewest'?-delta:delta)||(Number(b.id===team.id)-Number(a.id===team.id))||a.id-b.id;
  })[0].id;
}
