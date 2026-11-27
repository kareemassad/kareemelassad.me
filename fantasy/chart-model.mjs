import {seasonInsights} from './insights.mjs?v=9a469b449e9e';
import {manager} from './identity.mjs?v=9a469b449e9e';
import {scheduleLuckBreakdown} from './luck-model.mjs?v=9a469b449e9e';

export function chartPreset(league,preset){
  if(preset==='everyone')return {type:'trend',primary:'everyone',comparison:'none',mode:'weekly'};
  const teams=[...league.teams].sort((a,b)=>preset==='luck'?b.luck-a.luck||manager(a).localeCompare(manager(b)):b.pf-a.pf||manager(a).localeCompare(manager(b)));
  return {type:preset==='luck'?'luck':'trend',primary:String(teams[0].id),comparison:String((preset==='luck'?teams.at(-1):teams[1]).id),mode:'weekly'};
}
export function chartStories(league,model){
  const ids=model.series.filter(s=>s.key.startsWith('team')).map(s=>Number(s.key.slice(4))),rows=[];
  for(const id of ids)for(const week of scheduleLuckBreakdown(league,id).weeks){
    const average=league.ids.reduce((n,i)=>n+league.scores[week.week][i],0)/league.ids.length;
    rows.push({...week,teamId:id,name:manager(league.byId[id]),opponentName:manager(league.byId[week.opponent]),importance:Math.abs(model.type==='luck'?week.difference:(week.score-average)/100)});
  }
  const seen=new Set();
  return rows.sort((a,b)=>b.importance-a.importance||b.week-a.week||a.teamId-b.teamId).filter(row=>{const key=row.week+':'+[row.teamId,row.opponent].sort((a,b)=>a-b).join(':');if(row.importance<1e-9||seen.has(key))return false;seen.add(key);return true;}).slice(0,3);
}

export const CHARTS=[
  {id:'trend',group:'trends',label:'Scoring over time'},
  {id:'luck',group:'trends',label:'Schedule luck over time'},
];
// Retired chart links open scoring trends.
export const normalizeChartType=value=>value==='luck'?'luck':'trend';
const palette=['#216c50','#bf6633','#3e77a5','#8560a6','#ad5472','#268d91','#8a7629','#526ab8','#81715f','#497c32'];
export function makeChartModel(league,state={}){
  const type=normalizeChartType(state.type),mode=['weekly','rolling','cumulative'].includes(state.mode)?state.mode:'weekly';
  const group='trends',compact=!!state.compact,stats=seasonInsights(league);
  const everyone=state.primary==='everyone';
  const color=id=>palette[Math.max(0,league.ids.indexOf(Number(id)))%palette.length];
  let primary=league.byId[Number(state.primary)]?Number(state.primary):null;
  let comparison=league.byId[Number(state.comparison)]?Number(state.comparison):null;
  if(type==='luck'&&primary===null&&!everyone&&state.primary!=='baseline'){
    const sorted=[...stats.teams].sort((a,b)=>b.luck-a.luck);
    if(Math.abs(sorted[0].luck-sorted.at(-1).luck)>1e-9){primary=sorted[0].id;comparison=sorted.at(-1).id;}
  }
  if(primary===null||comparison===primary)comparison=null;
  const selected=everyone?stats.teams:[primary,comparison].filter(id=>id!==null).map(id=>stats.teams.find(t=>t.id===id));
  const hidden=everyone?[...new Set((state.hidden||[]).map(Number).filter(id=>league.ids.includes(id)))].sort((a,b)=>a-b):[];
  const model={type,group,mode,primary:everyone?'everyone':primary===null?'baseline':primary,comparison,everyone,hidden,kind:'line',rows:[],series:[],compact,touch:!!state.touch,focus:primary,unit:'pts',title:'',subtitle:'',detail:'',note:'',axisLabel:'Fantasy points'};

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
  model.height=everyone?(compact?370:430):(compact?310:360);
  model.detail=luck?'Above zero = more wins than expected from your weekly scores. Below zero = fewer. Expected wins comes from comparing the same week’s score against every other manager; open Schedule luck for the full calculation.':mode==='rolling'?'Each point averages the most recent three available weeks. The first two points use the available one or two weeks.':mode==='cumulative'?'Each point includes all points scored through that week. The league average uses every team.':'Each point is one finalized week. Hover, tap, or use the arrow keys for the exact scores.';
  return model;
}
