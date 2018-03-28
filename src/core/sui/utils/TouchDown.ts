module junyou {

    const enum TouchDownConst {
        /**
         * TouchDown时放大比例
         */
        Scale = 1.125,
        /**
         * 居中后的乘数
         * (Scale-1)*0.5
         */
        Multi = (Scale - 1) * 0.5
    }

    /**
     * 可做TouchDown放大的对象接口
     */
    export interface TouchDownItem extends egret.DisplayObject {
        $_tdi?: TouchDownData;
    }

    export interface TouchDownBin {
        x: number;
        y: number;

        scaleX: number;
        scaleY: number;
    }

    export interface TouchDownData {

        raw: TouchDownBin;

        end: TouchDownBin;

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
            let data = target.$_tdi;
            if (!data) {
                target.$_tdi = data = {} as TouchDownData;
                let { x, y, scaleX, scaleY, width, height } = target;
                data.raw = { x, y, scaleX, scaleY };
                data.end = { x: x - width * TouchDownConst.Multi, y: y - height * TouchDownConst.Multi, scaleX: TouchDownConst.Scale * scaleX, scaleY: TouchDownConst.Scale * scaleY }

            } else {
                let tween = data.tween;
                if (tween) {
                    Global.removeTween(tween);
                }
            }
            data.tween = Global.getTween(target, _$TDOpt).to(data.end, 100, Ease.quadOut);
        }

        function touchEnd(e: egret.Event) {
            let target = e.target as TouchDownItem;
            clearEndListener(target);
            let raw = target.$_tdi;
            if (raw) {
                let tween = raw.tween;
                if (tween) {
                    Global.removeTween(tween);
                }
                raw.tween = Global.getTween(target, _$TDOpt)
                    .to(raw.raw, 100, Ease.quadOut)
                    .call(endComplete, null, target);
            }
        }

        function endComplete(target: TouchDownItem) {
            target.$_tdi.tween = undefined;
        }
    }
}