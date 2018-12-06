declare function parseInt(s: number, radix?: number): number;
namespace jy {
    /**
     * 获取完整的 PropertyDescriptor
     * 
     * @param {Partial<PropertyDescriptor>} descriptor 
     * @param {boolean} [enumerable=false] 
     * @param {boolean} [writable]
     * @param {boolean} [configurable=true] 
     * @returns 
     */
    export function getDescriptor(descriptor: PropertyDescriptor, enumerable = false, writable = true, configurable = true) {
        if (!descriptor.set && !descriptor.get) {
            descriptor.writable = writable;
        }
        descriptor.configurable = configurable;
        descriptor.enumerable = enumerable;
        return descriptor;
    }

    export function makeDefDescriptors(descriptors: object, enumerable = false, writable = true, configurable = true) {
        for (let key in descriptors) {
            let desc: PropertyDescriptor = descriptors[key];
            let enumer = desc.enumerable == undefined ? enumerable : desc.enumerable;
            let write = desc.writable == undefined ? writable : desc.writable;
            let config = desc.configurable == undefined ? configurable : desc.configurable;
            descriptors[key] = getDescriptor(desc, enumer, write, config);
        }
        return descriptors as PropertyDescriptorMap;
    }
    /**
     * 移除可视对象
     * 
     * @export
     * @param {egret.DisplayObject} display
     */
    export function removeDisplay(display: egret.DisplayObject) {
        if (display && display.parent) {
            display.parent.removeChild(display);
        }
    }
}

/****************************************扩展Object****************************************/
interface Object {
    /**
     * 返回一个浅副本的对象
     * 此对象会拷贝key value
     * 
     * @memberOf Object
     */
    clone(): Object;
    /**
     * 将数据拷贝到 to
     * @param to 目标
     */
    copyto(to: Object);
    /**
     * 获取指定属性的描述，会查找当前数据和原型数据
     * @param property 指定的属性名字
     */
    getPropertyDescriptor(property: string): PropertyDescriptor;

    /**
     * 检查两个对象是否相等，只检查一层
     * 
     * @param {object} checker 
     * @param {...(keyof this)[]} args  如果不设置key列表，则使用checker可遍历的key进行检查
     * 
     * @memberOf Object
     */
    equals(checker: object, ...args: (keyof this)[]);

    /**
     * 
     * 拷贝指定的属性到目标对象
     * @param {object} to           目标对象
     * @param {...string[]} proNames   指定的属性
     */
    copyWith<T>(this: T, to: object, ...proNames: (keyof T)[]): void;
    /**
     * 
     * 获取指定的属性的Object
     * @param {...string[]} proNames 指定的属性
     * @returns {object}
     */
    getSpecObject<T>(this: T, ...proNames: (keyof T)[]): object;
}

Object.defineProperties(Object.prototype, jy.makeDefDescriptors({
    clone: {
        value: function () {
            let o = {};
            for (let n in this) {
                o[n] = this[n];
            }
            return o;
        }
    },
    getPropertyDescriptor: {
        value: function (property: string): any {
            var data = Object.getOwnPropertyDescriptor(this, property);
            if (data) {
                return data;
            }
            var prototype = Object.getPrototypeOf(this);
            if (prototype) {
                return prototype.getPropertyDescriptor(property);
            }
        }
    },
    copyto: {
        value: function (to: Object) {
            for (let p in this) {
                var data: PropertyDescriptor = to.getPropertyDescriptor(p);
                if (!data || (data.set || data.writable)) {// 可进行赋值，防止将属性中的方法给重写
                    to[p] = this[p];
                }
            }
        }
    },
    equals: {
        value: function (checker: Object, ...args: string[]) {
            if (!args.length) {
                args = Object.getOwnPropertyNames(checker);
            }
            for (let i = 0; i < args.length; i++) {
                let key = args[i];
                if (this[key] != checker[key]) {
                    return false;
                }
            }
            return true;
        }
    },
    copyWith: {
        value: function (to: object, ...proNames: string[]) {
            for (let p of proNames) {
                if (p in this) {
                    to[p] = this[p];
                }
            }
        }
    },
    getSpecObject: {
        value: function (...proNames: string[]) {
            let obj = {};
            for (let p of proNames) {
                if (p in this) {
                    if (this[p] != null) {
                        obj[p] = this[p];
                    }
                }
            }
            return obj;
        }
    }
}));
interface Function {

