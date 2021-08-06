namespace jy {
    export declare type ScaleBitmap = SuiBitmap;
    export class ScaleBitmapCreator extends BitmapCreator {

        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            let mdata = data[0];
            let textureIndex = mdata[2];
            if (textureIndex < 0) {
                this.isjpg = true;
            }
            this.texIdx = textureIndex;
            let rectData = data[1];
            let flag = data[0] != 0;
            let rectData2 = mdata[1];
            let width = rectData2[3];
            let height = rectData2[4];
            if (rectData) {
                var rect = new egret.Rectangle(rectData[0], rectData[1], rectData[2], rectData[3]);
            }
            this._createT = () => {
                let suiData = this._suiData;
                let bitmap = new SuiBitmap();
                bitmap.suiData = suiData;
                bitmap.scale9Grid = rect;
                if (flag) {
                    bitmap.texture = suiData.getTexture(textureIndex);
                    bitmap.width = width;
                    bitmap.height = height;
                }
                return bitmap;
            }
        }
    }
}