/* eslint-disable */
import utils from '../utils';

export default class Lazyload {
    static pluginName = 'lazyload';

    static _defaults = {
        selector: '.scroll-lazyload',
    }

    constructor(scrollView, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);

        this.scrollView = scrollView;
        
        this.data = [];

        this._bindEvent();

        this._init();

        this.checkHit();
    }

    _bindEvent() {
        this.scrollView.on('onScroll',(e)=>{
            this.checkHit();
        });
    }

    _init() {
        const {
            selector,
        } = this.options;

        this.data = [];

        const elements = this.scrollView.querySelectorAll(selector);

        elements.forEach(elem => {
            let rect = this.scrollView.getElementRect(elem);

            this.data.push({
                ...rect,
                elem: elem
            });
        });

        console.log(this.data);

    }

    checkHit(){
        const frameMinX = this.scrollView.scrollX;
        const frameMaxX = frameMinX + this.scrollView.wrapperWidth;
        const frameMinY = this.scrollView.scrollY;
        const frameMaxY = frameMinY + this.scrollView.wrapperHeight;

        this.data.forEach(item=>{
            if( 
                (
                    item.left + item.width <= frameMaxX &&
                    item.left + item.width > frameMinX &&
                    item.top + item.height <= frameMaxY &&
                    item.top + item.height > frameMinY 
                ) || 
                (
                    item.left >= frameMinX &&
                    item.left < frameMaxX &&
                    item.top >= frameMinY &&
                    item.top < frameMaxY
                )
            ){
                if(item.elem.getAttribute('lazyload-status') === 'loading'){
                    return;
                }

                item.elem.setAttribute('lazyload-status', 'loading');

                item.elem.src = item.elem.getAttribute('data-src');

                const onLoad = ()=>{
                    item.elem.setAttribute('lazyload-status', 'loaded');
                    const index = this.data.indexOf(item);
                    this.data.splice(index,1);
                }
                 
                item.elem.addEventListener('load', onLoad);
            }
        });
    }
}