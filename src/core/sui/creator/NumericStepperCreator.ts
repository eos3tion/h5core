module junyou {
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
            numstep.addSubComponents();
            return numstep;
        }

    }
}