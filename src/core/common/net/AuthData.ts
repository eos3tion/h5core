module junyou {
	/**
	 * 平台数据
	 * @author 3tion
	 *
	 */
    export class AuthData {

    	/**
    	 * 平台标识
    	 */
        public pid: string;
        /**
         * 平台账号
         */
        public puid: string;
        /**
         * 服务器标识
         */
        public sid: number;
        /**
         * 会话标识
         */
        public sessionID: string;

        /**
         * 验证信息
         */
        public sign: string;

        /**
         * 认证次数
         * 
         * @type {number}
         * @memberOf AuthData
         */
        public count: number = 0;

        /**
         * 
         * 如果是老账号，有角色列表
         * @type {{ sid: number, _id: number, lastLogin: number }[]}
         */
        public roles: { sid: number, _id: number, lastLogin: number }[];

        public constructor() {
        }

        public toURLString() {
            return "pid=" + encodeURIComponent(this.pid) + "&puid=" + encodeURIComponent(this.puid) +
                "&sid=" + this.sid + "&sign=" + encodeURIComponent(this.sign);
        }
    }
}
