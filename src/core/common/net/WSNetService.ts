module junyou {
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
    export class WSNetService extends NetService {

        protected _ws: WebSocket;

        constructor() {
            super();
            //覆盖instance
            NetService._ins = this;
        }

        /**
         * 
         * 设置websocket地址
         * @param {string} actionUrl
         */
        public setUrl(actionUrl: string) {
            if (this._actionUrl != actionUrl) {
                this._actionUrl = actionUrl;
                let ws = this._ws;
                if (ws && ws.readyState <= WebSocket.OPEN) { //已经有连接，重置连接
                    this.connect();
                }
            }
        }

        /**
         * 打开新的连接
         */
        public connect() {
            let ws = this._ws;
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
        }

        protected onOpen = () => {
            this._ws.onopen = null;
            if (DEBUG) {
                console.log("webSocket连接成功");
            }
            dispatch(EventConst.Connected);
        }

        /**
         * 
         * 发生错误
         * @protected
         */
        protected onError = (ev: ErrorEvent) => {
            if (DEBUG) {
                ThrowError("socket发生错误", ev.error);
            }
            dispatch(EventConst.ConnectFailed);
        }

        /**
         * 
         * 断开连接
         * @protected
         */
        protected onClose = (ev: CloseEvent) => {
            if (DEBUG) {
                console.log("socket断开连接");
            }
            egret.callLater(dispatch, junyou, EventConst.Disconnect);
        }

        /**
         * 
         * 收到消息
         * @protected
         */
        protected onData = (ev: MessageEvent) => {
            const readBuffer = this._readBuffer;
            let ab = new Uint8Array(<ArrayBuffer>ev.data);
            let temp: Uint8Array;
            let position = readBuffer.position;
            let buffer = readBuffer.buffer;
            let length = buffer.byteLength;
            if (position < length) {//还有剩余未读取的数据
                let rb = new Uint8Array(buffer);
                let rbLen = length - position;
                let abLen = ab.length;
                temp = new Uint8Array(rbLen + abLen);
                let i = 0, m: number;
                for (m = 0; m < rbLen; m++) {
                    temp[i++] = rb[position + m];
                }
                for (m = 0; m < abLen; m++) {
                    temp[i++] = ab[m];
                }
            } else {
                temp = ab;
            }
            readBuffer.replaceBuffer(temp.buffer);
            readBuffer.position = 0;
            this.decodeBytes(readBuffer);
        }

        protected _send(cmd: number, data: any, msgType: string) {
            let ws = this._ws;
            if (ws.readyState != WebSocket.OPEN) {
                return;
            }
            //没有同协议的指令，新增数据
            var pdata = recyclable(NetSendData);
            pdata.cmd = cmd;
            pdata.data = data;
            pdata.msgType = msgType;
            var sendBuffer = this._sendBuffer;
            sendBuffer.reset();
            this.writeToBuffer(sendBuffer, pdata);
            pdata.recycle();
            var pcmdList = this._pcmdList;
            for (let pdata of pcmdList) {
                this.writeToBuffer(sendBuffer, pdata);
                pdata.recycle();
            }
            //清空被动数据
            pcmdList.length = 0;
            ws.send(sendBuffer.outBytes);
        }
    }
}