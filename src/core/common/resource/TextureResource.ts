
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

        /**
         * 加载列队
         */
        qid?: Res.ResQueueID;
        /**
         * 关联的纹理表单标识
         */
        sheetKey: Key;

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
        public bind(bmp: Bitmap, placehoder?: egret.Texture, load?: boolean) {
            let tex = this._tex;
            if (tex) {
                bmp.texture = this._tex;
                bmp.dispatch(EventConst.Texture_Complete);
            } else {
                bmp.texture = placehoder;
                this._list.pushOnce(bmp);
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
            Res.loadRes({
                uri: this.uri,
                url: this.url,
                type: Res.ResItemType.Image
            }, CallbackInfo.get(this.loadComplete, this), this.qid);
        }

        /**
         * 资源加载完成
         */
        loadComplete(item: Res.TypedResItem<egret.Texture>) {
            let { data, uri } = item;
            if (uri == this.uri) {
                let sheetKey = this.sheetKey;
                if (sheetKey && data) {
                    let sheet = sheetsDict[sheetKey];
                    if (!sheet) {
                        sheetsDict[sheetKey] = sheet = getDynamicTexSheet();
                    }
                    let dat = sheet.get(uri);
                    if (dat) {
                        data = dat;
                    } else {
                        sheet.bind(uri, data);
                    }
                }
                this._tex = data;
                for (let bmp of this._list) {
                    bmp.texture = data;
                    if (DEBUG && !data) {
                        bmp.texture = bmp.placehoder || ErrorTexture;
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
                let sheetKey = this.sheetKey;
                if (sheetKey) {
                    let sheet = sheetsDict[sheetKey];
                    if (sheet) {
                        sheet.remove(this.uri);
                    }
                }
                tex.dispose();
            }
            this._list.length = 0;
        }

        /**
         * 获取纹理资源
         * 
         * @param {string} resID 资源id
         * @param {boolean} [noWebp] 是否不加webp后缀
         * @returns {TextureResource} 
         */
        static get(uri: string, { noWebp, sheetKey }: TextureResourceOption) {
            let res = ResManager.getResource(uri) as TextureResource;
            if (res) {
                if (!(res instanceof TextureResource)) {
                    ThrowError(`[${uri}]资源有误，不是TextureResource`);
                    res = undefined;
                }
            }
            if (!res) {
                res = new TextureResource(uri, noWebp);
                res.sheetKey = sheetKey;
                ResManager.regResource(uri, res);
            }
            return res;
        }
    }


    function getDynamicTexSheet() {
        let cur = createNewSheet();
        const dict = {} as { [uri: string]: ReturnType<typeof createNewSheet> }
        return {
            bind,
            remove(uri: string) {
                let _cur = dict[uri];
                if (_cur) {
                    const { sheet, packer } = _cur;
                    let tex = sheet.remove(uri) as DynamicTexture;
                    if (tex) {
                        let bin = tex.$bin;
                        if (bin) {
                            tex.$bin = undefined;
                            //将位置还原给装箱数据
                            packer.usedRects.remove(bin);
                            packer.freeRects.pushOnce(bin);
                        }
                    }
                }
            },
            get(uri: string) {
                let _cur = dict[uri];
                return _cur && _cur.sheet.get(uri);
            }
        }
        function bind(uri: string, tex: DynamicTexture) {
            //检查是否已经加载过
            let _cur = dict[uri];
            if (_cur) {//已经有，不做处理
                return
            }
            let bmd = tex.bitmapData;
            let source = bmd.source;
            let { width, height } = source;
            if (width > TextureSheetConst.MaxSize || height > TextureSheetConst.MaxSize) {//超过大小的纹理不做任何处理
                return;
            }
            _cur = cur;
            const { sheet, packer } = _cur;
            let ww = width + TextureSheetConst.Padding;//padding
            let hh = height + TextureSheetConst.Padding;//padding
            let bin = packer.insert(ww, hh);
            if (!bin) {//装不下
                let size = sheet.getSize();
                //先扩展
                if (size < TextureSheetConst.MaxSize) {
                    size = size << 1;
                    packer.extSize(size, size);
                    sheet.extSize(size);
                    bin = packer.insert(ww, hh);
                    if (!bin) {//加倍纹理大小了，还放不下，说明当前纹理和之前用的纹理大小差异很大，直接不扩充纹理
                        return
                    }
                } else {
                    //创建新纹理
                    cur = createNewSheet();
                    return bind(uri, tex);
                }
            }
            dict[uri] = cur;
            tex.$bin = bin;
            //将突破绘制到sheet上，并清除原纹理
            let ctx = sheet.ctx;
            ctx.globalAlpha = 1;
            let { x, y } = bin;
            ctx.drawImage(source as CanvasImageSource, x, y);
            bmd.$dispose();
            sheet.reg(uri, { x, y, width, height }, tex);
        }
        function createNewSheet() {
            let size = TextureSheetConst.MaxSize >> 2;
            let sheet = getTextureSheet(size);
            let packer = new ShortSideBinPacker(size, size);
            return { sheet, packer }
        }
    }

    interface DynamicTexture extends egret.Texture {
        $bin?: Bin;
    }

    declare type DynamicTexSheet = ReturnType<typeof getDynamicTexSheet>

    const sheetsDict = {} as { [key: string]: DynamicTexSheet };

}