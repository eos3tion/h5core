module junyou {
    /**
     * 用于对通知进行检查
     * @author 3tion
     */
    export interface INCheck {
        /**
         * 
         * 对通知进行检查，如果是父级，可以直接检查子集
         * @returns {any}    返回改变的消息
         */
        ncheck(): any;
    }
}