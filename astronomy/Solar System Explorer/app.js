const canvas = document.getElementById('solarCanvas');
const stage = document.getElementById('solarStage');
const status = document.getElementById('solarStatus');

const controls = {
    speed: document.getElementById('solarSpeed'),
    orbits: document.getElementById('solarOrbits'),
    labels: document.getElementById('solarLabels'),
    grid: document.getElementById('solarGrid'),
    trails: document.getElementById('solarTrails'),
    scale: document.getElementById('solarScale'),
    focus: document.getElementById('solarFocus')
};

const readouts = {
    speed: document.getElementById('solarSpeedValue'),
    date: document.getElementById('solarDateReadout'),
    camera: document.getElementById('solarCameraReadout'),
    name: document.getElementById('solarBodyName'),
    type: document.getElementById('solarBodyType'),
    distance: document.getElementById('solarDistance'),
    period: document.getElementById('solarPeriod'),
    velocity: document.getElementById('solarVelocity'),
    radius: document.getElementById('solarRadius')
};

let THREE;
let scene, camera, renderer, root, starfield;
let sunMesh, sunGlow;
let bodies = [];
let orbitLines = [];
let trailLines = [];
let selected = 'sun';
let running = true;
let simDays = 0;
let lastTime = performance.now();
let cameraRadius = 7.5;
let cameraTheta = 0.72;
let cameraPhi = 1.05;
let dragging = false;
let lastPointer = {x: 0, y: 0};
let resizeObserver;

const AU = 149597870.7;
const planets = [
    {id:'mercury',name:'Mercury',type:'terrestrial planet',a:.387,e:.206,T:87.97,radius:2439.7,color:0xaaa79e,size:.035,phase:.2},
    {id:'venus',name:'Venus',type:'terrestrial planet',a:.723,e:.007,T:224.70,radius:6051.8,color:0xd9b26f,size:.055,phase:1.4},
    {id:'earth',name:'Earth',type:'terrestrial planet',a:1,e:.017,T:365.25,radius:6371,color:0x4d83c4,size:.060,phase:2.2},
    {id:'mars',name:'Mars',type:'terrestrial planet',a:1.524,e:.093,T:686.98,radius:3389.5,color:0xc85f46,size:.047,phase:4.0},
    {id:'jupiter',name:'Jupiter',type:'gas giant',a:5.203,e:.049,T:4332.59,radius:69911,color:0xc99d75,size:.145,phase:5.1},
    {id:'saturn',name:'Saturn',type:'gas giant',a:9.537,e:.057,T:10759.22,radius:58232,color:0xd8c39a,size:.125,phase:2.9,rings:true},
    {id:'uranus',name:'Uranus',type:'ice giant',a:19.191,e:.046,T:30688.5,radius:25362,color:0x79c8d0,size:.095,phase:4.7},
    {id:'neptune',name:'Neptune',type:'ice giant',a:30.07,e:.009,T:60182,radius:24622,color:0x4169c7,size:.092,phase:0.8}
];

function loadThree() {
    return import('https://cdn.jsdelivr.net/npm/three@0.179.1/+esm').then(mod => {
        THREE = mod;
        init();
    }).catch(error => {
        console.error(error);
        status.textContent = '3D ENGINE ERROR';
        stage.insertAdjacentHTML('beforeend','<div style="position:absolute;inset:20px;display:grid;place-items:center;color:#9aaabd;text-align:center">3D engine could not be loaded.<br>Check your internet connection and reload SCIEX.</div>');
    });
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01030a);

    camera = new THREE.PerspectiveCamera(48, 1, .01, 400);
    renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0x7b8da8, .12);
    scene.add(ambient);

    createStars();
    createSun();
    createPlanets();
    createGrid();
    createOrbits();
    resize();
    updateFocus(true);
    updateReadouts();
    setStatus('RUNNING');
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    requestAnimationFrame(frame);
}

function createStars() {
    const positions = new Float32Array(6500 * 3);
    for (let i=0;i<6500;i++) {
        const r = 90 + Math.random()*210;
        const theta = Math.random()*Math.PI*2;
        const phi = Math.acos(2*Math.random()-1);
        positions[i*3] = r*Math.sin(phi)*Math.cos(theta);
        positions[i*3+1] = r*Math.cos(phi);
        positions[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const mat = new THREE.PointsMaterial({color:0xb7c9df,size:.055,sizeAttenuation:true,transparent:true,opacity:.82});
    starfield = new THREE.Points(geo,mat);
    scene.add(starfield);
}

function createSun() {
    const geo = new THREE.SphereGeometry(.19,48,32);
    const mat = new THREE.MeshBasicMaterial({color:0xffcf63});
    sunMesh = new THREE.Mesh(geo,mat);
    root.add(sunMesh);

    const glowGeo = new THREE.SphereGeometry(.42,32,20);
    const glowMat = new THREE.MeshBasicMaterial({color:0xffa52f,transparent:true,opacity:.10,blending:THREE.AdditiveBlending,depthWrite:false});
    sunGlow = new THREE.Mesh(glowGeo,glowMat);
    root.add(sunGlow);

    const light = new THREE.PointLight(0xffe5bd, 4.2, 100, 1.3);
    root.add(light);
}

function createPlanets() {
    planets.forEach(p => {
        const group = new THREE.Group();
        const geo = new THREE.SphereGeometry(p.size,32,24);
        const mat = new THREE.MeshStandardMaterial({color:p.color,roughness:.82,metalness:.02});
        const mesh = new THREE.Mesh(geo,mat);
        group.add(mesh);
        if (p.id === 'earth') addEarthAccent(group,p.size);
        if (p.rings) addSaturnRings(group,p.size);
        root.add(group);
        bodies.push({data:p,group,mesh,history:[]});
    });
}

function addEarthAccent(group,size) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(size*1.018,32,24),new THREE.MeshBasicMaterial({color:0xddeeff,transparent:true,opacity:.07,wireframe:true}));
    group.add(cloud);
}

