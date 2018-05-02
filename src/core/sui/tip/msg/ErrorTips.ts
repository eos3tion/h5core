namespace jy {
    /**
     * 错误提示
     * @author pb
     */
    export class ErrorTips {

        _parent: egret.DisplayObjectContainer;

        constructor(parent: egret.DisplayObjectContainer) {
            this._parent = parent;
        }

        public show(msg: string, color = 0xffffff, duration = 1000, delay = 1000) {
            let txt = new egret.TextField();
            txt.textAlign = egret.HorizontalAlign.CENTER;
            if (/<[^>]+>/.test(msg)) {
                txt.setHtmlText(msg);
            } else {
                txt.text = msg;
            }
            txt.alpha = 1;
            Layout.layout(txt, LayoutType.MIDDLE_CENTER);
            txt.textColor = color;
            this._parent.addChild(txt);
            let tween = Global.getTween(txt);
            tween.to({ y: txt.y - 100 }, duration).to({ alpha: 0 }, delay).call(this.txtComplete, this, [tween, txt]);
        }

        txtComplete(arg) {
            let tween = arg[0];
            let txt = arg[1];
            if (tween) {
                tween.paused = true;
                tween.onRecycle();
            }
            if (txt)
                removeDisplay(txt);
        }
    }
}