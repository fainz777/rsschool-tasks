import '../styles/style.css';

import keyboardConfig from '../data/keyboard';

(function () {
  //
  // class LocalStorage {
  //   constructor() {
  //
  //   }
  // }

  class VirtualKeyboard {
    constructor(selector) {
      this.selector = selector;
      this.keysSet = {};
      this.isShiftPressed = false;
      this.isCapsButtonPressed = false;
      this.isAltPressed = false;
      this.langs = ['en', 'ru'];
      this.currentLayoutIndex = 0;

      this.buttonPressedClass = 'pressed';
      this.upperCaseOnClass = 'keyboard--case-on';
      this.layoutHiddenClass = 'keyboard-layout--hidden';
    }

    get lang() {
      return this.langs[this.currentLayoutIndex];
    }

    createKeyboard() {
      const keyboardWrapper = document.createElement('div');
      keyboardWrapper.classList.add('keyboard-wrapper');

      const keyboardOutput = this.createKeyboardOutput();

      const keyboard = document.createElement('div');
      keyboard.classList.add('keyboard');
      this.keyboard = keyboard;

      keyboardConfig.forEach((rowConfig) => {
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

      rowConfig.forEach((keyConfig) => {
        const keyButton = this.createKeyboardKeyButton(keyConfig);
        keyboardRow.appendChild(keyButton);
      });

      return keyboardRow;
    }

    createKeyboardKeyButton(keyConfig) {
      const keyButton = document.createElement('span');
      const className = 'key-button';
      let symbol = '';

      if (keyConfig.type === 'system') {
        symbol = keyConfig.value;
      } else {
        for (let lang in keyConfig.values) {
          symbol += `
            <span class="keyboard-layout ${this.lang != lang ? this.layoutHiddenClass : ''}" data-lang="${lang}">
              <span class="case-off">${keyConfig.values[lang][0]}</span>
              <span class="case-on">${keyConfig.values[lang][1]}</span>
            </span>
          `;
        }
      }

      keyButton.innerHTML = symbol;

      keyButton.classList.add(className);
      keyButton.dataset.code = keyConfig.code;

      if (keyConfig.className) {
        keyButton.classList.add(keyConfig.className);
      }

      this.keysSet[keyConfig.code] = {
        button: keyButton,
        config: keyConfig,
      };

      return keyButton;
    }

    outputValue(value) {
      let currentValue = this.output.value;
      currentValue += value;
      this.output.value = currentValue;
    }

    keyboardKeyDownEvent(e) {
      const key = this.keysSet[e.code];

      if (e.shiftKey) {
        this.isShiftPressed = true;
        this.keyboard.classList.add(this.upperCaseOnClass);
      }

      if (key) {
        key.button.classList.add(this.buttonPressedClass);
      }

      e.preventDefault();
    }

    keyboardKeyUpEvent(e) {
      const key = this.keysSet[e.code];

      if (!e.shiftKey) {
        this.isShiftPressed = false;
        this.keyboard.classList.remove(this.upperCaseOnClass);
      }

      if (key) {
        key.button.classList.remove(this.buttonPressedClass);
        this.clickResolve(key);
      }

      e.preventDefault();
    }

    clickResolve(key) {
      const letterCase = this.isShiftPressed ? 1 : 0;

      switch (key.config.type) {
        case 'default':
          this.outputValue(key.config.values[this.lang][letterCase]);

          if (this.isShiftPressed) {
            this.isShiftPressed = false;
            document.querySelector(`.${this.buttonPressedClass}`).classList.remove(this.buttonPressedClass);
            document.querySelector('.keyboard').classList.remove(this.upperCaseOnClass);
          }

          break;

        case 'system':
          if (key.config.action) {
            this[key.config.action](key);
          }
          break;

        default:
          break;
      }
    }

    buttonClickEvent(e) {
      if (e.target.classList.contains('key-button')) {
        e.stopPropagation();
        const code = e.target.dataset.code;
        this.clickResolve(this.keysSet[code]);
      }
    }

    setEvents() {
      document.addEventListener('keydown', this.keyboardKeyDownEvent.bind(this));
      document.addEventListener('keyup', this.keyboardKeyUpEvent.bind(this));
      this.keyboard.addEventListener('click', this.buttonClickEvent.bind(this), false);
    }

    removePrevious() {
      let currentValue = this.output.value;
      currentValue = currentValue.slice(0, currentValue.length - 1);
      this.output.value = currentValue;
    }

    shift(key) {
      this.isShiftPressed = !this.isShiftPressed;

      if (this.isShiftPressed) {
        // this.isShiftPressed = true;
        this.keyboard.classList.add(this.upperCaseOnClass);
        key.button.classList.add(this.buttonPressedClass);
      } else {
        // this.isShiftPressed = false;
        this.keyboard.classList.remove(this.upperCaseOnClass);
        key.button.classList.remove(this.buttonPressedClass);
      }
    }

    alt(key) {
      this.isAltPressed = !this.isAltPressed;

      if (this.isAltPressed && this.isShiftPressed) {
        key.button.classList.add(this.buttonPressedClass);
        this.switchKeyboardLayout();
      }
    }

    resolveCase(isUp, btn) {
      if (isUp) {
      }
    }

    switchKeyboardLayout() {
      this.currentLayoutIndex++;
      this.currentLayoutIndex = this.currentLayoutIndex >= this.langs.length ? 0 : this.currentLayoutIndex;

      this.keyboard
        .querySelectorAll('.keyboard-layout')
        .forEach(elem => {
          if (elem.dataset.lang === this.lang) {
            elem.classList.remove(this.layoutHiddenClass);
          } else {
            elem.classList.add(this.layoutHiddenClass);
          }
        });

      this.keyboard
        .querySelectorAll(`.${this.buttonPressedClass}`)
        .forEach(button => {
          button.classList.remove(this.buttonPressedClass);
        });

      this.keyboard.classList.remove(this.upperCaseOnClass);

      this.isShiftPressed = false;
      this.isAltPressed = false;
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
