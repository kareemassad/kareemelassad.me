import {assetURL} from './assets.js';
const resumeKey = 'learning-reader.dev-resume.v1';

export async function connectHotReload(config, {capture, restore, stylesApplied, ready = () => true, notice = () => {}}) {
 if (config.mode !== 'local' || !config.hotReload || !globalThis.EventSource) return;
 let saved;
 try {saved = JSON.parse(sessionStorage.getItem(resumeKey) || 'null'); sessionStorage.removeItem(resumeKey);} catch {}
 if (saved?.version === 1 && Date.now() - saved.at < 60000) await restore(saved.snapshot);
 const events = new EventSource(assetURL('__dev/events'));
 let instance, revision, reloading = false;
 const reload = async () => {
  if (reloading) return;
  reloading = true;
  for (let i = 0; !ready() && i < 200; i++) await new Promise(resolve => setTimeout(resolve, 50));
  try {
   if (!ready()) throw Error('The reader is busy. Saved changes will load when you refresh.');
   const snapshot = capture();
   if (snapshot === null) throw Error('Save your PDF before refreshing to load the changes.');
   sessionStorage.setItem(resumeKey, JSON.stringify({version: 1, at: Date.now(), snapshot}));
   location.reload();
  } catch (error) {reloading = false; notice(error.message);}
 };
 events.addEventListener('hello', event => {
  const data = JSON.parse(event.data);
  if (instance && (instance !== data.instance || revision !== data.revision)) reload();
  instance = data.instance; revision = data.revision;
 });
 events.addEventListener('change', async event => {
  const data = JSON.parse(event.data); instance = data.instance; revision = data.revision;
  if (data.kind !== 'css') {await reload(); return;}
  const snapshot = capture();
  try {
   const replacements=data.files.map(file=>[...document.querySelectorAll('link[rel="stylesheet"]')]
    .filter(link => new URL(link.href).pathname === new URL(assetURL(file),location.href).pathname));
   if(replacements.some(links=>!links.length)){await reload();return;}
   await Promise.all(replacements.map(links => Promise.all(links
    .map(link => new Promise((resolve, reject) => {
     const next = link.cloneNode(), url = new URL(link.href); url.searchParams.set('dev', data.revision);
     next.href = url.href; next.onload = () => {link.remove(); resolve();};
     next.onerror = () => {next.remove(); reject(Error('Styles could not reload. Refresh to try again.'));};
     link.after(next);
    })))));
   await stylesApplied(snapshot);
  } catch (error) {notice(error.message);}
 });
 addEventListener('pagehide', () => events.close(), {once: true});
 return events;
}
