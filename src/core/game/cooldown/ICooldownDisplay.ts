module junyou {
    /**
     * 冷却显示对象接口
     * @author pb
     */
    export interface ICooldownDisplay {

		/**
		 * 受到CD管理器影响时刷新 
		 * @param 时间增量
		 */
        doRender(delta:number): void;

		/*
		 * 绑定组件皮肤
         * 添加遮罩到组件皮肤
		 * @param 组件皮肤
		 */
		bind(target: egret.Sprite): void;

		/**
         * 解除绑定组件皮肤
         */
		unbind(): void;

		/**
		 * 添加 
		 * @param 总cd时间
		 */
		add(cdTotalTime:number): void;

		/**
		 * 移除 
		 * 
		 */
        remove(): void;

		/**
		 * 销毁 
		 * 
		 */
        dispose(): void;
    }
}