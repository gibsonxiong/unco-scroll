/* eslint-disable */
import './style.scss';
import utils from '../../utils';

const throttle = function(func, delay) {            
    let prev = Date.now();
    let timer = null;            
    return function() {
        const context = this;                
        const args = arguments;                
        const now = Date.now();

        clearTimeout(timer);                
        if (now - prev >= delay) { 
            func.apply(context, args);
            prev = now;                    
        } else {
            timer = setTimeout(() => {
                func.apply(context, args);
                prev = now;
            }, delay - (now - prev));
        }            
                        
　　}        
}   

export default class Paging {
    static pluginName = 'paging';

    static _defaults = {
        axis:'y',
        selector: '.scroll-paging',
        dectInterval: 1500,
        offset:2000,
    }

    constructor(scrollView, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);

        this.scrollView = scrollView;

        this.data = [];

        this._bindEvent();

        this._collect();

        this.dect(0);

    }

    _bindEvent() {
        this.scrollView.on('onRefresh', (e) => {
            // this._collect();
            console.log('refresh');
        });

        const dect = throttle(()=> {
            console.log('dect');
            if (this.options.axis === 'x') {
                this.dect(this.scrollView.scrollX);
             }else if(this.options.axis === 'y'){
                this.dect(this.scrollView.scrollY);
             }
        }, this.options.dectInterval);

        this.scrollView.on('onScroll', dect);
    }

    _collect() {
        this.scrollView.querySelectorAll('.scrollview-paging-inactive').forEach(elem=> {
            elem.classList.remove('scrollview-paging-inactive');
        });
        this.scrollView.querySelectorAll('.spaceholder').forEach(elem=> {
            elem.parentElement.removeChild(elem);
        });


        const {
            selector,
            axis,
        } = this.options;

        this.data = [];
        let elements = this.scrollView.querySelectorAll(selector);
        let sizeName = axis == 'x' ? 'Width' : 'Height';
        let posName = axis == 'x' ? 'Left' : 'Top';

        
        elements.forEach((elem) => {
            let minPos = elem[`offset${posName}`];
            let size = elem[`offset${sizeName}`];

            this.data.push({
                elem,
                minPos,
                maxPos: minPos + size,
                size
            });
        });

        //spaceholder
        this.data.forEach((item,index)=>{
            const spaceholder = document.createElement('div');
            spaceholder.className = `spaceholder spaceholder-${index}`;
            spaceholder.style.height = item.size + 'px';
            spaceholder.style.display = 'none';
            item.elem.parentElement.insertBefore(spaceholder, item.elem);

            item.spaceholder = spaceholder;
        });

        // console.log(this.data);

    }

    dect(pos){
        const {offset} = this.options;

        this.data.forEach(item=>{
            if(item.minPos <= pos + offset && item.maxPos >= pos - offset) {
                // console.log(item.elem)
                if(item.elem.classList.contains('scrollview-paging-inactive')) {
                    item.elem.classList.remove('scrollview-paging-inactive');
    
                    item.spaceholder.style.display = 'none';
                }
            }else {
                if(!item.elem.classList.contains('scrollview-paging-inactive')){
                    item.elem.classList.add('scrollview-paging-inactive');

                    item.spaceholder.style.display = '';
                }

            }
        });
    }

}