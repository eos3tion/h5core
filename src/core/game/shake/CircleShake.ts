namespace jy {

    /**
     * 旋转的屏幕抖动
     * 角度统一从0开始，正向或者逆向旋转，振幅从最大到0
     * 
     * @export
     * @class CircleShake
     * @extends {BaseShake}
     * @author 3tion
     */
    export class CircleShake extends BaseShake {

        /**
         * 结束的弧度
         * @private
         * @type {number}
         */
        private _eR: number;

        /**
         * 振幅
         */
        private _swing: number;

        /**
         * 单位时间弧度增量
         */
        private _dRad: number;

        /**
         * 单位时间振幅增量
         */
        private _dSwing: number;

        /**
         * 
         * 
         * @param {number} swing        最大振幅
         * @param {number} endRad       结束角度
         * @param {number} [cx]         单位X方向基准值      一般为单位初始值
         * @param {number} [cy]         单位Y方向基准值      一般为单位初始值
         * @param {number} [time=150]   单圈的时间，震动总时间为  endRad / Math.PI2 * time
         * @returns
         */
        public init(swing: number, endRad: number, cx?: number, cy?: number, time = 150) {
            this._eR = endRad;
            /**
             * 总时间
             */
            let total = endRad / Math.PI2 * time;
            if (swing < 0) {
                swing = -swing;
            }
            this._swing = swing;
            this._dRad = endRad / total;
            this._dSwing = -swing / total;
            this._total = total;
            this.setTargetPos(cx, cy);
            return this;
        }

        tick(duration: number, outPt: { x: number, y: number }) {
            let rad = duration * this._dRad;
            let swing = this._swing + duration * this._dSwing;
            outPt.x = Math.round(this._cx + swing * Math.cos(rad));
            outPt.y = Math.round(this._cy + swing * Math.sin(rad));
        }

    }
}