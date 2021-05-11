namespace jy {

    const alignHandler: { [layoutType: number]: { (bmp: egret.DisplayObject, maxHeight: number) } } = {
        [LayoutTypeVertical.TOP]: function (bmp: egret.DisplayObject) {
            bmp.y = 0;
        },
        [LayoutTypeVertical.MIDDLE]: function (bmp: egret.DisplayObject, maxHeight: number) {
            bmp.y = maxHeight - bmp.height >> 1;
        },
        [LayoutTypeVertical.BOTTOM]: function (bmp: egret.DisplayObject, maxHeight: number) {
            bmp.y = maxHeight - bmp.height;
        },
    }


    /**
     * 艺术字
     */
    export class ArtText extends Component {

        public suiData: SuiData;
        flag: any;
        version: number;
        beforeDraw() {
            this.suiData.checkRefreshBmp(this);
        }
        /**
         * 垂直对齐方式
         * 
         * @private
         * @type {LayoutTypeVertical}
         */
        private _align: LayoutTypeVertical = LayoutTypeVertical.TOP;

        public textures: { [index: string]: egret.Texture }

        protected _value: string | number;

        /**
         * 水平间距
         * 
         */
        hgap: number;

        private artwidth = 0;

        private _maxHeight = 0;

        public constructor() {
            super();
        }

        public refreshBMD(): void {
            for (let bmp of <egret.Bitmap[]>this.$children) {
                bmp.refreshBMD();
            }
        }

        /**
         * 设置垂直对齐规则
         * 
         * @param {LayoutTypeVertical} value 
         */
        public setVerticalAlign(value: LayoutTypeVertical) {
            if (this._align != value) {
                this._align = value;
            }
        }

        protected $setValue(val: string | number) {
            if (this._value == val) return;
            if (val == undefined) val = "";
            this._value = val;
            let tempval = val + "";
            let len = tempval.length;
            let key: string;
            let txs = this.textures;
            let children = this.$children;
            let numChildren = this.numChildren;
            let bmp: egret.Bitmap;
            let ox = 0;
            let hgap = this.hgap || 0;
            let _maxHeight = 0;
            for (var i = 0; i < len; i++) {
                key = tempval.charAt(i);
                if (i < numChildren) {
                    bmp = <egret.Bitmap>children[i];
                } else {
                    bmp = new egret.Bitmap();
                    this.addChild(bmp, false);
                }
                let tx = txs[key];
                if (!tx) {
                    if (DEBUG) {
                        ThrowError(`传入了纹理中没有的数据[${key}]`);
                    }
                    continue;
                }
                if (tx.textureHeight > _maxHeight) {
                    _maxHeight = tx.textureHeight;
                }
                bmp.x = ox;
                bmp.texture = null;
                bmp.texture = tx;
                ox += tx.textureWidth + hgap;
            }
            this.artwidth = ox - hgap;
            for (i = numChildren - 1; i >= len; i--) {
                this.$doRemoveChild(i, false);
            }
            this._maxHeight = _maxHeight;
            this.checkAlign();
        }

        public set value(val: string | number) {
            this.$setValue(val);
        }



        public get value(): string | number {
            return this._value;
        }

        $getWidth() {
            return this.artwidth;
        }

        protected checkAlign() {
            let children = this.$children;
            let _maxHeight = this._maxHeight;
            let handler = alignHandler[this._align];
            for (let i = 0; i < children.length; i++) {
                const bmp = children[i];
                handler(bmp, _maxHeight);
            }
        }

        public dispose() {
            super.dispose();
            removeDisplay(this);
        }

    }
    /**
     *
     * @author gushuai
     *
     */
    export class ArtTextCreator extends BaseCreator<ArtText>{

        public parseSelfData(data: any) {
            const splitStr = data[0];
            const len = splitStr.length;
            const suiData = this._suiData;
            // const imgs = suiData.pngtexs;
            let txs: { [index: string]: egret.Texture } = {};
            for (let i = 0; i < len; i++) {
                let tx: egret.Texture = suiData.getTexture(data[i + 1]);//imgs[data[i + 1]];
                let key: string = splitStr.charAt(i);
                txs[key] = tx;
            }
            refreshTexs(suiData, this as any);
            this._createT = (): ArtText => {
                let shape = new ArtText();
                shape.suiData = suiData;
                shape.textures = txs;
                return shape;
            }
        }
    }
}
