const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('copilotBridge', {
	openExternal(url) {
		return ipcRenderer.invoke('copilot:open-external', url);
	},
	isElectron: true
});

contextBridge.exposeInMainWorld('programBridge', {
	openEngineeringSuite() {
		return ipcRenderer.invoke('program:open-engineering-suite');
	},
	isElectron: true
});
