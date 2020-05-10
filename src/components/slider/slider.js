export default class Slider {
    constructor(containerSlider, blockSize, styleClass, leftBtn, rightBtn, visibleSlides = 4) {
        this.slider = [];
        this.visibleMaxSlides = visibleSlides;
        this.visibleSlides = visibleSlides;
        this.blockSize = blockSize;
        this.styleClass = styleClass;
        this.interval = false;
        this.changeSlide = true;
        this.countShowSlides = this.countSlides();
        this.leftBtn = document.getElementById(leftBtn);
        this.rightBtn = document.getElementById(rightBtn);
        this.bindMethods();
        this.initValues(containerSlider);
    }

    bindMethods() {
        this.mouseDown = this.mouseDown.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.buttonEvent = this.buttonEvent.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.moveHandler = this.moveHandler.bind(this);
        this.checkSizeSlider = this.checkSizeSlider.bind(this);
        this.upHandler = this.upHandler.bind(this);
    }

    initValues(containerSlider) {
        this.containerSlider = document.getElementById(containerSlider);
        const slides = this.containerSlider.children;
        Array.from(slides).forEach((item, index) => {
            this.slider[index] = item.innerHTML;
            item.remove();
        });
        this.length = this.slider.length;
        this.POSITIVE_VALUE_OF_SLIDER = 9999;
        this.currentImg = this.length * this.POSITIVE_VALUE_OF_SLIDER;

        if (this.visibleSlides < this.countShowSlides) {
            this.countShowSlides = this.visibleSlides;
        }

        if (this.visibleSlides >= this.length) {
            this.visibleSlides = this.length - 1;
        }
    }

    countSlides() {
        const size = window.innerWidth;
        let countSlides = this.visibleMaxSlides;
        const WIDTH_FOR_FOUR_SLIDES = 1400;
        const WIDTH_FOR_THREE_SLIDES = 1110;
        const WIDTH_FOR_TWO_SLIDES = 820;
        if (size > WIDTH_FOR_THREE_SLIDES && size <= WIDTH_FOR_FOUR_SLIDES) countSlides = 3;
        if (size > WIDTH_FOR_TWO_SLIDES && size <= WIDTH_FOR_THREE_SLIDES) countSlides = 2;
        if (size <= WIDTH_FOR_TWO_SLIDES) countSlides = 1;
        return countSlides;
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
        this.startEvents();
        this.checkSizeSlider();
    }

    checkSizeSlider() {
        const size = this.countSlides();
        if (size >= this.length) {
            if (this.changeSlide) {
                this.changeSlide = false;
                if (this.length <= size) this.containerSlider.children[0].classList.add('hide');
                Array.from(this.containerSlider.children)
                    .forEach((item) => item.classList.add('lock-transition'));
                this.containerSlider.classList.add('few-slides');
                this.leftBtn.classList.add('lock-slider');
                this.rightBtn.classList.add('lock-slider');
                this.rightBtn.removeEventListener('click', this.moveRight);
                this.leftBtn.removeEventListener('click', this.moveLeft);
                document.getElementById('buttons').removeEventListener('click', this.buttonEvent);
                document.getElementById('buttons').classList.add('lock-slider');
                this.containerSlider.removeEventListener('mousedown', this.mouseDown);
                this.containerSlider.removeEventListener('touchstart', this.touchStart, {
                    passive: false, capture: true,
                });
            }
        } else if (this.containerSlider.classList.contains('few-slides')) {
            if (!this.changeSlide) {
                this.changeSlide = true;
                this.containerSlider.classList.remove('few-slides');
                setTimeout(() => Array.from(this.containerSlider.children)
                    .forEach((item) => item.classList.remove('lock-transition')), 0);
                this.leftBtn.classList.remove('lock-slider');
                this.rightBtn.classList.remove('lock-slider');
                this.rightBtn.addEventListener('click', this.moveRight);
                this.leftBtn.addEventListener('click', this.moveLeft);
                if (this.length > size) this.containerSlider.children[0].classList.remove('hide');
                document.getElementById('buttons').addEventListener('click', this.buttonEvent);
                document.getElementById('buttons').classList.remove('lock-slider');
                this.containerSlider.addEventListener('mousedown', this.mouseDown);
                this.containerSlider.addEventListener('touchstart', this.touchStart, {
                    passive: false, capture: true,
                });
            }
        }
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
        if (id === false) this.setBtnBackground(false);
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
        if (id === false) this.setBtnBackground(true);
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
            this.currentImg = this.length * this.POSITIVE_VALUE_OF_SLIDER;
        }
    }

    buttonClick(id) {
        const buttons = document.getElementById('buttons').children;
        const indexClick = Array.from(buttons).findIndex((item) => item.id === id);
        const indexCheck = Array.from(buttons)
            .findIndex((item) => item.classList.contains('buttons__item-check'));
        let offSet = indexCheck - indexClick;
        if (offSet < 0) {
            clearInterval(this.interval);
            this.moveRight(id);
            offSet += 1;
            if (offSet <= -1) {
                this.interval = setInterval(() => {
                    if (offSet >= -1) clearInterval(this.interval);
                    offSet += 1;
                    this.moveRight(id);
                }, 240);
            }
        } else {
            this.moveLeft(id);
            clearInterval(this.interval);
            offSet -= 1;
            if (offSet >= 1) {
                this.interval = setInterval(() => {
                    if (offSet <= 1) clearInterval(this.interval);
                    offSet -= 1;
                    this.moveLeft(id);
                }, 240);
            }
        }
    }

    setBtnBackground(left) {
        const buttons = document.getElementById('buttons').children;
        Array.from(buttons).forEach((item) => {
            item.classList.remove('buttons__item-check');
        });
        const buttonsId = Array.from(buttons).map((item) => +item.id.replace('button', ''));
        const slideId = this.currentImg % this.length;
        if (left && !buttonsId.includes(slideId)) {
            for (let i = 1; i < buttons.length; i += 1) {
                if (slideId + i < this.length) {
                    buttons[i].id = `button${slideId + i}`;
                } else {
                    buttons[i].id = `button${slideId + i - this.length}`;
                }
            }
            buttons[0].id = `button${slideId}`;
        } else if (!left && !buttonsId.includes(slideId)) {
            for (let i = 1; i < buttons.length; i += 1) {
                if (slideId - i >= 0) {
                    buttons[buttons.length - 1 - i].id = `button${slideId - i}`;
                } else {
                    buttons[buttons.length - 1 - i].id = `button${this.length + (slideId - i)}`;
                }
            }
            buttons[buttons.length - 1].id = `button${slideId}`;
        }
        document.getElementById(`button${slideId}`).classList.add('buttons__item-check');
    }

    stopEvents() {
        this.stateEvent = false;
        this.containerSlider.removeEventListener('mousedown', this.mouseDown);
        this.containerSlider
            .removeEventListener('touchstart', this.touchStart, { passive: false, capture: true });
        document.getElementById('buttons').removeEventListener('click', this.buttonEvent);
        this.rightBtn.removeEventListener('click', this.moveRight);
        this.leftBtn.removeEventListener('click', this.moveLeft);
        window.removeEventListener('resize', this.checkSizeSlider);

        this.containerSlider.classList.remove('few-slides');
        this.leftBtn.classList.remove('lock-slider');
        this.rightBtn.classList.remove('lock-slider');
        document.getElementById('buttons').classList.remove('lock-slider');

        this.containerSlider.removeEventListener('mousemove', this.moveHandler);
        this.containerSlider.removeEventListener('mouseup', this.upHandler);
        this.containerSlider.removeEventListener('touchend', this.upHandler);
        this.containerSlider.removeEventListener('mouseleave', this.upHandler);
        this.containerSlider
            .removeEventListener('touchmove', this.moveHandler, { passive: false, capture: true });
    }

    startEvents() {
        this.stateEvent = true;
        this.containerSlider.addEventListener('mousedown', this.mouseDown);
        this.containerSlider
            .addEventListener('touchstart', this.touchStart, { passive: false, capture: true });
        document.getElementById('buttons').addEventListener('click', this.buttonEvent);
        this.rightBtn.addEventListener('click', this.moveRight);
        this.leftBtn.addEventListener('click', this.moveLeft);
        window.addEventListener('resize', this.checkSizeSlider);
    }

    changeStateButtons() {
        this.leftBtn.classList.toggle('suspend');
        this.rightBtn.classList.toggle('suspend');
        document.getElementById('buttons').classList.toggle('suspend');
    }

    buttonEvent(e) {
        if (e.target.tagName === 'BUTTON') {
            if (!e.target.classList.contains('buttons__item-check')) {
                this.buttonClick(e.target.id);
            }
        }
    }

    touchStart(event) {
        event.preventDefault();
        this.stateTouchStart = true;
        this.startX = event.changedTouches[0].pageX;
        this.staticStart = this.startX;
        this.containerSlider.classList.add('cancel-transform');
        this.deltaX = 0;
        this.containerSlider
            .addEventListener('touchmove', this.moveHandler, { passive: false, capture: true });
        this.containerSlider.addEventListener('touchend', this.upHandler);
    }

    mouseDown(event) {
        event.preventDefault();
        this.startX = event.clientX;
        this.staticStart = this.startX;
        this.containerSlider.classList.add('cancel-transform');
        this.deltaX = 0;

        this.containerSlider.addEventListener('touchend', this.upHandler);
        this.containerSlider.addEventListener('mousemove', this.moveHandler);
        this.containerSlider.addEventListener('mouseup', this.upHandler);
        this.containerSlider.addEventListener('mouseleave', this.upHandler);
    }

    upHandler(e) {
        this.stateTouchStart = false;
        this.containerSlider.removeEventListener('mousemove', this.moveHandler);
        this.containerSlider.removeEventListener('mouseup', this.upHandler);
        this.containerSlider.removeEventListener('touchend', this.upHandler);
        this.containerSlider.removeEventListener('mouseleave', this.upHandler);
        this.containerSlider
            .removeEventListener('touchmove', this.moveHandler, { passive: false, capture: true });

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
            const clientX = e.clientX || e.changedTouches[0].pageX;
            const direction = clientX - this.staticStart > 0;
            this.setBtnBackground(direction);
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

        this.checkLeaveElement(e);
    }

    checkLeaveElement(e) {
        if (e.touches) {
            const touch = e.touches[0];
            let element = document.elementFromPoint(touch.pageX, touch.pageY);
            while (element !== this.containerSlider && element !== document.body) {
                element = element.parentElement;
            }
            if (element !== this.containerSlider) this.upHandler(e);
        }
    }
}
