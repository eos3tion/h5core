module junyou {
	/**
	 * 限制检查器的基类
	 * @author 3tion
	 *
	 */
	export interface ILimitChecker {
    	/**
		 * 是否通过检查
		 * @param data		数据
		 * @param showtip	是否显示tip
		 * @return
		 *
		 */
		check(data: any, showtip: boolean): boolean
	}
}
