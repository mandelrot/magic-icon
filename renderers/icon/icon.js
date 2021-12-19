const iconBasicPath = '../../resources/static/main-icons/icon-basic.png';
const iconNotifyPath = '../../resources/static/main-icons/icon-notify.png';


const iconImage = document.getElementById('iconImage');

window.onload = function () {
  iconImage.setAttribute('style', 'background-image: url(' + iconBasicPath + ')');
}

const {ipcRenderer} = require('electron');


/* Making the icon draggable */
let animationId;
let mouseX;
let mouseY;

function onMouseDown(e) {
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



/* 
To be included later: 

  - Communication with the main process

  - When receiving a message saying there are updates to check:
  switch between logos (interval) creating a "blinking" effect,
  to tell the user there's some activity that needs attention

Optional: 

  - Include css add-ons like animated badges, icons related
  to the upcoming notification, etc. The .html file makes 
  further integrations very easy.
*/