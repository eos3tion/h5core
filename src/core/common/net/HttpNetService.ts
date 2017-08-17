module junyou {
	/**
	 * 使用http进行通信的网络服务
	 * @author 3tion
	 *
	 */
    export class HttpNetService extends NetService {

        protected _loader: XMLHttpRequest;

        protected _state: RequestState = RequestState.UNREQUEST;

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
        protected _success: number = 0;

        /**
         * 请求连续发送失败的次数
         */
        protected _cerror: number = 0;

        /**
         * 请求失败次数
         */
        protected _error: number = 0;


        public constructor() {
            super();
            //覆盖instance
            NetService._ins = this;
            this._unsendRequest = [];
            this._sendingList = [];
            this._loader = getXHR();
        }

        /**
         * 重置
         * @param actionUrl             请求地址
         * @param autoTimeDelay         自动发送的最短延迟时间
         */
        public setUrl(actionUrl: string, autoTimeDelay: number = 5000) {
            this._actionUrl = actionUrl;
            if (autoTimeDelay != this._autoTimeDelay) {
                this._autoTimeDelay = autoTimeDelay;
            }
            // 200毫秒检查一次，是否可以自动拉数据了
            TimerUtil.addCallback(200, this.checkUnsend, this);
            var loader = this._loader;
            loader.onreadystatechange = this.onReadyStateChange.bind(this);
            loader.ontimeout = this.errorHandler.bind(this);
        }
        /**
        * @protected
        */
        protected onReadyStateChange(): void {
            var xhr = this._loader;
            if (xhr.readyState == 4) {// 4 = "loaded"
                var ioError = (xhr.status >= 400 || xhr.status == 0);
                // var url = this._actionUrl;
                var self = this;
                setTimeout(function (): void {
                    if (ioError) {//请求错误
                        self.errorHandler();
                    }
                    else {
                        self.complete();
                    }
                }, 0)
            }
        }

        /**
         * 发生错误
         */
        protected errorHandler() {
            this._error++;
            this._cerror++;
            this._state = RequestState.FAILED;

            if (this._cerror > 1) {
                this.showReconnect();
                return;
            }
            //曾经成功过
            //数据未发送成功
            var sending = this._sendingList;
            var idx = sending.length;
            var unrequest = this._unsendRequest;
            for (let pdata of unrequest) {
                sending[idx++] = pdata;
            }
            //交互未发送的请求和发送中的请求列表
            unrequest.length = 0;
            this._unsendRequest = sending;
            this._sendingList = unrequest;
            //尝试重新发送请求
            this.checkUnsend();
        }

        protected complete() {
            this._state = RequestState.COMPLETE;
            this._reconCount = 0;
            //处理Response
            var readBuffer = this._readBuffer;
            readBuffer.replaceBuffer(this._loader.response);
            readBuffer.position = 0;
            
            //成功一次清零连续失败次数
            this._cerror = 0;
            this._success++;

            //清理正在发送的数据            
            for (let pdata of this._sendingList) {
                pdata.recycle();
            }
            //数据发送成功
            this._sendingList.length = 0;
            this.onBeforeSolveData();

            this.decodeBytes(readBuffer);
            this.checkUnsend();
        }

        /**
         * 检查在发送过程中的请求
         */
        protected checkUnsend() {
            //有在发送过程中，主动发送的数据
            if (this._unsendRequest.length || Global.now > this._nextAutoTime) {
                this.trySend();
            }
        }

        protected _send(cmd: number, data: any, msgType: string) {
            //没有同协议的指令，新增数据
            var pdata = recyclable(NetData);
            pdata.cmd = cmd;
            pdata.data = data;
            pdata.msgType = msgType;
            this._unsendRequest.push(pdata);
            this.trySend();
        }

        /**
         * 发送消息之前，用于预处理一些http头信息等
         * 
         * @protected
         */
        protected onBeforeSend() {

        }

        /**
         * 接收到服务端Response，用于预处理一些信息
         * 
         * @protected
         */
        protected onBeforeSolveData(){

        }

        /**
         * 尝试发送
         */
        protected trySend() {
            if (this._state == RequestState.REQUESTING) {
                return;
            }
            this._state = RequestState.REQUESTING;
            var loader = this._loader;
            loader.open("POST", this._actionUrl, true);
            loader.responseType = "arraybuffer";
            this.onBeforeSend();
            var sendBuffer = this._sendBuffer;
            sendBuffer.clear();
            // var sendPool = this._sendDataPool;
            var unsend = this._unsendRequest;
            var sending = this._sendingList;
            // sendBuffer.writeUTFBytes(this._authData.sessionID);
            // sendBuffer.writeDouble(this._lastMid);
            for (var i = 0, len = unsend.length; i < len; i++) {
                let pdata = unsend[i];
                this.writeToBuffer(sendBuffer, pdata);
                sending[i] = pdata;
            }
            var pcmdList = this._pcmdList;
            for (let pdata of pcmdList) {
                this.writeToBuffer(sendBuffer, pdata);
                sending[i++] = pdata;
            }
            //清空被动数据
            pcmdList.length = 0;
            //清空未发送的数据
            unsend.length = 0;
            loader.send(sendBuffer.buffer);
            //重置自动发送的时间
            this._nextAutoTime = Global.now + this._autoTimeDelay;
        }

    }
}