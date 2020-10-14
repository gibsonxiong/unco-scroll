/* eslint-disable */
import {getTime, getDistance, getAngle, getFingers } from './utils';
import support from '../support';

export default  class Pan {
    constructor(touch, options) {
        this.touch = touch;
        this.options = options;
    }

    handleStart() {
        if(this.inited) return;

        this.inited = true;
        this.first = true;
  
        this.speedX = 0;
        this.speedY = 0;
    }

    handleMove(event) {
        if(!this.inited) return;

        if(!this.options.multi && this.touch.fingers > 1) return;

        let {
            lockAxisAngle
        } = this.options;

        let maxX = 0;
        let minX = 0;
        let maxY = 0;
        let minY = 0;

        this.touch.ongoingTouches.forEach(touch=>{
            if( touch.deltaX > 0 ){
                maxX = Math.max(maxX, touch.deltaX);
            }

            if( touch.deltaX < 0 ){
                minX = Math.min(minX, touch.deltaX);
            }

            if( touch.deltaY > 0 ){
                maxY = Math.max(maxY, touch.deltaY);
            }

            if( touch.deltaY < 0 ){
                minY = Math.min(minY, touch.deltaY);
            }
        });

        let deltaX = maxX + minX;
        let deltaY = maxY + minY;
        let movingAxis = '';

        const angle = getAngle({ x:deltaX, y:deltaY }, {x: 0, y: 0});

        if( (0 <=  angle && angle <= lockAxisAngle) ||  (( 180 - lockAxisAngle ) <= angle && angle <= 180)) 
        {
            movingAxis = 'x';
        }else{
            movingAxis = 'y';
        }
        
        let speedX = this.touch.deltaTime === 0 ? 0 : deltaX / this.touch.deltaTime;
        let speedY = this.touch.deltaTime === 0 ? 0 : deltaY / this.touch.deltaTime;

        if ((speedX > 0 &&  this.speedX < 0) || (speedX < 0 &&  this.speedX > 0)){  // 反方向
            this.speedX = speedX;
        } 
        else if ( Math.abs(speedX) < Math.abs(this.speedX) * 0.2 && !support.platform.android){    // 安卓Touch事件数据不是很准确，所以不做优化
            this.speedX = speedX;
        } 
        else {
            this.speedX = (speedX + this.speedX) / 2;
        }

        if ((speedY > 0 &&  this.speedY < 0) || (speedY < 0 &&  this.speedY > 0)){
            this.speedY = speedY;
        } 
        else if ( Math.abs(speedY) < Math.abs(this.speedY) * 0.2 && !support.platform.android){   // 安卓Touch事件数据不是很准确，所以不做优化
            this.speedY = speedY;
        }
         else {
            this.speedY = (speedY + this.speedY) / 2;
        }


        const eventObj = {
            nativeEvent:event,
            movingAxis,
            deltaX : deltaX,
            deltaY : deltaY,
        };

        if(this.first) {
            this.touch.trigger('onPanStart', eventObj);

            this.first = false;
        } else {
            this.touch.trigger('onPan', eventObj);
        }
    }

    handleEnd(event){
        if(!this.inited || this.touch.fingers > 0){
            return;
        }

        const threshold = 100;
        const minTime = 5;
        const ratio = 1 - Math.min((this.touch.deltaTime - minTime) / threshold, 1);
        // console.log(ratio);
        this.speedX *= ratio;
        this.speedY *= ratio;
        
        // console.log('speedX', this.speedX);
        // console.log('speedY', this.speedY);
        
        const eventObj = {
            nativeEvent: event,
            fastTimesX:1,
            fastTimesY:1,
            speedX: this.speedX,
            speedY: this.speedY
        };
        
        
        this.touch.trigger('onPanEnd', eventObj);

        this.inited = false;
    }
}