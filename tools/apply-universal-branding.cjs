const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const master = process.argv[2];
if (!master || !fs.existsSync(master)) throw new Error('A valid master logo path is required.');

async function run() {
  const appRoots = ['app_live_extract', 'app_extracted'].map((name) =>
    path.join(root, '_private_dev', 'source', name)
  );

  for (const appRoot of appRoots) {
    const sharp = require(path.join(appRoot, 'node_modules', 'sharp'));
    const pngToIcoModule = require(path.join(appRoot, 'node_modules', 'png-to-ico'));
    const pngToIco = pngToIcoModule.default || pngToIcoModule;
    const icons = path.join(appRoot, 'build', 'icons');
    const branding = path.join(appRoot, 'dist', 'branding');
    fs.mkdirSync(icons, { recursive: true });
    fs.mkdirSync(branding, { recursive: true });

    const masterTarget = path.join(branding, 'xpressive-universal-logo.png');
    await sharp(master).png({ compressionLevel: 9 }).toFile(masterTarget);
    await sharp(master).resize(1536, 1024, { fit: 'contain', background: '#000000' }).png().toFile(path.join(icons, 'splash-profile-artwork.png'));
    await sharp(master).resize(1200, 800, { fit: 'contain', background: '#000000' }).png().toFile(path.join(icons, 'splash-profile-logo.png'));
    await sharp(master).resize(1024, 1024, { fit: 'contain', background: '#000000' }).png().toFile(path.join(icons, 'app-icon.png'));

    const iconSizes = [16, 24, 32, 48, 64, 128, 256].map((size) =>
      sharp(master).resize(size, size, { fit: 'contain', background: '#000000' }).png().toBuffer()
    );
    fs.writeFileSync(path.join(icons, 'app.ico'), await pngToIco(await Promise.all(iconSizes)));

    const brandingPath = path.join(appRoot, 'build', 'generated-release-branding.json');
    const releaseBranding = JSON.parse(fs.readFileSync(brandingPath, 'utf8'));
    releaseBranding.splashArtworkFileName = 'splash-profile-artwork.png';
    releaseBranding.splashLogoFileName = 'splash-profile-logo.png';
    releaseBranding.iconSourcePath = 'dist/branding/xpressive-universal-logo.png';
    releaseBranding.iconGeneratedFrom = 'xpressive-universal-logo';
    fs.writeFileSync(brandingPath, JSON.stringify(releaseBranding, null, 2) + '\n');

    const bootstrap = `(function(){\n  const logo=new URL('./branding/xpressive-universal-logo.png',location.href).href;\n  const patchSettings=(value)=>{if(!value||typeof value!=='object')return value;value.branding={...(value.branding||{}),logoDataUrl:logo};return value};\n  try{const key='xpressive-repair-suite-settings-v1';const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved)localStorage.setItem(key,JSON.stringify(patchSettings(saved)));}\n  catch{}\n  try{const key='xpressive-repair-suite-shop-profiles-v1';const profiles=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(profiles)){profiles.forEach((profile)=>{if(profile&&profile.settings)patchSettings(profile.settings)});localStorage.setItem(key,JSON.stringify(profiles));}}\n  catch{}\n  window.XPRESSIVE_UNIVERSAL_LOGO=logo;\n})();\n`;
    fs.writeFileSync(path.join(appRoot, 'dist', 'universal-branding.js'), bootstrap);

    const indexPath = path.join(appRoot, 'dist', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    if (!html.includes('./universal-branding.js')) {
      html = html.replace('    <script type="module"', '    <script src="./universal-branding.js"></script>\n    <script type="module"');
      fs.writeFileSync(indexPath, html);
    }
  }

  const storeAssets = path.join(root, '_private_dev', 'microsoft-store-submission', 'assets');
  fs.mkdirSync(storeAssets, { recursive: true });
  const sharp = require(path.join(appRoots[0], 'node_modules', 'sharp'));
  for (const size of [50, 150, 300, 512]) {
    await sharp(master).resize(size, size, { fit: 'contain', background: '#000000' }).png().toFile(path.join(storeAssets, `store-logo-${size}.png`));
  }

  const masterArchive = path.join(root, '_private_dev', 'branding', 'xpressive-universal-logo.png');
  fs.mkdirSync(path.dirname(masterArchive), { recursive: true });
  fs.copyFileSync(master, masterArchive);
  console.log(`Universal branding applied from ${masterArchive}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
