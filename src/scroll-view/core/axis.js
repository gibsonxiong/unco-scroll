// class Axis {
// 	constructor(axis, content, wrapper){
// 		this.axis = axis;
// 		this.content = content;
// 		this.wrapper = wrapper;

// 		this.wrapperSize = 0;
// 		this.orignalSize = 0;
// 		this.size = 0;
// 		this.scale = 1;
// 		this.scrollPos = 0;
// 		this.minScrollPos = 0;
// 		this.maxScrollPos = 0;
// 		this.originPos = 0;

// 		this.anim = null;

// 		this.refresh(true);
// 	}

// 	refresh(reflow) {
// 		const { axis } = this;

// 		if (reflow) {
// 			this.wrapperSize = axis === 'x' ? this.wrapper.clientWidth : this.wrapper.clientHeight;
// 			this.orignalSize = axis === 'x' ? this.content.scrollWidth : this.content.scrollHeight;
// 		}
// 		this.size = this.orignalSize * this.scale;

// 		this.minScrollPos = 0;
// 		this.maxScrollPos = (this.size <= this.wrapperSize) ? this.minScrollPos : this.size - this.wrapperSize;
// 	}

// 	move(delta){
// 		let { scrollPos, minScrollPos, maxScrollPos, wrapperSize} = this;
// 		let bounce = true;
// 		let newScrollPos = scrollPos + delta;
// 		let resistanceFactor = 0.55;
// 		let maxSizeForOver = wrapperSize * 0.5;

// 		if (this.isOverBoundary(newScrollPos)) {
			
// 			let isOverMinBoundary = this.isOverMinBoundary(newScrollPos);
// 			let isOverMaxBoundary = this.isOverMaxBoundary(newScrollPos);
// 			let bounceMin = bounce instanceof Array ? bounce[0] : bounce;
// 			let bounceMax = bounce instanceof Array ? bounce[1] : bounce;

// 			if((isOverMinBoundary && bounceMin) || (isOverMaxBoundary && bounceMax)){
// 				//边界处理
// 				if(isOverMinBoundary && !this.isOverMinBoundary(scrollPos)){
// 					delta -= minScrollPos - scrollPos;
// 					scrollPos = minScrollPos;
// 				}else if(isOverMaxBoundary && !this.isOverMaxBoundary(scrollPos)){
// 					delta -= maxScrollPos - scrollPos;
// 					scrollPos = maxScrollPos;
// 				}
// 				newScrollPos = scrollPos + delta;

// 				let overDelta = isOverMinBoundary ? (newScrollPos - minScrollPos) : (newScrollPos - maxScrollPos);
// 				let ratio = Math.max((maxSizeForOver - Math.abs(overDelta)) / maxSizeForOver, 0);

// 				newScrollPos = scrollPos + delta * resistanceFactor * ratio;
// 			}else{
// 				newScrollPos = isOverMinBoundary ? minScrollPos : maxScrollPos;
// 			}
			
// 		}
// 		this.scrollPos = newScrollPos;
// 	}

// 	animate(end, callback, duration = scrollDuration, easing = scrollEasing){
// 		const begin = this.scrollPos;
		
// 		this.anim && this.anim.stop();
// 		this.anim = new Frame({
// 			handler: (progress) => {
// 				this.scrollPos = progress * (end - begin) + begin;
// 				callback();
// 			},
// 			duration: duration,
// 			easing: easing,
// 		});

// 		this.anim.play();
// 	}

// 	stop(){
// 		this.anim && this.anim.stop();
// 	}

// 	bounce(callback){
// 		const begin = this.scrollPos;
// 		const end;

// 		if (this.isOverMinBoundary()) {
// 			end = this.minScrollPos;
// 		} else if (this.isOverMaxBoundary()) {
// 			end = this.maxScrollPos;
// 		} else {
// 			return;
// 		}

// 		this.animate(end, callback);
// 	}

// 	isOverMinBoundary(scrollPos = this.scrollPos, contain){
// 		if (contain) {
// 			return scrollPos <= this.minScrollPos;
// 		} else {
// 			return scrollPos < this.minScrollPos;
// 		}
// 	}

// 	isOverMaxBoundary(scrollPos = this.scrollPos, contain){
// 		if (contain) {
// 			return scrollPos >= this.maxScrollPos;
// 		} else {
// 			return scrollPos > this.maxScrollPos;
// 		}
// 	}

// 	isOverBoundary(scrollPos = this.scrollPos, contain){
// 		return this.isOverMinBoundary(scrollPos, contain) || this.isOverMaxBoundary(scrollPos, contain);
// 	}
// }