module junyou {

    /**
     * PageList的常量
     * 
     * @export
     * @enum {number}
     */
    export const enum PageConst {
        MaxColumnCount = 9999
    }

    export interface PageListOption {
        /**
         * 单元格之间的宽度
         * 
         * @type {number}
         * @memberof PageListOption
         */
        hgap?: number;
        /**
         * 单元格之间的高度
         * 
         * @type {number}
         * @memberof PageListOption
         */
        vgap?: number;
        /**
         * 列表共有几列（最小1最大9999）
         * 
         * @type {number}
         * @memberof PageListOption
         */
        columnCount?: number;

        /**
         * itemrender固定宽度
         * 
         * @type {number}
         * @memberof PageListOption
         */
        itemWidth?: number;

        /**
         * itemrender固定高度
         * 
         * @type {number}
         * @memberof PageListOption
         */
        itemHeight?: number;

        /**
         * 是否为固定尺寸
         * 
         * @type {boolean}
         * @memberof PageListOption
         */
        staticSize?: boolean;
    }

    export class PageList<T, R extends ListItemRender<T>> extends egret.Sprite {

        protected _renderFactory: ClassFactory<R>

        /**
         * 根据render的最右侧，得到的最大宽度
         */
        protected _w: number;

        /**
         * 根据render的最下方，得到的最大高度
         */
        protected _h: number;

        /**
         * 水平间距
         * 
         * @protected
         * @type {number}
         */
        protected _hgap: number;

        /**
         * 垂直间距
         * 
         * @protected
         * @type {number}
         */
        protected _vgap: number;

        /**
         * 列数
         * 
         * @protected
         * @type {number}
         */
        protected _columncount: number;

        protected _renderList: R[];

        protected _data: T[];

        protected _childSizeChanged: boolean = false;

        protected _selectedIndex: number = -1;

        protected _selectedItem: R;

        public scroller: Scroller = null;//站位用，便于对Scroller的绑定
        /**0纵向，1横向 */
        private _scrollType: ScrollDirection;

        private _waitForSetIndex: boolean = false;
        private _waitIndex: number;

        // private startIndex: number;

        // private endIndex: number;

        private renderChange: boolean = false;

        protected _dataLen = 0;

        public get dataLen() {
            return this._dataLen;
        }

        /**
         * itemrender固定宽度
         * 
         * @private
         * @type {number}
         * @memberOf PageList
         */
        private itemWidth: number;
        /**
         * itemrender固定高度
         * 
         * @private
         * @type {number}
         * @memberOf PageList
         */
        private itemHeight: number;

        // /**
        //  * 缓动用
        //  */
        // private tweenRect: egret.Rectangle;

        // /**
        //  * 记录最终数据
        //  */
        // private endRect: egret.Rectangle;

        private useTweenIndex: boolean;


        private rawDataChanged: boolean;

        /**
         * 是否为固定尺寸
         * 
         * @type {boolean}
         */
        staticSize: boolean;

        /**
         * Creates an instance of PageList.
         * @param {ClassFactory<R>} renderfactory 
         * @param {PageListOption} [option] 
         */
        public constructor(renderfactory: ClassFactory<R>, option?: PageListOption)
        /**
         * 列表
         * 有固定宽、高值则用固定值
         * 否则用itemrender宽、高布局
         * 
         * @param renderfactory
         * @param hgap 单元格之间的宽度
         * @param vgap 单元格之间的高度
         * @param viewCount 可视范围内有几个列表项
         * @param columnCount 列表共有几列（最小1最大9999）
         * @param itemWidth itemrender固定宽度
         * @param itemHeight itemrender固定高度
         */
        public constructor(renderfactory: ClassFactory<R>, hgap?: number, vgap?: number, viewCount?: number, columnCount?: number, itemWidth?: number, itemHeight?: number)
        public constructor(renderfactory: ClassFactory<R>, opt?: any, vgap?: number, viewCount?: number, columnCount?: number, itemWidth?: number, itemHeight?: number) {
            super();
            this._renderFactory = renderfactory;
            let hgap: number;
            if (typeof opt == "object") {
                hgap = opt.hgap;
                vgap = opt.vgap;
                itemWidth = opt.itemWidth;
                itemHeight = opt.itemHeight;
                columnCount = opt.columnCount;
                this.staticSize = opt.staticSize;
            } else {
                hgap = opt;
            }
            columnCount = ~~columnCount;
            if (columnCount < 1) {
                columnCount = 1;
            }
            this._columncount = columnCount;
            this._hgap = ~~hgap;
            this._vgap = ~~vgap;
            this.itemWidth = itemWidth;
            this.itemHeight = itemHeight;
            this._renderList = [];
            this._scrollType = columnCount < PageConst.MaxColumnCount ? ScrollDirection.Vertical : ScrollDirection.Horizon;
        }

