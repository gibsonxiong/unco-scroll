/* eslint-disable */
import animation from '../../animation';
import utils from '../../utils';
import ScrollViewManager from './ScrollViewManager';
import domUtils from '../../utils/dom-utils';

const {
  Frame,
  aF
} = animation;

export default {
  _dragStart(e) {
    // console.log('dragStart', this.wrapper.className.split(' ')[0]);
    if(this.zooming) {
      e.nativeEvent.preventDefault();
      // e.nativeEvent.stopPropagation();
      return;
    }

    const options = this.options;
    const movingAxis = this.prevLockedAxis || e.movingAxis;
    const nativeScrolling = !e.nativeEvent.cancelable;
    const srcElement = e.nativeEvent.srcElement;

    this.canMoveX = true;
    this.canMoveY = true;
    this.defaultPrevented = false;

    // if(this.wrapper.matches('.viewer-wrapper')) debugger;

    // 事件被阻止默认动作
    if (e.nativeEvent.defaultPrevented) {
      this.canMoveX = false;
      this.canMoveY = false;
    }

    if (options.axis === 'y') {
      this.canMoveX = false;
    }

    if (options.axis === 'x') {
      this.canMoveY = false;
    }

    if (options.freeMode === false && options.axis.indexOf('x') > -1 && movingAxis === 'y') {
      this.canMoveX = false;
    }

    // 非freeMode模式下，不能滚动锁定轴以外的轴。
    if (options.freeMode === false && options.axis.indexOf('x') > -1 && movingAxis === 'y') {
      this.canMoveX = false;
    }

    if (options.freeMode === false && options.axis.indexOf('y') > -1 && movingAxis === 'x') {
      this.canMoveY = false;
    }

    // 如果父类滚动中，且自身没有滚动，则不能滚动
    if (this.isParentScrolling && !this.isScrollForceStoped) {
      this.canMoveX = false;
      this.canMoveY = false;
    }

    // 滚动范围不大于0，则禁止滚动
    if(this.options.scrollNeedOverflow){
      if(this.maxScrollX - this.minScrollX <= 0) {
        this.canMoveX = false;
      }
  
      if(this.maxScrollY - this.minScrollY <= 0) {
        this.canMoveY = false;
      }
    }

    // 边缘释放touch
    if (options.boundingReleaseX) {
      let newPos = this.scrollX - e.deltaX;
      if (options.axis.indexOf('x') >= 0 && movingAxis === 'x') {
        if ((this.decimal(this.scrollX) === this.decimal(this.minScrollX) || this.decimal(this.scrollX) === this.decimal(this.maxScrollX)) && this.isOverBounding('x', newPos)) {
          this.canMoveX = false;
          this.canMoveY = false;
        }
      }
    }

    if (options.boundingReleaseY) {
      let newPos = this.scrollY - e.deltaY;
      if (options.axis.indexOf('y') >= 0 && movingAxis === 'y') {
        if ((this.decimal(this.scrollY) === this.decimal(this.minScrollY) || this.decimal(this.scrollY) === this.decimal(this.maxScrollY)) && this.isOverBounding('y', newPos)) {
          this.canMoveX = false;
          this.canMoveY = false;

        }
      }
    }

    // 如果子类textarea非边缘滚动，则自身不能滚动。
    if (srcElement.tagName === 'TEXTAREA' || srcElement.tagName === 'INPUT') {

      if (srcElement !== document.activeElement) {
        document.activeElement.blur();
      }

      if (srcElement.scrollHeight > srcElement.clientHeight) {
        if ((srcElement.scrollTop === 0 && e.deltaY > 0) ||
          (srcElement.scrollTop === srcElement.scrollHeight - srcElement.clientHeight && e.deltaY < 0)) {
            console.log('---');
          } else {
          this.canMoveX = false;
          this.canMoveY = false;
        }
      }
    } else {
      document.activeElement.blur();
    }

    this.trigger('onDragStart');
    this.trigger('onScrollCheck');

    if ((this.canMoveX || this.canMoveY) && !nativeScrolling) {
      e.nativeEvent.preventDefault();
      
      // ScrollViewManager.add(this, movingAxis);
      this.isScrolling = true;
      this.lockedAxis = movingAxis;
    }else {
      this.defaultPrevented = true;
    }
  },

  _drag(e) {
    if(this.zooming) {
      e.nativeEvent.preventDefault();
      return;
    }

    const options = this.options;
    const nativeScrolling = !e.nativeEvent.cancelable;
    
    // 两个轴都不可以滚动或者原生滚动触发了，则不处理。
    if ((!this.canMoveX && !this.canMoveY) || nativeScrolling) return;
    
    let scrollX
    let scrollY;
    let deltaX = -e.deltaX;
    let deltaY = -e.deltaY;
    
    if (!this.canMoveX) deltaX = 0;
    if (!this.canMoveY) deltaY = 0;

    // let eventObject = {
    //   deltaX,
    //   deltaY,
    //   checkBounding: true
    // }
    // this.trigger('onDrag', eventObject);

    scrollX = this.scrollX + this.handleDelta('x', deltaX, true);
    scrollY = this.scrollY + this.handleDelta('y', deltaY, true);

    this._doDrag('x', deltaX);
    this._doDrag('y', deltaY);

    // this.moveTo(scrollX, scrollY);

    this.fixCursorPosition();

    e.nativeEvent.preventDefault();
  },

  _doDrag(axis, delta, source) {
    const { delegateDrag } = this.options;

    if(delta === 0 ) return;

    if(delegateDrag) {
      const delegateInfo = delegateDrag.call(this, axis, delta);

      if( delegateInfo && delegateInfo.scrollView !== source) {
        let consumedDelta = 0;
        if(delegateInfo.scrollView.options.onDelegateDrag) {
          consumedDelta = delegateInfo.scrollView.options.onDelegateDrag.call(delegateInfo.scrollView, delegateInfo.axis, delegateInfo.delta);
  
          if(consumedDelta) {
            delta -= consumedDelta;
            
            delegateInfo.scrollView._doDrag(delegateInfo.axis, consumedDelta, this);
          }
        }
      }

    }
    this.setScrollPos(axis, this.getScrollPos(axis) + this.handleDelta(axis, delta, true));

    this.update();
  },

  _dragEnd(e) {
    if(this.zooming) {
      return;
    }

    let options = this.options;
    let {
      momentum,
      momentumEasing,
      momentumDuration,
      momentumFactor,
      momentumMinDistance,
      resistanceFactor,
      decreaseDuration,
      decreaseEasing,
      rebounceDuration,
      rebounceEasing,
      accelerateByFastPan,
      resistancePercentForMaxSizeLimit
    } = options;

    let newScrollX, newScrollY;

    const outsideDurationRatio = 0.8;

    const getMomentum = (axis) => {
      const speed = axis === 'x' ? -e.speedX : -e.speedY;
      let fastTimes = axis === 'x' ? e.fastTimesX : e.fastTimesY;

      let distance = this.getMomentum(speed, momentumDuration, momentumFactor);
      
      // fastTimes= 15;
      if (accelerateByFastPan && fastTimes >= 3) {
        distance *= Math.min(fastTimes / 2, 20);
      }
      
      if (Math.abs(distance) < momentumMinDistance) distance = 0;

      return this.getScrollPos(axis) + distance;
    }

    const getOutSideMomentum = (axis, isOverUpper) => {
      const speed = axis === 'x' ? -e.speedX : -e.speedY;
      let wrappSize = axis === 'x' ? this.wrapperWidth : this.wrapperHeight;
      let distance = this.getMomentum(speed, decreaseDuration, resistanceFactor * this.options.resistanceMomentumFactor)

      let diff = this.getScrollPos(axis) - this.getBoundingPos(axis, isOverUpper); 
      let ratio =
        (wrappSize * resistancePercentForMaxSizeLimit - Math.abs(diff)) /
        (wrappSize * resistancePercentForMaxSizeLimit);
      ratio = Math.max(ratio, 0.05);
      distance *= ratio;

      if (Math.abs(distance) < 10) distance = 0;

      return this.getScrollPos(axis) + distance;
    }

    const info = {};

    ['x', 'y'].forEach(axis=>{
      const canMove = axis === 'x' ? this.canMoveX : this.canMoveY;
      const speed = axis === 'x' ? -e.speedX : -e.speedY;
      // 在界外
      if (this.isOverBounding(axis)) {
        const isOverUpper = this.isOverUpperBounding(axis);

        // speed为0
        if(speed === 0 || !canMove){
          info[axis] = {
            newScrollPos: this.getBoundingPos(axis, isOverUpper),
            duration: rebounceDuration * 0.8,
            easing: rebounceEasing ,
          }
        } else if((isOverUpper && speed > 0) || (!isOverUpper && speed < 0)){
          let newScrollPos = getMomentum(axis);
          const scrollPos = this.getScrollPos(axis);
          const boundingPos = this.getBoundingPos(axis, isOverUpper);
          const diff = (scrollPos - newScrollPos);

          if(Math.abs(diff) > momentumMinDistance) {
            newScrollPos = boundingPos - (scrollPos - newScrollPos);
  
            info[axis] = {
              newScrollPos,
              duration: momentumDuration,
              easing: momentumEasing,
            }

          } else {
            info[axis] = {
              newScrollPos: this.getBoundingPos(axis, isOverUpper),
              duration: rebounceDuration * 0.8,
              easing: rebounceEasing ,
            }
          }
        } else{
          const newScrollPos = getOutSideMomentum(axis, isOverUpper);

          if (newScrollPos === this.getScrollPos(axis)){
            info[axis] = {
              newScrollPos: this.getBoundingPos(axis, isOverUpper),
              duration: rebounceDuration * 0.8,
              easing: rebounceEasing ,
            }
          } else {
            info[axis] = {
              newScrollPos,
              duration: decreaseDuration * outsideDurationRatio,
              easing: decreaseEasing,
            }
          }
        }
      } else {
        info[axis] = {
          newScrollPos: (canMove && momentum) ? getMomentum(axis) : this.getScrollPos(axis),
          duration: momentumDuration,
          easing: momentumEasing,
        }
      }
    });

    // console.log(info)

    let eventInfo = {
      ...info,
      defaultPrevented: this.defaultPrevented,
      callback: undefined
    };

    this.trigger('onDragEnd', eventInfo);

    ['x', 'y'].forEach(axis => {
      const axisInfo = eventInfo[axis];

      if(axisInfo.newScrollPos !== this.getScrollPos(axis)) {
        this.setupScroll(axis, axisInfo.newScrollPos, {
          duration: axisInfo.duration, 
          easing: axisInfo.easing
        });
      }
    });

    this.animater.play({
      callback: eventInfo.callback
    });
  },

  _doAnimation(axis, delta, distance, {
    duration,
    easing,
    currentFrame,
    checkBounding = true
  } = {}) {
    const {
      bounceX,
      bounceY,
      delegateAnimation
    } = this.options;
    const bounce = axis === 'x' ? bounceX : bounceY;
    const bounceUpper = utils.isArray(bounce) ? bounce[0] : bounce;
    const bounceLower = utils.isArray(bounce) ? bounce[1] : bounce;

    this.setScrollPos(axis, this.getScrollPos(axis) + delta);

    const frame = new Frame({
      begin: 0,
      end: distance,
      handler: (value, oldValue) => {
        const scrollPos = this.getScrollPos(axis);
        let delta = this.decimal(value - oldValue);
        let delegated = false;
        
        // 委托
        if(delta !== 0 && delegateAnimation) {
          const delegateInfo = delegateAnimation.call(this, axis, delta);

          if( delegateInfo) {
            let consumedDelta = 0;
            if(delegateInfo.scrollView.options.onDelegateAnimation) {
              consumedDelta = delegateInfo.scrollView.options.onDelegateAnimation.call(delegateInfo.scrollView, delegateInfo.axis, delegateInfo.delta);
      
              if(consumedDelta) {
                delta -= consumedDelta;
                // console.log('consumedDelta', axis, this.id, consumedDelta);
  
                console.log(this.wrapper.className, 'delegate',  delegateInfo.scrollView.wrapper.className, delta);
                delegateInfo.scrollView.animationDelegating = true;
                delegateInfo.scrollView._doAnimation(delegateInfo.axis, consumedDelta, distance, {
                  duration,
                  easing,
                  currentFrame: frame.current + 1,
                  checkBounding: true
                });
    
                delegateInfo.scrollView.animater.play();
                delegated = true;
              }
            }
      
          }
        }

        let newScrollPos = this.decimal(this.getScrollPos(axis) + delta);

        // console.log('checkBounding',checkBounding, newScrollPos);
        if (
          checkBounding &&
          (
            (!this.isOverUpperBounding(axis) && this.isOverUpperBounding(axis, newScrollPos)) ||
            (!this.isOverLowerBounding(axis) && this.isOverLowerBounding(axis, newScrollPos))
          )
        ) {

          let isOverUpper = this.isOverUpperBounding(axis, newScrollPos);
          let isOverLower = this.isOverLowerBounding(axis, newScrollPos);
          let boundingPos = this.getBoundingPos(axis, isOverUpper);

          if ((isOverUpper && bounceUpper) || (isOverLower && bounceLower)) {
            newScrollPos = (newScrollPos - boundingPos) * this.options.resistanceFactor + boundingPos; // 对超过边界的delta缩减
            this.setScrollPos(axis, newScrollPos);
            
            const delta = newScrollPos - scrollPos;
            const speed = delta / aF.mspf;
            const distance = this.getMomentum(speed, this.options.decreaseDuration, this.options.resistanceFactor * this.options.resistanceMomentumFactor);

            // 当distance为0时，直接结束滚动
            if(distance === 0) {
              this.setScrollPos(axis, boundingPos);
              this.animater.remove(axis);
            } else {
              this.setupDecrease(axis, newScrollPos + distance, boundingPos, isOverUpper);
            }
          } else {
            this.setScrollPos(axis, boundingPos);
            this.animater.remove(axis);
          }
        } else {
          this.setScrollPos(axis, newScrollPos);
        }

        if(delegated) {
          this.animater.remove(axis);
        }
      },
      onLastFrame: () => {
        if(checkBounding) {
          this.setupBounce(axis);
        }
      },
      duration: duration,
      easing: easing,
      index: currentFrame,
    });

    this.animater.add(axis, frame);
  },

  setupScroll(
    axis,
    endPos, 
    {
      duration,
      easing,
      currentFrame,
      checkBounding = true
    } = {}
  ) {
    if(this.animationDelegating) return;
    const distance = this.decimal(endPos - this.getScrollPos(axis));

    this._doAnimation(axis, 0, distance, {
      duration,
      easing,
      currentFrame,
      checkBounding
    });
  },

  setupDecrease(axis, end, boundingPos, isOverUpper, {
    duration = this.options.decreaseDuration,
    easing = this.options.decreaseEasing
  } = {}) {
    let maxDistane = this[axis === 'x' ? 'wrapperWidth' : 'wrapperHeight'] * this.options.resistancePercentForMaxSizeLimit;
    let maxBoundingPos = isOverUpper ? -maxDistane + boundingPos : maxDistane + boundingPos;

    end = isOverUpper ? Math.max(end, maxBoundingPos) : Math.min(end, maxBoundingPos);
    
    console.log('Decrease', this.wrapper.className);
    this.setupScroll(axis, end, {
      duration,
      easing
    });
  },

  setupBounce(axis, {
    duration = this.options.rebounceDuration,
    easing = this.options.rebounceEasing
  } = {}) {
    
    let end;

    if (this.isOverUpperBounding(axis)) {
      end = this.getBoundingPos(axis, true);
    } else if (this.isOverLowerBounding(axis)) {
      end = this.getBoundingPos(axis, false);
    } else {
      return;
    }

    console.log('Bounce');
    this.setupScroll(axis, end, {
      duration,
      easing
    });

  }
}