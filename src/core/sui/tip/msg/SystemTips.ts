module junyou {
    /**
     * description
     * @author pb
     */
    export interface SystemTips {

        /**
         * 初始化
         */
        init();

		/**
		 * 主要用来显示客户端的文本
		 * @param msg			显示的文字
		 * 
		 */		
		showClient(msg:string);
		
		/**
		 * 主要用来显示服务器的文本
		 * @param msg			显示的文字
		 * 
		 */		
		showServer(msg:string);
    }
}