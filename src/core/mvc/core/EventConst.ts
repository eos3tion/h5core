module junyou {
    /**
     * mvc使用的事件区段
     * -999~ -200
     * 
     * @export
     * @enum {number}
     */
    export const enum EventConst {
        /**
         * 通知角标变更
         */
        Notification = -999,
        /**
         * 模块检查器初始化完毕
         */
        MODULE_CHECKER_INITED,
    	/**
		 * 尝试调用某个功能<br/>
		 * data 为功能ID
		 */
        MODULE_TRY_TOGGLE,

        /**
        * 有功能，服务端要求临时关闭<br/>
        * data 为功能ID
        */
        MODULE_SERVER_CLOSE,

        /**
        * 有临时关闭的功能，服务端要求再打开<br/>
        * data 为功能ID
        */
        MODULE_SERVER_OPEN,

        /**
         * 模块显示状态发生改变发生改变<br/>
         * data 为剩余未显示的按钮数量
         */
        MODULE_SHOW_CHANGED,

		/**
		 * 有模块需要检查是否会造成显示变化
		 */
        MODULE_NEED_CHECK_SHOW,

		/**
		 * 有模块不符合显示的条件
		 * data 为功能ID
		 */
        MODULE_NOT_SHOW,

		/**
		 * 有模块显示了
		 */
        MODULE_SHOW
    }
}