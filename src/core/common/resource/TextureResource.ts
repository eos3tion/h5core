
if (DEBUG) {
    var ErrorTexture = new egret.Texture();
    let img = new Image(40, 40);
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAWUlEQVRYR+3SwQkAIAwEwaT/orWI/YiM/wWZ3J6ZMw+/9cF4HYIRcAgSrAK1t0GCVaD2NkiwCtTeBglWgdrbIMEqUHsbJFgFam+DBKtA7W2QYBWovQ1+L3gB8nhP2Y60cpgAAAAASUVORK5CYII="
    ErrorTexture._setBitmapData(img as any);
}
module junyou {


    import Bitmap = egret.Bitmap;
    /**
     * 
     * 纹理资源
     * @export
     * @class TextureResource
     * @implements {IResource}
     */
    export class TextureResource implements IResource {
        /**
         * 最后使用的时间戳
         */
        lastUseTime: number;
        /**
         * 资源id
         */
        resID: string;

        /**
         * 资源最终路径
         */
        url: string;

        /**
         * 
         * 是否为静态不销毁的资源
         * @type {boolean}
         */
        public get isStatic(): boolean {
            return this._list.length > 0;
        }

        private _tex: egret.Texture;

        /**
         * 
         * 绑定的对象列表
         * @private
         * @type {Bitmap[]}
         */
        private _list: Bitmap[] = [];

        /**
         * 
         * 绑定一个目标
         * @param {Bitmap} target
         */
        public bind(bmp: Bitmap) {
            if (this._tex) {
                bmp.texture = this._tex;
                bmp.dispatch(EventConst.Texture_Complete);
            }
            this._list.pushOnce(bmp);
            this.lastUseTime = Global.now;
        }

        /**
         * 
         * 解除目标的绑定
         * @param {Bitmap} target
         */
        public loose(bmp: Bitmap) {
            this._list.remove(bmp);
            this.lastUseTime = Global.now;
        }

        // /**
        //  * 
        //  * 纹理
        //  * @type {egret.Texture}
        //  */
        // public get texture(): egret.Texture {
        //     return this._tex;
        // }

        load() {
            RES.getResByUrl(this.url, this.loadComplete, this, EgretResType.TYPE_IMAGE);
        }

        /**
         * 资源加载完成
         */
        loadComplete(res: egret.Texture, key: string) {
            if (key == this.url) {
                this._tex = res;
                for (let bmp of this._list) {
                    bmp.texture = res;
                    if (DEBUG && !res) {
                        bmp.texture = ErrorTexture;
                        let rect = bmp.suiRawRect;
                        if (rect) {
                            bmp.width = rect.width;
                            bmp.height = rect.height;
                        }
                    }
                    bmp.dispatch(EventConst.Texture_Complete);
                }
            }
        }

        /**
         * 销毁资源
         */
        dispose() {
            if (this._tex) {
                this._tex.dispose();
                this._tex = undefined;
            }
            this._list.length = 0;
        }
    }
}