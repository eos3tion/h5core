const enum Time {
	/**
	 * 一秒
	 */
	ONE_SECOND = 1000,
	/**
	 * 五秒
	 */
	FIVE_SECOND = 5000,
	/**
	 * 一分种
	 */
	ONE_MINUTE = 60000,
	/**
	 * 五分种
	 */
	FIVE_MINUTE = 300000,
	/**
	 * 半小时
	 */
	HALF_HOUR = 1800000,
	/**
	 * 一小时
	 */
	ONE_HOUR = 3600000,
	/**
	 * 一天
	 */
	ONE_DAY = 86400000
}

const enum CountDownFormat {
	/**
	 * { d: LangUtil.getMsg("$_ndays"), h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") }
	 */
	D_H_M_S = 0,
	/**
	 * { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") }
	 */
	H_M_S,
	/**
	 *  { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes") }
	 */
	H_M,
	/**
	 * { m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") }
	 */
	M_S,
	/**
	 * { s: LangUtil.getMsg("$_nsecends") }
	 */
	S
}

module junyou {

	/**
	 * 倒计时的格式选项
	 * 
	 * @export
	 * @interface CountDownFormatOption
	 */
	export interface CountDownFormatOption {
		/**
		 * 
		 * 剩余天数的修饰字符串  
		 * 如： `{0}天`
		 * @type {string}@memberof CountDownFormatOption
		 */
		d?: string,
		/**
		 * 剩余小时的修饰字符串  
		 * 如：`{0}小时`
		 * 
		 * @type {string}@memberof CountDownFormatOption
		 */
		h?: string,
		/**
		 * 剩余分钟的修饰字符串  
		 * 如：`{0}分钟`
		 * 
		 * @type {string}@memberof CountDownFormatOption
		 */
		m?: string,
		/**
		 * 剩余秒数的修饰字符串  
		 * 如：`{0}秒`
		 * 
		 * @type {string}@memberof CountDownFormatOption
		 */
		s?: string
	}

	export interface DateUtilsInterface {
        /**
         * CountDownFormat
         *
         * @static
         * @param {number} format
         * @returns {*}
         *
         * @memberOf DateUtils
         */
		getDefaultCDFOption(format: number): CountDownFormatOption;
		/**
		 * 注册默认的CD格式，方便后续调用
		 * 
		 * @param {CountDownFormat} format 
		 * @param {CountDownFormatOption} opt 
		 */
		regCDFormat(format: CountDownFormat, opt: CountDownFormatOption);
        /**
         * 初始化服务器时间
         *
         * @static
         * @param {number} time 服务器时间戳
         * @param {number} timezoneOffset 服务器基于UTC的时区偏移
         */
		initServerTime(time: number, timezoneOffset: number): void;
        /**
         * 设置服务器时间
         * 用于同步服务器时间
         * @static
         * @param {number} time
         */
		setServerTime(time: number): void;
        /**
         * 通过UTC偏移过的当前时间戳
         *
         * @static
         */
		readonly serverTime: number;
        /**
         * 获取当前时间戳，用于和服务端的时间戳进行比较
         *
         * @readonly
         * @static
         */
		readonly rawServerTime: number;
        /**
         * 通过UTC偏移过的当前时间戳的Date对象
         */
		readonly serverDate: Date;
        /**
         * 项目中，所有时间都需要基于UTC偏移处理
         *
         * @static
         * @param {number} time			要格式化的时间，默认为UTC时间
         * @param {string} format 		  格式字符串 yyyy-MM-dd HH:mm:ss
         * @param {boolean} [isRaw=true] 	是否为原始未使用utc偏移处理的时间，默认 true
         * @returns
         */
		getFormatTime(time: number, format: string, isRaw?: boolean): string;
        /**
         * 获取指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {number} 指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
         */
		getDayEnd(utcTime?: number): number;
        /**
         * 获取指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         *
         * @static
         * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
         * @returns {Date} 指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
         */
		getDayStart(utcTime?: number): number;
        /**
         * 将服务器有偏移量的时间戳，转换成显示时间相同的UTC时间戳，用于做显示
         *
         * @static
         * @param {number} time 正常的时间戳
         * @returns {number} UTC偏移后的时间戳
         */
		getUTCTime(time: number): number;
        /**
         * 显示倒计时
         *
         * @static
         * @param {number} leftTime 剩余时间
         * @param {{ d?: string, h?: string, m?: string, s?: string }} format 倒计时修饰符，
         * format 示例：{d:"{0}天",h:"{0}小时",m:"{0}分",s:"{0}秒"}
         */
		getCountdown(leftTime: number, format: CountDownFormatOption): string;
	}

