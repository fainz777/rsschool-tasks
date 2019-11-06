import keyboardConfig from '../data/keyboard';

export default class VirtualKeyboard {
  constructor(selector) {
    this.selector = selector;
    this.keysSet = {};

    this.isShiftPressed = false;
    this.isAltPressed = false;
    this.isCapsPressed = false;
    this.capsLockCode = 'CapsLock';

    this.langs = ['en', 'ru'];
    this.currentLayoutIndex = 0;
    this.langKey = 'lang';

    this.classes = {
      keyboardWrapper: 'keyboard-wrapper',
      keyboard: 'keyboard',
      keyboardOutput: 'keyboard-output',
      keyboardRow: 'keyboard-row',
      keyButton: 'key-button',
      buttonPressed: 'pressed',
      upperCaseOn: 'keyboard--case-on',
      layoutHidden: 'keyboard-layout--hidden',
    };
  }

  get lang() {
    return this.langs[this.currentLayoutIndex];
  }

  //  Keyboard Layout Creation
  createKeyboard() {
    const keyboardWrapper = document.createElement('div');
    keyboardWrapper.classList.add(this.classes.keyboardWrapper);

    const keyboardOutput = this.createKeyboardOutput();

    const keyboard = document.createElement('div');
    keyboard.classList.add(this.classes.keyboard);
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
    keyboardOutput.classList.add(this.classes.keyboardOutput);
    this.output = keyboardOutput;

    return keyboardOutput;
  }

  createKeyboardRow(rowConfig) {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add(this.classes.keyboardRow);

    rowConfig.forEach((keyConfig) => {
      const keyButton = this.createKeyboardKeyButton(keyConfig);
      keyboardRow.appendChild(keyButton);
    });

    return keyboardRow;
  }

