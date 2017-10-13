module junyou {
    /**
     * 多选分组
     * 
     * @export
     * @class CheckBoxGroup
     * @extends {Group}
     * @author 3tion
     */
    export class CheckBoxGroup extends Group {
        /**
         * 最大可选中的数量
         * undefined或者0表示无限制
         * @protected
         * @type {number}
         */
        protected maxSelected: number;

        /**
         * 选中的选项
         * 
         * @protected
         * @type {IGroupItem[]}
         */
        protected _selected: IGroupItem[] = [];

        constructor(maxSelected?: number) {
            super();
            this.maxSelected = maxSelected;
        }

        removeItem(item: IGroupItem) {
            if (item) {
                this._list.remove(item);
                this._selected.remove(item);
                item.off(EgretEvent.TOUCH_TAP, this.touchHandler, this);
                return item;
            }
        }

        protected $setSelectedItem(item?: IGroupItem) {
            if (!item) {//不改变当前选中
                return;
            }
            // 检查是否勾选
            const selected = this._selected;
            let changed: boolean, idx = -1;
            if (item.selected) {
                item.selected = false;
                selected.remove(item);
                idx = selected.length - 1;
                changed = true;
            } else {
                //未选中，检查当前选中的按钮是否达到最大数量
                let maxSelected = this.maxSelected || Infinity;
                if (selected.length < maxSelected) {
                    item.selected = true;
                    idx = selected.pushOnce(item);
                    changed = true;
                } else {
                    return this.dispatch(EventConst.GROUP_FULL);
                }
            }
            if (changed) {
                this._selectedIndex = idx;
                this._selectedItem = !~idx ? selected[idx] : undefined;
                return this.dispatch(EventConst.GROUP_CHANGE);
            }
        }

        /**
         * 获取选中的选项
         * 
         * @readonly
         */
        public get selected(): ReadonlyArray<IGroupItem> {
            return this._selected;
        }

        clear() {
            super.clear();
            this._selected.length = 0;
        }
    }
}