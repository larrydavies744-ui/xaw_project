const fs = require('fs');
const path = require('path');
const roots = ['app_live_extract', 'app_extracted'].map((name) => path.join(__dirname, '..', '_private_dev', 'source', name, 'dist'));

function swap(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing ${label}`);
  return source.replace(before, after);
}

const renderFunction = String.raw`  function renderInternalEngineView(service, search) {
    if (!service) return '<div class="service-library-card"><p>Piston/crankshaft procedures are not applicable to this vehicle class.</p></div>';
    const matches = (value) => !search || flatten(value).toLowerCase().includes(search);
    const diagrams = (service.diagrams || []).filter((item) => matches([item.title, item.alt, item.caption]));
    const specifications = (service.specifications || []).filter((item) => matches([item.label, item.value]));
    const procedures = (service.procedures || []).filter((item) => matches([item.title, item.tools, item.steps]));
    const checklist = (service.checklist || []).filter(matches);
    const sources = service.sourceLinks || [];
    const headerMatches = matches([service.title, service.applicability, service.availability, service.warning, service.requiredVehicleData]);
    if (search && !headerMatches && !diagrams.length && !specifications.length && !procedures.length && !checklist.length) return \`<div class="service-library-card"><p>No piston/crankshaft information matched "\${escapeHtml(search)}".</p></div>\`;
    return \`<div class="service-library-list">
      <div class="service-library-card"><span class="service-library-mini-label">GM internal-engine workflow</span><h3>\${escapeHtml(service.title)}</h3><p>\${escapeHtml(service.applicability)}</p><p><strong>Availability:</strong> \${escapeHtml(service.availability)}</p><p><strong>Important:</strong> \${escapeHtml(service.warning)}</p></div>
      <div class="service-library-card"><h3>Required vehicle and component identification</h3><ul>\${(service.requiredVehicleData || []).map((item) => \`<li>\${escapeHtml(item)}</li>\`).join('')}</ul></div>
      \${diagrams.map((item) => \`<figure class="service-library-card service-library-figure"><h3>\${escapeHtml(item.title)}</h3><img src="\${escapeHtml(item.src)}" alt="\${escapeHtml(item.alt)}" loading="lazy"><figcaption>\${escapeHtml(item.caption)}</figcaption></figure>\`).join('')}
      \${specifications.length ? \`<div class="service-library-card"><h3>Exact specifications to retrieve online</h3>\${specifications.map((item) => \`<p><strong>\${escapeHtml(item.label)}:</strong> \${escapeHtml(item.value)}</p>\`).join('')}</div>\` : ''}
      \${procedures.map((item) => \`<div class="service-library-card"><span class="service-library-mini-label">Internal-engine procedure</span><h3>\${escapeHtml(item.title)}</h3><p><strong>Tools:</strong> \${escapeHtml(item.tools || 'N/A')}</p><ol>\${(item.steps || []).map((step) => \`<li>\${escapeHtml(step)}</li>\`).join('')}</ol></div>\`).join('')}
      \${checklist.length ? \`<div class="service-library-card worksheet"><h3>Assembly quality-control checklist</h3><ul>\${checklist.map((item) => \`<li><span class="service-library-checkbox"></span>\${escapeHtml(item)}</li>\`).join('')}</ul></div>\` : ''}
      <div class="service-library-card"><h3>Official online source</h3>\${sources.map((source) => \`<p><a href="\${escapeHtml(source.url)}" target="_blank" rel="noreferrer">\${escapeHtml(source.title)}</a><br>\${escapeHtml(source.scope)} <span class="service-library-mini-label">\${escapeHtml(source.authority || 'OEM')}</span></p>\`).join('')}</div>
    </div>\`;
  }

`;

for (const root of roots) {
  const uiPath = path.join(root, 'service-library-ui.js');
  let ui = fs.readFileSync(uiPath, 'utf8');
  ui = swap(ui, "['online', 'torque', 'engine', 'tuneup', 'starting', 'brakes', 'procedures', 'worksheets']", "['online', 'torque', 'engine', 'tuneup', 'starting', 'brakes', ...(selected.internalEngineService ? ['internal'] : []), 'procedures', 'worksheets']", 'navigation');
  ui = swap(ui, "      ${state.view === 'starting' ? renderStartingChargingView(selected.startingChargingService, search) : ''}\n      ${state.view === 'procedures'", "      ${state.view === 'starting' ? renderStartingChargingView(selected.startingChargingService, search) : ''}\n      ${state.view === 'internal' ? renderInternalEngineView(selected.internalEngineService, search) : ''}\n      ${state.view === 'procedures'", 'view hook');
  ui = swap(ui, "    if (state.view === 'tuneup' || /tune|spark plug|maintenance|misfire|filter|scheduled service/.test(request)) return { label: 'Tune-Up / Maintenance', service: selected.tuneUpService };", "    if (state.view === 'tuneup' || /tune|spark plug|maintenance|misfire|filter|scheduled service/.test(request)) return { label: 'Tune-Up / Maintenance', service: selected.tuneUpService };\n    if (state.view === 'internal' || /piston|ring|crankshaft|main bearing|rod bearing|engine rebuild/.test(request)) return { label: 'Piston / Crankshaft', service: selected.internalEngineService };", 'research routing');
  ui = swap(ui, '  function renderProcedureView(items, search) {', `${renderFunction}  function renderProcedureView(items, search) {`, 'procedure renderer marker');
  ui = swap(ui, "brakes: 'Brake Service', procedures: 'Procedures'", "brakes: 'Brake Service', internal: 'Piston / Crank', procedures: 'Procedures'", 'view label');
  fs.writeFileSync(uiPath, ui);

  const cssPath = path.join(root, 'service-library.css');
  let css = fs.readFileSync(cssPath, 'utf8');
  const figureCss = '.service-library-figure { margin: 0; }\n.service-library-figure img { display: block; width: 100%; max-height: 720px; object-fit: contain; border-radius: 12px; background: #f3f4f6; }\n.service-library-figure figcaption { margin-top: 10px; color: var(--text-muted, #d1d5db); font-size: .88rem; line-height: 1.5; }\n';
  css = swap(css, '.service-library-button.copilot:hover { filter: brightness(1.12); }', `.service-library-button.copilot:hover { filter: brightness(1.12); }\n\n${figureCss}`, 'CSS marker');
  fs.writeFileSync(cssPath, css);
  console.log(`Patched ${root}`);
}
