import {scheduleLuckBreakdown} from './luck-model.mjs?v=dac01f61efdc';
import {mobileLuckWeeks} from './mobile-views.mjs?v=dac01f61efdc';
import {esc,manager,teamIdentity} from './identity.mjs?v=dac01f61efdc';
const fixed=v=>Number(v).toFixed(2),points=v=>fixed(v/100);
const signed=v=>Math.abs(v)<1e-9?'0.00':`${v>0?'+':'−'}${fixed(Math.abs(v))}`;
const actualWins=t=>t.actual.w+t.actual.t*.5;

export function mountScheduleLuck(getLeague,toast){
  const $=s=>document.querySelector(s);let priorFocus=null;
  const teamButton=t=>`<button class="luck-team-button" title="View weekly calculation" data-luck-team="${t.id}" aria-label="Show ${esc(manager(t))}’s weekly schedule luck calculation">${teamIdentity(t)}<span class="luck-calc-link" aria-hidden="true">↗</span></button>`;
  function render(){
    const league=getLeague(),teams=[...league.teams].sort((a,b)=>Math.abs(a.luck-b.luck)<1e-9?manager(a).localeCompare(manager(b)):b.luck-a.luck);
    const high=teams[0].luck,low=teams.at(-1).luck,n=league.ids.length-1,example=teams[0];
    if(Math.abs(high-low)<1e-9){
      $('#luck-spotlights').innerHTML='<div class="luck-level"><strong>Everyone is tied.</strong> Actual wins match expected wins for every manager.</div>';
    }else{
      $('#luck-spotlights').innerHTML=[['luckiest',high],['unluckiest',low]].map(([kind,value])=>{
        const tied=teams.filter(t=>Math.abs(t.luck-value)<1e-9),title=(tied.length>1?'Joint ':'')+(kind==='luckiest'?'Luckiest bastard':'Unluckiest bastard');
        return `<article class="luck-spotlight ${kind}"><h3>${title}</h3><div class="luck-spotlight-body"><div class="luck-leaders">${tied.map(teamButton).join('')}</div><div class="luck-spotlight-value"><strong>${signed(value)}</strong><span>wins ${value>0?'above':'below'} expected</span></div></div><p>${tied.map(t=>`${actualWins(t)} actual − ${fixed(t.expected)} expected`).join('<br>')}</p></article>`;
      }).join('');
    }
    $('#luck-explainer').innerHTML=`<p><b>Expected wins:</b> each week, compare your score with the other ${n} scores. Each team you outscore counts 1; a tie counts ½. Divide by ${n}, then add the weekly results.</p><p><b>Luck in wins = actual wins − expected wins.</b> ${esc(manager(example))}: ${actualWins(example)} − ${fixed(example.expected)} = <strong class="${example.luck<0?'negative':'positive'}">${signed(example.luck)}</strong>.</p><p class="luck-explainer-hint">Select a manager for the weekly calculation. Positive = more wins; negative = fewer.</p>`;
    const scale=Math.max(1.75,...teams.map(t=>Math.abs(t.luck)*1.18));
    $('#luck-table-body').innerHTML=teams.map(t=>{
      const size=Math.abs(t.luck)/scale*43,negative=t.luck<0;
      return `<tr><th scope="row">${teamButton(t)}</th><td class="luck-number">${actualWins(t)}</td><td class="luck-number">${fixed(t.expected)}</td><td><div class="luck-difference"><span class="luck-delta-track" aria-hidden="true"><i class="${negative?'negative':''}" style="left:${negative?50-size:50}%;width:${size}%"></i></span><strong class="${negative?'negative':t.luck>1e-9?'positive':'neutral'}">${signed(t.luck)}</strong></div></td></tr>`;
    }).join('');
  }
  function inspect(id){
    const league=getLeague(),data=scheduleLuckBreakdown(league,id);if(!data)return;
    if(!$('#luck-dialog').open)priorFocus=document.activeElement;
    const {team,weeks,opponentsPerWeek:n}=data;
    $('#luck-dialog-content').innerHTML=`<h2>${esc(manager(team))}<small class="comparison-team">${esc(team.name)}</small></h2><div class="luck-math-summary"><div><small>ACTUAL WINS</small><strong>${Number(fixed(data.actualWins))}</strong></div><span>−</span><div><small>EXPECTED WINS</small><strong>${fixed(data.expectedWins)}</strong></div><span>=</span><div><small>LUCK IN WINS</small><strong class="${data.difference<0?'negative':'positive'}">${signed(data.difference)}</strong></div></div><div class="luck-math-explanation"><p>Across ${weeks.length} weeks, your scores beat <b>${data.beaten}</b> and tied <b>${data.tied}</b> of the ${data.comparisons} other-team scores. There are ${n} possible opponents each week.</p><p><b>Expected wins = (${data.beaten} + ½ × ${data.tied}) ÷ ${n} = ${fixed(data.expectedWins)}.</b></p></div><div class="luck-math-scroll" tabindex="0" role="region" aria-label="Weekly schedule luck calculation"><table class="luck-math-table"><caption class="sr-only">Each week’s actual score, other scores beaten or tied, expected wins, actual result and actual-minus-expected wins.</caption><thead><tr><th scope="col">WEEK</th><th scope="col">YOUR SCORE</th><th scope="col">OTHER ${n} SCORES</th><th scope="col">EXPECTED WINS</th><th scope="col">ACTUAL WINS</th><th scope="col">DIFFERENCE</th></tr></thead><tbody>${weeks.map(w=>`<tr><th scope="row">Week ${w.week}</th><td>${points(w.score)}</td><td><b>${w.beaten} beaten · ${w.tied} tied</b><small>(${w.beaten} + ½ × ${w.tied}) ÷ ${n}</small></td><td>${fixed(w.expected)}</td><td>${w.actual}<small>${w.result>0?'Beat':w.result<0?'Lost to':'Tied'} ${esc(manager(league.byId[w.opponent]))}</small></td><td class="${w.difference<0?'negative':w.difference>0?'positive':'neutral'}">${signed(w.difference)}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">TOTAL</th><td></td><td>${data.beaten} beaten · ${data.tied} tied</td><td>${fixed(data.expectedWins)}</td><td>${Number(fixed(data.actualWins))}</td><td class="${data.difference<0?'negative':'positive'}">${signed(data.difference)}</td></tr></tfoot></table></div>${mobileLuckWeeks(data,league)}<p class="detail-note">An actual win counts 1, a loss 0, and a tie ½. Expected wins assumes each of the other ${n} managers is equally likely to be your opponent in that week. Totals use unrounded values; displayed numbers are rounded to two decimals.</p>`;
    if(!$('#luck-dialog').open)$('#luck-dialog').showModal();$('#luck-dialog').scrollTop=0;
    history.replaceState(null,'',`#luck?team=${team.id}`);
  }
  function close(){
    $('#luck-dialog').close();history.replaceState(null,'','#luck');
    if(priorFocus?.isConnected&&priorFocus.closest('#luck'))priorFocus.focus();else $('#luck').scrollIntoView({block:'start'});
  }
  function readHash(){if(location.hash.startsWith('#luck?'))inspect(new URLSearchParams(location.hash.split('?')[1]).get('team'));}
  $('#luck').addEventListener('click',e=>{const b=e.target.closest('[data-luck-team]');if(b)inspect(b.dataset.luckTeam);});
  $('#close-luck-dialog').addEventListener('click',close);
  $('#luck-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
  $('#copy-luck').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('Calculation link copied.');}catch{toast('Copy the address-bar URL to share.');}});
  return {render,readHash};
}
