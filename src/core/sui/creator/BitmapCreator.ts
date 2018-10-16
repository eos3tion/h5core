namespace jy {
	/**
	 * 位图的创建器
	 * @author 3tion
	 *
	 */
    export class BitmapCreator<T extends egret.Bitmap> extends BaseCreator<T> {
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
                    let bmp = new egret.Bitmap;
                    bmp.texture = this._suiData.getTexture(data);
                    this.bindEvent(bmp);
                    return bmp as T;
                }
            }
        }

        protected bindEvent(bmp: egret.Bitmap) {
            bmp.on(EgretEvent.ADDED_TO_STAGE, this.awake, this);
            bmp.on(EgretEvent.REMOVED_FROM_STAGE, this.sleep, this);
        }

        protected awake(e: egret.Event) {
            const suiData = this._suiData;
            if (suiData) {
                let bmp = e.currentTarget as egret.Bitmap;
                suiData.checkRefreshBmp(bmp, this.isjpg);
            }
        }

        protected sleep() {
            const suiData = this._suiData;
            if (suiData) {
                let bmd = this.isjpg ? suiData.jpgbmd : suiData.pngbmd;
                bmd.using--;
                bmd.lastUseTime = Global.now;
            }
        }
    }
}
