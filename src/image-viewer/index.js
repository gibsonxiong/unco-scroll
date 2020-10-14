/* eslint-disable */
import './style.scss';
import ScrollView from '../scroll-view/core';
import Snap from '../scroll-view/snap';
import utils from '../utils';
import domUtils from '../utils/dom-utils';
import animation from '../animation';
import Frame from '../animation/Frame';

const { Animater } = animation;

ScrollView.use(Snap);

const rebounceDuration = 250;
const rebounceEasing = `cubic-bezier(0.25, 0, 0.5, 1)`;
const resistanceFactor = 0.3;

function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
}

export default class ImageViewer {
    static _defaults = {
        groupAttr: 'data-group',
        highSrcAttr: 'data-high-src',

        showAnimationDuration: 200,
        hideAnimationDuration: 300,

        zoomStart: 1,
        zoomMin: 1,
        zoomMax: 4
    }

    constructor(options) {
        this.options = options = utils.extend({}, this.constructor._defaults, options);

        this.images = [];
        this.zooms = [];
        this._initContainer();
        this._initSnap();

        this.animater = new Animater();
    }

    _initContainer() {
        const that = this;
        const container = domUtils.create(`
            <div class="image-viewer">
                <div class="image-viewer-content"></div>
            </div>
        `);

        document.body.appendChild(container);

        this.container = new ScrollView(container, {
            // minScrollY: 0,
            // maxScrollY: 3000
            // bounceY: [true, false],
            scrollNeedOverflow: false,
            resistanceFactor: 1,
            resistancePercentForMaxSizeLimit: 1,
            onScroll() {
                const end = this.wrapperHeight / 2;
                const percent = Math.max(Math.abs(this.scrollY) / end, 0);

                that.setBgOpacity(1- percent);
            },
            onDragEnd(e) {
                if(e.defaultPrevented) return;

                // 达到临界值，关闭
                const currentPos = this.scrollY;
                const pos = e.y.newScrollPos;
                if((currentPos < 0 && pos <= -100) || (currentPos > 0 && pos >= 100)) {
                    const zoom = that.getCurrentZoom();
                    zoom.scrollX += this.scrollX;
                    zoom.scrollY += this.scrollY;
                    zoom._update(true);
    
                    e.x.newScrollPos = 0;
                    e.y.newScrollPos = 0;
                    e.x.duration = 0;
                    e.y.duration = 0;
    
                    that.hide();

                } else {
                    e.x.newScrollPos = 0;
                    e.y.newScrollPos = 0;
                    e.x.duration = rebounceDuration;
                    e.y.duration = rebounceDuration;
                    e.x.easing = rebounceEasing;
                    e.y.easing = rebounceEasing;
                }

            }
        });

        this.container.touch.on('onTap', (e) => {
            if(this.snap.isScrollForceStoped) {
                return;
            }
            console.log('onTap');
            // this.hide();
        });

        this.container.touch.on('onDoubleTap', (e) => {
            console.log('onDoubleTap')
            this._handleDoubleTap(e);
        });
    }

    _initSnap() {
        const wrapper = domUtils.create(`
            <div class="snap-wrapper">
                <div class="snap-content"></div>
            </div>
        `);

        this.container.content.appendChild(wrapper);

        // snap
        this.snap = new ScrollView(wrapper, {
            axis: "x",
            freeMode: false,
            lockAxisAngle: 55,
            
            rebounceDuration,
            rebounceEasing,
            resistanceFactor,

            snap: {
                selector: ".zoom-wrapper",
                axis: "x",
                index:0,
                onChange:(index) => {
                    this._handleSnapChange(index);
                }
            },

        });
        
    }

