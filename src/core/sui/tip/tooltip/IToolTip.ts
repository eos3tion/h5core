module junyou {
    /**
     * ToolTip的皮肤
     * @author 3tion
     */
    export interface IToolTip {

        /**
         * 设置Tip数据
         * 
         * @param {*} value 数据内容
         */
        setTipData(value: any): void;

        /**
         * 显示
         */
        show(container: egret.DisplayObjectContainer, x?: number, y?: number): void;

        /**
         * 隐藏
         */
        hide(): void;
    }
}