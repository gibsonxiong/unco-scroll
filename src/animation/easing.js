/* eslint-disable */
const pow = Math.pow;
const abs = Math.abs;

function trimAll(str) {
  return str.replace(/\s+/g,'');
}

class CubicBezier {
  constructor (a, b, c, d) {
    this.px3 = 3 * a
    this.px2 = 3 * (c - a) - this.px3
    this.px1 = 1 - this.px3 - this.px2
    this.py3 = 3 * b
    this.py2 = 3 * (d - b) - this.py3
    this.py1 = 1 - this.py3 - this.py2
    this.epsilon = 1e-5      // 目标精度
  }

  getX(t) {
    return ((this.px1 * t + this.px2) * t + this.px3) * t
  }

  getY(t) {
    return ((this.py1 * t + this.py2) * t + this.py3) * t    
  }

  solve(x) {
    if (x === 0 || x === 1) {             // 对 0 和 1 两个特殊 t 不做计算
      return this.getY(x)
    } 
    let t = x
    for (let i = 0; i < 6; i++) {         // 进行 6 次迭代
      let g = this.getX(t) - x
      if (abs(g) < this.epsilon) {   // 检测误差到可以接受的范围
        return this.getY(t)
      }
      let d = (3 * this.px1 * t + 2 * this.px2) * t + this.px3   // 对 x 求导
      if (abs(d) < 1e-4) {           // 如果梯度过低，说明牛顿迭代法无法达到更高精度
        break
      }
      t = t - g / d
    }
    return this.getY(t)                   // 对得到的近似 t 求 y
  }
}


const easings = {
  //无缓动效果
  'linear': function (t, b, c, d) { return c * t / d + b; },

  //二次方的缓动（t^2）
  'quad-ease-in': function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  'quad-ease-out': function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  'quad-ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },

  //三次方的缓动（t^3）
  'cubic-ease-in': function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  'cubic-ease-out': function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  'cubic-ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },


  //四次方的缓动（t^4）
  'quart-ease-in': function (t, b, c, d) {
    return c * (t /= d) * pow(t, 3) + b;
  },
  'quart-ease-out': function (t, b, c, d) {
    return -c * ((t = t / d - 1) * pow(t, 3) - 1) + b;
  },
  'quart-ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * pow(t, 4) + b;
    return -c / 2 * ((t -= 2) * pow(t, 3) - 2) + b;
  },

  //五次方的缓动（t^5）
  'quint-ease-in': function (t, b, c, d) {
    return c * (t /= d) * pow(t, 4) + b;
  },
  'quint-ease-out': function (t, b, c, d) {
    return c * ((t = t / d - 1) * pow(t, 4) + 1) + b;
  },
  'quint-ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * pow(t, 5) + b;
    return c / 2 * ((t -= 2) * pow(t, 4) + 2) + b;
  },

  //正弦曲线的缓动（sin(t)）
  'sine-ease-in': function (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  'sine-ease-out': function (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  'sine-ease-in-out': function (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },

  //指数曲线的缓动（2^t）
  'expo-ease-in': function (t, b, c, d) {
    return (t == 0) ? b : c * pow(2, 10 * (t / d - 1)) + b;
  },
  'expo-ease-out': function (t, b, c, d) {
    return (t == d) ? b + c : c * (-pow(2, -12 * t / d) + 1) + b;
  },
  'expo-ease-in-out': function (t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-pow(2, -10 * --t) + 2) + b;
  },

  //圆形曲线的缓动（sqrt(1-t^2)）
  'circ-ease-in': function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  'circ-ease-out': function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  'circ-ease-in-out': function (t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },


  //指数衰减的正弦曲线缓动
  'elastic-ease-in': function (t, b, c, d, a, p) {
    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
    if (!a || a < Math.abs(c)) { a = c; let s = p / 4; }
    else {let s = p / (2 * Math.PI) * Math.asin(c / a);}
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  'elastic-ease-out': function (t, b, c, d, a, p) {
    if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
    if (!a || a < Math.abs(c)) { a = c; let s = p / 4; }
    else {let s = p / (2 * Math.PI) * Math.asin(c / a);}
    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
  },
  'elastic-ease-in-out': function (t, b, c, d, a, p) {
    if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
    if (!a || a < Math.abs(c)) { a = c; let s = p / 4; }
    else {let s = p / (2 * Math.PI) * Math.asin(c / a);}
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },

  //超过范围的三次方缓动（(s+1)*t^3 - s*t^2）
  'back-ease-in': function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  'back-ease-out': function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  'back-ease-in-out': function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },


  //指数衰减的反弹缓动
  'bounce-ease-in': function (t, b, c, d) {
    return c - easings['bounce-ease-out'](d - t, 0, c, d) + b;
  },
  'bounce-ease-out': function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  },
  'bounce-ease-in-out': function (t, b, c, d) {
    if (t < d / 2) return easings['bounce-ease-in'](t * 2, 0, c, d) * .5 + b;
    else return easings['bounce-ease-out'](t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  }
};

export default {
  get(easingName = 'linear') {
    let matched;
    if (typeof easingName === 'function') {
      return easingName;
    }
    else if(matched = /^cubic-bezier\(([\d.]+),([\d.]+),([\d.]+),([\d.]+)\)$/g.exec(trimAll(easingName))) {
      easingName = trimAll(easingName);
      let easingFn = easings[easingName];
      
      if(!easingFn) {
        const points = [matched[1], matched[2], matched[3], matched[4]];
        easingFn = (function () {    
          const bezier = new CubicBezier(...points);
      
          return function (t, b, c, d) {
            let progress = t / d;
            progress = bezier.solve(progress);
            return c * progress + b;
          }
        })();
        this.register(easingName, easingFn);
      }
      return easingFn;
    }
    else {
      return easings[easingName];
    }
  },

  register(easingName, easingFn) {
    easings[easingName] = easingFn;
  }
};