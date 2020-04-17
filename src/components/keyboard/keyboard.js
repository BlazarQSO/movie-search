import getRequest from '../search/search';

export default class Keyboard {
    constructor(buttons, input) {
        this.shiftL = false;
        this.shiftR = false;
        this.ctrlL = false;
        this.ctrlR = false;
        this.altL = false;
        this.altR = false;
        this.caps = false;
        this.ctrlAlt = false;
        this.lang = sessionStorage.getItem('lang') || 'firstLang';
        this.buttons = buttons;
        this.input = input;
        this.idBtns = Object.keys(this.buttons);
        this.select = -1;
        this.selectionSideLeft = false;
    }

    create(targetId) {
        this.createKeyboard(targetId);
        this.createEvent(targetId);
    }

    createKeyboard(targetId) {
        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';

        this.input.addEventListener('keydown', (e) => {
            e.preventDefault();
        }, false);

        const keyboard = document.createElement('div');
        keyboard.className = 'keyboard';
        keyboard.id = 'keyboard';

        for (let i = 0, len = this.idBtns.length; i < len; i += 1) {
            const btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.className = 'button';
            btn.id = this.idBtns[i];
            btn.classList.add(this.idBtns[i]);

            if (this.lang === 'secondLang' && !this.buttons[this.idBtns[i]].service) {
                const letter = this.buttons[this.idBtns[i]].secondLang.signDef;
                this.buttons[this.idBtns[i]].current = letter;
            }
            btn.innerHTML = this.buttons[this.idBtns[i]].current;
            keyboard.append(btn);
        }

        wrapper.append(keyboard);
        document.getElementById(targetId).append(wrapper);
        document.getElementById('capsLock').classList.add('lamp');
        document.getElementById('arrowUp').classList.add('small-font');
        document.getElementById('arrowDown').classList.add('small-font');
        this.changeText();
        this.input.focus();
    }

    createEvent() {
        const keyboard = document.getElementById('keyboard');
        keyboard.addEventListener('mousedown', this.mouseDown.bind(this), false);
        keyboard.addEventListener('mouseup', this.mouseUp.bind(this), false);
        this.input.addEventListener('mouseup', this.mouseInputUp.bind(this), false);
        this.input.addEventListener('mousedown', this.setSelection.bind(this), false);

        this.keyDown = this.keyDown.bind(this);
        document.getElementById('body').addEventListener('keydown', this.keyDown, false);
        this.keyUp = this.keyUp.bind(this);
        document.getElementById('body').addEventListener('keyup', this.keyUp, false);
        this.keyDefault = this.keyDefault.bind(this);
        window.addEventListener('blur', this.keyDefault, false);
        window.addEventListener('resize', this.changeText);
    }

    writeLetter(current) {
        const select = this.input.selectionStart;
        let text = this.input.value;

        text = text.substring(0, select) + current + text.substring(select, text.length);
        this.input.value = text;
        if (current !== '    ') {
            this.input.selectionStart = select + 1;
            this.input.selectionEnd = select + 1;
        } else {
            this.input.selectionStart = select + 4;
            this.input.selectionEnd = select + 4;
        }
    }

    pressKey(id) {
        if (!this.buttons[id].service) {
            this.writeLetter(this.buttons[id].current);
        } else if (this.buttons[id].write) {
            this.writeLetter(this.buttons[id].write);
        } else {
            switch (id) {
            case 'delete':
                this.buttonDelete();
                break;
            case 'backspace':
                this.buttonBackspace();
                break;
            case 'shiftLeft':
                this.buttonLeftShiftDown();
                break;
            case 'shiftRight':
                this.buttonRightShiftDown();
                break;
            case 'controlLeft':
                this.buttonCtrlDown('left');
                break;
            case 'controlRight':
                this.buttonCtrlDown('right');
                break;
            case 'altLeft':
                this.buttonAltDown('left');
                break;
            case 'altRight':
                this.buttonAltDown('right');
                break;
            case 'capsLock':
                this.buttonCapsDown();
                break;
            case 'arrowLeft':
                this.buttonArrowLeft();
                break;
            case 'arrowRight':
                this.buttonArrowRight();
                break;
            case 'arrowDown':
                this.buttonArrowDown();
                break;
            case 'arrowUp':
                this.buttonArrowUp();
                break;
            case 'enter':
                getRequest();
                break;
            default:
                break;
            }
        }
    }

