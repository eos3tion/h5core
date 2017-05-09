module junyou {
    /**
     * TimveVO
     */
    export class TimeVO {
        /**
         * 配置的小时
         * 
         * @type {number}
         */
        public hour: number;
        /**
         * 配置的分钟
         * 
         * @type {number}
         */
        public minute: number;

        /**
         * 小时和分钟的时间偏移
         * 
         * @type {number}
         */
        public time: number;
        /**
         * 日期原始字符串
         */
        public strTime: string;

        constructor(timeStr?: string) {
            if (timeStr) {
                this.decode(timeStr);
            }
        }

        /**
         * 从分钟进行解析
         * 
         * @param {number} minutes 分钟数
         */
        public decodeMinutes(minutes: number) {
            return this._decode(minutes / 60 | 0, minutes % 60);
        }

        /**
         * 从一个数值进行序列化
         * decodeMinutes和decodeBit，如果使用protobuf writeVarint32 存储，时间只要超过 02:08，不管如何使用何种方式，一定会超过2字节，而 23:59，不管怎么存储，都不会超过2字节 
         * decodeBit解析比 decodeMinutes更加快捷
         * 而 hour<<6|minute  解析会更简单，快速
         * @param {number} value 
         */
        public decodeBit(value: number) {
            return this._decode(value >> 6, value & 63);
        }

        /**
         * 解析数据
         * 
         * @private
         * @param {number} hour 
         * @param {number} minute
         * @returns 
         */
        private _decode(hour: number, minute: number) {
            this.hour = hour;
            this.minute = minute;
            this.time = hour * Time.ONE_HOUR + minute * Time.ONE_MINUTE;
            this.strTime = hour.zeroize(2) + ":" + minute.zeroize(2);
            return this;
        }

        /**
         * 从字符串中解析
         * 
         * @param {number} strTime 通过解析器解析的数据
         */
        public decode(strTime: string) {
            var timeArr: string[] = strTime.split(":");
            if (timeArr.length >= 2) {
                return this._decode(+timeArr[0], +timeArr[1]);
            } else {
                ThrowError("时间格式不正确，不为HH:mm格式，当前配置：" + strTime);
            }
        }

        /**
        * 获取今日的服务器时间
        * 
        * @readonly
        * 
        * @memberOf TimeVO
        */
        public get todayTime() {
            return DateUtils.getDayStart() + this.time;
        }

    }
}