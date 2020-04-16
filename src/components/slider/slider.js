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
        // this.containerSlider.ondrag = null;
        // this.containerSlider.ondragdrop = null;
        // this.containerSlider.ondragstart = null;

        // this.containerSlider.addEventListener('mouseup', this.mouseUp.bind(this));
        // this.containerSlider.addEventListener('mousemove', this.mouseMove.bind(this));
        // this.containerSlider.addEventListener('mouseleave', this.mouseUp.bind(this));

        // this.containerSlider.addEventListener('touchstart', this.touchStart);
        // this.containerSlider.addEventListener('touchmove', this.touchMove);
        // this.containerSlider.addEventListener('touchend', this.touchEnd);
    }

    mouseDown(event) {
        // this.mouseEventDown = true;
        // this.startX = e.clientX;
        // this.startY = e.clientY;

        // function mouseMove(event) {
        //     const deltaX = this.startX - event.clientX;
        //     // this.startX = e.clientX;
        //     const newSlides = this.containerSlider.children;
        //     let newOffset = this.visibleSlides;
        //     for (let i = newSlides.length - 1; i >= 0; i -= 1) {
        // newSlides[i].style.transform=`translate3d(${newOffset*this.blockSize+deltaX}px,0,0)`;
        //         newOffset -= 1;
        //     }
        // }

        // const listenerMouseMove = mouseMove.bind(this);
        // function mouseUp() {
        //     this.containerSlider.removeEventListener('mousemove', listenerMouseMove);
        // }

        // this.containerSlider.addEventListener('mouseup', mouseUp.bind(this));
        // this.containerSlider.addEventListener('mousemove', listenerMouseMove);
        // //  this.containerSlider.addEventListener('mouseleave', this.mouseUp);
        event.preventDefault();
        const startX = event.clientX || event.changedTouches[0].pageX;
        // const startY = e.clientY;
        // const elemX = this.containerSlider.offsetLeft;
        // // const elemY = this.containerSlider.offsetTop;
        // const deltaX = startX - elemX;
        // const deltaY = startY - elemY;
        let deltaX = 0;
        function moveHandler(e) {
            deltaX = e.clientX - startX || e.changedTouches[0].pageX - startX;
            // startX = event.clientX;
            // startX = event.clientX;
            // const moveY = event.clientY - deltaY;
            let newOffset = this.visibleSlides;
            for (let i = this.containerSlider.children.length - 1; i >= 0; i -= 1) {
                // const style = window.getComputedStyle(this.containerSlider.children[i], null);
                // let transform = style.getPropertyValue('transform');
                // transform = transform.replace('matrix(1, 0, 0, 1, ', '');
                // transform = +transform.replace(', 0)', '');
                // this.containerSlider.children[i].style.transform = `translate3d(${transform + moveX}px, 0, 0)`;
                this.containerSlider.children[i].style.transform = `translate3d(${newOffset * this.blockSize + deltaX}px,0,0)`;
                newOffset -= 1;
            }
            // if (Math.abs(deltaX) >= this.blockSize) {
            //     const count = Math.abs(deltaX) / this.blockSize;
            //     deltaX -= count * this.blockSize;
            //     startX -= count * this.blockSize;
            //     // if (deltaX > 0) {
            //     //     this.draw(-1);
            //     // } else {
            //     //     this.draw();
            //     // }
            // }
        }

        function upHandler(e) {
            this.containerSlider.onmousemove = null;
            this.containerSlider.onmouseup = null;
            this.containerSlider.ontouchend = null;
            const deltaStartToEnd = e.clientX - startX || e.changedTouches[0].pageX - startX;
            if (Math.abs(deltaStartToEnd) > 20) {
                if (deltaStartToEnd > 0) {
                    this.moveLeft();
                    let offset = deltaStartToEnd / this.blockSize;
                    if (offset > 1) {
                        const interval = setInterval(() => {
                            offset -= 1;
                            if (offset <= 1) clearInterval(interval);
                            this.moveLeft();
                        }, 200);
                    }
                } else {
                    this.moveRight();
                    let offset = deltaStartToEnd / this.blockSize;
                    if (offset < -1) {
                        const intervalLeft = setInterval(() => {
                            offset += 1;
                            if (offset >= -1) clearInterval(intervalLeft);
                            this.moveRight();
                        }, 200);
                    }
                }
            }
        }

        // this.containerSlider.onmousemove = moveHandler.bind(this);
        this.containerSlider.onmouseup = upHandler.bind(this);
        this.containerSlider.ontouchend = upHandler.bind(this);
    }
}
