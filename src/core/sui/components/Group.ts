module junyou {
    import TE = egret.TouchEvent;
    /**
     * 单选按钮组
     * @author pb
     */
    export class Group extends egret.EventDispatcher {

        protected _list: IGroupItem[];
        protected _selectedItem: IGroupItem;
        protected _selectedIndex: number;

        constructor() {
            super();
            this._list = [];
        }

        /**
         * 添加单个组件
         * 
         * @param {IGroupItem} item
         */
        public addItem(item: IGroupItem) {
            if (item) {
                this._list.pushOnce(item);
                item.on(TE.TOUCH_TAP, this.touchHandler, this);
            }
        }

        protected touchHandler(e: TE) {
            let item = e.target;
            let idx = this._list.indexOf(item);
            this.selectedIndex = idx;
        }

        /**
         * 移除单个组件
         * 
         * @param {IGroupItem} item
         */
        public removeItem(item: IGroupItem) {
            if (item) {
                this._list.remove(item);
                item.off(TE.TOUCH_TAP, this.touchHandler, this);
            }
        }


        /**
         * 添加多个组件
         * 
         * @param {...IGroupItem[]} itemArr
         */
        public addItems(...itemArr: IGroupItem[]) {
            for (let i = 0; i < itemArr.length; i++) {
                let item = itemArr[i];
                this.addItem(item);
            }
        }

        /**
         * 设置选中组件
         */
        public set selectedItem(item: IGroupItem) {
            let _selectedItem = this._selectedItem;
            if (_selectedItem != item) {
                if (_selectedItem) {
                    _selectedItem.selected = false;
                }
                if (item) {
                    if (~this._list.indexOf(item)) {
                        this._selectedItem = item;
                        item.selected = true;
                    }
                    else {
                        ThrowError("Group 设置的组件未添加到该组");
                    }
                }
                else {
                    this._selectedItem = undefined;
                }
                this.dispatch(EventConst.GROUP_CHANGE);
            }
        }

        public get selectedItem(): IGroupItem {
            return this._selectedItem;
        }

        /**
         * 设置选中索引
         */
        public set selectedIndex(idx: number) {
            this._selectedIndex = idx;
            if (idx >= 0) {
                let item = this._list[idx];
                this.selectedItem = item;
            }
            else {
                this.selectedItem = undefined;
            }
        }

        public get selectedIndex() {
            return this._selectedIndex;
        }
    }
}