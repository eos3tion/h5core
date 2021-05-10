namespace jy {
    export class SuiBitmap extends egret.Bitmap {
        isjpg: boolean;
        suiData: SuiData;
        flag: boolean;
        refreshBMD() {
            if (!this.flag) {
                super.refreshBMD();
                this.flag = true;
            }
        }
        beforeDraw() {
            this.suiData.checkRefreshBmp(this, this.isjpg);
        }
    }

    /**
     * 位图的创建器
     * @author 3tion
     *
     */
    export class BitmapCreator extends BaseCreator<SuiBitmap> {
        /**
         * 是否为jpg
         * 
         * @protected
         * @type {boolean}
         */
        protected isjpg?: boolean;
        public constructor(value?: SuiData) {
            super();
            this._suiData = value;
        }

        public parseSelfData(data: any) {
            if (typeof data === "number") {
                if (data < 0) {
                    this.isjpg = true;
                }
                this._createT = () => {
                    let bmp = new SuiBitmap;
                    let suiData = this._suiData;
                    bmp.suiData = suiData;
                    bmp.isjpg = this.isjpg;
                    bmp.texture = suiData.getTexture(data);
                    return bmp;
                }
            }
        }

    }
}
