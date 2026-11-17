const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const runtime = fs.readFileSync(path.join(__dirname, 'ro-vehicle-selectors-stable.js'));
for (const name of ['app_live_extract', 'app_extracted']) {
  const appRoot = path.join(root, '_private_dev', 'source', name);
  fs.writeFileSync(path.join(appRoot, 'dist', 'ro-vehicle-selectors-stable.js'), runtime);
  const indexPath = path.join(appRoot, 'dist', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('./ro-vehicle-selectors-stable.js')) html = html.replace('</body>', '    <script src="./ro-vehicle-selectors-stable.js"></script>\n  </body>');
  fs.writeFileSync(indexPath, html);
  console.log(`Installed stable RO vehicle selectors in ${appRoot}`);
}
