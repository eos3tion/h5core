module junyou {
    const _$TDOpt = { int: { x: 1, y: 1 } };
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
    import TE = egret.TouchEvent;
    import E = egret.Event;
    /**
     * TouchDown显示对象放大效果
     * description
     * @author pb
     */
    export class TouchDown extends egret.EventDispatcher {

        constructor() {
            super();
        }

        /**
         * 绑定组件
         * 
         * @param {TouchDownItem} item
         */
        public static bindItem(item: TouchDownItem) {
            if (item) {
                item.on(TE.TOUCH_BEGIN, this.touchBegin, this);
            }
        }

        /**
         * 解绑组件
         * 
         * @param {TouchDownItem} item
         */
        public static looseItem(item: TouchDownItem) {
            if (item) {
                item.off(TE.TOUCH_BEGIN, this.touchBegin, this);
                this.clearEndListener(item);
            }
        }

        private static clearEndListener(item: TouchDownItem) {
            item.off(TE.TOUCH_END, this.touchEnd, this);
            item.off(TE.TOUCH_CANCEL, this.touchEnd, this);
            item.off(TE.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
            item.off(E.REMOVED_FROM_STAGE, this.touchEnd, this);
        }

        private static touchBegin(e: TE) {
            let target = e.target;
            target.on(TE.TOUCH_END, this.touchEnd, this);
            target.on(TE.TOUCH_CANCEL, this.touchEnd, this);
            target.on(TE.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
            target.on(E.REMOVED_FROM_STAGE, this.touchEnd, this);
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

        private static touchEnd(e: E) {
            let target = e.target;
            this.clearEndListener(target);
            let raw = target.$_tdi;
            if (raw) {
                let tween = Global.getTween(target, _$TDOpt, null, true);
                raw.tween = tween;
                tween.to({ scaleX: 1, scaleY: 1, x: raw.x, y: raw.y }, 100, Ease.quadOut).call(this.endComplete, this, target);
            }
        }

        private static endComplete(target: TouchDownItem) {
            delete target.$_tdi;
        }
    }
}