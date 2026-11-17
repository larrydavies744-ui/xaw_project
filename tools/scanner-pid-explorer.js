(() => {
  'use strict';
  const state = { pids: [], selected: '', channels: [], samples: [], timer: null, busy: false, moduleScan: null, message: 'Connect a scanner, then detect vehicle PIDs.' };
  const PRINT_DIAGNOSTICS_KEY = 'xpressive-diagnostic-print-history-v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  let panel;
  function saveForPrint(label, scan) {
    try { const saved = JSON.parse(localStorage.getItem(PRINT_DIAGNOSTICS_KEY) || '[]'); const captures = Array.isArray(saved) ? saved : []; const text = document.querySelector('main')?.textContent || ''; const vin = text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)?.[0]?.toUpperCase() || scan?.vehicleInfo?.vin || ''; captures.push({ capturedAt: new Date().toISOString(), label, vin, scan }); localStorage.setItem(PRINT_DIAGNOSTICS_KEY, JSON.stringify(captures.slice(-10))); }
    catch (error) { state.message = `Scan completed, but the local print copy could not be saved: ${error?.message || error}`; }
  }
  function scannerSection() { return [...document.querySelectorAll('section')].find(section => section.querySelector('h2')?.textContent?.trim() === 'Vehicle Diagnostics'); }
  function ensure() {
    const section = scannerSection(); if (!section) return;
    if (!panel) { panel = document.createElement('div'); panel.id = 'scanner-pid-explorer'; panel.className = 'panel full-span scanner-pid-explorer'; }
    if (!panel.isConnected) { section.appendChild(panel); render(); }
  }
  async function discover() {
    if (!window.obdScanner?.discoverPids) { state.message = 'PID discovery requires the packaged desktop scanner.'; return render(); }
    state.busy = true; state.message = 'Querying vehicle supported-PID bitmapsâ€¦'; render();
    try {
      const result = await window.obdScanner.discoverPids(); state.pids = result.pids || [];
      const preferred = state.pids.find(item => item.pid === state.selected) || state.pids.find(item => item.graphable);
      state.selected = preferred?.pid || state.pids[0]?.pid || ''; state.channels = state.selected ? [state.selected] : []; state.samples = [];
      state.message = state.pids.length ? `${state.pids.length} supported Mode 01 PIDs detected through ${result.protocolLabel || 'the connected scanner'}.` : 'The connected ECU did not report supported Mode 01 PIDs.';
    } catch (error) { state.message = error?.message || 'PID discovery failed.'; }
    finally { state.busy = false; render(); }
  }
  async function detectModules() {
    if (!window.obdScanner?.scanModules) { state.message = 'Module detection requires the updated desktop scanner.'; return render(); }
    stop(); state.busy = true; state.moduleScan = null; state.message = 'Querying ECU responders, supported PIDs, and DTC records…'; render();
    try {
      state.moduleScan = await window.obdScanner.scanModules();
      saveForPrint('Full module, PID and DTC scan', { moduleScan: state.moduleScan, livePidSamples: state.samples });
      const count = state.moduleScan.modules?.length || 0;
      state.message = `${count} responding module result${count === 1 ? '' : 's'} received from the vehicle.`;
    } catch (error) { state.message = error?.message || 'Module and DTC detection failed.'; }
    finally { state.busy = false; render(); }
  }
  async function sample() {
    if (!state.channels.length || state.busy) return; state.busy = true;
    try { for (const pid of [...state.channels]) { const result = await window.obdScanner.readPid({ pid, timeoutMs: 1800 }); if (result.value !== null) state.samples.push({ at: Date.now(), pid, value: result.value, unit: result.unit, label: result.label }); else state.message = `PID ${result.pid} returned no decodable value.`; } state.samples = state.samples.slice(-720); const latest = state.samples.at(-1); if (latest) state.message = `Live capture · ${state.channels.length} channel${state.channels.length === 1 ? '' : 's'} · ${latest.label}: ${latest.value} ${latest.unit}`; }
    catch (error) { state.message = error?.message || 'PID read failed.'; stop(); }
    finally { state.busy = false; render(); }
  }
  function start() { if (state.timer || !state.channels.length) return; sample(); state.timer = setInterval(sample, Math.max(1800, state.channels.length * 1000)); render(); }
  function stop() { if (state.timer) clearInterval(state.timer); state.timer = null; render(); }
  function graph() {
    if (!state.samples.length) return '<div class="pid-empty">Select a detected PID and start graphing.</div>';
    return `<div class="pid-channel-grid">${state.channels.map(pid => { const item = state.pids.find(entry => entry.pid === pid); const samples = state.samples.filter(entry => entry.pid === pid).slice(-120); const values = samples.map(entry => entry.value); const min = values.length ? Math.min(...values) : 0; const max = values.length ? Math.max(...values) : 1; const range = Math.max(0.001, max-min); const points = values.map((value,index) => `${(index/Math.max(1,values.length-1)*1000).toFixed(1)},${(240-(value-min)/range*210).toFixed(1)}`).join(' '); return `<article class="pid-channel"><header><div><strong>${esc(item?.label || `PID ${pid}`)}</strong><small>Mode 01 · ${pid} · ${esc(item?.unit || '')}</small></div><button type="button" data-remove-channel="${pid}" aria-label="Remove ${esc(item?.label || `PID ${pid}`)} from graph">Remove</button></header>${values.length ? `<svg viewBox="0 0 1000 260" preserveAspectRatio="none" aria-label="${esc(item?.label || pid)} live graph"><line x1="0" y1="240" x2="1000" y2="240"/><polyline points="${points}"/></svg><div class="pid-range"><span>Min ${min.toFixed(2)}</span><strong>Latest ${values.at(-1).toFixed(2)} ${esc(item?.unit || '')}</strong><span>Max ${max.toFixed(2)}</span></div>` : '<div class="pid-empty">Waiting for first sample…</div>'}</article>`; }).join('')}</div>`;
  }
  function exportCsv() { const rows = [['timestamp','pid','signal','value','unit'], ...state.samples.map(item => [new Date(item.at).toISOString(), item.pid, item.label, item.value, item.unit])]; const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); link.download = `live-diagnostics-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href); }
  function renderDtcGroup(label, group) {
    const codes = group?.codes || [];
    const entries = codes.length ? codes.map(item => {
      const status = item.statusFlags?.length ? `Status: ${item.statusFlags.join(', ')}` : '';
      const detail = [item.description, item.failureTypeByte ? `Failure type byte ${item.failureTypeByte}` : '', status].filter(Boolean).join(' · ');
      return `<li><strong>${esc(item.code)}</strong><span>${esc(detail)}</span></li>`;
    }).join('') : '<li><span>No codes reported</span></li>';
    return `<section class="pid-dtc-group"><h5>${esc(label)} <small>${codes.length}</small></h5>${group?.status ? `<p>${esc(group.status)}</p>` : ''}<ul>${entries}</ul><details><summary>Raw vehicle reply</summary><pre>${esc(group?.raw || 'NO DATA')}</pre></details></section>`;
  }
  function engineArtwork() {
    return `<svg class="pid-engine-art" viewBox="0 0 240 150" role="img" aria-label="Illustration of a vehicle engine"><defs><linearGradient id="pid-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#64748b"/><stop offset="1" stop-color="#293548"/></linearGradient></defs><path d="M59 47h21l12-17h48l14 17h28v17h17v40h-22l-12 16H84l-14-16H48V65h11z" fill="url(#pid-metal)" stroke="#b7c5d8" stroke-width="3" stroke-linejoin="round"/><path d="M97 31v-9h42v9M92 53h52v31H92z" fill="#182230" stroke="#9eafc4" stroke-width="3"/><path d="M101 59h34v19h-34z" fill="#0f1723" stroke="#38bdf8" stroke-width="2"/><path d="M107 65h22M107 71h14" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round"/><circle cx="72" cy="68" r="8" fill="#111827" stroke="#cbd5e1" stroke-width="3"/><circle cx="72" cy="94" r="8" fill="#111827" stroke="#cbd5e1" stroke-width="3"/><path d="M151 52h22v13h-22M150 82h27v12h-27M99 99h43" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/><path d="M50 74H31v20h19M182 76h25" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/><circle cx="210" cy="76" r="5" fill="#38bdf8"/></svg>`;
  }
  function renderSystemOverview(scan, modules) {
    const count = modules.length;
    const engine = modules.find(module => /engine|powertrain|\bpcm\b|\becm\b|\bengine ecu\b/i.test(`${module.name || ''} ${module.targetId || ''}`));
    const responding = count > 0;
    const status = engine ? 'Engine ECU responding' : responding ? 'Vehicle modules responding' : 'No modules responded';
    const badge = engine ? 'ONLINE' : responding ? 'PARTIAL' : 'OFFLINE';
    return `<section class="pid-system-overview" aria-label="Vehicle system overview"><div class="pid-system-heading"><div><span class="pid-kicker">POWERTRAIN OVERVIEW</span><h3>Engine & control system</h3><p>Live scan topology from the connected vehicle</p></div><span class="pid-system-badge ${engine ? 'is-online' : responding ? 'is-partial' : 'is-offline'}"><i></i>${badge}</span></div><div class="pid-system-map"><div class="pid-engine-visual">${engineArtwork()}<div><strong>Engine</strong><span>Powertrain system</span></div></div><div class="pid-link ${responding ? 'is-active' : ''}"><span>${responding ? 'Vehicle network' : 'Awaiting scan'}</span></div><article class="pid-ecu-node ${engine ? 'is-online' : responding ? 'is-partial' : 'is-offline'}"><div class="pid-ecu-icon"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="7" width="20" height="18" rx="3"/><path d="M11 12h10v8H11zM2 12h4m-4 8h4m20-8h4m-4 8h4M12 3v4m8-4v4m-8 18v4m8-4v4"/></svg></div><div><span class="pid-kicker">ENGINE CONTROL</span><strong>${esc(engine?.name || (responding ? 'ECU / PCM' : 'Engine ECU'))}</strong><small>${engine?.addressed ? `Request ${esc(engine.targetId)} · Reply ${esc(engine.responseId)}` : engine ? 'Responding · functional address' : responding ? 'Engine controller not identified' : 'Run Scan Modules & DTCs'}</small></div><b class="pid-node-dot"></b></article></div><div class="pid-system-footer"><span><i class="pid-legend-dot ${responding ? 'active' : ''}"></i>${responding ? `${count} responding module${count === 1 ? '' : 's'}` : 'No scan data yet'}</span><span>${esc(scan?.protocolLabel || 'Scanner not connected')}</span></div></section>`;
  }
  function renderModuleScan() {
    const scan = state.moduleScan;
    if (!scan) return '';
    const modules = scan.modules || [];
    const cards = modules.map(module => {
      const pids = module.pids || [];
      const pidDetails = pids.length ? `<details><summary>${pids.length} supported Mode 01 PIDs</summary><ul class="pid-module-pid-list">${pids.map(item => `<li><code>${esc(item.pid)}</code> ${esc(item.label)}${item.unit && item.unit !== 'raw' ? ` (${esc(item.unit)})` : ''}</li>`).join('')}</ul></details>` : '<p>No supported Mode 01 PIDs reported.</p>';
      const dtcs = module.dtcs || {};
      return `<article class="pid-module"><header><strong>${esc(module.name || `ECU ${module.targetId || ''}`)}</strong><span>${module.addressed ? `Request ${esc(module.targetId)} · Reply ${esc(module.responseId)}` : 'Functional OBD-II; ECU address unavailable'}</span></header>${module.error ? `<p>${esc(module.error)}</p>` : ''}${pidDetails}<div class="pid-dtc-groups">${renderDtcGroup('Stored · Mode 03', dtcs.stored)}${renderDtcGroup('Pending · Mode 07', dtcs.pending)}${renderDtcGroup('Permanent · Mode 0A', dtcs.permanent)}${renderDtcGroup('UDS status · Service 19', dtcs.uds)}</div></article>`;
    }).join('');
    return `<div class="pid-module-results">${renderSystemOverview(scan, modules)}<div class="pid-module-summary"><strong>Scan details</strong><span>${esc(scan.protocolLabel || 'Connected adapter')}</span><span>${esc(scan.scope || '')}</span><time>${esc(scan.scannedAt ? new Date(scan.scannedAt).toLocaleString() : '')}</time></div>${cards || '<p>No responding ECU modules were reported.</p>'}</div>`;
  }
  function render() {
    if (!panel) return; const selected = state.pids.find(item => item.pid === state.selected);
    panel.innerHTML = `<div class="panel-header"><div><div class="mini-label">Vehicle-reported data list</div><h2>PID Detection & Graphing</h2><p class="lead">Detect supported PIDs, responding modules, and vehicle-reported DTC records.</p></div><div class="action-row"><button type="button" data-discover ${state.busy ? 'disabled' : ''}>Detect Vehicle PIDs</button><button type="button" data-modules ${state.busy ? 'disabled' : ''}>Scan Modules & DTCs</button><button type="button" class="primary" data-start ${!state.channels.length || state.timer || state.busy ? 'disabled' : ''}>Start Live Graph</button><button type="button" data-stop ${!state.timer ? 'disabled' : ''}>Stop</button><button type="button" data-clear ${!state.samples.length ? 'disabled' : ''}>Clear</button></div></div>
      <div class="pid-controls"><label>Supported PID<select data-pid ${!state.pids.length ? 'disabled' : ''}><option value="">Select detected PID</option>${state.pids.map(item => `<option value="${item.pid}" ${item.pid === state.selected ? 'selected' : ''}>${item.pid} â€” ${esc(item.label)}${item.graphable ? ` (${esc(item.unit)})` : ' (raw)'}</option>`).join('')}</select><button type="button" data-add-channel ${!selected || !selected.graphable || state.channels.includes(state.selected) || state.channels.length >= 6 ? 'disabled' : ''}>Add graph channel</button></label><div><span>Selected function</span><strong>${selected ? esc(selected.label) : 'None'}</strong><small>${selected ? `Mode 01 PID ${selected.pid} Â· ${esc(selected.unit)}` : 'Run detection first'}</small></div><div><span>Polling</span><strong>${state.timer ? `Live · ${state.channels.length} channels` : 'Stopped'}</strong><small>${state.samples.length} graph samples · sequential reads</small></div></div>
      <div class="pid-message">${esc(state.message)}</div><div class="pid-graph">${graph()}</div>${renderModuleScan()}`;
    panel.querySelector('[data-discover]').onclick = event => { event.preventDefault(); discover(); }; panel.querySelector('[data-modules]').onclick = event => { event.preventDefault(); detectModules(); }; panel.querySelector('[data-start]').onclick = event => { event.preventDefault(); start(); }; panel.querySelector('[data-stop]').onclick = event => { event.preventDefault(); stop(); }; panel.querySelector('[data-clear]').onclick = event => { event.preventDefault(); state.samples=[]; render(); };
    panel.querySelector('[data-add-channel]').onclick = event => { event.preventDefault(); if (selected?.graphable && !state.channels.includes(state.selected) && state.channels.length < 6) { state.channels.push(state.selected); render(); } };
    panel.querySelectorAll('[data-remove-channel]').forEach(button => { button.onclick = event => { event.preventDefault(); const wasRunning = Boolean(state.timer); state.channels = state.channels.filter(pid => pid !== button.dataset.removeChannel); state.samples = state.samples.filter(item => item.pid !== button.dataset.removeChannel); if (wasRunning) { stop(); if (state.channels.length) start(); } else render(); }; });
    if (state.samples.length) { const exportButton = document.createElement('button'); exportButton.type = 'button'; exportButton.textContent = 'Export live CSV'; exportButton.onclick = exportCsv; panel.querySelector('.panel-header .action-row').appendChild(exportButton); }
    panel.querySelector('[data-pid]').onchange = event => { stop(); state.selected=event.target.value; state.samples=[]; render(); };
  }
  new MutationObserver(ensure).observe(document.documentElement,{childList:true,subtree:true}); ensure();
})();
