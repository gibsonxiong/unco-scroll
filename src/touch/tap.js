/* eslint-disable */
import { getTime, getDistance } from './utils';

const maxDistance = 10;
const maxPressTime = 300;
const minComboTime = 300;
const minComboDistance = 20;

export default  class Tap {
    constructor(touch, options) {
        this.touch = touch;
        this.options = options;

        this.tapCount = 0;
    }

    getPoint(touch, xName, yName) {
        return {
            x: touch[xName],
            y: touch[yName],
        }
    }

    handleStart(event) {
        if(this.touch.fingers === 1) {
            this.maxFingers = 1;
        } else {
            this.maxFingers = Math.max(this.maxFingers || 0, this.touch.fingers);
        }

        const now = getTime();
        this.startPoint = this.getPoint(event.touches[0], 'pageX', 'pageY');
        this.startTime = now;
        this.lastestPoint = this.getPoint(event.touches[0], 'pageX', 'pageY');
        this.lastestTime = now;
    }

    handleMove(event) {
        this.lastestPoint = this.getPoint(event.touches[0], 'pageX', 'pageY');
        this.lastestTime = getTime();
    }

    handleEnd(event){
        this.lastestPoint = this.getPoint(event.changedTouches[0], 'pageX', 'pageY');
        // console.log('end',  event, this.touch.elem.className, this.lastestTime, this.prevLastTime);
        this.lastestTime = getTime();

        const distance = getDistance(this.lastestPoint, this.startPoint);

        if(distance <= maxDistance && this.lastestTime - this.startTime <= maxPressTime && this.maxFingers === 1) {
            // 判断是否连击
            if (this.tapCount > 0 &&
                this.lastestTime - this.prevLastTime <= minComboTime &&
                getDistance(this.lastestPoint, this.prevLastPoint) <= minComboDistance 
             ) {
                this.tapCount++;
            } else {
                this.tapCount = 1;
            }
            
            this.touch.trigger('onTap', {
                nativeEvent: event,
                x: this.startPoint.x,
                y: this.startPoint.y,
            });

            if(this.tapCount % 2 === 0) {
                this.touch.trigger('onDoubleTap', {
                    nativeEvent: event,
                    x: this.prevStartPoint.x,
                    y: this.prevStartPoint.y,
                });
            }
        }

        this.prevStartPoint = this.startPoint;
        this.prevLastPoint = this.lastestPoint;
        this.prevLastTime = this.lastestTime;

    }
}