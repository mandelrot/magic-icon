const path = require('path');
const { app, BrowserWindow } = require('electron');

let iconWindow;
let menuWindow;
let appWindow;

const createIconWindow = () => {
  iconWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  iconWindow.loadFile(path.join(__dirname, 'renderers', 'icon', 'icon.html'))
}



app.whenReady().then( () => {
  createIconWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createIconWindow()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

