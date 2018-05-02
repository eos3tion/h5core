namespace jy {
	/**
	 *
	 * @author 3tion
	 *
	 */
	export const enum RequestState {
    	/**
		 * 未请求/未加载 0
		 */
		UNREQUEST = 0,
        /**
		 * 请求中/加载中，未获得值 1
		 */
		REQUESTING = 1,
        /**
		 * 已加载/已获取到值 2
		 */
		COMPLETE = 2,
        /**
		 * 加载失败 -1
		 */
		FAILED = -1
	}
}
