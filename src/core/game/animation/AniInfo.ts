module junyou {
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

        protected url: string;

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
                    let uri = ResPrefix.ANI + this.key + "/" + UnitResource.DATA_JSON;
                    this.url = ConfigUtils.getResUrl(uri);
                    RES.getResByUrl(this.url, this.dataLoadComplete, this, EgretResType.TYPE_JSON);
                    this.state = RequestState.REQUESTING;
                }
            }
        }

		/**
         * 资源加载完成
         */
        dataLoadComplete(data: any[], key: string) {
            if (key == this.url) {
                if (data) {
                    this.init(this.key, data);
                    if (this._refList) {
                        for (let render of this._refList) {
                            render.callback();
                        }
                    }
                } else {// 不做加载失败的处理
                    this.state = RequestState.COMPLETE;
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
            var res: UnitResource = new UnitResource(ResPrefix.ANI + key, this.splitInfo);
            res.decodeData(data[1]);
            this._resources = res;
            this.state = RequestState.COMPLETE;
        }

        getResource(uri?: string): UnitResource {
            return <UnitResource>this._resources;
        }

        public get actionInfo(): ActionInfo {
            return this.frames[0]
        }
    }
}
