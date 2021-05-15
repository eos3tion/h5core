namespace jy {
	/**
	 * 模块检测器 
	 * @author 
	 *
	 */
	export interface IModuleChecker extends ILimitChecker {

		/**
		 * 检查并修正显示限制和使用限制值配错的情况
		 * @param	{any}	showLimits		显示限制的数据
		 * @param	{any}	limits			使用限制的数据
		 * @return	{boolean}   <br/>true 有配置错误<br/>false 无配置错误
		 */
		adjustLimits(cfg: IModuleCfg): boolean;

	}
}
