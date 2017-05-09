const enum StatsState {
    /**
     *游戏初始完成
    */
    GAME_INIT_COMPLETE = 4,
    /**
     *配置完成
     */
    CONFIG_COMPLETE,
    /**
     *资源完成
     */
    RES_COMPLETE,
    /**
     *帐号登录完成
     */
    GAME_LOGIN_COMPLETE,
    /**
     *创建角色
     */
    ROLE_CREATE,
    /**
     *角色登陆完成
     */
    ROLE_LOGIN_COMPLETE
}