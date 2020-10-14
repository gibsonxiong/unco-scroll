/* eslint-disable */
import './style.scss';
import utils from '../../utils';
import domUtils from '../../utils/dom-utils';

class ScrollBarItem {

    static _defaults = {
        hideDelay: 1000,
    }

    constructor(scrollView, axis, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);
        this.axis = axis;
        this.scrollView = scrollView;
        this.keys = ({
            x: ['Width', 'X'],
            y: ['Height', 'Y']
        })[this.axis];
        this.hideTimer = null;

        this._init();
        this._update();
    }

    _init() {
        let {
            axis
        } = this;

        let scrollView = this.scrollView;

        this.track = document.createElement('div');
        domUtils.addClass(this.track, 'scrollview-scrollbar');
        domUtils.addClass(this.track, `scrollbar-${axis}`);
        scrollView.wrapper.appendChild(this.track);

        this.indicator = document.createElement('div');
        domUtils.addClass(this.indicator, 'scrollbar-indicator');
        domUtils.addClass(this.indicator, 'hidden');
        this.track.appendChild(this.indicator);
    }

    getScrollInfo() {
        let {
            keys,
            scrollView
        } = this;

        let wrapperSize = scrollView[`wrapper${keys[0]}`];
        let contentSize = scrollView[`content${keys[0]}`];
        let ratio = wrapperSize / contentSize;
        let minScrollPos = 0;
        let maxScrollPos = contentSize - wrapperSize;

        return {
            wrapperSize,
            contentSize,
            ratio,
            minScrollPos,
            maxScrollPos
        }
    }

    getScrollPos() {
        return this.scrollView[`scroll${this.keys[1]}`];
    }

    _update() {
        let scrollInfo = this.getScrollInfo();
        let keys = this.keys;

        this.trackSize = this.track[`offset${keys[0]}`];
        this.indicatorSize = this.trackSize * scrollInfo.ratio;

        this.minScrollPos = 0;
        this.maxScrollPos = this.trackSize - this.indicatorSize;
        this.viewRatio = this.trackSize / scrollInfo.contentSize;

        this._translate(false);
    }

    _translate(show = true) {
        let scrollInfo = this.getScrollInfo();
        let minSize = 40;
        let minBoundSize = 10;
        let scrollPos = this.getScrollPos();
        let {
            trackSize,
            indicatorSize,
            viewRatio,
            minScrollPos,
            maxScrollPos
        } = this;
        let size = indicatorSize;
        let pos = scrollPos * viewRatio;
        let oldMaxScrollPos = maxScrollPos;

        if (size < minSize) {
            maxScrollPos = this.trackSize - minSize;
            pos *= maxScrollPos / oldMaxScrollPos;
            size = minSize;
        }

        if (pos < minScrollPos) {
            size -= (0 - scrollPos);
            size = Math.max(size, minBoundSize);
            pos = minScrollPos;
        } else if (pos > maxScrollPos) {
            let oldSize = size;
            size -= (scrollPos - scrollInfo.maxScrollPos);
            size = Math.max(size, minBoundSize);
            pos = maxScrollPos + oldSize - size;
        }

        if (size >= trackSize) {
            size = 0;
        }

        if (this.axis == 'x') {
            this.indicator.style.width = size +'px';
            this.indicator.style.transform = 'translate3d(' + pos + 'px,0,0)';
        } else {
            this.indicator.style.height = size +'px';
            this.indicator.style.transform = 'translate3d(0, ' + pos + 'px, 0)';
        }

        show && this.show();
    }

    show(){
        clearTimeout(this.hideTimer);
        domUtils.removeClass(this.indicator, 'hidden');
    }

    hide() {
        this.hideTimer = setTimeout(()=>{
            domUtils.addClass(this.indicator, 'hidden');
        }, this.options.hideDelay);
    }
}

export default class ScrollBar {
    static pluginName = 'scrollbar';

    static _defaults = {
        axis:'inherit'
    }

    constructor (scrollView, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);
    
        this.scrollView = scrollView;
    
        if(options.axis === 'inherit'){
            options.axis = scrollView.options.axis;
        }
    
        if (options.axis !== 'y') {
            this.x = new ScrollBarItem(scrollView,'x');
        }
    
        if (options.axis !== 'x') {
            this.y = new ScrollBarItem(scrollView, 'y');
        }
    
        this._bindEvent();
        this._update();
    
    }

    _bindEvent() {
        this.scrollView.on('onScroll', (e)=> {
            this._translate();
        });

        this.scrollView.on('onRefresh', (e)=> {
            this._update();
        });

        this.scrollView.on('onScrollEnd', ({completed})=> {
            if(completed) {
                this.hide();
            }
        });
    }

    _update () {
        this.x && this.x._update();
        this.y && this.y._update();
    }

    _translate() {
        this.x && this.x._translate();
        this.y && this.y._translate();
    }

    hide(){
        this.x && this.x.hide();
        this.y && this.y.hide();
    }
}