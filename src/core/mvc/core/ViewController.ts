namespace jy {

    export interface ViewController {
        /**
         * 面板加入到舞台时执行
         */
        onAwake?();
        /**
         * 面板从舞台移除时执行
         */
        onSleep?();
    }

    /**
     * 可以调用 @d_interest 的视图  
     * 可以进行关注facade中的事件
     * 
     * @export
     * @class ViewController
     * @extends {FHost}
     */
    export class ViewController extends FHost {

        /**
		 * 加载状态
		 */
        protected _ready: boolean;

        /**
         * 关注列表
         */
        protected _interests: { [index: string]: Interest };
        interestChecked: boolean;
        _awakeCallers: { (e?: egret.Event): void }[];

        /**
         * 定时回调的列表
         */
        _tList: $CallbackInfo[];

        /**
         * 用于内部增加关注
         * 
         * @param {Key} eventType 
         * @param {{ (e?: egret.Event): void }} handler 
         * @param {boolean} [triggerOnStage] 
         * @param {number} [priority] 
         */
        interest(eventType: Key, handler: { (e?: egret.Event): void }, triggerOnStage?: boolean, priority?: number) {
            let ins = <Interest>{};
            ins.handler = handler;
            ins.priority = priority || 0;
            ins.trigger = triggerOnStage;
            let _interests = this._interests;
            if (!_interests) {
                this._interests = _interests = {};
            }
            _interests[eventType] = ins;
            if (triggerOnStage) {
                let _awakeCallers = this._awakeCallers;
                if (!_awakeCallers) {
                    this._awakeCallers = _awakeCallers = [];
                }
                _awakeCallers.pushOnce(handler);
            }
        }

        removeSkinListener(skin: egret.DisplayObject) {
            if (skin) {
                skin.off(EgretEvent.REMOVED_FROM_STAGE, this.onStage, this);
                skin.off(EgretEvent.ADDED_TO_STAGE, this.onStage, this);
            }
        }

        addSkinListener(skin: egret.DisplayObject) {
            if (skin) {
                skin.on(EgretEvent.REMOVED_FROM_STAGE, this.onStage, this);
                skin.on(EgretEvent.ADDED_TO_STAGE, this.onStage, this);
            }
        }

        /**
         * 绑定定时处理的回调函数
         *
         * @param {Function} callback 执行回调函数
         * @param {boolean} [trigger=true] 是否理解执行 
         * @param {number} [time=Time.ONE_SECOND]
         * @param {any} [thisObj=this]
         * @param {any} args
         * @memberof ViewController
         */
        bindTimer(callback: Function, trigger = true, time = Time.ONE_SECOND, thisObj = this, ...args) {
            let _tList = this._tList;
            if (!_tList) {
                this._tList = _tList = [];
            }
            let info = CallbackInfo.addToList(_tList, callback, thisObj, ...args);
            info.time = time;
            TimerUtil.add(time, info);
            if (trigger) {
                info.execute(false);
            }
        }

        /**
         * 解除定时回调函数的绑定
         * @param callback 
         * @param time 
         * @param thisObj 
         */
        looseTimer(callback: Function, time = Time.ONE_SECOND, thisObj = this) {
            let list = this._tList;
            if (list) {
                let info = CallbackInfo.removeFromList(list, callback, thisObj);
                if (info) {
                    TimerUtil.remove(time, info);
                    info.recycle();
                }
            }
        }

        /**
         * 添加到舞台时，自动添加定时回调
         */
        awakeTimer() {
            let list = this._tList;
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    const cb = list[i];
                    TimerUtil.add(cb.time, cb);
                }
            }
        }

        /**
         * 从舞台移除时候，自动移除定时回调
         */
        sleepTimer() {
            let list = this._tList;
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    const cb = list[i];
                    TimerUtil.remove(cb.time, cb);
                }
            }
        }

        public get isReady() {
            return this._ready;
        }
        onStage(e: egret.Event) {
            this.checkInterest();
            if (!this._ready) return;
            this.stageChange(e.type == EgretEvent.ADDED_TO_STAGE);
        }

        stageChange(onStage: boolean) {
            const _interests = this._interests;
            let type: string, ins: Interest;
            if (onStage) {
                //加入关注的事件
                for (type in _interests) {
                    ins = _interests[type];
                    on(type, ins.handler, this, ins.priority);
                }
                const _awakeCallers = this._awakeCallers;
                for (let i = 0; i < _awakeCallers.length; i++) {
                    _awakeCallers[i].call(this);
                }
                //检查timer绑定
                this.awakeTimer();
                if (this.onAwake) {
                    this.onAwake();
                }
            } else {
                for (type in _interests) {
                    ins = _interests[type];
                    off(type, ins.handler, this);
                }
                this.sleepTimer();
                if (this.onSleep) {
                    this.onSleep();
                }
            }
        }

        checkInterest() {
            if (!this.interestChecked) {
                let _awakeCallers = this._awakeCallers;
                if (!_awakeCallers) {
                    this._awakeCallers = _awakeCallers = [];
                }
                const _interests = this._interests;
                for (let type in _interests) {
                    let ins = _interests[type];
                    if (ins.trigger) {
                        _awakeCallers.pushOnce(ins.handler);
                    }
                }
                this.interestChecked = true;
            }
        }
    }

    export interface Interest {
        /**
         * 回调函数
         */
        handler: (e?: egret.Event) => void;
        /**
         * 
         * 优先级
         * @type {number}
         */
        priority: number;

        /**
         * 
         * 添加到舞台的时候，立即执行一次回调函数
         * @type {boolean}
         */
        trigger: boolean;

        /**
         * 是否为私有监听，此值设置为true则子类不会继承事件监听  
         * 否则子类将继承事件监听
         */
        isPri?: boolean;
    }

    /**
     * 使用@d_interest 注入 添加关注
     * 关注为事件处理回调，只会在awake时，添加到事件监听列表
     * 在sleep时，从事件监听列表中移除
     * @param {Key} type                         关注的事件
     * @param {(e?: Event) => void} handler          回调函数
     * @param {boolean} [triggerOnStage=false]      添加到舞台的时候，会立即执行一次，`<font color="#f00">`注意，处理回调必须能支持不传event的情况`
     * @param {boolean} [isPrivate=false]           是否为私有方法，如果标记为私有方法，则不会被子类的关注继承
     * @param {number} [priority=0]                 优先级，默认为0
     */
    export function d_interest(eventType: Key, triggerOnStage?: boolean, isPrivate?: boolean, priority?: number) {
        const pKey = "_interests";
        return function (target: any, _: string, value: any) {
            let _interests: { [eventType: string]: Interest };
            if (target.hasOwnProperty(pKey)) {
                _interests = target[pKey];
            } else {
                //未赋值前，先取值，可取到父级数据，避免使用  Object.getPrototypeOf(target)，ES5没此方法
                const inherit: { [eventType: string]: Interest } = target[pKey];
                target[pKey] = _interests = {};
                if (inherit) {//继承父级可继承的关注列表
                    for (let k in inherit) {
                        let int = inherit[k];
                        if (!int.isPri) {
                            _interests[k] = int;
                        }
                    }
                }
            }
            _interests[eventType] = { handler: value.value, priority, trigger: triggerOnStage, isPri: isPrivate };
        }
    }
}