// Shared presentation for the hosted books. Source pages and experiments stay mounted.
export function installDDIAReaderLayout() {
  // Let the PDF reader retain its source anchor before a layout change.
  function preservePosition(apply) {
    const event = new CustomEvent('reader-layout-change', {
      cancelable: true,
      detail: apply,
    });
    if (window.dispatchEvent(event)) apply();
  }
  document.body.classList.add('ddia-reader', 'reader-room');
  const reader = document.getElementById('reader'),
    stage = document.getElementById('stage'),
    split = document.querySelector('.split'),
    bar = document.querySelector('.bar');
  const divider = document.getElementById('divider');
  split.replaceChildren(stage, divider, reader);
  divider.tabIndex = 0;
  divider.setAttribute('role', 'separator');
  divider.setAttribute('aria-label', 'Text and experiment width');
  divider.setAttribute('aria-orientation', 'vertical');
  divider.setAttribute('aria-valuemin', '25');
  divider.setAttribute('aria-valuemax', '75');
  const syncDivider = () => {
    const value = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--split'),
    );
    divider.setAttribute('aria-valuenow', String(Math.round(value)));
  };
  syncDivider();
  divider.addEventListener('focus', syncDivider);
  divider.addEventListener('pointerup', syncDivider);
  divider.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--split'),
      ),
      value =
        event.key === 'Home'
          ? 25
          : event.key === 'End'
            ? 75
            : Math.max(
                25,
                Math.min(75, current + (event.key === 'ArrowRight' ? 2 : -2)),
              );
    preservePosition(() =>
      document.documentElement.style.setProperty('--split', value + '%'),
    );
    syncDivider();
  });
  reader.setAttribute('aria-label', 'Book text');
  reader.tabIndex = -1;
  stage.setAttribute('aria-label', 'Interactive experiment');
  stage.tabIndex = -1;
  const heading = document.getElementById('demo-title');
  heading.setAttribute('role', 'heading');
  heading.setAttribute('aria-level', '2');
  const title = document.createElement('h1');
  title.className = 'reader-sr-only';
  title.textContent = 'Book text and interactive experiments';
  bar.before(title);
  const skips = document.createElement('nav');
  skips.className = 'reader-skips';
  skips.setAttribute('aria-label', 'Skip within reader');
  bar.before(skips);
  const narrow = matchMedia('(max-width:1100px)');
  let selected = narrow.matches ? 'read' : 'split';
  const tabs = document.createElement('nav');
  tabs.className = 'ddia-view-tabs';
  tabs.setAttribute('aria-label', 'Reading view');
  const views = ['read', 'split', 'experiment'];
  const buttons = views.map((view) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent =
      view === 'read' ? 'Read' : view === 'split' ? 'Split' : 'Experiment';
    button.dataset.view = view;
    button.setAttribute(
      'aria-controls',
      view === 'read'
        ? 'reader'
        : view === 'experiment'
          ? 'stage'
          : 'reader stage',
    );
    button.onclick = () => {
      selected = view;
      update();
    };
    tabs.append(button);
    return button;
  });
  for (const [view, target, label] of [
    ['read', reader, 'Skip to book text'],
    ['experiment', stage, 'Skip to experiment'],
  ]) {
    const link = document.createElement('a');
    const destination = new URL(location.href);
    destination.hash = target.id;
    link.href = destination.href;
    link.textContent = label;
    link.onclick = (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      if (narrow.matches || selected !== 'split') {
        selected = view;
        update();
      }
      target.focus();
    };
    skips.append(link);
  }
  for (const [id, label] of [
    ['chapter', 'Chapter'],
    ['section', 'Section'],
  ]) {
    const select = document.getElementById(id),
      field = document.createElement('label'),
      caption = document.createElement('span');
    field.className = 'reader-nav-field';
    caption.textContent = label;
    caption.className = 'reader-nav-label';
    select.before(field);
    field.append(caption, select);
  }
  const tools = document.createElement('div');
  tools.className = 'reader-tools';
  tools.append(
    document.getElementById('hold'),
    document.getElementById('help-btn'),
  );
  function update() {
    if (document.body.dataset.readingView === 'split' || selected === 'split') {
      preservePosition(updateLayout);
    } else updateLayout();
  }
  function updateLayout() {
    if (narrow.matches && selected === 'split') selected = 'read';
    document.body.dataset.readingView = selected;
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(views[i] === selected));
      button.hidden = narrow.matches && views[i] === 'split';
    });
    if (narrow.matches) {
      if (tabs.parentElement !== document.body) split.before(tabs);
      if (tools.parentElement !== tabs) tabs.append(tools);
    } else {
      if (tabs.parentElement !== bar) bar.append(tabs);
      if (tools.parentElement !== bar) bar.append(tools);
    }
    const active = document.activeElement;
    reader.inert = selected === 'experiment';
    stage.inert = selected === 'read';
    if (
      (selected === 'read' && stage.contains(active)) ||
      (selected === 'experiment' && reader.contains(active)) ||
      (narrow.matches && active === buttons[1])
    ) {
      buttons[views.indexOf(selected)].focus();
    }
    window.dispatchEvent(
      new CustomEvent('reader-view-change', {
        detail: { experimentVisible: selected !== 'read' },
      }),
    );
  }
  narrow.addEventListener('change', update);
  update();
  const zoom = document.createElement('nav');
  zoom.className = 'reader-zoom';
  zoom.setAttribute('aria-label', 'Text zoom');
  const smaller = document.createElement('button'),
    fit = document.createElement('button'),
    larger = document.createElement('button');
  for (const button of [smaller, fit, larger]) button.type = 'button';
  smaller.textContent = '−';
  smaller.setAttribute('aria-label', 'Reduce book text');
  larger.textContent = '+';
  larger.setAttribute('aria-label', 'Enlarge book text');
  fit.title = 'Fit text to the reading pane';
  const levels = [1, 1.25, 1.5, 2];
  let zoomIndex = 0;
  function applyZoom() {
    preservePosition(() =>
      document.documentElement.style.setProperty(
        '--reader-zoom',
        String(levels[zoomIndex]),
      ),
    );
    smaller.disabled = zoomIndex === 0;
    larger.disabled = zoomIndex === levels.length - 1;
    fit.textContent =
      zoomIndex === 0 ? 'Fit' : Math.round(levels[zoomIndex] * 100) + '%';
    fit.setAttribute('aria-label', 'Fit book text to reading pane');
    if (zoomIndex === 0) reader.scrollLeft = 0;
  }
  smaller.onclick = () => {
    zoomIndex = Math.max(0, zoomIndex - 1);
    applyZoom();
  };
  larger.onclick = () => {
    zoomIndex = Math.min(levels.length - 1, zoomIndex + 1);
    applyZoom();
  };
  fit.onclick = () => {
    zoomIndex = 0;
    applyZoom();
  };
  zoom.append(smaller, fit, larger);
  document.body.append(zoom);
  applyZoom();
  const controls = document.getElementById('controls'),
    settings = document.createElement('details'),
    summary = document.createElement('summary');
  settings.className = 'ddia-settings';
  summary.textContent = 'Adjust experiment';
  controls.before(settings);
  settings.append(summary, controls);
  settings.open = false;
  const quiz = document.getElementById('predict');
  quiz.setAttribute('role', 'region');
  quiz.setAttribute('aria-label', 'Quiz question');
  quiz.setAttribute('aria-live', 'polite');
  quiz.tabIndex = -1;
  document.querySelector('.transport').after(quiz);
  const questionCue = document.createElement('button');
  questionCue.type = 'button';
  questionCue.className = 'reader-question-cue';
  questionCue.setAttribute('aria-controls', 'predict');
  questionCue.hidden = true;
  document.querySelector('.stage-head').append(questionCue);
  questionCue.onclick = () => {
    quiz.scrollIntoView({
      block: 'start',
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
    quiz.focus({ preventScroll: true });
  };
  const updateQuestion = () => {
    questionCue.hidden = quiz.hidden;
    questionCue.textContent = quiz.querySelector('.predict-out')?.textContent
      ? 'Answer reviewed · See feedback ↓'
      : 'Question ready · Make a prediction ↓';
  };
  new MutationObserver(updateQuestion).observe(quiz, {
    attributes: true,
    attributeFilter: ['hidden'],
    childList: true,
    subtree: true,
  });
  updateQuestion();
  window.addEventListener('reader-chapter-change', () => {
    settings.open = false;
    zoomIndex = 0;
    applyZoom();
    stage.scrollTop = 0;
  });
  for (const [id, label] of [
    ['prev-cue', 'Previous experiment'],
    ['next-cue', 'Next experiment'],
    ['help-btn', 'Keyboard shortcuts'],
  ])
    document.getElementById(id).setAttribute('aria-label', label);
}
