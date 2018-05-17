namespace jy {
    /**
     * 常用的颜色常量
     * 
     * @export
     * @enum {number}
     */
    export const enum Color {
        Red = 0xff0000,
        Green = 0xff00,
        Yellow = 0xffff00,
        White = 0xffffff,

        Gray = 0xcccccc,
    }
    /**
     * 常用的颜色字符串常量
     * 
     * @export
     * @enum {string}
     */
    export const enum ColorString {
        Red = "#ff0000",
        Green = "#00ff00",

        Yellow = "#ffff00",
        White = "#ffffff",

        Gray = "#cccccc",
    }

    function getColorString(c: number) {
        return "#" + c.toString(16).zeroize(6);
    }

    const textureCaches: { [colorKey: string]: egret.Texture } = {};

	/**
	 * 颜色工具
	 * @author 3tion
	 *
	 */
    export const ColorUtil = {
        /**
         * 获取颜色字符串 #a1b2c3
         * @param c
         * @return 获取颜色字符串 #a1b2c3
         *
         */
        getColorString,

        /**
         * 将#a1b2c3这样#开头的颜色字符串，转换成颜色数值
         */
        getColorValue(c: string) {
            if (/#[0-9a-f]{6}/i.test(c)) {
                return +("0x" + c.substring(1));
            } else {
                if (DEBUG) {
                    ThrowError(`使用的颜色${c}有误`);
                }
                return 0;
            }
        },
        /**
         * 获取一个纯色的纹理
         */
        getTexture(color = 0, alpha = 0.8) {
            let key = color + "_" + alpha;
            let tex = textureCaches[key];
            if (!tex) {
                let canvas = document.createElement("canvas");
                canvas.height = canvas.width = 1;
                let ctx = canvas.getContext("2d");
                ctx.globalAlpha = alpha;
                ctx.fillStyle = getColorString(color);
                ctx.fillRect(0, 0, 1, 1);
                tex = new egret.Texture();
                tex.bitmapData = new egret.BitmapData(canvas);
            }
            return tex;
        }
    }
}
