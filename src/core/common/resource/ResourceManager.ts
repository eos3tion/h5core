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

        //按时间检测资源
        init() {
            let tobeDele: string[] = [];
            TimerUtil.addCallback(ResourceManagerConst.CheckTime, () => {
                let expire = Global.now - ResourceManagerConst.DisposeTime;
                let reses = _resources;
                let delLen = 0;
                for (let key in reses) {
                    let res = <IResource>reses[key];
                    if (!res.isStatic && res.lastUseTime < expire) {
                        tobeDele[delLen++] = key;
                    }
                }
                // //对附加的checker进行检查
                // for (let i = 0; i < _checkers.length; i++) {
                //     _checkers[i].resCheck(expire);
                // }
                for (let i = 0; i < delLen; i++) {
                    let key = tobeDele[i];
                    let res = <IResource>reses[key];
                    if (res) {
                        res.dispose();
                        Res.remove(res.uri);
                        delete reses[key];
                    }
                }
            });
        }
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