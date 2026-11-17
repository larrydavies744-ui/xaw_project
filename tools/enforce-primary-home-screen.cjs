const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const names = ['app_live_extract', 'app_extracted'];

function replace(source, before, after, label, file) {
  if (source.includes(after)) return source;
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`${file}: expected one ${label} block, found ${count}`);
  return source.replace(before, after);
}

for (const name of names) {
  const file = path.join(root, '_private_dev', 'source', name, 'electron', 'main.cjs');
  let source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  source = replace(source,
`    const homeBounds = mainWindow && !mainWindow.isDestroyed()
      ? mainWindow.getBounds()
      : screen.getPrimaryDisplay().bounds;
    const homeDisplay = screen.getDisplayMatching(homeBounds);
    const targetDisplay = displays.find((display) => display.id !== homeDisplay.id) || homeDisplay;`,
`    const homeDisplay = screen.getPrimaryDisplay();
    const targetDisplay = displays.find((display) => display.id !== homeDisplay.id) || homeDisplay;`,
  'secondary-screen placement', file);

  source = replace(source,
`    if (mainWindow && !mainWindow.isDestroyed() && mainWindow !== editor) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      void mainWindow.webContents.executeJavaScript(\`(() => {
        const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
          (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
        if (button) button.click();
        return true;
      })()\`).catch(() => {});
    }`,
`    if (mainWindow && !mainWindow.isDestroyed() && mainWindow !== editor) {
      const primary = screen.getPrimaryDisplay();
      const area = primary.workArea;
      if (screen.getDisplayMatching(mainWindow.getBounds()).id !== primary.id) {
        if (mainWindow.isMaximized()) mainWindow.unmaximize();
        const width = Math.min(1440, area.width);
        const height = Math.min(940, area.height);
        mainWindow.setBounds({ x: area.x + Math.floor((area.width - width) / 2), y: area.y + Math.floor((area.height - height) / 2), width, height });
      }
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isMaximized()) mainWindow.maximize();
      mainWindow.show();
      void mainWindow.webContents.executeJavaScript(\`(() => {
        const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
          (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
        if (button) button.click();
        return true;
      })()\`).catch(() => {});
    }`,
  'main Home activation', file);

  const returnHomeAfter =
`  if (mainWindow && !mainWindow.isDestroyed()) {
    const primary = screen.getPrimaryDisplay();
    const area = primary.workArea;
    if (screen.getDisplayMatching(mainWindow.getBounds()).id !== primary.id) {
      if (mainWindow.isMaximized()) mainWindow.unmaximize();
      const width = Math.min(1440, area.width);
      const height = Math.min(940, area.height);
      mainWindow.setBounds({ x: area.x + Math.floor((area.width - width) / 2), y: area.y + Math.floor((area.height - height) / 2), width, height });
    }
    if (mainWindow.isMinimized()) mainWindow.restore();
    if (!mainWindow.isMaximized()) mainWindow.maximize();
    mainWindow.show();
    await mainWindow.webContents.executeJavaScript(\`(() => {
      const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
        (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
      if (button) button.click();
      return true;
    })()\`);`;
  const returnHomeBefore =
`  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    await mainWindow.webContents.executeJavaScript(\`(() => {
      const button = [...document.querySelectorAll('.horizontal-nav-tabs button')].find((entry) =>
        (entry.innerText || entry.title || '').trim().toLowerCase() === 'dashboard');
      if (button) button.click();
      return true;
    })()\`);`;
  const returnHomeBeforeWithFocus = returnHomeBefore.replace('    mainWindow.show();\n', '    mainWindow.show();\n    mainWindow.focus();\n');
  if (!source.includes(returnHomeAfter)) {
    if (source.includes(returnHomeBefore)) source = source.replace(returnHomeBefore, returnHomeAfter);
    else if (source.includes(returnHomeBeforeWithFocus)) source = source.replace(returnHomeBeforeWithFocus, returnHomeAfter);
    else throw new Error(`${file}: could not find return-home block`);
  }

  fs.writeFileSync(file, source);
  console.log(`Pinned Home to the primary display in ${file}`);
}
