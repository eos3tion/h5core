namespace jy {

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

        public bindChildren() {
            let { txtbg, subBtn, addBtn, txt } = this;
            this.addChild(txtbg);

            this.addChild(subBtn);
            this.addChild(addBtn);
            subBtn.enabled = true;
            addBtn.enabled = true;
            subBtn.bindTouch(this.subValue, this);
            addBtn.bindTouch(this.addValue, this);

            this.addChild(txt);

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

    export class NumericStepperCreator extends BaseCreator<NumericStepper>{

        private uiData: any[];

        private txtCreator: TextFieldCreator;

        private btnCreator: ButtonCreator[];

        private scale9Creator: ScaleBitmapCreator;

        private suiManager: SuiResManager;
        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            this.uiData = data;
            let txtCreator = new TextFieldCreator();
            this.txtCreator = txtCreator;
            let [data0, data1] = data;
            txtCreator.setBaseData(data0[1]);
            txtCreator.parseSelfData(data0[2]);
            let scale9Creator = new ScaleBitmapCreator();
            this.scale9Creator = scale9Creator;
            let _suiData = this._suiData;
            let sourceComponentData = _suiData.sourceComponentData;
            scale9Creator.bindSuiData(_suiData);
            scale9Creator.parseSelfData(sourceComponentData[5][1][data1[2]]);
            scale9Creator.setBaseData(data1[1]);
            let btnCreator = [] as ButtonCreator[];
            this.btnCreator = btnCreator;
            let sourceComponentData31 = sourceComponentData[3][1];
            for (let i = 2; i < data.length; i++) {
                let dat: any = data[i];
                if (dat) {
                    let bc: ButtonCreator = new ButtonCreator();
                    bc.bindSuiData(_suiData);
                    bc.parseSelfData(sourceComponentData31[dat[2]]);
                    bc.setBaseData(dat[1]);
                    btnCreator.push(bc);
                }
            }
            this._createT = this.createNumericStepper;
            this.suiManager = singleton(SuiResManager);
        }

        private createNumericStepper(): NumericStepper {
            let numstep: NumericStepper = new NumericStepper();

            numstep.txt = this.txtCreator.get();
            numstep.txtbg = this.scale9Creator.get();
            let btnCreator = this.btnCreator;
            let len = btnCreator.length;
            if (len >= 3) {
                //4个按钮
                numstep.minBtn = btnCreator[0].get();
                numstep.subBtn = btnCreator[1].get();
                numstep.addBtn = btnCreator[2].get();
                numstep.maxBtn = btnCreator[3].get();
            } else {
                //2个按钮
                numstep.subBtn = btnCreator[0].get();
                numstep.addBtn = btnCreator[1].get();
            }
            numstep.bindChildren();
            return numstep;
        }

    }
}