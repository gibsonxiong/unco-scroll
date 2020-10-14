/* eslint-disable */
let max = Math.max;
let setTimeout = window.setTimeout;
let fps = 60;                            //一秒有多少帧
let mspf = parseFloat( 1000 / fps, 2);   //一帧有多少毫秒
let vendors = ['ms', 'moz', 'webkit', 'o'];
let requestAF = window.requestAnimationFrame;
let cancelAF = window.cancelAnimationFrame;

for (let x = 0; x < vendors.length && !(requestAF || cancelAF); ++x) {
	requestAF = window[vendors[x] + 'RequestAnimationFrame'];
	cancelAF = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!requestAF) {
	requestAF = (function () {
		let lastTime = 0;

		return function (callback) {
			let currTime = +new Date();
			let timeToCall = max(0, mspf - (currTime - lastTime));

			let id = setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);

			lastTime = currTime + timeToCall;
			return id;
		}
	})();

}

if (!cancelAF) {
	cancelAF = function (id) {
		clearTimeout(id);
	};
}


export default {
	fps: fps,
	mspf,

	request: requestAF.bind(window),
	cancel: cancelAF.bind(window)
}
