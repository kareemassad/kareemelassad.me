export function mountNavigation(onChange){
  const views=['report','history','best','charts','scores'];
  function sync(){
    const hash=location.hash.slice(1).split('?')[0],view=views.includes(hash)?hash:hash==='luck'?'report':hash.startsWith('swap=')?'report':'report';
    for(const section of document.querySelectorAll('.report-section'))section.hidden=section.id!==view&&!(view==='report'&&section.id==='luck');
    for(const link of document.querySelectorAll('.topbar nav a')){const active=link.hash===`#${view}`;if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
    for(const link of document.querySelectorAll('.season-navigation a')){if(link.hash===`#${view}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
    if(view==='charts'||view==='scores')document.querySelector('.topbar nav a[href="#report"]').setAttribute('aria-current','page');
    document.body.dataset.view=view;
    onChange?.(view);
  }
  document.querySelector('.topbar nav').addEventListener('click',e=>{const link=e.target.closest('a');if(!link)return;for(const d of document.querySelectorAll('dialog[open]'))d.close();});
  window.addEventListener('hashchange',sync);sync();return {sync};
}
