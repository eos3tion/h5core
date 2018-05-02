namespace jy {

    /**
     * @author gushuai
     * Menu样式
     * 
     * @export
     * @interface MenuStyle
     * @template T
     */
    export interface MenuStyle<T> {

        /**
         * 皮肤库
         * 
         * @type {string}
         */
        uikey: string;

        /**
         * 渲染器
         * 
         * @type {{new():T}}
         */
        renderClass: { new (): T };

        /**
         * 背景
         * 
         * @type {string}
         */
        scalebg: string;

        /**
         * x,y为第一个按钮的起始坐标
         * width,height为背景的宽高
         * 
         * @type {egret.Rectangle}
         */
        possize: egret.Rectangle;

        /**
         * 0为水平1为垂直
         * 
         * @type {number}
         */
        align?: number;

    }
}