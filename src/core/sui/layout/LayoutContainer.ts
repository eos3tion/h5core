module egret {
    export interface DisplayObject {
        $layoutHost: junyou.LayoutContainer;
    }
}
module junyou {
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
            host.on(EgretEvent.REMOVED_FROM_STAGE, this.offStage, this);
            host.on(EgretEvent.ADDED_TO_STAGE, this.onStage, this);
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

        protected onStage() {
            this._host.stage.on(EgretEvent.RESIZE, this.onResize, this);
            this.onResize();
        }
        protected offStage() {
            egret.sys.$TempStage.off(EgretEvent.RESIZE, this.onResize, this);
        }

        abstract onResize();

        public get view() {
            return this._host;
        }

        /**
         * 移除视图
         * 
         * @param {egret.DisplayObject} dis 
         * @returns 
         */
        public remove(dis: egret.DisplayObject) {
            return this.$layoutBins.delete(dis.hashCode);
        }

        public addLayout(dis: egret.DisplayObject, type = LayoutType.TOP_LEFT, size?: Size, hoffset?, voffset?, outerV?: boolean, outerH?: boolean, hide?: boolean) {
            let list = this.$layoutBins;
            size = size || dis;
            let key = dis.hashCode;
            if (list.get(key)) {
                return;
            }
            let bin = { dis, type, hoffset, voffset, outerV, outerH, size } as LayoutBin;
            list.set(key, bin);
            if (hide) {
                removeDisplay(dis);
            } else {
                this._host.addChild(dis);
            }
            let stage = dis.stage;
            if (stage) {
                this.binLayout(bin);
            }
            //不管在不在舞台上，都应该监听
            dis.on(EgretEvent.ADDED_TO_STAGE, this.onAdded, this);
        }
        protected onAdded(e: egret.Event) {
            let dis = e.currentTarget as egret.DisplayObject;
            let host = dis.$layoutHost;
            if (host) {
                let set = host.$layoutBins;
                if (set) {
                    let bin = set.get(dis.hashCode);
                    if (bin) {
                        this.binLayout(bin);
                    }
                }
            }
        }
        protected binLayout(bin: LayoutBin) {
            const { dis, type, hoffset, voffset, outerV, outerH, size } = bin;
            let pt = Temp.SharedPoint1;
            Layout.getLayoutPos(size.width, size.height, this._lw, this._lh, type, pt, hoffset, voffset, outerV, outerH);
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

        hoffset?: number;

        voffset?: number;

        offsetType?: number;

        outerV?: boolean;
        outerH?: boolean;
        size: Size;
    }

    /**
     * @param sw 舞台宽度
     * @param sh 舞台高度
     * @param bw 要调整的可视对象宽度
     * @param bh 要调整的可视对象高度
     * @param {boolean} [isWide=false] fixedNarrow 还是 fixedWide，默认按fixedNarrow布局
     */
    export function getFixedLayout(sw: number, sh: number, bw: number, bh: number, isWide?: boolean) {
        let dw = sw, dh = sh;
        let scaleX = sw / bw;
        let scaleY = sh / bh;
        let lw = bw;
        let lh = bh;
        if (scaleX < scaleY == !isWide) {
            dh = sw * bh / bw;
            lh = bh * sh / dh;
        } else {
            dw = sh * bw / bh;
            lw = bw * sw / dw;
        }
        let scale = dw / bw;
        return { dw, dh, scale, lw, lh };
    }
}