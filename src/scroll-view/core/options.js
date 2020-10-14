import support from '../../support';

let options = {
	axis: 'xy',

	scrollNeedOverflow: true,  // 滚动是否需要内容溢出

	startX: null,
	startY: null,

	lockAxisAngle: 45,
	freeMode: true,

	resistanceFactor: 0.55, //超出界限阻力因素
	resistancePercentForMaxSizeLimit: 0.6,
	
	resistanceMomentumFactor: 0.65, 
	
	momentum: true,
	momentumMinDistance: 50,  //最小位移
	momentumFactor: 0.21,
	momentumEasing: 'cubic-bezier(0.18, 0.72, 0.46, 1)',
	momentumDuration: 2500,
	
	decreaseEasing: 'cubic-bezier(0.15, 0.1, 0.4, 0.94)',
	decreaseDuration: 100,

	rebounceEasing: 'cubic-bezier(0.28, 0.8, 0.5, 0.94)',
	rebounceDuration: 500,
	
	scrollEasing: 'quad-ease-out',
	scrollDuration: 300,

	alignX: 'start',
	alignY: 'start',

	accelerateByFastPan: true,    //快速滑动加速

	minScrollX: null,
	maxScrollX: null,
	minScrollY: null,
	maxScrollY: null,

	bounceX: true,
	bounceY: true,

	boundingReleaseX: false,
	boundingReleaseY: false,

	use3d: false,

	zoom: false,
	zoomStart: 1,
	zoomMin: 1,
	zoomMax: 3,

	allowTouch: true
};

if(support.platform.android) {
	options.use3d = true;
	// options.momentumEasing =  'cubic-bezier(0.16, 1, 0.4, 1)';
	options.momentumFactor = 0.32;
}

export default options;