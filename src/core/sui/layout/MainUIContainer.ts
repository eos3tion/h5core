var $useDPR = true;
var dpr = 1;
if ((window as any).$useDPR) {
    dpr = window.devicePixelRatio || 1;
    var origin = egret.sys.DefaultScreenAdapter.prototype.calculateStageSize;
    egret.sys.screenAdapter = {
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number) {
            let result = origin(scaleMode, screenWidth, screenHeight, contentWidth, contentHeight);
            if (scaleMode == egret.StageScaleMode.NO_SCALE) {
                result.stageHeight *= dpr;
                result.stageWidth *= dpr;
                return result;
            }
        }
    }
}
module junyou {
    /**
     * ## 主体UI的容器  
     * 1. 当屏幕长或者宽任意一边小于`基准尺寸(basis)`时  
     *      * 首先根据基准尺寸的窄边得到缩放比
     *      * 然后将容器按此缩放比进行缩放
     *      * 根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     * 2. 如果屏幕的长或者宽都大于或者等于`基准尺寸(basis)`时  
     *      * 容器内UI不做缩放
     *      * 直接根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     * 
     * @export
     * @class MainUIContainer
     * @extends {egret.Sprite}
     */
    export class MainUIContainer extends LayoutContainer {

        onResize() {
            let host = this._host;
            let stage = host.stage || egret.sys.$TempStage;
            let basis = this._basis;
            let sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            let dw = sw, dh = sh, lw = sw, lh = sh;
            let scale = 1;
            if (dpr != 1 || sw < bw * dpr || sh < bh * dpr) { //屏幕宽高，任意一边小于基准宽高
                let result = this.getFixedNarrow(sw, sh, bw, bh);
                dh = result.dh;
                dw = result.dw;
                lw = result.lw;
                lh = result.lh;
                scale = result.scale;
            }
            this._lw = lw;
            this._lh = lh;
            host.x = 0;
            host.y = 0;
            host.scaleY = host.scaleX = scale;
            this.layoutAll();
        }

        public add(d: egret.DisplayObject, type: LayoutType, offsetRect: egret.Rectangle) {
            let raw = d.suiRawRect;
            let result = Layout.getLayoutPos(raw.width, raw.height, offsetRect.width, offsetRect.height, type);
            let dx = raw.x - offsetRect.x;
            let dy = raw.y - offsetRect.y;
            let oh = dx - result.x;
            let ov = dy - result.y;
            this.addLayout(d, type, raw, oh, ov);
        }

    }
}