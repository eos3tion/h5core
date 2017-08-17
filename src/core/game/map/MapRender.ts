interface $gmType {
    /**
     * 显示/关闭地图格子显示
     * 
     * 
     * @memberOf $gmType
     */
    toggleMapGrid();
    $showMapGrid: boolean;
}

if (DEBUG) {
    var $gm = $gm || <$gmType>{};
    $gm.toggleMapGrid = function () {
        this.$showMapGrid = !this.$showMapGrid;
    }
}
module junyou {
    /**
    * MapRender
    * 用于处理地图平铺的渲染
    */
    export class TileMapLayer extends GameLayer {

        /**
         * @private
         */
        currentMap: MapInfo;

        /**
         * 
         * 显示中的地图
         * @private
         * @type {TileMap[]}
         */
        private _showing: TileMap[] = [];
        protected drawGrid?: { (x: number, y: number, w: number, h: number, cM: MapInfo): void };

        protected gridPane?: egret.Shape;

        /**
         * 上次渲染的起始 column
         * 
         * @protected
         * @type {number}
         */
        protected lsc: number;

        /**
         * 上次渲染的起始 row
         * 
         * @protected
         * @type {number}
         */
        protected lsr: number;

        /**
         * 上次渲染的结束 column
         * 
         * @protected
         * @type {number}
         */
        protected lec: number;

        /**
         * 上次渲染的结束 row
         * 
         * @protected
         * @type {number}
         */
        protected ler: number;

        public setRect(rect: egret.Rectangle) {
            let cM = this.currentMap;
            if (!cM) {
                return;
            }
            //检查地图，进行加载区块
            let x = rect.x;
            let y = rect.y;
            let w = rect.width;
            let h = rect.height;

            let pW = cM.pWidth;
            let pH = cM.pHeight;
            let sc = x / pW | 0;
            let sr = y / pH | 0;
            let ec = (x + w) / pW | 0;
            let er = (y + h) / pH | 0;
            ec = Math.min(ec, cM.maxPicX);
            er = Math.min(er, cM.maxPicY);
            if (sc == this.lsc && sr == this.lsr && ec == this.lec && er == this.ler) {//要加载的块没有发生任何变更
                return;
            }
            this.lsc = sc;
            this.lsr = sr;
            this.lec = ec;
            this.ler = er;

            // 先将正在显示的全部标记为未使用
            // 换地图也使用此方法处理
            let showing = this._showing;
            let now = Global.now;
            let i = showing.length;
            while (i > 0) {
                let m = showing[--i];
                m.isStatic = false;
                m.lastUseTime = now;
                this.$doRemoveChild(i, false);
            }
            i = 0;
            let get = ResourceManager.get;
            for (let r = sr; r <= er; r++) {
                for (let c = sc; c <= ec; c++) {
                    let uri = cM.getMapUri(c, r);
                    let tm = get(uri, () => {
                        let tmp = new TileMap();
                        tmp.reset(c, r, uri);
                        tmp.x = c * pW;
                        tmp.y = r * pH;
                        tmp.load();
                        return tmp;
                    });
                    // 舞台上的标记为静态
                    tm.isStatic = true;
                    this.$doAddChild(tm, i, false);
                    showing[i++] = tm;
                }
            }
            if (DEBUG) {
                if (this.drawGrid) {
                    this.drawGrid(x, y, w, h, cM);
                }
            }
            showing.length = i;
        }
        constructor(id: number) {
            super(id)
            if (DEBUG) {
                this.drawGrid = (x: number, y: number, w: number, h: number, map: MapInfo) => {
                    let gp = this.gridPane;
                    if ($gm.$showMapGrid) {
                        if (!gp) {
                            this.gridPane = gp = new egret.Shape;
                        }
                        this.addChild(gp);
                        let g = gp.graphics;
                        g.clear();
                        const { gridWidth, gridHeight } = map;
                        let hw = gridWidth >> 1;
                        let hh = gridHeight >> 1;
                        for (let i = x / gridWidth >> 0, len = i + w / gridWidth + 1, jstart = y / gridHeight >> 0, jlen = jstart + h / gridHeight + 1; i < len; i++) {
                            for (let j = jstart; j < jlen; j++) {
                                let c = map.getWalk(i, j) ? 0 : 0xcccc;
                                g.lineStyle(1, 0xcccc, 0.5);
                                g.beginFill(c, 0.5);
                                g.drawRect(i * gridWidth - hw, j * gridHeight - hh, gridWidth, gridHeight);
                                g.endFill();
                            }
                        }
                    } else {
                        if (gp) {
                            gp.graphics.clear();
                            removeDisplay(gp);
                        }
                    }

                }
            }
        }
    }

    /**
    * TileMap
    */
    export class TileMap extends egret.Bitmap implements IResource {
        /**
         * 地图块的列
         */
        private col: number;
        /**
         * 地图块的行
         */
        private row: number;

        /**
         * 资源唯一标识
         */
        private uri: string;

        /**
         * 
         * 是否为静态资源
         * @type {boolean}
         */
        public isStatic: boolean;

        public lastUseTime: number;

        /**
         * 
         * 资源路径
         * @type {string}
         */
        public url: string;

        get resID() {
            return this.uri;
        }


        constructor() {
            super();
        }

        reset(col: number, row: number, uri: string) {
            this.col = col;
            this.row = row;
            this.uri = uri;
            this.url = ConfigUtils.getResUrl(uri);
        }

        load() {
            RES.getResByUrl(this.url, this.loadComplete, this, RES.ResourceItem.TYPE_IMAGE);
        }

        /**
         * 资源加载完成
         */
        loadComplete(res: egret.Texture, key: string) {
            if (key == this.url) {
                this.texture = res;
            }
        }

        dispose() {
            let texture = this.texture;
            if (texture) {
                texture.dispose();
                this.texture = undefined;
            }
        }
    }
}