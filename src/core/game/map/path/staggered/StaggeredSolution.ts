namespace jy {
    export interface StaggeredMapInfo extends MapInfo {

        pathdata: Uint8Array;

        /**
         * 路径数据最大支持的位数
         */
        pdatabit: number;

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

        /**
         * 算格子用多边形
         */
        polygon: Polygon;

        /**
         * 格子高度的一半
         */
        hh: number;
        /**
         * 格子宽度的一半
         */
        hw: number;
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
                    g.moveTo(hw, 0);
                    g.lineTo(gridWidth, hh);
                    g.lineTo(hw, gridHeight);
                    g.lineTo(0, hh);
                    g.lineTo(hw, 0);
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


        $gm.regPathDraw(MapPathType.Staggered,
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
                    const { gridWidth, gridHeight } = map;
                    for (let i = x / gridWidth >> 0, len = i + w / gridWidth + 1, jstart = (y * 2 / gridHeight >> 0) - 1, jlen = jstart + h * 2 / gridHeight + 1; i < len; i++) {
                        for (let j = jstart; j < jlen; j++) {
                            let level = map.getWalk(i, j);
                            let tex = getTexture(gridWidth, gridHeight, level);
                            let s = gp[k];
                            if (!s) {
                                gp[k] = s = new egret.Bitmap();
                            }
                            s.texture = tex;
                            this.addChild(s);
                            k++;
                            let pt = map.map2Screen(i, j);
                            s.x = pt.x;
                            s.y = pt.y;
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

    const posesOdd = [
        /* ↓  */[0, 2],
        /* ↘ */[0, 1],
        /* →  */[1, 0],
        /* ↗ */[1, -1],
        /* ↑  */[0, -2],
        /* ↖ */[0, -1],
        /* ←  */[-1, 0],
        /* ↙ */[0, 1]
    ]

    const posesEven = [
        /* ↓  */[0, 2],
        /* ↘ */[0, 1],
        /* →  */[1, 0],
        /* ↗ */[0, -1],
        /* ↑  */[0, -2],
        /* ↖ */[-1, -1],
        /* ←  */[-1, 0],
        /* ↙ */[-1, 1]
    ]

    regMapPosSolver(MapPathType.Staggered, {
        init(map) {
            let polygon = new Polygon();
            map.polygon = polygon;
            const { gridWidth, gridHeight } = map;
            let hh = gridHeight >> 1;
            let hw = gridWidth >> 1;
            map.hh = hh;
            map.hw = hw;
            polygon.points = [{ x: hw, y: 0 }, { x: gridWidth, y: hh }, { x: hw, y: gridHeight }, { x: 0, y: hh }]
        },
        map2Screen(i, j) {
            const { gridWidth, hw, hh } = this;
            let x = i * gridWidth;
            if (j & 1) {
                x += hw;
            }
            let y = j * hh;

            return {
                x,
                y,
            }
        },
        screen2Map(x, y) {
            const { gridHeight, gridWidth, hw, hh } = this;
            let i = x / gridWidth >> 0;
            let j = y / gridHeight >> 0;

            //得到格子所在区域
            let dx = x - i * gridWidth;
            let dy = y - j * gridHeight;
            j *= 2;
            if (!this.polygon.containPos(dx, dy)) {//不在格子内
                //检查坐标所在区域
                //   左上  右上   
                //   左下  右下
                if (dx < hw) {
                    i--;
                }
                if (dy < hh) {//左上
                    j--;
                } else {//左下
                    j++;
                }
            }

            return { x: i, y: j };
        },
        /**
         * 根据当前坐标相邻的指定朝向对应的坐标
         * @param x 
         * @param y 
         * @param face8 0 ↓  
         *              1 ↘  
         *              2 →  
         *              3 ↗  
         *              4 ↑  
         *              5 ↖  
         *              6 ←  
         *              7 ↙
         */
        getFacePos(x: number, y: number, face8: number) {
            const poses = y & 1 ? posesOdd : posesEven
            const [ox, oy] = poses[face8];
            return {
                x: x + ox,
                y: y + oy
            }
        }
    } as MapPosSolver<StaggeredMapInfo>)
}