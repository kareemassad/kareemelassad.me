export const mean=values=>values.reduce((s,v)=>s+v,0)/values.length;
export const median=values=>{const s=[...values].sort((a,b)=>a-b),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
export function seasonInsights(league){
  const weeklyMeans=league.weeks.map(({week})=>mean(league.ids.map(id=>league.scores[week][id]/100)));
  const teams=league.teams.map(t=>{
    const points=league.weeks.map(({week})=>league.scores[week][t.id]/100),avg=mean(points);
    let cumulative=0,luck=0;
    const cumulativePoints=points.map(x=>(cumulative+=x));
    const luckTrail=league.weeks.map(({week})=>{const score=league.scores[week][t.id],against=league.scores[week][league.opponents[week][t.id]],actual=score>against?1:score===against?.5:0,baseline=league.ids.filter(id=>id!==t.id).reduce((s,id)=>s+(score>league.scores[week][id]?1:score===league.scores[week][id]?.5:0),0)/(league.ids.length-1);return luck+=actual-baseline;});
    const rolling=points.map((_,i)=>mean(points.slice(Math.max(0,i-2),i+1)));
    const momentum=points.length>=6?mean(points.slice(-3))-mean(points.slice(0,3)):null;
    const sd=Math.sqrt(mean(points.map(x=>(x-avg)**2)));
    return {...t,points,avg,cumulativePoints,luckTrail,rolling,momentum,sd,min:Math.min(...points),max:Math.max(...points)};
  });
  const badBeats=[];
  for(const {week,matchups} of league.weeks)for(const m of matchups){for(const [id,other] of [[m.home,m.away],[m.away,m.home]]){const score=league.scores[week][id],against=league.scores[week][other],rank=1+league.ids.filter(j=>j!==id&&league.scores[week][j]>score).length;if(score<against&&score>median(league.ids.map(id=>league.scores[week][id])))badBeats.push({teamId:id,week,score:score/100,against:against/100,rank,margin:(against-score)/100,opponent:other});}}
  return {teams,weeklyMeans,rollingMeans:weeklyMeans.map((_,i)=>mean(weeklyMeans.slice(Math.max(0,i-2),i+1))),cumulativeMeans:weeklyMeans.map((_,i)=>weeklyMeans.slice(0,i+1).reduce((s,v)=>s+v,0)),medianAvg:median(teams.map(t=>t.avg)),badBeats:badBeats.sort((a,b)=>a.rank-b.rank||b.score-a.score)};
}
export function fitsSlot(positions,slot){const rules={FLEX:['RB','WR','TE'],SUPER_FLEX:['QB','RB','WR','TE'],WRRB_FLEX:['WR','RB'],REC_FLEX:['WR','TE'],IDP_FLEX:['DL','LB','DB']};return positions.some(p=>(rules[slot]??[slot]).includes(p));}
export function benchRegrets(league){
  const rows=[];
  for(const lineup of league.lineups??[]){
    if(lineup.status!=='complete')continue;
    let best=null;
    for(const bench of lineup.bench){const player=league.playerInfo?.[bench.id];if(!player)continue;
      for(const started of lineup.starters){if(!fitsSlot(player.positions,started.slot))continue;const gain=bench.points-started.points;if(gain<=0||best&&gain<=best.gain)continue;best={teamId:lineup.teamId,week:lineup.week,gain,benchId:bench.id,starterId:started.id,benchPoints:bench.points,starterPoints:started.points,slot:started.slot};}
    }
    if(best){const score=league.scores[best.week][best.teamId],opponent=league.opponents[best.week][best.teamId],against=league.scores[best.week][opponent];rows.push({...best,score,against,opponent,scorelineFlip:score<=against&&score+best.gain>against});}
  }
  return rows.sort((a,b)=>b.gain-a.gain||a.week-b.week);
}
