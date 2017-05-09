module junyou {
    /**
     * 有选中状态的控件
     * 
     * @export
     * @interface SelectableComponents
     */
    export interface SelectableComponents extends egret.EventDispatcher {
        selected: boolean;

        view: egret.DisplayObject;

    }
}