module junyou {
    export interface UnitVO {
    	/**
    	 * 单位的唯一标识
    	 */
        guid: number | string;

        /**
         * 单位的坐标X
         */
        x: number;

        /**
         * 单位的坐标Y
         */
        y: number;
    }
}
