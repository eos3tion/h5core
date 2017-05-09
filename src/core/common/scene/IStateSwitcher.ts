module junyou {
    /**
     * description
     * @author pb
     */
	export interface IStateSwitcher {
        /**
		 * 被一个状态禁止了
		 * @param type
		 * 
		 */
		sleepBy(type: number);

		/**
		 * 被一个状态开启了
		 * @param type
		 * 
		 */
		awakeBy(type: number);
	}
}