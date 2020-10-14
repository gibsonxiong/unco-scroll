/* eslint-disable */
import {
    getDistance,
    getCenterPoint
} from './utils';

export default class Pinch {
    constructor(touch, options) {
        this.touch = touch;
        this.options = options;
    }

    handleStart() {
        if (this.inited || this.touch.fingers < 2) return;

        const point1 = this.touch.ongoingTouches[0];
        const point2 = this.touch.ongoingTouches[1];
        const center = getCenterPoint(point1, point2);
        const distance = getDistance(point1, point2);
        
        this.inited = true;
        this.startDistance = distance;
        this.prevCenter = center;
        this.first = true;
    }

    handleMove(event) {
        if (!this.inited || this.touch.fingers < 2) {
            return;
        }

        const point1 = this.touch.ongoingTouches[0];
        const point2 = this.touch.ongoingTouches[1];
        const center = getCenterPoint(point1, point2);
        const distance = getDistance(point1, point2);
        const scale = distance / this.startDistance;
        const deltaX = center.x - this.prevCenter.x ;
        const deltaY = center.y - this.prevCenter.y ;

        const eventObj = {
            nativeEvent: event,
            centerX: center.x,
            centerY: center.y,
            deltaX,
            deltaY,
            distance,
            scale,
        };
        
        if(this.first){
            this.touch.trigger('onPinchStart', eventObj);
            this.first = false;
        }else {
            this.touch.trigger('onPinch', eventObj);
        }

        this.prevCenter = center;
    }

    handleEnd(event) {
        if (!this.inited || this.touch.fingers > 2) {
            return;
        }

        const eventObj = {
            nativeEvent: event
        };

        this.touch.trigger('onPinchEnd', eventObj);

        this.inited = false;
    }
}