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
    filter?: { ($gmNSLog, ...args): boolean };

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
    data: any
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
    showNSLog(filter: { ($gmNSLog: $NSLog, ...args): boolean }, ...args): $NSLog[];
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
    printSend();
    /**
     * 使用过滤函数过滤在控制台输出的发送日志
     * 
     * @param {{ ($gmNSLog, ...args): boolean }} filter     过滤函数，函数返回true的会显示在控制台上
     * @param {any} args                                    过滤函数使用的参数
     * 
     * @memberOf $gmType
     */
    printSend(filter: { ($gmNSLog: $NSLog, ...args): boolean }, ...args);
    /**
     * 显示或排除指定指令的发送日志，并在控制台输出
     * 
     * @param {boolean} isWhite     是否为白名单模式
     * @param {...number[]} cmds    指令列表
     * 
     * @memberOf $gmType
     */
    printSend(isWhite: boolean, ...cmds: number[]);
    /**
     * 排除指定指令的发送日志，将其他日志信息在控制台输出
     * 
     * @param {...number[]} cmds    黑名单列表
     * 
     * @memberOf $gmType
     */
    printSend(...cmds: number[]);

    /**
     * 控制台输出接收日志
     * @memberOf $gmType
     */
    printReceive();
    /**
     * 使用过滤函数过滤并在控制台输出接收日志
     * 
     * @param {{ ($gmNSLog, ...args): boolean }} filter     过滤函数，函数返回true的会显示在控制台上
     * @param {any} args                                    过滤函数使用的参数
     * 
     * @memberOf $gmType
     */
    printReceive(filter: { ($gmNSLog: $NSLog, ...args): boolean }, ...args);
    /**
     * 显示或排除指定指令的接收日志，并在控制台输出
     * 
     * @param {boolean} isWhite     是否为白名单模式
     * @param {...number[]} cmds    指令列表
     * 
     * @memberOf $gmType
     */
    printReceive(isWhite: boolean, ...cmds: number[]);
    /**
     * 排除指定指令的接收日志，将其他日志信息在控制台输出
     * 
     * @param {...number[]} cmds
     * 
     * @memberOf $gmType
     */
    printReceive(...cmds: number[]);

    /**
     * 调用printSend和printReceive的一个简写
     * 
     * 
     * @memberof $gmType
     */
    print();

    /**
     * 模拟服务端发送数据
     * 
     * @param {number} cmd 
     * @param {*} [data] 
     * 
     * @memberof $gmType
     */
    route(cmd: number, data?: any);

    /**
     * 调试用，如果开启后，所有send指令时，按此值额外将同一数据发送多次，加上本身的一次，一共发送`multiSend+1`次
     */
    multiSend: number;

    /**
     * 使用日志数据进行模拟调试
     * 
     * @param {$NSLog[]} logs 
     * 
     * @memberof $gmType
     */
    batchRoute(logs: $NSLog[]);

    /**
     * 获取网络传输数据日志的过滤器
     * @returns {$NSFilter}
     * 
     * @memberOf $gmType
     */
    __getNSFilter(...args): $NSFilter;

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

