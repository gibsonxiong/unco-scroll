/* eslint-disable */
import animation from '../../animation';

const {
  Frame,
} = animation;

export default {
  _zoomStart(e) {
    e.nativeEvent.preventDefault();

    this.zooming = true;

    const wrapperRect = this.wrapper.getBoundingClientRect();

    this.startScale = this.scale;
    this.startScrollX = this.scrollX;
    this.startScrollY = this.scrollY;

    this.zoomOriginX = e.centerX + this.scrollX - wrapperRect.left; //zoom原点x
    this.zoomOriginY = e.centerY + this.scrollY - wrapperRect.top; //zoom原点y
  },

  _zoom(e) {
    e.nativeEvent.preventDefault();

    let {
      zoomMin,
      zoomMax,
    } = this.options;

    let newScale = this.startScale * e.scale;

    if (newScale < zoomMin) {
      newScale = 0.5 * zoomMin * Math.pow(2.0, newScale / zoomMin);
    } else if (newScale > zoomMax) {
      newScale = 2 * zoomMax * Math.pow(0.5, zoomMax / newScale);
    }

    this.scale = newScale;
    this.scrollX =
      (this.scale / this.startScale - 1) * this.zoomOriginX + this.startScrollX;
    this.scrollY =
      (this.scale / this.startScale - 1) * this.zoomOriginY + this.startScrollY;

    this._refresh(false, false);
    this.update();
  },

  _zoomEnd(e) {
    e.nativeEvent.preventDefault();

    let endScale = this.limitScale(this.scale);

    let endScrollX =
      (endScale / this.startScale - 1) * this.zoomOriginX +
      this.startScrollX;
    let endScrollY =
      (endScale / this.startScale - 1) * this.zoomOriginY +
      this.startScrollY;

    this._refresh(false, true, endScale); //计算最后的属性

    if (endScrollX < this.minScrollX) {
      endScrollX = this.minScrollX;
    } else if (endScrollX > this.maxScrollX) {
      endScrollX = this.maxScrollX;
    }

    if (endScrollY < this.minScrollY) {
      endScrollY = this.minScrollY;
    } else if (endScrollY > this.maxScrollY) {
      endScrollY = this.maxScrollY;
    }

    this.setupScroll(
      'x',
      endScrollX,
      {
        duration: this.options.rebounceDuration,
        easing: this.options.rebounceEasing,
        checkBounding: false
      }
    );
    this.setupScroll(
      'y',
      endScrollY,
      {
        duration: this.options.rebounceDuration,
        easing: this.options.rebounceEasing,
        checkBounding: false
      }
    );

    this.setupScaleAnimation(
      endScale,
      undefined,
      undefined,
      false,
      this.options.rebounceDuration,
      this.options.rebounceEasing
    );

    this.animater.play({
      callback: (completed)=> {
        if(!completed) {
          this.scale = endScale;
          this.scrollX =  endScrollX;
          this.scrollY =  endScrollY;
          this._update();
          this._refresh(false, true)
        }
        this.zooming = false;
      }
    });

  },

  limitScale(scale) {
    let { zoomMin, zoomMax } = this.options;

    if (scale < zoomMin) {
      scale = zoomMin;
    } else if (scale > zoomMax) {
      scale = zoomMax;
    }
    
    return scale;
  },

  setupScaleAnimation(
    end,
    x,
    y,
    setXY,
    duration = this.options.scrollDuration,
    easing = this.options.scrollEasing
  ) {
    const begin = this.scale;
    const wrapperRect = this.wrapper.getBoundingClientRect();

    this.startScale = this.scale;
    this.startScrollX = this.scrollX;
    this.startScrollY = this.scrollY;
    this.zoomOriginX = x + this.scrollX - wrapperRect.left; //zoom原点x
    this.zoomOriginY = y + this.scrollY - wrapperRect.left; //zoom原点y
    
    this.animater.add(
      'scale',
      new Frame({
        begin,
        end,
        handler: (newScale) => {          
          this.scale = newScale;

          if(setXY) {
            this.scrollX =
              (this.scale / this.startScale - 1) * this.zoomOriginX + this.startScrollX;
            this.scrollY =
              (this.scale / this.startScale - 1) * this.zoomOriginY + this.startScrollY;
          }

          this._refresh(false, true);
        },
        onLastFrame: () => {
          if(setXY) {
            this.bound();
          }
        },
        duration: duration,
        easing: easing,
      })
    );
  },

  zoomTo(endScale, x, y, callback) {
    endScale = this.limitScale(endScale);

    this.setupScaleAnimation(endScale, x, y, true);

    this.animater.play({callback});
  },

  zoomBy(newScale, x, y, callback) {
    const endScale = this.scale * newScale;

    this.zoomTo(endScale, x, y, callback);
  }
};
