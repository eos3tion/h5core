declare namespace jy {
    /**
     * 扩展名常量
     * @author 3tion
     */
    const enum Ext {
        JPG = ".jpg",
        PNG = ".png",
        WEBP = ".webp",
        BIN = ".bin",
        JSON = ".json",
        MP3 = ".mp3"
    }
}
declare namespace jy {
    /**
     * 延迟执行
     * @author 3tion
     */
    class CallLater {
        private _callLaters;
        private _temp;
        constructor();
        tick(now: number): void;
        /**
         * 增加延迟执行的函数
         *
         * @param {Function} callback (description)
         * @param {number} now (description)
         * @param {number} [time] (description)
         * @param {*} [thisObj] (description)
         * @param args (description)
         */
        callLater(callback: Function, now: number, time?: number, thisObj?: any, ...args: any[]): void;
        /**
         * 清理延迟执行的函数
         *
         * @param {Function} callback (description)
         * @param {*} [thisObj] (description)
         */
        clearCallLater(callback: Function, thisObj?: any): any;
        callLater2(callback: $CallbackInfo, now?: number, time?: number): void;
        clearCallLater2(callback: $CallbackInfo): any;
        clear(): void;
    }
}
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
declare namespace jy {
    class TweenManager {
        protected _tweens: Tween[];
        /**
         * 注册过的插件列表
         * Key      {string}            属性
         * Value    {ITweenPlugin[]}    插件列表
         *
         * @type {{ [index: string]: ITweenPlugin[] }}
         */
        _plugins: {
            [index: string]: ITweenPlugin[];
        };
        /**
         * Returns a new tween instance. This is functionally identical to using "new Tween(...)", but looks cleaner
         * with the chained syntax of TweenJS.
         * <h4>Example</h4>
         *
         *		var tween = createjs. this.get(target);
        *
        * @method get
        * @param {Object} target The target object that will have its properties tweened.
        * @param {TweenOption} [props] The configuration properties to apply to this tween instance (ex. `{loop:true, paused:true}`).
        * All properties default to `false`. Supported props are:
        * <UL>
        *    <LI> loop: sets the loop property on this tween.</LI>
        *    <LI> useTicks: uses ticks for all durations instead of milliseconds.</LI>
        *    <LI> ignoreGlobalPause: sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on
        *    this tween.</LI>
        *    <LI> override: if true, `createjs. this.removeTweens(target)` will be called to remove any other tweens with
        *    the same target.
        *    <LI> paused: indicates whether to start the tween paused.</LI>
        *    <LI> position: indicates the initial position for this tween.</LI>
        *    <LI> onChange: specifies a listener for the {{#crossLink "Tween/change:event"}}{{/crossLink}} event.</LI>
        * </UL>
        * @param {Object} [pluginData] An object containing data for use by installed plugins. See individual plugins'
        * documentation for details.
        * @param {Boolean} [override=false] If true, any previous tweens on the same target will be removed. This is the
        * same as calling ` this.removeTweens(target)`.
        * @return {Tween} A reference to the created tween. Additional chained tweens, method calls, or callbacks can be
        * applied to the returned tween instance.
        * @static
        */
        get(target: any, props?: TweenOption, pluginData?: any, override?: boolean): Tween;
        /**
         * 移除指定对象的所有tween
         * Removes all existing tweens for a target. This is called automatically by new tweens if the `override`
         * property is `true`.
         * @method removeTweens
         * @param {Object} target The target object to remove existing tweens from.
         * @static
         */
        removeTweens(target: any): void;
        /**
         * 移除单个tween
         *
         * @param {Tween} twn
         * @returns
         *
         * @memberOf TweenManager
         */
        removeTween(twn: Tween): void;
        /**
         * 暂停某个对象的全部Tween
         *
         * @static
         * @param {*} target 指定对象
         */
        pauseTweens(target: any): void;
        /**
         * 恢复某个对象的全部Tween
         *
         * @static
         * @param {*} target 指定对象
         */
        resumeTweens(target: any): void;
        /**
         * 由外部进行调用，进行心跳
         * Advances all tweens. This typically uses the {{#crossLink "Ticker"}}{{/crossLink}} class, but you can call it
         * manually if you prefer to use your own "heartbeat" implementation.
         * @method tick
         * @param {Number} delta The change in time in milliseconds since the last tick. Required unless all tweens have
         * `useTicks` set to true.
         * @param {Boolean} paused Indicates whether a global pause is in effect. Tweens with {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}}
         * will ignore this, but all others will pause if this is `true`.
         * @static
         */
        tick(delta: number, paused?: boolean): void;
        /**
         * 将tween注册/注销到管理器中，
         *
         * @param {Tween} tween
         * @param {boolean} [value] (description)
         * @returns {void}
         * @private 此方法只允许tween调用
         */
        _register(tween: Tween, value?: boolean): void;
        /**
         * Stop and remove all existing tweens.
         * 终止并移除所有的tween
         * @method removeAllTweens
         * @static
         * @since 0.4.1
         */
        removeAllTweens(): void;
        /**
         * Indicates whether there are any active tweens (and how many) on the target object (if specified) or in general.
         * @method hasActiveTweens
         * @param {Object} [target] The target to check for active tweens. If not specified, the return value will indicate
         * if there are any active tweens on any target.
         * @return {Boolean} If there are active tweens.
         * @static
         */
        hasActiveTweens(target: any): boolean;
        /**
         * Installs a plugin, which can modify how certain properties are handled when tweened. See the {{#crossLink "CSSPlugin"}}{{/crossLink}}
         * for an example of how to write TweenJS plugins.
         * @method installPlugin
         * @static
         * @param {Object} plugin The plugin class to install
         * @param {Array} properties An array of properties that the plugin will handle.
         */
        installPlugin(plugin: ITweenPlugin, properties: string[]): void;
    }
}
declare namespace jy {
    interface GlobalInstance {
        initTick: () => void;
        nextTick: (callback: Function, thisObj?: any, ...args: any[]) => void;
        nextTick2: (callback: CallbackInfo<Function>) => void;
        /**
         * 延迟执行
         * @param {Function} callback 回调函数
         * @param {number} [time=0] 延迟执行的时间
         * @param {*} [thisObj] 回调的`this`指针
         * @param args 回调参数列表
         */
        callLater(callback: Function, time?: number, thisObj?: any, ...args: any[]): any;
        /**
         * 延迟执行
         * @param {$CallbackInfo} callback 回调函数
         * @param {number} [time=0] 延迟执行的时间
         */
        callLater2(callback: $CallbackInfo, time?: number): any;
        /**
         * 清理延迟
         * @param {Function} callback 回调函数
         * @param {*} [thisObj]  回调的`this`指针
         */
        clearCallLater(callback: Function, thisObj?: any): any;
        /**
         * 清理延迟
         * @param {$CallbackInfo} callback 要清理的回调
         */
        clearCallLater2(callback: $CallbackInfo): any;
        /**
         * 获取Tween
         *
         * @static
         * @param {*} target 要对那个对象做Tween处理
         * @param {TweenOption} props Tween的附加属性 (如： `{loop:true, paused:true}`).
         * All properties default to `false`. Supported props are:
         * <UL>
         *    <LI> loop: sets the loop property on this tween.</LI>
         *    <LI> useTicks: uses ticks for all durations instead of milliseconds.</LI>
         *    <LI> ignoreGlobalPause: sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on
         *    this tween.</LI>
         *    <LI> override: if true, `createjs. this.removeTweens(target)` will be called to remove any other tweens with
         *    the same target.
         *    <LI> paused: indicates whether to start the tween paused.</LI>
         *    <LI> position: indicates the initial position for this tween.</LI>
         *    <LI> onChange: specifies a listener for the {{#crossLink "Tween/change:event"}}{{/crossLink}} event.</LI>
         * </UL>
         * @param {*} pluginData 插件数据
         * @param {boolean} override 是否覆盖
         * @returns {Tween} tween的实例
         */
        getTween(target: any, props?: TweenOption, pluginData?: any, override?: boolean): Tween;
        /**
         * 移除指定的Tween
         *
         * @param {Tween} tween
         * @returns
         */
        removeTween(tween: Tween): any;
        /**
         * 移除指定目标的所有Tween
         *
         * @param {any} target
         * @returns
         */
        removeTweens(target: any): any;
        /**
         * 判断是否为Native的版本
         */
        readonly isNative: boolean;
        tweenManager: TweenManager;
        /**
         *  当前这一帧的时间
         */
        readonly now: number;
        /**
         * 按照帧，应该走的时间
         * 每帧根据帧率加固定时间
         * 用于处理逐帧同步用
         */
        readonly frameNow: number;
        /**
         * 是否支持webp
         */
        readonly webp: "" | Ext.WEBP;
        /**
         * 添加每帧执行回调
         */
        addInterval(callback: CallbackInfo<Function>): void;
        /**
         * 移除每帧执行回调
         */
        removeInterval(callback: CallbackInfo<Function>): void;
    }
    /**
     * 动画的全局对象
     * @author 3tion
     *
     */
    const Global: GlobalInstance;
}
declare function parseInt(s: number, radix?: number): number;
declare namespace jy {
    /**
     * 获取完整的 PropertyDescriptor
     *
     * @param {Partial<PropertyDescriptor>} descriptor
     * @param {boolean} [enumerable=false]
     * @param {boolean} [writable]
     * @param {boolean} [configurable=true]
     * @returns
     */
    function getDescriptor(descriptor: PropertyDescriptor, enumerable?: boolean, writable?: boolean, configurable?: boolean): PropertyDescriptor;
    function makeDefDescriptors(descriptors: object, enumerable?: boolean, writable?: boolean, configurable?: boolean): PropertyDescriptorMap;
    /**
     * 移除可视对象
     *
     * @export
     * @param {egret.DisplayObject} display
     */
    function removeDisplay(display: egret.DisplayObject, fire?: boolean): void;
}
/****************************************扩展Object****************************************/
interface Object {
    /**
     * 返回一个浅副本的对象
     * 此对象会拷贝key value
     *
     * @memberOf Object
     */
    $clone(): Object;
    /**
     * 将数据拷贝到 to
     * @param to 目标
     */
    copyto(to: Object): any;
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
    equals(checker: object, ...args: (keyof this)[]): any;
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
/****************************************扩展String****************************************/
interface String {
    /**
     * 替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
     */
    substitute(...args: any[]): string;
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
    regSubHandler(key: string, handler: {
        (input: any): string;
    }): any;
    /**
     * substitute的回调函数
     *
     * @type {Readonly<{ [index: string]: { (input: any): string } }>}
     * @memberOf StringConstructor
     */
    subHandler: Readonly<{
        [index: string]: {
            (input: any): string;
        };
    }>;
}
declare const _zeros = "000000000000000000000000000000000000000000000000000000000000";
declare const zeroLen: number;
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
/****************************************扩展Array****************************************/
declare const enum ArraySort {
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
    binaryInsert<T>(partArr: T[], item: T, filter: {
        (tester: T, ...args: any[]): boolean;
    }, ...args: any[]): any;
    SORT_DEFAULT: {
        number: 0;
        string: "";
        boolean: false;
    };
}
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
    cloneTo<T>(to: Array<T>): any;
    /**
     * 将数组附加到to中
     *
     * @template T
     * @param {Array<T>} to
     *
     * @memberOf ArrayConstructor
     */
    appendTo<T>(to: Array<T>): any;
    /**
     * 从数组中随机获取一个数据
     */
    random(): T;
}
interface Console {
    table(...args: any[]): any;
}
/****************************************Map********************************************/
declare var Map: MapConstructor;
declare module egret {
    interface Bitmap {
        /**
         * 刷新纹理
         */
        refreshBMD(): any;
        /**
         * 占位用纹理
         *
         */
        placehoder?: egret.Texture;
    }
    interface TextField {
        /**
         *
         * 设置Html文本(慎用，废性能)
         * @param {string | number} value
         */
        setHtmlText(value: string | number): any;
    }
    interface Graphics {
        /**
         * 使用  junyou.Rect 作为参数 进行绘制矩形
         *
         * @param { jy.Rect} rect
         * @memberof Graphics
         */
        drawRectangle(rect: jy.Rect): any;
    }
    interface Texture {
        /**
         * 用于设置位图的锚点坐标X
         */
        tx: number;
        /**
         * 用于设置位图的锚点坐标Y
         */
        ty: number;
    }
    interface DisplayObject {
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
declare namespace jy {
    const enum TextureSheetConst {
        DefaultSize = 256,
        MaxSize = 2048,
        Padding = 1
    }
    function updateEgretTexutre(bmd: egret.BitmapData): void;
    function getTextureSheet(size?: number, canvas?: HTMLCanvasElement): {
        /**
         * 获取纹理
         * @param key
         */
        get(key: string | number): egret.Texture;
        /**
         * 注册纹理
         * @param key 纹理的key
         * @param rect 纹理的坐标和宽度高度
         * @param [ntex] 外部纹理，如果不传，则直接创建
         * @returns {egret.Texture} 则表明注册成功
         */
        reg(key: string | number, rect: Rect, ntex?: egret.Texture): egret.Texture;
        /**
         * 更新纹理
         */
        update: (key: string | number, rect: Rect, tex: DynamicTexture) => void;
        /**
         * 删除指定纹理
         * @param key
         */
        remove(key: string | number): egret.Texture;
        /**
         * 获取上下文对象
         */
        readonly ctx: CanvasRenderingContext2D;
        /**
         * 扩展尺寸
         * @param newSize
         */
        extSize(newSize: number): boolean;
        /**
         * 销毁纹理
         */
        dispose(): void;
        getTexCount(): number;
        /**
         * 获取当前尺寸
         */
        getSize(): number;
    };
    interface DynamicTexture extends egret.Texture {
        $bin?: Bin;
        sheet?: TextureSheet;
        $rect?: Rect;
    }
    type TextureSheet = ReturnType<typeof getTextureSheet>;
}
interface $gmType {
    /**
     * 主控类型，包括Proxy和Mediator
     *
     * @type {{ [index: string]: jy.FHost }}
     * @memberof $gmType
     */
    $: {
        [index: string]: jy.FHost;
    };
}
declare namespace jy {
    export type InjectProxy = {
        new (): IAsync;
    } | Key;
    interface InjectProxyBin {
        ref: InjectProxy;
        /**
         * 是否为私有属性，此值设置为true则子类不会继承这个Proxy
         * 否则子类将继承Proxy
         */
        isPri?: boolean;
    }
    /**
     * Mediator和Proxy的基类
     * @author 3tion
     *
     */
    export abstract class FHost implements IDepender {
        protected _name: string | number;
        /**
         * 用于处理依赖注入的Proxy
         *
         * @protected
         * @type {({[index:string]:{ new (): IAsync } | string})}
         * @memberOf FHost
         */
        protected _injectProxys: {
            [index: string]: InjectProxyBin;
        };
        /**
         * 唯一标识
         */
        get name(): string | number;
        constructor(name: string | number);
        /**
         * 检查依赖注入的数据
         *
         * @protected
         *
         * @memberOf FHost
         */
        checkInject(): void;
        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;
        addReadyExecute(handle: Function, thisObj: any, ...args: any[]): void;
        /**
         * 作为依赖者的Helper
         */
        protected _dependerHelper: DependerHelper;
        get isReady(): boolean;
        startSync(): void;
        /**
         * 添加依赖项
         */
        addDepend(async: IAsync): void;
        /**
         * 依赖项，加载完成后的检查
         */
        protected dependerReadyCheck(): void;
        /**
         * 模块在Facade注册时执行
         */
        onRegister(): void;
        /**
         * 模块从Facade注销时
         */
        onRemove(): void;
        /**
         * 全部加载好以后要处理的事情<br/>
         * 包括依赖项加载完毕
         */
        protected afterAllReady(): void;
    }
    /**
     *
     * 附加依赖的Proxy
     * @export
     * @param {({ new (): IAsync } | string)} ref 如果注册的是Class，必须是Inline方式注册的Proxy
     * @returns
     */
    export function d_dependProxy(ref: InjectProxy, isPri?: boolean): (target: any, key: string) => void;
    export {};
}
declare namespace jy {
    /**
     * 基础创建器
     * @author 3tion
     *
     */
    class BaseCreator<T extends egret.DisplayObject> {
        protected _suiData: SuiData;
        suiLib: string;
        suiClass: string;
        get suiData(): SuiData;
        protected _baseData: BaseData;
        protected _createT: () => T;
        protected _parsed: boolean;
        size: Readonly<egret.Rectangle>;
        bindSuiData(suiData: SuiData): void;
        parseData(data: ComponentData, suiData: SuiData): void;
        /**
         * 处理尺寸
         *
         * @param {SizeData} data
         *
         * @memberOf BaseCreator
         */
        parseSize(data: SizeData): void;
        /**
         * 处理元素数据
         * 对应 https://github.com/eos3tion/ExportUIFromFlash  项目中
         * Solution.ts -> getElementData的元素数据的解析
         * @param {ComponentData} data 长度为4的数组
         * 0 导出类型
         * 1 基础数据 @see Solution.getEleBaseData
         * 2 对象数据 不同类型，数据不同
         * 3 引用的库 0 当前库  1 lib  字符串 库名字
         * @memberOf BaseCreator
         */
        createElement(data: ComponentData): egret.DisplayObject;
        setBaseData(data: BaseData): void;
        parseSelfData(data: any): void;
        /**
         * 获取实例
         */
        get(): T;
    }
}
declare namespace jy {
    interface ComponentWithEnable {
        /**
         * 控件是否启用
         */
        enabled: boolean;
        useDisFilter?: boolean;
        /**
         * @private
         */
        _enabled?: boolean;
        /**
         * @private
         */
        $setEnabled(value: boolean): any;
    }
    function addEnable(ref: {
        prototype: any;
        useDisFilter?: boolean;
    }): void;
    /**
     * 用于处理接收flash软件制作的UI，导出的数据，仿照eui
     * 不过简化eui的一些layout的支持
     * 按目前情况看，不太会制作复杂排版的ui，父容器不做统一的测量和重新布局
     * 都会基于固定大小(传奇世界H5，采用480×800，viewport设置为不可缩放，宽度基于设备的)
     * @author 3tion
     *
     */
    class Component extends egret.Sprite {
        /**
         * 附加的数据
         *
         * @type {*}@memberof Component
         */
        data?: any;
        protected _guid: string;
        protected _creator: BaseCreator<egret.DisplayObject>;
        /**
         * 是否使用disable滤镜
         * 现在默认为 true
         * @protected
         * @type {boolean}
         * @memberOf Component
         */
        useDisFilter: boolean;
        /**
         * 控件命名规则
         * 如果是和模块关联@开头，则为mediator，通过getView取到面板
         * 为!开头的数字guid，则此控件的上级是个列表，通过getItemViewAt(idx)可以取得控件
         *
         * 如引导:
         * skill对应面板下
         * 模块zhudongskill对应面板下
         * 名字为skillpage的控件下
         * 索引2的控件下
         * 名字为btnButton的按钮
         * 可以构造一个@skill/@zhudongskill/skillpage/!2/btnButton的字符串来主播引导
         *
         */
        get guid(): string;
        constructor();
        init(c: BaseCreator<egret.DisplayObject>): void;
        protected stageEvent(remove?: boolean): void;
        protected onAwake(): void;
        protected onSleep(): void;
        dispose(): void;
        protected bindChildren(): void;
        /**
         * 绘制一个代理图形
         */
        protected drawDele(): void;
        /**
        * @language zh_CN
        * 设置元素的布局大小。这是元素在屏幕上进行绘制时所用的大小。<p/>
        *
        * 如果 width 和/或 height 参数尚未指定 (NaN))，则 EUI 会将该元素的布局大小设置为首选宽度和/或首选高度。<p/>
        *
        * 请注意，调用 setLayoutBoundSize() 方法会影响布局位置，因此请在调用 setLayoutBoundSize()
        * 之后再调用 setLayoutBoundPosition()。
        *
        * @param layoutWidth 元素的布局宽度。
        * @param layoutHeight 元素的布局高度。
        *
        * @version Egret 2.4
        * @version eui 1.0
        * @platform Web,Native
        */
        protected setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;
        /**
         * @language zh_CN
         * 获取组件的首选尺寸,常用于父级的<code>measure()</code>方法中。<p/>
         * 按照：外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸。<p/>
         * 注意此方法返回值已经包含scale和rotation。
         *
         * @param bounds 可以放置结果的<code>egret.Rectangle</code>实例。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getPreferredBounds(bounds: egret.Rectangle): void;
        /**
         * @language zh_CN
         * 设置元素在屏幕上进行绘制时所用的布局坐标。<p/>
         *
         * 请注意，调用 setLayoutBoundSize() 方法会影响布局位置，因此请在调用 setLayoutBoundSize()
         * 之后再调用 setLayoutBoundPosition()。
         *
         * @param x 边框左上角的 X 坐标。
         * @param y 边框左上角的 Y 坐标。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setLayoutBoundsPosition(x: number, y: number): void;
        /**
         * @language zh_CN
         * 组件的布局尺寸,常用于父级的<code>updateDisplayList()</code>方法中。<p/>
         * 按照：布局尺寸>外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸。<p/>
         * 注意此方法返回值已经包含scale和rotation。
         *
         * @param bounds 可以放置结果的<code>egret.Rectangle</code>实例。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getLayoutBounds(bounds: egret.Rectangle): void;
        get view(): this;
    }
    interface Component extends ComponentWithEnable {
    }
}
declare const enum EgretEvent {
    /**************************************** egret.Event ****************************************/
    /**
 * Dispatched when a display object is added to the on stage display list, either directly or through the addition
 * of a sub tree in which the display object is contained.
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
    /**
     * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ADDED_TO_STAGE = "addedToStage",
    /**
     * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
     * of a sub tree in which the display object is contained.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    REMOVED_FROM_STAGE = "removedFromStage",
    /**
     * Dispatched when a display object is added to the display list.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将显示对象添加到显示列表中时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ADDED = "added",
    /**
     * Dispatched when a display object is about to be removed from the display list.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将要从显示列表中删除显示对象时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    REMOVED = "removed",
    /**
     * [broadcast event] Dispatched when the playhead is entering a new frame.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ENTER_FRAME = "enterFrame",
    /**
     * Dispatched when the display list is about to be updated and rendered.
     * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 渲染事件，监听此事件将会在本帧末即将开始渲染的前一刻触发回调，这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
     * 注意：每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 stage.invalidate() 方法，由于每帧只会触发一次屏幕刷新，
     * 若在 Event.RENDER 回调函数执行期间再次调用stage.invalidate()，将会被忽略。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    RENDER = "render",
    /**
     * Dispatched when the size of stage or UIComponent is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 舞台尺寸或UI组件尺寸发生改变
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    RESIZE = "resize",
    /**
     * Dispatched when the value or selection of a property is chaned.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 属性值或状态发生改变。通常是按钮的选中状态，或者列表的选中项索引改变。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CHANGE = "change",
    /**
     * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
     * preventDefault() method.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 属性值或状态即将发生改变,通常是按钮的选中状态，或者列表的选中项索引改变。可以通过调用 preventDefault() 方法阻止索引发生更改。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CHANGING = "changing",
    /**
     * Dispatched when the net request is complete.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 网络请求加载完成
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    COMPLETE = "complete",
    /**
     * Dispatched when loop completed.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 循环完成。循环最后一次只派发 COMPLETE 事件，不派发 LOOP_COMPLETE 事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    LOOP_COMPLETE = "loopComplete",
    /**
     * Dispatched when the TextInput instance gets focus.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TextInput实例获得焦点
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    FOCUS_IN = "focusIn",
    /**
     * Dispatched when the TextInput instance loses focus.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TextInput实例失去焦点
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    FOCUS_OUT = "focusOut",
    /**
     * Dispatched when the playback is ended.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 动画声音等播放完成
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ENDED = "ended",
    /**
     * 游戏激活
     * @version Egret 2.4
     * @platform Web,Native
     */
    ACTIVATE = "activate",
    /**
     * 取消激活
     * @version Egret 2.4
     * @platform Web,Native
     */
    DEACTIVATE = "deactivate",
    /**
     * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    CLOSE = "close",
    /**
     * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    CONNECT = "connect",
    /**
     * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    LEAVE_STAGE = "leaveStage",
    /**
     * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
     * @version Egret 2.4
     * @platform Web,Native
     */
    SOUND_COMPLETE = "soundComplete",
    /**************************************** egret.StageOrientationEvent ****************************************/
    /**
     * After screen rotation distribute events.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 屏幕旋转后派发的事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ORIENTATION_CHANGE = "orientationChange",
    /**************************************** egret.TextEvent ****************************************/
    /**
     * It defines the value of the type property of a link event object.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 定义 link 事件对象的 type 属性值。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    LINK = "link",
    /**************************************** egret.TouchEvent ****************************************/
    /**
    * Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
    * @version Egret 2.4
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_MOVE = "touchMove",
    /**
     * Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_BEGIN = "touchBegin",
    /**
     * Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
     * or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_END = "touchEnd",
    /**
     * Dispatched when an event of some kind occurred that canceled the touch.
     * Such as the eui.Scroller will dispatch 'TOUCH_CANCEL' when it start move, the 'TOUCH_END' and 'TOUCH_TAP' will not be triggered.
     * @version Egret 3.0.1
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 由于某个事件取消了触摸时触发。比如 eui.Scroller 在开始滚动后会触发 'TOUCH_CANCEL' 事件，不再触发后续的 'TOUCH_END' 和 'TOUCH_TAP' 事件
     * @version Egret 3.0.1
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_CANCEL = "touchCancel",
    /**
     * Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact
     * was initiated on a touch-enabled device.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户在触摸设备上与开始触摸的同一 DisplayObject 实例上抬起接触点时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_TAP = "touchTap",
    /**
     * Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact
     * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
     * object on a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户在触摸设备上与开始触摸的不同 DisplayObject 实例上抬起接触点时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_RELEASE_OUTSIDE = "touchReleaseOutside",
    /**************************************** RES.ResourceEvent ****************************************/
    /**
 * Failure event for a load item.
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
    /**
     * 一个加载项加载失败事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ITEM_LOAD_ERROR = "itemLoadError",
    /**
     * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CONFIG_COMPLETE = "configComplete",
    /**
     * Configuration file failed to load.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 配置文件加载失败事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CONFIG_LOAD_ERROR = "configLoadError",
    /**
     * Delay load group resource loading progress event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 延迟加载组资源加载进度事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    GROUP_PROGRESS = "groupProgress",
    /**
     * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    GROUP_COMPLETE = "groupComplete",
    /**
     * Delayed load group resource failed event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 延迟加载组资源加载失败事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    GROUP_LOAD_ERROR = "groupLoadError",
    /**************************************** Egret.IOErrorEvent ****************************************/
    /**
     * io error
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * io发生错误
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    IO_ERROR = "ioError"
}
declare namespace jy {
    /**
     * mixin的基类选项
     *
     * @export
     * @interface MixinOption
     * @template T
     */
    interface MixinOption<T> {
        /**
         *
         * mixin的基类
         * @type {{ new (): T }}
         * @memberOf MixinOption
         */
        clazz: {
            new (): T;
        };
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
    function expandInstance<A, B, K extends keyof B>(instance: A, clazzB: {
        prototype: B;
    }, ...keys: K[]): A & B;
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
    function expand<A, B, K extends keyof B>(clazzA: {
        prototype: A;
    }, clazzB: {
        prototype: B;
    }, ...keys: K[]): A & Record<K, B>;
    type Constructor<T> = new (...args: any[]) => T;
    type MixinCtor<A, B> = new () => A & B & {
        constructor: MixinCtor<A, B>;
    };
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
    function getMixin<A, B>(clazzA: {
        prototype: A;
    }, clazzB: {
        prototype: B;
    }): MixinCtor<A, B>;
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
    function copyProperty<To, From>(to: To, from: From, key: keyof From): void;
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
    function copyProperties<To, From>(to: To, from: From, ...keys: (keyof From)[]): void;
}
interface $NSFilter {
    /**
     * 感兴趣的请求
     *
     * @type { [index: number]: boolean }
     * @memberOf $gmNSLog
     */
    cmds?: number[];
    /**
     * 是否为白名单模式，默认黑名单
     *
     * @type {boolean}
     * @memberOf $NSFilter
     */
    isWhite: boolean;
    /**
     * 过滤器
     *
     * @type {{ ($gmNSLog, ...args): boolean }}
     * @memberOf $NSFilter
     */
    filter?: {
        ($gmNSLog: any, ...args: any[]): boolean;
    };
    /**
     * 过滤器参数
     *
     * @type {any[]}
     * @memberOf $NSFilter
     */
    filterParams?: any[];
}
interface $NSLog {
    time: number;
    type: "send" | "receive";
    cmd: number;
    data: any;
}
/**
 * 用于扩展GM指令
 *
 * @interface $gmType
 */
interface $gmType {
    /**
     * 发送的网络消息的日志
     *
     * @type {$NSFilter}
     * @memberOf $gmType
     */
    printSendFilter: $NSFilter;
    /**
     * 接收的网络消息的日志
     *
     * @type {$NSFilter}
     * @memberOf $gmType
     */
    printReceiveFilter: $NSFilter;
    /**
     * 日志数据
     *
     * @type $NSLog[])}
     * @memberOf $gmType
     */
    nsLogs: $NSLog[];
    /**
     * 输出日志内容
     * @memberOf $gmType
     */
    showNSLog(): $NSLog[];
    showNSLog(filter: {
        ($gmNSLog: $NSLog, ...args: any[]): boolean;
    }, ...args: any[]): $NSLog[];
    showNSLog(isWhite: boolean, ...cmds: number[]): $NSLog[];
    /**
     * 使用黑名单模式，进行输出
     *
     * @param {...number[]} cmds
     *
     * @memberOf $gmType
     */
    showNSLog(...cmds: number[]): $NSLog[];
    /**
     * 最大网络日志数量
     *
     * @type {number}
     * @memberOf $gmType
     */
    maxNSLogCount: number;
    /**
     * 控制台输出发送日志
     * @memberOf $gm
     */
    printSend(): any;
    /**
     * 使用过滤函数过滤在控制台输出的发送日志
     *
     * @param {{ ($gmNSLog, ...args): boolean }} filter     过滤函数，函数返回true的会显示在控制台上
     * @param {any} args                                    过滤函数使用的参数
     *
     * @memberOf $gmType
     */
    printSend(filter: {
        ($gmNSLog: $NSLog, ...args: any[]): boolean;
    }, ...args: any[]): any;
    /**
     * 显示或排除指定指令的发送日志，并在控制台输出
     *
     * @param {boolean} isWhite     是否为白名单模式
     * @param {...number[]} cmds    指令列表
     *
     * @memberOf $gmType
     */
    printSend(isWhite: boolean, ...cmds: number[]): any;
    /**
     * 排除指定指令的发送日志，将其他日志信息在控制台输出
     *
     * @param {...number[]} cmds    黑名单列表
     *
     * @memberOf $gmType
     */
    printSend(...cmds: number[]): any;
    /**
     * 控制台输出接收日志
     * @memberOf $gmType
     */
    printReceive(): any;
    /**
     * 使用过滤函数过滤并在控制台输出接收日志
     *
     * @param {{ ($gmNSLog, ...args): boolean }} filter     过滤函数，函数返回true的会显示在控制台上
     * @param {any} args                                    过滤函数使用的参数
     *
     * @memberOf $gmType
     */
    printReceive(filter: {
        ($gmNSLog: $NSLog, ...args: any[]): boolean;
    }, ...args: any[]): any;
    /**
     * 显示或排除指定指令的接收日志，并在控制台输出
     *
     * @param {boolean} isWhite     是否为白名单模式
     * @param {...number[]} cmds    指令列表
     *
     * @memberOf $gmType
     */
    printReceive(isWhite: boolean, ...cmds: number[]): any;
    /**
     * 排除指定指令的接收日志，将其他日志信息在控制台输出
     *
     * @param {...number[]} cmds
     *
     * @memberOf $gmType
     */
    printReceive(...cmds: number[]): any;
    /**
     * 调用printSend和printReceive的一个简写
     *
     *
     * @memberof $gmType
     */
    print(): any;
    /**
     * 模拟服务端发送数据
     *
     * @param {number} cmd
     * @param {*} [data]
     *
     * @memberof $gmType
     */
    route(cmd: number, data?: any): any;
    /**
     * 使用日志数据进行模拟调试
     *
     * @param {$NSLog[]} logs
     *
     * @memberof $gmType
     */
    batchRoute(logs: $NSLog[]): any;
    /**
     * 获取网络传输数据日志的过滤器
     * @returns {$NSFilter}
     *
     * @memberOf $gmType
     */
    __getNSFilter(...args: any[]): $NSFilter;
    /**
     * 检查是否需要显示日志
     *
     * @param {$NSLog} log
     * @param {$NSFilter} nsFilter
     * @returns {boolean}
     *
     * @memberOf $gmType
     */
    __nsLogCheck(log: $NSLog, nsFilter: $NSFilter): boolean;
}
declare namespace jy {
    const enum NSType {
        Null = 0,
        Boolean = 1,
        String = 2,
        Bytes = 4,
        Double = 5,
        Int32 = 6,
        Uint32 = 7,
        Int64 = 8
    }
    const NSBytesLen: {
        /**NSType.Null */ 0: number;
        /**NSType.Boolean */ 1: number;
        /**NSType.Double */ 5: number;
        /**NSType.Int32 */ 6: number;
        /**NSType.Uint32 */ 7: number;
        /**NSType.Int64 */ 8: number;
    };
    /**
     * 用于存储头部的临时变量
     */
    const nsHeader: {
        cmd: number;
        len: number;
    };
    /**
     * 头信息
     *
     * @export
     * @interface NSHeader
     */
    interface NSHeader {
        /**
         * 指令/协议号
         *
         * @type {number}
         * @memberof NSHeader
         */
        cmd: number;
        /**
         * 长度
         *
         * @type {number}
         * @memberof NSHeader
         */
        len: number;
    }
    /**
     * 通信服务
     * 收发的协议结构：
     * 2字节协议号 2字节包长度(n) n字节包
     * @author 3tion
     *
     */
    abstract class NetService {
        /**
        * 请求地址
        */
        protected _actionUrl: string;
        setLimitEventEmitable(emit: boolean): void;
        protected static _ins: NetService;
        protected _limitAlert: boolean;
        protected _limitSendFunc: {
            (cmd: number, data?: any, msgType?: Key, limit?: number): any;
        };
        protected _nolimitSendFunc: {
            (cmd: number, data?: any, msgType?: Key, limit?: number): any;
        };
        static get(): NetService;
        /**
             * 用于调试模式下写日志
             *
             * @param {number} time
             * @param {("send" | "receive")} type
             * @param {number} cmd
             * @param {*} data
             *
             * @memberOf $gmType
             */
        protected $writeNSLog: {
            (time: number, type: "send" | "receive", cmd: number, data: any): void;
        };
        protected _router: NetRouter;
        /**
         * 待发送的的被动指令列表
         */
        protected _pcmdList: Recyclable<NetSendData>[];
        /**
         * 接收数据的临时数组
         */
        protected _tmpList: Recyclable<NetData>[];
        /**
         * 读取的字节缓存
         */
        protected _readBuffer: ByteArray;
        /**
         * 发送的字节缓存
         */
        protected _sendBuffer: ByteArray;
        protected _tempBytes: ByteArray;
        /**
         * 是否连通
         */
        readonly connected?: boolean;
        /**
         * 接收消息的创建器
         *
         */
        _receiveMSG: {
            [index: number]: Key;
        };
        /**
         * 设置地址
         *
         * @abstract
         * @param {string} actionUrl
         */
        abstract setUrl(actionUrl: string): any;
        constructor();
        setEndian(endian: any): void;
        protected netChange: () => void;
        /**
         * 基础连接时间
         *
         *
         * @memberOf NetService
         */
        baseConTime: number;
        /**
         * 最大连接时间
         *
         *
         * @memberOf NetService
         */
        maxConTime: Time;
        /**
         * 重连次数
         *
         * @private
         * @type {number}
         * @memberOf NetService
         */
        protected _reconCount: number;
        /**
         * 下次自动拉取请求的时间戳
         */
        protected _nextAutoTime: number;
        /**
         * 下次自动请求的最短
         */
        protected _autoTimeDelay: number;
        protected showReconnect(): void;
        protected onawake(): void;
        /**
         * 基础类型消息
         */
        regReceiveMSGRef(cmd: number, ref: Key): void;
        /**
         * 注册处理器
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         * @param {number} [priority=0] 处理优先级
         */
        register(cmd: number, handler: INetHandler, priotity?: number): boolean;
        /**
         * 注册单次执行的处理器
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         * @param {number} [priority=0] 处理优先级
         */
        regOnce(cmd: number, handler: INetHandler, priotity?: number): boolean;
        /**
         * 移除协议号和处理器的监听
         *
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         */
        remove(cmd: number, handler: INetHandler): void;
        protected _register(cmd: number, handler: INetHandler, priotity: number, once: boolean): boolean;
        /**
         * 即时发送指令<br/>
         * 用于处理角色主动操作的请求，如点击合成道具，使用物品等
         * @param {number} cmd 协议号
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         * @param {number} [limit] 客户端发送时间限制，默认500毫秒
         */
        send(cmd: number, data?: any, msgType?: Key, limit?: number): void;
        /**
         * 即时发送指令
         */
        protected abstract _send(cmd: number, data: any, msgType: Key): any;
        /**
         * 断开连接
         */
        disconnect(): void;
        /**
         * 消极发送指令
         * 如果使用通协议的指令，有堆积的指令，先合并，新的替换旧的
         * __`请勿将一些用户操作使用此指令发送`__
         * 处理一些实时性要求不高的指令，这些指令先缓存堆积，等到用户主动发指令的时候，一起发送
         * @param {number} cmd 协议号
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         */
        sendPassive(cmd: number, data?: any, msgType?: Key): void;
        /**
         * 向缓冲数组中写入数据
         */
        writeToBuffer(bytes: ByteArray, data: NetSendData): void;
        /**
         * @private
         * @param bytes
         * @param out
         */
        decodeBytes(bytes: ByteArray): void;
        /**
         * 解析头部信息
         *
         * @protected
         * @param {ByteArray} bytes
         * @param {NSHeader} header
         * @returns 是否可以继续  true    继续后续解析
         *                       false   取消后续解析
         * @memberof NetService
         */
        protected decodeHeader(bytes: ByteArray, header: NSHeader): boolean;
        /**
         * 存储数据长度
         *
         * @protected
         * @param {ByteArray} bytes
         * @param {number} val
         * @memberof NetService
         */
        protected writeBytesLength(bytes: ByteArray, val: number): void;
        /**
         *
         * 模拟服务端
         * @param {number} cmd
         * @param {*} [data]
         */
        route(cmd: number, data?: any): void;
    }
}
declare namespace jy {
    /**
     * 状态机
     * @author 3tion
     */
    class StateMachine implements IStateListener {
        /**
         * 当前状态
         *
         * @protected
         * @type {Key}
         */
        protected current: Key;
        protected swis: {
            [index: string]: IStateSwitcher[];
        };
        protected liss: IStateListener[];
        /**
         * 状态列表
         *
         * @protected
         * @type {Key[]}
         */
        protected _stas: Key[];
        /**
         * 是否做上一个进入睡眠状态前的检查
         *
         * @type {boolean}
         * @memberof StateMachine
         */
        checkBeforeSleep?: boolean;
        constructor();
        /**
         * 获取当前已有的状态列表
         *
         * @readonly
         */
        get states(): (string | number)[];
        add(value: IStateListener): void;
        remove(value: IStateListener): void;
        /**
         *  一个侦听加入到多个状态;
         * @param type
         * @param args
         *
         */
        addToStates(value: IStateSwitcher, ...args: Key[]): any;
        /**
         * 从所有状态中删除侦听;
         * @param value
         *
         */
        removeAllState(value: IStateSwitcher): void;
        /**
         * 从单个状态中,删了一个具体侦听;
         * @param type
         * @param value
         * @return
         *
         */
        removeFromState(state: Key, value: IStateSwitcher): boolean;
        /**
         * 单个状态中加入一个侦听;
         * @param value
         * @param list
         *
         */
        addToState(state: Key, value: IStateSwitcher): void;
        /**
         *  清理状态机;
         *
         */
        clear(): void;
        /**
         * 设置当前的状态
         * @param value
         *
         */
        setState(value: Key): void;
        /**
         * 检查状态实现(switcher)是否添加到某个状态中
         *
         * @param {IStateSwitcher} switcher    某个状态实现
         * @param {Key} [type] 状态
         * @returns {boolean}
         */
        isInState(switcher: IStateSwitcher, type?: Key): boolean;
    }
}
declare namespace jy {
    const enum PBType {
        Double = 1,
        Float = 2,
        Int64 = 3,
        UInt64 = 4,
        Int32 = 5,
        Fixed64 = 6,
        Fixed32 = 7,
        Bool = 8,
        String = 9,
        Group = 10,
        Message = 11,
        Bytes = 12,
        Uint32 = 13,
        Enum = 14,
        SFixed32 = 15,
        SFixed64 = 16,
        SInt32 = 17,
        SInt64 = 18
    }
    /**
     * protobuf2 的字段类型
     *
     * @export
     * @enum {number}
     */
    const enum PBFieldType {
        Optional = 1,
        Required = 2,
        Repeated = 3
    }
    /**
     * 单个Field的结构
     *
     * @interface PBField
     */
    interface PBField extends Array<any> {
        /**
         *
         * 必有 属性名字
         * @type {Key}
         */
        0: Key;
        /**
         *
         * 必有 required optional repeated
         * @type {PBFieldType}
         */
        1: PBFieldType;
        /**
         *
         * 必有 数据类型
         * @type {number}
         */
        2: number;
        /**
         *
         * 可选 消息类型名称
         * @type {(Key | PBStruct)}
         * @memberOf PBField
         */
        3?: Key | PBStruct;
        /**
         * 可选 默认值
         *
         * @type {*}
         */
        4?: any;
    }
    /**
     * 单条消息的定义
     *
     * @interface PBStruct
     */
    interface PBStruct {
        /**索引 */
        [index: number]: PBField;
        /**
         * 有默认值的key
         *
         * @type {any}
         * @memberOf PBStruct
         */
        def?: any;
        ref?: {
            new (): any;
            prototype: any;
        };
    }
    interface PBStructDictInput {
        /**
         * 是否初始化过
         *
         * @type {*}
         * @memberOf PBStructDict
         */
        $$inted?: any;
        [index: string]: PBStruct | Key;
    }
    function getPBUtils(): {
        /**
         * 注册定义
         */
        regDef: {
            (msg: PBStruct, def: any): any;
            (msgType: string | number, def: any): any;
        };
        regStruct: (msgType: string | number, struct: PBStruct) => void;
        /**
         * 初始化默认值
         */
        initDefault: (struct: PBStruct, ref?: {
            new (): any;
            prototype: any;
        }) => void;
        /**
         * 增加ProtoBuf的消息的结构字典
         *
         * @static
         * @param {PBStructDict} dict
         *
         * @memberOf PBMessageUtils
         */
        add(dict: PBStructDictInput): void;
        readFrom: (msgType: string | number | PBStruct, bytes: ByteArray, len?: number) => any;
        writeTo: (msg: object, msgType: string | number | PBStruct, bytes?: ByteArray, debugOutData?: Object) => ByteArray;
        readMessage: (bytes: ByteArray, msgType: string | number | PBStruct) => any;
        readString: (bytes: ByteArray) => string;
        readBytes: (bytes: ByteArray) => ByteArray;
    };
    /**
     * 默认的PB工具
     */
    const PBUtils: {
        /**
         * 注册定义
         */
        regDef: {
            (msg: PBStruct, def: any): any;
            (msgType: string | number, def: any): any;
        };
        regStruct: (msgType: string | number, struct: PBStruct) => void;
        /**
         * 初始化默认值
         */
        initDefault: (struct: PBStruct, ref?: {
            new (): any;
            prototype: any;
        }) => void;
        /**
         * 增加ProtoBuf的消息的结构字典
         *
         * @static
         * @param {PBStructDict} dict
         *
         * @memberOf PBMessageUtils
         */
        add(dict: PBStructDictInput): void;
        readFrom: (msgType: string | number | PBStruct, bytes: ByteArray, len?: number) => any;
        writeTo: (msg: object, msgType: string | number | PBStruct, bytes?: ByteArray, debugOutData?: Object) => ByteArray;
        readMessage: (bytes: ByteArray, msgType: string | number | PBStruct) => any;
        readString: (bytes: ByteArray) => string;
        readBytes: (bytes: ByteArray) => ByteArray;
    };
    /**
     * 定义类型
     */
    type PBUtils = ReturnType<typeof getPBUtils>;
}
declare namespace jy {
    /**
     * 常用的颜色常量
     *
     * @export
     * @enum {number}
     */
    export const enum Color {
        Red = 16711680,
        Green = 65280,
        Yellow = 16776960,
        White = 16777215,
        Gray = 13421772
    }
    /**
     * 常用的颜色字符串常量
     *
     * @export
     * @enum {string}
     */
    export const enum ColorString {
        Red = "#ff0000",
        Green = "#00ff00",
        Yellow = "#ffff00",
        White = "#ffffff",
        Gray = "#cccccc"
    }
    function getColorString(c: number): string;
    /**
     * 颜色工具
     * @author 3tion
     *
     */
    export const ColorUtil: {
        /**
         * 获取颜色字符串 #a1b2c3
         * @param c
         * @return 获取颜色字符串 #a1b2c3
         *
         */
        getColorString: typeof getColorString;
        /**
         * 将#a1b2c3这样#开头的颜色字符串，转换成颜色数值
         */
        getColorValue(c: string): number;
        /**
         * 获取一个纯色的纹理
         */
        getTexture(color?: number, alpha?: number): egret.Texture;
    };
    export {};
}
declare namespace jy {
    /**
     * 临时对象
     * @author 3tion
     *
     */
    const Temp: {
        /**
         * 共享数组1
         */
        SharedArray1: any[];
        /**
         * 共享数组2
         */
        SharedArray2: any[];
        /**
         * 共享数组3
         */
        SharedArray3: any[];
        SharedRect1: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        SharedRect2: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        /**
         * 白鹭的点
         */
        EgretPoint: egret.Point;
        /**
         * 白鹭的矩形
         */
        EgretRectangle: egret.Rectangle;
        /**
         * 共享点1
         */
        SharedPoint1: {
            x: number;
            y: number;
            z: number;
        };
        /**
         * 共享点2
         */
        SharedPoint2: {
            x: number;
            y: number;
            z: number;
        };
        /**
         * 不做任何事情的空方法，接收任意长度的数据，返回空
         */
        voidFunction: () => any;
        /**
         * 用于替换的方法,接收任意长度的数据，返回null
         */
        willReplacedFunction: () => any;
        /**
         * 返回 true 的函数
         */
        retTrueFunc: () => boolean;
        /**
         * 返回 false 的函数
         */
        retFalseFunc: () => boolean;
        /**
         * 空对象
         */
        EmptyObject: Readonly<{}>;
        /**
         * 空数组
         */
        EmptyArray: any[];
        /**
         * 管线方法，用于符合函数的结构，并将数值传递下去
         */
        pipeFunction: <T>(arg: T) => T;
    };
}
declare namespace jy {
    /**
     * 基础渲染器
     * @author 3tion
     *
     */
    class BaseRender implements IDrawInfo {
        /**
         * 当render执行时间需要处理2秒+的数据时，是否派发Slow Render事件
         *
         * @static
         * @type {boolean}
         */
        static dispatchSlowRender: boolean;
        /**
         * 全局单位播放速度
         */
        static globalPlaySpeed: number;
        /**
         * 是否有当前帧
         */
        willRenderFrame: FrameInfo;
        /**原始动作索引 */
        a: number;
        /**原始方向索引 */
        d: number;
        /**原始帧数索引 */
        f: number;
        /**
         * 数组的索引
         */
        idx: number;
        /**
         * 下一次需要重新计算渲染的时间
         */
        protected nextRenderTime: number;
        /**
         * 当前渲染时间
         */
        protected renderedTime: number;
        /**
         * 播放速度，默认为1倍速度<br/>
         * 值越高，速度越快
         */
        protected _playSpeed: number;
        /**
         * 播放速度，默认为1倍速度<br/>
         * 值越高，速度越快
         */
        get playSpeed(): number;
        /**
         * 设置播放速度
         */
        set playSpeed(value: number);
        /**
         *  处理数据帧
         */
        onData(actionInfo: ActionInfo, now: number): void;
        isComplete(info: ActionInfo): boolean;
        /**
         * 渲染帧时调用
         *
         * @param {number} now (description)
         */
        doRender(now: number): void;
        /**
         * 渲染指定帧
         * @param frame
         * @param now
         */
        protected renderFrame(frame: FrameInfo, now: number): void;
        /**
         * 清理当前帧
         */
        protected clearRes(): void;
        /**
         * 派发事件
         * @param event     事件名
         * @param now       当前时间
         */
        protected dispatchEvent(event: string, now: number): void;
        /**
         * 渲染结束
         * @param now       当前时间
         */
        protected doComplete(now: number): void;
        constructor();
    }
}
/**
 * 资源打包信息
 * AS3的版本中实现了5种打包方式
 * H5中实现了2种（2 按动作打包，4 单方向单动作打包），不过后面只会使用4（单方向单动作）进行打包，其他方式弃用
 * @author 3tion
 */
declare namespace jy {
    /**
     * 打包类型
     */
    const enum PakSaveType {
        /**
         * 0 全部打包
         */
        PAK_ALL = 0,
        /**
         * 1 按方向打包 (弃用)
         */
        PAK_BY_DIRECTION = 1,
        /**
         * 2 按动作打包
         */
        PAK_BY_ACTION = 2,
        /**
         * 3 混合打包 (弃用)
         */
        PAK_COMPLEX = 3,
        /**
         * 单方向单动作
         */
        PAK_ONE_A_D = 4
    }
    /**
     * 存储pst信息
     */
    class PstInfo {
        /**
         * 图片数据字典<br/>
         * Key      string  存储图片数据的key <br/>
         * Value    UnitResource<br/>
         */
        protected _resources: {
            [uri: string]: UnitResource;
        } | UnitResource;
        /**
         * pst的唯一标识
         */
        key: string;
        type: number;
        /**
         * 动作信息，帧的播放信息的数组
         * Key      {number}        动作标识
         * Value    {ActionInfo}    动作信息
         */
        frames: {
            [action: number]: ActionInfo;
        };
        /**
         * 头顶显示的基准坐标Y，相对于角色的原点
         *
         * @type {number}
         */
        headY: number;
        /**
         * 受创点的基准坐标Y，相对于角色的原点
         *
         * @type {number}
         */
        hurtY: number;
        /**
         * 施法点
         * KEY      {number}        action << 8 | direction
         * VALUE    {egret.Point}   施法点坐标
         * @type {[adKey:string]:Point}
         */
        protected castPoints: {
            [adKey: number]: Point;
        };
        urCreator: {
            new (key: string, pstInfo: PstInfo): UnitResource;
        };
        /**
         * 获取施法点
         * @param {number} action 动作标识
         * @param {number} direction 方向
         * @return {Point} 如果有施法点
         */
        getCastPoint(action: number, direction: number): Point;
        getResKey(direction: number, action: number): string;
        bindResource(resKey: string, resouce: SplitUnitResource, textures: {
            [index: number]: egret.Texture[][];
        }): any;
        splitInfo: SplitInfo;
        constructor();
        init(key: string, data: any[]): void;
        /**
         * 解析图片数据
         * 用于批量处理数据
         */
        decodeImageDatas(data: {
            [index: string]: {};
        }): void;
        getResource(uri: string): any;
        /**
         * 获取单位资源
         */
        getUnitResource(uri: any): any;
    }
    /**
     * 资源打包分隔信息
     * 只保留了最主流的单动作，单方向
     */
    abstract class SplitInfo {
        /**
         * 资源字典
         */
        protected _resDict: {
            [adkey: number]: string;
        };
        /**
         * 子资源列表
         */
        protected _subReses: string[];
        readonly key: string;
        constructor(key: string);
        parseFrameData(data: any): {
            [index: number]: ActionInfo;
        };
        protected parseADDict(_alist: number[]): void;
        parseSplitInfo(_infos: any): void;
        abstract getResKey(direction: number, action: number): string;
        /**
         * 遍历资源
         * @param _forEach
         */
        forEach(_forEach: {
            (resKey: string, adKey: number): any;
        }): void;
        abstract bindResource(resKey: string, resouce: SplitUnitResource, textures: {
            [index: number]: egret.Texture[][];
        }): any;
    }
    /**
     * action << 8 | direction
     */
    type ADKey = number;
    const ADKey: {
        /**
         * 得到 A(动作)D(方向)的标识
         *
         * @static
         * @param {number} action A(动作)标识
         * @param {number} direction D(方向)标识
         * @returns {number} A(动作)D(方向)的标识
         */
        get(action: number, direction: number): number;
        /**
         * 从A(动作)D(方向)的标识中获取 A(动作)标识
         *
         * @static
         * @param {ADKey} adKey A(动作)D(方向)的标识
         * @returns {number} A(动作)标识
         */
        getAction(adKey: number): number;
        /**
         * 从A(动作)D(方向)的标识中获取 D(方向)标识
         *
         * @static
         * @param {ADKey} adKey A(动作)D(方向)的标识
         * @returns {number} D(方向)标识
         */
        getDirection(adKey: number): number;
    };
}
declare namespace jy {
    /**
     *
     * 震动的基本实现
     * @export
     * @class BaseShake
     * @implements {Shake}
     * @author 3tion
     */
    abstract class BaseShake implements Shake {
        /**
         * 释放正在震动
         *
         * @protected
         * @type {boolean}
         */
        protected _shaking: boolean;
        /**
         * 震动目标
         *
         * @protected
         * @type {ShakeTarget}
         */
        protected _target: ShakeTarget;
        get target(): ShakeTarget;
        /**
         * 单位X方向基准值      一般为单位初始值
         *
         * @protected
         * @type {number}
         */
        protected _cx: number;
        /**
         * 单位Y方向基准值      一般为单位初始值
         *
         * @protected
         * @type {number}
         */
        protected _cy: number;
        protected _total: number;
        /**
         * 总执行时间
         */
        get total(): number;
        setShakeTarget(target: ShakeTarget): Shake;
        /**
         * 设置单位基准值
         *
         * @param {number} [cx]
         * @param {number} [cy]
         */
        setTargetPos(cx?: number, cy?: number): void;
        start(): void;
        abstract tick(duration: number, outPt: {
            x: number;
            y: number;
        }): any;
        end(): void;
        /**
         * 销毁的处理
         */
        dispose(): void;
    }
}
declare namespace jy {
    /**
     * 用于君游项目数据同步，后台运行<br/>
     * 只有注册和注销，没有awake和sleep
     * @author 3tion
     *
     */
    abstract class Proxy extends FHost {
        /**
         * 是否被其他模块依赖
         *
         * @type {boolean}
         */
        _$isDep: boolean;
        /**
         * 默认当作同步数据，认为是已经处理好的
         */
        protected _selfReady: boolean;
        /**
         * 数据是否加载完毕
         */
        protected _readyState: RequestState;
        constructor(name: string | number);
        get isReady(): boolean;
        startSync(): boolean;
        /**
         * 用于重写，主要用于向服务端发送一些指令/或者是开始进行http请求进行拉配置
         *
         */
        protected _startSync(): void;
        /**
         * 自己加载好<br/>
         * 不包括依赖项
         *
         */
        protected selfReady(): void;
        /**
         * 用于子类重写<br/>
         * 处理自己的数据<br/>
         * 如果有依赖，请使用afterAllReady<br/>
         *
         */
        protected parseSelfData(): void;
        /**
         * 依赖项加载完毕
         *
         */
        protected dependerReadyCheck(): void;
        /**
         * 全部ok<br/>
         * 此函数不给子类继承
         */
        private allReadyHandler;
    }
}
declare namespace jy {
    interface ViewController {
        /**
         * 面板加入到舞台时执行
         */
        onAwake?(): any;
        /**
         * 面板从舞台移除时执行
         */
        onSleep?(): any;
    }
    /**
     * 可以调用 @d_interest 的视图
     * 可以进行关注facade中的事件
     *
     * @export
     * @class ViewController
     * @extends {FHost}
     */
    class ViewController extends FHost {
        /**
         * 加载状态
         */
        protected _ready: boolean;
        /**
         * 关注列表
         */
        protected _interests: {
            [index: string]: Interest;
        };
        interestChecked: boolean;
        _awakeCallers: {
            (e?: egret.Event): void;
        }[];
        /**
         * 定时回调的列表
         */
        _tList: $CallbackInfo[];
        /**
         * 用于内部增加关注
         *
         * @param {Key} eventType
         * @param {{ (e?: egret.Event): void }} handler
         * @param {boolean} [triggerOnStage]
         * @param {number} [priority]
         */
        interest(eventType: Key, handler: {
            (e?: egret.Event): void;
        }, triggerOnStage?: boolean, priority?: number): void;
        uninterest(eventType: Key): void;
        removeSkinListener(skin: egret.DisplayObject): void;
        addSkinListener(skin: egret.DisplayObject): void;
        /**
         * 绑定定时处理的回调函数
         *
         * @param {Function} callback 执行回调函数
         * @param {boolean} [trigger=true] 是否理解执行
         * @param {number} [time=Time.ONE_SECOND]
         * @param {any} [thisObj=this]
         * @param {any} args
         * @memberof ViewController
         */
        bindTimer(callback: Function, trigger?: boolean, time?: Time, thisObj?: this, ...args: any[]): void;
        /**
         * 解除定时回调函数的绑定
         * @param callback
         * @param time
         * @param thisObj
         */
        looseTimer(callback: Function, time?: Time, thisObj?: this): void;
        /**
         * 添加到舞台时，自动添加定时回调
         */
        awakeTimer(): void;
        /**
         * 从舞台移除时候，自动移除定时回调
         */
        sleepTimer(): void;
        get isReady(): boolean;
        onStage(e: egret.Event): void;
        stageChange(onStage: boolean): void;
        checkInterest(): void;
    }
    interface Interest {
        /**
         * 回调函数
         */
        handler: (e?: egret.Event) => void;
        /**
         *
         * 优先级
         * @type {number}
         */
        priority: number;
        /**
         *
         * 添加到舞台的时候，立即执行一次回调函数
         * @type {boolean}
         */
        trigger: boolean;
        /**
         * 是否为私有监听，此值设置为true则子类不会继承事件监听
         * 否则子类将继承事件监听
         */
        isPri?: boolean;
    }
    /**
     * 使用@d_interest 注入 添加关注
     * 关注为事件处理回调，只会在awake时，添加到事件监听列表
     * 在sleep时，从事件监听列表中移除
     * @param {Key} type                         关注的事件
     * @param {(e?: Event) => void} handler          回调函数
     * @param {boolean} [triggerOnStage=false]      添加到舞台的时候，会立即执行一次，`<font color="#f00">`注意，处理回调必须能支持不传event的情况`
     * @param {boolean} [isPrivate=false]           是否为私有方法，如果标记为私有方法，则不会被子类的关注继承
     * @param {number} [priority=0]                 优先级，默认为0
     */
    function d_interest(eventType: Key, triggerOnStage?: boolean, isPrivate?: boolean, priority?: number): (target: any, _: string, value: any) => void;
}
declare namespace jy {
    /**
     * Scroller的参数
     */
    interface ScrollerOption extends DragOption {
    }
    class Scroller extends egret.EventDispatcher {
        protected _scrollbar: ScrollBar;
        protected _content: egret.DisplayObject;
        get content(): egret.DisplayObject;
        protected _scrollType: ScrollDirection;
        protected _lastTargetPos: number;
        /***滑块移动一像素，target滚动的距离*/
        protected _piexlDistance: number;
        /**鼠标每移动1像素，元件移动的像素 */
        globalspeed: number;
        /***是不是一直显示滚动条 */
        alwaysShowBar: boolean;
        /**最小的滑动速度，当前值低于此值后不再滚动 */
        minEndSpeed: number;
        /**速度递减速率 */
        blockSpeed: number;
        protected _useScrollBar: boolean;
        /**
         * 多帧拖拽的累计偏移量
         */
        protected _offsets: number;
        /**
         *
         */
        protected _offCount: number;
        protected _moveSpeed: number;
        protected _dragSt: number;
        protected _lastFrameTime: number;
        protected _deriction: ScrollDirection;
        protected _key: PosKey;
        protected _sizeKey: SizeKey;
        protected _measureKey: EgretMeasureSizeKey;
        protected drag: DragDele;
        readonly opt?: Readonly<ScrollerOption>;
        constructor(opt?: ScrollerOption);
        /**
         * 滚动条方式 0：垂直，1：水平 defalut:0
         */
        set scrollType(value: ScrollDirection);
        /**
         * 滚动条方式 0：垂直，1：水平 defalut:0
         */
        get scrollType(): ScrollDirection;
        protected checkScrollBarView(): void;
        protected onScrollBarAdded(): void;
        setRect(rect: Rect): void;
        /**
         * 绑定目标与滚动条
         *
         * @ content (需要滚动的目标)
         * @ scrollRect (显示的区域大小)
         * @ scrollbar (可选，如果不想显示滚动条可不传)
         */
        bindObj(content: egret.DisplayObject & {
            scroller?: Scroller;
        }, scrollRect: egret.Rectangle, scrollbar?: ScrollBar): void;
        /**
         * 对content绘制鼠标触发区域
         * 将会对content的graphics先进行清理
         * 然后基于content的bounds进行绘制
         *
         */
        drawTouchArea(content?: egret.Shape): void;
        bindObj2(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar): void;
        protected onResize(): void;
        protected onDragStart(e: egret.TouchEvent): void;
        /**
         * 停止拖拽，避免有些情况下，需要主动停止拖拽的情况
         */
        stopDrag(): void;
        protected getDragPos(e: egret.TouchEvent): number;
        protected onDragMove(e: egret.TouchEvent): void;
        stopTouchTween(): void;
        protected onRender(): void;
        protected onDragEnd(e: egret.TouchEvent): void;
        showBar(): void;
        hideBar(): void;
        /**
         * 执行滚动
         *
         * @ sub (滚动的距离)
         */
        doScrollContent(sub: number): void;
        doMoveScrollBar(sub: number): void;
        /**
         * 移动到指定位置
         *
         * @ pos (位置)
         */
        scrollTo(pos: number): void;
        /**移动至头 */
        scrollToHead(): void;
        /**移动至尾 */
        scrollToEnd(): void;
        protected scaleBar(): void;
        /**
         * 获取滚动到最后的起始点
         *
         * @readonly
         * @protected
         */
        protected get scrollEndPos(): number;
        protected checkAndResetBarPos(): void;
    }
}
declare namespace jy {
    abstract class AbsPageList<T, R extends ListItemRender<T>> extends egret.EventDispatcher {
        protected _list: R[];
        protected _data: T[];
        protected _selectedIndex: number;
        protected _selectedItem: R;
        protected _dataLen: number;
        /**
         * 获取数据长度
         *
         * @readonly
         */
        get dataLen(): number;
        /**
         * 获取数据集
         *
         * @readonly
         */
        get data(): T[];
        /**
         * 渲染指定位置的render
         *
         * @ private
         * @ param {number} start (起始索引)
         * @ param {number} end (结束索引)
         */
        protected doRender(start: number, end?: number): void;
        set selectedIndex(value: number);
        protected $setSelectedIndex(value: number): void;
        /**
         * 获取选中对象的数据
         */
        get selectedData(): T;
        get selectedIndex(): number;
        /**
         *
         * 根据索引获得视图
         * @param {number} idx
         * @returns
         */
        getItemAt(idx: number): R;
        selectItemByData<K extends keyof T>(key: K, value: T[K], _useTween?: boolean): this;
        /**
         * 遍历列表
         *
         * @param {{(data:T,render:R,idx:number,...args)}} handle
         * @param {any} otherParams
         */
        forEach(handle: {
            (data: T, render: R, idx: number, ...args: any[]): any;
        }, ...otherParams: any[]): this;
        /**
         * 找到第一个符合要求的render
         *
         * @param {{(data:T,render:R,idx:number,...args):boolean}} handle
         * @param {any} otherParams
         * @returns
         */
        find(handle: {
            (data: T, render: R, idx: number, ...args: any[]): boolean;
        }, ...otherParams: any[]): R;
        get selectedItem(): R;
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        abstract updateByIdx(index: number, data: T): this;
        /**
         * 根据key value获取item,将item的data重新赋值为data
         *
         * @param {string} key (description)
         * @param {*} value (description)
         * @param {T} data (description)
         */
        updateByKey<K extends keyof T>(key: K, value: T[K], data?: T): void;
        protected abstract _get(index: number): R;
        /**
         * 清理数据
         *
         * @abstract
         */
        abstract clear(): this;
        /**
         * 销毁
         *
         * @abstract
         */
        abstract dispose(): any;
        abstract displayList(data?: T[]): this;
        protected onTouchItem(e: egret.TouchEvent): void;
        protected changeRender(render: R, index?: number): void;
        getAllItems(): R[];
        get length(): number;
        /**
         * 让所有在舞台上的render重新刷新一次数据
         *
         *
         * @memberOf PageList
         */
        refresh(): this;
        /**
         * 根据index使某个在舞台上的render刷新
         *
         * @param {number}  idx
         * @param {boolean} [force]     是否强制执行setData和handleView
         * @memberOf PageList
         */
        refreshAt(idx: number, force?: boolean): this;
        /**
         * render进行切换
         *
         * @protected
         */
        protected onChange(): void;
    }
}
declare namespace jy {
    /**
     * 位图的创建器
     * @author 3tion
     *
     */
    class BitmapCreator<T extends egret.Bitmap> extends BaseCreator<T> {
        /**
         * 是否为jpg
         *
         * @protected
         * @type {boolean}
         */
        protected isjpg?: boolean;
        constructor(value?: SuiData);
        parseSelfData(data: any): void;
        protected bindEvent(bmp: egret.Bitmap): void;
        protected awake(e: egret.Event): void;
        protected sleep(): void;
    }
}
declare namespace jy {
    interface IButton extends Component {
        /**
         * 按钮上的标签
         *
         * @type {string}
         * @memberof IButton
         */
        label: string;
        /**
         * 是否选中
         *
         * @type {boolean}
         */
        selected: boolean;
        /**
         * 绑定TOUCH_TAP的回调
         *
         * @template T
         * @param {{ (this: T, e?: egret.Event): any }} handler
         * @param {T} [thisObject]
         * @param {number} [priority]
         * @param {boolean} [useCapture]
         */
        bindTouch<T>(handler: {
            (this: T, e?: egret.Event): any;
        }, thisObject?: T, priority?: number, useCapture?: boolean): any;
        /**
         * 解除TOUCH_TAP的回调的绑定
         *
         * @param {Function} handler
         * @param {*} thisObject
         * @param {boolean} [useCapture]
         *
         * @memberOf Button
         */
        looseTouch(handler: Function, thisObject?: any, useCapture?: boolean): any;
    }
    /**
     * 按钮
     * 在fla中 按钮只是需要1帧
     * 按钮帧数对应的状态为
     * 第1帧  启用 未选中
     * 第2帧  启用 选中
     * 第3帧  禁用 未选中
     * 第4帧  禁用 选中
     *
     * 第4帧 没有，会用 第3帧代替
     * 第3帧 或者 第2帧 没有，会用第一帧代替
     * @author 3tion
     *
     */
    class Button extends Component implements IButton {
        txtLabel: egret.TextField;
        bitmaps: egret.Bitmap[];
        /**
         * 按钮的底部
         *
         * @type {egret.DisplayObject}
         * @memberOf Button
         */
        floor?: egret.DisplayObject;
        /**
         * 按钮的顶部
         *
         * @type {egret.DisplayObject}
         * @memberOf Button
         */
        ceil?: egret.DisplayObject;
        /**
         *
         * 用于放置子容器
         * @protected
         * @type {egret.DisplayObjectContainer}
         */
        protected _children?: egret.DisplayObjectContainer;
        protected _label: string;
        /**
         * 是否选中
         */
        protected _selected: boolean;
        protected _currentBmp: egret.Bitmap;
        constructor();
        bindChildren(): void;
        /**
         * 设置按钮上的标签
         */
        set label(value: string);
        $setLabel(value: string): void;
        /**
         * 获取按钮上的标签
         */
        get label(): string;
        $setEnabled(value: boolean): void;
        /**
         * 设置选中
         */
        set selected(value: boolean);
        protected $setSelected(value: boolean): void;
        /**
         * 获取当前按钮选中状态
         */
        get selected(): boolean;
        protected refresh(changed?: boolean): void;
        /**
         * 获取按钮的帧数
         *
         * @returns
         */
        protected $getBtnFrame(): number;
        /**
         * 绑定TOUCH_TAP的回调
         *
         * @template T
         * @param {{ (this: T, e?: egret.Event): any }} handler
         * @param {T} [thisObject]
         * @param {number} [priority]
         * @param {boolean} [useCapture]
         */
        bindTouch<T>(handler: {
            (this: T, e?: egret.Event): any;
        }, thisObject?: T, priority?: number, useCapture?: boolean): void;
        /**
         * 解除TOUCH_TAP的回调的绑定
         *
         * @param {Function} handler
         * @param {*} thisObject
         * @param {boolean} [useCapture]
         *
         * @memberOf Button
         */
        looseTouch(handler: Function, thisObject?: any, useCapture?: boolean): void;
        addChild(child: egret.DisplayObject, notify?: boolean): egret.DisplayObject;
        dispose(): void;
    }
    /**
     * 按钮创建器
     * @author 3tion
     *
     */
    class ButtonCreator extends BaseCreator<Button> {
        parseSelfData(data: any): void;
    }
}
declare module egret {
    interface DisplayObject {
        $layoutHost: jy.LayoutContainer;
    }
}
declare namespace jy {
    abstract class LayoutContainer {
        static readonly MIN: Readonly<{
            width: number;
            height: number;
        }>;
        protected $layoutBins: ArraySet<LayoutBin>;
        protected _lw: number;
        protected _lh: number;
        protected _basis: Size;
        protected _host: egret.Sprite;
        constructor(basis: Size, host?: egret.Sprite);
        /**
         * 重置尺寸
         *
         * @param {Size} basis
         *
         * @memberOf LayoutContainer
         */
        resetBasis(basis: Size): void;
        protected onStage(): void;
        protected offStage(): void;
        abstract onResize(): any;
        get view(): egret.Sprite;
        show(...dises: egret.DisplayObject[]): void;
        hide(...dises: egret.DisplayObject[]): void;
        /**
         * 移除视图
         *
         * @param {egret.DisplayObject} dis
         * @returns
         */
        remove(dis: egret.DisplayObject): LayoutBin;
        addDis(dis: egret.DisplayObject, bin?: LayoutBin, hide?: boolean): void;
        addLayout(dis: egret.DisplayObject, type?: LayoutType, size?: Size, left?: number, top?: number, outerV?: boolean, outerH?: boolean, hide?: boolean): void;
        protected onAdded(e: egret.Event): void;
        protected binLayout(bin: LayoutBin): void;
        protected $doLayout(): void;
        protected layoutAll(): void;
    }
    interface LayoutBin {
        dis?: egret.DisplayObject;
        type?: LayoutType;
        left?: number;
        top?: number;
        offsetType?: number;
        outerV?: boolean;
        outerH?: boolean;
        size?: Size;
        right?: number;
        bottom?: number;
    }
    /**
     * @param sw 舞台宽度
     * @param sh 舞台高度
     * @param bw 要调整的可视对象宽度
     * @param bh 要调整的可视对象高度
     * @param {boolean} [isWide=false] fixedNarrow 还是 fixedWide，默认按fixedNarrow布局
     */
    function getFixedLayout(sw: number, sh: number, bw: number, bh: number, isWide?: boolean): {
        dw: number;
        dh: number;
        scale: number;
        lw: number;
        lh: number;
    };
}
declare namespace jy {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @class MenuBaseRender
     * @extends {egret.Sprite}
     * @template T
     */
    class MenuBaseRender<T extends MenuBaseVO> {
        protected _data: T;
        protected _skin: egret.DisplayObject;
        protected _size: egret.Rectangle;
        protected itemClick(): void;
        getSize(): egret.Rectangle;
        set data(value: T);
        /**
         * 只允许子类重写
         * @protected
         */
        protected $setData(val: T): void;
        get data(): T;
        set skin(value: egret.DisplayObject);
        get skin(): egret.DisplayObject;
        protected $setSkin(value: egret.DisplayObject): void;
        protected bindComponent(): void;
        get view(): egret.DisplayObject;
    }
}
declare namespace jy {
    /**
     * 单选按钮组
     */
    class Group extends egret.EventDispatcher {
        protected _list: IGroupItem[];
        protected _selectedItem: IGroupItem;
        protected _selectedIndex: number;
        /**
         * 添加单个组件
         *
         * @param {IGroupItem} item
         */
        addItem(item: IGroupItem): void;
        getAllItems(): IGroupItem[];
        get length(): number;
        /**
         * 获取 IGroupItem
         *
         * @param {number} idx
         * @returns
         */
        getItemAt(idx: number): IGroupItem;
        removeAt(idx: number): IGroupItem;
        protected touchHandler(e: egret.TouchEvent): void;
        /**
         * 移除单个组件
         *
         * @param {IGroupItem} item
         */
        removeItem(item: IGroupItem): IGroupItem;
        /**
         * 添加多个组件
         *
         * @param {...IGroupItem[]} itemArr
         */
        addItems(...itemArr: IGroupItem[]): any;
        /**
         * 设置选中组件
         */
        set selectedItem(item: IGroupItem);
        protected $setSelectedItem(item?: IGroupItem): boolean;
        get selectedItem(): IGroupItem;
        /**
         * 设置选中索引
         */
        set selectedIndex(idx: number);
        protected $setSelectedIndex(idx: number): void;
        get selectedIndex(): number;
        clear(): void;
        onRecycle(): void;
    }
}
declare namespace jy {
    type $CallbackInfo = CallbackInfo<Function>;
    /**
     * 回调信息，用于存储回调数据
     * @author 3tion
     *
     */
    class CallbackInfo<T extends Function> implements IRecyclable {
        callback: T;
        args: any[];
        thisObj: any;
        doRecycle: boolean;
        /**
         * 待执行的时间
         */
        time: number;
        constructor();
        init(callback: T, thisObj?: any, args?: any[]): void;
        /**
         * 检查回调是否一致，只检查参数和this对象,不检查参数
         */
        checkHandle(callback: T, thisObj: any): boolean;
        /**
         * 执行回调
         * 回调函数，将以args作为参数，callback作为函数执行
         * @param {boolean} [doRecycle] 是否回收CallbackInfo，默认为true
         */
        execute(doRecycle?: boolean): any;
        /**
         * 用于执行其他参数
         * 初始的参数会按顺序放在末位
         * @param args (description)
         */
        call(...args: any[]): any;
        /**
         * 用于执行其他参数
         * 初始的参数会按顺序放在末位
         * 此方法会回收callbackInfo
         * @param {any} args
         */
        callAndRecycle(...args: any[]): any;
        onRecycle(): void;
        recycle: {
            (): any;
        };
        /**
         * 获取CallbackInfo的实例
         */
        static get<T extends Function>(callback: T, thisObj?: any, ...args: any[]): CallbackInfo<T>;
        /**
         * 加入到数组
         * 检查是否有this和handle相同的callback，如果有，就用新的参数替换旧参数
         * @param list
         * @param handle
         * @param args
         * @param thisObj
         */
        static addToList<T extends Function>(list: CallbackInfo<T>[], handle: T, thisObj?: any, ...args: any[]): CallbackInfo<T>;
        /**
         * 从列表中移除
         *
         * @static
         * @template T
         * @param {CallbackInfo<T>[]} list
         * @param {T} handle
         * @param {*} [thisObj]
         * @returns
         * @memberof CallbackInfo
         */
        static removeFromList<T extends Function>(list: CallbackInfo<T>[], handle: T, thisObj?: any): CallbackInfo<T>;
    }
}
declare namespace jy {
    const enum ClassConst {
        DebugIDPropertyKey = "_insid"
    }
    /**
     * 创建器
     */
    type Creator<T> = {
        new (): T;
    } | {
        (): T;
    };
    /**
     *
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    class ClassFactory<T> {
        private _creator;
        private _props;
        /**
         * @param {Creator<T>} creator
         * @param {Partial<T>} [props] 属性模板
         * @memberof ClassFactory
         */
        constructor(creator: Creator<T>, props?: Partial<T>);
        /**
         * 获取实例
         *
         * @returns
         */
        get(): any;
    }
    /**
     * 可回收的对象
     *
     * @export
     * @interface IRecyclable
     */
    interface IRecyclable {
        /**
         * 回收时触发
         */
        onRecycle?: {
            (): any;
        };
        /**
         * 启用时触发
         */
        onSpawn?: {
            (): any;
        };
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
    class RecyclablePool<T> {
        private _pool;
        private _max;
        private _creator;
        get(): T;
        /**
         * 回收
         */
        recycle(t: T): void;
        constructor(TCreator: Creator<T>, max?: number);
    }
    type Recyclable<T> = T & {
        recycle(): void;
    };
    /**
     * 获取一个recyclable的对象
     *
     * @export
     * @template T
     * @param {(Creator<T> & { _pool?: RecyclablePool<T> })} clazz 对象定义
     * @param {boolean} [addInstanceRecycle] 是否将回收方法附加在实例上，默认将回收方法放在实例
     * @returns {Recyclable<T>}
     */
    function recyclable<T>(clazz: Creator<T> & {
        _pool?: RecyclablePool<T>;
    }, addInstanceRecycle?: boolean): Recyclable<T>;
    namespace recyclable {
        var recycleList: <T>(list: Recyclable<T>[], len: number) => void;
    }
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    function singleton<T>(clazz: {
        new (): T;
        _instance?: T;
    }): T;
}
declare namespace jy {
    const enum ConditionOperator {
        /**
         * 具体值
         */
        Value = 1,
        BracketsMask = 2048,
        /**
         * 括号
         */
        Brackets = 2048,
        /**
         * 函数
         */
        Function = 2049,
        /**
         * 比较
         * = > < <> >= <=
         */
        Comperation = 2
    }
    interface ConditionNode {
        parent: ConditionNode;
        op: ConditionOperator;
        nodes: ConditionNode[];
        value: string;
        /**
         * 原始内容
         */
        raw: string;
        /**
         * 起始索引
         */
        start: number;
        /**
         * 结束索引
         */
        end: number;
    }
    interface ConditionCheckContext {
        /**
         * 不符合条件的错误
         */
        errors?: string[];
    }
    class Condition {
        /**
         * 注册值处理器
         */
        static setValueSolver(solver: ConditionValueSolver): void;
        static setMsgSolver(solver: ConditionMsgSolver): void;
        /**
         * 注册函数处理器
         * @param funcName
         * @param handler
         */
        static regFuncSolver(funcName: string, handler: ConditionFuncSolver): void;
        /**
         * 设置tip处理器
         * @param tipHandler
         */
        static setTip(tipHandler: ShowConditionTip): void;
        readonly root: ConditionNode;
        /**
         * 上下文数据
         * @param context
         */
        check(context?: ConditionCheckContext): any;
        decode(content: string): this;
    }
    type ConditionFuncSolver = {
        (nodes: ConditionNode[], context: ConditionCheckContext): any;
    };
    type ConditionValueSolver = {
        (value: string, context: ConditionCheckContext): any;
    };
    type ConditionMsgSolver = {
        (node: ConditionNode, context: ConditionCheckContext): string;
    };
    type ShowConditionTip = {
        (msgs: string[]): any;
    };
}
declare namespace jy {
    /**
     * 绑定属性名，当属性值发生改变时，可自动对外抛eventType事件
     *
     * @export
     * @param {Key} eventType     事件类型
     * @param {boolean} [selfDispatch]          默认false，使用Facade抛事件，event.data为实例本身
     *                                          如果为true，需要为EventDispatcher的实现，会使用自身抛事件
     * @returns
     */
    function d_fire(eventType: Key, selfDispatch?: boolean): (host: any, property: string) => void;
    /**
     * 使用微软vs code中使用的代码
     * 用于一些 lazy 的调用
     * https://github.com/Microsoft/vscode/blob/master/src/vs/base/common/decorators.ts
     *
     * @export
     * @param {*} target
     * @param {string} key
     * @param {*} descriptor
     */
    function d_memoize(target: any, key: string, descriptor: any): void;
}
declare namespace jy {
    /**
     * 可用于做Key的类型
     */
    type Key = number | string;
}
declare namespace jy {
    /**
     * WebGL的常量值
     *
     * https://github.com/whh8162880/RFStage3D/blob/develop/src/com/youbt/core/Capabilities.ts
     *
     * http://webglreport.com/
     */
    interface WebGLCapabilities {
        /**
         * gl 的版本，如：
         * WebGL 1.0 (OpenGL ES 2.0 Chromium)
         */
        readonly version: string;
        /**
         * GLSL 语言版本，如：
         * WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)
         *
         */
        readonly shaderVersion: string;
        /**
         * 供应商：
         * webkit
         */
        readonly vendor: string;
        /**
         * 渲染器：
         * WebKit WebGL
         */
        readonly renderer: string;
        /**
         * 供应商，如：
         * Google Inc
         * Intel Inc.
         */
        readonly unmaskedVendor?: string;
        /**
         * 渲染器：
         * ANGLE (AMD Radeon HD 7700 Series Direct3D11 vs_5_0 ps_5_0)
         * Intel Iris OpenGL Engine
         * 可以拿到显卡信息
         */
        readonly unmaskedRenderer?: string;
        /**
         * 是否抗支持锯齿
         */
        readonly antialias: boolean;
        /**
         * 是否使用了 ANGLE 技术来使 Direct X 支持 WebGL 的接口, 文档地址: https://baike.baidu.com/item/angle/3988?fr=aladdin
         *
         * Google宣布了新的开源项目 ANGLE （全称 Almost Native Graphics Layer Engine），这个项目的目标是在 Direct X 9.0c API 的基础上实现一层 OpenGL ES 2.0 API中 的 Web GL 子集接口。在开发的早期，ANGLE 项目将使用 BSD 授权发布，而最终完成后，类似 Google Chrome 之类的浏览器在 Windows 平台上运行 WebGL 内容将不再依赖于任何的 OpenGL 驱动程序。 [1]
        */
        readonly angle: AngleVersion;
        /**
         * 顶点着色器中最多可以定义的属性数量
         */
        readonly maxVertAttr: number;
        /**
         * 一个顶点着色器上可以使用纹理单元的最大数量
         */
        readonly maxVertTextureCount: number;
        /**
         * 一个顶点着色器上可以使用的 uniform 向量的最大数量
         */
        readonly maxVertUniforms: number;
        /**
         * 一个着色器上可以使用的 varying 向量的最大数量
         */
        readonly maxVaryings: number;
        /**
         *  一个片段着色器上可以使用的 uniform 向量的最大数量
         */
        readonly maxFragUniform: number;
        /**
         * 带锯齿直线宽度的范围
         */
        readonly aliasedLineWidth: Float32Array[];
        /**
         * 带锯齿点的尺寸范围
         */
        readonly aliasedPointSize: Float32Array[];
        /**
         * 一个片段着色器上可以使用纹理单元的最大数量
         */
        readonly maxTextureCount: number;
        /**
         * 纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸
         */
        readonly maxTextureSize: number;
        /**
         * 立方图纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸
         */
        readonly maxCubeMapTextureSize: number;
        /**
         * 所有片段着色器总共能访问的纹理单元数
         */
        readonly maxCombinedTextureCount: number;
        /**
         * 最大同向异性过滤值, 文档: https://blog.csdn.net/dcrmg/article/details/53470174
         */
        readonly maxAnisotropy: number;
        readonly maxDrawBuffers: number;
        /**
         * 颜色缓存中红色的位数
         */
        readonly redBits: number;
        /**
         * 颜色缓存中绿色的位数
         */
        readonly greenBits: number;
        /** 颜色缓存中蓝色的位数 */
        readonly blueBits: number;
        /** 颜色缓存中透明度的位数 */
        readonly alphaBits: number;
        /** 深度缓存中每个像素的位数 */
        readonly depthBits: number;
        /** 模板缓存中每个像素的位数 */
        readonly stencilBits: number;
        /** 最大的渲染缓冲尺寸 */
        readonly maxRenderBufferSize: number;
        /** 视口最大尺寸 */
        readonly maxViewportSize: Int32Array[];
    }
    /**
     * ANGLE （全称 Almost Native Graphics Layer Engine），这个项目的目标是在 Direct X 9.0c API 的基础上实现一层 OpenGL ES 2.0 API中 的 Web GL 子集接口。
     */
    const enum AngleVersion {
        No = 0,
        D3D9 = 1,
        D3D11 = 2
    }
    function getWebGLCaps(g?: WebGLRenderingContext): WebGLCapabilities;
}
declare namespace jy {
    /**
     * webgl 的常量
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
     *
     * 使用此常量以便减少字符串，并加快调用
     */
    const enum WebGLConst {
        /**
         * Passed to `clear` to clear the current depth buffer.
         */
        DEPTH_BUFFER_BIT = 256,
        /**
         * Passed to `clear` to clear the current stencil buffer.
         */
        STENCIL_BUFFER_BIT = 1024,
        /**
         * Passed to `clear` to clear the current color buffer.
         */
        COLOR_BUFFER_BIT = 16384,
        /**
         * Passed to `drawElements` or `drawArrays` to draw single points.
         */
        POINTS = 0,
        /**
         * Passed to `drawElements` or `drawArrays` to draw lines. Each vertex connects to the one after it.
         */
        LINES = 1,
        /**
         * Passed to `drawElements` or `drawArrays` to draw lines. Each set of two vertices is treated as a separate line segment.
         */
        LINE_LOOP = 2,
        /**
         * Passed to `drawElements` or `drawArrays` to draw a connected group of line segments from the first vertex to the last.
         */
        LINE_STRIP = 3,
        /**
         * Passed to `drawElements` or `drawArrays` to draw triangles. Each set of three vertices creates a separate triangle.
         */
        TRIANGLES = 4,
        /**
         * Passed to `drawElements` or `drawArrays` to draw a connected group of triangles.
         */
        TRIANGLE_STRIP = 5,
        /**
         * Passed to `drawElements` or `drawArrays` to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan.
         */
        TRIANGLE_FAN = 6,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to turn off a component.
         */
        ZERO = 0,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to turn on a component.
         */
        ONE = 1,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the source elements color.
         */
        SRC_COLOR = 768,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by one minus the source elements color.
         */
        ONE_MINUS_SRC_COLOR = 769,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the source's alpha.
         */
        SRC_ALPHA = 770,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by one minus the source's alpha.
         */
        ONE_MINUS_SRC_ALPHA = 771,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the destination's alpha.
         */
        DST_ALPHA = 772,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by one minus the destination's alpha.
         */
        ONE_MINUS_DST_ALPHA = 773,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the destination's color.
         */
        DST_COLOR = 774,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by one minus the destination's color.
         */
        ONE_MINUS_DST_COLOR = 775,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to multiply a component by the minimum of source's alpha or one minus the destination's alpha.
         */
        SRC_ALPHA_SATURATE = 776,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to specify a constant color blend function.
         */
        CONSTANT_COLOR = 32769,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to specify one minus a constant color blend function.
         */
        ONE_MINUS_CONSTANT_COLOR = 32770,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to specify a constant alpha blend function.
         */
        CONSTANT_ALPHA = 32771,
        /**
         * Passed to `blendFunc` or `blendFuncSeparate` to specify one minus a constant alpha blend function.
         */
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        /**
         * Passed to `blendEquation` or `blendEquationSeparate` to set an addition blend function.
         */
        FUNC_ADD = 32774,
        /**
         * Passed to `blendEquation` or `blendEquationSeparate` to specify a subtraction blend function (source - destination).
         */
        FUNC_SUBSTRACT = 32778,
        /**
         * Passed to `blendEquation` or `blendEquationSeparate` to specify a reverse subtraction blend function (destination - source).
         */
        FUNC_REVERSE_SUBTRACT = 32779,
        /**
         * Passed to `getParameter` to get the current RGB blend function.
         */
        BLEND_EQUATION = 32777,
        /**
         * Passed to `getParameter` to get the current RGB blend function. Same as BLEND_EQUATION
         */
        BLEND_EQUATION_RGB = 32777,
        /**
         * Passed to `getParameter` to get the current alpha blend function. Same as BLEND_EQUATION
         */
        BLEND_EQUATION_ALPHA = 34877,
        /**
         * Passed to `getParameter` to get the current destination RGB blend function.
         */
        BLEND_DST_RGB = 32968,
        /**
         * Passed to `getParameter` to get the current destination RGB blend function.
         */
        BLEND_SRC_RGB = 32969,
        /**
         * Passed to `getParameter` to get the current destination alpha blend function.
         */
        BLEND_DST_ALPHA = 32970,
        /**
         * Passed to `getParameter` to get the current source alpha blend function.
         */
        BLEND_SRC_ALPHA = 32971,
        /**
         * Passed to `getParameter` to return a the current blend color.
         */
        BLEND_COLOR = 32773,
        /**
         * Passed to `getParameter` to get the array buffer binding.
         */
        ARRAY_BUFFER_BINDING = 34964,
        /**
         * Passed to `getParameter` to get the current element array buffer.
         */
        ELEMENT_ARRAY_BUFFER_BINDING = 34965,
        /**
         * Passed to `getParameter` to get the current `lineWidth` (set by the `lineWidth` method).
         */
        LINE_WIDTH = 2849,
        /**
         * Passed to `getParameter` to get the current size of a point drawn with `gl.POINTS`
         */
        ALIASED_POINT_SIZE_RANGE = 33901,
        /**
         * Passed to `getParameter` to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1.
         */
        ALIASED_LINE_WIDTH_RANGE = 33902,
        /**
         * Passed to `getParameter` to get the current value of `cullFace`. Should return `FRONT`, `BACK`, or `FRONT_AND_BACK`
         */
        CULL_FACE_MODE = 2885,
        /**
         * Passed to `getParameter` to determine the current value of `frontFace`. Should return `CW` or `CCW`.
         */
        FRONT_FACE = 2886,
        /**
         * Passed to `getParameter` to return a length-2 array of floats giving the current depth range.
         */
        DEPTH_RANGE = 2928,
        /**
         * Passed to `getParameter` to determine if the depth write mask is enabled.
         */
        DEPTH_WRITEMASK = 2930,
        /**
         * Passed to `getParameter` to determine the current depth clear value.
         */
        DEPTH_CLEAR_VALUE = 2931,
        /**
         * Passed to `getParameter` to get the current depth function. Returns `NEVER`, `ALWAYS`, `LESS`, `EQUAL`, `LEQUAL`, `GREATER`, `GEQUAL`, or `NOTEQUAL`.
         */
        DEPTH_FUNC = 2932,
        /**
         * Passed to `getParameter` to get the value the stencil will be cleared to.
         */
        STENCIL_CLEAR_VALUE = 2961,
        /**
         * Passed to `getParameter` to get the current stencil function. Returns `NEVER`, `ALWAYS`, `LESS`, `EQUAL`, `LEQUAL`, `GREATER`, `GEQUAL`, or `NOTEQUAL`.
         */
        STENCIL_FUNC = 2962,
        /**
         * Passed to `getParameter` to get the current stencil fail function. Should return `KEEP`, `REPLACE`, `INCR`, `DECR`, `INVERT`, `INCR_WRAP`, or `DECR_WRAP`.
         */
        STENCIL_FAIL = 2964,
        /**
         * Passed to `getParameter` to get the current stencil fail function should the depth buffer test fail. Should return `KEEP`, `REPLACE`, `INCR`, `DECR`, `INVERT`, `INCR_WRAP`, or `DECR_WRAP`.
         */
        STENCIL_PASS_DEPTH_FAIL = 2965,
        /**
         * Passed to `getParameter` to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
         */
        STENCIL_PASS_DEPTH_PASS = 2966,
        /**
         * Passed to `getParameter` to get the reference value used for stencil tests.
         */
        STENCIL_REF = 2967,
        /**
         *
         */
        STENCIL_VALUE_MASK = 2963,
        /**
         *
         */
        STENCIL_WRITEMASK = 2968,
        /**
         *
         */
        STENCIL_BACK_FUNC = 34816,
        /**
         *
         */
        STENCIL_BACK_FAIL = 34817,
        /**
         *
         */
        STENCIL_BACK_PASS_DEPTH_FAIL = 34818,
        /**
         *
         */
        STENCIL_BACK_PASS_DEPTH_PASS = 34819,
        /**
         *
         */
        STENCIL_BACK_REF = 36003,
        /**
         *
         */
        STENCIL_BACK_VALUE_MASK = 36004,
        /**
         *
         */
        STENCIL_BACK_WRITEMASK = 36005,
        /**
         * Returns an <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array" title="The Int32Array typed array represents an array of twos-complement 32-bit signed integers in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).">`Int32Array`</a> with four elements for the current viewport dimensions.
         */
        VIEWPORT = 2978,
        /**
         * Returns an <a href="/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array" title="The Int32Array typed array represents an array of twos-complement 32-bit signed integers in the platform byte order. If control over byte order is needed, use DataView instead. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax (that is, using bracket notation).">`Int32Array`</a> with four elements for the current scissor box dimensions.
         */
        SCISSOR_BOX = 3088,
        /**
         *
         */
        COLOR_CLEAR_VALUE = 3106,
        /**
         *
         */
        COLOR_WRITEMASK = 3107,
        /**
         *
         */
        UNPACK_ALIGNMENT = 3317,
        /**
         *
         */
        PACK_ALIGNMENT = 3333,
        /**
         *
         */
        MAX_TEXTURE_SIZE = 3379,
        /**
         *
         */
        MAX_VIEWPORT_DIMS = 3386,
        /**
         *
         */
        SUBPIXEL_BITS = 3408,
        /**
         *
         */
        RED_BITS = 3410,
        /**
         *
         */
        GREEN_BITS = 3411,
        /**
         *
         */
        BLUE_BITS = 3412,
        /**
         *
         */
        ALPHA_BITS = 3413,
        /**
         *
         */
        DEPTH_BITS = 3414,
        /**
         *
         */
        STENCIL_BITS = 3415,
        /**
         *
         */
        POLYGON_OFFSET_UNITS = 10752,
        /**
         *
         */
        POLYGON_OFFSET_FACTOR = 32824,
        /**
         *
         */
        TEXTURE_BINDING_2D = 32873,
        /**
         *
         */
        SAMPLE_BUFFERS = 32936,
        /**
         *
         */
        SAMPLES = 32937,
        /**
         *
         */
        SAMPLE_COVERAGE_VALUE = 32938,
        /**
         *
         */
        SAMPLE_COVERAGE_INVERT = 32939,
        /**
         *
         */
        COMPRESSED_TEXTURE_FORMATS = 34467,
        /**
         *
         */
        VENDOR = 7936,
        /**
         *
         */
        RENDERER = 7937,
        /**
         *
         */
        VERSION = 7938,
        /**
         *
         */
        IMPLEMENTATION_COLOR_READ_TYPE = 35738,
        /**
         *
         */
        IMPLEMENTATION_COLOR_READ_FORMAT = 35739,
        /**
         *
         */
        BROWSER_DEFAULT_WEBGL = 37444,
        /**
         * Passed to `bufferData` as a hint about whether the contents of the buffer are likely to be used often and not change often.
         */
        STATIC_DRAW = 35044,
        /**
         * Passed to `bufferData` as a hint about whether the contents of the buffer are likely to not be used often.
         */
        STREAM_DRAW = 35040,
        /**
         * Passed to `bufferData` as a hint about whether the contents of the buffer are likely to be used often and change often.
         */
        DYNAMIC_DRAW = 35048,
        /**
         * Passed to `bindBuffer` or `bufferData` to specify the type of buffer being used.
         */
        ARRAY_BUFFER = 34962,
        /**
         * Passed to `bindBuffer` or `bufferData` to specify the type of buffer being used.
         */
        ELEMENT_ARRAY_BUFFER = 34963,
        /**
         * Passed to `getBufferParameter` to get a buffer's size.
         */
        BUFFER_SIZE = 34660,
        /**
         * Passed to`getBufferParameter` to get the hint for the buffer passed in when it was created.
         */
        BUFFER_USAGE = 34661,
        /**
         * Passed to `getVertexAttrib` to read back the current vertex attribute.
         */
        CURRENT_VERTEX_ATTRIB = 34342,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_ENABLED = 34338,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_SIZE = 34339,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_STRIDE = 34340,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_TYPE = 34341,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_POINTER = 34373,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975,
        /**
         * Passed to `enable`/`disable` to turn on/off culling. Can also be used with `getParameter` to find the current culling method.
         */
        CULL_FACE = 2884,
        /**
         * Passed to `cullFace` to specify that only front faces should be drawn.
         */
        FRONT = 1028,
        /**
         * Passed to `cullFace` to specify that only back faces should be drawn.
         */
        BACK = 1029,
        /**
         * Passed to`cullFace` to specify that front and back faces should be drawn.
         */
        FRONT_AND_BACK = 1032,
        /**
         * Passed to `enable`/`disable` to turn on/off blending. Can also be used with `getParameter` to find the current blending method.
         */
        BLEND = 3042,
        /**
         * Passed to `enable`/`disable` to turn on/off the depth test. Can also be used with `getParameter` to query the depth test.
         */
        DEPTH_TEST = 2929,
        /**
         * Passed to `enable`/`disable` to turn on/off dithering. Can also be used with `getParameter` to find the current dithering method.
         */
        DITHER = 3024,
        /**
         * Passed to `enable`/`disable` to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with `getParameter` to query the scissor test.
         */
        POLYGON_OFFSET_FILL = 32823,
        /**
         * Passed to `enable`/`disable` to turn on/off the alpha to coverage. Used in multi-sampling alpha channels.
         */
        SAMPLE_ALPHA_TO_COVERAGE = 32926,
        /**
         * Passed to `enable`/`disable` to turn on/off the sample coverage. Used in multi-sampling.
         */
        SAMPLE_COVERAGE = 32928,
        /**
         * Passed to `enable`/`disable` to turn on/off the scissor test. Can also be used with `getParameter` to query the scissor test.
         */
        SCISSOR_TEST = 3089,
        /**
         * Passed to `enable`/`disable` to turn on/off the stencil test. Can also be used with `getParameter` to query the stencil test.
         */
        STENCIL_TEST = 2960,
        /**
         * Returned from `getError`.
         */
        NO_ERROR = 0,
        /**
         * Returned from `getError`.
         */
        INVALID_ENUM = 1280,
        /**
         * Returned from `getError`.
         */
        INVALID_VALUE = 1281,
        /**
         * Returned from `getError`.
         */
        INVALID_OPERATION = 1282,
        /**
         * Returned from `getError`.
         */
        OUT_OF_MEMORY = 1285,
        /**
         * Returned from `getError`.
         */
        CONTEXT_LOST_WEBGL = 37442,
        /**
         * Passed to `frontFace` to specify the front face of a polygon is drawn in the clockwise direction
         */
        CW = 2304,
        /**
         * Passed to `frontFace` to specify the front face of a polygon is drawn in the counter clockwise direction
         */
        CCW = 2305,
        /**
         * There is no preference for this behavior.
         */
        DONT_CARE = 4352,
        /**
         * The most efficient behavior should be used.
         */
        FASTEST = 4353,
        /**
         * The most correct or the highest quality option should be used.
         */
        NICEST = 4354,
        /**
         * Hint for the quality of filtering when generating mipmap images with <a href="/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap" title="The WebGLRenderingContext.generateMipmap() method of the WebGL API generates a set of mipmaps for a WebGLTexture object.">`WebGLRenderingContext.generateMipmap()`</a>.
         */
        GENERATE_MIPMAP_HINT = 33170,
        /**
         *
         */
        BYTE = 5120,
        /**
         *
         */
        UNSIGNED_BYTE = 5121,
        /**
         *
         */
        SHORT = 5122,
        /**
         *
         */
        UNSIGNED_SHORT = 5123,
        /**
         *
         */
        INT = 5124,
        /**
         *
         */
        UNSIGNED_INT = 5125,
        /**
         *
         */
        FLOAT = 5126,
        /**
         *
         */
        DEPTH_COMPONENT = 6402,
        /**
         *
         */
        ALPHA = 6406,
        /**
         *
         */
        RGB = 6407,
        /**
         *
         */
        RGBA = 6408,
        /**
         *
         */
        LUMINANCE = 6409,
        /**
         *
         */
        LUMINANCE_ALPHA = 6410,
        /**
         *
         */
        UNSIGNED_SHORT_4_4_4_4 = 32819,
        /**
         *
         */
        UNSIGNED_SHORT_5_5_5_1 = 32820,
        /**
         *
         */
        UNSIGNED_SHORT_5_6_5 = 33635,
        /**
         * Passed to `createShader` to define a fragment shader.
         */
        FRAGMENT_SHADER = 35632,
        /**
         * Passed to `createShader` to define a vertex shader
         */
        VERTEX_SHADER = 35633,
        /**
         * Passed to `getShaderParamter` to get the status of the compilation. Returns false if the shader was not compiled. You can then query `getShaderInfoLog` to find the exact error
         */
        COMPILE_STATUS = 35713,
        /**
         * Passed to `getShaderParamter` to determine if a shader was deleted via `deleteShader`. Returns true if it was, false otherwise.
         */
        DELETE_STATUS = 35712,
        /**
         * Passed to `getProgramParameter` after calling `linkProgram` to determine if a program was linked correctly. Returns false if there were errors. Use `getProgramInfoLog` to find the exact error.
         */
        LINK_STATUS = 35714,
        /**
         * Passed to `getProgramParameter` after calling `validateProgram` to determine if it is valid. Returns false if errors were found.
         */
        VALIDATE_STATUS = 35715,
        /**
         * Passed to `getProgramParameter` after calling `attachShader` to determine if the shader was attached correctly. Returns false if errors occurred.
         */
        ATTACHED_SHADERS = 35717,
        /**
         * Passed to `getProgramParameter` to get the number of attributes active in a program.
         */
        ACTIVE_ATTRIBUTES = 35721,
        /**
         * Passed to `getProgramParamter` to get the number of uniforms active in a program.
         */
        ACTIVE_UNIFORMS = 35718,
        /**
         * The maximum number of entries possible in the vertex attribute list.
         */
        MAX_VERTEX_ATTRIBS = 34921,
        /**
         *
         */
        MAX_VERTEX_UNIFORM_VECTORS = 36347,
        /**
         *
         */
        MAX_VARYING_VECTORS = 36348,
        /**
         *
         */
        MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661,
        /**
         *
         */
        MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660,
        /**
         * Implementation dependent number of maximum texture units. At least 8.
         */
        MAX_TEXTURE_IMAGE_UNITS = 34930,
        /**
         *
         */
        MAX_FRAGMENT_UNIFORM_VECTORS = 36349,
        /**
         *
         */
        SHADER_TYPE = 35663,
        /**
         *
         */
        SHADING_LANGUAGE_VERSION = 35724,
        /**
         *
         */
        CURRENT_PROGRAM = 35725,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will never pass. i.e. Nothing will be drawn.
         */
        NEVER = 512,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
         */
        ALWAYS = 519,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is less than the stored value.
         */
        LESS = 513,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is equals to the stored value.
         */
        EQUAL = 514,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
         */
        LEQUAL = 515,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is greater than the stored value.
         */
        GREATER = 516,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value.
         */
        GEQUAL = 518,
        /**
         * Passed to `depthFunction` or `stencilFunction` to specify depth or stencil tests will pass if the new depth value is not equal to the stored value.
         */
        NOTEQUAL = 517,
        /**
         *
         */
        KEEP = 7680,
        /**
         *
         */
        REPLACE = 7681,
        /**
         *
         */
        INCR = 7682,
        /**
         *
         */
        DECR = 7683,
        /**
         *
         */
        INVERT = 5386,
        /**
         *
         */
        INCR_WRAP = 34055,
        /**
         *
         */
        DECR_WRAP = 34056,
        /**
         *
         */
        NEAREST = 9728,
        /**
         *
         */
        LINEAR = 9729,
        /**
         *
         */
        NEAREST_MIPMAP_NEAREST = 9984,
        /**
         *
         */
        LINEAR_MIPMAP_NEAREST = 9985,
        /**
         *
         */
        NEAREST_MIPMAP_LINEAR = 9986,
        /**
         *
         */
        LINEAR_MIPMAP_LINEAR = 9987,
        /**
         *
         */
        TEXTURE_MAG_FILTER = 10240,
        /**
         *
         */
        TEXTURE_MIN_FILTER = 10241,
        /**
         *
         */
        TEXTURE_WRAP_S = 10242,
        /**
         *
         */
        TEXTURE_WRAP_T = 10243,
        /**
         *
         */
        TEXTURE_2D = 3553,
        /**
         *
         */
        TEXTURE = 5890,
        /**
         *
         */
        TEXTURE_CUBE_MAP = 34067,
        /**
         *
         */
        TEXTURE_BINDING_CUBE_MAP = 34068,
        /**
         *
         */
        TEXTURE_CUBE_MAP_POSITIVE_X = 34069,
        /**
         *
         */
        TEXTURE_CUBE_MAP_NEGATIVE_X = 34070,
        /**
         *
         */
        TEXTURE_CUBE_MAP_POSITIVE_Y = 34071,
        /**
         *
         */
        TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072,
        /**
         *
         */
        TEXTURE_CUBE_MAP_POSITIVE_Z = 34073,
        /**
         *
         */
        TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074,
        /**
         *
         */
        MAX_CUBE_MAP_TEXTURE_SIZE = 34076,
        /**
 * A texture unit.
 */
        TEXTURE0 = 33984,
        /**
         * A texture unit.
         */
        TEXTURE1 = 33985,
        /**
         * A texture unit.
         */
        TEXTURE2 = 33986,
        /**
         * A texture unit.
         */
        TEXTURE3 = 33987,
        /**
         * A texture unit.
         */
        TEXTURE4 = 33988,
        /**
         * A texture unit.
         */
        TEXTURE5 = 33989,
        /**
         * A texture unit.
         */
        TEXTURE6 = 33990,
        /**
         * A texture unit.
         */
        TEXTURE7 = 33991,
        /**
         * A texture unit.
         */
        TEXTURE8 = 33992,
        /**
         * A texture unit.
         */
        TEXTURE9 = 33993,
        /**
         * A texture unit.
         */
        TEXTURE10 = 33994,
        /**
         * A texture unit.
         */
        TEXTURE11 = 33995,
        /**
         * A texture unit.
         */
        TEXTURE12 = 33996,
        /**
         * A texture unit.
         */
        TEXTURE13 = 33997,
        /**
         * A texture unit.
         */
        TEXTURE14 = 33998,
        /**
         * A texture unit.
         */
        TEXTURE15 = 33999,
        /**
         * A texture unit.
         */
        TEXTURE16 = 34000,
        /**
         * A texture unit.
         */
        TEXTURE17 = 34001,
        /**
         * A texture unit.
         */
        TEXTURE18 = 34002,
        /**
         * A texture unit.
         */
        TEXTURE19 = 34003,
        /**
         * A texture unit.
         */
        TEXTURE20 = 34004,
        /**
         * A texture unit.
         */
        TEXTURE21 = 34005,
        /**
         * A texture unit.
         */
        TEXTURE22 = 34006,
        /**
         * A texture unit.
         */
        TEXTURE23 = 34007,
        /**
         * A texture unit.
         */
        TEXTURE24 = 34008,
        /**
         * A texture unit.
         */
        TEXTURE25 = 34009,
        /**
         * A texture unit.
         */
        TEXTURE26 = 34010,
        /**
         * A texture unit.
         */
        TEXTURE27 = 34011,
        /**
         * A texture unit.
         */
        TEXTURE28 = 34012,
        /**
         * A texture unit.
         */
        TEXTURE29 = 34013,
        /**
         * A texture unit.
         */
        TEXTURE30 = 34014,
        /**
         * A texture unit.
         */
        TEXTURE31 = 34015,
        /**
         * The current active texture unit.
         */
        ACTIVE_TEXTURE = 34016,
        /**
         *
         */
        REPEAT = 10497,
        /**
         *
         */
        CLAMP_TO_EDGE = 33071,
        /**
         *
         */
        MIRRORED_REPEAT = 33648,
        /**
         *
         */
        FLOAT_VEC2 = 35664,
        /**
         *
         */
        FLOAT_VEC3 = 35665,
        /**
         *
         */
        FLOAT_VEC4 = 35666,
        /**
         *
         */
        INT_VEC2 = 35667,
        /**
         *
         */
        INT_VEC3 = 35668,
        /**
         *
         */
        INT_VEC4 = 35669,
        /**
         *
         */
        BOOL = 35670,
        /**
         *
         */
        BOOL_VEC2 = 35671,
        /**
         *
         */
        BOOL_VEC3 = 35672,
        /**
         *
         */
        BOOL_VEC4 = 35673,
        /**
         *
         */
        FLOAT_MAT2 = 35674,
        /**
         *
         */
        FLOAT_MAT3 = 35675,
        /**
         *
         */
        FLOAT_MAT4 = 35676,
        /**
         *
         */
        SAMPLER_2D = 35678,
        /**
         *
         */
        SAMPLER_CUBE = 35680,
        /**
         *
         */
        LOW_FLOAT = 36336,
        /**
         *
         */
        MEDIUM_FLOAT = 36337,
        /**
         *
         */
        HIGH_FLOAT = 36338,
        /**
         *
         */
        LOW_INT = 36339,
        /**
         *
         */
        MEDIUM_INT = 36340,
        /**
         *
         */
        HIGH_INT = 36341,
        /**
         *
         */
        FRAMEBUFFER = 36160,
        /**
         *
         */
        RENDERBUFFER = 36161,
        /**
         *
         */
        RGBA4 = 32854,
        /**
         *
         */
        RGB5_A1 = 32855,
        /**
         *
         */
        RGB565 = 36194,
        /**
         *
         */
        DEPTH_COMPONENT16 = 33189,
        /**
         *
         */
        STENCIL_INDEX = 6401,
        /**
         *
         */
        STENCIL_INDEX8 = 36168,
        /**
         *
         */
        DEPTH_STENCIL = 34041,
        /**
         *
         */
        RENDERBUFFER_WIDTH = 36162,
        /**
         *
         */
        RENDERBUFFER_HEIGHT = 36163,
        /**
         *
         */
        RENDERBUFFER_INTERNAL_FORMAT = 36164,
        /**
         *
         */
        RENDERBUFFER_RED_SIZE = 36176,
        /**
         *
         */
        RENDERBUFFER_GREEN_SIZE = 36177,
        /**
         *
         */
        RENDERBUFFER_BLUE_SIZE = 36178,
        /**
         *
         */
        RENDERBUFFER_ALPHA_SIZE = 36179,
        /**
         *
         */
        RENDERBUFFER_DEPTH_SIZE = 36180,
        /**
         *
         */
        RENDERBUFFER_STENCIL_SIZE = 36181,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051,
        /**
         *
         */
        COLOR_ATTACHMENT0 = 36064,
        /**
         *
         */
        DEPTH_ATTACHMENT = 36096,
        /**
         *
         */
        STENCIL_ATTACHMENT = 36128,
        /**
         *
         */
        DEPTH_STENCIL_ATTACHMENT = 33306,
        /**
         *
         */
        NONE = 0,
        /**
         *
         */
        FRAMEBUFFER_COMPLETE = 36053,
        /**
         *
         */
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054,
        /**
         *
         */
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055,
        /**
         *
         */
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057,
        /**
         *
         */
        FRAMEBUFFER_UNSUPPORTED = 36061,
        /**
         *
         */
        FRAMEBUFFER_BINDING = 36006,
        /**
         *
         */
        RENDERBUFFER_BINDING = 36007,
        /**
         *
         */
        MAX_RENDERBUFFER_SIZE = 34024,
        /**
         *
         */
        INVALID_FRAMEBUFFER_OPERATION = 1286,
        /**
         *
         */
        UNPACK_FLIP_Y_WEBGL = 37440,
        /**
         *
         */
        UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441,
        /**
         *
         */
        UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443,
        /**
         *
         */
        READ_BUFFER = 3074,
        /**
         *
         */
        UNPACK_ROW_LENGTH = 3314,
        /**
         *
         */
        UNPACK_SKIP_ROWS = 3315,
        /**
         *
         */
        UNPACK_SKIP_PIXELS = 3316,
        /**
         *
         */
        PACK_ROW_LENGTH = 3330,
        /**
         *
         */
        PACK_SKIP_ROWS = 3331,
        /**
         *
         */
        PACK_SKIP_PIXELS = 3332,
        /**
         *
         */
        TEXTURE_BINDING_3D = 32874,
        /**
         *
         */
        UNPACK_SKIP_IMAGES = 32877,
        /**
         *
         */
        UNPACK_IMAGE_HEIGHT = 32878,
        /**
         *
         */
        MAX_3D_TEXTURE_SIZE = 32883,
        /**
         *
         */
        MAX_ELEMENTS_VERTICES = 33000,
        /**
         *
         */
        MAX_ELEMENTS_INDICES = 33001,
        /**
         *
         */
        MAX_TEXTURE_LOD_BIAS = 34045,
        /**
         *
         */
        MAX_FRAGMENT_UNIFORM_COMPONENTS = 35657,
        /**
         *
         */
        MAX_VERTEX_UNIFORM_COMPONENTS = 35658,
        /**
         *
         */
        MAX_ARRAY_TEXTURE_LAYERS = 35071,
        /**
         *
         */
        MIN_PROGRAM_TEXEL_OFFSET = 35076,
        /**
         *
         */
        MAX_PROGRAM_TEXEL_OFFSET = 35077,
        /**
         *
         */
        MAX_VARYING_COMPONENTS = 35659,
        /**
         *
         */
        FRAGMENT_SHADER_DERIVATIVE_HINT = 35723,
        /**
         *
         */
        RASTERIZER_DISCARD = 35977,
        /**
         *
         */
        VERTEX_ARRAY_BINDING = 34229,
        /**
         *
         */
        MAX_VERTEX_OUTPUT_COMPONENTS = 37154,
        /**
         *
         */
        MAX_FRAGMENT_INPUT_COMPONENTS = 37157,
        /**
         *
         */
        MAX_SERVER_WAIT_TIMEOUT = 37137,
        /**
         *
         */
        MAX_ELEMENT_INDEX = 36203,
        /**
         *
         */
        RED = 6403,
        /**
         *
         */
        RGB8 = 32849,
        /**
         *
         */
        RGBA8 = 32856,
        /**
         *
         */
        RGB10_A2 = 32857,
        /**
         *
         */
        TEXTURE_3D = 32879,
        /**
         *
         */
        TEXTURE_WRAP_R = 32882,
        /**
         *
         */
        TEXTURE_MIN_LOD = 33082,
        /**
         *
         */
        TEXTURE_MAX_LOD = 33083,
        /**
         *
         */
        TEXTURE_BASE_LEVEL = 33084,
        /**
         *
         */
        TEXTURE_MAX_LEVEL = 33085,
        /**
         *
         */
        TEXTURE_COMPARE_MODE = 34892,
        /**
         *
         */
        TEXTURE_COMPARE_FUNC = 34893,
        /**
         *
         */
        SRGB = 35904,
        /**
         *
         */
        SRGB8 = 35905,
        /**
         *
         */
        SRGB8_ALPHA8 = 35907,
        /**
         *
         */
        COMPARE_REF_TO_TEXTURE = 34894,
        /**
         *
         */
        RGBA32F = 34836,
        /**
         *
         */
        RGB32F = 34837,
        /**
         *
         */
        RGBA16F = 34842,
        /**
         *
         */
        RGB16F = 34843,
        /**
         *
         */
        TEXTURE_2D_ARRAY = 35866,
        /**
         *
         */
        TEXTURE_BINDING_2D_ARRAY = 35869,
        /**
         *
         */
        R11F_G11F_B10F = 35898,
        /**
         *
         */
        RGB9_E5 = 35901,
        /**
         *
         */
        RGBA32UI = 36208,
        /**
         *
         */
        RGB32UI = 36209,
        /**
         *
         */
        RGBA16UI = 36214,
        /**
         *
         */
        RGB16UI = 36215,
        /**
         *
         */
        RGBA8UI = 36220,
        /**
         *
         */
        RGB8UI = 36221,
        /**
         *
         */
        RGBA32I = 36226,
        /**
         *
         */
        RGB32I = 36227,
        /**
         *
         */
        RGBA16I = 36232,
        /**
         *
         */
        RGB16I = 36233,
        /**
         *
         */
        RGBA8I = 36238,
        /**
         *
         */
        RGB8I = 36239,
        /**
         *
         */
        RED_INTEGER = 36244,
        /**
         *
         */
        RGB_INTEGER = 36248,
        /**
         *
         */
        RGBA_INTEGER = 36249,
        /**
         *
         */
        R8 = 33321,
        /**
         *
         */
        RG8 = 33323,
        /**
         *
         */
        RGB10_A2UI = 36975,
        /**
         *
         */
        TEXTURE_IMMUTABLE_FORMAT = 37167,
        /**
         *
         */
        TEXTURE_IMMUTABLE_LEVELS = 33503,
        /**
         *
         */
        UNSIGNED_INT_2_10_10_10_REV = 33640,
        /**
         *
         */
        UNSIGNED_INT_10F_11F_11F_REV = 35899,
        /**
         *
         */
        UNSIGNED_INT_5_9_9_9_REV = 35902,
        /**
         *
         */
        FLOAT_32_UNSIGNED_INT_24_8_REV = 36269,
        /**
         *
         */
        HALF_FLOAT = 5131,
        /**
         *
         */
        RG = 33319,
        /**
         *
         */
        RG_INTEGER = 33320,
        /**
         *
         */
        INT_2_10_10_10_REV = 36255,
        /**
         *
         */
        CURRENT_QUERY = 34917,
        /**
         *
         */
        QUERY_RESULT = 34918,
        /**
         *
         */
        QUERY_RESULT_AVAILABLE = 34919,
        /**
         *
         */
        ANY_SAMPLES_PASSED = 35887,
        /**
         *
         */
        ANY_SAMPLES_PASSED_CONSERVATIVE = 36202,
        /**
         *
         */
        MAX_DRAW_BUFFERS = 34852,
        /**
         *
         */
        DRAW_BUFFER0 = 34853,
        /**
         *
         */
        DRAW_BUFFER1 = 34854,
        /**
         *
         */
        DRAW_BUFFER2 = 34855,
        /**
         *
         */
        DRAW_BUFFER3 = 34856,
        /**
         *
         */
        DRAW_BUFFER4 = 34857,
        /**
         *
         */
        DRAW_BUFFER5 = 34858,
        /**
         *
         */
        DRAW_BUFFER6 = 34859,
        /**
         *
         */
        DRAW_BUFFER7 = 34860,
        /**
         *
         */
        DRAW_BUFFER8 = 34861,
        /**
         *
         */
        DRAW_BUFFER9 = 34862,
        /**
         *
         */
        DRAW_BUFFER10 = 34863,
        /**
         *
         */
        DRAW_BUFFER11 = 34864,
        /**
         *
         */
        DRAW_BUFFER12 = 34865,
        /**
         *
         */
        DRAW_BUFFER13 = 34866,
        /**
         *
         */
        DRAW_BUFFER14 = 34867,
        /**
         *
         */
        DRAW_BUFFER15 = 34868,
        /**
         *
         */
        MAX_COLOR_ATTACHMENTS = 36063,
        /**
         *
         */
        COLOR_ATTACHMENT1 = 36065,
        /**
         *
         */
        COLOR_ATTACHMENT2 = 36066,
        /**
         *
         */
        COLOR_ATTACHMENT3 = 36067,
        /**
         *
         */
        COLOR_ATTACHMENT4 = 36068,
        /**
         *
         */
        COLOR_ATTACHMENT5 = 36069,
        /**
         *
         */
        COLOR_ATTACHMENT6 = 36070,
        /**
         *
         */
        COLOR_ATTACHMENT7 = 36071,
        /**
         *
         */
        COLOR_ATTACHMENT8 = 36072,
        /**
         *
         */
        COLOR_ATTACHMENT9 = 36073,
        /**
         *
         */
        COLOR_ATTACHMENT10 = 36074,
        /**
         *
         */
        COLOR_ATTACHMENT11 = 36075,
        /**
         *
         */
        COLOR_ATTACHMENT12 = 36076,
        /**
         *
         */
        COLOR_ATTACHMENT13 = 36077,
        /**
         *
         */
        COLOR_ATTACHMENT14 = 36078,
        /**
         *
         */
        COLOR_ATTACHMENT15 = 36079,
        /**
         *
         */
        SAMPLER_3D = 35679,
        /**
         *
         */
        SAMPLER_2D_SHADOW = 35682,
        /**
         *
         */
        SAMPLER_2D_ARRAY = 36289,
        /**
         *
         */
        SAMPLER_2D_ARRAY_SHADOW = 36292,
        /**
         *
         */
        SAMPLER_CUBE_SHADOW = 36293,
        /**
         *
         */
        INT_SAMPLER_2D = 36298,
        /**
         *
         */
        INT_SAMPLER_3D = 36299,
        /**
         *
         */
        INT_SAMPLER_CUBE = 36300,
        /**
         *
         */
        INT_SAMPLER_2D_ARRAY = 36303,
        /**
         *
         */
        UNSIGNED_INT_SAMPLER_2D = 36306,
        /**
         *
         */
        UNSIGNED_INT_SAMPLER_3D = 36307,
        /**
         *
         */
        UNSIGNED_INT_SAMPLER_CUBE = 36308,
        /**
         *
         */
        UNSIGNED_INT_SAMPLER_2D_ARRAY = 36311,
        /**
         *
         */
        MAX_SAMPLES = 36183,
        /**
         *
         */
        SAMPLER_BINDING = 35097,
        /**
         *
         */
        PIXEL_PACK_BUFFER = 35051,
        /**
         *
         */
        PIXEL_UNPACK_BUFFER = 35052,
        /**
         *
         */
        PIXEL_PACK_BUFFER_BINDING = 35053,
        /**
         *
         */
        PIXEL_UNPACK_BUFFER_BINDING = 35055,
        /**
         *
         */
        COPY_READ_BUFFER = 36662,
        /**
         *
         */
        COPY_WRITE_BUFFER = 36663,
        /**
         *
         */
        COPY_READ_BUFFER_BINDING = 36662,
        /**
         *
         */
        COPY_WRITE_BUFFER_BINDING = 36663,
        /**
         *
         */
        FLOAT_MAT2x3 = 35685,
        /**
         *
         */
        FLOAT_MAT2x4 = 35686,
        /**
         *
         */
        FLOAT_MAT3x2 = 35687,
        /**
         *
         */
        FLOAT_MAT3x4 = 35688,
        /**
         *
         */
        FLOAT_MAT4x2 = 35689,
        /**
         *
         */
        FLOAT_MAT4x3 = 35690,
        /**
         *
         */
        UNSIGNED_INT_VEC2 = 36294,
        /**
         *
         */
        UNSIGNED_INT_VEC3 = 36295,
        /**
         *
         */
        UNSIGNED_INT_VEC4 = 36296,
        /**
         *
         */
        UNSIGNED_NORMALIZED = 35863,
        /**
         *
         */
        SIGNED_NORMALIZED = 36764,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_INTEGER = 35069,
        /**
         *
         */
        VERTEX_ATTRIB_ARRAY_DIVISOR = 35070,
        /**
         *
         */
        TRANSFORM_FEEDBACK_BUFFER_MODE = 35967,
        /**
         *
         */
        MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 35968,
        /**
         *
         */
        TRANSFORM_FEEDBACK_VARYINGS = 35971,
        /**
         *
         */
        TRANSFORM_FEEDBACK_BUFFER_START = 35972,
        /**
         *
         */
        TRANSFORM_FEEDBACK_BUFFER_SIZE = 35973,
        /**
         *
         */
        TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 35976,
        /**
         *
         */
        MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 35978,
        /**
         *
         */
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 35979,
        /**
         *
         */
        INTERLEAVED_ATTRIBS = 35980,
        /**
         *
         */
        SEPARATE_ATTRIBS = 35981,
        /**
         *
         */
        TRANSFORM_FEEDBACK_BUFFER = 35982,
        /**
         *
         */
        TRANSFORM_FEEDBACK_BUFFER_BINDING = 35983,
        /**
         *
         */
        TRANSFORM_FEEDBACK = 36386,
        /**
         *
         */
        TRANSFORM_FEEDBACK_PAUSED = 36387,
        /**
         *
         */
        TRANSFORM_FEEDBACK_ACTIVE = 36388,
        /**
         *
         */
        TRANSFORM_FEEDBACK_BINDING = 36389,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 33296,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 33297,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_RED_SIZE = 33298,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 33299,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 33300,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 33301,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 33302,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 33303,
        /**
         *
         */
        FRAMEBUFFER_DEFAULT = 33304,
        /**
         *
         */
        DEPTH24_STENCIL8 = 35056,
        /**
         *
         */
        DRAW_FRAMEBUFFER_BINDING = 36006,
        /**
         *
         */
        READ_FRAMEBUFFER = 36008,
        /**
         *
         */
        DRAW_FRAMEBUFFER = 36009,
        /**
         *
         */
        READ_FRAMEBUFFER_BINDING = 36010,
        /**
         *
         */
        RENDERBUFFER_SAMPLES = 36011,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 36052,
        /**
         *
         */
        FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 36182,
        /**
         *
         */
        UNIFORM_BUFFER = 35345,
        /**
         *
         */
        UNIFORM_BUFFER_BINDING = 35368,
        /**
         *
         */
        UNIFORM_BUFFER_START = 35369,
        /**
         *
         */
        UNIFORM_BUFFER_SIZE = 35370,
        /**
         *
         */
        MAX_VERTEX_UNIFORM_BLOCKS = 35371,
        /**
         *
         */
        MAX_FRAGMENT_UNIFORM_BLOCKS = 35373,
        /**
         *
         */
        MAX_COMBINED_UNIFORM_BLOCKS = 35374,
        /**
         *
         */
        MAX_UNIFORM_BUFFER_BINDINGS = 35375,
        /**
         *
         */
        MAX_UNIFORM_BLOCK_SIZE = 35376,
        /**
         *
         */
        MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 35377,
        /**
         *
         */
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 35379,
        /**
         *
         */
        UNIFORM_BUFFER_OFFSET_ALIGNMENT = 35380,
        /**
         *
         */
        ACTIVE_UNIFORM_BLOCKS = 35382,
        /**
         *
         */
        UNIFORM_TYPE = 35383,
        /**
         *
         */
        UNIFORM_SIZE = 35384,
        /**
         *
         */
        UNIFORM_BLOCK_INDEX = 35386,
        /**
         *
         */
        UNIFORM_OFFSET = 35387,
        /**
         *
         */
        UNIFORM_ARRAY_STRIDE = 35388,
        /**
         *
         */
        UNIFORM_MATRIX_STRIDE = 35389,
        /**
         *
         */
        UNIFORM_IS_ROW_MAJOR = 35390,
        /**
         *
         */
        UNIFORM_BLOCK_BINDING = 35391,
        /**
         *
         */
        UNIFORM_BLOCK_DATA_SIZE = 35392,
        /**
         *
         */
        UNIFORM_BLOCK_ACTIVE_UNIFORMS = 35394,
        /**
         *
         */
        UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 35395,
        /**
         *
         */
        UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 35396,
        /**
         *
         */
        UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 35398,
        /**
         *
         */
        OBJECT_TYPE = 37138,
        /**
         *
         */
        SYNC_CONDITION = 37139,
        /**
         *
         */
        SYNC_STATUS = 37140,
        /**
         *
         */
        SYNC_FLAGS = 37141,
        /**
         *
         */
        SYNC_FENCE = 37142,
        /**
         *
         */
        SYNC_GPU_COMMANDS_COMPLETE = 37143,
        /**
         *
         */
        UNSIGNALED = 37144,
        /**
         *
         */
        SIGNALED = 37145,
        /**
         *
         */
        ALREADY_SIGNALED = 37146,
        /**
         *
         */
        TIMEOUT_EXPIRED = 37147,
        /**
         *
         */
        CONDITION_SATISFIED = 37148,
        /**
         *
         */
        WAIT_FAILED = 37149,
        /**
         *
         */
        SYNC_FLUSH_COMMANDS_BIT = 1,
        /**
         *
         */
        COLOR = 6144,
        /**
         *
         */
        STENCIL = 6146,
        /**
         *
         */
        MIN = 32775,
        /**
         *
         */
        DEPTH_COMPONENT24 = 33190,
        /**
         *
         */
        STREAM_READ = 35041,
        /**
         *
         */
        STREAM_COPY = 35042,
        /**
         *
         */
        STATIC_READ = 35045,
        /**
         *
         */
        STATIC_COPY = 35046,
        /**
         *
         */
        DYNAMIC_READ = 35049,
        /**
         *
         */
        DYNAMIC_COPY = 35050,
        /**
         *
         */
        DEPTH_COMPONENT32F = 36012,
        /**
         *
         */
        DEPTH32F_STENCIL8 = 36013,
        /**
         *
         */
        INVALID_INDEX = 4294967295,
        /**
         *
         */
        TIMEOUT_IGNORED = -1,
        /**
         *
         */
        MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 37447,
        /**
         * Describes the frequency divisor used for instanced rendering.
         */
        VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = 35070,
        /**
         * Passed to `getParameter` to get the vendor string of the graphics driver.
         */
        UNMASKED_VENDOR_WEBGL = 37445,
        /**
         * Passed to `getParameter` to get the renderer string of the graphics driver.
         */
        UNMASKED_RENDERER_WEBGL = 37446,
        /**
         * Returns the maximum available anisotropy.
         */
        MAX_TEXTURE_MAX_ANISOTROPY_EXT = 34047,
        /**
         * Passed to `texParameter` to set the desired maximum anisotropy for a texture.
         */
        TEXTURE_MAX_ANISOTROPY_EXT = 34046,
        /**
         * A DXT1-compressed image in an RGB image format.
         */
        COMPRESSED_RGB_S3TC_DXT1_EXT = 33776,
        /**
         * A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
         */
        COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777,
        /**
         * A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
         */
        COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778,
        /**
         * A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.
         */
        COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779,
        /**
         * One-channel (red) unsigned format compression.
         */
        COMPRESSED_R11_EAC = 37488,
        /**
         * One-channel (red) signed format compression.
         */
        COMPRESSED_SIGNED_R11_EAC = 37489,
        /**
         * Two-channel (red and green) unsigned format compression.
         */
        COMPRESSED_RG11_EAC = 37490,
        /**
         * Two-channel (red and green) signed format compression.
         */
        COMPRESSED_SIGNED_RG11_EAC = 37491,
        /**
         * Compresses RBG8 data with no alpha channel.
         */
        COMPRESSED_RGB8_ETC2 = 37492,
        /**
         * Compresses RGBA8 data. The RGB part is encoded the same as `RGB_ETC2`, but the alpha part is encoded separately.
         */
        COMPRESSED_RGBA8_ETC2_EAC = 37493,
        /**
         * Compresses sRBG8 data with no alpha channel.
         */
        COMPRESSED_SRGB8_ETC2 = 37494,
        /**
         * Compresses sRGBA8 data. The sRGB part is encoded the same as `SRGB_ETC2`, but the alpha part is encoded separately.
         */
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37495,
        /**
         * Similar to `RGB8_ETC`, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
         */
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37496,
        /**
         * Similar to `SRGB8_ETC`, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
         */
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37497,
        /**
         * RGB compression in 4-bit mode. One block for each 4×4 pixels.
         */
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840,
        /**
         * RGBA compression in 4-bit mode. One block for each 4×4 pixels.
         */
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842,
        /**
         * RGB compression in 2-bit mode. One block for each 8×4 pixels.
         */
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841,
        /**
         * RGBA compression in 2-bit mode. One block for each 8×4 pixe
         */
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843,
        /**
         * Compresses 24-bit RGB data with no alpha channel.
         */
        COMPRESSED_RGB_ETC1_WEBGL = 36196,
        /**
         * Compresses RGB textures with no alpha channel.
         */
        COMPRESSED_RGB_ATC_WEBGL = 35986,
        /**
         * Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp).
         */
        COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986,
        /**
         * Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient).
         */
        COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798,
        /**
         * Unsigned integer type for 24-bit depth texture data.
         */
        UNSIGNED_INT_24_8_WEBGL = 34042,
        /**
         * Half floating-point type (16-bit).
         */
        HALF_FLOAT_OES = 36193,
        /**
         * RGBA 32-bit floating-pointcolor-renderable format.
         */
        RGBA32F_EXT = 34836,
        /**
         * RGB 32-bit floating-pointcolor-renderable format.
         */
        RGB32F_EXT = 34837,
        /**
         *
         */
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 33297,
        /**
         *
         */
        UNSIGNED_NORMALIZED_EXT = 35863,
        /**
         * Produces the minimum color components of the source and destination colors.
         */
        MIN_EXT = 32775,
        /**
         * Produces the maximum color components of the source and destination colors.
         */
        MAX_EXT = 32776,
        /**
         * Unsized sRGB format that leaves the precision up to the driver.
         */
        SRGB_EXT = 35904,
        /**
         * Unsized sRGB format with unsized alpha component.
         */
        SRGB_ALPHA_EXT = 35906,
        /**
         * Sized (8-bit) sRGB and alpha formats.
         */
        SRGB8_ALPHA8_EXT = 35907,
        /**
         * Returns the framebuffer color encoding.
         */
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 33296,
        /**
         * Indicates the accuracy of the derivative calculation for the GLSL built-in functions: `dFdx`, `dFdy`, and `fwidth`.
         */
        FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 35723,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT0_WEBGL = 36064,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT1_WEBGL = 36065,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT2_WEBGL = 36066,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT3_WEBGL = 36067,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT4_WEBGL = 36068,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT5_WEBGL = 36069,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT6_WEBGL = 36070,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT7_WEBGL = 36071,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT8_WEBGL = 36072,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT9_WEBGL = 36073,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT10_WEBGL = 36074,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT11_WEBGL = 36075,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT12_WEBGL = 36076,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT13_WEBGL = 36077,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT14_WEBGL = 36078,
        /**
         * Framebuffer color attachment point
         */
        COLOR_ATTACHMENT15_WEBGL = 36079,
        /**
         * Draw buffer
         */
        DRAW_BUFFER0_WEBGL = 34853,
        /**
         * Draw buffer
         */
        DRAW_BUFFER1_WEBGL = 34854,
        /**
         * Draw buffer
         */
        DRAW_BUFFER2_WEBGL = 34855,
        /**
         * Draw buffer
         */
        DRAW_BUFFER3_WEBGL = 34856,
        /**
         * Draw buffer
         */
        DRAW_BUFFER4_WEBGL = 34857,
        /**
         * Draw buffer
         */
        DRAW_BUFFER5_WEBGL = 34858,
        /**
         * Draw buffer
         */
        DRAW_BUFFER6_WEBGL = 34859,
        /**
         * Draw buffer
         */
        DRAW_BUFFER7_WEBGL = 34860,
        /**
         * Draw buffer
         */
        DRAW_BUFFER8_WEBGL = 34861,
        /**
         * Draw buffer
         */
        DRAW_BUFFER9_WEBGL = 34862,
        /**
         * Draw buffer
         */
        DRAW_BUFFER10_WEBGL = 34863,
        /**
         * Draw buffer
         */
        DRAW_BUFFER11_WEBGL = 34864,
        /**
         * Draw buffer
         */
        DRAW_BUFFER12_WEBGL = 34865,
        /**
         * Draw buffer
         */
        DRAW_BUFFER13_WEBGL = 34866,
        /**
         * Draw buffer
         */
        DRAW_BUFFER14_WEBGL = 34867,
        /**
         * Draw buffer
         */
        DRAW_BUFFER15_WEBGL = 34868,
        /**
         * Maximum number of framebuffer color attachment points
         */
        MAX_COLOR_ATTACHMENTS_WEBGL = 36063,
        /**
         * Maximum number of draw buffers
         */
        MAX_DRAW_BUFFERS_WEBGL = 34852,
        /**
         * The bound vertex array object (VAO).
         */
        VERTEX_ARRAY_BINDING_OES = 34229,
        /**
         * The number of bits used to hold the query result for the given target.
         */
        QUERY_COUNTER_BITS_EXT = 34916,
        /**
         * The currently active query.
         */
        CURRENT_QUERY_EXT = 34917,
        /**
         * The query result.
         */
        QUERY_RESULT_EXT = 34918,
        /**
         * A Boolean indicating whether or not a query result is available.
         */
        QUERY_RESULT_AVAILABLE_EXT = 34919,
        /**
         * Elapsed time (in nanoseconds).
         */
        TIME_ELAPSED_EXT = 35007,
        /**
         * The current time.
         */
        TIMESTAMP_EXT = 36392,
        /**
         * A Boolean indicating whether or not the GPU performed any disjoint operation.
         */
        GPU_DISJOINT_EXT = 36795
    }
}
declare namespace jy {
    export interface Path {
        /**
         * 路径
         *
         * @type {string}
         * @memberOf Path
         */
        path: string;
        /**
         * 处理后的路径
         *
         * @type {string}
         * @memberOf Path
         */
        tPath: string;
        /**
         * 是否忽略前缀
         *
         * @type {boolean}
         * @memberOf Path
         */
        iPrefix?: boolean;
        /**
         * 父路径的标识
         *
         * @type {string}
         * @memberOf Path
         */
        parent?: string;
    }
    export interface JConfig {
        /**
         * 替换用参数
         */
        replacer?: {
            [replacer: string]: string;
        };
        /**
         * 参数字典
         * key      {string}    标识
         * value    {any}       对应数据
         *
         * @type {{}}
         * @memberOf JConfig
         */
        params?: {};
        /**
         * 前缀字典
         *
         * @type {string[]}
         * @memberOf JConfig
         */
        prefixes: string[];
        /**
         * 路径信息的字典
         */
        paths: PathMap;
        preload?: Res.ResItem[];
    }
    /**
     * 路径信息
     */
    interface PathMap {
        res: Path;
        skin: Path;
        [indes: string]: Path;
    }
    /**
     * 获取皮肤路径
     *
     * @param {string} key
     * @param {string} fileName
     * @returns
     */
    function getSkinPath(key: string, fileName: string): string;
    /**
     * 获取资源版本号
     * @param uri
     */
    function getResVer(uri: string): number;
    /**
     * 配置工具
     * @author 3tion
     * @export
     * @class ConfigUtils
     */
    export const ConfigUtils: {
        replace(data: JConfig): JConfig;
        setData(data: JConfig): void;
        /**
         * 解析版本控制文件
         * @param {ArrayBufferLike} hash
         */
        parseHash(hash: ArrayBuffer): void;
        /**
         * 设置版本控制文件
         * @param hash
         */
        setHash(hash: {
            [index: string]: number;
        }): void;
        getResVer: typeof getResVer;
        /**
         * 获取资源完整路径
         *
         * @static
         * @param {string} uri                  路径标识
         * @returns {string}
         */
        getResUrl(uri: string): string;
        /**
         * 获取参数
         */
        getParam(key: string): any;
        getSkinPath: typeof getSkinPath;
        /**
         * 获取皮肤文件地址
         */
        getSkinFile(key: string, fileName: string): string;
        /**
         * 设置皮肤路径
         * 如 `lib` 原本应该放在当前项目  resource/skin/ 目录下
         * 现在要将`lib`的指向改到  a/ 目录下
         * 则使用下列代码
         * ```typescript
         * ConfigUtils.regSkinPath("lib","a/");
         * ```
         * 如果要将`lib`的指向改到 http://www.xxx.com/a/下
         * 则使用下列代码
         * ```typescript
         * ConfigUtils.regSkinPath("lib","http://www.xxx.com/a/",true);
         * ```
         * 如果域名不同，`自行做好跨域策略CROS`
         *
         * @param {string} key
         * @param {string} path
         * @param {boolean} [iPrefix] 是否忽略皮肤前缀
         */
        regSkinPath(key: string, path: string, iPrefix?: boolean): void;
        /**
         * 获取路径
         *
         * @param {string} uri
         * @param {string} pathKey
         * @returns
         */
        getUrl(uri: string, pathKey: string): string;
    };
    export {};
}
/**
 * DataLocator的主数据
 * 原 junyou.DataLocator.data  的全局别名简写
 */
declare const $DD: jy.CfgData;
/**
 * DataLocator的附加数据
 * 原 junyou.DataLocator.extra 的全局别名简写
 */
declare const $DE: jy.ExtraData;
declare namespace jy {
    /**
     * 表单最终被解析成的类型
     *
     * @export
     * @enum {number}
     */
    export const enum CfgDataType {
        /**
         * 自动解析
         */
        Auto = 0,
        /**
         * 按ArraySet解析
         */
        ArraySet = 1,
        /**
         * 按数组解析
         */
        Array = 2,
        /**
         * 按字典解析
         */
        Dictionary = 3
    }
    /**
     * 配置加载器<br/>
     * 用于预加载数据的解析
     * @author 3tion
     *
     */
    export let DataLocator: {
        regParser: typeof regParser;
        /**
         * 解析打包的配置
         */
        parsePakedDatas(type?: number): void;
        /**
         *
         * 注册通过H5ExcelTool导出的数据并且有唯一标识的使用此方法注册
         * @param {keyof CfgData} key 数据的标识
         * @param {(Creator<any> | 0)} CfgCreator 配置的类名
         * @param {(string | 0)} [idkey="id"] 唯一标识 0用于标识数组
         * @param {CfgDataType} [type]
         */
        regCommonParser: typeof regCommonParser;
        regBytesParser: typeof regBytesParser;
    };
    /**
     *
     * 注册通过H5ExcelTool导出的数据并且有唯一标识的使用此方法注册
     * @param {keyof CfgData} key 数据的标识
     * @param {(Creator<any> | 0)} CfgCreator 配置的类名
     * @param {(string | 0)} [idkey="id"] 唯一标识 0用于标识数组
     * @param {CfgDataType} [type]
     */
    function regCommonParser(key: keyof CfgData, CfgCreator: Creator<any> | 0, idkey?: string | 0, type?: CfgDataType): void;
    /**
     * 注册配置解析
     * @param key       配置的标识
     * @param parser    解析器
     */
    function regParser(key: keyof CfgData, parser: ConfigDataParser): void;
    /**
     * 配置数据解析函数
     */
    export interface ConfigDataParser {
        (data: any): any;
    }
    /**
     * 附加数据
     *
     * @interface ExtraData
     */
    export interface ExtraData {
    }
    /**
     * 配置数据
     *
     * @export
     * @interface CfgData
     */
    export interface CfgData {
    }
    /**
     * 通用的Bytes版本的配置解析器
     * @param buffer
     */
    function regBytesParser(key: keyof CfgData, CfgCreator: Creator<any> | 0, idkey?: string | 0, type?: CfgDataType): void;
    export {};
}
declare namespace jy {
    interface DataUtilsType {
        /**
         * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到
         * 配置VO为：
         * ```typescript
         * class Cfg {
         * 		type:int;
         * 		datas:any[];
         * }
         * ```
         * 上面示例中
         * typeKey 为 `type`
         * dataKey 为 `data`
         * checkStart 为 `1`
         * checkEnd 为 `4`
         * toDatasKey 为 `data`
         * to的type  `datas数组中`
         * @param {object} to 要写入的配置
         * @param {object} from 配置的数据源
         * @param {number} checkStart 数据源起始值	data **`1`**
         * @param {number} checkEnd 数据源结束值	data **`4`**
         * @param {string} dataKey 数据源数值的前缀	**`data`**
          * @param {string} toDatasKey  配置的数值存储的数据的数组属性名，上例为 **`datas`**
         * @memberof DataUtilsType
         */
        parseDatas(to: object, from: object, checkStart: number, checkEnd: number, dataKey: string, toDatasKey: string): void;
        /**
         * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到
         * 配置VO为：
         * ```typescript
         * class Cfg {
         * 		type:int;
         * 		datas:any[];
         * }
         * ```
         * 上面示例中
         * typeKey 为 `type`
         * dataKey 为 `data`
         * checkStart 为 `1`
         * checkEnd 为 `4`
         * toDatasKey 为 `data`
         * to的type  `datas数组中`
         * @param {*} to                要写入的配置
         * @param {any[]} valueList     配置的数据源的值列表
         * @param {string[]} keyList    配置数据的属性key列表
         * @param {number} checkStart 数据源起始值	data **`1`**
         * @param {number} checkEnd 数据源结束值	data **`4`**
         * @param {string} dataKey 数据源数值的前缀	**`data`**
         * @param {string} toDatasKey  配置的数值存储的数据的数组属性名，上例为 **`datas`**
         * @memberof DataUtilsType
         */
        parseDatas2(to: any, valueList: any[], keyList: string[], checkStart: number, checkEnd: number, dataKey: string, toDatasKey: string): any;
        /**
         * 从数据集中获取key-value的数据
         *
         * @param {any[]} valueList 数据集合
         * @param {string[]} keyList 属性列表
         * @param {Object} [o]
         * @returns {*}
         * @memberof DataUtilsType
         */
        getData(valueList: any[], keyList: string[], o?: Object): any;
        /**
         * 从数据集中获取key-value的数据 的数组
         *
         * @param {any[][]} dataList 数据集合
         * @param {string[]} keyList 属性列表
         * @returns {any[]}
         * @memberof DataUtilsType
         */
        getDataList(dataList: any[][], keyList: string[]): any[];
        /**
         * 处理数据
         *
         * @param {any[][]} dataList 数据集合
         * @param {string[]} keyList 属性列表
         * @param {(t: Object, args: any[], idx?: number) => any} forEach 处理器
         * @param {*} thisObj
         * @param {...any[]} args 附加参数
         * @memberof DataUtilsType
         */
        parseDataList(dataList: any[][], keyList: string[], forEach: (t: Object, args: any[], idx?: number) => any, thisObj: any, ...args: any[]): any;
        /**
         * 将`valueList` 按 `keyList`向 `to` 拷贝数据
         *
         * @template T
         * @param {T} to 目标对象
         * @param {any[]} valueList 数据集
         * @param {(keyof T)[]} keyList 属性列表
         * @memberof DataUtilsType
         */
        copyData<T>(to: T, valueList: any[], keyList: (keyof T)[]): any;
        /**
         * 拷贝一组数据
         *
         * @template T
         * @param {Creator<T>} creator
         * @param {any[][]} dataList
         * @param {(keyof T)[]} keyList
         * @param {(t: T, args: any[], idx?: number) => any} forEach
         * @param {*} thisObj
         * @param {...any[]} args
         * @memberof DataUtilsType
         */
        copyDataList<T>(creator: Creator<T>, dataList: any[][], keyList: (keyof T)[], forEach: (t: T, args: any[], idx?: number) => any, thisObj: any, ...args: any[]): any;
        /**
         * 获取一组坐标
         *
         * @param {any[][]} data
         * @param {Point[]} out
         * @memberof DataUtilsType
         */
        getZuobiaos(data: any[][], out: Point[]): any;
        /**
         * 根据 [x,y] 这样的数组，获取点Point
         *
         * @param {number[]} data
         * @memberof DataUtilsType
         */
        getZuobiao(data: number[]): Point;
        /**
         *
         * 解析配置为"x1""x2"....."x100"这样的属性  横向配置
         * @static
         * @param {object} from 被解析的配置数据
         * @param {object} xattr 最终会变成  xattr.x1=100  xattr.x2=123这样的数据
         * @param {boolean} [delOriginKey=true]  是否删除原始数据中的key
         * @param {RegExp} [xReg=/^x\d+$/] 测试用字段，必须经过 test成功，才会进行处理
         * @returns {number} 成功解析到的key的数量
         */
        parseXAttr(from: object, xattr: object, delOriginKey?: boolean, xReg?: RegExp): number;
        /**
         *
         * 解析配置为 pro1  provalue1   pro2  provalue2 ..... pro100 provalue100  这样的纵向配置属性的配置
         * @static
         * @param {Object} from 被解析的配置数据
         * @param {Object} xattr 最终会变成  xattr.x1=100  xattr.x2=123这样的数据
         * @param {string} errPrefix
         * @param {string} [keyPrefix="pro"]
         * @param {string} [valuePrefix="provalue"]
         * @param {boolean} [delOriginKey=true] 是否删除原始数据中的key
         * @returns {number} 成功解析到的key的数量
         */
        parseXAttr2(from: object, xattr: object, keyPrefix?: string, valuePrefix?: string, delOriginKey?: boolean): number;
        /**
         * 按君游的数据格式，处理用`|`,`:`分隔的字符串
         * `|`为`1级`分隔符
         * `:`为`2级`分隔符
         * @param value
         */
        getArray2D(value: any): any[][];
        /**
         * 按君游的数据格式，处理用`|`,`:`分隔的字符串
         * @param value
         */
        getArray(value: any): any[];
        /**
         * 尝试将数据转成number类型，如果无法转换，用原始类型
         *
         * @param {*} value 数据
         * @returns
         */
        tryParseNumber(value: any): any;
    }
    /**
     *
     * @author 君游项目解析工具
     *
     */
    const DataUtils: DataUtilsType;
}
declare namespace jy {
    /**
     * 网络事件的常量集
     * @author
     * -100~ -199
     */
    const enum EventConst {
        /**
         * 登录成功
         */
        LOGIN_COMPLETE = -199,
        /**
         * 登录失败
         */
        LOGIN_FAILED = -198,
        /**
         * 连接服务器成功
         */
        Connected = -197,
        /**
         * 连接服务器失败
         */
        ConnectFailed = -196,
        /**
         * 服务器断开连接
         */
        Disconnect = -195,
        ShowReconnect = -194,
        /**
         * 纹理加载完成
         */
        Texture_Complete = -193,
        /**
         * 网络上线
         */
        Online = -192,
        /**
         * 网络断线
         */
        Offline = -191,
        /**
         * 手机从休眠状态中被唤醒
         */
        Awake = -190,
        /**
         * 频繁发送协议提示
         */
        NetServiceSendLimit = -189,
        /**
         * 解析资源版本hash的时候派发
         */
        ParseResHash = -188,
        /**
         * 资源加载失败
         * data {ResItem}
         */
        ResLoadFailed = -187,
        /**
         * 资源加载完成
         */
        ResLoadSuccess = -186,
        /**
         * 单个配置加载成功
         * data {string} 配置的Key
         */
        OneCfgComplete = -185
    }
}
declare namespace jy {
    /**
     *
     * @author 3tion
     *
     */
    const enum RequestState {
        /**
         * 未请求/未加载 0
         */
        UNREQUEST = 0,
        /**
         * 请求中/加载中，未获得值 1
         */
        REQUESTING = 1,
        /**
         * 已加载/已获取到值 2
         */
        COMPLETE = 2,
        /**
         * 加载失败 -1
         */
        FAILED = -1
    }
}
declare namespace jy {
    /**
     * 使用http进行通信的网络服务
     * @author 3tion
     *
     */
    class HttpNetService extends NetService {
        protected _loader: XMLHttpRequest;
        protected _state: RequestState;
        /**
         * 未发送的请求
         */
        protected _unsendRequest: Recyclable<NetSendData>[];
        /**
         * 正在发送的数据
         */
        protected _sendingList: Recyclable<NetSendData>[];
        /**
         * 请求发送成功的次数
         */
        protected _success: number;
        /**
         * 请求连续发送失败的次数
         */
        protected _cerror: number;
        /**
         * 请求失败次数
         */
        protected _error: number;
        constructor();
        /**
         * 重置
         * @param actionUrl             请求地址
         * @param autoTimeDelay         自动发送的最短延迟时间
         */
        setUrl(actionUrl: string, autoTimeDelay?: number): void;
        /**
        * @protected
        */
        protected onReadyStateChange(): void;
        /**
         * 发生错误
         */
        protected errorHandler(): void;
        protected complete(): void;
        /**
         * 检查在发送过程中的请求
         */
        protected checkUnsend(): void;
        protected _send(cmd: number, data: any, msgType: Key): void;
        /**
         * 发送消息之前，用于预处理一些http头信息等
         *
         * @protected
         */
        protected onBeforeSend(): void;
        /**
         * 接收到服务端Response，用于预处理一些信息
         *
         * @protected
         */
        protected onBeforeSolveData(): void;
        /**
         * 尝试发送
         */
        protected trySend(): void;
    }
}
declare namespace jy {
    /**
     * 用于发送的网络数据<br/>
     * @author 3tion
     */
    class NetSendData implements IRecyclable {
        /**
         * 协议号
         */
        cmd: number;
        /**
         * 数据
         */
        data: any;
        /**
         *
         * protobuf message的类型
         * @type {string | number}
         */
        msgType: string | number;
        onRecycle(): void;
    }
    /**
     * 网络数据，类似AS3项目中Stream<br/>
     * @author 3tion
     *
     */
    class NetData extends NetSendData {
        /**
         *  是否停止传播
         */
        stopPropagation: Boolean;
    }
}
declare namespace jy {
    /**
     *
     * @author 3tion
     *
     */
    class NetRouter {
        /**
         * key      协议号<br/>
         * value    NetBin的数组
         */
        private _listenerMaps;
        constructor();
        /**
         * 注册一cmd侦听;
         * @param cmd      协议号
         * @param handler   处理器
         * @param priority  越大越优先
         * @param once      是否只执行一次
         * @return boolean true 做为新的兼听添加进去，false 原来就有处理器
         *
         */
        register(cmd: number, handler: INetHandler, priority?: number, once?: boolean): boolean;
        /**
         * 删除兼听处理器
         * @param cmd      协议号
         * @param handler   处理器
         * @return boolean true 删除成功  <br/>
         *                 false 没有这个兼听
         */
        remove(cmd: number, handler: INetHandler): boolean;
        private dispatchList;
        /**
        * 调用列表
        */
        dispatch(data: Recyclable<NetData>): void;
        private _dispatch;
    }
    /**
     * 协议处理函数
     */
    interface INetHandler {
        (data: NetData): void;
    }
}
declare namespace jy {
    /**
     * WSNetService的数据模式
     */
    const enum WSNetServiceDataMode {
        /**
         * 接收单数据帧单消息
         */
        ReceiveOneDataPerFrame = 0,
        /**
         * 接收单数据帧多消息
         */
        ReceiveMultiDataPerFrame = 1,
        /**
         * 接收掩码
         */
        ReceiveMask = 1,
        /**
         * 发送单数据帧多消息
         */
        SendMultiDataPerFrame = 0,
        /**
         * 发送单数据帧单消息
         */
        SendOneDataPerFrame = 2,
        /**
         * 发送掩码
         */
        SendMask = 2
    }
    /**
     * WebSocket版本的NetService
     * @author 3tion
     */
    class WSNetService extends NetService {
        protected _ws: WebSocket;
        readonly dataMode: WSNetServiceDataMode;
        $send: (this: WSNetService, cmd: number, data: any, msgType: Key) => void;
        /**
         * 设置数据模式
         *
         * @param {WSNetServiceDataMode} mode
         * @memberof WSNetService
         */
        setDataMode(mode: WSNetServiceDataMode): void;
        /**
         * 检查数据模式
         *
         * @memberof WSNetService
         */
        checkDataMode(): void;
        constructor();
        get connected(): boolean;
        /**
         *
         * 设置websocket地址
         * @param {string} actionUrl
         */
        setUrl(actionUrl: string): void;
        /**
         * 打开新的连接
         */
        connect(): void;
        protected onOpen: () => void;
        protected _send(cmd: number, data: any, msgType: Key): void;
        /**
         *
         * 发生错误
         * @protected
         */
        protected onError: (ev: ErrorEvent) => void;
        /**
         *
         * 断开连接
         * @protected
         */
        protected onClose: (ev: CloseEvent) => void;
        /**
         * 主动断开连接
         *
         * @returns
         * @memberof WSNetService
         */
        disconnect(): void;
    }
}
declare namespace jy {
    /**
      * 基于时间回收的资源
      */
    interface IResource {
        /**
         * 是否为静态不销毁资源
         */
        isStatic?: boolean;
        /**
         * 最后使用的时间戳
         */
        lastUseTime: number;
        /**
         * 资源id
         */
        uri: string;
        /**
         * 资源路径
         */
        url: string;
        /**
         * 销毁资源
         */
        dispose(): any;
    }
}
declare namespace jy.Res {
    /**
     * 设置失败的过期时间
     * 失败次数超过`maxRetry`
     * @export
     * @param {number} second
     */
    function setFailedExpired(second: number): void;
    /**
     * 设置单个资源，不做延迟重试的最大重试次数，默认为3
     * @param val
     */
    function setMaxRetry(val: number): void;
    /**
     * 设置最大加载线程  默认为 6
     * @param val
     */
    function setMaxThread(val: number): void;
    /**
     * 资源类型
     */
    const enum ResItemType {
        Binary = 0,
        Text = 1,
        Image = 2,
        Json = 3,
        /**
         * 音频资源
         */
        Sound = 4,
        /**
         * 视频资源
         */
        Video = 5
    }
    /**
     * 资源加载的回调
     */
    type ResCallback = CallbackInfo<{
        (resItem: ResItem, ...args: any[]): any;
    }>;
    interface ResBase {
        /**
         * 资源标识
         */
        uri: string;
        /**
         * 资源路径
         */
        url: string;
        /**
         * 数据
         */
        data?: any;
        version?: number;
    }
    interface TypedResItem<T> extends ResItem {
        data: T;
    }
    interface ResItem extends ResBase {
        /**
         * 资源类型
         */
        type?: ResItemType;
        /**
         * 是否已存储本地缓存
         */
        local?: boolean;
        /**
         * 不使用本地缓存
         */
        noLocal?: boolean;
        /**
         * 资源正在加载时所在的组
         * 加载完成后清理此值
         */
        qid?: ResQueueID;
        /**
         * 失败重试次数
         */
        retry?: number;
        /**
         * 资源加载状态
         * 默认为 UnRequest
         */
        state?: RequestState;
        /**
         * 上次失败的过期时间
         * 网络有时候不稳定，这次连续加载不到，但是后面可能能加载到
         *
         * @type {number}
         * @memberof ResItem
         */
        ft?: number;
        /**
         * 是否被移除
         */
        removed?: boolean;
        /**
         * 资源回调列队
         */
        callbacks?: ResCallback[];
    }
    const enum QueueLoadType {
        /**
         * 先入后出
         */
        FILO = 0,
        /**
         * 先入先出
         */
        FIFO = 1
    }
    /**
     * 资源分组
     */
    interface ResQueue {
        /**
         * 分组名称
         */
        id: Key;
        /**
         * 分组优先级
         */
        priority?: number;
        /**
         * 分组中的列表
         */
        list: ResItem[];
        /**
         * 加载类型
         */
        type: QueueLoadType;
    }
    /**
     * 内置的资源分组
     */
    const enum ResQueueID {
        /**
         * 常规资源，使用 FIFO
         * 适合当前地图块，普通怪物资源，特效资源等
         */
        Normal = 0,
        /**
         * 后台加载资源，使用 FILO
         * 用于后台加载，最低优先级
         */
        Backgroud = 1,
        /**
         * 高优先级资源
         * FIFO
         */
        Highway = 2
    }
    /**
     * 资源加载完成的回调
     */
    type ResLoadCallback = CallbackInfo<{
        (item: ResItem, ...args: any[]): any;
    }>;
    interface ResLoader {
        /**
         * 加载完成的回调
         */
        loadFile(resItem: ResItem, callback: ResLoadCallback): any;
    }
    interface ResRequest extends egret.EventDispatcher {
        item?: ResItem;
        resCB?: ResLoadCallback;
    }
    type ResHttpRequest = Recyclable<egret.HttpRequest & ResRequest>;
    class BinLoader implements ResLoader {
        type: XMLHttpRequestResponseType;
        constructor(type?: XMLHttpRequestResponseType);
        loadFile(resItem: ResItem, callback: ResLoadCallback): void;
        onLoadFinish(event: egret.Event): void;
    }
    type ResImgRequest = Recyclable<egret.ImageLoader & ResRequest>;
    class ImageLoader implements ResLoader {
        loadFile(resItem: ResItem, callback: ResLoadCallback): void;
        onLoadFinish(event: egret.Event): void;
    }
    /**
    * 获取资源的扩展名
    * @param url
    */
    function getExt(url: string): string;
    /**
     * 内联绑定
     * @param ext 扩展名
     * @param type 类型
     */
    function bindExtType(ext: string, type: ResItemType): void;
    /**
     * 注册资源分析器
     * @param type 分析器类型
     * @param analyzer 分析器
     */
    function regAnalyzer(type: ResItemType, analyzer: ResLoader): void;
    /**
     * 添加资源的结果
     * 0 号为返回值
     *
     * @export
     * @interface AddResResult
     * @extends {Array<any>}
     */
    interface AddResResult extends Array<any> {
        readonly 0: ResItem;
        readonly 1: boolean;
        length: 2;
    }
    /**
     * 添加资源
     * @param {ResItem} resItem
     * @param {ResQueueID} [queueID=ResQueueID.Normal]
     * @returns {ResItem}
     */
    function addRes(resItem: ResItem, queueID?: ResQueueID): AddResResult;
    /**
     * 加载资源
     * @param {string} uri 资源标识
     * @param {ResCallback} callback 加载完成的回调
     * @param {string} [url] 资源路径
     * @param {ResQueueID} [queueID=ResQueueID.Normal]
     */
    function load(uri: string, url?: string, callback?: ResCallback, queueID?: ResQueueID): void;
    interface LoadResListOption {
        callback: CallbackInfo<{
            (flag: boolean, ...args: any[]): any;
        }>;
        group: Key;
        onProgress?: CallbackInfo<{
            (item: Res.ResItem): any;
        }>;
    }
    function loadList(list: ResItem[], opt: LoadResListOption, queueID?: ResQueueID): void;
    /**
     * 同步获取某个资源，如果资源未加载完成，则返回空
     * @param uri 资源标识
     */
    function get(uri: string): any;
    function set(uri: string, item: ResItem): boolean;
    /**
     * 移除某个资源
     * @param uri
     */
    function remove(uri: string): void;
    /**
     * 阻止尝试某个资源加载，目前是还未加载的资源，从列队中做移除，其他状态不处理
     * @param uri
     */
    function cancel(uri: string): void;
    /**
     * 加载资源
     * @param {ResItem} resItem
     * @param {ResQueueID} [queueID=ResQueueID.Normal]
     */
    function loadRes(resItem: ResItem, callback?: ResCallback, queueID?: ResQueueID): void;
    function getLocalDB(version: number, keyPath: string, storeName: string): {
        /**
         * 存储资源
         *
         * @param {ResItem} data
         * @param {(this: IDBRequest, ev: Event) => any} callback 存储资源执行完成后的回调
         */
        save(data: ResItem, callback?: (ev: Error | Event) => any): void;
        /**
         * 获取资源
         *
         * @param {string} url
         * @param {{ (data: ResItem) }} callback
         */
        get(url: string, callback: (data: ResItem, url?: string) => any): void;
        /**
         * 删除指定资源
         *
         * @param {string} url
         * @param {{ (this: IDBRequest, ev: Event) }} callback 删除指定资源执行完成后的回调
         */
        delete(url: string, callback?: (url: string, ev: Error | Event) => any): void;
        /**
         * 删除全部资源
         *
         * @param {{ (this: IDBRequest, ev: Event) }} callback 删除全部资源执行完成后的回调
         */
        clear(callback?: (ev: Error | Event) => any): void;
    };
    /**
     *  尝试启用本地资源缓存
     * @author 3tion(https://github.com/eos3tion/)
     * @export
     * @param {number} [version=1]
     * @returns
     */
    function tryLocal(version?: number, keyPath?: string, storeName?: string): {
        /**
         * 存储资源
         *
         * @param {ResItem} data
         * @param {(this: IDBRequest, ev: Event) => any} callback 存储资源执行完成后的回调
         */
        save(data: ResItem, callback?: (ev: Error | Event) => any): void;
        /**
         * 获取资源
         *
         * @param {string} url
         * @param {{ (data: ResItem) }} callback
         */
        get(url: string, callback: (data: ResItem, url?: string) => any): void;
        /**
         * 删除指定资源
         *
         * @param {string} url
         * @param {{ (this: IDBRequest, ev: Event) }} callback 删除指定资源执行完成后的回调
         */
        delete(url: string, callback?: (url: string, ev: Error | Event) => any): void;
        /**
         * 删除全部资源
         *
         * @param {{ (this: IDBRequest, ev: Event) }} callback 删除全部资源执行完成后的回调
         */
        clear(callback?: (ev: Error | Event) => any): void;
    };
}
declare namespace jy {
    function get<T extends IResource>(resid: string, noResHandler: {
        (...args: any[]): T;
    }, thisObj?: any, ...args: any[]): T;
    export const ResManager: {
        get: typeof get;
        /**
         * 获取资源
         */
        getResource: typeof getResource;
        /**
         * 注册资源
         */
        regResource: typeof regResource;
        /**
         * 初始化
         * @param time 设置资源销毁的时间(单位：毫秒)，至少大于检查时间 `30秒`
         */
        init(time?: number): void;
        /**
         * 强制gc
         * 清理所有未使用的资源
         */
        gc(): void;
        /**
         * 从删除特定资源
         */
        disposeRes: typeof disposeRes;
    };
    /**
     * 删除资源
     * @param filter
     */
    function disposeRes(filter: {
        (res: IResource): boolean;
    }): void;
    /**
     * 获取资源
     */
    function getResource(resID: string): IResource;
    /**
     * 注册资源
     */
    function regResource(resID: string, res: IResource): boolean;
    export {};
}
declare namespace jy {
    interface TextureResourceOption {
        /**
         * 是否不要webp纹理
         */
        noWebp?: boolean;
        /**
         * 是否将纹理装箱到指定纹理集
         * 如果不设置，则表示没有
         */
        sheetKey?: Key;
    }
    import Bitmap = egret.Bitmap;
    /**
     *
     * 纹理资源
     * @export
     * @class TextureResource
     * @implements {IResource}
     */
    class TextureResource implements IResource {
        /**
         * 最后使用的时间戳
         */
        lastUseTime: number;
        /**
         * 资源id
         */
        readonly uri: string;
        /**
         * 资源最终路径
         */
        readonly url: string;
        state: RequestState;
        /**
         * 加载列队
         */
        qid?: Res.ResQueueID;
        /**
         * 关联的纹理表单标识
         */
        sheetKey: Key;
        constructor(uri: string, noWebp?: boolean);
        /**
         *
         * 是否为静态不销毁的资源
         * @type {boolean}
         */
        get isStatic(): boolean;
        private _tex;
        /**
         *
         * 绑定的对象列表
         * @private
         * @type {Bitmap[]}
         */
        private _list;
        /**
         *
         * 绑定一个目标
         * @param {Bitmap} target
         */
        bind(bmp: Bitmap, placehoder?: egret.Texture, load?: boolean): void;
        /**
         *
         * 解除目标的绑定
         * @param {Bitmap} target
         */
        loose(bmp: Bitmap): void;
        load(): void;
        /**
         * 资源加载完成
         */
        loadComplete(item: Res.TypedResItem<egret.Texture>): void;
        /**
         * 销毁资源
         */
        dispose(): void;
        /**
         * 获取纹理资源
         *
         * @param {string} resID 资源id
         * @param {boolean} [noWebp] 是否不加webp后缀
         * @returns {TextureResource}
         */
        static get(uri: string, { noWebp, sheetKey }: TextureResourceOption): TextureResource;
    }
}
declare namespace jy {
    /**
     * 状态限制器
     * @author 3tion
     */
    interface ILimit {
        /**
         * 设置状态
         *
         * @param {Key} type
         * @memberof ILimit
         */
        setState(type: Key): any;
        /**
         * 检查内容是否被禁止了;
         * @param type
         * @return
         *
         */
        check(value: Key): boolean;
    }
}
declare namespace jy {
    /**
     * 状态机监听器
     * @author 3tion
     */
    interface IStateListener {
        setState(type: Key): any;
    }
}
declare namespace jy {
    /**
     * 状态机的状态实现
     * @author 3tion
     */
    interface IStateSwitcher {
        /**
         *
         * 在上一个状态sleep之前调用
         * @param {Key} [type]
         * @memberof IStateSwitcher
         */
        beforeLastSleep?(type?: Key): any;
        /**
         * 被一个状态禁止了
         *
         * @param {Key} [type]
         *
         * @memberof IStateSwitcher
         */
        sleepBy?(type?: Key): any;
        /**
         * 被一个状态开启了
         *
         * @param {Key} [type]
         *
         * @memberof IStateSwitcher
         */
        awakeBy?(type?: Key): any;
    }
}
declare namespace jy {
    const enum LimitScene {
        /**
         * 默认场景
         */
        Default = 0
    }
    /**
    * 限制列队
    * @author 3tion
    */
    class LimitQueue implements ILimit {
        protected _queue: ILimit[];
        protected _current: Key;
        listener: IStateListener;
        constructor();
        addLimiter(item: ILimit): boolean;
        /**
         * 设置状态
         * @param value
         *
         */
        setState(value: Key): void;
        removeLimiter(item: ILimit): boolean;
        clear(): void;
        /**
         * 是否被限制了
         * @param type
         * @return
         *
         */
        check(type: Key): boolean;
    }
    interface UILimiterType {
        impl: LimitQueue;
        /**
         * 最大历史数
         *
         * @type {number}
         * @memberof UILimiterType
         */
        MaxHistory: number;
        readonly current: Key;
        /**
         * 取得状态侦听管理器(以便注册关注的状态)
         *
         * @type {StateMachine}
         * @memberof UILimiterType
         */
        readonly listener: StateMachine;
        enter(scene: Key): void;
        exit(scene?: Key): void;
        check(scene: Key): boolean;
    }
    const UILimiter: UILimiterType;
    function addToStates(value: IStateSwitcher, ...ids: Key[]): void;
    function addToState(id: Key, value: IStateSwitcher): void;
}
declare namespace jy {
    /**
     * 使用数值或者字符串类型作为Key
     * V 作为Value的字典
     * 原生的map(ECMAScript5无Map)无法自定义列表顺序，而是完全按照加载顺序的，所以才需要有此类型
     * 列表存储Value
     * @author 3tion
     * @class ArraySet
     * @template V
     */
    class ArraySet<V> {
        private _list;
        private _dict;
        constructor();
        /**
         * 获取原始列表，用于重新排序
         * 请不要直接进行 + - 值，使用set delete 方法进行处理
         * @readonly
         *
         */
        get rawList(): V[];
        /**
         * 获取原始的字典
         * 请不要直接行 + - 值，使用set delete 方法进行处理
         * @readonly
         *
         */
        get rawDict(): {
            readonly [index: string]: V;
        };
        /**
         * 设置原始字典
         *
         * @param { [index: string]: V } dict
         *
         */
        setRawDict(dict: {
            [index: string]: V;
        }): this;
        /**
         *
         * @param {V[]} list        要放入的数据
         * @param {keyof V} keyPro   索引的属性名称
         *
         * 下例是一个形式为：{id:number,name:string}[]的数组，进行设值的例子
         * @example
         * let rawList:{id:number,name:string}[] = [{id:1,name:"test1"},{id:2,name:"test2"},{id:3,name:"test3"}];
         * let set = new ArraySet<{id:number,name:string}>();
         * set.setRawList(rawList,"id"); //设值操作
         *
         */
        setRawList(list: V[], keyPro: keyof V): this;
        /**
         *
         * 设置数据
         *
         * @param {Key} key
         * @param {V} value
         * @return {number} 返回值加入到数据中的索引
         */
        set(key: Key, value: V): number;
        /**
         * 获取数据
         *
         * @param {Key} key
         * @returns
         *
         */
        get(key: Key): V;
        /**
         * 根据key移除数据
         *
         * @param {Key} key
         *
         */
        delete(key: Key): V;
        /**
         * 清理数据
         *
         *
         */
        clear(): void;
        /**
         * 获取总长度
         *
         * @readonly
         *
         */
        get size(): number;
    }
}
declare namespace jy {
    const enum ByteArraySize {
        SIZE_OF_UINT32 = 4,
        SIZE_OF_FIX64 = 8,
        SIZE_OF_INT64 = 8,
        SIZE_OF_DOUBLE = 8,
        SIZE_OF_FLOAT = 4,
        SIZE_OF_FIX32 = 4,
        SIZE_OF_SFIX32 = 4,
        SIZE_OF_UINT16 = 2,
        SIZE_OF_INT16 = 2
    }
    /**
     * 方便后续调整
     * 加入ProtoBuf的varint支持
     * @author 3tion
     *
     */
    class ByteArray extends egret.ByteArray {
        $endian: egret.EndianConst;
        constructor(buffer?: ArrayBuffer, ext?: number);
        /**
         * 替换缓冲区
         *
         * @param {ArrayBuffer} value
         */
        replaceBuffer(value: ArrayBuffer): void;
        /**
         *
         * 读取指定长度的Buffer
         * @param {number} length       指定的长度
         * @returns {Buffer}
         */
        readBuffer(length: number): ArrayBuffer;
        readInt64(): number;
        writeInt64(value: number): void;
        /**
         * 读取ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        readPBDouble(): number;
        /**
         * 写入ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         * @param value
         */
        writePBDouble(value: number): void;
        /**
         * 读取ProtoBuf的`Float`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        readPBFloat(): number;
        /**
          * 写入ProtoBuf的`Float`
          * protobuf封装是使用littleEndian的，不受Endian影响
          * @param value
          */
        writePBFloat(value: number): void;
        readFix32(): number;
        writeFix32(value: number): void;
        readSFix32(): number;
        writeSFix32(value: number): void;
        readFix64(): number;
        writeFix64(value: number): void;
        /**
         *
         * 读取指定长度的ByteArray
         * @param {number} length       指定的长度
         * @param {number} [ext=0]      ByteArray扩展长度参数
         * @returns {ByteArray}
         */
        readByteArray(length: number, ext?: number): ByteArray;
        /**
         * 向字节流中写入64位的可变长度的整数(Protobuf)
         */
        writeVarint64(value: number): void;
        /**
         * 向字节流中写入32位的可变长度的整数(Protobuf)
         */
        writeVarint(value: number): void;
        /**
         * 读取字节流中的32位变长整数(Protobuf)
         */
        readVarint(): number;
        /**
          * 读取字节流中的32位变长整数(Protobuf)
          */
        readVarint64(): number;
        /**
         * 获取写入的字节
         * 此方法不会新建 ArrayBuffer
         * @readonly
         * @memberof ByteArray
         */
        get outBytes(): Uint8Array;
        /**
         * 重置索引
         *
         * @memberof ByteArray
         */
        reset(): void;
    }
}
declare namespace jy {
    const enum PosKey {
        X = "x",
        Y = "y"
    }
    const enum SizeKey {
        Width = "width",
        Height = "height"
    }
    const enum EgretMeasureSizeKey {
        Height = "measuredHeight",
        Width = "measuredWidth"
    }
    /**
     * 有`width` `height` 2个属性
     *
     * @export
     * @interface Size
     */
    interface Size {
        width: number;
        height: number;
    }
    /**
     * 有 `x` `y` 两个属性
     *
     * @export
     * @interface Point
     */
    interface Point {
        x: number;
        y: number;
    }
    /**
     * 有 `x` `y` `z` 3个属性
     *
     * @export
     * @interface Point3D
     * @extends {Point}
     */
    interface Point3 extends Point {
        z: number;
    }
    /**
     * 有 `x` `y` `z` `w`4个属性
     */
    interface Point4 extends Point3 {
        w: number;
    }
    /**
     * 矩形
     * 有`x`,`y`,`width`,`height` 4个属性
     *
     * @export
     * @interface Rect
     * @extends {Point}
     * @extends {Size}
     */
    interface Rect extends Point, Size {
    }
}
declare namespace jy {
    /**
     * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
     * @author
     *
     */
    class Int64 {
        /**
         * 高位
         */
        high: number;
        /**
         * 低位
         */
        low: number;
        constructor(low?: number, high?: number);
        toNumber(): number;
        static toNumber(low?: number, high?: number): number;
        static fromNumber(value: number): any;
        add(addend: Int64): Int64;
    }
}
declare namespace jy {
    /**
     * 经纬度 定位信息
     *
     * @export
     * @interface Location
     */
    interface Location {
        /**维度*/
        latitude: number;
        /**精度*/
        longitude: number;
    }
    interface LocationConstructor {
        /**
         * 根据两个经纬度获取距离(单位：米)
         *
         * @param {Location} l1
         * @param {Location} l2
         * @returns 距离(单位：米)
         */
        getDist(l1: Location, l2: Location): number;
    }
    var Location: LocationConstructor;
}
declare const enum Time {
    /**
     * 一秒
     */
    ONE_SECOND = 1000,
    /**
     * 五秒
     */
    FIVE_SECOND = 5000,
    /**
     * 一分种
     */
    ONE_MINUTE = 60000,
    /**
     * 五分种
     */
    FIVE_MINUTE = 300000,
    /**
     * 半小时
     */
    HALF_HOUR = 1800000,
    /**
     * 一小时
     */
    ONE_HOUR = 3600000,
    /**
     * 一天
     */
    ONE_DAY = 86400000
}
declare const enum CountDownFormat {
    /**
     * { d: LangUtil.getMsg("$_ndays"), h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") }
     */
    D_H_M_S = 0,
    /**
     * { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") }
     */
    H_M_S = 1,
    /**
     *  { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes") }
     */
    H_M = 2,
    /**
     * { m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") }
     */
    M_S = 3,
    /**
     * { s: LangUtil.getMsg("$_nsecends") }
     */
    S = 4
}
declare namespace jy {
    /**
     * 倒计时的格式选项
     *
     * @export
     * @interface CountDownFormatOption
     */
    interface CountDownFormatOption {
        /**
         *
         * 剩余天数的修饰字符串
         * 如： `{0}天`
         * @type {string}@memberof CountDownFormatOption
         */
        d?: string;
        /**
         * 剩余小时的修饰字符串
         * 如：`{0}小时`
         *
         * @type {string}@memberof CountDownFormatOption
         */
        h?: string;
        /**
         * 剩余分钟的修饰字符串
         * 如：`{0}分钟`
         *
         * @type {string}@memberof CountDownFormatOption
         */
        m?: string;
        /**
         * 剩余秒数的修饰字符串
         * 如：`{0}秒`
         *
         * @type {string}@memberof CountDownFormatOption
         */
        s?: string;
        /**
         * 小时补0
         */
        hh?: boolean;
        /**
         * 分钟补0
         */
        mm?: boolean;
        /**
         * 秒补0
         */
        ss?: boolean;
        /**
         * 如果计算出如：`0小时31分`这种
         * true  则显示 `31分`
         * false 则显示 `0小时31分`
         *
         * 但是如果是 `1天0小时31分`这种
         * `小时`虽然是`0`，但比`小时`大的单位`天`有值
         * true 和 false 都会显示 `1天0小时31分`
         */
        hideZero?: boolean;
    }
    interface DateUtilsInterface {
        /**
         * CountDownFormat
         *
         * @static
         * @param {number} format
         * @returns {*}
         *
         * @memberOf DateUtils
         */
        getDefaultCDFOption(format: number): CountDownFormatOption;
        /**
         * 注册默认的CD格式，方便后续调用
         *
         * @param {CountDownFormat} format
         * @param {CountDownFormatOption} opt
         */
        regCDFormat(format: CountDownFormat, opt: CountDownFormatOption): any;
        /**
         * 初始化服务器时间
         *
         * @static
         * @param {number} time 服务器时间戳
         * @param {number} timezoneOffset 服务器基于UTC的时区偏移
         */
        initServerTime(time: number, timezoneOffset: number): void;
        /**
         * 设置服务器时间
         * 用于同步服务器时间
         * @static
         * @param {number} time
         */
        setServerTime(time: number): void;
        /**
         * 通过UTC偏移过的当前时间戳
         *
         * @static
         */
        readonly utcServerTime: number;
        /**
         * 通过UTC偏移过的Date
         */
        readonly utcServerDate: Date;
        /**
         * 获取当前时间戳，用于和服务端的时间戳进行比较
         *
         * @readonly
         * @static
         */
        readonly serverTime: number;
        /**
         * 通过UTC偏移过的当前时间戳的Date对象
         */
        readonly serverDate: Date;
        /**
         * 共享时间
         *
         * @type {Date}
         * @memberof DateUtilsInterface
         */
        readonly sharedDate: Date;
        /**
         * 项目中，所有时间都需要基于UTC偏移处理
         *
         * @static
         * @param {number} time			要格式化的时间，默认为UTC时间
         * @param {string} format 		  格式字符串 yyyy-MM-dd HH:mm:ss
         * @param {boolean} [isRaw=true] 	是否为原始未使用utc偏移处理的时间，默认 true
         * @returns
         */
        getFormatTime(time: number, format: string, isRaw?: boolean): string;
        /**
         * 获取指定时间的当天结束(23:59:59'999)时间戳
         *
         * @static
         * @param {number} [time] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {number} 指定时间的当天结束(23:59:59'999)时间戳
         */
        getDayEnd(time?: number): number;
        /**
         * 获取指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {number} 指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         */
        getUTCDayEnd(utcTime?: number): number;
        /**
         * 获取指定时间的当天开始的(0:0:0'0)时间戳
         *
         * @static
         * @param {number} [time] 指定的时间，不设置时间，则取当前服务器时间
         * @returns {Date} 指定时间的当天开始的(0:0:0'0)时间戳
         */
        getDayStart(time?: number): number;
        /**
         * 获取指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {Date} 指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         */
        getUTCDayStart(utcTime?: number): number;
        /**
         * 将服务器有偏移量的时间戳，转换成显示时间相同的UTC时间戳，用于做显示
         *
         * @static
         * @param {number} time 正常的时间戳
         * @returns {number} UTC偏移后的时间戳
         */
        getUTCTime(time: number): number;
        /**
         * 显示倒计时
         *
         * @static
         * @param {number} leftTime 剩余时间
         * @param {{ d?: string, h?: string, m?: string, s?: string }} format 倒计时修饰符，
         * format 示例：{d:"{0}天",h:"{0}小时",m:"{0}分",s:"{0}秒"}
         */
        getCountdown(leftTime: number, format: CountDownFormatOption | CountDownFormat): string;
        /**
         * 获取天数
         * 如要获取开服天数
         * 1月1日 `23点50分`开服
         * 1月2日 `6点0分`，则算开服`第二天`
         * @param {number} startTime 起点时间戳
         * @param {number} [endTime] 结束时间戳
         */
        getDayCount(startTime: number, endTime?: number): number;
        /**
         * 获取天数，基于UTC时间计算
         * 如要获取开服天数
         * 1月1日 `23点50分`开服
         * 1月2日 `6点0分`，则算开服`第二天`
         * @param {number} startTime 起点时间戳
         * @param {number} [endTime] 结束时间戳
         */
        getUTCDayCount(startTime: number, endTime?: number): number;
    }
    const DateUtils: DateUtilsInterface;
}
declare namespace jy {
    /**
     * TimveVO
     */
    class TimeVO {
        /**
         * 配置的小时
         *
         * @type {number}
         */
        hour: number;
        /**
         * 配置的分钟
         *
         * @type {number}
         */
        minute: number;
        /**
         * 小时和分钟的时间偏移
         *
         * @type {number}
         */
        time: number;
        /**
         * 日期原始字符串
         */
        strTime: string;
        constructor(timeStr?: string);
        /**
         * 从分钟进行解析
         *
         * @param {number} minutes 分钟数
         */
        decodeMinutes(minutes: number): TimeVO;
        /**
         * 从一个数值进行序列化
         * decodeMinutes和decodeBit，如果使用protobuf writeVarint32 存储，时间只要超过 02:08，不管如何使用何种方式，一定会超过2字节，而 23:59，不管怎么存储，都不会超过2字节
         * decodeBit解析比 decodeMinutes更加快捷
         * 而 hour<<6|minute  解析会更简单，快速
         * @param {number} value
         */
        decodeBit(value: number): TimeVO;
        /**
         * 按小时分钟解析
         * @param hour
         * @param minute
         */
        decode2(hour: number, minute: number): TimeVO;
        /**
         * 从字符串中解析
         *
         * @param {number} strTime 通过解析器解析的数据
         */
        decode(strTime: string): TimeVO;
        /**
        * 获取今日的服务器时间
        *
        * @readonly
        * @memberOf TimeVO
        */
        get todayTime(): number;
        /**
         * 获取指定时间戳那天的时间
         *
         * @param {number} [day]
         * @param {boolean} [isUTC]
         * @returns
         * @memberof TimeVO
         */
        getDayTime(day?: number, isUTC?: boolean): number;
    }
}
declare namespace jy {
    class Bin extends egret.Rectangle {
        /**
         * 是否旋转了90°
         */
        rot: boolean;
        clone(): Bin;
    }
    interface BinPacker {
        width: number;
        height: number;
        rot: boolean;
        usedRects: Bin[];
        freeRects: Bin[];
    }
    interface ShortSideBinPacker extends BinPacker {
    }
    /**
     * 短边优先装箱
     * 动态装箱，暂时只用短边优先的单一策略
     */
    class ShortSideBinPacker {
        constructor(width: number, height: number, allowRotation?: boolean);
        /**
         * 重置装箱
         */
        reset(): void;
        /**
         * 扩展大小，如果宽度或者高度比原先小，则返回false
         * @param width
         * @param height
         */
        extSize(width: number, height: number): boolean;
        insert(width: number, height: number): Bin;
    }
}
declare namespace jy {
    /**
     * 圆圈倒计时
     *
     * @export
     * @class CircleCountdown
     */
    class CircleCountdown {
        static defaultColor: number;
        protected _g: egret.Graphics;
        protected _cX: number;
        protected _cY: number;
        /**
         * 绘制的线的宽度
         *
         * @protected
         *
         * @memberOf CircleCountdown
         */
        protected _sw: number;
        protected _total: number;
        protected _p: number;
        protected _cfgs: CircleCountdownCfg[];
        protected _cfg: CircleCountdownCfg;
        protected _eRad: number;
        protected _sRad: number;
        protected _dRad: number;
        protected _radius: number;
        private isEnd;
        setGraphis(graphics: egret.Graphics): this;
        setCenter(centerX: number, centerY: number): this;
        setRadius(radius: number): this;
        /**
         * 设置起始角度和结束角度
         *
         * @param {number} [rad=0]
         *
         * @memberOf CircleCountdown
         */
        setRad(startRad?: number, endRad?: number): this;
        /**
         * 设置线的宽度
         *
         * @param {number} [strokeWidth=1]
         * @returns
         *
         * @memberOf CircleCountdown
         */
        setStrokeWidth(strokeWidth?: number): this;
        setCfgs(color?: number | CircleCountdownCfg, ...cfgs: CircleCountdownCfg[]): this;
        addCfg(color: CircleCountdownCfg): this;
        reset(): this;
        progress(value: number, maxValue: number): void;
        reuse(): void;
        clear(): void;
        protected render(): void;
    }
    /**
     * 圆圈倒计时配置
     *
     * @export
     * @interface CircleCountdownCfg
     * @extends {Object}
     */
    interface CircleCountdownCfg extends Object {
        /**
         *
         * 使用的起始颜色
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        color: number;
        /**
         * 颜色权值
         *
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        weight: number;
        /**
         * 是否不做渐变，默认基于下一个点做渐变
         *
         * @type {boolean}
         * @memberOf CircleCountdownCfg
         */
        noGradient?: boolean;
        /**
         * 是否闪烁
         *
         * @type {boolean}
         * @memberOf CircleCountdownCfg
         */
        shine?: boolean;
        /**
         * 起始点
         *
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        start?: number;
        /**
         * 结束点
         *
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        end?: number;
        /**
         * 结束颜色
         *
         * @type {number}
         * @memberOf CircleCountdownCfg
         */
        endColor?: number;
    }
}
declare namespace jy {
    /**
     * 拷贝到剪贴板中
     *
     * @author gushuai
     * @export
     * @param {string} str
     * @returns
     */
    function doCopy(str: string): boolean;
}
declare namespace jy {
    export const DataUrlUtils: {
        /**
         * 根据dataUrl获取 base64字符串
         *
         * @param {string} dataUrl
         * @returns
         */
        getBase64: typeof getBase64;
        /**
         * 根据dataUrl获取Uint8Array
         *
         * @param {string} dataUrl
         * @returns
         */
        getBytes: typeof getBytes;
        /**
         * 获取白鹭可视对象的dataUrl
         *
         * @param {egret.DisplayObject} dis
         * @param {string} type
         * @param {egret.Rectangle} [rect]
         * @param {any} [encodeOptions]
         * @returns
         */
        getDisplayDataURL: typeof getDisplayDataURL;
        /**
         * 获取可视对象的Base64字符串
         *
         * @param {egret.DisplayObject} dis
         * @param {string} type
         * @param {egret.Rectangle} [rect]
         * @param {any} [encodeOptions]
         * @returns
         */
        getDisplayBase64(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?: any, scale?: number): string;
        /**
         * 获取可视对象的Uint8字节流
         *
         * @param {egret.DisplayObject} dis
         * @param {string} type
         * @param {egret.Rectangle} [rect]
         * @param {any} [encodeOptions]
         * @returns
         */
        getDisplayBytes(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?: any, scale?: number): Uint8Array;
    };
    function getDisplayDataURL(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?: any, scale?: number): string;
    function getBase64(dataUrl: string): string;
    function getBytes(dataUrl: string): Uint8Array;
    export {};
}
declare namespace jy {
    function getDynamicTexSheet(size?: number): {
        bind: (uri: string | number, tex: DynamicTexture) => any;
        draw: (uri: string | number, display: egret.DisplayObject, clipBounds?: egret.Rectangle, scale?: number) => DynamicTexture;
        update: (uri: string | number, tex: egret.Texture) => void;
        bindOrUpdate(uri: string | number, tex: DynamicTexture): void;
        remove(uri: string | number): void;
        get: (uri: string | number) => egret.Texture;
    };
    type DynamicTexSheet = ReturnType<typeof getDynamicTexSheet>;
}
declare namespace jy {
    interface FilterUtilsType {
        /**
         * 共享灰度滤镜列表
         */
        gray: egret.Filter[];
        /**共享暗淡滤镜 */
        dark: egret.Filter[];
        /**共享模糊滤镜 */
        blur: egret.Filter[];
        /**
         * 根据 adjustColor 值，获取 ColorMatrixFilter 滤镜
         *
         * @param {number} [brightness=0]   亮度：取值范围 -100 - 100
         * @param {number} [contrast=0]     对比度：取值范围 -100 - 100
         * @param {number} [saturation=0]   饱和度：取值范围 -100 - 100
         * @param {number} [hue]            色调： 取值范围 -180 - 180
         * @returns {egret.ColorMatrixFilter}
         * @memberof FilterUtilsType
         */
        adjustColorFilter(brightness?: number, contrast?: number, saturation?: number, hue?: number): egret.ColorMatrixFilter;
    }
    /**
     * 滤镜辅助
     *
     * @export
     * @class FilterUtils
     */
    const FilterUtils: FilterUtilsType;
}
declare namespace jy {
    /**
     * 获取多个点的几何中心点
     *
     * @export
     * @param {Point[]} points 点集
     * @param {Point} result 结果
     * @returns {Point} 点集的几何中心点
     * @author gushuai
     */
    function getCenter(points: Point[], result?: Point): Point;
    /**
     * 检查类矩形 a 和 b 是否相交
     * @export
     * @param {Rect} a   类矩形a
     * @param {Rect} b   类矩形b
     * @returns {boolean} true     表示两个类似矩形的物体相交
     *         false    表示两个类似矩形的物体不相交
     */
    function intersects(a: Rect, b: Rect): boolean;
    /**
     * 获取点集围成的区域的面积
     * S=（（X2-X1）*  (Y2+Y1)+（X2-X2）*  (Y3+Y2)+（X4-X3）*  (Y4+Y3)+……+（Xn-Xn-1）*  (Yn+Yn-1)+（X1-Xn）*  (Y1+Yn)）/2
     * @export
     * @param {Point[]} points 点集
     * @returns {number}
     */
    function getArea(points: Point[]): number;
}
declare namespace jy {
    const HTMLUtil: {
        /**
         * 字符着色
         *
         * @param {string | number} value       内容
         * @param {(string | number)} color     颜色
         * @returns
         */
        createColorHtml(value: string | number, color: string | number): string;
        /**
         * 清理html;
         * @value value
         * @return
         *
         */
        clearHtml(value: string): string;
        /**
         * 将特殊字符串处理为HTML转义字符
         *
         * @param {string} content
         */
        escHTML(content: string): string;
        /**
         * 将HTML特殊符号，恢复成正常字符串
         *
         * @param {string} content
         * @returns
         */
        unescHTML(content: string): string;
    };
}
declare namespace jy {
    interface LangUtilInterface {
        /**
         * 获取显示的信息
         *
         * @static
         * @param {(number | string)} code code码
         * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
         * @returns 显示信息
         */
        getMsg(code: number | string, ...args: any[]): string;
        getMsg(code: number | string, args: any): string;
        /**
         *
         * 注册语言字典
         * @param {{ [index: string]: string }} data
         * @memberof LangUtilInterface
         */
        regMsgDict(data: {
            [index: string]: string;
        }): void;
        /**
         * 检查语言包中，是否有对应的code码
         *
         * @param {Key} code
         * @returns {boolean}
         * @memberof LangUtilInterface
         */
        has(code: Key): boolean;
    }
    /**
     * 用于处理语言/文字显示
     */
    const LangUtil: LangUtilInterface;
}
declare namespace jy {
    export const enum Sex {
        /**
         * 男
         */
        Male = 1,
        /**
         * 女
         */
        Female = 2,
        Nan = 1,
        Nv = 2
    }
    function setLib(data: {
        a?: string;
        b?: string;
        c1?: string;
        c2?: string;
    }): void;
    export class NameUtils {
        private _random;
        /**
         *
         * @param randomFunc	随机算法
         *
         */
        constructor(randomFunc?: Function);
        /**
         * 设置名字库的数据
         *
         * @static
         * @memberof NameUtils
         */
        static setLib: typeof setLib;
        /**
         * 设置名字库的数据
         * @param a
         * @param b
         * @param c1
         * @param c2
         */
        static setLib2(a: string[], b?: string[], c1?: string[], c2?: string[]): void;
        /**
         * 加载名字库
         * @param url
         * @param callback
         */
        static loadNameLib(url: string, callback?: $CallbackInfo): any;
        /**
         * 设置随机算法
         * @param randomFunc
         *
         */
        setRandom(randomFunc: Function): void;
        /**
         * 获取名字
         * @param sex 1 男  2 女
         * @return
         *
         */
        getName(sex?: Sex): string;
        dispose(): void;
    }
    export {};
}
declare namespace jy {
    interface RPCCallback {
        /**
         * 成功的回调函数
         *
         * @type {Recyclable<CallbackInfo<(data?: any, ...args)>>}
         * @memberof RPCCallback
         */
        success: Recyclable<CallbackInfo<{
            (data?: any, ...args: any[]): any;
        }>>;
        /**
         * 失败的回调函数
         *
         * @type {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>}
         * @memberof RPCCallback
         */
        error: Recyclable<CallbackInfo<{
            (error?: Error, ...args: any[]): any;
        }>>;
        /**
         * RPC的超时时间
         *
         * @type {number}
         * @memberof RPCCallback
         */
        expired: number;
        id: number;
    }
    const enum RPCConst {
        /**
         * 默认超时时间
         */
        DefaultTimeout = 2000
    }
    interface RPCInterface {
        /**
         * 超时的错误常量 `RPCTimeout`
         *
         * @type {string}
         * @memberof RPCInterface
         */
        readonly Timeout: string;
        /**
         * 执行回调
         *
         * @param {number} id 执行回调的id
         * @param {*} [data] 成功返回的数据
         * @param {(Error | string)} [err] 错误
         */
        callback(id: number, data?: any, err?: Error | string): any;
        /**
         * 注册回调函数
         *
         * @param {Recyclable<CallbackInfo<{ (data?: any, ...args) }>>} success     成功的函数回调
         * @param {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>} [error]    发生错误的函数回调
         * @param {number} [timeout=2000] 超时时间，默认2000，实际超时时间会大于此时间，超时后，如果有错误回调，会执行错误回调，`Error(RPC.Timeout)`
         * @returns 回调函数的id
         */
        registerCallback(success: Recyclable<CallbackInfo<{
            (data?: any, ...args: any[]): any;
        }>>, error?: Recyclable<CallbackInfo<{
            (error?: Error, ...args: any[]): any;
        }>>, timeout?: number): number;
        /**
         * 注册回调函数
         * 成功则data为返回的数据
         * 失败时
         * `withError`为`true` data为Error
         * `withError`不填或者`false` data为undefined
         * @param {{ (data?: any, ...args) }} callback 回调函数，成功或者失败均会使用此回调
         * @param {boolean} [withError] 返回回调失败时，是否使用Error，默认失败，data为`undefined`
         * @param {number} [timeout=2000] 回调函数的超时时间，默认为2000
         * @param {*} [thisObj]
         * @param {any} any
         * @returns {number}
         * @memberof RPCInterface
         */
        registerCallbackFunc(callback: {
            (data?: any, ...args: any[]): any;
        }, withError?: boolean, timeout?: number, thisObj?: any, ...any: any[]): number;
        /**
         * 根据id移除回调函数
         *
         * @param {number} id
         */
        removeCallback(id: number): any;
    }
    const RPC: RPCInterface;
}
declare namespace jy {
    interface RequestLimitType {
        /**
         *
         *
         * @param {(string | number)} o     锁定的对像(可以是任何类型,它会被当做一个key)
         * @param {number} [time=500]       锁定对像 毫秒数，默认500毫秒
         * @returns {boolean}   是否已解锁 true为没有被限制,false 被限制了
         *
         * @memberOf RequestLimit
         */
        check(o: string | number, time?: number): boolean;
        /**
         * 移除锁定
         *
         * @param {(string | number)} o
         *
         * @memberOf RequestLimit
         */
        remove(o: string | number): void;
    }
    /**
     * 请求限制
     * @author 3tion
     *
     */
    const RequestLimit: RequestLimitType;
}
declare namespace jy {
    function tick(now: number): void;
    /**
     *
     * 注册回调  会对在同一个时间区间的 `callback`和`thisObj`相同的回调函数进行去重
     * @static
     * @param {number} time 回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
     * @param {Function} callback 回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
     * @param {any} [thisObj] 回调函数的`this`对象，不传值则使用全局上下文即window
     * @param {any} args 回调函数的参数
     */
    function addCallback(time: number, callback: Function, thisObj?: any, ...args: any[]): void;
    /**
     * 注册回调 会对在同一个时间区间的 `callback`相同的情况下，才会去重
     * @param time
     * @param callback
     */
    function add(time: number, callback: $CallbackInfo): void;
    /**
     * 移除回调
     * 不回收`CallbackInfo`
     * @param {number} time
     * @param {$CallbackInfo} callback
     */
    function remove(time: number, callback: $CallbackInfo): void;
    /**
     * 移除回调
     * @static
     * @param {number} time         回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
     * @param {Function} callback   回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
     * @param {*} [thisObj]         回调函数的`this`对象
     */
    function removeCallback(time: number, callback: Function, thisObj?: any): void;
    export const TimerUtil: {
        addCallback: typeof addCallback;
        removeCallback: typeof removeCallback;
        tick: typeof tick;
        add: typeof add;
        remove: typeof remove;
    };
    export {};
}
declare namespace jy {
    /**
     * 处理链接地址
     * 如果是http:// 或者  https:// 获取//开头的地址，直接返回
     * 否则拼接当前地址的 href
     * @export
     * @param {string} link
     * @param {string} [origin]
     * @returns
     */
    function solveLink(link: string, origin?: string): string;
}
declare namespace jy {
    /**
     * 初始化屏蔽字
     * @param str   使用特定符号分隔的脏字列表
     * @param split 分隔符
     *
     */
    function initFilterstring(str: string, split: string): void;
    function wordCensor1(msg: string): string;
    function checkWord1(msg: string): boolean;
    /**
     * 文字过滤
     * @author 3tion
     */
    export const WordFilter: {
        /**
         * 由于脏字文件使用ajax读取，可能存在跨域问题，所以在H5中使用javascript方式加载
         */
        loadDirtyWord(url: string, split?: string): void;
        /**
         * 初始化屏蔽字
         * @param str   使用特定符号分隔的脏字列表
         * @param split 分隔符
         *
         */
        initFilterstring: typeof initFilterstring;
        /**
         * 将敏感词替换为**
         * @param msg	要检测的文字
         * @return
         *
         */
        wordCensor: typeof wordCensor1;
        /**
         * 设置 将字符替换成* 的函数
         * @param substring 子字符串
         * @return
         *
         */
        setDirtyHandler(handler: (substring: string) => string): void;
        /**
         * 是否有敏感词
         * @param msg	要检测的文字
         * @return 		true为有敏感词，false为没有敏感词
         *
         */
        checkWord: typeof checkWord1;
    };
    export {};
}
/**
 * 是否不做客户端检查
 * 客户端检查的部分，后续统一按下面例子处理
 * @example
 *  if (!noClientCheck) {
 *       if (!$hero.clan) {
 *          return CoreFunction.showClientTips(MsgCodeConst.Code_883);
 *      }
 *  }
 */
declare var noClientCheck: boolean;
interface $gmType {
    /**
     * 切换客户端检查的`开/关`状态
     *
     */
    toggleClientCheck(): any;
}
declare namespace jy {
    /**
     * 错误前缀
     */
    var errorPrefix: string;
    interface ThrowError {
        (msg: string, err?: Error, alert?: boolean): void;
        MaxCount?: number;
        errorMsg?: string[];
    }
    var Log: {
        (...msg: any[]): void;
    };
    /**
     * 抛错
     * @param {string | Error}  msg 描述
     **/
    const ThrowError: ThrowError;
}
declare namespace jy {
    /**
     * 游戏使用区段
     * -1000~-1999
     *
     * @export
     * @enum {number}
     */
    const enum EventConst {
        /**
         * Unit被回收时触发
         */
        UnitRecycle = -1999,
        /**
         * Unit被创建时触发
         */
        UnitCreate = -1998,
        /**
         * Unit添加到舞台时触发
         */
        UnitAddToStage = -1997,
        /**
         * 当render执行时间需要处理2秒+的数据派完
         */
        SlowRender = -1996,
        /**
         * 窗口激活
         */
        ACTIVATE = -1995,
        /**
         * 窗口失去激活
         */
        DEACTIVATE = -1994,
        /**
         * ani 一次播放完成
         */
        AniComplete = -1993,
        /**
         * ani 回收前触发
         */
        AniBeforeRecycle = -1992
    }
}
declare namespace jy {
    interface CfgData {
        /**
         * 特效数据
         *
         * @type {{ [index: string]: AniInfo }}
         * @memberOf CfgData
         */
        ani: {
            [index: string]: AniInfo;
        };
    }
}
/**
 * 游戏的常量的接口定义
 * 子项目自身实现接口
 * @author 3tion
 */
declare namespace jy {
    const enum ResPrefix {
        /**
         * 特效文件夹
         */
        Ani = "a/"
    }
}
declare namespace jy {
    /**
     * 2d游戏的引擎管理游戏层级关系<br/>
     * @author 3tion
     *
     */
    class GameEngine extends egret.EventDispatcher {
        protected static layerConfigs: {
            [index: number]: LayerConfig;
        };
        static instance: GameEngine;
        static init(stage: egret.Stage, ref?: {
            new (stage: egret.Stage): GameEngine;
        }): void;
        static addLayerConfig(id: number, parentid?: number, ref?: new (id: number) => GameLayer): void;
        /**
          * 单位坐标发生变化时调用
          */
        static invalidateSort(): void;
        /**
         * 摄像机，用于处理镜头坐标相关
         */
        camera: Camera;
        protected _viewRect: egret.Rectangle;
        /**
         * 单位的排序是否发生改变
         */
        protected _sortDirty: Boolean;
        /**
         * 单位坐标发生变化时调用
         */
        invalidateSort(): void;
        get viewRect(): egret.Rectangle;
        protected _stage: egret.Stage;
        protected _layers: GameLayer[];
        /**
         * 排序层
         */
        protected _sortedLayers: SortedLayer[];
        /**
         * 获取或创建容器
         */
        getLayer(id: GameLayerID, noAdd?: boolean): GameLayer;
        /**
         *
         * @param {GameLayer} layer 要调整的层级
         * @param {number} newid 新的层级id
         * @param {boolean} [awake=true] 是否执行一次awake
         */
        changeId(layer: GameLayer, newid: number, awake?: boolean): void;
        /**
         * 将指定
         *
         * @param {GameLayerID} layerID
         *
         * @memberOf GameEngine
         */
        sleepLayer(layerID: GameLayerID): void;
        awakeLayer(layerID: GameLayerID): void;
        protected addLayer(layer: GameLayer, cfg?: LayerConfig): void;
        protected addLayerToContainer(layer: GameLayer, container: egret.DisplayObjectContainer): void;
        constructor(stage: egret.Stage);
        protected init(): void;
    }
    /**
     * 游戏中层级标识
     */
    const enum GameLayerID {
        /**
         * Tip层
         * 用于放alert等最高层级
         * 不进行滚轴
         */
        Tip = 9000,
        /**
         * UI层
         * 用于放各种UI
         * 不进行滚轴
         * 在菜单和头像下面，属最底层
         */
        UI = 8000,
        /**
         * 游戏层
         * 人物死亡如果进行颜色变灰，则基于此容器变灰
         */
        Game = 1000,
        /**
         * 游戏蒙版层
         * 用于放流血效果，迷雾效果之类的容器
         * 无鼠标事件
         * 不进行滚轴
         **/
        Mask = 1900,
        /**
         * 相机特效层
         * 用于处理飘雪，飘雨类似效果
         * 无鼠标事件
         * 不进行滚轴
         **/
        TopEffect = 1800,
        /**
         * 游戏滚轴层
         * 下级容器参与滚轴
         */
        GameScene = 1700,
        /**
         * 顶部场景特效
         * 用于放云朵等特效
         * 无鼠标事件
         * 不排序
         */
        CeilEffect = 1790,
        /**
         * 用于放置跟随单位一起的UI，角色血条，角色名字，头衔等
         */
        SortedUI = 1780,
        /**
         * 游戏特效层，
         * 一般盖在人身上的特效放于此层
         * 无鼠标事件
         * 不排序
         */
        GameEffect = 1770,
        /**
         * 参与排序的单位的容器
         * 放人，怪物，会进行排序
         */
        Sorted = 1760,
        /**
         * 底层
         * 放置尸体，光环
         * 会排序
         */
        Bottom = 1750,
        /**
         * 底部场景特效层
         */
        BottomEffect = 1740,
        /**
         * 地图渲染层
         */
        Background = 1730,
        /**
         * 地图预览图
         */
        Mini = 1710,
        /**
         * 地图之下的一层
         */
        UnderMap = 1705
    }
    /**
     * 层级配置
     */
    interface LayerConfig {
        id: number;
        parentid: number;
        ref: new (id: number) => GameLayer;
    }
}
declare namespace jy {
    interface GameLayer extends egret.DisplayObject {
        id: number;
        isShow?: boolean;
    }
    /**
     * GameLayer
     * 用于后期扩展
     */
    class BaseLayer extends egret.Sprite {
        /**
         * 层id
         */
        id: number;
        constructor(id: number);
    }
    /**
     * UI使用的层级，宽度和高度设定为和stage一致
     *
     * @export
     * @class UILayer
     * @extends {GameLayer}
     */
    class UILayer extends BaseLayer {
        get width(): number;
        get height(): number;
    }
    /**
     * 需要对子对象排序的层
     */
    class SortedLayer extends BaseLayer {
        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject;
        /**
         * 进行排序
         */
        sort(): void;
    }
}
declare namespace jy {
    /**
     * 用于SortedLayer排序
     */
    interface IDepth {
        depth: number;
    }
    class DSprite extends egret.Sprite implements IDepth {
        depth: number;
    }
}
declare namespace jy {
    /**
     * 用于处理无方向的动画信息
     * @author 3tion
     *
     */
    class AniInfo extends PstInfo {
        /**
         * 加载状态
         */
        state: RequestState;
        protected _refList: AniRender[];
        url: string;
        uri: string;
        /**
         * 资源加载列队，用于控制加载优先级
         */
        qid?: Res.ResQueueID;
        constructor();
        /**
         * 绑定渲染器
         * @param render
         */
        bind(render: AniRender): void;
        /**
         * 资源加载完成
         */
        dataLoadComplete(item: Res.ResItem): void;
        /**
         * 和渲染器解除绑定
         * @param render
         */
        loose(render: AniRender): void;
        init(key: string, data: any[]): void;
        getResource(uri?: string): UnitResource;
        get actionInfo(): ActionInfo;
    }
}
interface $gmType {
    /**
     * 记录Ani数据
     *
     *
     * @memberOf $gmType
     */
    recordAni(): void;
    /**
     * 是否记录Ani数据
     *
     * @type {boolean}
     * @memberOf $gmType
     */
    _recordAni: boolean;
    /**
     * ani记录
     *
     * @type {{ [index: number]: $gmAniInfo }}
     * @memberOf $gmType
     */
    _aniRecords: {
        [index: number]: $gmAniInfo;
    };
    /**
     * 显示aniRender的记录信息
     *
     * @param {number} time 超过多少时间的进行显示，默认值为0
     *
     * @memberOf $gmType
     */
    showAniRecords(time?: number): void;
    /**
     * 显示残留的aniRender的堆栈信息
     *
     * @param {number} [time]
     *
     * @memberOf $gmType
     */
    showAniStacks(time?: number): void;
}
interface $gmAniInfo {
    /**
     * ani标识
     *
     * @type {number}
     * @memberOf $gmAniInfo
     */
    guid: number;
    /**
     * 堆栈信息
     *
     * @type {string}
     * @memberOf $gmAniInfo
     */
    stack: string;
    /**
     * 启动时间
     *
     * @type {number}
     * @memberOf $gmAniInfo
     */
    time: number;
}
declare namespace jy {
    const enum AniTickMode {
        UseEnterframe = 0,
        Custom = 1
    }
    /**
     * 由于目前特效和渲染器是完全一一对应关系，所以直接做成AniBitmap
     * @author 3tion
     *
     */
    class AniRender extends BaseRender implements IRecyclable {
        /**
         * 当前调用的render
         */
        protected _render: {
            (): any;
        };
        /**
         * 0 初始化，未运行
         * 1 正在运行
         * 2 已回收
         */
        state: AniPlayState;
        /**
         * 非循环动画，播放完毕后的回收策略
         * 默认为全部回收
         */
        recyclePolicy: AniRecyclePolicy;
        /**
         * 循环播放次数
         *
         * @type {number}
         */
        loop?: number;
        /**
         * 事件处理的回调函数
         *
         * @type {{ (event: Key, render: AniRender, now?: number, ...args) }}
         * @memberof AniOption
         */
        handler?: CallbackInfo<{
            (event: Key, render: AniRender, now?: number, ...args: any[]): any;
        }>;
        /**
         * 是否等待纹理数据加载完成，才播放
         *
         * @type {boolean}
         * @memberof AniRender
         */
        waitTexture: boolean;
        /**
         * 资源是否加载完成
         *
         * @type {boolean}
         */
        resOK: boolean;
        /**
         * 播放起始时间
         *
         * @type {number}
         */
        plTime: number;
        /**
         * 特效标识
         */
        readonly guid: number;
        tickMode: AniTickMode;
        /**
         * 获取资源的地址标识
         */
        get uri(): string;
        /**
         * 显示对象
         */
        readonly display: Recyclable<ResourceBitmap>;
        readonly aniInfo: AniInfo;
        constructor();
        /**
         * render方法基于
         */
        protected render(): void;
        /**
         * 处理数据
         *
         * @param {number} now 时间戳
         */
        doData(now: number): void;
        renderFrame(frame: FrameInfo, now: number): void;
        /**
         * 派发事件
         * @param event     事件名
         * @param now       当前时间
         */
        protected dispatchEvent(event: string, now: number): void;
        doComplete(now: number): void;
        isComplete(info: ActionInfo): boolean;
        callback(): void;
        /**
         * 播放
         */
        play(now?: number): void;
        private checkPlay;
        onRecycle(): void;
        onSpawn(): void;
        protected onStage(e: egret.Event): void;
        init(aniInfo: AniInfo, display: Recyclable<ResourceBitmap>, guid: number): void;
        /***********************************静态方法****************************************/
        /**
         * 获取ANI动画
         *
         * @static
         * @param {string} uri    动画地址
         * @param {AniOption} [option] 动画的参数
         * @returns (description)
         */
        static getAni(uri: string, option?: AniOption, qid?: Res.ResQueueID): Recyclable<AniRender>;
        /**
         * 获取正在运行的AniRender
         * @param guid  唯一标识
         */
        static getRunningAni(guid: number): Recyclable<AniRender>;
        /**
         * 回收某个特效
         * @param {number} guid AniRender的唯一标识
         */
        static recycle(guid: number): void;
    }
    interface AniOption {
        guid?: number;
        /**
         * 坐标集合
         * 如果同时配置此值和x，优先取此值作为坐标X
         * 如果同时配置此值和y，优先取此值作为坐标Y
         * @type {Point}
         * @memberof AniOption
         */
        pos?: Point;
        /**
         * 坐标X
         *
         * @type {number}
         * @memberof AniOption
         */
        x?: number;
        /**
         * 坐标Y
         *
         * @type {number}
         * @memberof AniOption
         */
        y?: number;
        /**
         * 容器，如果配置此值，则自动将视图加入到容器中
         *
         * @type {egret.DisplayObjectContainer}
         * @memberof AniOption
         */
        parent?: egret.DisplayObjectContainer;
        /**
         * 有parent此值才有意义
         * 当有此值时，使用 addChildAt添加
         * @type {number}
         * @memberof AniOption
         */
        childIdx?: number;
        /**
         * 是否初始停止播放
         *
         * @type {boolean}
         * @memberof AniOption
         */
        stop?: boolean;
        /**
         * 循环播放次数
         * 如果设置此值，不按原始数据的 isCircle进行播放
         *
         * @type {number}
         * @memberof AniOption
         */
        loop?: number;
        /**
         *  事件处理的回调函数
         *
         * @type {CallbackInfo<{ (event: Key, render: AniRender, now?: number, ...args) }>}
         * @memberof AniOption
         */
        handler?: CallbackInfo<{
            (event: Key, render: AniRender, now?: number, ...args: any[]): any;
        }>;
        /**
         * ani回收策略
         *
         * @type {AniRecyclePolicy}
         * @memberof AniOption
         */
        recyclePolicy?: AniRecyclePolicy;
        /**
         *
         * 是否等待纹理加载完，才播放
         * @type {boolean}
         * @memberof AniOption
         */
        waitTexture?: boolean;
        /**
         * 起始帧
         * 如果是`循环` loop为true，如果起始帧大于总帧数，则对总帧数取模
         * 否则不播放
         *
         * @type {number}
         * @memberof AniOption
         */
        start?: number;
        /**
         * 缩放，默认为 1
         */
        scale?: number;
    }
}
declare namespace jy {
    /**
     * 绘图数据
     *
     * @interface IDrawInfo
     */
    interface IDrawInfo {
        /**原始动作索引 */
        a: number;
        /**原始方向索引 */
        d: number;
        /**原始帧数索引 */
        f: number;
    }
    /**
     * 帧数据
     *
     * @interface FrameInfo
     * @extends {IDrawInfo}
     */
    interface FrameInfo extends IDrawInfo {
        /**和下一帧间隔索引 */
        t: number;
        /**事件 */
        e?: string;
    }
    /**
     * 动作数据
     *
     * @interface ActionInfo
     */
    interface ActionInfo {
        /**
         * 动作标识
         */
        key: number;
        /**
         * 帧列表信息
         *
         * @type {FrameInfo[]}
         */
        frames: FrameInfo[];
        /**
         * 是否为循环动作
         */
        isCircle?: boolean;
        /**
         * 动画默认的总时间
         */
        totalTime: number;
    }
    /**
     * Ani播放状态
     *
     * @enum {number}
     * @author 3tion
     */
    const enum AniPlayState {
        /**
         * 待机
         */
        Standby = 0,
        /**
         * 播放中
         */
        Playing = 1,
        /**
         * 播放完毕
         */
        Completed = 2,
        /**
         * 已回收
         */
        Recycled = 3
    }
    /**
     * AniRender的回收策略
     *
     * @export
     * @enum {number}
     */
    const enum AniRecyclePolicy {
        /**
         * 都不回收
         */
        None = 0,
        /**
         * 回收显示对象
         */
        RecycleDisplay = 1,
        /**
         * 回收Render
         */
        RecycleRender = 2,
        /**
         * 全部回收
         */
        RecycleAll = 3
    }
    /**
     * 获取帧数据
     * 为数组的顺序："a", "f", "t", "e", "d"
     * @param {*} data 如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100
     * @returns
     */
    function getFrameInfo(data: any): FrameInfo;
    /**
     * 获取动作数据
     *
     * @param {any} data
     * @param {number} key
     * @returns
     */
    function getActionInfo(data: any, key: number): ActionInfo;
    /**
     * 获取自定义动作
     * 如果无法获取对应属性的数据，会使用默认值代替
     * a: 0, d: -1, f: 0, t: 100
     * @static
     * @param {any[]} actions 动作序列  如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100
     * @param {number} [key] 动作标识，需要使用整数
     * @return {CustomAction}   自定义动作
     */
    function getCustomAction(actions: any[], key?: number): ActionInfo;
}
declare namespace jy {
    /**
     * 资源显示用位图
     */
    class ResourceBitmap extends egret.Bitmap implements IRecyclable, IDepth {
        res: UnitResource;
        /**
         * z方向的坐标
         *
         * @type {number}
         */
        z: number;
        get depth(): number;
        /**
         * 当前资源是否成功渲染
         *
         * @param {IDrawInfo} drawInfo
         * @param {number} now
         * @returns
         * @memberof ResourceBitmap
         */
        draw(drawInfo: IDrawInfo, now: number): boolean;
        onRecycle(): void;
    }
}
declare namespace jy {
    /**
     * 拆分的资源
     * @author 3tion
     */
    class SplitUnitResource implements IResource {
        /**
        * 资源id
        */
        readonly uri: string;
        readonly url: string;
        qid: Res.ResQueueID;
        /**
         * 资源最后使用时间
         *
         * @type {number}
         */
        lastUseTime: number;
        /**
         * 资源加载状态
         */
        state: RequestState;
        /**
         * 图片按动作或者方向的序列帧，装箱处理后的图片位图资源
         */
        bmd: egret.BitmapData;
        /**
         * 关联的纹理
         */
        textures: egret.Texture[];
        get isStatic(): boolean;
        constructor(uri: string, url: string);
        /**
         * 绑定纹理集
         *
         * @param {{ [index: number]: egret.Texture[][] }} textures (description)
         * @param {number[]} adKeys (description)
         */
        bindTextures(textures: {
            [index: number]: egret.Texture[][];
        }, adKey: ADKey): void;
        /**
         * 绑定纹理
         */
        bindTexture(tex: egret.Texture): void;
        load(): void;
        /**
         * 资源加载完成
         */
        loadComplete(item: Res.ResItem): void;
        dispose(): void;
    }
}
/**
 * @author 3tion
 */
declare namespace jy {
    const enum UnitResourceConst {
        /**
         * 单配置文件的路径
         */
        CfgFile = "d.json"
    }
    /**
     * 单位资源<br/>
     * 图片按动作或者方向的序列帧，装箱处理后的图片位图资源<br/>
     * 以及图片的坐标信息
     */
    class UnitResource {
        /**
         * 资源标识
         */
        key: string;
        /**
         * 加载列队
         */
        qid?: Res.ResQueueID;
        /**
         * 占位用的纹理
         */
        placehoder: egret.Texture;
        /**
         * 纹理的配置文件的加载地址
         */
        readonly url: string;
        readonly uri: string;
        /**
         * 资源打包分隔信息
         */
        readonly pst: PstInfo;
        state: RequestState;
        /**
         * 获取数据
         */
        private _datas;
        /**
         * 最大宽度
         */
        readonly width: number;
        /**
         * 最大高度
         */
        readonly height: number;
        constructor(key: string, pstInfo: PstInfo);
        /**
         * 解析数据
         */
        decodeData(data: {}): void;
        /**
         * 加载数据
         */
        loadData(): void;
        /**
         * 资源加载完成
         */
        dataLoadComplete(item: Res.ResItem): void;
        /**
         * 将资源渲染到位图容器中
         *
         * @param {egret.Bitmap} bitmap 要被绘制的位图
         * @param {IDrawInfo} drawInfo  绘制信息
         * @param {number} now 当前时间戳
         * @returns {boolean} true 表示绘制成功
         *                    其他情况标识绘制失败
         * @memberof UnitResource
         */
        draw(bitmap: egret.Bitmap, drawInfo: IDrawInfo, now: number): boolean;
        /**
         * 根据 `动作``方向``帧数`获取纹理数据
         * @param info
         */
        getTexture(info: IDrawInfo): egret.Texture;
        loadRes(direction: number, action: number): SplitUnitResource;
        noRes(uri: string, resKey: string): SplitUnitResource;
        getUri(direction: number, action: number): string;
        getUri2(resKey: string): string;
        getUrl(uri: string): string;
        isResOK(direction: number, action: number): boolean;
        /**
         * 遍历Res所有资源
         * @param { (uri: string, adKey: number): any } forEach 如果 forEach 方法返回 真 ，则停止遍历
         */
        checkRes(forEach: {
            (uri: string, adKey: number): any;
        }): void;
    }
}
declare namespace jy {
    /**
     * 相机
     * @author 3tion
     *
     */
    class Camera extends egret.HashObject {
        /**
         * 可视区域大小
         */
        protected _rect: egret.Rectangle;
        protected _lx: number;
        protected _ly: number;
        protected _lw: number;
        protected _lh: number;
        /**
         * 是否需要横向滚动
         *
         * @protected
         * @memberof Camera
         */
        protected _hScroll: boolean;
        /**
         *
         * 是否需要纵向滚动
         *
         * @protected
         * @memberof Camera
         */
        protected _vScroll: boolean;
        /**
         * 镜头要跟随的目标
         */
        protected _host: {
            x: number;
            y: number;
        };
        private _lastPos;
        protected _changed: boolean;
        get changed(): boolean;
        /**
         * 标记已经改变完
         */
        change(): void;
        constructor(width?: number, height?: number);
        /**
         * 强制设置为改变
         * 用于地图切换时，坐标不发生变化的情况
         *
         */
        invalidate(): void;
        /**
         * 相机跟随一个可视对象
         * @param target 镜头要跟随的目标
         */
        lookat(target: Point): Boolean;
        /**
         * 获取当前镜头绑定的单位
         */
        get host(): {
            x: number;
            y: number;
        };
        /**
         * 设置相机的可视区域宽度和高度
         * @param width 可视区宽
         * @param height 可视区高
         */
        setSize(width: number, height: number): this;
        /**
         * 设置限制范围
         *
         * @param {number} [width=Infinity]
         * @param {number} [height=Infinity]
         * @param {number} [x=0]
         * @param {number} [y=0]
         * @returns
         * @memberof Camera
         */
        setLimits(width?: number, height?: number, x?: number, y?: number): this;
        protected check(): void;
        /**
         * 将相机移动到指定坐标
         */
        moveTo(x: number, y: number): this;
        /**
         * 获取相机显示区域
         */
        get rect(): egret.Rectangle;
    }
    /**
     * 获取坐标点的hash值
     *
     * @export
     * @param {Point} pos
     * @returns
     */
    function getPosHash(pos: Point): number;
    function getPosHash2(x: number, y: number): number;
}
declare namespace jy {
    /**
     * 旋转的屏幕抖动
     * 角度统一从0开始，正向或者逆向旋转，振幅从最大到0
     *
     * @export
     * @class CircleShake
     * @extends {BaseShake}
     * @author 3tion
     */
    class CircleShake extends BaseShake {
        /**
         * 结束的弧度
         * @private
         * @type {number}
         */
        private _eR;
        /**
         * 振幅
         */
        private _swing;
        /**
         * 单位时间弧度增量
         */
        private _dRad;
        /**
         * 单位时间振幅增量
         */
        private _dSwing;
        /**
         *
         *
         * @param {number} swing        最大振幅
         * @param {number} endRad       结束角度
         * @param {number} [cx]         单位X方向基准值      一般为单位初始值
         * @param {number} [cy]         单位Y方向基准值      一般为单位初始值
         * @param {number} [time=150]   单圈的时间，震动总时间为  endRad / Math.PI2 * time
         * @returns
         */
        init(swing: number, endRad: number, cx?: number, cy?: number, time?: number): this;
        tick(duration: number, outPt: {
            x: number;
            y: number;
        }): void;
    }
}
declare namespace jy {
    /**
     * 带方向的震动
     *
     * @export
     * @class DirectionShake
     * @extends {BaseShake}
     */
    class DirectionShake extends BaseShake {
        /**
         * 振幅的增量
         *
         * @private
         * @type {number}
         */
        private _dSwing;
        private _count;
        /**
         * 震动方向的 Math.cos
         */
        private _cos;
        /**
         * 震动方向的 Math.sin
         */
        private _sin;
        /**
         * 振幅的单位时间增量
         */
        private _dRad;
        /**
         *
         * 初始化一个有方向的Shake
         * @param {number} fx           起点x
         * @param {number} fy           起点y
         * @param {number} tx           目标x
         * @param {number} ty           目标y
         * @param {number} [cx]         单位X方向基准值      一般为单位初始值
         * @param {number} [cy]         单位Y方向基准值      一般为单位初始值
         * @param {number} [swing=30]   最大振幅，振幅会按次数衰减到0
         * @param {number} [count=3]    震动次数，此次数指的是 单摆摆动的从`最低点`到`最高点`再回到`最低点`，  即一次完整的摆动 下->左->下   或者 下->右->下
         * @param {number} [time=90]    单次震动的时间
         */
        init1(fx: number, fy: number, tx: number, ty: number, cx?: number, cy?: number, swing?: number, count?: number, time?: number): void;
        /**
         * 初始化一个有方向的Shake
         * @param {number} rad              方向(弧度)			使用Math.atan2(toY-fromY,toX-fromX)
         * @param {number} [cx]             单位X方向基准值      一般为单位初始值
         * @param {number} [cy]             单位Y方向基准值      一般为单位初始值
         * @param {number} [swing=30]       最大振幅，振幅会按次数衰减到0
         * @param {number} [count=3]        震动次数，此次数指的是 单摆摆动的从`最低点`到`最高点`再回到`最低点`，  即一次完整的摆动 下->左->下   或者 下->右->下
         * @param {number} [time=90]        单次震动的时间
         */
        init2(rad: number, cx?: number, cy?: number, swing?: number, count?: number, time?: number): void;
        init(cos: number, sin: number, cx?: number, cy?: number, swing?: number, count?: number, time?: number): this;
        tick(duration: number, outPt: {
            x: number;
            y: number;
        }): void;
    }
}
declare namespace jy {
    /**
     * 旋转抖动
     * 屏幕朝顺时针/逆时针方向抖动一定角度
     * 抖动从0绝对距离的偏移开始，当中间角度时，达到最大偏移值，最后回到0偏移值
     * 偏移:swing*( sin 0) 角度：startRad ---------->偏移:swing*( sin Math.PI/2) 角度： (startRad + endRad)/2 -------------->偏移:swing*( sin Math.PI) 角度： endRad
     *
     * @export
     * @class RotateShake
     * @extends {BaseShake}
     * @author 3tion
     */
    class RotateShake extends BaseShake {
        /**
         * 起始弧度
         *
         * @private
         * @type {number}
         */
        private _sR;
        /**
         * 结束弧度
         *
         * @private
         * @type {number}
         */
        private _eR;
        /**
         * 单位时间弧度增量
         *
         * @private
         * @type {number}
         */
        private _dRad;
        /**
         * 最大振幅
         *
         * @private
         * @type {number}
         */
        private _swing;
        /**
         *
         *
         * @param {number} startRad     起始角度
         * @param {number} endRad       结束角度
         * @param {number} [swing=30]   最大振幅
         * @param {number} [cx]         单位X方向基准值      一般为单位初始值
         * @param {number} [cy]         单位Y方向基准值      一般为单位初始值
         * @param {number} [total=150]  总时间
         * @returns
         */
        init(startRad: number, endRad: number, swing?: number, cx?: number, cy?: number, total?: number): this;
        tick(duration: number, outPt: {
            x: number;
            y: number;
        }): void;
    }
}
declare namespace jy {
    /**
     * 屏幕抖动管理器
     *
     * @export
     * @class ScreenShakeManager
     */
    class ScreenShakeManager {
        /**
         * 释放可震动
         *
         * @type {boolean}
         */
        shakable: boolean;
        /**
         * 当前的震动
         *
         * @private
         * @type {Shake}
         */
        private _cur;
        private _limits;
        private _pt;
        setLimits(width?: number, height?: number, x?: number, y?: number): this;
        private _tmp;
        /**
         *
         * 开始时间
         * @protected
         * @type {number}
         */
        protected _st: number;
        /**
         * 开始一个新的震动
         *
         * @template T
         * @param {T} shake
         * @returns T
         */
        start<T extends Shake>(shake: T): T;
        tick(): boolean;
    }
}
declare namespace jy {
    /**
     * 振动的接口实现
     *
     * @export
     * @interface Shake
     * @author 3tion
     */
    interface Shake {
        /**
         *
         * 总时间
         * @type {number}
         * @memberOf Shake
         */
        total: number;
        /**
         * 设置振动的目标
         *
         * @param {ShakeTarget} target
         *
         * @memberOf Shake
         */
        setShakeTarget(target: ShakeTarget): Shake;
        readonly target: ShakeTarget;
        /**
         *
         * 震动开始
         *
         * @memberOf Shake
         */
        start(): void;
        /**
         *  执行更新
         *
         * @param {number} duration
         * @param {{ x: number, y: number }} outPt
         *
         * @memberOf Shake
         */
        tick(duration: number, outPt: {
            x: number;
            y: number;
        }): any;
        /**
         * 强行结束
         */
        end(): void;
    }
    /**
     * 振动的目标
     *
     * @export
     * @interface ShakeTarget
     */
    interface ShakeTarget {
        x: number;
        y: number;
    }
}
declare namespace jy {
    /**
     * 异步工具类，用于加方法兼听
     * @author 3tion
     *
     */
    class AsyncHelper {
        /**
         * 是否已经处理完成
         */
        isReady: boolean;
        protected _cbs: $CallbackInfo[];
        /**
         * 异步数据已经加载完毕
         */
        readyNow(): void;
        /**
         * 检查是否完成,并让它回调方法
         *
         * @param {Function} handle 处理函数
         * @param {*} thisObj this对象
         * @param {any[]} args 函数的参数
         */
        addReadyExecute(handle: Function, thisObj?: any, ...args: any[]): any;
    }
}
declare namespace jy {
    /**
     * 依赖项的辅助类
     * @author 3tion
     *
     */
    class DependerHelper {
        protected _unreadyDepender: IAsync[];
        /**
         * 处理是谁使用了依赖项
         */
        protected _host: any;
        /**
         * 回调函数
         */
        protected _callback: Function;
        protected _args: any[];
        protected _uncheck: boolean;
        /**
         *
         * @param host          调用项
         * @param callback      回调函数         回调函数的thisObj会使用host来处理
         * @param thisObj       回调函数的this
         * @param args
         */
        constructor(host: any, callback: Function, ...args: any[]);
        /**
         * 添加依赖
         * @param async
         */
        addDepend(async: IAsync): void;
        /**
         * 一个依赖项处理完成
         */
        protected readyHandler(async: IAsync): void;
        /**
         * 检查依赖项是否已经完成，会在下一帧做检查
         */
        check(): void;
        /**
         * 检查依赖项是否已经完成
         */
        protected _check(): void;
    }
}
declare namespace jy {
    function isIAsync(instance: any): instance is IAsync;
    /**
     * 异步接口
     * @author  3tion
     *
     */
    interface IAsync {
        /**
         * 方便检查是否实现了IAsync接口
         */
        addReadyExecute(handle: Function, thisObj: any, ...args: any[]): any;
        /**
         * 是否已经好了
         */
        isReady: boolean;
        /**
         * 开始尝试同步
         */
        startSync(): any;
    }
}
declare namespace jy {
    /**
     * 依赖其他数据的<br/>
     * 依赖其他数据的东西，自身一定是异步的
     * @author 3tion
     *
     */
    interface IDepender extends IAsync {
        /**
         * 方便检查是否实现了IDepender
         */
        addDepend(async: IAsync): any;
    }
}
declare namespace jy {
    /**
     * mvc使用的事件区段
     * -999~ -200
     *
     * @export
     * @enum {number}
     */
    const enum EventConst {
        /**
         * 通知角标变更
         * data {BadgeInfo}
         */
        Notification = -999,
        /**
         * 模块检查器初始化完毕
         */
        MODULE_CHECKER_INITED = -998,
        /**
         * 尝试调用某个功能
         * data 为功能ID
         */
        MODULE_TRY_TOGGLE = -997,
        /**
        * 有功能，服务端要求临时关闭
        * data 为功能ID
        */
        MODULE_SERVER_CLOSE = -996,
        /**
        * 有临时关闭的功能，服务端要求再打开
        * data 为功能ID
        */
        MODULE_SERVER_OPEN = -995,
        /**
         * 模块显示状态发生改变发生改变
         * data 为剩余未显示的按钮数量
         */
        MODULE_SHOW_CHANGED = -994,
        /**
         * 模块的开启状态发生改变
         * data 为剩余未开启的按钮数量
         */
        MODULE_OPEN_CHANGED = -993,
        /**
         * 有模块需要检查是否会造成显示变化或者功能开启发生变更
         */
        MODULE_NEED_CHECK_SHOW = -992,
        /**
         * 有模块不符合显示的条件
         * data 为功能ID
         */
        MODULE_NOT_SHOW = -991,
        /**
         * 有模块显示了
         */
        MODULE_SHOW = -990,
        /**
         * Mediator准备好了
         */
        MediatorReady = -989
    }
}
declare namespace jy {
    /**
     * 代码构建类，用于注册代码
     * @author 3tion
     */
    class Facade extends egret.EventDispatcher {
        /**
         * 模块脚本的加载路径
         */
        static Script: string;
        /**
         *
         * 获取内部注册的Proxy或者Mediator用于全局注册的名字
         * @static
         * @param {{ new (): any }} inlineRef inlineRef 内部注册的Proxy或者Mediator
         * @param {string} [className]  类名
         * @returns string  内部注册的Proxy或者Mediator用于全局注册的名字
         *
         * @memberOf Facade
         */
        static getNameOfInline(inlineRef: {
            new (): any;
        }, className?: string): string;
        /**
         * 存储的数据Proxy
         */
        protected _proxys: {
            [index: string]: ScriptHelper<Proxy>;
        };
        /**
         * 存储的Mediator
         */
        protected _mediators: {
            [index: string]: ScriptHelper<Mediator>;
        };
        /**
         * 模块
         */
        protected _scripts: {
            [index: string]: ModuleScript;
        };
        /**
         * 模块管理器
         */
        protected _mm: ModuleManager;
        constructor();
        /**
         * 绑定模块管理器
         */
        bindModuleManager(mm: ModuleManager): void;
        /**
         * 模块管理器
         *
         * @readonly
         *
         * @memberOf Facade
         */
        get mm(): ModuleManager;
        protected _removeHost(name: Key, dict: {
            [index: string]: ScriptHelper<FHost>;
        }): FHost;
        /**
         * 移除面板控制器
         */
        removeMediator(mediatorName: Key): FHost;
        /**
         * 移除模块
         * 如果模块被其他模块依赖，此方法并不能清楚依赖引用
         */
        removeProxy(proxyName: Key): FHost;
        /**
         *
         * 注册内部模块
         * @param {{ new (): Proxy }} ref Proxy创建器
         * @param {string} [proxyName] 模块名称
         * @param {boolean} [async=false] 是否异步初始化，默认直接初始化
         */
        registerInlineProxy(ref: {
            new (): Proxy;
        }, proxyName?: Key, async?: boolean): void;
        /**
         *
         * 注册内部Mediator模块
         * @param {{ new (): Mediator }} ref Mediator创建器
         * @param {string} [mediatorName]   注册的模块名字
         */
        registerInlineMediator(ref: {
            new (): Mediator;
        }, mediatorName: Key): void;
        regConfig<T extends FHost>(clazz: string | {
            new (): T;
        }, key: Key, dict: {
            [key: string]: ScriptHelper<T>;
        }, url?: string, scriptid?: string): void;
        private getOrCreateScript;
        /**
         * 获取Proxy
         *
         * @param {Key} proxyName proxy的名字
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        getProxy(proxyName: Key, callback?: {
            (proxy: Proxy, ...args: any[]): any;
        }, thisObj?: any, ...args: any[]): FHost;
        /**
         * 以同步方式获取proxy，不会验证proxy是否加载完毕
         * 有可能无法取到proxy
         *
         * @param {Key} proxyName
         * @returns
         *
         * @memberOf Facade
         */
        getProxySync(proxyName: Key): Proxy;
        /**
         * 获取Mediator
         *
         * @param {Key} moduleID 模块ID
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        getMediator(moduleID: Key, callback?: {
            (mediator: Mediator, ...args: any[]): any;
        }, thisObj?: any, ...args: any[]): FHost;
        /**
         * 以同步方式获取Mediator，不会验证Mediator是否加载完毕
         * 有可能无法取到Mediator
         *
         * @param {Key} moduleID
         * @returns
         *
         * @memberOf Facade
         */
        getMediatorSync(moduleID: Key): Mediator;
        private _solveScriptCallback;
        private _getHost;
        /**
         *
         * 打开/关闭指定模块
         * @param {(Key)} moduleID      模块id
         * @param {ToggleState} [toggleState]      0 自动切换(默认)<br/>  1 打开模块<br/> -1 关闭模块<br/>
         * @param {boolean} [showTip=true]          是否显示Tip
         * @param {ModuleParam} [param] 模块参数
         *
         * @memberOf Facade
         */
        toggle(moduleID: Key, toggleState?: ToggleState, showTip?: boolean, param?: ModuleParam): void;
        /**
         *
         * 执行某个模块的方法
         * @param {string} moduleID     模块id
         * @param {boolean} showTip     是否显示Tip，如果无法执行，是否弹出提示
         * @param {string} handlerName  执行的函数名
         * @param {boolean} [show]      执行时，是否将模块显示到舞台
         * @param {any[]} args            函数的参数列表
         * @returns
         */
        executeMediator(moduleID: Key, showTip: boolean, handlerName: string, show?: boolean, ...args: any[]): FHost;
        /**
         * 不做验证，直接执行mediator的方法
         * 此方法只允许ModuleHandler使用
         * @private
         * @param name          模块id
         * @param showTip       如果无法执行，是否弹出提示
         * @param handlerName   执行的函数名
         * @param args
         */
        $executeMediator(moduleID: string, handlerName: string, ...args: any[]): FHost;
        protected _executeMediator(mediator: Mediator, handlerName: string, ...args: any[]): void;
        protected _executeAndShowMediator(mediator: Mediator, handlerName: string, ...args: any[]): void;
        /**
         * 执行Proxy的方法
         * @param name     proxy名字
         * @param handlerName   函数名字
         * @param args          参数列表
         */
        executeProxy(proxyName: Key, handlerName: string, ...args: any[]): FHost;
        protected _executeProxy(proxy: Proxy, handlerName: string, ...args: any[]): void;
        /**
         * 正在注入的对象
         */
        protected _indecting: any[];
        /**
         * 注入数据
         */
        inject(obj: any): void;
        /**
         * 用于子项目扩展
         * @param obj
         */
        doInject(obj: any): void;
    }
    interface ScriptHelper<T> {
        /**
         * 脚本id，空的id表示是主脚本
         */
        scriptid: string;
        /**
         * 主体的类名字
         */
        className: string;
        /**
         * 名字
         */
        name: Key;
        /**
         * 数据主体
         */
        host: T;
        /**
         * 创建器
         */
        ref?: {
            new (): T;
        };
        url?: string;
    }
    const facade: Facade;
    /**
     * 等其他Proxy加载好后回调
     *
     * @protected
     * @param {(Key)} proxyName
     * @param {{ (proxy: Proxy, args?: any[]) }} callback
     * @param {*} thisObj
     * @param {any} args
     *
     * @memberOf FHost
     */
    function proxyCall(proxyName: Key, callback?: {
        (proxy: Proxy, ...args: any[]): any;
    }, thisObj?: any, ...args: any[]): Proxy;
    /**
     * 执行Proxy的方法
     * @param name     proxy名字
     * @param handlerName   函数名字
     * @param args          参数列表
     */
    function proxyExec(proxyName: Key, handlerName: string, ...args: any[]): Proxy;
    /**
     * 等其他Mediator加载好后回调
     *
     * @protected
     * @param {(Key)} mediatorName
     * @param {{ (mediator: Mediator, args?: any[]) }} callback
     * @param {*} thisObj
     * @param {any} args
     *
     * @memberOf FHost
     */
    function mediatorCall(mediatorName: Key, callback?: {
        (mediator: Mediator, ...args: any[]): any;
    }, thisObj?: any, ...args: any[]): Mediator;
    /**
     *
     * 执行某个模块的方法
     * @param {string} moduleID     模块id
     * @param {boolean} showTip     是否显示Tip，如果无法执行，是否弹出提示
     * @param {string} handlerName  执行的函数名
     * @param {boolean} [show]      执行时，是否将模块显示到舞台
     * @param {any[]} args            函数的参数列表
     * @returns
     */
    function mediatorExec(moduleID: Key, showTip: boolean, handlerName: string, show?: boolean, ...args: any[]): Mediator;
    /**
     * 全局抛事件
     *
     * @export
     * @param {Key} type     事件类型
     * @param {*} [data]        数据
     */
    function dispatch(type: Key, data?: any): void;
    /**
     *
     * 打开/关闭指定模块
     * @param {(Key)} moduleID      模块id
     * @param {ToggleState} [toggleState]      0 自动切换(默认)<br/>  1 打开模块<br/> -1 关闭模块<br/>
     * @param {boolean} [showTip=true]          是否显示Tip
     * @param {ModuleParam} [param] 模块参数
     *
     * @memberOf Facade
     */
    function toggle(moduleID: Key, toggleState?: ToggleState, showTip?: boolean, param?: ModuleParam): void;
    /**
     *
     * 添加事件监听
     * @export
     * @param {(Key)} type
     * @param {Function} listener
     * @param {*} thisObj
     * @param {number} [priority]
     */
    function on<T>(type: Key, listener: {
        (this: T, e?: egret.Event): any;
    }, thisObj?: T, priority?: number): void;
    /**
     * 单次监听事件
     *
     * @export
     * @template T
     * @param {Key} type
     * @param {{ (this: T, e?: egret.Event) }} listener
     * @param {T} [thisObj]
     * @param {number} [priority]
     */
    function once<T>(type: Key, listener: {
        (this: T, e?: egret.Event): any;
    }, thisObj?: T, priority?: number): void;
    /**
     *
     * 移除事件监听
     * @static
     * @param {Key} type
     * @param {Function} listener
     * @param {*} [thisObject]
     */
    function off(type: Key, listener: Function, thisObject?: any): void;
    /**
     * 检查是否有全局监听
     *
     * @export
     * @param {Key} type
     * @returns
     */
    function hasListen(type: Key): boolean;
    const enum ToggleState {
        HIDE = -1,
        AUTO = 0,
        SHOW = 1
    }
}
declare namespace jy {
    /**
     *
     * @author
     *
     */
    interface IAsyncPanel extends IAsync, IModulePanel {
    }
}
declare namespace jy {
    /**
     * 视图控制器，持有视图<br/>
     * 持有Proxy，主要监听视图和Proxy的事件，变更面板状态<br/>
     * @author 3tion
     *
     */
    abstract class Mediator extends ViewController {
        /**
         * 视图加载完成
         */
        protected viewReady: boolean;
        /**
         * 视图
         */
        $view: IModulePanel;
        /**
         *  获取视图
         */
        get view(): IModulePanel;
        set view(value: IModulePanel);
        /**
         * 开始尝试同步
         */
        startSync(): void;
        /**
         *
         * 视图加载完毕
         * @protected
         */
        protected viewComplete(): void;
        /**
         * Creates an instance of Mediator.
         *
         * @param {string | number} moduleID 模块ID
         */
        constructor(moduleID: string | number);
        /**
         * 用于写加载数据和加载创建视图的代码
         *
         * @protected
         * @abstract
         */
        protected init?(): any;
        viewCheck(viewReady: boolean): boolean;
        /**
         *
         * 依赖项完毕后检查
         * @protected
         * @returns
         */
        protected dependerReadyCheck(): void;
        /**
         * 关闭Mediator控制的面板
         *
         */
        hide(...arg: any[]): any;
    }
}
declare namespace jy {
    /**
     * 模块脚本，后续开发模块，分成多个模块文件
     * @author 3tion
     *
     */
    class ModuleScript {
        constructor();
        /**
        * 脚本id
       */
        id: string;
        /**
         * 脚本路径
         *
         * @type {string}
         */
        url?: string;
        /**
         * 加载状态
         */
        state: RequestState;
        /**
         * 回调列表
         */
        callbacks: CallbackInfo<Function>[];
        /**
         * 已异步方式加载
         */
        load(): void;
        /**
         * 配置加载完成之后
         */
        protected onScriptLoaded(isError?: boolean): void;
    }
}
declare namespace jy {
    /**
     * 用于和服务端通信的数据
     * @author 3tion
     */
    abstract class Service extends Proxy {
        _ns: NetService;
        constructor(name: string | number);
        onRegister(): void;
        _startSync(): void;
        /**
         * 用于新版本的自动生成代码的注册
         * [cmd,msgType,handler,cmd1,msgType1,handler1,cmd2,msgType2,handler2,....cmdN,msgTypeN,handlerN]
         * @protected
         * @param {any} args
         */
        protected reg(...args: any[]): any;
        /**
         * 注册消息引用
         *
         * @protected
         * @param {string | number} ref 消息实例的引用
         * @param cmds 注册的指令
         */
        protected regMsg(ref: string | number, ...cmds: any[]): void;
        /**
         * 注册消息处理函数
         *
         * @protected
         * @param {{ (data: NetData): void }} handler   消息处理函数
         * @param {number[]} cmds 注册的指令
         */
        protected regHandler(handler: {
            (data: NetData): void;
        }, ...cmds: number[]): void;
        protected removeHandler(cmd: number, handler: any): void;
        /**
         * 发送消息
         *
         * @protected
         * @param {number} cmd 指令
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         * @param {number} [limit=200] 最短发送时间
         */
        protected send(cmd: number, data?: any, msgType?: string | number, limit?: number): void;
    }
}
declare namespace jy {
    interface AwakeCheck {
        awakeCheck?: () => boolean;
    }
    /**
     * 将Mediator转换为IStateSwitcher
     *
     * @export
     * @param {Mediator} mediator
     * @returns {(Mediator & IStateSwitcher & AwakeCheck)}
     */
    function transformToStateMediator(mediator: Mediator, awakeBy?: {
        (id: number): void;
    }, sleepBy?: {
        (id: number): void;
    }): Mediator & IStateSwitcher & AwakeCheck;
}
declare namespace jy {
    /**
     * 功能配置的基类
     * @author 3tion
     */
    class BaseMCfg {
        /**
         * 当前显示状态
         */
        showState: ModuleShowState;
        /**
         * 服务器认为此功能开放
         */
        serverOpen: boolean;
        /**
         * 显示限制数据
         */
        showlimits: any[];
        /**
         * 使用限制数据
         */
        limits: any[];
        /**
         *
         * 子模块的id列表
         * @type {string[]}
         */
        children: string[];
        /**
         * 当模块开启时绑定的回调函数
         */
        onOpen?: $CallbackInfo[];
        constructor();
        protected init(from?: any): void;
    }
}
declare namespace jy {
    /**
     * 限制检查器的基类
     * @author 3tion
     *
     */
    interface ILimitChecker {
        /**
         * 是否通过检查
         * @param data		数据
         * @param showtip	是否显示tip
         * @return
         *
         */
        check(data: any, showtip: boolean): boolean;
    }
}
declare namespace jy {
    /**
     * 模块配置数据
     * @author 3tion
     *
     */
    interface IModuleCfg {
        /**
         *id
         */
        id: string | number;
        /**
         * 模块对应面板，放置的容器标识
         */
        containerID: number;
        /**
         * 当前显示状态
         */
        showState: ModuleShowState;
        /**
         * 服务器认为此功能开放
         */
        serverOpen: boolean;
        /**
         * 显示类型
         */
        showtype: number;
        /**
         * 显示限制数据
         */
        showlimits: any[];
        /**
         * 功能使用限制
         */
        limittype: number;
        /**
         * 使用限制数据
         */
        limits: any[];
        /**
         *执行类型
         */
        type: number;
        /**
         *参数1
         */
        data1: any;
        /**
         *参数2
         */
        data2: any;
        /**
         *参数3
         */
        data3: any;
        /**
         *参数4
         */
        data4: any;
        /**
         *模块名字
         */
        name: string;
        /**
         * 描述
         */
        des: string;
        /**
         * 是否关闭此功能（不开放）
         * 0/不填 正常开放
         * 1 暂未开放
         * 2 不开放/不显示按钮
         *
         */
        close: ModuleCloseState;
        /**
         * 当模块开启时绑定的回调函数
         */
        onOpen?: $CallbackInfo[];
        /**
         * 当模块显示时绑定的回调函数
         */
        onShow?: $CallbackInfo[];
    }
    const enum ModuleCloseState {
        /**
         * 正常开放
         */
        Open = 0,
        /**
         * 即将开放
         */
        ComingSoon = 1,
        /**
         * 关闭的
         */
        Closed = 2
    }
    /**
     * 模块tip状态
     *
     * @export
     * @enum {number}
     */
    const enum ModuleTipState {
        /**
         * 即将开放
         */
        ComingSoon = 1,
        /**
         * 关闭的
         */
        Closed = 2
    }
}
declare namespace jy {
    /**
     * 模块检测器
     * @author
     *
     */
    interface IModuleChecker extends ILimitChecker {
        /**
         * 检查并修正显示限制和使用限制值配错的情况
         * @param	{any}	showLimits		显示限制的数据
         * @param	{any}	limits			使用限制的数据
         * @return	{boolean}   <br/>true 有配置错误<br/>false 无配置错误
         */
        adjustLimitDatas(showLimits: any, limits: any): boolean;
    }
}
declare namespace jy {
    /**
     * 模块面板
     * @author
     *
     */
    interface IModulePanel extends egret.DisplayObject {
        /**
         * 关联的模块ID
         */
        moduleID: string | number;
    }
}
declare namespace jy {
    /**
     * 模块管理器
     * 用于管理模块的开启/关闭
     * @author 3tion
     *
     */
    class ModuleManager {
        /**
         * 显示tip的函数
         */
        showTip: {
            (msg: ModuleTipState): void;
        };
        /**
         * 字典<br/>
         * Key      {string}        模块ID<br/>
         * Value    {ModuleCfg}     模块配置
         */
        _allById: {
            [index: string]: IModuleCfg;
        };
        /**
         * 功能使用/显示限制的检查器<br/>
         * Key      {number}                检查器的类型对应limittype/showtype字段<br/>
         * Value    {IModuleChecker}		  模块限制检查器
         */
        _checkers: {
            [index: number]: IModuleChecker;
        };
        /**
         * 需要检查
         */
        _needCheck: boolean;
        /**
         * 需要检查显示/开启
         */
        _needCheckShow: boolean;
        /**
         * 未显示的按钮的模块
         */
        _unshowns: Key[];
        /**
         * 未开放的模块
         */
        _unopens: Key[];
        /**
         * Key      {number} 模块id<br/>
         * Value    {egret.DisplayObject[]} 绑定在同一个模块上的按钮的数组
         */
        _bindedIOById: {
            [index: number]: egret.DisplayObject[];
        };
        /**
         * Key      {number}            模块类型<br/>
         * Value    {IModuleHandler}    模块处理器
         */
        _hByType: {
            [index: number]: ModuleHandler;
        };
        /**
         * Key      {string}            模块id<br/>
         * Value    {IModuleHandler}    模块处理器
         */
        _hById: {
            [index: string]: ModuleHandler;
        };
        /**
         * Key      {egret.DisplayObject}   绑定的交互对象<br/>
         * Value    {number}                模块id
         */
        _ioBind: Map<egret.DisplayObject, string | number>;
        constructor();
        init(): void;
        /**
         *  创建控件ToolTip的方法
         */
        createToolTip: (cfg: IModuleCfg) => string;
        /**
         * 设置模块配置数据
         * @param { [index: string]: ModuleCfg }    cfgs
         */
        setCfgs(cfgs: {
            [index: string]: IModuleCfg;
        }): void;
        /**
         * 根据配置类型，注册模块处理器
         * @param type
         * @param handler
         *
         */
        registerHandler(type: number, handler: ModuleHandler): void;
        /**
         * 根据模块ID注册处理函数
         * @param id
         * @param handler
         *
         */
        registerHandlerById(id: string | number, handler: ModuleHandler): void;
        /**
         * 设置限制检查器
         * @param value	一个字典<br/>
         * Key  	{number}            限制器(showtype,limittype)类型<br/>
         * Value	{IModuleChecker}	    模块限制检查器
         *
         */
        set checkers(value: {
            [index: number]: IModuleChecker;
        });
        doCheckLimits(): void;
        /**
         * 检查限制
         */
        checkLimits(): void;
        /**
         * 模块是否已经显示
         * @param module    {string | number | IModuleCfg}    模块或者模块配置
         */
        isModuleShow(module: string | number | IModuleCfg): boolean;
        /**
         * 模块是否已经开启
         * @param module    {string | number | IModuleCfg}    模块或者模块配置
         * @param showtip   是否显示Tip
         */
        isModuleOpened(module: string | number | IModuleCfg, showtip?: boolean): boolean;
        /**
        * 将交互对象和功能id进行绑定，当交互对象抛出事件后，会执行功能对应的处理器
        * @param id					功能id
        * @param io					交互对象
        * @param eventType		事件
        *
        */
        bindButton(id: string | number, io: egret.DisplayObject, eventType?: string): void;
        /**
         * 交互事件的处理
         * @param event
         *
         */
        ioHandler(event: egret.Event): void;
        /**
         * 检查显示/开启
         * @param event
         *
         */
        check(): void;
        _check(): void;
        /**
         * 重置 unopen 和 unshown 项
         * 还有 onShow 和  onOpen 注册的类型
         */
        resetLimits(): void;
        /**
         *
         * 打开/关闭指定模块
         * @param {(string | number)} moduleID      模块id
         * @param {ToggleState} [toggleState]      0 自动切换(默认)<br/>  1 打开模块<br/> -1 关闭模块<br/>
         * @param {boolean} [showTip=true]          是否显示Tip
         * @return true   可以正常打开
         *         false  被模块配置拦截，无法打开
         */
        toggle(moduleID: string | number, show?: ToggleState, showtip?: boolean, param?: ModuleParam): boolean;
        /**
         * 获取模块
         * @param module
         */
        getCfg(module: string | number | IModuleCfg): IModuleCfg;
        /**
         * 改变服务器模块状态
         *
         * @param {string | number}  mid    服务器模块id
         * @param {boolean} state       模块状态
         */
        serverChangeModuleState(mid: string | number, state: boolean): void;
        /**
         * 注册模块开启的回调函数，如果模块已经开启，则直接执行回调
         *
         * @param {Key} mid
         * @param {$CallbackInfo} callback
         */
        regModuleOpen(mid: Key, callback: $CallbackInfo): void;
        /**
         * 注册模块显示的回调函数，如果模块已经开启，则直接执行回调
         *
         * @param {Key} mid
         * @param {$CallbackInfo} callback
         */
        regModuleShow(mid: Key, callback: $CallbackInfo): void;
        /**
         * 关闭某个模块
         * @param mid
         * @param close
         */
        close(mid: Key, close?: ModuleCloseState): void;
    }
}
declare namespace jy {
    /**
     * 模块参数
     *
     * @export
     * @interface ModuleParam
     */
    interface ModuleParam {
    }
}
declare namespace jy {
    /**
     * 模块面板的显示状态
     * @author
     *
     */
    const enum ModuleShowState {
        /**
         * 不在舞台上
         */
        HIDE = 0,
        /**
         * 正在显示，做Tween中
         */
        SHOWING = 1,
        /**
         * 已经显示在舞台上
         */
        SHOW = 2,
        /**
         * 正在隐藏
         */
        HIDING = 3
    }
}
declare namespace jy {
    /**
     * 模块处理器的基类
     * 类型0的模块处理器
     * @author
     *
     */
    interface ModuleHandler {
        /**
         * 打开某个模块
         * @param cfg
         */
        show(cfg: IModuleCfg, param?: ModuleParam): any;
        /**
         * 重舞台移除某个模块
         * @param cfg
         *
         */
        hide(cfg: IModuleCfg, param?: ModuleParam): any;
    }
}
declare namespace jy {
    /**
     *
     * 用于弹出窗口，并将下层模糊的工具类
     * @export
     * @class BlurScreen
     * @author gushuai
     */
    class BlurScreen {
        protected _engine: GameEngine;
        /**
         * 用于显示的位图对象
         *
         * @protected
         * @type {egret.Bitmap}
         */
        protected _bmp: egret.Bitmap;
        protected _stage: egret.Stage;
        /**
         * 用于绘制的临时容器
         *
         * @protected
         * @type {egret.Sprite}
         */
        protected _con: egret.Sprite;
        /**
         * 用于绘制的RenderTexture
         *
         * @protected
         * @type {egret.RenderTexture}
         */
        protected _tex: egret.RenderTexture;
        /**
         * 模块id和层绑定的字典
         * key      {number}            模块id
         * value    {GameLayer[]}    层id的数组
         *
         * @protected
         * @type {{ [index: number]: GameLayer[] }}
         */
        protected _dic: {
            [index: number]: GameLayer[];
        };
        protected _current: Key;
        constructor();
        regModuleLayers(moduleid: Key, ...ids: GameLayerID[]): void;
        checkShowBlur(id: Key): void;
        checkHideBlur(id: Key): void;
        protected drawBlur(e?: egret.Event): void;
        hideBlur(): void;
    }
}
declare namespace jy {
    const enum Const {
        defaultModalAlpha = 0.8
    }
    export interface Panel extends IAsync, ComponentWithEnable {
        createNativeDisplayObject(): void;
    }
    /**
     * 模块面板
     * @author 3tion
     *
     */
    export class Panel extends egret.Sprite implements SuiDataCallback, IAsyncPanel {
        /**
         * 背景/底
         */
        bg?: egret.DisplayObject;
        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;
        /**
         * 模块ID
         */
        moduleID: Key;
        /**
         * 依赖的除lib,自己以外的其他fla
         */
        protected _otherDepends: string[];
        /**
         * 所有依赖的fla资源
         *
         * @protected
         * @type {string[]}
         */
        protected _depends: string[];
        /**
         * 模态
         *
         * @protected
         * @type {egret.Bitmap}
         */
        protected modal: egret.Bitmap;
        /**
         * 是否模态
         *
         * @type {number}
         */
        protected _isModal: boolean;
        /**
         * 是否预加载位图
         *
         * @type {boolean}
         */
        preloadImage: boolean;
        /**
         * 模式窗口的Alpha
         */
        modalAlpha: number;
        /**
         * 公共的模式窗口的alpha
         */
        static modalAlpha: Const;
        protected _readyState: RequestState;
        constructor();
        get isReady(): boolean;
        protected init(): void;
        bind(key: string, className: string, ...otherDepends: string[]): void;
        startSync(): void;
        protected loadNext(): void;
        suiDataComplete(suiData: SuiData): void;
        suiDataFailed(_: SuiData): void;
        protected readyNow(failed?: boolean): void;
        /**
         * 绑定皮肤
         */
        protected bindComponent(): void;
        /**
         * 皮肤数据加载完成
         */
        skinDataComplete(): void;
        protected modalToStage(): void;
        get isModal(): boolean;
        set isModal(value: boolean);
        protected _mTouchClose: boolean;
        /**
         * 设置模式窗口的灰色区域是否可以点击关闭面板
         *
         * @param {boolean} value
         */
        setModalTouchClose(value: boolean): void;
        getModal(): egret.Bitmap;
        /**
         * 加模态
         *
         * @public
         */
        addModal(width?: number, height?: number): void;
        private onModalResize;
        /**
         * 移除模态
         *
         * @public
         */
        removeModal(): void;
        /**
         * 关闭
         *
         * @protected
         */
        hide(): void;
        protected get isShow(): boolean;
        show(): void;
    }
    export {};
}
declare namespace jy {
    /**
     * 有选中状态的控件
     *
     * @export
     * @interface SelectableComponents
     */
    interface SelectableComponents extends egret.EventDispatcher {
        selected: boolean;
        view: egret.DisplayObject;
    }
}
declare namespace jy {
    class View extends egret.Sprite {
        constructor(key: string, className: string);
    }
    interface View extends ComponentWithEnable {
    }
}
declare namespace jy {
    /**
     * 翻页的4个区域
     * ```
     *    TopLeft      │    TopRight
     *              ───┼───
     *   BottomLeft  │    BottomRight
     *
     * ```
     * @export
     * @enum {number}
     */
    const enum FlipCorner {
        TopLeft = 1,
        TopRight = 2,
        BottomLeft = 4,
        BottomRight = 8
    }
    /**
     * 用于做翻页效果
     *
     * @author 3tion
     * @export
     * @class Flip
     */
    class Flip extends egret.Sprite {
        protected frontDis: egret.DisplayObject;
        protected backDis: egret.DisplayObject;
        protected frontCon: egret.Sprite;
        protected backCon: egret.Sprite;
        protected frontMask: egret.Shape;
        protected backMask: egret.Shape;
        protected barea: number;
        protected farea: number;
        protected size: Size;
        /**
         * 左下的点
         *
         * @protected
         * @type {Point}
         */
        protected bl: Point;
        /**
         * 右下的点
         *
         * @protected
         * @type {Point}
         */
        protected br: Point;
        /**
         * 右上的点
         *
         * @protected
         * @type {Point}
         */
        protected tr: Point;
        /**
         * 当前正在拖拽的角
         *
         * @protected
         * @type {FlipCorner}
         */
        protected cCorner: FlipCorner;
        /**
         * 正在拖拽的角的原始坐标X
         *
         * @protected
         * @type {number}
         */
        protected oX: number;
        /**
         * 正在拖拽的角的原始坐标Y
         *
         * @protected
         * @type {number}
         */
        protected oY: number;
        /**
         * 可拖拽的角
         *
         * @protected
         * @type {number}
         */
        protected sCorner: number;
        protected backPoints: Point[];
        protected frontPoints: Point[];
        /**
         * 设置纹理
         *
         * @param {(egret.Texture | egret.DisplayObject)} front
         * @param {(egret.Texture | egret.DisplayObject)} [back]
         * @param {any} [supportedCorner=FlipCorner.TopLeft | FlipCorner.BottomLeft]
         * @param {Size} [size]
         */
        init(front: egret.Texture | egret.DisplayObject, back?: egret.Texture | egret.DisplayObject, supportedCorner?: number, size?: Size): void;
        /**
         * 设置页面前后的可视对象
         *
         * @param {(egret.DisplayObject)} front 正面纹理
         * @param {(egret.DisplayObject)} back 反面纹理
         * @param {any} [supportedCorner=FlipCorner.TopLeft | FlipCorner.BottomLeft] 支持拖拽的角
         * @param {Size} [size] 页面大小
         */
        init2(front: egret.DisplayObject, back: egret.DisplayObject, supportedCorner?: number, size?: Size): void;
        protected touchBegin(e: egret.TouchEvent): void;
        protected touchMove(e: egret.TouchEvent): void;
        protected getLocal(e: egret.TouchEvent): egret.Point;
        protected touchEnd(e: egret.TouchEvent): void;
        protected clearEvents(): void;
        reset(): void;
        private draw;
    }
}
declare namespace jy {
    /**
     * 图片
     * 外部加载
     * @pb
     *
     */
    class Image extends egret.Bitmap implements TextureResourceOption {
        /**
         * 资源唯一标识
         */
        uri: string;
        /**
         * 设置图片的加载列队优先级
         */
        qid?: Res.ResQueueID;
        noWebp?: boolean;
        sheetKey?: Key;
        constructor();
        addedToStage(): void;
        removedFromStage(): void;
        /**
         * 设置资源标识
         */
        set source(value: string);
        /**
         * 销毁图片
         */
        dispose(): void;
        hasTexture(): boolean;
    }
    interface Image extends ComponentWithEnable {
    }
}
declare namespace jy {
    interface ListItemRenderSkin extends egret.DisplayObject {
        $_rndIdx?: number;
    }
    interface ListItemRender<T> extends egret.EventDispatcher, IRecyclable {
        /**
         * ItemRender的尺寸，用于优化可变大小的Render
         */
        size?: Size;
        handleView(): void;
        dispose(): void;
        readonly view: egret.DisplayObject;
        /**
         * 持有的数据
         *
         * @type {T}
         * @memberOf ListItemRender
         */
        data: T;
        /**
         * 是否选中
         *
         * @type {boolean}
         * @memberOf ListItemRender
         */
        selected: boolean;
        /**
         * 是否不可被选中
         */
        unelectable?: boolean;
        /**
         * 数据改变的标记
         */
        dataChange?: boolean;
        /**
         * 是否初始化
         * @protected
         */
        inited?: boolean;
        /**
         * 绑定子控件
         *
         * @type {{ () }}
         * @memberOf ListItemRender
         */
        bindComponent?: {
            (): any;
        };
        /**
         * 当前索引
         *
         * @type {number}
         * @memberOf ListItemRender
         */
        index?: number;
    }
    interface ListItemRenderer<T, S extends ListItemRenderSkin> extends ViewController {
    }
    class ListItemRenderer<T, S extends ListItemRenderSkin> extends egret.EventDispatcher implements ListItemRender<T>, SelectableComponents {
        private _idx;
        get index(): number;
        set index(value: number);
        protected _data: T;
        private _dataChange;
        get dataChange(): boolean;
        set dataChange(value: boolean);
        skinlib: string;
        skinClass: string;
        /**
         * 永远执行刷新数据的操作
         *
         * @type {boolean}
         * @memberOf ListItemRender
         */
        protected _noCheckSame?: boolean;
        protected _selected: boolean;
        protected _defaultWidth: number;
        protected _defalutHeight: number;
        protected _skin: S;
        protected _ready: boolean;
        protected _container: egret.DisplayObjectContainer;
        /**
         * 是否已经检查过尺寸
         */
        private _sizeChecked;
        private _oldWidth;
        private _oldHeight;
        inited: boolean;
        constructor();
        onRecycle(): void;
        onSpawn(): void;
        /**
         * 子类重写
         * 初始化组件
         * 一定要super调一下
         */
        private _bind;
        bindComponent(): void;
        private onTouchTap;
        protected $setData(value: T): void;
        get data(): T;
        set data(value: T);
        /**
         * 设置容器
         *
         * @param {egret.DisplayObjectContainer} value
         *
         * @memberOf ListItemRenderer
         */
        setContainer(value: egret.DisplayObjectContainer): this;
        set skin(value: S);
        protected $setSkin(value: S): void;
        get skin(): S;
        /**
         * 根据数据处理视图
         *
         * 子类重写
         */
        handleView(): void;
        /**
         * force为true时无条件派发一次事件，通知更新坐标
         *
         * @protected
         * @ param {boolean} [force=false] 是否强制标记为尺寸变更
         */
        protected checkViewSize(force?: boolean): void;
        /**
         *
         * 获取视图
         * @readonly
         */
        get view(): S;
        private _visible;
        set visible(value: boolean);
        protected $setVisible(value: boolean): void;
        get visible(): boolean;
        set selected(value: boolean);
        /**
         * 设置视图的坐标
         *
         * @param {number} [x]
         * @param {number} [y]
         *
         * @memberOf ListItemRenderer
         */
        setPos(x?: number, y?: number): any;
        /**
         * 设置视图的坐标
         *
         * @param {{ x: number, y: number }} pos 坐标
         *
         * @memberOf ListItemRenderer
         */
        setPos(pos: {
            x: number;
            y: number;
        }): any;
        protected $setSelected(value: boolean): void;
        dispatch(type: Key, data?: any): boolean;
        get selected(): boolean;
        /**
         * 子类重写
         * 销毁组件
         */
        dispose(): void;
        removeSkinListener(skin: egret.DisplayObject): void;
        addSkinListener(skin: egret.DisplayObject): void;
        /**
         * 绑定TOUCH_TAP的回调
         *
         * @template T
         * @param {{ (this: T, e?: egret.Event): any }} handler
         * @param {T} [thisObject]
         * @param {number} [priority]
         * @param {boolean} [useCapture]
         */
        bindTouch(handler: {
            (this: T, e?: egret.Event): any;
        }, thisObject?: T, priority?: number, useCapture?: boolean): void;
        /**
         * 解除TOUCH_TAP的回调的绑定
         *
         * @param {Function} handler
         * @param {*} thisObject
         * @param {boolean} [useCapture]
         *
         * @memberOf Button
         */
        looseTouch(handler: Function, thisObject?: any, useCapture?: boolean): void;
        /**
         * 作为依赖者的Helper
         */
        protected _dependerHelper: DependerHelper;
        get isReady(): boolean;
        startSync(): void;
    }
}
declare namespace jy {
    /**
     * 翻页，一次手势翻一页
     *
     * @export
     * @class PageScroller
     * @extends {Scroller}
     */
    class PageScroller extends Scroller {
        /**
         * 当前在第几页
         *
         * @type {number}
         */
        currentPage: number;
        autoScrollSpeed: number;
        minPageScrollSpeed: number;
        /**
         * 总共将显示对象切割成几页
         *
         * @type {number}
         */
        private _totalpageCount;
        private _firstTouchPos;
        private _pageSize;
        private _scrollToPage;
        constructor();
        settotalpageInfo(count: number, size: number): void;
        /**
         * 总共将显示对象切割成几页
         *
         * @type {number}
         */
        get totalpageCount(): number;
        bindObj(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar): void;
        protected onDragStart(e: egret.TouchEvent): void;
        protected onDragEnd(e: egret.TouchEvent): void;
        private autoScrollToNextPage;
    }
}
declare const enum ScrollDirection {
    Vertical = 0,
    Horizon = 1
}
declare namespace jy {
    /**
     * 为已布局好的render提供List功能
     *
     * @export
     * @class MPageList
     * @extends {PageList}
     */
    class MPageList<T, R extends ListItemRender<T>> extends AbsPageList<T, R> {
        protected _viewCount: number;
        displayList(data?: T[]): this;
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        updateByIdx(index: number, data: T): this;
        addItem(item: R, index?: number): this;
        protected _get(index: number): R;
        clear(): this;
        dispose(): void;
    }
}
declare namespace jy {
    interface PageListOption {
        /**
         * 单元格之间的宽度
         *
         * @type {number}
         * @memberof PageListOption
         */
        hgap?: number;
        /**
         * 单元格之间的高度
         *
         * @type {number}
         * @memberof PageListOption
         */
        vgap?: number;
        /**
         * 列表共有几列
         * 如果 `type` 为 ScrollDirection.Horizon 则 默认`Infinity`
         * 如果 `type` 为 ScrollDirection.Vertical 则 默认`1`
         * @type {number}
         * @memberof PageListOption
         */
        columnCount?: number;
        /**
         * itemrender固定宽度
         *
         * @type {number}
         * @memberof PageListOption
         */
        itemWidth?: number;
        /**
         * itemrender固定高度
         *
         * @type {number}
         * @memberof PageListOption
         */
        itemHeight?: number;
        /**
         * 是否为固定尺寸
         *
         * @type {boolean}
         * @memberof PageListOption
         */
        staticSize?: boolean;
        /**
         * pageList的方向
         *
         * @type {ScrollDirection}
         * @memberof PageListOption
         */
        type?: ScrollDirection;
        /**
         * 容器
         *
         * @type {egret.Sprite}
         * @memberof PageListOption
         */
        con?: egret.Sprite;
        /**
         * 是否 不创建默认的 scroller
         */
        noScroller?: boolean;
        /**
         * scroller相关参数
         */
        scrollerOption?: ScrollerOption;
    }
    class PageList<T, R extends ListItemRender<T>> extends AbsPageList<T, R> {
        protected _factory: ClassFactory<R>;
        protected _pool: R[];
        maxPoolSize: number;
        /**
         * 根据render的最右侧，得到的最大宽度
         */
        protected _w: number;
        get w(): number;
        /**
         * 根据render的最下方，得到的最大高度
         */
        protected _h: number;
        get h(): number;
        /**
         * 水平间距
         *
         * @protected
         * @type {number}
         */
        protected _hgap: number;
        /**
         * 垂直间距
         *
         * @protected
         * @type {number}
         */
        protected _vgap: number;
        /**
         * 列数
         *
         * @protected
         * @type {number}
         */
        protected _columncount: number;
        protected _sizeChanged: boolean;
        scroller: Scroller;
        /**0纵向，1横向 */
        readonly scrollType: ScrollDirection;
        private _waitForSetIndex;
        private renderChange;
        /**
         * itemrender固定宽度
         *
         * @private
         * @type {number}
         * @memberOf PageList
         */
        private itemWidth;
        /**
         * itemrender固定高度
         *
         * @private
         * @type {number}
         * @memberOf PageList
         */
        private itemHeight;
        private useTweenIndex;
        private rawDataChanged;
        /**
         * 是否为固定尺寸
         *
         * @type {boolean}
         */
        staticSize: boolean;
        private _con;
        /**
         * 容器
         *
         * @readonly
         */
        get container(): egret.Sprite;
        /**
         * Creates an instance of PageList.
         * @param {ClassFactory<R> | Creator<R>} renderfactory
         * @param {PageListOption} [option]
         */
        constructor(renderfactory: ClassFactory<R> | Creator<R>, option?: PageListOption);
        protected init(option: PageListOption): void;
        resize(width?: number, height?: number): void;
        set container(con: egret.Sprite);
        displayList(data?: T[], noScrollToHead?: boolean): this;
        /**
         * 基于容器原始坐标进行排布
         * @param type 如果设置 `LayoutType.FullScreen(0)`，基于`LayoutType.TOP_LEFT`定位
         */
        layout(type: LayoutType): this;
        /**
         * 初始化render占据array，不做任何初始化容器操作
         *
         * @private
         */
        private initItems;
        protected onChange(): void;
        protected _get(index: number): R;
        protected onSizeChange(): void;
        getSize(v: egret.DisplayObject): Size;
        /**
         * 重新计算Render的坐标
         *
         * @private
         * @param {number} [start]
         * @param {number} [end]
         * @returns
         */
        protected reCalc(): void;
        $setSelectedIndex(value: number): void;
        private moveScroll;
        get tweenX(): number;
        set tweenX(value: number);
        get tweenY(): number;
        set tweenY(value: number);
        /**
         * 滚动到指定index
         */
        tweenToIndex(index: number): void;
        selectItemByData<K extends keyof T>(key: K, value: T[K], useTween?: boolean): this;
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        updateByIdx(index: number, data: T): this;
        removeAt(idx: number): void;
        removeItem(item: R): void;
        protected _removeRender(item: R): void;
        private refreshByRemoveItem;
        /**
         * 销毁
         *
         */
        dispose(): void;
        /**
         * 清理
         *
         */
        clear(): this;
        /**
         * 在舞台之上的起始索引
         *
         * @protected
         * @type {number}
         */
        protected _showStart: number;
        /**
         * 在舞台之上的结束索引
         *
         * @protected
         * @type {number}
         */
        protected _showEnd: number;
        /**
         * 在舞台之上的起始索引
         *
         * @readonly
         */
        get showStart(): number;
        /**
         * 在舞台之上的结束索引
         *
         * @readonly
         */
        get showEnd(): number;
        protected _lastRect: egret.Rectangle;
        checkViewRect(): void;
    }
}
declare namespace jy {
    /**
     * 图片字字库
     * Key为图片文字文件名（不带扩展名）
     * Value为egret.Texture
     *
     * @export
     * @class ArtWord
     * @author 3tion
     */
    class ArtWord {
        private _txs;
        /**
         * 获取纹理数据
         *
         * @param {Key} key
         * @returns
         *
         * @memberOf ArtWord
         */
        getTexture(key: Key): egret.Texture;
        private _suiData;
        /**
         * 字库名称
         *
         *
         * @memberOf ArtWord
         * @readonly
         */
        readonly name: string;
        constructor(name: string);
        parseData(data: any[][], suiData: SuiData): void;
    }
}
declare module egret {
    interface TouchEvent {
        /**
         * 和上一帧的 X偏移量
         */
        deltaX?: number;
        /**
         * 和上一帧的 Y偏移量
         */
        deltaY?: number;
        /**
         * 和上一帧的 时间差值
         */
        deltaTime?: number;
    }
}
declare namespace jy {
    interface DragOption {
        /**
         * 最大拖拽时间
         */
        minDragTime?: number;
        /**
         * 最小拖拽距离的平方
         */
        minSqDist?: number;
        /**
         * 是否阻止子控件的touch事件
         */
        stopChildren?: boolean;
    }
    interface DragDele {
        host: egret.DisplayObject;
        lt?: number;
        lx?: number;
        ly?: number;
        dragId?: number;
        isCon: boolean;
        /**
         * 最大拖拽时间
         */
        minDragTime: number;
        /**
         * 最小拖拽距离的平方
         */
        minSqDist: number;
        /**
         * 调用了EndDrag的时间
         * 用于判断是不是同一帧
         */
        et?: number;
    }
    /**
     *
     * @param {egret.DisplayObject} host 要被拖拽的对象
     * @param {boolean} [stopChildren=true] 是否屏蔽子控件的
     * @param {number} [minDragTime=300] 最小拖拽事件
     * @param {number} [minSqDist=400] 最小
     */
    function bindDrag(host: egret.DisplayObject, opt?: DragOption): DragDele;
    /**
     * 停止指定id的拖拽
     * @param pointId
     */
    function stopDrag(host: egret.DisplayObject): void;
    function looseDrag(host: egret.DisplayObject): void;
}
declare namespace jy {
    /**
     * 区段 -1000 - -1999
     *
     * @export
     * @enum {number}
     */
    const enum EventConst {
        /**
         * 大小发生改变
         */
        Resize = -1999,
        /**
         * 执行强制重排面板
         */
        ReLayout = -1998,
        /**
        * 选中未选中
        *
        * @static
        * @type {string}
        */
        CHOOSE_STATE_CHANGE = -1000,
        /**
         * List中单击事件
         */
        ITEM_TOUCH_TAP = -1001,
        /**
         * 分组发生改变
         */
        GROUP_CHANGE = -1020,
        /**
         * 尝试多选选中时，已经达到最大数量
         */
        GROUP_FULL = -1021,
        VALUE_CHANGE = -1040,
        PAGE_CHANGE = -1050,
        SCROLL_POSITION_CHANGE = -1051,
        /**
         * PageList 选中目标后触发
         */
        ITEM_SELECTED = -1052,
        /**
         * Scroller 开始拖拽
         */
        ScrollerDragStart = -1051,
        /**
         * Scroller 停止拖拽
         */
        ScrollerDragEnd = -1050,
        /**
         * 翻页操作结束
         * event.data 背面面积/正面面积
         */
        FlipEnd = -1060,
        /**
         * SuiBmd纹理加载失败
         * event.data 为资源的 uri
         */
        SuiBmdLoadFailed = -1070,
        /**
         * 开始拖拽
         * data {egret.TouchEvent} touch事件
         */
        DragStart = -1090,
        /**
         * 拖拽移动
         * data {egret.TouchEvent} touch事件
         */
        DragMove = -1089,
        /**
         * 拖拽结束
         * data {egret.TouchEvent} touch事件
         */
        DragEnd = -1088
    }
}
declare namespace jy {
    /**
     * 导出类型，需要和导出工具的ExportType对应
     * @author
     *
     */
    const enum ExportType {
        /**图片**/
        Image = 0,
        /**文本框*/
        Text = 1,
        /**复合容器**/
        Container = 2,
        /**按钮 */
        Button = 3,
        /**九宫图片*/
        ScaleBitmap = 5,
        ShapeNumber = 6,
        NumericStepper = 7,
        Slider = 8,
        ScrollBar = 9,
        /**进度条**/
        ProgressBar = 10,
        SlotBg = 11,
        ShareBmp = 12,
        Slot = 13,
        Rectangle = 14,
        /**
         * 字库
         */
        ArtWord = 15,
        /**
         * 空容器，可带大小
         */
        Sprite = 16,
        /**
         * 图片加载器
         */
        ImageLoader = 17,
        /**
         * 会导出的复合容器
         */
        ExportedContainer = 18,
        /**
         * 影片剪辑
         */
        MovieClip = 19,
        /**
         * MC按钮
         */
        MCButton = 20,
        /**
         * MC版的进度条
         */
        MCProgress = 21
    }
}
declare namespace jy {
    /**
     *
     * 用于处理SuiData中的纹理加载
     * @export
     * @class SuiBmd
     * @author gushuai
     */
    class SuiBmd implements IResource {
        bmd: egret.BitmapData;
        textures: egret.Texture[];
        bmdState: RequestState;
        readonly url: string;
        /**
         * 使用计数
         */
        using: number;
        get isStatic(): boolean;
        readonly uri: string;
        lastUseTime: number;
        /**
         * 未加载的时候，请求的位图
         */
        loading: SuiBmdCallback[];
        constructor(uri: string, url: string);
        loadBmd(): void;
        protected checkBitmap(item: Res.ResItem): void;
        dispose(): void;
    }
}
declare namespace jy {
    /**
     *
     * SuiData中位图加载完成的回调
     * @export
     * @interface SuiBmdCallback
     */
    interface SuiBmdCallback {
        /**
         * suidata中用的位图加载完成后，对于加载的组件的回调函数
         *
         *
         * @memberOf SuiBmdRefresh
         */
        refreshBMD(): void;
    }
    /**
     * SuiData的数据加载完成后的回调
     *
     * @export
     * @interface SuiDataCallback
     */
    interface SuiDataCallback {
        suiDataComplete(suiData: SuiData): void;
        suiDataFailed(suiData: SuiData): void;
    }
    /**
     * 用于加载和存储fla导出的ui数据和位图
     * @author 3tion
     *
     */
    class SuiData {
        /**
         * 强制设置的皮肤标识
         */
        skinUri?: string;
        /**
         * fla的名字
         */
        readonly key: string;
        /**
         * 加载地址
         */
        readonly url: string;
        readonly uri: string;
        /**
         * 位图数据
         */
        pngbmd: SuiBmd;
        /**
         * 位图数据
         */
        jpgbmd: SuiBmd;
        /**
         * 回调函数
         */
        callbacks?: SuiDataCallback[];
        /**
         * 数据加载状态
         * 0 未加载
         * 1 加载中
         * 2 数据加载完成
         */
        state: RequestState;
        /**
         * 库数据
         * key      fla中设置的导出名<br/>
         * value    皮肤数据<br/>
         */
        lib: {
            [index: string]: BaseCreator<egret.DisplayObject>;
        };
        /**
         * 面板原始数据
         *
         * @type {PanelsData}
         */
        panelsData: PanelsData;
        /**
         * 面板/View的className集合
         *
         * @type {string[]}
         */
        panelNames: string[];
        /**
         * 字库数据
         *
         * @type {{ [index: string]: ArtWord }}
         * @memberOf SuiData
         */
        fonts: {
            [index: string]: ArtWord;
        };
        /**
         * 位图创建器
         */
        bmplibs: {
            [index: number]: BitmapCreator<egret.Bitmap>;
        };
        /***
         * 未经过解析的源组件数据
         */
        sourceComponentData: SourceComponentDataDict;
        /**
         * 是否为静态资源，不被卸载
         */
        static: boolean;
        constructor(key: string);
        createBmpLoader(ispng: boolean, textures: egret.Texture[]): void;
        noRes(uri: string, file: string, textures: egret.Texture[]): SuiBmd;
        setStatic(): void;
        /**
         * 刷新位图
         *
         * @param {SuiBmdCallback} bmp  要刷新的位图
         * @param {boolean} [isjpg]     是否为jpg纹理，默认为png
         */
        checkRefreshBmp(bmp: SuiBmdCallback, isjpg?: boolean): boolean;
        /**获取对应索引位置的texture */
        getTexture(index: number): egret.Texture;
        loadBmd<T extends Function>(callback?: CallbackInfo<T>): void;
    }
}
declare module egret {
    interface DisplayObject {
        /**
         * 扩展sui的可视对象，的原始尺寸和坐标
         * 由flash导出的原始视图尺寸
         * @type {SuiRawRect}
         * @memberOf DisplayObject
         */
        suiRawRect?: jy.SuiRawRect;
        /**
         * sui的资源名称
         */
        suiLib?: string;
        /**
         * sui的引用名称
         */
        suiClass?: string;
    }
}
declare namespace jy {
    import Texture = egret.Texture;
    interface SuiRawRect extends egret.Rectangle {
    }
    const enum SuiResConst {
        DataFile = "s.json"
    }
    function getSuiDataUri(key: string): string;
    /**
     * 用于管理位图和数据
     * @author 3tion
     *
     */
    class SuiResManager {
        /**
         * Key      {string}    fla的文件名
         * Value    {SuiData}   数据
         */
        protected _suiDatas: {
            [index: string]: SuiData;
        };
        /**
         * Key      {string}    主配置文件的加载地址
         * Value    {SuiData}   数据
         */
        protected _urlKey: {
            [index: string]: SuiData;
        };
        /**
         * 创建器
         */
        protected _creators: {
            [index: string]: {
                new (): BaseCreator<egret.DisplayObject>;
            };
        };
        /**
         * 共享的文本创建器
         */
        sharedTFCreator: TextFieldCreator;
        constructor();
        protected initInlineCreators(): void;
        getData(key: string): SuiData;
        /**
         * 设置制定的皮肤为静态
         * @param key
         */
        setResStatic(key: string): void;
        /**
         * 加载数据
         */
        loadData(key: string, callback?: SuiDataCallback, qid?: Res.ResQueueID): void;
        /**
         * 数据加载完成
         */
        protected checkData(item: Res.ResItem): void;
        /**
         *
         * 直接将已经加载好的内置数据，和key进行绑定
         * @param {string} key
         * @param {any} data
         * @param {string} [skinUri] 皮肤标识
         */
        setInlineData(key: string, data: any, skinUri?: string): void;
        createSuiData(key: string): SuiData;
        /**
         *
         * 初始化数据
         * @private
         * @param {*} data
         * @param {SuiData} suiData
         */
        private _initSuiData;
        /**
         * 处理控件数据
         */
        protected parseComponentData(allComData: SourceComponentDataDict, suiData: SuiData): void;
        /**
         * 解析图片数据
         *  0 图片宽  1图片高度   2偏移X   3偏移Y
         */
        protected parseTextureData(data: number[][], suiData: SuiData, ispng?: boolean): void;
        /**
         * 创建可视控件
         * @param uri           皮肤标识
         * @param className     类名字
         * @param baseData      基础数据
         */
        createDisplayObject(uri: string, className: string, baseData?: any): egret.DisplayObject;
        /**
         * 处理元素数据
         * 对应 https://github.com/eos3tion/ExportUIFromFlash  项目中
         * Solution.ts -> getElementData的元素数据的解析
         * @param {string} uri 库标识
         * @param {ComponentData} data 长度为4的数组
         * 0 导出类型
         * 1 基础数据 @see Solution.getEleBaseData
         * 2 对象数据 不同类型，数据不同
         * 3 引用的库 0 当前库  1 lib  字符串 库名字
         * @memberOf BaseCreator
         */
        createElement(uri: string | SuiData, data: ComponentData): egret.DisplayObject;
        /**
         * 创建位图对象
         * @param uri       皮肤标识
         * @param index     位图索引 data[2]
         * @param baseData  基础数据 data[1]
         */
        createBitmap(uri: string, index: number, baseData: BaseData): egret.Bitmap;
        /**
         * 获取美术字
         *
         * @param {string} uri          皮肤标识
         * @param {string} artword      美术字
         * @returns
         *
         * @memberOf SuiResManager
         */
        getArtWord(uri: string, artword: string): ArtWord;
        /**
         * 获取美术字的纹理
         *
         * @param {string} uri          皮肤标识
         * @param {string} artword      美术字
         * @param {Key} font         指定的文字
         * @returns
         *
         * @memberOf SuiResManager
         */
        getArtWordTexture(uri: string, artword: string, font: Key): Texture;
        /**
         *  创建位图对象
         * @param uri       皮肤标识
         * @param data      JSON的数据
         */
        createBitmapByData(uri: string, data: any): egret.Bitmap;
        /**
         * 创建文本框
         * @param uri       皮肤标识
         * @param data      私有数据 data[2]
         * @param baseData  基础数据 data[1]
         */
        createTextField(uri: string, data: any, baseData: any): egret.TextField;
        /**
        *  创建文本框
        * @param uri       皮肤标识
        * @param data      JSON的数据
        */
        createTextFieldByData(uri: string, data: any): egret.TextField;
        static initBaseData(dis: egret.DisplayObject, data: any): void;
        /**
         * 创建子控件
         *
         * @param {string} key
         * @param {string} className
         * @param {egret.DisplayObjectContainer} view
         */
        createComponents(key: string, className: string, view: egret.DisplayObjectContainer): void;
        private _createComponents;
        createComponent(data: ComponentData, suiData: SuiData, view: egret.DisplayObjectContainer): any;
        getElement(suiData: SuiData, data: ComponentData): egret.DisplayObject;
        /**
         * 获取控件尺寸
         *
         * @param {string} key
         * @param {string} className
         * @param {egret.Rectangle} [outRect]
         * @returns
         */
        getSize(key: string, className: string, outRect?: egret.Rectangle): egret.Rectangle;
    }
    type SourceComponentDataDict = {
        [type in ExportType]: SourceComponentData;
    };
    /**
     * 原始组件数据，通过`ExportUIFromFlash`项目导出的数据
     */
    interface SourceComponentData {
        /**
         * 控件名称数组
         */
        0: string[];
        /**
         * 组件数据的数组
         */
        1: any[];
        /**
         * 尺寸数据的数组
         */
        2: SizeData[];
    }
    interface SizeData {
        /**
         * x坐标
         *
         * @type {number}
         * @memberOf BaseData
         */
        0: number;
        /**
         * y坐标
         *
         * @type {number}
         * @memberOf BaseData
         */
        1: number;
        /**
         * width
         *
         * @type {number}
         * @memberOf BaseData
         */
        2: number;
        /**
         * height
         *
         * @type {number}
         * @memberOf BaseData
         */
        3: number;
    }
    interface ComponentData extends Array<any> {
        /**
         * 导出类型
         *
         * @type {ExportType}
         * @memberOf ComponentData
         */
        0: ExportType;
        /**
         * 基础数据
         *
         * @type {BaseData}
         * @memberOf ComponentData
         */
        1: BaseData;
        /**
         * 组件数据
         *
         * @type {any}
         * @memberOf ComponentData
         */
        2: any;
        /**
         * 是否引用lib
         * 如果没有此值或者0，则使用当前key
         * 1 使用 lib
         * 其他字符串，则为 suiData的key
         * @type {1|string}
         * @memberOf ComponentData
         */
        3?: 0 | 1 | string;
    }
    interface BaseData {
        /**
         * 控件名称
         *
         * @type {string}
         * @memberOf BaseData
         */
        0: string;
        /**
         * x坐标
         *
         * @type {number}
         * @memberOf BaseData
         */
        1: number;
        /**
         * y坐标
         *
         * @type {number}
         * @memberOf BaseData
         */
        2: number;
        /**
         * width
         *
         * @type {number}
         * @memberOf BaseData
         */
        3: number;
        /**
         * height
         *
         * @type {number}
         * @memberOf BaseData
         */
        4: number;
        /**
         * 旋转角度/或者matrix的[a,b,c,d]四个值组成的数组
         *
         * @type {number}
         * @memberOf BaseData
         */
        5: number | Array<number>;
        /**
         * alpha
         *
         * @type {number}
         * @memberof BaseData
         */
        6?: number;
    }
    interface PanelData extends Array<any> {
        0: SizeData;
        1: ComponentData[];
    }
    interface PanelsData {
        [index: string]: PanelData;
    }
}
declare namespace jy {
    /**
     * 给ArtText和ArtWord刷新纹理使用
     *
     * @export
     * @param {SuiData} suiData
     * @param {{ refreshBMD?: { (): void } }} thisObj
     */
    function refreshTexs(suiData: SuiData, thisObj: {
        refreshBMD?: {
            (): void;
        };
    }): void;
}
declare namespace jy {
    /**
     * 艺术字
     */
    class ArtText extends Component {
        suiData: SuiData;
        /**
         * 垂直对齐方式
         *
         * @private
         * @type {LayoutTypeVertical}
         */
        private _align;
        textures: {
            [index: string]: egret.Texture;
        };
        protected _value: string | number;
        /**
         * 水平间距
         *
         */
        hgap: number;
        private artwidth;
        private _maxHeight;
        constructor();
        refreshBMD(): void;
        /**
         * 设置垂直对齐规则
         *
         * @param {LayoutTypeVertical} value
         */
        setVerticalAlign(value: LayoutTypeVertical): void;
        protected $setValue(val: string | number): void;
        set value(val: string | number);
        get value(): string | number;
        $getWidth(): number;
        protected checkAlign(): void;
        dispose(): void;
    }
    /**
     *
     * @author gushuai
     *
     */
    class ArtTextCreator extends BaseCreator<ArtText> {
        private _txs;
        parseSelfData(data: any): void;
        protected bindEvent(bmp: ArtText): void;
        protected onAddedToStage(e: egret.Event): void;
        protected onRemoveFromStage(): void;
    }
}
declare namespace jy {
    /**
     *
     * 新版使用MC的按钮，减少制作按钮的难度
     *
     *
     * @export
     * @class MCButton
     * @extends {Button}
     */
    class MCButton extends Button {
        mc: MovieClip;
        constructor(mc?: MovieClip);
        setSkin(mc: MovieClip): void;
        refresh(): void;
        dispose(): void;
    }
    /**
     * MC按钮创建器
     *
     * @export
     * @class MCButtonCreator
     * @extends {BaseCreator<MCButton>}
     */
    class MCButtonCreator extends BaseCreator<MCButton> {
        parseSelfData(data: any): void;
    }
}
declare namespace jy {
    interface MCEleRef extends Array<any> {
        /**
         * mc的索引，
         * 如果是-1，则新创建
         *
         * @type {number}
         * @memberof MCEleRef
         */
        0: number;
        /**
         * 变更的数据 或者完整的组件数据
         *
         * @type {(BaseData | ComponentData)}
         * @memberof MCEleRef
         */
        1?: BaseData | ComponentData;
        /**
         * 如果是文本框，可能有文本数据
         *
         * @type {TextData}
         * @memberof MCEleRef
         */
        2?: TextData;
    }
    interface MCFrameData {
        /**
         * 关键帧索引
         *
         * @type {number}
         * @memberof MCFrameData
         */
        key: number;
        data: (number | MCEleRef)[];
    }
    class MovieClip extends Component {
        protected suiData: SuiData;
        protected framesData: MCFrameData[];
        /**
         * 组件字典
         *
         * @protected
         * @type {{ [index: number]: egret.DisplayObject }}
         */
        protected compData: {
            [index: number]: egret.DisplayObject;
        };
        /**
         * 当前帧
         *
         * @readonly
         * @type {number}
         */
        currentFrame: number;
        /**
         * 是否正在播放
         *
         * @readonly
         * @type {boolean}
         */
        playing: boolean;
        /**
         * 是否循环
         * 默认循环播放
         */
        loop: boolean;
        readonly totalFrame: number;
        /**
         * 每帧播放时长
         *
         * @type {number}
         */
        timePerFrame: number;
        protected _nt: number;
        constructor(data: any, framesData: MCFrameData[], suiData: SuiData);
        /**
         * 停在某一帧或当前帧
         * 索引从0开始
         * @param {number} [frame]
         */
        stop(frame?: number): void;
        play(frame?: number): void;
        protected doRender(): void;
        protected validateFrame(cf: number): number;
        protected getFrame(frame?: number): number;
        protected render(frame: number): void;
    }
    /**
     * MC创建器
     *
     * @export
     * @class MovieClipCreator
     * @extends {BaseCreator<MovieClip>}
     */
    class MovieClipCreator extends BaseCreator<MovieClip> {
        parseSelfData(data: any): void;
        $getFramesData(data: any): MCFrameData[];
    }
}
declare namespace jy {
    class NumericStepper extends Component {
        minBtn: Button;
        subBtn: Button;
        addBtn: Button;
        maxBtn: Button;
        txtbg: ScaleBitmap;
        txt: egret.TextField;
        private _value;
        private _width;
        private _minValue;
        private _maxValue;
        constructor();
        bindChildren(): void;
        set width(value: number);
        get width(): number;
        private setMinValue;
        private addValue;
        private subValue;
        private setMaxValue;
        set value(val: number);
        get value(): number;
        set minValue(value: number);
        get minValue(): number;
        set maxValue(value: number);
        get maxValue(): number;
    }
    class NumericStepperCreator extends BaseCreator<NumericStepper> {
        private uiData;
        private txtCreator;
        private btnCreator;
        private scale9Creator;
        private suiManager;
        constructor();
        parseSelfData(data: any): void;
        private createNumericStepper;
    }
}
declare namespace jy {
    interface ProgressBarSkinDele {
        /**
         * 进度条的顶
         *
         * @type {egret.DisplayObject}
         * @memberof ProgressBarSkin
         */
        bar: egret.DisplayObject;
        /**
         * 进度条背景
         *
         * @type {egret.DisplayObject}
         * @memberof ProgressBarSkin
         */
        bg?: egret.DisplayObject;
        /**
         * 进度条文本框
         *
         * @type {egret.TextField}
         * @memberof ProgressBarSkin
         */
        tf?: egret.TextField;
    }
    /**
     * 进度条
     * @author 3tion
     *
     */
    class ProgressBar extends Component {
        static defaultLabelFunction: (value: number, maxValue: number) => string;
        bg: egret.DisplayObject;
        tf: egret.TextField;
        bar: egret.DisplayObject;
        protected _labelFun: (value: number, maxValue: number) => string;
        protected _value: number;
        protected _maxValue: number;
        /**
         * 背景和bar的差值
         *
         * @protected
         */
        protected _delta: number;
        protected _barWidth: number;
        /**
         *
         * 进度条的bar是否按遮罩的方式控制
         * @type {boolean}
         */
        useMask: boolean;
        protected _skin: ProgressBarSkinDele;
        constructor();
        get labelFun(): (value: number, maxValue: number) => string;
        /**自定义文本显示方法*/
        set labelFun(value: (value: number, maxValue: number) => string);
        /**
         * 设置进度条宽度
         *
         * @param {number} width
         */
        setWidth(width: number): void;
        set skin(skin: ProgressBarSkinDele);
        progress(value: number, maxValue: number): void;
        updateLabel(): void;
        getPercent(): number;
        updateBar(): void;
        refresh(): void;
    }
    /**
     * 进度条创建
     *
     */
    class ProgressBarCreator extends BaseCreator<ProgressBar> {
        parseSelfData(data: any): void;
    }
    /**
     * MC进度条创建
     *
     * @export
     * @class MCProgressCreator
     * @extends {BaseCreator<ProgressBar>}
     */
    class MCProgressCreator extends BaseCreator<ProgressBar> {
        parseSelfData(data: any): void;
    }
}
declare namespace jy {
    type ScaleBitmap = egret.Bitmap;
    class ScaleBitmapCreator extends BitmapCreator<ScaleBitmap> {
        constructor();
        parseSelfData(data: any): void;
    }
}
declare namespace jy {
    class ScrollBar extends Component {
        bar: egret.Sprite;
        bg: egret.Sprite;
        protected _barBmp: ScaleBitmap;
        protected _bgBmp: ScaleBitmap;
        protected _bgSize: number;
        protected _barSize: number;
        protected _scrollType: ScrollDirection;
        protected _supportSize: number;
        constructor();
        protected initBaseContainer(): void;
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
        set scrollType(value: ScrollDirection);
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
        get scrollType(): ScrollDirection;
        /**
         * 设置滚动条的底与默认尺寸
         *
         * @value 背景底
         * @bgSize 尺寸
         */
        setBg(value: ScaleBitmap, bgSize?: number): void;
        /**
         * 设置滑块按钮的样式
         *
         * @value 滑块按钮
         * @barSize 滑块的尺寸大小
         */
        setBar(value: ScaleBitmap, barSize?: number): void;
        /**
         * 滚动条背景尺寸
         */
        set bgSize(value: number);
        get bgSize(): number;
        /**
         * 滑块的尺寸
         */
        set barSize(value: number);
        get barSize(): number;
        /**当垂直滚动时，此值为滑块的宽度，当水平滚动时，此值为滑块的高度 */
        set supportSize(value: number);
        get supportSize(): number;
        protected $setSupportSize(_supportSize: number): void;
        protected $setBarSize(_barSize: number): void;
        protected $setBgSize(_bgSize: number): void;
        protected checkBgSize(): void;
        protected checkBarSize(): void;
    }
    class ScrollBarCreator extends BaseCreator<ScrollBar> {
        private uiData;
        private suiManager;
        constructor();
        parseSelfData(data: any): void;
        private createScrollBar;
    }
}
declare namespace jy {
    class ShareBitmapCreator extends BitmapCreator<egret.Bitmap> {
        constructor();
        parseSelfData(data: any): void;
    }
}
declare namespace jy {
    interface SliderSkinDele {
        bar: egret.DisplayObject;
        bg: egret.DisplayObject;
        thumb: egret.DisplayObject;
    }
    interface SliderTip extends egret.DisplayObject {
        label: string;
        setLabel(value: string): any;
    }
    class Slider extends Component {
        private _width;
        private _value;
        /***滑块 */
        thumb: egret.DisplayObject;
        /****底 */
        bg: egret.DisplayObject;
        private _lastThumbX;
        private _max;
        private _min;
        private _step;
        /**每步step需要的像素 */
        private _perStepPixel;
        private _bgClickEnabled;
        bar?: egret.DisplayObject;
        tip?: SliderTip;
        _skin: SliderSkinDele;
        constructor();
        bindTip(tip: SliderTip): void;
        set skin(skin: SliderSkinDele);
        private onAddToStage;
        set bgClickEnable(value: boolean);
        bgClick(e: egret.TouchEvent): void;
        private bgOut;
        private onThumbBegin;
        private onThumbEnd;
        private mouseMove;
        private calculatevalue;
        set value(val: number);
        get value(): number;
        /**
         * 设置底条宽度
         */
        set width(value: number);
        get width(): number;
        setMinMax(min: number, max: number, step?: number): void;
    }
    class SliderCreator extends BaseCreator<Slider> {
        parseSelfData(data: any): void;
    }
}
declare namespace jy {
    const enum SlotCountShow {
        /**
         * 不显示文本
         */
        NotShow = 0,
        /**
         * 显示文本
         */
        Show = 1,
        /**
         * 自定义显示
         * 会调用 Slot.getCountString进行处理
         */
        Custom = 2
    }
    /**
     * 格位基本类
     * @author 3tion
     */
    class Slot extends Component {
        bg: egret.DisplayObject;
        icon: Image;
        protected _countTxt: egret.TextField;
        protected _rect: egret.Rectangle;
        protected _uri: string;
        protected _count: number;
        protected _countShow: SlotCountShow;
        protected _changed: boolean;
        protected _data: any;
        constructor();
        /**
         *
         * 获取类型2的数量处理方法
         * @static
         */
        static getCountString: (count: number) => string;
        set data(value: any);
        /**
         * 设置数据，只允许子类调用
         * @protected
         */
        $setData<T>(value: T): void;
        get data(): any;
        set rect(rect: egret.Rectangle);
        get rect(): egret.Rectangle;
        set countTxt(txt: egret.TextField);
        get countTxt(): egret.TextField;
        set iconSource(uri: string);
        set count(value: number);
        /**
         * 数量显示状态<br/>
         * 0 不显示数值<br/>
         * 1 默认显示大于1的数量<br/>
         * 2 大于1的数量，显示数值，超过一万的，会以xxx万显示 默认为2<br/>
         */
        set countShow(value: SlotCountShow);
        get countShow(): SlotCountShow;
        refreshCount(): void;
        getCount(): string;
        invalidateDisplay(): void;
        refreshDisplay(): boolean;
        /**
         * 皮肤添加到舞台
         */
        onAwake(): void;
        /**
         * 销毁
         * to be override
         */
        dispose(): void;
        get width(): number;
        get height(): number;
    }
    /**
     * 格位创建器
     *
     * @export
     * @class SlotCreator
     * @extends {BaseCreator<Slot>}
     * @author pb
     */
    class SlotCreator extends BaseCreator<Slot> {
        constructor();
        parseSelfData(data: any): void;
    }
}
declare module egret {
    interface TextField {
        /**
         * 原始的文本数据
         *
         * @type {jy.TextData}
         * @memberof TextField
         */
        rawTextData: jy.TextData;
    }
}
declare namespace jy {
    interface TextData extends Array<any> {
        /**
         *
         * ["static", "dynamic", "input"]的索引
         * @type {number}
         * @memberof TextData
         */
        0: number;
        /**
         * 字体，0为默认字体
         *
         * @type {(string | 0)}
         * @memberof TextData
         */
        1: string | 0;
        /**
         * align
         *  ["left", "center", "right", "justify"] 的索引值
         * @type {string}
         * @memberof TextData
         */
        2: number;
        /**
         * 文字颜色
         *
         * @type {string}
         * @memberof TextData
         */
        3: string;
        /**
         * 字体大小
         *
         * @type {number}
         * @memberof TextData
         */
        4: number;
        /**
         * 行间距
         *
         * @type {number}
         * @memberof TextData
         */
        5: number;
        /**
         * 是否加粗
         *
         * @type {number}
         * @memberof TextData
         */
        6: boolean;
        /**
         * 是否为斜体
         *
         * @type {boolean}
         * @memberof TextData
         */
        7: boolean;
        /**
         * 描边数据
         * 0 表示没有描边
         * @type {(0 | TextStrokeData)}
         * @memberof TextData
         */
        8: 0 | TextStrokeData;
    }
    interface TextStrokeData extends Array<any> {
        /**
         * 描边颜色值
         *
         * @type {number | string}
         * @memberof TextStrokeData
         */
        0: number | string;
        /**
         * 描边宽度
         *
         * @type {number}
         * @memberof TextStrokeData
         */
        1: number;
    }
    /**
     * 文本框创建器
     * @author
     *
     */
    class TextFieldCreator extends BaseCreator<egret.TextField> {
        static DefaultFonts: string;
        static UniformFonts: string;
        constructor();
        parseSelfData(data: TextData): void;
        initTextData(tf: egret.TextField, data: TextData): void;
    }
}
declare namespace jy {
    /**
     * ## 背景图容器
     * 1. 当屏幕长或者宽任意一边大于`基准尺寸(basis)`时
     *      * 首先根据基准尺寸的宽边得到缩放比
     *      * 然后将容器按此缩放比进行缩放
     *      * 根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     * 2. 如果屏幕的长或者宽都小于或者等于`基准尺寸(basis)`时
     *      * 直接根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     *
     * @export
     * @class MainUIContainer
     * @extends {egret.Sprite}
     */
    class BGContainer extends LayoutContainer {
        protected _layout: LayoutType;
        constructor(basis: Size, host?: egret.Sprite, layout?: LayoutType);
        onResize(): void;
    }
}
declare namespace jy {
    export const enum LayoutType {
        /**
         * 全屏
         */
        FullScreen = 0,
        /**
         * 垂直——上
         *
         * @static
         * @type {number}
         */
        TOP = 4,
        /**
         * 垂直——中
         *
         * @static
         * @type {number}
         */
        MIDDLE = 8,
        /**
         * 垂直——下
         *
         * @static
         * @type {number}
         */
        BOTTOM = 12,
        /**
         * 水平——左
         *
         * @static
         * @type {number}
         */
        LEFT = 1,
        /**
         * 水平——中
         *
         * @static
         * @type {number}
         */
        CENTER = 2,
        /**
         * 水平——右
         *
         * @static
         * @type {number}
         */
        RIGHT = 3,
        /**
         * 垂直方向的位运算mask
         *
         * @static
         * @type {number}
         */
        VERTICAL_MASK = 12,
        /**
         * 水平方向位运算mask
         *
         * @static
         * @type {number}
         */
        HORIZON_MASK = 3,
        /**
         * 左上
         */
        TOP_LEFT = 5,
        /**
         * 中上
         */
        TOP_CENTER = 6,
        /**
         * 右上
         */
        TOP_RIGHT = 7,
        /**
         * 左中
         */
        MIDDLE_LEFT = 9,
        /**
         * 中心
         */
        MIDDLE_CENTER = 10,
        /**
         * 右中
         */
        MIDDLE_RIGHT = 11,
        /**
         * 左下
         */
        BOTTOM_LEFT = 13,
        /**
         * 中下
         */
        BOTTOM_CENTER = 14,
        /**
         * 右下
         */
        BOTTOM_RIGHT = 15
    }
    export const enum LayoutTypeVertical {
        TOP = 4,
        MIDDLE = 8,
        BOTTOM = 12
    }
    export const enum LayoutTypeHorizon {
        LEFT = 1,
        CENTER = 2,
        RIGHT = 3
    }
    export interface LayoutDisplay {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        parent?: LayoutDisplayParent;
        $layoutSize?: Size;
        display?: egret.DisplayObject;
    }
    export interface LayoutDisplayParent extends Size {
    }
    /**
     * 基于Point位置的布局方式，进行布局
     *
     * @param {number} disWidth
     * @param {number} disHeight
     * @param {number} parentWidth
     * @param {number} parentHeight
     * @param {Point} point
     * @param {Point} [result]
     * @param {number} [padx=0]
     * @param {number} [pady=0]
     * @returns
     */
    function getTipLayoutPos(disWidth: number, disHeight: number, parentWidth: number, parentHeight: number, point: Point, result?: Point, padx?: number, pady?: number): Point;
    function getLayoutPos(disWidth: number, disHeight: number, parentWidth: number, parentHeight: number, layout: LayoutType, result?: Point, hoffset?: number, voffset?: number, outerV?: boolean, outerH?: boolean): Point;
    /**
     *
     * @author 3tion
     *
     */
    export const Layout: {
        /**
         * 对DisplayObject，基于父级进行排布
         *
         * @static
         * @param {LayoutDisplay} dis 要布局的可视对象
         * @param {LayoutType} layout 布局方式
         * @param {number} [hoffset=0] 在原布局基础上，水平方向的再偏移量（内部运算是"+",向左传负）
         * @param {number} [voffset=0] 在原布局基础上，垂直方向的再偏移量（内部运算是"+",向上传负）
         * @param {boolean} [outerV=false] 垂直方向上基于父级内部
         * @param {boolean} [outerH=false] 水平方向上基于父级内部
         * @param {LayoutDisplayParent} [parent] 父级容器，默认取可视对象的父级
         */
        layout(dis: LayoutDisplay, layout: LayoutType, hoffset?: number, voffset?: number, outerV?: boolean, outerH?: boolean, parent?: LayoutDisplayParent): void;
        /**
         * 基于百分比进行布局
         *
         * @param {LayoutDisplay} dis
         * @param {number} [top=0] 百分比数值 `0.2` dis的顶距游戏边界顶部 20%
         * @param {number} [left=0] 百分比数值 `0.2` dis的左边缘距游戏左边缘 20%
         * @param {LayoutDisplayParent} [parent] 父级容器，默认取可视对象的父级
         * @param {number} [padx=0]
         * @param {number} [pady=0]
         * @returns
         */
        layoutPercent(dis: LayoutDisplay, top?: number, left?: number, parent?: LayoutDisplayParent, padx?: number, pady?: number): egret.DisplayObject;
        getLayoutPos: typeof getLayoutPos;
        /**
         * 基于鼠标位置的tip的布局方式
         *
         * @param {LayoutDisplay} dis 要被布局的可视对象
         * @param {Point} point 传入的点
         * @param {{ x: number, y: number }} [result]
         * @param {number} [padx=0] 间隔x
         * @param {number} [pady=0] 间隔y
         * @param {LayoutDisplayParent} [parent] 容器的大小
         */
        tipLayout(layoutDis: LayoutDisplay, point: Point, padx?: number, pady?: number, parent?: LayoutDisplayParent): void;
        /**
         * 基于point位置的布局方式，进行布局
         *
         * @param {number} disWidth
         * @param {number} disHeight
         * @param {number} parentWidth
         * @param {number} parentHeight
         * @param {Point} point 基准点位置
         * @param {Point} [result]
         * @param {number} [padx=0] 偏移X
         * @param {number} [pady=0] 偏移Y
         * @returns
         */
        getTipLayoutPos: typeof getTipLayoutPos;
        /**
         * 用于统一存储狗屎异形屏的UI偏移量数据
         */
        offsets: {
            top: number;
            left: number;
            right: number;
            bottom: number;
        };
    };
    export {};
}
declare namespace jy {
    /**
     * ## 主体UI的容器
     * 1. 当屏幕长或者宽任意一边小于`基准尺寸(basis)`时
     *      * 首先根据基准尺寸的窄边得到缩放比
     *      * 然后将容器按此缩放比进行缩放
     *      * 根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     * 2. 如果屏幕的长或者宽都大于或者等于`基准尺寸(basis)`时
     *      * 容器内UI不做缩放
     *      * 直接根据容器内UI的布局配置，基于当前屏幕大小进行重新布局
     *
     * @export
     * @class MainUIContainer
     * @extends {egret.Sprite}
     */
    class MainUIContainer extends LayoutContainer {
        onResize(): void;
        add(d: egret.DisplayObject, type: LayoutType, offsetRect?: egret.Rectangle, hide?: boolean): void;
        protected binLayout(bin: LayoutBin): void;
    }
}
declare namespace jy {
    /**
     *
     * @author
     *
     */
    interface IList {
        getItemViewAt(idx: number): egret.DisplayObject;
    }
}
declare namespace jy {
    /**
     * 按钮形式的菜单
     * @author gushuai
     * (description)
     *
     * @export
     * @class SkillItemMenuRender
     * @extends {MenuBaseRender<MenuBaseVO>}
     */
    class ButtonMenuRender<T extends MenuBaseVO> extends MenuBaseRender<T> {
        protected btn: Button;
        constructor(key?: string, className?: string);
        protected $setData(val: T): void;
    }
}
declare namespace jy {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @class Menu
     * @extends {egret.Sprite}
     */
    class Menu extends egret.Sprite {
        private static dic;
        /**
         * 回调参数，第1位是绑定的target
         * 第2位是Menu
         *
         * @static
         * @type {Function}
         */
        menuinitFunc: {
            (target: any, menu: Menu): any;
        };
        private style;
        private uiManager;
        private maxRenderCount;
        private renders;
        /**
         * (description)
         *
         * @static
         * @ param {egret.DisplayObject} target (Menu所在的父容器)
         * @ param {Menu} menu (menu实例)
         * @ param {Function} callBack (menu的displayMenuDatas具体实现函数（回调参数，第1位是绑定的target 第2位是Menu）)
         */
        static bind(target: SelectableComponents, menu: Menu, menuinit: {
            (target: any, menu: Menu): any;
        }): void;
        static unBind(target: SelectableComponents): void;
        /**
         * 当前显示的菜单项
         *
         * @static
         * @type {SelectableComponents}
         * @memberOf Menu
         */
        static currentShow: SelectableComponents;
        private static onShowOrHideMenu;
        constructor(style: MenuStyle<MenuBaseRender<MenuBaseVO>>, maxRendercount: number);
        protected bindComponent(): void;
        /**
         * 显示菜单操作项
         */
        displayMenuDatas(vos: MenuBaseVO[]): void;
    }
}
declare namespace jy {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @interface MenuBaseVO
     */
    interface MenuBaseVO {
        label: string;
        /**
         * 在操作菜单具体子项按钮时回调
         */
        callBack: {
            <T extends MenuBaseVO>(this: SelectableComponents, vo: T): any;
        };
    }
}
declare namespace jy {
    /**
     * @author gushuai
     * Menu样式
     *
     * @export
     * @interface MenuStyle
     * @template T
     */
    interface MenuStyle<T> {
        /**
         * 皮肤库
         *
         * @type {string}
         */
        uikey: string;
        /**
         * 渲染器
         *
         * @type {{new():T}}
         */
        renderClass: {
            new (): T;
        };
        /**
         * 背景
         *
         * @type {string}
         */
        scalebg: string;
        /**
         * x,y为第一个按钮的起始坐标
         * width,height为背景的宽高
         *
         * @type {egret.Rectangle}
         */
        possize: egret.Rectangle;
        /**
         * 0为水平1为垂直
         *
         * @type {number}
         */
        align?: number;
    }
}
declare namespace jy {
    /**
     * 错误提示
     * @author pb
     */
    class ErrorTips {
        _parent: egret.DisplayObjectContainer;
        constructor(parent: egret.DisplayObjectContainer);
        show(msg: string, color?: number, duration?: number, delay?: number): void;
        txtComplete(arg: any): void;
    }
}
declare namespace jy {
    /**
     * description
     * @author pb
     */
    interface SystemTips {
        /**
         * 初始化
         */
        init(): any;
        /**
         * 主要用来显示客户端的文本
         * @param msg			显示的文字
         *
         */
        showClient(msg: string): any;
        /**
         * 主要用来显示服务器的文本
         * @param msg			显示的文字
         *
         */
        showServer(msg: string): any;
    }
}
declare namespace jy {
    /**
     * ToolTip的皮肤
     * @author 3tion
     */
    interface IToolTip {
        /**
         * 设置Tip数据
         *
         * @param {*} value 数据内容
         */
        setTipData(value: any): void;
        /**
         * 显示
         */
        show(container: egret.DisplayObjectContainer, x?: number, y?: number): void;
        /**
         * 隐藏
         */
        hide(): void;
    }
}
declare namespace jy {
    /**
     * 简易的ToolTip
     * 只处理字符串类型的描述
     * @author 3tion
     */
    class SimToolTip extends egret.Sprite implements IToolTip {
        private tf;
        private _autoSize;
        private _corner;
        constructor(maxWidth?: number, maxHeight?: number, corner?: number, autoSize?: boolean);
        private init;
        setTipData(msg: string): void;
        private drawRect;
        show(container: egret.DisplayObjectContainer, x?: number, y?: number): void;
        hide(): void;
    }
}
declare namespace jy {
    /**
     * ToolTip的数据
     * @author 3tion
     */
    class ToolTipData implements IRecyclable {
        /**
         * 注册的可视对象
         *
         * @type {egret.DisplayObject}
         */
        target: egret.DisplayObject;
        /**
         * 用于显示的内容
         *
         * @type {*}
         */
        data: any;
        /**
         * ToolTip的皮肤
         *
         * @type {IToolTip}
         */
        tooltip: IToolTip;
        /**
         * tip的容器
         *
         * @type {egret.DisplayObjectContainer}
         */
        con: egret.DisplayObjectContainer;
        constructor();
        register(dis: egret.DisplayObject, msg: any, tooltip: IToolTip, container: egret.DisplayObjectContainer): void;
        private clearDisListener;
        onRecycle(): void;
        private checkTouch;
        private showTip;
        private touchEnd;
    }
}
declare namespace jy {
    /**
     * 默认的Tip
     * 手指按下控件以后，弹出Tip进行显示
     * @author 3tion
     *
     */
    class ToolTipManager {
        /**
         * 默认皮肤
         * 在项目中进行设置
         * @static
         * @type {IToolTipSkin}
         */
        static defaultTip: IToolTip;
        /**
         * 按住多少毫秒后显示Tip
         *
         * @static
         * @type {number}
         */
        static touchTime: number;
        /**
         * 当前显示在舞台上的ToolTip
         *
         * @private
         * @static
         * @type {IToolTipSkin}
         */
        private static _currentSkin;
        private static _map;
        /**
         * 注册可视对象，消息和皮肤的绑定
         *
         * @static
         * @param {egret.DisplayObject} dis 添加Tip的目标
         * @param {*} msg 要显示的内容
         * @param {IToolTip} [tooltip] Tip的皮肤，如果不填，则使用默认皮肤
         * @return {boolean} true 注册成功  false注册失败
         */
        static register(dis: egret.DisplayObject, msg: any, tooltip?: IToolTip, container?: egret.DisplayObjectContainer): boolean;
        /**
         * 显示Tip，如果msg有内容，刷新Tip上的内容
         *
         * @static
         * @param {egret.DisplayObject} dis
         * @param {*} [msg]
         */
        static show(dis: egret.DisplayObject, msg?: any, container?: egret.DisplayObjectContainer): void;
        /**
         * 刷新当前Tip绑定的内容，*`不改变显示状态`*
         * 如果要刷新并显示，请使用 ToolTipManager.show
         *
         * @static
         * @param {egret.DisplayObject} dis (description)
         * @param {*} msg (description)
         */
        static refresh(dis: egret.DisplayObject, msg: any): void;
        /**
         * 移除视图和ToolTip的绑定
         *
         * @static
         * @param {egret.DisplayObject} dis 可视对象
         */
        static remove(dis: egret.DisplayObject): void;
    }
}
declare namespace jy {
    /**
     * 可做TouchDown放大的对象接口
     */
    interface TouchDownItem extends egret.DisplayObject {
        $_tdi?: TouchDownData;
    }
    interface TouchDownBin {
        x?: number;
        y?: number;
        scaleX: number;
        scaleY: number;
    }
    interface TouchDownData {
        raw: TouchDownBin;
        tween: Tween;
    }
    /**
     * TouchDown显示对象放大效果
     */
    module TouchDown {
        /**
         * 绑定组件
         *
         * @param {TouchDownItem} item
         */
        function bind(item: TouchDownItem): void;
        /**
         * 解绑组件
         *
         * @param {TouchDownItem} item
         */
        function loose(item: TouchDownItem): void;
        /**
         * 重置组件
         *
         * @export
         * @param {TouchDownItem} item
         */
        function reset(item: TouchDownItem): void;
    }
}
declare namespace jy {
    /**
     * 多选分组
     *
     * @export
     * @class CheckBoxGroup
     * @extends {Group}
     * @author 3tion
     */
    class CheckBoxGroup extends Group {
        /**
         * 最大可选中的数量
         * undefined或者0表示无限制
         * @protected
         * @type {number}
         */
        protected maxSelected: number;
        /**
         * 选中的选项
         *
         * @protected
         * @type {IGroupItem[]}
         */
        protected _selected: IGroupItem[];
        constructor(maxSelected?: number);
        removeItem(item: IGroupItem): IGroupItem;
        protected $setSelectedItem(item?: IGroupItem): boolean;
        /**
         * 获取选中的选项
         *
         * @readonly
         */
        get selected(): ReadonlyArray<IGroupItem>;
        clear(): void;
    }
}
declare namespace jy {
    /**
     * 绑定按钮和文本框，让文本框的点击，可以触发按钮的选中事件
     *
     * @export
     */
    var GroupItemButton: {
        /**
         *
         * 绑定按钮和文本框
         * @param {Button} btn
         * @param {egret.TextField} txt
         */
        bind(btn: Button, txt: egret.TextField): void;
        /**
         * 接触按钮和文本框的绑定
         *
         * @param {Button} btn
         */
        loose(btn: Button): void;
    };
}
declare namespace jy {
    /**
     * description
     * @author pb
     */
    interface IGroupItem extends egret.EventDispatcher {
        /**
         * 是否选中
         *
         * @type {boolean}
         */
        selected: boolean;
        /**
         * 是否不可被选中
         */
        unelectable?: boolean;
    }
}
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
declare namespace jy {
    interface IEaseFunction {
        (t: number, ...args: any[]): number;
    }
    /**
     * tween的执行效果，参考页面：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html
     *
     * @export
     * @class Ease
     */
    class Ease {
        /**
         * 根据起始值和终值，及当前进度率得到结果
         *
         * @static
         * @param {number} v0       起始值
         * @param {number} v1       终值
         * @param {number} ratio    进度率
         * @returns
         */
        static getValue(v0: number, v1: number, ratio: number): number;
        static get(amount: number): IEaseFunction;
        static getPowIn(pow: number): IEaseFunction;
        static getPowOut(pow: number): IEaseFunction;
        static getPowInOut(pow: number): IEaseFunction;
        static quadIn: IEaseFunction;
        static quadOut: IEaseFunction;
        static quadInOut: IEaseFunction;
        static cubicIn: IEaseFunction;
        static cubicOut: IEaseFunction;
        static cubicInOut: IEaseFunction;
        static quartIn: IEaseFunction;
        static quartOut: IEaseFunction;
        static quartInOut: IEaseFunction;
        static quintIn: IEaseFunction;
        static quintOut: IEaseFunction;
        static quintInOut: IEaseFunction;
        static sineIn(t: number): number;
        static sineOut(t: number): number;
        static sineInOut(t: number): number;
        static getBackIn(amount: number): IEaseFunction;
        static backIn: IEaseFunction;
        static getBackOut(amount: number): IEaseFunction;
        static backOut: IEaseFunction;
        static getBackInOut(amount: number): IEaseFunction;
        static backInOut: IEaseFunction;
        static circIn(t: number): number;
        static circOut(t: number): number;
        static circInOut(t: number): number;
        static bounceIn(t: number): number;
        static bounceOut(t: number): number;
        static bounceInOut(t: number): number;
        static getElasticIn(amplitude: number, period: number): IEaseFunction;
        static elasticIn: IEaseFunction;
        static getElasticOut(amplitude: number, period: number): IEaseFunction;
        static elasticOut: IEaseFunction;
        static getElasticInOut(amplitude: number, period: number): IEaseFunction;
        static elasticInOut: IEaseFunction;
    }
}
declare namespace jy {
    /**
     * 区段 -1 ~ -19
     *
     * @export
     * @enum {number}
     */
    const enum EventConst {
        TWEEN_CHANGE = -1
    }
}
declare namespace jy {
    /**
     * Tween的插件
     * @author 3tion
     */
    interface ITweenPlugin {
        /**
         * 插件执行优先级
         * 数字越大，执行优先级越高
         * @type {number}
         */
        priority?: number;
        /**
         * Called by TweenJS when a new tween property initializes that this plugin is registered for. Generally, the call
         * to <code>Plugin.init</code> will be immediately followed by a call to <code>Plugin.step</code>.
         * @method init
         * @param {Tween} tween The related tween instance.
         * @param {String} prop The name of the property that is being initialized.
         * @param {any} value The current value of the property on the tween's target.
         * @return {any} The starting tween value for the property. In most cases, you would simply
         * return the value parameter, but some plugins may need to modify the starting value.
         * @static
         **/
        init(tween: Tween, prop: string, value: any): any;
        /**
         * Called when a tween property advances that this plugin is registered for.
         * @method tween
         * @param {Tween} tween The related tween instance.
         * @param {String} prop The name of the property being tweened.
         * @param {any} value The current tweened value of the property, as calculated by TweenJS.
         * @param {Object} startValues A hash of all of the property values at the start of the current
         * step. You could access the start value of the current property using
         * startValues[prop].
         * @param {Object} endValues A hash of all of the property values at the end of the current
         * step.
         * @param {Number} ratio A value indicating the eased progress through the current step. This
         * number is generally between 0 and 1, though some eases will generate values outside
         * this range.
         * @param {Boolean} wait Indicates whether the current step is a "wait" step.
         * @param {Boolean} end Indicates that the tween has reached the end.
         * @return {any} Return the value that should be assigned to the target property. For example
         * returning <code>Math.round(value)</code> would assign the default calculated value
         * as an integer. Returning Tween.IGNORE will prevent Tween from assigning a value to
         * the target property.
         * @static
         **/
        tween(tween: Tween, prop: string, value: any, startValues: {
            [index: string]: any;
        }, endValues: {
            [index: string]: any;
        }, ratio: number, wait: boolean, end: boolean): any;
        /**
         * Called by TweenJS when a new step is added to a tween that includes a property the plugin is registered for (ie.
         * a new "to" action is added to a tween).
         * @method init
         * @param {Tween} tween The related tween instance.
         * @param {String} prop The name of the property being tweened.
         * @param {any} startValue The value of the property at the beginning of the step. This will
         * be the same as the init value if this is the first step, or the same as the
         * endValue of the previous step if not.
         * @param {Object} injectProps A generic object to which the plugin can append other properties which should be updated on this step.
         * @param {any} endValue The value of the property at the end of the step.
         * @static
         **/
        step(tween: Tween, prop: string, startValue: any, endValue: any, injectProps: any): any;
    }
}
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
declare namespace jy {
    const enum TweenActionMode {
        /**
         * Constant defining the none actionsMode for use with setPosition.
         */
        NONE = 0,
        /**
         * Constant defining the loop actionsMode for use with setPosition.
         */
        LOOP = 1,
        /**
         * Constant defining the reverse actionsMode for use with setPosition.
         */
        REVERSE = 2
    }
    interface TweenAction {
        /**
         * 回调函数
         */
        f: Function;
        /**
         * 回调函数的this指针
         */
        o: Object;
        /**
         * 执行的持续时间
         */
        t?: number;
        /**
         * 回调函数的参数列表
         */
        p: any[];
    }
    interface TweenStep {
        /**
         * 执行的持续时间
         */
        t: number;
        p0: Object;
        p1: Object;
        e: IEaseFunction;
        /**
         * The duration of the wait in milliseconds (or in ticks if `useTicks` is true)
         */
        d: number;
        v?: boolean;
    }
    interface TweenOption {
        /**
         * 是否循环执行
         * sets the loop property on this tween
         * @type {boolean}
         * @memberOf TweenOption
         */
        loop?: boolean;
        /**
         * uses ticks for all durations instead of milliseconds.
         *
         * @type {boolean}
         * @memberOf TweenOption
         */
        useTicks?: boolean;
        /**
         * 是否忽略全局暂停
         * sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on this tween.
         *
         * @type {boolean}
         * @memberOf TweenOption
         */
        ignoreGlobalPause?: boolean;
        /**
         * 如果设置为true,则绑定到同一目标的其他tween将被移除
         * if true, `Tween.removeTweens(target)` will be called to remove any other tweens with the same target
         * @type {boolean}
         * @memberOf TweenOption
         */
        override?: boolean;
        /**
         * 设置tween是否暂停
         * indicates whether to start the tween paused
         * @type {boolean}
         * @memberOf TweenOption
         */
        paused?: boolean;
        /**
         * 设置Tween的初始位置
         * indicates the initial position for this tween
         * @type {number}
         * @memberOf TweenOption
         */
        position?: number;
        /**
         * 指定是否监听change事件回调
         * specifies a listener for the "change" event
         * @type {Function}
         * @memberOf TweenOption
         */
        onChange?: {
            (e?: egret.Event): any;
        };
        /**
         * onChange的回调执行对象
         *
         * @type {*}
         * @memberOf TweenOption
         */
        onChangeObj?: any;
        /**
         * 是否将数值处理为整形
         *
         * @type {{ [index: string]: number }}
         * @memberOf TweenOption
         */
        int?: {
            [index: string]: number;
        };
    }
    class Tween extends egret.EventDispatcher {
        /**
         * Constant returned by plugins to tell the tween not to use default assignment.
         * @property IGNORE
         * @type Object
         * @static
         */
        static IGNORE: {};
        protected _manager: TweenManager;
        target: any;
        _registered: boolean;
        _useTicks: boolean;
        ignoreGlobalPause: boolean;
        loop: boolean;
        pluginData: any;
        /**
         * 当前序列的属性值
         *
         * @type {{ [index: string]: any }}
         */
        _curQueueProps: any;
        /**
         * 初始状态的属性值
         *
         * @private
         * @type {{ [index: string]: any }}
         */
        protected _initQueueProps: {
            [index: string]: any;
        };
        protected _steps: TweenStep[];
        protected _actions: TweenAction[];
        paused: boolean;
        duration: number;
        protected _prevPos: number;
        position: number;
        protected _prevPosition: number;
        protected _stepPosition: number;
        protected _int: {
            [index: string]: number;
        };
        passive: boolean;
        constructor(target: any, props: TweenOption, pluginData: any, manager: TweenManager);
        private initialize;
        /**
         * 将tween设置到一个指定的时间点
         * Advances the tween to a specified position.
         * @method setPosition
         * @param {Number} value The position to seek to in milliseconds (or ticks if useTicks is true).
         * @param {Number} [actionsMode=1] Specifies how actions are handled (ie. call, set, play, pause):
         * <ul>
         *      <li>{{#crossLink "Tween/NONE:property"}}{{/crossLink}} (0) - run no actions.</li>
         *      <li>{{#crossLink "Tween/LOOP:property"}}{{/crossLink}} (1) - if new position is less than old, then run all
         *      actions between old and duration, then all actions between 0 and new.</li>
         *      <li>{{#crossLink "Tween/REVERSE:property"}}{{/crossLink}} (2) - if new position is less than old, run all
         *      actions between them in reverse.</li>
         * </ul>
         * @return {Boolean} Returns `true` if the tween is complete (ie. the full tween has run & {{#crossLink "Tween/loop:property"}}{{/crossLink}}
         * is `false`).
         */
        setPosition(value: number, actionsMode?: TweenActionMode): boolean;
        private _runActions;
        private _updateTargetProps;
        private _addStep;
        private _appendQueueProps;
        private _addAction;
        private _set;
        /**
         * 暂停或者播放tween
         * Pauses or plays this tween.
         * @method setPaused
         * @param {Boolean} [value=true] Indicates whether the tween should be paused (`true`) or played (`false`). true 暂停   false 播放
         * @return {Tween} This tween instance (for chaining calls)
         */
        setPaused(value: boolean): Tween;
        /**
         * 排列一个等待时间
         * Queues a wait (essentially an empty tween).
         * <h4>Example</h4>
         *
         *		//This tween will wait 1s before alpha is faded to 0.
         *		createjs.Tween.get(target).wait(1000).to({alpha:0}, 1000);
         *
         * @method wait
         * @param {Number} duration The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
         * @param {Boolean} [passive] Tween properties will not be updated during a passive wait. This
         * is mostly useful for use with {{#crossLink "Timeline"}}{{/crossLink}} instances that contain multiple tweens
         * affecting the same target at different times.
         * @return {Tween} This tween instance (for chaining calls).
         **/
        wait(duration: number, passive?: boolean): Tween;
        /**
         * 让目标在duration的时间内，按照ease的差值算法，变为指定的属性
         * Queues a tween from the current values to the target properties. Set duration to 0 to jump to these value.
         * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
         * properties will be set at the end of the specified duration.
         * <h4>Example</h4>
         *
         *		createjs.Tween.get(target).to({alpha:0}, 1000);
         *
         * @method to
         * @param {Object} props An object specifying property target values for this tween (Ex. `{x:300}` would tween the x
         * property of the target to 300).
         * @param {number} [duration=0] The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
         * @param {IEaseFunction} [ease="linear"] The easing function to use for this tween. See the {{#crossLink "Ease"}}{{/crossLink}}
         * class for a list of built-in ease functions.
         * @return {Tween} This tween instance (for chaining calls).
         */
        to(props: Object, duration?: number, ease?: IEaseFunction): Tween;
        /**
         * 排列一个指定的函数进行执行
         * Queues an action to call the specified function.
         * <h4>Example</h4>
         *
         *   	//would call myFunction() after 1 second.
         *   	myTween.wait(1000).call(myFunction);
         *
         * @method call
         * @param {Function} callback The function to call.
         * @param {Array} [params]. The parameters to call the function with. If this is omitted, then the function
         *      will be called with a single param pointing to this tween.
         * @param {Object} [scope]. The scope to call the function in. If omitted, it will be called in the target's
         *      scope.
         * @return {Tween} This tween instance (for chaining calls).
         */
        call(callback: Function, thisObj?: any, ...params: any[]): Tween;
        /**
         * 设置属性
         * Queues an action to set the specified props on the specified target. If target is null, it will use this tween's
         * target.
         * <h4>Example</h4>
         *
         *		myTween.wait(1000).set({visible:false},foo);
         *
         * @method set
         * @param {Object} props The properties to set (ex. `{visible:false}`).
         * @param {Object} [target] The target to set the properties on. If omitted, they will be set on the tween's target.
         * @return {Tween} This tween instance (for chaining calls).
         */
        set(props: any, target?: any): Tween;
        /**
         * 排列一个其他的tween来执行（如果不赋值，则执行自己）
         * Queues an action to play (unpause) the specified tween. This enables you to sequence multiple tweens.
         * <h4>Example</h4>
         *
         *		myTween.to({x:100},500).play(otherTween);
         *
         * @method play
         * @param {Tween} tween The tween to play.
         * @return {Tween} This tween instance (for chaining calls).
         */
        play(tween?: Tween): Tween;
        /**
         * 排列一个tween的暂停操作，如果tween不赋值，则暂停自己
         * Queues an action to pause the specified tween.
         * @method pause
         * @param {Tween} tween The tween to pause. If null, it pauses this tween.
         * @return {Tween} This tween instance (for chaining calls)
         */
        pause(tween?: Tween): Tween;
        /**
         * 进行一次tick
         * Advances this tween by the specified amount of time in milliseconds (or ticks if`useTicks` is `true`).
         * This is normally called automatically by the Tween engine (via {{#crossLink "Tween/tick"}}{{/crossLink}}), but is
         * exposed for advanced uses.
         * @method tick
         * @param {Number} delta The time to advance in milliseconds (or ticks if `useTicks` is `true`).
         */
        tick(delta: number): void;
        onRecycle(): void;
    }
}
declare namespace jy {
    interface MotionGuidePluginTween extends Tween {
        /**
         * 是否需要旋转
         *
         * @type {boolean}
         * @memberOf Tween
         */
        __needsRot: boolean;
        __rotGlobalS: number;
        __rotGlobalE: number;
        __rotPathE: number;
        __rotPathS: number;
        __guideData: any;
    }
    interface MotionGuidePluginTarget {
        x?: number;
        y?: number;
        rotation?: number;
    }
    const MotionGuidePlugin: {
        priority: number;
        install(manager: TweenManager): void;
        init(tween: MotionGuidePluginTween, prop: string, value: any): any;
        step(tween: MotionGuidePluginTween, prop: string, startValue: any, endValue: any, injectProps: any): any;
        tween(tween: MotionGuidePluginTween, prop: string, value: any, startValues: any, endValues: any, ratio: number, wait: boolean, end: boolean): any;
    };
}
