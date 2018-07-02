namespace jy {
	/**
	 * 异步工具类，用于加方法兼听
	 * @author 3tion
	 *
	 */
    export class AsyncHelper {
        /**
         * 是否已经处理完成
         */
        public isReady = false;

        protected _cbs: $CallbackInfo[];

    	/**
		 * 异步数据已经加载完毕
		 */
        public readyNow(): void {
            if (!this.isReady) {
                this.isReady = true;
                let _readyExecutes = this._cbs;
                if (_readyExecutes) {
                    let temp = _readyExecutes.concat();
                    _readyExecutes.length = 0;
                    for (let i = 0; i < temp.length; i++) {
                        let callback = temp[i];
                        callback.execute();
                    }
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
            if (this.isReady) {
                return handle.apply(thisObj, args);
            }
            let _readyExecutes = this._cbs;
            if (!_readyExecutes) {
                this._cbs = _readyExecutes = [];
            }
            CallbackInfo.addToList(_readyExecutes, handle, thisObj, ...args);
        }

    }
}
