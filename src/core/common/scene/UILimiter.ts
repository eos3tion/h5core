namespace jy {
    export const enum LimitScene {
        /**
         * 默认场景
         */
        Default = 0,
    }

    /**
    * 限制列队
    * @author 3tion
    */
    export class LimitQueue implements ILimit {
        protected _queue: ILimit[];
        protected _current: Key;
        listener: IStateListener;

        constructor() {
            this._queue = [];
            this.listener = new StateMachine();
        }

        public addLimiter(item: ILimit) {
            let queue = this._queue;
            if (queue.indexOf(item) > -1) {
                item.setState(this._current);
                queue.push(item);
                return true;
            }
        }

        /**
         * 设置状态
         * @param value
         * 
         */
        public setState(value: Key) {
            this._current = value;
            let queue = this._queue;
            if (queue) {
                for (let i = 0; i < queue.length; i++) {
                    let item = queue[i];
                    item.setState(value);
                }
            }
            let lm = this.listener;
            //查看是否有侦听状态变化的对像;
            if (lm) {
                lm.setState(value);
            }
        }


        public removeLimiter(item: ILimit): boolean {
            return this._queue.remove(item);
        }

        public clear() {
            this._queue.length = 0;
        }

        /**
         * 是否被限制了
         * @param type
         * @return 
         * 
         */
        public check(type: Key) {
            let queue = this._queue;
            if (queue) {
                for (let i = 0; i < queue.length; i++) {
                    let limit = queue[i];
                    if (limit && limit.check(type)) {
                        return true;
                    }
                }
            }
        }
    }

    /**
     * 像浏览器的历史记录; 
     */
    const historys: Key[] = [];
    let _currentState: Key;
    export interface UILimiterType {
        impl: LimitQueue;
        /**
         * 最大历史数
         * 
         * @type {number}
         * @memberof UILimiterType
         */
        MaxHistory: number;
        readonly current: Key;
        /**
         * 取得状态侦听管理器(以便注册关注的状态)
         * 
         * @type {StateMachine}
         * @memberof UILimiterType
         */
        readonly listener: StateMachine;
        enter(scene: Key): void;
        exit(scene?: Key): void;
        check(scene: Key): boolean;
    }
    export const UILimiter: UILimiterType = {
        impl: new LimitQueue(),
        MaxHistory: 5,
        get current(): Key {
            return _currentState;
        },

        /** 
         * 取得状态侦听管理器(以便注册关注的状态)
         * @return 
         * 
         */
        get listener(): StateMachine {
            return <StateMachine>this.impl.listener;
        },

        enter(this: UILimiterType, scene: Key) {
            if (_currentState != scene) {
                _currentState = scene;
                this.impl.setState(scene);
                historys.push(scene);
                //只存5个历史记录;
                if (historys.length > this.MaxHistory) {
                    historys.shift();
                }
            }
        },
        /**
         * 退出
         * 
         * @param {Key} [scene] 无法得到你当前切入的状态时,除非非常确定不会重复调用两次,否者不允许不传值
         * @returns 
         */
        exit(this: UILimiterType, scene?: Key) {
            scene = scene || _currentState;
            if (_currentState != scene) {
                return;
            }
            let len = historys.length;
            //弹出当前记录;
            historys.pop();
            //还原上一个记录;
            let last = len > 1 ? historys.pop() : LimitScene.Default;
            this.enter(last);
        },
        /**
         * 
         * @param {Key} scene 被检查的Scene
         * @returns {boolean} 检查是否被限制 (true为被限制，false没有限制) 
         */
        check(this: UILimiterType, scene: Key): boolean {
            return this.impl.check(scene);
        }
    }

    export function addToStates(value: IStateSwitcher, ...ids: Key[]) {
        UILimiter.listener.addToStates(value, ...ids);
    }

    export function addToState(id: Key, value: IStateSwitcher) {
        UILimiter.listener.addToState(id, value);
    }
}