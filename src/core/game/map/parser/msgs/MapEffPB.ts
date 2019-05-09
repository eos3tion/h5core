/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:02:53
 **/
declare namespace jy {
	export interface MapEffPB{
		/**
		 * 资源路径
		 */
		uri: string;
		/**
		 * 层级标识
		 */
		layer: number;
		/**
		 * 坐标x
		 */
		x: number;
		/**
		 * 坐标y
		 */
		y: number;
		/**
		 * 缩放X的100倍
		 */
		scaleX: number;
		/**
		 * 缩放Y的100倍
		 */
		scaleY: number;
		/**
		 * 可选参数 移动效果的持续时间参数
		 */
		duration?: number;
		/**
		 * 可选参数 x方向的移动速度
		 */
		speedX?: number;
		/**
		 * 可选参数 y方向的移动速度
		 */
		speedY?: number;
		/**
		 * 可选参数 用于同步移动的时间种子
		 */
		seed?: number;
	}
}
