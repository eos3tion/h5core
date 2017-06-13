module junyou {
    /**
     * 可做TouchDown放大的对象接口
     * description
     * @author pb
     */
    export interface TouchDownItem extends egret.EventDispatcher {
        x: number;
        y: number;
        $_tdi?: TouchDownRaw;
    }

    export interface TouchDownRaw {
        x: number;
        y: number;
        tween: Tween;
    }
}