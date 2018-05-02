namespace jy {
    /**
     * 带方向的震动
     * 
     * @export
     * @class DirectionShake
     * @extends {BaseShake}
     */
    export class DirectionShake extends BaseShake {

        /**
         * 振幅的增量
         * 
         * @private
         * @type {number}
         */
        private _dSwing: number;

        private _count: number;

        /**
         * 震动方向的 Math.cos
         */
        private _cos: number;

        /**
         * 震动方向的 Math.sin
         */
        private _sin: number;
        /**
         * 振幅的单位时间增量
         */
        private _dRad: number;

        /**
         * 
         * 初始化一个有方向的Shake
         * @param {number} fx           起点x
         * @param {number} fy           起点y
         * @param {number} tx           目标x
         * @param {number} ty           目标y
         * @param {number} [cx]         单位X方向基准值      一般为单位初始值
         * @param {number} [cy]         单位Y方向基准值      一般为单位初始值
         * @param {number} [swing=30]   最大振幅，振幅会按次数衰减到0
         * @param {number} [count=3]    震动次数，此次数指的是 单摆摆动的从`最低点`到`最高点`再回到`最低点`，  即一次完整的摆动 下->左->下   或者 下->右->下
         * @param {number} [time=90]    单次震动的时间
         */
        public init1(fx: number, fy: number, tx: number, ty: number, cx?: number, cy?: number, swing = 30, count = 3, time = 90) {
            let dx = tx - fx;
            let dy = ty - fy;
            let dist = Math.sqrt(dx * dx + dy * dy);
            this.init(dx / dist, dy / dist, cx, cy, swing, count, time);
        }


        /**
         * 初始化一个有方向的Shake
         * @param {number} rad              方向(弧度)			使用Math.atan2(toY-fromY,toX-fromX)
         * @param {number} [cx]             单位X方向基准值      一般为单位初始值
         * @param {number} [cy]             单位Y方向基准值      一般为单位初始值
         * @param {number} [swing=30]       最大振幅，振幅会按次数衰减到0
         * @param {number} [count=3]        震动次数，此次数指的是 单摆摆动的从`最低点`到`最高点`再回到`最低点`，  即一次完整的摆动 下->左->下   或者 下->右->下
         * @param {number} [time=90]        单次震动的时间
         */
        public init2(rad: number, cx?: number, cy?: number, swing = 30, count = 3, time = 90) {
            this.init(Math.cos(rad), Math.sin(rad), cx, cy, swing, count, time);
        }

        public init(cos: number, sin: number, cx?: number, cy?: number, swing = 30, count = 3, time = 90) {
            if (~~time < 30) {
                time = 30;
            }
            if (~~count < 1) {
                count = 1;
            }
            let total = time * count;
            this._dSwing = -swing / total;
            this._dRad = Math.PI / time;
            this._count = count;
            this.setTargetPos(cx, cy);
            this._cos = cos;
            this._sin = sin;
            this._total = total;
            return this;
        }

        tick(duration: number, outPt: { x: number, y: number }) {
            let swing = this._dSwing * duration * Math.sin(duration * this._dRad);
            outPt.x = Math.round(this._cx + this._cos * swing);
            outPt.y = Math.round(this._cy + this._sin * swing);
        }
    }
}