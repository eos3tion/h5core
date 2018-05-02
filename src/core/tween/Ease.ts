
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
namespace jy {
    export interface IEaseFunction {
        (t: number, ...args): number
    }

    /**
     * tween的执行效果，参考页面：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html
     * 
     * @export
     * @class Ease
     */
    export class Ease {

        /**
         * 根据起始值和终值，及当前进度率得到结果
         * 
         * @static
         * @param {number} v0       起始值
         * @param {number} v1       终值
         * @param {number} ratio    进度率
         * @returns
         */
        public static getValue(v0: number, v1: number, ratio: number) {
            if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof v0 != "number")) {
                return ratio == 1 ? v1 : v0;
            } else {
                return v0 + (v1 - v0) * ratio;
            }
        }

        public static get(amount: number): IEaseFunction {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            }
        }

        public static getPowIn(pow: number): IEaseFunction {
            return function (t) {
                return Math.pow(t, pow);
            }
        }

        public static getPowOut(pow: number): IEaseFunction {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        public static getPowInOut(pow: number): IEaseFunction {
            return function (t) {
                if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            }
        }

        public static quadIn: IEaseFunction = Ease.getPowIn(2);


        public static quadOut: IEaseFunction = Ease.getPowOut(2);


        public static quadInOut: IEaseFunction = Ease.getPowInOut(2);


        public static cubicIn: IEaseFunction = Ease.getPowIn(3);


        public static cubicOut: IEaseFunction = Ease.getPowOut(3);


        public static cubicInOut: IEaseFunction = Ease.getPowInOut(3);


        public static quartIn: IEaseFunction = Ease.getPowIn(4);


        public static quartOut: IEaseFunction = Ease.getPowOut(4);


        public static quartInOut: IEaseFunction = Ease.getPowInOut(4);


        public static quintIn: IEaseFunction = Ease.getPowIn(5);


        public static quintOut: IEaseFunction = Ease.getPowOut(5);


        public static quintInOut: IEaseFunction = Ease.getPowInOut(5);

        public static sineIn(t: number): number {
            return 1 - Math.cos(t * Math.PI / 2);
        }

        public static sineOut(t: number): number {
            return Math.sin(t * Math.PI / 2);
        }

        public static sineInOut(t: number): number {
            return -0.5 * (Math.cos(Math.PI * t) - 1)
        }

        public static getBackIn(amount: number): IEaseFunction {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            }
        }

        public static backIn: IEaseFunction = Ease.getBackIn(1.7);

        public static getBackOut(amount: number): IEaseFunction {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            }
        }

        public static backOut: IEaseFunction = Ease.getBackOut(1.7);

        public static getBackInOut(amount: number): IEaseFunction {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            }
        }

        public static backInOut: IEaseFunction = Ease.getBackInOut(1.7);

        public static circIn(t: number): number {
            return -(Math.sqrt(1 - t * t) - 1);
        }



        public static circOut(t: number): number {
            return Math.sqrt(1 - (--t) * t);
        }



        public static circInOut(t: number): number {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }



        public static bounceIn(t: number): number {
            return 1 - Ease.bounceOut(1 - t);
        }



        public static bounceOut(t: number): number {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            } else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            } else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            } else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        }

        public static bounceInOut(t: number): number {
            if (t < 0.5) return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }

        public static getElasticIn(amplitude: number, period: number): IEaseFunction {
            return function (t) {
                if (t == 0 || t == 1) return t;
                var s = period / Math.PI2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Math.PI2 / period));
            }
        }

        public static elasticIn: IEaseFunction = Ease.getElasticIn(1, 0.3);

        public static getElasticOut(amplitude: number, period: number): IEaseFunction {
            return function (t) {
                if (t == 0 || t == 1) return t;
                var s = period / Math.PI2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * Math.PI2 / period) + 1);
            }
        }

        public static elasticOut: IEaseFunction = Ease.getElasticOut(1, 0.3);

        public static getElasticInOut(amplitude: number, period: number): IEaseFunction {
            return function (t) {
                var s = period / Math.PI2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Math.PI2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * Math.PI2 / period) * 0.5 + 1;
            }
        }

        public static elasticInOut: IEaseFunction = Ease.getElasticInOut(1, 0.3 * 1.5);
    }
}