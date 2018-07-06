// Modules to control application life and create native browser window
const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    // titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    minWidth: 320,
    width: 820,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  mainWindow.loadFile('index.html')
  // mainWindow.loadURL('https://app.getflow.com/')
  // mainWindow.loadURL('https://discordapp.com/')


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function execute () {
  console.log('execute');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  
  const home = globalShortcut.register('CommandOrControl+Shift+H', () => {
    console.log('CommandOrControl+Shift+H is pressed')
    // ipcRenderer.send('asynchronous-message', 'ping');

    // mainWindow.loadURL('https://app.getflow.com/')
    mainWindow.loadFile('index.html')
  })

  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('asynchronous-message', (event, arg) => {
  
  mainWindow.loadURL(arg)

  mainWindow.webContents.on('did-finish-load', function() {
    fs.readFile(__dirname+ '/assets/flow.css', "utf-8", function(error, data) {
      if(!error) {
        var formatedData = data.replace(/\s+/g, '').trim()
        
        mainWindow.webContents.executeJavaScript(`
          style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = '${ formatedData }';
          document.querySelector('head').appendChild(style);
        `);
        
        // mainWindow.webContents.insertCSS(formatedData)
      }
    })
  })
})

