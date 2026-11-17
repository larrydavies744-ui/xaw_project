const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const names = ['app_live_extract', 'app_extracted'];
const replacements = (source, pairs, label) => {
  let value = source;
  for (const [before, after, description] of pairs) {
    if (value.includes(after)) continue;
    if (!value.includes(before)) throw new Error(`${label}: could not find ${description}`);
    value = value.replace(before, after);
  }
  return value;
};

for (const name of names) {
  const appRoot = path.join(root, '_private_dev', 'source', name);
  const preloadPath = path.join(appRoot, 'electron', 'preload.cjs');
  let preload = fs.readFileSync(preloadPath, 'utf8').replace(/\r\n/g, '\n');
  preload = replacements(preload, [[
    "  returnHome: () => ipcRenderer.invoke('desktop:return-home'),\n",
    "  returnHome: () => ipcRenderer.invoke('desktop:return-home'),\n  selectRepairOrder: (options) => ipcRenderer.invoke('desktop:select-repair-order', options),\n",
    'desktop repair-order bridge'
  ]], preloadPath);
  fs.writeFileSync(preloadPath, preload);

  const mainPath = path.join(appRoot, 'electron', 'main.cjs');
  let main = fs.readFileSync(mainPath, 'utf8').replace(/\r\n/g, '\n');
  main = replacements(main, [[
    `  const activateEditor = (editor) => {
    for (const otherWindow of BrowserWindow.getAllWindows()) {
      if (otherWindow !== editor && !otherWindow.isDestroyed()) otherWindow.hide();
    }
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow !== editor) mainWindow.hide();
    if (editor.isMinimized()) editor.restore();`,
    `  const activateEditor = (editor) => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow !== editor) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      void mainWindow.webContents.executeJavaScript(\`(() => {
        const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
          (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
        if (button) button.click();
        return true;
      })()\`).catch(() => {});
    }
    if (editor.isMinimized()) editor.restore();`,
    'editor activation that hid other windows'
  ], [
    `    if (editor && editor !== mainWindow && !editor.isDestroyed()) editor.hide();
    mainWindow.focus();`,
    `    if (editor && editor !== mainWindow && !editor.isDestroyed()) {
      if (editor.isMinimized()) editor.restore();
      editor.show();
      await editor.webContents.executeJavaScript(\`(() => {
        const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
          (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
        if (button) button.click();
        return true;
      })()\`).catch(() => {});
    }
    mainWindow.focus();`,
    'return-home behavior that hid the editor'
  ], [
    `ipcMain.handle('desktop:return-home', async (event) => {`,
    `ipcMain.handle('desktop:select-repair-order', async (_event, options = {}) => {
  const id = String(options.id || '').trim();
  if (!id) throw new Error('Choose a repair order to recall.');
  const currentKey = 'xpressive-repair-suite-current-v2';
  const currentValue = JSON.stringify(id);
  const script = \`localStorage.setItem(\${JSON.stringify(currentKey)}, \${JSON.stringify(currentValue)}); location.reload();\`;
  const appWindows = BrowserWindow.getAllWindows().filter((window) =>
    !window.isDestroyed() && /[\\\\/]dist[\\\\/]index\\.html(?:[?#]|$)/i.test(window.webContents.getURL()));
  await Promise.all(appWindows.map((window) => window.webContents.executeJavaScript(script).catch(() => null)));
  return { ok: true, id, windowsUpdated: appWindows.length };
});

ipcMain.handle('desktop:return-home', async (event) => {`,
    'shared repair-order recall handler'
  ]], mainPath);
  const unguardedSync = "  const script = `localStorage.setItem(${JSON.stringify(currentKey)}, ${JSON.stringify(currentValue)}); location.reload();`;";
  const guardedSync = "  const script = `window.__xpressiveSyncingRo = true; localStorage.setItem(${JSON.stringify(currentKey)}, ${JSON.stringify(currentValue)}); window.__xpressiveSyncingRo = false; location.reload();`;";
  if (main.includes(unguardedSync)) main = main.replace(unguardedSync, guardedSync);
  else if (!main.includes(guardedSync)) throw new Error(`${mainPath}: repair-order sync script missing`);
  fs.writeFileSync(mainPath, main);
  console.log(`Installed multi-screen RO context in ${appRoot}`);
}
