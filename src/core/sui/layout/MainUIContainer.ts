namespace jy {
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
        resizeFlag = true;
        onResize() {
            let host = this._host;
            let stage = host.stage || egret.sys.$TempStage;
            let basis = this._basis;
            let sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            let lw = sw, lh = sh;
            let scale = 1;
            if (this.resizeFlag || (sw < bw || sh < bh)) { //屏幕宽高，任意一边小于基准宽高
                let result = getFixedLayout(sw, sh, bw, bh);
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
            dispatch(EventConst.MainUIContainerLayoutComplete, this)
        }

        public add(d: egret.DisplayObject, type: LayoutType, offsetRect?: egret.Rectangle, hide?: boolean) {
            let raw = d.suiRawRect;
            offsetRect = offsetRect || this._host.suiRawRect;
            let result = Layout.getLayoutPos(raw.width, raw.height, offsetRect.width, offsetRect.height, type);
            let dx = raw.x - offsetRect.x;
            let dy = raw.y - offsetRect.y;
            let left = dx - result.x;
            let top = dy - result.y;
            let right = offsetRect.x + offsetRect.width - raw.x - raw.width;
            let bottom = offsetRect.y + offsetRect.height - raw.y - raw.height;

            this.addDis(d, { size: raw, type, left, top, right, bottom, outerV: false, outerH: false }, hide)
        }

        protected binLayout(bin: LayoutBin) {
            if (bin.type == LayoutType.FullScreen) {
                let { dis, top, left, bottom, right } = bin;
                let host = this._host;
                let scale = host.scaleX;
                let stage = host.stage || egret.sys.$TempStage;
                let rect = dis.suiRawRect;
                let sw = stage.stageWidth / scale;
                let sh = stage.stageHeight / scale;
                if (left != undefined) {
                    dis.x = left;
                    if (right != undefined) {
                        dis.width = sw - left - right;
                    }
                } else if (right != undefined) {
                    dis.x = sw - rect.width - right;
                }
                if (top != undefined) {
                    dis.y = top;
                    if (bottom != undefined) {
                        dis.height = sh - top - bottom;
                    }
                } else if (bottom != undefined) {
                    dis.y = sh - rect.height - bottom;
                }
            } else {
                super.binLayout(bin);
            }
        }

    }
}