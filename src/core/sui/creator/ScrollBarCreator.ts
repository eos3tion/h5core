namespace jy {
    export class ScrollBar extends Component {

        public bar: egret.Sprite;

        public bg: egret.Sprite;

        protected _barBmp: ScaleBitmap;

        protected _bgBmp: ScaleBitmap;

        protected _bgSize: number;

        protected _barSize: number;

        protected _scrollType = ScrollDirection.Vertical;

        protected _supportSize = 15;


        public constructor() {
            super();
            this.initBaseContainer();
        }

        protected initBaseContainer() {
            let bar = new egret.Sprite();
            let bg = new egret.Sprite();
            this.addChild(bg);
            this.addChild(bar);
            bg.visible = false;
            this.bar = bar;
            this.bg = bg;
        }
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
        public set scrollType(value: ScrollDirection) {
            this._scrollType = value;
            this.checkBarSize();
            this.checkBgSize();
            this.$setSupportSize(this._supportSize);
        }
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
        public get scrollType() {
            return this._scrollType;
        }

        /**
         * 设置滚动条的底与默认尺寸
         * 
         * @value 背景底
         * @bgSize 尺寸
         */
        public setBg(value: ScaleBitmap, bgSize?: number) {
            this._bgBmp = value;
            value.y = 0;
            if (bgSize > 0) {
                this._bgSize = bgSize;
            }
            else {
                this.checkBgSize();
            }
            this.bg.addChild(value);
            this.$setSupportSize(this._supportSize);
        }

        /**
         * 设置滑块按钮的样式
         * 
         * @value 滑块按钮
         * @barSize 滑块的尺寸大小
         */
        public setBar(value: ScaleBitmap, barSize?: number) {
            this._barBmp = value;
            value.y = 0;
            if (barSize > 0) {
                this._barSize = barSize;
            }
            else {
                this.checkBarSize();
            }
            this.bar.addChild(value);
            this.$setSupportSize(this._supportSize);
        }

        /**
         * 滚动条背景尺寸
         */
        public set bgSize(value: number) {
            if (this._bgSize != value) {
                this.$setBgSize(value);
            }
        }

        public get bgSize() {
            return this._bgSize;
        }

        /**
         * 滑块的尺寸
         */
        public set barSize(value: number) {
            if (this._barSize != value) {
                this.$setBarSize(value);
            }
        }

        public get barSize() {
            return this._barSize;
        }

        /**当垂直滚动时，此值为滑块的宽度，当水平滚动时，此值为滑块的高度 */
        public set supportSize(value: number) {
            if (this._supportSize != value) {
                this.$setSupportSize(value);
            }
        }

        public get supportSize() {
            return this._supportSize;
        }

        protected $setSupportSize(_supportSize: number) {
            this._supportSize = _supportSize;
            const { _bgBmp, _barBmp } = this;
            if (this._scrollType == ScrollDirection.Vertical) {
                if (_bgBmp) _bgBmp.width = _supportSize;
                if (_barBmp) _barBmp.width = _supportSize;
            } else {
                if (_bgBmp) _bgBmp.height = _supportSize;
                if (_barBmp) _barBmp.height = _supportSize;
            }
        }

        protected $setBarSize(_barSize: number) {
            this._barSize = _barSize;
            let _barBmp = this._barBmp;
            if (_barBmp) {
                if (this._scrollType == ScrollDirection.Vertical) {
                    _barBmp.height = _barSize;
                } else {
                    _barBmp.width = _barSize;
                }
            }
        }

        protected $setBgSize(_bgSize: number) {
            this._bgSize = _bgSize;
            let _bgBmp = this._bgBmp;
            if (_bgBmp) {
                if (this._scrollType == ScrollDirection.Vertical) {
                    _bgBmp.height = _bgSize;
                } else {
                    _bgBmp.width = _bgSize;
                }
            }
        }


        protected checkBgSize() {
            let _bgBmp = this._bgBmp;
            if (_bgBmp) {
                if (this._scrollType == ScrollDirection.Vertical) {
                    this._bgSize = _bgBmp.height;
                } else {
                    this._bgSize = _bgBmp.width;
                }
            }
        }

        protected checkBarSize() {
            let _barBmp = this._bgBmp;
            if (_barBmp) {
                if (this._scrollType == ScrollDirection.Vertical) {
                    this._barSize = _barBmp.height;
                } else {
                    this._barSize = _barBmp.width;
                }
            }
        }
    }
    export class ScrollBarCreator extends BaseCreator<ScrollBar>{
        private uiData: any[];

        private suiManager: SuiResManager;

        public constructor() {
            super();
        }

        public parseSelfData(data: any) {
            this.uiData = data;
            this.suiManager = singleton(SuiResManager);
            this._createT = this.createScrollBar;
        }

        private createScrollBar(): ScrollBar {
            let scrollBar: ScrollBar = new ScrollBar();
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
            let sc: ScaleBitmap = <ScaleBitmap>this.suiManager.createDisplayObject(this._suiData.key, name, tmpData[1]);

            scrollBar.setBar(sc);

            tmpData = comData[1];
            index = tmpData[2];

            sourceArr = sourceData[5];
            name = sourceArr[0][index];
            sc = <ScaleBitmap>this.suiManager.createDisplayObject(this._suiData.key, name, tmpData[1]);
            scrollBar.setBg(sc);

            return scrollBar;
        }
    }
}