module junyou {

    /**
     * 代码构建类，用于注册代码
     * @author 3tion
     */
    export class Facade extends egret.EventDispatcher {

        /**
         * 模块脚本的加载路径
         */
        public static Script: string = "modules/{0}.js";

        /**
         * 
         * 获取内部注册的Proxy或者Mediator用于全局注册的名字
         * @static
         * @param {{ new (): any }} inlineRef inlineRef 内部注册的Proxy或者Mediator
         * @param {string} [className]  类名
         * @returns string  内部注册的Proxy或者Mediator用于全局注册的名字
         * 
         * @memberOf Facade
         */
        public static getNameOfInline(inlineRef: { new(): any }, className?: string): string {
            className = className || egret.getQualifiedClassName(inlineRef);
            let name: string;
            if ("NAME" in inlineRef) {//如果有 public static NAME 取这个作为名字
                name = inlineRef["NAME"];
            } else {
                name = className.substr(className.lastIndexOf(".") + 1);
            }
            return name;
        }


        /**
         * 存储的数据Proxy
         */
        protected _proxys: { [index: string]: ScriptHelper<Proxy> };

        /**
         * 存储的Mediator
         */
        protected _mediators: { [index: string]: ScriptHelper<Mediator> };

        /**
         * 模块
         */
        protected _scripts: { [index: string]: ModuleScript };

        /**
         * 模块管理器
         */
        protected _mm: ModuleManager;

        constructor() {
            super();
            this._mediators = {};
            this._scripts = {};
            this._proxys = {};
            this._indecting = [];
        }

        /**
         * 绑定模块管理器
         */
        public bindModuleManager(mm: ModuleManager) {
            mm.init();
            this._mm = mm;
        }

        /**
         * 模块管理器
         * 
         * @readonly
         * 
         * @memberOf Facade
         */
        public get mm() {
            return this._mm;
        }

        protected _removeHost(name: Key, dict: { [index: string]: ScriptHelper<FHost> }) {
            let dele = dict[name];
            let host: FHost;
            if (dele) {
                delete dict[name];
                host = dele.host;
                if (host) {
                    host.onRemove();
                }
            }
            return host;
        }

        /**
         * 移除面板控制器
         */
        public removeMediator(mediatorName: Key) {
            return this._removeHost(mediatorName, this._mediators);
        }


        /**
         * 移除模块  
         * 如果模块被其他模块依赖，此方法并不能清楚依赖引用
         */
        public removeProxy(proxyName: Key) {
            let proxy = this._proxys[proxyName];
            if (proxy.host._$isDep) {
                DEBUG && ThrowError(`模块[${proxyName}]被依赖，不允许移除`, null, true);
                return
            }
            return this._removeHost(proxyName, this._proxys);
        }

        /**
         * 
         * 注册内部模块
         * @param {{ new (): Proxy }} ref Proxy创建器
         * @param {string} [proxyName] 模块名称
         * @param {boolean} [async=false] 是否异步初始化，默认直接初始化
         */
        public registerInlineProxy(ref: { new(): Proxy }, proxyName?: Key, async?: boolean) {
            if (!ref) {
                if (DEBUG) {
                    ThrowError("registerInlineProxy时,没有ref")
                }
                return
            }
            let className = egret.getQualifiedClassName(ref);
            if (!proxyName) {
                proxyName = Facade.getNameOfInline(ref, className);
            }
            this.registerProxyConfig(className, proxyName);
            if (!async) { //如果直接初始化
                let dele = this._proxys[proxyName];
                let host: Proxy = new ref();
                dele.host = host;
                facade.inject(host);
                host.onRegister();
            }
        }

        /**
         * 
         * 注册内部Mediator模块
         * @param {{ new (): Mediator }} ref Mediator创建器
         * @param {string} [mediatorName]   注册的模块名字
         */
        public registerInlineMediator(ref: { new(): Mediator }, mediatorName?: Key) {
            if (!ref) {
                if (DEBUG) {
                    ThrowError(`registerInlineMediator时,没有ref`)
                }
                return
            }
            let className = egret.getQualifiedClassName(ref);
            if (!mediatorName) {
                mediatorName = Facade.getNameOfInline(ref, className);
            }
            this.registerMediatorConfig(className, mediatorName);
        }


