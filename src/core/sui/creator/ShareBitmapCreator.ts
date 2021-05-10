namespace jy {
    export class ShareBitmapCreator extends BitmapCreator {

        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            super.parseSelfData(data[0][2]);
        }
    }
}