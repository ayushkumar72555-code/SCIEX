const canvas = document.getElementById('blackholeCanvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('blackholeStatus');

const controls = {
    mass: document.getElementById('bhMass'),
    inclination: document.getElementById('bhInclination'),
    diskSize: document.getElementById('bhDiskSize'),
    brightness: document.getElementById('bhDiskBrightness'),
    photon: document.getElementById('showPhotonSphere'),
    lensing: document.getElementById('showLensing'),
    grid: document.getElementById('showGrid'),
    labels: document.getElementById('showLabels')
};

const values = {
    mass: document.getElementById('bhMassValue'),
    inclination: document.getElementById('bhInclinationValue'),
    diskSize: document.getElementById('bhDiskSizeValue'),
    brightness: document.getElementById('bhDiskBrightnessValue'),
    rs: document.getElementById('bhRs'),
    photon: document.getElementById('bhPhoton'),
    camera: document.getElementById('cameraReadout')
};

let running = true;
let animationTime = 0;
let lastFrame = performance.now();
let resizeObserver;

const G = 6.67430e-11;
const C = 299792458;
const MSUN = 1.98847e30;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function formatMillions(km) {
    return `${(km / 1e6).toFixed(2)} million km`;
}

function updateReadouts() {
    const mass = Number(controls.mass.value);
    const inclination = Number(controls.inclination.value);
    const diskSize = Number(controls.diskSize.value);
    const brightness = Number(controls.brightness.value);
    const rsKm = (2 * G * (mass * 1e6) * MSUN / (C * C)) / 1000;

    values.mass.textContent = mass.toFixed(1);
    values.inclination.textContent = inclination;
    values.diskSize.textContent = diskSize.toFixed(1);
    values.brightness.textContent = brightness.toFixed(1);
    values.rs.textContent = formatMillions(rsKm);
    values.photon.textContent = '1.50 rₛ';
    values.camera.textContent = `Inclination ${inclination}°`;
}

function starField(w, h) {
    const count = Math.floor((w * h) / 7000);
    const seed = 417;
    let s = seed;
    const rand = () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
    for (let i = 0; i < count; i++) {
        const x = rand() * w;
        const y = rand() * h;
        const r = rand() < 0.92 ? 0.55 : 1.1 + rand() * 1.1;
        const a = 0.25 + rand() * 0.7;
        ctx.fillStyle = `rgba(210,225,245,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGrid(cx, cy, scale) {
    if (!controls.grid.checked) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(100,130,165,.10)';
    ctx.lineWidth = 1;
    for (let r = scale * 0.7; r < scale * 6; r += scale * 0.7) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.34, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function drawLensingArcs(cx, cy, shadow) {
    if (!controls.lensing.checked) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 7; i++) {
        const r = shadow * (1.25 + i * 0.13);
        ctx.strokeStyle = `rgba(120,155,205,${0.035 + i * 0.008})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * (0.12 + i * 0.012), Math.PI * (1.75 - i * 0.01));
        ctx.stroke();
    }
    ctx.restore();
}

