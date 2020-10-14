/* eslint-disable */
import utils from '../utils';
import domUtils from '../utils/dom-utils';

export default class Snap {
    static pluginName = 'snap';

    static _defaults = {
        index: 0, 
        duration: 300,
        easing: 'cubic-bezier(0.25, 0, 0.5, 1)',
        selector: '.scroll-snap',
        disabledClassName:'scroll-snap-disabled',
        axis: 'x', // x y
        loop: false, //是否无限循环
        align: 'start', //排列方式 start center end
        firstAlign: null,
        lastAlign: null,
        step: true,
        onlyEdgeBounce:true,  
        autoplay:false,  //是否自动播放
        autoplayInterval: 3000,

        onProgress(){},
        onWillChange(){},
        onChange(){},
    }

    get realIndex() {
        return this.getRealIndex(this.activeIndex);
    }

    constructor(scrollView, options) {
        options = this.options = utils.extend({}, this.constructor._defaults, options);

        this.scrollView = scrollView;
        scrollView.options.axis = options.axis;
        scrollView.options.freeMode = false;
        scrollView.options.rebounceDuration = options.duration;
        scrollView.options.rebounceEasing = options.easing;

        this.cloneCount = 0;
        this.snapData = [];
        this.inited = false;

        this._bindEvent();

        this._initLoop();
        this._collect();

        this.progress = 0;
        this.oldIndex = -1;
        this.activeIndex = 0;

        const index = this.options.index + this.cloneCount;
        this.goto(index, 0);

        this._autoplay();

        this.inited = true;
    }

    _bindEvent() {
        this.scrollView.on('onRefresh', (e) => {
            this._handleRefresh(event);
        });

        this.scrollView.on('onDragStart', event => {
            this._handleDragStart(event);
        });

        this.scrollView.on('onDragEnd', event => {
            this._handleDragEnd(event);
        });

        this.scrollView.on('onSetOptions', allOptions => {
            if(!allOptions[Snap.pluginName]) return;

            const options = allOptions[Snap.pluginName];

            this.options = {
                ...this.options,
                ...options
            };

            if('autoplay' in options) {
                options['autoplay'] ? this._autoplay() : this._stopAutoplay();
            }

        });

        this.scrollView.on('onWillScroll', e => {
            if(this.options.loop) {
                let length = this.snapData.length;

                if(e.scrollX <= this.snapData[0].pos + this.snapData[0].size){
                    let realItem = this.getRealItem(this.getRealIndex(0));
                    
                    e.scrollX =  e.scrollX - (this.snapData[0].pos + this.snapData[0].size)  + (realItem.pos + realItem.size);
                }
    
                if(e.scrollX + this.scrollView.wrapperWidth >= this.snapData[length - 1].pos){
                    let realItem = this.getRealItem(this.getRealIndex(length - 1));
                    
                    e.scrollX =  e.scrollX - this.snapData[length - 1].pos + realItem.pos;
                }
            }
            
        });

        this.scrollView.on('onScroll', e => {
            const pos = this.options.axis === 'x' ? e.scrollX : e.scrollY;
            this._progress(pos);
        });

        this.scrollView.on('onScrollEnd', e=> {
            if(!e.completed) return;

            this._autoplay();

            this.options.onChange(this.activeIndex);
        });
        
    }

    _collect() {
        const {
            selector,
            axis,
            align,
            firstAlign,
            lastAlign,
            loop
        } = this.options;

        this.snapData = [];
        let snapElements = this.scrollView.querySelectorAll(selector);
        let sizeName = axis == 'x' ? 'Width' : 'Height';
        let posName = axis == 'x' ? 'Left' : 'Top';
        const getPos = (elem, align) => {
            let size = elem[`offset${sizeName}`];
            return align === 'start' ? elem[`offset${posName}`] :
                    align === 'end' ? elem[`offset${posName}`] - this.scrollView[`wrapper${sizeName}`] + size :
                        elem[`offset${posName}`] - (this.scrollView[`wrapper${sizeName}`] - size) / 2;
        };

        snapElements.forEach((elem, index) => {
            let _align;
            
            if(index === 0 && firstAlign && !loop) {
                _align = firstAlign;
            } else if(index === snapElements.length - 1 && lastAlign && !loop) {
                _align = lastAlign;
            } else {
                _align = align;
            }
            let size = elem[`offset${sizeName}`];
            let pos = getPos(elem, _align);

            if(index >= this.cloneCount && index <= snapElements.length - 1 - this.cloneCount) {
                domUtils.setAttr(elem, 'data-real-index', index - this.cloneCount);
            }

            this.snapData.push({
                elem,
                pos,
                size
            });
        });

        const length = this.snapData.length;
        const options = {};
        
        if(length > 0) {
            options[axis === 'x' ? 'minScrollX' : 'minScrollY'] = this.snapData[0].pos;
            options[axis === 'x' ? 'maxScrollX' : 'maxScrollY'] = this.snapData[length - 1].pos;
    
            this.scrollView.eventFlag = 'snap/init';
            this.scrollView.setOptions(options);
            this.scrollView.eventFlag = undefined;
        }
    }

