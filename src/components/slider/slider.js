export default class Slider {
    constructor(containerSlider, blockSize, styleClass, leftBtn, rightBtn, visibleSlides = 4) {
        this.slider = [];
        this.visibleSlides = visibleSlides;
        this.containerSlider = document.getElementById(containerSlider);
        const slides = this.containerSlider.children;
        Array.from(slides).forEach((item, index) => {
            this.slider[index] = item.innerHTML;
            item.remove();
        });
        this.length = this.slider.length;
        this.currentImg = this.length * 9999;
        this.blockSize = blockSize;
        this.styleClass = styleClass;
        this.leftBtn = leftBtn;
        this.rightBtn = rightBtn;
        this.swiperEvents();
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
        this.containerSlider.append(fragmentItems);
    }

    moveRight(e, id = false) {
        const newSlides = this.containerSlider.children;
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
        const newSlides = this.containerSlider.children;
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
            this.containerSlider.append(item);
        } else {
            this.currentImg -= 1;
            const id = (this.currentImg - 1) % this.length;
            item.innerHTML = this.slider[id];
            item.style.transform = `translate3d(${direction * this.blockSize}px, 0, 0)`;
            this.containerSlider.prepend(item);
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

    swiperEvents() {
        this.containerSlider.addEventListener('mousedown', this.mouseDown.bind(this));
        this.containerSlider.addEventListener('touchstart', this.mouseDown.bind(this));
    }

    mouseDown(event) {
        event.preventDefault();
        this.startX = event.clientX || event.changedTouches[0].pageX;
        this.containerSlider.classList.add('cancel-transform');
        this.deltaX = 0;

        this.containerSlider.onmousemove = this.moveHandler.bind(this);
        this.containerSlider.ontouchmove = this.moveHandler.bind(this);
        this.containerSlider.onmouseup = this.upHandler.bind(this);
        this.containerSlider.onmouseleave = this.upHandler.bind(this);
        this.containerSlider.ontouchend = this.upHandler.bind(this);
    }

    upHandler() {
        this.containerSlider.onmousemove = null;
        this.containerSlider.onmouseup = null;
        this.containerSlider.ontouchend = null;
        this.containerSlider.onmouseleave = null;
        this.containerSlider.ontouchmove = null;

        this.containerSlider.classList.remove('cancel-transform');
        const NO_SWIPE = 40;
        if (Math.abs(this.deltaX) > NO_SWIPE) {
            if (this.deltaX < 0) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        } else {
            let newOffset = this.visibleSlides;
            for (let i = this.containerSlider.children.length - 1; i >= 0; i -= 1) {
                this.containerSlider.children[i].style.transform = `translate3d(${newOffset * this.blockSize}px,0,0)`;
                newOffset -= 1;
            }
        }
    }

    moveHandler(e) {
        const clientX = e.clientX || e.changedTouches[0].pageX;
        this.deltaX = clientX - this.startX;
        let newOffset = this.visibleSlides;
        for (let i = this.containerSlider.children.length - 1; i >= 0; i -= 1) {
            const position = newOffset * this.blockSize + this.deltaX;
            this.containerSlider.children[i].style.transform = `translate3d(${position}px,0,0)`;
            newOffset -= 1;
        }

        if (Math.abs(this.deltaX) >= this.blockSize) {
            if (this.deltaX < 0) {
                this.startX = clientX;
                this.draw();
                this.containerSlider.children[0].remove();
            } else {
                this.startX = clientX;
                this.draw(-1);
                const len = this.containerSlider.children.length;
                this.containerSlider.children[len - 1].remove();
            }
        }
    }
}
