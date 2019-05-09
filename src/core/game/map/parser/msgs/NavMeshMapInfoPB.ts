/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:02:53
 **/
declare namespace jy {
	export interface NavMeshMapInfoPB{
		/**
		 * 可选参数 所有的点数据
		 */
		points?: MapPointPB[];
		/**
		 * 可选参数 所有三角形对应点的索引数据
		 */
		trians?: TPointIdxPB[];
		/**
		 * 可选参数 不可走区域的三角形数据
		 */
		polys?: PolyPointIdxPB[];
		/**
		 * 可选参数 透明/遮罩区域对应的数据
		 */
		masks?: MaskPolyPB[];
	}
}
