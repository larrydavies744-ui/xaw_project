const fs = require('fs');
const os = require('os');
const path = require('path');
const asar = require('../_private_dev/source/app_extracted/node_modules/@electron/asar');

const root = path.resolve(__dirname, '..');
const sourceDist = path.join(root, '_private_dev', 'source', 'app_live_extract', 'dist');
const archivePath = path.join(root, 'Xpressive Autoworks Customer App', 'resources', 'app.asar');
const files = ['calendar-archive.js', 'calendar-archive.css'];
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'xpressive-live-calendar-'));
const nextArchive = `${archivePath}.live-calendar-next`;

async function main() {
  if (!fs.existsSync(archivePath)) throw new Error(`Customer App archive not found: ${archivePath}`);
  asar.extractAll(archivePath, tempRoot);
  for (const file of files) fs.copyFileSync(path.join(sourceDist, file), path.join(tempRoot, 'dist', file));
  await asar.createPackageWithOptions(tempRoot, nextArchive, {
    unpack: 'electron/j2534-helper.ps1',
    unpackDir: '{node_modules/@img/sharp-win32-x64,node_modules/@serialport/bindings-cpp}',
  });
  const packedRuntime = asar.extractFile(nextArchive, 'dist/calendar-archive.js').toString('utf8');
  const packedStyles = asar.extractFile(nextArchive, 'dist/calendar-archive.css').toString('utf8');
  if (!packedRuntime.includes('data-calendar-live-clock') || packedRuntime.includes('calendar-week-control-hidden')
    || !packedStyles.includes('.calendar-live-clock') || packedStyles.includes('calendar-past-control-hidden')) {
    throw new Error('Packaged live calendar verification failed.');
  }
  const backupPath = `${archivePath}.backup-live-calendar-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(archivePath, backupPath);
  fs.renameSync(nextArchive, archivePath);
  console.log(`Updated Customer App live calendar. Backup: ${path.relative(root, backupPath)}`);
  console.log('Restart the app to load the live local clock and restored calendar controls.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
