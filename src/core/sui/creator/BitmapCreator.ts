module junyou {
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
                    return <T>bmp;
                }
            }
        }

        protected bindEvent(bmp: egret.Bitmap) {
            bmp.on(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            bmp.on(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        }

        protected onAddedToStage(e: egret.Event) {
            const suiData = this._suiData;
            if (suiData) {
                let bmp = <egret.Bitmap>e.currentTarget;
                suiData.checkRefreshBmp(bmp, this.isjpg);
            }
        }

        protected onRemoveFromStage(e: egret.Event) {
            const suiData = this._suiData;
            if (suiData) {
                let bmd = this.isjpg ? suiData.jpgbmd : suiData.pngbmd;
                bmd.using--;
                bmd.lastUseTime = Global.now;
            }
        }
    }
}
