module junyou {
    /**
     * 限制列队
     * @author 3tion
     */
    export class LimitQueue implements ILimit {
        protected _queue: ILimit[];
        protected _current: Key;
        protected _listener: IStateListener;

        constructor() {
            this._queue = [];
        }

        public set listener(value: IStateListener) {
            this._listener = value;
        }

        public get listener(): IStateListener {
            return this._listener;
        }

        public addLimiter(item: ILimit): boolean {
            let queue = this._queue;
            if (queue.indexOf(item) != -1) {
                return false;
            }
            item.setState(this._current);
            queue.push(item);
            return true;
        }

		/**
		 * 
		 * @param value
		 * 
		 */
        public setState(value: Key): void {
            this._current = value;
            let queue = this._queue;
            if (queue) {
                for (let i=0;i<queue.length;i++) {
                    let item=queue[i];
                    item.setState(value);
                }
            }
            let lm = this._listener;
            //查看是否有侦听状态变化的对像;
            if (lm) {
                lm.setState(value);
            }
        }


        public removeLimiter(item: ILimit): boolean {
            return this._queue.remove(item);
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
                for (let i=0;i<queue.length;i++) {
                    let limit = queue[i];
                    if (limit && limit.check(type)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}