module egret {
    export interface DisplayObject {
        $layoutHost: junyou.LayoutContainer;
    }
}
module junyou {
    import EE = egret.Event;
    export abstract class LayoutContainer {
        public static readonly MIN = Object.freeze({ width: 0, height: 0 });

        protected $layoutBins = new ArraySet<LayoutBin>();

        protected _lw: number;
        protected _lh: number;

        protected _basis: Size;
        protected _host: egret.Sprite;
        constructor(basis: Size, host?: egret.Sprite) {
            host = host || new egret.Sprite();
            this._host = host;
            this._basis = basis;
            on(EventConst.ReLayout, this.onResize, this);
            host.on(EE.REMOVED_FROM_STAGE, this.offStage, this);
            host.on(EE.ADDED_TO_STAGE, this.onStage, this);
            if (host.stage) {
                this.onStage();
            }
        }

        /**
         * 重置尺寸
         * 
         * @param {Size} basis 
         * 
         * @memberOf LayoutContainer
         */
        public resetBasis(basis: Size) {
            this._basis = basis;
        }

        protected getFixedNarrow(sw: number, sh: number, bw: number, bh: number, ySmall?: boolean) {
            let dw = sw, dh = sh;
            let scaleX = sw / bw;
            let scaleY = sh / bh;
            let lw = bw;
            let lh = bh;
            if (scaleX < scaleY == !ySmall) {
                dh = sw * bh / bw;
                lh = bh * sh / dh;
            } else {
                dw = sh * bw / bh;
                lw = bw * sw / dw;
            }
            let scale = dw / bw;
            return { dw, dh, scale, lw, lh };
        }

        protected onStage() {
            this._host.stage.on(EE.RESIZE, this.onResize, this);
            this.onResize();
        }
        protected offStage() {
            egret.sys.$TempStage.off(EE.RESIZE, this.onResize, this);
        }

        abstract onResize();

        public get view() {
            return this._host;
        }

        public addLayout(dis: egret.DisplayObject, type = LayoutType.TOP_LEFT, size?: { width: number, height: number }, hoffset = 0, voffset = 0, innerV = true, innerH = true) {
            let list = this.$layoutBins;
            size = size || dis;
            let key = dis.hashCode;
            if (list.get(key)) {
                return;
            }
            this._host.addChild(dis);
            let bin = { dis, type, hoffset, voffset, innerV, innerH, size } as LayoutBin;
            list.set(key, bin);
            let stage = dis.stage;
            if (stage) {
                this.binLayout(bin);
            } else {
                dis.on(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            }
        }
        protected onAdded(e: egret.Event) {
            let dis = e.currentTarget as egret.DisplayObject;
            let host = dis.$layoutHost;
            if (host) {
                let set = host.$layoutBins;
                if (set) {
                    let bin = set.get(dis.$hashCode);
                    if (bin) {
                        this.binLayout(bin);
                    }
                }
            }
        }
        protected binLayout(bin: LayoutBin) {
            const { dis, type, hoffset, voffset, innerV, innerH, size } = bin;
            let pt = Temp.SharedPoint1;
            Layout.getLayoutPos(size.width, size.height, this._lw, this._lh, type, pt, hoffset, voffset, innerV, innerH);
            dis.x = pt.x;
            dis.y = pt.y;
        }

        protected $doLayout() {
            Global.callLater(this.layoutAll, 0, this);

        }
        protected layoutAll() {
            let set = this.$layoutBins;
            if (set) {
                let list = set.rawList;
                for (let i = 0, len = list.length; i < len;) {
                    this.binLayout(list[i++]);
                }
            }
        }
    }

    export interface LayoutBin {
        dis: egret.DisplayObject;
        type: LayoutType;

        hoffset: number;

        voffset: number;

        offsetType?: number;

        innerV: boolean;
        innerH: boolean;
        size: { width: number, height: number }
    }
}