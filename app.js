const moduleContainer = document.getElementById('moduleContainer');

const modules = {
    physics: { name: 'Interactive Physics Simulator', path: 'physics/Interactive%20Physics%20Simulator/' },
    nbody: { name: 'N-Body Gravitational Simulation', path: 'physics/N-Body%20Gravitational%20Simulation/' },
    solar: { name: 'Solar System Explorer', path: 'astronomy/Solar%20System%20Explorer/' },
    blackhole: { name: 'Black-Hole Visualization', path: 'astrophysics/Black-Hole%20Visualization/' }
};

let currentModule = null;

async function loadModule(moduleId) {
    const module = modules[moduleId];
    if (!module) return;
    currentModule = moduleId;
    document.querySelectorAll('.nav-item[data-module]').forEach(item => {
        item.classList.toggle('active', item.dataset.module === moduleId);
    });
    moduleContainer.innerHTML = `<div class="module-loading">Loading ${module.name}...</div>`;
    try {
        const htmlResponse = await fetch(module.path + 'index.html');
        if (!htmlResponse.ok) throw new Error(`Could not load module HTML: ${htmlResponse.status}`);
        moduleContainer.innerHTML = await htmlResponse.text();
        await loadCSS(module.path + 'style.css');
        await loadJavaScript(module.path + 'app.js');
    } catch (error) {
        console.error(error);
        moduleContainer.innerHTML = `<div class="module-error"><h2>Module could not be loaded</h2><p>${error.message}</p></div>`;
    }
}

function loadCSS(href) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) return resolve();
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Could not load CSS: ${href}`));
        document.head.appendChild(link);
    });
}

function loadJavaScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${src}?t=${Date.now()}`;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Could not load JavaScript: ${src}`));
        document.body.appendChild(script);
    });
}

document.querySelectorAll('.nav-item[data-module]').forEach(item => {
    item.addEventListener('click', () => loadModule(item.dataset.module));
});

console.log('SCIEX initialized.');