    upKey(id) {
        switch (id) {
        case 'shiftLeft':
            this.buttonLeftShiftUp();
            break;
        case 'shiftRight':
            this.buttonRightShiftUp();
            break;
        case 'controlLeft':
            this.buttonCtrlUp('left');
            break;
        case 'controlRight':
            this.buttonCtrlUp('right');
            break;
        case 'altLeft':
            this.buttonAltUp('left');
            break;
        case 'altRight':
            this.buttonAltUp('right');
            break;
        case 'capsLock':
            this.buttonCapsUp();
            break;
        default:
            break;
        }
        this.input.focus();
    }

    mouseDown(e) {
        if (e.target.closest('div').className === 'keyboard' && e.target.id !== 'keyboard') {
            if (e.code === 'KeyA' && (this.ctrlL || this.ctrlR)) {
                this.pushCtrlA();
            } else if (e.code === 'KeyC' && (this.ctrlL || this.ctrlR)) {
                this.pushCtrlC();
            } else if (e.code === 'KeyV' && (this.ctrlL || this.ctrlR)) {
                this.pushCtrlV();
            } else if (e.target.id !== 'capsLock') {
                this.pressKey(e.target.id);
            } else if (!this.buttons.capsLock.down) {
                this.buttons.capsLock.down = true;
                document.getElementById(e.target.id).classList.add('press');
                document.getElementById(e.target.id).classList.toggle('lampActive');
                this.pressKey(e.target.id);
            }
        }
    }

    mouseUp(e) {
        if (e.target.closest('div').className === 'keyboard') {
            this.buttons.capsLock.down = false;
            this.upKey(e.target.id);
        }
    }

    mouseInputUp() {
        if (this.input.selectionEnd !== this.input.selectionStart) {
            this.selectionSideLeft = (this.input.selectionDirection === 'backward');
        }
    }

    keyDown(e) {
        if (e.code === 'KeyA' && (this.ctrlL || this.ctrlR)) {
            this.pushCtrlA();
        } else if (e.code === 'KeyC' && (this.ctrlL || this.ctrlR)) {
            this.pushCtrlC();
        } else if (e.code === 'KeyV' && (this.ctrlL || this.ctrlR)) {
            this.pushCtrlV();
        } else {
            const id = e.code.substring(0, 1).toLowerCase() + e.code.substring(1, e.code.length);
            if (document.getElementById(id)) {
                if (id !== 'capsLock') {
                    document.getElementById(id).classList.add('press');
                    this.pressKey(id);
                } else if (!this.buttons.capsLock.down) {
                    this.buttons.capsLock.down = true;
                    document.getElementById(id).classList.add('press');
                    document.getElementById(id).classList.toggle('lampActive');
                    this.pressKey(id);
                }
            }
        }
    }

    keyUp(e) {
        const id = e.code.substring(0, 1).toLowerCase() + e.code.substring(1, e.code.length);
        if (document.getElementById(id)) {
            this.buttons.capsLock.down = false;
            document.getElementById(id).classList.remove('press');
            if (!e.shiftKey) {
                document.getElementById('shiftLeft').classList.remove('press');
                document.getElementById('shiftRight').classList.remove('press');
                this.shiftR = false;
                this.shiftL = false;
            }
            this.upKey(id);
        }
        this.input.focus();
    }

    keyDefault() {
        for (let i = 0, len = this.idBtns.length; i < len; i += 1) {
            document.getElementById(this.idBtns[i]).classList.remove('press');
        }
    }

    buttonDelete() {
        const select = this.input.selectionStart;
        const selectEnd = this.input.selectionEnd;
        let text = this.input.value;
        if (select === selectEnd) {
            text = text.substring(0, select) + text.substring(select + 1, text.length);
        } else {
            text = text.substring(0, select) + text.substring(selectEnd, text.length);
        }
        this.input.value = text;
        this.input.selectionStart = select;
        this.input.selectionEnd = select;
    }

