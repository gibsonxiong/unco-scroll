/* eslint-disable */
import './style.scss';
import utils from '../../utils';
import domUtils from '../../utils/dom-utils';

export default class Sticky {
    static pluginName = 'sticky';

    static _defaults = {
      selector: '.scroll-sticky',
    }

    constructor(scrollView, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);

        this.scrollView = scrollView;

        this.data = [];

        this._initFixedContainer();

        this._bindEvent();

        this._collect();

        this.currentIndex = -1;
        this.dect(0);

    }

    _bindEvent() {
        this.scrollView.on('onRefresh', (e) => {
            // this._collect();
            console.log('refresh');
        });

        this.scrollView.on('onScroll', (e) => {
          this.dect(e.scrollY);
        });
    }

    _initFixedContainer() {
      this.fixed = domUtils.create(`
        <div class="scroll-sticky-fixed"></div>
      `);

      this.scrollView.wrapper.appendChild(this.fixed);
    }

    _collect() {
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
                size,
                maxPos: minPos + size,
            });
        });

        console.log(this.data);
    }

    dect(pos){
      if(this.scrollView.isOverUpperBounding('y')) {
        domUtils.setStyle(this.fixed, 'display', 'none');
      } else {
        domUtils.setStyle(this.fixed, 'display', '');
      }

      this.data.some((item, index)=>{
        const nextItem = this.data[index + 1];

        if(item.minPos <= pos && (!nextItem || nextItem.minPos > pos)) {

          if(this.currentIndex !== index) {
            const elem = item.elem.cloneNode(true);
            domUtils.html(this.fixed, elem);
            this.currentIndex = index;
          }

          if(nextItem) {
            const diff = nextItem.minPos - (pos + item.size);
            
            if(diff < 0) {
              domUtils.setStyle(this.fixed, {
                transform: `translateY(${diff}px)`
              });
            } else {
              domUtils.setStyle(this.fixed, {
                transform: `translateY(0px)`
              });
            }
          } else {
            domUtils.setStyle(this.fixed, {
              transform: `translateY(0px)`
            });
          }

          return true;
        }
      });
    }

}