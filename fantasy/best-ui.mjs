import {perfectStandings} from './best-lineups.mjs?v=9a469b449e9e';
import {recordText} from './engine.mjs?v=9a469b449e9e';
import {esc,manager} from './identity.mjs?v=9a469b449e9e';

const points=cents=>(cents/100).toFixed(2);
const outcome=value=>value>0?'Win':value<0?'Loss':'Tie';

const signed=value=>value>0?'+'+value:value<0?'−'+Math.abs(value):'0';
const wins=record=>record.w+record.t/2;
const changeClass=value=>value>0?'gain':value<0?'loss':'even';

function playerChanges(lineup,league,name){
  const slots=lineup.assignments;
  const before=new Set(slots.map(p=>p.originalId)),after=new Set(slots.map(p=>p.id));
  const out=slots.filter(p=>p.originalId&&!after.has(p.originalId));
  const added=slots.filter(p=>p.id&&!before.has(p.id));
  if(!out.length&&!added.length)return '';
  function list(players,id,score){
    return players.map(p=>`<li><span>${esc(league.playerInfo?.[p[id]]?.name||'Recorded player')}</span><b>${points(p[score])}</b></li>`).join('')||'<li>Empty slot</li>';
  }
  return `<section class="lineup-swaps"><h4>${esc(name)} · ${lineup.gain?'+'+points(lineup.gain):'0.00'} pts</h4>
    <div><section><h5>Out</h5><ul>${list(out,'originalId','originalPoints')}</ul></section>
    <section><h5>In</h5><ul>${list(added,'id','points')}</ul></section></div></section>`;
}

