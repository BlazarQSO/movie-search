import './style/style.scss';
import getRequest from './components/search/search';
import Slider from './components/slider/slider';

window.addEventListener('load', () => {
    document.getElementById('search').addEventListener('click', getRequest);

    const rightBtn = document.getElementById('right');
    const leftBtn = document.getElementById('left');
    const slider = new Slider('containerSlides', 265, 'slider__slides-item');
    rightBtn.onclick = slider.moveRight.bind(slider, 700, rightBtn);
    leftBtn.onclick = slider.moveLeft.bind(slider, 700, leftBtn);
});
