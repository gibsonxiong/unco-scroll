/* eslint-disable */
import utils from '../utils';
import aF from './aF';

//计时器
export default class Animater {
  static _defaults =  {
    onBeforeTick: function () { },
    onAfterTick: function () { },
    onPlay: function () { },
    onStop: function () { },
  }

  constructor (options) {
    options = this.options = utils.extend({}, this.constructor._defaults, options);
    this._playing = false;
    this.timer = null;
    this.lastestTime = 0;
    this.frames = {};
    this.callbacks = [];
  }

  _tick(isFirst = false, timestamp, handler) {
    if (!this.isPlaying()) return;

    let diff = timestamp - this.lastestTime;
    this.lastestTime = timestamp;

    this.options.onBeforeTick.call(this);

    Object.keys(this.frames).forEach(frameKey=>{
      const frame = this.frames[frameKey];
      
      if(isFirst || !frame.isCompleted()){
        frame._change(isFirst, diff);
      }

    });

    handler && handler.call(this);

    this.options.onAfterTick.call(this);

    //是否已经全部完成
    const isAllCompleted = Object.keys(this.frames).every(frameKey=>{
      return this.frames[frameKey].isCompleted();
    })

    if (isAllCompleted) {
      this.stop(true);
    }else{
      this.timer = aF.request((timestamp) => {
        this._tick(false, timestamp, handler);
      });
    }
  }

  _exceCallback(completed){
    this.callbacks.forEach((callback)=>{
      callback.call(this, completed);
    });

    //清空
    this.callbacks = [];
  }

  add(key, frame) {
    this.frames[key] = frame;
  }

  remove(key) {
    delete this.frames[key];
  }

  clear(){
    this.frames = {};
  }

  play(options) {
    options = {
      handler: null, /* Function */
      callback: null, /* Function */
      ...options,
    }

    if(options.callback){
      this.callbacks.push(options.callback);
    }

    if (this.isPlaying()) return;

    this._playing = true;

    this.options.onPlay.call(this);

    const timestamp = performance.now();

    this.lastestTime = timestamp;

    this._tick(true, timestamp, options.handler);

    // this.timer = aF.request((timestamp) => {
    //   this._tick(true, timestamp, options.handler);
    // });

    return this;
  }

  stop(completed = false) {
    if (!this.isPlaying()) return;

    this._playing = false;

    this._exceCallback(completed);

    this.options.onStop.call(this, { completed });

    aF.cancel(this.timer);

    return this;
  }
  
  isPlaying() {
    return this._playing;
  }

  
}