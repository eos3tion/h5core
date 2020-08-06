namespace jy {
    /**
     * description
     * @author pb
     */
    export interface IGroupItem extends egret.EventDispatcher {

        /**
         * 是否选中
         * 
         * @type {boolean}
         */
        selected: boolean;

        /**
         * 是否不可被选中
         */
        unelectable?: boolean;
    }
}