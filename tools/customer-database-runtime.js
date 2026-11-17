(() => {
  'use strict';
  const CUSTOMER_KEY = 'customerStorageKey';
  const ORDER_KEY = 'xpressive-repair-suite-orders-v2';
  const CURRENT_ORDER_KEY = 'xpressive-repair-suite-current-v2';
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const normalizePhone = value => String(value || '').replace(/\D/g, '');
  const normalizeEmail = value => String(value || '').trim().toLowerCase();
  const normalizeName = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const readArray = key => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  };
  let observerTimer = 0;

  function orderMatches(customer, order) {
    const saved = order.customer || {};
    const email = normalizeEmail(customer.email);
    const phone = normalizePhone(customer.phone);
    const orderEmail = normalizeEmail(saved.email);
    const orderPhone = normalizePhone(saved.phone);
    if (email || phone) return Boolean(email && orderEmail === email || phone && orderPhone === phone);
    const name = normalizeName([customer.firstName, customer.lastName].join(' '));
    return Boolean(name && name === normalizeName([saved.firstName, saved.lastName].join(' ')));
  }

  function customerOrders(customer, orders) {
    return orders.filter(order => orderMatches(customer, order)).sort((left, right) => {
      const leftDate = Date.parse(left.updatedAt || left.createdAt || left.serviceDate || '') || 0;
      const rightDate = Date.parse(right.updatedAt || right.createdAt || right.serviceDate || '') || 0;
      return rightDate - leftDate;
    });
  }

  function duplicatesFor(customer, customers) {
    const email = normalizeEmail(customer.email), phone = normalizePhone(customer.phone);
    if (!email && !phone) return false;
    return customers.some(other => other.id !== customer.id && (email && normalizeEmail(other.email) === email || phone && normalizePhone(other.phone) === phone));
  }

  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportBackup() {
    const payload = { schemaVersion: 1, exportedAt: new Date().toISOString(), customers: readArray(CUSTOMER_KEY) };
    download(`repair-suite-customers-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
  }

  function escapeCsv(value) {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    const headings = ['First Name', 'Last Name', 'Phone', 'Email', 'Address', 'Preferred Contact', 'Notes', 'Repair Orders'];
    const customers = readArray(CUSTOMER_KEY), orders = readArray(ORDER_KEY);
    const rows = customers.map(customer => [
      customer.firstName, customer.lastName, customer.phone, customer.email, customer.address,
      customer.preferredContact, customer.notes, customerOrders(customer, orders).length
    ]);
    download(`repair-suite-customers-${new Date().toISOString().slice(0, 10)}.csv`, [headings, ...rows].map(row => row.map(escapeCsv).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  }

  function mergeBackup(file) {
    const reader = new FileReader();
    reader.onerror = () => window.alert('Could not read the selected customer backup.');
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || 'null'));
        const imported = Array.isArray(payload) ? payload : payload?.customers;
        if (!Array.isArray(imported) || !imported.length) throw new Error('This backup has no customer records.');
        const customers = readArray(CUSTOMER_KEY);
        let added = 0, merged = 0;
        imported.filter(record => record && typeof record === 'object' && !Array.isArray(record)).forEach(record => {
          const email = normalizeEmail(record.email), phone = normalizePhone(record.phone);
          const existingIndex = customers.findIndex(customer => customer.id && record.id && customer.id === record.id || email && normalizeEmail(customer.email) === email || phone && normalizePhone(customer.phone) === phone);
          const normalized = {
            id: String(record.id || `import-${Date.now()}-${added + merged}`),
            firstName: String(record.firstName || '').trim(), lastName: String(record.lastName || '').trim(),
            phone: String(record.phone || '').trim(), email: String(record.email || '').trim(), address: String(record.address || '').trim(),
            preferredContact: record.preferredContact === 'email' ? 'email' : 'phone', notes: String(record.notes || ''),
            createdAt: String(record.createdAt || new Date().toISOString()), updatedAt: new Date().toISOString()
          };
          if (existingIndex < 0) { customers.push(normalized); added += 1; }
          else {
            const existing = customers[existingIndex];
            customers[existingIndex] = { ...existing, ...Object.fromEntries(Object.entries(normalized).filter(([, value]) => value !== '')), id: existing.id || normalized.id, createdAt: existing.createdAt || normalized.createdAt };
            merged += 1;
          }
        });
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers));
        window.alert(`Customer backup merged: ${added} added, ${merged} updated. The database will reload.`);
        window.location.reload();
      } catch (error) { window.alert(error?.message || 'The selected file is not a valid customer backup.'); }
    };
    reader.readAsText(file);
  }

  function openOrder(order) {
    if (!order?.id) return;
    localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(String(order.id)));
    window.location.reload();
  }

  function buildHistory(customer, orders) {
    const matches = customerOrders(customer, orders);
    const box = document.createElement('section');
    box.className = 'customer-db-history';
    box.dataset.customerHistory = 'true';
    const heading = document.createElement('strong');
    heading.textContent = `Repair order history (${matches.length})`;
    box.appendChild(heading);
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No matching repair orders yet. New orders using this customer contact will appear here.';
      box.appendChild(empty);
      return box;
    }
    matches.slice(0, 8).forEach(order => {
      const row = document.createElement('div');
      row.className = 'customer-db-order';
      const details = document.createElement('span');
      const roNumber = order.shopInfo?.roNumber || order.roNumber || order.id;
      const vehicle = [order.vehicle?.year, order.vehicle?.make, order.vehicle?.model].filter(Boolean).join(' ') || 'Vehicle not recorded';
      const date = order.updatedAt || order.createdAt || order.serviceDate;
      details.textContent = [String(roNumber || 'RO'), vehicle, date ? new Date(date).toLocaleDateString() : ''].filter(Boolean).join(' · ');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Open RO';
      button.addEventListener('click', () => openOrder(order));
      row.append(details, button);
      box.appendChild(row);
    });
    return box;
  }

  function getCustomerPanel() {
    const heading = [...document.querySelectorAll('.panel h2')].find(element => element.textContent.trim() === 'Customer Database');
    return heading?.closest('.panel') || null;
  }

  function applySearch(panel, query) {
    const value = query.trim().toLowerCase();
    let visible = 0;
    panel.querySelectorAll('.customer-list .customer-card').forEach(card => {
      const fields = [...card.querySelectorAll('input, textarea, select')].map(field => field.value || '').join(' ');
      const show = !value || `${card.textContent} ${fields}`.toLowerCase().includes(value);
      card.hidden = !show;
      if (show) visible += 1;
    });
    const result = panel.querySelector('[data-customer-count]');
    if (result) result.textContent = `${visible} shown`;
  }

  function enhance(panel) {
    const list = panel.querySelector('.customer-list');
    if (!list) return;
    let tools = panel.querySelector('[data-customer-tools]');
    if (!tools) {
      tools = document.createElement('div');
      tools.className = 'customer-db-tools';
      tools.dataset.customerTools = 'true';
      tools.innerHTML = '<label>Search customers<input type="search" data-customer-search placeholder="Name, phone, email, vehicle or RO"></label><span class="customer-db-count" data-customer-count></span><button type="button" data-export-json>Backup JSON</button><button type="button" data-export-csv>Export CSV</button><button type="button" data-import-json>Import / Merge</button><input type="file" accept="application/json,.json" data-customer-file hidden>';
      const header = panel.querySelector('.panel-header');
      header?.insertAdjacentElement('afterend', tools);
      tools.querySelector('[data-export-json]').addEventListener('click', exportBackup);
      tools.querySelector('[data-export-csv]').addEventListener('click', exportCsv);
      tools.querySelector('[data-import-json]').addEventListener('click', () => tools.querySelector('[data-customer-file]').click());
      tools.querySelector('[data-customer-file]').addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) mergeBackup(file);
        event.target.value = '';
      });
      tools.querySelector('[data-customer-search]').addEventListener('input', event => applySearch(panel, event.target.value));
    }

    const customers = readArray(CUSTOMER_KEY), orders = readArray(ORDER_KEY), cards = [...list.querySelectorAll('.customer-card')];
    let linkedOrders = 0, duplicateCount = 0;
    customers.forEach((customer, index) => {
      const card = cards[index];
      if (!card) return;
      const related = customerOrders(customer, orders);
      linkedOrders += related.length;
      const duplicate = duplicatesFor(customer, customers);
      if (duplicate) duplicateCount += 1;
      const stamp = JSON.stringify([customer.id, customer.phone, customer.email, customer.firstName, customer.lastName, related.map(order => [order.id, order.updatedAt, order.createdAt, order.shopInfo?.roNumber, order.vehicle?.year, order.vehicle?.make, order.vehicle?.model]), duplicate]);
      if (card.dataset.customerDbStamp === stamp) return;
      card.dataset.customerDbStamp = stamp;
      card.querySelector('[data-customer-history]')?.remove();
      const history = buildHistory(customer, orders);
      if (duplicate) {
        const notice = document.createElement('p');
        notice.className = 'customer-db-duplicate';
        notice.textContent = 'Possible duplicate: another customer shares this email or phone.';
        history.insertBefore(notice, history.children[1] || null);
      }
      card.appendChild(history);
    });
    const count = tools.querySelector('[data-customer-count]');
    if (count) count.textContent = `${customers.length} customers · ${linkedOrders} linked ROs${duplicateCount ? ` · ${duplicateCount} possible duplicates` : ''}`;
    applySearch(panel, tools.querySelector('[data-customer-search]').value);
  }

  function schedule() {
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(() => {
      const panel = getCustomerPanel();
      if (panel) enhance(panel);
    }, 80);
  }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('storage', schedule);
  schedule();
})();