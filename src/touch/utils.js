export const newId = ( function () {
    let uuid = 0;
    return function () {
        return uuid++;
    }
})();

export function isAndroid() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/Android/i) == "android") {
        return true;
    } else {
        return false;
    }
}

export function getTime(){
    return +new Date();
}

//触摸个数
export function getFingers(e){
    return e.touches.length;
}

//两点之间的距离
export function getDistance(point1,point2){
    let x,y;
    x = point1.x - point2.x;
    y = point1.y - point2.y;

    return Math.sqrt(x * x + y * y);
}

//两点之间的中心点坐标
export function getCenterPoint(point1,point2){
    return {
        x: (point1.x + point2.x)/2,
        y: (point1.y + point2.y)/2,
    }
}

export function getAngle(point1,point2){
    let angle = Math.atan((point2.y - point1.y) * -1 / (point2.x - point1.x)) * (180 / Math.PI);
     angle = (angle < 0 ? (angle + 180) : angle);
    return 180 - angle;
}