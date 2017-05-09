module junyou {
    /**
     * 角标信息
     * @author 3tion
     */
    export interface BadgeInfo {
        /**
         * 
         * 模块标识
         * @type {string}
         */
        mid: string | number;
        /**
         * 
         * 改变的消息
         * @type {any}  存储角标支持数据
         */
        msg: any;

        show?: boolean;

        parent?: BadgeInfo;

        sons?: BadgeInfo[];
    }
}