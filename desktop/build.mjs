import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'desktop-dist');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const files = ['index.html', 'app.js', 'style.css'];
const directories = ['physics', 'astronomy', 'astrophysics'];

for (const file of files) {
  await cp(path.join(root, file), path.join(out, file));
}

for (const directory of directories) {
  await cp(path.join(root, directory), path.join(out, directory), { recursive: true });
}

console.log(`SCIEX desktop frontend assembled at ${out}`);
