const { app, BrowserWindow } = require('electron')
const path = require('path')

if (process.env.ELECTRON_START_URL) {
  require('electron-reload')(__dirname)
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1260,
    height: 780,
    webPreferences: {}
  })

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(startUrl)
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
