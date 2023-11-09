// Electron setup / config

const {
  app,
  BrowserWindow
} = require('electron')

let appWindow

function createWindow() {
  appWindow = new BrowserWindow({
    width: 1200,
    height: 800
  })

  appWindow.webContents.openDevTools()

  appWindow.loadFile('dist/ldV2_Angular/index.html');

  appWindow.on('closed', function () {
    appWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
})
