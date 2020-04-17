namespace jy {

    export interface GridMapInfo extends MapInfo {
        /**
         * 路径点数据
         */
        pathdata: Uint8Array;
        /**
         * 透明区域点数据
         */
        adata?: Uint8Array;
        /**
         * 格子宽度
         */
        gridWidth: number;

        /**
         * 格子高度
         */
        gridHeight: number;

        /**
         * 地图格子列数
         */
        columns: number;

        /**
         * 地图格子行数
         */
        rows: number;
    }

    interface GridPathDraw {
        /**
         * Debug专用
         */
        debugGridPanes?: egret.Bitmap[];

    }

    if (DEBUG) {

        const sheets = getDynamicTexSheet();

        var getTexture = function (gridWidth: number, gridHeight: number, level: number) {
            let showLevel = level > 1;
            let color = level ? 0xcccc : 0xcc3333;
            return $getTexture(gridWidth, gridHeight, color, level, showLevel);

            function $getTexture(gridWidth: number, gridHeight: number, color: number, level: number, showLevel?: boolean) {
                let key = gridWidth + "_" + gridHeight + "_" + color + "_" + level + "_" + showLevel;
                let tex = sheets.get(key);
                if (!tex) {
                    let hw = gridWidth >> 1;
                    let hh = gridHeight >> 1;
                    let canvas = document.createElement("canvas");
                    canvas.width = gridWidth;
                    canvas.height = gridHeight;
                    let g = canvas.getContext("2d");
                    let c = ColorUtil.getColorString(color);
                    g.strokeStyle = c;
                    g.fillStyle = c;
                    g.beginPath();
                    g.moveTo(0, 0);
                    g.lineTo(gridWidth, 0);
                    g.lineTo(gridWidth, gridHeight);
                    g.lineTo(0, gridHeight);
                    g.lineTo(0, 0);
                    g.closePath();
                    g.stroke();
                    g.globalAlpha = 0.1;
                    g.fill();
                    if (showLevel) {
                        g.globalAlpha = 1;
                        g.fillStyle = "#ffffff";
                        g.font = `normal normal 10px arial`;
                        g.textBaseline = "middle";
                        let l = level + "";
                        let textHalfWidth = g.measureText(l).width >> 1;
                        let x = hw - textHalfWidth;
                        g.strokeStyle = "#000000";
                        g.strokeText(l, x, hh, gridWidth);
                        g.fillText(l, x, hh, gridWidth);
                    }
                    let tex = new egret.Texture();
                    tex.bitmapData = new egret.BitmapData(canvas);
                    sheets.bindOrUpdate(key, tex);
                }
                return tex;
            }
        }

        $gm.regPathDraw(MapPathType.Grid,
            function (this: TileMapLayer & GridPathDraw, x: number, y: number, w: number, h: number, map: GridMapInfo) {
                let gp = this.debugGridPanes;
                if (!gp) {
                    this.debugGridPanes = gp = [];
                }
                let k = 0;
                if ($gm.$showMapGrid) {
                    if (!map.map2Screen) {
                        bindMapPos(map);
                    }
                    const { gridWidth, gridHeight, columns, rows } = map;
                    for (let i = x / gridWidth >> 0, len = Math.min(i + w / gridWidth + 1, columns), jstart = y / gridHeight >> 0, jlen = Math.min(jstart + h / gridHeight + 1, rows); i < len; i++) {
                        for (let j = jstart; j < jlen; j++) {
                            let level = map.getWalk(i, j);
                            let tex = getTexture(gridWidth, gridHeight, level);
                            let s = gp[k];
                            if (!s) {
                                gp[k] = s = new egret.Bitmap();
                            }
                            s.texture = tex;
                            let pt = map.map2Screen(i, j);
                            s.x = pt.x;
                            s.y = pt.y;
                            this.addChild(s);
                            k++;
                        }
                    }
                }
                for (let i = k; i < gp.length; i++) {
                    let bmp = gp[i];
                    bmp.texture = null;
                    removeDisplay(bmp);
                }
                gp.length = k;

            }
        );
    }

    const poses = [
        /*↓*/[0, 1],
        /*↘*/[1, 1],
        /*→*/[1, 0],
        /*↗*/[1, -1],
        /*↑*/[0, -1],
        /*↖*/[-1, -1],
        /*←*/[-1, 0],
        /*↙*/[-1, 1]
    ]

    regMapPosSolver(MapPathType.Grid, {
        init(map) {
            if (DEBUG) {
                map.DEBUGgetGridTexture = function (level) {
                    return getTexture(map.gridWidth, map.gridHeight, level);
                }
            }
        },
        map2Screen(x, y, isCenter?: boolean) {
            const { gridWidth, gridHeight } = this;
            let hw = gridWidth >> 1;
            let hh = gridHeight >> 1;
            x = x * gridWidth;
            y = y * gridHeight;
            if (isCenter) {
                x += hw;
                y += hh;
            }
            return {
                x,
                y,
            }
        },
        screen2Map(x, y) {
            return {
                x: Math.round(x / this.gridWidth),
                y: Math.round(y / this.gridHeight)
            }
        },
        getFacePos(x: number, y: number, face8: number) {
            let pos = poses[face8];
            return {
                x: x + pos[0],
                y: y + pos[1]
            }
        }
    } as MapPosSolver<GridMapInfo>)

}