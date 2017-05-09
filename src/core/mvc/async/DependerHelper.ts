module junyou {
	/**
	 * 依赖项的辅助类
	 * @author 3tion
	 *
	 */
	export class DependerHelper {

		protected _unreadyDepender: IAsync[];

    	/**
    	 * 处理是谁使用了依赖项
    	 */
		protected _host: any;

    	/**
    	 * 回调函数
    	 */
		protected _callback: Function;

		protected _args: any[];

		protected _uncheck: boolean;

		/**
		 * 
		 * @param host          调用项
		 * @param callback      回调函数         回调函数的thisObj会使用host来处理
		 * @param thisObj       回调函数的this
		 * @param args
		 */
		public constructor(host: any, callback: Function, ...args) {
			this._host = host;
			this._callback = callback;
			this._args = args;
			this._unreadyDepender = [];
		}


		/**
		 * 添加依赖
		 * @param async
		 */
		public addDepend(async: IAsync) {
			if (async.isReady) {
				this.readyHandler(async);
			}
			else {
				this._unreadyDepender.push(async);
				async.addReadyExecute(this.readyHandler, this, async);
			}
		}

		/**
		 * 一个依赖项处理完成
		 */
		protected readyHandler(async: IAsync) {
			this._unreadyDepender.remove(async);
			this.check();
		}

		/**
		 * 检查依赖项是否已经完成，会在下一帧做检查
		 */
		public check() {
			if (!this._uncheck) {
				this._uncheck = true;
				egret.callLater(this._check, this);
			}
		}

		/**
		 * 检查依赖项是否已经完成
		 */
		protected _check() {
			this._uncheck = false;
			var allReady = true;
			for (let async of this._unreadyDepender) {
				if (!async.isReady) {
					async.startSync();
					allReady = false;
				}
			}
			if (allReady && this._callback) {
				this._unreadyDepender.length = 0;
				this._callback.apply(this._host, this._args);
			}
		}
	}
}
