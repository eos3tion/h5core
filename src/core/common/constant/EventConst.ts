module junyou {
	/**
	 * 网络事件的常量集
	 * @author 
	 * -100~ -199
	 */
	export const enum EventConst {

    	/**
    	 * 登录成功
    	 */
		LOGIN_COMPLETE = -199,

        /**
         * 登录失败
         */
		LOGIN_FAILED,

		/**
		 * 连接服务器成功
		 */
		Connected,
		/**
		 * 连接服务器失败
		 */
		ConnectFailed,
		/**
		 * 服务器断开连接
		 */
		Disconnect,

		ShowReconnect,
		/**
		 * 纹理加载完成
		 */
		Texture_Complete,
		/**
		 * 网络上线
		 */
		Online,
		/**
		 * 网络断线
		 */
		Offline,
		/**
		 * 手机从休眠状态中被唤醒
		 */
		Awake
	}
}
