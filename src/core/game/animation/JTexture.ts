module junyou {

    /**
     * 存储锚点信息
     */ 
    export interface JTexture extends egret.Texture {
        /**
         * 用于设置位图的锚点坐标X
         */
        tx: number;
        /**
         * 用于设置位图的锚点坐标Y
         */
        ty: number;
    }
}
