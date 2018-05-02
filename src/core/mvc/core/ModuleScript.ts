namespace jy {
	/**
	 * 模块脚本，后续开发模块，分成多个模块文件
	 * @author 3tion
	 *
	 */
    export class ModuleScript {

        public constructor() {
        }

        /**
        * 脚本id
       */
        public id: string;

        /**
         * 脚本路径
         * 
         * @type {string}
         */
        public url?: string;
        /**
         * 加载状态
         */
        public state: RequestState = RequestState.UNREQUEST;


        /**
         * 回调列表
         */
        public callbacks: CallbackInfo<Function>[] = [];

        /**
         * 已异步方式加载
         */
        public load() {
            if (this.state == RequestState.UNREQUEST) {
                let url = this.url || Facade.Script.substitute(this.id);
                loadScript(url, this.onScriptLoaded, this);
                this.state = RequestState.REQUESTING;
            }
        }

        /**
         * 配置加载完成之后
         */
        protected onScriptLoaded(isError?: boolean) {
            this.state = isError ? RequestState.FAILED : RequestState.COMPLETE;
            let callbacks = this.callbacks.concat();
            this.callbacks.length = 0;
            for (let callback of callbacks) {
                callback.execute();
            }
        }
    }
}
