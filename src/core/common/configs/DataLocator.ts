/**
 * DataLocator的主数据 
 * 原 junyou.DataLocator.data  的全局别名简写
 */
const $DD = {} as jy.CfgData;

/**
 * DataLocator的附加数据 
 * 原junyou.DataLocator.extra 的全局别名简写
 */
let $DE: jy.ExtraData;
namespace jy {

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

    let parsers: { [index: string]: ConfigDataParser } = {};


    /**
     * 
     * 用于处理顺序
     * @private
     * @static
     */
    let _plist: string[] = [];
	/**
	 * 配置加载器<br/>
     * 用于预加载数据的解析
	 * @author 3tion
	 *
	 */
    export let DataLocator = {
        regParser,
        /**
         * 解析打包的配置
         */
        parsePakedDatas(type?: number) {
            let configs = Res.get("cfgs");
            Res.remove("cfgs");
            if (type == 1) {
                configs = decodePakCfgs(new ByteArray(configs as ArrayBuffer));
            }
            // 按顺序解析
            for (let key of _plist) {
                let parser = parsers[key];
                let data = parser(configs[key]);
                if (data) { // 支持一些void的情况
                    $DD[key] = data;
                    dispatch(EventConst.OneCfgComplete, key);
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
        regCommonParser,
        regBytesParser
    };

    /**
     * 
     * 注册通过H5ExcelTool导出的数据并且有唯一标识的使用此方法注册
     * @param {keyof CfgData} key 数据的标识
     * @param {(Creator<any> | 0)} CfgCreator 配置的类名
     * @param {(string | 0)} [idkey="id"] 唯一标识 0用于标识数组
     * @param {CfgDataType} [type] 
     */
    function regCommonParser(key: keyof CfgData, CfgCreator: Creator<any> | 0, idkey: string | 0 = "id", type?: CfgDataType) {
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
            ([type, dict, forEach] = getParserOption(idkey, type));
            try {
                let ref = CfgCreator || Object;
                for (let i = 1; i < data.length; i++) {
                    let rowData: any[] = data[i];
                    let ins = new (ref as any)();
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
                    forEach(ins, i - 1, key, dict, idkey as string);
                    if (typeof ins.decode === "function") {
                        ins.decode(local);
                    }
                }
                if (type == CfgDataType.ArraySet) {
                    dict = new ArraySet().setRawList(dict, idkey as never);
                }
            } catch (e) {
                if (DEBUG) {
                    ThrowError(`解析配置:${key}出错`, e);
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
    function regParser(key: keyof CfgData, parser: ConfigDataParser) {
        parsers[key] = parser;
        _plist.push(key);
    }


    function getJSONValue(value: any, type: any, def?: any) {
        // 特殊类型数据
        switch (type) {
            case JSONHeadType.Any:
                if (value == null) {//value == null 同时判断 null 和 undefined 并且字符串较少
                    value = def;
                }
                break;
            case JSONHeadType.String:
                if (value === 0 || value == null) {
                    value = def || "";
                }
                break;
            case JSONHeadType.Number:
            case JSONHeadType.Int32:
                // 0 == "" // true
                if (value === "" || value == null) {
                    value = +def || 0;
                }
                break;
            case JSONHeadType.Bool:
                if (value == null) {
                    value = def;
                }
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
                    Log(`配置${key}的数据有误，唯一标识${idKey}不能为对象`);
                }
                if (id in dict) {
                    Log(`配置${key}的数据有误，唯一标识${idKey}有重复值：${id}`);
                }
            }
            dict[id] = t;
        } else if (DEBUG) {
            Log(`配置${key}解析有误，无法找到指定的唯一标示：${idKey}，数据索引：${idx}`);
        }
    }


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
        DateTime = 8,
        Int32 = 9
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

    const CfgHeadStruct: PBStruct = {
        1: [0, PBFieldType.Required, PBType.String]/*必有 属性名字*/,
        2: [1, PBFieldType.Required, PBType.Enum]/*必有 数值的数据类型*/,
        3: [2, PBFieldType.Optional, PBType.Enum]/*可选 此列的状态*/,
        4: [3, PBFieldType.Optional, PBType.SInt32]/*可选 bool / int32 型默认值 */,
        5: [4, PBFieldType.Optional, PBType.Double]/*可选 double 型默认值 */,
        6: [5, PBFieldType.Optional, PBType.String]/*可选 字符串型默认值 */
    }

    PBUtils.initDefault(CfgHeadStruct);

    interface CfgHead extends JSONHeadItem {
        /** 
         * 可选 bool / int32 型默认值 
         */
        3?: number;
        /** 
         * 可选 double 型默认值 
         */
        4?: number;
        /**
         * 可选 字符串 型默认值
         */
        5?: string;
    }

    //配置数据 打包的文件结构数据
    //readUnsignedByte 字符串长度 readString 表名字 readUnsignedByte 配置类型(0 PBBytes 1 JSON字符串) readVarint 数据长度

    function decodePakCfgs(buffer: ByteArray) {
        let cfgs = {};
        while (buffer.readAvailable) {
            let len = buffer.readUnsignedByte();
            let key = buffer.readUTFBytes(len);//得到表名
            let type = buffer.readUnsignedByte();
            let value: any;
            len = buffer.readVarint();
            switch (type) {
                case 0://JSON字符串
                    let str = buffer.readUTFBytes(len);
                    value = JSON.parse(str);
                    break;
                case 1://PBBytes
                    value = buffer.readByteArray(len);
                    break;
            }
            cfgs[key] = value;
        }
        return cfgs;
    }

    function getParserOption(idkey: string | 0 = "id", type?: CfgDataType) {
        let dict, forEach: { (t: any, idx: number, key: string, dict: any, idkey: string) };
        if (idkey == "" || idkey == 0) {
            type = CfgDataType.Array;
        } else if (!type) {
            type = CfgDataType.Dictionary;
        }
        switch (type) {
            case CfgDataType.Array:
            case CfgDataType.ArraySet:
                dict = [];
                forEach = arrayParserForEach;
                break;
            case CfgDataType.Dictionary:
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
    function regBytesParser(key: keyof CfgData, CfgCreator: Creator<any> | 0, idkey: string | 0 = "id", type?: CfgDataType) {
        regParser(key, (bytes: ByteArray) => {
            if (!bytes) {
                return;
            }
            let dict, forEach: { (t: any, idx: number, key: string, dict: any, idkey: string) };
            ([type, dict, forEach] = getParserOption(idkey, type));
            try {
                let struct = {} as PBStruct;
                let headersRaw = [] as (JSONHeadItem & { 4?: number })[];
                let i = 0;
                let count = bytes.readVarint();//头的数量
                let hasLocal;
                while (bytes.readAvailable && count--) {
                    let len = bytes.readVarint();
                    let head = PBUtils.readFrom(CfgHeadStruct, bytes, len) as CfgHead;
                    const [name, headType, headState, i32Def, dblDef, strDef] = head;
                    let def, isJSON = 0, pbType: PBType;
                    switch (headType) {
                        case JSONHeadType.Any:
                        case JSONHeadType.String:
                            def = strDef;
                            pbType = PBType.String;
                            break;
                        case JSONHeadType.Number:
                            def = dblDef;
                            pbType = PBType.Double;
                            break;
                        case JSONHeadType.Bool:
                        case JSONHeadType.Int32:
                        case JSONHeadType.Date:
                        case JSONHeadType.Time:
                        case JSONHeadType.DateTime:
                            def = i32Def;
                            pbType = PBType.SInt32;
                            break;
                        case JSONHeadType.Array:
                        case JSONHeadType.Array2D:
                            if (strDef) {
                                def = JSON.parse(strDef);
                            }
                            pbType = PBType.String;
                            isJSON = 1;
                            break;
                    }
                    struct[i + 1] = [name, PBFieldType.Optional, pbType, def];
                    head.length = 5;
                    head[3] = def;
                    head[4] = isJSON;
                    headersRaw[i++] = head;
                    if ((headState & JSONHeadState.Local) == JSONHeadState.Local) {
                        hasLocal = 1;
                    }
                }
                PBUtils.initDefault(struct, (CfgCreator as any).prototype);
                let headLen = i;
                i = 0;
                count = bytes.readVarint();//行的数量
                while (bytes.readAvailable && count--) {
                    let len = bytes.readVarint();
                    let obj = PBUtils.readFrom(struct, bytes, len);
                    if (!obj) {
                        continue;
                    }
                    if (CfgCreator) {
                        CfgCreator.call(obj);
                    }
                    let local = hasLocal && {};
                    for (let j = 0; j < headLen; j++) {
                        let head = headersRaw[j];
                        let [name, test, type, def, isJSON] = head;
                        let value = obj[name];
                        if (value && isJSON) {
                            value = JSON.parse(value);
                        }
                        let v = getJSONValue(value, test, def);
                        if ((type & JSONHeadState.Local) == JSONHeadState.Local) {
                            local[name] = v;
                        } else {
                            obj[name] = v;
                        }
                    }
                    forEach(obj, i++, key, dict, idkey as string);
                    if (typeof obj.decode === "function") {
                        obj.decode(local);
                    }
                }
                if (type == CfgDataType.ArraySet) {
                    dict = new ArraySet().setRawList(dict, idkey as never);
                }
            } catch (e) {
                if (DEBUG) {
                    ThrowError(`解析配置:${key}出错`, e);
                }
            }
            return dict;
        })
    }
}
