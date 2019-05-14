namespace jy {
    export class NoScaleContainer extends LayoutContainer {
        scale: number;

        onResize() {
            let host = this._host;
            let stage = host.stage || egret.sys.$TempStage;
            let basis = this._basis;
            let sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            let lw = sw, lh = sh;
            let scale = 1;
            if (this.scale == undefined) {
                if (sw < bw || sh < bh) { //屏幕宽高，任意一边小于基准宽高
                    let result = getFixedLayout(sw, sh, bw, bh);
                    lw = result.lw;
                    lh = result.lh;
                    scale = result.scale;
                    host.scaleY = host.scaleX = scale;
                }
            }
            this._lw = lw;
            this._lh = lh;
            this.layoutAll();
            if (this.$layoutBins.rawList.length > 0 && this.scale == undefined) {
                this.scale = scale;
            }
        }

        public add(d: egret.DisplayObject, type: LayoutType, offsetRect: egret.Rectangle, hide?: boolean) {
            let raw = d.suiRawRect;
            let result = Layout.getLayoutPos(raw.width, raw.height, offsetRect.width, offsetRect.height, type);
            let dx = raw.x - offsetRect.x;
            let dy = raw.y - offsetRect.y;
            let oh = dx - result.x;
            let ov = dy - result.y;
            this.addLayout(d, type, raw, oh, ov, false, false, hide);
        }

        protected binLayout(bin: LayoutBin) {
            if (bin.type == LayoutType.FullScreen) {
                let { dis } = bin;
                let host = this._host;
                let scale = host.scaleX;
                dis.x = bin.hoffset * scale;
                dis.y = bin.voffset * scale;
                let stage = host.stage || egret.sys.$TempStage;
                dis.width = stage.stageWidth / scale;
                dis.height = stage.stageHeight / scale;
            } else {
                if (this.scale != undefined) {
                    const { dis, type, voffset, outerV, size } = bin;
                    const { _lh, scale } = this;
                    let { height } = size;
                    let vertical = type & LayoutType.VERTICAL_MASK;
                    let y = 0;
                    switch (vertical) {
                        case LayoutType.TOP:
                            if (outerV) {
                                y = -height * scale;
                            }
                            break;
                        case LayoutType.MIDDLE: // 不支持非innerV
                            y = (_lh - height * scale) >> 1;
                            break;
                        case LayoutType.BOTTOM:
                            if (outerV) {
                                y = height* scale;
                            } else {
                                y = _lh - height * scale;
                            }
                            break;
                    }
                    dis.y = Math.round(y/scale + voffset);
                } else {
                    super.binLayout(bin);
                }
            }
        }
    }
}