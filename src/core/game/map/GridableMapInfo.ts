namespace jy {
    export interface Gridable {
        pathdata: Uint8Array;

        /**
         * 路径数据最大支持的位数
         */
        pdatabit: number;

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
         * 透明区域点数据
         */
        adata?: Uint8Array;
    }
}