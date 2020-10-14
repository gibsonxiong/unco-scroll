/* eslint-disable */
import './style.scss';

import ScrollView from '../scroll-view/core';
import Snap from '../scroll-view/snap';
import Observable from '../observable';
import domUtils from '../utils/dom-utils';
import utils from '../utils';

ScrollView.use(Snap);

class Picker extends Observable{
  static _defaults = {
    cols:[],
    onChange: function() {}
  };
  constructor(options) {
    super();
    this.options = options = utils.extend({}, this.constructor._defaults, options);
    this.cols = [];

    this._initPopup();
    this._init();
  }

  _init() {
    this.wrap = domUtils.create(`
      <div class="picker">
        <div class="picker-mask mask-top"></div>
        <div class="picker-mask mask-bottom"></div>
      </div>
    `);

    this.popup.appendChild(this.wrap);

    this.options.cols.forEach((colOptions, colIndex)=> {
      this._initCol(colIndex, colOptions);
    });
  }

  _initPopup() {
    this.popup = domUtils.create(`
      <div class="popup"></div>
    `);

    this.popup.addEventListener('touchmove', (e)=> e.preventDefault());

    document.body.appendChild(this.popup);
  }

  getItemsHtml(items) {
    const html = [];
    items.forEach((d) => {
      html.push(`
        <div class="picker-wheel-item">${d}</div>
      `);
    });

    return html.join('');
  }

  _initCol(colIndex, colOptions) {
    const items = colOptions.data;
    const colWrap = document.createElement('div');
    domUtils.addClass(colWrap, 'picker-wheel-wrap');

    colWrap.innerHTML = `
      <div class="picker-wheel">
        <div class="picker-wheel-content">
        </div>
      </div>
    `;
    this.wrap.appendChild(colWrap);

    const scrollViewWrap = colWrap.querySelector('.picker-wheel');
    const col = new ScrollView(scrollViewWrap, {
      axis: "y",
      momentumFactor: 0.07,
      momentumMinDistance: 0,
      snap: {
        selector: ".picker-wheel-item",
        step: false,
        axis: "y",
        align:'center',
        easing:'cubic-ease-out',
        duration:800,
        onlyEdgeBounce:false,
        
        onProgress(index, progress){
          let itemCount = 2;
          let degStep = 25;

          for(let i= index - (itemCount + 1); i <= index + (itemCount + 1); i++ ){
              let n = i - index;
              let deg = Math.round(n * degStep -  progress * degStep);
              this.snapData[i] && (this.snapData[i].elem.style.transform = `rotateX(${deg}deg)`);
          }
        },
        onWillChange: (index) => {
          const item = items[index];
          const value = this.findValue(item);
          this._handleChange(colIndex, value, index, item);
        }
      }
    })

    this.cols.push(col);

    this.setData(colIndex, colOptions.data);

  }

  findValue(item) {
    if(typeof item === 'string') {
      return item;
    }


  }

  _handleChange(colIndex, value, index, item) {
    this.options.onChange(colIndex, value, index, item);
  }

  setData(colIndex, data) {
    const html = this.getItemsHtml(data);
    const scrollView = this.cols[colIndex];

    scrollView.html(html);

    this.setValueByIndex(colIndex, 0, 0);
  }

  getData() {

  }

  setValueByIndex(colIndex, index, duration) {
    const colScrollView = this.cols[colIndex];

    colScrollView.snap.goto(index, duration);
  }

  getValue(colIndex) {

  }

  show() {
    domUtils.addClass(this.popup, 'popup-active')
    this.cols.forEach(col=> {
      col.refresh();
    });
  }

  hide(){
    domUtils.removeClass(this.popup, 'popup-active')
  }
}

export default Picker;