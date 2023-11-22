// Electron setup / config

const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
let appWindow

function createWindow() {
  appWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "dist", "ldV2_Angular", "assets", "sncf-logo.png"),
    autoHideMenuBar: true,
  })

  //appWindow.webContents.openDevTools()

  appWindow.maximize()

  appWindow.loadFile("dist/ldV2_Angular/index.html");

  appWindow.on('closed', function () {
    appWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
})
