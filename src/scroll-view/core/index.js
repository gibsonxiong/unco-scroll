/* eslint-disable */
import './style.scss';
import defaultOptions from './options';
import drag from './drag';
import zoom from './zoom';
import bounding from './bounding';
import ScrollViewManager from './ScrollViewManager';
import Observable from '../../observable';
import {
  Touch
} from '../../touch';
import animation from '../../animation';
import utils from '../../utils';
import domUtils from '../../utils/dom-utils';
import DomEvent from '../../dom-event';

const {
  Animater,
  aF
} = animation;

const newId = (function () {
  let uuid = 0;
  return function () {
    return uuid++;
  };
})();

function diff(newObject, oldObject) {
  const result = {};

  Object.keys(newObject).forEach(key => {
    if(newObject[key] !== oldObject[key]) {
      if(typeof newObject[key] === 'object' && newObject[key] !== null) {
        result[key] = diff(newObject[key], oldObject[key]);
      }else{
        result[key] = newObject[key];
      }
    }
  });

  return result;
}

class ScrollView extends Observable {
  static _defaults = defaultOptions;

  static _events = [
    'onInit',

    'onDragStart',
    'onDrag',
    'onDragEnd',

    'onWillScroll',
    'onScroll',
    'onScrollEnd',

    'onScrollCheck',
    'onAnimationStart',
    'onAnimation',
    'onAnimationEnd',

    'onRefresh',
  ];

  static plugins = [];

  static pluginMap = {};

  static use(Plugin) {
    const pluginName = Plugin.pluginName;

    if (!pluginName) return;
    if (ScrollView.pluginMap[pluginName]) return;

    ScrollView.plugins.push(Plugin);
    ScrollView.pluginMap[pluginName] = Plugin;
  };

  static get(elem) {
    if (typeof elem === 'string') {
      elem = document.querySelector(elem);
    }
    return elem.scrollView;
  }

  constructor(wrapper, options) {
    super();

    options = this.options = utils.extend({}, this.constructor._defaults, options);

    this.id = newId();
    wrapper.scrollView = this;
    ScrollViewManager[this.id] = this;

    this.wrapper = wrapper;
    this.content = wrapper.firstElementChild;
    domUtils.addClass(this.wrapper, 'scrollview');
    domUtils.addClass(this.content, 'scrollview-content');

    this.scale = (options.zoom && options.zoomStart) || 1;

    this._refresh(true, true);

    this.scrollX =
      this.options.startX != null ? this.options.startX : this.minScrollX;
    this.scrollY =
      this.options.startY != null ? this.options.startY : this.minScrollY;

    this.isScrolling = false;
    this.lockedAxis = '';
    this.prevLockedAxis = '';
    this.isScrollForceStoped = false;
    this.isParentScrolling = false;

    this.animationDelegating = false;
    
    this.domEvent = new DomEvent();

    this.on(this.constructor._events, options);

    this._bindEvent();

    this._initTouch();
    this._initAnimater();
    this._initMask();

    this._applyPlugins();

    const eventObject = {
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      scale: this.scale,
    };
    this.trigger('onInit', eventObject);

    this.backupX = eventObject.scrollX;
    this.backupY = eventObject.scrollY;

    this.scale = eventObject.scale;
    this.moveTo(eventObject.scrollX, eventObject.scrollY, true);

    domUtils.onImgLoaded(this.content, () => {
      this._refresh(true, false);
    });
  }

  _applyPlugins() {
    const plugins = ScrollView.plugins;

    plugins.forEach((Plugin) => {
      const pluginName = Plugin.pluginName;

      if (!this.options[pluginName]) return;

      this[pluginName] = new Plugin(this, this.options[pluginName]);
    });
  }

  _bindEvent() {
    // resize事件
    this.domEvent.on(window, 'resize', utils.throttling(() => {
      console.log('resize');
      this.refresh();
      this.bound();
    }));

    //处理微信键盘收起后，高度不正确BUG
    this.domEvent.on(document, 'focusin', (e) => {
      clearTimeout(this.resetTopTimer);
    });

    this.domEvent.on(document, 'focusout', (e) => {
      this.resetTopTimer = setTimeout(() => {
        document.documentElement.scrollTop = 0;
      }, 100);
    });

  }

