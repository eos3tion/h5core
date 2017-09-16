module junyou {

    /**
     * @ author gushuai
     * 
     * @export
     * @class MessageRender
     * @extends {egret.Sprite}
     */
    export class MessageRender extends egret.Sprite {

        public static CHECK_NEXT: string = "CHECK_NEXT";

        public static CHECK_END: string = "CHECK_END";

        public index: number;

        private _txtField: egret.TextField;

        private _txtField2: egret.TextField;

        private bg: egret.Sprite;

        private con: egret.Sprite;

        private msk: egret.Sprite;

        private currentTextField: egret.TextField;
        private otherTextField: egret.TextField;

        public isrunning: boolean = false;

        private _checkDispatched: boolean = false;

        private _checkPos: number;

        private _txtStartPos: number;

        private speed: number = 2;

        public cantick: boolean;

        private _contentSize: egret.Rectangle;

        public constructor() {
            super();
            this.initTxt();
        }

        private initTxt() {
            this.bg = new egret.Sprite();
            this.addChild(this.bg);

            this.con = new egret.Sprite();
            this.addChild(this.con);

            this.msk = new egret.Sprite();
            this.addChild(this.msk);
            this.con.mask = this.msk;


            this._txtField = new egret.TextField();
            this.con.addChild(this._txtField);
            this._txtField2 = new egret.TextField();
            this.con.addChild(this._txtField2);
            this.on(EgretEvent.ADDED_TO_STAGE, this.addToStage, this);
        }

        private addToStage(e: egret.Event) {
            this.cantick = true;
        }

        /**
         * 消息样式
         * 
         * @ param {MessageRenderStyle} style
         */
        public setStyles(style: MessageRenderStyle) {
            let bg = style.bg;
            let contentSize = style.contentSize;
            let speed = style.speed;
            let fontSize = style.fontSize;
            let fontColor = style.fontColor;
            let endpad = style.endpad;
            if (bg) {
                this.bg.addChild(bg);
                let bgsize = style.bgSize;
                if (bgsize) {
                    bg.width = bgsize.width;
                    bg.height = bgsize.height;
                }
            }

            this.con.x = contentSize.x;
            this.con.y = contentSize.y;
            this.msk.x = contentSize.x;
            this.msk.y = contentSize.y;

            this.msk.graphics.beginFill(0);
            this.msk.graphics.drawRect(0, 0, contentSize.width, contentSize.height);
            this.msk.graphics.endFill();

            this._txtField.textColor = this._txtField2.textColor = fontColor;
            this._txtField.size = this._txtField2.size = fontSize;
            this._txtField.height = this._txtField2.height = contentSize.height;
            this._txtField.y = this._txtField2.y = contentSize.y;

            this._txtStartPos = contentSize.width + 1;
            this._txtField.x = this._txtField2.x = this._txtStartPos;

            this._checkPos = contentSize.width - endpad;


            if (speed > 0) {
                this.speed = speed;
            }
            this._contentSize = contentSize;
        }

        public get height() {
            return this._contentSize.height + this._contentSize.y * 2;
        }


        /**
         * 显示消息内容
         * 
         * @param {string} msg (description)
         */
        public showMsg(msg: string) {
            if (!this.currentTextField) {
                this.currentTextField = this._txtField;
            } else {
                if (this.currentTextField == this._txtField) {
                    this.currentTextField = this._txtField2;
                    this.otherTextField = this._txtField;
                } else {
                    this.currentTextField = this._txtField;
                    this.otherTextField = this._txtField2;
                }
            }
            this._checkDispatched = false;
            this.currentTextField.text = msg;
        }

        /**
         * 如果存在一个render显示多个消息的情况，那么这个方法就是检测该render是否可以显示第二条消息了
         * 
         * @returns (description)
         */
        public checkShow() {
            let pos = this.currentTextField.x + this.currentTextField.width;
            if (pos < this._checkPos) {
                return true;
            }
            return false;
        }


        public tick() {
            let currentTextField = this.currentTextField;
            if (currentTextField && (currentTextField.x + currentTextField.width < 0)) {
                currentTextField.text = "";
                currentTextField.x = this._txtStartPos;
                currentTextField = undefined;
                this.isrunning = false;
                this.cantick = false;
                //当前的出了可视范围
                //而且还没有第2条消息，就表示这个render可以停了，并且抛个事件，通知检测其他的render 
                this.dispatch(EventConst.MsgRenderCheckEnd);
                // console.log(this.index);
                return;
            }
            if (currentTextField && ((currentTextField.x + currentTextField.width) < this._checkPos)) {
                if (!this._checkDispatched) {
                    this._checkDispatched = true;
                    this.dispatch(EventConst.MsgRenderCheckNext);
                }
            }
            let otherTextField = this.otherTextField;
            if (otherTextField) {
                //出了可视范围
                if (otherTextField.x + otherTextField.width < 0) {
                    otherTextField.x = this._txtStartPos;
                    otherTextField.text = "";
                    this.otherTextField = undefined;
                } else {
                    otherTextField.x -= this.speed;
                }
            }
            this.currentTextField.x -= this.speed;
            this.isrunning = true;
        }
    }
}