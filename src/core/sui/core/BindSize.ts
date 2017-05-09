module junyou {
    /**
     * 用于固定一些组件的宽度和高度，让其等于取出的值
     * 
     * @export
     * @param {Object} define                       定义
     * @param {{ size: egret.Rectangle }} view
     * @returns
     */
    export function bindSize(define: Object, view: { size: egret.Rectangle }) {
        Object.defineProperties(define, {
            width: {
                get() {
                    return view.size.width;
                },
                enumerable: true,
                configurable: true
            },
            height: {
                get() {
                    return view.size.height;
                },
                enumerable: true,
                configurable: true
            }
        })
    }
}