namespace jy {
	/**
	 * 用于君游项目数据同步，后台运行<br/>
     * 只有注册和注销，没有awake和sleep
	 * @author 3tion
	 *
	 */
    export abstract class Proxy extends FHost {

        /**
         * 是否被其他模块依赖
         * 
         * @type {boolean}
         */
        _$isDep: boolean;
        /**
		 * 默认当作同步数据，认为是已经处理好的
		 */
        protected _selfReady: boolean;

        /**
         * 数据是否加载完毕
         */
        protected _readyState: RequestState = RequestState.UNREQUEST;

        public constructor(name: string | number) {
            super(name);
        }

        public get isReady(): boolean {
            return this._readyState == RequestState.COMPLETE && this._selfReady;
        }

        public startSync(): boolean {
            if (this._readyState == RequestState.COMPLETE) {
                this.selfReady();
            }
            else if (this._readyState == RequestState.UNREQUEST) {
                this._readyState = RequestState.REQUESTING;
                this._startSync();
            }
            return false;
        }

        /**
         * 用于重写，主要用于向服务端发送一些指令/或者是开始进行http请求进行拉配置
         *
         */
        protected _startSync(): void {

        }

        /**
		 * 自己加载好<br/>
		 * 不包括依赖项
		 *
		 */
        protected selfReady(): void {
            this.parseSelfData();
            this._selfReady = true;
            if (this._dependerHelper) {
                this._dependerHelper.check();
            }
            else {
                this.allReadyHandler();
            }
        }

        /**
         * 用于子类重写<br/>
         * 处理自己的数据<br/>
         * 如果有依赖，请使用afterAllReady<br/>
         *
         */
        protected parseSelfData(): void {
            // to be override

        }


        /**
         * 依赖项加载完毕
         *
         */
        protected dependerReadyCheck(): void {
            if (this._selfReady) {
                this.allReadyHandler();
            }
        }

        /**
         * 全部ok<br/>
         * 此函数不给子类继承
         */
        private allReadyHandler(): void {
            if (this._readyState != RequestState.COMPLETE) {
                this.afterAllReady();
                this._readyState = RequestState.COMPLETE;
                if (this._asyncHelper) {
                    this._asyncHelper.readyNow();
                }
            }
        }
    }
}
