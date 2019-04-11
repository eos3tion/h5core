namespace jy {
    export interface NavMeshMapInfo extends MapInfo {
        cells: Cell[];
    }

    interface NavMeshDraw {
        debugPane?: egret.Shape;
    }

    const rect = new egret.Rectangle;
    if (DEBUG) {
        $gm.regPathDraw(MapPathType.NavMesh,
            function (this: TileMapLayer & NavMeshDraw, x: number, y: number, w: number, h: number, map: NavMeshMapInfo) {
                let gp = this.debugPane;
                if (!gp) {
                    this.debugPane = gp = new egret.Shape;
                }
                if ($gm.$showMapGrid) {
                    let trangles = map.cells;
                    const g = gp.graphics;
                    g.clear();
                    if (trangles) {
                        rect.setTo(x, y, w, h);
                        g.lineStyle(2, 0xff00);
                        for (let i = 0; i < trangles.length; i++) {
                            const { pA, pB, pC } = trangles[i];
                            if (rect.containsPoint(pA) || rect.containsPoint(pB) || rect.containsPoint(pC)) {
                                g.beginFill(0xff00, 0.1);
                                g.moveTo(pA.x, pA.y);
                                g.lineTo(pB.x, pB.y);
                                g.lineTo(pC.x, pC.y);
                                g.lineTo(pA.x, pA.y);
                                g.endFill();
                            }
                        }
                        this.addChild(gp);
                    }
                } else {
                    removeDisplay(gp);
                }
            }
        );
    }
}