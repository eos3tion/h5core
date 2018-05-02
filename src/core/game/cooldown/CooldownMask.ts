namespace jy {
    /**
     * 时间冷却遮罩
     * @author pb
     */
    export class CooldownMask implements ICooldownDisplay {

        private static _45: number = Math.PI * 0.25;

        private static _135: number = Math.PI * 0.75;

        private static _225: number = Math.PI * 1.25;

        private static _315: number = Math.PI * 1.75;

        //private static _360: number = Math.PI * 2;

        private static _gt180: number = Math.PI * 180.1 / 180;

        private static _lt180: number = Math.PI * 179.9 / 180;

        private static COLOR: number = 0;

        private static ALPHA: number = .6;

		/**
		 * 起始点 x偏移
		 */
        private _ox: number;
		/**
		 * 起始点 y偏移
		 */
        private _oy: number;

		/**
		 * 绘制灰色CD遮罩
		 */
        private _g: egret.Graphics;

		/**
		 * cd实例
		 */
        //private _cd: Cooldown;

		/**
		 * 角度
		 */
        //private _radus: number;

        private _x: number;

        private _y: number;

		/**
		 * 灰色遮罩的边长
		 */
        private _sl: number;

		/**
		 * 灰色遮罩的一半长度
		 */
        private _hl: number;

        private _mask: egret.Shape;

        /*单位时间增加的角度*/
        private _deltaRadian: number;

        /**
        * 已经持续的时间
        */
        private _duration: number;

        constructor(sl: number, ox?: number, oy?: number) {
            this._sl = sl;
            this._hl = this._sl >> 1;
            this._ox = ox;
            this._oy = oy;
        }

        /**
         * 绑定组件皮肤
         * 添加遮罩到组件皮肤
         */
        public bind(target: egret.Sprite): void {
            this._mask = new egret.Shape();
            this._g = this._mask.graphics;
            if (target) {
                target.addChild(this._mask);
            }
        }

        /**
         * 解除绑定组件皮肤
         */
        public unbind(): void {
            if (this._mask.parent) {
                this._mask.parent.removeChild(this._mask);
            }
        }

        public setRadian(radian: number) {
            if (this._mask.stage) {
                let g = this._g;
                g.clear();
                g.beginFill(CooldownMask.COLOR, CooldownMask.ALPHA);

                let hl = this._hl;
                let sl = this._sl;
                let oy = this._oy;
                let ox = this._ox;
                let x = this._x;
                let y = this._y;

                if (radian < CooldownMask._45) {
                    y = oy;
                    x = hl + Math.tan(radian) * hl;
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(sl, oy);
                    g.lineTo(sl, sl);
                    g.lineTo(ox, sl);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._45 && radian < CooldownMask._135) {
                    x = sl;
                    y = hl - hl / Math.tan(radian);
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(sl, sl);
                    g.lineTo(ox, sl);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._135 && radian < CooldownMask._225) {
                    y = sl;
                    x = radian > CooldownMask._lt180 && radian < CooldownMask._gt180 ? hl : hl - hl * Math.tan(radian);
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(ox, sl);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._225 && radian < CooldownMask._315) {
                    x = ox;
                    y = hl + hl / Math.tan(radian);
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._315) {
                    y = oy;
                    x = hl + Math.tan(radian) * hl;
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(hl, oy);
                }
                g.endFill();
            }
        }

        /*渲染处理*/
        public doRender(delta: number): void {
            this._duration = ~~this._duration + delta;
            let radian = this._deltaRadian * this._duration;
            this.setRadian(radian);
        }

        public add(cdTotalTime: number): void {
            if (cdTotalTime) {
                this._deltaRadian = Math.PI * 2 / cdTotalTime;
            }
            this._duration = 0;
            let g = this._g;
            g.clear();
            g.beginFill(CooldownMask.COLOR, CooldownMask.ALPHA);
            g.drawRect(this._ox, this._oy, this._sl, this._sl);
            g.endFill();
        }

        public remove(): void {
            this._duration = 0;
            this._deltaRadian = 0;
            if (this._g) {
                this._g.clear();
            }
        }

        public dispose(): void {
            this.remove();
            this.unbind();
        }
    }
}