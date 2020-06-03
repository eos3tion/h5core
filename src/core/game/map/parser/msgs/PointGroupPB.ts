/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2020-06-03 23:02:32
 **/
declare namespace jy {
    export interface PointGroupPB {
		/**
		 * 点集标识
		 */
        id: string;
		/**
		 * 可选参数 有序点集
		 */
        points?: MapPointPB[];
    }
}