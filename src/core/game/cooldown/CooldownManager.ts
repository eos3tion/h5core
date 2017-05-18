module junyou {
    /**
     * 时间冷却管理器
     * @author pb
     */
    export class CooldownManager {
        /**
         * 全部cooldown集合
         * 技能id为key
         * @private
         * @type {{ [index: number]: Cooldown }}
         * @memberOf CooldownManager
         */
        private _cdObj: { [index: number]: Cooldown };
        /**
         * 运行中的cd列表
         * 
         * @private
         * @type {Cooldown[]}
         * @memberOf CooldownManager
         */
        private _cdArr: Cooldown[];

        private _disObj: { [index: number]: ICooldownDisplay };

        constructor() {
            this._cdObj = {};
            this._cdArr = [];
            this._disObj = {};
        }

        /**
         * 添加CD绑定的显示对象
         * 
         * @param {number} id
         * @param {ICooldownDisplay} icdDisplay
         * 
         * @memberOf CooldownManager
         */
        public addDisplay(id: number, icdDisplay: ICooldownDisplay) {
            let cd = this._cdObj[id];
            if (cd) {
                cd.addICDDisplay(icdDisplay);
                this._disObj[id] = icdDisplay;
            }
        }

        /**
         * 删除某CD绑定的显示对象
         * 
         * @param {number} id
         * 
         * @memberOf CooldownManager
         */
        public removeDisplay(id: number) {
            let cd: Cooldown = this._cdObj[id];
            if (cd) {
                let icdDisplay = this._disObj[id];
                if (icdDisplay) {
                    cd.removeICDDisplay(icdDisplay);
                }
                delete this._disObj[id];
            }
        }

        /**
         * 数据处理
         * 
         * @param {number} delta 时间增量
         * 
         * @memberOf CooldownManager
         */
        public doData(delta: number) {
            if (this._cdArr.length > 0) {
                let cdArr: Cooldown[] = this._cdArr;
                let len: number = cdArr.length;
                let cd: Cooldown;
                for (let index = len - 1; index >= 0; index--) {
                    cd = cdArr[index];
                    if (cd) {
                        cd.doData(delta);
                        if (cd.state == CooldownState.STOP)
                            this._cdArr.splice(index, 1);
                    }
                }
            }
        }

        /**
         * 渲染处理
         * 
         * @param {number} delta 时间增量
         * 
         * @memberOf CooldownManager
         */
        public doRender(delta: number) {
            if (this._cdArr.length > 0) {
                let cdArr: Cooldown[] = this._cdArr;
                let len: number = cdArr.length;
                let cd: Cooldown;
                for (let index = len - 1; index >= 0; index--) {
                    cd = cdArr[index];
                    if (cd) {
                        cd.doRender(delta);
                    }
                }
            }
        }

        /**
         * 添加CD
         * 
         * @param {ICooldown} icd 比如技能配置
         * @param {ICooldownDisplay} [icdDisplay] 和cd绑定的显示对象 比如技能cd遮罩
         * 
         * @memberOf CooldownManager
         */
        public add(icd: ICooldown, icdDisplay?: ICooldownDisplay) {
            if (icd && icd.cd) {
                let cooldown: Cooldown = new Cooldown();
                cooldown.icd = icd;
                let id = icd.id;
                this._cdObj[id] = cooldown;
                if (icdDisplay) {
                    this.addDisplay(id, icdDisplay);
                }
                this._cdArr.push(cooldown);
            }
        }

        public start(id: number) {
            let cooldown = this._cdObj[id];
            if (cooldown) {
                cooldown.start();
            }
        }

        /**
         * 移除CD
         * 如果绑定过显示对象也会移除
         * 
         * @param {number} id
         * 
         * @memberOf CooldownManager
         */
        public remove(id: number) {
            if (id) {
                let cooldown: Cooldown = this._cdObj[id];
                if (cooldown) {
                    cooldown.stop();
                    this._cdArr.remove(cooldown);
                }
                this.removeDisplay(id);
            }
        }

        /**
         * 移除某cd时间的所有Cooldown
         * 
         * @param {number} cd
         * 
         * @memberOf CooldownManager
         */
        public removeByCDTime(cd: number) {
            if (cd) {
                let cdObj = this._cdObj;
                let cooldown: Cooldown;
                for (let id in cdObj) {
                    cooldown = cdObj[id];
                    if (cooldown && cooldown.icd && cooldown.icd.cd == cd) {
                        this.remove(+id);
                    }
                }
            }
        }

        // /**
        //  * 重置CD时间<br/>
        //  * 由于基于服务器时间戳，<font color='#ff0000'><b>需要等拿到服务器时间戳以后</b></font>，才可以进行CD的设置
        //  * @param serverData		<br/>
        //  * 	key		String		cdid<br/>
        //  * 	value	Number	CD到期的服务器时间戳
        //  *
        //  */
        // public reset(serverData: Object) {
        //     let serverTime: number = DateUtils.serverTime;
        //     let cdObj = this._cdObj;
        //     let cooldown: Cooldown;
        //     let expireTime: number;
        //     let leftTime: number;
        //     for (let id in serverData) {
        //         cooldown = cdObj[id];
        //         if (cooldown) {
        //             //停止cd
        //             cooldown.stop();
        //             this._cdArr.remove(cooldown);
        //             expireTime = serverData[id] || 0;
        //             //剩余时间
        //             leftTime = expireTime - serverTime;
        //             cooldown.icd.cd = leftTime;
        //         }
        //     }
        // }

        /**
         * 销毁某个CD
         * 
         * @param {number} id
         * 
         * @memberOf CooldownManager
         */
        public dispose(id: number) {
            if (id) {
                let cd = this._cdObj[id];
                if (cd) {
                    cd.dispose();
                    this._cdArr.remove(cd);
                }
                delete this._cdObj[id];
            }
        }

        /**
         * 销毁全部CD
         * 
         * @memberOf CooldownManager
         */
        public disposeAll() {
            let cdObj = this._cdObj;
            for (let id in cdObj) {
                let cd = cdObj[id];
                if (cd) {
                    cd.dispose();
                }
            }
            this._cdArr.length = 0;
            this._cdObj = {};
            this._disObj = {};
        }

    }
}