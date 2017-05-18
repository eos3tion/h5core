module junyou {
    /**
     * 某个状态
     * @author 3tion
     */
	export interface IStateSwitcher {
		/**
		 * 被一个状态禁止了
		 * 
		 * @param {Key} [type] 
		 * 
		 * @memberof IStateSwitcher
		 */
		sleepBy(type?: Key);

		/**
		 * 被一个状态开启了
		 * 
		 * @param {Key} [type] 
		 * 
		 * @memberof IStateSwitcher
		 */
		awakeBy(type?: Key);
	}
}