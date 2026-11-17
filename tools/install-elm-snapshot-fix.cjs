const fs = require('fs');
const os = require('os');
const path = require('path');
const asar = require('../_private_dev/source/app_extracted/node_modules/@electron/asar');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, '_private_dev', 'source', 'app_live_extract');
const archivePath = path.join(root, 'Xpressive Autoworks Customer App', 'resources', 'app.asar');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'xpressive-elm-fix-'));
const nextArchive = `${archivePath}.elm-next`;

function extractHandler(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Could not locate handler: ${startMarker}`);
  return source.slice(start, end);
}

function findJavaScriptFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? findJavaScriptFiles(entryPath) : entry.name.endsWith('.js') ? [entryPath] : [];
  });
}

async function main() {
  if (!fs.existsSync(archivePath)) throw new Error(`Customer App archive not found: ${archivePath}`);

  asar.extractAll(archivePath, tempRoot);
  const mainPath = path.join(tempRoot, 'electron', 'main.cjs');
  let mainSource = fs.readFileSync(mainPath, 'utf8');
  const canonicalMain = fs.readFileSync(path.join(sourceRoot, 'electron', 'main.cjs'), 'utf8');
  const startMarker = "ipcMain.handle('obd:list-ports', async () => {";
  const endMarker = "\nipcMain.handle('obd:list-j2534-adapters'";
  const currentHandler = extractHandler(mainSource, startMarker, endMarker);
  const canonicalHandler = extractHandler(canonicalMain, startMarker, endMarker);
  mainSource = mainSource.replace(currentHandler, canonicalHandler);

  const oldTimeout = "storedCodes: await runElmCommand('03', 3000),";
  const newTimeout = "storedCodes: await runElmCommand('03', 10000),";
  if (mainSource.includes(oldTimeout)) mainSource = mainSource.replace(oldTimeout, newTimeout);
  if (!mainSource.includes(newTimeout)) throw new Error('Could not apply the extended first DTC request timeout.');
  fs.writeFileSync(mainPath, mainSource);

  const assetsPath = path.join(tempRoot, 'dist', 'assets');
  let patchedBundles = 0;
  for (const bundlePath of findJavaScriptFiles(assetsPath)) {
    const bundle = fs.readFileSync(bundlePath, 'utf8');
    const nextBundle = bundle.replace('const s=[2e6,115200,38400,9600]', 'const s=[38400,115200,9600,2e6]');
    if (nextBundle !== bundle) {
      fs.writeFileSync(bundlePath, nextBundle);
      patchedBundles += 1;
    } else if (bundle.includes('const s=[38400,115200,9600,2e6]')) {
      patchedBundles += 1;
    }
  }
  if (!patchedBundles) throw new Error('Could not find the ELM baud-detection sequence in the Customer App renderer.');

  await asar.createPackageWithOptions(tempRoot, nextArchive, {
    unpack: 'electron/j2534-helper.ps1',
    unpackDir: '{node_modules/@img/sharp-win32-x64,node_modules/@serialport/bindings-cpp}',
  });

  const packedMain = asar.extractFile(nextArchive, 'electron/main.cjs').toString('utf8');
  if (!packedMain.includes(newTimeout) || !packedMain.includes('productId: port.productId ??')) {
    throw new Error('Customer App archive verification failed.');
  }

  const backupPath = `${archivePath}.backup-elm-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(archivePath, backupPath);
  fs.renameSync(nextArchive, archivePath);
  console.log(`Updated Customer App archive. Backup: ${path.relative(root, backupPath)}`);
  console.log(`Updated ${patchedBundles} renderer bundle(s); restart the app to load the fix.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  if (fs.existsSync(nextArchive)) fs.rmSync(nextArchive, { force: true });
  if (fs.existsSync(`${nextArchive}.unpacked`)) fs.rmSync(`${nextArchive}.unpacked`, { recursive: true, force: true });
  fs.rmSync(tempRoot, { recursive: true, force: true });
});