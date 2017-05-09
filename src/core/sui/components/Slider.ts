module junyou {
    export class Slider extends Component {

        private _width: number;

        private _height: number;

        private _value: number;

        /***滑块 */
        public thumb: egret.Sprite;
        /****底 */
        public bgline: egret.Sprite;

        private _bgBmp: ScaleBitmap;

        private tipTxt: egret.TextField;

        private _lastThumbX: number;

        private _maxVlaue: number;

        private _minValue: number;

        private _step: number;

        /**每步step需要的像素 */
        private _perStepPixel: number;

        private _halfThumbWidth: number;
        /*使不使用底条点击直接设值 */
        private _barEnabled: boolean;


        public constructor() {
            super();
            this.initBaseContainer();
            this.touchChildren = this.touchEnabled = true;
            this.thumb.touchEnabled = true;
            this.bgline.touchEnabled = true;
            this.addListener();
        }

        private addListener() {
            this.thumb.on(egret.TouchEvent.TOUCH_BEGIN, this.onThumbBegin, this);
            this.on(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private onAddToStage(e: egret.Event) {
            if (this._barEnabled) {
                this.stage.on(egret.TouchEvent.TOUCH_END, this.bgOut, this);
            }
        }
        /*使不使用底条点击直接设值 */
        public set barEnabled(value: boolean) {
            this._barEnabled = value;
            if (value) {
                this.bgline.on(egret.TouchEvent.TOUCH_BEGIN, this.bgClick, this);
                if (this.stage) {
                    this.stage.on(egret.TouchEvent.TOUCH_END, this.bgOut, this);
                }

            }
            else {
                this.bgline.off(egret.TouchEvent.TOUCH_BEGIN, this.bgClick, this);
                if (this.stage) {
                    this.bgline.off(egret.TouchEvent.TOUCH_END, this.bgOut, this);
                }

            }
        }

        private bgClick(e: egret.TouchEvent) {
            this._lastThumbX = this.thumb.localToGlobal().x;
            let currentX: number = e.stageX;
            this.tipTxt.visible = true;
            this.calculatevalue(currentX);
            this.tipTxt.text = this.value.toString();
        }

        private bgOut(e: egret.TouchEvent) {
            this.tipTxt.visible = false;
        }

        private onThumbBegin(e: egret.TouchEvent) {
            this._lastThumbX = this.thumb.localToGlobal().x;
            this.stage.on(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this)
            this.thumb.on(egret.TouchEvent.TOUCH_END, this.onThumbEnd, this);
            this.thumb.on(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onThumbEnd, this);
            this.tipTxt.visible = true;
        }



        private onThumbEnd(e: egret.TouchEvent) {
            this.stage.off(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            this.thumb.off(egret.TouchEvent.TOUCH_END, this.onThumbEnd, this);
            this.thumb.off(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onThumbEnd, this);
        }

        private mouseMove(e: egret.TouchEvent) {

            let currentX: number = e.stageX;

            this.calculatevalue(currentX);

            this.tipTxt.text = this.value.toString();
        }

        private calculatevalue(currentX: number) {
            let sub = currentX - this._lastThumbX;
            let steps: number;
            let value: number;
            if (Math.abs(sub) >= this._perStepPixel) {
                steps = sub / this._perStepPixel;
                steps = Math.round(steps);
                value = this.value + steps * this._step;
                if (value <= this._minValue) {
                    value = this._minValue;
                }
                if (value >= this._maxVlaue) {
                    value = this._maxVlaue;
                }

                this.value = value;
                this._lastThumbX = this.thumb.localToGlobal().x;

                this.tipTxt.x = this.thumb.x + this._halfThumbWidth - 40;
            }
        }

        private initBaseContainer() {
            this.thumb = new egret.Sprite();
            this.bgline = new egret.Sprite();
            this.addChild(this.bgline);
            this.addChild(this.thumb);
            this.tipTxt = new egret.TextField();
            this.tipTxt.y = -12;
            this.tipTxt.textAlign = egret.HorizontalAlign.CENTER;
            this.tipTxt.width = 80;
            this.tipTxt.size = 12;
            this.tipTxt.bold = false;
            this.addChild(this.tipTxt);
        }

        /**
         * 设置底条新式
         * 
         * @param {ScaleBitmap} bg (description)
         */
        public setBg(bg: ScaleBitmap) {
            this._bgBmp = bg;
            this.bgline.addChild(bg);
            this._width = bg.width;
        }

        /**
         * 设置滑块样式
         * 
         * @param {egret.Bitmap} tb (description)
         */
        public setThumb(tb: egret.Bitmap) {
            this.thumb.x = tb.x;
            this.thumb.y = tb.y;
            tb.x = tb.y = 0;
            this.thumb.addChild(tb);
            this._halfThumbWidth = tb.width * 0.5;
        }

        public set value(val: number) {
            if (this._value == val) return;
            this._value = val;
            this.dispatch(EventConst.VALUE_CHANGE);
            this.thumb.x = ((val - this._minValue) / this._step) * this._perStepPixel - this._halfThumbWidth;
        }

        public get value(): number {
            return this._value;
        }

        /**
         * 设置底条宽度
         */
        public set width(value: number) {
            if (this._width == value) return;
            this._width = value;
            if (this._bgBmp) {
                this._bgBmp.width = value;
            }
        }

        /**
         * 设置底条高度
         */
        public set height(value: number) {
            if (this._height == value) return;
            this._height = value;
            if (this._bgBmp) {
                this._bgBmp.height = value;
            }
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        public set maxVlaue(value: number) {
            this._maxVlaue = value;
            this.checkStepPixel();
        }

        public set minValue(value: number) {
            this._minValue = value;
            this.checkStepPixel();
        }

        /**
         * 滑块移动一个单位的值
         */
        public set step(value: number) {
            this._step = value;
            this.checkStepPixel();
        }

        private checkStepPixel() {
            this._perStepPixel = this.bgline.width / ((this._maxVlaue - this._minValue) / this._step);
        }
    }
}