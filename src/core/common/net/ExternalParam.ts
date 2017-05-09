interface ExternalParam {
    /**
     * 用户标识
     * 
     * @type {string}
     * @memberOf $ep
     */
    uid: string;
    /**
     * 服务器id
     * 
     * @type {string}
     * @memberOf $ep
     */
    sid: string;
    /**
     * 服务器ip
     * 
     * @type {string}
     * @memberOf $ep
     */
    ip: string;
    /**
     * 端口号
     * 
     * @type {number}
     * @memberOf $ep
     */
    port: number;
    /**
     * 平台标识
     * 
     * @type {string}
     * @memberOf $ep
     */
    pid: string;

    /**
     * 验证标识
     * 
     * @type {string}
     * @memberOf $ep
     */
    sign?: string;

    /**
     * 其他参数
     * 
     * @type {*}
     * @memberOf $ep
     */
    other?: any;
}