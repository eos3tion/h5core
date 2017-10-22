module junyou {
    /**
     * 状态机的状态实现
     * @author 3tion
     */
	export interface IStateSwitcher {
		/**
		 * 
		 * 在上一个状态sleep之前调用
		 * @param {Key} [type] 
		 * @memberof IStateSwitcher
		 */
		beforeLastSleep?(type?: Key);
		/**
		 * 被一个状态禁止了
		 * 
		 * @param {Key} [type] 
		 * 
		 * @memberof IStateSwitcher
		 */
		sleepBy?(type?: Key);

		/**
		 * 被一个状态开启了
		 * 
		 * @param {Key} [type] 
		 * 
		 * @memberof IStateSwitcher
		 */
		awakeBy?(type?: Key);
	}
}