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
      this.keyboard = keyboard;
  
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
      keyButton.dataset.code = keyConfig.code;
      
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
      }
      
      e.preventDefault();
    }
    
    keyboardKeyUpEvent(e) {
      const key = this.keysSet[e.code];
  
      if (!e.shiftKey) {
        this.isShiftPressed = false;
      }
      
      if (key) {
        key.button.classList.remove('pressed');
        this.clickResolve(key);
      }
      
      e.preventDefault();
    }
    
    clickResolve(key) {
      console.log(key, this.isShiftPressed)
      const letterCase = this.isShiftPressed ? 1 : 0;
      
      switch (key.config.type) {
        case 'default':
          this.outputValue(key.config.values[lang][letterCase]);
          break;
        
        case 'system':
          if (key.config.action) {
            this[key.config.action]();
          }
          break;
        
        default:
          break;
      }
    }
    
    buttonClickEvent(e) {
      console.log(e);
      debugger;
      
      if (e.target.classList.contains('key-button')) {
        const code = e.target.dataset.code;
        debugger;
        this.clickResolve(this.keysSet[code]);
      }
    }
    
    setEvents() {
      document.addEventListener('keydown', this.keyboardKeyDownEvent.bind(this));
      document.addEventListener('keyup', this.keyboardKeyUpEvent.bind(this));
      this.keyboard.addEventListener('click', this.buttonClickEvent.bind(this));
    }
  
    removePrevious() {
      let currentValue = this.output.value;
      currentValue = currentValue.slice(0, currentValue.length - 1);
      this.output.value = currentValue;
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
  
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
}());



