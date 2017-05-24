module junyou {
    /**
     * 绑定属性名，当属性值发生改变时，可自动对外抛eventType事件
     * 
     * @export
     * @param {(string | number)} eventType     事件类型
     * @param {boolean} [selfDispatch]          默认false，使用Facade抛事件，event.data为实例本身  
     *                                          如果为true，需要为EventDispatcher的实现，会使用自身抛事件  
     * @returns                                 
     */
    export function d_fire(eventType: string | number, selfDispatch?: boolean) {
        return function (target: any, value: any) {
            new Watcher(value, function (this: egret.EventDispatcher) {
                if (selfDispatch) {
                    if (typeof this.dispatch === "function") {
                        this.dispatch(eventType);
                    }
                } else {
                    dispatch(eventType, this);
                }
            }).reset(target);
            //此处的target为prototype
            //事件回调时候，this为实例
        }
    }

    /**
     * 使用微软vs code中使用的代码  
     * 用于一些 lazy 的调用
     * https://github.com/Microsoft/vscode/blob/master/src/vs/base/common/decorators.ts
     * 
     * @export
     * @param {*} target 
     * @param {string} key 
     * @param {*} descriptor 
     */
    export function d_memoize(target: any, key: string, descriptor: any) {
        let fnKey: string = null;
        let fn: Function = null;

        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
        } else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }

        if (!fn) {
            throw new Error('not supported');
        }

        const memoizeKey = `$memoize$${key}`;

        descriptor[fnKey] = function (...args: any[]) {
            if (!this.hasOwnProperty(memoizeKey)) {
                Object.defineProperty(this, memoizeKey, {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: fn.apply(this, args)
                });
            }
            return this[memoizeKey];
        };
    }

    /**
     * @private
     */
    const _$l = "__listeners__";
    /**
     * @private
     */
    const _$b = "__bindables__";
    /**
     * @private
     */
    var _$c = 0;



    function notifyListener(host: any, property: string): void {
        var list: any[] = host[_$l];
        var length = list.length;
        for (var i = 0; i < length; i += 2) {
            var listener: Function = list[i];
            var target: any = list[i + 1];
            listener.call(target, property, host);
        }
    }

    /**
     * @language en_US
     * The Watcher class defines utility method that you can use with bindable properties.
     * These methods let you define an event handler that is executed whenever a bindable property is updated.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    /**
     * @language zh_CN
     * Watcher 类能够监视可绑定属性的改变，您可以定义一个事件处理函数作为 Watcher 的回调方法，在每次可绑定属性的值改变时都执行此函数。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    export class Watcher {

        /**
         * @language en_US
         * Creates and starts a Watcher instance.
         * The Watcher can only watch the property of a Object which host is instance of egret.IEventDispatcher.
         * @param host The object that hosts the property or property chain to be watched.
         * You can use the use the <code>reset()</code> method to change the value of the <code>host</code> argument
         * after creating the Watcher instance.
         * The <code>host</code> maintains a list of <code>handlers</code> to invoke when <code>prop</code> changes.
         * @param chain A value specifying the property or chain to be watched.
         * For example, to watch the property <code>host.a.b.c</code>,
         * call the method as: <code>watch(host, ["a","b","c"], ...)</code>.
         * @param handler  An event handler function called when the value of the watched property
         * (or any property in a watched chain) is modified.
         * @param thisObject <code>this</code> object of which binding with handler
         * @returns he ChangeWatcher instance, if at least one property name has been specified to
         * the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建并启动 Watcher 实例。注意：Watcher 只能监视 host 为 egret.IEventDispatcher 对象的属性改变。若属性链中某个属性所对应的实例不是 egret.IEventDispatcher，
         * 则属性链中在它之后的属性改变将无法检测到。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 创建Watcher实例后，您可以利用<code>reset()</code>方法更改<code>host</code>参数的值。
         * 当<code>prop</code>改变的时候，会使得host对应的一系列<code>handlers</code>被触发。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：watch¬(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static watch<T>(host: T, chain: (keyof T)[], handler: (value: any) => void, thisObject: any): Watcher {
            if (DEBUG) {
                if (!chain) {
                    egret.$error(1003, "chain");
                }
            }
            if (chain.length > 0) {
                var property = chain.shift();
                var next = Watcher.watch(null, chain, handler, thisObject);
                var watcher = new Watcher(property, handler, thisObject, next);
                watcher.reset(host);
                return watcher;
            }
            else {
                return;
            }
        }

        /**
         * @private
         * 检查属性是否可以绑定。若还未绑定，尝试添加绑定事件。若是只读或只写属性，返回false。
         */
        private static checkBindable<T>(host: T, property: keyof T): boolean {
            let list: string[] = host[_$b];
            if (list && list.indexOf(property) != -1) {
                return true;
            }
            let isEventDispatcher = egret.is(host, "egret.IEventDispatcher");
            if (!isEventDispatcher && !host[_$l]) {
                host[_$l] = [];
            }
            let data: PropertyDescriptor = host.getPropertyDescriptor(property);
            if (data && data.set && data.get) {
                let orgSet = data.set;
                data.set = function (value: any) {
                    if (this[property] != value) {
                        orgSet.call(this, value);
                        if (isEventDispatcher) {
                            PropertyEvent.dispatchPropertyEvent(this, EventConst.PROPERTY_CHANGE, property);
                        }
                        else {
                            notifyListener(this, property);
                        }
                    }
                };
            }
            else if (!data || (!data.get && !data.set)) {
                _$c++;
                let newProp = "_" + _$c + property;
                host[newProp] = data ? data.value : null;
                data = <any>{ enumerable: true, configurable: true };
                data.get = function (): any {
                    return this[newProp];
                };
                data.set = function (value: any) {
                    if (this[newProp] != value) {
                        this[newProp] = value;
                        if (isEventDispatcher) {
                            PropertyEvent.dispatchPropertyEvent(this, EventConst.PROPERTY_CHANGE, property);
                        }
                        else {
                            notifyListener(this, property);
                        }
                    }
                };
            }
            else {
                return false;
            }
            Object.defineProperty(host, property, data);
            registerBindable(host, property);
        }

        /**
         * Creates an instance of Watcher.
         * 
         * @param {string} property                 监听的属性
         * @param {(value: any) => void} handler    回调函数
         * @param {*} [thisObject]                  回调函数的this对象，如果不设置this，则当监听对象属性变化时，将以监听的对象作为this参数，进行回调
         * @param {Watcher} [next]
         */
        public constructor(property: string, handler: (value: any) => void, thisObject?: any, next?: Watcher) {
            this.property = property;
            this.handler = handler;
            this.next = next;
            this.thisObject = thisObject;
        }

        /**
         * @private
         */
        private host: any;

        /**
         * @private
         */
        private property: string;

        /**
         * @private
         */
        private handler: (value: any) => void;

        /**
         * @private
         */
        private thisObject: any;

        /**
         * @private
         */
        private next: Watcher;

        /**
         * @private
         */
        private isExecuting: boolean = false;

        /**
         * @language en_US
         * Detaches this Watcher instance, and its handler function, from the current host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前宿主中断开此 Watcher 实例及其处理函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public unwatch(): void {
            this.reset(null);
            this.handler = null;
            if (this.next) {
                this.next.handler = null;
            }
        }

        /**
         * @language en_US
         * Retrieves the current value of the watched property or property chain, or null if the host object is null.
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检索观察的属性或属性链的当前值，当宿主对象为空时此值为空。
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getValue(): any {
            if (this.next) {
                return this.next.getValue();
            }
            return this.getHostPropertyValue();
        }

        /**
         * @language en_US
         * Sets the handler function.s
         * @param handler The handler function. This argument must not be null.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置处理函数。
         * @param handler 处理函数，此参数必须为非空。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setHandler(handler: (value: any) => void, thisObject: any): void {
            this.handler = handler;
            this.thisObject = thisObject;
            if (this.next) {
                this.next.setHandler(handler, thisObject);
            }

        }

        /**
         * @language en_US
         * Resets this ChangeWatcher instance to use a new host object.
         * You can call this method to reuse a watcher instance on a different host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 重置此 Watcher 实例使用新的宿主对象。
         * 您可以通过该方法实现一个Watcher实例用于不同的宿主。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public reset(newHost: any) {
            var oldHost = this.host;
            if (oldHost) {
                if (oldHost instanceof egret.EventDispatcher) {
                    oldHost.off(EventConst.PROPERTY_CHANGE, this.wrapHandler, this);
                }
                else {
                    var list: any[] = oldHost[_$l];
                    var index = list.indexOf(this);
                    list.splice(index - 1, 2);
                }
            }

            this.host = newHost;

            if (newHost) {
                Watcher.checkBindable(newHost, this.property);
                if (newHost instanceof egret.EventDispatcher) {
                    newHost.on(EventConst.PROPERTY_CHANGE, this.wrapHandler, this, false, 100);
                }
                else {
                    var list: any[] = newHost[_$l];
                    list.push(this.onPropertyChange);
                    list.push(this);
                }
            }


            if (this.next) {
                this.next.reset(this.getHostPropertyValue());
            }
            return this;
        }


        /**
         * @private
         *
         * @returns
         */
        private getHostPropertyValue(): any {
            return this.host ? this.host[this.property] : null;
        }

        /**
         * @private
         */
        private wrapHandler(event: PropertyEvent): void {
            this.onPropertyChange(event.property, event.currentTarget);
        }

        /**
         * @private
         */
        private onPropertyChange(property: string, dispatcher: any): void {
            if (property == this.property && !this.isExecuting) {
                try {
                    this.isExecuting = true;
                    if (this.next)
                        this.next.reset(this.getHostPropertyValue());
                    if (this.thisObject) {
                        this.handler.call(this.thisObject, this.getValue());
                    } else {
                        this.handler.call(dispatcher, this.getValue());
                    }
                }
                finally {
                    this.isExecuting = false;
                }
            }
        }
    }

}

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module junyou {

    /**
     * @language en_US
     * The Binding class defines utility methods for performing data binding.
     * You can use the methods defined in this class to configure data bindings.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     */
    /**
     * @language zh_CN
     * 绑定工具类，用于执行数据绑定用的方法集。您可以使用此类中定义的方法来配置数据绑定。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     */
    export class Binding {

        /**
         * @language en_US
         * Binds a property, <prop>prop</code> on the <code>target</code> Object, to a bindable property or peoperty chain.
         * @param host The object that hosts the property or property chain to be watched.
         * The <code>host</code> maintains a list of <code>targets</code> to update theirs <code>prop</code> when <code>chain</code> changes.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property <code>host.a.b.c</code>,
         * you need call the method like this: <code>indProperty(host, ["a","b","c"], ...)</code>
         * @param target The Object defining the property to be bound to <code>chain</code>.
         * @param prop The name of the public property defined in the <code>site</code> Object to be bound.
         * @returns A ChangeWatcher instance, if at least one property name has been specified
         * to the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绑定一个对象的属性值到要监视的对象属性上。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
         * @param target 本次绑定要更新的目标对象。
         * @param prop 本次绑定要更新的目标属性名称。
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static bindProperty<T>(host: T, chain: (keyof T)[], target: any, prop: string): Watcher {
            var watcher = Watcher.watch(host, chain, null, null);
            if (watcher) {
                var assign = function (value: any): void {
                    target[prop] = value;
                };
                watcher.setHandler(assign, null);
                assign(watcher.getValue());
            }
            return watcher;
        }

        /**
         * @language en_US
         * Binds a callback, <prop>handler</code> on the <code>target</code> Object, to a bindable property or peoperty chain.
         * Callback method to invoke with an argument of the current value of <code>chain</code> when that value changes.
         * @param host The object that hosts the property or property chain to be watched.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property <code>host.a.b.c</code>,
         * you need call the method like this: <code>indProperty(host, ["a","b","c"], ...)</code>
         * @param handler method to invoke with an argument of the current value of <code>chain</code> when that value changes.
         * @param thisObject <code>this</code> object of binding method
         * @returns A ChangeWatcher instance, if at least one property name has been  specified to the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
         * @param host 用于承载要监视的属性或属性链的对象。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static bindHandler<T>(host: T, chain: (keyof T)[], handler: (value: any) => void, thisObject: any): Watcher {
            var watcher = Watcher.watch(host, chain, handler, thisObject);
            if (watcher) {
                handler.call(thisObject, watcher.getValue());
            }
            return watcher;
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module junyou {
    export const enum EventConst {
        /**
         * 属性改变
         */
        PROPERTY_CHANGE = -2000
    }
    /**
     * @language en_US
     * The PropertyChangeEvent class represents the event object
     * passed to the event listener when one of the properties of
     * an object has changed, and provides information about the change.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/PropertyEventExample.ts
     */
    /**
     * @language zh_CN
     * 对象的一个属性发生更改时传递到事件侦听器的事件。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/PropertyEventExample.ts
     */
    export class PropertyEvent extends egret.Event {

        /**
         * @language en_US
         * Constructor.
         *
         * @param type The event type; indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble
         * up the display list hierarchy.
         * @param cancelable Specifies whether the behavior
         * associated with the event can be prevented.
         * @param property Name of the property that changed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个属性改变事件。
         *
         * @param type 事件类型；指示触发事件的动作。
         * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
         * @param cancelable 指定是否可以防止与事件相关联的行为。
         * @param property 发生改变的属性名称。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, property?: string) {
            super(type, bubbles, cancelable);
            this.property = property;
        }

        /**
         * @language en_US
         * Name of the property that changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 发生改变的属性名称。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public property: string;

        /**
         * @language en_US
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         *
         * @param target the target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param property Name of the property that changed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 EventDispatcher 对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标
         * @param eventType 事件类型；指示触发事件的动作。
         * @param property 发生改变的属性名称。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static dispatchPropertyEvent(target: egret.EventDispatcher, eventType: Key, property?: string): boolean {
            if (!target.hasListen(eventType)) {
                return true;
            }
            var event = egret.Event.create(PropertyEvent, <any>eventType);
            event.property = property;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }
    }

}

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module junyou {

    var key = "__bindables__";

    /**
     * @language en_US
     * Register a property of an instance is can be bound.
     * This method is ususally invoked by Watcher class.
     *
     * @param instance the instance to be registered.
     * @param property the property of specified instance to be registered.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 标记实例的一个属性是可绑定的,此方法通常由 Watcher 类调用。
     *
     * @param instance 要标记的实例
     * @param property 可绑定的属性。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export function registerBindable(instance: any, property: string): void {
        if (DEBUG) {
            if (!instance) {
                egret.$error(1003, "instance");
            }
            if (!property) {
                egret.$error(1003, "property");
            }
        }

        if (instance.hasOwnProperty(key)) {
            instance[key].push(property);
        }
        else {
            var list = [property];
            if (instance[key]) {
                list = instance[key].concat(list);
            }
            instance[key] = list;
        }
    }
}