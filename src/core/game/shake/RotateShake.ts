namespace jy {


    /**
     * 旋转抖动  
     * 屏幕朝顺时针/逆时针方向抖动一定角度  
     * 抖动从0绝对距离的偏移开始，当中间角度时，达到最大偏移值，最后回到0偏移值  
     * 偏移:swing*( sin 0) 角度：startRad ---------->偏移:swing*( sin Math.PI/2) 角度： (startRad + endRad)/2 -------------->偏移:swing*( sin Math.PI) 角度： endRad
     * 
     * @export
     * @class RotateShake
     * @extends {BaseShake}
     * @author 3tion
     */
    export class RotateShake extends BaseShake {
        /**
         * 起始弧度
         * 
         * @private
         * @type {number}
         */
        private _sR: number;

        /**
         * 结束弧度
         * 
         * @private
         * @type {number}
         */
        private _eR: number;

        /**
         * 单位时间弧度增量
         * 
         * @private
         * @type {number}
         */
        private _dRad: number;

        /**
         * 最大振幅
         * 
         * @private
         * @type {number}
         */
        private _swing: number;

        /**
         * 
         * 
         * @param {number} startRad     起始角度
         * @param {number} endRad       结束角度
         * @param {number} [swing=30]   最大振幅    
         * @param {number} [cx]         单位X方向基准值      一般为单位初始值
         * @param {number} [cy]         单位Y方向基准值      一般为单位初始值
         * @param {number} [total=150]  总时间
         * @returns
         */
        public init(startRad: number, endRad: number, swing = 30, cx?: number, cy?: number, total = 150) {
            this._sR = startRad;
            this._eR = endRad;
            this._swing = swing;
            this._dRad = (endRad - startRad) / total;
            this.setTargetPos(cx, cy);
            return this;
        }

        tick(duration: number, outPt: { x: number, y: number }) {
            let rad = duration * this._dRad;
            let swing = this._swing + Math.sin(duration * Math.PI);
            outPt.x = Math.round(this._cx + swing * Math.cos(rad));
            outPt.y = Math.round(this._cy + swing * Math.sin(rad));
        }

    }
}