  _initTouch() {
    let options = this.options;

    this.touch = new Touch(this.wrapper, {
      lockAxisAngle: options.lockAxisAngle,
      onInputStart: (e) => {
        this._inputStart(e);
      },
      onPanStart: (e) => {
        this._dragStart(e);
      },
      onPan: (e) => {
        this._drag(e);
      },
      onPanEnd: (e) => {
        this._dragEnd(e);
      },
    });

    if (options.zoom) {
      this.touch.on({
        onPinchStart: (e) => {
          this._zoomStart(e);
        },
        onPinch: (e) => {
          this._zoom(e);
        },
        onPinchEnd: (e) => {
          this._zoomEnd(e);
        }
      });
    }

    if(!options.allowTouch) {
      this.touch.disable();
    }
  }

  _initAnimater() {
    this.animater = new Animater({
      onAfterTick: () => {
        this.isScrolling = true;

        this.trigger('onAnimation');
        
        this.update(true);

        this.fixCursorPosition();
      },
      onPlay: () => {
        this.trigger('onAnimationStart');
      },
      onStop: ({
        completed
      }) => {
        this.trigger('onAnimationEnd', {
          completed,
        });
        this.trigger('onScrollEnd', {
          completed,
        });

        // ScrollViewManager.remove(this);
        this.isScrolling = false;
        this.animationDelegating = false;
        this.lockedAxis = '';
      },
    });
  }

  _initMask() {
    this.mask = document.createElement('div');
    domUtils.addClass(this.mask, 'scrollview-mask');
    this.wrapper.appendChild(this.mask);
  }

  _refresh(domReflow, slient, endScale) {
    const {
      alignX,
      alignY
    } = this.options;

    if (domReflow) {
      this.wrapperWidth = this.wrapper.clientWidth;
      this.wrapperHeight = this.wrapper.clientHeight;

      this.originContentWidth = this.content.scrollWidth;
      this.originContentHeight = this.content.scrollHeight;
    }

    if (endScale != null) {
      this.contentWidth = this.decimal(this.originContentWidth * endScale);
      this.contentHeight = this.decimal(this.originContentHeight * endScale);
    } else {
      this.contentWidth = this.decimal(this.originContentWidth * this.scale);
      this.contentHeight = this.decimal(this.originContentHeight * this.scale);
    }

    if (this.contentWidth <= this.wrapperWidth) {
      this.minScrollX =
        alignX === 'start' ?
        0 :
        alignX === 'end' ?
        -(this.wrapperWidth - this.contentWidth) :
        -(this.wrapperWidth - this.contentWidth) / 2;
      this.maxScrollX = this.minScrollX;
    } else {
      this.minScrollX = 0;
      this.maxScrollX = this.contentWidth - this.wrapperWidth;
    }

    if (this.contentHeight <= this.wrapperHeight) {
      this.minScrollY =
        alignY === 'start' ?
        0 :
        alignY === 'end' ?
        -(this.wrapperHeight - this.contentHeight) :
        -(this.wrapperHeight - this.contentHeight) / 2;
      this.maxScrollY = this.minScrollY;
    } else {
      this.minScrollY = 0;
      this.maxScrollY = this.contentHeight - this.wrapperHeight;
    }

    //设置options中的minScrollX, maxScrollX, minScrollY, maxScrollY
    ['minScrollX', 'maxScrollX', 'minScrollY', 'maxScrollY'].forEach((key) => {
      let option = this.options[key];
      if (option != null) {
        if (typeof option === 'function') {
          this[key] = option.call(this, this[key]);
        } else {
          this[key] = option;
        }
      }
    });

    if (!slient) {
      this.trigger('onRefresh');
    }


  }

