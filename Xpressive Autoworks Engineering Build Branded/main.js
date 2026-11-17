const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');

function getIconPath() {
	return process.platform === 'win32'
		? path.join(__dirname, 'assets', 'icon.ico')
		: path.join(__dirname, 'assets', 'icon.png');
}

function createSplashWindow() {
	const splashWindow = new BrowserWindow({
		width: 620,
		height: 420,
		resizable: false,
		movable: false,
		frame: false,
		show: false,
		backgroundColor: '#1f1512',
		alwaysOnTop: true,
		skipTaskbar: true,
		icon: getIconPath(),
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false
		}
	});

	splashWindow.loadFile('splash.html');
	splashWindow.once('ready-to-show', () => {
		splashWindow.show();
	});

	return splashWindow;
}

function createMainWindow() {
	const mainWindow = new BrowserWindow({
		width: 1540,
		height: 980,
		minWidth: 1220,
		minHeight: 760,
		backgroundColor: '#f6efe4',
		autoHideMenuBar: true,
		icon: getIconPath(),
		show: false,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false
		}
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: 'deny' };
	});

	mainWindow.loadFile('index.html');

	return mainWindow;
}

ipcMain.handle('copilot:open-external', async (_event, url) => {
	if (typeof url !== 'string' || !url.trim()) {
		return false;
	}
	try {
		await shell.openExternal(url);
		return true;
	} catch {
		return false;
	}
});

app.whenReady().then(() => {
	const splashWindow = createSplashWindow();
	const mainWindow = createMainWindow();

	mainWindow.once('ready-to-show', () => {
		setTimeout(() => {
			if (!splashWindow.isDestroyed()) {
				splashWindow.close();
			}
			mainWindow.show();
		}, 5000);
	});

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			const nextSplashWindow = createSplashWindow();
			const nextMainWindow = createMainWindow();
			nextMainWindow.once('ready-to-show', () => {
				setTimeout(() => {
					if (!nextSplashWindow.isDestroyed()) {
						nextSplashWindow.close();
					}
					nextMainWindow.show();
				}, 5000);
			});
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

ipcMain.handle('program:open-engineering-suite', async () => {
	const candidates = [
		path.join(process.resourcesPath, 'engineering-suite', 'Xpressive Autoworks Engineering Repair Suite.exe'),
		path.resolve(__dirname, '..', 'Xpressive Autoworks Customer App', 'Xpressive Autoworks Engineering Repair Suite.exe')
	];
	const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
	if (process.platform !== 'win32' || !executablePath) {
		return { ok: false, message: 'The Engineering Repair Suite installation could not be found.' };
	}
	try {
		const child = spawn(executablePath, [], { detached: true, stdio: 'ignore', windowsHide: false });
		child.unref();
		return { ok: true };
	} catch {
		return { ok: false, message: 'The Engineering Repair Suite could not be opened.' };
	}
});
