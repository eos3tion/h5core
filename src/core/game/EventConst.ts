namespace jy {
    /**
     * 游戏使用区段
     * -1000~-1999
     * 
     * @export
     * @enum {number}
     */
    export const enum EventConst {

        /**
         * Unit被回收时触发
         */
        UnitRecycle = -1999,
        /**
         * Unit被创建时触发
         */
        UnitCreate,
        /**
         * Unit添加到舞台时触发
         */
        UnitAddToStage,
        /**
         * 当render执行时间需要处理2秒+的数据派完
         */
        SlowRender,

        /**
         * 窗口激活
         */
        ACTIVATE,

        /**
         * 窗口失去激活
         */
        DEACTIVATE,

        /**
         * ani 一次播放完成
         */
        AniComplete,

        /**
         * ani 回收前触发
         */
        AniBeforeRecycle

    }
}