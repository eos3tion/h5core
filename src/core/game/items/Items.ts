module junyou {
    /**
     * 道具处理，遍历工具类
     * @author 3tion
     */
    export class Items {

        /**
         * Key      {number}        格位编号
         * Value    {ItemBase}     道具实现
         * @type {{[index:number]:IItem}}
         */
        public bySlot: { [index: number]: ItemBase<IItemCfg> } = {};

        /**
         * Key      {number}    格位唯一标识
         * Value    {ItemBase}     道具实现
         * @type {{ [index: number]: ItemBase }}
         */
        public byGuid: { [index: number]: ItemBase<IItemCfg> } = {};

        /**
         * 基于格位类型的字典
         * Key      {number}    格位类型
         * Value    {SlotType}  格位类型的数据
         * @type {{ [index: number]: SlotType }}
         */
        public bySlotType: { [index: number]: SlotType } = [];

        constructor() {

        }

        /**
         * 遍历所有物品，使用handler处理
         * 
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} handler 遍历时使用的函数
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns 
         */
        public forEach(handler: { (item: ItemBase<IItemCfg>, ...args) }, slotType: number = 0, ...otherParams) {
            let slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                ThrowError("无法找到指定的格位数据");
                return;
            }

            let end = slotInfo.lock;
            let bySlot = this.bySlot;
            for (let i = slotInfo.begin; i < end; i++) {
                let item = bySlot[i];
                handler(item, ...otherParams);
            }
        }

        /**
         * 遍历物品列表，检查是否有符合条件
         * 
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} handler 检测函数
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns true        成功通过检查
         *          false       所有道具未通过检查
         */
        public checkFor(handler: { (item: ItemBase<IItemCfg>, ...args) }, slotType: number = 0, ...otherParams) {
            let slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                ThrowError("无法找到指定的格位数据");
                return false;
            }

            let end = slotInfo.lock;
            let bySlot = this.bySlot;
            for (let i = slotInfo.begin; i < end; i++) {
                let item = bySlot[i];
                if (handler(item, ...otherParams)) {
                    return true;
                }
            }
            return true;
        }

        /**
         * 获取符合条件的物品总数量
         * 
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} filter 过滤器
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns {number} 符合物品的数量
         */
        public getCount(filter: { (item: ItemBase<IItemCfg>, ...args) }, slotType: number = 0, ...otherParams) {
            let slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                ThrowError("无法找到指定的格位数据");
                return 0;
            }
            let count = 0;
            let end = slotInfo.lock;
            let bySlot = this.bySlot;
            for (let i = slotInfo.begin; i < end; i++) {
                let item = bySlot[i];
                if (filter(item, ...otherParams)) {
                    count++;
                }
            }
            return count;
        }

        /**
         * 遍历物品列表，检查是否有符合条件的物品
         * 
         * @param {{ (item: ItemBase<IItemCfg>, ...args) }} handler 检测函数
         * @param {number} [slotType=0] 格位类型
         * @param otherParams 其他参数
         * @returns {ItemBase}          符合条件的第一个物品
         *          undefined                所有道具未通过检查
         */
        public find(handler: { (item: ItemBase<IItemCfg>, ...args) }, slotType: number = 0, ...otherParams) {
            let slotInfo = this.bySlotType[slotType];
            if (!slotInfo) {
                ThrowError("无法找到指定的格位数据");
                return;
            }

            let end = slotInfo.lock;
            let bySlot = this.bySlot;
            for (let i = slotInfo.begin; i < end; i++) {
                let item = bySlot[i];
                if (handler(item, ...otherParams)) {
                    return item;
                }
            }
            return;
        }
    }
}