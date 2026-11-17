(() => {
  'use strict';
  const state = { open: false, busy: false, status: null, error: '' };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  const host = document.createElement('section'); host.id = 'dedicated-updates-view'; host.hidden = true; document.body.appendChild(host);

  function hideLegacyControls() {
    document.querySelectorAll('.panel').forEach(panel => {
      if ([...panel.querySelectorAll('h2')].some(node => node.textContent.trim() === 'Internet Updates')) panel.classList.add('legacy-update-panel-hidden');
    });
    document.querySelectorAll('.field').forEach(field => {
      const label = field.querySelector(':scope > span')?.textContent?.trim();
      if (label === 'Manual Update Page URL') field.classList.add('legacy-update-control-hidden');
    });
    document.querySelectorAll('button').forEach(button => {
      if (button.textContent.trim() === 'Open Update Page') button.classList.add('legacy-update-control-hidden');
    });
  }

  function ensureTab() {
    const tabs = document.querySelector('.tabs');
    if (!tabs || tabs.querySelector('[data-dedicated-updates]')) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'tab'; button.dataset.dedicatedUpdates = 'true'; button.textContent = 'Updates';
    button.addEventListener('click', () => openView()); tabs.appendChild(button);
    tabs.querySelectorAll('button:not([data-dedicated-updates])').forEach(tab => tab.addEventListener('click', closeView));
  }

  function closeView() {
    if (!state.open) return;
    state.open = false; host.hidden = true;
    document.querySelector('[data-dedicated-updates]')?.classList.remove('active');
    document.querySelector('.workspace-shell')?.classList.remove('updates-workspace-active');
  }

  async function openView() {
    state.open = true; host.hidden = false;
    document.querySelectorAll('.tabs .tab').forEach(tab => tab.classList.toggle('active', tab.hasAttribute('data-dedicated-updates')));
    document.querySelector('.workspace-shell')?.classList.add('updates-workspace-active');
    render(); await refresh(false);
  }

  async function refresh(showError = true) {
    if (!window.desktopApi?.getUpdateStatus) { state.error = 'Desktop updates are available only in the packaged Windows application.'; render(); return; }
    state.busy = true; state.error = ''; render();
    try { state.status = await window.desktopApi.getUpdateStatus(); }
    catch (error) { if (showError) state.error = error?.message || 'Unable to load update status.'; }
    finally { state.busy = false; render(); }
  }

  async function action(name) {
    const api = window.desktopApi; state.busy = true; state.error = ''; render();
    try {
      if (name === 'check') state.status = await api.checkForUpdates();
      if (name === 'download') state.status = await api.downloadUpdate();
      if (name === 'install') { await api.installUpdate(); return; }
      await refresh(false);
    } catch (error) { state.error = error?.message || `Unable to ${name} update.`; }
    finally { state.busy = false; render(); }
  }

  function render() {
    const s = state.status || {}, status = s.status || 'unknown';
    host.innerHTML = `<div class="dedicated-updates-shell"><div class="updates-heading"><div><span>DESKTOP RELEASES</span><h1>Updates</h1><p>Check, download, and install Repair Suite releases from the configured update feed.</p></div><button data-close>Return to Workspace</button></div>
      ${state.error ? `<div class="updates-error">${esc(state.error)}</div>` : ''}
      <div class="updates-status-card"><div><span>Status</span><strong>${esc(status)}</strong></div><div><span>Current version</span><strong>${esc(s.currentVersion || 'Unavailable')}</strong></div><div><span>Available version</span><strong>${esc(s.availableVersion || 'None')}</strong></div><div><span>Downloaded version</span><strong>${esc(s.downloadedVersion || 'None')}</strong></div><div><span>Channel</span><strong>${esc(s.channel || 'latest')}</strong></div><div><span>Last checked</span><strong>${esc(s.lastCheckedAt ? new Date(s.lastCheckedAt).toLocaleString() : 'Not checked')}</strong></div></div>
      <div class="updates-message"><strong>${esc(s.message || 'Refresh status or check for a new release.')}</strong>${s.releaseName ? `<span>${esc(s.releaseName)}</span>` : ''}${s.releaseNotes ? `<p>${esc(s.releaseNotes)}</p>` : ''}</div>
      <div class="updates-actions"><button data-action="refresh" ${state.busy ? 'disabled' : ''}>Refresh Status</button><button class="primary" data-action="check" ${state.busy || !window.desktopApi?.checkForUpdates ? 'disabled' : ''}>Check for Updates</button><button data-action="download" ${state.busy || !s.canAutoUpdate || status !== 'available' ? 'disabled' : ''}>Download Update</button><button class="install" data-action="install" ${state.busy || status !== 'downloaded' ? 'disabled' : ''}>Install Update</button></div>
      <div class="updates-note">Portable builds cannot install updates automatically. Installed NSIS builds use the release feed configured by the shop administrator.</div></div>`;
    host.querySelector('[data-close]').onclick = closeView;
    host.querySelectorAll('[data-action]').forEach(button => button.onclick = () => button.dataset.action === 'refresh' ? refresh() : action(button.dataset.action));
  }

  const observer = new MutationObserver(() => { hideLegacyControls(); ensureTab(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.desktopApi?.onUpdateStatus?.(next => { state.status = next; if (state.open) render(); });
  hideLegacyControls(); ensureTab();
})();
