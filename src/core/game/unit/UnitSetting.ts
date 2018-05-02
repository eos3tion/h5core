namespace jy {
	export class UnitSetting {

	    /**
		 * 是否添加UI层
		 */
		public hasUILayer = true;

		/**
		 * 是否添加Buff容器
		 */
		public hasBuffLayer = true;

		/**
		 * 是否添加光环容器
		 */
		public hasHaloLayer = true;

        /**
		 * 是否添加到游戏场景中
		 */
		public addToEngine = true;

		//防止同一坐标的单位排序深度相同，出现闪烁的情况
		public getDepth() {
			return this.depthA + Math.random() * this.depthB;
		}
		/**
		 * 深度的参数A
		 */
		public depthA = 0;
		/**
		 * 深度的参数B
		 */
		public depthB = 0.19;
	}

	/**
	 * 默认的单位设置
	 */
	export const defaultUnitSetting = new UnitSetting();
}
