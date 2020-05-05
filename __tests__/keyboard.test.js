import { JSDOM } from "jsdom";
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

import Keyboard from '../src/components/keyboard/keyboard.js';
import buttons from '../src/components/keyboard/buttons.js';

window.document.body.id = 'body';
window.document.body.innerHTML = `<input type="text" id="input"/><div id="wrapKeyboard"></div>`;
const input = document.getElementById('input');
const keyboard = new Keyboard(buttons, input);
keyboard.create('wrapKeyboard');

describe('checking function writeLetter', () => {
    it('write the A character in the input A => A', () => {
        keyboard.writeLetter('A')
        expect(input.value).toEqual('A');
    });
    it('write the B character in the input B => AB', () => {
        keyboard.writeLetter('B')
        expect(input.value).toEqual('AB');
    });
    it('write the C character between A and B in the input AB => ACB', () => {
        keyboard.buttonArrowLeft();
        keyboard.writeLetter('C');
        expect(input.value).toEqual('ACB');
    });
});

describe('checking function buttonArrowLeft', () => {
    it('move the cursor to the left from position 2 to position 1 AC|B => A|CB', () => {
        keyboard.buttonArrowLeft();
        expect(input.selectionStart).toEqual(1);
    });
});

describe('checking function buttonArrowDown', () => {
    it('move the cursor to end A|CB => ACB|', () => {
        keyboard.buttonArrowDown();
        expect(input.selectionStart).toEqual(3);
    });
});

describe('checking function buttonArrowUp', () => {
    it('move the cursor to start ACB| => |ACB', () => {
        keyboard.buttonArrowUp();
        expect(input.selectionStart).toEqual(0);
    });
});

describe('checking function buttonDelete', () => {
    it('delete the first character ACB => CB', () => {
        keyboard.buttonDelete();
        expect(input.value).toEqual('CB');
    });
});

describe('checking function buttonBackspace', () => {
    it('delete the first character CB => C', () => {
        keyboard.buttonArrowDown();
        keyboard.buttonBackspace();
        expect(input.value).toEqual('C');
    });
});

describe('checking function buttonCapsDown', () => {
    it('turn on CapsLock a => A', () => {
        keyboard.buttonCapsDown();
        expect(document.getElementById('keyA').textContent).toEqual('A');
    });
});

describe('checking for language changes (function buttonAltDown buttonCtrlDown)', () => {
    it('change language (buttonCtrlDown) O => Щ', () => {
        keyboard.altL = true;
        keyboard.buttonCtrlDown();
        expect(document.getElementById('keyO').textContent).toEqual('Щ');
    });
    it('change language (buttonAltDown) Z => Я', () => {
        keyboard.altL = false;
        keyboard.ctrlL = true;
        keyboard.buttonAltDown();
        expect(document.getElementById('keyZ').textContent).toEqual('Я');
    });
});