	/**
	 * 时间处理函数
	 * DateUtils
	 */
	export const DateUtils: DateUtilsInterface = (function () {
		const _sharedDate = new Date();

		let _defaultCountFormats: { [index: number]: CountDownFormatOption };
		/**
		 * 基于UTC的时间偏移
		 * 
		 * @private
		 * @static
		 * @type {number}
		 */
		let _utcOffset = -_sharedDate.getTimezoneOffset() * Time.ONE_MINUTE;//默认使用当前时区，防止一些报错

		/**
		 * 服务器UTC偏移后的基准时间
		 * 
		 * @private
		 * @static
		 * @type {number}
		 */
		let _serverUTCTime = _utcOffset;//默认使用本地时间

		return {
			get sharedDate() {
				return _sharedDate;
			},
			getDefaultCDFOption,
			/**
			 * 注册默认的CD格式，方便后续调用
			 * 
			 * @param {CountDownFormat} format 
			 * @param {CountDownFormatOption} opt 
			 */
			regCDFormat(format: CountDownFormat, opt: CountDownFormatOption) {
				initDefaultCDFormats();
				_defaultCountFormats[format] = opt;
			},
			/**
			 * 初始化服务器时间
			 * 
			 * @static
			 * @param {number} time 服务器时间戳
			 * @param {number} timezoneOffset 服务器基于UTC的时区偏移  单位：分钟
			 */
			initServerTime(time: number, timezoneOffset: number) {
				_utcOffset = -timezoneOffset * Time.ONE_MINUTE;
				this.setServerTime(time);
			},

			/**
			 * 设置服务器时间
			 * 用于同步服务器时间
			 * @static
			 * @param {number} time
			 */
			setServerTime(time: number) {
				_serverUTCTime = time - Date.now() + _utcOffset;
			},

			/**
			 * 通过UTC偏移过的当前时间戳
			 * 
			 * @static
			 */
			get serverTime() {
				return _serverUTCTime + Date.now();
			},

			/**
			 * 获取当前时间戳，用于和服务端的时间戳进行比较
			 * 
			 * @readonly
			 * @static
			 */
			get rawServerTime() {
				return this.serverTime - _utcOffset;
			},

			/**
			 * 通过UTC偏移过的当前时间戳的Date对象
			 */
			get serverDate() {
				_sharedDate.setTime(this.serverTime);
				return _sharedDate;
			},

			/**
			 * 项目中，所有时间都需要基于UTC偏移处理
			 * 
			 * @static
			 * @param {number} time			要格式化的时间，默认为UTC时间 
			 * @param {string} format 		  格式字符串 yyyy-MM-dd HH:mm:ss
			 * @param {boolean} [isRaw=true] 	是否为原始未使用utc偏移处理的时间，默认 true
			 * @returns 
			 */
			getFormatTime(time: number, format: string, isRaw = true) {
				if (isRaw) {
					time = this.getUTCTime(time);
				}
				_sharedDate.setTime(time);
				return _sharedDate.format(format);
			},


			/**
			 * 获取指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
			 * 
			 * @static
			 * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
			 * @returns {number} 指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
			 */
			getDayEnd(utcTime?: number) {
				if (utcTime === undefined) utcTime = this.serverTime;
				_sharedDate.setTime(utcTime);
				return _sharedDate.setUTCHours(23, 59, 59, 999);
			},

			/**
			 * 获取指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
			 * 
			 * @static
			 * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
			 * @returns {Date} 指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
			 */
			getDayStart(utcTime?: number) {
				if (utcTime === undefined) utcTime = this.serverTime;
				_sharedDate.setTime(utcTime);
				return _sharedDate.setUTCHours(0, 0, 0, 0);
			},

			/**
			 * 将服务器有偏移量的时间戳，转换成显示时间相同的UTC时间戳，用于做显示
			 * 
			 * @static
			 * @param {number} time 正常的时间戳
			 * @returns {number} UTC偏移后的时间戳
			 */
			getUTCTime(time: number) {
				return time + _utcOffset;
			},

			/**
			 * 显示倒计时
			 * 
			 * @static
			 * @param {number} leftTime 剩余时间
			 * @param {CountDownFormatOption} format 倒计时修饰符，
			 * format 示例：{d:"{0}天",h:"{0}小时",m:"{0}分",s:"{0}秒"}
			 */
			getCountdown(leftTime: number, format: CountDownFormatOption | CountDownFormat) {
				if (typeof format === "number") {
					format = getDefaultCDFOption(format);
				}
				let out = "";
				let tmp = format.d;
				if (tmp) {// 需要显示天
					let day = leftTime / Time.ONE_DAY >> 0;
					leftTime = leftTime - day * Time.ONE_DAY;
					out += tmp.substitute(day);
				}
				tmp = format.h;
				if (tmp) {// 需要显示小时
					let hour = leftTime / Time.ONE_HOUR >> 0;
					leftTime = leftTime - hour * Time.ONE_HOUR
					out += tmp.substitute(hour);
				}
				tmp = format.m;
				if (tmp) {// 需要显示分钟
					let minute = leftTime / Time.ONE_MINUTE >> 0;
					leftTime = leftTime - minute * Time.ONE_MINUTE;
					out += tmp.substitute(minute);
				}
				tmp = format.s;
				if (tmp) {
					let second = leftTime / Time.ONE_SECOND >> 0;
					out += tmp.substitute(second);
				}
				return out;
			}
		}
		/**
		 * CountDownFormat
		 * 获取默认的`倒计时`格式
			$_ndays	{0}天  
			$_nhours	{0}小时  
			$_nminutes	{0}分钟  
			$_nsecends	{0}秒  

		 * @static
		 * @param {CountDownFormat} format
		 * @returns {CountDownFormatOption}
		 * 
		 * @memberOf DateUtils
		 */
		function getDefaultCDFOption(format: CountDownFormat): CountDownFormatOption {
			if (initDefaultCDFormats()) {
				DateUtils.getDefaultCDFOption = _getDefaultCDFOption;
			}
			return _getDefaultCDFOption(format);
			function _getDefaultCDFOption(format) {
				return _defaultCountFormats[format];
			}
		}

		function initDefaultCDFormats() {
			if (!_defaultCountFormats) {
				let LangUtil = junyou.LangUtil;
				_defaultCountFormats = {
					[CountDownFormat.D_H_M_S]: { d: LangUtil.getMsg("$_ndays"), h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") },
					[CountDownFormat.H_M_S]: { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") },
					[CountDownFormat.H_M]: { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes") },
					[CountDownFormat.M_S]: { m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") },
					[CountDownFormat.S]: { s: LangUtil.getMsg("$_nsecends") }
				}
				return true;
			}
		}
	})()
}