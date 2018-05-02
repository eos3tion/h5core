namespace jy {
    /**
     * 单位的状态
     * @author 3tion
     */
    export const enum UnitState {
        /**
         * 创建了对象
         */
        Init = 0,
        /**
         * 添加到舞台上
         */
        Stage = 1,
        /**
         * 正在创建，往舞台上添加的动画
         */
        Spawning = 2,
        /**
         * 在舞台上活着
         */
        Alive = 3,
        /**
         * 正在死亡，执行死亡的动画
         */
        Deading = 4,
        /**
         * 死透了，在地板上
         */
        Dead = 5,
        /**
         * 正在销毁，尸体蚕食的动画
         */
        Disposing = 6,
        /**
         * 从舞台销毁，回收资源
         */
        Disposed = 7
    }
}