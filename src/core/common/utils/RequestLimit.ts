module junyou {
    export interface RequestLimit {
        /**
         * @private
         * 
         * @type {{
         *             [index: string]: number;
         *         }}
         * @memberOf RequestLimit
         */
        _dic: {
            [index: string]: number;
        };

        /**
         * 
         * 
         * @param {(string | number)} o     锁定的对像(可以是任何类型,它会被当做一个key)
         * @param {number} [time=500]       锁定对像 毫秒数，默认500毫秒
         * @returns {boolean}   是否已解锁 true为没有被限制,false 被限制了
         * 
         * @memberOf RequestLimit
         */
        check(o: string | number, time?: number): boolean;
        /**
         * 移除锁定
         * 
         * @param {(string | number)} o
         * 
         * @memberOf RequestLimit
         */
        remove(o: string | number): void;
    }
	/**
	 * 请求限制
	 * @author 3tion
	 *
	 */
    export const RequestLimit = {

        _dic: <{ [index: string]: number }>{},

		/**
		 * @param o 锁定的对像(可以是任何类型,它会被当做一个key)
		 * @param time 锁定对像 毫秒数
		 * @return 是否已解锁 true为没有被限制,false 被限制了
		 *
		 */
        check(this: RequestLimit, o: number | string, time = 500) {
            let dic = this._dic;
            let t = dic[o];
            let now = Global.now;
            if (!t) {
                dic[o] = time + now;
                return true;
            }

            let i: number = t - now;
            if (i > 0) {
                return false;
            }

            dic[o] = time + now;
            return true;
        },

        /**
         * 删除 
         * @param o
         *
         */
        remove(this: RequestLimit, o: number | string) {
            delete this._dic[o];
        }
    }
}
