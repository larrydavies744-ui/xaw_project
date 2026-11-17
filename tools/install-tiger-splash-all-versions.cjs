const fs = require('fs');
const os = require('os');
const path = require('path');
const asar = require('../_private_dev/source/app_extracted/node_modules/@electron/asar');

const root = path.resolve(__dirname, '..');
const canonicalRoot = path.join(root, '_private_dev', 'source', 'app_live_extract');
const canonicalSplash = fs.readFileSync(path.join(canonicalRoot, 'electron', 'splash.html'));
const canonicalTiger = fs.readFileSync(path.join(canonicalRoot, 'build', 'icons', 'splash-tiger-shop.svg'));
const backupSuffix = '.backup-tiger-splash-202607
function patchMain(source, label) {
  if (source.includes('tigerScenePath:') && source.includes("'splash-tiger-shop.svg'") && source.includes('width: 900')) {
    const createIndex = source.indexOf('function createSplashWindow()');
    const tigerIndex = source.indexOf("const splashTigerPath = path.join(__dirname, '..', 'build', 'icons', 'splash-tiger-shop.svg');");
    if (tigerIndex > createIndex) return source;
    throw new Error(`Tiger splash path is outside createSplashWindow: ${label}`);
  }
  const artworkLine = "  const splashArtworkPath = path.join(__dirname, '..', 'build', 'icons', splashArtworkFileName);";
  const artworkQuery = "    artworkPath: fs.existsSync(splashArtworkPath) ? pathToFileURL(splashArtworkPath).toString() : '',";
  if (!source.includes(artworkLine) || !source.includes(artworkQuery) || !source.includes('    width: 540,') || !source.includes('    height: 360,')) {
    throw new Error(`Unsupported splash structure: ${label}`);
  }
  const createIndex = source.indexOf('function createSplashWindow()');
  const beforeCreate = source.slice(0, createIndex);
  let createSection = source.slice(createIndex);
  createSection = createSection.replace(artworkLine, `${artworkLine}\n  const splashTigerPath = path.join(__dirname, '..', 'build', 'icons', 'splash-tiger-shop.svg');`);
  return (beforeCreate + createSection)
    .replace(artworkQuery, `${artworkQuery}\n    tigerScenePath: fs.existsSync(splashTigerPath) ? pathToFileURL(splashTigerPath).toString() : '',`)
    .replace('    width: 540,\n    height: 360,', '    width: 900,\n    height: 560,');
}

function installIntoDirectory(appRoot) {
  const mainPath = path.join(appRoot, 'electron', 'main.cjs');
  if (!fs.existsSync(mainPath)) return;
  fs.writeFileSync(mainPath, patchMain(fs.readFileSync(mainPath, 'utf8'), appRoot));
  fs.writeFileSync(path.join(appRoot, 'electron', 'splash.html'), canonicalSplash);
  fs.mkdirSync(path.join(appRoot, 'build', 'icons'), { recursive: true });
  fs.writeFileSync(path.join(appRoot, 'build', 'icons', 'splash-tiger-shop.svg'), canonicalTiger);
  console.log(`Updated source: ${path.relative(root, appRoot)}`);
}

async function installIntoArchive(archivePath) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'xpressive-tiger-splash-'));
  const nextArchive = `${archivePath}.tiger-next`;
  try {
    asar.extractAll(archivePath, tempRoot);
    installIntoDirectory(tempRoot);
    await asar.createPackageWithOptions(tempRoot, nextArchive, {
      unpack: 'electron/j2534-helper.ps1',
      unpackDir: '{node_modules/@img/sharp-win32-x64,node_modules/@serialport/bindings-cpp}',
    });
    const checkSplash = asar.extractFile(nextArchive, 'electron/splash.html').toString('utf8');
    const checkMain = asar.extractFile(nextArchive, 'electron/main.cjs').toString('utf8');
    const hasTiger = asar.listPackage(nextArchive).some((entry) => entry.replaceAll('\\', '/').endsWith('/build/icons/splash-tiger-shop.svg'));
    if (!checkSplash.includes('tigerScene') || !checkMain.includes('tigerScenePath:') || !hasTiger) {
      throw new Error(`Verification failed: ${archivePath}`);
    }
    const backupPath = `${archivePath}${backupSuffix}`;
    if (!fs.existsSync(backupPath)) fs.copyFileSync(archivePath, backupPath);
    fs.renameSync(nextArchive, archivePath);
    console.log(`Updated archive: ${path.relative(root, archivePath)}`);
  } finally {
    if (fs.existsSync(nextArchive)) fs.rmSync(nextArchive, { force: true });
    if (fs.existsSync(`${nextArchive}.unpacked`)) fs.rmSync(`${nextArchive}.unpacked`, { recursive: true, force: true });
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  installIntoDirectory(path.join(root, '_private_dev', 'source', 'app_live_extract'));
  installIntoDirectory(path.join(root, '_private_dev', 'source', 'app_extracted'));
  const archives = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    const archive = path.join(root, entry.name, 'resources', 'app.asar');
    if (fs.existsSync(archive)) archives.push(archive);
  }
  const unpackedArchive = path.join(root, '_private_dev', 'source', 'app_extracted', 'release', 'win-unpacked', 'resources', 'app.asar');
  if (fs.existsSync(unpackedArchive)) archives.push(unpackedArchive);
  for (const archive of archives) await installIntoArchive(archive);
  console.log(`Tiger splash installed in ${archives.length} packaged desktop versions.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
