/**
 * @author 3tion
 */
module junyou {

    export const enum UnitResourceConst {

        /**
         * 单配置文件的路径
         */
        CfgFile = "d.json"
    }


	/**
	 * 单位资源<br/>
	 * 图片按动作或者方向的序列帧，装箱处理后的图片位图资源<br/>
	 * 以及图片的坐标信息
	 */
    export class UnitResource {

        /**
         * 资源标识
         */
        key: string;

        url: string;

        private _splitInfo: SplitInfo;

        state: RequestState = RequestState.UNREQUEST;

        /**
         * 获取数据
         */
        private _datas: { [index: number]: JTexture[][] };

        constructor(uri: string, splitInfo: SplitInfo) {
            this.key = uri;
            this._splitInfo = splitInfo;
        }

        /**
         * 解析数据
         */
        public decodeData(data: {}) {
            var _datas: { [index: number]: JTexture[][] } = {};
            for (let action in data) {
                let dData: JTexture[][] = [];
                _datas[action] = dData;
                let actData = data[action];
                if (!actData) continue;
                for (let d = 0, len = actData.length; d < len; d++) {
                    let fData: JTexture[] = [];
                    dData[d] = fData;
                    let dirData: any[] = actData[d];
                    if (!dirData) continue;
                    for (let f = 0, flen = dirData.length; f < flen; f++) {
                        if (dirData[f] !== 0) {
                            fData[f] = getTextureFromImageData(dirData[f]);
                        }
                    }
                }
            }
            this._datas = _datas;
            this.state = RequestState.COMPLETE;
            return;
            /**
             * 从数据中获取纹理
             */
            function getTextureFromImageData(data): JTexture {
                var texture = new JTexture();
                var sx: number = data[0];
                var sy: number = data[1];
                texture.tx = data[2] || 0;
                texture.ty = data[3] || 0;
                var width: number = data[4];
                var height: number = data[5];
                texture.$initData(sx, sy, width, height, 0, 0, width, height, width, height);
                return texture;
            }
        }

        /**
         * 加载数据
         */
        public loadData() {
            if (this.state == RequestState.UNREQUEST) {
                let uri = this.key + "/" + UnitResourceConst.CfgFile;
                let url = ConfigUtils.getResUrl(uri);
                this.url = url;
                this.state = RequestState.REQUESTING;
                RES.getResByUrl(url, this.dataLoadComplete, this, EgretResType.TYPE_JSON);
            }
        }

        /**
         * 资源加载完成
         */
        dataLoadComplete(data: Object, key: string) {
            if (key == this.url) {
                this.decodeData(data);
            }
        }

        /**
         * 将资源渲染到位图容器中
         * 
         * @param {egret.Bitmap} bitmap 要被绘制的位图
         * @param {IDrawInfo} drawInfo  绘制信息
         * @param {number} now 当前时间戳
         * @returns {boolean} true 表示绘制成功
         *                    其他情况标识绘制失败
         * @memberof UnitResource
         */
        draw(bitmap: egret.Bitmap, drawInfo: IDrawInfo, now: number) {
            let frame = this.getTexture(drawInfo);
            if (frame) {
                let res = this.loadRes(drawInfo.d, drawInfo.a);
                res.lastUseTime = Global.now;
                if (frame.bitmapData) {
                    bitmap.texture = frame;
                    bitmap.anchorOffsetX = frame.tx;
                    bitmap.anchorOffsetY = frame.ty;
                    return true;
                } else {
                    bitmap.texture = undefined;
                }
            }
            //TODO 绘制未加载的代理图片
        }

        /**
         * 根据 `动作``方向``帧数`获取纹理数据
         * @param info 
         */
        getTexture(info: IDrawInfo) {
            const datas = this._datas;
            if (datas) {
                const { a, f, d } = info;
                let dDatas = datas[a];
                if (dDatas) {
                    let frames = dDatas[d];
                    if (frames) {
                        var frame = frames[f];
                        if (frame) {
                            return frame;
                        }
                    }
                }
            }
        }

        loadRes(d: number, a: number) {
            let r = this._splitInfo.getResource(d, a);
            let uri = this.key + "/" + r + Ext.PNG;
            let datas = this._datas;
            return ResourceManager.get(uri, this.noRes, this, uri, r);
        }

        noRes(uri: string, r: string) {
            let tmp = new SplitUnitResource(uri);
            tmp.bindTextures(this._datas, this._splitInfo.adDict[r]);
            tmp.load();
            return tmp;
        }

        isResOK(d: number, a: number) {
            const info = this._splitInfo;
            let r = info.getResource(d, a);
            let uri = this.key + "/" + r + Ext.PNG;
            let res = ResourceManager.getResource(uri) as SplitUnitResource;
            return !!(res && res.bmd);
        }
    }
}
