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
         * 地图路径前缀
         * 
         * @static
         */
        static MAP_PATH = "m/";

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

        // /**
        //  * 路径点信息 低版本WebView不支持 ArrayBuffer
        //  */
        // public pathdata: Uint8Array;

        // /**
        // *
        // * @param x
        // * @param y
        // * @return 0 非安全 1 安全
        // * JCSXXXXX
        // *
        // */
        // public getSafety(x: number, y: number): number {
        //     /*     var vl = ba[y * w + x]
        //             vl = (vl >> 5) & 1*/
        //     if (!this.pathdata) {
        //         return 0;
        //     }
        //     return this.pathdata[y * this.columns + x] >> 5 & 1
        // };
        // /**
        // *
        // * @param x
        // * @param y
        // * @return
        // * 0 不可走
        // * 1 可走
        // */
        // public getWalk(x: number, y: number): number {
        //     if (!this.pathdata) {
        //         return 0;
        //     }
        //     var columns = this.columns;
        //     var d = y * columns + x;
        //     if (d < 0) {
        //         return 0;
        //     }
        //     else if (d > this.pathdata.length) {
        //         return 0;
        //     }
        //     else {
        //         return this.pathdata[y * columns + x] & 1;
        //     }
        // }
        // /**
        // * 获取穿越点
        // * @param x
        // * @param y
        // * @return 0 可穿  1 不可穿
        // * JCSXXXXX
        // */
        // public getCross(x, y) {
        //     if (!this.pathdata) {
        //         return 0;
        //     }
        //     return this.pathdata[y * this.columns + x] >> 6 & 1;
        // }


        // /**
        // * 获取跳跃点
        // * @param x
        // * @param y
        // * @return 0 可跳 1 不可跳
        // * JCSXXXXX
        // */
        // public getJump(x, y) {
        //     if (!this.pathdata) {
        //         return 0;
        //     }
        //     return this.pathdata[y * this.columns + x] >> 7;
        // }

        // /**
        // * 获取透明点
        // * @param x
        // * @param y
        // * @return
        // * ALPHA值0-10
        // * TTTTAAAA
        // */
        // public getAlpha(x, y) {
        //     if (!this.pathdata) {
        //         return 0;
        //     }
        //     return this.pathdata[y * this.columns + x] & 15;
        // }

        public constructor() {
            super();
        }

        // const KEYS=["id","path","columns","rows","width","height"];
        static decodeFromArray(arr: any[], ref?: { new (): MapInfo }): MapInfo {
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
            // //地图的base64数据
            // 项目部使用路径点信息
            // let b64: string = arr[6];
            // if (b64) {
            //     m.pathdata = Base64.getBytesFromBase64(b64);
            // }
            return m;
        }

        /**
         * 获取资源路径
         */
        public getMapUri(col: number, row: number): string {
            return MapInfo.MAP_PATH + this.path + "/" + row + "_" + col + ext;
        }
    }
}
