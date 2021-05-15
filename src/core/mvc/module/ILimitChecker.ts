namespace jy {
	/**
	 * 限制检查器的基类
	 * @author 3tion
	 *
	 */
	export interface ILimitChecker {
		/**
		 * 是否可以显示
		 * @param data		数据
		 * @param showtip	是否显示tip
		 * @return
		 *
		 */
		checkShow(cfg: IModuleCfg, showtip: boolean): boolean
		/**
		 * 是否开启
		 * @param cfg 
		 * @param showtip 
		 */
		checkOpen(cfg: IModuleCfg, showtip: boolean): boolean
	}
}
