namespace jy {
    /**
     * 单选按钮组
     */
    export class Group extends egret.EventDispatcher {

        protected _list: IGroupItem[] = [];
        protected _selectedItem: IGroupItem;
        protected _selectedIndex = -1;

        /**
         * 添加单个组件
         * 
         * @param {IGroupItem} item
         */
        public addItem(item: IGroupItem) {
            if (item) {
                this._list.pushOnce(item);
                item.on(EgretEvent.TOUCH_TAP, this.touchHandler, this);
            }
        }

        public getAllItems() {
            return this._list;
        }
        public get length() {
            return this._list.length;
        }
        /**
         * 获取 IGroupItem
         * 
         * @param {number} idx 
         * @returns 
         */
        public getItemAt(idx: number) {
            idx = idx >>> 0;
            return this._list[idx];
        }

        public removeAt(idx: number) {
            idx = idx >>> 0;
            const list = this._list;
            if (idx < list.length) {
                let item = list[idx];
                this.removeItem(item);
                return item;
            }
        }

        protected touchHandler(e: egret.TouchEvent) {
            this.$setSelectedItem(e.target);
        }

        /**
         * 移除单个组件
         * 
         * @param {IGroupItem} item
         */
        public removeItem(item: IGroupItem) {
            if (item) {
                if (this._selectedItem == item) {
                    this.$setSelectedItem();
                }
                this._list.remove(item);
                item.off(EgretEvent.TOUCH_TAP, this.touchHandler, this);
                return item;
            }
        }


        /**
         * 添加多个组件
         * 
         * @param {...IGroupItem[]} itemArr
         */
        public addItems(...itemArr: IGroupItem[])
        public addItems() {
            for (let i = 0; i < arguments.length; i++) {
                let item = arguments[i];
                this.addItem(item);
            }
        }

        /**
         * 设置选中组件
         */
        public set selectedItem(item: IGroupItem) {
            this.$setSelectedItem(item);
        }

        protected $setSelectedItem(item?: IGroupItem) {
            let _selectedItem = this._selectedItem;
            if (!item || !item.unelectable) {
                if (_selectedItem != item) {
                    if (_selectedItem) {
                        _selectedItem.selected = false;
                    }
                    let idx = -1;
                    if (item) {
                        idx = this._list.indexOf(item);
                        if (~idx) {
                            item.selected = true;
                        } else {
                            item = undefined;
                            ThrowError("Group 设置的组件未添加到该组");
                        }
                    }
                    this._selectedItem = item;
                    this._selectedIndex = idx;
                    return this.dispatch(EventConst.GROUP_CHANGE);
                } else {
                    if (item && !item.selected) {
                        item.selected = true;
                    }
                }
            }
        }

        public get selectedItem(): IGroupItem {
            return this._selectedItem;
        }

        /**
         * 设置选中索引
         */
        public set selectedIndex(idx: number) {
            this.$setSelectedIndex(idx);
        }

        protected $setSelectedIndex(idx: number) {
            if (this._selectedIndex != idx) {
                let item = idx >= 0 ? this._list[idx] : undefined;
                this.$setSelectedItem(item);
            }
        }

        public get selectedIndex() {
            return this._selectedIndex;
        }

        public clear() {
            const list = this._list;
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                item.off(EgretEvent.TOUCH_TAP, this.touchHandler, this);
            }
            list.length = 0;
            this._selectedIndex = -1;
        }

        public onRecycle() {
            this.clear();
        }
    }
}