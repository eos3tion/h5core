module junyou {
    /**
     * 状态机
     * @author 3tion
     */
    export class StateListenerMachine implements IStateListener {

        /**
         * 当前状态
         * 
         * @protected
         * @type {Key}
         */
        protected _current: Key;
        protected states: { [index: string]: IStateSwitcher[] };
        protected aways: IStateListener[];

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
            for (let type in args) {
                this.addToState(type, value);
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
            let list = this.states[state];
            if (!list) {
                return false;
            }
            return list.remove(value);
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
            let list= this.states[state];
            if (list) {
                if (~list.indexOf(value)) return;
            }  else{
                this.states[state] = list = [];
            }            
            list.push(value);
            if (this._current == state) {
                value.awakeBy(this._current);
            }
        }

		/**
		 *  清理状态机;
		 *
		 */
        public clear() {
            this.states={};
            this.aways.length=0;
            this._current = undefined;
        }

		/**
		 * 设置当前的状态
		 * @param value
		 *
		 */
        public setState(value: Key) {
            let old = this._current;
            if (old == value) {
                return;
            }
            this._current = value;
            let oldList = this.states[old];
            let newList = this.states[value];
            //旧的关闭
            if (oldList) {
                for (let i=0;i<oldList.length;i++) {
                    let item=oldList[i];
                    if (!newList || !~newList.indexOf(item)) {
                        item.sleepBy(value);
                    }
                }
            }
            //新的开启
            if (newList) {
                for (let i=0;i<newList.length;i++) {
                    let item=newList[i];
                    item.awakeBy(value);
                }
            }
            let aways = this.aways;
            if (aways) {
               for (let i=0;i<aways.length;i++) {
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
        public isInState(switcher: IStateSwitcher, type?: Key): boolean {
            type == void 0 && (type = this._current);
            let list = this.states[type];
            if (list) {
                return list.indexOf(switcher) > -1;
            }
            return false;
        }
    }
}