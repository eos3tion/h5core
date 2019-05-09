/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:03:46
 **/
declare namespace jy {
	export interface GridMapInfoPB{
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
	}
}
