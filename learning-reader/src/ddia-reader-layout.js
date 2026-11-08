// Keep both panes mounted so source position and the experiment survive a switch.
export function installDDIAReaderLayout() {
  document.body.classList.add('ddia-reader');
  const reader = document.getElementById('reader');
  const stage = document.getElementById('stage');
  const narrow = matchMedia('(max-width: 1100px)');
  const tabs = document.createElement('nav');
  tabs.className = 'ddia-view-tabs';
  tabs.setAttribute('aria-label', 'Reading view');
  let selected = 'read';
  const buttons = ['read', 'experiment'].map((view) => {
    const button = document.createElement('button');
    button.textContent = view === 'read' ? 'Read' : 'Experiment';
    button.setAttribute('aria-controls', view === 'read' ? 'reader' : 'stage');
    button.addEventListener('click', () => { selected = view; update(); });
    tabs.append(button);
    return button;
  });
  document.querySelector('.split').before(tabs);
  function update() {
    document.body.dataset.readingView = selected;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String((i === 0) === (selected === 'read'))));
    reader.inert = narrow.matches && selected !== 'read';
    stage.inert = narrow.matches && selected !== 'experiment';
    if (!narrow.matches && tabs.contains(document.activeElement)) reader.focus();
  }
  reader.tabIndex = -1;
  narrow.addEventListener('change', update);
  update();
  const controls = document.getElementById('controls');
  const settings = document.createElement('details');
  settings.className = 'ddia-settings';
  const summary = document.createElement('summary');
  summary.textContent = 'Adjust experiment';
  controls.before(settings);
  settings.append(summary, controls);
  for (const [id, label] of [['prev-cue', 'Previous experiment'], ['next-cue', 'Next experiment'], ['help-btn', 'Keyboard shortcuts']]) {
    document.getElementById(id).setAttribute('aria-label', label);
  }
}
