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
     * 服务器地址，如：  
     * `xxxx.com`  
     * `xxxxx.com:123`  
     * `192.168.0.140:8888` 
     * `192.168.0.140:8888/gate`  
     * `192.168.0.140:8888/gate/pdk` 
     * `xxxxx.com:123/gate` 
     * @type {string}
     * @memberOf $ep
     */
    host: string;
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