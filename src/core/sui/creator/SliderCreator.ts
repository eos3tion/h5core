module junyou{
    export class SliderCreator extends BaseCreator<Slider>{
        
        private uiData:any[];
        
         private txtCreator:TextFieldCreator;
         
         private scale9Creator:ScaleBitmapCreator;
         
         private bitmapCreator:BitmapCreator<egret.Bitmap>;
         
         private suiManager:SuiResManager;
        
        public constructor(){
            super();
        }
        
        public parseSelfData(data:any){
            this.uiData = data;
            this.txtCreator = new TextFieldCreator();
            this.scale9Creator = new ScaleBitmapCreator();
            this.bitmapCreator = new BitmapCreator(this._suiData);
            this.suiManager = singleton(SuiResManager);
            this._createT = this.createSlider;
        }
        
        
        private createSlider():Slider{
            let slider:Slider = new Slider();
            let comData = this.uiData;
            let len = comData.length;
            let tmpData;
            let type;
            let sourceData = this._suiData.sourceComponentData;
            let index;
            let sourceArr;
            let name;
            
            for(let i=0;i<len;i++){
                tmpData = comData[i];
                type = tmpData[0];
                index = tmpData[2];
                
                if(type == 0){
                    this.bitmapCreator.parseSelfData(index);
                    let bmp:egret.Bitmap = <egret.Bitmap>this.bitmapCreator.getInstance();
                    slider.setThumb(bmp);
    
                }
                else if(type == 5){
                    sourceArr = sourceData[type]
                    name = sourceArr[0][index];
                    let sc:ScaleBitmap = <ScaleBitmap>this.suiManager.createDisplayObject(this._suiData.key,name,tmpData[1]);
                    slider.setBg(sc);
                }
            }

            return slider;
        }
    }
}