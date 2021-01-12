interface $gmType {
    /**
     * 显示/关闭地图格子显示
     * 
     * 
     * @memberOf $gmType
     */
    toggleMapGrid();
    $showMapGrid: boolean;

    regPathDraw(type: jy.MapPathType, handler: jy.drawPath);

    pathSolution: { [type in jy.MapPathType]: jy.drawPath };
}

if (DEBUG) {
    var $gm = $gm || <$gmType>{};
    $gm.toggleMapGrid = function () {
        this.$showMapGrid = !this.$showMapGrid;
    }
    $gm.pathSolution = {} as { [type in jy.MapPathType]: jy.drawPath };

    $gm.regPathDraw = function (type: jy.MapPathType, handler: jy.drawPath) {
        $gm.pathSolution[type] = handler;
    }
}
namespace jy {
    function checkRect(map: MapInfo, rect: egret.Rectangle, preload: number, forEach: { (uri: string, col: number, row: number, map: MapInfo) }, checker?: { (sc: number, sr: number, ec: number, er: number): boolean }, caller?, ox = 0, oy = 0) {
        //检查地图，进行加载区块
        let x = rect.x + ox;
        let y = rect.y + oy;
        let w = rect.width;
        let h = rect.height;

        let pW = map.pWidth;
        let pH = map.pHeight;
        let sc = x / pW | 0;
        let sr = y / pH | 0;
        let ec = (x + w) / pW | 0;
        let er = (y + h) / pH | 0;
        sc = Math.max(sc - preload, 0);
        sr = Math.max(sr - preload, 0);
        ec = Math.min(ec + preload, map.maxPicX);
        er = Math.min(er + preload, map.maxPicY);

        if (checker && !checker.call(caller, sc, sr, ec, er)) {
            return;
        }

        for (let r = sr; r <= er; r++) {
            for (let c = sc; c <= ec; c++) {
                let uri = map.getMapUri(c, r);
                forEach.call(caller, uri, c, r, map);
            }
        }
        return true;
    }



    /**
    * MapRender
    * 用于处理地图平铺的渲染
    */
    export class TileMapLayer extends BaseLayer {
        miniUri: string;

        /**
         * 扩展预加载的图块数量  
         * 
         */
        preload = 0;

        static checkRect?(map: MapInfo, rect: egret.Rectangle, preload: number, forEach: { (uri: string, col: number, row: number, map: MapInfo) }, checker?: { (sc: number, sr: number, ec: number, er: number): boolean });
        /**
         * @private
         */
        private _currentMap: MapInfo;
        public get currentMap(): MapInfo {
            return this._currentMap;
        }
        /**
         * 显示/关闭地图格子显示
         *
         *
         * @memberOf $gmType
         */
        public set currentMap(value: MapInfo) {
            if (value != this._currentMap) {
                this._currentMap = value;
                if (DEBUG && value) {
                    this.drawGrid = $gm.pathSolution[~~value.pathType];
                }
            }
        }

        /**
         * mini的纹理
         */
        mini: egret.Texture;

        miniTexDict: { [key: number]: egret.Texture }

        /**
         * 
         * 显示中的地图
         * @type {TileMap[]}
         */
        protected _showing: TileMap[] = [];
        protected drawGrid?: { (x: number, y: number, w: number, h: number, cM: MapInfo): void };



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

        protected _idx: number;

        protected addMap(uri: string, c: number, r: number, map: MapInfo) {
            let { pWidth: pW, pHeight: pH, noPic, maxPicX } = map;
            if (!noPic || getMapBit(c, r, maxPicX + 1, noPic) == 0) {//检查是否需要放置底图
                let tm = ResManager.get(uri, this.noRes, this, uri, c, r, pW, pH);
                // 舞台上的标记为静态
                tm.isStatic = true;
                let idx = this._idx;
                this.$doAddChild(tm, idx, false);
                this._showing[idx++] = tm;
                this._idx = idx;
            }
        }

        reset() {
            this.lsc = this.lsr = this.lec = this.ler = undefined;
        }

        protected check(sc: number, sr: number, ec: number, er: number) {
            if (sc == this.lsc && sr == this.lsr && ec == this.lec && er == this.ler) {//要加载的块没有发生任何变更
                return;
            }
            this.lsc = sc;
            this.lsr = sr;
            this.lec = ec;
            this.ler = er;
            // 先将正在显示的全部标记为未使用
            // 换地图也使用此方法处理
            let now = Global.now;
            let showing = this._showing;
            let left = showing.length;
            while (left > 0) {
                let m = showing[--left];
                m.isStatic = false;
                m.lastUseTime = now;
                this.$doRemoveChild(left, false);
            }
            return true;
        }

