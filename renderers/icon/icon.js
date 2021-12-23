const {ipcRenderer} = require('electron');


const iconBasicPath = '../../resources/static/main-icons/icon-basic.png';
const iconNotifyPath = '../../resources/static/main-icons/icon-notify.png';

const iconImage = document.getElementById('iconImage');

window.onload = function () {
  iconImage.setAttribute('style', 'background-image: url(' + iconBasicPath + ')');
}

let notifications = 0;



/* Making the icon draggable */
let animationId;
let mouseX;
let mouseY;

function onMouseDown(e) {
  // Cleaning notifications if any
  notifications = 0;
  updateLookUponNotifications();
  // Dragging
  mouseX = e.clientX;  
  mouseY = e.clientY;
  document.addEventListener('mouseup', onMouseUp)
  requestAnimationFrame(this.moveWindow);
}

function onMouseUp(e) {
  ipcRenderer.send('windowMoved');
  document.removeEventListener('mouseup', onMouseUp)
  cancelAnimationFrame(animationId);
}

function moveWindow() {
  ipcRenderer.send('windowMoving', { mouseX, mouseY });
  animationId = requestAnimationFrame(moveWindow);
}


/* Launching the context menu when right-clicking */
function onContextmenu() {
  ipcRenderer.send('contextMenu');
}


/* Incoming notifications */
ipcRenderer.on('notification', () => {
  notifications ++;
  updateLookUponNotifications();
});

function updateLookUponNotifications() {
  if (notifications === 0) {
    iconImage.innerHTML = '';
    iconImage.setAttribute('style', 'background-image: url(' + iconBasicPath + ')');
  } else {
    iconImage.innerHTML = `
      <span>${notifications}</span>
    `;
    iconImage.setAttribute('style', 'background-image: url(' + iconNotifyPath + ')');
  }
}



/* 
  Optional: include css add-ons like animated badges, icons related
  to the upcoming notification, etc. The .html file makes 
  further integrations very easy.
*/ 