namespace jy {

    interface DebugInfo {
        handle: string;
        stack: string;
    }

    function call(info: $CallbackInfo, ars?: ArrayLike<any>) {
        let args = [];
        let i = 0;
        if (ars) {
            for (; i < ars.length; i++) {
                args[i] = ars[i];
            }
        }
        let argus = info.args;
        if (argus) {
            for (let j = 0; j < argus.length; j++) {
                args[i++] = argus[j];
            }
        }
        let callback = info.callback;
        if (callback != undefined) {
            try {
                return callback.apply(info.thisObj, args);
            } catch (e) {
                if (DEBUG) {
                    let debug = <DebugInfo>info["_debug"];
                    ThrowError(`CallbackInfo执行报错，赋值内容：============Function=============:\n${debug.handle}\n}==============Stack============:\n${debug.stack}\n当前堆栈：${e.stack}`);
                    console.log("参数列表", ...this.args);
                }
            }
        } else if (DEBUG) {
            let debug = info["_debug"];
            ThrowError(`对已回收的CallbackInfo执行了回调，最后一次赋值内容：============Function=============:\n${debug.handle}\n==============Stack============:\n${debug.stack}\n当前堆栈：${new Error().stack}`)
        }
    }

    export type $CallbackInfo = CallbackInfo<Function>;

	/**
	 * 回调信息，用于存储回调数据
	 * @author 3tion
	 *
	 */
    export class CallbackInfo<T extends Function> implements IRecyclable {
        public callback: T;
        public args: any[];
        public thisObj: any;

        public doRecycle = true;
        /**
         * 待执行的时间
         */
        public time: number;
        constructor() {
            if (DEBUG) {
                let data: PropertyDescriptor = { enumerable: true, configurable: true };
                data.get = function () {
                    return this._cb;
                }
                data.set = function (value: T) {
                    if (this._cb != value) {
                        this._cb = value;
                        if (value != undefined) {
                            this._debug = { handle: value.toString(), stack: new Error().stack };
                        }
                    }
                }
                Object.defineProperty(this, "callback", data);
            }
        }

        public init(callback: T, thisObj?: any, args?: any[]) {
            this.callback = callback;
            this.args = args;
            this.thisObj = thisObj;
        }

        /**
         * 检查回调是否一致，只检查参数和this对象,不检查参数
         */
        public checkHandle(callback: T, thisObj: any) {
            return this.callback === callback && this.thisObj == thisObj/* 允许null==undefined */;
        }

        /**
         * 执行回调
         * 回调函数，将以args作为参数，callback作为函数执行
         * @param {boolean} [doRecycle] 是否回收CallbackInfo，默认为true
         */
        public execute(doRecycle?: boolean) {
            let callback = this.callback;
            let result = call(this);
            if (doRecycle == undefined) {
                doRecycle = this.doRecycle;
            }
            if (doRecycle) {
                this.recycle();
            }
            return result;
        }

        /**
         * 用于执行其他参数
         * 初始的参数会按顺序放在末位
         * @param args (description)
         */
        public call(...args)
        public call() {
            return call(this, arguments);
        }

        /**
         * 用于执行其他参数
         * 初始的参数会按顺序放在末位
         * 此方法会回收callbackInfo
         * @param {any} args 
         */
        public callAndRecycle(...args)
        public callAndRecycle() {
            let result = call(this, arguments);
            this.recycle();
            return result;
        }

        public onRecycle() {
            this.callback = undefined;
            this.args = undefined;
            this.thisObj = undefined;
            this.doRecycle = true;
        }


        public recycle: { () };

        /**
         * 获取CallbackInfo的实例
         */
        public static get<T extends Function>(callback: T, thisObj?: any, ...args: any[]) {
            var info = recyclable(CallbackInfo);
            info.init(callback, thisObj, args);
            return info as CallbackInfo<T>;
        }

        /**
         * 加入到数组
         * 检查是否有this和handle相同的callback，如果有，就用新的参数替换旧参数
         * @param list
         * @param handle
         * @param args
         * @param thisObj
         */
        public static addToList<T extends Function>(list: CallbackInfo<T>[], handle: T, thisObj?: any, ...args: any[]) {
            //检查是否有this和handle相同的callback
            for (var callback of list) {
                if (callback.checkHandle(handle, thisObj)) {
                    callback.args = args;
                    return callback;
                }
            }
            callback = this.get(handle, thisObj, ...args);
            list.push(callback);
            return callback;
        }
    }
}

