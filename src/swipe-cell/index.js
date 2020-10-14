/* eslint-disable */
import './style.scss';
import ScrollView from "../scroll-view/core";
import utils from '../utils';

function sum(arr) {
    return arr.reduce((prev, current) => prev + current, 0)
}

function SheetManager() {}
SheetManager.active = null;

// window.addEventListener('scroll',  () => {
//     SheetManager.active && SheetManager.active.close();
// })

export default class SwipeCell {
    constructor(elem, options) {
        options = utils.extend({
            duration: 300,
            easing: 'cubic-ease-out',
            actions:[],
            leftActions: [],
        },options);

        this.elem = elem;
        this.elem.className += ` swipe-cell`;
        this.elem.children[0].className += ` swipe-cell-content`;
        this.options = options;

        this.initBtnWrap();

        this.minScrollX = -sum(this.leftData);
        this.maxScrollX = sum(this.rightData);

        this.scrollView = new ScrollView(elem, {
            bounceX: [this.hasActions('left'), this.hasActions('right')],
            axis: "x",
            freeMode: false,
        });

        this.scrollView.setOptions({
            minScrollX: this.minScrollX,
            maxScrollX: this.maxScrollX
        })


        this.scrollView.on("onDragStart", e => {
            if (SheetManager.active && SheetManager.active !== this) {
                SheetManager.active.close();
            }
        });

        this.scrollView.on("onDragEnd", event => {
            const eventInfo = event.x;
            let leftLimit = this.minScrollX * 0.5;
            let rightLimit = this.maxScrollX * 0.5;
            if (this.status !== 'right' && eventInfo.newScrollPos <= leftLimit) {
                eventInfo.newScrollPos = this.minScrollX;
                SheetManager.active = this;
            } else if (this.status !== 'left' && eventInfo.newScrollPos >= rightLimit) {
                eventInfo.newScrollPos = this.maxScrollX;
                SheetManager.active = this;
            } else {
                eventInfo.newScrollPos = 0;
                SheetManager.active = null;
                event.callback = (completed) => {
                    if(!completed) return;
                    this.scrollView.setOptions({
                        minScrollX: this.minScrollX,
                        maxScrollX: this.maxScrollX,
                        bounceX: [this.hasActions('left'), this.hasActions('right')],
                    });
                    this.status = '';
                }
            }

            eventInfo.duration = this.options.duration;
            eventInfo.easing = this.options.easing;
        });



        this.scrollView.on("onScroll", e => {
            let leftProgress = this.scrollView.scrollX / this.scrollView.minScrollX;
            let rightProgress = this.scrollView.scrollX / this.scrollView.maxScrollX;

            if (this.status !== 'right' && leftProgress > 0) {
                this.status = 'left';
                this.scrollView.setOptions({
                    minScrollX: this.minScrollX,
                    maxScrollX: undefined,
                    bounceX: [true, false],
                });
                
                this.leftBtnWrap.style.width = `${-this.scrollView.scrollX}px`;
                this.leftBtns.forEach((btn, index) => {
                    let x = sum(this.leftData.slice(0, index));
                    let x2 = sum(this.leftData.slice(0, index + 1));
                    btn.style.transform = `translateX(${ x2 * (leftProgress - 1) + x}px)`;
                    if (leftProgress > 1) {
                        btn.style.transform = `translateX(${ x * leftProgress }px)`;
                        btn.style.width = `${this.leftData[index]  * leftProgress }px`;
                    } else {
                        btn.style.width = `${this.leftData[index] }px`;
                    }
                });
            } else {
                this.leftBtnWrap.style.width = 0 + 'px';
            }

            if (this.status !== 'left' && rightProgress > 0) {    
                this.status = 'right';
                this.scrollView.setOptions({
                    minScrollX: undefined,
                    maxScrollX: this.maxScrollX,
                    bounceX: [false, true],
                });
                
                this.rightBtnWrap.style.width = `${this.scrollView.scrollX}px`;
                this.rightBtns.forEach((btn, index) => {
                    let x = sum(this.rightData.slice(0, index));
                    btn.style.transform = `translateX(${x * rightProgress}px)`;
                    if (rightProgress > 1) {
                        btn.style.width = `${this.rightData[index]  * rightProgress }px`;
                    } else {
                        btn.style.width = `${this.rightData[index] }px`;
                    }
                });
            } else {
                this.rightBtnWrap.style.width = 0 + 'px';
            }
        });
    }

    hasActions(type) {
        return type === 'left' ? this.options.leftActions.length > 0 : this.options.actions.length > 0;
    }

    renderBtns(actions) {
        let html = ``;

        actions.forEach(action => {
            html += `
            <div class="swipe-cell-btn ${action.type}">
                <span class="btn-text">${action.text}</span>
            </div>
            `
        });

        return html;
    }

    initBtnWrap() {
        this.leftBtnWrap = document.createElement('div');
        this.leftBtnWrap.className = 'swipe-cell-btns left';
        this.leftBtnWrap.innerHTML = this.renderBtns(this.options.leftActions);
        this.leftBtnWrap.addEventListener('click',()=> {
            this.close();
        });

        this.rightBtnWrap = document.createElement('div');
        this.rightBtnWrap.className = 'swipe-cell-btns right';
        this.rightBtnWrap.innerHTML = this.renderBtns(this.options.actions);
        this.rightBtnWrap.addEventListener('click',()=> {
            this.close();
        });

        this.elem.appendChild(this.leftBtnWrap);
        this.elem.appendChild(this.rightBtnWrap);

        this.leftBtns = this.leftBtnWrap.children;
        this.rightBtns = this.rightBtnWrap.children;
        this.leftData = [];
        this.rightData = [];

        this.leftBtns.forEach((btn, index) => {
            btn.style.zIndex = -index;
            this.leftData.push(btn.scrollWidth);
        });

        this.rightBtns.forEach((btn, index) => {
            btn.style.zIndex = index;
            this.rightData.push(btn.scrollWidth);
        });

    }

    open(type) {
        const scrollX = type === 'left' ? this.minScrollX : this.maxScrollX;
        this.scrollView.scrollTo(scrollX,undefined, {
            duration: this.options.duration,
            easing: this.options.easing
        });
    }

    close() {
        this.scrollView.scrollTo(0,undefined, {
            duration: this.options.duration,
            easing: this.options.easing,
            callback: ()=> {
                this.scrollView.setOptions({
                    minScrollX: this.minScrollX,
                    maxScrollX: this.maxScrollX,
                    bounceX: [this.hasActions('left'), this.hasActions('right')],
                });
                this.status = '';
            }
        });
    }

    destroy() {
        this.scrollView.destroy();
    }
}