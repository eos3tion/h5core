namespace jy {
	try {
		var supportWebp = (window as any).supportWebp == false ? false : document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;
	} catch (err) { }

	const _webp = supportWebp ? Ext.WEBP : "";

	var _isNative = egret.Capabilities.engineVersion != "Unknown";

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

	let _intervals: CallbackInfo<Function>[] = [];


	/**
	 * 注入白鹭的全局Ticker
	 */
	function initTick() {
		//@ts-ignore
		let ticker = egret.ticker as any;
		let update = ticker.render;
		let delta = 0 | 1000 / ticker.$frameRate;
		let temp: CallbackInfo<Function>[] = [];

		ticker.render = function (triggerByFrame, costTicker) {
			let _now = Date.now();
			let dis = _now - now;
			now = _now;
			if (dis > 500) {
				if (dis > 2000) {
					//有2秒钟大概就是进入过休眠了
					dispatch(EventConst.Awake);
				} else {
					dispatch(EventConst.SlowRender);
				}
				console.log(`上次执行时间和当前时间差值过长[${dis}]`);
				frameNow = _now;
			} else {
				frameNow += delta;
			}
			if (DEBUG) {
				$();
			} else if (RELEASE) {
				try {
					$();
				}
				catch (e) {
					ThrowError(`ticker.render`, e);
				}
			}
			return;
			function $() {
				//执行顺序  nextTick  callLater TimerUtil  tween  最后是白鹭的更新
				let len = _intervals.length;
				for (let i = 0; i < len; i++) {
					let cb = _intervals[i];
					cb.execute(false);
				}
				len = _nextTicks.length;
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
				update.call(ticker, triggerByFrame, costTicker);
			}
		}
	}


	function nextTick(callback: Function, thisObj?: any, ...args) {
		nextTick2(CallbackInfo.get(callback, thisObj, ...args))
	}

	function nextTick2(callback: $CallbackInfo) {
		_nextTicks.push(callback);
	}

	export interface GlobalInstance {
		initTick: () => void;
		nextTick: (callback: Function, thisObj?: any, ...args: any[]) => void;
		nextTick2: (callback: CallbackInfo<Function>) => void;
		/**
		 * 延迟执行
		 * @param {Function} callback 回调函数
		 * @param {number} [time=0] 延迟执行的时间
		 * @param {*} [thisObj] 回调的`this`指针
		 * @param args 回调参数列表
		 */
		callLater(callback: Function, time?: number, thisObj?: any, ...args: any[]);
		/**
		 * 延迟执行
		 * @param {$CallbackInfo} callback 回调函数
		 * @param {number} [time=0] 延迟执行的时间
		 */
		callLater2(callback: $CallbackInfo, time?: number);
		/**
		 * 清理延迟
		 * @param {Function} callback 回调函数
		 * @param {*} [thisObj]  回调的`this`指针
		 */
		clearCallLater(callback: Function, thisObj?: any);
		/**
		 * 清理延迟
		 * @param {$CallbackInfo} callback 要清理的回调
		 */
		clearCallLater2(callback: $CallbackInfo)
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
		getTween(target: any, props?: TweenOption, pluginData?: any, override?: boolean): Tween;
		/**
		 * 移除指定的Tween
		 * 
		 * @param {Tween} tween
		 * @returns
		 */
		removeTween(tween: Tween);
		/**
		 * 移除指定目标的所有Tween
		 * 
		 * @param {any} target
		 * @returns
		 */
		removeTweens(target: any);
		/**
		 * 判断是否为Native的版本
		 */
		readonly isNative: boolean;
		tweenManager: TweenManager;
		/**
		 *  当前这一帧的时间
		 */
		readonly now: number;
		/**
		 * 按照帧，应该走的时间
		 * 每帧根据帧率加固定时间
		 * 用于处理逐帧同步用
		 */
		readonly frameNow: number;
		/**
		 * 是否支持webp
		 */
		readonly webp: "" | Ext.WEBP;
		/**
		 * 添加每帧执行回调
		 */
		addInterval(callback: CallbackInfo<Function>): void;
		/**
		 * 移除每帧执行回调
		 */
		removeInterval(callback: CallbackInfo<Function>): void;
	}

	/**
	 * 动画的全局对象
	 * @author 3tion
	 *
	 */
	export const Global: GlobalInstance = {
		initTick,
		nextTick,
		nextTick2,

		callLater(callback: Function, time?: number, thisObj?: any, ...args) {
			return _callLater.callLater(callback, now, time, thisObj, ...args);
		},

		clearCallLater(callback: Function, thisObj?: any) {
			return _callLater.clearCallLater(callback, thisObj);
		},
		callLater2(callback: $CallbackInfo, time?: number) {
			return _callLater.callLater2(callback, now, time);
		},

		clearCallLater2(callback: $CallbackInfo) {
			return _callLater.clearCallLater2(callback);
		},
		getTween(target: any, props?: TweenOption, pluginData?: any, override?: boolean) {
			return tweenManager.get(target, props, pluginData, override);
		},

		removeTween(tween: Tween) {
			return tweenManager.removeTween(tween);
		},
		removeTweens(target: any) {
			return tweenManager.removeTweens(target);
		},
		get isNative() {
			return _isNative;
		},
		tweenManager,
		get now() {
			return now;
		},
		get frameNow() {
			return frameNow;
		},
		get webp() {
			return _webp;
		},
		addInterval(callback: $CallbackInfo) {
			_intervals.pushOnce(callback);
		},

		removeInterval(callback: $CallbackInfo) {
			_intervals.remove(callback);
		},
	};
}