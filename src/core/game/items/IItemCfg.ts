module junyou {
    /**
     * 物品，道具
     * @author 3tion
     */
    export interface IItemCfg {
        /**
         * 道具ID
         * 
         * @type {number}
         */
        id: number;
        /**
         * 道具名称
         * 
         * @type {string}
         */
        name: string;
        /**
         * 道具显示的图标
         * 
         * @type {string}
         */
        icon: string;
        /**
         * 显示时的顺序
         * 
         * @type {number}
         */
        order: number;
        /**
         * 角色等级需求
         * 
         * @type {number}
         */
        minlevel: number;

        /**
         * 最大堆叠数量
         * 
         * @type {number}
         */
        maxcount: number;

        /**
         * 物品类型分类
         * 
         * @type {number}
         */
        type: number;

    }
}