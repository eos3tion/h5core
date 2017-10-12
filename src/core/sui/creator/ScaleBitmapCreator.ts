module junyou {
    /**
     * 
     * 用于处理从Flash中导出的带九宫缩放的位图
     * @export
     * @class ScaleBitmap
     * @extends {egret.Bitmap}
     * @author gushuai
     */
    export class ScaleBitmap extends egret.Bitmap {

        public width: number;

        public height: number;

        public constructor() {
            super();
        }


        /**
        * @private
        *
        * @param context
        */
        $render(): void {
            var image = this.$Bitmap[egret.sys.BitmapKeys.bitmapData];
            if (!image) {
                return;
            }
            var values = this.$Bitmap;
            egret.sys.BitmapNode.$updateTextureData(<egret.sys.BitmapNode>this.$renderNode, this.texture.bitmapData,
                values[egret.sys.BitmapKeys.bitmapX], values[egret.sys.BitmapKeys.bitmapY], values[egret.sys.BitmapKeys.bitmapWidth], values[egret.sys.BitmapKeys.bitmapHeight],
                values[egret.sys.BitmapKeys.offsetX], values[egret.sys.BitmapKeys.offsetY], values[egret.sys.BitmapKeys.textureWidth], values[egret.sys.BitmapKeys.textureHeight],
                this.width, this.height, values[egret.sys.BitmapKeys.sourceWidth], values[egret.sys.BitmapKeys.sourceHeight], this.scale9Grid, this.$fillMode, values[egret.sys.BitmapKeys.smoothing]);
        }

    }

    export class ScaleBitmapCreator extends BitmapCreator<ScaleBitmap>{

        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            let mdata = data[0];
            let textureIndex = mdata[2];
            if (textureIndex < 0) {
                this.isjpg = true;
            }
            let rectData = data[1];
            let flag = data[0] != 0;
            let rectData2 = mdata[1];
            let width = rectData2[3];
            let height = rectData2[4];
            if (rectData) {
                var rect = new egret.Rectangle(rectData[0], rectData[1], rectData[2], rectData[3]);
            }
            this._createT = (): ScaleBitmap => {
                let suiData = this._suiData;
                let bitmap: ScaleBitmap = new ScaleBitmap();
                // let inx = textureIndex;
                // let img = suiData.pngtexs;
                // if(!this.ispng){
                //     inx = -1-textureIndex;
                //     img = suiData.jpgtexs;
                // }
                bitmap.scale9Grid = rect;
                if (flag) {
                    bitmap.texture = suiData.getTexture(textureIndex);//img[inx];//suiData.imgs[textureIndex];
                    bitmap.width = width;
                    bitmap.height = height;
                    this.bindEvent(bitmap);
                }
                return bitmap;
            }
        }
    }
}