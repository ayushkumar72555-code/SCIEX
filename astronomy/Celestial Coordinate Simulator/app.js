(()=>{
const root=document.getElementById('celestial-coordinate-root');
if(!root)return;
const OBJECTS={
 Polaris:{name:'Polaris',type:'Star',ra:2.5303,dec:89.2641,details:'North Star · Ursa Minor',distance:'≈433 ly',note:'Polaris lies very close to the North Celestial Pole, so its altitude is approximately equal to the observer latitude in the northern hemisphere.'},
 Sirius:{name:'Sirius',type:'Star',ra:6.7525,dec:-16.7161,details:'Brightest star in the night sky · Canis Major',distance:'8.60 ly',note:'Sirius is a useful teaching target because its altitude and azimuth change continuously as Earth rotates.'},
 Vega:{name:'Vega',type:'Star',ra:18.6156,dec:38.7837,details:'A0 V star · Lyra',distance:'25.0 ly',note:'Vega is one of the three stars of the Summer Triangle.'},
 Betelgeuse:{name:'Betelgeuse',type:'Star',ra:5.9195,dec:7.4071,details:'Red supergiant · Orion',distance:'≈550 ly',note:'Betelgeuse lies relatively close to the celestial equator.'},
 Aldebaran:{name:'Aldebaran',type:'Star',ra:4.5987,dec:16.5093,details:'K-type giant · Taurus',distance:'≈65 ly',note:'Aldebaran is the bright eye of Taurus.'},
 Rigel:{name:'Rigel',type:'Star',ra:5.2423,dec:-8.2016,details:'Blue supergiant · Orion',distance:'≈860 ly',note:'Rigel is one of Orion’s brightest stars.'},
 Altair:{name:'Altair',type:'Star',ra:19.8464,dec:8.8683,details:'A7 V star · Aquila',distance:'16.7 ly',note:'Altair is one vertex of the Summer Triangle.'},
 Deneb:{name:'Deneb',type:'Star',ra:20.6905,dec:45.2803,details:'Blue-white supergiant · Cygnus',distance:'≈2,600 ly',note:'Deneb is the northern vertex of the Summer Triangle.'},
 Spica:{name:'Spica',type:'Star',ra:13.4199,dec:-11.1614,details:'Binary stellar system · Virgo',distance:'≈250 ly',note:'Spica lies close to the ecliptic.'},
 Antares:{name:'Antares',type:'Star',ra:16.4901,dec:-26.4319,details:'Red supergiant · Scorpius',distance:'≈550 ly',note:'Antares is a prominent southern sky star.'},
 Sun:{name:'Sun',type:'Star',ra:10.0,dec:0,details:'G2 V star · Solar System primary',distance:'1 AU from Earth',note:'Educational placeholder coordinates. Connect a solar ephemeris later for date-specific precision.'},
 Moon:{name:'Moon',type:'Moon',ra:8.0,dec:10,details:'Earth’s natural satellite',distance:'384,400 km',note:'Educational placeholder coordinates. Connect a lunar ephemeris later for date-specific precision.'},
 Mars:{name:'Mars',type:'Planet',ra:12.0,dec:5,details:'Fourth planet from the Sun',distance:'Variable',note:'Educational placeholder coordinates. Connect a planetary ephemeris later for date-specific precision.'}
};
const ALIASES={'north star':'Polaris','polaris':'Polaris','sirius':'Sirius','vega':'Vega','betelgeuse':'Betelgeuse','aldebaran':'Aldebaran','rigel':'Rigel','altair':'Altair','deneb':'Deneb','spica':'Spica','antares':'Antares','sun':'Sun','moon':'Moon','luna':'Moon','mars':'Mars'};
root.innerHTML=`<div class="ccg-app ccg-sphere-app">
<header class="ccg-header"><div><div class="ccg-kicker">SCIEX / ASTRONOMY</div><h1>Celestial Coordinate Diagram</h1><p>Observer at the center · Horizon system ↔ Equatorial system</p></div><div class="ccg-status">OBSERVER-CENTERED SKY</div></header>
<div class="ccg-searchbar"><input id="cq" list="cl" placeholder="Enter a star, planet or object: Polaris, Sirius, Vega…"/><datalist id="cl"></datalist><button id="go">Generate Diagram</button></div>
<div class="ccg-suggestions">${Object.keys(OBJECTS).slice(0,10).map(k=>`<button data-q="${k}">${k}</button>`).join('')}</div>
<div class="ccg-layout"><section class="ccg-diagram"><div class="ccg-diagram-head"><div><span id="ct" class="ccg-type">STAR</span><h2 id="cn">Polaris</h2></div><div id="cs">North Star · Ursa Minor</div></div><div class="ccg-canvas-wrap ccg-sky-wrap"><svg id="svg" viewBox="0 0 1000 700" role="img" aria-label="Observer centered celestial sphere diagram"></svg></div><div class="ccg-caption" id="note"></div></section>
<aside class="ccg-details"><h3>OBSERVER</h3><label>Latitude <span class="ccg-value" id="latv">26.85° N</span></label><input id="lat" type="range" min="-90" max="90" step="0.1" value="26.85"/><label>Longitude <span class="ccg-value" id="lonv">80.95° E</span></label><input id="lon" type="range" min="-180" max="180" step="0.1" value="80.95"/>
<h3>TIME</h3><input id="date" type="datetime-local"/><button class="ccg-wide" id="now">Use Current Time</button><div class="ccg-time-row"><button id="pause">Pause</button><select id="speed"><option value="1">1×</option><option value="100">100×</option><option value="1000" selected>1000×</option><option value="10000">10000×</option></select></div>
<h3>DIAGRAM LAYERS</h3><label><input id="horizon" type="checkbox" checked/> Horizon</label><label><input id="meridian" type="checkbox" checked/> Local meridian</label><label><input id="equator" type="checkbox" checked/> Celestial equator</label><label><input id="ecliptic" type="checkbox" checked/> Ecliptic</label><label><input id="coords" type="checkbox" checked/> Coordinate labels</label><label><input id="altline" type="checkbox" checked/> Altitude / azimuth</label>
<h3>OBJECT DATA</h3><div id="metrics"></div><div class="ccg-info" id="info"></div></aside></div></div>`;
Object.values(OBJECTS).forEach(o=>{const x=document.createElement('option');x.value=o.name;document.getElementById('cl').appendChild(x)});
const svg=document.getElementById('svg'),q=document.getElementById('cq'),metrics=document.getElementById('metrics');
let latitude=26.85,longitude=80.95,date=new Date(),running=true,speed=1000,current=OBJECTS.Polaris;
const R=275,CX=500,CY=350,rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
function jd(d){return d.getTime()/86400000+2440587.5}
function lst(){let v=18.697374558+24.06570982441908*(jd(date)-2451545)+longitude/15;return((v%24)+24)%24}
function altaz(ra,dec){const H=rad((lst()-ra)*15),p=rad(latitude),d=rad(dec);const alt=Math.asin(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(H));const az=Math.atan2(-Math.sin(H),Math.tan(d)*Math.cos(p)-Math.sin(p)*Math.cos(H));return{alt:deg(alt),az:(deg(az)+360)%360,H:((lst()-ra+12)%24)-12}}
function project(alt,az){const a=rad(alt),z=rad(az),x=R*Math.cos(a)*Math.sin(z),depth=R*Math.cos(a)*Math.cos(z),y=-R*Math.sin(a)+depth*.16;return[CX+x,CY+y,depth]}
function esc(s){return String(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function pathFor(fn,n=240){let pts=[];for(let i=0;i<=n;i++){const p=fn(i/n),v=project(p.alt,p.az);pts.push(`${i?'L':'M'}${v[0].toFixed(1)},${v[1].toFixed(1)}`)}return pts.join(' ')}
function horizonPath(){return pathFor(t=>({alt:0,az:t*360}))}
function equatorPath(){return pathFor(t=>altaz(t*24,0))}
function eclipticRD(lambda){const l=rad(lambda),e=rad(23.43928);const dec=deg(Math.asin(Math.sin(e)*Math.sin(l)));const ra=(deg(Math.atan2(Math.sin(l)*Math.cos(e),Math.cos(l)))/15+24)%24;return[ra,dec]}
function eclipticPath(){return pathFor(t=>{const r=eclipticRD(t*360);return altaz(r[0],r[1])})}
function meridianPath(az){let pts=[];for(let i=0;i<=120;i++){const alt=-90+i*180/120;const p=project(alt,az);pts.push(`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)}return pts.join(' ')}
function altitudeArc(az,alt){return pathFor(t=>({alt:alt*t,az}))}
function azimuthArc(az){let pts=[];for(let i=0;i<=80;i++){const p=project(0,az*i/80);pts.push(`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)}return pts.join(' ')}
function label(x,y,text,cls='label',anchor='middle'){return`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(text)}</text>`}
function line(x1,y1,x2,y2,cls='guide'){return`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`}
function formatRA(v){let h=((v%24)+24)%24,m=(h%1)*60,s=(m%1)*60;return`${Math.floor(h).toString().padStart(2,'0')}h ${Math.floor(m).toString().padStart(2,'0')}m ${s.toFixed(0).padStart(2,'0')}s`}
function formatDec(v){return`${v>=0?'+':'−'}${Math.abs(v).toFixed(2)}°`}
function formatHA(v){return`${v>=0?'+':'−'}${Math.abs(v).toFixed(2)} h`}
function render(){
 const a=altaz(current.ra,current.dec),star=project(a.alt,a.az),h=project(0,a.az),zen=project(90,0),nad=project(-90,0),n=project(0,0),e=project(0,90),s=project(0,180),w=project(0,270),pole=project(Math.abs(latitude),latitude>=0?0:180);
 let g=`<defs><radialGradient id="earth"><stop offset="0" stop-color="var(--ccg-accent)" stop-opacity=".9"/><stop offset="1" stop-color="#07111d" stop-opacity=".2"/></radialGradient></defs>`;
 g+=`<circle cx="${CX}" cy="${CY}" r="${R}" class="sphere"/><circle cx="${CX}" cy="${CY}" r="${R-8}" class="sphere-inner"/>`;
 g+=`<path d="${horizonPath()}" class="horizon"/><path d="${meridianPath(0)}" class="meridian"/><path d="${meridianPath(180)}" class="meridian faint"/><path d="${equatorPath()}" class="equator"/><path d="${eclipticPath()}" class="ecliptic"/>`;
 g+=line(CX,CY,zen[0],zen[1],'axis')+label(zen[0],zen[1]-14,'ZENITH','axis-label')+label(n[0]-18,n[1]+5,'NORTH','cardinal','end')+label(e[0]+18,e[1]+5,'EAST','cardinal','start')+label(s[0]+18,s[1]+5,'SOUTH','cardinal','start')+label(w[0]-18,w[1]+5,'WEST','cardinal','end')+label(nad[0],nad[1]+28,'NADIR','axis-label');
 g+=label(CX+R*.62,CY-R*.65,'LOCAL MERIDIAN','circle-label')+label(CX+R*.46,CY+R*.64,'CELESTIAL EQUATOR','circle-label')+label(CX-R*.67,CY-R*.63,'ECLIPTIC','circle-label');
 g+=`<circle cx="${CX}" cy="${CY}" r="29" class="observer"/><circle cx="${CX}" cy="${CY}" r="7" class="observer-core"/>`+label(CX,CY+51,'OBSERVER','observer-label');
 g+=`<circle cx="${pole[0]}" cy="${pole[1]}" r="5" class="pole"/>`+label(pole[0]+10,pole[1]-8,latitude>=0?'NCP':'SCP','pole-label','start');
 if(a.alt>-90){g+=`<path d="${altitudeArc(a.az,a.alt)}" class="alt-line"/><path d="${azimuthArc(a.az)}" class="az-line"/>`+line(CX,CY,star[0],star[1],'sightline')+`<circle cx="${star[0]}" cy="${star[1]}" r="12" class="target-halo"/><circle cx="${star[0]}" cy="${star[1]}" r="5" class="target"/>`+label(star[0]+16,star[1]-13,current.name,'target-label','start')+label((star[0]+h[0])/2+12,(star[1]+h[1])/2,'ALT '+a.alt.toFixed(1)+'°','measure-label','start')+label(h[0]+14,h[1]+18,'AZ '+a.az.toFixed(1)+'°','measure-label','start')+label(star[0]-14,star[1]+27,'RA '+formatRA(current.ra),'coord-label','end')+label(star[0]-14,star[1]+44,'DEC '+formatDec(current.dec),'coord-label','end');}else g+=label(CX,CY+R+38,current.name+' is below the mathematical horizon','target-label');
 g+=label(CX,CY-R-24,'CELESTIAL SPHERE','sphere-title');svg.innerHTML=g;
 document.getElementById('cn').textContent=current.name;document.getElementById('ct').textContent=current.type.toUpperCase();document.getElementById('cs').textContent=current.details;document.getElementById('note').textContent=current.note;
 metrics.innerHTML=`<div class="ccg-metric"><span>Right Ascension</span><b>${formatRA(current.ra)}</b></div><div class="ccg-metric"><span>Declination</span><b>${formatDec(current.dec)}</b></div><div class="ccg-metric"><span>Altitude</span><b>${a.alt.toFixed(2)}°</b></div><div class="ccg-metric"><span>Azimuth</span><b>${a.az.toFixed(2)}°</b></div><div class="ccg-metric"><span>Hour Angle</span><b>${formatHA(a.H)}</b></div><div class="ccg-metric"><span>Local Sidereal Time</span><b>${formatRA(lst())}</b></div><div class="ccg-metric"><span>Distance</span><b>${current.distance}</b></div>`;
 document.getElementById('info').innerHTML=`At <b>${Math.abs(latitude).toFixed(1)}° ${latitude>=0?'N':'S'}</b>, the ${latitude>=0?'North':'South'} Celestial Pole is ${Math.abs(latitude).toFixed(1)}° above the corresponding horizon. The celestial equator intersects the horizon at East and West.`;applyLayers();
}
function applyLayers(){const qv=id=>document.getElementById(id).checked;const set=(sel,on)=>document.querySelectorAll(sel).forEach(x=>x.style.display=on?'':'none');set('.horizon',qv('horizon'));set('.meridian',qv('meridian'));set('.equator',qv('equator'));set('.ecliptic',qv('ecliptic'));set('.circle-label,.pole-label,.coord-label',qv('coords'));set('.alt-line,.az-line,.measure-label,.sightline,.target-label',qv('altline'))}
function resolve(raw){const k=raw.trim().toLowerCase();if(ALIASES[k])return OBJECTS[ALIASES[k]];return Object.values(OBJECTS).find(o=>o.name.toLowerCase()===k)||Object.values(OBJECTS).find(o=>o.name.toLowerCase().includes(k))}
function choose(raw){const o=resolve(raw);if(!o){document.getElementById('cn').textContent='Not in local catalog';document.getElementById('note').textContent=`No verified local coordinates exist for “${raw}”. The diagram refuses to invent astronomy.`;return}current=o;q.value=o.name;render()}
document.getElementById('go').addEventListener('click',()=>choose(q.value));q.addEventListener('keydown',e=>{if(e.key==='Enter')choose(q.value)});document.querySelectorAll('.ccg-suggestions button').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.q)));
document.getElementById('lat').addEventListener('input',e=>{latitude=+e.target.value;document.getElementById('latv').textContent=`${Math.abs(latitude).toFixed(1)}° ${latitude>=0?'N':'S'}`;render()});
document.getElementById('lon').addEventListener('input',e=>{longitude=+e.target.value;document.getElementById('lonv').textContent=`${Math.abs(longitude).toFixed(1)}° ${longitude>=0?'E':'W'}`;render()});
const dt=document.getElementById('date');dt.value=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);dt.addEventListener('change',e=>{date=new Date(e.target.value);render()});document.getElementById('now').addEventListener('click',()=>{date=new Date();dt.value=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);render()});document.getElementById('pause').addEventListener('click',e=>{running=!running;e.target.textContent=running?'Pause':'Play'});document.getElementById('speed').addEventListener('change',e=>speed=+e.target.value);
['horizon','meridian','equator','ecliptic','coords','altline'].forEach(id=>document.getElementById(id).addEventListener('change',applyLayers));
render();let last=performance.now(),lastDraw=0;function loop(t){const dtSec=Math.min(.1,(t-last)/1000);last=t;if(running){date=new Date(date.getTime()+dtSec*speed*86400000);if(t-lastDraw>80){lastDraw=t;render()}}requestAnimationFrame(loop)}requestAnimationFrame(loop);
})();