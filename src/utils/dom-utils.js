const BORDER = 'border';
const PADDING = 'padding';
const MARGIN = 'margin';
const WIDTH = 'Width';
const nameMap = {
    't': 'Top',
    'l': 'Left',
    'r': 'Right',
    'b': 'Bottom'
}

const styleHook = (function () {
    let hooks = {};
    let names = [
        "width",
        "height",
        "left",
        "top",
        "bottom",
        "right",
        "paddingLeft",
        "paddingTop",
        "paddingBottom",
        "paddingRight",
        "marginLeft",
        "marginTop",
        "marginBottom",
        "marginRight"
    ];

    const hook = {
        set(value) {
            return value + "px";
        },
        get(value) {
            return parseFloat(value) || 0;
        }
    };

    names.forEach(name => {
        hooks[name] = hook;
    });

    return {
        get(name, value) {
            let h = hooks[name];

            if (!h) return value;

            return h.get(value);
        },
        set(name, value) {
            let h = hooks[name];

            if (!h) return value;

            return h.set(value);
        }
    };
})();


const domUtils = {
    getStyle(dom, name) {
        let value = window.getComputedStyle(dom).getPropertyValue(name);

        return styleHook.get(name, value);
    },


    setStyle(dom, name, value) {
        if (typeof name === 'object') {
            let cssMap = name;
            Object.keys(cssMap).forEach(name => {
                domUtils.setStyle(dom, name, cssMap[name]);
            });
            return;
        }

        dom.style[name] = styleHook.set(name, value);
    },

    addClass(elem, className){
        elem.classList.add(className);
    },

    removeClass(elem, className){
        elem.classList.remove(className);
    },

    setAttr(elem, attrName, attrValue) {
        return elem.setAttribute(attrName, attrValue);
    },

    getAttr(elem, attrName) {
        return elem.getAttribute(attrName);
    },

    getScrollLeft() {
        return document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    },

    getScrollTop() {
        return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    },


    getScrollWidth() {
        return document.documentElement.scrollWidth || document.body.scrollWidth;
    },

    getScrollHeight() {
        return document.documentElement.scrollHeight || document.body.scrollHeight;
    },

    getClientWidth() {
        return window.innerWidth;
    },

    getClientHeight() {
        return window.innerHeight;
    },

    getOffset(elem) {
        let offsetLeft = 0;
        let offsetTop = 0;
        let offsetWidth = elem.offsetWidth;
        let offsetHeight = elem.offsetHeight;
        let parent = elem.offsetParent;

        //首先加自己本身的左偏移和上偏移
        offsetLeft += elem.offsetLeft;
        offsetTop += elem.offsetTop;

        //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
        while (parent) {
            if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
                //累加父级参照物的边框
                offsetLeft += parent.clientLeft;
                offsetTop += parent.clientTop
            }

            //累加父级参照物本身的偏移
            offsetLeft += parent.offsetLeft;
            offsetTop += parent.offsetTop
            parent = parent.offsetParent;
        }

        return {
            left: offsetLeft,
            top: offsetTop,
            width: offsetWidth,
            height: offsetHeight
        }
    },

    getBoxRect(elem, boxSizing) {
        const offsetWidth = elem.offsetWidth;
        const offsetHeight = elem.offsetHeight;
        const offsetTop = elem.offsetTop;
        const offsetLeft = elem.offsetLeft;
        let width = null;
        let height = null;
        let top = null;
        let left = null;

        boxSizing = boxSizing || 'borderBox';

        switch (boxSizing) {
            case 'marginBox':
                width = offsetWidth + domUtils.getMargin(elem, 'lr');
                height = offsetHeight + domUtils.getMargin(elem, 'tb');
                top = offsetTop - domUtils.getMargin(elem, 't');
                left = offsetLeft - domUtils.getMargin(elem, 'l');
                break;

            case 'borderBox':
            default:
                width = offsetWidth;
                height = offsetHeight;
                top = offsetTop;
                left = offsetLeft;
                break;

            case 'paddingBox':
                width = offsetWidth - domUtils.getBorderWidth(elem, 'lr');
                height = offsetHeight - domUtils.getBorderWidth(elem, 'tb');
                top = offsetTop + domUtils.getBorderWidth(elem, 't');
                left = offsetLeft + domUtils.getBorderWidth(elem, 'l');
                break;

            case 'contentBox':
                width = offsetWidth - domUtils.getBorderWidth(elem, 'lr') - domUtils.getPadding(elem, 'lr');
                height = offsetHeight - domUtils.getBorderWidth(elem, 'tb') - domUtils.getPadding(elem, 'tb');
                top = offsetTop + domUtils.getBorderWidth(elem, 't') + domUtils.getPadding(elem, 't');
                left = offsetLeft + domUtils.getBorderWidth(elem, 'l') + domUtils.getPadding(elem, 'l');
                break;
        }

        return {
            width: width,
            height: height,
            top: top,
            left: left,
        }
    },

    getBorderWidth(elem, sides) {
        let res = 0;

        sides = sides.split('');
        for (let i = 0, len = sides.length; i < len; i++) {
            let side = sides[i];

            res += domUtils.getStyle(elem, BORDER + nameMap[side] + WIDTH) || 0;
        }
        return res;
    },

    getPadding(elem, sides) {
        let res = 0;

        sides = sides.split('');
        for (let i = 0, len = sides.length; i < len; i++) {
            let side = sides[i];

            res += domUtils.getStyle(elem, PADDING + nameMap[side]) || 0;
        }
        return res;
    },

    getMargin(elem, sides) {
        let res = 0;

        sides = sides.split('');
        for (let i = 0, len = sides.length; i < len; i++) {
            let side = sides[i];

            res += domUtils.getStyle(elem, MARGIN + nameMap[side]) || 0;
        }
        return res;
    },

    create(htmlText) {
        const elem = document.createElement('div');

        elem.innerHTML = htmlText;

        return elem.firstElementChild;
    },

    html(elem, htmlTextOrElem) {
        if(typeof htmlTextOrElem === 'string') {
            elem.innerHTML = htmlTextOrElem;
        }else {
            elem.innerHTML = '';
            elem.appendChild(htmlTextOrElem);
        }
    },

    prepend(elem, htmlTextOrElem) {
        if(typeof htmlTextOrElem === 'string') {
            htmlTextOrElem = domUtils.create(htmlTextOrElem);
        }
        elem.insertBefore(htmlTextOrElem, elem.firstElementChild);
    },

    append(elem, htmlTextOrElem) {
        if(typeof htmlTextOrElem === 'string') {
            htmlTextOrElem = domUtils.create(htmlTextOrElem);
        }
        elem.appendChild(htmlTextOrElem);
    },

    onImgLoaded(el, callback) {
        let imgs = el.tagName === 'img' ? [el] : [...el.querySelectorAll("img")];
        const unloadImgs = imgs.filter(img=> !img.complete);
        let unloadImgCount = unloadImgs.length;
        
        function handler(){
            if (!--unloadImgCount) {
                callback();
            }
        }

        if (unloadImgCount > 0) {
            
            [].forEach.call(imgs, function (img) {
                img.addEventListener(
                    "load",
                    handler,
                    false
                );

                img.addEventListener(
                    "error",
                    handler,
                    false
                );
            });
        }

    },

    unifyHeight(container, selector, isMax = true) {
        let childrens = container.querySelectorAll(selector);

        Array.prototype.forEach.call(childrens, function (child) {
            child.style.height = "auto";
        });

        let height = (function () {
            let h = 0;

            Array.prototype.forEach.call(childrens, function (child) {
                let op = isMax ? Math.max : Math.min;
                h = op(child.offsetHeight, h);
            });

            return h;
        })();

        Array.prototype.forEach.call(childrens, function (child) {
            child.style.height = height + "px";
        });
    },

    checkInBoundY(y1, y2) {
        let scrollTop = domUtils.getScrollTop();
        let clientHeight = domUtils.getClientHeight();

        if ((scrollTop <= y1 && scrollTop + clientHeight >= y1) ||
            (scrollTop <= y2 && scrollTop + clientHeight >= y2)) {

            return true;
        } else {
            return false;
        }
    },

    checkInElementY(el) {
        let {
            top,
            height
        } = domUtils.getOffset(el);
        let y1 = top;
        let y2 = top + height;

        return domUtils.checkInBoundY(y1, y2);
    },

    detectInBoundY(y1, y2, listener) {
        let onScroll = () => {

            if (domUtils.checkInBoundY(y1, y2)) {
                listener && listener();

                window.removeEventListener('scroll', onScroll);
            }
        }

        window.addEventListener('scroll', onScroll);
        onScroll();
    },

    detectInElementY(el, listener) {
        let {
            top,
            height
        } = domUtils.getOffset(el);
        let y1 = top;
        let y2 = top + height;

        domUtils.detectInBoundY(y1, y2, listener);
    },

    //生成style标签
    genStyleSheet(str, id) {
        domUtils.removeStyleSheet(id);

        const elem = document.createElement("style");
        elem.type = "text/css";

        //ie下
        if (elem.styleSheet) {
            elem.styleSheet.cssText = str;
        } else {
            elem.innerHTML = str;
        }

        elem.id = id;

        document.getElementsByTagName("head")[0].appendChild(elem);
    },

    //移除style标签
    removeStyleSheet(id) {
        const elem = document.getElementById(id);
        if (elem) {
            document.getElementsByTagName("head")[0].removeChild(elem);
        }
    }
}


export default domUtils;