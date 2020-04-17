import './style/style.scss';
import './components/keyboard/keyboard.scss';
import getRequest from './components/search/search';
import buttons from './components/keyboard/buttons';
import Keyboard from './components/keyboard/keyboard';

function createInput(text) {
    const input = document.createElement('input');
    input.id = 'input';
    input.className = 'search__wrap-input';
    input.type = 'text';
    input.placeholder = 'Search movie';
    input.value = text;
    input.setAttribute('autocomplete', 'off');
    document.getElementById('searchWrap').prepend(input);
    input.focus();
}

let keyboard;
function showKeyboard() {
    const key = document.getElementById('key');
    if (!key.classList.contains('click')) {
        const input = document.getElementById('input');
        input.classList.add('focus');
        keyboard = new Keyboard(buttons, input);
        keyboard.create('wrapKeyboard');
        key.classList.add('click');
    } else {
        const text = document.getElementById('input').value;
        document.getElementById('input').remove();
        key.classList.remove('click');
        createInput(text);
        keyboard.destructorEvent();
        keyboard = null;
        document.getElementById('wrapKeyboard').innerHTML = '';
    }
}

function getRequestEnter(e) {
    if (e.code === 'Enter') {
        getRequest();
    }
}

window.addEventListener('load', () => {
    getRequest('terminator');
    document.getElementById('search').addEventListener('click', getRequest);
    document.body.addEventListener('keydown', getRequestEnter);
    document.getElementById('key').addEventListener('click', showKeyboard);
    document.getElementById('input').focus();
});
