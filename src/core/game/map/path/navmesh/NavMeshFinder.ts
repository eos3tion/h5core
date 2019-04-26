//参考项目 https://github.com/blianchen/navMeshTest
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
            if (cell.contain(tmpPoint)) {
                return cell;
            }
        }
    }

    function calcH(tx: number, ty: number, x: number, y: number) {
        let tmp2 = tx - x;
        tmp2 = tmp2 < 0 ? -tmp2 : tmp2;
        let tmp3 = ty - y;
        tmp3 = tmp3 < 0 ? -tmp3 : tmp3;
        return tmp2 + tmp3;
    }


    /**
     * 将格子进行链接，方便寻路
     * @param pv 
     */
    function linkCells(pv: Cell[]): void {
        const len = pv.length;
        for (let i = 0; i < len; i++) {
            const cellA = pv[i];
            for (let j = i + 1; j < len; j++) {
                const cellB = pv[j];
                cellA.checkAndLink(cellB);
                cellB.checkAndLink(cellA);
            }
        }
    }

    let pathSessionId = 0;
    function compare(a: Cell, b: Cell) {
        return b.f - a.f;
    }

    export class NavMeshFinder implements PathFinder {
        map: NavMeshMapInfo;
        openList = new Heap<Cell>(0, compare);
        bindMap(map: NavMeshMapInfo) {
            this.map = map;
            if (!map.linked) {
                linkCells(map.cells);
                map.linked = true;
            }
            this.openList.clear(map.cells.length);
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
                callback.callAndRecycle([endPos], true);
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
                callback.callAndRecycle([endPos], true);
                return;
            }
            pathSessionId++;

            endCell.f = 0;
            endCell.h = 0;
            endCell.isOpen = false;
            endCell.parent = null;
            endCell.sessionId = pathSessionId;

            const openList = this.openList;
            openList.clear();
            openList.put(endCell);
            let node: Cell;

            while (openList.size > 0) {
                let currNode = openList.pop();
                //路径是在同一个三角形内
                if (currNode == startCell) {
                    node = currNode;
                    break;
                }

                // 2. 对当前节点相邻的每一个节点依次执行以下步骤:
                //所有邻接三角型
                let links = currNode.links;
                for (let i = 0; i < 3; i++) {
                    const adjacentId = links[i];
                    // 3. 如果该相邻节点不可通行或者该相邻节点已经在封闭列表中,
                    //    则什么操作也不执行,继续检验下一个节点;
                    if (adjacentId < 0) {//不能通过
                        continue;
                    }
                    let adjacentTmp = cells[adjacentId];
                    if (adjacentTmp) {
                        let f = currNode.f + adjacentTmp.wallDist[Math.abs(i - currNode.wall)] || 0;
                        if (adjacentTmp.sessionId != pathSessionId) {
                            // 4. 如果该相邻节点不在开放列表中,则将该节点添加到开放列表中, 
                            //    并将该相邻节点的父节点设为当前节点,同时保存该相邻节点的G和F值;
                            adjacentTmp.sessionId = pathSessionId;
                            adjacentTmp.parent = currNode;
                            adjacentTmp.isOpen = true;

                            //H和F值
                            adjacentTmp.h = calcH(fx, fy, adjacentTmp.x, adjacentTmp.y);
                            adjacentTmp.f = f;
                            //放入开放列表并排序
                            openList.put(adjacentTmp);
                            adjacentTmp.setWall(currNode.idx);
                        } else {
                            // 5. 如果该相邻节点在开放列表中, 
                            //    则判断若经由当前节点到达该相邻节点的G值是否小于原来保存的G值,
                            //    若小于,则将该相邻节点的父节点设为当前节点,并重新设置该相邻节点的G和F值
                            if (adjacentTmp.isOpen) {//已经在openList中
                                if (f < adjacentTmp.f) {
                                    adjacentTmp.f = currNode.f;
                                    adjacentTmp.parent = currNode;
                                    adjacentTmp.setWall(currNode.idx);
                                }
                            }
                        }
                    }
                }
            }
            let path: Point[];
            if (node) {
                path = [];
                _tmp.cell = node;
                _tmp.pos = startPos;
                while (getWayPoint(_tmp, endPos)) {
                    path.push(_tmp.pos);
                }
                path.push(endPos);
            }
            callback.callAndRecycle(path, true);
            return
        }
    }

    const _tmp = {
        cell: null as Cell,
        pos: null as Point
    }

    const _lastLineA = new Line();
    const _lastLineB = new Line()

    function getWayPoint(tmp: { cell: Cell, pos: Point }, endPos: Point) {
        let cell = tmp.cell;
        let startPt = tmp.pos;
        let lastCell = cell;
        let outSide = cell.sides[cell.wall];	//路径线在网格中的穿出边
        let lastPtA = outSide.pA;
        let lastPtB = outSide.pB;
        let lastLineA = _lastLineA;
        let lastLineB = _lastLineB;
        lastLineA.setPoints(startPt, lastPtA);
        lastLineB.setPoints(startPt, lastPtB);
        lastCell = cell;
        cell = cell.parent;
        do {
            let testA: Point, testB: Point;
            let next = cell.parent;
            if (next) {
                let outSide = cell.sides[cell.wall];
                testA = outSide.pA;
                testB = outSide.pB;
            } else {
                testA = endPos;
                testB = endPos;
            }
            if (!lastPtA.equals(testA)) {
                if (lastLineB.classifyPoint(testA) == PointClassification.RightSide) {
                    tmp.cell = lastCell;
                    tmp.pos = lastPtB;
                    return true
                } else if (lastLineA.classifyPoint(testA) != PointClassification.LeftSide) {
                    lastPtA = testA;
                    lastCell = cell;
                    lastLineA.setPB(lastPtA);
                }
            }
            if (!lastPtB.equals(testB)) {
                if (lastLineA.classifyPoint(testB) == PointClassification.LeftSide) {
                    tmp.cell = lastCell;
                    tmp.pos = lastPtA;
                    return true
                } else if (lastLineB.classifyPoint(testB) != PointClassification.RightSide) {
                    lastPtB = testB;
                    lastCell = cell;
                    lastLineB.setPB(lastPtB);
                }
            }
            cell = next;
        } while (cell)
    }
}