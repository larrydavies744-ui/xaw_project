(function () {
  'use strict';
  const api = window.obdScanner;
  if (!api?.supported) return;
  const PRE_SCAN_KEY = 'xpressive-scanner-pro-prescan-v1';
  const PRINT_DIAGNOSTICS_KEY = 'xpressive-diagnostic-print-history-v1';
  let busy = false;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const codesFrom = (scan) => [...(scan?.codes || []), ...(scan?.pendingCodes || []), ...(scan?.permanentCodes || [])].map((item) => item.code || item).filter(Boolean);
  const formatValue = (value) => value === null || value === undefined || value === '' ? 'Not reported' : String(value);
  function saveDiagnosticForPrint(label, scan) {
    const existing = JSON.parse(localStorage.getItem(PRINT_DIAGNOSTICS_KEY) || '[]');
    const captures = Array.isArray(existing) ? existing : [];
    captures.push({ capturedAt: new Date().toISOString(), label, vin: scan?.vehicleInfo?.vin || getRoContext().vin || '', scan });
    localStorage.setItem(PRINT_DIAGNOSTICS_KEY, JSON.stringify(captures.slice(-10)));
  }

  function getRoContext() {
    const text = document.querySelector('main')?.innerText?.replace(/\s+/g, ' ').slice(0, 1800) || '';
    const vin = text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)?.[0] || '';
    return { vin, text };
  }

  function serviceFunctions() {
    return [
      ['Oil-life / maintenance reset', 'OEM enhanced', 'Retrieve the exact ignition state, menu or scan-tool reset routine and verification criteria.'],
      ['Electronic parking brake service mode', 'OEM bidirectional', 'Retrieve safe enter/exit service-mode steps, charger requirement and rear-caliper verification.'],
      ['ABS automated bleed', 'OEM bidirectional', 'Retrieve hydraulic sequence, fluid requirement, pump/solenoid routine and final manual bleed.'],
      ['Steering-angle calibration', 'OEM bidirectional', 'Retrieve prerequisites, centering/alignment requirements, calibration and DTC verification.'],
      ['TPMS learn / sensor registration', 'OEM enhanced', 'Retrieve trigger method, sensor frequency/type, learn order and confirmation behavior.'],
      ['Throttle / idle relearn', 'OEM enhanced', 'Retrieve cleaning restrictions, temperature/load prerequisites and relearn verification.'],
      ['Battery registration / energy reset', 'OEM enhanced', 'Retrieve battery technology/capacity coding, registration routine and power-supply requirements.'],
      ['Diesel particulate-filter regeneration', 'OEM bidirectional — high risk', 'Retrieve soot/load limits, exhaust-temperature hazards, abort criteria and stationary/road procedure.'],
      ['Injector coding / contribution reset', 'OEM enhanced', 'Retrieve injector code format/location, cylinder mapping, programming and balance verification.'],
      ['Transmission adaptive reset / relearn', 'OEM bidirectional', 'Retrieve temperature prerequisites, reset authority and exact drive-cycle procedure.']
    ];
  }

  function renderPanel(panel) {
    panel.innerHTML = `<div class="scanner-pro-header"><div><span class="scanner-pro-eyebrow">CAPABILITY-GATED DIAGNOSTICS</span><h2>Scanner Pro & Service Functions</h2><p>Use generic OBD functions where supported. Manufacturer service routines require the exact VIN, module, adapter and current OEM procedure.</p></div><span class="scanner-pro-state" data-scanner-status>Ready</span></div>
      <div class="scanner-pro-actions">
        <button data-scan-action="full">Full pre-scan</button><button data-scan-action="scan-modules">Scan common CAN modules</button><button data-scan-action="readiness">VIN & readiness</button><button data-scan-action="freeze">Freeze-frame</button><button data-scan-action="mode06">Mode $06 monitors</button><button data-scan-action="post">Post-scan comparison</button><button data-scan-action="export">Export scan report</button>
      </div>
      <div class="scanner-pro-result" data-scanner-result><p>Connect an adapter, then run a pre-scan. J2534 provides the best path for addressed manufacturer diagnostics; ELM327 supports generic emissions functions.</p></div>
      <div class="scanner-pro-uds"><div><span class="scanner-pro-eyebrow">READ-ONLY ENHANCED DIAGNOSTICS</span><h3>Addressed UDS Reads</h3><p>Best supported through J2534 or DoIP; ELM support depends on the adapter. Uses the adapter default target unless you provide a vehicle-specific ECU target. DoIP uses a logical target address; J2534 uses CAN IDs.</p></div><div class="scanner-pro-uds-addresses"><label>Target address<input data-uds-target maxlength="8" placeholder="Adapter default"></label><label>Response CAN ID<input data-uds-response maxlength="8" placeholder="Optional"></label></div><div class="scanner-pro-actions"><button data-uds-request="22 F1 90">Read ECU VIN</button><button data-uds-request="19 02 FF">Read stored DTC status</button></div><pre data-uds-result>Results from these reads are raw ECU responses. Addressing and DID support vary by vehicle.</pre></div>
      <div class="scanner-pro-service-grid">${serviceFunctions().map(([name, tier, purpose], index) => `<article><span>${escapeHtml(tier)}</span><h3>${escapeHtml(name)}</h3><p>${escapeHtml(purpose)}</p><button data-service-index="${index}">Pull exact OEM procedure</button></article>`).join('')}</div>
      <p class="scanner-pro-warning">Safety lock: this workspace does not send guessed bidirectional commands. Confirm vehicle voltage support, hazards, module address, security access and the exact OEM routine before execution.</p>`;
    panel.querySelectorAll('[data-scan-action]').forEach((button) => button.addEventListener('click', () => runScanAction(panel, button.dataset.scanAction)));
    panel.querySelectorAll('[data-uds-request]').forEach((button) => button.addEventListener('click', () => runUdsRequest(panel, button.dataset.udsRequest)));
    panel.querySelectorAll('[data-service-index]').forEach((button) => button.addEventListener('click', () => researchService(serviceFunctions()[Number(button.dataset.serviceIndex)])));
  }

  async function runUdsRequest(panel, requestHex) {
    if (busy) return;
    const result = panel.querySelector('[data-uds-result]');
    const targetId = panel.querySelector('[data-uds-target]').value.trim().toUpperCase();
    const responseId = panel.querySelector('[data-uds-response]').value.trim().toUpperCase();
    if (targetId && !/^(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{8})$/.test(targetId)) {
      result.textContent = 'Enter an 11-bit/29-bit CAN ID or a 4-digit DoIP logical address.';
      return;
    }
    if (responseId && !/^(?:[0-9A-F]{3}|[0-9A-F]{8})$/.test(responseId)) {
      result.textContent = 'Response CAN ID must be 3 or 8 hexadecimal characters.';
      return;
    }
    setBusy(panel, 'Reading ECU…');
    result.textContent = 'Waiting for an ECU response…';
    try {
      const response = await api.sendRequest({ requestHex, timeoutMs: 4500, targetId, responseId });
      const detail = requestHex === '22 F1 90' ? decodeUdsVin(response.raw) : decodeUdsDtcs(response.raw);
      saveDiagnosticForPrint('Addressed UDS read', { protocolLabel: response.protocolLabel, requestHex: response.requestHex, targetId: response.targetId, responseId: response.responseId, detail, raw: response.raw });
      result.textContent = `${response.protocolLabel || 'Diagnostic adapter'}\nRequest: ${response.requestHex}\nTarget: ${response.targetId || 'adapter default'}\nResponse ID: ${response.responseId || 'not reported'}\n${detail}\nRaw ECU response: ${response.raw || 'NO DATA'}`;
      finish(panel, 'Read complete');
    } catch (error) {
      result.textContent = error?.message || 'The ECU read failed.';
      finish(panel, 'Read needs attention');
    }
  }

  function responseBytes(raw) {
    return String(raw || '').replace(/[^0-9A-Fa-f]/g, ' ').trim().split(/\s+/).filter(token => /^[0-9A-Fa-f]{2}$/.test(token)).map(token => Number.parseInt(token, 16));
  }

  function decodeUdsVin(raw) {
    const bytes = responseBytes(raw);
    const index = bytes.findIndex((value, offset) => value === 0x62 && bytes[offset + 1] === 0xF1 && bytes[offset + 2] === 0x90);
    if (index < 0) return 'ECU VIN: not returned';
    const vin = bytes.slice(index + 3).map(value => String.fromCharCode(value)).join('').replace(/[^A-Z0-9]/gi, '');
    return `ECU VIN: ${/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin) ? vin : 'response received; VIN could not be validated'}`;
  }

  function decodeUdsDtcs(raw) {
    const bytes = responseBytes(raw);
    const index = bytes.findIndex((value, offset) => value === 0x59 && bytes[offset + 1] === 0x02);
    if (index < 0) return 'UDS DTCs: no positive 19 02 response';
    const records = [];
    for (let offset = index + 3; offset + 3 < bytes.length; offset += 4) {
      const code = bytes.slice(offset, offset + 3).map(value => value.toString(16).padStart(2, '0').toUpperCase()).join('');
      const status = bytes[offset + 3];
      const flags = [[0, 'failed'], [1, 'failed this cycle'], [2, 'pending'], [3, 'confirmed'], [4, 'not completed since clear'], [5, 'failed since clear'], [6, 'not completed this cycle'], [7, 'warning requested']].filter(([bit]) => status & (1 << bit)).map(([, label]) => label);
      records.push(`${code} [${flags.join(', ') || 'no status bits set'}]`);
    }
    return `UDS DTCs: ${records.length ? records.join('; ') : 'none reported'}`;
  }

  function setBusy(panel, message) {
    busy = true;
    panel.querySelector('[data-scanner-status]').textContent = message;
    panel.querySelectorAll('button').forEach((button) => { button.disabled = true; });
  }
  function finish(panel, message) {
    busy = false;
    panel.querySelector('[data-scanner-status]').textContent = message;
    panel.querySelectorAll('button').forEach((button) => { button.disabled = false; });
  }

  function renderScan(scan) {
    const codes = codesFrom(scan);
    const vehicle = scan.vehicleInfo || {};
    const live = scan.liveData || {};
    return `<div class="scanner-pro-summary"><strong>${escapeHtml(scan.protocolLabel || scan.protocol || 'Connected adapter')}</strong><span>VIN ${escapeHtml(vehicle.vin || 'not reported')}</span><span>MIL ${vehicle.milOn ? 'ON' : 'off/not reported'}</span><span>${codes.length} code result(s)</span></div>
      <h3>Codes</h3><p>${codes.length ? codes.map((code) => `<code>${escapeHtml(code)}</code>`).join(' ') : 'No stored, pending or permanent codes reported.'}</p>
      <h3>Live snapshot</h3><p>RPM ${escapeHtml(formatValue(live.rpm))} · Speed ${escapeHtml(formatValue(live.speedMph))} mph · Coolant ${escapeHtml(formatValue(live.coolantTempC))} °C · Voltage ${escapeHtml(formatValue(live.controlModuleVoltage))} V</p>
      <h3>Readiness</h3><div class="scanner-pro-monitor-list">${(vehicle.readinessMonitors || []).filter((m) => m.available).map((m) => `<span class="${m.complete ? 'complete' : 'incomplete'}">${escapeHtml(m.name)}: ${m.complete ? 'complete' : 'incomplete'}</span>`).join('') || 'No readiness monitor data reported.'}</div>`;
  }

  async function runScanAction(panel, action) {
    if (busy) return;
    const result = panel.querySelector('[data-scanner-result]');
    setBusy(panel, 'Communicating…');
    try {
      if (action === 'full') {
        const scan = await api.readSnapshot();
        localStorage.setItem(PRE_SCAN_KEY, JSON.stringify({ at: new Date().toISOString(), vin: scan.vehicleInfo?.vin || getRoContext().vin, scan }));
        saveDiagnosticForPrint('Full OBD pre-scan', scan);
        result.innerHTML = `<h3>Pre-scan saved</h3>${renderScan(scan)}`;
      } else if (action === 'scan-modules') {
        if (typeof api.scanCommonJ2534Modules !== 'function') throw new Error('Update the Windows Repair Suite build to enable J2534 module scanning.');
        result.innerHTML = '<h3>Common 11-bit CAN module scan</h3><p>Querying only standard read-only UDS DTC status at 7E0-7E7. Pause live PID graphing while this scan runs.</p>';
        const scan = await api.scanCommonJ2534Modules();
        saveDiagnosticForPrint('Common CAN module scan', scan);
        result.innerHTML = `<h3>Common 11-bit CAN module scan</h3><p><strong>Adapter:</strong> ${escapeHtml(scan.protocolLabel)}<br><strong>Address sweep:</strong> ${escapeHtml(scan.addressRange)}<br><strong>Completed:</strong> ${escapeHtml(new Date(scan.scannedAt).toLocaleString())}</p><p>This is a common-address sweep, not a complete OEM all-module scan. No response does not prove a module is absent.</p>${scan.modules.length ? `<div class="scanner-pro-service-grid">${scan.modules.map(module => `<article><strong>Request ${escapeHtml(module.targetId)} / Response ${escapeHtml(module.responseId)}</strong><p>${escapeHtml(module.status)}${module.vin ? ` · VIN ${escapeHtml(module.vin)}` : ''}</p><pre>${escapeHtml(module.dtcSupported ? decodeUdsDtcs(module.dtcRaw) : module.dtcRaw)}</pre></article>`).join('')}</div>` : '<p>No ECU responded at the common 11-bit addresses. Confirm the adapter profile, ignition state, and OEM addressing for this vehicle.</p>'}`;
      } else if (action === 'readiness') {
        const response = await api.readVehicleInfo();
        const v = response.vehicleInfo || {};
        result.innerHTML = `<h3>VIN and emissions readiness</h3><p><strong>VIN:</strong> ${escapeHtml(v.vin || 'Not reported')} · <strong>MIL:</strong> ${v.milOn ? 'ON' : 'off/not reported'} · <strong>Stored count:</strong> ${escapeHtml(formatValue(v.storedDtcCount))}</p><div class="scanner-pro-monitor-list">${(v.readinessMonitors || []).filter((m) => m.available).map((m) => `<span class="${m.complete ? 'complete' : 'incomplete'}">${escapeHtml(m.name)}: ${m.complete ? 'complete' : 'incomplete'}</span>`).join('') || 'No monitor data reported.'}</div>`;
      } else if (action === 'freeze') {
        const scan = await api.readSnapshot();
        saveDiagnosticForPrint('Freeze-frame and snapshot read', scan);
        const f = scan.freezeFrame || {};
        result.innerHTML = `<h3>Emission freeze-frame record</h3><p><strong>Trigger:</strong> ${escapeHtml(f.triggerCode || 'Not reported')} · RPM ${escapeHtml(formatValue(f.rpm))} · Speed ${escapeHtml(formatValue(f.speedMph))} mph · Coolant ${escapeHtml(formatValue(f.coolantTempC))} °C · Throttle ${escapeHtml(formatValue(f.throttlePercent))}% · MAP ${escapeHtml(formatValue(f.intakePressureKpa))} kPa</p>`;
      } else if (action === 'mode06') {
        const response = await api.sendRequest({ requestHex: '06', timeoutMs: 4500 });
        const saved = JSON.parse(localStorage.getItem(PRE_SCAN_KEY) || 'null');
        if (saved?.scan) {
          saved.scan.raw = { ...(saved.scan.raw || {}), mode6: response.raw || '' };
          saved.mode6CapturedAt = new Date().toISOString();
          localStorage.setItem(PRE_SCAN_KEY, JSON.stringify(saved));
          saveDiagnosticForPrint('Mode 06 onboard monitor results', saved.scan);
        }
        result.innerHTML = `<h3>Mode $06 onboard-monitor response</h3><p>Raw test results are preserved for OEM decoding. “NO DATA” means the ECU/adapter did not provide this mode.</p><pre>${escapeHtml(response.raw || 'NO DATA')}</pre>`;
      } else if (action === 'post') {
        const saved = JSON.parse(localStorage.getItem(PRE_SCAN_KEY) || 'null');
        if (!saved?.scan) throw new Error('Run and save a full pre-scan before post-scan comparison.');
        const post = await api.readSnapshot();
        saveDiagnosticForPrint('Post-scan comparison capture', { preScan: saved.scan, postScan: post });
        const preVin = String(saved.vin || saved.scan.vehicleInfo?.vin || '').toUpperCase();
        const postVin = String(post.vehicleInfo?.vin || '').toUpperCase();
        if (preVin && postVin && preVin !== postVin) throw new Error(`Vehicle VIN changed between scans (${preVin} vs ${postVin}); comparison stopped.`);
        const before = codesFrom(saved.scan), after = codesFrom(post);
        const cleared = before.filter((code) => !after.includes(code));
        const remaining = after.filter((code) => before.includes(code));
        const newCodes = after.filter((code) => !before.includes(code));
        const previousMonitors = new Map((saved.scan.vehicleInfo?.readinessMonitors || []).map(item => [item.name, item.complete]));
        const readinessChanges = (post.vehicleInfo?.readinessMonitors || []).filter(item => previousMonitors.has(item.name) && previousMonitors.get(item.name) !== item.complete).map(item => `${item.name}: ${previousMonitors.get(item.name) ? 'complete' : 'incomplete'} to ${item.complete ? 'complete' : 'incomplete'}`);
        result.innerHTML = `<h3>Pre-scan vs post-scan</h3><p><strong>Pre-scan:</strong> ${escapeHtml(new Date(saved.at).toLocaleString())}<br><strong>VIN:</strong> ${escapeHtml(postVin || preVin || 'Not reported')}</p><p><strong>Cleared/not returned:</strong> ${escapeHtml(cleared.join(', ') || 'None')}<br><strong>Remaining:</strong> ${escapeHtml(remaining.join(', ') || 'None')}<br><strong>New:</strong> ${escapeHtml(newCodes.join(', ') || 'None')}<br><strong>Readiness changes:</strong> ${escapeHtml(readinessChanges.join('; ') || 'None detected')}</p>${renderScan(post)}`;
      } else if (action === 'export') {
        const saved = JSON.parse(localStorage.getItem(PRE_SCAN_KEY) || 'null');
        if (!saved?.scan) throw new Error('Run and save a full pre-scan before exporting a scan report.');
        exportScanReport(saved);
        result.innerHTML = `<h3>Scan report exported</h3><p>${escapeHtml(saved.scan.vehicleInfo?.vin || saved.vin || 'Vehicle VIN not reported')} · ${escapeHtml(new Date(saved.at).toLocaleString())}</p>`;
      }
      finish(panel, 'Complete');
    } catch (error) {
      result.innerHTML = `<p class="scanner-pro-error"><strong>Scanner action stopped:</strong> ${escapeHtml(error?.message || error)}</p>`;
      finish(panel, 'Needs attention');
    }
  }

  function exportScanReport(saved) {
    const scan = saved.scan;
    const report = {
      capturedAt: saved.at,
      vin: scan.vehicleInfo?.vin || saved.vin || '',
      vinSource: scan.vehicleInfo?.vinSource || '',
      adapter: scan.adapter || '',
      protocol: scan.protocolLabel || scan.protocol || '',
      milOn: Boolean(scan.vehicleInfo?.milOn),
      storedDtcCount: scan.vehicleInfo?.storedDtcCount ?? null,
      readinessMonitors: scan.vehicleInfo?.readinessMonitors || [],
      storedCodes: scan.codes || [],
      pendingCodes: scan.pendingCodes || [],
      permanentCodes: scan.permanentCodes || [],
      liveData: scan.liveData || {},
      freezeFrame: scan.freezeFrame || {},
      mode6Raw: scan.raw?.mode6 || ''
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scanner-report-${(report.vin || 'vehicle').replace(/[^A-Za-z0-9-]/g, '')}-${new Date(saved.at).toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href);
  }

  async function researchService(service) {
    const [name, tier, purpose] = service;
    const context = getRoContext();
    const prompt = `Find the current OEM service procedure for ${name}. Active screen context: ${context.text || 'No RO context detected'}. VIN: ${context.vin || 'not detected'}. Required: exact applicability, prerequisites, battery support, hazards, module/tool path, step sequence, expected acknowledgements, abort conditions, DTC handling and verification. This is ${tier}; do not invent module addresses, security access, commands or values. Cite OEM sources and state what vehicle information is still required. Function purpose: ${purpose}`;
    try {
      if (window.desktopApi?.launchCopilot) await window.desktopApi.launchCopilot({ prompt });
      else window.open(`https://www.google.com/search?q=${encodeURIComponent(`${context.vin} ${name} OEM service procedure`)}`, '_blank', 'noopener');
    } catch (error) { window.alert(`Unable to open service-function research: ${error?.message || error}`); }
  }

  function ensurePanel() {
    const stage = document.querySelector('.view-stage-scanner');
    if (!stage) return;
    let panel = document.getElementById('xpressive-scanner-pro');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'xpressive-scanner-pro';
      panel.className = 'panel full-span scanner-pro-panel';
      stage.appendChild(panel);
      renderPanel(panel);
    }
  }

  new MutationObserver(ensurePanel).observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(ensurePanel, 1200);
  ensurePanel();
})();
