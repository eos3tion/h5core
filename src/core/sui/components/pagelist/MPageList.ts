module junyou {

    /**
     * 为已布局好的render提供List功能
     * 
     * @export
     * @class MPageList
     * @extends {PageList}
     */
    export class MPageList<T, R extends ListItemRender<T>> extends AbsPageList<T, R>{

        protected _viewCount = 0;
        public constructor() {
            super(null);
        }

        public displayList(data?: T[]) {
            this._selectedIndex = -1;
            let dataLen = data && data.length || 0;
            //如果新赋值的数据长度比以前的短，就自动清理掉多出来的item
            let olen = Math.max(this._dataLen, this._viewCount);
            while (olen > dataLen) {
                let render = this.getItemAt(olen - 1);
                if (render) {
                    render.data = undefined;
                    if (render.handleView) {
                        render.handleView();
                    }
                }
                olen--;
            }
            this._data = data;
            this._dataLen = dataLen;
            this.doRender(0, dataLen - 1);
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
                item.data = data;
                if (item.handleView) {
                    item.handleView();
                }
            }
        }


        public addItem(item: R, index?: number) {
            let list = this._list;
            let idx = list.indexOf(item);
            if (idx == -1) {
                idx = list.length;
                list[idx] = item;
                item.on(EventConst.ITEM_TOUCH_TAP, this.onTouchItem, this);
            }
            item.index = index == undefined ? idx : index;
            this._viewCount = list.length;
        }

        protected _get(index: number) {
            let list = this._list;
            let render = list[index];
            if (render) {
                render.index = index;
                return render;
            }
        }

        public clear() {
            this._dataLen = 0;
            this._data = undefined;
            for (let render of this._list) {
                render.data = undefined;
            }
            this._selectedIndex = -1;
            this._selectedItem = undefined;
        }

        public dispose() {
            for (let render of this._list) {
                render.off(EgretEvent.TOUCH_TAP, this.onTouchItem, this);
            }
            this.clear();
        }

    }
}