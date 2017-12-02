module junyou {
	try {
		var supportWebp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
	} catch (err) { }

	const _webp = supportWebp ? Ext.WEBP : "";
	if (_webp) {
		RES.registerAnalyzer("webp", RES.ImageAnalyzer);
	}

	var _isNative = egret.Capabilities.supportVersion != "Unknown";

	/**
	 *  当前这一帧的时间
	 */
	let now = 0;


	/**
	 * 按照帧，应该走的时间
	 * 每帧根据帧率加固定时间
	 * 用于处理逐帧同步用
	 */
	let frameNow = 0;



	let _callLater = new CallLater();

	const tweenManager = new TweenManager();

	let _nextTicks: CallbackInfo<Function>[] = [];


	/**
	 * 注入白鹭的全局Ticker
	 */
	function initTick() {
		//@ts-ignore
		let ticker = egret.ticker || egret.sys.$ticker as any;
		let update = ticker.render;
		let delta = 0 | 1000 / ticker.$frameRate;
		let temp: CallbackInfo<Function>[] = [];
		ticker.render = function () {
			let _now = Date.now();
			let dis = _now - now;
			now = _now;
			if (dis > 2000) {
				//有2秒钟大概就是进入过休眠了
				dispatch(EventConst.Awake);
				frameNow = _now;
			} else {
				frameNow += delta;
			}
			//执行顺序  nextTick  callLater TimerUtil  tween  最后是白鹭的更新
			let len = _nextTicks.length;
			let tmp = temp;
			for (let i = 0; i < len; i++) {
				tmp[i] = _nextTicks[i];
			}
			_nextTicks.length = 0;
			//先复制再操作是为了防止回调过程中，有新增的nextTick
			for (let i = 0; i < len; i++) {
				tmp[i].execute();
			}
			_callLater.tick(_now);
			TimerUtil.tick(_now);
			tweenManager.tick(dis);
			update.call(ticker);
		}
	}

	function nextTick(callback: Function, thisObj?: any, ...args) {
		_nextTicks.push(CallbackInfo.get(callback, thisObj, ...args));
	}

	/**
	 * 延迟执行
	 * 
	 * @static
	 * @param {Function} callback (description)
	 * @param {number} [time] 延迟执行的时间
	 * @param {*} [thisObj] (description)
	 * @param args (description)
	 */
	function callLater(callback: Function, time?: number, thisObj?: any, ...args) {
		return _callLater.callLater(callback, now, time, thisObj, ...args);
	}

	/**
	 * 清理延迟
	 * 
	 * @static
	 * @param {Function} callback (description)
	 * @param {*} [thisObj] (description)
	 * @returns (description)
	 */
	function clearCallLater(callback: Function, thisObj?: any) {
		return _callLater.clearCallLater(callback, thisObj);
	}

	/**
	 * 获取Tween
	 * 
	 * @static
	 * @param {*} target 要对那个对象做Tween处理
	 * @param {TweenOption} props Tween的附加属性 (如： `{loop:true, paused:true}`).
	 * All properties default to `false`. Supported props are:
	 * <UL>
	 *    <LI> loop: sets the loop property on this tween.</LI>
	 *    <LI> useTicks: uses ticks for all durations instead of milliseconds.</LI>
	 *    <LI> ignoreGlobalPause: sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on
	 *    this tween.</LI>
	 *    <LI> override: if true, `createjs. this.removeTweens(target)` will be called to remove any other tweens with
	 *    the same target.
	 *    <LI> paused: indicates whether to start the tween paused.</LI>
	 *    <LI> position: indicates the initial position for this tween.</LI>
	 *    <LI> onChange: specifies a listener for the {{#crossLink "Tween/change:event"}}{{/crossLink}} event.</LI>
	 * </UL>
	 * @param {*} pluginData 插件数据
	 * @param {boolean} override 是否覆盖
	 * @returns {Tween} tween的实例
	 */
	function getTween(target: any, props?: TweenOption, pluginData?: any, override?: boolean) {
		return tweenManager.get(target, props, pluginData, override);
	}

	/**
	 * 移除指定的Tween
	 * 
	 * @param {Tween} tween
	 * @returns
	 */
	function removeTween(tween: Tween) {
		return tweenManager.removeTween(tween);
	}

	function removeTweens(target: any) {
		return tweenManager.removeTweens(target);
	}
	/**
	 * 动画的全局对象
	 * @author 3tion
	 *
	 */
	export const Global = {
		initTick, nextTick, callLater, clearCallLater, getTween, removeTween, removeTweens,
		get isNative() {
			return _isNative;
		},
		tweenManager,
		/**
		 *  当前这一帧的时间
		 */
		get now() {
			return now;
		},
		/**
		 * 按照帧，应该走的时间
		 * 每帧根据帧率加固定时间
		 * 用于处理逐帧同步用
		 */
		get frameNow() {
			return frameNow;
		},
		/**
		 * 是否支持webp
		 */
		get webp() {
			return _webp;
		}
	};
}