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
            var image = this.$bitmapData;
            if (!image) {
                return;
            }
            egret.sys.BitmapNode.$updateTextureDataWithScale9Grid(<egret.sys.NormalBitmapNode>this.$renderNode, this.texture.bitmapData, this.scale9Grid,
                this.$bitmapX, this.$bitmapY, this.$bitmapWidth, this.$bitmapHeight,
                this.$offsetX, this.$offsetY, this.$textureWidth, this.$textureHeight,
                this.width, this.height, this.$sourceWidth, this.$sourceHeight, this.$smoothing);
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