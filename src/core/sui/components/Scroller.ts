module junyou {


    export class Scroller extends egret.EventDispatcher {
        /**
         * 开始拖拽时的坐标
         */
        _startPos: number;
        protected _scrollbar: ScrollBar;

        protected _content: egret.DisplayObject;

        protected _scrollType = ScrollDirection.Vertical;

        protected _lastMoveTime: number;

        protected _lastTargetPos: number;

        /***滑块移动一像素，target滚动的距离*/
        protected _piexlDistance: number;

        /**鼠标每移动1像素，元件移动的像素 */
        public globalspeed = 1;

        /***是不是一直显示滚动条 */
        public alwaysShowBar: boolean;

        /**最小的滑动速度，当前值低于此值后不再滚动 */
        public minEndSpeed = 0.08;

        /**速度递减速率 */
        public blockSpeed = 0.98;

        protected _useScrollBar: boolean;


        protected _moveSpeed = 0;

        protected _lastFrameTime: number;

        protected _deriction = ScrollDirection.Vertical;
        protected _key = PosKey.Y;
        protected _sizeKey = SizeKey.Height;
        protected _measureKey = EgretMeasureSizeKey.Height;

        public constructor() {
            super();
        }
        /**
         * 滚动条方式 0：垂直，1：水平 defalut:0
         */
        public set scrollType(value: ScrollDirection) {
            if (this._scrollType != value) {
                this._scrollType = value;
                let key: PosKey, sizeKey: SizeKey, measureKey: EgretMeasureSizeKey;
                if (value == ScrollDirection.Vertical) {
                    key = PosKey.Y;
                    sizeKey = SizeKey.Height;
                    measureKey = EgretMeasureSizeKey.Height;
                } else {
                    key = PosKey.X;
                    sizeKey = SizeKey.Width;
                    measureKey = EgretMeasureSizeKey.Width;
                }
                this._sizeKey = sizeKey;
                this._key = key;
                this._measureKey = measureKey;
                this.checkScrollBarView();
            }
        }
        /**
         * 滚动条方式 0：垂直，1：水平 defalut:0
         */
        public get scrollType() {
            return this._scrollType;
        }

        protected checkScrollBarView() {
            let content = this._content;
            if (!content) {
                return;
            }
            let scrollbar = this._scrollbar;
            if (!scrollbar) {
                return;
            }
            let { _key, _sizeKey, _scrollType } = this;
            scrollbar.scrollType = _scrollType;
            let rect = content.scrollRect;
            scrollbar.bgSize = rect[_sizeKey];
            scrollbar[_key] = content[_key];
        }

        protected onScrollBarAdded() {
            this._scrollbar.alpha = ~~this.alwaysShowBar;
        }

        /**
         * 绑定目标与滚动条
         * 
         * @ content (需要滚动的目标)
         * @ scrollRect (显示的区域大小)
         * @ scrollbar (可选，如果不想显示滚动条可不传)
         */
        public bindObj(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar) {
            content.scrollRect = scrollRect;
            let old = this._content;
            if (old != content) {
                if (old) {
                    old.off(EgretEvent.ENTER_FRAME, this.onRender, this);
                    old.off(EventConst.Resize, this.onResize, this);
                    looseDrag(old);
                    old.off(EventConst.DragStart, this.onDragStart, this);
                    old.off(EventConst.DragMove, this.onDragMove, this);
                    old.off(EventConst.DragEnd, this.onDragEnd, this);
                }
                this._content = content;
                if (content) {
                    bindDrag(content);
                    content.on(EventConst.DragStart, this.onDragStart, this);
                    content.on(EventConst.Resize, this.onResize, this);
                }
                if ("scroller" in content) {
                    content["scroller"] = this;
                }
            }
            if (scrollbar) {
                this._scrollbar = scrollbar;
                this._useScrollBar = true;
                this.checkScrollBarView();
                this.scaleBar();
                if (scrollbar.stage) {
                    this.onScrollBarAdded();
                } else {
                    scrollbar.on(EgretEvent.ADDED_TO_STAGE, this.onScrollBarAdded, this);
                }

            } else {
                this._useScrollBar = false;
            }
            this.scrollToHead();
        }

        /**
         * 对content绘制鼠标触发区域  
         * 将会对content的graphics先进行清理  
         * 然后基于content的bounds进行绘制
         * 
         */
        public drawTouchArea(content?: egret.Shape) {
            content = content || this._content as egret.Shape;
            if (content) {
                let g = content.graphics;
                if (g) {
                    g.clear();
                    g.beginFill(0, 0);
                    let rect = Temp.EgretRectangle;
                    content.getBounds(rect);
                    g.drawRectangle(rect);
                    g.endFill();
                }
            }
        }

        public bindObj2(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar) {
            content.x = scrollRect.x;
            content.y = scrollRect.y;
            scrollRect.x = 0;
            scrollRect.y = 0;
            this.bindObj(content, scrollRect, scrollbar);
        }

        protected onResize() {
            if (this._useScrollBar) {
                this.scaleBar();
            }
        }

        protected onDragStart(e: egret.TouchEvent) {
            let content = this._content;
            if (!content) {
                return;
            }
            if (content[this._measureKey] < content.scrollRect[this._sizeKey]) {
                return
            }
            this._lastTargetPos = this._startPos = this.getDragPos(e);
            this._lastMoveTime = Global.now;
            this.showBar();
            content.on(EventConst.DragMove, this.onDragMove, this);
            content.on(EventConst.DragEnd, this.onDragEnd, this);
        }

        protected getDragPos(e: egret.TouchEvent) {
            return this._scrollType == ScrollDirection.Vertical ? e.stageY : e.stageX;
        }

        protected onDragMove(e: egret.TouchEvent) {
            let currentPos = this.getDragPos(e);
            let sub = currentPos - this._lastTargetPos;
            this._deriction = sub > 0 ? 1 : -1;
            sub = Math.abs(sub);
            let now = Global.now;
            let subTime = now - this._lastMoveTime;
            this._lastMoveTime = now;
            this._lastTargetPos = currentPos;
            this._moveSpeed = subTime > 0 ? sub / subTime : 0;
            sub = sub * this.globalspeed * this._deriction;
            this.doScrollContent(sub);
        }

        public stopTouchTween() {
            this._moveSpeed = 0;
            this._content.off(EgretEvent.ENTER_FRAME, this.onRender, this);
        }

        protected onRender() {
            let content = this._content;
            if (!content) {
                return;
            }
            if (this._moveSpeed == 0) {
                content.off(EgretEvent.ENTER_FRAME, this.onRender, this);
                this.hideBar();
                return;
            }
            let now = Global.now;
            let subTime = now - this._lastFrameTime;
            let moveSpeed = this._moveSpeed;
            let sub = moveSpeed * this._deriction * subTime * this.globalspeed;
            this.doScrollContent(sub);
            this._lastFrameTime = now;
            moveSpeed *= this.blockSpeed;
            if (moveSpeed < this.minEndSpeed) {
                moveSpeed = 0;
            }
            this._moveSpeed = moveSpeed;
        }

        protected onDragEnd(e: egret.TouchEvent) {
            let content = this._content;
            if (!content) {
                return;
            }
            let currentPos = this.getDragPos(e);
            let now = Global.now;
            if (now - this._lastMoveTime < 150) {
                content.on(EgretEvent.ENTER_FRAME, this.onRender, this);
                this._lastFrameTime = this._lastMoveTime;
            }
            else {
                this.hideBar();
            }
            content.off(EventConst.DragMove, this.onDragMove, this);
            content.off(EventConst.DragEnd, this.onDragEnd, this);
            this.dispatch(EventConst.ScrollerDragEnd, currentPos - this._startPos);
        }

        public showBar() {
            if (this._useScrollBar && !this.alwaysShowBar) {
                Global.getTween(this._scrollbar, null, null, true).to({ alpha: 1 }, 500);
            }
        }

        public hideBar() {
            if (this._useScrollBar && !this.alwaysShowBar) {
                Global.getTween(this._scrollbar, null, null, true).to({ alpha: 0 }, 1000);
            }
        }

        /**
         * 执行滚动
         * 
         * @ sub (滚动的距离)
         */
        public doScrollContent(sub: number) {
            let content = this._content;
            if (!content) {
                return;
            }
            let rect = content.scrollRect;
            let key = this._key;
            let old = rect[key];
            let pos = old;
            let scrollEnd = this.scrollEndPos;
            pos -= sub;
            let speed = this._moveSpeed;
            if (pos < 0) {
                pos = 0;
                speed = 0;
            } else if (pos > scrollEnd) {
                pos = scrollEnd;
                speed = 0;
            }
            this._moveSpeed = speed;

            if (old != pos) {
                rect[key] = pos;
                content.scrollRect = rect;
                content.dispatch(EventConst.SCROLL_POSITION_CHANGE);
            }
            this.doMoveScrollBar(sub);
        }

        public doMoveScrollBar(sub: number) {
            let scrollbar = this._scrollbar;
            if (!scrollbar) {
                return;
            }
            let bar = scrollbar.bar;
            let subPos = sub / this._piexlDistance;
            let key = this._key;
            let barPos = bar[key] - subPos;
            if (barPos <= 0) {
                barPos = 0;
            } else {
                let delta = scrollbar.bgSize - scrollbar.barSize;
                if (barPos >= delta) {
                    barPos = delta;
                }
            }
            bar[key] = barPos;
        }

        /**
         * 移动到指定位置
         * 
         * @ pos (位置)
         */
        public scrollTo(pos: number) {
            if (pos <= 0) {
                this.scrollToHead();
            } else if (pos >= this.scrollEndPos) {
                this.scrollToEnd();
            } else {
                let curpos = this._content.scrollRect[this._key];
                this.doScrollContent(pos - curpos);
            }
        }

        /**移动至头 */
        public scrollToHead() {
            let content = this._content;
            if (!content) {
                return;
            }
            if (this._moveSpeed > 0) {
                this._moveSpeed = 0;
                content.off(EgretEvent.ENTER_FRAME, this.onRender, this);
            }

            let rect = content.scrollRect;
            let scrollbar = this._scrollbar;
            let bar: egret.Sprite;
            if (scrollbar) {
                bar = scrollbar.bar;
            }
            let key = this._key;
            rect[key] = 0;
            if (bar) {
                bar[key] = 0;
            }
            content.scrollRect = rect;
        }
        /**移动至尾 */
        public scrollToEnd() {
            let content = this._content;
            if (!content) {
                return;
            }
            let rect = content.scrollRect;
            let end = this.scrollEndPos;
            let scrollbar = this._scrollbar;
            let bar: egret.Sprite, delta: number;
            if (scrollbar) {
                delta = scrollbar.bgSize - scrollbar.barSize;
                bar = scrollbar.bar;
            }
            let key = this._key;
            rect[key] = end;
            if (bar) {
                bar[key] = delta;
            }
            content.scrollRect = rect;
        }

        protected scaleBar() {
            let content = this._content;
            if (!content) {
                return;
            }
            let contentSize: number = content[this._measureKey];
            let scrollbar = this._scrollbar;
            let bgSize = scrollbar.bgSize;
            let scale = bgSize / contentSize;
            if (scale >= 1) {
                scale = 1;
            }
            scrollbar.barSize = bgSize * scale;
            this._piexlDistance = contentSize / bgSize;
            this.checkAndResetBarPos();
        }

        /**
         * 获取滚动到最后的起始点
         * 
         * @readonly
         * @protected
         */
        protected get scrollEndPos() {
            let content = this._content;
            if (!content) {
                return 0;
            }
            let rect = content.scrollRect;
            let contentSize: number = content[this._measureKey];
            let scrollSize: number = rect[this._sizeKey];
            return contentSize - scrollSize;
        }

        protected checkAndResetBarPos() {
            let rect = this._content.scrollRect;
            let scrollbar = this._scrollbar;
            let bar = scrollbar.bar;
            let scrollEnd = this.scrollEndPos;
            let key = this._key;
            let tmp = rect[key] / scrollEnd;
            if (tmp <= 0) {
                tmp = 0;
            } else {
                tmp = scrollbar.bgSize * tmp - scrollbar.barSize;
            }
            bar[key] = tmp;
        }
    }
}