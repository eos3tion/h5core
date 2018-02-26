module junyou {

    export interface MotionGuidePluginTween extends Tween {
        /**
         * 是否需要旋转
         * 
         * @type {boolean}
         * @memberOf Tween
         */
        __needsRot: boolean;

        __rotGlobalS: number;

        __rotGlobalE: number;

        __rotPathE: number;
        __rotPathS: number;

        __guideData: any;
    }

    export interface MotionGuidePluginTarget {
        x?: number;
        y?: number;
        rotation?: number;
    }

    export const MotionGuidePlugin = (function () {
        return {
            priority: 0,
            install(manager: TweenManager) {
                manager.installPlugin(this, ["guide", "x", "y", "rotation"]);
            },
            init(tween: MotionGuidePluginTween, prop: string, value: any) {
                let target = tween.target;
                if (target.x == undefined) { target.x = 0; }
                if (target.y == undefined) { target.y = 0; }
                if (target.rotation == undefined) { target.rotation = 0; }

                if (prop == "rotation") { tween.__needsRot = true; }
                return prop == "guide" ? null : value;
            },
            step(tween: MotionGuidePluginTween, prop: string, startValue: any, endValue: any, injectProps: any) {
                // other props
                if (prop == "rotation") {
                    tween.__rotGlobalS = startValue;
                    tween.__rotGlobalE = endValue;
                    testRotData(tween, injectProps);
                }
                if (prop != "guide") { return endValue; }

                // guide only information - Start -
                var temp, data = endValue;
                if (!data.hasOwnProperty("path")) { data.path = []; }
                var path = data.path;
                if (!data.hasOwnProperty("end")) { data.end = 1; }
                if (!data.hasOwnProperty("start")) {
                    data.start = (startValue && startValue.hasOwnProperty("end") && startValue.path === path) ? startValue.end : 0;
                }

                // Figure out subline information
                if (data.hasOwnProperty("_segments") && data._length) { return endValue; }
                var l = path.length;
                var accuracy = 10;		// Adjust to improve line following precision but sacrifice performance (# of seg)
                if (l >= 6 && (l - 2) % 4 == 0) {	// Enough points && contains correct number per entry ignoring start
                    data._segments = [];
                    data._length = 0;
                    for (var i = 2; i < l; i += 4) {
                        var sx = path[i - 2], sy = path[i - 1];
                        var cx = path[i + 0], cy = path[i + 1];
                        var ex = path[i + 2], ey = path[i + 3];
                        var oldX = sx, oldY = sy;
                        var tempX, tempY, total = 0;
                        var sublines = [];
                        for (var j = 1; j <= accuracy; j++) {
                            var t = j / accuracy;
                            var inv = 1 - t;
                            tempX = inv * inv * sx + 2 * inv * t * cx + t * t * ex;
                            tempY = inv * inv * sy + 2 * inv * t * cy + t * t * ey;
                            total += sublines[sublines.push(Math.sqrt((temp = tempX - oldX) * temp + (temp = tempY - oldY) * temp)) - 1];
                            oldX = tempX;
                            oldY = tempY;
                        }
                        data._segments.push(total);
                        data._segments.push(sublines);
                        data._length += total;
                    }
                } else {
                    throw ("invalid 'path' data, please see documentation for valid paths");
                }

                // Setup x/y tweens
                temp = data.orient;
                data.orient = true;
                var o = {} as any;
                calc(data, data.start, o);
                tween.__rotPathS = Number(o.rotation.toFixed(5));
                calc(data, data.end, o);
                tween.__rotPathE = Number(o.rotation.toFixed(5));
                data.orient = false;	//here and now we don't know if we need to
                calc(data, data.end, injectProps);
                data.orient = temp;

                // Setup rotation properties
                if (!data.orient) { return endValue; }
                tween.__guideData = data;
                testRotData(tween, injectProps);
                return endValue;
            },
            tween(tween: MotionGuidePluginTween, prop: string, value: any, startValues: any, endValues: any, ratio: number, wait: boolean, end: boolean) {
                var data = endValues.guide;
                if (data == undefined || data === startValues.guide) { return value; }
                if (data.lastRatio != ratio) {
                    // first time through so calculate what I need to
                    var t = ((data.end - data.start) * (wait ? data.end : ratio) + data.start);
                    calc(data, t, tween.target);
                    switch (data.orient) {
                        case "cw":		// mix in the original rotation
                        case "ccw":
                        case "auto": tween.target.rotation += data.rotOffS + data.rotDelta * ratio || 0; break;
                        case "fixed":	// follow fixed behaviour to solve potential issues
                        default: tween.target.rotation += data.rotOffS || 0; break;
                    }
                    data.lastRatio = ratio;
                }
                if (prop == "rotation" && ((!data.orient) || data.orient == "false")) { return value; }
                return tween.target[prop];
            }
        }
        function testRotData(tween: MotionGuidePluginTween, injectProps: any) {

            // no rotation informat? if we need it come back, if we don't use 0 & ensure we have guide data
            if (tween.__rotGlobalS === undefined || tween.__rotGlobalE === undefined) {
                if (tween.__needsRot) { return; }
                let _curQueueProps = tween._curQueueProps;
                if (_curQueueProps.rotation !== undefined) {
                    tween.__rotGlobalS = tween.__rotGlobalE = _curQueueProps.rotation;
                } else {
                    tween.__rotGlobalS = tween.__rotGlobalE = injectProps.rotation = tween.target.rotation || 0;
                }
            }
            if (tween.__guideData === undefined) { return; }

            // Process rotation properties
            var data = tween.__guideData;
            var rotGlobalD = tween.__rotGlobalE - tween.__rotGlobalS || 0;
            var rotPathD = tween.__rotPathE - tween.__rotPathS || 0;
            var rot = rotGlobalD - rotPathD || 0;

            if (data.orient == "auto") {
                if (rot > 180) { rot -= 360; }
                else if (rot < -180) { rot += 360; }

            } else if (data.orient == "cw") {
                while (rot < 0) { rot += 360; }
                if (rot == 0 && rotGlobalD > 0 && rotGlobalD != 180) { rot += 360; }

            } else if (data.orient == "ccw") {
                rot = rotGlobalD - ((rotPathD > 180) ? (360 - rotPathD) : (rotPathD));	// sign flipping on path
                while (rot > 0) { rot -= 360; }
                if (rot == 0 && rotGlobalD < 0 && rotGlobalD != -180) { rot -= 360; }
            }

            data.rotDelta = rot;
            data.rotOffS = tween.__rotGlobalS - tween.__rotPathS;

            // reset
            tween.__rotGlobalS = tween.__rotGlobalE = tween.__guideData = tween.__needsRot = undefined;
        }

        function calc(data, ratio: number, target: MotionGuidePluginTarget) {
            if (data._segments == undefined) { throw ("Missing critical pre-calculated information, please file a bug"); }
            if (target == undefined) { target = { x: 0, y: 0, rotation: 0 }; }
            var seg = data._segments;
            var path = data.path;

            // find segment
            var pos = data._length * ratio;
            var cap = seg.length - 2;
            var n = 0;
            while (pos > seg[n] && n < cap) {
                pos -= seg[n];
                n += 2;
            }

            // find subline
            var sublines = seg[n + 1];
            var i = 0;
            cap = sublines.length - 1;
            while (pos > sublines[i] && i < cap) {
                pos -= sublines[i];
                i++;
            }
            var t = (i / ++cap) + (pos / (cap * sublines[i]));

            // find x/y
            n = (n * 2) + 2;
            var inv = 1 - t;
            target.x = inv * inv * path[n - 2] + 2 * inv * t * path[n + 0] + t * t * path[n + 2];
            target.y = inv * inv * path[n - 1] + 2 * inv * t * path[n + 1] + t * t * path[n + 3];

            // orientation
            if (data.orient) {
                target.rotation = 57.2957795 * Math.atan2(
                    (path[n + 1] - path[n - 1]) * inv + (path[n + 3] - path[n + 1]) * t,
                    (path[n + 0] - path[n - 2]) * inv + (path[n + 2] - path[n + 0]) * t);
            }

            return target;
        };

    })()
}