function addSaturnRings(group,size) {
    const geo = new THREE.RingGeometry(size*1.35,size*2.15,64);
    const mat = new THREE.MeshBasicMaterial({color:0xbda983,side:THREE.DoubleSide,transparent:true,opacity:.58});
    const rings = new THREE.Mesh(geo,mat);
    rings.rotation.x = Math.PI/2.4;
    group.add(rings);
}

function createOrbits() {
    planets.forEach(p => {
        const points = [];
        const scale = distanceScale(p.a);
        for (let i=0;i<=180;i++) {
            const E = i/180*Math.PI*2;
            const r = scale*(1-p.e*Math.cos(E));
            const x = r*Math.cos(E);
            const z = r*Math.sqrt(1-p.e*p.e)*Math.sin(E);
            points.push(new THREE.Vector3(x,0,z));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({color:0x34445a,transparent:true,opacity:.48});
        const line = new THREE.LineLoop(geo,mat);
        root.add(line);
        orbitLines.push(line);
    });
}

function createGrid() {
    const size = 64;
    const divisions = 32;
    const grid = new THREE.GridHelper(size,divisions,0x233148,0x121d2c);
    grid.material.transparent = true;
    grid.material.opacity = .28;
    grid.visible = false;
    root.add(grid);
    root.userData.grid = grid;
}

function distanceScale(a) {
    const mode = controls.scale.value;
    if (mode === 'true') return a * .28;
    if (mode === 'compact') return Math.pow(a,.48) * .82;
    return Math.pow(a,.62) * .72;
}

function updateBodies() {
    bodies.forEach(body => {
        const p = body.data;
        const meanAnomaly = p.phase + (simDays / p.T) * Math.PI*2;
        let E = meanAnomaly;
        for (let i=0;i<5;i++) E -= (E-p.e*Math.sin(E)-meanAnomaly)/(1-p.e*Math.cos(E));
        const scale = distanceScale(p.a);
        const r = scale*(1-p.e*Math.cos(E));
        const x = r*Math.cos(E);
        const z = r*Math.sqrt(1-p.e*p.e)*Math.sin(E);
        body.group.position.set(x,0,z);
        body.mesh.rotation.y += .004;

        if (controls.trails.checked) {
            body.history.push(new THREE.Vector3(x,0,z));
            if (body.history.length > 90) body.history.shift();
        } else body.history.length = 0;
    });
    drawTrails();
}

function drawTrails() {
    trailLines.forEach(line => root.remove(line));
    trailLines = [];
    if (!controls.trails.checked) return;
    bodies.forEach(body => {
        if (body.history.length < 2) return;
        const geo = new THREE.BufferGeometry().setFromPoints(body.history);
        const mat = new THREE.LineBasicMaterial({color:body.data.color,transparent:true,opacity:.3});
        const line = new THREE.Line(geo,mat);
        root.add(line);
        trailLines.push(line);
    });
}

function updateOrbitVisibility() {
    orbitLines.forEach(line => line.visible = controls.orbits.checked);
    if (root?.userData.grid) root.userData.grid.visible = controls.grid.checked;
}

function updateLabels() {
    document.querySelectorAll('.solar-planet-label').forEach(e => e.remove());
    if (!controls.labels.checked) return;
    bodies.forEach(body => {
        const label = document.createElement('div');
        label.className = 'solar-planet-label';
        label.textContent = body.data.name;
        label.style.cssText = 'position:absolute;pointer-events:none;color:#aabbd0;font:10px system-ui,sans-serif;background:rgba(3,7,12,.72);border:1px solid #263247;border-radius:4px;padding:3px 5px;transform:translate(-50%,-140%);white-space:nowrap;';
        stage.appendChild(label);
        body.label = label;
    });
}

function projectLabels() {
    if (!controls.labels.checked || !renderer) return;
    const rect = stage.getBoundingClientRect();
    bodies.forEach(body => {
        if (!body.label) return;
        const v = body.group.position.clone().project(camera);
        body.label.style.left = `${(v.x*.5+.5)*rect.width}px`;
        body.label.style.top = `${(-v.y*.5+.5)*rect.height}px`;
        body.label.style.opacity = v.z > 1 ? '0' : '1';
    });
}

function updateFocus(force=false) {
    selected = controls.focus.value;
    const target = selected === 'sun' ? new THREE.Vector3() : bodies.find(b=>b.data.id===selected)?.group.position || new THREE.Vector3();
    camera.userData.target = target.clone();
    if (force) camera.userData.snap = true;
    updateReadouts();
}

function updateCamera() {
    const focus = camera.userData.target || new THREE.Vector3();
    const offset = new THREE.Vector3(
        Math.sin(cameraTheta)*Math.sin(cameraPhi),
        Math.cos(cameraPhi),
        Math.cos(cameraTheta)*Math.sin(cameraPhi)
    ).multiplyScalar(cameraRadius);
    const desired = focus.clone().add(offset);
    if (camera.userData.snap) {
        camera.position.copy(desired);
        camera.userData.snap = false;
    } else camera.position.lerp(desired,.12);
    camera.lookAt(focus);
    readouts.camera.textContent = `CAMERA ${cameraRadius.toFixed(1)} AU / ${selected.toUpperCase()}`;
}

function updateReadouts() {
    readouts.speed.textContent = controls.speed.value;
    readouts.date.textContent = `T + ${simDays.toFixed(1)} d`;
    if (!bodies.length || !THREE) return;
    const body = selected === 'sun' ? null : bodies.find(b=>b.data.id===selected);
    if (!body) {
        readouts.name.textContent='Sun';
        readouts.type.textContent='G-type main-sequence star';
        readouts.distance.textContent='0 AU';
        readouts.period.textContent='—';
        readouts.velocity.textContent='—';
        readouts.radius.textContent='696,340 km';
        return;
    }
    const p=body.data;
    const pos=body.group.position.length();
    const km=pos / distanceScale(1) * AU;
    const v=29.78*Math.sqrt(1/Math.max(.001,p.a));
    readouts.name.textContent=p.name;
    readouts.type.textContent=p.type;
    readouts.distance.textContent=`${(km/AU).toFixed(3)} AU`;
    readouts.period.textContent=`${p.T.toLocaleString()} d`;
    readouts.velocity.textContent=`${v.toFixed(1)} km/s`;
    readouts.radius.textContent=`${p.radius.toLocaleString()} km`;
}

function setStatus(text) { status.textContent=text; }

function resize() {
    if (!renderer) return;
    const w=stage.clientWidth,h=stage.clientHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
}

function frame(now) {
    const dt=Math.min(.05,(now-lastTime)/1000); lastTime=now;
    if (running) simDays += dt*Number(controls.speed.value);
    updateBodies();
    if (starfield) starfield.rotation.y += dt*.002;
    updateCamera();
    projectLabels();
    updateReadouts();
    renderer.render(scene,camera);
    requestAnimationFrame(frame);
}

document.getElementById('solarStart').addEventListener('click',()=>{running=true;setStatus('RUNNING');});
document.getElementById('solarPause').addEventListener('click',()=>{running=false;setStatus('PAUSED');});
document.getElementById('solarReset').addEventListener('click',()=>{simDays=0;running=true;setStatus('RESET');setTimeout(()=>setStatus('RUNNING'),400);});
document.getElementById('solarHome').addEventListener('click',()=>{cameraRadius=7.5;cameraTheta=.72;cameraPhi=1.05;selected='sun';controls.focus.value='sun';updateFocus(true);});
controls.focus.addEventListener('change',()=>updateFocus(true));
controls.scale.addEventListener('change',()=>{if(!root)return; orbitLines.forEach(l=>root.remove(l));orbitLines=[];createOrbits();updateBodies();updateOrbitVisibility();updateFocus(true);});
controls.orbits.addEventListener('change',updateOrbitVisibility);
controls.grid.addEventListener('change',updateOrbitVisibility);
controls.labels.addEventListener('change',updateLabels);
controls.trails.addEventListener('change',()=>bodies.forEach(b=>b.history.length=0));
controls.speed.addEventListener('input',updateReadouts);

stage.addEventListener('pointerdown',e=>{dragging=true;lastPointer={x:e.clientX,y:e.clientY};stage.setPointerCapture(e.pointerId);});
stage.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;lastPointer={x:e.clientX,y:e.clientY};cameraTheta-=dx*.006;cameraPhi=Math.max(.18,Math.min(2.85,cameraPhi+dy*.006));});
stage.addEventListener('pointerup',()=>dragging=false);
stage.addEventListener('pointercancel',()=>dragging=false);
stage.addEventListener('wheel',e=>{e.preventDefault();cameraRadius=Math.max(.55,Math.min(30,cameraRadius*Math.exp(e.deltaY*.001)));},{passive:false});
stage.addEventListener('dblclick',()=>{cameraRadius=selected==='sun'?7.5:3.2;camera.userData.snap=true;});

loadThree();