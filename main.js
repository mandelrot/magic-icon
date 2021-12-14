const path = require('path');
const { app, BrowserWindow } = require('electron');

let iconWindow;
let menuWindow;
let appWindow;

const createIconWindow = () => {
  iconWindow = new BrowserWindow({
    width: 80,
    height: 80,
    // The window proportion should be adapted to your icons/logos proportions 
    // to make it fit: see ./renderers/icon/icon.html
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false, // This line allows the renderers to use node commands
      disableHtmlFullscreenWindowResize: true
    }
  })

  // iconWindow.webContents.openDevTools();

  iconWindow.loadFile(path.join(__dirname, 'renderers', 'icon', 'icon.html'));
  iconWindow.once('ready-to-show', () => { iconWindow.show(); });
}


/* APP START - END */
app.whenReady().then( () => {
  createIconWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createIconWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

