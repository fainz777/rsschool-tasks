import '../styles/style.css';

import keyboard from '../data/keyboard';

const lang = 'en';

const buildKeyboard = () => {
  let html = '<div class="keyboard">';

  keyboard.forEach((row) => {
    html += '<div class="keyboard-row">';

    row.forEach((key) => {
      let symbol;
      let className = key.className || '';
      
      if (key.type === 'system') {
        symbol = key.value;
      } else {
        symbol = key.values[lang][0];
      }

      html += `<span class="key-button ${className.toLowerCase()}">${symbol}</span>`;
    });

    html += '</div>';
  });

  html += '</div>';

  document.querySelector('body').innerHTML = html;
};

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keyup', (e) => {
    console.log(`code: ${e.code}, key: ${e.key}`);
  });
  buildKeyboard();
});
