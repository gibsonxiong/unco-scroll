/* eslint-disable */
import Observable from './observable';
import cache from './cache';

function getPath(event) {
    const from = event.target;
    const to = event.currentTarget;
    const path = [];

    let parent = from;

    while(parent && parent !== to) {
        path.push(parent);

        parent = parent.parentElement;
    }

    path.push(to);

    return path;
}

export default class DomEvent {
    constructor() {
        this.events = [];
    }

    on(elem, eventType, listener, notNative) {
        if(!elem) return;

        Observable.on(elem, eventType, listener);

        if(notNative !== true) {
            this._addListener(elem, eventType);
        }

        this.events.push({
            elem, 
            eventType,
            listener
        });
    }

    off(elem, eventType, listener, notNative) {
        if(!elem) return;

        // 有delegateListener则取delegateListener
        listener = listener.delegateListener || listener;

        Observable.off(elem, eventType, listener);

        if(notNative !== true) {
            this._removeListener(elem, eventType);
        }

        //
        const index = this.findIndex(elem, eventType, listener);
        if(index > -1) {
            this.events.splice(index, 1);
        }
    }

    delegate(elem, eventType, listener, parentElem) {
        const id = cache.getIdOrSet(elem);
        this.on(parentElem, eventType + '_DElEGATE_' + id , listener, true);

        this._addListener(parentElem, eventType);
    }

    proxy(elem, eventType, listener, childSelector) {
        const childs = elem.querySelectorAll(childSelector);

        childs.forEach(child => {
            this.delegate(child, eventType, listener, elem);
        });
    }

    findIndex(elem, eventType, listener) {
        return this.events.findIndex(event => {
            return event.elem === elem && event.eventType === eventType && event.listener === listener;
        });
    }

    _addListener(elem, eventType) {
        const busTypeKey =  eventType + '_BUS';
        let busEvent = Observable.getEventsByType(elem, busTypeKey)[0];

        if(!busEvent) {
            busEvent = (event)=> {
                // 先处理代理的事件
                const path = getPath(event);

                path.some(pathElem => {
                    const id = cache._getId(pathElem);

                    if(!id) return false;
                    // 取消冒泡
                    if(event.cancelBubble) return true;

                    Observable.trigger(elem, eventType + '_DElEGATE_' + id, event);
                });

                // 处理自身事件
                if(!event.cancelBubble) {
                    Observable.trigger(elem, eventType, event);
                }
            };
            Observable.on(elem, busTypeKey, busEvent);
            elem.addEventListener(eventType, busEvent);
        }

    }

    _removeListener(elem, eventType) {
        const busTypeKey =  eventType + '_BUS';
        const busEvent = Observable.getEventsByType(elem, busTypeKey)[0];
        const eventCount = Observable.getEventsByType(elem, eventType).length;

        if(eventCount === 0 && busEvent) {
            Observable.off(elem, busTypeKey, busEvent.handler);
            elem.removeEventListener(eventType, busEvent.handler);
        }
    }

    destroy() {
        const clone = [...this.events];
        clone.forEach(({elem, eventType, listener}) => {
            this.off(elem, eventType, listener);
        });

        delete this.events;
    }
}