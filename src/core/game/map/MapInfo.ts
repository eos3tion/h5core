module junyou {

    /**
     * 默认地图宽/高
     */
    const enum MapConst {
        DefaultSize = 256
    }

    const ext = Ext.JPG + (Global.webp ? Ext.WEBP : "");


	/**
	 * 地图基础信息<br/>
	 * 由地图编辑器生成的地图信息
	 * @author 3tion
	 *
	 */
    export class MapInfo extends egret.HashObject {

    	/**
    	 * 地图唯一标识
    	 */
        public id: string;

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

        // const KEYS=["id","path","columns","rows","width","height"];
        static decodeFromArray(arr: any[], ref?: { new(): MapInfo }): MapInfo {
            ref = ref || MapInfo;
            let m = new ref();
            m.id = arr[0];
            m.path = arr[1];
            m.columns = arr[2];
            m.rows = arr[3];
            m.width = arr[4];
            m.height = arr[5];
            m.maxPicX = m.width / m.pWidth - 1 >> 0;
            m.maxPicY = m.height / m.pHeight - 1 >> 0;
            // 地图的base64数据
            // 项目部使用路径点信息
            let b64: string = arr[6];
            if (b64) {
                m.pathdata = new Uint8Array(egret.Base64Util.decode(b64));
            }
            return m;
        }

        /**
        * 获取资源路径
        */
        getMapUri: { (col: number, row: number) };
    }

    if (DEBUG) {
        MapInfo.prototype.getMapUri = function (col: number, row: number): string {
            return "m/" + this.resPath + "/" + row.zeroize(3) + col.zeroize(3) + Ext.JPG;
        }
    }
    if (RELEASE) {
        MapInfo.prototype.getMapUri = function (col: number, row: number) {
            return `m2/${this.path}/${row}_${col}${ext}`;
        }
    }
}
