module junyou {

    /**
     * 可回收的对象
     * 
     * @export
     * @interface IRecyclable
     */
    export interface IRecyclable {
        /**
         * 回收时触发
         */
        onRecycle?: { () };
        /**
         * 启用时触发
         */
        onSpawn?: { () };

        /**
         * 回收对象的唯一自增标识  
         * 从回收池取出后，会变化  
         * 此属性只有在`DEBUG`时有效
         */
        _insid?: number;
    }

	/**
	 * 回收池
	 * @author 3tion
	 *
	 */
    export class RecyclablePool<T extends IRecyclable> {

        private _pool: T[];
        private _max: number;
        private _TCreator: { new (): T } | { (): T };

        public getInstance(): T {
            var ins: T;
            var pool = this._pool;
            if (pool.length) {
                ins = pool.pop();
            } else {
                ins = new (this._TCreator as any)();
            }
            if (typeof ins.onSpawn === "function") {
                ins.onSpawn();
            }
            if (DEBUG) {
                ins._insid = _recid++;
            }
            return ins;
        }

        /**
         * 回收
         */
        public recycle(t: T) {
            let pool = this._pool;
            let idx = pool.indexOf(t);
            if (!~idx) {//不在池中才进行回收
                if (typeof t["onRecycle"] === "function") {
                    t.onRecycle();
                }
                if (pool.length < this._max) {
                    pool.push(t);
                }
            }
        }

        public constructor(TCreator: { new (): T } | { (): T }, max = 100) {
            this._pool = [];
            this._max = max;
            this._TCreator = TCreator;
        }
    }

    export interface RecyclablePool<T extends IRecyclable> {
        /**
         * getInstance的简写别名
         * 
         * @returns {T} 
         * 
         * @memberof RecyclablePool
         */
        get(): T
    }
    let rpt = RecyclablePool.prototype;

    rpt.get = rpt.getInstance;

    export declare type Recyclable<T extends IRecyclable> = T & { recycle(): void };

    if (DEBUG) {
        var _recid = 0;
    }

    /**
     * 获取一个recyclable的对象
     * 
     * @export
     * @template T
     * @param {{ new (): T; _pool?: RecyclablePool<T> }} clazz
     * @returns {(T & { recycle() })}
     */
    export function recyclable<T extends IRecyclable>(clazz: { new (): T; _pool?: RecyclablePool<T> }): Recyclable<T> {
        let pool = clazz._pool;
        if (!pool) {
            pool = new RecyclablePool(clazz);
            Object.defineProperty(clazz, "_pool", {
                value: pool
            })
            let pt = clazz.prototype;
            if (pt.recycle == undefined) {
                pt.recycle = function () {
                    pool.recycle(this);
                };
            }
        }
        return pool.getInstance() as Recyclable<T>;
    }
}
