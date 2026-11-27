export function mountNavigation(onChange){
  const views=['report','history','best','charts','scores','luck'];
  function sync(){
    const [hash,query]=location.hash.slice(1).split('?');
    const seasonLuck=hash==='charts'&&new URLSearchParams(query).get('view')==='luck';
    const view=seasonLuck?'luck':views.includes(hash)?hash:'report';
    for(const section of document.querySelectorAll('.report-section'))section.hidden=section.id!==view;
    for(const link of document.querySelectorAll('.topbar nav a')){const active=link.hash===`#${view}`;if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
    for(const link of document.querySelectorAll('.season-navigation a')){if(link.hash.split('?')[0]===`#${view}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
    if(['charts','luck','scores'].includes(view))document.querySelector('.topbar nav a[href="#report"]').setAttribute('aria-current','page');
    document.body.dataset.view=view;
    onChange?.(view);
  }
  document.querySelector('.topbar nav').addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;for(const d of document.querySelectorAll('dialog[open]'))d.close();});
  window.addEventListener('hashchange',sync);sync();return {sync};
}
