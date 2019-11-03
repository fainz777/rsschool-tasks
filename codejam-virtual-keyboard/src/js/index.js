import '../styles/style.css';

import keyboardConfig from '../data/keyboard';

let btn;

(function() {
  const lang = 'en';
  
  class LocalStorage {
    constructor() {
    
    }
  }
  
  class VirtualKeyboard {
    constructor(selector) {
      this.selector = selector;
      this.keysSet = {};
      this.isShiftPressed = false;
    }
  
    createKeyboard() {
      const keyboardWrapper = document.createElement('div');
      keyboardWrapper.classList.add('keyboard-wrapper');
  
      const keyboardOutput = this.createKeyboardOutput();
      
      const keyboard = document.createElement('div');
      keyboard.classList.add('keyboard');
  
      keyboardConfig.forEach(rowConfig => {
        const keyboardRow = this.createKeyboardRow(rowConfig);
        keyboard.appendChild(keyboardRow);
      });
  
      keyboardWrapper.appendChild(keyboardOutput);
      keyboardWrapper.appendChild(keyboard);
      
      return keyboardWrapper;
    }
    
    createKeyboardOutput() {
      const keyboardOutput = document.createElement('textarea');
      keyboardOutput.classList.add('keyboard-output');
      this.output = keyboardOutput;
      
      return keyboardOutput;
    }
    
    createKeyboardRow(rowConfig) {
      const keyboardRow = document.createElement('div');
      keyboardRow.classList.add('keyboard-row');
  
      rowConfig.forEach(keyConfig => {
        const keyButton = this.createKeyboardKeyButton(keyConfig);
        keyboardRow.appendChild(keyButton);
      });
      
      return keyboardRow;
    }
    
    createKeyboardKeyButton(keyConfig) {
      const keyButton = document.createElement('span');
      const className = 'key-button';
      let symbol;
  
      if (keyConfig.type === 'system') {
        symbol = keyConfig.value;
      } else {
        symbol = keyConfig.values[lang][0];
      }
      
      keyButton.innerText = symbol;
      
      keyButton.classList.add(className);
      
      if (keyConfig.className) {
        keyButton.classList.add(keyConfig.className);
      }
      
      this.keysSet[keyConfig.code] = {
        button: keyButton,
        config: keyConfig
      };
  
      return keyButton;
    }
    
    outputValue(value) {
      let currentValue = this.output.value;
      currentValue += value;
      this.output.value = currentValue;
    }
    
    keyboardKeyDownEvent(e) {
      console.log('e: ', e);
      const key = this.keysSet[e.code];
  
      if (e.shiftKey) {
        this.isShiftPressed = true;
      }
      
      if (key) {
        key.button.classList.add('pressed');
        
        const letterCase = this.isShiftPressed ? 1 : 0;
        
        if (key.config.type === 'default') {
          this.outputValue(key.config.values[lang][letterCase]);
        }
        

      }
      
      e.preventDefault();
    }
    
    keyboardKeyUpEvent(e) {
      const key = this.keysSet[e.code];
  
      if (e.shiftKey) {
        this.isShiftPressed = false;
      }
      
      if (key) {
        key.button.classList.remove('pressed');
      }
      
      e.preventDefault();
    }
    
    setEvents() {
      document.addEventListener('keydown', this.keyboardKeyDownEvent.bind(this));
      document.addEventListener('keyup', this.keyboardKeyUpEvent.bind(this));
    }
    
    init() {
      const keyboard = this.createKeyboard();
      document.querySelector(this.selector).appendChild(keyboard);
      this.setEvents();
    }
  }
  
  const initApp = () => {
    const virtualKeyboard = new VirtualKeyboard('body');
    virtualKeyboard.init();
  };
  /*const buildKeyboard = () => {
    
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
  };*/
  
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
    /*document.addEventListener('keyup', (e) => {
      console.log(`code: ${e.code}, key: ${e.key}`);
      btn.style.color = 'red';
    });
    buildKeyboard();
    
    btn = document.createElement('div');
    btn.innerText = '1111';
    document.querySelector('body').appendChild(btn);*/
    
  });
}());



