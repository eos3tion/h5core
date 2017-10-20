module junyou {
    export interface RPCCallback {
        /**
         * 成功的回调函数
         * 
         * @type {Recyclable<CallbackInfo<(data?: any, ...args)>>}
         * @memberof RPCCallback
         */
        success: Recyclable<CallbackInfo<{ (data?: any, ...args) }>>;

        /**
         * 失败的回调函数
         * 
         * @type {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>}
         * @memberof RPCCallback
         */
        error: Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>;
        /**
         * RPC的超时时间
         * 
         * @type {number}
         * @memberof RPCCallback
         */
        expired: number;

        id: number;
    }

    export const enum RPCConst {
        /**
         * 默认超时时间
         */
        DefaultTimeout = 2000,
    }

    export interface RPCInterface {
        /**
         * 超时的错误常量 `RPCTimeout`
         * 
         * @type {string}
         * @memberof RPCInterface
         */
        readonly Timeout: string;
        /**
         * 执行回调
         * 
         * @param {number} id 执行回调的id
         * @param {*} [data] 成功返回的数据
         * @param {(Error | string)} [err] 错误
         */
        callback(id: number, data?: any, err?: Error | string);
        /**
         * 注册回调函数
         * 
         * @param {Recyclable<CallbackInfo<{ (data?: any, ...args) }>>} success     成功的函数回调
         * @param {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>} [error]    发生错误的函数回调
         * @param {number} [timeout=2000] 超时时间，默认2000，实际超时时间会大于此时间，超时后，如果有错误回调，会执行错误回调，`Error(RPC.Timeout)`
         * @returns 回调函数的id
         */
        registerCallback(success: Recyclable<CallbackInfo<{ (data?: any, ...args) }>>, error?: Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>, timeout?: number): number

        /**
         * 注册回调函数
         * 成功则data为返回的数据  
         * 失败时  
         * `withError`为`true` data为Error   
         * `withError`不填或者`false` data为undefined
         * @param {{ (data?: any, ...args) }} callback 回调函数，成功或者失败均会使用此回调
         * @param {boolean} [withError] 返回回调失败时，是否使用Error，默认失败，data为`undefined`
         * @param {number} [timeout=2000] 回调函数的超时时间，默认为2000
         * @param {*} [thisObj] 
         * @param {any} any 
         * @returns {number} 
         * @memberof RPCInterface
         */
        registerCallbackFunc(callback: { (data?: any, ...args) }, withError?: boolean, timeout?: number, thisObj?: any, ...any): number
        /**
         * 根据id移除回调函数
         * 
         * @param {number} id 
         */
        removeCallback(id: number)
    }
    let seed = 1;
    let callbacks = {} as { [index: number]: RPCCallback };
    const Timeout = "RPCTimeout";
    let count = 0;
    let start: boolean;
    let willDel = [];
    export const RPC: RPCInterface = {
        Timeout,
        callback,

        registerCallback,
        /**
         * 注册回调函数，成功和失败，均使用该方法  
         * 成功则data为返回的数据  
         * 失败则data为Error  
         * @param {{ (data?: any, ...args) }} callback 
         * @param {*} [thisObj] 
         * @param {any} any 
         */
        registerCallbackFunc(callback: { (data?: any, ...args) }, withError?: boolean, timeout: number = RPCConst.DefaultTimeout, thisObj?: any, ...args) {
            let success = CallbackInfo.get(callback, thisObj, ...args);
            let error = CallbackInfo.get(withError ? callback : noErrorCallback(callback, thisObj), thisObj, ...args);
            return registerCallback(success, error, timeout);
        },
        /**
        * 根据id移除回调函数
        * 
        * @param {number} id 
        */
        removeCallback(id: number) {
            let callback = callbacks[id];
            deleteCallback(id);
            if (callback) {
                let { success, error } = callback;
                if (success) {
                    success.recycle();
                }
                if (error) {
                    error.recycle();
                }
            }
        }
    }
    function noErrorCallback(callback: Function, thisObj?: any) {
        return (err?: Error, ...args) => {
            callback.call(thisObj, undefined, ...args);
        }
    }
    /**
     * 注册回调函数
     * 
     * @param {Recyclable<CallbackInfo<{ (data?: any, ...args) }>>} success     成功的函数回调
     * @param {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>} [error]    发生错误的函数回调
     * @param {number} [timeout=2000] 超时时间，默认2000，实际超时时间会大于此时间，超时后，如果有错误回调，会执行错误回调，`Error(RPC.Timeout)`
     * @returns 
     */
    function registerCallback(success: Recyclable<CallbackInfo<{ (data?: any, ...args) }>>, error?: Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>, timeout: number = RPCConst.DefaultTimeout) {
        let id = seed++;
        callbacks[id] = { id, expired: Global.now + timeout, success, error };
        count++;
        if (!start) {
            TimerUtil.addCallback(Time.ONE_SECOND, check);
            start = true;
        }
        return id;
    }
    function deleteCallback(id: number) {
        if (id in callbacks) {
            delete callbacks[id];
            count--;
            if (count == 0) {
                TimerUtil.removeCallback(Time.ONE_SECOND, check);
                start = false;
            }
        }
    }
    /**
       * 执行回调
       * 
       * @param {number} id 执行回调的id
       * @param {*} [data] 成功返回的数据
       * @param {(Error | string)} [err] 错误
       */
    function callback(id: number, data?: any, err?: Error | string) {
        let callback = callbacks[id];
        if (!callback) {
            return
        }
        deleteCallback(id);
        let { success, error } = callback;
        let result;
        if (err) {
            if (typeof err === "string") {
                err = new Error(err);
            }
            if (error) {
                result = error.call(err);
                error.recycle();
            }
            if (success) {
                success.recycle();
            }
        } else {
            if (error) {
                error.recycle();
            }
            if (success) {
                result = success.call(data);
                success.recycle();
            }
        }
        return result;
    }
    function check() {
        let del = willDel;
        let i = 0;
        let now = Global.now;
        for (let id in callbacks) {
            let callback = callbacks[id];
            if (now > callback.expired) {
                del[i++] = id;
            }
        }
        for (let j = 0; j < i; j++) {
            let id = del[j];
            callback(id, null, Timeout);
        }
    }
}