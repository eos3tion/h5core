module junyou{
    export class ScrollBarCreator extends BaseCreator<ScrollBar>{
        private uiData:any[];
        
        private suiManager:SuiResManager;
        
        public constructor(){
            super();
        }
        
        public parseSelfData(data:any){
            this.uiData = data;
            this.suiManager = singleton(SuiResManager);
            this._createT = this.createScrollBar;
        }
        
        private createScrollBar():ScrollBar{
            let scrollBar:ScrollBar = new ScrollBar();
            let comData = this.uiData;
            // let len = comData.length;
            let tmpData;
            let sourceData = this._suiData.sourceComponentData;
            let index;
            let sourceArr;
            let name;
            
            tmpData = comData[0];
            index = tmpData[2];
            
            sourceArr = sourceData[5];
            name = sourceArr[0][index];
            let sc:ScaleBitmap = <ScaleBitmap>this.suiManager.createDisplayObject(this._suiData.key,name,tmpData[1]);
            
            scrollBar.setBar(sc);
            
            tmpData = comData[1];
            index = tmpData[2];
            
            sourceArr = sourceData[5];
            name = sourceArr[0][index];
            sc = <ScaleBitmap>this.suiManager.createDisplayObject(this._suiData.key,name,tmpData[1]);
            scrollBar.setBg(sc);
            
            return scrollBar;
        }
    }
}