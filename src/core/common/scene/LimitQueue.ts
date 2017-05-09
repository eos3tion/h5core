module junyou {
    /**
     * description
     * @author pb
     */
    export class LimitQueue implements ILimit {
        protected _queue: ILimit[];
        protected _currentState: number;
        protected _listenerMachine: IStateListener;

        constructor() {
            this._queue = [];
        }

        public set listener(value: IStateListener) {
            this._listenerMachine = value;
        }

        public get listener(): IStateListener {
            return this._listenerMachine;
        }

        public addLimiter(item: ILimit): boolean {
            if (this._queue.indexOf(item) != -1) {
                return false;
            }
            item.setState(this._currentState);
            this._queue.push(item);
            return true;
        }

		/**
		 * 
		 * @param value
		 * 
		 */
        public setState(value: number): void {
            this._currentState = value;
            let queue = this._queue;
            if (queue) {
                let item: ILimit;
                for (item of queue) {
                    item.setState(value);
                }
            }
            //查看是否有侦听状态变化的对像;
            if (this._listenerMachine) {
                this._listenerMachine.setState(value);
            }
        }


        public removeLimiter(item: ILimit): boolean {
            let index: number = this._queue.indexOf(item);
            if (index == -1) {
                return false;
            }
            this._queue.splice(index, 1);
            return true;
        }

        public clear(): void {
            this._queue.length = 0;
        }

        /**
         * 是否被限制了
         * @param type
         * @return 
         * 
         */
        public check(type: number): boolean {
            let queue = this._queue;
            if (queue) {
                let limit: ILimit;
                for (limit of queue) {
                    if (limit && limit.check(type)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}