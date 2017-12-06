module junyou {

    /**
     * 屏幕抖动管理器
     * 
     * @export
     * @class ScreenShakeManager
     */
    export class ScreenShakeManager {

        /**
         * 释放可震动
         * 
         * @type {boolean}
         */
        public shakable: boolean = true;

        /**
         * 当前的震动
         * 
         * @private
         * @type {Shake}
         */
        private _cur: Shake;

        private _limits: egret.Rectangle;

        private _pt = { x: 0, y: 0 };

        public setLimits(width = Infinity, height = Infinity, x = 0, y = 0) {
            this._limits = new egret.Rectangle(x, y, width, height);
            return this;
        }

        private _tmp: egret.Rectangle = new egret.Rectangle();


        /**
         * 
         * 开始时间
         * @protected
         * @type {number}
         */
        protected _st: number;


        /**
         * 开始一个新的震动
         * 
         * @template T 
         * @param {T} shake 
         * @returns T
         */
        public start<T extends Shake>(shake: T) {
            if (this.shakable) {
                let cur = this._cur;
                if (cur) {
                    cur.end();
                }
                this._cur = shake;
                let engine = GameEngine.instance;
                let layer = engine.getLayer(GameLayerID.Game);
                if (cur != shake) {
                    shake.setShakeTarget(layer).setTargetPos();
                }
                shake.start();
                this._st = Global.now;
                egret.startTick(this.tick, this);
            }
            return shake;
        }

        public tick() {
            let shake = this._cur;
            let duration = Global.now - this._st;
            if (duration < shake.total) {
                let pt = this._pt;
                let cur = this._cur;
                cur.tick(duration, pt);
                let target = cur.target;
                let limits = this._limits;
                let px = pt.x;
                let py = pt.y;
                let x = px, y = py;
                if (limits) {
                    let rect = GameEngine.instance.viewRect;
                    if (px < 0) {
                        let lx = limits.x;
                        let rx = rect.x;
                        x = rx + px > lx ? px : lx;
                    } else {
                        let dw = limits.width - rect.width;
                        x = px < dw ? px : dw;
                    }
                    if (py < 0) {
                        let ly = limits.y;
                        let ry = rect.y;
                        y = ry + py > ly ? px : ly;
                    } else {
                        let dh = limits.height - rect.height;
                        y = py < dh ? py : dh;
                    }
                }
                target.x = x;
                target.y = y;
            } else {
                shake.end();
            }
            return true;
        }
    }
}