    /**
     * 检查当前类型是否是测试的类型的子类
     * 
     * @param {Function} testBase
     * @returns {boolean}
     * 
     * @memberOf Object
     */
    isSubClass(testBase: Function): boolean;
}
Object.defineProperties(Function.prototype, jy.makeDefDescriptors({
    isSubClass: {
        value: function (testBase: Function) {
            if (typeof testBase !== "function") {
                return false;
            }
            let base = this.prototype;
            let flag = false;
            while (base !== null && base !== Object) {
                if (base === testBase) {
                    flag = true;
                    break;
                }
                base = base.prototype;
            }
            return true;
        }
    }
}));

/****************************************扩展Math****************************************/
interface Math {
    /**
     * 让数值处于指定的最大值和最小值之间，低于最小值取最小值，高于最大值取最大值
     * @param value 要处理的数值
     * @param min   最小值
     * @param max   最大值
     */
    clamp(value: number, min: number, max: number): number;

    /**
     * 从最小值到最大值之间随机[min,max)
     */
    random2(min: number, max: number): number;

    /**
     * 从中间值的正负差值 之间随机 [center-delta,center+delta) 
     * 
     * @param {number} center 
     * @param {number} delta 
     * @returns {number} 
     * @memberof Math
     */
    random3(center: number, delta: number): number;
    /**
     * 角度转弧度的乘数  
     * Math.PI / 180
     * @type {number}
     * @memberOf Math
     */
    DEG_TO_RAD: number;
    /**
     * 弧度转角度的乘数  
     * 180 / Math.PI
     */
    RAD_TO_DEG: number;
    /**
     * 整圆的弧度
     */
    PI2: number;
    /**
     * 90°的弧度
     * 
     * @type {number}
     * @memberOf Math
     */
    PI_1_2: number;
}

Math.DEG_TO_RAD = Math.PI / 180;

Math.RAD_TO_DEG = 180 / Math.PI;

Math.PI2 = 2 * Math.PI;

Math.PI_1_2 = Math.PI * .5;

Math.clamp = (value, min, max) => {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
}

Math.random2 = (min, max) => {
    return min + Math.random() * (max - min);
}

Math.random3 = (center, delta) => {
    return center - delta + Math.random() * 2 * delta;
}

/****************************************扩展Number********************************************/
interface NumberConstructor {
    /**
     * 是否为安全整数
     * 
     * @param {number} value 
     * @returns {boolean} 
     * 
     * @memberOf Number
     */
    isSafeInteger(value: number): boolean;
}
if (!Number.isSafeInteger) {//防止低版本浏览器没有此方法
    Number.isSafeInteger = (value: number) => value < 9007199254740991/*Number.MAX_SAFE_INTEGER*/ && value >= -9007199254740991/*Number.MIN_SAFE_INTEGER*/
}
interface Number {
    /**
     * 对数字进行补0操作
     * @param length 要补的总长度
     * @return 补0之后的字符串
     */
    zeroize(length: number): string;

    /**
     * 数值介于，`min` `max`直接，包含min，max  
     * 即：[min,max]
     * 
     * @param {number} min 
     * @param {number} max 
     * @returns {boolean} 
     * @memberof Number
     */
    between(min: number, max: number): boolean;
}

Object.defineProperties(Number.prototype, jy.makeDefDescriptors({
    zeroize: jy.getDescriptor({
        value: function (this: number, length: number) { return String.zeroize(this, length) }
    }),
    between: jy.getDescriptor({
        value: function (this: number, min: number, max: number) { return min <= this && max >= this }
    })
}));

/****************************************扩展String****************************************/
interface String {
    /**
     * 替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
     */
    substitute(...args): string;
    substitute(args: any[]): string;
    /**
     * 对数字进行补0操作
     * @param length 要补的总长度
     * @return 补0之后的字符串
     */
    zeroize(length: number): string;
    /**
     * 将一个字符串转换成一个很小几率重复的数值  
     * <font color="#ff0000">此方法hash的字符串并不一定唯一，慎用</font>
     */
    hash(): number;

    /**
     * 获取字符串长度，中文方块字符算两个长度
     */
    trueLength(): number;
}