export function mountBestLineups(getLeague,toast){
  const $=id=>document.getElementById(id);
  let previousFocus=null,selectedId=null;
  const bothBest=()=>$('lineup-opponents').value==='best';
  const replayRecord=team=>bothBest()?team.perfect:team.ownOnly;
  function shareState(week){
    const params=new URLSearchParams();
    if(selectedId!==null)params.set('team',selectedId);
    if(week)params.set('week',week);
    if(bothBest())params.set('opponents','best');
    history.replaceState(null,'',params.size?'#best?'+params:'#best');
  }
  function render(){
    const league=getLeague(),data=perfectStandings(league);
    $('best-empty').hidden=data.complete;
    $('save-best').hidden=!data.complete;
    $('lineup-opponents-label').hidden=!data.complete;
    $('best-table').parentElement.hidden=!data.complete;
    if(!data.complete){
      $('best-empty').textContent=league.archived?'Player lineups are not included in this archive.':'Waiting for verified player scores for every team.';
      $('best-table').innerHTML='';
      return;
    }
    const rows=data.teams.map(team=>{
      const replay=replayRecord(team);
      return {team,replay,delta:wins(replay)-wins(team.actual)};
    }).sort((a,b)=>b.delta-a.delta||wins(b.team.actual)-wins(a.team.actual)||manager(a.team).localeCompare(manager(b.team)));
    $('best-table').innerHTML=`<thead><tr><th>Manager</th><th>Actual record</th><th>Best lineup record</th><th title="Change in wins. A tie counts as half a win.">+/− wins</th></tr></thead>
      <tbody>${rows.map(({team,replay,delta})=>`<tr data-team-id="${team.id}"><th scope="row"><button data-best-team="${team.id}" aria-haspopup="dialog">${esc(manager(team))}</button></th><td>${recordText(team.actual)}</td><td>${recordText(replay)}</td><td><b class="win-delta ${changeClass(delta)}">${signed(delta)}</b></td></tr>`).join('')}</tbody>`;
  }
  function inspect(id,week){
    const league=getLeague(),data=perfectStandings(league),team=data.teams.find(t=>t.id===Number(id));
    const dialog=$('best-dialog');
    if(!team){selectedId=null;if(dialog.open)dialog.close();return;}
    $('lineup-replay-label').textContent=bothBest()?'Opponents · Best lineups':'Opponents · Actual lineups';
    if(!dialog.open)previousFocus=$('best-table').querySelector(`[data-best-team="${team.id}"]`);
    selectedId=team.id;
    const replay=replayRecord(team),net=wins(replay)-wins(team.actual);
    const changed=[],unchanged=[];
    for(const w of team.weeks){
      const result=bothBest()?w.perfectResult:w.ownOnlyResult;
      const delta=(result-w.actualResult)/2;
      const opponent=manager(league.byId[w.opponent]),against=bothBest()?w.optimalAgainst:w.actualAgainst;
      const score=(a,b)=>points(a)+'–'+points(b);
      const swaps=playerChanges(data.byWeek[w.week][team.id],league,manager(team))+
        (bothBest()?playerChanges(data.byWeek[w.week][w.opponent],league,opponent):'');
      const entry=`<details class="lineup-week" data-week="${w.week}" name="lineup-game"><summary>
        <span class="week-results"><b>Week ${w.week} · vs ${esc(opponent)}</b>
        <span>Actual · ${outcome(w.actualResult)} ${score(w.actualFor,w.actualAgainst)}</span>
        <span>Replay · ${outcome(result)} ${score(w.optimalFor,against)}</span></span>
        <b class="win-delta ${changeClass(delta)}">${signed(delta)}</b></summary>
        ${swaps||'<p>Same starters.</p>'}</details>`;
      (delta?changed:unchanged).push(entry);
    }
    $('best-dialog-content').innerHTML=`<h2 id="lineup-manager">${esc(manager(team))}</h2>
      <div class="lineup-records"><span>Actual <b>${recordText(team.actual)}</b></span><span>Best lineup <b>${recordText(replay)}</b></span><span>+/− wins <b class="win-delta ${changeClass(net)}">${signed(net)}</b></span></div>
      <h3>Changed results</h3><div class="changed-weeks">${changed.join('')||'<p>No result changed.</p>'}</div>
      ${unchanged.length?`<details class="unchanged-weeks"><summary>Unchanged results (${unchanged.length})</summary>${unchanged.join('')}</details>`:''}`;
    const detail=$('best-dialog-content').querySelector(`[data-week="${Number(week)}"]`);
    if(detail){
      const group=detail.closest('.unchanged-weeks');
      if(group)group.open=true;
      detail.open=true;
    }
    if(!dialog.open)dialog.showModal();
    if(detail)detail.scrollIntoView({block:'nearest'});else dialog.scrollTop=0;
    shareState(detail?.dataset.week);
  }
  function close(){
    $('best-dialog').close();
    selectedId=null;shareState();
    previousFocus?.focus();
  }
  $('best-table').addEventListener('click',event=>{
    const row=event.target.closest('[data-team-id]');
    if(row)inspect(row.dataset.teamId);
  });
  $('lineup-opponents').addEventListener('change',()=>{render();shareState();});
  $('best-dialog-content').addEventListener('toggle',event=>{
    if(!$('best-dialog').open||!event.target.matches('.lineup-week'))return;
    const week=$('best-dialog-content').querySelector('.lineup-week[open]')?.dataset.week;
    shareState(week);
  },true);
  $('save-best').addEventListener('click',async()=>{
    const league=getLeague();
    const rows=Array.from($('best-table').rows,row=>Array.from(row.cells,cell=>cell.innerText));
    if(rows.length<2)return;
    const canvas=document.createElement('canvas');
    canvas.width=1200;
    canvas.height=210+rows.length*66;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#f6f6ef';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#193e32';ctx.font='bold 42px sans-serif';ctx.fillText('Lineup records',40,62);
    ctx.font='24px sans-serif';ctx.fillText(`WG Fantasy · ${league.season} · Through Week ${league.weeks.at(-1).week}`,40,105);
    ctx.fillText('Opponents · '+(bothBest()?'Best lineups':'Actual lineups'),40,144);
    rows.forEach((row,index)=>{
      const y=184+index*66;
      ctx.fillStyle=index%2?'#ffffff':'#e9eee6';ctx.fillRect(32,y,1136,64);
      ctx.fillStyle='#193e32';ctx.font=index?'28px sans-serif':'bold 23px sans-serif';
      row.forEach((value,column)=>{ctx.textAlign=column?'right':'left';ctx.fillText(value,[48,610,930,1140][column],y+41);});
      ctx.textAlign='left';
    });
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob){toast('Could not save the lineup table.');return;}
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);link.download=`wg-lineup-records-${league.season}.png`;link.click();
    setTimeout(()=>URL.revokeObjectURL(link.href),5000);
  });
  $('close-best-dialog').addEventListener('click',close);
  $('best-dialog').addEventListener('cancel',event=>{event.preventDefault();close();});
  $('copy-best').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(location.href);toast('Lineup link copied.');}
    catch{toast('Copy the address-bar URL to share.');}
  });
  return {render,readHash(){
    const [view,query]=location.hash.split('?');
    const params=new URLSearchParams(query);
    if(view!=='#best'||!params.has('team')){
      selectedId=null;
      if($('best-dialog').open)$('best-dialog').close();
    }
    if(view!=='#best')return;
    const mode=params.get('opponents')==='best'?'best':'actual';
    if($('lineup-opponents').value!==mode){$('lineup-opponents').value=mode;render();}
    if(params.has('team'))inspect(params.get('team'),params.get('week'));
  }};
}
