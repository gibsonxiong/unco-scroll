/* eslint-disable */
import utils from '../utils';

export default class ItemGroup {
    static pluginName = 'itemGroup';

    static _defaults = {
        selector: '.scroll-item-group',
    }

    constructor(scrollView, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);

        this.scrollView = scrollView;
        
        this.data = [];

        this.currentIndex = 0;

        this._bindEvent();

        this._init();

        this.check();
    }

    _bindEvent() {
        this.scrollView.on('onScroll',(e)=>{
            this.check();
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

    check(){
        if(this.disabled) return;

        const frameMin = this.scrollView.scrollY;
        const frameMax = frameMin + this.scrollView.wrapperHeight;

        this.data.some((item,index)=>{
            if( 
                item.top <= frameMin && item.top + item.height > frameMin
            ){
                if(this.currentIndex !== index){
                    this.currentIndex = index;
                    this.options.onChange(index);
                }
                return true;
            }
        });
    }

    enableCheck(){
        this.disabled = false;
    }

    disableCheck(){
        this.disabled = true;
    }

    scrollTo(index){
        const top = this.data[index].top;

        // this.disableCheck();
        // this.currentIndex = index;
        this.scrollView.scrollTo(null, top);
    }
}