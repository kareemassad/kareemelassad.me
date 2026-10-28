// Shared navigation for the portfolio, bells, reader, and fantasy report.
const projects=[
  {id:'resume',label:'Resume',href:'https://kareemelassad.me/'},
  {id:'bells',label:'Bell Collection',href:'https://kareemelassad.me/#/bells'},
  {id:'reader',label:'Learning Reader',href:'https://kareemelassad.me/learning-reader/'},
  {id:'fantasy',label:'Fantasy Football',href:'https://kareemelassad.me/fantasy/'},
];
function currentProject(){
  if(document.body.dataset.project==='fantasy'||/^\/(fantasy|wang-gang)(\/|$)/.test(location.pathname))return 'fantasy';
  if(location.pathname.startsWith('/learning-reader/'))return 'reader';
  return location.hash.startsWith('#/bells')?'bells':'resume';
}
class ProjectNav extends HTMLElement{
  connectedCallback(){
    if(this.shadowRoot)return;
    const root=this.attachShadow({mode:'open'}),links=()=>projects.map(p=>`<a href="${p.href}" aria-label="${p.label}" data-project="${p.id}">${p.label}<span aria-hidden="true">↗</span></a>`).join('');
    root.innerHTML=`<style>
      :host{display:block;position:relative;z-index:1000;flex:0 0 48px;height:48px;background:#fafbf8;border-bottom:1px solid #e1e6dc;color:#29352d;font:13px/1.4 Inter,"Segoe UI",Arial,sans-serif;box-sizing:border-box}
      *{box-sizing:border-box}.bar{height:48px;max-width:1240px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:20px}
      a{color:inherit;text-decoration:none;white-space:nowrap;touch-action:manipulation}.name{font-size:13px;font-weight:650;letter-spacing:-.02em;min-height:44px;display:flex;align-items:center}
      nav{display:flex;align-items:center;gap:6px}nav a{padding:12px 13px;min-height:44px;border-radius:6px;font-size:12px;color:#667267}a[aria-current=page]{color:#244d38;font-weight:650;background:#edf2e8}a:hover{color:#244d38;background:#edf2e8}a:focus-visible,summary:focus-visible{outline:2px solid #577c59;outline-offset:2px}
      nav a span{display:none}details{display:none;position:relative}summary{list-style:none;cursor:pointer;min-height:44px;display:flex;align-items:center;gap:10px;padding:0 9px;border-radius:6px;font-size:12px;font-weight:600;touch-action:manipulation}summary::-webkit-details-marker{display:none}summary:after{content:'⌄';font-size:15px;color:#7a877a}.menu{position:absolute;right:0;top:48px;width:245px;border:1px solid #dce4d5;border-radius:10px;background:#fff;padding:7px;box-shadow:0 12px 36px #203b2526}.menu a{display:flex;align-items:center;justify-content:space-between;min-height:46px;padding:11px 13px;border-radius:6px;font-size:13px}.menu a span{color:#8b9787;font-size:12px}
      @media(max-width:700px){.bar{padding:0 max(14px,env(safe-area-inset-right,0px)) 0 max(14px,env(safe-area-inset-left,0px))}nav{display:none}details{display:block}.name{font-size:12px}}
    </style><div class="bar"><a class="name" href="https://kareemelassad.me/">Kareem El Assad</a><nav aria-label="Site projects">${links()}</nav><details><summary aria-label="Projects">Projects</summary><div class="menu" role="navigation" aria-label="Site projects">${links()}</div></details></div>`;
    const menu=root.querySelector('details');
    const active=()=>root.querySelectorAll('[data-project]').forEach(a=>a.dataset.project===currentProject()?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    active();window.addEventListener('hashchange',active);
    document.addEventListener('click',event=>{if(!event.composedPath().includes(this))menu.open=false;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;root.querySelector('summary').focus();}});
    root.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false;});
  }
}
if(!customElements.get('ke-project-nav'))customElements.define('ke-project-nav',ProjectNav);
if(!document.querySelector('ke-project-nav'))document.body.prepend(document.createElement('ke-project-nav'));
// The reader uses fixed panels; reserve the same space for navigation in both views.
if(location.pathname.startsWith('/learning-reader/')){
  const style=document.createElement('style');
  style.textContent='body #shelf,body #reader-shell{top:48px}body #reader-shell header{top:60px}';
  document.head.append(style);
}
