namespace jy {

    export const enum MapPBDictKey {
        GridMapInfoPB = 100,
        MapEffPB = 101,
        MapInfoPB = 102,
        MapLinePB = 103,
        MapOvalPB = 104,
        MapPointPB = 105,
        MaskPolyPB = 106,
        NavMeshMapInfoPB = 107,
        PointGroupPB = 108,
        PolyPointIdxPB = 109,
        TPointIdxPB = 110,
        TiledMapPB = 111,
        SubPathPB = 112,
    }
    /**
     * 地图的PB数据
     */
    export const MapPB: PBStructDictInput = {
        //↓↓↓↓↓ [文本框中，复制粘贴] ↓↓↓↓↓
        /*GridMapInfoPB*/100: { 1: ["columns", 2, 5], 2: ["rows", 2, 5], 3: ["gridWidth", 2, 5], 4: ["gridHeight", 2, 5], 5: ["pathdata", 1, 12], 6: ["alphadata", 1, 12], 7: ["pdatabit", 1, 5], 8: ["points", 3, 11, MapPBDictKey.PointGroupPB] },
        /*MapEffPB*/101: { 1: ["uri", 2, 9], 2: ["layer", 2, 5], 3: ["x", 2, 17], 4: ["y", 2, 17], 5: ["scaleX", 2, 17], 6: ["scaleY", 2, 17], 7: ["duration", 1, 5], 8: ["speedX", 1, 17], 9: ["speedY", 1, 17], 10: ["seed", 1, 5], 11: ["rotation", 1, 17], 12: ["group", 1, 9], 13: ["type", 1, 5] },
        /*MapInfoPB*/102: { 1: ["id", 2, 5], 2: ["extType", 2, 5], 3: ["type", 2, 5], 4: ["width", 2, 5], 5: ["height", 2, 5], 6: ["data", 2, 12], 7: ["effs", 3, 11, MapPBDictKey.MapEffPB], 8: ["lines", 3, 11, MapPBDictKey.MapLinePB], 9: ["ovals", 3, 11, MapPBDictKey.MapOvalPB], 10: ["pWidth", 1, 5], 11: ["pHeight", 1, 5], 12: ["noPic", 1, 12], 13: ["tiledMap", 1, 11, MapPBDictKey.TiledMapPB], 14: ["subPaths", 3, 11, MapPBDictKey.SubPathPB] },
        /*MapLinePB*/103: { 1: ["id", 2, 5], 2: ["points", 3, 11, MapPBDictKey.MapPointPB], 3: ["flag", 1, 8], 4: ["type", 1, 5] },
        /*MapOvalPB*/104: { 1: ["id", 2, 5], 2: ["a", 1, 5], 3: ["b", 1, 5], 4: ["center", 3, 11, MapPBDictKey.MapPointPB] },
        /*MapPointPB*/105: { 1: ["x", 2, 5], 2: ["y", 2, 5] },
        /*MaskPolyPB*/106: { 1: ["points", 3, 11, MapPBDictKey.MapPointPB], 2: ["data", 1, 5] },
        /*NavMeshMapInfoPB*/107: { 1: ["points", 3, 11, MapPBDictKey.MapPointPB], 2: ["trians", 3, 11, MapPBDictKey.TPointIdxPB], 3: ["polys", 3, 11, MapPBDictKey.PolyPointIdxPB], 4: ["masks", 3, 11, MapPBDictKey.MaskPolyPB] },
        /*PointGroupPB*/108: { 1: ["id", 2, 9], 2: ["points", 3, 11, MapPBDictKey.MapPointPB] },
        /*PolyPointIdxPB*/109: { 1: ["idxs", 3, 5] },
        /*TPointIdxPB*/110: { 1: ["a", 2, 5], 2: ["b", 2, 5], 3: ["c", 2, 5] },
        /*TiledMapPB*/111: { 1: ["cols", 2, 5], 2: ["rows", 2, 5], 3: ["tileWidth", 2, 5], 4: ["tileHeight", 2, 5], 5: ["layers", 3, 12] },
        /*SubPathPB*/112: { 1: ["id", 2, 9], 3: ["type", 2, 5], 6: ["data", 2, 12] },
        //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    }
}