module junyou {
	/**
	 *
	 * @author 3tion
	 *
	 */
    export class NetRouter {

        /**
         * key      协议号<br/>
         * value    NetBin的数组
         */
        private _listenerMaps: { [index: number]: NetBin[] };

        public constructor() {
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
        public register(cmd: number, handler: INetHandler, priority = 0, once = false): boolean {
            const listenerMaps = this._listenerMaps;
            let netBin = { handler, priority, once };
            let list = listenerMaps[cmd];
            if (!list) {
                list = [];
                listenerMaps[cmd] = list;
                //以前单条是没有存储优先级信息的，会导致，如果先加入的大的，后加入小的，可能会出现问题
                list.push(netBin);
            } else {
                let i: number;
                let len = list.length;

                //=====同样的CODE 同样的Function 不会被注册多次=====
                for (i = 0; i < len; i++) {
                    let temp = list[i];
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
        }

		/**
		 * 删除兼听处理器
		 * @param cmd      协议号
		 * @param handler   处理器
		 * @return boolean true 删除成功  <br/>
		 *                 false 没有这个兼听
		 */
        public remove(cmd: number, handler: INetHandler) {
            let listenerMaps = this._listenerMaps;
            let list = listenerMaps[cmd];
            if (!list) {
                return false;
            }
            let len = list.length;
            for (let i = 0; i < len; i++) {
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
        }

        private dispatchList: NetBin[] = [];

        /**
        * 调用列表
        */
        public dispatch(data: Recyclable<NetData>) {
            egret.callLater(this._dispatch, this, data);
        }
        private _dispatch(data: Recyclable<NetData>) {
            let cmd = data.cmd;
            let list = this._listenerMaps[cmd];
            if (!list) {
                return;
            }
            let dispatchList = this.dispatchList;
            let idx = 0, len = list.length;
            for (; idx < len; idx++) {
                dispatchList[idx] = list[idx];
            }
            if (DEBUG) {//DEBUG的直接报错，方便调试
                for (let i = 0; i < idx; i++) {
                    let bin = dispatchList[i];
                    bin.handler(data);
                    if (bin.once) {//如果只执行一次的，就移除
                        this.remove(cmd, bin.handler);
                    }
                    if (data.stopPropagation) {
                        break;
                    }
                }
            } else {//正式版的进行try catch，防止因为一个指令影响后续指令
                for (let i = 0; i < idx; i++) {
                    let bin = dispatchList[i];
                    try {
                        bin.handler(data);
                    } catch (e) {
                        ThrowError(`NetHander Error:${JSON.stringify(data)}`, e);
                    }
                    if (bin.once) {//如果只执行一次的，就移除
                        this.remove(cmd, bin.handler);
                    }
                    if (data.stopPropagation) {
                        break;
                    }
                }
            }
            data.recycle();
        }
    }

	/**
	 * 协议处理函数
	 */
    export interface INetHandler { (data: NetData): void };

    interface NetBin {

        /**
         * 协议处理函数
         */
        handler: INetHandler;

        /**
         * 优先级
         */
        priority: number;

        /**
         * 是否只执行一次
         */
        once: boolean;
    }
}
