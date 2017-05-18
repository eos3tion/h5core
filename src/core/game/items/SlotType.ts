module junyou {
    /**
     * 格位区段类型
     * @author 3tion
     */
    export interface SlotType {
        /**
         * 格位区段的起始
         * 
         * @type {number}
         */
        begin: number;
        /**
         * 格位区段的结束
         * 
         * @type {number}
         */
        end: number;
        /**
         * 锁定的格位
         * 
         * @type {number}
         */
        lock: number;
        /**
         * 格位类型
         * 
         * @type {number}
         */
        type: number;
    }
}