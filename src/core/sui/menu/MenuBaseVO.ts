module junyou {

    /**
     * @author gushuai
     * (description)
     * 
     * @export
     * @interface MenuBaseVO
     */
    export interface MenuBaseVO {

        label: string;

        /**
         * 在操作菜单具体子项按钮时回调
         */
        callBack: { <T extends MenuBaseVO>(this: SelectableComponents, vo: T) };
    }
}