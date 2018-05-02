namespace jy {
    /**
     * 带坐骑动作的UnitAction基类
     * @author 3tion
     */
    export class MUnitAction extends UnitAction {

    	/**
    	 * 动作序列<br/>
    	 * 如果没有对应动作，Unit，强制使用有动作的坐骑类型，并切换动作
    	 * Key      MountType<br/>
    	 * Value    动作的唯一标识<br/>
    	 */
        protected actions: { [index: number]: IUnitActionInfo };

        constructor() {
            super();
        }

        getAction(mountType: MountType): IUnitActionInfo {
            if (mountType in this.actions) {
                return this.actions[mountType];
            }
            return UnitAction.defaultAction;
        }
    }
}