        public displayList(data?: T[]) {
            this._selectedIndex = -1;
            if (this._data != data) {
                this.rawDataChanged = true;
            }
            let nlen = data ? data.length : 0;
            if (this._data) {
                //如果新赋值的数据长度比以前的短，就自动清理掉多出来的item
                let list = this._renderList;
                let llen = list.length;
                if (nlen < llen) {
                    for (let i = nlen; i < list.length; i++) {
                        let render = list[i];
                        this._remoreRender(render);
                    }
                    list.length = nlen;
                }
            }
            this._data = data;
            this._lastRect = undefined;
            if (!nlen) {
                this.dispose();
                this._dataLen = 0;
                this.rawDataChanged = false;
                return;
            }
            this._dataLen = nlen;
            this.initItems();
            if (this.scroller) {
                this.scroller.scrollToHead();
            }
            this.rawDataChanged = false;
        }

        public get data() {
            return this._data;
        }

        /**
         * 根据index使某renderer显示生效
         * 
         * @param {number}  idx
         * @param {boolean} [force]     是否强制执行setData和handleView 
         * @memberOf PageList
         */
        public validateItemByIdx(idx: number, force?: boolean) {
            let renderer = this.getOrCreateItemRenderAt(idx);
            if (force || renderer.view.stage) {
                renderer.data = this._data[idx];
                if (typeof renderer.handleView === "function") {
                    renderer.handleView();
                }
                if (renderer.dataChange) {
                    renderer.dataChange = false;
                }
            }
        }

        /**
         * 使所有renderer显示生效
         * 
         * 
         * @memberOf PageList
         */
        public validateAll() {
            if (this._data) {
                let len = this._data.length;
                for (let i = 0; i < len; i++) {
                    this.validateItemByIdx(i);
                }
            }
        }

        /**
         * 初始化render占据array，不做任何初始化容器操作
         * 
         * @private
         */
        private initItems() {
            let len: number = this._data.length;
            this.doRenderListItem(0, len - 1);
            this._childSizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        }

        /**
         * 渲染指定位置的render
         * 
         * @ private
         * @ param {number} start (起始索引)
         * @ param {number} end (结束索引)
         */
        protected doRenderListItem(start: number, end?: number) {
            let render: R;
            let data = this._data;
            end == undefined && (end = start);
            for (let i = start; i <= end; i++) {
                render = this.getOrCreateItemRenderAt(i);
                if (render.inited === false) {
                    if (typeof render.bindComponent === "function") {
                        render.bindComponent();
                    }
                    render.inited = true;
                }
                let tmp = render.data;
                if (!tmp || tmp != data[i] || render.dataChange) {
                    render.data = data[i];
                    if (typeof render.handleView === "function") {
                        render.handleView();
                    }
                    if (render.dataChange) {
                        render.dataChange = false;
                    }
                }
            }
        }

        protected changeRender(render: R, index?: number) {
            let old = this._selectedItem;
            if (old != render) {
                index == undefined && (index = this._renderList.indexOf(render));
                if (old) {
                    old.selected = false;
                }
                this._selectedItem = render;
                this._selectedIndex = index;
                render.selected = true;
                if (!this.itemWidth || !this.itemHeight) {//并未设置固定的宽度高度，需要重新计算坐标
                    this._childSizeChanged = true;
                    this.reCalc();
                }
                this.dispatch(EventConst.ITEM_SELECTED);
            }
        }

        protected touchItemrender(e: egret.TouchEvent) {
            let render = <R>e.target;
            this.changeRender(render);
        }

        private getOrCreateItemRenderAt(index: number) {
            let list = this._renderList;
            let render = list[index];
            if (!render) {
                render = this._renderFactory.get();
                list[index] = render;
                render.on(EventConst.Resize, this.childSizeChange, this);
                render.on(EventConst.ITEM_TOUCH_TAP, this.touchItemrender, this);
            }
            render.index = index;
            return render;
        }

        protected childSizeChange() {
            if (!this._childSizeChanged) {
                this._childSizeChanged = true;
                this.once(EgretEvent.ENTER_FRAME, this.reCalc, this);
            }
        }

