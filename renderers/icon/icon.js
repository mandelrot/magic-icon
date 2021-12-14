const iconBasicPath = '../../resources/static/main-icons/icon-basic.png';
const iconNotifyPath = '../../resources/static/main-icons/icon-notify.png'

const iconImage = document.getElementById('iconImage');

window.onload = function () {
  iconImage.setAttribute('src', iconBasicPath);
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