namespace jy {
    export abstract class AbsPageList<T, R extends ListItemRender<T>> extends egret.EventDispatcher {

        protected _list: R[] = [];

        protected _data: T[];


        protected _selectedIndex: number = -1;

        protected _selectedItem: R;

        protected _dataLen = 0;
        /**
         * 获取数据长度
         * 
         * @readonly
         */
        public get dataLen() {
            return this._dataLen;
        }

        /**
         * 获取数据集
         * 
         * @readonly
         */
        public get data() {
            return this._data;
        }
        /**
         * 渲染指定位置的render
         * 
         * @ private
         * @ param {number} start (起始索引)
         * @ param {number} end (结束索引)
         */
        protected doRender(start: number, end?: number) {
            let render: R;
            let data = this._data;
            end == undefined && (end = start);
            for (let i = start; i <= end; i++) {
                render = this._get(i);
                if (!render) {
                    continue;
                }
                if (render.inited === false) {
                    if (render.bindComponent) {
                        render.bindComponent();
                    }
                    render.inited = true;
                }
                let tmp = render.data;
                if (!tmp || tmp != data[i] || render.dataChange) {
                    render.data = data[i];
                    if (render.handleView) {
                        render.handleView();
                    }
                    if (render.dataChange) {
                        render.dataChange = false;
                    }
                }
            }
        }

        public set selectedIndex(value: number) {
            if (this._selectedIndex == value && value >= 0) return;
            if (value < 0) {
                let selectedItem = this._selectedItem;
                if (selectedItem) {
                    selectedItem.selected = false;
                    this._selectedItem = undefined;
                }
                this._selectedIndex = value;
                return;
            }
            this.$setSelectedIndex(value);
        }

        protected $setSelectedIndex(value: number) {
            let render: R;
            const renderList = this._list;
            let len_1 = renderList.length - 1;
            if (value > len_1) {//一般PageList控件，索引超过长度，取最后一个
                value = len_1;
            }
            render = this._list[value];
            this.changeRender(render, value);
        }


        public get selectedIndex(): number {
            return this._selectedIndex;
        }
        /**
         * 
         * 根据索引获得视图
         * @param {number} idx
         * @returns
         */
        public getItemAt(idx: number) {
            idx = idx >>> 0;
            return this._list[idx];
        }
        public selectItemByData<K extends keyof T>(key: K, value: T[K], _useTween: boolean = false) {
            this.find((dat, _, idx) => {
                if (dat && (key in dat) && dat[key] == value) {
                    this.selectedIndex = idx;
                    return true;
                }
            });
            return this;
        }

        /**
         * 遍历列表
         * 
         * @param {{(data:T,render:R,idx:number,...args)}} handle 
         * @param {any} otherParams 
         */
        public forEach(handle: { (data: T, render: R, idx: number, ...args) }, ...otherParams) {
            let datas = this._data;
            let renders = this._list;
            let len = this._dataLen;
            for (let i = 0; i < len; i++) {
                let data = datas[i];
                let render = renders[i];
                handle(data, render, i, ...otherParams);
            }
            return this;
        }
        /**
         * 找到第一个符合要求的render
         * 
         * @param {{(data:T,render:R,idx:number,...args):boolean}} handle 
         * @param {any} otherParams 
         * @returns 
         */
        public find(handle: { (data: T, render: R, idx: number, ...args): boolean }, ...otherParams) {
            let datas = this._data;
            let renders = this._list;
            let len = this._dataLen;
            for (let i = 0; i < len; i++) {
                let data = datas[i];
                let render = renders[i];
                if (handle(data, render, i, ...otherParams)) {
                    return render;
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
        abstract updateByIdx(index: number, data: T): this;

        /**
         * 根据key value获取item,将item的data重新赋值为data
         * 
         * @param {string} key (description)
         * @param {*} value (description)
         * @param {T} data (description)
         */
        public updateByKey<K extends keyof T>(key: K, value: T[K], data?: T) {
            this.find((dat, render, idx) => {
                if (dat && (key in dat) && dat[key] == value) {
                    this.updateByIdx(idx, data === undefined ? dat : data);
                    return true;
                }
            });
        }

        protected abstract _get(index: number): R;
        /**
         * 清理数据
         * 
         * @abstract
         */
        abstract clear(): this;
        /**
         * 销毁
         * 
         * @abstract
         */
        abstract dispose();

        abstract displayList(data?: T[]): this;


        protected onTouchItem(e: egret.TouchEvent) {
            let render = <R>e.target;
            this.changeRender(render);
        }

        protected changeRender(render: R, index?: number) {
            let old = this._selectedItem;
            if (old != render) {
                index == undefined && (index = this._list.indexOf(render));
                if (old) {
                    old.selected = false;
                }
                this._selectedItem = render;
                this._selectedIndex = index;
                render.selected = true;
                this.onChange();
                this.dispatch(EventConst.ITEM_SELECTED);
            }
        }


        public getAllItems() {
            return this._list;
        }

        public get length() {
            return this._list.length;
        }

        /**
         * 让所有在舞台上的render重新刷新一次数据
         * 
         * 
         * @memberOf PageList
         */
        public refresh() {
            let data = this._data;
            if (data) {
                let len = data.length;
                for (let i = 0; i < len; i++) {
                    this.refreshAt(i);
                }
            }
            return this;
        }
        /**
         * 根据index使某个在舞台上的render刷新
         * 
         * @param {number}  idx
         * @param {boolean} [force]     是否强制执行setData和handleView 
         * @memberOf PageList
         */
        public refreshAt(idx: number, force?: boolean) {
            let renderer = this._get(idx);
            if (force || renderer.view.stage) {
                renderer.data = this._data[idx];
                if (typeof renderer.handleView === "function") {
                    renderer.handleView();
                }
                if (renderer.dataChange) {
                    renderer.dataChange = false;
                }
            }
            return this;
        }

        /**
         * render进行切换
         * 
         * @protected
         */
        protected onChange() { }
    }
}