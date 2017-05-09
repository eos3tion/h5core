module junyou {
    /**
     * 滤镜辅助
     * 
     * @export
     * @class FilterUtils
     */
    export const FilterUtils = {

        /**
		 * 共享灰度滤镜列表
		 */
        gray: [new egret.ColorMatrixFilter([0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0])],

        /**暗淡滤镜 */
        dark: [new egret.ColorMatrixFilter([0.5, 0, 0, 0, 6.75, 0, 0.5, 0, 0, 6.75, 0, 0, 0.5, 0, 6.75, 0, 0, 0, 1, 0])],

        /**模糊滤镜 */
        blur: [new egret.BlurFilter(5,5)]
    }
}
