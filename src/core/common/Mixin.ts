namespace jy {


    /**
     * mixin的基类选项
     * 
     * @export
     * @interface MixinOption
     * @template T
     */
    export interface MixinOption<T> {
        /**
         * 
         * mixin的基类
         * @type {{ new (): T }}
         * @memberOf MixinOption
         */
        clazz: { new(): T },
        /**
         * 
         * 
         * @type {(keyof T)[]}
         * @memberOf MixinOption
         */
        keys: (keyof T)[];
    }

    /**
     * 扩展一个实例，如果A类型实例本身并没有B类型的方法，则直接对实例的属性进行赋值，否则将不会赋值
     * 
     * @export
     * @template A
     * @template B
     * @param {A} instance                  要扩展的实例
     * @param {{ prototype: B }} clazzB     需要扩展的对象方法
     * @param {boolean} override            是否强制覆盖原有方法
     * @returns {(A & B)}
     */
    export function expandInstance<A, B, K extends keyof B>(instance: A, clazzB: { prototype: B }, ...keys: K[]): A & B {
        let bpt = clazzB.prototype;
        for (let name of Object.getOwnPropertyNames(bpt)) {
            if (!keys || ~keys.indexOf(<K>name)) {
                let define = bpt.getPropertyDescriptor(name);
                if (define) {
                    Object.defineProperty(instance, name, define);
                } else {
                    instance[name] = bpt[name];
                }
            }
        }
        return instance as A & B;
    }

    /**
     * 将类型A扩展类型B的指定属性，并返回引用
     * 
     * @export
     * @template A
     * @template B
     * @template K
     * @template B
     * @param {{ prototype: A }} clazzA     要被扩展的类型
     * @param {{ prototype: B }} clazzB     扩展的模板，已经模板的父类型也会作为模板
     * @param {...K[]} keys      如果没有参数，则将B的全部属性复制给类型A
     * @returns {(A & Record<K, B>)}
     */
    export function expand<A, B, K extends keyof B>(clazzA: { prototype: A }, clazzB: { prototype: B }, ...keys: K[]): A & Record<K, B> {
        _expand(clazzA.prototype, clazzB.prototype, keys as string[]);
        return <any>clazzA as A & Record<K, B>;
    }

    function _expand(pt: any, bpt: any, keys: string[]) {
        for (let name of Object.getOwnPropertyNames(bpt)) {
            if (!keys || ~keys.indexOf(name)) {
                if (!pt.hasOwnProperty(name)) {
                    pt[name] = bpt[name];
                }
            }
        }
        let sup = Object.getPrototypeOf(bpt);
        if (sup) {
            return _expand(pt, sup, keys);
        }
    }

    export type Constructor<T> = new (...args: any[]) => T;
    export type MixinCtor<A, B> = new () => A & B & { constructor: MixinCtor<A, B> };

    /**
     * 获取一个复合类型
     * 
     * @export
     * @template A
     * @template B
     * @param {{ prototype: A }} clazzA     类型A
     * @param {{ prototype: B }} clazzB     类型B
     * @returns
     */
    export function getMixin<A, B>(clazzA: { prototype: A }, clazzB: { prototype: B }) {
        let merged: any = function () { }
        if ((Object as any).assign) {//高级版本的浏览器有Object.assign原生方法
            (Object as any).assign(merged.prototype, clazzA.prototype, clazzB.prototype);
        } else {
            merged = expand(merged, clazzA);
            merged = expand(merged, clazzB);
        }
        return <MixinCtor<A, B>>merged;
    }

    /**
     * 拷贝属性
     * 
     * @export
     * @template To 
     * @template From 
     * @param {To} to 
     * @param {From} from 
     * @param {keyof B} key 
     */
    export function copyProperty<To, From>(to: To, from: From, key: keyof From) {
        Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
    }

    /**
     * 批量拷贝属性
     * 
     * @export
     * @template To 
     * @template From 
     * @param {To} to 
     * @param {From} from 
     * @param {...(keyof From)[]} keys 
     */
    export function copyProperties<To, From>(to: To, from: From, ...keys: (keyof From)[]) {
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            copyProperty(to, from, key);
        }
    }
}