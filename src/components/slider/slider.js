export default class Slider {
    constructor(idSlider, blockSize, styleClass, visibleSlides = 4) {
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
        this.initDraw();
    }

    initDraw() {
        let offset = -1;
        const fragmentItems = new DocumentFragment();
        const LENGTH_WITH_LEFT_RIGHT_SLIDE = 1 + this.visibleSlides + 1;
        for (let i = 0; i < LENGTH_WITH_LEFT_RIGHT_SLIDE; i += 1) {
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

    moveRight(timeSlide, rightBtn) {
        rightBtn.onclick = null;
        const newSlides = document.getElementById(this.idSlider).children;
        let newOffset = -1;
        Array.from(newSlides).forEach((item) => {
            item.style.transform = `translate3d(${newOffset * this.blockSize - this.blockSize}px, 0, 0)`;
            newOffset += 1;
        });
        this.draw();
        newSlides[0].remove();
        setTimeout(() => {
            rightBtn.onclick = this.moveRight.bind(this, timeSlide, rightBtn);
        }, timeSlide);
    }

    moveLeft(timeSlide, leftBtn) {
        leftBtn.onclick = null;
        const newSlides = document.getElementById(this.idSlider).children;
        let newOffset = this.visibleSlides;
        for (let i = newSlides.length - 1; i >= 0; i -= 1) {
            newSlides[i].style.transform = `translate3d(${newOffset * this.blockSize + this.blockSize}px, 0, 0)`;
            newOffset -= 1;
        }
        this.draw(-1);
        newSlides[newSlides.length - 1].remove();
        setTimeout(() => {
            leftBtn.onclick = this.moveLeft.bind(this, timeSlide, leftBtn);
        }, timeSlide);
    }

    draw(direction = 1) {
        const item = document.createElement('div');
        item.classList.add(this.styleClass);
        if (direction === 1) {
            this.currentImg += 1;
            const id = Math.abs(this.currentImg + this.visibleSlides) % this.length;
            item.innerHTML = this.slider[id];
            item.style.transform = `translate3d(${direction * this.blockSize * this.visibleSlides}px, 0, 0)`;
            document.getElementById(this.idSlider).append(item);
        } else {
            this.currentImg -= 1;
            const id = Math.abs(this.currentImg - 1) % this.length;
            item.innerHTML = this.slider[id];
            item.style.transform = `translate3d(${direction * this.blockSize}px, 0, 0)`;
            document.getElementById(this.idSlider).prepend(item);
        }
        if (this.currentImg === 0) {
            this.currentImg = this.length * 9999;
        }
    }
}
