/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-10 09:48:31
 **/
declare namespace jy {
	export interface MapOvalPB{
		/**
		 * 椭圆的标识
		 */
		id: number;
		/**
		 * 可选参数 横轴长度，如果没有横轴长度，则表示只是一个有标识的点
		 */
		a?: number;
		/**
		 * 可选参数 纵轴长度，没有此值则代表圆形，`a`则为圆形直径
		 */
		b?: number;
		/**
		 * 中心点坐标
		 */
		center: MapPointPB;
	}
}
