interface $gmType {
    /**
     * 主控类型，包括Proxy和Mediator
     * 
     * @type {{ [index: string]: jy.FHost }}
     * @memberof $gmType
     */
    $: { [index: string]: jy.FHost };
}
namespace jy {

    export declare type InjectProxy = { new(): IAsync } | Key;
    interface InjectProxyBin {
        ref: InjectProxy;
        /**
         * 是否为私有属性，此值设置为true则子类不会继承这个Proxy  
         * 否则子类将继承Proxy
         */
        isPri?: boolean;
    }
	/**
	 * Mediator和Proxy的基类
	 * @author 3tion
	 *
	 */
    export abstract class FHost implements IDepender {

        protected _name: string | number;

        /**
         * 用于处理依赖注入的Proxy
         * 
         * @protected
         * @type {({[index:string]:{ new (): IAsync } | string})}
         * @memberOf FHost
         */
        protected _injectProxys: { [index: string]: InjectProxyBin };

        /**
         * 唯一标识
         */
        public get name(): string | number {
            return this._name;
        }


        constructor(name: string | number) {
            this._name = name;
            this.checkInject();
            if (DEBUG) {
                let classes = $gm.$;
                if (!classes) {
                    $gm.$ = classes = {};
                }
                classes[this["constructor"]["name"]] = this;
            }
        }

        /**
         * 检查依赖注入的数据
         * 
         * @protected
         * 
         * @memberOf FHost
         */
        checkInject() {
            //此注入是对原型进行的注入，无法直接删除，也不要直接做清理
            let idp = this._injectProxys;
            if (idp) {
                let proxyName: Key;
                //检查Proxy
                for (let key in idp) {
                    let { ref } = idp[key];
                    if (typeof ref === "function") {
                        proxyName = Facade.getNameOfInline(ref);
                    } else {
                        proxyName = <any>ref;
                    }
                    let proxy = proxyCall(proxyName);
                    this[key] = proxy;
                    proxy._$isDep = true;
                    this.addDepend(proxy);
                }
            }
        }

        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;


        public addReadyExecute(handle: Function, thisObj: any, ...args) {
            let _asyncHelper = this._asyncHelper;
            if (!_asyncHelper) {
                this._asyncHelper = _asyncHelper = new AsyncHelper();
                _asyncHelper.isReady = this.isReady;
            }
            _asyncHelper.addReadyExecute(handle, thisObj, ...args);
        }

		/**
		 * 作为依赖者的Helper
		 */
        protected _dependerHelper: DependerHelper;

        public get isReady() {
            return false;
        }

        public startSync() {

        }

        /**
		 * 添加依赖项
		 */
        public addDepend(async: IAsync) {
            if (!this._dependerHelper) {
                this._dependerHelper = new DependerHelper(this, this.dependerReadyCheck);
            }
            this._dependerHelper.addDepend(async);
        }


        /**
         * 依赖项，加载完成后的检查
         */
        protected dependerReadyCheck() {

        }


        /**
		 * 模块在Facade注册时执行
		 */
        public onRegister() {

        }

        /**
         * 模块从Facade注销时          
         */
        public onRemove() {

        }

        /**
         * 全部加载好以后要处理的事情<br/>
         * 包括依赖项加载完毕
         */
        protected afterAllReady(): void {
            // to be override

        }
    }

    /**
     * 
     * 附加依赖的Proxy
     * @export
     * @param {({ new (): IAsync } | string)} ref 如果注册的是Class，必须是Inline方式注册的Proxy
     * @returns
     */
    export function d_dependProxy(ref: InjectProxy, isPri?: boolean) {
        const pKey = "_injectProxys";
        return function (target: any, key: string) {
            let _injectProxys: { [index: string]: InjectProxyBin };
            if (target.hasOwnProperty(pKey)) {
                _injectProxys = target[pKey];
            } else {
                //未赋值前，先取值，可取到父级数据，避免使用  Object.getPrototypeOf(target)，ES5没此方法
                const inherit = target[pKey] as { [index: string]: InjectProxyBin };
                target[pKey] = _injectProxys = {};
                if (inherit) {//继承父级可继承的关注列表
                    for (let k in inherit) {
                        let bin = inherit[k];
                        if (!bin.isPri) {
                            _injectProxys[k] = bin;
                        }
                    }
                }
            }
            _injectProxys[key] = { ref, isPri };
        }
    }
}