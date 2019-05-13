"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var jy;
(function (jy) {
    /**
     * 获取完整的 PropertyDescriptor
     *
     * @param {Partial<PropertyDescriptor>} descriptor
     * @param {boolean} [enumerable=false]
     * @param {boolean} [writable]
     * @param {boolean} [configurable=true]
     * @returns
     */
    function getDescriptor(descriptor, enumerable, writable, configurable) {
        if (enumerable === void 0) { enumerable = false; }
        if (writable === void 0) { writable = true; }
        if (configurable === void 0) { configurable = true; }
        if (!descriptor.set && !descriptor.get) {
            descriptor.writable = writable;
        }
        descriptor.configurable = configurable;
        descriptor.enumerable = enumerable;
        return descriptor;
    }
    jy.getDescriptor = getDescriptor;
    function makeDefDescriptors(descriptors, enumerable, writable, configurable) {
        if (enumerable === void 0) { enumerable = false; }
        if (writable === void 0) { writable = true; }
        if (configurable === void 0) { configurable = true; }
        for (var key in descriptors) {
            var desc = descriptors[key];
            var enumer = desc.enumerable == undefined ? enumerable : desc.enumerable;
            var write = desc.writable == undefined ? writable : desc.writable;
            var config = desc.configurable == undefined ? configurable : desc.configurable;
            descriptors[key] = getDescriptor(desc, enumer, write, config);
        }
        return descriptors;
    }
    jy.makeDefDescriptors = makeDefDescriptors;
    /**
     * 移除可视对象
     *
     * @export
     * @param {egret.DisplayObject} display
     */
    function removeDisplay(display) {
        if (display && display.parent) {
            display.parent.removeChild(display);
        }
    }
    jy.removeDisplay = removeDisplay;
})(jy || (jy = {}));
Object.defineProperties(Object.prototype, jy.makeDefDescriptors({
    clone: {
        value: function () {
            var o = {};
            for (var n in this) {
                o[n] = this[n];
            }
            return o;
        }
    },
    getPropertyDescriptor: {
        value: function (property) {
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
        value: function (to) {
            for (var p in this) {
                var data = to.getPropertyDescriptor(p);
                if (!data || (data.set || data.writable)) { // 可进行赋值，防止将属性中的方法给重写
                    to[p] = this[p];
                }
            }
        }
    },
    equals: {
        value: function (checker) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!args.length) {
                args = Object.getOwnPropertyNames(checker);
            }
            for (var i = 0; i < args.length; i++) {
                var key = args[i];
                if (true && key == "_insid" /* DebugIDPropertyKey */) {
                    continue;
                }
                if (this[key] != checker[key]) {
                    return false;
                }
            }
            return true;
        }
    },
    copyWith: {
        value: function (to) {
            var proNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                proNames[_i - 1] = arguments[_i];
            }
            for (var _a = 0, proNames_1 = proNames; _a < proNames_1.length; _a++) {
                var p = proNames_1[_a];
                if (p in this) {
                    to[p] = this[p];
                }
            }
        }
    },
    getSpecObject: {
        value: function () {
            var proNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                proNames[_i] = arguments[_i];
            }
            var obj = {};
            for (var _a = 0, proNames_2 = proNames; _a < proNames_2.length; _a++) {
                var p = proNames_2[_a];
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
Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;
Math.PI2 = 2 * Math.PI;
Math.PI_1_2 = Math.PI * .5;
Math.clamp = function (value, min, max) {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
};
Math.random2 = function (min, max) {
    return min + Math.random() * (max - min);
};
Math.random3 = function (center, delta) {
    return center - delta + Math.random() * 2 * delta;
};
if (!Number.isSafeInteger) { //防止低版本浏览器没有此方法
    Number.isSafeInteger = function (value) { return value < 9007199254740991 /*Number.MAX_SAFE_INTEGER*/ && value >= -9007199254740991; }; /*Number.MIN_SAFE_INTEGER*/
}
Object.defineProperties(Number.prototype, jy.makeDefDescriptors({
    zeroize: jy.getDescriptor({
        value: function (length) { return String.zeroize(this, length); }
    }),
    between: jy.getDescriptor({
        value: function (min, max) { return min <= this && max >= this; }
    })
}));
Object.defineProperties(String.prototype, jy.makeDefDescriptors({
    zeroize: {
        value: function (length) { return String.zeroize(this, length); },
    },
    substitute: {
        value: function () {
            var len = arguments.length;
            if (len > 0) {
                var obj_1;
                if (len == 1) {
                    obj_1 = arguments[0];
                    if (typeof obj_1 !== "object") {
                        obj_1 = arguments;
                    }
                }
                else {
                    obj_1 = arguments;
                }
                if ((obj_1 instanceof Object) && !(obj_1 instanceof RegExp)) {
                    return this.replace(/\{(?:%([^{}]+)%)?([^{}]+)\}/g, function (match, handler, key) {
                        //检查key中，是否为%开头，如果是，则尝试按方法处理                        
                        var value = obj_1[key];
                        if (handler) { //如果有处理器，拆分处理器
                            var func = String.subHandler[handler];
                            if (func) {
                                value = func(value);
                            }
                        }
                        return (value !== undefined) ? '' + value : match;
                    });
                }
            }
            return this.toString(); //防止生成String对象，ios反射String对象会当成一个NSDictionary处理
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
            var arr = this.match(/[\u2E80-\u9FBF]/ig);
            return this.length + (arr ? arr.length : 0);
        }
    }
}));
var _zeros = "000000000000000000000000000000000000000000000000000000000000";
var zeroLen = _zeros.length;
String.zeroize = function (value, length) {
    if (length === void 0) { length = 2; }
    var str = "" + value;
    var zeros;
    var len = length - str.length;
    if (length > 3 && length < zeroLen) {
        zeros = _zeros.slice(0, len);
    }
    else {
        zeros = "";
        for (var i = 0; i < len; i++) {
            zeros += "0";
        }
    }
    return zeros + str;
};
String.subHandler = {};
String.regSubHandler = function (key, handler) {
    if (true) {
        if (handler.length != 1) {
            jy.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u53C2\u6570\u6570\u91CF\u5FC5\u987B\u4E3A\u4E00\u4E2A\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack + "\n\u51FD\u6570\u5185\u5BB9\uFF1A" + handler.toString());
        }
        if (key in this.subHandler) {
            jy.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u6CE8\u518C\u4E86\u91CD\u590D\u7684key[" + key + "]\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack);
        }
    }
    this.subHandler[key] = handler;
};
Object.defineProperties(Date.prototype, jy.makeDefDescriptors({
    format: {
        value: function (mask, local) {
            var d = this;
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
            function gd() { return local ? d.getDate() : d.getUTCDate(); }
            function gM() { return local ? d.getMonth() : d.getUTCMonth(); }
            function gy() { return local ? d.getFullYear() : d.getUTCFullYear(); }
            function gH() { return local ? d.getHours() : d.getUTCHours(); }
            function gm() { return local ? d.getMinutes() : d.getUTCMinutes(); }
            function gs() { return local ? d.getSeconds() : d.getUTCSeconds(); }
        }
    }
}));
Array.binaryInsert = function (partArr, item, filter) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    //根据物品战力进行插入
    var right = partArr.length - 1;
    var left = 0;
    while (left <= right) {
        var middle = (left + right) >> 1;
        var test = partArr[middle];
        if (filter.apply(void 0, [test].concat(args))) {
            right = middle - 1;
        }
        else {
            left = middle + 1;
        }
    }
    partArr.splice(left, 0, item);
};
/**
 * 用于对Array排序时，处理undefined
 */
Array.SORT_DEFAULT = {
    number: 0,
    string: "",
    boolean: false
};
Object.freeze(Array.SORT_DEFAULT);
Object.defineProperties(Array.prototype, jy.makeDefDescriptors({
    cloneTo: {
        value: function (b) {
            b.length = this.length;
            var len = this.length;
            b.length = len;
            for (var i = 0; i < len; i++) {
                b[i] = this[i];
            }
        }
    },
    appendTo: {
        value: function (b) {
            var len = this.length;
            for (var i = 0; i < len; i++) {
                b.push(this[i]);
            }
        }
    },
    pushOnce: {
        value: function (t) {
            var idx = this.indexOf(t);
            if (!~idx) {
                idx = this.length;
                this[idx] = t;
            }
            return idx;
        }
    },
    remove: {
        value: function (t) {
            var idx = this.indexOf(t);
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
            var key, descend;
            var len = arguments.length;
            if (true && len > 2) {
                jy.ThrowError("doSort\u53C2\u6570\u4E0D\u80FD\u8D85\u8FC72");
            }
            for (var i = 0; i < len; i++) {
                var arg = arguments[i];
                var t = typeof arg;
                if (t === "string") {
                    key = arg;
                }
                else {
                    descend = !!arg;
                }
            }
            if (key) {
                return this.sort(function (a, b) { return descend ? b[key] - a[key] : a[key] - b[key]; });
            }
            else {
                return this.sort(function (a, b) { return descend ? b - a : a - b; });
            }
        }
    },
    multiSort: {
        value: function (kArr, dArr) {
            var isArr = Array.isArray(dArr);
            return this.sort(function (a, b) {
                var def = Array.SORT_DEFAULT;
                for (var idx = 0, len = kArr.length; idx < len; idx++) {
                    var key = kArr[idx];
                    var mode = isArr ? !!dArr[idx] : !!dArr;
                    var av = a[key];
                    var bv = b[key];
                    var typea = typeof av;
                    var typeb = typeof bv;
                    if (typea == "object" || typeb == "object") {
                        if (true) {
                            jy.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u5E94\u4E3Aobject," + typea + "    " + typeb);
                        }
                        return 0;
                    }
                    else if (typea != typeb) {
                        if (typea == "undefined") {
                            bv = def[typeb];
                        }
                        else if (typeb == "undefined") {
                            av = def[typea];
                        }
                        else {
                            if (true) {
                                jy.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u4E00\u81F4," + typea + "    " + typeb);
                            }
                            return 0;
                        }
                    }
                    if (av < bv) {
                        return mode ? 1 : -1;
                    }
                    else if (av > bv) {
                        return mode ? -1 : 1;
                    }
                    else {
                        continue;
                    }
                }
                return 0;
            });
        }
    },
    random: {
        value: function () {
            return this[this.length * Math.random() | 0];
        }
    }
}));
/****************************************Map********************************************/
var Map;
if (typeof Map == "undefined") {
    /**
    * 为了兼容低版本浏览器，使用数组实现的map
    * @author 3tion
    *
    */
    Map = /** @class */ (function () {
        function PolyfillMap() {
            this._keys = [];
            this._values = [];
            this._size = 0;
        }
        PolyfillMap.prototype.set = function (key, value) {
            var keys = this._keys;
            var idx = keys.indexOf(key);
            if (~idx) { // idx != -1  覆盖values数组的数据
                this._values[idx] = value;
            }
            else { //idx == -1 新增
                var size = this._size;
                keys[size] = key;
                this._values[size] = value;
                this._size++;
            }
            return this;
        };
        PolyfillMap.prototype.get = function (key) {
            var idx = this._keys.indexOf(key);
            if (~idx) {
                return this._values[idx];
            }
            return;
        };
        PolyfillMap.prototype.has = function (key) {
            return ~this._keys.indexOf(key);
        };
        PolyfillMap.prototype.delete = function (key) {
            var keys = this._keys;
            var idx = keys.indexOf(key);
            if (~idx) { //有索引，干掉key和value
                keys.splice(idx, 1);
                this._values.splice(idx, 1);
                this._size--;
                return true;
            }
            return false;
        };
        PolyfillMap.prototype.forEach = function (callbackfn, thisArg) {
            var keys = this._keys;
            var values = this._values;
            for (var i = 0, len = this._size; i < len; i++) {
                callbackfn(values[i], keys[i], thisArg);
            }
        };
        PolyfillMap.prototype.clear = function () {
            this._keys.length = 0;
            this._values.length = 0;
            this._size = 0;
        };
        Object.defineProperty(PolyfillMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        return PolyfillMap;
    }());
}
var egret;
(function (egret) {
    var bpt = egret.Bitmap.prototype;
    bpt.refreshBMD = function () {
        var tex = this.texture;
        if (tex != null) {
            this.texture = null;
            this.texture = tex;
        }
    };
    /**重写Bitmap.prototype.$refreshImageData用于支持egret的webgl渲染 */
    var $rawRefreshImageData = egret.Bitmap.prototype.$refreshImageData;
    bpt.$refreshImageData = function () {
        $rawRefreshImageData.call(this);
        var bmd = this.$bitmapData;
        if (bmd) {
            this.$sourceWidth = bmd.width;
            this.$sourceHeight = bmd.height;
        }
    };
    var htmlTextParser = new egret.HtmlTextParser();
    egret.TextField.prototype.setHtmlText = function (value) {
        if (value == undefined) {
            value = "";
        }
        else if (typeof value == "number") {
            value = value + "";
        }
        this.textFlow = value ? htmlTextParser.parser(value) : jy.Temp.EmptyArray;
    };
    egret.Graphics.prototype.drawRectangle = function (rect) {
        this.drawRect(rect.x, rect.y, rect.width, rect.height);
    };
    // DisplayObject重写了EventDispatcher的removeEventListener
    var dpt = egret.DisplayObject.prototype;
    dpt.removeListeners = function (type, useCapture) {
        var list;
        if ("enterFrame" == type) {
            list = egret.DisplayObject.$enterFrameCallBackList;
        }
        else if ("render" == type) {
            list = egret.DisplayObject.$renderCallBackList;
        }
        if (list) {
            list.remove(this);
        }
        egret.EventDispatcher.prototype.removeListeners.call(this, type, useCapture);
    };
    dpt.removeAllListeners = function () {
        var values = this.$EventDispatcher;
        values[1 /**eventsMap */] = {};
        values[2 /**captureEventsMap */] = {};
        egret.DisplayObject.$enterFrameCallBackList.remove(this);
        egret.DisplayObject.$renderCallBackList.remove(this);
    };
    Object.defineProperties(dpt, jy.makeDefDescriptors({
        bright: {
            set: function (value) {
                value = Math.clamp(value, -1, 1);
                if (this["_bright" /* PrivateKey */] == value) {
                    return;
                }
                var filters = this.filters;
                var brightMatrix = this["_briFilter" /* PrivateFilter */];
                if (value == 0) {
                    if (filters) {
                        filters.remove(brightMatrix);
                        if (!filters.length) {
                            filters = null;
                        }
                    }
                }
                else {
                    if (!brightMatrix) {
                        this["_briFilter" /* PrivateFilter */] = brightMatrix = new egret.ColorMatrixFilter();
                    }
                    this["_bright" /* PrivateKey */] = value;
                    brightMatrix.matrix = [1, 0, 0, 0, 255 * value, 0, 1, 0, 0, 255 * value, 0, 0, 1, 0, 255 * value, 0, 0, 0, 1, 0];
                    if (!filters) {
                        filters = [brightMatrix];
                    }
                    else {
                        filters.pushOnce(brightMatrix);
                    }
                }
                this.filters = filters;
            },
            get: function () {
                return this["_bright" /* PrivateKey */] || 0;
            }
        },
        sRectX: setScrollRectPos("x"),
        sRectY: setScrollRectPos("y"),
    }));
    function setScrollRectPos(key) {
        return {
            set: function (value) {
                var scroll = this.scrollRect;
                if (scroll) {
                    scroll[key] = value;
                    this.scrollRect = scroll;
                }
            },
            get: function () {
                var scroll = this.scrollRect;
                return scroll && scroll[key] || 0;
            }
        };
    }
})(egret || (egret = {}));
var jy;
(function (jy) {
    /**
     * 延迟执行
     * @author 3tion
     */
    var CallLater = /** @class */ (function () {
        function CallLater() {
            this._callLaters = [];
            this._temp = [];
        }
        CallLater.prototype.tick = function (now) {
            var i = 0, j = 0, k = 0, callLaters = this._callLaters, temp = this._temp;
            // 检查callLater，执行时间够的calllater调用
            for (var len = callLaters.length; i < len; i++) {
                var cb = callLaters[i];
                if (now > cb.time) {
                    temp[j++] = cb;
                }
                else {
                    callLaters[k++] = cb;
                }
            }
            callLaters.length = k;
            for (i = 0; i < j; i++) {
                temp[i].execute();
            }
        };
        /**
         * 增加延迟执行的函数
         *
         * @param {Function} callback (description)
         * @param {number} now (description)
         * @param {number} [time] (description)
         * @param {*} [thisObj] (description)
         * @param args (description)
         */
        CallLater.prototype.callLater = function (callback, now, time, thisObj) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            var cInfo = jy.CallbackInfo.addToList.apply(jy.CallbackInfo, [this._callLaters, callback, thisObj].concat(args));
            cInfo.time = now + (time || 0);
        };
        /**
         * 清理延迟执行的函数
         *
         * @param {Function} callback (description)
         * @param {*} [thisObj] (description)
         */
        CallLater.prototype.clearCallLater = function (callback, thisObj) {
            var callLaters = this._callLaters;
            for (var i = callLaters.length - 1; i >= 0; --i) {
                var cInfo = callLaters[i];
                if (cInfo.checkHandle(callback, thisObj)) {
                    callLaters.splice(i, 1);
                    return cInfo.recycle();
                }
            }
        };
        CallLater.prototype.callLater2 = function (callback, now, time) {
            if (time === void 0) { time = 0; }
            this._callLaters.pushOnce(callback);
            callback.time = now + (time || 0);
        };
        CallLater.prototype.clearCallLater2 = function (callback) {
            this._callLaters.remove(callback);
            return callback.recycle();
        };
        return CallLater;
    }());
    jy.CallLater = CallLater;
    __reflect(CallLater.prototype, "jy.CallLater");
})(jy || (jy = {}));
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
var jy;
(function (jy) {
    var TweenManager = /** @class */ (function () {
        function TweenManager() {
            this._tweens = [];
            /**
             * 注册过的插件列表
             * Key      {string}            属性
             * Value    {ITweenPlugin[]}    插件列表
             *
             * @type {{ [index: string]: ITweenPlugin[] }}
             */
            this._plugins = {};
        }
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
        TweenManager.prototype.get = function (target, props, pluginData, override) {
            if (override) {
                this.removeTweens(target);
            }
            return new jy.Tween(target, props, pluginData, this);
        };
        /**
         * 移除指定对象的所有tween
         * Removes all existing tweens for a target. This is called automatically by new tweens if the `override`
         * property is `true`.
         * @method removeTweens
         * @param {Object} target The target object to remove existing tweens from.
         * @static
         */
        TweenManager.prototype.removeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = this._tweens;
            var j = 0;
            for (var i = 0, len = tweens.length; i < len; i++) {
                var tween = tweens[i];
                if (tween.target == target) {
                    tween.paused = true;
                    tween.onRecycle();
                }
                else {
                    tweens[j++] = tween;
                }
            }
            tweens.length = j;
            target.tween_count = 0;
        };
        /**
         * 移除单个tween
         *
         * @param {Tween} twn
         * @returns
         *
         * @memberOf TweenManager
         */
        TweenManager.prototype.removeTween = function (twn) {
            if (!twn) {
                return;
            }
            var tweens = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if (tween == twn) {
                    tween.paused = true;
                    tweens.splice(i, 1);
                    tween.onRecycle();
                    break;
                }
            }
        };
        /**
         * 暂停某个对象的全部Tween
         *
         * @static
         * @param {*} target 指定对象
         */
        TweenManager.prototype.pauseTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i].target == target) {
                    tweens[i].paused = true;
                }
            }
        };
        /**
         * 恢复某个对象的全部Tween
         *
         * @static
         * @param {*} target 指定对象
         */
        TweenManager.prototype.resumeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i].target == target) {
                    tweens[i].paused = false;
                }
            }
        };
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
        TweenManager.prototype.tick = function (delta, paused) {
            if (!this._tweens.length) {
                return;
            }
            var tweens = this._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
        };
        /**
         * 将tween注册/注销到管理器中，
         *
         * @param {Tween} tween
         * @param {boolean} [value] (description)
         * @returns {void}
         * @private 此方法只允许tween调用
         */
        TweenManager.prototype._register = function (tween, value) {
            var target = tween.target;
            var tweens = this._tweens;
            if (value && !tween._registered) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        tween.onRecycle();
                        return;
                    }
                }
            }
        };
        /**
         * Stop and remove all existing tweens.
         * 终止并移除所有的tween
         * @method removeAllTweens
         * @static
         * @since 0.4.1
         */
        TweenManager.prototype.removeAllTweens = function () {
            var tweens = this._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                tween.paused = true;
                tween.onRecycle();
                tween.target.tweenjs_count = 0;
            }
            tweens.length = 0;
        };
        /**
         * Indicates whether there are any active tweens (and how many) on the target object (if specified) or in general.
         * @method hasActiveTweens
         * @param {Object} [target] The target to check for active tweens. If not specified, the return value will indicate
         * if there are any active tweens on any target.
         * @return {Boolean} If there are active tweens.
         * @static
         */
        TweenManager.prototype.hasActiveTweens = function (target) {
            if (target) {
                return target.tweenjs_count != null && !!target.tweenjs_count;
            }
            return this._tweens && !!this._tweens.length;
        };
        /**
         * Installs a plugin, which can modify how certain properties are handled when tweened. See the {{#crossLink "CSSPlugin"}}{{/crossLink}}
         * for an example of how to write TweenJS plugins.
         * @method installPlugin
         * @static
         * @param {Object} plugin The plugin class to install
         * @param {Array} properties An array of properties that the plugin will handle.
         */
        TweenManager.prototype.installPlugin = function (plugin, properties) {
            var priority = plugin.priority;
            if (priority == null) {
                plugin.priority = priority = 0;
            }
            for (var i = 0, l = properties.length, p = this._plugins; i < l; i++) {
                var n = properties[i];
                if (!p[n]) {
                    p[n] = [plugin];
                }
                else {
                    var arr = p[n];
                    for (var j = 0, jl = arr.length; j < jl; j++) {
                        if (priority < arr[j].priority) {
                            break;
                        }
                    }
                    p[n].splice(j, 0, plugin);
                }
            }
        };
        return TweenManager;
    }());
    jy.TweenManager = TweenManager;
    __reflect(TweenManager.prototype, "jy.TweenManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    try {
        var supportWebp = window.supportWebp == false ? false : document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    catch (err) { }
    var _webp = supportWebp ? ".webp" /* WEBP */ : "";
    var _isNative = egret.Capabilities.engineVersion != "Unknown";
    /**
     *  当前这一帧的时间
     */
    var now = 0;
    /**
     * 按照帧，应该走的时间
     * 每帧根据帧率加固定时间
     * 用于处理逐帧同步用
     */
    var frameNow = 0;
    var _callLater = new jy.CallLater();
    var tweenManager = new jy.TweenManager();
    var _nextTicks = [];
    var _intervals = [];
    /**
     * 注入白鹭的全局Ticker
     */
    function initTick() {
        //@ts-ignore
        var ticker = egret.ticker;
        var update = ticker.render;
        var delta = 0 | 1000 / ticker.$frameRate;
        var temp = [];
        ticker.render = function (triggerByFrame, costTicker) {
            var _now = jy.DateUtils.serverTime;
            var dis = _now - now;
            now = _now;
            if (dis > 2000) {
                //有2秒钟大概就是进入过休眠了
                jy.dispatch(-190 /* Awake */);
                frameNow = _now;
            }
            else {
                frameNow += delta;
            }
            if (true) {
                $();
            }
            else if (false) {
                try {
                    $();
                }
                catch (e) {
                    jy.ThrowError("ticker.render", e);
                }
            }
            return;
            function $() {
                //执行顺序  nextTick  callLater TimerUtil  tween  最后是白鹭的更新
                var len = _intervals.length;
                for (var i = 0; i < len; i++) {
                    var cb = _intervals[i];
                    cb.execute(false);
                }
                len = _nextTicks.length;
                var tmp = temp;
                for (var i = 0; i < len; i++) {
                    tmp[i] = _nextTicks[i];
                }
                _nextTicks.length = 0;
                //先复制再操作是为了防止回调过程中，有新增的nextTick
                for (var i = 0; i < len; i++) {
                    tmp[i].execute();
                }
                _callLater.tick(_now);
                jy.TimerUtil.tick(_now);
                tweenManager.tick(dis);
                update.call(ticker, triggerByFrame, costTicker);
            }
        };
    }
    function nextTick(callback, thisObj) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        nextTick2(jy.CallbackInfo.get.apply(jy.CallbackInfo, [callback, thisObj].concat(args)));
    }
    function nextTick2(callback) {
        _nextTicks.push(callback);
    }
    /**
     * 动画的全局对象
     * @author 3tion
     *
     */
    jy.Global = {
        initTick: initTick,
        nextTick: nextTick,
        nextTick2: nextTick2,
        callLater: function (callback, time, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            return _callLater.callLater.apply(_callLater, [callback, now, time, thisObj].concat(args));
        },
        clearCallLater: function (callback, thisObj) {
            return _callLater.clearCallLater(callback, thisObj);
        },
        callLater2: function (callback, time) {
            return _callLater.callLater2(callback, now, time);
        },
        clearCallLater2: function (callback) {
            return _callLater.clearCallLater2(callback);
        },
        getTween: function (target, props, pluginData, override) {
            return tweenManager.get(target, props, pluginData, override);
        },
        removeTween: function (tween) {
            return tweenManager.removeTween(tween);
        },
        removeTweens: function (target) {
            return tweenManager.removeTweens(target);
        },
        get isNative() {
            return _isNative;
        },
        tweenManager: tweenManager,
        get now() {
            return now;
        },
        get frameNow() {
            return frameNow;
        },
        get webp() {
            return _webp;
        },
        addInterval: function (callback) {
            _intervals.pushOnce(callback);
        },
        removeInterval: function (callback) {
            _intervals.remove(callback);
        },
    };
})(jy || (jy = {}));
if (true) {
    var $gm = $gm || {};
    $gm.__getNSFilter = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var nsFilter = {};
        if (args.length) {
            var filter = args[0];
            if (filter != undefined) {
                var tof = typeof filter;
                if (tof === "function") {
                    nsFilter.filter = filter;
                    nsFilter.filterParams = args.slice(1);
                }
                else {
                    if (tof === "boolean") {
                        nsFilter.isWhite = filter;
                        nsFilter.cmds = args.slice(1);
                    }
                    else if (tof === "number") {
                        nsFilter.cmds = args;
                    }
                }
            }
        }
        return nsFilter;
    };
    $gm.print = function () {
        $gm.printSend();
        $gm.printReceive();
    };
    $gm.printSend = function (filter) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (arguments.length == 0 && $gm.printSendFilter) {
            $gm.printSendFilter = undefined;
        }
        else {
            $gm.printSendFilter = $gm.__getNSFilter.apply($gm, [filter].concat(args));
        }
    };
    $gm.printReceive = function (filter) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (arguments.length == 0 && $gm.printReceiveFilter) {
            $gm.printReceiveFilter = undefined;
        }
        else {
            $gm.printReceiveFilter = $gm.__getNSFilter.apply($gm, [filter].concat(args));
        }
    };
    $gm.showNSLog = function (filter) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var nsFilter = $gm.__getNSFilter.apply($gm, [filter].concat(args));
        var output = [];
        var msg = "";
        $gm.nsLogs.forEach(function (log) {
            if ($gm.__nsLogCheck(log, nsFilter)) {
                output.push({ type: log.type, time: log.time, cmd: log.cmd, data: log.data, json: JSON.stringify(log.data) });
                msg += log.time + "\t" + log.type + "\t" + log.cmd + "\t" + JSON.stringify(log.data) + "\n";
            }
        });
        console.table(output);
        jy.doCopy(msg) && console.log("%c 已将网络数据复制到剪贴板", "color:red;font-size:50px;");
        return output;
    };
    $gm.__nsLogCheck = function (log, nsFilter) {
        var cmd = log.cmd;
        if (nsFilter) {
            var filter = nsFilter.filter, cmds = nsFilter.cmds, filterParams = nsFilter.filterParams, isWhite = nsFilter.isWhite;
            if (cmds) {
                var idx = cmds.indexOf(cmd);
                if (isWhite && ~idx || !isWhite && !~idx) {
                    return true;
                }
            }
            else if (filter) {
                return filter.apply(void 0, [log].concat(filterParams));
            }
            else {
                return true;
            }
        }
    };
    $gm.maxNSLogCount = 1000;
    $gm.nsLogs = [];
    $gm.route = function (cmd, data) {
        jy.NetService.get().route(cmd, data);
    };
    $gm.batchRoute = function (logs) {
        //过滤send
        logs = logs.filter(function (log) {
            return log.type != "send";
        });
        if (logs.length) {
            var time_1 = logs[0].time | 0;
            logs.forEach(function (log) {
                setTimeout($gm.route, (log.time | 0) - time_1, log.cmd, log.data);
            });
        }
    };
}
var jy;
(function (jy) {
    jy.NSBytesLen = {
        /**NSType.Null */ 0: 0,
        /**NSType.Boolean */ 1: 1,
        /**NSType.Double */ 5: 8,
        /**NSType.Int32 */ 6: 4,
        /**NSType.Uint32 */ 7: 4,
        /**NSType.Int64 */ 8: 8
    };
    /**
     * 用于存储头部的临时变量
     */
    jy.nsHeader = { cmd: 0, len: 0 };
    function send2(cmd, data, msgType, limit) {
        if (jy.RequestLimit.check(cmd, limit)) {
            this._send(cmd, data, msgType);
        }
        else {
            jy.dispatch(-189 /* NetServiceSendLimit */, cmd);
        }
    }
    /**
     * 通信服务
     * 收发的协议结构：
     * 2字节协议号 2字节包长度(n) n字节包
     * @author 3tion
     *
     */
    var NetService = /** @class */ (function () {
        function NetService() {
            var _this = this;
            this.netChange = function () {
                if (navigator.onLine) {
                    jy.dispatch(-192 /* Online */);
                    _this.showReconnect();
                }
                else {
                    jy.dispatch(-191 /* Offline */);
                }
            };
            /**
             * 基础连接时间
             *
             *
             * @memberOf NetService
             */
            this.baseConTime = 10000;
            /**
             * 最大连接时间
             *
             *
             * @memberOf NetService
             */
            this.maxConTime = 60000 /* ONE_MINUTE */;
            /**
             * 重连次数
             *
             * @private
             * @type {number}
             * @memberOf NetService
             */
            this._reconCount = 0;
            /**
             * 下次自动拉取请求的时间戳
             */
            this._nextAutoTime = 0;
            this._router = new jy.NetRouter();
            this._pcmdList = [];
            this._tmpList = [];
            this._readBuffer = new jy.ByteArray();
            this._sendBuffer = new jy.ByteArray();
            this._tempBytes = new jy.ByteArray();
            this._receiveMSG = {};
            if (true) {
                this.$writeNSLog = function (time, type, cmd, data) {
                    data = data == undefined ? undefined : JSON.parse(JSON.stringify(data));
                    var log = doFreeze({ time: time, type: type, cmd: cmd, data: data });
                    var nsLogs = $gm.nsLogs;
                    //清理多余的日志
                    while (nsLogs.length > $gm.maxNSLogCount) {
                        nsLogs.shift();
                    }
                    nsLogs.push(log);
                    var nsFilter = type == "send" ? $gm.printSendFilter : $gm.printReceiveFilter;
                    if ($gm.__nsLogCheck(log, nsFilter)) {
                        console.log(type, time, cmd, data);
                    }
                    function doFreeze(obj) {
                        if (typeof obj == "object" && obj) {
                            var pool = [obj];
                            while (pool.length) {
                                var tmp = pool.pop();
                                Object.freeze(tmp);
                                for (var key in tmp) {
                                    var x = tmp[key];
                                    if (typeof x == "object" && x) {
                                        pool.push(x);
                                    }
                                }
                            }
                        }
                        return obj;
                    }
                };
            }
            if (window.addEventListener) { //防止native报错
                addEventListener("online", this.netChange);
                addEventListener("offline", this.netChange);
            }
            jy.on(-190 /* Awake */, this.onawake, this);
        }
        NetService.prototype.setLimitEventEmitable = function (emit) {
            if (emit) {
                this.send = send2;
            }
            else {
                delete this.send;
            }
        };
        NetService.get = function () {
            return this._ins;
        };
        NetService.prototype.setEndian = function (endian) {
            this._sendBuffer.$endian = this._readBuffer.$endian = this._tempBytes.$endian = endian;
        };
        NetService.prototype.showReconnect = function () {
            this._reconCount += 1;
            var time = this._reconCount * this.baseConTime;
            var maxConTime = this.maxConTime;
            if (time > maxConTime) {
                time = maxConTime;
            }
            this._nextAutoTime = jy.Global.now + time;
            jy.dispatch(-194 /* ShowReconnect */, this._reconCount);
        };
        NetService.prototype.onawake = function () {
            this._reconCount = 0;
            this._nextAutoTime = jy.Global.now + this._autoTimeDelay;
        };
        /**
         * 基础类型消息
         */
        NetService.prototype.regReceiveMSGRef = function (cmd, ref) {
            this._receiveMSG[cmd] = ref;
        };
        /**
         * 注册处理器
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         * @param {number} [priority=0] 处理优先级
         */
        NetService.prototype.register = function (cmd, handler, priotity) {
            if (priotity === void 0) { priotity = 0; }
            return this._register(cmd, handler, priotity, false);
        };
        /**
         * 注册单次执行的处理器
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         * @param {number} [priority=0] 处理优先级
         */
        NetService.prototype.regOnce = function (cmd, handler, priotity) {
            if (priotity === void 0) { priotity = 0; }
            return this._register(cmd, handler, priotity, true);
        };
        /**
         * 移除协议号和处理器的监听
         *
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         */
        NetService.prototype.remove = function (cmd, handler) {
            this._router.remove(cmd, handler);
        };
        NetService.prototype._register = function (cmd, handler, priotity, once) {
            if (cmd > 32767 || cmd < -32768) {
                if (true) {
                    jy.Log("\u534F\u8BAE\u53F7\u7684\u8303\u56F4\u5FC5\u987B\u662F-32768~32767\u4E4B\u95F4\uFF0C\u5F53\u524Dcmd:" + cmd);
                }
                return false;
            }
            this._router.register(cmd, handler, priotity, once);
            return true;
        };
        /**
         * 即时发送指令<br/>
         * 用于处理角色主动操作的请求，如点击合成道具，使用物品等
         * @param {number} cmd 协议号
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         * @param {number} [limit] 客户端发送时间限制，默认500毫秒
         */
        NetService.prototype.send = function (cmd, data, msgType, limit) {
            if (jy.RequestLimit.check(cmd, limit)) {
                this._send(cmd, data, msgType);
            }
        };
        /**
         * 断开连接
         */
        NetService.prototype.disconnect = function () {
            // TODO
        };
        /**
         * 消极发送指令
         * 如果使用通协议的指令，有堆积的指令，先合并，新的替换旧的
         * __`请勿将一些用户操作使用此指令发送`__
         * 处理一些实时性要求不高的指令，这些指令先缓存堆积，等到用户主动发指令的时候，一起发送
         * @param {number} cmd 协议号
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         */
        NetService.prototype.sendPassive = function (cmd, data, msgType) {
            //合并同协议的指令
            var pcmdList = this._pcmdList;
            var len = pcmdList.length;
            for (var _i = 0, pcmdList_1 = pcmdList; _i < pcmdList_1.length; _i++) {
                var temp = pcmdList_1[_i];
                if (temp.cmd == cmd) {
                    temp.data = data;
                    return;
                }
            }
            //没有同协议的指令，新增数据
            var pdata = jy.recyclable(jy.NetSendData);
            pdata.cmd = cmd;
            pdata.data = data;
            pdata.msgType = msgType;
            //将数据缓存在pcmdList中，等到下次send的时候发送
            this._pcmdList[len] = pdata;
        };
        /**
         * 向缓冲数组中写入数据
         */
        NetService.prototype.writeToBuffer = function (bytes, data) {
            var cmd = data.cmd;
            var dat = data.data;
            var type = data.msgType;
            bytes.writeShort(cmd);
            if (dat == undefined) {
                this.writeBytesLength(bytes, 0);
                if (true) {
                    var outdata = undefined;
                }
            }
            else {
                if (type in jy.NSBytesLen) {
                    this.writeBytesLength(bytes, jy.NSBytesLen[type]);
                }
                if (true) {
                    outdata = dat;
                }
                switch (type) {
                    case 0 /* Null */:
                        if (true) {
                            outdata = undefined;
                        }
                        break;
                    case 1 /* Boolean */:
                        bytes.writeBoolean(dat);
                        break;
                    case 5 /* Double */:
                        bytes.writeDouble(dat);
                        break;
                    case 6 /* Int32 */:
                        bytes.writeInt(dat);
                        break;
                    case 7 /* Uint32 */:
                        bytes.writeUnsignedInt(dat);
                        break;
                    case 8 /* Int64 */:
                        bytes.writeInt64(dat);
                        break;
                    case 2 /* String */:
                        bytes.writeUTF(dat);
                        break;
                    case 4 /* Bytes */:
                        var b = dat;
                        bytes.writeUnsignedShort(b.length);
                        bytes.writeBytes(b);
                        if (true) {
                            outdata = Uint8Array.from(b.bytes);
                        }
                        break;
                    default:
                        var tempBytes = this._tempBytes;
                        tempBytes.clear();
                        if (true) {
                            outdata = {};
                            jy.PBUtils.writeTo(dat, data.msgType, tempBytes, outdata);
                        }
                        else {
                            jy.PBUtils.writeTo(dat, data.msgType, tempBytes);
                        }
                        this.writeBytesLength(bytes, tempBytes.length);
                        bytes.writeBytes(tempBytes);
                        break;
                }
            }
            if (true) {
                this.$writeNSLog(jy.Global.now, "send", cmd, outdata);
            }
        };
        /**
         * @private
         * @param bytes
         * @param out
         */
        NetService.prototype.decodeBytes = function (bytes) {
            var receiveMSG = this._receiveMSG;
            var tmpList = this._tmpList;
            var idx = 0;
            var header = jy.nsHeader;
            var decodeHeader = this.decodeHeader;
            while (true) {
                if (!decodeHeader(bytes, header)) {
                    //回滚
                    break;
                }
                var cmd = header.cmd, len = header.len;
                //尝试读取结束后，应该在的索引
                var endPos = bytes.position + len;
                var type = receiveMSG[cmd];
                if (type !== undefined) {
                    var flag = true;
                    var data = undefined;
                    if (len > 0 && type in jy.NSBytesLen) {
                        var blen = jy.NSBytesLen[type];
                        if (true && blen != len) {
                            jy.Log("\u89E3\u6790\u6307\u4EE4\u65F6\uFF0C\u7C7B\u578B[" + type + "]\u7684\u6307\u4EE4\u957F\u5EA6[" + len + "]\u548C\u9884\u8BBE\u7684\u957F\u5EA6[" + blen + "]\u4E0D\u5339\u914D");
                        }
                        if (len < blen) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        switch (type) {
                            case 0 /* Null */:
                                break;
                            case 1 /* Boolean */:
                                data = bytes.readBoolean();
                                break;
                            case 5 /* Double */:
                                data = bytes.readDouble();
                                break;
                            case 6 /* Int32 */:
                                data = bytes.readInt();
                                break;
                            case 7 /* Uint32 */:
                                data = bytes.readUnsignedInt();
                                break;
                            case 8 /* Int64 */:
                                data = bytes.readInt64();
                                break;
                            case 2 /* String */:
                                data = bytes.readUTFBytes(len);
                                break;
                            case 4 /* Bytes */:
                                data = bytes.readByteArray(len);
                                break;
                            default:
                                data = jy.PBUtils.readFrom(type, bytes, len);
                                break;
                        }
                    }
                    if (flag) {
                        //容错用，不管数据解析成功或者失败，将索引移至结束索引
                        var nData = jy.recyclable(jy.NetData);
                        nData.cmd = cmd;
                        nData.data = data;
                        tmpList[idx++] = nData;
                    }
                }
                else if (true) {
                    jy.Log("\u901A\u4FE1\u6D88\u606F\u89E3\u6790\u65F6cmd[" + cmd + "]\uFF0C\u51FA\u73B0\u672A\u6CE8\u518C\u7684\u7C7B\u578B");
                }
                bytes.position = endPos;
            }
            //调试时,显示接收的数据
            if (true) {
                var now = jy.Global.now;
                //分发数据
                for (var i = 0; i < idx; i++) {
                    var ndata = tmpList[i];
                    this.$writeNSLog(now, "receive", ndata.cmd, ndata.data);
                }
            }
            var router = this._router;
            //分发数据
            for (var i = 0; i < idx; i++) {
                var nData = tmpList[i];
                router.dispatch(nData);
            }
        };
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
        NetService.prototype.decodeHeader = function (bytes, header) {
            if (bytes.readAvailable < 4) {
                return false;
            }
            //先读取2字节协议号
            header.cmd = bytes.readShort();
            //增加2字节的数据长度读取(这2字节是用于增加容错的，方便即便没有读到type，也能跳过指定长度的数据，让下一个指令能正常处理)
            var len = bytes.readUnsignedShort();
            if (bytes.readAvailable < len) {
                // 回滚
                bytes.position -= 4;
                return false;
            }
            header.len = len;
            return true;
        };
        /**
         * 存储数据长度
         *
         * @protected
         * @param {ByteArray} bytes
         * @param {number} val
         * @memberof NetService
         */
        NetService.prototype.writeBytesLength = function (bytes, val) {
            bytes.writeUnsignedShort(val);
        };
        /**
         *
         * 模拟服务端
         * @param {number} cmd
         * @param {*} [data]
         */
        NetService.prototype.route = function (cmd, data) {
            var nData = jy.recyclable(jy.NetData);
            nData.cmd = cmd;
            nData.data = data;
            this._router.dispatch(nData);
        };
        return NetService;
    }());
    jy.NetService = NetService;
    __reflect(NetService.prototype, "jy.NetService");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * GameLayer
     * 用于后期扩展
     */
    var BaseLayer = /** @class */ (function (_super) {
        __extends(BaseLayer, _super);
        function BaseLayer(id) {
            var _this = _super.call(this) || this;
            _this.id = +id;
            return _this;
        }
        return BaseLayer;
    }(egret.Sprite));
    jy.BaseLayer = BaseLayer;
    __reflect(BaseLayer.prototype, "jy.BaseLayer");
    /**
     * UI使用的层级，宽度和高度设定为和stage一致
     *
     * @export
     * @class UILayer
     * @extends {GameLayer}
     */
    var UILayer = /** @class */ (function (_super) {
        __extends(UILayer, _super);
        function UILayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(UILayer.prototype, "width", {
            get: function () {
                return egret.sys.$TempStage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UILayer.prototype, "height", {
            get: function () {
                return egret.sys.$TempStage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        return UILayer;
    }(BaseLayer));
    jy.UILayer = UILayer;
    __reflect(UILayer.prototype, "jy.UILayer");
    /**
     * 需要对子对象排序的层
     */
    var SortedLayer = /** @class */ (function (_super) {
        __extends(SortedLayer, _super);
        function SortedLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SortedLayer.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            if ("depth" in child) {
                jy.GameEngine.invalidateSort();
                return _super.prototype.$doAddChild.call(this, child, index, notifyListeners);
            }
            else {
                throw new Error("Only IDepth can be added to this LayerID(" + this.id + ")");
            }
        };
        /**
         * 进行排序
         */
        SortedLayer.prototype.sort = function () {
            //对子集排序
            this.$children.doSort("depth");
        };
        return SortedLayer;
    }(BaseLayer));
    jy.SortedLayer = SortedLayer;
    __reflect(SortedLayer.prototype, "jy.SortedLayer");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * Mediator和Proxy的基类
     * @author 3tion
     *
     */
    var FHost = /** @class */ (function () {
        function FHost(name) {
            this._name = name;
            this.checkInject();
            if (true) {
                var classes = $gm.$;
                if (!classes) {
                    $gm.$ = classes = {};
                }
                classes[this["constructor"]["name"]] = this;
            }
        }
        Object.defineProperty(FHost.prototype, "name", {
            /**
             * 唯一标识
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检查依赖注入的数据
         *
         * @protected
         *
         * @memberOf FHost
         */
        FHost.prototype.checkInject = function () {
            //此注入是对原型进行的注入，无法直接删除，也不要直接做清理
            var idp = this._injectProxys;
            if (idp) {
                var proxyName = void 0;
                //检查Proxy
                for (var key in idp) {
                    var ref = idp[key].ref;
                    if (typeof ref === "function") {
                        proxyName = jy.Facade.getNameOfInline(ref);
                    }
                    else {
                        proxyName = ref;
                    }
                    var proxy = jy.proxyCall(proxyName);
                    this[key] = proxy;
                    proxy._$isDep = true;
                    this.addDepend(proxy);
                }
            }
        };
        FHost.prototype.addReadyExecute = function (handle, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var _asyncHelper = this._asyncHelper;
            if (!_asyncHelper) {
                this._asyncHelper = _asyncHelper = new jy.AsyncHelper();
                _asyncHelper.isReady = this.isReady;
            }
            _asyncHelper.addReadyExecute.apply(_asyncHelper, [handle, thisObj].concat(args));
        };
        Object.defineProperty(FHost.prototype, "isReady", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        FHost.prototype.startSync = function () {
        };
        /**
         * 添加依赖项
         */
        FHost.prototype.addDepend = function (async) {
            if (!this._dependerHelper) {
                this._dependerHelper = new jy.DependerHelper(this, this.dependerReadyCheck);
            }
            this._dependerHelper.addDepend(async);
        };
        /**
         * 依赖项，加载完成后的检查
         */
        FHost.prototype.dependerReadyCheck = function () {
        };
        /**
         * 模块在Facade注册时执行
         */
        FHost.prototype.onRegister = function () {
        };
        /**
         * 模块从Facade注销时
         */
        FHost.prototype.onRemove = function () {
        };
        /**
         * 全部加载好以后要处理的事情<br/>
         * 包括依赖项加载完毕
         */
        FHost.prototype.afterAllReady = function () {
            // to be override
        };
        return FHost;
    }());
    jy.FHost = FHost;
    __reflect(FHost.prototype, "jy.FHost", ["jy.IDepender", "jy.IAsync"]);
    /**
     *
     * 附加依赖的Proxy
     * @export
     * @param {({ new (): IAsync } | string)} ref 如果注册的是Class，必须是Inline方式注册的Proxy
     * @returns
     */
    function d_dependProxy(ref, isPri) {
        var pKey = "_injectProxys";
        return function (target, key) {
            var _injectProxys;
            if (target.hasOwnProperty(pKey)) {
                _injectProxys = target[pKey];
            }
            else {
                //未赋值前，先取值，可取到父级数据，避免使用  Object.getPrototypeOf(target)，ES5没此方法
                var inherit = target[pKey];
                target[pKey] = _injectProxys = {};
                if (inherit) { //继承父级可继承的关注列表
                    for (var k in inherit) {
                        var bin = inherit[k];
                        if (!bin.isPri) {
                            _injectProxys[k] = bin;
                        }
                    }
                }
            }
            _injectProxys[key] = { ref: ref, isPri: isPri };
        };
    }
    jy.d_dependProxy = d_dependProxy;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 基础创建器
     * @author 3tion
     *
     */
    var BaseCreator = /** @class */ (function () {
        function BaseCreator() {
        }
        Object.defineProperty(BaseCreator.prototype, "suiData", {
            get: function () {
                return this._suiData;
            },
            enumerable: true,
            configurable: true
        });
        BaseCreator.prototype.bindSuiData = function (suiData) {
            this._suiData = suiData;
        };
        BaseCreator.prototype.parseData = function (data, suiData) {
            if (!this._parsed) {
                this._parsed = true;
                this.bindSuiData(suiData);
                if (data) {
                    this.setBaseData(data[1]);
                    this.parseSelfData(data[2]);
                }
            }
        };
        /**
         * 处理尺寸
         *
         * @param {SizeData} data
         *
         * @memberOf BaseCreator
         */
        BaseCreator.prototype.parseSize = function (data) {
            if (data) {
                this.size = new egret.Rectangle(data[0], data[1], data[2], data[3]);
            }
        };
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
        BaseCreator.prototype.createElement = function (data) {
            return jy.singleton(jy.SuiResManager).getElement(this._suiData, data);
        };
        BaseCreator.prototype.setBaseData = function (data) {
            this._baseData = data;
        };
        BaseCreator.prototype.parseSelfData = function (data) {
        };
        /**
         * 获取实例
         */
        BaseCreator.prototype.get = function () {
            var t = this._createT();
            t.suiRawRect = this.size;
            if (t instanceof jy.Component) {
                t.init(this);
            }
            if (this._baseData) {
                jy.SuiResManager.initBaseData(t, this._baseData);
            }
            return t;
        };
        return BaseCreator;
    }());
    jy.BaseCreator = BaseCreator;
    __reflect(BaseCreator.prototype, "jy.BaseCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    function addEnable(ref) {
        var pt = ref.prototype;
        pt.$setEnabled = $setEnabled;
        pt.useDisFilter = true;
        Object.defineProperty(pt, "enabled", jy.getDescriptor({
            set: function (value) {
                if (this._enabled != value) {
                    this.$setEnabled(value);
                }
            },
            get: function () {
                return this._enabled;
            }
        }));
    }
    jy.addEnable = addEnable;
    function $setEnabled(value) {
        this._enabled = value;
        this.touchEnabled = value;
        this.touchChildren = value;
        if (this.useDisFilter) {
            this.filters = value ? null : jy.FilterUtils.gray;
        }
    }
    /**
     * 用于处理接收flash软件制作的UI，导出的数据，仿照eui
     * 不过简化eui的一些layout的支持
     * 按目前情况看，不太会制作复杂排版的ui，父容器不做统一的测量和重新布局
     * 都会基于固定大小(传奇世界H5，采用480×800，viewport设置为不可缩放，宽度基于设备的)
     * @author 3tion
     *
     */
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component() {
            var _this = _super.call(this) || this;
            /**
             * 是否使用disable滤镜
             * 现在默认为 true
             * @protected
             * @type {boolean}
             * @memberOf Component
             */
            _this.useDisFilter = true;
            return _this;
        }
        Object.defineProperty(Component.prototype, "guid", {
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
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.init = function (c) {
            this._creator = c;
            this.enabled = true;
            this.stageEvent();
            this.bindChildren();
        };
        Component.prototype.stageEvent = function (remove) {
            var handler = remove ? this.off : this.on;
            handler.call(this, "addedToStage" /* ADDED_TO_STAGE */, this.onAwake, this);
            handler.call(this, "removedFromStage" /* REMOVED_FROM_STAGE */, this.onSleep, this);
        };
        Component.prototype.onAwake = function () {
        };
        Component.prototype.onSleep = function () {
        };
        Component.prototype.dispose = function () {
            this.removeAllListeners();
        };
        Component.prototype.bindChildren = function () {
        };
        /**
         * 绘制一个代理图形
         */
        Component.prototype.drawDele = function () {
            if (this._creator) {
                var g = this.graphics;
                g.lineStyle(2, 0x00ff00);
                g.beginFill(0xff, 0.3);
                g.drawRectangle(this._creator.size);
            }
        };
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
        Component.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
        };
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
        Component.prototype.getPreferredBounds = function (bounds) {
        };
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
        Component.prototype.setLayoutBoundsPosition = function (x, y) {
        };
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
        Component.prototype.getLayoutBounds = function (bounds) {
        };
        Object.defineProperty(Component.prototype, "view", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        return Component;
    }(egret.Sprite));
    jy.Component = Component;
    __reflect(Component.prototype, "jy.Component");
    ;
    addEnable(Component);
})(jy || (jy = {}));
var jy;
(function (jy) {
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
    function expandInstance(instance, clazzB) {
        var keys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keys[_i - 2] = arguments[_i];
        }
        var bpt = clazzB.prototype;
        for (var _a = 0, _b = Object.getOwnPropertyNames(bpt); _a < _b.length; _a++) {
            var name_1 = _b[_a];
            if (!keys || ~keys.indexOf(name_1)) {
                var define = bpt.getPropertyDescriptor(name_1);
                if (define) {
                    Object.defineProperty(instance, name_1, define);
                }
                else {
                    instance[name_1] = bpt[name_1];
                }
            }
        }
        return instance;
    }
    jy.expandInstance = expandInstance;
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
    function expand(clazzA, clazzB) {
        var keys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keys[_i - 2] = arguments[_i];
        }
        _expand(clazzA.prototype, clazzB.prototype, keys);
        return clazzA;
    }
    jy.expand = expand;
    function _expand(pt, bpt, keys) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(bpt); _i < _a.length; _i++) {
            var name_2 = _a[_i];
            if (!keys || ~keys.indexOf(name_2)) {
                if (!(name_2 in pt)) {
                    pt[name_2] = bpt[name_2];
                }
            }
        }
        var sup = Object.getPrototypeOf(bpt);
        if (sup) {
            return _expand(pt, sup, keys);
        }
    }
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
    function getMixin(clazzA, clazzB) {
        var merged = function () { };
        if (Object.assign) { //高级版本的浏览器有Object.assign原生方法
            Object.assign(merged.prototype, clazzA.prototype, clazzB.prototype);
        }
        else {
            merged = expand(merged, clazzA);
            merged = expand(merged, clazzB);
        }
        return merged;
    }
    jy.getMixin = getMixin;
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
    function copyProperty(to, from, key) {
        Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
    }
    jy.copyProperty = copyProperty;
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
    function copyProperties(to, from) {
        var keys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keys[_i - 2] = arguments[_i];
        }
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            copyProperty(to, from, key);
        }
    }
    jy.copyProperties = copyProperties;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 状态机
     * @author 3tion
     */
    var StateMachine = /** @class */ (function () {
        function StateMachine() {
            this.swis = {};
            this.liss = [];
            this._stas = [];
        }
        Object.defineProperty(StateMachine.prototype, "states", {
            /**
             * 获取当前已有的状态列表
             *
             * @readonly
             */
            get: function () {
                return this._stas;
            },
            enumerable: true,
            configurable: true
        });
        StateMachine.prototype.add = function (value) {
            if (!value) {
                true && jy.ThrowError("addStateListener没有设置正确!");
            }
            this.liss.pushOnce(value);
        };
        StateMachine.prototype.remove = function (value) {
            this.liss.remove(value);
        };
        StateMachine.prototype.addToStates = function () {
            var args = arguments;
            var value = args[0];
            if (!value) {
                true && jy.ThrowError("addToStateList没有设置正确!");
            }
            for (var i = 1; i < args.length; i++) {
                this.addToState(args[i], value);
            }
        };
        /**
         * 从所有状态中删除侦听;
         * @param value
         *
         */
        StateMachine.prototype.removeAllState = function (value) {
            if (!value) {
                return;
            }
            var states = this._stas;
            for (var i = 0; i < states.length; i++) {
                this.removeFromState(states[i], value);
            }
        };
        /**
         * 从单个状态中,删了一个具体侦听;
         * @param type
         * @param value
         * @return
         *
         */
        StateMachine.prototype.removeFromState = function (state, value) {
            var list = this.swis[state];
            return list && list.remove(value);
        };
        /**
         * 单个状态中加入一个侦听;
         * @param value
         * @param list
         *
         */
        StateMachine.prototype.addToState = function (state, value) {
            if (!value) {
                jy.ThrowError("addToState没有设置正确!");
            }
            var list = this.swis[state];
            if (list) {
                if (~list.indexOf(value))
                    return;
            }
            else {
                this.swis[state] = list = [];
                this._stas.push(state);
            }
            list.push(value);
            if (this.current == state) {
                value.awakeBy(this.current);
            }
        };
        /**
         *  清理状态机;
         *
         */
        StateMachine.prototype.clear = function () {
            this.swis = {};
            this.liss.length = 0;
            this.current = undefined;
        };
        /**
         * 设置当前的状态
         * @param value
         *
         */
        StateMachine.prototype.setState = function (value) {
            var old = this.current;
            if (old == value) {
                return;
            }
            this.current = value;
            var states = this.swis;
            var oldList = states[old];
            var newList = states[value];
            var newLen = newList && newList.length || 0;
            //新的开启
            if (this.checkBeforeSleep) {
                for (var i = 0; i < newLen; i++) {
                    var item = newList[i];
                    item.beforeLastSleep && item.beforeLastSleep(value);
                }
            }
            //旧的关闭
            if (oldList) {
                for (var i = 0; i < oldList.length; i++) {
                    var item = oldList[i];
                    if (!newList || !~newList.indexOf(item)) {
                        item.sleepBy && item.sleepBy(value);
                    }
                }
            }
            //新的开启
            for (var i = 0; i < newLen; i++) {
                var item = newList[i];
                item.awakeBy && item.awakeBy(value);
            }
            var aways = this.liss;
            if (aways) {
                for (var i = 0; i < aways.length; i++) {
                    aways[i].setState(value);
                }
            }
        };
        /**
         * 检查状态实现(switcher)是否添加到某个状态中
         *
         * @param {IStateSwitcher} switcher    某个状态实现
         * @param {Key} [type] 状态
         * @returns {boolean}
         */
        StateMachine.prototype.isInState = function (switcher, type) {
            type == void 0 && (type = this.current);
            var list = this.swis[type];
            if (list) {
                return list.indexOf(switcher) > -1;
            }
        };
        return StateMachine;
    }());
    jy.StateMachine = StateMachine;
    __reflect(StateMachine.prototype, "jy.StateMachine", ["jy.IStateListener"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * protobuf wiretype的字典
     * key  {number}    ProtoBuf的类型
     * Value {number}   WireType
     *
     * @private
     * @static
     * @type {{ [index: number]: number }}
     */
    var wireTypeMap = [
        /* 无 */ ,
        /* PBType.Double */ 1,
        /* PBType.Float */ 5,
        /* PBType.Int64 */ 0,
        /* PBType.UInt64 */ 0,
        /* PBType.Int32 */ 0,
        /* PBType.Fixed64 */ 1,
        /* PBType.Fixed32 */ 5,
        /* PBType.Bool */ 0,
        /* PBType.String */ 2,
        /* PBType.Group */ ,
        /* PBType.Message */ 2,
        /* PBType.Bytes */ 2,
        /* PBType.Uint32 */ 0,
        /* PBType.Enum */ 0,
        /* PBType.SFixed32 */ 5,
        /* PBType.SFixed64 */ 1,
        /* PBType.SInt32 */ 0,
        /* PBType.SInt64 */ 0
    ];
    function getPBUtils() {
        var structDict = {};
        /**
         * 消息定义的字典
         */
        var defDict = {};
        function regDef(m, def) {
            var msg;
            if (typeof m != "object") {
                msg = structDict[m];
                if (!msg) {
                    defDict[m] = def;
                    return;
                }
            }
            else {
                msg = m;
            }
            Object.defineProperty(msg, "def" /* defKey */, {
                value: def
            });
        }
        /**
         * 注册消息的结构
         * @param msgType 消息类型标识
         * @param struct 结构
         */
        function regStruct(msgType, struct) {
            if (true && (msgType in structDict)) {
                jy.ThrowError("PB\u7684\u7ED3\u6784\u5B9A\u4E49\u7684key[" + msgType + "]\u6CE8\u518C\u91CD\u590D");
            }
            var def = defDict[msgType];
            if (def) {
                regDef(struct, def);
            }
            //检查处理默认值
            initDefault(struct);
            structDict[msgType] = struct;
        }
        function initDefault(struct, ref) {
            //检查处理默认值
            for (var idx in struct) {
                var body = struct[idx];
                //0 key
                //1 required optional repeated
                //2 数据类型
                //3 Message
                //4 默认值
                if (4 in body) { //有默认值
                    var def = struct.def;
                    if (!def) {
                        def = ref && ref.prototype || {};
                        //不使用encode.def=def=[]; 是为了防止def被遍历
                        Object.defineProperty(struct, "def" /* defKey */, {
                            value: def
                        });
                    }
                    //消息中没有对应key的数据，先赋值成默认值，等待后续处理
                    def[body[0]] = body[4];
                }
            }
            if (ref) {
                struct.ref = ref;
            }
        }
        /**
         *
         * @author 3tion
         * ProtoBuf工具集
         *
         */
        return {
            /**
             * 注册定义
             */
            regDef: regDef,
            regStruct: regStruct,
            /**
             * 初始化默认值
             */
            initDefault: initDefault,
            /**
             * 增加ProtoBuf的消息的结构字典
             *
             * @static
             * @param {PBStructDict} dict
             *
             * @memberOf PBMessageUtils
             */
            add: function (dict) {
                //对默认值做预处理，减少后期遍历次数
                if (dict) {
                    if (!dict.$$inted) { //检查字典是否初始化过
                        for (var name_3 in dict) {
                            var struct = dict[name_3];
                            if (typeof struct != "object") {
                                var cycle = [name_3, struct];
                                while (true) { //防止出现多重关联的情况 
                                    struct = dict[struct];
                                    if (struct == null) { //或者undefiend
                                        return true && jy.Log("\u6DFB\u52A0ProtoBuf\u5B57\u5178\u6709\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E");
                                    }
                                    if (typeof struct == "object") {
                                        break;
                                    }
                                    if (~cycle.indexOf(struct)) {
                                        return true && jy.Log("\u6DFB\u52A0ProtoBuf\u5B57\u5178\u6709\u8BEF\uFF0C\u51FA\u73B0\u5FAA\u73AF\u7684\u914D\u7F6E");
                                    }
                                    cycle.push(struct);
                                }
                            }
                            regStruct(name_3, struct);
                        }
                        dict.$$inted = 1;
                    }
                }
            },
            readFrom: readFrom,
            writeTo: writeTo,
            readMessage: readMessage,
            readString: readString,
            readBytes: readBytes,
        };
        /**
         * 读取消息
         *
         * @param {(Key | PBStruct)} msgType
         * @param {ByteArray} bytes
         * @param {number} [len]
         * @returns {any}
         */
        function readFrom(msgType, bytes, len) {
            if (len === undefined)
                len = -1;
            var afterLen = 0;
            if (len > -1) {
                afterLen = bytes.bytesAvailable - len;
            }
            var struct = typeof msgType == "object" ? msgType : structDict[msgType];
            if (!struct) {
                jy.ThrowError("\u975E\u6CD5\u7684\u901A\u4FE1\u7C7B\u578B[" + msgType + "]");
                return;
            }
            //检查处理默认值
            var ref = struct.ref, def = struct.def;
            var msg = ref ? new ref() : def ? Object.create(struct.def) : {};
            while (bytes.bytesAvailable > afterLen) {
                var tag = bytes.readVarint();
                if (tag == 0)
                    continue;
                var idx = tag >>> 3;
                var body = struct[idx];
                if (!body) {
                    jy.ThrowError("\u8BFB\u53D6\u6D88\u606F\u7C7B\u578B\u4E3A\uFF1A" + msgType + "\uFF0C\u7D22\u5F15" + idx + "\u65F6\u6570\u636E\u51FA\u73B0\u9519\u8BEF\uFF0C\u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u6570\u636E\u7ED3\u6784\u914D\u7F6E");
                    // 使用默认读取
                    readValue(tag, bytes);
                    continue;
                }
                var name_4 = body[0];
                var label = body[1];
                var type = body[2];
                var subMsgType = body[3];
                var value = void 0;
                var isRepeated = label == 3 /* Repeated */;
                if (!isRepeated || (tag & 7) != 7) { //自定义  tag & 0b111 == 7 为 数组中 undefined的情况
                    switch (type) {
                        case 1 /* Double */:
                            value = bytes.readPBDouble();
                            break;
                        case 2 /* Float */:
                            value = bytes.readPBFloat();
                            break;
                        case 3 /* Int64 */:
                        case 4 /* UInt64 */:
                        case 18 /* SInt64 */:
                            value = bytes.readVarint64(); //理论上项目不使用
                            break;
                        case 17 /* SInt32 */:
                            value = decodeZigzag32(bytes.readVarint());
                            break;
                        case 5 /* Int32 */:
                        case 13 /* Uint32 */:
                        case 14 /* Enum */:
                            value = bytes.readVarint();
                            break;
                        case 6 /* Fixed64 */:
                        case 16 /* SFixed64 */:
                            value = bytes.readFix64(); //理论上项目不使用
                            break;
                        case 7 /* Fixed32 */:
                            value = bytes.readFix32();
                            break;
                        case 8 /* Bool */:
                            value = bytes.readBoolean();
                            break;
                        case 9 /* String */:
                            value = readString(bytes);
                            break;
                        case 10 /* Group */: //(protobuf 已弃用)
                            value = undefined;
                            if (true) {
                                jy.ThrowError("\u8BFB\u53D6\u6D88\u606F\u7C7B\u578B\u4E3A\uFF1A" + msgType + "\uFF0C\u7D22\u5F15" + idx + "\u65F6\u6570\u636E\u51FA\u73B0\u5DF2\u5F03\u7528\u7684GROUP\u5206\u7EC4\u7C7B\u578B");
                            }
                            break;
                        case 11 /* Message */: //消息
                            value = readMessage(bytes, subMsgType);
                            break;
                        case 12 /* Bytes */:
                            value = readBytes(bytes);
                            break;
                        case 15 /* SFixed32 */:
                            value = bytes.readSFix32();
                            break;
                        default:
                            value = readValue(tag, bytes);
                    }
                }
                if (isRepeated) { //repeated
                    var arr = msg[name_4];
                    if (!arr)
                        msg[name_4] = arr = [];
                    arr.push(value);
                }
                else {
                    msg[name_4] = value;
                }
            }
            return msg;
        }
        function readValue(tag, bytes) {
            var wireType = tag & 7;
            var value;
            switch (wireType) {
                case 0: //Varint	int32, int64, uint32, uint64, sint32, sint64, bool, enum
                    value = bytes.readVarint();
                    break;
                case 2: //Length-delimi	string, bytes, embedded messages, packed repeated fields
                    value = readString(bytes);
                    break;
                case 5: //32-bit	fixed32, sfixed32, float
                    value = bytes.readInt();
                    break;
                case 1: //64-bit	fixed64, sfixed64, double
                    value = bytes.readDouble();
                    break;
                default:
                    jy.ThrowError("protobuf的wireType未知");
                    break;
            }
            return value;
        }
        function readString(bytes) {
            var blen = bytes.readVarint();
            return blen > 0 ? bytes.readUTFBytes(blen) : "";
        }
        /**
         *
         * 读取消息
         * @private
         * @static
         * @param {number} tag          标签
         * @param {ByteArray} bytes     被处理的字节数组
         * @param {string} subMsgType   类型标识
         * @returns {Object}
         */
        function readMessage(bytes, msgType) {
            var blen = bytes.readVarint();
            return readFrom(msgType, bytes, blen);
        }
        function readBytes(bytes) {
            var blen = bytes.readVarint();
            return bytes.readByteArray(blen);
        }
        /**
         * 写入消息
         *
         * @param {object} msg
         * @param {(Key | PBStruct)} msgType
         * @param {ByteArray} [bytes]
         * @returns {ByteArray}
         */
        function writeTo(msg, msgType, bytes, debugOutData) {
            if (msg == undefined) {
                return;
            }
            var struct = typeof msgType == "object" ? msgType : structDict[msgType];
            if (!struct) {
                jy.ThrowError("\u975E\u6CD5\u7684\u901A\u4FE1\u7C7B\u578B[" + msgType + "]\uFF0C\u5806\u6808\u4FE1\u606F:" + new Error());
                return;
            }
            if (!bytes) {
                bytes = new jy.ByteArray;
            }
            for (var numberStr in struct) {
                var num = +numberStr;
                var body = struct[num];
                var name_5 = body[0], label = body[1];
                if (label == 1 /* Optional */ && !(name_5 in msg)) {
                    continue;
                }
                var value = msg[name_5];
                if (value == undefined || value === body[4] /* 默认值 */) {
                    continue;
                }
                var type = body[2];
                var subMsgType = body[3];
                var wireType = wireTypeMap[type];
                var tag = (num << 3) | wireType;
                if (label == 3 /* Repeated */) {
                    if (true && debugOutData) {
                        var arr = [];
                        debugOutData[name_5] = arr;
                    }
                    for (var key in value) {
                        var element = value[key];
                        // 针对repeated中无法处理空的占位数组做处理，Protobuf 2 中不支持undefined进行占位  由于 wireType 只使用 0 1 2 3 4 5
                        // 现在使用 7 作为  undefined 占位使用
                        if (true && debugOutData) {
                            arr.push(writeElementTo(element, type, element == undefined ? ((num << 3) | 7) : tag, bytes, subMsgType));
                        }
                        else {
                            writeElementTo(element, type, element == undefined ? ((num << 3) | 7) : tag, bytes, subMsgType);
                        }
                    }
                }
                else {
                    if (true && debugOutData) {
                        debugOutData[name_5] = writeElementTo(value, type, tag, bytes, subMsgType);
                    }
                    else {
                        writeElementTo(value, type, tag, bytes, subMsgType);
                    }
                }
            }
            return bytes;
        }
        function writeElementTo(value, type, tag, bytes, subMsgType) {
            if (true) {
                var out = value;
            }
            bytes.writeVarint(tag);
            switch (type) {
                case 7 /* Fixed32 */:
                    bytes.writeFix32(checkUInt32(value, type));
                    break;
                case 15 /* SFixed32 */:
                    bytes.writeSFix32(checkInt32(value, type));
                    break;
                case 2 /* Float */:
                    bytes.writePBFloat(value);
                    break;
                case 1 /* Double */:
                    bytes.writePBDouble(value);
                    break;
                case 6 /* Fixed64 */: //理论上项目不使用
                case 16 /* SFixed64 */: //理论上项目不使用
                    bytes.writeFix64(value);
                    break;
                case 5 /* Int32 */:
                    value = checkInt32(value, type);
                    if (value < 0) {
                        bytes.writeVarint64(value);
                    }
                    else {
                        bytes.writeVarint(value);
                    }
                    break;
                case 17 /* SInt32 */:
                    bytes.writeVarint(zigzag32(checkInt32(value, type)));
                    break;
                case 14 /* Enum */:
                case 13 /* Uint32 */:
                    bytes.writeVarint(checkUInt32(value, type));
                    break;
                case 3 /* Int64 */:
                case 18 /* SInt64 */:
                case 4 /* UInt64 */:
                    bytes.writeVarint64(value);
                    break;
                case 8 /* Bool */:
                    bytes.writeVarint(value ? 1 : 0);
                    break;
                case 9 /* String */:
                case 12 /* Bytes */:
                case 11 /* Message */:
                    if (type == 11 /* Message */) {
                        if (true) {
                            out = {};
                            temp = writeTo(value, subMsgType, null, out);
                        }
                        else {
                            var temp = writeTo(value, subMsgType);
                        }
                    }
                    else if (type == 12 /* Bytes */) {
                        temp = value;
                        if (true) {
                            out = Uint8Array.from(temp.bytes);
                        }
                    }
                    else {
                        temp = new jy.ByteArray;
                        temp.writeUTFBytes(value);
                    }
                    var len = temp ? temp.length : 0;
                    bytes.writeVarint(len);
                    if (len > 0) {
                        bytes.writeBytes(temp, 0, len);
                    }
                    break;
            }
            if (true) {
                return out;
            }
        }
        function checkUInt32(value, type) {
            value = +value || 0;
            if (value > 4294967295 || value < 0) {
                jy.ThrowError("PBMessageUtils\u5199\u5165\u6570\u636E\u65F6\u5019\uFF0C\u4F7F\u7528\u7684\u7C7B\u578B\uFF1A" + type + "\uFF0C\u503C\u4E3A\uFF1A" + value + "\uFF0C\u4F46\u8D85\u51FA\u6574\u578B\u8303\u56F4\u3002");
                value >>> 0;
            }
            return value;
        }
        function checkInt32(value, type) {
            value = +value || 0;
            if (value > 2147483647 || value < -2147483648) {
                jy.ThrowError("PBMessageUtils\u5199\u5165\u6570\u636E\u65F6\u5019\uFF0C\u4F7F\u7528\u7684\u7C7B\u578B\uFF1A" + type + "\uFF0C\u503C\u4E3A\uFF1A" + value + "\uFF0C\u4F46\u8D85\u51FA\u6574\u578B\u8303\u56F4\u3002");
                value >> 0;
            }
            return value;
        }
        function zigzag32(n) {
            return (n << 1) ^ (n >> 31);
        }
        function decodeZigzag32(n) {
            return n >> 1 ^ (((n & 1) << 31) >> 31);
        }
    }
    jy.getPBUtils = getPBUtils;
    /**
     * 默认的PB工具
     */
    jy.PBUtils = getPBUtils();
})(jy || (jy = {}));
var jy;
(function (jy) {
    function getColorString(c) {
        return "#" + c.toString(16).zeroize(6);
    }
    var textureCaches = {};
    var idx = 0;
    var increaseCount = 5;
    var size = Math.pow(2, increaseCount);
    var canvas = document.createElement("canvas");
    canvas.height = canvas.width = size;
    var bmd = new egret.BitmapData(canvas);
    bmd.$deleteSource = false;
    var ctx = canvas.getContext("2d");
    function checkCanvas() {
        if (idx >= size * size) {
            size <<= 1;
            bmd.width = bmd.height = canvas.height = canvas.width = size << 2;
            increaseCount++;
        }
    }
    /**
     * ```
     * ┌─┬─┐
     * │0│1│
     * ├─┼─┤
     * │2│3│
     * └─┴─┘
     * ```
     */
    var poses = [
        /**0 */ [0, 0],
        /**1 */ [1, 0],
        /**2 */ [0, 1],
        /**3 */ [1, 1]
    ];
    /**
     * 颜色工具
     * @author 3tion
     *
     */
    jy.ColorUtil = {
        /**
         * 获取颜色字符串 #a1b2c3
         * @param c
         * @return 获取颜色字符串 #a1b2c3
         *
         */
        getColorString: getColorString,
        /**
         * 将#a1b2c3这样#开头的颜色字符串，转换成颜色数值
         */
        getColorValue: function (c) {
            if (/#[0-9a-f]{6}/i.test(c)) {
                return +("0x" + c.substring(1));
            }
            else {
                if (true) {
                    jy.ThrowError("\u4F7F\u7528\u7684\u989C\u8272" + c + "\u6709\u8BEF");
                }
                return 0;
            }
        },
        /**
         * 获取一个纯色的纹理
         */
        getTexture: function (color, alpha) {
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 0.8; }
            var key = color + "_" + alpha;
            var tex = textureCaches[key];
            if (!tex) {
                checkCanvas();
                textureCaches[key] = tex = new egret.Texture();
                var count = increaseCount;
                var x = 0, y = 0;
                var cidx = idx;
                do {
                    var shift = 2 * count;
                    var area = cidx >> shift;
                    cidx = cidx - (area << shift);
                    var pos = poses[area];
                    x += pos[0] * shift;
                    y += pos[1] * shift;
                    if (!--count) {
                        var pos_1 = poses[cidx];
                        x += pos_1[0];
                        y += pos_1[1];
                        break;
                    }
                } while (true);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = getColorString(color);
                x <<= 2;
                y <<= 2;
                ctx.fillRect(x, y, 4, 4);
                tex.disposeBitmapData = false;
                tex.bitmapData = bmd;
                if (bmd.webGLTexture) { //清理webgl纹理，让渲染可以重置
                    egret.WebGLUtils.deleteWebGLTexture(bmd);
                    bmd.webGLTexture = null;
                }
                var ww = 2;
                tex.$initData(x + 1, y + 1, ww, ww, 0, 0, ww, ww, ww, ww);
                idx++;
            }
            return tex;
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    var slowDispatching;
    function onSlowRender() {
        jy.dispatch(-1996 /* SlowRender */);
        slowDispatching = false;
    }
    /**
     * 基础渲染器
     * @author 3tion
     *
     */
    var BaseRender = /** @class */ (function () {
        function BaseRender() {
            /**原始方向索引 */
            this.d = 0;
            /**原始帧数索引 */
            this.f = 0;
            /**
             * 数组的索引
             */
            this.idx = 0;
            /**
             * 下一次需要重新计算渲染的时间
             */
            this.nextRenderTime = 0;
            /**
             * 当前渲染时间
             */
            this.renderedTime = 0;
            /**
             * 播放速度，默认为1倍速度<br/>
             * 值越高，速度越快
             */
            this._playSpeed = 1;
        }
        Object.defineProperty(BaseRender.prototype, "playSpeed", {
            /**
             * 播放速度，默认为1倍速度<br/>
             * 值越高，速度越快
             */
            get: function () {
                return this._playSpeed;
            },
            /**
             * 设置播放速度
             */
            set: function (value) {
                if (value < 0) {
                    value = 0;
                }
                if (value != this._playSpeed) {
                    this._playSpeed = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         *  处理数据帧
         */
        BaseRender.prototype.onData = function (actionInfo, now) {
            var nextRenderTime = this.nextRenderTime;
            if (nextRenderTime < now) {
                var renderedTime = this.renderedTime;
                var delta = now - nextRenderTime;
                var frames_1 = actionInfo.frames;
                //当前帧
                var idx = this.idx;
                //最后一帧
                var flen = frames_1.length - 1;
                var ps = this.playSpeed * BaseRender.globalPlaySpeed;
                var frame = void 0;
                if (ps > 0) {
                    if (delta > 500) { //被暂停过程时间，直接执行会导致循环次数过多，舍弃结果
                        if (nextRenderTime != 0) {
                            true && printSlow(delta);
                            if (BaseRender.dispatchSlowRender) {
                                if (!slowDispatching) {
                                    slowDispatching = true;
                                    jy.Global.nextTick(onSlowRender);
                                }
                            }
                        }
                        nextRenderTime = now;
                        renderedTime = now;
                    }
                    ps = 1 / ps;
                    if (ps < 0.01) { //最快处理100倍速度
                        ps = 0.01;
                    }
                    do {
                        frame = frames_1[idx];
                        if (frame) {
                            var tt = frame.t * ps; // 容错
                            if (tt <= 0) {
                                tt = now - renderedTime;
                                break;
                            }
                            nextRenderTime = renderedTime + tt;
                            if (nextRenderTime < now) {
                                if (frame.e) {
                                    this.dispatchEvent(frame.e, now);
                                }
                                renderedTime = nextRenderTime;
                                idx++;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            this.idx = 0;
                            if (this.isComplete(actionInfo)) {
                                this.doComplete(now);
                                return;
                            }
                            else {
                                idx = 0;
                                frame = frames_1[0];
                                break;
                            }
                        }
                    } while (true);
                }
                else { // 播放速度为0则暂停
                    frame = frames_1[idx];
                }
                this.idx = idx;
                this.renderedTime = renderedTime;
                this.nextRenderTime = nextRenderTime;
                this.willRenderFrame = frame;
                if (idx > flen) {
                    this.idx = 0;
                    if (this.isComplete(actionInfo)) {
                        this.doComplete(now);
                        return;
                    }
                }
            }
        };
        BaseRender.prototype.isComplete = function (info) {
            return !info.isCircle;
        };
        /**
         * 渲染帧时调用
         *
         * @param {number} now (description)
         */
        BaseRender.prototype.doRender = function (now) {
            if (this.willRenderFrame) {
                this.clearRes();
                this.renderFrame(this.willRenderFrame, now);
            }
        };
        /**
         * 渲染指定帧
         * @param frame
         * @param now
         */
        BaseRender.prototype.renderFrame = function (frame, now) {
            this.f = frame.f;
        };
        /**
         * 清理当前帧
         */
        BaseRender.prototype.clearRes = function () {
        };
        /**
         * 派发事件
         * @param event     事件名
         * @param now       当前时间
         */
        BaseRender.prototype.dispatchEvent = function (event, now) {
        };
        /**
         * 渲染结束
         * @param now       当前时间
         */
        BaseRender.prototype.doComplete = function (now) {
        };
        /**
         * 全局单位播放速度
         */
        BaseRender.globalPlaySpeed = 1;
        return BaseRender;
    }());
    jy.BaseRender = BaseRender;
    __reflect(BaseRender.prototype, "jy.BaseRender", ["jy.IDrawInfo"]);
    if (true) {
        var printSlow = (function () {
            return function (delta) {
                jy.Global.callLater(print, 0, null, delta);
            };
            function print(delta) {
                console.log("Render\u4E0A\u6B21\u6267\u884C\u65F6\u95F4\u548C\u5F53\u524D\u65F6\u95F4\u5DEE\u503C\u8FC7\u957F[" + delta + "]");
            }
        })();
    }
})(jy || (jy = {}));
/**
 * 资源打包信息
 * AS3的版本中实现了5种打包方式
 * H5中实现了2种（2 按动作打包，4 单方向单动作打包），不过后面只会使用4（单方向单动作）进行打包，其他方式弃用
 * @author 3tion
 */
var jy;
(function (jy) {
    var parsers;
    /**
     * 获取处理器
     */
    function getParsers(t) {
        if (!parsers) {
            parsers = {};
            parsers[0 /* PAK_ALL */] = AllSInfo;
            parsers[2 /* PAK_BY_ACTION */] = ActionSInfo;
            parsers[4 /* PAK_ONE_A_D */] = OneADSInfo;
        }
        return parsers[t];
    }
    /**
     * 存储pst信息
     */
    var PstInfo = /** @class */ (function () {
        function PstInfo() {
            this.urCreator = jy.UnitResource;
        }
        /**
         * 获取施法点
         * @param {number} action 动作标识
         * @param {number} direction 方向
         * @return {Point} 如果有施法点
         */
        PstInfo.prototype.getCastPoint = function (action, direction) {
            if (this.castPoints) {
                var pt = this.castPoints[jy.ADKey.get(action, direction)];
                if (pt) {
                    return pt;
                }
            }
            return;
        };
        PstInfo.prototype.getResKey = function (direction, action) {
            return this.splitInfo.getResKey(direction, action);
        };
        PstInfo.prototype.bindResource = function (resKey, resouce, textures) {
            return this.splitInfo.bindResource(resKey, resouce, textures);
        };
        PstInfo.prototype.init = function (key, data) {
            this.key = key;
            this._resources = {};
            var type = +data[0];
            this.type = type;
            var parserRef = getParsers(type);
            if (!parserRef) {
                return;
            }
            var parser = new parserRef(key);
            //处理数据
            this.splitInfo = parser;
            parser.parseSplitInfo(data[1]);
            this.frames = parser.parseFrameData(data[2]);
            // extra [0] 头顶坐标Y number
            // extra [1] 受创点Y number
            // extra [2] 施法点 {[index:string]:Array<Array<number>(2)>(5)}
            var extra = data[3];
            if (extra) {
                this.headY = +extra[0];
                this.hurtY = +extra[1];
                var castInfo = extra[2];
                if (castInfo) {
                    var castPoints = {};
                    this.castPoints = castPoints;
                    for (var a in castInfo) {
                        var aInfo = castInfo[a];
                        for (var d = 0; d < 8; d++) {
                            var pInfo = aInfo[d > 4 ? 8 - d : d];
                            if (pInfo) {
                                castPoints[jy.ADKey.get(+a, d)] = { x: +pInfo[0], y: +pInfo[1] };
                            }
                        }
                    }
                }
            }
        };
        /**
         * 解析图片数据
         * 用于批量处理数据
         */
        PstInfo.prototype.decodeImageDatas = function (data) {
            for (var uri in data) {
                var res = this.getResource(uri);
                res.decodeData(data[uri]);
            }
        };
        PstInfo.prototype.getResource = function (uri) {
            var res = this._resources[uri];
            if (!res) {
                res = new this.urCreator(uri, this);
                this._resources[uri] = res;
            }
            return res;
        };
        /**
         * 获取单位资源
         */
        PstInfo.prototype.getUnitResource = function (uri) {
            var res = this.getResource(uri);
            res.loadData();
            return res;
        };
        return PstInfo;
    }());
    jy.PstInfo = PstInfo;
    __reflect(PstInfo.prototype, "jy.PstInfo");
    /**
     * 资源打包分隔信息
     * 只保留了最主流的单动作，单方向
     */
    var SplitInfo = /** @class */ (function () {
        function SplitInfo(key) {
            this.key = key;
        }
        SplitInfo.prototype.parseFrameData = function (data) {
            this._resDict = {};
            var frames = {};
            /**
             * 有效的动作数组，有些动作是自定义出来的，不是原始动作
             */
            var alist = [];
            for (var key in data) {
                var a = +key;
                var aInfo = jy.getActionInfo(data[a], a);
                frames[a] = aInfo;
                var fs = aInfo.frames;
                for (var i = 0; i < fs.length; i++) {
                    var frame = fs[i];
                    alist.pushOnce(frame.a);
                }
            }
            this.parseADDict(alist);
            return frames;
        };
        SplitInfo.prototype.parseADDict = function (_alist) { };
        SplitInfo.prototype.parseSplitInfo = function (_infos) { };
        /**
         * 遍历资源
         * @param _forEach
         */
        SplitInfo.prototype.forEach = function (_forEach) {
        };
        return SplitInfo;
    }());
    jy.SplitInfo = SplitInfo;
    __reflect(SplitInfo.prototype, "jy.SplitInfo");
    function getRep(data, repArr) {
        var str = data + "";
        if (repArr && (data in repArr)) {
            str = repArr[data];
        }
        return str;
    }
    jy.ADKey = {
        /**
         * 得到 A(动作)D(方向)的标识
         *
         * @static
         * @param {number} action A(动作)标识
         * @param {number} direction D(方向)标识
         * @returns {number} A(动作)D(方向)的标识
         */
        get: function (action, direction) {
            return action << 8 | direction;
        },
        /**
         * 从A(动作)D(方向)的标识中获取 A(动作)标识
         *
         * @static
         * @param {ADKey} adKey A(动作)D(方向)的标识
         * @returns {number} A(动作)标识
         */
        getAction: function (adKey) {
            return adKey >> 8;
        },
        /**
         * 从A(动作)D(方向)的标识中获取 D(方向)标识
         *
         * @static
         * @param {ADKey} adKey A(动作)D(方向)的标识
         * @returns {number} D(方向)标识
         */
        getDirection: function (adKey) {
            return adKey & 0xff;
        }
    };
    /**
     * 默认动作数组
     * [a,b,c....x,y,z,A,B,C...X,Y,Z]
     */
    var _pst$a = function () {
        var a = [];
        m(97, 122); //a-z
        m(65, 90); //A-Z
        return a;
        function m(f, t) {
            for (var i = f; i <= t; i++) {
                a.push(String.fromCharCode(i));
            }
        }
    }();
    /**
     * 单方向单动作分隔数据
     * 后面只用这种打包方式
     */
    var OneADSInfo = /** @class */ (function (_super) {
        __extends(OneADSInfo, _super);
        function OneADSInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OneADSInfo.prototype.parseADDict = function (alist) {
            var adDict = this.adDict = {};
            //检查有效动作
            for (var i = 0; i < alist.length; i++) {
                var a = alist[i];
                for (var d = 0; d < 5; d++) {
                    var res = this.getResKey(d, a);
                    adDict[res] = jy.ADKey.get(a, d);
                }
            }
        };
        OneADSInfo.prototype.parseSplitInfo = function (infos) {
            this._n = infos.n || "{a}{d}";
            this._a = infos.a || _pst$a;
            this._d = infos.d;
        };
        OneADSInfo.prototype.getResKey = function (direction, action) {
            var key = jy.ADKey.get(action, direction);
            var res = this._resDict[key];
            if (!res) {
                this._resDict[key] = res = this._n.substitute({ "f": this.key, "a": getRep(action, this._a), "d": getRep(direction, this._d) });
            }
            return res;
        };
        /**
         * 遍历资源
         * @param _forEach
         */
        OneADSInfo.prototype.forEach = function (_forEach) {
            var dict = this.adDict;
            for (var resKey in dict) {
                if (_forEach(resKey, dict[resKey])) {
                    return;
                }
            }
        };
        OneADSInfo.prototype.bindResource = function (resKey, resouce, textures) {
            var adKey = this.adDict[resKey];
            bindResource(adKey, resouce, textures);
        };
        return OneADSInfo;
    }(SplitInfo));
    __reflect(OneADSInfo.prototype, "OneADSInfo");
    /**
     * 基于动作打包的分隔数据
     * @deprecated 已弃用
     */
    var ActionSInfo = /** @class */ (function (_super) {
        __extends(ActionSInfo, _super);
        function ActionSInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ActionSInfo.prototype.getADKey = function (resKey) {
            return this.adDict[resKey];
        };
        ActionSInfo.prototype.parseSplitInfo = function (infos) {
            var flag = true;
            if (infos) {
                this._resDict = {};
                this._subReses = [];
                var adDict = this.adDict = {};
                var _resDict = this._resDict;
                var _subReses = this._subReses;
                var len = infos.length;
                for (var i = 0; i < len; i++) {
                    var pak = infos[i][0];
                    var acts = pak.a;
                    if (acts) {
                        var dlen = acts.length;
                        if (dlen) {
                            flag = false;
                            var res = this.getFileName(pak);
                            var arr = adDict[res];
                            if (!arr) {
                                arr = [];
                                adDict[res] = arr;
                            }
                            if (res) {
                                _subReses.pushOnce(res);
                            }
                            for (var j = 0; j < dlen; j++) {
                                var a = acts[j];
                                _resDict[a] = res;
                                //push所有动作的数据
                                arr.push(jy.ADKey.get(a, 0), jy.ADKey.get(a, 1), jy.ADKey.get(a, 2), jy.ADKey.get(a, 3), jy.ADKey.get(a, 4));
                            }
                        }
                    }
                }
            }
            if (flag) {
                throw new Error("no pak split info");
            }
        };
        ActionSInfo.prototype.getFileName = function (pakInfo) {
            var dirs = pakInfo.a;
            return 2 /* PAK_BY_ACTION */ + "-" + dirs.join("_");
        };
        ActionSInfo.prototype.getResKey = function (_, action) {
            return this._resDict[action];
        };
        ActionSInfo.prototype.bindResource = function (resKey, resouce, textures) {
            var adKeyArr = this.adDict[resKey];
            adKeyArr.forEach(function (adKey) {
                bindResource(adKey, resouce, textures);
            });
        };
        return ActionSInfo;
    }(SplitInfo));
    __reflect(ActionSInfo.prototype, "ActionSInfo");
    var AllSInfo = /** @class */ (function (_super) {
        __extends(AllSInfo, _super);
        function AllSInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AllSInfo.prototype.getResKey = function (_direction, _action) {
            return "d";
        };
        AllSInfo.prototype.bindResource = function (_resKey, resouce, textures) {
            for (var a in textures) {
                var dTextures = textures[a];
                if (dTextures) {
                    for (var d in dTextures) {
                        var textures_1 = dTextures[d];
                        if (textures_1) {
                            for (var i = 0; i < textures_1.length; i++) {
                                resouce.bindTexture(textures_1[i]);
                            }
                        }
                    }
                }
            }
        };
        return AllSInfo;
    }(SplitInfo));
    __reflect(AllSInfo.prototype, "AllSInfo");
    function bindResource(adKey, resouce, textures) {
        var a = jy.ADKey.getAction(adKey);
        var dTextures = textures[a];
        if (dTextures) {
            var d = jy.ADKey.getDirection(adKey);
            var textures_2 = dTextures[d];
            if (textures_2) {
                for (var i = 0; i < textures_2.length; i++) {
                    resouce.bindTexture(textures_2[i]);
                }
            }
        }
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    var webp = jy.Global.webp ? ".webp" /* WEBP */ : "";
    /**
     * 地图基础信息<br/>
     * 由地图编辑器生成的地图信息
     * @author 3tion
     *
     */
    var MapInfo = /** @class */ (function () {
        function MapInfo() {
            /**
             * 图片扩展
             */
            this.ext = ".jpg" /* JPG */;
            /**
             * 单张底图的宽度
             */
            this.pWidth = 256 /* DefaultSize */;
            /**
             * 单张底图的高度
             */
            this.pHeight = 256 /* DefaultSize */;
        }
        /**
        * 获取地图图块资源路径
        */
        MapInfo.prototype.getMapUri = function (col, row) {
            return "" + MapInfo.prefix + this.path + "/" + row + "_" + col + this.ext + webp;
        };
        /**
         * 获取图片路径
         */
        MapInfo.prototype.getImgUri = function (uri) {
            return "" + MapInfo.prefix + this.path + "/" + uri;
        };
        /**
         * 地图前缀路径
         */
        MapInfo.prefix = "m/" /* MapPath */;
        return MapInfo;
    }());
    jy.MapInfo = MapInfo;
    __reflect(MapInfo.prototype, "jy.MapInfo");
})(jy || (jy = {}));
if (true) {
    var $gm = $gm || {};
    $gm.toggleMapGrid = function () {
        this.$showMapGrid = !this.$showMapGrid;
    };
    $gm.pathSolution = {};
    $gm.regPathDraw = function (type, handler) {
        $gm.pathSolution[type] = handler;
    };
}
var jy;
(function (jy) {
    function checkRect(map, rect, preload, forEach, checker, caller, ox, oy) {
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        //检查地图，进行加载区块
        var x = rect.x + ox;
        var y = rect.y + oy;
        var w = rect.width;
        var h = rect.height;
        var pW = map.pWidth;
        var pH = map.pHeight;
        var sc = x / pW | 0;
        var sr = y / pH | 0;
        var ec = (x + w) / pW | 0;
        var er = (y + h) / pH | 0;
        sc = Math.max(sc - preload, 0);
        sr = Math.max(sr - preload, 0);
        ec = Math.min(ec + preload, map.maxPicX);
        er = Math.min(er + preload, map.maxPicY);
        if (checker && !checker.call(caller, sc, sr, ec, er)) {
            return;
        }
        for (var r = sr; r <= er; r++) {
            for (var c = sc; c <= ec; c++) {
                var uri = map.getMapUri(c, r);
                forEach.call(caller, uri, c, r, map);
            }
        }
        return true;
    }
    /**
    * MapRender
    * 用于处理地图平铺的渲染
    */
    var TileMapLayer = /** @class */ (function (_super) {
        __extends(TileMapLayer, _super);
        function TileMapLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 扩展预加载的图块数量
             *
             */
            _this.preload = 0;
            /**
             *
             * 显示中的地图
             * @type {TileMap[]}
             */
            _this._showing = [];
            return _this;
        }
        Object.defineProperty(TileMapLayer.prototype, "currentMap", {
            get: function () {
                return this._currentMap;
            },
            /**
             * 显示/关闭地图格子显示
             *
             *
             * @memberOf $gmType
             */
            set: function (value) {
                if (value != this._currentMap) {
                    this._currentMap = value;
                    if (true) {
                        this.drawGrid = $gm.pathSolution[~~value.pathType];
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        TileMapLayer.prototype.addMap = function (uri, c, r, map) {
            var pW = map.pWidth, pH = map.pHeight, noPic = map.noPic, maxPicX = map.maxPicX;
            if (!noPic || getMapBit(c, r, maxPicX + 1, noPic) == 0) { //检查是否需要放置底图
                var tm = jy.ResManager.get(uri, this.noRes, this, uri, c, r, pW, pH);
                // 舞台上的标记为静态
                tm.isStatic = true;
                var idx = this._idx;
                this.$doAddChild(tm, idx, false);
                this._showing[idx++] = tm;
                this._idx = idx;
            }
        };
        TileMapLayer.prototype.reset = function () {
            this.lsc = this.lsr = this.lec = this.ler = undefined;
        };
        TileMapLayer.prototype.check = function (sc, sr, ec, er) {
            if (sc == this.lsc && sr == this.lsr && ec == this.lec && er == this.ler) { //要加载的块没有发生任何变更
                return;
            }
            this.lsc = sc;
            this.lsr = sr;
            this.lec = ec;
            this.ler = er;
            // 先将正在显示的全部标记为未使用
            // 换地图也使用此方法处理
            var now = jy.Global.now;
            var showing = this._showing;
            var left = showing.length;
            while (left > 0) {
                var m = showing[--left];
                m.isStatic = false;
                m.lastUseTime = now;
                this.$doRemoveChild(left, false);
            }
            return true;
        };
        TileMapLayer.prototype.setRect = function (rect, ox, oy) {
            if (ox === void 0) { ox = 0; }
            if (oy === void 0) { oy = 0; }
            var cM = this._currentMap;
            if (!cM) {
                return;
            }
            if (true) {
                if (this.drawGrid) {
                    this.drawGrid(rect.x + ox, rect.y + oy, rect.width, rect.height, cM);
                }
            }
            this._idx = 0;
            if (checkRect(cM, rect, this.preload, this.addMap, this.check, this, ox, oy)) {
                this._showing.length = this._idx;
            }
        };
        TileMapLayer.prototype.noRes = function (uri, c, r, pW, pH) {
            var tmp = new TileMap();
            //检查是否有小地图，如果有，先设置一份texture
            var _a = this, mini = _a.mini, miniTexDict = _a.miniTexDict;
            var x = c * pW;
            var y = r * pH;
            if (mini) {
                var texKey = jy.getPosHash2(c, r);
                var tex = miniTexDict[texKey];
                if (!tex) {
                    var textureWidth = mini.textureWidth, textureHeight = mini.textureHeight;
                    var _b = this._currentMap, width = _b.width, height = _b.height;
                    miniTexDict[texKey] = tex = new egret.Texture();
                    var dw = textureWidth / width;
                    var dh = textureHeight / height;
                    var sw = pW * dw;
                    var sh = pH * dh;
                    tex.$initData(x * dw, y * dh, sw, sh, 0, 0, sw, sh, sw, sh);
                    tex.$bitmapData = mini.bitmapData;
                }
                tmp.texture = tex;
                tmp.width = pW;
                tmp.height = pH;
            }
            tmp.reset(c, r, uri);
            tmp.x = x;
            tmp.y = y;
            tmp.load();
            return tmp;
        };
        /**
         * 设置小地图
         * @param uri
         */
        TileMapLayer.prototype.setMini = function (uri) {
            var miniUri = this._currentMap.getImgUri(uri);
            var old = this.miniUri;
            if (old != miniUri) {
                if (old) {
                    jy.Res.cancel(old);
                }
                this.miniUri = miniUri;
                this.mini = undefined;
                this.miniTexDict = {};
                jy.Res.load(miniUri, jy.ConfigUtils.getResUrl(miniUri), jy.CallbackInfo.get(this.miniLoad, this), 2 /* Highway */);
            }
        };
        TileMapLayer.prototype.miniLoad = function (item) {
            var data = item.data, uri = item.uri;
            if (uri == this.miniUri) {
                this.mini = data;
            }
        };
        TileMapLayer.prototype.removeChildren = function () {
            //重置显示的地图序列
            this._showing.length = 0;
            _super.prototype.removeChildren.call(this);
        };
        return TileMapLayer;
    }(jy.BaseLayer));
    jy.TileMapLayer = TileMapLayer;
    __reflect(TileMapLayer.prototype, "jy.TileMapLayer");
    /**
     * 获取类似地图一样，由行列构成的数据集，数据为2进制数据
     * @param x 横坐标
     * @param y 纵坐标
     * @param columns 一行的总列数
     * @param data 二进制数据集
     */
    function getMapBit(x, y, columns, data) {
        var position = y * columns + x;
        var byteCount = position >> 3;
        var bitCount = position - (byteCount << 3);
        return (data[byteCount] >> 7 - bitCount) & 1;
    }
    jy.getMapBit = getMapBit;
    TileMapLayer.checkRect = checkRect;
    /**
    * TileMap
    */
    var TileMap = /** @class */ (function (_super) {
        __extends(TileMap, _super);
        function TileMap() {
            return _super.call(this) || this;
        }
        TileMap.prototype.reset = function (col, row, uri) {
            this.col = col;
            this.row = row;
            this.uri = uri;
            this.url = jy.ConfigUtils.getResUrl(uri);
        };
        TileMap.prototype.load = function () {
            jy.Res.load(this.uri, this.url, jy.CallbackInfo.get(this.loadComplete, this));
        };
        /**
         * 资源加载完成
         */
        TileMap.prototype.loadComplete = function (item) {
            var _a = item, data = _a.data, uri = _a.uri;
            if (!data) { //没有data说明加载资源失败
                return;
            }
            if (uri == this.uri) {
                this.texture = data;
            }
        };
        TileMap.prototype.dispose = function () {
            var texture = this.texture;
            if (texture) {
                this.texture = undefined;
                texture.dispose();
            }
        };
        return TileMap;
    }(egret.Bitmap));
    jy.TileMap = TileMap;
    __reflect(TileMap.prototype, "jy.TileMap", ["jy.IResource"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    var Point = egret.Point;
    function getDirection(pA, pB) {
        var pt = pB.subtract(pA);
        var direction = new Point(pt.x, pt.y);
        direction.normalize(1);
        return direction;
    }
    function dot(pA, pB) {
        return pA.x * pB.x + pA.y * pB.y;
    }
    var tmpPt = new Point;
    var Line = /** @class */ (function () {
        function Line() {
            this.pA = new Point;
            this.pB = new Point;
        }
        Line.prototype.setPA = function (pt) {
            var pa = this.pA;
            pa.setTo(pt.x, pt.y);
            this.calcedNormal = false;
            return this;
        };
        Line.prototype.setPB = function (pt) {
            this.pB.copyFrom(pt);
            this.calcedNormal = false;
            return this;
        };
        Line.prototype.setPoints = function (pA, pB) {
            this.pA.copyFrom(pA);
            this.pB.copyFrom(pB);
            this.calcedNormal = false;
            return this;
        };
        Line.prototype.computeNormal = function () {
            if (!this.calcedNormal) {
                // Get Normailized direction from A to B
                var m_Normal = getDirection(this.pA, this.pB);
                // Rotate by -90 degrees to get normal of line
                // Rotate by +90 degrees to get normal of line
                var oldYValue = m_Normal.y;
                m_Normal.y = m_Normal.x;
                m_Normal.x = -oldYValue;
                this.m_Normal = m_Normal;
                this.calcedNormal = true;
            }
        };
        Line.prototype.signedDistance = function (point) {
            this.computeNormal();
            tmpPt.copyFrom(point);
            var v2f = tmpPt.subtract(this.pA);
            return dot(this.m_Normal, v2f);
        };
        /**
         * 检查点的位置
         * @param point 要检查的点
         * @param epsilon 精度
         */
        Line.prototype.classifyPoint = function (point, epsilon) {
            if (epsilon === void 0) { epsilon = 0.000001 /* Epsilon */; }
            var result = 0 /* OnLine */;
            var distance = this.signedDistance(point);
            if (distance > epsilon) {
                result = 2 /* RightSide */;
            }
            else if (distance < -epsilon) {
                result = 1 /* LeftSide */;
            }
            return result;
        };
        Line.prototype.intersection = function (other, intersectPoint) {
            var _a = other.pA, opAX = _a.x, opAY = _a.y, _b = other.pB, opBX = _b.x, opBY = _b.y;
            var _c = this, _d = _c.pA, pAX = _d.x, pAY = _d.y, _e = _c.pB, pBX = _e.x, pBY = _e.y;
            var doY = opBY - opAY;
            var doX = opBX - opAX;
            var dtY = pBY - pAY;
            var dtX = pBX - pAX;
            var dx = opAX - pAX;
            var dy = opAY - pAY;
            var denom = doY * dtX - doX * dtY;
            var u0 = dx * doY - dy * doX;
            var u1 = dx * dtY - dy * dtX;
            if (denom == 0) {
                if (u0 == 0 && u1 == 0) {
                    return 0 /* Collinear */;
                }
                else {
                    return 5 /* Paralell */;
                }
            }
            else {
                u0 = u0 / denom;
                u1 = u1 / denom;
                var x = pAX + u0 * dtX;
                var y = pAY + u0 * dtY;
                if (intersectPoint) {
                    intersectPoint.x = x;
                    intersectPoint.y = y;
                }
                if ((u0 >= 0) && (u0 <= 1) && (u1 >= 0) && (u1 <= 1)) {
                    return 2 /* SegmentsIntersect */;
                }
                else if ((u1 >= 0) && (u1 <= 1)) {
                    return (3 /* ABisectB */);
                }
                else if ((u0 >= 0) && (u0 <= 1)) {
                    return (4 /* BBisectA */);
                }
                return 1 /* LinesIntersect */;
            }
        };
        Line.prototype.equals = function (line) {
            var _a = this, pA = _a.pA, pB = _a.pB;
            var lpA = line.pA, lpB = line.pB;
            return pA.equals(lpA) && pB.equals(lpB) || pA.equals(lpB) && pB.equals(lpA);
        };
        return Line;
    }());
    jy.Line = Line;
    __reflect(Line.prototype, "jy.Line");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 多边形
     */
    var Polygon = /** @class */ (function () {
        function Polygon() {
        }
        /**
         * 是否包含点
         * @param pt
         */
        Polygon.prototype.contain = function (pt) {
            var x = pt.x, y = pt.y;
            var inside = false;
            var vs = this.points;
            for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                var _a = vs[i], xi = _a.x, yi = _a.y;
                var _b = vs[j], xj = _b.x, yj = _b.y;
                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect)
                    inside = !inside;
            }
            return inside;
        };
        return Polygon;
    }());
    jy.Polygon = Polygon;
    __reflect(Polygon.prototype, "jy.Polygon");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     * 震动的基本实现
     * @export
     * @class BaseShake
     * @implements {Shake}
     * @author 3tion
     */
    var BaseShake = /** @class */ (function () {
        function BaseShake() {
        }
        Object.defineProperty(BaseShake.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseShake.prototype, "total", {
            /**
             * 总执行时间
             */
            get: function () {
                return this._total;
            },
            enumerable: true,
            configurable: true
        });
        BaseShake.prototype.setShakeTarget = function (target) {
            this._target = target;
            return this;
        };
        /**
         * 设置单位基准值
         *
         * @param {number} [cx]
         * @param {number} [cy]
         */
        BaseShake.prototype.setTargetPos = function (cx, cy) {
            var target = this._target;
            if (cx === undefined)
                cx = target ? target.x : 0;
            if (cy === undefined)
                cy = target ? target.y : 0;
            this._cx = cx;
            this._cy = cy;
            return this;
        };
        BaseShake.prototype.start = function () {
            if (this._target) {
                this._shaking = true;
            }
        };
        BaseShake.prototype.end = function () {
            if (this._shaking) {
                var _a = this, _cx = _a._cx, _cy = _a._cy, _target = _a._target;
                if (_target.dispatch) {
                    _target.dispatch(-1989 /* ShakeEnd */, { x: _cx, y: _cy });
                }
                else {
                    _target.x = _cx;
                    _target.y = _cy;
                }
                this._shaking = false;
            }
        };
        /**
         * 销毁的处理
         */
        BaseShake.prototype.dispose = function () {
            this._target = undefined;
        };
        return BaseShake;
    }());
    jy.BaseShake = BaseShake;
    __reflect(BaseShake.prototype, "jy.BaseShake", ["jy.Shake"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 单位动作
     * @author 3tion
     *
     */
    var UnitAction = /** @class */ (function () {
        function UnitAction() {
        }
        /**
         * 根据坐骑状态，获取人物动作序列的配置
         *
         * @param {MountType} mountType 坐骑状态
         * @returns {IUnitActionInfo} 动作结果
         */
        UnitAction.prototype.getAction = function (mountType) {
            return UnitAction.defaultAction;
        };
        /**
         * 单位播放动作
         * 如果子类要制作动态的自定义动作，重写此方法
         * @param {Unit} unit               单位
         * @param {MountType} mountType     骑乘状态
         * @param {number} now              时间戳
         */
        UnitAction.prototype.playAction = function (unit, mountType, now) {
            var aData = this.getAction(mountType);
            if (aData) {
                unit.setMountType(aData.mountType);
                unit.doAction(now, aData.action);
            }
            else {
                jy.ThrowError("\u672A\u5B9E\u73B0\u52A8\u4F5C{mountType:" + mountType + "}");
            }
        };
        /**
         * 播放动作
         */
        UnitAction.prototype.start = function (unit, now) {
            this._isEnd = false;
            return true;
        };
        /**
         * 动作执行数据计算<br/>
         * 如更新单位坐标等
         */
        UnitAction.prototype.doData = function (unit, now) {
        };
        Object.defineProperty(UnitAction.prototype, "canStop", {
            /**
             * 检查当前动作是否可以结束<br/>
             * @return true 可以结束<br/>
             *         false 不可结束
             */
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 强制结束
         */
        UnitAction.prototype.terminate = function () {
        };
        /**
         * 动画播放结束的回调
         */
        UnitAction.prototype.playComplete = function (unit, now) {
            this._isEnd = true;
        };
        Object.defineProperty(UnitAction.prototype, "isEnd", {
            /**
             * 动作是否已经结束
             * @return true，动作已经结束，可以做下一个动作<br/>
             *         false, 动作未结束，
             */
            get: function () {
                return this._isEnd;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 执行事件
         */
        UnitAction.prototype.dispatchEvent = function (unit, eventType, now) {
        };
        /**
         * 渲染时执行
         */
        UnitAction.prototype.doRender = function (unit, now) {
        };
        UnitAction.prototype.recycle = function () {
            this._isEnd = true;
        };
        UnitAction.defaultAction = { mountType: 0 /* ground */, action: 0 };
        return UnitAction;
    }());
    jy.UnitAction = UnitAction;
    __reflect(UnitAction.prototype, "jy.UnitAction");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 用于君游项目数据同步，后台运行<br/>
     * 只有注册和注销，没有awake和sleep
     * @author 3tion
     *
     */
    var Proxy = /** @class */ (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name) {
            var _this = _super.call(this, name) || this;
            /**
             * 数据是否加载完毕
             */
            _this._readyState = 0 /* UNREQUEST */;
            return _this;
        }
        Object.defineProperty(Proxy.prototype, "isReady", {
            get: function () {
                return this._readyState == 2 /* COMPLETE */ && this._selfReady;
            },
            enumerable: true,
            configurable: true
        });
        Proxy.prototype.startSync = function () {
            if (this._readyState == 2 /* COMPLETE */) {
                this.selfReady();
            }
            else if (this._readyState == 0 /* UNREQUEST */) {
                this._readyState = 1 /* REQUESTING */;
                this._startSync();
            }
            return false;
        };
        /**
         * 用于重写，主要用于向服务端发送一些指令/或者是开始进行http请求进行拉配置
         *
         */
        Proxy.prototype._startSync = function () {
        };
        /**
         * 自己加载好<br/>
         * 不包括依赖项
         *
         */
        Proxy.prototype.selfReady = function () {
            this.parseSelfData();
            this._selfReady = true;
            if (this._dependerHelper) {
                this._dependerHelper.check();
            }
            else {
                this.allReadyHandler();
            }
        };
        /**
         * 用于子类重写<br/>
         * 处理自己的数据<br/>
         * 如果有依赖，请使用afterAllReady<br/>
         *
         */
        Proxy.prototype.parseSelfData = function () {
            // to be override
        };
        /**
         * 依赖项加载完毕
         *
         */
        Proxy.prototype.dependerReadyCheck = function () {
            if (this._selfReady) {
                this.allReadyHandler();
            }
        };
        /**
         * 全部ok<br/>
         * 此函数不给子类继承
         */
        Proxy.prototype.allReadyHandler = function () {
            if (this._readyState != 2 /* COMPLETE */) {
                this.afterAllReady();
                this._readyState = 2 /* COMPLETE */;
                if (this._asyncHelper) {
                    this._asyncHelper.readyNow();
                }
            }
        };
        return Proxy;
    }(jy.FHost));
    jy.Proxy = Proxy;
    __reflect(Proxy.prototype, "jy.Proxy");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 可以调用 @d_interest 的视图
     * 可以进行关注facade中的事件
     *
     * @export
     * @class ViewController
     * @extends {FHost}
     */
    var ViewController = /** @class */ (function (_super) {
        __extends(ViewController, _super);
        function ViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 用于内部增加关注
         *
         * @param {Key} eventType
         * @param {{ (e?: egret.Event): void }} handler
         * @param {boolean} [triggerOnStage]
         * @param {number} [priority]
         */
        ViewController.prototype.interest = function (eventType, handler, triggerOnStage, priority) {
            var ins = {};
            ins.handler = handler;
            ins.priority = priority || 0;
            ins.trigger = triggerOnStage;
            var _interests = this._interests;
            if (!_interests) {
                this._interests = _interests = {};
            }
            _interests[eventType] = ins;
            if (triggerOnStage) {
                var _awakeCallers = this._awakeCallers;
                if (!_awakeCallers) {
                    this._awakeCallers = _awakeCallers = [];
                }
                _awakeCallers.pushOnce(handler);
            }
        };
        ViewController.prototype.removeSkinListener = function (skin) {
            if (skin) {
                skin.off("removedFromStage" /* REMOVED_FROM_STAGE */, this.onStage, this);
                skin.off("addedToStage" /* ADDED_TO_STAGE */, this.onStage, this);
            }
        };
        ViewController.prototype.addSkinListener = function (skin) {
            if (skin) {
                skin.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.onStage, this);
                skin.on("addedToStage" /* ADDED_TO_STAGE */, this.onStage, this);
            }
        };
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
        ViewController.prototype.bindTimer = function (callback, trigger, time, thisObj) {
            if (trigger === void 0) { trigger = true; }
            if (time === void 0) { time = 1000 /* ONE_SECOND */; }
            if (thisObj === void 0) { thisObj = this; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            var _tList = this._tList;
            if (!_tList) {
                this._tList = _tList = [];
            }
            var info = jy.CallbackInfo.addToList.apply(jy.CallbackInfo, [_tList, callback, thisObj].concat(args));
            info.time = time;
            jy.TimerUtil.add(time, info);
            if (trigger) {
                info.execute(false);
            }
        };
        /**
         * 解除定时回调函数的绑定
         * @param callback
         * @param time
         * @param thisObj
         */
        ViewController.prototype.looseTimer = function (callback, time, thisObj) {
            if (time === void 0) { time = 1000 /* ONE_SECOND */; }
            if (thisObj === void 0) { thisObj = this; }
            var list = this._tList;
            if (list) {
                var info = jy.CallbackInfo.removeFromList(list, callback, thisObj);
                if (info) {
                    jy.TimerUtil.remove(time, info);
                    info.recycle();
                }
            }
        };
        /**
         * 添加到舞台时，自动添加定时回调
         */
        ViewController.prototype.awakeTimer = function () {
            var list = this._tList;
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var cb = list[i];
                    jy.TimerUtil.add(cb.time, cb);
                }
            }
        };
        /**
         * 从舞台移除时候，自动移除定时回调
         */
        ViewController.prototype.sleepTimer = function () {
            var list = this._tList;
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    var cb = list[i];
                    jy.TimerUtil.remove(cb.time, cb);
                }
            }
        };
        Object.defineProperty(ViewController.prototype, "isReady", {
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        ViewController.prototype.onStage = function (e) {
            this.checkInterest();
            if (!this._ready)
                return;
            this.stageChange(e.type == "addedToStage" /* ADDED_TO_STAGE */);
        };
        ViewController.prototype.stageChange = function (onStage) {
            var _interests = this._interests;
            var type, ins;
            if (onStage) {
                //加入关注的事件
                for (type in _interests) {
                    ins = _interests[type];
                    jy.on(type, ins.handler, this, ins.priority);
                }
                var _awakeCallers = this._awakeCallers;
                for (var i = 0; i < _awakeCallers.length; i++) {
                    _awakeCallers[i].call(this);
                }
                //检查timer绑定
                this.awakeTimer();
                if (this.onAwake) {
                    this.onAwake();
                }
            }
            else {
                for (type in _interests) {
                    ins = _interests[type];
                    jy.off(type, ins.handler, this);
                }
                this.sleepTimer();
                if (this.onSleep) {
                    this.onSleep();
                }
            }
        };
        ViewController.prototype.checkInterest = function () {
            if (!this.interestChecked) {
                var _awakeCallers = this._awakeCallers;
                if (!_awakeCallers) {
                    this._awakeCallers = _awakeCallers = [];
                }
                var _interests = this._interests;
                for (var type in _interests) {
                    var ins = _interests[type];
                    if (ins.trigger) {
                        _awakeCallers.pushOnce(ins.handler);
                    }
                }
                this.interestChecked = true;
            }
        };
        return ViewController;
    }(jy.FHost));
    jy.ViewController = ViewController;
    __reflect(ViewController.prototype, "jy.ViewController");
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
    function d_interest(eventType, triggerOnStage, isPrivate, priority) {
        var pKey = "_interests";
        return function (target, _, value) {
            var _interests;
            if (target.hasOwnProperty(pKey)) {
                _interests = target[pKey];
            }
            else {
                //未赋值前，先取值，可取到父级数据，避免使用  Object.getPrototypeOf(target)，ES5没此方法
                var inherit = target[pKey];
                target[pKey] = _interests = {};
                if (inherit) { //继承父级可继承的关注列表
                    for (var k in inherit) {
                        var int = inherit[k];
                        if (!int.isPri) {
                            _interests[k] = int;
                        }
                    }
                }
            }
            _interests[eventType] = { handler: value.value, priority: priority, trigger: triggerOnStage, isPri: isPrivate };
        };
    }
    jy.d_interest = d_interest;
})(jy || (jy = {}));
var jy;
(function (jy) {
    var Scroller = /** @class */ (function (_super) {
        __extends(Scroller, _super);
        function Scroller() {
            var _this = _super.call(this) || this;
            _this._scrollType = 0 /* Vertical */;
            /**鼠标每移动1像素，元件移动的像素 */
            _this.globalspeed = 1;
            /**最小的滑动速度，当前值低于此值后不再滚动 */
            _this.minEndSpeed = 0.08;
            /**速度递减速率 */
            _this.blockSpeed = 0.98;
            _this._moveSpeed = 0;
            _this._deriction = 0 /* Vertical */;
            _this._key = "y" /* Y */;
            _this._sizeKey = "height" /* Height */;
            _this._measureKey = "measuredHeight" /* Height */;
            return _this;
        }
        Object.defineProperty(Scroller.prototype, "scrollType", {
            /**
             * 滚动条方式 0：垂直，1：水平 defalut:0
             */
            get: function () {
                return this._scrollType;
            },
            /**
             * 滚动条方式 0：垂直，1：水平 defalut:0
             */
            set: function (value) {
                if (this._scrollType != value) {
                    this._scrollType = value;
                    var key = void 0, sizeKey = void 0, measureKey = void 0;
                    if (value == 0 /* Vertical */) {
                        key = "y" /* Y */;
                        sizeKey = "height" /* Height */;
                        measureKey = "measuredHeight" /* Height */;
                    }
                    else {
                        key = "x" /* X */;
                        sizeKey = "width" /* Width */;
                        measureKey = "measuredWidth" /* Width */;
                    }
                    this._sizeKey = sizeKey;
                    this._key = key;
                    this._measureKey = measureKey;
                    this.checkScrollBarView();
                }
            },
            enumerable: true,
            configurable: true
        });
        Scroller.prototype.checkScrollBarView = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            var scrollbar = this._scrollbar;
            if (!scrollbar) {
                return;
            }
            var _a = this, _key = _a._key, _sizeKey = _a._sizeKey, _scrollType = _a._scrollType;
            scrollbar.scrollType = _scrollType;
            var rect = content.scrollRect;
            scrollbar.bgSize = rect[_sizeKey];
            scrollbar[_key] = content[_key];
        };
        Scroller.prototype.onScrollBarAdded = function () {
            this._scrollbar.alpha = ~~this.alwaysShowBar;
        };
        /**
         * 绑定目标与滚动条
         *
         * @ content (需要滚动的目标)
         * @ scrollRect (显示的区域大小)
         * @ scrollbar (可选，如果不想显示滚动条可不传)
         */
        Scroller.prototype.bindObj = function (content, scrollRect, scrollbar) {
            content.scrollRect = scrollRect;
            var old = this._content;
            if (old != content) {
                if (old) {
                    old.off("enterFrame" /* ENTER_FRAME */, this.onRender, this);
                    old.off(-1999 /* Resize */, this.onResize, this);
                    jy.looseDrag(old);
                    old.off(-1090 /* DragStart */, this.onDragStart, this);
                    old.off(-1089 /* DragMove */, this.onDragMove, this);
                    old.off(-1088 /* DragEnd */, this.onDragEnd, this);
                }
                this._content = content;
                if (content) {
                    jy.bindDrag(content);
                    content.on(-1090 /* DragStart */, this.onDragStart, this);
                    content.on(-1999 /* Resize */, this.onResize, this);
                }
                if ("scroller" in content) {
                    content.scroller = this;
                }
            }
            if (scrollbar) {
                this._scrollbar = scrollbar;
                this._useScrollBar = true;
                this.checkScrollBarView();
                this.scaleBar();
                if (scrollbar.stage) {
                    this.onScrollBarAdded();
                }
                else {
                    scrollbar.on("addedToStage" /* ADDED_TO_STAGE */, this.onScrollBarAdded, this);
                }
            }
            else {
                this._useScrollBar = false;
            }
            this.scrollToHead();
        };
        /**
         * 对content绘制鼠标触发区域
         * 将会对content的graphics先进行清理
         * 然后基于content的bounds进行绘制
         *
         */
        Scroller.prototype.drawTouchArea = function (content) {
            content = content || this._content;
            if (content) {
                var g = content.graphics;
                if (g) {
                    g.clear();
                    g.beginFill(0, 0);
                    var rect = jy.Temp.EgretRectangle;
                    content.getBounds(rect);
                    g.drawRectangle(rect);
                    g.endFill();
                }
            }
        };
        Scroller.prototype.bindObj2 = function (content, scrollRect, scrollbar) {
            content.x = scrollRect.x;
            content.y = scrollRect.y;
            scrollRect.x = 0;
            scrollRect.y = 0;
            this.bindObj(content, scrollRect, scrollbar);
        };
        Scroller.prototype.onResize = function () {
            if (this._useScrollBar) {
                this.scaleBar();
            }
        };
        Scroller.prototype.onDragStart = function (e) {
            var content = this._content;
            if (!content) {
                return;
            }
            if (content[this._measureKey] < content.scrollRect[this._sizeKey]) {
                return;
            }
            this._lastTargetPos = this._startPos = this.getDragPos(e);
            this._lastMoveTime = jy.Global.now;
            this.showBar();
            content.on(-1089 /* DragMove */, this.onDragMove, this);
            content.on(-1088 /* DragEnd */, this.onDragEnd, this);
            this.dispatch(-1051 /* ScrollerDragStart */);
        };
        Scroller.prototype.getDragPos = function (e) {
            return this._scrollType == 0 /* Vertical */ ? e.stageY : e.stageX;
        };
        Scroller.prototype.onDragMove = function (e) {
            var currentPos = this.getDragPos(e);
            var sub = currentPos - this._lastTargetPos;
            this._deriction = sub > 0 ? 1 : -1;
            sub = Math.abs(sub);
            var now = jy.Global.now;
            var subTime = now - this._lastMoveTime;
            this._lastMoveTime = now;
            this._lastTargetPos = currentPos;
            this._moveSpeed = subTime > 0 ? sub / subTime : 0;
            sub = sub * this.globalspeed * this._deriction;
            this.doScrollContent(sub);
        };
        Scroller.prototype.stopTouchTween = function () {
            this._moveSpeed = 0;
            this._content.off("enterFrame" /* ENTER_FRAME */, this.onRender, this);
        };
        Scroller.prototype.onRender = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            if (this._moveSpeed == 0) {
                content.off("enterFrame" /* ENTER_FRAME */, this.onRender, this);
                this.hideBar();
                return;
            }
            var now = jy.Global.now;
            var subTime = now - this._lastFrameTime;
            var moveSpeed = this._moveSpeed;
            var sub = moveSpeed * this._deriction * subTime * this.globalspeed;
            this.doScrollContent(sub);
            this._lastFrameTime = now;
            moveSpeed *= this.blockSpeed;
            if (moveSpeed < this.minEndSpeed) {
                moveSpeed = 0;
            }
            this._moveSpeed = moveSpeed;
        };
        Scroller.prototype.onDragEnd = function (e) {
            var content = this._content;
            if (!content) {
                return;
            }
            var currentPos = this.getDragPos(e);
            var now = jy.Global.now;
            if (now - this._lastMoveTime < 150) {
                content.on("enterFrame" /* ENTER_FRAME */, this.onRender, this);
                this._lastFrameTime = this._lastMoveTime;
            }
            else {
                this.hideBar();
            }
            content.off(-1089 /* DragMove */, this.onDragMove, this);
            content.off(-1088 /* DragEnd */, this.onDragEnd, this);
            this.dispatch(-1050 /* ScrollerDragEnd */, currentPos - this._startPos);
        };
        Scroller.prototype.showBar = function () {
            if (this._useScrollBar && !this.alwaysShowBar) {
                jy.Global.getTween(this._scrollbar, null, null, true).to({ alpha: 1 }, 500);
            }
        };
        Scroller.prototype.hideBar = function () {
            if (this._useScrollBar && !this.alwaysShowBar) {
                jy.Global.getTween(this._scrollbar, null, null, true).to({ alpha: 0 }, 1000);
            }
        };
        /**
         * 执行滚动
         *
         * @ sub (滚动的距离)
         */
        Scroller.prototype.doScrollContent = function (sub) {
            var content = this._content;
            if (!content) {
                return;
            }
            var rect = content.scrollRect;
            var key = this._key;
            var old = rect[key];
            var pos = old;
            var scrollEnd = this.scrollEndPos;
            pos -= sub;
            var speed = this._moveSpeed;
            if (pos < 0) {
                pos = 0;
                speed = 0;
            }
            else if (pos > scrollEnd) {
                pos = scrollEnd;
                speed = 0;
            }
            this._moveSpeed = speed;
            if (old != pos) {
                rect[key] = pos;
                content.scrollRect = rect;
                content.dispatch(-1051 /* SCROLL_POSITION_CHANGE */);
            }
            this.doMoveScrollBar(sub);
        };
        Scroller.prototype.doMoveScrollBar = function (sub) {
            var scrollbar = this._scrollbar;
            if (!scrollbar) {
                return;
            }
            var bar = scrollbar.bar;
            var subPos = sub / this._piexlDistance;
            var key = this._key;
            var barPos = bar[key] - subPos;
            if (barPos <= 0) {
                barPos = 0;
            }
            else {
                var delta = scrollbar.bgSize - scrollbar.barSize;
                if (barPos >= delta) {
                    barPos = delta;
                }
            }
            bar[key] = barPos;
        };
        /**
         * 移动到指定位置
         *
         * @ pos (位置)
         */
        Scroller.prototype.scrollTo = function (pos) {
            if (pos <= 0) {
                this.scrollToHead();
            }
            else if (pos >= this.scrollEndPos) {
                this.scrollToEnd();
            }
            else {
                var curpos = this._content.scrollRect[this._key];
                this.doScrollContent(pos - curpos);
            }
        };
        /**移动至头 */
        Scroller.prototype.scrollToHead = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            if (this._moveSpeed > 0) {
                this._moveSpeed = 0;
                content.off("enterFrame" /* ENTER_FRAME */, this.onRender, this);
            }
            var rect = content.scrollRect;
            var scrollbar = this._scrollbar;
            var bar;
            if (scrollbar) {
                bar = scrollbar.bar;
            }
            var key = this._key;
            rect[key] = 0;
            if (bar) {
                bar[key] = 0;
            }
            content.scrollRect = rect;
        };
        /**移动至尾 */
        Scroller.prototype.scrollToEnd = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            var rect = content.scrollRect;
            var end = this.scrollEndPos;
            var scrollbar = this._scrollbar;
            var bar, delta;
            if (scrollbar) {
                delta = scrollbar.bgSize - scrollbar.barSize;
                bar = scrollbar.bar;
            }
            var key = this._key;
            rect[key] = end;
            if (bar) {
                bar[key] = delta;
            }
            content.scrollRect = rect;
        };
        Scroller.prototype.scaleBar = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            var contentSize = content[this._measureKey];
            var scrollbar = this._scrollbar;
            var bgSize = scrollbar.bgSize;
            var scale = bgSize / contentSize;
            if (scale >= 1) {
                scale = 1;
            }
            scrollbar.barSize = bgSize * scale;
            this._piexlDistance = contentSize / bgSize;
            this.checkAndResetBarPos();
        };
        Object.defineProperty(Scroller.prototype, "scrollEndPos", {
            /**
             * 获取滚动到最后的起始点
             *
             * @readonly
             * @protected
             */
            get: function () {
                var content = this._content;
                if (!content) {
                    return 0;
                }
                var rect = content.scrollRect;
                var contentSize = content[this._measureKey];
                var scrollSize = rect[this._sizeKey];
                return contentSize - scrollSize;
            },
            enumerable: true,
            configurable: true
        });
        Scroller.prototype.checkAndResetBarPos = function () {
            var rect = this._content.scrollRect;
            var scrollbar = this._scrollbar;
            var bar = scrollbar.bar;
            var scrollEnd = this.scrollEndPos;
            var key = this._key;
            var tmp = rect[key] / scrollEnd;
            if (tmp <= 0) {
                tmp = 0;
            }
            else {
                tmp = scrollbar.bgSize * tmp - scrollbar.barSize;
            }
            bar[key] = tmp;
        };
        return Scroller;
    }(egret.EventDispatcher));
    jy.Scroller = Scroller;
    __reflect(Scroller.prototype, "jy.Scroller");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var AbsPageList = /** @class */ (function (_super) {
        __extends(AbsPageList, _super);
        function AbsPageList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._list = [];
            _this._selectedIndex = -1;
            _this._dataLen = 0;
            return _this;
        }
        Object.defineProperty(AbsPageList.prototype, "dataLen", {
            /**
             * 获取数据长度
             *
             * @readonly
             */
            get: function () {
                return this._dataLen;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbsPageList.prototype, "data", {
            /**
             * 获取数据集
             *
             * @readonly
             */
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 渲染指定位置的render
         *
         * @ private
         * @ param {number} start (起始索引)
         * @ param {number} end (结束索引)
         */
        AbsPageList.prototype.doRender = function (start, end) {
            var render;
            var data = this._data;
            end == undefined && (end = start);
            for (var i = start; i <= end; i++) {
                render = this._get(i);
                if (!render) {
                    continue;
                }
                if (render.inited === false) {
                    if (render.bindComponent) {
                        render.bindComponent();
                    }
                    render.inited = true;
                }
                var tmp = render.data;
                if (!tmp || tmp != data[i] || render.dataChange) {
                    render.data = data[i];
                    if (render.handleView) {
                        render.handleView();
                    }
                    if (render.dataChange) {
                        render.dataChange = false;
                    }
                }
            }
        };
        Object.defineProperty(AbsPageList.prototype, "selectedIndex", {
            get: function () {
                return this._selectedIndex;
            },
            set: function (value) {
                if (this._selectedIndex == value && value >= 0)
                    return;
                if (value < 0) {
                    var selectedItem = this._selectedItem;
                    if (selectedItem) {
                        selectedItem.selected = false;
                        this._selectedItem = undefined;
                    }
                    this._selectedIndex = value;
                    return;
                }
                this.$setSelectedIndex(value);
            },
            enumerable: true,
            configurable: true
        });
        AbsPageList.prototype.$setSelectedIndex = function (value) {
            var render;
            var renderList = this._list;
            var len_1 = renderList.length - 1;
            if (value > len_1) { //一般PageList控件，索引超过长度，取最后一个
                value = len_1;
            }
            render = this._list[value];
            this.changeRender(render, value);
        };
        Object.defineProperty(AbsPageList.prototype, "selectedData", {
            /**
             * 获取选中对象的数据
             */
            get: function () {
                var item = this.selectedItem;
                return item && item.data;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * 根据索引获得视图
         * @param {number} idx
         * @returns
         */
        AbsPageList.prototype.getItemAt = function (idx) {
            idx = idx >>> 0;
            return this._list[idx];
        };
        AbsPageList.prototype.selectItemByData = function (key, value, _useTween) {
            var _this = this;
            if (_useTween === void 0) { _useTween = false; }
            this.find(function (dat, _, idx) {
                if (dat && (key in dat) && dat[key] == value) {
                    _this.selectedIndex = idx;
                    return true;
                }
            });
            return this;
        };
        /**
         * 遍历列表
         *
         * @param {{(data:T,render:R,idx:number,...args)}} handle
         * @param {any} otherParams
         */
        AbsPageList.prototype.forEach = function (handle) {
            var otherParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                otherParams[_i - 1] = arguments[_i];
            }
            var datas = this._data;
            var renders = this._list;
            var len = this._dataLen;
            for (var i = 0; i < len; i++) {
                var data = datas[i];
                var render = renders[i];
                handle.apply(void 0, [data, render, i].concat(otherParams));
            }
            return this;
        };
        /**
         * 找到第一个符合要求的render
         *
         * @param {{(data:T,render:R,idx:number,...args):boolean}} handle
         * @param {any} otherParams
         * @returns
         */
        AbsPageList.prototype.find = function (handle) {
            var otherParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                otherParams[_i - 1] = arguments[_i];
            }
            var datas = this._data;
            var renders = this._list;
            var len = this._dataLen;
            for (var i = 0; i < len; i++) {
                var data = datas[i];
                var render = renders[i];
                if (handle.apply(void 0, [data, render, i].concat(otherParams))) {
                    return render;
                }
            }
        };
        Object.defineProperty(AbsPageList.prototype, "selectedItem", {
            get: function () {
                return this._selectedItem;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据key value获取item,将item的data重新赋值为data
         *
         * @param {string} key (description)
         * @param {*} value (description)
         * @param {T} data (description)
         */
        AbsPageList.prototype.updateByKey = function (key, value, data) {
            var _this = this;
            this.find(function (dat, render, idx) {
                if (dat && (key in dat) && dat[key] == value) {
                    _this.updateByIdx(idx, data === undefined ? dat : data);
                    return true;
                }
            });
        };
        AbsPageList.prototype.onTouchItem = function (e) {
            var render = e.target;
            this.changeRender(render);
        };
        AbsPageList.prototype.changeRender = function (render, index) {
            var old = this._selectedItem;
            if (old != render) {
                index == undefined && (index = this._list.indexOf(render));
                if (old) {
                    old.selected = false;
                }
                this._selectedItem = render;
                this._selectedIndex = index;
                render.selected = true;
                this.onChange();
                this.dispatch(-1052 /* ITEM_SELECTED */);
            }
        };
        AbsPageList.prototype.getAllItems = function () {
            return this._list;
        };
        Object.defineProperty(AbsPageList.prototype, "length", {
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 让所有在舞台上的render重新刷新一次数据
         *
         *
         * @memberOf PageList
         */
        AbsPageList.prototype.refresh = function () {
            var data = this._data;
            if (data) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    this.refreshAt(i);
                }
            }
            return this;
        };
        /**
         * 根据index使某个在舞台上的render刷新
         *
         * @param {number}  idx
         * @param {boolean} [force]     是否强制执行setData和handleView
         * @memberOf PageList
         */
        AbsPageList.prototype.refreshAt = function (idx, force) {
            var renderer = this._get(idx);
            if (force || renderer.view.stage) {
                renderer.data = this._data[idx];
                if (typeof renderer.handleView === "function") {
                    renderer.handleView();
                }
                if (renderer.dataChange) {
                    renderer.dataChange = false;
                }
            }
            return this;
        };
        /**
         * render进行切换
         *
         * @protected
         */
        AbsPageList.prototype.onChange = function () { };
        return AbsPageList;
    }(egret.EventDispatcher));
    jy.AbsPageList = AbsPageList;
    __reflect(AbsPageList.prototype, "jy.AbsPageList");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 位图的创建器
     * @author 3tion
     *
     */
    var BitmapCreator = /** @class */ (function (_super) {
        __extends(BitmapCreator, _super);
        function BitmapCreator(value) {
            var _this = _super.call(this) || this;
            _this._suiData = value;
            return _this;
        }
        BitmapCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            if (typeof data === "number") {
                if (data < 0) {
                    this.isjpg = true;
                }
                this._createT = function () {
                    var bmp = new egret.Bitmap;
                    bmp.texture = _this._suiData.getTexture(data);
                    _this.bindEvent(bmp);
                    return bmp;
                };
            }
        };
        BitmapCreator.prototype.bindEvent = function (bmp) {
            bmp.on("addedToStage" /* ADDED_TO_STAGE */, this.awake, this);
            bmp.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.sleep, this);
        };
        BitmapCreator.prototype.awake = function (e) {
            var suiData = this._suiData;
            if (suiData) {
                var bmp = e.currentTarget;
                suiData.checkRefreshBmp(bmp, this.isjpg);
            }
        };
        BitmapCreator.prototype.sleep = function () {
            var suiData = this._suiData;
            if (suiData) {
                var bmd = this.isjpg ? suiData.jpgbmd : suiData.pngbmd;
                bmd.using--;
                bmd.lastUseTime = jy.Global.now;
            }
        };
        return BitmapCreator;
    }(jy.BaseCreator));
    jy.BitmapCreator = BitmapCreator;
    __reflect(BitmapCreator.prototype, "jy.BitmapCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
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
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.call(this) || this;
            _this._label = "";
            jy.TouchDown.bind(_this);
            return _this;
        }
        Button.prototype.bindChildren = function () {
            if (this.txtLabel) {
                this.addChild(this.txtLabel);
            }
            this.refresh(true);
        };
        Object.defineProperty(Button.prototype, "label", {
            /**
             * 获取按钮上的标签
             */
            get: function () {
                return this._label;
            },
            /**
             * 设置按钮上的标签
             */
            set: function (value) {
                if (this._label != value) {
                    this.$setLabel(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.$setLabel = function (value) {
            var tf = this.txtLabel;
            if (tf) {
                tf.setHtmlText(value);
                this._label = value;
            }
        };
        Button.prototype.$setEnabled = function (value) {
            _super.prototype.$setEnabled.call(this, value);
            this.refresh();
        };
        Object.defineProperty(Button.prototype, "selected", {
            /**
             * 获取当前按钮选中状态
             */
            get: function () {
                return this._selected;
            },
            /**
             * 设置选中
             */
            set: function (value) {
                if (this._selected != value) {
                    this.$setSelected(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.$setSelected = function (value) {
            this._selected = value;
            this.refresh();
        };
        Button.prototype.refresh = function (changed) {
            var frame = this.$getBtnFrame();
            var bmp = this.bitmaps[frame];
            var old = this._currentBmp;
            if (!bmp) {
                bmp = this.bitmaps[0];
            }
            if (old != bmp) {
                changed = true;
                jy.removeDisplay(old);
                this._currentBmp = bmp;
            }
            if (changed) {
                if (this.floor) {
                    _super.prototype.addChild.call(this, this.floor);
                }
                if (bmp) {
                    _super.prototype.addChild.call(this, bmp);
                }
                if (this.txtLabel) {
                    _super.prototype.addChild.call(this, this.txtLabel);
                }
                if (this.ceil) {
                    _super.prototype.addChild.call(this, this.ceil);
                }
                if (this._children) {
                    _super.prototype.addChild.call(this, this._children);
                }
            }
        };
        /**
         * 获取按钮的帧数
         *
         * @returns
         */
        Button.prototype.$getBtnFrame = function () {
            return +!this._enabled << 1 | (+this._selected);
        };
        /**
         * 绑定TOUCH_TAP的回调
         *
         * @template T
         * @param {{ (this: T, e?: egret.Event): any }} handler
         * @param {T} [thisObject]
         * @param {number} [priority]
         * @param {boolean} [useCapture]
         */
        Button.prototype.bindTouch = function (handler, thisObject, priority, useCapture) {
            this.on("touchTap" /* TOUCH_TAP */, handler, thisObject, useCapture, priority);
        };
        /**
         * 解除TOUCH_TAP的回调的绑定
         *
         * @param {Function} handler
         * @param {*} thisObject
         * @param {boolean} [useCapture]
         *
         * @memberOf Button
         */
        Button.prototype.looseTouch = function (handler, thisObject, useCapture) {
            this.off("touchTap" /* TOUCH_TAP */, handler, thisObject, useCapture);
        };
        Button.prototype.addChild = function (child) {
            var children = this._children;
            if (!children) {
                this._children = children = new egret.DisplayObjectContainer;
                this.refresh(true);
            }
            children.addChild(child);
            return child;
        };
        Button.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            jy.TouchDown.loose(this);
        };
        return Button;
    }(jy.Component));
    jy.Button = Button;
    __reflect(Button.prototype, "jy.Button", ["jy.IButton", "jy.Component", "jy.ComponentWithEnable"]);
    /**
     * 按钮创建器
     * @author 3tion
     *
     */
    var ButtonCreator = /** @class */ (function (_super) {
        __extends(ButtonCreator, _super);
        function ButtonCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ButtonCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            var tc;
            if (data[0]) {
                tc = new jy.TextFieldCreator();
                tc.setBaseData(data[0][1]);
                tc.parseSelfData(data[0][2]);
            }
            var bcs = [];
            for (var i = 1; i < 5; i++) {
                var dat = data[i];
                if (dat) {
                    bcs[i - 1] = dat;
                }
            }
            this._createT = function () {
                var btn = new Button();
                if (tc) {
                    btn.txtLabel = tc.get();
                }
                var bmps = [];
                for (var i = 0; i < 4; i++) {
                    if (bcs[i]) {
                        bmps[i] = _this.createElement(bcs[i]);
                    }
                }
                if (!bmps[1]) { //启用 选中帧 没有图片
                    bmps[1] = bmps[0];
                }
                var useDisableFilter = false;
                if (!bmps[2]) { //禁用 未选中帧 没有图片
                    bmps[2] = bmps[0];
                    useDisableFilter = true;
                }
                if (!bmps[3]) { //禁用 选中帧 没有图片
                    bmps[3] = bmps[2];
                }
                btn.bitmaps = bmps;
                if (data[5]) {
                    btn.floor = _this.createElement(data[5]);
                    useDisableFilter = true;
                }
                if (data[6]) {
                    btn.ceil = _this.createElement(data[6]);
                    useDisableFilter = true;
                }
                btn.useDisFilter = useDisableFilter;
                return btn;
            };
        };
        return ButtonCreator;
    }(jy.BaseCreator));
    jy.ButtonCreator = ButtonCreator;
    __reflect(ButtonCreator.prototype, "jy.ButtonCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var LayoutContainer = /** @class */ (function () {
        function LayoutContainer(basis, host) {
            this.$layoutBins = new jy.ArraySet();
            host = host || new egret.Sprite();
            this._host = host;
            this._basis = basis;
            jy.on(-1998 /* ReLayout */, this.onResize, this);
            host.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.offStage, this);
            host.on("addedToStage" /* ADDED_TO_STAGE */, this.onStage, this);
            if (host.stage) {
                this.onStage();
            }
        }
        /**
         * 重置尺寸
         *
         * @param {Size} basis
         *
         * @memberOf LayoutContainer
         */
        LayoutContainer.prototype.resetBasis = function (basis) {
            this._basis = basis;
        };
        LayoutContainer.prototype.onStage = function () {
            this._host.stage.on("resize" /* RESIZE */, this.onResize, this);
            this.onResize();
        };
        LayoutContainer.prototype.offStage = function () {
            egret.sys.$TempStage.off("resize" /* RESIZE */, this.onResize, this);
        };
        Object.defineProperty(LayoutContainer.prototype, "view", {
            get: function () {
                return this._host;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 移除视图
         *
         * @param {egret.DisplayObject} dis
         * @returns
         */
        LayoutContainer.prototype.remove = function (dis) {
            dis.$layoutHost = undefined;
            return this.$layoutBins.delete(dis.hashCode);
        };
        LayoutContainer.prototype.addLayout = function (dis, type, size, hoffset, voffset, outerV, outerH, hide) {
            if (type === void 0) { type = 5 /* TOP_LEFT */; }
            var list = this.$layoutBins;
            size = size || dis;
            var key = dis.hashCode;
            if (list.get(key)) {
                return;
            }
            dis.$layoutHost = this;
            var bin = { dis: dis, type: type, hoffset: hoffset, voffset: voffset, outerV: outerV, outerH: outerH, size: size };
            list.set(key, bin);
            if (hide) {
                jy.removeDisplay(dis);
            }
            else {
                this._host.addChild(dis);
            }
            var stage = dis.stage;
            if (stage) {
                this.binLayout(bin);
            }
            //不管在不在舞台上，都应该监听
            dis.on("addedToStage" /* ADDED_TO_STAGE */, this.onAdded, this);
        };
        LayoutContainer.prototype.onAdded = function (e) {
            var dis = e.currentTarget;
            var host = dis.$layoutHost;
            if (host) {
                var set = host.$layoutBins;
                if (set) {
                    var bin = set.get(dis.hashCode);
                    if (bin) {
                        this.binLayout(bin);
                    }
                }
            }
        };
        LayoutContainer.prototype.binLayout = function (bin) {
            var dis = bin.dis, type = bin.type, hoffset = bin.hoffset, voffset = bin.voffset, outerV = bin.outerV, outerH = bin.outerH, size = bin.size;
            var pt = jy.Temp.SharedPoint1;
            jy.Layout.getLayoutPos(size.width, size.height, this._lw, this._lh, type, pt, hoffset, voffset, outerV, outerH);
            dis.x = pt.x;
            dis.y = pt.y;
        };
        LayoutContainer.prototype.$doLayout = function () {
            jy.Global.callLater(this.layoutAll, 0, this);
        };
        LayoutContainer.prototype.layoutAll = function () {
            var set = this.$layoutBins;
            if (set) {
                var list = set.rawList;
                for (var i = 0, len = list.length; i < len;) {
                    this.binLayout(list[i++]);
                }
            }
        };
        LayoutContainer.MIN = Object.freeze({ width: 0, height: 0 });
        return LayoutContainer;
    }());
    jy.LayoutContainer = LayoutContainer;
    __reflect(LayoutContainer.prototype, "jy.LayoutContainer");
    /**
     * @param sw 舞台宽度
     * @param sh 舞台高度
     * @param bw 要调整的可视对象宽度
     * @param bh 要调整的可视对象高度
     * @param {boolean} [isWide=false] fixedNarrow 还是 fixedWide，默认按fixedNarrow布局
     */
    function getFixedLayout(sw, sh, bw, bh, isWide) {
        var dw = sw, dh = sh;
        var scaleX = sw / bw;
        var scaleY = sh / bh;
        var lw = bw;
        var lh = bh;
        var scale;
        if (scaleX < scaleY == !isWide) {
            scale = scaleX;
            dh = scaleX * bh;
            lh = bh * sh / dh;
        }
        else {
            scale = scaleY;
            dw = scaleY * bw;
            lw = bw * sw / dw;
        }
        return { dw: dw, dh: dh, scale: scale, lw: lw, lh: lh };
    }
    jy.getFixedLayout = getFixedLayout;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @class MenuBaseRender
     * @extends {egret.Sprite}
     * @template T
     */
    var MenuBaseRender = /** @class */ (function () {
        function MenuBaseRender() {
        }
        MenuBaseRender.prototype.itemClick = function () {
            var data = this._data;
            if (data) {
                var callBack = data.callBack;
                if (callBack) {
                    callBack.call(jy.Menu.currentShow, data);
                }
            }
        };
        MenuBaseRender.prototype.getSize = function () {
            return this._size;
        };
        Object.defineProperty(MenuBaseRender.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this.$setData(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 只允许子类重写
         * @protected
         */
        MenuBaseRender.prototype.$setData = function (val) {
            this._data = val;
        };
        Object.defineProperty(MenuBaseRender.prototype, "skin", {
            get: function () {
                return this._skin;
            },
            set: function (value) {
                if (value != this._skin) {
                    this.$setSkin(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        MenuBaseRender.prototype.$setSkin = function (value) {
            this._skin = value;
            this._size = value.getBounds();
            value.on("touchTap" /* TOUCH_TAP */, this.itemClick, this);
            this.bindComponent();
        };
        MenuBaseRender.prototype.bindComponent = function () {
        };
        Object.defineProperty(MenuBaseRender.prototype, "view", {
            get: function () {
                return this._skin;
            },
            enumerable: true,
            configurable: true
        });
        return MenuBaseRender;
    }());
    jy.MenuBaseRender = MenuBaseRender;
    __reflect(MenuBaseRender.prototype, "jy.MenuBaseRender");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 单选按钮组
     */
    var Group = /** @class */ (function (_super) {
        __extends(Group, _super);
        function Group() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._list = [];
            _this._selectedIndex = -1;
            return _this;
        }
        /**
         * 添加单个组件
         *
         * @param {IGroupItem} item
         */
        Group.prototype.addItem = function (item) {
            if (item) {
                this._list.pushOnce(item);
                item.on("touchTap" /* TOUCH_TAP */, this.touchHandler, this);
            }
        };
        Group.prototype.getAllItems = function () {
            return this._list;
        };
        Object.defineProperty(Group.prototype, "length", {
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取 IGroupItem
         *
         * @param {number} idx
         * @returns
         */
        Group.prototype.getItemAt = function (idx) {
            idx = idx >>> 0;
            return this._list[idx];
        };
        Group.prototype.removeAt = function (idx) {
            idx = idx >>> 0;
            var list = this._list;
            if (idx < list.length) {
                var item = list[idx];
                this.removeItem(item);
                return item;
            }
        };
        Group.prototype.touchHandler = function (e) {
            this.$setSelectedItem(e.target);
        };
        /**
         * 移除单个组件
         *
         * @param {IGroupItem} item
         */
        Group.prototype.removeItem = function (item) {
            if (item) {
                if (this._selectedItem == item) {
                    this.$setSelectedItem();
                }
                this._list.remove(item);
                item.off("touchTap" /* TOUCH_TAP */, this.touchHandler, this);
                return item;
            }
        };
        Group.prototype.addItems = function () {
            for (var i = 0; i < arguments.length; i++) {
                var item = arguments[i];
                this.addItem(item);
            }
        };
        Object.defineProperty(Group.prototype, "selectedItem", {
            get: function () {
                return this._selectedItem;
            },
            /**
             * 设置选中组件
             */
            set: function (item) {
                this.$setSelectedItem(item);
            },
            enumerable: true,
            configurable: true
        });
        Group.prototype.$setSelectedItem = function (item) {
            var _selectedItem = this._selectedItem;
            if (_selectedItem != item) {
                if (_selectedItem) {
                    _selectedItem.selected = false;
                }
                var idx = -1;
                if (item) {
                    idx = this._list.indexOf(item);
                    if (~idx) {
                        item.selected = true;
                    }
                    else {
                        item = undefined;
                        jy.ThrowError("Group 设置的组件未添加到该组");
                    }
                }
                this._selectedItem = item;
                this._selectedIndex = idx;
                return this.dispatch(-1020 /* GROUP_CHANGE */);
            }
        };
        Object.defineProperty(Group.prototype, "selectedIndex", {
            get: function () {
                return this._selectedIndex;
            },
            /**
             * 设置选中索引
             */
            set: function (idx) {
                this.$setSelectedIndex(idx);
            },
            enumerable: true,
            configurable: true
        });
        Group.prototype.$setSelectedIndex = function (idx) {
            if (this._selectedIndex != idx) {
                var item = idx >= 0 ? this._list[idx] : undefined;
                this.$setSelectedItem(item);
            }
        };
        Group.prototype.clear = function () {
            var list = this._list;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                item.off("touchTap" /* TOUCH_TAP */, this.touchHandler, this);
            }
            list.length = 0;
            this._selectedIndex = -1;
        };
        Group.prototype.onRecycle = function () {
            this.clear();
        };
        return Group;
    }(egret.EventDispatcher));
    jy.Group = Group;
    __reflect(Group.prototype, "jy.Group");
})(jy || (jy = {}));
var jy;
(function (jy) {
    function call(info, ars) {
        var args = [];
        var i = 0;
        if (ars) {
            for (; i < ars.length; i++) {
                args[i] = ars[i];
            }
        }
        var argus = info.args;
        if (argus) {
            for (var j = 0; j < argus.length; j++) {
                args[i++] = argus[j];
            }
        }
        var callback = info.callback;
        if (callback != undefined) {
            try {
                return callback.apply(info.thisObj, args);
            }
            catch (e) {
                if (true) {
                    var debug = info["_debug"];
                    jy.ThrowError("CallbackInfo\u6267\u884C\u62A5\u9519\uFF0C\u8D4B\u503C\u5185\u5BB9\uFF1A============Function=============:\n" + debug.handle + "\n}==============Stack============:\n" + debug.stack + "\n\u5F53\u524D\u5806\u6808\uFF1A" + e.stack);
                    console.log.apply(console, ["参数列表"].concat(args));
                }
            }
        }
        else if (true) {
            var debug = info["_debug"];
            jy.ThrowError("\u5BF9\u5DF2\u56DE\u6536\u7684CallbackInfo\u6267\u884C\u4E86\u56DE\u8C03\uFF0C\u6700\u540E\u4E00\u6B21\u8D4B\u503C\u5185\u5BB9\uFF1A============Function=============:\n" + debug.handle + "\n==============Stack============:\n" + debug.stack + "\n\u5F53\u524D\u5806\u6808\uFF1A" + new Error().stack);
        }
    }
    /**
     * 回调信息，用于存储回调数据
     * @author 3tion
     *
     */
    var CallbackInfo = /** @class */ (function () {
        function CallbackInfo() {
            this.doRecycle = true;
            if (true) {
                var data = { enumerable: true, configurable: true };
                data.get = function () {
                    return this._cb;
                };
                data.set = function (value) {
                    if (this._cb != value) {
                        this._cb = value;
                        if (value != undefined) {
                            this._debug = { handle: value.toString(), stack: new Error().stack };
                        }
                    }
                };
                Object.defineProperty(this, "callback", data);
            }
        }
        CallbackInfo.prototype.init = function (callback, thisObj, args) {
            this.callback = callback;
            this.args = args;
            this.thisObj = thisObj;
        };
        /**
         * 检查回调是否一致，只检查参数和this对象,不检查参数
         */
        CallbackInfo.prototype.checkHandle = function (callback, thisObj) {
            return this.callback === callback && this.thisObj == thisObj /* 允许null==undefined */;
        };
        /**
         * 执行回调
         * 回调函数，将以args作为参数，callback作为函数执行
         * @param {boolean} [doRecycle] 是否回收CallbackInfo，默认为true
         */
        CallbackInfo.prototype.execute = function (doRecycle) {
            var result = call(this);
            if (doRecycle == undefined) {
                doRecycle = this.doRecycle;
            }
            if (doRecycle) {
                this.recycle();
            }
            return result;
        };
        CallbackInfo.prototype.call = function () {
            return call(this, arguments);
        };
        CallbackInfo.prototype.callAndRecycle = function () {
            var result = call(this, arguments);
            this.recycle();
            return result;
        };
        CallbackInfo.prototype.onRecycle = function () {
            this.callback = undefined;
            this.args = undefined;
            this.thisObj = undefined;
            this.doRecycle = true;
        };
        /**
         * 获取CallbackInfo的实例
         */
        CallbackInfo.get = function (callback, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var info = jy.recyclable(CallbackInfo);
            info.init(callback, thisObj, args);
            return info;
        };
        /**
         * 加入到数组
         * 检查是否有this和handle相同的callback，如果有，就用新的参数替换旧参数
         * @param list
         * @param handle
         * @param args
         * @param thisObj
         */
        CallbackInfo.addToList = function (list, handle, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            //检查是否有this和handle相同的callback
            var callback;
            for (var i = 0, len = list.length; i < len; i++) {
                callback = list[i];
                if (callback.checkHandle(handle, thisObj)) {
                    callback.args = args;
                    return callback;
                }
            }
            callback = this.get.apply(this, [handle, thisObj].concat(args));
            list.push(callback);
            return callback;
        };
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
        CallbackInfo.removeFromList = function (list, handle, thisObj) {
            var j = -1;
            var info;
            for (var i = 0, len = list.length; i < len; i++) {
                var callback = list[i];
                if (callback.checkHandle(handle, thisObj)) {
                    j = i;
                    info = callback;
                    break;
                }
            }
            if (info) {
                list.splice(j, 1);
            }
            return info;
        };
        return CallbackInfo;
    }());
    jy.CallbackInfo = CallbackInfo;
    __reflect(CallbackInfo.prototype, "jy.CallbackInfo", ["jy.IRecyclable"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    var ClassFactory = /** @class */ (function () {
        /**
         * @param {Creator<T>} creator
         * @param {Partial<T>} [props] 属性模板
         * @memberof ClassFactory
         */
        function ClassFactory(creator, props) {
            this._creator = creator;
            this._props = props;
        }
        /**
         * 获取实例
         *
         * @returns
         */
        ClassFactory.prototype.get = function () {
            var ins = new this._creator();
            var p = this._props;
            for (var key in p) {
                ins[key] = p[key];
            }
            return ins;
        };
        return ClassFactory;
    }());
    jy.ClassFactory = ClassFactory;
    __reflect(ClassFactory.prototype, "jy.ClassFactory");
    /**
     * 回收池
     * @author 3tion
     *
     */
    var RecyclablePool = /** @class */ (function () {
        function RecyclablePool(TCreator, max) {
            if (max === void 0) { max = 100; }
            this._pool = [];
            this._max = max;
            this._creator = TCreator;
        }
        RecyclablePool.prototype.get = function () {
            var ins;
            var pool = this._pool;
            if (pool.length) {
                ins = pool.pop();
            }
            else {
                ins = new this._creator();
                if (true) {
                    Object.defineProperty(ins, "_insid" /* DebugIDPropertyKey */, {
                        value: 0,
                        enumerable: false,
                        writable: true
                    });
                }
            }
            if (typeof ins.onSpawn === "function") {
                ins.onSpawn();
            }
            if (true) {
                ins["_insid" /* DebugIDPropertyKey */] = _recid++;
            }
            return ins;
        };
        /**
         * 回收
         */
        RecyclablePool.prototype.recycle = function (t) {
            var pool = this._pool;
            var idx = pool.indexOf(t);
            if (!~idx) { //不在池中才进行回收
                if (typeof t.onRecycle === "function") {
                    t.onRecycle();
                }
                if (pool.length < this._max) {
                    pool.push(t);
                }
            }
        };
        return RecyclablePool;
    }());
    jy.RecyclablePool = RecyclablePool;
    __reflect(RecyclablePool.prototype, "jy.RecyclablePool");
    if (true) {
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
    function recyclable(clazz, addInstanceRecycle) {
        var pool;
        if (clazz.hasOwnProperty("_pool")) {
            pool = clazz._pool;
        }
        if (!pool) {
            if (addInstanceRecycle) {
                pool = new RecyclablePool(function () {
                    var ins = new clazz();
                    ins.recycle = recycle;
                    return ins;
                });
            }
            else {
                pool = new RecyclablePool(clazz);
                var pt = clazz.prototype;
                if (!pt.hasOwnProperty("recycle")) {
                    pt.recycle = recycle;
                }
            }
            Object.defineProperty(clazz, "_pool", {
                value: pool
            });
        }
        return pool.get();
        function recycle() {
            pool.recycle(this);
        }
    }
    jy.recyclable = recyclable;
    recyclable.recycleList =
        /**
         * 按指定长度，回收Recycleable的数组
         * @param list 要被处理的数组
         * @param len 如果指定的`len`超过数组长度，数组不做任何处理
         */
        function (list, len) {
            var i = len;
            var lLen = list.length;
            if (len < lLen) {
                while (i < list.length) {
                    var recyclable_1 = list[i++];
                    if (recyclable_1) {
                        recyclable_1.recycle();
                    }
                }
                list.length = len;
            }
        };
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    function singleton(clazz) {
        var instance;
        if (clazz.hasOwnProperty("_instance")) {
            instance = clazz._instance;
        }
        if (!instance) {
            instance = new clazz;
            Object.defineProperty(clazz, "_instance", {
                value: instance
            });
        }
        return instance;
    }
    jy.singleton = singleton;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 绑定属性名，当属性值发生改变时，可自动对外抛eventType事件
     *
     * @export
     * @param {Key} eventType     事件类型
     * @param {boolean} [selfDispatch]          默认false，使用Facade抛事件，event.data为实例本身
     *                                          如果为true，需要为EventDispatcher的实现，会使用自身抛事件
     * @returns
     */
    function d_fire(eventType, selfDispatch) {
        return function (host, property) {
            var data = host.getPropertyDescriptor(property);
            if (data && !data.configurable) {
                return true && jy.ThrowError("\u65E0\u6CD5\u7ED1\u5B9A" + host + "," + property + ",\u8BE5\u5C5E\u6027\u4E0D\u53EF\u8BBE\u7F6E");
            }
            var key = "$d_fire_e$" + property;
            var events = host[key];
            var needSet;
            if (!events) {
                host[key] = events = [];
                needSet = true;
            }
            events.push(eventType, selfDispatch);
            if (needSet) {
                if (data && data.set && data.get) {
                    var orgSet_1 = data.set;
                    data.set = function (value) {
                        if (this[property] != value) {
                            orgSet_1.call(this, value);
                            fire(this, events);
                        }
                    };
                }
                else if (!data || (!data.get && !data.set)) {
                    var newProp_1 = "$d_fire_p$" + property;
                    host[newProp_1] = data && data.value;
                    data = { enumerable: true, configurable: true };
                    data.get = function () {
                        return this[newProp_1];
                    };
                    data.set = function (value) {
                        if (this[newProp_1] != value) {
                            this[newProp_1] = value;
                            fire(this, events);
                        }
                    };
                }
                else {
                    return true && jy.ThrowError("\u65E0\u6CD5\u7ED1\u5B9A" + host + "," + property);
                }
                Object.defineProperty(host, property, data);
            }
        };
        function fire(host, events) {
            for (var i = 0; i < events.length; i += 2) {
                var eventType_1 = events[i];
                if (events[i + 1]) {
                    if (typeof host.dispatch === "function") {
                        host.dispatch(eventType_1);
                    }
                }
                else {
                    jy.dispatch(eventType_1, host);
                }
            }
        }
    }
    jy.d_fire = d_fire;
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
    function d_memoize(target, key, descriptor) {
        var fnKey = null;
        var fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn) {
            throw new Error('not supported');
        }
        var memoizeKey = "$memoize$" + key;
        descriptor[fnKey] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.hasOwnProperty(memoizeKey)) {
                Object.defineProperty(this, memoizeKey, {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: fn.apply(this, args)
                });
            }
            return this[memoizeKey];
        };
    }
    jy.d_memoize = d_memoize;
})(jy || (jy = {}));
var jy;
(function (jy) {
    function isPowerOfTwo(n) {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }
    function getAngle(getParameter) {
        var _a = getParameter(33902 /* ALIASED_LINE_WIDTH_RANGE */), min = _a[0], max = _a[1];
        // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
        var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
            (getParameter(7937 /* RENDERER */) !== 'Internet Explorer') &&
            (getParameter(7937 /* RENDERER */) !== 'Microsoft Edge') &&
            (min === 0 && max === 1);
        if (angle) {
            // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
            // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
            //
            // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
            // due to driver bugs, etc.
            if (isPowerOfTwo(getParameter(36347 /* MAX_VERTEX_UNIFORM_VECTORS */)) && isPowerOfTwo(getParameter(36349 /* MAX_FRAGMENT_UNIFORM_VECTORS */))) {
                return 2 /* D3D11 */;
            }
            else {
                return 1 /* D3D9 */;
            }
        }
        return 0 /* No */;
    }
    function getMaxAnisotropy(g) {
        var e = g.getExtension('EXT_texture_filter_anisotropic')
            || g.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
            || g.getExtension('MOZ_EXT_texture_filter_anisotropic');
        if (e) {
            var max = g.getParameter(34047 /* MAX_TEXTURE_MAX_ANISOTROPY_EXT */);
            if (max === 0) {
                max = 2;
            }
            return max;
        }
    }
    function getMaxDrawBuffers(g) {
        var maxDrawBuffers = 1;
        var ext = g.getExtension("WEBGL_draw_buffers");
        if (ext != null) {
            maxDrawBuffers = g.getParameter(34852 /* MAX_DRAW_BUFFERS_WEBGL */);
        }
        return maxDrawBuffers;
    }
    function getWebGLCaps(g) {
        if (!g) {
            var canvas = document.createElement("canvas");
            var webglAttr = {
                stencil: true,
                failIfMajorPerformanceCaveat: true
            };
            g = canvas.getContext("webgl", webglAttr) || canvas.getContext("experimental-webgl", webglAttr);
        }
        if (!g) {
            return;
        }
        var getParameter = g.getParameter.bind(g);
        var unmaskedRenderer, unmaskedVendor;
        var dbgRenderInfo = g.getExtension("WEBGL_debug_renderer_info");
        if (dbgRenderInfo) {
            unmaskedVendor = getParameter(37445 /* UNMASKED_VENDOR_WEBGL */);
            unmaskedRenderer = getParameter(37446 /* UNMASKED_RENDERER_WEBGL */);
        }
        return {
            unmaskedRenderer: unmaskedRenderer,
            unmaskedVendor: unmaskedVendor,
            version: getParameter(7938 /* VERSION */),
            shaderVersion: getParameter(35724 /* SHADING_LANGUAGE_VERSION */),
            vendor: getParameter(7936 /* VENDOR */),
            renderer: getParameter(7937 /* RENDERER */),
            antialias: g.getContextAttributes().antialias,
            angle: getAngle(getParameter),
            maxVertAttr: getParameter(34921 /* MAX_VERTEX_ATTRIBS */),
            maxVertTextureCount: getParameter(35660 /* MAX_VERTEX_TEXTURE_IMAGE_UNITS */),
            maxVertUniforms: getParameter(36347 /* MAX_VERTEX_UNIFORM_VECTORS */),
            maxVaryings: getParameter(36348 /* MAX_VARYING_VECTORS */),
            aliasedLineWidth: getParameter(33902 /* ALIASED_LINE_WIDTH_RANGE */),
            aliasedPointSize: getParameter(33901 /* ALIASED_POINT_SIZE_RANGE */),
            maxFragUniform: getParameter(36349 /* MAX_FRAGMENT_UNIFORM_VECTORS */),
            maxTextureCount: getParameter(34930 /* MAX_TEXTURE_IMAGE_UNITS */),
            maxTextureSize: getParameter(3379 /* MAX_TEXTURE_SIZE */),
            maxCubeMapTextureSize: getParameter(34076 /* MAX_CUBE_MAP_TEXTURE_SIZE */),
            maxCombinedTextureCount: getParameter(35661 /* MAX_COMBINED_TEXTURE_IMAGE_UNITS */),
            maxAnisotropy: getMaxAnisotropy(g),
            maxDrawBuffers: getMaxDrawBuffers(g),
            redBits: getParameter(3410 /* RED_BITS */),
            greenBits: getParameter(3411 /* GREEN_BITS */),
            blueBits: getParameter(3412 /* BLUE_BITS */),
            alphaBits: getParameter(3413 /* ALPHA_BITS */),
            depthBits: getParameter(3414 /* DEPTH_BITS */),
            stencilBits: getParameter(3415 /* STENCIL_BITS */),
            maxRenderBufferSize: getParameter(34024 /* MAX_RENDERBUFFER_SIZE */),
            maxViewportSize: getParameter(3386 /* MAX_VIEWPORT_DIMS */),
        };
    }
    jy.getWebGLCaps = getWebGLCaps;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 资源的 版本字典
     */
    var _hash = {};
    /**
     * 配置数据
     */
    var _data;
    /**
     * 注册的皮肤路径
     * key      {string}   皮肤的key
     * value    {Path}    皮肤实际路径地址
     */
    var _regedSkinPath = {};
    var getPrefix;
    var _res;
    /**
     * 获取皮肤路径
     *
     * @param {string} key
     * @param {string} fileName
     * @returns
     */
    function getSkinPath(key, fileName) {
        return key + "/" + fileName;
    }
    /**
     * 通过Path获取完整url
     *
     * @private
     * @static
     * @param {string} uri 路径标识
     * @param {Path} path Path对象
     * @returns
     */
    function getUrlWithPath(uri, path) {
        if (!path || /^((http|https):)?\/\//.test(uri)) { //如果是http://或者https://，或者//开头，即为完整地址，不加前缀
            return uri;
        }
        uri = path.tPath + uri;
        var prefix = path.iPrefix ? "" : getPrefix(uri);
        return prefix + uri;
    }
    /**
     * 根据uri缓存url的字典
     */
    var uriDict = {};
    /**
     * 获取资源版本号
     * @param uri
     */
    function getResVer(uri) {
        return ~~(_hash && _hash[uri.hash()]);
    }
    function tryReplace(v, replacer) {
        if (replacer) {
            if (typeof v === "string") {
                return doReplace(v, replacer);
            }
            else if (typeof v === "object") {
                for (var k in v) {
                    v[k] = tryReplace(v[k], replacer);
                }
            }
        }
        return v;
    }
    function doReplace(value, replacer) {
        return value.replace(/[$][{]([^{}]+)[}]/g, function (match, subkey) {
            var value = replacer[subkey];
            return value !== undefined ? "" + value : match;
        });
    }
    /**
     * 配置工具
     * @author 3tion
     * @export
     * @class ConfigUtils
     */
    jy.ConfigUtils = {
        replace: function (data) {
            var replacer = data.replacer;
            if (replacer) {
                Object.keys(data).forEach(function (key) {
                    if (key != "replacer") {
                        var v = data[key];
                        data[key] = tryReplace(v, replacer);
                    }
                });
            }
            return data;
        },
        setData: function (data) {
            _data = data;
            !_data.params && (_data.params = {});
            //检查路径是否存在有路径有父路径的，如果有，进行预处理
            var paths = _data.paths;
            for (var key in paths) {
                var p = paths[key];
                p.tPath = getPath(p, paths);
            }
            _res = _data.paths.res;
            //检查前缀
            getPrefix = (function (prefixes) {
                var len = 0;
                if (prefixes) {
                    len = prefixes.length;
                }
                switch (len) {
                    case 0:
                        return function (_) { return ""; };
                    case 1: {
                        var prefix_1 = prefixes[0];
                        return function (_) { return prefix_1; };
                    }
                    default:
                        return function (uri) {
                            var idx = uri.hash() % len;
                            return prefixes[idx] || "";
                        };
                }
            })(_data.prefixes);
            function getPath(p, paths) {
                var parentKey = p.parent;
                if (parentKey) {
                    var parent_1 = paths[parentKey];
                    if (parent_1) {
                        return getPath(parent_1, paths) + p.path;
                    }
                    else if (true) {
                        jy.ThrowError("\u8DEF\u5F84[" + p.path + "]\u914D\u7F6E\u4E86\u7236\u7EA7(parent)\uFF0C\u4F46\u662F\u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u7236\u7EA7");
                    }
                }
                return p.path;
            }
        },
        /**
         * 解析版本控制文件
         * @param {ArrayBufferLike} hash
         */
        parseHash: function (hash) {
            var dv = new DataView(hash);
            var pos = 0;
            var len = dv.byteLength;
            _hash = {};
            while (pos < len) {
                var hash_1 = dv.getUint32(pos);
                pos += 4 /* SIZE_OF_UINT32 */;
                var version = dv.getUint16(pos);
                pos += 2 /* SIZE_OF_UINT16 */;
                _hash[hash_1] = version;
            }
            jy.dispatch(-188 /* ParseResHash */);
        },
        /**
         * 设置版本控制文件
         * @param hash
         */
        setHash: function (hash) {
            _hash = hash;
        },
        getResVer: getResVer,
        /**
         * 获取资源完整路径
         *
         * @static
         * @param {string} uri                  路径标识
         * @returns {string}
         */
        getResUrl: function (uri) {
            var url = uriDict[uri];
            if (!url) {
                var ver = getResVer(uri);
                if (ver) {
                    if (uri.indexOf("?") == -1) {
                        uri = uri + "?" + ver;
                    }
                    else {
                        uri = uri + "&jyver=" + ver;
                    }
                }
                url = getUrlWithPath(uri, _res);
                uriDict[uri] = url;
            }
            return url;
        },
        /**
         * 获取参数
         */
        getParam: function (key) {
            return _data.params[key];
        },
        getSkinPath: getSkinPath,
        /**
         * 获取皮肤文件地址
         */
        getSkinFile: function (key, fileName) {
            return getUrlWithPath(getSkinPath(key, fileName), _regedSkinPath[key] || _data.paths.skin);
        },
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
        regSkinPath: function (key, path, iPrefix) {
            _regedSkinPath[key] = { tPath: path, path: path, iPrefix: iPrefix };
        },
        /**
         * 获取路径
         *
         * @param {string} uri
         * @param {string} pathKey
         * @returns
         */
        getUrl: function (uri, pathKey) {
            var path = _data.paths[pathKey];
            if (path) {
                return getUrlWithPath(uri, path);
            }
        }
    };
})(jy || (jy = {}));
/**
 * DataLocator的主数据
 * 原 junyou.DataLocator.data  的全局别名简写
 */
var $DD = {};
/**
 * DataLocator的附加数据
 * 原 junyou.DataLocator.extra 的全局别名简写
 */
var $DE = {};
var jy;
(function (jy) {
    var parsers = {};
    /**
     *
     * 用于处理顺序
     * @private
     * @static
     */
    var _plist = [];
    /**
     * 配置加载器<br/>
     * 用于预加载数据的解析
     * @author 3tion
     *
     */
    jy.DataLocator = {
        regParser: regParser,
        /**
         * 解析打包的配置
         */
        parsePakedDatas: function (type) {
            var configs = jy.Res.get("cfgs");
            jy.Res.remove("cfgs");
            if (type == 1) {
                configs = decodePakCfgs(new jy.ByteArray(configs));
            }
            // 按顺序解析
            for (var _i = 0, _plist_1 = _plist; _i < _plist_1.length; _i++) {
                var key = _plist_1[_i];
                var parser = parsers[key];
                var data = parser(configs[key]);
                if (data) { // 支持一些void的情况
                    $DD[key] = data;
                    jy.dispatch(-185 /* OneCfgComplete */, key);
                }
            }
            var extraData = $DE;
            //处理额外数据
            for (var key in configs) {
                if (key.charAt(0) == "$") {
                    var raw = configs[key];
                    key = key.substr(1);
                    if (raw) {
                        var i = 0, len = raw.length, data = {};
                        while (i < len) {
                            var sub = raw[i++];
                            var value = raw[i++];
                            var test = raw[i];
                            if (typeof test === "number") {
                                i++;
                                value = getJSONValue(value, test);
                            }
                            data[sub] = value;
                        }
                        extraData[key] = data;
                    }
                }
            }
            //清理内存
            parsers = null;
            _plist = null;
            delete jy.DataLocator;
        },
        /**
         *
         * 注册通过H5ExcelTool导出的数据并且有唯一标识的使用此方法注册
         * @param {keyof CfgData} key 数据的标识
         * @param {(Creator<any> | 0)} CfgCreator 配置的类名
         * @param {(string | 0)} [idkey="id"] 唯一标识 0用于标识数组
         * @param {CfgDataType} [type]
         */
        regCommonParser: regCommonParser,
        regBytesParser: regBytesParser
    };
    /**
     *
     * 注册通过H5ExcelTool导出的数据并且有唯一标识的使用此方法注册
     * @param {keyof CfgData} key 数据的标识
     * @param {(Creator<any> | 0)} CfgCreator 配置的类名
     * @param {(string | 0)} [idkey="id"] 唯一标识 0用于标识数组
     * @param {CfgDataType} [type]
     */
    function regCommonParser(key, CfgCreator, idkey, type) {
        if (idkey === void 0) { idkey = "id"; }
        regParser(key, function (data) {
            var _a;
            if (!data)
                return;
            var dict, forEach;
            var headersRaw = data[0];
            var hasLocal;
            for (var j = 0; j < headersRaw.length; j++) {
                var head = headersRaw[j];
                if ((head[2] & 2 /* Local */) == 2 /* Local */) {
                    hasLocal = 1;
                }
            }
            (_a = getParserOption(idkey, type), type = _a[0], dict = _a[1], forEach = _a[2]);
            try {
                var ref = CfgCreator || Object;
                for (var i = 1; i < data.length; i++) {
                    var rowData = data[i];
                    var ins = new ref();
                    var local = hasLocal && {};
                    for (var j = 0; j < headersRaw.length; j++) {
                        var head = headersRaw[j];
                        var name_6 = head[0], test = head[1], type_1 = head[2], def = head[3];
                        var v = getJSONValue(rowData[j], test, def);
                        if ((type_1 & 2 /* Local */) == 2 /* Local */) {
                            local[name_6] = v;
                        }
                        else {
                            ins[name_6] = v;
                        }
                    }
                    forEach(ins, i - 1, key, dict, idkey);
                    if (typeof ins.decode === "function") {
                        ins.decode(local);
                    }
                }
                if (type == 1 /* ArraySet */) {
                    dict = new jy.ArraySet().setRawList(dict, idkey);
                }
            }
            catch (e) {
                if (true) {
                    jy.ThrowError("\u89E3\u6790\u914D\u7F6E:" + key + "\u51FA\u9519", e);
                }
            }
            return dict;
        });
    }
    /**
     * 注册配置解析
     * @param key       配置的标识
     * @param parser    解析器
     */
    function regParser(key, parser) {
        parsers[key] = parser;
        _plist.push(key);
    }
    function getJSONValue(value, type, def) {
        // 特殊类型数据
        switch (type) {
            case 0 /* Any */:
                if (value == null) { //value == null 同时判断 null 和 undefined 并且字符串较少
                    value = def;
                }
                break;
            case 1 /* String */:
                if (value === 0 || value == null) {
                    value = def || "";
                }
                break;
            case 2 /* Number */:
            case 9 /* Int32 */:
                // 0 == "" // true
                if (value === "" || value == null) {
                    value = +def || 0;
                }
                break;
            case 3 /* Bool */:
                if (value == null) {
                    value = def;
                }
                value = !!value;
                break;
            case 4 /* Array */:
            case 5 /* Array2D */:
                if (value === 0) {
                    value = undefined;
                }
                if (!value && def) {
                    value = def;
                }
                break;
            case 6 /* Date */:
            case 8 /* DateTime */:
                value = new Date((value || def || 0) * 10000);
                break;
            case 7 /* Time */:
                value = new jy.TimeVO().decodeBit(value || def || 0);
                break;
        }
        return value;
    }
    /**
     * 用于解析数组
     *
     * @memberOf DataLocator
     */
    function arrayParserForEach(t, idx, key, dict) {
        dict.push(t);
    }
    /**
     * 用于解析字典
     */
    function commonParserForEach(t, idx, key, dict, idKey) {
        if (idKey in t) {
            var id = t[idKey];
            if (true) {
                if (typeof id === "object") {
                    jy.Log("\u914D\u7F6E" + key + "\u7684\u6570\u636E\u6709\u8BEF\uFF0C\u552F\u4E00\u6807\u8BC6" + idKey + "\u4E0D\u80FD\u4E3A\u5BF9\u8C61");
                }
                if (id in dict) {
                    jy.Log("\u914D\u7F6E" + key + "\u7684\u6570\u636E\u6709\u8BEF\uFF0C\u552F\u4E00\u6807\u8BC6" + idKey + "\u6709\u91CD\u590D\u503C\uFF1A" + id);
                }
            }
            dict[id] = t;
        }
        else if (true) {
            jy.Log("\u914D\u7F6E" + key + "\u89E3\u6790\u6709\u8BEF\uFF0C\u65E0\u6CD5\u627E\u5230\u6307\u5B9A\u7684\u552F\u4E00\u6807\u793A\uFF1A" + idKey + "\uFF0C\u6570\u636E\u7D22\u5F15\uFF1A" + idx);
        }
    }
    var CfgHeadStruct = {
        1: [0, 2 /* Required */, 9 /* String */] /*必有 属性名字*/,
        2: [1, 2 /* Required */, 14 /* Enum */] /*必有 数值的数据类型*/,
        3: [2, 1 /* Optional */, 14 /* Enum */] /*可选 此列的状态*/,
        4: [3, 1 /* Optional */, 17 /* SInt32 */] /*可选 bool / int32 型默认值 */,
        5: [4, 1 /* Optional */, 1 /* Double */] /*可选 double 型默认值 */,
        6: [5, 1 /* Optional */, 9 /* String */] /*可选 字符串型默认值 */
    };
    var PBUtils = jy.getPBUtils();
    PBUtils.initDefault(CfgHeadStruct);
    //配置数据 打包的文件结构数据
    //readUnsignedByte 字符串长度 readString 表名字 readUnsignedByte 配置类型(0 PBBytes 1 JSON字符串) readVarint 数据长度
    function decodePakCfgs(buffer) {
        var cfgs = {};
        while (buffer.readAvailable) {
            var len = buffer.readUnsignedByte();
            var key = buffer.readUTFBytes(len); //得到表名
            var type = buffer.readUnsignedByte();
            var value = void 0;
            len = buffer.readVarint();
            switch (type) {
                case 0: //JSON字符串
                    var str = buffer.readUTFBytes(len);
                    value = JSON.parse(str);
                    break;
                case 1: //PBBytes
                    value = buffer.readByteArray(len);
                    break;
            }
            cfgs[key] = value;
        }
        return cfgs;
    }
    function getParserOption(idkey, type) {
        if (idkey === void 0) { idkey = "id"; }
        var dict, forEach;
        if (idkey == "" || idkey == 0) {
            type = 2 /* Array */;
        }
        else if (!type) {
            type = 3 /* Dictionary */;
        }
        switch (type) {
            case 2 /* Array */:
            case 1 /* ArraySet */:
                dict = [];
                forEach = arrayParserForEach;
                break;
            case 3 /* Dictionary */:
                dict = {};
                forEach = commonParserForEach;
                break;
        }
        return [type, dict, forEach];
    }
    /**
     * 通用的Bytes版本的配置解析器
     * @param buffer
     */
    function regBytesParser(key, CfgCreator, idkey, type) {
        if (idkey === void 0) { idkey = "id"; }
        regParser(key, function (bytes) {
            var _a;
            if (!bytes) {
                return;
            }
            var dict, forEach;
            (_a = getParserOption(idkey, type), type = _a[0], dict = _a[1], forEach = _a[2]);
            try {
                var struct = {};
                var headersRaw = [];
                var i = 0;
                var count = bytes.readVarint(); //头的数量
                var hasLocal = void 0;
                while (bytes.readAvailable && count--) {
                    var len = bytes.readVarint();
                    var head = PBUtils.readFrom(CfgHeadStruct, bytes, len);
                    var name_7 = head[0], headType = head[1], headState = head[2], i32Def = head[3], dblDef = head[4], strDef = head[5];
                    var def = void 0, isJSON = 0, pbType = void 0;
                    switch (headType) {
                        case 0 /* Any */:
                        case 1 /* String */:
                            def = strDef;
                            pbType = 9 /* String */;
                            break;
                        case 2 /* Number */:
                            def = dblDef;
                            pbType = 1 /* Double */;
                            break;
                        case 3 /* Bool */:
                        case 9 /* Int32 */:
                        case 6 /* Date */:
                        case 7 /* Time */:
                        case 8 /* DateTime */:
                            def = i32Def;
                            pbType = 17 /* SInt32 */;
                            break;
                        case 4 /* Array */:
                        case 5 /* Array2D */:
                            if (strDef) {
                                def = JSON.parse(strDef);
                            }
                            pbType = 9 /* String */;
                            isJSON = 1;
                            break;
                    }
                    struct[i + 1] = [name_7, 1 /* Optional */, pbType, def];
                    head.length = 5;
                    head[3] = def;
                    head[4] = isJSON;
                    headersRaw[i++] = head;
                    if ((headState & 2 /* Local */) == 2 /* Local */) {
                        hasLocal = 1;
                    }
                }
                PBUtils.initDefault(struct, CfgCreator);
                var headLen = i;
                i = 0;
                count = bytes.readVarint(); //行的数量
                while (bytes.readAvailable && count--) {
                    var len = bytes.readVarint();
                    var obj = PBUtils.readFrom(struct, bytes, len);
                    if (!obj) {
                        continue;
                    }
                    var local = hasLocal && {};
                    for (var j = 0; j < headLen; j++) {
                        var head = headersRaw[j];
                        var name_8 = head[0], test = head[1], type_2 = head[2], def = head[3], isJSON = head[4];
                        var value = obj[name_8];
                        if (value && isJSON) {
                            value = JSON.parse(value);
                        }
                        var v = getJSONValue(value, test, def);
                        if ((type_2 & 2 /* Local */) == 2 /* Local */) {
                            local[name_8] = v;
                        }
                        else {
                            obj[name_8] = v;
                        }
                    }
                    forEach(obj, i++, key, dict, idkey);
                    if (typeof obj.decode === "function") {
                        obj.decode(local);
                    }
                }
                if (type == 1 /* ArraySet */) {
                    dict = new jy.ArraySet().setRawList(dict, idkey);
                }
            }
            catch (e) {
                if (true) {
                    jy.ThrowError("\u89E3\u6790\u914D\u7F6E:" + key + "\u51FA\u9519\uFF0C\u8BF7\u91CD\u65B0\u6253\u5305\u914D\u7F6E", e, true);
                }
            }
            return dict;
        });
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 尝试将数据转成number类型，如果无法转换，用原始类型
     *
     * @param {*} value 数据
     * @returns
     */
    function tryParseNumber(value) {
        if (typeof value === "boolean") {
            return value ? 1 : 0;
        }
        if (value == +value && value.length == (+value + "").length) { // 数值类型
            // "12132123414.12312312"==+"12132123414.12312312"
            // true
            // "12132123414.12312312".length==(+"12132123414.12312312"+"").length
            // false
            return +value;
        }
        else {
            return value;
        }
    }
    function getData(valueList, keyList, o) {
        o = o || {};
        for (var i = 0, len = keyList.length; i < len; i++) {
            var key = keyList[i];
            var v = valueList[i];
            if (v != undefined) {
                o[key] = valueList[i];
            }
        }
        return o;
    }
    function copyData(to, valueList, keyList) {
        for (var i = 0, len = keyList.length; i < len; i++) {
            var key = keyList[i];
            to[key] = valueList[i];
        }
    }
    function getZuobiao(data) {
        return { x: data[0], y: data[1] };
    }
    /**
     *
     * @author 君游项目解析工具
     *
     */
    jy.DataUtils = {
        parseDatas: function (to, from, checkStart, checkEnd, dataKey, toDatasKey) {
            var arr = [];
            for (var i = checkStart, j = 0; i <= checkEnd; i++) {
                var key = dataKey + i;
                if (key in from) {
                    arr[j++] = from[key];
                }
            }
            to[toDatasKey] = arr;
        },
        parseDatas2: function (to, valueList, keyList, checkStart, checkEnd, dataKey, toDatasKey) {
            var arr = [];
            for (var i = checkStart, j = 0; i <= checkEnd; i++) {
                var key = dataKey + i;
                var idx = keyList.indexOf(key);
                if (~idx) {
                    arr[j++] = valueList[idx];
                }
            }
            to[toDatasKey] = arr;
        },
        getData: getData,
        getDataList: function (dataList, keyList) {
            var list = [];
            if (dataList) {
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var valueList = dataList[i];
                    list.push(getData(valueList, keyList));
                }
            }
            return list;
        },
        parseDataList: function (dataList, keyList, forEach, thisObj) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            if (dataList) {
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var valueList = dataList[i];
                    var to = getData(valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },
        copyData: copyData,
        copyDataList: function (creator, dataList, keyList, forEach, thisObj) {
            var args = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                args[_i - 5] = arguments[_i];
            }
            if (dataList) {
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var valueList = dataList[i];
                    var to = new creator();
                    copyData(to, valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },
        parseXAttr2: function (from, xattr, keyPrefix, valuePrefix, delOriginKey) {
            if (keyPrefix === void 0) { keyPrefix = "pro"; }
            if (valuePrefix === void 0) { valuePrefix = "provalue"; }
            if (delOriginKey === void 0) { delOriginKey = true; }
            var xReg = new RegExp("^" + keyPrefix + "(\\d+)$");
            if (true) {
                var repeatedErr = "";
            }
            var keyCount = 0;
            for (var key in from) {
                var obj = xReg.exec(key);
                if (obj) {
                    var idx = +(obj[1]) || 0;
                    var valueKey = valuePrefix + idx;
                    if (true) {
                        if (key in xattr) {
                            repeatedErr += key + " ";
                        }
                    }
                    var value = +(from[valueKey]);
                    if (value > 0) { //只有大于0做处理
                        keyCount++;
                        xattr[from[key]] = value;
                    }
                    if (delOriginKey) {
                        delete from[key];
                        delete from[valueKey];
                    }
                }
            }
            if (true) {
                if (repeatedErr) {
                    jy.ThrowError("有重复的属性值:" + repeatedErr);
                }
            }
            return keyCount;
        },
        parseXAttr: function (from, xattr, delOriginKey, xReg) {
            if (delOriginKey === void 0) { delOriginKey = true; }
            if (xReg === void 0) { xReg = /^x\d+$/; }
            var keyCount = 0;
            for (var key in from) {
                if (xReg.test(key)) {
                    var value = +(from[key]);
                    if (value > 0) { //只有大于0做处理
                        keyCount++;
                        xattr[key] = value;
                    }
                    if (delOriginKey) {
                        delete from[key];
                    }
                }
            }
            return keyCount;
        },
        getZuobiaos: function (data, out) {
            out = out || [];
            for (var i = 0; i < data.length; i++) {
                out.push(getZuobiao(data[i]));
            }
        },
        getArray2D: function (value) {
            if (Array.isArray(value)) {
                return value;
            }
            if (value.trim() == "") {
                return;
            }
            var arr = value.split("|");
            arr.forEach(function (item, idx) {
                var subArr = item.split(":");
                arr[idx] = subArr;
                subArr.forEach(function (sitem, idx) {
                    subArr[idx] = tryParseNumber(sitem);
                });
            });
            return arr;
        },
        getArray: function (value) {
            if (Array.isArray(value)) {
                return value;
            }
            value = value + "";
            if (value.trim() == "") {
                return;
            }
            var arr = value.split(/[:|]/g);
            arr.forEach(function (item, idx) {
                arr[idx] = tryParseNumber(item);
            });
            return arr;
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 使用http进行通信的网络服务
     * @author 3tion
     *
     */
    var HttpNetService = /** @class */ (function (_super) {
        __extends(HttpNetService, _super);
        function HttpNetService() {
            var _this = _super.call(this) || this;
            _this._state = 0 /* UNREQUEST */;
            /**
             * 请求发送成功的次数
             */
            _this._success = 0;
            /**
             * 请求连续发送失败的次数
             */
            _this._cerror = 0;
            /**
             * 请求失败次数
             */
            _this._error = 0;
            //覆盖instance
            jy.NetService._ins = _this;
            _this._unsendRequest = [];
            _this._sendingList = [];
            _this._loader = new XMLHttpRequest;
            return _this;
        }
        /**
         * 重置
         * @param actionUrl             请求地址
         * @param autoTimeDelay         自动发送的最短延迟时间
         */
        HttpNetService.prototype.setUrl = function (actionUrl, autoTimeDelay) {
            if (autoTimeDelay === void 0) { autoTimeDelay = 5000; }
            this._actionUrl = actionUrl;
            if (autoTimeDelay != this._autoTimeDelay) {
                this._autoTimeDelay = autoTimeDelay;
            }
            // 200毫秒检查一次，是否可以自动拉数据了
            jy.TimerUtil.addCallback(200, this.checkUnsend, this);
            var loader = this._loader;
            loader.onreadystatechange = this.onReadyStateChange.bind(this);
            loader.ontimeout = this.errorHandler.bind(this);
        };
        /**
        * @protected
        */
        HttpNetService.prototype.onReadyStateChange = function () {
            var xhr = this._loader;
            if (xhr.readyState == 4) { // 4 = "loaded"
                var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                var self_1 = this;
                setTimeout(function () {
                    if (ioError_1) { //请求错误
                        self_1.errorHandler();
                    }
                    else {
                        self_1.complete();
                    }
                }, 0);
            }
        };
        /**
         * 发生错误
         */
        HttpNetService.prototype.errorHandler = function () {
            this._error++;
            this._cerror++;
            this._state = -1 /* FAILED */;
            if (this._cerror > 1) {
                this.showReconnect();
                return;
            }
            //曾经成功过
            //数据未发送成功
            var sending = this._sendingList;
            var idx = sending.length;
            var unrequest = this._unsendRequest;
            for (var _i = 0, unrequest_1 = unrequest; _i < unrequest_1.length; _i++) {
                var pdata = unrequest_1[_i];
                sending[idx++] = pdata;
            }
            //交互未发送的请求和发送中的请求列表
            unrequest.length = 0;
            this._unsendRequest = sending;
            this._sendingList = unrequest;
            //尝试重新发送请求
            this.checkUnsend();
        };
        HttpNetService.prototype.complete = function () {
            this._state = 2 /* COMPLETE */;
            this._reconCount = 0;
            //处理Response
            var readBuffer = this._readBuffer;
            readBuffer.replaceBuffer(this._loader.response);
            readBuffer.position = 0;
            //成功一次清零连续失败次数
            this._cerror = 0;
            this._success++;
            //清理正在发送的数据            
            for (var _i = 0, _a = this._sendingList; _i < _a.length; _i++) {
                var pdata = _a[_i];
                pdata.recycle();
            }
            //数据发送成功
            this._sendingList.length = 0;
            this.onBeforeSolveData();
            this.decodeBytes(readBuffer);
            this.checkUnsend();
        };
        /**
         * 检查在发送过程中的请求
         */
        HttpNetService.prototype.checkUnsend = function () {
            //有在发送过程中，主动发送的数据
            if (this._unsendRequest.length || jy.Global.now > this._nextAutoTime) {
                this.trySend();
            }
        };
        HttpNetService.prototype._send = function (cmd, data, msgType) {
            //没有同协议的指令，新增数据
            var pdata = jy.recyclable(jy.NetData);
            pdata.cmd = cmd;
            pdata.data = data;
            pdata.msgType = msgType;
            this._unsendRequest.push(pdata);
            this.trySend();
        };
        /**
         * 发送消息之前，用于预处理一些http头信息等
         *
         * @protected
         */
        HttpNetService.prototype.onBeforeSend = function () {
        };
        /**
         * 接收到服务端Response，用于预处理一些信息
         *
         * @protected
         */
        HttpNetService.prototype.onBeforeSolveData = function () {
        };
        /**
         * 尝试发送
         */
        HttpNetService.prototype.trySend = function () {
            if (this._state == 1 /* REQUESTING */) {
                return;
            }
            this._state = 1 /* REQUESTING */;
            var loader = this._loader;
            loader.open("POST", this._actionUrl, true);
            loader.responseType = "arraybuffer";
            this.onBeforeSend();
            var sendBuffer = this._sendBuffer;
            sendBuffer.reset();
            var unsend = this._unsendRequest;
            var sending = this._sendingList;
            for (var i = 0, len = unsend.length; i < len; i++) {
                var pdata = unsend[i];
                this.writeToBuffer(sendBuffer, pdata);
                sending[i] = pdata;
            }
            var pcmdList = this._pcmdList;
            for (var _i = 0, pcmdList_2 = pcmdList; _i < pcmdList_2.length; _i++) {
                var pdata = pcmdList_2[_i];
                this.writeToBuffer(sendBuffer, pdata);
                sending[i++] = pdata;
            }
            //清空被动数据
            pcmdList.length = 0;
            //清空未发送的数据
            unsend.length = 0;
            loader.send(sendBuffer.outBytes);
            //重置自动发送的时间
            this._nextAutoTime = jy.Global.now + this._autoTimeDelay;
        };
        return HttpNetService;
    }(jy.NetService));
    jy.HttpNetService = HttpNetService;
    __reflect(HttpNetService.prototype, "jy.HttpNetService");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 用于发送的网络数据<br/>
     * @author 3tion
     */
    var NetSendData = /** @class */ (function () {
        function NetSendData() {
        }
        NetSendData.prototype.onRecycle = function () {
            this.data = undefined;
            this.msgType = undefined;
        };
        return NetSendData;
    }());
    jy.NetSendData = NetSendData;
    __reflect(NetSendData.prototype, "jy.NetSendData", ["jy.IRecyclable"]);
    /**
     * 网络数据，类似AS3项目中Stream<br/>
     * @author 3tion
     *
     */
    var NetData = /** @class */ (function (_super) {
        __extends(NetData, _super);
        function NetData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NetData;
    }(NetSendData));
    jy.NetData = NetData;
    __reflect(NetData.prototype, "jy.NetData");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     * @author 3tion
     *
     */
    var NetRouter = /** @class */ (function () {
        function NetRouter() {
            this.dispatchList = [];
            this._listenerMaps = {};
        }
        /**
         * 注册一cmd侦听;
         * @param cmd      协议号
         * @param handler   处理器
         * @param priority  越大越优先
         * @param once      是否只执行一次
         * @return boolean true 做为新的兼听添加进去，false 原来就有处理器
         *
         */
        NetRouter.prototype.register = function (cmd, handler, priority, once) {
            if (priority === void 0) { priority = 0; }
            if (once === void 0) { once = false; }
            var listenerMaps = this._listenerMaps;
            var netBin = { handler: handler, priority: priority, once: once };
            var list = listenerMaps[cmd];
            if (!list) {
                list = [];
                listenerMaps[cmd] = list;
                //以前单条是没有存储优先级信息的，会导致，如果先加入的大的，后加入小的，可能会出现问题
                list.push(netBin);
            }
            else {
                var i = void 0;
                var len = list.length;
                //=====同样的CODE 同样的Function 不会被注册多次=====
                for (i = 0; i < len; i++) {
                    var temp = list[i];
                    if (temp.handler == handler) {
                        if (temp.priority == priority) {
                            return false;
                        }
                        //新的同指令，同处理器的函数会被新的once,priority属性覆盖
                        list.splice(i, 1);
                        len--;
                        break;
                    }
                }
                for (i = 0; i < len; i++) {
                    if (priority > list[i].priority) {
                        list.splice(i, 0, netBin);
                        return true;
                    }
                }
                list[len] = netBin;
            }
            return true;
        };
        /**
         * 删除兼听处理器
         * @param cmd      协议号
         * @param handler   处理器
         * @return boolean true 删除成功  <br/>
         *                 false 没有这个兼听
         */
        NetRouter.prototype.remove = function (cmd, handler) {
            var listenerMaps = this._listenerMaps;
            var list = listenerMaps[cmd];
            if (!list) {
                return false;
            }
            var len = list.length;
            for (var i = 0; i < len; i++) {
                if (list[i].handler == handler) {
                    list.splice(i, 1);
                    //如果没有项了就清理;
                    if (len == 1) {
                        delete listenerMaps[cmd];
                    }
                    return true;
                }
            }
            return false;
        };
        /**
        * 调用列表
        */
        NetRouter.prototype.dispatch = function (data) {
            egret.callLater(this._dispatch, this, data);
        };
        NetRouter.prototype._dispatch = function (data) {
            var cmd = data.cmd;
            var list = this._listenerMaps[cmd];
            if (!list) {
                return;
            }
            var dispatchList = this.dispatchList;
            var idx = 0, len = list.length;
            for (; idx < len; idx++) {
                dispatchList[idx] = list[idx];
            }
            if (true) { //DEBUG的直接报错，方便调试
                for (var i = 0; i < idx; i++) {
                    var bin = dispatchList[i];
                    bin.handler(data);
                    if (bin.once) { //如果只执行一次的，就移除
                        this.remove(cmd, bin.handler);
                    }
                    if (data.stopPropagation) {
                        break;
                    }
                }
            }
            else { //正式版的进行try catch，防止因为一个指令影响后续指令
                for (var i = 0; i < idx; i++) {
                    var bin = dispatchList[i];
                    try {
                        bin.handler(data);
                    }
                    catch (e) {
                        jy.ThrowError("NetHander Error:" + JSON.stringify(data), e);
                    }
                    if (bin.once) { //如果只执行一次的，就移除
                        this.remove(cmd, bin.handler);
                    }
                    if (data.stopPropagation) {
                        break;
                    }
                }
            }
            data.recycle();
        };
        return NetRouter;
    }());
    jy.NetRouter = NetRouter;
    __reflect(NetRouter.prototype, "jy.NetRouter");
    ;
})(jy || (jy = {}));
var jy;
(function (jy) {
    // const enum Const {
    function sendMultiDataPerFrame(cmd, data, msgType) {
        //@ts-ignore
        var ws = this._ws;
        if (!ws || ws.readyState != WebSocket.OPEN) {
            return;
        }
        //@ts-ignore
        var _a = this, _pcmdList = _a._pcmdList, _sendBuffer = _a._sendBuffer;
        //没有同协议的指令，新增数据
        var pdata = jy.recyclable(jy.NetSendData);
        pdata.cmd = cmd;
        pdata.data = data;
        pdata.msgType = msgType;
        _sendBuffer.reset();
        this.writeToBuffer(_sendBuffer, pdata);
        pdata.recycle();
        for (var _i = 0, _pcmdList_1 = _pcmdList; _i < _pcmdList_1.length; _i++) {
            var pdata_1 = _pcmdList_1[_i];
            this.writeToBuffer(_sendBuffer, pdata_1);
            pdata_1.recycle();
        }
        //清空被动数据
        _pcmdList.length = 0;
        ws.send(_sendBuffer.outBytes);
    }
    function sendOneDataPerFrame(cmd, data, msgType) {
        //@ts-ignore
        var ws = this._ws;
        if (!ws || ws.readyState != WebSocket.OPEN) {
            return;
        }
        //@ts-ignore
        var _a = this, _pcmdList = _a._pcmdList, _sendBuffer = _a._sendBuffer;
        //没有同协议的指令，新增数据
        var pdata = jy.recyclable(jy.NetSendData);
        pdata.cmd = cmd;
        pdata.data = data;
        pdata.msgType = msgType;
        _sendBuffer.reset();
        this.writeToBuffer(_sendBuffer, pdata);
        pdata.recycle();
        ws.send(_sendBuffer.outBytes);
        for (var _i = 0, _pcmdList_2 = _pcmdList; _i < _pcmdList_2.length; _i++) {
            var pdata_2 = _pcmdList_2[_i];
            _sendBuffer.reset();
            this.writeToBuffer(_sendBuffer, pdata_2);
            pdata_2.recycle();
            ws.send(_sendBuffer.outBytes);
        }
        //清空被动数据
        _pcmdList.length = 0;
    }
    /**
     * 单BinaryFrame单消息模式 的消息处理
     *
     * @protected
     * @memberof WSNetService
     */
    function onData(ev) {
        //@ts-ignore
        var readBuffer = this._readBuffer;
        readBuffer.replaceBuffer(ev.data);
        readBuffer.position = 0;
        this.decodeBytes(readBuffer);
    }
    /**
     *
     * 单BinaryFrame 多消息模式 的消息处理
     * @protected
     */
    function onDataN(ev) {
        //@ts-ignore
        var readBuffer = this._readBuffer;
        var ab = new Uint8Array(ev.data);
        var temp;
        var position = readBuffer.position;
        var buffer = readBuffer.buffer;
        var length = buffer.byteLength;
        if (position < length) { //还有剩余未读取的数据
            var rb = new Uint8Array(buffer);
            var rbLen = length - position;
            var abLen = ab.length;
            temp = new Uint8Array(rbLen + abLen);
            var i = 0, m = void 0;
            for (m = 0; m < rbLen; m++) {
                temp[i++] = rb[position + m];
            }
            for (m = 0; m < abLen; m++) {
                temp[i++] = ab[m];
            }
        }
        else {
            temp = ab;
        }
        readBuffer.replaceBuffer(temp.buffer);
        readBuffer.position = 0;
        this.decodeBytes(readBuffer);
    }
    /**
     * 解除ws绑定
     *
     * @param {WebSocket} ws
     */
    function loose(ws) {
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.onopen = null;
    }
    /**
     * WebSocket版本的NetService
     * @author 3tion
     */
    var WSNetService = /** @class */ (function (_super) {
        __extends(WSNetService, _super);
        function WSNetService() {
            var _this = _super.call(this) || this;
            _this.onOpen = function () {
                var ws = _this._ws;
                ws && (ws.onopen = null);
                if (true) {
                    console.log("webSocket连接成功");
                }
                jy.dispatch(-197 /* Connected */);
            };
            /**
             *
             * 发生错误
             * @protected
             */
            _this.onError = function (ev) {
                if (true) {
                    jy.ThrowError("socket发生错误", ev.error);
                }
                jy.dispatch(-196 /* ConnectFailed */);
            };
            /**
             *
             * 断开连接
             * @protected
             */
            _this.onClose = function (ev) {
                if (true) {
                    console.log("socket断开连接");
                }
                jy.Global.nextTick(jy.dispatch, jy, -195 /* Disconnect */);
            };
            //覆盖instance
            jy.NetService._ins = _this;
            return _this;
        }
        /**
         * 设置数据模式
         *
         * @param {WSNetServiceDataMode} mode
         * @memberof WSNetService
         */
        WSNetService.prototype.setDataMode = function (mode) {
            if (this.dataMode != mode) {
                //@ts-ignore
                this.dataMode = mode;
                this.checkDataMode();
            }
        };
        /**
         * 检查数据模式
         *
         * @memberof WSNetService
         */
        WSNetService.prototype.checkDataMode = function () {
            var ws = this._ws;
            if (ws) {
                var mode = ~~this.dataMode;
                ws.onmessage = (mode & 1 /* ReceiveMask */) == 1 /* ReceiveMultiDataPerFrame */ ? onDataN.bind(this) : onData.bind(this);
                this.$send = (mode & 2 /* SendMask */) == 2 /* SendOneDataPerFrame */ ? sendOneDataPerFrame : sendMultiDataPerFrame;
            }
        };
        Object.defineProperty(WSNetService.prototype, "connected", {
            get: function () {
                var ws = this._ws;
                return ws && ws.readyState == WebSocket.OPEN;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * 设置websocket地址
         * @param {string} actionUrl
         */
        WSNetService.prototype.setUrl = function (actionUrl) {
            if (this._actionUrl != actionUrl) {
                this._actionUrl = actionUrl;
                var ws = this._ws;
                if (ws && ws.readyState <= WebSocket.OPEN) { //已经有连接，重置连接
                    this.connect();
                }
            }
        };
        /**
         * 打开新的连接
         */
        WSNetService.prototype.connect = function () {
            var ws = this._ws;
            if (ws) {
                loose(ws);
            }
            this._ws = ws = new WebSocket(this._actionUrl);
            ws.binaryType = "arraybuffer";
            ws.onclose = this.onClose;
            ws.onerror = this.onError;
            ws.onopen = this.onOpen;
            this.checkDataMode();
        };
        WSNetService.prototype._send = function (cmd, data, msgType) {
            this.$send(cmd, data, msgType);
        };
        /**
         * 主动断开连接
         *
         * @returns
         * @memberof WSNetService
         */
        WSNetService.prototype.disconnect = function () {
            var ws = this._ws;
            if (!ws || ws.readyState != WebSocket.OPEN) {
                return;
            }
            loose(ws);
            this._ws = null;
            ws.close();
        };
        return WSNetService;
    }(jy.NetService));
    jy.WSNetService = WSNetService;
    __reflect(WSNetService.prototype, "jy.WSNetService");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var Res;
    (function (Res) {
        var _a, _b;
        /**
         *  失败的超时时间
         */
        var failedExpiredTime = 10000 /* FailedExpiredTime */;
        /**
         * 设置失败的过期时间
         * 失败次数超过`maxRetry`
         * @export
         * @param {number} second
         */
        function setFailedExpired(second) {
            var time = ~~second * 1000 /* ONE_SECOND */;
            if (time <= 0) { //如果为小于0的时间，则将时间设置为1分钟过期
                time = 10000 /* FailedExpiredTime */;
            }
            failedExpiredTime = time;
        }
        Res.setFailedExpired = setFailedExpired;
        /**
         * 最大重试次数
         */
        var maxRetry = 3 /* MaxRetry */;
        /**
         * 设置单个资源，不做延迟重试的最大重试次数，默认为3
         * @param val
         */
        function setMaxRetry(val) {
            maxRetry = val;
        }
        Res.setMaxRetry = setMaxRetry;
        /**
         * 最大加载数量
         * 目前所有主流浏览器针对 http 1.1 单域名最大加载数均为6个
         * http2 基本无限制
         */
        var maxThread = 6 /* MaxThread */;
        /**
         * 设置最大加载线程  默认为 6
         * @param val
         */
        function setMaxThread(val) {
            maxThread = val;
        }
        Res.setMaxThread = setMaxThread;
        /**
         * 扩展名和类型的绑定字典
         */
        var extTypeDict = (_a = {},
            _a[".jpg" /* JPG */] = 2 /* Image */,
            _a[".png" /* PNG */] = 2 /* Image */,
            _a[".webp" /* WEBP */] = 2 /* Image */,
            _a[".json" /* JSON */] = 3 /* Json */,
            _a[".bin" /* BIN */] = 0 /* Binary */,
            _a[".mp3" /* MP3 */] = 4 /* Sound */,
            _a);
        function checkItemState(item, event) {
            var state = item.state;
            if (!item.removed) {
                state = event.type == "complete" /* COMPLETE */ ? 2 /* COMPLETE */ : -1 /* FAILED */;
            }
            item.state = state;
            return state;
        }
        function bindRequest(loader, request, item, callback) {
            request.on("complete" /* COMPLETE */, loader.onLoadFinish, loader);
            request.on("ioError" /* IO_ERROR */, loader.onLoadFinish, loader);
            request.item = item;
            request.resCB = callback;
        }
        function looseRequest(loader, request) {
            request.off("complete" /* COMPLETE */, loader.onLoadFinish, loader);
            request.off("ioError" /* IO_ERROR */, loader.onLoadFinish, loader);
            request.item = undefined;
            request.resCB = undefined;
            request.recycle && request.recycle();
        }
        var BinLoader = /** @class */ (function () {
            function BinLoader(type) {
                if (type === void 0) { type = "arraybuffer"; }
                this.type = type;
            }
            BinLoader.prototype.loadFile = function (resItem, callback) {
                var request = jy.recyclable(egret.HttpRequest);
                bindRequest(this, request, resItem, callback);
                request.responseType = this.type;
                request.open(resItem.url);
                request.send();
            };
            BinLoader.prototype.onLoadFinish = function (event) {
                var request = event.target;
                var item = request.item, resCB = request.resCB, response = request.response;
                looseRequest(this, request);
                var state = checkItemState(item, event);
                if (state == 2 /* COMPLETE */) {
                    item.data = response;
                }
                resCB.callAndRecycle(item);
            };
            return BinLoader;
        }());
        Res.BinLoader = BinLoader;
        __reflect(BinLoader.prototype, "jy.Res.BinLoader", ["jy.Res.ResLoader"]);
        var ImageLoader = /** @class */ (function () {
            function ImageLoader() {
            }
            ImageLoader.prototype.loadFile = function (resItem, callback) {
                var request = jy.recyclable(egret.ImageLoader);
                bindRequest(this, request, resItem, callback);
                request.load(resItem.url);
            };
            ImageLoader.prototype.onLoadFinish = function (event) {
                var request = event.target;
                var item = request.item, resCB = request.resCB, data = request.data;
                looseRequest(this, request);
                var state = checkItemState(item, event);
                if (state == 2 /* COMPLETE */) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(data);
                    item.data = texture;
                }
                resCB.callAndRecycle(item);
            };
            return ImageLoader;
        }());
        Res.ImageLoader = ImageLoader;
        __reflect(ImageLoader.prototype, "jy.Res.ImageLoader", ["jy.Res.ResLoader"]);
        var EgretSoundLoader = /** @class */ (function () {
            function EgretSoundLoader() {
            }
            EgretSoundLoader.prototype.loadFile = function (resItem, callback) {
                var request = new egret.Sound();
                bindRequest(this, request, resItem, callback);
                request.load(resItem.url);
            };
            EgretSoundLoader.prototype.onLoadFinish = function (event) {
                var request = event.target;
                var item = request.item, resCB = request.resCB;
                looseRequest(this, request);
                var state = checkItemState(item, event);
                if (state == 2 /* COMPLETE */) {
                    item.data = request;
                }
                resCB.callAndRecycle(item);
            };
            return EgretSoundLoader;
        }());
        __reflect(EgretSoundLoader.prototype, "EgretSoundLoader", ["jy.Res.ResLoader"]);
        var binLoader = new BinLoader();
        /**
         * 资源字典
         * Key {Key} 资源标识
         * Value {ResItem} 资源
         *
         */
        var resDict = {};
        /**
         * 加载器字典
         * Key {number}             加载器类型
         * Value {ResAnalyzer}      加载器
         */
        var loaderMap = (_b = {},
            _b[0 /* Binary */] = binLoader,
            _b[1 /* Text */] = new BinLoader("text"),
            _b[3 /* Json */] = new BinLoader("json"),
            _b[2 /* Image */] = new ImageLoader,
            _b[4 /* Sound */] = new EgretSoundLoader,
            _b);
        /**
         * 加载列队的总数
         */
        var queues = {};
        /**
         * 失败的资源加载列队
         */
        var failedList = [];
        /**
        * 获取资源的扩展名
        * @param url
        */
        function getExt(url) {
            if (!url)
                return;
            var hash = url.lastIndexOf("?");
            hash == -1 && (hash = undefined);
            var ext = url.substring(url.lastIndexOf("."), hash);
            return ext.toLocaleLowerCase();
        }
        Res.getExt = getExt;
        /**
         * 内联绑定
         * @param ext 扩展名
         * @param type 类型
         */
        function bindExtType(ext, type) {
            extTypeDict[ext] = type;
        }
        Res.bindExtType = bindExtType;
        /**
         * 注册资源分析器
         * @param type 分析器类型
         * @param analyzer 分析器
         */
        function regAnalyzer(type, analyzer) {
            loaderMap[type] = analyzer;
        }
        Res.regAnalyzer = regAnalyzer;
        /**
         * 根据 url 获取资源的处理类型
         * @param url
         */
        function getType(url) {
            var ext = getExt(url);
            return ~~extTypeDict[ext]; //默认使用binary类型
        }
        /**
         * 获取或创建一个加载列队
         * @param queueID
         * @param list
         * @param priority
         */
        function getOrCreateQueue(queueID, type, priority, list) {
            if (type === void 0) { type = 1 /* FIFO */; }
            var old = queues[queueID];
            if (old) { //已经存在
                if (list) {
                    list.appendTo(old.list);
                }
                return old;
            }
            list = list || [];
            priority = ~~priority;
            var queue = { id: queueID, list: list, priority: priority, type: type };
            queues[queueID] = queue;
            return queue;
        }
        //创建内置分组
        getOrCreateQueue(2 /* Highway */, 1 /* FIFO */, 9999);
        getOrCreateQueue(0 /* Normal */);
        getOrCreateQueue(1 /* Backgroud */, 0 /* FILO */, -9999);
        /**
         * addRes方法的返回值
         */
        var addResResult = [];
        /**
         * 添加资源
         * @param {ResItem} resItem
         * @param {ResQueueID} [queueID=ResQueueID.Normal]
         * @returns {ResItem}
         */
        function addRes(resItem, queueID) {
            if (queueID === void 0) { queueID = 0 /* Normal */; }
            var uri = resItem.uri;
            var old = resDict[uri];
            addResResult[1] = false;
            if (old) {
                if (old != resItem && old.url != resItem.url) {
                    true && jy.ThrowError("\u8D44\u6E90[" + uri + "]\u91CD\u540D\uFF0C\u52A0\u8F7D\u8DEF\u5F84\u5206\u5E03\u4E3A[" + old.url + "]\u548C[" + resItem.url + "]");
                }
                else { //资源和加载路径完全相同
                    var state = old.state;
                    if (state >= 1 /* REQUESTING */) { //正在处理的资源和已经加载完毕的资源，无需添加到任何列队
                        addResResult[0] = old;
                        return addResResult;
                    }
                }
                resItem = old;
            }
            else {
                resDict[uri] = resItem;
            }
            addResResult[0] = resItem;
            var oQID = resItem.qid;
            if (oQID != queueID) {
                var oQueue = queues[oQID];
                if (oQueue) { //从旧列表中移除
                    oQueue.list.remove(resItem);
                }
                //更新列表
                resItem.qid = queueID;
                var queue = getOrCreateQueue(queueID);
                queue.list.pushOnce(resItem);
                addResResult[1] = true;
            }
            return addResResult;
        }
        Res.addRes = addRes;
        /**
         * 加载资源
         * @param {string} uri 资源标识
         * @param {ResCallback} callback 加载完成的回调
         * @param {string} [url] 资源路径
         * @param {ResQueueID} [queueID=ResQueueID.Normal]
         */
        function load(uri, url, callback, queueID) {
            if (queueID === void 0) { queueID = 0 /* Normal */; }
            //检查是否已经有资源
            var item = resDict[uri];
            if (!item) {
                if (!url) {
                    url = jy.ConfigUtils.getResUrl(uri);
                }
                item = { uri: uri, url: url, type: getType(url) };
            }
            loadRes(item, callback, queueID);
        }
        Res.load = load;
        function loadList(list, opt, queueID) {
            if (queueID === void 0) { queueID = 0 /* Normal */; }
            var total = list.length;
            var group = opt.group;
            opt.current = 0;
            opt.total = total;
            opt.list = list;
            for (var i = 0; i < total; i++) {
                var item = list[i];
                item.group = group;
                loadRes(item, jy.CallbackInfo.get(doLoadList, null, opt), queueID);
            }
        }
        Res.loadList = loadList;
        function doLoadList(item, param) {
            var callback = param.callback;
            if (!callback) {
                return;
            }
            var group = param.group;
            if (item.group == group) {
                var onProgress = param.onProgress;
                var doRec = void 0, flag = void 0;
                if (item.state == -1 /* FAILED */) {
                    doRec = true;
                    flag = false;
                }
                else {
                    param.current++;
                    onProgress && onProgress.call(item);
                    if (param.current >= param.total) {
                        doRec = true;
                        flag = true;
                    }
                }
                if (doRec) {
                    param.callback = undefined;
                    param.onProgress = undefined;
                    callback.callAndRecycle(flag);
                    onProgress && onProgress.recycle();
                    var list = param.list;
                    if (!flag && list) {
                        list.forEach(removeItem);
                    }
                }
            }
        }
        /**
         * 同步获取某个资源，如果资源未加载完成，则返回空
         * @param uri 资源标识
         */
        function get(uri) {
            var item = resDict[uri];
            if (item && item.state == 2 /* COMPLETE */) {
                return item.data;
            }
        }
        Res.get = get;
        function set(uri, item) {
            if (!resDict[uri]) {
                resDict[uri] = item;
                return true;
            }
        }
        Res.set = set;
        /**
         * 移除某个资源
         * @param uri
         */
        function remove(uri) {
            var item = resDict[uri];
            removeItem(item);
        }
        Res.remove = remove;
        function removeItem(item) {
            if (item) {
                delete resDict[item.uri];
                var qid = item.qid;
                var queue = queues[qid];
                if (queue) {
                    queue.list.remove(item);
                }
                item.removed = true;
            }
        }
        /**
         * 阻止尝试某个资源加载，目前是还未加载的资源，从列队中做移除，其他状态不处理
         * @param uri
         */
        function cancel(uri) {
            var item = resDict[uri];
            if (item) {
                if (item.state == 0 /* UNREQUEST */) {
                    var qid = item.qid;
                    var queue = queues[qid];
                    if (queue) {
                        queue.list.remove(item);
                    }
                    doCallback(item);
                }
            }
        }
        Res.cancel = cancel;
        /**
         * 加载资源
         * @param {ResItem} resItem
         * @param {ResQueueID} [queueID=ResQueueID.Normal]
         */
        function loadRes(resItem, callback, queueID) {
            if (queueID === void 0) { queueID = 0 /* Normal */; }
            resItem = addRes(resItem, queueID)[0];
            var state = resItem.state;
            if (state == 2 /* COMPLETE */ || (state == -1 /* FAILED */ && resItem.retry > maxRetry && jy.Global.now < ~~resItem.ft)) { //已经加载完成的资源，直接在下一帧回调
                return callback && jy.Global.nextTick(callback.callAndRecycle, callback, resItem); // callback.callAndRecycle(resItem);
            }
            resItem.removed = false;
            if (callback) {
                var list = resItem.callbacks;
                if (!list) {
                    resItem.callbacks = list = [];
                }
                list.push(callback);
            }
            return next();
        }
        Res.loadRes = loadRes;
        /**
         * 获取下一个要加载的资源
         */
        function getNext() {
            var next;
            //得到优先级最大并且
            var high = -Infinity;
            var highQueue;
            for (var key in queues) { //同优先级的列队，基于hash规则加载，一般来说只用内置的3个列队即可解决常规问题
                var queue = queues[key];
                if (queue.list.length) {
                    var priority = queue.priority;
                    if (priority > high) {
                        high = priority;
                        highQueue = queue;
                    }
                }
            }
            if (highQueue) {
                //检查列队类型
                var list = highQueue.list;
                switch (highQueue.type) {
                    case 1 /* FIFO */:
                        next = list.shift();
                        break;
                    case 0 /* FILO */:
                        next = list.pop();
                        break;
                }
            }
            if (!next) {
                if (failedList.length > 0) { //失败列队最后加载
                    next = failedList.shift();
                }
            }
            return next;
        }
        /**
         * 正在加载的资源列队
         */
        var loading = [];
        function next() {
            while (loading.length < maxThread) {
                var item = getNext();
                if (!item)
                    break;
                loading.pushOnce(item);
                var state = ~~item.state;
                if (state == -1 /* FAILED */ && item.ft < jy.Global.now) { //如果失败时间已经超过了失败过期时间，则重新加载
                    state = 0 /* UNREQUEST */;
                }
                switch (state) {
                    case -1 /* FAILED */:
                    case 2 /* COMPLETE */:
                        onItemComplete(item);
                        break;
                    case 0 /* UNREQUEST */: //其他情况不处理
                        var type = item.type;
                        if (type == undefined) {
                            type = getType(item.url);
                        }
                        var loader = loaderMap[type];
                        if (!loader) {
                            loader = binLoader;
                        }
                        //标记为加载中
                        item.state = 1 /* REQUESTING */;
                        loader.loadFile(item, jy.CallbackInfo.get(onItemComplete));
                        break;
                }
            }
        }
        /**
         * 资源加载结束，执行item的回调
         * @param item
         */
        function doCallback(item) {
            var callbacks = item.callbacks;
            if (callbacks) { //执行回调列队
                item.callbacks = undefined;
                for (var i = 0; i < callbacks.length; i++) {
                    var cb = callbacks[i];
                    cb.callAndRecycle(item);
                }
            }
        }
        function onItemComplete(item) {
            loading.remove(item);
            item.qid = undefined;
            var state = ~~item.state;
            if (state == -1 /* FAILED */) {
                var retry = item.retry || 1;
                if (retry > maxRetry) {
                    var now = jy.Global.now;
                    var ft = ~~item.ft;
                    if (now > ft) {
                        item.ft = failedExpiredTime * (retry - maxRetry) + now;
                    }
                    doCallback(item);
                    return jy.dispatch(-187 /* ResLoadFailed */, item);
                }
                item.retry = retry + 1;
                item.state = 0 /* UNREQUEST */;
                failedList.push(item);
            }
            else if (state == 2 /* COMPLETE */) {
                //加载成功，清零retry
                item.retry = 0;
                //检查资源是否被加入到列队中
                doCallback(item);
                jy.dispatch(-186 /* ResLoadSuccess */, item);
            }
            return next();
        }
        function getLocalDB(version, keyPath, storeName) {
            //检查浏览器是否支持IndexedDB
            var w = window;
            w.indexedDB = w.indexedDB ||
                w.mozIndexedDB ||
                w.webkitIndexedDB ||
                w.msIndexedDB;
            if (!w.indexedDB) {
                //不支持indexedDB，不对白鹭的RES做任何调整，直接return
                return;
            }
            w.IDBTransaction = w.IDBTransaction ||
                w.webkitIDBTransaction ||
                w.msIDBTransaction;
            w.IDBKeyRange = w.IDBKeyRange ||
                w.webkitIDBKeyRange ||
                w.msIDBKeyRange;
            try {
                indexedDB.open(storeName, version);
            }
            catch (e) {
                true && jy.ThrowError("\u65E0\u6CD5\u5F00\u542F indexedDB,error:", e);
                return;
            }
            var RW = "readwrite";
            var R = "readonly";
            return {
                /**
                 * 存储资源
                 *
                 * @param {ResItem} data
                 * @param {(this: IDBRequest, ev: Event) => any} callback 存储资源执行完成后的回调
                 */
                save: function (data, callback) {
                    open(function (result) {
                        try {
                            var store = getObjectStore(result, RW);
                            var request = data.uri ? store.put(data) : store.add(data);
                            if (callback) {
                                request.onsuccess = callback;
                                request.onerror = callback;
                            }
                        }
                        catch (e) {
                            return callback && callback(e);
                        }
                    }, function (e) { callback && callback(e); });
                },
                /**
                 * 获取资源
                 *
                 * @param {string} url
                 * @param {{ (data: ResItem) }} callback
                 */
                get: function (url, callback) {
                    open(function (result) {
                        try {
                            var store = getObjectStore(result, R);
                            var request = store.get(url);
                            request.onsuccess = function (e) {
                                callback(e.target.result, url);
                            };
                            request.onerror = function () {
                                callback(null, url);
                            };
                        }
                        catch (e) {
                            true && jy.ThrowError("indexedDB error", e);
                            callback(null, url);
                        }
                    }, function (e) { callback(null, url); });
                },
                /**
                 * 删除指定资源
                 *
                 * @param {string} url
                 * @param {{ (this: IDBRequest, ev: Event) }} callback 删除指定资源执行完成后的回调
                 */
                delete: function (url, callback) {
                    open(function (result) {
                        try {
                            var store = getObjectStore(result, RW);
                            var request = store.delete(url);
                            if (callback) {
                                request.onerror = request.onsuccess = function (e) { callback(url, e); };
                            }
                        }
                        catch (e) {
                            return callback && callback(url, e);
                        }
                    }, function (e) { callback && callback(url, e); });
                },
                /**
                 * 删除全部资源
                 *
                 * @param {{ (this: IDBRequest, ev: Event) }} callback 删除全部资源执行完成后的回调
                 */
                clear: function (callback) {
                    open(function (result) {
                        try {
                            var store = getObjectStore(result, RW);
                            var request = store.clear();
                            if (callback) {
                                request.onsuccess = callback;
                                request.onerror = callback;
                            }
                        }
                        catch (e) {
                            return callback(e);
                        }
                    }, callback);
                },
            };
            function open(callback, onError) {
                try {
                    var request = indexedDB.open(storeName, version);
                }
                catch (e) {
                    true && jy.ThrowError("indexedDB error", e);
                    return onError && onError(e);
                }
                request.onerror = function (e) {
                    onError && onError(e.error);
                    errorHandler(e);
                };
                request.onupgradeneeded = function (e) {
                    var _db = e.target.result;
                    var names = _db.objectStoreNames;
                    if (!names.contains(storeName)) {
                        _db.createObjectStore(storeName, { keyPath: keyPath });
                    }
                };
                request.onsuccess = function (e) {
                    var result = request.result;
                    result.onerror = errorHandler;
                    callback(result);
                };
            }
            function getObjectStore(result, mode) {
                return result.transaction([storeName], mode).objectStore(storeName);
            }
            function errorHandler(ev) {
                jy.ThrowError("indexedDB error", ev.error);
            }
        }
        Res.getLocalDB = getLocalDB;
        /**
         *  尝试启用本地资源缓存
         * @author 3tion(https://github.com/eos3tion/)
         * @export
         * @param {number} [version=1]
         * @returns
         */
        function tryLocal(version, keyPath, storeName) {
            if (version === void 0) { version = 1; }
            if (keyPath === void 0) { keyPath = "uri"; }
            if (storeName === void 0) { storeName = "res"; }
            if (egret.Capabilities.runtimeType != "web" /* WEB */) { //不处理native的情况
                return;
            }
            var db = getLocalDB(version, keyPath, storeName);
            //尝试
            if (!db) { //无法开启 indexedDB，不做后续注入操作
                return;
            }
            var w = window;
            w.URL = window.URL || w.webkitURL;
            //当前ios10还不支持IndexedDB的Blob存储，所以如果是ios，则此值为false
            var canUseBlob = egret.Capabilities.os == "iOS" ? false : !!(window.Blob && window.URL);
            function saveLocal(item, data) {
                item.local = true;
                var uri = item.uri;
                var local = { data: data, version: jy.ConfigUtils.getResVer(uri), uri: uri, url: item.url };
                //存储数据
                db.save(local);
            }
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var BApt = BinLoader.prototype;
            var BAptLoadFile = BApt.loadFile;
            BApt.loadFile = function (resItem, callback) {
                var _this = this;
                if (resItem.noLocal) {
                    BAptLoadFile.call(this, resItem, callback);
                }
                else {
                    return db.get(resItem.uri, function (data) {
                        if (data) { //有数据
                            var local = data.data;
                            if (local) {
                                var ver = jy.ConfigUtils.getResVer(data.uri);
                                if (ver == data.version) {
                                    resItem.data = local;
                                    resItem.state = 2 /* COMPLETE */;
                                    resItem.local = true;
                                    return callback.call(resItem);
                                }
                            }
                        }
                        BAptLoadFile.call(_this, resItem, callback);
                    });
                }
            };
            BApt.onLoadFinish = function (event) {
                var request = event.target;
                var item = request.item, resCB = request.resCB, response = request.response;
                looseRequest(this, request);
                var state = checkItemState(item, event);
                var data;
                if (state == 2 /* COMPLETE */) {
                    data = response;
                }
                var uri = item.uri;
                if (data && !item.local && uri) {
                    //存储数据
                    saveLocal(item, data);
                }
                item.data = data;
                resCB.callAndRecycle(item);
            };
            var eWeb = egret.web;
            if (eWeb) {
                var WILpt = eWeb.WebImageLoader.prototype;
                var obl_1 = WILpt.onBlobLoaded;
                WILpt.onBlobLoaded = function (e) {
                    this.blob = this.request.response;
                    obl_1.call(this, e);
                };
            }
            //注入
            var IApt = ImageLoader.prototype;
            var IAptLoadFile = IApt.loadFile;
            IApt.loadFile = function (resItem, callback) {
                var _this = this;
                var uri = resItem.uri, url = resItem.url, noLocal = resItem.noLocal;
                if (noLocal) {
                    IAptLoadFile.call(this, resItem, callback);
                }
                else {
                    db.get(uri, function (data) {
                        if (data) { //有数据
                            var ver = jy.ConfigUtils.getResVer(uri);
                            if (ver == data.version) {
                                var rawData = data.data;
                                if (rawData instanceof Blob) {
                                    url = URL.createObjectURL(rawData);
                                }
                                else if (typeof rawData === "string") { //DataURL的情况
                                    url = rawData;
                                }
                                else {
                                    if (true) { //其他情况不处理
                                        jy.ThrowError("出现ImageAnalyzer本地缓存不支持的情况");
                                    }
                                }
                                resItem.local = true;
                            }
                        }
                        resItem.url = url;
                        IAptLoadFile.call(_this, resItem, callback);
                    });
                }
            };
            IApt.onLoadFinish = function (event) {
                var request = event.target;
                var item = request.item, resCB = request.resCB, blob = request.blob, dat = request.data;
                request.blob = undefined;
                looseRequest(this, request);
                var uri = item.uri;
                if (!item.local) {
                    item.local = true;
                    var url = item.url;
                    var local = blob;
                    if (!local) {
                        // 普通图片
                        // 尝试转换成DataURL，此方法为同步方法，可能会影响性能
                        if (dat instanceof egret.BitmapData) {
                            var img = dat.source;
                            if (!img) {
                                return;
                            }
                            var w_1 = img.width;
                            var h = img.height;
                            var type = "image/" + url.substring(url.lastIndexOf(".") + 1);
                            canvas.width = w_1;
                            canvas.height = h;
                            context.clearRect(0, 0, w_1, h);
                            context.drawImage(img, 0, 0);
                            try {
                                if (canUseBlob && url.indexOf("wxLocalResource:") != 0) { //微信专用不能使用 blob
                                    canvas.toBlob(function (blob) {
                                        saveLocal(item, blob);
                                    }, type);
                                }
                                else {
                                    local = canvas.toDataURL(type);
                                }
                            }
                            catch (e) {
                                //一般跨域并且没有权限的时候，会参数错误
                            }
                        }
                    }
                    if (local) {
                        if (!canUseBlob && typeof local !== "string") {
                            var a = new FileReader();
                            a.onload = function (e) {
                                saveLocal(item, this.result);
                            };
                            a.readAsDataURL(local);
                        }
                        else {
                            saveLocal(item, local);
                        }
                    }
                }
                var state = checkItemState(item, event);
                if (state == 2 /* COMPLETE */) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(dat);
                    item.data = texture;
                }
                resCB.callAndRecycle(item);
            };
            return db;
        }
        Res.tryLocal = tryLocal;
    })(Res = jy.Res || (jy.Res = {}));
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 资源管理器
     */
    var _resources = {};
    function get(resid, noResHandler, thisObj) {
        var res = getResource(resid);
        if (!res) {
            var args = [];
            for (var i = 3; i < arguments.length; i++) {
                args[i - 3] = arguments[i];
            }
            res = noResHandler.apply(thisObj, args);
            regResource(resid, res);
        }
        return res;
    }
    jy.ResManager = {
        get: get,
        /**
         * 获取纹理资源
         *
         * @param {string} resID 资源id
         * @param {boolean} [noWebp] 是否不加webp后缀
         * @returns {TextureResource}
         */
        getTextureRes: function (resID, noWebp) {
            var resources = _resources;
            var res = resources[resID];
            if (res) {
                if (!(res instanceof jy.TextureResource)) {
                    jy.ThrowError("[" + resID + "]\u8D44\u6E90\u6709\u8BEF\uFF0C\u4E0D\u662FTextureResource");
                    res = undefined;
                }
            }
            if (!res) {
                res = new jy.TextureResource(resID, noWebp);
                resources[resID] = res;
            }
            return res;
        },
        /**
         * 获取资源
         */
        getResource: getResource,
        /**
         * 注册资源
         */
        regResource: regResource,
        //按时间检测资源
        init: function () {
            var tobeDele = [];
            jy.TimerUtil.addCallback(30000 /* CheckTime */, function () {
                var expire = jy.Global.now - 300000 /* DisposeTime */;
                var reses = _resources;
                var delLen = 0;
                for (var key in reses) {
                    var res = reses[key];
                    if (!res.isStatic && res.lastUseTime < expire) {
                        tobeDele[delLen++] = key;
                    }
                }
                // //对附加的checker进行检查
                // for (let i = 0; i < _checkers.length; i++) {
                //     _checkers[i].resCheck(expire);
                // }
                for (var i = 0; i < delLen; i++) {
                    var key = tobeDele[i];
                    var res = reses[key];
                    if (res) {
                        res.dispose();
                        jy.Res.remove(res.uri);
                        delete reses[key];
                    }
                }
            });
        }
    };
    /**
     * 获取资源
     */
    function getResource(resID) {
        return _resources[resID];
    }
    /**
     * 注册资源
     */
    function regResource(resID, res) {
        var resources = _resources;
        if (resID in resources) { //资源id重复                
            return resources[resID] === res;
        }
        resources[resID] = res;
        return true;
    }
})(jy || (jy = {}));
if (true) {
    var ErrorTexture = jy.ColorUtil.getTexture(0xff0000, 1);
}
var jy;
(function (jy) {
    /**
     *
     * 纹理资源
     * @export
     * @class TextureResource
     * @implements {IResource}
     */
    var TextureResource = /** @class */ (function () {
        function TextureResource(uri, noWebp) {
            /**
             *
             * 绑定的对象列表
             * @private
             * @type {Bitmap[]}
             */
            this._list = [];
            this.uri = uri;
            this.url = jy.ConfigUtils.getResUrl(uri + (!noWebp ? jy.Global.webp : ""));
        }
        Object.defineProperty(TextureResource.prototype, "isStatic", {
            /**
             *
             * 是否为静态不销毁的资源
             * @type {boolean}
             */
            get: function () {
                return this._list.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * 绑定一个目标
         * @param {Bitmap} target
         */
        TextureResource.prototype.bind = function (bmp) {
            if (this._tex) {
                bmp.texture = this._tex;
                bmp.dispatch(-193 /* Texture_Complete */);
            }
            this._list.pushOnce(bmp);
            this.lastUseTime = jy.Global.now;
        };
        /**
         *
         * 解除目标的绑定
         * @param {Bitmap} target
         */
        TextureResource.prototype.loose = function (bmp) {
            this._list.remove(bmp);
            this.lastUseTime = jy.Global.now;
        };
        TextureResource.prototype.load = function () {
            jy.Res.loadRes({
                uri: this.uri,
                url: this.url,
                type: 2 /* Image */
            }, jy.CallbackInfo.get(this.loadComplete, this), this.qid);
        };
        /**
         * 资源加载完成
         */
        TextureResource.prototype.loadComplete = function (item) {
            var data = item.data, uri = item.uri;
            if (uri == this.uri) {
                this._tex = data;
                for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                    var bmp = _a[_i];
                    bmp.texture = data;
                    if (true && !data) {
                        bmp.texture = bmp.placehoder || ErrorTexture;
                        var rect = bmp.suiRawRect;
                        if (rect) {
                            bmp.width = rect.width;
                            bmp.height = rect.height;
                        }
                    }
                    bmp.dispatch(-193 /* Texture_Complete */);
                }
            }
        };
        /**
         * 销毁资源
         */
        TextureResource.prototype.dispose = function () {
            if (this._tex) {
                this._tex.dispose();
                this._tex = undefined;
            }
            this._list.length = 0;
        };
        return TextureResource;
    }());
    jy.TextureResource = TextureResource;
    __reflect(TextureResource.prototype, "jy.TextureResource", ["jy.IResource"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
    * 限制列队
    * @author 3tion
    */
    var LimitQueue = /** @class */ (function () {
        function LimitQueue() {
            this._queue = [];
            this.listener = new jy.StateMachine();
        }
        LimitQueue.prototype.addLimiter = function (item) {
            var queue = this._queue;
            if (queue.indexOf(item) > -1) {
                item.setState(this._current);
                queue.push(item);
                return true;
            }
        };
        /**
         * 设置状态
         * @param value
         *
         */
        LimitQueue.prototype.setState = function (value) {
            this._current = value;
            var queue = this._queue;
            if (queue) {
                for (var i = 0; i < queue.length; i++) {
                    var item = queue[i];
                    item.setState(value);
                }
            }
            var lm = this.listener;
            //查看是否有侦听状态变化的对像;
            if (lm) {
                lm.setState(value);
            }
        };
        LimitQueue.prototype.removeLimiter = function (item) {
            return this._queue.remove(item);
        };
        LimitQueue.prototype.clear = function () {
            this._queue.length = 0;
        };
        /**
         * 是否被限制了
         * @param type
         * @return
         *
         */
        LimitQueue.prototype.check = function (type) {
            var queue = this._queue;
            if (queue) {
                for (var i = 0; i < queue.length; i++) {
                    var limit = queue[i];
                    if (limit && limit.check(type)) {
                        return true;
                    }
                }
            }
        };
        return LimitQueue;
    }());
    jy.LimitQueue = LimitQueue;
    __reflect(LimitQueue.prototype, "jy.LimitQueue", ["jy.ILimit"]);
    /**
     * 像浏览器的历史记录;
     */
    var historys = [];
    var _currentState;
    jy.UILimiter = {
        impl: new LimitQueue(),
        MaxHistory: 5,
        get current() {
            return _currentState;
        },
        /**
         * 取得状态侦听管理器(以便注册关注的状态)
         * @return
         *
         */
        get listener() {
            return this.impl.listener;
        },
        enter: function (scene) {
            if (_currentState != scene) {
                _currentState = scene;
                this.impl.setState(scene);
                historys.push(scene);
                //只存5个历史记录;
                if (historys.length > this.MaxHistory) {
                    historys.shift();
                }
            }
        },
        /**
         * 退出
         *
         * @param {Key} [scene] 无法得到你当前切入的状态时,除非非常确定不会重复调用两次,否者不允许不传值
         * @returns
         */
        exit: function (scene) {
            scene = scene || _currentState;
            if (_currentState != scene) {
                return;
            }
            var len = historys.length;
            //弹出当前记录;
            historys.pop();
            //还原上一个记录;
            var last = len > 1 ? historys.pop() : 0 /* Default */;
            this.enter(last);
        },
        /**
         *
         * @param {Key} scene 被检查的Scene
         * @returns {boolean} 检查是否被限制 (true为被限制，false没有限制)
         */
        check: function (scene) {
            return this.impl.check(scene);
        }
    };
    function addToStates(value) {
        var _a;
        var ids = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ids[_i - 1] = arguments[_i];
        }
        (_a = jy.UILimiter.listener).addToStates.apply(_a, [value].concat(ids));
    }
    jy.addToStates = addToStates;
    function addToState(id, value) {
        jy.UILimiter.listener.addToState(id, value);
    }
    jy.addToState = addToState;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 使用数值或者字符串类型作为Key
     * V 作为Value的字典
     * 原生的map(ECMAScript5无Map)无法自定义列表顺序，而是完全按照加载顺序的，所以才需要有此类型
     * 列表存储Value
     * @author 3tion
     * @class ArraySet
     * @template V
     */
    var ArraySet = /** @class */ (function () {
        function ArraySet() {
            this._list = [];
            this._dict = {};
        }
        Object.defineProperty(ArraySet.prototype, "rawList", {
            /**
             * 获取原始列表，用于重新排序
             * 请不要直接进行 + - 值，使用set delete 方法进行处理
             * @readonly
             *
             */
            get: function () {
                return this._list;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArraySet.prototype, "rawDict", {
            /**
             * 获取原始的字典
             * 请不要直接行 + - 值，使用set delete 方法进行处理
             * @readonly
             *
             */
            get: function () {
                return this._dict;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置原始字典
         *
         * @param { [index: string]: V } dict
         *
         */
        ArraySet.prototype.setRawDict = function (dict) {
            this._dict = dict;
            var list = this._list;
            var i = 0;
            for (var key in dict) {
                list[i++] = dict[key];
            }
            list.length = i;
            return this;
        };
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
        ArraySet.prototype.setRawList = function (list, keyPro) {
            var rawList = this._list;
            var dict = this._dict = {};
            var i = 0;
            if (list) {
                for (var len = list.length; i < len; i++) {
                    var item = list[i];
                    dict[item[keyPro]] = item;
                    rawList[i] = item;
                }
            }
            rawList.length = i;
            return this;
        };
        /**
         *
         * 设置数据
         *
         * @param {Key} key
         * @param {V} value
         * @return {number} 返回值加入到数据中的索引
         */
        ArraySet.prototype.set = function (key, value) {
            var _a = this, _dict = _a._dict, _list = _a._list;
            var idx;
            var changed;
            if (key in _dict) { //有原始数据
                var old = _dict[key];
                idx = _list.indexOf(old);
                if (old != value) {
                    changed = true;
                }
            }
            else {
                idx = _list.length;
                changed = true;
            }
            if (changed) {
                _list[idx] = value;
                _dict[key] = value;
            }
            return idx;
        };
        /**
         * 获取数据
         *
         * @param {Key} key
         * @returns
         *
         */
        ArraySet.prototype.get = function (key) {
            return this._dict[key];
        };
        /**
         * 根据key移除数据
         *
         * @param {Key} key
         *
         */
        ArraySet.prototype.delete = function (key) {
            var _a = this, _dict = _a._dict, _list = _a._list;
            var old = _dict[key];
            delete _dict[key];
            if (old) {
                var idx = _list.indexOf(old);
                if (idx > -1) {
                    _list.splice(idx, 1);
                }
            }
            return old;
        };
        /**
         * 清理数据
         *
         *
         */
        ArraySet.prototype.clear = function () {
            this._list.length = 0;
            this._dict = {};
        };
        Object.defineProperty(ArraySet.prototype, "size", {
            /**
             * 获取总长度
             *
             * @readonly
             *
             */
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
        return ArraySet;
    }());
    jy.ArraySet = ArraySet;
    __reflect(ArraySet.prototype, "jy.ArraySet");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 方便后续调整
     * 加入ProtoBuf的varint支持
     * @author 3tion
     *
     */
    var ByteArray = /** @class */ (function (_super) {
        __extends(ByteArray, _super);
        function ByteArray(buffer, ext) {
            return _super.call(this, buffer, ext) || this;
        }
        /**
         * 替换缓冲区
         *
         * @param {ArrayBuffer} value
         */
        ByteArray.prototype.replaceBuffer = function (value) {
            this.write_position = value.byteLength;
            this._bytes = new Uint8Array(value);
            this.data = new DataView(value);
        };
        /**
         *
         * 读取指定长度的Buffer
         * @param {number} length       指定的长度
         * @returns {Buffer}
         */
        ByteArray.prototype.readBuffer = function (length) {
            if (!this.validate(length))
                return;
            var start = this.position;
            this.position += length;
            return this.buffer.slice(start, this.position);
        };
        ByteArray.prototype.readInt64 = function () {
            if (this.validate(8 /* SIZE_OF_INT64 */)) {
                var low = void 0, high = void 0;
                var flag = this.$endian == 0 /* LITTLE_ENDIAN */;
                var data = this.data;
                var pos = this._position;
                if (flag) {
                    low = data.getUint32(pos, flag);
                    high = data.getUint32(pos + 4 /* SIZE_OF_UINT32 */, flag);
                }
                else {
                    high = data.getUint32(pos, flag);
                    low = data.getUint32(pos + 4 /* SIZE_OF_UINT32 */, flag);
                }
                this.position = pos + 8 /* SIZE_OF_INT64 */;
                return jy.Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeInt64 = function (value) {
            this.validateBuffer(8 /* SIZE_OF_INT64 */);
            var i64 = jy.Int64.fromNumber(value);
            var high = i64.high, low = i64.low;
            var flag = this.$endian == 0 /* LITTLE_ENDIAN */;
            var data = this.data;
            var pos = this._position;
            if (flag) {
                data.setUint32(pos, low, flag);
                data.setUint32(pos + 4 /* SIZE_OF_UINT32 */, high, flag);
            }
            else {
                data.setUint32(pos, high, flag);
                data.setUint32(pos + 4 /* SIZE_OF_UINT32 */, low, flag);
            }
            this.position = pos + 8 /* SIZE_OF_INT64 */;
        };
        /**
         * 读取ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        ByteArray.prototype.readPBDouble = function () {
            if (this.validate(8 /* SIZE_OF_DOUBLE */)) {
                var value = this.data.getFloat64(this._position, true);
                this.position += 8 /* SIZE_OF_DOUBLE */;
                return value;
            }
        };
        /**
         * 写入ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         * @param value
         */
        ByteArray.prototype.writePBDouble = function (value) {
            this.validateBuffer(8 /* SIZE_OF_DOUBLE */);
            this.data.setFloat64(this._position, value, true);
            this.position += 8 /* SIZE_OF_DOUBLE */;
        };
        /**
         * 读取ProtoBuf的`Float`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        ByteArray.prototype.readPBFloat = function () {
            if (this.validate(4 /* SIZE_OF_FLOAT */)) {
                var value = this.data.getFloat32(this._position, true);
                this.position += 4 /* SIZE_OF_FLOAT */;
                return value;
            }
        };
        /**
          * 写入ProtoBuf的`Float`
          * protobuf封装是使用littleEndian的，不受Endian影响
          * @param value
          */
        ByteArray.prototype.writePBFloat = function (value) {
            this.validateBuffer(4 /* SIZE_OF_FLOAT */);
            this.data.setFloat32(this._position, value, true);
            this.position += 4 /* SIZE_OF_FLOAT */;
        };
        ByteArray.prototype.readFix32 = function () {
            if (this.validate(4 /* SIZE_OF_FIX32 */)) {
                var value = this.data.getUint32(this._position, true);
                this.position += 4 /* SIZE_OF_UINT32 */;
                return value;
            }
        };
        ByteArray.prototype.writeFix32 = function (value) {
            this.validateBuffer(4 /* SIZE_OF_FIX32 */);
            this.data.setUint32(this._position, value, true);
            this.position += 4 /* SIZE_OF_FIX32 */;
        };
        ByteArray.prototype.readSFix32 = function () {
            if (this.validate(4 /* SIZE_OF_SFIX32 */)) {
                var value = this.data.getInt32(this._position, true);
                this.position += 4 /* SIZE_OF_SFIX32 */;
                return value;
            }
        };
        ByteArray.prototype.writeSFix32 = function (value) {
            this.validateBuffer(4 /* SIZE_OF_SFIX32 */);
            this.data.setInt32(this._position, value, true);
            this.position += 4 /* SIZE_OF_SFIX32 */;
        };
        ByteArray.prototype.readFix64 = function () {
            if (this.validate(8 /* SIZE_OF_FIX64 */)) {
                var pos = this._position;
                var data = this.data;
                var low = data.getUint32(pos, true);
                var high = data.getUint32(pos + 4 /* SIZE_OF_UINT32 */, true);
                this.position = pos + 8 /* SIZE_OF_FIX64 */;
                return jy.Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeFix64 = function (value) {
            var i64 = jy.Int64.fromNumber(value);
            this.validateBuffer(8 /* SIZE_OF_FIX64 */);
            var pos = this._position;
            var data = this.data;
            data.setUint32(pos, i64.low, true);
            data.setUint32(pos + 4 /* SIZE_OF_UINT32 */, i64.high, true);
            this.position = pos + 8 /* SIZE_OF_FIX64 */;
        };
        /**
         *
         * 读取指定长度的ByteArray
         * @param {number} length       指定的长度
         * @param {number} [ext=0]      ByteArray扩展长度参数
         * @returns {ByteArray}
         */
        ByteArray.prototype.readByteArray = function (length, ext) {
            if (ext === void 0) { ext = 0; }
            var ba = new jy.ByteArray(this.readBuffer(length), ext);
            ba.$endian = this.$endian;
            return ba;
        };
        /**
         * 向字节流中写入64位的可变长度的整数(Protobuf)
         */
        ByteArray.prototype.writeVarint64 = function (value) {
            var i64 = jy.Int64.fromNumber(value);
            var high = i64.high;
            var low = i64.low;
            if (high == 0) {
                this.writeVarint(low);
            }
            else {
                for (var i = 0; i < 4; ++i) {
                    this.writeByte((low & 0x7F) | 0x80);
                    low >>>= 7;
                }
                if ((high & (0xFFFFFFF << 3)) == 0) {
                    this.writeByte((high << 4) | low);
                }
                else {
                    this.writeByte((((high << 4) | low) & 0x7F) | 0x80);
                    this.writeVarint(high >>> 3);
                }
            }
        };
        /**
         * 向字节流中写入32位的可变长度的整数(Protobuf)
         */
        ByteArray.prototype.writeVarint = function (value) {
            for (;;) {
                if (value < 0x80) {
                    this.writeByte(value);
                    return;
                }
                else {
                    this.writeByte((value & 0x7F) | 0x80);
                    value >>>= 7;
                }
            }
        };
        /**
         * 读取字节流中的32位变长整数(Protobuf)
         */
        ByteArray.prototype.readVarint = function () {
            var result = 0;
            for (var i = 0;; i += 7) {
                if (i < 32) {
                    var b = this.readUnsignedByte();
                    if (b >= 0x80) {
                        result |= ((b & 0x7f) << i);
                    }
                    else {
                        result |= (b << i);
                        break;
                    }
                }
                else {
                    while (this.readUnsignedByte() >= 0x80) { }
                    break;
                }
            }
            return result;
        };
        /**
          * 读取字节流中的32位变长整数(Protobuf)
          */
        ByteArray.prototype.readVarint64 = function () {
            var b, low, high, i = 0;
            for (;; i += 7) {
                b = this.readUnsignedByte();
                if (i == 28) {
                    break;
                }
                else {
                    if (b >= 0x80) {
                        low |= ((b & 0x7f) << i);
                    }
                    else {
                        low |= (b << i);
                        return jy.Int64.toNumber(low, high);
                    }
                }
            }
            if (b >= 0x80) {
                b &= 0x7f;
                low |= (b << i);
                high = b >>> 4;
            }
            else {
                low |= (b << i);
                high = b >>> 4;
                return jy.Int64.toNumber(low, high);
            }
            for (i = 3;; i += 7) {
                b = this.readUnsignedByte();
                if (i < 32) {
                    if (b >= 0x80) {
                        high |= ((b & 0x7f) << i);
                    }
                    else {
                        high |= (b << i);
                        break;
                    }
                }
            }
            return jy.Int64.toNumber(low, high);
        };
        Object.defineProperty(ByteArray.prototype, "outBytes", {
            /**
             * 获取写入的字节
             * 此方法不会新建 ArrayBuffer
             * @readonly
             * @memberof ByteArray
             */
            get: function () {
                return new Uint8Array(this._bytes.buffer, 0, this.write_position);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 重置索引
         *
         * @memberof ByteArray
         */
        ByteArray.prototype.reset = function () {
            this.write_position = this.position = 0;
        };
        return ByteArray;
    }(egret.ByteArray));
    jy.ByteArray = ByteArray;
    __reflect(ByteArray.prototype, "jy.ByteArray");
})(jy || (jy = {}));
var jy;
(function (jy) {
    ;
})(jy || (jy = {}));
var jy;
(function (jy) {
    function defaultCompare(a, b) {
        return a - b;
    }
    /**
     * 固定大小的堆栈数据
     */
    var Heap = /** @class */ (function () {
        function Heap(size, compare) {
            if (compare === void 0) { compare = defaultCompare; }
            var maxSize = size + 1;
            this.heap = new Array(maxSize);
            this.maxSize = maxSize;
            this.compare = compare;
            this._count = 0;
        }
        /**
         * 获取堆中，第一个元素
         */
        Heap.prototype.peek = function () {
            return this.heap[1];
        };
        Heap.prototype.put = function (obj) {
            var _a = this, _count = _a._count, maxSize = _a.maxSize, heap = _a.heap, compare = _a.compare;
            _count++;
            if (_count < maxSize) {
                heap[_count] = obj;
                var i = _count;
                var parent_2 = i >> 1;
                var tmp = heap[i];
                while (parent_2 > 0) {
                    var v = heap[parent_2];
                    if (compare(tmp, v) > 0) {
                        heap[i] = v;
                        i = parent_2;
                        parent_2 >>= 1;
                    }
                    else
                        break;
                }
                heap[i] = tmp;
                this._count = _count;
                return true;
            }
        };
        Heap.prototype.pop = function () {
            var _a = this, _count = _a._count, heap = _a.heap, compare = _a.compare;
            if (_count >= 1) {
                var o = heap[1];
                heap[1] = heap[_count];
                heap[_count] = undefined;
                var i = 1;
                var child = 2;
                var tmp = heap[i];
                var _count_1 = _count - 1;
                while (child < _count) {
                    if (child < _count_1 && compare(heap[child], heap[child + 1]) < 0) {
                        child++;
                    }
                    var v = heap[child];
                    if (compare(tmp, v) < 0) {
                        heap[i] = v;
                        i = child;
                        child <<= 1;
                    }
                    else
                        break;
                }
                this._count = _count - 1;
                return o;
            }
        };
        Heap.prototype.clear = function (newSize) {
            var heap = this.heap;
            heap.length = 0;
            var maxSize = this.maxSize;
            if (newSize > 0) {
                maxSize = newSize + 1;
                //@ts-ignore
                this.maxSize = maxSize;
            }
            heap.length = maxSize;
            this._count = 0;
        };
        Object.defineProperty(Heap.prototype, "size", {
            get: function () {
                return this._count;
            },
            enumerable: true,
            configurable: true
        });
        Heap.prototype.toArray = function () {
            return this.heap.slice(1, this._count + 1);
        };
        /**
         * 遍历堆中元素
         * @param callbackfn 回调函数，如果返回true，停止遍历
         * @param thisArg 回调函数的 this 指针
         */
        Heap.prototype.forEach = function (callbackfn, thisArg) {
            var _a = this, heap = _a.heap, _count = _a._count;
            _count++;
            for (var i = 1; i < _count; i++) {
                var v = heap[i];
                if (v != undefined && callbackfn.call(thisArg, v, i, this)) {
                    break;
                }
            }
        };
        return Heap;
    }());
    jy.Heap = Heap;
    __reflect(Heap.prototype, "jy.Heap");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
     * @author
     *
     */
    var Int64 = /** @class */ (function () {
        function Int64(low, high) {
            this.low = low | 0;
            this.high = high | 0;
        }
        Int64.prototype.toNumber = function () {
            return this.high * _2_32 + (this.low >>> 0);
        };
        Int64.toNumber = function (low, high) {
            return (high | 0) * _2_32 + (low >>> 0);
        };
        Int64.fromNumber = function (value) {
            if (isNaN(value) || !isFinite(value)) {
                return ZERO;
            }
            if (value <= -_2_63) {
                return MIN_VALUE;
            }
            if (value + 1 >= _2_63) {
                return MAX_VALUE;
            }
            if (value < 0) {
                var v = Int64.fromNumber(-value);
                if (v.high === MIN_VALUE.high && v.low === MIN_VALUE.low) {
                    return MIN_VALUE;
                }
                v.low = ~v.low;
                v.high = ~v.high;
                return v.add(ONE);
            }
            else {
                return new Int64((value % _2_32) | 0, (value / _2_32) | 0);
            }
        };
        Int64.prototype.add = function (addend) {
            var a48 = this.high >>> 16;
            var a32 = this.high & 0xFFFF;
            var a16 = this.low >>> 16;
            var a00 = this.low & 0xFFFF;
            var b48 = addend.high >>> 16;
            var b32 = addend.high & 0xFFFF;
            var b16 = addend.low >>> 16;
            var b00 = addend.low & 0xFFFF;
            var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
            c00 += a00 + b00;
            c16 += c00 >>> 16;
            c00 &= 0xFFFF;
            c16 += a16 + b16;
            c32 += c16 >>> 16;
            c16 &= 0xFFFF;
            c32 += a32 + b32;
            c48 += c32 >>> 16;
            c32 &= 0xFFFF;
            c48 += a48 + b48;
            c48 &= 0xFFFF;
            return new Int64((c16 << 16) | c00, (c48 << 16) | c32);
        };
        return Int64;
    }());
    jy.Int64 = Int64;
    __reflect(Int64.prototype, "jy.Int64");
    /**
     * 2的16次方
     */
    var _2_16 = 1 << 16;
    /**
     * 2的32次方
     */
    var _2_32 = _2_16 * _2_16;
    /**
     * 2的64次方
     */
    var _2_64 = _2_32 * _2_32;
    /**
     * 2的63次方
     */
    var _2_63 = _2_64 / 2;
    var ZERO = new Int64();
    var MAX_VALUE = new Int64(-1, 0x7FFFFFFF);
    var MIN_VALUE = new Int64(0, -2147483648);
    var ONE = new Int64(1);
})(jy || (jy = {}));
var jy;
(function (jy) {
    jy.Location = {
        /**
         * 根据两个经纬度获取距离(单位：米)
         *
         * @param {Location} l1
         * @param {Location} l2
         * @returns 距离(单位：米)
         */
        getDist: function (l1, l2) {
            var dtr = Math.DEG_TO_RAD;
            var radlat1 = l1.latitude * dtr;
            var radlat2 = l2.latitude * dtr;
            var a = radlat1 - radlat2;
            var b = (l1.longitude - l2.longitude) * dtr;
            return Math.asin(Math.sqrt(Math.pow(Math.sin(a * .5), 2) + Math.cos(radlat1) * Math.cos(radlat2) * (Math.pow(Math.sin(b * .5), 2)))) * 12756274;
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 时间处理函数
     * DateUtils
     */
    var _sharedDate = new Date();
    /**
     * 获取运行时间
     * 此时间为进程运行时间，不会随着调整系统时间而变动
     */
    var getTimer = Date.now;
    var _defaultCountFormats;
    /**
     * 基于UTC的时间偏移
     *
     * @private
     * @static
     * @type {number}
     */
    var _utcOffset = -_sharedDate.getTimezoneOffset() * 60000 /* ONE_MINUTE */; //默认使用当前时区，防止一些报错
    /**
     * 服务器UTC偏移后的基准时间
     *
     * @private
     * @static
     * @type {number}
     */
    var _serverUTCTime = _utcOffset; //默认使用本地时间
    jy.DateUtils = {
        /**
         * 获取共享时间
         */
        get sharedDate() {
            return _sharedDate;
        },
        getDefaultCDFOption: getDefaultCDFOption,
        regCDFormat: function (format, opt) {
            initDefaultCDFormats();
            _defaultCountFormats[format] = opt;
        },
        initServerTime: function (time, timezoneOffset) {
            _utcOffset = -timezoneOffset * 60000 /* ONE_MINUTE */;
            this.setServerTime(time);
        },
        setServerTime: function (time) {
            _serverUTCTime = time - getTimer() + _utcOffset;
        },
        get utcServerTime() {
            return _serverUTCTime + getTimer();
        },
        get serverTime() {
            return this.utcServerTime - _utcOffset;
        },
        get utcServerDate() {
            _sharedDate.setTime(this.utcServerTime);
            return _sharedDate;
        },
        get serverDate() {
            _sharedDate.setTime(this.serverTime);
            return _sharedDate;
        },
        getFormatTime: function (time, format, isRaw) {
            if (isRaw === void 0) { isRaw = true; }
            if (isRaw) {
                time = this.getUTCTime(time);
            }
            _sharedDate.setTime(time);
            return _sharedDate.format(format);
        },
        getDayEnd: function (time) {
            if (time === undefined)
                time = this.serverTime;
            _sharedDate.setTime(time);
            return _sharedDate.setHours(23, 59, 59, 999);
        },
        getUTCDayEnd: function (utcTime) {
            if (utcTime === undefined)
                utcTime = this.utcServerTime;
            _sharedDate.setTime(utcTime);
            return _sharedDate.setUTCHours(23, 59, 59, 999);
        },
        getDayStart: function (time) {
            if (time === undefined)
                time = jy.DateUtils.serverTime;
            _sharedDate.setTime(time);
            return _sharedDate.setHours(0, 0, 0, 0);
        },
        getUTCDayStart: function (utcTime) {
            if (utcTime === undefined)
                utcTime = jy.DateUtils.utcServerTime;
            _sharedDate.setTime(utcTime);
            return _sharedDate.setUTCHours(0, 0, 0, 0);
        },
        /**
         * 将服务器有偏移量的时间戳，转换成显示时间相同的UTC时间戳，用于做显示
         *
         * @static
         * @param {number} time 正常的时间戳
         * @returns {number} UTC偏移后的时间戳
         */
        getUTCTime: function (time) {
            return time + _utcOffset;
        },
        getDayCount: function (startTime, endTime) {
            endTime = jy.DateUtils.getDayStart(endTime);
            return Math.ceil((endTime - startTime) / 86400000 /* ONE_DAY */) + 1;
        },
        getUTCDayCount: function (startTime, endTime) {
            endTime = jy.DateUtils.getUTCDayStart(endTime);
            return Math.ceil((endTime - startTime) / 86400000 /* ONE_DAY */) + 1;
        },
        /**
         * 显示倒计时
         *
         * @static
         * @param {number} leftTime 剩余时间
         * @param {CountDownFormatOption} format 倒计时修饰符，
         * format 示例：{d:"{0}天",h:"{0}小时",m:"{0}分",s:"{0}秒"}
         */
        getCountdown: function (leftTime, format) {
            if (typeof format === "number") {
                format = getDefaultCDFOption(format);
            }
            var out = "";
            var tmp = format.d;
            if (tmp) { // 需要显示天
                var day = leftTime / 86400000 /* ONE_DAY */ >> 0;
                leftTime = leftTime - day * 86400000 /* ONE_DAY */;
                out += tmp.substitute(day);
            }
            tmp = format.h;
            if (tmp) { // 需要显示小时
                var hour = leftTime / 3600000 /* ONE_HOUR */ >> 0;
                leftTime = leftTime - hour * 3600000 /* ONE_HOUR */;
                if (format.hh) {
                    hour = hour.zeroize(2);
                }
                out += tmp.substitute(hour);
            }
            tmp = format.m;
            if (tmp) { // 需要显示分钟
                var minute = leftTime / 60000 /* ONE_MINUTE */ >> 0;
                leftTime = leftTime - minute * 60000 /* ONE_MINUTE */;
                if (format.mm) {
                    minute = minute.zeroize(2);
                }
                out += tmp.substitute(minute);
            }
            tmp = format.s;
            if (tmp) {
                var second = leftTime / 1000 /* ONE_SECOND */ >> 0;
                if (format.ss) {
                    second = second.zeroize(2);
                }
                out += tmp.substitute(second);
            }
            return out;
        }
    };
    /**
     * CountDownFormat
     * 获取默认的`倒计时`格式
        $_ndays	{0}天
        $_nhours	{0}小时
        $_nminutes	{0}分钟
        $_nsecends	{0}秒

     * @static
     * @param {CountDownFormat} format
     * @returns {CountDownFormatOption}
     *
     * @memberOf DateUtils
     */
    function getDefaultCDFOption(format) {
        if (initDefaultCDFormats()) {
            jy.DateUtils.getDefaultCDFOption = _getDefaultCDFOption;
        }
        return _getDefaultCDFOption(format);
        function _getDefaultCDFOption(format) {
            return _defaultCountFormats[format];
        }
    }
    function initDefaultCDFormats() {
        var _a;
        if (!_defaultCountFormats) {
            var LangUtil_1 = jy.LangUtil;
            _defaultCountFormats = (_a = {},
                _a[0 /* D_H_M_S */] = { d: LangUtil_1.getMsg("$_ndays"), h: LangUtil_1.getMsg("$_nhours"), m: LangUtil_1.getMsg("$_nminutes"), s: LangUtil_1.getMsg("$_nsecends") },
                _a[1 /* H_M_S */] = { h: LangUtil_1.getMsg("$_nhours"), m: LangUtil_1.getMsg("$_nminutes"), s: LangUtil_1.getMsg("$_nsecends") },
                _a[2 /* H_M */] = { h: LangUtil_1.getMsg("$_nhours"), m: LangUtil_1.getMsg("$_nminutes") },
                _a[3 /* M_S */] = { m: LangUtil_1.getMsg("$_nminutes"), s: LangUtil_1.getMsg("$_nsecends") },
                _a[4 /* S */] = { s: LangUtil_1.getMsg("$_nsecends") },
                _a);
            return true;
        }
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 解析数据
     *
     * @private
     * @param {number} hour
     * @param {number} minute
     * @returns
     */
    function _decode(_this, hour, minute) {
        _this.hour = hour;
        _this.minute = minute;
        _this.time = hour * 3600000 /* ONE_HOUR */ + minute * 60000 /* ONE_MINUTE */;
        _this.strTime = hour.zeroize(2) + ":" + minute.zeroize(2);
        return _this;
    }
    /**
     * TimveVO
     */
    var TimeVO = /** @class */ (function () {
        function TimeVO(timeStr) {
            if (timeStr) {
                this.decode(timeStr);
            }
        }
        /**
         * 从分钟进行解析
         *
         * @param {number} minutes 分钟数
         */
        TimeVO.prototype.decodeMinutes = function (minutes) {
            return _decode(this, minutes / 60 | 0, minutes % 60);
        };
        /**
         * 从一个数值进行序列化
         * decodeMinutes和decodeBit，如果使用protobuf writeVarint32 存储，时间只要超过 02:08，不管如何使用何种方式，一定会超过2字节，而 23:59，不管怎么存储，都不会超过2字节
         * decodeBit解析比 decodeMinutes更加快捷
         * 而 hour<<6|minute  解析会更简单，快速
         * @param {number} value
         */
        TimeVO.prototype.decodeBit = function (value) {
            return _decode(this, value >> 6, value & 63);
        };
        /**
         * 从字符串中解析
         *
         * @param {number} strTime 通过解析器解析的数据
         */
        TimeVO.prototype.decode = function (strTime) {
            var timeArr = strTime.split(":");
            if (timeArr.length >= 2) {
                return _decode(this, +timeArr[0], +timeArr[1]);
            }
            else {
                jy.ThrowError("时间格式不正确，不为HH:mm格式，当前配置：" + strTime);
            }
        };
        Object.defineProperty(TimeVO.prototype, "todayTime", {
            /**
            * 获取今日的服务器时间
            *
            * @readonly
            * @memberOf TimeVO
            */
            get: function () {
                return this.getDayTime();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取指定时间戳那天的时间
         *
         * @param {number} [day]
         * @param {boolean} [isUTC]
         * @returns
         * @memberof TimeVO
         */
        TimeVO.prototype.getDayTime = function (day, isUTC) {
            var dayStart = isUTC ? jy.DateUtils.getDayStart : jy.DateUtils.getDayStart;
            return dayStart(day) + this.time;
        };
        return TimeVO;
    }());
    jy.TimeVO = TimeVO;
    __reflect(TimeVO.prototype, "jy.TimeVO");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 圆圈倒计时
     *
     * @export
     * @class CircleCountdown
     */
    var CircleCountdown = /** @class */ (function () {
        function CircleCountdown() {
            /**
             * 绘制的线的宽度
             *
             * @protected
             *
             * @memberOf CircleCountdown
             */
            this._sw = 2;
            this._total = 0;
            this._cfgs = [];
        }
        CircleCountdown.prototype.setGraphis = function (graphics) {
            this._g = graphics;
            return this;
        };
        CircleCountdown.prototype.setCenter = function (centerX, centerY) {
            this._cX = centerX;
            this._cY = centerY;
            return this;
        };
        CircleCountdown.prototype.setRadius = function (radius) {
            this._radius = radius;
            return this;
        };
        /**
         * 设置起始角度和结束角度
         *
         * @param {number} [rad=0]
         *
         * @memberOf CircleCountdown
         */
        CircleCountdown.prototype.setRad = function (startRad, endRad) {
            if (startRad === void 0) { startRad = 0; }
            if (endRad === void 0) { endRad = Math.PI; }
            this._sRad = startRad;
            this._eRad = endRad;
            this._dRad = endRad - startRad;
            return this;
        };
        /**
         * 设置线的宽度
         *
         * @param {number} [strokeWidth=1]
         * @returns
         *
         * @memberOf CircleCountdown
         */
        CircleCountdown.prototype.setStrokeWidth = function (strokeWidth) {
            if (strokeWidth === void 0) { strokeWidth = 2; }
            this._sw = strokeWidth;
            return this;
        };
        CircleCountdown.prototype.setCfgs = function (color) {
            var _this = this;
            var cfgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                cfgs[_i - 1] = arguments[_i];
            }
            if (!color) {
                color = CircleCountdown.defaultColor;
            }
            if (typeof color == "number") {
                color = { color: color, weight: 1 };
            }
            this.reset();
            this.addCfg(color);
            if (cfgs && cfgs.length) {
                cfgs.forEach(function (color) {
                    _this.addCfg(color);
                });
            }
            return this;
        };
        CircleCountdown.prototype.addCfg = function (color) {
            color = color.clone();
            var colors = this._cfgs;
            var prev = colors[colors.length - 1];
            if (prev && !prev.noGradient) { //如果使用渐变色，上一个点的结束颜色使用当前颜色值
                prev.endColor = color.color;
            }
            var total = this._total;
            color.start = total;
            total += color.weight;
            color.end = total;
            this._total = total;
            //不做pushOnce，允许下面这种配置
            //var a={color:0xff0000,point:1}; colors=[a,{color:0x00ff00,point:2},a];
            colors.push(color);
            return this;
        };
        CircleCountdown.prototype.reset = function () {
            this._cfgs.length = 0;
            this._total = 0;
            this._cfg = undefined;
            return this;
        };
        CircleCountdown.prototype.progress = function (value, maxValue) {
            if (value < 0) {
                value = 0;
            }
            if (maxValue < 0) {
                if (true) {
                    jy.ThrowError("进度条最大宽度不应小等于0");
                }
                maxValue = 0.00001;
            }
            if (value > maxValue) {
                value = maxValue;
            }
            this._p = value / maxValue;
            jy.Global.callLater(this.render, 0, this);
        };
        CircleCountdown.prototype.reuse = function () {
            this.isEnd = false;
        };
        CircleCountdown.prototype.clear = function () {
            this.isEnd = true;
            //清理绘制
            this._g.clear();
        };
        CircleCountdown.prototype.render = function () {
            if (this.isEnd) {
                return;
            }
            var cfgs = this._cfgs;
            var len = cfgs.length;
            var p = this._p;
            var c = p * this._total;
            var current;
            for (var i = 0; i < len; i++) {
                current = cfgs[i];
                if (current.end > c) {
                    break;
                }
            }
            if (current) {
                var delta = (c - current.start) / current.weight;
                var scolor = current.color;
                var ccolor = current.endColor; // r<<16 | g<<8 | b
                var r = getColor(scolor, ccolor, delta, 16);
                var g = getColor(scolor, ccolor, delta, 8);
                var b = getColor(scolor, ccolor, delta, 0);
                var reverse = current.shine && (p * 100 & 1);
                if (reverse) { // 反色处理
                    r ^= b;
                    b ^= r;
                    r ^= b;
                    g = ~g;
                }
                var color = r << 16 | g << 8 | b;
                //绘制
                var _g = this._g;
                _g.clear();
                _g.lineStyle(this._sw, color);
                var sRad = this._sRad;
                _g.drawArc(this._cX, this._cY, this._radius, sRad, sRad + this._dRad * p);
            }
            function getColor(start, end, delta, shift) {
                var sC = start >> shift & 0xff;
                var eC = end >> shift & 0xff;
                return Math.round(sC + (eC - sC) * delta);
            }
        };
        CircleCountdown.defaultColor = 0xff0000;
        return CircleCountdown;
    }());
    jy.CircleCountdown = CircleCountdown;
    __reflect(CircleCountdown.prototype, "jy.CircleCountdown");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var copyDiv = document.createElement("div");
    var doc = document;
    var de = doc.documentElement;
    /**
     * 拷贝到剪贴板中
     *
     * @author gushuai
     * @export
     * @param {string} str
     * @returns
     */
    function doCopy(str) {
        de.appendChild(copyDiv);
        copyDiv.innerText = str;
        var selection = getSelection();
        var range = doc.createRange();
        range.selectNodeContents(copyDiv);
        selection.removeAllRanges();
        selection.addRange(range);
        var val = doc.execCommand("copy");
        de.removeChild(copyDiv);
        return val;
    }
    jy.doCopy = doCopy;
})(jy || (jy = {}));
var jy;
(function (jy) {
    var _texture;
    jy.DataUrlUtils = {
        /**
         * 根据dataUrl获取 base64字符串
         *
         * @param {string} dataUrl
         * @returns
         */
        getBase64: getBase64,
        /**
         * 根据dataUrl获取Uint8Array
         *
         * @param {string} dataUrl
         * @returns
         */
        getBytes: getBytes,
        /**
         * 获取白鹭可视对象的dataUrl
         *
         * @param {egret.DisplayObject} dis
         * @param {string} type
         * @param {egret.Rectangle} [rect]
         * @param {any} [encodeOptions]
         * @returns
         */
        getDisplayDataURL: getDisplayDataURL,
        /**
         * 获取可视对象的Base64字符串
         *
         * @param {egret.DisplayObject} dis
         * @param {string} type
         * @param {egret.Rectangle} [rect]
         * @param {any} [encodeOptions]
         * @returns
         */
        getDisplayBase64: function (dis, type, rect, encodeOptions, scale) {
            return getBase64(getDisplayDataURL(dis, type, rect, encodeOptions, scale));
        },
        /**
         * 获取可视对象的Uint8字节流
         *
         * @param {egret.DisplayObject} dis
         * @param {string} type
         * @param {egret.Rectangle} [rect]
         * @param {any} [encodeOptions]
         * @returns
         */
        getDisplayBytes: function (dis, type, rect, encodeOptions, scale) {
            return getBytes(getDisplayDataURL(dis, type, rect, encodeOptions, scale));
        }
    };
    function getDisplayDataURL(dis, type, rect, encodeOptions, scale) {
        if (!_texture) {
            _texture = new egret.RenderTexture;
        }
        rect = rect || dis.getBounds();
        _texture.drawToTexture(dis, rect, scale);
        return _texture.toDataURL(type, null, encodeOptions);
    }
    function getBase64(dataUrl) {
        return dataUrl.substr(dataUrl.indexOf(",") + 1);
    }
    function getBytes(dataUrl) {
        var b64 = this.getBase64(dataUrl);
        var binaryString = window.atob(b64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    var lR = 0.213;
    var lG = 0.715;
    var lB = 0.072;
    var adjustColorFilters = {};
    function adjustColorFilter(brightness, contrast, saturation, hue) {
        var clamp = Math.clamp;
        hue = hue | 0;
        saturation = saturation | 0;
        brightness = brightness | 0;
        contrast = contrast | 0;
        if (hue) {
            hue = clamp(hue, -180, 180);
        }
        if (saturation) {
            saturation = clamp(saturation, -100, 100);
        }
        if (brightness) {
            brightness = clamp(brightness, -100, 100);
        }
        if (contrast) {
            contrast = clamp(contrast, -100, 100);
        }
        var key = brightness + contrast * 1E3 + saturation * 1E6 + hue * 1E9;
        var filter = adjustColorFilters[key];
        if (!filter) {
            var vec = [1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0];
            if (hue) {
                multiplyMatrix(vec, adjustHue(hue));
            }
            if (saturation) {
                multiplyMatrix(vec, adjustSaturation(saturation));
            }
            if (brightness) {
                multiplyMatrix(vec, adjustBrightness(brightness));
            }
            if (contrast) {
                multiplyMatrix(vec, adjustContrast(contrast));
            }
            adjustColorFilters[key] = filter = new egret.ColorMatrixFilter(vec);
        }
        return filter;
    }
    function adjustHue(value) {
        // convert to radians.
        var v = value * Math.DEG_TO_RAD;
        var cv = Math.cos(v);
        var sv = Math.sin(v);
        return [lR + (cv * (1 - lR)) + (sv * -lR), lG + (cv * -lG) + (sv * -lG), lB + (cv * -lB) + (sv * (1 - lB)), 0, 0,
            lR + (cv * -lR) + (sv * 0.143), lG + (cv * (1 - lG)) + (sv * 0.140), lB + (cv * -lB) + (sv * -0.283), 0, 0,
            lR + (cv * -lR) + (sv * -(1 - lR)), lG + (cv * -lG) + (sv * lG), lB + (cv * (1 - lB)) + (sv * lB), 0, 0,
            0, 0, 0, 1, 0];
    }
    function adjustSaturation(value) {
        value *= .01;
        var v = value + 1;
        var i = (1 - v);
        var r = (i * lR);
        var g = (i * lG);
        var b = (i * lB);
        return [r + v, g, b, 0, 0,
            r, g + v, b, 0, 0,
            r, g, b + v, 0, 0,
            0, 0, 0, 1, 0];
    }
    /* value = -1 to 1 */
    function adjustContrast(value) {
        value *= .01;
        var v = value + 1;
        var o = 128 * (1 - v);
        return [v, 0, 0, 0, o,
            0, v, 0, 0, o,
            0, 0, v, 0, o,
            0, 0, 0, v, 0];
    }
    /* value = -1 to 1 */
    function adjustBrightness(value) {
        var v = 2.55 * value;
        return [1, 0, 0, 0, v,
            0, 1, 0, 0, v,
            0, 0, 1, 0, v,
            0, 0, 0, 1, 0];
    }
    // multiplies one matrix against another:
    function multiplyMatrix(TargetMatrix, MultiplyMatrix) {
        var col = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                col[j] = TargetMatrix[j + (i * 5)];
            }
            for (var j = 0; j < 5; j++) {
                var val = 0;
                for (var k = 0; k < 4; k++) {
                    val += MultiplyMatrix[j + (k * 5)] * col[k];
                }
                TargetMatrix[j + (i * 5)] = val;
            }
        }
    }
    /**
     * 滤镜辅助
     *
     * @export
     * @class FilterUtils
     */
    jy.FilterUtils = {
        gray: [new egret.ColorMatrixFilter([0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0])],
        dark: [new egret.ColorMatrixFilter([0.5, 0, 0, 0, 6.75, 0, 0.5, 0, 0, 6.75, 0, 0, 0.5, 0, 6.75, 0, 0, 0, 1, 0])],
        blur: [new egret.BlurFilter(5, 5)],
        adjustColorFilter: adjustColorFilter
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 获取多个点的几何中心点
     *
     * @export
     * @param {Point[]} points 点集
     * @param {Point} result 结果
     * @returns {Point} 点集的几何中心点
     * @author gushuai
     */
    function getCenter(points, result) {
        result = result || {};
        var len = points.length;
        var x = 0;
        var y = 0;
        for (var i = 0; i < len; i++) {
            var point = points[i];
            x += point.x;
            y += point.y;
        }
        result.x = x / len;
        result.y = y / len;
        return result;
    }
    jy.getCenter = getCenter;
    /**
     * 检查类矩形 a 和 b 是否相交
     * @export
     * @param {Rect} a   类矩形a
     * @param {Rect} b   类矩形b
     * @returns {boolean} true     表示两个类似矩形的物体相交
     *         false    表示两个类似矩形的物体不相交
     */
    function intersects(a, b) {
        var aright = a.x + a.width;
        var abottom = a.y + a.height;
        var bright = b.x + b.width;
        var bbottom = b.y + b.height;
        return Math.max(a.x, b.x) <= Math.min(aright, bright)
            && Math.max(a.y, b.y) <= Math.min(abottom, bbottom);
    }
    jy.intersects = intersects;
    /**
     * 获取点集围成的区域的面积
     * S=（（X2-X1）*  (Y2+Y1)+（X2-X2）*  (Y3+Y2)+（X4-X3）*  (Y4+Y3)+……+（Xn-Xn-1）*  (Yn+Yn-1)+（X1-Xn）*  (Y1+Yn)）/2
     * @export
     * @param {Point[]} points 点集
     * @returns {number}
     */
    function getArea(points) {
        var p0 = points[0];
        var s = 0;
        var last = p0;
        for (var i = 1, length_1 = points.length; i < length_1; i++) {
            var p = points[i];
            s += (p.x - last.x) * (p.y + last.y);
            last = p;
        }
        s += (p0.x - last.x) * (p0.y + last.y);
        return s * .5;
    }
    jy.getArea = getArea;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * HTML工具类
     * @author 3tion
     */
    var unescChars = { "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&apos;": "\'", "&amp;": "&", "&nbsp;": " ", "&#x000A;": "\n" };
    var escChars = { "<": "&lt;", ">": "&gt;", "'": "&apos;", "\"": "&quot;", "&": "&amp;" };
    function escFun(substring) {
        return escChars[substring];
    }
    function unescFun(substring) {
        return unescChars[substring];
    }
    jy.HTMLUtil = {
        /**
         * 字符着色
         *
         * @param {string | number} value       内容
         * @param {(string | number)} color     颜色
         * @returns
         */
        createColorHtml: function (value, color) {
            var c;
            if (typeof color == "number") {
                c = jy.ColorUtil.getColorString(color);
            }
            else if (color.charAt(0) != "#") {
                c = "#" + color;
            }
            else {
                c = color;
            }
            return "<font color=\'" + c + "\'>" + value + "</font>";
        },
        /**
         * 清理html;
         * @value value
         * @return
         *
         */
        clearHtml: function (value) {
            return value.replace(/<[^><]*?>/g, "");
        },
        /**
         * 将特殊字符串处理为HTML转义字符
         *
         * @param {string} content
         */
        escHTML: function (content) {
            return content.replace(/<|>|"|'|&/g, escFun);
        },
        /**
         * 将HTML特殊符号，恢复成正常字符串
         *
         * @param {string} content
         * @returns
         */
        unescHTML: function (content) {
            return content.replace(/&lt;|&gt;|&quot;|&apos;|&amp;|&nbsp;|&#x000A;/g, unescFun);
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    var _msgDict;
    if (typeof $lang === "object") {
        _msgDict = $lang;
        $lang = undefined; //将全局变量清除，只保留闭包
    }
    else {
        _msgDict = {};
    }
    /**
     * 用于处理语言/文字显示
     */
    jy.LangUtil = {
        /**
         * 获取显示的信息
         *
         * @static
         * @param {Key} code code码
         * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
         * @returns 显示信息
         */
        getMsg: function () {
            var argus = arguments;
            var code = argus[0];
            var len = argus.length;
            var args;
            if (len == 2) {
                args = argus[1];
            }
            else if (len > 2) {
                args = [];
                var j = 0;
                for (var i = 1; i < len; i++) {
                    args[j++] = argus[i];
                }
            }
            if (code in _msgDict) {
                return _msgDict[code].substitute(args);
            }
            return typeof code === "string" ? code.substitute(args) : code + "";
        },
        has: function (code) {
            return code in _msgDict;
        },
        /**
         *
         * 注册语言字典
         * @static
         * @param { { [index: string]: string }} data
         */
        regMsgDict: function (data) {
            _msgDict = data;
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 姓 集合
     * 对应配置中 姓 列
     */
    var A = [];
    /**
     * 符号 集合
     * 对应配置中 符号 列
     */
    var B = [];
    /**
     * 名 集合
     * 对应配置中 男名，女名 列
     * index（0：男名，1：女名）
     */
    var C = [, [], []];
    var inited;
    function setLib(data) {
        var a = data.a, b = data.b, c1 = data.c1, c2 = data.c2;
        var split = ";";
        a && (A = a.split(split));
        b && (B = b.split(split));
        c1 && (C[1 /* Male */] = c1.split(split));
        c2 && (C[2 /* Female */] = c2.split(split));
        inited = true;
    }
    var NameUtils = /** @class */ (function () {
        /**
         *
         * @param randomFunc	随机算法
         *
         */
        function NameUtils(randomFunc) {
            this.setRandom(randomFunc);
        }
        /**
         * 加载名字库
         * @param url
         * @param callback
         */
        NameUtils.loadNameLib = function (url, callback) {
            if (inited) {
                return callback && callback.execute();
            }
            jy.Res.loadRes({ uri: "$nameLib", url: url, type: 3 /* Json */ }, jy.CallbackInfo.get(function (item) {
                var $nl_nc = item.data;
                if ($nl_nc) {
                    setLib($nl_nc);
                    inited = true;
                    return callback && callback.execute();
                }
            }));
        };
        /**
         * 设置随机算法
         * @param randomFunc
         *
         */
        NameUtils.prototype.setRandom = function (randomFunc) {
            if (randomFunc != null) {
                this._random = randomFunc;
            }
            else {
                this._random = Math.random;
            }
        };
        /**
         * 获取名字
         * @param sex 1 男  2 女
         * @return
         *
         */
        NameUtils.prototype.getName = function (sex) {
            if (sex === void 0) { sex = 1 /* Male */; }
            var name = "";
            var SC = C[sex];
            if (!SC) {
                if (true) {
                    jy.ThrowError("性别必须为1或者2");
                }
                return;
            }
            var aLen = A.length;
            var bLen = B.length;
            var cLen = SC.length;
            var random = this._random;
            if (aLen)
                name += A[aLen * random() >> 0];
            if (bLen)
                name += (Date.now() & 1) ? "" : B[bLen * random() >> 0];
            if (cLen)
                name += SC[cLen * random() >> 0];
            return name;
        };
        NameUtils.prototype.dispose = function () {
            this._random = null;
        };
        /**
         * 设置名字库的数据
         *
         * @static
         * @memberof NameUtils
         */
        NameUtils.setLib = setLib;
        return NameUtils;
    }());
    jy.NameUtils = NameUtils;
    __reflect(NameUtils.prototype, "jy.NameUtils");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var seed = 1;
    var callbacks = {};
    var Timeout = "RPCTimeout";
    var count = 0;
    var start;
    var willDel = [];
    jy.RPC = {
        Timeout: Timeout,
        callback: callback,
        registerCallback: registerCallback,
        /**
         * 注册回调函数，成功和失败，均使用该方法
         * 成功则data为返回的数据
         * 失败则data为Error
         * @param {{ (data?: any, ...args) }} callback
         * @param {*} [thisObj]
         * @param {any} any
         */
        registerCallbackFunc: function (callback, withError, timeout, thisObj) {
            if (timeout === void 0) { timeout = 2000 /* DefaultTimeout */; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            var success = jy.CallbackInfo.get.apply(jy.CallbackInfo, [callback, thisObj].concat(args));
            var error = jy.CallbackInfo.get.apply(jy.CallbackInfo, [withError ? callback : noErrorCallback(callback, thisObj), thisObj].concat(args));
            return registerCallback(success, error, timeout);
        },
        /**
        * 根据id移除回调函数
        *
        * @param {number} id
        */
        removeCallback: function (id) {
            var callback = callbacks[id];
            deleteCallback(id);
            if (callback) {
                var success = callback.success, error = callback.error;
                if (success) {
                    success.recycle();
                }
                if (error) {
                    error.recycle();
                }
            }
        }
    };
    function noErrorCallback(callback, thisObj) {
        return function (err) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            callback.call.apply(callback, [thisObj, undefined].concat(args));
        };
    }
    /**
     * 注册回调函数
     *
     * @param {Recyclable<CallbackInfo<{ (data?: any, ...args) }>>} success     成功的函数回调
     * @param {Recyclable<CallbackInfo<{ (error?: Error, ...args) }>>} [error]    发生错误的函数回调
     * @param {number} [timeout=2000] 超时时间，默认2000，实际超时时间会大于此时间，超时后，如果有错误回调，会执行错误回调，`Error(RPC.Timeout)`
     * @returns
     */
    function registerCallback(success, error, timeout) {
        if (timeout === void 0) { timeout = 2000 /* DefaultTimeout */; }
        var id = seed++;
        callbacks[id] = { id: id, expired: jy.Global.now + timeout, success: success, error: error };
        count++;
        if (!start) {
            jy.TimerUtil.addCallback(1000 /* ONE_SECOND */, check);
            start = true;
        }
        return id;
    }
    function deleteCallback(id) {
        if (id in callbacks) {
            delete callbacks[id];
            count--;
            if (count == 0) {
                jy.TimerUtil.removeCallback(1000 /* ONE_SECOND */, check);
                start = false;
            }
        }
    }
    /**
       * 执行回调
       *
       * @param {number} id 执行回调的id
       * @param {*} [data] 成功返回的数据
       * @param {(Error | string)} [err] 错误
       */
    function callback(id, data, err) {
        var callback = callbacks[id];
        if (!callback) {
            return;
        }
        deleteCallback(id);
        var success = callback.success, error = callback.error;
        var result;
        if (err) {
            if (typeof err === "string") {
                err = new Error(err);
            }
            if (error) {
                result = error.call(err);
                error.recycle();
            }
            if (success) {
                success.recycle();
            }
        }
        else {
            if (error) {
                error.recycle();
            }
            if (success) {
                result = success.call(data);
                success.recycle();
            }
        }
        return result;
    }
    function check() {
        var del = willDel;
        var i = 0;
        var now = jy.Global.now;
        for (var id in callbacks) {
            var callback_1 = callbacks[id];
            if (now > callback_1.expired) {
                del[i++] = id;
            }
        }
        for (var j = 0; j < i; j++) {
            var id = del[j];
            callback(id, null, Timeout);
        }
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    var _dic = {};
    /**
     * 请求限制
     * @author 3tion
     *
     */
    jy.RequestLimit = {
        /**
         *
         *
         * @param {Key} o 锁定的对像(可以是任何类型,它会被当做一个key)
         * @param {number} [time=500] 锁定对像 毫秒数
         * @returns 是否已解锁 true为没有被限制,false 被限制了
         */
        check: function (o, time) {
            if (time === void 0) { time = 500; }
            time = time | 0;
            if (time <= 0) {
                return true;
            }
            var t = _dic[o];
            var now = jy.Global.now;
            if (!t) {
                _dic[o] = time + now;
                return true;
            }
            var i = t - now;
            if (i > 0) {
                return false;
            }
            _dic[o] = time + now;
            return true;
        },
        /**
         * 删除
         * @param o
         *
         */
        remove: function (o) {
            delete _dic[o];
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 临时对象
     * @author 3tion
     *
     */
    jy.Temp = {
        /**
         * 共享数组1
         */
        SharedArray1: [],
        /**
         * 共享数组2
         */
        SharedArray2: [],
        /**
         * 共享数组3
         */
        SharedArray3: [],
        SharedRect1: { x: 0, y: 0, width: 0, height: 0 },
        SharedRect2: { x: 0, y: 0, width: 0, height: 0 },
        /**
         * 白鹭的点
         */
        EgretPoint: new egret.Point(),
        /**
         * 白鹭的矩形
         */
        EgretRectangle: new egret.Rectangle(),
        /**
         * 共享点1
         */
        SharedPoint1: { x: 0, y: 0, z: 0 },
        /**
         * 共享点2
         */
        SharedPoint2: { x: 0, y: 0, z: 0 },
        /**
         * 不做任何事情的空方法，接收任意长度的数据，返回空
         */
        voidFunction: function () { },
        /**
         * 用于替换的方法,接收任意长度的数据，返回null
         */
        willReplacedFunction: function () {
            if (true) {
                jy.ThrowError("\u9700\u8981\u88AB\u66FF\u6362\u7684\u65B9\u6CD5\uFF0C\u6CA1\u6709\u88AB\u66FF\u6362\uFF0C\u5806\u6808\u4FE1\u606F\uFF1A" + new Error().stack);
            }
        },
        /**
         * 返回 true 的函数
         */
        retTrueFunc: function () {
            return true;
        },
        /**
         * 返回 false 的函数
         */
        retFalseFunc: function () {
            return false;
        },
        /**
         * 空对象
         */
        EmptyObject: Object.freeze({}),
        /**
         * 空数组
         */
        EmptyArray: Object.freeze([]),
        /**
         * 管线方法，用于符合函数的结构，并将数值传递下去
         */
        pipeFunction: function (arg) {
            return arg;
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    var _timeobj = {};
    var tmpList = [];
    var willDeleted = [];
    function tick(now) {
        var d = 0;
        for (var key in _timeobj) {
            var timer = _timeobj[key];
            if (timer.nt < now) {
                timer.nt = now + timer.tid;
                var list = timer.list;
                var len = list.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        tmpList[i] = list[i];
                    }
                    for (var i = 0; i < len; i++) {
                        tmpList[i].execute(false);
                    }
                }
                len = list.length;
                if (len == 0) {
                    willDeleted[d++] = key;
                }
            }
        }
        for (var i = 0; i < d; i++) {
            delete _timeobj[willDeleted[i]];
        }
    }
    function getInterval(time) {
        return Math.ceil(time / 10) * 10;
    }
    /**
     *
     * 注册回调  会对在同一个时间区间的 `callback`和`thisObj`相同的回调函数进行去重
     * @static
     * @param {number} time 回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
     * @param {Function} callback 回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
     * @param {any} [thisObj] 回调函数的`this`对象，不传值则使用全局上下文即window
     * @param {any} args 回调函数的参数
     */
    function addCallback(time, callback, thisObj) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        time = getInterval(time);
        var timer = _timeobj[time];
        if (!timer) {
            var list = [];
            timer = { tid: time, nt: jy.Global.now + time, list: list };
            _timeobj[time] = timer;
            list.push(jy.CallbackInfo.get.apply(jy.CallbackInfo, [callback, thisObj].concat(args)));
        }
        else {
            jy.CallbackInfo.addToList.apply(jy.CallbackInfo, [timer.list, callback, thisObj].concat(args));
        }
    }
    /**
     * 注册回调 会对在同一个时间区间的 `callback`相同的情况下，才会去重
     * @param time
     * @param callback
     */
    function add(time, callback) {
        time = getInterval(time);
        var timer = _timeobj[time];
        if (!timer) {
            timer = { tid: time, nt: jy.Global.now + time, list: [] };
            _timeobj[time] = timer;
        }
        timer.list.pushOnce(callback);
    }
    /**
     * 移除回调
     * 不回收`CallbackInfo`
     * @param {number} time
     * @param {$CallbackInfo} callback
     */
    function remove(time, callback) {
        time = getInterval(time);
        var timer = _timeobj[time];
        if (timer) {
            timer.list.remove(callback);
        }
    }
    /**
     * 移除回调
     * @static
     * @param {number} time         回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
     * @param {Function} callback   回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
     * @param {*} [thisObj]         回调函数的`this`对象
     */
    function removeCallback(time, callback, thisObj) {
        time = getInterval(time);
        var timer = _timeobj[time];
        if (timer) {
            var list = timer.list;
            var info = jy.CallbackInfo.removeFromList(list, callback, thisObj);
            if (info) {
                info.recycle();
            }
        }
    }
    jy.TimerUtil = { addCallback: addCallback, removeCallback: removeCallback, tick: tick, add: add, remove: remove };
})(jy || (jy = {}));
var jy;
(function (jy) {
    var fun = window.URL ? function (link, origin) {
        origin = origin || location.href;
        return new URL(link, origin).href;
    } : function (link, origin) {
        if (!origin) {
            origin = location.href;
            if (location.href != location.origin) {
                origin = origin.substr(0, origin.lastIndexOf("/"));
            }
        }
        return origin + "/" + link; //这个为项目中的简易实现，实现一个完整的URL需要实现太多规则  如 "/" 开头  "//"开头  http://caniuse.com/#search=URL 目前URL的支持状况，后续将屏蔽 此实现
    };
    /**
     * 处理链接地址
     * 如果是http:// 或者  https:// 获取//开头的地址，直接返回
     * 否则拼接当前地址的 href
     * @export
     * @param {string} link
     * @param {string} [origin]
     * @returns
     */
    function solveLink(link, origin) {
        if (!/^((http|https):)?\/\//.test(link)) {
            link = fun(link, origin);
        }
        return link;
    }
    jy.solveLink = solveLink;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 初始化屏蔽字
     * @param str   使用特定符号分隔的脏字列表
     * @param split 分隔符
     *
     */
    function initFilterstring(str, split) {
        var arr = str.split(split);
        _len = arr.length;
        //每个正则，至少会增加 (?: )|，如果出现  \/*().?|+\-$\^=:!@| 这些字符，还会增加[]，如果出现\还会增加更多
        //按每个长度  5 + 2来处理
        var guessedLength = str.length + _len * 7;
        var p = /([\/*().?|+\-$\^=:!@])/g;
        var p2 = /([\\\[\]])/g;
        var t, i;
        if (guessedLength < 32768) { //正则字符串的长度一定大于原始字符串长度，正则字符串不能超过32768
            var l = _len - 1;
            var s = "(?:"; //必须加?:作为非捕获分组，否则分组会超过99个上限，最终导致无法replace
            for (i = 0; i < l; i++) {
                t = arr[i];
                if (t) {
                    t = t.replace(p2, "[\\$1]");
                    t = t.replace(p, "[$1]");
                    s += t + ")|(?:";
                }
            }
            t = arr[l];
            t = t.replace(p2, "[\\$1]");
            t = t.replace(p, "[$1]");
            s += t + ")|[|]";
            if (s.length < 32768) { //正则字符串的实际长度
                filterWords = new RegExp(s, "g");
                jy.WordFilter.wordCensor = wordCensor1;
                jy.WordFilter.checkWord = checkWord1;
                return;
            }
        } //超过长度的采用方案2
        _filterList = new Array(_len + 1);
        for (i = 0; i < _len; i++) {
            t = arr[i];
            t = t.replace(p2, "[\\$1]");
            t = t.replace(p, "[$1]");
            _filterList[i] = new RegExp(t, "g");
        }
        //| 一般我们特殊用途，也加入屏蔽字符
        _filterList[i] = new RegExp("[|]", "g");
        _len = _len + 1;
        jy.WordFilter.wordCensor = wordCensor2;
        jy.WordFilter.checkWord = checkWord2;
    }
    //正常版
    function wordCensor1(msg) {
        return msg.replace(filterWords, replaceDirty);
    }
    function checkWord1(msg) {
        filterWords.lastIndex = 0;
        return filterWords.test(msg);
    }
    //_filterList 版
    function wordCensor2(msg) {
        for (var i = 0; i < _len; i++) {
            msg = msg.replace(_filterList[i], replaceDirty);
        }
        return msg;
    }
    function checkWord2(msg) {
        for (var i = 0; i < _len; i++) {
            _filterList[i].lastIndex = 0;
            if (_filterList[i].test(msg)) {
                return true;
            }
        }
    }
    /**
     * 将字符替换成*
     * @param substring 子字符串
     * @return
     *
     */
    var replaceDirty = function (substring) {
        var len = substring.length;
        var result = "";
        while (len--) {
            result += "*";
        }
        return result;
    };
    /**
     * 如果超过正则表达式长度，使用的数组
     */
    var _filterList;
    /**
     * 昵称的过滤数组，没有加载到数据时使用
     */
    var filterWords = /卐|妓|婊|尻|屄|屌|睾|肏|[|]/g;
    /**
     * 长度
     */
    var _len;
    /**
     * 文字过滤
     * @author 3tion
     */
    jy.WordFilter = {
        /**
         * 由于脏字文件使用ajax读取，可能存在跨域问题，所以在H5中使用javascript方式加载
         */
        loadDirtyWord: function (url, split) {
            if (split === void 0) { split = "\n"; }
            jy.Res.loadRes({ uri: "$dirty", url: url, type: 1 /* Text */ }, jy.CallbackInfo.get(function (item) {
                var $dirty = item.data;
                if ($dirty) {
                    initFilterstring($dirty, split);
                }
            }));
        },
        /**
         * 初始化屏蔽字
         * @param str   使用特定符号分隔的脏字列表
         * @param split 分隔符
         *
         */
        initFilterstring: initFilterstring,
        /**
         * 将敏感词替换为**
         * @param msg	要检测的文字
         * @return
         *
         */
        wordCensor: wordCensor1,
        /**
         * 设置 将字符替换成* 的函数
         * @param substring 子字符串
         * @return
         *
         */
        setDirtyHandler: function (handler) {
            replaceDirty = handler;
        },
        /**
         * 是否有敏感词
         * @param msg	要检测的文字
         * @return 		true为有敏感词，false为没有敏感词
         *
         */
        checkWord: checkWord1,
    };
})(jy || (jy = {}));
if (true) {
    var $gm = $gm || {};
    $gm.toggleClientCheck = function () {
        noClientCheck = !noClientCheck;
    };
}
var jy;
(function (jy) {
    /**
     * 错误前缀
     */
    jy.errorPrefix = "";
    if (false) {
        /**
         * 内存中存储的错误数据信息
         *
         */
        var errorMsg = [];
        /**
         * 在内存中存储报错数据
         * @param msg
         * @param atWho
         *
         */
        var pushMsg = function (msg) {
            if (errorMsg.length > jy.ThrowError.MaxCount) {
                errorMsg.shift();
            }
            var msg = getMsg(msg);
            errorMsg.push(msg);
            return msg;
        };
    }
    if (true) {
        jy.Log = function () {
            var msg = "%c";
            for (var i = 0; i < arguments.length; i++) {
                msg += arguments[i];
            }
            console.log(msg, "color:red");
        };
    }
    /**
    * 在内存中存储报错数据
    * @param msg
    * @private
    */
    function getMsg(msg) {
        return new Date().format("[yyyy-MM-dd HH:mm:ss]", true) + "[info:]" + msg;
    }
    /**
     * 抛错
     * @param {string | Error}  msg 描述
     **/
    jy.ThrowError = function (msg, err, alert) {
        if (true && alert) {
            window.alert(msg);
        }
        msg = jy.errorPrefix + msg;
        msg += "%c";
        if (err) {
            msg += "\nError:\n[name]:" + err.name + ",[message]:" + err.message;
        }
        else {
            err = new Error();
        }
        msg += "\n[stack]:\n" + err.stack;
        if (true) {
            msg = getMsg(msg);
        }
        else if (false) {
            msg = pushMsg(msg);
        }
        console.log(msg, "color:red");
    };
    if (false) {
        jy.ThrowError.MaxCount = 50;
        jy.ThrowError.errorMsg = errorMsg;
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 2d游戏的引擎管理游戏层级关系<br/>
     * @author 3tion
     *
     */
    var GameEngine = /** @class */ (function (_super) {
        __extends(GameEngine, _super);
        function GameEngine(stage) {
            var _this = _super.call(this) || this;
            _this._layers = [];
            /**
             * 排序层
             */
            _this._sortedLayers = [];
            _this._stage = stage;
            _this.init();
            return _this;
        }
        GameEngine.init = function (stage, ref) {
            ref = ref || GameEngine;
            GameEngine.instance = new ref(stage);
        };
        GameEngine.addLayerConfig = function (id, parentid, ref) {
            if (parentid === void 0) { parentid = 0; }
            var lc = {};
            lc.id = id;
            lc.parentid = parentid;
            lc.ref = ref || jy.BaseLayer;
            GameEngine.layerConfigs[id] = lc;
        };
        /**
          * 单位坐标发生变化时调用
          */
        GameEngine.invalidateSort = function () {
            GameEngine.instance.invalidateSort();
        };
        /**
         * 单位坐标发生变化时调用
         */
        GameEngine.prototype.invalidateSort = function () {
            this._sortDirty = true;
        };
        Object.defineProperty(GameEngine.prototype, "viewRect", {
            get: function () {
                return this._viewRect;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 获取或创建容器
         */
        GameEngine.prototype.getLayer = function (id) {
            var layers = this._layers;
            var layer = layers[id];
            if (!layer) {
                var cfg = GameEngine.layerConfigs[id];
                if (!cfg) {
                    return;
                }
                var ref = cfg.ref;
                layer = new ref(id);
                this.addLayer(layer, cfg);
                layers[id] = layer;
                if (layer instanceof jy.SortedLayer) {
                    this._sortedLayers.push(layer);
                }
            }
            return layer;
        };
        /**
         *
         * @param {GameLayer} layer 要调整的层级
         * @param {number} newid 新的层级id
         * @param {boolean} [awake=true] 是否执行一次awake
         */
        GameEngine.prototype.changeId = function (layer, newid, awake) {
            if (awake === void 0) { awake = true; }
            var id = layer.id;
            if (id != newid) {
                var layers = this._layers;
                if (layers[id] == layer) { //清理旧的id数据
                    layers[id] = undefined;
                }
                layers[newid] = layer;
                layer.id = newid;
            }
            awake && this.awakeLayer(newid);
        };
        /**
         * 将指定
         *
         * @param {GameLayerID} layerID
         *
         * @memberOf GameEngine
         */
        GameEngine.prototype.sleepLayer = function (layerID) {
            var layer = this._layers[layerID];
            jy.removeDisplay(layer);
        };
        GameEngine.prototype.awakeLayer = function (layerID) {
            var layer = this._layers[layerID];
            var cfg = GameEngine.layerConfigs[layerID];
            if (layer) {
                this.addLayer(layer, cfg);
            }
        };
        GameEngine.prototype.addLayer = function (layer, cfg) {
            if (cfg && cfg.parentid) {
                var parent_3 = this.getLayer(cfg.parentid);
                if (parent_3 instanceof egret.DisplayObjectContainer) {
                    this.addLayerToContainer(layer, parent_3);
                }
            }
            else {
                this.addLayerToContainer(layer, this._stage);
            }
        };
        GameEngine.prototype.addLayerToContainer = function (layer, container) {
            var children = container.$children;
            var id = layer.id;
            var j = 0;
            for (var i = 0, len = children.length; i < len; i++) {
                var child = children[i];
                if (layer != child) {
                    var childLayer = child;
                    if (childLayer.id > id) {
                        break;
                    }
                    j++;
                }
            }
            container.addChildAt(layer, j);
        };
        GameEngine.prototype.init = function () {
        };
        GameEngine.layerConfigs = {};
        return GameEngine;
    }(egret.EventDispatcher));
    jy.GameEngine = GameEngine;
    __reflect(GameEngine.prototype, "jy.GameEngine");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var DSprite = /** @class */ (function (_super) {
        __extends(DSprite, _super);
        function DSprite() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.depth = 0;
            return _this;
        }
        return DSprite;
    }(egret.Sprite));
    jy.DSprite = DSprite;
    __reflect(DSprite.prototype, "jy.DSprite", ["jy.IDepth"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 用于处理无方向的动画信息
     * @author 3tion
     *
     */
    var AniInfo = /** @class */ (function (_super) {
        __extends(AniInfo, _super);
        function AniInfo() {
            var _this = _super.call(this) || this;
            /**
             * 加载状态
             */
            _this.state = 0 /* UNREQUEST */;
            return _this;
        }
        /**
         * 绑定渲染器
         * @param render
         */
        AniInfo.prototype.bind = function (render) {
            var state = this.state;
            if (state != 2 /* COMPLETE */) {
                if (!this._refList) {
                    this._refList = [];
                }
                this._refList.push(render);
                if (state == 0 /* UNREQUEST */) {
                    var uri = this.uri = "a/" /* Ani */ + this.key + "/" + "d.json" /* CfgFile */;
                    var url = this.url = jy.ConfigUtils.getResUrl(uri);
                    jy.Res.load(uri, url, jy.CallbackInfo.get(this.dataLoadComplete, this), this.qid);
                    this.state = 1 /* REQUESTING */;
                }
            }
        };
        /**
         * 资源加载完成
         */
        AniInfo.prototype.dataLoadComplete = function (item) {
            var uri = item.uri, data = item.data;
            if (uri == this.uri) {
                if (data) {
                    this.init(this.key, data);
                    if (this._refList) {
                        for (var _i = 0, _a = this._refList; _i < _a.length; _i++) {
                            var render = _a[_i];
                            render.callback();
                        }
                    }
                }
                else { // 不做加载失败的处理
                    this.state = 2 /* COMPLETE */;
                }
                this._refList = undefined;
            }
        };
        /**
         * 和渲染器解除绑定
         * @param render
         */
        AniInfo.prototype.loose = function (render) {
            var _refList = this._refList;
            if (_refList) {
                _refList.remove(render);
            }
        };
        AniInfo.prototype.init = function (key, data) {
            _super.prototype.init.call(this, key, data[0]);
            var res = new jy.UnitResource("a/" /* Ani */ + key, this);
            res.qid = this.qid;
            res.decodeData(data[1]);
            this._resources = res;
            this.state = 2 /* COMPLETE */;
        };
        AniInfo.prototype.getResource = function (uri) {
            return this._resources;
        };
        Object.defineProperty(AniInfo.prototype, "actionInfo", {
            get: function () {
                var frames = this.frames;
                return frames && frames[0];
            },
            enumerable: true,
            configurable: true
        });
        return AniInfo;
    }(jy.PstInfo));
    jy.AniInfo = AniInfo;
    __reflect(AniInfo.prototype, "jy.AniInfo");
})(jy || (jy = {}));
if (true) {
    var $gm = $gm || {};
    $gm.recordAni = function () {
        $gm._recordAni = !$gm._recordAni;
        if ($gm._recordAni) {
            if (!$gm._aniRecords) {
                $gm._aniRecords = {};
            }
        }
        else {
            delete $gm._aniRecords;
        }
    };
    $gm.showAniRecords = function (time) {
        if (time === void 0) { time = 0; }
        var dict = $gm._aniRecords;
        var now = Date.now();
        var output = [];
        for (var guid in dict) {
            var record = dict[guid];
            var delta = now - record.time;
            if (delta > time) {
                output.push({ delta: delta, guid: record.guid, stack: record.stack });
            }
        }
        output.sort(function (a, b) { return a.delta - b.delta; });
        if (true)
            console.table(output);
    };
    $gm.showAniStacks = function (time) {
        if (time === void 0) { time = 0; }
        var dict = $gm._aniRecords;
        var now = Date.now();
        var output = {};
        for (var guid in dict) {
            var record = dict[guid];
            var delta = now - record.time;
            if (delta > time) {
                output[record.stack] = ~~output[record.stack] + 1;
            }
        }
        for (var stack in output) {
            if (true)
                egret.log("次数：", output[stack], "堆栈：\n", stack);
        }
    };
}
var jy;
(function (jy) {
    /**
     * 由于目前特效和渲染器是完全一一对应关系，所以直接做成AniBitmap
     * @author 3tion
     *
     */
    var AniRender = /** @class */ (function (_super) {
        __extends(AniRender, _super);
        function AniRender() {
            var _this = _super.call(this) || this;
            /**
             * 0 初始化，未运行
             * 1 正在运行
             * 2 已回收
             */
            _this.state = 0 /* Standby */;
            /**
             * 非循环动画，播放完毕后的回收策略
             * 默认为全部回收
             */
            _this.recyclePolicy = 3 /* RecycleAll */;
            /**
             * 是否等待纹理数据加载完成，才播放
             *
             * @type {boolean}
             * @memberof AniRender
             */
            _this.waitTexture = false;
            // ani动画的`暂定`动作固定值0
            _this.a = 0;
            return _this;
        }
        Object.defineProperty(AniRender.prototype, "guid", {
            /**
             * 特效标识
             */
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * render方法基于
         */
        AniRender.prototype.render = function () {
            var aniinfo = this._aniInfo;
            if (aniinfo) {
                var actionInfo = aniinfo.actionInfo;
                if (actionInfo) {
                    var now = jy.Global.now;
                    this.onData(actionInfo, now);
                    this.doRender(now);
                }
            }
        };
        /**
         * 处理数据
         *
         * @param {number} now 时间戳
         */
        AniRender.prototype.doData = function (now) {
            if (this._aniInfo) {
                var actionInfo = this._aniInfo.actionInfo;
                if (actionInfo) {
                    this.onData(actionInfo, now);
                }
            }
        };
        AniRender.prototype.renderFrame = function (frame, now) {
            if (!frame) {
                return;
            }
            this.f = frame.f;
            var display = this.display;
            if (display && display.draw(this, now)) {
                this.willRenderFrame = undefined;
            }
        };
        /**
         * 派发事件
         * @param event     事件名
         * @param now       当前时间
         */
        AniRender.prototype.dispatchEvent = function (event, now) {
            var handler = this.handler;
            if (handler) {
                handler.call(event, this, now);
            }
        };
        AniRender.prototype.doComplete = function (now) {
            var handler = this.handler;
            if (handler) {
                handler.call(-1993 /* AniComplete */, this, now);
            }
            this.state = 2 /* Completed */;
            var policy = this.recyclePolicy;
            if ((policy & 2 /* RecycleRender */) == 2 /* RecycleRender */) { //如果有回收Render，则进入Render中判断是否要回收可视对象
                AniRender.recycle(this.guid);
            }
            else {
                var display = this.display;
                if (display) {
                    //这里不删除和AniRender的引用关系，但移除渲染事件
                    display.off("enterFrame" /* ENTER_FRAME */, this.render, this);
                    if ((policy & 1 /* RecycleDisplay */) == 1 /* RecycleDisplay */) {
                        //回收策略要求回收可视对象，才移除引用
                        //@ts-ignore
                        this.display = undefined;
                        display.recycle();
                    }
                }
            }
        };
        AniRender.prototype.isComplete = function (info) {
            var loop = this.loop;
            if (loop != undefined) {
                loop--;
                this.loop = loop;
                return loop < 1;
            }
            return !info.isCircle;
        };
        AniRender.prototype.callback = function () {
            var _aniInfo = this._aniInfo;
            if (_aniInfo) {
                var _a = this, f = _a.f, loop = _a.loop, display = _a.display, state = _a.state;
                this.idx = checkStart(_aniInfo, loop, f);
                display.res = _aniInfo.getResource();
                if (state == 1 /* Playing */) {
                    this.checkPlay();
                }
            }
        };
        /**
         * 播放
         */
        AniRender.prototype.play = function (now) {
            var globalNow = jy.Global.now;
            now = now === void 0 ? globalNow : now;
            this.plTime = globalNow;
            this.renderedTime = now;
            this.nextRenderTime = now;
            this.state = 1 /* Playing */;
            this.resOK = false;
            this._render = undefined;
            if (this.display.stage) {
                this.checkPlay();
            }
            if (true) {
                if ($gm._recordAni) {
                    var stack = new Error().stack;
                    var guid = this._guid;
                    var bin = { stack: stack, guid: guid, time: now };
                    $gm._aniRecords[guid] = bin;
                }
            }
        };
        AniRender.prototype.checkPlay = function () {
            var display = this.display;
            var res = display.res;
            if (res) { //资源已经ok
                var old = this._render;
                var render = void 0;
                if (this.waitTexture) {
                    var _a = this, a = _a.a, d = _a.d;
                    if (res.isResOK(a, d)) {
                        if (!this.resOK) {
                            this.resOK = true;
                            //重新计算时间
                            var deltaTime = jy.Global.now - this.plTime;
                            this.renderedTime = this.nextRenderTime = this.renderedTime + deltaTime;
                        }
                        render = this.render;
                    }
                    else {
                        render = this.checkPlay;
                        res.loadRes(a, d);
                    }
                }
                else {
                    render = this.render;
                }
                if (old != render) {
                    if (old) {
                        display.off("enterFrame" /* ENTER_FRAME */, old, this);
                    }
                    if (render) {
                        display.on("enterFrame" /* ENTER_FRAME */, render, this);
                    }
                }
                this._render = render;
            }
        };
        AniRender.prototype.onRecycle = function () {
            if (true) {
                if ($gm._recordAni) {
                    delete $gm._aniRecords[this._guid];
                }
            }
            var handler = this.handler;
            if (handler) {
                handler.call(-1992 /* AniBeforeRecycle */, this);
                handler.recycle();
                this.handler = undefined;
            }
            delete AniRender._renderByGuid[this._guid];
            this.state = 3 /* Recycled */;
            var display = this.display;
            if (display) {
                //这里必须移除和可视对象的关联
                //@ts-ignore
                this.display = undefined;
                display.off("addedToStage" /* ADDED_TO_STAGE */, this.onStage, this);
                display.off("removedFromStage" /* REMOVED_FROM_STAGE */, this.onStage, this);
                var render = this._render;
                if (render) {
                    display.off("enterFrame" /* ENTER_FRAME */, render, this);
                }
                if ((this.recyclePolicy & 1 /* RecycleDisplay */) == 1 /* RecycleDisplay */) {
                    display.recycle();
                }
            }
            var info = this._aniInfo;
            if (info) {
                info.loose(this);
                this._aniInfo = undefined;
            }
            this.idx = 0;
            this._guid = NaN;
            this.waitTexture = false;
            this.loop = undefined;
            this._render = undefined;
        };
        AniRender.prototype.onSpawn = function () {
            this.f = 0;
            this.state = 0;
            this.recyclePolicy = 3 /* RecycleAll */;
            this._playSpeed = 1;
        };
        AniRender.prototype.onStage = function (e) {
            if (e.type == "addedToStage" /* ADDED_TO_STAGE */) {
                this.checkPlay();
            }
            else {
                var display = e.currentTarget;
                var render = this._render;
                if (render) {
                    display.off("enterFrame" /* ENTER_FRAME */, render, this);
                    this._render = undefined;
                }
            }
        };
        AniRender.prototype.init = function (aniInfo, display, guid) {
            this._aniInfo = aniInfo;
            //@ts-ignore
            this.display = display;
            display.on("addedToStage" /* ADDED_TO_STAGE */, this.onStage, this);
            display.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.onStage, this);
            if (aniInfo.state == 2 /* COMPLETE */) {
                display.res = aniInfo.getResource();
            }
            else {
                aniInfo.bind(this);
            }
            this._guid = guid;
        };
        /**
         * 获取ANI动画
         *
         * @static
         * @param {string} uri    动画地址
         * @param {AniOption} [option] 动画的参数
         * @returns (description)
         */
        AniRender.getAni = function (uri, option, qid) {
            if (true && !uri) {
                true && jy.ThrowError("\u521B\u5EFA\u4E86\u6CA1\u6709uri\u7684AniRender");
            }
            var aniDict = $DD.ani;
            var aniInfo = aniDict[uri];
            if (!aniInfo) {
                aniInfo = new jy.AniInfo();
                aniInfo.key = uri;
                aniDict[uri] = aniInfo;
            }
            aniInfo.qid = qid;
            var res = aniInfo.getResource();
            res && (res.qid = qid);
            var display = jy.recyclable(jy.ResourceBitmap);
            var ani = jy.recyclable(AniRender);
            var guid, stop;
            if (option) {
                guid = option.guid;
                var pos = option.pos;
                var x = option.x, y = option.y;
                if (pos) {
                    x = pos.x;
                    y = pos.y;
                }
                if (x != undefined) {
                    display.x = x;
                }
                if (y != undefined) {
                    display.y = y;
                }
                var scale = option.scale;
                if (scale != undefined) {
                    display.scaleX = display.scaleY = scale;
                }
                stop = option.stop;
                var parent_4 = option.parent;
                if (parent_4) {
                    var idx = option.childIdx;
                    if (idx == undefined) {
                        parent_4.addChild(display);
                    }
                    else {
                        parent_4.addChildAt(display, idx);
                    }
                }
                var loop = option.loop;
                ani.loop = loop;
                ani.handler = option.handler;
                var recyclePolicy = option.recyclePolicy;
                if (recyclePolicy == undefined) {
                    recyclePolicy = 3 /* RecycleAll */;
                }
                ani.recyclePolicy = recyclePolicy;
                ani.waitTexture = !!option.waitTexture;
                ani.idx = checkStart(aniInfo, loop, option.start >>> 0); //强制为正整数
            }
            !guid && (guid = this.guid++);
            this._renderByGuid[guid] = ani;
            ani.init(aniInfo, display, guid);
            if (!stop) {
                ani.play();
            }
            return ani;
        };
        /**
         * 获取正在运行的AniRender
         * @param guid  唯一标识
         */
        AniRender.getRunningAni = function (guid) {
            return this._renderByGuid[guid];
        };
        /**
         * 回收某个特效
         * @param {number} guid AniRender的唯一标识
         */
        AniRender.recycle = function (guid) {
            var ani = this._renderByGuid[guid];
            if (ani) {
                ani.recycle();
            }
        };
        /***********************************静态方法****************************************/
        AniRender._renderByGuid = {};
        AniRender.guid = 1;
        return AniRender;
    }(jy.BaseRender));
    jy.AniRender = AniRender;
    __reflect(AniRender.prototype, "jy.AniRender", ["jy.IRecyclable"]);
    function checkStart(aniInfo, loop, startFrame) {
        var actionInfo = aniInfo.actionInfo;
        if (loop || (loop == undefined && actionInfo && actionInfo.isCircle)) {
            var total = aniInfo.actionInfo.frames.length;
            if (startFrame > total) {
                startFrame = startFrame % total;
            }
        }
        return startFrame;
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 获取帧数据
     * 为数组的顺序："a", "f", "t", "e", "d"
     * @param {*} data 如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100
     * @returns
     */
    function getFrameInfo(data) {
        var def = { a: 0, d: -1, f: 0, t: 100 };
        var keys = ["a", "f", "t", "e", "d"];
        if (!Array.isArray(data)) {
            if (typeof data === "object") {
                for (var i = 0; i < 5; i++) {
                    var key = keys[i];
                    if (data[key] == undefined) {
                        data[key] = def[key];
                    }
                }
                return data;
            }
            else {
                return def;
            }
        }
        var f = jy.DataUtils.getData(data, keys, def);
        if (+f.e == 0) {
            f.e = undefined;
        }
        if (f.t == -1) { //-1做特殊用途，让其变为正无穷
            f.t = Infinity;
        }
        return f;
    }
    jy.getFrameInfo = getFrameInfo;
    /**
     * 获取动作数据
     *
     * @param {any} data
     * @param {number} key
     * @returns
     */
    function getActionInfo(data, key) {
        var aInfo = {};
        aInfo.key = key;
        var d = data[0]; //放数组0号位的原因是历史遗留，之前AS3项目的结构有这个数组，做h5项目的时候忘记修改
        var totalTime = 0;
        var j = 0;
        d.forEach(function (item) {
            var f = getFrameInfo(item);
            totalTime += f.t;
            d[j++] = f; // 防止有些错误的空数据
        });
        aInfo.frames = d;
        aInfo.totalTime = totalTime;
        aInfo.isCircle = !!data[1];
        return aInfo;
    }
    jy.getActionInfo = getActionInfo;
    var customActionKey = -0.5; // 使用0.5 防止和手动加的key重复
    /**
     * 获取自定义动作
     * 如果无法获取对应属性的数据，会使用默认值代替
     * a: 0, d: -1, f: 0, t: 100
     * @static
     * @param {any[]} actions 动作序列  如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100
     * @param {number} [key] 动作标识，需要使用整数
     * @return {CustomAction}   自定义动作
     */
    function getCustomAction(actions, key) {
        key = key || customActionKey--;
        var frames = [];
        var totalTime = 0;
        for (var i = 0; i < actions.length; i++) {
            var frame = getFrameInfo(actions[i]);
            frames[i++] = frame;
            totalTime += frame.t;
        }
        return { key: key, frames: frames, totalTime: totalTime };
    }
    jy.getCustomAction = getCustomAction;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 资源显示用位图
     */
    var ResourceBitmap = /** @class */ (function (_super) {
        __extends(ResourceBitmap, _super);
        function ResourceBitmap() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * z方向的坐标
             *
             * @type {number}
             */
            _this.z = 0;
            return _this;
        }
        Object.defineProperty(ResourceBitmap.prototype, "depth", {
            get: function () {
                return this.y + this.z;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当前资源是否成功渲染
         *
         * @param {IDrawInfo} drawInfo
         * @param {number} now
         * @returns
         * @memberof ResourceBitmap
         */
        ResourceBitmap.prototype.draw = function (drawInfo, now) {
            var res = this.res;
            if (res) {
                return res.draw(this, drawInfo, now);
            }
        };
        ResourceBitmap.prototype.onRecycle = function () {
            jy.removeDisplay(this);
            this.removeAllListeners();
            this.res = undefined;
            this.rotation = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.anchorOffsetX = 0;
            this.anchorOffsetY = 0;
            this.texture = undefined;
        };
        return ResourceBitmap;
    }(egret.Bitmap));
    jy.ResourceBitmap = ResourceBitmap;
    __reflect(ResourceBitmap.prototype, "jy.ResourceBitmap", ["jy.IRecyclable", "jy.IDepth"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 拆分的资源
     * @author 3tion
     */
    var SplitUnitResource = /** @class */ (function () {
        function SplitUnitResource(uri, url) {
            /**
             * 资源加载状态
             */
            this.state = 0 /* UNREQUEST */;
            this.uri = uri;
            this.url = url;
            this.textures = [];
        }
        Object.defineProperty(SplitUnitResource.prototype, "isStatic", {
            get: function () {
                return this.state == 1 /* REQUESTING */; //加载中，本次不允许卸载
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 绑定纹理集
         *
         * @param {{ [index: number]: egret.Texture[][] }} textures (description)
         * @param {number[]} adKeys (description)
         */
        SplitUnitResource.prototype.bindTextures = function (textures, adKey) {
            var a = jy.ADKey.getAction(adKey);
            var dTextures = textures[a];
            if (dTextures) {
                var d = jy.ADKey.getDirection(adKey);
                var textures_3 = dTextures[d];
                if (textures_3) {
                    for (var i = 0; i < textures_3.length; i++) {
                        this.bindTexture(textures_3[i]);
                    }
                }
            }
        };
        /**
         * 绑定纹理
         */
        SplitUnitResource.prototype.bindTexture = function (tex) {
            var textures = this.textures;
            if (!~textures.indexOf(tex)) {
                textures.push(tex);
                if (this.bmd) {
                    tex.$bitmapData = this.bmd;
                }
            }
        };
        SplitUnitResource.prototype.load = function () {
            if (this.state == 0 /* UNREQUEST */) {
                this.state = 1 /* REQUESTING */;
                jy.Res.load(this.uri, this.url, jy.CallbackInfo.get(this.loadComplete, this), this.qid);
            }
        };
        /**
         * 资源加载完成
         */
        SplitUnitResource.prototype.loadComplete = function (item) {
            var uri = item.uri, data = item.data;
            if (uri == this.uri) {
                if (data) {
                    var bmd = data.bitmapData;
                    this.bmd = bmd;
                    this.state = 2 /* COMPLETE */;
                    //将已经请求的位图设置为加载完成的位图
                    var textures = this.textures;
                    for (var i = 0; i < textures.length; i++) {
                        var texture = textures[i];
                        if (texture) {
                            texture.$bitmapData = bmd;
                        }
                    }
                }
                else {
                    this.state = -1 /* FAILED */;
                }
            }
        };
        SplitUnitResource.prototype.dispose = function () {
            var textures = this.textures;
            for (var i = 0; i < textures.length; i++) {
                var texture = textures[i];
                if (texture) {
                    texture.dispose();
                }
            }
            textures.length = 0;
            if (this.bmd) {
                this.bmd = undefined;
            }
            //将加载状态标记为未加载
            this.state = 0 /* UNREQUEST */;
        };
        return SplitUnitResource;
    }());
    jy.SplitUnitResource = SplitUnitResource;
    __reflect(SplitUnitResource.prototype, "jy.SplitUnitResource", ["jy.IResource"]);
})(jy || (jy = {}));
/**
 * @author 3tion
 */
var jy;
(function (jy) {
    function setJTexture(bmp, texture) {
        bmp.texture = texture;
        var tx, ty;
        if (texture) {
            (tx = texture.tx, ty = texture.ty);
        }
        bmp.anchorOffsetX = tx || 0;
        bmp.anchorOffsetY = ty || 0;
    }
    /**
     * 单位资源<br/>
     * 图片按动作或者方向的序列帧，装箱处理后的图片位图资源<br/>
     * 以及图片的坐标信息
     */
    var UnitResource = /** @class */ (function () {
        function UnitResource(key, pstInfo) {
            this.state = 0 /* UNREQUEST */;
            this.key = key;
            var uri = this.uri = key + "/" + "d.json" /* CfgFile */;
            this.url = jy.ConfigUtils.getResUrl(uri);
            this.pst = pstInfo;
        }
        /**
         * 解析数据
         */
        UnitResource.prototype.decodeData = function (data) {
            var _datas = {};
            var w = 0, h = 0;
            for (var action in data) {
                var dData = [];
                _datas[action] = dData;
                var actData = data[action];
                if (!actData)
                    continue;
                for (var d = 0, len = actData.length; d < len; d++) {
                    var fData = [];
                    dData[d] = fData;
                    var dirData = actData[d];
                    if (!dirData)
                        continue;
                    for (var f = 0, flen = dirData.length; f < flen; f++) {
                        if (dirData[f] !== 0) {
                            var tex = getTextureFromImageData(dirData[f]);
                            var textureWidth = tex.textureWidth, textureHeight = tex.textureHeight;
                            if (textureWidth > w) {
                                w = textureWidth;
                            }
                            if (textureHeight > h) {
                                h = textureHeight;
                            }
                            fData[f] = tex;
                        }
                    }
                }
            }
            //@ts-ignore
            this.width = w;
            //@ts-ignore
            this.height = h;
            this._datas = _datas;
            this.state = 2 /* COMPLETE */;
            return;
            /**
             * 从数据中获取纹理
             */
            function getTextureFromImageData(data) {
                var texture = new egret.Texture();
                var sx = data[0];
                var sy = data[1];
                texture.tx = data[2] || 0;
                texture.ty = data[3] || 0;
                var width = data[4];
                var height = data[5];
                texture.$initData(sx, sy, width, height, 0, 0, width, height, width, height);
                return texture;
            }
        };
        /**
         * 加载数据
         */
        UnitResource.prototype.loadData = function () {
            if (this.state == 0 /* UNREQUEST */) {
                this.state = 1 /* REQUESTING */;
                jy.Res.load(this.uri, this.url, jy.CallbackInfo.get(this.dataLoadComplete, this), this.qid);
            }
        };
        /**
         * 资源加载完成
         */
        UnitResource.prototype.dataLoadComplete = function (item) {
            var uri = item.uri, data = item.data;
            if (uri == this.uri) {
                this.decodeData(data);
            }
        };
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
        UnitResource.prototype.draw = function (bitmap, drawInfo, now) {
            var frame = this.getTexture(drawInfo);
            if (frame) {
                var a = drawInfo.a, d = drawInfo.d;
                var res = this.loadRes(d, a);
                res.lastUseTime = jy.Global.now;
                if (frame.bitmapData) {
                    setJTexture(bitmap, frame);
                    return true;
                }
                else {
                    if (res.state == 2 /* COMPLETE */) {
                        res.bindTexture(frame);
                    }
                }
            }
            setJTexture(bitmap, this.placehoder);
        };
        /**
         * 根据 `动作``方向``帧数`获取纹理数据
         * @param info
         */
        UnitResource.prototype.getTexture = function (info) {
            var datas = this._datas;
            if (datas) {
                var a = info.a, f = info.f, d = info.d;
                var dDatas = datas[a];
                if (dDatas) {
                    var frames_2 = dDatas[d];
                    if (frames_2) {
                        var frame = frames_2[f];
                        if (frame) {
                            return frame;
                        }
                    }
                }
            }
        };
        UnitResource.prototype.loadRes = function (direction, action) {
            var resKey = this.pst.getResKey(direction, action);
            var uri = this.getUri2(resKey);
            return jy.ResManager.get(uri, this.noRes, this, uri, resKey);
        };
        UnitResource.prototype.noRes = function (uri, resKey) {
            var tmp = new jy.SplitUnitResource(uri, this.getUrl(uri));
            tmp.qid = this.qid;
            this.pst.bindResource(resKey, tmp, this._datas);
            tmp.load();
            return tmp;
        };
        UnitResource.prototype.getUri = function (direction, action) {
            return this.getUri2(this.pst.getResKey(direction, action));
        };
        UnitResource.prototype.getUri2 = function (resKey) {
            return this.key + "/" + resKey + ".png" /* PNG */;
        };
        UnitResource.prototype.getUrl = function (uri) {
            return jy.ConfigUtils.getResUrl(uri + jy.Global.webp);
        };
        UnitResource.prototype.isResOK = function (direction, action) {
            var uri = this.getUri(direction, action);
            var res = jy.ResManager.getResource(uri);
            return !!(res && res.bmd);
        };
        /**
         * 遍历Res所有资源
         * @param { (uri: string, adKey: number): any } forEach 如果 forEach 方法返回 真 ，则停止遍历
         */
        UnitResource.prototype.checkRes = function (forEach) {
            var self = this;
            self.pst.splitInfo.forEach(function (resKey, adKey) {
                forEach(self.getUri2(resKey), adKey);
            });
        };
        return UnitResource;
    }());
    jy.UnitResource = UnitResource;
    __reflect(UnitResource.prototype, "jy.UnitResource");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var clamp = Math.clamp;
    /**
     * 相机
     * @author 3tion
     *
     */
    var Camera = /** @class */ (function (_super) {
        __extends(Camera, _super);
        function Camera(width, height) {
            var _this = _super.call(this) || this;
            //限制范围
            _this._lx = 0;
            _this._ly = 0;
            _this._lw = Infinity;
            _this._lh = Infinity;
            /**
             * 是否需要横向滚动
             *
             * @protected
             * @memberof Camera
             */
            _this._hScroll = true;
            /**
             *
             * 是否需要纵向滚动
             *
             * @protected
             * @memberof Camera
             */
            _this._vScroll = true;
            _this._rect = new egret.Rectangle();
            var stage = egret.sys.$TempStage;
            if (!width) {
                width = stage.stageWidth;
            }
            if (!height) {
                height = stage.stageHeight;
            }
            _this.setSize(width, height);
            return _this;
        }
        Object.defineProperty(Camera.prototype, "changed", {
            get: function () {
                var target = this._host;
                if (target) {
                    var pos = getPosHash(target);
                    if (pos != this._lastPos) {
                        this._lastPos = pos;
                        return true;
                    }
                }
                return this._changed;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 标记已经改变完
         */
        Camera.prototype.change = function () {
            this._changed = false;
        };
        /**
         * 强制设置为改变
         * 用于地图切换时，坐标不发生变化的情况
         *
         */
        Camera.prototype.invalidate = function () {
            this._changed = true;
        };
        /**
         * 相机跟随一个可视对象
         * @param target 镜头要跟随的目标
         */
        Camera.prototype.lookat = function (target) {
            this._host = target;
            return !!target;
        };
        Object.defineProperty(Camera.prototype, "host", {
            /**
             * 获取当前镜头绑定的单位
             */
            get: function () {
                return this._host;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置相机的可视区域宽度和高度
         * @param width 可视区宽
         * @param height 可视区高
         */
        Camera.prototype.setSize = function (width, height) {
            var rect = this._rect;
            var changed = this._changed;
            if (width != rect.width) {
                rect.width = width;
                changed = true;
            }
            if (height != rect.height) {
                rect.height = height;
                changed = true;
            }
            if (changed) {
                this._changed = changed;
                this.check();
            }
            return this;
        };
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
        Camera.prototype.setLimits = function (width, height, x, y) {
            this._lx = x || 0;
            this._ly = y || 0;
            this._lw = width || Infinity;
            this._lh = height || Infinity;
            this.check();
            return this;
        };
        Camera.prototype.check = function () {
            var _a = this, _lx = _a._lx, _ly = _a._ly, _lw = _a._lw, _lh = _a._lh, _rect = _a._rect;
            var w = _rect.width, h = _rect.height;
            var flag = w < _lw;
            this._hScroll = flag;
            if (!flag) { //可视范围比限制范围还要大，则直接居中显示
                _rect.x = 0;
            }
            flag = h < _lh;
            this._vScroll = flag;
            if (!flag) {
                _rect.y = 0;
            }
        };
        /**
         * 将相机移动到指定坐标
         */
        Camera.prototype.moveTo = function (x, y) {
            var _a = this, _hScroll = _a._hScroll, _vScroll = _a._vScroll, _rect = _a._rect, _lx = _a._lx, _ly = _a._ly, _lw = _a._lw, _lh = _a._lh;
            var rw = _rect.width, rh = _rect.height, rx = _rect.x, ry = _rect.y;
            var changed = this._changed;
            if (_hScroll) {
                x -= rw * .5;
                x = clamp(x, _lx, _lw - rw);
                if (x != rx) {
                    _rect.x = x;
                    changed = true;
                }
            }
            if (_vScroll) {
                y -= rh * .5;
                y = clamp(y, _ly, _lh - rh);
                if (y != ry) {
                    _rect.y = y;
                    changed = true;
                }
            }
            this._changed = changed;
            return this;
        };
        Object.defineProperty(Camera.prototype, "rect", {
            /**
             * 获取相机显示区域
             */
            get: function () {
                var target = this._host;
                if (target) {
                    this.moveTo(target.x, target.y);
                }
                return this._rect;
            },
            enumerable: true,
            configurable: true
        });
        return Camera;
    }(egret.HashObject));
    jy.Camera = Camera;
    __reflect(Camera.prototype, "jy.Camera");
    /**
     * 获取坐标点的hash值
     *
     * @export
     * @param {Point} pos
     * @returns
     */
    function getPosHash(pos) {
        return pos.x << 16 | (pos.y & 0xffff);
    }
    jy.getPosHash = getPosHash;
    function getPosHash2(x, y) {
        return x << 16 | (y & 0xffff);
    }
    jy.getPosHash2 = getPosHash2;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 时间冷却
     * @author pb
     */
    var Cooldown = /** @class */ (function () {
        function Cooldown() {
            /*显示对象集合*/
            this._icdDisArr = [];
            this._duration = 0;
        }
        /**
         * 增加一个视图对象
         * @param ICooldownDisplay
         *
         */
        Cooldown.prototype.addICDDisplay = function (icdDis) {
            this._icdDisArr.pushOnce(icdDis);
        };
        /**
         * 删除一个视图对象
         * @param ICooldownDisplay
         *
         */
        Cooldown.prototype.removeICDDisplay = function (icdDis) {
            icdDis.remove();
            this._icdDisArr.remove(icdDis);
        };
        /**
         * 启动
         *
         */
        Cooldown.prototype.start = function () {
            this.state = 1 /* RUN */;
            this._duration = 0;
            this.icd.isCooling = true;
            this.updateICDDisplay(1 /* RUN */);
        };
        /**
         * 停止
         *
         */
        Cooldown.prototype.stop = function () {
            this.state = 0 /* STOP */;
            this.icd.isCooling = false;
            this.updateICDDisplay(0 /* STOP */);
        };
        /*更新显示状态*/
        Cooldown.prototype.updateICDDisplay = function (state) {
            var _this = this;
            this._icdDisArr.forEach(function (icdDis) {
                if (icdDis) {
                    if (state == 1 /* RUN */)
                        icdDis.add(_this.icd.cd);
                    else
                        icdDis.remove();
                }
            });
        };
        /*数据处理*/
        Cooldown.prototype.doData = function (delta) {
            this._duration += delta;
            var remain = this.icd.cd - this._duration;
            if (remain <= 0) {
                this.stop();
            }
        };
        /*渲染处理*/
        Cooldown.prototype.doRender = function (delta) {
            if (this.state != 1 /* RUN */) {
                return;
            }
            this._duration += delta;
            var remain = this.icd.cd - this._duration;
            if (remain <= 0) {
                this.stop();
            }
            else {
                this._icdDisArr.forEach(function (icdDis) {
                    icdDis.doRender(delta);
                });
            }
        };
        /**
         * 销毁
         *
         */
        Cooldown.prototype.dispose = function () {
            this.state = 0 /* STOP */;
            this.icd.isCooling = false;
            this._icdDisArr.forEach(function (icdDis) {
                icdDis.dispose();
            });
            this._icdDisArr.length = 0;
        };
        return Cooldown;
    }());
    jy.Cooldown = Cooldown;
    __reflect(Cooldown.prototype, "jy.Cooldown");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 时间冷却管理器
     * @author pb
     */
    var CooldownManager = /** @class */ (function () {
        function CooldownManager() {
            this._cdObj = {};
            this._cdArr = [];
            this._disObj = {};
        }
        /**
         * 添加CD绑定的显示对象
         *
         * @param {number} id
         * @param {ICooldownDisplay} icdDisplay
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.addDisplay = function (id, icdDisplay) {
            var cd = this._cdObj[id];
            if (cd) {
                cd.addICDDisplay(icdDisplay);
                this._disObj[id] = icdDisplay;
            }
        };
        /**
         * 删除某CD绑定的显示对象
         *
         * @param {number} id
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.removeDisplay = function (id) {
            var cd = this._cdObj[id];
            if (cd) {
                var icdDisplay = this._disObj[id];
                if (icdDisplay) {
                    cd.removeICDDisplay(icdDisplay);
                }
                delete this._disObj[id];
            }
        };
        /**
         * 数据处理
         *
         * @param {number} delta 时间增量
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.doData = function (delta) {
            if (this._cdArr.length > 0) {
                var cdArr = this._cdArr;
                var len = cdArr.length;
                var cd = void 0;
                for (var index = len - 1; index >= 0; index--) {
                    cd = cdArr[index];
                    if (cd) {
                        cd.doData(delta);
                        if (cd.state == 0 /* STOP */)
                            this._cdArr.splice(index, 1);
                    }
                }
            }
        };
        /**
         * 渲染处理
         *
         * @param {number} delta 时间增量
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.doRender = function (delta) {
            if (this._cdArr.length > 0) {
                var cdArr = this._cdArr;
                var len = cdArr.length;
                var cd = void 0;
                for (var index = len - 1; index >= 0; index--) {
                    cd = cdArr[index];
                    if (cd) {
                        cd.doRender(delta);
                    }
                }
            }
        };
        /**
         * 添加CD
         *
         * @param {ICooldown} icd 比如技能配置
         * @param {ICooldownDisplay} [icdDisplay] 和cd绑定的显示对象 比如技能cd遮罩
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.add = function (icd, icdDisplay) {
            if (icd && icd.cd) {
                var cooldown = new jy.Cooldown();
                cooldown.icd = icd;
                var id = icd.id;
                this._cdObj[id] = cooldown;
                if (icdDisplay) {
                    this.addDisplay(id, icdDisplay);
                }
                this._cdArr.push(cooldown);
            }
        };
        CooldownManager.prototype.start = function (id) {
            var cooldown = this._cdObj[id];
            if (cooldown) {
                cooldown.start();
            }
        };
        /**
         * 移除CD
         * 如果绑定过显示对象也会移除
         *
         * @param {number} id
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.remove = function (id) {
            if (id) {
                var cooldown = this._cdObj[id];
                if (cooldown) {
                    cooldown.stop();
                    this._cdArr.remove(cooldown);
                }
                this.removeDisplay(id);
            }
        };
        /**
         * 移除某cd时间的所有Cooldown
         *
         * @param {number} cd
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.removeByCDTime = function (cd) {
            if (cd) {
                var cdObj = this._cdObj;
                var cooldown = void 0;
                for (var id in cdObj) {
                    cooldown = cdObj[id];
                    if (cooldown && cooldown.icd && cooldown.icd.cd == cd) {
                        this.remove(+id);
                    }
                }
            }
        };
        // /**
        //  * 重置CD时间<br/>
        //  * 由于基于服务器时间戳，<font color='#ff0000'><b>需要等拿到服务器时间戳以后</b></font>，才可以进行CD的设置
        //  * @param serverData		<br/>
        //  * 	key		String		cdid<br/>
        //  * 	value	Number	CD到期的服务器时间戳
        //  *
        //  */
        // public reset(serverData: Object) {
        //     let serverTime: number = DateUtils.serverTime;
        //     let cdObj = this._cdObj;
        //     let cooldown: Cooldown;
        //     let expireTime: number;
        //     let leftTime: number;
        //     for (let id in serverData) {
        //         cooldown = cdObj[id];
        //         if (cooldown) {
        //             //停止cd
        //             cooldown.stop();
        //             this._cdArr.remove(cooldown);
        //             expireTime = serverData[id] || 0;
        //             //剩余时间
        //             leftTime = expireTime - serverTime;
        //             cooldown.icd.cd = leftTime;
        //         }
        //     }
        // }
        /**
         * 销毁某个CD
         *
         * @param {number} id
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.dispose = function (id) {
            if (id) {
                var cd = this._cdObj[id];
                if (cd) {
                    cd.dispose();
                    this._cdArr.remove(cd);
                }
                delete this._cdObj[id];
            }
        };
        /**
         * 销毁全部CD
         *
         * @memberOf CooldownManager
         */
        CooldownManager.prototype.disposeAll = function () {
            var cdObj = this._cdObj;
            for (var id in cdObj) {
                var cd = cdObj[id];
                if (cd) {
                    cd.dispose();
                }
            }
            this._cdArr.length = 0;
            this._cdObj = {};
            this._disObj = {};
        };
        return CooldownManager;
    }());
    jy.CooldownManager = CooldownManager;
    __reflect(CooldownManager.prototype, "jy.CooldownManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 时间冷却遮罩
     * @author pb
     */
    var CooldownMask = /** @class */ (function () {
        function CooldownMask(sl, ox, oy) {
            this._sl = sl;
            this._hl = this._sl >> 1;
            this._ox = ox;
            this._oy = oy;
        }
        /**
         * 绑定组件皮肤
         * 添加遮罩到组件皮肤
         */
        CooldownMask.prototype.bind = function (target) {
            this._mask = new egret.Shape();
            this._g = this._mask.graphics;
            if (target) {
                target.addChild(this._mask);
            }
        };
        /**
         * 解除绑定组件皮肤
         */
        CooldownMask.prototype.unbind = function () {
            if (this._mask.parent) {
                this._mask.parent.removeChild(this._mask);
            }
        };
        CooldownMask.prototype.setRadian = function (radian) {
            if (this._mask.stage) {
                var g = this._g;
                g.clear();
                g.beginFill(CooldownMask.COLOR, CooldownMask.ALPHA);
                var hl = this._hl;
                var sl = this._sl;
                var oy = this._oy;
                var ox = this._ox;
                var x = this._x;
                var y = this._y;
                if (radian < CooldownMask._45) {
                    y = oy;
                    x = hl + Math.tan(radian) * hl;
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(sl, oy);
                    g.lineTo(sl, sl);
                    g.lineTo(ox, sl);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._45 && radian < CooldownMask._135) {
                    x = sl;
                    y = hl - hl / Math.tan(radian);
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(sl, sl);
                    g.lineTo(ox, sl);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._135 && radian < CooldownMask._225) {
                    y = sl;
                    x = radian > CooldownMask._lt180 && radian < CooldownMask._gt180 ? hl : hl - hl * Math.tan(radian);
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(ox, sl);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._225 && radian < CooldownMask._315) {
                    x = ox;
                    y = hl + hl / Math.tan(radian);
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(ox, oy);
                    g.lineTo(hl, oy);
                }
                else if (radian >= CooldownMask._315) {
                    y = oy;
                    x = hl + Math.tan(radian) * hl;
                    g.moveTo(hl, oy);
                    g.lineTo(hl, hl);
                    g.lineTo(x, y);
                    g.lineTo(hl, oy);
                }
                g.endFill();
            }
        };
        /*渲染处理*/
        CooldownMask.prototype.doRender = function (delta) {
            this._duration = ~~this._duration + delta;
            var radian = this._deltaRadian * this._duration;
            this.setRadian(radian);
        };
        CooldownMask.prototype.add = function (cdTotalTime) {
            if (cdTotalTime) {
                this._deltaRadian = Math.PI * 2 / cdTotalTime;
            }
            this._duration = 0;
            var g = this._g;
            g.clear();
            g.beginFill(CooldownMask.COLOR, CooldownMask.ALPHA);
            g.drawRect(this._ox, this._oy, this._sl, this._sl);
            g.endFill();
        };
        CooldownMask.prototype.remove = function () {
            this._duration = 0;
            this._deltaRadian = 0;
            if (this._g) {
                this._g.clear();
            }
        };
        CooldownMask.prototype.dispose = function () {
            this.remove();
            this.unbind();
        };
        CooldownMask._45 = Math.PI * 0.25;
        CooldownMask._135 = Math.PI * 0.75;
        CooldownMask._225 = Math.PI * 1.25;
        CooldownMask._315 = Math.PI * 1.75;
        //private static _360: number = Math.PI * 2;
        CooldownMask._gt180 = Math.PI * 180.1 / 180;
        CooldownMask._lt180 = Math.PI * 179.9 / 180;
        CooldownMask.COLOR = 0;
        CooldownMask.ALPHA = .6;
        return CooldownMask;
    }());
    jy.CooldownMask = CooldownMask;
    __reflect(CooldownMask.prototype, "jy.CooldownMask", ["jy.ICooldownDisplay"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 地图的PB数据
     */
    jy.MapPB = {
        //↓↓↓↓↓ [文本框中，复制粘贴] ↓↓↓↓↓
        /*GridMapInfoPB*/ 110: { 1: ["columns", 2, 5], 2: ["rows", 2, 5], 3: ["gridWidth", 2, 5], 4: ["gridHeight", 2, 5], 5: ["pathdata", 1, 12], 6: ["alphadata", 1, 12] },
        /*MapEffPB*/ 111: { 1: ["uri", 2, 9], 2: ["layer", 2, 5], 3: ["x", 2, 17], 4: ["y", 2, 17], 5: ["scaleX", 2, 17], 6: ["scaleY", 2, 17], 7: ["duration", 1, 5], 8: ["speedX", 1, 17], 9: ["speedY", 1, 17], 10: ["seed", 1, 5], 11: ["rotation", 1, 17] },
        /*MapInfoPB*/ 112: { 1: ["id", 2, 5], 2: ["extType", 2, 5], 3: ["type", 2, 5], 4: ["width", 2, 5], 5: ["height", 2, 5], 6: ["data", 2, 12], 7: ["effs", 3, 11, 111 /* MapEffPB */], 8: ["lines", 3, 11, 113 /* MapLinePB */], 9: ["ovals", 3, 11, 114 /* MapOvalPB */], 10: ["pWidth", 1, 5], 11: ["pHeight", 1, 5], 12: ["noPic", 1, 12] },
        /*MapLinePB*/ 113: { 1: ["id", 2, 5], 2: ["points", 3, 11, 115 /* MapPointPB */], 3: ["flag", 1, 8], 4: ["type", 1, 5] },
        /*MapOvalPB*/ 114: { 1: ["id", 2, 5], 2: ["a", 1, 5], 3: ["b", 1, 5], 4: ["center", 2, 11, 115 /* MapPointPB */] },
        /*MapPointPB*/ 115: { 1: ["x", 2, 5], 2: ["y", 2, 5] },
        /*MaskPolyPB*/ 116: { 1: ["points", 3, 11, 115 /* MapPointPB */], 2: ["data", 1, 5] },
        /*NavMeshMapInfoPB*/ 117: { 1: ["points", 3, 11, 115 /* MapPointPB */], 2: ["trians", 3, 11, 119 /* TPointIdxPB */], 3: ["polys", 3, 11, 118 /* PolyPointIdxPB */], 4: ["masks", 3, 11, 116 /* MaskPolyPB */] },
        /*PolyPointIdxPB*/ 118: { 1: ["idxs", 3, 5] },
        /*TPointIdxPB*/ 119: { 1: ["a", 2, 5], 2: ["b", 2, 5], 3: ["c", 2, 5] },
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 坐标偏移数据
     */
    var aSurOff = [
        /*↖*/ [-1, -1], /*↑*/ [0, -1], /*↗*/ [1, -1],
        /*←*/ [-1, 0], /*    ㊥    */ /*→*/ [1, 0],
        /*↙*/ [-1, 1], /*↓*/ [0, 1], /*↘*/ [1, 1]
    ];
    var empty = jy.Temp.EmptyObject;
    /**
     * A星寻路算法
     * @author 3tion
     * @export
     * @class Astar
     */
    var Astar = /** @class */ (function () {
        function Astar() {
            /**
             * 最小执行时间
             *
             * @type {number}
             * @memberOf Astar
             */
            this.minCacTime = 5;
        }
        Astar.prototype.bindMap = function (map) {
            this._map = map;
            this._maxLength = map.gridHeight * map.gridWidth;
        };
        /**
         * 获取路径节点
         *
         * @param {number} fx               起点坐标x
         * @param {number} fy               起点坐标y
         * @param {number} tx               终点坐标x
         * @param {number} ty               终点坐标y
         * @param {{ (path: PathNode[], noEnd?: boolean, ...args) }: void } callback    寻找到目标后的 回调方法
         * @param {any} args                回调函数的其他参数
         *
         * @memberOf PathFinder
         */
        Astar.prototype.getPath = function (fx, fy, tx, ty, callback, opt) {
            var map = this._map;
            if (!map) {
                callback.callAndRecycle(null, true);
                return;
            }
            if (fx == tx && fy == ty) {
                callback.callAndRecycle(null, true);
                return;
            }
            var w = map.columns;
            var h = map.rows;
            if (fx > w || fy > h) { //超过最大格位数量
                callback.callAndRecycle(null, false);
                return;
            }
            /**
             * PathNode的字典
             * Key      {number}    y * w + x
             * value    {PathNode}  节点
             */
            var list = [];
            /**待检测点 */
            var openList = [];
            /**已搜寻过的点 */
            var closedList = [];
            var minH = Infinity;
            /**
             * 最小的节点
             */
            var minNode;
            /**
             * 执行步数
             */
            var current = 0;
            var minCacTime = this.minCacTime;
            var ctrl = { stop: false };
            add(fx, fy, 0, (Math.abs(tx - fx) + Math.abs(ty - fy)) * 10);
            var stage = egret.sys.$TempStage;
            var _a = opt || empty, sync = _a.sync, max = _a.max;
            var maxLength = max || this._maxLength;
            if (sync) {
                var result = void 0;
                do {
                    result = onTick();
                } while (!result);
            }
            else {
                stage.on("enterFrame" /* ENTER_FRAME */, onTick, null);
            }
            return ctrl;
            function onTick() {
                var t = Date.now();
                var _loop_1 = function () {
                    if (ctrl.stop) { //如果外部控制结束
                        stage.off("enterFrame" /* ENTER_FRAME */, onTick, null);
                        callback.callAndRecycle(end(minNode), false); //现在外部结束，也给个结果，不过认为没结束
                        return { value: true };
                    }
                    var node = openList.shift();
                    var x = node.x, y = node.y, g = node.g, key = node.key;
                    if (closedList[key]) {
                        return "continue";
                    }
                    //标记已经搜索过的
                    closedList[key] = true;
                    if (x == tx && y == ty) { //找到终点
                        stage.off("enterFrame" /* ENTER_FRAME */, onTick, null);
                        callback.callAndRecycle(end(minNode), true);
                        return { value: true };
                    }
                    aSurOff.forEach(function (element) {
                        var tmpx = element[0] + x;
                        var tmpy = element[1] + y;
                        if (tmpx < 0 || tmpy < 0 || tmpx >= w || tmpy >= h) {
                            return;
                        }
                        var currentG = map.getWalk(tmpx, tmpy);
                        if (currentG == 0 || closedList[tmpy * w + tmpx]) {
                            return;
                        }
                        var tmp1 = tmpx - x + tmpy - y;
                        tmp1 = tmp1 < 0 ? -tmp1 : tmp1;
                        var tmp2 = tx - tmpx;
                        tmp2 = tmp2 < 0 ? -tmp2 : tmp2;
                        var tmp3 = ty - tmpy;
                        tmp3 = tmp3 < 0 ? -tmp3 : tmp3;
                        var tmpG = 0;
                        if (tmpx != x || tmpy != y) {
                            if (tmp1 == 1) {
                                tmpG = 10 + g;
                            }
                            else {
                                tmpG = 14 + g;
                            }
                            tmpG += currentG;
                        }
                        add(tmpx, tmpy, tmpG, (tmp2 + tmp3) * 10, node);
                    });
                    current++;
                    if (current > maxLength) {
                        return "break";
                    }
                    if (Date.now() - t > minCacTime) { //超过执行时间，下帧再执行
                        return { value: void 0 };
                    }
                };
                while (openList.length) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === "object")
                        return state_1.value;
                    if (state_1 === "break")
                        break;
                }
                callback.callAndRecycle(end(minNode), false);
                return true;
            }
            function end(node) {
                // 移除监听
                stage.off("enterFrame" /* ENTER_FRAME */, onTick, null);
                var list = [];
                var j = 0;
                for (var i = node.step; i > 0; i--) {
                    list[i - 1] = node;
                    node = node.prev;
                }
                return list;
            }
            function add(x, y, g, h, prev) {
                var key = y * w + x;
                var node = list[key];
                var f = g + h;
                if (!node) {
                    list[key] = node = { key: key, x: x, y: y, g: g, h: h, f: f, prev: prev, step: prev ? prev.step + 1 : 0 };
                }
                //得到预估值最小的节点
                if (minH > h) {
                    minH = h;
                    minNode = node;
                }
                var len = openList.length;
                if (len) {
                    var idx = len >> 1;
                    var num = len;
                    len--;
                    //使用二分法将节点进行重新排序
                    while (num > 1) {
                        num = (num + (num & 1)) >> 1;
                        if (f <= openList[idx].f) {
                            idx -= num;
                            if (idx < 0)
                                idx = 0;
                        }
                        else {
                            idx += num;
                            if (idx > len) {
                                idx = len;
                            }
                        }
                    }
                    if (f > openList[idx].f) {
                        idx++;
                    }
                    for (var i = len + 1; i > idx; i--) {
                        openList[i] = openList[i - 1];
                    }
                    openList[i] = node;
                }
                else {
                    openList[0] = node;
                }
            }
        };
        return Astar;
    }());
    jy.Astar = Astar;
    __reflect(Astar.prototype, "jy.Astar", ["jy.PathFinder"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    if (true) {
        $gm.regPathDraw(0 /* Grid */, function (x, y, w, h, map) {
            var gp = this.debugGridPanes;
            if (!gp) {
                this.debugGridPanes = gp = [];
            }
            var k = 0;
            if ($gm.$showMapGrid) {
                var tex = this.debugGridTexture;
                var gridWidth = map.gridWidth, gridHeight = map.gridHeight;
                var hw = gridWidth >> 1;
                var hh = gridHeight >> 1;
                if (!tex) {
                    var s = new egret.Shape;
                    var g = s.graphics;
                    g.lineStyle(1, 0xcccc);
                    g.beginFill(0xcccc, 0.5);
                    g.drawRect(0, 0, gridWidth, gridHeight);
                    g.endFill();
                    var tex_1 = new egret.RenderTexture();
                    tex_1.drawToTexture(s);
                    this.debugGridTexture = tex_1;
                }
                for (var i = x / gridWidth >> 0, len = i + w / gridWidth + 1, jstart = y / gridHeight >> 0, jlen = jstart + h / gridHeight + 1; i < len; i++) {
                    for (var j = jstart; j < jlen; j++) {
                        if (!map.getWalk(i, j)) {
                            var s = gp[k];
                            if (!s) {
                                gp[k] = s = new egret.Bitmap();
                            }
                            s.texture = tex;
                            this.addChild(s);
                            k++;
                            s.x = i * gridWidth - hw;
                            s.y = j * gridHeight - hh;
                        }
                    }
                }
            }
            for (var i = k; i < gp.length; i++) {
                var bmp = gp[i];
                bmp.texture = null;
                jy.removeDisplay(bmp);
            }
            gp.length = k;
        });
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    var Point = egret.Point;
    var Triangle = /** @class */ (function (_super) {
        __extends(Triangle, _super);
        function Triangle(p1, p2, p3) {
            var _this = _super.call(this) || this;
            _this.sides = [new jy.Line, new jy.Line, new jy.Line];
            /**
             * 三角的中心x
             */
            _this.x = 0;
            /**
             * 三角的中心y
             */
            _this.y = 0;
            /**
             * 数据是否计算过
             */
            _this._calced = false;
            _this.pA = p1 || new Point;
            _this.pB = p2 || new Point;
            _this.pC = p3 || new Point;
            _this.points = [p1, p2, p3];
            return _this;
        }
        Triangle.prototype.setPoints = function (p1, p2, p3) {
            var _a = this, pA = _a.pA, pB = _a.pB, pC = _a.pC;
            pA.copyFrom(p1);
            pB.copyFrom(p2);
            pC.copyFrom(p3);
            this._calced = false;
            return this;
        };
        Triangle.prototype.calculateData = function () {
            if (!this._calced) {
                var _a = this, pA = _a.pA, pB = _a.pB, pC = _a.pC;
                //@ts-ignore
                this.x = (pA.x + pB.x + pC.x) / 3;
                //@ts-ignore
                this.y = (pA.y + pB.y + pC.y) / 3;
                var sides = this.sides;
                sides[0 /* SideAB */].setPoints(pA, pB); // line AB
                sides[1 /* SideBC */].setPoints(pB, pC); // line BC
                sides[2 /* SideCA */].setPoints(pC, pA); // line CA
                this._calced = true;
            }
        };
        /**
         * 检查点是否在三角形中间
         * @param testPoint
         */
        Triangle.prototype.contain = function (testPoint) {
            this.calculateData();
            // 点在所有边的右面或者线上
            return this.sides.every(function (side) {
                return side.classifyPoint(testPoint, 0.000001 /* Epsilon */) != 1 /* LeftSide */;
            });
        };
        return Triangle;
    }(jy.Polygon));
    jy.Triangle = Triangle;
    __reflect(Triangle.prototype, "jy.Triangle");
    var distance = Point.distance;
    function getMidPoint(midPoint, pA, pB) {
        midPoint.setTo((pA.x + pB.x) / 2, (pA.y + pB.y) / 2);
        return midPoint;
    }
    /**
      * 获得两个点的相邻的三角形
      * @param pA
      * @param pB
      * @param caller true 如果提供的两个点是caller的一个边
      */
    function requestLink(pA, pB, index, target) {
        var pointA = target.pA, pointB = target.pB, pointC = target.pC, links = target.links;
        if (pointA.equals(pA)) {
            if (pointB.equals(pB)) {
                links[0 /* SideAB */] = index;
                return true;
            }
            else if (pointC.equals(pB)) {
                links[2 /* SideCA */] = index;
                return true;
            }
        }
        else if (pointB.equals(pA)) {
            if (pointA.equals(pB)) {
                links[0 /* SideAB */] = index;
                return true;
            }
            else if (pointC.equals(pB)) {
                links[1 /* SideBC */] = index;
                return true;
            }
        }
        else if (pointC.equals(pA)) {
            if (pointA.equals(pB)) {
                links[2 /* SideCA */] = index;
                return true;
            }
            else if (pointB.equals(pB)) {
                links[1 /* SideBC */] = index;
                return true;
            }
        }
    }
    var Cell = /** @class */ (function (_super) {
        __extends(Cell, _super);
        function Cell() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.f = 0;
            _this.h = 0;
            _this.isOpen = false;
            _this.parent = null;
            _this.sessionId = 0;
            _this.links = [-1, -1, -1];
            /**
             * 每边的中点
             */
            _this.wallMidPt = [new Point, new Point, new Point];
            /**
             * 每边中点距离
             */
            _this.wallDist = [0, 0, 0];
            /**
             * 边长
             */
            _this.sideLength = [0, 0, 0];
            /**
             * 通过墙的索引
             */
            _this.wall = -1;
            return _this;
        }
        Cell.prototype.init = function () {
            this.calculateData();
            var _a = this, m_WallMidpoint = _a.wallMidPt, m_WallDistance = _a.wallDist, pA = _a.pA, pB = _a.pB, pC = _a.pC, sideLength = _a.sideLength, sides = _a.sides;
            var mAB = getMidPoint(m_WallMidpoint[0 /* SideAB */], pA, pB);
            var mBC = getMidPoint(m_WallMidpoint[1 /* SideBC */], pB, pC);
            var mCA = getMidPoint(m_WallMidpoint[2 /* SideCA */], pC, pA);
            sides.forEach(function (side, idx) {
                sideLength[idx] = Point.distance(side.pA, side.pB);
            });
            m_WallDistance[0] = distance(mAB, mBC);
            m_WallDistance[1] = distance(mCA, mBC);
            m_WallDistance[2] = distance(mAB, mCA);
        };
        /**
         * 检查并设置当前三角型与`cellB`的连接关系（方法会同时设置`cellB`与该三角型的连接）
         * @param cellB
         */
        Cell.prototype.checkAndLink = function (cellB) {
            var _a = this, pA = _a.pA, pB = _a.pB, pC = _a.pC, links = _a.links, index = _a.idx;
            var idx = cellB.idx;
            if (links[0 /* SideAB */] == -1 && requestLink(pA, pB, index, cellB)) {
                links[0 /* SideAB */] = idx;
            }
            else if (links[1 /* SideBC */] == -1 && requestLink(pB, pC, index, cellB)) {
                links[1 /* SideBC */] = idx;
            }
            else if (links[2 /* SideCA */] == -1 && requestLink(pC, pA, index, cellB)) {
                links[2 /* SideCA */] = idx;
            }
        };
        /**
         * 记录路径从上一个节点进入该节点的边（如果从终点开始寻路即为穿出边）
         * @param index	路径上一个节点的索引
         */
        Cell.prototype.setWall = function (index) {
            var m_ArrivalWall = -1;
            var links = this.links;
            if (index == links[0]) {
                m_ArrivalWall = 0;
            }
            else if (index == links[1]) {
                m_ArrivalWall = 1;
            }
            else if (index == links[2]) {
                m_ArrivalWall = 2;
            }
            if (m_ArrivalWall != -1) {
                this.wall = m_ArrivalWall;
            }
            return m_ArrivalWall;
        };
        return Cell;
    }(Triangle));
    jy.Cell = Cell;
    __reflect(Cell.prototype, "jy.Cell");
})(jy || (jy = {}));
//参考项目 https://github.com/blianchen/navMeshTest
var jy;
(function (jy) {
    var Point = egret.Point;
    var abs = Math.abs;
    var tmpPoint = new Point;
    /**
     * 获取格子
     * @param pt
     * @param cells
     */
    function findClosestCell(x, y, map) {
        tmpPoint.setTo(x, y);
        var polys = map.polys, cells = map.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.contain(tmpPoint)) {
                return cell;
            }
        }
        //地图外
        var edge = polys[0];
        if (!edge.contain(tmpPoint)) {
            return edge;
        }
        for (var i = 1; i < polys.length; i++) {
            var cell = polys[i];
            if (cell.contain(tmpPoint)) {
                return cell;
            }
        }
    }
    function getNearestCell(fx, fy, start, cells, calcPoint) {
        var sides = start.sides;
        var minIdx;
        var min = Infinity;
        //找到离起点最近的边
        //算法参考 https://blog.csdn.net/u012138730/article/details/79779996
        for (var i = 0; i < sides.length; i++) {
            var _a = sides[i], pA = _a.pA, pB = _a.pB;
            var pAx = pA.x;
            var dx = pB.x - pAx;
            var pAy = pA.y;
            var dy = pB.y - pAy;
            var pdx = fx - pAx;
            var pdy = fy - pAy;
            var d = dx * dx + dy * dy; //线段长度的平方
            var t = dx * pdx + dy * pdy; // (fx,fy)向量  点积  AB的向量
            if (d > 0) {
                t /= d;
            }
            if (t < 0) { // 当t（r）< 0时，最短距离即为 pt点 和 （A点和P点）之间的距离。
                t = 0;
            }
            else if (t > 1) { // 当t（r）> 1时，最短距离即为 pt点 和 （B点和P点）之间的距离。
                t = 1;
            }
            // t = 0，计算 pt点 和 A点的距离; t = 1, 计算 pt点 和 B点 的距离; 否则计算 pt点 和 投影点 的距离。
            dx = pAx + t * dx - fx;
            dy = pAy + t * dy - fy;
            var dist = dx * dx + dy * dy;
            if (dist < min) {
                min = dist;
                minIdx = i;
                if (calcPoint) {
                    if (t == 0) {
                        calcPoint.copyFrom(pA);
                    }
                    else if (t == 1) {
                        calcPoint.copyFrom(pB);
                    }
                    else {
                        calcPoint.setTo(dx + fx, dy + fy);
                    }
                }
            }
        }
        var cell = cells[start.links[minIdx]];
        return cell;
    }
    function calcH(tx, ty, x, y) {
        var tmp2 = tx - x;
        tmp2 = tmp2 < 0 ? -tmp2 : tmp2;
        var tmp3 = ty - y;
        tmp3 = tmp3 < 0 ? -tmp3 : tmp3;
        return tmp2 + tmp3;
    }
    /**
     * 将格子进行链接，方便寻路
     * @param pv
     */
    function linkCells(pv) {
        var len = pv.length;
        for (var i = 0; i < len; i++) {
            var cellA = pv[i];
            for (var j = i + 1; j < len; j++) {
                var cellB = pv[j];
                cellA.checkAndLink(cellB);
            }
        }
    }
    function linkPolys(polys, cells) {
        var plen = polys.length;
        var clen = cells.length;
        for (var i = 0; i < plen; i++) {
            var poly = polys[i];
            poly.links = [];
            for (var j = 0; j < clen; j++) {
                var cell = cells[j];
                linkPoly(poly, cell);
            }
        }
        function linkPoly(poly, cell) {
            var sides = poly.sides, links = poly.links;
            for (var i = 0; i < sides.length; i++) {
                var side = sides[i];
                var cellSides = cell.sides;
                for (var j = 0; j < cellSides.length; j++) {
                    var cSide = cellSides[j];
                    if (side.equals(cSide)) {
                        links[i] = cell.idx;
                        break;
                    }
                }
            }
        }
    }
    var pathSessionId = 0;
    function compare(a, b) {
        return b.f - a.f;
    }
    var empty = jy.Temp.EmptyObject;
    var NavMeshFinder = /** @class */ (function () {
        function NavMeshFinder() {
            this.openList = new jy.Heap(0, compare);
        }
        NavMeshFinder.prototype.bindMap = function (map) {
            this.map = map;
            if (!map.linked) {
                var cells = map.cells, polys = map.polys;
                linkCells(cells);
                linkPolys(polys, cells);
                map.linked = true;
            }
            this.openList.clear(map.cells.length);
        };
        NavMeshFinder.prototype.getPath = function (fx, fy, tx, ty, callback, opt) {
            var map = this.map;
            if (!map) {
                callback.callAndRecycle(null, true);
                return;
            }
            if (fx == tx && fy == ty) {
                callback.callAndRecycle(null, true);
                return;
            }
            var cells = map.cells;
            var endPos = new Point(tx, ty);
            if (!cells) { //没有格子认为全部可走
                callback.callAndRecycle([endPos], true);
                return;
            }
            opt = opt || empty;
            var start = opt.start, end = opt.end, _a = opt.width, width = _a === void 0 ? 0 : _a;
            if (!start) {
                start = findClosestCell(fx, fy, map);
            }
            if (!start) {
                callback.callAndRecycle(null, true);
                return;
            }
            if (!end) {
                end = findClosestCell(tx, ty, map);
            }
            if (!end) {
                callback.callAndRecycle(null, true);
                return;
            }
            //其实和结束的格位相同
            if (start == end) {
                var result = null;
                if (start instanceof jy.Cell) {
                    result = [endPos];
                }
                callback.callAndRecycle(result, true);
                return;
            }
            var startPos = new Point(fx, fy);
            pathSessionId++;
            var endCell, startCell;
            if (end instanceof jy.Cell) {
                endCell = end;
            }
            else {
                //得到起点和终点连线临近的格子边界点
                endCell = getNearestCell(tx, ty, end, cells, tmpPoint);
                if (!endCell) {
                    callback.callAndRecycle(null, true);
                    return;
                }
                endPos.copyFrom(tmpPoint);
            }
            if (start instanceof jy.Cell) {
                startCell = start;
            }
            else {
                startCell = getNearestCell(fx, fy, start, cells);
                if (!startCell) {
                    callback.callAndRecycle(null, true);
                    return;
                }
            }
            //重新找到的格位相同
            if (startCell == endCell) {
                callback.callAndRecycle([endPos], true);
                return;
            }
            endCell.f = 0;
            endCell.h = 0;
            endCell.isOpen = false;
            endCell.parent = null;
            endCell.sessionId = pathSessionId;
            var openList = this.openList;
            openList.clear();
            openList.put(endCell);
            var node;
            while (openList.size > 0) {
                var currNode = openList.pop();
                //路径是在同一个三角形内
                if (currNode == startCell) {
                    node = currNode;
                    break;
                }
                // 2. 对当前节点相邻的每一个节点依次执行以下步骤:
                //所有邻接三角型
                var links = currNode.links;
                for (var i = 0; i < 3; i++) {
                    var adjacentId = links[i];
                    // 3. 如果该相邻节点不可通行或者该相邻节点已经在封闭列表中,
                    //    则什么操作也不执行,继续检验下一个节点;
                    if (adjacentId < 0) { //不能通过
                        continue;
                    }
                    var adjacentTmp = cells[adjacentId];
                    if (adjacentTmp) {
                        var f = currNode.f + adjacentTmp.wallDist[abs(i - currNode.wall)] || 0;
                        if (adjacentTmp.sessionId != pathSessionId) {
                            // 4. 如果该相邻节点不在开放列表中,则将该节点添加到开放列表中, 
                            //    并将该相邻节点的父节点设为当前节点,同时保存该相邻节点的G和F值;
                            adjacentTmp.sessionId = pathSessionId;
                            adjacentTmp.parent = currNode;
                            adjacentTmp.isOpen = true;
                            //H和F值
                            adjacentTmp.h = calcH(fx, fy, adjacentTmp.x, adjacentTmp.y);
                            adjacentTmp.f = f;
                            //放入开放列表并排序
                            openList.put(adjacentTmp);
                            adjacentTmp.setWall(currNode.idx);
                        }
                        else {
                            // 5. 如果该相邻节点在开放列表中, 
                            //    则判断若经由当前节点到达该相邻节点的G值是否小于原来保存的G值,
                            //    若小于,则将该相邻节点的父节点设为当前节点,并重新设置该相邻节点的G和F值
                            if (adjacentTmp.isOpen) { //已经在openList中
                                if (f < adjacentTmp.f) {
                                    adjacentTmp.f = currNode.f;
                                    adjacentTmp.parent = currNode;
                                    adjacentTmp.setWall(currNode.idx);
                                }
                            }
                        }
                    }
                }
            }
            var path;
            if (node) {
                path = [];
                _tmp.cell = node;
                _tmp.pos = startPos;
                while (getWayPoint(_tmp, endPos, width)) {
                    path.push(_tmp.pos);
                }
                path.push(endPos);
            }
            callback.callAndRecycle(path, true);
            return;
        };
        return NavMeshFinder;
    }());
    jy.NavMeshFinder = NavMeshFinder;
    __reflect(NavMeshFinder.prototype, "jy.NavMeshFinder", ["jy.PathFinder"]);
    var _tmp = {
        cell: null,
        pos: null
    };
    var _lastLineA = new jy.Line();
    var _lastLineB = new jy.Line();
    function getSideAB(_a, width) {
        var wall = _a.wall, sides = _a.sides, sideLength = _a.sideLength, wallMidPt = _a.wallMidPt;
        var line = sides[wall];
        var lineLength = sideLength[wall];
        var outA = new Point();
        var outB = new Point();
        if (lineLength <= width * 2) {
            var midPt = wallMidPt[wall];
            outA.copyFrom(midPt);
            outB.copyFrom(midPt);
        }
        else {
            var pA = line.pA, pB = line.pB;
            var dx = pB.x - pA.x;
            var dy = pB.y - pA.y;
            var delta = width / lineLength;
            dx = dx * delta;
            dy = dy * delta;
            outA.setTo(pA.x + dx, pA.y + dy);
            outB.setTo(pB.x - dx, pB.y - dy);
        }
        return { pA: outA, pB: outB };
    }
    /**
     *
     * @param tmp
     * @param endPos
     * @param width 可走宽度，如果通过边的边长低于2倍宽度，则直接走边的中点，否则按通过边的通过点+宽度得到的点
     */
    function getWayPoint(tmp, endPos, width) {
        var cell = tmp.cell;
        var startPt = tmp.pos;
        var outSide = getSideAB(cell, width);
        var lastPtA = outSide.pA;
        var lastPtB = outSide.pB;
        var lastLineA = _lastLineA;
        var lastLineB = _lastLineB;
        lastLineA.setPoints(startPt, lastPtA);
        lastLineB.setPoints(startPt, lastPtB);
        var lastCell = cell;
        cell = cell.parent;
        do {
            var testA = void 0, testB = void 0;
            var next = cell.parent;
            if (next) {
                var outSide_1 = getSideAB(cell, width);
                testA = outSide_1.pA;
                testB = outSide_1.pB;
            }
            else {
                testA = endPos;
                testB = endPos;
            }
            if (!lastPtA.equals(testA)) {
                if (lastLineB.classifyPoint(testA) == 2 /* RightSide */) {
                    tmp.cell = lastCell;
                    tmp.pos = lastPtB;
                    return true;
                }
                else if (lastLineA.classifyPoint(testA) != 1 /* LeftSide */) {
                    lastPtA = testA;
                    lastCell = cell;
                    lastLineA.setPB(lastPtA);
                }
            }
            if (!lastPtB.equals(testB)) {
                if (lastLineA.classifyPoint(testB) == 1 /* LeftSide */) {
                    tmp.cell = lastCell;
                    tmp.pos = lastPtA;
                    return true;
                }
                else if (lastLineB.classifyPoint(testB) != 2 /* RightSide */) {
                    lastPtB = testB;
                    lastCell = cell;
                    lastLineB.setPB(lastPtB);
                }
            }
            cell = next;
        } while (cell);
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    var rect = new egret.Rectangle;
    if (true) {
        $gm.regPathDraw(1 /* NavMesh */, function (x, y, w, h, map) {
            var gp = this.debugPane;
            if (!gp) {
                this.debugPane = gp = new egret.Sprite;
            }
            if ($gm.$showMapGrid) {
                var cells = map.cells;
                var g = gp.graphics;
                gp.removeChildren();
                g.clear();
                if (cells) {
                    rect.setTo(x, y, w, h);
                    g.lineStyle(2, 0xff00);
                    for (var i = 0; i < cells.length; i++) {
                        var _a = cells[i], pA = _a.pA, pB = _a.pB, pC = _a.pC, x_1 = _a.x, y_1 = _a.y, idx = _a.idx;
                        if (rect.containsPoint(pA) || rect.containsPoint(pB) || rect.containsPoint(pC) || rect.contains(x_1, y_1)) {
                            var tf = new egret.TextField();
                            tf.size = 18;
                            tf.strokeColor = 0;
                            tf.textColor = 0xff00;
                            tf.text = idx + "";
                            tf.x = x_1 - tf.textWidth * .5;
                            tf.y = y_1 - tf.textHeight * .5;
                            gp.addChild(tf);
                            g.beginFill(0xff00, 0.1);
                            g.moveTo(pA.x, pA.y);
                            g.lineTo(pB.x, pB.y);
                            g.lineTo(pC.x, pC.y);
                            g.lineTo(pA.x, pA.y);
                            g.endFill();
                        }
                    }
                    this.addChild(gp);
                }
            }
            else {
                jy.removeDisplay(gp);
            }
        });
    }
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 旋转的屏幕抖动
     * 角度统一从0开始，正向或者逆向旋转，振幅从最大到0
     *
     * @export
     * @class CircleShake
     * @extends {BaseShake}
     * @author 3tion
     */
    var CircleShake = /** @class */ (function (_super) {
        __extends(CircleShake, _super);
        function CircleShake() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
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
        CircleShake.prototype.init = function (swing, endRad, cx, cy, time) {
            if (time === void 0) { time = 150; }
            this._eR = endRad;
            /**
             * 总时间
             */
            var total = endRad / Math.PI2 * time;
            if (swing < 0) {
                swing = -swing;
            }
            this._swing = swing;
            this._dRad = endRad / total;
            this._dSwing = -swing / total;
            this._total = total;
            this.setTargetPos(cx, cy);
            return this;
        };
        CircleShake.prototype.tick = function (duration, outPt) {
            var rad = duration * this._dRad;
            var swing = this._swing + duration * this._dSwing;
            outPt.x = Math.round(this._cx + swing * Math.cos(rad));
            outPt.y = Math.round(this._cy + swing * Math.sin(rad));
        };
        return CircleShake;
    }(jy.BaseShake));
    jy.CircleShake = CircleShake;
    __reflect(CircleShake.prototype, "jy.CircleShake");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 带方向的震动
     *
     * @export
     * @class DirectionShake
     * @extends {BaseShake}
     */
    var DirectionShake = /** @class */ (function (_super) {
        __extends(DirectionShake, _super);
        function DirectionShake() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
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
        DirectionShake.prototype.init1 = function (fx, fy, tx, ty, cx, cy, swing, count, time) {
            if (swing === void 0) { swing = 30; }
            if (count === void 0) { count = 3; }
            if (time === void 0) { time = 90; }
            var dx = tx - fx;
            var dy = ty - fy;
            var dist = Math.sqrt(dx * dx + dy * dy);
            this.init(dx / dist, dy / dist, cx, cy, swing, count, time);
        };
        /**
         * 初始化一个有方向的Shake
         * @param {number} rad              方向(弧度)			使用Math.atan2(toY-fromY,toX-fromX)
         * @param {number} [cx]             单位X方向基准值      一般为单位初始值
         * @param {number} [cy]             单位Y方向基准值      一般为单位初始值
         * @param {number} [swing=30]       最大振幅，振幅会按次数衰减到0
         * @param {number} [count=3]        震动次数，此次数指的是 单摆摆动的从`最低点`到`最高点`再回到`最低点`，  即一次完整的摆动 下->左->下   或者 下->右->下
         * @param {number} [time=90]        单次震动的时间
         */
        DirectionShake.prototype.init2 = function (rad, cx, cy, swing, count, time) {
            if (swing === void 0) { swing = 30; }
            if (count === void 0) { count = 3; }
            if (time === void 0) { time = 90; }
            this.init(Math.cos(rad), Math.sin(rad), cx, cy, swing, count, time);
        };
        DirectionShake.prototype.init = function (cos, sin, cx, cy, swing, count, time) {
            if (swing === void 0) { swing = 30; }
            if (count === void 0) { count = 3; }
            if (time === void 0) { time = 90; }
            if (~~time < 30) {
                time = 30;
            }
            if (~~count < 1) {
                count = 1;
            }
            var total = time * count;
            this._dSwing = -swing / total;
            this._dRad = Math.PI / time;
            this._count = count;
            this.setTargetPos(cx, cy);
            this._cos = cos;
            this._sin = sin;
            this._total = total;
            return this;
        };
        DirectionShake.prototype.tick = function (duration, outPt) {
            var swing = this._dSwing * duration * Math.sin(duration * this._dRad);
            outPt.x = Math.round(this._cx + this._cos * swing);
            outPt.y = Math.round(this._cy + this._sin * swing);
        };
        return DirectionShake;
    }(jy.BaseShake));
    jy.DirectionShake = DirectionShake;
    __reflect(DirectionShake.prototype, "jy.DirectionShake");
})(jy || (jy = {}));
var jy;
(function (jy) {
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
    var RotateShake = /** @class */ (function (_super) {
        __extends(RotateShake, _super);
        function RotateShake() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
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
        RotateShake.prototype.init = function (startRad, endRad, swing, cx, cy, total) {
            if (swing === void 0) { swing = 30; }
            if (total === void 0) { total = 150; }
            this._sR = startRad;
            this._eR = endRad;
            this._swing = swing;
            this._dRad = (endRad - startRad) / total;
            this.setTargetPos(cx, cy);
            return this;
        };
        RotateShake.prototype.tick = function (duration, outPt) {
            var rad = duration * this._dRad;
            var swing = this._swing + Math.sin(duration * Math.PI);
            outPt.x = Math.round(this._cx + swing * Math.cos(rad));
            outPt.y = Math.round(this._cy + swing * Math.sin(rad));
        };
        return RotateShake;
    }(jy.BaseShake));
    jy.RotateShake = RotateShake;
    __reflect(RotateShake.prototype, "jy.RotateShake");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 屏幕抖动管理器
     *
     * @export
     * @class ScreenShakeManager
     */
    var ScreenShakeManager = /** @class */ (function () {
        function ScreenShakeManager() {
            /**
             * 释放可震动
             *
             * @type {boolean}
             */
            this.shakable = true;
            this._pt = { x: 0, y: 0 };
            this._tmp = new egret.Rectangle();
        }
        ScreenShakeManager.prototype.setLimits = function (width, height, x, y) {
            if (width === void 0) { width = Infinity; }
            if (height === void 0) { height = Infinity; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._limits = new egret.Rectangle(x, y, width, height);
            return this;
        };
        /**
         * 开始一个新的震动
         *
         * @template T
         * @param {T} shake
         * @returns T
         */
        ScreenShakeManager.prototype.start = function (shake) {
            if (this.shakable) {
                var cur = this._cur;
                if (cur) {
                    cur.end();
                }
                this._cur = shake;
                var engine = jy.GameEngine.instance;
                var layer = engine.getLayer(1000 /* Game */);
                if (cur != shake) {
                    shake.setShakeTarget(layer);
                }
                shake.setTargetPos().start();
                this._st = jy.Global.now;
                egret.startTick(this.tick, this);
            }
            return shake;
        };
        ScreenShakeManager.prototype.tick = function () {
            var shake = this._cur;
            var duration = jy.Global.now - this._st;
            if (duration < shake.total) {
                var pt = this._pt;
                var cur = this._cur;
                cur.tick(duration, pt);
                var target = cur.target;
                var limits = this._limits;
                var px = pt.x;
                var py = pt.y;
                var x = px, y = py;
                if (limits) {
                    var rect = jy.GameEngine.instance.viewRect;
                    if (px < 0) {
                        var lx = limits.x;
                        var rx = rect.x;
                        x = rx + px > lx ? px : lx;
                    }
                    else {
                        var dw = limits.width - rect.width;
                        x = px < dw ? px : dw;
                    }
                    if (py < 0) {
                        var ly = limits.y;
                        var ry = rect.y;
                        y = ry + py > ly ? px : ly;
                    }
                    else {
                        var dh = limits.height - rect.height;
                        y = py < dh ? py : dh;
                    }
                }
                target.x = x;
                target.y = y;
            }
            else {
                shake.end();
            }
            return true;
        };
        return ScreenShakeManager;
    }());
    jy.ScreenShakeManager = ScreenShakeManager;
    __reflect(ScreenShakeManager.prototype, "jy.ScreenShakeManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 带坐骑动作的UnitAction基类
     * @author 3tion
     */
    var MUnitAction = /** @class */ (function (_super) {
        __extends(MUnitAction, _super);
        function MUnitAction() {
            return _super.call(this) || this;
        }
        MUnitAction.prototype.getAction = function (mountType) {
            if (mountType in this.actions) {
                return this.actions[mountType];
            }
            return jy.UnitAction.defaultAction;
        };
        return MUnitAction;
    }(jy.UnitAction));
    jy.MUnitAction = MUnitAction;
    __reflect(MUnitAction.prototype, "jy.MUnitAction");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     *
     * @export
     * @class UModel
     * @extends {egret.DisplayObjectContainer}
     * @author 3tion
     */
    var UModel = /** @class */ (function (_super) {
        __extends(UModel, _super);
        function UModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 检查/重置资源列表
         *
         * @param {Key[]} resOrder 部位的排列顺序
         * @param {{ [index: string]: UnitResource }} resDict 部位和资源的字典
         */
        UModel.prototype.checkResList = function (resOrder, resDict) {
            var children = this.$children;
            var i = 0;
            var len = children.length;
            var part;
            for (var _i = 0, resOrder_1 = resOrder; _i < resOrder_1.length; _i++) {
                var key = resOrder_1[_i];
                var res = resDict[key];
                if (res) {
                    if (i < len) {
                        part = children[i++];
                    }
                    else {
                        part = jy.recyclable(jy.ResourceBitmap);
                        this.addChild(part);
                    }
                    part.res = res;
                }
            }
            //移除多余子对象
            for (var j = len - 1; j >= i; j--) {
                part = this.$doRemoveChild(j);
                part.recycle();
            }
        };
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
        UModel.prototype.renderFrame = function (frame, now, face, info) {
            var d;
            if (frame) {
                d = frame.d;
                if (d == -1) {
                    d = face;
                }
                info.f = frame.f;
                info.a = frame.a;
            }
            else {
                d = face;
            }
            var scale = 1;
            if (d > 4) {
                scale = -1;
                d = 8 - d;
            }
            info.d = d;
            this.scaleX = scale;
            return this.draw(info, now);
        };
        UModel.prototype.draw = function (info, now) {
            var flag = true;
            //渲染
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var res = _a[_i];
                flag = res.draw(info, now) && flag;
            }
            return flag;
        };
        UModel.prototype.clear = function () {
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.alpha = 1;
            this.x = 0;
            this.y = 0;
            var list = this.$children;
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var bmp = list_1[_i];
                bmp.recycle();
            }
        };
        UModel.prototype.onRecycle = function () {
            jy.removeDisplay(this);
            this.clear();
        };
        return UModel;
    }(egret.DisplayObjectContainer));
    jy.UModel = UModel;
    __reflect(UModel.prototype, "jy.UModel");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 基本单位<br/>
     * 是一个状态机<br/>
     * @author 3tion
     *
     */
    var Unit = /** @class */ (function (_super) {
        __extends(Unit, _super);
        function Unit() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * 当前骑乘标识
             */
            _this._mountType = 0 /* ground */;
            _this._z = 0;
            _this._rotation = 0;
            return _this;
        }
        Object.defineProperty(Unit.prototype, "playSpeed", {
            /**
             * 播放速度，默认为1倍速度<br/>
             * 值越高，速度越快
             */
            get: function () {
                return this._render.playSpeed;
            },
            /**
             * 设置播放速度
             */
            set: function (value) {
                this._render.playSpeed = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Unit.prototype, "model", {
            /**
             * 用于放纸娃娃贴图的容器
             * 只允许放ResourceBitmap
             */
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Unit.prototype, "resDict", {
            /**
             * 人物底图资源的字典
             * key      {string}            部位
             * value    {UnitResource}      资源
             * @readonly
             * @type {{}
             */
            get: function () {
                return this._resDict;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Unit.prototype, "pst", {
            /**
             * 设置单位pst
             */
            set: function (pst) {
                var pstInfo = this.getPstInfo(pst);
                if (pstInfo != this._pstInfo) {
                    this._pstInfo = pstInfo;
                    this.pstInfoChange();
                }
            },
            enumerable: true,
            configurable: true
        });
        Unit.prototype.init = function (pst, setting) {
            this._resDict = {};
            this.initDisplayList(setting);
            this.pst = pst;
            this.initDefaultAction();
            this.startUnitAction();
            this.onSpawn();
            return this;
        };
        Unit.prototype.onSpawn = function () {
            if (this.state != 1 /* Stage */) {
                this.state = 0 /* Init */;
            }
            this.dispatch(-1998 /* UnitCreate */);
        };
        /**
         * 重置渲染器时间
         *
         * @param {number} now (description)
         */
        Unit.prototype.resetRenderTime = function (now) {
            this._render.reset(now);
        };
        /**
         * 初始化显示列表
         * @param setting
         */
        Unit.prototype.initDisplayList = function (setting) {
            var render = new jy.UnitRender(this);
            var ref = setting.modelRef || jy.UModel;
            var model = new ref;
            var body = new jy.DSprite();
            this._render = render;
            render.model = model;
            this._model = model;
            this.body = body;
            body.addChild(model);
            //其他设置
            this._depth = setting.getDepth();
            if (setting.addToEngine) {
                this.addedToEngine();
            }
        };
        Object.defineProperty(Unit.prototype, "faceTo", {
            /**
             * 获取朝向
             */
            get: function () {
                return this._render.faceTo;
            },
            /**
             * 设置朝向
             */
            set: function (value) {
                this.$setFaceTo(value);
            },
            enumerable: true,
            configurable: true
        });
        Unit.prototype.$setFaceTo = function (value) {
            this._render.faceTo = value >> 0;
        };
        /**
         * 播放自定义动作
         *
         * @param {ActionInfo} customAction 自定义动作
         * @param {number} [startFrame=-1]  起始帧
         */
        Unit.prototype.doCustomAction = function (customAction, startFrame) {
            if (startFrame === void 0) { startFrame = -1; }
            var render = this._render;
            var action = customAction.key;
            if (this._action != action) {
                this._action = action;
                render.actionInfo = customAction;
                startFrame = 0;
            }
            if (startFrame > -1) {
                render.f = startFrame;
            }
        };
        /**
         * 执行动作序列
         * @private 只允许UnitAction调用
         */
        Unit.prototype.doAction = function (now, action, startFrame) {
            if (startFrame === void 0) { startFrame = -1; }
            var render = this._render;
            action = ~~action;
            if (this._action != action) {
                this._action = action;
                render.actionInfo = this._pstInfo.frames[action];
                render.reset(now);
                startFrame = 0;
            }
            if (startFrame > -1) {
                render.f = startFrame;
            }
            return render.actionInfo;
        };
        /**
         * 获取当前动作序列
         */
        Unit.prototype.getCurAction = function () {
            return this._render.actionInfo;
        };
        /**
         * 对指定部位设置资源
         *
         * @protected
         * @param {Key} part 部位
         * @param {string} [uri] 资源路径，不传则清空部位
         * @param {string} [pst] 通过其他pst配置进行加载
         */
        Unit.prototype.setRes = function (part, uri, pst) {
            var old = this._resDict[part];
            var res;
            if (uri) {
                var pstInfo = void 0;
                if (pst) {
                    pstInfo = this.getPstInfo(pst);
                }
                else {
                    pstInfo = this._pstInfo;
                }
                if (pstInfo) {
                    res = pstInfo.getUnitResource(uri);
                }
            }
            if (res != old) {
                this._resDict[part] = res;
                this.invalidateResList();
            }
            return res;
        };
        /**
         * 资源列表发生改变
         */
        Unit.prototype.invalidateResList = function () {
            this._resListChange = true;
        };
        /**
         * 刷新资源列表
         */
        Unit.prototype.refreshResList = function () {
            if (this._resListChange) {
                this.checkResList(this._partList);
                this._resListChange = false;
            }
        };
        /**
         * 检查/重置资源列表
         *
         * @param {string[]} [resOrder] 部位的排列顺序
         * @param {{ [index: string]: UnitResource }} [resDict] 部位和资源的字典
         */
        Unit.prototype.checkResList = function (resOrder, resDict) {
            this._model.checkResList(resOrder || this._partList, resDict || this._resDict);
        };
        /**
         * 执行默认的，基于enterframe的渲染
         *
         * @protected
         */
        Unit.prototype.$render = function () {
            var now = jy.Global.now;
            this.refreshResList();
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.doData(this, now);
                currentAction.doRender(this, now);
            }
            this._render.render(now);
        };
        /**
         * 通过其他方式驱动数据
         *
         * @param {number} now 时间戳
         */
        Unit.prototype.doData = function (now) {
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.doData(this, now);
            }
            this._render.doData(now);
        };
        /**
         * 通过其他方式驱动渲染
         *
         * @param {number} now 时间戳
         */
        Unit.prototype.doRender = function (now) {
            this.refreshResList();
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.doRender(this, now);
            }
            this._render.doRender(now);
        };
        /**
         * 回收
         */
        Unit.prototype.onRecycle = function () {
            var _a = this, _model = _a._model, $render = _a.$render, onStage = _a.onStage, body = _a.body, _resDict = _a._resDict;
            jy.removeDisplay(body);
            _model.off("enterFrame" /* ENTER_FRAME */, $render, this);
            _model.off("addedToStage" /* ADDED_TO_STAGE */, onStage, this);
            _model.off("removedFromStage" /* REMOVED_FROM_STAGE */, onStage, this);
            _model.clear();
            this.rotation = 0;
            this.z = 0;
            // 回收ResourceBitmap
            for (var key in _resDict) {
                delete _resDict[key];
            }
            var current = this._currentAction;
            if (current) {
                current.recycle();
                this._currentAction = undefined;
            }
            var next = this._nextAction;
            if (next) {
                next.recycle();
                this._nextAction = undefined;
            }
            this._action = undefined;
            if (this._render) {
                this._render.reset(0);
            }
            this.lastFrame = undefined;
            this.dispatch(-1999 /* UnitRecycle */);
        };
        Unit.prototype.initDefaultAction = function () {
            this.aStandBy = new jy.UnitAction();
        };
        /**
         * 开始执行单位动作
         * @param {UnitAction} [action]     准备执行的动作，默认为待机动作
         * @param {number}     [now]        执行时间，默认取全局时间
         * @param {boolean}    [override]   是否强制覆盖当前动作，默认为否
         * @return true     成功执行动作
         *         false    未成功执行动作，将动作覆盖到下一个动作
         */
        Unit.prototype.startUnitAction = function (action, now, override) {
            if (this.state != 1 /* Stage */) {
                return;
            }
            this._startUA(action, now, override);
        };
        Unit.prototype._startUA = function (action, now, override) {
            var next = this._nextAction;
            if (next != action) {
                if (next) {
                    next.recycle();
                }
                this._nextAction = action;
                next = action;
            }
            if (!next) {
                next = this.aStandBy;
            }
            now = now || jy.Global.now;
            var currentAction = this._currentAction;
            /**
             * 是否成功执行新的动作
             */
            var flag = false;
            if (currentAction) {
                if (currentAction != next) {
                    if (currentAction.isEnd) { //已结束
                        currentAction.recycle();
                        flag = true;
                    }
                    else if (override || currentAction.canStop) { //可结束
                        currentAction.terminate();
                        currentAction.recycle();
                        flag = true;
                    }
                }
                else {
                    this._nextAction = undefined;
                }
            }
            else {
                flag = true;
            }
            if (flag) {
                currentAction = undefined;
                if (next) {
                    if (next.start(this, now)) { //无法执行
                        currentAction = next;
                    }
                    else {
                        next.recycle();
                    }
                    this._nextAction = undefined;
                }
            }
            if (!currentAction) {
                currentAction = this.aStandBy;
            }
            this._currentAction = currentAction;
            currentAction.playAction(this, this._mountType, now);
            return flag;
        };
        /**
         * 停止单位当前动作，做待机动作
         *
         * @param {number} [now]
         */
        Unit.prototype.stopUnitAction = function (now) {
            this._startUA(null, now, true);
        };
        Unit.prototype.setMountType = function (value) {
            if (value != this._mountType) {
                this._mountType = value;
                //由子类实现 先向服务器请求坐骑状态变更，处理其他
            }
        };
        /**
         * 动作的动画播放完毕
         */
        Unit.prototype.playComplete = function (now) {
            var currentAction = this._currentAction;
            var flag;
            if (currentAction) {
                currentAction.playComplete(this, now);
                if (currentAction.isEnd) {
                    flag = true;
                    this.onActionEnd();
                }
                else {
                    currentAction.playAction(this, this._mountType, now);
                }
            }
            else {
                flag = true;
            }
            if (flag) {
                this.startUnitAction(this._nextAction, now);
            }
        };
        /**
         * 动作进行渲染的时候
         */
        Unit.prototype.onRenderFrame = function (now) {
            var currentAction = this._currentAction;
            if (currentAction) {
                if (currentAction.isEnd) {
                    this.onActionEnd();
                }
                else {
                    return;
                }
            }
            this.startUnitAction(this._nextAction, now);
        };
        Unit.prototype.onActionEnd = function () { };
        /**
         * 执行动作中的回调事件
         */
        Unit.prototype.fire = function (eventType, now) {
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.dispatchEvent(this, eventType, now);
            }
        };
        //        /**
        //         * 绘制快照
        //         */ 
        //        public drawShortcut(){
        //            //TODO
        //            
        //        }
        /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑UnitAction相关↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
        /**
         * 加到游戏引擎中
         *
         * @param {boolean} [doRender=true] 是否添加Event.ENTER_FRAME事件
         */
        Unit.prototype.addedToEngine = function (doRender) {
            if (doRender === void 0) { doRender = true; }
            // 子类实现其他层的添加
            jy.GameEngine.instance.getLayer(1760 /* Sorted */).addChild(this.body);
            if (doRender) {
                this.play();
            }
            this.state = 1 /* Stage */;
            this.dispatch(-1997 /* UnitAddToStage */);
        };
        /**
         * 添加到容器中
         *
         * @param {Container} container
         * @param {boolean} [doRender=true]
         *
         * @memberOf Unit
         */
        Unit.prototype.addToContainer = function (container, doRender) {
            if (doRender === void 0) { doRender = true; }
            container.addChild(this.body);
            if (doRender) {
                this.play();
            }
            this.state = 1 /* Stage */;
            this.dispatch(-1997 /* UnitAddToStage */);
        };
        Unit.prototype.play = function () {
            var _a = this, _model = _a._model, onStage = _a.onStage, $render = _a.$render;
            _model.on("addedToStage" /* ADDED_TO_STAGE */, onStage, this);
            _model.on("removedFromStage" /* REMOVED_FROM_STAGE */, onStage, this);
            if (_model.stage) {
                _model.on("enterFrame" /* ENTER_FRAME */, $render, this);
            }
        };
        Unit.prototype.onStage = function (e) {
            var _a = this, _model = _a._model, $render = _a.$render;
            var eventType = "enterFrame" /* ENTER_FRAME */;
            if (e.type == "addedToStage" /* ADDED_TO_STAGE */) {
                _model.on(eventType, $render, this);
            }
            else {
                _model.off(eventType, $render, this);
            }
        };
        Object.defineProperty(Unit.prototype, "x", {
            get: function () {
                return this._x;
            },
            /**
             * 此方法只允许 UnitAction调用
             */
            set: function (value) {
                this.$setX(value);
            },
            enumerable: true,
            configurable: true
        });
        Unit.prototype.$setX = function (value) {
            value = value || 0;
            if (this._x != value) {
                this._x = value;
                this.checkPosition();
            }
        };
        Object.defineProperty(Unit.prototype, "y", {
            get: function () {
                return this._y;
            },
            /**
             * 此方法只允许 UnitAction调用
             */
            set: function (value) {
                this.$setY(value);
            },
            enumerable: true,
            configurable: true
        });
        Unit.prototype.$setY = function (value) {
            value = value || 0;
            if (this._y != value) {
                this._y = value;
                this.checkPosition();
                jy.GameEngine.invalidateSort();
            }
        };
        Object.defineProperty(Unit.prototype, "z", {
            get: function () {
                return this._z;
            },
            /**
             * 此方法只允许 UnitAction调用
             */
            set: function (value) {
                this.$setZ(value);
            },
            enumerable: true,
            configurable: true
        });
        Unit.prototype.$setZ = function (value) {
            value = value || 0;
            if (this._z != value) {
                this._z = value;
                this.checkPosition();
            }
        };
        /**
         * 检查模型和其他的y轴
         */
        Unit.prototype.checkPosition = function () {
            var body = this.body;
            if (body) {
                body.depth = this._depth + this._y || 0;
                body.y = (this._y + this._z) || 0; //防止赋值成undefined
                body.x = this._x || 0; //防止赋值成undefined
            }
        };
        Object.defineProperty(Unit.prototype, "rotation", {
            /**
             * 获得模型的旋转角度
             */
            get: function () {
                return this._rotation;
            },
            /**
             * 设置旋转角度
             * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
             * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
             * 例如，myDisplayObject.rotation = 450语句与 myDisplayObject.rotation = 90 是相同的
             */
            set: function (value) {
                if (this._rotation != value) {
                    this._rotation = value;
                    var model = this._model;
                    if (model.scaleX >= 0) {
                        model.rotation = value;
                    }
                    else {
                        model.rotation = -value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据 resKey 获取纹理
         * @param {Key} resKey resDict的key
         * @param {IDrawInfo} [drawInfo] 动作，方向，帧数信息
         */
        Unit.prototype.getTexture = function (resKey, drawInfo) {
            drawInfo = drawInfo || this._render;
            if (drawInfo) {
                var res = this._resDict[resKey];
                if (res) {
                    return res.getTexture(drawInfo);
                }
            }
        };
        return Unit;
    }(egret.EventDispatcher));
    jy.Unit = Unit;
    __reflect(Unit.prototype, "jy.Unit");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 单位管理器
     * @author 3tion
     *
     */
    var UnitController = /** @class */ (function () {
        function UnitController() {
            this._domains = {};
            this._domainCounts = {};
            this._domains[0 /* All */] = this._domainAll = {};
            this._domainCounts[0 /* All */] = 0;
        }
        UnitController.prototype.registerUnit = function () {
            var args = arguments;
            var unit = args[0];
            var guid = unit.guid;
            var _a = this, _domains = _a._domains, _domainCounts = _a._domainCounts, _domainAll = _a._domainAll;
            for (var i = 1; i < args.length; i++) {
                var domain = args[i];
                var dom = _domains[domain];
                var count = ~~_domainCounts[domain];
                if (!dom) {
                    dom = {};
                    _domains[domain] = dom;
                }
                if (!dom[guid]) { //之前没有单位
                    _domainCounts[domain] = count + 1;
                }
                dom[guid] = unit;
            }
            if (!_domainAll[guid]) {
                var count = ~~_domainCounts[0 /* All */];
                _domainCounts[0 /* All */] = count + 1;
            }
            _domainAll[guid] = unit;
        };
        /**
         * 移除单位
         * @param guid
         * @return
         *
         */
        UnitController.prototype.removeUnit = function (guid) {
            var unit = this._domainAll[guid];
            if (unit) {
                var _a = this, _domainCounts = _a._domainCounts, _domains = _a._domains;
                for (var key in _domains) {
                    var domain = _domains[key];
                    var tunit = domain[guid];
                    if (tunit) {
                        _domainCounts[key]--;
                        delete domain[guid];
                    }
                }
            }
            return unit;
        };
        /**
         *
         * 获取指定域的单位集合
         * @param {number} domain 指定域
         * @returns
         */
        UnitController.prototype.get = function (domain) {
            return this._domains[domain];
        };
        /**
         * 获取指定域的单位数量
         * @param domain
         * @return
         *
         */
        UnitController.prototype.getCount = function (domain) {
            return this._domainCounts[domain] || 0;
        };
        /**
         * 根据GUID获取JUnit
         * @param guid
         * @return
         *
         */
        UnitController.prototype.getUnit = function (guid) {
            return this._domainAll[guid];
        };
        UnitController.prototype.clear = function () {
            var exceptGuids = {};
            var args = arguments;
            for (var i_1 = 0; i_1 < args.length; i_1++) {
                var guid = args[i_1];
                if (guid) {
                    exceptGuids[guid] = true;
                }
            }
            var gcList = jy.Temp.SharedArray1;
            var i = 0;
            for (var guid in this._domainAll) {
                var aguid = guid;
                if (aguid == +aguid) {
                    aguid = +aguid;
                }
                if (!exceptGuids || !exceptGuids[guid]) {
                    gcList[i++] = guid;
                }
            }
            gcList.length = i;
            while (--i >= 0) {
                this.removeUnit(gcList[i]);
            }
            gcList.length = 0;
        };
        UnitController.prototype.clearDomain = function () {
            var _a = this, _domains = _a._domains, _domainCounts = _a._domainCounts;
            var gcList = jy.Temp.SharedArray1;
            var j = 0;
            var domains = arguments;
            for (var i = 0; i < domains.length; i++) {
                var domain = domains[i];
                var dom = _domains[domain];
                if (dom) {
                    for (var guid in dom) {
                        gcList[j++] = guid;
                    }
                }
            }
            gcList.length = j;
            while (--j >= 0) {
                this.removeUnit(gcList[j]);
            }
            gcList.length = 0;
        };
        return UnitController;
    }());
    jy.UnitController = UnitController;
    __reflect(UnitController.prototype, "jy.UnitController");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 模型(纸娃娃)渲染器
     */
    var UnitRender = /** @class */ (function (_super) {
        __extends(UnitRender, _super);
        function UnitRender(unit) {
            var _this = _super.call(this) || this;
            _this.faceTo = 0;
            _this.nextRenderTime = 0;
            _this.renderedTime = 0;
            _this.unit = unit;
            _this.reset(jy.Global.now);
            return _this;
        }
        UnitRender.prototype.reset = function (now) {
            this.renderedTime = now;
            this.nextRenderTime = now;
            this.idx = 0;
        };
        /**
         * 处理数据
         *
         * @param {number} now 时间戳
         */
        UnitRender.prototype.doData = function (now) {
            var actionInfo = this.actionInfo;
            if (actionInfo) {
                this.onData(actionInfo, now);
            }
        };
        UnitRender.prototype.render = function (now) {
            var actionInfo = this.actionInfo;
            if (actionInfo) {
                this.onData(actionInfo, now);
                this.doRender(now);
            }
        };
        UnitRender.prototype.onData = function (actionInfo, now) {
            _super.prototype.onData.call(this, actionInfo, now);
            this.unit.lastFrame = this.willRenderFrame;
        };
        UnitRender.prototype.clearRes = function () {
            //清空显示
            for (var _i = 0, _a = this.model.$children; _i < _a.length; _i++) {
                var res = _a[_i];
                res.texture = undefined;
            }
        };
        UnitRender.prototype.renderFrame = function (frame, now) {
            var flag = this.model.renderFrame(frame, now, this.faceTo, this);
            this.unit.onRenderFrame(now);
            if (flag) {
                this.willRenderFrame = undefined;
            }
        };
        UnitRender.prototype.dispatchEvent = function (event, now) {
            this.unit.fire(event, now);
        };
        UnitRender.prototype.doComplete = function (now) {
            this.unit.playComplete(now);
        };
        UnitRender.prototype.dispose = function () {
            this.unit = undefined;
        };
        return UnitRender;
    }(jy.BaseRender));
    jy.UnitRender = UnitRender;
    __reflect(UnitRender.prototype, "jy.UnitRender");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var UnitSetting = /** @class */ (function () {
        function UnitSetting() {
            /**
             * 是否添加UI层
             */
            this.hasUILayer = true;
            /**
             * 是否添加Buff容器
             */
            this.hasBuffLayer = true;
            /**
             * 是否添加光环容器
             */
            this.hasHaloLayer = true;
            /**
             * 是否添加到游戏场景中
             */
            this.addToEngine = true;
            /**
             * 深度的参数A
             */
            this.depthA = 0;
            /**
             * 深度的参数B
             */
            this.depthB = 0.19;
        }
        //防止同一坐标的单位排序深度相同，出现闪烁的情况
        UnitSetting.prototype.getDepth = function () {
            return this.depthA + Math.random() * this.depthB;
        };
        return UnitSetting;
    }());
    jy.UnitSetting = UnitSetting;
    __reflect(UnitSetting.prototype, "jy.UnitSetting");
    /**
     * 默认的单位设置
     */
    jy.defaultUnitSetting = new UnitSetting();
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 序列的记录器
     * 用于做残影或者时光倒流的操作
     * @export
     * @class PSRecorder
     * @author 3tion
     */
    var PSRecorder = /** @class */ (function () {
        function PSRecorder() {
        }
        /**
         * 初始化一个序列
         *
         * @param {number} [delay=30]
         * @param {number} [max=4]
         * @returns
         */
        PSRecorder.prototype.init = function (max) {
            if (max === void 0) { max = 4; }
            if (max < 1) { //至少的有一个
                max = 1;
            }
            this._max = max;
            this._count = 0;
            this._head = undefined;
            this._tail = undefined;
            return this;
        };
        PSRecorder.prototype.record = function (unit, now) {
            if (unit) {
                //处理头
                var series = void 0;
                if (this._count < this._max) {
                    series = jy.recyclable(jy.PSeries);
                    this._head = series;
                }
                else {
                    series = this._head;
                    this._head = series.next;
                    //清除头的前一个
                    this._head.prev = undefined;
                    series.next = undefined;
                }
                //对当前赋值
                series.record(unit, now);
                var resDict = {};
                series.resDict = resDict;
                unit.resDict.copyto(resDict);
                //处理尾
                var tail = this._tail;
                if (tail) {
                    tail.next = series;
                    series.prev = tail;
                }
                this._tail = series;
                return series;
            }
        };
        /**
         * 根据索引获取序列
         *
         * @param {number} idx          索引号
         * @param {boolean} [reverse]   是否按时间顺序反取，默认为从前往后，即按时间的先后顺序取
         * @returns
         */
        PSRecorder.prototype.getByIndex = function (idx, reverse) {
            var i = 0, tmp;
            if (reverse) {
                tmp = this._tail;
                while (tmp && i++ < idx) { //防止链表出错
                    tmp = tmp.prev;
                }
            }
            else {
                tmp = this._head;
                while (tmp && i++ < idx) {
                    tmp = tmp.next;
                }
            }
            if (i == idx)
                return tmp;
        };
        /**
         *
         * 获取序列
         * @param {PSeries[]} [output]  要输出的序列位置
         * @param {boolean} [reverse]   是否按时间顺序反取，默认为从前往后，即按时间的先后顺序取
         */
        PSRecorder.prototype.getSeries = function (output, reverse) {
            output = output || [];
            var i = 0, tmp;
            var max = this._max;
            if (reverse) { //逆向播放
                tmp = this._tail;
                while (tmp && i++ < max) { //防止链表出错
                    output.push(tmp);
                    tmp = tmp.prev;
                }
            }
            else {
                tmp = this._head;
                while (tmp && i++ < max) {
                    output.push(tmp);
                    tmp = tmp.next;
                }
            }
        };
        PSRecorder.prototype.onRecycle = function () {
            var tmp = this._head;
            var max = this._max;
            var i = 0;
            while (tmp && i++ < max) {
                tmp.recycle();
            }
            this._head = undefined;
            this._tail = undefined;
        };
        return PSRecorder;
    }());
    jy.PSRecorder = PSRecorder;
    __reflect(PSRecorder.prototype, "jy.PSRecorder");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 用于记录单位(Unit)的序列
     *
     * @export
     * @interface PhantomTarget
     * @author 3tion
     */
    var PSeries = /** @class */ (function () {
        function PSeries() {
        }
        PSeries.prototype.record = function (unit, now) {
            this.t = now;
            this.x = unit.x;
            this.y = unit.y;
            this.z = unit.z;
            this.faceTo = unit.faceTo;
            this.frame = unit.lastFrame;
        };
        return PSeries;
    }());
    jy.PSeries = PSeries;
    __reflect(PSeries.prototype, "jy.PSeries");
})(jy || (jy = {}));
/**
 * @author 3tion
 */
var jy;
(function (jy) {
    var faceUtilCache = {};
    /**
     * 获取`朝向工具` 此方法只做偶数方向，即每个角度相同的
     * 方向0为面朝正下方
     * @param total 朝向总数
     */
    function getFaceUtil(total) {
        if (total < 2 || total & 1) {
            true && jy.ThrowError("\u6B64\u5DE5\u5177\u4E0D\u652F\u6301\u975E\u6B63\u5076\u6570\u65B9\u5411");
            return;
        }
        var util = faceUtilCache[total];
        if (!util) {
            var hTotal_2 = total >> 1;
            var hTotal_1 = hTotal_2 + 1;
            var list_2 = [];
            for (var i = hTotal_2 - 1; i >= 0; i--) {
                list_2.push(Math.tan(Math.PI / total * hTotal_1 + Math.PI / hTotal_2 * i));
            }
            //生成对立点
            var opps_1 = new Array(total);
            for (var i = 0; i < hTotal_2; i++) {
                opps_1[i] = hTotal_2 + i;
                opps_1[hTotal_2 + i] = i;
            }
            //生成角度，弧度
            var degs_1 = new Array(total);
            var rads_1 = new Array(total);
            var sinRads_1 = new Array(total);
            var cosRads_1 = new Array(total);
            var startDeg = 180; //方向0，↓，为180°
            var deltaDeg = 360 / total;
            var startRad = Math.PI;
            var deltaRad = Math.PI2 / total;
            var sin = Math.sin, cos = Math.cos;
            for (var i = 0; i < total; i++) {
                degs_1[i] = startDeg - i * deltaDeg;
                var rad = startRad - i * deltaRad;
                rads_1[i] = rad;
                sinRads_1[i] = sin(rad);
                cosRads_1[i] = cos(rad);
            }
            util = {
                face0Deg: startDeg,
                face0Rad: startRad,
                total: total,
                getFace: function (fx, fy, tx, ty) {
                    var d = (ty - fy) / (tx - fx);
                    var face = hTotal_2;
                    if (fx <= tx) {
                        for (var i = 0; i < hTotal_2; i++) {
                            if (d > list_2[i]) {
                                face = i;
                                break;
                            }
                        }
                    }
                    else {
                        for (var i = hTotal_2; i >= 1; i--) {
                            if (d <= list_2[i]) {
                                face = hTotal_2 + i + 1;
                                break;
                            }
                        }
                        if (face == total) {
                            face = 0;
                        }
                    }
                    return face;
                },
                getOpps: function (faceTo) {
                    return opps_1[faceTo];
                },
                getDeg: function (faceTo) {
                    return degs_1[faceTo];
                },
                getRad: function (faceTo) {
                    return rads_1[faceTo];
                },
                getRadSin: function (faceTo) {
                    return sinRads_1[faceTo];
                },
                getRadCos: function (faceTo) {
                    return cosRads_1[faceTo];
                }
            };
        }
        return util;
    }
    jy.getFaceUtil = getFaceUtil;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 异步工具类，用于加方法兼听
     * @author 3tion
     *
     */
    var AsyncHelper = /** @class */ (function () {
        function AsyncHelper() {
            /**
             * 是否已经处理完成
             */
            this.isReady = false;
        }
        /**
         * 异步数据已经加载完毕
         */
        AsyncHelper.prototype.readyNow = function () {
            if (!this.isReady) {
                this.isReady = true;
                var _readyExecutes = this._cbs;
                if (_readyExecutes) {
                    var temp = _readyExecutes.concat();
                    _readyExecutes.length = 0;
                    for (var i = 0; i < temp.length; i++) {
                        var callback = temp[i];
                        callback.execute();
                    }
                }
            }
        };
        /**
         * 检查是否完成,并让它回调方法
         *
         * @param {Function} handle 处理函数
         * @param {*} thisObj this对象
         * @param {any[]} args 函数的参数
         */
        AsyncHelper.prototype.addReadyExecute = function (handle, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (this.isReady) {
                return handle.apply(thisObj, args);
            }
            var _readyExecutes = this._cbs;
            if (!_readyExecutes) {
                this._cbs = _readyExecutes = [];
            }
            jy.CallbackInfo.addToList.apply(jy.CallbackInfo, [_readyExecutes, handle, thisObj].concat(args));
        };
        return AsyncHelper;
    }());
    jy.AsyncHelper = AsyncHelper;
    __reflect(AsyncHelper.prototype, "jy.AsyncHelper");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 依赖项的辅助类
     * @author 3tion
     *
     */
    var DependerHelper = /** @class */ (function () {
        /**
         *
         * @param host          调用项
         * @param callback      回调函数         回调函数的thisObj会使用host来处理
         * @param thisObj       回调函数的this
         * @param args
         */
        function DependerHelper(host, callback) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._host = host;
            this._callback = callback;
            this._args = args;
            this._unreadyDepender = [];
        }
        /**
         * 添加依赖
         * @param async
         */
        DependerHelper.prototype.addDepend = function (async) {
            if (async.isReady) {
                this.readyHandler(async);
            }
            else {
                this._unreadyDepender.push(async);
                async.addReadyExecute(this.readyHandler, this, async);
            }
        };
        /**
         * 一个依赖项处理完成
         */
        DependerHelper.prototype.readyHandler = function (async) {
            this._unreadyDepender.remove(async);
            this.check();
        };
        /**
         * 检查依赖项是否已经完成，会在下一帧做检查
         */
        DependerHelper.prototype.check = function () {
            if (!this._uncheck) {
                this._uncheck = true;
                egret.callLater(this._check, this);
            }
        };
        /**
         * 检查依赖项是否已经完成
         */
        DependerHelper.prototype._check = function () {
            this._uncheck = false;
            var allReady = true;
            for (var _i = 0, _a = this._unreadyDepender; _i < _a.length; _i++) {
                var async = _a[_i];
                if (!async.isReady) {
                    async.startSync();
                    allReady = false;
                }
            }
            if (allReady && this._callback) {
                this._unreadyDepender.length = 0;
                this._callback.apply(this._host, this._args);
            }
        };
        return DependerHelper;
    }());
    jy.DependerHelper = DependerHelper;
    __reflect(DependerHelper.prototype, "jy.DependerHelper");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var inter1 = "addReadyExecute";
    var inter2 = "startSync";
    function isIAsync(instance) {
        if (!instance) {
            return false;
        }
        /*不验证数据，因为现在做的是get asyncHelper(),不默认创建AsyncHelper，调用的时候才创建，这样会导致多一次调用*/
        if (!(inter1 in instance || typeof instance[inter1] !== "function") /*|| !(instance[inter1] instanceof AsyncHelper)*/) {
            return false;
        }
        if (!(inter2 in instance) || typeof instance[inter2] !== "function" || instance[inter2].length != 0) {
            return false;
        }
        return true;
    }
    jy.isIAsync = isIAsync;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 代码构建类，用于注册代码
     * @author 3tion
     */
    var Facade = /** @class */ (function (_super) {
        __extends(Facade, _super);
        function Facade() {
            var _this = _super.call(this) || this;
            _this._mediators = {};
            _this._scripts = {};
            _this._proxys = {};
            _this._indecting = [];
            return _this;
        }
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
        Facade.getNameOfInline = function (inlineRef, className) {
            className = className || egret.getQualifiedClassName(inlineRef);
            var name;
            if ("NAME" in inlineRef) { //如果有 public static NAME 取这个作为名字
                name = inlineRef["NAME"];
            }
            else {
                name = className.substr(className.lastIndexOf(".") + 1);
            }
            return name;
        };
        /**
         * 绑定模块管理器
         */
        Facade.prototype.bindModuleManager = function (mm) {
            mm.init();
            this._mm = mm;
        };
        Object.defineProperty(Facade.prototype, "mm", {
            /**
             * 模块管理器
             *
             * @readonly
             *
             * @memberOf Facade
             */
            get: function () {
                return this._mm;
            },
            enumerable: true,
            configurable: true
        });
        Facade.prototype._removeHost = function (name, dict) {
            var dele = dict[name];
            var host;
            if (dele) {
                delete dict[name];
                host = dele.host;
                if (host) {
                    host.onRemove();
                }
            }
            return host;
        };
        /**
         * 移除面板控制器
         */
        Facade.prototype.removeMediator = function (mediatorName) {
            return this._removeHost(mediatorName, this._mediators);
        };
        /**
         * 移除模块
         * 如果模块被其他模块依赖，此方法并不能清楚依赖引用
         */
        Facade.prototype.removeProxy = function (proxyName) {
            var proxy = this._proxys[proxyName];
            if (proxy.host._$isDep) {
                true && jy.ThrowError("\u6A21\u5757[" + proxyName + "]\u88AB\u4F9D\u8D56\uFF0C\u4E0D\u5141\u8BB8\u79FB\u9664", null, true);
                return;
            }
            return this._removeHost(proxyName, this._proxys);
        };
        /**
         *
         * 注册内部模块
         * @param {{ new (): Proxy }} ref Proxy创建器
         * @param {string} [proxyName] 模块名称
         * @param {boolean} [async=false] 是否异步初始化，默认直接初始化
         */
        Facade.prototype.registerInlineProxy = function (ref, proxyName, async) {
            if (!ref) {
                if (true) {
                    jy.ThrowError("registerInlineProxy时,没有ref");
                }
                return;
            }
            var dict = this._proxys;
            this.regConfig(ref, proxyName, dict);
            if (!async) { //如果直接初始化
                var dele = dict[proxyName];
                var host = new ref();
                dele.host = host;
                jy.facade.inject(host);
                host.onRegister();
            }
        };
        /**
         *
         * 注册内部Mediator模块
         * @param {{ new (): Mediator }} ref Mediator创建器
         * @param {string} [mediatorName]   注册的模块名字
         */
        Facade.prototype.registerInlineMediator = function (ref, mediatorName) {
            if (!ref) {
                if (true) {
                    jy.ThrowError("registerInlineMediator\u65F6,\u6CA1\u6709ref");
                }
                return;
            }
            this.regConfig(ref, mediatorName, this._mediators);
        };
        Facade.prototype.regConfig = function (clazz, key, dict, url, scriptid) {
            var dele;
            if (true) {
                dele = dict[key];
                if (dele) {
                    jy.ThrowError("模块定义重复:" + name);
                }
            }
            dele = {};
            dele.scriptid = scriptid;
            if (typeof clazz === "string") {
                dele.className = clazz;
            }
            else {
                dele.ref = clazz;
            }
            dele.name = key;
            dele.url = url;
            dict[key] = dele;
        };
        Facade.prototype.getOrCreateScript = function (dele) {
            var scriptid = dele.scriptid;
            var script = this._scripts[scriptid];
            if (!script) {
                script = new jy.ModuleScript;
                script.id = scriptid;
                script.url = dele.url;
                this._scripts[scriptid] = script;
            }
            return script;
        };
        /**
         * 获取Proxy
         *
         * @param {Key} proxyName proxy的名字
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        Facade.prototype.getProxy = function (proxyName, callback, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var dele = this._proxys[proxyName];
            if (!dele) {
                if (true) {
                    jy.ThrowError("没有注册proxy的关系");
                }
                return;
            }
            var bin = {};
            bin.dele = dele;
            bin.callback = callback;
            bin.thisObj = thisObj;
            bin.args = args;
            return this._solveScriptCallback(bin);
        };
        /**
         * 以同步方式获取proxy，不会验证proxy是否加载完毕
         * 有可能无法取到proxy
         *
         * @param {Key} proxyName
         * @returns
         *
         * @memberOf Facade
         */
        Facade.prototype.getProxySync = function (proxyName) {
            var dele = this._proxys[proxyName];
            if (dele) {
                return dele.host;
            }
        };
        /**
         * 获取Mediator
         *
         * @param {Key} moduleID 模块ID
         * @param {{ (proxy: Proxy, args?: any[]) }} callback 回调函数
         * @param {*} thisObj 回调函数的this对象
         * @param args 回调函数的参数列表
         */
        Facade.prototype.getMediator = function (moduleID, callback, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var dele = this._mediators[moduleID];
            if (!dele) {
                if (true) {
                    jy.ThrowError("没有注册Mediator的关系");
                }
                return;
            }
            var bin = {};
            bin.dele = dele;
            bin.callback = callback;
            bin.thisObj = thisObj;
            bin.args = args;
            return this._solveScriptCallback(bin);
        };
        /**
         * 以同步方式获取Mediator，不会验证Mediator是否加载完毕
         * 有可能无法取到Mediator
         *
         * @param {Key} moduleID
         * @returns
         *
         * @memberOf Facade
         */
        Facade.prototype.getMediatorSync = function (moduleID) {
            var dele = this._mediators[moduleID];
            if (dele) {
                return dele.host;
            }
        };
        Facade.prototype._solveScriptCallback = function (bin) {
            var dele = bin.dele;
            if (dele.scriptid) {
                var script = this.getOrCreateScript(dele);
                if (script.state != 2 /* COMPLETE */) {
                    script.callbacks.push(jy.CallbackInfo.get(this._getHost, this, bin));
                    script.load();
                    return;
                }
            }
            //直接回调
            return this._getHost(bin);
        };
        Facade.prototype._getHost = function (bin) {
            var dele = bin.dele;
            var host = dele.host;
            if (!host) {
                var ref = dele.ref;
                if (!ref) {
                    dele.ref = ref = egret.getDefinitionByName(dele.className);
                }
                dele.host = host = new ref();
                jy.facade.inject(host);
                host.onRegister();
            }
            var callback = bin.callback;
            if (host.isReady) {
                callback && callback.call.apply(callback, [bin.thisObj, host].concat(bin.args));
            }
            else {
                callback && host.addReadyExecute.apply(host, [callback, bin.thisObj, host].concat(bin.args));
                host.startSync();
            }
            return host;
        };
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
        Facade.prototype.toggle = function (moduleID, toggleState, showTip, param) {
            if (showTip === void 0) { showTip = true; }
            if (this._mm) {
                this._mm.toggle(moduleID, toggleState, showTip, param);
            }
        };
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
        Facade.prototype.executeMediator = function (moduleID, showTip, handlerName, show) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            if (this._mm && this._mm.isModuleOpened(moduleID, showTip)) {
                var hander = show ? this._executeAndShowMediator : this._executeMediator;
                return this.getMediator.apply(this, [moduleID, hander, this, handlerName].concat(args));
            }
        };
        /**
         * 不做验证，直接执行mediator的方法
         * 此方法只允许ModuleHandler使用
         * @private
         * @param name          模块id
         * @param showTip       如果无法执行，是否弹出提示
         * @param handlerName   执行的函数名
         * @param args
         */
        Facade.prototype.$executeMediator = function (moduleID, handlerName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return this.getMediator(moduleID, this._executeMediator, this, args);
        };
        Facade.prototype._executeMediator = function (mediator, handlerName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (typeof mediator[handlerName] === "function") {
                mediator[handlerName].apply(mediator, args);
            }
            else if (true) {
                jy.ThrowError("无法在Mediator：" + mediator.name + "中找到方法[" + handlerName + "]");
            }
        };
        Facade.prototype._executeAndShowMediator = function (mediator, handlerName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.toggle(mediator.name, 1 /* SHOW */, false); //showTip为 false是不用再次提示，executeMediator已经执行过模块是否开启的检查
            this._executeMediator.apply(//showTip为 false是不用再次提示，executeMediator已经执行过模块是否开启的检查
            this, [mediator, handlerName].concat(args));
        };
        /**
         * 执行Proxy的方法
         * @param name     proxy名字
         * @param handlerName   函数名字
         * @param args          参数列表
         */
        Facade.prototype.executeProxy = function (proxyName, handlerName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return this.getProxy.apply(this, [proxyName, this._executeProxy, this, handlerName].concat(args));
        };
        Facade.prototype._executeProxy = function (proxy, handlerName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (typeof proxy[handlerName] === "function") {
                proxy[handlerName].apply(proxy, args);
            }
            else if (true) {
                jy.ThrowError("无法在Proxy：" + proxy.name + "中找到方法[" + handlerName + "]");
            }
        };
        /**
         * 注入数据
         */
        Facade.prototype.inject = function (obj) {
            //锁定对象，防止循环注入
            var _indecting = this._indecting;
            if (!~_indecting.indexOf(obj)) {
                _indecting.push(obj);
                this.doInject(obj);
                var idx = _indecting.indexOf(obj);
                _indecting.splice(idx, 1);
            }
        };
        /**
         * 用于子项目扩展
         * @param obj
         */
        Facade.prototype.doInject = function (obj) {
            //to be override
        };
        /**
         * 模块脚本的加载路径
         */
        Facade.Script = "modules/{0}.js";
        return Facade;
    }(egret.EventDispatcher));
    jy.Facade = Facade;
    __reflect(Facade.prototype, "jy.Facade");
    jy.facade = new Facade();
    function proxyCall() {
        return jy.facade.getProxy.apply(jy.facade, arguments);
    }
    jy.proxyCall = proxyCall;
    function proxyExec() {
        return jy.facade.executeProxy.apply(jy.facade, arguments);
    }
    jy.proxyExec = proxyExec;
    function mediatorCall() {
        return jy.facade.getMediator.apply(jy.facade, arguments);
    }
    jy.mediatorCall = mediatorCall;
    function mediatorExec() {
        return jy.facade.executeMediator.apply(jy.facade, arguments);
    }
    jy.mediatorExec = mediatorExec;
    /**
     * 全局抛事件
     *
     * @export
     * @param {Key} type     事件类型
     * @param {*} [data]        数据
     */
    function dispatch(type, data) {
        jy.facade.dispatch(type, data);
    }
    jy.dispatch = dispatch;
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
    function toggle(moduleID, toggleState, showTip, param) {
        if (showTip === void 0) { showTip = true; }
        jy.facade.toggle(moduleID, toggleState, showTip, param);
    }
    jy.toggle = toggle;
    /**
     *
     * 添加事件监听
     * @export
     * @param {(Key)} type
     * @param {Function} listener
     * @param {*} thisObj
     * @param {number} [priority]
     */
    function on(type, listener, thisObj, priority) {
        jy.facade.on(type, listener, thisObj, false, priority);
    }
    jy.on = on;
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
    function once(type, listener, thisObj, priority) {
        jy.facade.once(type, listener, thisObj, false, priority);
    }
    jy.once = once;
    /**
     *
     * 移除事件监听
     * @static
     * @param {Key} type
     * @param {Function} listener
     * @param {*} [thisObject]
     */
    function off(type, listener, thisObject) {
        jy.facade.off(type, listener, thisObject, false);
    }
    jy.off = off;
    /**
     * 检查是否有全局监听
     *
     * @export
     * @param {Key} type
     * @returns
     */
    function hasListen(type) {
        return jy.facade.hasListen(type);
    }
    jy.hasListen = hasListen;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 视图控制器，持有视图<br/>
     * 持有Proxy，主要监听视图和Proxy的事件，变更面板状态<br/>
     * @author 3tion
     *
     */
    var Mediator = /** @class */ (function (_super) {
        __extends(Mediator, _super);
        /**
         * Creates an instance of Mediator.
         *
         * @param {string | number} moduleID 模块ID
         */
        function Mediator(moduleID) {
            var _this = _super.call(this, moduleID) || this;
            _this.init && _this.init();
            return _this;
        }
        Object.defineProperty(Mediator.prototype, "view", {
            /**
             *  获取视图
             */
            get: function () {
                return this.$view;
            },
            set: function (value) {
                var old = this.$view;
                if (old != value) {
                    this.removeSkinListener(old);
                    this.$view = value;
                    this.addSkinListener(value);
                    value.moduleID = this._name;
                    if (jy.isIAsync(value)) {
                        value.addReadyExecute(this.viewComplete, this);
                    }
                    else {
                        this.viewComplete();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 开始尝试同步
         */
        Mediator.prototype.startSync = function () {
            if (jy.isIAsync(this.$view)) {
                var async = this.$view;
                if (async.isReady) {
                    this.viewComplete();
                }
                else {
                    async.addReadyExecute(this.viewComplete, this);
                    async.startSync();
                }
            }
        };
        /**
         *
         * 视图加载完毕
         * @protected
         */
        Mediator.prototype.viewComplete = function () {
            var viewReady = true;
            var $view = this.$view;
            if (jy.isIAsync($view)) {
                viewReady = $view.isReady;
            }
            this.viewReady = viewReady;
            if (!this.viewCheck(viewReady)) {
                return;
            }
            if (this._dependerHelper) { //不创建
                this._dependerHelper.check();
            }
            else {
                this.dependerReadyCheck();
            }
        };
        Mediator.prototype.viewCheck = function (viewReady) {
            return viewReady;
        };
        /**
         *
         * 依赖项完毕后检查
         * @protected
         * @returns
         */
        Mediator.prototype.dependerReadyCheck = function () {
            if (!this.viewReady) {
                return;
            }
            if (!this._ready) {
                this._ready = true;
                this.afterAllReady();
                if (this.$view.stage) {
                    this.stageChange(true);
                }
                if (this._asyncHelper) {
                    this._asyncHelper.readyNow();
                }
            }
        };
        Mediator.prototype.hide = function () {
            jy.toggle(this._name, -1 /* HIDE */);
        };
        return Mediator;
    }(jy.ViewController));
    jy.Mediator = Mediator;
    __reflect(Mediator.prototype, "jy.Mediator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 模块脚本，后续开发模块，分成多个模块文件
     * @author 3tion
     *
     */
    var ModuleScript = /** @class */ (function () {
        function ModuleScript() {
            /**
             * 加载状态
             */
            this.state = 0 /* UNREQUEST */;
            /**
             * 回调列表
             */
            this.callbacks = [];
        }
        /**
         * 已异步方式加载
         */
        ModuleScript.prototype.load = function () {
            if (this.state == 0 /* UNREQUEST */) {
                var url = this.url || jy.Facade.Script.substitute(this.id);
                loadScript(url, this.onScriptLoaded, this);
                this.state = 1 /* REQUESTING */;
            }
        };
        /**
         * 配置加载完成之后
         */
        ModuleScript.prototype.onScriptLoaded = function (isError) {
            this.state = isError ? -1 /* FAILED */ : 2 /* COMPLETE */;
            var callbacks = this.callbacks.concat();
            this.callbacks.length = 0;
            for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                var callback = callbacks_1[_i];
                callback.execute();
            }
        };
        return ModuleScript;
    }());
    jy.ModuleScript = ModuleScript;
    __reflect(ModuleScript.prototype, "jy.ModuleScript");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 用于和服务端通信的数据
     * @author 3tion
     */
    var Service = /** @class */ (function (_super) {
        __extends(Service, _super);
        function Service(name) {
            return _super.call(this, name) || this;
        }
        Service.prototype.onRegister = function () {
            this._ns = jy.NetService.get();
        };
        Service.prototype._startSync = function () {
            // Service默认为同步，如果需要收到服务端数据的，重写此方法
            this.selfReady();
        };
        Service.prototype.reg = function () {
            var ns = this._ns;
            var args = arguments;
            for (var i = 0; i < args.length; i += 3) {
                var cmd = args[i];
                var ref = args[i + 1];
                var handler = args[i + 2];
                handler = handler.bind(this);
                if (Array.isArray(cmd)) {
                    for (var i_2 = 0; i_2 < cmd.length; i_2++) {
                        doReg(cmd[i_2], handler, ref);
                    }
                }
                else {
                    doReg(cmd, handler, ref);
                }
            }
            function doReg(cmd, handler, ref) {
                ns.register(cmd, handler);
                ns.regReceiveMSGRef(cmd, ref);
            }
        };
        /**
         * 注册消息引用
         *
         * @protected
         * @param {string | number} ref 消息实例的引用
         * @param cmds 注册的指令
         */
        Service.prototype.regMsg = function (ref) {
            var cmds = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                cmds[_i - 1] = arguments[_i];
            }
            var ns = this._ns;
            for (var _a = 0, cmds_1 = cmds; _a < cmds_1.length; _a++) {
                var cmd = cmds_1[_a];
                ns.regReceiveMSGRef(cmd, ref);
            }
        };
        /**
         * 注册消息处理函数
         *
         * @protected
         * @param {{ (data: NetData): void }} handler   消息处理函数
         * @param {number[]} cmds 注册的指令
         */
        Service.prototype.regHandler = function (handler) {
            var cmds = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                cmds[_i - 1] = arguments[_i];
            }
            var ns = this._ns;
            for (var _a = 0, cmds_2 = cmds; _a < cmds_2.length; _a++) {
                var cmd = cmds_2[_a];
                ns.register(cmd, handler);
            }
        };
        Service.prototype.removeHandler = function (cmd, handler) {
            this._ns.remove(cmd, handler);
        };
        /**
         * 发送消息
         *
         * @protected
         * @param {number} cmd 指令
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         * @param {number} [limit=200] 最短发送时间
         */
        Service.prototype.send = function (cmd, data, msgType, limit) {
            if (limit === void 0) { limit = 200; }
            this._ns.send(cmd, data, msgType, limit);
        };
        return Service;
    }(jy.Proxy));
    jy.Service = Service;
    __reflect(Service.prototype, "jy.Service");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 将Mediator转换为IStateSwitcher
     *
     * @export
     * @param {Mediator} mediator
     * @returns {(Mediator & IStateSwitcher & AwakeCheck)}
     */
    function transformToStateMediator(mediator, awakeBy, sleepBy) {
        var stateMed = mediator;
        if (stateMed.awakeBy === undefined) {
            stateMed.awakeBy = awakeBy || function (id) {
                if (typeof stateMed.awakeCheck === "function") {
                    if (!stateMed.awakeCheck()) {
                        return;
                    }
                }
                var view = this._view;
                if (view instanceof jy.Panel) {
                    view.show();
                }
            };
        }
        if (stateMed.sleepBy === undefined) {
            stateMed.sleepBy = sleepBy || function (id) {
                var view = this._view;
                if (view instanceof jy.Panel) {
                    view.hide();
                }
            };
        }
        return stateMed;
    }
    jy.transformToStateMediator = transformToStateMediator;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 功能配置的基类
     * @author 3tion
     */
    var BaseMCfg = /** @class */ (function () {
        function BaseMCfg() {
            /**
             * 当前显示状态
             */
            this.showState = 0 /* HIDE */;
            /**
             * 服务器认为此功能开放
             */
            this.serverOpen = true;
        }
        BaseMCfg.prototype.init = function (from) {
            from = from || this;
            //解析显示限制
            jy.DataUtils.parseDatas(this, from, 0, 3, "showlimit", "showlimits");
            //解析功能使用限制
            jy.DataUtils.parseDatas(this, from, 0, 3, "limit", "limits");
        };
        return BaseMCfg;
    }());
    jy.BaseMCfg = BaseMCfg;
    __reflect(BaseMCfg.prototype, "jy.BaseMCfg");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 模块管理器
     * 用于管理模块的开启/关闭
     * @author 3tion
     *
     */
    var ModuleManager = /** @class */ (function () {
        function ModuleManager() {
            /**
             * 需要检查
             */
            this._needCheck = false;
            /**
             * 需要检查显示/开启
             */
            this._needCheckShow = false;
        }
        ModuleManager.prototype.init = function () {
            this._bindedIOById = [];
            this._hByType = [];
            this._checkers = [];
            this._allById = {};
            this._unshowns = [];
            this._unopens = [];
            this._hById = {};
            this._ioBind = new Map();
            jy.on(-993 /* MODULE_NEED_CHECK_SHOW */, this.check, this);
        };
        /**
         * 设置模块配置数据
         * @param { [index: string]: ModuleCfg }    cfgs
         */
        ModuleManager.prototype.setCfgs = function (cfgs) {
            this._allById = cfgs;
            this.doCheckLimits();
        };
        /**
         * 根据配置类型，注册模块处理器
         * @param type
         * @param handler
         *
         */
        ModuleManager.prototype.registerHandler = function (type, handler) {
            this._hByType[type] = handler;
        };
        /**
         * 根据模块ID注册处理函数
         * @param id
         * @param handler
         *
         */
        ModuleManager.prototype.registerHandlerById = function (id, handler) {
            var cfg = this._allById[id];
            if (cfg) {
                this._hById[id] = handler;
            }
            else {
                jy.ThrowError("ModuleManager 注册模块处理函数时，没有找到对应的模块配置，模块id:" + id);
            }
        };
        Object.defineProperty(ModuleManager.prototype, "checkers", {
            /**
             * 设置限制检查器
             * @param value	一个字典<br/>
             * Key  	{number}            限制器(showtype,limittype)类型<br/>
             * Value	{IModuleChecker}	    模块限制检查器
             *
             */
            set: function (value) {
                this._checkers = value;
                this.doCheckLimits();
            },
            enumerable: true,
            configurable: true
        });
        ModuleManager.prototype.doCheckLimits = function () {
            this._needCheck = true;
            egret.callLater(this.checkLimits, this);
        };
        /**
         * 检查限制
         */
        ModuleManager.prototype.checkLimits = function () {
            if (this._needCheck) {
                this._needCheck = false;
                var _a = this, _checkers = _a._checkers, _allById = _a._allById, _unopens = _a._unopens, _unshowns = _a._unshowns, _bindedIOById = _a._bindedIOById;
                _unopens.length = 0;
                _unshowns.length = 0;
                if (_checkers) {
                    if (true) {
                        var errString = "";
                        var limitWarn = "";
                        var unsolve = "";
                    }
                    var checker = void 0;
                    for (var id in _allById) {
                        var cfg = _allById[id];
                        var showtype = cfg.showtype;
                        checker = _checkers[showtype];
                        if (true) {
                            if (!checker) {
                                unsolve += cfg.id + "的显示限制 ";
                            }
                        }
                        var limittype = cfg.limittype;
                        checker = _checkers[limittype];
                        if (true) {
                            if (!checker) {
                                unsolve += cfg.id + "的使用限制 ";
                            }
                        }
                        if (showtype == limittype) {
                            if (checker) {
                                if (false) {
                                    checker.adjustLimitDatas(cfg.showlimits, cfg.limits);
                                }
                                if (true) {
                                    if (checker.adjustLimitDatas(cfg.showlimits, cfg.limits)) {
                                        errString += cfg.id + " ";
                                    }
                                }
                            }
                        }
                        else {
                            if (true) {
                                limitWarn += cfg.id + " ";
                            }
                        }
                        if (!this.isModuleShow(cfg)) {
                            var id_1 = cfg.id;
                            _unshowns.push(id_1);
                            var displays = _bindedIOById[id_1];
                            if (displays) {
                                for (var i = 0; i < displays.length; i++) {
                                    displays[i].visible = false;
                                }
                            }
                        }
                        if (!this.isModuleOpened(cfg)) {
                            _unopens.push(id);
                        }
                    }
                    if (true) {
                        if (limitWarn) {
                            jy.ThrowError("id为：" + limitWarn + "的功能配置，showtype和limittype不一致，请确认是否要这样，这种配置将无法通过程序的方式确认当可以使用功能的时候，是否一定看得见功能入口");
                        }
                        if (errString) {
                            jy.ThrowError("id为:" + errString + "的功能配置使用限制和显示限制配置有误，自动进行修正");
                        }
                        if (unsolve) {
                            jy.ThrowError("有功能配置的限制类型并未实现：" + unsolve);
                        }
                    }
                    jy.dispatch(-998 /* MODULE_CHECKER_INITED */);
                }
            }
        };
        /**
         * 模块是否已经显示
         * @param module    {string | number | IModuleCfg}    模块或者模块配置
         */
        ModuleManager.prototype.isModuleShow = function (module) {
            var cfg = this.getCfg(module);
            if (true) {
                if (!cfg) {
                    jy.ThrowError("\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7684\u529F\u80FD\u914D\u7F6E[" + module + "]");
                }
            }
            var flag = cfg && cfg.close != 2 /* Closed */;
            if (flag && this._checkers) {
                var checker = this._checkers[cfg.showtype];
                if (checker) {
                    flag = checker.check(cfg.showlimits, false);
                }
            }
            return flag;
        };
        /**
         * 模块是否已经开启
         * @param module    {string | number | IModuleCfg}    模块或者模块配置
         * @param showtip   是否显示Tip
         */
        ModuleManager.prototype.isModuleOpened = function (module, showtip) {
            var cfg = this.getCfg(module);
            if (true) {
                if (!cfg) {
                    jy.ThrowError("\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7684\u529F\u80FD\u914D\u7F6E[" + module + "]");
                }
            }
            if (true && !noClientCheck) { //屏蔽客户端检测只针对open，不针对show
                var flag = cfg && !cfg.close && cfg.serverOpen;
                if (flag) {
                    if (this._checkers) {
                        var checker = this._checkers[cfg.limittype];
                        if (checker) {
                            flag = checker.check(cfg.limits, showtip);
                        }
                    }
                }
                else {
                    if (showtip && this.showTip) {
                        this.showTip(1 /* ComingSoon */);
                    }
                }
                return flag;
            }
            else {
                return true;
            }
        };
        /**
        * 将交互对象和功能id进行绑定，当交互对象抛出事件后，会执行功能对应的处理器
        * @param id					功能id
        * @param io					交互对象
        * @param eventType		事件
        *
        */
        ModuleManager.prototype.bindButton = function (id, io, eventType) {
            if (eventType === void 0) { eventType = "touchTap" /* TOUCH_TAP */; }
            if (this._ioBind.has(io)) {
                jy.ThrowError("ModuleManager 注册按钮时候，重复注册了按钮");
                return;
            }
            var cfg = this._allById[id];
            if (!cfg) {
                jy.ThrowError("ModuleManager 注册按钮时候，没有找到对应的模块配置，模块id:" + id);
                return;
            }
            var arr = this._bindedIOById[id];
            if (!arr) {
                this._bindedIOById[id] = arr = [];
            }
            arr.push(io);
            this._ioBind.set(io, id);
            io.on(eventType, this.ioHandler, this);
            if (this.createToolTip) {
                var toolTips = this.createToolTip(cfg);
                if (toolTips) {
                    jy.ToolTipManager.register(io, toolTips);
                }
            }
            var _unshowns = this._unshowns;
            if (!this.isModuleShow(id)) {
                io.visible = false;
                _unshowns.pushOnce(id);
            }
            else {
                _unshowns.remove(id);
            }
        };
        /**
         * 交互事件的处理
         * @param event
         *
         */
        ModuleManager.prototype.ioHandler = function (event) {
            this.toggle(this._ioBind.get(event.currentTarget));
        };
        /**
         * 检查显示/开启
         * @param event
         *
         */
        ModuleManager.prototype.check = function () {
            this._needCheckShow = true;
            egret.callLater(this._check, this);
        };
        ModuleManager.prototype._check = function () {
            if (!this._needCheckShow) {
                return;
            }
            this._needCheckShow = false;
            var changed = false;
            var _a = this, _allById = _a._allById, _unshowns = _a._unshowns, _unopens = _a._unopens;
            var j = 0;
            for (var i = 0; i < _unshowns.length; i++) {
                var id = _unshowns[i];
                var cfg = _allById[id];
                if (this.isModuleShow(cfg)) {
                    var onShow = cfg.onShow;
                    if (onShow) {
                        cfg.onShow = undefined;
                        for (var d = 0; d < onShow.length; d++) {
                            var callback = onShow[d];
                            callback.execute();
                        }
                    }
                    var displays = this._bindedIOById[id];
                    if (displays) {
                        for (var _i = 0, displays_1 = displays; _i < displays_1.length; _i++) {
                            var dis = displays_1[_i];
                            dis.visible = true;
                        }
                    }
                    changed = true;
                }
                else {
                    _unshowns[j++] = id;
                }
            }
            _unshowns.length = j;
            j = 0;
            for (var i = 0; i < _unopens.length; i++) {
                var id = _unopens[i];
                var cfg = _allById[id];
                if (this.isModuleOpened(cfg)) {
                    var onOpen = cfg.onOpen;
                    if (onOpen) {
                        cfg.onOpen = undefined;
                        for (var d = 0; d < onOpen.length; d++) {
                            var callback = onOpen[d];
                            callback.execute();
                        }
                    }
                }
                else {
                    _unopens[j++] = id;
                }
            }
            _unopens.length = j;
            if (changed) {
                jy.dispatch(-994 /* MODULE_SHOW_CHANGED */, _unshowns.length);
            }
        };
        /**
         * 重置 unopen 和 unshown 项
         * 还有 onShow 和  onOpen 注册的类型
         */
        ModuleManager.prototype.resetLimits = function () {
            var _a = this, _allById = _a._allById, _unshowns = _a._unshowns, _unopens = _a._unopens;
            for (var i = 0; i < _unshowns.length; i++) {
                var id = _unshowns[i];
                var cfg = _allById[id];
                var onShow = cfg.onShow;
                if (onShow) {
                    cfg.onShow = undefined;
                    for (var d = 0; d < onShow.length; d++) {
                        var callback = onShow[d];
                        callback.recycle();
                    }
                }
            }
            for (var i = 0; i < _unopens.length; i++) {
                var id = _unopens[i];
                var cfg = _allById[id];
                var onOpen = cfg.onOpen;
                if (onOpen) {
                    cfg.onOpen = undefined;
                    for (var d = 0; d < onOpen.length; d++) {
                        var callback = onOpen[d];
                        callback.recycle();
                    }
                }
            }
            this.checkLimits();
        };
        /**
         *
         * 打开/关闭指定模块
         * @param {(string | number)} moduleID      模块id
         * @param {ToggleState} [toggleState]      0 自动切换(默认)<br/>  1 打开模块<br/> -1 关闭模块<br/>
         * @param {boolean} [showTip=true]          是否显示Tip
         * @return true   可以正常打开
         *         false  被模块配置拦截，无法打开
         */
        ModuleManager.prototype.toggle = function (moduleID, show, showtip, param) {
            if (showtip === void 0) { showtip = true; }
            var cfg = this._allById[moduleID];
            if (!cfg) {
                true && jy.ThrowError("ModuleManager execute时，无法找到对应模块配置,ModuleID为:" + moduleID);
                return;
            }
            jy.dispatch(-997 /* MODULE_TRY_TOGGLE */, moduleID);
            var needShow;
            show = ~~show;
            switch (show) {
                case 0 /* AUTO */:
                    switch (cfg.showState) {
                        case 0 /* HIDE */:
                        case 3 /* HIDING */:
                            needShow = true;
                            break;
                    }
                    break;
                case 1 /* SHOW */:
                    needShow = true;
                    break;
            }
            if (needShow && !this.isModuleOpened(cfg, showtip)) {
                return;
            }
            var moduleHandler = this._hById[moduleID];
            if (!moduleHandler) {
                moduleHandler = this._hByType[cfg.type];
            }
            if (needShow) {
                moduleHandler.show(cfg, param);
            }
            else {
                moduleHandler.hide(cfg, param);
            }
            return true;
        };
        /**
         * 获取模块
         * @param module
         */
        ModuleManager.prototype.getCfg = function (module) {
            return typeof module === "object" ? module : this._allById[module];
        };
        /**
         * 改变服务器模块状态
         *
         * @param {string | number}  mid    服务器模块id
         * @param {boolean} state       模块状态
         */
        ModuleManager.prototype.serverChangeModuleState = function (mid, state) {
            var mcfg = this._allById[mid];
            if (mcfg) {
                if (state != mcfg.serverOpen) {
                    mcfg.serverOpen = state;
                    jy.dispatch(state ? -995 /* MODULE_SERVER_OPEN */ : -996 /* MODULE_SERVER_CLOSE */, mid);
                }
            }
        };
        /**
         * 注册模块开启的回调函数，如果模块已经开启，则直接执行回调
         *
         * @param {Key} mid
         * @param {$CallbackInfo} callback
         */
        ModuleManager.prototype.regModuleOpen = function (mid, callback) {
            var cfg = this._allById[mid];
            if (cfg) {
                if (this.isModuleOpened(cfg)) {
                    callback.execute();
                }
                else {
                    var onOpen = cfg.onOpen;
                    if (!onOpen) {
                        cfg.onOpen = onOpen = [];
                    }
                    onOpen.pushOnce(callback);
                }
            }
        };
        /**
         * 注册模块显示的回调函数，如果模块已经开启，则直接执行回调
         *
         * @param {Key} mid
         * @param {$CallbackInfo} callback
         */
        ModuleManager.prototype.regModuleShow = function (mid, callback) {
            var cfg = this._allById[mid];
            if (cfg) {
                if (this.isModuleShow(cfg)) {
                    callback.execute();
                }
                else {
                    var onShow = cfg.onShow;
                    if (!onShow) {
                        cfg.onShow = onShow = [];
                    }
                    onShow.pushOnce(callback);
                }
            }
        };
        return ModuleManager;
    }());
    jy.ModuleManager = ModuleManager;
    __reflect(ModuleManager.prototype, "jy.ModuleManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     * 用于弹出窗口，并将下层模糊的工具类
     * @export
     * @class BlurScreen
     * @author gushuai
     */
    var BlurScreen = /** @class */ (function () {
        function BlurScreen() {
            this._engine = jy.GameEngine.instance;
            this._bmp = new egret.Bitmap();
            this._stage = egret.sys.$TempStage;
            this._con = new egret.Sprite();
            this._tex = new egret.RenderTexture();
            this._dic = {};
        }
        BlurScreen.prototype.regModuleLayers = function (moduleid) {
            var _this = this;
            var ids = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ids[_i - 1] = arguments[_i];
            }
            var _a = this, _dic = _a._dic, _engine = _a._engine;
            var layers = ids.map(function (id) { return _this._engine.getLayer(id); });
            layers.doSort("id");
            _dic[moduleid] = layers;
        };
        BlurScreen.prototype.checkShowBlur = function (id) {
            var dic = this._dic;
            var layers = dic[id];
            this._current = id;
            if (layers && layers.length) {
                this._stage.on("resize" /* RESIZE */, this.drawBlur, this);
                this.drawBlur();
            }
        };
        BlurScreen.prototype.checkHideBlur = function (id) {
            this._current = id;
            var dic = this._dic;
            var layers = dic[id];
            if (layers && layers.length) {
                this.hideBlur();
            }
        };
        BlurScreen.prototype.drawBlur = function (e) {
            if (e) {
                jy.dispatch(-1998 /* ReLayout */);
            }
            var tex = this._tex;
            var bmp = this._bmp;
            var stage = this._stage;
            var layers = this._dic[this._current];
            if (layers) {
                var con = this._con;
                var len = layers.length;
                for (var i = 0; i < len; i++) {
                    var layer = layers[i];
                    con.addChild(layer);
                }
                tex.drawToTexture(con);
                con.removeChildren();
                bmp.texture = tex;
                bmp.refreshBMD();
                bmp.filters = jy.FilterUtils.blur;
                stage.addChildAt(bmp, 0);
            }
        };
        BlurScreen.prototype.hideBlur = function () {
            this._stage.off("resize" /* RESIZE */, this.drawBlur, this);
            jy.removeDisplay(this._bmp);
            this._tex.$renderBuffer.resize(0, 0);
            var layers = this._dic[this._current];
            if (layers) {
                var len = layers.length;
                var engine = this._engine;
                for (var i = 0; i < len; i++) {
                    var layer = layers[i];
                    engine.awakeLayer(layer.id);
                }
            }
        };
        return BlurScreen;
    }());
    jy.BlurScreen = BlurScreen;
    __reflect(BlurScreen.prototype, "jy.BlurScreen");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 模块面板
     * @author 3tion
     *
     */
    var Panel = /** @class */ (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            var _this = _super.call(this) || this;
            _this._readyState = 0 /* UNREQUEST */;
            _this.init();
            return _this;
        }
        Object.defineProperty(Panel.prototype, "isReady", {
            get: function () {
                return this._readyState == 2 /* COMPLETE */;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.init = function () {
            //this._key=xxxx
            //this._className=xxxx
            //this._otherDepends=[other...];
        };
        Panel.prototype.bind = function (key, className) {
            var otherDepends = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                otherDepends[_i - 2] = arguments[_i];
            }
            this.suiLib = key;
            this.suiClass = className;
            this._otherDepends = otherDepends;
        };
        Panel.prototype.startSync = function () {
            if (this._readyState <= 0 /* UNREQUEST */) { //Failed情况下允许重新请求
                if (this._otherDepends) {
                    this._depends = this._otherDepends.concat();
                }
                else {
                    this._depends = [];
                }
                this._depends.push(this.suiLib);
                this._readyState = 1 /* REQUESTING */;
                this.loadNext();
            }
        };
        Panel.prototype.loadNext = function () {
            if (this._depends.length) {
                var key = this._depends.pop();
                var suiManager = jy.singleton(jy.SuiResManager);
                suiManager.loadData(key, this);
            }
            else {
                this.skinDataComplete();
            }
        };
        Panel.prototype.suiDataComplete = function (suiData) {
            if (this.preloadImage) {
                suiData.loadBmd(jy.CallbackInfo.get(this.loadNext, this));
            }
            else {
                this.loadNext();
            }
        };
        Panel.prototype.suiDataFailed = function (_) {
            this._readyState = -1 /* FAILED */;
            this.readyNow(true);
        };
        Panel.prototype.readyNow = function (failed) {
            var asyncHelper = this._asyncHelper;
            if (asyncHelper) {
                asyncHelper.readyNow();
                if (failed) { //如果是加载失败执行的回调，则将`_ready`再恢复成`false`
                    asyncHelper.isReady = false;
                }
            }
        };
        /**
         * 绑定皮肤
         */
        Panel.prototype.bindComponent = function () {
            jy.singleton(jy.SuiResManager).createComponents(this.suiLib, this.suiClass, this);
        };
        /**
         * 皮肤数据加载完成
         */
        Panel.prototype.skinDataComplete = function () {
            this.bindComponent();
            var bg = this.bg;
            if (!bg && this.numChildren) {
                bg = this.getChildAt(0);
            }
            if (bg) {
                bg.touchEnabled = true;
            }
            this._readyState = 2 /* COMPLETE */;
            this.readyNow();
        };
        Panel.prototype.modalToStage = function () {
            if (this._isModal) {
                this.addModal();
            }
        };
        Object.defineProperty(Panel.prototype, "isModal", {
            get: function () {
                return this._isModal;
            },
            set: function (value) {
                if (this._isModal != value) {
                    this._isModal = value;
                    if (value) {
                        this.setModalTouchClose(true); //默认为true
                        if (this.stage) {
                            this.addModal();
                        }
                        else {
                            this.once("addedToStage" /* ADDED_TO_STAGE */, this.modalToStage, this);
                        }
                    }
                    else {
                        this.removeModal();
                        this.off("addedToStage" /* ADDED_TO_STAGE */, this.modalToStage, this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置模式窗口的灰色区域是否可以点击关闭面板
         *
         * @param {boolean} value
         */
        Panel.prototype.setModalTouchClose = function (value) {
            if (this._mTouchClose != value) {
                this._mTouchClose = value;
                var m = this.getModal();
                if (value) {
                    m.on("touchTap" /* TOUCH_TAP */, this.hide, this);
                }
                else {
                    m.off("touchTap" /* TOUCH_TAP */, this.hide, this);
                }
            }
        };
        Panel.prototype.getModal = function () {
            var m = this.modal;
            if (!m) {
                this.modal = m = new egret.Bitmap();
                var alpha = this.modalAlpha;
                if (alpha == undefined) {
                    alpha = Panel.modalAlpha;
                }
                if (alpha == undefined) {
                    alpha = 0.8 /* defaultModalAlpha */;
                }
                m.texture = jy.ColorUtil.getTexture(0, alpha);
                m.touchEnabled = true;
            }
            return m;
        };
        /**
         * 加模态
         *
         * @public
         */
        Panel.prototype.addModal = function (width, height) {
            var m = this.getModal();
            var rect = this.suiRawRect;
            var stage = egret.sys.$TempStage;
            stage.on("resize" /* RESIZE */, this.onModalResize, this);
            width = width || stage.stageWidth;
            height = height || stage.stageHeight;
            var _a = this, scaleX = _a.scaleX, scaleY = _a.scaleY;
            var sx = rect.x - (width - rect.width >> 1);
            var sy = rect.y - (height - rect.height >> 1);
            m.x = sx / scaleX;
            m.y = sy / scaleY;
            m.width = width / scaleX;
            m.height = height / scaleY;
            this.addChildAt(m, 0);
            this.x = -sx;
            this.y = -sy;
            if (this._mTouchClose) {
                m.on("touchTap" /* TOUCH_TAP */, this.hide, this);
            }
        };
        Panel.prototype.onModalResize = function () {
            this.addModal();
        };
        /**
         * 移除模态
         *
         * @public
         */
        Panel.prototype.removeModal = function () {
            if (this.modal) {
                this.modal.off("touchTap" /* TOUCH_TAP */, this.hide, this);
                jy.removeDisplay(this.modal);
            }
            egret.sys.$TempStage.off("resize" /* RESIZE */, this.onModalResize, this);
        };
        /**
         * 关闭
         *
         * @protected
         */
        Panel.prototype.hide = function () {
            jy.toggle(this.moduleID, -1 /* HIDE */);
        };
        Object.defineProperty(Panel.prototype, "isShow", {
            get: function () {
                return this.stage != undefined && this.visible == true;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.show = function () {
            jy.toggle(this.moduleID, 1 /* SHOW */);
        };
        /**
         * 公共的模式窗口的alpha
         */
        Panel.modalAlpha = 0.8 /* defaultModalAlpha */;
        return Panel;
    }(egret.Sprite));
    jy.Panel = Panel;
    __reflect(Panel.prototype, "jy.Panel", ["jy.SuiDataCallback", "jy.IAsyncPanel", "jy.IAsync", "jy.IModulePanel", "egret.DisplayObject"]);
    jy.expand(Panel, jy.FHost, "addReadyExecute");
    jy.addEnable(Panel);
})(jy || (jy = {}));
var jy;
(function (jy) {
    var View = /** @class */ (function (_super) {
        __extends(View, _super);
        function View(key, className) {
            var _this = _super.call(this) || this;
            _this.suiClass = className;
            _this.suiLib = key;
            jy.singleton(jy.SuiResManager).createComponents(key, className, _this);
            return _this;
        }
        return View;
    }(egret.Sprite));
    jy.View = View;
    __reflect(View.prototype, "jy.View");
    ;
    jy.addEnable(View);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 左上的点
     */
    var tl = { x: 0, y: 0 };
    /**
     * 用于做翻页效果
     *
     * @author 3tion
     * @export
     * @class Flip
     */
    var Flip = /** @class */ (function (_super) {
        __extends(Flip, _super);
        function Flip() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.frontCon = new egret.Sprite();
            _this.backCon = new egret.Sprite();
            _this.frontMask = new egret.Shape();
            _this.backMask = new egret.Shape();
            _this.backPoints = [];
            _this.frontPoints = [];
            return _this;
        }
        /**
         * 设置纹理
         *
         * @param {(egret.Texture | egret.DisplayObject)} front
         * @param {(egret.Texture | egret.DisplayObject)} [back]
         * @param {any} [supportedCorner=FlipCorner.TopLeft | FlipCorner.BottomLeft]
         * @param {Size} [size]
         */
        Flip.prototype.init = function (front, back, supportedCorner, size) {
            if (supportedCorner === void 0) { supportedCorner = 1 /* TopLeft */ | 4 /* BottomLeft */; }
            var ftex = getTexture(front);
            var btex = back && back != front ? getTexture(back) : ftex;
            function getTexture(tester) {
                if (tester instanceof egret.DisplayObject) {
                    var tex = new egret.RenderTexture();
                    tex.drawToTexture(tester);
                    return tex;
                }
                else {
                    return tester;
                }
            }
            var frontDis = new egret.Bitmap();
            var backDis = new egret.Bitmap();
            frontDis.texture = ftex;
            backDis.texture = btex;
            this.init2(frontDis, backDis, supportedCorner, size);
        };
        /**
         * 设置页面前后的可视对象
         *
         * @param {(egret.DisplayObject)} front 正面纹理
         * @param {(egret.DisplayObject)} back 反面纹理
         * @param {any} [supportedCorner=FlipCorner.TopLeft | FlipCorner.BottomLeft] 支持拖拽的角
         * @param {Size} [size] 页面大小
         */
        Flip.prototype.init2 = function (front, back, supportedCorner, size) {
            if (supportedCorner === void 0) { supportedCorner = 1 /* TopLeft */ | 4 /* BottomLeft */; }
            var _a = this, frontCon = _a.frontCon, backCon = _a.backCon, frontMask = _a.frontMask, backMask = _a.backMask;
            front.x = front.y = back.x = back.y = 0;
            this.frontDis = front;
            this.backDis = back;
            this.sCorner = supportedCorner;
            this.touchEnabled = true;
            frontCon.addChild(front);
            jy.removeDisplay(frontMask);
            front.mask = null;
            backCon.addChild(back);
            back.mask = backMask;
            back.scaleX = -1;
            backMask.scaleX = -1;
            jy.removeDisplay(backMask);
            this.addChild(frontCon);
            if (!size) {
                size = { width: front.width, height: front.height };
            }
            var width = size.width, height = size.height;
            this.bl = { x: 0, y: height };
            this.tr = { x: width, y: 0 };
            this.br = { x: width, y: height };
            this.size = size;
            this.on("touchBegin" /* TOUCH_BEGIN */, this.touchBegin, this);
        };
        Flip.prototype.touchBegin = function (e) {
            //检查鼠标点是在上半区还是下半区
            var _a = this.size, width = _a.width, height = _a.height;
            var _b = this.getLocal(e), x = _b.x, y = _b.y;
            var isTop = y < height >> 1;
            var isLeft = x < width >> 1;
            var corner = isTop ? (isLeft ? 1 /* TopLeft */ : 2 /* TopRight */) : (isLeft ? 4 /* BottomLeft */ : 8 /* BottomRight */);
            this.farea = 0;
            this.barea = 0;
            if (corner == (corner & this.sCorner)) { //支持这个角
                this.cCorner = corner;
                this.oX = isLeft ? 0 : width;
                this.oY = isTop ? 0 : height;
                var stage = this.stage;
                stage.on("touchMove" /* TOUCH_MOVE */, this.touchMove, this);
                stage.on("touchEnd" /* TOUCH_END */, this.touchEnd, this);
                stage.on("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.touchEnd, this);
                this.draw(x, y);
            }
        };
        Flip.prototype.touchMove = function (e) {
            var _a = this.getLocal(e), x = _a.x, y = _a.y;
            this.draw(x, y);
        };
        Flip.prototype.getLocal = function (e) {
            var stageX = e.stageX, stageY = e.stageY;
            var pt = jy.Temp.EgretPoint;
            this.globalToLocal(stageX, stageY, pt);
            return pt;
        };
        Flip.prototype.touchEnd = function (e) {
            // let { width, height } = this.size;
            // let { isLeft, isTop } = this.getCorner(e.localX, e.localY, width, height);
            // let cCorner = this.cCorner;
            // let ok = isLeft && (cCorner == FlipCorner.BottomRight || cCorner == FlipCorner.TopRight)//拖动右边的角，拖到左边，则认为翻页成功
            //     || !isLeft && (cCorner == FlipCorner.BottomLeft || cCorner == FlipCorner.TopLeft)//拖动左边的角，拖到右边，则认为翻页成功
            //     || isTop && (cCorner == FlipCorner.BottomLeft || cCorner == FlipCorner.BottomRight)//拖动下边的角，拖到上边，则认为翻页成功
            //     || !isTop && (cCorner == FlipCorner.TopLeft || cCorner == FlipCorner.TopRight);//拖动上边的角，拖到下边，则认为翻页成功
            var farea = this.farea;
            this.dispatchEventWith(-1060 /* FlipEnd */, false, farea == 0 ? 1 : this.barea / farea);
            this.reset();
            this.clearEvents();
        };
        Flip.prototype.clearEvents = function () {
            var stage = egret.sys.$TempStage;
            stage.off("touchMove" /* TOUCH_MOVE */, this.touchMove, this);
            stage.off("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            stage.off("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.touchEnd, this);
        };
        Flip.prototype.reset = function () {
            var _a = this, frontDis = _a.frontDis, backCon = _a.backCon, frontMask = _a.frontMask;
            frontDis.mask = null;
            jy.removeDisplay(frontMask);
            jy.removeDisplay(backCon);
        };
        Flip.prototype.draw = function (x, y) {
            //计算折边
            //折边为  当前所在点 与原始点的连线的垂直中线
            var _a = this, oX = _a.oX, oY = _a.oY, size = _a.size;
            var width = size.width, height = size.height;
            var dx = x - oX;
            var dy = y - oY;
            if (dx == 0 || dy == 0) {
                this.reset();
                return;
            }
            var _b = this, cCorner = _b.cCorner, backMask = _b.backMask, frontCon = _b.frontCon, backDis = _b.backDis, frontDis = _b.frontDis, backCon = _b.backCon, frontMask = _b.frontMask, backPoints = _b.backPoints, frontPoints = _b.frontPoints;
            var cX = oX + dx * 0.5;
            var cY = oY + dy * 0.5;
            var tan = dy / dx;
            var leftY = cY + cX / tan;
            var rightY = leftY - width / tan;
            var topX = cX + cY * tan;
            var bottomX = topX - height * tan;
            var p;
            var _c = this, bl = _c.bl, br = _c.br, tr = _c.tr;
            var bi = 0;
            var fi = 0;
            //计算面积用         
            switch (cCorner) {
                case 1 /* TopLeft */: {
                    if (topX.between(0, width)) {
                        p = { x: topX, y: 0 };
                        backPoints[bi++] = p;
                    }
                    else {
                        p = { x: width, y: rightY };
                        backPoints[bi++] = p;
                        backPoints[bi++] = tr;
                    }
                    frontPoints[fi++] = p;
                    backPoints[bi++] = tl;
                    if (leftY.between(0, height)) {
                        p = { x: 0, y: leftY };
                        backPoints[bi++] = p;
                        frontPoints[fi++] = p;
                        frontPoints[fi++] = bl;
                    }
                    else {
                        backPoints[bi++] = bl;
                        //检查下边线
                        p = { x: bottomX, y: height };
                        backPoints[bi++] = p;
                        frontPoints[fi++] = p;
                    }
                    frontPoints[fi++] = br;
                    frontPoints[fi++] = tr;
                    break;
                }
                case 4 /* BottomLeft */:
                    {
                        if (leftY.between(0, height)) {
                            p = { x: 0, y: leftY };
                            backPoints[bi++] = p;
                        }
                        else {
                            p = { x: topX, y: 0 };
                            backPoints[bi++] = p;
                            backPoints[bi++] = tl;
                        }
                        frontPoints[fi++] = p;
                        backPoints[bi++] = bl;
                        if (bottomX.between(0, width)) {
                            p = { x: bottomX, y: height };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                            frontPoints[fi++] = br;
                        }
                        else {
                            backPoints[bi++] = br;
                            p = { x: width, y: rightY };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                        }
                        frontPoints[fi++] = tr;
                        frontPoints[fi++] = tl;
                        break;
                    }
                case 8 /* BottomRight */:
                    {
                        if (bottomX.between(0, width)) {
                            p = { x: bottomX, y: height };
                            backPoints[bi++] = p;
                        }
                        else {
                            p = { x: 0, y: leftY };
                            backPoints[bi++] = p;
                            backPoints[bi++] = bl;
                        }
                        frontPoints[fi++] = p;
                        backPoints[bi++] = br;
                        if (rightY.between(0, width)) {
                            p = { x: width, y: rightY };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                            frontPoints[fi++] = tr;
                        }
                        else {
                            backPoints[bi++] = tr;
                            p = { x: topX, y: 0 };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                        }
                        frontPoints[fi++] = tl;
                        frontPoints[fi++] = bl;
                        break;
                    }
                case 2 /* TopRight */:
                    {
                        if (rightY.between(0, height)) {
                            p = { x: width, y: rightY };
                            backPoints[bi++] = p;
                        }
                        else {
                            p = { x: bottomX, y: height };
                            backPoints[bi++] = p;
                            backPoints[bi++] = br;
                        }
                        frontPoints[fi++] = p;
                        backPoints[bi++] = tr;
                        if (topX.between(0, width)) {
                            p = { x: topX, y: 0 };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                            frontPoints[fi++] = tl;
                        }
                        else {
                            backPoints[bi++] = tl;
                            p = { x: 0, y: leftY };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                        }
                        frontPoints[fi++] = bl;
                        frontPoints[fi++] = br;
                        break;
                    }
            }
            //绘制遮罩
            this.farea = calculateAndDraw(frontPoints, frontMask, fi);
            this.barea = calculateAndDraw(backPoints, backMask, bi);
            frontDis.mask = frontMask;
            frontCon.addChild(frontMask);
            backCon.addChild(backMask);
            backCon.anchorOffsetX = -topX;
            backCon.x = topX;
            backCon.rotation = (Math.PI - 2 * Math.atan2(dx, dy)) * Math.RAD_TO_DEG;
            this.addChild(backCon);
            /**
             * 绘制遮罩并计算面积
             *
             * @param {Point[]} points
             * @param {egret.Shape} mask
             * @param {number} length
             * @returns
             */
            function calculateAndDraw(points, mask, length) {
                //面积计算公式
                // S=（（X2-X1）*  (Y2+Y1)+（X2-X2）*  (Y3+Y2)+（X4-X3）*  (Y4+Y3)+……+（Xn-Xn-1）*  (Yn+Yn-1)+（X1-Xn）*  (Y1+Yn)）/2
                var g = mask.graphics;
                //points的length一定为3或者4，所以不做检测
                g.clear();
                var p0 = points[0];
                g.beginFill(0);
                g.moveTo(p0.x, p0.y);
                var s = 0;
                var last = p0;
                for (var i = 1; i < length; i++) {
                    var p_1 = points[i];
                    g.lineTo(p_1.x, p_1.y);
                    s += (p_1.x - last.x) * (p_1.y + last.y);
                    last = p_1;
                }
                s += (p0.x - last.x) * (p0.y + last.y);
                g.lineTo(p0.x, p0.y);
                g.endFill();
                return s * 0.5;
            }
        };
        return Flip;
    }(egret.Sprite));
    jy.Flip = Flip;
    __reflect(Flip.prototype, "jy.Flip");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 图片
     * 外部加载
     * @pb
     *
     */
    var Image = /** @class */ (function (_super) {
        __extends(Image, _super);
        function Image() {
            var _this = _super.call(this) || this;
            _this.on("addedToStage" /* ADDED_TO_STAGE */, _this.addedToStage, _this);
            _this.on("removedFromStage" /* REMOVED_FROM_STAGE */, _this.removedFromStage, _this);
            return _this;
        }
        Image.prototype.addedToStage = function () {
            if (this.uri) {
                var res = jy.ResManager.getTextureRes(this.uri, this.noWebp);
                if (res) {
                    res.qid = this.qid;
                    //先设置为占位用，避免有些玩家加载慢，无法看到图
                    this.texture = this.placehoder;
                    res.bind(this);
                    res.load();
                }
            }
        };
        Image.prototype.removedFromStage = function () {
            if (this.uri) {
                var res = jy.ResManager.getResource(this.uri);
                if (res) {
                    res.loose(this);
                }
            }
            this.texture = undefined;
        };
        Object.defineProperty(Image.prototype, "source", {
            /**
             * 设置资源标识
             */
            set: function (value) {
                if (this.uri == value)
                    return;
                if (this.uri) { //解除资源绑定
                    this.removedFromStage();
                }
                this.uri = value;
                if (value) {
                    if (this.stage) {
                        this.addedToStage();
                    }
                }
                else {
                    this.texture = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 销毁图片
         */
        Image.prototype.dispose = function () {
            this.removedFromStage();
            this.off("addedToStage" /* ADDED_TO_STAGE */, this.addedToStage, this);
            this.off("removedFromStage" /* REMOVED_FROM_STAGE */, this.removedFromStage, this);
        };
        return Image;
    }(egret.Bitmap));
    jy.Image = Image;
    __reflect(Image.prototype, "jy.Image");
    ;
    jy.addEnable(Image);
})(jy || (jy = {}));
var jy;
(function (jy) {
    var ListItemRenderer = /** @class */ (function (_super) {
        __extends(ListItemRenderer, _super);
        function ListItemRenderer() {
            var _this = _super.call(this) || this;
            _this._defaultWidth = 5;
            _this._defalutHeight = 5;
            _this._ready = true;
            _this._oldWidth = -1;
            _this._oldHeight = -1;
            _this.inited = false;
            _this._visible = true;
            return _this;
        }
        Object.defineProperty(ListItemRenderer.prototype, "index", {
            get: function () {
                return this._idx;
            },
            set: function (value) {
                this._idx = value;
                var v = this._skin;
                if (v) {
                    v.$_rndIdx = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemRenderer.prototype, "dataChange", {
            get: function () {
                return this._noCheckSame || this._dataChange;
            },
            set: function (value) {
                this._dataChange = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 子类重写
         * 初始化组件
         * 一定要super调一下
         */
        ListItemRenderer.prototype._bind = function () {
            if (!this._skin) {
                if (this.skinlib && this.skinClass) {
                    this.skin = jy.singleton(jy.SuiResManager).createDisplayObject(this.skinlib, this.skinClass);
                }
            }
            else {
                this.inited = true;
            }
            this.checkInject();
            this.bindComponent();
        };
        ListItemRenderer.prototype.bindComponent = function () { };
        ListItemRenderer.prototype.onTouchTap = function () {
            this.dispatch(-1001 /* ITEM_TOUCH_TAP */);
            this.dispatchEventWith("touchTap" /* TOUCH_TAP */);
        };
        ListItemRenderer.prototype.$setData = function (value) {
            this._data = value;
            if (!this.inited) {
                this._bind();
            }
        };
        Object.defineProperty(ListItemRenderer.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                if (this._noCheckSame || value != this._data) {
                    this.$setData(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置容器
         *
         * @param {egret.DisplayObjectContainer} value
         *
         * @memberOf ListItemRenderer
         */
        ListItemRenderer.prototype.setContainer = function (value) {
            var old = this._container;
            this._container = value;
            var s = this._skin;
            if (s) {
                if (value) {
                    value.addChild(s);
                }
                else if (old && old.contains(s)) {
                    old.removeChild(s);
                }
            }
            return this;
        };
        Object.defineProperty(ListItemRenderer.prototype, "skin", {
            get: function () {
                return this._skin;
            },
            // /**
            //  * 设置已定位好的皮肤
            //  * (description)
            //  */
            // public set skinTemplete(value: S) {
            //     this._skinTemplete = value;
            //     // let parent = value.parent;
            //     this.skin = value;
            //     // parent.addChild(this);
            // }
            set: function (value) {
                if (value != this._skin) {
                    this.$setSkin(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        ListItemRenderer.prototype.$setSkin = function (value) {
            var old = this._skin;
            if (old) {
                old.$_rndIdx = undefined; //置空
                //移除之前的事件监听
                this.removeSkinListener(old);
            }
            this._skin = value;
            value.$_rndIdx = this._idx;
            this.$setVisible(value.visible);
            value.touchEnabled = true;
            this.addSkinListener(this._skin);
            var c = this._container;
            if (c) {
                c.addChild(value);
            }
            this._bind();
        };
        /**
         * 根据数据处理视图
         *
         * 子类重写
         */
        ListItemRenderer.prototype.handleView = function () {
            if (!this._sizeChecked) {
                this._sizeChecked = true;
                this.checkViewSize();
            }
        };
        /**
         * force为true时无条件派发一次事件，通知更新坐标
         *
         * @protected
         * @ param {boolean} [force=false] 是否强制标记为尺寸变更
         */
        ListItemRenderer.prototype.checkViewSize = function (force) {
            this._sizeChecked = false;
            var view = this._skin;
            var w = view.width;
            var h = view.height;
            if (!force) {
                if (this._oldHeight != h || this._oldWidth != w) {
                    force = true;
                }
            }
            this._oldHeight = h;
            this._oldWidth = w;
            if (force) {
                this.dispatch(-1999 /* Resize */);
            }
        };
        Object.defineProperty(ListItemRenderer.prototype, "view", {
            /**
             *
             * 获取视图
             * @readonly
             */
            get: function () {
                return this._skin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListItemRenderer.prototype, "visible", {
            get: function () {
                return this._visible;
            },
            set: function (value) {
                if (value != this._visible) {
                    this.$setVisible(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        ListItemRenderer.prototype.$setVisible = function (value) {
            this._visible = value;
            var skin = this._skin;
            if (skin) {
                skin.visible = value;
            }
        };
        Object.defineProperty(ListItemRenderer.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (value) {
                if (this._selected != value) {
                    this.$setSelected(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        ListItemRenderer.prototype.setPos = function (x, y) {
            var v = this._skin;
            if (v) {
                if (typeof x == "object") {
                    v.x = x.x;
                    v.y = x.y;
                }
                else {
                    x != undefined && (v.x = x);
                    y != undefined && (v.y = y);
                }
            }
            return this;
        };
        ListItemRenderer.prototype.$setSelected = function (value) {
            this._selected = value;
            this.dispatch(-1000 /* CHOOSE_STATE_CHANGE */);
        };
        ListItemRenderer.prototype.dispatch = function (type, data) {
            var s = this._skin;
            if (s) {
                s.dispatch(type, data);
            }
            return _super.prototype.dispatch.call(this, type, data);
        };
        /**
         * 子类重写
         * 销毁组件
         */
        ListItemRenderer.prototype.dispose = function () {
            this.removeSkinListener(this._skin);
            //清理自身所有事件
            this.removeAllListeners();
        };
        ListItemRenderer.prototype.removeSkinListener = function (skin) {
            if (skin) {
                skin.off("touchTap" /* TOUCH_TAP */, this.onTouchTap, this);
                jy.ViewController.prototype.removeSkinListener.call(this, skin);
            }
        };
        ListItemRenderer.prototype.addSkinListener = function (skin) {
            if (skin) {
                skin.on("touchTap" /* TOUCH_TAP */, this.onTouchTap, this);
                jy.ViewController.prototype.addSkinListener.call(this, skin);
            }
        };
        /**
         * 绑定TOUCH_TAP的回调
         *
         * @template T
         * @param {{ (this: T, e?: egret.Event): any }} handler
         * @param {T} [thisObject]
         * @param {number} [priority]
         * @param {boolean} [useCapture]
         */
        ListItemRenderer.prototype.bindTouch = function (handler, thisObject, priority, useCapture) {
            this.skin.touchEnabled = true;
            this.on("touchTap" /* TOUCH_TAP */, handler, thisObject, useCapture, priority);
        };
        /**
         * 解除TOUCH_TAP的回调的绑定
         *
         * @param {Function} handler
         * @param {*} thisObject
         * @param {boolean} [useCapture]
         *
         * @memberOf Button
         */
        ListItemRenderer.prototype.looseTouch = function (handler, thisObject, useCapture) {
            this.off("touchTap" /* TOUCH_TAP */, handler, thisObject, useCapture);
        };
        Object.defineProperty(ListItemRenderer.prototype, "isReady", {
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        ListItemRenderer.prototype.startSync = function () {
        };
        return ListItemRenderer;
    }(egret.EventDispatcher));
    jy.ListItemRenderer = ListItemRenderer;
    __reflect(ListItemRenderer.prototype, "jy.ListItemRenderer", ["jy.ListItemRender", "jy.SelectableComponents"]);
    jy.expand(ListItemRenderer, jy.ViewController, "addReadyExecute", "addDepend", "onStage", "interest", "checkInject", "checkInterest", "awakeTimer", "sleepTimer", "bindTimer", "looseTimer", "stageChange");
    // export abstract class AListItemRenderer<T, S extends egret.DisplayObject> extends ListItemRenderer<T, S> implements SuiDataCallback {
    //     /**
    //      * 子类重写设置皮肤
    //      * 
    //      * @protected
    //      * @abstract
    //      * 
    //      * @memberOf ListItemRenderer
    //      */
    //     protected abstract initSkin();
    //     protected $setSkin(value: S) {
    //         if (value instanceof View) {
    //             //检查SuiResManager是否已经加载了key
    //             singleton(SuiResManager).loadData(value.key, this.$setSkin)
    //             value.key
    //         } else {
    //             super.$setSkin(value);
    //         }
    //     }
    // }
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 翻页，一次手势翻一页
     *
     * @export
     * @class PageScroller
     * @extends {Scroller}
     */
    var PageScroller = /** @class */ (function (_super) {
        __extends(PageScroller, _super);
        function PageScroller() {
            var _this = _super.call(this) || this;
            /**
             * 当前在第几页
             *
             * @type {number}
             */
            _this.currentPage = 1;
            _this.autoScrollSpeed = 1;
            _this.minPageScrollSpeed = 0.05;
            /**
             * 总共将显示对象切割成几页
             *
             * @type {number}
             */
            _this._totalpageCount = 1;
            return _this;
        }
        PageScroller.prototype.settotalpageInfo = function (count, size) {
            if (count < 1) {
                count = 1;
            }
            if (size < 0) {
                size = 0;
            }
            this._pageSize = size;
            this._totalpageCount = count;
        };
        Object.defineProperty(PageScroller.prototype, "totalpageCount", {
            /**
             * 总共将显示对象切割成几页
             *
             * @type {number}
             */
            get: function () {
                return this._totalpageCount;
            },
            enumerable: true,
            configurable: true
        });
        PageScroller.prototype.bindObj = function (content, scrollRect, scrollbar) {
            _super.prototype.bindObj.call(this, content, scrollRect, null);
        };
        PageScroller.prototype.onDragStart = function (e) {
            if (this._scrollType == 0) {
                this._firstTouchPos = e.stageY;
            }
            else {
                this._firstTouchPos = e.stageX;
            }
            _super.prototype.onDragStart.call(this, e);
        };
        PageScroller.prototype.onDragEnd = function (e) {
            var _content = this._content;
            var stage = _content.stage || egret.sys.$TempStage;
            stage.off("touchMove" /* TOUCH_MOVE */, this.onDragMove, this);
            _content.off("touchEnd" /* TOUCH_END */, this.onDragEnd, this);
            var now = jy.Global.now;
            var nowPos;
            if (this._scrollType == 0) {
                nowPos = e.stageY;
            }
            else {
                nowPos = e.stageX;
            }
            var subdis = nowPos - this._firstTouchPos;
            //往前或者往上翻
            if (subdis >= 0) {
                if (this.currentPage == 1) {
                    return;
                }
            }
            //往后或者往下翻
            if (subdis < 0) {
                if (this.currentPage == this._totalpageCount) {
                    return;
                }
            }
            var pos;
            if (this._scrollType == 0) {
                pos = this._content.scrollRect.y;
            }
            else {
                pos = this._content.scrollRect.x;
            }
            var page = Math.round(pos / this._pageSize) + 1;
            if (page < 1) {
                page = 1;
            }
            if (page > this._totalpageCount) {
                page = this._totalpageCount;
            }
            var pagederiction = page > this.currentPage ? -1 : 1;
            this._scrollToPage = page;
            this._lastFrameTime = jy.Global.now;
            if (now - this._lastMoveTime < 150) {
                //检测手势速度
                //eg：当前在2.8页，即玩家意图从第2页翻到第三页，原本手势是从右向左滑动，但是在最后松开的时候，向右猛拉
                //此时判断手势速度，大于指定值，返回到第2页，否则移动到第三页
                //如果玩家最后松开时的手势与原本意图翻页的趋势一样，那么自然滑到下一页
                if (this._deriction == pagederiction) {
                    this._moveSpeed = this.autoScrollSpeed;
                }
                else {
                    if (this._moveSpeed > this.minPageScrollSpeed) {
                        this._scrollToPage = this.currentPage;
                        this._moveSpeed = this.autoScrollSpeed;
                    }
                    else {
                        this._moveSpeed = this.autoScrollSpeed;
                    }
                }
            }
            else {
                //自然衰减到当前页
                this._moveSpeed = this.autoScrollSpeed;
            }
            if (_content.stage) {
                stage.on("enterFrame" /* ENTER_FRAME */, this.autoScrollToNextPage, this);
            }
        };
        PageScroller.prototype.autoScrollToNextPage = function (e) {
            var _content = this._content;
            var rect = _content.scrollRect;
            var currentPos;
            var targetPos = this._pageSize * (this._scrollToPage - 1);
            if (this._scrollType == 0) {
                currentPos = rect.y;
            }
            else {
                currentPos = rect.x;
            }
            var now = jy.Global.now;
            var subTime = now - this._lastFrameTime;
            var sub = this._moveSpeed * subTime * this.globalspeed;
            var subdis = targetPos - currentPos;
            var deriction = subdis > 0 ? -1 : 1;
            if (Math.abs(subdis) < sub || Math.abs(subdis) < 2) {
                _content.stage.off("enterFrame" /* ENTER_FRAME */, this.autoScrollToNextPage, this);
                this.doScrollContent(subdis * deriction);
                rect = _content.scrollRect;
                if (this._scrollType == 0) {
                    currentPos = rect.y;
                }
                else {
                    currentPos = rect.x;
                }
                this.currentPage = Math.round(currentPos / this._pageSize) + 1;
                return;
            }
            this.doScrollContent(sub * deriction);
            this._lastFrameTime = now;
            this._moveSpeed *= this.blockSpeed;
        };
        return PageScroller;
    }(jy.Scroller));
    jy.PageScroller = PageScroller;
    __reflect(PageScroller.prototype, "jy.PageScroller");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 为已布局好的render提供List功能
     *
     * @export
     * @class MPageList
     * @extends {PageList}
     */
    var MPageList = /** @class */ (function (_super) {
        __extends(MPageList, _super);
        function MPageList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._viewCount = 0;
            return _this;
        }
        MPageList.prototype.displayList = function (data) {
            this._selectedIndex = -1;
            var dataLen = data && data.length || 0;
            //如果新赋值的数据长度比以前的短，就自动清理掉多出来的item
            var olen = Math.max(this._dataLen, this._viewCount);
            while (olen > dataLen) {
                var render = this.getItemAt(olen - 1);
                if (render) {
                    render.data = undefined;
                    if (render.handleView) {
                        render.handleView();
                    }
                }
                olen--;
            }
            this._data = data;
            this._dataLen = dataLen;
            this.doRender(0, dataLen - 1);
            return this;
        };
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        MPageList.prototype.updateByIdx = function (index, data) {
            var item = this.getItemAt(index);
            if (item) {
                this._data[index] = data;
                item.data = data;
                if (item.handleView) {
                    item.handleView();
                }
            }
            return this;
        };
        MPageList.prototype.addItem = function (item, index) {
            var list = this._list;
            var idx = list.indexOf(item);
            if (idx == -1) {
                idx = list.length;
                list[idx] = item;
                item.on(-1001 /* ITEM_TOUCH_TAP */, this.onTouchItem, this);
            }
            item.index = index == undefined ? idx : index;
            this._viewCount = list.length;
            return this;
        };
        MPageList.prototype._get = function (index) {
            var list = this._list;
            var render = list[index];
            if (render) {
                render.index = index;
                return render;
            }
        };
        MPageList.prototype.clear = function () {
            this._dataLen = 0;
            this._data = undefined;
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                var render = _a[_i];
                render.data = undefined;
            }
            this._selectedIndex = -1;
            this._selectedItem = undefined;
            return this;
        };
        MPageList.prototype.dispose = function () {
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                var render = _a[_i];
                render.off("touchTap" /* TOUCH_TAP */, this.onTouchItem, this);
            }
            this.clear();
        };
        return MPageList;
    }(jy.AbsPageList));
    jy.MPageList = MPageList;
    __reflect(MPageList.prototype, "jy.MPageList");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var PageList = /** @class */ (function (_super) {
        __extends(PageList, _super);
        /**
         * Creates an instance of PageList.
         * @param {ClassFactory<R> | Creator<R>} renderfactory
         * @param {PageListOption} [option]
         */
        function PageList(renderfactory, option) {
            var _this = _super.call(this) || this;
            _this._sizeChanged = false;
            _this.scroller = null; //站位用，便于对Scroller的绑定
            _this._waitForSetIndex = false;
            _this.renderChange = false;
            if (!(renderfactory instanceof jy.ClassFactory)) {
                renderfactory = new jy.ClassFactory(renderfactory);
            }
            _this._factory = renderfactory;
            _this.init(option);
            return _this;
        }
        Object.defineProperty(PageList.prototype, "w", {
            get: function () {
                return this._w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageList.prototype, "h", {
            get: function () {
                return this._h;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageList.prototype, "container", {
            /**
             * 容器
             *
             * @readonly
             */
            get: function () {
                return this._con;
            },
            set: function (con) {
                if (!con) {
                    true && jy.ThrowError("\u5BB9\u5668\u4E0D\u5141\u8BB8\u8BBE\u7F6E\u7A7A\u503C");
                    return;
                }
                var old = this._con;
                if (old != con) {
                    if (old) {
                        delete old.$_page;
                        delete old.scrollRect;
                    }
                    this._con = con;
                    con.$_page = this;
                    Object.defineProperty(con, "scrollRect", define);
                }
            },
            enumerable: true,
            configurable: true
        });
        PageList.prototype.init = function (option) {
            option = option || jy.Temp.EmptyObject;
            var hgap = option.hgap, vgap = option.vgap, type = option.type, itemWidth = option.itemWidth, itemHeight = option.itemHeight, columnCount = option.columnCount, staticSize = option.staticSize, noScroller = option.noScroller, con = option.con;
            this.staticSize = staticSize;
            type = ~~type;
            columnCount = ~~columnCount;
            if (columnCount < 1) {
                if (type == 1 /* Horizon */) {
                    columnCount = Infinity;
                }
                else {
                    columnCount = 1;
                }
            }
            this._columncount = columnCount;
            this._hgap = ~~hgap;
            this._vgap = ~~vgap;
            this.itemWidth = itemWidth;
            this.itemHeight = itemHeight;
            // this.noDrawBG = option.noDrawBG;
            //@ts-ignore
            this.scrollType = type;
            con = con || new egret.Sprite();
            var bmp = new egret.Bitmap();
            bmp.texture = jy.ColorUtil.getTexture(0, 0);
            this.bg = bmp;
            con.addChild(bmp);
            this.container = con;
            var self = this;
            Object.defineProperties(con, jy.makeDefDescriptors({
                measuredHeight: {
                    get: function () {
                        return self._h;
                    }
                },
                measuredWidth: {
                    get: function () {
                        return self._w;
                    }
                }
            }));
            if (!noScroller) {
                var scroller = this.scroller = new jy.Scroller();
                scroller.scrollType = this.scrollType;
                scroller.bindObj2(con, con.suiRawRect);
            }
        };
        PageList.prototype.displayList = function (data) {
            this._selectedIndex = -1;
            if (this._data != data) {
                this.rawDataChanged = true;
            }
            var nlen = data ? data.length : 0;
            if (this._data) {
                //如果新赋值的数据长度比以前的短，就自动清理掉多出来的item
                var list = this._list;
                var llen = list.length;
                if (nlen < llen) {
                    for (var i = nlen; i < list.length; i++) {
                        var render = list[i];
                        this._removeRender(render);
                    }
                    list.length = nlen;
                }
            }
            this._data = data;
            this._lastRect = undefined;
            if (!nlen) {
                this.clear();
                this._dataLen = 0;
                this.rawDataChanged = false;
                return this;
            }
            this._dataLen = nlen;
            this.initItems();
            var scroller = this.scroller;
            if (scroller) {
                scroller.scrollToHead();
            }
            this.rawDataChanged = false;
            return this;
        };
        /**
         * 基于容器原始坐标进行排布
         * @param type 如果设置 `LayoutType.FullScreen(0)`，基于`LayoutType.TOP_LEFT`定位
         */
        PageList.prototype.layout = function (type) {
            if (!this.scroller) { //有scroller的不处理
                var con = this._con;
                var suiRawRect = con.suiRawRect;
                if (suiRawRect) {
                    if (type == 0 /* FullScreen */) { //设0恢复原样，基于 top_left 定位
                        type = 5 /* TOP_LEFT */;
                    }
                    var pt = jy.Temp.SharedPoint1;
                    jy.Layout.getLayoutPos(this._w, this._h, suiRawRect.width, suiRawRect.height, type, pt);
                    con.x = suiRawRect.x + pt.x;
                    con.y = suiRawRect.y + pt.y;
                }
            }
            return this;
        };
        /**
         * 初始化render占据array，不做任何初始化容器操作
         *
         * @private
         */
        PageList.prototype.initItems = function () {
            var len = this._data.length;
            this.doRender(0, len - 1);
            this._sizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        };
        PageList.prototype.onChange = function () {
            if (!this.itemWidth || !this.itemHeight) { //并未设置固定的宽度高度，需要重新计算坐标
                this._sizeChanged = true;
                this.reCalc();
            }
        };
        PageList.prototype._get = function (index) {
            var list = this._list;
            var render = list[index];
            if (!render) {
                render = this._factory.get();
                list[index] = render;
                render.on(-1999 /* Resize */, this.onSizeChange, this);
                render.on(-1001 /* ITEM_TOUCH_TAP */, this.onTouchItem, this);
            }
            render.index = index;
            return render;
        };
        PageList.prototype.onSizeChange = function () {
            if (!this._sizeChanged) {
                this._sizeChanged = true;
                this.once("enterFrame" /* ENTER_FRAME */, this.reCalc, this);
            }
        };
        PageList.prototype.getSize = function (v) {
            var size = v;
            if (this.staticSize) {
                var rect = v.suiRawRect;
                if (rect) {
                    size = rect;
                }
            }
            return size;
        };
        /**
         * 重新计算Render的坐标
         *
         * @private
         * @param {number} [start]
         * @param {number} [end]
         * @returns
         */
        PageList.prototype.reCalc = function () {
            if (!this._sizeChanged) {
                return;
            }
            this._sizeChanged = false;
            var renderList = this._list;
            var len = renderList.length;
            var end = len - 1;
            // let lastrender: R;
            //得到单行/单列最大索引数
            var _a = this, itemWidth = _a.itemWidth, itemHeight = _a.itemHeight, _columncount = _a._columncount, _hgap = _a._hgap, _vgap = _a._vgap, staticSize = _a.staticSize;
            var rowCount = len / _columncount;
            var oy = 0, ox = 0;
            var maxWidth = 0, maxHeight = 0;
            var i = 0;
            for (var r = 0; r <= rowCount; r++) {
                //单行的最大高度
                var lineMaxHeight = 0;
                for (var c = 0; c < _columncount; c++) {
                    if (i > end) {
                        break;
                    }
                    var render = renderList[i++];
                    var v = render.view;
                    var w = 0;
                    if (v) {
                        var size = void 0;
                        if (itemWidth) {
                            w = itemWidth;
                        }
                        else {
                            size = this.getSize(v);
                            w = size.width;
                        }
                        var vh = void 0;
                        if (itemHeight) {
                            vh = itemHeight;
                        }
                        else {
                            if (!size) {
                                size = this.getSize(v);
                            }
                            vh = size.height;
                        }
                        v.x = ox;
                        v.y = oy;
                        var rright = v.x + w;
                        if (maxWidth < rright) {
                            maxWidth = rright;
                        }
                        if (lineMaxHeight < vh) {
                            lineMaxHeight = vh;
                        }
                    }
                    ox += _hgap + w;
                }
                var mh = oy + lineMaxHeight;
                if (maxHeight < mh) {
                    maxHeight = mh;
                }
                if (i > end) {
                    break;
                }
                ox = 0;
                //偏移量，优先使用itemHeight
                oy += _vgap + (itemHeight || lineMaxHeight);
            }
            if (maxWidth != this._w || maxHeight != this._h) {
                this._w = maxWidth;
                this._h = maxHeight;
                var bg = this.bg;
                bg.width = maxWidth;
                bg.height = maxHeight;
                this.dispatch(-1999 /* Resize */);
            }
        };
        PageList.prototype.$setSelectedIndex = function (value) {
            if (!this._data) {
                this._waitForSetIndex = true;
                return;
            }
            var render;
            var renderList = this._list;
            var len_1 = renderList.length - 1;
            if (value > len_1) { //一般PageList控件，索引超过长度，取最后一个
                value = len_1;
            }
            render = this._list[value];
            this.changeRender(render, value);
            var view = render.view;
            if (view && view.stage) {
                this._waitForSetIndex = false;
                this.moveScroll(render);
            }
            else {
                this._waitForSetIndex = true;
            }
            if (this._waitForSetIndex) {
                this.moveScroll(render);
                //假如列表里有30个项，选中第20个，所以前20个都没有渲染，这边自己设置的rect，并不能引发scroller抛CHANGE事件
                //所以自己抛一下
                //如果已经渲染过，可不用抛
                // this.dispatchEventWith(EventConst.SCROLL_POSITION_CHANGE);
            }
        };
        PageList.prototype.moveScroll = function (render) {
            var con = this._con;
            var rect = con.scrollRect;
            if (!rect)
                return;
            var v = render.view;
            if (!v) {
                if (true) {
                    jy.ThrowError("render[" + egret.getQualifiedClassName(render) + "]\u6CA1\u6709renderView");
                }
                return;
            }
            var oldPos, endPos, max;
            if (this.scrollType == 0 /* Vertical */) {
                oldPos = rect.y;
                var d = this.itemHeight;
                if (!d) {
                    d = this.getSize(v).height;
                }
                endPos = v.y + d;
                max = this._h;
            }
            else {
                oldPos = rect.x;
                var d = this.itemWidth;
                if (!d) {
                    d = this.getSize(v).width;
                }
                endPos = v.x + d;
                max = this._w;
            }
            if (endPos > max) {
                endPos = max;
            }
            if (rect) {
                if (this.scrollType == 0 /* Vertical */) {
                    endPos = endPos - rect.height;
                }
                else {
                    endPos = endPos - rect.width;
                }
                if (endPos < 0) {
                    endPos = 0;
                }
            }
            var scroller = this.scroller;
            if (scroller) {
                scroller.stopTouchTween();
            }
            jy.Global.removeTweens(this);
            if (this.useTweenIndex) {
                this.useTweenIndex = false;
                var result = this.scrollType == 1 /* Horizon */ ? { tweenX: endPos } : { tweenY: endPos };
                var tween = jy.Global.getTween(this).to(result, 500, jy.Ease.quadOut);
                if (scroller) {
                    scroller.showBar();
                    tween.call(scroller.hideBar, scroller);
                }
            }
            else {
                if (scroller) {
                    scroller.doMoveScrollBar(oldPos - endPos);
                }
                if (this.scrollType == 0 /* Vertical */) {
                    rect.y = endPos;
                }
                else {
                    rect.x = endPos;
                }
                con.scrollRect = rect;
            }
        };
        Object.defineProperty(PageList.prototype, "tweenX", {
            get: function () {
                var rect = this._con.scrollRect;
                return rect ? rect.x : 0;
            },
            set: function (value) {
                var con = this._con;
                var rect = con.scrollRect || new egret.Rectangle(NaN);
                if (value != rect.x) {
                    var delta = value - rect.x;
                    rect.x = value;
                    var scroller = this.scroller;
                    if (scroller) {
                        scroller.doMoveScrollBar(delta);
                    }
                    con.scrollRect = rect;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageList.prototype, "tweenY", {
            get: function () {
                var rect = this._con.scrollRect;
                return rect ? rect.y : 0;
            },
            set: function (value) {
                var con = this._con;
                var rect = con.scrollRect || new egret.Rectangle(0, NaN);
                if (value != rect.y) {
                    var delta = value - rect.y;
                    rect.y = value;
                    var scroller = this.scroller;
                    if (scroller) {
                        scroller.doMoveScrollBar(delta);
                    }
                    con.scrollRect = rect;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 滚动到指定index
         */
        PageList.prototype.tweenToIndex = function (index) {
            this.useTweenIndex = true;
            this.selectedIndex = index;
        };
        PageList.prototype.selectItemByData = function (key, value, useTween) {
            if (useTween === void 0) { useTween = false; }
            var data = this._data;
            var len = data && data.length || 0;
            for (var i = 0; i < len; i++) {
                if (key in data[i]) {
                    if (data[i][key] == value) {
                        if (useTween) {
                            this.tweenToIndex(i);
                        }
                        else {
                            this.selectedIndex = i;
                        }
                        break;
                    }
                }
            }
            return this;
        };
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        PageList.prototype.updateByIdx = function (index, data) {
            var item = this.getItemAt(index);
            if (item) {
                this._data[index] = data;
                this.doRender(index);
            }
            return this;
        };
        PageList.prototype.removeAt = function (idx) {
            idx = idx >>> 0;
            var list = this._list;
            if (idx < list.length) {
                var item = list[idx];
                list.splice(idx, 1);
                this._data.splice(idx, 1);
                this._removeRender(item);
            }
        };
        PageList.prototype.removeItem = function (item) {
            var index = this._list.indexOf(item);
            if (index != -1) {
                this.removeAt(index);
            }
        };
        PageList.prototype._removeRender = function (item) {
            item.data = undefined;
            jy.removeDisplay(item.view);
            item.off(-1999 /* Resize */, this.onSizeChange, this);
            item.off(-1001 /* ITEM_TOUCH_TAP */, this.onTouchItem, this);
            item.dispose();
            if (!this.renderChange) {
                this.renderChange = true;
                this.once("enterFrame" /* ENTER_FRAME */, this.refreshByRemoveItem, this);
            }
        };
        PageList.prototype.refreshByRemoveItem = function () {
            if (!this.renderChange) {
                return;
            }
            this.renderChange = false;
            this._sizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        };
        /**
         * 销毁
         *
         */
        PageList.prototype.dispose = function () {
            this.clear();
        };
        /**
         * 清理
         *
         */
        PageList.prototype.clear = function () {
            this._con.graphics.clear();
            this._selectedIndex = -1;
            this._data = undefined;
            var list = this._list;
            for (var i = 0; i < list.length; i++) {
                this._removeRender(list[i]);
            }
            list.length = 0;
            this._selectedItem = undefined;
            this._waitForSetIndex = false;
            this._w = 0;
            this._h = 0;
            return this;
        };
        Object.defineProperty(PageList.prototype, "showStart", {
            /**
             * 在舞台之上的起始索引
             *
             * @readonly
             */
            get: function () {
                return this._showStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageList.prototype, "showEnd", {
            /**
             * 在舞台之上的结束索引
             *
             * @readonly
             */
            get: function () {
                return this._showEnd;
            },
            enumerable: true,
            configurable: true
        });
        PageList.prototype.checkViewRect = function () {
            var _con = this._con;
            var rect = _con.scrollRect;
            var list = this._list;
            var len = list.length;
            var len_1 = len - 1;
            if (!rect) {
                // 应该为全部添加到舞台
                for (var i = 0; i < len; i++) {
                    var render = list[i];
                    var v = render.view;
                    if (v) {
                        _con.addChild(v);
                    }
                }
                this._showStart = 0;
                this._showEnd = len - 1;
                return;
            }
            //设置rect时，检查哪些Render应该在舞台上
            var lastRect = this._lastRect;
            var checkStart, inc;
            if (lastRect) {
                //检查滚动方向
                var key1 = "x" /* X */, key2 = "width" /* Width */;
                if (this.scrollType == 0 /* Vertical */) {
                    key1 = "y" /* Y */;
                    key2 = "height" /* Height */;
                }
                var delta = rect[key1] - lastRect[key1];
                if (delta == 0 && rect[key2] == lastRect[key2]) { //没有任何变化
                    if (!this.rawDataChanged) {
                        return;
                    }
                }
                var showStart = this._showStart;
                var showEnd = this._showEnd;
                //先全部从舞台移除
                for (var i = showStart; i <= showEnd; i++) {
                    var render = list[i];
                    if (render) {
                        jy.removeDisplay(render.view);
                    }
                }
                if (delta > 0) { //向大的检查
                    checkStart = showStart;
                    inc = true;
                }
                else {
                    checkStart = showEnd;
                    inc = false;
                }
                lastRect[key1] = rect[key1];
                lastRect[key2] = rect[key2];
            }
            else {
                if (!len) {
                    return;
                }
                lastRect = rect.clone();
                this._lastRect = lastRect;
                checkStart = 0;
                inc = true;
            }
            var first, last, fIdx, lIdx;
            var tmp = jy.Temp.SharedArray3;
            var tmpRect = jy.Temp.SharedRect1;
            var staticSize = this.staticSize;
            tmp.length = 0;
            if (inc) {
                fIdx = 0;
                lIdx = len_1;
                /**
                 *
                 *
                 *   ├────────┤
                 *   │render0 │                         以前和scrollRect相交的render0，现在不再相交，从舞台移除
                 *  ┌├────────┤┐───
                 *  ││render1 ││ ↑ scrollRect           以前和scrollRect相交的render1，现在还相交
                 *  │├────────┤│ ↓
                 *  └│render2 │┘───                     以前不和scrollRect相交的render2，现在相交
                 *   ├────────┤
                 *
                 *  需要从起始点开始找，找到第一个和当前rect相交的render
                 *  直到找到最后一个和rect相交的render，再往后则无需检测
                 */
                for (var i = checkStart; i < len; i++) {
                    if (check(i, this)) {
                        break;
                    }
                }
                for (var i = 0, tlen = tmp.length; i < tlen; i++) {
                    var v = tmp[i];
                    _con.addChild(v);
                }
                this._showStart = fIdx;
                this._showEnd = lIdx;
            }
            else {
                fIdx = len_1;
                lIdx = 0;
                for (var i = checkStart; i >= 0; i--) {
                    if (check(i, this)) {
                        break;
                    }
                }
                for (var i = tmp.length - 1; i >= 0; i--) {
                    var v = tmp[i];
                    _con.addChild(v);
                }
                this._showStart = lIdx;
                this._showEnd = fIdx;
            }
            tmp.length = 0;
            return;
            function check(i, d) {
                var render = list[i];
                var v = render.view;
                if (v) {
                    var rec = void 0;
                    if (staticSize) {
                        rec = tmpRect;
                        rec.x = v.x;
                        rec.y = v.y;
                        var suiRect = v.suiRawRect;
                        rec.width = d.itemWidth || suiRect.width;
                        rec.height = d.itemHeight || suiRect.height;
                    }
                    else {
                        rec = v;
                    }
                    if (jy.intersects(rec, rect)) {
                        if (!first) {
                            first = render;
                            fIdx = i;
                        }
                        tmp.push(v);
                    }
                    else {
                        if (first) {
                            last = render;
                            lIdx = i;
                            if (staticSize) { //固定大小的允许 return，非固定大小的遍历全部数据
                                return true;
                            }
                        }
                    }
                }
            }
        };
        return PageList;
    }(jy.AbsPageList));
    jy.PageList = PageList;
    __reflect(PageList.prototype, "jy.PageList");
    var define = {
        set: function (rect) {
            egret.DisplayObject.prototype.$setScrollRect.call(this, rect);
            this.$_page.checkViewRect();
        },
        get: function () {
            return this.$scrollRect;
        },
        configurable: true
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 图片字字库
     * Key为图片文字文件名（不带扩展名）
     * Value为egret.Texture
     *
     * @export
     * @class ArtWord
     * @author 3tion
     */
    var ArtWord = /** @class */ (function () {
        function ArtWord(name) {
            this._txs = {};
            this.name = name;
        }
        /**
         * 获取纹理数据
         *
         * @param {Key} key
         * @returns
         *
         * @memberOf ArtWord
         */
        ArtWord.prototype.getTexture = function (key) {
            return this._txs[key];
        };
        ArtWord.prototype.parseData = function (data, suiData) {
            this._suiData = suiData;
            // const imgs = suiData.pngtexs;
            var txs = this._txs;
            for (var i = 0, len = data.length; i < len; i++) {
                var dat = data[i];
                var key = dat[0];
                txs[key] = suiData.getTexture(dat[1]); //imgs[dat[1]];
            }
            jy.refreshTexs(suiData, this);
        };
        return ArtWord;
    }());
    jy.ArtWord = ArtWord;
    __reflect(ArtWord.prototype, "jy.ArtWord");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var TouchEvent = egret.TouchEvent;
    var Event = egret.Event;
    var key = "$__$Drag";
    function dispatchTouchEvent(target, type, e, deltaX, deltaY, deltaTime) {
        if (!target.hasListen(type)) {
            return true;
        }
        var event = Event.create(TouchEvent, type, true, true);
        event.$initTo(e.stageX, e.stageY, e.touchPointID);
        event.touchDown = e.touchDown;
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaTime = deltaTime;
        var result = target.dispatchEvent(event);
        Event.release(event);
        event.deltaX = undefined;
        event.deltaY = undefined;
        event.deltaTime = undefined;
        return result;
    }
    var stage;
    function onStart(e) {
        this.lt = Date.now();
        this.lx = e.stageX;
        this.ly = e.stageY;
        stage.on("touchMove" /* TOUCH_MOVE */, onMove, this);
        stage.on("touchEnd" /* TOUCH_END */, onEnd, this);
    }
    function onMove(e) {
        if (!e.touchDown) {
            return onEnd.call(this, e);
        }
        var nx = e.stageX;
        var ny = e.stageY;
        var dx = nx - this.lx;
        var dy = ny - this.ly;
        var now = Date.now();
        var delta = now - this.lt;
        var _a = this, dragStart = _a.dragStart, host = _a.host;
        if (dragStart) {
            if (this.isCon) {
                host.touchChildren = false;
            }
            dispatchTouchEvent(host, -1089 /* DragMove */, e, dx, dy, delta);
        }
        else {
            if (delta > this.minDragTime) {
                dragStart = true;
            }
            else {
                var dist = dx * dx + dy * dy;
                if (dist > this.minSqDist) {
                    dragStart = true;
                }
            }
            if (dragStart) {
                dispatchTouchEvent(host, -1090 /* DragStart */, e, dx, dy, delta);
            }
            this.dragStart = dragStart;
        }
        if (dragStart) {
            this.lx = nx;
            this.ly = ny;
            this.lt = now;
        }
    }
    function onEnd(e) {
        if (this.dragStart) {
            e.preventDefault(); //阻止普通点击事件发生
            e.stopImmediatePropagation();
            var host = this.host;
            if (this.isCon) {
                host.touchChildren = true;
            }
            dispatchTouchEvent(host, -1088 /* DragEnd */, e);
        }
        this.dragStart = false;
        stage.off("touchMove" /* TOUCH_MOVE */, onMove, this);
        stage.off("touchEnd" /* TOUCH_END */, onEnd, this);
    }
    /**
     *
     * @param {egret.DisplayObject} host 要被拖拽的对象
     * @param {boolean} [stopChildren=true] 是否屏蔽子控件的
     * @param {number} [minDragTime=300] 最小拖拽事件
     * @param {number} [minSqDist=400] 最小
     */
    function bindDrag(host, stopChildren, minDragTime, minSqDist) {
        if (stopChildren === void 0) { stopChildren = true; }
        if (minDragTime === void 0) { minDragTime = 300; }
        if (minSqDist === void 0) { minSqDist = 400; }
        stage = stage || egret.sys.$TempStage;
        var isCon = stopChildren && host instanceof egret.DisplayObjectContainer;
        host.touchEnabled = true;
        var dele = { host: host, isCon: isCon, minDragTime: minDragTime, minSqDist: minSqDist };
        host.on("touchBegin" /* TOUCH_BEGIN */, onStart, dele);
        host[key] = dele;
    }
    jy.bindDrag = bindDrag;
    function looseDrag(host) {
        var dele = host[key];
        if (dele) {
            stage.off("touchMove" /* TOUCH_MOVE */, onMove, dele);
            stage.off("touchEnd" /* TOUCH_END */, onEnd, dele);
            dele.host.off("touchBegin" /* TOUCH_BEGIN */, onStart, dele);
            if (dele.isCon) {
                host.touchChildren = true;
            }
            delete host[key];
        }
    }
    jy.looseDrag = looseDrag;
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     * 用于处理SuiData中的纹理加载
     * @export
     * @class SuiBmd
     * @author gushuai
     */
    var SuiBmd = /** @class */ (function () {
        function SuiBmd(uri, url) {
            this.textures = [];
            this.bmdState = 0 /* UNREQUEST */;
            /**
             * 使用计数
             */
            this.using = 0;
            this.lastUseTime = 0;
            /**
             * 未加载的时候，请求的位图
             */
            this.loading = [];
            this.uri = uri;
            this.url = url;
        }
        Object.defineProperty(SuiBmd.prototype, "isStatic", {
            get: function () {
                return this.using > 0;
            },
            enumerable: true,
            configurable: true
        });
        SuiBmd.prototype.loadBmd = function () {
            if (this.bmdState <= 0 /* UNREQUEST */) {
                jy.Res.load(this.uri, this.url, jy.CallbackInfo.get(this.checkBitmap, this));
                this.bmdState = 1 /* REQUESTING */;
            }
        };
        SuiBmd.prototype.checkBitmap = function (item) {
            var uri = item.uri, data = item.data;
            if (this.uri == uri) {
                if (!data) {
                    jy.dispatch(-1070 /* SuiBmdLoadFailed */, this.uri);
                    if (true) {
                        data = ErrorTexture;
                    }
                    else {
                        return;
                    }
                }
                var bmd = data.bitmapData;
                var imgs = this.textures;
                this.bmd = bmd;
                for (var _i = 0, imgs_1 = imgs; _i < imgs_1.length; _i++) {
                    var tex = imgs_1[_i];
                    tex.$bitmapData = bmd;
                }
                var loading = this.loading;
                if (loading) {
                    //将绑定的位图，全部重新设置一次
                    for (var _a = 0, loading_1 = loading; _a < loading_1.length; _a++) {
                        var bmp = loading_1[_a];
                        bmp.refreshBMD();
                    }
                    loading.length = 0;
                }
                this.bmdState = 2 /* COMPLETE */;
            }
        };
        SuiBmd.prototype.dispose = function () {
            var bmd = this.bmd;
            this.bmdState = 0 /* UNREQUEST */;
            if (bmd) {
                bmd.$dispose();
                this.bmd = undefined;
                jy.Res.remove(this.uri);
            }
        };
        return SuiBmd;
    }());
    jy.SuiBmd = SuiBmd;
    __reflect(SuiBmd.prototype, "jy.SuiBmd", ["jy.IResource"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 用于加载和存储fla导出的ui数据和位图
     * @author 3tion
     *
     */
    var SuiData = /** @class */ (function () {
        function SuiData(key) {
            /**
             * 数据加载状态
             * 0 未加载
             * 1 加载中
             * 2 数据加载完成
             */
            this.state = 0 /* UNREQUEST */;
            /**
             * 库数据
             * key      fla中设置的导出名<br/>
             * value    皮肤数据<br/>
             */
            this.lib = {};
            this.key = key;
            this.url = jy.ConfigUtils.getSkinFile(key, "s.json" /* DataFile */);
            this.uri = jy.getSuiDataUri(key);
        }
        SuiData.prototype.createBmpLoader = function (ispng, textures) {
            var file = "d" + (ispng ? ".png" /* PNG */ : ".jpg" /* JPG */);
            //增加一个skin前缀
            var uri = this.skinUri || "skin/" + jy.ConfigUtils.getSkinPath(this.key, file);
            var tmp = jy.ResManager.get(uri, this.noRes, this, uri, file, textures);
            ispng ? this.pngbmd = tmp : this.jpgbmd = tmp;
        };
        SuiData.prototype.noRes = function (uri, file, textures) {
            var url = jy.ConfigUtils.getSkinFile(this.key, file) + jy.Global.webp;
            var tmp = new jy.SuiBmd(uri, url);
            tmp.textures = textures;
            return tmp;
        };
        /**
         * 刷新位图
         *
         * @param {SuiBmdCallback} bmp  要刷新的位图
         * @param {boolean} [isjpg]     是否为jpg纹理，默认为png
         */
        SuiData.prototype.checkRefreshBmp = function (bmp, isjpg) {
            var tmp = isjpg ? this.jpgbmd : this.pngbmd;
            if (tmp) {
                tmp.using++;
                if (tmp.bmdState == 2 /* COMPLETE */) {
                    if (bmp.refreshBMD) {
                        bmp.refreshBMD();
                    }
                    return true;
                }
                else {
                    tmp.loading.pushOnce(bmp);
                    tmp.loadBmd();
                    return false;
                }
            }
        };
        /**获取对应索引位置的texture */
        SuiData.prototype.getTexture = function (index) {
            var inx = index;
            var bmd = this.pngbmd;
            if (index < 0) {
                inx = -1 - index;
                bmd = this.jpgbmd;
            }
            var txts = bmd.textures;
            if (txts) {
                return txts[inx];
            }
        };
        SuiData.prototype.loadBmd = function (callback) {
            var bin = jy.recyclable(CallbackBin);
            var count = 0;
            //检查bmd状态
            this.jpgbmd && !this.checkRefreshBmp(bin, true) && count++;
            this.pngbmd && !this.checkRefreshBmp(bin) && count++;
            if (count) {
                bin.count = count;
                bin.callback = callback;
            }
            else {
                bin.recycle();
                callback && callback.execute(true);
            }
        };
        return SuiData;
    }());
    jy.SuiData = SuiData;
    __reflect(SuiData.prototype, "jy.SuiData");
    var CallbackBin = /** @class */ (function () {
        function CallbackBin() {
        }
        CallbackBin.prototype.refreshBMD = function () {
            var count = this.count;
            if (!--count) {
                var callback = this.callback;
                if (callback) {
                    this.callback = undefined;
                    callback.execute(true);
                }
            }
            else {
                this.count = count;
            }
        };
        return CallbackBin;
    }());
    __reflect(CallbackBin.prototype, "CallbackBin");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var Texture = egret.Texture;
    function getSuiDataUri(key) {
        return "$SuiData$_" + key;
    }
    jy.getSuiDataUri = getSuiDataUri;
    /**
     * 用于管理位图和数据
     * @author 3tion
     *
     */
    var SuiResManager = /** @class */ (function () {
        function SuiResManager() {
            this._suiDatas = {};
            this._urlKey = {};
            this.initInlineCreators();
            // ResourceManager.addChecker(this);
        }
        SuiResManager.prototype.initInlineCreators = function () {
            var _a;
            this._creators = (_a = {},
                _a[3 /* Button */] = jy.ButtonCreator,
                _a[6 /* ShapeNumber */] = jy.ArtTextCreator,
                _a[5 /* ScaleBitmap */] = jy.ScaleBitmapCreator,
                _a[7 /* NumericStepper */] = jy.NumericStepperCreator,
                _a[8 /* Slider */] = jy.SliderCreator,
                _a[9 /* ScrollBar */] = jy.ScrollBarCreator,
                _a[10 /* ProgressBar */] = jy.ProgressBarCreator,
                _a[11 /* SlotBg */] = jy.ScaleBitmapCreator,
                _a[12 /* ShareBmp */] = jy.ShareBitmapCreator,
                _a[13 /* Slot */] = jy.SlotCreator,
                _a[19 /* MovieClip */] = jy.MovieClipCreator,
                _a[20 /* MCButton */] = jy.MCButtonCreator,
                _a[21 /* MCProgress */] = jy.MCProgressCreator,
                _a);
            this.sharedTFCreator = new jy.TextFieldCreator();
        };
        SuiResManager.prototype.getData = function (key) {
            return this._suiDatas[key];
        };
        /**
         * 加载数据
         */
        SuiResManager.prototype.loadData = function (key, callback, qid) {
            var suiData = this._suiDatas[key];
            if (!suiData) {
                suiData = this.createSuiData(key);
            }
            var state = suiData.state;
            if (state == -1 /* FAILED */) {
                callback && callback.suiDataFailed(suiData);
            }
            else if (state == 2 /* COMPLETE */) {
                callback && callback.suiDataComplete(suiData);
            }
            else {
                var callbacks = suiData.callbacks;
                if (!callbacks) {
                    suiData.callbacks = callbacks = [];
                }
                callback && callbacks.pushOnce(callback);
                if (state == 0 /* UNREQUEST */) {
                    suiData.state = 1 /* REQUESTING */;
                    //先加载配置
                    jy.Res.load(suiData.uri, suiData.url, jy.CallbackInfo.get(this.checkData, this), qid);
                }
            }
        };
        /**
         * 数据加载完成
         */
        SuiResManager.prototype.checkData = function (item) {
            var uri = item.uri, data = item.data;
            var suiData = this._urlKey[uri];
            if (!data) { //加载失败
                suiData.state = 0 /* UNREQUEST */;
                var callbacks = suiData.callbacks;
                if (callbacks) {
                    for (var i = 0; i < callbacks.length; i++) {
                        var callback = callbacks[i];
                        callback.suiDataFailed(suiData);
                    }
                    delete suiData.callbacks;
                }
                return;
            }
            this._initSuiData(data, suiData);
        };
        /**
         *
         * 直接将已经加载好的内置数据，和key进行绑定
         * @param {string} key
         * @param {any} data
         * @param {string} [skinUri] 皮肤标识
         */
        SuiResManager.prototype.setInlineData = function (key, data, skinUri) {
            var uri = getSuiDataUri(key);
            var suiData = this._urlKey[uri];
            if (!suiData) {
                suiData = this.createSuiData(key);
            }
            suiData.skinUri = skinUri;
            this._initSuiData(data, suiData);
        };
        SuiResManager.prototype.createSuiData = function (key) {
            var suiData = new jy.SuiData(key);
            this._suiDatas[key] = suiData;
            this._urlKey[suiData.uri] = suiData;
            return suiData;
        };
        /**
         *
         * 初始化数据
         * @private
         * @param {*} data
         * @param {SuiData} suiData
         */
        SuiResManager.prototype._initSuiData = function (data, suiData) {
            //  data的数据结构：
            //  lib[
            //     [ //图片
            // 		[128,32,12,33],//图片1   索引0
            //        [224,210,33,66],//图片2  索引1
            //         ......
            //        [48,62,133,400],//图片21 索引20
            //      ],{
            //        "btn":[ //按钮类型/页签/单选框/多选框 3帧或者4帧  0弹起 1选中 2禁用(未选中的样子) 3禁用(选中)
            //             //存放导出名字,
            //           ["ui.btn.Button1", //索引0
            //             "ui.tab.Tab1"],   //索引1
            // 			//存放数据
            //             [{...},
            //             {...}]
            //        ],
            //        "scroll":[//滚动条 track bar
            // 		],
            //        "progress":[//进度条
            //        ]
            //        },{
            //          "panel":[
            //    
            //          ]
            //        }
            //     ]
            //解析img节点
            var pngs = data[0];
            if (pngs) {
                this.parseTextureData(pngs, suiData, true);
            }
            var jpgs = data[2];
            if (jpgs) {
                this.parseTextureData(jpgs, suiData);
            }
            //处理控件
            this.parseComponentData(data[1], suiData);
            var panelsData;
            var panelNames = data[4];
            if (panelNames) {
                var list = data[3];
                panelsData = {};
                for (var i = 0; i < list.length; i++) {
                    var pdata = list[i];
                    var className = panelNames[pdata[0]];
                    panelsData[className] = pdata.slice(1);
                }
                suiData.panelNames = panelNames;
            }
            else { //未来版本将不再支持此方案
                panelsData = data[3];
            }
            if (panelsData) {
                suiData.panelsData = panelsData;
            }
            //数据已经完成，未加载位图
            suiData.state = 2 /* COMPLETE */;
            var callbacks = suiData.callbacks;
            if (callbacks) {
                for (var i = 0; i < callbacks.length; i++) {
                    var callback = callbacks[i];
                    callback.suiDataComplete(suiData);
                }
                delete suiData.callbacks;
            }
        };
        /**
         * 处理控件数据
         */
        SuiResManager.prototype.parseComponentData = function (allComData, suiData) {
            suiData.sourceComponentData = allComData;
            for (var type in allComData) {
                var comsData = allComData[type];
                var nameData = comsData[0]; //["ui.btn.Button1", "ui.tab.Tab1"] 
                var comData = comsData[1]; //[{...},{...}]//组件的数据
                var sizeData = comsData[2];
                var len = nameData.length;
                if (type == 15 /* ArtWord */) { //字库数据特殊处理
                    var fonts = suiData.fonts;
                    for (var i = 0; i < len; i++) {
                        var linkName = nameData[i];
                        var dat = comData[i];
                        var fontLib = new jy.ArtWord(linkName);
                        fontLib.parseData(dat, suiData);
                        if (!fonts) {
                            suiData.fonts = fonts = {};
                        }
                        fonts[linkName] = fontLib;
                    }
                }
                else {
                    var ref = this._creators[type];
                    if (ref) {
                        var lib = suiData.lib;
                        for (var i = 0; i < len; i++) {
                            var name_9 = nameData[i];
                            var dat = comData[i];
                            var creator = new ref;
                            creator.parseData(null, suiData);
                            if (dat) {
                                creator.parseSelfData(dat);
                                creator.parseSize(sizeData[i]);
                            }
                            lib[name_9] = creator;
                        }
                    }
                }
            }
        };
        /**
         * 解析图片数据
         *  0 图片宽  1图片高度   2偏移X   3偏移Y
         */
        SuiResManager.prototype.parseTextureData = function (data, suiData, ispng) {
            if (data) {
                var imgs = [];
                var bcs = suiData.bmplibs;
                if (!bcs) {
                    suiData.bmplibs = bcs = {};
                }
                suiData.createBmpLoader(ispng, imgs);
                for (var i = 0, len = data.length; i < len; i++) {
                    var imgData = data[i];
                    var tex = new Texture();
                    var width = imgData[0];
                    var height = imgData[1];
                    var sx = imgData[2];
                    var sy = imgData[3];
                    tex.$initData(sx, sy, width, height, 0, 0, width, height, width, height);
                    imgs[i] = tex;
                    var bc = new jy.BitmapCreator(suiData);
                    var idx = ispng ? i : -1 - i;
                    bc.parseSelfData(idx);
                    bcs[idx] = bc;
                }
            }
        };
        /**
         * 创建可视控件
         * @param uri           皮肤标识
         * @param className     类名字
         * @param baseData      基础数据
         */
        SuiResManager.prototype.createDisplayObject = function (uri, className, baseData) {
            var suiData = this._suiDatas[uri];
            if (suiData) {
                var creator = suiData.lib[className];
                if (creator) {
                    creator.setBaseData(baseData);
                    var disp = creator.get();
                    disp.suiClass = className;
                    disp.suiLib = uri;
                    return disp;
                }
                else if (true) {
                    jy.ThrowError("\u6CA1\u6709\u5728[" + suiData.key + "]\u627E\u5230\u5BF9\u5E94\u7EC4\u4EF6[" + className + "]");
                }
            }
            // //[3,["btn2",14.5,139,79,28,0],0,0]
            // return;
        };
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
        SuiResManager.prototype.createElement = function (uri, data) {
            var suiData = typeof uri === "string" ? this._suiDatas[uri] : uri;
            if (suiData) {
                var cRef = this._creators[+data[0]];
                if (cRef) {
                    var creator = new cRef();
                    creator.parseData(data, suiData);
                    var dis = creator.get();
                    dis.suiLib = suiData.key;
                    return dis;
                }
                else if (true) {
                    jy.ThrowError("createElement\u65F6\uFF0C\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7EC4\u4EF6\uFF0C\u7D22\u5F15\uFF1A[" + +data[0] + "]");
                }
            }
        };
        /**
         * 创建位图对象
         * @param uri       皮肤标识
         * @param index     位图索引 data[2]
         * @param baseData  基础数据 data[1]
         */
        SuiResManager.prototype.createBitmap = function (uri, index, baseData) {
            var suiData = this._suiDatas[uri];
            if (suiData) {
                var bcs = suiData.bmplibs;
                var bc = bcs[index];
                if (bc) {
                    bc.setBaseData(baseData);
                    return bc.get();
                }
            }
        };
        /**
         * 获取美术字
         *
         * @param {string} uri          皮肤标识
         * @param {string} artword      美术字
         * @returns
         *
         * @memberOf SuiResManager
         */
        SuiResManager.prototype.getArtWord = function (uri, artword) {
            var suiData = this._suiDatas[uri];
            if (suiData) {
                var fonts = suiData.fonts;
                if (fonts) {
                    return fonts[artword];
                }
            }
        };
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
        SuiResManager.prototype.getArtWordTexture = function (uri, artword, font) {
            var fonts = this.getArtWord(uri, artword);
            if (fonts) {
                return fonts.getTexture(font);
            }
        };
        /**
         *  创建位图对象
         * @param uri       皮肤标识
         * @param data      JSON的数据
         */
        SuiResManager.prototype.createBitmapByData = function (uri, data) {
            return this.createBitmap(uri, data[2], data[1]);
        };
        /**
         * 创建文本框
         * @param uri       皮肤标识
         * @param data      私有数据 data[2]
         * @param baseData  基础数据 data[1]
         */
        SuiResManager.prototype.createTextField = function (uri, data, baseData) {
            var tfCreator = this.sharedTFCreator;
            tfCreator.parseSelfData(data);
            tfCreator.setBaseData(baseData);
            return tfCreator.get();
        };
        /**
        *  创建文本框
        * @param uri       皮肤标识
        * @param data      JSON的数据
        */
        SuiResManager.prototype.createTextFieldByData = function (uri, data) {
            return this.createTextField(uri, data[2], data[1]);
        };
        SuiResManager.initBaseData = function (dis, data) {
            var name = data[0], x = data[1], y = data[2], w = data[3], h = data[4], rot = data[5], alpha = data[6], adjustColors = data[7];
            if (name) {
                dis.name = name;
            }
            dis.suiRawRect = new egret.Rectangle(x, y, w, h);
            if (Array.isArray(rot)) { //matrix
                var a = rot[0], b = rot[1], c = rot[2], d = rot[3];
                var matrix = dis.matrix;
                matrix.setTo(a, b, c, d, x, y);
                dis.$setMatrix(matrix, true);
            }
            else { //用于兼容之前的数据
                dis.width = w;
                dis.height = h;
                dis.x = x;
                dis.y = y;
                if (rot) {
                    dis.rotation = rot;
                }
            }
            if (alpha != undefined) {
                dis.alpha = alpha;
            }
            if (adjustColors) {
                dis.filters = [jy.FilterUtils.adjustColorFilter(adjustColors[0], adjustColors[1], adjustColors[2], adjustColors[3])];
            }
        };
        /**
         * 创建子控件
         *
         * @param {string} key
         * @param {string} className
         * @param {egret.DisplayObjectContainer} view
         */
        SuiResManager.prototype.createComponents = function (key, className, view) {
            var suiData = this._suiDatas[key];
            if (suiData) {
                var panelsData = suiData.panelsData;
                if (panelsData) {
                    var panelData = panelsData[className];
                    if (panelData) {
                        var sizeData = panelData[0], compsData = panelData[1];
                        view.suiRawRect = new egret.Rectangle(sizeData[0], sizeData[1], sizeData[2], sizeData[3]);
                        view.suiClass = className;
                        view.suiLib = key;
                        this._createComponents(suiData, view, compsData);
                    }
                }
            }
        };
        SuiResManager.prototype._createComponents = function (suiData, view, compsData) {
            if (!compsData) {
                return;
            }
            for (var i = 0; i < compsData.length; i++) {
                this.createComponent(compsData[i], suiData, view);
            }
        };
        SuiResManager.prototype.createComponent = function (data, suiData, view) {
            var ele;
            var baseData = data[1];
            var type = data[0];
            if (type == 14 /* Rectangle */) {
                ele = new egret.Rectangle(baseData[1], baseData[2], baseData[3], baseData[4]);
            }
            else {
                if (type == 2 /* Container */) {
                    ele = new egret.Sprite();
                    SuiResManager.initBaseData(ele, baseData);
                    this._createComponents(suiData, ele, data[2]);
                }
                else {
                    ele = this.getElement(suiData, data);
                }
                if (ele) {
                    view.addChild(ele);
                }
                else if (true) {
                    jy.ThrowError("\u6CA1\u6709\u6B63\u786E\u521B\u5EFA\u539F\u4EF6\uFF0C\u7C7B\u578B\uFF1A" + type + "\uFF0C\u6570\u636E\uFF1A" + JSON.stringify(data));
                }
            }
            var name = baseData[0];
            if (name) { //有些图片没有做实例引用，有名字的才进行赋值
                view[name] = ele;
            }
            return ele;
        };
        SuiResManager.prototype.getElement = function (suiData, data) {
            var type = data[0], bd = data[1], sd = data[2], lib = data[3];
            switch (type) {
                case 1 /* Text */:
                    var tc = new jy.TextFieldCreator();
                    tc.setBaseData(bd);
                    tc.parseSelfData(sd);
                    return tc.get();
                case 0 /* Image */:
                    var bg = new jy.BitmapCreator(suiData);
                    bg.parseData(data, suiData);
                    return bg.get();
                case 16 /* Sprite */:
                    var sp = new egret.Sprite();
                    SuiResManager.initBaseData(sp, bd);
                    return sp;
                case 17 /* ImageLoader */:
                    var il = new jy.Image();
                    SuiResManager.initBaseData(il, bd);
                    return il;
                default:
                    if (lib == undefined)
                        lib = 0;
                    var libKey = void 0;
                    switch (lib) {
                        case 0:
                            libKey = suiData.key;
                            break;
                        case 1:
                            libKey = "lib";
                            break;
                        default:
                            libKey = lib;
                            break;
                    }
                    if (type == 18 /* ExportedContainer */) {
                        var className = suiData.panelNames[~~sd];
                        var v = new jy.View(libKey, className);
                        SuiResManager.initBaseData(v, bd);
                        return v;
                    }
                    else {
                        if (typeof sd == "string" && type == 20 /* MCButton */) {
                            var v = this.createDisplayObject(libKey, sd, bd);
                            return new jy.MCButton(v);
                        }
                        var source = suiData.sourceComponentData;
                        if (source) {
                            var sourceData = source[type];
                            if (sourceData) { //有引用类型数据
                                var names = sourceData[0]; //名字列表
                                if (names) { //有引用名 
                                    var idx = sd;
                                    var name_10 = names[idx];
                                    if (name_10) {
                                        return this.createDisplayObject(libKey, name_10, bd);
                                    }
                                }
                            }
                        }
                        return this.createElement(libKey, data);
                    }
            }
        };
        /**
         * 获取控件尺寸
         *
         * @param {string} key
         * @param {string} className
         * @param {egret.Rectangle} [outRect]
         * @returns
         */
        SuiResManager.prototype.getSize = function (key, className, outRect) {
            var suiData = this._suiDatas[key];
            if (suiData) {
                var panelsData = suiData.panelsData;
                if (panelsData) {
                    var panelData = panelsData[className];
                    if (panelData) {
                        var sizeData = panelData[0];
                        outRect = outRect || new egret.Rectangle();
                        outRect.setTo(sizeData[0], sizeData[1], sizeData[2], sizeData[3]);
                        return outRect;
                    }
                }
            }
        };
        return SuiResManager;
    }());
    jy.SuiResManager = SuiResManager;
    __reflect(SuiResManager.prototype, "jy.SuiResManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 给ArtText和ArtWord刷新纹理使用
     *
     * @export
     * @param {SuiData} suiData
     * @param {{ refreshBMD?: { (): void } }} thisObj
     */
    function refreshTexs(suiData, thisObj) {
        var bmds = suiData.pngbmd;
        // let bmdState = bmds.bmdState;
        if (!("refreshBMD" in thisObj)) { //对thisObj附加refreshBMD方法
            thisObj.refreshBMD = function () {
                //刷新纹理中的数据
                var txs = this._txs;
                var bmd = bmds.bmd;
                for (var key in txs) {
                    txs[key]._bitmapData = bmd;
                }
            };
        }
        suiData.checkRefreshBmp(thisObj);
    }
    jy.refreshTexs = refreshTexs;
})(jy || (jy = {}));
var jy;
(function (jy) {
    var _a;
    var alignHandler = (_a = {},
        _a[4 /* TOP */] = function (bmp) {
            bmp.y = 0;
        },
        _a[8 /* MIDDLE */] = function (bmp, maxHeight) {
            bmp.y = maxHeight - bmp.height >> 1;
        },
        _a[12 /* BOTTOM */] = function (bmp, maxHeight) {
            bmp.y = maxHeight - bmp.height;
        },
        _a);
    /**
     * 艺术字
     */
    var ArtText = /** @class */ (function (_super) {
        __extends(ArtText, _super);
        function ArtText() {
            var _this = _super.call(this) || this;
            /**
             * 垂直对齐方式
             *
             * @private
             * @type {LayoutTypeVertical}
             */
            _this._align = 4 /* TOP */;
            _this.artwidth = 0;
            _this._maxHeight = 0;
            return _this;
        }
        ArtText.prototype.refreshBMD = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var bmp = _a[_i];
                bmp.refreshBMD();
            }
        };
        /**
         * 设置垂直对齐规则
         *
         * @param {LayoutTypeVertical} value
         */
        ArtText.prototype.setVerticalAlign = function (value) {
            if (this._align != value) {
                this._align = value;
            }
        };
        ArtText.prototype.$setValue = function (val) {
            if (this._value == val)
                return;
            if (val == undefined)
                val = "";
            this._value = val;
            var tempval = val + "";
            var len = tempval.length;
            var key;
            var txs = this.textures;
            var children = this.$children;
            var numChildren = this.numChildren;
            var bmp;
            var ox = 0;
            var hgap = this.hgap || 0;
            var _maxHeight = 0;
            for (var i = 0; i < len; i++) {
                key = tempval.charAt(i);
                if (i < numChildren) {
                    bmp = children[i];
                }
                else {
                    bmp = new egret.Bitmap();
                    this.addChild(bmp);
                }
                var tx = txs[key];
                if (!tx) {
                    if (true) {
                        jy.ThrowError("\u4F20\u5165\u4E86\u7EB9\u7406\u4E2D\u6CA1\u6709\u7684\u6570\u636E[" + key + "]");
                    }
                    continue;
                }
                if (tx.textureHeight > _maxHeight) {
                    _maxHeight = tx.textureHeight;
                }
                bmp.x = ox;
                bmp.texture = null;
                bmp.texture = tx;
                ox += tx.textureWidth + hgap;
            }
            this.artwidth = ox - hgap;
            for (i = numChildren - 1; i >= len; i--) {
                this.$doRemoveChild(i);
            }
            this._maxHeight = _maxHeight;
            this.checkAlign();
        };
        Object.defineProperty(ArtText.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                this.$setValue(val);
            },
            enumerable: true,
            configurable: true
        });
        ArtText.prototype.$getWidth = function () {
            return this.artwidth;
        };
        ArtText.prototype.checkAlign = function () {
            var children = this.$children;
            var _maxHeight = this._maxHeight;
            var handler = alignHandler[this._align];
            for (var i = 0; i < children.length; i++) {
                var bmp = children[i];
                handler(bmp, _maxHeight);
            }
        };
        ArtText.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            jy.removeDisplay(this);
        };
        return ArtText;
    }(jy.Component));
    jy.ArtText = ArtText;
    __reflect(ArtText.prototype, "jy.ArtText");
    /**
     *
     * @author gushuai
     *
     */
    var ArtTextCreator = /** @class */ (function (_super) {
        __extends(ArtTextCreator, _super);
        function ArtTextCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ArtTextCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            var splitStr = data[0];
            var len = splitStr.length;
            var suiData = this._suiData;
            // const imgs = suiData.pngtexs;
            var txs = {};
            for (var i = 0; i < len; i++) {
                var tx = suiData.getTexture(data[i + 1]); //imgs[data[i + 1]];
                var key = splitStr.charAt(i);
                txs[key] = tx;
            }
            this._txs = txs;
            jy.refreshTexs(suiData, this);
            this._createT = function () {
                var shape = new ArtText();
                _this.bindEvent(shape);
                shape.textures = txs;
                return shape;
            };
        };
        ArtTextCreator.prototype.bindEvent = function (bmp) {
            bmp.on("addedToStage" /* ADDED_TO_STAGE */, this.onAddedToStage, this);
            bmp.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.onRemoveFromStage, this);
        };
        ArtTextCreator.prototype.onAddedToStage = function (e) {
            var suiData = this._suiData;
            if (suiData) {
                var bmp = e.currentTarget;
                suiData.checkRefreshBmp(bmp);
            }
        };
        ArtTextCreator.prototype.onRemoveFromStage = function () {
            var suiData = this._suiData;
            if (suiData) {
                var bmd = suiData.pngbmd;
                bmd.using--;
                bmd.lastUseTime = jy.Global.now;
            }
        };
        return ArtTextCreator;
    }(jy.BaseCreator));
    jy.ArtTextCreator = ArtTextCreator;
    __reflect(ArtTextCreator.prototype, "jy.ArtTextCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     *
     * 新版使用MC的按钮，减少制作按钮的难度
     *
     *
     * @export
     * @class MCButton
     * @extends {Button}
     */
    var MCButton = /** @class */ (function (_super) {
        __extends(MCButton, _super);
        function MCButton(mc) {
            var _this = _super.call(this) || this;
            if (mc) {
                _this.setSkin(mc);
            }
            return _this;
        }
        MCButton.prototype.setSkin = function (mc) {
            //检查是否有文本框
            this.txtLabel = mc.tf;
            this.mc = mc;
            this.addChild(mc);
            this.refresh();
        };
        MCButton.prototype.refresh = function () {
            //停在指定帧
            var mc = this.mc;
            if (mc) {
                mc.stop(this.$getBtnFrame());
            }
        };
        MCButton.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            var mc = this.mc;
            if (mc) {
                mc.dispose();
            }
        };
        return MCButton;
    }(jy.Button));
    jy.MCButton = MCButton;
    __reflect(MCButton.prototype, "jy.MCButton");
    MCButton.prototype.addChild = jy.Component.prototype.addChild;
    /**
     * MC按钮创建器
     *
     * @export
     * @class MCButtonCreator
     * @extends {BaseCreator<MCButton>}
     */
    var MCButtonCreator = /** @class */ (function (_super) {
        __extends(MCButtonCreator, _super);
        function MCButtonCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MCButtonCreator.prototype.parseSelfData = function (data) {
            var suiData = this._suiData;
            var framesData = jy.MovieClipCreator.prototype.$getFramesData(data);
            this._createT = function () { return new MCButton(new jy.MovieClip(data, framesData, suiData)); };
        };
        return MCButtonCreator;
    }(jy.BaseCreator));
    jy.MCButtonCreator = MCButtonCreator;
    __reflect(MCButtonCreator.prototype, "jy.MCButtonCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var MovieClip = /** @class */ (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data, framesData, suiData) {
            var _this = _super.call(this) || this;
            /**
             * 是否循环
             * 默认循环播放
             */
            _this.loop = true;
            /**
             * 每帧播放时长
             *
             * @type {number}
             */
            _this.timePerFrame = 100;
            _this.suiData = suiData;
            var compsData = data[0];
            /**
             * 组件字典
             */
            var comps;
            if (compsData) {
                var sm = jy.singleton(jy.SuiResManager);
                comps = [];
                for (var i = 0; i < compsData.length; i++) {
                    var dis = sm.createComponent(compsData[i], suiData, _this);
                    if (dis instanceof egret.DisplayObject) {
                        comps[i] = dis;
                    }
                }
            }
            else {
                comps = jy.Temp.EmptyArray;
            }
            _this.compData = comps;
            _this.framesData = framesData;
            _this.totalFrame = framesData.length;
            _this.stop(0);
            return _this;
        }
        /**
         * 停在某一帧或当前帧
         * 索引从0开始
         * @param {number} [frame]
         */
        MovieClip.prototype.stop = function (frame) {
            var cf = this.validateFrame(this.getFrame(frame));
            this.playing = false;
            this.render(cf);
            this.currentFrame = cf;
            this.off("enterFrame" /* ENTER_FRAME */, this.doRender, this);
        };
        MovieClip.prototype.play = function (frame) {
            this.currentFrame = this.getFrame(frame);
            this.playing = true;
            this._nt = jy.Global.now + this.timePerFrame;
            this.on("enterFrame" /* ENTER_FRAME */, this.doRender, this);
        };
        MovieClip.prototype.doRender = function () {
            var now = jy.Global.now;
            var nt = this._nt;
            if (nt < now) {
                var cf = this.currentFrame;
                var timePerFrame = this.timePerFrame;
                //需要增加的帧数
                var delta = (now - nt) / timePerFrame | 0;
                cf = this.validateFrame(cf + 1 + delta);
                this.render(cf);
                this.currentFrame = cf;
                this._nt = nt + (delta + 1) * timePerFrame;
            }
        };
        MovieClip.prototype.validateFrame = function (cf) {
            var totalFrame = this.totalFrame;
            if (cf >= totalFrame) {
                if (this.loop) {
                    cf = cf % totalFrame;
                }
                else {
                    //只到最后一帧
                    cf = totalFrame - 1;
                }
            }
            return cf;
        };
        MovieClip.prototype.getFrame = function (frame) {
            return frame == undefined ? this.currentFrame : frame;
        };
        MovieClip.prototype.render = function (frame) {
            var frameData = this.framesData[frame];
            if (frameData && frameData.key != this.currentFrame) { //当前帧是否和要渲染的关键帧相同
                var dict = this.compData;
                var sm = jy.singleton(jy.SuiResManager);
                var tc = sm.sharedTFCreator;
                var suiData = this.suiData;
                //清理子对象
                this.removeChildren();
                for (var _i = 0, _a = frameData.data; _i < _a.length; _i++) {
                    var dat = _a[_i];
                    var idx = void 0, pData = void 0, comp = void 0, textData = void 0;
                    if (Array.isArray(dat)) {
                        idx = dat[0];
                        pData = dat[1];
                        textData = dat[2];
                    }
                    else {
                        idx = dat;
                    }
                    if (idx == -1) { //-1的一定有pData
                        comp = sm.createComponent(pData, suiData, this);
                    }
                    else {
                        comp = dict[idx];
                        if (comp instanceof egret.DisplayObject) {
                            this.addChild(comp);
                            if (pData) { //调整基础属性
                                jy.SuiResManager.initBaseData(comp, pData);
                            }
                            if (comp instanceof egret.TextField) { //如果是文本框，特殊处理
                                if (!textData) {
                                    textData = comp.rawTextData;
                                }
                                sm.sharedTFCreator.initTextData(comp, textData);
                            }
                        }
                    }
                }
            }
        };
        return MovieClip;
    }(jy.Component));
    jy.MovieClip = MovieClip;
    __reflect(MovieClip.prototype, "jy.MovieClip");
    /**
     * MC创建器
     *
     * @export
     * @class MovieClipCreator
     * @extends {BaseCreator<MovieClip>}
     */
    var MovieClipCreator = /** @class */ (function (_super) {
        __extends(MovieClipCreator, _super);
        function MovieClipCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MovieClipCreator.prototype.parseSelfData = function (data) {
            var suiData = this._suiData;
            var framesData = this.$getFramesData(data);
            this._createT = function () { return new MovieClip(data, framesData, suiData); };
        };
        MovieClipCreator.prototype.$getFramesData = function (data) {
            var framesData = [];
            var j = 0;
            //整理数据，补全非关键帧
            for (var _i = 0, _a = data[1]; _i < _a.length; _i++) {
                var mcData = _a[_i];
                var frameCount = mcData[0], frameData = mcData[1];
                var key = j;
                for (var i = 0; i < frameCount; i++) {
                    framesData[j++] = { key: key, data: frameData };
                }
            }
            return framesData;
        };
        return MovieClipCreator;
    }(jy.BaseCreator));
    jy.MovieClipCreator = MovieClipCreator;
    __reflect(MovieClipCreator.prototype, "jy.MovieClipCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var NumericStepper = /** @class */ (function (_super) {
        __extends(NumericStepper, _super);
        function NumericStepper() {
            var _this = _super.call(this) || this;
            _this._minValue = 1;
            return _this;
        }
        NumericStepper.prototype.bindChildren = function () {
            var _a = this, txtbg = _a.txtbg, subBtn = _a.subBtn, addBtn = _a.addBtn, txt = _a.txt;
            this.addChild(txtbg);
            this.addChild(subBtn);
            this.addChild(addBtn);
            subBtn.enabled = true;
            addBtn.enabled = true;
            subBtn.bindTouch(this.subValue, this);
            addBtn.bindTouch(this.addValue, this);
            this.addChild(txt);
            if (this.minBtn) {
                this.addChild(this.minBtn);
                this.minBtn.enabled = true;
                this.minBtn.bindTouch(this.setMinValue, this);
            }
            if (this.maxBtn) {
                this.addChild(this.maxBtn);
                this.maxBtn.enabled = true;
                this.maxBtn.bindTouch(this.setMaxValue, this);
                this._width = this.maxBtn.width + this.maxBtn.x;
            }
            else {
                this._width = this.addBtn.width + this.addBtn.x;
            }
        };
        Object.defineProperty(NumericStepper.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                if (this._width == value)
                    return;
                var sub = value - this._width;
                this.txt.width += sub;
                this.txtbg.width += sub;
                this.addBtn.x += sub;
                if (this.maxBtn)
                    this.maxBtn.x += sub;
                this._width = value;
            },
            enumerable: true,
            configurable: true
        });
        NumericStepper.prototype.setMinValue = function (e) {
            if (this._minValue)
                this.value = this._minValue;
        };
        NumericStepper.prototype.addValue = function (e) {
            if (this.value < this._maxValue) {
                this.value += 1;
            }
        };
        NumericStepper.prototype.subValue = function (e) {
            if (this.value > this._minValue) {
                this.value -= 1;
            }
        };
        NumericStepper.prototype.setMaxValue = function (e) {
            if (this._maxValue)
                this.value = this._maxValue;
        };
        Object.defineProperty(NumericStepper.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                if (this._value != val) {
                    this._value = val;
                    this.txt.text = val + "";
                    this.dispatch(-1040 /* VALUE_CHANGE */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumericStepper.prototype, "minValue", {
            get: function () {
                return this._minValue;
            },
            /*设置最小值*/
            set: function (value) {
                if (value)
                    this._minValue = value;
                else
                    jy.ThrowError("最小值需大于0");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NumericStepper.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            /*设置最大值*/
            set: function (value) {
                if (value)
                    this._maxValue = value;
                else
                    jy.ThrowError("最大值需大于0");
            },
            enumerable: true,
            configurable: true
        });
        return NumericStepper;
    }(jy.Component));
    jy.NumericStepper = NumericStepper;
    __reflect(NumericStepper.prototype, "jy.NumericStepper");
    var NumericStepperCreator = /** @class */ (function (_super) {
        __extends(NumericStepperCreator, _super);
        function NumericStepperCreator() {
            return _super.call(this) || this;
        }
        NumericStepperCreator.prototype.parseSelfData = function (data) {
            this.uiData = data;
            var txtCreator = new jy.TextFieldCreator();
            this.txtCreator = txtCreator;
            var data0 = data[0], data1 = data[1];
            txtCreator.setBaseData(data0[1]);
            txtCreator.parseSelfData(data0[2]);
            var scale9Creator = new jy.ScaleBitmapCreator();
            this.scale9Creator = scale9Creator;
            var _suiData = this._suiData;
            var sourceComponentData = _suiData.sourceComponentData;
            scale9Creator.bindSuiData(_suiData);
            scale9Creator.parseSelfData(sourceComponentData[5][1][data1[2]]);
            scale9Creator.setBaseData(data1[1]);
            var btnCreator = [];
            this.btnCreator = btnCreator;
            var sourceComponentData31 = sourceComponentData[3][1];
            for (var i = 2; i < data.length; i++) {
                var dat = data[i];
                if (dat) {
                    var bc = new jy.ButtonCreator();
                    bc.bindSuiData(_suiData);
                    bc.parseSelfData(sourceComponentData31[dat[2]]);
                    bc.setBaseData(dat[1]);
                    btnCreator.push(bc);
                }
            }
            this._createT = this.createNumericStepper;
            this.suiManager = jy.singleton(jy.SuiResManager);
        };
        NumericStepperCreator.prototype.createNumericStepper = function () {
            var numstep = new NumericStepper();
            numstep.txt = this.txtCreator.get();
            numstep.txtbg = this.scale9Creator.get();
            var btnCreator = this.btnCreator;
            var len = btnCreator.length;
            if (len >= 3) {
                //4个按钮
                numstep.minBtn = btnCreator[0].get();
                numstep.subBtn = btnCreator[1].get();
                numstep.addBtn = btnCreator[2].get();
                numstep.maxBtn = btnCreator[3].get();
            }
            else {
                //2个按钮
                numstep.subBtn = btnCreator[0].get();
                numstep.addBtn = btnCreator[1].get();
            }
            numstep.bindChildren();
            return numstep;
        };
        return NumericStepperCreator;
    }(jy.BaseCreator));
    jy.NumericStepperCreator = NumericStepperCreator;
    __reflect(NumericStepperCreator.prototype, "jy.NumericStepperCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 进度条
     * @author 3tion
     *
     */
    var ProgressBar = /** @class */ (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar() {
            var _this = _super.call(this) || this;
            _this._labelFun = ProgressBar.defaultLabelFunction;
            _this._value = 0;
            _this._maxValue = 1;
            /**
             * 背景和bar的差值
             *
             * @protected
             */
            _this._delta = 0;
            return _this;
        }
        Object.defineProperty(ProgressBar.prototype, "labelFun", {
            get: function () {
                return this._labelFun;
            },
            /**自定义文本显示方法*/
            set: function (value) {
                if (this._labelFun != value) {
                    this._labelFun = value;
                    this.refresh();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置进度条宽度
         *
         * @param {number} width
         */
        ProgressBar.prototype.setWidth = function (width) {
            var _a = this, bg = _a.bg, bar = _a.bar, tf = _a.tf;
            if (bg) {
                bg.width = width;
            }
            bar.width = width - this._delta;
        };
        Object.defineProperty(ProgressBar.prototype, "skin", {
            set: function (skin) {
                if (this._skin != skin) {
                    this._skin = skin;
                    var bg = skin.bg, bar = skin.bar, tf = skin.tf;
                    this.bar = bar;
                    this._barWidth = bar.width;
                    if (bg) {
                        this.bg = bg;
                        this._delta = bg.width - bar.width;
                    }
                    this.tf = tf;
                }
            },
            enumerable: true,
            configurable: true
        });
        /*设置进度*/
        ProgressBar.prototype.progress = function (value, maxValue) {
            if (value < 0) {
                value = 0;
            }
            if (maxValue < 0) {
                if (true) {
                    jy.ThrowError("进度条最大宽度不应小等于0");
                }
                maxValue = 0.00001;
            }
            if (value > maxValue) {
                value = maxValue;
            }
            this._value = value;
            this._maxValue = maxValue;
            this.refresh();
        };
        /*更新文本显示*/
        ProgressBar.prototype.updateLabel = function () {
            var tf = this.tf;
            var fun = this._labelFun;
            if (tf && fun) {
                tf.text = fun(this._value, this._maxValue);
            }
        };
        ProgressBar.prototype.getPercent = function () {
            return this._value / this._maxValue;
        };
        /*更新进度条显示*/
        ProgressBar.prototype.updateBar = function () {
            var bar = this.bar;
            var v = this.getPercent() * this._barWidth;
            if (this.useMask) {
                var rect = bar.scrollRect;
                if (!rect) {
                    rect = new egret.Rectangle(0, 0, 0, bar.height);
                }
                rect.width = v;
                bar.scrollRect = rect;
            }
            else {
                bar.width = v;
            }
        };
        /*更新显示*/
        ProgressBar.prototype.refresh = function () {
            this.updateLabel();
            this.updateBar();
        };
        ProgressBar.defaultLabelFunction = function (value, maxValue) {
            return value + " / " + maxValue;
        };
        return ProgressBar;
    }(jy.Component));
    jy.ProgressBar = ProgressBar;
    __reflect(ProgressBar.prototype, "jy.ProgressBar");
    /**
     * 进度条创建
     *
     */
    var ProgressBarCreator = /** @class */ (function (_super) {
        __extends(ProgressBarCreator, _super);
        function ProgressBarCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ProgressBarCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            this._createT = function () {
                var progressBar = new ProgressBar();
                var len = data.length;
                var item, tf, bar, bg;
                for (var i = 0; i < len; i++) {
                    item = data[i];
                    if (item) {
                        var dis = _this.createElement(item);
                        if (i == 0) {
                            tf = dis;
                        }
                        else if (i == 1) {
                            bar = dis;
                        }
                        else if (i == 2) {
                            bg = dis;
                        }
                    }
                }
                if (bg) {
                    progressBar.addChild(bg);
                }
                if (bar) {
                    progressBar.addChild(bar);
                }
                if (tf) {
                    progressBar.addChild(tf);
                }
                progressBar.skin = { bg: bg, bar: bar, tf: tf };
                return progressBar;
            };
        };
        return ProgressBarCreator;
    }(jy.BaseCreator));
    jy.ProgressBarCreator = ProgressBarCreator;
    __reflect(ProgressBarCreator.prototype, "jy.ProgressBarCreator");
    /**
     * MC进度条创建
     *
     * @export
     * @class MCProgressCreator
     * @extends {BaseCreator<ProgressBar>}
     */
    var MCProgressCreator = /** @class */ (function (_super) {
        __extends(MCProgressCreator, _super);
        function MCProgressCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MCProgressCreator.prototype.parseSelfData = function (data) {
            var suiData = this._suiData;
            var framesData = jy.MovieClipCreator.prototype.$getFramesData(data);
            this._createT = function () {
                var mc = new jy.MovieClip(data, framesData, suiData);
                var bar = new ProgressBar();
                bar.addChild(mc);
                bar.skin = mc;
                return bar;
            };
        };
        return MCProgressCreator;
    }(jy.BaseCreator));
    jy.MCProgressCreator = MCProgressCreator;
    __reflect(MCProgressCreator.prototype, "jy.MCProgressCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var ScaleBitmapCreator = /** @class */ (function (_super) {
        __extends(ScaleBitmapCreator, _super);
        function ScaleBitmapCreator() {
            return _super.call(this) || this;
        }
        ScaleBitmapCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            var mdata = data[0];
            var textureIndex = mdata[2];
            if (textureIndex < 0) {
                this.isjpg = true;
            }
            var rectData = data[1];
            var flag = data[0] != 0;
            var rectData2 = mdata[1];
            var width = rectData2[3];
            var height = rectData2[4];
            if (rectData) {
                var rect = new egret.Rectangle(rectData[0], rectData[1], rectData[2], rectData[3]);
            }
            this._createT = function () {
                var suiData = _this._suiData;
                var bitmap = new egret.Bitmap();
                // let inx = textureIndex;
                // let img = suiData.pngtexs;
                // if(!this.ispng){
                //     inx = -1-textureIndex;
                //     img = suiData.jpgtexs;
                // }
                bitmap.scale9Grid = rect;
                if (flag) {
                    bitmap.texture = suiData.getTexture(textureIndex); //img[inx];//suiData.imgs[textureIndex];
                    bitmap.width = width;
                    bitmap.height = height;
                    _this.bindEvent(bitmap);
                }
                return bitmap;
            };
        };
        return ScaleBitmapCreator;
    }(jy.BitmapCreator));
    jy.ScaleBitmapCreator = ScaleBitmapCreator;
    __reflect(ScaleBitmapCreator.prototype, "jy.ScaleBitmapCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var ScrollBar = /** @class */ (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar() {
            var _this = _super.call(this) || this;
            _this._scrollType = 0 /* Vertical */;
            _this._supportSize = 15;
            _this.initBaseContainer();
            return _this;
        }
        ScrollBar.prototype.initBaseContainer = function () {
            var bar = new egret.Sprite();
            var bg = new egret.Sprite();
            this.addChild(bg);
            this.addChild(bar);
            bg.visible = false;
            this.bar = bar;
            this.bg = bg;
        };
        Object.defineProperty(ScrollBar.prototype, "scrollType", {
            /**滚动条方式 0：垂直，1：水平 defalut:0*/
            get: function () {
                return this._scrollType;
            },
            /**滚动条方式 0：垂直，1：水平 defalut:0*/
            set: function (value) {
                this._scrollType = value;
                this.checkBarSize();
                this.checkBgSize();
                this.$setSupportSize(this._supportSize);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置滚动条的底与默认尺寸
         *
         * @value 背景底
         * @bgSize 尺寸
         */
        ScrollBar.prototype.setBg = function (value, bgSize) {
            this._bgBmp = value;
            value.y = 0;
            if (bgSize > 0) {
                this._bgSize = bgSize;
            }
            else {
                this.checkBgSize();
            }
            this.bg.addChild(value);
            this.$setSupportSize(this._supportSize);
        };
        /**
         * 设置滑块按钮的样式
         *
         * @value 滑块按钮
         * @barSize 滑块的尺寸大小
         */
        ScrollBar.prototype.setBar = function (value, barSize) {
            this._barBmp = value;
            value.y = 0;
            if (barSize > 0) {
                this._barSize = barSize;
            }
            else {
                this.checkBarSize();
            }
            this.bar.addChild(value);
            this.$setSupportSize(this._supportSize);
        };
        Object.defineProperty(ScrollBar.prototype, "bgSize", {
            get: function () {
                return this._bgSize;
            },
            /**
             * 滚动条背景尺寸
             */
            set: function (value) {
                if (this._bgSize != value) {
                    this.$setBgSize(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBar.prototype, "barSize", {
            get: function () {
                return this._barSize;
            },
            /**
             * 滑块的尺寸
             */
            set: function (value) {
                if (this._barSize != value) {
                    this.$setBarSize(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBar.prototype, "supportSize", {
            get: function () {
                return this._supportSize;
            },
            /**当垂直滚动时，此值为滑块的宽度，当水平滚动时，此值为滑块的高度 */
            set: function (value) {
                if (this._supportSize != value) {
                    this.$setSupportSize(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        ScrollBar.prototype.$setSupportSize = function (_supportSize) {
            this._supportSize = _supportSize;
            var _a = this, _bgBmp = _a._bgBmp, _barBmp = _a._barBmp;
            if (this._scrollType == 0 /* Vertical */) {
                if (_bgBmp)
                    _bgBmp.width = _supportSize;
                if (_barBmp)
                    _barBmp.width = _supportSize;
            }
            else {
                if (_bgBmp)
                    _bgBmp.height = _supportSize;
                if (_barBmp)
                    _barBmp.height = _supportSize;
            }
        };
        ScrollBar.prototype.$setBarSize = function (_barSize) {
            this._barSize = _barSize;
            var _barBmp = this._barBmp;
            if (_barBmp) {
                if (this._scrollType == 0 /* Vertical */) {
                    _barBmp.height = _barSize;
                }
                else {
                    _barBmp.width = _barSize;
                }
            }
        };
        ScrollBar.prototype.$setBgSize = function (_bgSize) {
            this._bgSize = _bgSize;
            var _bgBmp = this._bgBmp;
            if (_bgBmp) {
                if (this._scrollType == 0 /* Vertical */) {
                    _bgBmp.height = _bgSize;
                }
                else {
                    _bgBmp.width = _bgSize;
                }
            }
        };
        ScrollBar.prototype.checkBgSize = function () {
            var _bgBmp = this._bgBmp;
            if (_bgBmp) {
                if (this._scrollType == 0 /* Vertical */) {
                    this._bgSize = _bgBmp.height;
                }
                else {
                    this._bgSize = _bgBmp.width;
                }
            }
        };
        ScrollBar.prototype.checkBarSize = function () {
            var _barBmp = this._bgBmp;
            if (_barBmp) {
                if (this._scrollType == 0 /* Vertical */) {
                    this._barSize = _barBmp.height;
                }
                else {
                    this._barSize = _barBmp.width;
                }
            }
        };
        return ScrollBar;
    }(jy.Component));
    jy.ScrollBar = ScrollBar;
    __reflect(ScrollBar.prototype, "jy.ScrollBar");
    var ScrollBarCreator = /** @class */ (function (_super) {
        __extends(ScrollBarCreator, _super);
        function ScrollBarCreator() {
            return _super.call(this) || this;
        }
        ScrollBarCreator.prototype.parseSelfData = function (data) {
            this.uiData = data;
            this.suiManager = jy.singleton(jy.SuiResManager);
            this._createT = this.createScrollBar;
        };
        ScrollBarCreator.prototype.createScrollBar = function () {
            var scrollBar = new ScrollBar();
            var comData = this.uiData;
            // let len = comData.length;
            var tmpData;
            var sourceData = this._suiData.sourceComponentData;
            var index;
            var sourceArr;
            var name;
            tmpData = comData[0];
            index = tmpData[2];
            sourceArr = sourceData[5];
            name = sourceArr[0][index];
            var sc = this.suiManager.createDisplayObject(this._suiData.key, name, tmpData[1]);
            scrollBar.setBar(sc);
            tmpData = comData[1];
            index = tmpData[2];
            sourceArr = sourceData[5];
            name = sourceArr[0][index];
            sc = this.suiManager.createDisplayObject(this._suiData.key, name, tmpData[1]);
            scrollBar.setBg(sc);
            return scrollBar;
        };
        return ScrollBarCreator;
    }(jy.BaseCreator));
    jy.ScrollBarCreator = ScrollBarCreator;
    __reflect(ScrollBarCreator.prototype, "jy.ScrollBarCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var ShareBitmapCreator = /** @class */ (function (_super) {
        __extends(ShareBitmapCreator, _super);
        function ShareBitmapCreator() {
            return _super.call(this) || this;
        }
        ShareBitmapCreator.prototype.parseSelfData = function (data) {
            _super.prototype.parseSelfData.call(this, data[0][2]);
        };
        return ShareBitmapCreator;
    }(jy.BitmapCreator));
    jy.ShareBitmapCreator = ShareBitmapCreator;
    __reflect(ShareBitmapCreator.prototype, "jy.ShareBitmapCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider() {
            var _this = _super.call(this) || this;
            _this.initBaseContainer();
            _this.touchChildren = _this.touchEnabled = true;
            _this.thumb.touchEnabled = true;
            _this.bgline.touchEnabled = true;
            _this.addListener();
            return _this;
        }
        Slider.prototype.addListener = function () {
            this.thumb.on("touchBegin" /* TOUCH_BEGIN */, this.onThumbBegin, this);
            this.on("addedToStage" /* ADDED_TO_STAGE */, this.onAddToStage, this);
        };
        Slider.prototype.onAddToStage = function (e) {
            if (this._barEnabled) {
                this.stage.on("touchEnd" /* TOUCH_END */, this.bgOut, this);
            }
        };
        Object.defineProperty(Slider.prototype, "barEnabled", {
            /*使不使用底条点击直接设值 */
            set: function (value) {
                this._barEnabled = value;
                if (value) {
                    this.bgline.on("touchBegin" /* TOUCH_BEGIN */, this.bgClick, this);
                    if (this.stage) {
                        this.stage.on("touchEnd" /* TOUCH_END */, this.bgOut, this);
                    }
                }
                else {
                    this.bgline.off("touchBegin" /* TOUCH_BEGIN */, this.bgClick, this);
                    if (this.stage) {
                        this.bgline.off("touchEnd" /* TOUCH_END */, this.bgOut, this);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Slider.prototype.bgClick = function (e) {
            this._lastThumbX = this.thumb.localToGlobal().x;
            var currentX = e.stageX;
            this.tipTxt.visible = true;
            this.calculatevalue(currentX);
            this.tipTxt.text = this.value.toString();
        };
        Slider.prototype.bgOut = function (e) {
            this.tipTxt.visible = false;
        };
        Slider.prototype.onThumbBegin = function (e) {
            this._lastThumbX = this.thumb.localToGlobal().x;
            this.stage.on("touchMove" /* TOUCH_MOVE */, this.mouseMove, this);
            this.thumb.on("touchEnd" /* TOUCH_END */, this.onThumbEnd, this);
            this.thumb.on("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.onThumbEnd, this);
            this.tipTxt.visible = true;
        };
        Slider.prototype.onThumbEnd = function (e) {
            this.stage.off("touchMove" /* TOUCH_MOVE */, this.mouseMove, this);
            this.thumb.off("touchEnd" /* TOUCH_END */, this.onThumbEnd, this);
            this.thumb.off("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.onThumbEnd, this);
        };
        Slider.prototype.mouseMove = function (e) {
            var currentX = e.stageX;
            this.calculatevalue(currentX);
            this.tipTxt.text = this.value.toString();
        };
        Slider.prototype.calculatevalue = function (currentX) {
            var sub = currentX - this._lastThumbX;
            var steps;
            var value;
            if (Math.abs(sub) >= this._perStepPixel) {
                steps = sub / this._perStepPixel;
                steps = Math.round(steps);
                value = this.value + steps * this._step;
                if (value <= this._minValue) {
                    value = this._minValue;
                }
                if (value >= this._maxVlaue) {
                    value = this._maxVlaue;
                }
                this.value = value;
                this._lastThumbX = this.thumb.localToGlobal().x;
                this.tipTxt.x = this.thumb.x + this._halfThumbWidth - 40;
            }
        };
        Slider.prototype.initBaseContainer = function () {
            this.thumb = new egret.Sprite();
            this.bgline = new egret.Sprite();
            this.addChild(this.bgline);
            this.addChild(this.thumb);
            this.tipTxt = new egret.TextField();
            this.tipTxt.y = -12;
            this.tipTxt.textAlign = "center" /* CENTER */;
            this.tipTxt.width = 80;
            this.tipTxt.size = 12;
            this.tipTxt.bold = false;
            this.addChild(this.tipTxt);
        };
        /**
         * 设置底条新式
         *
         * @param {ScaleBitmap} bg (description)
         */
        Slider.prototype.setBg = function (bg) {
            this._bgBmp = bg;
            this.bgline.addChild(bg);
            this._width = bg.width;
        };
        /**
         * 设置滑块样式
         *
         * @param {egret.Bitmap} tb (description)
         */
        Slider.prototype.setThumb = function (tb) {
            this.thumb.x = tb.x;
            this.thumb.y = tb.y;
            tb.x = tb.y = 0;
            this.thumb.addChild(tb);
            this._halfThumbWidth = tb.width * 0.5;
        };
        Object.defineProperty(Slider.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                if (this._value == val)
                    return;
                this._value = val;
                this.dispatch(-1040 /* VALUE_CHANGE */);
                this.thumb.x = ((val - this._minValue) / this._step) * this._perStepPixel - this._halfThumbWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "width", {
            get: function () {
                return this._width;
            },
            /**
             * 设置底条宽度
             */
            set: function (value) {
                if (this._width == value)
                    return;
                this._width = value;
                if (this._bgBmp) {
                    this._bgBmp.width = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "height", {
            get: function () {
                return this._height;
            },
            /**
             * 设置底条高度
             */
            set: function (value) {
                if (this._height == value)
                    return;
                this._height = value;
                if (this._bgBmp) {
                    this._bgBmp.height = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "maxVlaue", {
            set: function (value) {
                this._maxVlaue = value;
                this.checkStepPixel();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "minValue", {
            set: function (value) {
                this._minValue = value;
                this.checkStepPixel();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "step", {
            /**
             * 滑块移动一个单位的值
             */
            set: function (value) {
                this._step = value;
                this.checkStepPixel();
            },
            enumerable: true,
            configurable: true
        });
        Slider.prototype.checkStepPixel = function () {
            this._perStepPixel = this.bgline.width / ((this._maxVlaue - this._minValue) / this._step);
        };
        return Slider;
    }(jy.Component));
    jy.Slider = Slider;
    __reflect(Slider.prototype, "jy.Slider");
    var SliderCreator = /** @class */ (function (_super) {
        __extends(SliderCreator, _super);
        function SliderCreator() {
            return _super.call(this) || this;
        }
        SliderCreator.prototype.parseSelfData = function (data) {
            this.uiData = data;
            this.txtCreator = new jy.TextFieldCreator();
            this.scale9Creator = new jy.ScaleBitmapCreator();
            this.bitmapCreator = new jy.BitmapCreator(this._suiData);
            this.suiManager = jy.singleton(jy.SuiResManager);
            this._createT = this.createSlider;
        };
        SliderCreator.prototype.createSlider = function () {
            var slider = new Slider();
            var comData = this.uiData;
            var len = comData.length;
            var tmpData;
            var type;
            var sourceData = this._suiData.sourceComponentData;
            var index;
            var sourceArr;
            var name;
            for (var i = 0; i < len; i++) {
                tmpData = comData[i];
                type = tmpData[0];
                index = tmpData[2];
                if (type == 0) {
                    this.bitmapCreator.parseSelfData(index);
                    var bmp = this.bitmapCreator.get();
                    slider.setThumb(bmp);
                }
                else if (type == 5) {
                    sourceArr = sourceData[type];
                    name = sourceArr[0][index];
                    var sc = this.suiManager.createDisplayObject(this._suiData.key, name, tmpData[1]);
                    slider.setBg(sc);
                }
            }
            return slider;
        };
        return SliderCreator;
    }(jy.BaseCreator));
    jy.SliderCreator = SliderCreator;
    __reflect(SliderCreator.prototype, "jy.SliderCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 格位基本类
     * @author 3tion
     */
    var Slot = /** @class */ (function (_super) {
        __extends(Slot, _super);
        function Slot() {
            var _this = _super.call(this) || this;
            _this._count = 1;
            _this._countShow = 1 /* Show */;
            _this.icon = new jy.Image();
            return _this;
        }
        Object.defineProperty(Slot.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this.$setData(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置数据，只允许子类调用
         * @protected
         */
        Slot.prototype.$setData = function (value) {
            this._data = value;
        };
        Object.defineProperty(Slot.prototype, "rect", {
            get: function () {
                return this._rect;
            },
            set: function (rect) {
                if (rect) {
                    this._rect = rect;
                    var icon = this.icon;
                    icon.x = rect.x;
                    icon.y = rect.y;
                    icon.width = rect.width;
                    icon.height = rect.height;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "countTxt", {
            get: function () {
                return this._countTxt;
            },
            set: function (txt) {
                var old = this._countTxt;
                if (old != txt) {
                    jy.removeDisplay(old);
                    this._countTxt = txt;
                    this.refreshCount();
                    this.invalidateDisplay();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "iconSource", {
            set: function (uri) {
                if (this._uri != uri) {
                    this._uri = uri;
                    this.icon.source = uri;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "count", {
            set: function (value) {
                if (this._count != value) {
                    this._count = value;
                    this.refreshCount();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "countShow", {
            get: function () {
                return this._countShow;
            },
            /**
             * 数量显示状态<br/>
             * 0 不显示数值<br/>
             * 1 默认显示大于1的数量<br/>
             * 2 大于1的数量，显示数值，超过一万的，会以xxx万显示 默认为2<br/>
             */
            set: function (value) {
                if (this._countShow != value) {
                    this._countShow = value;
                    this.refreshCount();
                }
            },
            enumerable: true,
            configurable: true
        });
        Slot.prototype.refreshCount = function () {
            if (this.stage && this._countTxt) {
                this._countTxt.text = this.getCount();
            }
        };
        Slot.prototype.getCount = function () {
            var str = "";
            var count = this._count;
            switch (this.countShow) {
                case 1 /* Show */:
                    if (count > 1) {
                        str = count + "";
                    }
                    break;
                case 2 /* Custom */:
                    str = Slot.getCountString(count);
                    break;
                default:
                    break;
            }
            return str;
        };
        Slot.prototype.invalidateDisplay = function () {
            this._changed = true;
            if (this.stage) {
                jy.Global.callLater(this.refreshDisplay, 0, this);
            }
        };
        Slot.prototype.refreshDisplay = function () {
            if (!this._changed) {
                return false;
            }
            this._changed = false;
            if (this.bg) {
                this.addChild(this.bg);
            }
            this.addChild(this.icon);
            if (this._countTxt) {
                this.addChild(this._countTxt);
            }
            return true;
        };
        /**
         * 皮肤添加到舞台
         */
        Slot.prototype.onAwake = function () {
            this.refreshDisplay();
            this.refreshCount();
        };
        /**
         * 销毁
         * to be override
         */
        Slot.prototype.dispose = function () {
            this.icon.dispose();
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(Slot.prototype, "width", {
            get: function () {
                return this.suiRawRect.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "height", {
            get: function () {
                return this.suiRawRect.height;
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * 获取类型2的数量处理方法
         * @static
         */
        Slot.getCountString = function (count) { return count <= 1 ? "" : count < 10000 ? count + "" : jy.LangUtil.getMsg("$_wan", Math.floor(count / 10000)); };
        return Slot;
    }(jy.Component));
    jy.Slot = Slot;
    __reflect(Slot.prototype, "jy.Slot");
    /**
     * 格位创建器
     *
     * @export
     * @class SlotCreator
     * @extends {BaseCreator<Slot>}
     * @author pb
     */
    var SlotCreator = /** @class */ (function (_super) {
        __extends(SlotCreator, _super);
        function SlotCreator() {
            return _super.call(this) || this;
        }
        SlotCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            var scaleData = data[0];
            var rect = scaleData ? new egret.Rectangle(scaleData[0], scaleData[1], scaleData[2], scaleData[3]) : undefined;
            this._createT = function () {
                var slot = new Slot();
                slot.rect = rect;
                var item = data[1];
                if (item) {
                    var dis = _this.createElement(item);
                    slot.countTxt = dis;
                }
                item = data[2];
                if (item) {
                    var dis = _this.createElement(item);
                    if (item.length > 1) {
                        slot.bg = dis;
                    }
                    else {
                        slot.bg = dis;
                    }
                }
                slot.invalidateDisplay();
                return slot;
            };
        };
        return SlotCreator;
    }(jy.BaseCreator));
    jy.SlotCreator = SlotCreator;
    __reflect(SlotCreator.prototype, "jy.SlotCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 文本框创建器
     * @author
     *
     */
    var TextFieldCreator = /** @class */ (function (_super) {
        __extends(TextFieldCreator, _super);
        function TextFieldCreator() {
            return _super.call(this) || this;
        }
        TextFieldCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            this._createT = function () {
                var tf = new egret.TextField();
                tf.rawTextData = data;
                _this.initTextData(tf, data);
                return tf;
            };
        };
        TextFieldCreator.prototype.initTextData = function (tf, data) {
            //静态文本框按动态文本框处理
            var textType = ["dynamic", "dynamic", "input"][+data[0]];
            var face = data[1] || TextFieldCreator.DefaultFonts;
            var align = ["left", "center", "right", "justify"][+data[2]];
            var color = jy.ColorUtil.getColorValue(data[3]);
            var size = data[4] || 12; //默认12px字
            var spacing = +data[5];
            var bold = !!data[6];
            var italic = !!data[7];
            var stroke = 0;
            var strokeColor = 0;
            var strokeDat = data[8];
            //            // blurX 作为描边宽度
            //            data[8] = [filter.color,filter.blurX];
            if (Array.isArray(strokeDat)) {
                strokeColor = strokeDat[0];
                if (typeof strokeColor == "string") {
                    strokeColor = jy.ColorUtil.getColorValue(strokeColor);
                }
                stroke = strokeDat[1];
            }
            tf.type = textType;
            tf.fontFamily = face;
            tf.textAlign = align;
            tf.textColor = color;
            tf.size = size;
            tf.lineSpacing = spacing;
            tf.bold = bold;
            tf.italic = italic;
            tf.stroke = stroke;
            tf.strokeColor = strokeColor;
        };
        TextFieldCreator.DefaultFonts = "";
        return TextFieldCreator;
    }(jy.BaseCreator));
    jy.TextFieldCreator = TextFieldCreator;
    __reflect(TextFieldCreator.prototype, "jy.TextFieldCreator");
})(jy || (jy = {}));
var jy;
(function (jy) {
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
    var BGContainer = /** @class */ (function (_super) {
        __extends(BGContainer, _super);
        function BGContainer(basis, host, layout) {
            if (layout === void 0) { layout = 6 /* TOP_CENTER */; }
            var _this = _super.call(this, basis, host) || this;
            _this._layout = layout;
            return _this;
        }
        BGContainer.prototype.onResize = function () {
            var host = this._host;
            var stage = host.stage || egret.sys.$TempStage;
            var basis = this._basis;
            var sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            var dw = sw, dh = sh, lw = sw, lh = sh;
            var scale = 1;
            if (sw > bw || sh > bh) { //屏幕宽高，任意一边大于基准宽高
                var result = jy.getFixedLayout(sw, sh, bw, bh, true);
                dh = result.dh;
                dw = result.dw;
                lw = result.lw;
                lh = result.lh;
                scale = result.scale;
            }
            else {
                dw = bw;
                dh = bh;
            }
            this._lw = lw;
            this._lh = lh;
            host.scaleY = host.scaleX = scale;
            var pt = jy.Temp.SharedPoint1;
            jy.Layout.getLayoutPos(dw, dh, sw, sh, this._layout, pt);
            host.x = pt.x;
            host.y = pt.y;
            this.layoutAll();
        };
        return BGContainer;
    }(jy.LayoutContainer));
    jy.BGContainer = BGContainer;
    __reflect(BGContainer.prototype, "jy.BGContainer");
})(jy || (jy = {}));
var jy;
(function (jy) {
    ;
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
    function getTipLayoutPos(disWidth, disHeight, parentWidth, parentHeight, point, result, padx, pady) {
        if (padx === void 0) { padx = 0; }
        if (pady === void 0) { pady = 0; }
        var mx = point.x;
        var my = point.y;
        var x = mx + padx;
        var y = my + pady;
        if (disWidth + x + padx > parentWidth) {
            x = parentWidth - disWidth - padx;
            if (x < mx) {
                x = mx - disWidth - padx;
            }
            if (x < 0) {
                x = padx;
            }
        }
        if (disHeight + my + pady > parentHeight) {
            y = parentHeight - disHeight - pady;
            if (y < 0) {
                y = pady;
            }
        }
        result.x = Math.round(x);
        result.y = Math.round(y);
        return result;
    }
    function getLayoutPos(disWidth, disHeight, parentWidth, parentHeight, layout, result, hoffset, voffset, outerV, outerH) {
        if (hoffset === void 0) { hoffset = 0; }
        if (voffset === void 0) { voffset = 0; }
        result = result || {};
        var vertical = layout & 12 /* VERTICAL_MASK */;
        var horizon = layout & 3 /* HORIZON_MASK */;
        var y = 0, x = 0;
        switch (vertical) {
            case 4 /* TOP */:
                if (outerV) {
                    y = -disHeight;
                }
                break;
            case 8 /* MIDDLE */: // 不支持非innerV
                y = parentHeight - disHeight >> 1;
                break;
            case 12 /* BOTTOM */:
                if (outerV) {
                    y = parentHeight;
                }
                else {
                    y = parentHeight - disHeight;
                }
                break;
        }
        switch (horizon) {
            case 1 /* LEFT */:
                if (outerH) {
                    x = -disWidth;
                }
                break;
            case 2 /* CENTER */: // 不支持非innerH
                x = parentWidth - disWidth >> 1;
                break;
            case 3 /* RIGHT */:
                if (outerH) {
                    x = parentWidth;
                }
                else {
                    x = parentWidth - disWidth;
                }
                break;
        }
        result.x = Math.round(x + hoffset);
        result.y = Math.round(y + voffset);
        return result;
    }
    var rect = new egret.Rectangle();
    function getLayoutParam(layoutDis, parent) {
        var display;
        if (layoutDis instanceof egret.DisplayObject) {
            display = layoutDis;
        }
        else {
            display = layoutDis.display;
        }
        if (!display) {
            true && jy.ThrowError("\u6267\u884CtipLayout\u64CD\u4F5C\u65F6\u6CA1\u6709\u8BBE\u7F6E\u53EF\u4EE5\u663E\u793A\u7684\u5BF9\u8C61");
            return;
        }
        var parentWidth, parentHeight, par;
        if (parent && parent instanceof egret.DisplayObjectContainer) {
            par = parent;
        }
        if (!par) {
            par = display.parent;
        }
        if (!par) {
            par = egret.sys.$TempStage;
        }
        if (par instanceof egret.Stage) {
            parentWidth = par.stageWidth;
            parentHeight = par.stageHeight;
        }
        else {
            parentWidth = par.width;
            parentHeight = par.height;
        }
        var size = layoutDis.$layoutSize;
        if (!size) {
            display.getTransformedBounds(par, rect);
            size = rect;
        }
        return [size.width, size.height, display, parentWidth, parentHeight, par];
    }
    /**
     *
     * @author 3tion
     *
     */
    jy.Layout = {
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
        layout: function (dis, layout, hoffset, voffset, outerV, outerH, parent) {
            var result = getLayoutParam(dis, parent);
            if (!result)
                return;
            var disWidth = result[0], disHeight = result[1], display = result[2], parentWidth = result[3], parentHeight = result[4];
            getLayoutPos(disWidth, disHeight, parentWidth, parentHeight, layout, display, hoffset, voffset, outerV, outerH);
        },
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
        layoutPercent: function (dis, top, left, parent, padx, pady) {
            if (top === void 0) { top = 0; }
            if (left === void 0) { left = 0; }
            if (padx === void 0) { padx = 0; }
            if (pady === void 0) { pady = 0; }
            var result = getLayoutParam(dis, parent);
            if (!result)
                return;
            var disWidth = result[0], disHeight = result[1], display = result[2], parentWidth = result[3], parentHeight = result[4];
            display.x = Math.round((parentWidth - disWidth) * left + padx);
            display.y = Math.round((parentHeight - disHeight) * top + pady);
            return display;
        },
        getLayoutPos: getLayoutPos,
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
        tipLayout: function (layoutDis, point, padx, pady, parent) {
            var result = getLayoutParam(layoutDis, parent);
            if (!result)
                return;
            var disWidth = result[0], disHeight = result[1], display = result[2], parentWidth = result[3], parentHeight = result[4];
            getTipLayoutPos(disWidth, disHeight, parentWidth, parentHeight, point, display, padx, pady);
        },
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
        getTipLayoutPos: getTipLayoutPos,
        /**
         * 用于统一存储狗屎异形屏的UI偏移量数据
         */
        offsets: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }
    };
})(jy || (jy = {}));
var jy;
(function (jy) {
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
    var MainUIContainer = /** @class */ (function (_super) {
        __extends(MainUIContainer, _super);
        function MainUIContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainUIContainer.prototype.onResize = function () {
            var host = this._host;
            var stage = host.stage || egret.sys.$TempStage;
            var basis = this._basis;
            var sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            var lw = sw, lh = sh;
            var scale = 1;
            if (sw < bw || sh < bh) { //屏幕宽高，任意一边小于基准宽高
                var result = jy.getFixedLayout(sw, sh, bw, bh);
                lw = result.lw;
                lh = result.lh;
                scale = result.scale;
            }
            this._lw = lw;
            this._lh = lh;
            host.x = 0;
            host.y = 0;
            host.scaleY = host.scaleX = scale;
            this.layoutAll();
        };
        MainUIContainer.prototype.add = function (d, type, offsetRect, hide) {
            var raw = d.suiRawRect;
            var result = jy.Layout.getLayoutPos(raw.width, raw.height, offsetRect.width, offsetRect.height, type);
            var dx = raw.x - offsetRect.x;
            var dy = raw.y - offsetRect.y;
            var oh = dx - result.x;
            var ov = dy - result.y;
            this.addLayout(d, type, raw, oh, ov, false, false, hide);
        };
        MainUIContainer.prototype.binLayout = function (bin) {
            if (bin.type == 0 /* FullScreen */) {
                var dis = bin.dis;
                var host = this._host;
                var scale = host.scaleX;
                dis.x = bin.hoffset * scale;
                dis.y = bin.voffset * scale;
                var stage = host.stage || egret.sys.$TempStage;
                dis.width = stage.stageWidth / scale;
                dis.height = stage.stageHeight / scale;
            }
            else {
                _super.prototype.binLayout.call(this, bin);
            }
        };
        return MainUIContainer;
    }(jy.LayoutContainer));
    jy.MainUIContainer = MainUIContainer;
    __reflect(MainUIContainer.prototype, "jy.MainUIContainer");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var ResizeManager = /** @class */ (function () {
        function ResizeManager() {
            this._list = [];
        }
        ResizeManager.prototype.init = function (stage) {
            this._stage = stage || egret.sys.$TempStage;
            this._stage.on("resize" /* RESIZE */, this.onResize, this);
        };
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
        ResizeManager.prototype.add = function (dis, layout, hoffset, voffset, container) {
            var list = this._list;
            dis.$_resize = { layout: layout, hoffset: hoffset, voffset: voffset, container: container };
            list.pushOnce(dis);
            if (dis.stage) {
                this.resize(dis);
            }
            else {
                dis.once("addedToStage" /* ADDED_TO_STAGE */, this.onAdded, this);
            }
        };
        /**
         * 移除元件
         *
         * @param {egret.DisplayObject} dis (description)
         * @returns (description)
         */
        ResizeManager.prototype.remove = function (dis) {
            this._list.remove(dis);
            dis.off("addedToStage" /* ADDED_TO_STAGE */, this.onAdded, this);
            if (dis.$_resize) {
                dis.$_resize = undefined;
            }
        };
        ResizeManager.prototype.onAdded = function (e) {
            var dis = e.target;
            var index = this._list.indexOf(dis);
            if (index < 0)
                return;
            this.resize(dis);
        };
        ResizeManager.prototype.resize = function (dis) {
            var info = dis.$_resize;
            var container = info.container || egret.sys.$TempStage;
            jy.Layout.layout(dis, info.layout, info.hoffset, info.voffset, false, false, container);
        };
        ResizeManager.prototype.onResize = function () {
            var list = this._list;
            var len = list.length;
            for (var i = 0; i < len; i++) {
                this.resize(list[i]);
            }
        };
        ResizeManager.prototype.dispose = function () {
            this._stage.off("addedToStage" /* ADDED_TO_STAGE */, this.onAdded, this);
            this._list.length = 0;
        };
        return ResizeManager;
    }());
    jy.ResizeManager = ResizeManager;
    __reflect(ResizeManager.prototype, "jy.ResizeManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 按钮形式的菜单
     * @author gushuai
     * (description)
     *
     * @export
     * @class SkillItemMenuRender
     * @extends {MenuBaseRender<MenuBaseVO>}
     */
    var ButtonMenuRender = /** @class */ (function (_super) {
        __extends(ButtonMenuRender, _super);
        function ButtonMenuRender(key, className) {
            if (key === void 0) { key = "lib"; }
            if (className === void 0) { className = "ui.btn.MenuBtn"; }
            var _this = _super.call(this) || this;
            var btn = jy.singleton(jy.SuiResManager).createDisplayObject(key, className);
            _this.skin = btn;
            _this.btn = btn;
            return _this;
        }
        ButtonMenuRender.prototype.$setData = function (val) {
            _super.prototype.$setData.call(this, val);
            this.btn.label = val.label;
        };
        return ButtonMenuRender;
    }(jy.MenuBaseRender));
    jy.ButtonMenuRender = ButtonMenuRender;
    __reflect(ButtonMenuRender.prototype, "jy.ButtonMenuRender");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @class Menu
     * @extends {egret.Sprite}
     */
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu(style, maxRendercount) {
            var _this = _super.call(this) || this;
            _this.style = style;
            _this.uiManager = jy.singleton(jy.SuiResManager);
            _this.maxRenderCount = maxRendercount;
            _this.bindComponent();
            return _this;
        }
        /**
         * (description)
         *
         * @static
         * @ param {egret.DisplayObject} target (Menu所在的父容器)
         * @ param {Menu} menu (menu实例)
         * @ param {Function} callBack (menu的displayMenuDatas具体实现函数（回调参数，第1位是绑定的target 第2位是Menu）)
         */
        Menu.bind = function (target, menu, menuinit) {
            var dic = Menu.dic;
            if (!dic) {
                Menu.dic = dic = new Map();
            }
            if (!dic.has(target)) {
                dic.set(target, menu);
            }
            menu.menuinitFunc = menuinit;
            target.on(-1000 /* CHOOSE_STATE_CHANGE */, Menu.onShowOrHideMenu, this);
        };
        Menu.unBind = function (target) {
            var dic = Menu.dic;
            if (!dic)
                return;
            if (dic.has(target)) {
                var dis = dic.get(target);
                dis.menuinitFunc = undefined;
                jy.removeDisplay(dis);
                dic.delete(target);
            }
            target.off(-1000 /* CHOOSE_STATE_CHANGE */, Menu.onShowOrHideMenu, this);
        };
        Menu.onShowOrHideMenu = function (e) {
            var target = e.target;
            var b = target.selected;
            var dis = Menu.dic.get(target);
            var v = target.view;
            if (b) {
                if (v instanceof egret.DisplayObjectContainer) {
                    v.addChild(dis);
                    var init = dis.menuinitFunc;
                    if (init) {
                        init.call(target, target, dis);
                    }
                }
                this.currentShow = target;
            }
            else {
                jy.removeDisplay(dis);
                this.currentShow = undefined;
            }
            target.dispatch(-1999 /* Resize */);
        };
        Menu.prototype.bindComponent = function () {
            var manager = this.uiManager;
            var uri = this.style.uikey;
            var rec = this.style.possize;
            var rendercls = this.style.renderClass;
            var bguri = this.style.scalebg;
            var bg = manager.createDisplayObject(uri, bguri);
            this.addChild(bg);
            bg.width = rec.width;
            bg.height = rec.height;
            this.renders = [];
            for (var i = 0; i < this.maxRenderCount; i++) {
                var render = new rendercls();
                this.renders[i] = render;
                this.addChild(render.view);
            }
        };
        /**
         * 显示菜单操作项
         */
        Menu.prototype.displayMenuDatas = function (vos) {
            var len = vos.length;
            var blen = this.renders.length;
            var style = this.style;
            var tmp = [];
            for (var i = 0; i < len; i++) {
                var render = this.renders[i];
                render.data = vos[i];
                this.addChild(render.view);
                tmp[i] = render;
            }
            if (len < blen) {
                for (var i = len; i < blen; i++) {
                    jy.removeDisplay(this.renders[i].view);
                }
            }
            var rec = style.possize;
            var gap;
            var tmpSize = tmp[0].getSize();
            if (!style.align) {
                gap = (rec.width - rec.x * 2 - len * tmpSize.width) / (len - 1);
                for (var i = 0; i < len; i++) {
                    var render = tmp[i];
                    tmpSize = render.getSize();
                    var v = render.view;
                    v.x = ~~(rec.x + (gap + tmpSize.width) * i);
                    v.y = ~~rec.y;
                }
            }
            else {
                gap = (rec.height - rec.y * 2 - len * tmpSize.height) / (len - 1);
                for (var i = 0; i < len; i++) {
                    var render = tmp[i];
                    tmpSize = render.getSize();
                    var v = render.view;
                    v.x = ~~rec.x;
                    v.y = ~~(rec.y + (gap + tmpSize.height) * i);
                }
            }
        };
        return Menu;
    }(egret.Sprite));
    jy.Menu = Menu;
    __reflect(Menu.prototype, "jy.Menu");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 错误提示
     * @author pb
     */
    var ErrorTips = /** @class */ (function () {
        function ErrorTips(parent) {
            this._parent = parent;
        }
        ErrorTips.prototype.show = function (msg, color, duration, delay) {
            if (color === void 0) { color = 0xffffff; }
            if (duration === void 0) { duration = 1000; }
            if (delay === void 0) { delay = 1000; }
            var txt = new egret.TextField();
            txt.textAlign = "center" /* CENTER */;
            if (/<[^>]+>/.test(msg)) {
                txt.setHtmlText(msg);
            }
            else {
                txt.text = msg;
            }
            txt.alpha = 1;
            jy.Layout.layout(txt, 10 /* MIDDLE_CENTER */);
            txt.textColor = color;
            this._parent.addChild(txt);
            var tween = jy.Global.getTween(txt);
            tween.to({ y: txt.y - 100 }, duration).to({ alpha: 0 }, delay).call(this.txtComplete, this, [tween, txt]);
        };
        ErrorTips.prototype.txtComplete = function (arg) {
            var tween = arg[0];
            var txt = arg[1];
            if (tween) {
                tween.paused = true;
                tween.onRecycle();
            }
            if (txt)
                jy.removeDisplay(txt);
        };
        return ErrorTips;
    }());
    jy.ErrorTips = ErrorTips;
    __reflect(ErrorTips.prototype, "jy.ErrorTips");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 简易的ToolTip
     * 只处理字符串类型的描述
     * @author 3tion
     */
    var SimToolTip = /** @class */ (function (_super) {
        __extends(SimToolTip, _super);
        function SimToolTip(maxWidth, maxHeight, corner, autoSize) {
            if (maxWidth === void 0) { maxWidth = 480; }
            if (maxHeight === void 0) { maxHeight = 800; }
            if (corner === void 0) { corner = 5; }
            var _this = _super.call(this) || this;
            _this._autoSize = autoSize;
            _this._corner = corner;
            _this.init(maxWidth, maxHeight, corner);
            return _this;
        }
        SimToolTip.prototype.init = function (maxWidth, maxHeight, corner) {
            var tf;
            this.tf = tf = new egret.TextField();
            var c2 = corner * 2;
            tf.width = maxWidth - c2;
            tf.height = maxHeight - c2;
            tf.size = 12;
            tf.x = corner;
            tf.y = corner;
            this.addChild(tf);
            this.drawRect(0, 0, maxWidth, maxHeight);
        };
        SimToolTip.prototype.setTipData = function (msg) {
            var tf = this.tf;
            if (msg != tf.text) {
                tf.text = msg;
                if (this._autoSize) {
                    var c2 = this._corner * 2;
                    var bgW = tf.textWidth + 2 * c2;
                    var bgH = tf.textHeight + 2 * c2;
                    this.drawRect(0, 0, bgW, bgH);
                }
            }
        };
        SimToolTip.prototype.drawRect = function (x, y, width, height) {
            var g = this.graphics;
            g.clear();
            g.lineStyle(1, 0xcccccc);
            g.beginFill(0, 0.7);
            g.drawRoundRect(x, y, width, height, this._corner);
            g.endFill();
        };
        SimToolTip.prototype.show = function (container, x, y) {
            if (x != undefined && y != undefined) {
                container.addChild(this);
                this.x = x;
                this.y = y;
            }
        };
        SimToolTip.prototype.hide = function () {
            jy.removeDisplay(this);
        };
        return SimToolTip;
    }(egret.Sprite));
    jy.SimToolTip = SimToolTip;
    __reflect(SimToolTip.prototype, "jy.SimToolTip", ["jy.IToolTip"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * ToolTip的数据
     * @author 3tion
     */
    var ToolTipData = /** @class */ (function () {
        function ToolTipData() {
        }
        ToolTipData.prototype.register = function (dis, msg, tooltip, container) {
            this.data = msg;
            this.con = container;
            if (this.tooltip != tooltip) {
                this.tooltip = tooltip;
            }
            if (this.target != dis) {
                this.clearDisListener(this.target);
                jy.Global.clearCallLater(this.showTip, this);
                dis.on("touchBegin" /* TOUCH_BEGIN */, this.checkTouch, this);
            }
        };
        ToolTipData.prototype.clearDisListener = function (dis) {
            dis.off("touchBegin" /* TOUCH_BEGIN */, this.checkTouch, this);
            dis.off("touchEnd" /* TOUCH_END */, this.touchEnd, this);
        };
        ToolTipData.prototype.onRecycle = function () {
            if (this.target) {
                this.clearDisListener(this.target);
                this.target = undefined;
            }
            jy.Global.clearCallLater(this.showTip, this);
            this.data = undefined;
            this.tooltip = undefined;
        };
        ToolTipData.prototype.checkTouch = function (e) {
            this.target.on("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            jy.Global.callLater(this.showTip, jy.ToolTipManager.touchTime, this);
        };
        ToolTipData.prototype.showTip = function () {
            this.target.off("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            this.tooltip.show(this.con);
        };
        ToolTipData.prototype.touchEnd = function (e) {
            this.target.off("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            jy.Global.clearCallLater(this.showTip, this);
        };
        return ToolTipData;
    }());
    jy.ToolTipData = ToolTipData;
    __reflect(ToolTipData.prototype, "jy.ToolTipData", ["jy.IRecyclable"]);
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 默认的Tip
     * 手指按下控件以后，弹出Tip进行显示
     * @author 3tion
     *
     */
    var ToolTipManager = /** @class */ (function () {
        function ToolTipManager() {
        }
        /**
         * 注册可视对象，消息和皮肤的绑定
         *
         * @static
         * @param {egret.DisplayObject} dis 添加Tip的目标
         * @param {*} msg 要显示的内容
         * @param {IToolTip} [tooltip] Tip的皮肤，如果不填，则使用默认皮肤
         * @return {boolean} true 注册成功  false注册失败
         */
        ToolTipManager.register = function (dis, msg, tooltip, container) {
            if (!tooltip) {
                tooltip = ToolTipManager.defaultTip;
                if (!tooltip) {
                    if (true) {
                        jy.ThrowError("没有注册ToolTip的皮肤，并且没有默认的ToolTip");
                    }
                    return false;
                }
            }
            var map = ToolTipManager._map;
            var data = map.get(dis);
            if (!data) {
                data = jy.recyclable(jy.ToolTipData);
                map.set(dis, data);
            }
            if (!container) {
                container = jy.GameEngine.instance.getLayer(9000 /* Tip */);
            }
            data.register(dis, msg, tooltip, container);
            return true;
        };
        /**
         * 显示Tip，如果msg有内容，刷新Tip上的内容
         *
         * @static
         * @param {egret.DisplayObject} dis
         * @param {*} [msg]
         */
        ToolTipManager.show = function (dis, msg, container) {
            var data = ToolTipManager._map.get(dis);
            if (msg) {
                data.data = msg;
            }
            var tooltip = data.tooltip;
            if (!tooltip) {
                tooltip = ToolTipManager.defaultTip;
            }
            if (tooltip) {
                tooltip.setTipData(data.data);
                if (!container) {
                    container = data.con;
                }
                tooltip.show(container);
                this._currentSkin = tooltip;
            }
        };
        /**
         * 刷新当前Tip绑定的内容，*`不改变显示状态`*
         * 如果要刷新并显示，请使用 ToolTipManager.show
         *
         * @static
         * @param {egret.DisplayObject} dis (description)
         * @param {*} msg (description)
         */
        ToolTipManager.refresh = function (dis, msg) {
            var data = ToolTipManager._map.get(dis);
            data.data = msg;
            var tooltip = data.tooltip;
            if (!tooltip) {
                tooltip = ToolTipManager.defaultTip;
            }
            if (tooltip) {
                tooltip.setTipData(data.data);
            }
        };
        /**
         * 移除视图和ToolTip的绑定
         *
         * @static
         * @param {egret.DisplayObject} dis 可视对象
         */
        ToolTipManager.remove = function (dis) {
            var data = ToolTipManager._map.get(dis);
            data.recycle();
        };
        /**
         * 按住多少毫秒后显示Tip
         *
         * @static
         * @type {number}
         */
        ToolTipManager.touchTime = 500;
        ToolTipManager._map = new Map();
        return ToolTipManager;
    }());
    jy.ToolTipManager = ToolTipManager;
    __reflect(ToolTipManager.prototype, "jy.ToolTipManager");
})(jy || (jy = {}));
var jy;
(function (jy) {
    var _$TDOpt = Object.freeze({ int: { x: 1, y: 1 } });
    /**
     * TouchDown显示对象放大效果
     */
    var TouchDown;
    (function (TouchDown) {
        /**
         * 绑定组件
         *
         * @param {TouchDownItem} item
         */
        function bind(item) {
            if (item) {
                item.on("touchBegin" /* TOUCH_BEGIN */, touchBegin);
            }
        }
        TouchDown.bind = bind;
        /**
         * 解绑组件
         *
         * @param {TouchDownItem} item
         */
        function loose(item) {
            if (item) {
                item.off("touchBegin" /* TOUCH_BEGIN */, touchBegin);
                clearEndListener(item);
            }
        }
        TouchDown.loose = loose;
        /**
         * 重置组件
         *
         * @export
         * @param {TouchDownItem} item
         */
        function reset(item) {
            var data = item.$_tdi;
            if (data) {
                var tween = data.tween, raw = data.raw;
                if (tween) {
                    jy.Global.removeTween(tween);
                }
                if (raw) {
                    var x = raw.x, y = raw.y, scaleX = raw.scaleX, scaleY = raw.scaleY;
                    item.x = x;
                    item.y = y;
                    item.scaleX = scaleX;
                    item.scaleY = scaleY;
                }
                item.$_tdi = undefined;
            }
        }
        TouchDown.reset = reset;
        function clearEndListener(item) {
            item.off("touchEnd" /* TOUCH_END */, touchEnd);
            item.off("touchCancel" /* TOUCH_CANCEL */, touchEnd);
            item.off("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, touchEnd);
            item.off("removedFromStage" /* REMOVED_FROM_STAGE */, touchEnd);
        }
        function touchBegin(e) {
            var target = e.target;
            target.on("touchEnd" /* TOUCH_END */, touchEnd);
            target.on("touchCancel" /* TOUCH_CANCEL */, touchEnd);
            target.on("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, touchEnd);
            target.on("removedFromStage" /* REMOVED_FROM_STAGE */, touchEnd);
            var data = target.$_tdi;
            if (data) {
                var tween = data.tween;
                if (tween) {
                    jy.Global.removeTween(tween);
                }
            }
            else {
                target.$_tdi = data = {};
                var x = target.x, y = target.y, scaleX = target.scaleX, scaleY = target.scaleY;
                data.raw = { x: x, y: y, scaleX: scaleX, scaleY: scaleY };
            }
            var raw = data.raw;
            data.tween = jy.Global.getTween(target, _$TDOpt).to({ x: raw.x - target.width * 0.0625 /* Multi */, y: raw.y - target.height * 0.0625 /* Multi */, scaleX: 1.125 /* Scale */ * raw.scaleX, scaleY: 1.125 /* Scale */ * raw.scaleY }, 100, jy.Ease.quadOut);
        }
        function touchEnd(e) {
            var target = e.target;
            clearEndListener(target);
            var raw = target.$_tdi;
            if (raw) {
                var tween = raw.tween;
                if (tween) {
                    jy.Global.removeTween(tween);
                }
                raw.tween = jy.Global.getTween(target, _$TDOpt)
                    .to(raw.raw, 100, jy.Ease.quadOut)
                    .call(endComplete, null, target);
            }
        }
        function endComplete(target) {
            target.$_tdi = undefined;
        }
    })(TouchDown = jy.TouchDown || (jy.TouchDown = {}));
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 多选分组
     *
     * @export
     * @class CheckBoxGroup
     * @extends {Group}
     * @author 3tion
     */
    var CheckBoxGroup = /** @class */ (function (_super) {
        __extends(CheckBoxGroup, _super);
        function CheckBoxGroup(maxSelected) {
            var _this = _super.call(this) || this;
            /**
             * 选中的选项
             *
             * @protected
             * @type {IGroupItem[]}
             */
            _this._selected = [];
            _this.maxSelected = maxSelected;
            return _this;
        }
        CheckBoxGroup.prototype.removeItem = function (item) {
            if (item) {
                this._list.remove(item);
                this._selected.remove(item);
                item.off("touchTap" /* TOUCH_TAP */, this.touchHandler, this);
                return item;
            }
        };
        CheckBoxGroup.prototype.$setSelectedItem = function (item) {
            if (!item) { //不改变当前选中
                return;
            }
            // 检查是否勾选
            var selected = this._selected;
            var changed, idx = -1;
            if (item.selected) {
                item.selected = false;
                selected.remove(item);
                idx = selected.length - 1;
                changed = true;
            }
            else {
                //未选中，检查当前选中的按钮是否达到最大数量
                var maxSelected = this.maxSelected || Infinity;
                if (selected.length < maxSelected) {
                    item.selected = true;
                    idx = selected.pushOnce(item);
                    changed = true;
                }
                else {
                    return this.dispatch(-1021 /* GROUP_FULL */);
                }
            }
            if (changed) {
                this._selectedIndex = idx;
                this._selectedItem = !~idx ? selected[idx] : undefined;
                return this.dispatch(-1020 /* GROUP_CHANGE */);
            }
        };
        Object.defineProperty(CheckBoxGroup.prototype, "selected", {
            /**
             * 获取选中的选项
             *
             * @readonly
             */
            get: function () {
                return this._selected;
            },
            enumerable: true,
            configurable: true
        });
        CheckBoxGroup.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this._selected.length = 0;
        };
        return CheckBoxGroup;
    }(jy.Group));
    jy.CheckBoxGroup = CheckBoxGroup;
    __reflect(CheckBoxGroup.prototype, "jy.CheckBoxGroup");
})(jy || (jy = {}));
var jy;
(function (jy) {
    /**
     * 绑定按钮和文本框，让文本框的点击，可以触发按钮的选中事件
     *
     * @export
     */
    jy.GroupItemButton = (function () {
        var TE = "touchTap" /* TOUCH_TAP */;
        var ButtonKey = "$gib$btn";
        var TextFieldKey = "$gib$txt";
        return {
            /**
             *
             * 绑定按钮和文本框
             * @param {Button} btn
             * @param {egret.TextField} txt
             */
            bind: function (btn, txt) {
                if (!txt[ButtonKey]) {
                    txt[ButtonKey] = btn;
                }
                else if (true) {
                    jy.ThrowError("\u91CD\u590D\u7ED1\u5B9A\u4E86\u6587\u672C\u6846\u548C\u6309\u94AE");
                }
                txt.touchEnabled = true;
                txt.on(TE, onTE);
                var old = btn[TextFieldKey];
                if (old) {
                    if (old[ButtonKey] == btn) {
                        delete old[ButtonKey];
                        old.off(TE, onTE);
                    }
                }
                btn[TextFieldKey] = txt;
            },
            /**
             * 接触按钮和文本框的绑定
             *
             * @param {Button} btn
             */
            loose: function (btn) {
                var txt = btn[TextFieldKey];
                if (txt) {
                    delete btn[TextFieldKey];
                    if (txt[ButtonKey] == btn) {
                        delete txt[ButtonKey];
                        txt.off(TE, onTE);
                    }
                }
            }
        };
        function onTE(e) {
            var txt = e.currentTarget;
            var btn = txt[ButtonKey];
            btn.dispatchEvent(e);
        }
    })();
})(jy || (jy = {}));
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
var jy;
(function (jy) {
    /**
     * tween的执行效果，参考页面：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html
     *
     * @export
     * @class Ease
     */
    var Ease = /** @class */ (function () {
        function Ease() {
        }
        /**
         * 根据起始值和终值，及当前进度率得到结果
         *
         * @static
         * @param {number} v0       起始值
         * @param {number} v1       终值
         * @param {number} ratio    进度率
         * @returns
         */
        Ease.getValue = function (v0, v1, ratio) {
            if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof v0 != "number")) {
                return ratio == 1 ? v1 : v0;
            }
            else {
                return v0 + (v1 - v0) * ratio;
            }
        };
        Ease.get = function (amount) {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            };
        };
        Ease.getPowIn = function (pow) {
            return function (t) {
                return Math.pow(t, pow);
            };
        };
        Ease.getPowOut = function (pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        };
        Ease.getPowInOut = function (pow) {
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            };
        };
        Ease.sineIn = function (t) {
            return 1 - Math.cos(t * Math.PI / 2);
        };
        Ease.sineOut = function (t) {
            return Math.sin(t * Math.PI / 2);
        };
        Ease.sineInOut = function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        };
        Ease.getBackIn = function (amount) {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            };
        };
        Ease.getBackOut = function (amount) {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            };
        };
        Ease.getBackInOut = function (amount) {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            };
        };
        Ease.circIn = function (t) {
            return -(Math.sqrt(1 - t * t) - 1);
        };
        Ease.circOut = function (t) {
            return Math.sqrt(1 - (--t) * t);
        };
        Ease.circInOut = function (t) {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        };
        Ease.bounceIn = function (t) {
            return 1 - Ease.bounceOut(1 - t);
        };
        Ease.bounceOut = function (t) {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            }
            else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            }
            else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            }
            else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        };
        Ease.bounceInOut = function (t) {
            if (t < 0.5)
                return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        };
        Ease.getElasticIn = function (amplitude, period) {
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / Math.PI2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Math.PI2 / period));
            };
        };
        Ease.getElasticOut = function (amplitude, period) {
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / Math.PI2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * Math.PI2 / period) + 1);
            };
        };
        Ease.getElasticInOut = function (amplitude, period) {
            return function (t) {
                var s = period / Math.PI2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1)
                    return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * Math.PI2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * Math.PI2 / period) * 0.5 + 1;
            };
        };
        Ease.quadIn = Ease.getPowIn(2);
        Ease.quadOut = Ease.getPowOut(2);
        Ease.quadInOut = Ease.getPowInOut(2);
        Ease.cubicIn = Ease.getPowIn(3);
        Ease.cubicOut = Ease.getPowOut(3);
        Ease.cubicInOut = Ease.getPowInOut(3);
        Ease.quartIn = Ease.getPowIn(4);
        Ease.quartOut = Ease.getPowOut(4);
        Ease.quartInOut = Ease.getPowInOut(4);
        Ease.quintIn = Ease.getPowIn(5);
        Ease.quintOut = Ease.getPowOut(5);
        Ease.quintInOut = Ease.getPowInOut(5);
        Ease.backIn = Ease.getBackIn(1.7);
        Ease.backOut = Ease.getBackOut(1.7);
        Ease.backInOut = Ease.getBackInOut(1.7);
        Ease.elasticIn = Ease.getElasticIn(1, 0.3);
        Ease.elasticOut = Ease.getElasticOut(1, 0.3);
        Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
        return Ease;
    }());
    jy.Ease = Ease;
    __reflect(Ease.prototype, "jy.Ease");
})(jy || (jy = {}));
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
var jy;
(function (jy) {
    var Tween = /** @class */ (function (_super) {
        __extends(Tween, _super);
        function Tween(target, props, pluginData, manager) {
            var _this = _super.call(this) || this;
            _this.loop = false;
            _this.duration = 0;
            _this._prevPos = -1;
            _this.position = null;
            _this._prevPosition = 0;
            _this._stepPosition = 0;
            _this.passive = false;
            _this.initialize(target, props, pluginData, manager);
            return _this;
        }
        Tween.prototype.initialize = function (target, props, pluginData, manager) {
            this.target = target;
            var oldManager = this._manager;
            if (oldManager && oldManager != manager) {
                oldManager.removeTweens(target);
            }
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.on(-1 /* TWEEN_CHANGE */, props.onChange, props.onChangeObj);
                if (props.override) {
                    manager.removeTweens(target);
                }
                this._int = props.int;
            }
            this._manager = manager;
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            this._actions = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                manager._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, 0 /* NONE */);
            }
        };
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
        Tween.prototype.setPosition = function (value, actionsMode) {
            if (actionsMode === void 0) { actionsMode = 1 /* LOOP */; }
            if (value < 0) {
                value = 0;
            }
            // normalize position:
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            // handle tweens:
            if (this.target) {
                if (end) {
                    // addresses problems with an ending zero length step.
                    this._updateTargetProps(null, 1);
                }
                else if (this._steps.length > 0) {
                    // find our new tween index:
                    for (var i = 0, l = this._steps.length; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    var step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                }
            }
            if (end) {
                this.setPaused(true);
            }
            // run actions:
            if (actionsMode != 0 /* NONE */ && this._actions.length > 0) {
                if (this._useTicks) {
                    // only run the actions we landed on.
                    this._runActions(t, t);
                }
                else if (actionsMode == 1 /* LOOP */ && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                }
                else {
                    this._runActions(prevPos, t);
                }
            }
            this.dispatch(-1 /* TWEEN_CHANGE */);
            return end;
        };
        Tween.prototype._runActions = function (startPos, endPos, includeStart) {
            if (includeStart === void 0) { includeStart = false; }
            var sPos = startPos;
            var ePos = endPos;
            var i = -1;
            var j = this._actions.length;
            var k = 1;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                var action = this._actions[i];
                var pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                }
            }
        };
        Tween.prototype._updateTargetProps = function (step, ratio) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                //不更新props.
                if (this.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof v0 != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = this._manager._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    if (this._int && this._int[n])
                        v = Math.round(v);
                    this.target[n] = v;
                }
            }
        };
        Tween.prototype._addStep = function (o) {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        Tween.prototype._appendQueueProps = function (o) {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this.target[n];
                    //设置plugins
                    if (arr = this._manager._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = this._manager._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        };
        Tween.prototype._addAction = function (o) {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        };
        Tween.prototype._set = function (props, o) {
            for (var n in props) {
                o[n] = props[n];
            }
        };
        /**
         * 暂停或者播放tween
         * Pauses or plays this tween.
         * @method setPaused
         * @param {Boolean} [value=true] Indicates whether the tween should be paused (`true`) or played (`false`). true 暂停   false 播放
         * @return {Tween} This tween instance (for chaining calls)
         */
        Tween.prototype.setPaused = function (value) {
            this.paused = value;
            this._manager._register(this, !value);
            return this;
        };
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
        Tween.prototype.wait = function (duration, passive) {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._curQueueProps.clone();
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        };
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
        Tween.prototype.to = function (props, duration, ease) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({ d: duration || 0, p0: this._curQueueProps.clone(), e: ease, p1: this._appendQueueProps(props).clone() });
        };
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
        Tween.prototype.call = function (callback, thisObj) {
            var params = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                params[_i - 2] = arguments[_i];
            }
            return this._addAction({ f: callback, p: params, o: thisObj ? thisObj : this.target });
        };
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
        Tween.prototype.set = function (props, target) {
            return this._addAction({ f: this._set, o: this, p: [props, target || this.target] });
        };
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
        Tween.prototype.play = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, false);
        };
        /**
         * 排列一个tween的暂停操作，如果tween不赋值，则暂停自己
         * Queues an action to pause the specified tween.
         * @method pause
         * @param {Tween} tween The tween to pause. If null, it pauses this tween.
         * @return {Tween} This tween instance (for chaining calls)
         */
        Tween.prototype.pause = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, true);
        };
        /**
         * 进行一次tick
         * Advances this tween by the specified amount of time in milliseconds (or ticks if`useTicks` is `true`).
         * This is normally called automatically by the Tween engine (via {{#crossLink "Tween/tick"}}{{/crossLink}}), but is
         * exposed for advanced uses.
         * @method tick
         * @param {Number} delta The time to advance in milliseconds (or ticks if `useTicks` is `true`).
         */
        Tween.prototype.tick = function (delta) {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        Tween.prototype.onRecycle = function () {
            this._int = undefined;
        };
        /**
         * Constant returned by plugins to tell the tween not to use default assignment.
         * @property IGNORE
         * @type Object
         * @static
         */
        Tween.IGNORE = {};
        return Tween;
    }(egret.EventDispatcher));
    jy.Tween = Tween;
    __reflect(Tween.prototype, "jy.Tween");
})(jy || (jy = {}));
var jy;
(function (jy) {
    jy.MotionGuidePlugin = (function () {
        return {
            priority: 0,
            install: function (manager) {
                manager.installPlugin(this, ["guide", "x", "y", "rotation"]);
            },
            init: function (tween, prop, value) {
                var target = tween.target;
                if (target.x == undefined) {
                    target.x = 0;
                }
                if (target.y == undefined) {
                    target.y = 0;
                }
                if (target.rotation == undefined) {
                    target.rotation = 0;
                }
                if (prop == "rotation") {
                    tween.__needsRot = true;
                }
                return prop == "guide" ? null : value;
            },
            step: function (tween, prop, startValue, endValue, injectProps) {
                // other props
                if (prop == "rotation") {
                    tween.__rotGlobalS = startValue;
                    tween.__rotGlobalE = endValue;
                    testRotData(tween, injectProps);
                }
                if (prop != "guide") {
                    return endValue;
                }
                // guide only information - Start -
                var temp, data = endValue;
                if (!data.hasOwnProperty("path")) {
                    data.path = [];
                }
                var path = data.path;
                if (!data.hasOwnProperty("end")) {
                    data.end = 1;
                }
                if (!data.hasOwnProperty("start")) {
                    data.start = (startValue && startValue.hasOwnProperty("end") && startValue.path === path) ? startValue.end : 0;
                }
                // Figure out subline information
                if (data.hasOwnProperty("_segments") && data._length) {
                    return endValue;
                }
                var l = path.length;
                var accuracy = 10; // Adjust to improve line following precision but sacrifice performance (# of seg)
                if (l >= 6 && (l - 2) % 4 == 0) { // Enough points && contains correct number per entry ignoring start
                    data._segments = [];
                    data._length = 0;
                    for (var i = 2; i < l; i += 4) {
                        var sx = path[i - 2], sy = path[i - 1];
                        var cx = path[i + 0], cy = path[i + 1];
                        var ex = path[i + 2], ey = path[i + 3];
                        var oldX = sx, oldY = sy;
                        var tempX, tempY, total = 0;
                        var sublines = [];
                        for (var j = 1; j <= accuracy; j++) {
                            var t = j / accuracy;
                            var inv = 1 - t;
                            tempX = inv * inv * sx + 2 * inv * t * cx + t * t * ex;
                            tempY = inv * inv * sy + 2 * inv * t * cy + t * t * ey;
                            total += sublines[sublines.push(Math.sqrt((temp = tempX - oldX) * temp + (temp = tempY - oldY) * temp)) - 1];
                            oldX = tempX;
                            oldY = tempY;
                        }
                        data._segments.push(total);
                        data._segments.push(sublines);
                        data._length += total;
                    }
                }
                else {
                    throw ("invalid 'path' data, please see documentation for valid paths");
                }
                // Setup x/y tweens
                temp = data.orient;
                data.orient = true;
                var o = {};
                calc(data, data.start, o);
                tween.__rotPathS = Number(o.rotation.toFixed(5));
                calc(data, data.end, o);
                tween.__rotPathE = Number(o.rotation.toFixed(5));
                data.orient = false; //here and now we don't know if we need to
                calc(data, data.end, injectProps);
                data.orient = temp;
                // Setup rotation properties
                if (!data.orient) {
                    return endValue;
                }
                tween.__guideData = data;
                testRotData(tween, injectProps);
                return endValue;
            },
            tween: function (tween, prop, value, startValues, endValues, ratio, wait, end) {
                var data = endValues.guide;
                if (data == undefined || data === startValues.guide) {
                    return value;
                }
                if (data.lastRatio != ratio) {
                    // first time through so calculate what I need to
                    var t = ((data.end - data.start) * (wait ? data.end : ratio) + data.start);
                    calc(data, t, tween.target);
                    switch (data.orient) {
                        case "cw": // mix in the original rotation
                        case "ccw":
                        case "auto":
                            tween.target.rotation += data.rotOffS + data.rotDelta * ratio || 0;
                            break;
                        case "fixed": // follow fixed behaviour to solve potential issues
                        default:
                            tween.target.rotation += data.rotOffS || 0;
                            break;
                    }
                    data.lastRatio = ratio;
                }
                if (prop == "rotation" && ((!data.orient) || data.orient == "false")) {
                    return value;
                }
                return tween.target[prop];
            }
        };
        function testRotData(tween, injectProps) {
            // no rotation informat? if we need it come back, if we don't use 0 & ensure we have guide data
            if (tween.__rotGlobalS === undefined || tween.__rotGlobalE === undefined) {
                if (tween.__needsRot) {
                    return;
                }
                var _curQueueProps = tween._curQueueProps;
                if (_curQueueProps.rotation !== undefined) {
                    tween.__rotGlobalS = tween.__rotGlobalE = _curQueueProps.rotation;
                }
                else {
                    tween.__rotGlobalS = tween.__rotGlobalE = injectProps.rotation = tween.target.rotation || 0;
                }
            }
            if (tween.__guideData === undefined) {
                return;
            }
            // Process rotation properties
            var data = tween.__guideData;
            var rotGlobalD = tween.__rotGlobalE - tween.__rotGlobalS || 0;
            var rotPathD = tween.__rotPathE - tween.__rotPathS || 0;
            var rot = rotGlobalD - rotPathD || 0;
            if (data.orient == "auto") {
                if (rot > 180) {
                    rot -= 360;
                }
                else if (rot < -180) {
                    rot += 360;
                }
            }
            else if (data.orient == "cw") {
                while (rot < 0) {
                    rot += 360;
                }
                if (rot == 0 && rotGlobalD > 0 && rotGlobalD != 180) {
                    rot += 360;
                }
            }
            else if (data.orient == "ccw") {
                rot = rotGlobalD - ((rotPathD > 180) ? (360 - rotPathD) : (rotPathD)); // sign flipping on path
                while (rot > 0) {
                    rot -= 360;
                }
                if (rot == 0 && rotGlobalD < 0 && rotGlobalD != -180) {
                    rot -= 360;
                }
            }
            data.rotDelta = rot;
            data.rotOffS = tween.__rotGlobalS - tween.__rotPathS;
            // reset
            tween.__rotGlobalS = tween.__rotGlobalE = tween.__guideData = tween.__needsRot = undefined;
        }
        function calc(data, ratio, target) {
            if (data._segments == undefined) {
                throw ("Missing critical pre-calculated information, please file a bug");
            }
            if (target == undefined) {
                target = { x: 0, y: 0, rotation: 0 };
            }
            var seg = data._segments;
            var path = data.path;
            // find segment
            var pos = data._length * ratio;
            var cap = seg.length - 2;
            var n = 0;
            while (pos > seg[n] && n < cap) {
                pos -= seg[n];
                n += 2;
            }
            // find subline
            var sublines = seg[n + 1];
            var i = 0;
            cap = sublines.length - 1;
            while (pos > sublines[i] && i < cap) {
                pos -= sublines[i];
                i++;
            }
            var t = (i / ++cap) + (pos / (cap * sublines[i]));
            // find x/y
            n = (n * 2) + 2;
            var inv = 1 - t;
            target.x = inv * inv * path[n - 2] + 2 * inv * t * path[n + 0] + t * t * path[n + 2];
            target.y = inv * inv * path[n - 1] + 2 * inv * t * path[n + 1] + t * t * path[n + 3];
            // orientation
            if (data.orient) {
                target.rotation = 57.2957795 * Math.atan2((path[n + 1] - path[n - 1]) * inv + (path[n + 3] - path[n + 1]) * t, (path[n + 0] - path[n - 2]) * inv + (path[n + 2] - path[n + 0]) * t);
            }
            return target;
        }
        ;
    })();
})(jy || (jy = {}));