    buttonBackspace() {
        const select = this.input.selectionStart;
        let text = this.input.value;
        const selectEnd = this.input.selectionEnd;

        if (select === selectEnd) {
            text = text.substring(0, select - 1) + text.substring(select, text.length);
            this.input.value = text;
            this.input.selectionStart = select - 1;
            this.input.selectionEnd = select - 1;
        } else {
            text = text.substring(0, select) + text.substring(selectEnd, text.length);
            this.input.value = text;
            this.input.selectionStart = select;
            this.input.selectionEnd = select;
        }
    }

    buttonLeftShiftDown() {
        this.rememberSelect();
        this.shiftL = true;
        if (!(this.shiftL && this.shiftR)) {
            this.redrawLetters();
        }
    }

    buttonRightShiftDown() {
        this.rememberSelect();
        this.shiftR = true;
        if (!(this.shiftL && this.shiftR)) {
            this.redrawLetters();
        }
    }

    buttonLeftShiftUp() {
        if (this.select > this.input.selectionStart) {
            this.selectionSideLeft = true;
        } else {
            this.selectionSideLeft = false;
        }
        this.select = -1;

        this.shiftL = false;
        if (!this.shiftR) {
            this.redrawLetters();
        }
    }

    buttonRightShiftUp() {
        if (this.select > this.input.selectionStart) {
            this.selectionSideLeft = true;
        } else {
            this.selectionSideLeft = false;
        }
        this.select = -1;

        this.shiftR = false;
        if (!this.shiftL) {
            this.redrawLetters();
        }
    }

    rememberSelect() {
        if (this.input.selectionStart === this.input.selectionEnd) {
            this.select = this.input.selectionStart;
        } else if (this.selectionSideLeft) {
            this.select = this.input.selectionEnd;
        } else {
            this.select = this.input.selectionStart;
        }
    }

    buttonCtrlDown(direction) {
        this.ctrlL = (direction === 'left') ? true : this.ctrlL;
        this.ctrlR = (direction === 'right') ? true : this.ctrlR;
        if ((this.altL || this.altR) && !this.ctrlAlt) {
            this.lang = (this.lang === 'firstLang') ? 'secondLang' : 'firstLang';
            sessionStorage.setItem('lang', this.lang);
            this.ctrlAlt = true;
            this.redrawLetters();
        }
    }

    buttonCtrlUp(direction) {
        this.ctrlL = (direction === 'left') ? false : this.ctrlL;
        this.ctrlR = (direction === 'right') ? false : this.ctrlR;
        if (!this.ctrlL && !this.ctrlR) {
            this.ctrlAlt = false;
        }
    }

    buttonAltDown(direction) {
        this.altL = (direction === 'left') ? true : this.altL;
        this.altR = (direction === 'right') ? true : this.altR;
        if ((this.ctrlL || this.ctrlR) && !this.ctrlAlt) {
            this.lang = (this.lang === 'firstLang') ? 'secondLang' : 'firstLang';
            sessionStorage.setItem('lang', this.lang);
            this.ctrlAlt = true;
            this.redrawLetters();
        }
    }

    buttonAltUp(direction) {
        this.altL = (direction === 'left') ? false : this.altL;
        this.altR = (direction === 'right') ? false : this.altR;
        if (!this.altL && !this.altR) {
            this.ctrlAlt = false;
        }
    }

    buttonCapsDown() {
        if (!this.buttons.capsLock.down) {
            document.getElementById('capsLock').classList.add('press');
        }
        this.caps = !this.caps;
        this.redrawLetters();
    }

    buttonCapsUp() {
        if (!this.buttons.capsLock.down) {
            document.getElementById('capsLock').classList.remove('press');
        }
    }

    buttonArrowLeft() {
        if (this.shiftL || this.shiftR) {
            if (this.select < this.input.selectionEnd) {
                if (this.input.selectionEnd > 0) {
                    this.input.selectionEnd -= 1;
                }
            } else if (this.input.selectionStart > 0) {
                this.input.selectionStart -= 1;
            }
        } else if (this.input.selectionEnd === this.input.selectionStart) {
            if (this.input.selectionStart > 0) {
                this.input.selectionStart -= 1;
                this.input.selectionEnd -= 1;
            }
        } else {
            this.input.selectionEnd = this.input.selectionStart;
        }
    }

