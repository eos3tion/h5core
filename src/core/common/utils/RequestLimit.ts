namespace jy {
    export interface RequestLimitType {
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

    let _dic = {} as { [index: string]: number };
	/**
	 * 请求限制
	 * @author 3tion
	 *
	 */
    export const RequestLimit: RequestLimitType = {

        /**
         * 
         * 
         * @param {Key} o 锁定的对像(可以是任何类型,它会被当做一个key)
         * @param {number} [time=500] 锁定对像 毫秒数
         * @returns 是否已解锁 true为没有被限制,false 被限制了
         */
        check(o: Key, time = 500) {
            time = time | 0;
            if (time <= 0) {
                return true;
            }
            let t = _dic[o];
            let now = Global.now;
            if (!t) {
                _dic[o] = time + now;
                return true;
            }
            let i = t - now;
            if (i > 0) {
                return false;
            }
            _dic[o] = time + now;
            return true;
        },

        /**
         * 删除 
         * @param o
         *
         */
        remove(o: Key) {
            delete _dic[o];
        }
    }
}
