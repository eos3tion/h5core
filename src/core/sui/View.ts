namespace jy {
    export class View extends egret.Sprite {
        public constructor(key: string, className: string) {
            super();
            this.suiClass = className;
            this.suiLib = key;
            singleton(SuiResManager).createComponents(key, className, this);
        }
    }

    export interface View extends ComponentWithEnable { };

    addEnable(View);
}