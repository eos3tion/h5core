namespace jy {
    /**
     * 延迟执行
     * @author 3tion
     */
    export class CallLater {

        private _callLaters: CallbackInfo<Function>[] = [];
        private _temp: CallbackInfo<Function>[] = [];
        constructor() {

        }


        public tick(now: number) {
            let i = 0, j = 0, k = 0, callLaters = this._callLaters, temp = this._temp;
            // 检查callLater，执行时间够的calllater调用
            for (let len = callLaters.length; i < len; i++) {
                let cb = callLaters[i];
                if (now > cb.time) {
                    temp[j++] = cb;
                } else {
                    callLaters[k++] = cb;
                }
            }
            callLaters.length = k;
            for (i = 0; i < j; i++) {
                temp[i].execute();
            }
        }


        /**
         * 增加延迟执行的函数
         * 
         * @param {Function} callback (description)
         * @param {number} now (description)
         * @param {number} [time] (description)
         * @param {*} [thisObj] (description)
         * @param args (description)
         */
        public callLater(callback: Function, now: number, time?: number, thisObj?: any, ...args) {
            let cInfo = CallbackInfo.addToList(this._callLaters, callback, thisObj, ...args);
            cInfo.time = now + (time || 0);
        }

        /**
         * 增加延迟执行的函数 不去重
         * 
         * @param {Function} callback (description)
         * @param {number} now (description)
         * @param {number} [time] (description)
         * @param {*} [thisObj] (description)
         * @param args (description)
         */
        public callLater3(callback: Function, now: number, time?: number, thisObj?: any, ...args) {
            let cInfo = CallbackInfo.addToList2(this._callLaters, callback, thisObj, ...args);
            cInfo.time = now + (time || 0);
        }

        /**
         * 清理延迟执行的函数
         * 
         * @param {Function} callback (description)
         * @param {*} [thisObj] (description)
         */
        public clearCallLater(callback: Function, thisObj?: any) {
            let callLaters = this._callLaters;
            for (let i = callLaters.length - 1; i >= 0; --i) {
                let cInfo = callLaters[i];
                if (cInfo.checkHandle(callback, thisObj)) {
                    callLaters.splice(i, 1);
                    return cInfo.recycle();
                }
            }
        }

        public callLater2(callback: $CallbackInfo, now?: number, time = 0) {
            this._callLaters.pushOnce(callback);
            callback.time = now + (time || 0);
        }

        public clearCallLater2(callback: $CallbackInfo) {
            this._callLaters.remove(callback);
            return callback.recycle();
        }

        public clear() {
            let callLaters = this._callLaters;
            for (let i = 0; i < callLaters.length; i++) {
                const cInfo = callLaters[i];
                cInfo.recycle();
            }
            callLaters.length = 0;
        }
    }
}