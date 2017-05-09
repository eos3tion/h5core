/**
 * DataLocator的主数据 
 * 原 junyou.DataLocator.data  的全局别名简写
 */
const $DD: junyou.CfgData = <any>{};

/**
 * DataLocator的附加数据 
 * 原junyou.DataLocator.extra 的全局别名简写
 */
var $DE: junyou.ExtraData;
module junyou {
	/**
	 * 配置加载器<br/>
     * 用于预加载数据的解析
	 * @author 3tion
	 *
	 */
    export var DataLocator = (function () {

        var parsers: { [index: string]: ConfigDataParser } = {};


        /**
         * 
         * 用于处理顺序
         * @private
         * @static
         */
        var _plist: string[] = [];

        return {
            regParser,
            /**
             * 解析打包的配置
             */
            parsePakedDatas() {
                let configs = RES.getRes("cfgs");
                RES.destroyRes("cfgs");
                // 按顺序解析
                for (let key of _plist) {
                    let parser = parsers[key];
                    let data = parser(configs[key]);
                    if (data) { // 支持一些void的情况
                        $DD[key] = data;
                    }
                }

                let extraData = {};
                //处理额外数据
                for (let key in configs) {
                    if (key.charAt(0) == "$") {
                        let raw: any[] = configs[key];
                        key = key.substr(1);
                        if (raw) {
                            let i = 0, len = raw.length, data: { [index: string]: any } = {};
                            while (i < len) {
                                let sub: string = raw[i++];
                                let value = raw[i++];
                                let test = raw[i];
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
                $DE = <any>extraData;
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
            regCommonParser(key: keyof CfgData, CfgCreator: { new (): Cfg } | 0, idkey = "id") {
                regParser(key, (data: any[]): any => {
                    if (!data) return;
                    let dict, forEach: { (t: any, idx: number, key: string, dict: any, idkey: string) };
                    let headersRaw: JSONHeadItem[] = data[0];
                    let hasLocal: number;
                    for (let j = 0; j < headersRaw.length; j++) {
                        let head = headersRaw[j];
                        if ((head[2] & JSONHeadState.Local) == JSONHeadState.Local) {
                            hasLocal = 1;
                        }
                    }
                    if (idkey == "") {//undefined 会被解析成
                        dict = [];
                        forEach = arrayParserForEach;
                    } else {
                        dict = {};
                        forEach = commonParserForEach;
                    }
                    try {
                        let ref = CfgCreator || Object;
                        for (let i = 1; i < data.length; i++) {
                            let rowData: any[] = data[i];
                            let ins = new ref();
                            let local = hasLocal && {};
                            for (let j = 0; j < headersRaw.length; j++) {
                                let head = headersRaw[j];
                                let [name, test, type, def] = head;
                                let v = getJSONValue(rowData[j], test, def);
                                if ((type & JSONHeadState.Local) == JSONHeadState.Local) {
                                    local[name] = v;
                                } else {
                                    ins[name] = v;
                                }
                            }
                            forEach(ins, i - 1, key, dict, idkey);
                            if (typeof ins.decode === "function") {
                                ins.decode(local);
                            }
                        }
                    } catch (e) {
                        if (DEBUG) {
                            ThrowError(`解析配置:${key}出错，堆栈：${e.stack}`);
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
        function regParser(key: keyof CfgData, parser: ConfigDataParser) {
            parsers[key] = parser;
            _plist.push(key);
        }


        function getJSONValue(value: any, type: any, def?: any) {
            // 特殊类型数据
            switch (type) {
                case JSONHeadType.Any:
                    if (value == null || value == undefined) {
                        value = def;
                    }
                    break;
                case JSONHeadType.String:
                    if (value === 0 || value == undefined) {
                        value = def || "";
                    }
                    break;
                case JSONHeadType.Number:
                    // 0 == "" // true
                    if (value === "" || value == undefined) {
                        value = +def || 0;
                    }
                    break;
                case JSONHeadType.Bool:
                    value = !!value;
                    break;
                case JSONHeadType.Array:
                case JSONHeadType.Array2D:
                    if (value === 0) {
                        value = undefined;
                    }
                    if (!value && def) {
                        value = def;
                    }
                    break;
                case JSONHeadType.Date:
                case JSONHeadType.DateTime:
                    value = new Date((value || def || 0) * 10000);
                    break;
                case JSONHeadType.Time:
                    value = new TimeVO().decodeBit(value || def || 0);
                    break;
            }
            return value;
        }

        /**
         * 用于解析数组
         * 
         * @memberOf DataLocator
         */
        function arrayParserForEach(t: any, idx: number, key: string, dict: any[]) {
            dict.push(t);
        }

        /**
         * 用于解析字典
         */
        function commonParserForEach(t: any, idx: number, key: string, dict: any, idKey: string) {
            if (idKey in t) {
                let id = t[idKey];
                if (DEBUG) {
                    if (typeof id === "object") {
                        ThrowError(`配置${key}的数据有误，唯一标识${idKey}不能为对象`);
                    }
                    if (id in dict) {
                        ThrowError(`配置${key}的数据有误，唯一标识${idKey}有重复值：${id}`);
                    }
                }
                dict[id] = t;
            } else {
                if (DEBUG) {
                    ThrowError(`配置${key}解析有误，无法找到指定的唯一标示：${idKey}，数据索引：${idx}`);
                }
            }
        }
    })()

    /**
     * 配置数据解析函数
     */
    export interface ConfigDataParser {
        (data: any): any;
    }

    /**
     * JSON版的头信息
     * 
     * @interface JSONHeadItem
     * @extends {Array<any>}
     */
    interface JSONHeadItem extends Array<any> {
        /**
        * 属性的名称
        * 
        * @type {string}
        * @memberOf HeadItem
        */
        0: string;
        /**
        * 数值的数据类型
        * 
        * @type {number}
        * @memberOf HeadItem
        */
        1: JSONHeadType;
        /**
        * 此列的状态
        * 
        * @type {JSONHeadItemType}
        * @memberOf HeadItem
        */
        2?: JSONHeadState;
        /**
        * 默认值
        * 
        * @type {*}
        * @memberOf HeadItem
        */
        3?: any;
    }
    /**
     * 类型检查器的索引
     * 
     * @enum {number}
     */
    const enum JSONHeadType {
        Any = 0,
        String = 1,
        Number = 2,
        Bool = 3,
        Array = 4,
        Array2D = 5,
        Date = 6,
        Time = 7,
        DateTime = 8
    }


    /**
     * JSON版数据头信息的类型
     * 
     * @enum {number}
     */
    const enum JSONHeadState {
        /**
         * 有数据，并且是全局
         */
        HasData = 0b1,
        Local = 0b10,
        /**
         * 没有数据
         */
        NoData = 0,
        /**
         * 局部变量并且没有数据
         */
        LocalnoData = Local,
        /**
         * 局部变量有数据
         */
        LocalhasData = Local | HasData
    }

    /**
     * 通过H5ExcelTool生成的数据
     * 
     * @export
     */
    export interface Cfg {

        /**
         * 解析配置
         * 
         * @param {*} data
         * @param {*} [local]   没有接口，但是需要本地赋值的数据
         * 
         * @memberOf ICfg
         */
        decode?: { (local?: any) };
    }
    /**
     * 附加数据
     * 
     * @interface ExtraData
     */
    export interface ExtraData { }

    /**
     * 配置数据
     * 
     * @export
     * @interface CfgData
     */
    export interface CfgData { }
}
