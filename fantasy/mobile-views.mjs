import {manager,esc} from './identity.mjs?v=9a469b449e9e';
const fixed=v=>Number(v).toFixed(2);
const difference=v=>Math.abs(v)<1e-9?'0.00':`${v>0?'+':'−'}${fixed(Math.abs(v))}`;
export function mobileLuckWeeks(data,league){
  const n=data.opponentsPerWeek;
  return `<div class="mobile-luck-math">${data.weeks.map((w,i)=>`<details class="phone-math-week" name="phone-math-week" ${i===0?'open':''}><summary><span><b>Week ${w.week}</b><small>${w.result>0?'Beat':w.result<0?'Lost to':'Tied'} ${esc(manager(league.byId[w.opponent]))}</small></span><strong class="${w.difference<0?'negative':'positive'}">${difference(w.difference)}</strong><i class="phone-chevron" aria-hidden="true">⌄</i></summary><div class="phone-math-body"><div class="phone-metrics"><span><small>YOUR SCORE</small><strong>${fixed(w.score/100)}</strong></span><span><small>OTHER ${n} SCORES</small><strong>${w.beaten} beaten</strong><em>${w.tied} tied</em></span><span><small>ACTUAL WINS</small><strong>${w.actual}</strong></span><span><small>EXPECTED WINS</small><strong>${fixed(w.expected)}</strong></span></div><p>${w.actual} − (${w.beaten} + ½ × ${w.tied}) ÷ ${n} = <b>${difference(w.difference)}</b></p></div></details>`).join('')}</div>`;
}
