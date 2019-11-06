import '../styles/style.css';

import VirtualKeyboard from './keyboard';

const initApp = () => {
  const virtualKeyboard = new VirtualKeyboard('body');
  virtualKeyboard.init();
};

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
