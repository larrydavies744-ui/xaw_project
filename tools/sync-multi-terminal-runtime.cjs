const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist', 'multi-terminal-runtime.js');
const target = path.join(root, '_private_dev', 'source', 'app_extracted', 'dist', 'multi-terminal-runtime.js');
if (!fs.existsSync(source) || !fs.existsSync(target)) throw new Error('Both Windows runtime bundles must exist before syncing the multi-terminal client.');
fs.copyFileSync(source, target);
console.log('Synchronized the multi-terminal client in both Windows runtime bundles.');
