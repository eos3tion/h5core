module junyou {
    import TE = egret.TouchEvent;
    import E = egret.Event;
    export class Scroller extends egret.EventDispatcher {

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
        public minEndSpeed = 0.0001;

        /**速度递减速率 */
        public blockSpeed = 0.98;

        protected _useScrollBar: boolean;

        protected _deriction = 1;

        protected _moveSpeed = 0;

        protected _lastFrameTime: number;

        public constructor() {
            super();
        }
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
        public set scrollType(value: ScrollDirection) {
            this._scrollType = value;
            this.checkScrollBarView();
        }
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
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
            let scrollType = this._scrollType;
            scrollbar.scrollType = scrollType;
            let rect = content.scrollRect;
            if (scrollType == ScrollDirection.Vertical) {
                scrollbar.bgSize = rect.height;
                scrollbar.y = content.y;
            } else {
                scrollbar.bgSize = rect.width;
                scrollbar.x = content.x;
            }

        }

        protected onScrollBarAdded() {
            if (this.alwaysShowBar) {
                this._scrollbar.alpha = 1;
            } else {
                this._scrollbar.alpha = 0;
            }
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
                    old.off(TE.TOUCH_BEGIN, this.onTargetTouchBegin, this);
                    old.off(EventConst.Resize, this.contentSizeChange, this);
                    content.stage.off(TE.TOUCH_MOVE, this.moveOnContent, this);
                    content.off(TE.TOUCH_END, this.endTouchContent, this);
                    content.off(TE.TOUCH_RELEASE_OUTSIDE, this.endTouchContent, this);
                }
            }
            this._content = content;
            if ("scroller" in content) {
                content["scroller"] = this;
            }
            content.touchEnabled = true;
            content.on(TE.TOUCH_BEGIN, this.onTargetTouchBegin, this);
            content.on(EventConst.Resize, this.contentSizeChange, this);
            if (scrollbar) {
                this._scrollbar = scrollbar;
                this._useScrollBar = true;
                this.checkScrollBarView();
                this.scaleBar();
                if (scrollbar.stage) {
                    this.onScrollBarAdded();
                } else {
                    scrollbar.on(E.ADDED_TO_STAGE, this.onScrollBarAdded, this);
                }

            } else {
                this._useScrollBar = false;
            }
            this.scrollToHead();
        }

        public bindObj2(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar) {
            content.x = scrollRect.x;
            content.y = scrollRect.y;
            scrollRect.x = 0;
            scrollRect.y = 0;
            this.bindObj(content, scrollRect, scrollbar);
        }

        protected contentSizeChange() {
            if (this._useScrollBar) {
                this.scaleBar();
            }
        }

        protected onTargetTouchBegin(e: TE) {
            let content = this._content;
            if (!content) {
                return;
            }
            let scrollRect = content.scrollRect;
            let pos: number
            if (this._scrollType == ScrollDirection.Vertical) {
                if (content.measuredHeight < scrollRect.height) {
                    return;
                }
                pos = e.stageY;

            } else {
                if (content.measuredWidth < scrollRect.width) {
                    return;
                }
                pos = e.stageX;
            }
            this._lastMoveTime = Global.now;
            this._lastTargetPos = pos;
            content.stage.on(TE.TOUCH_MOVE, this.moveOnContent, this);
            content.on(TE.TOUCH_END, this.endTouchContent, this);
            content.on(TE.TOUCH_RELEASE_OUTSIDE, this.endTouchContent, this);
            this.showBar();
        }


        protected moveOnContent(e: TE) {
            let currentPos: number;
            if (this._scrollType == ScrollDirection.Vertical) {
                currentPos = e.stageY;
            } else {
                currentPos = e.stageX;
            }
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
            this._content.off(E.ENTER_FRAME, this.onEnterFrame, this);
        }

        protected onEnterFrame() {
            let content = this._content;
            if (!content) {
                return;
            }
            if (this._moveSpeed == 0) {
                content.off(E.ENTER_FRAME, this.onEnterFrame, this);
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

        protected endTouchContent(e: egret.TouchEvent) {
            let content = this._content;
            if (!content) {
                return;
            }
            content.stage.off(TE.TOUCH_MOVE, this.moveOnContent, this);
            content.off(TE.TOUCH_END, this.endTouchContent, this);
            content.off(TE.TOUCH_RELEASE_OUTSIDE, this.endTouchContent, this);
            let now = Global.now;
            if (now - this._lastMoveTime < 150) {
                content.on(E.ENTER_FRAME, this.onEnterFrame, this);
                this._lastFrameTime = this._lastMoveTime;
            }
            else {
                this.hideBar();
            }
        }

        public showBar() {
            if (this._useScrollBar) {
                if (!this.alwaysShowBar) {
                    let tween: junyou.Tween = Global.getTween(this._scrollbar, undefined, undefined, true);
                    tween.to({ alpha: 1 }, 500);
                }
            }
        }

        public hideBar() {
            if (this._useScrollBar) {
                if (!this.alwaysShowBar) {
                    let tween = Global.getTween(this._scrollbar, undefined, undefined, true);
                    tween.to({ alpha: 0 }, 1000);
                }
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
            let oldx = rect.x;
            let oldy = rect.y;
            let scrollEnd = this.scrollEndPos;
            if (this._scrollType == ScrollDirection.Vertical) {
                rect.y -= sub;
                if (rect.y <= 0) {
                    rect.y = 0;
                    this._moveSpeed = 0;
                }
                if (rect.y >= scrollEnd) {
                    rect.y = scrollEnd;
                    this._moveSpeed = 0;
                }
            }
            else {
                rect.x -= sub;
                if (rect.x <= 0) {
                    rect.x = 0;
                    this._moveSpeed = 0;
                }
                if (rect.x >= scrollEnd) {
                    rect.x = scrollEnd;
                    this._moveSpeed = 0;
                }
            }
            content.scrollRect = rect;
            if (oldx != rect.x || oldy != rect.y) {
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

            let barPos: number;
            let subPos: number = sub / this._piexlDistance;
            let flag = this._scrollType == ScrollDirection.Vertical;
            if (flag) {
                barPos = bar.y;
            } else {
                barPos = bar.x;
            }
            barPos = barPos - subPos;
            if (barPos <= 0) {
                barPos = 0;
            } else {
                let delta = scrollbar.bgSize - scrollbar.barSize;
                if (barPos >= delta) {
                    barPos = delta;
                }
            }
            if (flag) {
                bar.y = barPos;
            } else {
                bar.x = barPos;
            }
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
            }
            else {
                let rect = this._content.scrollRect;
                let curpos: number;
                if (this._scrollType == ScrollDirection.Vertical) {
                    curpos = rect.y;
                } else {
                    curpos = rect.x;
                }
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
                this._content.off(E.ENTER_FRAME, this.onEnterFrame, this);
            }

            let rect = content.scrollRect;
            let scrollbar = this._scrollbar;
            let bar: egret.Sprite;
            if (scrollbar) {
                bar = scrollbar.bar;
            }
            if (this._scrollType == ScrollDirection.Vertical) {
                rect.y = 0;
                if (bar) {
                    bar.y = 0;
                }
            } else {
                rect.x = 0;
                if (bar) {
                    bar.x = 0;
                }
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
            if (this._scrollType == ScrollDirection.Vertical) {
                rect.y = end;
                if (bar) {
                    bar.y = delta;
                }
            }
            else {
                rect.x = end;
                if (bar) {
                    bar.x = delta;
                }
            }
            content.scrollRect = rect;
        }

        protected scaleBar() {
            let content = this._content;
            if (!content) {
                return;
            }
            let contentSize: number;
            if (this._scrollType == ScrollDirection.Vertical) {
                contentSize = content.measuredHeight;
            }
            else {
                contentSize = content.measuredWidth;
            }
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
            let contentSize: number, scrollSize: number;
            let rect = content.scrollRect;
            if (this._scrollType == ScrollDirection.Vertical) {
                contentSize = content.measuredHeight;
                scrollSize = rect.height;
            }
            else {
                contentSize = content.measuredWidth;
                scrollSize = rect.width;
            }
            return contentSize - scrollSize;
        }

        protected checkAndResetBarPos() {
            let rect = this._content.scrollRect;
            let scrollbar = this._scrollbar;
            let bar = scrollbar.bar;
            let scrollEnd = this.scrollEndPos;
            if (this._scrollType == ScrollDirection.Vertical) {
                let tmp = rect.y / scrollEnd;
                if (tmp <= 0) {
                    bar.y = 0;
                } else {
                    bar.y = scrollbar.bgSize * tmp - scrollbar.barSize;
                }

            }
            else {
                let tmp = rect.x / scrollEnd;
                if (tmp <= 0) {
                    bar.x = 0;
                } else {
                    bar.x = scrollbar.bgSize * tmp - scrollbar.barSize;
                }
            }
        }
    }
}