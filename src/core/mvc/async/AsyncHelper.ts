module junyou {
	/**
	 * 异步工具类，用于加方法兼听
	 * @author 3tion
	 *
	 */
    export class AsyncHelper {

        public _ready: boolean = false;

        protected _readyExecutes: CallbackInfo<Function>[];

        /**
         * 是否已经处理完成
         */
        public get isReady(): boolean {
            return this._ready;
        }

        public constructor() {
        }

    	/**
		 * 异步数据已经加载完毕
		 */
        public readyNow(): void {
            if (!this._ready) {
                this._ready = true;
                var _readyExecutes = this._readyExecutes;
                if (_readyExecutes) {
                    var temp = [];
                    for (var i = 0, len = _readyExecutes.length; i < len; i++) {
                        temp[i] = _readyExecutes[i];
                    }
                    _readyExecutes = undefined;
                    for (i = 0; i < len; i++) {
                        var callback = temp[i];
                        callback.execute();
                    }
                    temp.length = 0;
                }
            }
        }

        /**
         * 检查是否完成,并让它回调方法
         * 
         * @param {Function} handle 处理函数
         * @param {*} thisObj this对象
         * @param {any[]} args 函数的参数
         */
        public addReadyExecute(handle: Function, thisObj?: any, ...args: any[]) {
            if (this._ready) {
                handle.apply(thisObj, args);
                return;
            }
            var _readyExecutes = this._readyExecutes;
            if (!_readyExecutes) {
                _readyExecutes = [];
                this._readyExecutes = _readyExecutes;
            }
            CallbackInfo.addToList(_readyExecutes, handle, thisObj, ...args);
        }

    }
}