        /**
         * 注册Proxy的配置
         * @param className     类名字，完整名字
         * @param name     模块名称
         * @param scriptid      要加载的脚本ID，用于加载脚本代码，空的id表示是主脚本
         */
        public registerProxyConfig(className: string, proxyName: Key, url?: string, scriptid?: string) {
            let dele: ScriptHelper<Proxy>;
            if (DEBUG) {
                dele = this._proxys[proxyName];
                if (dele) {
                    ThrowError("模块定义重复:" + name);
                }
            }
            dele = <ScriptHelper<Proxy>>{};
            dele.scriptid = scriptid;
            dele.className = className;
            dele.name = proxyName;
            dele.url = url;
            this._proxys[proxyName] = dele;
        }


        /**
         * 注册模块的配置 
         * @param className
         * @param name
         * @param scriptid      要加载的脚本ID，用于加载脚本代码
         */
        public registerMediatorConfig(className: string, moduleID: Key, url?: string, scriptid?: string) {
            let dele: ScriptHelper<Mediator>;
            if (DEBUG) {
                dele = this._mediators[moduleID];
                if (dele) {
                    ThrowError("模块定义重复:" + name);
                }
            }
            dele = <ScriptHelper<Mediator>>{};
            dele.scriptid = scriptid;
            dele.className = className;
            dele.name = moduleID;
            dele.url = url;
            this._mediators[moduleID] = dele;
        }

        private getOrCreateScript(dele: ScriptHelper<FHost>) {
            let scriptid = dele.scriptid;
            let script = this._scripts[scriptid];
            if (!script) {
                script = new ModuleScript;
                script.id = scriptid;
                script.url = dele.url;
                this._scripts[scriptid] = script;
            }
            return script;
        }

        /**
         * 获取Proxy
         * 
         * @param {Key} proxyName proxy的名字
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        public getProxy(proxyName: Key, callback?: { (proxy: Proxy, ...args: any[]) }, thisObj?: any, ...args) {
            let dele = this._proxys[proxyName];
            if (!dele) {
                if (DEBUG) {
                    ThrowError("没有注册proxy的关系");
                }
                return
            }
            let bin = <ScriptSolveBin>{};
            bin.dele = dele;
            bin.callback = callback;
            bin.thisObj = thisObj;
            bin.args = args;
            return this._solveScriptCallback(bin);
        }

        /**
         * 以同步方式获取proxy，不会验证proxy是否加载完毕  
         * 有可能无法取到proxy
         * 
         * @param {Key} proxyName 
         * @returns 
         * 
         * @memberOf Facade
         */
        public getProxySync(proxyName: Key) {
            let dele = this._proxys[proxyName];
            if (dele) {
                return dele.host;
            }
        }

        /**
         * 获取Mediator
         * 
         * @param {Key} moduleID 模块ID
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        public getMediator(moduleID: Key, callback?: { (mediator: Mediator, ...args: any[]) }, thisObj?: any, ...args) {
            let dele = this._mediators[moduleID];
            if (!dele) {
                if (DEBUG) {
                    ThrowError("没有注册Mediator的关系");
                }
                return
            }
            let bin = <ScriptSolveBin>{};
            bin.dele = dele;
            bin.callback = callback;
            bin.thisObj = thisObj;
            bin.args = args;
            return this._solveScriptCallback(bin);
        }

        /**
         * 以同步方式获取Mediator，不会验证Mediator是否加载完毕  
         * 有可能无法取到Mediator
         * 
         * @param {Key} moduleID 
         * @returns 
         * 
         * @memberOf Facade
         */
        public getMediatorSync(moduleID: Key) {
            let dele = this._mediators[moduleID];
            if (dele) {
                return dele.host;
            }
        }

        private _solveScriptCallback(bin: ScriptSolveBin) {
            if (bin.dele.scriptid) {
                let script = this.getOrCreateScript(bin.dele);
                if (script.state != RequestState.COMPLETE) {
                    script.callbacks.push(CallbackInfo.get(this._getHost, this, bin));
                    script.load();
                    return;
                }
            }
            //直接回调
            return this._getHost(bin);
        }

        private _getHost(bin: ScriptSolveBin) {
            let dele = bin.dele;
            let host = dele.host;
            if (!host) {
                let ref = egret.getDefinitionByName(dele.className);
                dele.host = host = new ref();
                facade.inject(host);
                host.onRegister();
            }
            let callback = bin.callback;
            if (host.isReady) {
                callback && callback.call(bin.thisObj, host, ...bin.args);
            } else {
                callback && host.addReadyExecute(callback, bin.thisObj, host, ...bin.args);
                host.startSync();
            }
            return host;
        }


