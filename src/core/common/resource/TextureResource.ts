
if (DEBUG) {
    var ErrorTexture = jy.ColorUtil.getTexture(0xff0000, 1);
}
namespace jy {

    export interface TextureResourceOption {
        /**
         * 是否不要webp纹理
         */
        noWebp?: boolean;

        /**
         * 是否将纹理装箱到指定纹理集  
         * 如果不设置，则表示没有
         */
        sheetKey?: Key;

        /**
         * sheet的尺寸
         */
        sheetSize?: number;

        /**
         * 绘制特殊形状的纹理
         */
        sheetPath?: Path2D;

        /**
         * 路径的底色
         */
        sheetColor?: string;
    }


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

        state = RequestState.UNREQUEST;

        /**
         * 加载列队
         */
        qid?: Res.ResQueueID;


        readonly opt: TextureResourceOption;


        constructor(uri: string, opt: TextureResourceOption) {
            this.uri = uri;
            this.url = ConfigUtils.getResUrl(uri + (!opt.noWebp ? Global.webp : ""))
            this.opt = opt;
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
        public bind(bmp: Bitmap, placehoder?: egret.Texture, load?: boolean) {
            let tex = this._tex;
            this._list.pushOnce(bmp);
            if (tex) {
                bmp.texture = this._tex;
                Global.nextTick(bmp.dispatch, bmp, EventConst.Texture_Complete);
            } else {
                bmp.texture = placehoder;
                load && this.load();
            }
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
            if (this.state == RequestState.UNREQUEST) {
                this.state = RequestState.REQUESTING;
                Res.loadRes({
                    uri: this.uri,
                    url: this.url,
                    type: Res.ResItemType.Image
                }, CallbackInfo.get(this.loadComplete, this), this.qid);
            }
        }

        /**
         * 资源加载完成
         */
        loadComplete(item: Res.TypedResItem<egret.Texture>) {
            let { data, uri } = item;
            if (uri == this.uri) {
                let opt = this.opt;
                let sheetKey = opt.sheetKey;
                if (sheetKey && data) {
                    let sheet = sheetsDict[sheetKey];
                    if (!sheet) {
                        sheetsDict[sheetKey] = sheet = getDynamicTexSheet(opt.sheetSize, opt.sheetPath, opt.sheetColor);
                    }
                    let dat = sheet.get(uri);
                    if (dat) {
                        data = dat;
                    } else {
                        data = sheet.bind(uri, data);
                    }
                    if (DEBUG) {
                        if (!data.$bitmapData.source) {//source已经被干掉，则不合并
                            Log(`要绑定的DynamicTexture[uri:${uri}]，source已经被干掉，请检查，应该可以进行优化，资源首次注册:\n${this["DEBUG_TRACE"]}`);
                            console.log("控件列表", this._list);
                        }
                    }
                }
                this._tex = data;
                this.state = RequestState.COMPLETE;
                for (let bmp of this._list) {
                    bmp.texture = data;
                    if (!data) {
                        bmp.texture = bmp.placehoder || (DEBUG && ErrorTexture);
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
            let tex = this._tex;
            if (tex) {
                this._tex = undefined;
                let sheetKey = this.opt.sheetKey;
                if (sheetKey) {
                    let sheet = sheetsDict[sheetKey];
                    if (sheet) {
                        sheet.remove(this.uri);
                    }
                }
                if (!(tex as DynamicTexture).sheet) {//有sheet的不销毁，只切断引用
                    tex.dispose();
                }
            }
            this._list.length = 0;
            this.state = RequestState.UNREQUEST;
        }

        /**
         * 获取纹理资源
         * 
         * @param {string} resID 资源id
         * @param {boolean} [noWebp] 是否不加webp后缀
         * @returns {TextureResource} 
         */
        static get(uri: string, opt: TextureResourceOption) {
            let sheetKey = opt.sheetKey;
            if (sheetKey) {//有sheetKey的不受ResManager管控，必须自行控制
                let data = sheetRes[sheetKey];
                if (!data) {
                    sheetRes[sheetKey] = data = {};
                }
                let res = data[uri];
                if (!res) {
                    data[uri] = res = new TextureResource(uri, opt);
                }
                return res;
            } else {
                let res = ResManager.getResource(uri) as TextureResource;
                if (res) {
                    if (!(res instanceof TextureResource)) {
                        ThrowError(`[${uri}]资源有误，不是TextureResource`);
                        res = undefined;
                    }
                }
                if (!res) {
                    res = new TextureResource(uri, opt);
                    ResManager.regResource(uri, res);
                }
                return res;
            }
        }

        static dispose(sheetKey: Key) {
            let sheet = sheetsDict[sheetKey];
            let data = sheetRes[sheetKey];
            if (data) {
                for (let uri in data) {
                    let tex = data[uri];
                    tex.dispose();
                }
                sheetRes[sheetKey] = {};
            }
            sheet.dispose();
        }
    }

    const sheetRes = {} as { [key: string]: { [uri: string]: TextureResource } }
    const sheetsDict = {} as { [key: string]: DynamicTexSheet };

}