        public setRect(rect: egret.Rectangle, ox = 0, oy = 0) {
            let cM = this._currentMap;
            if (!cM) {
                return;
            }
            if (DEBUG) {
                if (this.drawGrid) {
                    this.drawGrid(rect.x + ox, rect.y + oy, rect.width, rect.height, cM);
                }
            }
            this._idx = 0;
            if (checkRect(cM, rect, this.preload, this.addMap, this.check, this, ox, oy)) {
                this._showing.length = this._idx;
            }
        }

        protected noRes(uri: string, c: number, r: number, pW: number, pH: number) {
            let tmp = new TileMap();
            //检查是否有小地图，如果有，先设置一份texture
            let { mini, miniTexDict } = this;
            let x = c * pW;
            let y = r * pH;
            if (mini) {
                let texKey = getPosHash2(c, r);
                let tex = miniTexDict[texKey];
                if (!tex) {
                    let { textureWidth, textureHeight } = mini;
                    let { width, height } = this._currentMap;
                    miniTexDict[texKey] = tex = new egret.Texture();
                    let dw = textureWidth / width;
                    let dh = textureHeight / height;
                    let sw = pW * dw;
                    let sh = pH * dh;
                    tex.$initData(x * dw, y * dh, sw, sh, 0, 0, sw, sh, sw, sh);
                    tex.$bitmapData = mini.bitmapData;
                }
                tmp.texture = tex;
                tmp.width = pW;
                tmp.height = pH;
            }
            tmp.reset(c, r, uri);
            tmp.x = x;
            tmp.y = y;
            tmp.load();
            return tmp;
        }

        /**
         * 设置小地图
         * @param uri 
         * @param directUseUri 是否直接使用uri作为miniMap的Uri
         */
        setMini(uri: string, directUseUri?: boolean) {
            let miniUri = directUseUri ? uri : uri && this._currentMap.getImgUri(uri);
            let old = this.miniUri;
            if (old != miniUri) {
                if (old) {
                    Res.cancel(old);
                }
                this.miniUri = miniUri;
                this.mini = undefined;
                this.miniTexDict = {};
                if (miniUri) {
                    Res.load(miniUri, ConfigUtils.getResUrl(miniUri), CallbackInfo.get(this.miniLoad, this), Res.ResQueueID.Highway);
                }
            }
        }

        miniLoad(item: Res.ResItem) {
            let { data, uri } = item;
            if (uri == this.miniUri) {
                this.mini = data;
            }
        }


        removeChildren() {
            //重置显示的地图序列
            this._showing.length = 0;
            super.removeChildren();
        }
    }

    export const enum MapDataBitCount {
        Bit1 = 1,
        Bit2 = 2,
        Bit4 = 4,
        Bit8 = 8
    }

    function getMapBit(x: number, y: number, columns: number, data: Uint8Array) {
        let position = y * columns + x;
        let byteCount = position >> 3;
        let bitCount = position - (byteCount << 3);
        return (data[byteCount] >> bitCount) & 1;
    }


    TileMapLayer.checkRect = checkRect;
    /**
    * TileMap
    */
    export class TileMap extends egret.Bitmap implements IResource {
        /**
         * 地图块的列
         */
        col: number;
        /**
         * 地图块的行
         */
        row: number;

        /**
         * 资源唯一标识
         */
        uri: string;

        /**
         * 
         * 是否为静态资源
         * @type {boolean}
         */
        isStatic: boolean;

        lastUseTime: number;

        /**
         * 
         * 资源路径
         * @type {string}
         */
        url: string;

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
            Res.load(this.uri, this.url, CallbackInfo.get(this.loadComplete, this));
        }

        /**
         * 资源加载完成
         */
        loadComplete(item: Res.ResItem) {
            let { data, uri } = item as { data: egret.Texture, uri: string };
            if (!data) {//没有data说明加载资源失败
                return;
            }
            if (uri == this.uri) {
                this.texture = data;
            }
        }

        dispose() {
            let texture = this.texture;
            if (texture) {
                this.texture = undefined;
                texture.dispose();
            }
        }
    }
}