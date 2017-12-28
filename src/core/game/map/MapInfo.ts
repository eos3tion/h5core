module junyou {

    /**
     * 默认地图宽/高
     */
    const enum MapConst {
        DefaultSize = 256,

        DebugMapPath = "m/",

        ReleaseMapPath = "m2/",
    }
    const webp = Global.webp ? Ext.WEBP : "";

	/**
	 * 地图基础信息<br/>
	 * 由地图编辑器生成的地图信息
	 * @author 3tion
	 *
	 */
    export class MapInfo extends egret.HashObject {

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
         * 地图格子列数
         */
        public columns: number;

        /**
         * 地图格子行数
         */
        public rows: number;

        /**
         * 格子宽度
         */
        public gridWidth: number;

        /**
         * 格子高度
         */
        public gridHeight: number;

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

        public getWalk?(x: number, y: number): number;

        /**
         * 路径点信息 低版本WebView不支持 ArrayBuffer
         */
        public pathdata?: Uint8Array;

        public constructor() {
            super();
        }
        /**
        * 获取地图图块资源路径
        */
        getMapUri: { (col: number, row: number) };

        /**
         * 获取图片路径
         */
        getImgUri: { (uri: string): string };

        /**
         * 地图前缀路径
         */
        static readonly prefix: string = DEBUG ? MapConst.DebugMapPath : MapConst.ReleaseMapPath;
    }

    let mpt = MapInfo.prototype;
    if (DEBUG) {
        mpt.getImgUri = function (this: MapInfo, uri: string) {
            return MapConst.DebugMapPath + this.path + "/" + uri;
        }
        mpt.getMapUri = function (this: MapInfo, col: number, row: number): string {
            return MapConst.DebugMapPath + this.path + "/" + row.zeroize(3) + col.zeroize(3) + this.ext;
        }
    }
    if (RELEASE) {
        mpt.getImgUri = function (this: MapInfo, uri: string) {
            return `${MapConst.ReleaseMapPath}${this.path}/${uri}`;
        }
        mpt.getMapUri = function (this: MapInfo, col: number, row: number) {
            return `${MapConst.ReleaseMapPath}${this.path}/${row}_${col}${this.ext}${webp}`;
        }
    }
}
