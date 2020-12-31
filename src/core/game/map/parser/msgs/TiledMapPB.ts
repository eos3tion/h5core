/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2020-12-31 15:50:29
 **/
declare namespace jy {
    export interface TiledMapPB {
        /**
         * 总列数
         */
        cols: number;
        /**
         * 总行数
         */
        rows: number;
        /**
         * 
         */
        tileWidth: number;
        /**
         * 
         */
        tileHeight: number;
        /**
         * 可选参数 每一层的tile的id的字节数组，一个字节为一个tile的id
         */
        layers?: ByteArray[];
    }
}
