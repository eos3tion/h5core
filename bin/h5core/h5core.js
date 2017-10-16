var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 对数字进行补0操作
 * @param value 要补0的数值
 * @param length 要补的总长度
 * @return 补0之后的字符串
 */
function zeroize(value, length) {
    if (length === void 0) { length = 2; }
    var str = "" + value;
    var zeros = "";
    for (var i = 0, len = length - str.length; i < len; i++) {
        zeros += "0";
    }
    return zeros + str;
}
Object.defineProperties(Object.prototype, {
    clone: {
        value: function () {
            var o = {};
            for (var n in this) {
                o[n] = this[n];
            }
            return o;
        },
        writable: true
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
            return;
        },
        writable: true
    },
    copyto: {
        value: function (to) {
            for (var p in this) {
                var data = to.getPropertyDescriptor(p);
                if (!data || (data.set || data.writable)) {
                    to[p] = this[p];
                }
            }
        },
        writable: true
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
                if (this[key] != checker[key]) {
                    return false;
                }
            }
            return true;
        },
        writable: true
    }
});
Object.defineProperties(Function.prototype, {
    isSubClass: {
        value: function (testBase) {
            if (typeof testBase !== "function") {
                return false;
            }
            var base = this.prototype;
            var flag = false;
            while (base !== null && base !== Object) {
                if (base === testBase) {
                    flag = true;
                    break;
                }
                base = base.prototype;
            }
            return true;
        },
        writable: true
    }
});
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
if (!Number.isSafeInteger) {
    Number.isSafeInteger = function (value) { return value < 9007199254740991 /*Number.MAX_SAFE_INTEGER*/ && value >= -9007199254740991; }; /*Number.MIN_SAFE_INTEGER*/
}
Object.defineProperties(Number.prototype, {
    zeroize: {
        value: function (length) { return zeroize(this, length); },
        writable: true
    },
    between: {
        value: function (min, max) { return min <= this && max >= this; },
        writable: true
    }
});
Object.defineProperties(String.prototype, {
    zeroize: {
        value: function (length) { return zeroize(this, length); },
        writable: true
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
                        if (handler) {
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
        },
        writable: true
    },
    hash: {
        value: function () {
            var len = this.length;
            var hash = 5381;
            for (var i = 0; i < len; i++) {
                hash += (hash << 5) + this.charCodeAt(i);
            }
            return hash & 0x7fffffff;
        },
        writable: true
    },
    trueLength: {
        value: function () {
            var arr = this.match(/[\u2E80-\u9FBF]/ig);
            return this.length + (arr ? arr.length : 0);
        },
        writable: true
    }
});
String.zeroize = zeroize;
String.regSubHandler = function (key, handler) {
    if (true) {
        if (handler.length != 1) {
            junyou.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u53C2\u6570\u6570\u91CF\u5FC5\u987B\u4E3A\u4E00\u4E2A\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack + "\n\u51FD\u6570\u5185\u5BB9\uFF1A" + handler.toString());
        }
        if (key in this.subHandler) {
            junyou.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u6CE8\u518C\u4E86\u91CD\u590D\u7684key[" + key + "]\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack);
        }
    }
    this.subHandler[key] = handler;
};
Object.defineProperties(Date.prototype, {
    format: {
        value: function (mask, local) {
            var d = this;
            return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,2}|m{1,2}|yy(?:yy)?|([hHMs])\1?)/g, function ($0) {
                switch ($0) {
                    case "d": return gd();
                    case "dd": return zeroize(gd());
                    case "M": return gM() + 1;
                    case "MM": return zeroize(gM() + 1);
                    case "yy": return (gy() + "").substr(2);
                    case "yyyy": return gy();
                    case "h": return gH() % 12 || 12;
                    case "hh": return zeroize(gH() % 12 || 12);
                    case "H": return gH();
                    case "HH": return zeroize(gH());
                    case "m": return gm();
                    case "mm": return zeroize(gm());
                    case "s": return gs();
                    case "ss": return zeroize(gs());
                    default: return $0.substr(1, $0.length - 2);
                }
            });
            function gd() { return local ? d.getDate() : d.getUTCDate(); }
            function gM() { return local ? d.getMonth() : d.getUTCMonth(); }
            function gy() { return local ? d.getFullYear() : d.getUTCFullYear(); }
            function gH() { return local ? d.getHours() : d.getUTCHours(); }
            function gm() { return local ? d.getMinutes() : d.getUTCMinutes(); }
            function gs() { return local ? d.getSeconds() : d.getUTCSeconds(); }
        },
        writable: true
    }
});
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
Object.defineProperties(Array.prototype, {
    cloneTo: {
        value: function (b) {
            b.length = this.length;
            var len = this.length;
            b.length = len;
            for (var i = 0; i < len; i++) {
                b[i] = this[i];
            }
        },
        writable: true
    },
    appendTo: {
        value: function (b) {
            var len = this.length;
            for (var i = 0; i < len; i++) {
                b.push(this[i]);
            }
        },
        writable: true
    },
    pushOnce: {
        value: function (t) {
            var idx = this.indexOf(t);
            if (!~idx) {
                idx = this.length;
                this[idx] = t;
            }
            return idx;
        },
        writable: true
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
                junyou.ThrowError("doSort\u53C2\u6570\u4E0D\u80FD\u8D85\u8FC72");
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
        },
        writable: true
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
                            junyou.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u5E94\u4E3Aobject," + typea + "    " + typeb);
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
                                junyou.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u4E00\u81F4," + typea + "    " + typeb);
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
        },
        writable: true
    }
});
var junyou;
(function (junyou) {
    function is(instance, ref) {
        return egret.is(instance, egret.getQualifiedClassName(ref));
    }
    junyou.is = is;
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
    junyou.removeDisplay = removeDisplay;
})(junyou || (junyou = {}));
/****************************************Map********************************************/
if (typeof window["Map"] == "undefined" || !window["Map"]) {
    /**
    * 为了兼容低版本浏览器，使用数组实现的map
    * @author 3tion
    *
    */
    var PolyfillMap = (function () {
        function PolyfillMap() {
            this._keys = [];
            this._values = [];
            this._size = 0;
        }
        PolyfillMap.prototype.set = function (key, value) {
            var keys = this._keys;
            var idx = keys.indexOf(key);
            if (~idx) {
                this._values[idx] = value;
            }
            else {
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
            if (~idx) {
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
    window["Map"] = PolyfillMap;
}
var egret;
(function (egret) {
    (function () {
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
            var values = this.$Bitmap;
            var bmd = values[1 /* image */];
            if (bmd) {
                values[13 /* sourceWidth */] = bmd.width;
                values[14 /* sourceHeight */] = bmd.height;
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
            this.textFlow = value ? htmlTextParser.parser(value) : junyou.Temp.EmptyArray;
        };
        var ept = egret.EventDispatcher.prototype;
        ept.removeAllListeners = function () {
            var values = this.$EventDispatcher;
            values[1 /**eventsMap */] = {};
            values[2 /**captureEventsMap */] = {};
        };
        ept.removeListeners = function (type, useCapture) {
            var eventMap = this.$getEventMap(useCapture);
            var list = eventMap[type];
            if (list) {
                list.length = 0;
            }
        };
        ept.on = ept.addEventListener;
        ept.off = ept.removeEventListener;
        ept.hasListen = ept.hasEventListener;
        ept.dispatch = ept.dispatchEventWith;
        // DisplayObject重写了EventDispatcher的removeEventListener
        var dpt = egret.DisplayObject.prototype;
        dpt.off = dpt.removeEventListener;
        dpt.removeListeners = function (type, useCapture) {
            var eventMap = this.$getEventMap(useCapture);
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
            ept.removeListeners.call(this, type, useCapture);
        };
        dpt.removeAllListeners = function () {
            var values = this.$EventDispatcher;
            values[1 /**eventsMap */] = {};
            values[2 /**captureEventsMap */] = {};
            egret.DisplayObject.$enterFrameCallBackList.remove(this);
            egret.DisplayObject.$renderCallBackList.remove(this);
        };
        egret.Graphics.prototype.drawRectangle = function (rect) {
            this.drawRect(rect.x, rect.y, rect.width, rect.height);
        };
    })();
})(egret || (egret = {}));
var junyou;
(function (junyou) {
    /**
     * Mediator和Proxy的基类
     * @author 3tion
     *
     */
    var FHost = (function () {
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
                    var ref = idp[key];
                    if (typeof ref === "object") {
                        proxyName = junyou.Facade.getNameOfInline(ref);
                    }
                    else {
                        proxyName = ref;
                    }
                    var proxy = junyou.proxyCall(proxyName);
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
                this._asyncHelper = _asyncHelper = new junyou.AsyncHelper();
                _asyncHelper._ready = this.isReady;
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
                this._dependerHelper = new junyou.DependerHelper(this, this.dependerReadyCheck);
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
    junyou.FHost = FHost;
    __reflect(FHost.prototype, "junyou.FHost", ["junyou.IDepender", "junyou.IAsync"]);
    /**
     *
     * 附加依赖的Proxy
     * @export
     * @param {({ new (): IAsync } | string)} ref 如果注册的是Class，必须是Inline方式注册的Proxy
     * @returns
     */
    function __dependProxy(ref) {
        return function (target, key) {
            var _injectProxys = target._injectProxys;
            if (!_injectProxys) {
                target._injectProxys = _injectProxys = {};
            }
            _injectProxys[key] = ref;
        };
    }
    junyou.__dependProxy = __dependProxy;
})(junyou || (junyou = {}));
(function (junyou) {
    /**
     *
     * 附加依赖的Proxy
     * @export
     * @param {({ new (): IAsync } | string)} ref
     * @returns
     */
    junyou.d_dependProxy = junyou.__dependProxy;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 基础创建器
     * @author 3tion
     *
     */
    var BaseCreator = (function () {
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
            return junyou.singleton(junyou.SuiResManager).getElement(this._suiData, data);
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
            if (t instanceof junyou.Component) {
                t.init(this);
            }
            if (this._baseData) {
                junyou.SuiResManager.initBaseData(t, this._baseData);
            }
            return t;
        };
        return BaseCreator;
    }());
    junyou.BaseCreator = BaseCreator;
    __reflect(BaseCreator.prototype, "junyou.BaseCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于处理接收flash软件制作的UI，导出的数据，仿照eui
     * 不过简化eui的一些layout的支持
     * 按目前情况看，不太会制作复杂排版的ui，父容器不做统一的测量和重新布局
     * 都会基于固定大小(传奇世界H5，采用480×800，viewport设置为不可缩放，宽度基于设备的)
     * @author 3tion
     *
     */
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component() {
            return _super.call(this) || this;
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
            handler.call(this, "addedToStage" /* ADDED_TO_STAGE */, this.awake, this);
            handler.call(this, "removedFromStage" /* REMOVED_FROM_STAGE */, this.sleep, this);
        };
        Component.prototype.awake = function () {
        };
        Component.prototype.sleep = function () {
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
                var r = this._creator.size;
                var g = this.graphics;
                g.lineStyle(2, 0x00ff00);
                g.beginFill(0xff, 0.3);
                g.drawRect(r.x, r.y, r.width, r.height);
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
        Object.defineProperty(Component.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                if (this._enabled != value) {
                    this.$setEnabled(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.$setEnabled = function (value) {
            this._enabled = value;
            this.touchEnabled = value;
            this.touchChildren = value;
            if (this._useDisableFilter) {
                if (value) {
                    this.filters = undefined;
                }
                else {
                    this.filters = junyou.FilterUtils.gray;
                }
            }
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
    junyou.Component = Component;
    __reflect(Component.prototype, "junyou.Component");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 单位动作
     * @author 3tion
     *
     */
    var UnitAction = (function () {
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
                junyou.ThrowError("\u672A\u5B9E\u73B0\u52A8\u4F5C{mountType:" + mountType + "}");
            }
        };
        /**
         * 播放动作
         */
        UnitAction.prototype.start = function (unit, now) {
            this._isEnd = false;
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
    junyou.UnitAction = UnitAction;
    __reflect(UnitAction.prototype, "junyou.UnitAction");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 限制列队
     * @author 3tion
     */
    var LimitQueue = (function () {
        function LimitQueue() {
            this._queue = [];
        }
        Object.defineProperty(LimitQueue.prototype, "listener", {
            get: function () {
                return this._listener;
            },
            set: function (value) {
                this._listener = value;
            },
            enumerable: true,
            configurable: true
        });
        LimitQueue.prototype.addLimiter = function (item) {
            var queue = this._queue;
            if (queue.indexOf(item) != -1) {
                return false;
            }
            item.setState(this._current);
            queue.push(item);
            return true;
        };
        /**
         *
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
            var lm = this._listener;
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
            return false;
        };
        return LimitQueue;
    }());
    junyou.LimitQueue = LimitQueue;
    __reflect(LimitQueue.prototype, "junyou.LimitQueue", ["junyou.ILimit"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 临时对象
     * @author 3tion
     *
     */
    junyou.Temp = {
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
                junyou.ThrowError("\u9700\u8981\u88AB\u66FF\u6362\u7684\u65B9\u6CD5\uFF0C\u6CA1\u6709\u88AB\u66FF\u6362\uFF0C\u5806\u6808\u4FE1\u606F\uFF1A" + new Error().stack);
            }
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
    * GameLayer
    * 用于后期扩展
    */
    var GameLayer = (function (_super) {
        __extends(GameLayer, _super);
        function GameLayer(id) {
            var _this = _super.call(this) || this;
            _this.id = id;
            return _this;
        }
        return GameLayer;
    }(egret.Sprite));
    junyou.GameLayer = GameLayer;
    __reflect(GameLayer.prototype, "junyou.GameLayer");
    /**
     * 需要对子对象排序的层
     */
    var SortedLayer = (function (_super) {
        __extends(SortedLayer, _super);
        function SortedLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SortedLayer.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            if ("depth" in child) {
                junyou.GameEngine.invalidateSort();
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
    }(GameLayer));
    junyou.SortedLayer = SortedLayer;
    __reflect(SortedLayer.prototype, "junyou.SortedLayer");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 基础渲染器
     * @author 3tion
     *
     */
    var BaseRender = (function () {
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
        BaseRender.onSlowRender = function () {
            junyou.dispatch(-1996 /* SlowRender */);
        };
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
                if (delta > 2000) {
                    nextRenderTime = now;
                    renderedTime = now;
                    if (true) {
                        console.log("Render\u4E0A\u6B21\u6267\u884C\u65F6\u95F4\u548C\u5F53\u524D\u65F6\u95F4\u5DEE\u503C\u8FC7\u957F[" + delta + "]\uFF0C\u53EF\u4EE5\u6267\u884C[" + delta / actionInfo.totalTime + "\u6B21\u603B\u5E8F\u5217]");
                    }
                    if (BaseRender.dispatchSlowRender) {
                        junyou.Global.callLater(BaseRender.onSlowRender);
                    }
                }
                var frames_1 = actionInfo.frames;
                //当前帧
                var idx = this.idx;
                //最后一帧
                var flen = frames_1.length - 1;
                var ps = this.playSpeed * BaseRender.globalPlaySpeed;
                var frame = void 0;
                if (ps > 0) {
                    ps = 1 / ps;
                    if (ps < 0.01) {
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
                else {
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
    junyou.BaseRender = BaseRender;
    __reflect(BaseRender.prototype, "junyou.BaseRender", ["junyou.IDrawInfo"]);
})(junyou || (junyou = {}));
/**
 * 资源打包信息
 * AS3的版本中实现了5种打包方式
 * H5中实现了2种（2 按动作打包，4 单方向单动作打包），不过后面只会使用4（单方向单动作）进行打包，其他方式弃用
 * @author 3tion
 */
var junyou;
(function (junyou) {
    // /**
    //  * 打包类型
    //  */
    // const enum PakSaveType {
    //     // /**全部打包 (弃用)*/
    //     // PAK_ALL = 0,
    //     // /**1 按方向打包 (弃用)*/
    //     // PAK_BY_DIRECTION = 1,
    //     // /**2 按动作打包 (弃用)*/
    //     // PAK_BY_ACTION = 2,
    //     // /**3 混合打包 (弃用)*/
    //     // PAK_COMPLEX = 3,
    //     /**
    //      * 单方向单动作
    //      */
    //     PAK_ONE_A_D = 4
    // }
    // var parsers: { [index: number]: { new (key: string): SplitInfo } };
    // /**
    //  * 获取处理器
    //  */
    // function getParsers(t: number): { new (key: string): SplitInfo } {
    //     if (!parsers) {
    //         parsers = {};
    //         // 后续H5项目只使用PAK_ONE_A_D一种打包方式
    //         // 其他方式弃用
    //         // parsers[PakSaveType.PAK_BY_ACTION] = ActionSInfo;
    //         parsers[PakSaveType.PAK_ONE_A_D] = OneADSInfo;
    //     }
    //     return parsers[t];
    // }
    /**
     * 存储pst信息
     */
    var PstInfo = (function () {
        function PstInfo() {
        }
        /**
         * 获取施法点
         * @param {number} action 动作标识
         * @param {number} direction 方向
         * @return {egret.Point} 如果有施法点
         */
        PstInfo.prototype.getCastPoint = function (action, direction) {
            if (this.castPoints) {
                var pt = this.castPoints[junyou.PstUtils.getADKey(action, direction)];
                if (pt) {
                    return pt;
                }
            }
            return;
        };
        PstInfo.prototype.init = function (key, data) {
            this.key = key;
            this._resources = {};
            // let parserRef = getParsers(data[0]);
            // if (!parserRef) {
            //     return;
            // }
            // let parser = new parserRef(key);
            var parser = new OneADSInfo(key);
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
                                var pt = new egret.Point();
                                castPoints[junyou.PstUtils.getADKey(+a, d)] = pt;
                                pt.x = +pInfo[0];
                                pt.y = +pInfo[1];
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
                res = new junyou.UnitResource(uri, this.splitInfo);
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
    junyou.PstInfo = PstInfo;
    __reflect(PstInfo.prototype, "junyou.PstInfo");
    /**
     * 资源打包分隔信息
     */
    var SplitInfo = (function () {
        function SplitInfo(key) {
            this._key = key;
        }
        /**
         * 处理帧数据
         * @param data
         */
        SplitInfo.prototype.parseFrameData = function (data) {
            var frames = {};
            for (var key in data) {
                var a = +key;
                frames[a] = junyou.getActionInfo(data[a], a);
            }
            return frames;
        };
        return SplitInfo;
    }());
    junyou.SplitInfo = SplitInfo;
    __reflect(SplitInfo.prototype, "junyou.SplitInfo");
    junyou.PstUtils = {
        /**
         * 得到 A(动作)D(方向)的标识
         *
         * @static
         * @param {number} action A(动作)标识
         * @param {number} direction D(方向)标识
         * @returns {number} A(动作)D(方向)的标识
         */
        getADKey: function (action, direction) {
            return action << 8 | direction;
        },
        /**
         * 从A(动作)D(方向)的标识中获取 A(动作)标识
         *
         * @static
         * @param {number} adKey A(动作)D(方向)的标识
         * @returns {number} A(动作)标识
         */
        getAFromADKey: function (adKey) {
            return adKey >> 8;
        },
        /**
         * 从A(动作)D(方向)的标识中获取 D(方向)标识
         *
         * @static
         * @param {number} adKey A(动作)D(方向)的标识
         * @returns {number} D(方向)标识
         */
        getDFromADKey: function (adKey) {
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
    var OneADSInfo = (function (_super) {
        __extends(OneADSInfo, _super);
        function OneADSInfo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OneADSInfo.prototype.parseFrameData = function (data) {
            this._resDict = {};
            var _adDict = {};
            this.adDict = _adDict;
            var frames = {};
            for (var key in data) {
                var a = +key;
                frames[a] = junyou.getActionInfo(data[a], a);
                for (var d = 0; d < 5; d++) {
                    var res = this.getResource(d, a);
                    _adDict[res] = [junyou.PstUtils.getADKey(a, d)];
                }
            }
            return frames;
        };
        OneADSInfo.prototype.parseSplitInfo = function (infos) {
            this._n = infos.n || "{a}{d}";
            this._a = infos.a || _pst$a;
            this._d = infos.d;
        };
        OneADSInfo.prototype.getResource = function (direction, action) {
            var key = junyou.PstUtils.getADKey(action, direction);
            var res = this._resDict[key];
            if (!res) {
                this._resDict[key] = res = this._n.substitute({ "f": this._key, "a": getRep(action, this._a), "d": getRep(direction, this._d) });
            }
            return res;
            function getRep(data, repArr) {
                var str = data + "";
                if (repArr && (data in repArr)) {
                    str = repArr[data];
                }
                return str;
            }
        };
        return OneADSInfo;
    }(SplitInfo));
    junyou.OneADSInfo = OneADSInfo;
    __reflect(OneADSInfo.prototype, "junyou.OneADSInfo");
    // /**
    //  * 基于动作打包的分隔数据
    //  * @deprecated 已弃用
    //  */
    // export class ActionSInfo extends SplitInfo {
    //     parseSplitInfo(infos: any[]) {
    //         var flag = true;
    //         if (infos) {
    //             this._resDict = {};
    //             this._subReses = [];
    //             var _adDict: { [index: string]: number[] } = {};
    //             this.adDict = _adDict;
    //             var _resDict = this._resDict;
    //             var _subReses = this._subReses;
    //             var len = infos.length;
    //             for (let i = 0; i < len; i++) {
    //                 let pak = infos[i][0];
    //                 let acts = pak.a;
    //                 if (acts) {
    //                     let dlen = acts.length;
    //                     if (dlen) {
    //                         flag = false;
    //                         let res = this.getFileName(pak);
    //                         let arr = _adDict[res];
    //                         if (!arr) {
    //                             arr = [];
    //                             _adDict[res] = arr;
    //                         }
    //                         if (res && _subReses.indexOf(res) == -1) {
    //                             _subReses.push(res);
    //                         }
    //                         for (let j = 0; j < dlen; j++) {
    //                             let a = acts[j];
    //                             _resDict[a] = res;
    //                             //push所有动作的数据
    //                             arr.push(SplitInfo.getADKey(a, 0), SplitInfo.getADKey(a, 1), SplitInfo.getADKey(a, 2), SplitInfo.getADKey(a, 3), SplitInfo.getADKey(a, 4));
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         if (flag) {
    //             throw new Error("no pak split info");
    //         }
    //     }
    //     getFileName(pakInfo: any) {
    //         var dirs = pakInfo.a;
    //         return PakSaveType.PAK_BY_ACTION + "-" + dirs.join("_");
    //     }
    //     getResource(direction: number, action: number): string {
    //         return this._resDict[action];
    //     }
    // }
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * 震动的基本实现
     * @export
     * @class BaseShake
     * @implements {Shake}
     * @author 3tion
     */
    var BaseShake = (function () {
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
        };
        BaseShake.prototype.start = function () {
            if (this._target) {
                this._shaking = true;
            }
        };
        BaseShake.prototype.end = function () {
            if (this._shaking) {
                var target = this._target;
                target.x = this._cx;
                target.y = this._cy;
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
    junyou.BaseShake = BaseShake;
    __reflect(BaseShake.prototype, "junyou.BaseShake", ["junyou.Shake"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    junyou.expandInstance = expandInstance;
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
    function expand(clazzA, clazzB) {
        var keys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keys[_i - 2] = arguments[_i];
        }
        var pt = clazzA.prototype;
        var bpt = clazzB.prototype;
        for (var _a = 0, _b = Object.getOwnPropertyNames(bpt); _a < _b.length; _a++) {
            var name_2 = _b[_a];
            if (!keys || ~keys.indexOf(name_2)) {
                if (!(name_2 in pt)) {
                    pt[name_2] = bpt[name_2];
                }
            }
        }
        return clazzA;
    }
    junyou.expand = expand;
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
        if (Object.assign) {
            Object.assign(merged.prototype, clazzA.prototype, clazzB.prototype);
        }
        else {
            merged = expand(merged, clazzA);
            merged = expand(merged, clazzB);
        }
        return merged;
    }
    junyou.getMixin = getMixin;
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
    junyou.copyProperty = copyProperty;
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
    junyou.copyProperties = copyProperties;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于君游项目数据同步，后台运行<br/>
     * 只有注册和注销，没有awake和sleep
     * @author 3tion
     *
     */
    var Proxy = (function (_super) {
        __extends(Proxy, _super);
        function Proxy(name) {
            var _this = _super.call(this, name) || this;
            /**
             * 默认当作同步数据，认为是已经处理好的
             */
            _this._selfReady = true;
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
    }(junyou.FHost));
    junyou.Proxy = Proxy;
    __reflect(Proxy.prototype, "junyou.Proxy");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 可以调用 @d_interest 的视图
     * 可以进行关注facade中的事件
     *
     * @export
     * @class ViewController
     * @extends {FHost}
     */
    var ViewController = (function (_super) {
        __extends(ViewController, _super);
        function ViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ViewController.prototype.removeSkinListener = function (skin) {
            if (skin) {
                skin.off("removedFromStage" /* REMOVED_FROM_STAGE */, this.stageHandler, this);
                skin.off("addedToStage" /* ADDED_TO_STAGE */, this.stageHandler, this);
            }
        };
        ViewController.prototype.addSkinListener = function (skin) {
            if (skin) {
                skin.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.stageHandler, this);
                skin.on("addedToStage" /* ADDED_TO_STAGE */, this.stageHandler, this);
            }
        };
        Object.defineProperty(ViewController.prototype, "isReady", {
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        ViewController.prototype.stageHandler = function (e) {
            var type, ins;
            var _interests = this._interests;
            if (e.type == "addedToStage" /* ADDED_TO_STAGE */) {
                //加入关注的事件
                for (type in _interests) {
                    ins = _interests[type];
                    junyou.on(type, ins.handler, this, ins.priority);
                    if (ins.trigger) {
                        ins.handler.call(this);
                    }
                }
                if (this.awake) {
                    this.awake();
                }
            }
            else {
                for (type in _interests) {
                    ins = _interests[type];
                    junyou.off(type, ins.handler, this);
                }
                if (this.sleep) {
                    this.sleep();
                }
            }
        };
        return ViewController;
    }(junyou.FHost));
    junyou.ViewController = ViewController;
    __reflect(ViewController.prototype, "junyou.ViewController");
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
    function interest(eventType, triggerOnStage, priority) {
        return function (target, key, value) {
            var _interests = target._interests;
            if (!_interests) {
                target._interests = _interests = {};
            }
            var ins = {};
            ins.handler = value.value;
            ins.priority = priority || 0;
            ins.trigger = triggerOnStage;
            _interests[eventType] = ins;
        };
    }
    junyou.interest = interest;
})(junyou || (junyou = {}));
(function (junyou) {
    /**
    * 使用@d_interest 注入 添加关注
    * 关注为事件处理回调，只会在awake时，添加到事件监听列表
    * 在sleep时，从事件监听列表中移除
    * @param {string} type                         关注的事件
    * @param {(e?: Event) => void} handler          回调函数
    * @param {boolean} [triggerOnStage=false]      添加到舞台的时候，会立即执行一次，<font color="#f00">注意，处理回调必须能支持不传event的情况</font>
    * @param {number} [priority=0]                 优先级，默认为0
    */
    junyou.d_interest = junyou.interest;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var PageList = (function (_super) {
        __extends(PageList, _super);
        function PageList(renderfactory, opt, vgap, viewCount, columnCount, itemWidth, itemHeight) {
            var _this = _super.call(this) || this;
            _this._childSizeChanged = false;
            _this._selectedIndex = -1;
            _this.scroller = null; //站位用，便于对Scroller的绑定
            _this._waitForSetIndex = false;
            // private startIndex: number;
            // private endIndex: number;
            _this.renderChange = false;
            _this._dataLen = 0;
            _this._renderFactory = renderfactory;
            var hgap;
            if (typeof opt == "object") {
                hgap = opt.hgap;
                vgap = opt.vgap;
                itemWidth = opt.itemWidth;
                itemHeight = opt.itemHeight;
                columnCount = opt.columnCount;
                _this.staticSize = opt.staticSize;
            }
            else {
                hgap = opt;
            }
            columnCount = ~~columnCount;
            if (columnCount < 1) {
                columnCount = 1;
            }
            _this._columncount = columnCount;
            _this._hgap = ~~hgap;
            _this._vgap = ~~vgap;
            _this.itemWidth = itemWidth;
            _this.itemHeight = itemHeight;
            _this._list = [];
            _this._scrollType = columnCount < 9999 /* MaxColumnCount */ ? 0 /* Vertical */ : 1 /* Horizon */;
            return _this;
        }
        Object.defineProperty(PageList.prototype, "dataLen", {
            get: function () {
                return this._dataLen;
            },
            enumerable: true,
            configurable: true
        });
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
                        this._remoreRender(render);
                    }
                    list.length = nlen;
                }
            }
            this._data = data;
            this._lastRect = undefined;
            if (!nlen) {
                this.dispose();
                this._dataLen = 0;
                this.rawDataChanged = false;
                return;
            }
            this._dataLen = nlen;
            this.initItems();
            if (this.scroller) {
                this.scroller.scrollToHead();
            }
            this.rawDataChanged = false;
        };
        Object.defineProperty(PageList.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据index使某renderer显示生效
         *
         * @param {number}  idx
         * @param {boolean} [force]     是否强制执行setData和handleView
         * @memberOf PageList
         */
        PageList.prototype.validateItemByIdx = function (idx, force) {
            var renderer = this.getOrCreateItemRenderAt(idx);
            if (force || renderer.view.stage) {
                renderer.data = this._data[idx];
                if (typeof renderer.handleView === "function") {
                    renderer.handleView();
                }
                if (renderer.dataChange) {
                    renderer.dataChange = false;
                }
            }
        };
        /**
         * 使所有renderer显示生效
         *
         *
         * @memberOf PageList
         */
        PageList.prototype.validateAll = function () {
            if (this._data) {
                var len = this._data.length;
                for (var i = 0; i < len; i++) {
                    this.validateItemByIdx(i);
                }
            }
        };
        /**
         * 初始化render占据array，不做任何初始化容器操作
         *
         * @private
         */
        PageList.prototype.initItems = function () {
            var len = this._data.length;
            this.doRenderListItem(0, len - 1);
            this._childSizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        };
        /**
         * 渲染指定位置的render
         *
         * @ private
         * @ param {number} start (起始索引)
         * @ param {number} end (结束索引)
         */
        PageList.prototype.doRenderListItem = function (start, end) {
            var render;
            var data = this._data;
            end == undefined && (end = start);
            for (var i = start; i <= end; i++) {
                render = this.getOrCreateItemRenderAt(i);
                if (render.inited === false) {
                    if (typeof render.bindComponent === "function") {
                        render.bindComponent();
                    }
                    render.inited = true;
                }
                var tmp = render.data;
                if (!tmp || tmp != data[i] || render.dataChange) {
                    render.data = data[i];
                    if (typeof render.handleView === "function") {
                        render.handleView();
                    }
                    if (render.dataChange) {
                        render.dataChange = false;
                    }
                }
            }
        };
        PageList.prototype.changeRender = function (render, index) {
            var old = this._selectedItem;
            if (old != render) {
                index == undefined && (index = this._list.indexOf(render));
                if (old) {
                    old.selected = false;
                }
                this._selectedItem = render;
                this._selectedIndex = index;
                render.selected = true;
                if (!this.itemWidth || !this.itemHeight) {
                    this._childSizeChanged = true;
                    this.reCalc();
                }
                this.dispatch(-1052 /* ITEM_SELECTED */);
            }
        };
        PageList.prototype.touchItemrender = function (e) {
            var render = e.target;
            this.changeRender(render);
        };
        PageList.prototype.getOrCreateItemRenderAt = function (index) {
            var list = this._list;
            var render = list[index];
            if (!render) {
                render = this._renderFactory.get();
                list[index] = render;
                render.on(-1999 /* Resize */, this.childSizeChange, this);
                render.on(-1001 /* ITEM_TOUCH_TAP */, this.touchItemrender, this);
            }
            render.index = index;
            return render;
        };
        PageList.prototype.childSizeChange = function () {
            if (!this._childSizeChanged) {
                this._childSizeChanged = true;
                this.once("enterFrame" /* ENTER_FRAME */, this.reCalc, this);
            }
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
            if (!this._childSizeChanged) {
                return;
            }
            this._childSizeChanged = false;
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
                        var size = v;
                        if (staticSize) {
                            var rect = v.suiRawRect;
                            if (rect) {
                                size = rect;
                            }
                        }
                        w = size.width;
                        var vh = size.height;
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
                    ox += _hgap + (itemWidth || w);
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
                var g = this.graphics;
                g.clear();
                g.beginFill(0, 0);
                g.drawRect(0, 0, maxWidth, maxHeight);
                g.endFill();
                this.dispatch(-1999 /* Resize */);
            }
        };
        Object.defineProperty(PageList.prototype, "selectedIndex", {
            get: function () {
                return this._selectedIndex;
            },
            set: function (value) {
                if (this._selectedIndex == value)
                    return;
                if (value < 0) {
                    if (this._selectedItem) {
                        this._selectedItem.selected = false;
                        this._selectedItem = undefined;
                    }
                    this._selectedIndex = value;
                    return;
                }
                this._waitIndex = value;
                if (!this._data) {
                    this._waitForSetIndex = true;
                    return;
                }
                var render;
                var renderList = this._list;
                var len_1 = renderList.length - 1;
                if (value > len_1) {
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
            },
            enumerable: true,
            configurable: true
        });
        PageList.prototype.moveScroll = function (render) {
            var rect = this.scrollRect;
            if (!rect)
                return;
            var v = render.view;
            if (!v) {
                if (true) {
                    junyou.ThrowError("render[" + egret.getQualifiedClassName(render) + "]\u6CA1\u6709renderView");
                }
                return;
            }
            var oldPos, endPos, max;
            if (this._scrollType == 0 /* Vertical */) {
                oldPos = rect.y;
                endPos = v.y;
                max = this._h - v.height;
            }
            else {
                oldPos = rect.x;
                endPos = v.x;
                max = this._w - v.width;
            }
            if (endPos > max) {
                endPos = max;
            }
            if (rect) {
                if (this._scrollType == 0 /* Vertical */) {
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
            if (this.useTweenIndex) {
                var tween = junyou.Global.getTween(this, null, null, true);
                var result = this._scrollType == 1 /* Horizon */ ? { tweenX: endPos } : { tweenY: endPos };
                tween.to(result, 500, junyou.Ease.quadOut);
                if (scroller) {
                    scroller.showBar();
                    tween.call(scroller.hideBar, scroller);
                }
            }
            else {
                if (scroller) {
                    scroller.doMoveScrollBar(oldPos - endPos);
                }
                if (this._scrollType == 0 /* Vertical */) {
                    rect.y = endPos;
                }
                else {
                    rect.x = endPos;
                }
                this.scrollRect = rect;
            }
        };
        Object.defineProperty(PageList.prototype, "tweenX", {
            get: function () {
                var rect = this.scrollRect;
                return rect ? rect.x : 0;
            },
            set: function (value) {
                var rect = this.scrollRect || new egret.Rectangle(NaN);
                if (value != rect.x) {
                    var delta = value - rect.x;
                    rect.x = value;
                    var scroller = this.scroller;
                    if (scroller) {
                        scroller.doMoveScrollBar(delta);
                    }
                    this.scrollRect = rect;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageList.prototype, "tweenY", {
            get: function () {
                var rect = this.scrollRect;
                return rect ? rect.y : 0;
            },
            set: function (value) {
                var rect = this.scrollRect || new egret.Rectangle(0, NaN);
                if (value != rect.y) {
                    var delta = value - rect.y;
                    rect.y = value;
                    var scroller = this.scroller;
                    if (scroller) {
                        scroller.doMoveScrollBar(delta);
                    }
                    this.scrollRect = rect;
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
            var len = data.length;
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
        };
        Object.defineProperty(PageList.prototype, "selectedItem", {
            get: function () {
                return this._selectedItem;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 更新item数据
         *
         * @param {number} index (description)
         * @param {*} data (description)
         */
        PageList.prototype.updateItembyIndex = function (index, data) {
            var item = this.getItemAt(index);
            if (item) {
                this._data[index] = data;
                if (index >= this._showStart && index <= this._showEnd) {
                    this.doRenderListItem(index);
                }
            }
        };
        /**
         * 根据key value获取item,将item的data重新赋值为data
         *
         * @param {string} key (description)
         * @param {*} value (description)
         * @param {T} data (description)
         */
        PageList.prototype.updateItemByKey = function (key, value, data) {
            var _a = this.getItemRenderData(key, value), item = _a[0], index = _a[1];
            if (item) {
                this.updateItembyIndex(index, data);
            }
        };
        /**
         *
         * 根据索引获得视图
         * @param {number} idx
         * @returns
         */
        PageList.prototype.getItemAt = function (idx) {
            idx = idx >>> 0;
            return this._list[idx];
        };
        /**
         *
         * 通过搜索数据，获取Render
         * @param {string} key
         * @param {*} value
         * @returns
         */
        PageList.prototype.getItemRenderData = function (key, value) {
            var data = this._data;
            var len = data.length;
            var item;
            var i = 0;
            for (; i < len; i++) {
                var dat = data[i];
                if (key in dat) {
                    if (dat[key] === value) {
                        item = this.getItemAt(i);
                        break;
                    }
                }
            }
            return [item, i];
        };
        PageList.prototype.removeAt = function (idx) {
            idx = idx >>> 0;
            var list = this._list;
            if (idx < list.length) {
                var item = list[idx];
                list.splice(idx, 1);
                this._data.splice(idx, 1);
                this._remoreRender(item);
            }
        };
        PageList.prototype.removeItem = function (item) {
            var index = this._list.indexOf(item);
            if (index != -1) {
                this.removeAt(index);
            }
        };
        PageList.prototype._remoreRender = function (item) {
            item.data = undefined;
            junyou.removeDisplay(item.view);
            item.off(-1999 /* Resize */, this.childSizeChange, this);
            item.off(-1001 /* ITEM_TOUCH_TAP */, this.touchItemrender, this);
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
            this._childSizeChanged = true;
            this.reCalc();
            this.checkViewRect();
        };
        PageList.prototype.getAllItems = function () {
            return this._list;
        };
        Object.defineProperty(PageList.prototype, "length", {
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
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
            this.graphics.clear();
            this._selectedIndex = -1;
            this._data = undefined;
            var list = this._list;
            for (var i = 0; i < list.length; i++) {
                this._remoreRender(list[i]);
            }
            list.length = 0;
            this._selectedItem = undefined;
            this._waitForSetIndex = false;
            this._waitIndex = -1;
        };
        PageList.prototype.checkViewRect = function () {
            var rect = this.$scrollRect;
            var list = this._list;
            var len = list.length;
            var len_1 = len - 1;
            if (!rect) {
                // 应该为全部添加到舞台
                for (var i = 0; i < len; i++) {
                    var render = list[i];
                    var v = render.view;
                    if (v) {
                        this.addChild(v);
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
                var key1 = "x", key2 = "width";
                if (this._scrollType == 0 /* Vertical */) {
                    key1 = "y";
                    key2 = "height";
                }
                var delta = rect[key1] - lastRect[key1];
                if (delta == 0 && rect[key2] == lastRect[key2]) {
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
                        junyou.removeDisplay(render.view);
                    }
                }
                if (delta > 0) {
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
            var tmp = junyou.Temp.SharedArray3;
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
                    if (check(i)) {
                        break;
                    }
                }
                for (var i = 0, tlen = tmp.length; i < tlen; i++) {
                    var v = tmp[i];
                    this.addChild(v);
                }
                this._showStart = fIdx;
                this._showEnd = lIdx;
            }
            else {
                fIdx = len_1;
                lIdx = 0;
                for (var i = checkStart; i >= 0; i--) {
                    if (check(i)) {
                        break;
                    }
                }
                for (var i = tmp.length - 1; i >= 0; i--) {
                    var v = tmp[i];
                    this.addChild(v);
                }
                this._showStart = lIdx;
                this._showEnd = fIdx;
            }
            tmp.length = 0;
            return;
            function check(i) {
                var render = list[i];
                var v = render.view;
                if (v) {
                    if (junyou.intersects(v, rect)) {
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
                            return true;
                        }
                    }
                }
            }
        };
        Object.defineProperty(PageList.prototype, "scrollRect", {
            get: function () {
                return this.$scrollRect;
            },
            set: function (rect) {
                _super.prototype.$setScrollRect.call(this, rect);
                this.checkViewRect();
            },
            enumerable: true,
            configurable: true
        });
        return PageList;
    }(egret.Sprite));
    junyou.PageList = PageList;
    __reflect(PageList.prototype, "junyou.PageList");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var Scroller = (function (_super) {
        __extends(Scroller, _super);
        function Scroller() {
            var _this = _super.call(this) || this;
            /**
             * touchTap的超时时间，如果超过此时间，则不会触发子对象的touchTap事件
             *
             */
            _this.touchTapTime = 500;
            _this._scrollType = 0 /* Vertical */;
            /**鼠标每移动1像素，元件移动的像素 */
            _this.globalspeed = 1;
            /**最小的滑动速度，当前值低于此值后不再滚动 */
            _this.minEndSpeed = 0.0001;
            /**速度递减速率 */
            _this.blockSpeed = 0.98;
            _this._deriction = 1;
            _this._moveSpeed = 0;
            return _this;
        }
        Object.defineProperty(Scroller.prototype, "scrollType", {
            /**滚动条方式 0：垂直，1：水平 defalut:0*/
            get: function () {
                return this._scrollType;
            },
            /**滚动条方式 0：垂直，1：水平 defalut:0*/
            set: function (value) {
                this._scrollType = value;
                this.checkScrollBarView();
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
            var scrollType = this._scrollType;
            scrollbar.scrollType = scrollType;
            var rect = content.scrollRect;
            if (scrollType == 0 /* Vertical */) {
                scrollbar.bgSize = rect.height;
                scrollbar.y = content.y;
            }
            else {
                scrollbar.bgSize = rect.width;
                scrollbar.x = content.x;
            }
        };
        Scroller.prototype.onScrollBarAdded = function () {
            if (this.alwaysShowBar) {
                this._scrollbar.alpha = 1;
            }
            else {
                this._scrollbar.alpha = 0;
            }
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
                    old.off("touchBegin" /* TOUCH_BEGIN */, this.onTargetTouchBegin, this);
                    old.off(-1999 /* Resize */, this.contentSizeChange, this);
                    content.stage.off("touchMove" /* TOUCH_MOVE */, this.moveOnContent, this);
                    content.off("touchEnd" /* TOUCH_END */, this.endTouchContent, this);
                    content.off("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.endTouchContent, this);
                }
            }
            this._content = content;
            if ("scroller" in content) {
                content["scroller"] = this;
            }
            content.touchEnabled = true;
            content.on("touchBegin" /* TOUCH_BEGIN */, this.onTargetTouchBegin, this);
            content.on(-1999 /* Resize */, this.contentSizeChange, this);
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
                    var rect = junyou.Temp.EgretRectangle;
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
        Scroller.prototype.contentSizeChange = function () {
            if (this._useScrollBar) {
                this.scaleBar();
            }
        };
        Scroller.prototype.onTargetTouchBegin = function (e) {
            var content = this._content;
            if (!content) {
                return;
            }
            var scrollRect = content.scrollRect;
            var pos;
            if (this._scrollType == 0 /* Vertical */) {
                if (content.measuredHeight < scrollRect.height) {
                    return;
                }
                pos = e.stageY;
            }
            else {
                if (content.measuredWidth < scrollRect.width) {
                    return;
                }
                pos = e.stageX;
            }
            var now = junyou.Global.now;
            this._st = now;
            this._lastMoveTime = now;
            this._lastTargetPos = pos;
            if (content instanceof egret.DisplayObjectContainer) {
                this._touchChildren = content.touchChildren;
            }
            content.stage.on("touchMove" /* TOUCH_MOVE */, this.moveOnContent, this);
            content.on("touchEnd" /* TOUCH_END */, this.endTouchContent, this);
            content.on("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.endTouchContent, this);
            this.showBar();
        };
        Scroller.prototype.moveOnContent = function (e) {
            var currentPos;
            if (this._scrollType == 0 /* Vertical */) {
                currentPos = e.stageY;
            }
            else {
                currentPos = e.stageX;
            }
            var sub = currentPos - this._lastTargetPos;
            this._deriction = sub > 0 ? 1 : -1;
            sub = Math.abs(sub);
            var now = junyou.Global.now;
            var subTime = now - this._lastMoveTime;
            if (now - this._st > this.touchTapTime && this._touchChildren != undefined) {
                this._content.touchChildren = false;
            }
            this._lastMoveTime = now;
            this._lastTargetPos = currentPos;
            this._moveSpeed = subTime > 0 ? sub / subTime : 0;
            sub = sub * this.globalspeed * this._deriction;
            this.doScrollContent(sub);
        };
        Scroller.prototype.stopTouchTween = function () {
            this._moveSpeed = 0;
            this._content.off("enterFrame" /* ENTER_FRAME */, this.onEnterFrame, this);
        };
        Scroller.prototype.onEnterFrame = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            if (this._moveSpeed == 0) {
                content.off("enterFrame" /* ENTER_FRAME */, this.onEnterFrame, this);
                this.hideBar();
                return;
            }
            var now = junyou.Global.now;
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
        Scroller.prototype.endTouchContent = function (e) {
            var content = this._content;
            if (!content) {
                return;
            }
            if (content instanceof egret.DisplayObjectContainer) {
                content.touchChildren = this._touchChildren;
                this._touchChildren = undefined;
            }
            var stage = content.stage || egret.sys.$TempStage;
            stage.off("touchMove" /* TOUCH_MOVE */, this.moveOnContent, this);
            content.off("touchEnd" /* TOUCH_END */, this.endTouchContent, this);
            content.off("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.endTouchContent, this);
            var now = junyou.Global.now;
            if (now - this._lastMoveTime < 150) {
                content.on("enterFrame" /* ENTER_FRAME */, this.onEnterFrame, this);
                this._lastFrameTime = this._lastMoveTime;
            }
            else {
                this.hideBar();
            }
        };
        Scroller.prototype.showBar = function () {
            if (this._useScrollBar) {
                if (!this.alwaysShowBar) {
                    var tween = junyou.Global.getTween(this._scrollbar, undefined, undefined, true);
                    tween.to({ alpha: 1 }, 500);
                }
            }
        };
        Scroller.prototype.hideBar = function () {
            if (this._useScrollBar) {
                if (!this.alwaysShowBar) {
                    var tween = junyou.Global.getTween(this._scrollbar, undefined, undefined, true);
                    tween.to({ alpha: 0 }, 1000);
                }
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
            var oldx = rect.x;
            var oldy = rect.y;
            var scrollEnd = this.scrollEndPos;
            if (this._scrollType == 0 /* Vertical */) {
                rect.y -= sub;
                if (rect.y <= 0) {
                    rect.y = 0;
                    this._moveSpeed = 0;
                }
                if (rect.y >= scrollEnd) {
                    rect.y = scrollEnd;
                    this._moveSpeed = 0;
                }
            }
            else {
                rect.x -= sub;
                if (rect.x <= 0) {
                    rect.x = 0;
                    this._moveSpeed = 0;
                }
                if (rect.x >= scrollEnd) {
                    rect.x = scrollEnd;
                    this._moveSpeed = 0;
                }
            }
            content.scrollRect = rect;
            if (oldx != rect.x || oldy != rect.y) {
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
            var barPos;
            var subPos = sub / this._piexlDistance;
            var flag = this._scrollType == 0 /* Vertical */;
            if (flag) {
                barPos = bar.y;
            }
            else {
                barPos = bar.x;
            }
            barPos = barPos - subPos;
            if (barPos <= 0) {
                barPos = 0;
            }
            else {
                var delta = scrollbar.bgSize - scrollbar.barSize;
                if (barPos >= delta) {
                    barPos = delta;
                }
            }
            if (flag) {
                bar.y = barPos;
            }
            else {
                bar.x = barPos;
            }
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
                var rect = this._content.scrollRect;
                var curpos = void 0;
                if (this._scrollType == 0 /* Vertical */) {
                    curpos = rect.y;
                }
                else {
                    curpos = rect.x;
                }
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
                this._content.off("enterFrame" /* ENTER_FRAME */, this.onEnterFrame, this);
            }
            var rect = content.scrollRect;
            var scrollbar = this._scrollbar;
            var bar;
            if (scrollbar) {
                bar = scrollbar.bar;
            }
            if (this._scrollType == 0 /* Vertical */) {
                rect.y = 0;
                if (bar) {
                    bar.y = 0;
                }
            }
            else {
                rect.x = 0;
                if (bar) {
                    bar.x = 0;
                }
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
            if (this._scrollType == 0 /* Vertical */) {
                rect.y = end;
                if (bar) {
                    bar.y = delta;
                }
            }
            else {
                rect.x = end;
                if (bar) {
                    bar.x = delta;
                }
            }
            content.scrollRect = rect;
        };
        Scroller.prototype.scaleBar = function () {
            var content = this._content;
            if (!content) {
                return;
            }
            var contentSize;
            if (this._scrollType == 0 /* Vertical */) {
                contentSize = content.measuredHeight;
            }
            else {
                contentSize = content.measuredWidth;
            }
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
                var contentSize, scrollSize;
                var rect = content.scrollRect;
                if (this._scrollType == 0 /* Vertical */) {
                    contentSize = content.measuredHeight;
                    scrollSize = rect.height;
                }
                else {
                    contentSize = content.measuredWidth;
                    scrollSize = rect.width;
                }
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
            if (this._scrollType == 0 /* Vertical */) {
                var tmp = rect.y / scrollEnd;
                if (tmp <= 0) {
                    bar.y = 0;
                }
                else {
                    bar.y = scrollbar.bgSize * tmp - scrollbar.barSize;
                }
            }
            else {
                var tmp = rect.x / scrollEnd;
                if (tmp <= 0) {
                    bar.x = 0;
                }
                else {
                    bar.x = scrollbar.bgSize * tmp - scrollbar.barSize;
                }
            }
        };
        return Scroller;
    }(egret.EventDispatcher));
    junyou.Scroller = Scroller;
    __reflect(Scroller.prototype, "junyou.Scroller");
})(junyou || (junyou = {}));
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
        $gm.nsLogs.forEach(function (log) {
            if ($gm.__nsLogCheck(log, nsFilter)) {
                output.push({ type: log.type, time: log.time, cmd: log.cmd, data: log.data, json: JSON.stringify(log.data) });
            }
        });
        console.table(output);
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
        junyou.NetService.get().route(cmd, data);
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
var junyou;
(function (junyou) {
    junyou.NSBytesLen = {
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
    junyou.nsHeader = { cmd: 0, len: 0 };
    function send2(cmd, data, msgType, limit) {
        if (junyou.RequestLimit.check(cmd, limit)) {
            this._send(cmd, data, msgType);
        }
        else {
            junyou.dispatch(-189 /* NetServiceSendLimit */, cmd);
        }
    }
    /**
     * 通信服务
     * 收发的协议结构：
     * 2字节协议号 2字节包长度(n) n字节包
     * @author 3tion
     *
     */
    var NetService = (function () {
        function NetService() {
            var _this = this;
            this.netChange = function () {
                if (navigator.onLine) {
                    junyou.dispatch(-192 /* Online */);
                    _this.showReconnect();
                }
                else {
                    junyou.dispatch(-191 /* Offline */);
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
            this._router = new junyou.NetRouter();
            this._pcmdList = [];
            this._tmpList = [];
            this._readBuffer = new junyou.ByteArray();
            this._sendBuffer = new junyou.ByteArray();
            this._tempBytes = new junyou.ByteArray();
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
            if (window.addEventListener) {
                addEventListener("online", this.netChange);
                addEventListener("offline", this.netChange);
            }
            junyou.on(-190 /* Awake */, this.onawake, this);
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
        NetService.prototype.showReconnect = function () {
            this._reconCount += 1;
            var time = this._reconCount * this.baseConTime;
            var maxConTime = this.maxConTime;
            if (time > maxConTime) {
                time = maxConTime;
            }
            this._nextAutoTime = junyou.Global.now + time;
            junyou.dispatch(-194 /* ShowReconnect */, this._reconCount);
        };
        NetService.prototype.onawake = function () {
            this._reconCount = 0;
            this._nextAutoTime = junyou.Global.now + this._autoTimeDelay;
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
                    junyou.ThrowError("\u534F\u8BAE\u53F7\u7684\u8303\u56F4\u5FC5\u987B\u662F-32768~32767\u4E4B\u95F4\uFF0C\u5F53\u524Dcmd:" + cmd);
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
            if (junyou.RequestLimit.check(cmd, limit)) {
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
            var pdata = junyou.recyclable(junyou.NetSendData);
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
                if (type in junyou.NSBytesLen) {
                    this.writeBytesLength(bytes, junyou.NSBytesLen[type]);
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
                            junyou.PBMessageUtils.writeTo(dat, data.msgType, tempBytes, outdata);
                        }
                        else {
                            junyou.PBMessageUtils.writeTo(dat, data.msgType, tempBytes);
                        }
                        this.writeBytesLength(bytes, tempBytes.length);
                        bytes.writeBytes(tempBytes);
                        break;
                }
            }
            if (true) {
                this.$writeNSLog(junyou.Global.now, "send", cmd, outdata);
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
            var header = junyou.nsHeader;
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
                    if (len > 0) {
                        if (type in junyou.NSBytesLen) {
                            var blen = junyou.NSBytesLen[type];
                            if (blen != len) {
                                junyou.ThrowError("\u89E3\u6790\u6307\u4EE4\u65F6\uFF0C\u7C7B\u578B[" + type + "]\u7684\u6307\u4EE4\u957F\u5EA6[" + len + "]\u548C\u9884\u8BBE\u7684\u957F\u5EA6[" + blen + "]\u4E0D\u5339\u914D");
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
                                    data = junyou.PBMessageUtils.readFrom(type, bytes, len);
                                    break;
                            }
                        }
                    }
                    if (flag) {
                        //容错用，不管数据解析成功或者失败，将索引移至结束索引
                        var nData = junyou.recyclable(junyou.NetData);
                        nData.cmd = cmd;
                        nData.data = data;
                        tmpList[idx++] = nData;
                    }
                }
                else {
                    junyou.ThrowError("\u901A\u4FE1\u6D88\u606F\u89E3\u6790\u65F6cmd[" + cmd + "]\uFF0C\u51FA\u73B0\u672A\u6CE8\u518C\u7684\u7C7B\u578B");
                }
                bytes.position = endPos;
            }
            //调试时,显示接收的数据
            if (true) {
                var now = junyou.Global.now;
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
            var nData = junyou.recyclable(junyou.NetData);
            nData.cmd = cmd;
            nData.data = data;
            this._router.dispatch(nData);
        };
        return NetService;
    }());
    junyou.NetService = NetService;
    __reflect(NetService.prototype, "junyou.NetService");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 位图的创建器
     * @author 3tion
     *
     */
    var BitmapCreator = (function (_super) {
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
            bmp.on("addedToStage" /* ADDED_TO_STAGE */, this.onAddedToStage, this);
            bmp.on("removedFromStage" /* REMOVED_FROM_STAGE */, this.onRemoveFromStage, this);
        };
        BitmapCreator.prototype.onAddedToStage = function (e) {
            var suiData = this._suiData;
            if (suiData) {
                var bmp = e.currentTarget;
                suiData.checkRefreshBmp(bmp, this.isjpg);
            }
        };
        BitmapCreator.prototype.onRemoveFromStage = function (e) {
            var suiData = this._suiData;
            if (suiData) {
                var bmd = this.isjpg ? suiData.jpgbmd : suiData.pngbmd;
                bmd.using--;
                bmd.lastUseTime = junyou.Global.now;
            }
        };
        return BitmapCreator;
    }(junyou.BaseCreator));
    junyou.BitmapCreator = BitmapCreator;
    __reflect(BitmapCreator.prototype, "junyou.BitmapCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.call(this) || this;
            _this._label = "";
            junyou.TouchDown.bindItem(_this);
            return _this;
        }
        Button.prototype.useDisableFilter = function (value) {
            this._useDisableFilter = value;
        };
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
                var tf = this.txtLabel;
                if (tf) {
                    if (this._label != value) {
                        tf.text = value;
                        this._label = value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
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
                junyou.removeDisplay(old);
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
            junyou.TouchDown.looseItem(this);
        };
        return Button;
    }(junyou.Component));
    junyou.Button = Button;
    __reflect(Button.prototype, "junyou.Button", ["junyou.IButton"]);
    /**
     * 按钮创建器
     * @author 3tion
     *
     */
    var ButtonCreator = (function (_super) {
        __extends(ButtonCreator, _super);
        function ButtonCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ButtonCreator.prototype.parseSelfData = function (data) {
            var _this = this;
            var tc;
            if (data[0]) {
                tc = new junyou.TextFieldCreator();
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
                if (!bmps[1]) {
                    bmps[1] = bmps[0];
                }
                var useDisableFilter;
                if (!bmps[2]) {
                    bmps[2] = bmps[0];
                    useDisableFilter = true;
                }
                if (!bmps[3]) {
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
                btn.useDisableFilter(useDisableFilter);
                return btn;
            };
        };
        return ButtonCreator;
    }(junyou.BaseCreator));
    junyou.ButtonCreator = ButtonCreator;
    __reflect(ButtonCreator.prototype, "junyou.ButtonCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var LayoutContainer = (function () {
        function LayoutContainer(basis, host) {
            this.$layoutBins = new junyou.ArraySet();
            host = host || new egret.Sprite();
            this._host = host;
            this._basis = basis;
            junyou.on(-1998 /* ReLayout */, this.onResize, this);
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
        LayoutContainer.prototype.getFixedNarrow = function (sw, sh, bw, bh, ySmall) {
            var dw = sw, dh = sh;
            var scaleX = sw / bw;
            var scaleY = sh / bh;
            var lw = bw;
            var lh = bh;
            if (scaleX < scaleY == !ySmall) {
                dh = sw * bh / bw;
                lh = bh * sh / dh;
            }
            else {
                dw = sh * bw / bh;
                lw = bw * sw / dw;
            }
            var scale = dw / bw;
            return { dw: dw, dh: dh, scale: scale, lw: lw, lh: lh };
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
        LayoutContainer.prototype.addLayout = function (dis, type, size, hoffset, voffset, outerV, outerH) {
            if (type === void 0) { type = 5 /* TOP_LEFT */; }
            var list = this.$layoutBins;
            size = size || dis;
            var key = dis.hashCode;
            if (list.get(key)) {
                return;
            }
            this._host.addChild(dis);
            var bin = { dis: dis, type: type, hoffset: hoffset, voffset: voffset, outerV: outerV, outerH: outerH, size: size };
            list.set(key, bin);
            var stage = dis.stage;
            if (stage) {
                this.binLayout(bin);
            }
            else {
                dis.on("addedToStage" /* ADDED_TO_STAGE */, this.onAdded, this);
            }
        };
        LayoutContainer.prototype.onAdded = function (e) {
            var dis = e.currentTarget;
            var host = dis.$layoutHost;
            if (host) {
                var set = host.$layoutBins;
                if (set) {
                    var bin = set.get(dis.$hashCode);
                    if (bin) {
                        this.binLayout(bin);
                    }
                }
            }
        };
        LayoutContainer.prototype.binLayout = function (bin) {
            var dis = bin.dis, type = bin.type, hoffset = bin.hoffset, voffset = bin.voffset, outerV = bin.outerV, outerH = bin.outerH, size = bin.size;
            var pt = junyou.Temp.SharedPoint1;
            junyou.Layout.getLayoutPos(size.width, size.height, this._lw, this._lh, type, pt, hoffset, voffset, outerV, outerH);
            dis.x = pt.x;
            dis.y = pt.y;
        };
        LayoutContainer.prototype.$doLayout = function () {
            junyou.Global.callLater(this.layoutAll, 0, this);
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
    junyou.LayoutContainer = LayoutContainer;
    __reflect(LayoutContainer.prototype, "junyou.LayoutContainer");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @class MenuBaseRender
     * @extends {egret.Sprite}
     * @template T
     */
    var MenuBaseRender = (function () {
        function MenuBaseRender() {
        }
        MenuBaseRender.prototype.itemClick = function () {
            var data = this._data;
            if (data) {
                var callBack = data.callBack;
                if (callBack) {
                    callBack.call(junyou.Menu.currentShow, data);
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
    junyou.MenuBaseRender = MenuBaseRender;
    __reflect(MenuBaseRender.prototype, "junyou.MenuBaseRender");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 单选按钮组
     */
    var Group = (function (_super) {
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
                        junyou.ThrowError("Group 设置的组件未添加到该组");
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
    junyou.Group = Group;
    __reflect(Group.prototype, "junyou.Group");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 绑定属性名，当属性值发生改变时，可自动对外抛eventType事件
     *
     * @export
     * @param {(string | number)} eventType     事件类型
     * @param {boolean} [selfDispatch]          默认false，使用Facade抛事件，event.data为实例本身
     *                                          如果为true，需要为EventDispatcher的实现，会使用自身抛事件
     * @returns
     */
    function d_fire(eventType, selfDispatch) {
        return function (target, value) {
            new Watcher(value, function () {
                if (selfDispatch) {
                    if (typeof this.dispatch === "function") {
                        this.dispatch(eventType);
                    }
                }
                else {
                    junyou.dispatch(eventType, this);
                }
            }).reset(target);
            //此处的target为prototype
            //事件回调时候，this为实例
        };
    }
    junyou.d_fire = d_fire;
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
    junyou.d_memoize = d_memoize;
    /**
     * @private
     */
    var _$l = "__listeners__";
    /**
     * @private
     */
    var _$b = "__bindables__";
    /**
     * @private
     */
    var _$c = 0;
    function notifyListener(host, property) {
        var list = host[_$l];
        var length = list.length;
        for (var i = 0; i < length; i += 2) {
            var listener = list[i];
            var target = list[i + 1];
            listener.call(target, property, host);
        }
    }
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
    var Watcher = (function () {
        /**
         * Creates an instance of Watcher.
         *
         * @param {string} property                 监听的属性
         * @param {(value: any) => void} handler    回调函数
         * @param {*} [thisObject]                  回调函数的this对象，如果不设置this，则当监听对象属性变化时，将以监听的对象作为this参数，进行回调
         * @param {Watcher} [next]
         */
        function Watcher(property, handler, thisObject, next) {
            /**
             * @private
             */
            this.isExecuting = false;
            this.property = property;
            this.handler = handler;
            this.next = next;
            this.thisObject = thisObject;
        }
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
        Watcher.watch = function (host, chain, handler, thisObject) {
            if (true) {
                if (!chain) {
                    egret.$error(1003, "chain");
                }
            }
            if (chain.length > 0) {
                var property = chain.shift();
                var next = Watcher.watch(null, chain, handler, thisObject);
                var watcher = new Watcher(property, handler, thisObject, next);
                watcher.reset(host);
                return watcher;
            }
            else {
                return;
            }
        };
        /**
         * @private
         * 检查属性是否可以绑定。若还未绑定，尝试添加绑定事件。若是只读或只写属性，返回false。
         */
        Watcher.checkBindable = function (host, property) {
            var list = host[_$b];
            if (list && list.indexOf(property) != -1) {
                return true;
            }
            var isEventDispatcher = egret.is(host, "egret.IEventDispatcher");
            if (!isEventDispatcher && !host[_$l]) {
                host[_$l] = [];
            }
            var data = host.getPropertyDescriptor(property);
            if (data && data.set && data.get) {
                var orgSet_1 = data.set;
                data.set = function (value) {
                    if (this[property] != value) {
                        orgSet_1.call(this, value);
                        if (isEventDispatcher) {
                            junyou.PropertyEvent.dispatchPropertyEvent(this, -2000 /* PROPERTY_CHANGE */, property);
                        }
                        else {
                            notifyListener(this, property);
                        }
                    }
                };
            }
            else if (!data || (!data.get && !data.set)) {
                _$c++;
                var newProp_1 = "_" + _$c + property;
                host[newProp_1] = data ? data.value : null;
                data = { enumerable: true, configurable: true };
                data.get = function () {
                    return this[newProp_1];
                };
                data.set = function (value) {
                    if (this[newProp_1] != value) {
                        this[newProp_1] = value;
                        if (isEventDispatcher) {
                            junyou.PropertyEvent.dispatchPropertyEvent(this, -2000 /* PROPERTY_CHANGE */, property);
                        }
                        else {
                            notifyListener(this, property);
                        }
                    }
                };
            }
            else {
                return false;
            }
            Object.defineProperty(host, property, data);
            junyou.registerBindable(host, property);
        };
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
        Watcher.prototype.unwatch = function () {
            this.reset(null);
            this.handler = null;
            if (this.next) {
                this.next.handler = null;
            }
        };
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
        Watcher.prototype.getValue = function () {
            if (this.next) {
                return this.next.getValue();
            }
            return this.getHostPropertyValue();
        };
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
        Watcher.prototype.setHandler = function (handler, thisObject) {
            this.handler = handler;
            this.thisObject = thisObject;
            if (this.next) {
                this.next.setHandler(handler, thisObject);
            }
        };
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
        Watcher.prototype.reset = function (newHost) {
            var oldHost = this.host;
            if (oldHost) {
                if (oldHost instanceof egret.EventDispatcher) {
                    oldHost.off(-2000 /* PROPERTY_CHANGE */, this.wrapHandler, this);
                }
                else {
                    var list = oldHost[_$l];
                    var index = list.indexOf(this);
                    list.splice(index - 1, 2);
                }
            }
            this.host = newHost;
            if (newHost) {
                Watcher.checkBindable(newHost, this.property);
                if (newHost instanceof egret.EventDispatcher) {
                    newHost.on(-2000 /* PROPERTY_CHANGE */, this.wrapHandler, this, false, 100);
                }
                else {
                    var list = newHost[_$l];
                    list.push(this.onPropertyChange);
                    list.push(this);
                }
            }
            if (this.next) {
                this.next.reset(this.getHostPropertyValue());
            }
            return this;
        };
        /**
         * @private
         *
         * @returns
         */
        Watcher.prototype.getHostPropertyValue = function () {
            return this.host ? this.host[this.property] : null;
        };
        /**
         * @private
         */
        Watcher.prototype.wrapHandler = function (event) {
            this.onPropertyChange(event.property, event.currentTarget);
        };
        /**
         * @private
         */
        Watcher.prototype.onPropertyChange = function (property, dispatcher) {
            if (property == this.property && !this.isExecuting) {
                try {
                    this.isExecuting = true;
                    if (this.next)
                        this.next.reset(this.getHostPropertyValue());
                    if (this.thisObject) {
                        this.handler.call(this.thisObject, this.getValue());
                    }
                    else {
                        this.handler.call(dispatcher, this.getValue());
                    }
                }
                finally {
                    this.isExecuting = false;
                }
            }
        };
        return Watcher;
    }());
    junyou.Watcher = Watcher;
    __reflect(Watcher.prototype, "junyou.Watcher");
})(junyou || (junyou = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
(function (junyou) {
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
    var Binding = (function () {
        function Binding() {
        }
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
        Binding.bindProperty = function (host, chain, target, prop) {
            var watcher = junyou.Watcher.watch(host, chain, null, null);
            if (watcher) {
                var assign = function (value) {
                    target[prop] = value;
                };
                watcher.setHandler(assign, null);
                assign(watcher.getValue());
            }
            return watcher;
        };
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
        Binding.bindHandler = function (host, chain, handler, thisObject) {
            var watcher = junyou.Watcher.watch(host, chain, handler, thisObject);
            if (watcher) {
                handler.call(thisObject, watcher.getValue());
            }
            return watcher;
        };
        return Binding;
    }());
    junyou.Binding = Binding;
    __reflect(Binding.prototype, "junyou.Binding");
})(junyou || (junyou = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
(function (junyou) {
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
    var PropertyEvent = (function (_super) {
        __extends(PropertyEvent, _super);
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
        function PropertyEvent(type, bubbles, cancelable, property) {
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.property = property;
            return _this;
        }
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
        PropertyEvent.dispatchPropertyEvent = function (target, eventType, property) {
            if (!target.hasListen(eventType)) {
                return true;
            }
            var event = egret.Event.create(PropertyEvent, eventType);
            event.property = property;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        return PropertyEvent;
    }(egret.Event));
    junyou.PropertyEvent = PropertyEvent;
    __reflect(PropertyEvent.prototype, "junyou.PropertyEvent");
})(junyou || (junyou = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
(function (junyou) {
    var key = "__bindables__";
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
    function registerBindable(instance, property) {
        if (true) {
            if (!instance) {
                egret.$error(1003, "instance");
            }
            if (!property) {
                egret.$error(1003, "property");
            }
        }
        if (instance.hasOwnProperty(key)) {
            instance[key].push(property);
        }
        else {
            var list = [property];
            if (instance[key]) {
                list = instance[key].concat(list);
            }
            instance[key] = list;
        }
    }
    junyou.registerBindable = registerBindable;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
    *
    * 发起可以不需要回调响应的跨域get请求
    * @param {string} url          发起请求的地址
    * @param {boolean} [always]    是否总是发起请求
    *                              false（默认） 请求已经在列队中，则不会重复发起请求
    *                              true 不管相同地址的请求之前是否已经发起，继续发起请求
    */
    junyou.sendToUrl = $();
})(junyou || (junyou = {}));
function $() {
    var _unSendList = [];
    var img = new Image(); //使用Image，在https下，不会因为最终请求地址为http，导致浏览器将请求拦截，详情参考 https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content
    var _requestState = 0 /* UNREQUEST */;
    img.onerror = callBack(this, -1 /* FAILED */);
    img.onload = callBack(this, 2 /* COMPLETE */);
    return sendToUrl;
    function sendToUrl(url, always) {
        if (_requestState == 1 /* REQUESTING */) {
            if (always) {
                _unSendList.push(url);
            }
            else {
                _unSendList.pushOnce(url);
            }
            return;
        }
        _requestState = 1 /* REQUESTING */;
        img.src = url;
    }
    ;
    function callBack(self, state) {
        return function () {
            _requestState = state;
            if (true) {
                console.log(img.src, "callBack:", state);
            }
            if (_unSendList.length > 0) {
                return sendToUrl(_unSendList.shift());
            }
        };
    }
}
var junyou;
(function (junyou) {
    // const enum Const {
    //     /**
    //      * 
    //      * ## 概述
    //      * 首先要看TCP/IP协议，涉及到四层：链路层，网络层，传输层，应用层。  
    //      * 其中以太网（Ethernet）的数据帧在链路层  
    //      * IP包在网络层  
    //      * TCP或UDP包在传输层  
    //      * TCP或UDP中的数据（Data)在应用层  
    //      * 它们的关系是 数据帧｛IP包｛TCP或UDP包｛Data｝｝｝  
    //      *
    //      * 不同的协议层对数据包有不同的称谓，在传输层叫做段(segment)，在网络层叫做数据报(datagram)，在链路层叫做帧(frame)。数据封装成帧后发到传输介质上，到达目的主机后每层协议再剥掉相应的首部，最后将应用层数据交给应用程序处理。
    //      *
    //      * 在应用程序中我们用到的Data的长度最大是多少，直接取决于底层的限制。  
    //      * 我们从下到上分析一下：  
    //      *      1. 在链路层，由以太网的物理特性决定了数据帧的长度为(46＋18)－(1500＋18)，其中的18是数据帧的头和尾，也就是说数据帧的内容最大为1500(不包括帧头和帧尾)，即MTU(Maximum Transmission Unit)为1500； 　
    //      *      2. 在网络层，因为IP包的首部要占用20字节，所以这的MTU为1500－20＝1480；　
    //      *      3. 在传输层，对于UDP包的首部要占用8字节，所以这的MTU为1480－8＝1472；  
    //      * 
    //      * 所以，在应用层，你的Data最大长度为1472。当我们的UDP包中的数据多于MTU(1472)时，发送方的IP层需要分片fragmentation进行传输，而在接收方IP层则需要进行数据报重组，由于UDP是不可靠的传输协议，如果分片丢失导致重* 组失败，将导致UDP数据包被丢弃。  
    //      * 从上面的分析来看，在普通的局域网环境下，UDP的数据最大为1472字节最好(避免分片重组)。  
    //      * 但在网络编程中，Internet中的路由器可能有设置成不同的值(小于默认值)，Internet上的标准MTU值为576，所以Internet的UDP编程时数据长度最好在576－20－8＝548字节以内。
    //      *
    //      * 
    //      * ## TCP、UDP数据包最大值的确定
    //      * UDP和TCP协议利用端口号实现多项应用同时发送和接收数据。数据通过源端口发送出去，通过目标端口接收。有的网络应用只能使用预留或注册的静态端口；而另外一些网络应用则可以使用未被注册的动态端口。因为UDP和TCP报头使* 用两个字节存放端口号，所以端口号的有效范围是从0到65535。动态端口的范围是从1024到65535。  
    //      * MTU最大传输单元，这个最大传输单元实际上和链路层协议有着密切的关系，EthernetII帧的结构DMAC+SMAC+Type+Data+CRC由于以太网传输电气方面的限制，每个以太网帧都有最小的大小64Bytes最大不能超过1518Bytes，对于小* 于或者大于这个限制的以太网帧我们都可以视之为错误的数据帧，一般的以太网转发设备会丢弃这些数据帧。  
    //      * 
    //      * 由于以太网EthernetII最大的数据帧是1518Bytes这样，刨去以太网帧的帧头（DMAC目的MAC地址48bits=6Bytes+SMAC源MAC地址48bits=6Bytes+Type域2Bytes）14Bytes和帧尾CRC校验部分4Bytes那么剩下承载上层协议的地方也就是Data域最大就只能有1500Bytes这个值我们就把它称之为MTU。  
    //      * UDP 包的大小就应该是 1500 - IP头(20) - UDP头(8) = 1472(Bytes)  
    //      * TCP 包的大小就应该是 1500 - IP头(20) - TCP头(20) = 1460 (Bytes)  
    //      * 以上内容原网址：http://blog.csdn.net/caoshangpa/article/details/51530685
    //      * 
    //      * WebSocket的头部字节数为 2 - 8 字节  
    //      * 
    //      * ```
    //      *  0                   1                   2                   3  
    //      *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1  
    //      * +-+-+-+-+-------+-+-------------+-------------------------------+  
    //      * |F|R|R|R| opcode|M| Payload len |    Extended payload length    |  
    //      * |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |  
    //      * |N|V|V|V|       |S|             |   (if payload len==126/127)   |  
    //      * | |1|2|3|       |K|             |                               |  
    //      * +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +  
    //      * |     Extended payload length continued, if payload len == 127  |  
    //      * + - - - - - - - - - - - - - - - +-------------------------------+  
    //      * |                               |Masking-key, if MASK set to 1  |  
    //      * +-------------------------------+-------------------------------+  
    //      * | Masking-key (continued)       |          Payload Data         |  
    //      * +-------------------------------- - - - - - - - - - - - - - - - +  
    //      * :                     Payload Data continued ...                :  
    //      * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +  
    //      * |                     Payload Data continued ...                |  
    //      * +---------------------------------------------------------------+  
    //      * ```
    // }
    // 上面操作是多余的，参看netty的源码
    // https://github.com/netty/netty/tree/4.1/codec/src/main/java/io/netty/handler/codec
    // https://github.com/netty/netty/tree/4.1/codec-socks/src/main/java/io/netty/handler/codec/socks
    // https://github.com/netty/netty/tree/4.1/transport/src/main/java/io/netty
    // 参看Chrome的源码 
    // https://src.chromium.org/viewvc/chrome/trunk/src/net/socket/
    // https://src.chromium.org/viewvc/chrome/trunk/src/net/socket_stream/
    // https://src.chromium.org/viewvc/chrome/trunk/src/net/websockets/
    // 均没有针对[MTU](http://baike.baidu.com/item/mtu)进行业务层面的分帧的代码处理  
    // 然后和服务端重新进行调试，发送大的(50003Bytes)的一帧WebSocketFrame，让服务端也开[WireShark](http://www.wireshark.org)进行捕获
    // 发现客户端对服务端发送的数据帧是多个TCP帧的，并且每个帧都复合`MTU`，故删除以上代码
    // 仔细研读`WireShark`的客户端向服务端发送的数据帧的说明，其中提到`[Total Length: 50051 bytes (reported as 0, presumed to be because of "TCP segmentation offload" (TSO))]`
    // **TSO**（TCP Segment Offload）是一种利用网卡的少量处理能力，降低CPU发送数据包负载的技术，需要网卡硬件及驱动的支持。  http://baike.baidu.com/item/tso/1843452
    /**
     * WebSocket版本的NetService
     * @author 3tion
     */
    var WSNetService = (function (_super) {
        __extends(WSNetService, _super);
        function WSNetService() {
            var _this = _super.call(this) || this;
            _this.onOpen = function () {
                _this._ws.onopen = null;
                if (true) {
                    console.log("webSocket连接成功");
                }
                junyou.dispatch(-197 /* Connected */);
            };
            /**
             *
             * 发生错误
             * @protected
             */
            _this.onError = function (ev) {
                if (true) {
                    junyou.ThrowError("socket发生错误", ev.error);
                }
                junyou.dispatch(-196 /* ConnectFailed */);
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
                junyou.dispatch(-195 /* Disconnect */);
            };
            /**
             *
             * 收到消息
             * @protected
             */
            _this.onData = function (ev) {
                var readBuffer = _this._readBuffer;
                var ab = new Uint8Array(ev.data);
                var temp;
                var position = readBuffer.position;
                var buffer = readBuffer.buffer;
                var length = buffer.byteLength;
                if (position < length) {
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
                _this.decodeBytes(readBuffer);
            };
            //覆盖instance
            junyou.NetService._ins = _this;
            return _this;
        }
        /**
         *
         * 设置websocket地址
         * @param {string} actionUrl
         */
        WSNetService.prototype.setUrl = function (actionUrl) {
            if (this._actionUrl != actionUrl) {
                this._actionUrl = actionUrl;
                var ws = this._ws;
                if (ws && ws.readyState <= WebSocket.OPEN) {
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
                ws.onclose = null;
                ws.onerror = null;
                ws.onmessage = null;
                ws.onopen = null;
            }
            this._ws = ws = new WebSocket(this._actionUrl);
            ws.binaryType = "arraybuffer";
            ws.onclose = this.onClose;
            ws.onerror = this.onError;
            ws.onmessage = this.onData;
            ws.onopen = this.onOpen;
        };
        WSNetService.prototype._send = function (cmd, data, msgType) {
            var ws = this._ws;
            if (ws.readyState != WebSocket.OPEN) {
                return;
            }
            //没有同协议的指令，新增数据
            var pdata = junyou.recyclable(junyou.NetSendData);
            pdata.cmd = cmd;
            pdata.data = data;
            pdata.msgType = msgType;
            var sendBuffer = this._sendBuffer;
            sendBuffer.reset();
            this.writeToBuffer(sendBuffer, pdata);
            pdata.recycle();
            var pcmdList = this._pcmdList;
            for (var _i = 0, pcmdList_2 = pcmdList; _i < pcmdList_2.length; _i++) {
                var pdata_1 = pcmdList_2[_i];
                this.writeToBuffer(sendBuffer, pdata_1);
                pdata_1.recycle();
            }
            //清空被动数据
            pcmdList.length = 0;
            ws.send(sendBuffer.outBytes);
        };
        return WSNetService;
    }(junyou.NetService));
    junyou.WSNetService = WSNetService;
    __reflect(WSNetService.prototype, "junyou.WSNetService");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var structDict = junyou.Temp.EmptyObject;
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
     *
     * @author 3tion
     * javascript 只会使用到 varint32->number string boolean
     *
     */
    junyou.PBMessageUtils = {
        /**
         * 注册定义
         */
        regDef: regDef,
        /**
         * 设置ProtoBuf的消息定义字典
         *
         * @static
         * @param {PBStructDict} dict
         *
         * @memberOf PBMessageUtils
         */
        setPBDict: function (dict) {
            //对默认值做预处理，减少后期遍历次数
            if (dict) {
                structDict = dict;
                var defD = defDict;
                if (!dict.$$inted) {
                    for (var name_3 in dict) {
                        var encode = dict[name_3];
                        var def = defD[name_3];
                        if (def) {
                            regDef(encode, def);
                        }
                        //检查处理默认值
                        for (var idx in encode) {
                            var body = encode[idx];
                            //0 key
                            //1 required optional repeated
                            //2 数据类型
                            //3 Message
                            //4 默认值
                            if (4 in body) {
                                var def_1 = encode.def;
                                if (!def_1) {
                                    //不使用encode.def=def=[]; 是为了防止def被遍历
                                    Object.defineProperty(encode, "def" /* defKey */, {
                                        value: {}
                                    });
                                    def_1 = encode.def;
                                }
                                var key = body[0];
                                //消息中没有对应key的数据，先赋值成默认值，等待后续处理
                                def_1[key] = body[4];
                            }
                        }
                        if (!encode.def) {
                            Object.defineProperty(encode, "def" /* defKey */, {
                                value: Object.prototype
                            });
                        }
                    }
                    dict.$$inted = 1;
                }
            }
        },
        readFrom: readFrom,
        writeTo: writeTo
    };
    /**
     * 读取消息
     *
     * @param {(string | PBStruct)} msgType
     * @param {ByteArray} bytes
     * @param {number} [len]
     * @returns {Object}
     */
    function readFrom(msgType, bytes, len) {
        if (len === undefined)
            len = -1;
        var afterLen = 0;
        if (len > -1) {
            afterLen = bytes.bytesAvailable - len;
        }
        var encode = typeof msgType === "string" ? structDict[msgType] : msgType;
        if (!encode) {
            junyou.ThrowError("\u975E\u6CD5\u7684\u901A\u4FE1\u7C7B\u578B[" + msgType + "]");
            return;
        }
        //检查处理默认值
        var msg = Object.create(encode.def);
        while (bytes.bytesAvailable > afterLen) {
            var tag = bytes.readVarint();
            if (tag == 0)
                continue;
            var idx = tag >>> 3;
            var body = encode[idx];
            if (!body) {
                junyou.ThrowError("\u8BFB\u53D6\u6D88\u606F\u7C7B\u578B\u4E3A\uFF1A" + msgType + "\uFF0C\u7D22\u5F15" + idx + "\u65F6\u6570\u636E\u51FA\u73B0\u9519\u8BEF\uFF0C\u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u6570\u636E\u7ED3\u6784\u914D\u7F6E");
                // 使用默认读取
                readValue(tag, bytes);
                continue;
            }
            var name_4 = body[0];
            var label = body[1];
            var type = body[2];
            var subMsgType = body[3];
            var value = void 0;
            if (label != 3 || (tag & 7) != 7) {
                switch (type) {
                    case 1 /* Double */:
                        value = bytes.readDouble();
                        break;
                    case 2 /* Float */:
                        value = bytes.readFloat();
                        break;
                    case 3 /* Int64 */:
                    case 4 /* UInt64 */:
                    case 18 /* SInt64 */:
                        value = bytes.readVarint64(); //理论上项目不使用
                        break;
                    case 5 /* Int32 */:
                        value = bytes.readVarint();
                        break;
                    case 17 /* SInt32 */:
                        value = decodeZigzag32(bytes.readVarint());
                        break;
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
                    case 10 /* Group */://(protobuf 已弃用)
                        value = undefined;
                        if (true) {
                            junyou.ThrowError("\u8BFB\u53D6\u6D88\u606F\u7C7B\u578B\u4E3A\uFF1A" + msgType + "\uFF0C\u7D22\u5F15" + idx + "\u65F6\u6570\u636E\u51FA\u73B0\u5DF2\u5F03\u7528\u7684GROUP\u5206\u7EC4\u7C7B\u578B");
                        }
                        break;
                    case 11 /* Message */://消息
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
            if (label == 3) {
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
            case 0://Varint	int32, int64, uint32, uint64, sint32, sint64, bool, enum
                value = bytes.readVarint();
                break;
            case 2://Length-delimi	string, bytes, embedded messages, packed repeated fields
                value = readString(bytes);
                break;
            case 5://32-bit	fixed32, sfixed32, float
                value = bytes.readInt();
                break;
            case 1://64-bit	fixed64, sfixed64, double
                value = bytes.readDouble();
                break;
            default:
                junyou.ThrowError("protobuf的wireType未知");
        }
        return value;
    }
    function readString(bytes) {
        var blen = bytes.readVarint();
        if (blen > 0) {
            return bytes.readUTFBytes(blen);
        }
        return "";
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
     * @param {Object} msg
     * @param {(string | PBStruct)} msgType
     * @param {ByteArray} [bytes]
     * @returns {ByteArray}
     */
    function writeTo(msg, msgType, bytes, debugOutData) {
        if (msg == undefined) {
            return;
        }
        var messageEncode = typeof msgType === "string" ? structDict[msgType] : msgType;
        if (!messageEncode) {
            junyou.ThrowError("\u975E\u6CD5\u7684\u901A\u4FE1\u7C7B\u578B[" + msgType + "]\uFF0C\u5806\u6808\u4FE1\u606F:" + new Error());
            return;
        }
        if (!bytes) {
            bytes = new junyou.ByteArray;
        }
        for (var numberStr in messageEncode) {
            var num = +numberStr;
            var body = messageEncode[num];
            var label = body[1];
            var name_5 = body[0];
            if (label == 1 /* optional */ && !(name_5 in msg)) {
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
            if (label == 3 /* repeated */) {
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
                bytes.writeFloat(value);
                break;
            case 1 /* Double */:
                bytes.writeDouble(value);
                break;
            case 6 /* Fixed64 */: //理论上项目不使用
            case 16 /* SFixed64 */://理论上项目不使用
                bytes.writeFix64(value);
                break;
            case 5 /* Int32 */:
                bytes.writeVarint(checkInt32(value, type));
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
                    temp = new junyou.ByteArray;
                    temp.writeUTFBytes(value);
                }
                length = temp ? temp.length : 0;
                bytes.writeVarint(length);
                if (length > 0) {
                    bytes.writeBytes(temp, 0, length);
                }
                break;
        }
        if (true) {
            return out;
        }
        function checkUInt32(value, type) {
            value = +value || 0;
            if (value > 4294967295 || value < 0) {
                junyou.ThrowError("PBMessageUtils\u5199\u5165\u6570\u636E\u65F6\u5019\uFF0C\u4F7F\u7528\u7684\u7C7B\u578B\uFF1A" + type + "\uFF0C\u503C\u4E3A\uFF1A" + value + "\uFF0C\u4F46\u8D85\u51FA\u6574\u578B\u8303\u56F4\u3002");
                value >>> 0;
            }
            return value;
        }
        function checkInt32(value, type) {
            value = +value || 0;
            if (value > 2147483647 || value < -2147483648) {
                junyou.ThrowError("PBMessageUtils\u5199\u5165\u6570\u636E\u65F6\u5019\uFF0C\u4F7F\u7528\u7684\u7C7B\u578B\uFF1A" + type + "\uFF0C\u503C\u4E3A\uFF1A" + value + "\uFF0C\u4F46\u8D85\u51FA\u6574\u578B\u8303\u56F4\u3002");
                value >> 0;
            }
            return value;
        }
    }
    function zigzag32(n) {
        return (n << 1) ^ (n >> 31);
    }
    function decodeZigzag32(n) {
        return n >> 1 ^ (((n & 1) << 31) >> 31);
    }
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *  尝试启用本地资源缓存
     * @author 3tion(https://github.com/eos3tion/)
     * @export
     * @param {number} [version=1]
     * @returns
     */
    function tryLocalRes(version) {
        if (version === void 0) { version = 1; }
        if (egret.Capabilities.supportVersion != "Unknown") {
            return;
        }
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
        w.URL = window.URL || w.webkitURL;
        //当前ios10还不支持IndexedDB的Blob存储，所以如果是ios，则此值为false
        var canUseBlob = egret.Capabilities.os == "iOS" ? false : !!(window.Blob && window.URL);
        /**
         * 本地数据库操作
         */
        var db = (function (version) {
            var keyPath = "url";
            var RW = "readwrite";
            var R = "readonly";
            var storeName = 'res';
            return {
                /**
                 * 存储资源
                 *
                 * @param {RES.ResourceItem} data
                 * @param {(this: IDBRequest, ev: Event) => any} callback 存储资源执行完成后的回调
                 */
                save: function (data, callback) {
                    open(function (result) {
                        var store = getObjectStore(result, RW);
                        var request = data.url ? store.put(data) : store.add(data);
                        request.onsuccess = callback;
                    });
                },
                /**
                 * 获取资源
                 *
                 * @param {string} url
                 * @param {{ (data: RES.ResourceItem) }} callback
                 */
                get: function (url, callback) {
                    open(function (result) {
                        var store = getObjectStore(result, R);
                        var request = store.get(url);
                        request.onsuccess = function (e) {
                            callback(e.target.result);
                        };
                    }, function (e) { callback(null); });
                },
                /**
                 * 删除指定资源
                 *
                 * @param {string} url
                 * @param {{ (this: IDBRequest, ev: Event) }} callback 删除指定资源执行完成后的回调
                 */
                delete: function (url, callback) {
                    open(function (result) {
                        var store = getObjectStore(result, RW);
                        var request = store.delete(url);
                        request.onsuccess = callback;
                    });
                },
                /**
                 * 删除全部资源
                 *
                 * @param {{ (this: IDBRequest, ev: Event) }} callback 删除全部资源执行完成后的回调
                 */
                clear: function (callback) {
                    open(function (result) {
                        var store = getObjectStore(result, RW);
                        var request = store.clear();
                        request.onsuccess = callback;
                    });
                }
            };
            function open(callback, onError) {
                try {
                    var request = indexedDB.open(storeName, version);
                }
                catch (e) {
                    junyou.ThrowError("indexedDB error", e);
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
                return result.transaction(storeName, mode).objectStore(storeName);
            }
            function errorHandler(ev) {
                junyou.ThrowError("indexedDB error", ev.error);
            }
        })(version);
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        //注入
        var ImageAnalyzer = (function (_super) {
            __extends(ImageAnalyzer, _super);
            function ImageAnalyzer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ImageAnalyzer.prototype.loadFile = function (resItem, compFunc, thisObject) {
                var _this = this;
                // 检查内存中是否有本地资源
                if (this.fileDic[resItem.name]) {
                    compFunc.call(thisObject, resItem);
                    return;
                }
                var url = RES.$getVirtualUrl(resItem.url);
                db.get(url, function (data) {
                    var loader = _this.getLoader();
                    _this.resItemDic[loader.$hashCode] = { item: resItem, func: compFunc, thisObject: thisObject };
                    if (data) {
                        var rawData = data.local;
                        if (rawData instanceof Blob) {
                            url = URL.createObjectURL(rawData);
                        }
                        else if (typeof rawData === "string") {
                            url = rawData;
                        }
                        else {
                            if (true) {
                                junyou.ThrowError("出现ImageAnalyzer本地缓存不支持的情况");
                            }
                        }
                        resItem.local = rawData;
                    }
                    loader.load(url); //走原流程
                });
            };
            ImageAnalyzer.prototype.onLoadFinish = function (event) {
                var request = event.$target;
                var data = this.resItemDic[request.$hashCode];
                delete this.resItemDic[request.$hashCode];
                var item = data.item;
                var local = item.local;
                if (!local) {
                    var url = item.url;
                    var req = request.request;
                    if (req && req._url == url) {
                        var type = req.responseType;
                        if (type == "blob") {
                            // 将数据存到本地缓存
                            local = req.response;
                        }
                    }
                    else {
                        // 普通图片
                        // 尝试转换成DataURL，此方法为同步方法，可能会影响性能
                        var dat = request.data;
                        if (dat instanceof egret.BitmapData) {
                            var img = dat.source;
                            var w_1 = img.width;
                            var h = img.height;
                            var type = "image/" + url.substring(url.lastIndexOf(".") + 1);
                            canvas.width = w_1;
                            canvas.height = h;
                            context.clearRect(0, 0, w_1, h);
                            context.drawImage(img, 0, 0);
                            try {
                                if (canUseBlob && url.indexOf("wxLocalResource:") != 0) {
                                    canvas.toBlob(function (blob) {
                                        item.local = blob;
                                        //存储数据
                                        db.save(item);
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
                                item.local = this.result;
                                //存储数据
                                db.save(item);
                            };
                            a.readAsDataURL(local);
                        }
                        else {
                            item.local = local;
                            //存储数据
                            db.save(item);
                        }
                    }
                }
                item.loaded = (event.$type == "complete" /* COMPLETE */);
                if (item.loaded) {
                    var texture = new egret.Texture();
                    texture._setBitmapData(request.data);
                    this.analyzeData(item, texture);
                }
                delete request.request;
                this.recycler.push(request);
                return data.func.call(data.thisObject, item);
            };
            return ImageAnalyzer;
        }(RES.ImageAnalyzer));
        RES.registerAnalyzer("image" /* TYPE_IMAGE */, ImageAnalyzer);
        return db;
    }
    junyou.tryLocalRes = tryLocalRes;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 资源管理器
     */
    var _resources = {};
    junyou.ResourceManager = {
        get: function (resid, noResHandler, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            var res = getResource(resid);
            if (!res) {
                res = noResHandler.apply(thisObj, args);
                regResource(resid, res);
            }
            return res;
        },
        // addChecker(checker: ResourceChecker) {
        //     _checkers.pushOnce(checker);
        // },
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
                if (!(res instanceof junyou.TextureResource)) {
                    junyou.ThrowError("[" + resID + "]\u8D44\u6E90\u6709\u8BEF\uFF0C\u4E0D\u662FTextureResource");
                    res = undefined;
                }
            }
            if (!res) {
                res = new junyou.TextureResource();
                res.resID = resID;
                res.url = junyou.ConfigUtils.getResUrl(resID + (!noWebp ? junyou.Global.webp : ""));
                resources[resID] = res;
            }
            return res;
        },
        /**
         * 获取资源
         */
        getResource: getResource,
        // /**
        //  * 注册资源
        //  */
        // regResource,
        //按时间检测资源
        init: function () {
            var tobeDele = [];
            junyou.TimerUtil.addCallback(30000 /* CheckTime */, function () {
                var expire = junyou.Global.now - 300000 /* DisposeTime */;
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
                        RES.destroyRes(res.url);
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
        if (resID in resources) {
            return resources[resID] === res;
        }
        resources[resID] = res;
        return true;
    }
})(junyou || (junyou = {}));
if (true) {
    var ErrorTexture = new egret.Texture();
    var img = new Image(40, 40);
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAWUlEQVRYR+3SwQkAIAwEwaT/orWI/YiM/wWZ3J6ZMw+/9cF4HYIRcAgSrAK1t0GCVaD2NkiwCtTeBglWgdrbIMEqUHsbJFgFam+DBKtA7W2QYBWovQ1+L3gB8nhP2Y60cpgAAAAASUVORK5CYII=";
    ErrorTexture._setBitmapData(img);
}
var junyou;
(function (junyou) {
    /**
     *
     * 纹理资源
     * @export
     * @class TextureResource
     * @implements {IResource}
     */
    var TextureResource = (function () {
        function TextureResource() {
            /**
             *
             * 绑定的对象列表
             * @private
             * @type {Bitmap[]}
             */
            this._list = [];
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
            this.lastUseTime = junyou.Global.now;
        };
        /**
         *
         * 解除目标的绑定
         * @param {Bitmap} target
         */
        TextureResource.prototype.loose = function (bmp) {
            this._list.remove(bmp);
            this.lastUseTime = junyou.Global.now;
        };
        // /**
        //  * 
        //  * 纹理
        //  * @type {egret.Texture}
        //  */
        // public get texture(): egret.Texture {
        //     return this._tex;
        // }
        TextureResource.prototype.load = function () {
            RES.getResByUrl(this.url, this.loadComplete, this, "image" /* TYPE_IMAGE */);
        };
        /**
         * 资源加载完成
         */
        TextureResource.prototype.loadComplete = function (res, key) {
            if (key == this.url) {
                this._tex = res;
                for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                    var bmp = _a[_i];
                    bmp.texture = res;
                    if (true && !res) {
                        bmp.texture = ErrorTexture;
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
    junyou.TextureResource = TextureResource;
    __reflect(TextureResource.prototype, "junyou.TextureResource", ["junyou.IResource"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    junyou.MotionGuidePlugin = (function () {
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
                if (l >= 6 && (l - 2) % 4 == 0) {
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
                            tween.target.rotation += data.rotOffS + data.rotDelta * ratio;
                            break;
                        case "fixed": // follow fixed behaviour to solve potential issues
                        default:
                            tween.target.rotation += data.rotOffS;
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
            var rotGlobalD = tween.__rotGlobalE - tween.__rotGlobalS;
            var rotPathD = tween.__rotPathE - tween.__rotPathS;
            var rot = rotGlobalD - rotPathD;
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 状态机
     * @author 3tion
     */
    var StateListenerMachine = (function () {
        function StateListenerMachine() {
            this.states = {};
            this.aways = [];
        }
        StateListenerMachine.prototype.add = function (value) {
            if (!value) {
                junyou.ThrowError("addStateListener没有设置正确!");
            }
            this.aways.pushOnce(value);
        };
        StateListenerMachine.prototype.remove = function (value) {
            this.aways.remove(value);
        };
        /**
         *  一个侦听加入到多个状态;
         * @param type
         * @param args
         *
         */
        StateListenerMachine.prototype.addToStates = function (value) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!value) {
                junyou.ThrowError("addToStateList没有设置正确!");
            }
            for (var type in args) {
                this.addToState(type, value);
            }
        };
        /**
         * 从所有状态中删除侦听;
         * @param value
         *
         */
        StateListenerMachine.prototype.removeAllState = function (value) {
            if (!value) {
                return;
            }
            var states = this.states;
            if (states) {
                for (var type in states) {
                    this.removeFromState(+type, value);
                }
            }
        };
        /**
         * 从单个状态中,删了一个具体侦听;
         * @param type
         * @param value
         * @return
         *
         */
        StateListenerMachine.prototype.removeFromState = function (state, value) {
            var list = this.states[state];
            if (!list) {
                return false;
            }
            return list.remove(value);
        };
        /**
         * 单个状态中加入一个侦听;
         * @param value
         * @param list
         *
         */
        StateListenerMachine.prototype.addToState = function (state, value) {
            if (!value) {
                junyou.ThrowError("addToState没有设置正确!");
            }
            var list = this.states[state];
            if (list) {
                if (~list.indexOf(value))
                    return;
            }
            else {
                this.states[state] = list = [];
            }
            list.push(value);
            if (this._current == state) {
                value.awakeBy(this._current);
            }
        };
        /**
         *  清理状态机;
         *
         */
        StateListenerMachine.prototype.clear = function () {
            this.states = {};
            this.aways.length = 0;
            this._current = undefined;
        };
        /**
         * 设置当前的状态
         * @param value
         *
         */
        StateListenerMachine.prototype.setState = function (value) {
            var old = this._current;
            if (old == value) {
                return;
            }
            this._current = value;
            var oldList = this.states[old];
            var newList = this.states[value];
            //旧的关闭
            if (oldList) {
                for (var i = 0; i < oldList.length; i++) {
                    var item = oldList[i];
                    if (!newList || !~newList.indexOf(item)) {
                        item.sleepBy(value);
                    }
                }
            }
            //新的开启
            if (newList) {
                for (var i = 0; i < newList.length; i++) {
                    var item = newList[i];
                    item.awakeBy(value);
                }
            }
            var aways = this.aways;
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
        StateListenerMachine.prototype.isInState = function (switcher, type) {
            type == void 0 && (type = this._current);
            var list = this.states[type];
            if (list) {
                return list.indexOf(switcher) > -1;
            }
            return false;
        };
        return StateListenerMachine;
    }());
    junyou.StateListenerMachine = StateListenerMachine;
    __reflect(StateListenerMachine.prototype, "junyou.StateListenerMachine", ["junyou.IStateListener"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * description
     * @author pb
     */
    var UILimiter = (function () {
        function UILimiter() {
        }
        Object.defineProperty(UILimiter, "currentState", {
            /**
             * 获取当前state
             * @return
             *
             */
            get: function () {
                return this._currentState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UILimiter, "listener", {
            /**
             * 取得状态侦听管理器(以便注册关注的状态)
             * @return
             *
             */
            get: function () {
                return this.imple.listener;
            },
            enumerable: true,
            configurable: true
        });
        UILimiter.enter = function (id) {
            if (this._currentState == id) {
                return;
            }
            this._currentState = id;
            this.imple.setState(id);
            this.historys.push(id);
            //只存5个历史记录;
            if (this.historys.length > 5) {
                this.historys.shift();
            }
        };
        /**
         * 退出
         *
         *
         */
        UILimiter.exit = function (id) {
            if (!id) {
                id = this._currentState;
            }
            if (this._currentState != id) {
                return;
            }
            var historys = this.historys;
            var len = historys.length;
            //弹出当前记录;
            historys.pop();
            //还原上一个记录;
            if (len > 1) {
                this.enter(historys.pop());
            }
            else {
                this.enter(0);
            }
        };
        /**
         * 检查是否被限制 (true为被限制，false没有限制)
         * @param value
         *
         */
        UILimiter.check = function (value) {
            return this.imple.check(value);
        };
        UILimiter.imple = new junyou.LimitQueue();
        /**
         * 像浏览器的历史记录;
         */
        UILimiter.historys = [];
        return UILimiter;
    }());
    junyou.UILimiter = UILimiter;
    __reflect(UILimiter.prototype, "junyou.UILimiter");
    function addToStates(value) {
        var ids = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ids[_i - 1] = arguments[_i];
        }
        (_a = UILimiter.listener).addToStates.apply(_a, [value].concat(ids));
        var _a;
    }
    junyou.addToStates = addToStates;
    function addToState(id, value) {
        UILimiter.listener.addToState(id, value);
    }
    junyou.addToState = addToState;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 使用数值或者字符串类型作为Key
     * V 作为Value的字典
     * 原生的map(ECMAScript5无Map)无法自定义列表顺序，而是完全按照加载顺序的，所以才需要有此类型
     * 列表存储Value
     * @author 3tion
     * @class ArraySet
     * @template V
     */
    var ArraySet = (function () {
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
             * @memberOf ArraySet
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
             * @memberOf ArraySet
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
         * @memberOf ArraySet
         */
        ArraySet.prototype.setRawDict = function (dict) {
            this._dict = dict;
            var list = this._list;
            var i = 0;
            for (var key in dict) {
                list[i++] = dict[key];
            }
            list.length = i;
        };
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
        };
        /**
         *
         * 设置数据
         *
         * @param {(string | number)} key
         * @param {V} value
         * @return {number} 返回值加入到数据中的索引
         * @memberOf ArraySet
         */
        ArraySet.prototype.set = function (key, value) {
            var list = this._list;
            var idx = list.indexOf(value);
            if (idx == -1) {
                idx = list.length;
                list[idx] = value;
            }
            this._dict[key] = value;
            return idx;
        };
        /**
         * 获取数据
         *
         * @param {(string | number)} key
         * @returns
         *
         * @memberOf ArraySet
         */
        ArraySet.prototype.get = function (key) {
            return this._dict[key];
        };
        /**
         * 根据key移除数据
         *
         * @param {(string | number)} key
         *
         * @memberOf ArraySet
         */
        ArraySet.prototype.delete = function (key) {
            var old = this._dict[key];
            delete this._dict[key];
            if (old) {
                var idx = this._list.indexOf(old);
                if (idx > -1) {
                    this._list.splice(idx, 1);
                }
            }
            return old;
        };
        /**
         * 清理数据
         *
         *
         * @memberOf ArraySet
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
             * @memberOf ArraySet
             */
            get: function () {
                return this._list.length;
            },
            enumerable: true,
            configurable: true
        });
        return ArraySet;
    }());
    junyou.ArraySet = ArraySet;
    __reflect(ArraySet.prototype, "junyou.ArraySet");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 方便后续调整
     * 加入ProtoBuf的varint支持
     * @author 3tion
     *
     */
    var ByteArray = (function (_super) {
        __extends(ByteArray, _super);
        function ByteArray(buffer) {
            return _super.call(this, buffer) || this;
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
        ByteArray.prototype.writeInt64 = function (value) {
            this.validateBuffer(8 /* SIZE_OF_INT64 */);
            var i64 = junyou.Int64.fromNumber(value);
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
                return junyou.Int64.toNumber(low, high);
            }
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
                return junyou.Int64.toNumber(low, high);
            }
        };
        ByteArray.prototype.writeFix64 = function (value) {
            var i64 = junyou.Int64.fromNumber(value);
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
         * @returns {ByteArray}
         */
        ByteArray.prototype.readByteArray = function (length) {
            return new junyou.ByteArray(this.readBuffer(length));
        };
        /**
         * 向字节流中写入64位的可变长度的整数(Protobuf)
         */
        ByteArray.prototype.writeVarint64 = function (value) {
            var i64 = junyou.Int64.fromNumber(value);
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
                        return junyou.Int64.toNumber(low, high);
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
                return junyou.Int64.toNumber(low, high);
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
            return junyou.Int64.toNumber(low, high);
        };
        Object.defineProperty(ByteArray.prototype, "outBytes", {
            /**
             * 获取写入的字节
             * 此方法不会新建 ArrayBuffer
             * @readonly
             * @memberof ByteArray
             */
            get: function () {
                return new Uint8Array(this._bytes, 0, this.write_position);
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
    junyou.ByteArray = ByteArray;
    __reflect(ByteArray.prototype, "junyou.ByteArray");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    ;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
     * @author
     *
     */
    var Int64 = (function () {
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
    junyou.Int64 = Int64;
    __reflect(Int64.prototype, "junyou.Int64");
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    junyou.Location = {
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 时间处理函数
     * DateUtils
     */
    var _sharedDate = new Date();
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
    junyou.DateUtils = {
        /**
         * 获取共享时间
         */
        get sharedDate() {
            return _sharedDate;
        },
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
        getDefaultCDFOption: getDefaultCDFOption,
        /**
         * 注册默认的CD格式，方便后续调用
         *
         * @param {CountDownFormat} format
         * @param {CountDownFormatOption} opt
         */
        regCDFormat: function (format, opt) {
            initDefaultCDFormats();
            _defaultCountFormats[format] = opt;
        },
        /**
         * 初始化服务器时间
         *
         * @static
         * @param {number} time 服务器时间戳
         * @param {number} timezoneOffset 服务器基于UTC的时区偏移  单位：分钟
         */
        initServerTime: function (time, timezoneOffset) {
            _utcOffset = -timezoneOffset * 60000 /* ONE_MINUTE */;
            this.setServerTime(time);
        },
        /**
         * 设置服务器时间
         * 用于同步服务器时间
         * @static
         * @param {number} time
         */
        setServerTime: function (time) {
            _serverUTCTime = time - Date.now() + _utcOffset;
        },
        /**
         * 通过UTC偏移过的当前时间戳
         *
         * @static
         */
        get serverTime() {
            return _serverUTCTime + Date.now();
        },
        /**
         * 获取当前时间戳，用于和服务端的时间戳进行比较
         *
         * @readonly
         * @static
         */
        get rawServerTime() {
            return this.serverTime - _utcOffset;
        },
        /**
         * 通过UTC偏移过的当前时间戳的Date对象
         */
        get serverDate() {
            _sharedDate.setTime(this.serverTime);
            return _sharedDate;
        },
        /**
         * 项目中，所有时间都需要基于UTC偏移处理
         *
         * @static
         * @param {number} time			要格式化的时间，默认为UTC时间
         * @param {string} format 		  格式字符串 yyyy-MM-dd HH:mm:ss
         * @param {boolean} [isRaw=true] 	是否为原始未使用utc偏移处理的时间，默认 true
         * @returns
         */
        getFormatTime: function (time, format, isRaw) {
            if (isRaw === void 0) { isRaw = true; }
            if (isRaw) {
                time = this.getUTCTime(time);
            }
            _sharedDate.setTime(time);
            return _sharedDate.format(format);
        },
        /**
         * 获取指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {number} 指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         */
        getDayEnd: function (utcTime) {
            if (utcTime === undefined)
                utcTime = this.serverTime;
            _sharedDate.setTime(utcTime);
            return _sharedDate.setUTCHours(23, 59, 59, 999);
        },
        /**
         * 获取指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {Date} 指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         */
        getDayStart: function (utcTime) {
            if (utcTime === undefined)
                utcTime = this.serverTime;
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
            if (tmp) {
                var day = leftTime / 86400000 /* ONE_DAY */ >> 0;
                leftTime = leftTime - day * 86400000 /* ONE_DAY */;
                out += tmp.substitute(day);
            }
            tmp = format.h;
            if (tmp) {
                var hour = leftTime / 3600000 /* ONE_HOUR */ >> 0;
                leftTime = leftTime - hour * 3600000 /* ONE_HOUR */;
                out += tmp.substitute(hour);
            }
            tmp = format.m;
            if (tmp) {
                var minute = leftTime / 60000 /* ONE_MINUTE */ >> 0;
                leftTime = leftTime - minute * 60000 /* ONE_MINUTE */;
                out += tmp.substitute(minute);
            }
            tmp = format.s;
            if (tmp) {
                var second = leftTime / 1000 /* ONE_SECOND */ >> 0;
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
            junyou.DateUtils.getDefaultCDFOption = _getDefaultCDFOption;
        }
        return _getDefaultCDFOption(format);
        function _getDefaultCDFOption(format) {
            return _defaultCountFormats[format];
        }
    }
    function initDefaultCDFormats() {
        if (!_defaultCountFormats) {
            var LangUtil_1 = junyou.LangUtil;
            _defaultCountFormats = (_a = {},
                _a[0 /* D_H_M_S */] = { d: LangUtil_1.getMsg("$_ndays"), h: LangUtil_1.getMsg("$_nhours"), m: LangUtil_1.getMsg("$_nminutes"), s: LangUtil_1.getMsg("$_nsecends") },
                _a[1 /* H_M_S */] = { h: LangUtil_1.getMsg("$_nhours"), m: LangUtil_1.getMsg("$_nminutes"), s: LangUtil_1.getMsg("$_nsecends") },
                _a[2 /* H_M */] = { h: LangUtil_1.getMsg("$_nhours"), m: LangUtil_1.getMsg("$_nminutes") },
                _a[3 /* M_S */] = { m: LangUtil_1.getMsg("$_nminutes"), s: LangUtil_1.getMsg("$_nsecends") },
                _a[4 /* S */] = { s: LangUtil_1.getMsg("$_nsecends") },
                _a);
            return true;
        }
        var _a;
    }
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * TimveVO
     */
    var TimeVO = (function () {
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
            return this._decode(minutes / 60 | 0, minutes % 60);
        };
        /**
         * 从一个数值进行序列化
         * decodeMinutes和decodeBit，如果使用protobuf writeVarint32 存储，时间只要超过 02:08，不管如何使用何种方式，一定会超过2字节，而 23:59，不管怎么存储，都不会超过2字节
         * decodeBit解析比 decodeMinutes更加快捷
         * 而 hour<<6|minute  解析会更简单，快速
         * @param {number} value
         */
        TimeVO.prototype.decodeBit = function (value) {
            return this._decode(value >> 6, value & 63);
        };
        /**
         * 解析数据
         *
         * @private
         * @param {number} hour
         * @param {number} minute
         * @returns
         */
        TimeVO.prototype._decode = function (hour, minute) {
            this.hour = hour;
            this.minute = minute;
            this.time = hour * 3600000 /* ONE_HOUR */ + minute * 60000 /* ONE_MINUTE */;
            this.strTime = hour.zeroize(2) + ":" + minute.zeroize(2);
            return this;
        };
        /**
         * 从字符串中解析
         *
         * @param {number} strTime 通过解析器解析的数据
         */
        TimeVO.prototype.decode = function (strTime) {
            var timeArr = strTime.split(":");
            if (timeArr.length >= 2) {
                return this._decode(+timeArr[0], +timeArr[1]);
            }
            else {
                junyou.ThrowError("时间格式不正确，不为HH:mm格式，当前配置：" + strTime);
            }
        };
        Object.defineProperty(TimeVO.prototype, "todayTime", {
            /**
            * 获取今日的服务器时间
            *
            * @readonly
            *
            * @memberOf TimeVO
            */
            get: function () {
                return junyou.DateUtils.getDayStart() + this.time;
            },
            enumerable: true,
            configurable: true
        });
        return TimeVO;
    }());
    junyou.TimeVO = TimeVO;
    __reflect(TimeVO.prototype, "junyou.TimeVO");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 延迟执行
     * @author 3tion
     */
    var CallLater = (function () {
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
            var cInfo = junyou.CallbackInfo.addToList.apply(junyou.CallbackInfo, [this._callLaters, callback, thisObj].concat(args));
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
        return CallLater;
    }());
    junyou.CallLater = CallLater;
    __reflect(CallLater.prototype, "junyou.CallLater");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 圆圈倒计时
     *
     * @export
     * @class CircleCountdown
     */
    var CircleCountdown = (function () {
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
            if (prev && !prev.noGradient) {
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
                    junyou.ThrowError("进度条最大宽度不应小等于0");
                }
                maxValue = 0.00001;
            }
            if (value > maxValue) {
                value = maxValue;
            }
            this._p = value / maxValue;
            junyou.Global.callLater(this.render, 0, this);
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
                if (reverse) {
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
    junyou.CircleCountdown = CircleCountdown;
    __reflect(CircleCountdown.prototype, "junyou.CircleCountdown");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 颜色工具
     * @author 3tion
     *
     */
    junyou.ColorUtil = {
        /**
         * 获取颜色字符串 #a1b2c3
         * @param c
         * @return 获取颜色字符串 #a1b2c3
         *
         */
        getColorString: function (c) {
            return "#" + c.toString(16).zeroize(6);
        },
        /**
         * 将#a1b2c3这样#开头的颜色字符串，转换成颜色数值
         */
        getColorValue: function (c) {
            if (/#[0-9a-f]{6}/i.test(c)) {
                return +("0x" + c.substring(1));
            }
            else {
                if (true) {
                    junyou.ThrowError("\u4F7F\u7528\u7684\u989C\u8272" + c + "\u6709\u8BEF");
                }
                return 0;
            }
        }
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    junyou.DataUrlUtils = function () {
        var _texture;
        return {
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
    }();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 滤镜辅助
     *
     * @export
     * @class FilterUtils
     */
    junyou.FilterUtils = {
        /**
         * 共享灰度滤镜列表
         */
        gray: [new egret.ColorMatrixFilter([0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0])],
        /**暗淡滤镜 */
        dark: [new egret.ColorMatrixFilter([0.5, 0, 0, 0, 6.75, 0, 0.5, 0, 0, 6.75, 0, 0, 0.5, 0, 6.75, 0, 0, 0, 1, 0])],
        /**模糊滤镜 */
        blur: [new egret.BlurFilter(5, 5)]
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    junyou.getCenter = getCenter;
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
    junyou.intersects = intersects;
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
        for (var i = 1; i < length; i++) {
            var p = points[i];
            s += (p.x - last.x) * (p.y + last.y);
            last = p;
        }
        s += (p0.x - last.x) * (p0.y + last.y);
        return s * .5;
    }
    junyou.getArea = getArea;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * HTML工具类
     * @author 3tion
     */
    junyou.HTMLUtil = (function () {
        var unescChars = { "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&apos;": "\'", "&amp;": "&", "&nbsp;": " ", "&#x000A;": "\n" };
        var escChars = { "<": "&lt;", ">": "&gt;", "'": "&apos;", "\"": "&quot;", "&": "&amp;" };
        return {
            /**
             * 字符着色
             *
             * @param {string | number} value                内容
             * @param {(string | number)} color     颜色
             * @returns
             */
            createColorHtml: function (value, color) {
                var c;
                if (typeof color == "number") {
                    c = junyou.ColorUtil.getColorString(color);
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
            escapeHTML: function (content) {
                return content.replace(/<|>|"|'|&/g, function (substring) {
                    return escChars[substring];
                });
            },
            /**
             * 将HTML特殊符号，恢复成正常字符串
             *
             * @param {string} content
             * @returns
             */
            unescapeHTML: function (content) {
                return content.replace(/&lt;|&gt;|&quot;|&apos;|&amp;|&nbsp;|&#x000A;/g, function (substring) {
                    return unescChars[substring];
                });
            }
        };
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var _msgDict = {};
    /**
     * 用于处理语言/文字显示
     */
    junyou.LangUtil = {
        /**
         * 获取显示的信息
         *
         * @static
         * @param {Key} code code码
         * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
         * @returns 显示信息
         */
        getMsg: function (code) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (code in _msgDict) {
                return _msgDict[code].substitute(args);
            }
            return typeof code === "string" ? code.substitute.apply(code, args) : code + "";
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
})(junyou || (junyou = {}));
var $nl_nc;
var junyou;
(function (junyou) {
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
    var NameUtils = (function () {
        /**
         *
         * @param randomFunc	随机算法
         *
         */
        function NameUtils(randomFunc) {
            this.setRandomFunc(randomFunc);
        }
        NameUtils.loadNameLib = function (url) {
            junyou.loadScript(url, function () {
                if ($nl_nc) {
                    //a：姓,b:符号,c1:男名,c2:女名
                    var a = $nl_nc.a, b = $nl_nc.b, c1 = $nl_nc.c1, c2 = $nl_nc.c2;
                    var split = ";";
                    a && (A = a.split(split));
                    b && (B = b.split(split));
                    c1 && (C[1 /* Male */] = c1.split(split));
                    c2 && (C[2 /* Female */] = c2.split(split));
                    $nl_nc = undefined;
                }
            });
        };
        /**
         * 设置随机算法
         * @param randomFunc
         *
         */
        NameUtils.prototype.setRandomFunc = function (randomFunc) {
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
                    junyou.ThrowError("性别必须为1或者2");
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
        return NameUtils;
    }());
    junyou.NameUtils = NameUtils;
    __reflect(NameUtils.prototype, "junyou.NameUtils");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var _dic = {};
    /**
     * 请求限制
     * @author 3tion
     *
     */
    junyou.RequestLimit = {
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
            var now = junyou.Global.now;
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    junyou.RPC = (function () {
        var seed = 1;
        var callbacks = {};
        var Timeout = "RPCTimeout";
        var count = 0;
        var start;
        var willDel = [];
        return {
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
                var success = junyou.CallbackInfo.get.apply(junyou.CallbackInfo, [callback, thisObj].concat(args));
                var error = junyou.CallbackInfo.get.apply(junyou.CallbackInfo, [withError ? callback : noErrorCallback(callback, thisObj), thisObj].concat(args));
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
            callbacks[id] = { id: id, expired: junyou.Global.now + timeout, success: success, error: error };
            count++;
            if (!start) {
                junyou.TimerUtil.addCallback(1000 /* ONE_SECOND */, check);
                start = true;
            }
            return id;
        }
        function deleteCallback(id) {
            if (id in callbacks) {
                delete callbacks[id];
                count--;
                if (count == 0) {
                    junyou.TimerUtil.removeCallback(1000 /* ONE_SECOND */, check);
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
            var now = junyou.Global.now;
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
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    junyou.SoundManager = (function () {
        /**
         * 正在播放中的声音
         */
        var playings = {};
        var soundsDict = {};
        var guid = 1;
        return {
            play: play,
            preload: preload,
            stopSound: stopSound,
            stopSounds: stopSounds,
            volume: volume
        };
        /**
         * 根据id调整音量
         *
         * @param {number} volume
         * @param {number} id
         */
        function volume(volume, id) {
            var sound = playings[id];
            if (sound) {
                var ch = sound.channel;
                if (ch) {
                    ch.volume = volume;
                }
                else {
                    pushChAction(sound, arguments);
                }
            }
        }
        function pushChAction(ch, arg) {
            var actions = ch.actions;
            if (!actions) {
                ch.actions = actions = [];
            }
            var arr = [];
            for (var i = 0; i < arg.length; i++) {
                arr[i] = arg[i];
            }
            actions.push([arg.callee, arr]);
        }
        /**
         * 停止整个domain的声音
         *
         * @param {number} domain
         * @param {boolean} [useTween]
         */
        function stopSounds(domain, useTween) {
            filterPlaying(function (ch) { return _stopFilter(ch, function (ch) { return ch.domain == domain; }, useTween); });
        }
        /**
         * 停止某个声音
         *
         * @param {number} id
         * @param {boolean} [useTween]
         */
        function stopSound(id, useTween) {
            filterPlaying(function (ch) { return _stopFilter(ch, function (ch) { return ch.id == id; }, useTween); }, true);
        }
        function _stopFilter(ch, filter, useTween) {
            var channel = ch.channel;
            var flag = filter(ch);
            if (flag) {
                if (useTween) {
                    junyou.Global.getTween(channel).to({ volume: 0 }).call(channel.stop);
                }
                else {
                    channel.stop();
                }
            }
            return !flag;
        }
        /**
         * 预加载某个音频，后续改成使用res加载，得到base64的数据
         *
         * @param {string} url
         */
        function preload(url) {
            getSound(url);
        }
        /**
         * 播放一个声音
         *
         * @param {string} url 声音地址
         * @param {SoundDomain} [domain] 声音加入的域
         * @param {number} [loop] 循环次数，默认播放1次，0则表示无限循环播放
         * @param {number} [startTime] 开始时间，默认从起点开始
         * @returns 如果可以播放声音，则返回声音通道的唯一id
         */
        function play(url, domain, loop, timeout, startTime) {
            if (loop === void 0) { loop = 1; }
            if (timeout === void 0) { timeout = 500; }
            //后续使用localRes处理
            var sound = getSound(url);
            var state = sound.state;
            if (state == -1 /* FAILED */) {
                return 0;
            }
            var id = guid++;
            domain = ~~domain;
            var ch = { id: id, url: url, domain: domain };
            playings[id] = ch;
            if (state == 2 /* COMPLETE */) {
                startChannel(sound, ch, startTime, loop);
            }
            else {
                ch.option = { startTime: startTime, playStart: junyou.Global.now, timeout: timeout, loop: loop };
                var promises = sound.promises;
                if (!promises) {
                    sound.promises = promises = [];
                }
                promises.push(id);
            }
            return id;
        }
        function startChannel(sound, ch, startTime, loop) {
            var channel = sound.sound.play(startTime, loop);
            channel.once("complete" /* COMPLETE */, onComplete, undefined);
            ch.channel = channel;
            var actions = ch.actions;
            if (actions) {
                for (var i = 0; i < actions.length; i++) {
                    var action = actions[i];
                    action[0].apply(null, action[1]);
                }
                delete ch.actions;
            }
        }
        function onComplete(e) {
            var channel = e.currentTarget;
            filterPlaying(function (ch) { return ch.channel != channel; });
        }
        function getSound(url) {
            var sound = soundsDict[url];
            if (!sound) {
                soundsDict[url] = sound = { url: url, sound: undefined, state: 1 /* REQUESTING */ };
                RES.getResByUrl(url, function (eSound) {
                    if (eSound) {
                        sound.sound = eSound;
                        sound.state = 2 /* COMPLETE */;
                        var promises = sound.promises;
                        if (promises) {
                            delete sound.promises;
                            //检查所有启动的声音，是否已经达到超时时间
                            var now = junyou.Global.now;
                            for (var i = 0, len = promises.length; i < len; i++) {
                                var id = promises[i];
                                var ch = playings[id];
                                if (ch) {
                                    var option = ch.option;
                                    if (option) {
                                        delete ch.option;
                                        var delta = now - option.playStart;
                                        if (delta < option.timeout) {
                                            var startTime = option.startTime + delta;
                                            startChannel(sound, ch, startTime, option.loop);
                                        }
                                        else {
                                            delete playings[id];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        delete sound.promises;
                        sound.state = -1 /* FAILED */;
                        //销毁所有相同url，正在播放的channel
                        filterPlaying(function (channel) { return channel.url != url; });
                    }
                }, null, "sound");
                // let eSound = new egret.Sound();
                // soundsDict[url] = sound = { url, sound: eSound, state: RequestState.REQUESTING };
                // eSound.load(url);
                // (eSound as egret.EventDispatcher).on(EgretEvent.COMPLETE, soundComplete);
                // (eSound as egret.EventDispatcher).on(EgretEvent.IO_ERROR, soundError);
            }
            return sound;
        }
        // function soundComplete(e: egret.Event) {
        //     let eSound = e.currentTarget;
        //     let sound = soundsDict[eSound.url];
        //     if (sound) {
        //         sound.state = RequestState.COMPLETE;
        //         let promises = sound.promises;
        //         if (promises) {
        //             sound.promises = undefined;
        //             //检查所有启动的声音，是否已经达到超时时间
        //             let now = Global.now;
        //             for (let i = 0, len = promises.length; i < len; i++) {
        //                 let id = promises[i];
        //                 let ch = playings[id];
        //                 if (ch) {//没有id的说明已经被移除
        //                     let option = ch.option;
        //                     if (option) {
        //                         ch.option = undefined;
        //                         let delta = now - option.playStart;
        //                         if (delta < option.timeout) {
        //                             let startTime = option.startTime + delta;
        //                             startChannel(sound, ch, startTime, option.loop);
        //                         } else {
        //                             delete playings[id];
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        // function soundError(e: egret.Event) {
        //     let eSound = e.currentTarget;
        //     let url = eSound.url;
        //     let sound = soundsDict[url];
        //     if (sound) {
        //         //销毁所有相同url，正在播放的channel
        //         filterPlaying(channel => channel.url != url);
        //     }
        // }
        function filterPlaying(filter, doBreak) {
            for (var id in playings) {
                var channel = playings[id];
                if (!filter(channel)) {
                    delete playings[id];
                    if (doBreak) {
                        break;
                    }
                }
            }
        }
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 动画的全局对象
     * @author
     *
     */
    junyou.Global = (function () {
        try {
            var supportWebp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
        }
        catch (err) {
        }
        var _webp = supportWebp ? ".webp" /* WEBP */ : "";
        var _isNative = egret.Capabilities.supportVersion != "Unknown";
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
        var _callLater;
        var _tweenManager;
        var _nextTicks = [];
        return {
            initTick: initTick, nextTick: nextTick, callLater: callLater, clearCallLater: clearCallLater, getTween: getTween, removeTween: removeTween, removeTweens: removeTweens,
            get isNative() {
                return _isNative;
            },
            get tweenManager() {
                return _tweenManager || (_tweenManager = new junyou.TweenManager());
            },
            /**
             *  当前这一帧的时间
             */
            get now() {
                return now;
            },
            /**
             * 按照帧，应该走的时间
             * 每帧根据帧率加固定时间
             * 用于处理逐帧同步用
             */
            get frameNow() {
                return frameNow;
            },
            /**
             * 是否支持webp
             */
            get webp() {
                return _webp;
            }
        };
        /**
         * 注入白鹭的全局Ticker
         */
        function initTick() {
            var ticker = egret.ticker || egret.sys.$ticker;
            var update = ticker.render;
            var delta = 0 | 1000 / ticker.$frameRate;
            var temp = [];
            _callLater = new junyou.CallLater();
            _tweenManager || (_tweenManager = new junyou.TweenManager());
            ticker.render = function () {
                var _now = Date.now();
                var dis = _now - now;
                now = _now;
                if (dis > 2000) {
                    //有2秒钟大概就是进入过休眠了
                    junyou.dispatch(-190 /* Awake */);
                    frameNow = _now;
                }
                else {
                    frameNow += delta;
                }
                //执行顺序  nextTick  callLater TimerUtil  tween  最后是白鹭的更新
                var len = _nextTicks.length;
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
                junyou.TimerUtil.tick(_now);
                _tweenManager.tick(dis);
                update.call(ticker);
            };
        }
        function nextTick(callback, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            _nextTicks.push(junyou.CallbackInfo.get.apply(junyou.CallbackInfo, [callback, thisObj].concat(args)));
        }
        /**
         * 延迟执行
         *
         * @static
         * @param {Function} callback (description)
         * @param {number} [time] 延迟执行的时间
         * @param {*} [thisObj] (description)
         * @param args (description)
         */
        function callLater(callback, time, thisObj) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            return _callLater.callLater.apply(_callLater, [callback, now, time, thisObj].concat(args));
        }
        /**
         * 清理延迟
         *
         * @static
         * @param {Function} callback (description)
         * @param {*} [thisObj] (description)
         * @returns (description)
         */
        function clearCallLater(callback, thisObj) {
            return _callLater.clearCallLater(callback, thisObj);
        }
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
        function getTween(target, props, pluginData, override) {
            return _tweenManager.get(target, props, pluginData, override);
        }
        /**
         * 移除指定的Tween
         *
         * @param {Tween} tween
         * @returns
         */
        function removeTween(tween) {
            return _tweenManager.removeTween(tween);
        }
        function removeTweens(target) {
            return _tweenManager.removeTweens(target);
        }
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    junyou.TimerUtil = (function () {
        var _timeobj = {};
        var tmpList = [];
        var willDeleted = [];
        return { addCallback: addCallback, removeCallback: removeCallback, tick: tick };
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
         * 注册回调
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
                timer = {};
                timer.tid = time; //setInterval(check, time, timer);
                timer.nt = junyou.Global.now + time;
                var list = [];
                timer.list = list;
                _timeobj[time] = timer;
                list.push(junyou.CallbackInfo.get.apply(junyou.CallbackInfo, [callback, thisObj].concat(args)));
            }
            else {
                junyou.CallbackInfo.addToList.apply(junyou.CallbackInfo, [timer.list, callback, thisObj].concat(args));
            }
        }
        /**
         * 移除回调
         *
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
                var j = -1;
                for (var i = 0, len = list.length; i < len; i++) {
                    var info = list[i];
                    if (info.checkHandle(callback, thisObj)) {
                        j = i;
                        break;
                    }
                }
                if (~j) {
                    list.splice(j, 1);
                }
                if (!list.length) {
                    clearInterval(timer.tid);
                    delete _timeobj[time];
                }
            }
        }
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    junyou.solveLink = solveLink;
})(junyou || (junyou = {}));
/**
 * 脏字内容
 */
var $dirty;
var junyou;
(function (junyou) {
    /**
     * 文字过滤
     * @author 3tion
     */
    var WordFilter = (function () {
        function WordFilter() {
        }
        /**
         * 由于脏字文件使用ajax读取，可能存在跨域问题，所以在H5中使用javascript方式加载
         */
        WordFilter.loadDirtyWord = function (url) {
            junyou.loadScript(url, function () {
                if ($dirty) {
                    WordFilter.initFilterstring($dirty, ";");
                    // 清理脏字原始数据
                    $dirty = undefined;
                }
            });
        };
        /**
         * 初始化屏蔽字
         * @param str   使用特定符号分隔的脏字列表
         * @param split 分隔符
         *
         */
        WordFilter.initFilterstring = function (str, split) {
            var arr = str.split(split);
            var _len = arr.length;
            WordFilter._len = _len;
            //每个正则，至少会增加 (?: )|，如果出现  \/*().?|+\-$\^=:!@| 这些字符，还会增加[]，如果出现\还会增加更多
            //按每个长度  5 + 2来处理
            var guessedLength = str.length + _len * 7;
            var p = /([\/*().?|+\-$\^=:!@])/g;
            var p2 = /([\\\[\]])/g;
            var t, i;
            if (guessedLength < 32768) {
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
                if (s.length < 32768) {
                    WordFilter.filterWords = new RegExp(s, "g");
                    return;
                }
            } //超过长度的采用方案2
            WordFilter._filterList = new Array(_len + 1);
            var _filterList = WordFilter._filterList;
            for (i = 0; i < _len; i++) {
                t = arr[i];
                t = t.replace(p2, "[\\$1]");
                t = t.replace(p, "[$1]");
                _filterList[i] = new RegExp(t, "g");
            }
            //| 一般我们特殊用途，也加入屏蔽字符
            _filterList[i] = new RegExp("[|]", "g");
            _len = _len + 1;
        };
        /**
         * 将敏感词替换为**
         * @param msg	要检测的文字
         * @return
         *
         */
        WordFilter.wordCensor = function (msg) {
            var _filterList = WordFilter._filterList;
            var _len = WordFilter._len;
            var replaceDirty = WordFilter.replaceDirty;
            if (_filterList) {
                for (var i = 0; i < _len; i++) {
                    msg = msg.replace(_filterList[i], replaceDirty);
                }
                return msg;
            }
            //正常版
            return msg.replace(WordFilter.filterWords, replaceDirty);
        };
        /**
         * 是否有敏感词
         * @param msg	要检测的文字
         * @return 		true为有敏感词，false为没有敏感词
         *
         */
        WordFilter.checkWord = function (msg) {
            var _filterList = WordFilter._filterList;
            if (_filterList) {
                var _len = WordFilter._len;
                for (var i = 0; i < _len; i++) {
                    _filterList[i].lastIndex = 0;
                    if (_filterList[i].test(msg)) {
                        return true;
                    }
                }
                return false;
            }
            var filterWords = WordFilter.filterWords;
            filterWords.lastIndex = 0;
            //正常版
            return filterWords.test(msg);
        };
        /**
         * 昵称的过滤数组，没有加载到数据时使用
         */
        WordFilter.filterWords = /卐|妓|婊|尻|屄|屌|睾|肏|[|]/g;
        /**
         * 将字符替换成*
         * @param substring 子字符串
         * @return
         *
         */
        WordFilter.replaceDirty = function (substring) {
            var len = substring.length;
            var result = "";
            while (len--) {
                result += "*";
            }
            return result;
        };
        return WordFilter;
    }());
    junyou.WordFilter = WordFilter;
    __reflect(WordFilter.prototype, "junyou.WordFilter");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 客户端检测
     * @author 3tion
     *
     */
    junyou.ClientCheck = {
        /**
         * 是否做客户端检查
         */
        isClientCheck: true
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 错误前缀
     */
    junyou.errorPrefix = "";
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
        function pushMsg(msg) {
            if (errorMsg.length > junyou.ThrowError.MaxCount) {
                errorMsg.shift();
            }
            var msg = getMsg(msg);
            errorMsg.push(msg);
            return msg;
        }
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
    junyou.ThrowError = function (msg, err, alert) {
        if (true && alert) {
            window.alert(msg);
        }
        msg = junyou.errorPrefix + msg;
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
        junyou.ThrowError.MaxCount = 50;
        junyou.ThrowError.errorMsg = errorMsg;
    }
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 2d游戏的引擎管理游戏层级关系<br/>
     * @author 3tion
     *
     */
    var GameEngine = (function (_super) {
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
            lc.ref = ref || junyou.GameLayer;
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
                if (layer instanceof junyou.SortedLayer) {
                    this._sortedLayers.push(layer);
                }
            }
            return layer;
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
            junyou.removeDisplay(layer);
        };
        GameEngine.prototype.awakeLayer = function (layerID) {
            var layer = this._layers[layerID];
            var cfg = GameEngine.layerConfigs[layerID];
            if (layer && cfg) {
                this.addLayer(layer, cfg);
            }
        };
        GameEngine.prototype.addLayer = function (layer, cfg) {
            if (cfg && cfg.parentid) {
                var parent = this.getLayer(cfg.parentid);
                this.addLayerToContainer(layer, parent);
            }
            else {
                this.addLayerToContainer(layer, this._stage);
            }
        };
        GameEngine.prototype.addLayerToContainer = function (layer, container) {
            var children = container.$children;
            var id = layer.id;
            var i = 0;
            for (var len = children.length; i < len; i++) {
                var child = children[i];
                if (child instanceof junyou.GameLayer) {
                    var childLayer = child;
                    if (childLayer.id > id) {
                        break;
                    }
                }
            }
            container.addChildAt(layer, i);
        };
        GameEngine.prototype.init = function () {
        };
        GameEngine.layerConfigs = {};
        return GameEngine;
    }(egret.EventDispatcher));
    junyou.GameEngine = GameEngine;
    __reflect(GameEngine.prototype, "junyou.GameEngine");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var DSprite = (function (_super) {
        __extends(DSprite, _super);
        function DSprite() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.depth = 0;
            return _this;
        }
        return DSprite;
    }(egret.Sprite));
    junyou.DSprite = DSprite;
    __reflect(DSprite.prototype, "junyou.DSprite", ["junyou.IDepth"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于处理无方向的动画信息
     * @author 3tion
     *
     */
    var AniInfo = (function (_super) {
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
                    var uri = "a/" /* Ani */ + this.key + "/" + "d.json" /* CfgFile */;
                    this.url = junyou.ConfigUtils.getResUrl(uri);
                    RES.getResByUrl(this.url, this.dataLoadComplete, this, "json" /* TYPE_JSON */);
                    this.state = 1 /* REQUESTING */;
                }
            }
        };
        /**
         * 资源加载完成
         */
        AniInfo.prototype.dataLoadComplete = function (data, key) {
            if (key == this.url) {
                if (data) {
                    this.init(this.key, data);
                    if (this._refList) {
                        for (var _i = 0, _a = this._refList; _i < _a.length; _i++) {
                            var render = _a[_i];
                            render.callback();
                        }
                    }
                }
                else {
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
            var res = new junyou.UnitResource("a/" /* Ani */ + key, this.splitInfo);
            res.decodeData(data[1]);
            this._resources = res;
            this.state = 2 /* COMPLETE */;
        };
        AniInfo.prototype.getResource = function (uri) {
            return this._resources;
        };
        Object.defineProperty(AniInfo.prototype, "actionInfo", {
            get: function () {
                return this.frames[0];
            },
            enumerable: true,
            configurable: true
        });
        return AniInfo;
    }(junyou.PstInfo));
    junyou.AniInfo = AniInfo;
    __reflect(AniInfo.prototype, "junyou.AniInfo");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
        var f = junyou.DataParseUtil.getData(data, keys, def);
        if (+f.e == 0) {
            f.e = undefined;
        }
        if (f.t == -1) {
            f.t = Infinity;
        }
        return f;
    }
    junyou.getFrameInfo = getFrameInfo;
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
    junyou.getActionInfo = getActionInfo;
    /**
     * 获取自定义动作
     * 如果无法获取对应属性的数据，会使用默认值代替
     * a: 0, d: -1, f: 0, t: 100
     * @static
     * @param {any[]} actions 动作序列  如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100
     * @param {number} [key] 动作标识，需要使用整数
     * @return {CustomAction}   自定义动作
     */
    junyou.getCustomAction = (function () {
        var _key = -0.5; // 使用0.5 防止和手动加的key重复
        return function (actions, key) {
            key = key || _key--;
            var frames = [];
            var totalTime = 0;
            for (var i = 0; i < actions.length; i++) {
                var frame = getFrameInfo(actions[i]);
                frames[i++] = frame;
                totalTime += frame.t;
            }
            return { key: key, frames: frames, totalTime: totalTime };
        };
    })();
})(junyou || (junyou = {}));
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
var junyou;
(function (junyou) {
    /**
     * 由于目前特效和渲染器是完全一一对应关系，所以直接做成AniBitmap
     * @author 3tion
     *
     */
    var AniRender = (function (_super) {
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
        AniRender.prototype.render = function () {
            var aniinfo = this._aniInfo;
            if (aniinfo) {
                var actionInfo = aniinfo.actionInfo;
                if (actionInfo) {
                    var now = junyou.Global.now;
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
            if ((policy & 2 /* RecycleRender */) == 2 /* RecycleRender */) {
                AniRender.recycle(this.guid);
            }
            else {
                var display = this.display;
                if (display) {
                    //这里不删除和AniRender的引用关系，但移除渲染事件
                    display.off("enterFrame" /* ENTER_FRAME */, this.render, this);
                    if ((policy & 1 /* RecycleDisplay */) == 1 /* RecycleDisplay */) {
                        //回收策略要求回收可视对象，才移除引用
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
                var actionInfo = _aniInfo.actionInfo;
                if (loop || (loop == undefined && actionInfo.isCircle)) {
                    var total = _aniInfo.actionInfo.frames.length;
                    if (f > total) {
                        f = f % total;
                    }
                }
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
            var globalNow = junyou.Global.now;
            now = now === void 0 ? globalNow : now;
            this.plTime = globalNow;
            this.renderedTime = now;
            this.nextRenderTime = now;
            this.state = 1 /* Playing */;
            this.resOK = false;
            this._render = undefined;
            this.checkPlay();
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
            if (res) {
                var old = this._render;
                var render = void 0;
                if (this.waitTexture) {
                    var _a = this, a = _a.a, d = _a.d;
                    if (res.isResOK(a, d)) {
                        if (!this.resOK) {
                            this.resOK = true;
                            //重新计算时间
                            var deltaTime = junyou.Global.now - this.plTime;
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
                this.display = undefined;
                display.off("enterFrame" /* ENTER_FRAME */, this.render, this);
                if ((this.recyclePolicy & 1 /* RecycleDisplay */) == 1 /* RecycleDisplay */) {
                    display.recycle();
                }
            }
            if (this._aniInfo) {
                this._aniInfo.loose(this);
                this._aniInfo = undefined;
            }
            this.idx = 0;
            this._guid = NaN;
            if (this.waitTexture) {
                this.waitTexture = false;
            }
            this.loop = undefined;
            this._render = undefined;
        };
        AniRender.prototype.onSpawn = function () {
            this.f = 0;
            this.state = 0;
            this.recyclePolicy = 3 /* RecycleAll */;
            this._playSpeed = 1;
        };
        AniRender.prototype.init = function (aniInfo, display, guid) {
            this._aniInfo = aniInfo;
            this.display = display;
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
        AniRender.getAni = function (uri, option) {
            var aniDict = $DD.ani;
            var aniInfo = aniDict[uri];
            if (!aniInfo) {
                aniInfo = new junyou.AniInfo();
                aniInfo.key = uri;
                aniDict[uri] = aniInfo;
            }
            var display = junyou.recyclable(junyou.ResourceBitmap);
            var ani = junyou.recyclable(AniRender);
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
                stop = option.stop;
                var parent_1 = option.parent;
                if (parent_1) {
                    var idx = option.childIdx;
                    if (idx == undefined) {
                        parent_1.addChild(display);
                    }
                    else {
                        parent_1.addChildAt(display, idx);
                    }
                }
                ani.loop = option.loop;
                ani.handler = option.handler;
                var recyclePolicy = option.recyclePolicy;
                if (recyclePolicy == undefined) {
                    recyclePolicy = 3 /* RecycleAll */;
                }
                ani.recyclePolicy = recyclePolicy;
                ani.waitTexture = !!option.waitTexture;
                ani.f = option.start >>> 0; //强制为正整数
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
    }(junyou.BaseRender));
    junyou.AniRender = AniRender;
    __reflect(AniRender.prototype, "junyou.AniRender", ["junyou.IRecyclable"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
      * 加载脚本
      * @param url
      * @param callback
      * @param thisObj
      * @param args
      */
    function loadScript(url, callback, thisObj) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (!url) {
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        //检测客户端类型
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback.apply(thisObj, args);
                }
            };
        }
        else {
            script.onload = function () {
                callback.apply(thisObj, args);
            };
        }
        script.src = url;
        // 调整为放到文档最后
        document.documentElement.appendChild(script);
    }
    junyou.loadScript = loadScript;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 存储锚点信息
     */
    var JTexture = (function (_super) {
        __extends(JTexture, _super);
        function JTexture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return JTexture;
    }(egret.Texture));
    junyou.JTexture = JTexture;
    __reflect(JTexture.prototype, "junyou.JTexture");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
        var result;
        if (callback != undefined) {
            try {
                result = callback.apply(info.thisObj, args);
            }
            catch (e) {
                if (true) {
                    var debug = info["_debug"];
                    junyou.ThrowError("CallbackInfo\u6267\u884C\u62A5\u9519\uFF0C\u8D4B\u503C\u5185\u5BB9\uFF1A============Function=============:\n" + debug.handle + "\n}==============Stack============:\n" + debug.stack + "\n\u5F53\u524D\u5806\u6808\uFF1A" + e.stack);
                    console.log.apply(console, ["参数列表"].concat(this.args));
                }
            }
        }
        else if (true) {
            var debug = info["_debug"];
            junyou.ThrowError("\u5BF9\u5DF2\u56DE\u6536\u7684CallbackInfo\u6267\u884C\u4E86\u56DE\u8C03\uFF0C\u6700\u540E\u4E00\u6B21\u8D4B\u503C\u5185\u5BB9\uFF1A============Function=============:\n" + debug.handle + "\n==============Stack============:\n" + debug.stack + "\n\u5F53\u524D\u5806\u6808\uFF1A" + new Error().stack);
        }
        return result;
    }
    /**
     * 回调信息，用于存储回调数据
     * @author 3tion
     *
     */
    var CallbackInfo = (function () {
        function CallbackInfo() {
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
         * @param {boolean} [doRecycle=true] 是否回收CallbackInfo，默认为true
         */
        CallbackInfo.prototype.execute = function (doRecycle) {
            if (doRecycle === void 0) { doRecycle = true; }
            var callback = this.callback;
            var result = call(this);
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
        };
        /**
         * 获取CallbackInfo的实例
         */
        CallbackInfo.get = function (callback, thisObj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var info = junyou.recyclable(CallbackInfo);
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
            for (var _a = 0, list_1 = list; _a < list_1.length; _a++) {
                var callback = list_1[_a];
                if (callback.checkHandle(handle, thisObj)) {
                    callback.args = args;
                    return callback;
                }
            }
            callback = this.get.apply(this, [handle, thisObj].concat(args));
            list.push(callback);
            return callback;
        };
        return CallbackInfo;
    }());
    junyou.CallbackInfo = CallbackInfo;
    __reflect(CallbackInfo.prototype, "junyou.CallbackInfo", ["junyou.IRecyclable"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 资源显示用位图
     */
    var ResourceBitmap = (function (_super) {
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
            if (!this.res)
                return;
            return this.res.draw(this, drawInfo, now);
        };
        Object.defineProperty(ResourceBitmap.prototype, "rotation", {
            set: function (value) {
                _super.prototype.$setRotation.call(this, value);
            },
            enumerable: true,
            configurable: true
        });
        ResourceBitmap.prototype.onRecycle = function () {
            junyou.removeDisplay(this);
            this.removeAllListeners();
            this.res = undefined;
            this.rotation = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.texture = undefined;
        };
        return ResourceBitmap;
    }(egret.Bitmap));
    junyou.ResourceBitmap = ResourceBitmap;
    __reflect(ResourceBitmap.prototype, "junyou.ResourceBitmap", ["junyou.IRecyclable", "junyou.IDepth"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 拆分的资源
     * @author 3tion
     */
    var SplitUnitResource = (function () {
        function SplitUnitResource(uri) {
            /**
             * 资源加载状态
             */
            this.state = 0 /* UNREQUEST */;
            this.resID = uri;
            this.url = junyou.ConfigUtils.getResUrl(uri + junyou.Global.webp);
            this.textures = [];
        }
        Object.defineProperty(SplitUnitResource.prototype, "isStatic", {
            get: function () {
                return this.state != 1 /* REQUESTING */; //加载中，本次不允许卸载
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 绑定纹理集
         *
         * @param {{ [index: number]: JTexture[][] }} textures (description)
         * @param {number[]} adKeys (description)
         */
        SplitUnitResource.prototype.bindTextures = function (textures, adKeys) {
            var _this = this;
            adKeys.forEach(function (adKey) {
                var a = junyou.PstUtils.getAFromADKey(adKey);
                var dTextures = textures[a];
                if (dTextures) {
                    var d = junyou.PstUtils.getDFromADKey(adKey);
                    var textures_1 = dTextures[d];
                    if (textures_1) {
                        textures_1.forEach(function (tex) { _this.bindTexture(tex); });
                    }
                }
            });
        };
        /**
         * 绑定纹理
         */
        SplitUnitResource.prototype.bindTexture = function (tex) {
            var textures = this.textures;
            if (!~textures.indexOf(tex)) {
                textures.push(tex);
                if (this.bmd) {
                    tex._bitmapData = this.bmd;
                }
            }
        };
        SplitUnitResource.prototype.load = function () {
            if (this.state == 0 /* UNREQUEST */) {
                this.state = 1 /* REQUESTING */;
                //后续尝试直接用ImageLoader加载
                RES.getResByUrl(this.url, this.loadComplete, this, "image" /* TYPE_IMAGE */);
            }
        };
        /**
         * 资源加载完成
         */
        SplitUnitResource.prototype.loadComplete = function (res, key) {
            if (key == this.url) {
                if (res) {
                    var bmd = res.bitmapData;
                    this.bmd = bmd;
                    this.state = 2 /* COMPLETE */;
                    //将已经请求的位图设置为加载完成的位图
                    var textures = this.textures;
                    for (var i = 0; i < textures.length; i++) {
                        var texture = textures[i];
                        if (texture) {
                            texture._bitmapData = bmd;
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
    junyou.SplitUnitResource = SplitUnitResource;
    __reflect(SplitUnitResource.prototype, "junyou.SplitUnitResource", ["junyou.IResource"]);
})(junyou || (junyou = {}));
/**
 * @author 3tion
 */
var junyou;
(function (junyou) {
    /**
     * 单位资源<br/>
     * 图片按动作或者方向的序列帧，装箱处理后的图片位图资源<br/>
     * 以及图片的坐标信息
     */
    var UnitResource = (function () {
        function UnitResource(uri, splitInfo) {
            this.state = 0 /* UNREQUEST */;
            this.key = uri;
            this._splitInfo = splitInfo;
        }
        /**
         * 解析数据
         */
        UnitResource.prototype.decodeData = function (data) {
            var _datas = {};
            for (var action in data) {
                var dData = [];
                _datas[action] = dData;
                var actData = data[action];
                for (var d = 0, len = actData.length; d < len; d++) {
                    var fData = [];
                    dData[d] = fData;
                    var dirData = actData[d];
                    for (var f = 0, flen = dirData.length; f < flen; f++) {
                        if (dirData[f] !== 0) {
                            fData[f] = getTextureFromImageData(dirData[f]);
                        }
                    }
                }
            }
            this._datas = _datas;
            this.state = 2 /* COMPLETE */;
            return;
            /**
             * 从数据中获取纹理
             */
            function getTextureFromImageData(data) {
                var texture = new junyou.JTexture();
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
                var uri = this.key + "/" + "d.json" /* CfgFile */;
                var url = junyou.ConfigUtils.getResUrl(uri);
                this.url = url;
                this.state = 1 /* REQUESTING */;
                RES.getResByUrl(url, this.dataLoadComplete, this, "json" /* TYPE_JSON */);
            }
        };
        /**
         * 资源加载完成
         */
        UnitResource.prototype.dataLoadComplete = function (data, key) {
            if (key == this.url) {
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
            var datas = this._datas;
            if (!datas) {
                return;
            }
            var a = drawInfo.a, f = drawInfo.f, d = drawInfo.d;
            var dDatas = datas[a];
            if (dDatas) {
                var frames_2 = dDatas[d];
                if (frames_2) {
                    var frame = frames_2[f];
                    if (frame) {
                        var res = this.loadRes(d, a);
                        res.lastUseTime = junyou.Global.now;
                        if (frame.bitmapData) {
                            bitmap.texture = frame;
                            bitmap.anchorOffsetX = frame.tx;
                            bitmap.anchorOffsetY = frame.ty;
                            return true;
                        }
                        else {
                            bitmap.texture = undefined;
                        }
                    }
                }
            }
            //TODO 绘制未加载的代理图片
        };
        UnitResource.prototype.loadRes = function (d, a) {
            var r = this._splitInfo.getResource(d, a);
            var uri = this.key + "/" + r + ".png" /* PNG */;
            var datas = this._datas;
            return junyou.ResourceManager.get(uri, this.noRes, this, uri, r);
        };
        UnitResource.prototype.noRes = function (uri, r) {
            var tmp = new junyou.SplitUnitResource(uri);
            tmp.bindTextures(this._datas, this._splitInfo.adDict[r]);
            tmp.load();
            return tmp;
        };
        UnitResource.prototype.isResOK = function (d, a) {
            var info = this._splitInfo;
            var r = info.getResource(d, a);
            var uri = this.key + "/" + r + ".png" /* PNG */;
            var res = junyou.ResourceManager.getResource(uri);
            return !!(res && res.bmd);
        };
        return UnitResource;
    }());
    junyou.UnitResource = UnitResource;
    __reflect(UnitResource.prototype, "junyou.UnitResource");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 相机
     * @author 3tion
     *
     */
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            var _this = _super.call(this) || this;
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
                var target = this._target;
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
            this._target = target;
            return !!target;
        };
        /**
         * 设置相机的可视区域宽度和高度
         * @param width 可视区宽
         * @param height 可视区高
         */
        Camera.prototype.setSize = function (width, height) {
            var rect = this._rect;
            if (width != rect.width) {
                rect.width = width;
                this._changed = true;
            }
            if (height != rect.height) {
                rect.height = height;
                this._changed = true;
            }
            return this;
        };
        Camera.prototype.setLimits = function (width, height, x, y) {
            if (width === void 0) { width = Infinity; }
            if (height === void 0) { height = Infinity; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this._limits = new egret.Rectangle(x, y, width, height);
            return this;
        };
        /**
         * 将相机移动到指定坐标
         */
        Camera.prototype.moveTo = function (x, y) {
            var rect = this._rect;
            var rw = rect.width;
            var rh = rect.height;
            x = x - (rw >> 1);
            y = y - (rh >> 1);
            var limits = this._limits;
            if (limits) {
                x = Math.clamp(x, limits.x, limits.width - rw);
                y = Math.clamp(y, limits.y, limits.height - rh);
            }
            if (x != rect.x) {
                rect.x = x;
                this._changed = true;
            }
            if (y != rect.y) {
                rect.y = y;
                this._changed = true;
            }
            return this;
        };
        Object.defineProperty(Camera.prototype, "rect", {
            /**
             * 获取相机显示区域
             */
            get: function () {
                var target = this._target;
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
    junyou.Camera = Camera;
    __reflect(Camera.prototype, "junyou.Camera");
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
    junyou.getPosHash = getPosHash;
    function getPosHash2(x, y) {
        return x << 16 | (y & 0xffff);
    }
    junyou.getPosHash2 = getPosHash2;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 时间冷却
     * @author pb
     */
    var Cooldown = (function () {
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
    junyou.Cooldown = Cooldown;
    __reflect(Cooldown.prototype, "junyou.Cooldown");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 时间冷却管理器
     * @author pb
     */
    var CooldownManager = (function () {
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
                var cooldown = new junyou.Cooldown();
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
    junyou.CooldownManager = CooldownManager;
    __reflect(CooldownManager.prototype, "junyou.CooldownManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 时间冷却遮罩
     * @author pb
     */
    var CooldownMask = (function () {
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
    junyou.CooldownMask = CooldownMask;
    __reflect(CooldownMask.prototype, "junyou.CooldownMask", ["junyou.ICooldownDisplay"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 君游项目的道具基类
     * @author 3tion
     */
    var ItemBase = (function () {
        function ItemBase() {
        }
        Object.defineProperty(ItemBase.prototype, "id", {
            get: function () {
                var cfg = this.cfg;
                return cfg ? cfg.id : undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemBase.prototype, "order", {
            get: function () {
                var cfg = this.cfg;
                return cfg ? cfg.order : NaN;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 消耗物品
         *
         * @param {number} [count=1] 消耗物品数量
         * @param {number} [func=0] 处理类型
         */
        ItemBase.prototype.consume = function (count, func) {
            if (count === void 0) { count = 1; }
            if (func === void 0) { func = 0; }
            if (this.checkItem()) {
                this._consume(count, func);
            }
        };
        ItemBase.prototype.checkItem = function (showTip) {
            if (showTip === void 0) { showTip = true; }
            return true;
        };
        /**
         * 检查物品是否过期<br/>
         *
         * @param {number} now 要检查的时间
         * @returns {boolean} true  物品没有过期，可以使用<br/>
         *                    false 物品已经过期，不可以使用<br/>
         */
        ItemBase.prototype.checkExpire = function (now) {
            return !this.expired || now < this.expired;
        };
        return ItemBase;
    }());
    junyou.ItemBase = ItemBase;
    __reflect(ItemBase.prototype, "junyou.ItemBase");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 道具处理，遍历工具类
     * @author 3tion
     */
    var Items = (function () {
        function Items() {
            /**
             * Key      {number}        格位编号
             * Value    {ItemBase}     道具实现
             * @type {{[slot:number]:IItem}}
             */
            this.bySlot = {};
            /**
             * Key      {number}    格位唯一标识
             * Value    {ItemBase}     道具实现
             * @type {{ [guid: number]: ItemBase }}
             */
            this.byGuid = {};
            /**
             * 基于格位类型的字典
             * Key      {number}    格位类型
             * Value    {SlotType}  格位类型的数据
             * @type {{ [slotType: number]: SlotTypeData }}
             */
            this.bySlotType = [];
        }
        /**
         * 遍历所有物品，使用handler处理
         *
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} handler 遍历时使用的函数
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns
         */
        Items.prototype.forEach = function (handler, slotType) {
            if (slotType === void 0) { slotType = 0; }
            var otherParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                otherParams[_i - 2] = arguments[_i];
            }
            var slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                true && junyou.ThrowError("无法找到指定的格位数据");
                return;
            }
            var end = slotInfo.lock;
            var bySlot = this.bySlot;
            for (var i = slotInfo.begin; i < end; i++) {
                var item = bySlot[i];
                handler.apply(void 0, [item].concat(otherParams));
            }
        };
        Items.prototype.checkFor = function () {
            return !!this.find.apply(this, arguments);
        };
        /**
         * 获取符合条件的物品总数量
         *
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} filter 过滤器
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns {number} 符合物品的数量
         */
        Items.prototype.getCount = function (filter, slotType) {
            if (slotType === void 0) { slotType = 0 /* Default */; }
            var otherParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                otherParams[_i - 2] = arguments[_i];
            }
            var slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                true && junyou.ThrowError("无法找到指定的格位数据");
                return 0;
            }
            var count = 0;
            var end = slotInfo.lock;
            var bySlot = this.bySlot;
            for (var i = slotInfo.begin; i < end; i++) {
                var item = bySlot[i];
                if (filter.apply(void 0, [item].concat(otherParams))) {
                    count++;
                }
            }
            return count;
        };
        /**
         * 遍历物品列表，检查是否有符合条件的物品
         *
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} handler 检测函数
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns {ItemBase}          符合条件的第一个物品
         *          undefined                所有道具未通过检查
         */
        Items.prototype.find = function (handler, slotType) {
            if (slotType === void 0) { slotType = 0; }
            var otherParams = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                otherParams[_i - 2] = arguments[_i];
            }
            var slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                true && junyou.ThrowError("无法找到指定的格位数据");
                return;
            }
            var end = slotInfo.lock;
            var bySlot = this.bySlot;
            for (var i = slotInfo.begin; i < end; i++) {
                var item = bySlot[i];
                if (handler.apply(void 0, [item].concat(otherParams))) {
                    return item;
                }
            }
        };
        return Items;
    }());
    junyou.Items = Items;
    __reflect(Items.prototype, "junyou.Items");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var ext = ".jpg" /* JPG */ + (junyou.Global.webp ? ".webp" /* WEBP */ : "");
    /**
     * 地图基础信息<br/>
     * 由地图编辑器生成的地图信息
     * @author 3tion
     *
     */
    var MapInfo = (function (_super) {
        __extends(MapInfo, _super);
        function MapInfo() {
            var _this = _super.call(this) || this;
            /**
             * 单张底图的宽度
             */
            _this.pWidth = 256 /* DefaultSize */;
            /**
             * 单张底图的高度
             */
            _this.pHeight = 256 /* DefaultSize */;
            return _this;
        }
        // const KEYS=["id", "path", "columns", "rows", "width", "height", "gridWidth", "gridHeight"];
        MapInfo.decodeFromArray = function (arr, ref) {
            ref = ref || MapInfo;
            var m = new ref();
            m.id = arr[0];
            m.path = arr[1];
            m.columns = arr[2];
            m.rows = arr[3];
            m.width = arr[4];
            m.height = arr[5];
            m.gridWidth = arr[6];
            m.gridHeight = arr[7];
            m.maxPicX = m.width / m.pWidth - 1 >> 0;
            m.maxPicY = m.height / m.pHeight - 1 >> 0;
            // 地图的base64数据
            // 项目部使用路径点信息
            var b64 = arr[8];
            if (b64) {
                m.pathdata = new Uint8Array(egret.Base64Util.decode(b64));
            }
            return m;
        };
        return MapInfo;
    }(egret.HashObject));
    junyou.MapInfo = MapInfo;
    __reflect(MapInfo.prototype, "junyou.MapInfo");
    if (true) {
        MapInfo.prototype.getMapUri = function (col, row) {
            return "m/" + this.path + "/" + row.zeroize(3) + col.zeroize(3) + ".jpg" /* JPG */;
        };
    }
    if (false) {
        MapInfo.prototype.getMapUri = function (col, row) {
            return "m2/" + this.path + "/" + row + "_" + col + ext;
        };
    }
})(junyou || (junyou = {}));
if (true) {
    var $gm = $gm || {};
    $gm.toggleMapGrid = function () {
        this.$showMapGrid = !this.$showMapGrid;
    };
}
var junyou;
(function (junyou) {
    /**
    * MapRender
    * 用于处理地图平铺的渲染
    */
    var TileMapLayer = (function (_super) {
        __extends(TileMapLayer, _super);
        function TileMapLayer(id) {
            var _this = _super.call(this, id) || this;
            /**
             *
             * 显示中的地图
             * @private
             * @type {TileMap[]}
             */
            _this._showing = [];
            if (true) {
                _this.drawGrid = function (x, y, w, h, map) {
                    var gp = _this.gridPane;
                    if ($gm.$showMapGrid) {
                        if (!gp) {
                            _this.gridPane = gp = new egret.Shape;
                        }
                        _this.addChild(gp);
                        var g = gp.graphics;
                        g.clear();
                        var gridWidth = map.gridWidth, gridHeight = map.gridHeight;
                        var hw = gridWidth >> 1;
                        var hh = gridHeight >> 1;
                        for (var i = x / gridWidth >> 0, len = i + w / gridWidth + 1, jstart = y / gridHeight >> 0, jlen = jstart + h / gridHeight + 1; i < len; i++) {
                            for (var j = jstart; j < jlen; j++) {
                                var c = map.getWalk(i, j) ? 0 : 0xcccc;
                                g.lineStyle(1, 0xcccc, 0.5);
                                g.beginFill(c, 0.5);
                                g.drawRect(i * gridWidth - hw, j * gridHeight - hh, gridWidth, gridHeight);
                                g.endFill();
                            }
                        }
                    }
                    else {
                        if (gp) {
                            gp.graphics.clear();
                            junyou.removeDisplay(gp);
                        }
                    }
                };
            }
            return _this;
        }
        TileMapLayer.prototype.setRect = function (rect) {
            var cM = this.currentMap;
            if (!cM) {
                return;
            }
            //检查地图，进行加载区块
            var x = rect.x;
            var y = rect.y;
            var w = rect.width;
            var h = rect.height;
            var pW = cM.pWidth;
            var pH = cM.pHeight;
            var sc = x / pW | 0;
            var sr = y / pH | 0;
            var ec = (x + w) / pW | 0;
            var er = (y + h) / pH | 0;
            ec = Math.min(ec, cM.maxPicX);
            er = Math.min(er, cM.maxPicY);
            if (true) {
                if (this.drawGrid) {
                    this.drawGrid(x, y, w, h, cM);
                }
            }
            if (sc == this.lsc && sr == this.lsr && ec == this.lec && er == this.ler) {
                return;
            }
            this.lsc = sc;
            this.lsr = sr;
            this.lec = ec;
            this.ler = er;
            // 先将正在显示的全部标记为未使用
            // 换地图也使用此方法处理
            var showing = this._showing;
            var now = junyou.Global.now;
            var i = showing.length;
            while (i > 0) {
                var m = showing[--i];
                m.isStatic = false;
                m.lastUseTime = now;
                this.$doRemoveChild(i, false);
            }
            i = 0;
            var get = junyou.ResourceManager.get;
            for (var r = sr; r <= er; r++) {
                for (var c = sc; c <= ec; c++) {
                    var uri = cM.getMapUri(c, r);
                    var tm = get(uri, this.noRes, this, uri, c, r, pW, pH);
                    // 舞台上的标记为静态
                    tm.isStatic = true;
                    this.$doAddChild(tm, i, false);
                    showing[i++] = tm;
                }
            }
            showing.length = i;
        };
        TileMapLayer.prototype.noRes = function (uri, c, r, pW, pH) {
            var tmp = new TileMap();
            tmp.reset(c, r, uri);
            tmp.x = c * pW;
            tmp.y = r * pH;
            tmp.load();
            return tmp;
        };
        TileMapLayer.prototype.removeChildren = function () {
            //重置显示的地图序列
            this._showing.length = 0;
            _super.prototype.removeChildren.call(this);
        };
        return TileMapLayer;
    }(junyou.GameLayer));
    junyou.TileMapLayer = TileMapLayer;
    __reflect(TileMapLayer.prototype, "junyou.TileMapLayer");
    /**
    * TileMap
    */
    var TileMap = (function (_super) {
        __extends(TileMap, _super);
        function TileMap() {
            return _super.call(this) || this;
        }
        Object.defineProperty(TileMap.prototype, "resID", {
            get: function () {
                return this.uri;
            },
            enumerable: true,
            configurable: true
        });
        TileMap.prototype.reset = function (col, row, uri) {
            this.col = col;
            this.row = row;
            this.uri = uri;
            this.url = junyou.ConfigUtils.getResUrl(uri);
        };
        TileMap.prototype.load = function () {
            RES.getResByUrl(this.url, this.loadComplete, this, RES.ResourceItem.TYPE_IMAGE);
        };
        /**
         * 资源加载完成
         */
        TileMap.prototype.loadComplete = function (res, key) {
            if (key == this.url) {
                this.texture = res;
            }
        };
        TileMap.prototype.dispose = function () {
            var texture = this.texture;
            if (texture) {
                texture.dispose();
                this.texture = undefined;
            }
        };
        return TileMap;
    }(egret.Bitmap));
    junyou.TileMap = TileMap;
    __reflect(TileMap.prototype, "junyou.TileMap", ["junyou.IResource"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 坐标偏移数据
     */
    var aSurOff = [
        /*↖*/ [-1, -1], /*↑*/ [0, -1], /*↗*/ [1, -1],
        /*←*/ [-1, 0], /*    ㊥    */ /*→*/ [1, 0],
        /*↙*/ [-1, 1], /*↓*/ [0, 1], /*↘*/ [1, 1]
    ];
    /**
     * A星寻路算法
     * @author 3tion
     * @export
     * @class Astar
     */
    var Astar = (function () {
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
         * @param {{ (path: PathNode[], ...args) }: void } callback    寻找到目标后的 回调方法
         * @param {any} args                回调函数的其他参数
         *
         * @memberOf PathFinder
         */
        Astar.prototype.getPath = function (fx, fy, tx, ty, callback) {
            if (fx == tx && fy == ty) {
                callback.callAndRecycle(null);
                return;
            }
            var map = this._map;
            var w = map.columns;
            var h = map.rows;
            var maxLength = this._maxLength;
            if (fx > w || fy > h) {
                callback.callAndRecycle(null);
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
            stage.on("enterFrame" /* ENTER_FRAME */, onTick, null);
            return ctrl;
            function onTick() {
                var t = Date.now();
                var _loop_1 = function () {
                    if (ctrl.stop) {
                        stage.off("enterFrame" /* ENTER_FRAME */, onTick, null);
                        return { value: void 0 };
                    }
                    var node = openList.shift();
                    var x = node.x, y = node.y, g = node.g, key = node.key;
                    if (closedList[key]) {
                        return "continue";
                    }
                    //标记已经搜索过的
                    closedList[key] = true;
                    if (x == tx && y == ty) {
                        stage.off("enterFrame" /* ENTER_FRAME */, onTick, null);
                        return { value: callback.callAndRecycle(end(minNode)) };
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
                    if (Date.now() - t > minCacTime) {
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
                return callback.callAndRecycle(end(minNode));
            }
            function end(node) {
                // 移除监听
                stage.off("enterFrame" /* ENTER_FRAME */, onTick, null);
                var list = [];
                var j = 0;
                for (var i = node.step; i > 0; i--) {
                    list[j++] = node;
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
    junyou.Astar = Astar;
    __reflect(Astar.prototype, "junyou.Astar", ["junyou.PathFinder"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * @ author gushuai
     *
     * @export
     * @class MessageChanel
     */
    var MessageChanel = (function () {
        function MessageChanel() {
            this.MAX_MSG_COUNT = 5;
            this.isruning = false;
            this._messageRenderArr = new Array();
            this._waitList = [];
        }
        /**
         *
         * 设置chanel基本信息
         * @ param con 容器
         * @ param count 显示的最大消息数目
         *
         * @ param renderStyle MessageRender样式，参数key如下
         */
        MessageChanel.prototype.initBase = function (con, count, renderStyle) {
            this._con = con;
            this.MAX_MSG_COUNT = count;
            this.renderStyle = renderStyle;
        };
        /**
         * 添加一条或多条消息
         *
         * @ param msgs string类型的数组
         */
        MessageChanel.prototype.addMessage = function (msgs) {
            msgs.appendTo(this._waitList);
            this.checkNext();
            if (this.isruning == false) {
                this.isruning = true;
                this._con.on("enterFrame" /* ENTER_FRAME */, this.tick, this);
            }
        };
        /**
         * 检测并初始化新的render并显示消息
         *
         * @private
         */
        MessageChanel.prototype.checkandAddMsg = function () {
            var render;
            var len = this._waitList.length;
            for (var i = 0; i < len; i++) {
                render = this.getMessageRender(i);
                if (!render) {
                    break;
                }
                if (render.isrunning) {
                    if (render.checkShow()) {
                        render.showMsg(this._waitList.shift());
                    }
                    else {
                        var mlen = this._messageRenderArr.length;
                        if (mlen < this.MAX_MSG_COUNT) {
                            render = this.getMessageRender(mlen);
                            if (render) {
                                render.y = render.index * render.height;
                                this._con.addChild(render);
                                render.showMsg(this._waitList.shift());
                            }
                        }
                        continue;
                    }
                }
                else {
                    render.y = render.index * render.height;
                    this._con.addChild(render);
                    render.showMsg(this._waitList.shift());
                }
            }
        };
        MessageChanel.prototype.getMessageRender = function (index) {
            if (index > this.MAX_MSG_COUNT - 1) {
                return;
            }
            var render = this._messageRenderArr[index];
            if (!render) {
                render = new junyou.MessageRender();
                render.setStyles(this.renderStyle);
                render.index = index;
                this._messageRenderArr[index] = render;
                render.on(-1990 /* MsgRenderCheckEnd */, this.checkEnd, this);
                render.on(-1991 /* MsgRenderCheckNext */, this.checkNext, this);
            }
            return render;
        };
        /**
         * 移除消息render
         *
         * @private
         * @param {egret.Event} e (description)
         */
        MessageChanel.prototype.checkEnd = function (e) {
            var isruning = false;
            var render;
            var target = e.target;
            this._con.removeChild(target);
            var len = this._messageRenderArr.length;
            for (var i = 0; i < len; i++) {
                render = this._messageRenderArr[i];
                if (render.isrunning) {
                    isruning = true;
                    break;
                }
            }
            if (isruning == false) {
                this._con.off("enterFrame" /* ENTER_FRAME */, this.tick, this);
                this.isruning = false;
            }
        };
        /**
         * 寻找符合条件的render显示下一条消息
         *
         * @private
         * @param {egret.Event} e (description)
         */
        MessageChanel.prototype.checkNext = function (e) {
            if (this._waitList.length > 0) {
                var len = this._messageRenderArr.length;
                if (len > 0) {
                    var render = void 0;
                    for (var i = 0; i < len; i++) {
                        render = this._messageRenderArr[i];
                        if (this._waitList.length > 0) {
                            if (render.isrunning == false) {
                                render.showMsg(this._waitList.shift());
                                this._con.addChild(render);
                            }
                            else {
                                if (render.checkShow()) {
                                    render.showMsg(this._waitList.shift());
                                }
                                else {
                                    continue;
                                }
                            }
                        }
                    }
                    if (len < this.MAX_MSG_COUNT) {
                        this.checkandAddMsg();
                    }
                }
                else {
                    this.checkandAddMsg();
                }
                if (this.isruning == false) {
                    this.isruning = true;
                    this._con.on("enterFrame" /* ENTER_FRAME */, this.tick, this);
                }
            }
        };
        MessageChanel.prototype.tick = function (e) {
            var arr = this._messageRenderArr;
            var len = arr.length;
            var render;
            for (var i = 0; i < len; i++) {
                render = arr[i];
                if (render.cantick) {
                    render.tick();
                }
            }
        };
        return MessageChanel;
    }());
    junyou.MessageChanel = MessageChanel;
    __reflect(MessageChanel.prototype, "junyou.MessageChanel");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * @ author gushuai
     *
     * @export
     * @class MessageRender
     * @extends {egret.Sprite}
     */
    var MessageRender = (function (_super) {
        __extends(MessageRender, _super);
        function MessageRender() {
            var _this = _super.call(this) || this;
            _this.isrunning = false;
            _this._checkDispatched = false;
            _this.speed = 2;
            _this.initTxt();
            return _this;
        }
        MessageRender.prototype.initTxt = function () {
            this.bg = new egret.Sprite();
            this.addChild(this.bg);
            this.con = new egret.Sprite();
            this.addChild(this.con);
            this.msk = new egret.Sprite();
            this.addChild(this.msk);
            this.con.mask = this.msk;
            this._txtField = new egret.TextField();
            this.con.addChild(this._txtField);
            this._txtField2 = new egret.TextField();
            this.con.addChild(this._txtField2);
            this.on("addedToStage" /* ADDED_TO_STAGE */, this.addToStage, this);
        };
        MessageRender.prototype.addToStage = function (e) {
            this.cantick = true;
        };
        /**
         * 消息样式
         *
         * @ param {MessageRenderStyle} style
         */
        MessageRender.prototype.setStyles = function (style) {
            var bg = style.bg;
            var contentSize = style.contentSize;
            var speed = style.speed;
            var fontSize = style.fontSize;
            var fontColor = style.fontColor;
            var endpad = style.endpad;
            if (bg) {
                this.bg.addChild(bg);
                var bgsize = style.bgSize;
                if (bgsize) {
                    bg.width = bgsize.width;
                    bg.height = bgsize.height;
                }
            }
            this.con.x = contentSize.x;
            this.con.y = contentSize.y;
            this.msk.x = contentSize.x;
            this.msk.y = contentSize.y;
            this.msk.graphics.beginFill(0);
            this.msk.graphics.drawRect(0, 0, contentSize.width, contentSize.height);
            this.msk.graphics.endFill();
            this._txtField.textColor = this._txtField2.textColor = fontColor;
            this._txtField.size = this._txtField2.size = fontSize;
            this._txtField.height = this._txtField2.height = contentSize.height;
            this._txtField.y = this._txtField2.y = contentSize.y;
            this._txtStartPos = contentSize.width + 1;
            this._txtField.x = this._txtField2.x = this._txtStartPos;
            this._checkPos = contentSize.width - endpad;
            if (speed > 0) {
                this.speed = speed;
            }
            this._contentSize = contentSize;
        };
        Object.defineProperty(MessageRender.prototype, "height", {
            get: function () {
                return this._contentSize.height + this._contentSize.y * 2;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 显示消息内容
         *
         * @param {string} msg (description)
         */
        MessageRender.prototype.showMsg = function (msg) {
            if (!this.currentTextField) {
                this.currentTextField = this._txtField;
            }
            else {
                if (this.currentTextField == this._txtField) {
                    this.currentTextField = this._txtField2;
                    this.otherTextField = this._txtField;
                }
                else {
                    this.currentTextField = this._txtField;
                    this.otherTextField = this._txtField2;
                }
            }
            this._checkDispatched = false;
            this.currentTextField.text = msg;
        };
        /**
         * 如果存在一个render显示多个消息的情况，那么这个方法就是检测该render是否可以显示第二条消息了
         *
         * @returns (description)
         */
        MessageRender.prototype.checkShow = function () {
            var pos = this.currentTextField.x + this.currentTextField.width;
            if (pos < this._checkPos) {
                return true;
            }
            return false;
        };
        MessageRender.prototype.tick = function () {
            var currentTextField = this.currentTextField;
            if (currentTextField && (currentTextField.x + currentTextField.width < 0)) {
                currentTextField.text = "";
                currentTextField.x = this._txtStartPos;
                currentTextField = undefined;
                this.isrunning = false;
                this.cantick = false;
                //当前的出了可视范围
                //而且还没有第2条消息，就表示这个render可以停了，并且抛个事件，通知检测其他的render 
                this.dispatch(-1990 /* MsgRenderCheckEnd */);
                // console.log(this.index);
                return;
            }
            if (currentTextField && ((currentTextField.x + currentTextField.width) < this._checkPos)) {
                if (!this._checkDispatched) {
                    this._checkDispatched = true;
                    this.dispatch(-1991 /* MsgRenderCheckNext */);
                }
            }
            var otherTextField = this.otherTextField;
            if (otherTextField) {
                //出了可视范围
                if (otherTextField.x + otherTextField.width < 0) {
                    otherTextField.x = this._txtStartPos;
                    otherTextField.text = "";
                    this.otherTextField = undefined;
                }
                else {
                    otherTextField.x -= this.speed;
                }
            }
            this.currentTextField.x -= this.speed;
            this.isrunning = true;
        };
        MessageRender.CHECK_NEXT = "CHECK_NEXT";
        MessageRender.CHECK_END = "CHECK_END";
        return MessageRender;
    }(egret.Sprite));
    junyou.MessageRender = MessageRender;
    __reflect(MessageRender.prototype, "junyou.MessageRender");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var MessageRenderStyle = (function () {
        function MessageRenderStyle() {
            /**
             * 内容文本字号
             *
             * @type {number}
             */
            this.fontSize = 12;
            /**
             * 内容文本颜色
             *
             * @type {number}
             */
            this.fontColor = 0;
            /**
             * 检测距离
             *
             * @type {number}
             */
            this.endpad = 0;
            /**
             * 文本移动速度
             *
             * @type {number}
             */
            this.speed = 0;
        }
        return MessageRenderStyle;
    }());
    junyou.MessageRenderStyle = MessageRenderStyle;
    __reflect(MessageRenderStyle.prototype, "junyou.MessageRenderStyle");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于像统计接口发送步骤信息
     * @author pb
     */
    junyou.Stats = (function () {
        var _actionUrl, _ip, _sign, _pid, _uid, _sid;
        return {
            setUrl: function (url) {
                if (url.charAt(url.length - 1) != "?") {
                    url += "?";
                }
                _actionUrl = url;
                return this;
            },
            setParams: function (params) {
                _ip = getData(params.ip);
                _pid = getData(params.pid);
                _uid = getData(params.uid);
                _sid = getData(params.sid);
                return this;
            },
            setSign: function (sign) {
                _sign = getData(sign);
                return this;
            },
            postData: function (step) {
                junyou.sendToUrl(_actionUrl + this.getParamUrl(step));
            },
            getParamUrl: function (step) {
                return "step=" + getData(step) + "&ip=" + _ip
                    + "&sign=" + _sign + "&pid=" + _pid
                    + "&sid=" + _sid + "&uid=" + _uid
                    + "&client_time=" + junyou.Global.now;
            }
        };
        function getData(value) {
            return value === undefined ? "" : encodeURIComponent(value);
        }
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 旋转的屏幕抖动
     * 角度统一从0开始，正向或者逆向旋转，振幅从最大到0
     *
     * @export
     * @class CircleShake
     * @extends {BaseShake}
     * @author 3tion
     */
    var CircleShake = (function (_super) {
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
    }(junyou.BaseShake));
    junyou.CircleShake = CircleShake;
    __reflect(CircleShake.prototype, "junyou.CircleShake");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 带方向的震动
     *
     * @export
     * @class DirectionShake
     * @extends {BaseShake}
     */
    var DirectionShake = (function (_super) {
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
    }(junyou.BaseShake));
    junyou.DirectionShake = DirectionShake;
    __reflect(DirectionShake.prototype, "junyou.DirectionShake");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    var RotateShake = (function (_super) {
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
    }(junyou.BaseShake));
    junyou.RotateShake = RotateShake;
    __reflect(RotateShake.prototype, "junyou.RotateShake");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 屏幕抖动管理器
     *
     * @export
     * @class ScreenShakeManager
     */
    var ScreenShakeManager = (function () {
        function ScreenShakeManager() {
            var _this = this;
            /**
             * 释放可震动
             *
             * @type {boolean}
             */
            this.shakable = true;
            this._pt = { x: 0, y: 0 };
            this._tmp = new egret.Rectangle();
            this.checkViewRect = function (rect) {
                var limits = _this._limits;
                var tmp = _this._tmp;
                var x = rect.x - 50;
                var y = rect.y - 50;
                var width = rect.width + 100;
                var height = rect.height + 100;
                if (limits) {
                    tmp.setTo(Math.clamp(x, limits.x, limits.width), Math.clamp(y, limits.y, limits.height), Math.clamp(width, limits.x, limits.width), Math.clamp(height, limits.y, limits.height));
                }
                else {
                    tmp.setTo(x, y, width, height);
                }
                return tmp;
                // return this._tmp.setTo(rect.x - 50, rect.y - 50, rect.width + 100, rect.height + 100);
            };
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
                var engine = junyou.GameEngine.instance;
                var layer = engine.getLayer(1000 /* Game */);
                if (cur != shake) {
                    shake.setShakeTarget(layer);
                }
                shake.start();
                this._st = junyou.Global.now;
                egret.startTick(this.tick, this);
                engine.checkViewRect = this.checkViewRect;
                junyou.Global.clearCallLater(this.clearShakeRect);
            }
            return shake;
        };
        ScreenShakeManager.prototype.tick = function () {
            var shake = this._cur;
            var duration = junyou.Global.now - this._st;
            if (duration < shake.total) {
                var pt = this._pt;
                var cur = this._cur;
                cur.tick(duration, pt);
                var target = cur.target;
                var limits = this._limits;
                if (limits) {
                    var rect = junyou.GameEngine.instance.viewRect;
                    var px = pt.x;
                    var py = pt.y;
                    var x = void 0, y = void 0;
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
                    target.x = x;
                    target.y = y;
                }
            }
            else {
                shake.end();
                junyou.Global.callLater(this.clearShakeRect, 30000);
            }
            return true;
        };
        ScreenShakeManager.prototype.clearShakeRect = function () {
            junyou.GameEngine.instance.checkViewRect = undefined;
        };
        return ScreenShakeManager;
    }());
    junyou.ScreenShakeManager = ScreenShakeManager;
    __reflect(ScreenShakeManager.prototype, "junyou.ScreenShakeManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 带坐骑动作的UnitAction基类
     * @author 3tion
     */
    var MUnitAction = (function (_super) {
        __extends(MUnitAction, _super);
        function MUnitAction() {
            return _super.call(this) || this;
        }
        MUnitAction.prototype.getAction = function (mountType) {
            if (mountType in this.actions) {
                return this.actions[mountType];
            }
            return junyou.UnitAction.defaultAction;
        };
        return MUnitAction;
    }(junyou.UnitAction));
    junyou.MUnitAction = MUnitAction;
    __reflect(MUnitAction.prototype, "junyou.MUnitAction");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 基本单位<br/>
     * 是一个状态机<br/>
     * @author 3tion
     *
     */
    var Unit = (function (_super) {
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
            this.onSpwan();
            return this;
        };
        Unit.prototype.onSpwan = function () {
            this.state = 0 /* Init */;
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
            var render = new junyou.UnitRender(this);
            var model = new junyou.UModel();
            var body = new junyou.DSprite();
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
                this._render.faceTo = value >> 0;
            },
            enumerable: true,
            configurable: true
        });
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
            var now = junyou.Global.now;
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
            junyou.removeDisplay(this.body);
            var model = this._model;
            model.off("enterFrame" /* ENTER_FRAME */, this.$render, this);
            model.clear();
            this.rotation = 0;
            this.z = 0;
            // 回收ResourceBitmap
            var dict = this._resDict;
            for (var key in dict) {
                delete dict[key];
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
            this.aStandBy = new junyou.UnitAction();
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
            if (!action) {
                action = this.aStandBy;
            }
            now = now || junyou.Global.now;
            var currentAction = this._currentAction;
            /**
             * 是否成功执行新的动作
             */
            var flag = false;
            if (currentAction) {
                if (currentAction != action) {
                    if (currentAction.isEnd) {
                        currentAction.recycle();
                        flag = true;
                    }
                    else if (override || currentAction.canStop) {
                        currentAction.terminate();
                        currentAction.recycle();
                        flag = true;
                    }
                    else {
                        var next = this._nextAction;
                        if (next) {
                            if (next != action) {
                                next.recycle();
                                this._nextAction = action; //覆盖下一个动作
                            }
                        }
                        else {
                            this._nextAction = action;
                        }
                    }
                }
            }
            else {
                flag = true;
            }
            if (flag) {
                currentAction = action;
                currentAction.start(this, now);
                this._currentAction = currentAction;
            }
            currentAction.playAction(this, this._mountType, now);
            return flag;
        };
        /**
         * 停止单位当前动作，做待机动作
         *
         * @param {number} [now]
         */
        Unit.prototype.stopUnitAction = function (now) {
            this.startUnitAction(null, now, true);
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
                }
                else {
                    currentAction.playAction(this, this._mountType, now);
                }
            }
            else {
                flag = true;
            }
            if (flag) {
                var next = this._nextAction;
                this._nextAction = undefined;
                this.startUnitAction(next, now);
            }
        };
        /**
         * 动作进行渲染的时候
         */
        Unit.prototype.onRenderFrame = function (now) {
            var currentAction = this._currentAction;
            if (currentAction) {
                if (currentAction.isEnd) {
                    this.startUnitAction(this._nextAction, now);
                }
            }
            else {
                this.startUnitAction(this._nextAction, now);
            }
        };
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
            junyou.GameEngine.instance.getLayer(1760 /* Sorted */).addChild(this.body);
            if (doRender) {
                this.model.on("enterFrame" /* ENTER_FRAME */, this.$render, this);
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
                this.model.on("enterFrame" /* ENTER_FRAME */, this.$render, this);
            }
            this.state = 1 /* Stage */;
            this.dispatch(-1997 /* UnitAddToStage */);
        };
        Object.defineProperty(Unit.prototype, "x", {
            get: function () {
                return this._x;
            },
            /**
             * 此方法只允许 UnitAction调用
             */
            set: function (value) {
                value = value >> 0;
                if (this._x != value) {
                    this._x = value;
                    this.checkPosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Unit.prototype, "y", {
            get: function () {
                return this._y;
            },
            /**
             * 此方法只允许 UnitAction调用
             */
            set: function (value) {
                value = value >> 0;
                if (this._y != value) {
                    this._y = value;
                    this.checkPosition();
                    junyou.GameEngine.invalidateSort();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Unit.prototype, "z", {
            get: function () {
                return this._z;
            },
            /**
             * 此方法只允许 UnitAction调用
             */
            set: function (value) {
                value = value >> 0;
                if (this._z != value) {
                    this._z = value;
                    this.checkPosition();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 检查模型和其他的y轴
         */
        Unit.prototype.checkPosition = function () {
            var body = this.body;
            if (body) {
                body.depth = this._depth + this._y;
                body.y = this._y + this._z;
                body.x = this._x;
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
                    if (this._model.scaleX >= 0) {
                        this._model.rotation = value;
                    }
                    else {
                        this._model.rotation = -value;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        return Unit;
    }(egret.EventDispatcher));
    junyou.Unit = Unit;
    __reflect(Unit.prototype, "junyou.Unit");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 基于4个顶点变形的纹理
     *
     * @export
     * @class QuadTransform
     */
    var QuadTransform = (function () {
        function QuadTransform() {
            this._tex = new egret.RenderTexture();
            this._canvas = document.createElement("canvas");
            this._content = this._canvas.getContext("2d");
        }
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
        QuadTransform.prototype.drawDisplay = function (display, ptl, ptr, pbl, pbr) {
            var rawWidth = display.width;
            var rawHeight = display.height;
            ptl = ptl || { x: 0, y: 0 };
            ptr = ptr || { x: rawWidth, y: 0 };
            pbl = pbl || { x: 0, y: rawHeight };
            pbr = pbr || { x: rawWidth, y: rawHeight };
            //获取新的位图大小
            var ptlx = ptl.x, ptly = ptl.y, ptrx = ptr.x, ptry = ptr.y, pblx = pbl.x, pbly = pbl.y, pbrx = pbr.x, pbry = pbr.y;
            var minX = Math.min(ptlx, ptrx, pblx, pbrx);
            var maxX = Math.max(ptlx, ptrx, pblx, pbrx);
            var minY = Math.min(ptly, ptry, pbly, pbry);
            var maxY = Math.max(ptly, ptry, pbly, pbry);
            var width = maxX - minX;
            var height = maxY - minY;
            // let bytes = new Uint8ClampedArray(width * height * 4);
            var canvas = this._canvas;
            canvas.width = width;
            canvas.height = height;
            var content = this._content;
            var imgData = content.createImageData(width, height);
            var bytes = imgData.data;
            //获取原始位图数据
            var tex = this._tex;
            tex.drawToTexture(display);
            var source = tex.getPixels(0, 0, rawWidth, rawHeight);
            // top left
            ptl.Rx = ptl.Rx || 0;
            ptl.Ry = ptl.Ry || 0;
            //top right
            ptr.Rx = ptr.Rx || rawWidth;
            ptr.Ry = ptr.Ry || 0;
            //bottom right
            pbr.Rx = pbr.Rx || rawWidth;
            pbr.Ry = pbr.Ry || rawHeight;
            //bottom left
            pbl.Rx = pbl.Rx || 0;
            pbl.Ry = pbl.Ry || rawHeight;
            //使用 向辉 寿标《真实感图像的颜色插值及其应用》计算机世界月刊，1992年10月 的方案进行计算
            var dict = [];
            var edges = 0;
            edges += makeEdge(ptl, ptr, dict);
            edges += makeEdge(ptr, pbr, dict);
            edges += makeEdge(pbr, pbl, dict);
            edges += makeEdge(pbl, ptl, dict);
            if (edges > 0) {
                var ael = [];
                var tael = [];
                for (var y = 0; y < maxY; y++) {
                    var edges_1 = dict[y];
                    if (edges_1 && edges_1.length) {
                        edges_1.appendTo(ael);
                        ael.doSort("dx");
                    }
                    var len = ael.length - 1;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var edgeA = ael[i];
                            var xLeft = edgeA.x;
                            //let pLeft = { x: xLeft, y };
                            var lRx = edgeA.Rx;
                            var lRy = edgeA.Ry;
                            var edgeB = ael[i + 1];
                            //得到区段
                            var xRight = edgeB.x;
                            var rRx = edgeB.Rx;
                            var rRy = edgeB.Ry;
                            var xWidth = xLeft - xRight;
                            var dRxx = 0, dRyx = 0;
                            if (xWidth) {
                                dRxx = (lRx - rRx) / xWidth;
                                dRyx = (lRy - rRy) / xWidth;
                            }
                            for (var x = xLeft; x <= xRight; x++) {
                                var ix = lRx | 0;
                                var u = lRx - ix;
                                var iy = lRy | 0;
                                var v = lRy - iy;
                                //得到像素，做双线性插值
                                var pos00 = (iy * rawWidth + ix) * 4;
                                var r00 = source[pos00];
                                var g00 = source[pos00 + 1];
                                var b00 = source[pos00 + 2];
                                var a00 = source[pos00 + 3];
                                var pos10 = pos00 + 4;
                                var r10 = source[pos10];
                                var g10 = source[pos10 + 1];
                                var b10 = source[pos10 + 2];
                                var a10 = source[pos10 + 3];
                                var pos01 = ((iy + 1) * rawWidth + ix) * 4;
                                var r01 = source[pos01];
                                var g01 = source[pos01 + 1];
                                var b01 = source[pos01 + 2];
                                var a01 = source[pos01 + 3];
                                var pos11 = pos01 + 4;
                                var r11 = source[pos11];
                                var g11 = source[pos11 + 1];
                                var b11 = source[pos11 + 2];
                                var a11 = source[pos11 + 3];
                                var u1 = 1 - u;
                                var v1 = 1 - v;
                                var pm00 = u1 * v1;
                                var pm10 = u * v1;
                                var pm01 = u1 * v;
                                var pm11 = u * v;
                                var pos = (y * width + x) * 4;
                                bytes[pos] = r00 * pm00 + r10 * pm10 + r01 * pm01 + r11 * pm11;
                                bytes[pos + 1] = g00 * pm00 + g10 * pm10 + g01 * pm01 + g11 * pm11;
                                bytes[pos + 2] = b00 * pm00 + b10 * pm10 + b01 * pm01 + b11 * pm11;
                                bytes[pos + 3] = a00 * pm00 + a10 * pm10 + a01 * pm01 + a11 * pm11;
                                lRx += dRxx;
                                lRy += dRyx;
                            }
                        }
                        var l = 0;
                        for (var i = 0; i <= len; i++) {
                            l = edgeCheckAndInc(ael[i], tael, l, y);
                        }
                        tael.length = l;
                        var tmp = ael;
                        ael = tael;
                        tael = tmp;
                    }
                }
            }
            content.putImageData(imgData, 0, 0);
            return egret.BitmapData.create("base64", canvas.toDataURL());
            function edgeCheckAndInc(edge, list, l, y) {
                if (edge.ymax > y) {
                    list[l++] = edge;
                    edge.Rx += edge.dRx;
                    edge.Ry += edge.dRy;
                    edge.x = Math.round(edge.x + edge.dx);
                }
                return l;
            }
            function makeEdge(p0, p1, dict) {
                var x, Rx, Ry, ymax, ymin;
                if (p0.y == p1.y) {
                    return 0;
                }
                if (p0.y < p1.y) {
                    x = p0.x;
                    Rx = p0.Rx;
                    Ry = p0.Ry;
                    ymax = p1.y;
                    ymin = p0.y;
                }
                else {
                    x = p1.x;
                    Rx = p1.Rx;
                    Ry = p1.Ry;
                    ymax = p0.y;
                    ymin = p1.y;
                }
                var deltaY = p0.y - p1.y;
                var dx = (p0.x - p1.x) / deltaY;
                var dRx = (p0.Rx - p1.Rx) / deltaY;
                var dRy = (p0.Ry - p1.Ry) / deltaY;
                var edges = dict[ymin];
                if (!edges) {
                    dict[ymin] = edges = [];
                    edges.minY = ymin;
                }
                edges.push({ x: x, Rx: Rx, Ry: Ry, ymax: ymax, dx: dx, dRx: dRx, dRy: dRy });
                return 1;
            }
        };
        return QuadTransform;
    }());
    junyou.QuadTransform = QuadTransform;
    __reflect(QuadTransform.prototype, "junyou.QuadTransform");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 单位管理器
     * @author 3tion
     *
     */
    var UnitController = (function () {
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
            var _a = this, _domains = _a._domains, _domainCounts = _a._domainCounts;
            for (var i = 1; i < args.length; i++) {
                var domain = args[i];
                var dom = _domains[domain];
                if (!dom) {
                    dom = {};
                    _domains[domain] = dom;
                    _domainCounts[domain] = 0;
                }
                dom[guid] = unit;
            }
            this._domainAll[guid] = unit;
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
                _domainCounts[0 /* All */]--;
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
            return this._domainCounts[domain];
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
        /**
         *
         * 清理对象
         * @param {...Key[]} exceptGuids 需要保留的单位的GUID列表
         */
        UnitController.prototype.clear = function () {
            var exceptGuids = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                exceptGuids[_i] = arguments[_i];
            }
            var gcList = junyou.Temp.SharedArray1;
            var i = 0;
            for (var guid in this._domainAll) {
                if (!exceptGuids || !~exceptGuids.indexOf(guid)) {
                    gcList[i++] = guid;
                }
            }
            gcList.length = i;
            while (--i >= 0) {
                this.removeUnit(gcList[i]);
            }
            gcList.length = 0;
        };
        return UnitController;
    }());
    junyou.UnitController = UnitController;
    __reflect(UnitController.prototype, "junyou.UnitController");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 模型(纸娃娃)渲染器
     */
    var UnitRender = (function (_super) {
        __extends(UnitRender, _super);
        function UnitRender(unit) {
            var _this = _super.call(this) || this;
            _this.faceTo = 0;
            _this.nextRenderTime = 0;
            _this.renderedTime = 0;
            _this.unit = unit;
            _this.reset(junyou.Global.now);
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
                res.bitmapData = undefined;
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
    }(junyou.BaseRender));
    junyou.UnitRender = UnitRender;
    __reflect(UnitRender.prototype, "junyou.UnitRender");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var UnitSetting = (function () {
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
    junyou.UnitSetting = UnitSetting;
    __reflect(UnitSetting.prototype, "junyou.UnitSetting");
    /**
     * 默认的单位设置
     */
    junyou.defaultUnitSetting = new UnitSetting();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 序列的记录器
     * 用于做残影或者时光倒流的操作
     * @export
     * @class PSRecorder
     * @author 3tion
     */
    var PSRecorder = (function () {
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
            if (max < 1) {
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
                    series = junyou.recyclable(junyou.PSeries);
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
                while (tmp && i++ < idx) {
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
            if (reverse) {
                tmp = this._tail;
                while (tmp && i++ < max) {
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
    junyou.PSRecorder = PSRecorder;
    __reflect(PSRecorder.prototype, "junyou.PSRecorder");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于记录单位(Unit)的序列
     *
     * @export
     * @interface PhantomTarget
     * @author 3tion
     */
    var PSeries = (function () {
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
    junyou.PSeries = PSeries;
    __reflect(PSeries.prototype, "junyou.PSeries");
})(junyou || (junyou = {}));
/**
 * @author 3tion
 */
var junyou;
(function (junyou) {
    /**
     * 朝向工具，用于处理斜45°人物朝向
     * @author 3tion
     *
     */
    junyou.FaceToUtils = {
        /**
         * 朝向对应坐标偏移量
         */
        FacePos: [
            /*0*/ [0, 1],
            /*1*/ [1, 1],
            /*2*/ [1, 0],
            /*3*/ [1, -1],
            /*4*/ [0, -1],
            /*5*/ [-1, -1],
            /*6*/ [-1, 0],
            /*7*/ [-1, 1]
        ],
        /**
         * 获取朝向的弧度值
         * @param direction
         * @return
         *
         */
        FaceToRad: [
            /*0*/ 1.5707963267948966,
            /*1*/ 0.7853981633974483,
            /*2*/ 0,
            /*3*/ -0.7853981633974483,
            /*4*/ -1.5707963267948966,
            /*5*/ -2.356194490192345,
            /*6*/ 3.141592653589793,
            /*7*/ 2.356194490192345
        ],
        /**
         * 获取朝向的弧度值的Sin
         * @param direction
         * @return
         *
         */
        FaceToRadSin: [
            /*0*/ 1,
            /*1*/ 0.7071067811865475,
            /*2*/ 0,
            /*3*/ -0.7071067811865475,
            /*4*/ -1,
            /*5*/ -0.7071067811865476,
            /*6*/ 1.2246467991473532e-16,
            /*7*/ 0.7071067811865476
        ],
        /**
         * 获取朝向的弧度值的Cos
         * @param direction
         * @return
         *
         */
        FaceToRadCos: [
            /*0*/ 6.123233995736766e-17,
            /*1*/ 0.7071067811865476,
            /*2*/ 1,
            /*3*/ 0.7071067811865476,
            /*4*/ 6.123233995736766e-17,
            /*5*/ -0.7071067811865475,
            /*6*/ -1,
            /*7*/ -0.7071067811865475
        ],
        /**
         * 方向的对立方向数组
         */
        OPPS: [
            /*0*/ 4,
            /*1*/ 5,
            /*2*/ 6,
            /*3*/ 7,
            /*4*/ 0,
            /*5*/ 1,
            /*6*/ 2,
            /*7*/ 3
        ],
        /**
         * 根据弧度取的朝向值
         * @param rad		-π~+π
         * @return
         *
         */
        getFaceTo: function (rad) {
            if (rad < -2.748893571891069) {
                return 6;
            }
            else if (rad < -1.9634954084936207) {
                return 5;
            }
            else if (rad < -1.1780972450961724) {
                return 4;
            }
            else if (rad < -0.39269908169872414) {
                return 3;
            }
            else if (rad < 0.39269908169872414) {
                return 2;
            }
            else if (rad < 1.1780972450961724) {
                return 1;
            }
            else if (rad < 1.9634954084936207) {
                return 0;
            }
            else if (rad < 2.748893571891069) {
                return 7;
            }
            else {
                return 6;
            }
        },
        /**
         * 根据起点到终点取的朝向值
         * @param fx
         * @param fy
         * @param tx
         * @param ty
         * @return
         *
         */
        getFaceTo8: function (fx, fy, tx, ty) {
            var d = (ty - fy) / (tx - fx);
            if (fx <= tx) {
                if (d > 1.2071067811865472) {
                    return 0;
                }
                else if (d > 0.20710678118654754) {
                    return 1;
                }
                else if (d > -0.20710678118654754) {
                    return 2;
                }
                else if (d > -1.2071067811865472) {
                    return 3;
                }
                else {
                    return 4;
                }
            }
            else {
                if (d <= -1.2071067811865472) {
                    return 0;
                }
                else if (d <= -0.20710678118654754) {
                    return 7;
                }
                else if (d <= 0.20710678118654754) {
                    return 6;
                }
                else if (d <= 1.2071067811865472) {
                    return 5;
                }
                else {
                    return 4;
                }
            }
        },
        /**
         * 根据起点到终点取得屏幕朝向值
         * @param fx
         * @param fy
         * @param tx
         * @param ty
         * @return
         *
         */
        getMouseFaceTo8: function (fx, fy, tx, ty) {
            var d = (ty - fy) / (tx - fx);
            if (fx <= tx) {
                if (d > 2.414213562373095) {
                    return 0;
                }
                else if (d > 0.41421356237309503) {
                    return 1;
                }
                else if (d > -0.41421356237309503) {
                    return 2;
                }
                else if (d > -2.414213562373095) {
                    return 3;
                }
                else {
                    return 4;
                }
            }
            else {
                if (d <= -2.414213562373095) {
                    return 0;
                }
                else if (d <= -0.41421356237309503) {
                    return 7;
                }
                else if (d <= 0.41421356237309503) {
                    return 6;
                }
                else if (d <= 2.414213562373095) {
                    return 5;
                }
                else {
                    return 4;
                }
            }
        }
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var Point = egret.Point;
    /**
     * 按标准  x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)... 转换成坐标点集
     * @param data
     * @param outVector		用来装载点集的数组
     * @param errorMsg		如果有错误的报错信息
     *
     */
    junyou.GDataParseUtils = {
        convertZuobiaoList: function (data, outVector) {
            if (data) {
                if (true) {
                    var error = false;
                }
                for (var _i = 0, _a = data.split("|"); _i < _a.length; _i++) {
                    var zuobiao = _a[_i];
                    var zuobiaoList = zuobiao.split(":");
                    if (zuobiaoList.length == 2) {
                        var x = zuobiaoList[0];
                        var y = zuobiaoList[1];
                        if (true) {
                            if (+x != x || +y != y) {
                                error = true;
                            }
                        }
                        outVector.push(new Point(+x, +y));
                    }
                    else if (true) {
                        error = true;
                    }
                }
                if (true) {
                    if (error) {
                        junyou.ThrowError("格式不符合 x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)");
                    }
                }
            }
        },
        /**
         *
         * 解析配置为"x1""x2"....."x100"这样的属性  横向配置
         * @static
         * @param {Object} from 被解析的配置数据
         * @param {Object} xattr 最终会变成  xattr.x1=100  xattr.x2=123这样的数据
         * @param {boolean} [delOriginKey=true]  是否删除原始数据中的key
         * @returns {number}
         */
        parseAttribute: function (from, xattr, delOriginKey, xReg) {
            if (delOriginKey === void 0) { delOriginKey = true; }
            if (xReg === void 0) { xReg = /^x\d+$/; }
            var keyCount = 0;
            for (var key in from) {
                if (xReg.test(key)) {
                    var value = +(from[key]);
                    if (value > 0) {
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
         * @returns {number}
         */
        parseAttribute1: function (from, xattr, keyPrefix, valuePrefix, delOriginKey) {
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
                    if (value > 0) {
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
                    junyou.ThrowError("有重复的属性值:" + repeatedErr);
                }
            }
            return keyCount;
        },
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 异步工具类，用于加方法兼听
     * @author 3tion
     *
     */
    var AsyncHelper = (function () {
        function AsyncHelper() {
            this._ready = false;
        }
        Object.defineProperty(AsyncHelper.prototype, "isReady", {
            /**
             * 是否已经处理完成
             */
            get: function () {
                return this._ready;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 异步数据已经加载完毕
         */
        AsyncHelper.prototype.readyNow = function () {
            if (!this._ready) {
                this._ready = true;
                var _readyExecutes = this._readyExecutes;
                if (_readyExecutes) {
                    var temp = junyou.Temp.SharedArray1;
                    for (var i = 0, len = _readyExecutes.length; i < len; i++) {
                        temp[i] = _readyExecutes[i];
                    }
                    _readyExecutes = undefined;
                    for (i = 0; i < len; i++) {
                        var callback = temp[i];
                        callback.execute();
                    }
                    temp.length = 0;
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
            if (this._ready) {
                handle.apply(thisObj, args);
                return;
            }
            var _readyExecutes = this._readyExecutes;
            if (!_readyExecutes) {
                _readyExecutes = [];
                this._readyExecutes = _readyExecutes;
            }
            junyou.CallbackInfo.addToList.apply(junyou.CallbackInfo, [_readyExecutes, handle, thisObj].concat(args));
        };
        return AsyncHelper;
    }());
    junyou.AsyncHelper = AsyncHelper;
    __reflect(AsyncHelper.prototype, "junyou.AsyncHelper");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 依赖项的辅助类
     * @author 3tion
     *
     */
    var DependerHelper = (function () {
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
    junyou.DependerHelper = DependerHelper;
    __reflect(DependerHelper.prototype, "junyou.DependerHelper");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    junyou.isIAsync = isIAsync;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 代码构建类，用于注册代码
     * @author 3tion
     */
    var Facade = (function (_super) {
        __extends(Facade, _super);
        function Facade() {
            var _this = this;
            if (true) {
                if (junyou.facade) {
                    junyou.ThrowError("Facade重复赋值");
                }
            }
            _this = _super.call(this) || this;
            junyou.facade = _this;
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
            if ("NAME" in inlineRef) {
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
                true && junyou.ThrowError("\u6A21\u5757[" + proxyName + "]\u88AB\u4F9D\u8D56\uFF0C\u4E0D\u5141\u8BB8\u79FB\u9664", null, true);
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
                    junyou.ThrowError("registerInlineProxy时,没有ref");
                }
                return;
            }
            var className = egret.getQualifiedClassName(ref);
            if (!proxyName) {
                proxyName = Facade.getNameOfInline(ref, className);
            }
            this.registerProxyConfig(className, proxyName);
            if (!async) {
                var dele = this._proxys[proxyName];
                var host = new ref();
                dele.host = host;
                junyou.facade.inject(host);
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
                    junyou.ThrowError("registerInlineMediator\u65F6,\u6CA1\u6709ref");
                }
                return;
            }
            var className = egret.getQualifiedClassName(ref);
            if (!mediatorName) {
                mediatorName = Facade.getNameOfInline(ref, className);
            }
            this.registerMediatorConfig(className, mediatorName);
        };
        /**
         * 注册Proxy的配置
         * @param className     类名字，完整名字
         * @param name     模块名称
         * @param scriptid      要加载的脚本ID，用于加载脚本代码，空的id表示是主脚本
         */
        Facade.prototype.registerProxyConfig = function (className, proxyName, url, scriptid) {
            var dele;
            if (true) {
                dele = this._proxys[proxyName];
                if (dele) {
                    junyou.ThrowError("模块定义重复:" + name);
                }
            }
            dele = {};
            dele.scriptid = scriptid;
            dele.className = className;
            dele.name = proxyName;
            dele.url = url;
            this._proxys[proxyName] = dele;
        };
        /**
         * 注册模块的配置
         * @param className
         * @param name
         * @param scriptid      要加载的脚本ID，用于加载脚本代码
         */
        Facade.prototype.registerMediatorConfig = function (className, moduleID, url, scriptid) {
            var dele;
            if (true) {
                dele = this._mediators[moduleID];
                if (dele) {
                    junyou.ThrowError("模块定义重复:" + name);
                }
            }
            dele = {};
            dele.scriptid = scriptid;
            dele.className = className;
            dele.name = moduleID;
            dele.url = url;
            this._mediators[moduleID] = dele;
        };
        Facade.prototype.getOrCreateScript = function (dele) {
            var scriptid = dele.scriptid;
            var script = this._scripts[scriptid];
            if (!script) {
                script = new junyou.ModuleScript;
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
                    junyou.ThrowError("没有注册proxy的关系");
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
                    junyou.ThrowError("没有注册Mediator的关系");
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
            if (bin.dele.scriptid) {
                var script = this.getOrCreateScript(bin.dele);
                if (script.state != 2 /* COMPLETE */) {
                    script.callbacks.push(junyou.CallbackInfo.get(this._getHost, this, bin));
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
                var ref = egret.getDefinitionByName(dele.className);
                dele.host = host = new ref();
                junyou.facade.inject(host);
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
                junyou.ThrowError("无法在Mediator：" + mediator.name + "中找到方法[" + handlerName + "]");
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
                junyou.ThrowError("无法在Proxy：" + proxy.name + "中找到方法[" + handlerName + "]");
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
         * 实际注入的代码，子类扩展
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
    junyou.Facade = Facade;
    __reflect(Facade.prototype, "junyou.Facade");
    function proxyCall() {
        var f = junyou.facade;
        return f.getProxy.apply(f, arguments);
    }
    junyou.proxyCall = proxyCall;
    function proxyExec() {
        var f = junyou.facade;
        return f.executeProxy.apply(f, arguments);
    }
    junyou.proxyExec = proxyExec;
    function mediatorCall() {
        var f = junyou.facade;
        return f.getMediator.apply(f, arguments);
    }
    junyou.mediatorCall = mediatorCall;
    function mediatorExec() {
        var f = junyou.facade;
        return f.executeMediator.apply(f, arguments);
    }
    junyou.mediatorExec = mediatorExec;
    /**
     * 全局抛事件
     *
     * @export
     * @param {Key} type     事件类型
     * @param {*} [data]        数据
     */
    function dispatch(type, data) {
        junyou.facade.dispatch(type, false, data);
    }
    junyou.dispatch = dispatch;
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
        junyou.facade.toggle(moduleID, toggleState, showTip, param);
    }
    junyou.toggle = toggle;
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
        junyou.facade.on(type, listener, thisObj, false, priority);
    }
    junyou.on = on;
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
        junyou.facade.once(type, listener, thisObj, false, priority);
    }
    junyou.once = once;
    /**
     *
     * 移除事件监听
     * @static
     * @param {Key} type
     * @param {Function} listener
     * @param {*} [thisObject]
     */
    function off(type, listener, thisObject) {
        junyou.facade.off(type, listener, thisObject, false);
    }
    junyou.off = off;
    function hasListen(type) {
        return junyou.facade.hasListen(type);
    }
    junyou.hasListen = hasListen;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 配置工具
     * @author 3tion
     * @export
     * @class ConfigUtils
     */
    junyou.ConfigUtils = (function () {
        /**
         * 配置数据
         */
        var _data;
        /**
         * 资源的hash配置
         */
        var _hash;
        /**
         * 注册的皮肤路径
         * key      {string}   皮肤的key
         * value    {Path}    皮肤实际路径地址
         */
        var _regedSkinPath = {};
        var getPrefix;
        /**
         * 设置配置数据
         *
         * @static
         * @param {JConfig} data 配置
         */
        return {
            setData: function (data) {
                _data = data;
                !_data.params && (_data.params = {});
                //检查路径是否存在有路径有父路径的，如果有，进行预处理
                var paths = _data.paths;
                for (var key in paths) {
                    var p = paths[key];
                    p.tPath = getPath(p);
                }
                //检查前缀
                getPrefix = (function (prefixes) {
                    var len = 0;
                    if (prefixes) {
                        len = prefixes.length;
                    }
                    switch (len) {
                        case 0:
                            return function (uri) { return ""; };
                        case 1: {
                            var prefix_1 = prefixes[0];
                            return function (uri) { return prefix_1; };
                        }
                        default:
                            return function (uri) {
                                var idx = uri.hash() % prefixes.length;
                                return prefixes[idx] || "";
                            };
                    }
                })(_data.prefixes);
                function getPath(p) {
                    var parentKey = p.parent;
                    if (parentKey) {
                        var parent_2 = paths[parentKey];
                        if (parent_2) {
                            return getPath(parent_2) + p.path;
                        }
                        else if (true) {
                            junyou.ThrowError("\u8DEF\u5F84[" + p.path + "]\u914D\u7F6E\u4E86\u7236\u7EA7(parent)\uFF0C\u4F46\u662F\u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u7236\u7EA7");
                        }
                    }
                    return p.path;
                }
            },
            /**
             * 获取资源完整路径
             *
             * @static
             * @param {string} uri                  路径标识
             * @param {Boolean} [sameDomain=false]  是否为同域，同域的话，资源从resource中获取
             * @returns {string}
             */
            getResUrl: function (uri, sameDomain) {
                if (sameDomain) {
                    return "resource/" + uri;
                }
                if (_hash) {
                    var ver = _hash[uri];
                    if (ver) {
                        if (uri.indexOf("?") == -1) {
                            uri = uri + "?" + ver;
                        }
                        else {
                            uri = uri + "&jyver=" + ver;
                        }
                    }
                }
                return getUrlWithPath(uri, _data.paths.res);
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
            if (/^((http|https):)?\/\//.test(uri)) {
                return uri;
            }
            uri = path.tPath + uri;
            var prefix = path.iPrefix ? "" : getPrefix(uri);
            return prefix + uri;
        }
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 视图控制器，持有视图<br/>
     * 持有Proxy，主要监听视图和Proxy的事件，变更面板状态<br/>
     * @author 3tion
     *
     */
    var Mediator = (function (_super) {
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
                    if (junyou.isIAsync(value)) {
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
            if (junyou.isIAsync(this.$view)) {
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
            this._preViewReady = true;
            if (this._dependerHelper) {
                this._dependerHelper.check();
            }
            else {
                this.dependerReadyCheck();
            }
        };
        /**
         *
         * 依赖项完毕后检查
         * @protected
         * @returns
         */
        Mediator.prototype.dependerReadyCheck = function () {
            if (!this._preViewReady) {
                return;
            }
            if (!this._ready) {
                this._ready = true;
                this.afterAllReady();
                if (this._asyncHelper) {
                    this._asyncHelper.readyNow();
                }
            }
        };
        Mediator.prototype.hide = function () {
            junyou.toggle(this._name, -1 /* HIDE */);
        };
        return Mediator;
    }(junyou.ViewController));
    junyou.Mediator = Mediator;
    __reflect(Mediator.prototype, "junyou.Mediator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 模块脚本，后续开发模块，分成多个模块文件
     * @author 3tion
     *
     */
    var ModuleScript = (function () {
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
                var url = this.url || junyou.Facade.Script.substitute(this.id);
                junyou.loadScript(url, this.onScriptLoaded, this);
                this.state = 1 /* REQUESTING */;
            }
        };
        /**
         * 配置加载完成之后
         */
        ModuleScript.prototype.onScriptLoaded = function () {
            this.state = 2 /* COMPLETE */;
            var callbacks = this.callbacks.concat();
            this.callbacks.length = 0;
            for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                var callback = callbacks_1[_i];
                callback.execute();
            }
        };
        return ModuleScript;
    }());
    junyou.ModuleScript = ModuleScript;
    __reflect(ModuleScript.prototype, "junyou.ModuleScript");
})(junyou || (junyou = {}));
/**
 * DataLocator的主数据
 * 原 junyou.DataLocator.data  的全局别名简写
 */
var $DD = {};
/**
 * DataLocator的附加数据
 * 原junyou.DataLocator.extra 的全局别名简写
 */
var $DE;
var junyou;
(function (junyou) {
    /**
     * 配置加载器<br/>
     * 用于预加载数据的解析
     * @author 3tion
     *
     */
    junyou.DataLocator = (function () {
        var parsers = {};
        /**
         *
         * 用于处理顺序
         * @private
         * @static
         */
        var _plist = [];
        return {
            regParser: regParser,
            /**
             * 解析打包的配置
             */
            parsePakedDatas: function () {
                var configs = RES.getRes("cfgs");
                RES.destroyRes("cfgs");
                // 按顺序解析
                for (var _i = 0, _plist_1 = _plist; _i < _plist_1.length; _i++) {
                    var key = _plist_1[_i];
                    var parser = parsers[key];
                    var data = parser(configs[key]);
                    if (data) {
                        $DD[key] = data;
                    }
                }
                var extraData = {};
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
                $DE = extraData;
                //清理内存
                parsers = null;
                _plist = null;
                delete junyou.DataLocator;
            },
            /**
             * 注册通过H5ExcelTool导出的数据并且有唯一标识的使用此方法注册
             * @param {string}              key             数据的标识
             * @param {{ new (): ICfg }}    CfgCreator      配置的类名
             * @param {string}              [idkey="id"]    唯一标识
             */
            regCommonParser: function (key, CfgCreator, idkey) {
                if (idkey === void 0) { idkey = "id"; }
                regParser(key, function (data) {
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
                    if (idkey == "") {
                        dict = [];
                        forEach = arrayParserForEach;
                    }
                    else {
                        dict = {};
                        forEach = commonParserForEach;
                    }
                    try {
                        var ref = CfgCreator || Object;
                        for (var i = 1; i < data.length; i++) {
                            var rowData = data[i];
                            var ins = new ref();
                            var local = hasLocal && {};
                            for (var j = 0; j < headersRaw.length; j++) {
                                var head = headersRaw[j];
                                var name_6 = head[0], test = head[1], type = head[2], def = head[3];
                                var v = getJSONValue(rowData[j], test, def);
                                if ((type & 2 /* Local */) == 2 /* Local */) {
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
                    }
                    catch (e) {
                        if (true) {
                            junyou.ThrowError("\u89E3\u6790\u914D\u7F6E:" + key + "\u51FA\u9519\uFF0C\u5806\u6808\uFF1A" + e.stack);
                        }
                    }
                    return dict;
                });
            }
        };
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
                    if (value == null || value == undefined) {
                        value = def;
                    }
                    break;
                case 1 /* String */:
                    if (value === 0 || value == undefined) {
                        value = def || "";
                    }
                    break;
                case 2 /* Number */:
                    // 0 == "" // true
                    if (value === "" || value == undefined) {
                        value = +def || 0;
                    }
                    break;
                case 3 /* Bool */:
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
                    value = new junyou.TimeVO().decodeBit(value || def || 0);
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
                        junyou.ThrowError("\u914D\u7F6E" + key + "\u7684\u6570\u636E\u6709\u8BEF\uFF0C\u552F\u4E00\u6807\u8BC6" + idKey + "\u4E0D\u80FD\u4E3A\u5BF9\u8C61");
                    }
                    if (id in dict) {
                        junyou.ThrowError("\u914D\u7F6E" + key + "\u7684\u6570\u636E\u6709\u8BEF\uFF0C\u552F\u4E00\u6807\u8BC6" + idKey + "\u6709\u91CD\u590D\u503C\uFF1A" + id);
                    }
                }
                dict[id] = t;
            }
            else {
                if (true) {
                    junyou.ThrowError("\u914D\u7F6E" + key + "\u89E3\u6790\u6709\u8BEF\uFF0C\u65E0\u6CD5\u627E\u5230\u6307\u5B9A\u7684\u552F\u4E00\u6807\u793A\uFF1A" + idKey + "\uFF0C\u6570\u636E\u7D22\u5F15\uFF1A" + idx);
                }
            }
        }
    })();
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于和服务端通信的数据
     * @author 3tion
     */
    var Service = (function (_super) {
        __extends(Service, _super);
        function Service(name) {
            return _super.call(this, name) || this;
        }
        Service.prototype.onRegister = function () {
            this._ns = junyou.NetService.get();
        };
        Service.prototype._startSync = function () {
            // Service默认为同步，如果需要收到服务端数据的，重写此方法
            this.selfReady();
        };
        /**
         * 用于新版本的自动生成代码的注册
         * [cmd,msgType,handler,cmd1,msgType1,handler1,cmd2,msgType2,handler2,....cmdN,msgTypeN,handlerN]
         * @protected
         * @param {any} args
         */
        Service.prototype.reg = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var ns = this._ns;
            for (var i = 0; i < args.length; i += 3) {
                var cmd = args[i];
                var ref = args[i + 1];
                var handler = args[i + 2];
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
    }(junyou.Proxy));
    junyou.Service = Service;
    __reflect(Service.prototype, "junyou.Service");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
                if (view instanceof junyou.Panel) {
                    view.show();
                }
            };
        }
        if (stateMed.sleepBy === undefined) {
            stateMed.sleepBy = sleepBy || function (id) {
                var view = this._view;
                if (view instanceof junyou.Panel) {
                    view.hide();
                }
            };
        }
        return stateMed;
    }
    junyou.transformToStateMediator = transformToStateMediator;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * @author 君游项目解析工具
     *
     */
    junyou.DataParseUtil = {
        /**
        * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到<br/>
        * 配置VO为：
        * <pre>
        * class Cfg
        * {
        * 		public var type:int;
        * 		public var datas:Array;
        * }
        * </pre>
        * 上面示例中<br/>
        * typeKey 为 type<br/>
        * dataKey 为 data<br/>
        * checkStart 为 1<br/>
        * checkEnd 为 4<br/>
        * toDatasKey 为 data<br/>
        * to的type  datas数组中<br/>
        * @param to					要写入的配置
        * @param from				配置的数据源
        * @param checkStart		      数据源起始值	data<b><font color="#ff0000">1</font></b>
        * @param checkEnd		      数据源结束值	data<b><font color="#ff0000">4</font></b>
        * @param dataKey			数据源数值的前缀	<b><font color="#ff0000">data</font></b>
        * @param typeKey			数据源/配置的 类型 上例为 <b><font color="#ff0000">type</font></b>
        * @param toDatasKey		      配置的数值存储的数据的数组属性名，上例为 <b><font color="#ff0000">datas</font></b>
        *
        */
        parseDatas: function (to, from, checkStart, checkEnd, dataKey, typeKey, toDatasKey) {
            var arr;
            for (var i = checkStart; i <= checkEnd; i++) {
                var key = dataKey + i;
                if (key in from) {
                    if (!arr) {
                        arr = [];
                    }
                    arr[i] = from[key];
                }
            }
            if (!arr) {
                if (typeKey in from) {
                    arr = [];
                    to[typeKey] = from[typeKey];
                }
            }
            if (arr) {
                to[toDatasKey] = arr;
            }
        },
        /**
        * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到<br/>
        * 配置VO为：
        * <pre>
        * class Cfg
        * {
        * 		public var type:int;
        * 		public var datas:Array;
        * }
        * </pre>
        * 上面示例中<br/>
        * typeKey 为 type<br/>
        * dataKey 为 data<br/>
        * checkStart 为 1<br/>
        * checkEnd 为 4<br/>
        * toDatasKey 为 data<br/>
        * to的type  datas数组中<br/>
        * @static
        * @param {*} to                要写入的配置
        * @param {any[]} valueList     配置的数据源的值列表
        * @param {string[]} keyList    配置数据的属性key列表
        * @param {number} checkStart   数据源起始值	data<b><font color="#ff0000">1</font></b>
        * @param {number} checkEnd     数据源结束值	data<b><font color="#ff0000">4</font></b>
        * @param {string} dataKey      数据源数值的前缀	<b><font color="#ff0000">data</font></b>
        * @param {string} typeKey      数据源/配置的 类型 上例为 <b><font color="#ff0000">type</font></b>
        * @param {string} toDatasKey   配置的数值存储的数据的数组属性名，上例为 <b><font color="#ff0000">datas</font></b>
        */
        parseDatas2: function (to, valueList, keyList, checkStart, checkEnd, dataKey, typeKey, toDatasKey) {
            var arr;
            for (var i = checkStart; i <= checkEnd; i++) {
                var key = dataKey + i;
                var idx = keyList.indexOf(key);
                if (~idx) {
                    if (!arr) {
                        arr = [];
                    }
                    arr[i] = valueList[idx];
                }
            }
            if (!arr) {
                // 数据中有列表值
                var idx = keyList.indexOf(typeKey);
                if (~idx) {
                    arr = [];
                    to[typeKey] = valueList[idx];
                }
            }
            if (arr) {
                to[toDatasKey] = arr;
            }
        },
        /**
         * 从数据集中获取key-value的数据
         * @param valueList 数据集合
         * @param keyList   属性列表
         */
        getData: function (valueList, keyList, o) {
            o = o || {};
            for (var i = 0, len = keyList.length; i < len; i++) {
                var key = keyList[i];
                var v = valueList[i];
                if (v != undefined) {
                    o[key] = valueList[i];
                }
            }
            return o;
        },
        /**
         * 获取key-value的数据列表
         * @param dataList  数据集合
         * @param keyList   属性列表
         */
        getDataList: function (dataList, keyList) {
            var list = [];
            if (dataList) {
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var valueList = dataList[i];
                    list.push(this.getData(valueList, keyList));
                }
            }
            return list;
        },
        /**
         * 处理数据
         * @param dataList  数据集合
         * @param keyList   属性列表
         * @param forEach
         * @param thisObj
         * @param args
         */
        parseDataList: function (dataList, keyList, forEach, thisObj) {
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            if (dataList) {
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var valueList = dataList[i];
                    var to = this.getData(valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },
        /**
         * 从数组中获取数据，主要针对配置
         * @param to            目标数据
         * @param valueList     值列表
         * @param keyList       属性列表
         */
        copyData: function (to, valueList, keyList) {
            for (var i = 0, len = keyList.length; i < len; i++) {
                var key = keyList[i];
                to[key] = valueList[i];
            }
        },
        /**
         * 设置数据集，将数据赋值，不会对creator类型中，没有setter的数据赋值
         * @param creator   构造器
         * @param dataList  数据集合
         * @param keyList   属性列表
         * @param forEach
         * @param thisObj
         * @param args
         */
        copyDataList: function (creator, dataList, keyList, forEach, thisObj) {
            var args = [];
            for (var _i = 5; _i < arguments.length; _i++) {
                args[_i - 5] = arguments[_i];
            }
            if (dataList) {
                for (var i = 0, len = dataList.length; i < len; i++) {
                    var valueList = dataList[i];
                    var to = new creator();
                    this.copyData(to, valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 功能配置的基类
     * @author 3tion
     */
    var BaseMCfg = (function () {
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
            junyou.DataParseUtil.parseDatas(this, from, 0, 3, "showlimit", "showtype", "showlimits");
            //解析功能使用限制
            junyou.DataParseUtil.parseDatas(this, from, 0, 3, "limit", "limittype", "limits");
        };
        return BaseMCfg;
    }());
    junyou.BaseMCfg = BaseMCfg;
    __reflect(BaseMCfg.prototype, "junyou.BaseMCfg");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 模块管理器
     * 用于管理模块的开启/关闭
     * @author 3tion
     *
     */
    var ModuleManager = (function () {
        function ModuleManager() {
            /**
             * 需要检查
             */
            this._needCheck = false;
            /**
             * 需要检查显示
             */
            this._needCheckShow = false;
        }
        ModuleManager.prototype.init = function () {
            this._bindedIOById = [];
            this._handlersByType = [];
            this._checkers = [];
            this._allById = {};
            this._unshowns = [];
            this._handlersById = {};
            this._ioBind = new Map();
            junyou.on(-993 /* MODULE_NEED_CHECK_SHOW */, this.checkShowHandler, this);
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
            this._handlersByType[type] = handler;
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
                this._handlersById[id] = handler;
            }
            else {
                junyou.ThrowError("ModuleManager 注册模块处理函数时，没有找到对应的模块配置，模块id:" + id);
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
                var _checks = this._checkers;
                var _allById = this._allById;
                if (_checks) {
                    if (true) {
                        var errString = "";
                        var limitWarn = "";
                        var unsolve = "";
                    }
                    var checker;
                    for (var id in _allById) {
                        var cfg = _allById[id];
                        var showtype = cfg.showtype;
                        if (showtype) {
                            checker = _checks[showtype];
                            if (true) {
                                if (!checker) {
                                    unsolve += cfg.id + "的显示限制 ";
                                }
                            }
                        }
                        var limittype = cfg.limittype;
                        if (limittype) {
                            checker = _checks[limittype];
                            if (true) {
                                if (!checker) {
                                    unsolve += cfg.id + "的使用限制 ";
                                }
                            }
                        }
                        if (showtype == limittype) {
                            if (showtype) {
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
                        }
                        else {
                            if (true) {
                                limitWarn += cfg.id + " ";
                            }
                        }
                        if (!this.isModuleShow(cfg)) {
                            var id_1 = cfg.id;
                            this._unshowns.push(id_1);
                            var displays = this._bindedIOById[id_1];
                            if (displays) {
                                for (var _i = 0, displays_1 = displays; _i < displays_1.length; _i++) {
                                    var io = displays_1[_i];
                                    io.visible = false;
                                }
                            }
                        }
                    }
                    if (true) {
                        if (limitWarn) {
                            junyou.ThrowError("id为：" + limitWarn + "的功能配置，showtype和limittype不一致，请确认是否要这样，这种配置将无法通过程序的方式确认当可以使用功能的时候，是否一定看得见功能入口");
                        }
                        if (errString) {
                            junyou.ThrowError("id为:" + errString + "的功能配置使用限制和显示限制配置有误，自动进行修正");
                        }
                        if (unsolve) {
                            junyou.ThrowError("有功能配置的限制类型并未实现：");
                        }
                    }
                    junyou.dispatch(-998 /* MODULE_CHECKER_INITED */);
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
                    junyou.ThrowError("\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7684\u529F\u80FD\u914D\u7F6E[" + module + "]");
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
                    junyou.ThrowError("\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7684\u529F\u80FD\u914D\u7F6E[" + module + "]");
                }
            }
            if (false || junyou.ClientCheck.isClientCheck) {
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
                junyou.ThrowError("ModuleManager 注册按钮时候，重复注册了按钮");
                return;
            }
            var cfg = this._allById[id];
            if (!cfg) {
                junyou.ThrowError("ModuleManager 注册按钮时候，没有找到对应的模块配置，模块id:" + id);
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
                    junyou.ToolTipManager.register(io, toolTips);
                }
            }
            var moduleHandler = this._handlersByType[cfg.type];
            if (moduleHandler) {
                this.registerHandlerById(id, moduleHandler);
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
         * 检查显示
         * @param event
         *
         */
        ModuleManager.prototype.checkShowHandler = function () {
            this._needCheckShow = true;
            egret.callLater(this._checkShowHandler, this);
        };
        ModuleManager.prototype._checkShowHandler = function () {
            if (!this._needCheckShow) {
                return;
            }
            this._needCheckShow = false;
            var changed = false;
            var _unshowns = this._unshowns;
            for (var i = _unshowns.length - 1; i >= 0; i--) {
                var id = _unshowns[i];
                if (this.isModuleShow(id)) {
                    var displays = this._bindedIOById[id];
                    if (displays) {
                        for (var _i = 0, displays_2 = displays; _i < displays_2.length; _i++) {
                            var dis = displays_2[_i];
                            dis.visible = true;
                        }
                    }
                    changed = true;
                    _unshowns.splice(i, 1);
                    junyou.dispatch(-991 /* MODULE_SHOW */, id);
                }
            }
            if (changed) {
                junyou.dispatch(-994 /* MODULE_SHOW_CHANGED */, _unshowns.length);
            }
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
                junyou.ThrowError("ModuleManager execute时，无法找到对应模块配置,ModuleID为:" + moduleID);
                return false;
            }
            junyou.dispatch(-997 /* MODULE_TRY_TOGGLE */, moduleID);
            if (!this.isModuleOpened(cfg, showtip)) {
                return false;
            }
            var moduleHandler = this._handlersById[moduleID];
            if (!moduleHandler) {
                moduleHandler = this._handlersByType[cfg.type];
            }
            if (moduleHandler) {
                show = ~~show;
                switch (show) {
                    case 0 /* AUTO */:
                        switch (cfg.showState) {
                            case 0 /* HIDE */:
                            case 3 /* HIDING */:
                                moduleHandler.show(cfg, param);
                                break;
                            case 2 /* SHOW */:
                            case 1 /* SHOWING */:
                                moduleHandler.hide(cfg, param);
                                break;
                        }
                        break;
                    case -1 /* HIDE */:
                        moduleHandler.hide(cfg, param);
                        break;
                    case 1 /* SHOW */:
                        moduleHandler.show(cfg, param);
                        break;
                }
                return true;
            }
            return false;
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
                    junyou.dispatch(state ? -995 /* MODULE_SERVER_OPEN */ : -996 /* MODULE_SERVER_CLOSE */, mid);
                }
            }
        };
        return ModuleManager;
    }());
    junyou.ModuleManager = ModuleManager;
    __reflect(ModuleManager.prototype, "junyou.ModuleManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 通知管理器
     * @author 3tion
     */
    var NotificationManager = (function () {
        function NotificationManager() {
            this._dict = {};
            this._listen = {};
            this._badges = {};
            this._list = [];
        }
        /**
         * 从dic中取出一个角标
         *
         * param {(number | string)} id (标识)
         *param {{[index:number]:egret.Shape}} dic (存放角标的字典)
         *param {boolean} [create] (是否自动创建,如果要创建，dis参数必填)
         *param {egret.DisplayObjectContainer} [dis] (关联的那个按钮)
         *param {number} [x] (角标偏移X)
         *param {number} [y] (角标偏移Y)
         *returns shape
         */
        NotificationManager.getJiaoBiaoShape = function (id, dic, create, dis, offsetx, offsety) {
            if (offsetx === void 0) { offsetx = 0; }
            if (offsety === void 0) { offsety = 0; }
            var shape = dic[id];
            if (!shape) {
                if (create) {
                    shape = new egret.Shape();
                    shape.graphics.beginFill(0xff0000);
                    shape.graphics.drawCircle(0, 0, 10);
                    shape.graphics.endFill();
                    if (dis) {
                        var con = dis.parent;
                        shape.x = dis.x + dis.width - shape.width * 0.5 + offsetx;
                        shape.y = dis.y + shape.height * 0.5 + offsety;
                        con.addChild(shape);
                        dic[id] = shape;
                    }
                }
            }
            return shape;
        };
        /**
         * 获取Badge数据
         *
         * @param {Key} id
         * @returns
         */
        NotificationManager.prototype.getBadge = function (id) {
            return this._badges[id];
        };
        /**
         *
         * 绑定检查器和标识
         * 一般用于注册子模块
         * ```
         *       [父模块1]             [父模块2]
         *  ┌────────┼────────┐          |
         *  子　　　　子       子         子
         *  模　　　　模       模         模
         *  块　　　　块       块         块
         *  a　　　　 b        c          d
         *
         * ```
         * 不是所有的标识都需要绑定检查器
         * 可以只需要绑定关注对象
         * 如上图所示，有`父模块1`，`父模块2`，一般对应主界面的按钮进行打开
         * `父模块1`下有3个子模块（`a`,`b`,`c`），一般对应父模块1的面板的3个页签
         * 常见的业务流程：任意子模块（`a`,`b`,`c`)有角标以后，父模块显示角标
         * 而子模块的角标一般会对应特定的检查代码
         *
         * 这种情况下，可以不对父模块1注册，只需注册子模块即可
         *
         * @param {INCheck|{(): any }} checker      检查器，或者检查器的函数
         * @param {string|number} mid               标识  绑定检查器的标识
         * @param {number} [proirity=0]             执行优先级
         */
        NotificationManager.prototype.bind = function (checker, mid, parent, proirity) {
            var bin = this._dict[mid];
            if (!bin) {
                bin = {};
                if (typeof checker.ncheck === "function") {
                    bin.checker = checker;
                    bin.checkHandler = checker.ncheck;
                }
                else {
                    bin.checkHandler = checker;
                }
                bin.id = mid;
                bin.proirity = ~~proirity;
                bin.needCheck = false;
                if (!parent) {
                    parent = mid;
                }
                this.bindListner(mid, parent);
                this._list.push(bin);
                this._needSort = true;
            }
            this._dict[mid] = bin;
        };
        /**
         *
         * 绑定关注对象
         * @param {Key} mid    有ncheck实现的标识
         * @param {Key} [lid]  关联的标识(上一级父模块id)，如果不填，则用主表示
         */
        NotificationManager.prototype.bindListner = function (mid, lid) {
            // lid = lid === undefined ? mid : lid;
            var b = this._badges[mid];
            if (!b) {
                this._badges[mid] = b = {};
                b.mid = mid;
            }
            if (lid && lid != mid) {
                var parent_3 = this._badges[lid];
                if (!parent_3) {
                    this._badges[lid] = parent_3 = {};
                    parent_3.mid = lid;
                }
                b.parent = parent_3;
                var sons = parent_3.sons;
                if (!sons) {
                    parent_3.sons = sons = [];
                }
                sons.push(b);
            }
            var arr = this._listen[mid];
            // let arr = this._listen[lid];
            if (!arr) {
                // this._listen[lid] = arr = [];
                this._listen[mid] = arr = [];
                arr.push(b);
            }
            else {
                arr.pushOnce(b);
            }
            // this._listen[lid] = arr;
            this._listen[mid] = arr;
        };
        /**
         *
         * 需要检查的关联标识
         * @param {string} id
         */
        NotificationManager.prototype.needCheck = function (id) {
            this._needCheck = true;
            var bin = this._dict[id];
            if (bin) {
                bin.needCheck = true;
                //下一帧进行检查
                junyou.Global.callLater(this.check, 0, this);
            }
            var badge = this.getBadge(id);
            if (badge) {
                //先将当前badge置为false，然后检查与badge并行的badge，如果都为false，就往上递归，如果都是false，就
                //将顶部入口也置为false;
                if (badge.show) {
                    badge.show = false;
                    var parent_4 = badge.parent;
                    while (parent_4) {
                        var sons = parent_4.sons;
                        if (sons) {
                            var allsonHide = true;
                            for (var i = 0; i < sons.length; i++) {
                                var son = sons[i];
                                if (son.show) {
                                    allsonHide = false;
                                    break;
                                }
                            }
                            if (allsonHide) {
                                parent_4.show = false;
                                parent_4 = parent_4.parent;
                            }
                            else {
                                parent_4 = undefined;
                            }
                        }
                    }
                }
            }
        };
        /**
         * 检查
         */
        NotificationManager.prototype.check = function () {
            if (!this._needCheck) {
                return;
            }
            this._needCheck = false;
            if (this._needSort) {
                this._list.doSort("proirity", true);
                this._needSort = false;
            }
            // let listen = this._listen;
            var changed = [];
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                var bin = _a[_i];
                if (bin.needCheck) {
                    var thisObj = bin.checker;
                    var handler = bin.checkHandler;
                    var msg = handler.call(thisObj);
                    var b = this.getBadge(bin.id);
                    if (b) {
                        if (changed.indexOf(b) == -1 || msg != b.msg) {
                            b.msg = msg; //记录高优先级的消息
                            changed.pushOnce(b);
                            if (!msg) {
                                b.show = false;
                            }
                            else {
                                b.show = true;
                            }
                            var parent_5 = b.parent;
                            while (parent_5) {
                                changed.pushOnce(parent_5);
                                parent_5 = parent_5.parent;
                            }
                        }
                    }
                    // let larr = listen[bin.id];
                    // if (larr) {
                    //     for (let b of larr) {
                    //         if (changed.indexOf(b) == -1 || msg != b.msg) {
                    //             b.msg = msg;//记录高优先级的消息
                    //             changed.pushOnce(b);
                    //             if (!msg) {
                    //                 b.show = false;
                    //             } else {
                    //                 b.show = true;
                    //             }
                    //         }
                    //     }
                    // }
                    //已经检查过
                    bin.needCheck = false;
                }
            }
            for (var i = 0; i < changed.length; i++) {
                var badge = changed[i];
                if (badge.show) {
                    var parent_6 = badge.parent;
                    while (parent_6) {
                        parent_6.show = badge.show;
                        parent_6 = parent_6.parent;
                    }
                }
                else {
                    var sons = badge.sons;
                    if (sons) {
                        for (var j = 0; j < sons.length; j++) {
                            var son = sons[j];
                            if (son.show) {
                                badge.show = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (junyou.hasListen(-999 /* Notification */)) {
                for (var _b = 0, changed_1 = changed; _b < changed_1.length; _b++) {
                    var b = changed_1[_b];
                    junyou.dispatch(-999 /* Notification */, b);
                }
            }
        };
        return NotificationManager;
    }());
    junyou.NotificationManager = NotificationManager;
    __reflect(NotificationManager.prototype, "junyou.NotificationManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * 用于弹出窗口，并将下层模糊的工具类
     * @export
     * @class BlurScreen
     * @author gushuai
     */
    var BlurScreen = (function () {
        function BlurScreen() {
            this._engine = junyou.GameEngine.instance;
            this._bmp = new egret.Bitmap();
            this._stage = egret.sys.$TempStage;
            this._con = new egret.Sprite();
            this._tex = new egret.RenderTexture();
            this._dic = {};
        }
        BlurScreen.prototype.registerModuleLayers = function (moduleid) {
            var _this = this;
            var ids = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                ids[_i - 1] = arguments[_i];
            }
            var dic = this._dic;
            var layers = ids.map(function (id) { return _this._engine.getLayer(id); });
            layers.doSort("id");
            dic[moduleid] = layers;
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
                junyou.dispatch(-1998 /* ReLayout */);
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
                bmp.filters = junyou.FilterUtils.blur;
                stage.addChildAt(bmp, 0);
            }
        };
        BlurScreen.prototype.hideBlur = function () {
            this._stage.off("resize" /* RESIZE */, this.drawBlur, this);
            junyou.removeDisplay(this._bmp);
            this._tex.$renderBuffer.resize(0, 0);
            var layers = this._dic[this._current];
            if (layers) {
                var len = layers.length;
                var engine = this._engine;
                for (var i = 0; i < len; i++) {
                    var layer = layers[i];
                    this._engine.awakeLayer(layer.id);
                }
            }
        };
        return BlurScreen;
    }());
    junyou.BlurScreen = BlurScreen;
    __reflect(BlurScreen.prototype, "junyou.BlurScreen");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 模块面板
     * @author 3tion
     *
     */
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel() {
            var _this = _super.call(this) || this;
            _this.init();
            return _this;
        }
        Object.defineProperty(Panel.prototype, "suiRawRect", {
            /**
             *
             * 面板在fla中的原始坐标
             * @readonly
             *
             * @memberOf Panel
             */
            get: function () {
                return this._baseRect;
            },
            /**
             * 设置原始大小和坐标
             */
            set: function (value) {
                this._baseRect = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "isReady", {
            get: function () {
                return this._ready;
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
            this._key = key;
            this._className = className;
            this._otherDepends = otherDepends;
        };
        Panel.prototype.startSync = function () {
            if (this._otherDepends) {
                this._depends = this._otherDepends.concat();
            }
            else {
                this._depends = [];
            }
            this._depends.push(this._key);
            this.loadNext();
        };
        Panel.prototype.loadNext = function () {
            if (this._depends.length) {
                var key = this._depends.pop();
                var suiManager = junyou.singleton(junyou.SuiResManager);
                suiManager.loadData(key, this);
            }
            else {
                this.skinDataComplete();
            }
        };
        Panel.prototype.suiDataComplete = function (suiData) {
            if (this.preloadImage) {
                suiData.loadBmd(junyou.CallbackInfo.get(this.loadNext, this));
            }
            else {
                this.loadNext();
            }
        };
        Panel.prototype.suiDataFailed = function (suiData) {
            //暂时用alert
            // alert(this._className + "加载失败");
        };
        /**
         * 绑定皮肤
         */
        Panel.prototype.bindComponent = function () {
            junyou.singleton(junyou.SuiResManager).createComponents(this._key, this._className, this);
        };
        /**
         * 皮肤数据加载完成
         */
        Panel.prototype.skinDataComplete = function () {
            this.bindComponent();
            if (this["bg"]) {
                this["bg"].touchEnabled = true;
            }
            else {
                if (this.numChildren) {
                    var bg = this.getChildAt(0);
                    bg.touchEnabled = true;
                }
            }
            this._ready = true;
            if (this._asyncHelper) {
                this._asyncHelper.readyNow();
            }
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
         * 加模态
         *
         * @public
         */
        Panel.prototype.addModal = function (width, height) {
            var m = this.modal;
            if (!m) {
                this.modal = m = new egret.Shape();
                m.touchEnabled = true;
            }
            var rect = this.suiRawRect;
            var g = m.graphics;
            g.clear();
            g.beginFill(Panel.MODAL_COLOR, Panel.MODAL_ALPHA);
            var stage = egret.sys.$TempStage;
            stage.on("resize" /* RESIZE */, this.onModalResize, this);
            width = width || stage.stageWidth;
            height = height || stage.stageHeight;
            var sx = rect.x - (width - rect.width >> 1);
            var sy = rect.y - (height - rect.height >> 1);
            g.drawRect(sx, sy, width, height);
            g.endFill();
            m.on("touchTap" /* TOUCH_TAP */, this.hide, this);
            this.addChildAt(m, 0);
            this.x = -sx;
            this.y = -sy;
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
                junyou.removeDisplay(this.modal);
            }
            egret.sys.$TempStage.off("resize" /* RESIZE */, this.onModalResize, this);
        };
        /**
         * 关闭
         *
         * @protected
         */
        Panel.prototype.hide = function () {
            junyou.toggle(this.moduleID, -1 /* HIDE */);
        };
        Object.defineProperty(Panel.prototype, "isShow", {
            get: function () {
                return this.stage != undefined && this.visible == true;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.show = function () {
            junyou.toggle(this.moduleID, 1 /* SHOW */);
        };
        /**
         * 模态颜色
         *
         * @static
         * @type {number}
         */
        Panel.MODAL_COLOR = 0x0;
        /**
         * 模态透明度
         *
         * @static
         * @type {number}
         */
        Panel.MODAL_ALPHA = 0.8;
        return Panel;
    }(egret.Sprite));
    junyou.Panel = Panel;
    __reflect(Panel.prototype, "junyou.Panel", ["junyou.SuiDataCallback", "junyou.IAsyncPanel", "egret.DisplayObject", "junyou.IAsync", "junyou.IModulePanel"]);
    junyou.expand(Panel, junyou.FHost, "addReadyExecute");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var View = (function (_super) {
        __extends(View, _super);
        function View(key, className) {
            var _this = _super.call(this) || this;
            junyou.singleton(junyou.SuiResManager).createComponents(key, className, _this);
            return _this;
        }
        return View;
    }(egret.Sprite));
    junyou.View = View;
    __reflect(View.prototype, "junyou.View");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    var Flip = (function (_super) {
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
            junyou.removeDisplay(frontMask);
            front.mask = null;
            backCon.addChild(back);
            back.mask = backMask;
            back.scaleX = -1;
            backMask.scaleX = -1;
            junyou.removeDisplay(backMask);
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
            if (corner == (corner & this.sCorner)) {
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
            var pt = junyou.Temp.EgretPoint;
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
            junyou.removeDisplay(frontMask);
            junyou.removeDisplay(backCon);
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
    junyou.Flip = Flip;
    __reflect(Flip.prototype, "junyou.Flip");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 图片
     * 外部加载
     * @pb
     *
     */
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image() {
            var _this = _super.call(this) || this;
            _this.on("addedToStage" /* ADDED_TO_STAGE */, _this.addedToStage, _this);
            _this.on("removedFromStage" /* REMOVED_FROM_STAGE */, _this.removedFromStage, _this);
            return _this;
        }
        Image.prototype.addedToStage = function () {
            if (this.uri) {
                var res = junyou.ResourceManager.getTextureRes(this.uri, this.noWebp);
                if (res) {
                    res.bind(this);
                    res.load();
                }
            }
        };
        Image.prototype.removedFromStage = function () {
            if (this.uri) {
                var res = junyou.ResourceManager.getResource(this.uri);
                if (res) {
                    res.loose(this);
                }
            }
        };
        Object.defineProperty(Image.prototype, "source", {
            /**
             * 设置资源标识
             */
            set: function (value) {
                if (this.uri == value)
                    return;
                if (this.uri) {
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
    junyou.Image = Image;
    __reflect(Image.prototype, "junyou.Image");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var ListItemRenderer = (function (_super) {
        __extends(ListItemRenderer, _super);
        function ListItemRenderer() {
            var _this = _super.call(this) || this;
            _this._defaultWidth = 5;
            _this._defalutHeight = 5;
            _this._oldWidth = -1;
            _this._oldHeight = -1;
            _this.inited = false;
            _this._visible = true;
            return _this;
        }
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
        ListItemRenderer.prototype.bindComponent = function () {
            if (!this._skin) {
                if (this.skinlib && this.skinClass) {
                    this.skin = junyou.singleton(junyou.SuiResManager).createDisplayObject(this.skinlib, this.skinClass);
                }
            }
            else {
                this.inited = true;
            }
        };
        ListItemRenderer.prototype.onTouchTap = function () {
            this.dispatch(-1001 /* ITEM_TOUCH_TAP */);
            this.dispatchEventWith("touchTap" /* TOUCH_TAP */);
        };
        ListItemRenderer.prototype.$setData = function (value) {
            this._data = value;
            if (!this.inited) {
                this.bindComponent();
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
            //移除之前的事件监听
            this.removeSkinListener(this._skin);
            this._skin = value;
            this.$setVisible(value.visible);
            value.touchEnabled = true;
            this.addSkinListener(this._skin);
            var c = this._container;
            if (c) {
                c.addChild(value);
            }
            this.bindComponent();
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
        ListItemRenderer.prototype.dispatch = function (type, bubbles, data, cancelable) {
            var s = this._skin;
            if (s) {
                s.dispatch(type, bubbles, data, cancelable);
            }
            return _super.prototype.dispatch.call(this, type, bubbles, data, cancelable);
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
                junyou.ViewController.prototype.removeSkinListener.call(this, skin);
            }
        };
        ListItemRenderer.prototype.addSkinListener = function (skin) {
            if (skin) {
                skin.on("touchTap" /* TOUCH_TAP */, this.onTouchTap, this);
                junyou.ViewController.prototype.addSkinListener.call(this, skin);
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
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ListItemRenderer.prototype.startSync = function () {
        };
        return ListItemRenderer;
    }(egret.EventDispatcher));
    junyou.ListItemRenderer = ListItemRenderer;
    __reflect(ListItemRenderer.prototype, "junyou.ListItemRenderer", ["junyou.ListItemRender", "egret.EventDispatcher", "junyou.SelectableComponents"]);
    junyou.expand(ListItemRenderer, junyou.ViewController, "addReadyExecute", "addDepend", "stageHandler");
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 为已布局好的render提供List功能
     *
     * @export
     * @class MPageList
     * @extends {PageList}
     */
    var MPageList = (function (_super) {
        __extends(MPageList, _super);
        function MPageList() {
            var _this = _super.call(this, null) || this;
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
            this.doRenderListItem(0, dataLen - 1);
        };
        MPageList.prototype.addItem = function (item, index) {
            var list = this._list;
            var idx = list.indexOf(item);
            if (idx == -1) {
                idx = list.length;
                list[idx] = item;
                item.on(-1001 /* ITEM_TOUCH_TAP */, this.touchItemrender, this);
            }
            item.index = index == undefined ? idx : index;
            this._viewCount = list.length;
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
        };
        MPageList.prototype.childSizeChange = function () { };
        MPageList.prototype.reCalc = function () { };
        return MPageList;
    }(junyou.PageList));
    junyou.MPageList = MPageList;
    __reflect(MPageList.prototype, "junyou.MPageList");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 翻页，一次手势翻一页
     *
     * @export
     * @class PageScroller
     * @extends {Scroller}
     */
    var PageScroller = (function (_super) {
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
        PageScroller.prototype.onTargetTouchBegin = function (e) {
            if (this._scrollType == 0) {
                this._firstTouchPos = e.stageY;
            }
            else {
                this._firstTouchPos = e.stageX;
            }
            _super.prototype.onTargetTouchBegin.call(this, e);
        };
        PageScroller.prototype.endTouchContent = function (e) {
            var _content = this._content;
            var stage = _content.stage || egret.sys.$TempStage;
            stage.off("touchMove" /* TOUCH_MOVE */, this.moveOnContent, this);
            _content.off("touchEnd" /* TOUCH_END */, this.endTouchContent, this);
            _content.off("touchReleaseOutside" /* TOUCH_RELEASE_OUTSIDE */, this.endTouchContent, this);
            var now = junyou.Global.now;
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
            this._lastFrameTime = junyou.Global.now;
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
            var now = junyou.Global.now;
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
    }(junyou.Scroller));
    junyou.PageScroller = PageScroller;
    __reflect(PageScroller.prototype, "junyou.PageScroller");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    var ClassFactory = (function () {
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
    junyou.ClassFactory = ClassFactory;
    __reflect(ClassFactory.prototype, "junyou.ClassFactory");
    /**
     * 回收池
     * @author 3tion
     *
     */
    var RecyclablePool = (function () {
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
            }
            if (typeof ins.onSpawn === "function") {
                ins.onSpawn();
            }
            if (true) {
                ins._insid = _recid++;
            }
            return ins;
        };
        /**
         * 回收
         */
        RecyclablePool.prototype.recycle = function (t) {
            var pool = this._pool;
            var idx = pool.indexOf(t);
            if (!~idx) {
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
    junyou.RecyclablePool = RecyclablePool;
    __reflect(RecyclablePool.prototype, "junyou.RecyclablePool");
    if (true) {
        var _recid = 0;
    }
    function recyclable(clazz, addInstanceRecycle) {
        var pool = clazz._pool;
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
                if (pt.recycle == undefined) {
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
    junyou.recyclable = recyclable;
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    function singleton(clazz) {
        var instance = clazz._instance;
        if (!instance) {
            instance = new clazz;
            Object.defineProperty(clazz, "_instance", {
                value: instance
            });
        }
        return instance;
    }
    junyou.singleton = singleton;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 图片字字库
     * Key为图片文字文件名（不带扩展名）
     * Value为egret.Texture
     *
     * @export
     * @class ArtWord
     * @author 3tion
     */
    var ArtWord = (function () {
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
            junyou.refreshTexs(suiData, this);
        };
        return ArtWord;
    }());
    junyou.ArtWord = ArtWord;
    __reflect(ArtWord.prototype, "junyou.ArtWord");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 平台数据
     * @author 3tion
     *
     */
    var AuthData = (function () {
        function AuthData() {
            /**
             * 认证次数
             *
             * @type {number}
             * @memberOf AuthData
             */
            this.count = 0;
        }
        AuthData.prototype.toURLString = function () {
            return "pid=" + encodeURIComponent(this.pid) + "&puid=" + encodeURIComponent(this.puid) +
                "&sid=" + this.sid + "&sign=" + encodeURIComponent(this.sign);
        };
        return AuthData;
    }());
    junyou.AuthData = AuthData;
    __reflect(AuthData.prototype, "junyou.AuthData");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于固定一些组件的宽度和高度，让其等于取出的值
     *
     * @export
     * @param {Object} define                       定义
     * @param {{ size: egret.Rectangle }} view
     * @returns
     */
    function bindSize(define, view) {
        Object.defineProperties(define, {
            width: {
                get: function () {
                    return view.size.width;
                },
                enumerable: true,
                configurable: true
            },
            height: {
                get: function () {
                    return view.size.height;
                },
                enumerable: true,
                configurable: true
            }
        });
    }
    junyou.bindSize = bindSize;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
        if (!("refreshBMD" in thisObj)) {
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
    junyou.refreshTexs = refreshTexs;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * 用于处理SuiData中的纹理加载
     * @export
     * @class SuiBmd
     * @author gushuai
     */
    var SuiBmd = (function () {
        function SuiBmd(uri, url) {
            this.textures = [];
            this.bmdState = 0 /* UNREQUEST */;
            /**
             * 最大纹理加载失败次数
             *
             * @protected
             * @memberof SuiBmd
             */
            this._maxErrCount = 3;
            /**
             * 使用计数
             */
            this.using = 0;
            this.lastUseTime = 0;
            /**
             * 未加载的时候，请求的位图
             */
            this.loading = [];
            this._uri = uri;
            this._url = url;
        }
        Object.defineProperty(SuiBmd.prototype, "url", {
            get: function () {
                return this._url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuiBmd.prototype, "isStatic", {
            get: function () {
                return this.using > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuiBmd.prototype, "resID", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        SuiBmd.prototype.loadBmd = function () {
            if (this.bmdState <= 0 /* UNREQUEST */) {
                RES.getResByUrl(this._url, this.checkBitmap, this, "image" /* TYPE_IMAGE */);
                this.bmdState = 1 /* REQUESTING */;
            }
        };
        SuiBmd.prototype.checkBitmap = function (tex, key) {
            if (!tex) {
                //加载失败尝试3次重新加载资源
                this.bmdState = -1 /* FAILED */;
                var _errCount = ~~this._errCount;
                _errCount++;
                this._errCount = _errCount;
                if (_errCount < this._maxErrCount) {
                    this.loadBmd();
                }
                else {
                    junyou.ThrowError("\u5C1D\u8BD5" + _errCount + "\u6B21\u52A0\u8F7D\u8D44\u6E90[" + this._url + "]\u5931\u8D25");
                    junyou.dispatch(-1070 /* SuiBmdLoadFailed */, this._uri);
                }
                return;
            }
            var bmd = tex.bitmapData;
            var imgs = this.textures;
            this.bmd = bmd;
            for (var _i = 0, imgs_1 = imgs; _i < imgs_1.length; _i++) {
                var tex_1 = imgs_1[_i];
                tex_1._bitmapData = bmd;
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
        };
        SuiBmd.prototype.checkExpire = function (expiredUseTime) {
            if (this.bmdState != 0 /* UNREQUEST */ && !this.using && this.lastUseTime < expiredUseTime) {
                this.dispose();
            }
        };
        SuiBmd.prototype.dispose = function () {
            var bmd = this.bmd;
            this.bmdState = 0 /* UNREQUEST */;
            if (bmd) {
                bmd.$dispose();
                this.bmd = undefined;
                RES.destroyRes(this._url);
            }
        };
        return SuiBmd;
    }());
    junyou.SuiBmd = SuiBmd;
    __reflect(SuiBmd.prototype, "junyou.SuiBmd", ["junyou.IResource"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于加载和存储fla导出的ui数据和位图
     * @author 3tion
     *
     */
    var SuiData = (function () {
        function SuiData() {
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
        }
        SuiData.prototype.createBmpLoader = function (ispng, textures) {
            var file = "d" + (ispng ? ".png" /* PNG */ : ".jpg" /* JPG */);
            //增加一个skin前缀
            var uri = "skin/" + junyou.ConfigUtils.getSkinPath(this.key, file);
            var tmp = junyou.ResourceManager.get(uri, this.noRes, this, uri, file, textures);
            ispng ? this.pngbmd = tmp : this.jpgbmd = tmp;
        };
        SuiData.prototype.noRes = function (uri, file, textures) {
            var url = junyou.ConfigUtils.getSkinFile(this.key, file) + junyou.Global.webp;
            var tmp = new junyou.SuiBmd(uri, url);
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
            var bin = {};
            var count = 0;
            //检查bmd状态
            this.jpgbmd && !this.checkRefreshBmp(bin, true) && count++;
            this.pngbmd && !this.checkRefreshBmp(bin) && count++;
            if (count) {
                bin.count = count;
                bin.callback = callback;
                bin.refreshBMD = refreshBMD;
            }
            else {
                callback.execute(true);
            }
            function refreshBMD() {
                var count = this.count;
                if (!--count) {
                    this.callback.execute(true);
                }
                else {
                    this.count = count;
                }
            }
        };
        return SuiData;
    }());
    junyou.SuiData = SuiData;
    __reflect(SuiData.prototype, "junyou.SuiData");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var Texture = egret.Texture;
    junyou.DATA_FILE = "s.json";
    /**
     * 用于管理位图和数据
     * @author 3tion
     *
     */
    var SuiResManager = (function () {
        function SuiResManager() {
            this._suiDatas = {};
            this._urlKey = {};
            this.initInlineCreators();
            // ResourceManager.addChecker(this);
        }
        SuiResManager.prototype.initInlineCreators = function () {
            this._creators = (_a = {},
                _a[3 /* Button */] = junyou.ButtonCreator,
                _a[6 /* ShapeNumber */] = junyou.ArtTextCreator,
                _a[5 /* ScaleBitmap */] = junyou.ScaleBitmapCreator,
                _a[7 /* NumericStepper */] = junyou.NumericStepperCreator,
                _a[8 /* Slider */] = junyou.SliderCreator,
                _a[9 /* ScrollBar */] = junyou.ScrollBarCreator,
                _a[10 /* ProgressBar */] = junyou.ProgressBarCreator,
                _a[11 /* SlotBg */] = junyou.ScaleBitmapCreator,
                _a[12 /* ShareBmp */] = junyou.ShareBitmapCreator,
                _a[13 /* Slot */] = junyou.SlotCreator,
                _a[19 /* MovieClip */] = junyou.MovieClipCreator,
                _a[20 /* MCButton */] = junyou.MCButtonCreator,
                _a[21 /* MCProgress */] = junyou.MCProgressCreator,
                _a);
            this.sharedTFCreator = new junyou.TextFieldCreator();
            var _a;
        };
        SuiResManager.prototype.getData = function (key) {
            return this._suiDatas[key];
        };
        /**
         * 加载数据
         */
        SuiResManager.prototype.loadData = function (key, callback) {
            var suiData = this._suiDatas[key];
            if (!suiData) {
                suiData = new junyou.SuiData();
                suiData.key = key;
                this._suiDatas[key] = suiData;
            }
            var state = suiData.state;
            if (state == -1 /* FAILED */) {
                callback.suiDataFailed(suiData);
            }
            else if (state == 2 /* COMPLETE */) {
                callback.suiDataComplete(suiData);
            }
            else {
                var callbacks = suiData.callbacks;
                if (state == 0 /* UNREQUEST */) {
                    suiData.state = 1 /* REQUESTING */;
                    suiData.callbacks = callbacks = [];
                    //先加载配置
                    var url = junyou.ConfigUtils.getSkinFile(key, junyou.DATA_FILE);
                    suiData.url = url;
                    this._urlKey[url] = suiData;
                    RES.getResByUrl(url, this.checkData, this);
                }
                callbacks.pushOnce(callback);
            }
        };
        /**
         *
         * 直接将已经加载好的内置数据，和key进行绑定
         * @param {string} key
         * @param {*} data
         */
        SuiResManager.prototype.setInlineData = function (key, data) {
            var url = junyou.ConfigUtils.getSkinFile(key, junyou.DATA_FILE);
            var suiData = this._urlKey[url];
            if (!suiData) {
                suiData = new junyou.SuiData();
                suiData.key = key;
                suiData.url = url;
                this._suiDatas[key] = suiData;
            }
            this._initSuiData(data, suiData);
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
            else {
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
         * 数据加载完成
         */
        SuiResManager.prototype.checkData = function (data, key) {
            var suiData = this._urlKey[key];
            if (!data) {
                suiData.state = -1 /* FAILED */;
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
                if (type == 15 /* ArtWord */) {
                    var fonts = suiData.fonts;
                    for (var i = 0; i < len; i++) {
                        var linkName = nameData[i];
                        var dat = comData[i];
                        var fontLib = new junyou.ArtWord(linkName);
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
                            var name_7 = nameData[i];
                            var dat = comData[i];
                            var creator = new ref;
                            creator.parseData(null, suiData);
                            if (dat) {
                                creator.parseSelfData(dat);
                                creator.parseSize(sizeData[i]);
                            }
                            lib[name_7] = creator;
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
                    var bc = new junyou.BitmapCreator(suiData);
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
                    return creator.get();
                }
                else if (true) {
                    junyou.ThrowError("\u6CA1\u6709\u5728[" + suiData.key + "]\u627E\u5230\u5BF9\u5E94\u7EC4\u4EF6[" + className + "]");
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
                    return creator.get();
                }
                else if (true) {
                    junyou.ThrowError("createElement\u65F6\uFF0C\u6CA1\u6709\u627E\u5230\u5BF9\u5E94\u7EC4\u4EF6\uFF0C\u7D22\u5F15\uFF1A[" + +data[0] + "]");
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
            if (data[0]) {
                dis.name = data[0];
            }
            var x = data[1], y = data[2], w = data[3], h = data[4], rot = data[5], alpha = data[6];
            dis.suiRawRect = new egret.Rectangle(x, y, w, h);
            if (Array.isArray(rot)) {
                var a = rot[0], b = rot[1], c = rot[2], d = rot[3];
                var matrix = dis.matrix;
                matrix.setTo(a, b, c, d, x, y);
                dis.$setMatrix(matrix, true);
            }
            else {
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
        };
        // /**
        //  * 
        //  * 进行资源检查
        //  * @param {number} expiredUseTime
        //  * 
        //  * @memberOf ResourceChecker
        //  */
        // public resCheck(expiredUseTime: number) {
        //     const suiDatas = this._suiDatas;
        //     for (let key in suiDatas) {
        //         let suiData = suiDatas[key];
        //         let bmd = suiData.pngbmd;
        //         if (bmd) {
        //             bmd.checkExpire(expiredUseTime);
        //         }
        //         bmd = suiData.jpgbmd;
        //         if (bmd) {
        //             bmd.checkExpire(expiredUseTime);
        //         }
        //     }
        // }
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
                    junyou.ThrowError("\u6CA1\u6709\u6B63\u786E\u521B\u5EFA\u539F\u4EF6\uFF0C\u7C7B\u578B\uFF1A" + type + "\uFF0C\u6570\u636E\uFF1A" + JSON.stringify(data));
                }
            }
            var name = baseData[0];
            if (name) {
                view[name] = ele;
            }
            return ele;
        };
        SuiResManager.prototype.getElement = function (suiData, data) {
            var type = data[0], bd = data[1], sd = data[2], lib = data[3];
            switch (type) {
                case 1 /* Text */:
                    var tc = new junyou.TextFieldCreator();
                    tc.setBaseData(bd);
                    tc.parseSelfData(sd);
                    return tc.get();
                case 0 /* Image */:
                    var bg = new junyou.BitmapCreator(suiData);
                    bg.parseData(data, suiData);
                    return bg.get();
                case 16 /* Sprite */:
                    var sp = new egret.Sprite();
                    SuiResManager.initBaseData(sp, bd);
                    return sp;
                case 17 /* ImageLoader */:
                    var il = new junyou.Image();
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
                        var v = new junyou.View(libKey, className);
                        SuiResManager.initBaseData(v, bd);
                        return v;
                    }
                    else {
                        var source = suiData.sourceComponentData;
                        if (source) {
                            var sourceData = source[type];
                            if (sourceData) {
                                var names = sourceData[0]; //名字列表
                                if (names) {
                                    var idx = sd;
                                    var name_8 = names[idx];
                                    if (name_8) {
                                        return this.createDisplayObject(libKey, name_8, bd);
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
    junyou.SuiResManager = SuiResManager;
    __reflect(SuiResManager.prototype, "junyou.SuiResManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 艺术字
     */
    var ArtText = (function (_super) {
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
                        junyou.ThrowError("\u4F20\u5165\u4E86\u7EB9\u7406\u4E2D\u6CA1\u6709\u7684\u6570\u636E[" + key + "]");
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
            switch (this._align) {
                case 4 /* TOP */:
                    children.forEach(function (bmp) {
                        bmp.y = 0;
                    });
                    break;
                case 12 /* BOTTOM */:
                    children.forEach(function (bmp) {
                        bmp.y = _maxHeight - bmp.height;
                    });
                    break;
                case 8 /* MIDDLE */:
                    children.forEach(function (bmp) {
                        bmp.y = _maxHeight - bmp.height >> 1;
                    });
                    break;
            }
        };
        ArtText.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            junyou.removeDisplay(this);
        };
        return ArtText;
    }(junyou.Component));
    junyou.ArtText = ArtText;
    __reflect(ArtText.prototype, "junyou.ArtText");
    /**
     *
     * @author gushuai
     *
     */
    var ArtTextCreator = (function (_super) {
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
            junyou.refreshTexs(suiData, this);
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
                bmd.lastUseTime = junyou.Global.now;
            }
        };
        return ArtTextCreator;
    }(junyou.BaseCreator));
    junyou.ArtTextCreator = ArtTextCreator;
    __reflect(ArtTextCreator.prototype, "junyou.ArtTextCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 获取XMLHttpRequest对象
     *
     * @export
     * @returns
     */
    function getXHR() {
        junyou.getXHR = window.XMLHttpRequest ? function () { return new XMLHttpRequest; } : function () { return new ActiveXObject("MSXML2.XMLHTTP"); };
        return junyou.getXHR();
    }
    junyou.getXHR = getXHR;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * 新版使用MC的按钮，减少制作按钮的难度
     *
     *
     * @export
     * @class MCButton
     * @extends {Button}
     */
    var MCButton = (function (_super) {
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
    }(junyou.Button));
    junyou.MCButton = MCButton;
    __reflect(MCButton.prototype, "junyou.MCButton");
    MCButton.prototype.addChild = junyou.Component.prototype.addChild;
    /**
     * MC按钮创建器
     *
     * @export
     * @class MCButtonCreator
     * @extends {BaseCreator<MCButton>}
     */
    var MCButtonCreator = (function (_super) {
        __extends(MCButtonCreator, _super);
        function MCButtonCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MCButtonCreator.prototype.parseSelfData = function (data) {
            var suiData = this._suiData;
            var framesData = junyou.MovieClipCreator.prototype.$getFramesData(data);
            this._createT = function () { return new MCButton(new junyou.MovieClip(data, framesData, suiData)); };
        };
        return MCButtonCreator;
    }(junyou.BaseCreator));
    junyou.MCButtonCreator = MCButtonCreator;
    __reflect(MCButtonCreator.prototype, "junyou.MCButtonCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var MovieClip = (function (_super) {
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
                var sm_1 = junyou.singleton(junyou.SuiResManager);
                comps = compsData.map(function (compData) { return sm_1.createComponent(compData, suiData, _this); });
            }
            else {
                comps = junyou.Temp.EmptyArray;
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
            this._nt = junyou.Global.now + this.timePerFrame;
            this.on("enterFrame" /* ENTER_FRAME */, this.doRender, this);
        };
        MovieClip.prototype.doRender = function () {
            var now = junyou.Global.now;
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
            if (frameData && frameData.key != this.currentFrame) {
                var dict = this.compData;
                var sm = junyou.singleton(junyou.SuiResManager);
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
                    if (idx == -1) {
                        comp = sm.createComponent(pData, suiData, this);
                    }
                    else {
                        comp = dict[idx];
                        this.addChild(comp);
                        if (pData) {
                            junyou.SuiResManager.initBaseData(comp, pData);
                        }
                        if (comp instanceof egret.TextField) {
                            if (!textData) {
                                textData = comp.rawTextData;
                            }
                            sm.sharedTFCreator.initTextData(comp, textData);
                        }
                    }
                }
            }
        };
        return MovieClip;
    }(junyou.Component));
    junyou.MovieClip = MovieClip;
    __reflect(MovieClip.prototype, "junyou.MovieClip");
    /**
     * MC创建器
     *
     * @export
     * @class MovieClipCreator
     * @extends {BaseCreator<MovieClip>}
     */
    var MovieClipCreator = (function (_super) {
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
    }(junyou.BaseCreator));
    junyou.MovieClipCreator = MovieClipCreator;
    __reflect(MovieClipCreator.prototype, "junyou.MovieClipCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var NumericStepper = (function (_super) {
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
                    junyou.ThrowError("最小值需大于0");
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
                    junyou.ThrowError("最大值需大于0");
            },
            enumerable: true,
            configurable: true
        });
        return NumericStepper;
    }(junyou.Component));
    junyou.NumericStepper = NumericStepper;
    __reflect(NumericStepper.prototype, "junyou.NumericStepper");
    var NumericStepperCreator = (function (_super) {
        __extends(NumericStepperCreator, _super);
        function NumericStepperCreator() {
            return _super.call(this) || this;
        }
        NumericStepperCreator.prototype.parseSelfData = function (data) {
            this.uiData = data;
            var txtCreator = new junyou.TextFieldCreator();
            this.txtCreator = txtCreator;
            var data0 = data[0], data1 = data[1];
            txtCreator.setBaseData(data0[1]);
            txtCreator.parseSelfData(data0[2]);
            var scale9Creator = new junyou.ScaleBitmapCreator();
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
                    var bc = new junyou.ButtonCreator();
                    bc.bindSuiData(_suiData);
                    bc.parseSelfData(sourceComponentData31[dat[2]]);
                    bc.setBaseData(dat[1]);
                    btnCreator.push(bc);
                }
            }
            this._createT = this.createNumericStepper;
            this.suiManager = junyou.singleton(junyou.SuiResManager);
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
    }(junyou.BaseCreator));
    junyou.NumericStepperCreator = NumericStepperCreator;
    __reflect(NumericStepperCreator.prototype, "junyou.NumericStepperCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 进度条
     * @author 3tion
     *
     */
    var ProgressBar = (function (_super) {
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
                    junyou.ThrowError("进度条最大宽度不应小等于0");
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
        /*更新进度条显示*/
        ProgressBar.prototype.updateBar = function () {
            var bar = this.bar;
            var v = this._value * this._barWidth / this._maxValue;
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
    }(junyou.Component));
    junyou.ProgressBar = ProgressBar;
    __reflect(ProgressBar.prototype, "junyou.ProgressBar");
    /**
     * 进度条创建
     *
     */
    var ProgressBarCreator = (function (_super) {
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
    }(junyou.BaseCreator));
    junyou.ProgressBarCreator = ProgressBarCreator;
    __reflect(ProgressBarCreator.prototype, "junyou.ProgressBarCreator");
    /**
     * MC进度条创建
     *
     * @export
     * @class MCProgressCreator
     * @extends {BaseCreator<ProgressBar>}
     */
    var MCProgressCreator = (function (_super) {
        __extends(MCProgressCreator, _super);
        function MCProgressCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MCProgressCreator.prototype.parseSelfData = function (data) {
            var suiData = this._suiData;
            var framesData = junyou.MovieClipCreator.prototype.$getFramesData(data);
            this._createT = function () {
                var mc = new junyou.MovieClip(data, framesData, suiData);
                var bar = new ProgressBar();
                bar.addChild(mc);
                bar.skin = mc;
                return bar;
            };
        };
        return MCProgressCreator;
    }(junyou.BaseCreator));
    junyou.MCProgressCreator = MCProgressCreator;
    __reflect(MCProgressCreator.prototype, "junyou.MCProgressCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * 用于处理从Flash中导出的带九宫缩放的位图
     * @export
     * @class ScaleBitmap
     * @extends {egret.Bitmap}
     * @author gushuai
     */
    var ScaleBitmap = (function (_super) {
        __extends(ScaleBitmap, _super);
        function ScaleBitmap() {
            return _super.call(this) || this;
        }
        /**
        * @private
        *
        * @param context
        */
        ScaleBitmap.prototype.$render = function () {
            var image = this.$Bitmap[0 /* bitmapData */];
            if (!image) {
                return;
            }
            var values = this.$Bitmap;
            egret.sys.BitmapNode.$updateTextureData(this.$renderNode, this.texture.bitmapData, values[2 /* bitmapX */], values[3 /* bitmapY */], values[4 /* bitmapWidth */], values[5 /* bitmapHeight */], values[6 /* offsetX */], values[7 /* offsetY */], values[8 /* textureWidth */], values[9 /* textureHeight */], this.width, this.height, values[13 /* sourceWidth */], values[14 /* sourceHeight */], this.scale9Grid, this.$fillMode, values[10 /* smoothing */]);
        };
        return ScaleBitmap;
    }(egret.Bitmap));
    junyou.ScaleBitmap = ScaleBitmap;
    __reflect(ScaleBitmap.prototype, "junyou.ScaleBitmap");
    var ScaleBitmapCreator = (function (_super) {
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
                var bitmap = new ScaleBitmap();
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
    }(junyou.BitmapCreator));
    junyou.ScaleBitmapCreator = ScaleBitmapCreator;
    __reflect(ScaleBitmapCreator.prototype, "junyou.ScaleBitmapCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var ScrollBar = (function (_super) {
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
    }(junyou.Component));
    junyou.ScrollBar = ScrollBar;
    __reflect(ScrollBar.prototype, "junyou.ScrollBar");
    var ScrollBarCreator = (function (_super) {
        __extends(ScrollBarCreator, _super);
        function ScrollBarCreator() {
            return _super.call(this) || this;
        }
        ScrollBarCreator.prototype.parseSelfData = function (data) {
            this.uiData = data;
            this.suiManager = junyou.singleton(junyou.SuiResManager);
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
    }(junyou.BaseCreator));
    junyou.ScrollBarCreator = ScrollBarCreator;
    __reflect(ScrollBarCreator.prototype, "junyou.ScrollBarCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var ShareBitmapCreator = (function (_super) {
        __extends(ShareBitmapCreator, _super);
        function ShareBitmapCreator() {
            return _super.call(this) || this;
        }
        ShareBitmapCreator.prototype.parseSelfData = function (data) {
            _super.prototype.parseSelfData.call(this, data[0][2]);
        };
        return ShareBitmapCreator;
    }(junyou.BitmapCreator));
    junyou.ShareBitmapCreator = ShareBitmapCreator;
    __reflect(ShareBitmapCreator.prototype, "junyou.ShareBitmapCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var Slider = (function (_super) {
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
            this.tipTxt.textAlign = egret.HorizontalAlign.CENTER;
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
    }(junyou.Component));
    junyou.Slider = Slider;
    __reflect(Slider.prototype, "junyou.Slider");
    var SliderCreator = (function (_super) {
        __extends(SliderCreator, _super);
        function SliderCreator() {
            return _super.call(this) || this;
        }
        SliderCreator.prototype.parseSelfData = function (data) {
            this.uiData = data;
            this.txtCreator = new junyou.TextFieldCreator();
            this.scale9Creator = new junyou.ScaleBitmapCreator();
            this.bitmapCreator = new junyou.BitmapCreator(this._suiData);
            this.suiManager = junyou.singleton(junyou.SuiResManager);
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
    }(junyou.BaseCreator));
    junyou.SliderCreator = SliderCreator;
    __reflect(SliderCreator.prototype, "junyou.SliderCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 格位基本类
     * @author 3tion
     */
    var Slot = (function (_super) {
        __extends(Slot, _super);
        function Slot() {
            var _this = _super.call(this) || this;
            _this._count = 1;
            _this._countShow = 1 /* Show */;
            _this.icon = new junyou.Image();
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
                    junyou.removeDisplay(old);
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
                junyou.Global.callLater(this.refreshDisplay, 0, this);
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
        Slot.prototype.awake = function () {
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
        Slot.getCountString = function (count) { return count < 1 ? "" : count < 10000 ? count + "" : junyou.LangUtil.getMsg("$_wan", Math.floor(count / 10000)); };
        return Slot;
    }(junyou.Component));
    junyou.Slot = Slot;
    __reflect(Slot.prototype, "junyou.Slot");
    /**
     * 格位创建器
     *
     * @export
     * @class SlotCreator
     * @extends {BaseCreator<Slot>}
     * @author pb
     */
    var SlotCreator = (function (_super) {
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
    }(junyou.BaseCreator));
    junyou.SlotCreator = SlotCreator;
    __reflect(SlotCreator.prototype, "junyou.SlotCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 文本框创建器
     * @author
     *
     */
    var TextFieldCreator = (function (_super) {
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
            var color = junyou.ColorUtil.getColorValue(data[3]);
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
                    strokeColor = junyou.ColorUtil.getColorValue(strokeColor);
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
    }(junyou.BaseCreator));
    junyou.TextFieldCreator = TextFieldCreator;
    __reflect(TextFieldCreator.prototype, "junyou.TextFieldCreator");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
    var BGContainer = (function (_super) {
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
            if (sw > bw || sh > bh) {
                var result = this.getFixedNarrow(sw, sh, bw, bh, true);
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
            var pt = junyou.Temp.SharedPoint1;
            junyou.Layout.getLayoutPos(dw, dh, sw, sh, this._layout, pt);
            host.x = pt.x;
            host.y = pt.y;
            this.layoutAll();
        };
        return BGContainer;
    }(junyou.LayoutContainer));
    junyou.BGContainer = BGContainer;
    __reflect(BGContainer.prototype, "junyou.BGContainer");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
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
            case 8 /* MIDDLE */:// 不支持非innerV
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
            case 2 /* CENTER */:// 不支持非innerH
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
            true && junyou.ThrowError("\u6267\u884CtipLayout\u64CD\u4F5C\u65F6\u6CA1\u6709\u8BBE\u7F6E\u53EF\u4EE5\u663E\u793A\u7684\u5BF9\u8C61");
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
            parentWidth = parent.width;
            parentHeight = parent.height;
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
    junyou.Layout = {
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
    };
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 使用http进行通信的网络服务
     * @author 3tion
     *
     */
    var HttpNetService = (function (_super) {
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
            junyou.NetService._ins = _this;
            _this._unsendRequest = [];
            _this._sendingList = [];
            _this._loader = junyou.getXHR();
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
            junyou.TimerUtil.addCallback(200, this.checkUnsend, this);
            var loader = this._loader;
            loader.onreadystatechange = this.onReadyStateChange.bind(this);
            loader.ontimeout = this.errorHandler.bind(this);
        };
        /**
        * @protected
        */
        HttpNetService.prototype.onReadyStateChange = function () {
            var xhr = this._loader;
            if (xhr.readyState == 4) {
                var ioError = (xhr.status >= 400 || xhr.status == 0);
                // var url = this._actionUrl;
                var self = this;
                setTimeout(function () {
                    if (ioError) {
                        self.errorHandler();
                    }
                    else {
                        self.complete();
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
            if (this._unsendRequest.length || junyou.Global.now > this._nextAutoTime) {
                this.trySend();
            }
        };
        HttpNetService.prototype._send = function (cmd, data, msgType) {
            //没有同协议的指令，新增数据
            var pdata = junyou.recyclable(junyou.NetData);
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
            // var sendPool = this._sendDataPool;
            var unsend = this._unsendRequest;
            var sending = this._sendingList;
            // sendBuffer.writeUTFBytes(this._authData.sessionID);
            // sendBuffer.writeDouble(this._lastMid);
            for (var i = 0, len = unsend.length; i < len; i++) {
                var pdata = unsend[i];
                this.writeToBuffer(sendBuffer, pdata);
                sending[i] = pdata;
            }
            var pcmdList = this._pcmdList;
            for (var _i = 0, pcmdList_3 = pcmdList; _i < pcmdList_3.length; _i++) {
                var pdata = pcmdList_3[_i];
                this.writeToBuffer(sendBuffer, pdata);
                sending[i++] = pdata;
            }
            //清空被动数据
            pcmdList.length = 0;
            //清空未发送的数据
            unsend.length = 0;
            loader.send(sendBuffer.outBytes);
            //重置自动发送的时间
            this._nextAutoTime = junyou.Global.now + this._autoTimeDelay;
        };
        return HttpNetService;
    }(junyou.NetService));
    junyou.HttpNetService = HttpNetService;
    __reflect(HttpNetService.prototype, "junyou.HttpNetService");
})(junyou || (junyou = {}));
var $useDPR = true;
var dpr = 1;
if (window.$useDPR) {
    dpr = window.devicePixelRatio || 1;
    var origin = egret.sys.DefaultScreenAdapter.prototype.calculateStageSize;
    egret.sys.screenAdapter = {
        calculateStageSize: function (scaleMode, screenWidth, screenHeight, contentWidth, contentHeight) {
            var result = origin(scaleMode, screenWidth, screenHeight, contentWidth, contentHeight);
            if (scaleMode == egret.StageScaleMode.NO_SCALE) {
                result.stageHeight *= dpr;
                result.stageWidth *= dpr;
            }
            return result;
        }
    };
}
var junyou;
(function (junyou) {
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
    var MainUIContainer = (function (_super) {
        __extends(MainUIContainer, _super);
        function MainUIContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainUIContainer.prototype.onResize = function () {
            var host = this._host;
            var stage = host.stage || egret.sys.$TempStage;
            var basis = this._basis;
            var sw = stage.stageWidth, sh = stage.stageHeight, bw = basis.width, bh = basis.height;
            var dw = sw, dh = sh, lw = sw, lh = sh;
            var scale = 1;
            if (dpr != 1 || sw < bw * dpr || sh < bh * dpr) {
                var result = this.getFixedNarrow(sw, sh, bw, bh);
                dh = result.dh;
                dw = result.dw;
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
        MainUIContainer.prototype.add = function (d, type, offsetRect) {
            var raw = d.suiRawRect;
            var result = junyou.Layout.getLayoutPos(raw.width, raw.height, offsetRect.width, offsetRect.height, type);
            var dx = raw.x - offsetRect.x;
            var dy = raw.y - offsetRect.y;
            var oh = dx - result.x;
            var ov = dy - result.y;
            this.addLayout(d, type, raw, oh, ov);
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
    }(junyou.LayoutContainer));
    junyou.MainUIContainer = MainUIContainer;
    __reflect(MainUIContainer.prototype, "junyou.MainUIContainer");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    var ResizeManager = (function () {
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
            junyou.Layout.layout(dis, info.layout, info.hoffset, info.voffset, false, false, container);
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
    junyou.ResizeManager = ResizeManager;
    __reflect(ResizeManager.prototype, "junyou.ResizeManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 按钮形式的菜单
     * @author gushuai
     * (description)
     *
     * @export
     * @class SkillItemMenuRender
     * @extends {MenuBaseRender<MenuBaseVO>}
     */
    var ButtonMenuRender = (function (_super) {
        __extends(ButtonMenuRender, _super);
        function ButtonMenuRender(key, className) {
            if (key === void 0) { key = "lib"; }
            if (className === void 0) { className = "ui.btn.MenuBtn"; }
            var _this = _super.call(this) || this;
            var btn = junyou.singleton(junyou.SuiResManager).createDisplayObject(key, className);
            _this.skin = btn;
            _this.btn = btn;
            return _this;
        }
        ButtonMenuRender.prototype.$setData = function (val) {
            _super.prototype.$setData.call(this, val);
            this.btn.label = val.label;
        };
        return ButtonMenuRender;
    }(junyou.MenuBaseRender));
    junyou.ButtonMenuRender = ButtonMenuRender;
    __reflect(ButtonMenuRender.prototype, "junyou.ButtonMenuRender");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * @author gushuai
     * (description)
     *
     * @export
     * @class Menu
     * @extends {egret.Sprite}
     */
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu(style, maxRendercount) {
            var _this = _super.call(this) || this;
            _this.style = style;
            _this.uiManager = junyou.singleton(junyou.SuiResManager);
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
                junyou.removeDisplay(dis);
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
                junyou.removeDisplay(dis);
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
                    junyou.removeDisplay(this.renders[i].view);
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
    junyou.Menu = Menu;
    __reflect(Menu.prototype, "junyou.Menu");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 用于发送的网络数据<br/>
     * @author 3tion
     */
    var NetSendData = (function () {
        function NetSendData() {
        }
        NetSendData.prototype.onRecycle = function () {
            this.data = undefined;
            this.msgType = undefined;
        };
        return NetSendData;
    }());
    junyou.NetSendData = NetSendData;
    __reflect(NetSendData.prototype, "junyou.NetSendData", ["junyou.IRecyclable"]);
    /**
     * 网络数据，类似AS3项目中Stream<br/>
     * @author 3tion
     *
     */
    var NetData = (function (_super) {
        __extends(NetData, _super);
        function NetData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NetData;
    }(NetSendData));
    junyou.NetData = NetData;
    __reflect(NetData.prototype, "junyou.NetData");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 错误提示
     * @author pb
     */
    var ErrorTips = (function () {
        function ErrorTips(parent) {
            this._parent = parent;
        }
        ErrorTips.prototype.show = function (msg, color, duration, delay) {
            if (color === void 0) { color = 0xffffff; }
            if (duration === void 0) { duration = 1000; }
            if (delay === void 0) { delay = 1000; }
            var txt = new egret.TextField();
            txt.textAlign = egret.HorizontalAlign.CENTER;
            if (/<[^>]+>/.test(msg)) {
                txt.setHtmlText(msg);
            }
            else {
                txt.text = msg;
            }
            txt.alpha = 1;
            junyou.Layout.layout(txt, 10 /* MIDDLE_CENTER */);
            txt.textColor = color;
            this._parent.addChild(txt);
            var tween = junyou.Global.getTween(txt);
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
                junyou.removeDisplay(txt);
        };
        return ErrorTips;
    }());
    junyou.ErrorTips = ErrorTips;
    __reflect(ErrorTips.prototype, "junyou.ErrorTips");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 简易的ToolTip
     * 只处理字符串类型的描述
     * @author 3tion
     */
    var SimToolTip = (function (_super) {
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
            junyou.removeDisplay(this);
        };
        return SimToolTip;
    }(egret.Sprite));
    junyou.SimToolTip = SimToolTip;
    __reflect(SimToolTip.prototype, "junyou.SimToolTip", ["junyou.IToolTip"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * ToolTip的数据
     * @author 3tion
     */
    var ToolTipData = (function () {
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
                junyou.Global.clearCallLater(this.showTip, this);
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
            junyou.Global.clearCallLater(this.showTip, this);
            this.data = undefined;
            this.tooltip = undefined;
        };
        ToolTipData.prototype.checkTouch = function (e) {
            this.target.on("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            junyou.Global.callLater(this.showTip, junyou.ToolTipManager.touchTime, this);
        };
        ToolTipData.prototype.showTip = function () {
            this.target.off("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            this.tooltip.show(this.con);
        };
        ToolTipData.prototype.touchEnd = function (e) {
            this.target.off("touchEnd" /* TOUCH_END */, this.touchEnd, this);
            junyou.Global.clearCallLater(this.showTip, this);
        };
        return ToolTipData;
    }());
    junyou.ToolTipData = ToolTipData;
    __reflect(ToolTipData.prototype, "junyou.ToolTipData", ["junyou.IRecyclable"]);
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 默认的Tip
     * 手指按下控件以后，弹出Tip进行显示
     * @author 3tion
     *
     */
    var ToolTipManager = (function () {
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
                        junyou.ThrowError("没有注册ToolTip的皮肤，并且没有默认的ToolTip");
                    }
                    return false;
                }
            }
            var map = ToolTipManager._map;
            var data = map.get(dis);
            if (!data) {
                data = junyou.recyclable(junyou.ToolTipData);
                map.set(dis, data);
            }
            if (!container) {
                container = junyou.GameEngine.instance.getLayer(9000 /* Tip */);
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
    junyou.ToolTipManager = ToolTipManager;
    __reflect(ToolTipManager.prototype, "junyou.ToolTipManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 多选分组
     *
     * @export
     * @class CheckBoxGroup
     * @extends {Group}
     * @author 3tion
     */
    var CheckBoxGroup = (function (_super) {
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
            if (!item) {
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
    }(junyou.Group));
    junyou.CheckBoxGroup = CheckBoxGroup;
    __reflect(CheckBoxGroup.prototype, "junyou.CheckBoxGroup");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     * @author 3tion
     *
     */
    var NetRouter = (function () {
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
            for (var i = 0; i < idx; i++) {
                var bin = dispatchList[i];
                try {
                    bin.handler(data);
                }
                catch (e) {
                    if (true) {
                        junyou.ThrowError("\u6267\u884C\u7F51\u7EDC\u56DE\u8C03\u65B9\u6CD5\u51FA\u9519" + JSON.stringify(data), e);
                    }
                }
                if (bin.once) {
                    this.remove(cmd, bin.handler);
                }
                if (data.stopPropagation) {
                    break;
                }
            }
            data.recycle();
        };
        return NetRouter;
    }());
    junyou.NetRouter = NetRouter;
    __reflect(NetRouter.prototype, "junyou.NetRouter");
    ;
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * 绑定按钮和文本框，让文本框的点击，可以触发按钮的选中事件
     *
     * @export
     */
    junyou.GroupItemButton = (function () {
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
                    junyou.ThrowError("\u91CD\u590D\u7ED1\u5B9A\u4E86\u6587\u672C\u6846\u548C\u6309\u94AE");
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
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     * TouchDown显示对象放大效果
     * description
     * @author pb
     */
    junyou.TouchDown = (function () {
        var _$TDOpt = Object.freeze({ int: { x: 1, y: 1 } });
        return {
            /**
             * 绑定组件
             *
             * @param {TouchDownItem} item
             */
            bindItem: function (item) {
                if (item) {
                    item.on("touchBegin" /* TOUCH_BEGIN */, touchBegin);
                }
            },
            /**
             * 解绑组件
             *
             * @param {TouchDownItem} item
             */
            looseItem: function (item) {
                if (item) {
                    item.off("touchBegin" /* TOUCH_BEGIN */, touchBegin);
                    clearEndListener(item);
                }
            }
        };
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
            var raw = target.$_tdi;
            if (!raw) {
                target.$_tdi = raw = {};
                raw.x = target.x;
                raw.y = target.y;
            }
            else if (raw.tween) {
                junyou.Global.removeTween(raw.tween);
            }
            var tween = junyou.Global.getTween(target, _$TDOpt);
            raw.tween = tween;
            var tx = raw.x - target.width * 0.05 /* Multi */;
            var ty = raw.y - target.height * 0.05 /* Multi */;
            tween.to({ scaleX: 1.1 /* Scale */, scaleY: 1.1 /* Scale */, x: tx, y: ty }, 100, junyou.Ease.quadOut);
        }
        function touchEnd(e) {
            var target = e.target;
            clearEndListener(target);
            var raw = target.$_tdi;
            if (raw) {
                var tween = junyou.Global.getTween(target, _$TDOpt, null, true);
                raw.tween = tween;
                tween.to({ scaleX: 1, scaleY: 1, x: raw.x, y: raw.y }, 100, junyou.Ease.quadOut).call(endComplete, null, target);
            }
        }
        function endComplete(target) {
            delete target.$_tdi;
        }
    })();
})(junyou || (junyou = {}));
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
var junyou;
(function (junyou) {
    /**
     * tween的执行效果，参考页面：http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html
     *
     * @export
     * @class Ease
     */
    var Ease = (function () {
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
    junyou.Ease = Ease;
    __reflect(Ease.prototype, "junyou.Ease");
})(junyou || (junyou = {}));
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
var junyou;
(function (junyou) {
    var Tween = (function (_super) {
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
    junyou.Tween = Tween;
    __reflect(Tween.prototype, "junyou.Tween");
})(junyou || (junyou = {}));
/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
var junyou;
(function (junyou) {
    var TweenManager = (function () {
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
            return new junyou.Tween(target, props, pluginData, this);
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
    junyou.TweenManager = TweenManager;
    __reflect(TweenManager.prototype, "junyou.TweenManager");
})(junyou || (junyou = {}));
var junyou;
(function (junyou) {
    /**
     *
     *
     * @export
     * @class UModel
     * @extends {egret.DisplayObjectContainer}
     * @author 3tion
     */
    var UModel = (function (_super) {
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
                        part = junyou.recyclable(junyou.ResourceBitmap);
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
            var ns = face > 4;
            var d = ns ? 8 - face : face;
            if (frame) {
                var scale = face > 4 ? -1 : 1;
                if (frame.d == -1) {
                    this.scaleX = scale;
                    info.d = d;
                }
                else {
                    info.d = frame.d;
                }
                info.f = frame.f;
                info.a = frame.a;
            }
            else {
                info.d = d;
            }
            var flag = true;
            //渲染
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var res = _a[_i];
                flag = flag && res.draw(info, now);
            }
            return flag;
        };
        UModel.prototype.clear = function () {
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.alpha = 1;
            var list = this.$children;
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var bmp = list_2[_i];
                bmp.recycle();
            }
        };
        UModel.prototype.onRecycle = function () {
            junyou.removeDisplay(this);
            this.clear();
        };
        return UModel;
    }(egret.DisplayObjectContainer));
    junyou.UModel = UModel;
    __reflect(UModel.prototype, "junyou.UModel");
})(junyou || (junyou = {}));
