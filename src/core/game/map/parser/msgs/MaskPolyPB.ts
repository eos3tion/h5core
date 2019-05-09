/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:02:53
 **/
declare namespace jy {
	export interface MaskPolyPB{
		/**
		 * 可选参数 多边形的点集
		 */
		points?: MapPointPB[];
		/**
		 * 可选参数 如果alpha数据(0-100)，100代表不透明，0代表完全透明
		 */
		data?: number;
	}
}
