module junyou {

    export const enum TouchDownConst {
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
     * TouchDown显示对象放大效果
     * description
     * @author pb
     */
    export const TouchDown = (function () {
        const _$TDOpt = { int: { x: 1, y: 1 } };
        const TE = egret.TouchEvent;
        const E = egret.Event.REMOVED_FROM_STAGE;
        const TEB = TE.TOUCH_BEGIN;
        const TEE = TE.TOUCH_END;
        const TEO = TE.TOUCH_RELEASE_OUTSIDE;
        const TEC = TE.TOUCH_CANCEL;
        return {
            /**
             * 绑定组件
             * 
             * @param {TouchDownItem} item
             */
            bindItem(item: TouchDownItem) {
                if (item) {
                    item.on(TEB, touchBegin);
                }
            },

            /**
             * 解绑组件
             * 
             * @param {TouchDownItem} item
             */
            looseItem(item: TouchDownItem) {
                if (item) {
                    item.off(TEB, touchBegin);
                    clearEndListener(item);
                }
            }
        }

        function clearEndListener(item: TouchDownItem) {
            item.off(TEE, touchEnd);
            item.off(TEC, touchEnd);
            item.off(TEO, touchEnd);
            item.off(E, touchEnd);
        }

        function touchBegin(e: egret.Event) {
            let target = e.target;
            target.on(TEE, touchEnd);
            target.on(TEC, touchEnd);
            target.on(TEO, touchEnd);
            target.on(E, touchEnd);
            let raw = target.$_tdi;
            if (!raw) {
                target.$_tdi = raw = <TouchDownRaw>{};
                raw.x = target.x;
                raw.y = target.y;
            } else if (raw.tween) {
                Global.removeTween(raw.tween);
            }
            let tween = Global.getTween(target, _$TDOpt);
            raw.tween = tween;
            let tx = raw.x - target.width * TouchDownConst.Multi;
            let ty = raw.y - target.height * TouchDownConst.Multi;
            tween.to({ scaleX: TouchDownConst.Scale, scaleY: TouchDownConst.Scale, x: tx, y: ty }, 100, Ease.quadOut);
        }

        function touchEnd(e: egret.Event) {
            let target = e.target;
            clearEndListener(target);
            let raw = target.$_tdi;
            if (raw) {
                let tween = Global.getTween(target, _$TDOpt, null, true);
                raw.tween = tween;
                tween.to({ scaleX: 1, scaleY: 1, x: raw.x, y: raw.y }, 100, Ease.quadOut).call(endComplete, null, target);
            }
        }

        function endComplete(target: TouchDownItem) {
            delete target.$_tdi;
        }
    })()
}