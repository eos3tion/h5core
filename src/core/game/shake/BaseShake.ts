namespace jy {
    /**
     * 
     * 震动的基本实现
     * @export
     * @class BaseShake
     * @implements {Shake}
     * @author 3tion
     */
    export abstract class BaseShake implements Shake {
        /**
         * 释放正在震动
         * 
         * @protected
         * @type {boolean}
         */
        protected _shaking: boolean;

        /**
         * 震动目标
         * 
         * @protected
         * @type {ShakeTarget}
         */
        protected _target: ShakeTarget;

        public get target() {
            return this._target;
        }

        /**
         * 单位X方向基准值      一般为单位初始值
         * 
         * @protected
         * @type {number}
         */
        protected _cx: number;
        /**
         * 单位Y方向基准值      一般为单位初始值
         * 
         * @protected
         * @type {number}
         */
        protected _cy: number;


        protected _total: number;
        /**
         * 总执行时间
         */
        public get total() {
            return this._total;
        }

        public setShakeTarget(target: ShakeTarget): Shake {
            this._target = target;
            return this;
        }

        /**
         * 设置单位基准值
         * 
         * @param {number} [cx]
         * @param {number} [cy]
         */
        public setTargetPos(cx?: number, cy?: number) {
            let target = this._target;
            if (cx === undefined) cx = target ? target.x : 0;
            if (cy === undefined) cy = target ? target.y : 0;
            this._cx = cx;
            this._cy = cy;
            return this;
        }


        public start(): void {
            if (this._target) {
                this._shaking = true;
            }
        }

        public abstract tick(duration: number, outPt: { x: number, y: number });


        public end(): void {
            if (this._shaking) {
                let { _cx, _cy, _target } = this;
                if (_target.dispatch) {
                    _target.dispatch(EventConst.ShakeEnd, { x: _cx, y: _cy });
                } else {
                    _target.x = _cx;
                    _target.y = _cy;
                }
                this._shaking = false;
            }
        }

        /**
         * 销毁的处理
         */
        public dispose() {
            this._target = undefined;
        }
    }
}