    // zoom
    _initZoom(sourceImage) {
        const that = this;

        const zoomWrapper = domUtils.create(`
            <div class="zoom-wrapper">
                <div class="zoom-content">
                    <img class="zoom-img"/>
                </div>
            </div>
        `);
        const zoomContent = zoomWrapper.querySelector('.zoom-content');
        const zoomImage = zoomWrapper.querySelector('.zoom-img');

        this.snap.content.appendChild(zoomWrapper);
        
        let src = sourceImage.src;
        const imageWidth = zoomWrapper.clientWidth;
        const imageHeight = zoomWrapper.clientWidth / (sourceImage.naturalWidth / sourceImage.naturalHeight);

        zoomImage.src = src; 
        zoomImage.style.width = imageWidth + 'px';
        zoomImage.style.height = imageHeight + 'px';
        zoomImage.style[`object-fit`] = domUtils.getStyle(sourceImage, `object-fit`);

        domUtils.setStyle(zoomContent, {
            width: imageWidth,
            height: imageHeight
        });

        const zoom = new ScrollView(zoomWrapper, {
            
            // bounceX: false,
            // bounceY: false,
            
            boundingReleaseX: true,
            boundingReleaseY: true,
            
            alignX: 'center',
            alignY: 'center',
            
            zoom: true,
            zoomStart: this.options.zoomStart,
            zoomMin: this.options.zoomMin,
            zoomMax: this.options.zoomMax,
            
            resistanceFactor,
            rebounceEasing,
            rebounceDuration,


            // onWillScroll(e) {
            //     if(this.isOverBounding('x')) {
            //         const d = this.decimal(this.maxScrollX - this.backupX);
            //         const delta = this.decimal(e.scrollX - this.backupX);
            //         const x = that.snap.scrollX + delta - d;

            //         that.snap.moveTo(x, undefined);
            //         e.scrollX = this.backupX + d;
            //     }
            // }

        });

        // console.log(zoom.options.boundingReleaseX);

        return zoom;
    }

    getZoom(index) {
        return this.zooms[index];
    }

    getCurrentZoom() {
        return this.getZoom(this.snap.snap.activeIndex);
    }

    getZoomImage(index) {
        const zoom = this.getZoom(index);
        return zoom.querySelector('.zoom-img');
    }

    getCurrentZoomImage(){
        return this.getZoomImage(this.snap.snap.activeIndex);
    }

    show(image){
        
        const groupName = domUtils.getAttr(image, this.options.groupAttr);
        let images = [...document.querySelectorAll(`[${this.options.groupAttr}=${groupName}]`)];
        
        if(!images) {
            images = [image];
        }

        this.images = images;

        const index = images.findIndex(img => img === image) || 0;

        domUtils.addClass(this.container.wrapper,'image-viewer-active');

        this.zooms = [];
       
        images.forEach((img, imageIndex) => {
            const zoom = this._initZoom(img, imageIndex === index);
            this.zooms.push(zoom);
        });

        // 刷新
        this.snap.refresh();
        this.container.refresh();
        // 指定第几张
        this.goto(index, 0);
        // 动画
        this.showAnimation(index, () => {
            this.getCurrentZoom().refresh();
            this.showHigh(index);
        });
    }

    hide() {
        const activeIndex = this.snap.snap.activeIndex;
        
        // 动画
        this.hideAnimation(activeIndex, ()=> {
            domUtils.removeClass(this.container.wrapper, 'image-viewer-active');
            this.container.moveTo(0,0);
            this.snap.html('');
        });
    }

    goto(index, duration) {
        this.snap.snap.goto(index, duration);
    }

    getRect(sourceImage) {
        let sourceRect = sourceImage.getBoundingClientRect();
                
        return {
            width: sourceRect.width,
            height: sourceRect.height,
            left: sourceRect.left,
            top: sourceRect.top,
        }
    }

