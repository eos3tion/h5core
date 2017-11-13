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
                    shake.setShakeTarget(layer);
                }
                shake.start();
                this._st = Global.now;
                egret.startTick(this.tick, this);
                // engine.checkViewRect = this.checkViewRect;
                // Global.clearCallLater(this.clearShakeRect);
            }
            return shake;
        }

        // private checkViewRect = (rect: egret.Rectangle) => {
        //     let limits = this._limits;
        //     let tmp = this._tmp;
        //     let x = rect.x - 50;
        //     let y = rect.y - 50;
        //     let width = rect.width + 100;
        //     let height = rect.height + 100;
        //     if (limits) {
        //         tmp.setTo(Math.clamp(x, limits.x, limits.width), Math.clamp(y, limits.y, limits.height), Math.clamp(width, limits.x, limits.width), Math.clamp(height, limits.y, limits.height));
        //     } else {
        //         tmp.setTo(x, y, width, height);
        //     }
        //     return tmp;
        //     // return this._tmp.setTo(rect.x - 50, rect.y - 50, rect.width + 100, rect.height + 100);
        // }


        public tick() {
            let shake = this._cur;
            let duration = Global.now - this._st;
            if (duration < shake.total) {
                let pt = this._pt;
                let cur = this._cur;
                cur.tick(duration, pt);
                let target = cur.target;
                let limits = this._limits;
                if (limits) {
                    let rect = GameEngine.instance.viewRect;
                    let px = pt.x;
                    let py = pt.y;
                    let x: number, y: number;
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
                    target.x = x;
                    target.y = y;
                }
            } else {
                shake.end();
                // Global.callLater(this.clearShakeRect, 30000);
            }
            return true;
        }

        // private clearShakeRect() {
        //     GameEngine.instance.checkViewRect = undefined;
        // }
    }
}