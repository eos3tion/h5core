module junyou {
    /**
     * 艺术字
     */
    export class ArtText extends Component {

        public suiData: SuiData;

        private _align: number;

        /**
       * 上一次元件的宽度
       */
        private _lastWidth: number = 0;

        public textures: { [index: string]: egret.Texture }

        protected _value: string | number;

        protected _hgap: number = 0;

        private artwidth: number;
        public constructor() {
            super();
        }

        public refreshBMD(): void {
            for (let bmp of <egret.Bitmap[]>this.$children) {
                bmp.refreshBMD();
            }
        }

        public set align(value: number) {
            if (this._align != value) {
                this._align = value;
                this.checkAlign();
            }
        }

        public set hgap(value: number) {
            this._hgap = value;
        }

        protected setValue(val: string | number) {
            if (this._value == val) return;
            if (!val) return;
            this._value = val;
            let tempval = val + "";
            let len = tempval.length;
            let key: string;
            let txs = this.textures;
            let children = this.$children;
            let numChildren = this.numChildren;
            let bmp: egret.Bitmap;
            let ox = 0;
            for (var i = 0; i < len; i++) {
                key = tempval.charAt(i);
                if (i < numChildren) {
                    bmp = <egret.Bitmap>children[i];
                } else {
                    bmp = new egret.Bitmap();
                    this.addChild(bmp);
                }
                let tx = txs[key];
                bmp.x = ox;
                bmp.y = 0;
                bmp.texture = null;
                bmp.texture = tx;
                ox += tx.textureWidth + this._hgap * (i + 1);
            }
            this.artwidth = bmp.x + bmp.width;
            for (i = numChildren - 1; i >= len; i--) {
                this.$doRemoveChild(i);
            }
            this.checkAlign();
        }

        public set value(val: string | number) {
            this.setValue(val);
        }



        public get value(): string | number {
            return this._value;
        }

        $getWidth() {
            return this.artwidth;
        }

        private checkAlign() {
            if (!this._align) return;
            if (this._lastWidth != this.width) {
                Layout.layout(this, this._align);
            }
            this._lastWidth = this.width;
        }

        public dispose() {
            super.dispose();
            removeDisplay(this);
        }

    }
}