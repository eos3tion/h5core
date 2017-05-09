module junyou {
    export class UnitSetting {

		private static _setting: UnitSetting;

		/**
		 * 获取默认设置
		 * 
		 * @readonly
		 * @static
		 */
		public static get default() {
			return this._setting = this._setting || new UnitSetting;
		}

	    /**
		 * 是否添加UI层
		 */
        public hasUILayer: boolean = true;

		/**
		 * 是否添加Buff容器
		 */
        public hasBuffLayer: boolean = true;

		/**
		 * 是否添加光环容器
		 */
        public hasHaloLayer: boolean = true;

        /**
		 * 是否添加到游戏场景中
		 */
        public addToEngine: boolean = true;

        //防止同一坐标的单位排序深度相同，出现闪烁的情况
        public getDepth(): number {
            return this.depthA + Math.random() * this.depthB;
        }
		/**
		 * 深度的参数A
		 */
        public depthA: number = 0;
		/**
		 * 深度的参数B
		 */
        public depthB: number = 0.19;
    }
}
