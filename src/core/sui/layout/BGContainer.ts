namespace jy {
    /**
     * ## 背景图容器  
     * 1. 当屏幕长或者宽任意一边大于`基准尺寸(basis)`时  
     *      * 首先根据基准尺寸的宽边得到缩放比
     *      * 然后将容器按此缩放比进行缩放
     *      * 根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     * 2. 如果屏幕的长或者宽都小于或者等于`基准尺寸(basis)`时  
     *      * 直接根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     * 
     * @export
     * @class MainUIContainer
     * @extends {egret.Sprite}
     */
    export class BGContainer extends LayoutContainer {
        protected _layout: LayoutType;
        constructor(basis: Size, host?: egret.Sprite, layout = LayoutType.TOP_CENTER) {
            super(basis, host);
            this._layout = layout;
        }

        onResize() {
            let host = this._host;
            let stage = host.stage || egret.sys.$TempStage;
            let basis = this._basis;
            let sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;

            let dw = sw, dh = sh, lw = sw, lh = sh;
            let scale = 1;
            if (sw > bw || sh > bh) { //屏幕宽高，任意一边大于基准宽高
                let result = getFixedLayout(sw, sh, bw, bh, true);
                dh = result.dh;
                dw = result.dw;
                lw = result.lw;
                lh = result.lh;
                scale = result.scale;
            } else {
                dw = bw;
                dh = bh;
            }
            this._lw = lw;
            this._lh = lh;
            host.scaleY = host.scaleX = scale;
            let pt = Temp.SharedPoint1;
            Layout.getLayoutPos(dw, dh, sw, sh, this._layout, pt);
            host.x = pt.x;
            host.y = pt.y;
            this.layoutAll();
        }
    }
}