        /**
         * 重新计算Render的坐标
         * 
         * @private
         * @param {number} [start]
         * @param {number} [end]
         * @returns
         */
        protected reCalc() {
            if (!this._childSizeChanged) {
                return;
            }
            this._childSizeChanged = false;
            let renderList = this._renderList;
            let len = renderList.length;
            let end = len - 1;
            // let lastrender: R;
            //得到单行/单列最大索引数
            const { itemWidth, itemHeight, _columncount, _hgap, _vgap, staticSize } = this;
            let rowCount = len / _columncount;
            let oy = 0, ox = 0;
            let maxWidth = 0, maxHeight = 0;
            let i = 0;
            for (let r = 0; r <= rowCount; r++) {
                //单行的最大高度
                let lineMaxHeight = 0;
                for (let c = 0; c < _columncount; c++) {
                    if (i > end) {
                        break;
                    }
                    let render = renderList[i++];
                    let v = render.view;

                    let w = 0;
                    if (v) {
                        let size: Size = v;
                        if (staticSize) {
                            let rect = v.suiRawRect;
                            if (rect) {
                                size = rect;
                            }
                        }
                        w = size.width;
                        let vh = size.height;

                        v.x = ox;
                        v.y = oy;

                        let rright = v.x + w;

                        if (maxWidth < rright) {
                            maxWidth = rright;
                        }
                        if (lineMaxHeight < vh) {
                            lineMaxHeight = vh;
                        }
                    }
                    ox += _hgap + (itemWidth || w);
                }
                let mh = oy + lineMaxHeight;
                if (maxHeight < mh) {
                    maxHeight = mh;
                }
                if (i > end) {
                    break;
                }
                ox = 0;
                //偏移量，优先使用itemHeight
                oy += _vgap + (itemHeight || lineMaxHeight);
            }
            if (maxWidth != this._w || maxHeight != this._h) {
                this._w = maxWidth;
                this._h = maxHeight;

                let g = this.graphics;
                g.clear();
                g.beginFill(0, 0);
                g.drawRect(0, 0, maxWidth, maxHeight);
                g.endFill();
                this.dispatch(EventConst.Resize);
            }
        }

        public set selectedIndex(value: number) {
            if (this._selectedIndex == value) return;
            if (value < 0) {
                if (this._selectedItem) {
                    this._selectedItem.selected = false;
                    this._selectedItem = undefined;
                }
                this._selectedIndex = value;
                return;
            }
            this._waitIndex = value;
            if (!this._data) {
                this._waitForSetIndex = true;
                return;
            }
            let render: R;
            const renderList = this._renderList;
            let len_1 = renderList.length - 1;
            if (value > len_1) {//一般PageList控件，索引超过长度，取最后一个
                value = len_1;
            }
            render = this._renderList[value];
            this.changeRender(render, value);
            let view = render.view;
            if (view && view.stage) {
                this._waitForSetIndex = false;
                this.moveScroll(render);
            } else {
                this._waitForSetIndex = true;
            }

            if (this._waitForSetIndex) {
                this.moveScroll(render);
                //假如列表里有30个项，选中第20个，所以前20个都没有渲染，这边自己设置的rect，并不能引发scroller抛CHANGE事件
                //所以自己抛一下
                //如果已经渲染过，可不用抛
                // this.dispatchEventWith(EventConst.SCROLL_POSITION_CHANGE);
            }
        }

        private moveScroll(render: R) {
            let rect = this.scrollRect;
            if (!rect) return;
            let v = render.view;
            if (!v) {
                if (DEBUG) {
                    ThrowError(`render[${egret.getQualifiedClassName(render)}]没有renderView`);
                }
                return;
            }
            let oldPos: number, endPos: number, max: number;
            if (this._scrollType == ScrollDirection.Vertical) {
                oldPos = rect.y;
                endPos = v.y;
                max = this._h - v.height;

            } else {
                oldPos = rect.x;
                endPos = v.x;
                max = this._w - v.width;
            }


            if (endPos > max) {
                endPos = max;
            }
            if (rect) {
                if (this._scrollType == ScrollDirection.Vertical) {
                    endPos = endPos - rect.height;
                } else {
                    endPos = endPos - rect.width;
                }
                if (endPos < 0) {
                    endPos = 0;
                }
            }

            let scroller = this.scroller;
            if (scroller) {
                scroller.stopTouchTween();
            }
            if (this.useTweenIndex) {

                let tween = Global.getTween(this, null, null, true);
                let result = this._scrollType == ScrollDirection.Horizon ? { tweenX: endPos } : { tweenY: endPos };
                tween.to(result, 500, Ease.quadOut);
                if (scroller) {
                    scroller.showBar();
                    tween.call(scroller.hideBar, scroller);
                }
            } else {
                if (scroller) {
                    scroller.doMoveScrollBar(oldPos - endPos);
                }
                if (this._scrollType == ScrollDirection.Vertical) {
                    rect.y = endPos;
                } else {
                    rect.x = endPos;
                }
                this.scrollRect = rect;
            }
        }
        public get tweenX() {
            let rect = this.scrollRect;
            return rect ? rect.x : 0;
        }
        public set tweenX(value: number) {
            let rect = this.scrollRect || new egret.Rectangle(NaN);
            if (value != rect.x) {
                let delta = value - rect.x;
                rect.x = value;
                const scroller = this.scroller;
                if (scroller) {
                    scroller.doMoveScrollBar(delta)
                }
                this.scrollRect = rect;
            }
        }

