interface $gmType {
    /**
     * 主控类型，包括Proxy和Mediator
     *
     * @type {{ [index: string]: junyou.FHost }}
     * @memberof $gmType
     */
    $: {
        [index: string]: junyou.FHost;
    };
}
declare module junyou {
    type InjectProxy = {
        new(): IAsync;
    } | string | number;
    /**
     * Mediator和Proxy的基类
     * @author 3tion
     *
     */
    abstract class FHost implements IDepender {
        protected _name: string | number;
        /**
         * 用于处理依赖注入的Proxy
         *
         * @protected
         * @type {({[index:string]:{ new (): IAsync } | string})}
         * @memberOf FHost
         */
        protected _injectProxys: {
            [index: string]: InjectProxy;
        };
        /**
         * 唯一标识
         */
        readonly name: string | number;
        constructor(name: string | number);
        /**
         * 检查依赖注入的数据
         *
         * @protected
         *
         * @memberOf FHost
         */
        protected checkInject(): void;
        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;
        addReadyExecute(handle: Function, thisObj: any, ...args: any[]): void;
        /**
         * 作为依赖者的Helper
         */
        protected _dependerHelper: DependerHelper;
        readonly isReady: boolean;
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
    function __dependProxy(ref: {
        new(): IAsync;
    } | string | number): (target: any, key: string) => void;
}
declare module junyou {
    /**
     *
     * 附加依赖的Proxy
     * @export
     * @param {({ new (): IAsync } | string)} ref
     * @returns
     */
    var d_dependProxy: typeof __dependProxy;
}
declare function parseInt(s: number, radix?: number): number;
/**
 * 对数字进行补0操作
 * @param value 要补0的数值
 * @param length 要补的总长度
 * @return 补0之后的字符串
 */
declare function zeroize(value: number | string, length?: number): string;
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
    copyto(to: Object): any;
    /**
     * 获取指定属性的描述，会查找当前数据和原型数据
     * @param property 指定的属性名字
     */
    getPropertyDescriptor(property: string): PropertyDescriptor;
    /**
     * 检查两个对象是否相等，只检查一层
     *
     * @param {Object} checker
     * @param {...(keyof this)[]} args  如果不设置key列表，则使用checker可遍历的key进行检查
     *
     * @memberOf Object
     */
    equals(checker: Object, ...args: (keyof this)[]): any;
}
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
    zeroize: (value: number, length: number) => string;
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
    DESC = 1,
}
interface ArrayConstructor {
    binaryInsert<T>(partArr: T[], item: T, filter: {
        (tester: T, ...args): boolean;
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
}
declare module junyou {
    function is(instance: any, ref: {
        new(): any;
    }): boolean;
    /**
     * 移除可视对象
     *
     * @export
     * @param {egret.DisplayObject} display
     */
    function removeDisplay(display: egret.DisplayObject): void;
}
interface Console {
    table(...args: any[]): any;
}
interface Map<K, V> {
    set(key: K, value: V): Map<K, V>;
    get(key: K): V;
    has(key: K): boolean;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): any;
    clear(): any;
}
interface MapConstructor {
    new <K, V>(): Map<K, V>;
}
declare const Map: MapConstructor;
declare module egret {
    interface Bitmap {
        /**
         * 刷新纹理
         */
        refreshBMD(): any;
    }
    interface TextField {
        /**
         *
         * 设置Html文本(慎用，废性能)
         * @param {string | number} value
         */
        setHtmlText(value: string | number): any;
    }
    interface EventDispatcher {
        /**
         * 删除所有事件监听
         *
         *
         * @memberOf EventDispathcer
         */
        removeAllListeners(): any;
        /**
         * @language zh_CN
         * 派发一个指定参数的事件。
         * @param type {string | number} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatch(type: string | number, bubbles?: boolean, data?: any, cancelable?: boolean): boolean;
        /**
         * 移除指定type的监听器
         *
         * @param {(string | number)} type
         * @param {boolean} [useCapture]
         *
         * @memberOf EventDispatcher
         */
        removeListeners(type: string | number, useCapture?: boolean): any;
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
        on<T>(type: string | number, listener: {
            (this: T, e?: egret.Event);
        }, thisObject?: T, useCapture?: boolean, priority?: number): void;
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
        hasListen(type: string | number): any;
    }
    interface Graphics {
        /**
         * 使用  junyou.Rect 作为参数 进行绘制矩形
         *
         * @param { junyou.Rect} rect
         * @memberof Graphics
         */
        drawRectangle(rect: junyou.Rect): any;
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
declare module junyou {
    /**
     * 基础创建器
     * @author 3tion
     *
     */
    class BaseCreator<T extends egret.DisplayObject> {
        protected _suiData: SuiData;
        readonly suiData: SuiData;
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
declare module junyou {
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
         * 组件原始的大小，从`flash`导出的矩形大小
         *
         * @type {egret.Rectangle}@memberof Component
         */
        suiRawRect?: egret.Rectangle;
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
         *
         * @protected
         * @type {boolean}
         * @memberOf Component
         */
        protected _useDisableFilter: boolean;
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
        readonly guid: string;
        constructor();
        init(c: BaseCreator<egret.DisplayObject>): void;
        protected stageEvent(remove?: boolean): void;
        protected awake(): void;
        protected sleep(): void;
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
        protected _enabled: boolean;
        enabled: boolean;
        protected $setEnabled(value: boolean): void;
        readonly view: this;
    }
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
        ($gmNSLog, ...args): boolean;
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
        ($gmNSLog: $NSLog, ...args): boolean;
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
        ($gmNSLog: $NSLog, ...args): boolean;
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
        ($gmNSLog: $NSLog, ...args): boolean;
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
declare module junyou {
    const enum NSType {
        Null = 0,
        Boolean = 1,
        String = 2,
        Bytes = 4,
        Double = 5,
        Int32 = 6,
        Uint32 = 7,
        Int64 = 8,
    }
    const NSBytesLen: {
        0: number;
        1: number;
        5: number;
        6: number;
        7: number;
        8: number;
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
            (cmd: number, data?: any, msgType?: string | number, limit?: number);
        };
        protected _nolimitSendFunc: {
            (cmd: number, data?: any, msgType?: string | number, limit?: number);
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
         * 接收消息的创建器
         *
         */
        protected _receiveMSG: {
            [index: number]: string | number;
        };
        /**
         * 设置地址
         *
         * @abstract
         * @param {string} actionUrl
         */
        abstract setUrl(actionUrl: string): any;
        constructor();
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
        regReceiveMSGRef(cmd: number, ref: string | number): void;
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
        send(cmd: number, data?: any, msgType?: string | number, limit?: number): void;
        /**
         * 即时发送指令
         */
        protected abstract _send(cmd: number, data: any, msgType: string | number): any;
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
        sendPassive(cmd: number, data?: any, msgType?: string | number): void;
        /**
         * 向缓冲数组中写入数据
         */
        protected writeToBuffer(bytes: ByteArray, data: NetSendData): void;
        /**
         * @private
         * @param bytes
         * @param out
         */
        protected decodeBytes(bytes: ByteArray): void;
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
    interface ReconectEvent extends egret.Event {
        /**
         * 重连次数
         *
         * @type {number}
         * @memberOf ReconectEvent
         */
        data: number;
    }
}
declare module junyou {
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
        readonly states: (string | number)[];
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
declare module junyou {
    /**
    * GameLayer
    * 用于后期扩展
    */
    class GameLayer extends egret.Sprite {
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
    class UILayer extends GameLayer {
        readonly width: number;
        readonly height: number;
    }
    /**
     * 需要对子对象排序的层
     */
    class SortedLayer extends GameLayer {
        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject;
        /**
         * 进行排序
         */
        sort(): void;
    }
}
declare module junyou {
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
        private static onSlowRender();
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
        protected idx: number;
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
        /**
         * 设置播放速度
         */
        playSpeed: number;
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
declare module junyou {
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
            [index: string]: UnitResource;
        } | UnitResource;
        /**
         * pst的唯一标识
         */
        key: string;
        /**
         * 动作信息，帧的播放信息的数组
         * Key      {number}        动作标识
         * Value    {ActionInfo}    动作信息
         */
        frames: {
            [index: number]: ActionInfo;
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
         * @type {[index:string]:egret.Point}
         */
        protected castPoints: {
            [index: number]: egret.Point;
        };
        /**
         * 获取施法点
         * @param {number} action 动作标识
         * @param {number} direction 方向
         * @return {egret.Point} 如果有施法点
         */
        getCastPoint(action: number, direction: number): egret.Point;
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
        getResource(uri: string): UnitResource;
        /**
         * 获取单位资源
         */
        getUnitResource(uri: any): UnitResource;
    }
    /**
     * 资源打包分隔信息
     */
    abstract class SplitInfo {
        /**
         * 资源字典
         */
        protected _resDict: {
            [index: number]: string;
        };
        /**
         * 子资源列表
         */
        protected _subReses: string[];
        /**
         * key
         */
        protected _key: string;
        /**
         * 动作/方向的字典<br/>
         * key      {string}  资源uri<br/>
         * value    {Array}   action<<8|direction
         *
         */
        adDict: {
            [index: string]: number[];
        };
        /**
         * 处理分隔信息
         * @param data
         */
        abstract parseSplitInfo(data: any[]): any;
        constructor(key: string);
        /**
         * 处理帧数据
         * @param data
         */
        parseFrameData(data: any[]): {
            [index: number]: ActionInfo;
        };
        /**
         * 根据方向和动作获取原始资源
         * @param direction 方向
         * @param action    动作
         */
        abstract getResource(direction: number, action: number): string;
    }
    const PstUtils: {
        getADKey(action: number, direction: number): number;
        getAFromADKey(adKey: number): number;
        getDFromADKey(adKey: number): number;
    };
    /**
     * 单方向单动作分隔数据
     * 后面只用这种打包方式
     */
    class OneADSInfo extends SplitInfo {
        protected _n: string;
        protected _a: any[];
        protected _d: any[];
        parseFrameData(data: any): {
            [index: number]: ActionInfo;
        };
        parseSplitInfo(infos: any): void;
        getResource(direction: number, action: number): string;
    }
}
declare module junyou {
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
        readonly target: ShakeTarget;
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
        readonly total: number;
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
declare module junyou {
    /**
     * 扩展名常量
     * @author 3tion
     */
    const enum Ext {
        JPG = ".jpg",
        PNG = ".png",
        WEBP = ".webp",
    }
}
declare module junyou {
    /**
     * 骑乘状态
     */
    const enum MountType {
        /**
         * 在地面上
         */
        ground = 0,
        /**
         * 在坐骑上
         */
        ride = 1,
    }
    /**
     * 动作类型
     */
    const enum ActionType {
        /**
         * 待机
         */
        standBy = 0,
        /**
         * 移动
         */
        move = 1,
        /**
         * 攻击
         */
        attack = 2,
        /**
         * 跳
         */
        jump = 3,
    }
    /**
     * 单位动作
     * @author 3tion
     *
     */
    class UnitAction {
        static defaultAction: {
            mountType: MountType;
            action: number;
        };
        /**
         * 根据坐骑状态，获取人物动作序列的配置
         *
         * @param {MountType} mountType 坐骑状态
         * @returns {IUnitActionInfo} 动作结果
         */
        getAction(mountType: MountType): IUnitActionInfo;
        /**
         * 单位播放动作
         * 如果子类要制作动态的自定义动作，重写此方法
         * @param {Unit} unit               单位
         * @param {MountType} mountType     骑乘状态
         * @param {number} now              时间戳
         */
        playAction(unit: Unit, mountType: MountType, now: number): void;
        /**
         * 播放动作
         */
        start(unit: Unit, now: number): void;
        /**
         * 动作执行数据计算<br/>
         * 如更新单位坐标等
         */
        doData(unit: Unit, now: number): void;
        /**
         * 检查当前动作是否可以结束<br/>
         * @return true 可以结束<br/>
         *         false 不可结束
         */
        readonly canStop: Boolean;
        /**
         * 强制结束
         */
        terminate(): void;
        /**
         * 动画播放结束的回调
         */
        playComplete(unit: Unit, now: number): void;
        protected _isEnd: Boolean;
        /**
         * 动作是否已经结束
         * @return true，动作已经结束，可以做下一个动作<br/>
         *         false, 动作未结束，
         */
        readonly isEnd: Boolean;
        /**
         * 执行事件
         */
        dispatchEvent(unit: Unit, eventType: string, now: number): void;
        /**
         * 渲染时执行
         */
        doRender(unit: Unit, now: number): void;
        recycle(): void;
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
    IO_ERROR = "ioError",
}
declare const enum EgretResType {
    /**
     * XML file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * XML 文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_XML = "xml",
    /**
     * Picture file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 图片文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_IMAGE = "image",
    /**
     * Binary file.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * 二进制文件。
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    TYPE_BIN = "bin",
    /**
     * Text file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 文本文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_TEXT = "text",
    /**
     * JSON file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * JSON 文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_JSON = "json",
    /**
     * SpriteSheet file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * SpriteSheet 文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_SHEET = "sheet",
    /**
     * BitmapTextSpriteSheet file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * BitmapTextSpriteSheet 文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_FONT = "font",
    /**
     * Sound file.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 声音文件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TYPE_SOUND = "sound",
}
declare module junyou {
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
        readonly isReady: boolean;
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
        private allReadyHandler();
    }
}
declare module junyou {
    interface ViewController {
        /**
         * 面板加入到舞台时执行
         */
        awake?(): any;
        /**
         * 面板从舞台移除时执行
         */
        sleep?(): any;
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
        removeSkinListener(skin: egret.DisplayObject): void;
        addSkinListener(skin: egret.DisplayObject): void;
        readonly isReady: boolean;
        stageHandler(e: egret.Event): void;
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
    }
    /**
     * 使用注入的方法
     * 添加关注
     * 关注为事件处理回调，只会在awake时，添加到事件监听列表
     * 在sleep时，从事件监听列表中移除
     * @param {string} type                         关注的事件
     * @param {(e?: Event) => void} handler          回调函数
     * @param {boolean} [triggerOnStage=false]      添加到舞台的时候，会立即执行一次，<font color="#f00">注意，处理回调必须能支持不传event的情况</font>
     * @param {number} [priority=0]                 优先级，默认为0
     */
    function interest(eventType: string | number, triggerOnStage?: boolean, priority?: number): (target: any, key: string, value: any) => void;
}
declare module junyou {
    /**
    * 使用@d_interest 注入 添加关注
    * 关注为事件处理回调，只会在awake时，添加到事件监听列表
    * 在sleep时，从事件监听列表中移除
    * @param {string} type                         关注的事件
    * @param {(e?: Event) => void} handler          回调函数
    * @param {boolean} [triggerOnStage=false]      添加到舞台的时候，会立即执行一次，<font color="#f00">注意，处理回调必须能支持不传event的情况</font>
    * @param {number} [priority=0]                 优先级，默认为0
    */
    var d_interest: typeof interest;
}
declare module junyou {
    class Scroller extends egret.EventDispatcher {
        /**
         * touchdown的起始时间
         *
         * @protected
         * @type {number}
         */
        protected _st: number;
        /**
         * touchTap的超时时间，如果超过此时间，则不会触发子对象的touchTap事件
         *
         */
        touchTapTime: number;
        protected _touchChildren: boolean;
        protected _scrollbar: ScrollBar;
        protected _content: egret.DisplayObject;
        protected _scrollType: ScrollDirection;
        protected _lastMoveTime: number;
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
        protected _moveSpeed: number;
        protected _lastFrameTime: number;
        protected _deriction: ScrollDirection;
        protected _key: PosKey;
        protected _sizeKey: SizeKey;
        constructor();
        /**
         * 滚动条方式 0：垂直，1：水平 defalut:0
         */
        /**
         * 滚动条方式 0：垂直，1：水平 defalut:0
         */
        scrollType: ScrollDirection;
        protected checkScrollBarView(): void;
        protected onScrollBarAdded(): void;
        /**
         * 绑定目标与滚动条
         *
         * @ content (需要滚动的目标)
         * @ scrollRect (显示的区域大小)
         * @ scrollbar (可选，如果不想显示滚动条可不传)
         */
        bindObj(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar): void;
        /**
         * 对content绘制鼠标触发区域
         * 将会对content的graphics先进行清理
         * 然后基于content的bounds进行绘制
         *
         */
        drawTouchArea(content?: egret.Shape): void;
        bindObj2(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar): void;
        protected contentSizeChange(): void;
        protected onTargetTouchBegin(e: egret.TouchEvent): void;
        protected moveOnContent(e: egret.TouchEvent): void;
        stopTouchTween(): void;
        protected onEnterFrame(): void;
        protected endTouchContent(e: egret.TouchEvent): void;
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
        protected readonly scrollEndPos: number;
        protected checkAndResetBarPos(): void;
    }
}
declare module junyou {
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
        readonly dataLen: number;
        /**
         * 获取数据集
         *
         * @readonly
         */
        readonly data: T[];
        /**
         * 渲染指定位置的render
         *
         * @ private
         * @ param {number} start (起始索引)
         * @ param {number} end (结束索引)
         */
        protected doRender(start: number, end?: number): void;
        selectedIndex: number;
        /**
         *
         * 根据索引获得视图
         * @param {number} idx
         * @returns
         */
        getItemAt(idx: number): R;
        selectItemByData<K extends keyof T>(key: K, value: T[K], useTween?: boolean): void;
        /**
         * 遍历列表
         *
         * @param {{(data:T,render:R,idx:number,...args)}} handle
         * @param {any} otherParams
         */
        forEach(handle: {
            (data: T, render: R, idx: number, ...args);
        }, ...otherParams: any[]): void;
        /**
         * 找到第一个符合要求的render
         *
         * @param {{(data:T,render:R,idx:number,...args):boolean}} handle
         * @param {any} otherParams
         * @returns
         */
        find(handle: {
            (data: T, render: R, idx: number, ...args): boolean;
        }, ...otherParams: any[]): R;
        readonly selectedItem: R;
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        abstract updateByIdx(index: number, data: T): any;
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
        abstract clear(): any;
        /**
         * 销毁
         *
         * @abstract
         */
        abstract dispose(): any;
        abstract displayList(data?: T[]): any;
        protected onTouchItem(e: egret.TouchEvent): void;
        protected changeRender(render: R, index?: number): void;
        getAllItems(): R[];
        readonly length: number;
        /**
         * 让所有在舞台上的render重新刷新一次数据
         *
         *
         * @memberOf PageList
         */
        refresh(): void;
        /**
         * 根据index使某个在舞台上的render刷新
         *
         * @param {number}  idx
         * @param {boolean} [force]     是否强制执行setData和handleView
         * @memberOf PageList
         */
        refreshAt(idx: number, force?: boolean): void;
        /**
         * render进行切换
         *
         * @protected
         */
        protected onChange(): void;
    }
}
declare module junyou {
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
            new(): T;
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
     * @param {{ prototype: B }} clazzB     扩展的模板
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
declare module junyou {
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
        FAILED = -1,
    }
}
declare module junyou {
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
        protected onAddedToStage(e: egret.Event): void;
        protected onRemoveFromStage(e: egret.Event): void;
    }
}
declare module junyou {
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
        useDisableFilter(value: boolean): void;
        constructor();
        bindChildren(): void;
        /**
         * 获取按钮上的标签
         */
        /**
         * 设置按钮上的标签
         */
        label: string;
        protected $setEnabled(value: boolean): void;
        /**
         * 获取当前按钮选中状态
         */
        /**
         * 设置选中
         */
        selected: boolean;
        protected $setSelected(value: boolean): void;
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
        addChild(child: egret.DisplayObject): egret.DisplayObject;
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
        $layoutHost: junyou.LayoutContainer;
    }
}
declare module junyou {
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
        protected getFixedNarrow(sw: number, sh: number, bw: number, bh: number, ySmall?: boolean): {
            dw: number;
            dh: number;
            scale: number;
            lw: number;
            lh: number;
        };
        protected onStage(): void;
        protected offStage(): void;
        abstract onResize(): any;
        readonly view: egret.Sprite;
        /**
         * 移除视图
         *
         * @param {egret.DisplayObject} dis
         * @returns
         */
        remove(dis: egret.DisplayObject): LayoutBin;
        addLayout(dis: egret.DisplayObject, type?: LayoutType, size?: Size, hoffset?: any, voffset?: any, outerV?: boolean, outerH?: boolean, hide?: boolean): void;
        protected onAdded(e: egret.Event): void;
        protected binLayout(bin: LayoutBin): void;
        protected $doLayout(): void;
        protected layoutAll(): void;
    }
    interface LayoutBin {
        dis: egret.DisplayObject;
        type: LayoutType;
        hoffset?: number;
        voffset?: number;
        offsetType?: number;
        outerV?: boolean;
        outerH?: boolean;
        size: Size;
    }
}
declare module junyou {
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
        data: T;
        /**
         * 只允许子类重写
         * @protected
         */
        protected $setData(val: T): void;
        skin: egret.DisplayObject;
        protected $setSkin(value: egret.DisplayObject): void;
        protected bindComponent(): void;
        readonly view: egret.DisplayObject;
    }
}
declare module junyou {
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
        readonly length: number;
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
        selectedItem: IGroupItem;
        protected $setSelectedItem(item?: IGroupItem): boolean;
        /**
         * 设置选中索引
         */
        selectedIndex: number;
        protected $setSelectedIndex(idx: number): void;
        clear(): void;
        onRecycle(): void;
    }
}
declare module junyou {
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
declare module junyou {
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
        private _dispatch(data);
    }
    /**
     * 协议处理函数
     */
    interface INetHandler {
        (data: NetData): void;
    }
}
declare module junyou {
    /**
     * 绑定属性名，当属性值发生改变时，可自动对外抛eventType事件
     *
     * @export
     * @param {(string | number)} eventType     事件类型
     * @param {boolean} [selfDispatch]          默认false，使用Facade抛事件，event.data为实例本身
     *                                          如果为true，需要为EventDispatcher的实现，会使用自身抛事件
     * @returns
     */
    function d_fire(eventType: string | number, selfDispatch?: boolean): (target: any, value: any) => void;
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
    /**
     * @language en_US
     * The Watcher class defines utility method that you can use with bindable properties.
     * These methods let you define an event handler that is executed whenever a bindable property is updated.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    /**
     * @language zh_CN
     * Watcher 类能够监视可绑定属性的改变，您可以定义一个事件处理函数作为 Watcher 的回调方法，在每次可绑定属性的值改变时都执行此函数。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    class Watcher {
        /**
         * @language en_US
         * Creates and starts a Watcher instance.
         * The Watcher can only watch the property of a Object which host is instance of egret.IEventDispatcher.
         * @param host The object that hosts the property or property chain to be watched.
         * You can use the use the <code>reset()</code> method to change the value of the <code>host</code> argument
         * after creating the Watcher instance.
         * The <code>host</code> maintains a list of <code>handlers</code> to invoke when <code>prop</code> changes.
         * @param chain A value specifying the property or chain to be watched.
         * For example, to watch the property <code>host.a.b.c</code>,
         * call the method as: <code>watch(host, ["a","b","c"], ...)</code>.
         * @param handler  An event handler function called when the value of the watched property
         * (or any property in a watched chain) is modified.
         * @param thisObject <code>this</code> object of which binding with handler
         * @returns he ChangeWatcher instance, if at least one property name has been specified to
         * the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建并启动 Watcher 实例。注意：Watcher 只能监视 host 为 egret.IEventDispatcher 对象的属性改变。若属性链中某个属性所对应的实例不是 egret.IEventDispatcher，
         * 则属性链中在它之后的属性改变将无法检测到。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 创建Watcher实例后，您可以利用<code>reset()</code>方法更改<code>host</code>参数的值。
         * 当<code>prop</code>改变的时候，会使得host对应的一系列<code>handlers</code>被触发。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：watch¬(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        static watch<T>(host: T, chain: (keyof T)[], handler: (value: any) => void, thisObject: any): Watcher;
        /**
         * @private
         * 检查属性是否可以绑定。若还未绑定，尝试添加绑定事件。若是只读或只写属性，返回false。
         */
        private static checkBindable<T>(host, property);
        /**
         * Creates an instance of Watcher.
         *
         * @param {string} property                 监听的属性
         * @param {(value: any) => void} handler    回调函数
         * @param {*} [thisObject]                  回调函数的this对象，如果不设置this，则当监听对象属性变化时，将以监听的对象作为this参数，进行回调
         * @param {Watcher} [next]
         */
        constructor(property: string, handler: (value: any) => void, thisObject?: any, next?: Watcher);
        /**
         * @private
         */
        private host;
        /**
         * @private
         */
        private property;
        /**
         * @private
         */
        private handler;
        /**
         * @private
         */
        private thisObject;
        /**
         * @private
         */
        private next;
        /**
         * @private
         */
        private isExecuting;
        /**
         * @language en_US
         * Detaches this Watcher instance, and its handler function, from the current host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前宿主中断开此 Watcher 实例及其处理函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        unwatch(): void;
        /**
         * @language en_US
         * Retrieves the current value of the watched property or property chain, or null if the host object is null.
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检索观察的属性或属性链的当前值，当宿主对象为空时此值为空。
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        getValue(): any;
        /**
         * @language en_US
         * Sets the handler function.s
         * @param handler The handler function. This argument must not be null.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置处理函数。
         * @param handler 处理函数，此参数必须为非空。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        setHandler(handler: (value: any) => void, thisObject: any): void;
        /**
         * @language en_US
         * Resets this ChangeWatcher instance to use a new host object.
         * You can call this method to reuse a watcher instance on a different host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 重置此 Watcher 实例使用新的宿主对象。
         * 您可以通过该方法实现一个Watcher实例用于不同的宿主。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        reset(newHost: any): this;
        /**
         * @private
         *
         * @returns
         */
        private getHostPropertyValue();
        /**
         * @private
         */
        private wrapHandler(event);
        /**
         * @private
         */
        private onPropertyChange(property, dispatcher);
    }
}
declare module junyou {
    /**
     * @language en_US
     * The Binding class defines utility methods for performing data binding.
     * You can use the methods defined in this class to configure data bindings.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     */
    /**
     * @language zh_CN
     * 绑定工具类，用于执行数据绑定用的方法集。您可以使用此类中定义的方法来配置数据绑定。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     */
    class Binding {
        /**
         * @language en_US
         * Binds a property, <prop>prop</code> on the <code>target</code> Object, to a bindable property or peoperty chain.
         * @param host The object that hosts the property or property chain to be watched.
         * The <code>host</code> maintains a list of <code>targets</code> to update theirs <code>prop</code> when <code>chain</code> changes.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property <code>host.a.b.c</code>,
         * you need call the method like this: <code>indProperty(host, ["a","b","c"], ...)</code>
         * @param target The Object defining the property to be bound to <code>chain</code>.
         * @param prop The name of the public property defined in the <code>site</code> Object to be bound.
         * @returns A ChangeWatcher instance, if at least one property name has been specified
         * to the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绑定一个对象的属性值到要监视的对象属性上。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
         * @param target 本次绑定要更新的目标对象。
         * @param prop 本次绑定要更新的目标属性名称。
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        static bindProperty<T>(host: T, chain: (keyof T)[], target: any, prop: string): Watcher;
        /**
         * @language en_US
         * Binds a callback, <prop>handler</code> on the <code>target</code> Object, to a bindable property or peoperty chain.
         * Callback method to invoke with an argument of the current value of <code>chain</code> when that value changes.
         * @param host The object that hosts the property or property chain to be watched.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property <code>host.a.b.c</code>,
         * you need call the method like this: <code>indProperty(host, ["a","b","c"], ...)</code>
         * @param handler method to invoke with an argument of the current value of <code>chain</code> when that value changes.
         * @param thisObject <code>this</code> object of binding method
         * @returns A ChangeWatcher instance, if at least one property name has been  specified to the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
         * @param host 用于承载要监视的属性或属性链的对象。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        static bindHandler<T>(host: T, chain: (keyof T)[], handler: (value: any) => void, thisObject: any): Watcher;
    }
}
declare module junyou {
    const enum EventConst {
        /**
         * 属性改变
         */
        PROPERTY_CHANGE = -2000,
    }
    /**
     * @language en_US
     * The PropertyChangeEvent class represents the event object
     * passed to the event listener when one of the properties of
     * an object has changed, and provides information about the change.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/PropertyEventExample.ts
     */
    /**
     * @language zh_CN
     * 对象的一个属性发生更改时传递到事件侦听器的事件。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/PropertyEventExample.ts
     */
    class PropertyEvent extends egret.Event {
        /**
         * @language en_US
         * Constructor.
         *
         * @param type The event type; indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble
         * up the display list hierarchy.
         * @param cancelable Specifies whether the behavior
         * associated with the event can be prevented.
         * @param property Name of the property that changed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个属性改变事件。
         *
         * @param type 事件类型；指示触发事件的动作。
         * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
         * @param cancelable 指定是否可以防止与事件相关联的行为。
         * @param property 发生改变的属性名称。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, property?: string);
        /**
         * @language en_US
         * Name of the property that changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 发生改变的属性名称。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        property: string;
        /**
         * @language en_US
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         *
         * @param target the target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param property Name of the property that changed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 EventDispatcher 对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标
         * @param eventType 事件类型；指示触发事件的动作。
         * @param property 发生改变的属性名称。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        static dispatchPropertyEvent(target: egret.EventDispatcher, eventType: Key, property?: string): boolean;
    }
}
declare module junyou {
    /**
     * @language en_US
     * Register a property of an instance is can be bound.
     * This method is ususally invoked by Watcher class.
     *
     * @param instance the instance to be registered.
     * @param property the property of specified instance to be registered.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 标记实例的一个属性是可绑定的,此方法通常由 Watcher 类调用。
     *
     * @param instance 要标记的实例
     * @param property 可绑定的属性。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    function registerBindable(instance: any, property: string): void;
}
declare module junyou {
    /**
    *
    * 发起可以不需要回调响应的跨域get请求
    * @param {string} url          发起请求的地址
    * @param {boolean} [always]    是否总是发起请求
    *                              false（默认） 请求已经在列队中，则不会重复发起请求
    *                              true 不管相同地址的请求之前是否已经发起，继续发起请求
    */
    const sendToUrl: (url: string, always?: boolean) => void;
}
declare function $(): (url: string, always?: boolean) => void;
declare module junyou {
    /**
     * WebSocket版本的NetService
     * @author 3tion
     */
    class WSNetService extends NetService {
        protected _ws: WebSocket;
        constructor();
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
         *
         * 收到消息
         * @protected
         */
        protected onData: (ev: MessageEvent) => void;
        protected _send(cmd: number, data: any, msgType: string): void;
    }
}
declare module junyou {
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
        resID: string;
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
declare module junyou {
    /**
     *  尝试启用本地资源缓存
     * @author 3tion(https://github.com/eos3tion/)
     * @export
     * @param {number} [version=1]
     * @returns
     */
    function tryLocalRes(version?: number): {
        save(data: RES.ResourceItem, callback?: (this: IDBRequest, ev: Event) => any): void;
        get(url: string, callback: (data: RES.ResourceItem) => any): void;
        delete(url: string, callback: (this: IDBRequest, ev: Event) => any): void;
        clear(callback: (this: IDBRequest, ev: Event) => any): void;
    };
}
declare namespace RES {
    interface ResourceItem {
        /**
         * 本地缓存的数据
         *
         * @type {boolean}
         * @memberOf ResourceItem
         */
        local?: any;
    }
}
declare module junyou {
    const ResourceManager: {
        get<T extends IResource>(resid: string, noResHandler: (...args: any[]) => T, thisObj?: any, ...args: any[]): T;
        getTextureRes(resID: string, noWebp?: boolean): TextureResource;
        getResource: (resID: string) => IResource;
        init(): void;
    };
}
declare module junyou {
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
        resID: string;
        /**
         * 资源最终路径
         */
        url: string;
        /**
         *
         * 是否为静态不销毁的资源
         * @type {boolean}
         */
        readonly isStatic: boolean;
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
        bind(bmp: Bitmap): void;
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
        loadComplete(res: egret.Texture, key: string): void;
        /**
         * 销毁资源
         */
        dispose(): void;
    }
}
declare module junyou {
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
declare module junyou {
    /**
     * 状态机监听器
     * @author 3tion
     */
    interface IStateListener {
        setState(type: Key): any;
    }
}
declare module junyou {
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
declare module junyou {
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
declare module junyou {
    const enum LimitScene {
        /**
         * 默认场景
         */
        Default = 0,
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
declare module junyou {
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
         * @memberOf ArraySet
         */
        readonly rawList: V[];
        /**
         * 获取原始的字典
         * 请不要直接行 + - 值，使用set delete 方法进行处理
         * @readonly
         *
         * @memberOf ArraySet
         */
        readonly rawDict: {
            readonly [index: string]: V;
        };
        /**
         * 设置原始字典
         *
         * @param { [index: string]: V } dict
         *
         * @memberOf ArraySet
         */
        setRawDict(dict: {
            [index: string]: V;
        }): this;
        /**
         * 下例是一个形式为：{id:number,name:string}[]的数组，进行设值的例子
         * ```typescript
         * let rawList:{id:number,name:string}[] = [{id:1,name:"test1"},{id:2,name:"test2"},{id:3,name:"test3"}];
         * let set = new ArraySet<{id:number,name:string}>();
         * set.setRawList(rawList,"id"); //设值操作
         * ```
         *
         * @param {V[]} list        要放入的数据
         * @param {keyof V} keyPro   索引的属性名称

         *
         * @memberOf ArraySet
         */
        setRawList(list: V[], keyPro: keyof V): this;
        /**
         *
         * 设置数据
         *
         * @param {Key} key
         * @param {V} value
         * @return {number} 返回值加入到数据中的索引
         * @memberOf ArraySet
         */
        set(key: Key, value: V): number;
        /**
         * 获取数据
         *
         * @param {Key} key
         * @returns
         *
         * @memberOf ArraySet
         */
        get(key: Key): V;
        /**
         * 根据key移除数据
         *
         * @param {Key} key
         *
         * @memberOf ArraySet
         */
        delete(key: Key): V;
        /**
         * 清理数据
         *
         *
         * @memberOf ArraySet
         */
        clear(): void;
        /**
         * 获取总长度
         *
         * @readonly
         *
         * @memberOf ArraySet
         */
        readonly size: number;
    }
}
declare module junyou {
    const enum ByteArraySize {
        SIZE_OF_UINT32 = 4,
        SIZE_OF_FIX64 = 8,
        SIZE_OF_INT64 = 8,
        SIZE_OF_FIX32 = 4,
        SIZE_OF_SFIX32 = 4,
    }
    /**
     * 方便后续调整
     * 加入ProtoBuf的varint支持
     * @author 3tion
     *
     */
    class ByteArray extends egret.ByteArray {
        constructor(buffer?: ArrayBuffer);
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
        writeInt64(value: number): void;
        readInt64(): number;
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
         * @returns {ByteArray}
         */
        readByteArray(length: number): ByteArray;
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
        readonly outBytes: Uint8Array;
        /**
         * 重置索引
         *
         * @memberof ByteArray
         */
        reset(): void;
    }
}
declare module junyou {
    type PosKey = "x" | "y";
    type SizeKey = "width" | "height";
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
    interface Point3D extends Point {
        z: number;
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
declare namespace junyou {
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
declare module junyou {
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
declare module junyou {
    /**
     * protobuf2 的字段类型
     *
     * @export
     * @enum {number}
     */
    const enum PBFieldType {
        optional = 1,
        required = 2,
        repeated = 3,
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
         * @type {string}
         */
        0: string;
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
         * @type {(string | PBStruct)}
         * @memberOf PBField
         */
        3?: string | PBStruct;
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
    /**
     *
     * @author 3tion
     * ProtoBuf工具集
     *
     */
    const PBUtils: {
        regDef: {
            (msg: PBStruct, def: any): any;
            (msgType: string | number, def: any): any;
        };
        add(dict: PBStructDictInput): void;
        readFrom: (msgType: string | number | PBStruct, bytes: ByteArray, len?: number) => Object;
        writeTo: (msg: object, msgType: string | number | PBStruct, bytes?: ByteArray, debugOutData?: Object) => ByteArray;
    };
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
    ONE_DAY = 86400000,
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
    S = 4,
}
declare module junyou {
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
        readonly serverTime: number;
        /**
         * 获取当前时间戳，用于和服务端的时间戳进行比较
         *
         * @readonly
         * @static
         */
        readonly rawServerTime: number;
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
         * 获取指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {number} 指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         */
        getDayEnd(utcTime?: number): number;
        /**
         * 获取指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {Date} 指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         */
        getDayStart(utcTime?: number): number;
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
    }
    const DateUtils: DateUtilsInterface;
}
declare module junyou {
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
        decodeMinutes(minutes: number): this;
        /**
         * 从一个数值进行序列化
         * decodeMinutes和decodeBit，如果使用protobuf writeVarint32 存储，时间只要超过 02:08，不管如何使用何种方式，一定会超过2字节，而 23:59，不管怎么存储，都不会超过2字节
         * decodeBit解析比 decodeMinutes更加快捷
         * 而 hour<<6|minute  解析会更简单，快速
         * @param {number} value
         */
        decodeBit(value: number): this;
        /**
         * 解析数据
         *
         * @private
         * @param {number} hour
         * @param {number} minute
         * @returns
         */
        private _decode(hour, minute);
        /**
         * 从字符串中解析
         *
         * @param {number} strTime 通过解析器解析的数据
         */
        decode(strTime: string): this;
        /**
        * 获取今日的服务器时间
        *
        * @readonly
        *
        * @memberOf TimeVO
        */
        readonly todayTime: number;
    }
}
declare module junyou {
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
    }
}
declare module junyou {
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
declare module junyou {
    /**
     * 常用的颜色常量
     *
     * @export
     * @enum {number}
     */
    const enum Color {
        Red = 16711680,
        Green = 65280,
        Yellow = 16776960,
        White = 16777215,
        Gray = 13421772,
    }
    /**
     * 常用的颜色字符串常量
     *
     * @export
     * @enum {string}
     */
    const enum ColorString {
        Red = "#ff0000",
        Green = "#00ff00",
        Yellow = "#ffff00",
        White = "#ffffff",
        Gray = "#cccccc",
    }
    /**
     * 颜色工具
     * @author 3tion
     *
     */
    const ColorUtil: {
        getColorString(c: number): string;
        getColorValue(c: string): number;
    };
}
declare module junyou {
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
declare module junyou {
    const DataUrlUtils: {
        getBase64: (dataUrl: string) => string;
        getBytes: (dataUrl: string) => Uint8Array;
        getDisplayDataURL: (dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?: any, scale?: number) => string;
        getDisplayBase64(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?: any, scale?: number): string;
        getDisplayBytes(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?: any, scale?: number): Uint8Array;
    };
}
declare module junyou {
    /**
     * 滤镜辅助
     *
     * @export
     * @class FilterUtils
     */
    const FilterUtils: {
        gray: egret.ColorMatrixFilter[];
        dark: egret.ColorMatrixFilter[];
        blur: egret.BlurFilter[];
    };
}
declare module junyou {
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
declare module junyou {
    const HTMLUtil: {
        createColorHtml(value: string | number, color: string | number): string;
        clearHtml(value: string): string;
        escHTML(content: string): string;
        unescHTML(content: string): string;
    };
}
declare module junyou {
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
declare var $nl_nc: any;
declare const enum Sex {
    /**
     * 男
     */
    Male = 1,
    /**
     * 女
     */
    Female = 2,
    Nan = 1,
    Nv = 2,
}
declare module junyou {
    class NameUtils {
        private _random;
        /**
         *
         * @param randomFunc	随机算法
         *
         */
        constructor(randomFunc?: Function);
        static loadNameLib(url: string): void;
        /**
         * 设置随机算法
         * @param randomFunc
         *
         */
        setRandomFunc(randomFunc: Function): void;
        /**
         * 获取名字
         * @param sex 1 男  2 女
         * @return
         *
         */
        getName(sex?: Sex): string;
        dispose(): void;
    }
}
declare module junyou {
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
declare module junyou {
    interface RPCCallback {
        /**
         * 成功的回调函数
         *
         * @type {Recyclable<CallbackInfo<(data?: any, ...args)>>}
         * @memberof RPCCallback
         */
        success: Recyclable<CallbackInfo<{
            (data?: any, ...args);
        }>>;
        /**
         * 失败的回调函数
         *
         * @type {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>}
         * @memberof RPCCallback
         */
        error: Recyclable<CallbackInfo<{
            (error?: Error, ...args);
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
        DefaultTimeout = 2000,
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
            (data?: any, ...args);
        }>>, error?: Recyclable<CallbackInfo<{
            (error?: Error, ...args);
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
            (data?: any, ...args);
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
declare module junyou {
    const enum SoundDomain {
        All = 0,
    }
    interface SoundOption {
        startTime: number;
        /**
         * 调用play的时间戳
         *
         * @type {number}
         * @memberOf SoundOption
         */
        playStart: number;
        loop: number;
        timeout: number;
    }
    const SoundManager: {
        play: (url: string, domain?: SoundDomain, loop?: number, timeout?: number, startTime?: number) => number;
        preload: (url: string) => void;
        stopSound: (id: number, useTween?: boolean) => void;
        stopSounds: (domain: number, useTween?: boolean) => void;
        volume: (volume: number, id: number) => void;
    };
    interface Sound {
        url: string;
        state: RequestState;
        sound: egret.Sound;
        promises?: number[];
    }
    interface SoundChannel {
        id: number;
        /**
         * 如果当前Sound未加载完毕，则此时间为声音播放的过期时间
         *
         * @type {number}
         * @memberOf SoundChannel
         */
        option?: SoundOption;
        url: string;
        channel?: egret.SoundChannel;
        domain: number;
        actions?: [Function, any[]][];
    }
}
declare module junyou {
    /**
     * 临时对象
     * @author 3tion
     *
     */
    const Temp: {
        SharedArray1: any[];
        SharedArray2: any[];
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
        EgretPoint: egret.Point;
        EgretRectangle: egret.Rectangle;
        SharedPoint1: {
            x: number;
            y: number;
            z: number;
        };
        SharedPoint2: {
            x: number;
            y: number;
            z: number;
        };
        voidFunction: () => any;
        willReplacedFunction: () => any;
        EmptyObject: Readonly<{}>;
        EmptyArray: any[];
        pipeFunction: <T>(arg: T) => T;
    };
}
declare module junyou {
    const TimerUtil: {
        addCallback: (time: number, callback: Function, thisObj?: any, ...args: any[]) => void;
        removeCallback: (time: number, callback: Function, thisObj?: any) => void;
        tick: (now: number) => void;
    };
}
declare module junyou {
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
/**
 * 脏字内容
 */
declare var $dirty: string;
declare module junyou {
    /**
     * 文字过滤
     * @author 3tion
     */
    const WordFilter: {
        loadDirtyWord(url: string, split?: string): void;
        initFilterstring: (str: string, split: string) => void;
        wordCensor: (msg: string) => string;
        setDirtyHandler(handler: (substring: string) => string): void;
        checkWord: (msg: string) => boolean;
    };
}
declare module junyou {
    /**
     * 客户端检测
     * @author 3tion
     *
     */
    var ClientCheck: {
        isClientCheck: boolean;
    };
}
declare module junyou {
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
        (...msg): void;
    };
    /**
     * 抛错
     * @param {string | Error}  msg 描述
     **/
    const ThrowError: ThrowError;
}
declare module junyou {
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
        AniBeforeRecycle = -1992,
        /**
         * 检查下一个
         */
        MsgRenderCheckNext = -1991,
        /**
         * 检查最末尾
         */
        MsgRenderCheckEnd = -1990,
    }
}
declare module junyou {
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
declare module junyou {
    const enum ResPrefix {
        /**
         * 特效文件夹
         */
        Ani = "a/",
    }
}
declare module junyou {
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
            new(stage: egret.Stage): GameEngine;
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
        readonly viewRect: egret.Rectangle;
        protected _stage: egret.Stage;
        protected _layers: GameLayer[];
        /**
         * 排序层
         */
        protected _sortedLayers: SortedLayer[];
        /**
         * 游戏主场景容器
         */
        protected _gameScene: GameLayer;
        /**
         *
         * 执行视图对象的调用
         * @type {{ (rect: egret.Rectangle): egret.Rectangle }}
         */
        checkViewRect: {
            (rect: egret.Rectangle): egret.Rectangle;
        };
        /**
         * 获取或创建容器
         */
        getLayer(id: GameLayerID): GameLayer;
        /**
         * 将指定
         *
         * @param {GameLayerID} layerID
         *
         * @memberOf GameEngine
         */
        sleepLayer(layerID: GameLayerID): void;
        awakeLayer(layerID: GameLayerID): void;
        protected addLayer(layer: GameLayer, cfg: LayerConfig): void;
        protected addLayerToContainer(layer: GameLayer, container: egret.DisplayObjectContainer): void;
        constructor(stage: egret.Stage);
        protected init(): void;
        /**
         * 启动时调用
         */
        awake?(): void;
        /**
         *
         */
        sleep?(): void;
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
declare module junyou {
    /**
     * 动画的全局对象
     * @author
     *
     */
    const Global: {
        initTick: () => void;
        nextTick: (callback: Function, thisObj?: any, ...args: any[]) => void;
        callLater: (callback: Function, time?: number, thisObj?: any, ...args: any[]) => void;
        clearCallLater: (callback: Function, thisObj?: any) => any;
        getTween: (target: any, props?: TweenOption, pluginData?: any, override?: boolean) => Tween;
        removeTween: (tween: Tween) => void;
        removeTweens: (target: any) => void;
        readonly isNative: boolean;
        readonly tweenManager: TweenManager;
        readonly now: number;
        readonly frameNow: number;
        readonly webp: "" | Ext.WEBP;
    };
}
declare module junyou {
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
declare module junyou {
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
        protected url: string;
        constructor();
        /**
         * 绑定渲染器
         * @param render
         */
        bind(render: AniRender): void;
        /**
         * 资源加载完成
         */
        dataLoadComplete(data: any[], key: string): void;
        /**
         * 和渲染器解除绑定
         * @param render
         */
        loose(render: AniRender): void;
        init(key: string, data: any[]): void;
        getResource(uri?: string): UnitResource;
        readonly actionInfo: ActionInfo;
    }
}
declare module junyou {
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
        Recycled = 3,
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
        RecycleAll = 3,
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
declare module junyou {
    /**
     * 由于目前特效和渲染器是完全一一对应关系，所以直接做成AniBitmap
     * @author 3tion
     *
     */
    class AniRender extends BaseRender implements IRecyclable {
        _render: any;
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
            (event: Key, render: AniRender, now?: number, ...args);
        }>;
        /**
         * 是否等待纹理数据加载完成，才播放
         *
         * @type {boolean}
         * @memberof AniRender
         */
        waitTexture?: boolean;
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
        protected _guid: number;
        /**
         * 特效标识
         */
        readonly guid: number;
        /**
         * 显示对象
         */
        display: Recyclable<ResourceBitmap>;
        protected _aniInfo: AniInfo;
        constructor();
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
        private checkPlay();
        onRecycle(): void;
        onSpawn(): void;
        init(aniInfo: AniInfo, display: Recyclable<ResourceBitmap>, guid: number): void;
        /***********************************静态方法****************************************/
        private static _renderByGuid;
        private static guid;
        /**
         * 获取ANI动画
         *
         * @static
         * @param {string} uri    动画地址
         * @param {AniOption} [option] 动画的参数
         * @returns (description)
         */
        static getAni(uri: string, option?: AniOption): Recyclable<AniRender>;
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
            (event: Key, render: AniRender, now?: number, ...args);
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
    }
}
declare module junyou {
    /**
     * 可用于做Key的类型
     */
    type Key = number | string;
}
declare module junyou {
    /**
     * 存储锚点信息
     */
    class JTexture extends egret.Texture {
        /**
         * 用于设置位图的锚点坐标X
         */
        tx: number;
        /**
         * 用于设置位图的锚点坐标Y
         */
        ty: number;
    }
}
declare module junyou {
    /**
      * 加载脚本
      * @param url
      * @param callback
      * @param thisObj
      * @param args
      */
    function loadScript(url: string, callback: Function, thisObj?: any, ...args: any[]): void;
}
declare module junyou {
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
        readonly depth: number;
        /**
         * 当前资源是否成功渲染
         *
         * @param {IDrawInfo} drawInfo
         * @param {number} now
         * @returns
         * @memberof ResourceBitmap
         */
        draw(drawInfo: IDrawInfo, now: number): boolean;
        rotation: number;
        onRecycle(): void;
    }
}
declare module junyou {
    /**
     * 拆分的资源
     * @author 3tion
     */
    class SplitUnitResource implements IResource {
        /**
        * 资源id
        */
        resID: string;
        url: string;
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
        textures: JTexture[];
        readonly isStatic: boolean;
        constructor(uri: string);
        /**
         * 绑定纹理集
         *
         * @param {{ [index: number]: JTexture[][] }} textures (description)
         * @param {number[]} adKeys (description)
         */
        bindTextures(textures: {
            [index: number]: JTexture[][];
        }, adKeys: number[]): void;
        /**
         * 绑定纹理
         */
        bindTexture(tex: JTexture): void;
        load(): void;
        /**
         * 资源加载完成
         */
        loadComplete(res: JTexture, key: string): void;
        dispose(): void;
    }
}
/**
 * @author 3tion
 */
declare module junyou {
    const enum UnitResourceConst {
        /**
         * 单配置文件的路径
         */
        CfgFile = "d.json",
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
        url: string;
        private _splitInfo;
        state: RequestState;
        /**
         * 获取数据
         */
        private _datas;
        constructor(uri: string, splitInfo: SplitInfo);
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
        dataLoadComplete(data: Object, key: string): void;
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
        loadRes(d: number, a: number): SplitUnitResource;
        noRes(uri: string, r: string): SplitUnitResource;
        isResOK(d: number, a: number): boolean;
    }
}
declare module junyou {
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
        protected _target: {
            x: number;
            y: number;
        };
        private _lastPos;
        protected _changed: boolean;
        readonly changed: boolean;
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
        readonly rect: egret.Rectangle;
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
declare module junyou {
    const enum CooldownState {
        STOP = 0,
        RUN = 1,
    }
    /**
     * 时间冷却
     * @author pb
     */
    class Cooldown {
        icd: ICooldown;
        /**
         * 状态
         */
        state: number;
        /**
        * 已经持续的时间
        */
        private _duration;
        private _icdDisArr;
        constructor();
        /**
         * 增加一个视图对象
         * @param ICooldownDisplay
         *
         */
        addICDDisplay(icdDis: ICooldownDisplay): void;
        /**
         * 删除一个视图对象
         * @param ICooldownDisplay
         *
         */
        removeICDDisplay(icdDis: ICooldownDisplay): void;
        /**
         * 启动
         *
         */
        start(): void;
        /**
         * 停止
         *
         */
        stop(): void;
        private updateICDDisplay(state);
        doData(delta: number): void;
        doRender(delta: number): void;
        /**
         * 销毁
         *
         */
        dispose(): void;
    }
}
declare module junyou {
    /**
     * 时间冷却管理器
     * @author pb
     */
    class CooldownManager {
        /**
         * 全部cooldown集合
         * 技能id为key
         * @private
         * @type {{ [index: number]: Cooldown }}
         * @memberOf CooldownManager
         */
        private _cdObj;
        /**
         * 运行中的cd列表
         *
         * @private
         * @type {Cooldown[]}
         * @memberOf CooldownManager
         */
        private _cdArr;
        private _disObj;
        constructor();
        /**
         * 添加CD绑定的显示对象
         *
         * @param {number} id
         * @param {ICooldownDisplay} icdDisplay
         *
         * @memberOf CooldownManager
         */
        addDisplay(id: number, icdDisplay: ICooldownDisplay): void;
        /**
         * 删除某CD绑定的显示对象
         *
         * @param {number} id
         *
         * @memberOf CooldownManager
         */
        removeDisplay(id: number): void;
        /**
         * 数据处理
         *
         * @param {number} delta 时间增量
         *
         * @memberOf CooldownManager
         */
        doData(delta: number): void;
        /**
         * 渲染处理
         *
         * @param {number} delta 时间增量
         *
         * @memberOf CooldownManager
         */
        doRender(delta: number): void;
        /**
         * 添加CD
         *
         * @param {ICooldown} icd 比如技能配置
         * @param {ICooldownDisplay} [icdDisplay] 和cd绑定的显示对象 比如技能cd遮罩
         *
         * @memberOf CooldownManager
         */
        add(icd: ICooldown, icdDisplay?: ICooldownDisplay): void;
        start(id: number): void;
        /**
         * 移除CD
         * 如果绑定过显示对象也会移除
         *
         * @param {number} id
         *
         * @memberOf CooldownManager
         */
        remove(id: number): void;
        /**
         * 移除某cd时间的所有Cooldown
         *
         * @param {number} cd
         *
         * @memberOf CooldownManager
         */
        removeByCDTime(cd: number): void;
        /**
         * 销毁某个CD
         *
         * @param {number} id
         *
         * @memberOf CooldownManager
         */
        dispose(id: number): void;
        /**
         * 销毁全部CD
         *
         * @memberOf CooldownManager
         */
        disposeAll(): void;
    }
}
declare module junyou {
    /**
     * 时间冷却遮罩
     * @author pb
     */
    class CooldownMask implements ICooldownDisplay {
        private static _45;
        private static _135;
        private static _225;
        private static _315;
        private static _gt180;
        private static _lt180;
        private static COLOR;
        private static ALPHA;
        /**
         * 起始点 x偏移
         */
        private _ox;
        /**
         * 起始点 y偏移
         */
        private _oy;
        /**
         * 绘制灰色CD遮罩
         */
        private _g;
        /**
         * cd实例
         */
        /**
         * 角度
         */
        private _x;
        private _y;
        /**
         * 灰色遮罩的边长
         */
        private _sl;
        /**
         * 灰色遮罩的一半长度
         */
        private _hl;
        private _mask;
        private _deltaRadian;
        /**
        * 已经持续的时间
        */
        private _duration;
        constructor(sl: number, ox?: number, oy?: number);
        /**
         * 绑定组件皮肤
         * 添加遮罩到组件皮肤
         */
        bind(target: egret.Sprite): void;
        /**
         * 解除绑定组件皮肤
         */
        unbind(): void;
        setRadian(radian: number): void;
        doRender(delta: number): void;
        add(cdTotalTime: number): void;
        remove(): void;
        dispose(): void;
    }
}
declare module junyou {
    /**
     * 时间冷却接口
     * @author pb
     */
    interface ICooldown {
        cd: number;
        id: number;
        isCooling?: boolean;
    }
}
declare module junyou {
    /**
     * 冷却显示对象接口
     * @author pb
     */
    interface ICooldownDisplay {
        /**
         * 受到CD管理器影响时刷新
         * @param 时间增量
         */
        doRender(delta: number): void;
        bind(target: egret.Sprite): void;
        /**
         * 解除绑定组件皮肤
         */
        unbind(): void;
        /**
         * 添加
         * @param 总cd时间
         */
        add(cdTotalTime: number): void;
        /**
         * 移除
         *
         */
        remove(): void;
        /**
         * 销毁
         *
         */
        dispose(): void;
    }
}
declare module junyou {
    /**
     * 地图基础信息<br/>
     * 由地图编辑器生成的地图信息
     * @author 3tion
     *
     */
    class MapInfo extends egret.HashObject {
        /**
         * 地图唯一标识
         */
        id: string;
        /**
         * 地图路径
         */
        path: string;
        /**
         * 地图格子列数
         */
        columns: number;
        /**
         * 地图格子行数
         */
        rows: number;
        /**
         * 格子宽度
         */
        gridWidth: number;
        /**
         * 格子高度
         */
        gridHeight: number;
        /**
         * 地图像素宽度
         */
        width: number;
        /**
         * 地图像素高度
         */
        height: number;
        /**
         * 单张底图的宽度
         */
        pWidth: number;
        /**
         * 单张底图的高度
         */
        pHeight: number;
        /**
         * X轴最大图片坐标
         * 000开始
         */
        maxPicX: number;
        /**
         * Y轴最大图片数量
         * 000开始
         */
        maxPicY: number;
        getWalk?(x: number, y: number): number;
        /**
         * 路径点信息 低版本WebView不支持 ArrayBuffer
         */
        pathdata?: Uint8Array;
        constructor();
        static decodeFromArray(arr: any[], ref?: {
            new(): MapInfo;
        }): MapInfo;
        /**
        * 获取资源路径
        */
        getMapUri: {
            (col: number, row: number);
        };
    }
}
interface $gmType {
    /**
     * 显示/关闭地图格子显示
     *
     *
     * @memberOf $gmType
     */
    toggleMapGrid(): any;
    $showMapGrid: boolean;
}
declare module junyou {
    /**
    * MapRender
    * 用于处理地图平铺的渲染
    */
    class TileMapLayer extends GameLayer {
        /**
         * @private
         */
        currentMap: MapInfo;
        /**
         *
         * 显示中的地图
         * @private
         * @type {TileMap[]}
         */
        private _showing;
        protected drawGrid?: {
            (x: number, y: number, w: number, h: number, cM: MapInfo): void;
        };
        protected gridPane?: egret.Shape;
        /**
         * 上次渲染的起始 column
         *
         * @protected
         * @type {number}
         */
        protected lsc: number;
        /**
         * 上次渲染的起始 row
         *
         * @protected
         * @type {number}
         */
        protected lsr: number;
        /**
         * 上次渲染的结束 column
         *
         * @protected
         * @type {number}
         */
        protected lec: number;
        /**
         * 上次渲染的结束 row
         *
         * @protected
         * @type {number}
         */
        protected ler: number;
        setRect(rect: egret.Rectangle): void;
        protected noRes(uri: string, c: number, r: number, pW: number, pH: number): TileMap;
        constructor(id: number);
        removeChildren(): void;
    }
    /**
    * TileMap
    */
    class TileMap extends egret.Bitmap implements IResource {
        /**
         * 地图块的列
         */
        private col;
        /**
         * 地图块的行
         */
        private row;
        /**
         * 资源唯一标识
         */
        private uri;
        /**
         *
         * 是否为静态资源
         * @type {boolean}
         */
        isStatic: boolean;
        lastUseTime: number;
        /**
         *
         * 资源路径
         * @type {string}
         */
        url: string;
        readonly resID: string;
        constructor();
        reset(col: number, row: number, uri: string): void;
        load(): void;
        /**
         * 资源加载完成
         */
        loadComplete(res: egret.Texture, key: string): void;
        dispose(): void;
    }
}
declare module junyou {
    /**
     *
     * 寻路算法
     * @author 3tion
     * @export
     * @interface PathFinder
     */
    interface PathFinder {
        /**
         * 绑定要寻路的地图数据
         *
         * @param {MapInfo} map
         *
         * @memberOf PathFinder
         */
        bindMap(map: MapInfo): any;
        /**
         * 获取路径节点
         *
         * @param {number} fx               起点坐标x
         * @param {number} fy               起点坐标y
         * @param {number} tx               终点坐标x
         * @param {number} ty               终点坐标y
         * @param {CallbackInfo<{ (path: PathNode[], ...args) }>} callback    寻找到目标后的 回调方法
         *
         * @memberOf PathFinder
         */
        getPath(fx: number, fy: number, tx: number, ty: number, callback: CallbackInfo<{
            (path: PathNode[], ...args);
        }>): any;
    }
    /**
     * 寻路的节点
     *
     * @export
     * @interface PathNode
     */
    interface PathNode {
        /**
         * 节点的标识
         *
         * @type {number}
         * @memberOf PathNode
         */
        key: number;
        /**
         * g + h
         *
         * @type {number}
         * @memberOf PathNode
         */
        f: number;
        /**
         * 实际运行成本，以从出发点移动到指定的正方形网格上，产生到那里的路径
         *
         * @type {number}
         * @memberOf PathNode
         */
        g: number;
        /**
         * 估计的运行成本
         *
         * @type {number}
         * @memberOf PathNode
         */
        h: number;
        /**
         * 节点所在的坐标x
         *
         * @type {number}
         * @memberOf PathNode
         */
        x: number;
        /**
         * 节点所在的坐标y
         *
         * @type {number}
         * @memberOf PathNode
         */
        y: number;
        /**
         * 上一个节点
         *
         * @type {PathNode}
         * @memberOf PathNode
         */
        prev?: PathNode;
        /**
         * 节点数量
         *
         * @type {number}
         * @memberOf PathNode
         */
        step: number;
    }
    /**
     * A星寻路算法
     * @author 3tion
     * @export
     * @class Astar
     */
    class Astar implements PathFinder {
        private _map;
        private _maxLength;
        /**
         * 最小执行时间
         *
         * @type {number}
         * @memberOf Astar
         */
        minCacTime: number;
        bindMap(map: MapInfo): void;
        /**
         * 获取路径节点
         *
         * @param {number} fx               起点坐标x
         * @param {number} fy               起点坐标y
         * @param {number} tx               终点坐标x
         * @param {number} ty               终点坐标y
         * @param {{ (path: PathNode[], ...args) }: void } callback    寻找到目标后的 回调方法
         * @param {any} args                回调函数的其他参数
         *
         * @memberOf PathFinder
         */
        getPath(fx: number, fy: number, tx: number, ty: number, callback: CallbackInfo<{
            (path: PathNode[], ...args);
        }>): {
                stop: boolean;
            };
    }
}
declare module junyou {
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
         * @param {boolean} [doRecycle=true] 是否回收CallbackInfo，默认为true
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
            ();
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
    }
}
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
        private checkViewRect;
        tick(): boolean;
        private clearShakeRect();
    }
}
declare module junyou {
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
declare module junyou {
    /**
     * 动作状态的结果
     * @author 3tion
     */
    interface IUnitActionInfo {
        /**
         * 坐骑序列
         */
        mountType: MountType;
        /**
         * 动作参数
         */
        action: number;
    }
}
declare module junyou {
    /**
     * 带坐骑动作的UnitAction基类
     * @author 3tion
     */
    class MUnitAction extends UnitAction {
        /**
         * 动作序列<br/>
         * 如果没有对应动作，Unit，强制使用有动作的坐骑类型，并切换动作
         * Key      MountType<br/>
         * Value    动作的唯一标识<br/>
         */
        protected actions: {
            [index: number]: IUnitActionInfo;
        };
        constructor();
        getAction(mountType: MountType): IUnitActionInfo;
    }
}
declare module junyou {
    /**
     *
     *
     * @export
     * @class UModel
     * @extends {egret.DisplayObjectContainer}
     * @author 3tion
     */
    class UModel extends egret.DisplayObjectContainer {
        /**
         * 独立使用时，用于排序深度
         *
         * @type {number}
         */
        depth?: number;
        /**
         * 检查/重置资源列表
         *
         * @param {Key[]} resOrder 部位的排列顺序
         * @param {{ [index: string]: UnitResource }} resDict 部位和资源的字典
         */
        checkResList(resOrder: Key[], resDict: {
            [index: string]: UnitResource;
        }): void;
        /**
         * 渲染指定帧
         *
         * @param {FrameInfo} frame
         * @param {number} now
         * @param {number} face
         * @param {IDrawInfo} info
         * @returns {boolean} true 表示此帧所有资源都正常完成渲染
         *                    其他情况表示有些帧或者数据未加载，未完全渲染
         * @memberof UModel
         */
        renderFrame(frame: FrameInfo, now: number, face: number, info: IDrawInfo): boolean;
        clear(): void;
        onRecycle(): void;
    }
}
declare module junyou {
    /**
     * 用于像统计接口发送步骤信息
     * @author pb
     */
    const Stats: {
        setUrl(url: string): any;
        setParams(params: ExternalParam): any;
        setSign(sign: string): any;
        postData(step: number): void;
        getParamUrl(step: number): string;
    };
}
declare const enum StatsState {
    /**
     *游戏初始完成
    */
    GAME_INIT_COMPLETE = 4,
    /**
     *配置完成
     */
    CONFIG_COMPLETE = 5,
    /**
     *资源完成
     */
    RES_COMPLETE = 6,
    /**
     *帐号登录完成
     */
    GAME_LOGIN_COMPLETE = 7,
    /**
     *创建角色
     */
    ROLE_CREATE = 8,
    /**
     *角色登陆完成
     */
    ROLE_LOGIN_COMPLETE = 9,
}
declare module junyou {
    /**
     * 场景单位域的类型
     *
     * @export
     * @enum {number}
     */
    const enum UnitDomainType {
        /**
         * 所有单位
         */
        All = 0,
        /**
         * 角色
         */
        Role = 1,
        /**
         * 怪物
         */
        Monster = 2,
    }
    type UnitDomain = $UnitDomain<Unit>;
    type $UnitDomain<T extends Unit> = {
        [guid: string]: T;
    };
    /**
     * 单位管理器
     * @author 3tion
     *
     */
    class UnitController<T extends Unit> {
        /**
         * 按类型存放的域
         *
         * @protected
         * @type {{ [unitDomainType: number]: $UnitDomain<T> }}
         */
        protected _domains: {
            [unitDomainType: number]: $UnitDomain<T>;
        };
        /**
         * 用于存放单位数量的字典
         *
         * @protected
         * @type {{ [unitDomainType: number]: number }}
         */
        protected _domainCounts: {
            [unitDomainType: number]: number;
        };
        /**
         * 所有单位存放的域
         *
         * @protected
         * @type {UnitDomain}
         */
        protected _domainAll: $UnitDomain<T>;
        constructor();
        /**
         * 注册一个单位
         * @param unit
         * @param domains
         *
         */
        registerUnit(unit: T, ...domains: any[]): any;
        /**
         * 移除单位
         * @param guid
         * @return
         *
         */
        removeUnit(guid: Key): T;
        /**
         *
         * 获取指定域的单位集合
         * @param {number} domain 指定域
         * @returns
         */
        get(domain: number): $UnitDomain<T>;
        /**
         * 获取指定域的单位数量
         * @param domain
         * @return
         *
         */
        getCount(domain: number): number;
        /**
         * 根据GUID获取JUnit
         * @param guid
         * @return
         *
         */
        getUnit(guid: Key): T;
        /**
         *
         * 清理对象
         * @param {...Key[]} exceptGuids 需要保留的单位的GUID列表
         */
        clear(...exceptGuids: Key[]): void;
    }
}
declare module junyou {
    /**
     * 模型(纸娃娃)渲染器
     */
    class UnitRender extends BaseRender {
        faceTo: number;
        /**单位**/
        protected unit: Unit;
        actionInfo: ActionInfo;
        model: UModel;
        protected nextRenderTime: number;
        protected renderedTime: number;
        constructor(unit: Unit);
        reset(now: number): void;
        /**
         * 处理数据
         *
         * @param {number} now 时间戳
         */
        doData(now: number): void;
        render(now: number): void;
        onData(actionInfo: ActionInfo, now: number): void;
        clearRes(): void;
        renderFrame(frame: FrameInfo, now: number): void;
        dispatchEvent(event: string, now: number): void;
        doComplete(now: number): void;
        dispose(): void;
    }
}
declare module junyou {
    class UnitSetting {
        /**
         * 是否添加UI层
         */
        hasUILayer: boolean;
        /**
         * 是否添加Buff容器
         */
        hasBuffLayer: boolean;
        /**
         * 是否添加光环容器
         */
        hasHaloLayer: boolean;
        /**
         * 是否添加到游戏场景中
         */
        addToEngine: boolean;
        getDepth(): number;
        /**
         * 深度的参数A
         */
        depthA: number;
        /**
         * 深度的参数B
         */
        depthB: number;
    }
    /**
     * 默认的单位设置
     */
    const defaultUnitSetting: UnitSetting;
}
declare module junyou {
    /**
     * 单位的状态
     * @author 3tion
     */
    const enum UnitState {
        /**
         * 创建了对象
         */
        Init = 0,
        /**
         * 添加到舞台上
         */
        Stage = 1,
        /**
         * 正在创建，往舞台上添加的动画
         */
        Spawning = 2,
        /**
         * 在舞台上活着
         */
        Alive = 3,
        /**
         * 正在死亡，执行死亡的动画
         */
        Deading = 4,
        /**
         * 死透了，在地板上
         */
        Dead = 5,
        /**
         * 正在销毁，尸体蚕食的动画
         */
        Disposing = 6,
        /**
         * 从舞台销毁，回收资源
         */
        Disposed = 7,
    }
}
declare module junyou {
    interface UnitVO {
        /**
         * 单位的唯一标识
         */
        guid: number | string;
        /**
         * 单位的坐标X
         */
        x: number;
        /**
         * 单位的坐标Y
         */
        y: number;
    }
}
declare module junyou {
    /**
     * 序列的记录器
     * 用于做残影或者时光倒流的操作
     * @export
     * @class PSRecorder
     * @author 3tion
     */
    class PSRecorder {
        private _count;
        private _max;
        /**
         * 序列头
         *
         * @private
         * @type {PSeries}
         */
        private _head;
        /**
         * 序列尾
         *
         * @private
         * @type {PSeries}
         */
        private _tail;
        /**
         * 初始化一个序列
         *
         * @param {number} [delay=30]
         * @param {number} [max=4]
         * @returns
         */
        init(max?: number): this;
        record(unit: Unit, now: number): Recyclable<PSeries>;
        /**
         * 根据索引获取序列
         *
         * @param {number} idx          索引号
         * @param {boolean} [reverse]   是否按时间顺序反取，默认为从前往后，即按时间的先后顺序取
         * @returns
         */
        getByIndex(idx: number, reverse?: boolean): PSeries;
        /**
         *
         * 获取序列
         * @param {PSeries[]} [output]  要输出的序列位置
         * @param {boolean} [reverse]   是否按时间顺序反取，默认为从前往后，即按时间的先后顺序取
         */
        getSeries(output?: PSeries[], reverse?: boolean): void;
        onRecycle(): void;
    }
}
declare module junyou {
    /**
     * 用于记录单位(Unit)的序列
     *
     * @export
     * @interface PhantomTarget
     * @author 3tion
     */
    class PSeries {
        /**
         * 时间序列
         */
        t: number;
        /**
         * 渲染列表中的资源列表
         *
         * @type {[index: number]: UnitResource}
         * @memberOf PSeries
         */
        resDict: {
            [index: number]: UnitResource;
        };
        /**
         * 帧信息
         *
         * @type {FrameInfo}
         * @memberOf PSeries
         */
        frame: FrameInfo;
        x: number;
        y: number;
        z: number;
        /**
         * 朝向
         *
         * @type {number}
         * @memberOf PSeries
         */
        faceTo: number;
        /**
         * 前一个序列
         *
         * @type {Recyclable<PSeries>}
         * @memberOf PSeries
         */
        prev?: Recyclable<PSeries>;
        /**
         * 后一个序列
         *
         * @type {Recyclable<PSeries>}
         * @memberOf PSeries
         */
        next?: Recyclable<PSeries>;
        record(unit: Unit, now: number): void;
    }
}
/**
 * @author 3tion
 */
declare module junyou {
    /**
     * 任务朝向
     *
     * @enum {number}
     */
    const enum FaceTo {
        /**
       * 人物方向 ↓
       */
        face0 = 0,
        /**
         * 人物方向 ↘
         */
        face1 = 1,
        /**
         * 人物方向 →
         */
        face2 = 2,
        /**
         * 人物方向 ↗
         */
        face3 = 3,
        /**
         * 人物方向 ↑
         */
        face4 = 4,
        /**
         * 人物方向 ↖
         */
        face5 = 5,
        /**
         * 人物方向 ←
         */
        face6 = 6,
        /**
         * 人物方向 ↙
         */
        face7 = 7,
    }
    /**
     * 朝向工具，用于处理斜45°人物朝向
     * @author 3tion
     *
     */
    const FaceToUtils: {
        FacePos: number[][];
        FaceToRad: number[];
        FaceToDeg: number[];
        FaceToRadSin: number[];
        FaceToRadCos: number[];
        OPPS: number[];
        getFaceTo: (rad: number) => number;
        getFaceTo8: (fx: number, fy: number, tx: number, ty: number) => number;
        getMouseFaceTo8: (fx: number, fy: number, tx: number, ty: number) => number;
    };
}
declare module junyou {
    /**
     * 异步工具类，用于加方法兼听
     * @author 3tion
     *
     */
    class AsyncHelper {
        _ready: boolean;
        protected _readyExecutes: CallbackInfo<Function>[];
        /**
         * 是否已经处理完成
         */
        readonly isReady: boolean;
        constructor();
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
        addReadyExecute(handle: Function, thisObj?: any, ...args: any[]): void;
    }
}
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
         * 尝试调用某个功能<br/>
         * data 为功能ID
         */
        MODULE_TRY_TOGGLE = -997,
        /**
        * 有功能，服务端要求临时关闭<br/>
        * data 为功能ID
        */
        MODULE_SERVER_CLOSE = -996,
        /**
        * 有临时关闭的功能，服务端要求再打开<br/>
        * data 为功能ID
        */
        MODULE_SERVER_OPEN = -995,
        /**
         * 模块显示状态发生改变发生改变<br/>
         * data 为剩余未显示的按钮数量
         */
        MODULE_SHOW_CHANGED = -994,
        /**
         * 有模块需要检查是否会造成显示变化
         */
        MODULE_NEED_CHECK_SHOW = -993,
        /**
         * 有模块不符合显示的条件
         * data 为功能ID
         */
        MODULE_NOT_SHOW = -992,
        /**
         * 有模块显示了
         */
        MODULE_SHOW = -991,
    }
}
declare module junyou {
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
            new(): any;
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
        readonly mm: ModuleManager;
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
            new(): Proxy;
        }, proxyName?: Key, async?: boolean): void;
        /**
         *
         * 注册内部Mediator模块
         * @param {{ new (): Mediator }} ref Mediator创建器
         * @param {string} [mediatorName]   注册的模块名字
         */
        registerInlineMediator(ref: {
            new(): Mediator;
        }, mediatorName?: Key): void;
        /**
         * 注册Proxy的配置
         * @param className     类名字，完整名字
         * @param name     模块名称
         * @param scriptid      要加载的脚本ID，用于加载脚本代码，空的id表示是主脚本
         */
        registerProxyConfig(className: string, proxyName: Key, url?: string, scriptid?: string): void;
        /**
         * 注册模块的配置
         * @param className
         * @param name
         * @param scriptid      要加载的脚本ID，用于加载脚本代码
         */
        registerMediatorConfig(className: string, moduleID: Key, url?: string, scriptid?: string): void;
        private getOrCreateScript(dele);
        /**
         * 获取Proxy
         *
         * @param {Key} proxyName proxy的名字
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        getProxy(proxyName: Key, callback?: {
            (proxy: Proxy, ...args: any[]);
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
            (mediator: Mediator, ...args: any[]);
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
        private _solveScriptCallback(bin);
        private _getHost(bin);
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
        (proxy: Proxy, ...args: any[]);
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
        (mediator: Mediator, ...args: any[]);
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
        (this: T, e?: egret.Event);
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
        (this: T, e?: egret.Event);
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
    function hasListen(type: Key): any;
    const enum ToggleState {
        HIDE = -1,
        AUTO = 0,
        SHOW = 1,
    }
}
declare module junyou {
    /**
     * 基于4个顶点变形的纹理
     *
     * @export
     * @class QuadTransform
     */
    class QuadTransform {
        private _tex;
        private _canvas;
        private _content;
        constructor();
        /**
         * 绘制白鹭的可视对象，并且进行变形
         *
         * @param {egret.DisplayObject} display
         * @param {{ x: number, y: number }} ptl
         * @param {{ x: number, y: number }} ptr
         * @param {{ x: number, y: number }} pbl
         * @param {{ x: number, y: number }} pbr
         *
         * @memberOf QuadTransform
         */
        drawDisplay(display: egret.DisplayObject, ptl?: QuadTransformPoint, ptr?: QuadTransformPoint, pbl?: QuadTransformPoint, pbr?: QuadTransformPoint): egret.BitmapData;
    }
    interface QuadTransformPoint extends Point {
        Rx?: number;
        Ry?: number;
    }
}
declare module junyou {
    /**
     *
     * @author
     *
     */
    interface IAsyncPanel extends egret.DisplayObject, IAsync, IModulePanel {
    }
}
declare module junyou {
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
        protected _preViewReady: boolean;
        /**
         * 视图
         */
        $view: IModulePanel;
        /**
         *  获取视图
         */
        view: IModulePanel;
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
declare module junyou {
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
        protected onScriptLoaded(): void;
    }
}
declare module junyou {
    interface Path {
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
    interface JConfig {
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
         * 路径
         *
         * @type {{
         *             res: Path,
         *             skin: Path,
         *             [indes: string]: Path
         *         }}
         * @memberOf JConfig
         */
        paths: {
            res: Path;
            skin: Path;
            [indes: string]: Path;
        };
    }
    /**
     * 配置工具
     * @author 3tion
     * @export
     * @class ConfigUtils
     */
    const ConfigUtils: {
        setData(data: JConfig): void;
        getResUrl(uri: string, sameDomain?: boolean): string;
        getParam(key: string): any;
        getSkinPath: (key: string, fileName: string) => string;
        getSkinFile(key: string, fileName: string): string;
        regSkinPath(key: string, path: string, iPrefix?: boolean): void;
        getUrl(uri: string, pathKey: string): string;
    };
}
declare module junyou {
    /**
     * 用于和服务端通信的数据
     * @author 3tion
     */
    abstract class Service extends Proxy {
        protected _ns: NetService;
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
declare module junyou {
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
/**
 * DataLocator的主数据
 * 原 junyou.DataLocator.data  的全局别名简写
 */
declare const $DD: junyou.CfgData;
/**
 * DataLocator的附加数据
 * 原junyou.DataLocator.extra 的全局别名简写
 */
declare var $DE: junyou.ExtraData;
declare module junyou {
    /**
     * 表单最终被解析成的类型
     *
     * @export
     * @enum {number}
     */
    const enum CfgDataType {
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
        Dictionary = 3,
    }
    /**
     * 配置加载器<br/>
     * 用于预加载数据的解析
     * @author 3tion
     *
     */
    let DataLocator: {
        regParser: (key: keyof CfgData, parser: ConfigDataParser) => void;
        parsePakedDatas(): void;
        regCommonParser(key: keyof CfgData, CfgCreator: 0 | (new () => any) | (() => any), idkey?: string | 0, type?: CfgDataType): void;
    };
    /**
     * 配置数据解析函数
     */
    interface ConfigDataParser {
        (data: any): any;
    }
    /**
     * 附加数据
     *
     * @interface ExtraData
     */
    interface ExtraData {
    }
    /**
     * 配置数据
     *
     * @export
     * @interface CfgData
     */
    interface CfgData {
    }
}
declare module junyou {
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
        constructor();
        protected init(from?: any): void;
    }
}
declare module junyou {
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
        check(data: any[], showtip: boolean): boolean;
    }
}
declare module junyou {
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
        Closed = 2,
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
        Closed = 2,
    }
}
declare module junyou {
    /**
     * 模块检测器
     * @author
     *
     */
    interface IModuleChecker extends ILimitChecker {
        /**
         * 检查并修正显示限制和使用限制值配错的情况
         * @param	{any[]}	showLimits		显示限制的数据
         * @param	{any[]}	limits			使用限制的数据
         * @return	{boolean}   <br/>true 有配置错误<br/>false 无配置错误
         */
        adjustLimitDatas(showLimits: any[], limits: any[]): boolean;
    }
}
declare module junyou {
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
declare module junyou {
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
         * 需要检查显示
         */
        _needCheckShow: boolean;
        /**
         * 未显示的按钮的模块
         */
        _unshowns: (string | number)[];
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
        _handlersByType: {
            [index: number]: ModuleHandler;
        };
        /**
         * Key      {string}            模块id<br/>
         * Value    {IModuleHandler}    模块处理器
         */
        _handlersById: {
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
        checkers: {
            [index: number]: IModuleChecker;
        };
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
        isModuleOpened(module: string | number | IModuleCfg, showtip: boolean): boolean;
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
         * 检查显示
         * @param event
         *
         */
        checkShowHandler(): void;
        _checkShowHandler(): void;
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
    }
}
declare module junyou {
    /**
     * 模块参数
     *
     * @export
     * @interface ModuleParam
     */
    interface ModuleParam {
    }
}
declare module junyou {
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
        HIDING = 3,
    }
}
declare module junyou {
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
declare module junyou {
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
        registerModuleLayers(moduleid: Key, ...ids: GameLayerID[]): void;
        checkShowBlur(id: Key): void;
        checkHideBlur(id: Key): void;
        protected drawBlur(e?: egret.Event): void;
        hideBlur(): void;
    }
}
declare module junyou {
    interface Panel extends IAsync {
    }
    /**
     * 模块面板
     * @author 3tion
     *
     */
    class Panel extends egret.Sprite implements SuiDataCallback, IAsyncPanel {
        /**
         * 模态颜色
         *
         * @static
         * @type {number}
         */
        static MODAL_COLOR: number;
        /**
         * 模态透明度
         *
         * @static
         * @type {number}
         */
        static MODAL_ALPHA: number;
        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;
        /**
         * 模块ID
         */
        moduleID: string | number;
        /**
         *
         * 面板在fla中的原始坐标
         * @readonly
         *
         * @memberOf Panel
         */
        /**
         * 设置原始大小和坐标
         */
        suiRawRect: egret.Rectangle;
        /**
         * 面板在fla中的原始坐标
         *
         * @protected
         * @type {egret.Rectangle}
         */
        protected _baseRect: egret.Rectangle;
        /**
         * 自己的key(fla的文件名)
         */
        protected _key: string;
        /**
         * 依赖的除lib,自己以外的其他fla
         */
        protected _otherDepends: string[];
        protected _className: string;
        /**
         * 所有依赖的fla资源
         *
         * @protected
         * @type {string[]}
         */
        protected _depends: string[];
        protected _ready: boolean;
        /**
         * 模态
         *
         * @protected
         * @type {egret.Sprite}
         */
        protected modal: egret.Shape;
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
        constructor();
        readonly isReady: boolean;
        protected init(): void;
        bind(key: string, className: string, ...otherDepends: string[]): void;
        startSync(): void;
        protected loadNext(): void;
        suiDataComplete(suiData: SuiData): void;
        suiDataFailed(suiData: SuiData): void;
        /**
         * 绑定皮肤
         */
        protected bindComponent(): void;
        /**
         * 皮肤数据加载完成
         */
        skinDataComplete(): void;
        protected modalToStage(): void;
        isModal: boolean;
        protected _mTouchClose: boolean;
        /**
         * 设置模式窗口的灰色区域是否可以点击关闭面板
         *
         * @param {boolean} value
         */
        setModalTouchClose(value: boolean): void;
        /**
         * 加模态
         *
         * @public
         */
        addModal(width?: number, height?: number): void;
        private onModalResize();
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
        protected readonly isShow: boolean;
        show(): void;
    }
}
declare module junyou {
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
declare module junyou {
    class View extends egret.Sprite {
        constructor(key: string, className: string);
    }
}
declare module junyou {
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
        BottomRight = 8,
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
        private draw(x, y);
    }
}
declare module junyou {
    /**
     * 图片
     * 外部加载
     * @pb
     *
     */
    class Image extends egret.Bitmap {
        /**
         * 资源唯一标识
         */
        uri: string;
        /**
         * 在flash中设置的大小
         *
         * @type {egret.Rectangle}
         * @memberOf Image
         */
        suiRawRect?: egret.Rectangle;
        noWebp?: boolean;
        constructor();
        addedToStage(): void;
        removedFromStage(): void;
        /**
         * 设置资源标识
         */
        source: string;
        /**
         * 销毁图片
         */
        dispose(): void;
    }
}
declare module junyou {
    interface ListItemRenderSkin extends egret.DisplayObject {
        $_rndIdx?: number;
    }
    interface ListItemRender<T> extends egret.EventDispatcher {
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
            ();
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
        index: number;
        protected _data: T;
        private _dataChange;
        dataChange: boolean;
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
        protected _container: egret.DisplayObjectContainer;
        /**
         * 是否已经检查过尺寸
         */
        private _sizeChecked;
        private _oldWidth;
        private _oldHeight;
        inited: boolean;
        constructor();
        /**
         * 子类重写
         * 初始化组件
         * 一定要super调一下
         */
        bindComponent(): void;
        private onTouchTap();
        protected $setData(value: T): void;
        data: T;
        /**
         * 设置容器
         *
         * @param {egret.DisplayObjectContainer} value
         *
         * @memberOf ListItemRenderer
         */
        setContainer(value: egret.DisplayObjectContainer): this;
        skin: S;
        protected $setSkin(value: S): void;
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
        readonly view: S;
        private _visible;
        visible: boolean;
        protected $setVisible(value: boolean): void;
        selected: boolean;
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
        dispatch(type: Key, bubbles?: boolean, data?: any, cancelable?: boolean): boolean;
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
        readonly isReady: boolean;
        startSync(): void;
    }
}
declare module junyou {
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
        readonly totalpageCount: number;
        bindObj(content: egret.DisplayObject, scrollRect: egret.Rectangle, scrollbar?: ScrollBar): void;
        protected onTargetTouchBegin(e: egret.TouchEvent): void;
        protected endTouchContent(e: egret.TouchEvent): void;
        private autoScrollToNextPage(e);
    }
}
declare const enum ScrollDirection {
    Vertical = 0,
    Horizon = 1,
}
declare module junyou {
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
         * @param {string} typeKey 数据源/配置的 类型 上例为 **`type`**
         * @param {string} toDatasKey  配置的数值存储的数据的数组属性名，上例为 **`datas`**
         * @memberof DataUtilsType
         */
        parseDatas(to: object, from: object, checkStart: number, checkEnd: number, dataKey: string, typeKey: string, toDatasKey: string): void;
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
         * @param {string} typeKey 数据源/配置的 类型 上例为 **`type`**
         * @param {string} toDatasKey  配置的数值存储的数据的数组属性名，上例为 **`datas`**
         * @memberof DataUtilsType
         */
        parseDatas2(to: any, valueList: any[], keyList: string[], checkStart: number, checkEnd: number, dataKey: string, typeKey: string, toDatasKey: string): any;
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
    }
    /**
     *
     * @author 君游项目解析工具
     *
     */
    const DataUtils: DataUtilsType;
}
declare module junyou {
    interface DataUtilsType {
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
    }
}
declare module junyou {
    /**
     * 为已布局好的render提供List功能
     *
     * @export
     * @class MPageList
     * @extends {PageList}
     */
    class MPageList<T, R extends ListItemRender<T>> extends AbsPageList<T, R> {
        protected _viewCount: number;
        constructor();
        displayList(data?: T[]): void;
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        updateByIdx(index: number, data: T): void;
        addItem(item: R, index?: number): void;
        protected _get(index: number): R;
        clear(): void;
        dispose(): void;
    }
}
declare module junyou {
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
         * 列表共有几列（最小1最大9999）
         *
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
    }
    class PageList<T, R extends ListItemRender<T>> extends AbsPageList<T, R> {
        protected _factory: ClassFactory<R>;
        /**
         * 根据render的最右侧，得到的最大宽度
         */
        protected _w: number;
        /**
         * 根据render的最下方，得到的最大高度
         */
        protected _h: number;
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
        private _scrollType;
        private _waitForSetIndex;
        private _waitIndex;
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
        container: egret.Sprite;
        /**
         * Creates an instance of PageList.
         * @param {ClassFactory<R> | Creator<R>} renderfactory
         * @param {PageListOption} [option]
         */
        constructor(renderfactory: ClassFactory<R> | Creator<R>, option?: PageListOption);
        protected init(option: PageListOption): void;
        displayList(data?: T[]): void;
        /**
         * 初始化render占据array，不做任何初始化容器操作
         *
         * @private
         */
        private initItems();
        protected onChange(): void;
        protected _get(index: number): R;
        protected onSizeChange(): void;
        /**
         * 重新计算Render的坐标
         *
         * @private
         * @param {number} [start]
         * @param {number} [end]
         * @returns
         */
        protected reCalc(): void;
        selectedIndex: number;
        private moveScroll(render);
        tweenX: number;
        tweenY: number;
        /**
         * 滚动到指定index
         */
        tweenToIndex(index: number): void;
        selectItemByData<K extends keyof T>(key: K, value: T[K], useTween?: boolean): void;
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        updateByIdx(index: number, data: T): void;
        removeAt(idx: number): void;
        removeItem(item: R): void;
        protected _removeRender(item: R): void;
        private refreshByRemoveItem();
        /**
         * 销毁
         *
         */
        dispose(): void;
        /**
         * 清理
         *
         */
        clear(): void;
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
        protected _lastRect: egret.Rectangle;
        protected checkViewRect(): void;
    }
}
declare module junyou {
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
declare module junyou {
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
    }
}
declare module junyou {
    /**
     * 用于固定一些组件的宽度和高度，让其等于取出的值
     *
     * @export
     * @param {Object} define                       定义
     * @param {{ size: egret.Rectangle }} view
     * @returns
     */
    function bindSize(define: Object, view: {
        size: egret.Rectangle;
    }): void;
}
declare module junyou {
    /**
     * 创建器
     */
    type Creator<T> = {
        new(): T;
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
            ();
        };
        /**
         * 启用时触发
         */
        onSpawn?: {
            ();
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
     * @param {({ new(): T & { _pool?: RecyclablePool<T> } })} clazz
     */
    function recyclable<T>(clazz: {
        new(): T & {
            _pool?: RecyclablePool<T>;
        };
    }): Recyclable<T>;
    /**
     * 使用创建函数进行创建
     *
     * @export
     * @template T
     * @param {({ (): T & { _pool?: RecyclablePool<T> } })} clazz
     * @param {true} addInstanceRecycle
     */
    function recyclable<T>(clazz: {
        (): T & {
            _pool?: RecyclablePool<T>;
        };
    }, addInstanceRecycle?: boolean): Recyclable<T>;
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    function singleton<T>(clazz: {
        new(): T;
        _instance?: T;
    }): T;
}
declare module junyou {
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
        ITEM_SELECTED = -1052,
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
    }
}
declare module junyou {
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
        MCProgress = 21,
    }
}
declare module junyou {
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
declare module junyou {
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
        /**
         * 最大纹理加载失败次数
         *
         * @protected
         * @memberof SuiBmd
         */
        protected _maxErrCount: number;
        protected _url: string;
        readonly url: string;
        /**
         * 使用计数
         */
        using: number;
        readonly isStatic: boolean;
        private _uri;
        readonly resID: string;
        lastUseTime: number;
        /**
         * 未加载的时候，请求的位图
         */
        loading: SuiBmdCallback[];
        protected _errCount: number;
        constructor(uri: string, url: string);
        loadBmd(): void;
        protected checkBitmap(tex: egret.Texture, key: string): void;
        checkExpire(expiredUseTime: number): void;
        dispose(): void;
    }
}
declare module junyou {
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
         * fla的名字
         */
        key: string;
        /**
         * 加载地址
         */
        url: string;
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
        sourceComponentData: Object;
        createBmpLoader(ispng: boolean, textures: egret.Texture[]): void;
        noRes(uri: string, file: string, textures: egret.Texture[]): SuiBmd;
        /**
         * 刷新位图
         *
         * @param {SuiBmdCallback} bmp  要刷新的位图
         * @param {boolean} [isjpg]     是否为jpg纹理，默认为png
         */
        checkRefreshBmp(bmp: SuiBmdCallback, isjpg?: boolean): boolean;
        /**获取对应索引位置的texture */
        getTexture(index: number): egret.Texture;
        loadBmd<T extends Function>(callback: CallbackInfo<T>): void;
    }
}
declare module egret {
    interface DisplayObject {
        /**
         * 扩展sui的可视对象，的原始尺寸和坐标
         *
         * @type {egret.Rectangle}
         * @memberOf DisplayObject
         */
        suiRawRect?: egret.Rectangle;
    }
}
declare module junyou {
    import Texture = egret.Texture;
    const DATA_FILE = "s.json";
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
                new(): BaseCreator<egret.DisplayObject>;
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
         * 加载数据
         */
        loadData(key: string, callback: SuiDataCallback): void;
        /**
         *
         * 直接将已经加载好的内置数据，和key进行绑定
         * @param {string} key
         * @param {*} data
         */
        setInlineData(key: string, data: any): void;
        /**
         *
         * 初始化数据
         * @private
         * @param {*} data
         * @param {SuiData} suiData
         */
        private _initSuiData(data, suiData);
        /**
         * 数据加载完成
         */
        protected checkData(data: any, key: string): void;
        /**
         * 处理控件数据
         */
        protected parseComponentData(allComData: {
            0: string[];
            1: any[];
            2: SizeData[];
        }[], suiData: SuiData): void;
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
        private _createComponents(suiData, view, compsData);
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
declare module junyou {
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
        value: string | number;
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
declare module junyou {
    /**
     * 平台数据
     * @author 3tion
     *
     */
    class AuthData {
        /**
         * 平台标识
         */
        pid: string;
        /**
         * 平台账号
         */
        puid: string;
        /**
         * 服务器标识
         */
        sid: number;
        /**
         * 会话标识
         */
        sessionID: string;
        /**
         * 验证信息
         */
        sign: string;
        /**
         * 认证次数
         *
         * @type {number}
         * @memberOf AuthData
         */
        count: number;
        /**
         *
         * 如果是老账号，有角色列表
         * @type {{ sid: number, _id: number, lastLogin: number }[]}
         */
        roles: {
            sid: number;
            _id: number;
            lastLogin: number;
        }[];
        constructor();
        toURLString(): string;
    }
}
declare module junyou {
    /**
     * 用户认证
     * @author 3tion
     *
     */
    const enum AuthState {
        /**
         * 认证成功
         */
        AUTH_SUCCESS = 0,
        /**
         * 票据验证失败，要求客户端重新登录
         */
        AUTH_FAILED = 1,
        /**
         * 认证服务器忙
         */
        AUTH_SERVER_BUSY = 2,
    }
}
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
        width: number;
        private setMinValue(e);
        private addValue(e);
        private subValue(e);
        private setMaxValue(e);
        value: number;
        minValue: number;
        maxValue: number;
    }
    class NumericStepperCreator extends BaseCreator<NumericStepper> {
        private uiData;
        private txtCreator;
        private btnCreator;
        private scale9Creator;
        private suiManager;
        constructor();
        parseSelfData(data: any): void;
        private createNumericStepper();
    }
}
declare module junyou {
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
        /**自定义文本显示方法*/
        labelFun: (value: number, maxValue: number) => string;
        /**
         * 设置进度条宽度
         *
         * @param {number} width
         */
        setWidth(width: number): void;
        skin: ProgressBarSkinDele;
        progress(value: number, maxValue: number): void;
        private updateLabel();
        private updateBar();
        private refresh();
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
declare module junyou {
    /**
     *
     * 用于处理从Flash中导出的带九宫缩放的位图
     * @export
     * @class ScaleBitmap
     * @extends {egret.Bitmap}
     * @author gushuai
     */
    class ScaleBitmap extends egret.Bitmap {
        width: number;
        height: number;
        constructor();
        /**
        * @private
        *
        * @param context
        */
        $render(): void;
    }
    class ScaleBitmapCreator extends BitmapCreator<ScaleBitmap> {
        constructor();
        parseSelfData(data: any): void;
    }
}
declare module junyou {
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
        /**滚动条方式 0：垂直，1：水平 defalut:0*/
        scrollType: ScrollDirection;
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
        bgSize: number;
        /**
         * 滑块的尺寸
         */
        barSize: number;
        /**当垂直滚动时，此值为滑块的宽度，当水平滚动时，此值为滑块的高度 */
        supportSize: number;
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
        private createScrollBar();
    }
}
declare module junyou {
    class ShareBitmapCreator extends BitmapCreator<egret.Bitmap> {
        constructor();
        parseSelfData(data: any): void;
    }
}
declare module junyou {
    class Slider extends Component {
        private _width;
        private _height;
        private _value;
        /***滑块 */
        thumb: egret.Sprite;
        /****底 */
        bgline: egret.Sprite;
        private _bgBmp;
        private tipTxt;
        private _lastThumbX;
        private _maxVlaue;
        private _minValue;
        private _step;
        /**每步step需要的像素 */
        private _perStepPixel;
        private _halfThumbWidth;
        private _barEnabled;
        constructor();
        private addListener();
        private onAddToStage(e);
        barEnabled: boolean;
        private bgClick(e);
        private bgOut(e);
        private onThumbBegin(e);
        private onThumbEnd(e);
        private mouseMove(e);
        private calculatevalue(currentX);
        private initBaseContainer();
        /**
         * 设置底条新式
         *
         * @param {ScaleBitmap} bg (description)
         */
        setBg(bg: ScaleBitmap): void;
        /**
         * 设置滑块样式
         *
         * @param {egret.Bitmap} tb (description)
         */
        setThumb(tb: egret.Bitmap): void;
        value: number;
        /**
         * 设置底条宽度
         */
        width: number;
        /**
         * 设置底条高度
         */
        height: number;
        maxVlaue: number;
        minValue: number;
        /**
         * 滑块移动一个单位的值
         */
        step: number;
        private checkStepPixel();
    }
    class SliderCreator extends BaseCreator<Slider> {
        private uiData;
        private txtCreator;
        private scale9Creator;
        private bitmapCreator;
        private suiManager;
        constructor();
        parseSelfData(data: any): void;
        private createSlider();
    }
}
declare module junyou {
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
        Custom = 2,
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
        data: any;
        /**
         * 设置数据，只允许子类调用
         * @protected
         */
        $setData<T>(value: T): void;
        rect: egret.Rectangle;
        countTxt: egret.TextField;
        iconSource: string;
        count: number;
        /**
         * 数量显示状态<br/>
         * 0 不显示数值<br/>
         * 1 默认显示大于1的数量<br/>
         * 2 大于1的数量，显示数值，超过一万的，会以xxx万显示 默认为2<br/>
         */
        countShow: SlotCountShow;
        refreshCount(): void;
        getCount(): string;
        invalidateDisplay(): void;
        refreshDisplay(): boolean;
        /**
         * 皮肤添加到舞台
         */
        awake(): void;
        /**
         * 销毁
         * to be override
         */
        dispose(): void;
        readonly width: number;
        readonly height: number;
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
         * @type {junyou.TextData}
         * @memberof TextField
         */
        rawTextData: junyou.TextData;
    }
}
declare module junyou {
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
        constructor();
        parseSelfData(data: TextData): void;
        initTextData(tf: egret.TextField, data: TextData): void;
    }
}
declare module junyou {
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
declare module junyou {
    const enum LayoutType {
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
        BOTTOM_RIGHT = 15,
    }
    const enum LayoutTypeVertical {
        TOP = 4,
        MIDDLE = 8,
        BOTTOM = 12,
    }
    const enum LayoutTypeHorizon {
        LEFT = 1,
        CENTER = 2,
        RIGHT = 3,
    }
    interface LayoutDisplay {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        parent?: LayoutDisplayParent;
        $layoutSize?: Size;
        display?: egret.DisplayObject;
    }
    interface LayoutDisplayParent extends Size {
    }
    /**
     *
     * @author 3tion
     *
     */
    const Layout: {
        layout(dis: LayoutDisplay, layout: LayoutType, hoffset?: number, voffset?: number, outerV?: boolean, outerH?: boolean, parent?: LayoutDisplayParent): void;
        layoutPercent(dis: LayoutDisplay, top?: number, left?: number, parent?: LayoutDisplayParent, padx?: number, pady?: number): egret.DisplayObject;
        getLayoutPos: (disWidth: number, disHeight: number, parentWidth: number, parentHeight: number, layout: LayoutType, result?: Point, hoffset?: number, voffset?: number, outerV?: boolean, outerH?: boolean) => Point;
        tipLayout(layoutDis: LayoutDisplay, point: Point, padx?: number, pady?: number, parent?: LayoutDisplayParent): void;
        getTipLayoutPos: (disWidth: number, disHeight: number, parentWidth: number, parentHeight: number, point: Point, result?: Point, padx?: number, pady?: number) => Point;
    };
}
interface ExternalParam {
    /**
     * 用户标识
     *
     * @type {string}
     * @memberOf $ep
     */
    uid: string;
    /**
     * 服务器id
     *
     * @type {string}
     * @memberOf $ep
     */
    sid: string;
    /**
     * 服务器ip
     *
     * @type {string}
     * @memberOf $ep
     */
    ip: string;
    /**
     * 端口号
     *
     * @type {number}
     * @memberOf $ep
     */
    port: number;
    /**
     * 平台标识
     *
     * @type {string}
     * @memberOf $ep
     */
    pid: string;
    /**
     * 验证标识
     *
     * @type {string}
     * @memberOf $ep
     */
    sign?: string;
    /**
     * 其他参数
     *
     * @type {*}
     * @memberOf $ep
     */
    other?: any;
}
declare var $useDPR: boolean;
declare var dpr: number;
declare module junyou {
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
        add(d: egret.DisplayObject, type: LayoutType, offsetRect: egret.Rectangle, hide?: boolean): void;
        protected binLayout(bin: LayoutBin): void;
    }
}
declare module junyou {
    interface ResizeBin {
        layout: LayoutType;
        hoffset?: number;
        voffset?: number;
        container?: egret.DisplayObjectContainer;
    }
    type ResizeDisplay = egret.DisplayObject & {
        $_resize?: ResizeBin;
    };
    class ResizeManager {
        protected _stage: egret.Stage;
        protected _list: ResizeDisplay[];
        init(stage?: egret.Stage): void;
        /**
         *
         * 添加一个元件，相对于container的布局
         * @param {ResizeDisplay} dis
         * @param {number} layout
         * @param {number} [hoffset]
         * @param {number} [voffset]
         * @param {egret.DisplayObjectContainer} [container] 默认使用stage
         *
         * @memberOf ResizeManager
         */
        add(dis: ResizeDisplay, layout: number, hoffset?: number, voffset?: number, container?: egret.DisplayObjectContainer): void;
        /**
         * 移除元件
         *
         * @param {egret.DisplayObject} dis (description)
         * @returns (description)
         */
        remove(dis: ResizeDisplay): void;
        protected onAdded(e: egret.Event): void;
        protected resize(dis: ResizeDisplay): void;
        protected onResize(): void;
        dispose(): void;
    }
}
declare module junyou {
    /**
     *
     * @author
     *
     */
    interface IList {
        getItemViewAt(idx: number): egret.DisplayObject;
    }
}
declare module junyou {
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
declare module junyou {
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
            (target, menu: Menu);
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
            (target, menu: Menu);
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
        private static onShowOrHideMenu(e);
        constructor(style: MenuStyle<MenuBaseRender<MenuBaseVO>>, maxRendercount: number);
        protected bindComponent(): void;
        /**
         * 显示菜单操作项
         */
        displayMenuDatas(vos: MenuBaseVO[]): void;
    }
}
declare module junyou {
    /**
     * 获取XMLHttpRequest对象
     *
     * @export
     * @returns
     */
    function getXHR(): XMLHttpRequest;
}
interface Window {
    XMLHttpRequest?: XMLHttpRequest;
}
interface ActiveXObject {
    new(key: "MSXML2.XMLHTTP"): XMLHttpRequest;
}
declare const ActiveXObject: ActiveXObject;
declare module junyou {
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
            <T extends MenuBaseVO>(this: SelectableComponents, vo: T);
        };
    }
}
declare module junyou {
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
            new(): T;
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
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
declare module junyou {
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
        private init(maxWidth, maxHeight, corner);
        setTipData(msg: string): void;
        private drawRect(x, y, width, height);
        show(container: egret.DisplayObjectContainer, x?: number, y?: number): void;
        hide(): void;
    }
}
declare module junyou {
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
        private clearDisListener(dis);
        onRecycle(): void;
        private checkTouch(e);
        private showTip();
        private touchEnd(e);
    }
}
declare module junyou {
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
declare module junyou {
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
        readonly selected: ReadonlyArray<IGroupItem>;
        clear(): void;
    }
}
declare module junyou {
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
        protected _send(cmd: number, data: any, msgType: string): void;
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
declare module junyou {
    /**
     * 绑定按钮和文本框，让文本框的点击，可以触发按钮的选中事件
     *
     * @export
     */
    var GroupItemButton: {
        bind(btn: Button, txt: egret.TextField): void;
        loose(btn: Button): void;
    };
}
declare module junyou {
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
    }
}
declare module junyou {
    const enum TouchDownConst {
        /**
         * TouchDown时放大比例
         */
        Scale = 1.1,
        /**
         * 居中后的乘数
         * (Scale-1)*0.5
         */
        Multi = 0.05,
    }
    /**
     * TouchDown显示对象放大效果
     * description
     * @author pb
     */
    const TouchDown: {
        bindItem(item: TouchDownItem): void;
        looseItem(item: TouchDownItem): void;
    };
}
declare module junyou {
    /**
     * 可做TouchDown放大的对象接口
     * description
     * @author pb
     */
    interface TouchDownItem extends egret.EventDispatcher {
        x: number;
        y: number;
        $_tdi?: TouchDownRaw;
    }
    interface TouchDownRaw {
        x: number;
        y: number;
        tween: Tween;
    }
}
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
declare module junyou {
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
declare module junyou {
    /**
     * 区段 -1 ~ -19
     *
     * @export
     * @enum {number}
     */
    const enum EventConst {
        TWEEN_CHANGE = -1,
    }
}
declare module junyou {
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
declare module junyou {
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
        REVERSE = 2,
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
            (e?: egret.Event);
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
        private initialize(target, props, pluginData, manager);
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
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
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
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
declare module junyou {
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
declare module junyou {
    /**
     * 基本单位<br/>
     * 是一个状态机<br/>
     * @author 3tion
     *
     */
    abstract class Unit extends egret.EventDispatcher {
        /**
         * 单位状态
         *
         * @type {UnitState}
         */
        state: UnitState;
        /**
         * 单位标识
         */
        guid: Key;
        /**
         * 播放速度，默认为1倍速度<br/>
         * 值越高，速度越快
         */
        /**
         * 设置播放速度
         */
        playSpeed: number;
        /**
         * 用于放纸娃娃贴图的容器
         * 只允许放ResourceBitmap
         */
        protected _model: UModel;
        /**
         * 用于放纸娃娃贴图的容器
         * 只允许放ResourceBitmap
         */
        readonly model: Readonly<UModel>;
        /**
         * 人物身体
         */
        protected body: DSprite;
        /**
         * 人物底图资源的字典
         */
        protected _resDict: {
            [index: string]: UnitResource;
        };
        /**
         * 人物底图资源的字典
         * key      {string}            部位
         * value    {UnitResource}      资源
         * @readonly
         * @type {{}
         */
        readonly resDict: {
            readonly [index: string]: UnitResource;
        };
        /**
         * 当前骑乘标识
         */
        protected _mountType: MountType;
        /**
         * 资源列表改变
         */
        protected _resListChange: Boolean;
        /**
         * 打包信息
         */
        protected _pstInfo: PstInfo;
        /**
         * 渲染器
         */
        protected _render: UnitRender;
        /**
         * 角色的动作序列
         *
         * @protected
         * @type {number}
         */
        protected _action: number;
        /**
         * 纸娃娃排序列表
         * 从下层到上层排序
         * @protected
         * @type {Key[]}
         */
        protected _partList: Key[];
        /**
         * 上一次渲染的信息
         *
         * @protected
         * @type {FrameInfo}
         */
        lastFrame: Readonly<FrameInfo>;
        /**
         * 设置单位pst
         */
        pst: string;
        protected abstract pstInfoChange(): any;
        protected abstract getPstInfo(pst: string): PstInfo;
        init(pst: string, setting: UnitSetting): this;
        onSpawn(): void;
        /**
         * 重置渲染器时间
         *
         * @param {number} now (description)
         */
        resetRenderTime(now: number): void;
        /**
         * 初始化显示列表
         * @param setting
         */
        protected initDisplayList(setting: UnitSetting): void;
        /**
         * 获取朝向
         */
        /**
         * 设置朝向
         */
        faceTo: number;
        /**
         * 播放自定义动作
         *
         * @param {ActionInfo} customAction 自定义动作
         * @param {number} [startFrame=-1]  起始帧
         */
        doCustomAction(customAction: ActionInfo, startFrame?: number): void;
        /**
         * 执行动作序列
         * @private 只允许UnitAction调用
         */
        doAction(now: number, action: number, startFrame?: number): Readonly<ActionInfo>;
        /**
         * 获取当前动作序列
         */
        getCurAction(): Readonly<ActionInfo>;
        /**
         * 对指定部位设置资源
         *
         * @protected
         * @param {Key} part 部位
         * @param {string} [uri] 资源路径，不传则清空部位
         * @param {string} [pst] 通过其他pst配置进行加载
         */
        protected setRes(part: Key, uri?: string, pst?: string): void;
        /**
         * 资源列表发生改变
         */
        protected invalidateResList(): void;
        /**
         * 刷新资源列表
         */
        protected refreshResList(): void;
        /**
         * 检查/重置资源列表
         *
         * @param {string[]} [resOrder] 部位的排列顺序
         * @param {{ [index: string]: UnitResource }} [resDict] 部位和资源的字典
         */
        checkResList(resOrder?: Key[], resDict?: {
            [index: string]: UnitResource;
        }): void;
        /**
         * 执行默认的，基于enterframe的渲染
         *
         * @protected
         */
        protected $render(): void;
        /**
         * 通过其他方式驱动数据
         *
         * @param {number} now 时间戳
         */
        doData(now: number): void;
        /**
         * 通过其他方式驱动渲染
         *
         * @param {number} now 时间戳
         */
        doRender(now: number): void;
        /**
         * 回收
         */
        onRecycle(): void;
        /**
         * 当前正在执行的动作
         */
        protected _currentAction: UnitAction;
        /**
         * 下一个动作
         */
        protected _nextAction: UnitAction;
        protected aStandBy: UnitAction;
        protected initDefaultAction(): void;
        /**
         * 开始执行单位动作
         * @param {UnitAction} [action]     准备执行的动作，默认为待机动作
         * @param {number}     [now]        执行时间，默认取全局时间
         * @param {boolean}    [override]   是否强制覆盖当前动作，默认为否
         * @return true     成功执行动作
         *         false    未成功执行动作，将动作覆盖到下一个动作
         */
        startUnitAction(action?: UnitAction, now?: number, override?: boolean): boolean;
        /**
         * 停止单位当前动作，做待机动作
         *
         * @param {number} [now]
         */
        stopUnitAction(now?: number): void;
        setMountType(value: MountType): void;
        /**
         * 动作的动画播放完毕
         */
        playComplete(now: number): void;
        /**
         * 动作进行渲染的时候
         */
        onRenderFrame(now: number): void;
        /**
         * 执行动作中的回调事件
         */
        fire(eventType: string, now: number): void;
        /**
         * 加到游戏引擎中
         *
         * @param {boolean} [doRender=true] 是否添加Event.ENTER_FRAME事件
         */
        addedToEngine(doRender?: boolean): void;
        /**
         * 添加到容器中
         *
         * @param {Container} container
         * @param {boolean} [doRender=true]
         *
         * @memberOf Unit
         */
        addToContainer(container: egret.DisplayObjectContainer, doRender?: boolean): void;
        protected _depth: number;
        protected _x: number;
        protected _y: number;
        protected _z: number;
        /**
         * 此方法只允许 UnitAction调用
         */
        x: number;
        /**
         * 此方法只允许 UnitAction调用
         */
        y: number;
        /**
         * 此方法只允许 UnitAction调用
         */
        z: number;
        /**
         * 检查模型和其他的y轴
         */
        protected checkPosition(): void;
        protected _rotation: number;
        /**
         * 获得模型的旋转角度
         */
        /**
         * 设置旋转角度
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
         * 例如，myDisplayObject.rotation = 450语句与 myDisplayObject.rotation = 90 是相同的
         */
        rotation: number;
    }
}
