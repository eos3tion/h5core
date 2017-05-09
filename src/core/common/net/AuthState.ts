module junyou {
        /**
         * 用户认证
         * @author 3tion
         *
         */
        export const enum AuthState {
                /**
                 * 认证成功
                 */
                AUTH_SUCCESS = 0,
                /**
                 * 票据验证失败，要求客户端重新登录
                 */
                AUTH_FAILED = 1,

                /**
                 * 认证服务器忙
                 */
                AUTH_SERVER_BUSY = 2,
        }
}