        public get tweenY() {
            let rect = this.scrollRect;
            return rect ? rect.y : 0;
        }
        public set tweenY(value: number) {
            let rect = this.scrollRect || new egret.Rectangle(0, NaN);
            if (value != rect.y) {
                let delta = value - rect.y;
                rect.y = value;
                const scroller = this.scroller;
                if (scroller) {
                    scroller.doMoveScrollBar(delta)
                }
                this.scrollRect = rect;
            }
        }

        public get selectedIndex(): number {
            return this._selectedIndex;
        }

        /**
         * 滚动到指定index
         */
        public tweenToIndex(index: number) {
            this.useTweenIndex = true;
            this.selectedIndex = index;
        }

        public selectItemByData<K extends keyof T>(key: K, value: T[K], useTween: boolean = false) {
            let data = this._data;
            let len = data.length;
            for (let i = 0; i < len; i++) {
                if (key in data[i]) {
                    if (data[i][key] == value) {
                        if (useTween) {
                            this.tweenToIndex(i);
                        } else {
                            this.selectedIndex = i;
                        }
                        break;
                    }
                }
            }
        }

        public get selectedItem() {
            return this._selectedItem;
        }

        /**
         * 更新item数据
         * 
         * @param {number} index (description)
         * @param {*} data (description)
         */
        public updateItembyIndex(index: number, data: T) {
            let item = this.getItemRenderAt(index);
            if (item) {
                this._data[index] = data;
                if (index >= this._showStart && index <= this._showEnd) {
                    this.doRenderListItem(index);
                }
            }

        }

        /**
         * 根据key value获取item,将item的data重新赋值为data
         * 
         * @param {string} key (description)
         * @param {*} value (description)
         * @param {T} data (description)
         */
        public updateItemByKey<K extends keyof T>(key: K, value: T[K], data: T) {
            let [item, index] = this.getItemRenderData(key, value);
            if (item) {
                this.updateItembyIndex(index, data);
            }

        }

        /**
         * 
         * 根据索引获得视图
         * @param {number} index
         * @returns
         */
        public getItemRenderAt(index: number) {
            return this._renderList[index];
        }

        /**
         * 
         * 通过搜索数据，获取Render
         * @param {string} key
         * @param {*} value
         * @returns
         */
        public getItemRenderData<K extends keyof T>(key: K, value: T[K]): [R, number] {
            let data = this._data;
            let len = data.length;
            let item: R;
            let i = 0;
            for (; i < len; i++) {
                let dat = data[i];
                if (key in dat) {
                    if (dat[key] === value) {
                        item = this.getItemRenderAt(i);
                        break;
                    }
                }
            }
            return [item, i];
        }

        /**
         * 在index后插入一个或多个数据，如果要在首位插入传-1
         * 
         * @param {number} index (description)
         * @param {*} data (description)
         */
        public insertItem(index: number, ...data: T[]) {
            //todo
        }

        public deleteItemByIndex(value: any[]) {
            //todo
        }

        public deleteItemByData<K extends keyof T>(key: K, value: T[K]) {
            //todo
        }

        public removeItem(item: R) {
            let index = this._renderList.indexOf(item);
            if (index != -1) {
                this._renderList.splice(index, 1);
                this._data.splice(index, 1);
                this._remoreRender(item);
            }
        }

        protected _remoreRender(item: R) {
            removeDisplay(item.view);
            item.dispose();
            if (!this.renderChange) {
                this.renderChange = true;
                this.once(EgretEvent.ENTER_FRAME, this.refreshByRemoveItem, this);
            }
        }

        private refreshByRemoveItem() {
            if (!this.renderChange) {
                return;
            }
            this.renderChange = false;
            this._childSizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        }

        public getAllItems() {
            return this._renderList;
        }

        public dispose() {
            this.recycle();
        }

