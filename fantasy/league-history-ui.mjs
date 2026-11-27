import {API_BASE} from './config.mjs?v=9a469b449e9e';
import {buildLeagueHistory,headToHead} from './league-history.mjs?v=9a469b449e9e';
import {esc} from './identity.mjs?v=9a469b449e9e';
import {recordText} from './engine.mjs?v=9a469b449e9e';

export function mountLeagueHistory(getArchives,currentSeason){
  const $=id=>document.getElementById(id),points=n=>(n/100).toFixed(2);
  const signed=n=>Math.abs(n)<1e-9?'0.00':`${n>0?'+':'−'}${Math.abs(n).toFixed(2)}`;
  let displayedModel=null;
  let current=null,visible=false,loading=false,error='',scope='all',person=null,opponent=null,sort='rate',luckMode='total',view='records',participation='all';
  function readHash(){
    if(!location.hash.startsWith('#history'))return;
    const p=new URLSearchParams(location.hash.split('?')[1]||'');scope=p.get('years')||'all';person=p.get('manager');opponent=p.get('opponent');
    luckMode=p.get('luck')==='per14'?'per14':'total';participation=p.get('participation')==='full'?'full':'all';sort=['rate','wins','strength','luck'].includes(p.get('sort'))?p.get('sort'):'rate';
    view=['records','luck','headtohead'].includes(p.get('view'))?p.get('view'):p.has('opponent')?'headtohead':'records';
    if(view==='headtohead'&&!opponent)person=null;
    render();
  }
  function shareState(){const p=new URLSearchParams({view,years:scope,sort});if(person)p.set('manager',person);if(opponent&&view==='headtohead')p.set('opponent',opponent);if(luckMode==='per14')p.set('luck',luckMode);if(participation==='full')p.set('participation','full');history.replaceState(null,'','#history?'+p);}
  function renderLuck(model){
    const value=p=>luckMode==='per14'?p.luckPer14:p.luck;
    $('history-luck-participation').value=participation;$('history-luck-mode').value=luckMode;
    const ranked=model.managers.filter(p=>participation!=='full'||p.seasons.length===model.seasons.length).sort((a,b)=>Math.abs(value(b)-value(a))<1e-9?a.name.localeCompare(b.name):value(b)-value(a));
    if(!ranked.length){$('history-luck-leaders').textContent='No manager played every selected season.';$('history-luck-ranking').innerHTML='';return;}
    const high=value(ranked[0]),low=value(ranked.at(-1)),unit=luckMode==='per14'?'wins per 14 games':'wins',scale=Math.max(1,...ranked.map(p=>Math.abs(value(p))));
    $('history-luck-participation').value=participation;
    $('history-luck-mode').value=luckMode;$('history-luck-unit').textContent=luckMode==='per14'?'Wins / 14 games':'Extra wins';
    const namesAt=n=>ranked.filter(p=>Math.abs(value(p)-n)<1e-9).map(p=>p.name).join(', ');
    $('history-luck-leaders').textContent=Math.abs(high-low)<1e-9?'Everyone is level: actual wins match expected wins.':`Most above expected: ${namesAt(high)} (${signed(high)} ${unit}). Most below expected: ${namesAt(low)} (${signed(low)} ${unit}).`;
    $('history-luck-ranking').innerHTML=ranked.map(p=>{const v=value(p),width=Math.abs(v)/scale*48;return `<li data-manager="${esc(p.id)}"${p.id===person?' class="selected"':''}><button class="history-person" data-person="${esc(p.id)}" aria-label="View ${esc(p.name)}’s season luck calculations"><strong>${esc(p.name)}</strong><small>${p.games} games · ${p.seasons.length} ${p.seasons.length===1?'season':'seasons'}</small></button><span class="history-luck-track" aria-hidden="true"><i class="${v<0?'below':'above'}" style="left:${v<0?50-width:50}%;width:${width}%"></i></span><span class="history-luck-value"><strong>${signed(v)}</strong></span><small class="history-luck-calculation">${luckMode==='per14'?`Total ${signed(p.luck)} wins`:`${p.actualWins} actual − ${p.expected.toFixed(2)} expected`}</small></li>`;}).join('');
  }
  function render(){
    if(!visible)return;
    const archives=Object.values(getArchives()),ready=!!current;
    $('history-archive-error').hidden=archives.length>=2||!ready;
    $('history-loading').hidden=!!ready;
    $('history-loading').textContent=error&&!current?'Current results could not be loaded. Select Retry.':'Loading current results…';
    $('history-content').hidden=!ready;
    $('history-error').hidden=!error||!current;$('history-error').textContent=error;
    $('history-retry').hidden=!error;
    $('history-retry').disabled=loading;
    for(const panel of document.querySelectorAll('[data-history-panel]'))panel.hidden=panel.dataset.historyPanel!==view;
    for(const button of document.querySelectorAll('[data-history-view]'))button.setAttribute('aria-pressed',String(button.dataset.historyView===view));
    if(!ready)return;
    const currentStatus=current.seasonComplete?'Complete regular season':'In progress';
    const reports=[...archives,current];const years=reports.map(r=>String(r.season)).sort().reverse();
    if(scope!=='all'&&!years.includes(scope))scope='all';
    $('history-scope').innerHTML='<option value="all">All seasons</option>'+years.map(y=>`<option value="${y}">${y}${y===String(currentSeason)?' · '+currentStatus:''}</option>`).join('');$('history-scope').value=scope;
    const model=buildLeagueHistory(reports.filter(r=>scope==='all'||String(r.season)===scope));
    if(!model.byId[person]||(view==='headtohead'&&(!model.byId[opponent]||opponent===person)))person=null;
    if(view!=='headtohead'&&participation==='full'&&model.byId[person]?.seasons.length!==model.seasons.length)person=null;
    renderLuck(model);
    const names=[...model.managers].sort((a,b)=>a.name.localeCompare(b.name));
    const latest=current.weeks.at(-1).week;
    $('history-coverage').textContent=`${model.seasons.map(s=>s.season).join(', ')} · ${model.managers.length} people${participation==='full'&&view!=='headtohead'?' ('+model.managers.filter(p=>p.seasons.length===model.seasons.length).length+' in ranking)':''} · ${model.games.length} games`;
    const updated=new Date(current.updatedAt);
    const timestamp=current.updatedAt&&Number.isFinite(updated.getTime())?new Intl.DateTimeFormat('en-CA',{
      timeZone:'America/Toronto',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'
    }).format(updated):'';
    $('history-current').hidden=scope!=='all'&&scope!==String(currentSeason);
    $('history-current').textContent=`${currentSeason} ${current.seasonComplete?'complete regular season':'in progress'}: through Week ${latest}.${timestamp?' Updated '+timestamp+'.':''}`;
    const year=scope==='all'?String(currentSeason):scope;
    $('history-weekly-luck').href=`?season=${year}#luck`;$('history-weekly-luck').textContent=`View ${year} luck ranking →`;
    displayedModel=model;
    renderDetail(model);
    $('history-participation').value=participation;$('history-sort').value=sort;
    const ranked=model.managers.filter(p=>participation!=='full'||p.seasons.length===model.seasons.length).sort(sort==='wins'?(a,b)=>b.w-a.w||b.winRate-a.winRate:sort==='strength'?(a,b)=>b.expected/b.games-a.expected/a.games:sort==='luck'?(a,b)=>b.luckPer14-a.luckPer14:(a,b)=>b.winRate-a.winRate||b.w-a.w||b.average-a.average);
    $('history-standings').innerHTML=ranked.map(p=>`<tr${p.id===person?' class="selected"':''}><th scope="row"><button class="history-person" data-person="${esc(p.id)}" aria-label="View ${esc(p.name)} by season"><strong>${esc(p.name)}</strong><small>${recordText(p)} · ${p.games} games · ${p.seasons.length} ${p.seasons.length===1?'season':'seasons'}</small></button></th><td>${(p.winRate*100).toFixed(1)}%</td><td>${(p.expected/p.games*100).toFixed(1)}%</td><td>${signed(p.luckPer14)}</td></tr>`).join('')||'<tr><td colspan="4">No manager played every selected season.</td></tr>';
    const unbeaten=[],close=[];
    const expanded=new Set(Array.from($('history-matrix').querySelectorAll('[aria-expanded=true]'),button=>button.dataset.row));
    const rows=names.map((p,index)=>{
      const cells=names.map((q,column)=>{
        if(p.id===q.id)return '<td class="self-record">—</td>';
        const r=headToHead(model,p.id,q.id);
        if(!r.w&&r.l)unbeaten.push({p,q,r});
        if(column>index&&r.w&&r.l){
          const margin=r.meetings.reduce((sum,g)=>sum+Math.abs(g.score-g.against),0)/r.meetings.length;
          close.push({p,q,r,margin,balance:Math.abs(r.w-r.l)/r.meetings.length});
        }
        const label=esc(q.name);
        return `<td data-label="vs ${label}">${r.meetings.length?`<button class="${r.w>r.l?'winning':r.w<r.l?'losing':'level'}" data-person="${esc(p.id)}" data-opponent="${esc(q.id)}" aria-label="${esc(p.name)} vs ${label}: ${recordText(r)}">${recordText(r)}</button>`:'<span title="No meetings">—</span>'}</td>`;
      }).join('');
      return `<tr class="${expanded.has(p.id)?'expanded':''}"><th scope="row"><span>${esc(p.name)}</span><button class="row-toggle" data-row="${esc(p.id)}" aria-expanded="${expanded.has(p.id)}"><strong>${esc(p.name)}</strong><span>Opponents ▾</span></button></th>${cells}</tr>`;
    });
    $('history-matrix').innerHTML=`<thead><tr><th>Manager</th>${names.map(p=>`<th scope="col">${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody>`;
    unbeaten.sort((a,b)=>b.r.l-a.r.l||b.r.meetings.length-a.r.meetings.length);
    close.sort((a,b)=>a.balance-b.balance||a.margin-b.margin);
    function highlights(title,pairs,describe,empty,winless=false){
      const rows=pairs.map(pair=>`<button data-person="${esc(pair.p.id)}" data-opponent="${esc(pair.q.id)}"><span>${esc(pair.p.name)} ${winless?'has never beaten':'vs'} ${esc(pair.q.name)}<small>${describe(pair)}</small></span><b>${recordText(pair.r)}</b></button>`);
      const more=rows.length>3?`<details><summary>Show ${rows.length-3} more</summary>${rows.slice(3).join('')}</details>`:'';
      return `<section><h3>${title}</h3>${rows.slice(0,3).join('')||`<p>${empty}</p>`}${more}</section>`;
    }
    $('rivalry-highlights').innerHTML=highlights('Still winless',unbeaten,({r})=>`${r.meetings.length} ${r.meetings.length===1?'meeting':'meetings'}`,'No winless series.',true)+
      highlights('Closest rivalries',close,({margin})=>`${points(Math.round(margin))} pts average margin`,'No series with wins on both sides.');
  }
  let opener=null;
  const dialog=$('history-detail');
  function renderDetail(model){
    const a=model.byId[person];
    if(!a){
      if(dialog.open)dialog.close();
      return;
    }
    const isPair=view==='headtohead';
    $('history-meetings').hidden=!isPair;
    $('history-seasons').hidden=isPair;
    if(isPair){
      const b=model.byId[opponent],pair=headToHead(model,person,opponent);
      $('history-detail-title').textContent=`${a.name} vs ${b.name} · ${pair.meetings.length?recordText(pair):'No meetings'}`;
      $('history-meetings').innerHTML=pair.meetings.length?`<div class="table-scroll"><table class="history-games"><thead><tr><th>Season / week</th><th>${esc(a.name)}</th><th>Score</th><th>${esc(b.name)}</th><th>Result</th></tr></thead><tbody>${[...pair.meetings].reverse().map(g=>`<tr><td>${g.season}<small>Week ${g.week}</small></td><td>${esc(g.team)}</td><td class="history-numeric">${points(g.score)}<small>vs ${points(g.against)}</small></td><td>${esc(g.opponentTeam)}</td><td><span class="result-pill ${g.score<g.against?'loss':''}">${g.score>g.against?'W':g.score<g.against?'L':'T'}</span></td></tr>`).join('')}</tbody></table></div>`:'<p class="history-empty">These managers did not meet in the selected seasons.</p>';
    }else{
      const currentStatus=current.seasonComplete?'Complete regular season':'In progress';
      $('history-detail-title').textContent=a.name+' by season';
      const openYears=new Set(dialog.open&&dialog.dataset.person===person?
        Array.from($('history-seasons').querySelectorAll('details[open]'),row=>row.dataset.season):[]);
      $('history-seasons').innerHTML=[...a.seasons].reverse().map(s=>`<details class="history-season-detail" data-season="${s.season}" ${openYears.has(String(s.season))?'open':''}><summary><b>${s.season}</b><span>${recordText(s)}</span><small>${signed(s.luck)} luck wins</small><svg class="season-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><article class="history-season"><div><strong>${s.season}</strong><small>${s.season===String(currentSeason)?currentStatus:'Complete regular season'}</small></div><div class="history-team"><b>${esc(s.teamName)}</b>${s.displayName?`<small>Sleeper name: ${esc(s.displayName)}</small>`:''}<small>${s.username?'Account username: @'+esc(s.username):'Account username unavailable'}</small></div><strong class="history-season-record">${recordText(s)}</strong><dl><div><dt>Games</dt><dd>${s.games}</dd></div><div><dt>All-play win %</dt><dd>${(s.expected/s.games*100).toFixed(1)}%</dd></div><div><dt>Points scored</dt><dd>${points(s.pointsFor)}</dd></div><div><dt>Points / game</dt><dd>${points(s.pointsFor/s.games)}</dd></div><div><dt>Points allowed</dt><dd>${points(s.pointsAgainst)}</dd></div></dl><p class="history-season-luck">Schedule luck: ${s.w+s.t*.5} actual − ${s.expected.toFixed(2)} expected = <strong>${signed(s.luck)} wins</strong></p></article></details>`).join('');
    }
    dialog.dataset.person=person;
    if(!dialog.open)dialog.showModal();
  }
  function dismiss(){
    person=null;opponent=null;
    dialog.close();shareState();
    const panel=document.querySelector('[data-history-panel]:not([hidden])');
    const restore=opener?.isConnected?opener:panel?.querySelector('button[data-person="'+CSS.escape(dialog.dataset.person)+'"]');
    restore?.focus();opener=null;
  }
  $('close-history-detail').addEventListener('click',dismiss);
  dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss();});
  async function refresh(){
    if(loading)return;loading=true;render();
    try{const response=await fetch(API_BASE+'/api/league',{cache:'no-store'});if(!response.ok)throw new Error();const data=await response.json();if(data.season!==String(currentSeason)||!data.weeks?.length||!data.teams?.length)throw new Error();buildLeagueHistory([data]);current=data;error='';}
    catch{error=current?`Could not refresh current results. Keeping ${currentSeason} through Week ${current.weeks.at(-1).week}.`:'Current results could not be loaded.';}
    finally{loading=false;render();}
  }
  $('history-retry').addEventListener('click',refresh);
  $('history-views').addEventListener('click',e=>{const button=e.target.closest('[data-history-view]');if(button){view=button.dataset.historyView;person=null;opponent=null;render();shareState();}});
  for(const [id,update] of [['history-scope',v=>scope=v],['history-sort',v=>sort=v],['history-luck-mode',v=>luckMode=v],['history-participation',v=>participation=v],['history-luck-participation',v=>participation=v]])$(id).addEventListener('change',e=>{update(e.target.value);render();shareState();});
  $('history-content').addEventListener('click',event=>{
    const button=event.target.closest('button[data-person]');
    if(!button)return;
    opener=button;person=button.dataset.person;opponent=button.dataset.opponent||null;
    shareState();renderDetail(displayedModel);
  });
  return {render,refresh,readHash,setCurrent(data){buildLeagueHistory([data]);current=data;error='';render();},setVisible(value){visible=value;if(value){readHash();refresh();}else if(dialog.open)dialog.close();}};
}
