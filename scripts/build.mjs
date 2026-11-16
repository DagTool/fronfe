import { copyFile, mkdir, rm, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(project, 'dist');
if (relative(project, output) !== 'dist') throw new Error('Invalid output directory');
const files = ['index.html', 'start.html', 'workspace.html', 'landing.css', 'styles.css', 'landing.js', 'app.js', 'flow.js', 'digix-icon.svg', 'digix-logo.svg', 'digix-logo-dark.svg'];
for (const name of ['landing.js', 'app.js', 'flow.js']) {
  const checked = spawnSync(process.execPath, ['--check', join(project, name)], { stdio: 'inherit' });
  if (checked.status !== 0) throw new Error(`Syntax check failed: ${name}`);
}
for (const name of files) await stat(join(project, name));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of files) await copyFile(join(project, name), join(output, name));
console.log(`Built ${files.length} files to ${output}`);
