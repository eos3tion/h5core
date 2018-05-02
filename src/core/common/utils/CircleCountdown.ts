namespace jy {
    /**
     * 圆圈倒计时
     * 
     * @export
     * @class CircleCountdown
     */
    export class CircleCountdown {

        public static defaultColor = 0xff0000;

        protected _g: egret.Graphics;

        protected _cX: number;

        protected _cY: number;

        /**
         * 绘制的线的宽度
         * 
         * @protected
         * 
         * @memberOf CircleCountdown
         */
        protected _sw = 2;

        protected _total = 0;
        protected _p: number;

        protected _cfgs = [] as CircleCountdownCfg[];

        protected _cfg: CircleCountdownCfg;


        protected _eRad: number;
        protected _sRad: number;
        protected _dRad: number;

        protected _radius: number;

        private isEnd:boolean;

        setGraphis(graphics: egret.Graphics) {
            this._g = graphics;
            return this;
        }
        setCenter(centerX: number, centerY: number) {
            this._cX = centerX;
            this._cY = centerY;
            return this;
        }

        setRadius(radius: number) {
            this._radius = radius;
            return this;
        }

        /**
         * 设置起始角度和结束角度
         * 
         * @param {number} [rad=0] 
         * 
         * @memberOf CircleCountdown
         */
        setRad(startRad = 0, endRad = Math.PI) {
            this._sRad = startRad;
            this._eRad = endRad;
            this._dRad = endRad - startRad;
            return this;
        }

        /**
         * 设置线的宽度
         * 
         * @param {number} [strokeWidth=1] 
         * @returns 
         * 
         * @memberOf CircleCountdown
         */
        setStrokeWidth(strokeWidth = 2) {
            this._sw = strokeWidth;
            return this;
        }

        setCfgs(color?: number | CircleCountdownCfg, ...cfgs: CircleCountdownCfg[]) {
            if (!color) {
                color = CircleCountdown.defaultColor;
            }
            if (typeof color == "number") {
                color = { color, weight: 1 };
            }
            this.reset();
            this.addCfg(color);
            if (cfgs && cfgs.length) {
                cfgs.forEach(color => {
                    this.addCfg(color);
                })
            }
            return this;
        }

        addCfg(color: CircleCountdownCfg) {
            color = color.clone() as CircleCountdownCfg;
            let colors = this._cfgs;
            let prev = colors[colors.length - 1];
            if (prev && !prev.noGradient) {//如果使用渐变色，上一个点的结束颜色使用当前颜色值
                prev.endColor = color.color;
            }
            let total = this._total;
            color.start = total;
            total += color.weight;
            color.end = total;
            this._total = total;

            //不做pushOnce，允许下面这种配置
            //var a={color:0xff0000,point:1}; colors=[a,{color:0x00ff00,point:2},a];
            colors.push(color);
            return this;
        }

        reset() {
            this._cfgs.length = 0;
            this._total = 0;
            this._cfg = undefined;
            return this;
        }

        progress(value: number, maxValue: number) {
            if (value < 0) {
                value = 0;
            }
            if (maxValue < 0) {
                if (DEBUG) {
                    ThrowError("进度条最大宽度不应小等于0");
                }
                maxValue = 0.00001;
            }
            if (value > maxValue) {
                value = maxValue;
            }
            this._p = value / maxValue;
            Global.callLater(this.render, 0, this);
        }

        public reuse(){
            this.isEnd = false;
        }
        public clear() {
            this.isEnd = true;
            //清理绘制
            this._g.clear();
        }

        protected render() {
            if(this.isEnd){
                return;
            }
            const cfgs = this._cfgs;
            let len = cfgs.length;
            let p = this._p;
            let c = p * this._total;
            let current: CircleCountdownCfg;
            for (let i = 0; i < len; i++) {
                current = cfgs[i];
                if (current.end > c) {
                    break;
                }
            }
            if (current) {
                let delta = (c - current.start) / current.weight;
                let scolor = current.color;
                let ccolor = current.endColor; // r<<16 | g<<8 | b
                let r = getColor(scolor, ccolor, delta, 16);
                let g = getColor(scolor, ccolor, delta, 8);
                let b = getColor(scolor, ccolor, delta, 0);
                let reverse = current.shine && (p * 100 & 1);
                if (reverse) {// 反色处理
                    r ^= b;
                    b ^= r;
                    r ^= b;
                    g = ~g;
                }
                let color = r << 16 | g << 8 | b;

                //绘制
                let _g = this._g;
                _g.clear();
                _g.lineStyle(this._sw, color);
                let sRad = this._sRad;
                _g.drawArc(this._cX, this._cY, this._radius, sRad, sRad + this._dRad * p);

            }
            function getColor(start: number, end: number, delta: number, shift: number) {
                let sC = start >> shift & 0xff;
                let eC = end >> shift & 0xff;
                return Math.round(sC + (eC - sC) * delta);
            }
        }
    }

    /**
     * 圆圈倒计时配置
     * 
     * @export
     * @interface CircleCountdownCfg
     * @extends {Object}
     */
    export interface CircleCountdownCfg extends Object {
        /**
         * 
         * 使用的起始颜色
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        color: number;

        /**
         * 颜色权值
         * 
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        weight: number;

        /**
         * 是否不做渐变，默认基于下一个点做渐变
         * 
         * @type {boolean}
         * @memberOf CircleCountdownCfg
         */
        noGradient?: boolean;

        /**
         * 是否闪烁
         * 
         * @type {boolean}
         * @memberOf CircleCountdownCfg
         */
        shine?: boolean;

        /**
         * 起始点
         * 
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        start?: number;

        /**
         * 结束点
         * 
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        end?: number;

        /**
         * 结束颜色
         * 
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        endColor?: number;
    }
}