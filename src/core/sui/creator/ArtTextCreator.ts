namespace jy {

    const alignHandler: { [layoutType: number]: { (height: number, maxHeight: number): number } } = {
        [LayoutTypeVertical.TOP]: function () {
            return 0
        },
        [LayoutTypeVertical.MIDDLE]: function (height: number, maxHeight: number) {
            return maxHeight - height >> 1;
        },
        [LayoutTypeVertical.BOTTOM]: function (height: number, maxHeight: number) {
            return maxHeight - height;
        },
    }

    interface RectTexture extends egret.Texture {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }

    /**
     * 艺术字
     */
    export class ArtText extends Component {

        public suiData: SuiData;
        flag: any;
        version: number;
        private mesh: egret.Mesh;
        private inited: boolean;

        beforeDraw() {
            this.suiData.checkRefreshBmp(this);
        }
        /**
         * 垂直对齐方式
         * 
         * @private
         * @type {LayoutTypeVertical}
         */
        private vAlign: LayoutTypeVertical = LayoutTypeVertical.TOP;

        private hAlign: LayoutTypeHorizon = LayoutTypeHorizon.LEFT;

        public textures: { [index: string]: RectTexture };

        protected _value: string;

        /**
         * 水平间距
         * 
         */
        hgap: number;

        private _width = 0;

        private _height = 0;

        creator: ArtTextCreator;
        constructor() {
            super();
            let mesh = new egret.Mesh();
            let tex = new egret.Texture();
            mesh.texture = tex;
            this.addChild(mesh, false);
            this.mesh = mesh;
        }

        public refreshBMD(): void {
            const bmd = this.suiData.pngbmd.bmd;
            if (bmd) {
                let texture = this.mesh.texture;
                if (texture.bitmapData != bmd) {
                    this.mesh.texture.bitmapData = bmd;
                    this.inited = true;
                    this.creator.initTextures(bmd);
                    let value = this._value;
                    if (value !== undefined) {
                        this.set(value);
                    }
                }
            }
        }

        /**
         * 设置垂直对齐规则
         * 
         * @param {LayoutTypeVertical} value 
         */
        setVerticalAlign(value: LayoutTypeVertical) {
            this.vAlign = value;
        }

        /**
         * 设置水平对齐规则
         * @param value 
         */
        setHorizonAlign(value: LayoutTypeHorizon) {
            this.hAlign = value;
        }

        protected $setValue(val: Key) {
            if (this._value == val) {
                val = this._value;
            } else {
                if (val == undefined) {
                    val = ""
                };
                val = val + "";
                this._value = val;
            }
            if (!this.inited) {
                return
            }
            this.set(this._value)
        }
        protected set(tempval: string) {
            let len = tempval.length;
            let key: string;
            let txs = this.creator.textures;
            let ox = 0;
            let hgap = this.hgap || 0;
            let _maxHeight = 0;
            const mesh = this.mesh;
            let node = mesh.$renderNode as egret.sys.MeshNode;
            let { uvs, vertices } = node;
            let ui = 0;
            for (var i = 0; i < len; i++) {
                key = tempval.charAt(i);
                let tx = txs[key];
                if (!tx) {
                    if (DEBUG) {
                        ThrowError(`传入了纹理中没有的数据[${key}]`);
                    }
                    continue;
                }
                const { textureHeight } = tx;
                if (textureHeight > _maxHeight) {
                    _maxHeight = textureHeight;
                }
            }
            let hHandler = alignHandler[this.vAlign];
            for (var i = 0; i < len; i++) {
                key = tempval.charAt(i);
                let tx = txs[key];
                if (!tx) {
                    continue;
                }
                const { textureWidth, textureHeight, left, top, right, bottom } = tx;
                let oy = hHandler(textureHeight, _maxHeight);
                let vleft = ox;
                let vRight = ox + textureWidth;
                let vTop = oy;
                let vBottom = oy + textureHeight;
                //左上 - x
                uvs[ui] = left;
                vertices[ui] = vleft;
                ui++;

                uvs[ui] = top;
                vertices[ui] = vTop;
                ui++;


                //左下
                uvs[ui] = left;
                vertices[ui] = vleft;
                ui++;

                uvs[ui] = bottom;
                vertices[ui] = vBottom;
                ui++;


                //右下
                uvs[ui] = right;
                vertices[ui] = vRight;
                ui++;

                uvs[ui] = bottom;
                vertices[ui] = vBottom;
                ui++;

                //右上
                uvs[ui] = right;
                vertices[ui] = vRight;
                ui++;

                uvs[ui] = top;
                vertices[ui] = vTop;
                ui++;

                ox += tx.textureWidth + hgap;
            }
            let artwidth = ox - hgap;
            this._height = _maxHeight;
            this._width = artwidth;
            node.indices = egret.SharedIndices.subarray(0, ui / 4 * 3) as any;
            uvs.length = vertices.length = ui;

            mesh.$updateVertices();


            switch (this.hAlign) {
                case LayoutTypeHorizon.LEFT:
                    ox = 0;
                    break;
                case LayoutTypeHorizon.CENTER:
                    ox = -artwidth >> 1;
                    break;
                case LayoutTypeHorizon.RIGHT:
                    ox = -artwidth;
                    break
            }
            mesh.x = ox;
            this.dirty();
        }

        public set value(val: string | number) {
            this.$setValue(val);
        }

        public get value(): string | number {
            return this._value;
        }

        $getWidth() {
            return this._width;
        }

        $getHeight() {
            return this._height;
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
        textures: { [index: string]: RectTexture } = {};
        bmd: egret.BitmapData;

        initTextures(bmd: egret.BitmapData) {
            if (this.bmd != bmd) {
                const { height, width } = bmd;
                //计算出纹理的uv坐标
                const { textures } = this;
                for (let key in textures) {
                    const tex = textures[key];
                    const { $bitmapX, $bitmapY, $bitmapWidth, $bitmapHeight } = tex;
                    tex.left = $bitmapX / width;
                    tex.right = ($bitmapX + $bitmapWidth) / width;
                    tex.top = $bitmapY / height;
                    tex.bottom = ($bitmapY + $bitmapHeight) / height;
                }
            }
        }
        public parseSelfData(data: any) {
            let self = this
            const splitStr = data[0];
            const len = splitStr.length;
            const suiData = self._suiData;
            // const imgs = suiData.pngtexs;
            let txs: { [index: string]: RectTexture } = this.textures;
            for (let i = 0; i < len; i++) {
                let tx = suiData.getTexture(data[i + 1]) as RectTexture;//imgs[data[i + 1]];
                let key: string = splitStr.charAt(i);
                txs[key] = tx;
            }
            self._createT = (): ArtText => {
                let shape = new ArtText();
                shape.suiData = suiData;
                shape.creator = self;
                suiData.checkRefreshBmp(shape);
                return shape;
            }
        }
    }
}
