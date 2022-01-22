namespace jy {

    export const enum ClassConst {
        DebugIDPropertyKey = "_insid"
    }

    export const enum RecycleState {
        /**
         * 未初始化，已回收
         */
        Recycled = 0b00,

        /**
         * 准备回收  
         * 准备放入池，正在执行 onRecycle 方法
         */
        Recycling = 0b01,

        /**
         * 已经初始化完毕
         */
        Spawn = 0b10,

        /**
         * 准备初始化  
         * 已经从回收池中拿出，正在执行 onSpawn 方法
         */
        Spawning = 0b11,

        /**
         * 已从池中拿出的Mask
         */
        SpawnMask = 0b10,

        /**
         * 已经放入池的Mask
         */
        RecycleMask = 0b01,
    }

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
         * @readonly
         */
        $recState?: RecycleState;

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
                if (DEBUG) {
                    Object.defineProperty(ins, ClassConst.DebugIDPropertyKey, {
                        value: 0,
                        enumerable: false,
                        writable: true
                    })
                }
            }
            ins.$recState = RecycleState.Spawning
            if (typeof ins.onSpawn === "function") {
                ins.onSpawn();
            }
            if (DEBUG) {
                ins[ClassConst.DebugIDPropertyKey] = _recid++;
            }
            ins.$recState = RecycleState.Spawn;
            return ins;
        }

        /**
         * 回收
         */
        public recycle(t: T & IRecyclable) {
            const state = t.$recState;
            if (state === RecycleState.Recycling || state === RecycleState.Recycled) {
                return
            }
            const pool = this._pool;
            t.$recState = RecycleState.Recycling;
            if (typeof t.onRecycle === "function") {
                t.onRecycle();
            }
            t.$recState = RecycleState.Recycled;
            if (pool.length < this._max) {
                pool.push(t);
            }
        }

        public constructor(TCreator: Creator<T>, max = 100) {
            this._pool = [];
            this._max = max;
            this._creator = TCreator;
        }
    }
    export type Recyclable<T> = T & { recycle(): void, $recState?: RecycleState };

    if (DEBUG) {
        var _recid = 0;
    }


    /**
     * 获取一个recyclable的对象
     *
     * @export
     * @template T
     * @param {(Creator<T> & { _pool?: RecyclablePool<T> })} clazz 对象定义
     * @param {boolean} [addInstanceRecycle] 是否将回收方法附加在实例上，默认将回收方法放在实例
     * @returns {Recyclable<T>}
     */
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
                if (!pt.hasOwnProperty("recycle")) {
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

    recyclable.recycleList =
        /**
         * 按指定长度，回收Recycleable的数组
         * @param list 要被处理的数组
         * @param len 如果指定的`len`超过数组长度，数组不做任何处理
         */
        function <T>(list: jy.Recyclable<T>[], len: number) {
            let i = len;
            let lLen = list.length;
            if (len < lLen) {
                while (i < list.length) {
                    let recyclable = list[i++];
                    if (recyclable) {
                        recyclable.recycle();
                    }
                }
                list.length = len;
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