namespace jy {
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

        readonly url: string;
        /**
         * 使用计数
         */
        isStatic: boolean;

        readonly uri: string;

        public lastUseTime: number = 0;

        /**
         * 未加载的时候，请求的位图
         */
        public loading: SuiBmdCallback[] = [];

        /**
         * 版本号
         */
        version = 0;

        public constructor(uri: string, url: string) {
            this.uri = uri;
            this.url = url;
        }

        public loadBmd() {
            if (this.bmdState <= RequestState.UNREQUEST) {
                Res.load(this.uri, this.url, CallbackInfo.get(this.checkBitmap, this))
                this.bmdState = RequestState.REQUESTING;
            }
        }

        protected checkBitmap(item: Res.ResItem) {
            let { uri, data } = item;
            if (this.uri == uri) {
                if (!data) {
                    dispatch(EventConst.SuiBmdLoadFailed, this.uri);
                    if (DEBUG) {
                        data = ErrorTexture;
                    } else {
                        return;
                    }
                }
                let bmd = data.bitmapData;
                let imgs = this.textures;
                this.bmd = bmd;
                let version = this.version;
                version++;
                for (let tex of imgs) {
                    tex.$bitmapData = bmd;
                }

                let loading = this.loading;
                if (loading) {
                    //将绑定的位图，全部重新设置一次
                    for (let bmp of loading) {
                        bmp.refreshBMD();
                        bmp.version = version;
                    }
                    loading.length = 0;
                }
                this.version = version;
                this.bmdState = RequestState.COMPLETE;
            }
        }

        public dispose() {
            let bmd = this.bmd;
            this.version++;
            this.bmdState = RequestState.UNREQUEST;
            if (bmd) {
                bmd.$dispose();
                this.bmd = undefined;
                Res.remove(this.uri);
            }
        }

    }
}