    _progress(currentPos){
        let {

        } = this.options;

        let activeIndex = this.activeIndex;
        let activeItem = this.snapData[activeIndex];
        let activePos = activeItem.pos;
        let prevItem = this.snapData[activeIndex - 1];
        let prevPos = prevItem ? prevItem.pos : activePos - activeItem.size; 
        let nextItem = this.snapData[activeIndex + 1];
        let nextPos = nextItem ? nextItem.pos : activePos + activeItem.size; 
        let progress;

        if(currentPos === activePos){
            progress = 0;
        }else if(currentPos < activePos){
            progress = -(activePos - currentPos) / (activePos - prevPos);
        }else if(currentPos > activePos){
            progress = (currentPos - activePos) / ( nextPos - activePos);
        }

        progress = parseFloat(progress.toFixed(2));

        while(progress >= 1 && activeIndex < this.snapData.length - 1){
            activeIndex += 1;
            progress -= 1;
        }
        
        while(progress <= -1 && activeIndex > 0){
            activeIndex -= 1;
            progress += 1;
        }

        // console.log('[Snap]','activeSnap', `{activeIndex}: ${activeIndex}`, `{progress}: ${progress}`);

        this.activeIndex = activeIndex;
        this.progress = progress;
        
        this.options.onProgress.call(this, activeIndex, progress);
        
    }

    getElemsByRealIndex(realIndex) {
        return this.scrollView.querySelectorAll(`[data-real-index="${realIndex}"]`);
    }

    _activeElem(activeIndex){
        const realIndex = this.getRealIndex(activeIndex);
        const oldRealIndex = this.getRealIndex(this.oldIndex);

        if(this.snapData.length > 0 && activeIndex !== this.oldIndex){
            const oldElems = this.getElemsByRealIndex(oldRealIndex);
            const newElems = this.getElemsByRealIndex(realIndex);

            oldElems.forEach(elem=> {
                domUtils.removeClass(elem, 'active');
            });

            newElems.forEach(elem=> {
                domUtils.addClass(elem, 'active');
            });
            
            this.oldIndex = activeIndex;
        }
    }

    _handleRefresh(event) {
        if (['snap/init', 'pullloader/ready', 'pullloader/complete'].indexOf(this.scrollView.eventFlag) > -1) return;

        this._collect();

        this.activeIndex = this.cureIndex(this.activeIndex);

        this.goto(this.activeIndex, 0);
    }

    _handleDragStart(event) {
        this._stopAutoplay();
    }

    _handleDragEnd(event){
        let {
            axis,
            duration: snapDuration,
            easing: snapEasing,
            step,
            onlyEdgeBounce
        } = this.options;

        const nowIndex = this.activeIndex;
        const eventInfo = event[axis];
        let distPos = eventInfo.newScrollPos;
        let snapItem = this._findSnapItem(distPos, true, step);

        if(!snapItem) return;

        let isOver = false;

        if(onlyEdgeBounce){
            // 只能边缘元素
            if(
                (this.scrollView.isOverUpperBounding(axis, distPos) && nowIndex === 0) || 
                (this.scrollView.isOverLowerBounding(axis, distPos) && nowIndex === this.snapData.length - 1)
            ){ 
                isOver = true;
            }
        } else {
            if (step) {
                // 边缘元素包括接邻的元素
                if(
                    (this.scrollView.isOverUpperBounding(axis, distPos) && nowIndex <= 1) || 
                    (this.scrollView.isOverLowerBounding(axis, distPos) && nowIndex >= this.snapData.length - 2)
                ){ 
                    isOver = true;
                }
            } else {
                if(this.scrollView.isOverBounding(axis, distPos)){
                    isOver = true;
                }
            }   
             
        }
        
        if(isOver) {
            eventInfo.newScrollPos = distPos;
            // eventInfo.duration = snapDuration;
            // eventInfo.easing = snapEasing;
        } else {
            eventInfo.newScrollPos = snapItem.pos;
            eventInfo.duration = snapDuration;
            eventInfo.easing = snapEasing;
        }

        this._activeElem(snapItem.index);

        // console.log('onWillChange', snapItem.index);
        this.options.onWillChange(snapItem.index);
    }

