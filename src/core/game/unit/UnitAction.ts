module junyou {

    /**
     * 骑乘状态
     */
    export const enum MountType {
        /**
         * 在地面上
         */
        ground = 0,
        /**
         * 在坐骑上
         */
        ride = 1
    }

    /**
     * 动作类型
     */
    export const enum ActionType {
        /**
         * 待机
         */
        standBy = 0,
        /**
         * 移动
         */
        move = 1,
        /**
         * 攻击
         */
        attack = 2,
        /**
         * 跳
         */
        jump = 3
    }

	/**
	 * 单位动作
	 * @author 3tion
	 *
	 */
    export class UnitAction {

        static defaultAction = { mountType: MountType.ground, action: 0 };

        /**
         * 根据坐骑状态，获取人物动作序列的配置
         * 
         * @param {MountType} mountType 坐骑状态
         * @returns {IUnitActionInfo} 动作结果
         */
        public getAction(mountType: MountType): IUnitActionInfo {
            return UnitAction.defaultAction;
        }

        /**
         * 单位播放动作
         * 如果子类要制作动态的自定义动作，重写此方法
         * @param {Unit} unit               单位
         * @param {MountType} mountType     骑乘状态
         * @param {number} now              时间戳
         */
        public playAction(unit: Unit, mountType: MountType, now: number) {
            var aData = this.getAction(mountType);
            if (aData) {
                unit.setMountType(aData.mountType);
                unit.doAction(now, aData.action);
            } else {
                ThrowError(`未实现动作{mountType:${mountType}}`);
            }
        }

        /**
         * 播放动作
         */
        public start(unit: Unit, now: number) {
            this._isEnd = false;
        }

        /**
         * 动作执行数据计算<br/>
         * 如更新单位坐标等
         */
        public doData(unit: Unit, now: number) {
        }

        /**
         * 检查当前动作是否可以结束<br/>
         * @return true 可以结束<br/>
         *         false 不可结束
         */
        public get canStop(): Boolean {
            return true;
        }


        /**
         * 强制结束
         */
        public terminate() {

        }

        /**
         * 动画播放结束的回调
         */
        public playComplete(unit: Unit, now: number) {
            this._isEnd = true;
        }

        protected _isEnd: Boolean;

        /**
         * 动作是否已经结束
         * @return true，动作已经结束，可以做下一个动作<br/>
         *         false, 动作未结束，
         */
        public get isEnd(): Boolean {
            return this._isEnd;
        }

        /**
         * 执行事件
         */
        dispatchEvent(unit: Unit, eventType: string, now: number) {

        }

        /**
         * 渲染时执行
         */
        doRender(unit: Unit, now: number) {

        }

        public recycle() {
            this._isEnd = true;
        }
    }
}