        /**
         * 
         * 打开/关闭指定模块
         * @param {(Key)} moduleID      模块id
         * @param {ToggleState} [toggleState]      0 自动切换(默认)<br/>  1 打开模块<br/> -1 关闭模块<br/>  
         * @param {boolean} [showTip=true]          是否显示Tip
         * @param {ModuleParam} [param] 模块参数
         * 
         * @memberOf Facade
         */
        public toggle(moduleID: Key, toggleState?: ToggleState, showTip = true, param?: ModuleParam) {
            if (this._mm) {
                this._mm.toggle(moduleID, toggleState, showTip, param);
            }
        }



        /**
         * 
         * 执行某个模块的方法
         * @param {string} moduleID     模块id
         * @param {boolean} showTip     是否显示Tip，如果无法执行，是否弹出提示
         * @param {string} handlerName  执行的函数名
         * @param {boolean} [show]      执行时，是否将模块显示到舞台
         * @param {any[]} args            函数的参数列表
         * @returns
         */
        public executeMediator(moduleID: Key, showTip: boolean, handlerName: string, show?: boolean, ...args) {
            if (this._mm && this._mm.isModuleOpened(moduleID, showTip)) {
                let hander = show ? this._executeAndShowMediator : this._executeMediator;
                return this.getMediator(moduleID, hander, this, handlerName, ...args);
            }
        }

        /**
         * 不做验证，直接执行mediator的方法
         * 此方法只允许ModuleHandler使用
         * @private
         * @param name          模块id
         * @param showTip       如果无法执行，是否弹出提示
         * @param handlerName   执行的函数名
         * @param args
         */
        public $executeMediator(moduleID: string, handlerName: string, ...args) {
            return this.getMediator(moduleID, this._executeMediator, this, args);
        }

        protected _executeMediator(mediator: Mediator, handlerName: string, ...args: any[]) {
            if (typeof mediator[handlerName] === "function") {
                (<Function>mediator[handlerName]).apply(mediator, args);
            } else if (DEBUG) {
                ThrowError("无法在Mediator：" + mediator.name + "中找到方法[" + handlerName + "]");
            }
        }

        protected _executeAndShowMediator(mediator: Mediator, handlerName: string, ...args: any[]) {
            this.toggle(mediator.name, ToggleState.SHOW, false);//showTip为 false是不用再次提示，executeMediator已经执行过模块是否开启的检查
            this._executeMediator(mediator, handlerName, ...args);
        }


        /**
         * 执行Proxy的方法
         * @param name     proxy名字
         * @param handlerName   函数名字
         * @param args          参数列表
         */
        public executeProxy(proxyName: Key, handlerName: string, ...args) {
            return this.getProxy(proxyName, this._executeProxy, this, handlerName, ...args);
        }

        protected _executeProxy(proxy: Proxy, handlerName: string, ...args: any[]) {
            if (typeof proxy[handlerName] === "function") {
                (<Function>proxy[handlerName]).apply(proxy, args);
            } else if (DEBUG) {
                ThrowError("无法在Proxy：" + proxy.name + "中找到方法[" + handlerName + "]");
            }
        }

        /**
         * 正在注入的对象
         */
        protected _indecting: any[];

        /**
         * 注入数据
         */
        public inject(obj: any) {
            //锁定对象，防止循环注入
            let _indecting = this._indecting;
            if (!~_indecting.indexOf(obj)) {
                _indecting.push(obj);
                this.doInject(obj);
                let idx = _indecting.indexOf(obj);
                _indecting.splice(idx, 1);
            }
        }


        /**
         * 用于子项目扩展
         * @param obj
         */
        doInject(obj: any) {
            //to be override
        }
    }

    export interface ScriptHelper<T> {

        /**
         * 脚本id，空的id表示是主脚本
         */
        scriptid: string;

        /**
         * 主体的类名字
         */
        className: string;

        /**
         * 名字
         */
        name: Key;

        /**
         * 数据主体
         */
        host: T;

        url?: string;
    }

    interface ScriptSolveBin {
        /**
         * 
         * 脚本代理
         * @type {ScriptHelper<FHost>}
         */
        dele: ScriptHelper<FHost>;
        /**
         * 
         * 回调函数
         * @type {{ (m: FHost, args?: any[]) }}
         */
        callback: { (m: FHost, ...args: any[]) };
        /**
         * 
         * 函数的this指针
         * @type {*}
         */
        thisObj: any;
        /**
         * 
         * 参数列表
         * @type {any[]}
         */
        args: any[];
        /**
         * 
         * Mediator专用参数，回调后是否将Mediator对应视图显示在舞台
         * @type {boolean}
         */
        show?: boolean;
    }

