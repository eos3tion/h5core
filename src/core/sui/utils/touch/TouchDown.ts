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
        const _$TDOpt = Object.freeze({ int: { x: 1, y: 1 } });
        return {
            /**
             * 绑定组件
             * 
             * @param {TouchDownItem} item
             */
            bindItem(item: TouchDownItem) {
                if (item) {
                    item.on(EgretEvent.TOUCH_BEGIN, touchBegin);
                }
            },

            /**
             * 解绑组件
             * 
             * @param {TouchDownItem} item
             */
            looseItem(item: TouchDownItem) {
                if (item) {
                    item.off(EgretEvent.TOUCH_BEGIN, touchBegin);
                    clearEndListener(item);
                }
            }
        }

        function clearEndListener(item: TouchDownItem) {
            item.off(EgretEvent.TOUCH_END, touchEnd);
            item.off(EgretEvent.TOUCH_CANCEL, touchEnd);
            item.off(EgretEvent.TOUCH_RELEASE_OUTSIDE, touchEnd);
            item.off(EgretEvent.REMOVED_FROM_STAGE, touchEnd);
        }

        function touchBegin(e: egret.Event) {
            let target = e.target;
            target.on(EgretEvent.TOUCH_END, touchEnd);
            target.on(EgretEvent.TOUCH_CANCEL, touchEnd);
            target.on(EgretEvent.TOUCH_RELEASE_OUTSIDE, touchEnd);
            target.on(EgretEvent.REMOVED_FROM_STAGE, touchEnd);
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