namespace jy {

    export class SpecLayContainer extends LayoutContainer {
        private scale: number = 1;

        private flag: boolean;
        onResize() {
            let host = this._host;
            let stage = host.stage || egret.sys.$TempStage;
            let basis = this._basis;
            let sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            let dw = sw, dh = sh, lw = sw, lh = sh;
            let scale = 1;
            if (sw < bw || sh < bh) { //屏幕宽高，任意一边小于基准宽高
                let result = getFixedLayout(sw, sh, bw, bh);
                dh = result.dh;
                dw = result.dw;
                lw = result.lw;
                lh = result.lh;
                scale = result.scale;
            }
            if (this.flag) {
                this.flag = false;
            }
            this.scale = scale;
            this._lw = lw;
            this._lh = lh;
            host.x = 0;
            host.y = 0;
            host.scaleY = host.scaleX = scale;
            this.layoutAll();
        }

        /**
         * 特殊resize事件调用
         * 需添加相应监听
         */
        onSpeResize() {
            let host = this._host;
            let stage = host.stage || egret.sys.$TempStage;
            let basis = this._basis;
            let sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            let dw = sw, dh = sh, lw = sw, lh = sh;

            let scale = 1;
            if (sw < bw || sh < bh) { //屏幕宽高，任意一边小于基准宽高
                let result = getFixedLayout(sw, sh, bw, bh);
                dh = result.dh;
                dw = result.dw;
                lw = result.lw;
                lh = result.lh;
                if (!this.flag) {
                    this.scale = result.scale;
                    this._lw = lw;
                    this._lh = lh;
                } else {
                    this._lw = sw;
                    this._lh = sh;
                }
                this.flag = true;
            }


            host.x = 0;
            host.y = 0;
            host.scaleY = host.scaleX = this.scale;
            this.simLayOutAll();
        }

        simLayOutAll() {
            let set = this.$layoutBins;
            if (set) {
                let list = set.rawList;
                for (let i = 0, len = list.length; i < len;) {
                    this.simBinLayout(list[i++]);
                }
            }
        }

        getLayoutPos(disWidth: number, disHeight: number, parentWidth: number, parentHeight: number, layout: LayoutType, result?: Point, hoffset = 0, voffset = 0, outerV?: boolean, outerH?: boolean) {
            result = result || {} as Point;
            let vertical = layout & LayoutType.VERTICAL_MASK;
            let horizon = layout & LayoutType.HORIZON_MASK;
            let y = 0, x = 0;
            switch (vertical) {
                case LayoutType.TOP:
                    if (outerV) {
                        y = -disHeight;
                    }
                    break;
                case LayoutType.MIDDLE: // 不支持非innerV
                    y = parentHeight - disHeight >> 1;
                    break;
                case LayoutType.BOTTOM:
                    if (outerV) {
                        y = parentHeight;
                    } else {
                        y = parentHeight - disHeight;
                    }
                    break;
            }
            switch (horizon) {
                case LayoutType.LEFT:
                    if (outerH) {
                        x = -disWidth;
                    }
                    break;
                case LayoutType.CENTER: // 不支持非innerH
                    x = parentWidth - disWidth >> 1;
                    break;
                case LayoutType.RIGHT:
                    if (outerH) {
                        x = parentWidth;
                    } else {
                        x = parentWidth - disWidth;
                    }
                    break;
            }
            result.x = Math.round(x / this.scale + hoffset);
            result.y = Math.round(y / this.scale + voffset);
            return result;
        }

        protected simBinLayout(bin: LayoutBin) {
            const { dis, type, hoffset, voffset, outerV, outerH, size } = bin;
            let pt = Temp.SharedPoint1;
            this.getLayoutPos(size.width * this.scale, size.height * this.scale, this._lw, this._lh, type, pt, hoffset, voffset, outerV, outerH);
            dis.x = pt.x;
            dis.y = pt.y;
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
                super.binLayout(bin);
            }
        }
    }
}