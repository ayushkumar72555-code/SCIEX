const moduleContainer = document.getElementById('moduleContainer');
const modules = {
 physics:{name:'Interactive Physics Simulator',path:'physics/Interactive%20Physics%20Simulator/'},
 nbody:{name:'N-Body Gravitational Simulation',path:'physics/N-Body%20Gravitational%20Simulation/'},
 emlab:{name:'Electromagnetic Field Laboratory',path:'physics/Electromagnetic%20Field%20Laboratory/'},
 solar:{name:'Solar System Explorer',path:'astronomy/Solar%20System%20Explorer/'},
 coordinates:{name:'Celestial Coordinate Simulator',path:'astronomy/Celestial%20Coordinate%20Simulator/'},
 blackhole:{name:'Black-Hole Visualization',path:'astrophysics/Black-Hole%20Visualization/'}
};
async function loadModule(id){const m=modules[id];if(!m)return;document.querySelectorAll('.nav-item[data-module]').forEach(x=>x.classList.toggle('active',x.dataset.module===id));moduleContainer.innerHTML=`<div class="module-loading">Loading ${m.name}...</div>`;try{const r=await fetch(m.path+'index.html');if(!r.ok)throw Error(`Could not load module HTML: ${r.status}`);moduleContainer.innerHTML=await r.text();await loadCSS(m.path+'style.css');await loadJS(m.path+'app.js')}catch(e){console.error(e);moduleContainer.innerHTML=`<div class="module-error"><h2>Module could not be loaded</h2><p>${e.message}</p></div>`}}
function loadCSS(h){return new Promise((res,rej)=>{if(document.querySelector(`link[href="${h}"]`))return res();const l=document.createElement('link');l.rel='stylesheet';l.href=h;l.onload=res;l.onerror=()=>rej(Error('Could not load CSS: '+h));document.head.appendChild(l)})}
function loadJS(s){return new Promise((res,rej)=>{const x=document.createElement('script');x.src=s+'?t='+Date.now();x.onload=res;x.onerror=()=>rej(Error('Could not load JavaScript: '+s));document.body.appendChild(x)})}
document.querySelectorAll('.nav-item[data-module]').forEach(x=>x.addEventListener('click',()=>loadModule(x.dataset.module)));