module junyou {
    /**
     * 用于和服务端通信的数据
     * @author 3tion
     */
    export abstract class Service extends Proxy {

        protected _ns: NetService;

        constructor(name: string | number) {
            super(name);
        }

        public onRegister() {
            this._ns = NetService.get();
        }

        _startSync(): void {
            // Service默认为同步，如果需要收到服务端数据的，重写此方法
            this.selfReady();
        }

        /**
         * 注册消息引用
         * 
         * @protected
         * @param {string | number} ref 消息实例的引用
         * @param cmds 注册的指令
         */
        protected regMsg(ref: string | number, ...cmds) {
            let ns = this._ns;
            for (let cmd of cmds) {
                ns.regReceiveMSGRef(cmd, ref);
            }
        }

        /**
         * 注册消息处理函数
         * 
         * @protected
         * @param {{ (data: NetData): void }} handler   消息处理函数
         * @param {number[]} cmds 注册的指令
         */
        protected regHandler(handler: { (data: NetData): void }, ...cmds: number[]) {
            let ns = this._ns;
            for (let cmd of cmds) {
                ns.register(cmd, handler);
            }
        }

        protected removeHandler(cmd: number, handler) {
            this._ns.remove(cmd, handler)
        }

        /**
         * 发送消息
         * 
         * @protected
         * @param {number} cmd 指令
         * @param {any} [data] 数据，简单数据(number,boolean,string)复合数据
         * @param {string} [msgType] 如果是复合数据，必须有此值
         * @param {number} [limit=200] 最短发送时间
         */
        protected send(cmd: number, data?: any, msgType?: string | number, limit = 200): void {
            this._ns.send(cmd, data, msgType, limit);
        }
    }
}