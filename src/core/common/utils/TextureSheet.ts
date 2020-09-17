namespace jy {

    export const enum TextureSheetConst {
        DefaultSize = 256,
        MaxSize = 2048,
        Padding = 1,
    }

    export function updateEgretTexutre(bmd: egret.BitmapData) {
        let glTexture = bmd.webGLTexture;
        if (glTexture) {//清理webgl纹理，让渲染可以重置
            let gl = glTexture.glContext as WebGLRenderingContext;
            if (gl) {
                gl.bindTexture(gl.TEXTURE_2D, glTexture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmd.source);
            }
        }
    }

    export function getTextureSheet(size: number = TextureSheetConst.DefaultSize, canvas?: HTMLCanvasElement) {
        canvas = canvas || document.createElement("canvas");//canvas作为可传入，避免如“小程序”或其他环境，需要通过其他方法创建canvas
        let bmd = new egret.BitmapData(canvas);
        bmd.width = bmd.height = canvas.height = canvas.width = size;
        bmd.$deleteSource = false;
        let ctx = canvas.getContext("2d");
        let texCount = 0;
        let changed = false;
        let sizeChanged = false;
        const texs = {} as { [key: string]: egret.Texture }
        return {
            /**
             * 获取纹理
             * @param key 
             */
            get(key: Key) {
                return texs[key];
            },
            /**
             * 注册纹理
             * @param key 纹理的key
             * @param rect 纹理的坐标和宽度高度  
             * @param [ntex] 外部纹理，如果不传，则直接创建
             * @returns {egret.Texture} 则表明注册成功
             */
            reg(key: Key, rect: Rect, ntex?: egret.Texture) {
                let tex = texs[key];
                if (!tex) {
                    tex = ntex || new egret.Texture;
                    texCount++;
                }
                update(key, rect, tex)
                return tex;
            },
            /**
             * 更新纹理
             */
            update,
            /**
             * 删除指定纹理
             * @param key 
             */

            remove(key: Key) {
                let tex = texs[key];
                if (tex) {
                    ctx.clearRect(tex.$bitmapX, tex.$bitmapY, tex.textureWidth, tex.textureHeight);
                    delete texs[key];
                    texCount--;
                    return tex;
                }
            },
            /**
             * 获取上下文对象
             */
            get ctx() {
                return ctx;
            },
            /**
             * 扩展尺寸
             * @param newSize 
             */
            extSize(newSize: number) {
                if (newSize > TextureSheetConst.MaxSize) {//2048为相对比较安全的纹理尺寸
                    return false;
                }
                if (newSize > size) {
                    let data = ctx.getImageData(0, 0, size, size);
                    size = newSize;
                    bmd.width = bmd.height = canvas.height = canvas.width = size;
                    ctx.putImageData(data, 0, 0);
                    sizeChanged = true;
                    invalidate();
                }
                return true;
            },
            /**
             * 销毁纹理
             */
            dispose() {
                canvas.width = canvas.height = 0;
                bmd.$dispose();
            },
            getTexCount() {
                return texCount;
            },
            /**
             * 获取当前尺寸
             */
            getSize() {
                return size;
            }
        }

        function invalidate() {
            if (!changed) {
                changed = true;
                Global.nextTick(doUpdate);
            }
        }

        function doUpdate() {
            updateEgretTexutre(bmd);
            if (sizeChanged) {
                egret.BitmapData.$invalidate(bmd);
                sizeChanged = false;
            }
            changed = false;
        }

        function update(key: Key, rect: Rect, tex: DynamicTexture) {
            const { x, y, width, height } = rect;
            tex.disposeBitmapData = false;
            tex.bitmapData = bmd;
            tex.$rect = rect;
            texs[key] = tex;
            tex.$initData(x, y, width, height, 0, 0, width, height, width, height);
            invalidate();
        }
    }
    export interface DynamicTexture extends egret.Texture {
        $bin?: Bin;
        sheet?: TextureSheet;
        $rect?: Rect;
        $dtid?: number;
    }
    export type TextureSheet = ReturnType<typeof getTextureSheet>;
}