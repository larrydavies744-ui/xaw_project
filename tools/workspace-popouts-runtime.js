(function () {
  const views = [
    ['dashboard', 'Dashboard'], ['calendar', 'Calendar'], ['marketing', 'Marketing'],
    ['workorder', 'Work Order'], ['inspection', 'Inspection'], ['history', 'History'],
    ['invoice', 'Invoice'], ['scanner', 'Diagnostics'], ['customers', 'Customers'],
    ['legal', 'Legal Contract'], ['print', 'Print'], ['settings', 'Settings']
  ];
  const labels = Object.fromEntries(views);
  const params = new URLSearchParams(location.search);
  const popoutView = params.get('popout');
  let opening = false;
  let recallOpen = false;

  function activeView() {
    return document.querySelector('.view-stage')?.dataset.activePage || 'dashboard';
  }

  function clickDashboard() {
    const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
      (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
    if (button && activeView() !== 'dashboard') button.click();
  }

  const ORDER_KEY = 'xpressive-repair-suite-orders-v2';
  const CURRENT_ORDER_KEY = 'xpressive-repair-suite-current-v2';
  const safeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const nativeSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    const previous = key === CURRENT_ORDER_KEY ? this.getItem(key) : null;
    nativeSetItem.call(this, key, value);
    if (key !== CURRENT_ORDER_KEY || previous === String(value) || window.__xpressiveSyncingRo) return;
    let id = String(value || '');
    try { id = JSON.parse(id); } catch {}
    if (!id) return;
    window.setTimeout(() => {
      window.desktopApi?.selectRepairOrder?.({ id: String(id) }).catch(error => console.error('Could not sync the current repair order:', error));
    }, 0);
  };
  const readOrders = () => {
    try {
      const value = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  };

  function ensureRecallControl() {
    if (document.getElementById('xpressive-ro-recall')) return;
    const button = document.createElement('button');
    button.id = 'xpressive-ro-recall';
    button.className = 'xpressive-ro-recall';
    button.type = 'button';
    button.textContent = 'Recall RO';
    button.addEventListener('click', openRecall);
    document.body.appendChild(button);
  }

  function openRecall() {
    if (recallOpen) return;
    recallOpen = true;
    const orders = readOrders().sort((left, right) => {
      const date = order => Date.parse(order.updatedAt || order.createdAt || order.serviceDate || '') || 0;
      return date(right) - date(left);
    });
    const currentId = String(localStorage.getItem(CURRENT_ORDER_KEY) || '').replace(/^"|"$/g, '');
    const overlay = document.createElement('div');
    overlay.className = 'xpressive-ro-recall-overlay';
    overlay.innerHTML = `<section class="xpressive-ro-recall-dialog" role="dialog" aria-modal="true" aria-labelledby="xpressive-ro-recall-title"><header><div><span>WORK ORDER HISTORY</span><h2 id="xpressive-ro-recall-title">Recall a repair order</h2><p>Search by RO, customer, vehicle, VIN, or service notes. Choosing an RO updates all open Repair Suite windows.</p></div><button type="button" data-close aria-label="Close">×</button></header><label class="xpressive-ro-recall-search">Search repair orders<input type="search" data-query placeholder="RO number, name, vehicle, VIN, or service" autocomplete="off"></label><div class="xpressive-ro-recall-summary" data-summary></div><div class="xpressive-ro-recall-list" data-list></div></section>`;
    document.body.appendChild(overlay);
    const input = overlay.querySelector('[data-query]');
    const list = overlay.querySelector('[data-list]');
    const close = () => { recallOpen = false; overlay.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = event => { if (event.key === 'Escape') close(); };
    overlay.querySelector('[data-close]').addEventListener('click', close);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', onKey);
    function render() {
      const query = input.value.trim().toLowerCase();
      const matches = orders.filter(order => {
        const vehicle = order.vehicle || {};
        const customer = order.customer || {};
        const service = order.service || {};
        const values = [order.shopInfo?.roNumber, order.roNumber, order.id, customer.firstName, customer.lastName,
          vehicle.year, vehicle.make, vehicle.model, vehicle.trim, vehicle.vin, order.vin,
          service.complaint, service.requestedService, service.recommendations, service.advisorNotes,
          ...(Array.isArray(order.labor) ? order.labor.map(item => item.description) : []),
          ...(Array.isArray(order.parts) ? order.parts.flatMap(item => [item.partNumber, item.description]) : [])];
        return !query || values.filter(Boolean).join(' ').toLowerCase().includes(query);
      });
      overlay.querySelector('[data-summary]').textContent = `${matches.length} of ${orders.length} repair orders${currentId ? ' · Current RO is marked' : ''}`;
      list.innerHTML = matches.map(order => {
        const vehicle = order.vehicle || {};
        const customer = order.customer || {};
        const service = order.service || {};
        const id = String(order.id || '');
        const ro = order.shopInfo?.roNumber || order.roNumber || id || 'Repair Order';
        const vehicleText = [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(' ') || 'Vehicle details not recorded';
        const customerText = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Customer not recorded';
        const serviceText = service.requestedService || service.complaint || 'No service summary';
        const date = order.updatedAt || order.createdAt || order.serviceDate;
        const dateText = date ? new Date(date).toLocaleDateString() : 'No date';
        return `<button type="button" class="xpressive-ro-recall-row${id === currentId ? ' is-current' : ''}" data-order-id="${safeText(id)}"><span class="xpressive-ro-recall-row-head"><strong>RO ${safeText(ro)}</strong><small>${safeText(dateText)}${id === currentId ? ' · CURRENT' : ''}</small></span><span>${safeText(customerText)} · ${safeText(vehicleText)}</span><small>${safeText(serviceText)}${vehicle.vin || order.vin ? ` · VIN ${safeText(vehicle.vin || order.vin)}` : ''}</small></button>`;
      }).join('') || '<p class="xpressive-ro-recall-empty">No repair orders match this search.</p>';
      list.querySelectorAll('[data-order-id]').forEach(row => row.addEventListener('click', async () => {
        const id = row.dataset.orderId;
        if (!id) return;
        row.disabled = true;
        row.querySelector('small:last-child').textContent = 'Opening this RO in all open windows…';
        try {
          const result = await window.desktopApi?.selectRepairOrder?.({ id });
          if (!result?.ok) {
            localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(id));
            location.reload();
          }
        } catch (error) {
          row.disabled = false;
          row.querySelector('small:last-child').textContent = error?.message || 'Unable to open this repair order.';
        }
      }));
    }
    input.addEventListener('input', render);
    render();
    input.focus();
  }

  function activatePopout() {
    if (!popoutView || !labels[popoutView]) return true;
    document.documentElement.dataset.workspacePopout = popoutView;
    ensureRecallControl();
    document.title = `${labels[popoutView]} Editor - Xpressive Autoworks`;
    let home = document.getElementById('xpressive-return-home');
    if (!home) {
      home = document.createElement('button');
      home.id = 'xpressive-return-home';
      home.className = 'xpressive-return-home';
      home.type = 'button';
      home.textContent = '← Home Screen';
      home.addEventListener('click', async () => {
        home.disabled = true;
        try { await window.desktopApi?.returnHome?.(); }
        finally { home.disabled = false; }
      });
      document.body.appendChild(home);
    }
    let status = document.getElementById('xpressive-editor-status');
    if (activeView() === popoutView) {
      status?.remove();
      return true;
    }
    const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
      (entry.innerText || entry.title || '').trim().toLowerCase() === labels[popoutView].toLowerCase());
    if (button) {
      if (!status) {
        status = document.createElement('div');
        status.id = 'xpressive-editor-status';
        status.className = 'xpressive-editor-status';
        status.setAttribute('role', 'status');
        document.body.appendChild(status);
      }
      status.textContent = `Opening ${labels[popoutView]} editor…`;
      button.click();
    }
    return activeView() === popoutView;
  }

  function installTabEditors() {
    if (popoutView) return;
    ensureRecallControl();
    document.addEventListener('click', async (event) => {
      const tab = event.target?.closest?.('.horizontal-nav-tabs button');
      if (!tab || opening) return;
      window.setTimeout(async () => {
        const view = activeView();
        if (!labels[view] || opening) return;
        opening = true;
        try {
          const result = await window.desktopApi?.openWorkspaceWindow?.(view);
          if (result?.ok) clickDashboard();
        } catch (error) {
          console.error('Could not open the workspace editor window:', error);
        } finally {
          opening = false;
        }
      }, 0);
    }, true);
  }

  window.addEventListener('storage', event => {
    if (event.key === ORDER_KEY && recallOpen) {
      document.querySelector('.xpressive-ro-recall-overlay')?.remove();
      recallOpen = false;
      openRecall();
    }
  });

  if (popoutView) {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (activatePopout() || attempts > 80) window.clearInterval(timer);
    }, 100);
    activatePopout();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installTabEditors, { once: true });
  } else {
    installTabEditors();
  }
})();
