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
            if (cell.isPointIn(tmpPoint)) {
                return cell;
            }
        }
    }

    class WayPoint {
        /**
         * g + h
         * 
         * @type {number}
         * @memberOf PathNode
         */
        f: number;
        /**
         * 实际运行成本，以从出发点移动到指定的正方形网格上，产生到那里的路径
         * 
         * @type {number}
         * @memberOf PathNode
         */
        g: number;
        /**
         * 估计的运行成本
         * 
         * @type {number}
         * @memberOf PathNode
         */
        h: number;
        /**
         * 节点所在的坐标x
         * 
         * @type {number}
         * @memberOf PathNode
         */
        x: number;
        /**
         * 节点所在的坐标y
         * 
         * @type {number}
         * @memberOf PathNode
         */
        y: number;
        /**
         * 节点的标识
         * 
         * @type {number}
         * @memberOf PathNode
         */
        key: number;
        step: number;

        /**
         * 上一个节点
         * 
         * @type {PathNode}
         * @memberOf PathNode
         */
        prev?: WayPoint;
        cell: Cell;
        postion: Point;
    }


    function calcH(tx: number, ty: number, x: number, y: number) {
        let tmp2 = tx - x;
        tmp2 = tmp2 < 0 ? -tmp2 : tmp2;
        let tmp3 = ty - y;
        tmp3 = tmp3 < 0 ? -tmp3 : tmp3;
        return tmp2 + tmp3;
    }

    function getWayPoint(cell: Cell, postion: Point) {
        let wp = recyclable(WayPoint);
        wp.cell = cell;
        wp.postion = postion;
        return wp;
    }

    /**
     * 将格子进行链接，方便寻路
     * @param pv 
     */
    function linkCells(pv: Cell[]): void {
        const len = pv.length;
        for (let i = 0; i < len; i++) {
            const cellA = pv[i];
            for (let j = 0; j < len; j++) {
                const cellB = pv[j];
                if (cellA != cellB) {
                    cellA.checkAndLink(cellB);
                }
            }
        }
    }

    const empty = Temp.EmptyObject as PathFinderOption;
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
                        let f = adjacentTmp.m_WallDistance[Math.abs(i - currNode.m_ArrivalWall)] || 0;
                        if (adjacentTmp.sessionId != pathSessionId) {
                            // 4. 如果该相邻节点不在开放列表中,则将该节点添加到开放列表中, 
                            //    并将该相邻节点的父节点设为当前节点,同时保存该相邻节点的G和F值;
                            adjacentTmp.sessionId = pathSessionId;
                            adjacentTmp.parent = currNode;
                            adjacentTmp.isOpen = true;

                            //H和F值
                            adjacentTmp.h = calcH(fx, fy, adjacentTmp.x, adjacentTmp.y);
                            adjacentTmp.f = currNode.f + f;
                            //放入开放列表并排序
                            openList.put(adjacentTmp);
                            adjacentTmp.setWall(currNode.idx);
                        } else {
                            // 5. 如果该相邻节点在开放列表中, 
                            //    则判断若经由当前节点到达该相邻节点的G值是否小于原来保存的G值,
                            //    若小于,则将该相邻节点的父节点设为当前节点,并重新设置该相邻节点的G和F值
                            if (adjacentTmp.isOpen) {//已经在openList中
                                if (currNode.f + f < adjacentTmp.f) {
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
                let cur = node;
                while (cur) {
                    let outSide = cur.sides[cur.m_ArrivalWall];	//路径线在网格中的穿出边
                    let lastPtA = outSide.pA;
                    let lastPtB = outSide.pB;
                    let lastLineA = new Line().setPoints(startPos, lastPtA);
                    let lastLineB = new Line().setPoints(startPos, lastPtB);

                    let cell = cur.parent;
                    cur = cell;
                    let next: Cell;
                    let lastPos = endPos;
                    do {
                        let testA: Point, testB: Point;
                        next = cell.parent;
                        if (next) {
                            let outSide = cell.sides[cell.m_ArrivalWall];
                            testA = outSide.pA;
                            testB = outSide.pB;
                        } else {
                            testA = endPos;
                            testB = endPos;
                        }
                        if (!lastPtA.equals(testA)) {
                            if (lastLineB.classifyPoint(testA) == PointClassification.RightSide) {
                                lastPos = lastPtB;
                                break;
                            } else if (lastLineA.classifyPoint(testA) != PointClassification.LeftSide) {
                                lastPtA = testA;
                                cur = cell;
                                lastLineA.setPB(lastPtA);
                            }
                        }
                        if (!lastPtB.equals(testB)) {
                            if (lastLineA.classifyPoint(testB) == PointClassification.LeftSide) {
                                lastPos = lastPtA;
                                break;
                            } else if (lastLineB.classifyPoint(testB) != PointClassification.RightSide) {
                                lastPtB = testB;
                                cur = cell;
                                lastLineB.setPB(lastPtA);
                            }
                        }
                        cell = next;
                    } while (cell)
                    path.push(lastPos);
                }
            }
            if (path) {
                let list = [];
                let j = 0;
                for (let i = path.length; i > 0; i--) {
                    list[j++] = path[i];
                }
                path = list;
            }

            callback.callAndRecycle(path, true);
            return
        }
    }
}