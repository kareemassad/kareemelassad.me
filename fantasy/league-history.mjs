import {createLeague} from './engine.mjs?v=9a469b449e9e';

export function buildLeagueHistory(reports){
  const people=new Map(),games=[],seasons=[],seen=new Set();
  for(const report of [...reports].sort((a,b)=>Number(a.season)-Number(b.season))){
    const season=String(report.season);
    if(seen.has(season))throw new Error('A season cannot be counted twice.');seen.add(season);
    const ids=report.teams.map(t=>t.id),weeks=new Set();
    if(new Set(ids).size!==ids.length)throw new Error('Duplicate season roster.');
    for(const week of report.weeks){
      if(!Number.isInteger(week.week)||week.week<1||week.week>(report.regularSeasonEnd??14))throw new Error('Only regular-season weeks are included.');
      if(weeks.has(week.week))throw new Error('Duplicate season week.');weeks.add(week.week);
      const appearances=week.matchups.flatMap(m=>[m.home,m.away]);
      if(appearances.length!==ids.length||new Set(appearances).size!==ids.length||appearances.some(id=>!ids.includes(id)))throw new Error('Every roster must play exactly once per week.');
      if(week.matchups.some(m=>!Number.isFinite(m.homePoints)||!Number.isFinite(m.awayPoints)))throw new Error('A weekly score is missing.');
    }
    const league=createLeague(report),seasonPeople=new Set();
    for(const team of league.teams){
      if(seasonPeople.has(team.personId))throw new Error('One person owns multiple rosters in the same season.');seasonPeople.add(team.personId);
      const row=people.get(team.personId)||{id:team.personId,name:team.manager||team.username||team.name,usernames:[],seasons:[],w:0,l:0,t:0,pointsFor:0,pointsAgainst:0,expected:0};
      if(team.username&&!row.usernames.includes(team.username))row.usernames.push(team.username);
      row.w+=team.actual.w;row.l+=team.actual.l;row.t+=team.actual.t;row.pointsFor+=Math.round(team.pf*100);row.pointsAgainst+=Math.round(team.pa*100);row.expected+=team.expected;
      row.seasons.push({season,rosterId:team.id,teamName:team.name,username:team.username,displayName:team.displayName,ownerId:team.ownerId,...team.actual,games:league.weeksPlayed,pointsFor:Math.round(team.pf*100),pointsAgainst:Math.round(team.pa*100),expected:team.expected,luck:team.luck});
      people.set(team.personId,row);
    }
    for(const week of [...league.weeks].sort((a,b)=>a.week-b.week))for(const m of week.matchups){
      const home=league.byId[m.home],away=league.byId[m.away];
      games.push({season,week:week.week,home:home.personId,away:away.personId,homeName:home.manager||home.username||home.name,awayName:away.manager||away.username||away.name,homeTeam:home.name,awayTeam:away.name,homeScore:Math.round(m.homePoints*100),awayScore:Math.round(m.awayPoints*100)});
    }
    seasons.push({season,weeks:league.weeksPlayed,teams:league.teams.length,complete:!!league.seasonComplete,sourceDifferences:report.reconciliation?.differences.length||0});
  }
  const managers=[...people.values()].map(row=>{const played=row.w+row.l+row.t,actualWins=row.w+row.t*.5,luck=actualWins-row.expected;return {...row,games:played,winRate:played?actualWins/played:0,average:played?row.pointsFor/played:0,actualWins,luck,luckPer14:played?luck/played*14:0};});
  managers.sort((a,b)=>b.winRate-a.winRate||b.w-a.w||b.average-a.average||a.name.localeCompare(b.name));
  return {managers,byId:Object.fromEntries(managers.map(p=>[p.id,p])),games,seasons};
}
export function headToHead(history,person,opponent){
  const meetings=history.games.filter(g=>g.home===person&&g.away===opponent||g.home===opponent&&g.away===person).map(g=>{const home=g.home===person;return {...g,score:home?g.homeScore:g.awayScore,against:home?g.awayScore:g.homeScore,team:home?g.homeTeam:g.awayTeam,opponentTeam:home?g.awayTeam:g.homeTeam};});
  let w=0,l=0,t=0,pointsFor=0,pointsAgainst=0;
  for(const g of meetings){pointsFor+=g.score;pointsAgainst+=g.against;if(g.score>g.against)w++;else if(g.score<g.against)l++;else t++;}
  const closest=[...meetings].sort((a,b)=>Math.abs(a.score-a.against)-Math.abs(b.score-b.against)||Number(b.season)-Number(a.season)||b.week-a.week)[0]??null;
  const biggestWin=meetings.filter(g=>g.score>g.against).sort((a,b)=>(b.score-b.against)-(a.score-a.against))[0]??null;
  const closeGames=meetings.filter(g=>Math.abs(g.score-g.against)<=500);
  return {w,l,t,pointsFor,pointsAgainst,meetings,averageMargin:meetings.length?(pointsFor-pointsAgainst)/meetings.length:null,closest,biggestWin,closeRecord:{w:closeGames.filter(g=>g.score>g.against).length,l:closeGames.filter(g=>g.score<g.against).length,t:closeGames.filter(g=>g.score===g.against).length}};
}