  createKeyboardKeyButton(keyConfig) {
    const keyButton = document.createElement('span');
    let buttonHtml = '';

    if (keyConfig.type === 'system') {
      buttonHtml = keyConfig.value;
    } else {
      Object.keys(keyConfig.values).forEach((lang) => {
        buttonHtml += `
            <span class="keyboard-layout ${this.lang !== lang ? this.classes.layoutHidden : ''}" data-lang="${lang}">
              <span class="case-off">${keyConfig.placeholder || keyConfig.values[lang][0]}</span>
              <span class="case-on">${keyConfig.placeholder || keyConfig.values[lang][1]}</span>
            </span>
          `;
      });
    }

    keyButton.innerHTML = buttonHtml;

    keyButton.classList.add(this.classes.keyButton);
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

  // Events Listeners
  setEvents() {
    document.addEventListener('keydown', this.keyboardKeyDownEvent.bind(this));
    document.addEventListener('keyup', this.keyboardKeyUpEvent.bind(this));
    this.keyboard.addEventListener('click', this.buttonClickEvent.bind(this), false);
  }

  keyboardKeyDownEvent(e) {
    const key = this.keysSet[e.code];

    if (key) {
      key.button.classList.add(this.classes.buttonPressed);

      if (e.shiftKey) {
        this.isShiftPressed = true;
        this.keyboard.classList.add(this.classes.upperCaseOn);
      }

      if (e.altKey) {
        this.isAltPressed = true;
      }

      e.preventDefault();
    }
  }

  keyboardKeyUpEvent(e) {
    const key = this.keysSet[e.code];

    if (key) {
      key.button.classList.remove(this.classes.buttonPressed);
      this.clickResolve(key);

      if (!e.shiftKey && !e.altKey) {
        this.isShiftPressed = false;
        this.keyboard.classList.remove(this.classes.upperCaseOn);
      } else if (e.shiftKey || e.altKey) {
        this.switchKeyboardLayout();
      }

      if (e.code === this.capsLockCode) {
        this.capslock(key);
      }

      e.preventDefault();
    }
  }

  buttonClickEvent(e) {
    const target = e.target.closest(`.${this.classes.keyButton}`);

    if (target) {
      e.stopPropagation();
      const { code } = target.dataset;
      this.clickResolve(this.keysSet[code]);
    }
  }


  // ////
  clickResolve(key) {
    const letterCase = this.isShiftPressed ? 1 : 0;

    switch (key.config.type) {
      case 'default':
        this.outputValue(key.config.values[this.lang][letterCase]);

        if (this.isShiftPressed) {
          if (!this.isCapsPressed) {
            this.isShiftPressed = false;
            this.keyboard.querySelector(`.${this.classes.buttonPressed}`).classList.remove(this.classes.buttonPressed);
            this.keyboard.classList.remove(this.classes.upperCaseOn);
          }
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

    this.output.focus();
  }

  outputValue(keyValue) {
    const { selectionStart } = this.output;
    const { selectionEnd } = this.output;

    this.output.setRangeText(keyValue, selectionStart, selectionEnd);

    this.output.selectionStart += keyValue.length;
    this.output.selectionEnd = this.output.selectionStart;
  }

  backspace() {
    let { selectionStart } = this.output;
    const { selectionEnd } = this.output;

    if (selectionStart === selectionEnd) {
      selectionStart -= 1;
    }
    this.output.setRangeText('', selectionStart, selectionEnd);
    // let currentValue = this.output.value;
    // currentValue = currentValue.slice(0, currentValue.length - 1);
    // this.output.value = currentValue;
  }

  shift(key) {
    this.isShiftPressed = !this.isShiftPressed;

    if (this.isShiftPressed) {
      // this.isShiftPressed = true;
      this.keyboard.classList.add(this.classes.upperCaseOn);
      key.button.classList.add(this.classes.buttonPressed);

      if (this.isAltPressed) {
        this.switchKeyboardLayout();
      }
    } else {
      // this.isShiftPressed = false;
      this.keyboard.classList.remove(this.classes.upperCaseOn);
      key.button.classList.remove(this.classes.buttonPressed);
    }
  }

  alt(key) {
    this.isAltPressed = !this.isAltPressed;

    if (this.isAltPressed) {
      key.button.classList.add(this.classes.buttonPressed);

      if (this.isShiftPressed) {
        this.switchKeyboardLayout();
      }
    } else {
      key.button.classList.remove(this.classes.buttonPressed);
    }
  }

  capslock(key) {
    this.isShiftPressed = !this.isShiftPressed;
    this.isCapsPressed = !this.isCapsPressed;
    key.button.classList.toggle(this.classes.buttonPressed);
    this.keyboard.classList.toggle(this.classes.upperCaseOn);
  }

  switchKeyboardLayout() {
    this.currentLayoutIndex += 1;
    this.currentLayoutIndex = this.currentLayoutIndex >= this.langs.length
      ? 0
      : this.currentLayoutIndex;

    localStorage.setItem(this.langKey, this.currentLayoutIndex);

    this.keyboard
      .querySelectorAll('.keyboard-layout')
      .forEach((elem) => {
        if (elem.dataset.lang === this.lang) {
          elem.classList.remove(this.classes.layoutHidden);
        } else {
          elem.classList.add(this.classes.layoutHidden);
        }
      });

    this.keyboard
      .querySelectorAll(`.${this.classes.buttonPressed}`)
      .forEach((button) => {
        button.classList.remove(this.classes.buttonPressed);
      });

    this.keyboard.classList.remove(this.classes.upperCaseOn);

    this.isShiftPressed = false;
    this.isAltPressed = false;
  }


  // Init
  init() {
    const layoutIndex = parseInt(localStorage.getItem(this.langKey), 10);

    if (layoutIndex) {
      this.currentLayoutIndex = layoutIndex;
    }

    const keyboard = this.createKeyboard();
    document.querySelector(this.selector).appendChild(keyboard);
    this.setEvents();
  }
}
