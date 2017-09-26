module junyou {

	/**
	 * 视图控制器，持有视图<br/>
	 * 持有Proxy，主要监听视图和Proxy的事件，变更面板状态<br/>
	 * @author 3tion
	 *
	 */
    export abstract class Mediator extends ViewController {


		/**
		 * 视图加载完成
		 */
        protected _preViewReady: boolean;

        /**
         * 视图
         */
        $view: IModulePanel;



        /**
         *  获取视图
         */
        public get view() {
            return this.$view;
        }

        public set view(value: IModulePanel) {
            let old = this.$view;
            if (old != value) {
                this.removeSkinListener(old);
                this.$view = value;
                this.addSkinListener(value);
                value.moduleID = this._name;
                if (isIAsync(value)) {
                    value.addReadyExecute(this.preViewCompleteHandler, this);
                }
            }
        }



        /**
         * 开始尝试同步
         */
        public startSync() {
            if (isIAsync(this.$view)) {
                const async = this.$view;
                if (async.isReady) {
                    this.preViewCompleteHandler();
                } else {
                    async.addReadyExecute(this.preViewCompleteHandler, this);
                    async.startSync();
                }
            }
        }

        /**
         * 
         * 视图加载完毕
         * @protected
         */
        protected preViewCompleteHandler() {
            this._preViewReady = true;
            if (this._dependerHelper) {//不创建
                this._dependerHelper.check();
            } else {
                this.dependerReadyCheck();
            }
        }

        /**
         * Creates an instance of Mediator.
         * 
         * @param {string | number} moduleID 模块ID
         */
        public constructor(moduleID: string | number) {
            super(moduleID);
            this.init && this.init();
        }

        /**
         * 用于写加载数据和加载创建视图的代码
         * 
         * @protected
         * @abstract
         */
        protected init?();

        /**
         * 
         * 依赖项完毕后检查
         * @protected
         * @returns
         */
        protected dependerReadyCheck() {
            if (!this._preViewReady) {
                return;
            }
            if (!this._ready) {
                this._ready = true;
                this.afterAllReady();
                if (this._asyncHelper) {
                    this._asyncHelper.readyNow();
                }
            }
        }

        /**
         * 关闭Mediator控制的面板
         * 
         */
        hide(...arg);
        hide() {
            toggle(this._name, ToggleState.HIDE);
        }
    }
}
