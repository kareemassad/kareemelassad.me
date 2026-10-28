import {seasonInsights,benchRegrets,mean} from './insights.mjs?v=dac01f61efdc';
import {perfectStandings} from './best-lineups.mjs?v=dac01f61efdc';
import {manager,fullName} from './identity.mjs?v=dac01f61efdc';

export const CHARTS=[
  {id:'pointsleft',group:'rankings',label:'Points set on fire'},
  {id:'points',group:'rankings',label:'Total points scored'},
  {id:'momentum',group:'rankings',label:'Who’s cooking?'},
  {id:'badbeats',group:'rankings',label:'Robbery victims'},
  {id:'bench',group:'rankings',label:'Bench hall of shame'},
  {id:'trend',group:'trends',label:'Scoring over time'},
  {id:'luck',group:'trends',label:'Schedule luck over time'},
];
export const normalizeChartType=value=>value==='scatter'?'points':CHARTS.some(c=>c.id===value)?value:'pointsleft';
const palette=['#216c50','#bf6633','#3e77a5','#8560a6','#ad5472','#268d91','#8a7629','#526ab8','#81715f','#497c32'];
const n=(v,d=1)=>Number(v).toFixed(d);
const hindsight='Hindsight only. Current position eligibility and recorded reserves are included; historical IR and lineup-lock restrictions are not reconstructed.';

