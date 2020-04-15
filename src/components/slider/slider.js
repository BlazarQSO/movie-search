export default class Slider {
    constructor(idSlider, blockSize, styleClass, leftBtn, rightBtn, visibleSlides = 4) {
        this.slider = [];
        this.visibleSlides = visibleSlides;
        const slides = document.getElementById(idSlider).children;
        Array.from(slides).forEach((item, index) => {
            this.slider[index] = item.innerHTML;
            item.remove();
        });
        this.length = this.slider.length;
        this.currentImg = this.length * 9999;
        this.idSlider = idSlider;
        this.blockSize = blockSize;
        this.styleClass = styleClass;
        this.leftBtn = leftBtn;
        this.rightBtn = rightBtn;
        this.initDraw();
    }

    initDraw() {
        let offset = -1;
        const fragmentItems = new DocumentFragment();
        const WITH_INVISIBLE_LEFT_RIGHT_SLIDE = 1 + this.visibleSlides + 1;
        for (let i = 0; i < WITH_INVISIBLE_LEFT_RIGHT_SLIDE; i += 1) {
            const item = document.createElement('div');
            if (offset < 0) {
                item.innerHTML = this.slider[this.length - 1];
            } else {
                item.innerHTML = this.slider[offset];
            }
            item.classList.add(this.styleClass);
            item.style.transform = `translate3d(${offset * this.blockSize}px, 0, 0)`;
            offset += 1;
            fragmentItems.append(item);
        }
        document.getElementById(this.idSlider).append(fragmentItems);
    }

    moveRight(e, id = false) {
        const newSlides = document.getElementById(this.idSlider).children;
        let newOffset = -1;
        Array.from(newSlides).forEach((item) => {
            item.style.transform = `translate3d(${newOffset * this.blockSize - this.blockSize}px, 0, 0)`;
            newOffset += 1;
        });
        this.draw();
        newSlides[0].remove();
        if (id === false) this.setBtnBackground();
    }

    moveLeft(e, id = false) {
        const newSlides = document.getElementById(this.idSlider).children;
        let newOffset = this.visibleSlides;
        for (let i = newSlides.length - 1; i >= 0; i -= 1) {
            newSlides[i].style.transform = `translate3d(${newOffset * this.blockSize + this.blockSize}px, 0, 0)`;
            newOffset -= 1;
        }
        this.draw(-1);
        newSlides[newSlides.length - 1].remove();
        if (id === false) this.setBtnBackground();
    }

    draw(direction = 1) {
        const item = document.createElement('div');
        item.classList.add(this.styleClass);
        if (direction === 1) {
            this.currentImg += 1;
            const id = (this.currentImg + this.visibleSlides) % this.length;
            item.innerHTML = this.slider[id];
            item.style.transform = `translate3d(${direction * this.blockSize * this.visibleSlides}px, 0, 0)`;
            document.getElementById(this.idSlider).append(item);
        } else {
            this.currentImg -= 1;
            const id = (this.currentImg - 1) % this.length;
            item.innerHTML = this.slider[id];
            item.style.transform = `translate3d(${direction * this.blockSize}px, 0, 0)`;
            document.getElementById(this.idSlider).prepend(item);
        }
        if (this.currentImg === 0) {
            this.currentImg = this.length * 9999;
        }
    }

    buttonClick(id) {
        let offSet = (this.currentImg % this.length) - id;
        if (offSet < 0) {
            const interval = setInterval(() => {
                this.moveRight(id);
                offSet += 1;
                if (offSet >= 0) clearInterval(interval);
            }, 200);
        } else {
            const intervalLeft = setInterval(() => {
                this.moveLeft(id);
                offSet -= 1;
                if (offSet <= 0) clearInterval(intervalLeft);
            }, 200);
        }
    }

    setBtnBackground() {
        Array.from(document.getElementById('buttons').children).forEach((item) => {
            item.classList.remove('buttons__item-check');
        });
        const btnId = this.currentImg % this.length;
        document.getElementById(`button${btnId}`).classList.add('buttons__item-check');
    }
}
