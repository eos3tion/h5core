namespace jy {

    /**
     * 翻页，一次手势翻一页
     * 
     * @export
     * @class PageScroller
     * @extends {Scroller}
     */
    export class PageScroller extends Scroller {

        /**
         * 当前在第几页
         * 
         * @type {number}
         */
        public currentPage = 1;

        public autoScrollSpeed = 1;

        public minPageScrollSpeed = 0.05;

        /**
         * 总共将显示对象切割成几页
         * 
         * @type {number}
         */
        private _totalpageCount = 1;

        private _firstTouchPos: number;

        private _pageSize: number;

        private _scrollToPage: number;

        public constructor() {
            super();
        }

        public settotalpageInfo(count: number, size: number) {
            if (count < 1) {
                count = 1;
            }
            if (size < 0) {
                size = 0;
            }
            this._pageSize = size;
            this._totalpageCount = count;
        }
        /**
         * 总共将显示对象切割成几页
         * 
         * @type {number}
         */
        public get totalpageCount(): number {
            return this._totalpageCount;
        }

        public bindObj(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar) {
            super.bindObj(content, scrollRect, null);
        }

        protected onDragStart(e: egret.TouchEvent) {
            if (this._scrollType == 0) {
                this._firstTouchPos = e.stageY;
            } else {
                this._firstTouchPos = e.stageX;
            }
            super.onDragStart(e);

        }

        protected onDragEnd(e: egret.TouchEvent) {
            let _content = this._content;
            let stage = _content.stage || egret.sys.$TempStage;
            stage.off(EgretEvent.TOUCH_MOVE, this.onDragMove, this);
            _content.off(EgretEvent.TOUCH_END, this.onDragEnd, this);
            let now: number = Global.now;
            let nowPos: number;
            if (this._scrollType == 0) {
                nowPos = e.stageY;
            } else {
                nowPos = e.stageX;
            }
            let subdis: number = nowPos - this._firstTouchPos;
            //往前或者往上翻
            if (subdis >= 0) {
                if (this.currentPage == 1) {
                    return;
                }
            }
            //往后或者往下翻
            if (subdis < 0) {
                if (this.currentPage == this._totalpageCount) {
                    return;
                }
            }
            let pos: number;
            if (this._scrollType == 0) {
                pos = this._content.scrollRect.y;
            }
            else {
                pos = this._content.scrollRect.x;
            }
            let page = Math.round(pos / this._pageSize) + 1;
            if (page < 1) {
                page = 1;
            }
            if (page > this._totalpageCount) {
                page = this._totalpageCount;
            }
            let pagederiction = page > this.currentPage ? -1 : 1;
            this._scrollToPage = page;
            this._lastFrameTime = Global.now;
            if (now - this._lastMoveTime < 150) {
                //检测手势速度
                //eg：当前在2.8页，即玩家意图从第2页翻到第三页，原本手势是从右向左滑动，但是在最后松开的时候，向右猛拉
                //此时判断手势速度，大于指定值，返回到第2页，否则移动到第三页
                //如果玩家最后松开时的手势与原本意图翻页的趋势一样，那么自然滑到下一页
                if (this._deriction == pagederiction) {
                    this._moveSpeed = this.autoScrollSpeed;
                } else {
                    if (this._moveSpeed > this.minPageScrollSpeed) {
                        this._scrollToPage = this.currentPage;
                        this._moveSpeed = this.autoScrollSpeed;
                    } else {
                        this._moveSpeed = this.autoScrollSpeed;
                    }
                }
            } else {
                //自然衰减到当前页
                this._moveSpeed = this.autoScrollSpeed;
            }
            if (_content.stage) {
                stage.on(EgretEvent.ENTER_FRAME, this.autoScrollToNextPage, this);
            }
        }

        private autoScrollToNextPage(e: egret.Event) {
            let _content = this._content;
            let rect: egret.Rectangle = _content.scrollRect;
            let currentPos: number;
            let targetPos = this._pageSize * (this._scrollToPage - 1);
            if (this._scrollType == 0) {
                currentPos = rect.y;
            } else {
                currentPos = rect.x;
            }
            let now = Global.now;
            let subTime = now - this._lastFrameTime;
            let sub = this._moveSpeed * subTime * this.globalspeed;
            let subdis = targetPos - currentPos;
            let deriction = subdis > 0 ? -1 : 1;

            if (Math.abs(subdis) < sub || Math.abs(subdis) < 2) {
                _content.stage.off(EgretEvent.ENTER_FRAME, this.autoScrollToNextPage, this);
                this.doScrollContent(subdis * deriction);
                rect = _content.scrollRect;
                if (this._scrollType == 0) {
                    currentPos = rect.y;
                } else {
                    currentPos = rect.x;
                }
                this.currentPage = Math.round(currentPos / this._pageSize) + 1;
                return;
            }
            this.doScrollContent(sub * deriction);
            this._lastFrameTime = now;
            this._moveSpeed *= this.blockSpeed;

        }

    }
}