if (DEBUG) {
    var $gm: $gmType = <$gmType>$gm || <$gmType>{};
    $gm.multiSend = 0;
    $gm.__getNSFilter = (...args) => {
        let nsFilter = <$NSFilter>{};
        if (args.length) {
            let filter = args[0];
            if (filter != undefined) {
                const tof = typeof filter;
                if (tof === "function") {
                    nsFilter.filter = filter;
                    nsFilter.filterParams = args.slice(1);
                } else {
                    if (tof === "boolean") {
                        nsFilter.isWhite = filter;
                        nsFilter.cmds = args.slice(1);
                    } else if (tof === "number") {
                        nsFilter.cmds = args;
                    }
                }
            }
        }
        return nsFilter;
    }
    $gm.print = function () {
        $gm.printSend();
        $gm.printReceive();
    }
    $gm.printSend = function (filter?: any, ...args) {
        if (arguments.length == 0 && $gm.printSendFilter) {
            $gm.printSendFilter = undefined;
        } else {
            $gm.printSendFilter = $gm.__getNSFilter(filter, ...args);
        }
    }
    $gm.printReceive = function (filter?: any, ...args) {
        if (arguments.length == 0 && $gm.printReceiveFilter) {
            $gm.printReceiveFilter = undefined;
        } else {
            $gm.printReceiveFilter = $gm.__getNSFilter(filter, ...args);
        }
    }
    $gm.showNSLog = (filter?: any, ...args) => {
        let nsFilter = $gm.__getNSFilter(filter, ...args);
        let output = [];
        let msg = "";
        $gm.nsLogs.forEach(log => {
            if ($gm.__nsLogCheck(log, nsFilter)) {
                output.push({ type: log.type, time: log.time, cmd: log.cmd, data: log.data, json: JSON.stringify(log.data) });
                msg += `${log.time}\t${log.type}\t${log.cmd}\t${JSON.stringify(log.data)}\n`;
            }
        });
        console.table(output);
        jy.doCopy(msg) && console.log("%c 已将网络数据复制到剪贴板", "color:red;font-size:50px;");
        return output;
    }
    $gm.__nsLogCheck = (log, nsFilter) => {
        const { cmd } = log;
        if (nsFilter) {
            const { filter, cmds, filterParams, isWhite } = nsFilter;
            if (cmds) {
                let idx = cmds.indexOf(cmd);
                if (isWhite && ~idx || !isWhite && !~idx) {
                    return true;
                }
            } else if (filter) {
                return filter(log, ...filterParams);
            } else {
                return true;
            }
        }
    }
    $gm.maxNSLogCount = 1000;
    $gm.nsLogs = [];
    $gm.route = (cmd, data) => {
        jy.NetService.get().route(cmd, data);
    }
    $gm.batchRoute = logs => {
        //过滤send
        logs = logs.filter(log => {
            return log.type != "send";
        })
        if (logs.length) {
            let time = logs[0].time | 0;
            logs.forEach(log => {
                setTimeout($gm.route, (log.time | 0) - time, log.cmd, log.data);
            })
        }
    }
}

namespace jy {
    export const enum NSType {
        Null = 0,
        Boolean = 1,
        String = 2,
        Bytes = 4,
        Double = 5,
        Int32 = 6,
        Uint32 = 7,
        Int64 = 8
    }

    export const NSBytesLen = {
        /**NSType.Null */0: 0,
        /**NSType.Boolean */1: 1,
        /**NSType.Double */5: 8,
        /**NSType.Int32 */6: 4,
        /**NSType.Uint32 */7: 4,
        /**NSType.Int64 */8: 8
    };
    /**
     * 用于存储头部的临时变量
     */
    export const nsHeader = { cmd: 0, len: 0 };

    /**
     * 头信息
     * 
     * @export
     * @interface NSHeader
     */
    export interface NSHeader {
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

    function send2(cmd: number, data?: any, msgType?: Key, limit?: number) {
        if (RequestLimit.check(cmd, limit)) {
            this._send(cmd, data, msgType);
            if (DEBUG) {
                let multiSend = $gm.multiSend;
                for (let i = 0; i < multiSend; i++) {
                    this._send(cmd, data, msgType);
                }
            }
        } else {
            dispatch(EventConst.NetServiceSendLimit, cmd);
        }
    }

    export interface NetService {

        /**
         * 是否连通
         */
        readonly connected?: boolean;
    }

    /**
     * 通信服务
     * 收发的协议结构：
     * 2字节协议号 2字节包长度(n) n字节包
     * @author 3tion
     *
     */
    export abstract class NetService {
        /**
        * 请求地址
        */
        protected _actionUrl: string;

        public setLimitEventEmitable(emit: boolean) {
            if (emit) {
                this.send = send2;
            } else {
                delete this.send;
            }
        }

        protected static _ins: NetService;

        protected _limitAlert: boolean;

        protected _limitSendFunc: { (cmd: number, data?: any, msgType?: Key, limit?: number) };
        protected _nolimitSendFunc: { (cmd: number, data?: any, msgType?: Key, limit?: number) };

        public static get(): NetService {
            return this._ins;
        }
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
        protected $writeNSLog: { (time: number, type: "send" | "receive", cmd: number, data: any): void };


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
        _receiveMSG: { [index: number]: Key };

