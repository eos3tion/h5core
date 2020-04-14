namespace jy {

    /**
     * 默认地图宽/高
     */
    const enum MapConst {
        DefaultSize = 256,

        MapPath = "m/",
    }
    const webp = Global.webp ? Ext.WEBP : "";

    /**
     * 地图路径点寻路类型
     */
    export const enum MapPathType {
        /**
         * 格子路径
         */
        Grid = 0,
        /**
         * 导航网格
         */
        NavMesh = 1,
        /**
         * 等角（交错）
         */
        Staggered = 2,
    }

	/**
	 * 地图基础信息<br/>
	 * 由地图编辑器生成的地图信息
	 * @author 3tion
	 *
	 */
    export class MapInfo {

        /**
         * 图片扩展
         */
        ext = Ext.JPG;

    	/**
    	 * 地图唯一标识
    	 */
        public id: Key;

        /**
         * 地图路径
         */
        public path: string;

        /**
         * 路径类型  
         * 0 走格子的  
         * 1 走导航网格寻路
         */
        pathType: MapPathType;

        /**
         * 没有地图底图的数据集合
         */
        noPic: Uint8Array;

        /**
         * 地图像素宽度
         */
        public width: number;

        /**
         * 地图像素高度
         */
        public height: number;

        /**
         * 单张底图的宽度
         */
        public pWidth: number = MapConst.DefaultSize;

        /**
         * 单张底图的高度
         */
        public pHeight: number = MapConst.DefaultSize;

        /**
         * X轴最大图片坐标
         * 000开始
         */
        public maxPicX: number;

        /**
         * Y轴最大图片数量
         * 000开始
         */
        public maxPicY: number;

        /**
         * 路径点是否可走  
         * 0 不可走
         * @param x 
         * @param y 
         */
        public getWalk?(x: number, y: number): number;

        /**
         * 此方法在执行过`bindMapPos`后生效  
         * 屏幕坐标转换为地图坐标  
         * @param x 
         * @param y 
         */
        screen2Map?(x: number, y: number): Point;
        /**
         * 此方法在执行过`bindMapPos`后生效  
         * 地图坐标转换为屏幕坐标
         * @param x 
         * @param y 
         */
        map2Screen?(x: number, y: number): Point;

        /**
        * 获取地图图块资源路径
        */
        getMapUri(col: number, row: number) {
            return `${MapInfo.prefix}${this.path}/${row}_${col}${this.ext}${webp}`;
        }

        /**
         * 获取图片路径
         */
        getImgUri(uri: string) {
            return `${MapInfo.prefix}${this.path}/${uri}`;
        }

        /**
         * 地图前缀路径
         */
        static prefix: string = MapConst.MapPath;
    }

    export interface MapPosSolver<T extends MapInfo> {
        init?(map: T);
        screen2Map(this: T, x: number, y: number): Point;
        /**
         * 地图坐标转为屏幕坐标，默认左上
         * @param this 
         * @param x 
         * @param y 
         * @param isCenter 转为中心点
         */
        map2Screen(this: T, x: number, y: number, isCenter?: boolean): Point;
    }



    function defaultPosSolver(x: number, y: number) {
        return { x, y };
    }

    const mapPosSolver = {} as { [type: number]: MapPosSolver<MapInfo> };

    export function regMapPosSolver<T extends MapInfo>(type: MapPathType, solver: MapPosSolver<T>) {
        mapPosSolver[type] = solver;
    }

    export function bindMapPos(map: MapInfo) {
        let solver = mapPosSolver[map.pathType];
        if (solver) {
            solver.init?.(map);
        }
        map.screen2Map = solver && solver.screen2Map || defaultPosSolver;
        map.map2Screen = solver && solver.map2Screen || defaultPosSolver;
    }
}
