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
        getColorString(c: number) {
            return "#" + c.toString(16).zeroize(6);
        },

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
        }
    }
}
