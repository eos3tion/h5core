module junyou {
    /**
     * description
     * @author pb
     */
    export class UILimiter {
        public static imple: LimitQueue = new LimitQueue();
		/**
		 * 像浏览器的历史记录; 
		 */
        private static historys: number[] = [];
        private static _currentState: number;

        constructor() {
        }

		/**
		 * 获取当前state 
		 * @return 
		 * 
		 */
        public static get currentState(): number {
            return this._currentState;
        }

		/** 
		 * 取得状态侦听管理器(以便注册关注的状态)
		 * @return 
		 * 
		 */
        public static get listener(): StateListenerMachine {
            return <StateListenerMachine>this.imple.listener;
        }

        public static enter(id: number) {
            if (this._currentState == id) {
                return;
            }
            this._currentState = id;
            this.imple.setState(id);
            this.historys.push(id);
            //只存5个历史记录;
            if (this.historys.length > 5) {
                this.historys.shift();
            }
        }

		/**
		 * 退出
		 * 
		 * 
		 */
        public static exit(id: number) {
            if (!id) {
                id = this._currentState;
            }
            if (this._currentState != id) {
                return;
            }
            let historys = this.historys;
            var len: number = historys.length;
            //弹出当前记录;
            historys.pop();
            //还原上一个记录;
            if (len > 1) {
                this.enter(historys.pop());
            }
            else {
                this.enter(0);
            }
        }

		/**
		 * 检查是否被限制 (true为被限制，false没有限制) 
		 * @param value
		 * 
		 */
        public static check(value: number): boolean {
            return this.imple.check(value);
        }
    }

    export function addToStates(value: IStateSwitcher, ...ids: number[]) {
        UILimiter.listener.addToStates(value, ...ids);
    }

    export function addToState(id: number, value: IStateSwitcher) {
        UILimiter.listener.addToState(id, value);
    }
}