  _update() {
    let {
      scrollX,
      scrollY,
      scale
    } = this;

    let eventObject = {
      scrollX,
      scrollY,
      scale,
    };

    this.trigger('onWillScroll', eventObject);
    this.scrollX = eventObject.scrollX;
    this.scrollY = eventObject.scrollY;
    this.scale = eventObject.scale;

    // 记录瞬间的delta
    this.deltaX = this.scrollX - this.backupX;
    this.deltaY = this.scrollY - this.backupY;

    // 保存位置，给下次使用
    this.backupX = this.scrollX;
    this.backupY = this.scrollY;

    if (this.options.use3d) {
      this.content.style.transform = `matrix3d(${this.scale}, 0, 0, 0, 0, ${
      this.scale
    }, 0, 0, 0, 0, 1, 0,${-this.scrollX}, ${-this.scrollY}, 0, 1)`;
    } else {
      this.content.style.transform = `matrix(${this.scale},0,0,${this.scale},${-this.scrollX},${-this.scrollY})`;
    }

    if(this.deltaX !== 0 || this.deltaY !== 0) {
      this.trigger('onScroll', {
        scrollX: this.scrollX,
        scrollY: this.scrollY,
      });
    }
  }

  update(immediately) {
    if (this.updateTimeId) {
      aF.cancel(this.updateTimeId);
      this.updateTimeId = null;
    }

    if (immediately) {
      this._update();
    } else {
      this.updateTimeId = aF.request(this._update.bind(this));
    }
  }

  _inputStart() {
    const minDelta = 0.5;
    this.isScrollForceStoped = this.isScrolling && (Math.abs(this.deltaX) > minDelta || Math.abs(this.deltaY) > minDelta);
    this.isParentScrolling = ScrollViewManager.isParentScrolling(this);
    this.prevLockedAxis = this.lockedAxis;

    clearTimeout(this.maskTimeId);
    domUtils.removeClass(this.mask, 'scrollview-mask-active');

    if (this.isScrollForceStoped) {
      domUtils.addClass(this.mask, 'scrollview-mask-active');

      this.maskTimeId = setTimeout(() => {
        domUtils.removeClass(this.mask, 'scrollview-mask-active');
      }, 300);
    }

    this.stop();
  }

  handleDelta(axis, delta, checkBounding = true) {
    if (this.options.axis !== axis && this.options.axis !== 'xy')
      return delta;

    let scrollPos = axis === 'x' ? this.scrollX : this.scrollY;
    let newScrollPos = scrollPos + delta;

    // console.log(this.minScrollX, newScrollPos);

    // 边界处理
    if (checkBounding && this.isOverBounding(axis, newScrollPos)) {
      let {
        bounceX,
        bounceY,
        resistanceFactor,
        resistancePercentForMaxSizeLimit,
      } = this.options;
      let minScrollPos = axis === 'x' ? this.minScrollX : this.minScrollY;
      let maxScrollPos = axis === 'x' ? this.maxScrollX : this.maxScrollY;
      let wrappSize = axis === 'x' ? this.wrapperWidth : this.wrapperHeight;
      let isOverUpper = this.isOverUpperBounding(axis, newScrollPos);
      let isOverLower = this.isOverLowerBounding(axis, newScrollPos);
      let bounce = axis === 'x' ? bounceX : bounceY;
      let bounceMin = utils.isArray(bounce) ? bounce[0] : bounce;
      let bounceMax = utils.isArray(bounce) ? bounce[1] : bounce;

      if ((bounceMin && isOverUpper) || (bounceMax && isOverLower)) {
        let diff = isOverUpper ?
          minScrollPos - newScrollPos :
          newScrollPos - maxScrollPos;
        let ratio =
          (wrappSize * resistancePercentForMaxSizeLimit - diff) /
          (wrappSize * resistancePercentForMaxSizeLimit);
        ratio = Math.max(ratio, 0.05);
        delta = delta * resistanceFactor * ratio;
      } else {
        delta = isOverUpper ? minScrollPos - scrollPos : maxScrollPos - scrollPos;
      }
    }

    return delta;
  }

  refresh() {
    this._refresh(true, false);

    // domUtils.onImgLoaded(this.content, () => {
    // 	this._refresh(true, false);
    // });
  }

  html(html) {
    domUtils.html(this.content, html);

    this.refresh();
  }

  //移动到
  moveTo(x, y, slient) {
    this.scrollX = x == null || isNaN(x) ? this.scrollX : x;
    this.scrollY = y == null || isNaN(y) ? this.scrollY : y;

    this.update(false, slient);
  }

