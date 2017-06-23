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
	D_H_M_S = 0,
	H_M_S,
	H_M,
	M_S,
	S
}

module junyou {
	/**
     * DateUtils
     */
	export class DateUtils {

		/**
		 * CountDownFormat
		 * 
		 * @static
		 * @param {number} format
		 * @returns {*}
		 * 
		 * @memberOf DateUtils
		 */
		public static getCDFormat(format: number): any {
			if (format == CountDownFormat.D_H_M_S) {
				return { d: LangUtil.getMsg("$_ndays"), h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") };
			}
			else if (format == CountDownFormat.H_M_S) {
				return { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") };
			}
			else if (format == CountDownFormat.H_M) {
				return { h: LangUtil.getMsg("$_nhours"), m: LangUtil.getMsg("$_nminutes") };
			}
			else if (format == CountDownFormat.M_S) {
				return { m: LangUtil.getMsg("$_nminutes"), s: LangUtil.getMsg("$_nsecends") };
			}
			else if (format == CountDownFormat.S) {
				return { s: LangUtil.getMsg("$_nsecends") };
			}
		}

		public static readonly sharedDate = new Date();
		/**
		 * 基于UTC的时间偏移
		 * 
		 * @private
		 * @static
		 * @type {number}
		 */
		private static _utcOffset: number;

		/**
		 * 服务器UTC偏移后的基准时间
		 * 
		 * @private
		 * @static
		 * @type {number}
		 */
		private static _serverUTCTime: number;

		/**
		 * 初始化服务器时间
		 * 
		 * @static
		 * @param {number} time 服务器时间戳
		 * @param {number} timezoneOffset 服务器基于UTC的时区偏移
		 */
		public static initServerTime(time: number, timezoneOffset: number) {
			DateUtils._utcOffset = -timezoneOffset * Time.ONE_MINUTE;
			this.setServerTime(time);
		}

		/**
		 * 设置服务器时间
		 * 用于同步服务器时间
		 * @static
		 * @param {number} time
		 */
		public static setServerTime(time: number) {
			DateUtils._serverUTCTime = time - Date.now() + DateUtils._utcOffset;
		}

		/**
		 * 通过UTC偏移过的当前时间戳
		 * 
		 * @static
		 */
		public static get serverTime() {
			return DateUtils._serverUTCTime + Date.now();
		}

		/**
		 * 获取当前时间戳，用于和服务端的时间戳进行比较
		 * 
		 * @readonly
		 * @static
		 */
		public static get rawServerTime() {
			return this.serverTime - DateUtils._utcOffset;
		}

		/**
		 * 通过UTC偏移过的当前时间戳的Date对象
		 */
		public static get serverDate() {
			let date = DateUtils.sharedDate;
			date.setTime(DateUtils.serverTime);
			return date;
		}

		/**
		 * 项目中，所有时间都需要基于UTC偏移处理
		 * 
		 * @static
		 * @param {number} utcTime (description)
		 * @param {string} format (description)
		 * @returns (description)
		 */
		public static getFormatTime(utcTime: number, format: string) {
			let d = DateUtils.sharedDate;
			d.setTime(utcTime);
			return d.format(format);
		}


		/**
		 * 获取指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
		 * 
		 * @static
		 * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
		 * @returns {number} 指定时间的当天结束(23:59:59'999)UTC强制偏移时间戳
		 */
		public static getDayEnd(utcTime?: number) {
			if (utcTime === void 0) utcTime = DateUtils.serverTime;
			let d = DateUtils.sharedDate;
			d.setTime(utcTime);
			return d.setUTCHours(23, 59, 59, 999);
		}

		/**
		 * 获取指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
		 * 
		 * @static
		 * @param {number} [utcTime] 指定的utc偏移后的时间，不设置时间，则取当前服务器时间
		 * @returns {Date} 指定时间的当天开始的UTC(0:0:0'0)强制偏移时间戳
		 */
		public static getDayStart(utcTime?: number) {
			if (utcTime === void 0) utcTime = DateUtils.serverTime;
			let d = DateUtils.sharedDate;
			d.setTime(utcTime);
			return d.setUTCHours(0, 0, 0, 0);
		}

		/**
		 * 将服务器有偏移量的时间戳，转换成显示时间相同的UTC时间戳，用于做显示
		 * 
		 * @static
		 * @param {number} time 正常的时间戳
		 * @returns {number} UTC偏移后的时间戳
		 */
		public static getUTCTime(time: number) {
			return time + DateUtils._utcOffset;
		}

		/**
		 * 显示倒计时
		 * 
		 * @static
		 * @param {number} leftTime 剩余时间
		 * @param {{ d?: string, h?: string, m?: string, s?: string }} format 倒计时修饰符，
		 * format 示例：{d:"{0}天",h:"{0}小时",m:"{0}分",s:"{0}秒"}
		 */
		public static getCountdown(leftTime: number, format: { d?: string, h?: string, m?: string, s?: string }) {
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
}