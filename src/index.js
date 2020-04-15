import './style/style.scss';
import getRequest from './components/search/search';
import Slider from './components/slider/slider';

function buttonClick(e, slider) {
    if (e.target.tagName === 'BUTTON') {
        if (!e.target.classList.contains('buttons__item-check')) {
            slider.buttonClick(+e.target.id.replace('button', ''));
        }
    }
}

window.addEventListener('load', () => {
    document.getElementById('search').addEventListener('click', getRequest);

    const rightBtn = document.getElementById('right');
    const leftBtn = document.getElementById('left');
    const slider = new Slider('containerSlides', 265, 'slider__slides-item', leftBtn, rightBtn);
    rightBtn.onclick = slider.moveRight.bind(slider);
    leftBtn.onclick = slider.moveLeft.bind(slider);

    document.getElementById('buttons').addEventListener('click', (e) => buttonClick(e, slider));
});
