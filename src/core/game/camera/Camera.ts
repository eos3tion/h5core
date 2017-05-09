module junyou {
	/**
	 * 相机
	 * @author 3tion
	 *
	 */
    export class Camera extends egret.HashObject {

        /**
         * 可视区域大小
         */
        protected _rect: egret.Rectangle;

        /**
         * 设置范围限制
         * 
         * @protected
         * @type {egret.Rectangle}
         * @memberOf Camera
         */
        protected _limits: egret.Rectangle;

        /**
         * 镜头要跟随的目标
         */
        protected _target: { x: number, y: number };
        private _lastPos: number;

        protected _changed: boolean;

        get changed(): boolean {
            const target = this._target;
            if (target) {
                let pos = target.x << 16 | (target.y & 0xffff);
                if (pos != this._lastPos) {
                    this._lastPos = pos;
                    return true;
                }
            }
            return this._changed;
        }

        /**
         * 标记已经改变完
         */
        public change() {
            this._changed = false;
        }

        constructor(width: number = 0, height: number = 0) {
            super();
            this._rect = new egret.Rectangle();
            let stage = egret.sys.$TempStage;
            if (!width) {
                width = stage.stageWidth;
            }
            if (!height) {
                height = stage.stageHeight;
            }
            this.setSize(width, height);
        }

        /**          
         * 相机跟随一个可视对象          
         * @param target 镜头要跟随的目标          
         */
        public lookat(target: { x: number, y: number }): Boolean {
            this._target = target;
            return !!target;
        }

        /**
         * 设置相机的可视区域宽度和高度
         * @param width 可视区宽
         * @param height 可视区高
         */
        public setSize(width: number, height: number) {
            let rect = this._rect;
            if (width != rect.width) {
                rect.width = width;
                this._changed = true;
            }
            if (height != rect.height) {
                rect.height = height;
                this._changed = true;
            }
            return this;
        }

        public setLimits(width = Infinity, height = Infinity, x = 0, y = 0) {
            this._limits = new egret.Rectangle(x, y, width, height);
            return this;
        }

        /**
         * 将相机移动到指定坐标
         */
        public moveTo(x: number, y: number) {
            let rect = this._rect;
            let rw = rect.width;
            let rh = rect.height;
            x = x - (rw >> 1);
            y = y - (rh >> 1);
            let limits = this._limits;
            if (limits) {
                x = Math.clamp(x, limits.x, limits.width - rw);
                y = Math.clamp(y, limits.y, limits.height - rh);
            }

            if (x != rect.x) {
                rect.x = x;
                this._changed = true;
            }
            if (y != rect.y) {
                rect.y = y;
                this._changed = true;
            }
            return this;
        }

        /**
         * 获取相机显示区域
         */
        get rect(): egret.Rectangle {
            let target = this._target;
            if (target) {
                this.moveTo(target.x, target.y);
            }
            return this._rect;
        }
    }
}
