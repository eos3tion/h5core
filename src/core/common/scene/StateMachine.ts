module junyou {
    /**
     * 状态机
     * @author 3tion
     */
    export class StateMachine implements IStateListener {

        /**
         * 当前状态
         * 
         * @protected
         * @type {Key}
         */
        protected current: Key;
        protected swis: { [index: string]: IStateSwitcher[] };
        protected liss: IStateListener[];

        /**
         * 是否做上一个进入睡眠状态前的检查
         * 
         * @type {boolean}
         * @memberof StateMachine
         */
        checkBeforeSleep?: boolean;

        constructor() {
            this.swis = {};
            this.liss = [];
        }

        public add(value: IStateListener) {
            if (!value) {
                DEBUG && ThrowError("addStateListener没有设置正确!");
            }
            this.liss.pushOnce(value);
        }

        public remove(value: IStateListener) {
            this.liss.remove(value);
        }

		/**
		 *  一个侦听加入到多个状态;
		 * @param type
		 * @param args
		 *
		 */
        public addToStates(value: IStateSwitcher, ...args: Key[])
        public addToStates() {
            let args = arguments;
            let value: IStateSwitcher = args[0];
            if (!value) {
                DEBUG && ThrowError("addToStateList没有设置正确!");
            }
            for (let i = 1; i < args.length; i++) {
                this.addToState(args[i], value);
            }
        }

		/**
		 * 从所有状态中删除侦听;
		 * @param value
		 *
		 */
        public removeAllState(value: IStateSwitcher) {
            if (!value) {
                return;
            }
            let switchers = this.swis;
            if (switchers) {
                for (let type in switchers) {
                    this.removeFromState(type, value);
                }
            }
        }

		/**
		 * 从单个状态中,删了一个具体侦听;
		 * @param type
		 * @param value
		 * @return
		 *
		 */
        public removeFromState(state: Key, value: IStateSwitcher) {
            let list = this.swis[state];
            return list && list.remove(value);
        }


		/**
		 * 单个状态中加入一个侦听;
		 * @param value
		 * @param list
		 *
		 */
        public addToState(state: Key, value: IStateSwitcher) {
            if (!value) {
                ThrowError("addToState没有设置正确!");
            }
            let list = this.swis[state];
            if (list) {
                if (~list.indexOf(value)) return;
            } else {
                this.swis[state] = list = [];
            }
            list.push(value);
            if (this.current == state) {
                value.awakeBy(this.current);
            }
        }

		/**
		 *  清理状态机;
		 *
		 */
        clear() {
            this.swis = {};
            this.liss.length = 0;
            this.current = undefined;
        }

		/**
		 * 设置当前的状态
		 * @param value
		 *
		 */
        setState(value: Key) {
            let old = this.current;
            if (old == value) {
                return;
            }
            this.current = value;
            let states = this.swis;
            let oldList = states[old];
            let newList = states[value];
            let newLen = newList.length;
            //新的开启
            if (this.checkBeforeSleep && newList) {
                for (let i = 0; i < newLen; i++) {
                    let item = newList[i];
                    item.beforeLastSleep && item.beforeLastSleep(value);
                }
            }
            //旧的关闭
            if (oldList) {
                for (let i = 0; i < oldList.length; i++) {
                    let item = oldList[i];
                    if (!newList || !~newList.indexOf(item)) {
                        item.sleepBy && item.sleepBy(value);
                    }
                }
            }
            //新的开启
            if (newList) {
                for (let i = 0; i < newLen; i++) {
                    let item = newList[i];
                    item.awakeBy && item.awakeBy(value);
                }
            }
            let aways = this.liss;
            if (aways) {
                for (let i = 0; i < aways.length; i++) {
                    aways[i].setState(value);
                }
            }
        }

        /**
         * 检查状态实现(switcher)是否添加到某个状态中
         * 
         * @param {IStateSwitcher} switcher    某个状态实现
         * @param {Key} [type] 状态
         * @returns {boolean} 
         */
        isInState(switcher: IStateSwitcher, type?: Key) {
            type == void 0 && (type = this.current);
            let list = this.swis[type];
            if (list) {
                return list.indexOf(switcher) > -1;
            }
        }
    }
}