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
            this.txtCreator = new TextFieldCreator();
            this.txtCreator.setBaseData(data[0][1]);
            this.txtCreator.parseSelfData(data[0][2]);
            this.scale9Creator = new ScaleBitmapCreator();
            this.scale9Creator.bindSuiData(this._suiData);
            this.scale9Creator.parseSelfData(this._suiData.sourceComponentData[5][1][data[1][2]]);
            this.scale9Creator.setBaseData(data[1][1]);
            this.btnCreator = [];
            for(let i=2;i<data.length;i++){
                let dat:any = data[i];
                if(dat){
                    let bc:ButtonCreator = new ButtonCreator();
                    bc.bindSuiData(this._suiData);
                    bc.parseSelfData(this._suiData.sourceComponentData[3][1][data[i][2]]);
                    bc.setBaseData(dat[1]);
                    this.btnCreator.push(bc);
                }
            }
            this._createT = this.createNumericStepper;
            this.suiManager = singleton(SuiResManager);
        }

        private createNumericStepper(): NumericStepper {
            let numstep: NumericStepper = new NumericStepper();

            numstep.txt = this.txtCreator.getInstance();
            numstep.txtbg = this.scale9Creator.getInstance();

            let len = this.btnCreator.length;
            if(len>=3){
                //4个按钮
                numstep.minBtn = this.btnCreator[0].getInstance();
                numstep.subBtn = this.btnCreator[1].getInstance();
                numstep.addBtn = this.btnCreator[2].getInstance();
                numstep.maxBtn = this.btnCreator[3].getInstance();
            }else{
                //2个按钮
                numstep.subBtn = this.btnCreator[0].getInstance();
                numstep.addBtn = this.btnCreator[1].getInstance();
            }
            numstep.addSubComponents();

            numstep.addSubComponents();
            return numstep;
        }

    }
}