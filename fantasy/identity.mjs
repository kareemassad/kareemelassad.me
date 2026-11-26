import currentOwners from './current-owners.mjs?v=83e2bd34c11e';
import {personForOwner} from './people.mjs?v=83e2bd34c11e';
// Legacy current-season labels remain for callers without report context.
export const MANAGERS={1:'Stefan',2:'Logan',3:'Kareem',4:'Michael',5:'Russell',6:'Evan',7:'George',8:'Alois',9:'Mason',10:'Rory'};
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function identifyTeam(team,season){
  const saved=String(season)===String(currentOwners.season)?currentOwners.teams.find(t=>t.id===team.id):null;
  const explicit=Object.prototype.hasOwnProperty.call(team,'ownerId'),ownerId=explicit?team.ownerId:saved?.ownerId??null,person=personForOwner(ownerId);
  const username=team.username??(!explicit||ownerId===saved?.ownerId?saved?.username:null)??null;
  const displayName=team.displayName??(!explicit||ownerId===saved?.ownerId?saved?.displayName:null)??null;
  // Unknown owners must not inherit the current manager of a reused roster slot.
  return {...team,ownerId,username,displayName,personId:person?.id??(ownerId?'account:'+ownerId:`unmatched:${season}:${team.id}`),manager:person?.name??(ownerId?null:team.manager??null)};
}
export const manager=t=>t&&Object.prototype.hasOwnProperty.call(t,'manager')?(t.manager||t.name||'League team'):MANAGERS[t?.id]||t?.name||'League team';
export const fullName=t=>t&&manager(t)!==t.name?`${manager(t)} · ${t.name}`:t?.name||'League team';
export function teamIdentity(t,{badge=true,meta=null}={}){
  const owner=manager(t),name=t?.name&&t.name!==owner?t.name:'';
  return `<span class="team-identity">${badge?`<span class="manager-badge manager-${Number(t?.id)}" aria-hidden="true">${esc(owner.slice(0,1))}</span>`:''}<span class="identity-text"><strong>${esc(owner)}</strong>${name||meta?`<small>${esc(name)}${meta?`<em>${name?' · ':''}${esc(meta)}</em>`:''}</small>`:''}</span></span>`;
}
export function playerPhoto(id,name){
  const initials=String(name||'').split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
  const numeric=/^\d+$/.test(String(id));
  return `<span class="player-photo" aria-hidden="true"><span>${esc(initials||'—')}</span>${numeric?`<img src="https://sleepercdn.com/content/nfl/players/thumb/${encodeURIComponent(id)}.jpg" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-player-photo>`:''}</span>`;
}
// Failed or unavailable headshots leave the initials visible.
export function enablePhotoFallback(){document.addEventListener('error',e=>{if(e.target?.matches?.('img[data-player-photo]'))e.target.hidden=true;},true);}
