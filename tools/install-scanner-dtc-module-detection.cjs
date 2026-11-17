const fs = require('fs');
const os = require('os');
const path = require('path');
const asar = require('../_private_dev/source/app_extracted/node_modules/@electron/asar');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, '_private_dev', 'source', 'app_live_extract');
const archivePath = path.join(root, 'Xpressive Autoworks Customer App', 'resources', 'app.asar');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'xpressive-scanner-dtc-'));
const nextArchive = `${archivePath}.scanner-dtc-next`;
const runtimeFiles = [
  ['electron', 'main.cjs'],
  ['electron', 'preload.cjs'],
  ['dist', 'scanner-pid-explorer.js'],
  ['dist', 'scanner-pid-explorer.css'],
  ['dist', 'diagnostics-upgrade.js'],
  ['dist', 'print-preview.js'],
];

function copyScannerPanel(appRoot) {
  for (const [relativeDirectory, fileName] of runtimeFiles.slice(2)) {
    const sourceFileName = fileName === 'diagnostics-upgrade.js' ? 'scanner-upgrade-runtime.js' : fileName;
    fs.copyFileSync(
      path.join(__dirname, sourceFileName),
      path.join(appRoot, relativeDirectory, fileName),
    );
  }
}

function installIntoDirectory(appRoot) {
  copyScannerPanel(appRoot);
}

async function main() {
  for (const name of ['app_live_extract', 'app_extracted']) {
    installIntoDirectory(path.join(root, '_private_dev', 'source', name));
  }

  if (!fs.existsSync(archivePath)) throw new Error(`Customer App archive not found: ${archivePath}`);
  asar.extractAll(archivePath, tempRoot);
  for (const [relativeDirectory, fileName] of runtimeFiles) {
    const sourcePath = path.join(sourceRoot, relativeDirectory, fileName);
    const targetPath = path.join(tempRoot, relativeDirectory, fileName);
    fs.copyFileSync(sourcePath, targetPath);
  }
  copyScannerPanel(tempRoot);

  await asar.createPackageWithOptions(tempRoot, nextArchive, {
    unpack: 'electron/j2534-helper.ps1',
    unpackDir: '{node_modules/@img/sharp-win32-x64,node_modules/@serialport/bindings-cpp}',
  });

  const packedMain = asar.extractFile(nextArchive, 'electron/main.cjs').toString('utf8');
  const packedPreload = asar.extractFile(nextArchive, 'electron/preload.cjs').toString('utf8');
  const packedPanel = asar.extractFile(nextArchive, 'dist/scanner-pid-explorer.js').toString('utf8');
  const packedStyles = asar.extractFile(nextArchive, 'dist/scanner-pid-explorer.css').toString('utf8');
  const packedDiagnostics = asar.extractFile(nextArchive, 'dist/diagnostics-upgrade.js').toString('utf8');
  const packedPrintPreview = asar.extractFile(nextArchive, 'dist/print-preview.js').toString('utf8');
  if (!packedMain.includes("ipcMain.handle('obd:scan-modules'")
    || !packedMain.includes("P20EE: 'Selective catalytic reduction NOx catalyst efficiency below threshold, bank 1.'")
    || !packedMain.includes('manufacturer-controlled range')
    || !packedPreload.includes("scanModules: () => ipcRenderer.invoke('obd:scan-modules')")
    || !packedPanel.includes('Scan Modules & DTCs')
    || !packedPanel.includes('renderDtcGroup')
    || !packedStyles.includes('.pid-module-results')
    || !packedDiagnostics.includes('xpressive-diagnostic-print-history-v1')
    || !packedPrintPreview.includes('print-diagnostics-appendix')) {
    throw new Error('Packaged scanner DTC/module verification failed.');
  }

  const backupPath = `${archivePath}.backup-scanner-dtc-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(archivePath, backupPath);
  fs.renameSync(nextArchive, archivePath);
  console.log(`Updated Customer App scanner. Backup: ${path.relative(root, backupPath)}`);
  console.log('Restart the app to load ECU, PID, and detailed DTC detection.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  if (fs.existsSync(nextArchive)) fs.rmSync(nextArchive, { force: true });
  if (fs.existsSync(`${nextArchive}.unpacked`)) fs.rmSync(`${nextArchive}.unpacked`, { recursive: true, force: true });
  fs.rmSync(tempRoot, { recursive: true, force: true });
});
