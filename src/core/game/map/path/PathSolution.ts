declare namespace jy {

    export interface PathFinderCallback {

        /**
         * 
         * @param {Point[]} path 路径集
         * @param {boolean} isEnd 路径是否到达结束点
         * @param {any[]} args 
         */
        (path: Point[], isEnd?: boolean, ...args);
    }

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
     * 
     * 寻路算法
     * @author 3tion
     * @export
     * @interface PathFinder
     */
    export interface PathFinder {

        /**
         * 绑定要寻路的地图数据
         * 
         * @param {MapInfo} map
         * 
         * @memberOf PathFinder
         */
        bindMap(map: MapInfo);

        /**
         * 获取路径节点
         * 
         * @param {number} fx               起点坐标x
         * @param {number} fy               起点坐标y
         * @param {number} tx               终点坐标x
         * @param {number} ty               终点坐标y
         * @param {CallbackInfo<{ (path: PathNode[], ...args) }>} callback    寻找到目标后的 回调方法
         * 
         * @memberOf PathFinder
         */
        getPath(fx: number, fy: number, tx: number, ty: number, callback: CallbackInfo<PathFinderCallback>, opt?: PathFinderOption);
    }

    /**
     * 绘制路径信息
     */
    export interface drawPath { (this: TileMapLayer, x: number, y: number, w: number, h: number, map: MapInfo) }
}