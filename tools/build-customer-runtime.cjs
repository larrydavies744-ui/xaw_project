const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, '_private_dev', 'source', 'app_live_extract');
const stage = path.join(root, '_build_cache', 'customer-runtime-stage');
const allowedStageRoot = path.join(root, '_build_cache');
if (!stage.startsWith(`${allowedStageRoot}${path.sep}`)) throw new Error('Unsafe customer stage path.');
if (!fs.existsSync(source)) throw new Error(`Private runtime source not found: ${source}`);
if (fs.existsSync(stage)) fs.rmSync(stage, { recursive: true, force: true });
fs.cpSync(source, stage, { recursive: true });

const removePaths = [
  '.npmrc', 'package-lock.json',
  path.join('dist', 'service-library-data.json'),
  path.join('build', 'generated-builder-config.json'),
  path.join('scripts', 'create-desktop-shortcut.cjs'),
  path.join('scripts', 'deploy-update-feed-webroot.cjs'),
  path.join('scripts', 'generate-bridge-qr.cjs'),
  path.join('scripts', 'pc-bridge-server.cjs'),
  path.join('scripts', 'stage-update-feed.cjs')
];
for (const relative of removePaths) fs.rmSync(path.join(stage, relative), { recursive: true, force: true });

function pruneSourceMaps(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) pruneSourceMaps(fullPath);
    else if (entry.name.endsWith('.map')) fs.rmSync(fullPath, { force: true });
  }
}
pruneSourceMaps(stage);

const forbidden = [];
function audit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(stage, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) audit(fullPath);
    else if (entry.name.endsWith('.map') || relative === '.npmrc' || relative === 'package-lock.json' || relative === 'dist/service-library-data.json') forbidden.push(relative);
  }
}
audit(stage);
if (forbidden.length) throw new Error(`Customer runtime audit failed: ${forbidden.join(', ')}`);
console.log(`Customer runtime stage prepared at ${stage}`);
