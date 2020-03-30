namespace jy {

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
         * 列表共有几列
         * 如果 `type` 为 ScrollDirection.Horizon 则 默认`Infinity`
         * 如果 `type` 为 ScrollDirection.Vertical 则 默认`1`
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

        /**
         * pageList的方向
         * 
         * @type {ScrollDirection}
         * @memberof PageListOption
         */
        type?: ScrollDirection;
        /**
         * 容器
         * 
         * @type {egret.Sprite}
         * @memberof PageListOption
         */
        con?: egret.Sprite;

        /**
         * 是否 不创建默认的 scroller
         */
        noScroller?: boolean;

        /**
         * scroller相关参数
         */
        scrollerOption?: ScrollerOption;
    }

    export class PageList<T, R extends ListItemRender<T>> extends AbsPageList<T, R> {

        protected _factory: ClassFactory<R>;

        protected _pool: R[] = [];

        maxPoolSize = 100;

        /**
         * 根据render的最右侧，得到的最大宽度
         */
        protected _w: number;
        noDrawBG: boolean;
        bg: egret.Bitmap;

        get w() {
            return this._w;
        }

        /**
         * 根据render的最下方，得到的最大高度
         */
        protected _h: number;

        get h() {
            return this._h;
        }

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

        protected _sizeChanged: boolean = false;

        public scroller: Scroller = null;//站位用，便于对Scroller的绑定
        /**0纵向，1横向 */
        readonly scrollType: ScrollDirection;

        private _waitForSetIndex: boolean = false;


        private renderChange = false;

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

        private useTweenIndex: boolean;


        private rawDataChanged: boolean;

        /**
         * 是否为固定尺寸
         * 
         * @type {boolean}
         */
        staticSize: boolean;

        private _con: egret.Sprite;
        /**
         * 容器
         * 
         * @readonly
         */
        public get container() {
            return this._con;
        }

        /**
         * Creates an instance of PageList.
         * @param {ClassFactory<R> | Creator<R>} renderfactory 
         * @param {PageListOption} [option] 
         */
        constructor(renderfactory: ClassFactory<R> | Creator<R>, option?: PageListOption) {
            super();
            if (!(renderfactory instanceof ClassFactory)) {
                renderfactory = new ClassFactory(renderfactory);
            }
            this._factory = renderfactory;
            this.init(option);
        }

        protected init(option: PageListOption) {
            option = option || Temp.EmptyObject as PageListOption;
            let { hgap, vgap, type, itemWidth, itemHeight, columnCount, staticSize, noScroller, con, scrollerOption } = option;
            this.staticSize = staticSize;
            type = ~~type;
            columnCount = ~~columnCount;
            if (columnCount < 1) {
                if (type == ScrollDirection.Horizon) {
                    columnCount = Infinity;
                } else {
                    columnCount = 1;
                }
            }
            this._columncount = columnCount;
            this._hgap = ~~hgap;
            this._vgap = ~~vgap;
            this.itemWidth = itemWidth;
            this.itemHeight = itemHeight;
            // this.noDrawBG = option.noDrawBG;
            //@ts-ignore
            this.scrollType = type;
            con = con || new egret.Sprite();
            let bmp = new egret.Bitmap();
            bmp.texture = ColorUtil.getTexture(0, 0);
            this.bg = bmp;
            con.addChild(bmp, false)
            this.container = con;
            let self = this;

            Object.defineProperties(con, makeDefDescriptors({
                measuredHeight: {
                    get() {
                        return self._h;
                    }

                },
                measuredWidth: {
                    get() {
                        return self._w;
                    }
                }
            }))

            if (!noScroller) {
                let scroller = this.scroller = new Scroller(scrollerOption);
                scroller.scrollType = this.scrollType;
                scroller.bindObj2(con, con.suiRawRect.clone());
            }


        }

        resize(width?: number, height?: number) {
            let con = this._con;
            if (con) {
                let rect = con.scrollRect;
                if (rect) {
                    if (!isNaN(+width)) {
                        rect.width = width;
                    }
                    if (!isNaN(+height)) {
                        rect.height = height;
                    }

                    this._lastRect = null;
                    this.checkViewRect();
                    if (width >= this._w) {
                        rect.x = 0;
                    }
                    if (height >= this._h) {
                        rect.y = 0;
                    }
                    con.scrollRect = rect;
                }
            }
        }



        public set container(con: egret.Sprite) {
            if (!con) {
                DEBUG && ThrowError(`容器不允许设置空值`)
                return;
            }
            let old = this._con as any;
            if (old != con) {
                if (old) {
                    delete old.$_page;
                    delete old.scrollRect;
                }
                this._con = con;
                (con as any).$_page = this;
                Object.defineProperty(con, "scrollRect", define);
            }
        }

        public displayList(data?: T[]) {
            this._selectedIndex = -1;
            this._selectedItem = undefined;
            if (this._data != data) {
                this.rawDataChanged = true;
            }
            let nlen = data ? data.length : 0;
            if (this._data) {
                //如果新赋值的数据长度比以前的短，就自动清理掉多出来的item
                let list = this._list;
                let llen = list.length;
                if (nlen < llen) {
                    for (let i = nlen; i < list.length; i++) {
                        let render = list[i];
                        this._removeRender(render);
                    }
                    list.length = nlen;
                }
            }
            this._data = data;
            this._lastRect = undefined;
            if (!nlen) {
                this.clear();
                this._dataLen = 0;
                this.rawDataChanged = false;
                return this;
            }
            this._dataLen = nlen;
            this.initItems();
            let scroller = this.scroller;
            if (scroller) {
                scroller.scrollToHead();
            }
            this.rawDataChanged = false;
            return this;
        }

        /**
         * 基于容器原始坐标进行排布
         * @param type 如果设置 `LayoutType.FullScreen(0)`，基于`LayoutType.TOP_LEFT`定位 
         */
        layout(type: LayoutType) {
            if (!this.scroller) {//有scroller的不处理
                let con = this._con;
                let suiRawRect = con.suiRawRect;
                if (suiRawRect) {
                    if (type == LayoutType.FullScreen) {//设0恢复原样，基于 top_left 定位
                        type = LayoutType.TOP_LEFT;
                    }
                    let pt = Temp.SharedPoint1;
                    Layout.getLayoutPos(this._w, this._h, suiRawRect.width, suiRawRect.height, type, pt);
                    con.x = suiRawRect.x + pt.x;
                    con.y = suiRawRect.y + pt.y;
                }
            }
            return this;
        }


        /**
         * 初始化render占据array，不做任何初始化容器操作
         * 
         * @private
         */
        private initItems() {
            let len: number = this._data.length;
            this.doRender(0, len - 1);
            this._sizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        }

        protected onChange() {
            if (!this.itemWidth || !this.itemHeight) {//并未设置固定的宽度高度，需要重新计算坐标
                this._sizeChanged = true;
                this.reCalc();
            }
        }

        protected _get(index: number) {
            let list = this._list;
            let render = list[index];
            if (!render) {
                render = this._pool.pop() || this._factory.get();
                render.onSpawn();
                list[index] = render;
                render.on(EventConst.Resize, this.onSizeChange, this);
                render.on(EventConst.ITEM_TOUCH_TAP, this.onTouchItem, this);
            }
            render.index = index;
            return render;
        }

        protected onSizeChange() {
            if (!this._sizeChanged) {
                this._sizeChanged = true;
                this.once(EgretEvent.ENTER_FRAME, this.reCalc, this);
            }
        }

        getSize(v: egret.DisplayObject) {
            let size: Size = v;
            if (this.staticSize) {
                let rect = v.suiRawRect;
                if (rect) {
                    size = rect;
                }
            }
            return size;
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
            if (!this._sizeChanged) {
                return;
            }
            this._sizeChanged = false;
            let renderList = this._list;
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
                        let size: Size;
                        if (itemWidth) {
                            w = itemWidth;
                        } else {
                            size = render.size || this.getSize(v);
                            w = size.width;
                        }
                        let vh: number;
                        if (itemHeight) {
                            vh = itemHeight;
                        } else {
                            if (!size) {
                                size = render.size || this.getSize(v);
                            }
                            vh = size.height;
                        }
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
                    ox += _hgap + w;
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
                let bg = this.bg;
                bg.width = maxWidth;
                bg.height = maxHeight;
                this.dispatch(EventConst.Resize);
            }
        }

        public $setSelectedIndex(value: number) {
            if (!this._data) {
                this._waitForSetIndex = true;
                return;
            }
            let render: R;
            const renderList = this._list;
            let len_1 = renderList.length - 1;
            if (value > len_1) {//一般PageList控件，索引超过长度，取最后一个
                value = len_1;
            }
            render = this._list[value];
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
            let con = this._con;
            let rect = con.scrollRect;
            if (!rect) return;
            let v = render.view;
            if (!v) {
                if (DEBUG) {
                    ThrowError(`render[${egret.getQualifiedClassName(render)}]没有renderView`);
                }
                return;
            }
            let oldPos: number, endPos: number, max: number;
            if (this.scrollType == ScrollDirection.Vertical) {
                oldPos = rect.y;
                let d = this.itemHeight;
                if (!d) {
                    d = this.getSize(v).height;
                }
                endPos = v.y + d;
                max = this._h;

            } else {
                oldPos = rect.x;
                let d = this.itemWidth;
                if (!d) {
                    d = this.getSize(v).width;
                }
                endPos = v.x + d;
                max = this._w;
            }


            if (endPos > max) {
                endPos = max;
            }
            if (rect) {
                if (this.scrollType == ScrollDirection.Vertical) {
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
            Global.removeTweens(this);
            if (this.useTweenIndex) {
                this.useTweenIndex = false;
                let result = this.scrollType == ScrollDirection.Horizon ? { tweenX: endPos } : { tweenY: endPos };
                let tween = Global.getTween(this).to(result, 500, Ease.quadOut);
                if (scroller) {
                    scroller.showBar();
                    tween.call(scroller.hideBar, scroller);
                }
            } else {
                if (scroller) {
                    scroller.doMoveScrollBar(oldPos - endPos);
                }
                if (this.scrollType == ScrollDirection.Vertical) {
                    rect.y = endPos;
                } else {
                    rect.x = endPos;
                }
                con.scrollRect = rect;
            }
        }
        public get tweenX() {
            let rect = this._con.scrollRect;
            return rect ? rect.x : 0;
        }
        public set tweenX(value: number) {
            let con = this._con;
            let rect = con.scrollRect || new egret.Rectangle(NaN);
            if (value != rect.x) {
                let delta = value - rect.x;
                rect.x = value;
                const scroller = this.scroller;
                if (scroller) {
                    scroller.doMoveScrollBar(delta)
                }
                con.scrollRect = rect;
            }
        }

        public get tweenY() {
            let rect = this._con.scrollRect;
            return rect ? rect.y : 0;
        }
        public set tweenY(value: number) {
            let con = this._con;
            let rect = con.scrollRect || new egret.Rectangle(0, NaN);
            if (value != rect.y) {
                let delta = value - rect.y;
                rect.y = value;
                const scroller = this.scroller;
                if (scroller) {
                    scroller.doMoveScrollBar(delta)
                }
                con.scrollRect = rect;
            }
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
            let len = data && data.length || 0;
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
            return this;
        }

        /**
         * 更新item数据
         * 
         * @param {number} index (description)
         * @param {*} data (description)
         */
        public updateByIdx(index: number, data: T) {
            let item = this.getItemAt(index);
            if (item) {
                this._data[index] = data;
                this.doRender(index);
            }
            return this;
        }


        public removeAt(idx: number) {
            idx = idx >>> 0;
            const list = this._list;
            if (idx < list.length) {
                let item = list[idx];
                list.splice(idx, 1);
                this._data.splice(idx, 1);
                this._removeRender(item);
            }
        }

        public removeItem(item: R) {
            let index = this._list.indexOf(item);
            if (index != -1) {
                this.removeAt(index);
            }
        }

        protected _removeRender(item: R) {
            item.data = undefined;
            removeDisplay(item.view);
            item.off(EventConst.Resize, this.onSizeChange, this);
            item.off(EventConst.ITEM_TOUCH_TAP, this.onTouchItem, this);
            if (this._pool.length < this.maxPoolSize) {
                item.onRecycle();
                this._pool.push(item);
            } else {
                item.dispose();
            }
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
            this._sizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        }

        /**
         * 销毁
         * 
         */
        public dispose() {
            this.clear();
        }

        /**
         * 清理
         * 
         */
        public clear() {
            this._con.graphics.clear();
            this._selectedIndex = -1;
            this._data = undefined;
            let list = this._list;
            for (let i = 0; i < list.length; i++) {
                this._removeRender(list[i]);
            }
            list.length = 0;
            this._selectedItem = undefined;
            this._waitForSetIndex = false;
            this._w = 0;
            this._h = 0;
            return this;
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
        /**
         * 在舞台之上的起始索引
         * 
         * @readonly
         */
        get showStart() {
            return this._showStart;
        }
        /**
         * 在舞台之上的结束索引
         * 
         * @readonly
         */
        get showEnd() {
            return this._showEnd;
        }

        protected _lastRect: egret.Rectangle;

        checkViewRect() {
            const _con = this._con;
            let rect = _con.scrollRect;
            let list = this._list as (R & { $_stage?: boolean })[];
            let len = list.length;
            let len_1 = len - 1;
            if (!rect) {
                // 应该为全部添加到舞台
                for (let i = 0; i < len; i++) {
                    let render = list[i];
                    let v = render.view;
                    if (v) {
                        _con.addChild(v);
                    }
                }
                this._showStart = 0;
                this._showEnd = len - 1;
                return;
            }
            //设置rect时，检查哪些Render应该在舞台上
            let lastRect = this._lastRect;
            let checkStart: number, inc: boolean;
            let showStart = this._showStart;
            let showEnd = this._showEnd;
            if (lastRect) {
                //检查滚动方向
                let key1 = PosKey.X, key2 = SizeKey.Width;
                if (this.scrollType == ScrollDirection.Vertical) {
                    key1 = PosKey.Y;
                    key2 = SizeKey.Height;
                }
                let delta = rect[key1] - lastRect[key1];
                if (delta == 0 && rect[key2] == lastRect[key2]) {//没有任何变化
                    if (!this.rawDataChanged) {
                        return;
                    }
                }
                //先全部从舞台移除
                for (let i = showStart; i <= showEnd; i++) {
                    let render = list[i];
                    if (render) {
                        render.$_stage = false;
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
            let tmpRect = Temp.SharedRect1;
            let staticSize = this.staticSize;
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
                    if (check(i, this)) {
                        break;
                    }
                }
                for (let i = 0, tlen = tmp.length; i < tlen; i++) {
                    let v = tmp[i];
                    _con.addChild(v);
                }
                this._showStart = fIdx;
                this._showEnd = lIdx;
            } else {
                fIdx = len_1;
                lIdx = 0;
                for (let i = checkStart; i >= 0; i--) {
                    if (check(i, this)) {
                        break;
                    }
                }
                for (let i = tmp.length - 1; i >= 0; i--) {
                    let v = tmp[i];
                    _con.addChild(v);
                }
                this._showStart = lIdx;
                this._showEnd = fIdx;
            }

            //清理 $_stage 为false的render
            for (let i = showStart; i <= showEnd; i++) {
                let render = list[i];
                if (!render.$_stage) {
                    removeDisplay(render.view);
                }
            }

            tmp.length = 0;
            return;
            function check(i, d: PageList<T, ListItemRender<T>>) {
                let render = list[i];
                let v = render.view;
                if (v) {
                    let rec: Rect;
                    if (staticSize) {
                        rec = tmpRect;
                        rec.x = v.x;
                        rec.y = v.y;
                        let suiRect = v.suiRawRect;
                        rec.width = d.itemWidth || suiRect.width;
                        rec.height = d.itemHeight || suiRect.height;
                    } else {
                        let size = render.size;
                        if (size) {
                            tempRect.x = v.x;
                            tempRect.y = v.y;
                            tempRect.width = size.width;
                            tempRect.height = size.height;
                            rec = tempRect;
                        } else {
                            rec = v;
                        }
                    }
                    if (intersects(rec, rect)) {
                        if (!first) {
                            first = render;
                            fIdx = i;
                        }
                        render.$_stage = true;
                        tmp.push(v);
                    } else {
                        if (first) {
                            last = render;
                            lIdx = i;
                            if (staticSize) {//固定大小的允许 return，非固定大小的遍历全部数据
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    const tempRect = { x: 0, y: 0, width: 0, height: 0 };

    const define = {
        set(rect: egret.Rectangle) {
            (egret.DisplayObject.prototype as any).$setScrollRect.call(this, rect);
            this.$_page.checkViewRect();
        },
        get() {
            return this.$scrollRect;
        },
        configurable: true
    }
}