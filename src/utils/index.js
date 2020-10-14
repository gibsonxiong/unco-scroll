/* eslint-disable */
const class2type = {};
const toString = class2type.toString;

function isWindow(obj) {
	// window.window === window;
	return obj != null && obj === obj.window;
}

function toType(obj) {
	if (obj == null) {
		return obj + "";
	}
	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[toString.call(obj)] || "object" :
		typeof obj;
}

function isArrayLike(obj) {
	//  是否存在length 属性
	const length = !!obj && "length" in obj && obj.length,
		type = toType(obj);
	// 排除function window 
	if (type === "function" || isWindow(obj)) {
		return false;
	}
	// 数组判断： type === "array"  类数组判断：存在length属性值； length值为数字且大于0； obj[length - 1] 存在； 
	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && (length - 1) in obj;
}

function inArray(elem, arr, i) {
	return arr == null ? false : Array.prototype.indexOf.call(arr, elem, i) !== -1;
}

function each(obj, callback) {
	let length, i = 0;

	if (isArrayLike(obj)) {
		length = obj.length;
		for (; i < length; i++) {
			if (callback.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}
	} else {
		for (i in obj) {
			if (callback.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}
	}

	return obj;
}

function clone(obj) {
	var o;
	if (typeof obj == "object") {
		if (obj === null) {
				o = null;
		} else {
				if (obj instanceof Array) {
						o = [];
						for (var i = 0, len = obj.length; i < len; i++) {
								o.push(clone(obj[i]));
						}
				} else {
						o = {};
						for (var j in obj) {
								o[j] = clone(obj[j]);
						}
				}
		}
  } else {
      o = obj;
  }
  return o;
 }

function extend(target, ...source) {
	if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
	}

	var to = Object(target);

	for (var index = 0; index < source.length; index++) {
		var nextSource = source[index];

		if (nextSource !== null && nextSource !== undefined) { 
			for (var nextKey in nextSource) {
				// Avoid bugs when hasOwnProperty is shadowed
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey) && nextSource[nextKey] !== undefined) {
					to[nextKey] = clone(nextSource[nextKey]);
				}
			}
		}
	}
	return to;
}


function throttling(handler, ctx, delay) {
	delay = delay != null ? delay : 200;
	let timer = null;

	return function () {
		timer && clearTimeout(timer);
		timer = setTimeout(function () {
			handler.call(ctx);
		}, delay);
	}
}

function copyProperties(target, source) {
	for (let key of Object.keys(source)) {
		let desc = Object.getOwnPropertyDescriptor(source, key);
		Object.defineProperty(target, key, desc);
	}
}

function isArray(array) {
	return array && array.constructor === Array;
}

export default {
	inArray,
	isArray,
	isArrayLike,
	each,
	extend,
	throttling,
	copyProperties,
}