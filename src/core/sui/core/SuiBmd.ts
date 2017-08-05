module junyou {
    /**
     * 
     * 用于处理SuiData中的纹理加载
     * @export
     * @class SuiBmd
     * @author gushuai
     */
    export class SuiBmd implements IResource {

        public bmd: egret.BitmapData;

        public textures: egret.Texture[] = [];

        public bmdState: RequestState = RequestState.UNREQUEST;

        /**
         * 最大纹理加载失败次数
         * 
         * @protected
         * @memberof SuiBmd
         */
        protected _maxErrCount = 3;

        protected _url: string;

        public get url() {
            return this._url;
        }

        /**
         * 使用计数
         */
        public using = 0;

        public get isStatic() {
            return this.using > 0;
        }

        private _uri: string;

        public get resID() {
            return this._uri;
        }

        public lastUseTime: number = 0;

        /**
         * 未加载的时候，请求的位图
         */
        public loading: SuiBmdCallback[] = [];

        protected _errCount: number;

        public constructor(uri: string, url: string) {
            this._uri = uri;
            this._url = url;
        }

        public loadBmd() {
            if (this.bmdState <= RequestState.UNREQUEST) {
                RES.getResByUrl(this._url, this.checkBitmap, this, RES.ResourceItem.TYPE_IMAGE);
                this.bmdState = RequestState.REQUESTING;
            }
        }

        protected checkBitmap(tex: egret.Texture, key: string) {
            if (!tex) {
                //加载失败尝试3次重新加载资源
                this.bmdState = RequestState.FAILED;
                let _errCount = ~~this._errCount;
                _errCount++;
                this._errCount = _errCount;
                if (_errCount <this._maxErrCount) {
                    this.loadBmd();
                } else {
                    ThrowError(`尝试${_errCount}次加载资源[${this._url}]失败`);
                    dispatch(EventConst.SuiBmdLoadFailed,this._uri);
                }
                return
            }
            let bmd = tex.bitmapData;
            let imgs = this.textures;
            this.bmd = bmd;

            for (let tex of imgs) {
                tex._bitmapData = bmd;
            }

            let loading = this.loading;
            if (loading) {
                //将绑定的位图，全部重新设置一次
                for (let bmp of loading) {
                    bmp.refreshBMD();
                }
                loading.length = 0;
            }
            this.bmdState = RequestState.COMPLETE;
        }

        public checkExpire(expiredUseTime: number) {
            if (this.bmdState != RequestState.UNREQUEST && !this.using && this.lastUseTime < expiredUseTime) {
                this.dispose();
            }
        }

        public dispose() {
            let bmd = this.bmd;
            this.bmdState = RequestState.UNREQUEST;
            if (bmd) {
                bmd.$dispose();
                this.bmd = undefined;
                RES.destroyRes(this._url);
            }
        }

    }
}