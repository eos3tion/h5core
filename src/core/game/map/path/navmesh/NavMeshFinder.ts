namespace jy {
    import Point = egret.Point;

    const tmpPoint = new Point;
    /**
     * 获取格子
     * @param pt
     * @param cells 
     */
    function findClosestCell(x: number, y: number, cells: Cell[]) {
        tmpPoint.setTo(x, y);
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.isPointIn(tmpPoint)) {
                return cell;
            }
        }
    }

    class WayPoint {
        cell: Cell;
        postion: Point;
    }

    function getWayPoint(cell: Cell, postion: Point) {
        let wp = recyclable(WayPoint);
        wp.cell = cell;
        wp.postion = postion;
        return wp;
    }

    export class NavMeshFinder implements PathFinder {
        map: NavMeshMapInfo;

        bindMap(map: NavMeshMapInfo) {
            this.map = map;
        }
        getPath(fx: number, fy: number, tx: number, ty: number, callback: CallbackInfo<PathFinderCallback>, opt?: PathFinderOption) {
            const map = this.map;
            let startPos = new Point(fx, fy);
            let endPos = new Point(tx, ty);
            if (!map) {
                callback.callAndRecycle(null, true);
                return;
            }

            if (fx == tx && fy == ty) {
                callback.callAndRecycle(null, true);
                return;
            }
            const cells = map.cells;
            if (!cells) {
                callback.callAndRecycle([startPos, endPos], true);
                return;
            }
            let startCell = findClosestCell(fx, fy, cells);
            if (!startCell) {
                callback.callAndRecycle(null, true);
                return
            }
            let endCell = findClosestCell(tx, ty, cells);
            if (!endCell) {
                callback.callAndRecycle(null, true);
                return
            }
            //其实和结束的格位相同
            if (startCell == endCell) {
                callback.callAndRecycle([startPos, endPos], true);
                return;
            }

            const openList: Cell[] = [];
            openList.push(endCell);
            endCell.f = 0;
            endCell.h = 0;
            endCell.isOpen = false;
            endCell.parent = null;
        }


    }
}