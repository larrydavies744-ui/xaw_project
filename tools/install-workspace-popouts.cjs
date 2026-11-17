const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const runtimeJs = fs.readFileSync(path.join(__dirname, 'workspace-popouts-runtime.js'));
const runtimeCss = fs.readFileSync(path.join(__dirname, 'workspace-popouts-runtime.css'));

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`Missing ${label}`);
  return source.replace(before, after);
}

for (const name of ['app_live_extract', 'app_extracted']) {
  const appRoot = path.join(root, '_private_dev', 'source', name);
  fs.writeFileSync(path.join(appRoot, 'dist', 'workspace-popouts.js'), runtimeJs);
  fs.writeFileSync(path.join(appRoot, 'dist', 'workspace-popouts.css'), runtimeCss);

  const preloadPath = path.join(appRoot, 'electron', 'preload.cjs');
  let preload = fs.readFileSync(preloadPath, 'utf8').replace(/\r\n/g, '\n');
  preload = replaceOnce(
    preload,
    "contextBridge.exposeInMainWorld('desktopApi', {\n",
    "contextBridge.exposeInMainWorld('desktopApi', {\n  openWorkspaceWindow: (view) => ipcRenderer.invoke('desktop:open-workspace-window', { view }),\n  returnHome: () => ipcRenderer.invoke('desktop:return-home'),\n",
    'desktop API bridge'
  );
  fs.writeFileSync(preloadPath, preload);

  const mainPath = path.join(appRoot, 'electron', 'main.cjs');
  let main = fs.readFileSync(mainPath, 'utf8').replace(/\r\n/g, '\n');
  main = replaceOnce(
    main,
    'let mainWindow = null;\n',
    "let mainWindow = null;\nconst workspacePopoutWindows = new Map();\nconst workspaceViewNames = new Set(['dashboard','calendar','marketing','workorder','inspection','history','invoice','scanner','customers','legal','print','settings']);\n",
    'window state'
  );
  const handler = `ipcMain.handle('desktop:open-workspace-window', async (_event, options = {}) => {
  const view = String(options.view || '').toLowerCase();
  if (!workspaceViewNames.has(view)) throw new Error('Unknown workspace editor.');
  const existing = workspacePopoutWindows.get(view);
  if (existing && !existing.isDestroyed()) {
    if (existing.isMinimized()) existing.restore();
    existing.show();
    existing.focus();
    return { ok: true, view, reused: true };
  }
  const title = view.replace(/(^|[-_])(\\w)/g, (_match, _prefix, letter) => letter.toUpperCase()) + ' Editor';
  const editor = new BrowserWindow({
    width: 1380, height: 900, minWidth: 900, minHeight: 650,
    autoHideMenuBar: true, show: false, backgroundColor: '#050505',
    title: title + ' - Xpressive Autoworks',
    icon: path.join(__dirname, '..', 'build', 'icons', 'app.ico'),
    webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.cjs'), sandbox: false }
  });
  workspacePopoutWindows.set(view, editor);
  editor.once('ready-to-show', () => editor.show());
  editor.on('closed', () => workspacePopoutWindows.delete(view));
  editor.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  await editor.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), { query: { popout: view }, hash: '/' + view });
  return { ok: true, view, reused: false };
});

ipcMain.handle('desktop:return-home', async () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    await mainWindow.webContents.executeJavaScript(\`(() => {
      const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
        (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
      if (button) button.click();
      return true;
    })()\`);
  }
  return { ok: true };
});

`;
  main = replaceOnce(main, 'function createWindow() {\n', handler + 'function createWindow() {\n', 'workspace window handler');
  fs.writeFileSync(mainPath, main);

  const indexPath = path.join(appRoot, 'dist', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('./workspace-popouts.css')) html = html.replace('</head>', '    <link rel="stylesheet" href="./workspace-popouts.css">\n  </head>');
  if (!html.includes('./workspace-popouts.js')) html = html.replace('</body>', '    <script src="./workspace-popouts.js"></script>\n  </body>');
  fs.writeFileSync(indexPath, html);
  console.log(`Installed workspace pop-outs in ${appRoot}`);
}
