module junyou {
	/**
	 *
	 * @author gushuai
	 *
	 */
    export class ArtTextCreator extends BaseCreator<ArtText>{

        private _txs: { [index: string]: egret.Texture };

        public parseSelfData(data: any) {
            const splitStr = data[0];
            const len = splitStr.length;
            const suiData = this._suiData;
            // const imgs = suiData.pngtexs;
            let txs: { [index: string]: egret.Texture } = {};
            for (let i = 0; i < len; i++) {
                let tx: egret.Texture = suiData.getTexture(data[i + 1]);//imgs[data[i + 1]];
                let key: string = splitStr.charAt(i);
                txs[key] = tx;
            }
            this._txs = txs;
            refreshTexs(suiData, this as any);
            this._createT = (): ArtText => {
                var shape: ArtText = new ArtText();
                this.bindEvent(shape);
                shape.textures = txs;
                return shape;
            }
        }

        protected bindEvent(bmp: ArtText) {
            bmp.on(EgretEvent.ADDED_TO_STAGE, this.onAddedToStage, this);
            bmp.on(EgretEvent.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
        }

        protected onAddedToStage(e: egret.Event) {
            var suiData = this._suiData;
            if (suiData) {
                let bmp = <egret.Bitmap>e.currentTarget;
                suiData.checkRefreshBmp(bmp);
            }
        }

        protected onRemoveFromStage() {
            var suiData = this._suiData;
            if (suiData) {
                let bmd = suiData.pngbmd;
                bmd.using--;
                bmd.lastUseTime = Global.now;
            }
        }
    }
}