    showAnimation(index, callback) {
        // 动画
        const source = this.images[index];
        const rect = this.getRect(source);

        const zoom = this.zooms[index];
        const zoomImage = this.getZoomImage(index);

        const begin = {
            width: rect.width,
            height: rect.height,
            left: rect.left + zoom.scrollX,
            top: rect.top + zoom.scrollY
        };
        const end = {
            width: zoomImage.width,
            height: zoomImage.height,
            left: 0,
            top: 0
        };
        
        this.animater.clear();
        this.animater.add('show', new Frame({
            handler: (value) => {
                const width = (end.width - begin.width) * value + begin.width;
                const height = (end.height - begin.height) * value + begin.height;
                const left = (end.left - begin.left) * value + begin.left;
                const top = (end.top - begin.top) * value + begin.top;

                domUtils.setStyle(zoomImage, {
                    width,
                    height,
                    transform: `translate(${ left }px, ${ top }px)`
                });

                this.setBgOpacity(value);
            },
            duration: this.options.showAnimationDuration,
            easing: 'cubic-ease-out'
        }));

        this.animater.play({
            callback
        });
    }

    hideAnimation(index, callback) {
        // 动画
        const source = this.images[index];
        const rect = this.getRect(source);

        const zoom = this.zooms[index];
        const zoomImage = this.getZoomImage(index);

        const begin = {
            width: zoomImage.width,
            height: zoomImage.height,
            left: 0,
            top: 0
        };
        const end = {
            width: rect.width / zoom.scale,
            height: rect.height / zoom.scale,
            left: rect.left / zoom.scale + (zoom.scrollX / zoom.scale), // + this.container.scrollX,
            top: rect.top / zoom.scale + (zoom.scrollY / zoom.scale), // + this.container.scrollY
        };
        
        // 背景
        const backgroundStyle = domUtils.getStyle(this.container.wrapper, 'background-color');
        const matched = /rgba\(\d+,\s\d+,\s\d+,\s(\d+.?\d+)\)/g.exec(backgroundStyle);
        const opacity = matched ? parseFloat(matched[1]) : 1;

        this.animater.clear();
        this.animater.add('hide', new Frame({
            handler: (percent) => {
                const width = (end.width - begin.width) * percent + begin.width;
                const height = (end.height - begin.height) * percent + begin.height;
                const left = (end.left - begin.left) * percent + begin.left;
                const top = (end.top - begin.top) * percent + begin.top;

                domUtils.setStyle(zoomImage, {
                    width,
                    height,
                    transform: `translate(${ left }px, ${ top }px)`
                });
                this.setBgOpacity(opacity - opacity * percent);
            },
            duration: this.options.hideAnimationDuration,
            easing: 'cubic-ease-out'
        }));

        this.animater.play({
            callback
        });
    }

    setBgOpacity(opacity){
        domUtils.setStyle(this.container.wrapper, {
            background: `rgba(30, 30, 30, ${opacity})`
        });
    }

    _handleSnapChange(index) {
        this.showHigh(index);
    }

    showHigh(index) {
        const sourceImage = this.images[index];
        const zoomImage = this.getZoomImage(index);
        const highSrc = domUtils.getAttr(sourceImage, this.options.highSrcAttr);

        if(highSrc && zoomImage.src !== highSrc){
            zoomImage.src = highSrc;
        }
    }


    zoomTo(scale, x, y) {
        const zoom = this.getCurrentZoom();

        if(!zoom) return;

        zoom.zoomTo(scale, x, y); 
    }

    zoomBy(scale, x, y) {
        const zoom = this.getCurrentZoom();

        if(!zoom) return;

        zoom.zoomBy(scale, x, y); 
    }

    _handleDoubleTap(e) {
        const zoom = this.getCurrentZoom();
        const zoomImage = this.getCurrentZoomImage();
        
        if(!zoom) return;

        // let scale = zoom.scale > zoom.options.zoomStart ? zoom.options.zoomStart : zoom.options.zoomMax;
        let scale = zoom.wrapperHeight / zoomImage.height;

        this.zoomTo(scale, e.x, e.y);
    }
}