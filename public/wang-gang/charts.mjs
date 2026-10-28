import {CHARTS,normalizeChartType,makeChartModel} from './chart-model.mjs?v=13978723b8da';
import {manager,fullName,esc} from './identity.mjs?v=13978723b8da';

export function mountCharts(getLeague,toast){
  const $=s=>document.querySelector(s);
  let type='pointsleft',mode='weekly',primary='all',comparison='none',lastWidth=0,frame=0,currentModel=null;
  const lastView={rankings:'pointsleft',trends:'trend'};
  let renderChart=null,rendererPromise=null;
  function options(teams,first){return first+teams.map(t=>`<option value="${t.id}" title="${esc(t.name)}">${esc(manager(t))}</option>`).join('');}
  function renderControls(model){
    const teams=[...getLeague().teams].sort((a,b)=>manager(a).localeCompare(manager(b))),line=model.group==='trends';
    $('#chart-type').innerHTML=CHARTS.filter(c=>c.group===model.group).map(c=>`<option value="${c.id}">${esc(c.label)}</option>`).join('');
    $('#chart-type').value=type;
    $('#chart-team-label').textContent='MANAGER';
    $('#chart-team').innerHTML=options(teams,`<option value="all">${line?'League average only':'All managers'}</option>`);
    $('#chart-team').value=primary;
    $('#compare-team').innerHTML=options(teams.filter(t=>String(t.id)!==primary),'<option value="none">No comparison</option>');
    $('#compare-team').value=comparison;
    $('#compare-team').disabled=primary==='all';
    $('#compare-control').hidden=!line;$('#chart-comparison-help').hidden=!line;
    $('#trend-control').hidden=type!=='trend';
    $('#trend-mode').value=mode;
    $('#reset-chart').hidden=!line;
    $('#chart-explore-help').hidden=!line;
    for(const b of document.querySelectorAll('[data-chart-group]'))b.setAttribute('aria-pressed',String(b.dataset.chartGroup===model.group));
    $('#chart-toolbar').dataset.group=model.group;
  }
  function render(){
    const width=$('#chart-plot').clientWidth;if(!width)return;lastWidth=width;
    const model=makeChartModel(getLeague(),{type,mode,primary,comparison,compact:width<650,touch:matchMedia('(pointer:coarse), (max-width:650px)').matches});
    type=model.type;primary=model.primary===null?'all':String(model.primary);comparison=model.comparison===null?'none':String(model.comparison);currentModel=model;
    renderControls(model);
    $('#chart-title').textContent=model.title;$('#chart-subtitle').textContent=model.subtitle;
    $('#chart-detail').textContent=model.detail||'Hover or tap a bar for its exact points and details.';
    $('#chart-note').textContent=model.note;$('#chart-unit').textContent=model.axisLabel;
    $('#chart-legend').hidden=model.kind!=='line'||!!model.empty;
    $('#chart-legend').innerHTML=model.series.map(s=>`<span class="chart-series-key" title="${esc(s.key==='baseline'?(model.type==='luck'?'Actual wins equal expected wins':'Average of every league team'):s.teamName)}"><i style="background:${s.color}" class="${s.baseline?'baseline-key':''}"></i>${esc(s.name)}</span>`).join('');
    $('#download-chart').disabled=!renderChart||!!model.empty;
    if(renderChart){renderChart($('#chart-plot'),model);}
    else if(!rendererPromise){
      $('#chart-plot').innerHTML='<p class="chart-empty">Loading chart…</p>';
      rendererPromise=import('./chart-lib.mjs?v=13978723b8da').then(module=>{renderChart=module.renderChart;render();}).catch(()=>{rendererPromise=null;$('#chart-plot').innerHTML='<p class="chart-empty">Could not load the chart. Choose a graph to try again.</p>';});
    }
  }
  function shareView(){
    const params=new URLSearchParams({view:type,team:primary});
    if(CHARTS.find(c=>c.id===type).group==='trends'){params.set('mode',mode);if(comparison!=='none')params.set('compare',comparison);}
    history.replaceState(null,'',`#charts?${params}`);
  }
  function readView(){
    if(!location.hash.startsWith('#charts?'))return;
    const params=new URLSearchParams(location.hash.split('?')[1]);
    type=normalizeChartType(params.get('view'));mode=['weekly','rolling','cumulative'].includes(params.get('mode'))?params.get('mode'):'weekly';
    primary=params.get('team')||'all';comparison=params.get('compare')||'none';lastView[CHARTS.find(c=>c.id===type).group]=type;
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
      ctx.fillText(`WANG GANG · ${league.season} · WEEKS ${league.weeks[0].week}–${league.weeks.at(-1).week}`,20,28);
      ctx.font='600 23px Segoe UI';titles.forEach((s,i)=>ctx.fillText(s,20,65+i*28));
      ctx.fillStyle='#637165';ctx.font='12px Segoe UI';subtitles.forEach((s,i)=>ctx.fillText(s,20,65+titles.length*28+i*17));
      ctx.drawImage(image,0,header,w,h);ctx.font='11px Segoe UI';foot.forEach((s,i)=>ctx.fillText(s,20,header+h+26+i*17));URL.revokeObjectURL(svgUrl);
      const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!png)throw new Error('Export failed');
      const url=URL.createObjectURL(png),a=document.createElement('a');a.href=url;a.download=`wang-gang-${type}-week-${league.weeks.at(-1).week}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
    }catch{toast('Could not create the chart PNG. Please try again.');}
  }
  $('#chart-groups').addEventListener('click',e=>{
    const b=e.target.closest('[data-chart-group]');if(!b)return;const group=b.dataset.chartGroup,prior=CHARTS.find(c=>c.id===type).group;
    if(group===prior)return;lastView[prior]=type;type=lastView[group];primary='all';comparison='none';render();shareView();
  });
  $('#chart-type').addEventListener('change',e=>{type=e.target.value;lastView[CHARTS.find(c=>c.id===type).group]=type;render();shareView();});
  $('#chart-team').addEventListener('change',e=>{primary=e.target.value;if(primary===comparison)comparison='none';render();shareView();});
  $('#compare-team').addEventListener('change',e=>{comparison=e.target.value;render();shareView();});
  $('#trend-mode').addEventListener('change',e=>{mode=e.target.value;render();shareView();});
  $('#reset-chart').addEventListener('click',()=>{primary='all';comparison='none';render();shareView();});
  $('#download-chart').addEventListener('click',download);window.addEventListener('hashchange',readView);readView();
  const observer=new ResizeObserver(()=>{const width=$('#chart-plot').clientWidth;if(Math.abs(width-lastWidth)>2){cancelAnimationFrame(frame);frame=requestAnimationFrame(render);}});
  observer.observe($('#chart-plot'));return {render};
}
