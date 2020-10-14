/* eslint-disable */
import Observable from '../observable';
import DomEvent from '../dom-event';
import {
    newId,
    getTime,
    getFingers
} from './utils';
import utils from '../utils';
import Tap from './tap';
import Pan from './pan';
import Pinch from './pinch';

class Touch extends Observable{
    static _defaults = {
        freeMode: true,
        stopPropagation: false,
        preventDefault: false,
        // preventIOSBoundingBack: true
    };

    static _events = [
        'onInputStart',

        'onTap',

        'onPanStart',
        'onPan',
        'onPanEnd',
        'onSwipe',
        'onTap',
        'onDoubleTap',

        'onPinchStart',
        'onPinch',
        'onPinchEnd'
    ];

    constructor (elem, options) {
        super();
        options = this.options = utils.extend({}, this.constructor._defaults, options);

        this.elem = elem;
        this.id = newId();
        this.elem.touch = this;
        this.gestrue = null;
        this._disabled = false;

        this.domEvent = new DomEvent();
        this.ongoingTouches = [];
        this.on(this.constructor._events, options);

        this.bindEvent();

        this.tap = new Tap(this, options);
        this.pan = new Pan(this, options);
        this.pinch = new Pinch(this, options);
    }

    bindEvent () {
        let {
            preventDefault,
            stopPropagation,
            // preventIOSBoundingBack,
        } = this.options;

        this.elem.addEventListener('touchstart', (e) => {
            if(this._disabled) return;

            // console.log('touchstart', this.elem.className.split(' ')[0], e);

            // // 阻止ios边缘右滑返回
            // if(preventIOSBoundingBack && e.touches[0].pageX <= 20) {
            //     preventDefault = true;
            // }

            stopPropagation && e.stopPropagation();
            preventDefault && e.preventDefault();

            this.handleTouchStart(e);
        }, {
            passive: true,
            capture: false
        });

        this.elem.addEventListener('touchmove', (e) => {
            if(this._disabled) return;
            // console.log('touchmove', this.elem.className.split(' ')[0], e);

            stopPropagation && e.stopPropagation();
            preventDefault && e.preventDefault();
            
            this.handleTouchMove(e);
        });

        this.elem.addEventListener('touchend', (e) => {
            if(this._disabled) return;

            // console.log('touchend', this.elem.className.split(' ')[0], e);
            stopPropagation && e.stopPropagation();
            preventDefault && e.preventDefault();

            this.handleTouchEnd(e);
        }, {
            passive: true,
            capture: false
        });

        this.elem.addEventListener('touchcancel', (e) => {
            if(this._disabled) return;

            // console.log('touchcancel', this.elem.className.split(' ')[0], e);
            stopPropagation && e.stopPropagation();
            preventDefault && e.preventDefault();

            this.handleTouchEnd(e);
        }, {
            passive: true,
            capture: false
        });

    }

    handleTouchStart (event) {
        const touches = event.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            this.ongoingTouches.push(this.copyTouch(touches[i]));
        }

        this.fingers = getFingers(event);
        this.ongoingTime = getTime();

        if(!this.inited){
            this.trigger('onInputStart');
            this.inited = true;
        }

        this.tap.handleStart(event);
        this.pan.handleStart(event);
        this.pinch.handleStart(event);
    }

    handleTouchMove (event) {
        if(!this.inited) return;

        const touches = event.changedTouches;
        const time = getTime();

        this.ongoingTouches.forEach(touch=>{
            let newTouch = [].find.call(touches, t=> t.identifier == touch.identifier);

            if(newTouch){
                newTouch = this.copyTouch(newTouch);
                touch.deltaX = newTouch ? newTouch.x - touch.x : 0;
                touch.deltaY = newTouch ? newTouch.y - touch.y : 0;
                touch.x = newTouch.x;
                touch.y = newTouch.y;
            }else{
                touch.deltaX = 0;
                touch.deltaY = 0;
            }
        });

        this.fingers = getFingers(event);
        this.deltaTime = Math.max(time - this.ongoingTime, 5);
        // console.log('deltaTime', this.deltaTime);
        this.ongoingTime = getTime();

        this.tap.handleMove(event);
        this.pan.handleMove(event);
        this.pinch.handleMove(event);
    }

    handleTouchEnd (event) {
        if(!this.inited) return;

        const touches = event.changedTouches;
        const time = getTime();

        for (let i = 0; i < touches.length; i++) {
            const idx = this.ongoingTouchIndexById(touches[i].identifier);
            this.ongoingTouches.splice(idx, 1);
        }

        this.fingers = getFingers(event);
        this.deltaTime = Math.max(time - this.ongoingTime, 5);
        // console.log('deltaTime end', this.deltaTime);
        this.ongoingTime = getTime();

        this.tap.handleEnd(event);
        this.pan.handleEnd(event);
        this.pinch.handleEnd(event);

        if(this.fingers === 0){
            this.ongoingTouches = [];
            this.trigger('onInputEnd');
            this.inited = false;
        }
    }

    copyTouch({
        identifier,
        clientX,
        clientY
    }) {
        return {
            identifier,
            x: clientX,
            y: clientY
        };
    }

    ongoingTouchIndexById(idToFind) {
        for (let i = 0; i < this.ongoingTouches.length; i++) {
            const id = this.ongoingTouches[i].identifier;

            if (id == idToFind) {
                return i;
            }
        }
        return -1;
    }

    isDisabled () {
        return this._disabled;
    }

    disable () {
        this._disabled = true;
    }

    enable () {
        this._disabled = false;
    }


    destroy () {
        this.domEvent.destroy();
    }
}

const _touches = {};

function on(elem, options) {
    const instance = new Touch(elem);
    const id = instance.id;
    _touches[id] = instance;

    return id;
}

function off(id) {
    const t = _touches[id];
    if (!t) return;

    t.destroy();
}

export {
    on,
    off,
    Touch
};

export default {
    on,
    off,
    Touch
};