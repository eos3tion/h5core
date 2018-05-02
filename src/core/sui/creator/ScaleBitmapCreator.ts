namespace jy {
    export declare type ScaleBitmap = egret.Bitmap;
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
            this._createT = () => {
                let suiData = this._suiData;
                let bitmap = new egret.Bitmap();
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