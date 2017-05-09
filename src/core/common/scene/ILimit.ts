module junyou {
    /**
     * description
     * @author pb
     */
    export interface ILimit {
        setState(type: number)
		/**
		 * 检查内容是否被禁止了; 
		 * @param type
		 * @return 
		 * 
		 */
        check(value: number): boolean;
    }
}