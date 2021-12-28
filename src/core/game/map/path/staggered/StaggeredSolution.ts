namespace jy {
    export interface StaggeredMapInfo extends Gridable, MapInfo {
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

        const colors = [
            0xcc3333, 0x00cccc,
            0xCC6666, 0xFFFF33, 0x66FFCC, 0x3300CC, 0x33FFFF,
            0x990000, 0x660099, 0xFF33FF, 0x33FF00, 0x66CC33,
            0x0033CC, 0x666600, 0x6666CC, 0xCC99FF, 0x0099FF,
            0x339999, 0x003300, 0x333399, 0x660066, 0x00FF99,
            0x339966, 0xCC99CC, 0xCCCC66, 0x990066, 0x9900FF,
            0x669900, 0x99FFFF, 0xFFCC66, 0x00FF33,
            0xCC0000, 0x00CC33, 0x99FF99, 0x666633, 0x6633CC,
            0xCC00CC, 0x003333, 0x33CC66, 0x993300, 0x9999FF,
            0xFF0066, 0x3333FF, 0xCC9900, 0x009966, 0xFF00CC,
            0xCCFF66, 0x99FF33, 0x003333, 0x990099, 0xFF00FF,
            0xFFCC99, 0x990033, 0x333333, 0xCC6699, 0x3333CC,
            0xFFCCCC, 0x009933, 0x993333, 0x66CC00, 0x330066,
            0x000033, 0x0066CC, 0x000033, 0x3300FF, 0xFF9933,
            0x6633FF, 0x006699, 0x666699, 0xCC0099,
            0x00CCFF, 0x33FF33, 0xFFCC33, 0xCC0033, 0xFFCC00,
            0x33FF66, 0x336633, 0x00CC99, 0x006699, 0x000066,
            0x336666, 0xFF3300, 0x3366FF, 0x9999CC, 0x00FFFF,
            0xFF6633, 0xCC66FF, 0x660000, 0x339900, 0xFFFFCC,
            0x336699, 0x999900, 0x996699, 0xFFCCFF, 0x66CCCC,
            0x33CC00, 0x9966CC, 0x00CC66, 0x00FFCC, 0x003399,
            0xCC66CC, 0x663333, 0x336600, 0x669966, 0x333333,
            0x6600CC, 0x66FF00, 0x00CC00, 0x6699FF, 0xFF9999,
            0xFF9900, 0x3399CC, 0x003399, 0x330066, 0x33FF99,
            0x33CCCC, 0x0033CC, 0x330033, 0x0000CC, 0x330099,
            0x663366, 0x33FF33, 0x3399FF, 0x99CC00, 0x660000,
            0x336633, 0x66FF99, 0x336666, 0x00FFCC, 0x009900,
            0x00CC99, 0x0000CC, 0xFF99FF, 0x999966, 0x0066FF,
            0x000099, 0xFF0033, 0x66FF00, 0xCCFF99, 0x6699FF,
            0x336699, 0x00FFFF, 0xCC33FF, 0x006699, 0x330099,
            0x333300, 0xFF6600, 0x99CC66, 0x66FFFF, 0x0000CC,
            0x33FF66, 0xCCFFFF, 0x669999, 0x9933FF, 0x66FF99,
            0x3300FF, 0x66CC99, 0x66FFFF, 0x333300, 0x3399FF,
            0x009999, 0xFF0000, 0x003399, 0xCC9933, 0x0066CC,
            0x000099, 0x99FFCC, 0x66CC66, 0x996666, 0x00FFCC,
            0x006666, 0x330099, 0x9900CC, 0xCC33CC, 0x339933,
            0x99FF66, 0x0066FF, 0x009966, 0x999966, 0x9966FF,
            0x6666FF, 0x009933, 0x0000FF, 0x3366FF, 0x99FFCC,
            0x99CCCC, 0x00FF66, 0x009933, 0x00CC66, 0x339900,
            0x99FF66, 0x00FF00, 0x336633, 0x000066, 0xFF0099,
            0x339900, 0xCC6600, 0x99CCFF, 0x00CCFF, 0x33CCFF,
            0xFF66CC, 0x00FFFF, 0x666666, 0xCC6633, 0xFF3333,
            0x3366FF, 0x669999, 0x996666, 0x0033CC,
            0x006600, 0x003300, 0xFF6666, 0x33FFCC, 0xFF3333
        ]

        var getTexture = function (gridWidth: number, gridHeight: number, level: number) {
            let showLevel = level > MapConst.MapData_Walkable;
            let color = colors[level];
            if (color === undefined) {
                color = Math.random() * 0xFFFFFF;
            }
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
                    g.globalAlpha = 0.3;
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

                    tex = new egret.Texture();
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
                    const { gridWidth, gridHeight, columns, rows } = map;
                    for (let i = x / gridWidth >> 0, len = Math.min(i + w / gridWidth + 1, columns), jstart = (y * 2 / gridHeight >> 0) - 1, jlen = Math.min(jstart + h * 2 / gridHeight + 2, rows); i < len; i++) {
                        for (let j = jstart; j < jlen; j++) {
                            let level = map.getWalk(i, j);
                            if (level !== MapConst.MapData_Walkable) {//可走的格子不再渲染
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
        /* ↘ */[1, 1],
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
            if (DEBUG) {
                map.DEBUGgetGridTexture = function (level) {
                    return getTexture(map.gridWidth, map.gridHeight, level);
                }
            }
            let polygon = new Polygon();
            map.polygon = polygon;
            const { gridWidth, gridHeight } = map;
            let hh = gridHeight >> 1;
            let hw = gridWidth >> 1;
            map.hh = hh;
            map.hw = hw;
            polygon.points = [{ x: hw, y: 0 }, { x: gridWidth, y: hh }, { x: hw, y: gridHeight }, { x: 0, y: hh }]
        },
        map2Screen(i, j, isCenter?: boolean) {
            const { gridWidth, hw, hh } = this;
            let x = i * gridWidth;
            if (j & 1) {
                x += hw;
            }
            let y = j * hh;
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