namespace jy {
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

        //限制范围
        protected _lx = 0;
        protected _ly = 0;
        protected _lw = Infinity;
        protected _lh = Infinity;

        /**
         * 是否需要横向滚动
         * 
         * @protected
         * @memberof Camera
         */
        protected _hScroll = true;
        /**
         * 
         * 是否需要纵向滚动
         * 
         * @protected
         * @memberof Camera
         */
        protected _vScroll = true;

        /**
         * 镜头要跟随的目标
         */
        protected _host: { x: number, y: number };
        private _lastPos: number;

        protected _changed: boolean;

        /**
         * 是否限制关注的对象
         */
        protected limitHost: boolean;

        get changed(): boolean {
            const target = this._host;
            if (target) {
                let pos = getPosHash(target);
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

        constructor(width?: number, height?: number) {
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
         * 强制设置为改变  
         * 用于地图切换时，坐标不发生变化的情况
         * 
         */
        public invalidate() {
            this._changed = true;
        }

        /**          
         * 相机跟随一个可视对象          
         * @param target 镜头要跟随的目标    
         * @param limit 是否限制目标      
         */
        public lookat(target: Point, limit?: boolean): Boolean {
            this._host = target;
            this.limitHost = limit;
            return !!target;
        }

        /**
         * 获取当前镜头绑定的单位
         */
        get host() {
            return this._host;
        }

        /**
         * 设置相机的可视区域宽度和高度
         * @param width 可视区宽
         * @param height 可视区高
         */
        public setSize(width: number, height: number) {
            let rect = this._rect;
            let changed = this._changed;
            if (width != rect.width) {
                rect.width = width;
                changed = true;
            }
            if (height != rect.height) {
                rect.height = height;
                changed = true;
            }
            if (changed) {
                this._changed = changed;
                this.check();
            }
            return this;
        }

        /**
         * 设置限制范围
         * 
         * @param {number} [width=Infinity] 
         * @param {number} [height=Infinity] 
         * @param {number} [x=0] 
         * @param {number} [y=0] 
         * @returns 
         * @memberof Camera
         */
        public setLimits(width?: number, height?: number, x?: number, y?: number) {
            this._lx = x || 0;
            this._ly = y || 0;
            this._lw = width || Infinity;
            this._lh = height || Infinity;
            this.check();
            return this;
        }

        protected check() {
            let { _lw, _lh, _rect } = this;
            let { width: w, height: h } = _rect;
            let flag = w < _lw;
            this._hScroll = flag;
            if (!flag) {//可视范围比限制范围还要大，则直接居中显示
                _rect.x = 0;
            }
            flag = h < _lh;
            this._vScroll = flag;
            if (!flag) {
                _rect.y = 0;
            }
        }

        /**
         * 将相机移动到指定坐标
         */
        public moveTo(x: number, y: number, target?: Point) {
            let { _hScroll, _vScroll, _rect, _lx, _ly, _lw, _lh, limitHost } = this;
            let { width: rw, height: rh, x: rx, y: ry } = _rect;
            let changed = this._changed;
            if (_hScroll) {
                let hrw = rw * .5;
                let nx = x - hrw;
                let max = _lw - rw;
                if (nx < _lx) {
                    nx = _lx;
                } else if (nx > max) {
                    nx = max;
                }
                if (limitHost && target) {
                    target.x = nx + hrw;
                }
                if (nx != rx) {
                    _rect.x = nx;
                    changed = true;
                }
            }
            if (_vScroll) {
                let hrh = rh * .5;
                let ny = y - hrh;
                let max = _lh - rh;
                if (ny < _ly) {
                    ny = _ly;
                } else if (ny > max) {
                    ny = max;
                }
                if (limitHost && target) {
                    target.y = ny + hrh;
                }
                if (ny != ry) {
                    _rect.y = ny;
                    changed = true;
                }
            }
            this._changed = changed;
            return this;
        }

        /**
         * 获取相机显示区域
         */
        get rect(): egret.Rectangle {
            let target = this._host;
            if (target) {
                this.moveTo(target.x, target.y, target);
            }
            return this._rect;
        }
    }

    /**
     * 获取坐标点的hash值
     * 
     * @export
     * @param {Point} pos 
     * @returns 
     */
    export function getPosHash(pos: Point) {
        return pos.x << 16 | (pos.y & 0xffff)
    }

    export function getPosHash2(x: number, y: number) {
        return x << 16 | (y & 0xffff);
    }
}