function drawAccretionDisk(cx, cy, shadow, diskRadius, inclination, brightness) {
    const inner = shadow * 1.72;
    const outer = shadow * diskRadius;
    const tilt = Math.max(0.12, Math.sin(inclination * Math.PI / 180));
    const bands = 46;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.translate(cx, cy);
    ctx.scale(1, tilt);

    for (let i = bands; i >= 0; i--) {
        const t = i / bands;
        const r = inner + (outer - inner) * t;
        const hot = Math.pow(1 - t, 0.55);
        const pulse = 0.92 + 0.08 * Math.sin(animationTime * 1.8 + i * 0.38);
        const alpha = Math.min(0.8, (0.025 + hot * 0.075) * brightness * pulse);
        const red = Math.round(255);
        const green = Math.round(105 + 125 * hot);
        const blue = Math.round(32 + 175 * hot);
        const stretch = 1 + 0.22 * (1 - t);

        ctx.beginPath();
        ctx.ellipse(0, 0, r * stretch, r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${red},${green},${blue},${alpha})`;
        ctx.lineWidth = Math.max(2, outer * 0.018 * (1 - t * 0.55));
        ctx.stroke();
    }

    for (let i = 0; i < 150; i++) {
        const u = (i * 0.61803398875) % 1;
        const r = inner + u * (outer - inner);
        const a = (i * 2.399963) + animationTime * (0.25 + 0.7 * (1 - u));
        const x = Math.cos(a) * r * (1 + 0.22 * (1 - u));
        const y = Math.sin(a) * r;
        const hot = 1 - u;
        const doppler = 0.35 + 0.65 * Math.max(0, Math.cos(a));
        ctx.fillStyle = `rgba(255,${Math.round(120 + 110 * hot)},${Math.round(50 + 150 * doppler)},${0.04 + hot * 0.14})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.7 + hot * 1.4, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawPhotonSphere(cx, cy, shadow) {
    if (!controls.photon.checked) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,205,120,.32)';
    ctx.setLineDash([3, 7]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, shadow / 1.30 * 1.50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function drawBlackHole(cx, cy, shadow) {
    const glow = ctx.createRadialGradient(cx, cy, shadow * 0.72, cx, cy, shadow * 1.42);
    glow.addColorStop(0, 'rgba(0,0,0,1)');
    glow.addColorStop(0.56, 'rgba(0,0,0,1)');
    glow.addColorStop(0.74, 'rgba(10,7,5,.96)');
    glow.addColorStop(1, 'rgba(255,150,45,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, shadow * 1.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(cx, cy, shadow, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,190,100,.55)';
    ctx.lineWidth = Math.max(1, shadow * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, shadow * 1.012, 0, Math.PI * 2);
    ctx.stroke();
}

function drawLabels(cx, cy, shadow) {
    if (!controls.labels.checked) return;
    ctx.save();
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = '#8798ad';
    ctx.strokeStyle = 'rgba(100,120,145,.45)';
    ctx.lineWidth = 1;
    const line = (x1, y1, x2, y2, text, tx, ty) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.fillText(text, tx, ty);
    };
    line(cx + shadow * 1.02, cy, cx + shadow * 2.0, cy - 30, 'Black-hole shadow', cx + shadow * 2.05, cy - 33);
    line(cx - shadow * 1.5, cy + shadow * .2, cx - shadow * 2.3, cy + shadow * .65, 'Accretion disk', cx - shadow * 3.15, cy + shadow * .85);
    ctx.fillStyle = '#b9c7d8';
    ctx.fillText('Event horizon', cx - shadow * .55, cy + 4);
    ctx.restore();
}

function render() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createRadialGradient(w * .5, h * .45, 0, w * .5, h * .5, Math.max(w, h) * .75);
    bg.addColorStop(0, '#0b101a');
    bg.addColorStop(1, '#010207');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    starField(w, h);

    const cx = w * .52;
    const cy = h * .48;
    const shadow = Math.min(w, h) * 0.105;
    const inclination = Number(controls.inclination.value);
    const diskRadius = Number(controls.diskSize.value);
    const brightness = Number(controls.brightness.value);

    drawGrid(cx, cy, shadow);
    drawLensingArcs(cx, cy, shadow);
    drawAccretionDisk(cx, cy, shadow, diskRadius, inclination, brightness);
    drawPhotonSphere(cx, cy, shadow);
    drawBlackHole(cx, cy, shadow);
    drawLabels(cx, cy, shadow);
}

function frame(now) {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    if (running) animationTime += dt;
    render();
    requestAnimationFrame(frame);
}

function setStatus(text) {
    status.textContent = text;
}

document.getElementById('blackholeStart').addEventListener('click', () => {
    running = true;
    setStatus('RUNNING');
});
document.getElementById('blackholePause').addEventListener('click', () => {
    running = false;
    setStatus('PAUSED');
});
document.getElementById('blackholeReset').addEventListener('click', () => {
    animationTime = 0;
    running = true;
    setStatus('RESET');
    setTimeout(() => setStatus('RUNNING'), 450);
});
document.getElementById('blackholeFullscreen').addEventListener('click', () => {
    document.querySelector('.blackhole-app').classList.toggle('bh-fullscreen');
    setTimeout(resizeCanvas, 40);
});

Object.values(controls).forEach(control => {
    if (!control || control.tagName === 'INPUT') {
        if (control) control.addEventListener('input', updateReadouts);
    }
});

[controls.photon, controls.lensing, controls.grid, controls.labels].forEach(control => {
    control.addEventListener('change', render);
});

resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(canvas.parentElement);
updateReadouts();
resizeCanvas();
setStatus('RUNNING');
requestAnimationFrame(frame);