module junyou {
    export class NumericStepper extends Component {

        public minBtn: Button;

        public subBtn: Button;

        public addBtn: Button;

        public maxBtn: Button;

        public txtbg: ScaleBitmap;

        public txt: egret.TextField;

        private _value: number;

        private _width: number;

        private _minValue: number = 1;

        private _maxValue: number;

        public constructor() {
            super();
        }

        public addSubComponents() {
            this.addChild(this.txtbg);

            this.addChild(this.subBtn);
            this.addChild(this.addBtn);
            this.subBtn.enabled = true;
            this.addBtn.enabled = true;
            this.subBtn.bindTouch(this.subValue, this);
            this.addBtn.bindTouch(this.addValue, this);

            this.addChild(this.txt);

            if (this.minBtn) {
                this.addChild(this.minBtn);
                this.minBtn.enabled = true;
                this.minBtn.bindTouch(this.setMinValue, this);
            }

            if (this.maxBtn) {
                this.addChild(this.maxBtn);
                this.maxBtn.enabled = true;
                this.maxBtn.bindTouch(this.setMaxValue, this);
                this._width = this.maxBtn.width + this.maxBtn.x;
            }
            else {
                this._width = this.addBtn.width + this.addBtn.x;
            }

        }

        public set width(value: number) {
            if (this._width == value) return;
            let sub: number = value - this._width;
            this.txt.width += sub;
            this.txtbg.width += sub;
            this.addBtn.x += sub;
            if (this.maxBtn)
                this.maxBtn.x += sub;
            this._width = value;
        }

        public get width(): number {
            return this._width;
        }

        private setMinValue(e: egret.TouchEvent) {
            if (this._minValue)
                this.value = this._minValue;
        }

        private addValue(e: egret.TouchEvent) {
            if (this.value < this._maxValue) {
                this.value += 1;
            }
        }

        private subValue(e: egret.TouchEvent) {
            if (this.value > this._minValue) {
                this.value -= 1;
            }
        }

        private setMaxValue(e: egret.TouchEvent) {
            if (this._maxValue)
                this.value = this._maxValue;
        }

        public set value(val: number) {
            if (this._value != val) {
                this._value = val;
                this.txt.text = val + "";
                this.dispatch(EventConst.VALUE_CHANGE);
            }
        }

        public get value(): number {
            return this._value;
        }

        /*设置最小值*/
        public set minValue(value: number) {
            if (value)
                this._minValue = value;
            else
                ThrowError("最小值需大于0");
        }

        public get minValue(): number {
            return this._minValue;
        }

        /*设置最大值*/
        public set maxValue(value: number) {
            if (value)
                this._maxValue = value;
            else
                ThrowError("最大值需大于0");
        }

        public get maxValue(): number {
            return this._maxValue;
        }
    }
}