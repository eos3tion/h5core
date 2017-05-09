module junyou {
	/**
	 * 模块面板的显示状态
	 * @author 
	 *
	 */
	export const enum ModuleShowState {
		/**
		 * 不在舞台上
		 */
		HIDE = 0,
		/**
		 * 正在显示，做Tween中
		 */
		SHOWING = 1,
		/**
		 * 已经显示在舞台上
		 */
		SHOW = 2,
		/**
		 * 正在隐藏
		 */
		HIDING = 3
	}
}
