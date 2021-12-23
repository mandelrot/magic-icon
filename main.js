const path = require('path');
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state'); // Persisting window position after restart
const { shell } = require('electron/common');


let iconWindow;
const iconWindowWidth = 60;  // The window proportion should match the icon/logo
const iconWindowHeight = 60; // proportions, see ./renderers/icon/icon.html

let menuWindow;
const menuWindowWidth = 260;  // This should match the .html menu,
const menuWindowHeight = 165; // see ./renderers/menu/menu.html
let menuWindowPosition = {}; // Recalculated when relocating the main icon




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




/* MAIN ICON POSITION AND DRAGGABLE FUNCTIONS */
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
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false,
      disableHtmlFullscreenWindowResize: true
    }
  });

  iconWindow.loadFile(path.join(__dirname, 'renderers', 'icon', 'icon.html'));
  winState.manage(iconWindow);
  iconWindow.once('ready-to-show', () => { 
    iconWindow.show(); 
    adjustIconWindowPosition();
  });

  iconWindow.webContents.send('notification')
}

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

  setMenuWindowCoordinates(); // They go together
}

ipcMain.on('windowMoving', (e, {mouseX, mouseY}) => {
  const { x, y } = screen.getCursorScreenPoint();
  iconWindow.setPosition(x - mouseX, y - mouseY);
});

ipcMain.on('windowMoved', () => {
  adjustIconWindowPosition();
});




/* MENU WINDOW (CONTEXT-MENU-LIKE) */
const createMenuWindow = () => {
  menuWindow = new BrowserWindow({
    width: menuWindowWidth,
    height: menuWindowHeight,
    x: menuWindowPosition.x,
    y: menuWindowPosition.y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false,
      disableHtmlFullscreenWindowResize: true
    }
  });

  menuWindow.loadFile(path.join(__dirname, 'renderers', 'menu', 'menu.html'));
  
  menuWindow.once('ready-to-show', () => { 
    menuWindow.show(); 
  });
  menuWindow.once('blur', () => {
    menuWindow.close();
    menuWindow = null;
  });
}

function setMenuWindowCoordinates() { 
  const currentScreenBounds = getCurrentScreenBounds();
  const iconWindowCoordinates = getIconWindowCoordinates();

  let x = iconWindowCoordinates.right;
  let y = iconWindowCoordinates.bottom;
  // Relocation in case the menu steps out the screen boundaries
  if (x + menuWindowWidth > currentScreenBounds.right) {
    x = iconWindowCoordinates.left - menuWindowWidth;
  }
  if (y + menuWindowHeight > currentScreenBounds.bottom) {
    y = iconWindowCoordinates.top - menuWindowHeight;
  }
  
  menuWindowPosition = { x, y };
}

ipcMain.on('contextMenu', () => {
  createMenuWindow();
});

ipcMain.on('menuAppClicked', (event, elementName) => {
  // The "elementName" is the id of the menu item clicked (see menu.html),
  // in this function we handle the user's request as needed

  switch (elementName) {
    case 'desktop_app': 
      openDesktopWindow(elementName);
      break;
    case 'web':
      shell.openExternal('http://josealeman.info')
      break;
    case 'quit':
      app.quit();
      break;
    default:
      menuWindow.close();
      menuWindow = null;
      break;
  }

})



/* DESKTOP APP WINDOW */
const openDesktopWindow = (appName) => {
  // If the window is already open we just set it on focus
  const currentWindows = BrowserWindow.getAllWindows();
  for (const window of currentWindows) {
    if (window.name === appName) {
      return window.focus();
    }
  }

  const appWindow = new BrowserWindow({
    width: 920,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, contextIsolation: false
    }
  });
  appWindow.name = appName; // Trick to avoid duplicate windows
  appWindow.loadFile(path.join(__dirname, 'renderers', appName, appName + '.html'));
   // Security warning about Electron: if you open a desktop Electron window to load
   // an external webpage whose code you don't know, do NOT enable "nodeIntegration"
   // (just comment that line in the webPreferences) to keep the context isolation.

   appWindow.once('ready-to-show', () => { 
    appWindow.show(); 
  });
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
  const bottom = top + iconWindowHeight;
  return { left, right, top, bottom };
}

// Notifications
ipcMain.on('notification', (e) => {
  sendNotification([iconWindow]); // See function below
});

async function sendNotification(windowsArray) {
  // In the basic example the notifications are sent only to the icon window,
  // but being an array you could include others here and implement listeners there
  for (const window of windowsArray) {
    if (window.webContents) {
      window.webContents.send('notification');
    } else {
      // Here you should place the anternative behavior in case
      // the window you are sending the message isn't created yet
    }
  }
}
