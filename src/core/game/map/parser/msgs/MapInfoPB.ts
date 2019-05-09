/**
 * 使用JunyouProtoTools，从 [文本框中，复制粘贴] 生成
 * 生成时间 2019-05-09 18:03:46
 **/
declare namespace jy {
	export interface MapInfoPB{
		/**
		 * 地图唯一标识
		 */
		id: number;
		/**
		 * 扩展名存储类型
		 */
		extType: number;
		/**
		 * 地图类型 `0` GridMapInfo `1` NavMeshMapInfo
		 */
		type: number;
		/**
		 * 地图宽度
		 */
		width: number;
		/**
		 * 地图高度
		 */
		height: number;
		/**
		 * 特殊地图数据，根据`type`不同，里面数据不同
		 */
		data: ByteArray;
		/**
		 * 可选参数 效果列表
		 */
		effs?: MapEffPB[];
		/**
		 * 可选参数 带标识的导航线/多边形信息
		 */
		lines?: MapLinePB[];
		/**
		 * 可选参数 带标识的椭圆区域
		 */
		ovals?: MapOvalPB[];
	}
}
