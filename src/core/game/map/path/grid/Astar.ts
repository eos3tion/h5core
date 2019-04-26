namespace jy {

    export interface PathFinderOption {
        /**
         * 是否同步处理
         */
        sync?: boolean;
        /**
         * 默认当前地图格子总数
         */
        max?: number;
    }

    /**
     * 寻路的节点
     * 
     * @export
     * @interface PathNode
     */
    export interface PathNode {
        /**
         * 节点的标识
         * 
         * @type {number}
         * @memberOf PathNode
         */
        key: number;
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
         * 上一个节点
         * 
         * @type {PathNode}
         * @memberOf PathNode
         */
        prev?: PathNode;
        /**
         * 节点数量
         * 
         * @type {number}
         * @memberOf PathNode
         */
        step: number;
    }
    /**
     * 坐标偏移数据
     */
    const aSurOff: [number, number][] = [
            /*↖*/[-1, -1], /*↑*/[0, -1], /*↗*/[1, -1],
            /*←*/[-1, 0], /*    ㊥    */ /*→*/[1, 0],
            /*↙*/[-1, 1], /*↓*/[0, 1],   /*↘*/[1, 1]];

    const empty = Temp.EmptyObject as PathFinderOption;
    /**
     * A星寻路算法
     * @author 3tion
     * @export
     * @class Astar
     */
    export class Astar implements PathFinder {

        private _map: GridMapInfo;
        private _maxLength: number;
        /**
         * 最小执行时间
         * 
         * @type {number}
         * @memberOf Astar
         */
        minCacTime = 5;

        public bindMap(map: GridMapInfo) {
            this._map = map;
            this._maxLength = map.gridHeight * map.gridWidth;
        }
        /**
         * 获取路径节点
         * 
         * @param {number} fx               起点坐标x
         * @param {number} fy               起点坐标y
         * @param {number} tx               终点坐标x
         * @param {number} ty               终点坐标y
         * @param {{ (path: PathNode[], noEnd?: boolean, ...args) }: void } callback    寻找到目标后的 回调方法
         * @param {any} args                回调函数的其他参数
         * 
         * @memberOf PathFinder
         */
        public getPath(fx: number, fy: number, tx: number, ty: number, callback: CallbackInfo<PathFinderCallback>, opt?: PathFinderOption) {
            const map = this._map;
            if (!map) {
                callback.callAndRecycle(null, true);
                return;
            }

            if (fx == tx && fy == ty) {
                callback.callAndRecycle(null, true);
                return;
            }

            const w = map.columns;
            const h = map.rows;

            if (fx > w || fy > h) {//超过最大格位数量
                callback.callAndRecycle(null, false);
                return;
            }
            /**
             * PathNode的字典
             * Key      {number}    y * w + x
             * value    {PathNode}  节点
             */
            const list: { [index: number]: PathNode } = [];
            /**待检测点 */
            const openList: PathNode[] = [];
            /**已搜寻过的点 */
            const closedList: { [index: number]: boolean } = [];
            let minH = Infinity;
            /**
             * 最小的节点
             */
            let minNode: PathNode;
            /**
             * 执行步数
             */
            let current = 0;
            const minCacTime = this.minCacTime;
            const ctrl = { stop: false };
            add(fx, fy, 0, (Math.abs(tx - fx) + Math.abs(ty - fy)) * 10);
            const stage = egret.sys.$TempStage;
            let { sync, max } = opt || empty;
            const maxLength = max || this._maxLength;
            if (sync) {
                let result: boolean;
                do {
                    result = onTick();
                }
                while (!result)
            } else {
                stage.on(EgretEvent.ENTER_FRAME, onTick, null);
            }
            return ctrl;
            function onTick() {
                let t = Date.now();
                while (openList.length) {
                    if (ctrl.stop) {//如果外部控制结束
                        stage.off(EgretEvent.ENTER_FRAME, onTick, null);
                        callback.callAndRecycle(end(minNode), false);//现在外部结束，也给个结果，不过认为没结束
                        return true;
                    }
                    let node = openList.shift();
                    const { x, y, g, key } = node;
                    if (closedList[key]) {
                        continue;
                    }
                    //标记已经搜索过的
                    closedList[key] = true;
                    if (x == tx && y == ty) {//找到终点
                        stage.off(EgretEvent.ENTER_FRAME, onTick, null);
                        callback.callAndRecycle(end(minNode), true);
                        return true;
                    }

                    aSurOff.forEach(element => {
                        let tmpx = element[0] + x;
                        let tmpy = element[1] + y;
                        if (tmpx < 0 || tmpy < 0 || tmpx >= w || tmpy >= h) {
                            return;
                        }
                        let currentG = map.getWalk(tmpx, tmpy);
                        if (currentG == 0 || closedList[tmpy * w + tmpx]) {
                            return;
                        }
                        let tmp1 = tmpx - x + tmpy - y;
                        tmp1 = tmp1 < 0 ? -tmp1 : tmp1;
                        let tmp2 = tx - tmpx;
                        tmp2 = tmp2 < 0 ? -tmp2 : tmp2;
                        let tmp3 = ty - tmpy;
                        tmp3 = tmp3 < 0 ? -tmp3 : tmp3;
                        let tmpG = 0;
                        if (tmpx != x || tmpy != y) {
                            if (tmp1 == 1) {
                                tmpG = 10 + g;
                            } else {
                                tmpG = 14 + g;
                            }
                            tmpG += currentG;
                        }
                        add(tmpx, tmpy, tmpG, (tmp2 + tmp3) * 10, node);
                    });
                    current++;
                    if (current > maxLength) {
                        break;
                    }

                    if (Date.now() - t > minCacTime) {//超过执行时间，下帧再执行
                        return;
                    }
                }
                callback.callAndRecycle(end(minNode), false);
                return true;
            }
            function end(node: PathNode): PathNode[] {
                // 移除监听
                stage.off(EgretEvent.ENTER_FRAME, onTick, null);
                let list = [];
                let j = 0;
                for (let i = node.step; i > 0; i--) {
                    list[i - 1] = node;
                    node = node.prev;
                }
                return list;
            }
            function add(x: number, y: number, g: number, h: number, prev?: PathNode) {
                let key = y * w + x;
                let node = list[key];
                let f = g + h;
                if (!node) {
                    list[key] = node = { key, x, y, g, h, f, prev, step: prev ? prev.step + 1 : 0 };
                }
                //得到预估值最小的节点
                if (minH > h) {
                    minH = h;
                    minNode = node;
                }
                let len = openList.length;
                if (len) {
                    let idx = len >> 1;
                    let num = len;
                    len--;
                    //使用二分法将节点进行重新排序
                    while (num > 1) {
                        num = (num + (num & 1)) >> 1;
                        if (f <= openList[idx].f) {
                            idx -= num;
                            if (idx < 0) idx = 0;
                        }
                        else {
                            idx += num;
                            if (idx > len) {
                                idx = len;
                            }
                        }
                    }
                    if (f > openList[idx].f) {
                        idx++;
                    }
                    for (var i = len + 1; i > idx; i--) {
                        openList[i] = openList[i - 1];
                    }
                    openList[i] = node;
                } else {
                    openList[0] = node;
                }
            }
        }
    }
}