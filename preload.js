const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();

// add global variables to your web page
window.isElectron = true
window.ipcRenderer = ipcRenderer
window.store = store