    _findSnapItem(newPos, filterDisabled, step) {
        const {
            disabledClassName
        } = this.options;

        let snapItem = null;
        let minOffset = Infinity;
        let activeIndex = this.activeIndex;

        this.snapData
            .forEach((item,index) => {
                if(filterDisabled){
                    if(item.elem.classList.contains(disabledClassName)) return;
                }

                // console.log('[Snap]', 'progress', this.progress, 'activeIndex', this.activeIndex)

                if(this.progress < 0 && index > this.activeIndex) return; 
                if(this.progress > 0 && index < this.activeIndex) return; 

                if(step && !(this.activeIndex - 1 <= index && this.activeIndex + 1 >= index)) {
                    return;
                }

                let offset = newPos - item.pos;
                
                if (Math.abs(offset) < Math.abs(minOffset) ) {
                    minOffset = offset;
                    activeIndex = index;
                    snapItem = item;
                }

            });
       
        return {
            ...snapItem,
            index: activeIndex,
            offset: minOffset
        };
    }

    _initLoop(){

        if(!this.options.loop) return;

        let content = this.scrollView.content;
        let snapElements = this.scrollView.querySelectorAll(this.options.selector);
        let length = snapElements.length;
        this.cloneCount = 3;

        for(let i =0; i < this.cloneCount; i++){
            let elemRealIndex = length - (this.cloneCount - i);
            let first = snapElements[elemRealIndex].cloneNode(true);
            domUtils.addClass(first, 'virtual');
            domUtils.setAttr(first, 'data-real-index', elemRealIndex);
            content.insertBefore(first, snapElements[0]);

            elemRealIndex = i;
            let last = snapElements[i].cloneNode(true);
            domUtils.addClass(last, 'virtual');
            domUtils.setAttr(last, 'data-real-index', elemRealIndex);
            content.appendChild(last);
        }

        this.scrollView.refresh();
    }

    goto(index, duration = this.options.duration, easing = this.options.easing){
        index = this.cureIndex(index); 

        if(this.activeIndex === index && this.inited) return;

        let snapItem = this.snapData[index];
        let x,y;

        console.log(this.scrollView.isScrolling);
        if(this.scrollView.isScrolling) return;
        if(!snapItem) return;

        if(this.options.axis === 'x') x = snapItem.pos;
        if(this.options.axis === 'y') y = snapItem.pos;

        this._activeElem(index);

        this.scrollView.scrollTo(x, y, {
            duration,
            easing
        });

    }

    cureIndex(index) {
        return Math.max(0, Math.min(this.snapData.length - 1, index));
    }

    prev(){
        // this.activeIndex -= 1;
        // this.progress = 1;

        this.goto(this.activeIndex - 1);
    }

    next(){
        // this.activeIndex += 1;
        // this.progress = 1;
        // console.log(this.activeIndex);

        this.goto(this.activeIndex + 1);
    }

    getRealCount() {
        return this.snapData.length - (this.cloneCount * 2);
    }

    getRealIndex(index) {
        index = index - this.cloneCount;
        const total = this.getRealCount();

        if(index < 0) {
            index += total;
        } else if( index > total - 1) {
            index -= total;
        }

        return index;
    }

    getRealItem(realIndex) {
        return this.snapData[realIndex + this.cloneCount];
    }

    // 自动播放
    _autoplay(){
        if(!this.options.autoplay) return;

        console.log('[Snap]', 'autoplay');

        this._stopAutoplay();
        
        this.autoplayTimer = setTimeout(()=>{
            if(this.activeIndex === this.snapData.length - 1) {
                this.goto(0);
            }else {
                this.next();
            }

        },this.options.autoplayInterval);
    }

    _stopAutoplay(){
        clearTimeout(this.autoplayTimer);
    }
}