
if (DEBUG) {
    var ErrorTexture = jy.ColorUtil.getTexture(0xff0000,1);
}
namespace jy {


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
        readonly uri: string;

        /**
         * 资源最终路径
         */
        readonly url: string;

        /**
         * 加载列队
         */
        qid?: Res.ResQueueID;

        constructor(uri: string, noWebp?: boolean) {
            this.uri = uri;
            this.url = ConfigUtils.getResUrl(uri + (!noWebp ? Global.webp : ""))
        }
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

        load() {
            Res.load(this.uri, this.url, CallbackInfo.get(this.loadComplete, this), this.qid);
        }

        /**
         * 资源加载完成
         */
        loadComplete(item: Res.ResItem) {
            let { data, uri } = item;
            if (uri == this.uri) {
                this._tex = data;
                for (let bmp of this._list) {
                    bmp.texture = data;
                    if (DEBUG && !data) {
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