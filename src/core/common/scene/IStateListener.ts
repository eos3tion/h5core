namespace jy {
    /**
     * 状态机监听器
     * @author 3tion
     */
    export interface IStateListener {
        setState(type: Key);
    }
}