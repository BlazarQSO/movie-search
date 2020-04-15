import './style/style.scss';
import './components/keyboard/keyboard.scss';
import getRequest from './components/search/search';
import Slider from './components/slider/slider';
import buttons from './components/keyboard/buttons';
import Keyboard from './components/keyboard/keyboard';

function buttonClick(e, slider) {
    if (e.target.tagName === 'BUTTON') {
        if (!e.target.classList.contains('buttons__item-check')) {
            slider.buttonClick(+e.target.id.replace('button', ''));
        }
    }
}

function createInput(text) {
    const input = document.createElement('input');
    input.id = 'input';
    input.className = 'search__wrap-input';
    input.type = 'text';
    input.placeholder = 'Search movie';
    input.value = text;
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

window.addEventListener('load', () => {
    document.getElementById('search').addEventListener('click', getRequest);
    document.getElementById('key').addEventListener('click', showKeyboard);

    const rightBtn = document.getElementById('right');
    const leftBtn = document.getElementById('left');
    const slider = new Slider('containerSlides', 265, 'slider__slides-item', leftBtn, rightBtn);
    rightBtn.onclick = slider.moveRight.bind(slider);
    leftBtn.onclick = slider.moveLeft.bind(slider);

    document.getElementById('buttons').addEventListener('click', (e) => buttonClick(e, slider));
    document.getElementById('input').focus();
});
