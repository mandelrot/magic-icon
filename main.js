const path = require('path');
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state'); // Persisting window position after restart


let iconWindow;
let menuWindow;
let appWindow;

const iconWindowWidth = 60;  // The window proportion should match the icon/logo
const iconWindowHeight = 60; // proportions, see ./renderers/icon/icon.html
const menuWindowCoordinates = {}; // Context menu when right-clicking the icon




/* APP START - END */
app.whenReady().then( () => {
  createIconWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createIconWindow()
  });
});

const createIconWindow = () => {

  let winState = windowStateKeeper({
    defaultWidth: iconWindowWidth, defaultHeight: iconWindowHeight
  });

  iconWindow = new BrowserWindow({
    width: iconWindowWidth,
    height: iconWindowHeight,
    x: winState.x,
    y: winState.y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false,
      disableHtmlFullscreenWindowResize: true
    }
  })
  iconWindow.loadFile(path.join(__dirname, 'renderers', 'icon', 'icon.html'));
  winState.manage(iconWindow);
  iconWindow.once('ready-to-show', () => { 
    iconWindow.show(); 
    adjustIconWindowPosition();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});




/* MAIN ICON POSITION AND DRAGGABLE FUNCTIONS */
function adjustIconWindowPosition() { // if needed
  const iconWindowCoordinates = getIconWindowCoordinates();
  const currentScreenBounds = getCurrentScreenBounds();
  // If the icon window steps out of the screen boundaries we push it into them
  let leftOk, topOk;
  leftOk = iconWindowCoordinates.left < currentScreenBounds.left ?
    currentScreenBounds.left : iconWindowCoordinates.left;
  topOk = iconWindowCoordinates.top < currentScreenBounds.top ? 
    currentScreenBounds.top : iconWindowCoordinates.top;
  leftOk = (leftOk + iconWindowWidth) > currentScreenBounds.right ?
    currentScreenBounds.right - iconWindowWidth : leftOk;
  topOk = (topOk + iconWindowHeight) > currentScreenBounds.bottom ?
    currentScreenBounds.bottom - iconWindowHeight : topOk;
  iconWindow.setPosition(leftOk, topOk);
}

ipcMain.on('windowMoving', (e, {mouseX, mouseY}) => {
  const { x, y } = screen.getCursorScreenPoint();
  iconWindow.setPosition(x - mouseX, y - mouseY);
});

ipcMain.on('windowMoved', () => {
  adjustIconWindowPosition();
  setMenuWindowCoordinates(); // So it will show faster when required
});




/* MENU WINDOW (CONTEXT-MENU-LIKE) */
function setMenuWindowCoordinates() { 
  const currentScreenBounds = getCurrentScreenBounds();
  const iconWindowCoordinates = getIconWindowCoordinates();
  
  // To do next
}




/* AUX TOOLS */
function getCurrentScreenBounds() { // The current workspace coordinates
  const currentScreen = screen.getDisplayNearestPoint({
    x: iconWindow.getPosition()[0], 
    y: iconWindow.getPosition()[1]
  });
  return {
    left: currentScreen.workArea.x,
    top: currentScreen.workArea.y,
    right: currentScreen.workArea.x + currentScreen.workArea.width,
    bottom: currentScreen.workArea.y + currentScreen.workArea.height
  }
}

function getIconWindowCoordinates() {
  const left = +(iconWindow.getPosition()[0]);
  const top = +(iconWindow.getPosition()[1]);
  const right = left + iconWindowWidth;
  const bottom = left + iconWindowHeight;
  return { left, right, top, bottom };
}
