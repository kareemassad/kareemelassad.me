const element = (tag, text) => {const node = document.createElement(tag); if (text) node.textContent = text; return node;};
const setText = (node, text) => {if (node.textContent !== text) node.textContent = text;};
export function readingPlanControls(container, onResume, onMove) {
 const section = element('section'); section.className = 'reading-plan-controls';
 const status = element('output'); status.dataset.readingStatus = '';
 const button = element('button', 'Follow reading'); button.type = 'button'; button.dataset.readingResume = ''; button.addEventListener('click', onResume);
 const caption = element('p'); caption.dataset.readingCaption = '';
 const summary = element('p'); summary.dataset.readingSummary = '';
 section.append(status, button, caption, summary); container.prepend(section);
 if(onMove){for(const [direction,label]of [[-1,'Previous passage'],[1,'Next passage']]){const move=element('button',direction<0?'←':'→');move.type='button';move.setAttribute('aria-label',label);move.title=label;move.dataset.readingMove=String(direction);move.addEventListener('click',()=>onMove(direction));section.append(move);}}
}
export function updateReadingPlanControls(container, selection) {
 const status = container.querySelector('[data-reading-status]'); if (!status || !selection) return;
 setText(status, selection.following ? `Reading step ${selection.index + 1} of ${selection.total}` : 'Exploring this scene');
 container.querySelector('[data-reading-resume]').hidden = selection.following;
 setText(container.querySelector('[data-reading-caption]'), selection.caption || '');
 const summary = container.querySelector('[data-reading-summary]'); setText(summary, selection.page ? `PDF ${selection.page.page} · ${selection.page.summary}` : '');
 summary.hidden = !selection.page;
 for(const button of container.querySelectorAll('[data-reading-move]'))button.disabled=Number(button.dataset.readingMove)<0?selection.index===0:selection.index===selection.total-1;
}
