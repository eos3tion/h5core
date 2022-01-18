/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2022-01-18 17:00:14
 **/
declare namespace jy {
    export interface SubPathPB {
        /**
         * 子路径数据标识
         */
        id: string;
        /**
         * 地图类型 `0` GridMapInfo `1` NavMeshMapInfo `2` StaggerdMapInfo
         */
        type: number;
        /**
         * 特殊地图数据，根据`type`不同，里面数据不同
         */
        data: ByteArray;
    }
}