        /**
         * 设置地址
         * 
         * @abstract
         * @param {string} actionUrl 
         */
        abstract setUrl(actionUrl: string);
        constructor() {
            this._router = new NetRouter();
            this._pcmdList = [];
            this._tmpList = [];
            this._readBuffer = new ByteArray();
            this._sendBuffer = new ByteArray();
            this._tempBytes = new ByteArray();
            this._receiveMSG = {};

            if (DEBUG) {
                this.$writeNSLog = (time, type, cmd, data) => {
                    data = data == undefined ? undefined : JSON.parse(JSON.stringify(data));
                    let log = doFreeze({ time, type, cmd, data });
                    const nsLogs = $gm.nsLogs;
                    //清理多余的日志
                    while (nsLogs.length > $gm.maxNSLogCount) {
                        nsLogs.shift();
                    }
                    nsLogs.push(log);
                    let nsFilter = type == "send" ? $gm.printSendFilter : $gm.printReceiveFilter;
                    if ($gm.__nsLogCheck(log, nsFilter)) {
                        console.log(type, time, cmd, data);
                    }
                    function doFreeze(obj) {
                        if (typeof obj == "object" && obj) {
                            let pool = [obj] as Object[];
                            while (pool.length) {
                                let tmp = pool.pop();
                                Object.freeze(tmp);
                                for (let key in tmp) {
                                    let x = tmp[key];
                                    if (typeof x == "object" && x) {
                                        pool.push(x);
                                    }
                                }
                            }
                        }
                        return obj;
                    }
                }
            }
            if (window.addEventListener) {//防止native报错
                addEventListener("online", this.netChange);
                addEventListener("offline", this.netChange);
            }
            on(EventConst.Awake, this.onawake, this);
        }

        public setEndian(endian) {
            this._sendBuffer.$endian = this._readBuffer.$endian = this._tempBytes.$endian = endian;
        }

        protected netChange = () => {
            if (navigator.onLine) {
                dispatch(EventConst.Online);
                this.showReconnect();
            }
            else {
                dispatch(EventConst.Offline);
            }
        }

        /**
         * 基础连接时间
         * 
         * 
         * @memberOf NetService
         */
        public baseConTime = 10000;

        /**
         * 最大连接时间
         * 
         * 
         * @memberOf NetService
         */
        public maxConTime = Time.ONE_MINUTE;

        /**
         * 重连次数
         * 
         * @private
         * @type {number}
         * @memberOf NetService
         */
        protected _reconCount = 0;

        /**
         * 下次自动拉取请求的时间戳
         */
        protected _nextAutoTime = 0;

        /**
         * 下次自动请求的最短
         */
        protected _autoTimeDelay: number;

        protected showReconnect() {
            this._reconCount += 1;
            let time = this._reconCount * this.baseConTime;
            const maxConTime = this.maxConTime;
            if (time > maxConTime) {
                time = maxConTime;
            }
            this._nextAutoTime = Global.now + time;
            dispatch(EventConst.ShowReconnect, this._reconCount);
        }


        protected onawake() {
            this._reconCount = 0;
            this._nextAutoTime = Global.now + this._autoTimeDelay;
        }

        /**
         * 基础类型消息
         */
        public regReceiveMSGRef(cmd: number, ref: Key) {
            this._receiveMSG[cmd] = ref;
        }

        /**
         * 注册处理器
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         * @param {number} [priority=0] 处理优先级
         */
        public register(cmd: number, handler: INetHandler, priotity = 0): boolean {
            return this._register(cmd, handler, priotity, false);
        }

        /**
         * 注册单次执行的处理器
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         * @param {number} [priority=0] 处理优先级
         */
        public regOnce(cmd: number, handler: INetHandler, priotity = 0): boolean {
            return this._register(cmd, handler, priotity, true);
        }

        /**
         * 移除协议号和处理器的监听
         * 
         * @param {number} cmd 协议号
         * @param {INetHandler} handler 处理网络数据的处理器
         */
        public remove(cmd: number, handler: INetHandler) {
            this._router.remove(cmd, handler);
        }

