module junyou {

    /**
     * 为已布局好的render提供List功能
     * 
     * @export
     * @class MPageList
     * @extends {PageList}
     */
    export class MPageList<T, R extends ListItemRender<T>> extends PageList<T, R>{

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
                let render = this.getItemRenderAt(olen - 1);
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
            this.doRenderListItem(0, dataLen - 1);
        }

        public addItem(item: R, index?: number) {
            let list = this._renderList;
            let idx = list.indexOf(item);
            if (idx == -1) {
                idx = list.length;
                list[idx] = item;
                item.on(EventConst.ITEM_TOUCH_TAP, this.touchItemrender, this);
            }
            item.index = index == undefined ? idx : index;
            this._viewCount = list.length;
        }

        public recycle() {
            this._dataLen = 0;
            this._data = undefined;
            for (let render of this._renderList) {
                render.data = undefined;
            }
            this._selectedIndex = -1;
            this._selectedItem = undefined;
        }
        protected childSizeChange() { }
        protected reCalc() { }
    }
}