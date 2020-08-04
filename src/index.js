import '@/styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
    class SliderCarousel {
        constructor({ main, wrapper, prev, next }) {
            this.main = document.querySelector(main);
            this.wrapper = document.querySelector(wrapper);
            this.sliders = this.wrapper.children;
            this.prev = document.querySelector(prev);
            this.next = document.querySelector(next);
            this.sliderToShow = this.main.offsetWidth / this.sliders[0].offsetWidth;
            this.options = {
                position: 0,
                slideWidth: this.main.offsetWidth / this.sliderToShow,
            };

            this.transformMtrx = 0; // transform translateX
            this.distance = 0; // расстояние движения

            this.initPos = 0; // начальное нажатие
            this.currentPos = 0; // текущ позиция
            this.diffPos = 0; // разница в движении

            this.init();
        }
        init() {
            this.control();
        }
        control() {
            this.prev.addEventListener('click', this.prevSlider.bind(this));
            this.next.addEventListener('click', this.nextSlider.bind(this));

            this.mousedownHandler = this.movingStart.bind(this);
            this.mousemoveHandler = this.moving.bind(this);
            this.mouseupHandler = this.movingEnd.bind(this);
            this.mouseleaveHandler = this.leaveSurface.bind(this);

            if (window.PointerEvent) {
                this.main.addEventListener('pointerdown', this.mousedownHandler);
            } else {
                this.main.addEventListener('mousedown', this.mousedownHandler);
                this.main.addEventListener('touchstart', this.mousedownHandler);
            }
        }

        movingStart(e) {
            this.initPos = e.pageX;

            const style = window.getComputedStyle(this.wrapper);
            this.transformMtrx = new WebKitCSSMatrix(style.webkitTransform).m41;

            if (window.PointerEvent) {
                this.main.addEventListener('pointermove', this.mousemoveHandler);
                this.main.addEventListener('pointerup', this.mouseupHandler);
                this.main.addEventListener('pointerleave', this.mouseleaveHandler);
            } else {
                this.main.addEventListener('mousemove', this.mousemoveHandler);
                this.main.addEventListener('mouseup', this.mouseupHandler);
                this.main.addEventListener('touchmove', this.mousemoveHandler);
                this.main.addEventListener('touchend', this.mouseupHandler);
                this.main.addEventListener('mouseleave', this.mouseleaveHandler);
            }
        }

        moving(e) {
            e.preventDefault();
            this.currentPos = e.pageX;
            this.diffPos = this.currentPos - this.initPos;
            this.wrapper.style.transform = `translateX(${this.transformMtrx + this.diffPos}px)`;
        }
        movingEnd(e) {
            this.swipeControl();

            if (window.PointerEvent) {
                this.main.removeEventListener('pointermove', this.mousemoveHandler);
                this.main.removeEventListener('pointerup', this.mouseupHandler);
                this.main.removeEventListener('pointerleave', this.mouseleaveHandler);
            } else {
                this.main.removeEventListener('mousemove', this.mousemoveHandler);
                this.main.removeEventListener('mouseup', this.mouseupHandler);
                this.main.removeEventListener('mouseleave', this.mouseleaveHandler);
                this.main.removeEventListener('touchmove', this.mousemoveHandler);
                this.main.removeEventListener('touchend', this.mouseupHandler);
            }
            console.log('end');
        }

        leaveSurface() {
            this.swipeControl();
            if (window.PointerEvent) {
                this.main.removeEventListener('pointermove', this.mousemoveHandler);
                this.main.removeEventListener('pointerup', this.mouseupHandler);
                this.main.removeEventListener('pointerleave', this.mouseleaveHandler);
            } else {
                this.main.removeEventListener('mousemove', this.mousemoveHandler);
                this.main.removeEventListener('mouseup', this.mouseupHandler);
                this.main.removeEventListener('mouseleave', this.mouseleaveHandler);
                this.main.removeEventListener('touchmove', this.mousemoveHandler);
                this.main.removeEventListener('touchend', this.mouseupHandler);
            }
        }

        prevSlider() {
            if (this.options.position > 0) {
                this.options.position--;
                this.wrapper.style.transform = `translateX(-${this.options.position * this.options.slideWidth}px)`;
            } else {
                this.wrapper.style.transform = `translateX(${60}px)`;
                setTimeout(() => {
                    this.wrapper.style.transform = `translateX(-${this.options.position * this.options.slideWidth}px)`;
                }, 250);
            }
        }

        nextSlider() {
            if (this.options.position < this.sliders.length - this.sliderToShow) {
                this.options.position++;
                this.wrapper.style.transform = `translateX(-${this.options.position * this.options.slideWidth}px)`;
            } else {
                this.wrapper.style.transform = `translateX(-${this.options.position * this.options.slideWidth + 60}px)`;
                setTimeout(() => {
                    this.wrapper.style.transform = `translateX(-${this.options.position * this.options.slideWidth}px)`;
                }, 250);
            }
        }

        swipeControl() {
            if (this.currentPos > this.initPos) {
                if (this.options.position > 0) {
                    this.options.position -= Math.abs(Math.round(this.diffPos / this.options.slideWidth));
                    this.distance = Math.round(this.diffPos / this.options.slideWidth) * this.options.slideWidth;
                    this.wrapper.style.transform = `translateX(${this.transformMtrx + this.distance}px)`;
                } else {
                    this.wrapper.style.transform = `translateX(${0}px)`;
                }
            } else {
                if (this.currentPos < this.initPos) {
                    if (this.options.position < this.sliders.length - this.sliderToShow) {
                        this.options.position += Math.abs(Math.round(this.diffPos / this.options.slideWidth));
                        this.distance = Math.round(this.diffPos / this.options.slideWidth) * this.options.slideWidth;
                        this.wrapper.style.transform = `translateX(${this.transformMtrx + this.distance}px)`;
                    } else {
                        this.wrapper.style.transform = `translateX(-${this.options.slideWidth * (this.sliders.length - this.sliderToShow)}px)`;
                    }
                }
            }
        }
    }

    const carousel = new SliderCarousel({
        main: '.grid',
        wrapper: '.grid-row',
        prev: '.left',
        next: '.right',
    });
});
