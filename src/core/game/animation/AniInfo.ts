namespace jy {
	/**
	 * 用于处理无方向的动画信息
	 * @author 3tion
	 *
	 */
    export class AniInfo extends PstInfo {
    	/**
    	 * 加载状态
    	 */
        public state: RequestState = RequestState.UNREQUEST;

        protected _refList: AniRender[];

        url: string;

        uri: string;

        /**
         * 资源加载列队，用于控制加载优先级
         */
        qid?: Res.ResQueueID;
        public constructor() {
            super();
        }


		/**
		 * 绑定渲染器
		 * @param render
		 */
        public bind(render: AniRender) {
            let state = this.state;
            if (state != RequestState.COMPLETE) {
                if (!this._refList) {
                    this._refList = [];
                }
                this._refList.push(render);
                if (state == RequestState.UNREQUEST) {
                    let uri = this.uri = ResPrefix.Ani + this.key + "/" + UnitResourceConst.CfgFile;
                    let url = this.url = ConfigUtils.getResUrl(uri);
                    Res.load(uri, url, CallbackInfo.get(this.dataLoadComplete, this), this.qid);
                    this.state = RequestState.REQUESTING;
                }
            }
        }

		/**
         * 资源加载完成
         */
        dataLoadComplete(item: Res.ResItem) {
            let { uri, data } = item;
            if (uri == this.uri) {
                if (data) {
                    this.init(this.key, data);
                    if (this._refList) {
                        for (let render of this._refList) {
                            render.callback();
                        }
                    }
                } else {
                    this.state = RequestState.FAILED;
                }
                this._refList = undefined;
            }
        }

		/**
		 * 和渲染器解除绑定
		 * @param render
		 */
        public loose(render: AniRender) {
            let _refList = this._refList;
            if (_refList) {
                _refList.remove(render);
            }
        }


        public init(key: string, data: any[]) {
            super.init(key, data[0]);
            let res: UnitResource = new UnitResource(ResPrefix.Ani + key, this);
            res.qid = this.qid;
            res.decodeData(data[1]);
            this._resources = res;
            this.state = RequestState.COMPLETE;
        }

        getResource(uri?: string): UnitResource {
            return <UnitResource>this._resources;
        }

        public get actionInfo(): ActionInfo {
            let frames = this.frames;
            return frames && frames[0]
        }
    }
}