export function makeChartModel(league,state={}){
  const type=normalizeChartType(state.type),mode=['weekly','rolling','cumulative'].includes(state.mode)?state.mode:'weekly';
  const group=CHARTS.find(c=>c.id===type).group,line=group==='trends',compact=!!state.compact,stats=seasonInsights(league);
  const everyone=line&&state.primary==='everyone';
  const color=id=>palette[Math.max(0,league.ids.indexOf(Number(id)))%palette.length];
  let primary=league.byId[Number(state.primary)]?Number(state.primary):null;
  let comparison=league.byId[Number(state.comparison)]?Number(state.comparison):null;
  if(type==='luck'&&primary===null&&!everyone&&state.primary!=='baseline'){
    const sorted=[...stats.teams].sort((a,b)=>b.luck-a.luck);
    if(Math.abs(sorted[0].luck-sorted.at(-1).luck)>1e-9){primary=sorted[0].id;comparison=sorted.at(-1).id;}
  }
  if(primary===null||comparison===primary)comparison=null;
  const selected=line?(everyone?stats.teams:[primary,comparison].filter(id=>id!==null).map(id=>stats.teams.find(t=>t.id===id))):stats.teams.filter(t=>primary===null||t.id===primary);
  const hidden=everyone?[...new Set((state.hidden||[]).map(Number).filter(id=>league.ids.includes(id)))].sort((a,b)=>a-b):[];
  const model={type,group,mode,primary:everyone?'everyone':line&&primary===null?'baseline':primary,comparison:line?comparison:null,everyone,hidden,kind:line?'line':'bars',rows:[],series:[],compact,touch:!!state.touch,focus:primary,unit:'pts',title:'',subtitle:'',detail:'',note:'',axisLabel:'Fantasy points'};

  if(line){
    const luck=type==='luck',key=luck?'luckTrail':mode==='rolling'?'rolling':mode==='cumulative'?'cumulativePoints':'points';
    const baseline=luck?Array(league.weeksPlayed).fill(0):mode==='rolling'?stats.rollingMeans:mode==='cumulative'?stats.cumulativeMeans:stats.weeklyMeans;
    model.unit=luck?'wins':'pts';
    model.axisLabel=luck?'Wins above / below expected':mode==='rolling'?'Points per week':mode==='cumulative'?'Total fantasy points':'Weekly fantasy points';
    model.title=luck?'Schedule luck':mode==='rolling'?'Three-week scoring':mode==='cumulative'?'Season points':'Weekly scoring';
    model.subtitle=selected.length?`${selected.map(t=>manager(t)).join(' vs ')}${luck?'':' · dashed line = league average'}`:'The league average. Choose a manager to compare, then add a second if you want.';
    model.series=[{key:'baseline',name:luck?'Zero difference':'League average',color:selected.length?'#91a18a':'#216c50',baseline:selected.length>0},...selected.map(t=>({key:'team'+t.id,name:manager(t),teamName:t.name,color:color(t.id)}))];
    model.legendSeries=model.series;
    if(everyone){model.series=model.series.filter(s=>s.key==='baseline'||!hidden.includes(Number(s.key.slice(4))));model.subtitle=`${league.ids.length-hidden.length} of ${league.ids.length} managers shown. Select names in the legend to hide or show lines.`;}
    model.rows=league.weeks.map(({week},i)=>({week,baseline:baseline[i],...Object.fromEntries(selected.map(t=>['team'+t.id,t[key][i]]))}));
    model.domain=!luck&&mode==='cumulative'?[0,'auto']:['auto','auto'];
    model.height=everyone?(compact?370:430):(compact?345:390);
    model.detail=luck?'Above zero = more wins than expected from your weekly scores. Below zero = fewer. Expected wins comes from comparing the same week’s score against every other manager; open Schedule luck for the full calculation.':mode==='rolling'?'Each point averages the most recent three available weeks. The first two points use the available one or two weeks.':mode==='cumulative'?'Each point includes all points scored through that week. The league average uses every team.':'Each point is one finalized week. Hover, tap, or use the arrow keys for the exact scores.';
  }else if(type==='points'){
    model.title='Total points';model.subtitle='Season points, highest to lowest.';model.axisLabel='Total fantasy points';
    model.rows=selected.sort((a,b)=>b.pf-a.pf).map(t=>({label:manager(t),fullLabel:fullName(t),value:t.pf,detail:`${n(t.avg,2)} points per week`,shortDetail:`${n(t.avg)} points / week`,extra:`Actual record: ${t.actual.w}–${t.actual.l}${t.actual.t?'–'+t.actual.t:''}.`,color:color(t.id)}));
  }else if(type==='momentum'){
    model.title='Who’s cooking?';model.subtitle='Change in scoring average: latest three weeks versus first three weeks.';model.axisLabel='Change in points per week';model.unit='pts / week';model.signed=true;
    model.rows=selected.filter(t=>t.momentum!==null).sort((a,b)=>b.momentum-a.momentum).map(t=>({label:manager(t),fullLabel:fullName(t),value:t.momentum,detail:`First three weeks: ${n(mean(t.points.slice(0,3)),2)} → latest three: ${n(mean(t.points.slice(-3)),2)} points per week`,shortDetail:`${n(mean(t.points.slice(0,3)))} → ${n(mean(t.points.slice(-3)))} pts / week`,extra:t.momentum>=0?'Scoring more in the latest three weeks.':'Scoring less in the latest three weeks.',color:t.momentum>=0?'#619575':'#c58c70'}));
    model.detail='Green = scoring more. Brown = scoring less. The two three-week windows do not overlap.';
    if(!model.rows.length)model.empty='At least six completed weeks are needed for this comparison.';
  }else if(type==='pointsleft'){
    const sim=perfectStandings(league);model.title='Points set on fire';model.subtitle='Points missed across the whole season by starting a lower-scoring lineup.';model.axisLabel='Points left unused';
    model.rows=sim.teams.filter(t=>primary===null||t.id===primary).sort((a,b)=>b.pointsLeft-a.pointsLeft).map(t=>({label:manager(t),fullLabel:fullName(t),value:t.pointsLeft/100,detail:`Started ${n(t.pf,2)} of ${n(t.optimalPoints/100,2)} possible points`,shortDetail:t.capture===null?'':`${n(t.capture)}% ${compact?'started':'of possible points started'}`,extra:`${t.recoverableLosses} ${t.recoverableLosses===1?'win fumbled':'wins fumbled'}: their own best lineup would beat the opponent’s actual score.`,color:color(t.id)}));
    model.detail='Every position and FLEX slot is optimized together. Open Lineup crimes for the records and exact players.';model.note=hindsight;
    if(!sim.complete)model.empty='Complete historical lineups are required for every manager.';
  }else if(type==='bench'){
    const rows=benchRegrets(league).filter(r=>primary===null||r.teamId===primary).slice(0,8);
    model.title='Bench hall of shame';model.subtitle='The eight biggest single-player upgrades left unused.';model.axisLabel='Extra points from one swap';
    model.rows=rows.map(r=>({label:league.playerInfo[r.benchId].name,fullLabel:league.playerInfo[r.benchId].name,value:r.gain/100,detail:`${fullName(league.byId[r.teamId])} · Week ${r.week}`,shortDetail:`${manager(league.byId[r.teamId])} · Week ${r.week}`,extra:`${n(r.benchPoints/100,2)} points instead of ${r.starterId?league.playerInfo[r.starterId]?.name??'the recorded starter':'an empty slot'} (${n(r.starterPoints/100,2)}).${r.scorelineFlip?' This would turn the actual loss or tie into a win.':''}`,color:'#639873'}));
    model.detail='Only the best single swap per manager-week is included. The tooltip notes when a swap would have turned the actual loss or tie into a win.';model.note=hindsight;
    if(!rows.length)model.empty='No positive eligible single-player upgrades in this selection.';
  }else if(type==='badbeats'){
    model.title='Robbery victims';model.subtitle='Strong weekly scores that still lost. Each bar is one matchup.';model.axisLabel='Points scored in the loss';
    model.rows=stats.badBeats.filter(r=>primary===null||r.teamId===primary).sort((a,b)=>b.score-a.score||a.week-b.week).slice(0,8).map(r=>({label:manager(league.byId[r.teamId]),fullLabel:fullName(league.byId[r.teamId]),value:r.score,detail:`Week ${r.week} · lost by ${n(r.margin,2)} points`,shortDetail:`Week ${r.week} · lost by ${n(r.margin,2)}`,extra:`Lost ${n(r.score,2)}–${n(r.against,2)} to ${fullName(league.byId[r.opponent])}.`,color:color(r.teamId)}));
    model.detail='Only losses with a score above that week’s league median are included. The highest-scoring losses appear first.';
    if(!model.rows.length)model.empty='No above-median scores lost a matchup in this selection.';
  }
  if(!line)model.height=Math.max(240,model.rows.length*(compact?59:54)+80);
  return model;
}
