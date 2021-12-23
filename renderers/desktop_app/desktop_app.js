const {ipcRenderer, shell} = require('electron');


function triggerNotification() {
  ipcRenderer.send('notification');
}

function openBrowserWindow(url) { // In stead of opening the page inside Electron
  shell.openExternal(url);
}