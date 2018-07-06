const { ipcRenderer } = require('electron');

// add global variables to your web page
window.isElectron = true
window.ipcRenderer = ipcRenderer
