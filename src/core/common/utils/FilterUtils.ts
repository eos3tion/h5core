module junyou {

    export interface FilterUtilsType {
        /**
		 * 共享灰度滤镜列表
		 */
        gray: egret.Filter[];
        /**共享暗淡滤镜 */
        dark: egret.Filter[];
        /**共享模糊滤镜 */
        blur: egret.Filter[];
    }

    /**
     * 滤镜辅助
     * 
     * @export
     * @class FilterUtils
     */
    export const FilterUtils: FilterUtilsType = {


        gray: [new egret.ColorMatrixFilter([0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0])],


        dark: [new egret.ColorMatrixFilter([0.5, 0, 0, 0, 6.75, 0, 0.5, 0, 0, 6.75, 0, 0, 0.5, 0, 6.75, 0, 0, 0, 1, 0])],


        blur: [new egret.BlurFilter(5, 5)]
    }
}
