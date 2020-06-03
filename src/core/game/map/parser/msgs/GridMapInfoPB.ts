/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2020-06-03 23:02:32
 **/
declare namespace jy {
	export interface GridMapInfoPB {
		/**
		 * 格子列数
		 */
		columns: number;
		/**
		 * 格子行数
		 */
		rows: number;
		/**
		 * 格子宽度
		 */
		gridWidth: number;
		/**
		 * 格子高度
		 */
		gridHeight: number;
		/**
		 * 可选参数 格子是否可走的数据
		 */
		pathdata?: ByteArray;
		/**
		 * 可选参数 格子透明度数据
		 */
		alphadata?: ByteArray;
		/**
		 * 可选参数 格子中路径占用的位数(1bit,2bit,4bit,8bit)
		 */
		pdatabit?: number;
		/**
		 * 可选参数 点集数据
		 */
		points?: PointGroupPB[];
	}
}