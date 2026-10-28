import {CHARTS,normalizeChartType,makeChartModel} from './chart-model.mjs?v=dac01f61efdc';
import {manager,fullName,esc} from './identity.mjs?v=dac01f61efdc';

export function mountCharts(getLeague,toast){
  const $=s=>document.querySelector(s);
  let type='pointsleft',mode='weekly',primary='all',comparison='none',lastWidth=0,frame=0,currentModel=null;
  const lastView={rankings:'pointsleft',trends:'trend'};
  let renderChart=null,rendererPromise=null;
  let hidden=new Set();
  function options(teams,first){return first+teams.map(t=>`<option value="${t.id}" title="${esc(t.name)}">${esc(manager(t))}</option>`).join('');}
  function renderControls(model){
    const teams=[...getLeague().teams].sort((a,b)=>manager(a).localeCompare(manager(b))),line=model.group==='trends';
    $('#chart-type').innerHTML=CHARTS.filter(c=>c.group===model.group).map(c=>`<option value="${c.id}">${esc(c.label)}</option>`).join('');
    $('#chart-type').value=type;
    $('#chart-team-label').textContent='MANAGER';
    $('#chart-team').innerHTML=options(teams,line?`<option value="everyone">All managers</option><option value="baseline">${type==='luck'?'Zero-luck baseline only':'League average only'}</option>`:'<option value="all">All managers</option>');
    $('#chart-team').value=primary;
    $('#compare-team').innerHTML=options(teams.filter(t=>String(t.id)!==primary),'<option value="none">No comparison</option>');
    $('#compare-team').value=comparison;
    $('#compare-team').disabled=primary==='all'||primary==='baseline'||model.everyone;
    $('#compare-control').hidden=!line||model.everyone||primary==='baseline';$('#chart-comparison-help').hidden=!line;
    $('#trend-control').hidden=type!=='trend';
    $('#trend-mode').value=mode;
    $('#reset-chart').hidden=!line;
    $('#chart-explore-help').hidden=!line;
    $('#chart-explore-help').textContent=model.everyone?'All managers shown. Select a legend name to hide or show its line; hover or focus a name to highlight it.':'Compare up to two managers. Use the arrow keys to step through weeks.';
    for(const b of document.querySelectorAll('[data-chart-group]'))b.setAttribute('aria-pressed',String(b.dataset.chartGroup===model.group));
    $('#chart-toolbar').dataset.group=model.group;
  }
  function render(){
    const width=$('#chart-plot').clientWidth;if(!width)return;lastWidth=width;
    const model=makeChartModel(getLeague(),{type,mode,primary,comparison,hidden:[...hidden],compact:width<650,touch:matchMedia('(pointer:coarse), (max-width:650px)').matches});
    hidden=new Set(model.hidden.map(String));
    type=model.type;primary=model.primary===null?'all':String(model.primary);comparison=model.comparison===null?'none':String(model.comparison);currentModel=model;
    renderControls(model);
    $('#chart-title').textContent=model.title;$('#chart-subtitle').textContent=model.subtitle;
    $('#chart-detail').textContent=model.detail||'Hover or tap a bar for its exact points and details.';
    $('#chart-note').textContent=model.note;$('#chart-unit').textContent=model.axisLabel;
    $('#chart-legend').hidden=model.kind!=='line'||!!model.empty;
    $('#chart-legend').innerHTML=(model.legendSeries||model.series).map(s=>{const title=esc(s.key==='baseline'?(model.type==='luck'?'Actual wins equal expected wins':'Average of every league team'):s.teamName),inside=`<i style="background:${s.color}" class="${s.baseline?'baseline-key':''}"></i>${esc(s.name)}`;return model.everyone&&s.key!=='baseline'?`<button type="button" class="chart-series-key chart-series-toggle" data-series-key="${s.key}" data-series-team="${s.key.slice(4)}" aria-pressed="${!hidden.has(s.key.slice(4))}" aria-label="Show ${esc(s.name)}" title="${title}">${inside}</button>`:`<span class="chart-series-key" title="${title}">${inside}</span>`;}).join('')+(model.everyone&&hidden.size?'<button type="button" class="chart-series-key chart-series-toggle" data-show-all>Show all</button>':'');
    $('#download-chart').disabled=!renderChart||!!model.empty;
    if(renderChart){renderChart($('#chart-plot'),model);}
    else if(!rendererPromise){
      $('#chart-plot').innerHTML='<p class="chart-empty">Loading chart…</p>';
      rendererPromise=import('./chart-lib.mjs?v=dac01f61efdc').then(module=>{renderChart=module.renderChart;render();}).catch(()=>{rendererPromise=null;$('#chart-plot').innerHTML='<p class="chart-empty">Could not load the chart. Choose a graph to try again.</p>';});
    }
  }
  function shareView(){
    const params=new URLSearchParams({view:type,team:primary});
    if(CHARTS.find(c=>c.id===type).group==='trends'){params.set('mode',mode);if(comparison!=='none')params.set('compare',comparison);if(primary==='everyone'&&hidden.size)params.set('hide',[...hidden].join(','));}
    history.replaceState(null,'',`#charts?${params}`);
  }
  function readView(){
    if(!location.hash.startsWith('#charts?'))return;
    const params=new URLSearchParams(location.hash.split('?')[1]);
    type=normalizeChartType(params.get('view'));mode=['weekly','rolling','cumulative'].includes(params.get('mode'))?params.get('mode'):'weekly';
    primary=params.get('team')||'all';comparison=params.get('compare')||'none';lastView[CHARTS.find(c=>c.id===type).group]=type;
    hidden=new Set((params.get('hide')||'').split(',').filter(Boolean));
    render();requestAnimationFrame(()=>$('#charts').scrollIntoView({block:'start'}));
  }
  function wrapText(ctx,value,maxWidth){
    const rows=[];let row='';for(const word of String(value||'').split(/\s+/)){if(row&&ctx.measureText(row+' '+word).width>maxWidth){rows.push(row);row=word;}else row+=(row?' ':'')+word;}if(row)rows.push(row);return rows;
  }
  async function download(){
    const source=$('#chart-plot svg'),model=currentModel,league=getLeague();if(!source||model?.empty){toast('No chart data to save.');return;}
    try{
      await document.fonts.ready;
      const rect=source.getBoundingClientRect(),w=rect.width,h=rect.height,clone=source.cloneNode(true);
      clone.setAttribute('width',w);clone.setAttribute('height',h);clone.style.fontFamily='Segoe UI, Arial, sans-serif';clone.style.background='#fff';
      const svgUrl=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml'})),image=new Image();
      await new Promise((ok,fail)=>{image.onload=ok;image.onerror=fail;image.src=svgUrl;});
      const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
      ctx.font='600 23px Segoe UI';const titles=wrapText(ctx,model.title,w-40);
      ctx.font='12px Segoe UI';const subtitles=wrapText(ctx,model.subtitle,w-40),foot=[];
      if(model.kind==='line')foot.push(...wrapText(ctx,model.series.map(s=>s.name+(s.teamName?' · '+s.teamName:'')).join(' / '),w-40));
      foot.push(...wrapText(ctx,model.detail,w-40),...wrapText(ctx,model.note,w-40));
      const header=65+titles.length*28+subtitles.length*17+16,scale=Math.max(1.5,1800/w);
      canvas.width=Math.ceil(w*scale);canvas.height=Math.ceil((header+h+45+foot.length*17)*scale);ctx.scale(scale,scale);
      ctx.fillStyle='#f6f6ef';ctx.fillRect(0,0,w,canvas.height/scale);ctx.fillStyle='#193e32';ctx.font='600 11px Segoe UI';
      ctx.fillText(`WG · ${league.season} · WEEKS ${league.weeks[0].week}–${league.weeks.at(-1).week}`,20,28);
      ctx.font='600 23px Segoe UI';titles.forEach((s,i)=>ctx.fillText(s,20,65+i*28));
      ctx.fillStyle='#637165';ctx.font='12px Segoe UI';subtitles.forEach((s,i)=>ctx.fillText(s,20,65+titles.length*28+i*17));
      ctx.drawImage(image,0,header,w,h);ctx.font='11px Segoe UI';foot.forEach((s,i)=>ctx.fillText(s,20,header+h+26+i*17));URL.revokeObjectURL(svgUrl);
      const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!png)throw new Error('Export failed');
      const url=URL.createObjectURL(png),a=document.createElement('a');a.href=url;a.download=`wg-${type}-week-${league.weeks.at(-1).week}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
    }catch{toast('Could not create the chart PNG. Please try again.');}
  }
  $('#chart-groups').addEventListener('click',e=>{
    const b=e.target.closest('[data-chart-group]');if(!b)return;const group=b.dataset.chartGroup,prior=CHARTS.find(c=>c.id===type).group;
    if(group===prior)return;lastView[prior]=type;type=lastView[group];primary='all';comparison='none';render();shareView();
  });
  $('#chart-type').addEventListener('change',e=>{type=e.target.value;lastView[CHARTS.find(c=>c.id===type).group]=type;render();shareView();});
  $('#chart-team').addEventListener('change',e=>{primary=e.target.value;hidden.clear();if(primary===comparison)comparison='none';render();shareView();});
  $('#compare-team').addEventListener('change',e=>{comparison=e.target.value;render();shareView();});
  $('#trend-mode').addEventListener('change',e=>{mode=e.target.value;render();shareView();});
  $('#reset-chart').addEventListener('click',()=>{primary='all';comparison='none';hidden.clear();render();shareView();});
  function highlight(key){if(renderChart&&currentModel?.everyone){currentModel={...currentModel,highlight:currentModel.series.some(s=>s.key===key)?key:null};renderChart($('#chart-plot'),currentModel);}}
  $('#chart-legend').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-show-all'))hidden.clear();else if(b.dataset.seriesTeam){const id=b.dataset.seriesTeam;hidden.has(id)?hidden.delete(id):hidden.add(id);}else return;render();shareView();});
  $('#chart-legend').addEventListener('mouseover',e=>{const b=e.target.closest('[data-series-key]');highlight(b?.dataset.seriesKey||null);});
  $('#chart-legend').addEventListener('mouseleave',()=>highlight(null));
  $('#chart-legend').addEventListener('focusin',e=>highlight(e.target.dataset.seriesKey||null));
  $('#chart-legend').addEventListener('focusout',()=>highlight(null));
  $('#download-chart').addEventListener('click',download);window.addEventListener('hashchange',readView);readView();
  const observer=new ResizeObserver(()=>{const width=$('#chart-plot').clientWidth;if(Math.abs(width-lastWidth)>2){cancelAnimationFrame(frame);frame=requestAnimationFrame(render);}});
  observer.observe($('#chart-plot'));return {render};
}
