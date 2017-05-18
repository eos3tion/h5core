module junyou {
    /**
     * 状态限制器
     * @author 3tion
     */
    export interface ILimit {
        setState(type: Key)
		/**
		 * 检查内容是否被禁止了; 
		 * @param type
		 * @return 
		 * 
		 */
        check(value: Key): boolean;
    }
}