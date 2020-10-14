/* eslint-disable */
import './style.scss';
import utils from '../../utils';
import domUtils from '../../utils/dom-utils';


// 圆环周长
const circleLength = 128.8052987971815;

class PullHint {
	render({
		direction,
		pullOffset
	}) {
		this.container = document.createElement('div');
		this.container.className = `pull-loader ${direction}`;
		if (direction === 'top') {
			this.container.style.height = `${pullOffset}px`;
			this.container.style.top = `${-pullOffset}px`;
		} else if (direction === 'bottom') {
			this.container.style.height = `${pullOffset}px`;
			this.container.style.bottom = `${-pullOffset}px`;
		} else if (direction === 'left') {
			this.container.style.width = `${pullOffset}px`;
			this.container.style.left = `${-pullOffset}px`;
		} else if (direction === 'right') {
			this.container.style.width = `${pullOffset}px`;
			this.container.style.right = `${-pullOffset}px`;
		}


		this.wrap = document.createElement('div');
		this.wrap.className = 'pull-loader-wrap';
		this.container.appendChild(this.wrap);

		this.createIcon();

		this.hintText = document.createElement('span');
		this.hintText.className = 'pull-loader-text';
		this.wrap.appendChild(this.hintText);

		return this.container;
	}

	createIcon() {
		const svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

		svgDom.setAttribute('width', '44');

		svgDom.setAttribute('height', '44');

		svgDom.setAttribute('viewBox', '0 0 44 44');

		svgDom.setAttribute('class', 'pull-loader-icon');


		this.wrap.appendChild(svgDom);


		this.polygonDom = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

		this.polygonDom.setAttribute('cx', '22');

		this.polygonDom.setAttribute('cy', '22');

		this.polygonDom.setAttribute('r', '20.5');

		this.polygonDom.setAttribute('stroke', 'black');

		this.polygonDom.setAttribute('stroke-width', '2');

		this.polygonDom.setAttribute('fill', 'none');

		this.polygonDom.setAttribute('stroke-dasharray', '0 128.8052987971815');

		this.polygonDom.setAttribute('stroke-dashoffset', '32.20132469929538');


		this.polygonDom.setAttribute('class', 'circle');

		svgDom.appendChild(this.polygonDom);
	}

	changeStatusText(text) {
		this.hintText.innerText = text || '';
	}

	changeProgress(progress) {
		const p = circleLength * progress;
		this.polygonDom.setAttribute('stroke-dasharray', `${p} ${circleLength - p}`);

	}

	loading() {
		this.polygonDom.setAttribute('stroke-dasharray', `96.60397409788612 32.20132469929538`);
		this.polygonDom.innerHTML = `
			<animateTransform
			attributeName="transform"
			attributeType="XML"
			type="rotate"
			from="0 22 22"
			to="360 22 22"
			dur="750ms"
			repeatCount="indefinite"
		/>
	`;
	}

	stopLoading() {
		this.polygonDom.setAttribute('stroke-dasharray', `0 0`);
		this.polygonDom.innerHTML = ``;
	}

	show() {
		domUtils.setStyle(this.wrap, 'display', '');
	}

	hide() {
		domUtils.setStyle(this.wrap, 'display', 'none');
	}
}

class PullLoader {
	static _defaults = {
		hint: PullHint,
		pullOffset: 80,

		defaultText: '',
		readyText: '',
		loadingText: '',

		onUpdateStatus: function () {},
		onProgress: function () {},
		onLoad: function () {},
		onDisable: function () {},
		onEnable: function () {},
	}

	constructor(direction, scrollView, options) {
		options = this.options = utils.extend({}, this.constructor._defaults, options);

		this.direction = direction;
		this.scrollView = scrollView;

		this.disabled = false;
		this.status = '';

		this.pullPos = this.getPullPos();

		this.hint = new PullHint();

		this.scrollView.wrapper.appendChild(this.hint.render({
			direction: this.direction,
			pullOffset: this.options.pullOffset
		}));

		this._bindEvent();
	}

	getScrollPos() {
		const map = {
			'top': 'scrollY',
			'bottom': 'scrollY',
			'left': 'scrollX',
			'right': 'scrollX'
		};
		return this.scrollView[map[this.direction]];
	}

	getBoundaryPos() {
		const map = {
			'top': 'minScrollY',
			'bottom': 'maxScrollY',
			'left': 'minScrollX',
			'right': 'maxScrollX'
		};

		return this.scrollView[map[this.direction]];
	}

	_bindEvent() {
		this.scrollView.on('onScroll', () => {
			let scrollPos = this.getScrollPos();
			this.positionHint(scrollPos);

			if (this.disabled) return;
			if (this.isLoading()) return;
			if (this.status === 'complete') return;

			let boundaryPos = this.getBoundaryPos();

			let percent = (scrollPos - boundaryPos) / (this.pullPos - boundaryPos);

			percent = Math.max(0, Math.min(1, percent));

			this.hint.changeProgress(percent);

			this.options.onProgress.call(this, {
				percent: percent
			});

			if (this.checkReady(scrollPos)) {
				this.updateStatus('ready');
			} else {
				this.updateStatus('default');
			}
		});

		this.scrollView.on('onDragEnd', () => {
			if (this.disabled) return;

			if (this.status === 'ready') {
				this.ready();
			}
		});

		this.scrollView.on('onRefresh', () => {
			this.pullPos = this.getPullPos();
		});
	}