  //滚动到某个elem
  scrollToElement(elem, axis = 'y', options) {
    let boxRect = domUtils.getBoxRect(elem);

    let x;
    let y;

    if (axis === 'x') {
      x = boxRect.left;
    }

    if (axis === 'y') {
      y = boxRect.top;
    }

    this.scrollTo(x, y, options);
  }

  //滚动从
  scrollBy(x, y, options) {
    x = x == null ? this.scrollX : this.scrollX + x;
    y = y == null ? this.scrollY : this.scrollY + y;

    this.scrollTo(x, y, options);
  }

  //滚动到
  scrollTo(x, y, options) {
    x = x == null ? this.scrollX : x;
    y = y == null ? this.scrollY : y;

    options = {
      duration: this.options.scrollDuration,
      easing: this.options.scrollEasing,
      ...options,
    };

    this.stop();

    if (options.duration > 0) {
      if (x !== this.scrollX) {
        this.setupScroll('x', x, options);
      } else {
        this.setupBounce('x');
      }

      if (y !== this.scrollY) {
        this.setupScroll('y', y, options);
      } else {
        this.setupBounce('y');
      }

      this.animater.play({
        callback: options.callback
      });
    } else {
      this.moveTo(x, y);
    }
  }

  fixCursorPosition() {
    // //处理光标定位
    const activeElement = document.activeElement; //当前focus的dom元素

    if (activeElement) {
      if (
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'INPUT'
      ) {
        if (activeElement.style.textShadow === '') {
          activeElement.style.textShadow = 'rgba(0,0,0,0) 0 0 0'; //改变某个不可见样式，触发dom重绘
        } else {
          activeElement.style.textShadow = '';
        }
      }
    }
  }

  bound(options = {}) {
    
    this.setupBounce('x', {
      duration: options.duration
    });
    this.setupBounce('y', {
      duration: options.duration
    });

    this.animater.play({
      callback: options.callback
    });
  }

  getMomentum(speed, duration, acceleration) {
    const s = speed * duration * acceleration;

    return s;
  }

  stop() {
    this.animater.stop();
    this.animater.clear();
  }

  querySelector(selector) {
    return this.content.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.content.querySelectorAll(selector);
  }

  getElementRect(elem) {
    let contentRect = this.content.getBoundingClientRect();
    let rect = elem.getBoundingClientRect();

    return {
      left: rect.left - contentRect.left,
      top: rect.top - contentRect.top,
      width: rect.width,
      height: rect.height,
    };
  }

  setOptions(options) {
    const _diff = diff(options, this.options);
    console.log(_diff);

    this.options = {
      ...this.options,
      ..._diff,
    };

    this.trigger('onSetOptions', _diff);

    let shouldRefresh = false;
    ['minScrollX', 'maxScrollX', 'minScrollY', 'maxScrollY'].forEach((key) => {
      if (options.hasOwnProperty(key)) {
        shouldRefresh = true;
      }
    });

    if('allowTouch' in options) {
      options.allowTouch ? this.touch.enable() : this.touch.disable();
    }

    if (shouldRefresh) this._refresh(false, false);
  }

  decimal(number, fractionDigits = 2) {
    if (number == null) return number;
    return parseFloat(number.toFixed(fractionDigits));
  }

  getScrollPos(axis) {
    return axis === 'x' ? this.scrollX : this.scrollY;
  }

  setScrollPos(axis, pos) {
    this[axis === 'x' ? 'scrollX' : 'scrollY'] = this.decimal(pos);
  }

  getBoundingPos(axis, isUpper){
    const minScrollPos = this[axis === 'x' ? 'minScrollX' : 'minScrollY'];
    const maxScrollPos = this[axis === 'x' ? 'maxScrollX' : 'maxScrollY'];
    return isUpper ? minScrollPos : maxScrollPos;
  }

  destroy() {
    this.domEvent.destroy();
  }
}

utils.copyProperties(ScrollView.prototype, drag);
utils.copyProperties(ScrollView.prototype, zoom);
utils.copyProperties(ScrollView.prototype, bounding);

export default ScrollView;