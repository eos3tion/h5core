module junyou {

    const enum TouchDownConst {
        /**
         * TouchDown时放大比例
         */
        Scale = 1.1,
        /**
         * 居中后的乘数
         * (Scale-1)*0.5
         */
        Multi = 0.05
    }

    /**
     * 可做TouchDown放大的对象接口
     */
    export interface TouchDownItem extends egret.DisplayObject {
        x: number;
        y: number;
        $_tdi?: TouchDownRaw;
    }

    export interface TouchDownRaw {
        x: number;
        y: number;

        scaleX: number;
        scaleY: number;
        tween: Tween;
    }

    const _$TDOpt = Object.freeze({ int: { x: 1, y: 1 } });
    /**
     * TouchDown显示对象放大效果
     */
    export module TouchDown {

        /**
         * 绑定组件
         * 
         * @param {TouchDownItem} item
         */
        export function bind(item: TouchDownItem) {
            if (item) {
                item.on(EgretEvent.TOUCH_BEGIN, touchBegin);
            }
        }
        /**
         * 解绑组件
         * 
         * @param {TouchDownItem} item
         */
        export function loose(item: TouchDownItem) {
            if (item) {
                item.off(EgretEvent.TOUCH_BEGIN, touchBegin);
                clearEndListener(item);
            }
        }


        function clearEndListener(item: TouchDownItem) {
            item.off(EgretEvent.TOUCH_END, touchEnd);
            item.off(EgretEvent.TOUCH_CANCEL, touchEnd);
            item.off(EgretEvent.TOUCH_RELEASE_OUTSIDE, touchEnd);
            item.off(EgretEvent.REMOVED_FROM_STAGE, touchEnd);
        }

        function touchBegin(e: egret.Event) {
            let target = e.target as TouchDownItem;
            target.on(EgretEvent.TOUCH_END, touchEnd);
            target.on(EgretEvent.TOUCH_CANCEL, touchEnd);
            target.on(EgretEvent.TOUCH_RELEASE_OUTSIDE, touchEnd);
            target.on(EgretEvent.REMOVED_FROM_STAGE, touchEnd);
            let raw = target.$_tdi;
            if (!raw) {
                target.$_tdi = raw = {} as TouchDownRaw;
                raw.x = target.x;
                raw.y = target.y;
                raw.scaleX = target.scaleX;
                raw.scaleY = target.scaleY;
            } else {
                let tween = raw.tween;
                if (tween) {
                    Global.removeTween(tween);
                }
            }

            let tx = raw.x - target.width * TouchDownConst.Multi;
            let ty = raw.y - target.height * TouchDownConst.Multi;
            raw.tween = Global.getTween(target, _$TDOpt).to({ scaleX: TouchDownConst.Scale, scaleY: TouchDownConst.Scale, x: tx, y: ty }, 100, Ease.quadOut);
        }

        function touchEnd(e: egret.Event) {
            let target = e.target;
            clearEndListener(target);
            let raw = target.$_tdi;
            if (raw) {
                let tween = raw.tween;
                if (tween) {
                    Global.removeTween(tween);
                }
                raw.tween = Global.getTween(target, _$TDOpt)
                    .to({ scaleX: raw.scaleX, scaleY: raw.scaleY, x: raw.x, y: raw.y }, 100, Ease.quadOut)
                    .call(endComplete, null, target);
            }
        }

        function endComplete(target: TouchDownItem) {
            target.$_tdi.tween = undefined;
        }
    }
}