	positionHint(scrollPos) {
		if (this.direction === 'top') {
			const offset = scrollPos;
			// if (offset < 0) {
				this.hint.container.style.transform = `translateY(${-offset}px)`;
			// } else {
			// 	this.hint.container.style.transform = `translateY(0px)`;
			// }
		}
		else if (this.direction === 'bottom') {
			const offset = scrollPos + this.scrollView.wrapperHeight - this.scrollView.contentHeight;
			// if (offset > 0) {
				this.hint.container.style.transform = `translateY(${-offset}px)`;
			// } else {
			// 	this.hint.container.style.transform = `translateY(0px)`;
			// }
		}
		else if (this.direction === 'left') {
			const offset = scrollPos;
			// if (offset < 0) {
				this.hint.container.style.transform = `translateX(${-offset}px)`;
			// } else {
			// 	this.hint.container.style.transform = `translateX(0px)`;
			// }
		}
		else if (this.direction === 'right') {
			const offset = scrollPos + this.scrollView.wrapperWidth - this.scrollView.contentWidth;
			// if (offset > 0) {
				this.hint.container.style.transform = `translateX(${-offset}px)`;
			// } else {
			// 	this.hint.container.style.transform = `translateX(0px)`;
			// }
		}
	}

	getPullPos() {
		return this.direction === 'top' || this.direction === 'left' ? this.getBoundaryPos() - this.options.pullOffset : this.getBoundaryPos() + this.options.pullOffset;
	}

	checkReady(pos) {
		return this.direction === 'top' || this.direction === 'left' ? pos <= this.pullPos : pos >= this.pullPos;
	}

	updateStatus(status) {
		if (this.status !== status) {
			this.hint.changeStatusText(this.options[`${status}Text`]);
		}

		this.status = status;

		this.options.onUpdateStatus.call(this, {
			status: status
		});
	}

	ready() {
		const map = {
			'top': 'minScrollY',
			'bottom': 'maxScrollY',
			'left': 'minScrollX',
			'right': 'maxScrollX'
		};

		if (this.disabled) return;

		this.scrollView.eventFlag = 'pullloader/ready';
		this.scrollView.setOptions({
			[map[this.direction]]: this.pullPos
		});
		this.scrollView.eventFlag = undefined;
		// setTimeout(() => {
		// 	this.scrollView.scrollTo(undefined, this.pullPos);
		// }, 0);

		this.updateStatus('loading');

		this.hint.loading();

		this.options.onLoad.call(this, this);
	}

	complete(text, delay = 0, toDisable) {
		// if (this.disabled) return;

		this.updateStatus('complete');

		this.hint.changeStatusText(text);

		this.hint.stopLoading();

		const map = {
			'top': 'minScrollY',
			'bottom': 'maxScrollY',
			'left': 'minScrollX',
			'right': 'maxScrollX'
		};

		this.scrollView.eventFlag = 'pullloader/complete';
		this.scrollView.setOptions({
			[map[this.direction]]: (val) => val  + ((this.direction === 'top' || this.direction === 'left') ? -this.options.pullOffset : this.options.pullOffset)
		});
		this.scrollView.refresh();
		this.scrollView.eventFlag = undefined;
		
		if(delay > 0 ){
			setTimeout(()=> {
				this.scrollView.eventFlag = 'pullloader/complete';
				this.scrollView.setOptions({
					[map[this.direction]]: null
				});
				this.scrollView._refresh(false, false);
				this.scrollView.eventFlag = undefined;
				this.scrollView.bound({
					duration: 400,
					callback: () => {
						this.updateStatus('default');
						if(toDisable){
							this.disable();
						}
					}
				});
			}, delay);
		}else {
			this.scrollView.eventFlag = 'pullloader/complete';
			this.scrollView.setOptions({
				[map[this.direction]]: null
			});
			this.scrollView.refresh();
			this.scrollView.eventFlag = undefined;

			this.scrollView.bound({
				duration: 400,
				callback: () => {
					this.updateStatus('default');
				}
			});
		}

	}

	isLoading() {
		return this.status === 'loading';
	}

	disable() {
		if (this.disabled) return;
		this.disabled = true;
		this.hint.hide();
	}

	enable() {
		if (!this.disabled) return;
		this.disabled = false;
		this.hint.show();
	}

	open() {
		const pullPos = this.getPullPos();
		this.scrollView.scrollTo(undefined, pullPos, {
			checkBounding: false,
			callback: () => {
				this.ready();
			}
		});


	}
}

export class TopPullLoader extends PullLoader {
	static pluginName = 'topPull';
	constructor(...args) {
		super('top', ...args);
	}
}

export class BottomPullLoader extends PullLoader {
	static pluginName = 'bottomPull';
	constructor(...args) {
		super('bottom', ...args);
	}
}

export class LeftPullLoader extends PullLoader {
	static pluginName = 'leftPull';
	constructor(...args) {
		super('left', ...args);
	}
}

export class RightPullLoader extends PullLoader {
	static pluginName = 'rightPull';
	constructor(...args) {
		super('right', ...args);
	}
}


export default {
	TopPullLoader,
	BottomPullLoader,
	LeftPullLoader,
	RightPullLoader
};