const fs = require('fs');
const os = require('os');
const path = require('path');
const asar = require('../_private_dev/source/app_extracted/node_modules/@electron/asar');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, '_private_dev', 'source', 'app_live_extract');
const archivePath = path.join(root, 'Xpressive Autoworks Customer App', 'resources', 'app.asar');
const files = [
  ['electron/main.cjs', path.join(sourceRoot, 'electron', 'main.cjs')],
  ['electron/preload.cjs', path.join(sourceRoot, 'electron', 'preload.cjs')],
  ['electron/splash.html', path.join(sourceRoot, 'electron', 'splash.html')],
  ['build/icons/splash-tiger-shop.svg', path.join(sourceRoot, 'build', 'icons', 'splash-tiger-shop.svg')],
  ['dist/index.html', path.join(sourceRoot, 'dist', 'index.html')],
  ['dist/assets/index-DARjiZdl.js', path.join(sourceRoot, 'dist', 'assets', 'index-DARjiZdl.js')],
  ['dist/workspace-popouts.js', path.join(__dirname, 'workspace-popouts-runtime.js')],
  ['dist/workspace-popouts.css', path.join(__dirname, 'workspace-popouts-runtime.css')],
  ['dist/dealer-staff-runtime.js', path.join(__dirname, 'dealer-staff-runtime.js')],
  ['dist/customer-database.js', path.join(__dirname, 'customer-database-runtime.js')],
  ['dist/customer-database.css', path.join(__dirname, 'customer-database-runtime.css')],
];
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'xpressive-workspace-editors-'));
const nextArchive = `${archivePath}.workspace-editors-next`;

async function main() {
  if (!fs.existsSync(archivePath)) throw new Error(`Customer App archive not found: ${archivePath}`);
  for (const name of ['app_live_extract', 'app_extracted']) {
    const dist = path.join(root, '_private_dev', 'source', name, 'dist');
    fs.copyFileSync(path.join(__dirname, 'workspace-popouts-runtime.js'), path.join(dist, 'workspace-popouts.js'));
    fs.copyFileSync(path.join(__dirname, 'workspace-popouts-runtime.css'), path.join(dist, 'workspace-popouts.css'));
    if (name === 'app_extracted') {
      const appRoot = path.join(root, '_private_dev', 'source', name);
      fs.copyFileSync(path.join(sourceRoot, 'electron', 'splash.html'), path.join(appRoot, 'electron', 'splash.html'));
      fs.copyFileSync(path.join(sourceRoot, 'build', 'icons', 'splash-tiger-shop.svg'), path.join(appRoot, 'build', 'icons', 'splash-tiger-shop.svg'));
      fs.copyFileSync(path.join(sourceRoot, 'dist', 'index.html'), path.join(dist, 'index.html'));
    }
  }
  asar.extractAll(archivePath, tempRoot);
  for (const [relative, source] of files) {
    fs.copyFileSync(source, path.join(tempRoot, relative));
  }
  await asar.createPackageWithOptions(tempRoot, nextArchive, {
    unpack: 'electron/j2534-helper.ps1',
    unpackDir: '{node_modules/@img/sharp-win32-x64,node_modules/@serialport/bindings-cpp}',
  });
  const runtime = asar.extractFile(nextArchive, 'dist/workspace-popouts.js').toString('utf8');
  const splash = asar.extractFile(nextArchive, path.join('build', 'icons', 'splash-tiger-shop.svg')).toString('utf8');
  const preload = asar.extractFile(nextArchive, 'electron/preload.cjs').toString('utf8');
  const main = asar.extractFile(nextArchive, 'electron/main.cjs').toString('utf8');
  const html = asar.extractFile(nextArchive, 'dist/index.html').toString('utf8');
  const managerRuntime = asar.extractFile(nextArchive, 'dist/dealer-staff-runtime.js').toString('utf8');
  const workspaceRuntime = asar.extractFile(nextArchive, 'dist/workspace-popouts.js').toString('utf8');
  const checks = [runtime.includes('xpressive-return-home'), runtime.includes('openWorkspaceWindow'),
    preload.includes("ipcRenderer.invoke('desktop:return-home')"), main.includes("ipcMain.handle('desktop:return-home'"),
    main.includes('editor.maximize();') && main.includes('mainWindow.show();'),
    main.includes('BrowserWindow.getAllWindows()') && main.includes("ipcMain.handle('desktop:select-repair-order'"),
    main.includes('screen.getAllDisplays()') && main.includes('editor.setBounds(targetBounds())'),
    preload.includes("selectRepairOrder: (options) => ipcRenderer.invoke('desktop:select-repair-order', options)"),
    workspaceRuntime.includes('Recall a repair order') && workspaceRuntime.includes('desktopApi?.selectRepairOrder'),
    splash.includes('keyTimes="0;.72;1"') && !splash.includes('repeatCount="indefinite"'),
    preload.includes("ipcRenderer.sendSync('repair-suite:restore-local-data')"),
    main.includes("ipcMain.on('repair-suite:save-local-data'") && main.includes('repair-suite-local-data.json'),
    html.includes('restoreLocalData') && html.includes('xpressive-repair-suite-orders-v2'),
    managerRuntime.includes('create-manager') && managerRuntime.includes('xpressive-dealer-staff-v1')];
  if (checks.some((passed) => !passed)) throw new Error(`Packaged workspace editor verification failed: ${checks.join(', ')}`);
  const backup = `${archivePath}.backup-workspace-editors-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(archivePath, backup);
  fs.renameSync(nextArchive, archivePath);
  console.log(`Updated tab editor windows and Home Screen return. Backup: ${path.relative(root, backup)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
