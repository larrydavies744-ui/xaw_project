(() => {
  'use strict';
  const portals = [
    { make: 'GM / ACDelco', product: 'Techline Connect · SPS2', url: 'https://www.acdelcotds.com/', note: 'Purchase the Service Programming subscription for J2534 module programming.' },
    { make: 'Ford / Lincoln', product: 'Motorcraft Service', url: 'https://www.motorcraftservice.com/', note: 'OEM service information, FJDS/FDRS access, and programming subscriptions.' },
    { make: 'Toyota / Lexus', product: 'Toyota TIS / Techstream', url: 'https://techinfo.toyota.com/', note: 'Professional Diagnostic subscription and J2534 reprogramming resources.' },
    { make: 'Stellantis', product: 'TechAuthority / wiTECH', url: 'https://www.techauthority.com/', note: 'OEM subscriptions and wiTECH access; Secure Gateway credentials may also be required.' },
    { make: 'Honda / Acura', product: 'Honda TechInfo', url: 'https://techinfo.honda.com/', note: 'ServiceExpress information, i-HDS, and ECU reprogramming resources.' },
    { make: 'Nissan / Infiniti', product: 'Nissan TechInfo', url: 'https://www.nissan-techinfo.com/', note: 'CONSULT-III Plus R2R/NERS information and subscription access.' },
  ];
  const rlinkGuide = 'https://service.topdon.com/portal/en/kb/articles/rlink-platform-software-download-guide-25-2-2025';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const root = document.createElement('div'); root.id = 'dealer-programming-runtime'; document.body.appendChild(root);
  let adapters = [], message = '';
  async function refresh() {
    try { adapters = await window.obdScanner?.listJ2534Adapters?.() || []; message = adapters.length ? `${adapters.length} Windows J2534 driver registration${adapters.length === 1 ? '' : 's'} detected.` : 'No Windows J2534 drivers detected. Install and activate the RLink Platform first.'; }
    catch (error) { message = error?.message || 'Unable to inspect J2534 drivers.'; }
    render();
  }
  function open() {
    let modal = document.getElementById('dealer-programming-modal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'dealer-programming-modal'; modal.className = 'dealer-programming-modal'; document.body.appendChild(modal); }
    const rlink = adapters.find(item => /rlink/i.test(`${item.name} ${item.vendor} ${item.dllPath}`));
    modal.innerHTML = `<div class="dealer-programming-dialog"><header><div><span>J2534 PASS-THRU</span><h2>Dealer Programming & Subscriptions</h2></div><button data-close>×</button></header>
      <div class="programming-alert"><strong>${rlink ? 'RLink X7 driver detected' : 'RLink X7 setup required'}</strong><p>${esc(message)}</p>${rlink ? `<code>${esc(rlink.dllPath)}</code>` : ''}<div><a href="${rlinkGuide}" target="_blank" rel="noreferrer">Download / Update RLink Platform</a><button data-refresh>Refresh Drivers</button></div></div>
      <div class="programming-warning"><strong>Programming safety</strong><p>Use a stable vehicle power supply, disable PC sleep, confirm VIN/module/calibration, and follow the OEM procedure. Subscriptions and software licenses are purchased directly from each manufacturer. This app does not bypass OEM authentication or Secure Gateway controls.</p></div>
      <div class="programming-grid">${portals.map(p => `<article><span>${esc(p.make)}</span><h3>${esc(p.product)}</h3><p>${esc(p.note)}</p><a href="${p.url}" target="_blank" rel="noreferrer">Open Official Portal</a></article>`).join('')}</div>
      <div class="programming-steps"><h3>J2534 workflow</h3><ol><li>Install and activate the TOPDON RLink Platform.</li><li>Use Driver Management to download only the driver for the OEM application you purchased.</li><li>Purchase and install the OEM subscription/software from the official portal.</li><li>Connect vehicle support power, then select TOPDON RLink as the J2534 interface in the OEM application.</li><li>Close other scanner sessions before programming a module.</li></ol></div></div>`;
    modal.hidden = false; modal.querySelector('[data-close]').onclick = () => modal.hidden = true; modal.querySelector('[data-refresh]').onclick = refresh;
  }
  function render() { root.innerHTML = '<button type="button" title="OEM programming software and RLink drivers"><span>J2534</span> Dealer Software</button>'; root.querySelector('button').onclick = open; }
  render(); refresh();
})();
