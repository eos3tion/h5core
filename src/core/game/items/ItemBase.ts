module junyou {
    /**
     * 君游项目的道具基类
     * @author 3tion
     */
    export abstract class ItemBase<T extends IItemCfg> {
        /**
         * 道具全局标识（对于无交易的游戏，此标识为玩家唯一）
         */
        public guid: number;

        /**
         * 过期时间戳(单位ms)，如果为0或者NaN则永不过期
         * 
         * @type {number}
         */
        public expired: number;

        /**
         * 格位
         * 
         * @type {number}
         */
        public slot: number;

        /**
         * 物品数量
         * 
         * @type {number}
         */
        public count: number;

        /**
         * 道具配置
         * 
         * @type {T}
         */
        public cfg: T;

        public get id(): number {
            var cfg = this.cfg;
            return cfg ? cfg.id : undefined;
        }

        public get order(): number {
            var cfg = this.cfg;
            return cfg ? cfg.order : NaN;
        }

        /**
         * 消耗物品
         * 
         * @param {number} [count=1] 消耗物品数量
         * @param {number} [func=0] 处理类型
         */
        public consume(count = 1, func = 0) {
            if (this.checkItem()) {
                this._consume(count, func);
            }
        }

        protected abstract _consume(count: number, func: number);

        public checkItem(showTip = true) {
            return true;
        }

        /**
         * 检查物品是否过期<br/>
         * 
         * @param {number} now 要检查的时间
         * @returns {boolean} true  物品没有过期，可以使用<br/>
         *                    false 物品已经过期，不可以使用<br/>
         */
        public checkExpire(now?: number) {
            return !this.expired || now < this.expired;
        }
    }
}