    buttonArrowRight() {
        if (this.shiftL || this.shiftR) {
            if (this.select > this.input.selectionStart) {
                this.input.selectionStart += 1;
            } else {
                this.input.selectionEnd += 1;
            }
        } else if (this.input.selectionEnd === this.input.selectionStart) {
            this.input.selectionEnd += 1;
            this.input.selectionStart += 1;
        } else {
            this.input.selectionStart = this.input.selectionEnd;
        }
    }

    buttonArrowDown() {
        const len = this.input.value.length;
        if (this.shiftL || this.shiftR) {
            this.input.selectionEnd = len;
        } else {
            this.input.selectionStart = len;
            this.input.selectionEnd = len;
        }
    }

    buttonArrowUp() {
        if (this.shiftL || this.shiftR) {
            this.input.selectionStart = 0;
        } else {
            this.input.selectionStart = 0;
            this.input.selectionEnd = 0;
        }
    }

    redrawLetters() {
        for (let key = 0, len = this.idBtns.length; key < len; key += 1) {
            if (!this.buttons[this.idBtns[key]].service) {
                if (this.lang === 'firstLang') {
                    this.changeLetter(key, 'firstLang');
                } else {
                    this.changeLetter(key, 'secondLang');
                }
            }
        }
    }

    changeLetter(key, lang) {
        let letter;
        if ((this.shiftL || this.shiftR) && this.caps) {
            letter = this.buttons[this.idBtns[key]][lang].signShiftCaps;
            document.getElementById(this.idBtns[key]).innerHTML = letter;
            this.buttons[this.idBtns[key]].current = letter;
        } else if (this.caps) {
            letter = this.buttons[this.idBtns[key]][lang].signCaps;
            document.getElementById(this.idBtns[key]).innerHTML = letter;
            this.buttons[this.idBtns[key]].current = letter;
        } else if (this.shiftL || this.shiftR) {
            letter = this.buttons[this.idBtns[key]][lang].signShift;
            document.getElementById(this.idBtns[key]).innerHTML = letter;
            this.buttons[this.idBtns[key]].current = letter;
        } else {
            letter = this.buttons[this.idBtns[key]][lang].signDef;
            document.getElementById(this.idBtns[key]).innerHTML = letter;
            this.buttons[this.idBtns[key]].current = letter;
        }
    }

    pushCtrlA() {
        this.input.selectionStart = 0;
        this.input.selectionEnd = this.input.value.length;
        this.input.scrollTop = this.scroll;
    }

    pushCtrlC() {
        const buf = this.input.value.slice(this.input.selectionStart, this.input.selectionEnd);
        navigator.clipboard.writeText(buf);
        this.input.scrollTop = this.scroll;
    }

    pushCtrlV() {
        navigator.clipboard.readText()
            .then((buffer) => {
                const text = this.input.value;
                const start = this.input.selectionStart;
                const end = this.input.selectionEnd;
                this.bufferSelect = end - (end - start) + buffer.length;
                this.input.value = text.slice(0, start) + buffer + text.slice(end);
            })
            .finally(() => {
                this.input.focus();
                this.input.selectionEnd = this.bufferSelect;
                this.input.selectionStart = this.input.selectionEnd;
                this.input.scrollTop = this.scroll;
            })
            .catch((err) => {
                this.error = err.message;
            });
    }

    changeText() {
        try {
            if (window.innerWidth <= 460) {
                document.getElementById('delete').innerHTML = 'D';
                document.getElementById('capsLock').innerHTML = 'Caps';
                document.getElementById('backspace').innerHTML = 'Back';
            } else {
                document.getElementById('delete').innerHTML = 'Del';
                document.getElementById('capsLock').innerHTML = 'CapsLock';
                document.getElementById('backspace').innerHTML = 'BackSpace';
            }
        } catch (error) {
            this.error = error.message;
        }
    }

    destructorEvent() {
        document.getElementById('body').removeEventListener('keydown', this.keyDown, false);
        document.getElementById('body').removeEventListener('keyup', this.keyUp, false);
        window.removeEventListener('blur', this.keyDefault, false);
        window.removeEventListener('resize', this.changeText);
    }
}