    export const facade = new Facade();
    /**
     * 等其他Proxy加载好后回调
     * 
     * @protected
     * @param {(Key)} proxyName
     * @param {{ (proxy: Proxy, args?: any[]) }} callback
     * @param {*} thisObj
     * @param {any} args
     * 
     * @memberOf FHost
     */
    export function proxyCall(proxyName: Key, callback?: { (proxy: Proxy, ...args: any[]) }, thisObj?: any, ...args): Proxy
    export function proxyCall(): Proxy {
        return facade.getProxy.apply(facade, arguments);
    }
    /**
     * 执行Proxy的方法
     * @param name     proxy名字
     * @param handlerName   函数名字
     * @param args          参数列表
     */
    export function proxyExec(proxyName: Key, handlerName: string, ...args): Proxy
    export function proxyExec(): Proxy {
        return facade.executeProxy.apply(facade, arguments);
    }

    /**
     * 等其他Mediator加载好后回调
     * 
     * @protected
     * @param {(Key)} mediatorName
     * @param {{ (mediator: Mediator, args?: any[]) }} callback
     * @param {*} thisObj
     * @param {any} args
     * 
     * @memberOf FHost
     */
    export function mediatorCall(mediatorName: Key, callback?: { (mediator: Mediator, ...args: any[]) }, thisObj?: any, ...args): Mediator
    export function mediatorCall(): Mediator {
        return facade.getMediator.apply(facade, arguments);
    }
    /**
     * 
     * 执行某个模块的方法
     * @param {string} moduleID     模块id
     * @param {boolean} showTip     是否显示Tip，如果无法执行，是否弹出提示
     * @param {string} handlerName  执行的函数名
     * @param {boolean} [show]      执行时，是否将模块显示到舞台
     * @param {any[]} args            函数的参数列表
     * @returns
     */
    export function mediatorExec(moduleID: Key, showTip: boolean, handlerName: string, show?: boolean, ...args): Mediator
    export function mediatorExec(): Mediator {
        return facade.executeMediator.apply(facade, arguments);
    }

    /**
     * 全局抛事件
     * 
     * @export
     * @param {Key} type     事件类型
     * @param {*} [data]        数据
     */
    export function dispatch(type: Key, data?: any) {
        facade.dispatch(type, false, data);
    }
    /**
     * 
     * 打开/关闭指定模块
     * @param {(Key)} moduleID      模块id
     * @param {ToggleState} [toggleState]      0 自动切换(默认)<br/>  1 打开模块<br/> -1 关闭模块<br/>  
     * @param {boolean} [showTip=true]          是否显示Tip
     * @param {ModuleParam} [param] 模块参数
     * 
     * @memberOf Facade
     */
    export function toggle(moduleID: Key, toggleState?: ToggleState, showTip = true, param?: ModuleParam) {
        facade.toggle(moduleID, toggleState, showTip, param);
    }

    /**
     * 
     * 添加事件监听
     * @export
     * @param {(Key)} type
     * @param {Function} listener
     * @param {*} thisObj
     * @param {number} [priority]
     */
    export function on<T>(type: Key, listener: { (this: T, e?: egret.Event) }, thisObj?: T, priority?: number) {
        facade.on(type, listener, thisObj, false, priority);
    }

    /**
     * 单次监听事件
     * 
     * @export
     * @template T 
     * @param {Key} type 
     * @param {{ (this: T, e?: egret.Event) }} listener 
     * @param {T} [thisObj] 
     * @param {number} [priority] 
     */
    export function once<T>(type: Key, listener: { (this: T, e?: egret.Event) }, thisObj?: T, priority?: number) {
        facade.once(type, listener, thisObj, false, priority);
    }

    /**
     * 
     * 移除事件监听
     * @static
     * @param {Key} type
     * @param {Function} listener
     * @param {*} [thisObject]
     */
    export function off(type: Key, listener: Function, thisObject?: any) {
        facade.off(type, listener, thisObject, false);
    }

    /**
     * 检查是否有全局监听
     * 
     * @export
     * @param {Key} type 
     * @returns 
     */
    export function hasListen(type: Key) {
        return facade.hasListen(type);
    }

    export const enum ToggleState {
        HIDE = -1,
        AUTO = 0,
        SHOW = 1
    }
}