Object.defineProperties(String.prototype, jy.makeDefDescriptors({
    zeroize: {
        value: function (length) { return String.zeroize(this, length) },
    },
    substitute: {
        value: function (this: string) {
            let len = arguments.length;
            if (len > 0) {
                let obj;
                if (len == 1) {
                    obj = arguments[0];
                    if (typeof obj !== "object") {
                        obj = arguments;
                    }
                } else {
                    obj = arguments;
                }
                if ((obj instanceof Object) && !(obj instanceof RegExp)) {
                    return this.replace(/\{(?:%([^{}]+)%)?([^{}]+)\}/g, function (match: string, handler: string, key: string) {
                        //检查key中，是否为%开头，如果是，则尝试按方法处理                        
                        let value = obj[key];
                        if (handler) {//如果有处理器，拆分处理器
                            let func = String.subHandler[handler];
                            if (func) {
                                value = func(value);
                            }
                        }
                        return (value !== undefined) ? '' + value : match;
                    });
                }
            }
            return this.toString();//防止生成String对象，ios反射String对象会当成一个NSDictionary处理
        }
    },
    hash: {
        value: function () {
            var len = this.length;
            var hash = 5381;
            for (var i = 0; i < len; i++) {
                hash += (hash << 5) + this.charCodeAt(i);
            }
            return hash & 0xffffffff;
        }
    },
    trueLength: {
        value: function () {
            let arr: string[] = this.match(/[\u2E80-\u9FBF]/ig);
            return this.length + (arr ? arr.length : 0);
        }
    }
}));
interface StringConstructor {
    /**
     * 对数字进行补0操作
     * @param value 要补0的数值
     * @param length 要补的总长度
     * @return 补0之后的字符串
     */
    zeroize: (value: number, length?: number) => string;
    /**
     * 注册substitute的回调
     * 
     * @param {string} key
     * @param {{ (input: any): string }} handler
     * 
     * @memberOf StringConstructor
     */
    regSubHandler(key: string, handler: { (input: any): string });

    /**
     * substitute的回调函数
     * 
     * @type {Readonly<{ [index: string]: { (input: any): string } }>}
     * @memberOf StringConstructor
     */
    subHandler: Readonly<{ [index: string]: { (input: any): string } }>;
}

String.zeroize = function (value: jy.Key, length = 2) {
    let str = "" + value;
    let zeros = "";
    for (let i = 0, len = length - str.length; i < len; i++) {
        zeros += "0";
    }
    return zeros + str;
};

String.subHandler = {};

String.regSubHandler = function (key, handler) {
    if (DEBUG) {
        if (handler.length != 1) {
            jy.ThrowError(`String.regSubHandler注册的函数，参数数量必须为一个，堆栈：\n${new Error().stack}\n函数内容：${handler.toString()}`);
        }
        if (key in this.subHandler) {
            jy.ThrowError(`String.regSubHandler注册的函数，注册了重复的key[${key}]，堆栈：\n${new Error().stack}`);
        }
    }
    this.subHandler[key] = handler;
}

/****************************************扩展Date****************************************/


interface Date {

    /**
     * 格式化日期
     * 
     * @param {string} mask 时间字符串
     * @param {boolean} [local] 是否基于本地时间显示，目前项目，除了报错信息，其他时间都用UTC时间显示
     * @returns {string} 格式化后的时间
     */
    format(mask: string, local?: boolean): string;
}

Object.defineProperties(Date.prototype, jy.makeDefDescriptors({
    format: {
        value: function (mask, local?: boolean) {
            let d: Date = this;
            return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,2}|m{1,2}|yy(?:yy)?|([hHMs])\1?)/g, function ($0) {
                switch ($0) {
                    case "d": return gd();
                    case "dd": return String.zeroize(gd());
                    case "M": return gM() + 1;
                    case "MM": return String.zeroize(gM() + 1);
                    case "yy": return (gy() + "").substr(2);
                    case "yyyy": return gy();
                    case "h": return gH() % 12 || 12;
                    case "hh": return String.zeroize(gH() % 12 || 12);
                    case "H": return gH();
                    case "HH": return String.zeroize(gH());
                    case "m": return gm();
                    case "mm": return String.zeroize(gm());
                    case "s": return gs();
                    case "ss": return String.zeroize(gs());
                    default: return $0.substr(1, $0.length - 2);
                }
            });
            function gd() { return local ? d.getDate() : d.getUTCDate() }
            function gM() { return local ? d.getMonth() : d.getUTCMonth() }
            function gy() { return local ? d.getFullYear() : d.getUTCFullYear() }
            function gH() { return local ? d.getHours() : d.getUTCHours() }
            function gm() { return local ? d.getMinutes() : d.getUTCMinutes() }
            function gs() { return local ? d.getSeconds() : d.getUTCSeconds() }
        }
    }
}));

