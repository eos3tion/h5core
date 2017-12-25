module junyou {

    export const enum PBType {
        Double = 1,
        Float,
        Int64,
        UInt64,
        Int32,
        Fixed64,
        Fixed32,
        Bool,
        String,
        Group,
        Message,
        Bytes,
        Uint32,
        Enum,
        SFixed32,
        SFixed64,
        SInt32,
        SInt64
    }

    /**
     * protobuf2 的字段类型
     * 
     * @export
     * @enum {number}
     */
    export const enum PBFieldType {
        Optional = 1,
        Required,
        Repeated
    }

    /**
     * 单个Field的结构
     * 
     * @interface PBField
     */
    export interface PBField extends Array<any> {
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
    export interface PBStruct {
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

    /**
     * PB结构字典
     * 
     * @interface PBStructDict
     */
    declare type PBStructDict = {
        [index: string]: PBStruct;
    }

    export interface PBStructDictInput {
        /**
         * 是否初始化过
         * 
         * @type {*}
         * @memberOf PBStructDict
         */
        $$inted?: any;
        [index: string]: PBStruct | Key;
    }


    const structDict: PBStructDict = {};

    /**
     * protobuf wiretype的字典  
     * key  {number}    ProtoBuf的类型  
     * Value {number}   WireType
     * 
     * @private
     * @static
     * @type {{ [index: number]: number }}
     */
    const wireTypeMap: { [index: number]: number } = [
            	/* 无 */,
                /* PBType.Double */1,
                /* PBType.Float */5,
                /* PBType.Int64 */0,
                /* PBType.UInt64 */0,
                /* PBType.Int32 */0,
                /* PBType.Fixed64 */1,
                /* PBType.Fixed32 */5,
                /* PBType.Bool */0,
                /* PBType.String */2,
                /* PBType.Group */,
                /* PBType.Message */2,
                /* PBType.Bytes */2,
                /* PBType.Uint32 */0,
                /* PBType.Enum */0,
                /* PBType.SFixed32 */5,
                /* PBType.SFixed64 */1,
                /* PBType.SInt32 */0,
                /* PBType.SInt64 */0
    ];

    const enum StringConst {
        defKey = "def"
    }

    /**
     * 消息定义的字典
     */
    let defDict = {} as { [msgType: number]: any };

    /**
     * 注册定义
     * 
     * @param {PBStruct} msg 消息
     * @param {*} def 类型定义
     */
    function regDef(msg: PBStruct, def: any)
    /**
     * 注册定义
     * 
     * @param {Key} msgType 消息类型标识
     * @param {*} def 类型定义
     */
    function regDef(msgType: Key, def: any)
    function regDef(m, def) {
        let msg: PBStruct;
        if (typeof m != "object") {
            msg = structDict[m];
            if (!msg) {
                defDict[m] = def;
                return;
            }
        } else {
            msg = m;
        }
        Object.defineProperty(msg, StringConst.defKey, {
            value: def
        })
    }

    /**
     * 注册消息的结构
     * @param msgType 消息类型标识
     * @param struct 结构
     */
    function regStruct(msgType: Key, struct: PBStruct) {
        if (DEBUG && (msgType in structDict)) {
            ThrowError(`PB的结构定义的key[${msgType}]注册重复`);
        }
        let def = defDict[msgType];
        if (def) {
            regDef(struct, def);
        }
        //检查处理默认值
        initDefault(struct);
        structDict[msgType] = struct;
    }

    function initDefault(struct: PBStruct, prototype?) {
        //检查处理默认值
        for (let idx in struct) {
            let body = struct[idx];
            //0 key
            //1 required optional repeated
            //2 数据类型
            //3 Message
            //4 默认值
            if (4 in body) {//有默认值
                let def = struct.def;
                if (!def) {
                    def = prototype || {};
                    //不使用encode.def=def=[]; 是为了防止def被遍历
                    Object.defineProperty(struct, StringConst.defKey, {
                        value: def
                    });
                }
                //消息中没有对应key的数据，先赋值成默认值，等待后续处理
                def[body[0]] = body[4];
            }
        }
        if (!struct.def) {
            Object.defineProperty(struct, StringConst.defKey, {
                value: prototype || Object.prototype
            });
        }
    }

    /**
     *
     * @author 3tion
     * ProtoBuf工具集
     *
     */
    export const PBUtils = {
        /**
         * 注册定义
         */
        regDef,
        regStruct,
        /**
         * 初始化默认值
         */
        initDefault,
        /**
         * 增加ProtoBuf的消息的结构字典
         * 
         * @static
         * @param {PBStructDict} dict
         * 
         * @memberOf PBMessageUtils
         */
        add(dict: PBStructDictInput) {
            //对默认值做预处理，减少后期遍历次数
            if (dict) {
                let defD = defDict;
                if (!dict.$$inted) {//检查字典是否初始化过
                    for (let name in dict) {
                        let struct = dict[name];
                        if (typeof struct != "object") {//用于支持索引式的结构 http://192.168.0.205:1234/h5ToolsForJava/ProtoTools/issues/2
                            struct = dict[struct] as PBStruct;
                        }
                        regStruct(name, struct);
                    }
                    dict.$$inted = 1;
                }
            }
        },
        readFrom,
        writeTo
    }


    /**
     * 读取消息
     * 
     * @param {(Key | PBStruct)} msgType 
     * @param {ByteArray} bytes 
     * @param {number} [len] 
     * @returns {any} 
     */
    function readFrom(msgType: Key | PBStruct, bytes: ByteArray, len?: number) {
        if (len === undefined) len = -1;
        let afterLen = 0;
        if (len > -1) {
            afterLen = bytes.bytesAvailable - len;
        }
        let struct = typeof msgType == "object" ? msgType : structDict[msgType];
        if (!struct) {
            ThrowError(`非法的通信类型[${msgType}]`);
            return;
        }
        //检查处理默认值
        let msg = Object.create(struct.def);
        while (bytes.bytesAvailable > afterLen) {
            let tag = bytes.readVarint();
            if (tag == 0)
                continue;
            let idx = tag >>> 3;
            let body = struct[idx];
            if (!body) {
                ThrowError(`读取消息类型为：${msgType}，索引${idx}时数据出现错误，找不到对应的数据结构配置`);
                // 使用默认读取
                readValue(tag, bytes);
                continue;
            }
            let name = body[0];
            let label = body[1];
            let type = body[2];
            let subMsgType = body[3];
            let value;
            let isRepeated = label == PBFieldType.Repeated;
            if (!isRepeated || (tag & 0b111) != 7) {//自定义  tag & 0b111 == 7 为 数组中 undefined的情况
                switch (type) {
                    case PBType.Double:
                        value = bytes.readPBDouble();
                        break;
                    case PBType.Float:
                        value = bytes.readPBFloat();
                        break;
                    case PBType.Int64:
                    case PBType.UInt64:
                    case PBType.SInt64:
                        value = bytes.readVarint64();//理论上项目不使用
                        break;
                    case PBType.SInt32:
                        value = decodeZigzag32(bytes.readVarint());
                        break;
                    case PBType.Int32:
                    case PBType.Uint32:
                    case PBType.Enum:
                        value = bytes.readVarint();
                        break;
                    case PBType.Fixed64:
                    case PBType.SFixed64:
                        value = bytes.readFix64();//理论上项目不使用
                        break;
                    case PBType.Fixed32:
                        value = bytes.readFix32();
                        break;
                    case PBType.Bool:
                        value = bytes.readBoolean();
                        break;
                    case PBType.String:
                        value = readString(bytes);
                        break;
                    case PBType.Group://(protobuf 已弃用)
                        value = undefined;
                        if (DEBUG) {
                            ThrowError(`读取消息类型为：${msgType}，索引${idx}时数据出现已弃用的GROUP分组类型`);
                        }
                        break;
                    case PBType.Message://消息
                        value = readMessage(bytes, subMsgType);
                        break;
                    case PBType.Bytes:
                        value = readBytes(bytes);
                        break;
                    case PBType.SFixed32:
                        value = bytes.readSFix32();
                        break;
                    default:
                        value = readValue(tag, bytes);
                }
            }
            if (isRepeated) {//repeated
                let arr = msg[name];
                if (!arr) msg[name] = arr = [];
                arr.push(value);
            } else {
                msg[name] = value;
            }
        }
        return msg;
    }

    function readValue(tag: number, bytes: ByteArray): any {
        let wireType = tag & 7;
        let value;
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
                ThrowError("protobuf的wireType未知");
                break;
        }
        return value;
    }


    function readString(bytes: ByteArray) {
        let blen = bytes.readVarint();
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
    function readMessage(bytes: ByteArray, msgType: Key | PBStruct) {
        let blen = bytes.readVarint();
        return readFrom(msgType, bytes, blen);
    }

    function readBytes(bytes: ByteArray) {
        let blen = bytes.readVarint();
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
    function writeTo(msg: object, msgType: Key | PBStruct, bytes?: ByteArray, debugOutData?: Object): ByteArray {
        if (msg == undefined) {
            return;
        }
        let struct = typeof msgType == "object" ? msgType : structDict[msgType];
        if (!struct) {
            ThrowError(`非法的通信类型[${msgType}]，堆栈信息:${new Error()}`);
            return;
        }
        if (!bytes) {
            bytes = new ByteArray;
        }
        for (let numberStr in struct) {
            let num = +numberStr;
            let body = struct[num];
            let [name, label] = body;
            if (label == PBFieldType.Optional && !(name in msg)) {
                continue;
            }
            let value = msg[name];
            if (value == undefined || value === body[4]/* 默认值 */) {
                continue;
            }

            let type = body[2];
            let subMsgType = body[3];
            let wireType = wireTypeMap[type];
            let tag = (num << 3) | wireType;
            if (label == PBFieldType.Repeated) {
                if (DEBUG && debugOutData) {
                    var arr = [];
                    debugOutData[name] = arr;
                }
                for (let key in value) {
                    let element = value[key];
                    // 针对repeated中无法处理空的占位数组做处理，Protobuf 2 中不支持undefined进行占位  由于 wireType 只使用 0 1 2 3 4 5
                    // 现在使用 7 作为  undefined 占位使用
                    if (DEBUG && debugOutData) {
                        arr.push(writeElementTo(element, type, element == undefined ? ((num << 3) | 7) : tag, bytes, subMsgType));
                    } else {
                        writeElementTo(element, type, element == undefined ? ((num << 3) | 7) : tag, bytes, subMsgType);
                    }
                }

            }
            else {
                if (DEBUG && debugOutData) {
                    debugOutData[name] = writeElementTo(value, type, tag, bytes, subMsgType);
                } else {
                    writeElementTo(value, type, tag, bytes, subMsgType);
                }
            }
        }
        return bytes;
    }

    function writeElementTo(value: any, type: number, tag: number, bytes: ByteArray, subMsgType?: Key | PBStruct) {
        if (DEBUG) {
            var out = value;
        }
        bytes.writeVarint(tag);
        switch (type) {
            case PBType.Fixed32:
                bytes.writeFix32(checkUInt32(value, type));
                break;
            case PBType.SFixed32:
                bytes.writeSFix32(checkInt32(value, type));
                break;
            case PBType.Float:
                bytes.writePBFloat(value);
                break;
            case PBType.Double:
                bytes.writePBDouble(value);
                break;
            case PBType.Fixed64://理论上项目不使用
            case PBType.SFixed64://理论上项目不使用
                bytes.writeFix64(value);
                break;
            case PBType.Int32:
                value = checkInt32(value, type);
                if (value < 0) {
                    bytes.writeVarint64(value);
                } else {
                    bytes.writeVarint(value);
                }
                break;
            case PBType.SInt32:
                bytes.writeVarint(zigzag32(checkInt32(value, type)));
                break;
            case PBType.Enum:
            case PBType.Uint32:
                bytes.writeVarint(checkUInt32(value, type));
                break;
            case PBType.Int64:
            case PBType.SInt64:
            case PBType.UInt64:
                bytes.writeVarint64(value);
                break;
            case PBType.Bool:
                bytes.writeVarint(value ? 1 : 0);
                break;
            case PBType.String:
            case PBType.Bytes:
            case PBType.Message:
                if (type == PBType.Message) {
                    if (DEBUG) {
                        out = {};
                        temp = writeTo(value, subMsgType, null, out);
                    } else {
                        var temp = writeTo(value, subMsgType);
                    }
                }
                else if (type == PBType.Bytes) {
                    temp = value as ByteArray;
                    if (DEBUG) {
                        out = Uint8Array.from(temp.bytes);
                    }
                }
                else {
                    temp = new ByteArray;
                    temp.writeUTFBytes(value);
                }
                length = temp ? temp.length : 0;
                bytes.writeVarint(length);
                if (length > 0) {
                    bytes.writeBytes(temp, 0, length);
                }
                break;
        }
        if (DEBUG) {
            return out;
        }
    }
    function checkUInt32(value: any, type: PBType): number {
        value = +value || 0;
        if (value > 4294967295 || value < 0) {
            ThrowError(`PBMessageUtils写入数据时候，使用的类型：${type}，值为：${value}，但超出整型范围。`);
            value >>> 0;
        }
        return value;
    }
    function checkInt32(value: any, type: PBType): number {
        value = +value || 0;
        if (value > 2147483647 || value < -2147483648) {
            ThrowError(`PBMessageUtils写入数据时候，使用的类型：${type}，值为：${value}，但超出整型范围。`);
            value >> 0;
        }
        return value;
    }
    function zigzag32(n: number) {
        return (n << 1) ^ (n >> 31);
    }
    function decodeZigzag32(n: number) {
        return n >> 1 ^ (((n & 1) << 31) >> 31);
    }
}