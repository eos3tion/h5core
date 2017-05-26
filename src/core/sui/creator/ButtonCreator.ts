module junyou {
	/**
	 * 按钮创建器
	 * @author 3tion
	 *
	 */
    export class ButtonCreator extends BaseCreator<Button> {
        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            var suiData = this._suiData;
            // var manager = singleton(SuiResManager);
            var tc: TextFieldCreator;
            if (data[0]) {
                tc = new TextFieldCreator();
                tc.setBaseData(data[0][1]);
                tc.parseSelfData(data[0][2]);
            }
            var bcs: BitmapCreator<egret.Bitmap>[] = [];
            for (var i = 1; i < 5; i++) {
                var dat = data[i];
                if (dat) {
                    let bc = new BitmapCreator(suiData);
                    bc.parseData(dat, suiData);
                    bcs[i - 1] = bc;
                }
            }

            this._createT = () => {
                var btn = new Button();
                if (tc) {
                    btn.txtLabel = tc.get();
                }
                var bmps = [];
                for (var i = 0; i < 4; i++) {
                    if (bcs[i]) {
                        bmps[i] = bcs[i].get();
                    }
                }
                if (!bmps[1]) { //启用 选中帧 没有图片
                    bmps[1] = bmps[0];
                }
                if (!bmps[2]) { //禁用 未选中帧 没有图片
                    bmps[2] = bmps[0];
                    btn.useDisableFilter(true);
                }
                if (!bmps[3]) { //禁用 选中帧 没有图片
                    bmps[3] = bmps[2];
                }
                btn.bitmaps = bmps;
                if (data[5]) {
                    btn.floor = this.createElement(data[5]);
                }
                if (data[6]) {
                    btn.ceil = this.createElement(data[6]);
                }
                return btn;
            }
        }
    }
}
