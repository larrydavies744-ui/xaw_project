const fs = require('fs');
const path = require('path');
for (const name of ['app_live_extract', 'app_extracted']) {
  const file = path.join(__dirname, '..', '_private_dev', 'source', name, 'dist', 'service-library-ui.js');
  let source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf('  function renderInternalEngineView');
  const end = source.indexOf('  function renderProcedureView', start);
  if (start < 0 || end < 0) throw new Error(`Internal-engine renderer not found in ${file}`);
  const before = source.slice(start, end);
  const fixed = before.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
  if (before === fixed) throw new Error(`No escaped literals found in ${file}`);
  source = source.slice(0, start) + fixed + source.slice(end);
  fs.writeFileSync(file, source);
  console.log(`Fixed ${file}`);
}
