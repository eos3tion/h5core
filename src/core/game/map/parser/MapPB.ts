namespace jy {
    export const enum MapPBDictKey {
        GridMapInfoPB = 110,
        MapEffPB = 111,
        MapInfoPB = 112,
        MapLinePB = 113,
        MapOvalPB = 114,
        MapPointPB = 115,
        MaskPolyPB = 116,
        NavMeshMapInfoPB = 117,
        PolyPointIdxPB = 118,
        TPointIdxPB = 119,
    }
    /**
     * 地图的PB数据
     */
    export const MapPB: PBStructDictInput = {
        //↓↓↓↓↓ [文本框中，复制粘贴] ↓↓↓↓↓
        /*GridMapInfoPB*/110: { 1: ["columns", 2, 5], 2: ["rows", 2, 5], 3: ["gridWidth", 2, 5], 4: ["gridHeight", 2, 5], 5: ["pathdata", 1, 12], 6: ["alphadata", 1, 12], 7: ["pdatabit", 1, 5] },
        /*MapEffPB*/111: { 1: ["uri", 2, 9], 2: ["layer", 2, 5], 3: ["x", 2, 17], 4: ["y", 2, 17], 5: ["scaleX", 2, 17], 6: ["scaleY", 2, 17], 7: ["duration", 1, 5], 8: ["speedX", 1, 17], 9: ["speedY", 1, 17], 10: ["seed", 1, 5], 11: ["rotation", 1, 17], 12: ["group", 1, 9] },
        /*MapInfoPB*/112: { 1: ["id", 2, 5], 2: ["extType", 2, 5], 3: ["type", 2, 5], 4: ["width", 2, 5], 5: ["height", 2, 5], 6: ["data", 2, 12], 7: ["effs", 3, 11, MapPBDictKey.MapEffPB], 8: ["lines", 3, 11, MapPBDictKey.MapLinePB], 9: ["ovals", 3, 11, MapPBDictKey.MapOvalPB], 10: ["pWidth", 1, 5], 11: ["pHeight", 1, 5], 12: ["noPic", 1, 12] },
        /*MapLinePB*/113: { 1: ["id", 2, 5], 2: ["points", 3, 11, MapPBDictKey.MapPointPB], 3: ["flag", 1, 8], 4: ["type", 1, 5] },
        /*MapOvalPB*/114: { 1: ["id", 2, 5], 2: ["a", 1, 5], 3: ["b", 1, 5], 4: ["center", 2, 11, MapPBDictKey.MapPointPB] },
        /*MapPointPB*/115: { 1: ["x", 2, 5], 2: ["y", 2, 5] },
        /*MaskPolyPB*/116: { 1: ["points", 3, 11, MapPBDictKey.MapPointPB], 2: ["data", 1, 5] },
        /*NavMeshMapInfoPB*/117: { 1: ["points", 3, 11, MapPBDictKey.MapPointPB], 2: ["trians", 3, 11, MapPBDictKey.TPointIdxPB], 3: ["polys", 3, 11, MapPBDictKey.PolyPointIdxPB], 4: ["masks", 3, 11, MapPBDictKey.MaskPolyPB] },
        /*PolyPointIdxPB*/118: { 1: ["idxs", 3, 5] },
        /*TPointIdxPB*/119: { 1: ["a", 2, 5], 2: ["b", 2, 5], 3: ["c", 2, 5] },
        //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
    }
}