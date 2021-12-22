const {ipcRenderer} = require('electron');


function sendMessageToMainProcess(elementName) {
  ipcRenderer.send('menuAppClicked', elementName);
  // See main.js --> ipcMain.on('menuAppClicked)...
  // to see how to handle this messages
}
