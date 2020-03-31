namespace jy {
    export function getDynamicTexSheet() {
        let cur = createNewSheet();
        const dict = {} as { [uri: string]: ReturnType<typeof createNewSheet> }
        return {
            bind,
            update,
            bindOrUpdate(uri: string, tex: DynamicTexture) {
                if (get(uri)) {
                    update(uri, tex);
                } else {
                    bind(uri, tex);
                }
            },
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
            get
        }

        function get(uri: string) {
            let _cur = dict[uri];
            return _cur && _cur.sheet.get(uri);
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
            setTexData(bin, sheet, tex);
            let { x, y } = bin;
            sheet.reg(uri, { x, y, width, height }, tex);
        }

        function update(uri: string, tex: egret.Texture) {
            let _cur = dict[uri];
            if (_cur) {//已经有，不做处理
                const { sheet } = _cur;
                let oldTex = sheet.get(uri) as DynamicTexture;
                if (oldTex && oldTex.textureWidth == tex.textureWidth && oldTex.textureHeight == tex.textureHeight) {
                    let bin = oldTex.$bin;
                    setTexData(bin, sheet, tex);
                    sheet.update(uri, bin, tex);
                }
            }
        }

        function setTexData(bin: Bin, sheet: TextureSheet, tex: DynamicTexture) {
            let bmd = tex.bitmapData;
            let source = bmd.source;
            let { width, height } = source;
            tex.$bin = bin;
            //将突破绘制到sheet上，并清除原纹理
            let ctx = sheet.ctx;
            ctx.globalAlpha = 1;
            let { x, y } = bin;
            if (tex instanceof egret.RenderTexture) {
                let imgData = ctx.createImageData(width, height);
                let data = imgData.data;
                tex.$renderBuffer.context.getPixels(0, 0, width, height, data);
                let hh = height >> 1;
                let width4 = width << 2;
                //调整方向
                for (let y = 0; y < hh; y++) {
                    let index1 = width4 * (height - y - 1);
                    let index2 = width4 * y;
                    for (let i = 0; i < width4; i++) {
                        let d1 = index1 + i;
                        let d2 = index2 + i;
                        let tmp = data[d1];
                        data[d1] = data[d2];
                        data[d2] = tmp;
                    }
                }
                ctx.putImageData(imgData, x, y);
            } else {
                ctx.drawImage(source as CanvasImageSource, x, y);
            }
            bmd.$dispose();
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

    export declare type DynamicTexSheet = ReturnType<typeof getDynamicTexSheet>
}