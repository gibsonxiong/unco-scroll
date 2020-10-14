/* eslint-disable */

const KEY = '__uuid__';
const newId = createIdDispatcher();
let cacheMap = {};

//生成一个Id分发器
function createIdDispatcher() {
	let uuid = 0;
	return function () {
		return uuid++;
	}
};

//给对象添加一个不可枚举、不可以修改、不可以删除的属性
function notEnumerableExpand(obj, prop, value) {
	Object.defineProperty(obj, prop, {
		value: value,
	});
}

const cache = {
	get(obj, key) {
		let data = this.getAll(obj);
		return data ? data[key] : null;
	},

	set(obj, key, value) {
		let id, data;

		//如果obj没有id，则初始化一个
		if (!this._hasId(obj)) {
			this._setId(obj);
		}

		id = this._getId(obj);
		data = cacheMap[id];

		//如果cache没有该对象的数据，则初始化一个{}
		if (data == null) {
			data = cacheMap[id] = {};
		}

		data[key] = value;
	},

	getAll(obj) {
		let id = this._getId(obj);

		if (cacheMap[id] == null) {
			return null;
		}

		return cacheMap[id];
	},

	getAndIfNullSetDefault(obj, name, _default) {
		if (this.get(obj, name) == null) {
			this.set(obj, name, _default);
			return _default;
		} else {
			return this.get(obj, name);
		}
	},

	_getId(obj) {
		return obj[KEY];
	},

	_setId(obj) {
		notEnumerableExpand(obj, KEY, newId());
	},

	_hasId(obj) {
		return this._getId(obj) != null;
	},

	getIdOrSet(obj) {
		if(!this._hasId(obj)) {
			this._setId(obj);
		}

		return this._getId(obj);
	}
}

window.cache = cache;
window.cacheMap = cacheMap;

// 测试
// let person  ={
// 	name:'haha',
// 	age:16
// };

// let data = cache.getAll(person);
// console.log(data);

// cache.set(person,'height', 20);

// let height = cache.get(person,'height');
// let age = cache.get(person,'age');

// console.log(height, age);


export default cache;