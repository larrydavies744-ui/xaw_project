const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function replaceExactlyOnce(source, current, replacement, label) {
  const first = source.indexOf(current);
  if (first < 0) {
    if (source.includes(replacement)) return source;
    throw new Error(`Could not find customer ${label} in the application bundle.`);
  }
  if (source.indexOf(current, first + current.length) >= 0) throw new Error(`Customer ${label} is not unique in the application bundle.`);
  return source.slice(0, first) + replacement + source.slice(first + current.length);
}

for (const name of ['app_live_extract', 'app_extracted']) {
  const dist = path.join(root, '_private_dev', 'source', name, 'dist');
  const assets = path.join(dist, 'assets');
  const bundles = fs.readdirSync(assets).filter(file => /^index-.*\.js$/.test(file));
  if (!bundles.length) throw new Error(`No application bundle found in ${assets}`);
  for (const file of bundles) {
    const bundlePath = path.join(assets, file);
    let source = fs.readFileSync(bundlePath, 'utf8');
    source = replaceExactlyOnce(source, 'b.useEffect(()=>{E.length&&localStorage.setItem(vp,JSON.stringify(E))},[E])', 'b.useEffect(()=>{localStorage.setItem(vp,JSON.stringify(E))},[E])', 'empty-list persistence');
    fs.writeFileSync(bundlePath, source, 'utf8');
  }

  fs.copyFileSync(path.join(__dirname, 'customer-database-runtime.js'), path.join(dist, 'customer-database.js'));
  fs.copyFileSync(path.join(__dirname, 'customer-database-runtime.css'), path.join(dist, 'customer-database.css'));
  const indexPath = path.join(dist, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('customer-database.css')) html = html.replace('</head>', '    <link rel="stylesheet" href="./customer-database.css">\n  </head>');
  if (!html.includes('customer-database.js')) html = html.replace('</body>', '    <script src="./customer-database.js"></script>\n  </body>');
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`Installed customer database upgrades in ${dist}`);
}