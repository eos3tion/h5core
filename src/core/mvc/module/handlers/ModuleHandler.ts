namespace jy {
	/**
	 * 模块处理器的基类 
	 * 类型0的模块处理器
	 * @author 
	 *
	 */
	export interface ModuleHandler {

		/**
		 * 打开某个模块
		 * @param cfg
		 */
		show(cfg: IModuleCfg, param?: ModuleParam);


        /**
         * 重舞台移除某个模块
         * @param cfg
         *
         */
		hide(cfg: IModuleCfg, param?: ModuleParam);
	}
}
