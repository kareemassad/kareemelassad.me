import {assetURL} from './assets.js';
export async function siteConfiguration(){
 try{const response=await fetch(assetURL('site-config.json'));if(!response.ok)throw Error();const config=await response.json();if(!['local','static'].includes(config.mode)||!/^[a-f0-9]{64}$/.test(config.codeHash))throw Error();return config;}catch{return {mode:'local',codeHash:null};}
}
export async function offlineCopy(config,notice){
 if(config.mode!=='static')return;
 if(!('serviceWorker' in navigator)){notice('This browser cannot keep an offline reader copy. Online reading is available.');return;}
 notice('Saving the reader for offline use…');
 try{const registration=await navigator.serviceWorker.register(assetURL('sw.js'));
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Offline installation timed out.')),45000),done=value=>{clearTimeout(timer);resolve(value);},watch=worker=>{if(!worker)return;const check=()=>{if(worker.state==='redundant'){clearTimeout(timer);reject(Error('Offline assets could not be saved.'));}};worker.addEventListener('statechange',check);check();};watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));navigator.serviceWorker.ready.then(done,reject);});
  if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
  notice(registration.waiting?'An updated offline copy is ready. Close reader tabs and reopen.':'Offline reader ready. Imported PDFs stay in this browser.');
 }catch{notice('Offline copy could not be saved. Online reading is available; retry after freeing browser storage.');}
}
