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
}