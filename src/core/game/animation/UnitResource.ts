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

        /**
         * 纹理的配置文件的加载地址
         */
        readonly url: string;

        /**
         * 资源打包分隔信息
         */
        readonly sInfo: SplitInfo;

        state = RequestState.UNREQUEST;

        /**
         * 获取数据
         */
        private _datas: { [index: number]: JTexture[][] };

        constructor(uri: string, splitInfo: SplitInfo) {
            this.key = uri;
            this.url = ConfigUtils.getResUrl(uri + "/" + UnitResourceConst.CfgFile);
            this.sInfo = splitInfo;
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
                this.state = RequestState.REQUESTING;
                RES.getResByUrl(this.url, this.dataLoadComplete, this, EgretResType.TYPE_JSON);
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
            let { a, d } = drawInfo;
            if (frame) {
                let res = this.loadRes(d, a);
                res.lastUseTime = Global.now;
                if (frame.bitmapData) {
                    bitmap.texture = frame;
                    bitmap.anchorOffsetX = frame.tx;
                    bitmap.anchorOffsetY = frame.ty;
                    return true;
                } else {
                    if (res.state == RequestState.COMPLETE) {
                        res.bindTexture(frame);
                    }
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

        loadRes(direction: number, action: number) {
            let r = this.sInfo.getResKey(direction, action);
            let uri = this.getUri2(r);
            return ResourceManager.get(uri, this.noRes, this, uri, r) as SplitUnitResource;
        }

        noRes(uri: string, r: string) {
            let tmp = new SplitUnitResource(uri, this.getUrl(uri));
            tmp.bindTextures(this._datas, this.sInfo.adDict[r]);
            tmp.load();
            return tmp;
        }
        getUri(direction: number, action: number) {
            return this.getUri2(this.sInfo.getResKey(direction, action));
        }

        getUri2(resKey: string) {
            return this.key + "/" + resKey + Ext.PNG;
        }
        getUrl(uri: string) {
            return ConfigUtils.getResUrl(uri + Global.webp);
        }
        isResOK(direction: number, action: number) {
            let uri = this.getUri(direction, action);
            let res = ResourceManager.getResource(uri) as SplitUnitResource;
            return !!(res && res.bmd);
        }

        /**
         * 遍历Res所有资源
         * @param { (uri: string, adKey: number): boolean } forEach 如果 forEach 方法返回 true，则停止遍历
         */
        checkRes(forEach: { (uri: string, adKey: number): boolean }) {
            const dict = this.sInfo.adDict;
            for (let resKey in dict) {
                let uri = this.getUri2(resKey);
                if (forEach(uri, dict[resKey])) {
                    return
                }
            }
        }
    }
}
