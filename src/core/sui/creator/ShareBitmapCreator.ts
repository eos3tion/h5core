module junyou {
    export class ShareBitmapCreator extends BitmapCreator<egret.Bitmap>{

        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            super.parseSelfData(data[0][2]);
        }
    }
}