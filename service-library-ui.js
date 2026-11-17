(function () {
  const STORAGE_KEY = 'xpressive-service-library-state-v4';
  let initAttempts = 0;
  let observerStarted = false;

  function scheduleInit() {
    if (document.getElementById('xpressive-service-library-root')) {
      ensureNavTabsButtons();
      ensureRepairOrderLaunchers();
      return;
    }
    if (document.body) {
      init();
      return;
    }
    if (initAttempts < 300) {
      initAttempts += 1;
      window.setTimeout(scheduleInit, 200);
    }
    if (!observerStarted) startInitObserver();
  }

  function startInitObserver() {
    observerStarted = true;
    const observer = new MutationObserver(() => {
      ensureNavTabsButtons();
      ensureRepairOrderLaunchers();
      if (!document.getElementById('xpressive-service-library-root') && document.body) init();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() {
    if (document.getElementById('xpressive-service-library-root')) return;
    const data = window.XpressiveServiceLibraryData || getFallbackLibraryData();
    if (!document.getElementById('xpressive-service-library-css')) {
      const link = document.createElement('link');
      link.id = 'xpressive-service-library-css';
      link.rel = 'stylesheet';
      link.href = './service-library.css';
      document.head.appendChild(link);
    }
    const panel = document.createElement('section');
    panel.id = 'xpressive-service-library-root';
    panel.className = 'service-library-shell';
    panel.hidden = true;
    document.body.appendChild(panel);
    ensureFloatingLauncher(panel);
    ensureNavTabsButtons();
    ensureTopTabFallback();
    ensureRepairOrderLaunchers();
    renderPanel(panel, data, loadState());
    window.addEventListener('storage', () => renderPanel(panel, data, loadState()));
  }

  function ensureFloatingLauncher(panel) {
    if (document.getElementById('xpressive-service-library-fab')) return;
    const fab = document.createElement('button');
    fab.id = 'xpressive-service-library-fab';
    fab.type = 'button';
    fab.className = 'service-library-fab';
    fab.textContent = 'Service Library';
    fab.addEventListener('click', () => openPanel(panel, 'service-library'));
    document.body.appendChild(fab);
  }

  function openFromAnywhere(mode) {
    const panel = document.getElementById('xpressive-service-library-root');
    if (panel) {
      openPanel(panel, mode);
      return;
    }
    scheduleInit();
    window.setTimeout(() => {
      const nextPanel = document.getElementById('xpressive-service-library-root');
      if (nextPanel) openPanel(nextPanel, mode);
    }, 150);
  }

  function ensureNavTabsButtons() {
    const navTabs = document.querySelector('.horizontal-nav-tabs');
    if (!navTabs) return false;
    if (!document.getElementById('xpressive-service-library-tab')) {
      const serviceButton = document.createElement('button');
      serviceButton.id = 'xpressive-service-library-tab';
      serviceButton.type = 'button';
      serviceButton.className = 'tab horizontal-tab service-library-nav-button';
      serviceButton.innerHTML = '<span>Service Library</span>';
      serviceButton.addEventListener('click', () => openFromAnywhere('service-library'));
      navTabs.appendChild(serviceButton);
    }
    return true;
  }

  function ensureTopTabFallback() {
    const hasNativeTabs = ensureNavTabsButtons();
    const existing = document.getElementById('xpressive-top-tab-fallback');
    if (hasNativeTabs) {
      if (existing) existing.style.display = 'none';
      return;
    }
    if (existing) {
      existing.style.display = 'flex';
      return;
    }
    const wrap = document.createElement('div');
    wrap.id = 'xpressive-top-tab-fallback';
    wrap.className = 'service-library-top-tabs';
    const serviceBtn = document.createElement('button');
    serviceBtn.type = 'button';
    serviceBtn.className = 'service-library-top-tab active';
    serviceBtn.textContent = 'Service Library';
    serviceBtn.addEventListener('click', () => openFromAnywhere('service-library'));
    wrap.appendChild(serviceBtn);
    document.body.appendChild(wrap);
  }

  function ensureRepairOrderLaunchers() {
    document.querySelectorAll('.command-deck-panel.secondary, .hero-card, .panel').forEach((card) => {
      const text = (card.textContent || '').toLowerCase();
      if (!text.includes('repair') && !text.includes('vehicle') && !text.includes('vin')) return;
      if (card.querySelector('.service-library-launcher')) return;
      const launcher = document.createElement('button');
      launcher.type = 'button';
      launcher.className = 'service-library-launcher primary';
      launcher.textContent = 'Link Service Library';
      launcher.addEventListener('click', () => openFromAnywhere('service-library'));
      const actionStack = card.querySelector('.action-stack, .panel-actions');
      (actionStack || card).appendChild(launcher);
    });
  }

  function openPanel(panel, mode = 'service-library') {
    const nextState = { ...loadState(), panelMode: mode === 'repair-guide' ? 'repair-guide' : 'service-library' };
    saveState(nextState);
    panel.hidden = false;
    panel.classList.add('fullscreen');
    panel.dataset.panelMode = nextState.panelMode;
    renderPanel(panel, window.XpressiveServiceLibraryData || getFallbackLibraryData(), nextState);
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closePanel(panel) {
    panel.hidden = true;
    panel.classList.remove('fullscreen');
  }

  function loadState() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        search: typeof parsed.search === 'string' ? parsed.search : '',
        view: typeof parsed.view === 'string' ? parsed.view : 'torque',
        engineId: typeof parsed.engineId === 'string' ? parsed.engineId : '',
        panelMode: typeof parsed.panelMode === 'string' ? parsed.panelMode : 'service-library'
      };
    } catch (error) {
      return { search: '', view: 'torque', engineId: '', panelMode: 'service-library' };
    }
  }

  function saveState(state) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getEngineFamilies(data) {
    if (Array.isArray(data.engineFamilies) && data.engineFamilies.length) return data.engineFamilies;
    return [{ id: 'default', engineFamily: data.engineFamily || 'Chevrolet 3.5L V6 LX9 / LZ4', engine: data.engine || {}, torqueSpecs: data.torqueSpecs || [], procedures: data.procedures || [], worksheets: data.worksheets || [] }];
  }

  function renderPanel(panel, data, state) {
    const roContext = getCurrentRoContext();
    const search = (state.search || '').trim().toLowerCase();
    const families = getEngineFamilies(data);
    const selected = families.find((family) => family.id === state.engineId) || findBestEngineForRo(families, roContext) || families[0];
    const match = scoreEngineForRo(selected, roContext);
    const torqueItems = filterItems(selected.torqueSpecs || [], search, ['title', 'spec', 'notes', 'category', 'keywords']);
    const procedureItems = filterItems(selected.procedures || [], search, ['title', 'summary', 'tools', 'safety', 'steps', 'keywords']);
    const worksheetItems = filterItems(selected.worksheets || [], search, ['title', 'items']);
    const panelMode = state.panelMode === 'repair-guide' ? 'repair-guide' : 'service-library';

    panel.innerHTML = `
      <div class="service-library-header">
        <div class="service-library-title">
          <span class="service-library-eyebrow">XPRESSIVE AUTOWORKS - OFFLINE SERVICE LIBRARY</span>
          <h2>${escapeHtml(panelMode === 'repair-guide' ? 'Repair Guide' : selected.engineFamily)}</h2>
          <p>${escapeHtml(panelMode === 'repair-guide' ? 'Engine manuals, specs, torque, procedures, and worksheets kept local to this workstation.' : 'Searchable engine service data linked to the active repair order context.')}</p>
        </div>
        <div class="service-library-actions">
          <button type="button" class="service-library-button" data-action="close">Close</button>
          <button type="button" class="service-library-button primary" data-action="print">Print / Save as PDF</button>
          <button type="button" class="service-library-button" data-action="copy-link">Copy RO Link</button>
          <button type="button" class="service-library-button" data-action="export-json">Export JSON</button>
        </div>
      </div>
      <div class="service-library-toolbar">
        <input class="service-library-search" type="search" placeholder="Search torque specs, procedures, worksheets" value="${escapeHtml(state.search)}" />
        <select class="service-library-engine-select" data-engine-id>
          ${families.map((family) => `<option value="${escapeHtml(family.id)}" ${family.id === selected.id ? 'selected' : ''}>${escapeHtml(family.engineFamily)}</option>`).join('')}
        </select>
        ${['torque', 'engine', 'procedures', 'worksheets', 'schema'].map((view) => `<button type="button" class="service-library-nav-button ${state.view === view ? 'active' : ''}" data-view="${view}">${viewLabel(view)}</button>`).join('')}
      </div>
      ${renderRoLinkCard(roContext, selected, match)}
      ${state.view === 'engine' ? renderEngineView(selected.engine, selected.engineFamily) : ''}
      ${state.view === 'torque' ? renderTorqueView(torqueItems, search) : ''}
      ${state.view === 'procedures' ? renderProcedureView(procedureItems, search) : ''}
      ${state.view === 'worksheets' ? renderWorksheetView(worksheetItems, search) : ''}
      ${state.view === 'schema' ? renderSchemaView(data, selected) : ''}
    `;

    panel.querySelector('.service-library-search').addEventListener('input', (event) => updatePanel(panel, data, state, { search: event.target.value }));
    panel.querySelector('[data-engine-id]').addEventListener('change', (event) => updatePanel(panel, data, state, { engineId: event.target.value }));
    panel.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => updatePanel(panel, data, state, { view: button.getAttribute('data-view') })));
    panel.querySelector('[data-action="print"]').addEventListener('click', () => window.print());
    panel.querySelector('[data-action="close"]').addEventListener('click', () => closePanel(panel));
    panel.querySelector('[data-action="export-json"]').addEventListener('click', () => exportJson(data));
    panel.querySelector('[data-action="copy-link"]').addEventListener('click', () => copyRoLink(selected, roContext));
  }

  function updatePanel(panel, data, state, patch) {
    const nextState = { ...state, ...patch };
    saveState(nextState);
    renderPanel(panel, data, nextState);
  }

  function filterItems(items, search, keys) {
    if (!search) return items;
    return items.filter((item) => keys.some((key) => flatten(item[key]).toLowerCase().includes(search)));
  }

  function flatten(value) {
    return Array.isArray(value) ? value.join(' ') : String(value || '');
  }

  function renderRoLinkCard(roContext, selected, match) {
    const status = match.score > 0 ? `Matched ${match.hits.join(', ')}` : 'No exact engine match detected yet';
    return `
      <div class="service-library-ro-card">
        <div>
          <span class="service-library-mini-label">Repair Order Link</span>
          <strong>${escapeHtml(roContext.summary || 'No active RO text detected')}</strong>
          <p>${escapeHtml(status)}. Selected library record: ${escapeHtml(selected.engineFamily)}.</p>
        </div>
        <div class="service-library-link-meta">
          <span>Offline-first</span>
          <span>JSON KB v${escapeHtml((window.XpressiveServiceLibraryData || {}).version || 1)}</span>
          <span>PDF via print</span>
        </div>
      </div>
    `;
  }

  function renderEngineView(engine, engineFamily) {
    const fields = [
      ['Application', engine.application || engineFamily], ['Years', engine.years], ['Displacement', engine.displacement], ['Configuration', engine.configuration],
      ['Induction', engine.induction], ['Horsepower / Torque', `${engine.horsepower || 'N/A'} / ${engine.torque || 'N/A'}`], ['Oil', `${engine.oilCapacity || 'N/A'} - ${engine.recommendedOil || 'N/A'}`],
      ['Compression / Bore x Stroke', `${engine.compression || 'N/A'} - ${engine.boreStroke || 'N/A'}`], ['Firing Order', engine.firingOrder], ['Coolant', engine.coolant], ['Spark Plugs', engine.sparkPlugs], ['Shop Note', engine.notes]
    ];
    return `<div class="service-library-grid">${fields.map(([label, value]) => `<div class="service-library-card"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(value || 'N/A')}</p></div>`).join('')}</div>`;
  }

  function renderTorqueView(items, search) {
    return `<div class="service-library-list">${items.length ? items.map((item) => `<div class="service-library-card"><span class="service-library-mini-label">${escapeHtml(item.category || 'Torque')}</span><h3>${escapeHtml(item.title)}</h3><p><strong>Spec:</strong> ${escapeHtml(item.spec)}</p><p>${escapeHtml(item.notes || '')}</p></div>`).join('') : `<div class="service-library-card"><p>No torque specs matched "${escapeHtml(search)}".</p></div>`}</div>`;
  }

  function renderProcedureView(items, search) {
    return `<div class="service-library-list">${items.length ? items.map((item) => `<div class="service-library-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary || '')}</p><p><strong>Time:</strong> ${escapeHtml(item.time || 'N/A')} - <strong>Tools:</strong> ${escapeHtml(item.tools || 'N/A')}</p>${item.safety ? `<p><strong>Safety:</strong> ${escapeHtml(item.safety)}</p>` : ''}<ol>${(item.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></div>`).join('') : `<div class="service-library-card"><p>No procedures matched "${escapeHtml(search)}".</p></div>`}</div>`;
  }

  function renderWorksheetView(items, search) {
    return `<div class="service-library-list">${items.length ? items.map((item) => `<div class="service-library-card worksheet"><h3>${escapeHtml(item.title)}</h3><ul>${(item.items || []).map((entry) => `<li><span class="service-library-checkbox"></span>${escapeHtml(entry)}</li>`).join('')}</ul></div>`).join('') : `<div class="service-library-card"><p>No worksheets matched "${escapeHtml(search)}".</p></div>`}</div>`;
  }

  function renderSchemaView(data, selected) {
    return `<div class="service-library-list"><div class="service-library-card"><h3>Knowledge-Base Structure</h3><pre>${escapeHtml(JSON.stringify({ version: data.version, offline: data.offline, schema: data.schema, selectedEngineKeys: Object.keys(selected) }, null, 2))}</pre></div></div>`;
  }

  function getCurrentRoContext() {
    const selectors = ['.view-stage-header-meta', '.command-deck-panel.secondary', '.hero-card', '[data-repair-order]', '[data-vin]', 'main'];
    const chunks = selectors.map((selector) => document.querySelector(selector)?.textContent?.trim()).filter(Boolean);
    const text = chunks.join(' ').replace(/\s+/g, ' ').slice(0, 900);
    return { summary: text || '', text: text.toLowerCase() };
  }

  function findBestEngineForRo(families, roContext) {
    return families.map((family) => ({ family, match: scoreEngineForRo(family, roContext) })).sort((a, b) => b.match.score - a.match.score)[0]?.match.score > 0 ? families.map((family) => ({ family, match: scoreEngineForRo(family, roContext) })).sort((a, b) => b.match.score - a.match.score)[0].family : null;
  }

  function scoreEngineForRo(family, roContext) {
    const text = roContext.text || '';
    const hints = family.repairOrderLinks || {};
    const hits = [];
    [...(hints.makes || []), ...(hints.engineCodes || []), ...(hints.vehicleTextTokens || [])].forEach((token) => {
      if (token && text.includes(String(token).toLowerCase())) hits.push(token);
    });
    return { score: hits.length, hits };
  }

  function copyRoLink(selected, roContext) {
    const value = `XPRESSIVE AUTOWORKS Service Library link: ${selected.engineFamily} | RO context: ${roContext.summary || 'No active RO text detected'}`;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value);
  }

  function exportJson(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'xpressive-service-library.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function viewLabel(view) {
    return ({ torque: 'Torque Specs', engine: 'Engine Specs', procedures: 'Procedures', worksheets: 'Worksheets', schema: 'KB Schema' })[view] || view;
  }

  function getFallbackLibraryData() {
    return { version: 1, offline: true, engineFamilies: [{ id: 'fallback', engineFamily: 'Offline Repair Guide Fallback', engine: { notes: 'Packaged dataset unavailable.' }, torqueSpecs: [], procedures: [], worksheets: [] }] };
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
  }

  window.addEventListener('load', scheduleInit);
  window.addEventListener('DOMContentLoaded', scheduleInit);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const panel = document.getElementById('xpressive-service-library-root');
      if (panel && !panel.hidden) closePanel(panel);
    }
  });
  scheduleInit();
})();
