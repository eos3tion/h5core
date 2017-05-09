module junyou {
	/**
	 * 默认的Tip
	 * 手指按下控件以后，弹出Tip进行显示
	 * @author 3tion
	 *
	 */
	export class ToolTipManager {

		/**
		 * 默认皮肤
		 * 在项目中进行设置
		 * @static
		 * @type {IToolTipSkin}
		 */
		public static defaultTip: IToolTip;

		/**
		 * 按住多少毫秒后显示Tip
		 * 
		 * @static
		 * @type {number}
		 */
		public static touchTime: number = 500;

		/**
		 * 当前显示在舞台上的ToolTip
		 * 
		 * @private
		 * @static
		 * @type {IToolTipSkin}
		 */
		private static _currentSkin: IToolTip;

		private static _map = new Map<egret.DisplayObject, Recyclable<ToolTipData>>();

		/**
		 * 注册可视对象，消息和皮肤的绑定
		 * 
		 * @static
		 * @param {egret.DisplayObject} dis 添加Tip的目标
		 * @param {*} msg 要显示的内容
		 * @param {IToolTip} [tooltip] Tip的皮肤，如果不填，则使用默认皮肤
		 * @return {boolean} true 注册成功  false注册失败
		 */
		public static register(dis: egret.DisplayObject, msg: any, tooltip?: IToolTip, container?: egret.DisplayObjectContainer) {
			if (!tooltip) {
				tooltip = ToolTipManager.defaultTip;
				if (!tooltip) {
					if (DEBUG) {
						ThrowError("没有注册ToolTip的皮肤，并且没有默认的ToolTip");
					}
					return false;
				}
			}
			let map = ToolTipManager._map;
			let data = map.get(dis);
			if (!data) {
				data = recyclable(ToolTipData);
				map.set(dis, data);
			}
			if (!container) {
				container = GameEngine.instance.getLayer(GameLayerID.Tip);
			}
			data.register(dis, msg, tooltip, container);
			return true;
		}


		/**
		 * 显示Tip，如果msg有内容，刷新Tip上的内容
		 * 
		 * @static
		 * @param {egret.DisplayObject} dis
		 * @param {*} [msg] 
		 */
		public static show(dis: egret.DisplayObject, msg?: any, container?: egret.DisplayObjectContainer) {
			let data = ToolTipManager._map.get(dis);
			if (msg) {
				data.data = msg;
			}
			let tooltip = data.tooltip;
			if (!tooltip) {
				tooltip = ToolTipManager.defaultTip;
			}
			if (tooltip) {
				tooltip.setTipData(data.data);
				if (!container) {
					container = data.con;
				}
				tooltip.show(container);
				this._currentSkin = tooltip;
			}
		}

		/**
		 * 刷新当前Tip绑定的内容，*`不改变显示状态`*   
		 * 如果要刷新并显示，请使用 ToolTipManager.show
		 * 
		 * @static
		 * @param {egret.DisplayObject} dis (description)
		 * @param {*} msg (description)
		 */
		public static refresh(dis: egret.DisplayObject, msg: any) {
			let data = ToolTipManager._map.get(dis);
			data.data = msg;
			let tooltip = data.tooltip;
			if (!tooltip) {
				tooltip = ToolTipManager.defaultTip;
			}
			if (tooltip) {
				tooltip.setTipData(data.data);
			}
		}

		/**
		 * 移除视图和ToolTip的绑定
		 * 
		 * @static
		 * @param {egret.DisplayObject} dis 可视对象
		 */
		public static remove(dis: egret.DisplayObject) {
			let data = ToolTipManager._map.get(dis);
			data.recycle();
		}

	}
}
