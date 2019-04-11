namespace jy {

    export interface GridMapInfo extends MapInfo {
        pathdata: Uint8Array;
        /**
         * 格子宽度
         */
        gridWidth: number;

        /**
         * 格子高度
         */
        gridHeight: number;
    }

    interface GridPathDraw {
        /**
         * Debug专用
         */
        debugGridPanes?: egret.Bitmap[];

        /**
         * 绘制格子用的纹理
         */
        debugGridTexture?: egret.Texture;

    }

    if (DEBUG) {
        $gm.regPathDraw(MapPathType.Grid,
            function (this: TileMapLayer & GridPathDraw, x: number, y: number, w: number, h: number, map: GridMapInfo) {
                let gp = this.debugGridPanes;
                if (!gp) {
                    this.debugGridPanes = gp = [];
                }
                let k = 0;
                if ($gm.$showMapGrid) {
                    let tex = this.debugGridTexture;
                    const { gridWidth, gridHeight } = map;
                    let hw = gridWidth >> 1;
                    let hh = gridHeight >> 1;
                    if (!tex) {
                        let s = new egret.Shape;
                        let g = s.graphics;
                        g.lineStyle(1, 0xcccc);
                        g.beginFill(0xcccc, 0.5);
                        g.drawRect(0, 0, gridWidth, gridHeight);
                        g.endFill();
                        let tex = new egret.RenderTexture();
                        tex.drawToTexture(s);
                        this.debugGridTexture = tex;
                    }

                    for (let i = x / gridWidth >> 0, len = i + w / gridWidth + 1, jstart = y / gridHeight >> 0, jlen = jstart + h / gridHeight + 1; i < len; i++) {
                        for (let j = jstart; j < jlen; j++) {
                            if (!map.getWalk(i, j)) {
                                let s = gp[k];
                                if (!s) {
                                    gp[k] = s = new egret.Bitmap();
                                }
                                s.texture = tex;
                                this.addChild(s);
                                k++;
                                s.x = i * gridWidth - hw;
                                s.y = j * gridHeight - hh;
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

}