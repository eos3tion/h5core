module junyou {
    /**
     * 格位创建器
     * 
     * @export
     * @class SlotCreator
     * @extends {BaseCreator<Slot>}
     * @author pb
     */
    export class SlotCreator extends BaseCreator<Slot>{

        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            let scaleData = data[0];
            let rect = scaleData ? new egret.Rectangle(scaleData[0], scaleData[1], scaleData[2], scaleData[3]) : undefined;
            this._createT = () => {
                let slot = new Slot();
                slot.rect = rect;
                let item = data[1];
                if (item) {
                    let dis = this.createElement(item);
                    slot.countTxt = <egret.TextField>dis;
                }
                item = data[2];
                if (item) {
                    let dis = this.createElement(item);
                    if (item.length > 1) {
                        slot.bg = <ScaleBitmap>dis;
                    }
                    else {
                        slot.bg = <egret.Bitmap>dis;
                    }
                }
                slot.invalidateDisplay();
                return slot;
            }
        }
    }
}