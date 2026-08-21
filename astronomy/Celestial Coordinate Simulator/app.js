(()=>{
const PREVIOUS='https://raw.githubusercontent.com/ayushkumar72555-code/SCIEX/1b93e1e1dbebea51c7948d93d6791f35c113cd7c/astronomy/Celestial%20Coordinate%20Simulator/app.js';
const s=document.createElement('script');
s.src=PREVIOUS;
s.onload=()=>{
  const pad=n=>String(n).padStart(2,'0');
  const istParts=()=>{
    const p=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date());
    const o={};p.forEach(x=>o[x.type]=x.value);return o;
  };
  const istInput=()=>{
    const p=istParts();
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  };
  const refreshIST=()=>{
    const clock=document.getElementById('clock');
    const date=document.getElementById('date');
    const live=document.getElementById('live');
    if(!clock||!date)return;
    const p=istParts();
    clock.textContent=`${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} IST`;
    if(live&&live.classList.contains('active')) date.value=istInput();
  };
  const timer=setInterval(()=>{
    refreshIST();
    if(document.getElementById('clock')) return;
    if(!document.getElementById('celestial-coordinate-root')) clearInterval(timer);
  },250);
  const watch=setInterval(()=>{
    const live=document.getElementById('live');
    if(!live)return;
    live.title='Indian Standard Time (IST), UTC+05:30';
    const now=document.getElementById('now');if(now)now.textContent='Use Current IST Time';
    refreshIST();
  },1000);
  setTimeout(()=>clearInterval(watch),86400000);
};
s.onerror=()=>{const r=document.getElementById('celestial-coordinate-root');if(r)r.innerHTML='<div class="cc-error">Celestial Coordinate Simulator could not load its engine.</div>';};
document.head.appendChild(s);
})();