        public recycle() {
            this.graphics.clear();
            this._selectedIndex = -1;
            this._data = undefined;
            let list = this._renderList;
            for (let render of list) {
                render.data = undefined;
                removeDisplay(render.view);
                render.dispose();
            }
            list.length = 0;
            this._selectedItem = undefined;
            this._waitForSetIndex = false;
            this._waitIndex = -1;
        }

        /**
         * 在舞台之上的起始索引
         * 
         * @protected
         * @type {number}
         */
        protected _showStart: number;

        /**
         * 在舞台之上的结束索引
         * 
         * @protected
         * @type {number}
         */
        protected _showEnd: number;

        protected _lastRect: egret.Rectangle;

        protected checkViewRect() {
            let rect = this.$scrollRect;
            let list = this._renderList;
            let len = list.length;
            let len_1 = len - 1;
            if (!rect) {
                // 应该为全部添加到舞台
                for (let i = 0; i < len; i++) {
                    let render = list[i];
                    let v = render.view;
                    if (v) {
                        this.addChild(v);
                    }
                }
                this._showStart = 0;
                this._showEnd = len - 1;
                return;
            }
            //设置rect时，检查哪些Render应该在舞台上
            let lastRect = this._lastRect;
            let checkStart: number, inc: boolean;
            if (lastRect) {
                //检查滚动方向
                let key1 = "x", key2 = "width";
                if (this._scrollType == ScrollDirection.Vertical) {
                    key1 = "y";
                    key2 = "height";
                }
                let delta = rect[key1] - lastRect[key1];
                if (delta == 0 && rect[key2] == lastRect[key2]) {//没有任何变化
                    if (!this.rawDataChanged) {
                        return;
                    }
                }
                let showStart = this._showStart;
                let showEnd = this._showEnd;
                //先全部从舞台移除
                for (let i = showStart; i <= showEnd; i++) {
                    let render = list[i];
                    if (render) {
                        removeDisplay(render.view);
                    }
                }


                if (delta > 0) {//向大的检查
                    checkStart = showStart;
                    inc = true;
                } else {
                    checkStart = showEnd;
                    inc = false;
                }
                lastRect[key1] = rect[key1];
                lastRect[key2] = rect[key2];
            } else {
                if (!len) {
                    return;
                }
                lastRect = rect.clone();
                this._lastRect = lastRect;
                checkStart = 0;
                inc = true;
            }
            let first: R, last: R, fIdx: number, lIdx: number;
            let tmp = Temp.SharedArray3;
            tmp.length = 0;
            if (inc) {
                fIdx = 0;
                lIdx = len_1;
                /**
                 * 
                 * 
                 *   ├────────┤
                 *   │render0 │                         以前和scrollRect相交的render0，现在不再相交，从舞台移除
                 *  ┌├────────┤┐───
                 *  ││render1 ││ ↑ scrollRect           以前和scrollRect相交的render1，现在还相交
                 *  │├────────┤│ ↓
                 *  └│render2 │┘───                     以前不和scrollRect相交的render2，现在相交
                 *   ├────────┤
                 * 
                 *  需要从起始点开始找，找到第一个和当前rect相交的render
                 *  直到找到最后一个和rect相交的render，再往后则无需检测
                 */
                for (let i = checkStart; i < len; i++) {
                    if (check(i)) {
                        break;
                    }
                }
                for (let i = 0, tlen = tmp.length; i < tlen; i++) {
                    let v = tmp[i];
                    this.addChild(v);
                }
                this._showStart = fIdx;
                this._showEnd = lIdx;
            } else {
                fIdx = len_1;
                lIdx = 0;
                for (let i = checkStart; i >= 0; i--) {
                    if (check(i)) {
                        break;
                    }
                }
                for (let i = tmp.length - 1; i >= 0; i--) {
                    let v = tmp[i];
                    this.addChild(v);
                }
                this._showStart = lIdx;
                this._showEnd = fIdx;
            }
            tmp.length = 0;
            return;
            function check(i) {
                let render = list[i];
                let v = render.view;
                if (v) {
                    if (intersects(v, rect)) {
                        if (!first) {
                            first = render;
                            fIdx = i;
                        }
                        tmp.push(v);
                    } else {
                        if (first) {
                            last = render;
                            lIdx = i;
                            return true;
                        }
                    }
                }
            }
        }

        public get scrollRect() {
            return this.$scrollRect;
        }

        public set scrollRect(rect: egret.Rectangle) {
            super.$setScrollRect(rect);
            this.checkViewRect();
        }
    }
}