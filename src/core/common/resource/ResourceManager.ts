namespace jy {
    const enum ResourceManagerConst {
        /**
         * 默认资源检测时间
         */
        CheckTime = 30000,
        /**
         * 默认销毁时间，5分钟之内资源没有被使用过，直接销毁
         */
        DisposeTime = 300000
    }
    /**
     * 资源管理器
     */

    const _resources: { [index: string]: IResource } = {};

    function get<T extends IResource>(resid: string, noResHandler: { (...args): T }, thisObj?: any, ...args): T
    function get<T extends IResource>(resid: string, noResHandler: { (...args): T }, thisObj?: any): T {
        let res = getResource(resid) as T;
        if (!res) {
            let args = [];
            for (let i = 3; i < arguments.length; i++) {
                args[i - 3] = arguments[i];
            }
            res = noResHandler.apply(thisObj, args);
            regResource(resid, res);
        }
        return res;
    }
    let disposeTime = ResourceManagerConst.DisposeTime;

    export const ResManager = {
        get,
        /**
         * 获取纹理资源
         * 
         * @param {string} resID 资源id
         * @param {boolean} [noWebp] 是否不加webp后缀
         * @returns {TextureResource} 
         */
        getTextureRes(resID: string, noWebp?: boolean): TextureResource {
            let resources = _resources;
            let res = <TextureResource>resources[resID];
            if (res) {
                if (!(res instanceof TextureResource)) {
                    ThrowError(`[${resID}]资源有误，不是TextureResource`);
                    res = undefined;
                }
            }
            if (!res) {
                res = new TextureResource(resID, noWebp);
                resources[resID] = res;
            }
            return res;
        },

        /**
         * 获取资源
         */
        getResource,

        /**
         * 注册资源
         */
        regResource,

        /**
         * 初始化
         * @param time 设置资源销毁的时间(单位：毫秒)，至少大于检查时间 `30秒`  
         */
        init(time: number = ResourceManagerConst.DisposeTime) {
            if (time < ResourceManagerConst.CheckTime) {
                time = ResourceManagerConst.CheckTime;
            }
            disposeTime = time;
            TimerUtil.addCallback(ResourceManagerConst.CheckTime, checkRes);
        },

        /**
         * 强制gc  
         * 清理所有未使用的资源
         */
        gc() {
            disposeRes(res => !res.isStatic);
        },
        /**
         * 从删除特定资源
         */
        disposeRes
    }

    const tobeDele: string[] = [];
    /**
     * 删除资源
     * @param filter 
     */
    function disposeRes(filter: { (res: IResource): boolean }) {
        let reses = _resources;
        let delLen = 0;
        for (let key in reses) {
            let res = reses[key];
            if (filter(res)) {
                tobeDele[delLen++] = key;
            }
        }
        for (let i = 0; i < delLen; i++) {
            let key = tobeDele[i];
            let res = reses[key];
            if (res) {
                res.dispose();
                Res.remove(res.uri);
                delete reses[key];
            }
        }
    }

    /**
     * 检查资源
     */
    function checkRes() {
        let expire = Global.now - disposeTime;
        disposeRes(res => !res.isStatic && res.lastUseTime < expire);
    }


    /**
     * 获取资源
     */
    function getResource(resID: string): IResource {
        return _resources[resID];
    }

    /**
     * 注册资源
     */
    function regResource(resID: string, res: IResource): boolean {
        var resources = _resources;
        if (resID in resources) {//资源id重复                
            return resources[resID] === res;
        }
        resources[resID] = res;
        return true;
    }

}