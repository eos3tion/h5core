namespace jy {

    let tex: egret.RenderTexture;
    egret.callLater(function () {
        tex = new egret.RenderTexture()
    }, null)

    const tmpSource = { width: 0, height: 0 };
    const _bmd = new egret.BitmapData(tmpSource);
    const matrix = new DOMMatrix();
    let dtid = 1;

    export function getDynamicTexSheet(size?: number, path?: Path2D, pathColor?: string) {
        let $TextureScaleFactor = egret.$TextureScaleFactor;
        let _size = size || TextureSheetConst.MaxSize >> 2;
        let _dtid = dtid++;
        const dict = {} as { [uri: string]: ReturnType<typeof createNewSheet> }
        let sheets = [] as TextureSheet[];
        let cur = createNewSheet(_size);
        return {
            getSheet(uri: string) {
                return dict[uri]?.sheet;
            },
            bind,
            draw,
            update,
            bindOrUpdate(uri: Key, tex: DynamicTexture) {
                if (get(uri)) {
                    update(uri, tex);
                } else {
                    bind(uri, tex);
                }
            },
            remove(uri: Key) {
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
            get,
            dispose() {
                for (let i = 0; i < sheets.length; i++) {
                    const sheet = sheets[i];
                    sheet.dispose();
                }
                sheets.length = 0;
            }
        }

        function draw(uri: Key, display: egret.DisplayObject, clipBounds?: egret.Rectangle, scale?: number) {
            tex.drawToTexture(display, clipBounds, scale);
            const { textureWidth: width, textureHeight: height } = tex;
            let _cur = dict[uri];
            if (!_cur) {//已经有，不做处理
                _cur = cur;
            }
            let { sheet } = _cur;
            let oldTex = sheet.get(uri) as DynamicTexture;
            let out: DynamicTexture;
            if (oldTex) {
                if (oldTex.textureWidth == width && oldTex.textureHeight == height) {
                    out = oldTex;
                }
            } else {
                out = new egret.Texture as DynamicTexture;
                tmpSource.width = width;
                tmpSource.height = height;
                out.$bitmapData = _bmd;
                out.$textureWidth = width;
                out.$textureHeight = height;
                bind(uri, out);
                sheet = out.sheet;
            }
            if (out) {
                let { x, y } = out.$bin;
                let ctx = sheet.ctx;
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
                sheet.update(uri, { x, y, width, height }, out);
            }
            return out;
        }

        function get(uri: Key) {
            let _cur = dict[uri];
            return _cur && _cur.sheet.get(uri);
        }
        function bind(uri: Key, tex: DynamicTexture) {
            //检查是否已经加载过
            let _cur = dict[uri];
            if (_cur) {//已经有，不做处理
                return tex;
            }
            let { textureWidth: width, textureHeight: height } = tex;
            if (width > TextureSheetConst.MaxSize || height > TextureSheetConst.MaxSize) {//超过大小的纹理不做任何处理
                return tex;
            }
            if (!tex.$bitmapData.source) {//source已经被干掉，则不合并
                DEBUG && ThrowError(`要绑定的DynamicTexture[uri:${uri}]，source已经被干掉，请检查，应该可以进行优化`)
                return tex;
            }
            _cur = cur;
            const { sheet, packer } = _cur;
            let ww = width + TextureSheetConst.Padding;//padding
            let hh = height + TextureSheetConst.Padding;//padding
            let bin = packer.insert(ww, hh);
            if (!bin) {//装不下
                let size = sheet.getSize();
                while (true) {
                    let willSize = size << 1;
                    //先扩展
                    if (willSize <= TextureSheetConst.MaxSize) {
                        size = willSize;
                        packer.extSize(size, size);
                        sheet.extSize(size);
                        bin = packer.insert(ww, hh);
                        if (bin) {//加倍纹理大小了，还放不下，说明当前纹理和之前用的纹理大小差异很大，直接不扩充纹理
                            break
                        }
                    } else {
                        let size = _size;
                        let max = Math.max(ww, hh);
                        if (max > size) {
                            size = roundUpToNextPowerOfTwo(max);
                        }
                        //创建新纹理
                        cur = createNewSheet(size);
                        return bind(uri, tex);
                    }
                }
            }
            dict[uri] = cur;
            let { x, y } = bin;
            tex = setTexData(bin, sheet, tex);
            sheet.reg(uri, { x, y, width, height }, tex);
            return tex;
        }

        function update(uri: Key, tex: egret.Texture) {
            let _cur = dict[uri];
            if (_cur) {//已经有，不做处理
                const { sheet } = _cur;
                let oldTex = sheet.get(uri) as DynamicTexture;
                if (oldTex && oldTex.textureWidth == tex.textureWidth && oldTex.textureHeight == tex.textureHeight) {
                    let bin = oldTex.$bin;
                    let rect = oldTex.$rect;
                    setTexData(bin, sheet, tex);
                    sheet.update(uri, rect, tex);
                }
            }
        }

        function setTexData(bin: Bin, sheet: TextureSheet, rawTex: DynamicTexture) {
            let $dtid = rawTex.$dtid;
            let tex = rawTex;
            let createNew = false;
            if (!$dtid && path || $dtid && $dtid != _dtid) {
                tex = new egret.Texture;
                createNew = true;
            }
            tex.$dtid = _dtid;
            tex.$bin = bin;
            tex.sheet = sheet;
            let bmd = rawTex.bitmapData;
            if (bmd != _bmd) {
                let _path = path;
                //检查纹理偏移量
                if (createNew) {
                    if (!_path) {
                        _path = new Path2D();
                        _path.rect(0, 0, rawTex.$textureWidth, rawTex.$textureHeight);
                    }
                }
                //将突破绘制到sheet上，并清除原纹理
                let ctx = sheet.ctx;
                ctx.globalAlpha = 1;
                let source = bmd.source;
                let { x, y } = bin;
                if (_path) {
                    ctx.save();
                    ctx.translate(x, y);
                    if (pathColor) {
                        ctx.fillStyle = pathColor;
                        ctx.fill(_path);
                    }
                    let pattern = ctx.createPattern(source as CanvasImageSource, "no-repeat");
                    matrix.e = -rawTex.$bitmapX * $TextureScaleFactor;
                    matrix.f = -rawTex.$bitmapY * $TextureScaleFactor;
                    pattern.setTransform(matrix);
                    ctx.fillStyle = pattern;
                    ctx.fill(_path);
                    ctx.restore();
                } else {//直接复制
                    ctx.drawImage(source as CanvasImageSource, x, y);
                    bmd.$dispose();
                }
            }
            return tex;
        }

        function createNewSheet(size?: number) {
            size = size || TextureSheetConst.MaxSize >> 2;
            let sheet = getTextureSheet(size);
            sheets.push(sheet);
            let packer = new ShortSideBinPacker(size, size);
            return { sheet, packer }
        }

        function roundUpToNextPowerOfTwo(n: number) {
            n--;
            n |= n >>> 1;
            n |= n >>> 2;
            n |= n >>> 4;
            n |= n >>> 8;
            n |= n >>> 16;
            n++;
            return n;
        }
    }


    export declare type DynamicTexSheet = ReturnType<typeof getDynamicTexSheet>
}