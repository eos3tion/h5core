/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:02:53
 **/
declare namespace jy {
	export interface MapOvalPB{
		/**
		 * 椭圆的标识
		 */
		id: number;
		/**
		 * 横轴长度
		 */
		a: number;
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
