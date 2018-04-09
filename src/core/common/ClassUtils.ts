module junyou {

    /**
     * 创建器
     */
    export type Creator<T> = { new(): T } | { (): T };
    /**
     * 
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    export class ClassFactory<T>{

        private _creator: Creator<T>;

        private _props: Partial<T>;

        /**
         * @param {Creator<T>} creator 
         * @param {Partial<T>} [props] 属性模板
         * @memberof ClassFactory
         */
        public constructor(creator: Creator<T>, props?: Partial<T>) {
            this._creator = creator;
            this._props = props;
        }

        /**
         * 获取实例
         * 
         * @returns 
         */
        public get() {
            let ins = new (this._creator as any)();
            let p = this._props;
            for (let key in p) {
                ins[key] = p[key];
            }
            return ins;
        }
    }


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
    export class RecyclablePool<T> {

        private _pool: T[];
        private _max: number;
        private _creator: Creator<T>;

        public get(): T {
            let ins: T & IRecyclable;
            let pool = this._pool;
            if (pool.length) {
                ins = pool.pop();
            } else {
                ins = new (this._creator as any)();
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
                if (typeof (t as IRecyclable).onRecycle === "function") {
                    (t as IRecyclable).onRecycle();
                }
                if (pool.length < this._max) {
                    pool.push(t);
                }
            }
        }

        public constructor(TCreator: Creator<T>, max = 100) {
            this._pool = [];
            this._max = max;
            this._creator = TCreator;
        }
    }
    export type Recyclable<T> = T & { recycle(): void };

    if (DEBUG) {
        var _recid = 0;
    }


    /**
     * 获取一个recyclable的对象
     * 
     * @export
     * @template T 
     * @param {({ new(): T & { _pool?: RecyclablePool<T> } })} clazz 
     */
    export function recyclable<T>(clazz: { new(): T & { _pool?: RecyclablePool<T> } }): Recyclable<T>
    /**
     * 使用创建函数进行创建
     * 
     * @export
     * @template T 
     * @param {({ (): T & { _pool?: RecyclablePool<T> } })} clazz 
     * @param {true} addInstanceRecycle
     */
    export function recyclable<T>(clazz: { (): T & { _pool?: RecyclablePool<T> } }, addInstanceRecycle?: boolean): Recyclable<T>
    export function recyclable<T>(clazz: Creator<T> & { _pool?: RecyclablePool<T> }, addInstanceRecycle?: boolean): Recyclable<T> {
        let pool: RecyclablePool<T>;
        if (clazz.hasOwnProperty("_pool")) {
            pool = clazz._pool;
        }
        if (!pool) {
            if (addInstanceRecycle) {
                pool = new RecyclablePool(function () {
                    let ins = new (clazz as any)();
                    ins.recycle = recycle;
                    return ins;
                })

            } else {
                pool = new RecyclablePool(clazz);
                let pt = clazz.prototype;
                if (pt.recycle == undefined) {
                    pt.recycle = recycle;
                }
            }
            Object.defineProperty(clazz, "_pool", {
                value: pool
            })
        }
        return pool.get() as Recyclable<T>;
        function recycle() {
            pool.recycle(this);
        }
    }

    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    export function singleton<T>(clazz: { new(): T; _instance?: T }): T {
        let instance: T;
        if (clazz.hasOwnProperty("_instance")) {
            instance = clazz._instance;
        }
        if (!instance) {
            instance = new clazz;
            Object.defineProperty(clazz, "_instance", {
                value: instance
            })
        }
        return instance;
    }
}