        protected _register(cmd: number, handler: INetHandler, priotity: number, once: boolean): boolean {
            if (cmd > 32767 || cmd < -32768) {
                if (DEBUG) {
                    Log(`协议号的范围必须是-32768~32767之间，当前cmd:${cmd}`);
                }
                return false;
            }
            this._router.register(cmd, handler, priotity, once);
            return true;
        }

        /**
         * 即时发送指令<br/>
         * 用于处理角色主动操作的请求，如点击合成道具，使用物品等
         * @param {number} cmd 协议号
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         * @param {number} [limit] 客户端发送时间限制，默认500毫秒
         */
        public send(cmd: number, data?: any, msgType?: Key, limit?: number) {
            if (RequestLimit.check(cmd, limit)) {
                this._send(cmd, data, msgType);
                if (DEBUG) {
                    let multiSend = $gm.multiSend;
                    for (let i = 0; i < multiSend; i++) {
                        this._send(cmd, data, msgType);
                    }
                }
            }
        }



        /**
         * 即时发送指令
         */
        protected abstract _send(cmd: number, data: any, msgType: Key);

        /**
         * 断开连接
         */
        public disconnect() {
            // TODO
        }

        /**
         * 消极发送指令  
         * 如果使用通协议的指令，有堆积的指令，先合并，新的替换旧的  
         * __`请勿将一些用户操作使用此指令发送`__   
         * 处理一些实时性要求不高的指令，这些指令先缓存堆积，等到用户主动发指令的时候，一起发送  
         * @param {number} cmd 协议号
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         */
        public sendPassive(cmd: number, data?: any, msgType?: Key) {
            //合并同协议的指令
            var pcmdList = this._pcmdList;
            var len = pcmdList.length;
            for (let temp of pcmdList) {
                if (temp.cmd == cmd) {
                    temp.data = data;
                    return;
                }
            }
            //没有同协议的指令，新增数据
            var pdata = recyclable(NetSendData);
            pdata.cmd = cmd;
            pdata.data = data;
            pdata.msgType = msgType;
            //将数据缓存在pcmdList中，等到下次send的时候发送
            this._pcmdList[len] = pdata;
        }

        /**
         * 向缓冲数组中写入数据
         */
        writeToBuffer(bytes: ByteArray, data: NetSendData) {
            let cmd = data.cmd;
            let dat = data.data;
            let type = data.msgType;
            bytes.writeShort(cmd);
            if (dat == undefined) {
                this.writeBytesLength(bytes, 0);
                if (DEBUG) {
                    var outdata = undefined;
                }
            }
            else {
                if (type in NSBytesLen) {
                    this.writeBytesLength(bytes, NSBytesLen[type]);
                }
                if (DEBUG) {
                    outdata = dat;
                }
                switch (type) {
                    case NSType.Null:
                        if (DEBUG) {
                            outdata = undefined;
                        }
                        break;
                    case NSType.Boolean:
                        bytes.writeBoolean(dat);
                        break;
                    case NSType.Double:
                        bytes.writeDouble(dat);
                        break;
                    case NSType.Int32:
                        bytes.writeInt(dat);
                        break;
                    case NSType.Uint32:
                        bytes.writeUnsignedInt(dat);
                        break;
                    case NSType.Int64:
                        bytes.writeInt64(dat);
                        break;
                    case NSType.String:
                        bytes.writeUTF(dat);
                        break;
                    case NSType.Bytes:
                        let b = <ByteArray>dat;
                        bytes.writeUnsignedShort(b.length)
                        bytes.writeBytes(b);
                        if (DEBUG) {
                            outdata = Uint8Array.from(b.bytes);
                        }
                        break;
                    default:
                        let tempBytes = this._tempBytes;
                        tempBytes.clear();
                        if (DEBUG) {
                            outdata = {};
                            PBUtils.writeTo(dat, <string>data.msgType, tempBytes, outdata);
                        } else {
                            PBUtils.writeTo(dat, <string>data.msgType, tempBytes);
                        }
                        this.writeBytesLength(bytes, tempBytes.length)
                        bytes.writeBytes(tempBytes);
                        break;
                }
            }
            if (DEBUG) {
                this.$writeNSLog(Global.now, "send", cmd, outdata);
            }
        }


