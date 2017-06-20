module junyou {

    /**
     * 绑定按钮和文本框，让文本框的点击，可以触发按钮的选中事件
     * 
     * @export
     */
    export var GroupItemButton = (function () {
        const TE = egret.TouchEvent.TOUCH_TAP;
        const ButtonKey = "$gib$btn";
        const TextFieldKey = "$gib$txt";
        return {
            /**
             * 
             * 绑定按钮和文本框
             * @param {Button} btn 
             * @param {egret.TextField} txt 
             */
            bind(btn: Button, txt: egret.TextField) {
                if (!txt[ButtonKey]) {
                    txt[ButtonKey] = btn;
                } else if (DEBUG) {
                    ThrowError(`重复绑定了文本框和按钮`)
                }
                txt.on(TE, onTE);
                let old = btn[TextFieldKey] as egret.TextField;
                if (old) {
                    if (old[ButtonKey] == btn) {
                        delete old[ButtonKey];
                        old.off(TE, onTE);
                    }
                }
                btn[TextFieldKey] = txt;
            },
            /**
             * 接触按钮和文本框的绑定
             * 
             * @param {Button} btn 
             */
            loose(btn: Button) {
                let txt = btn[TextFieldKey];
                if (txt) {
                    delete btn[TextFieldKey];
                    if (txt[ButtonKey] == btn) {
                        delete txt[ButtonKey];
                        txt.off(TE, onTE);
                    }
                }
            }
        }

        function onTE(e: egret.TouchEvent) {
            let txt = e.currentTarget;
            let btn = txt[ButtonKey] as Button;
            btn.dispatchEvent(e);
        }
    })
}