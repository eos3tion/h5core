module junyou {




    /**
     * 
     * SuiData中位图加载完成的回调
     * @export
     * @interface SuiBmdCallback
     */
    export interface SuiBmdCallback {
        /**
         * suidata中用的位图加载完成后，对于加载的组件的回调函数
         * 
         * 
         * @memberOf SuiBmdRefresh
         */
        refreshBMD(): void;
    }

    /**
     * SuiData的数据加载完成后的回调
     * 
     * @export
     * @interface SuiDataCallback
     */
    export interface SuiDataCallback {
        suiDataComplete(suiData: SuiData): void;
        suiDataFailed(suiData: SuiData): void;
    }

	/**
	 * 用于加载和存储fla导出的ui数据和位图
	 * @author 3tion
	 *
	 */
    export class SuiData {
        /**
         * 强制设置的皮肤标识
         */
        skinUri?: string;
    	/**
    	 * fla的名字
    	 */
        readonly key: string;

        /**
         * 加载地址
         */
        readonly url: string;

        readonly uri: string;

        /**
    	 * 位图数据
    	 */
        public pngbmd: SuiBmd
        /**
    	 * 位图数据
    	 */
        public jpgbmd: SuiBmd;

    	/**
    	 * 回调函数
    	 */
        public callbacks?: SuiDataCallback[];

    	/**
    	 * 数据加载状态
    	 * 0 未加载
    	 * 1 加载中
    	 * 2 数据加载完成
    	 */
        public state: RequestState = RequestState.UNREQUEST;

    	/**
    	 * 库数据
         * key      fla中设置的导出名<br/>
         * value    皮肤数据<br/>
    	 */
        public lib: { [index: string]: BaseCreator<egret.DisplayObject> } = {};

        /**
         * 面板原始数据
         * 
         * @type {PanelsData}
         */
        public panelsData: PanelsData;

        /**
         * 面板/View的className集合
         * 
         * @type {string[]}
         */
        public panelNames: string[];

        /**
         * 字库数据
         * 
         * @type {{ [index: string]: ArtWord }}
         * @memberOf SuiData
         */
        public fonts: { [index: string]: ArtWord };


        /**
         * 位图创建器
         */
        public bmplibs: { [index: number]: BitmapCreator<egret.Bitmap> };


        /***
         * 未经过解析的源组件数据
         */
        public sourceComponentData: Object;

        constructor(key: string) {
            this.key = key;
            this.url = ConfigUtils.getSkinFile(key, SuiResConst.DataFile);
            this.uri = getSuiDataUri(key);
        }

        public createBmpLoader(ispng: boolean, textures: egret.Texture[]) {
            let file = "d" + (ispng ? Ext.PNG : Ext.JPG);
            //增加一个skin前缀
            let uri = this.skinUri || "skin/" + ConfigUtils.getSkinPath(this.key, file);
            let tmp = ResManager.get(uri, this.noRes, this, uri, file, textures);
            ispng ? this.pngbmd = tmp : this.jpgbmd = tmp;
        }

        noRes(uri: string, file: string, textures: egret.Texture[]) {
            let url = ConfigUtils.getSkinFile(this.key, file) + Global.webp;
            let tmp = new SuiBmd(uri, url);
            tmp.textures = textures;
            return tmp;
        }

        /**
         * 刷新位图
         * 
         * @param {SuiBmdCallback} bmp  要刷新的位图
         * @param {boolean} [isjpg]     是否为jpg纹理，默认为png
         */
        public checkRefreshBmp(bmp: SuiBmdCallback, isjpg?: boolean) {
            let tmp = isjpg ? this.jpgbmd : this.pngbmd;
            if (tmp) {
                tmp.using++;
                if (tmp.bmdState == RequestState.COMPLETE) {
                    if (bmp.refreshBMD) {
                        bmp.refreshBMD();
                    }
                    return true;
                } else {
                    tmp.loading.pushOnce(bmp);
                    tmp.loadBmd();
                    return false;
                }
            }
        }

        /**获取对应索引位置的texture */
        public getTexture(index: number) {
            let inx = index;
            let bmd = this.pngbmd;
            if (index < 0) {
                inx = -1 - index;
                bmd = this.jpgbmd;
            }
            let txts = bmd.textures;
            if (txts) {
                return txts[inx];
            }
        }

        public loadBmd<T extends Function>(callback?: CallbackInfo<T>) {
            let bin = recyclable(CallbackBin)
            let count = 0;
            //检查bmd状态
            this.jpgbmd && !this.checkRefreshBmp(bin, true) && count++;
            this.pngbmd && !this.checkRefreshBmp(bin) && count++;
            if (count) {
                bin.count = count;
                bin.callback = callback;
            } else {
                bin.recycle();
                callback && callback.execute(true);
            }
        }
    }

    class CallbackBin {
        /**
         * 计数器
         */
        count: number;

        callback?: $CallbackInfo;
        refreshBMD() {
            let count = this.count;
            if (!--count) {
                let callback = this.callback;
                if (callback) {
                    this.callback = undefined;
                    callback.execute(true);
                }
            } else {
                this.count = count;
            }
        }
    }
}
