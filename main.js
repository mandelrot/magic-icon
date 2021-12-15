const path = require('path');
const { app, BrowserWindow, screen, ipcMain } = require('electron');

let iconWindow;
let menuWindow;
let appWindow;

const createIconWindow = () => {
  iconWindow = new BrowserWindow({
    width: 60,
    height: 60,
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


/* MAIN ICON DRAGGABLE FUNCTIONS */
ipcMain.on('windowMoving', (e, {mouseX, mouseY}) => {
  const { x, y } = screen.getCursorScreenPoint();
  iconWindow.setPosition(x - mouseX, y - mouseY);
});

ipcMain.on('windowMoved', () => {
  // To do later: once dragging is finished, work with the new window coordinates
});