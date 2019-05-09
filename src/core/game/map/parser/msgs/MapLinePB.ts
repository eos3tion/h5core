/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:02:53
 **/
declare namespace jy {
	export interface MapLinePB{
		/**
		 * 线的标识
		 */
		id: number;
		/**
		 * 可选参数 线上的点
		 */
		points?: MapPointPB[];
		/**
		 * 可选参数 是否为封闭的区域，即最后一个点，是否会和第一个点连上
		 */
		flag?: boolean;
		/**
		 * 可选参数 默认为直线，后续用于支持曲线（可能使用赫米特差值算法补差值,或者直接当特定点为贝塞尔的控制点）
		 */
		type?: number;
	}
}
