namespace jy {
    /**
     * 简易的ToolTip
     * 只处理字符串类型的描述
     * @author 3tion
     */
    export class SimToolTip extends egret.Sprite implements IToolTip {

        private tf: egret.TextField;
        private _autoSize: boolean;
        private _corner: number;

        constructor(maxWidth = 480, maxHeight = 800, corner = 5, autoSize?: boolean) {
            super();
            this._autoSize = autoSize;
            this._corner = corner;
            this.init(maxWidth, maxHeight, corner);
        }

        private init(maxWidth: number, maxHeight: number, corner: number) {
            let tf: egret.TextField;
            this.tf = tf = new egret.TextField();
            let c2 = corner * 2;
            tf.width = maxWidth - c2;
            tf.height = maxHeight - c2;
            tf.size = 12;
            tf.x = corner;
            tf.y = corner;
            this.addChild(tf, false);
            this.drawRect(0, 0, maxWidth, maxHeight);
        }

        setTipData(msg: string) {
            let tf = this.tf;
            if (msg != tf.text) {
                tf.text = msg;
                if (this._autoSize) {
                    let c2 = this._corner * 2;
                    let bgW = tf.textWidth + 2 * c2;
                    let bgH = tf.textHeight + 2 * c2;
                    this.drawRect(0, 0, bgW, bgH);
                }
            }
        }

        private drawRect(x: number, y: number, width: number, height: number) {
            let g = this.graphics;
            g.clear();
            g.lineStyle(1, 0xcccccc);
            g.beginFill(0, 0.7);
            g.drawRoundRect(x, y, width, height, this._corner);
            g.endFill();
        }



        show(container: egret.DisplayObjectContainer, x?: number, y?: number) {
            if (x != undefined && y != undefined) {
                container.addChild(this, false);
                this.x = x;
                this.y = y;
            }
        }

        hide() {
            removeDisplay(this);
        }
    }
}