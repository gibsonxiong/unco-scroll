/* eslint-disable */
import utils from '../utils';
import aF from './aF';
import easing from './easing';

export default class Frame {
  static _defaults = {
    begin: 0,
    end: 1,
    duration: 300,
    easing: 'linear',

    index: 0,

    handler: function () { },

    onFirstFrame: function () { },
    onLastFrame: function () { },
  }

  constructor(options) {
    this.options = options = utils.extend({}, this.constructor._defaults, options);

    this._forward = true;

    this._init();
  }

  _init() {
    const {index, duration} = this.options;

    this.total = Math.round(duration / aF.mspf);
    this.current = index;
    this.prev = index;
  }


  isForward() {
    return this._forward;
  }

  goto(progress) {
    this.setProgress(progress);
    this._enterFrame();
  }

  setProgress(progress) {
    this.prev = this.current;
    this.current = this.total * progress;
  }

  getProgress(current = this.current) {
    if (this.total === 0) {
      return 1;
    }

    if (current <= 0) {
      return 0;
    } else if (current >= this.total) {
      return 1;
    } else {
      return current / this.total;
    }
  }

  _change(isFirst, diff) {
    if (!isFirst) {
      this.step(diff);
    }

    this._enterFrame();
  }

  step(diff) {
    this.prev = this.current;

    let stepValue =  Math.max(Math.round(diff / aF.mspf), 1);
    
    this._forward ? (this.current += stepValue) : (this.current -= stepValue);

    this.current = Math.max(0, Math.min(this.total, this.current));
  }

  //进入帧动作
  _enterFrame() {
    const { begin, end } = this.options;
    const {current, prev, total} = this;
    const easingFn = easing.get(this.options.easing);

    const progress = this.getProgress();
    const easingProgress = easingFn(progress, 0, 1, 1);
    let value = begin + (end - begin) * easingProgress;
    value = parseFloat(value.toFixed(2));
    const prevProgress = this.total === 0 ? 0 : this.getProgress(prev);
    const prevEasingProgress = easingFn(prevProgress, 0, 1, 1);
    let prevValue = begin + (end - begin) * prevEasingProgress;
    prevValue = parseFloat(prevValue.toFixed(2));

    this.options.handler.call(this, value, prevValue, easingProgress);

    if ((this._forward && current <= 0) || (!this._forward && current >= total)) {
      this.options.onFirstFrame.call(this);
    }

    if ((this._forward && current >= total) || (!this._forward && current <= 0)) {
      this.options.onLastFrame.call(this);
    }
  }

  isCompleted() {
    if (this._forward) {
      return this.current >= this.total;
    } else {
      return this.current <= 0;
    }
  }
}