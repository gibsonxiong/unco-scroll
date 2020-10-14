/* eslint-disable */
import utils from './utils';
import cache from './cache';

const CACHE_KEY = 'events';
const NAMESPCE_FLAG = '.';


class Observable {
	/*
	* param obj {Object} 观察的对象
	* param type {Mixed} 
	*/
	static _innerOn(obj, type, handler, once, prepend) {
		if (type == null) {
			return;
		}

		// type 为 { onClick:function(e){},onTouch:function(e){} }
		// handler 为 null
		if (isObject(type)) {
			prepend = once; //因为handler参数不用输，所有参数退一格
			once = handler;
			for (let t in type) {
				Observable._innerOn(obj, t, type[t], once, prepend);
			}
			return;
		}

		//type 为 'onClick onTouch'
		if (type.indexOf(' ') !== -1) {
			each(type.split(' '), function (t) {
				Observable._innerOn(obj, t, handler, once, prepend);
			});
			return;
		}

		// type 为 ['onClick','onSubmit'] , handler 为 function(){}
		// type 为 ['onClick','onSubmit'] , handler 为 {'onClick':function(){} ,'onSubmit':function(){} }
		if (isArray(type)) {
			each(type, function (t) {
				if (isObject(handler)) {
					Observable._innerOn(obj, t, handler[t], once, prepend);
				} else {
					Observable._innerOn(obj, t, handler, once, prepend);
				}
			});
			return;
		}

		//handler 为 [ function(){} , function(){} ]
		if (isArray(handler)) {
			for (let i = 0, len = handler.length; i < len; i++) {
				Observable._innerOn(obj, type, handler[i], once, prepend);
			}
			return;
		}

		if (!type || !handler) {
			return;
		}

		const events = cache.getAndIfNullSetDefault(obj, CACHE_KEY, {});

		const namespace = [];
		const parts = type.split(NAMESPCE_FLAG);

		if (parts.length > 1) {
			type = parts[0];

			for (let i = 1; i < parts.length; i++) {
				namespace.push(parts[i]);
			}
		}

		let handlers = events[type] = events[type] || [];

		//如果once
		if (once) {
			let original = handler;
			handler = function () {
				Observable.off(obj, type, handler);
				original.apply(obj, arguments);
			}
			handler._original = original;
		}

		let handleObj = {
			handler: handler,
			namespace: namespace,
		};

		if (prepend) {
			handlers.unshift(handleObj);
		} else {
			handlers.push(handleObj);
		}
	}

	static _innerOff(obj, type, handler) {
		const events = cache.get(obj, CACHE_KEY);

		if (events == null) {
			return;
		}

		// off({}) ,全部事件清除
		if (type === undefined) {
			cache.set(obj, CACHE_KEY, null);
			return;
		}

		//off({},'.m')  清除命名空间为m的事件
		if (type.indexOf(NAMESPCE_FLAG) === 0) {
			each(events, function (_handler, key) {
				Observable.off(obj, key + type, _handler);
			});
			return;
		}

		//off({},'onClick');所有onClick事件清除
		if (type.indexOf(NAMESPCE_FLAG) === -1 && handler === undefined) {
			events[type] = [];
			return;
		}
		//以上是做函数多态的处理

		const parts = type.split(NAMESPCE_FLAG);
		type = parts[0];
		const namespace = parts.splice(1);

		let handlers = events[type] = events[type] || [];

		if (handlers.length === 0) {
			return;
		}

		for (let i = 0, len = handlers.length; i < len; i++) {

			if (inNamespace(namespace, handlers[i].namespace)) {

				//当没有handler,type为'onClick.m'的情况,把onClick命名空间为m的所有事件移除'
				if (!handler) {
					handlers.splice(i, 1);
					i--;
					len--;

				} else if (handlers[i].handler === handler) {
					handlers.splice(i, 1);
					break;
				}
			}
		}
	}

	static on(obj, type, handler, options) {
		options = utils.extend({
			prepend: false,
			once: false,
		}, options);
	
		Observable._innerOn(obj, type, handler, options.prepend, options.once);
	
		return this;
	}
	
	static off(obj, type, handler) {
		Observable._innerOff(obj, type, handler);
	
		return this;
	}
	
	
	//返回值为是否阻止默认事件
	static trigger(obj, type, e) {
	
		const events = cache.get(obj, CACHE_KEY);
	
		//trigger({},'.m')  激活所有命名空间为m的事件
		if (type.indexOf(NAMESPCE_FLAG) === 0) {
			each(events, function (a, _type) {
				Observable.trigger(obj, _type + type, e);
			});
			return false; //e.isDefaultPrevented();
		}
	
		e = e || {};
		// e.sender = e.sender || obj; //事件的发送者
		// e.isContinued = returnTrue; //为false时，停止执行队列中的回调函数
		// e.stopContinuation = stopContinuation; //设置isContinued返回为false
		// e.isDefaultPrevented = returnFalse; //为true时，不执行事件的默认事件（默认事件是自定义的）
		// e.preventDefault = preventDefault; //设置isDefaultPrevented返回为true
	
		if (events == null) {
			return false;
		}
	
		const parts = type.split(NAMESPCE_FLAG);
		type = parts[0];
		const namespace = parts.splice(1);
	
		let handlers = events[type] = events[type] || [];
	
		if (handlers.length === 0) {
			return false;
		}
	
		handlers = handlers.slice(0);
	
		for (let i = 0, len = handlers.length; i < len; i++) {
			if (inNamespace(namespace, handlers[i].namespace)) {
				const handler = handlers[i].handler;
				// if (e.isContinued()) {
					handler.call(obj, e);
				// }
			}
		}
	
		return false; // e.isDefaultPrevented();
	}

	static getEvents(obj) {
		return cache.get(obj, CACHE_KEY);
	}

	static getEventsByType(obj, type) {
		const events = this.getEvents(obj);
		
		return events[type] = events[type] || [];
	}

	constructor (types, handlers) {
		this.on(types, handlers);
	}


	on (type, handler, options) {
		Observable.on(this, type, handler, options);

		return this;
	}

	off (type, handler) {
		Observable.off(this, type, handler);

		return this;
	}

	trigger (type, e) {
		return Observable.trigger(this, type, e);
	}

};


function isObject(obj) {
	return !!obj && obj.constructor == Object;
}

function isArray(obj) {
	return !!obj && obj.constructor == Array;
}

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function each(obj, callback) {
	utils.each(obj, function (i, val) {
		return callback(val, i);
	})
}

function inNamespace(namespace1, namespace2) {
	if (namespace1.length === 0) {
		return true;
	}

	for (let i = 0, len = namespace1.length; i < len; i++) {
		if (utils.inArray(namespace1[i], namespace2)) {
			return true;
		}
	}
	return false;
}

function stopContinuation() {
	this.isContinued = returnFalse;
}

function preventDefault() {
	this.isDefaultPrevented = returnTrue;
}


export default Observable;