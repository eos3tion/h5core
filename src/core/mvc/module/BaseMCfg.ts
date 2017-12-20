module junyou {
    /**
     * 功能配置的基类
     * @author 3tion
     */
    export class BaseMCfg {

        /**
         * 当前显示状态
         */
        showState: ModuleShowState = ModuleShowState.HIDE;

		/**
		 * 服务器认为此功能开放
		 */
        serverOpen: boolean = true;
        showtype: number;
		/**
		 * 显示限制数据
		 */
        showlimits: any[];

		/**
		 * 使用限制数据
		 */
        limits: any[];
        limittype: number;
        /**
         * 
         * 子模块的id列表
         * @type {string[]}
         */
        children: string[];

        constructor() {
        }

        protected init(from?: any) {
            from = from || this;
            //解析显示限制
            DataUtils.parseDatas(this, from, 0, 3, "showlimit", "showlimits");
            this.showtype = from.showtype;
            //解析功能使用限制
            DataUtils.parseDatas(this, from, 0, 3, "limit", "limits");
            this.limittype = from.showtype;
        }
    }
}