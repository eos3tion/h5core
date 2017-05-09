module junyou {
    /**
     * description
     * @author pb
     */
    export class StateListenerMachine implements IStateListener {

        private _currentState: number;
        private states: { [index: number]: IStateSwitcher[] };
        private aways: IStateListener[];

        constructor() {
            this.states = {};
            this.aways = [];
        }

        public add(value: IStateListener) {
            if (!value) {
                ThrowError("addStateListener没有设置正确!");
            }
            this.aways.pushOnce(value);
        }

        public remove(value: IStateListener) {
            this.aways.remove(value);
        }

		/**
		 *  一个侦听加入到多个状态;
		 * @param type
		 * @param args
		 *
		 */
        public addToStates(value: IStateSwitcher, ...args: number[]) {
            if (!value) {
                ThrowError("addToStateList没有设置正确!");
            }
            let type: string;
            for (type in args) {
                this.addToState(+type, value);
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
            let states = this.states;
            if (states) {
                for (let type in states) {
                    this.removeFromState(+type, value);
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
        public removeFromState(state: number, value: IStateSwitcher): boolean {
            let list: IStateSwitcher[] = this.states[state];
            if (!list) {
                return false;
            }
            let index: number = list.indexOf(value);
            if (index == -1) {
                return false;
            }
            list.splice(index, 1);
            return true;
        }


		/**
		 * 单个状态中加入一个侦听;
		 * @param value
		 * @param list
		 *
		 */
        public addToState(state: number, value: IStateSwitcher) {
            if (!value) {
                ThrowError("addToState没有设置正确!");
            }
            let list: IStateSwitcher[] = this.states[state];
            if (!list) {
                list = this.states[state] = [];
            }
            if (list.indexOf(value) != -1) {
                return;
            }
            list.push(value);
            if (this._currentState == state) {
                value.awakeBy(this._currentState);
            }
        }

		/**
		 *  清理状态机;
		 *
		 */
        public clear() {
            this.states = undefined;
            this.aways = undefined;
            this._currentState = undefined;
        }

		/**
		 * 设置当前的状态
		 * @param value
		 *
		 */
        public setState(value: number) {
            let old = this._currentState;
            if (old == value) {
                return;
            }
            this._currentState = value;
            let oldList: IStateSwitcher[] = this.states[old];
            let newList: IStateSwitcher[] = this.states[value];
            let item: IStateSwitcher;
            //旧的关闭
            if (oldList) {
                for (item of oldList) {
                    if (!newList || !~newList.indexOf(item)) {
                        item.sleepBy(value);
                    }
                }
            }
            //新的开启
            if (newList) {
                for (item of newList) {
                    item.awakeBy(value);
                }
            }
            let aways = this.aways;
            if (aways) {
                for (let listener of aways) {
                    listener.setState(value);
                }
            }
        }

		/**
		 * 检查Switcher 
		 * @param switcher
		 * @param type
		 * @return 
		 * 
		 */
        public isInState(switcher: IStateSwitcher, type?: number): boolean {
            type == void 0 && (type = this._currentState);
            let list: IStateSwitcher[] = this.states[type];
            if (list) {
                return list.indexOf(switcher) > -1;
            }
            return false;
        }
    }
}