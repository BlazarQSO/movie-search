import './style/style.scss';
import getRequest from './components/search/search';
import Speech from './components/search/speech';
import buttons from './components/keyboard/buttons';
import Keyboard from './components/keyboard/keyboard';

function clearInput(reset, input) {
    input.value = '';
    reset.classList.add('rotate');
    input.focus();
    setTimeout(() => reset.classList.remove('rotate'), 1100);
}

function createInput(text) {
    const input = document.createElement('input');
    input.id = 'input';
    input.className = 'search__wrap-input';
    input.type = 'text';
    input.placeholder = 'Search movie';
    input.value = text;
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('maxlength', 80);
    document.getElementById('searchWrap').prepend(input);
    input.focus();
    const reset = document.getElementById('reset');
    reset.addEventListener('click', clearInput.bind(null, reset, input));
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
    document.getElementById('search').onclick = getRequest;
    document.body.addEventListener('keydown', getRequestEnter);
    document.getElementById('key').addEventListener('click', showKeyboard);

    const input = document.getElementById('input');
    const reset = document.getElementById('reset');
    const buttonSpeech = document.getElementById('speech');
    const speech = new Speech(input, buttonSpeech);
    document.getElementById('speech').addEventListener('click', speech.eventButtonSpeech.bind(speech));
    reset.addEventListener('click', clearInput.bind(null, reset, input));
    input.focus();
});
