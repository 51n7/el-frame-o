const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const Store = require('electron-store');
const data = new Store();

// data.set('unicorn', 'say what??');
// console.log(data.get('unicorn'));

// data.set('pages.3', { "title": "Discord", "url": "https://discordapp.com/", "css": "body { color: red; } h1 { background: red; }" });
console.log( data.get('pages') );


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
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function () { mainWindow = null })
}

app.on('ready', () => {
  
  const home = globalShortcut.register('CommandOrControl+Shift+H', () => {
    console.log('CommandOrControl+Shift+H is pressed')

    // mainWindow.loadURL('https://app.getflow.com/')
    mainWindow.loadFile('index.html')
  })

  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { app.quit() } // On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
})

app.on('activate', function () {
  if (mainWindow === null) { createWindow() } // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
})


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