        /**
         * @param bytes      字节流
         * @param dataSolver 外部数据处理器
         */
        decodeBytes(bytes: ByteArray, dataSolver?: { (list: Recyclable<NetData>[]): any }) {
            let receiveMSG = this._receiveMSG;
            let tmpList = this._tmpList;
            let idx = 0;
            let header = nsHeader;
            let decodeHeader = this.decodeHeader;
            while (true) {
                if (!decodeHeader(bytes, header)) {
                    //回滚
                    break;
                }
                let { cmd, len } = header;
                //尝试读取结束后，应该在的索引
                let endPos = bytes.position + len;
                let type = receiveMSG[cmd];
                if (type !== undefined) {
                    let flag = true;
                    let data = undefined;
                    if (len > 0 && type in NSBytesLen) {
                        let blen = NSBytesLen[type];
                        if (DEBUG && blen != len) {
                            Log(`解析指令时，类型[${type}]的指令长度[${len}]和预设的长度[${blen}]不匹配`);
                        }
                        if (len < blen) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        try {
                            switch (type) {
                                case NSType.Null:
                                    break;
                                case NSType.Boolean:
                                    data = bytes.readBoolean();
                                    break;
                                case NSType.Double:
                                    data = bytes.readDouble();
                                    break;
                                case NSType.Int32:
                                    data = bytes.readInt();
                                    break;
                                case NSType.Uint32:
                                    data = bytes.readUnsignedInt();
                                    break;
                                case NSType.Int64:
                                    data = bytes.readInt64();
                                    break;
                                case NSType.String:
                                    data = bytes.readUTFBytes(len);
                                    break;
                                case NSType.Bytes:
                                    data = bytes.readByteArray(len);
                                    break;
                                default:
                                    data = PBUtils.readFrom(<string>type, bytes, len);
                                    break;
                            }
                        } catch (e) {
                            flag = false;
                            if (DEBUG) {
                                Log(`通信消息解析时cmd[${cmd}]，数据解析出现错误：${e.message}`);
                            }
                        }
                    }
                    if (flag) {
                        //容错用，不管数据解析成功或者失败，将索引移至结束索引
                        let nData = recyclable(NetData);
                        nData.cmd = cmd;
                        nData.data = data;
                        tmpList[idx++] = nData;
                    }
                } else if (DEBUG) {
                    Log(`通信消息解析时cmd[${cmd}]，出现未注册的类型`);
                }
                bytes.position = endPos;
            }

            //调试时,显示接收的数据
            if (DEBUG) {
                var now = Global.now;
                //分发数据
                for (let i = 0; i < idx; i++) {
                    let ndata = tmpList[i];
                    this.$writeNSLog(now, "receive", ndata.cmd, ndata.data);
                }
            }

            if (dataSolver && dataSolver(tmpList)) {
                return
            }

            var router = this._router;
            //分发数据
            for (let i = 0; i < idx; i++) {
                let nData = tmpList[i];
                router.dispatch(nData);
            }
        }

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
        protected decodeHeader(bytes: ByteArray, header: NSHeader) {
            if (bytes.readAvailable < 4) {
                return false;
            }
            //先读取2字节协议号
            header.cmd = bytes.readShort();
            //增加2字节的数据长度读取(这2字节是用于增加容错的，方便即便没有读到type，也能跳过指定长度的数据，让下一个指令能正常处理)
            let len = bytes.readUnsignedShort();
            if (bytes.readAvailable < len) {
                // 回滚
                bytes.position -= 4;
                return false;
            }
            header.len = len;
            return true;
        }

        /**
         * 存储数据长度
         * 
         * @protected
         * @param {ByteArray} bytes 
         * @param {number} val 
         * @memberof NetService
         */
        protected writeBytesLength(bytes: ByteArray, val: number) {
            bytes.writeUnsignedShort(val);
        }

        /**
         * 
         * 模拟服务端
         * @param {number} cmd
         * @param {*} [data]
         */
        public route(cmd: number, data?: any) {
            let nData = recyclable(NetData);
            nData.cmd = cmd;
            nData.data = data;
            this._router.dispatch(nData);
        }
    }
}
