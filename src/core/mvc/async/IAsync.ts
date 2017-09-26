module junyou {

    const inter1 = "addReadyExecute";
    const inter2 = "startSync";

    export function isIAsync(instance: any): instance is IAsync {
        if (!instance) {
            return false;
        }
        /*不验证数据，因为现在做的是get asyncHelper(),不默认创建AsyncHelper，调用的时候才创建，这样会导致多一次调用*/
        if (!(inter1 in instance || typeof instance[inter1] !== "function") /*|| !(instance[inter1] instanceof AsyncHelper)*/) {
            return false;
        }
        if (!(inter2 in instance) || typeof instance[inter2] !== "function" || (<Function>instance[inter2]).length != 0) {
            return false;
        }
        return true;
    }

	/**
	 * 异步接口
	 * @author  3tion
	 *
	 */
    export interface IAsync {
    	/**
    	 * 方便检查是否实现了IAsync接口
    	 */
        addReadyExecute(handle: Function, thisObj: any, ...args);
        /**
         * 是否已经好了
         */
        isReady: boolean;
        /**
         * 开始尝试同步
         */
        startSync();
    }
}
