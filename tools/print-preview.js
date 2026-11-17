(() => {
  const overlayId = 'xpressive-print-preview';
  function closePreview() {
    document.getElementById(overlayId)?.remove();
    document.body.style.overflow = '';
  }
  const diagnosticKey = 'xpressive-diagnostic-print-history-v1';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  function diagnosticCaptures(sheet) {
    try { const value = JSON.parse(localStorage.getItem(diagnosticKey) || '[]'); const saved = Array.isArray(value) ? value : []; const vin = sheet.textContent.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)?.[0]?.toUpperCase() || ''; return { saved, vin, captures: vin ? saved.filter(item => String(item.vin || item.scan?.vehicleInfo?.vin || '').toUpperCase() === vin) : saved }; }
    catch { return { saved: [], vin: '', captures: [] }; }
  }
  function appendDiagnosticAppendix(sheet) {
    sheet.querySelector('.print-diagnostics-appendix')?.remove();
    const { saved, vin, captures } = diagnosticCaptures(sheet);
    if (!captures.length) {
      if (saved.length && vin) { const notice = document.createElement('section'); notice.className = 'print-diagnostics-appendix'; notice.textContent = `No saved diagnostic capture matches vehicle VIN ${vin}.`; sheet.appendChild(notice); return -1; }
      return 0;
    }
    const appendix = document.createElement('section');
    appendix.className = 'print-diagnostics-appendix';
    const style = document.createElement('style');
    style.textContent = '.print-diagnostics-appendix{margin-top:28px;padding-top:24px;border-top:3px solid #111;color:#111;font:10pt/1.45 Arial,sans-serif}.print-diagnostics-appendix>header{margin-bottom:20px}.print-diagnostics-appendix>header>span{font-size:8pt;letter-spacing:.14em;color:#555}.print-diagnostics-appendix h1{margin:5px 0;font-size:22pt}.print-diagnostics-appendix h2{margin:18px 0 3px;font-size:12pt}.print-diagnostics-appendix p{margin:3px 0 8px;color:#444;font-size:9pt}.print-diagnostic-capture{break-inside:avoid-page;margin:14px 0 22px}.print-diagnostic-capture pre{margin:8px 0;padding:10px;border:1px solid #cbd5e1;background:#f8fafc;color:#111;font:7pt/1.35 Consolas,"Courier New",monospace;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}';
    appendix.innerHTML = `<header><span>XPRESSIVE AUTOWORKS · VEHICLE SCANNER</span><h1>Full Diagnostic Report</h1><p>${captures.length} saved diagnostic capture${captures.length === 1 ? '' : 's'} · Vehicle VIN ${escapeHtml(vin || captures[0].vin || 'not recorded')} · Includes raw ECU replies and decoded scan data</p></header>${captures.map((capture, index) => `<article class="print-diagnostic-capture"><h2>${index + 1}. ${escapeHtml(capture.label || 'Diagnostic capture')}</h2><p>Captured ${escapeHtml(capture.capturedAt ? new Date(capture.capturedAt).toLocaleString() : 'time not recorded')} · VIN ${escapeHtml(capture.vin || capture.scan?.vehicleInfo?.vin || 'not recorded')}</p><pre>${escapeHtml(JSON.stringify(capture.scan ?? capture, null, 2))}</pre></article>`).join('')}`;
    appendix.appendChild(style);
    sheet.appendChild(appendix);
    return captures.length;
  }
  function openPreview() {
    const source = document.querySelector('.print-sheet');
    if (!source) {
      window.alert('Open the Print workspace before previewing a document.');
      return;
    }
    closePreview();
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.className = 'print-preview-overlay screen-only';
    overlay.innerHTML = `
      <header class="print-preview-bar">
        <div class="print-preview-title"><strong>Print Preview</strong><span>Letter paper • Preview reflects the selected document</span></div>
        <div class="print-preview-controls"><button type="button" data-preview-action="close">Close</button><button type="button" class="primary" data-preview-action="print">Print</button></div>
      </header>
      <main class="print-preview-scroll"><article class="print-preview-page"></article></main>`;
    const clone = source.cloneNode(true);
    clone.querySelectorAll('button, .print-toolbar, .print-actions, .screen-only').forEach((node) => node.remove());
    const captureCount = appendDiagnosticAppendix(clone);
    overlay.querySelector('.print-preview-title span').textContent = captureCount > 0 ? `Letter paper • ${captureCount} diagnostic capture(s) included` : captureCount < 0 ? 'No saved diagnostics match this vehicle VIN' : 'Letter paper • Preview reflects the selected document';
    overlay.querySelector('.print-preview-page').appendChild(clone);
    overlay.addEventListener('click', (event) => {
      const action = event.target.closest('[data-preview-action]')?.dataset.previewAction;
      if (action === 'close') closePreview();
      if (action === 'print') window.print();
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.querySelector('[data-preview-action="close"]')?.focus();
  }
  function installButton() {
    const actions = document.querySelector('.print-sheet .print-actions');
    if (!actions || actions.querySelector('[data-print-preview]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'print-button';
    button.dataset.printPreview = 'true';
    button.textContent = 'Print Preview';
    button.addEventListener('click', openPreview);
    actions.insertBefore(button, actions.lastElementChild);
  }
  new MutationObserver(installButton).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('beforeprint', () => document.querySelectorAll('.print-sheet').forEach(appendDiagnosticAppendix));
  window.addEventListener('afterprint', () => document.querySelectorAll('.print-diagnostics-appendix').forEach((node) => node.remove()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById(overlayId)) closePreview();
  });
  installButton();
})();