/****************************************扩展Array****************************************/
const enum ArraySort {
    /**
     * 升序
     */
    ASC = 0,
    /**
     * 降序
     */
    DESC = 1
}



interface ArrayConstructor {
    binaryInsert<T>(partArr: T[], item: T, filter: { (tester: T, ...args): boolean }, ...args);
    SORT_DEFAULT: { number: 0, string: "", boolean: false };
}
Array.binaryInsert = <T>(partArr: T[], item: T, filter: { (tester: T, ...args): boolean }, ...args) => {
    //根据物品战力进行插入
    let right = partArr.length - 1;
    let left = 0;
    while (left <= right) {
        let middle = (left + right) >> 1;
        let test = partArr[middle];
        if (filter(test, ...args)) {
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    partArr.splice(left, 0, item);
}

/**
 * 用于对Array排序时，处理undefined
 */
Array.SORT_DEFAULT = {
    number: 0,
    string: "",
    boolean: false
}
Object.freeze(Array.SORT_DEFAULT);

interface Array<T> {
    /**
     * 如果数组中没有要放入的对象，则将对象放入数组
     * 
     * @param {T} t 要放入的对象
     * @returns {number} 放入的对象，在数组中的索引
     * 
     * @memberof Array
     */
    pushOnce(t: T): number;

    /**
    * 
    * 删除某个数据
    * @param {T} t
    * @returns {boolean}   true 有这个数据并且删除成功
    *                      false 没有这个数据
    */
    remove(t: T): boolean;

    /**
     * 排序 支持多重排序
     * 降序, 升序
     * @param {(keyof T)[]} kArr              参数属性列表
     * @param {(boolean[] | ArraySort[])} [dArr] 是否降序，默认升序
     * @returns {this}
     * 
     * @memberOf Array
     */
    multiSort(kArr: (keyof T)[], dArr?: boolean[] | ArraySort[]): this;

    /**
     * 默认排序
     * 
     * @param {string} [key]
     * @param {boolean} [descend]
     * 
     * @memberOf Array
     */
    doSort(key?: keyof T, descend?: boolean | ArraySort): this;
    doSort(descend?: boolean | ArraySort, key?: keyof T): this;

    /**
     * 将数组克隆到to  
     * to的数组长度会和当前数组一致
     * 
     * @template T
     * @param {Array<T>} to
     */
    cloneTo<T>(to: Array<T>);

    /**
     * 将数组附加到to中
     * 
     * @template T
     * @param {Array<T>} to
     * 
     * @memberOf ArrayConstructor
     */
    appendTo<T>(to: Array<T>);
}

Object.defineProperties(Array.prototype, jy.makeDefDescriptors({
    cloneTo: {
        value: function <T>(this: T[], b: any[]) {
            b.length = this.length;
            let len = this.length;
            b.length = len;
            for (let i = 0; i < len; i++) {
                b[i] = this[i];
            }
        }
    },
    appendTo: {
        value: function <T>(this: T[], b: any[]) {
            let len = this.length;
            for (let i = 0; i < len; i++) {
                b.push(this[i]);
            }
        }
    },
    pushOnce: {
        value: function <T>(this: T[], t: T) {
            let idx = this.indexOf(t);
            if (!~idx) {
                idx = this.length;
                this[idx] = t;
            }
            return idx;
        }
    },
    remove: {
        value: function <T>(this: T[], t: T) {
            let idx = this.indexOf(t);
            if (~idx) {
                this.splice(idx, 1);
                return true;
            }
            return false;
        },
        writable: true
    },
    doSort: {
        value: function () {
            let key: string, descend: boolean;
            let len = arguments.length;
            if (DEBUG && len > 2) {
                jy.ThrowError(`doSort参数不能超过2`);
            }
            for (let i = 0; i < len; i++) {
                let arg = arguments[i];
                let t = typeof arg;
                if (t === "string") {
                    key = arg;
                } else {
                    descend = !!arg;
                }
            }
            if (key) {
                return this.sort((a: any, b: any) => descend ? b[key] - a[key] : a[key] - b[key]);
            } else {
                return this.sort((a: any, b: any) => descend ? b - a : a - b);
            }
        }
    },
    multiSort: {
        value: function (kArr: string[], dArr?: boolean[] | boolean) {
            let isArr = Array.isArray(dArr);
            return this.sort((a: any, b: any): number => {
                const def = Array.SORT_DEFAULT;
                for (let idx = 0, len = kArr.length; idx < len; idx++) {
                    let key = kArr[idx];
                    let mode = isArr ? !!dArr[idx] : !!dArr;
                    let av = a[key];
                    let bv = b[key];
                    let typea = typeof av;
                    let typeb = typeof bv;
                    if (typea == "object" || typeb == "object") {
                        if (DEBUG) {
                            jy.ThrowError(`multiSort 比较的类型不应为object,${typea}    ${typeb}`);
                        }
                        return 0;
                    }
                    else if (typea != typeb) {
                        if (typea == "undefined") {
                            bv = def[typeb];
                        } else if (typeb == "undefined") {
                            av = def[typea];
                        }
                        else {
                            if (DEBUG) {
                                jy.ThrowError(`multiSort 比较的类型不一致,${typea}    ${typeb}`);
                            }
                            return 0;
                        }
                    }
                    if (av < bv) {
                        return mode ? 1 : -1;
                    } else if (av > bv) {
                        return mode ? -1 : 1;
                    } else {
                        continue;
                    }
                }
                return 0;
            });
        }
    }
}));

interface Console {
    table(...args);
}

/****************************************Map********************************************/
var Map: MapConstructor;
if (typeof Map == "undefined") {
    /**
    * 为了兼容低版本浏览器，使用数组实现的map
    * @author 3tion
    *
    */
    Map = class PolyfillMap<K, V> implements Map<K, V>{
        private _keys: K[];
        private _values: V[];

        private _size: number;

        constructor() {
            this._keys = [];
            this._values = [];
            this._size = 0;
        }

        public set(key: K, value: V): this {
            var keys = this._keys;
            var idx = keys.indexOf(key);
            if (~idx) {// idx != -1  覆盖values数组的数据
                this._values[idx] = value;
            } else {//idx == -1 新增
                var size = this._size;
                keys[size] = key;
                this._values[size] = value;
                this._size++;
            }
            return this;
        }

        public get(key: K): V {
            var idx = this._keys.indexOf(key);
            if (~idx) {
                return this._values[idx];
            }
            return;
        }

        public has(key: K): boolean {
            return ~this._keys.indexOf(key) as any;
        }

        public delete(key: K): boolean {
            var keys = this._keys;
            var idx = keys.indexOf(key);
            if (~idx) {//有索引，干掉key和value
                keys.splice(idx, 1);
                this._values.splice(idx, 1);
                this._size--;
                return true;
            }
            return false;
        }

        public forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any) {
            var keys = this._keys;
            var values = this._values;
            for (let i = 0, len = this._size; i < len; i++) {
                callbackfn(values[i], keys[i], <Map<K, V>>thisArg);
            }
        }

        public clear() {
            this._keys.length = 0;
            this._values.length = 0;
            this._size = 0;
        }

        public get size(): number {
            return this._size;
        }
    }
}

module egret {
    export interface Bitmap {
        /**
         * 刷新纹理
         */
        refreshBMD();

        /**
		 * 占位用纹理
		 * 
		 */
        placehoder?: egret.Texture;
    }
    export interface TextField {
        /**
         * 
         * 设置Html文本(慎用，废性能)
         * @param {string | number} value
         */
        setHtmlText(value: string | number);
    }
    export interface EventDispatcher {
        /**
         * 删除所有事件监听
         * 
         * 
         * @memberOf EventDispathcer
         */
        removeAllListeners();
        /**
         * @language zh_CN
         * 派发一个指定参数的事件。
         * @param type {string | number} 事件类型
         * @param data {any} 事件data
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatch(type: jy.Key, data?: any): boolean;
        /**
         * 移除指定type的监听器
         * 
         * @param {(string | number)} type
         * @param {boolean} [useCapture]
         * 
         * @memberOf EventDispatcher
         */
        removeListeners(type: string | number, useCapture?: boolean);
        /**
         * @inheritDoc
         * @memberOf EventDispatcher
         */
        once(type: string | number, listener: Function, thisObject?: any, useCapture?: boolean, priority?: number): void;
        /**
         * addEventListener的别名
         * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。可以为特定类型的事件、阶段和优先级在显示列表的所有节
         * 点上注册事件侦听器。成功注册一个事件侦听器后，无法通过额外调用 on() 来更改其优先级。要更改侦听器的优先级，必须
         * 先调用 removeEventListener()。然后，可以使用新的优先级再次注册该侦听器。注册该侦听器后，如果继续调用具有不同 type 或 useCapture
         * 值的 on()，则会创建单独的侦听器注册。<br/>
         * 如果不再需要某个事件侦听器，可调用 EventDispatcher.removeEventListener()
         * 删除它；否则会产生内存问题。由于垃圾回收器不会删除仍包含引用的对象，因此不会从内存中自动删除使用已注册事件侦听器的对象。复制
         * EventDispatcher 实例时并不复制其中附加的事件侦听器。（如果新近创建的节点需要一个事件侦听器，必须在创建该节点后附加该侦听器。）
         * 但是，如果移动 EventDispatcher 实例，则其中附加的事件侦听器也会随之移动。如果在正在处理事件的节点上注册事件侦听器，则不会在当
         * 前阶段触发事件侦听器，但会在事件流的稍后阶段触发，如冒泡阶段。如果从正在处理事件的节点中删除事件侦听器，则该事件侦听器仍由当前操
         * 作触发。删除事件侦听器后，决不会再次调用该事件侦听器（除非再次注册以备将来处理）。
         * @param type 事件的类型。
         * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 确定侦听器是运行于捕获阶段还是运行于冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在冒泡阶段处理事件。
         * 要在两个阶段都侦听事件，请调用 on() 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority 事件侦听器的优先级。优先级由一个带符号的整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         * @see #once()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        on<T>(type: string | number, listener: { (this: T, e?: egret.Event) }, thisObject?: T, useCapture?: boolean, priority?: number): void;
        /**
         * removeEventListener的别名
         * 从 EventDispatcher 对象中删除侦听器。如果没有向 EventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
         * @param type 事件的类型。
         * @param listener 要删除的侦听器对象
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 指出是为捕获阶段还是为冒泡阶段注册了侦听器。如果为捕获阶段以及冒泡阶段注册了侦听器，则需要对
         * removeEventListener() 进行两次调用才能将这两个侦听器删除：一次调用将 useCapture 设置为 true，另一次调用将 useCapture 设置为 false。。
         * @version Egret 2.4
         * @platform Web,Native
         */
        off(type: string | number, listener: Function, thisObject?: any, useCapture?: boolean): void;
        /**
        * @language zh_CN
        * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。这样，您就可以确定 EventDispatcher 对象在事件流层次结构中的哪个
        * 位置改变了对事件类型的处理。要确定特定事件类型是否确实会触发事件侦听器，请使用 IEventDispatcher.willTrigger()。hasEventListener()
        * 与 willTrigger() 的区别是：hasEventListener() 只检查它所属的对象，而 willTrigger() 检查整个事件流以查找由 type 参数指定的事件。
        * @param type 事件的类型。
        * @returns 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
        * @see #willTrigger()
        * @version Egret 2.4
        * @platform Web,Native
        */
        hasListen(type: string | number);
    }

    export interface Graphics {
        /**
         * 使用  junyou.Rect 作为参数 进行绘制矩形
         * 
         * @param { jy.Rect} rect 
         * @memberof Graphics
         */
        drawRectangle(rect: jy.Rect);
    }

    let bpt = Bitmap.prototype;
    bpt.refreshBMD = function () {
        let tex = this.texture;
        if (tex != null) {
            this.texture = null;
            this.texture = tex;
        }
    }
    /**重写Bitmap.prototype.$refreshImageData用于支持egret的webgl渲染 */
    let $rawRefreshImageData = Bitmap.prototype.$refreshImageData;
    bpt.$refreshImageData = function () {
        $rawRefreshImageData.call(this);
        let bmd = this.$bitmapData;
        if (bmd) {
            this.$sourceWidth = bmd.width;
            this.$sourceHeight = bmd.height;
        }
    }
    const htmlTextParser = new HtmlTextParser();
    TextField.prototype.setHtmlText = function (this: TextField, value?: string | number) {
        if (value == undefined) {
            value = "";
        } else if (typeof value == "number") {
            value = value + "";
        }
        this.textFlow = value ? htmlTextParser.parser(value) : jy.Temp.EmptyArray as ITextElement[];
    }
    let ept = EventDispatcher.prototype;
    ept.removeAllListeners = function (this: EventDispatcher) {
        let values = this.$EventDispatcher;
        values[1/**eventsMap */] = {};
        values[2/**captureEventsMap */] = {};
    }
    ept.removeListeners = function (type, useCapture) {
        let eventMap = this.$getEventMap(useCapture);
        let list: egret.sys.EventBin[] = eventMap[type];
        if (list) {
            list.length = 0;
        }
    }
    ept.on = ept.addEventListener;
    ept.off = ept.removeEventListener;
    ept.hasListen = ept.hasEventListener;
    ept.dispatch = function (this: EventDispatcher, type, data) {
        return this.dispatchEventWith(type as any, false, data);
    }



    Graphics.prototype.drawRectangle = function (this: Graphics, rect: jy.Rect) {
        this.drawRect(rect.x, rect.y, rect.width, rect.height);
    }
    export interface Texture {
        /**
         * 用于设置位图的锚点坐标X
         */
        tx: number;
        /**
         * 用于设置位图的锚点坐标Y
         */
        ty: number;
    }
    export interface DisplayObject {
        /**
         * 亮度 赋值范围 -1 ~ 1
         * 默认为 0 表示正常亮度
         */
        bright: number;

        /**
         * 调整scrollRect的x
         */
        sRectX: number;

        /**
         * 调整scrollRect的y
         */
        sRectY: number;
    }

    const enum BrightConst {
        PrivateKey = "_bright",
        PrivateFilter = "_briFilter"
    }

    // DisplayObject重写了EventDispatcher的removeEventListener
    let dpt = DisplayObject.prototype;
    dpt.off = dpt.removeEventListener;
    dpt.removeListeners = function (type, useCapture) {
        let eventMap = this.$getEventMap(useCapture);
        let list: DisplayObject[];
        if ("enterFrame" == type) {
            list = DisplayObject.$enterFrameCallBackList;
        } else if ("render" == type) {
            list = DisplayObject.$renderCallBackList;
        }
        if (list) {
            list.remove(this);
        }
        ept.removeListeners.call(this, type, useCapture);
    }
    dpt.removeAllListeners = function (this: DisplayObject) {
        let values = this.$EventDispatcher;
        values[1/**eventsMap */] = {};
        values[2/**captureEventsMap */] = {};
        DisplayObject.$enterFrameCallBackList.remove(this);
        DisplayObject.$renderCallBackList.remove(this);
    }

    Object.defineProperties(dpt, jy.makeDefDescriptors({
        bright: {
            set: function (this: egret.DisplayObject, value: number) {
                value = Math.clamp(value, -1, 1);
                if (this[BrightConst.PrivateKey] == value) {
                    return;
                }
                let filters = this.filters;
                let brightMatrix: egret.ColorMatrixFilter = this[BrightConst.PrivateFilter];
                if (value == 0) {
                    if (filters) {
                        filters.remove(brightMatrix);
                        if (!filters.length) {
                            filters = null;
                        }
                    }
                } else {
                    if (!brightMatrix) {
                        this[BrightConst.PrivateFilter] = brightMatrix = new egret.ColorMatrixFilter();
                    }
                    this[BrightConst.PrivateKey] = value;
                    brightMatrix.matrix = [1, 0, 0, 0, 255 * value, 0, 1, 0, 0, 255 * value, 0, 0, 1, 0, 255 * value, 0, 0, 0, 1, 0];
                    if (!filters) {
                        filters = [brightMatrix];
                    } else {
                        filters.pushOnce(brightMatrix);
                    }
                }
                this.filters = filters;
            },
            get: function () {
                return this[BrightConst.PrivateKey] || 0;
            }
        },
        sRectX: setScrollRectPos("x"),
        sRectY: setScrollRectPos("y"),
    }))

    function setScrollRectPos(key: "x" | "y") {
        return {
            set: function (this: egret.DisplayObject, value: number) {
                let scroll = this.scrollRect;
                if (scroll) {
                    scroll[key] = value;
                    this.scrollRect = scroll;
                }
            },
            get: function (this: egret.DisplayObject) {
                let scroll = this.scrollRect;
                return scroll && scroll[key] || 0;
            }
        }
    }

}
interface Storage {
    getItem(key: number): string | null;
    /**
     * 
     * 
     * @param {number | string} key 
     * @param {*} data 如果数据非string类型，会做toString()处理
     * 
     * @memberof Storage
     */
    setItem(key: number | string, data: any): void;

    removeItem(key: number | string): void;
}